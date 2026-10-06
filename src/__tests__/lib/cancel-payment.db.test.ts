/**
 * PRIORITÉ 4 — annuler un paiement qui a soldé un mois.
 *
 * C'est le scénario le plus dangereux du produit : un mois soldé porte une
 * quittance, qui est un document à valeur juridique. Annuler le paiement qui a
 * soldé ce mois ne doit pas laisser un état qui ment.
 *
 * Ce que le code fait aujourd'hui, et ce qui est vérifié ici :
 *
 *   900 dus -> 400 (ligne « Reçu ») -> 500 qui solde la ligne de période
 *          -> PAID + quittance
 *          -> annulation du 500
 *
 * L'invariant central, formulé avant toute mesure :
 *
 *   APRÈS ANNULATION, LE MOIS NE DOIT PAS RESTER « PAID » AVEC UNE QUITTANCE
 *   COMME SI LES 900 ÉTAIENT ENCAISSÉS.
 *
 * Il a une contrepartie, moins évidente et tout aussi importante :
 *
 *   LE DOCUMENT DÉJÀ ÉMIS NE DOIT PAS DISPARAÎTRE EN SILENCE.
 *
 * Une quittance annulée doit rester traçable (AGENTS.md 14 : ne pas réécrire un
 * document historique), mais elle ne doit plus être téléchargeable comme si de
 * rien n'était.
 *
 * Sur la vraie base, parce que le défaut est un défaut d'ÉCRITURE.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import Decimal from "decimal.js";

// `generateQuittance` is a server action: it reads the session. Same harness as
// `receipt-routes.db.test.ts`, so the session is a value the test sets rather
// than an ambient dependency that has to be stubbed per call site.
vi.mock("@/lib/auth-server", () => ({
  auth: {
    api: {
      getSession: async () => ({ user: { id: globalThis.__rrSessionUserId } }),
    },
  },
}));
vi.mock("@/lib/auth", () => ({
  getCurrentUserId: async () => globalThis.__rrSessionUserId,
}));

const DATABASE_URL = process.env.DATABASE_URL;
const describeDb = DATABASE_URL ? describe : describe.skip;

const SUFFIX = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const USER_ID = `cancel-pay-${SUFFIX}`;

const JAN = new Date("2026-01-01T00:00:00.000Z");
const JAN_END = new Date("2026-01-31T00:00:00.000Z");
const PAID_AT_1 = new Date("2026-01-10T09:00:00.000Z");
const PAID_AT_2 = new Date("2026-01-20T09:00:00.000Z");

const RENT = "900.00";

describeDb("annuler le paiement qui a soldé un mois", () => {
  let prisma: typeof import("@/lib/prisma").prisma;
  let leaseId = "";
  let propertyId = "";
  let tenantId = "";
  let periodId = "";

  const money = (v: string | Decimal) => new Decimal(v).toFixed(2);

  const rowsOf = () =>
    prisma.transaction.findMany({
      where: { leaseId, periodStart: JAN },
      orderBy: { createdAt: "asc" },
    });

  beforeAll(async () => {
    prisma = (await import("@/lib/prisma")).prisma;
    (globalThis as Record<string, unknown>).__rrSessionUserId = USER_ID;

    await prisma.user.create({
      data: {
        id: USER_ID,
        name: "Annulation",
        email: `${USER_ID}@example.test`,
        emailVerified: true,
        // `generateQuittance` refuses without a landlord address rather than
        // issuing a receipt on a document it cannot complete — correct, and the
        // fixture has to be honest about it.
        addressLine1: "3 rue du Proprietaire",
        city: "Lyon",
        postalCode: "69001",
      },
    });
    const property = await prisma.property.create({
      data: {
        userId: USER_ID, name: "Bien", addressLine1: "1 rue", city: "Lyon",
        postalCode: "69001", type: "APARTMENT",
      },
    });
    propertyId = property.id;
    const tenant = await prisma.tenant.create({
      data: {
        userId: USER_ID, firstName: "Camille", lastName: "Durand",
        email: `${USER_ID}-t@example.test`,
        addressLine1: "2 rue", city: "Lyon", postalCode: "69001",
      },
    });
    tenantId = tenant.id;
    const lease = await prisma.lease.create({
      data: {
        userId: USER_ID, propertyId, tenantId, startDate: JAN,
        rentAmount: RENT, chargesAmount: "0.00", depositAmount: "900.00",
        paymentDay: 5, status: "ACTIVE",
      },
    });
    leaseId = lease.id;

    const { generateRentPeriodsForLease } = await import("@/lib/domain/generate-rent-periods");
    await generateRentPeriodsForLease(leaseId, new Date("2026-01-03T00:00:00.000Z"));

    const period = await prisma.transaction.findFirstOrThrow({
      where: { leaseId, periodStart: JAN, paidAt: null },
    });
    periodId = period.id;

    const { recordRentPayment } = await import("@/lib/services/rent-payments");

    // 400 : l'acompte.
    await recordRentPayment({
      userId: USER_ID, leaseId, amount: "400.00",
      periodStart: JAN, periodEnd: JAN_END, dueDate: period.dueDate,
      paidAt: PAID_AT_1, duePeriodId: periodId,
    });
    // 500 : qui solde le mois.
    const closing = await recordRentPayment({
      userId: USER_ID, leaseId, amount: "500.00",
      periodStart: JAN, periodEnd: JAN_END, dueDate: period.dueDate,
      paidAt: PAID_AT_2, duePeriodId: periodId,
    });
    if (!closing.ok) throw new Error(`cloture refusee: ${closing.error}`);

    // Et la quittance, comme le ferait le propriétaire.
    const { generateQuittance } = await import("@/lib/actions/quittance-actions");
    const receipt = await generateQuittance(closing.transactionId);
    if (!receipt.success) throw new Error(`quittance non generee: ${receipt.error}`);
  });

  afterAll(async () => {
    await prisma.document.deleteMany({ where: { userId: USER_ID } });
    await prisma.transaction.deleteMany({ where: { userId: USER_ID } });
    await prisma.lease.deleteMany({ where: { userId: USER_ID } });
    await prisma.tenant.deleteMany({ where: { id: tenantId } });
    await prisma.property.deleteMany({ where: { id: propertyId } });
    await prisma.user.deleteMany({ where: { id: USER_ID } });
  });

  it("AVANT : le mois est soldé et une quittance existe", async () => {
    const rows = await rowsOf();
    const period = rows.find((r) => r.id === periodId)!;

    expect(period.status).toBe("PAID");
    expect(period.receiptType).toBe("QUITTANCE");

    const docs = await prisma.document.findMany({
      where: { userId: USER_ID, transactionId: periodId },
    });
    expect(docs).toHaveLength(1);
    expect(docs[0].fileUrl).toContain("QUI-");
  });

  it("APRÈS ANNULATION : le mois redevient ce qu'il est réellement", async () => {
    const { cancelRentPayment } = await import("@/lib/services/rent-payments");
    const result = await cancelRentPayment({ userId: USER_ID, transactionId: periodId });
    if (!result.ok) throw new Error(`annulation refusee: ${result.error}`);

    // 500 EUR ont été rendus : le mois porte de nouveau 500.
    expect(money(result.collectable)).toBe("500.00");

    const rows = await rowsOf();
    const period = rows.find((r) => r.id === periodId)!;

    // LE POINT. Le mois ne doit plus se dire soldé.
    expect(period.status).not.toBe("PAID");
    // Et il ne doit plus porter de quittance alors que 500 manquent.
    expect(period.receiptType).toBeNull();
  });

  it("l'acompte de 400 survit : seul le paiement annulé est rendu", async () => {
    const rows = await rowsOf();
    const instalment = rows.find((r) => money(r.amount) === "400.00")!;

    expect(instalment).toBeDefined();
    expect(instalment.status).not.toBe("CANCELLED");
    expect(instalment.receiptType).toBe("RECU");
  });

  it("le total encaissé retombe à ce qui est réellement entré", async () => {
    const received = await prisma.transaction.findMany({
      where: { leaseId, paidAt: { not: null }, status: { not: "CANCELLED" } },
      select: { amount: true },
    });
    const total = received.reduce((s, r) => s.plus(new Decimal(r.amount)), new Decimal(0));

    expect(total.toFixed(2)).toBe("400.00");
  });

  it("le document émis N'EST PAS effacé, mais il n'est plus presented comme valide", async () => {
    const docs = await prisma.document.findMany({
      where: { userId: USER_ID, transactionId: periodId },
    });

    // Une quittance est un document juridique : la supprimer en silence
    // effacerait la trace d'un acte émis.
    expect(docs).toHaveLength(1);

    // Mais la transaction qui la porte est annulée : plus aucune quittance
    // ne doit être annoncée pour un mois dont l'encaissement a été rendu.
    const rows = await rowsOf();
    const period = rows.find((r) => r.id === periodId)!;
    expect(period.status).toBe("CANCELLED");

    const quittances = await prisma.transaction.count({
      where: { leaseId, receiptType: "QUITTANCE", status: { not: "CANCELLED" } },
    });
    expect(quittances).toBe(0);
  });

  it("le mois peut être soldé de nouveau après l'annulation", async () => {
    // Un bail ne doit pas rester bloqué : le propriétaire corrige, puis paie.
    const { recordRentPayment } = await import("@/lib/services/rent-payments");
    const reopened = await prisma.transaction.findFirstOrThrow({
      where: { leaseId, periodStart: JAN, paidAt: null, status: { not: "CANCELLED" } },
    });

    // La ligne rouverte porte le mois ENTIER, pas ce qu'il en reste. C'est
    // l'invariant que le prorata des portions violait.
    expect(money(reopened.rentPortion)).toBe(RENT);

    // Le reste réel se LIT sur la ligne rouverte, il ne se devine pas : c'est
    // exactement le chiffre que l'echec precedent a refuse (100 au lieu de 500)
    // sans dire pourquoi.
    const result = await recordRentPayment({
      userId: USER_ID, leaseId, amount: money(reopened.amount),
      periodStart: JAN, periodEnd: JAN_END, dueDate: reopened.dueDate,
      paidAt: PAID_AT_2, duePeriodId: reopened.id,
    });
    if (!result.ok) throw new Error(`recloture refusee: ${result.error}`);
    expect(result.receiptType).toBe("QUITTANCE");

    const received = await prisma.transaction.findMany({
      where: { leaseId, paidAt: { not: null }, status: { not: "CANCELLED" } },
      select: { amount: true },
    });
    const total = received.reduce((s, r) => s.plus(new Decimal(r.amount)), new Decimal(0));
    expect(total.toFixed(2)).toBe("900.00");
  });
});