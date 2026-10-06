/**
 * A lease whose term has run out must stop being ACTIVE.
 *
 * `LeaseStatus` has carried an `EXPIRED` member since the schema was written and
 * nothing ever set it. The only writers were `createLease` (ACTIVE) and
 * `terminateLease` (TERMINATED), so every fixed-term lease stayed ACTIVE forever
 * after its `endDate` passed: listed as active on the leases page, reported as an
 * active lease by the tenant portal, and re-scanned by the nightly cron for the
 * rest of its life.
 *
 * The ledger was never wrong about it, which is why this survived: `buildRentPeriod`
 * bounds the range by `endDate`, so generation stopped at the last month of the
 * term and no rent was ever owed past it. Verified on the real database — a
 * three-year lease read two months past its `endDate` had generated exactly its 36
 * contractual months and nothing more. What was wrong was the LANDLORD'S PICTURE
 * of the lease, not the money.
 *
 * `generateRentPeriodsForAllLeases` now closes those leases, on the same
 * month-granular rule the generator uses for money: a lease ending on the 31st is
 * not EXPIRED until the 1st, because rent for its final month is still owed and
 * still collectable.
 *
 * Executed against PostgreSQL: the assertion is about a status column that the
 * job writes, which is a fact about rows.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";

const DATABASE_URL = process.env.DATABASE_URL;
const describeDb = DATABASE_URL ? describe : describe.skip;

const SUFFIX = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const USER_ID = `expiry-${SUFFIX}`;

describeDb("a lease past its endDate stops being ACTIVE", () => {
  let prisma: typeof import("@/lib/prisma").prisma;
  let generateForAll: typeof import("@/lib/domain/generate-rent-periods").generateRentPeriodsForAllLeases;
  let generateForLease: typeof import("@/lib/domain/generate-rent-periods").generateRentPeriodsForLease;

  let propertyId = "";
  let tenantId = "";
  /** Ended two months ago, still flagged ACTIVE — the state under test. */
  let endedLeaseId = "";
  /** Ends at the end of the CURRENT month: its last month is still owed. */
  let endingThisMonthId = "";
  /** No endDate at all: a lease that runs on. */
  let openEndedId = "";
  /** Ended, but already TERMINATED by the landlord. Not this job's business. */
  let terminatedId = "";

  const statusOf = async (id: string) =>
    (await prisma.lease.findUniqueOrThrow({ where: { id }, select: { status: true } })).status;

  /** How many months are owed for a lease. */
  const monthsFor = (leaseId: string) =>
    prisma.transaction.count({ where: { leaseId } });

  beforeAll(async () => {
    prisma = (await import("@/lib/prisma")).prisma;
    const generation = await import("@/lib/domain/generate-rent-periods");
    generateForAll = generation.generateRentPeriodsForAllLeases;
    generateForLease = generation.generateRentPeriodsForLease;

    await prisma.user.create({
      data: {
        id: USER_ID,
        email: `expiry-${SUFFIX}@test.local`,
        name: "Landlord",
        addressLine1: "1 rue de l'Expiration",
        city: "Paris",
        postalCode: "75001",
      },
    });
    const property = await prisma.property.create({
      data: {
        userId: USER_ID,
        name: "Bien",
        type: "APARTMENT",
        addressLine1: "1 rue de l'Expiration",
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
        addressLine1: "2 rue de l'Expiration",
        city: "Paris",
        postalCode: "75001",
      },
    });
    tenantId = tenant.id;

    const make = (data: {
      startDate: Date;
      endDate?: Date | null;
      status?: "ACTIVE" | "TERMINATED";
    }) =>
      prisma.lease.create({
        data: {
          userId: USER_ID,
          propertyId,
          tenantId,
          rentAmount: "800.00",
          chargesAmount: "0.00",
          depositAmount: "800.00",
          paymentDay: 1,
          paymentMethod: "TRANSFER",
          leaseType: "UNFURNISHED",
          status: data.status ?? "ACTIVE",
          startDate: data.startDate,
          endDate: data.endDate ?? null,
        },
      });

    // Anchored to fixed dates so the month arithmetic is not at the mercy of
    // whenever the suite runs: the "now" below is February 2027.
    endedLeaseId = (
      await make({
        startDate: new Date("2024-01-01T00:00:00.000Z"),
        endDate: new Date("2026-12-31T00:00:00.000Z"),
      })
    ).id;
    endingThisMonthId = (
      await make({
        startDate: new Date("2025-01-01T00:00:00.000Z"),
        endDate: new Date("2027-02-28T00:00:00.000Z"),
      })
    ).id;
    openEndedId = (await make({ startDate: new Date("2025-01-01T00:00:00.000Z") })).id;
    terminatedId = (
      await make({
        startDate: new Date("2024-01-01T00:00:00.000Z"),
        endDate: new Date("2026-12-31T00:00:00.000Z"),
        status: "TERMINATED",
      })
    ).id;
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

  it("generation never owes rent past the endDate", async () => {
    // The half that was already right, asserted so the fix cannot quietly break
    // it: a three-year lease read in February 2027 owes exactly 36 months.
    await generateForLease(endedLeaseId, new Date("2027-02-05T00:00:00.000Z"));

    expect(await monthsFor(endedLeaseId)).toBe(36);
    const last = await prisma.transaction.findFirstOrThrow({
      where: { leaseId: endedLeaseId },
      orderBy: { periodStart: "desc" },
    });
    expect(last.periodStart.toISOString().slice(0, 7)).toBe("2026-12");
  });

  it("marks a lease whose final month has closed as EXPIRED", async () => {
    expect(await statusOf(endedLeaseId)).toBe("ACTIVE");

    const result = await generateForAll(USER_ID, new Date("2027-02-05T00:00:00.000Z"));

    expect(result.expired).toBe(1);
    expect(await statusOf(endedLeaseId)).toBe("EXPIRED");
  });

  it("leaves a lease whose final month is still current ACTIVE", async () => {
    // February is its last contractual month: rent for February is owed and
    // collectable, so calling it expired on the 5th would stop offering the very
    // month it is still owed. The comparison is on the calendar month, not the day
    // — the same rule `buildRentPeriod` applies when deciding what is owed.
    expect(await statusOf(endingThisMonthId)).toBe("ACTIVE");

    await generateForAll(USER_ID, new Date("2027-02-20T00:00:00.000Z"));

    expect(await statusOf(endingThisMonthId)).toBe("ACTIVE");
    const february = await prisma.transaction.findFirst({
      where: {
        leaseId: endingThisMonthId,
        periodStart: new Date("2027-02-01T00:00:00.000Z"),
        paidAt: null,
      },
    });
    expect(february).not.toBeNull();
  });

  it("expires that same lease on the first of the next month", async () => {
    await generateForAll(USER_ID, new Date("2027-03-01T00:00:00.000Z"));

    expect(await statusOf(endingThisMonthId)).toBe("EXPIRED");
  });

  it("never expires a lease with no endDate", async () => {
    // A lease with no term runs until it is terminated. Expiring it would stop a
    // landlord's rent on a technicality, which is the one outcome worse than a
    // stale status.
    await generateForAll(USER_ID, new Date("2027-03-01T00:00:00.000Z"));

    expect(await statusOf(openEndedId)).toBe("ACTIVE");
  });

  it("does not touch a lease the landlord already terminated", async () => {
    // TERMINATED is a decision the landlord made; EXPIRED is a fact about the
    // calendar. Overwriting one with the other would erase the distinction
    // between "we ended this" and "this ran out".
    await generateForAll(USER_ID, new Date("2027-03-01T00:00:00.000Z"));

    expect(await statusOf(terminatedId)).toBe("TERMINATED");
  });

  it("reports nothing left to expire on the next run", async () => {
    const result = await generateForAll(USER_ID, new Date("2027-03-01T00:00:00.000Z"));

    expect(result.expired).toBe(0);
    // And the job stops rescanning them: only the open-ended lease is ACTIVE now.
    expect(result.leases).toBe(1);
  });
});