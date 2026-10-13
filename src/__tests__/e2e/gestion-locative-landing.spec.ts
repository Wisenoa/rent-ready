import { expect, test } from "@playwright/test";
import cities from "@/data/cities.json";

/**
 * /gestion-locative is the canonical « logiciel de gestion locative » page.
 * These checks cover what must not regress: what search engines read, where
 * every call to action leads, and the example month the hero relies on.
 */

const PATH = "/gestion-locative";

test.describe("Landing gestion locative", () => {
  test("keeps its indexable head: title, canonical, robots", async ({ page }) => {
    const response = await page.goto(PATH);
    expect(response?.status()).toBe(200);

    await expect(page).toHaveTitle(/Logiciel de gestion locative/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      /\/gestion-locative$/
    );
    const robots = page.locator('meta[name="robots"]');
    if ((await robots.count()) > 0) {
      await expect(robots).not.toHaveAttribute("content", /noindex/);
    }
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("gestion locative");
  });

  test("publishes SoftwareApplication, FAQPage and BreadcrumbList data matching the page", async ({
    page,
  }) => {
    await page.goto(PATH);
    const blocks = await page
      .locator('script[type="application/ld+json"]')
      .allTextContents();
    const nodes = blocks.flatMap((text) => {
      const data = JSON.parse(text);
      return Array.isArray(data["@graph"]) ? data["@graph"] : [data];
    });
    const types = nodes.map((node) => node["@type"]);
    expect(types).toEqual(
      expect.arrayContaining(["SoftwareApplication", "FAQPage", "BreadcrumbList"])
    );

    const faq = nodes.find((node) => node["@type"] === "FAQPage");
    for (const entry of faq.mainEntity) {
      // Every question in the structured data must be visible on the page.
      await expect(page.getByRole("heading", { name: entry.name, exact: true })).toBeAttached();
    }
  });

  test("every call to action leads somewhere real", async ({ page }) => {
    await page.goto(PATH);
    const main = page.locator("main");
    const starts = main.getByRole("link", { name: "Commencer l'essai gratuit" });
    expect(await starts.count()).toBeGreaterThanOrEqual(2);
    for (const link of await starts.all()) {
      await expect(link).toHaveAttribute("href", "/register");
    }
    await expect(main.getByRole("link", { name: "Comparer les formules" })).toHaveAttribute(
      "href",
      "/pricing"
    );

    // The marketing nav links to in-page anchors; each one must exist.
    for (const id of ["cycle-mensuel", "fonctionnalites", "simulateurs", "tarifs"]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }

    const register = await page.request.get("/register");
    expect(register.status()).toBe(200);
  });

  test("shows the example month with the amounts the settlement rule produces", async ({
    page,
  }) => {
    await page.goto(PATH);
    const ledger = page.locator("figure[aria-labelledby='ledger-title']");
    await expect(ledger.getByRole("heading", { name: "Octobre 2026" })).toBeVisible();
    await expect(ledger).toContainText("exemple fictif");
    // 520 + 700 + 850 due; 520 + 700 + 500 received; 350 left on the partial one.
    await expect(ledger).toContainText(/2\s070,00\s€/);
    await expect(ledger).toContainText(/1\s720,00\s€/);
    await expect(ledger).toContainText(/350,00\s€/);
    await expect(ledger).toContainText("Reçu de paiement partiel");
    // A partial payment never shows as a ready quittance.
    const partialRow = ledger.locator("li", { hasText: "Emma Laurent" });
    await expect(partialRow).not.toContainText("Quittance prête");
  });

  test("keeps internal links to every city page, the free tools and /villes", async ({
    page,
  }) => {
    await page.goto(PATH);
    for (const city of cities) {
      await expect(
        page.locator(`main a[href="/gestion-locative/${city.slug}"]`)
      ).toHaveCount(1);
    }
    for (const href of ["/villes", "/outils/calculateur-irl", "/outils/generateur-quittance", "/features"]) {
      expect(await page.locator(`main a[href="${href}"]`).count()).toBeGreaterThan(0);
    }
  });

  test("FAQ answers open from the keyboard", async ({ page }) => {
    await page.goto(PATH);
    const summary = page.locator("details summary").first();
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(page.locator("details").first()).toHaveAttribute("open", "");
  });

  for (const width of [360, 390, 768]) {
    test(`does not scroll horizontally at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(PATH);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - window.innerWidth
      );
      expect(overflow).toBeLessThanOrEqual(0);
    });
  }
});
