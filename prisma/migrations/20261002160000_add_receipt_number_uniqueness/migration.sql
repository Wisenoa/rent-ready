-- Receipt numbering: make the sequence atomic and non-colliding.
--
-- Two changes, both additive. No Transaction row is read, rewritten or dropped,
-- so no financial history is touched by this migration.
--
-- 1. "ReceiptCounter" — a per-landlord counter. allocateReceiptNumber increments
--    it with a single INSERT ... ON CONFLICT DO UPDATE, which takes a row lock,
--    so two receipts generated in the same second get distinct numbers.
--    Seeded below from each landlord's current receipt count so the sequence
--    continues rather than restarting at 1 and colliding with existing references.
--
-- 2. A unique constraint on ("userId", "receiptNumber") — the backstop that makes
--    a duplicate reference impossible to persist. Scoped to the pair on purpose:
--    numbering is per-landlord, so two landlords legitimately share a reference
--    and a global UNIQUE on receiptNumber alone would reject the second
--    landlord's first receipt.
--
-- NULL receiptNumbers are unaffected: Postgres treats NULLs as distinct, so the
-- pending/unpaid transactions that carry no reference are all still allowed.

CREATE TABLE "ReceiptCounter" (
    "userId" TEXT NOT NULL,
    "nextValue" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReceiptCounter_pkey" PRIMARY KEY ("userId")
);

-- Seed one counter row per landlord that already has a receipt. nextValue is the
-- next free sequence: the count of existing receipts + 1, matching what the old
-- count()+1 would have produced. Landlords with no receipts get no row; the
-- allocator seeds one on first use.
INSERT INTO "ReceiptCounter" ("userId", "nextValue", "createdAt", "updatedAt")
SELECT
    t."userId",
    COUNT(*)::int + 1,
    now(),
    now()
FROM "Transaction" t
WHERE t."receiptNumber" IS NOT NULL
GROUP BY t."userId";

-- Fails loudly if any deployment already holds a duplicate (userId, receiptNumber)
-- pair. That would mean the collision was already persisted and needs a human
-- decision on which reference is authoritative — not a silent merge.
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_receiptNumber_key"
    UNIQUE ("userId", "receiptNumber");

ALTER TABLE "ReceiptCounter" ADD CONSTRAINT "ReceiptCounter_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Rollback (reverse order; both steps are purely additive so this loses nothing):
--   ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_userId_receiptNumber_key";
--   DROP TABLE "ReceiptCounter";