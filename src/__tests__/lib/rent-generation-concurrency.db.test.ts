/**
 * Concurrency on the rent generator: can two legitimate calls break RentReady?
 *
 * The partial unique index (`Transaction_leaseId_periodStart_unpaid_key`,
 * migration 20261005120000) enforces one unpaid obligation per (lease, period).
 * `one-obligation-per-month.db.test.ts` proves the database rejects a duplicate.
 * That is the other half of the question: whether the WRITERS can be driven into
 * asking for one.
 *
 * The mechanism that made it safe was `createMany({ skipDuplicates: true })`,
 * which compiles to `ON CONFLICT DO NOTHING` — and before the index existed it
 * had nothing to act on and silently wrote duplicates. So the flag's presence in
 * the source proved nothing; only executing it says anything.
 *
 * Runs against the real database, on a fresh user, and cleans up after itself.
 * Nothing is mocked: the question is what PostgreSQL and Prisma actually do when
 * two calls overlap.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";

const DATABASE_URL = process.env.DATABASE_URL;
const describeDb = DATABASE_URL ? describe : describe.skip;

const SUFFIX = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const USER_ID = `probe-${SUFFIX}`;

describeDb("generation des loyers sous concurrence", () => {
  let prisma: typeof import("@/lib/prisma").prisma;
  let leaseId = "";
  let propertyId = "";
  let tenantId = "";

  const unpaidCount = async (lease: string, month: string) =>
    prisma.transaction.count({
      where: {
        leaseId: lease,
        periodStart: new Date(`${month}-01T00:00:00.000Z`),
        paidAt: null,
        status: { not: "CANCELLED" },
      },
    });

  beforeAll(async () => {
    prisma = (await import("@/lib/prisma")).prisma;
    const { generateRentPeriodsForLease } = await import(
      "@/lib/domain/generate-rent-periods"
    );
    void generateRentPeriodsForLease;

    await prisma.user.create({
      data: {
        id: USER_ID,
        email: `probe-${SUFFIX}@test.local`,
        name: "Sonde",
        addressLine1: "1 rue de la Sonde",
        city: "Paris",
        postalCode: "75001",
      },
    });
    const property = await prisma.property.create({
      data: {
        userId: USER_ID,
        name: "Bien",
        type: "APARTMENT",
        addressLine1: "1 rue de la Sonde",
        city: "Paris",
        postalCode: "75001",
      },
    });
    propertyId = property.id;
    const tenant = await prisma.tenant.create({
      data: {
        userId: USER_ID,
        firstName: "Sonde",
        lastName: "Lodge",
        email: `loc-${SUFFIX}@test.local`,
        addressLine1: "2 rue de la Sonde",
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
        // Start far enough back that generation has several months to write.
        startDate: new Date("2026-03-01T00:00:00.000Z"),
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

  it("A4 — SEQUENTIEL : deux appels ne dupliquent pas et ne leve pas", async () => {
    const { generateRentPeriodsForLease } = await import(
      "@/lib/domain/generate-rent-periods"
    );

    const first = await generateRentPeriodsForLease(leaseId);
    const second = await generateRentPeriodsForLease(leaseId);


    const march = await unpaidCount(leaseId, "2026-03");
    const august = await unpaidCount(leaseId, "2026-08");

    expect(second.created).toBe(0);
    expect(march).toBe(1);
    expect(august).toBe(1);
  });

  it("A5 — CONCURRENT : deux generations simultanees", async () => {
    // A SECOND lease, untouched until now, so the calls race from an empty state —
    // the real scenario the migration describes: the 03:00 cron and the
    // page-render backstop both firing just after midnight on the 1st, each having
    // read an empty `taken` set.
    const property = await prisma.property.create({
      data: {
        userId: USER_ID,
        name: "Bien concurrent",
        type: "APARTMENT",
        addressLine1: "3 rue de la Sonde",
        city: "Paris",
        postalCode: "75001",
      },
    });
    const tenant = await prisma.tenant.create({
      data: {
        userId: USER_ID,
        firstName: "Race",
        lastName: "Cond",
        email: `race-${SUFFIX}@test.local`,
        addressLine1: "4 rue de la Sonde",
        city: "Paris",
        postalCode: "75001",
      },
    });
    const lease = await prisma.lease.create({
      data: {
        userId: USER_ID,
        propertyId: property.id,
        tenantId: tenant.id,
        rentAmount: "700.00",
        chargesAmount: "0.00",
        depositAmount: "700.00",
        startDate: new Date("2026-03-01T00:00:00.000Z"),
        paymentDay: 1,
        paymentMethod: "TRANSFER",
        leaseType: "UNFURNISHED",
        status: "ACTIVE",
      },
    });

    const { generateRentPeriodsForLease } = await import(
      "@/lib/domain/generate-rent-periods"
    );

    const results = await Promise.allSettled([
      generateRentPeriodsForLease(lease.id),
      generateRentPeriodsForLease(lease.id),
      generateRentPeriodsForLease(lease.id),
    ]);

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    for (const r of rejected) {
      const err = (r as PromiseRejectedResult).reason as {
        code?: string;
        message?: string;
      };
    }

    // The invariant, whatever the calls reported: one obligation per month.
    const rows = await prisma.transaction.findMany({
      where: { leaseId: lease.id, paidAt: null, status: { not: "CANCELLED" } },
      select: { periodStart: true },
    });
    const byMonth = new Map<string, number>();
    for (const r of rows) {
      const k = r.periodStart.toISOString().slice(0, 7);
      byMonth.set(k, (byMonth.get(k) ?? 0) + 1);
    }
    const dupes = [...byMonth.entries()].filter(([, n]) => n > 1);

    // NO call may reject: a landlord refreshing a page while the cron runs must
    // not see a 500.
    expect(
      rejected.map((r) => String((r as PromiseRejectedResult).reason)),
      "une generation concurrente doit reussir, pas lever"
    ).toEqual([]);
    expect(dupes).toEqual([]);

    await prisma.transaction.deleteMany({ where: { leaseId: lease.id } });
    await prisma.lease.deleteMany({ where: { id: lease.id } });
    await prisma.tenant.deleteMany({ where: { id: tenant.id } });
    await prisma.property.deleteMany({ where: { id: property.id } });
  });
});
