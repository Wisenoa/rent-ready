import { expect, test } from './helpers/fixtures'
import { realErrors } from './helpers/console'
import type { Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

async function useGuestSession(page: Page) {
  await page.route('**/api/auth/session', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: '{"user":null}',
    }),
  )
}

test.describe('Gestion locative landing page', () => {
  test('keeps the product promise, SEO metadata, and conversion routes clear', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text())
    })
    await useGuestSession(page)

    await page.goto('/gestion-locative')

    await expect(page).toHaveTitle('Logiciel de gestion locative pour propriétaires bailleurs | Lokna')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Le bon suivi')
    await expect(page.getByRole('link', { name: /Essayer Lokna/ })).toHaveAttribute('href', '/register')
    await expect(page.getByRole('link', { name: 'Voir les tarifs' })).toHaveAttribute('href', '/pricing')
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://lokna.fr/gestion-locative',
    )

    const structuredData = await page
      .locator('script[type="application/ld+json"]')
      .evaluateAll((scripts) => scripts.map((script) => JSON.parse(script.textContent ?? '{}')))
    expect(JSON.stringify(structuredData)).toContain('SoftwareApplication')
    expect(JSON.stringify(structuredData)).toContain('/gestion-locative')

    await page.getByRole('link', { name: /Essayer Lokna/ }).click()
    await expect(page).toHaveURL(/\/register$/)
    await expect(page.locator('body')).not.toBeEmpty()

    await page.goto('/gestion-locative')
    await page.getByRole('link', { name: 'Voir les tarifs' }).click()
    await expect(page).toHaveURL(/\/pricing$/)
    await expect(page.locator('body')).not.toBeEmpty()

    await page.goto('/gestion-locative')
    await page.getByRole('link', { name: 'Comment ça marche' }).click()
    await expect(page).toHaveURL(/#cycle-mensuel$/)
    await expect(page.getByRole('heading', { name: 'Tout part du logement. Tout reste relié.' })).toBeVisible()

    expect(realErrors(errors)).toEqual([])
  })

  test('keeps images readable and the page within the viewport at key widths', async ({ page }) => {
    await useGuestSession(page)
    const viewportWidths = [360, 390, 768, 1440]

    for (const width of viewportWidths) {
      await page.setViewportSize({ width, height: width < 500 ? 844 : 900 })
      await page.goto('/gestion-locative')

      const bodyWidth = await page.locator('body').evaluate((body) => body.scrollWidth)
      expect(bodyWidth, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(width)
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    }

    const images = page.locator('article img')
    await expect(images).toHaveCount(3)

    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded()
      await expect(image).toHaveAttribute('src', /\/_next\/image\?url=/)
      await expect
        .poll(() => image.evaluate((element) => (element instanceof HTMLImageElement ? element.naturalWidth : 0)))
        .toBeGreaterThan(0)
    }
  })

  test('lets visitors expand answers and find the local pages', async ({ page }) => {
    await useGuestSession(page)
    await page.goto('/gestion-locative')

    const partialPaymentQuestion = page.getByText(/Que se passe-t-il si le paiement est partiel/)
    await partialPaymentQuestion.click()
    await expect(
      page.getByText(/conserve le solde restant dû et distingue le reçu de paiement partiel/),
    ).toBeVisible()

    const localPagesDisclosure = page.getByText(/Parcourir les pages locales/)
    await localPagesDisclosure.click()
    await expect(page.getByRole('link', { name: 'Paris', exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Lyon', exact: true })).toHaveAttribute(
      'href',
      '/gestion-locative/lyon',
    )
  })

  test('meets WCAG 2.1 AA checks in the landing content', async ({ page }) => {
    await useGuestSession(page)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/gestion-locative')

    const results = await new AxeBuilder({ page })
      .include('article')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
