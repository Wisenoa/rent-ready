import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { join } from "node:path";

const PORT = 4908;
const BASE_URL = `http://127.0.0.1:${PORT}`;
const DOCS_DIR = join(process.cwd(), "docs/migrations/homepage-b3");
const CAPTURES_DIR = join(DOCS_DIR, "captures");
const BRAIN_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/88820e9d-90bd-41b3-bc92-a4b7617cf93c/screenshots/migration";

mkdirSync(DOCS_DIR, { recursive: true });
mkdirSync(CAPTURES_DIR, { recursive: true });
mkdirSync(BRAIN_DIR, { recursive: true });

async function runAfterAudit() {
  console.log(`Connecting to server at ${BASE_URL}/...`);

  const browser = await chromium.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const context = await browser.newContext({ deviceScaleFactor: 2 });
  const page = await context.newPage();

  // 1. Audit Desktop 1440
  await page.setViewportSize({ width: 1440, height: 900 });
  const startNav = Date.now();
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  const loadTimeMs = Date.now() - startNav;

  // Collect metadata & DOM info
  const auditData = await page.evaluate(() => {
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
      jsonLdCount: jsonLdScripts.length,
      jsonLd: jsonLdScripts,
      linksCount: links.length,
      links,
      wordCount,
      domNodes: document.querySelectorAll("*").length,
      pageHeight: document.documentElement.scrollHeight,
    };
  });

  auditData.loadTimeMs = loadTimeMs;

  console.log("=== B.3 MIGRATION AUDIT (DESKTOP) ===");
  console.log(`Title: ${auditData.title}`);
  console.log(`DOM nodes: ${auditData.domNodes}`);
  console.log(`Word count: ${auditData.wordCount}`);
  console.log(`Page height: ${auditData.pageHeight}px`);
  console.log(`Links count: ${auditData.linksCount}`);

  // Capture Desktop 1440
  const after1440 = join(CAPTURES_DIR, "after_1440.png");
  await page.screenshot({ path: after1440, fullPage: true });
  copyFileSync(after1440, join(BRAIN_DIR, "after_1440.png"));
  console.log("Captured after_1440.png");

  // Capture Desktop 1920
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  const after1920 = join(CAPTURES_DIR, "after_1920.png");
  await page.screenshot({ path: after1920, fullPage: true });
  copyFileSync(after1920, join(BRAIN_DIR, "after_1920.png"));
  console.log("Captured after_1920.png");

  // Capture Tablet 768
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  const after768 = join(CAPTURES_DIR, "after_768.png");
  await page.screenshot({ path: after768, fullPage: true });
  copyFileSync(after768, join(BRAIN_DIR, "after_768.png"));
  console.log("Captured after_768.png");

  // Capture Mobile 390
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  const after390 = join(CAPTURES_DIR, "after_390.png");
  await page.screenshot({ path: after390, fullPage: true });
  copyFileSync(after390, join(BRAIN_DIR, "after_390.png"));
  console.log("Captured after_390.png");

  // Capture Mobile 360
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
  const after360 = join(CAPTURES_DIR, "after_360.png");
  await page.screenshot({ path: after360, fullPage: true });
  copyFileSync(after360, join(BRAIN_DIR, "after_360.png"));
  console.log("Captured after_360.png");

  // Demo Interactive States capture (Desktop 1440)
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });

  const demoLocator = page.locator("#product-demo-root");
  await demoLocator.scrollIntoViewIfNeeded();

  // Capture demo attention state
  const demoBefore = join(CAPTURES_DIR, "demo_before.png");
  await demoLocator.screenshot({ path: demoBefore });
  copyFileSync(demoBefore, join(BRAIN_DIR, "demo_before.png"));
  console.log("Captured demo_before.png");

  // Click "Régulariser" in the demo
  const resolveBtn = demoLocator.getByRole("button", { name: /Régulariser/i });
  if (await resolveBtn.isVisible()) {
    await resolveBtn.click();
    await page.waitForTimeout(300); // Wait for micro-transition
    const demoResolved = join(CAPTURES_DIR, "demo_resolved.png");
    await demoLocator.screenshot({ path: demoResolved });
    copyFileSync(demoResolved, join(BRAIN_DIR, "demo_resolved.png"));
    console.log("Captured demo_resolved.png");
  } else {
    console.warn("Resolve button not found in demo locator");
  }

  // Save audit data
  writeFileSync(join(DOCS_DIR, "after_audit.json"), JSON.stringify(auditData, null, 2));
  console.log("Wrote after_audit.json");

  await browser.close();
}

runAfterAudit().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
