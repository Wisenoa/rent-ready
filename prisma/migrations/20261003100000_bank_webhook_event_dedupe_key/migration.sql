-- Bank webhook replay protection: make the dedupe key a real database constraint.
--
-- The handler compared `payload.timestamp` to decide an event had already been
-- processed. `timestamp` is OPTIONAL in the provider schema, so an event without
-- one was never deduplicated and was processed in full on every redelivery.
-- Application-level read-then-write also cannot survive two concurrent deliveries
-- of the same event: both read "not seen" and both write.
--
-- "dedupeKey" is the stable identity of the event — the provider's own transaction
-- id when there is one, otherwise a hash of the raw body. UNIQUE makes the second
-- delivery fail in the database instead of duplicating financial effects
-- (AGENTS.md §12, §13).
--
-- Existing rows are backfilled from md5(id): they are historical logs, none of them
-- has ever been deduplicated against, and a hash of their own id is unique by
-- construction, so the constraint can be added without touching behaviour.

ALTER TABLE "BankWebhookEvent" ADD COLUMN "dedupeKey" TEXT;

UPDATE "BankWebhookEvent" SET "dedupeKey" = md5("id");

ALTER TABLE "BankWebhookEvent" ALTER COLUMN "dedupeKey" SET NOT NULL;

ALTER TABLE "BankWebhookEvent" ADD CONSTRAINT "BankWebhookEvent_dedupeKey_key"
    UNIQUE ("dedupeKey");

-- Rollback:
--   ALTER TABLE "BankWebhookEvent" DROP CONSTRAINT "BankWebhookEvent_dedupeKey_key";
--   ALTER TABLE "BankWebhookEvent" DROP COLUMN "dedupeKey";