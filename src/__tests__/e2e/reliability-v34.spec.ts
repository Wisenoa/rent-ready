import { test, expect } from './helpers/fixtures'
import { registerTestUser, uniqueEmail } from './helpers/auth'
import { type APIRequestContext, type Page } from '@playwright/test'
import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { PDFDocument } from 'pdf-lib'
import { writeFile } from 'node:fs/promises'

const accountIds: string[] = []
const idResponse = z.object({ data: z.object({ id: z.string() }) })
const context = z.object({ user: z.object({ id: z.string() }) })

async function register(page: Page, prefix: string) {
  const email = uniqueEmail(`v34.${prefix}`)
  await registerTestUser(page, email)
  const session = context.parse(await (await page.request.get('/api/auth/get-session')).json())
  accountIds.push(session.user.id)
  return session.user.id
}
async function postId(request: APIRequestContext, url: string, data: object) {
  const response = await request.post(url, { data })
  expect(response.status(), `${url}: ${await response.text()}`).toBe(201)
  return idResponse.parse(await response.json()).data.id
}
async function rental(request: APIRequestContext, suffix: string) {
  const propertyId = await postId(request, '/api/properties', { name: `Logement ${suffix}`, type: 'APARTMENT', addressLine1: '12 rue du Test', city: 'Paris', postalCode: '75011' })
  const tenantId = await postId(request, '/api/tenants', { firstName: 'Camille', lastName: suffix, email: `camille.${suffix}@example.test`, addressLine1: '12 rue du Test', city: 'Paris', postalCode: '75011' })
  const now = new Date()
  const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
  const leaseId = await postId(request, '/api/leases', { propertyId, tenantId, rentAmount: 850, chargesAmount: 70, depositAmount: 850, paymentDay: 5, startDate })
  const period = await prisma.transaction.findFirstOrThrow({ where: { leaseId, paidAt: null } })
  return { propertyId, tenantId, leaseId, period }
}
async function pay(request: APIRequestContext, rentalData: Awaited<ReturnType<typeof rental>>, amount: number) {
  const { period, leaseId } = rentalData
  return postId(request, '/api/payments', { leaseId, duePeriodId: period.id, amount, periodStart: period.periodStart.toISOString(), periodEnd: period.periodEnd.toISOString(), dueDate: period.dueDate.toISOString(), paidAt: new Date().toISOString(), paymentMethod: 'TRANSFER' })
}

