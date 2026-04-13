import { test, expect } from '@playwright/test'

test.describe('Marketing Pages', () => {
  test('homepage loads without JS errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/')
    await expect(page).toHaveTitle(/.*rentready.*|.*rent-ready.*|.*louer.*|.*gestion.*/i)

    // Hero section
    await expect(page.locator('body')).not.toBeEmpty()

    // No fatal JS errors (filter out non-critical ones)
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes('favicon') &&
        !e.includes('404') &&
        !e.includes('hydration') &&
        !e.includes('Warning')
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('pricing page loads', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.locator('body')).not.toBeEmpty()
    // Should have pricing information
    const body = await page.textContent('body')
    expect(body?.toLowerCase()).toMatch(/prix|tarif|plan|abonnement/i)
  })

  test('features page loads', async ({ page }) => {
    await page.goto('/features')
    await expect(page.locator('body')).not.toBeEmpty()
    const body = await page.textContent('body')
    expect(body?.toLowerCase()).toMatch(/fonctionnalité|feature|gestion|bien/i)
  })

  test('homepage has CTA buttons', async ({ page }) => {
    await page.goto('/')
    // Look for common CTA patterns
    const ctaButton = page.locator('a[href*="register"], a[href*="signup"], button').filter({
      hasText: /essai|essai gratuit|démarrer|commencer|s'inscrire|se connecter/i,
    })
    // At least one CTA should be present
    const count = await ctaButton.count()
    expect(count).toBeGreaterThan(0)
  })

  test('navigation links work', async ({ page }) => {
    await page.goto('/')
    // Click on pricing link in nav if available
    const pricingLink = page.locator('a[href="/pricing"]').first()
    if (await pricingLink.isVisible()) {
      await pricingLink.click()
      await page.waitForURL('/pricing')
      await expect(page.locator('body')).not.toBeEmpty()
    }
  })

  test('login page is accessible from marketing pages', async ({ page }) => {
    await page.goto('/')
    const loginLink = page.locator('a[href="/login"]').first()
    if (await loginLink.isVisible()) {
      await loginLink.click()
      await page.waitForURL('/login**')
      await expect(page.getByRole('heading', { name: /bienvenue|connexion/i })).toBeVisible()
    }
  })
})
