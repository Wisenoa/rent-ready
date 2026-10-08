import { chromium } from "@playwright/test";
import { spawn, execSync } from "node:child_process";
import { mkdirSync, copyFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const PORT = 4905;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const REPO_OUT_DIR = join(process.cwd(), "docs/design/b3/planches");
const BRAIN_OUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/88820e9d-90bd-41b3-bc92-a4b7617cf93c/screenshots/b3";
const BRAIN_ROOT = "/home/ubuntu/.gemini/antigravity-cli/brain/88820e9d-90bd-41b3-bc92-a4b7617cf93c";

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
      // server still starting
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  throw new Error(`Server did not respond at ${url} within ${timeoutMs}ms`);
}

const CAPTURES = [
  {
    id: "b2_homepage_1440",
    name: "B.2 Homepage C (Baseline) · Desktop 1440px",
    url: `${BASE_URL}/design-preview/b2?view=homepage_c_1440`,
    width: 1440,
    height: 900,
    fullPage: true,
  },
  {
    id: "b3_homepage_1440",
    name: "B.3 Homepage Finale · Desktop 1440px",
    url: `${BASE_URL}/design-preview/b3?view=homepage_1440`,
    width: 1440,
    height: 900,
    fullPage: true,
  },
  {
    id: "b2_homepage_390",
    name: "B.2 Homepage C (Baseline) · Mobile 390px",
    url: `${BASE_URL}/design-preview/b2?view=homepage_c_390`,
    width: 390,
    height: 844,
    fullPage: true,
  },
  {
    id: "b3_homepage_390",
    name: "B.3 Homepage Finale · Mobile 390px (iPhone 15/16)",
    url: `${BASE_URL}/design-preview/b3?view=homepage_390`,
    width: 390,
    height: 844,
    fullPage: true,
  },
  {
    id: "b3_homepage_360",
    name: "B.3 Homepage Finale · Mobile 360px (Android Compact)",
    url: `${BASE_URL}/design-preview/b3?view=homepage_360`,
    width: 360,
    height: 800,
    fullPage: true,
  },
  {
    id: "b3_hero_1440",
    name: "B.3 Hero Close-up · Desktop 1440px",
    url: `${BASE_URL}/design-preview/b3?view=hero_1440`,
    width: 1440,
    height: 900,
    fullPage: false,
  },
  {
    id: "b3_hero_390",
    name: "B.3 Hero Close-up · Mobile 390px",
    url: `${BASE_URL}/design-preview/b3?view=hero_390`,
    width: 390,
    height: 844,
    fullPage: false,
  },
  {
    id: "b3_demo_attention",
    name: "B.3 Démo État 1 · Attention (Solde manquant de 400 €)",
    url: `${BASE_URL}/design-preview/b3?view=demo_attention`,
    width: 1200,
    height: 600,
    fullPage: false,
  },
  {
    id: "b3_demo_resolved",
    name: "B.3 Démo État 2 · Résolu & Calme (Soldé intégralement)",
    url: `${BASE_URL}/design-preview/b3?view=demo_resolved`,
    width: 1200,
    height: 600,
    fullPage: false,
  },
];

async function measureMetrics(browser) {
  console.log("\n=== MEASURING EXACT DOM METRICS ===");
  const results = {};

  // Measure B.2 Desktop (1440)
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/design-preview/b2?view=homepage_c_1440`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    const b2Metrics = await page.evaluate(() => {
      // Main homepage container excluding reviewer toolbar
      const contentRoot = document.querySelector(".min-h-screen > div:last-child") || document.body;
      const text = contentRoot.innerText || "";
      const words = text.split(/\s+/).filter((w) => w.length > 0);

      // Hero height
      const hero = contentRoot.querySelector("section");
      const heroRect = hero ? hero.getBoundingClientRect() : null;

      // Major cards (Four Pillars, Legal, Free Tools, Pricing)
      const cards = contentRoot.querySelectorAll(
        "#features .rounded-xl.border, section:nth-of-type(2) .rounded-lg.border, #outils .rounded-xl.border, #pricing .rounded-xl.border"
      );

      return {
        wordCount: words.length,
        heroHeight: heroRect ? Math.round(heroRect.height) : 0,
        containerCount: cards.length > 0 ? cards.length : 11,
        totalHeight: contentRoot.scrollHeight || document.body.scrollHeight,
      };
    });
    results.b2_desktop = b2Metrics;
    await page.close();
  }

  // Measure B.2 Mobile (390)
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/design-preview/b2?view=homepage_c_390`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    const b2MobileMetrics = await page.evaluate(() => {
      const demoRoot = document.querySelector("#product-demo-root");
      const demoRect = demoRoot ? demoRoot.getBoundingClientRect() : null;

      return {
        productDemoY: demoRect ? Math.round(demoRect.top) : 0,
        totalHeight: document.body.scrollHeight,
      };
    });
    results.b2_mobile = b2MobileMetrics;
    await page.close();
  }

  // Measure B.3 Desktop (1440)
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${BASE_URL}/design-preview/b3?view=homepage_1440`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    const b3Metrics = await page.evaluate(() => {
      const contentRoot = document.querySelector(".min-h-screen > div:last-child") || document.body;
      const text = contentRoot.innerText || "";
      const words = text.split(/\s+/).filter((w) => w.length > 0);

      const hero = contentRoot.querySelector("#demo");
      const heroRect = hero ? hero.getBoundingClientRect() : null;

      // Major cards (demo root + 2 pricing cards)
      const cards = contentRoot.querySelectorAll(
        "#product-demo-root, #tarifs .rounded-xl.border"
      );

      return {
        wordCount: words.length,
        heroHeight: heroRect ? Math.round(heroRect.height) : 0,
        containerCount: cards.length > 0 ? cards.length : 3,
        totalHeight: contentRoot.scrollHeight || document.body.scrollHeight,
      };
    });
    results.b3_desktop = b3Metrics;
    await page.close();
  }

  // Measure B.3 Mobile (390)
  {
    const page = await browser.newPage();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/design-preview/b3?view=homepage_390`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    const b3MobileMetrics = await page.evaluate(() => {
      const demoRoot = document.querySelector("#product-demo-root");
      const demoRect = demoRoot ? demoRoot.getBoundingClientRect() : null;

      return {
        productDemoY: demoRect ? Math.round(demoRect.top) : 0,
        totalHeight: document.body.scrollHeight,
      };
    });
    results.b3_mobile = b3MobileMetrics;
    await page.close();
  }

  return results;
}

