#!/usr/bin/env bash
# ============================================================
# Emergency Migration Rollback Script
# Usage: ./emergency-rollback.sh <env> <migration-name>
# Example: ./emergency-rollback.sh staging 20260428120000_add_biiling_code
#
# Prerequisites:
#   - pnpm installed
#   - DATABASE_URL env var set for the target environment
#   - Neon CLI authenticated (for PITR restore scenario)
#
# SAFETY: This script marks migrations as rolled-back but does NOT
# automatically restore data. For data loss scenarios, use the
# full runbook: prisma/MIGRATION_ROLLBACK_RUNBOOK.md
# ============================================================

set -euo pipefail

# ── Colors ─────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ── Arguments ───────────────────────────────────────────────
ENV="${1:-}"
MIGRATION_NAME="${2:-}"

if [[ -z "$ENV" ]] || [[ -z "$MIGRATION_NAME" ]]; then
  echo -e "${RED}ERROR: Missing arguments${NC}"
  echo "Usage: $0 <env> <migration-name>"
  echo "Example: $0 staging 20260428120000_add_biiling_code"
  exit 1
fi

# ── Validate env ────────────────────────────────────────────
VALID_ENVS=("dev" "staging" "production")
if [[ ! " ${VALID_ENVS[*]} " =~ " ${ENV} " ]]; then
  echo -e "${RED}ERROR: Invalid environment '$ENV'${NC}"
  echo "Valid environments: ${VALID_ENVS[*]}"
  exit 1
fi

# ── Pre-flight checks ───────────────────────────────────────
echo -e "${YELLOW}[1/5] Pre-flight checks...${NC}"

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo -e "${RED}ERROR: DATABASE_URL is not set. Set it before running this script.${NC}"
  echo "Example: DATABASE_URL='postgresql://...' $0 $ENV $MIGRATION_NAME"
  exit 1
fi

# Check prisma migrate status
echo "Checking current migration status..."
STATUS_OUTPUT=$(pnpm exec prisma migrate status 2>&1) || true
echo "$STATUS_OUTPUT"

# ── Step 2: Confirm before proceeding ──────────────────────
echo ""
echo -e "${YELLOW}WARNING: This will mark migration '${MIGRATION_NAME}' as rolled back in ${ENV}.${NC}"
echo -e "${YELLOW}This does NOT undo the SQL. It only tells Prisma the migration was reverted.${NC}"
echo ""
read -p "Continue? (type 'yes' to confirm): " CONFIRM
if [[ "$CONFIRM" != "yes" ]]; then
  echo -e "${RED}Aborted.${NC}"
  exit 1
fi

# ── Step 3: Mark migration as rolled back ─────────────────
echo ""
echo -e "${YELLOW}[2/5] Marking migration as rolled back...${NC}"
pnpm exec prisma migrate resolve --rolled-back "$MIGRATION_NAME"
echo -e "${GREEN}Done.${NC}"

# ── Step 4: Verify ──────────────────────────────────────────
echo ""
echo -e "${YELLOW}[3/5] Verifying migration status...${NC}"
pnpm exec prisma migrate status

# ── Step 5: Next steps ──────────────────────────────────────
echo ""
echo -e "${YELLOW}[4/5] Next steps:${NC}"
echo "  1. Fix the schema in prisma/schema.prisma"
echo "  2. Create a corrective migration: pnpm exec prisma migrate dev --name fix_<original>"
echo "  3. Test in ${ENV}:  DATABASE_URL=\$DATABASE_URL pnpm exec prisma migrate deploy"
echo "  4. Verify:          DATABASE_URL=\$DATABASE_URL pnpm exec prisma migrate status"
echo ""
echo -e "${YELLOW}[5/5] Full runbook: prisma/MIGRATION_ROLLBACK_RUNBOOK.md${NC}"
echo -e "${GREEN}Rollback complete for ${ENV}.${NC}"
