/**
 * Captures the homepage at the widths it is reviewed at.
 *
 *   node scripts/capture-homepage.mjs [baseUrl] [outDir] [--reduced-motion]
 *
 * Per width: first screen (`hero-<w>.png`), full page (`page-<w>.png`) and
 * one image per landmark section that carries an id. Lazy content is scrolled
 * into view first so photos and scroll reveals are in their final state.
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://127.0.0.1:3318";
const outDir = process.argv[3] ?? "docs/design/homepage-v2/captures/after";
const reducedMotion = process.argv.includes("--reduced-motion") ? "reduce" : "no-preference";
const WIDTHS = [
  { w: 1440, h: 900 },
  { w: 768, h: 1024 },
  { w: 390, h: 844 },
  { w: 360, h: 780 },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const { w, h } of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: w < 800 ? 2 : 1,
    reducedMotion,
  });
  await context.addInitScript(() => {
    try {
      localStorage.setItem("lokna_cookie_consent", "declined");
    } catch {}
  });
  const page = await context.newPage();
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${outDir}/hero-${w}.png` });

  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    await Promise.all(
      Array.from(document.images)
        .filter((img) => img.offsetParent !== null && !img.complete)
        .map((img) =>
          Promise.race([
            new Promise((r) => img.addEventListener("load", r, { once: true })),
            new Promise((r) => setTimeout(r, 8000)),
          ])
        )
    );
  });
  await page.waitForTimeout(1500);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  console.log(`${w}px: horizontal overflow ${overflow}px`);

  await page.screenshot({ path: `${outDir}/page-${w}.png`, fullPage: true });
  const ids = await page.$$eval("main section[id]", (els) => els.map((e) => e.id));
  for (const id of ids) {
    await page.locator(`#${id}`).screenshot({ path: `${outDir}/${id}-${w}.png` });
  }
  await context.close();
}

await browser.close();
