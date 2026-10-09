import { test, expect } from './helpers/fixtures';

test.describe('Homepage B.3 Production Journey & Interactive Widgets', () => {
  test('homepage renders B.3 hero and semantic structure', async ({ page }) => {
    await page.goto('/');

    // Check single H1
    const h1 = page.locator('h1');
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText('Gérez vos locations sans tableur.');

    // Check main landmark
    await expect(page.locator('main#main-content')).toBeVisible();

    // Check skip link presence
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
  });

  test('interactive demo transitions from attention to resolved', async ({ page }) => {
    await page.goto('/');

    const demo = page.locator('#product-demo-root');
    await expect(demo).toBeVisible();

    // In initial "attention" state, unpaid balance is 400 €
    await expect(demo).toContainText('2 950,00 € (88%)');
    await expect(demo).toContainText('400,00 €');

    // Click "Régulariser" button
    const resolveBtn = demo.getByRole('button', { name: /Régulariser/i });
    await expect(resolveBtn).toBeVisible();
    await resolveBtn.click();

    // State transitions to resolved
    await expect(demo).toContainText('3 350,00 € (100%)');
    await expect(demo).toContainText('Quittance de loyer soldée disponible');
    await expect(demo).toContainText('Aperçu PDF');
  });

  test('pricing toggle updates amounts dynamically', async ({ page }) => {
    await page.goto('/');

    const pricingSection = page.locator('#tarifs');
    await expect(pricingSection).toBeVisible();

    // Default monthly: Starter 9 €, Pro 15 €
    await expect(pricingSection).toContainText('9 €');
    await expect(pricingSection).toContainText('15 €');

    // Switch to Annual
    const annualBtn = pricingSection.getByRole('button', { name: /Annuel/i });
    await annualBtn.click();

    // Annual prices: Starter 89 €, Pro 149 €
    await expect(pricingSection).toContainText('89 €');
    await expect(pricingSection).toContainText('149 €');
  });

  test('FAQ accordion toggles question panels', async ({ page }) => {
    await page.goto('/');

    const firstQuestionBtn = page.getByRole('button', {
      name: /Pourquoi quitter un tableur Excel pour RentReady \?/i,
    });
    await expect(firstQuestionBtn).toBeVisible();
    await expect(firstQuestionBtn).toHaveAttribute('aria-expanded', 'true');

    // Second question is collapsed by default
    const secondQuestionBtn = page.getByRole('button', {
      name: /Comment fonctionne l'essai gratuit de 14 jours \?/i,
    });
    await expect(secondQuestionBtn).toHaveAttribute('aria-expanded', 'false');

    // Click to open second question
    await secondQuestionBtn.click();
    await expect(secondQuestionBtn).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#faq-answer-1')).toBeVisible();
  });
});
