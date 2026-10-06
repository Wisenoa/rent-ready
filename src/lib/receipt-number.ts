/**
 * Receipt number allocation.
 *
 * The number used to be `count(receiptNumber not null) + 1`, computed with a
 * read followed by a write. Two receipts generated in the same second both read
 * the same count and were handed the same number: a silent collision on a legal
 * document, with nothing in the schema to stop it from being persisted.
 *
 * `count()` cannot be made atomic from the caller. What can is a counter row
 * updated by a single statement, so the read-modify-write happens inside one
 * database operation:
 *
 *   INSERT ... ON CONFLICT ("userId") DO UPDATE SET "nextValue" = nextValue + 1
 *
 * `ON CONFLICT DO UPDATE` takes a row lock on the counter row, so concurrent
 * callers for the same landlord queue on it and each observes a distinct
 * incremented value. The unique constraint on (userId, receiptNumber) is the
 * backstop: if the counter were ever wrong, the write fails loudly instead of
 * persisting two receipts under one reference.
 *
 * The sequence part of the number stays a per-landlord running total, exactly as
 * `count() + 1` produced it, so existing references keep incrementing the way
 * users already see them.
 */

import { prisma } from "@/lib/prisma";
import { generateReceiptNumber } from "@/lib/payment-utils";

/**
 * Reserve the next receipt number for a landlord.
 *
 * Returns the formatted number (e.g. "QUI-2026-10-0008"). The number is reserved
 * for the caller even if the caller then fails to issue the receipt, leaving a
 * gap in the sequence. That is deliberate: a gap is recoverable, a duplicate
 * reference on a quittance is not.
 */
export async function allocateReceiptNumber(
  userId: string,
  type: "QUITTANCE" | "RECU",
  date: Date
): Promise<string> {
  // Seeded from the receipts that already exist for this landlord, so a
  // landlord whose counter row does not exist yet (any deployment predating
  // this table, or a landlord added by hand) continues the sequence instead of
  // restarting it at 1 and colliding with an existing reference.
  const rows = await prisma.$queryRaw<{ nextValue: number }[]>`
    INSERT INTO "ReceiptCounter" ("userId", "nextValue", "createdAt", "updatedAt")
    VALUES (
      ${userId},
      (
        SELECT COALESCE(COUNT(*)::int, 0) + 1
        FROM "Transaction"
        WHERE "userId" = ${userId} AND "receiptNumber" IS NOT NULL
      ),
      now(),
      now()
    )
    ON CONFLICT ("userId") DO UPDATE
      SET "nextValue" = "ReceiptCounter"."nextValue" + 1, "updatedAt" = now()
    RETURNING "nextValue"
  `;

  const sequence = rows[0]?.nextValue;
  if (typeof sequence !== "number") {
    throw new Error("Receipt counter returned no sequence");
  }

  return generateReceiptNumber(type, date, sequence);
}