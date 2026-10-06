import "dotenv/config";
import { chromium } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const connectionString = process.env.DATABASE_URL;
  const adapter = new PrismaPg({ connectionString });
  const prisma = new PrismaClient({ adapter });

  const browser = await chromium.launch({ headless: true });

  // 1. User WITH properties
  {
    const context = await browser.newContext();
    const page = await context.newPage();

    const email = `after.slice3.${Date.now()}@rentready.io`;
    const password = "RentReady!2026";

    console.log("Registering user:", email);
    await page.goto("http://localhost:3344/register");
    await page.fill('input[name="name"]', "Bailleur Pro");
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
        name: "T3 Boulevard Guist'hau",
        addressLine1: "15 Boulevard Guist'hau",
        postalCode: "44000",
        city: "Nantes",
        type: "APARTMENT",
        surface: 68,
        rooms: 3,
      },
    });

    // Create a tenant
    await prisma.tenant.create({
      data: {
        userId: dbUser.id,
        firstName: "Marc",
        lastName: "Lefebvre",
        email: "marc.lefebvre@example.com",
        phone: "0612345678",
        addressLine1: "15 Boulevard Guist'hau",
        city: "Nantes",
        postalCode: "44000",
      },
    });

    console.log("Navigating to /leases/new with propertyId:", prop.id);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`http://localhost:3344/leases/new?propertyId=${prop.id}`, {
      waitUntil: "networkidle",
      timeout: 60000,
    });

    // Type rent and charges to demonstrate live Decimal calculations and deposit sync
    await page.fill('#rentAmount', '850');
    await page.fill('#chargesAmount', '65');

    await page.screenshot({
      path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice3_after/leases_new_desktop_1440.png",
      fullPage: true,
    });

    // Also open the advanced section
    await page.getByText("3. Modalités complémentaires & Révision IRL").click();
    await page.screenshot({
      path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice3_after/leases_new_advanced_desktop_1440.png",
      fullPage: true,
    });

    // Mobile view
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice3_after/leases_new_mobile_390.png",
      fullPage: true,
    });

    await context.close();
  }

  // 2. User with ZERO properties (testing calm empty state)
  {
    const context = await browser.newContext();
    const page = await context.newPage();

    const emptyUserEmail = `empty.slice3.${Date.now()}@rentready.io`;
    console.log("Registering empty user:", emptyUserEmail);
    await page.goto("http://localhost:3344/register");
    await page.fill('input[name="name"]', "Nouveau Bailleur");
    await page.fill('input[name="email"]', emptyUserEmail);
    await page.fill('input[name="password"]', "RentReady!2026");
    await page.click('button[type="submit"]');

    await page.waitForURL("**/dashboard**", { timeout: 15000 });
    await page.evaluate(() => localStorage.setItem("onboarding_wizard_dismissed", "1"));

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("http://localhost:3344/leases/new", {
      waitUntil: "networkidle",
      timeout: 60000,
    });

    await page.screenshot({
      path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice3_after/leases_new_empty_desktop_1440.png",
      fullPage: true,
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({
      path: "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/slice3_after/leases_new_empty_mobile_390.png",
      fullPage: true,
    });

    await context.close();
  }

  console.log("All AFTER screenshots captured successfully!");
  await browser.close();
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
