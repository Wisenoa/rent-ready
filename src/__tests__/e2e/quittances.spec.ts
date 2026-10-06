import { test, expect } from './helpers/fixtures'
import {
  registerTestUser,
  createProperty,
  createTenant,
  selectOption,
  uniqueEmail,
  gotoStable,
} from './helpers/auth'

/**
 * « Marquer payé » is the one control whose feedback used to lie.
 *
 * `markTransactionPaid` records the payment BEFORE it asks for a receipt, so a
 * receipt failure cannot fail the action — the money really arrived. It can,
 * however, leave the landlord with no document. The button used to answer
 * "Paiement validé" either way, which is how the UI came to announce a receipt
 * that was never produced.
 *
 * The decision now lives in `reportMarkPaid` (src/lib/domain/quittance-outcome.ts),
 * which is unit-tested. What no test covered was the WIRE: that this button calls
 * it with the action's result. That wire only exists in the browser, so it is
 * covered here — by really clicking the button and reading the toast.
 *
 * Both payment tests below are unconditional. The previous version wrapped its
 * click in `if (count > 0) { ... } else { ... }`, so with no button on the page
 * it passed without clicking anything: the evidence of "did nothing" was
 * identical to the evidence of "succeeded". If the button is missing, the test
 * fails.
 */

/** Register, then build property + tenant + a lease that starts this month. */
async function setupLandlord(page: Parameters<typeof registerTestUser>[0]): Promise<void> {
  await registerTestUser(page, uniqueEmail('e2e.quit'))

  // `surface` and `rooms` are filled on purpose: propertySchema rejects the
  // form's own default ("0" as a string), so leaving them alone fails creation.
  // That is a real bug, tracked on t_f525a49c, not something this test should
  // hide by working around silently — the fixture states the dependency.
  await createProperty(page, {
    name: 'Appartement Receipt',
    addressLine1: '20 Rue de la Paix',
    city: 'Paris',
    postalCode: '75002',
    surface: 45,
    rooms: 2,
  })

  await createTenant(page, {
    firstName: 'Sophie',
    lastName: 'Bernard',
    email: `sophie.${Date.now()}@example.com`,
  })

  // /leases/new compiles on first request and the navigation aborts while it
  // does, so warm the route instead of a bare goto.
  await gotoStable(page, '/leases/new')
  await selectOption(page, 'propertyId', /Appartement Receipt/)
  await selectOption(page, 'tenantId', /Sophie Bernard/)

  // Starting on the 1st makes the rent schedule cover the current month, which is
  // the row that carries « Marquer payé ». Starting today can leave the period
  // undated until its due day, and the button would then not exist at all.
  const today = new Date()
  const start = new Date(today.getFullYear(), today.getMonth(), 1)
  const end = new Date(today.getFullYear() + 1, today.getMonth(), 0)
  const iso = (d: Date) => d.toISOString().slice(0, 10)

  await page.locator('#rentAmount').fill('800')
  await page.locator('#chargesAmount').fill('50')
  await page.locator('#depositAmount').fill('1600')
  await page.locator('#startDate').fill(iso(start))
  await page.locator('#endDate').fill(iso(end))
  await page.getByRole('button', { name: /cr[ée]er le bail/i }).click()

  // Wait for the lease to actually exist.
  //
  // The click returns as soon as the button is dispatched, while `createLease`
  // is still running server-side: it writes the Lease, generates the rent
  // periods for every month owed, and only then renders the bail PDF. Without
  // this wait the fixture returns while the URL is still /leases/new, /billing
  // finds no lease, `ensureRentPeriods` has nothing to generate, and « Marquer
  // payé » does not exist — the page honestly says « Aucune transaction ».
  //
  // Waiting on the LIST page the form redirects to, not on a sleep. Note the
  // redirect target matters: waiting for the tenant's name would match the
  // « Sophie Bernard » OPTION already on /leases/new and return immediately,
  // which is the race this line exists to close.
  await page.waitForURL(/\/leases(\?|$)/, { timeout: 30_000 })
}

/**
 * The warning case, which is the DEFAULT state of the product.
 *
 * `generateQuittance` refuses when the landlord's own address is incomplete, and
 * the User columns default to "". So this is not an edge case: it is what every
 * account that has not opened « Mon profil » sees on its first payment.
 */
test('paying without a landlord address warns instead of claiming a receipt', async ({ page }) => {
  await setupLandlord(page)

  await gotoStable(page, '/billing')

  // No branch: if this button is not there, the test fails rather than passing
  // without having clicked anything.
  const markPaid = page.getByRole('button', { name: /marquer payé/i }).first()
  await expect(markPaid).toBeVisible({ timeout: 30_000 })
  await markPaid.click()

  // The payment is real, so it is reported as such — but with the reason attached,
  // and not as a clean success.
  const warning = page.getByText(
    "Paiement validé, mais la quittance n'a pas pu être générée : Complétez votre adresse de propriétaire dans Mon profil pour pouvoir générer une quittance."
  )
  await expect(warning).toBeVisible({ timeout: 30_000 })

  // A bare "Paiement validé" is exactly the false success being guarded against.
  await expect(page.getByText('Paiement validé', { exact: true })).toHaveCount(0)

  // And no receipt exists: no download link on the row.
  await expect(page.getByRole('link', { name: /télécharger/i })).toHaveCount(0)
})

/** The same action once the profile is complete: a receipt really is produced. */
test('paying with a complete landlord address produces a receipt', async ({ page }) => {
  await setupLandlord(page)

  await gotoStable(page, '/settings/profile')
  await page.locator('#addressLine1').fill('9 rue des Archives')
  await page.locator('#postalCode').fill('75004')
  await page.locator('#city').fill('Paris')
  await page.getByRole('button', { name: /enregistrer/i }).click()
  await expect(page.getByText(/profil enregistré/i)).toBeVisible({ timeout: 30_000 })

  await gotoStable(page, '/billing')
  const markPaid = page.getByRole('button', { name: /marquer payé/i }).first()
  await expect(markPaid).toBeVisible({ timeout: 30_000 })
  await markPaid.click()

  // An exact match: the warning wording also contains "Paiement validé", so a
  // substring assertion here would pass on the wrong toast.
  await expect(page.getByText('Paiement validé', { exact: true })).toBeVisible({ timeout: 30_000 })

  // The document exists — this is the difference the warning case lacked.
  await expect(page.getByRole('link', { name: /télécharger/i }).first()).toBeVisible({
    timeout: 30_000,
  })
})

test('billing page loads with navigation', async ({ page }) => {
  await registerTestUser(page, uniqueEmail('e2e.billing'))
  await gotoStable(page, '/billing')
  await expect(page.getByRole('heading', { name: /paiements/i })).toBeVisible()
})