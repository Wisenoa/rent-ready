"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export type ActionResult = {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
};

/**
 * Inserts realistic demo data for a new user to explore the app.
 * Creates: 3 properties, 4 tenants, 3 leases, 3 expense categories,
 * 6 expenses, 2 maintenance tickets.
 */
export async function insertSampleData(): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return { success: false, error: "Non autorisé." };
    }

    // Check if user already has data
    const [existingProperties, existingTenants] = await Promise.all([
      prisma.property.findFirst({ where: { userId } }),
      prisma.tenant.findFirst({ where: { userId } }),
    ]);

    if (existingProperties || existingTenants) {
      return {
        success: false,
        error: "Vous avez déjà des données. Effacez-les d'abord pour réessayer.",
      };
    }

    const now = new Date();

    // ── 1. Create 3 properties ──────────────────────────────────────
    const prop1 = await prisma.property.create({
      data: {
        userId,
        name: "Appartement Bastille",
        type: "APARTMENT",
        addressLine1: "12 rue de la Roquette",
        postalCode: "75011",
        city: "Paris",
        surface: 62,
        rooms: 3,
      },
    });

    const prop2 = await prisma.property.create({
      data: {
        userId,
        name: "Studio Presqu'île",
        type: "STUDIO",
        addressLine1: "8 rue de la République",
        postalCode: "69001",
        city: "Lyon",
        surface: 22,
        rooms: 1,
      },
    });

    const prop3 = await prisma.property.create({
      data: {
        userId,
        name: "Maison Camille",
        type: "HOUSE",
        addressLine1: "24 avenue des Catalans",
        postalCode: "13007",
        city: "Marseille",
        surface: 95,
        rooms: 4,
      },
    });

    // ── 2. Create 4 tenants ─────────────────────────────────────────
    const tenant1 = await prisma.tenant.create({
      data: {
        userId,
        firstName: "Sophie",
        lastName: "Martin",
        email: "sophie.martin@email.fr",
        phone: "06 12 34 56 78",
        addressLine1: "12 rue de la Roquette",
        postalCode: "75011",
        city: "Paris",
        dateOfBirth: new Date("1992-03-15"),
        placeOfBirth: "Paris",
      },
    });

    const tenant2 = await prisma.tenant.create({
      data: {
        userId,
        firstName: "Lucas",
        lastName: "Bernard",
        email: "lucas.bernard@email.fr",
        phone: "06 23 45 67 89",
        addressLine1: "8 rue de la République",
        postalCode: "69001",
        city: "Lyon",
        dateOfBirth: new Date("1988-07-22"),
        placeOfBirth: "Lyon",
      },
    });

    const tenant3 = await prisma.tenant.create({
      data: {
        userId,
        firstName: "Emma",
        lastName: "Dubois",
        email: "emma.dubois@email.fr",
        phone: "06 34 56 78 90",
        addressLine1: "24 avenue des Catalans",
        postalCode: "13007",
        city: "Marseille",
        dateOfBirth: new Date("1995-11-08"),
        placeOfBirth: "Marseille",
      },
    });

    const tenant4 = await prisma.tenant.create({
      data: {
        userId,
        firstName: "Hugo",
        lastName: "Petit",
        email: "hugo.petit@email.fr",
        phone: "06 45 67 89 01",
        addressLine1: "24 avenue des Catalans",
        postalCode: "13007",
        city: "Marseille",
        dateOfBirth: new Date("1990-04-30"),
        placeOfBirth: "Aix-en-Provence",
      },
    });

    // ── 3. Create 3 leases (started 6-8 months ago) ─────────────────
    const lease1Start = new Date(now.getFullYear(), now.getMonth() - 8, 1);
    const lease1End = new Date(now.getFullYear(), now.getMonth() + 4, 0);

    const lease1 = await prisma.lease.create({
      data: {
        userId,
        propertyId: prop1.id,
        tenantId: tenant1.id,
        startDate: lease1Start,
        endDate: lease1End,
        rentAmount: 1200,
        chargesAmount: 150,
        depositAmount: 2400,
        status: "ACTIVE",
        leaseType: "UNFURNISHED",
        paymentDay: 1,
        paymentMethod: "TRANSFER",
      },
    });

    const lease2Start = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    const lease2End = new Date(now.getFullYear(), now.getMonth() + 6, 0);

    const lease2 = await prisma.lease.create({
      data: {
        userId,
        propertyId: prop2.id,
        tenantId: tenant2.id,
        startDate: lease2Start,
        endDate: lease2End,
        rentAmount: 650,
        chargesAmount: 80,
        depositAmount: 1300,
        status: "ACTIVE",
        leaseType: "UNFURNISHED",
        paymentDay: 5,
        paymentMethod: "TRANSFER",
      },
    });

    const lease3Start = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    const lease3End = new Date(now.getFullYear() + 1, now.getMonth(), 0);

    const lease3 = await prisma.lease.create({
      data: {
        userId,
        propertyId: prop3.id,
        tenantId: tenant3.id,
        startDate: lease3Start,
        endDate: lease3End,
        rentAmount: 1800,
        chargesAmount: 200,
        depositAmount: 3600,
        status: "ACTIVE",
        leaseType: "UNFURNISHED",
        paymentDay: 1,
        paymentMethod: "TRANSFER",
      },
    });

    // ── 4. Create 6 past transactions (paid, last 6 months for lease 1) ──
    for (let i = 6; i >= 1; i--) {
      const periodStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      const paidAt = new Date(now.getFullYear(), now.getMonth() - i, 3);

      await prisma.transaction.create({
        data: {
          userId,
          leaseId: lease1.id,
          amount: 1350,
          rentPortion: 1200,
          chargesPortion: 150,
          periodStart,
          periodEnd,
          dueDate: new Date(now.getFullYear(), now.getMonth() - i, 1),
          paidAt,
          paymentMethod: "TRANSFER",
          status: "PAID",
          isFullPayment: true,
          receiptType: "QUITTANCE",
          receiptNumber: `Q-${now.getFullYear()}-${String(now.getMonth() - i + 1).padStart(2, "0")}-001`,
        },
      });
    }

    // ── 5. Create 3 expense categories and 6 expenses ─────────────────
    // Category: Gardiennage / Entretien
    await prisma.expense.create({
      data: {
        userId,
        propertyId: prop1.id,
        vendorName: "Citya Property",
        description: "Frais de gestion locative - mois de janvier",
        amount: 9.5,
        category: "MANAGEMENT_FEES",
        date: new Date(now.getFullYear(), now.getMonth() - 1, 28),
        aiExtracted: false,
      },
    });

    await prisma.expense.create({
      data: {
        userId,
        propertyId: prop1.id,
        vendorName: "EDF",
        description: "Électricité parties communes",
        amount: 85.5,
        category: "ELECTRICAL",
        date: new Date(now.getFullYear(), now.getMonth() - 2, 15),
        aiExtracted: false,
      },
    });

    await prisma.expense.create({
      data: {
        userId,
        propertyId: prop1.id,
        vendorName: "Quali哲",
        description: "Remplacement thermostat défectueux",
        amount: 320,
        category: "RENOVATION",
        date: new Date(now.getFullYear(), now.getMonth() - 3, 10),
        aiExtracted: false,
      },
    });

    await prisma.expense.create({
      data: {
        userId,
        propertyId: prop2.id,
        vendorName: "Copro République",
        description: "Charges de copropriété trimestre",
        amount: 240,
        category: "CONDO_FEES",
        date: new Date(now.getFullYear(), now.getMonth() - 1, 20),
        aiExtracted: false,
      },
    });

    await prisma.expense.create({
      data: {
        userId,
        propertyId: prop3.id,
        vendorName: "Marseille Assurances",
        description: "Assurance propriétaire non occupant",
        amount: 450,
        category: "INSURANCE",
        date: new Date(now.getFullYear(), now.getMonth() - 4, 1),
        aiExtracted: false,
      },
    });

    await prisma.expense.create({
      data: {
        userId,
        propertyId: prop3.id,
        vendorName: "Plombier Express",
        description: "Intervention fuite salle de bain",
        amount: 190,
        category: "PLUMBING",
        date: new Date(now.getFullYear(), now.getMonth() - 1, 5),
        aiExtracted: false,
      },
    });

    // ── 6. Create 2 maintenance tickets ──────────────────────────────
    await prisma.maintenanceTicket.create({
      data: {
        propertyId: prop1.id,
        tenantId: tenant1.id,
        title: "Robinet de la cuisine qui fuit",
        description: "Le robinet de l'évier coule légèrement même fermé. Un goutte-à-goutte constant.",
        priority: "MEDIUM",
        status: "OPEN",
      },
    });

    await prisma.maintenanceTicket.create({
      data: {
        propertyId: prop2.id,
        tenantId: tenant2.id,
        title: "Chauffage ne fonctionnant plus",
        description: "Le radiateur de la chambre ne chauffe plus depuis 2 jours.",
        priority: "HIGH",
        status: "IN_PROGRESS",
      },
    });

    // ── 7. Clear onboarding state ───────────────────────────────────
    // (localStorage clearing happens client-side after this action succeeds)

    revalidatePath("/dashboard");
    revalidatePath("/properties");
    revalidatePath("/tenants");
    revalidatePath("/leases");
    revalidatePath("/expenses");
    revalidatePath("/maintenance");

    return {
      success: true,
      data: {
        propertyIds: [prop1.id, prop2.id, prop3.id],
        tenantIds: [tenant1.id, tenant2.id, tenant3.id, tenant4.id],
        leaseIds: [lease1.id, lease2.id, lease3.id],
      },
    };
  } catch (error) {
    console.error("insertSampleData error:", error);
    return {
      success: false,
      error: "Impossible d'insérer les données de démonstration. Veuillez réessayer.",
    };
  }
}
