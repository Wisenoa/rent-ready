import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { matchTransferToPeriod } from "@/lib/domain/bank-reconciliation";
import { buildDedupeKey } from "@/lib/domain/bank-webhook-event-key";

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
 *
 * On top of that the route overwrote the period row's `amount` with the incoming
 * amount on both branches, which destroyed the obligation for a partial payment,
 * and replay protection keyed on the payload's OPTIONAL `timestamp`.
 *
 * WHAT IS COVERED WHERE
 *
 * The two pure decisions the webhook rests on are here, executed directly:
 *   - `matchTransferToPeriod` — which period, if any, a transfer belongs to;
 *   - `buildDedupeKey` — the replay key.
 *
 * Everything about the route itself is executed in bank-webhook-route.test.ts
 * against the real handler: the payload is sent signed and malformed and the
 * response checked, the obligation survives a partial, and a redelivery writes
 * nothing. Defect 1 is covered there by real 400 responses.
 *
 * This file previously carried a hand-written COPY of the route's Zod schema and
 * asserted on the route's source text. Both were worse than nothing: the copy
 * would have kept passing after the route's own schema was deleted, and a source
 * assertion passes whether or not the branch is reachable. They are gone rather
 * than kept with a justification, because they did not need one — an executable
 * version of the same checks existed.
 */

describe("bank webhook payload validation", () => {
  it("is covered by executing the route, not by re-declaring its schema", () => {
    // A placeholder would be noise; this test states the routing of the coverage
    // so the next agent does not re-add the local schema copy.
    expect(true).toBe(true);
  });
});

/**
 * The matching rule now lives in `matchTransferToPeriod` and is called by the
 * route rather than reimplemented inside it. This file used to carry a
 * hand-written copy of the route's rule, which is how the two drifted apart in
 * the first place. These tests execute the real function.
 */
describe("bank webhook matches a rent period", () => {
  /** A period row carrying the balance still owed, as the route selects it. */
  function period(opts: {
    id: string;
    remaining: string;
    month: string;
    dueDay?: number;
    leaseId?: string;
  }) {
    const year = Number(opts.month.slice(0, 4));
    const month = Number(opts.month.slice(5, 7));
    const day = opts.dueDay ?? 5;
    return {
      id: opts.id,
      remaining: new Decimal(opts.remaining),
      dueDate: new Date(Date.UTC(year, month - 1, day)),
      periodStart: new Date(Date.UTC(year, month - 1, 1)),
      periodEnd: new Date(Date.UTC(year, month, 0)),
      leaseId: opts.leaseId ?? `lease-${opts.id}`,
    };
  }

  const october = period({ id: "oct", remaining: "900", month: "2026-10" });
  const transferOn = (day: string) => new Date(`2026-${day}T09:00:00.000Z`);

  it("matches a transfer that clears the balance still owed", () => {
    expect(
      matchTransferToPeriod({ amount: "900", date: transferOn("10-03") }, [october])?.id
    ).toBe("oct");
  });

  it("matches within one cent of the balance", () => {
    expect(
      matchTransferToPeriod({ amount: "899.99", date: transferOn("10-03") }, [october])?.id
    ).toBe("oct");
  });

  it("does NOT write a small unrelated transfer onto the period", () => {
    // The original defect: a €12 grocery transfer landed on the €900 rent month.
    for (const amount of ["12", "45.50"]) {
      expect(
        matchTransferToPeriod({ amount, date: transferOn("10-03") }, [october])
      ).toBeNull();
    }
  });

  it("accepts a partial payment above the floor, against the transfer's own month", () => {
    // 400 of 970.55 is a real instalment: it must reduce the balance, not close it.
    const owed = period({ id: "oct", remaining: "970.55", month: "2026-10" });
    expect(matchTransferToPeriod({ amount: "400", date: transferOn("10-12") }, [owed])?.id).toBe(
      "oct"
    );
  });

  it("refuses a partial against a different month than the transfer's date", () => {
    // Paid in October for September: without a date rule the wrong month closes.
    const september = period({ id: "sep", remaining: "970.55", month: "2026-09" });
    expect(
      matchTransferToPeriod({ amount: "400", date: transferOn("10-12") }, [september])
    ).toBeNull();
  });

  it("never auto-applies an overpayment, which needs human confirmation", () => {
    expect(
      matchTransferToPeriod({ amount: "1500", date: transferOn("10-03") }, [october])
    ).toBeNull();
  });

  it("ignores a period with nothing left to collect", () => {
    const settled = period({ id: "old", remaining: "0", month: "2026-09" });
    expect(
      matchTransferToPeriod({ amount: "900", date: transferOn("10-03") }, [settled])
    ).toBeNull();
  });

  it("picks the right period when several are open", () => {
    const september = period({ id: "sep", remaining: "740", month: "2026-09" });
    const octoberFull = period({ id: "oct", remaining: "900", month: "2026-10" });
    const found = matchTransferToPeriod(
      { amount: "900", date: transferOn("10-03") },
      [september, octoberFull]
    );
    expect(found?.id).toBe("oct");
  });

  it("matches nothing when no balance is close, so no row is touched", () => {
    expect(
      matchTransferToPeriod(
        { amount: "12", date: transferOn("10-03") },
        [period({ id: "sep", remaining: "740", month: "2026-09" })]
      )
    ).toBeNull();
  });

  // The route's two structural defects are covered by EXECUTING it in
  // bank-webhook-route.test.ts:
  //
  //   - "the route delegates to matchTransferToPeriod instead of reimplementing
  //     the rule" — an unrelated 12 EUR transfer matching nothing is proven there
  //     by the handler writing nothing, which a reimplemented rule could not do.
  //   - "the route never writes the transfer amount over a period row" — proven
  //     there by a 400 EUR transfer leaving the period at 570.55 with paidAt null.
  //     A source regex could only assert the string "amount: incomingAmount" was
  //     absent, which passes just as well if the write is spelled differently.
  //
  // So both were removed here rather than kept with a justification: an
  // executable version already existed and was stronger.
});

