import { test, expect } from '@playwright/test'

import { uniqueEmail, registerTestUser } from './helpers/auth'

/**
 * « Commencer la configuration » — the primary call to action on an empty
 * /properties — did nothing.
 *
 * `useOnboardingWizard` keeps `wizardOpen` in plain `useState`, so each caller
 * gets its own copy. `<OnboardingWizardV2>` was rendered in exactly one place:
 * inside `<OnboardingTrigger>`, mounted only on /dashboard, and returning `null`
 * as soon as the account owns a property.
 *
 * /properties, /tenants and /leases each called the hook, so `startWizard()`
 * flipped a flag on their own instance that nothing read. The dialog the button
 * was supposed to open was never rendered on those pages. The feature looked
 * alive because it does work on the dashboard.
 *
 * This is the regression: a primary CTA that opens nothing is indistinguishable
 * from a broken product, and no unit test can see it.
 */
test.describe('assistant de configuration', () => {
  test('le CTA principal de /properties ouvre le guide', async ({ page }) => {
    await registerTestUser(page, uniqueEmail('wizard.cta'))

    // The wizard auto-opens for a brand-new account, so the dismissal flag has to
    // be cleared first or the assertion would pass without the click doing
    // anything — the same false pass that hid this bug.
    await page.evaluate(() => localStorage.clear())

    await page.goto('/properties')
    const cta = page.getByRole('button', { name: /commencer la configuration/i })
    await expect(cta).toBeVisible()

    const before = await page.getByRole('dialog').count()
    await cta.click()
    await page.waitForTimeout(1_000)
    const after = await page.getByRole('dialog').count()

    expect(
      after,
      `le clic n'a ouvert aucun dialogue (${before} avant, ${after} apres)`
    ).toBeGreaterThan(before)
  })

  test("le guide ne s'ouvre pas tout seul sur /properties", async ({ page }) => {
    // `autoOpen` is for the dashboard only. On any other page it would ambush a
    // user who came to add a second property.
    await registerTestUser(page, uniqueEmail('wizard.auto'))
    await page.evaluate(() => localStorage.clear())

    await page.goto('/properties')
    await page.waitForTimeout(1_500)
    expect(await page.getByRole('dialog').count()).toBe(0)
  })
})
