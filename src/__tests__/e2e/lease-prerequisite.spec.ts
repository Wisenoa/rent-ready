import { test, expect } from '@playwright/test'

import { uniqueEmail, registerTestUser } from './helpers/auth'

/**
 * « Créer un bail » with no property and no tenant did nothing, and said nothing.
 *
 * The submit button was disabled whenever `properties.length === 0 ||
 * tenants.length === 0`, with nothing on screen explaining why. A disabled button
 * submits nothing, so the form's own validation never ran either — the error copy
 * for `propertyId` and `tenantId` existed and could not appear.
 *
 * The user got a dialog they could click at repeatedly with no result and no
 * feedback, which reads as a broken application rather than a missing
 * prerequisite.
 */
test.describe('un bail exige un bien et un locataire', () => {
  test('le formulaire explique pourquoi la creation est indisponible', async ({
    page,
  }) => {
    await registerTestUser(page, uniqueEmail('lease.prereq'))
    // Clear the dismissal flag, or the wizard would already be open and the
    // dialog we are about to assert on would not be the one under test.
    await page.evaluate(() => localStorage.clear())

    await page.goto('/properties')
    await page.getByRole('button', { name: /cr[ée]er un bail/i }).first().click()

    const submit = page
      .getByRole('dialog')
      .getByRole('button', { name: /cr[ée]er le bail/i });
    await expect(submit).toBeVisible();

    // Correctly disabled — you genuinely cannot create a lease yet.
    await expect(submit).toBeDisabled();

    // And the reason is on screen, naming the next step.
    const reason = page.getByTestId('lease-prerequisite');
    await expect(reason).toBeVisible();
    await expect(reason).toContainText(/ajoutez d'abord un bien/i);
  });
});
