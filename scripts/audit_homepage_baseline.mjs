import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { join } from "node:path";

const PORT = 4906;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DOCS_DIR = join(process.cwd(), "docs/migrations/homepage-b3");
const CAPTURES_DIR = join(DOCS_DIR, "captures");
const BRAIN_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/88820e9d-90bd-41b3-bc92-a4b7617cf93c/screenshots/migration";

mkdirSync(DOCS_DIR, { recursive: true });
mkdirSync(CAPTURES_DIR, { recursive: true });
mkdirSync(BRAIN_DIR, { recursive: true });

async function waitForServer(url, timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200) return true;
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  throw new Error(`Server did not respond at ${url} within ${timeoutMs}ms`);
}

async function auditBaseline() {
  console.log(`Starting baseline audit on port ${PORT}...`);
  const server = spawn("pnpm", ["exec", "next", "dev", "-p", String(PORT)], {
    stdio: "inherit",
    env: { ...process.env, PORT: String(PORT) },
  });

  const cleanup = () => {
    try {
      server.kill("SIGTERM");
    } catch {}
  };
  process.on("exit", cleanup);
  process.on("SIGINT", cleanup);
  process.on("SIGTERM", cleanup);

  try {
    await waitForServer(`${BASE_URL}/`, 60000);
    console.log(`Server ready at ${BASE_URL}/`);

    const browser = await chromium.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const context = await browser.newContext({ deviceScaleFactor: 2 });
    const page = await context.newPage();

    // 1. Audit Desktop 1440
    await page.setViewportSize({ width: 1440, height: 900 });
    const startNav = Date.now();
    const res = await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    const loadTimeMs = Date.now() - startNav;

    // Collect metadata & DOM info
    const baselineData = await page.evaluate(() => {
      const title = document.title;
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute("content");
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute("href");
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute("content");
      const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute("content");
      const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute("content");
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content");
      const twitterCard = document.querySelector('meta[name="twitter:card"]')?.getAttribute("content");
      const h1s = Array.from(document.querySelectorAll("h1")).map((h) => h.innerText.trim());
      const h2s = Array.from(document.querySelectorAll("h2")).map((h) => h.innerText.trim());

      const jsonLdScripts = Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      ).map((s) => {
        try {
          return JSON.parse(s.innerHTML);
        } catch {
          return null;
        }
      });

      const links = Array.from(document.querySelectorAll("a[href]")).map((a) => ({
        text: a.innerText.trim(),
        href: a.getAttribute("href"),
      }));

      const bodyText = document.body.innerText || "";
      const wordCount = bodyText.split(/\s+/).filter((w) => w.length > 0).length;

      return {
        title,
        metaDesc,
        canonical,
        ogTitle,
        ogDesc,
        ogUrl,
        ogImage,
        twitterCard,
        h1s,
        h2s,
        jsonLdScripts,
        linksCount: links.length,
        linksSample: links.slice(0, 20),
        allLinks: links,
        wordCount,
        domNodes: document.querySelectorAll("*").length,
        scrollHeight: document.body.scrollHeight,
      };
    });

    baselineData.loadTimeMs = loadTimeMs;
    baselineData.status = res?.status();

    // Capture before_1440
    const before1440Path = join(CAPTURES_DIR, "before_1440.png");
    await page.screenshot({ path: before1440Path, fullPage: true });
    copyFileSync(before1440Path, join(BRAIN_DIR, "before_1440.png"));
    console.log("Captured before_1440.png");

    // 2. Audit Mobile 390
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    const mobileHeight = await page.evaluate(() => document.body.scrollHeight);
    baselineData.mobileScrollHeight = mobileHeight;

    // Capture before_390
    const before390Path = join(CAPTURES_DIR, "before_390.png");
    await page.screenshot({ path: before390Path, fullPage: true });
    copyFileSync(before390Path, join(BRAIN_DIR, "before_390.png"));
    console.log("Captured before_390.png");

    // Write baseline audit json
    writeFileSync(
      join(DOCS_DIR, "baseline_audit.json"),
      JSON.stringify(baselineData, null, 2),
      "utf8"
    );
    console.log("Baseline audit data saved to baseline_audit.json");

    await browser.close();
    server.kill("SIGTERM");
  } catch (err) {
    console.error("Error during baseline audit:", err);
    server.kill("SIGTERM");
    process.exit(1);
  }
}

auditBaseline();
