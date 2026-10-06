/**
 * Months must chain on their own. That is the beta promise, and until now
 * nothing proved it.
 *
 * Every other suite injects a `now` into a PURE function: `enumerateRentPeriods`
 * given April returns April. That is not the claim. The claim is that a lease
 * created in March still produces April, May and June after the clock moves,
 * with no human touching anything — and that the second run of the cron on the
 * same day adds nothing.
 *
 * Both halves were untested, and the untested half was the one that mattered:
 * `generateRentPeriodsForLease` derives the range from `lease.startDate` to
 * `now`, and every call site passes `new Date()`. So the behaviour depended on a
 * property of the CLOCK that only a test crossing a month boundary can observe.
 * Reading the code shows the range is computed; it does not show that the
 * `taken` filter is right about months that already have payments recorded
 * against them — a period row that was PAID keeps its `periodStart`, and the
 * duplicate check keys on exactly that, so a partial payment is the case most
 * likely to break idempotence and the case a same-month rerun never produces.
 *
 * This suite is on the REAL database (PostgreSQL, `prisma.createMany` with
 * `skipDuplicates` and real `Decimal` columns), because the failure this guards
 * is a failure of the WRITE: two rows for one month is a schema-level fact that
 * a mock returning whatever the test told it to return cannot express.
 *
 * The clock is injected rather than faked: `generateRentPeriodsForLease` and
 * `generateRentPeriodsForAllLeases` both take `now`, and that is the same
 * parameter the cron passes `new Date()` into. Nothing in the chain below
 * monkey-patches Date, so what is exercised is the real code path with a
 * different value for that one argument.
 *
 * Skips (rather than fails) when DATABASE_URL is unset, like every other
 * `*.db.test.ts`.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Decimal from "decimal.js";

const DATABASE_URL = process.env.DATABASE_URL;
const describeDb = DATABASE_URL ? describe : describe.skip;

const SUFFIX = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const USER_ID = `rollover-owner-${SUFFIX}`;

/** A 970.55 EUR month: 850.50 rent + 120.05 charges. */
const RENT = "850.50";
const CHARGES = "120.05";
const TOTAL = new Decimal("970.55");

const MARCH = {
  start: new Date("2026-03-01T00:00:00.000Z"),
  end: new Date("2026-03-31T00:00:00.000Z"),
  due: new Date("2026-03-10T00:00:00.000Z"),
};
const APRIL = {
  start: new Date("2026-04-01T00:00:00.000Z"),
  end: new Date("2026-04-30T00:00:00.000Z"),
  due: new Date("2026-04-10T00:00:00.000Z"),
};

