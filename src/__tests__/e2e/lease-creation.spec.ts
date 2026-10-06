import { test, expect } from './helpers/fixtures';
import { registerTestUser, uniqueEmail } from './helpers/auth';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

test.describe('Vertical Slice #3 — Lease Creation (/leases/new)', () => {
  test.describe.configure({ mode: 'serial' });

  let prisma: PrismaClient;

  test.beforeAll(async () => {
    const connectionString = process.env.DATABASE_URL;
    const adapter = new PrismaPg({ connectionString });
    prisma = new PrismaClient({ adapter });
  });

  test.afterAll(async () => {
    await prisma.$disconnect();
  });

  test.beforeEach(async () => {
    test.setTimeout(60000);
  });

  test('calm empty state is rendered when user has 0 properties (no silent redirect)', async ({ page }) => {
    const email = uniqueEmail('lease.empty');
    await registerTestUser(page, email);
    await page.evaluate(() => localStorage.setItem('onboarding_wizard_dismissed', '1'));

    await page.goto('/leases/new');
    await expect(page).toHaveURL(/\/leases\/new/);

    // Verify empty state is displayed and does not silently kick user back to /leases
    const heading = page.getByRole('heading', { name: /aucun bien immobilier/i });
    await expect(heading).toBeVisible();
    await expect(page.getByText(/pour créer un bail, vous devez d'abord ajouter un logement/i)).toBeVisible();

    const addBtn = page.getByRole('link', { name: /ajouter un bien/i });
    await expect(addBtn).toBeVisible();
    await expect(addBtn).toHaveAttribute('href', '/properties');
  });

  test('property is preselected from query param and live rent/deposit calculates correctly', async ({ page }) => {
    const email = uniqueEmail('lease.preselect');
    const userCreds = await registerTestUser(page, email);
    await page.evaluate(() => localStorage.setItem('onboarding_wizard_dismissed', '1'));

    const dbUser = await prisma.user.findUnique({ where: { email: userCreds.email } });
    if (!dbUser) throw new Error('User not found');

    const property = await prisma.property.create({
      data: {
        userId: dbUser.id,
        name: 'T2 Voltaire Test',
        addressLine1: '14 Rue Voltaire',
        postalCode: '44000',
        city: 'Nantes',
        type: 'APARTMENT',
        surface: 50,
        rooms: 2,
      },
    });

    const tenant = await prisma.tenant.create({
      data: {
        userId: dbUser.id,
        firstName: 'Thomas',
        lastName: 'Moreau',
        email: 'thomas.moreau@example.com',
        phone: '0612345678',
        addressLine1: '14 Rue Voltaire',
        city: 'Nantes',
        postalCode: '44000',
      },
    });

    // Navigate with ?propertyId=
    await page.goto(`/leases/new?propertyId=${property.id}`);

    // Back link names property
    const backBtn = page.getByRole('link', { name: /retour au logement/i });
    await expect(backBtn).toBeVisible();
    await expect(backBtn).toHaveAttribute('href', `/properties/${property.id}`);

    // Property select shows human name and pre-selected badge
    const propertyTrigger = page.locator('#propertyId');
    await expect(propertyTrigger).toContainText('T2 Voltaire Test');
    await expect(page.getByText('Pré-sélectionné')).toBeVisible();

    // Select tenant
    const tenantTrigger = page.locator('#tenantId');
    await tenantTrigger.click();
    await page.getByRole('option', { name: /thomas moreau/i }).click();
    await expect(tenantTrigger).toContainText('Thomas Moreau');

    // Fill rent and charges
    await page.fill('#rentAmount', '700');
    await page.fill('#chargesAmount', '60');

    // Live total check
    const totalBox = page.getByText(/total mensuel exigible/i).locator('../..');
    await expect(totalBox).toContainText(/760,00\s*€/);
    await expect(totalBox).toContainText(/700,00\s*€/);
    await expect(totalBox).toContainText(/60,00\s*€/);

    // Open advanced section
    await page.getByText(/3\. Modalités complémentaires/i).click();

    // Verify deposit is optional and displays the legal ceiling
    const depositInput = page.locator('#depositAmount');
    await expect(page.getByText(/plafond légal : 700,00\s*€/i)).toBeVisible();

    // Click explicit action to apply legal ceiling for UNFURNISHED (1 month HC)
    await page.getByRole('button', { name: /appliquer le plafond \(700,00\s*€\)/i }).click();
    await expect(depositInput).toHaveValue('700');

    // Switch lease type to FURNISHED
    const leaseTypeTrigger = page.locator('#leaseType');
    await leaseTypeTrigger.click();
    await page.getByRole('option', { name: /location meublée/i }).click();

    // Verify deposit ceiling updated to 2 months HC (1400 €) and can be applied
    await expect(page.getByText(/plafond légal : 1\s*400,00\s*€/i)).toBeVisible();
    await page.getByRole('button', { name: /appliquer le plafond \(1\s*400,00\s*€\)/i }).click();
    await expect(depositInput).toHaveValue('1400');
  });

  test('can create inline tenant without leaving lease form, and completes lease creation', async ({ page }) => {
    const email = uniqueEmail('lease.inline');
    const userCreds = await registerTestUser(page, email);
    await page.evaluate(() => localStorage.setItem('onboarding_wizard_dismissed', '1'));

    const dbUser = await prisma.user.findUnique({ where: { email: userCreds.email } });
    if (!dbUser) throw new Error('User not found');

    const property = await prisma.property.create({
      data: {
        userId: dbUser.id,
        name: 'Maison Mellinet',
        addressLine1: '3 Place Général Mellinet',
        postalCode: '44000',
        city: 'Nantes',
        type: 'HOUSE',
        surface: 110,
        rooms: 5,
      },
    });

    await page.goto(`/leases/new?propertyId=${property.id}`);

    // Click "+ Nouveau locataire" button
    await page.getByRole('button', { name: /nouveau locataire/i }).click();

    // Modal dialog opens
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole('heading', { name: /ajouter un locataire/i })).toBeVisible();

    // Fill inline tenant form
    await dialog.locator('#firstName').fill('Camille');
    await dialog.locator('#lastName').fill('Rousseau');
    await dialog.locator('#email').fill(`camille.${Date.now()}@example.com`);
    await dialog.locator('#phone').fill('0698765432');
    await dialog.locator('#addressLine1').fill('3 Place Général Mellinet');
    await dialog.locator('#city').fill('Nantes');
    await dialog.locator('#postalCode').fill('44000');

    // Submit dialog
    await dialog.locator('button[type="submit"]').click();
    await expect(dialog).not.toBeVisible();

    // Verify newly created tenant is automatically selected in #tenantId!
    const tenantTrigger = page.locator('#tenantId');
    await expect(tenantTrigger).toContainText('Camille Rousseau');

    // Fill financial terms
    await page.fill('#rentAmount', '1200');
    await page.fill('#chargesAmount', '100');

    // Submit lease form
    await page.getByRole('button', { name: /créer le bail/i }).click();

    // Verifies redirect to Property Home Base (/properties/[id])
    await expect(page).toHaveURL(new RegExp(`/properties/${property.id}`), { timeout: 15000 });

    // Verifies the property page reflects the new active lease and tenant!
    await expect(page.getByRole('link', { name: 'Camille Rousseau' })).toBeVisible();
    await expect(page.getByText(/1\s*300,00\s*€/).first()).toBeVisible(); // 1200 + 100
  });

  test('validates required fields with French error messages on invalid submit', async ({ page }) => {
    const email = uniqueEmail('lease.errors');
    const userCreds = await registerTestUser(page, email);
    await page.evaluate(() => localStorage.setItem('onboarding_wizard_dismissed', '1'));

    const dbUser = await prisma.user.findUnique({ where: { email: userCreds.email } });
    if (!dbUser) throw new Error('User not found');

    const property = await prisma.property.create({
      data: {
        userId: dbUser.id,
        name: 'Studio Test',
        addressLine1: '1 Rue de Test',
        postalCode: '44000',
        city: 'Nantes',
        type: 'STUDIO',
        surface: 20,
        rooms: 1,
      },
    });

    await page.goto(`/leases/new?propertyId=${property.id}`);

    // Leave rent empty or 0 and attempt submit
    await page.fill('#rentAmount', '');
    await page.getByRole('button', { name: /créer le bail/i }).click();

    // Field-level error in French
    const rentError = page.locator('p[role="alert"]');
    await expect(rentError).toBeVisible();
    await expect(rentError).toContainText(/positif/i);
  });
});
