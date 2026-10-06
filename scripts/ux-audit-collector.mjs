import { chromium } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import fs from "fs";
import path from "path";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const BASE_URL = "http://localhost:3344";
const OUTPUT_DIR = "/home/ubuntu/.gemini/antigravity-cli/brain/34660a3b-1673-4b8c-85df-e4980ba94589/screenshots/before";

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function run() {
  console.log("Starting UX visual audit collector...");
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: "desktop_1440", width: 1440, height: 900 },
    { name: "laptop_1280", width: 1280, height: 800 },
    { name: "mobile_390", width: 390, height: 844, isMobile: true },
  ];

  // 1. Audit Public pages (Landing, Login, Register)
  for (const vp of viewports) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile || false,
    });
    const page = await context.newPage();

    // Landing
    await page.goto(`${BASE_URL}/`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUTPUT_DIR, `01_landing_${vp.name}.png`), fullPage: false });

    // Login
    await page.goto(`${BASE_URL}/login`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUTPUT_DIR, `02_login_${vp.name}.png`), fullPage: false });

    // Register
    await page.goto(`${BASE_URL}/register`, { waitUntil: "networkidle" });
    await page.screenshot({ path: path.join(OUTPUT_DIR, `03_register_${vp.name}.png`), fullPage: false });

    await context.close();
  }

  // 2. Journey A: First start (Fresh User)
  console.log("Running Journey A: First start (registration & onboarding)...");
  const freshContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const freshPage = await freshContext.newPage();
  const testEmail = `landlord.audit.${Date.now()}@rentready.io`;

  await freshPage.goto(`${BASE_URL}/register`, { waitUntil: "networkidle" });
  await freshPage.getByLabel(/nom complet/i).fill("Marc Delorme");
  await freshPage.getByLabel(/adresse email/i).fill(testEmail);
  await freshPage.getByLabel(/mot de passe/i).fill("RentReady!2026");
  await freshPage.getByRole("button", { name: /cr[ée]er mon compte/i }).click();

  await freshPage.waitForFunction(() => window.location.pathname.includes("/dashboard"), null, { timeout: 30000 });
  await freshPage.waitForTimeout(2000);

  // Capture Dashboard Empty State with Onboarding Modal open (if present)
  await freshPage.screenshot({ path: path.join(OUTPUT_DIR, `04_dashboard_onboarding_modal_desktop.png`) });

  // Dismiss onboarding or inspect wizard
  const closeBtn = freshPage.locator('[data-slot="dialog-close"]').first();
  if (await closeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await closeBtn.click({ force: true });
    await freshPage.waitForTimeout(500);
  }

  // Dashboard Empty State without modal
  await freshPage.screenshot({ path: path.join(OUTPUT_DIR, `05_dashboard_empty_desktop.png`) });

  // Mobile version of empty dashboard
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  // Transfer cookies
  const cookies = await freshContext.cookies();
  await mobileContext.addCookies(cookies);
  await mobilePage.goto(`${BASE_URL}/dashboard`, { waitUntil: "networkidle" });
  const mobileClose = mobilePage.locator('[data-slot="dialog-close"]').first();
  if (await mobileClose.isVisible({ timeout: 2000 }).catch(() => false)) {
    await mobileClose.click({ force: true });
  }
  await mobilePage.screenshot({ path: path.join(OUTPUT_DIR, `05_dashboard_empty_mobile.png`) });
  await mobileContext.close();

  // Find user in DB to add realistic portfolio data
  const user = await prisma.user.findUnique({
    where: { email: testEmail },
  });
  if (!user) throw new Error("Created user not found in DB");

  console.log(`Created user ${user.id} (${testEmail})`);

  // 3. Seed Realistic Landlord Data for Journey B, C, D, E
  console.log("Seeding realistic landlord portfolio...");
  // Property 1: Paris 11e (Good status, fully paid)
  const prop1 = await prisma.property.create({
    data: {
      userId: user.id,
      name: "T2 Voltaire",
      addressLine1: "42 Boulevard Voltaire",
      postalCode: "75011",
      city: "Paris",
      type: "APARTMENT",
      surface: 45,
      rooms: 2,
    },
  });

  const tenant1 = await prisma.tenant.create({
    data: {
      userId: user.id,
      firstName: "Lucas",
      lastName: "Martin",
      email: "lucas.martin@example.fr",
      phone: "06 12 34 56 78",
      addressLine1: "42 Boulevard Voltaire",
      postalCode: "75011",
      city: "Paris",
    },
  });

  const now = new Date();
  const lease1StartDate = new Date(now.getFullYear(), 0, 1);
  const lease1 = await prisma.lease.create({
    data: {
      userId: user.id,
      propertyId: prop1.id,
      tenantId: tenant1.id,
      rentAmount: 850.0,
      chargesAmount: 70.0,
      depositAmount: 850.0,
      startDate: lease1StartDate,
      paymentDay: 5,
      status: "ACTIVE",
    },
  });

  // Property 2: Nantes (Exception case: unpaid / late rent for current month)
  const prop2 = await prisma.property.create({
    data: {
      userId: user.id,
      name: "Maison Procé",
      addressLine1: "15 Rue des Dervallières",
      postalCode: "44000",
      city: "Nantes",
      type: "HOUSE",
      surface: 92,
      rooms: 4,
    },
  });

  const tenant2 = await prisma.tenant.create({
    data: {
      userId: user.id,
      firstName: "Camille",
      lastName: "Bernard",
      email: "camille.bernard@example.fr",
      phone: "06 98 76 54 32",
      addressLine1: "15 Rue des Dervallières",
      postalCode: "44000",
      city: "Nantes",
    },
  });

  const lease2 = await prisma.lease.create({
    data: {
      userId: user.id,
      propertyId: prop2.id,
      tenantId: tenant2.id,
      rentAmount: 950.0,
      chargesAmount: 50.0,
      depositAmount: 950.0,
      startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
      paymentDay: 1,
      status: "ACTIVE",
    },
  });

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Lease 1: Paid transaction with Quittance
  await prisma.transaction.create({
    data: {
      userId: user.id,
      leaseId: lease1.id,
      amount: 920.0,
      rentPortion: 850.0,
      chargesPortion: 70.0,
      periodStart: monthStart,
      periodEnd: monthEnd,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 5),
      paidAt: new Date(now.getFullYear(), now.getMonth(), 3),
      status: "PAID",
      isFullPayment: true,
      paymentMethod: "TRANSFER",
      receiptType: "QUITTANCE",
      receiptRentAmount: 850.0,
      receiptChargesAmount: 70.0,
    },
  });

  // Lease 2: Late/unpaid transaction
  await prisma.transaction.create({
    data: {
      userId: user.id,
      leaseId: lease2.id,
      amount: 1000.0,
      rentPortion: 950.0,
      chargesPortion: 50.0,
      periodStart: monthStart,
      periodEnd: monthEnd,
      dueDate: new Date(now.getFullYear(), now.getMonth(), 1),
      status: "LATE",
      isFullPayment: false,
    },
  });

  // An expense
  await prisma.expense.create({
    data: {
      userId: user.id,
      propertyId: prop1.id,
      vendorName: "Plomberie Express",
      amount: 140.0,
      date: new Date(now.getFullYear(), now.getMonth(), 2),
      category: "PLUMBING",
      description: "Remplacement robinet mitigeur cuisine",
    },
  });

  // A maintenance ticket
  await prisma.maintenanceTicket.create({
    data: {
      propertyId: prop2.id,
      tenantId: tenant2.id,
      title: "Fuite sous le lavabo salle de bain",
      description: "Écoulement goutte-à-goutte constaté depuis hier soir.",
      priority: "MEDIUM",
      status: "OPEN",
    },
  });

  console.log("Portfolio seeded. Capturing all core screens with populated data...");

  // 4. Capture all core surfaces across viewports (Desktop, Laptop, Mobile)
  const screens = [
    { id: "06_dashboard_with_data", path: "/dashboard" },
    { id: "07_owner_dashboard", path: "/dashboard/owner" },
    { id: "08_properties_list", path: "/properties" },
    { id: "09_property_detail", path: `/properties/${prop1.id}` },
    { id: "10_tenants_list", path: "/tenants" },
    { id: "11_tenant_detail", path: `/tenants/${tenant1.id}` },
    { id: "12_leases_list", path: "/leases" },
    { id: "13_lease_detail", path: `/leases/${lease1.id}` },
    { id: "14_lease_new", path: "/leases/new" },
    { id: "15_billing_payments", path: "/billing" },
    { id: "16_expenses_list", path: "/expenses" },
    { id: "17_maintenance_list", path: "/maintenance" },
    { id: "18_fiscal", path: "/fiscal" },
    { id: "19_settings_profile", path: "/settings/profile" },
  ];

  for (const vp of viewports) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      isMobile: vp.isMobile || false,
    });
    await ctx.addCookies(cookies);
    const p = await ctx.newPage();

    for (const scr of screens) {
      try {
        await p.goto(`${BASE_URL}${scr.path}`, { waitUntil: "networkidle", timeout: 15000 });
        // Dismiss any rogue wizard
        const close = p.locator('[data-slot="dialog-close"]').first();
        if (await close.isVisible({ timeout: 1000 }).catch(() => false)) {
          await close.click({ force: true });
        }
        await p.waitForTimeout(400);
        await p.screenshot({
          path: path.join(OUTPUT_DIR, `${scr.id}_${vp.name}.png`),
          fullPage: false,
        });
        console.log(`Saved screenshot: ${scr.id}_${vp.name}.png`);
      } catch (err) {
        console.error(`Error capturing ${scr.id} on ${vp.name}:`, err.message);
      }
    }
    await ctx.close();
  }

  await browser.close();
  await prisma.$disconnect();
  console.log("UX Visual audit completed successfully!");
}

run().catch((e) => {
  console.error("Audit script failed:", e);
  process.exit(1);
});
