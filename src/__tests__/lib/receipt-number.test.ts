/**
 * Guards receipt numbering against silent collision.
 *
 * The number used to be produced by `count(receiptNumber not null) + 1`: a read,
 * then a write, with nothing between them and no constraint in the schema. Two
 * receipts generated in the same second read the same count and were handed the
 * same reference, and both were persisted. On a quittance that is a legal
 * document (loi du 6 juillet 1989, art. 21) carrying a reference shared with
 * another tenant's receipt.
 *
 * Two properties are pinned here:
 *
 *   - allocation is atomic. Concurrent callers get distinct numbers, which is a
 *     claim about real database behaviour (the row lock taken by
 *     ON CONFLICT DO UPDATE), so this test drives a real database rather than a
 *     mock. It skips when DATABASE_URL is absent, so the suite stays runnable
 *     without one; it does NOT skip silently when one is available.
 *   - numbering is scoped per landlord and the pair (userId, receiptNumber) is
 *     unique in the schema. A global UNIQUE on receiptNumber would look like a
 *     fix and would reject the second landlord's first receipt.
 *
 * WHY THE SCHEMA AND MIGRATION ARE STILL READ AS SOURCE
 *
 * The concurrency half is executed against a real database, but the two
 * declarations it depends on are not, and they are the part a mock can never
 * supply: whether the uniqueness is scoped per landlord rather than global, and
 * whether the migration that creates the constraint exists at all. A mock agrees
 * with whatever the schema says, so asking one would be asking the question to
 * itself. The claim is about the DDL, and the DDL is the artefact under test.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { generateReceiptNumber } from "@/lib/payment-utils";

const schema = readFileSync(join(process.cwd(), "prisma/schema.prisma"), "utf8");
const migration = readFileSync(
  join(
    process.cwd(),
    "prisma/migrations/20261002160000_add_receipt_number_uniqueness/migration.sql"
  ),
  "utf8"
);
const allocator = readFileSync(
  join(process.cwd(), "src/lib/receipt-number.ts"),
  "utf8"
);

describe("receipt numbering stays readable", () => {
  it("keeps the nominal format and increments by one", () => {
    // The change was the allocation mechanism, not the document reference the
    // landlord sees. QUI-2026-10-0008 then QUI-2026-10-0009, as before.
    expect(generateReceiptNumber("QUITTANCE", new Date(2026, 9, 5), 8)).toBe(
      "QUI-2026-10-0008"
    );
    expect(generateReceiptNumber("RECU", new Date(2026, 9, 5), 9)).toBe(
      "REC-2026-10-0009"
    );
  });

  it("pads the sequence so references stay aligned", () => {
    expect(generateReceiptNumber("QUITTANCE", new Date(2026, 9, 5), 1)).toBe(
      "QUI-2026-10-0001"
    );
    expect(generateReceiptNumber("RECU", new Date(2026, 9, 5), 42)).toBe(
      "REC-2026-10-0042"
    );
  });
});

describe("receipt numbers cannot collide", () => {
  it("allocates in a single atomic statement, not read-then-write", () => {
    // The old shape: a count() followed by `+ 1`. count() cannot be made atomic
    // by its caller, so the read-modify-write has to live inside one statement.
    expect(allocator).not.toMatch(/\.count\(/);
    expect(allocator).toMatch(/ON CONFLICT \("userId"\) DO UPDATE/);
    expect(allocator).toMatch(/RETURNING "nextValue"/);
  });

  it("seeds the counter from existing receipts rather than restarting at 1", () => {
    // A counter starting at 1 for a landlord who already holds QUI-2026-10-0008
    // hands out 0001 again and collides with a reference already issued.
    expect(allocator).toMatch(/COUNT\(\*\)::int, 0\) \+ 1/);
  });

  it("constrains the pair, not the number alone", () => {
    expect(schema).toMatch(/@@unique\(\[userId, receiptNumber\]\)/);
    // A bare `@unique` on receiptNumber is the trap: numbering is per-landlord,
    // so two landlords legitimately hold the same reference and the second
    // landlord's very first receipt would be rejected.
    expect(schema).not.toMatch(/receiptNumber\s+String\?\s+@unique/);
  });

  it("makes the migration additive, with a stated rollback", () => {
    // No financial history is rewritten: the migration creates a table and adds
    // an index, and NULL receiptNumbers stay allowed.
    expect(migration).toMatch(/CREATE TABLE "ReceiptCounter"/);
    expect(migration).toMatch(
      /ADD CONSTRAINT "Transaction_userId_receiptNumber_key"/
    );
    expect(migration).toMatch(/Rollback/);
    // Nothing may delete or rewrite financial history. The DML is checked with
    // its leading keyword so ON DELETE CASCADE (a referential action) is not
    // mistaken for a DELETE statement.
    expect(migration).not.toMatch(/^\s*(DELETE|UPDATE|TRUNCATE)\b/m);
    expect(migration).not.toMatch(/DROP TABLE "Transaction"/);
  });

  it("seeds existing landlords during the migration", () => {
    expect(migration).toMatch(/INSERT INTO "ReceiptCounter"/);
    expect(migration).toMatch(/COUNT\(\*\)::int \+ 1/);
  });
});

/**
 * The concurrency claims below are about real database behaviour, so they run
 * against a real database rather than a mock. Skipped only when no DATABASE_URL
 * is configured, so the suite still runs without one — with a database present
 * they execute, and the skip is reported rather than silent.
 */
