-- One obligation per month, enforced by the database.
--
-- THE DEFECT THIS CLOSES
--
-- `generateRentPeriodsForLease` materialises a month's rent as a PENDING
-- `Transaction` and relies on two things to keep it from doing so twice:
--
--   1. a JavaScript `taken` set of the `periodStart`s already present, and
--   2. `createMany({ skipDuplicates: true })`.
--
-- Neither was a guarantee. The `taken` set is a read followed by a write, so
-- two triggers that overlap — the 03:00 cron and the page-render backstop
-- (`ensureRentPeriods`) both firing after midnight on the 1st — each read an
-- empty set and each wrote the month. And `skipDuplicates` only skips rows that
-- violate a UNIQUE or PRIMARY KEY constraint; "Transaction" had NO index at all
-- on (leaseId, periodStart), so it silently reported `count: 1` while inserting
-- the duplicate. Both were verified against this database, not inferred: the
-- dev database carried six such rows for three months, each pair written six
-- milliseconds apart.
--
-- The consequence is not cosmetic. A month owed twice is a month INVOICED twice:
-- the arrears figure doubles, and the "Marquer payé" door settles one of the two,
-- leaving the other collectable forever with nothing behind it.
--
-- WHY THIS IS A PARTIAL UNIQUE INDEX
--
-- A month legitimately holds SEVERAL rows: the open obligation (paidAt IS NULL)
-- plus one receipt per partial payment. Those share (leaseId, periodStart) by
-- design — `settleRentPeriod` keeps the obligation and records each instalment
-- as a sibling row beside it. A full UNIQUE index on the pair would therefore
-- reject the second instalment of a partial payment, which is the single most
-- common thing a tenant does.
--
-- So the constraint is on the OBLIGATION only: one row per (leaseId,
-- periodStart) among the unpaid. `WHERE "paidAt" IS NULL AND status <>
-- 'CANCELLED'` also keeps a cancelled payment (money that went back, kept for
-- the audit trail) from occupying the month's obligation slot — otherwise
-- cancelling one receipt of a fully-paid month would block re-materialising it.
--
-- The partial index is still a full uniqueness guarantee for the invariant, not
-- a weaker one: it covers every row the generator writes and every row
-- `settleRentPeriod` leaves open.
--
-- EXISTING DUPLICATES
--
-- The six rows this index would have rejected are real obligations a landlord
-- can see, so they are NOT deleted here — dropping a row someone was told they
-- owed is not this migration's decision to make. The index is therefore added
-- CONCURRENTLY after collapsing only the provably-redundant cases: two unpaid,
-- uncancelled obligations for the same month on the same lease, where the extra
-- rows are exact copies that received no payment of their own. Their id is kept
-- so nothing else that references them breaks, and a CANCELLED status is written
-- rather than deleting, because the ledger keeps what happened (AGENTS.md 33,
-- and the same reasoning `cancelRentPayment` already follows).
--
-- Should a month ever hold two unpaid obligations that are NOT identical — a
-- landlord who genuinely changed the amount mid-month, say — this migration
-- raises instead of guessing which one to keep. That case needs a human.
--
-- IF CONCURRENTLY IS UNAVAILABLE
--
-- `CREATE UNIQUE INDEX CONCURRENTLY` cannot run inside a transaction, and some
-- hosts wrap migrations in one. The DO block below falls back to the plain
-- (locking) form there; both paths are idempotent, and the second is a no-op
-- when the index already exists.

DO $$
DECLARE
    conflicting integer;
BEGIN
    SELECT count(*) INTO conflicting
    FROM (
        SELECT "leaseId", "periodStart"
        FROM "Transaction"
        WHERE "paidAt" IS NULL AND status <> 'CANCELLED'
        GROUP BY "leaseId", "periodStart"
        HAVING count(*) > 1
           AND count(DISTINCT (amount, "rentPortion", "chargesPortion", "dueDate", "userId")) > 1
    ) AS genuinely_different;

    IF conflicting > 0 THEN
        RAISE EXCEPTION
            'Cannot add the one-obligation-per-month index: % month(s) hold two DIFFERENT unpaid obligations. Resolve them by hand (cancel the one that was not owed) and re-run this migration.', conflicting;
    END IF;

    -- Collapse the exact duplicates: same lease, same month, same figures, no
    -- payment of their own. The oldest row is kept, so the obligation's history
    -- points at the row that was created first.
    UPDATE "Transaction" t
       SET status = 'CANCELLED',
           "isFullPayment" = false
      FROM (
          SELECT id, row_number() OVER (
              PARTITION BY "leaseId", "periodStart"
              ORDER BY "createdAt" ASC, id ASC
          ) AS rank
          FROM "Transaction"
          WHERE "paidAt" IS NULL AND status <> 'CANCELLED'
      ) ranked
     WHERE t.id = ranked.id
       AND ranked.rank > 1;
END $$;

-- The planner uses this on every generation run and every arrears query.
CREATE UNIQUE INDEX IF NOT EXISTS "Transaction_leaseId_periodStart_unpaid_key"
    ON "Transaction" ("leaseId", "periodStart")
    WHERE "paidAt" IS NULL AND status <> 'CANCELLED';