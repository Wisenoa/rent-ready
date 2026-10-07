import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/marketing_redesign";
mkdirSync(OUT_DIR, { recursive: true });

const PORT = process.env.PORT || 4840;
const BASE_URL = `http://127.0.0.1:${PORT}`;

const VIEWPORTS = [
  { name: "mobile_390", width: 390, height: 844 },
  { name: "tablet_768", width: 768, height: 1024 },
  { name: "desktop_1024", width: 1024, height: 768 },
  { name: "desktop_1440", width: 1440, height: 900 },
];

async function run() {
  console.log(`Connecting to ${BASE_URL}...`);
  const browser = await chromium.launch();

  for (const vp of VIEWPORTS) {
    console.log(`Capturing ${vp.name}...`);
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
    });

    await page.goto(BASE_URL, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);

    // Dismiss cookie banner and nextjs overlays thoroughly
    await page.evaluate(() => {
      document.querySelectorAll('button').forEach((b) => {
        if (b.textContent && /accepter/i.test(b.textContent)) b.click();
      });
      document.querySelectorAll('div, section, aside').forEach((el) => {
        if (el.textContent && el.textContent.includes('Ce site utilise des cookies')) {
          el.style.display = 'none';
        }
      });
      const portal = document.querySelector('nextjs-portal');
      if (portal) portal.style.display = 'none';
    });
    await page.waitForTimeout(300);

    // 1. Above-the-fold Viewport Screenshot
    await page.screenshot({
      path: join(OUT_DIR, `1_hero_viewport_${vp.name}.png`),
      fullPage: false,
    });

    // Scroll through page to hydrate all dynamic wrappers and fire intersection observers
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 500;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            window.scrollTo(0, 0);
            resolve();
          }
        }, 100);
      });
    });
    await page.waitForTimeout(1000);

    // Re-check cookie and dev overlays after scroll
    await page.evaluate(() => {
      document.querySelectorAll('div, section, aside').forEach((el) => {
        if (el.textContent && el.textContent.includes('Ce site utilise des cookies')) {
          el.style.display = 'none';
        }
      });
      const portal = document.querySelector('nextjs-portal');
      if (portal) portal.style.display = 'none';
    });

    // 2. Full Page Screenshot
    await page.screenshot({
      path: join(OUT_DIR, `2_fullpage_${vp.name}.png`),
      fullPage: true,
    });

    // If desktop 1440, capture individual component sections for detailed inspection
    if (vp.name === "desktop_1440") {
      // Hide sticky/fixed header so it doesn't overlap section titles in element screenshots
      await page.evaluate(() => {
        const header = document.querySelector("header");
        if (header) header.style.display = "none";
        document.querySelectorAll('div, section, aside').forEach((el) => {
          if (el.textContent && el.textContent.includes('Ce site utilise des cookies')) {
            el.style.display = 'none';
          }
        });
        const portal = document.querySelector('nextjs-portal');
        if (portal) portal.style.display = 'none';
      });

      const hero = page.locator("section").first();
      if (await hero.count() > 0) {
        await hero.screenshot({ path: join(OUT_DIR, "3_section_hero_1440.png") });
      }

      const cycle = page.locator("#cycle-mensuel");
      if (await cycle.count() > 0) {
        await cycle.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await cycle.screenshot({ path: join(OUT_DIR, "4_section_cycle_1440.png") });
      }

      const homebase = page.locator("#fonctionnalites");
      if (await homebase.count() > 0) {
        await homebase.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await homebase.screenshot({ path: join(OUT_DIR, "5_section_homebase_1440.png") });
      }

      const pricing = page.locator("#tarifs");
      if (await pricing.count() > 0) {
        await pricing.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await pricing.screenshot({ path: join(OUT_DIR, "6_section_pricing_1440.png") });
      }

      const tools = page.locator("#simulateurs");
      if (await tools.count() > 0) {
        await tools.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        await tools.screenshot({ path: join(OUT_DIR, "7_section_tools_1440.png") });
      }
    }

    await page.close();
  }

  await browser.close();
  console.log("All captures completed successfully in", OUT_DIR);
}

run().catch((err) => {
  console.error("Capture error:", err);
  process.exit(1);
});
