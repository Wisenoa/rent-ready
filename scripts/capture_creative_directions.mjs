import { chromium } from "@playwright/test";
import { mkdirSync, copyFileSync } from "node:fs";
import { join } from "node:path";

const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4840";
const REPO_OUT_DIR = join(process.cwd(), "docs/design/planches/directions");
const BRAIN_OUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/directions";

mkdirSync(REPO_OUT_DIR, { recursive: true });
mkdirSync(BRAIN_OUT_DIR, { recursive: true });

const DIRECTIONS = [
  { id: "A", path: "/design-preview/a", name: "The Calm Ledger (Control)" },
  { id: "B", path: "/design-preview/b", name: "L'Atelier Foncier & Typographique" },
  { id: "C", path: "/design-preview/c", name: "Le Fil du Mois" },
];

async function run() {
  console.log(`Starting capture of creative directions at ${BASE_URL}...`);
  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const dir of DIRECTIONS) {
    console.log(`\n--- Capturing Direction ${dir.id} (${dir.name}) ---`);

    // 1. DESKTOP 1440px (Hero + Transition + First Storytelling Section)
    {
      const context = await browser.newContext({
        viewport: { width: 1440, height: 1600 },
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}${dir.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);

      // Dismiss cookie banner & dev badges safely
      await page.addStyleTag({
        content: `
          nextjs-portal, [data-nextjs-dev-overlay], #nextjs-dev-indicator, [data-nextjs-toast] {
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

      const desktopFileName = `${dir.id}_desktop_1440.png`;
      const repoPath = join(REPO_OUT_DIR, desktopFileName);
      const brainPath = join(BRAIN_OUT_DIR, desktopFileName);

      await page.screenshot({
        path: repoPath,
        fullPage: true,
      });
      copyFileSync(repoPath, brainPath);
      console.log(`✓ Saved ${desktopFileName} (1440px Full Narrative)`);
      await context.close();
    }

    // 2. MOBILE 390px (Hero Viewport)
    {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 2,
        isMobile: true,
        hasTouch: true,
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}${dir.path}`, { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);

      // Dismiss cookie banner & dev badges safely
      await page.addStyleTag({
        content: `
          nextjs-portal, [data-nextjs-dev-overlay], #nextjs-dev-indicator, [data-nextjs-toast] {
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

      const mobileFileName = `${dir.id}_mobile_390.png`;
      const repoPath = join(REPO_OUT_DIR, mobileFileName);
      const brainPath = join(BRAIN_OUT_DIR, mobileFileName);

      await page.screenshot({
        path: repoPath,
        fullPage: false,
      });
      copyFileSync(repoPath, brainPath);
      console.log(`✓ Saved ${mobileFileName} (390px Hero Viewport)`);
      await context.close();
    }
  }

  await browser.close();
  console.log("\nAll 6 creative direction boards captured successfully!");
}

run().catch((err) => {
  console.error("Capture failure:", err);
  process.exit(1);
});
