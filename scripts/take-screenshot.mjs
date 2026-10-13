import { chromium } from "@playwright/test";

const url = process.argv[2] || "http://127.0.0.1:3111/gestion-locative";
const prefix = process.argv[3] || "after";

async function scrollPage(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          window.scrollTo(0, 0);
          resolve();
        }
      }, 50);
    });
  });

  // Wait for all images to load
  await page.evaluate(async () => {
    const images = Array.from(document.querySelectorAll("img"));
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener("load", resolve);
          img.addEventListener("error", resolve);
        });
      })
    );
  });

  await page.waitForTimeout(500);
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  
  // Desktop
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(url, { waitUntil: "networkidle" });
    await scrollPage(page);
    await page.screenshot({ path: `docs/design/challenge/screenshots/${prefix}-desktop.png`, fullPage: false });
    await page.screenshot({ path: `docs/design/challenge/screenshots/${prefix}-desktop-full.png`, fullPage: true });
    console.log(`Saved ${prefix}-desktop.png and fullPage`);
  }

  // Mobile
  {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true });
    await page.goto(url, { waitUntil: "networkidle" });
    await scrollPage(page);
    await page.screenshot({ path: `docs/design/challenge/screenshots/${prefix}-mobile.png`, fullPage: false });
    await page.screenshot({ path: `docs/design/challenge/screenshots/${prefix}-mobile-full.png`, fullPage: true });
    console.log(`Saved ${prefix}-mobile.png and fullPage`);
  }

  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
