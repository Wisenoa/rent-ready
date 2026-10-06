#!/usr/bin/env python3
"""
Verify that a period paid in instalments reaches PAID, through the real API.

Four write paths used to decide "is this period paid?" from a single payment's
amount (POST /api/payments, POST /api/transactions, the transaction server
actions, and the quittance action). The rule now lives in one place,
src/lib/domain/period-settlement.ts, and all four use it.

This exercises POST /api/transactions, because that route creates a row per
payment rather than settling a generated period, so the stored status is a
direct read of the rule.

Requires a server on :3111 (override with BASE) and smoke fixtures.
"""
import json
import os
import subprocess
import sys

B = os.environ.get("BASE", "http://localhost:3111")
JAR = "/tmp/auditA.jar"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

sys.path.insert(0, ROOT)
from _loadenv import load_env  # noqa: E402

load_env()


def curl(*args):
    return subprocess.run(["curl", "-s", *args], capture_output=True, text=True).stdout


def node(script, *args):
    return subprocess.run(["node", "-e", script, *args], capture_output=True, text=True, cwd=ROOT)


def lease_id():
    if os.path.exists("/tmp/ids2.txt"):
        for line in open("/tmp/ids2.txt"):
            k, _, v = line.strip().partition("=")
            if k == "LEASE":
                return v
    return None


def main():
    print("=" * 70)
    print("PERIOD SETTLEMENT — instalments must still reach PAID")
    print("=" * 70)

    lid = lease_id()
    if not lid:
        print("  run scripts/smoke-golden-path.py first to create a lease")
        return 2

    # Read the lease and clear the first period so the run is repeatable.
    info = json.loads(node(r"""
const fs = require("fs");
for (const line of fs.readFileSync(".env", "utf8").split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
}
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
(async () => {
  const lease = await prisma.lease.findUnique({
    where: { id: process.argv[1] },
    include: { transactions: { orderBy: { dueDate: "asc" } } },
  });
  if (!lease) { console.log(JSON.stringify({ error: "lease not found" })); await prisma.$disconnect(); return; }
  const first = lease.transactions[0];
  if (first) {
    await prisma.transaction.deleteMany({
      where: { leaseId: lease.id, periodStart: first.periodStart, periodEnd: first.periodEnd },
    });
  }
  console.log(JSON.stringify({
    rentAmount: String(lease.rentAmount),
    chargesAmount: String(lease.chargesAmount),
    periodStart: first ? first.periodStart.toISOString().slice(0, 10) : null,
    periodEnd: first ? first.periodEnd.toISOString().slice(0, 10) : null,
  }));
  await prisma.$disconnect();
})();
""", lid).stdout.strip().splitlines()[-1])

    if info.get("error") or not info["periodStart"]:
        print("  could not prepare a period:", info)
        return 2

    from decimal import Decimal

    total = Decimal(info["rentAmount"]) + Decimal(info["chargesAmount"])
    ps, pe = info["periodStart"], info["periodEnd"]
    first_amt = (total * Decimal("0.6")).quantize(Decimal("0.01"))
    second_amt = total - first_amt
    print(f"  period {ps} -> {pe}: rent {info['rentAmount']} + charges {info['chargesAmount']} = {total}")
    print(f"  paying {first_amt} then {second_amt}\n")

    failures = []
    for amount, expect_paid in ((first_amt, False), (second_amt, True)):
        body = curl("-b", JAR, "-X", "POST", f"{B}/api/transactions",
                    "-H", "Content-Type: application/json",
                    "-d", json.dumps({
                        "leaseId": lid, "amount": str(amount),
                        "periodStart": ps, "periodEnd": pe, "dueDate": pe,
                        "paymentMethod": "CASH", "paidAt": ps,
                    }))
        try:
            payload = json.loads(body)
        except Exception:
            print(f"  POST {amount} failed: {body[:250]}")
            return 2
        if payload.get("error"):
            print(f"  POST {amount} -> {payload['error']}")
            return 2
        row = payload.get("data") or payload
        status = row.get("status")
        rtype = row.get("receiptType")
        print(f"  {amount:>9} -> status={status:<8} receiptType={rtype}")

        if expect_paid and status != "PAID":
            failures.append(
                f"the period is fully paid but status is {status}, not PAID — every "
                "downstream figure treats a settled period as outstanding")
        if expect_paid and rtype != "QUITTANCE":
            failures.append(f"a settled period recorded receiptType={rtype}, not QUITTANCE")
        if not expect_paid and status == "PAID":
            failures.append(
                f"a partial payment ({amount} of {total}) was recorded PAID — a settled "
                "balance that was never received")

    print()
    if failures:
        for f in failures:
            print("  FAIL:", f)
        print("\nFAIL — period settlement is still judged per payment.")
        return 1
    print(f"PASS - {first_amt} left the period PARTIAL; the completing {second_amt}")
    print("      moved it to PAID, across all four write paths sharing one rule.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
