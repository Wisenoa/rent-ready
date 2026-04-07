-- ========================================
-- Rent-Ready Database Initialization
-- ========================================

-- Create database (handled by POSTGRES_DB env var)

-- ========================================
-- Performance Indexes for Phase 3 Features
-- ========================================

-- Dashboard KPI queries (owner dashboard)
CREATE INDEX IF NOT EXISTS idx_transaction_user_status ON "Transaction"("userId", "status");
CREATE INDEX IF NOT EXISTS idx_transaction_user_due_date ON "Transaction"("userId", "dueDate");
CREATE INDEX IF NOT EXISTS idx_transaction_lease_status ON "Transaction"("leaseId", "status");

-- Property occupancy tracking
CREATE INDEX IF NOT EXISTS idx_lease_property_status ON "Lease"("propertyId", "status");
CREATE INDEX IF NOT EXISTS idx_lease_user_status ON "Lease"("userId", "status");

-- Expense tracking per property
CREATE INDEX IF NOT EXISTS idx_expense_user_property ON "Expense"("userId", "propertyId");
CREATE INDEX IF NOT EXISTS idx_expense_user_date ON "Expense"("userId", "date" DESC);

-- Document extraction status (AI features)
CREATE INDEX IF NOT EXISTS idx_document_user_type ON "Document"("userId", "type");
CREATE INDEX IF NOT EXISTS idx_document_status ON "Document"("extractionStatus");

-- Tenant portal self-service
CREATE INDEX IF NOT EXISTS idx_tenant_access_token ON "TenantAccessToken"("token");
CREATE INDEX IF NOT EXISTS idx_maintenance_tenant_status ON "MaintenanceTicket"("tenantId", "status");

-- Bank webhook events (open banking)
CREATE INDEX IF NOT EXISTS idx_webhook_event_type_created ON "BankWebhookEvent"("eventType", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS idx_webhook_connection ON "BankWebhookEvent"("connectionId");

-- ========================================
-- Connection Pooling Configuration Note
-- ========================================
-- Configure in DATABASE_URL:
-- ?pgbouncer=true&connection_limit=10&pool_timeout=30

-- ========================================
-- Database User Permissions
-- ========================================
GRANT USAGE ON SCHEMA public TO ${POSTGRES_USER:-rentready};
GRANT CREATE ON SCHEMA public TO ${POSTGRES_USER:-rentready};
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO ${POSTGRES_USER:-rentready};
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO ${POSTGRES_USER:-rentready};

-- ========================================
-- Extensions
-- ========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";