import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdirSync, copyFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PORT = 4889;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const REPO_OUT_DIR = join(process.cwd(), "docs/design/planches/anti-ai-pass");
const BRAIN_OUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/anti-ai-pass";

mkdirSync(REPO_OUT_DIR, { recursive: true });
mkdirSync(BRAIN_OUT_DIR, { recursive: true });

async function waitForServer(url, timeoutMs = 60000) {
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
    env: {
      ...process.env,
      PORT: String(PORT),
      BETTER_AUTH_URL: BASE_URL,
      NEXT_PUBLIC_APP_URL: BASE_URL,
      NEXT_PUBLIC_AUTH_URL: BASE_URL,
    },
  });

  const measurements = {};

  try {
    await waitForServer(`${BASE_URL}/design-preview/dashboard-v21?mode=standard_exception&resolved=false`);
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
    };

    const captures = [
      // 02. Dashboard Desktop AFTER 1440px
      {
        name: "02_dashboard_AFTER_1440.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=standard_exception&resolved=false`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "dashboard_after_1440",
      },
      // 04. Dashboard Mobile AFTER 390px
      {
        name: "04_dashboard_AFTER_390.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=standard_exception&resolved=false`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "dashboard_after_390",
      },
      // 06. Standalone Lease Form Desktop AFTER 1440px
      {
        name: "06_lease_form_AFTER_1440.png",
        url: `${BASE_URL}/design-preview/wave2?mode=lease_form`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "lease_form_after_1440",
      },
      // 08. Standalone Lease Form Mobile AFTER 390px
      {
        name: "08_lease_form_AFTER_390.png",
        url: `${BASE_URL}/design-preview/wave2?mode=lease_form`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "lease_form_after_390",
      },
      // 09. Billing Desktop AFTER 1440px
      {
        name: "09_billing_AFTER_1440.png",
        url: `${BASE_URL}/design-preview/wave2?mode=billing_standard`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "billing_after_1440",
      },
      // 10. Billing Mobile AFTER 390px
      {
        name: "10_billing_AFTER_390.png",
        url: `${BASE_URL}/design-preview/wave2?mode=billing_standard`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "billing_after_390",
      },
      // 11. Lease View Desktop AFTER 1440px
      {
        name: "11_lease_view_AFTER_1440.png",
        url: `${BASE_URL}/design-preview/wave2?mode=lease_view`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "lease_view_after_1440",
      },
      // 12. Lease View Mobile AFTER 390px
      {
        name: "12_lease_view_AFTER_390.png",
        url: `${BASE_URL}/design-preview/wave2?mode=lease_view`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "lease_view_after_390",
      },
    ];

    for (const cap of captures) {
      console.log(`Capturing ${cap.name} (${cap.viewport.width}x${cap.viewport.height})...`);
      const context = await browser.newContext({
        viewport: cap.viewport,
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      await new Promise((r) => setTimeout(r, 600));
      await page.goto(cap.url, { waitUntil: "networkidle" });
      await setupPage(page);
      await page.waitForTimeout(600);

      // DOM Metrics
      const metrics = await page.evaluate(() => {
        const bodyHeight = document.body.scrollHeight;
        const fontFamilies = Array.from(document.querySelectorAll("h1, h2, h3, span, p")).map(
          (el) => window.getComputedStyle(el).fontFamily
        );
        const bgColors = Array.from(document.querySelectorAll("body, main, div, header")).map(
          (el) => window.getComputedStyle(el).backgroundColor
        );
        return {
          bodyHeight,
          sampleFontFamilies: fontFamilies.slice(0, 5),
          sampleBgColors: bgColors.slice(0, 5),
        };
      });

      measurements[cap.measureKey] = {
        viewport: `${cap.viewport.width}x${cap.viewport.height}`,
        ...metrics,
      };

      const repoPath = join(REPO_OUT_DIR, cap.name);
      const brainPath = join(BRAIN_OUT_DIR, cap.name);

      await page.screenshot({ path: repoPath, fullPage: cap.fullPage });
      copyFileSync(repoPath, brainPath);
      console.log(`Saved -> ${repoPath} and ${brainPath}`);
      await context.close();
    }

    await browser.close();

    const measurementsPath = join(REPO_OUT_DIR, "anti_ai_measurements.json");
    writeFileSync(measurementsPath, JSON.stringify(measurements, null, 2));
    copyFileSync(measurementsPath, join(BRAIN_OUT_DIR, "anti_ai_measurements.json"));
    console.log(`Measurements saved to ${measurementsPath}`);
  } finally {
    console.log("Shutting down dev server...");
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
