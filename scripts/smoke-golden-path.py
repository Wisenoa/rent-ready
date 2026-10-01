#!/usr/bin/env python3
"""Golden-path + tenant-isolation smoke test against a running dev server."""
import json
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _loadenv import load_env  # noqa: E402

load_env()

B = os.environ.get("BASE", "http://localhost:3111")


def curl(*args):
    r = subprocess.run(["curl", "-s", *args], capture_output=True, text=True)
    return r.stdout


def jload(s):
    try:
        return json.loads(s)
    except Exception:
        return {"_raw": s[:200]}


def post(jar, path, payload):
    return jload(curl(
        "-b", jar, "-X", "POST", f"{B}{path}",
        "-H", "Content-Type: application/json",
        "-d", json.dumps(payload),
    ))


def get(jar, path):
    return jload(curl("-b", jar, f"{B}{path}"))


def ensure_user(user):
    """Sign up, or sign in if the account already exists. Idempotent so the
    script can be re-run against the same database."""
    creds = {
        "email": f"{user}@test.io", "password": "Password123!",
        "name": user, "firstName": user, "lastName": "T",
    }
    out = jload(curl(
        "-X", "POST", f"{B}/api/auth/sign-up/email",
        "-H", "Content-Type: application/json",
        "-d", json.dumps(creds), "-c", f"/tmp/{user}.jar",
    ))
    if out.get("user"):
        return "signup"
    if out.get("code") == "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL":
        out = jload(curl(
            "-X", "POST", f"{B}/api/auth/sign-in/email",
            "-H", "Content-Type: application/json",
            "-d", json.dumps({"email": creds["email"], "password": creds["password"]}),
            "-c", f"/tmp/{user}.jar",
        ))
        return "signin" if out.get("token") or out.get("user") else f"FAILED {out}"
    return f"FAILED {out}"


for user in ("auditA", "auditB"):
    print(f"{user}: {ensure_user(user)}")

A, Bjar = "/tmp/auditA.jar", "/tmp/auditB.jar"

prop = post(A, "/api/properties", {
    "name": "Bien A", "type": "APARTMENT",
    "addressLine1": "1 Rue A", "city": "Paris", "postalCode": "75001",
})["data"]
print("property:", prop["id"])

ten = post(A, "/api/tenants", {
    "firstName": "Alice", "lastName": "A", "email": "alice@test.io",
    "addressLine1": "2 Rue A", "city": "Paris", "postalCode": "75001",
})["data"]
print("tenant:", ten["id"])

lease = post(A, "/api/leases", {
    "propertyId": prop["id"], "tenantId": ten["id"],
    "rentAmount": 850, "chargesAmount": 50, "depositAmount": 850,
    "startDate": "2026-09-01", "paymentDay": 1, "paymentMethod": "TRANSFER",
})["data"]
print("lease:", lease["id"])

tx = post(A, "/api/payments", {
    "leaseId": lease["id"], "amount": 900,
    "periodStart": "2026-09-01", "periodEnd": "2026-09-30",
    "dueDate": "2026-09-01", "paymentMethod": "TRANSFER",
})["data"]
print(f"payment: status={tx['status']} split={tx['rentPortion']}/{tx['chargesPortion']} "
      f"full={tx['isFullPayment']} receipt={tx['receiptType']}")

partial = post(A, "/api/payments", {
    "leaseId": lease["id"], "amount": 400,
    "periodStart": "2026-10-01", "periodEnd": "2026-10-31",
    "dueDate": "2026-10-01", "paymentMethod": "TRANSFER",
})["data"]
print(f"partial: status={partial['status']} split={partial['rentPortion']}/{partial['chargesPortion']} "
      f"receipt={partial['receiptType']}")

with open("/tmp/ids2.txt", "w") as f:
    f.write(f"PROP={prop['id']}\nTEN={ten['id']}\nLEASE={lease['id']}\nTX={tx['id']}\n")

print("\n--- cross-tenant isolation (user B vs user A's data) ---")
ids = dict(
    line.split("=") for line in open("/tmp/ids2.txt").read().strip().split("\n")
)
checks = [
    ("read property", f"/api/properties/{ids['PROP']}"),
    ("read tenant", f"/api/tenants/{ids['TEN']}"),
    ("read lease", f"/api/leases/{ids['LEASE']}"),
    ("read payment", f"/api/payments/{ids['TX']}"),
    ("read receipt", f"/api/transactions/{ids['TX']}/receipt"),
    ("list lease payments", f"/api/leases/{ids['LEASE']}/payments"),
]
ok = True
for label, path in checks:
    raw = curl("-b", Bjar, f"{B}{path}")
    code = subprocess.run(
        ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-b", Bjar, f"{B}{path}"],
        capture_output=True, text=True).stdout
    leaked = "cmupth" in raw or "Alice" in raw
    status = "LEAK!" if leaked else ("BLOCKED" if code in ("403", "404") else f"HTTP {code}")
    if leaked or code not in ("403", "404"):
        ok = False
    print(f"  {label:22} -> {status}")

raw = curl("-b", Bjar, "-X", "PATCH", f"{B}/api/payments/{ids['TX']}",
           "-H", "Content-Type: application/json", "-d", '{"amount":"9999.99"}')
code = subprocess.run(
    ["curl", "-s", "-o", "/dev/null", "-w", "%{http_code}", "-b", Bjar, "-X", "PATCH",
     f"{B}/api/payments/{ids['TX']}", "-H", "Content-Type: application/json",
     "-d", '{"amount":"9999.99"}'],
    capture_output=True, text=True).stdout
print(f"  {'mutate payment':22} -> HTTP {code} {raw[:40]}")

print("\nISOLATION:", "PASS" if ok and code in ("403", "404") else "FAIL")
sys.exit(0 if ok and code in ("403", "404") else 1)