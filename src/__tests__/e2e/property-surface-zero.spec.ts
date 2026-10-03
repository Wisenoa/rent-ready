import { test, expect } from './helpers/fixtures'
import { registerTestUser, uniqueEmail } from './helpers/auth'

// Creating a property without a surface is a legal and common case: 0 m2 is not a
// surface, and the form's default must not block the creation. The unit test
// (property-form-defaults.test.ts) covers the schema; this one covers the browser
// path, because the dialog never rendered `errors.surface` — the user saw a form
// that silently refused to submit, with no visible reason.
test.describe('creer un bien sans surface', () => {
  for (const surface of ['0.0', '0.00', '.0', '00', '']) {
    test(`surface=${JSON.stringify(surface)} cree le bien`, async ({ page }) => {
      await registerTestUser(page, uniqueEmail('e2e.surface'))

      const name = `Studio zero ${surface || 'vide'}-${Date.now()}`
      await page.goto('/properties')
      await page.getByRole('button', { name: 'Ajouter un bien', exact: true }).first().click()
      await page.locator('#name').fill(name)
      await page.locator('#addressLine1').fill('12 Rue de Rivoli')
      await page.locator('#city').fill('Lyon')
      await page.locator('#postalCode').fill('69001')
      await page.locator('#surface').fill(surface)

      await page.getByRole('dialog').getByRole('button', { name: /^ajouter$/i }).click()

      await page.getByText(name, { exact: false }).first().waitFor({ timeout: 15_000 })
      await expect(page.getByText(name, { exact: false }).first()).toBeVisible()
    })
  }

  test('le defaut intact cree le bien', async ({ page }) => {
    await registerTestUser(page, uniqueEmail('e2e.surface'))

    const name = `Studio defaut-${Date.now()}`
    await page.goto('/properties')
    await page.getByRole('button', { name: 'Ajouter un bien', exact: true }).first().click()
    await page.locator('#name').fill(name)
    await page.locator('#addressLine1').fill('12 Rue de Rivoli')
    await page.locator('#city').fill('Lyon')
    await page.locator('#postalCode').fill('69001')

    await page.getByRole('dialog').getByRole('button', { name: /^ajouter$/i }).click()
    await page.getByText(name, { exact: false }).first().waitFor({ timeout: 15_000 })
    await expect(page.getByText(name, { exact: false }).first()).toBeVisible()
  })
})