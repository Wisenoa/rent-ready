/**
 * The tenant portal's receipt download, against real rows.
 *
 * `DownloadButton` in `src/app/portal/[token]/quittances.tsx` used to import
 * `@react-pdf/renderer` and `@/lib/quittance-generator` ON THE CLIENT and call
 * `pdf(<QuittancePDF data={…} />).toBlob()`. The file the tenant downloaded was
 * therefore a NEW rendering built from whatever figures the page carried — not
 * the `Document` RentReady archived. The tenant is the other party to that
 * document (loi du 6 juillet 1989, art. 21): a number or a template that moved
 * between the archiving and the click made the two copies diverge, and neither
 * proved which one made foi. The figures were correct (fixed in the parent card);
 * the RENDERING was not.
 *
 * It now downloads through
 * `/api/portal/[token]/transactions/[id]/receipt/download`, which resolves the
 * token's tenant in the query and serves `Document.content` verbatim.
 *
 * Two properties are worth real rows rather than a stub:
 *
 *  1. BYTES. The response has to be the persisted document, not a lookalike. That
 *     is a claim about bytes, so it is asserted on bytes — a hash of the body
 *     against a hash of what the database holds. Asserting on status 200 and a
 *     `%PDF-` prefix would also pass for a re-rendered document.
 *
 *  2. ISOLATION. The portal token is the tenant's only credential and this route
 *     is public: no session, both path segments from the URL. Another tenant's
 *     receipt must be UNREACHABLE, not merely hidden, and the refusal must be
 *     indistinguishable from an id that does not exist — otherwise the route is
 *     an oracle for enumerating payment ids.
 *
 * Real Prisma and a real PostgreSQL, because the point of these is what the
 * queries mean. `vitest.config.ts` loads `.env`, so a local `pnpm test` runs them
 * exactly as CI does rather than skipping SILENTLY.
 */

import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import Decimal from "decimal.js";

const DATABASE_URL = process.env.DATABASE_URL;
const describeDb = DATABASE_URL ? describe : describe.skip;
if (!DATABASE_URL) {
  console.warn(
    "[portal-receipt-download.db.test] SKIPPED: DATABASE_URL is unset. The " +
      "portal receipt download is NOT covered by this run — copy .env, or " +
      "export DATABASE_URL."
  );
}

const SUFFIX = `${Date.now().toString(36)}${Math.floor(Math.random() * 1e4)}`;
const ALICE = `portal-alice-${SUFFIX}`;
const BOB = `portal-bob-${SUFFIX}`;
const ALICE_TOKEN = `tok-alice-${SUFFIX}`;
const BOB_TOKEN = `tok-bob-${SUFFIX}`;
const EXPIRED_TOKEN = `tok-expired-${SUFFIX}`;

vi.mock("@/lib/auth", () => ({
  getCurrentUserId: async () => globalThis.__rrPortalSessionUserId,
}));
vi.mock("@/lib/receipt-number", () => ({
  allocateReceiptNumber: async (
    _userId: string,
    type: "QUITTANCE" | "RECU"
  ) => `${type === "QUITTANCE" ? "QUI" : "REC"}-${_userId.slice(-6)}`,
}));

declare global {
  var __rrPortalSessionUserId: string | undefined;
}
globalThis.__rrPortalSessionUserId = undefined;

const sha256 = (bytes: Uint8Array) => createHash("sha256").update(bytes).digest("hex");

