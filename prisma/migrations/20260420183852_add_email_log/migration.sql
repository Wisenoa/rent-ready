-- CreateEnum
CREATE TYPE "EmailType" AS ENUM ('EMAIL_TYPE_UNSPECIFIED', 'MAGIC_LINK', 'WELCOME', 'PASSWORD_RESET', 'RENT_REMINDER', 'PAYMENT_CONFIRMED', 'PAYMENT_LATE', 'LEASE_EXPIRING', 'TENANT_INVITATION', 'DEMO_REQUEST', 'SYSTEM');

-- CreateEnum
CREATE TYPE "EmailStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'BOUNCED');

-- DropIndex
DROP INDEX "idx_document_status";

-- DropIndex
DROP INDEX "idx_document_user_type";

-- DropIndex
DROP INDEX "idx_expense_user_date";

-- DropIndex
DROP INDEX "idx_expense_user_property";

-- DropIndex
DROP INDEX "idx_lease_property_status";

-- DropIndex
DROP INDEX "idx_lease_user_status";

-- DropIndex
DROP INDEX "idx_maintenance_tenant_status";

-- DropIndex
DROP INDEX "idx_transaction_lease_status";

-- DropIndex
DROP INDEX "idx_transaction_user_status";

-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "SeoEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "resourceSlug" TEXT,
    "pageUrl" TEXT NOT NULL,
    "sessionId" TEXT,
    "country" TEXT,
    "referrer" TEXT,
    "userAgent" TEXT,
    "ipHash" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeoEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL,
    "clientId" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "emailType" "EmailType" NOT NULL,
    "status" "EmailStatus" NOT NULL DEFAULT 'PENDING',
    "resendId" TEXT,
    "errorMessage" TEXT,
    "relatedEntityId" TEXT,
    "relatedEntityType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SeoEvent_eventType_createdAt_idx" ON "SeoEvent"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "SeoEvent_resourceSlug_createdAt_idx" ON "SeoEvent"("resourceSlug", "createdAt");

-- CreateIndex
CREATE INDEX "SeoEvent_sessionId_idx" ON "SeoEvent"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailLog_clientId_key" ON "EmailLog"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailLog_resendId_key" ON "EmailLog"("resendId");

-- CreateIndex
CREATE INDEX "EmailLog_emailType_createdAt_idx" ON "EmailLog"("emailType", "createdAt");

-- CreateIndex
CREATE INDEX "EmailLog_relatedEntityId_relatedEntityType_idx" ON "EmailLog"("relatedEntityId", "relatedEntityType");

-- CreateIndex
CREATE INDEX "EmailLog_status_createdAt_idx" ON "EmailLog"("status", "createdAt");

-- CreateIndex
CREATE INDEX "EmailLog_to_idx" ON "EmailLog"("to");
