-- Add composite index for tenant listing query
-- Fixes: WHERE "userId" = X AND archived = false
CREATE INDEX IF NOT EXISTS "Tenant_userId_archived_idx" ON "Tenant" ("userId", "archived");