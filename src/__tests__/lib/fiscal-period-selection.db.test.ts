/**
 * A 2577 line is selected by DECLARATION PERIOD, not by current lease status.
 *
 * WHAT THIS EXECUTED AND FOUND
 *
 * `generateRentPeriodsForAllLeases` now closes a lease whose term has run out
 * (see `lease-expiry.db.test.ts`) — the right thing to do, and it armed a clause
 * that had been inert since the schema was written. Both 2577 consumers read:
 *
 *     leases: { where: { status: "ACTIVE" } }
 *
 * Nothing ever wrote `EXPIRED`, so the clause could not exclude anything and
 * read as harmless. Giving it a producer turned it into an under-declaration:
 * a lease covering 2025 and ending 31/12/2025 is dropped from the 2025
 * declaration as soon as the January cron closes it, and its collected rent
 * declares as zero. Measured on this database before the fix — six 800 EUR
 * payments received in 2025, one cron run on 05/01/2026, and the 2577 line read
 * 0.00 against 4 800.00 actually collected. Under-declaring income is the worst
 * direction for a tax figure to be wrong in.
 *
 * The same request had a second defect of the same kind, with no expiry
 * involved: `const activeLease = property.leases[0]` summed the FIRST lease of a
 * property. A property re-let mid-year carries two leases over the same twelve
 * months and the second was silently absent from the declaration.
 *
 * THE RULE, NOW WRITTEN DOWN
 *
 * A declared year takes every lease whose TERM OVERLAPS it — started before the
 * year closed and not finished before it opened — whatever the status is today,
 * and sums all of them. The lease status answers "is it rented now", which is
 * not what a declaration asks.
 *
 * Runs on the real database, through the real route handler: the defect is in
 * the SELECT, and a mocked prisma would only re-assert the predicate the test
 * already knows.
 */

import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import Decimal from "decimal.js";

const DATABASE_URL = process.env.DATABASE_URL;
const describeDb = DATABASE_URL ? describe : describe.skip;
if (!DATABASE_URL) {
  console.warn(
    "[fiscal-period-selection.db.test] SKIPPED: DATABASE_URL is unset. The 2577 " +
      "line is NOT covered by this run — copy .env, or export DATABASE_URL."
  );
}

const SUFFIX = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const LANDLORD = `fiscal-landlord-${SUFFIX}`;
const OTHER = `fiscal-other-${SUFFIX}`;

vi.mock("@/lib/auth", () => ({
  getAuthenticatedUserId: async () => globalThis.__rrFiscalUserId,
}));

declare global {
  // eslint-disable-next-line no-var
  var __rrFiscalUserId: string;
}
globalThis.__rrFiscalUserId = LANDLORD;

const YEAR = 2025;

