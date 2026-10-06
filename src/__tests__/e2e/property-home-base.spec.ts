import { test, expect } from './helpers/fixtures'
import { registerTestUser, uniqueEmail } from './helpers/auth'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

test.describe('Property Home Base — 4 States Validation', () => {
  test.describe.configure({ mode: 'serial' })

  let prisma: PrismaClient
  let userEmail: string
  let propertyIds: {
    vacant: string
    paid: string
    late: string
    partial: string
  }

  test.beforeAll(async () => {
    const connectionString = process.env.DATABASE_URL
    const adapter = new PrismaPg({ connectionString })
    prisma = new PrismaClient({ adapter })
  })

  test.afterAll(async () => {
    await prisma.$disconnect()
  })

  test.beforeEach(async ({ page }) => {
    // Isolated account per test suite
    userEmail = uniqueEmail('homebase')
    const userCreds = await registerTestUser(page, userEmail)

    const dbUser = await prisma.user.findUnique({
      where: { email: userCreds.email },
    })
    if (!dbUser) throw new Error('Registered user not found in DB')

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // State A: Vacant property
    const propVacant = await prisma.property.create({
      data: {
        userId: dbUser.id,
        name: 'Studio Graslin',
        addressLine1: '1 Place Graslin',
        postalCode: '44000',
        city: 'Nantes',
        type: 'STUDIO',
        surface: 24,
        rooms: 1,
      },
    })

    // State B: Paid property
    const propPaid = await prisma.property.create({
      data: {
        userId: dbUser.id,
        name: 'T2 Voltaire',
        addressLine1: '42 Boulevard Voltaire',
        postalCode: '75011',
        city: 'Paris',
        type: 'APARTMENT',
        surface: 45,
        rooms: 2,
      },
    })
    const tenantPaid = await prisma.tenant.create({
      data: {
        userId: dbUser.id,
        firstName: 'Lucas',
        lastName: 'Martin',
        email: 'lucas.martin@example.fr',
        addressLine1: '42 Boulevard Voltaire',
        postalCode: '75011',
        city: 'Paris',
      },
    })
    const leasePaid = await prisma.lease.create({
      data: {
        userId: dbUser.id,
        propertyId: propPaid.id,
        tenantId: tenantPaid.id,
        rentAmount: 850,
        chargesAmount: 70,
        depositAmount: 850,
        startDate: new Date(now.getFullYear(), 0, 1),
        paymentDay: 5,
        status: 'ACTIVE',
      },
    })
    await prisma.transaction.create({
      data: {
        userId: dbUser.id,
        leaseId: leasePaid.id,
        amount: 920,
        rentPortion: 850,
        chargesPortion: 70,
        periodStart: monthStart,
        periodEnd: monthEnd,
        dueDate: new Date(now.getFullYear(), now.getMonth(), 5),
        paidAt: new Date(now.getFullYear(), now.getMonth(), 3),
        status: 'PAID',
        isFullPayment: true,
        receiptType: 'QUITTANCE',
      },
    })

    // State C: Late property
    const propLate = await prisma.property.create({
      data: {
        userId: dbUser.id,
        name: 'Maison Procé',
        addressLine1: '15 Rue des Dervallières',
        postalCode: '44000',
        city: 'Nantes',
        type: 'HOUSE',
        surface: 92,
        rooms: 4,
      },
    })
    const tenantLate = await prisma.tenant.create({
      data: {
        userId: dbUser.id,
        firstName: 'Camille',
        lastName: 'Bernard',
        email: 'camille.bernard@example.fr',
        addressLine1: '15 Rue des Dervallières',
        postalCode: '44000',
        city: 'Nantes',
      },
    })
    const leaseLate = await prisma.lease.create({
      data: {
        userId: dbUser.id,
        propertyId: propLate.id,
        tenantId: tenantLate.id,
        rentAmount: 950,
        chargesAmount: 50,
        depositAmount: 950,
        startDate: new Date(now.getFullYear(), 0, 1),
        paymentDay: 1,
        status: 'ACTIVE',
      },
    })
    await prisma.transaction.create({
      data: {
        userId: dbUser.id,
        leaseId: leaseLate.id,
        amount: 1000,
        rentPortion: 950,
        chargesPortion: 50,
        periodStart: monthStart,
        periodEnd: monthEnd,
        dueDate: new Date(now.getFullYear(), now.getMonth(), 1),
        status: 'LATE',
        isFullPayment: false,
      },
    })

    // State D: Partial property
    const propPartial = await prisma.property.create({
      data: {
        userId: dbUser.id,
        name: 'T3 Canclaux',
        addressLine1: '8 Rue Canclaux',
        postalCode: '44000',
        city: 'Nantes',
        type: 'APARTMENT',
        surface: 65,
        rooms: 3,
      },
    })
    const tenantPartial = await prisma.tenant.create({
      data: {
        userId: dbUser.id,
        firstName: 'Antoine',
        lastName: 'Dupuis',
        email: 'antoine.dupuis@example.fr',
        addressLine1: '8 Rue Canclaux',
        postalCode: '44000',
        city: 'Nantes',
      },
    })
    const leasePartial = await prisma.lease.create({
      data: {
        userId: dbUser.id,
        propertyId: propPartial.id,
        tenantId: tenantPartial.id,
        rentAmount: 700,
        chargesAmount: 50,
        depositAmount: 700,
        startDate: new Date(now.getFullYear(), 0, 1),
        paymentDay: 5,
        status: 'ACTIVE',
      },
    })
    await prisma.transaction.create({
      data: {
        userId: dbUser.id,
        leaseId: leasePartial.id,
        amount: 450,
        rentPortion: 420,
        chargesPortion: 30,
        periodStart: monthStart,
        periodEnd: monthEnd,
        dueDate: new Date(now.getFullYear(), now.getMonth(), 5),
        paidAt: new Date(now.getFullYear(), now.getMonth(), 4),
        status: 'PARTIAL',
        isFullPayment: false,
      },
    })

    propertyIds = {
      vacant: propVacant.id,
      paid: propPaid.id,
      late: propLate.id,
      partial: propPartial.id,
    }
  })

  test('State A — VACANT : Displays clear vacancy state without fake money and provides lease CTA', async ({
    page,
  }) => {
    await page.goto(`/properties/${propertyIds.vacant}`)
    await expect(page.getByRole('heading', { name: 'Studio Graslin' })).toBeVisible()

    // Status badge: Vacant
    await expect(page.getByText('Vacant', { exact: true })).toBeVisible()

    // Vacancy banner
    await expect(page.getByText('Ce logement est actuellement vacant')).toBeVisible()

    // Action: Créer un bail pour ce bien avec destination exacte
    const createLeaseBtn = page.getByRole('link', { name: /créer un bail pour ce bien/i })
    await expect(createLeaseBtn).toBeVisible()
    await expect(createLeaseBtn).toHaveAttribute(
      'href',
      `/leases/new?propertyId=${propertyIds.vacant}`
    )

    // Absence of contradictory financial actions or statuses
    await expect(page.getByRole('button', { name: /enregistrer le paiement/i })).not.toBeVisible()
    await expect(page.getByRole('button', { name: /télécharger/i })).not.toBeVisible()
    await expect(page.getByText(/loyer charges comprises/i)).not.toBeVisible()
  })

  test('State B — ACTIVE + PAID : Displays calm paid state with immediate quittance download and no payment trigger', async ({
    page,
  }) => {
    await page.goto(`/properties/${propertyIds.paid}`)
    await expect(page.getByRole('heading', { name: 'T2 Voltaire' })).toBeVisible()

    // Status badges
    await expect(page.getByText(/Occupé \(Lucas Martin\)/i)).toBeVisible()
    await expect(page.getByText(/Payé/i).first()).toBeVisible()

    // Paid banner
    await expect(page.getByRole('heading', { name: /Loyer de .* réglé/i })).toBeVisible()
    await expect(page.getByText(/920,00\s*€\s*perçus/i)).toBeVisible()

    // Primary action: Télécharger (Quittance)
    const downloadBtn = page.getByRole('button', { name: /télécharger/i }).first()
    await expect(downloadBtn).toBeVisible()

    // Absence of contradictory action: No "Enregistrer le paiement"
    await expect(page.getByRole('button', { name: /enregistrer le paiement/i })).not.toBeVisible()
    await expect(page.getByRole('button', { name: /relancer/i })).not.toBeVisible()
  })

  test('State C — ACTIVE + LATE : Displays overdue warning with exact expected amount and manual declaration action', async ({
    page,
  }) => {
    await page.goto(`/properties/${propertyIds.late}`)
    await expect(page.getByRole('heading', { name: 'Maison Procé' })).toBeVisible()

    // Status badges
    await expect(page.getByText(/Occupé \(Camille Bernard\)/i)).toBeVisible()
    await expect(page.getByRole('heading', { name: /Loyer de .* en retard/i })).toBeVisible()

    // Financial amount expected
    await expect(page.getByText(/1\s*000,00\s*€/i).first()).toBeVisible()
    await expect(page.getByText(/attendus/i)).toBeVisible()

    // Primary actions: Enregistrer le paiement & Relancer
    await expect(
      page.getByRole('button', { name: /enregistrer le paiement/i })
    ).toBeVisible()
    await expect(page.getByRole('button', { name: /relancer/i })).toBeVisible()

    // Absence of contradictory action: No Quittance download in hero
    const heroCard = page.locator('div.rounded-xl.border').first()
    await expect(heroCard.getByRole('button', { name: /télécharger/i })).not.toBeVisible()
  })

  test('State D — ACTIVE + PARTIAL : Displays exact received amount, remaining balance, and contextual settlement button', async ({
    page,
  }) => {
    await page.goto(`/properties/${propertyIds.partial}`)
    await expect(page.getByRole('heading', { name: 'T3 Canclaux' })).toBeVisible()

    // Status badges
    await expect(page.getByText(/Occupé \(Antoine Dupuis\)/i)).toBeVisible()
    await expect(page.getByRole('heading', { name: /Paiement partiel pour/i })).toBeVisible()

    // Financial breakdown: 450 received, 300 remaining
    await expect(page.getByText(/450,00\s*€\s*reçus/i)).toBeVisible()
    await expect(page.getByText(/Reste 300,00\s*€\s*à régler/i)).toBeVisible()

    // Primary actions: Enregistrer le solde (300,00 €) & Relancer
    await expect(
      page.getByRole('button', { name: /enregistrer le solde \(300,00\s*€\)/i })
    ).toBeVisible()
    await expect(page.getByRole('button', { name: /relancer/i })).toBeVisible()

    // Absence of contradictory action: No full quittance download in hero
    const heroCard = page.locator('div.rounded-xl.border').first()
    await expect(heroCard.getByRole('button', { name: /télécharger/i })).not.toBeVisible()
  })
})
