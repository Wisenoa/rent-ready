import "dotenv/config";
import { chromium } from "@playwright/test";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  await context.addInitScript(() => {
    localStorage.setItem("onboarding_wizard_dismissed", "1");
    localStorage.setItem("rentready_cookie_consent", "accepted");
  });
  const page = await context.newPage();

  const timestamp = Date.now();
  const email = `firstrun.after.${timestamp}@rentready.io`;
  const password = "RentReady!2026";

  console.log("=== STARTING FIRST-RUN AFTER STREAMLINED MEASUREMENT ===");

  const metrics = {
    routes: [] as string[],
    clicks: 0,
    forms: 0,
    fieldsEncountered: 0,
    fieldsFilled: 0,
    contextSwitches: 0,
    deadEnds: 0,
  };

  const screenshotsDir = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice4_after";

  // Helper for responsive captures
  async function capturePair(name: string) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.screenshot({ path: `${screenshotsDir}/${name}_desktop_1440.png`, fullPage: true });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: `${screenshotsDir}/${name}_mobile_390.png`, fullPage: true });
    await page.setViewportSize({ width: 1440, height: 900 });
  }

  // 1. Register
  metrics.routes.push("/register");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3344/register");
  await capturePair("1_register");

  metrics.forms++;
  metrics.fieldsEncountered += 3;
  await page.fill('input[name="name"]', "Alexandre Martin");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  metrics.fieldsFilled += 3;

  metrics.clicks++;
  await page.click('button[type="submit"]');

  // 2. Dashboard Empty State (Arrives directly on /dashboard)
  await page.waitForURL("**/dashboard**", { timeout: 60000 });
  metrics.routes.push("/dashboard");
  metrics.contextSwitches++;
  await page.evaluate(() => {
    localStorage.setItem("onboarding_wizard_dismissed", "1");
    localStorage.setItem("rentready_cookie_consent", "accepted");
  });

  await capturePair("2_dashboard_empty");

  // 3. Click "Ajouter mon premier logement" directly on the dashboard
  // (NO detour to /properties!)
  metrics.clicks++;
  const openModalButton = page.getByRole("button", { name: /ajouter mon premier logement/i });
  await openModalButton.click();

  const propertyDialog = page.getByRole("dialog");
  await propertyDialog.waitFor({ state: "visible" });
  metrics.forms++;
  // Essential fields only: name, type, addressLine1, postalCode, city (5 fields upfront)
  metrics.fieldsEncountered += 5;

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({ path: `${screenshotsDir}/3_property_modal_desktop_1440.png` });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: `${screenshotsDir}/3_property_modal_mobile_390.png` });
  await page.setViewportSize({ width: 1440, height: 900 });

  // Fill 4 fields (type default APARTMENT)
  await propertyDialog.locator("#name").fill("T2 République");
  await propertyDialog.locator("#addressLine1").fill("15 Rue de la République");
  await propertyDialog.locator("#postalCode").fill("44000");
  await propertyDialog.locator("#city").fill("Nantes");
  metrics.fieldsFilled += 4;

  metrics.clicks++;
  await propertyDialog.locator('button[type="submit"]').click();

  // 4. AUTOMATIC REDIRECT TO /properties/[id] (Property Home Base)
  // No dead end on /properties!
  await page.waitForURL(/\/properties\/[a-z0-9-]+$/, { timeout: 60000 });
  const propertyUrl = page.url();
  metrics.routes.push(propertyUrl);
  metrics.contextSwitches++;

  console.log("Streamlined: directly redirected to Property Home Base:", propertyUrl);

  await capturePair("4_property_homebase_vacant");

  // 5. On Property Home Base, clicks "Créer un bail"
  metrics.clicks++;
  await page.getByRole("link", { name: /créer un bail/i }).click();
  await page.waitForURL("**/leases/new?propertyId=**", { timeout: 60000 });
  metrics.routes.push("/leases/new");
  metrics.contextSwitches++;

  await capturePair("5_lease_new");

  // 6. Inline tenant creation via dialog
  metrics.clicks++;
  await page.getByRole("button", { name: /nouveau locataire/i }).click();
  const tenantDialog = page.getByRole("dialog");
  await tenantDialog.waitFor({ state: "visible" });
  metrics.forms++;
  metrics.fieldsEncountered += 12;

  await tenantDialog.locator("#firstName").fill("Lucas");
  await tenantDialog.locator("#lastName").fill("Bernard");
  await tenantDialog.locator("#email").fill(`lucas.${timestamp}@example.com`);
  await tenantDialog.locator("#phone").fill("0612345678");
  await tenantDialog.locator("#addressLine1").fill("15 Rue de la République");
  await tenantDialog.locator("#city").fill("Nantes");
  await tenantDialog.locator("#postalCode").fill("44000");
  metrics.fieldsFilled += 7;

  metrics.clicks++;
  await tenantDialog.locator('button[type="submit"]').click();
  await tenantDialog.waitFor({ state: "hidden" });

  // 7. Fill lease finances
  metrics.forms++;
  metrics.fieldsEncountered += 8; // Streamlined standalone lease form essential fields
  await page.fill("#rentAmount", "800");
  await page.fill("#chargesAmount", "50");
  metrics.fieldsFilled += 2;

  metrics.clicks++;
  await page.getByRole("button", { name: /créer le bail/i }).click();

  // 8. Streamlined redirect: directly to Property Home Base with ?activated=1
  await page.waitForURL(/\/properties\/[a-z0-9-]+\?activated=1/, { timeout: 60000 });
  metrics.routes.push(page.url());
  metrics.contextSwitches++;

  console.log("Arrived at Activated Property Home Base with banner:", page.url());

  await capturePair("6_property_homebase_activated");

  // 9. Click "Voir mon tableau de bord" on the success banner
  metrics.clicks++;
  await page.getByRole("link", { name: /voir mon tableau de bord/i }).click();
  await page.waitForURL("**/dashboard**", { timeout: 60000 });
  metrics.routes.push("/dashboard");
  metrics.contextSwitches++;

  await capturePair("7_dashboard_activated");

  console.log("=== MEASURED AFTER METRICS ===", JSON.stringify(metrics, null, 2));

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
