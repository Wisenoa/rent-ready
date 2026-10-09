import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const PORT = 4909;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DOCS_DIR = join(process.cwd(), "docs/seo-growth/captures");
const BRAIN_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/88820e9d-90bd-41b3-bc92-a4b7617cf93c/screenshots/seo-tools";

mkdirSync(DOCS_DIR, { recursive: true });
mkdirSync(BRAIN_DIR, { recursive: true });

async function dismissConsent(page) {
  try {
    const btn = page.locator('button:has-text("Accepter")');
    if (await btn.isVisible({ timeout: 1500 })) {
      await btn.click();
      await page.waitForTimeout(300);
    }
  } catch {
    // ignore
  }
}

async function capture() {
  console.log(`Connecting to server at ${BASE_URL}...`);
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const saveScreenshots = async (page, name) => {
    const p1 = join(DOCS_DIR, `${name}.png`);
    const p2 = join(BRAIN_DIR, `${name}.png`);
    await page.screenshot({ path: p1, fullPage: true });
    await page.screenshot({ path: p2, fullPage: true });
    console.log(`Captured: ${name}.png`);
  };

  // --- 1. Generateur Quittance ---
  console.log("\nCapturing /outils/generateur-quittance...");
  
  // Desktop
  let context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  let page = await context.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));
  await page.goto(`${BASE_URL}/outils/generateur-quittance`, { waitUntil: "networkidle" });
  await dismissConsent(page);
  await saveScreenshots(page, "quittance_desktop_initial");

  // Fill all required fields
  await page.fill('#q-email', 'bailleur@example.com');
  await page.fill('#q-bailleur-nom', 'Jean Dupont');
  await page.fill('#q-locataire-nom', 'Marie Martin');
  await page.fill('#q-bailleur-adresse', '12 rue de la Paix, 75001 Paris');
  await page.fill('#q-loyer', '750');
  await page.fill('#q-charges', '50');

  const submitBtn = page.locator('button[type="submit"]');
  await submitBtn.click();
  await page.waitForTimeout(3000);
  await saveScreenshots(page, "quittance_desktop_generated");
  await context.close();

  // Mobile 390
  context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  page = await context.newPage();
  await page.goto(`${BASE_URL}/outils/generateur-quittance`, { waitUntil: "networkidle" });
  await dismissConsent(page);
  await saveScreenshots(page, "quittance_mobile_390_initial");

  await page.fill('#q-email', 'bailleur@example.com');
  await page.fill('#q-bailleur-nom', 'Jean Dupont');
  await page.fill('#q-locataire-nom', 'Marie Martin');
  await page.fill('#q-bailleur-adresse', '12 rue de la Paix, 75001 Paris');
  await page.fill('#q-loyer', '750');
  await page.fill('#q-charges', '50');

  const submitBtnMob = page.locator('button[type="submit"]');
  await submitBtnMob.click();
  await page.waitForTimeout(3000);
  await saveScreenshots(page, "quittance_mobile_390_generated");
  await context.close();

  // --- 2. Lettre Relance Loyer ---
  console.log("\nCapturing /outils/lettre-relance-loyer...");
  
  // Desktop
  context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
  page = await context.newPage();
  await page.goto(`${BASE_URL}/outils/lettre-relance-loyer`, { waitUntil: "networkidle" });
  await dismissConsent(page);
  await saveScreenshots(page, "relance_desktop_initial");
  
  const copyBtn = page.getByRole("button", { name: /copier/i });
  if (await copyBtn.isVisible()) {
    await copyBtn.click();
    await page.waitForTimeout(400);
    await saveScreenshots(page, "relance_desktop_copied");
  }
  await context.close();

  // Mobile 390
  context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  page = await context.newPage();
  await page.goto(`${BASE_URL}/outils/lettre-relance-loyer`, { waitUntil: "networkidle" });
  await dismissConsent(page);
  await saveScreenshots(page, "relance_mobile_390_initial");

  const copyBtnMob = page.getByRole("button", { name: /copier/i });
  if (await copyBtnMob.isVisible()) {
    await copyBtnMob.click();
    await page.waitForTimeout(400);
    await saveScreenshots(page, "relance_mobile_390_copied");
  }
  await context.close();

  await browser.close();
  console.log("\nAll captures complete!");
}

capture().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