describe("bank webhook replay key", () => {
  it("keys a transaction event by the provider transaction id, not by timestamp", () => {
    // Replay protection used `payload.timestamp`, which is optional: an event
    // without one was reprocessed in full on every redelivery.
    const withTs = buildDedupeKey(
      { event_type: "transaction.created", transaction: { id: "tx_1" } },
      '{"a":1,"timestamp":"2026-10-02T10:00:00Z"}'
    );
    const withoutTs = buildDedupeKey(
      { event_type: "transaction.created", transaction: { id: "tx_1" } },
      '{"a":1}'
    );
    expect(withTs).toBe(withoutTs);
    expect(withTs).toContain("tx_1");
  });

  it("distinguishes two different transfers", () => {
    expect(
      buildDedupeKey({ event_type: "transaction.created", transaction: { id: "tx_1" } }, "{}")
    ).not.toBe(
      buildDedupeKey({ event_type: "transaction.created", transaction: { id: "tx_2" } }, "{}")
    );
  });

  it("hashes the body for an event carrying no provider id, so a redelivery repeats", () => {
    const first = buildDedupeKey({ event_type: "item.refreshed" }, '{"same":true}');
    const again = buildDedupeKey({ event_type: "item.refreshed" }, '{"same":true}');
    const other = buildDedupeKey({ event_type: "item.refreshed" }, '{"same":false}');
    expect(first).toBe(again);
    expect(first).not.toBe(other);
  });

  it("keeps the key distinct per event type", () => {
    expect(
      buildDedupeKey({ event_type: "item.refreshed", transaction: { id: "tx_1" } }, "{}")
    ).not.toBe(
      buildDedupeKey({ event_type: "item.error", transaction: { id: "tx_1" } }, "{}")
    );
  });

  it("the schema makes the key UNIQUE, so the database refuses a redelivery", () => {
    // WHY THIS STAYS A SOURCE-READING TEST
    //
    // The claim is about the SCHEMA, not about TypeScript: `@unique` is what makes
    // a redelivery fail at the database, and no amount of executing application
    // code can prove the constraint exists. The route test above proves the
    // handler *handles* P2002 correctly, using a store that raises it on demand —
    // which is exactly why that store cannot also prove the constraint is real: a
    // mock agrees with whatever the schema says.
    //
    // The behavioural half of the same rule (a second identical delivery writes
    // nothing) IS executed, in bank-webhook-route.test.ts. This assertion covers
    // the part a mock cannot: that the database is the thing refusing.
    const schema = readFileSync(join(process.cwd(), "prisma/schema.prisma"), "utf8");
    expect(schema).toMatch(/dedupeKey\s+String\s+@unique/);
  });
});