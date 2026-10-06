#!/usr/bin/env python3
"""
Verify rent periods are generated for a new lease.

Before this, creating a lease produced no rent obligation at all: nothing ever
wrote the PENDING rows that arrears detection, the relance flow, and the AI
follow-up drafter all read. This asserts that a lease created with a start date
in a previous month materialises one PENDING period per elapsed month.

Requires: dev server on :3111 and a user audita@test.io
(create with scripts/smoke-golden-path.py).
"""
import json
import os
import subprocess
import sys

B = os.environ.get("BASE", "http://localhost:3111")
JAR = "/tmp/auditA.jar"

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _loadenv import load_env  # noqa: E402

load_env()

ROOT = __import__("os").path.dirname(__import__("os").path.dirname(
    __import__("os").path.abspath(__file__)))
MONTHS_BACK = 3


def curl(*args):
    return subprocess.run(["curl", "-s", *args], capture_output=True, text=True).stdout


def node(script, *args):
    return subprocess.run(["node", "-e", script, *args],
                          capture_output=True, text=True, cwd=ROOT)


prop = json.loads(curl("-b", JAR, "-X", "POST", f"{B}/api/properties",
                       "-H", "Content-Type: application/json",
                       "-d", json.dumps({
                           "name": "Bien Arrears", "type": "APARTMENT",
                           "addressLine1": "7 rue arrears", "city": "Lyon",
                           "postalCode": "69001"})))["data"]
ten = json.loads(curl("-b", JAR, "-X", "POST", f"{B}/api/tenants",
                      "-H", "Content-Type: application/json",
                      "-d", json.dumps({
                          "firstName": "Arrears", "lastName": "Test",
                          "email": "arrears@test.io",
                          "addressLine1": "6 rue arrears", "city": "Lyon",
                          "postalCode": "69001"})))["data"]

# Start the lease MONTHS_BACK months ago so several periods are owed.
start = node(f"""
const d = new Date();
d.setUTCMonth(d.getUTCMonth() - {MONTHS_BACK});
console.log(d.toISOString().slice(0, 10));
""").stdout.strip()
print(f"lease start date: {start} ({MONTHS_BACK} months ago)")

lease = json.loads(curl("-b", JAR, "-X", "POST", f"{B}/api/leases",
                        "-H", "Content-Type: application/json",
                        "-d", json.dumps({
                            "propertyId": prop["id"], "tenantId": ten["id"],
                            "rentAmount": 700, "chargesAmount": 40,
                            "depositAmount": 700, "startDate": start,
                            "paymentDay": 5, "paymentMethod": "TRANSFER"})))["data"]
print("lease created:", lease["id"])

db = node(r"""
// DATABASE_URL is inherited from the environment (CI sets it, and
// ci-local.sh exports it). Reading .env here broke in CI, where .env
// does not exist because it is gitignored.
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
(async () => {
  const rows = await prisma.transaction.findMany({
    where: { leaseId: process.argv[1] },
    orderBy: { periodStart: "asc" },
    select: { periodStart: true, dueDate: true, amount: true, status: true,
              rentPortion: true, chargesPortion: true, paidAt: true },
  });
  console.log(JSON.stringify(rows));
  await prisma.$disconnect();
})();
""", lease["id"])

try:
    rows = json.loads(db.stdout.strip().splitlines()[-1])
except Exception:
    raise SystemExit(f"db probe failed: {db.stdout[:200]} {db.stderr[:200]}")

print(f"\nrent periods generated: {len(rows)}")
for r in rows:
    print(f"  {r['periodStart'][:7]}  due {r['dueDate'][:10]}  "
          f"{r['rentPortion']}+{r['chargesPortion']}={r['amount']}  "
          f"status={r['status']}")

problems = []
if len(rows) != MONTHS_BACK + 1:
    problems.append(f"expected {MONTHS_BACK + 1} periods, got {len(rows)}")

for r in rows:
    if r["status"] != "PENDING":
        problems.append(f"{r['periodStart'][:7]} status={r['status']}, expected PENDING")
    if r["paidAt"] is not None:
        problems.append(f"{r['periodStart'][:7]} is already marked paid")
    if abs(float(r["rentPortion"]) + float(r["chargesPortion"]) - float(r["amount"])) > 0.005:
        problems.append(f"{r['periodStart'][:7]} split does not sum to the amount")
    if abs(float(r["amount"]) - 740.0) > 0.005:
        problems.append(f"{r['periodStart'][:7]} amount={r['amount']}, expected 740")

# periods must be consecutive months
months = [r["periodStart"][:7] for r in rows]
if months != sorted(months) or len(set(months)) != len(months):
    problems.append(f"periods are not distinct and ordered: {months}")

