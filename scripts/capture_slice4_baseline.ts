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
  const email = `firstrun.baseline.${timestamp}@rentready.io`;
  const password = "RentReady!2026";

  console.log("=== STARTING FIRST-RUN BASELINE MEASUREMENT ===");

  const metrics = {
    routes: [] as string[],
    clicks: 0,
    forms: 0,
    fieldsEncountered: 0,
    fieldsFilled: 0,
    contextSwitches: 0,
    deadEnds: 0,
  };

  // 1. Register
  metrics.routes.push("/register");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3344/register");
  await page.screenshot({
    path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice4_before/1_register_desktop_1440.png",
    fullPage: true,
  });

  metrics.forms++;
  metrics.fieldsEncountered += 3;
  await page.fill('input[name="name"]', "Alexandre Martin");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  metrics.fieldsFilled += 3;

  metrics.clicks++;
  await page.click('button[type="submit"]');

  // 2. Dashboard Empty State
  await page.waitForURL("**/dashboard**", { timeout: 15000 });
  metrics.routes.push("/dashboard");
  metrics.contextSwitches++;
  await page.evaluate(() => {
    localStorage.setItem("onboarding_wizard_dismissed", "1");
    localStorage.setItem("rentready_cookie_consent", "accepted");
  });

  await page.screenshot({
    path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice4_before/2_dashboard_empty_desktop_1440.png",
    fullPage: true,
  });

  // Mobile capture of empty dashboard
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice4_before/2_dashboard_empty_mobile_390.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 1440, height: 900 });

  // 3. Click "Ajouter mon premier bien" -> Navigates to /properties
  metrics.clicks++;
  await page.click('a[href="/properties"]');
  await page.waitForURL("**/properties**", { timeout: 10000 });
  metrics.routes.push("/properties");
  metrics.contextSwitches++;

  await page.screenshot({
    path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice4_before/3_properties_empty_desktop_1440.png",
    fullPage: true,
  });

  // 4. Click "Ajouter un bien manuellement"
  metrics.clicks++;
  await page.getByRole("button", { name: /ajouter un bien manuellement/i }).click();

  const propertyDialog = page.getByRole("dialog");
  await propertyDialog.waitFor({ state: "visible" });
  metrics.forms++;
  // Property dialog has: name, type, addressLine1, addressLine2, city, postalCode, surface, rooms, cadastralRef, taxRef, description (11 fields)
  metrics.fieldsEncountered += 11;

  await page.screenshot({
    path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice4_before/4_property_dialog_desktop_1440.png",
  });

  // Fill required property fields
  await propertyDialog.locator("#name").fill("T2 République");
  await propertyDialog.locator("#addressLine1").fill("15 Rue de la République");
  await propertyDialog.locator("#city").fill("Nantes");
  await propertyDialog.locator("#postalCode").fill("44000");
  metrics.fieldsFilled += 4; // plus type default is APARTMENT

  metrics.clicks++;
  await propertyDialog.locator('button[type="submit"]').click();
  await propertyDialog.waitFor({ state: "hidden" });

  // After submit: user is STUCK on /properties with 1 property card.
  // There is NO automatic redirect to the property or to lease creation.
  metrics.deadEnds++;
  console.log("Current URL after property create:", page.url());

  await page.screenshot({
    path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice4_before/5_properties_list_deadend_desktop_1440.png",
    fullPage: true,
  });

  // 5. User must manually click property card to enter Property Home Base
  metrics.clicks++;
  await page.click('text="T2 République"');
  await page.waitForURL("**/properties/**", { timeout: 10000 });
  const propertyUrl = page.url();
  metrics.routes.push(propertyUrl);
  metrics.contextSwitches++;

  await page.screenshot({
    path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice4_before/6_property_homebase_vacant_desktop_1440.png",
    fullPage: true,
  });

  // 6. On Property Home Base, clicks "Créer un bail"
  metrics.clicks++;
  await page.getByRole("link", { name: /créer un bail/i }).click();
  await page.waitForURL("**/leases/new?propertyId=**", { timeout: 10000 });
  metrics.routes.push("/leases/new");
  metrics.contextSwitches++;

  // 7. On Lease Form, clicks "+ Nouveau locataire"
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

  // 8. Fill lease finances
  metrics.forms++;
  metrics.fieldsEncountered += 12;
  await page.fill("#rentAmount", "800");
  await page.fill("#chargesAmount", "50");
  metrics.fieldsFilled += 2;

  metrics.clicks++;
  await page.getByRole("button", { name: /créer le bail/i }).click();

  // 9. Redirected to Property Home Base
  await page.waitForURL(propertyUrl, { timeout: 15000 });
  metrics.routes.push(propertyUrl);
  metrics.contextSwitches++;

  await page.screenshot({
    path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice4_before/7_property_homebase_active_desktop_1440.png",
    fullPage: true,
  });

  // 10. Navigates back to dashboard
  metrics.clicks++;
  await page.click('a[href="/dashboard"]');
  await page.waitForURL("**/dashboard**", { timeout: 10000 });
  metrics.routes.push("/dashboard");
  metrics.contextSwitches++;

  await page.screenshot({
    path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice4_before/8_dashboard_activated_desktop_1440.png",
    fullPage: true,
  });

  console.log("=== MEASURED BEFORE METRICS ===", JSON.stringify(metrics, null, 2));

  await browser.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
