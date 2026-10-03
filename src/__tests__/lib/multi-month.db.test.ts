/**
 * PRIORITÉ 1 — le temps. Un bail qui traverse des mois, un horloge contrôlée.
 *
 * Le risque le plus resté après le correctif des quittances n'était pas « le mois
 * courant fonctionne-t-il ? » mais « RentReady fonctionne-t-il encore le mois
 * suivant ? ». Aucune donnée de test ne le démontrait : les scénarios existants
 * sont tous bornés à un mois.
 *
 * Le scénario est volontairement laid, parce que c'est le monde réel :
 *
 *   janvier  dû 900  payé 900   -> soldé, quittance
 *   février  dû 900  payé 400   -> partiel, reste 500, AUCUNE quittance
 *   mars     dû 900  payé 0     -> impayé
 *
 *   encaissé  1300
 *   restant   1400  (500 de février + 900 de mars)
 *
 * Puis le générateur est rejoué, parce qu'un cron qui tourne deux fois doit
 * créer la même chose qu'une fois. Le changement d'année (décembre → janvier)
 * est également traversé, car c'est là que les bornes de mois se constructions
 * le plus facilement.
 *
 * Aucune horloge système : `generateRentPeriodsForLease` prend `now`, donc le
 * temps est une donnée du test et non une dépendance de l'environnement.
 *
 * Sur la vraie base, parce que les défauts visés sont des défauts d'ÉCRITURE :
 * ce qu'une période fige et ce qu'un règlement fige sont des faits sur des
 * lignes, pas des valeurs de retour.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Decimal from "decimal.js";

const DATABASE_URL = process.env.DATABASE_URL;
const describeDb = DATABASE_URL ? describe : describe.skip;

const SUFFIX = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const USER_ID = `multi-mois-${SUFFIX}`;

const MONTH = (y: number, m: number) => new Date(Date.UTC(y, m - 1, 1));
const DAY = (y: number, m: number, d: number) => new Date(Date.UTC(y, m - 1, d));

const JAN = MONTH(2026, 1);
const FEB = MONTH(2026, 2);
const MAR = MONTH(2026, 3);

const RENT = "900.00";

/** The money the whole scenario puts in, and the money it leaves out. */
const EXPECTED_COLLECTED = "1300.00";

/**
 * What is still owed at the point this is asserted: février 500 + mars 900 +
 * avril 900. Avril is in the figure because the previous test replayed the
 * generator up to 2 April — the expected total follows the scenario, it is not
 * a guess written before the scenario ran.
 */
const EXPECTED_OUTSTANDING = "2300.00";

/** Ce que `getLeaseArrears` rapporte au 15/04 : les trois mois sont échus. */
const EXPECTED_OVERDUE = "2300.00";

