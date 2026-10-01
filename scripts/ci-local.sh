#!/usr/bin/env bash
# Reproduces .github/workflows/ci.yml locally, against a throwaway Postgres.
#
# Useful before pushing a change to CI: it runs the same steps in the same order
# so a failure here is the same failure GitHub Actions would report.
#
#   ./scripts/ci-local.sh
#
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

export PATH="$HOME/.nvm/versions/node/v22.16.0/bin:$PATH"

PG_NAME="rentready-ci-$$"
PG_PORT="${PG_PORT:-5499}"
export DATABASE_URL="postgresql://rentready:rentready@localhost:${PG_PORT}/rentready?schema=public"
export RESEND_API_KEY="re_ci_placeholder"
export BETTER_AUTH_SECRET="ci-secret-not-used-for-assertions"
export NEXT_PUBLIC_APP_URL="http://localhost:3111"
export PORT=3111

FAILED=()

step() { printf '\n\033[1m== %s\033[0m\n' "$1"; }
record() {
  if [ "$1" -eq 0 ]; then printf '   PASS: %s\n' "$2"
  else printf '   FAIL: %s\n' "$2"; FAILED+=("$2")
  fi
}

cleanup() {
  [ -n "${APP_PID:-}" ] && kill "$APP_PID" 2>/dev/null
  docker rm -f "$PG_NAME" >/dev/null 2>&1
}
trap cleanup EXIT

step "Postgres (throwaway container)"
docker run -d --name "$PG_NAME" \
  -e POSTGRES_USER=rentready -e POSTGRES_PASSWORD=rentready -e POSTGRES_DB=rentready \
  -p "${PG_PORT}:5432" postgres:16-alpine >/dev/null
for _ in $(seq 1 30); do nc -z localhost "$PG_PORT" 2>/dev/null && break; sleep 1; done
sleep 2
echo "   postgres up on ${PG_PORT}"

step "Install (--ignore-scripts, as CI does)"
PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 pnpm install --frozen-lockfile --ignore-scripts >/dev/null 2>&1
record $? "install"

step "Prisma generate"
pnpm prisma generate >/dev/null 2>&1
record $? "prisma generate"

step "Migrate from an empty database"
pnpm prisma migrate deploy 2>&1 | tail -3
record "${PIPESTATUS[0]}" "migrate deploy"

step "Lint"
pnpm lint >/tmp/ci-local-lint.log 2>&1
record $? "lint"

step "Type check (non-blocking in CI)"
pnpm tsc --noEmit >/tmp/ci-local-tsc.log 2>&1
echo "   tsc errors: $(grep -c 'error TS' /tmp/ci-local-tsc.log)"

step "Unit tests"
pnpm test >/tmp/ci-local-test.log 2>&1
record $? "unit tests"
grep -E "Test Files|Tests " /tmp/ci-local-test.log | sed 's/^/   /'

step "Build"
pnpm build >/tmp/ci-local-build.log 2>&1
record $? "build"
grep -E "✓ Generating|FATAL" /tmp/ci-local-build.log | tail -1 | sed 's/^/   /'

step "Start the app (production build)"
pnpm start >/tmp/ci-local-app.log 2>&1 &
APP_PID=$!
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:${PORT}/login || true)
  [ "$code" = "200" ] && { echo "   ready after ${i} tries"; break; }
  sleep 2
done

step "Runtime verification"
for s in smoke-golden-path verify-rent-generation verify-arrears-visible \
         verify-receipt verify-dashboard-money; do
  python3 "scripts/${s}.py" >"/tmp/ci-${s}.log" 2>&1
  record $? "$s"
done

printf '\n\033[1m== Summary ==\033[0m\n'
if [ ${#FAILED[@]} -eq 0 ]; then
  printf '   all steps passed\n'
  exit 0
fi
printf '   failed: %s\n' "${FAILED[*]}"
exit 1