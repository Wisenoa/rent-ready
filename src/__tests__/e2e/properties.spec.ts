import { test, expect } from './helpers/fixtures'
import { registerTestUser, loginTestUser } from './helpers/auth'

test.describe('Property Management', () => {
  const testProperty = {
    name: 'Appartement Paris 11e',
    type: 'APARTMENT',
    addressLine1: '12 Rue de la Roquette',
    city: 'Paris',
    postalCode: '75011',
    surface: 45,
    rooms: 2,
  }

  test.beforeEach(async ({ page }) => {
    // Register and login before each property test
    const uniqueEmail = `e2e.prop.${Date.now()}@rentready.io`
        await registerTestUser(page, uniqueEmail)
  })

  test('properties page loads with empty state', async ({ page }) => {
    await page.goto('/properties')
    await expect(page.getByRole('heading', { name: /mes biens/i })).toBeVisible()
    // Empty state should show "Ajouter un bien" button
    await expect(page.getByRole('button', { name: 'Ajouter un bien', exact: true }).first()).toBeVisible()
  })

  test('can create a new property', async ({ page }) => {
    await page.goto('/properties')

    // Click "Ajouter un bien" button to open the dialog
    await page.getByRole('button', { name: 'Ajouter un bien', exact: true }).first().click()

    // Dialog should open.
    // Scoped to the dialog role, NOT matched by text: /nouveau bien|ajouter un
    // bien/i resolved to four elements (the trigger button, « Ajouter un bien
    // manuellement » in the empty state, the dialog title and its description),
    // and strict mode refuses an ambiguous match. `getByText` also walks
    // aria-hidden subtrees, so the surrounding page stays in scope; the dialog
    // role is what the assertion actually means.
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 })

    // Fill in property form
    await page.fill('[id="name"]', testProperty.name)
    await page.fill('[id="addressLine1"]', testProperty.addressLine1)
    await page.fill('[id="city"]', testProperty.city)
    await page.fill('[id="postalCode"]', testProperty.postalCode)
    await page.fill('[id="surface"]', String(testProperty.surface))
    await page.fill('[id="rooms"]', String(testProperty.rooms))

    // Submit form
    await page.getByRole('button', { name: /créer|ajouter|enregistrer/i }).click()

    // Should see success feedback and property in list
    await expect(page.getByText(testProperty.name)).toBeVisible({ timeout: 10_000 })
  })

  test('property detail page loads after creation', async ({ page }) => {
    // Create property first
    await page.goto('/properties')
    await page.getByRole('button', { name: 'Ajouter un bien', exact: true }).first().click()
    // Left as a text match on purpose: `/nouveau bien/i` appears only in the
    // dialog description, so it resolves to exactly one element (measured, not
    // assumed). The `|ajouter un bien` alternative on line 35 is what made that
    // assertion ambiguous, and it is what was removed.
    await expect(page.getByText(/nouveau bien/i)).toBeVisible({ timeout: 5000 })
    await page.fill('[id="name"]', testProperty.name)
    await page.fill('[id="addressLine1"]', testProperty.addressLine1)
    await page.fill('[id="city"]', testProperty.city)
    await page.fill('[id="postalCode"]', testProperty.postalCode)
    await page.getByRole('button', { name: /créer|ajouter/i }).click()
    await expect(page.getByText(testProperty.name)).toBeVisible({ timeout: 10_000 })

    // Click on the property to view detail.
    //
    // `getByText` resolves to exactly one element — the `card-title` div nested
    // inside the card's `<Link>` — measured, not assumed. The click therefore
    // bubbles to the link and navigates; the target was never the problem.
    await page.getByText(testProperty.name).click()
    //
    // The flakiness was the TIMEOUT, not the click and not the wait primitive.
    // `/properties/[id]` is compiled on demand by the dev server, and that first
    // compile was measured at 14.0s end-to-end (server log: `Compiled
    // /properties/[id] in 10.7s`, request served in 14024ms) with every other
    // route already warm — larger than the 10s this line allowed. On an idle
    // machine the same cold compile is ~1.6s, so whether the old 10s budget was
    // enough depended on machine load: that is precisely why it looked "flaky
    // one time in two" rather than reliably broken.
    //
    // The server does answer; the budget just expired while it was still
    // compiling, so the retry then passed.
    //
    // `expect(...).toHaveURL` rather than `page.waitForURL`: it asserts the URL
    // state and re-polls, where `waitForURL` can only wait once and give up.
    // The 45s covers the cold compile; measured warm, this resolves in ~500ms.
    await expect(page).toHaveURL(/\/properties\/[^/]+$/, { timeout: 45_000 })

    // Detail page should show property name
    await expect(page.getByRole('heading', { name: testProperty.name })).toBeVisible()
  })
})
