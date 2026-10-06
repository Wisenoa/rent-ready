import { chromium } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const BASE_URL = "http://localhost:3344";
const OUTPUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice2_after";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log("Starting Slice 2 AFTER screenshot capture...");
  const browser = await chromium.launch({ headless: true });

  const user = await prisma.user.findFirst({
    where: { email: { contains: "landlord.audit.1791274547614" } },
    include: { properties: true }
  });
  if (!user) throw new Error("Populated audit user not found");

  const properties = {
    vacant: user.properties.find(p => p.name === "Studio Graslin"),
    paid: user.properties.find(p => p.name === "T2 Voltaire"),
    late: user.properties.find(p => p.name === "Maison Procé"),
    partial: user.properties.find(p => p.name === "T3 Canclaux"),
  };

  const viewports = [
    { name: "desktop_1440", width: 1440, height: 900, isMobile: false },
    { name: "mobile_390", width: 390, height: 844, isMobile: true },
  ];

  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile,
    });
    const page = await ctx.newPage();

    // Set cookie consent
    await ctx.addCookies([
      { name: "cookie_consent", value: "essential", domain: "localhost", path: "/" }
    ]);

    // Login via UI
    await page.goto(`${BASE_URL}/login`);
    await page.waitForLoadState("networkidle");
    await page.getByLabel(/adresse email/i).fill(user.email);
    await page.getByLabel(/mot de passe/i).fill("RentReady!2026");
    await page.getByRole("button", { name: /se connecter/i }).click();
    await page.waitForURL((url) => !url.pathname.startsWith('/login'), { timeout: 30000 });
    await page.waitForLoadState("networkidle");

    // Capture each state
    for (const [stateKey, prop] of Object.entries(properties)) {
      if (!prop) {
        console.warn(`Property for ${stateKey} not found!`);
        continue;
      }
      console.log(`Navigating to ${stateKey} (${prop.name}): /properties/${prop.id}...`);
      await page.goto(`${BASE_URL}/properties/${prop.id}`, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForLoadState("networkidle").catch(() => {});
      await page.waitForTimeout(600);

      const filename = `prop_${stateKey}_${vp.name}.png`;
      await page.screenshot({
        path: path.join(OUTPUT_DIR, filename),
        fullPage: false,
      });
      console.log(`Saved AFTER screenshot: ${filename}`);
    }

    await ctx.close();
  }

  await browser.close();
  await prisma.$disconnect();
  console.log("Slice 2 AFTER capture complete!");
}

run().catch((e) => {
  console.error("Slice 2 AFTER capture failed:", e);
  process.exit(1);
});
