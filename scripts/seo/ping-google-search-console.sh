#!/bin/bash
# ========================================
# Ping Google Search Console about sitemap updates
# ========================================
# Usage: ./ping-google-search-console.sh [sitemap_url]
# 
# Runs manually or via CI/CD (GitHub Actions scheduled).
# Set GOOGLE_SEARCH_CONSOLE_SITEMAP_URL env var for automatic use.
#
# Google ping endpoint: GET http://www.google.com/ping?sitemap=<url>
# Docs: https://developers.google.com/search/docs/crawling-indexing/sitemaps/monitor-validate-sitemaps

set -e

SITEMAP_URL="${1:-${GOOGLE_SEARCH_CONSOLE_SITEMAP_URL:-https://www.rentready.fr/sitemap.xml}}"

echo "============================================"
echo "Google Search Console — Sitemap Pinger"
echo "============================================"
echo "Sitemap URL: $SITEMAP_URL"
echo "Timestamp:   $(date -u '+%Y-%m-%dT%H:%M:%SZ')"
echo ""

# Validate URL
if [[ ! "$SITEMAP_URL" =~ ^https?:// ]]; then
  echo "❌ Error: Sitemap URL must be an absolute HTTP(S) URL"
  exit 1
fi

# URL-encode the sitemap URL for the Google ping endpoint
ENCODED_URL=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$SITEMAP_URL', safe=''))")

PING_URL="http://www.google.com/ping?sitemap=${ENCODED_URL}"

echo "Pinging: $PING_URL"
echo ""

# Make the ping request (Google doesn't return useful body, just check HTTP status)
HTTP_CODE=$(curl -sf \
  --max-time 15 \
  --retry 2 \
  --retry-delay 3 \
  -w "%{http_code}" \
  -o /tmp/ping-response.txt \
  "$PING_URL" 2>/dev/null || echo "000")

RESPONSE_BODY=$(cat /tmp/ping-response.txt 2>/dev/null | head -c 200 || echo "")

echo "HTTP Status: $HTTP_CODE"
echo "Response:    $RESPONSE_BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ Google has been notified of sitemap update"
  exit 0
elif [ "$HTTP_CODE" = "000" ]; then
  echo "⚠️  Could not reach Google (network timeout)"
  echo "    This is not critical — Google will still discover the sitemap on next crawl"
  echo "    or via the Search Console interface."
  exit 0
else
  echo "⚠️  Unexpected response from Google (HTTP $HTTP_CODE)"
  echo "    Response: $RESPONSE_BODY"
  exit 0
fi
