#!/usr/bin/env python3
"""
Verify that a rent period settled in instalments yields a QUITTANCE on the
payment that completes it.

The defect this guards: the receipt type was decided from the current payment's
amount alone, so a tenant paying 740 EUR in two parts could never obtain a
quittance — 400 -> RECU and the completing 340 -> RECU again, though the period
was then settled in full. A quittance is a legal document (loi du 6 juillet 1989,
art. 21), so withholding it after the money has arrived is a compliance failure.

Follows the conventions of verify-receipt.py: curl for HTTP, node for the
database, ids read from /tmp/ids2.txt (written by smoke-golden-path.py).

Requires a server on :3111 and the smoke fixtures.
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

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LEASE = os.environ.get("LEASE_ID")

RENT, CHARGES = 700, 40
TOTAL = RENT + CHARGES


def curl(*args):
    return subprocess.run(["curl", "-s", *args], capture_output=True, text=True).stdout


def node(script, *args):
    r = subprocess.run(["node", "-e", script, *args], capture_output=True, text=True, cwd=ROOT)
    return r


def main():
    print("=" * 68)
    print("RECEIPT CUMULATIVITY — instalments must still produce a quittance")
    print("=" * 68)

    # Use the lease the smoke script created, whatever its rent: the instalments
    # are scaled to that lease's own total, so the test does not depend on a
    # fixture value.
    lease_id = LEASE
    if not lease_id:
        if not os.path.exists("/tmp/ids2.txt"):
            print("  run scripts/smoke-golden-path.py first to create a lease")
            return 2
        for line in open("/tmp/ids2.txt"):
            k, _, v = line.strip().partition("=")
            if k == "LEASE":
                lease_id = v
                break
    if not lease_id:
        print("  no LEASE id available; run scripts/smoke-golden-path.py first")
        return 2

    # Reset the period so the test starts from a known state.
    period = node(r"""
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
  // Delete existing transactions for the first period so the test is repeatable.
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
""", lease_id)
    if period.returncode != 0:
        print("  node helper failed:", period.stderr[-400:])
        return 2
    info = json.loads(period.stdout.strip().splitlines()[-1])
    if info.get("error"):
        print(" ", info["error"])
        return 2
    if not info["periodStart"]:
        print("  lease has no rent period to test")
        return 2

    from decimal import Decimal
    rent = Decimal(str(info["rentAmount"]))
    charges = Decimal(str(info["chargesAmount"]))
    total = rent + charges
    # First instalment: most of the rent but not all. Second: whatever completes it.
    first_amount = (rent * Decimal("0.6")).quantize(Decimal("0.01"))
    second_amount = total - first_amount
    ps, pe = info["periodStart"], info["periodEnd"]
    print(f"  period {ps} -> {pe}, rent {rent} + charges {charges} = {total} EUR")
    print(f"  instalments: {first_amount} then {second_amount}")

    failures = []
    ids = []
    for amount in (first_amount, second_amount):
        body = curl("-b", JAR, "-X", "POST", f"{B}/api/transactions",
                    "-H", "Content-Type: application/json",
                    "-d", json.dumps({
                        "leaseId": lease_id, "amount": str(amount),
                        "periodStart": ps, "periodEnd": pe, "dueDate": pe,
                        "paymentMethod": "CASH", "status": "PARTIAL",
                    }))
        try:
            payload = json.loads(body)
            # The route wraps the row in { data: {...} }.
            tx = payload.get("data") or payload.get("transaction") or payload
            tid = tx.get("id")
        except Exception:
            print(f"  creating the {amount} payment failed: {body[:300]}")
            return 2
        if not tid:
            print(f"  no transaction id for the {amount} payment")
            return 2
        ids.append((amount, tid))
        print(f"  payment: {amount} EUR -> {tid[:16]}…")

    print(f"\n  cumulative paid: {sum(a for a, _ in ids)} EUR of {total} due")

    for amount, tid in ids:
        resp = curl("-b", JAR, "-X", "POST", f"{B}/api/transactions/{tid}/receipt")
        try:
            out = json.loads(resp)
        except Exception:
            print(f"  receipt for the {amount} payment: unreadable {resp[:200]}")
            failures.append(f"{amount}: receipt endpoint returned non-JSON")
            continue
        got = out.get("receiptType")
        print(f"    {amount:>4} EUR -> receiptType={got}  number={out.get('receiptNumber')}")

        is_last = amount == second_amount
        if is_last and got != "QUITTANCE":
            failures.append(
                f"the period is settled ({sum(a for a, _ in ids)} of {total}) but the "
                f"completing payment produced {got}, not QUITTANCE — the landlord is "
                "denied a legal receipt after being paid in full")
        if not is_last and got == "QUITTANCE":
            failures.append(
                f"a partial payment ({first_amount} of {total}) produced a QUITTANCE — a receipt "
                "was issued for a balance that was not paid")

    print()
    if failures:
        for f in failures:
            print("  FAIL:", f)
        print("\nFAIL — receipt cumulativeness is wrong.")
        return 1
    print("PASS - partial payment yields a partial receipt; the payment that completes")
    print("      the period yields a quittance, as loi du 6 juillet 1989 art. 21 requires.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
