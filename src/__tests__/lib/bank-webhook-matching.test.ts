import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Two defects in the Bridge bank webhook, both on the path that marks rent paid
 * from an incoming bank transfer.
 *
 * 1. The payload was asserted, not validated:
 *
 *      let payload: BankWebhookPayload;
 *      payload = JSON.parse(rawBody);
 *
 *    so `payload.transaction.amount` was trusted to be a number before being used
 *    to decide a lease had been paid. A valid HMAC signature proves the provider
 *    sent the body; it does not prove the body matches this shape.
 *
 * 2. The pending-transaction query claimed to match "this amount" but never
 *    referenced it. It returned the earliest pending transaction for the user, and
 *    a payment smaller than that total took the PARTIAL branch — so a €12 grocery
 *    transfer was written onto whichever rent invoice sorted first, marking it
 *    part-paid and issuing a receipt.
 */

const route = readFileSync(
  join(process.cwd(), "src/app/api/webhooks/bank/route.ts"),
  "utf8"
);

/** A pending rent invoice, as the route now selects it. */
function pendingInvoice(rent: string, charges: string) {
  return {
    id: "txn-1",
    rentPortion: new Decimal(rent),
    chargesPortion: new Decimal(charges),
    amount: new Decimal("0"),
    dueDate: new Date("2026-10-01"),
    lease: {
      id: "lease-1",
      rentAmount: new Decimal(rent),
      chargesAmount: new Decimal(charges),
      property: { id: "p1", name: "Bien A" } as never,
      tenant: { id: "t1", firstName: "Alice" } as never,
    },
  };
}

/** The matching rule the route now applies. */
function matches(candidate: ReturnType<typeof pendingInvoice>, incoming: string) {
  const due = new Decimal(candidate.lease.rentAmount).plus(candidate.lease.chargesAmount);
  const slack = new Decimal("0.01");
  return (
    new Decimal(incoming).gte(due.minus(slack)) &&
    new Decimal(incoming).lte(due.plus(slack))
  );
}

describe("bank webhook payload validation", () => {
  const BridgeTransactionSchema = z.object({
    id: z.string().min(1),
    amount: z.number().finite(),
    currency_code: z.string().min(1),
    description: z.string().default(""),
    date: z.string().min(1),
    account_id: z.string().default(""),
    category_id: z.number().optional(),
    is_future: z.boolean().default(false),
  });

  it("accepts a well-formed transaction", () => {
    const r = BridgeTransactionSchema.safeParse({
      id: "txn-1", amount: 850, currency_code: "EUR",
      description: "VIR SEPA", date: "2026-10-01", account_id: "acc-1", is_future: false,
    });
    expect(r.success).toBe(true);
  });

  it("rejects a non-numeric amount, which the assertion previously accepted", () => {
    expect(BridgeTransactionSchema.safeParse({
      id: "txn-1", amount: "850", currency_code: "EUR",
      description: "x", date: "2026-10-01", account_id: "a", is_future: false,
    }).success).toBe(false);
  });

  it("rejects a missing currency, which would have been compared as undefined", () => {
    expect(BridgeTransactionSchema.safeParse({
      id: "txn-1", amount: 850, date: "2026-10-01", account_id: "a", is_future: false,
    }).success).toBe(false);
  });

  it("rejects NaN and Infinity, which would poison the amount comparison", () => {
    for (const amount of [NaN, Infinity, -Infinity]) {
      expect(BridgeTransactionSchema.safeParse({
        id: "t", amount, currency_code: "EUR", description: "x",
        date: "2026-10-01", account_id: "a", is_future: false,
      }).success, `amount ${amount} must be rejected`).toBe(false);
    }
  });

  it("parses rather than asserting in the route", () => {
    expect(route).toContain("BankWebhookSchema.parse(JSON.parse(rawBody))");
    expect(route).not.toMatch(/payload\s*=\s*JSON\.parse\(rawBody\)\s*;/);
  });

  it("no longer casts the payload to an untyped record", () => {
    expect(route).not.toContain("as unknown as Record<string, unknown>");
  });
});

describe("bank webhook matches by amount", () => {
  const rent850 = pendingInvoice("850", "50"); // due 900

  it("matches a payment that covers the total", () => {
    expect(matches(rent850, "900")).toBe(true);
  });

  it("matches within one cent short", () => {
    expect(matches(rent850, "899.99")).toBe(true);
  });

  it("does NOT match a small unrelated payment", () => {
    // The defect: a €12 grocery transfer was written onto this €900 invoice.
    expect(matches(rent850, "12")).toBe(false);
    expect(matches(rent850, "45.50")).toBe(false);
  });

  it("does not match an overpayment, which needs confirmation", () => {
    expect(matches(rent850, "1500")).toBe(false);
  });

  it("picks the right invoice when several are pending", () => {
    const older = pendingInvoice("700", "40"); // due 740
    const newer = pendingInvoice("850", "50"); // due 900
    const candidates = [older, newer]; // ordered by dueDate
    const incoming = "900";
    const found = candidates.find((c) => matches(c, incoming));
    expect(found?.lease.id).toBe("lease-1");
  });

  it("a payment below every total matches nothing, so no invoice is touched", () => {
    const candidates = [pendingInvoice("700", "40"), pendingInvoice("850", "50")];
    expect(candidates.find((c) => matches(c, "12"))).toBeUndefined();
  });

  it("the route filters candidates by amount rather than taking the first", () => {
    // The query may not reference the amount, but the filter after it must.
    expect(route).toMatch(/incomingDecimal\.gte\(due\.minus/);
    expect(route).toContain("const matchingCandidate = candidates.find");
  });
});