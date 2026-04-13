import { test, expect } from '@playwright/test'

test.describe('Tenant Management', () => {
  const testTenant = {
    firstName: 'Marie',
    lastName: 'Martin',
    email: `marie.martin.${Date.now()}@example.com`,
    phone: '0612345678',
    city: 'Paris',
    postalCode: '75011',
    addressLine1: '15 Rue de la Bastille',
  }

  async function registerAndGoToTenants(page: any) {
    const uniqueEmail = `e2e.ten.${Date.now()}@rentready.io`
    await page.goto('/register')
    await page.fill('[id="firstName"]', 'Tenant')
    await page.fill('[id="lastName"]', 'Owner')
    await page.fill('[id="email"]', uniqueEmail)
    await page.fill('[id="password"]', 'TestPassword123!')
    await page.fill('[id="confirmPassword"]', 'TestPassword123!')
    await page.click('[type="submit"]')
    await page.waitForURL('**/dashboard**', { timeout: 20_000 })
    await page.goto('/tenants')
  }

  test.beforeEach(async ({ page }) => {
    await registerAndGoToTenants(page)
  })

  test('tenants page loads with empty state', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /locataires/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /ajouter un locataire/i })).toBeVisible()
  })

  test('can add a new tenant', async ({ page }) => {
    await page.getByRole('button', { name: /ajouter un locataire/i }).click()

    // Dialog should open
    await expect(page.getByText(/nouveau locataire|ajouter un locataire/i)).toBeVisible({ timeout: 5000 })

    // Fill in tenant form
    await page.fill('[id="firstName"]', testTenant.firstName)
    await page.fill('[id="lastName"]', testTenant.lastName)
    await page.fill('[id="email"]', testTenant.email)
    await page.fill('[id="phone"]', testTenant.phone)
    await page.fill('[id="addressLine1"]', testTenant.addressLine1)
    await page.fill('[id="city"]', testTenant.city)
    await page.fill('[id="postalCode"]', testTenant.postalCode)

    // Submit
    await page.getByRole('button', { name: /créer|ajouter|enregistrer/i }).click()

    // Tenant should appear in the list
    await expect(page.getByText(`${testTenant.firstName} ${testTenant.lastName}`)).toBeVisible({ timeout: 10_000 })
  })

  test('tenant detail page loads', async ({ page }) => {
    // First create a tenant
    await page.getByRole('button', { name: /ajouter un locataire/i }).click()
    await expect(page.getByText(/nouveau locataire/i)).toBeVisible({ timeout: 5000 })
    await page.fill('[id="firstName"]', testTenant.firstName)
    await page.fill('[id="lastName"]', testTenant.lastName)
    await page.fill('[id="email"]', testTenant.email)
    await page.getByRole('button', { name: /créer|ajouter/i }).click()
    await expect(page.getByText(`${testTenant.firstName} ${testTenant.lastName}`)).toBeVisible({ timeout: 10_000 })

    // Click tenant to view detail
    await page.getByText(`${testTenant.firstName} ${testTenant.lastName}`).click()
    await page.waitForURL(/\/tenants\/[^/]+$/, { timeout: 10_000 })

    // Detail page should show tenant name
    await expect(page.getByRole('heading', { name: /marie martin/i })).toBeVisible()
  })
})
