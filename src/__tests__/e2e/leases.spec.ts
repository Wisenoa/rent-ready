import { test, expect } from './helpers/fixtures'
import { registerTestUser, uniqueEmail } from './helpers/auth'

test.describe('Lease Creation', () => {
  async function setupUserWithPropertyAndTenant(page: any) {
    const accountEmail = uniqueEmail('lease')
    // Register
    await registerTestUser(page, accountEmail)

    // Create a property
    await page.goto('/properties')
    await page.getByRole('button', { name: 'Ajouter un bien', exact: true }).first().click()
    await expect(page.getByText(/nouveau bien/i)).toBeVisible({ timeout: 5000 })
    await page.fill('[id="name"]', 'Studio Lyon')
    await page.fill('[id="addressLine1"]', '8 Rue de la République')
    await page.fill('[id="city"]', 'Lyon')
    await page.fill('[id="postalCode"]', '69001')
    // Scoped to the dialog and to `type="submit"`: the trigger is called
    // « Ajouter … » and the dialog holds « Annuler » next to « Ajouter », so a
    // page-wide /créer|ajouter/ matched three elements and strict mode
    // refused to choose.
    await page.getByRole('dialog').locator('button[type="submit"]').click()
    await expect(page.getByText('Studio Lyon')).toBeVisible({ timeout: 10_000 })

    // Create a tenant
    await page.goto('/tenants')
    await page.getByRole('button', { name: 'Ajouter un locataire', exact: true }).first().click()
    await expect(page.getByText(/nouveau locataire/i)).toBeVisible({ timeout: 5000 })
    await page.fill('[id="firstName"]', 'Pierre')
    await page.fill('[id="lastName"]', 'Durand')
    await page.fill('[id="email"]', `pierre.durand.${Date.now()}@example.com`)
    // address, city and postal code are required; without them the form
    // validates in place and does not submit.
    await page.fill('[id="addressLine1"]', '5 avenue Foch')
    await page.fill('[id="city"]', 'Paris')
    await page.fill('[id="postalCode"]', '75016')
    // Scoped to the dialog: « Ajouter un locataire » (the trigger), « Annuler »
    // and « Ajouter » (the submit) all match /créer|ajouter/i, and strict mode
    // refuses to choose between them.
    await page.getByRole('dialog').locator('button[type="submit"]').click()
    // The tenant's name sits in a `CardTitle`, which renders a <div
    // data-slot="card-title"> — not a heading. `getByRole('heading', …)` can
    // therefore never match on this page, and the commit that replaced
    // getByText with getByRole broke this assertion: the role change is right on
    // the tenant DETAIL page, where the name is an <h1>, and wrong here.
    //
    // Scoped to the card by its slot rather than by text alone, so it cannot
    // collide with the route announcer — which is the whole reason the earlier
    // getByText was abandoned.
    await expect(
      page.locator('[data-slot="card-title"]', { hasText: 'Pierre Durand' }).first()
    ).toBeVisible({ timeout: 10_000 })
  }

  test('leases page loads and shows empty state', async ({ page }) => {
    const accountEmail = uniqueEmail('lease.empty')
        await registerTestUser(page, accountEmail)
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

    // The property field, not a heading. This page has no « Bien » title: the
    // field is a labelled control (« Bien immobilier * » bound to #propertyId),
    // and looking for a heading here tested a role the page does not use.
    const propertyField = page.locator('#propertyId')
    await expect(propertyField).toBeVisible({ timeout: 5000 })

    // Select property (Studio Lyon)
    await propertyField.click()
    await page.getByRole('option', { name: /studio lyon/i }).click()

    // Select tenant
    // Same reasoning as #paymentDay: the fallback matched any listbox on the
    // page, so it resolved to several elements instead of describing the field.
    const tenantSelect = page.locator('#tenantId')
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
    // No `.or()` fallback: `#paymentDay` is a number input, not a combobox, and
    // the fallback matched ANY listbox on the page — two elements here, which
    // Playwright's strict mode refuses. The test passed alone and failed in the
    // suite, where a neighbouring dialog changed what was on screen.
    // `paymentDay` is an <Input type="number">, not a select. The option click
    // that used to follow was left over from an earlier form where the field was
    // a dropdown of « 1er, 2, 3… »; with a number input there are no options, so
    // Playwright waited on a listbox that could never appear and the test timed
    // out after 120s naming a locator that was never going to resolve.
    await page.locator('#paymentDay').fill('5')

    // Submit
    await page.getByRole('button', { name: /créer|enregistrer|valider/i }).click()

    // The lease list renders each card's title in a `CardTitle`, which is a
    // <div data-slot="card-title"> — not a heading. A role-based lookup for a
    // heading can therefore never match, and did not: the lease was created and
    // the test still failed. The `.or()` alternative in the previous version was
    // treating a symptom.
    //
    // Both the property name and the tenant name appear on the card, and both
    // prove the lease exists, so the assertion checks them on the same card
    // rather than resolving them anywhere on the page.
    const leaseCard = page
      .locator('[data-slot="card"]')
      .filter({ hasText: /studio lyon/i })
      .first()
    await expect(leaseCard).toBeVisible({ timeout: 10_000 })
    await expect(leaseCard).toContainText(/pierre durand/i)
  })
})
