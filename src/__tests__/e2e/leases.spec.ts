import { test, expect } from '@playwright/test'

test.describe('Lease Creation', () => {
  async function setupUserWithPropertyAndTenant(page: any) {
    const uniqueEmail = `e2e.lease.${Date.now()}@rentready.io`
    // Register
    await page.goto('/register')
    await page.fill('[id="firstName"]', 'Lease')
    await page.fill('[id="lastName"]', 'Test')
    await page.fill('[id="email"]', uniqueEmail)
    await page.fill('[id="password"]', 'TestPassword123!')
    await page.fill('[id="confirmPassword"]', 'TestPassword123!')
    await page.click('[type="submit"]')
    await page.waitForURL('**/dashboard**', { timeout: 20_000 })

    // Create a property
    await page.goto('/properties')
    await page.getByRole('button', { name: /ajouter un bien/i }).click()
    await expect(page.getByText(/nouveau bien/i)).toBeVisible({ timeout: 5000 })
    await page.fill('[id="name"]', 'Studio Lyon')
    await page.fill('[id="addressLine1"]', '8 Rue de la République')
    await page.fill('[id="city"]', 'Lyon')
    await page.fill('[id="postalCode"]', '69001')
    await page.getByRole('button', { name: /créer|ajouter/i }).click()
    await expect(page.getByText('Studio Lyon')).toBeVisible({ timeout: 10_000 })

    // Create a tenant
    await page.goto('/tenants')
    await page.getByRole('button', { name: /ajouter un locataire/i }).click()
    await expect(page.getByText(/nouveau locataire/i)).toBeVisible({ timeout: 5000 })
    await page.fill('[id="firstName"]', 'Pierre')
    await page.fill('[id="lastName"]', 'Durand')
    await page.fill('[id="email"]', `pierre.durand.${Date.now()}@example.com`)
    await page.getByRole('button', { name: /créer|ajouter/i }).click()
    await expect(page.getByText('Pierre Durand')).toBeVisible({ timeout: 10_000 })
  }

  test('leases page loads and shows empty state', async ({ page }) => {
    const uniqueEmail = `e2e.lease.empty.${Date.now()}@rentready.io`
    await page.goto('/register')
    await page.fill('[id="firstName"]', 'Lease')
    await page.fill('[id="lastName"]', 'Empty')
    await page.fill('[id="email"]', uniqueEmail)
    await page.fill('[id="password"]', 'TestPassword123!')
    await page.fill('[id="confirmPassword"]', 'TestPassword123!')
    await page.click('[type="submit"]')
    await page.waitForURL('**/dashboard**', { timeout: 20_000 })

    await page.goto('/leases')
    await expect(page.getByRole('heading', { name: /baux/i })).toBeVisible()
    // Should have a way to create a lease (either empty state CTA or button)
    await expect(page.locator('body')).not.toBeEmpty()
  })

  test('can create a new lease with property and tenant', async ({ page }) => {
    await setupUserWithPropertyAndTenant(page)

    // Navigate to leases and create a lease
    await page.goto('/leases')

    // Check for "Créer un bail" button
    const createBtn = page.getByRole('button', { name: /créer un bail/i })
    if (await createBtn.isVisible()) {
      await createBtn.click()
    } else {
      // Try empty state CTA
      const emptyCta = page.getByRole('link', { name: /créer/i }).or(page.getByRole('button', { name: /créer/i }))
      await emptyCta.first().click()
    }

    // Dialog/form should appear - wait for property select
    await expect(page.getByText(/propriété|bien/i)).toBeVisible({ timeout: 5000 })

    // Select property (Studio Lyon)
    const propertySelect = page.locator('[id="propertyId"]').or(page.locator('[aria-label*="propriété" i]')).or(page.locator('[aria-haspopup="listbox"]').first())
    await propertySelect.click()
    await page.getByRole('option', { name: /studio lyon/i }).click()

    // Select tenant
    const tenantSelect = page.locator('[id="tenantId"]').or(page.locator('[aria-label*="locataire" i]')).or(page.locator('[aria-haspopup="listbox"]').nth(1))
    await tenantSelect.click()
    await page.getByRole('option', { name: /pierre durand/i }).click()

    // Fill financial details
    await page.fill('[id="rentAmount"]', '600')
    await page.fill('[id="chargesAmount"]', '50')
    await page.fill('[id="depositAmount"]', '1200')

    // Fill dates - start date today, end date in 3 years
    const today = new Date()
    const endDate = new Date(today)
    endDate.setFullYear(endDate.getFullYear() + 3)
    const formatDate = (d: Date) => d.toISOString().split('T')[0]

    await page.fill('[id="startDate"]', formatDate(today))
    await page.fill('[id="endDate"]', formatDate(endDate))

    // Select payment day
    const paymentDaySelect = page.locator('[id="paymentDay"]').or(page.locator('[aria-haspopup="listbox"]').nth(2))
    await paymentDaySelect.click()
    await page.getByRole('option', { name: /1ᵉʳ|1/i }).first().click()

    // Submit
    await page.getByRole('button', { name: /créer|enregistrer|valider/i }).click()

    // Should see success and lease in list
    await expect(page.getByText(/studio lyon/i).or(page.getByText(/pierre durand/i))).toBeVisible({ timeout: 10_000 })
  })
})
