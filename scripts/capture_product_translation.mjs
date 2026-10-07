import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdirSync, copyFileSync, statSync } from "node:fs";
import { join } from "node:path";

const PORT = 4870;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const REPO_OUT_DIR = join(process.cwd(), "docs/design/planches/product_translation");
const BRAIN_OUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/product_translation";

mkdirSync(REPO_OUT_DIR, { recursive: true });
mkdirSync(BRAIN_OUT_DIR, { recursive: true });

async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200) {
        return true;
      }
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not respond at ${url} within ${timeoutMs}ms`);
}

async function main() {
  console.log(`Starting isolated Next.js dev server on port ${PORT}...`);
  const server = spawn("pnpm", ["exec", "next", "dev", "-p", String(PORT)], {
    stdio: "inherit",
    detached: false,
  });

  try {
    await waitForServer(`${BASE_URL}/design-preview/app-dashboard`);
    console.log("Server is ready! Launching Playwright browser...");

    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const setupPage = async (page) => {
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
    };

    // ─────────────────────────────────────────────────────────────
    // 1. DASHBOARD DESKTOP (1440x900) — PLANCHE 01
    // ─────────────────────────────────────────────────────────────
    {
      console.log("\n--- Capturing 01_dashboard_desktop_1440.png ---");
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
      });
      await context.addInitScript(() => {
        localStorage.setItem("rentready_cookie_consent", "accepted");
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/design-preview/app-dashboard`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      await setupPage(page);
      await page.waitForTimeout(300);

      const out = join(REPO_OUT_DIR, "01_dashboard_desktop_1440.png");
      await page.screenshot({ path: out, fullPage: false });
      copyFileSync(out, join(BRAIN_OUT_DIR, "01_dashboard_desktop_1440.png"));
      console.log(`✓ 01_dashboard_desktop_1440.png (${statSync(out).size} bytes)`);

      // Également capturer l'état tout réglé pour comparaison
      const outResolved = join(REPO_OUT_DIR, "01b_dashboard_resolved_desktop_1440.png");
      await page.click('button:has-text("Tout réglé")');
      await page.waitForTimeout(400);
      await page.screenshot({ path: outResolved, fullPage: false });
      copyFileSync(outResolved, join(BRAIN_OUT_DIR, "01b_dashboard_resolved_desktop_1440.png"));
      console.log(`✓ 01b_dashboard_resolved_desktop_1440.png (${statSync(outResolved).size} bytes)`);

      await context.close();
    }

    // ─────────────────────────────────────────────────────────────
    // 2. DASHBOARD MOBILE (390x844) — PLANCHE 02
    // ─────────────────────────────────────────────────────────────
    {
      console.log("\n--- Capturing 02_dashboard_mobile_390.png ---");
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
      await page.goto(`${BASE_URL}/design-preview/app-dashboard`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      await setupPage(page);
      await page.waitForTimeout(300);

      const out = join(REPO_OUT_DIR, "02_dashboard_mobile_390.png");
      await page.screenshot({ path: out, fullPage: false });
      copyFileSync(out, join(BRAIN_OUT_DIR, "02_dashboard_mobile_390.png"));
      console.log(`✓ 02_dashboard_mobile_390.png (${statSync(out).size} bytes)`);

      // Également capturer l'état tout réglé en mobile
      const outResolved = join(REPO_OUT_DIR, "02b_dashboard_resolved_mobile_390.png");
      await page.click('button:has-text("Tout réglé")');
      await page.waitForTimeout(400);
      await page.screenshot({ path: outResolved, fullPage: false });
      copyFileSync(outResolved, join(BRAIN_OUT_DIR, "02b_dashboard_resolved_mobile_390.png"));
      console.log(`✓ 02b_dashboard_resolved_mobile_390.png (${statSync(outResolved).size} bytes)`);

      await context.close();
    }

    // ─────────────────────────────────────────────────────────────
    // 3. PROPERTY HOME BASE DESKTOP (1440x900) — PLANCHE 03 & 03B
    // ─────────────────────────────────────────────────────────────
    {
      console.log("\n--- Capturing 03_homebase_desktop_1440.png ---");
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
      });
      await context.addInitScript(() => {
        localStorage.setItem("rentready_cookie_consent", "accepted");
      });
      const page = await context.newPage();

      // État B : Exception active (Nantes 400 €)
      await page.goto(`${BASE_URL}/design-preview/app-homebase?property=nantes`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      await setupPage(page);
      await page.waitForTimeout(300);

      const out = join(REPO_OUT_DIR, "03_homebase_desktop_1440.png");
      await page.screenshot({ path: out, fullPage: false });
      copyFileSync(out, join(BRAIN_OUT_DIR, "03_homebase_desktop_1440.png"));
      console.log(`✓ 03_homebase_desktop_1440.png (État B Exception) (${statSync(out).size} bytes)`);

      // État A : Tout réglé (Paris Studio Oberkampf)
      await page.click('button:has-text("État A : Tout réglé")');
      await page.waitForTimeout(400);
      const outCalm = join(REPO_OUT_DIR, "03b_homebase_resolved_desktop_1440.png");
      await page.screenshot({ path: outCalm, fullPage: false });
      copyFileSync(outCalm, join(BRAIN_OUT_DIR, "03b_homebase_resolved_desktop_1440.png"));
      console.log(`✓ 03b_homebase_resolved_desktop_1440.png (État A Calme) (${statSync(outCalm).size} bytes)`);

      await context.close();
    }

    // ─────────────────────────────────────────────────────────────
    // 4. PROPERTY HOME BASE MOBILE (390x844) — PLANCHE 04 & 04B
    // ─────────────────────────────────────────────────────────────
    {
      console.log("\n--- Capturing 04_homebase_mobile_390.png ---");
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

      // État B : Exception active
      await page.goto(`${BASE_URL}/design-preview/app-homebase?property=nantes`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      await setupPage(page);
      await page.waitForTimeout(300);

      const out = join(REPO_OUT_DIR, "04_homebase_mobile_390.png");
      await page.screenshot({ path: out, fullPage: false });
      copyFileSync(out, join(BRAIN_OUT_DIR, "04_homebase_mobile_390.png"));
      console.log(`✓ 04_homebase_mobile_390.png (État B Exception) (${statSync(out).size} bytes)`);

      // État A : Calme
      await page.click('button:has-text("État A : Tout réglé")');
      await page.waitForTimeout(400);
      const outCalm = join(REPO_OUT_DIR, "04b_homebase_resolved_mobile_390.png");
      await page.screenshot({ path: outCalm, fullPage: false });
      copyFileSync(outCalm, join(BRAIN_OUT_DIR, "04b_homebase_resolved_mobile_390.png"));
      console.log(`✓ 04b_homebase_resolved_mobile_390.png (État A Calme) (${statSync(outCalm).size} bytes)`);

      await context.close();
    }

    // ─────────────────────────────────────────────────────────────
    // 5. VISUAL LANGUAGE v0 SYNTHESIS — rentready_visual_language_v0.png
    // ─────────────────────────────────────────────────────────────
    {
      console.log("\n--- Capturing rentready_visual_language_v0.png ---");
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
      });
      await context.addInitScript(() => {
        localStorage.setItem("rentready_cookie_consent", "accepted");
      });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/design-preview/visual-language`, { waitUntil: "networkidle" });
      await page.waitForTimeout(600);
      await setupPage(page);
      await page.waitForTimeout(300);

      const out = join(REPO_OUT_DIR, "rentready_visual_language_v0.png");
      await page.screenshot({ path: out, fullPage: true });
      copyFileSync(out, join(BRAIN_OUT_DIR, "rentready_visual_language_v0.png"));
      console.log(`✓ rentready_visual_language_v0.png (${statSync(out).size} bytes)`);

      await context.close();
    }

    await browser.close();
    console.log("\nAll Product Identity Proof boards captured successfully!");
  } finally {
    console.log("Shutting down dev server...");
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error("Capture failure:", err);
  process.exit(1);
});
