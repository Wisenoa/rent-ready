-- Stripe webhook idempotency table.
--
-- This table was ALREADY created by 20260408085919_add_unit_guarantor_org, which
-- included it alongside the other additive schema changes. The original version of
-- this migration tried to create it a second time, so `prisma migrate deploy` failed
-- with P3018 / SQLSTATE 42P07 ("relation StripeWebhookEvent already exists") on any
-- database built from an empty state.
--
-- The definition is identical to the one already applied, so there is nothing left to
-- do. The migration is retained rather than deleted to preserve the checksums of any
-- database where it is already recorded as applied.

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables
                   WHERE table_schema = 'public' AND table_name = 'StripeWebhookEvent') THEN
        -- Safety net for databases that never received the table from the earlier
        -- migration.
        CREATE TABLE "StripeWebhookEvent" (
            "id" TEXT NOT NULL,
            "stripeEventId" TEXT NOT NULL,
            "eventType" TEXT NOT NULL,
            "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
        );
        CREATE UNIQUE INDEX "StripeWebhookEvent_stripeEventId_key" ON "StripeWebhookEvent"("stripeEventId");
        CREATE INDEX "StripeWebhookEvent_eventType_idx" ON "StripeWebhookEvent"("eventType");
        CREATE INDEX "StripeWebhookEvent_processedAt_idx" ON "StripeWebhookEvent"("processedAt");
    END IF;
END $$;