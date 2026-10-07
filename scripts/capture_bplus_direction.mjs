import { chromium } from "@playwright/test";
import { mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4840";
const REPO_OUT_DIR = join(process.cwd(), "docs/design/planches/directions");
const BRAIN_OUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/directions";

mkdirSync(REPO_OUT_DIR, { recursive: true });
mkdirSync(BRAIN_OUT_DIR, { recursive: true });

async function run() {
  console.log(`Starting capture of Direction B+ (Editorial Monthly Ledger) at ${BASE_URL}...`);
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // 1. DESKTOP 1440px - INITIAL STATE (WITH NANTES EXCEPTION ACTIVE)
  {
    console.log("Capturing BPLUS_desktop_1440.png (Initial state with exception)...");
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 2,
    });
    await context.addInitScript(() => {
      localStorage.setItem("rentready_cookie_consent", "accepted");
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/design-preview/b-plus`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    // Remove dev overlays and cookie banner if any
    await page.addStyleTag({
      content: `
        nextjs-portal, [data-nextjs-dev-overlay], #nextjs-dev-indicator, [data-nextjs-toast], [data-testid="cookie-banner"] {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `,
    });
    await page.evaluate(() => {
      document.querySelectorAll("button").forEach((b) => {
        if (b.textContent && /accepter/i.test(b.textContent)) b.click();
      });
      const cookieBanner = document.querySelector('[data-testid="cookie-banner"], [aria-label*="cookie" i], .fixed.bottom-0');
      if (cookieBanner) cookieBanner.style.display = "none";
    });
    await page.waitForTimeout(400);

    // First: Desktop Above-the-fold Viewport (Hero + Immediate Proof)
    const heroPath = join(REPO_OUT_DIR, "BPLUS_desktop_1440.png");
    await page.screenshot({ path: heroPath, fullPage: false });
    copyFileSync(heroPath, join(BRAIN_OUT_DIR, "BPLUS_desktop_1440.png"));
    console.log("✓ Saved BPLUS_desktop_1440.png (Hero Viewport 1440x900)");

    // Second: Desktop Full Narrative
    const fullPath = join(REPO_OUT_DIR, "BPLUS_desktop_full_story.png");
    await page.screenshot({ path: fullPath, fullPage: true });
    copyFileSync(fullPath, join(BRAIN_OUT_DIR, "BPLUS_desktop_full_story.png"));
    console.log("✓ Saved BPLUS_desktop_full_story.png (Full Narrative)");

    // 2. DESKTOP 1440px - RESOLVED STATE (AFTER CLICKING THE ACTION)
    console.log("Clicking action to resolve Nantes exception...");
    const resolveButton = page.locator('button:has-text("Marquer les 400")');
    if (await resolveButton.count() > 0) {
      await resolveButton.click();
    } else {
      // Fallback to top toggle
      await page.click('button:has-text("Résoudre l\'exception")');
    }
    await page.waitForTimeout(600);

    const resolvedPath = join(REPO_OUT_DIR, "BPLUS_desktop_resolved_1440.png");
    await page.screenshot({ path: resolvedPath, fullPage: true });
    copyFileSync(resolvedPath, join(BRAIN_OUT_DIR, "BPLUS_desktop_resolved_1440.png"));
    console.log("✓ Saved BPLUS_desktop_resolved_1440.png (Resolved State - Octobre 100% réglé)");

    await context.close();
  }

  // 3. MOBILE 390px
  {
    console.log("Capturing BPLUS_mobile_390.png...");
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    await context.addInitScript(() => {
      localStorage.setItem("rentready_cookie_consent", "accepted");
    });
    const page = await context.newPage();
    await page.goto(`${BASE_URL}/design-preview/b-plus`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    await page.addStyleTag({
      content: `
        nextjs-portal, [data-nextjs-dev-overlay], #nextjs-dev-indicator, [data-nextjs-toast], [data-testid="cookie-banner"] {
          display: none !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `,
    });
    await page.evaluate(() => {
      document.querySelectorAll("button").forEach((b) => {
        if (b.textContent && /accepter/i.test(b.textContent)) b.click();
      });
      const cookieBanner = document.querySelector('[data-testid="cookie-banner"], [aria-label*="cookie" i], .fixed.bottom-0');
      if (cookieBanner) cookieBanner.style.display = "none";
    });
    await page.waitForTimeout(400);

    // Mobile Above-the-fold Viewport (~800px)
    const mobileHeroPath = join(REPO_OUT_DIR, "BPLUS_mobile_390.png");
    await page.screenshot({ path: mobileHeroPath, fullPage: false });
    copyFileSync(mobileHeroPath, join(BRAIN_OUT_DIR, "BPLUS_mobile_390.png"));
    console.log("✓ Saved BPLUS_mobile_390.png (Mobile Viewport 390x844)");

    // Mobile Full Story
    const mobileFullPath = join(REPO_OUT_DIR, "BPLUS_mobile_full_390.png");
    await page.screenshot({ path: mobileFullPath, fullPage: true });
    copyFileSync(mobileFullPath, join(BRAIN_OUT_DIR, "BPLUS_mobile_full_390.png"));
    console.log("✓ Saved BPLUS_mobile_full_390.png (Mobile Full Narrative)");

    await context.close();
  }

  await browser.close();
  console.log("\nAll Direction B+ boards captured successfully!");
}

run().catch((err) => {
  console.error("Capture failure:", err);
  process.exit(1);
});