async function databaseClient() {
  const dotenv = await import("dotenv");
  dotenv.config();
  if (!process.env.DATABASE_URL) return null;

  const { PrismaPg } = await import("@prisma/adapter-pg");
  const { PrismaClient } = await import("@prisma/client");
  return new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
  });
}

describe("concurrent allocation (real database)", () => {
  it("hands two simultaneous callers two distinct numbers", async (ctx) => {
    const prisma = await databaseClient();
    if (!prisma) return ctx.skip();
    const { allocateReceiptNumber } = await import("@/lib/receipt-number");

    // The counter is FK-bound to a landlord, so the test needs a real one.
    const userId = `receipt-number-test-${process.pid}-${Date.now()}`;
    const date = new Date(2026, 9, 5);

    try {
      await prisma.user.create({
        data: { id: userId, email: `${userId}@example.test`, name: "Test" },
      });

      // Two allocations issued together, un-awaited between: this is the shape
      // that collided. Under count()+1 both read the same count and both wrote.
      const [a, b] = await Promise.all([
        allocateReceiptNumber(userId, "QUITTANCE", date),
        allocateReceiptNumber(userId, "QUITTANCE", date),
      ]);

      expect(a).not.toBe(b);

      // And the sequence continues rather than repeating.
      const c = await allocateReceiptNumber(userId, "QUITTANCE", date);
      expect(new Set([a, b, c]).size).toBe(3);
      expect([a, b, c].sort()).toEqual([
        generateReceiptNumber("QUITTANCE", date, 1),
        generateReceiptNumber("QUITTANCE", date, 2),
        generateReceiptNumber("QUITTANCE", date, 3),
      ]);
    } finally {
      await prisma.user.delete({ where: { id: userId } }).catch(() => {});
      await prisma.$disconnect();
    }
  });

  it("numbers each landlord independently", async (ctx) => {
    // Justifies scoping the unique constraint to the pair: two landlords
    // starting at 0001 is correct, and the schema must permit it.
    const prisma = await databaseClient();
    if (!prisma) return ctx.skip();
    const { allocateReceiptNumber } = await import("@/lib/receipt-number");

    const stamp = `${process.pid}-${Date.now()}`;
    const a = `receipt-number-user-a-${stamp}`;
    const b = `receipt-number-user-b-${stamp}`;
    const date = new Date(2026, 9, 5);

    try {
      await prisma.user.createMany({
        data: [
          { id: a, email: `${a}@example.test`, name: "A" },
          { id: b, email: `${b}@example.test`, name: "B" },
        ],
      });

      const [numA, numB] = await Promise.all([
        allocateReceiptNumber(a, "QUITTANCE", date),
        allocateReceiptNumber(b, "QUITTANCE", date),
      ]);

      // Identical references across two landlords — legal, and permitted.
      expect(numA).toBe(numB);
      expect(numA).toBe(generateReceiptNumber("QUITTANCE", date, 1));
    } finally {
      await prisma.user.deleteMany({ where: { id: { in: [a, b] } } });
      await prisma.$disconnect();
    }
  });
});