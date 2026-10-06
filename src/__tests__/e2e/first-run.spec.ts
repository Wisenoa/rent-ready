import { test, expect } from './helpers/fixtures';
import { uniqueEmail, DEFAULT_PASSWORD } from './helpers/auth';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

test.describe('Vertical Slice #4 — First-Run & Onboarding Flow', () => {
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

  test.beforeEach(async ({ context }) => {
    test.setTimeout(90000);
    // Dismiss cookie banner and legacy wizard by default
    await context.addInitScript(() => {
      localStorage.setItem('rentready_cookie_consent', 'accepted');
      localStorage.setItem('onboarding_wizard_dismissed', '1');
    });
  });

  test('desktop first-run journey: seamless path from register to activated landlord', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const timestamp = Date.now();
    const email = uniqueEmail('firstrun.desktop');
    const propertyName = `T2 République ${timestamp}`;
    const tenantEmail = `lucas.${timestamp}@example.com`;

    // 1. Inscription
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Alexandre Martin');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', DEFAULT_PASSWORD);
    await page.click('button[type="submit"]');

    // 2. Arrivée directe sur le tableau de bord en état zéro (calme, orienté action)
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
    const welcomeHeading = page.getByRole('heading', { name: /bienvenue sur rentready/i });
    await expect(welcomeHeading).toBeVisible();

    // Bouton primaire d'action rapide sur le dashboard
    const addPropertyBtn = page.getByRole('button', { name: /ajouter mon premier logement/i });
    await expect(addPropertyBtn).toBeVisible();
    await addPropertyBtn.click();

    // 3. Modal simplifié (5 champs essentiels upfront, 0 dead-end)
    const propertyDialog = page.getByRole('dialog');
    await expect(propertyDialog).toBeVisible();

    await propertyDialog.locator('#name').fill(propertyName);
    await propertyDialog.locator('#addressLine1').fill('15 Rue de la République');
    await propertyDialog.locator('#postalCode').fill('44000');
    await propertyDialog.locator('#city').fill('Nantes');

    // Soumission du logement -> Redirection automatique vers Property Home Base
    await propertyDialog.locator('button[type="submit"]').click();

    // 4. Arrivée automatique sur la Property Home Base (logement vacant)
    await expect(page).toHaveURL(/\/properties\/[a-z0-9-]+$/, { timeout: 30000 });
    await expect(page.getByRole('heading', { name: propertyName })).toBeVisible();
    await expect(page.getByText('Vacant', { exact: true })).toBeVisible();

    // CTA clair pour continuer le flow : Créer un bail
    const createLeaseBtn = page.getByRole('link', { name: /créer un bail/i });
    await expect(createLeaseBtn).toBeVisible();
    await createLeaseBtn.click();

    // 5. Formulaire de bail pré-rempli et inline tenant
    await expect(page).toHaveURL(/\/leases\/new\?propertyId=/, { timeout: 30000 });
    await expect(page.getByText(propertyName)).toBeVisible();

    // Création inline du locataire
    await page.getByRole('button', { name: /nouveau locataire/i }).click();
    const tenantDialog = page.getByRole('dialog');
    await expect(tenantDialog).toBeVisible();

    await tenantDialog.locator('#firstName').fill('Lucas');
    await tenantDialog.locator('#lastName').fill('Bernard');
    await tenantDialog.locator('#email').fill(tenantEmail);
    await tenantDialog.locator('#phone').fill('0612345678');
    await tenantDialog.locator('#addressLine1').fill('15 Rue de la République');
    await tenantDialog.locator('#city').fill('Nantes');
    await tenantDialog.locator('#postalCode').fill('44000');

    await tenantDialog.locator('button[type="submit"]').click();
    await expect(tenantDialog).toBeHidden();

    // Saisie financière
    await page.fill('#rentAmount', '800');
    await page.fill('#chargesAmount', '50');

    // Dépliage de la section 3 (modalités complémentaires & dépôt facultatif)
    await page.getByRole('button', { name: /modalités complémentaires/i }).click();

    // Vérification du plafond légal Art. 22
    await expect(page.getByText(/plafond légal/i)).toBeVisible();

    // Soumission du bail -> Redirection vers Property Home Base avec ?activated=1
    await page.getByRole('button', { name: /créer le bail/i }).click();

    // 6. Moment de célébration / confirmation sur la Property Home Base
    await expect(page).toHaveURL(/\/properties\/[a-z0-9-]+\?activated=1/, { timeout: 30000 });
    const successBanner = page.getByText(/votre logement est configuré et prêt à être géré/i);
    await expect(successBanner).toBeVisible();
    await expect(page.getByText(/occupé \(lucas bernard\)/i)).toBeVisible();

    // Clic pour voir le tableau de bord désormais activé
    const toDashboardBtn = page.getByRole('link', { name: /voir mon tableau de bord/i });
    await expect(toDashboardBtn).toBeVisible();
    await toDashboardBtn.click();

    // 7. Dashboard activé : l'état zéro a disparu
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
    await expect(page.getByText(/bienvenue sur rentready/i)).toBeHidden();
    await expect(page.getByRole('link', { name: propertyName })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Lucas Bernard' })).toBeVisible();
    await expect(page.getByText(/850,00\s*€/).first()).toBeVisible();
  });

  test('mobile (390px) first-run journey: dialogs and inputs fit viewport without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    const timestamp = Date.now();
    const email = uniqueEmail('firstrun.mobile');
    const propertyName = `Studio Graslin ${timestamp}`;

    // 1. Inscription mobile
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Sophie Martin');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', DEFAULT_PASSWORD);
    await page.click('button[type="submit"]');

    // 2. Dashboard mobile
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
    const addPropertyBtn = page.getByRole('button', { name: /ajouter mon premier logement/i });
    await expect(addPropertyBtn).toBeVisible();
    await addPropertyBtn.click();

    // 3. Modal logement mobile
    const propertyDialog = page.getByRole('dialog');
    await expect(propertyDialog).toBeVisible();

    await propertyDialog.locator('#name').fill(propertyName);
    await propertyDialog.locator('#addressLine1').fill('5 Place Graslin');
    await propertyDialog.locator('#postalCode').fill('44000');
    await propertyDialog.locator('#city').fill('Nantes');

    await propertyDialog.locator('button[type="submit"]').click();

    // 4. Arrivée automatique sur la Property Home Base
    await expect(page).toHaveURL(/\/properties\/[a-z0-9-]+$/, { timeout: 30000 });
    await expect(page.getByRole('heading', { name: propertyName })).toBeVisible();
    await expect(page.getByRole('link', { name: /créer un bail/i })).toBeVisible();
  });

  test('error recovery: property validation errors display clearly without closing the modal', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    const email = uniqueEmail('firstrun.errors');
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Test Erreurs');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', DEFAULT_PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });
    await page.getByRole('button', { name: /ajouter mon premier logement/i }).click();

    const propertyDialog = page.getByRole('dialog');
    await expect(propertyDialog).toBeVisible();

    // Click submit with empty required fields
    await propertyDialog.locator('button[type="submit"]').click();

    // Modal must NOT close, and validation errors must be visible in the DOM
    await expect(propertyDialog).toBeVisible();
    await expect(page.getByText(/le nom du bien est requis/i)).toBeVisible();
    await expect(page.getByText(/l'adresse est requise/i)).toBeVisible();

    // Recover by filling name and address
    await propertyDialog.locator('#name').fill('Bien Validé');
    await propertyDialog.locator('#addressLine1').fill('10 Rue de la Paix');
    await propertyDialog.locator('#postalCode').fill('75002');
    await propertyDialog.locator('#city').fill('Paris');

    await propertyDialog.locator('button[type="submit"]').click();
    await expect(page).toHaveURL(/\/properties\/[a-z0-9-]+$/, { timeout: 30000 });
  });

  test('session resumption: user with 1 property but 0 leases sees resumption card on dashboard', async ({ page }) => {
    const email = uniqueEmail('firstrun.resume');
    await page.goto('/register');
    await page.fill('input[name="name"]', 'Paul Reprise');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', DEFAULT_PASSWORD);
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL(/\/dashboard/, { timeout: 30000 });

    // Find created user in DB
    const dbUser = await prisma.user.findUnique({ where: { email } });
    if (!dbUser) throw new Error('User not found');

    // Create a property without any lease
    const prop = await prisma.property.create({
      data: {
        userId: dbUser.id,
        name: 'T3 Chantenay En Cours',
        addressLine1: '8 Rue des Usines',
        postalCode: '44100',
        city: 'Nantes',
        type: 'APARTMENT',
      },
    });

    // Reload dashboard
    await page.goto('/dashboard');

    // Verify resumption card is displayed
    const resumeHeading = page.getByText(/mise en location en cours/i);
    await expect(resumeHeading).toBeVisible();

    // Clicking "Finaliser le bail" leads directly to the lease form for that property
    const resumeBtn = page.getByRole('link', { name: /finaliser le bail/i });
    await expect(resumeBtn).toBeVisible();
    await resumeBtn.click();

    await expect(page).toHaveURL(new RegExp(`/leases/new\\?propertyId=${prop.id}`));
  });

  test('attribution preservation: UTM query parameters survive registration redirect', async ({ page }) => {
    const email = uniqueEmail('firstrun.utm');
    await page.goto('/register?utm_source=meta&utm_campaign=launch2026');

    await page.fill('input[name="name"]', 'Claire Attribution');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', DEFAULT_PASSWORD);
    await page.click('button[type="submit"]');

    // Expect redirect to preserve the query string
    await expect(page).toHaveURL(/\/dashboard\?.*utm_source=meta.*utm_campaign=launch2026/, { timeout: 30000 });
  });
});