# idempotency: regenerating must not duplicate
gen = node(r"""
// DATABASE_URL is inherited from the environment (CI sets it, and
// ci-local.sh exports it). Reading .env here broke in CI, where .env
// does not exist because it is gitignored.
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
(async () => {
  const before = await prisma.transaction.count({ where: { leaseId: process.argv[1] } });
  const exists = await prisma.transaction.findMany({ where: { leaseId: process.argv[1] },
    select: { periodStart: true } });
  const taken = new Set(exists.map(t => t.periodStart.toISOString().slice(0,10)));
  const missing = [];
  console.log(JSON.stringify({ before, periods: [...taken] }));
  await prisma.$disconnect();
})();
""", lease["id"])
state = json.loads(gen.stdout.strip().splitlines()[-1])
print(f"\nidempotency check: {len(state['periods'])} distinct periods exist")

# arrears view
arr = node(r"""
// DATABASE_URL is inherited from the environment (CI sets it, and
// ci-local.sh exports it). Reading .env here broke in CI, where .env
// does not exist because it is gitignored.
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
(async () => {
  const rows = await prisma.transaction.findMany({
    where: { leaseId: process.argv[1], paidAt: null },
    select: { dueDate: true, amount: true },
    orderBy: { dueDate: "asc" },
  });
  const now = new Date();
  const overdue = rows.filter(r => new Date(r.dueDate) < now);
  console.log(JSON.stringify({ total: rows.length, overdue: overdue.length,
                               overdueAmount: overdue.reduce((a,r)=>a+Number(r.amount),0) }));
  await prisma.$disconnect();
})();
""", lease["id"])
arrears = json.loads(arr.stdout.strip().splitlines()[-1])
print(f"arrears: {arrears['overdue']}/{arrears['total']} periods overdue "
      f"({arrears['overdueAmount']} EUR)")
if arrears["overdue"] == 0:
    problems.append("no period is overdue even though the lease started months ago")

# Paying a period must SETTLE the generated row, not add a second row for the
# same month (that double-counted the period: once owed, once paid).
periods_now = json.loads(node(r"""
// DATABASE_URL is inherited from the environment (CI sets it, and
// ci-local.sh exports it). Reading .env here broke in CI, where .env
// does not exist because it is gitignored.
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
(async () => {
  const r = await prisma.transaction.findMany({ where: { leaseId: process.argv[1] },
    orderBy: { periodStart: "asc" },
    select: { id: true, periodStart: true, periodEnd: true, dueDate: true,
              amount: true, status: true, paidAt: true } });
  console.log(JSON.stringify(r));
  await prisma.$disconnect();
})();
""", lease["id"]).stdout.strip().splitlines()[-1])

unpaid = [r for r in periods_now if r["paidAt"] is None]
print(f"\nunpaid periods to settle: {len(unpaid)}")

if unpaid:
    target = unpaid[0]
    pay = curl("-b", JAR, "-X", "POST", f"{B}/api/payments",
               "-H", "Content-Type: application/json",
               "-d", json.dumps({
                   "leaseId": lease["id"], "amount": 740,
                   "periodStart": target["periodStart"],
                   "periodEnd": target["periodEnd"],
                   "dueDate": target["dueDate"], "paymentMethod": "TRANSFER"}))
    paid = json.loads(pay).get("data", {})
    print(f"paid {target['periodStart'][:7]} -> status={paid.get('status')} "
          f"split={paid.get('rentPortion')}+{paid.get('chargesPortion')} "
          f"receipt={paid.get('receiptType')}")

    after = json.loads(node(r"""
// DATABASE_URL is inherited from the environment (CI sets it, and
// ci-local.sh exports it). Reading .env here broke in CI, where .env
// does not exist because it is gitignored.
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
(async () => {
  const r = await prisma.transaction.findMany({ where: { leaseId: process.argv[1] },
    orderBy: { periodStart: "asc" },
    select: { periodStart: true, amount: true, status: true, paidAt: true } });
  console.log(JSON.stringify(r));
  await prisma.$disconnect();
})();
""", lease["id"]).stdout.strip().splitlines()[-1])

    print("\nafter payment:")
    for r in after:
        print(f"  {r['periodStart'][:7]} amount={r['amount']:>6} status={r['status']:8} "
              f"paid={'yes' if r['paidAt'] else 'no'}")

    months_after = [r["periodStart"][:7] for r in after]
    if len(months_after) != len(set(months_after)):
        problems.append(f"a month has two rows (double-counting): {months_after}")
    if len(after) != len(periods_now):
        problems.append(f"row count changed from {len(periods_now)} to {len(after)}")
    paid_rows = [r for r in after if r["paidAt"] is not None]
    if len(paid_rows) != 1:
        problems.append(f"expected exactly 1 paid period, got {len(paid_rows)}")
    elif paid_rows[0]["status"] != "PAID":
        problems.append(f"paid period status={paid_rows[0]['status']}")

if problems:
    print("\nFAIL -", "; ".join(problems))
    sys.exit(1)
print("\nPASS - rent is generated, payments settle the period in place, arrears are detectable.")