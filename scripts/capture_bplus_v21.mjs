import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdirSync, copyFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PORT = 4882;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const REPO_OUT_DIR = join(process.cwd(), "docs/design/planches/bplus_v21");
const BRAIN_OUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/bplus_v21";

mkdirSync(REPO_OUT_DIR, { recursive: true });
mkdirSync(BRAIN_OUT_DIR, { recursive: true });

async function waitForServer(url, timeoutMs = 35000) {
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

  const measurements = {};

  try {
    await waitForServer(`${BASE_URL}/design-preview/dashboard-v21`);
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
        name: "01_dashboard_1440_exception.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=standard_exception&resolved=false`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "dashboard_desktop_exception",
      },
      // 02. Dashboard Desktop Resolved (Mechanical Retraction)
      {
        name: "02_dashboard_1440_resolved.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=standard_resolved&resolved=true`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "dashboard_desktop_resolved",
      },
      // 03. Dashboard Desktop Dense 10 units
      {
        name: "03_dashboard_1440_dense_10_units.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=dense_10&resolved=false`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "dashboard_desktop_dense_10",
      },
      // 04. Dashboard Mobile 390px Exception
      {
        name: "04_dashboard_390_exception.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=standard_exception&resolved=false`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "dashboard_mobile_390_exception",
      },
      // 05. Dashboard Mobile 390px Resolved
      {
        name: "05_dashboard_390_resolved.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=standard_resolved&resolved=true`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "dashboard_mobile_390_resolved",
      },
      // 06. Dashboard Mobile 390px Multi-Exception
      {
        name: "06_dashboard_390_multi_exception.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=multi_exception&resolved=false`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "dashboard_mobile_390_multi",
      },
      // 07. Dashboard Mobile 360px Stress Long Content
      {
        name: "07_dashboard_360_stress.png",
        url: `${BASE_URL}/design-preview/dashboard-v21?mode=stress_long&resolved=false`,
        viewport: { width: 360, height: 740 },
        fullPage: true,
        measureKey: "dashboard_mobile_360_stress",
      },
      // 08. Homebase Desktop 1440px Exception
      {
        name: "08_homebase_1440_exception.png",
        url: `${BASE_URL}/design-preview/homebase-v21?mode=nantes_exception&resolved=false`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "homebase_desktop_exception",
      },
      // 09. Homebase Desktop 1440px Resolved
      {
        name: "09_homebase_1440_resolved.png",
        url: `${BASE_URL}/design-preview/homebase-v21?mode=nantes_resolved&resolved=true`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "homebase_desktop_resolved",
      },
      // 10. Homebase Mobile 390px Exception
      {
        name: "10_homebase_390_exception.png",
        url: `${BASE_URL}/design-preview/homebase-v21?mode=nantes_exception&resolved=false`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "homebase_mobile_390_exception",
      },
      // 11. Homebase Mobile 390px Resolved
      {
        name: "11_homebase_390_resolved.png",
        url: `${BASE_URL}/design-preview/homebase-v21?mode=nantes_resolved&resolved=true`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "homebase_mobile_390_resolved",
      },
      // 12. Homebase Mobile 360px Long Content
      {
        name: "12_homebase_360_long_content.png",
        url: `${BASE_URL}/design-preview/homebase-v21?mode=stress_long&resolved=false`,
        viewport: { width: 360, height: 740 },
        fullPage: true,
        measureKey: "homebase_mobile_360_stress",
      },
      // 13. Visual Language V2.1 Synthesis Board
      {
        name: "13_bplus_v21_visual_language.png",
        url: `${BASE_URL}/design-preview/visual-language-v21`,
        viewport: { width: 1440, height: 1200 },
        fullPage: true,
        measureKey: "visual_language_v21",
      },
      // 14. Before / After Density Comparison Board
      {
        name: "14_before_after_density.png",
        url: `${BASE_URL}/design-preview/density-comparison`,
        viewport: { width: 1440, height: 1100 },
        fullPage: true,
        measureKey: "density_comparison",
      },
    ];

    for (const item of captures) {
      console.log(`Capturing ${item.name} (${item.viewport.width}x${item.viewport.height})...`);
      const context = await browser.newContext({
        viewport: item.viewport,
        deviceScaleFactor: 2,
      });
      const page = await context.newPage();

      let res;
      for (let attempt = 1; attempt <= 3; attempt++) {
        res = await page.goto(item.url, { waitUntil: "networkidle" });
        if (res && res.status() === 200) {
          break;
        }
        console.warn(`Attempt ${attempt} for ${item.name} status ${res?.status() || "err"}. Retrying in 1.5s...`);
        await page.waitForTimeout(1500);
      }

      await setupPage(page);
      await page.waitForTimeout(600);

      // Mesures de hauteurs et surfaces
      const pageHeight = await page.evaluate(() => document.body.scrollHeight);
      measurements[item.measureKey] = {
        viewportWidth: item.viewport.width,
        viewportHeight: item.viewport.height,
        documentHeight: pageHeight,
      };

      const repoPath = join(REPO_OUT_DIR, item.name);
      const brainPath = join(BRAIN_OUT_DIR, item.name);

      await page.screenshot({
        path: repoPath,
        fullPage: item.fullPage,
      });
      copyFileSync(repoPath, brainPath);

      await context.close();
      console.log(`  -> Saved to ${repoPath} (Height: ${pageHeight}px)`);
    }

    await browser.close();

    // Écriture du fichier de mesures brutes
    writeFileSync(
      join(REPO_OUT_DIR, "measurements.json"),
      JSON.stringify(measurements, null, 2),
      "utf-8"
    );
    console.log("Measurements saved to measurements.json");
    console.log("All 14 planches captured successfully!");
  } finally {
    console.log("Stopping Next.js server...");
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
