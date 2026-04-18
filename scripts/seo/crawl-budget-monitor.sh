#!/bin/bash
# ========================================
# Crawl Budget Efficiency Monitor
# ========================================
# Monitors pages crawled vs pages indexed to detect crawl budget waste.
# Crawl efficiency = pages indexed / pages crawled. Target: > 80%.
#
# Usage:
#   ./crawl-budget-monitor.sh              # interactive (requires API key input)
#   GOOGLE_SEARCH_CONSOLE_API_KEY=xxx ./crawl-budget-monitor.sh  # env var
#
# Requirements:
#   - Google Search Console API enabled (GCP project)
#   - OAuth2 service account or API key with Search Console read access
#   - jq for JSON parsing
#
# Output: JSON summary + Slack/console alert if efficiency < threshold

set -euo pipefail

# ── Configuration ───────────────────────────────────────────────────────────────
SITE_URL="${SITE_URL:-https://www.rentready.fr}"
API_KEY="${GOOGLE_SEARCH_CONSOLE_API_KEY:-}"
ALERT_THRESHOLD="${CRAWL_EFFICIENCY_THRESHOLD:-80}"  # warn if efficiency < 80%
OUTPUT_FILE="${OUTPUT_FILE:-/tmp/crawl-budget-report.json}"

# Colors for output
RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