describeDb("the 2577 line selects by declaration period, not by lease status", () => {
  let prisma: typeof import("@/lib/prisma").prisma;
  let prepareGET: typeof import("@/app/api/fiscal/prepare/route").GET;
  let NextRequest: typeof import("next/server").NextRequest;
  let generateForAll: typeof import("@/lib/domain/generate-rent-periods").generateRentPeriodsForAllLeases;
  /** Ended 31/12/2025 and closed by the cron: must still declare 2025. */
  let expiredLeaseId = "";
  /** Re-let mid-year on the same property: BOTH must be summed. */
  let reletFirstLeaseId = "";
  let reletSecondLeaseId = "";
  /** Belongs to another landlord: must never appear. */
  let otherLeaseId = "";

  const RENT = "800.00";
  const CHARGES = "100.00";

  /**
   * One PAID month for a lease, written the way the ledger writes it: the
   * receipt row is what carries the figures the 2577 sums.
   */
  const payMonth = async (
    userId: string,
    leaseId: string,
    periodStart: string,
    paidAt: string
  ) => {
    const start = new Date(periodStart);
    await prisma.transaction.create({
      data: {
        userId,
        leaseId,
        amount: new Decimal(RENT).plus(CHARGES).toFixed(2),
        rentPortion: RENT,
        chargesPortion: CHARGES,
        periodStart: start,
        periodEnd: new Date(start.getFullYear(), start.getMonth() + 1, 0),
        dueDate: start,
        status: "PAID",
        paidAt: new Date(paidAt),
        receiptRentAmount: RENT,
        receiptChargesAmount: CHARGES,
      },
    });
  };

  /** The route's answer for one property, as the landlord would receive it. */
  const prepare = async (year: number) => {
    const response = await prepareGET(
      new NextRequest(`http://localhost/api/fiscal/prepare?year=${year}`)
    );
    expect(response.status).toBe(200);
    return (await response.json()) as {
      summary: { globalTotalRent: number };
      properties: Array<{
        propertyId: string;
        leases: Array<{ id: string; status: string }>;
        totalRentReceived: number;
        totalChargesReceived: number;
        occupancyMonths: number;
        transactionDetails: Array<{ leaseId: string; rentPortion: number }>;
      }>;
    };
  };

  const reportFor = (
    body: Awaited<ReturnType<typeof prepare>>,
    propertyId: string
  ) => {
    const report = body.properties.find((p) => p.propertyId === propertyId);
    expect(report).toBeDefined();
    return report!;
  };

  beforeAll(async () => {
    prisma = (await import("@/lib/prisma")).prisma;
    ({ NextRequest } = await import("next/server"));
    prepareGET = (await import("@/app/api/fiscal/prepare/route")).GET;
    ({
      generateRentPeriodsForAllLeases: generateForAll,
    } = await import("@/lib/domain/generate-rent-periods"));

    await prisma.user.createMany({
      data: [
        {
          id: LANDLORD,
          email: `fiscal-${SUFFIX}@test.local`,
          name: "Landlord",
          addressLine1: "1 rue Fiscale",
          city: "Paris",
          postalCode: "75001",
        },
        {
          id: OTHER,
          email: `fiscal-other-${SUFFIX}@test.local`,
          name: "Other",
          addressLine1: "2 rue Fiscale",
          city: "Lyon",
          postalCode: "69001",
        },
      ],
    });

    const mkProperty = (userId: string, name: string) =>
      prisma.property.create({
        data: {
          userId,
          name,
          type: "APARTMENT",
          addressLine1: "3 rue du Bien",
          city: "Paris",
          postalCode: "75001",
        },
      });

    const mkTenant = (userId: string, label: string) =>
      prisma.tenant.create({
        data: {
          userId,
          firstName: "Loc",
          lastName: label,
          email: `loc-${label}-${SUFFIX}@test.local`,
          addressLine1: "4 rue du Locataire",
          city: "Paris",
          postalCode: "75001",
        },
      });

    const mkLease = async (data: {
      userId: string;
      propertyId: string;
      tenantId: string;
      startDate: string;
      endDate?: string;
      status?: "ACTIVE" | "TERMINATED" | "EXPIRED";
    }) =>
      prisma.lease.create({
        data: {
          userId: data.userId,
          propertyId: data.propertyId,
          tenantId: data.tenantId,
          rentAmount: RENT,
          chargesAmount: CHARGES,
          depositAmount: "0.00",
          paymentDay: 1,
          paymentMethod: "TRANSFER",
          leaseType: "UNFURNISHED",
          status: data.status ?? "ACTIVE",
          startDate: new Date(data.startDate),
          endDate: data.endDate ? new Date(data.endDate) : null,
        },
      });

    // ── Property 1: one lease that covered the whole of 2025 and then ended.
    const endedProperty = await mkProperty(LANDLORD, "Bien echu");
    expiredLeaseId = (
      await mkLease({
        userId: LANDLORD,
        propertyId: endedProperty.id,
        tenantId: (await mkTenant(LANDLORD, "Ancien")).id,
        startDate: "2025-01-01T00:00:00.000Z",
        endDate: "2025-12-31T00:00:00.000Z",
      })
    ).id;

    // Six months of 2025 collected. January..June, deliberately paid on time.
    for (const month of [1, 2, 3, 4, 5, 6]) {
      const mm = String(month).padStart(2, "0");
      await payMonth(
        LANDLORD,
        expiredLeaseId,
        `2025-${mm}-01T00:00:00.000Z`,
        `2025-${mm}-03T00:00:00.000Z`
      );
    }

    // ── Property 2: re-let mid-year. Two leases over the same twelve months.
    const reletProperty = await mkProperty(LANDLORD, "Bien relance");
    reletFirstLeaseId = (
      await mkLease({
        userId: LANDLORD,
        propertyId: reletProperty.id,
        tenantId: (await mkTenant(LANDLORD, "Premier")).id,
        startDate: "2025-01-01T00:00:00.000Z",
        endDate: "2025-06-30T00:00:00.000Z",
      })
    ).id;
    reletSecondLeaseId = (
      await mkLease({
        userId: LANDLORD,
        propertyId: reletProperty.id,
        tenantId: (await mkTenant(LANDLORD, "Second")).id,
        startDate: "2025-07-01T00:00:00.000Z",
        endDate: "2025-12-31T00:00:00.000Z",
      })
    ).id;
    await payMonth(LANDLORD, reletFirstLeaseId, "2025-02-01T00:00:00.000Z", "2025-02-03T00:00:00.000Z");
    await payMonth(LANDLORD, reletSecondLeaseId, "2025-09-01T00:00:00.000Z", "2025-09-03T00:00:00.000Z");

    // ── Another landlord's property, to keep the isolation honest.
    const otherProperty = await mkProperty(OTHER, "Bien du voisin");
    otherLeaseId = (
      await mkLease({
        userId: OTHER,
        propertyId: otherProperty.id,
        tenantId: (await mkTenant(OTHER, "Voisin")).id,
        startDate: "2025-01-01T00:00:00.000Z",
      })
    ).id;
    await payMonth(OTHER, otherLeaseId, "2025-03-01T00:00:00.000Z", "2025-03-03T00:00:00.000Z");

    // ── The event under test: the nightly job closes the lease that ended.
    // "now" is January 2026, so the 31/12/2025 term is over.
    const result = await generateForAll(
      LANDLORD,
      new Date("2026-01-05T03:00:00.000Z")
    );
    expect(result.expired).toBeGreaterThanOrEqual(1);

    const closed = await prisma.lease.findUniqueOrThrow({
      where: { id: expiredLeaseId },
      select: { status: true },
    });
    // The precondition, stated: the lease really did leave ACTIVE.
    expect(closed.status).toBe("EXPIRED");
  });

  afterAll(async () => {
    if (!prisma) return;
    await prisma.transaction.deleteMany({ where: { userId: { in: [LANDLORD, OTHER] } } });
    await prisma.lease.deleteMany({ where: { userId: { in: [LANDLORD, OTHER] } } });
    await prisma.tenant.deleteMany({ where: { userId: { in: [LANDLORD, OTHER] } } });
    await prisma.property.deleteMany({ where: { userId: { in: [LANDLORD, OTHER] } } });
    await prisma.user.deleteMany({ where: { id: { in: [LANDLORD, OTHER] } } });
    await prisma.$disconnect();
  });

  it("declares the rent of a lease the cron has already closed", async () => {
    // The regression. 4 800 collected in 2025 declared as 0.
    const body = await prepare(YEAR);
    const ended = body.properties.find((p) =>
      p.leases.some((l) => l.id === expiredLeaseId)
    );

    expect(ended).toBeDefined();
    expect(ended!.leases[0].status).toBe("EXPIRED");
    expect(ended!.totalRentReceived).toBe(4800);
    expect(ended!.totalChargesReceived).toBe(600);
    expect(ended!.transactionDetails).toHaveLength(6);
  });

  it("sums both leases of a property that was re-let during the year", async () => {
    // The `leases[0]` defect: only the first lease was declared, so the
    // September rent was missing from a year that collected it.
    const body = await prepare(YEAR);
    const relet = body.properties.find((p) =>
      p.leases.some((l) => l.id === reletFirstLeaseId)
    );

    expect(relet).toBeDefined();
    expect(relet!.leases.map((l) => l.id).sort()).toEqual(
      [reletFirstLeaseId, reletSecondLeaseId].sort()
    );
    expect(relet!.totalRentReceived).toBe(1600);
    expect(relet!.transactionDetails.map((tx) => tx.leaseId)).toContain(
      reletSecondLeaseId
    );
  });

  it("keeps the years apart", async () => {
    const body2025 = await prepare(2025);
    const body2024 = await prepare(2024);

    expect(body2024.summary.globalTotalRent).toBe(0);
    expect(body2025.summary.globalTotalRent).toBe(6400);
  });

  it("counts an occupied month by the month invoiced, not by the day of payment", async () => {
    // December's rent paid in January still belongs to December. Counting by
    // `paidAt` moved it into the next year's tally and left December empty.
    const property = await prisma.property.findFirstOrThrow({
      where: { userId: LANDLORD, name: "Bien echu" },
    });
    const december = await prisma.transaction.create({
      data: {
        userId: LANDLORD,
        leaseId: expiredLeaseId,
        amount: new Decimal(RENT).plus(CHARGES).toFixed(2),
        rentPortion: RENT,
        chargesPortion: CHARGES,
        periodStart: new Date("2025-12-01T00:00:00.000Z"),
        periodEnd: new Date("2025-12-31T00:00:00.000Z"),
        dueDate: new Date("2025-12-01T00:00:00.000Z"),
        status: "PAID",
        paidAt: new Date("2026-01-05T00:00:00.000Z"),
        receiptRentAmount: RENT,
        receiptChargesAmount: CHARGES,
      },
    });

    try {
      const report = reportFor(await prepare(YEAR), property.id);
      // January 2025..June 2025 + December 2025 = 7 invoiced months, whatever
      // day the last instalment actually landed.
      expect(report.occupancyMonths).toBe(7);
      expect(report.totalRentReceived).toBe(5600);
    } finally {
      await prisma.transaction.delete({ where: { id: december.id } });
    }
  });

  it("excludes another landlord's rent from the declaration", async () => {
    const body = await prepare(YEAR);
    const otherProperty = await prisma.property.findFirstOrThrow({
      where: { userId: OTHER },
    });
    expect(body.properties.map((p) => p.propertyId)).not.toContain(
      otherProperty.id
    );
    const txLeaseIds = body.properties.flatMap((p) =>
      p.transactionDetails.map((tx) => tx.leaseId)
    );
    expect(txLeaseIds).not.toContain(otherLeaseId);
  });

  it("still refuses an out-of-range year", async () => {
    const response = await prepareGET(
      new NextRequest("http://localhost/api/fiscal/prepare?year=1999")
    );
    expect(response.status).toBe(400);
  });
});
