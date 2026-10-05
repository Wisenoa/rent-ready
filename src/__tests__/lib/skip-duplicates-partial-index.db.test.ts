/**
 * Does `createMany({ skipDuplicates: true })` actually absorb a duplicate when
 * the constraint is a PARTIAL unique index?
 *
 * `ON CONFLICT DO NOTHING` is supposed to cover every unique constraint,
 * including partial indexes. If it did not, the generator would not merely write a
 * duplicate — it would raise, and every dashboard render (the `ensureRentPeriods`
 * backstop) would fail.
 *
 * This asserts both halves that matter: what Prisma reports, and what PostgreSQL
 * actually logged. A constraint violation is an ERROR in the server log even when
 * the client swallows it, so the log is the ground truth about whether the
 * database was asked to reject the row.
 */
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execFileSync } from "child_process";

const DATABASE_URL = process.env.DATABASE_URL;
const describeDb = DATABASE_URL ? describe : describe.skip;

const CONTAINER = process.env.RR_PG_CONTAINER ?? "rentready-pg";
const INDEX = "Transaction_leaseId_periodStart_unpaid_key";

const SUFFIX = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const USER_ID = `skipdup-${SUFFIX}`;

function serverErrorsMatching(index: string): number {
  try {
    const out = execFileSync("docker", ["logs", CONTAINER], {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    return out.split("\n").filter((l) => l.includes(index)).length;
  } catch {
    return -1; // the log is unavailable: do not pretend it was empty
  }
}

describeDb("skipDuplicates devant un index unique partiel", () => {
  let prisma: typeof import("@/lib/prisma").prisma;
  let leaseId = "";
  let propertyId = "";
  let tenantId = "";

  beforeAll(async () => {
    prisma = (await import("@/lib/prisma")).prisma;
    await prisma.user.create({
      data: {
        id: USER_ID,
        email: `skipdup-${SUFFIX}@test.local`,
        name: "Sonde",
        addressLine1: "1 rue du Skip",
        city: "Paris",
        postalCode: "75001",
      },
    });
    const property = await prisma.property.create({
      data: {
        userId: USER_ID,
        name: "Bien",
        type: "APARTMENT",
        addressLine1: "1 rue du Skip",
        city: "Paris",
        postalCode: "75001",
      },
    });
    propertyId = property.id;
    const tenant = await prisma.tenant.create({
      data: {
        userId: USER_ID,
        firstName: "Ski",
        lastName: "Dup",
        email: `skipdup-${SUFFIX}t@test.local`,
        addressLine1: "2 rue du Skip",
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
        rentAmount: "500.00",
        chargesAmount: "0.00",
        depositAmount: "500.00",
        startDate: new Date("2026-06-01T00:00:00.000Z"),
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

  it("absorbe le doublon sans journaliser d'erreur", async () => {
    const june = new Date("2026-06-01T00:00:00.000Z");
    const row = {
      userId: USER_ID,
      leaseId,
      amount: 500,
      rentPortion: 500,
      chargesPortion: 0,
      periodStart: june,
      periodEnd: june,
      dueDate: june,
      status: "PENDING" as const,
      isFullPayment: false,
      paidAt: null,
    };

    await prisma.transaction.create({ data: row });

    const before = serverErrorsMatching(INDEX);
    const result = await prisma.transaction.createMany({
      data: [row],
      skipDuplicates: true,
    });
    const after = serverErrorsMatching(INDEX);

    const rows = await prisma.transaction.count({
      where: { leaseId, periodStart: june },
    });

    // 1. One row, not two.
    expect(rows).toBe(1);
    // 2. Prisma reports nothing inserted.
    expect(result.count).toBe(0);
    // 3. PostgreSQL was never asked to reject anything — no ERROR logged.
    if (before >= 0 && after >= 0) {
      expect(
        after - before,
        "PostgreSQL a journalise une violation : ON CONFLICT ne couvre pas cet index"
      ).toBe(0);
    }
  });
});
