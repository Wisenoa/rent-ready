import { test, expect } from './helpers/fixtures'
import { registerTestUser, uniqueEmail } from './helpers/auth'
import { realErrors } from './helpers/console'

/**
 * /maintenance, ce que le produit fait RÉELLEMENT.
 *
 * Cette spec supposait que le propriétaire y DÉCLARE une demande : elle
 * cherchait un formulaire (`[id="title"]`) et un bouton « créer ». Ce formulaire
 * n'existe pas, et son absence est un choix, pas un trou — le dashboard le dit
 * en toutes lettres :
 *
 *   « filing a ticket is currently only possible from the tenant portal — so a
 *   button reading "Signaler un problème" would promise an action the landlord
 *   cannot take »
 *
 * Le propriétaire CONSULTE les demandes et fait avancer leur STATUT ; le locataire
 * signale. Ces tests vérifient ce contrat, et disent explicitement qu'il n'y a
 * pas de création côté propriétaire, pour que le jour où ce produit change la
 * spec doive être réécrite plutôt que Cassée en silence.
 */
test.describe('Maintenance Request Flow', () => {
  async function setupUserWithPropertyAndTenant(page: any) {
    const accountEmail = uniqueEmail('maint')
    await registerTestUser(page, accountEmail)

    await page.goto('/properties')
    await page.getByRole('button', { name: 'Ajouter un bien', exact: true }).first().click()
    await expect(page.getByText(/nouveau bien/i)).toBeVisible({ timeout: 5000 })
    await page.fill('[id="name"]', 'Immeuble Maintenance')
    await page.fill('[id="addressLine1"]', '30 Rue de la Maintenance')
    await page.fill('[id="city"]', 'Marseille')
    await page.fill('[id="postalCode"]', '13001')
    await page.getByRole('dialog').locator('button[type="submit"]').click()
    await expect(page.getByText('Immeuble Maintenance')).toBeVisible({ timeout: 10_000 })

    await page.goto('/tenants')
    await page.getByRole('button', { name: 'Ajouter un locataire', exact: true }).first().click()
    await expect(page.getByText(/nouveau locataire/i)).toBeVisible({ timeout: 5000 })
    await page.fill('[id="firstName"]', 'Jean')
    await page.fill('[id="lastName"]', 'Michelin')
    await page.fill('[id="email"]', `michelin.${Date.now()}@example.com`)
    // address, city and postal code are required; without them the form
    // validates in place and does not submit.
    await page.fill('[id="addressLine1"]', '5 avenue Foch')
    await page.fill('[id="city"]', 'Paris')
    await page.fill('[id="postalCode"]', '75016')
    await page.getByRole('dialog').locator('button[type="submit"]').click()
    await expect(page.getByText('Jean Michelin')).toBeVisible({ timeout: 10_000 })

    return accountEmail
  }

  test('maintenance page loads and shows empty state', async ({ page }) => {
    await registerTestUser(page, uniqueEmail('maint.empty'))
    await page.goto('/maintenance')

    const body = await page.textContent('body')
    expect(body?.toLowerCase()).toMatch(/entretien|maintenance|dépannage|réparation/i)

    // The empty state must say something. A blank page that looks broken is the
    // failure mode this checks.
    await expect(page.getByText(/aucune demande|aucun ticket|portail|locataire/i).first()).toBeVisible({
      timeout: 10_000,
    })
  })

  test('le propriétaire ne déclare PAS de demande — le locataire la signale', async ({ page }) => {
    await setupUserWithPropertyAndTenant(page)
    await page.goto('/maintenance')

    // No creation form, and no button offering one. This is the contract, stated
    // so a future change to it fails here instead of silently passing.
    await expect(page.locator('#title')).toHaveCount(0)
    await expect(
      page.getByRole('button', { name: /signaler un probl[eè]me/i }),
    ).toHaveCount(0)
  })

  test('la page des demandes est consultable et n-invariant pas', async ({ page }) => {
    await setupUserWithPropertyAndTenant(page)
    await page.goto('/maintenance')

    // The page is the landlord's VIEW on requests. With none filed it says so,
    // and it does not pretend there is something to act on.
    await expect(page.getByText(/aucune demande|aucun ticket/i).first()).toBeVisible({
      timeout: 10_000,
    })
    await expect(page.getByRole('heading').first()).toBeVisible()
  })

  test('maintenance page no JS errors on load', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await registerTestUser(page, uniqueEmail('maint.errors'))
    await page.goto('/maintenance')
    await page.waitForLoadState('networkidle')

    expect(realErrors(errors)).toHaveLength(0)
  })
})