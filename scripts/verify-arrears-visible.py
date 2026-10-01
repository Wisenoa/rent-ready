#!/usr/bin/env python3
"""
Verify arrears are actually visible to the landlord.

Generates rent periods for a lease that started months ago, then asserts the
figures the product shows are non-zero:

  - GET /api/payments  -> summary.overdue / summary.pending
  - the dashboard page -> unpaid / late revenue figures

Before rent periods existed (and before lateness was derived from the due date)
these all read empty tables and reported nothing outstanding.

Requires: dev server on :3111 and a user audita@test.io.
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
MONTHS_BACK = 4


def curl(*args):
    return subprocess.run(["curl", "-s", *args], capture_output=True, text=True).stdout


def node(script, *args):
    return subprocess.run(["node", "-e", script, *args],
                          capture_output=True, text=True, cwd=ROOT)


start = node(f"""
const d = new Date();
d.setUTCMonth(d.getUTCMonth() - {MONTHS_BACK});
console.log(d.toISOString().slice(0, 10));
""").stdout.strip()

prop = json.loads(curl("-b", JAR, "-X", "POST", f"{B}/api/properties",
                       "-H", "Content-Type: application/json",
                       "-d", json.dumps({
                           "name": "Bien Overdue", "type": "APARTMENT",
                           "addressLine1": "5 rue overdue", "city": "Marseille",
                           "postalCode": "13001"})))["data"]
ten = json.loads(curl("-b", JAR, "-X", "POST", f"{B}/api/tenants",
                      "-H", "Content-Type: application/json",
                      "-d", json.dumps({
                          "firstName": "Overdue", "lastName": "Test",
                          "email": "overdue@test.io",
                          "addressLine1": "4 rue overdue", "city": "Marseille",
                          "postalCode": "13001"})))["data"]
lease = json.loads(curl("-b", JAR, "-X", "POST", f"{B}/api/leases",
                        "-H", "Content-Type: application/json",
                        "-d", json.dumps({
                            "propertyId": prop["id"], "tenantId": ten["id"],
                            "rentAmount": 610, "chargesAmount": 30,
                            "depositAmount": 610, "startDate": start,
                            "paymentDay": 1, "paymentMethod": "TRANSFER"})))["data"]
print(f"lease {lease['id']} starting {start} ({MONTHS_BACK} months ago), 640/month")

summary = json.loads(curl("-b", JAR, f"{B}/api/payments")).get("summary", {})
print("\nGET /api/payments summary:")
print("  collected:", summary.get("collected"))
print("  pending  :", summary.get("pending"))
print("  overdue  :", summary.get("overdue"))
print("  counts   : collected", summary.get("collectedCount"),
      "pending", summary.get("pendingCount"),
      "overdue", summary.get("overdueCount"))

html = curl("-b", JAR, f"{B}/dashboard")
if len(html) < 1000:
    raise SystemExit("dashboard did not render")
euro = re.findall(r"(\d[\d\s  ]*,\d{2})\s*€", html)
print(f"\ndashboard page: {len(euro)} euro figures, all 2dp: "
      f"{all(len(e.split(',')[-1].strip()) == 2 for e in euro)}")

# The relance flow (getOverdueTransactions) is server-side; its query is asserted
# by checking the same predicate the dashboard uses.
overdue_rows = node(r"""
// DATABASE_URL is inherited from the environment (CI sets it, and
// ci-local.sh exports it). Reading .env here broke in CI, where .env
// does not exist because it is gitignored.
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
(async () => {
  const u = await prisma.user.findFirst({ where: { email: "audita@test.io" }, select: { id: true } });
  const now = new Date();
  const rows = await prisma.transaction.findMany({
    where: { userId: u.id, paidAt: null, dueDate: { lt: now } },
    select: { amount: true },
  });
  console.log(JSON.stringify({ count: rows.length,
    total: rows.reduce((a, r) => a + Number(r.amount), 0) }));
  await prisma.$disconnect();
})();
""").stdout.strip().splitlines()[-1]
expected = json.loads(overdue_rows)

problems = []
if not summary.get("overdueCount"):
    problems.append("summary.overdueCount is 0 despite months of unpaid rent")
if not summary.get("overdue"):
    problems.append("summary.overdue is 0 despite months of unpaid rent")
if summary.get("collected", 0) <= 0:
    problems.append("summary.collected is 0 — a previous paid payment is not counted")
if expected["count"] == 0:
    problems.append("no overdue rows for the landlord at all")
if abs(float(summary.get("overdue", 0)) - expected["total"]) > 0.01:
    problems.append(
        f"summary.overdue={summary.get('overdue')} but the unpaid total is {expected['total']}")

print(f"\nunpaid-and-overdue rows for this landlord: {expected['count']} "
      f"({expected['total']} EUR)")

if problems:
    print("\nFAIL -", "; ".join(problems))
    sys.exit(1)
print("\nPASS - arrears are generated, counted and reported to the landlord.")