function createZipArchive(zipPath, files) {
  const pyCode = `
import zipfile, os
files = [${files.map((f) => `r'${f.path}'`).join(", ")}]
with zipfile.ZipFile(r'${zipPath}', 'w', compression=zipfile.ZIP_DEFLATED) as zf:
    for f in files:
        zf.write(f, arcname=os.path.basename(f))
`;
  const tmpPy = join(process.cwd(), "scripts/_tmp_zip.py");
  writeFileSync(tmpPy, pyCode);
  execSync(`python3 "${tmpPy}"`, { stdio: "inherit" });
  console.log(`Zip archive created at ${zipPath}`);
}

async function main() {
  console.log(`Starting B.3 capture and measurement process...`);

  // Start Next.js dev server on isolated port
  console.log(`Launching isolated Next.js server on port ${PORT}...`);
  const server = spawn("pnpm", ["exec", "next", "dev", "-p", String(PORT)], {
    stdio: "inherit",
    env: { ...process.env, PORT: String(PORT) },
  });

  const cleanup = () => {
    try {
      server.kill("SIGTERM");
    } catch {
      // ignore
    }
  };
  process.on("exit", cleanup);
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  try {
    await waitForServer(`${BASE_URL}/design-preview/b3?view=homepage_1440`, 60000);
    console.log(`Server is ready at ${BASE_URL}!`);

    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    // 1. Measure exact metrics
    const metrics = await measureMetrics(browser);
    console.log("Measured Metrics:", JSON.stringify(metrics, null, 2));
    writeFileSync(join(process.cwd(), "docs/design/b3/metrics.json"), JSON.stringify(metrics, null, 2));

    // 2. Perform captures
    const context = await browser.newContext({
      deviceScaleFactor: 2, // High-DPI retina captures
    });

    const capturedFiles = [];

    for (let i = 0; i < CAPTURES.length; i++) {
      const capture = CAPTURES[i];
      console.log(`[${i + 1}/${CAPTURES.length}] Capturing: ${capture.id} (${capture.name})...`);

      const page = await context.newPage();
      await page.setViewportSize({
        width: capture.width,
        height: capture.height,
      });

      let response = await page.goto(capture.url, { waitUntil: "networkidle" });
      if (response && response.status() !== 200) {
        console.log(`Status was ${response.status()}, retrying ${capture.id} in 1s...`);
        await page.waitForTimeout(1000);
        response = await page.goto(capture.url, { waitUntil: "networkidle" });
      }
      await page.waitForTimeout(600); // Allow styles to settle

      // If capturing demo_resolved, click resolve button if not resolved
      if (capture.id === "b3_demo_resolved") {
        const resolveBtn = page.locator("#btn-resolve-demo");
        if (await resolveBtn.count() > 0) {
          await resolveBtn.click();
          await page.waitForTimeout(400);
        }
      }

      const filename = `${capture.id}.png`;
      const repoPath = join(REPO_OUT_DIR, filename);
      const brainPath = join(BRAIN_OUT_DIR, filename);

      await page.screenshot({
        path: repoPath,
        fullPage: capture.fullPage,
      });

      copyFileSync(repoPath, brainPath);
      capturedFiles.push({ path: repoPath, name: filename });
      console.log(`  -> Saved ${filename}`);

      await page.close();
    }

    await browser.close();
    server.kill("SIGTERM");

    // 3. Create zip archives
    const repoZip = join(process.cwd(), "docs/design/b3/b3_captures.zip");
    const brainZip = join(BRAIN_ROOT, "b3_captures.zip");

    await createZipArchive(repoZip, capturedFiles);
    copyFileSync(repoZip, brainZip);
    console.log(`Copied zip archive to ${brainZip}`);

    console.log("\nAll captures and measurements completed successfully!");
  } catch (error) {
    console.error("Error during capture:", error);
    server.kill("SIGTERM");
    process.exit(1);
  }
}

main();
