import "dotenv/config";
import { chromium } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const email = `before.slice3.${Date.now()}@rentready.io`;
  const password = "RentReady!2026";

  console.log("Registering user:", email);
  await page.goto("http://localhost:3344/register");
  await page.fill('input[name="name"]', "Test Bail");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');

  await page.waitForURL("**/dashboard**", { timeout: 15000 });
  await page.evaluate(() => localStorage.setItem("onboarding_wizard_dismissed", "1"));

  const dbUser = await prisma.user.findUnique({ where: { email } });
  if (!dbUser) throw new Error("User not found");

  // Create a property
  const prop = await prisma.property.create({
    data: {
      userId: dbUser.id,
      name: "T2 Nantes Centre",
      addressLine1: "12 Rue Crébillon",
      postalCode: "44000",
      city: "Nantes",
      type: "APARTMENT",
      surface: 45,
      rooms: 2,
    },
  });

  // Create a tenant
  await prisma.tenant.create({
    data: {
      userId: dbUser.id,
      firstName: "Claire",
      lastName: "Dubois",
      email: "claire.dubois@example.com",
      phone: "0601020304",
      addressLine1: "12 Rue Crébillon",
      city: "Nantes",
      postalCode: "44000",
    },
  });

  console.log("Navigating to /leases/new");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("http://localhost:3344/leases/new", { waitUntil: "networkidle" });
  await page.screenshot({
    path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice3_before/leases_new_desktop_1440.png",
    fullPage: true,
  });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice3_before/leases_new_mobile_390.png",
    fullPage: true,
  });

  console.log("Screenshots saved!");
  await browser.close();
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
