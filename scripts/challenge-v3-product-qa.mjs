import { chromium, expect } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { randomUUID } from 'node:crypto';
import { writeFile } from 'node:fs/promises';

const connectionString = process.env.DATABASE_URL;
const baseURL = process.env.CHALLENGE_BASE_URL ?? 'http://127.0.0.1:3004';
if (connectionString !== 'postgresql://lokna_demo@127.0.0.1:65433/lokna_challenge_v3'
  || !['http://127.0.0.1:3004', 'http://127.0.0.1:3005'].includes(baseURL)) {
  throw new Error('This verification only runs against the disposable local challenge environment');
}
if (!process.env.CHALLENGE_DEMO_PASSWORD) throw new Error('Provide CHALLENGE_DEMO_PASSWORD');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
const browser = await chromium.launch();
const context = await browser.newContext();
await context.addInitScript(() => localStorage.setItem('rentready_cookie_consent', 'accepted'));
const page = await context.newPage();
const destination = 'docs/design/challenge-v3/product-captures';

try {
  const email = `qa-${randomUUID()}@example.test`;
  await page.goto(`${baseURL}/gestion-locative`, { waitUntil: 'networkidle' });
  await page.getByRole('link', { name: /Essayer Lokna/ }).click();
  await page.waitForURL('**/register', { timeout: 120000 });
  await page.getByLabel('Nom complet').fill('Compte de vérification fictif');
  await page.getByLabel('Adresse email').fill(email);
  await page.getByLabel('Mot de passe', { exact: true }).fill(randomUUID());
  await page.getByRole('button', { name: 'Créer mon compte', exact: true }).click();
  await page.waitForURL('**/dashboard', { timeout: 120000 });
  await expect(page.getByText('Ajouter mon premier logement', { exact: true })).toBeVisible({ timeout: 30000 });
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  const trialDays = user.trialEndsAt ? (user.trialEndsAt.getTime() - Date.now()) / 86400000 : null;
  const trialVerified = trialDays !== null && trialDays > 13.99 && trialDays <= 14;

  await context.clearCookies();
  await page.goto(`${baseURL}/login`, { waitUntil: 'networkidle' });
  await page.getByLabel('Adresse email').fill('camille.demo@example.test');
  await page.getByLabel('Mot de passe', { exact: true }).fill(process.env.CHALLENGE_DEMO_PASSWORD);
  await page.getByRole('button', { name: 'Se connecter', exact: true }).click();
  await page.waitForURL('**/dashboard', { timeout: 120000 });

  const downloadURL = `${baseURL}/api/transactions/v3-rivoli-payment/receipt/download`;
  const response = await page.request.get(downloadURL);
  if (response.status() !== 200 || !response.headers()['content-type']?.includes('application/pdf')) {
    throw new Error(`Receipt download failed: ${response.status()} ${await response.text()}`);
  }
  const bytes = await response.body();
  if (bytes.subarray(0, 5).toString() !== '%PDF-') throw new Error('Not a PDF');
  const repeated = await page.request.get(downloadURL);
  if (!(await repeated.body()).equals(bytes)) throw new Error('Repeated download changed the document');
  const documents = await prisma.document.count({ where: { transactionId: 'v3-rivoli-payment' } });
  if (documents !== 1) throw new Error('Receipt duplicated');
  const unpaid = await page.request.get(`${baseURL}/api/transactions/v3-cour-payment/receipt/download`);
  if (unpaid.status() !== 400) throw new Error('Unpaid rent was not refused');
  await writeFile(`${destination}/quittance-fictive.pdf`, bytes);
  const result = {
    origin: baseURL,
    registration: { status: 'PASS', workflow: '/gestion-locative → /register → /dashboard', paymentCardRequired: false },
    trialInitialization: { status: trialVerified ? 'PASS' : 'FAIL', subscriptionStatus: user.subscriptionStatus, trialDays: trialDays === null ? null : Math.round(trialDays), expectedDays: 14 },
    paidReceipt: { status: 'PASS', httpStatus: response.status(), type: 'application/pdf', bytes: bytes.length, repeatedBytesIdentical: true, archivedDocumentCount: documents },
    unpaidReceipt: { status: 'PASS', httpStatus: unpaid.status(), refused: true },
    note: 'All writes are in the disposable local database. No external Stripe, email, banking or storage operation was executed.',
  };
  await writeFile(`${destination}/product-qa.json`, JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  if (!trialVerified) process.exitCode = 1;
} finally {
  await browser.close();
  await prisma.$disconnect();
}
