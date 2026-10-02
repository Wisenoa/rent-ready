/**
 * The database must refuse to owe the same month twice.
 *
 * `generateRentPeriodsForLease` claimed idempotence through two mechanisms, and
 * NEITHER of them was one:
 *
 *   - a JavaScript `taken` set of the `periodStart`s already written, read then
 *     written with nothing between them;
 *   - `createMany({ skipDuplicates: true })`.
 *
 * `skipDuplicates` compiles to `ON CONFLICT DO NOTHING`, which only skips rows
 * violating a UNIQUE or PRIMARY KEY constraint. "Transaction" had NO index at
 * all on (leaseId, periodStart) — the closest was the receipt-number index — so
 * the clause had nothing to act on and silently reported success while writing
 * the duplicate. Verified against this database before the fix: `createMany`
 * returned `{ count: 1 }` and the month existed twice, and three months in the
 * dev database carried a duplicate pair written six milliseconds apart.
 *
 * The read-then-write window is real too: the 03:00 cron and the page-render
 * backstop (`ensureRentPeriods`) both fire just after midnight on the 1st, which
 * is exactly when the new month is missing from both reads.
 *
 * The consequence is a month INVOICED TWICE. The arrears figure doubles, and the
 * payment door settles one of the two rows, leaving the other collectable
 * forever with no money and no way to close it.
 *
 * So the guarantee now lives in a partial UNIQUE index
 * (`Transaction_leaseId_periodStart_unpaid_key`, migration
 * 20261005120000) covering unpaid, uncancelled rows. Partial rather than full
 * because a month legitimately holds several rows: the open obligation plus one
 * receipt per partial payment, all sharing (leaseId, periodStart). A full unique
 * index would reject the second instalment of a partial payment.
 *
 * These tests execute the constraint rather than reading the schema, because the
 * claim is about what PostgreSQL does when a duplicate is ATTEMPTED — and the
 * previous state of this code is the proof that reading the schema is not
 * enough: `skipDuplicates: true` was in the source the whole time and enforced
 * nothing.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";

const DATABASE_URL = process.env.DATABASE_URL;
const describeDb = DATABASE_URL ? describe : describe.skip;

const SUFFIX = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const USER_ID = `obligation-${SUFFIX}`;

describeDb("one obligation per month, enforced by the database", () => {
  let prisma: typeof import("@/lib/prisma").prisma;
  let leaseId = "";
  let propertyId = "";
  let tenantId = "";

  /** The row generation writes for a month. */
  const obligation = (periodStart: Date) => ({
    userId: USER_ID,
    leaseId,
    amount: 850,
    rentPortion: 850,
    chargesPortion: 0,
    periodStart,
    periodEnd: new Date(
      Date.UTC(periodStart.getUTCFullYear(), periodStart.getUTCMonth() + 1, 0)
    ),
    dueDate: new Date(
      Date.UTC(periodStart.getUTCFullYear(), periodStart.getUTCMonth(), 1)
    ),
    status: "PENDING" as const,
    isFullPayment: false,
    paidAt: null,
  });

  const unpaidForMonth = (periodStart: Date) =>
    prisma.transaction.count({
      where: { leaseId, periodStart, paidAt: null, status: { not: "CANCELLED" } },
    });

  beforeAll(async () => {
    prisma = (await import("@/lib/prisma")).prisma;
    await prisma.user.create({
      data: {
        id: USER_ID,
        email: `obligation-${SUFFIX}@test.local`,
        name: "Landlord",
        addressLine1: "1 rue de l'Obligation",
        city: "Paris",
        postalCode: "75001",
      },
    });
    const property = await prisma.property.create({
      data: {
        userId: USER_ID,
        name: "Bien",
        type: "APARTMENT",
        addressLine1: "1 rue de l'Obligation",
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
        addressLine1: "2 rue de l'Obligation",
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
        rentAmount: "850.00",
        chargesAmount: "0.00",
        depositAmount: "850.00",
        startDate: new Date("2026-07-01T00:00:00.000Z"),
        paymentDay: 1,
        paymentMethod: "TRANSFER",
        leaseType: "UNFURNISHED",
        status: "ACTIVE",
      },
    });
    leaseId = lease.id;
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

  it("createMany silently wrote a second obligation before the index existed", async () => {
    // The regression, stated as the behaviour it used to have: `skipDuplicates`
    // reported success and the month was written twice. It no longer is, so the
    // assertion is that the duplicate did NOT land.
    const july = new Date("2026-07-01T00:00:00.000Z");
    await prisma.transaction.create({ data: obligation(july) });

    // The exact call generation makes, with the flag it always carried.
    const result = await prisma.transaction.createMany({
      data: [obligation(july)],
      skipDuplicates: true,
    });

    expect(await unpaidForMonth(july)).toBe(1);
    // `ON CONFLICT DO NOTHING` against a real constraint reports 0 inserted. If
    // this ever goes back to 1, the index is gone and this file is lying.
    expect(result.count).toBe(0);
  });

  it("refuses a direct duplicate write, which is the case the index exists for", async () => {
    const august = new Date("2026-08-01T00:00:00.000Z");
    await prisma.transaction.create({ data: obligation(august) });

    await expect(
      prisma.transaction.create({ data: obligation(august) })
    ).rejects.toThrow();

    expect(await unpaidForMonth(august)).toBe(1);
  });

  it("still allows the sibling receipts a partial payment creates", async () => {
    // The reason the index is PARTIAL. A month paid in instalments holds the
    // open obligation plus one row per receipt, all sharing (leaseId,
    // periodStart). A full unique index would make the second instalment of a
    // partial payment — the most ordinary thing a tenant does — impossible.
    const september = new Date("2026-09-01T00:00:00.000Z");
    await prisma.transaction.create({ data: obligation(september) });

    await prisma.transaction.create({
      data: {
        ...obligation(september),
        amount: 400,
        paidAt: new Date("2026-09-15T00:00:00.000Z"),
        status: "PARTIAL",
        receiptRentAmount: 850,
        receiptChargesAmount: 0,
      },
    });

    const rows = await prisma.transaction.findMany({
      where: { leaseId, periodStart: september },
    });
    expect(rows).toHaveLength(2);
    // Still one obligation: the partial receipt is not a second one.
    expect(await unpaidForMonth(september)).toBe(1);
  });

  it("lets a cancelled receipt free the month's obligation slot", async () => {
    // Cancelling money that went back keeps the row for the audit trail but
    // takes it out of the settlement. If the index did not exclude CANCELLED, a
    // cancelled row would keep occupying the month's slot and the month could
    // never be re-materialised after a full cancellation.
    const october = new Date("2026-10-01T00:00:00.000Z");
    const row = await prisma.transaction.create({ data: obligation(october) });

    await prisma.transaction.update({
      where: { id: row.id },
      data: { status: "CANCELLED", paidAt: new Date("2026-10-02T00:00:00.000Z") },
    });
    expect(await unpaidForMonth(october)).toBe(0);

    // The month is collectable again.
    await prisma.transaction.create({ data: obligation(october) });
    expect(await unpaidForMonth(october)).toBe(1);
  });
});