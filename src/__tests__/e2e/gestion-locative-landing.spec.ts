import { test, expect } from "@playwright/test";

test.describe("Landing Page Gestion Locative", () => {
  test("renders correctly with 200, SEO metadata, images, and interactive elements", async ({
    page,
  }) => {
    // Navigate to /gestion-locative
    const response = await page.goto("/gestion-locative");
    expect(response?.status()).toBe(200);

    // Title and meta checks
    const title = await page.title();
    expect(title).toContain("Logiciel de gestion locative");
    expect(title).toContain("Lokna");

    const metaDescription = await page
      .locator('meta[name="description"]')
      .getAttribute("content");
    expect(metaDescription).toBeTruthy();
    expect(metaDescription).toContain("loi 1989");

    // Canonical link
    const canonical = await page
      .locator('link[rel="canonical"]')
      .getAttribute("href");
    expect(canonical).toContain("/gestion-locative");

    // Check JSON-LD Schema markup
    const schemaScripts = await page
      .locator('script[type="application/ld+json"]')
      .all();
    expect(schemaScripts.length).toBeGreaterThan(0);

    let hasSoftwareApplication = false;
    let hasFAQPage = false;

    for (const script of schemaScripts) {
      const text = await script.textContent();
      if (!text) continue;
      const parsed = JSON.parse(text);
      const graph = parsed["@graph"] || [parsed];
      for (const node of graph) {
        if (node["@type"] === "SoftwareApplication") hasSoftwareApplication = true;
        if (node["@type"] === "FAQPage") hasFAQPage = true;
      }
    }

    expect(hasSoftwareApplication).toBe(true);
    expect(hasFAQPage).toBe(true);

    // Verify H1
    const h1 = page.locator("h1");
    await expect(h1).toHaveCount(1);
    await expect(h1).toContainText("La gestion locative sans tableur");

    // Verify generated images exist and have alt text
    const images = page.locator("img");
    const count = await images.count();
    expect(count).toBeGreaterThan(2);

    const heroImage = page.locator(
      'img[src*="hero-lifestyle"]'
    );
    await expect(heroImage).toBeVisible();

    const quittanceImage = page.locator(
      'img[src*="quittance-cycle"]'
    );
    await expect(quittanceImage).toBeAttached();

    const facadeImage = page.locator(
      'img[src*="patrimoine-facade"]'
    );
    await expect(facadeImage).toBeAttached();

    // Verify CTAs point to register
    const primaryCta = page.locator('a[href="/register"]').first();
    await expect(primaryCta).toBeVisible();

    // Verify Interactive Demo is interactive
    const demoRoot = page.locator("#product-demo-root");
    await expect(demoRoot).toBeVisible();

    const regulariserBtn = demoRoot.locator(
      'button:has-text("Régulariser")'
    );
    if ((await regulariserBtn.count()) > 0) {
      await regulariserBtn.click();
      await expect(demoRoot).toContainText("100%");
    }

    // Verify City Explorer search
    const searchInput = page.locator('input[placeholder*="Rechercher une ville"]');
    await expect(searchInput).toBeVisible();
    await searchInput.fill("Bordeaux");
    const cityLink = page.locator('a[href="/gestion-locative/bordeaux"]');
    await expect(cityLink).toBeVisible();

    // Verify FAQ Accordion
    const firstFaqQuestion = page.locator(
      'button:has-text("Qu\'est-ce qu\'un logiciel de gestion locative ?")'
    );
    await expect(firstFaqQuestion).toBeVisible();
  });
});
