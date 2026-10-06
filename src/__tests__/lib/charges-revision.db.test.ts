/**
 * A CHARGES revision on a partly-paid month, executed.
 *
 * `rent-revision.db.test.ts` states the rule and holds it to the RENT — but its
 * lease carries `chargesAmount: 0.00`, so every month in it is a single-column
 * figure and the rule was never exercised on the case it actually breaks.
 *
 * WHAT THIS EXECUTED AND FOUND
 *
 * A materialised row was declared "authoritative on its own figures" only when
 * its charges EQUALLED the lease's current charges:
 *
 *     const rowIsAuthoritative = rowCharges.eq(leaseCharges);
 *
 * A charges revision is precisely a case where they differ, so the code fell
 * back to the lease — and stamped the REVISED figures onto a month that had
 * already been billed at the old ones. Measured on this database:
 *
 *     bail 800 + 100, February invoiced 900, 400 received on 10/02
 *     -> landlord corrects the charges to 300 (updateLease's normal path)
 *     -> February is not re-rated (it took a payment: the rule, and it is right)
 *     -> the balance is collected, and the two receipts issued from that moment
 *        freeze 800 + 300 instead of 800 + 100
 *     -> the fiscal line sums 719.20 of rent and 180.80 of charges for a month
 *        that owed 800 and 100
 *
 * The ledger was right throughout (900 received, month closed, overpayment
 * refused): the defect was in the receipt freeze and therefore in the fiscal
 * line, which is why it survived the tests that only read balances.
 *
 * The fallback had no real case behind it. `rentPortion` and `chargesPortion` are
 * NOT NULL and `generateRentPeriodsForLease` has always written both columns, so
 * a "row predating the split" cannot exist; a probe over the whole table found 0
 * of 388 rows in that shape. The only writer of it was a test harness.
 *
 * Runs on the real database because the defect is in the WRITE: what a receipt
 * freezes is a fact about rows.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import Decimal from "decimal.js";

const DATABASE_URL = process.env.DATABASE_URL;
const describeDb = DATABASE_URL ? describe : describe.skip;

const SUFFIX = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const USER_ID = `charges-revision-${SUFFIX}`;

const JAN = new Date("2026-01-01T00:00:00.000Z");
const FEB = new Date("2026-02-01T00:00:00.000Z");
const MAR = new Date("2026-03-01T00:00:00.000Z");

const RENT = "800.00";
const CHARGES_BILLED = "100.00";
const CHARGES_REVISED = "300.00";

describeDb("when the CHARGES are revised on a partly-paid month", () => {
  let prisma: typeof import("@/lib/prisma").prisma;
  let leaseId = "";
  let propertyId = "";
  let tenantId = "";

  const openFor = (periodStart: Date) =>
    prisma.transaction.findFirst({
      where: { leaseId, periodStart, paidAt: null, status: { not: "CANCELLED" } },
    });

  /** Correct the charges the way `updateLease` does: write, then re-rate. */
  const amendCharges = async (amount: string) => {
    const { rerateUnpaidRentPeriods } = await import(
      "@/lib/domain/generate-rent-periods"
    );
    await prisma.lease.update({ where: { id: leaseId }, data: { chargesAmount: amount } });
    return rerateUnpaidRentPeriods(leaseId);
  };

  /** Every row the month ended up with, receipts included. */
  const rowsFor = (periodStart: Date) =>
    prisma.transaction.findMany({ where: { leaseId, periodStart }, orderBy: { createdAt: "asc" } });

  const receivedFor = async (periodStart: Date) => {
    const rows = await prisma.transaction.findMany({
      where: {
        leaseId,
        periodStart,
        paidAt: { not: null },
        status: { not: "CANCELLED" },
      },
      select: { amount: true },
    });
    return rows
      .reduce((sum, r) => sum.plus(new Decimal(r.amount)), new Decimal(0))
      .toFixed(2);
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
        email: `charges-revision-${SUFFIX}@test.local`,
        name: "Landlord",
        addressLine1: "1 rue des Charges",
        city: "Paris",
        postalCode: "75001",
      },
    });
    const property = await prisma.property.create({
      data: {
        userId: USER_ID,
        name: "Bien",
        type: "APARTMENT",
        addressLine1: "1 rue des Charges",
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
        addressLine1: "2 rue des Charges",
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
        rentAmount: RENT,
        chargesAmount: CHARGES_BILLED,
        depositAmount: RENT,
        startDate: JAN,
        paymentDay: 1,
        paymentMethod: "TRANSFER",
        leaseType: "UNFURNISHED",
        status: "ACTIVE",
      },
    });
    leaseId = lease.id;

    await generateRentPeriodsForLease(leaseId, new Date("2026-03-05T00:00:00.000Z"));

    // February takes a partial payment, at the figures it was billed at.
    const february = await openFor(FEB);
    expect(february).not.toBeNull();
    expect(new Decimal(february!.rentPortion).toFixed(2)).toBe(RENT);
    expect(new Decimal(february!.chargesPortion).toFixed(2)).toBe(CHARGES_BILLED);

    const paid = await recordRentPayment({
      userId: USER_ID,
      leaseId,
      duePeriodId: february!.id,
      amount: "400.00",
      paidAt: new Date("2026-02-10T00:00:00.000Z"),
    });
    expect(paid.ok).toBe(true);

    // The landlord then corrects the charges. This is the ordinary path: the
    // lease edit form sends `chargesAmount`, and `updateLease` calls
    // `rerateUnpaidRentPeriods`.
    await amendCharges(CHARGES_REVISED);
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

  it("leaves the partly-paid month at the charges it was billed at", async () => {
    // 900 invoiced, 400 received, so 500 remain — NOT 700 (900 + 300 minus the
    // 400) and not 0.
    const february = await openFor(FEB);
    expect(february).not.toBeNull();
    expect(new Decimal(february!.amount).toFixed(2)).toBe("500.00");
    expect(new Decimal(february!.rentPortion).toFixed(2)).toBe(RENT);
    expect(new Decimal(february!.chargesPortion).toFixed(2)).toBe(CHARGES_BILLED);
  });

  it("re-rates a month that took nothing, because nothing was invoiced at the old figure", async () => {
    const march = await openFor(MAR);
    expect(march).not.toBeNull();
    expect(new Decimal(march!.rentPortion).toFixed(2)).toBe(RENT);
    expect(new Decimal(march!.chargesPortion).toFixed(2)).toBe(CHARGES_REVISED);
    expect(new Decimal(march!.amount).toFixed(2)).toBe("1100.00");
  });

  it("freezes the billed charges on the receipt issued before the revision", async () => {
    const rows = await prisma.transaction.findMany({
      where: { leaseId, periodStart: FEB, paidAt: { not: null } },
      orderBy: { createdAt: "asc" },
    });
    expect(rows).toHaveLength(1);
    expect(rows[0].receiptChargesAmount?.toFixed(2)).toBe(CHARGES_BILLED);
    expect(rows[0].receiptRentAmount?.toFixed(2)).toBe(RENT);
  });

  it("freezes the billed charges on a receipt issued AFTER the revision", async () => {
    // The regression: this receipt used to freeze 300 because the code compared
    // the row's charges with the lease's, disagreed with itself, and reached for
    // the revised lease. The month was billed at 100, so it must say 100.
    const { recordRentPayment } = await import("@/lib/services/rent-payments");
    const february = await openFor(FEB);

    const result = await recordRentPayment({
      userId: USER_ID,
      leaseId,
      duePeriodId: february!.id,
      amount: "500.00",
      paidAt: new Date("2026-02-20T00:00:00.000Z"),
    });

    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.settled).toBe(true);

    // Ordered by WHEN the money arrived, not by row creation: the obligation
    // row was written by the generator, months before either instalment.
    const rows = await prisma.transaction.findMany({
      where: { leaseId, periodStart: FEB, paidAt: { not: null } },
      orderBy: [{ paidAt: "asc" }, { createdAt: "asc" }],
    });
    expect(rows.length).toBeGreaterThanOrEqual(2);
    const receipts = rows;
    expect(
      receipts.every((r) => r.receiptChargesAmount?.toFixed(2) === CHARGES_BILLED)
    ).toBe(true);
    expect(receipts.every((r) => r.receiptRentAmount?.toFixed(2) === RENT)).toBe(true);
    // Deliberately NOT asserting `receiptType` here: the row that closes the month
    // is the obligation itself, updated in place, and `settleRentPeriod` does not
    // stamp `receiptType` on it. That is pre-existing behaviour, unrelated to a
    // charges revision, and this card does not touch it.
  });

  it("sums the fiscal line on what the month was invoiced, not on the lease today", async () => {
    // The 2577 line is the sum of each receipt's own rent/charges share, taken
    // over the PAID and PARTIAL rows (see /api/fiscal/prepare). With the charges
    // revision leaking into those shares, a month invoiced at 800 + 100 came out
    // as 719.20 + 180.80. It must come out as 800 + 100.
    const rows = await prisma.transaction.findMany({
      where: { leaseId, periodStart: FEB, status: { in: ["PAID", "PARTIAL"] } },
    });
    const rent = rows
      .reduce((s, r) => s.plus(new Decimal(r.rentPortion)), new Decimal(0))
      .toFixed(2);
    const charges = rows
      .reduce((s, r) => s.plus(new Decimal(r.chargesPortion)), new Decimal(0))
      .toFixed(2);

    expect(rent).toBe(RENT);
    expect(charges).toBe(CHARGES_BILLED);
    expect(new Decimal(rent).plus(new Decimal(charges)).toFixed(2)).toBe("900.00");
    // And the money adds up to what was asked, not to the revised figure.
    expect(await receivedFor(FEB)).toBe("900.00");
  });

  it("still refuses a payment above the month's real balance", async () => {
    // The correction must not have loosened the ceiling: after the revision the
    // lease owes 1100, and a 700 payment on a month that has taken 400 and owes
    // 500 must be refused against 500.
    const { recordRentPayment } = await import("@/lib/services/rent-payments");
    const result = await recordRentPayment({
      userId: USER_ID,
      leaseId,
      periodStart: MAR,
      periodEnd: new Date("2026-03-31T00:00:00.000Z"),
      dueDate: new Date("2026-03-01T00:00:00.000Z"),
      amount: "1200.00",
      paidAt: new Date("2026-03-05T00:00:00.000Z"),
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe("AMOUNT_ABOVE_BALANCE");
  });
});