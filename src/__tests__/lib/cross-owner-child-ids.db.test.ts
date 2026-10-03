/**
 * PRIORITÉ 7 — un parent que l'on possède ne rend pas fiable un enfant fourni
 * par le client.
 *
 * `authorization-isolation.db.test.ts` couvre déjà la lecture croisée et la
 * création sur une ressource étrangère. Ce qui manque, et ce que ce fichier
 * ajoute, c'est le cas MIXTE : Alice possède bien son bail, son bien, son
 * locataire — et fournit une période ou une transaction qui, elle, appartient à
 * Bob.
 *
 * C'est le trou le plus facile à laisser passer, parce que le handler fait la
 * vérification évidente (le bail est bien à moi) puis fait confiance au second
 * identifiant. Tout se passe alors sans erreur visible, et de l'argent enters
 * dans le bail d'Alice depuis le bail de Bob.
 *
 * Seul le cas que les autres fichiers ne couvrent pas est ajouté ici. Sur la
 * vraie base, avec une seule chose mockée : la session.
 */
import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";

const DATABASE_URL = process.env.DATABASE_URL;
const describeDb = DATABASE_URL ? describe : describe.skip;

const SUFFIX = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const ALICE = `cross-alice-${SUFFIX}`;
const BOB = `cross-bob-${SUFFIX}`;

const SESSION_USER_ID = ALICE;

vi.mock("@/lib/auth-server", () => ({
  auth: { api: { getSession: async () => ({ user: { id: SESSION_USER_ID } }) } },
}));

const JAN_START = new Date("2026-01-01T00:00:00.000Z");
const JAN_END = new Date("2026-01-31T00:00:00.000Z");

describeDb("un bail possédé ne rend pas fiable une période étrangère", () => {
  let prisma: typeof import("@/lib/prisma").prisma;
  let recordRentPayment: typeof import("@/lib/services/rent-payments").recordRentPayment;

  let leaseAlice = "";
  let leaseBob = "";
  let periodBob = "";
  let periodAlice = "";

  beforeAll(async () => {
    prisma = (await import("@/lib/prisma")).prisma;
    ({ recordRentPayment } = await import("@/lib/services/rent-payments"));

    await prisma.user.createMany({
      data: [
        { id: ALICE, name: "Alice", email: `${ALICE}@example.test`, emailVerified: true },
        { id: BOB, name: "Bob", email: `${BOB}@example.test`, emailVerified: true },
      ],
    });

    for (const [userId, tag] of [
      [ALICE, "alice"],
      [BOB, "bob"],
    ] as const) {
      const property = await prisma.property.create({
        data: {
          userId, name: `Bien ${tag}`, addressLine1: "1 rue",
          city: "Lyon", postalCode: "69001", type: "APARTMENT",
        },
      });
      const tenant = await prisma.tenant.create({
        data: {
          userId, firstName: tag, lastName: "Test",
          email: `${tag}-${SUFFIX}@example.test`,
          addressLine1: "2 rue", city: "Lyon", postalCode: "69001",
        },
      });
      const lease = await prisma.lease.create({
        data: {
          userId, propertyId: property.id, tenantId: tenant.id,
          startDate: JAN_START, rentAmount: "900.00", chargesAmount: "0.00",
          depositAmount: "900.00", paymentDay: 5, status: "ACTIVE",
        },
      });
      const period = await prisma.transaction.create({
        data: {
          userId, leaseId: lease.id, amount: "900.00",
          rentPortion: "900.00", chargesPortion: "0.00",
          periodStart: JAN_START, periodEnd: JAN_END,
          dueDate: JAN_START, status: "PENDING",
        },
      });
      if (tag === "alice") {
        leaseAlice = lease.id;
        periodAlice = period.id;
      } else {
        leaseBob = lease.id;
        periodBob = period.id;
      }
    }
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany({ where: { userId: { in: [ALICE, BOB] } } });
    await prisma.lease.deleteMany({ where: { userId: { in: [ALICE, BOB] } } });
    await prisma.tenant.deleteMany({ where: { userId: { in: [ALICE, BOB] } } });
    await prisma.property.deleteMany({ where: { userId: { in: [ALICE, BOB] } } });
    await prisma.user.deleteMany({ where: { id: { in: [ALICE, BOB] } } });
  });

  it("la période de Bob est bien réelle — le refus ci-dessous est de l'isolation", async () => {
    const row = await prisma.transaction.findUnique({ where: { id: periodBob } });
    expect(row).not.toBeNull();
    expect(row!.userId).toBe(BOB);
    expect(row!.paidAt).toBeNull();
  });

  it("une période ÉTRANGÈRE est refusée, même sur le bail d'Alice", async () => {
    const result = await recordRentPayment({
      userId: ALICE,
      leaseId: leaseAlice, // bien à elle
      amount: "900.00",
      periodStart: JAN_START,
      periodEnd: JAN_END,
      dueDate: JAN_START,
      duePeriodId: periodBob, // PAS à elle
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      // Le refus ne doit rien dire sur l'existence de la période de Bob : « pas
      // trouvée » et « pas à vous » sont le même résultat du point de vue de
      // quelqu'un qui devine des identifiants.
      expect(["PERIOD_NOT_FOUND", "FORBIDDEN", "PERIOD_NOT_COLLECTABLE"]).toContain(
        result.code,
      );
    }
  });

  it("le refus n'a rien écrit, ni chez Bob ni chez Alice", async () => {
    // Un refus qui laisse une trace est un refus raté.
    const bobsPeriod = await prisma.transaction.findUniqueOrThrow({
      where: { id: periodBob },
    });
    expect(bobsPeriod.paidAt).toBeNull();
    expect(bobsPeriod.status).toBe("PENDING");

    const alicesPeriod = await prisma.transaction.findUniqueOrThrow({
      where: { id: periodAlice },
    });
    expect(alicesPeriod.paidAt).toBeNull();

    // Et aucune ligne d'acompte n'a été créée d'un côté ni de l'autre.
    const receipts = await prisma.transaction.count({
      where: {
        leaseId: { in: [leaseAlice, leaseBob] },
        paidAt: { not: null },
      },
    });
    expect(receipts).toBe(0);
  });

  it("une transaction ÉTRANGÈRE ne peut pas être annulée par Alice", async () => {
    const { cancelRentPayment } = await import("@/lib/services/rent-payments");

    const result = await cancelRentPayment({
      userId: ALICE,
      transactionId: periodBob,
    });

    // Une période non payée n'est de toute façon pas annulable ; le test qui
    // compte est qu'A ne soit pas parvenue à la toucher.
    const untouched = await prisma.transaction.findUniqueOrThrow({
      where: { id: periodBob },
    });
    expect(untouched.status).not.toBe("CANCELLED");

    if (result.ok) {
      // Si l'annulation passait, la ligne serait marquée : c'est exactement ce
      // que ce test interdit.
      throw new Error("Alice a pu annuler une transaction de Bob");
    }
  });

  it("Alice ne peut pas payer sur le bail de Bob, quel que soit l'id fourni", async () => {
    const result = await recordRentPayment({
      userId: ALICE,
      leaseId: leaseBob, // pas à elle
      amount: "100.00",
      periodStart: JAN_START,
      periodEnd: JAN_END,
      dueDate: JAN_START,
      duePeriodId: periodBob,
    });

    expect(result.ok).toBe(false);

    const bobsPeriod = await prisma.transaction.findUniqueOrThrow({
      where: { id: periodBob },
    });
    expect(bobsPeriod.paidAt).toBeNull();
    expect(bobsPeriod.amount.toString()).toBe("900");
  });
});