import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdirSync, copyFileSync, statSync } from "node:fs";
import { join } from "node:path";

const PORT = 4860;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const REPO_OUT_DIR = join(process.cwd(), "docs/design/planches/directions");
const BRAIN_OUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/directions";

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
    await waitForServer(`${BASE_URL}/design-preview/b-plus`);
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
    // 1. DESKTOP 1440px CONTEXT
    // ─────────────────────────────────────────────────────────────
    {
      console.log("\n--- Capturing Desktop Boards ---");
      const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
      });
      await context.addInitScript(() => {
        localStorage.setItem("rentready_cookie_consent", "accepted");
      });
      const page = await context.newPage();

      // State: Exception active
      await page.goto(`${BASE_URL}/design-preview/b-plus`, { waitUntil: "networkidle" });
      await page.waitForTimeout(800);
      await setupPage(page);
      await page.waitForTimeout(300);

      // Board 1: Desktop Viewport Exception
      const b1 = join(REPO_OUT_DIR, "BPLUS_V2_desktop_exception_1440.png");
      await page.screenshot({ path: b1, fullPage: false });
      copyFileSync(b1, join(BRAIN_OUT_DIR, "BPLUS_V2_desktop_exception_1440.png"));
      console.log(`✓ Board 1: BPLUS_V2_desktop_exception_1440.png (${statSync(b1).size} bytes)`);

      // Board 3: Desktop Full Page
      const b3 = join(REPO_OUT_DIR, "BPLUS_V2_desktop_full_1440.png");
      await page.screenshot({ path: b3, fullPage: true });
      copyFileSync(b3, join(BRAIN_OUT_DIR, "BPLUS_V2_desktop_full_1440.png"));
      console.log(`✓ Board 3: BPLUS_V2_desktop_full_1440.png (${statSync(b3).size} bytes)`);

      // Resolve exception via action button
      console.log("Resolving exception via 'Marquer les 400 € reçus' button...");
      const resolveBtn = page.locator('button:has-text("Marquer les 400")');
      if (await resolveBtn.count() > 0) {
        await resolveBtn.click();
      } else {
        await page.goto(`${BASE_URL}/design-preview/b-plus?state=resolved`, { waitUntil: "networkidle" });
      }
      await page.waitForTimeout(600);
      await setupPage(page);
      await page.waitForTimeout(300);

      // Board 2: Desktop Viewport Resolved
      const b2 = join(REPO_OUT_DIR, "BPLUS_V2_desktop_resolved_1440.png");
      await page.screenshot({ path: b2, fullPage: false });
      copyFileSync(b2, join(BRAIN_OUT_DIR, "BPLUS_V2_desktop_resolved_1440.png"));
      console.log(`✓ Board 2: BPLUS_V2_desktop_resolved_1440.png (${statSync(b2).size} bytes)`);

      await context.close();
    }

    // ─────────────────────────────────────────────────────────────
    // 2. MOBILE 390px CONTEXT
    // ─────────────────────────────────────────────────────────────
    {
      console.log("\n--- Capturing Mobile Boards ---");
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

      // State: Exception active
      await page.goto(`${BASE_URL}/design-preview/b-plus`, { waitUntil: "networkidle" });
      await page.waitForTimeout(800);
      await setupPage(page);
      await page.waitForTimeout(300);

      // Board 4: Mobile Viewport Exception
      const b4 = join(REPO_OUT_DIR, "BPLUS_V2_mobile_exception_390.png");
      await page.screenshot({ path: b4, fullPage: false });
      copyFileSync(b4, join(BRAIN_OUT_DIR, "BPLUS_V2_mobile_exception_390.png"));
      console.log(`✓ Board 4: BPLUS_V2_mobile_exception_390.png (${statSync(b4).size} bytes)`);

      // Board 6: Mobile Full Page
      const b6 = join(REPO_OUT_DIR, "BPLUS_V2_mobile_full_390.png");
      await page.screenshot({ path: b6, fullPage: true });
      copyFileSync(b6, join(BRAIN_OUT_DIR, "BPLUS_V2_mobile_full_390.png"));
      console.log(`✓ Board 6: BPLUS_V2_mobile_full_390.png (${statSync(b6).size} bytes)`);

      // Resolve exception
      const resolveBtn = page.locator('button:has-text("Marquer les 400")');
      if (await resolveBtn.count() > 0) {
        await resolveBtn.click();
      } else {
        await page.goto(`${BASE_URL}/design-preview/b-plus?state=resolved`, { waitUntil: "networkidle" });
      }
      await page.waitForTimeout(600);
      await setupPage(page);
      await page.waitForTimeout(300);

      // Board 5: Mobile Viewport Resolved
      const b5 = join(REPO_OUT_DIR, "BPLUS_V2_mobile_resolved_390.png");
      await page.screenshot({ path: b5, fullPage: false });
      copyFileSync(b5, join(BRAIN_OUT_DIR, "BPLUS_V2_mobile_resolved_390.png"));
      console.log(`✓ Board 5: BPLUS_V2_mobile_resolved_390.png (${statSync(b5).size} bytes)`);

      await context.close();
    }

    await browser.close();
    console.log("\nAll 6 boards successfully captured and verified!");
  } finally {
    console.log("Shutting down dev server...");
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error("Capture script error:", err);
  process.exit(1);
});
