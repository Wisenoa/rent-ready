import { test, expect } from './helpers/fixtures'
import { TOOL_SLUGS } from '../../lib/analytics/privacy'

for (const slug of TOOL_SLUGS) {
  test(`free tool ${slug} retains SSR, metadata and a usable mobile page`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await page.setViewportSize({ width: 375, height: 850 })
    const response = await page.goto(`/outils/${slug}`)
    expect(response?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('h1')).toBeVisible()
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toBe(`https://lokna.fr/outils/${slug}`)
    await expect(page.locator('main').first()).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    expect(errors).toEqual([])
  })
}

test('analytics follows consent and never transmits calculation parameters', async ({ page }) => {
  const events: Array<{ event: string; path: string }> = []
  page.on('request', request => {
    if (request.url().endsWith('/api/analytics/page-view')) {
      const payload: unknown = request.postDataJSON()
      if (typeof payload === 'object' && payload !== null && 'event' in payload && typeof payload.event === 'string' && 'path' in payload && typeof payload.path === 'string') events.push({ event: payload.event, path: payload.path })
    }
  })
  await page.goto('/outils/calculateur-irl?loyer=850&email=private@example.test&token=private')
  await page.getByLabel('Loyer mensuel hors charges').fill('920')
  await page.waitForTimeout(800)
  expect(events).toEqual([])
  await page.goto('/politique-cookies')
  await page.getByRole('button', { name: 'Modifier mon choix de mesure d’audience' }).click()
  await page.getByRole('button', { name: 'Accepter tous les cookies', exact: true }).click()
  await page.goto('/outils/calculateur-irl?loyer=850&email=private@example.test&token=private')
  await page.getByLabel('Loyer mensuel hors charges').fill('920')
  await expect.poll(() => events.some(event => event.event === 'tool_completed')).toBe(true)
  expect(events.some(event => event.event === 'tool_viewed')).toBe(true)
  expect(events.some(event => event.event === 'tool_started')).toBe(true)
  expect(JSON.stringify(events)).not.toContain('private')
  expect(events.every(event => !event.path.includes('?'))).toBe(true)
})
