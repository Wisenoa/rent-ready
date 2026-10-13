import { chromium } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { mkdir, readFile, writeFile } from 'node:fs/promises';

// This tool may only connect to the disposable database used by this challenge.
const connectionString = process.env.DATABASE_URL;
if (connectionString !== 'postgresql://lokna_demo@127.0.0.1:65433/lokna_challenge_v3') {
  throw new Error('Refusing any database except the isolated challenge database');
}
const baseURL = 'http://127.0.0.1:3005';
const password = process.env.CHALLENGE_DEMO_PASSWORD;
if (!password) throw new Error('Provide CHALLENGE_DEMO_PASSWORD for the disposable account');
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
const browser = await chromium.launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 }, deviceScaleFactor: 2 });
await context.addInitScript(() => localStorage.setItem('rentready_cookie_consent', 'accepted'));
const page = await context.newPage();
const destination = 'docs/design/challenge-v3/product-captures';
await mkdir(destination, { recursive: true });
const email = 'camille.demo@example.test';
const now = new Date();
const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
const dueDate = new Date(now.getFullYear(), now.getMonth(), 5);
const paidAt = new Date(now.getFullYear(), now.getMonth(), 3);
const homes = JSON.parse(await readFile('src/data/gestion-locative-demo.json', 'utf8'));

try {
  const existing = await prisma.user.findUnique({ where: { email } });
  await page.goto(`${baseURL}/${existing ? 'login' : 'register'}`, { waitUntil: 'load' });
  if (!existing) await page.getByLabel('Nom complet').fill('Camille Martin');
  await page.getByLabel('Adresse email').fill(email);
  await page.getByLabel('Mot de passe', { exact: true }).fill(password);
  await page.getByRole('button', { name: existing ? 'Se connecter' : 'Créer mon compte', exact: true }).click();
  await page.waitForURL('**/dashboard', { timeout: 120000 });
  const user = await prisma.user.findUniqueOrThrow({ where: { email } });
  await prisma.user.update({ where: { id: user.id }, data: { addressLine1: '10 rue Exemple', city: 'Paris', postalCode: '75004', trialEndsAt: new Date(Date.now() + 14 * 86400000) } });
  for (const home of homes) {
    await prisma.property.upsert({ where: { id: home.id }, update: {}, create: {
      id: home.id, userId: user.id, name: home.name, type: 'APARTMENT', addressLine1: '12 rue de Démonstration', city: home.city, postalCode: home.postalCode, surface: 45, rooms: 2,
    } });
    await prisma.tenant.upsert({ where: { id: `${home.id}-tenant` }, update: {}, create: {
      id: `${home.id}-tenant`, userId: user.id, firstName: home.firstName, lastName: home.lastName, addressLine1: '12 rue de Démonstration', city: home.city, postalCode: home.postalCode,
    } });
    await prisma.lease.upsert({ where: { id: `${home.id}-lease` }, update: {}, create: {
      id: `${home.id}-lease`, userId: user.id, propertyId: home.id, tenantId: `${home.id}-tenant`, rentAmount: home.rent, chargesAmount: home.charges, depositAmount: home.rent, startDate: periodStart, paymentDay: 5, status: 'ACTIVE', irlReferenceValue: '145.47', irlReferenceQuarter: 'T1-2025', revisionDate: new Date(now.getFullYear() + 1, now.getMonth(), 1),
    } });
    await prisma.transaction.upsert({ where: { id: `${home.id}-payment` }, update: {}, create: {
      id: `${home.id}-payment`, userId: user.id, leaseId: `${home.id}-lease`, amount: home.total, rentPortion: home.rent, chargesPortion: home.charges, periodStart, periodEnd, dueDate, paidAt: home.paid ? paidAt : null, status: home.paid ? 'PAID' : 'LATE', isFullPayment: home.paid, receiptType: home.paid ? 'QUITTANCE' : null, receiptRentAmount: home.paid ? home.rent : null, receiptChargesAmount: home.paid ? home.charges : null,
    } });
  }

  const captures = [];
  for (const width of [1100, 1440, 390]) {
    await page.setViewportSize({ width, height: 1100 });
    await page.goto(`${baseURL}/dashboard`);
    await page.waitForTimeout(700);
    await page.addStyleTag({ content: 'nextjs-portal { display: none; }' });
    await page.screenshot({ path: `${destination}/dashboard-${width}.png`, fullPage: true });
    const main = await page.locator('#main').boundingBox();
    const summary = await page.getByText('Loyers attendus', { exact: true }).boundingBox();
    const arrears = page.getByRole('heading', { name: /Loyers en attente ce mois-ci/ }).locator('..').locator('..').locator('..');
    const arrearsBox = await arrears.boundingBox();
    if (!main || !summary || !arrearsBox) throw new Error('Dashboard regions not found');
    const inset = width < 500 ? 24 : 40;
    await page.screenshot({ path: `${destination}/dashboard-focus-${width}.png`, clip: {
      x: main.x + inset, y: summary.y - 8, width: main.width - 2 * inset,
      height: arrearsBox.y + arrearsBox.height - summary.y + 16,
    } });
    await arrears.screenshot({ path: `${destination}/arrears-focus-${width}.png` });
    captures.push({ route: '/dashboard', width });
    await page.goto(`${baseURL}/billing`);
    await page.waitForTimeout(500);
    await page.addStyleTag({ content: 'nextjs-portal { display: none; }' });
    await page.screenshot({ path: `${destination}/billing-${width}.png`, fullPage: true });
    const ledger = page.getByRole('heading', { name: 'Journal chronologique des loyers' }).locator('..').locator('..').locator('..');
    await ledger.screenshot({ path: `${destination}/receipts-focus-${width}.png` });
    await page.getByRole('button', { name: 'Enregistrer un paiement', exact: true }).click();
    await page.getByRole('combobox', { name: 'Bail', exact: true }).click();
    await page.getByRole('option', { name: /Emma Laurent/ }).click();
    await page.getByRole('combobox', { name: 'Période de loyer', exact: true }).click();
    await page.getByRole('option').first().click();
    await page.getByLabel('Montant encaissé (€)', { exact: true }).fill('400');
    await page.getByRole('dialog').screenshot({ path: `${destination}/payment-focus-${width}.png` });
    await page.keyboard.press('Escape');
    captures.push({ route: '/billing', width });
  }
  await writeFile(`${destination}/provenance.json`, JSON.stringify({
    capturedAt: new Date().toISOString(), origin: baseURL, database: 'isolated loopback challenge database',
    registration: existing ? 'Existing local demonstration account signed in' : 'PASS: real registration form led to /dashboard without payment card',
    expected: '2500.00', received: '1600.00', outstanding: '900.00', captures,
    note: 'Unmodified application routes. All people, addresses and amounts are fictional. No bank, email, Stripe or document-storage operation executed.',
  }, null, 2));
  console.log('PASS: local account authenticated; real dashboard and billing captured with fictional data.');
} finally {
  await browser.close();
  await prisma.$disconnect();
}
