#!/bin/bash
# ========================================
# Uptime / Health Check Script
# ========================================
# Usage: ./uptime-check.sh [environment]
# Environments: staging (default), production
#
# Exit codes:
#   0 = healthy
#   1 = degraded (warnings)
#   2 = down (critical)

set -o pipefail

ENV="${1:-staging}"
STAGING_URL="${STAGING_URL:-https://staging.your-domain.com}"
PROD_URL="${PROD_URL:-https://rent-ready.your-domain.com}"
HEALTH_PATH="/api/health"
TIMEOUT=15

# Colors
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m'

if [ "$ENV" = "production" ]; then
  TARGET_URL="$PROD_URL"
else
  TARGET_URL="$STAGING_URL"
fi

HEALTH_URL="${TARGET_URL}${HEALTH_PATH}"

echo "============================================"
echo "Rent Ready — Uptime Check"
echo "Environment: $ENV"
echo "Target: $HEALTH_URL"
echo "============================================"
echo ""

# ── HTTP Health Check ──
echo "[1/2] Checking /api/health..."
HTTP_CODE=$(curl -sf \
  --max-time $TIMEOUT \
  --retry 3 \
  --retry-delay 5 \
  -w "%{http_code}" \
  -o /tmp/health-body.json \
  "$HEALTH_URL" 2>/dev/null || echo "000")

DURATION=$(curl -sf \
  --max-time $TIMEOUT \
  -w "%{time_total}" \
  -o /dev/null \
  "$HEALTH_URL" 2>/dev/null || echo "0")

if [ "$HTTP_CODE" = "000" ]; then
  echo -e "${RED}❌ DOWN${NC} — Could not reach $HEALTH_URL"
  HEALTH_STATUS=2
elif [ "$HTTP_CODE" -ge 500 ]; then
  echo -e "${RED}❌ ERROR${NC} — HTTP $HTTP_CODE (server error)"
  HEALTH_STATUS=2
elif [ "$HTTP_CODE" -ge 400 ]; then
  echo -e "${YELLOW}⚠ DEGRADED${NC} — HTTP $HTTP_CODE (client error)"
  HEALTH_STATUS=1
elif [ "$HTTP_CODE" -ge 200 ] && [ "$HTTP_CODE" -lt 300 ]; then
  echo -e "${GREEN}✅ HEALTHY${NC} — HTTP $HTTP_CODE (${DURATION}s)"
  HEALTH_STATUS=0
else
  echo -e "${YELLOW}⚠ UNKNOWN${NC} — HTTP $HTTP_CODE"
  HEALTH_STATUS=1
fi

# ── Parse health body ──
if [ -f /tmp/health-body.json ] && [ "$HEALTH_STATUS" -eq 0 ]; then
  echo ""
  echo "[2/2] Parsing health response..."
  APP_STATUS=$(cat /tmp/health-body.json | grep -o '"status":"[^"]*"' | head -1 | cut -d'"' -f4)
  DB_STATUS=$(cat /tmp/health-body.json | grep -o '"database":{"status":"[^"]*"' | cut -d'"' -f4)
  DB_LATENCY=$(cat /tmp/health-body.json | grep -o '"database":{"status":"[^"]*","latency":[0-9]*' | grep -o '"latency":[0-9]*' | cut -d':' -f2)

  echo "  App:   ${APP_STATUS:-unknown}"
  echo "  DB:    ${DB_STATUS:-unknown} (${DB_LATENCY:-?}ms)"

  if [ "$DB_STATUS" != "healthy" ]; then
    echo -e "${RED}  ⚠ Database is ${DB_STATUS}${NC}"
    HEALTH_STATUS=1
  fi
fi

# ── Summary ──
echo ""
echo "============================================"
case $HEALTH_STATUS in
  0) echo -e "${GREEN}✅ All systems healthy${NC}" ;;
  1) echo -e "${YELLOW}⚠ Some checks degraded${NC}" ;;
  2) echo -e "${RED}❌ Service is down${NC}" ;;
esac
echo "============================================"

rm -f /tmp/health-body.json
exit $HEALTH_STATUS
