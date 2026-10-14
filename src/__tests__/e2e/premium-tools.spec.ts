import { test, expect, type Page } from '@playwright/test'

/**
 * The two V3.2 calculators driven like a landlord would: from /outils, typing
 * amounts, changing a choice, making a mistake, on a phone, and following the
 * links out. Expected figures are computed by hand from the INSEE indices
 * (T2 2026 = 148,37, T2 2025 = 146,68, T3 2025 = 145,77, T3 2024 = 144,51,
 * T4 2025 = 145,78, T4 2024 = 144,64).
 */

// Intl.NumberFormat("fr-FR") separates thousands and "€" with no-break spaces.
const euros = (text: string) => new RegExp(text.replace(/ /g, '[\\s\\u00A0\\u202F]'))

async function dismissCookies(page: Page) {
  const refuse = page.getByRole('button', { name: 'Refuser' })
  if (await refuse.isVisible().catch(() => false)) await refuse.click()
}

test.describe('Calculateur IRL', () => {
  test('from /outils to a revised rent, recalculated when the quarter changes', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/outils')
    await dismissCookies(page)
    await page.getByRole('link', { name: /Calculer le nouveau loyer/ }).click()
    await page.waitForURL('**/outils/calculateur-irl')

    const result = page.locator('#resultat')
    await expect(result).toContainText('Exemple pour 800 €')
    await expect(result).toContainText(euros('809,22 €'))

    await page.getByLabel('Loyer mensuel hors charges').fill('1 000')
    await expect(result).toContainText('Votre calcul')
    await expect(result).toContainText(euros('1 011,52 €'))
    await expect(result).toContainText(euros('\\+11,52 €'))
    await expect(result).toContainText(euros('\\+138,24 €'))

    await page.locator('label').filter({ hasText: /^T3/ }).click()
    await expect(page.getByLabel("Indice de l'année de révision")).toHaveValue('2025')
    await expect(result).toContainText(euros('1 008,72 €'))
    await expect(result).toContainText('+0,87 %')
  })

  test('explains a wrong amount instead of computing it', async ({ page }) => {
    await page.goto('/outils/calculateur-irl')
    const field = page.getByLabel('Loyer mensuel hors charges')
    await field.fill('huit cents')
    await expect(field).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('Saisissez un montant en euros, par exemple 850 ou 850,50.')).toBeVisible()
    await expect(page.locator('#resultat')).toContainText('Corrigez le loyer pour voir le nouveau montant.')

    await field.fill('850,50')
    await expect(field).not.toHaveAttribute('aria-invalid', 'true')
    await expect(page.locator('#resultat')).toContainText(euros('860,30 €'))
  })

  test('a shared link opens the same calculation, and carries no personal data', async ({ page }) => {
    await page.goto('/outils/calculateur-irl?loyer=640&trimestre=4&annee=2025')
    await expect(page.getByLabel('Loyer mensuel hors charges')).toHaveValue('640')
    await expect(page.locator('#resultat')).toContainText(euros('645,04 €'))
    await expect(page.locator('#resultat')).toContainText('T4 2024')
  })

  test('on a phone: no horizontal scroll, the answer at the end of the form, links to the guide and to Lokna', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/outils/calculateur-irl')
    await dismissCookies(page)
    await page.getByLabel('Loyer mensuel hors charges').fill('720')
    const jump = page.getByRole('link', { name: /Voir le détail/ })
    await expect(jump).toBeVisible()
    await expect(jump).toContainText(euros('728,30 €'))
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375)

    await expect(page.getByRole('link', { name: 'guide de la révision IRL' })).toHaveAttribute('href', '/guides/irl-2026')
    await expect(page.getByRole('link', { name: 'Essayer Lokna gratuitement' })).toHaveAttribute('href', '/register')
  })
})

test.describe('Calculateur de charges', () => {
  test('from /outils to a regularisation, complement then refund', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/outils')
    await dismissCookies(page)
    await page.getByRole('link', { name: /Calculer la régularisation/ }).click()
    await page.waitForURL('**/outils/calculateur-charges-locatives')

    const result = page.locator('#resultat')
    await expect(result).toContainText('Exemple')
    await expect(result).toContainText(euros('220,00 €'))

    await page.getByLabel('Provision mensuelle').fill('100')
    for (const [label, amount] of [['Eau froide', '180'], ['Ordures ménagères (TEOM)', '165'], ['Entretien des parties communes', '420'], ['Chauffage collectif', '655,00']]) {
      await page.getByLabel(`Montant : ${label}`).fill(amount)
    }
    await expect(result).toContainText('à régler par le locataire')
    await expect(result).toContainText(euros('220,00 €'))

    await page.getByLabel('Provision mensuelle').fill('130')
    await expect(result).toContainText('à rembourser au locataire')
    await expect(result).toContainText(euros('140,00 €'))

    await page.getByRole('button', { name: 'Ascenseur' }).click()
    await page.getByLabel('Montant : Ascenseur').fill('140')
    await expect(result).toContainText('Les provisions versées couvrent exactement les charges dues.')
  })

  test('prorates to the days of occupancy', async ({ page }) => {
    await page.goto('/outils/calculateur-charges-locatives')
    await dismissCookies(page)
    await page.getByLabel('Du', { exact: true }).fill('2025-01-01')
    await page.getByLabel('Au', { exact: true }).fill('2025-12-31')
    await page.getByLabel('Provision mensuelle').fill('100')
    await page.getByLabel('Mois versés').fill('7')
    await page.getByLabel('Montant : Eau froide').fill('1420')
    await page.getByLabel(/qu'une partie de cette période/).check()
    await page.getByLabel('Arrivée (ou début de période)').fill('2025-06-01')
    const result = page.locator('#resultat')
    await expect(result).toContainText('214 jours')
    await expect(result).toContainText(euros('832,55 €'))
    await expect(result).toContainText(euros('132,55 €'))
  })

  test('refuses an impossible input and never regularises a forfait', async ({ page }) => {
    await page.goto('/outils/calculateur-charges-locatives')
    await dismissCookies(page)
    await page.getByLabel('Provision mensuelle').fill('100')
    await page.getByLabel('Mois versés').fill('15')
    await expect(page.getByLabel('Mois versés')).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('Entre 0 et 12 mois, sans décimale.')).toBeVisible()
    await expect(page.locator('#resultat')).toContainText('Complétez ou corrigez les champs signalés')

    await page.locator('label').filter({ hasText: /^Un forfait/ }).click()
    await expect(page.locator('#resultat')).toContainText('Pas de régularisation')
    await expect(page.getByLabel('Provision mensuelle')).toHaveCount(0)
  })

  test('on a phone: no horizontal scroll and links to the charges list and to Lokna', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/outils/calculateur-charges-locatives')
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(375)
    await expect(page.getByRole('link', { name: 'liste détaillée des charges récupérables' })).toHaveAttribute(
      'href',
      '/blog/charges-locatives-recuperables-liste-2026'
    )
    await expect(page.getByRole('link', { name: 'Essayer Lokna gratuitement' })).toHaveAttribute('href', '/register')
  })
})
