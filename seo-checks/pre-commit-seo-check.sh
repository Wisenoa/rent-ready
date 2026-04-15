#!/usr/bin/env bash
# pre-commit-seo-check.sh — Run SEO checks before committing
# Install: copy to .git/hooks/pre-commit and chmod +x
# Or use: git config core.hooksPath seo-checks/hooks

set -e

MARKETING_PATTERN="src/app/\(marketing\)/"

# Check if any marketing files are being committed
changed_files=$(git diff --cached --name-only --diff-filter=ACM)
marketing_changed=$(echo "$changed_files" | grep -E "$MARKETING_PATTERN" || true)

if [ -z "$marketing_changed" ]; then
  echo "✅ No marketing pages changed — skipping SEO checks"
  exit 0
fi

echo "🔍 SEO pre-commit checks..."
echo "   Marketing files staged:"
echo "$marketing_changed" | sed 's/^/     /'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

failed=0

# 1. Meta tag validation
echo ""
echo "📋 Checking metadata exports..."
node "$PROJECT_DIR/seo-checks/meta-validator.js" --json 2>&1 | grep -q '"passed": true' || {
  node "$PROJECT_DIR/seo-checks/meta-validator.js"
  echo "❌ Metadata validation failed"
  failed=1
}

# 2. SEO lint checks
echo ""
echo "🔍 Running SEO lint..."
node "$PROJECT_DIR/seo-checks/seo-lint.js" --json 2>&1 | grep -q '"passed": true' || {
  node "$PROJECT_DIR/seo-checks/seo-lint.js"
  echo "❌ SEO lint failed"
  failed=1
}

# 3. Schema validation
echo ""
echo "📋 Checking JSON-LD schemas..."
node "$PROJECT_DIR/seo-checks/schema-validator.js" --json 2>&1 | grep -q '"passed": true' || {
  node "$PROJECT_DIR/seo-checks/schema-validator.js"
  echo "❌ Schema validation failed"
  failed=1
}

# 4. Link check (only changed files)
echo ""
echo "🔗 Checking links..."
node "$PROJECT_DIR/seo-checks/link-checker.js" --only-changed --base-url=http://localhost:3000 --fail-on-internal 2>&1 || {
  echo "❌ Broken link check failed"
  failed=1
}

if [ $failed -ne 0 ]; then
  echo ""
  echo "❌ SEO pre-commit check failed. Fix errors before committing."
  echo "   Run individually: node seo-checks/meta-validator.js"
  echo "                     node seo-checks/seo-lint.js"
  echo "                     node seo-checks/schema-validator.js"
  exit 1
fi

echo ""
echo "✅ All SEO checks passed"
exit 0