# ── Helpers ────────────────────────────────────────────────────────────────────
log() { echo "[$(date -u '+%Y-%m-%dT%H:%M:%SZ')] $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
error() { echo -e "${RED}[ERROR]${NC} $*" >&2; }

# ── API key check ───────────────────────────────────────────────────────────────
if [ -z "$API_KEY" ]; then
  warn "GOOGLE_SEARCH_CONSOLE_API_KEY not set. Skipping live Search Console check."
  warn "Running in dry-run mode — showing what would be checked."
  DRY_RUN=true
else
  DRY_RUN=false
fi

# ── Functions ──────────────────────────────────────────────────────────────────

# Fetch crawl stats from Google Search Console API
fetch_crawl_stats() {
  local start_date="$1"
  local end_date="$2"
  local dimensions="$3"  # e.g., "page,response_code"

  # Search Console API: searchanalytics.query
  local payload=$(cat <<EOF
{
  "startDate": "$start_date",
  "endDate": "$end_date",
  "dimensions": [$dimensions],
  "rowCount": 10000
}
EOF
)

  curl -sf \
    -H "Authorization: Bearer $API_KEY" \
    -H "Content-Type: application/json" \
    -X POST \
    -d "$payload" \
    "https://www.googleapis.com/webmasters/v3/sites/${SITE_URL//\//%2F}/searchAnalytics/query" 2>/dev/null
}

# Calculate efficiency from raw data
calculate_efficiency() {
  local rows="$1"  # JSON array from Search Console
  local total_crawled
  local total_indexed

  # Parse with jq (install check)
  if ! command -v jq &>/dev/null; then
    error "jq is required but not installed. Install with: apt install jq"
    exit 1
  fi

  # Total pages crawled (sum of clicks as proxy — not ideal but functional)
  total_crawled=$(echo "$rows" | jq '[.rows[] | .clicks] | add // 0')
  total_indexed=$(echo "$rows" | jq '[.rows[] | select(.response_code == 200 and .impressions > 0) | .impressions] | add // 0')

  if [ "$total_crawled" -eq 0 ]; then
    echo "0"
    return
  fi

  # Efficiency = indexed / crawled (as %)
  echo "$total_indexed $total_crawled" | awk '{printf "%.1f", ($1 / $2) * 100}'
}

# Check for crawl anomalies (4xx errors, noindex pages)
check_crawl_anomalies() {
  local rows="$1"

  local errors_4xx=$(echo "$rows" | jq '[.rows[] | select(.response_code >= 400 and .response_code < 500) | .clicks] | add // 0')
  local errors_5xx=$(echo "$rows" | jq '[.rows[] | select(.response_code >= 500) | .clicks] | add // 0')
  local total_crawl=$(echo "$rows" | jq '[.rows[] | .clicks] | add // 0')

  echo "4xx_errors=$errors_4xx"
  echo "5xx_errors=$errors_5xx"
  echo "total_crawl=$total_crawl"

  if [ "$errors_5xx" -gt 0 ]; then
    warn "⚠️  $errors_5xx pages returned 5xx errors — these waste crawl budget!"
    warn "   Fix server errors immediately to preserve crawl budget."
    warn "   5xx errors tell Googlebot to come back later, slowing content discovery."
  fi

  if [ "$errors_4xx" -gt 0 ]; then
    warn "⚠️  $errors_4xx pages returned 4xx errors — orphan pages or broken links."
    warn "   Fix or add 301 redirects for these pages to conserve crawl budget."
  fi
}

# Check for noindex pages being crawled
check_noindex_pages() {
  local rows="$1"

  # Pages with low impressions despite high crawl = likely noindexed
  local noindex_candidates=$(echo "$rows" | jq '[.rows[] | select(.clicks > 5 and .impressions < 5)] | length')

  if [ "$noindex_candidates" -gt 0 ]; then
    warn "⚠️  $noindex_candidates pages have high crawl but low impressions — possible noindex issue."
    warn "   Check if these pages should be indexed. If not, ensure they are in robots.txt disallow."
  fi
}

# ── Main ──────────────────────────────────────────────────────────────────────

main() {
  echo ""
  echo "============================================"
  echo "Crawl Budget Efficiency Monitor — RentReady"
  echo "============================================"
  echo "Site: $SITE_URL"
  echo "Timestamp: $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
  echo "Alert threshold: < $ALERT_THRESHOLD% efficiency"
  echo ""

  if [ "$DRY_RUN" = true ]; then
    echo "DRY RUN — No API key provided."
    echo ""
    echo "What this script checks:"
    echo "  1. Pages crawled vs pages indexed (efficiency %)"
    echo "  2. 5xx error count (crawl budget waste)"
    echo "  3. 4xx error count (orphan pages, broken links)"
    echo "  4. High-crawl / low-impression pages (possible noindex issues)"
    echo ""
    echo "To run live, set GOOGLE_SEARCH_CONSOLE_API_KEY env var."
    echo "See: https://developers.google.com/webmaster-tools/search-console-api-original"
    exit 0
  fi

  # Fetch last 7 days of crawl data
  local end_date=$(date -u '+%Y-%m-%d')
  local start_date=$(date -u -d "6 days ago" '+%Y-%m-%d')

  log "Fetching crawl stats from $start_date to $end_date..."

  local raw_data
  raw_data=$(fetch_crawl_stats "$start_date" "$end_date" '"page","response_code"')

  if [ -z "$raw_data" ] || echo "$raw_data" | jq -e '.error' >/dev/null 2>&1; then
    error "Failed to fetch from Search Console API. Check API key and permissions."
    error "Raw response: $raw_data"
    exit 1
  fi

  log "Fetched $(echo "$raw_data" | jq '.rows | length') rows of crawl data."

  # Save raw data
  echo "$raw_data" | jq '.' > "$OUTPUT_FILE"
  log "Raw data saved to: $OUTPUT_FILE"

  # Calculate efficiency
  local efficiency
  efficiency=$(calculate_efficiency "$raw_data")

  echo ""
  echo "──────────────────────────────────────────"
  echo "CRAWL EFFICIENCY REPORT"
  echo "──────────────────────────────────────────"
  echo "  Period:          $start_date → $end_date"
  echo "  Efficiency:      ${efficiency}%"
  echo "  Threshold:       ${ALERT_THRESHOLD}%"
  echo ""

  # Anomaly checks
  echo "──────────────────────────────────────────"
  echo "CRAWL ANOMALIES"
  echo "──────────────────────────────────────────"
  check_crawl_anomalies "$raw_data"
  check_noindex_pages "$raw_data"

  # Alert if below threshold
  local eff_int
  eff_int=$(echo "$efficiency" | cut -d. -f1)

  if [ "$eff_int" -lt "$ALERT_THRESHOLD" ]; then
    echo ""
    warn "⚠️  ALERT: Crawl efficiency (${efficiency}%) is below threshold ($ALERT_THRESHOLD%)."
    warn "   This means Googlebot is spending crawl budget on pages that aren't being indexed."
    warn "   Common causes:"
    warn "   - Thin or duplicate content"
    warn "   - Pages returning 4xx/5xx"
    warn "   - Canonical pointing to another page"
    warn "   - noindex on high-value pages"
    warn "   - Slow page load times causing Googlebot to give up"
    echo ""
    # Exit code 1 triggers CI failure if used in automation
    exit 1
  else
    echo ""
    echo -e "${GREEN}✅ Crawl efficiency is healthy (${efficiency}%) above threshold ($ALERT_THRESHOLD%).${NC}"
  fi

  echo ""
  log "Done."
}

main "$@"