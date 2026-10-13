/**
 * Captures /gestion-locative at the widths the landing is reviewed at.
 *
 *   node scripts/capture-gestion-locative.mjs [baseUrl] [outDir]
 *
 * Writes, per width: the first screen (`hero-<w>.png`), the full page
 * (`page-<w>.png`) and one image per landmark section (`<id>-<w>.png`).
 * The cookie banner is dismissed beforehand so it does not cover the hero.
 */
import { mkdir } from "node:fs/promises";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://127.0.0.1:3317";
const outDir = process.argv[3] ?? "docs/design/lokna-final/captures";
const WIDTHS = [
  { w: 1440, h: 900 },
  { w: 768, h: 1024 },
  { w: 390, h: 844 },
  { w: 360, h: 780 },
];
const SECTIONS = [
  ["ledger", "figure[aria-labelledby='ledger-title']"],
  ["cycle", "#cycle-mensuel"],
  ["documents", "section:has(> div > figure)"],
  ["fonctionnalites", "#fonctionnalites"],
  ["tarifs", "#tarifs"],
  ["annexes", "#simulateurs"],
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const { w, h } of WIDTHS) {
  const context = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: w < 800 ? 2 : 1,
  });
  await context.addInitScript(() => {
    try {
      localStorage.setItem("lokna_cookie_consent", "declined");
    } catch {}
  });
  const page = await context.newPage();
  await page.goto(`${base}/gestion-locative`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  // Photos below the fold are lazy-loaded: scroll through, then wait for them.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
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
    window.scrollTo(0, 0);
  });

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth
  );
  console.log(`${w}px: horizontal overflow ${overflow}px`);

  await page.screenshot({ path: `${outDir}/hero-${w}.png` });
  await page.screenshot({ path: `${outDir}/page-${w}.png`, fullPage: true });
  for (const [name, selector] of SECTIONS) {
    const el = page.locator(selector).first();
    if ((await el.count()) === 0) continue;
    await el.screenshot({ path: `${outDir}/${name}-${w}.png` });
  }
  await context.close();
}

await browser.close();
