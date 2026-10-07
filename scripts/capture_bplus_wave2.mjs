import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdirSync, copyFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PORT = 4887;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const REPO_OUT_DIR = join(process.cwd(), "docs/design/planches/bplus_wave2");
const BRAIN_OUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/bplus_wave2";

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
    await waitForServer(`${BASE_URL}/design-preview/wave2?mode=billing_standard`);
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
      // 01. Billing Desktop Standard
      {
        name: "01_billing_1440_standard.png",
        url: `${BASE_URL}/design-preview/wave2?mode=billing_standard`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "billing_desktop_standard",
      },
      // 02. Billing Desktop Partial Payment / Arrears
      {
        name: "02_billing_1440_partial.png",
        url: `${BASE_URL}/design-preview/wave2?mode=billing_partial`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "billing_desktop_partial",
      },
      // 03. Billing Desktop Dense Multi-Unit Ledger
      {
        name: "03_billing_1440_dense.png",
        url: `${BASE_URL}/design-preview/wave2?mode=billing_dense`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "billing_desktop_dense",
      },
      // 04. Billing Mobile 390px Partial
      {
        name: "04_billing_390_partial.png",
        url: `${BASE_URL}/design-preview/wave2?mode=billing_partial`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "billing_mobile_390_partial",
      },
      // 05. Billing Mobile 360px Dense
      {
        name: "05_billing_360_dense.png",
        url: `${BASE_URL}/design-preview/wave2?mode=billing_dense`,
        viewport: { width: 360, height: 740 },
        fullPage: true,
        measureKey: "billing_mobile_360_dense",
      },
      // 06. Lease Consultation View Desktop
      {
        name: "06_lease_view_1440.png",
        url: `${BASE_URL}/design-preview/wave2?mode=lease_view`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "lease_view_desktop",
      },
      // 07. Standalone Lease Form Desktop
      {
        name: "07_lease_form_1440.png",
        url: `${BASE_URL}/design-preview/wave2?mode=lease_form`,
        viewport: { width: 1440, height: 900 },
        fullPage: true,
        measureKey: "lease_form_desktop",
      },
      // 08. Standalone Lease Form Mobile 390px
      {
        name: "08_lease_form_390.png",
        url: `${BASE_URL}/design-preview/wave2?mode=lease_form`,
        viewport: { width: 390, height: 844 },
        fullPage: true,
        measureKey: "lease_form_mobile_390",
      },
      // 09. Standalone Lease Form Mobile 360px Errors
      {
        name: "09_lease_form_360_errors.png",
        url: `${BASE_URL}/design-preview/wave2?mode=lease_form_errors`,
        viewport: { width: 360, height: 740 },
        fullPage: true,
        measureKey: "lease_form_mobile_360_errors",
      },
      // 12. Wave 2 Design System Extensions
      {
        name: "12_wave2_design_system_extensions.png",
        url: `${BASE_URL}/design-preview/system-inventory`,
        viewport: { width: 1440, height: 1200 },
        fullPage: true,
        measureKey: "wave2_design_system_extensions",
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
        const tables = document.querySelectorAll("table");
        const rows = document.querySelectorAll("tr, [data-slot='card']");
        const formFields = document.querySelectorAll("input, select");
        const alerts = document.querySelectorAll("[role='alert'], .text-destructive");
        return {
          bodyHeight,
          tableCount: tables.length,
          rowCount: rows.length,
          formFieldCount: formFields.length,
          alertCount: alerts.length,
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

    const metricsPath = join(REPO_OUT_DIR, "wave2_measurements.json");
    writeFileSync(metricsPath, JSON.stringify(measurements, null, 2), "utf8");
    copyFileSync(metricsPath, join(BRAIN_OUT_DIR, "wave2_measurements.json"));
    console.log(`Wrote measurements -> ${metricsPath}`);

    console.log("All Wave 2 planches captured successfully!");
  } finally {
    console.log("Stopping dev server...");
    server.kill("SIGTERM");
  }
}

main().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
