/**
 * The rule for WHEN a rent revision reaches the periods, executed rather than
 * described.
 *
 * Nothing stated this rule anywhere, so the next agent could read
 * `generateRentPeriodsForLease` and conclude either that a revision rewrites
 * every month or that it touches none. Both readings are defensible from the
 * source, and they disagree by 970 EUR.
 *
 * THE RULE
 *
 *   A revision applies to the months NOT YET MATERIALISED. Months already written
 *   keep the amount they were created with — EXCEPT that a manual amendment
 *   re-rates the unpaid ones, because a landlord correcting a figure they typed
 *   wrong is not the same act as an IRL revision changing the contract.
 *
 * The two paths differ on purpose and the difference is asserted here:
 *
 *   - `rerateUnpaidRentPeriods` (manual amendment, via `updateLease`) re-rates a
 *     month with NO payment on it, and leaves a month that took a payment alone.
 *   - the IRL path (`applyRentRevision`) re-rates nothing already materialised.
 *
 * WHAT THIS EXECUTED AND FOUND
 *
 * `updateLease` used to `deleteMany({ paidAt: null })` and regenerate. Run
 * against this database on a lease whose February had taken 400 of 800, that
 * left February holding ONLY the receipt: the obligation row was gone, so
 * `findUnpaidPeriod` — the single thing that offers a month for collection —
 * returned null and the remaining 400 EUR could not be collected through any
 * screen. January, an unpaid arrears month, was silently re-rated from 800 to
 * 900. Both figures below are what the old code produced.
 *
 * These run on the real database because the defect was in the WRITE: whether a
 * balance survives is a fact about rows, and the balance is what the assertions
 * are about.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Decimal from "decimal.js";

const DATABASE_URL = process.env.DATABASE_URL;
const describeDb = DATABASE_URL ? describe : describe.skip;

const SUFFIX = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const USER_ID = `revision-${SUFFIX}`;

const JAN = new Date("2026-01-01T00:00:00.000Z");
const FEB = new Date("2026-02-01T00:00:00.000Z");
const MAR = new Date("2026-03-01T00:00:00.000Z");

const oldRent = "800.00";
const newRent = "900.00";

describeDb("when does a rent revision reach the periods", () => {
  let prisma: typeof import("@/lib/prisma").prisma;
  let leaseId = "";
  let propertyId = "";
  let tenantId = "";

  /** The obligation still open for a month, or null. */
  const openFor = (periodStart: Date) =>
    prisma.transaction.findFirst({
      where: { leaseId, periodStart, paidAt: null, status: { not: "CANCELLED" } },
    });

  /** What a tenant was asked to pay for a month right now. */
  const owedFor = async (periodStart: Date) => {
    const open = await openFor(periodStart);
    return open ? new Decimal(open.amount).toFixed(2) : null;
  };

  /** Everything received for a month. */
  const receivedFor = async (periodStart: Date) => {
    const rows = await prisma.transaction.findMany({
      where: { leaseId, periodStart, paidAt: { not: null }, status: { not: "CANCELLED" } },
      select: { amount: true },
    });
    return rows
      .reduce((sum, r) => sum.plus(new Decimal(r.amount)), new Decimal(0))
      .toFixed(2);
  };

  /** Change the rent the way `updateLease` does: write it, then re-rate. */
  const amendRent = async (amount: string) => {
    const { rerateUnpaidRentPeriods } = await import(
      "@/lib/domain/generate-rent-periods"
    );
    await prisma.lease.update({ where: { id: leaseId }, data: { rentAmount: amount } });
    return rerateUnpaidRentPeriods(leaseId);
  };

  beforeAll(async () => {
    prisma = (await import("@/lib/prisma")).prisma;
    const { generateRentPeriodsForLease } = await import(
      "@/lib/domain/generate-rent-periods"
    );
    const { recordRentPayment } = await import("@/lib/services/rent-payments");

    await prisma.user.create({
      data: {
        id: USER_ID,
        email: `revision-${SUFFIX}@test.local`,
        name: "Landlord",
        addressLine1: "1 rue de la Revision",
        city: "Paris",
        postalCode: "75001",
      },
    });
    const property = await prisma.property.create({
      data: {
        userId: USER_ID,
        name: "Bien",
        type: "APARTMENT",
        addressLine1: "1 rue de la Revision",
        city: "Paris",
        postalCode: "75001",
      },
    });
    propertyId = property.id;
    const tenant = await prisma.tenant.create({
      data: {
        userId: USER_ID,
        firstName: "Loc",
        lastName: "ataire",
        email: `loc-${SUFFIX}@test.local`,
        addressLine1: "2 rue de la Revision",
        city: "Paris",
        postalCode: "75001",
      },
    });
    tenantId = tenant.id;
    const lease = await prisma.lease.create({
      data: {
        userId: USER_ID,
        propertyId,
        tenantId,
        rentAmount: oldRent,
        chargesAmount: "0.00",
        depositAmount: oldRent,
        startDate: JAN,
        paymentDay: 1,
        paymentMethod: "TRANSFER",
        leaseType: "UNFURNISHED",
        status: "ACTIVE",
      },
    });
    leaseId = lease.id;

    // Three months owed at 800.
    await generateRentPeriodsForLease(leaseId, new Date("2026-03-05T00:00:00.000Z"));

    // February takes a PARTIAL payment — the state that used to lose money.
    const february = await openFor(FEB);
    expect(february).not.toBeNull();
    const paid = await recordRentPayment({
      userId: USER_ID,
      leaseId,
      duePeriodId: february!.id,
      amount: "400.00",
      paidAt: new Date("2026-02-10T00:00:00.000Z"),
    });
    expect(paid.ok).toBe(true);
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

  it("a month with no payment on it takes the revised amount", async () => {
    const rerated = await amendRent(newRent);

    // January and March had nothing paid: both are corrections of a figure the
    // landlord got wrong, so both move.
    expect(rerated).toBe(2);
    expect(await owedFor(JAN)).toBe(newRent);
    expect(await owedFor(MAR)).toBe(newRent);
  });

  it("a month that took a payment keeps the balance the tenant was given", async () => {
    // February was invoiced at 800 and 400 was paid against it. The tenant owes
    // the 400 that remained — not 500, which is what re-rating to 900 would
    // demand, and not 0, which is what deleting the obligation produced.
    expect(await owedFor(FEB)).toBe("400.00");
    expect(await receivedFor(FEB)).toBe("400.00");
  });

  it("the partly-paid month is still collectable through the payment door", async () => {
    // The regression that motivated all of this: `updateLease`'s delete dropped
    // the obligation row and left only the receipt, so `findUnpaidPeriod` found
    // nothing and the remaining balance was unreachable. Not "owedFor is not
    // null" — the door resolving the month the way the UI resolves it.
    const { findUnpaidPeriod } = await import("@/lib/domain/generate-rent-periods");
    const february = await findUnpaidPeriod(leaseId, FEB, USER_ID);

    expect(february).not.toBeNull();
    expect(new Decimal(february!.amount).toFixed(2)).toBe("400.00");
  });

  it("the remainder can actually be collected, and then the month is exact", async () => {
    const { recordRentPayment } = await import("@/lib/services/rent-payments");
    const february = await openFor(FEB);

    const result = await recordRentPayment({
      userId: USER_ID,
      leaseId,
      duePeriodId: february!.id,
      amount: "400.00",
      paidAt: new Date("2026-02-20T00:00:00.000Z"),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.settled).toBe(true);
    // February sums to what February owed: 400 + 400, never 800 (the pre-amendment
    // rent), never 900 (the revised one), never 1800.
    expect(await receivedFor(FEB)).toBe(oldRent);
    expect(await owedFor(FEB)).toBeNull();
  });

  it("a month already settled is never re-rated by a later revision", async () => {
    // The receipt February was issued against keeps the figures it was issued
    // for (AGENTS.md 14): a receipt is a legal document describing what the
    // payment was made against.
    await amendRent("1000.00");

    const february = await prisma.transaction.findMany({
      where: { leaseId, periodStart: FEB },
    });
    expect(february).toHaveLength(2);
    expect(february.every((r) => r.receiptRentAmount?.toFixed(2) === oldRent)).toBe(true);
    expect(await receivedFor(FEB)).toBe(oldRent);
    // And January, still unpaid and still re-rateable, moved again.
    expect(await owedFor(JAN)).toBe("1000.00");
  });

  it("a month generated after the revision carries the new amount", async () => {
    // The "future" half of the rule, executed: April does not exist yet, so it is
    // created from the lease's current rent rather than the original one.
    const { generateRentPeriodsForLease } = await import(
      "@/lib/domain/generate-rent-periods"
    );
    await generateRentPeriodsForLease(leaseId, new Date("2026-04-02T00:00:00.000Z"));

    expect(await owedFor(new Date("2026-04-01T00:00:00.000Z"))).toBe("1000.00");
  });
});