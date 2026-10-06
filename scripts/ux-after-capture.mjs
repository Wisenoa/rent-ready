import { chromium } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const BASE_URL = "http://localhost:3344";
const OUTPUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/after";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log("Starting AFTER screenshot capture...");
  const browser = await chromium.launch({ headless: true });

  // 1. Find our populated test user
  const user = await prisma.user.findFirst({
    where: { email: { contains: "landlord.audit" } },
    orderBy: { createdAt: "desc" },
  });
  if (!user) throw new Error("Populated audit user not found");

  console.log(`Using populated user: ${user.email}`);

  const viewports = [
    { name: "desktop_1440", width: 1440, height: 900 },
    { name: "laptop_1280", width: 1280, height: 800 },
    { name: "mobile_390", width: 390, height: 844, isMobile: true },
  ];

  // 2. Capture AFTER dashboard with data across viewports
  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile || false,
    });
    const page = await ctx.newPage();

    // Login via UI
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
    await page.getByLabel(/adresse email/i).fill(user.email);
    await page.getByLabel(/mot de passe/i).fill("RentReady!2026");
    await page.getByRole("button", { name: /se connecter/i }).click();

    await page.waitForFunction(() => window.location.pathname.includes("/dashboard"), null, { timeout: 30000 });
    // Dismiss any rogue wizard dialog if present
    const close = page.locator('[data-slot="dialog-close"]').first();
    if (await close.isVisible({ timeout: 1000 }).catch(() => false)) {
      await close.click({ force: true });
    }
    await page.waitForTimeout(600);

    await page.screenshot({
      path: path.join(OUTPUT_DIR, `06_dashboard_with_data_${vp.name}.png`),
      fullPage: false,
    });
    console.log(`Saved AFTER screenshot: 06_dashboard_with_data_${vp.name}.png`);

    await ctx.close();
  }

  // 3. Capture AFTER dashboard empty state (Fresh user without properties)
  console.log("Creating fresh empty user for empty state capture...");
  const freshEmail = `empty.after.${Date.now()}@rentready.io`;
  const freshCtx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const freshPage = await freshCtx.newPage();

  await freshPage.goto(`${BASE_URL}/register`, { waitUntil: "networkidle" });
  await freshPage.getByLabel(/nom complet/i).fill("Sophie Laurent");
  await freshPage.getByLabel(/adresse email/i).fill(freshEmail);
  await freshPage.getByLabel(/mot de passe/i).fill("RentReady!2026");
  await freshPage.getByRole("button", { name: /cr[ée]er mon compte/i }).click();

  await freshPage.waitForFunction(() => window.location.pathname.includes("/dashboard"), null, { timeout: 30000 });
  const closeBtn = freshPage.locator('[data-slot="dialog-close"]').first();
  if (await closeBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    await closeBtn.click({ force: true });
  }
  await freshPage.waitForTimeout(600);

  await freshPage.screenshot({
    path: path.join(OUTPUT_DIR, `05_dashboard_empty_desktop.png`),
    fullPage: false,
  });
  console.log("Saved AFTER screenshot: 05_dashboard_empty_desktop.png");

  // Mobile empty state
  const mobileEmptyCtx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const cookies = await freshCtx.cookies();
  await mobileEmptyCtx.addCookies(cookies);
  const mobileEmptyPage = await mobileEmptyCtx.newPage();
  await mobileEmptyPage.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle" });
  const mClose = mobileEmptyPage.locator('[data-slot="dialog-close"]').first();
  if (await mClose.isVisible({ timeout: 1000 }).catch(() => false)) {
    await mClose.click({ force: true });
  }
  await mobileEmptyPage.waitForTimeout(500);

  await mobileEmptyPage.screenshot({
    path: path.join(OUTPUT_DIR, `05_dashboard_empty_mobile.png`),
    fullPage: false,
  });
  console.log("Saved AFTER screenshot: 05_dashboard_empty_mobile.png");

  await mobileEmptyCtx.close();
  await freshCtx.close();

  await browser.close();
  await prisma.$disconnect();
  console.log("AFTER capture complete!");
}

run().catch((e) => {
  console.error("AFTER capture failed:", e);
  process.exit(1);
});