test.beforeAll(() => {
  const db = new URL(process.env.DATABASE_URL ?? '')
  const app = new URL(process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3003')
  if (!['localhost', '127.0.0.1'].includes(db.hostname) || !/^\/(lokna_v34|rentready_test_\w+)$/.test(db.pathname) || !['localhost', '127.0.0.1'].includes(app.hostname)) {
    throw new Error('V3.4 browser tests require a disposable local QA database and application')
  }
})
test.afterAll(async () => {
  await prisma.user.deleteMany({ where: { id: { in: accountIds } } })
})

test('trial is assigned at signup and never renewed by login or billing', async ({ page }) => {
  const id = await register(page, 'trial')
  const initial = await prisma.user.findUniqueOrThrow({ where: { id } })
  expect(initial.trialEndsAt).not.toBeNull()
  expect(initial.trialEndsAt!.getTime() - initial.createdAt.getTime()).toBeGreaterThan(13.99 * 86400000)
  for (const status of ['EXPIRED', 'PAST_DUE', 'CANCELLED', 'ACTIVE', 'TRIAL'] as const) {
    await prisma.user.update({ where: { id }, data: { subscriptionStatus: status } })
    const response = await page.request.post('/api/properties', { data: { name: 'Incomplete request' } })
    // Valid entitlement reaches validation (400); blocked entitlement is denied first (403).
    expect(response.status()).toBe(['ACTIVE', 'TRIAL'].includes(status) ? 400 : 403)
    await page.goto('/properties')
    await expect(page).toHaveURL(['ACTIVE', 'TRIAL'].includes(status) ? /\/properties$/ : /\/billing/)
  }
  await prisma.user.update({ where: { id }, data: { trialEndsAt: new Date(0) } })
  expect((await page.request.post('/api/properties', { data: {} })).status()).toBe(403)
  await page.goto('/billing')
  expect((await prisma.user.findUniqueOrThrow({ where: { id } })).trialEndsAt?.getTime()).toBe(0)
})

test('two rentals retain independent balances and a real partial/full PDF history', async ({ page }, testInfo) => {
  test.slow()
  const id = await register(page, 'portfolio')
  await prisma.user.update({ where: { id }, data: { firstName: 'Marie', lastName: 'Bailleur', addressLine1: '1 rue du Test', city: 'Paris', postalCode: '75001' } })
  const one = await rental(page.request, 'Un')
  const two = await rental(page.request, 'Deux')
  await prisma.transaction.update({ where: { id: two.period.id }, data: { dueDate: new Date(Date.now() - 7 * 86400000) } })
  const first = await pay(page.request, one, 500)
  const remaining = await prisma.transaction.findUniqueOrThrow({ where: { id: one.period.id } })
  expect(remaining.amount.toFixed(2)).toBe('420.00')
  await page.goto('/dashboard')
  await expect(page.getByText('Loyers perçus', { exact: true }).locator('..')).toContainText('500,00')
  await expect(page.getByText('Reste à percevoir', { exact: true }).locator('..')).toContainText('1 340,00')
  expect((await prisma.transaction.findUniqueOrThrow({ where: { id: two.period.id } })).amount.toFixed(2)).toBe('920.00')
  const partial = await page.request.post(`/api/transactions/${first}/receipt`)
  expect(partial.status()).toBe(200)
  const partialRow = await prisma.transaction.findUniqueOrThrow({ where: { id: first } })
  expect(partialRow.receiptType).toBe('RECU')
  const archived = await page.request.get(`/api/transactions/${first}/receipt/download`)
  const partialBytes = await archived.body()
  expect(archived.status()).toBe(200)
  expect(partialBytes.subarray(0, 5).toString()).toBe('%PDF-')
  expect((await PDFDocument.load(partialBytes)).getPageCount()).toBe(1)
  await writeFile(testInfo.outputPath('partial.pdf'), partialBytes)
  const second = await pay(page.request, one, 420)
  expect((await page.request.post(`/api/transactions/${second}/receipt`)).status()).toBe(200)
  expect((await page.request.post(`/api/transactions/${second}/receipt`)).status()).toBe(200)
  expect(await prisma.document.count({ where: { transactionId: second } })).toBe(1)
  expect((await prisma.transaction.findUniqueOrThrow({ where: { id: second } })).receiptType).toBe('QUITTANCE')
  const fullBytes = await (await page.request.get(`/api/transactions/${second}/receipt/download`)).body()
  expect((await PDFDocument.load(fullBytes)).getPageCount()).toBe(1)
  await writeFile(testInfo.outputPath('full.pdf'), fullBytes)
  expect(await (await page.request.get(`/api/transactions/${first}/receipt/download`)).body()).toEqual(partialBytes)
  await page.goto('/billing')
  await expect(page.getByRole('row').filter({ hasText: 'Logement Un' }).filter({ hasText: 'Payé' })).toHaveCount(1)
  await expect(page.getByRole('row').filter({ hasText: 'Logement Deux' })).toContainText('En retard')
  // No external email is attempted: the local QA runner clears the provider key.
  const reminder = await page.request.post('/api/email/send-rent-reminder', { data: { transactionId: two.period.id, tone: 'friendly' } })
  expect(reminder.ok()).toBe(false)
  expect(await reminder.json()).not.toHaveProperty('success', true)
  for (const width of [375, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/dashboard')
    await expect(page.getByText('Loyers perçus', { exact: true }).locator('..')).toContainText('920,00')
    await expect(page.getByText('Reste à percevoir', { exact: true }).locator('..')).toContainText('920,00')
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await page.screenshot({ path: `test-results/v34-dashboard-${width}.png`, fullPage: true })
    await page.goto('/billing')
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
    await page.screenshot({ path: `test-results/v34-billing-${width}.png`, fullPage: true })
    await page.goto('/properties')
    await page.getByRole('button', { name: 'Ajouter un bien', exact: true }).first().click()
    const dialog = page.getByRole('dialog')
    await expect(dialog.getByLabel(/^nom/i)).toBeVisible()
    await expect(dialog.getByLabel(/^adresse/i)).toBeVisible()
    await page.keyboard.press('Tab')
    expect(await dialog.evaluate(node => node.contains(document.activeElement))).toBe(true)
    await page.screenshot({ path: `test-results/v34-form-${width}.png`, fullPage: true })
    await page.keyboard.press('Escape')
  }
})

test('another landlord cannot read, mutate, email or download owned resources', async ({ page, browser }) => {
  test.slow()
  await register(page, 'owner')
  const owned = await rental(page.request, 'Securite')
  // Separate visitor identity; production auth throttling stays enabled.
  const stranger = await browser.newContext({ extraHTTPHeaders: { 'x-forwarded-for': '192.0.2.34' } })
  const other = await stranger.newPage()
  await other.addInitScript(() => { localStorage.setItem('lokna_cookie_consent', 'rejected'); localStorage.setItem('lokna_cookie_consent_at', String(Date.now())) })
  await register(other, 'stranger')
  expect((await other.request.get(`/api/properties/${owned.propertyId}`)).status()).toBe(404)
  expect((await other.request.delete(`/api/properties/${owned.propertyId}`)).status()).toBe(404)
  expect((await other.request.get(`/api/transactions/${owned.period.id}/receipt/download`)).status()).toBe(404)
  expect((await other.request.post('/api/email/send-rent-reminder', { data: { transactionId: owned.period.id } })).status()).toBe(404)
  expect((await other.request.post('/api/email/send-lease-expiry', { data: { leaseId: owned.leaseId } })).status()).toBe(404)
  expect((await other.request.post('/api/email/send-tenant-invitation', { data: { tenantId: owned.tenantId, portalUrl: 'https://evil.example/portal/token' } })).status()).toBe(404)
  expect((await page.request.delete(`/api/tenants/${owned.tenantId}`)).status()).toBe(409)
  expect(await prisma.lease.count({ where: { id: owned.leaseId } })).toBe(1)
  await stranger.close()
})

test('forgotten-password failure is explicit and an invalid token cannot reset a password', async ({ page }) => {
  await page.goto('/forgot-password')
  await page.getByLabel('Adresse email').fill('unknown@example.test')
  await page.getByRole('button', { name: 'Demander un lien' }).click()
  await expect(page.getByRole('alert').filter({ hasText: 'indisponible' })).toBeVisible()
  await page.goto('/reset-password?token=invalid-local-token')
  await page.getByLabel('Nouveau mot de passe').fill('NewLocalPassword!2026')
  await page.getByRole('button', { name: 'Enregistrer le mot de passe' }).click()
  await expect(page.getByRole('alert').filter({ hasText: 'invalide ou expiré' })).toBeVisible()
})