describeDb("the portal receipt download, real rows", () => {
  const RENT = "710.40";
  const CHARGES = "90.10";
  const TOTAL = new Decimal(RENT).plus(CHARGES).toFixed(2); // 800.50

  let prisma: typeof import("@/lib/prisma").prisma;
  let downloadGET: typeof import("@/app/api/portal/[token]/transactions/[id]/receipt/download/route").GET;
  let NextRequest: typeof import("next/server").NextRequest;
  let recordRentPayment: typeof import("@/lib/services/rent-payments").recordRentPayment;
  let generateQuittance: typeof import("@/lib/actions/quittance-actions").generateQuittance;

  /** Alice: a paid payment with an archived receipt. */
  let aliceTransactionId = "";
  let aliceTenantId = "";
  /** Bob: a paid payment with an archived receipt. */
  let bobTransactionId = "";
  let bobTenantId = "";
  /** Alice: a paid payment deliberately left WITHOUT a receipt document. */
  let aliceUnarchivedId = "";

  const call = (token: string, id: string) =>
    downloadGET(new NextRequest("http://localhost/api"), {
      params: Promise.resolve({ token, id }),
    });

  beforeAll(async () => {
    prisma = (await import("@/lib/prisma")).prisma;
    ({ NextRequest } = await import("next/server"));
    downloadGET = (
      await import("@/app/api/portal/[token]/transactions/[id]/receipt/download/route")
    ).GET;
    ({ recordRentPayment } = await import("@/lib/services/rent-payments"));
    ({ generateQuittance } = await import("@/lib/actions/quittance-actions"));

    await prisma.user.createMany({
      data: [
        { id: ALICE, email: `portal-alice-${SUFFIX}@test.local`, name: "Alice", firstName: "Alice", lastName: "A", addressLine1: "1 rue A", city: "Paris", postalCode: "75001" },
        { id: BOB, email: `portal-bob-${SUFFIX}@test.local`, name: "Bob", firstName: "Bob", lastName: "B", addressLine1: "2 rue B", city: "Lyon", postalCode: "69001" },
      ],
    });

    /**
     * A landlord with one tenant, one active lease, and `payments` paid
     * instalments of the same month — the first archived as a receipt, so the
     * route has a `Document` to serve.
     */
    const mkLandlord = async (
      userId: string,
      label: string,
      token: string,
      paymentCount: number
    ) => {
      const property = await prisma.property.create({
        data: { userId, name: label, type: "APARTMENT", addressLine1: "3 rue P", city: "Lyon", postalCode: "69001" },
      });
      const tenant = await prisma.tenant.create({
        data: { userId, firstName: "Jean", lastName: "Dupont", addressLine1: "4 rue T", city: "Lyon", postalCode: "69002" },
      });
      const lease = await prisma.lease.create({
        data: {
          userId,
          propertyId: property.id,
          tenantId: tenant.id,
          startDate: new Date("2026-01-01T00:00:00.000Z"),
          endDate: new Date("2027-01-01T00:00:00.000Z"),
          rentAmount: RENT,
          chargesAmount: CHARGES,
          depositAmount: "0",
          status: "ACTIVE",
          leaseType: "UNFURNISHED",
          paymentDay: 1,
        },
      });

      const period = await prisma.transaction.create({
        data: {
          userId,
          leaseId: lease.id,
          amount: TOTAL,
          rentPortion: RENT,
          chargesPortion: CHARGES,
          periodStart: new Date("2026-10-01T00:00:00.000Z"),
          periodEnd: new Date("2026-10-31T00:00:00.000Z"),
          dueDate: new Date("2026-10-03T00:00:00.000Z"),
          status: "PENDING",
        },
      });

      const ids: string[] = [];
      for (let i = 0; i < paymentCount; i++) {
        const paid = await recordRentPayment({
          userId,
          leaseId: lease.id,
          duePeriodId: period.id,
          amount: i === 0 ? 300 : Number(TOTAL) - 300,
        });
        expect(paid.ok).toBe(true);
        ids.push(paid.ok ? paid.transactionId : "");
      }

      await prisma.tenantAccessToken.create({
        data: { tenantId: tenant.id, token, expiresAt: new Date(Date.now() + 86_400_000) },
      });

      return { tenantId: tenant.id, ids };
    };

    const alice = await mkLandlord(ALICE, "Bien Alice", ALICE_TOKEN, 2);
    aliceTenantId = alice.tenantId;
    aliceTransactionId = alice.ids[1];
    aliceUnarchivedId = alice.ids[0];

    const bob = await mkLandlord(BOB, "Bien Bob", BOB_TOKEN, 1);
    bobTenantId = bob.tenantId;
    bobTransactionId = bob.ids[0];

    // `generateQuittance` reads the AUTHENTICATED owner, so the session has to
    // hold the landlord whose receipt is being archived — it is a landlord
    // action, which is exactly why the portal route cannot fall back to it.
    globalThis.__rrPortalSessionUserId = ALICE;
    await generateQuittance(aliceTransactionId);
    globalThis.__rrPortalSessionUserId = BOB;
    await generateQuittance(bobTransactionId);
    globalThis.__rrPortalSessionUserId = undefined;

    // A token that exists but has expired: a leaked link must stop working.
    const stale = await prisma.tenant.create({
      data: { userId: ALICE, firstName: "Paul", lastName: "Perime", addressLine1: "9 rue Z", city: "Nice", postalCode: "06000" },
    });
    await prisma.tenantAccessToken.create({
      data: {
        tenantId: stale.id,
        token: EXPIRED_TOKEN,
        expiresAt: new Date(Date.now() - 60_000),
      },
    });
  });

  afterAll(async () => {
    if (!prisma) return;
    await prisma.user.deleteMany({ where: { id: { in: [ALICE, BOB] } } });
  });

  describe("the file the tenant receives", () => {
    it("is byte for byte the archived Document, not a fresh rendering", async () => {
      const stored = await prisma.document.findFirst({
        where: { transactionId: aliceTransactionId },
        select: { content: true, mimeType: true, fileName: true },
      });
      expect(stored?.content).toBeTruthy();

      const res = await call(ALICE_TOKEN, aliceTransactionId);
      expect(res.status).toBe(200);

      const bytes = new Uint8Array(await res.arrayBuffer());

      // The claim under test: same bytes. A hash is used rather than an equality
      // on two large buffers so a failure says WHERE they diverge.
      expect(sha256(bytes)).toBe(sha256(new Uint8Array(stored!.content!)));
      expect(bytes.length).toBe(stored!.content!.length);
      expect(res.headers.get("Content-Type")).toBe(stored!.mimeType);
      expect(res.headers.get("Content-Length")).toBe(String(bytes.length));
      expect(res.headers.get("Content-Disposition")).toBe(
        `attachment; filename="${stored!.fileName}"`
      );
      // A real PDF: a truncated body would otherwise reach the tenant as a file
      // their reader refuses to open.
      expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
    });

    it("serves what is stored, even when storage no longer matches a rendering", async () => {
      // The hash comparison above is only as strong as the difference between
      // "the stored bytes" and "what a renderer would produce". In this suite
      // `@react-pdf/renderer` is stubbed, and the stub bakes only the receipt
      // NUMBER into the page — so a re-render of the same payment would produce
      // byte-identical output and the hash test would stay green on the exact
      // defect this card is about. Writing a marker into the stored document
      // removes that ambiguity: any code path that renders, or that reads the
      // figures and rebuilds a file, returns something else.
      //
      // Restored in a `finally`, so a failure here cannot leave the fixture
      // altered for the other tests.
      const marker = Buffer.from("%PDF-1.4\n% archived-bytes-marker\n%%EOF\n", "latin1");
      const original = await prisma.document.findFirst({
        where: { transactionId: aliceTransactionId },
        select: { content: true },
      });

      try {
        await prisma.document.update({
          where: { transactionId: aliceTransactionId },
          data: { content: marker },
        });

        const res = await call(ALICE_TOKEN, aliceTransactionId);
        expect(res.status).toBe(200);

        const bytes = new Uint8Array(await res.arrayBuffer());
        expect(sha256(bytes)).toBe(sha256(new Uint8Array(marker)));
        expect(new TextDecoder("latin1").decode(bytes)).toContain("archived-bytes-marker");
      } finally {
        await prisma.document.update({
          where: { transactionId: aliceTransactionId },
          data: { content: original!.content },
        });
      }
    });

    it("serves the same bytes on a second download", async () => {
      const first = await call(ALICE_TOKEN, aliceTransactionId);
      const second = await call(ALICE_TOKEN, aliceTransactionId);

      expect(sha256(new Uint8Array(await first.arrayBuffer()))).toBe(
        sha256(new Uint8Array(await second.arrayBuffer()))
      );
    });

    it("does not re-render: the client holds no PDF code", async () => {
      // The defect was the MODE of rendering, and a source assertion is the only
      // thing that observes it directly — the byte test above would still pass if
      // someone re-added a client-side render alongside the fetch. It reads the
      // two component files, which is legitimate here: the claim is literally
      // about what they import.
      // Comments describe the defect by name, so the assertions are on IMPORT
      // SPECIFIERS: a comment saying "this used to import X" is documentation,
      // `from "X"` or `import("X")` is the code.
      const src = join(process.cwd(), "src", "app", "portal", "[token]");
      for (const file of ["quittances.tsx", "page.tsx"]) {
        const text = readFileSync(join(src, file), "utf8");
        expect(`${file}: ${text}`).not.toMatch(
          /(?:from\s*|import\s*\()\s*["'][^"']*@react-pdf\/renderer/
        );
        expect(`${file}: ${text}`).not.toMatch(
          /(?:from\s*|import\s*\()\s*["'][^"']*quittance-generator/
        );
      }
    });
  });

  describe("isolation between tenants", () => {
    it("refuses another tenant's receipt, and does not leak its existence", async () => {
      // Alice's token, Bob's payment. The route resolves the token's tenant in
      // the same query that reads the transaction, so this is "not found" — and
      // the same answer as for an id that never existed.
      const foreign = await call(ALICE_TOKEN, bobTransactionId);
      const missing = await call(ALICE_TOKEN, "no-such-transaction");

      expect(foreign.status).toBe(404);
      expect(missing.status).toBe(404);
      expect((await foreign.json()).error).toBe((await missing.json()).error);
    });

    it("reads nothing for a guessed token, expired or not", async () => {
      const guessed = await call("tok-guessed", aliceTransactionId);
      const expired = await call(EXPIRED_TOKEN, aliceTransactionId);

      expect(guessed.status).toBe(404);
      expect(expired.status).toBe(404);
    });

    it("still serves the tenant's own receipt, so the refusals are not vacuous", async () => {
      const mine = await call(ALICE_TOKEN, aliceTransactionId);
      const theirs = await call(BOB_TOKEN, bobTransactionId);

      expect(mine.status).toBe(200);
      expect(theirs.status).toBe(200);
      // The two tenants' documents are genuinely different files, so "both
      // 200" above is not the same body served to everyone.
      const mineHash = sha256(new Uint8Array(await mine.arrayBuffer()));
      const theirsHash = sha256(new Uint8Array(await theirs.arrayBuffer()));
      expect(mineHash).not.toBe(theirsHash);

      // And each body matches its own stored document.
      for (const [tenantLabel, txId, hash] of [
        ["alice", aliceTransactionId, mineHash],
        ["bob", bobTransactionId, theirsHash],
      ] as const) {
        const stored = await prisma.document.findFirst({
          where: { transactionId: txId },
          select: { content: true },
        });
        expect(`${tenantLabel}:${hash}`).toBe(
          `${tenantLabel}:${sha256(new Uint8Array(stored!.content!))}`
        );
      }
    });

    it("does not reach a transaction of a lease the token's tenant does not hold", async () => {
      // Alice's token, Bob's tenant id in the path: the tenant id is not
      // authorisation, the token is, so this must be refused as well.
      const res = await call(ALICE_TOKEN, bobTransactionId);
      expect(res.status).toBe(404);
      expect(aliceTenantId).not.toBe(bobTenantId);
    });
  });

  describe("a payment whose receipt was never archived", () => {
    it("answers honestly instead of generating a document on the fly", async () => {
      const before = await prisma.document.count({
        where: { transactionId: aliceUnarchivedId },
      });
      expect(before).toBe(0);

      const res = await call(ALICE_TOKEN, aliceUnarchivedId);

      // A refusal the tenant can act on — contact the landlord — not a PDF
      // fabricated by the public token surface. Fabricating one here would be the
      // very defect this route was created to remove.
      expect(res.status).toBe(409);
      const body = (await res.json()) as { error: string };
      expect(body.error).toMatch(/pas encore été générée/i);
      expect(res.headers.get("Content-Type")).toMatch(/application\/json/);

      // Nothing was written: the route never mints a receipt.
      const after = await prisma.document.count({
        where: { transactionId: aliceUnarchivedId },
      });
      expect(after).toBe(0);
      // `receiptType` is decided when the payment is recorded (a partial payment
      // is a RECU whatever happens to the document); `receiptNumber` is only ever
      // allocated by generation, so a null number is the proof that nothing ran.
      const transaction = await prisma.transaction.findUnique({
        where: { id: aliceUnarchivedId },
        select: { receiptNumber: true, receiptType: true, receiptUrl: true },
      });
      expect(transaction?.receiptNumber).toBeNull();
      expect(transaction?.receiptUrl).toBeNull();
    });
  });
});
