import { test, expect } from '@playwright/test'

/**
 * The shared public header and footer (V3.1), driven in a real browser:
 * one header and one footer per page, keyboard-closable menus, a mobile sheet
 * that closes on navigation, and the journey from the homepage through the
 * free tools to the product without leaving the same navigation.
 */

const PAGES = [
  '/',
  '/outils',
  '/outils/calculateur-charges-locatives',
  '/outils/generateur-quittance',
  '/gestion-locative',
  '/pricing',
  '/guides/irl-2026',
  '/templates/bail-vide',
  '/gestion-locative/lyon',
]

test.describe('Navigation marketing partagée', () => {
  for (const path of PAGES) {
    test(`${path} has exactly one site header and one site footer`, async ({ page }) => {
      await page.goto(path)
      await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toHaveCount(1)
      await expect(page.locator('footer')).toHaveCount(1)
      await expect(page.locator('main')).toHaveCount(1)
    })
  }

  test('desktop menu opens, closes on Escape and returns focus', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/outils/calculateur-charges-locatives')
    const trigger = page.getByRole('button', { name: 'Outils gratuits' })
    await trigger.click()
    await expect(trigger).toHaveAttribute('aria-expanded', 'true')
    await expect(page.getByRole('link', { name: 'Tous les outils gratuits' }).first()).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(trigger).toBeFocused()
  })

  test('mobile menu locks scroll, closes on Escape and on navigation', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto('/guides/irl-2026')
    const toggle = page.getByRole('button', { name: 'Ouvrir le menu' })
    await toggle.click()
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('hidden')
    await page.keyboard.press('Escape')
    await expect(page.getByRole('button', { name: 'Ouvrir le menu' })).toHaveAttribute('aria-expanded', 'false')
    expect(await page.evaluate(() => document.documentElement.style.overflow)).toBe('')

    await page.getByRole('button', { name: 'Ouvrir le menu' }).click()
    await page.getByRole('navigation', { name: 'Navigation mobile' }).getByRole('link', { name: 'Calculateur de révision IRL' }).click()
    await page.waitForURL('**/outils/calculateur-irl')
    await expect(page.getByRole('button', { name: 'Ouvrir le menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  for (const width of [375, 768]) {
    test(`no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      for (const path of PAGES) {
        await page.goto(path)
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
        expect(scrollWidth, path).toBeLessThanOrEqual(width)
      }
    })
  }

  test('homepage → outils → charges → guide → another tool → Lokna, one navigation throughout', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.goto('/')
    await page.getByRole('button', { name: 'Outils gratuits' }).click()
    await page.getByRole('link', { name: 'Tous les outils gratuits' }).first().click()
    await page.waitForURL('**/outils')

    await page.getByRole('link', { name: /Charges locatives/ }).first().click()
    await page.waitForURL('**/outils/calculateur-charges-locatives')

    const related = page.getByRole('navigation', { name: 'Pour aller plus loin' })
    await expect(related.getByRole('link', { name: 'Tous les outils gratuits' })).toHaveAttribute('href', '/outils')
    await related.getByRole('link', { name: 'La liste des charges récupérables' }).click()
    await page.waitForURL('**/blog/charges-locatives-recuperables-liste-2026')

    await page.goto('/guides/depot-garantie')
    await page.getByRole('complementary', { name: 'Calculer le plafond du dépôt de garantie' })
      .getByRole('link', { name: 'Calculer le plafond' }).click()
    await page.waitForURL('**/outils/calculateur-depot-garantie')

    await page.getByRole('navigation', { name: 'Pour aller plus loin' })
      .getByRole('link', { name: 'Le suivi des loyers dans Lokna' }).click()
    await page.waitForURL('**/gestion-locative')
    await expect(page.getByRole('navigation', { name: 'Navigation principale' })).toHaveCount(1)
  })
})
