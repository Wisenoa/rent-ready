#!/usr/bin/env python3
"""
Verify a generated quittance is a real, persisted document.

Checks that POSTing to /api/transactions/<id>/receipt:
  - returns success only when a Document row actually exists
  - no longer returns a `minio://placeholder/...` URL (the fake-success bug)
  - leaves a downloadable Document record

Requires: dev server on :3111 and a user audita@test.io
(create with scripts/smoke-golden-path.py).
"""
import json
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


def node(script, *args):
    return subprocess.run(["node", "-e", script, *args],
                          capture_output=True, text=True, cwd=ROOT)


ids = {}
for line in open("/tmp/ids2.txt"):
    k, v = line.strip().split("=")
    ids[k] = v

tx = ids["TX"]
print(f"using transaction {tx}")

resp = curl("-b", JAR, "-X", "POST", f"{B}/api/transactions/{tx}/receipt")
try:
    body = json.loads(resp)
except Exception:
    raise SystemExit(f"unreadable response: {resp[:300]}")

print("POST /receipt ->")
print("  success      :", body.get("success", "(no success field)"))
print("  receiptType  :", body.get("receiptType"))
print("  receiptNumber:", body.get("receiptNumber"))
url = body.get("receiptUrl", "")
print("  receiptUrl   :", url or "(none)")

problems = []
if "placeholder" in url:
    problems.append("receiptUrl is still a minio://placeholder/... fake URL")
if not body.get("receiptNumber"):
    problems.append("no receiptNumber assigned")

count = node(r"""
// DATABASE_URL is inherited from the environment (CI sets it, and
// ci-local.sh exports it). Reading .env here broke in CI, where .env
// does not exist because it is gitignored.
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
(async () => {
  const docs = await prisma.document.findMany({ orderBy: { createdAt: "desc" }, take: 5 });
  const t = await prisma.transaction.findUnique({
    where: { id: process.argv[1] },
    select: { receiptUrl: true, receiptNumber: true, receiptType: true },
  });
  console.log(JSON.stringify({ docs, tx: t }));
  await prisma.$disconnect();
})();
""", tx)

try:
    state = json.loads(count.stdout.strip().splitlines()[-1])
except Exception:
    raise SystemExit(f"db probe failed: {count.stdout[:200]} {count.stderr[:200]}")

docs = state.get("docs") or []
txrow = state.get("tx") or {}
print("\ndatabase state:")
print("  Document rows (latest):", len(docs))
for d in docs[:3]:
    print(f"    - {d['type']:14} {d['fileName']:22} {d['fileSize']} bytes  {d['fileUrl'][:60]}")
print("  Transaction.receiptUrl   :", txrow.get("receiptUrl"))
print("  Transaction.receiptNumber:", txrow.get("receiptNumber"))

# The decisive check: fetch the bytes and confirm it is a real PDF.
if docs:
    import os
    tmp_pdf = "/tmp/rr-receipt.pdf"
    dl = subprocess.run(
        ["curl", "-s", "-o", tmp_pdf, "-w", "%{http_code}",
         "-b", JAR, f"{B}/api/documents/{docs[0]['id']}"],
        capture_output=True, text=True).stdout.strip()
    size = os.path.getsize(tmp_pdf) if os.path.exists(tmp_pdf) else 0
    with open(tmp_pdf, "rb") as f:
        magic = f.read(5)
    print(f"\ndownload: HTTP {dl}, {size} bytes, magic={magic!r}")
    if dl != "200":
        problems.append(f"downloading the receipt returned HTTP {dl}")
    elif magic != b"%PDF-":
        problems.append(f"downloaded bytes are not a PDF (magic={magic!r})")
    elif size < 1000:
        problems.append(f"downloaded PDF is suspiciously small ({size} bytes)")

if not docs:
    problems.append("no Document row was written — the PDF is not retrievable")
else:
    pdfs = [d for d in docs if d["mimeType"] == "application/pdf"]
    if not pdfs:
        problems.append("Document rows exist but none is a PDF")
    elif all(d["fileSize"] <= 0 for d in pdfs):
        problems.append("stored PDF has zero bytes")

if problems:
    print("\nFAIL -", "; ".join(problems))
    sys.exit(1)
print("\nPASS - the quittance is a real, persisted PDF document.")