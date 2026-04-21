-- Create StripeWebhookEvent table for webhook idempotency
CREATE TABLE "StripeWebhookEvent" (
    "id" TEXT NOT NULL,
    "stripeEventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "processedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT "StripeWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- Unique constraint on stripeEventId for idempotency
CREATE UNIQUE INDEX "StripeWebhookEvent_stripeEventId_key" ON "StripeWebhookEvent"("stripeEventId");

-- Indexes for common queries
CREATE INDEX "StripeWebhookEvent_eventType_idx" ON "StripeWebhookEvent"("eventType");
CREATE INDEX "StripeWebhookEvent_processedAt_idx" ON "StripeWebhookEvent"("processedAt");
