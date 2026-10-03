import { test, expect } from './helpers/fixtures'
import { registerTestUser, uniqueEmail } from './helpers/auth'

// Creating a property without a surface is a legal and common case: 0 m2 is not
// a surface, and the form's default must not block the creation. The unit test
// (property-form-defaults.test.ts) covers the schema; this one covers the browser
// path, because the dialog never rendered `errors.surface` — the user saw a form
// that silently refused to submit, with no visible reason.
//
// All the writings of zero are exercised inside ONE test, with ONE registered
// user: Better Auth's limiter allows roughly 6 auth requests per 60 s per IP and
// counts sign-up AND sign-in together, so one test per variant (~6 registrations)
// sat right on the quota and failed as a block. Isolation does not suffer: each
// iteration creates its own property, with a distinct name, under one owner.
test.describe('creer un bien sans surface', () => {
  const ZERO_WRITINGS = ['0.0', '0.00', '.0', '00', '']

  test('toute ecriture de zero est traitee comme une surface non renseignee', async ({ page }) => {
    await registerTestUser(page, uniqueEmail('e2e.surface'))

    await page.goto('/properties')

    for (const surface of [...ZERO_WRITINGS, undefined]) {
      const label = surface === undefined ? 'defaut intact' : JSON.stringify(surface)
      const name = `Studio zero ${label}-${Date.now()}`

      await page.getByRole('button', { name: 'Ajouter un bien', exact: true }).first().click()
      await page.locator('#name').fill(name)
      await page.locator('#addressLine1').fill('12 Rue de Rivoli')
      await page.locator('#city').fill('Lyon')
      await page.locator('#postalCode').fill('69001')
      // undefined = on ne touche pas le champ, il garde sa valeur par defaut.
      if (surface !== undefined) {
        await page.locator('#surface').fill(surface)
      }

      await page.getByRole('dialog').getByRole('button', { name: /^ajouter$/i }).click()

      // Le bien apparait dans la liste : la creation a reussi, silencieusement ou non.
      await expect(page.getByText(name, { exact: false }).first()).toBeVisible({
        timeout: 15_000,
      })
      await page.waitForLoadState('networkidle').catch(() => {})
    }
  })
})