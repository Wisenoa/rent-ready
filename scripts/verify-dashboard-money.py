#!/usr/bin/env python3
"""
Verify the dashboard money fix against a live server + database.

1. Creates revenue (a PAID payment of 850.10) and an expense of 120.05.
2. Reads the real dashboard summary API as the owner.
3. Asserts the reported money is exact 2dp — the pre-fix code produced
   730.0500000000001 for NOI.

Requires: dev server on :3111, migrated DB, and a user audita@test.io
(create it with scripts/smoke-golden-path.py).
"""
import json
import re
import subprocess
import sys

B = "http://localhost:3111"
JAR = "/tmp/auditA.jar"

def _load_env():
    """Export .env so the `node` children below can reach the database.

    CI sets DATABASE_URL in the environment; a local shell usually does not. Without
    this the child fails with a Prisma "DatabaseNotReachable" stack trace, which
    reads like a product bug rather than a missing variable.
    """
    import os
    import re as _re

    path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
    if not os.path.exists(path):
        return
    for line in open(path):
        m = _re.match(r"^([A-Z_][A-Z0-9_]*)=(.*)$", line.strip())
        if m and not os.environ.get(m.group(1)):
            os.environ[m.group(1)] = m.group(2).strip().strip('"').strip("'")


_load_env()

ROOT = __import__("os").path.dirname(__import__("os").path.dirname(
    __import__("os").path.abspath(__file__)))


def curl(*args):
    return subprocess.run(["curl", "-s", *args], capture_output=True, text=True).stdout


def post(path, payload):
    raw = curl("-b", JAR, "-X", "POST", f"{B}{path}",
               "-H", "Content-Type: application/json", "-d", json.dumps(payload))
    try:
        return json.loads(raw)
    except Exception:
        raise SystemExit(f"POST {path} failed: {raw[:200]}")


def node(script, *args):
    return subprocess.run(["node", "-e", script, *args],
                          capture_output=True, text=True, cwd=ROOT)


ENV_LOAD = r"""
// DATABASE_URL is inherited from the environment (CI sets it, and
// ci-local.sh exports it). Reading .env here broke in CI, where .env
// does not exist because it is gitignored.
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
"""

prop = post("/api/properties", {
    "name": "Bien Money", "type": "APARTMENT",
    "addressLine1": "9 rue money", "city": "Paris", "postalCode": "75001",
})["data"]
ten = post("/api/tenants", {
    "firstName": "Money", "lastName": "Test", "email": "money@test.io",
    "addressLine1": "8 rue money", "city": "Paris", "postalCode": "75001",
})["data"]
lease = post("/api/leases", {
    "propertyId": prop["id"], "tenantId": ten["id"],
    "rentAmount": 850.10, "chargesAmount": 0, "depositAmount": 850.10,
    "startDate": "2026-09-01", "paymentDay": 1, "paymentMethod": "TRANSFER",
})["data"]
pay = post("/api/payments", {
    "leaseId": lease["id"], "amount": 850.10,
    "periodStart": "2026-09-01", "periodEnd": "2026-09-30",
    "dueDate": "2026-09-01", "paymentMethod": "TRANSFER",
})["data"]
print(f"revenue created : {pay['amount']} (status={pay['status']})")

r = node(ENV_LOAD + r"""
(async () => {
  const u = await prisma.user.findFirst({ where: { email: "audita@test.io" }, select: { id: true } });
  if (!u) { console.error("no user audita@test.io"); process.exit(2); }
  await prisma.expense.create({ data: {
    userId: u.id, propertyId: process.argv[1], vendorName: "Money Test",
    amount: "120.05", category: "MAINTENANCE", date: new Date("2026-09-15"),
  }});
  console.log("expense created: 120.05");
  await prisma.$disconnect();
})();
""", prop["id"])
print(r.stdout.strip() or r.stderr[:300])

stats = curl("-b", JAR, f"{B}/api/dashboard/summary")
try:
    parsed = json.loads(stats)
    data = parsed.get("data", parsed)
except Exception:
    raise SystemExit(f"dashboard summary unreadable: {stats[:200]}")

# The NOI/revenue figures come from getDashboardStats, which the dashboard PAGE
# consumes (the /api/dashboard/summary route returns a different, simpler shape).
# Assert against the rendered page so we test the real path.
html = curl("-b", JAR, f"{B}/dashboard")
if len(html) < 1000:
    raise SystemExit("dashboard page did not render")

# Every euro figure a user can read must have exactly 2 decimals.
euro = re.findall(r"(\d[\d\s\u202f\u00a0]*,\d+)\s*€", html)
bad_euro = [e for e in euro if len(e.split(",")[-1].strip()) != 2]
print(f"\ndashboard page: {len(euro)} euro figures rendered, "
      f"{len(bad_euro)} with wrong precision")
noi_i = html.find("NOI")
noi_ctx = ""
if noi_i > 0:
    noi_ctx = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html[noi_i:noi_i + 400])).strip()[:160]
    print("NOI row:", noi_ctx)

summary_fields = {
    "total_outstanding": data.get("total_outstanding"),
    "total_collected_this_month": data.get("total_collected_this_month"),
}
print("summary api:", json.dumps(summary_fields))

r = node(r"""
const Decimal = require("decimal.js");
console.log("  reference: old `-` on Decimal ->", String(new Decimal("850.10") - new Decimal("120.05")));
console.log("  reference: decimal.js helpers  ->", String(new Decimal(0).plus("850.10").minus("120.05").toDecimalPlaces(2).toNumber()));
""")
print(r.stdout.strip())

problems = []
if bad_euro:
    problems.append(f"euro figures with wrong precision: {bad_euro[:5]}")
for label, v in summary_fields.items():
    # Only a fractional part can be over-precise: 720 (an integer) is fine,
    # 720.005 is not. Checking split(".")[-1] alone flagged every whole number.
    if v is None:
        continue
    text = str(v)
    if "." in text and len(text.split(".")[-1]) > 2:
        problems.append(f"{label}={v}")

if problems:
    print("\nFAIL -", "; ".join(problems))
    sys.exit(1)
print("\nPASS - dashboard money renders at exact 2dp (no 730.0500000000001).")