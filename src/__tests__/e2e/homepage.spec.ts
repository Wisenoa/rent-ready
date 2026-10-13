import { test, expect } from './helpers/fixtures';

/**
 * The homepage is the main commercial page. These checks cover what must not
 * regress: what it says first, that the month story follows the scroll and the
 * keyboard, that every figure matches the product's rules, and that every call
 * to action leads somewhere real.
 */

test.describe('Homepage', () => {
  test('states what Lokna is, for whom, and how to start', async ({ page }) => {
    const response = await page.goto('/');
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(/Vos loyers suivis\.\s*Vos quittances prêtes\./);
    await expect(page.getByText('Logiciel de gestion locative').first()).toBeVisible();
    // One skip link (from the root layout) and a target it can reach.
    await expect(page.locator('main#main')).toBeVisible();
    await expect(page.locator('a[href="#main"]')).toHaveCount(1);

    const hero = page.locator('section[aria-labelledby="hero-title"]');
    await expect(hero.getByRole('link', { name: /Essayer gratuitement/ })).toHaveAttribute('href', '/register');
    await expect(hero).toContainText("14 jours d'essai · sans carte bancaire");
  });

  test('hero shows the month computed by the settlement rule', async ({ page }) => {
    await page.goto('/');
    const panel = page.locator('section[aria-labelledby="hero-title"] figure');
    // 520 + 700 + 850 due; 520 + 700 + 500 received on 6 October.
    await expect(panel).toContainText(/2\s070,00\s€/);
    await expect(panel).toContainText(/1\s720,00\s€/);
    await expect(panel).toContainText(/350,00\s€/);
    await expect(panel).toContainText('Reçu de paiement partiel');
    await expect(panel).toContainText('Exemple fictif');
  });

  test('the month story follows the scroll and the date buttons', async ({ page }) => {
    await page.goto('/');
    const story = page.locator('#mois');
    const current = story.locator('[aria-current="step"]');

    await story.locator('li[data-index="3"]').scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, 1));
    await expect(current).toHaveText('12 oct.');
    await expect(story).toContainText('Rappel envoyé le 12 oct.');

    await story.getByRole('button', { name: '18 oct.' }).click();
    await expect(current).toHaveText('18 oct.');
    await expect(story).toContainText('100 % reçu');
    await expect(story).toContainText(/Réglé le 18 oct\./);
  });

  test('feature tabs work from the keyboard', async ({ page }) => {
    await page.goto('/');
    const first = page.getByRole('tab', { name: /Relancer/ });
    await first.focus();
    await page.keyboard.press('ArrowDown');
    const revise = page.getByRole('tab', { name: /Réviser le loyer/ });
    await expect(revise).toBeFocused();
    await expect(revise).toHaveAttribute('aria-selected', 'true');
    const panel = page.getByRole('tabpanel', { name: /Réviser le loyer/ });
    // 640 € × 145,78 / 144,64 (IRL T4 2025 / T4 2024), as calculateRentRevision computes it.
    await expect(panel).toContainText(/645,04\s€/);
  });

  test('prices come from the published plans and lead to sign-up', async ({ page }) => {
    await page.goto('/');
    const pricing = page.locator('#tarifs');
    await expect(pricing).toContainText(/9\s€/);
    await expect(pricing).toContainText(/15\s€/);
    await expect(pricing).toContainText(/89\s€ par an/);
    await expect(pricing).toContainText(/149\s€ par an/);
    for (const link of await pricing.getByRole('link', { name: /Essayer .* gratuitement/ }).all()) {
      await expect(link).toHaveAttribute('href', '/register');
    }
  });

  test('FAQ answers open and stay in the HTML', async ({ page }) => {
    await page.goto('/');
    const first = page.locator('details').first();
    await first.locator('summary').click();
    await expect(first).toHaveAttribute('open', '');
    await expect(page.locator('details p').nth(3)).toContainText('CSV');
  });

  test('links to the strategic pages', async ({ page }) => {
    await page.goto('/');
    for (const href of ['/gestion-locative', '/pricing', '/features', '/outils', '/villes', '/register', '/login']) {
      expect(await page.locator(`a[href="${href}"]`).count(), href).toBeGreaterThan(0);
    }
  });

  for (const width of [360, 390, 768]) {
    test(`does not scroll horizontally at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto('/');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }

  test('with reduced motion, content is visible without animation', async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    await page.goto('/');
    await page.locator('#tarifs').scrollIntoViewIfNeeded();
    const opacity = await page.locator('#tarifs').evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
    const hidden = await page.$$eval('[data-reveal="hidden"]', (els) =>
      els.filter((el) => getComputedStyle(el).opacity !== '1').length
    );
    expect(hidden).toBe(0);
    await context.close();
  });
});
