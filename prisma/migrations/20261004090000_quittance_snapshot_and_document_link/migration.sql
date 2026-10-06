-- A receipt must describe the payment event, not the lease as it stands today.
--
-- Three additive changes. No row is rewritten, dropped or reinterpreted, so no
-- financial history is touched: existing transactions keep NULL in the two new
-- amount columns and keep being described from their lease, which is exactly
-- what happened before this migration.
--
-- 1. "Transaction"."receiptRentAmount" / "receiptChargesAmount" — the rent and
--    charges OWED for the period, frozen at the moment the payment was recorded.
--    `generateQuittance` used to read `Lease.rentAmount` / `Lease.chargesAmount`
--    when the PDF was produced, so an IRL revision between the payment and the
--    download printed the NEW rent on a receipt for money received at the OLD
--    one. The document was no longer reproducible from the ledger
--    (AGENTS.md 14). Nullable so historical rows stay valid; every payment
--    recorded from now on fills them.
--
-- 2. "Document"."transactionId" — which payment a generated receipt attests.
--
-- 3. A UNIQUE index on it. Generation used to allocate a new receipt number and
--    create a new Document on every call, so a double click, a retry or two open
--    tabs produced N documents and N references for one payment, and the earlier
--    ones were orphaned. The constraint is what makes the second call lose: it
--    cannot persist, so the existing document is returned instead. NULLs stay
--    distinct, so uploads (lease scans, checklists) are unaffected.
--
-- Backfill: the two amount columns stay NULL on historical rows. Filling them
-- from the lease TODAY would freeze the current rent onto a payment that was
-- settled at another one — inventing a figure rather than recording a known one,
-- which is the exact defect this migration removes.
--
-- Rollback:
--   DROP INDEX "Document_transactionId_key";
--   ALTER TABLE "Document" DROP COLUMN "transactionId";
--   ALTER TABLE "Transaction"
--     DROP COLUMN "receiptChargesAmount",
--     DROP COLUMN "receiptRentAmount";

ALTER TABLE "Transaction"
    ADD COLUMN "receiptRentAmount" DECIMAL(12,2),
    ADD COLUMN "receiptChargesAmount" DECIMAL(12,2);

ALTER TABLE "Document"
    ADD COLUMN "transactionId" TEXT;

ALTER TABLE "Document"
    ADD CONSTRAINT "Document_transactionId_key" UNIQUE ("transactionId");

ALTER TABLE "Document"
    ADD CONSTRAINT "Document_transactionId_fkey"
    FOREIGN KEY ("transactionId") REFERENCES "Transaction" ("id")
    ON DELETE CASCADE ON UPDATE CASCADE;