describeDb("un bail traverse plusieurs mois", () => {
  let prisma: typeof import("@/lib/prisma").prisma;
  let leaseId = "";
  let propertyId = "";
  let tenantId = "";

  const generate = async (now: Date) => {
    const { generateRentPeriodsForLease } = await import(
      "@/lib/domain/generate-rent-periods"
    );
    return generateRentPeriodsForLease(leaseId, now);
  };

  const pay = async (amount: string, periodStart: Date, paidAt: Date) => {
    const { recordRentPayment } = await import("@/lib/services/rent-payments");
    const period = await prisma.transaction.findFirst({
      where: { leaseId, periodStart, paidAt: null, status: { not: "CANCELLED" } },
    });
    if (!period) throw new Error(`pas de periode ouverte pour ${periodStart.toISOString()}`);
    const result = await recordRentPayment({
      userId: USER_ID,
      leaseId,
      amount,
      periodStart,
      periodEnd: new Date(Date.UTC(
        periodStart.getUTCFullYear(),
        periodStart.getUTCMonth() + 1,
        0,
      )),
      dueDate: period.dueDate,
      paidAt,
      duePeriodId: period.id,
    });
    // `recordRentPayment` is a discriminated union: a refusal has no receiptType,
    // and reading it as if it did would hide the very failure this file hunts.
    if (!result.ok) throw new Error(`paiement refuse (${result.code}): ${result.error}`);
    return result;
  };

  /** Every row of the lease for a month, instalments included. */
  const rowsOf = (periodStart: Date) =>
    prisma.transaction.findMany({
      where: { leaseId, periodStart, status: { not: "CANCELLED" } },
      orderBy: { createdAt: "asc" },
    });

  /** Every still-open obligation of the lease, with what is owed on each. */
  const openObligations = async (now: Date) => {
    const { getLeaseArrears } = await import("@/lib/domain/generate-rent-periods");
    return getLeaseArrears(leaseId, now);
  };

  /**
   * What the landlord is still owed across the lease, summed in Decimal.
   *
   * `getLeaseArrears` answers a NARROWER question than its name suggests: it
   * filters to `status === "OVERDUE"`, so it reports only what is already past
   * due. A month that has begun but is not yet late is an open obligation and
   * does not appear. Summing that would understate what a tenant owes, so the
   * open rows are read directly instead.
   */
  const totalOutstanding = async () => {
    const rows = await prisma.transaction.findMany({
      where: { leaseId, paidAt: null, status: { not: "CANCELLED" } },
      select: { amount: true },
    });
    return rows.reduce((s, r) => s.plus(new Decimal(r.amount)), new Decimal(0));
  };

  /** The subset `getLeaseArrears` does report, to check it agrees on its own scope. */
  const totalOverdue = async (now: Date) => {
    const rows = await openObligations(now);
    return rows.reduce((s, r) => s.plus(new Decimal(r.outstanding)), new Decimal(0));
  };

  /** Compare money by value, not by how Prisma happens to render the scale. */
  const asMoney = (value: string | Decimal) => new Decimal(value).toFixed(2);

  const sumReceived = async () => {
    const rows = await prisma.transaction.findMany({
      where: { leaseId, paidAt: { not: null }, status: { not: "CANCELLED" } },
      select: { amount: true },
    });
    return rows.reduce((s, r) => s.plus(new Decimal(r.amount)), new Decimal(0));
  };

  beforeAll(async () => {
    prisma = (await import("@/lib/prisma")).prisma;
    await prisma.user.create({
      data: {
        id: USER_ID,
        name: "Multi-mois",
        email: `${USER_ID}@example.test`,
        emailVerified: true,
      },
    });
    const property = await prisma.property.create({
      data: {
        userId: USER_ID,
        name: "Bien multi-mois",
        addressLine1: "1 rue des Mois",
        city: "Lyon",
        postalCode: "69001",
        type: "APARTMENT",
      },
    });
    propertyId = property.id;
    const tenant = await prisma.tenant.create({
      data: {
        userId: USER_ID,
        firstName: "Camille",
        lastName: "Durand",
        email: `${USER_ID}-tenant@example.test`,
        addressLine1: "2 rue des Mois",
        city: "Lyon",
        postalCode: "69001",
      },
    });
    tenantId = tenant.id;
    const lease = await prisma.lease.create({
      data: {
        userId: USER_ID,
        propertyId,
        tenantId,
        startDate: JAN,
        rentAmount: RENT,
        chargesAmount: "0.00",
        depositAmount: "900.00",
        paymentDay: 5,
        status: "ACTIVE",
      },
    });
    leaseId = lease.id;
  });

  afterAll(async () => {
    await prisma.transaction.deleteMany({ where: { userId: USER_ID } });
    await prisma.lease.deleteMany({ where: { userId: USER_ID } });
    await prisma.tenant.deleteMany({ where: { id: tenantId } });
    await prisma.property.deleteMany({ where: { id: propertyId } });
    await prisma.user.deleteMany({ where: { id: USER_ID } });
  });

  it("JANVIER : le bail démarre, un mois est dû", async () => {
    const r = await generate(DAY(2026, 1, 3));
    expect(r.created).toBe(1);

    const rows = await rowsOf(JAN);
    expect(rows).toHaveLength(1);
    expect(asMoney(rows[0].amount)).toBe(RENT);
    expect(rows[0].status).toBe("PENDING");
  });

  it("JANVIER : payé en une fois -> soldé, quittance disponible", async () => {
    const r = await pay(RENT, JAN, DAY(2026, 1, 5));
    expect(r.ok).toBe(true);
    expect(r.receiptType).toBe("QUITTANCE");

    const rows = await rowsOf(JAN);
    expect(rows).toHaveLength(1);
    expect(rows[0].status).toBe("PAID");
    expect(rows[0].receiptType).toBe("QUITTANCE");
  });

  it("FÉVRIER : le mois suivant apparaît tout seul, sans rien demander", async () => {
    const r = await generate(DAY(2026, 2, 3));
    expect(r.created).toBe(1);

    // Janvier reste exactement ce qu'il était : un mois soldé ne se réécrit pas
    // parce qu'un autre mois vient d'apparaître.
    const jan = await rowsOf(JAN);
    expect(jan).toHaveLength(1);
    expect(asMoney(jan[0].amount)).toBe(RENT);
    expect(jan[0].status).toBe("PAID");
    expect(jan[0].receiptType).toBe("QUITTANCE");
  });

  it("FÉVRIER : paiement partiel -> reste 500, et AUCUNE quittance", async () => {
    const r = await pay("400.00", FEB, DAY(2026, 2, 10));
    expect(r.ok).toBe(true);
    expect(r.receiptType).toBe("RECU");

    const rows = await rowsOf(FEB);
    // Deux lignes : l'acompte et la période, qui porte le solde restant.
    expect(rows).toHaveLength(2);

    const period = rows.find((x) => x.receiptType === null)!;
    expect(asMoney(period.amount)).toBe("500.00");
    expect(period.paidAt).toBeNull();

    // Aucun document de quittance pour un mois non soldé.
    const quittances = await prisma.transaction.count({
      where: { leaseId, receiptType: "QUITTANCE" },
    });
    expect(quittances).toBe(1); // celle de janvier, et elle seule
  });

  it("MARS : impayé, et l'écart se lit dans le total", async () => {
    await generate(DAY(2026, 3, 3));

    const mar = await rowsOf(MAR);
    expect(mar).toHaveLength(1);
    expect(mar[0].status).toBe("PENDING");
    expect(mar[0].paidAt).toBeNull();

    // 900 de janvier + 400 de février. Mars n'apporte rien.
    expect((await sumReceived()).toFixed(2)).toBe(EXPECTED_COLLECTED);
  });

  it("REJOUER le générateur ne duplique ni période ni paiement", async () => {
    const before = await prisma.transaction.count({ where: { leaseId } });

    const again = await generate(DAY(2026, 3, 15));
    expect(again.created).toBe(0);

    // Rejouer un cron est le cas normal : le dispatcher tourne tous les jours.
    const later = await generate(DAY(2026, 4, 2));
    expect(later.created).toBe(1); // avril, et lui seul

    const after = await prisma.transaction.count({ where: { leaseId } });
    expect(after).toBe(before + 1);

    // Aucune période en double : une échéance par mois, pas deux.
    const starts = await prisma.transaction.findMany({
      where: { leaseId, paidAt: null, status: { not: "CANCELLED" } },
      select: { periodStart: true },
    });
    const keys = starts.map((s) => s.periodStart.toISOString().slice(0, 10));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("le reste à payer est la somme EXACTE des obligations ouvertes", async () => {
    // Mesuré à cet instant, pas supposé : un test qui lit un total doit dire de
    // quoi il est fait. Février 500 + mars 900 + avril 900.
    const openRows = await prisma.transaction.findMany({
      where: { leaseId, paidAt: null, status: { not: "CANCELLED" } },
      select: { periodStart: true, amount: true },
      orderBy: { periodStart: "asc" },
    });
    expect(openRows.map((r) => asMoney(r.amount))).toEqual(["500.00", "900.00", "900.00"]);
    expect((await totalOutstanding()).toFixed(2)).toBe(EXPECTED_OUTSTANDING);

    // `getLeaseArrears` répond à une question plus étroite que son nom ne le
    // dit : il ne retient que le `status === "OVERDUE"`. Au 15/04 les trois mois
    // sont échus, donc il tombe juste ici — mais dès qu'un mois de mars ne serait
    // pas encore dû, les deux chiffres divergeraient, et le test le voit.
    expect((await totalOverdue(DAY(2026, 4, 15))).toFixed(2)).toBe(EXPECTED_OVERDUE);
  });

  it("le passage décembre 2026 → janvier 2027 ne perd rien", async () => {
    // On solde l'année entière pour que le compteur reparte de zéro. Février ne
    // l'est pas d'un coup : il porte 400 reçus sur 900 dus, et le produit REFUSE
    // 900 dessus — comportement correct, pas un défaut. On paie donc le reste
    // que chaque période porte réellement.
    for (let m = 2; m <= 12; m++) {
      const start = MONTH(2026, m);
      const period = await prisma.transaction.findFirst({
        where: { leaseId, periodStart: start, paidAt: null, status: { not: "CANCELLED" } },
      });
      if (!period) continue;
      await pay(asMoney(period.amount), start, DAY(2026, m, 5));
    }
    // Le passage d'annee demande d'abord que le generateur MATERIALISE les mois
    // de 2027 : il ne fait que ce qui existe deja. Sans cet appel, janvier 2027
    // n'existe pas et le test ne teste rien — c'est ce que la mesure a montre.
    await generate(DAY(2027, 1, 3));

    const jan2027 = await rowsOf(MONTH(2027, 1));
    expect(jan2027).toHaveLength(1);
    expect(asMoney(jan2027[0].amount)).toBe(RENT);
    expect(jan2027[0].status).toBe("PENDING");

    // Un an change, la règle ne change pas : janvier 2027 doit être la seule
    // obligation ouverte.
    // Le reste n'est PAS 900 : la boucle ci-dessus ne solde que 2026, et le
    // générateur a matérialisé janvier 2027. Le reste vaut donc tous les mois de
    // 2027 encore ouverts au moment de la mesure — mesuré ici plutôt que deviné,
    // parce que c'est exactement le genre de figure que l'on croit avoir comprise
    // et que l'on se trompe.
    // Ce qui reste ouvert, dans l'ordre : mai 2026 a decembre 2026 sont des mois
    // que la boucle de paiement n'a pas touches (ils n'existaient pas au moment
    // ou elle a tourne), et janvier 2027 vient d'etre materialise.
    const openAfterYear = await prisma.transaction.findMany({
      where: { leaseId, paidAt: null, status: { not: "CANCELLED" } },
      select: { periodStart: true, amount: true },
      orderBy: { periodStart: "asc" },
    });
    expect(openAfterYear.map((r) => r.periodStart.toISOString().slice(0, 7))).toEqual([
      "2026-05", "2026-06", "2026-07", "2026-08", "2026-09",
      "2026-10", "2026-11", "2026-12", "2027-01",
    ]);
    expect(openAfterYear.map((r) => asMoney(r.amount))).toEqual(Array(9).fill(RENT));
    expect((await totalOutstanding()).toFixed(2)).toBe("8100.00");
  });

  it("le total encaissé et le reste à payer se réconcilient", async () => {
    const received = await sumReceived();
    const outstanding = await totalOutstanding();

    // Ce qui a été reçu et ce qui reste dû doivent reconstruire l'obligation
    // totale du bail, sans reliquat : c'est la réconciliation qui distingue un
    // moteur cohérent d'un moteur qui perd de l'argent en route.
    const billed = await prisma.transaction.findMany({
      where: { leaseId, status: { not: "CANCELLED" } },
      select: { amount: true },
    });
    const billedTotal = billed.reduce((s, r) => s.plus(new Decimal(r.amount)), new Decimal(0));

    // Chaque ligne ne doit porter qu'une fois sa part : une période ne duplique
    // pas son montant et ne le partage pas non plus avec ses acomptes.
    expect(received.plus(outstanding).minus(billedTotal).abs().lte("0.01")).toBe(true);

    // Aucune période payée ne doit apparaître comme outstanding, ni l'inverse.
    const settledButOwed = await prisma.transaction.findMany({
      where: { leaseId, status: "PAID", paidAt: null },
    });
    expect(settledButOwed).toHaveLength(0);
  });
});