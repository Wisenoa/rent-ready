import { test, expect } from '@playwright/test'

import {
  uniqueEmail,
  registerTestUser,
  createProperty,
  createTenant,
} from './helpers/auth'

/**
 * The lease dialog's two Selects displayed the row's CUID once a choice was made.
 *
 * Measured in the browser, before the fix:
 *
 *   before selection  "Sélectionner un bien"
 *   after selection   "cmuu2gpot000a7dmsip294u8h"
 *
 * base-ui resolves a closed trigger's text from the `items` prop. Without it the
 * trigger falls back to the raw value, which here is the primary key.
 *
 * In the middle of the core flow that is worse than untidy: the landlord picks a
 * property and the field then shows an opaque identifier, so they cannot tell
 * whether they picked the right one before saving a lease against it.
 */
test.describe('les listes deroulantes affichent des libelles', () => {
  test('bien et locataire sont nommes apres selection', async ({ page }) => {
    await registerTestUser(page, uniqueEmail('select.label'))
    await page.evaluate(() => localStorage.clear())

    await createProperty(page, {
      name: 'Studio Lyon',
      addressLine1: '8 Rue de la République',
      city: 'Lyon',
      postalCode: '69001',
    })
    await createTenant(page, { firstName: 'Pierre', lastName: 'Durand' })

    await page.goto('/properties')
    await page.getByRole('button', { name: /cr[ée]er un bail/i }).first().click()
    const dialog = page.getByRole('dialog')

    await expect(dialog.locator('#propertyId')).toHaveText(/sélectionner un bien/i);

    await dialog.locator('#propertyId').click();
    await page.getByRole('option', { name: /studio lyon/i }).click();
    await expect(dialog.locator('#propertyId')).toHaveText(/Studio Lyon/i);

    await dialog.locator('#tenantId').click();
    await page.getByRole('option', { name: /pierre durand/i }).click();
    await expect(dialog.locator('#tenantId')).toHaveText(/Pierre Durand/i);

    // The regression in one assertion: a cuid is 25 lowercase alphanumerics
    // starting with "c". A name never looks like that.
    for (const id of ['#propertyId', '#tenantId']) {
      const text = (await dialog.locator(id).innerText()).trim();
      expect(text, `${id} shows a database id`).not.toMatch(/^c[a-z0-9]{20,}$/i);
    }
  });
});
