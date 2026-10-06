import { test, expect } from './helpers/fixtures'
import { registerTestUser, uniqueEmail } from './helpers/auth'

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

  /**
   * Fill the tenant dialog completely.
   *
   * The form REQUIRES adresse, ville and code postal — it refuses to submit
   * otherwise and says so in French in place. Three of these tests filled only
   * the first three fields, so the dialog stayed open and the test then failed
   * looking for a tenant that was never created. The product was right; the
   * fixture was incomplete.
   */
  async function fillTenantDialog(page: any) {
    const dialog = page.getByRole('dialog')
    await dialog.locator('#firstName').fill(testTenant.firstName)
    await dialog.locator('#lastName').fill(testTenant.lastName)
    await dialog.locator('#email').fill(testTenant.email)
    await dialog.locator('#phone').fill(testTenant.phone)
    await dialog.locator('#addressLine1').fill(testTenant.addressLine1)
    await dialog.locator('#city').fill(testTenant.city)
    await dialog.locator('#postalCode').fill(testTenant.postalCode)
    return dialog.locator('button[type="submit"]')
  }

  async function registerAndGoToTenants(page: any) {
    const accountEmail = uniqueEmail('ten')
        await registerTestUser(page, accountEmail)
    await page.goto('/tenants')
  }

  test.beforeEach(async ({ page }) => {
    await registerAndGoToTenants(page)
  })

  test('tenants page loads with empty state', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /locataires/i })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Ajouter un locataire', exact: true }).first()).toBeVisible()
  })

  test('can add a new tenant', async ({ page }) => {
    await page.getByRole('button', { name: 'Ajouter un locataire', exact: true }).first().click()

    // Fill in tenant form
    await fillTenantDialog(page)

    // Submit — scoped to the dialog and to `type="submit"`. The trigger is also
    // called « Ajouter un locataire » and the dialog holds « Annuler » next to
    // « Ajouter », so a page-wide regex matched three elements and Playwright's
    // strict mode refused to choose.
    await page.getByRole('dialog').locator('button[type="submit"]').click()

    // Tenant should appear in the list
    await expect(page.getByText(`${testTenant.firstName} ${testTenant.lastName}`)).toBeVisible({ timeout: 10_000 })
  })

  test('tenant detail page loads', async ({ page }) => {
    // First create a tenant
    await page.getByRole('button', { name: 'Ajouter un locataire', exact: true }).first().click()
    const submitTenant = await fillTenantDialog(page)
    await submitTenant.click()
    await expect(page.getByText(`${testTenant.firstName} ${testTenant.lastName}`)).toBeVisible({ timeout: 10_000 })

    // Click the CARD, not the name text. The row's onClick cancels navigation
    // when the click lands on a nested <a> or <button> — and the card holds a
    // « Dernier reçu » link — so clicking the name could hit one and do nothing.
    //
    // Href read first: an empty list would make `.first()` point at nothing and
    // the failure would read as « no navigation » instead of « no tenant ».
    const card = page.locator('a[href^="/tenants/"]').first()
    await expect(card).toBeVisible({ timeout: 10_000 })
    const href = await card.getAttribute('href')
    expect(href).toMatch(/^\/tenants\/.+/)

    // Click the NAME, inside the card. The row's onClick cancels navigation when
    // the target is inside a nested <a>, <button> or role="button"; the card
    // carries edit and delete buttons, and its top-left corner is the initials
    // avatar. The name is the part of the card that is plainly the link.
    await card.getByText(`${testTenant.firstName} ${testTenant.lastName}`).click()
    await page.waitForURL(/\/tenants\/[^/]+$/, { timeout: 15_000 })

    // Detail page should show tenant name
    await expect(page.getByRole('heading', { name: /marie martin/i })).toBeVisible()
  })
})
