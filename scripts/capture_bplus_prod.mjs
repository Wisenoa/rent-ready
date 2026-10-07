import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdirSync, copyFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PORT = 4886;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const REPO_OUT_DIR = join(process.cwd(), "docs/design/planches/bplus_prod");
const BRAIN_OUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/bplus_prod";

mkdirSync(REPO_OUT_DIR, { recursive: true });
mkdirSync(BRAIN_OUT_DIR, { recursive: true });

async function waitForServer(url, timeoutMs = 45000) {
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
    await waitForServer(`${BASE_URL}/design-preview/system-inventory`);
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
      // 01. Dashboard Desktop Exception
      {
        name: "01_dashboard_prod_1440_exception.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=standard_exception&resolved=false`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "dashboard_prod_desktop_exception",
      },
      // 02. Dashboard Desktop Resolved (Mechanical Retraction)
      {
        name: "02_dashboard_prod_1440_resolved.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=standard_resolved&resolved=true`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "dashboard_prod_desktop_resolved",
      },
      // 03. Dashboard Desktop Dense 10 units
      {
        name: "03_dashboard_prod_1440_10_units.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=dense_10&resolved=false`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "dashboard_prod_desktop_dense_10",
      },
      // 04. Dashboard Mobile 390px Exception
      {
        name: "04_dashboard_prod_390_exception.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=standard_exception&resolved=false`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "dashboard_prod_mobile_390_exception",
      },
      // 05. Dashboard Mobile 390px Resolved
      {
        name: "05_dashboard_prod_390_resolved.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=standard_resolved&resolved=true`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "dashboard_prod_mobile_390_resolved",
      },
      // 06. Dashboard Mobile 360px Stress
      {
        name: "06_dashboard_prod_360_stress.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=stress_long&resolved=false`,
        viewport: { width: 360, height: 740 },
        fullPage: true,
        measureKey: "dashboard_prod_mobile_360_stress",
      },
      // 07. Home Base Desktop 1440px Exception
      {
        name: "07_homebase_prod_1440_exception.png",
        url: `${BASE_URL}/design-preview/homebase-v21?mode=nantes_exception&resolved=false`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "homebase_prod_desktop_exception",
      },
      // 08. Home Base Desktop 1440px Resolved
      {
        name: "08_homebase_prod_1440_resolved.png",
        url: `${BASE_URL}/design-preview/homebase-v21?mode=nantes_resolved&resolved=true`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "homebase_prod_desktop_resolved",
      },
      // 09. Home Base Mobile 390px Exception
      {
        name: "09_homebase_prod_390_exception.png",
        url: `${BASE_URL}/design-preview/homebase-v21?mode=nantes_exception&resolved=false`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "homebase_prod_mobile_390_exception",
      },
      // 10. Home Base Mobile 390px Resolved
      {
        name: "10_homebase_prod_390_resolved.png",
        url: `${BASE_URL}/design-preview/homebase-v21?mode=nantes_resolved&resolved=true`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "homebase_prod_mobile_390_resolved",
      },
      // 11. Home Base Mobile 360px Stress (Long Content)
      {
        name: "11_homebase_prod_360_stress.png",
        url: `${BASE_URL}/design-preview/homebase-v21?mode=long_content&resolved=false`,
        viewport: { width: 360, height: 740 },
        fullPage: true,
        measureKey: "homebase_prod_mobile_360_stress",
      },
      // 12. Design System Inventory
      {
        name: "12_design_system_inventory.png",
        url: `${BASE_URL}/design-preview/system-inventory`,
        viewport: { width: 1440, height: 1200 },
        fullPage: true,
        measureKey: "design_system_inventory",
      },
    ];

    for (const cap of captures) {
      console.log(`Capturing ${cap.name} (${cap.viewport.width}x${cap.viewport.height})...`);
      const context = await browser.newContext({
        viewport: cap.viewport,
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();
      await new Promise((r) => setTimeout(r, 800));
      await page.goto(cap.url, { waitUntil: "networkidle" });
      await setupPage(page);
      await page.waitForTimeout(600);

      // Perform DOM metrics if applicable
      const metrics = await page.evaluate(() => {
        const bodyHeight = document.body.scrollHeight;
        const rows = document.querySelectorAll("[data-testid='rent-row'], [data-rent-row='true']");
        let activeRowHeight = null;
        let resolvedRowHeight = null;
        rows.forEach((r) => {
          const h = r.getBoundingClientRect().height;
          if (r.textContent.includes("À pointer") || r.textContent.includes("En attente")) {
            activeRowHeight = h;
          } else {
            resolvedRowHeight = h;
          }
        });

        const cards = document.querySelectorAll("[data-testid='property-card'], .rounded-2xl, .rounded-xl");
        return {
          bodyHeight,
          rowCount: rows.length,
          activeRowHeight,
          resolvedRowHeight,
          cardCount: cards.length,
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
      console.log(`Saved -> ${repoPath}`);
      await context.close();
    }

    await browser.close();

    const metricsPath = join(REPO_OUT_DIR, "production_measurements.json");
    writeFileSync(metricsPath, JSON.stringify(measurements, null, 2), "utf8");
    copyFileSync(metricsPath, join(BRAIN_OUT_DIR, "production_measurements.json"));
    console.log(`Measurements saved to ${metricsPath}`);
    console.log("All 12 visual regression captures completed successfully!");
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