describeDb("a lease keeps producing months on its own", () => {
  let prisma: typeof import("@/lib/prisma").prisma;
  let generateForLease: typeof import("@/lib/domain/generate-rent-periods").generateRentPeriodsForLease;
  let generateForAll: typeof import("@/lib/domain/generate-rent-periods").generateRentPeriodsForAllLeases;
  let recordRentPayment: typeof import("@/lib/services/rent-payments").recordRentPayment;

  let propertyId = "";
  let tenantId = "";
  let leaseId = "";
  /** A second lease, `paymentDay: 31`, to pin the clamping across a short month. */
  let clampedLeaseId = "";

  /** Every transaction row on the lease, ordered by month. */
  const rows = () =>
    prisma.transaction.findMany({
      where: { leaseId },
      orderBy: [{ periodStart: "asc" }, { createdAt: "asc" }],
    });

  /**
   * How many OBLIGATION rows exist for one calendar month.
   *
   * Not the total row count: a month that took a partial payment legitimately
   * carries two rows (the open obligation plus the receipt beside it), so the
   * number that must never exceed one is the unpaid obligation, which is what
   * `createMany` writes and what a duplicate would produce.
   */
  const obligationsIn = (periodStart: Date) =>
    prisma.transaction.count({
      where: { leaseId, periodStart, paidAt: null, status: { not: "CANCELLED" } },
    });

  /** Every row for a month: obligations and receipts alike. */
  const rowsInMonth = (periodStart: Date) =>
    prisma.transaction.count({
      where: { leaseId, periodStart, status: { not: "CANCELLED" } },
    });

  /** The money actually received for a month (its receipts, not its obligation). */
  const receivedIn = async (periodStart: Date) => {
    const receipts = await prisma.transaction.findMany({
      where: { leaseId, periodStart, paidAt: { not: null }, status: { not: "CANCELLED" } },
      select: { amount: true },
    });
    return receipts
      .reduce((sum, r) => sum.plus(new Decimal(r.amount)), new Decimal(0))
      .toDecimalPlaces(2);
  };

  beforeAll(async () => {
    prisma = (await import("@/lib/prisma")).prisma;
    const generation = await import("@/lib/domain/generate-rent-periods");
    generateForLease = generation.generateRentPeriodsForLease;
    generateForAll = generation.generateRentPeriodsForAllLeases;
    ({ recordRentPayment } = await import("@/lib/services/rent-payments"));

    await prisma.user.create({
      data: {
        id: USER_ID,
        email: `rollover-${SUFFIX}@test.local`,
        name: "Landlord",
        firstName: "Land",
        lastName: "Lord",
        addressLine1: "1 rue du Mois",
        city: "Paris",
        postalCode: "75001",
      },
    });

    const property = await prisma.property.create({
      data: {
        userId: USER_ID,
        name: "Bien du Mois",
        type: "APARTMENT",
        addressLine1: "1 rue du Mois",
        city: "Paris",
        postalCode: "75001",
      },
    });
    propertyId = property.id;

    const tenant = await prisma.tenant.create({
      data: {
        userId: USER_ID,
        firstName: "Locataire",
        lastName: "Du Mois",
        email: `locataire-${SUFFIX}@test.local`,
        addressLine1: "2 rue du Mois",
        city: "Paris",
        postalCode: "75001",
      },
    });
    tenantId = tenant.id;

    // Starts mid-March: the first month is a partial one in real life and must
    // still be owed in full (proration is a business decision nobody has made,
    // and the period's job is to record what is owed).
    const lease = await prisma.lease.create({
      data: {
        userId: USER_ID,
        propertyId,
        tenantId,
        rentAmount: RENT,
        chargesAmount: CHARGES,
        depositAmount: RENT,
        startDate: new Date("2026-03-10T00:00:00.000Z"),
        paymentDay: 10,
        paymentMethod: "TRANSFER",
        leaseType: "UNFURNISHED",
        status: "ACTIVE",
      },
    });
    leaseId = lease.id;

    const clamped = await prisma.lease.create({
      data: {
        userId: USER_ID,
        propertyId,
        tenantId,
        rentAmount: "700.00",
        chargesAmount: "0.00",
        depositAmount: "700.00",
        startDate: new Date("2026-01-01T00:00:00.000Z"),
        paymentDay: 31,
        paymentMethod: "TRANSFER",
        leaseType: "UNFURNISHED",
        status: "ACTIVE",
      },
    });
    clampedLeaseId = clamped.id;
  });

  afterAll(async () => {
    if (!prisma) return;
    await prisma.transaction.deleteMany({ where: { userId: USER_ID } });
    await prisma.lease.deleteMany({ where: { userId: USER_ID } });
    await prisma.tenant.deleteMany({ where: { id: tenantId } });
    await prisma.property.deleteMany({ where: { id: propertyId } });
    await prisma.user.deleteMany({ where: { id: USER_ID } });
    await prisma.$disconnect();
  });

  it("materialises only the month that has begun when the lease is created", async () => {
    // The clock says "still March". A lease created on the 10th owes March and
    // nothing else: April has not started, and a landlord is not owed rent for a
    // month that has not arrived.
    const result = await generateForLease(
      leaseId,
      new Date("2026-03-20T09:00:00.000Z")
    );

    expect(result.created).toBe(1);
    expect(await rowsInMonth(MARCH.start)).toBe(1);

    const march = await prisma.transaction.findFirstOrThrow({
      where: { leaseId, periodStart: MARCH.start },
    });
    expect(march.amount.toFixed(2)).toBe(TOTAL.toFixed(2));
    expect(march.dueDate).toEqual(MARCH.due);
    expect(march.paidAt).toBeNull();
    expect(march.status).toBe("PENDING");
  });

  it("does not duplicate a month that already has a partial payment recorded", async () => {
    // The idempotence claim is weakest exactly here. March's period row has a
    // PARTIAL receipt sitting next to it, and the duplicate check keys on
    // `periodStart` — if it looked at "rows for this month" instead of "months
    // already materialised", this is where a second obligation would appear.
    const partial = await recordRentPayment({
      userId: USER_ID,
      leaseId,
      duePeriodId: (
        await prisma.transaction.findFirstOrThrow({
          where: { leaseId, periodStart: MARCH.start, paidAt: null },
          select: { id: true },
        })
      ).id,
      amount: "400.00",
      paidAt: new Date("2026-03-15T10:00:00.000Z"),
    });

    expect(partial.ok).toBe(true);
    if (!partial.ok) return;
    expect(partial.settled).toBe(false);
    expect((await receivedIn(MARCH.start)).toFixed(2)).toBe("400.00");

    // Re-running generation on the SAME day must add nothing.
    const again = await generateForLease(
      leaseId,
      new Date("2026-03-20T09:00:00.000Z")
    );

    expect(again.created).toBe(0);
    // One obligation (570.55 left) plus the 400 receipt beside it. A duplicate
    // would be a THIRD row, or a second obligation.
    expect(await obligationsIn(MARCH.start)).toBe(1);
    expect(await rowsInMonth(MARCH.start)).toBe(2);
  });

  it("adds the new month when the clock crosses into April, and leaves March alone", async () => {
    // This is the assertion the whole beta rests on. No cron fired, no page was
    // rendered: the only thing that changed is the value of `now`.
    const result = await generateForAll(
      USER_ID,
      new Date("2026-04-02T03:00:00.000Z")
    );

    // 1 for this lease's April, plus 4 for the clamped lease (January through
    // April: it started in January and only March had been generated so far).
    expect(result.created).toBe(5);
    expect(await obligationsIn(MARCH.start)).toBe(1);
    expect(await obligationsIn(APRIL.start)).toBe(1);

    const april = await prisma.transaction.findFirstOrThrow({
      where: { leaseId, periodStart: APRIL.start },
    });
    expect(april.dueDate).toEqual(APRIL.due);
    expect(april.amount.toFixed(2)).toBe(TOTAL.toFixed(2));
    expect(april.paidAt).toBeNull();

    // March is untouched: still exactly one row, still short 570.55.
    const marchStillOpen = await prisma.transaction.findFirstOrThrow({
      where: { leaseId, periodStart: MARCH.start, paidAt: null },
    });
    expect(marchStillOpen.amount.toFixed(2)).toBe("570.55");
    expect((await receivedIn(MARCH.start)).toFixed(2)).toBe("400.00");
  });

  it("running the whole-user generation twice on the same day creates nothing the second time", async () => {
    // The cron's own shape: it runs daily for every landlord, forever. If the
    // second run of the day were not a no-op, the dashboard would show a
    // landlord owing two months of rent for the month they live in.
    const first = await generateForAll(USER_ID, new Date("2026-04-02T04:00:00.000Z"));
    const second = await generateForAll(USER_ID, new Date("2026-04-02T04:00:00.000Z"));

    expect(first.created).toBe(0);
    expect(second.created).toBe(0);
    expect(await obligationsIn(MARCH.start)).toBe(1);
    expect(await obligationsIn(APRIL.start)).toBe(1);
    // This suite's two leases, one obligation each for April; nothing doubled by
    // the rerun. Scoped to the lease ids because other `*.db.test.ts` suites write
    // April rows for their own landlords in the same database.
    const aprilForThisLandlord = await prisma.transaction.count({
      where: { leaseId: { in: [leaseId, clampedLeaseId] }, periodStart: APRIL.start, paidAt: null },
    });
    expect(aprilForThisLandlord).toBe(2);
  });

  it("keeps chaining: May arrives on its own too", async () => {
    // Two crossings, not one: a fix that special-cased the first month after
    // creation would pass the April test and fail here.
    await generateForAll(USER_ID, new Date("2026-05-03T03:00:00.000Z"));

    const may = await prisma.transaction.findFirstOrThrow({
      where: { leaseId, periodStart: new Date("2026-05-01T00:00:00.000Z") },
    });
    expect(may.dueDate).toEqual(new Date("2026-05-10T00:00:00.000Z"));
    expect(may.amount.toFixed(2)).toBe(TOTAL.toFixed(2));

    // Every month still has exactly ONE obligation: March (partly paid), April
    // and May (open). Four rows for three months is the March receipt, not a
    // duplicate.
    expect(await obligationsIn(MARCH.start)).toBe(1);
    expect(await obligationsIn(APRIL.start)).toBe(1);
    expect(await obligationsIn(new Date("2026-05-01T00:00:00.000Z"))).toBe(1);
    expect((await rows()).length).toBe(4);
  });

  it("clamps paymentDay 31 to the length of a short month", async () => {
    // `paymentDay: 31` in February must be the 28th, not the 3rd of March: a
    // rent period whose due date rolls into the following month is collectable
    // for the wrong month, and the arrears query reads `dueDate`.
    const february = await prisma.transaction.findFirstOrThrow({
      where: {
        leaseId: clampedLeaseId,
        periodStart: new Date("2026-02-01T00:00:00.000Z"),
      },
    });

    expect(february.dueDate).toEqual(new Date("2026-02-28T00:00:00.000Z"));
    // And a 31-day month still gets the 31st, so the clamp is not a fixed 28.
    const january = await prisma.transaction.findFirstOrThrow({
      where: {
        leaseId: clampedLeaseId,
        periodStart: new Date("2026-01-01T00:00:00.000Z"),
      },
    });
    expect(january.dueDate).toEqual(new Date("2026-01-31T00:00:00.000Z"));
  });

  it("closes March for exactly the month's total when the balance is settled", async () => {
    // 400 already received on the 15th; the 570.55 remainder closes it. The sum
    // of the month's receipts must be the month's obligation to the cent — not
    // 400, not 570.55, not 1141.10.
    const openPeriod = await prisma.transaction.findFirstOrThrow({
      where: { leaseId, periodStart: MARCH.start, paidAt: null },
      select: { id: true, amount: true },
    });

    const result = await recordRentPayment({
      userId: USER_ID,
      leaseId,
      duePeriodId: openPeriod.id,
      amount: openPeriod.amount.toFixed(2),
      paidAt: new Date("2026-03-20T10:00:00.000Z"),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.settled).toBe(true);
    expect(result.amount).toBe("570.55");

    expect((await receivedIn(MARCH.start)).toFixed(2)).toBe(TOTAL.toFixed(2));
    // Closed: nothing left to collect for March, and the two receipts (400 on
    // the 15th, 570.55 on the 20th) are the month's whole history.
    expect(await obligationsIn(MARCH.start)).toBe(0);
    expect(await rowsInMonth(MARCH.start)).toBe(2);

    // And the frozen figures on the closing receipt are the ones the month owed,
    // not whatever the lease says later (AGENTS.md 14).
    const closing = await prisma.transaction.findUniqueOrThrow({
      where: { id: openPeriod.id },
    });
    expect(closing.receiptRentAmount?.toFixed(2)).toBe(RENT);
    expect(closing.receiptChargesAmount?.toFixed(2)).toBe(CHARGES);
  });

  it("leaves a month already closed alone when the next generation runs", async () => {
    // The end state: two months paid, one month open, and re-running generation
    // disturbs none of it. A generation that "refreshed" settled rows would
    // resurrect March as owed.
    await generateForAll(USER_ID, new Date("2026-05-03T23:00:00.000Z"));

    // March keeps its two receipts and stays closed; a generation that
    // "refreshed" settled rows would resurrect it as owed.
    const march = await prisma.transaction.findMany({ where: { leaseId, periodStart: MARCH.start } });
    expect(march).toHaveLength(2);
    expect(march.every((r) => r.paidAt !== null)).toBe(true);
    expect(await obligationsIn(MARCH.start)).toBe(0);
    expect((await receivedIn(MARCH.start)).toFixed(2)).toBe(TOTAL.toFixed(2));
  });
});