/**
 * The bank webhook, exercised end to end against an in-memory stand-in for the
 * database.
 *
 * The card's acceptance criteria are about behaviour on money and on replay, so
 * they are written here against the real route handler rather than against a
 * re-implementation of its rules. `@/lib/prisma` is mocked, which also covers
 * `settleRentPeriod` — the handler calls it through the same module instance.
 *
 * What is pinned:
 *   - a partial transfer reduces the period's balance and leaves it collectable;
 *   - a later transfer closes it, and the month's receipts sum to what was owed;
 *   - the same delivery twice writes nothing the second time;
 *   - two concurrent deliveries of DIFFERENT transfers each mark their OWN event;
 *   - a transfer matching nothing writes nothing on Transaction.
 *
 * The in-memory store enforces the two UNIQUE constraints the route relies on
 * (`BankWebhookEvent.dedupeKey` and `Transaction.bankTransactionId`) and raises
 * the same P2002 Prisma raises, because deduplication is only correct if the
 * database really refuses the duplicate.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import Decimal from "decimal.js";
import { createHmac } from "node:crypto";

const SECRET = "test-bank-secret";

const { store, prismaMock, uniqueViolation } = vi.hoisted(() => {
  // In-memory stand-in for the database. It enforces the two UNIQUE constraints the
  // route depends on and raises the same P2002 Prisma raises: deduplication is only
  // correct if the database really refuses the duplicate.
  //
  // Money is held as decimal strings, the way Prisma hands a Decimal back into the
  // application (every consumer goes through decimal.js anyway).
  type Row = {
    id: string;
    leaseId: string;
    userId: string;
    amount: string;
    rentPortion: string;
    chargesPortion: string;
    paidAt: Date | null;
    status: string;
    periodStart: Date;
    periodEnd: Date;
    dueDate: Date;
    bankTransactionId: string | null;
    receiptType: string | null;
    receiptNumber: string | null;
  };

  const store = {
    events: [] as Array<{
      id: string;
      eventType: string;
      dedupeKey: string;
      processedAt: Date | null;
      error: string | null;
    }>,
    transactions: [] as Row[],
    connection: null as null | { id: string; userId: string; providerItemId: string | null },
  };

  const uniqueViolation = () =>
    Object.assign(new Error("Unique constraint failed"), { code: "P2002" });

  /**
   * The `where` clauses Prisma would apply. Only the ones these tests exercise:
   * the unpaid-period guard, the compare-and-set on `amount`, and the month's
   * receipts. Anything else is ignored rather than silently matched, so a new
   * filter shows up as a failing test instead of a false pass.
   */
  const matches = (row: Row, where: Record<string, any>): boolean => {
    for (const [key, filter] of Object.entries(where)) {
      switch (key) {
        case "id":
          if (row.id !== filter) return false;
          break;
        case "leaseId":
          if (row.leaseId !== filter) return false;
          break;
        case "userId":
          if (row.userId !== filter) return false;
          break;
        case "status": {
          const f = filter as { in?: string[]; not?: string };
          if (f?.in && !f.in.includes(row.status)) return false;
          if (f?.not !== undefined && row.status === f.not) return false;
          break;
        }
        case "paidAt": {
          const f = filter as null | { not?: null };
          if (f === null) {
            if (row.paidAt !== null) return false;
          } else if (f?.not === null && row.paidAt === null) {
            return false;
          }
          break;
        }
        case "periodStart":
          if (row.periodStart.getTime() !== (filter as Date).getTime()) return false;
          break;
        case "periodEnd":
          if (row.periodEnd.getTime() !== (filter as Date).getTime()) return false;
          break;
        case "amount": {
          if (filter && typeof filter === "object" && "gt" in filter) {
            if (!new Decimal(row.amount).gt((filter as { gt: number }).gt)) return false;
            break;
          }
          if (!new Decimal(row.amount).eq(new Decimal(filter as Decimal.Value))) return false;
          break;
        }
        default:
          throw new Error(`store mock does not implement the "${key}" filter`);
      }
    }
    return true;
  };

  const prismaMock = {
    bankConnection: {
      findFirst: vi.fn(async ({ where }: { where: { providerItemId?: string } }) => {
        if (where.providerItemId && store.connection?.providerItemId === where.providerItemId) {
          return store.connection;
        }
        return null;
      }),
      update: vi.fn(async () => ({})),
    },
    bankWebhookEvent: {
      create: vi.fn(async ({ data }: any) => {
        if (store.events.some((e) => e.dedupeKey === data.dedupeKey)) {
          throw uniqueViolation();
        }
        const event = {
          id: `event-${store.events.length + 1}`,
          eventType: data.eventType,
          dedupeKey: data.dedupeKey,
          processedAt: null as Date | null,
          error: null as string | null,
        };
        store.events.push(event);
        return event;
      }),
      update: vi.fn(async ({ where, data }: any) => {
        // By the event's OWN id. Updating "the last event in the table" is what let a
        // concurrent delivery mark an event processed that it never processed.
        const event = store.events.find((e) => e.id === where.id);
        if (!event) throw new Error(`unknown event ${where.id}`);
        if (data.processedAt !== undefined) event.processedAt = data.processedAt;
        if (data.error !== undefined) event.error = data.error;
        return event;
      }),
    },
    transaction: {
      findUnique: vi.fn(async ({ where }: any) => {
        if (where.bankTransactionId) {
          return (
            store.transactions.find((t) => t.bankTransactionId === where.bankTransactionId) ??
            null
          );
        }
        return null;
      }),
      // `settleRentPeriod` owns the read now, so this must honour the whole where
      // clause it sends: the open period by id, and the month's prior receipts.
      findFirst: vi.fn(async ({ where }: any) => {
        const row = store.transactions.find((t) => matches(t, where));
        return row
          ? {
              ...row,
              lease: { rentAmount: "850.50", chargesAmount: "120.05" },
            }
          : null;
      }),
      findMany: vi.fn(async ({ where }: any) => {
        const rows = store.transactions.filter((t) => matches(t, where));
        return rows.map((t) => ({
          id: t.id,
          amount: t.amount,
          dueDate: t.dueDate,
          periodStart: t.periodStart,
          periodEnd: t.periodEnd,
          leaseId: t.leaseId,
          paidAt: t.paidAt,
          createdAt: t.paidAt ?? new Date(0),
          lease: { rentAmount: "850.50", chargesAmount: "120.05" },
        }));
      }),
      // The compare-and-set: `amount` in the where is the balance the caller read.
      // Matching it is what stops two transfers each writing `read - amount` from
      // the same stale figure; the loser updates nothing and re-reads.
      updateMany: vi.fn(async ({ where, data }: any) => {
        const row = store.transactions.find((t) => t.id === where.id);
        if (!row || !matches(row, where)) return { count: 0 };
        if (data.amount !== undefined) row.amount = new Decimal(data.amount).toFixed(2);
        if (data.rentPortion !== undefined) {
          row.rentPortion = new Decimal(data.rentPortion).toFixed(2);
        }
        if (data.chargesPortion !== undefined) {
          row.chargesPortion = new Decimal(data.chargesPortion).toFixed(2);
        }
        if (data.paidAt !== undefined) row.paidAt = data.paidAt;
        if (data.status !== undefined) row.status = data.status;
        if (data.bankTransactionId !== undefined) row.bankTransactionId = data.bankTransactionId;
        return { count: 1 };
      }),
      create: vi.fn(async ({ data }: any) => {
        if (
          data.bankTransactionId &&
          store.transactions.some((t) => t.bankTransactionId === data.bankTransactionId)
        ) {
          throw uniqueViolation();
        }
        const row: Row = {
          id: `txn-${store.transactions.length + 1}`,
          leaseId: data.leaseId,
          userId: data.userId ?? "user-1",
          amount: new Decimal(data.amount).toFixed(2),
          rentPortion: new Decimal(data.rentPortion ?? 0).toFixed(2),
          chargesPortion: new Decimal(data.chargesPortion ?? 0).toFixed(2),
          paidAt: data.paidAt ?? null,
          status: data.status ?? "PENDING",
          periodStart: data.periodStart,
          periodEnd: data.periodEnd,
          dueDate: data.dueDate,
          bankTransactionId: data.bankTransactionId ?? null,
          receiptType: data.receiptType ?? null,
          receiptNumber: data.receiptNumber ?? null,
        };
        store.transactions.push(row);
        return row;
      }),
    },
  };

  return { store, prismaMock, uniqueViolation };
});

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import { POST } from "@/app/api/webhooks/bank/route";
import { computeDuePeriods } from "@/lib/domain/due-periods";

/** Build a signed request carrying one Bridge `transaction.created` payload. */
function bankRequest(body: unknown) {
  const raw = JSON.stringify(body);
  const signature = createHmac("sha256", SECRET).update(raw).digest("hex");
  return new Request("https://rent-ready.test/api/webhooks/bank", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-bridge-signature": signature,
    },
    body: raw,
  }) as never;
}

function transfer(id: string, amount: number, date: string) {
  return {
    event_type: "transaction.created",
    item_id: "item-1",
    transaction: {
      id,
      amount,
      currency_code: "EUR",
      description: "VIR SEPA",
      date,
      account_id: "acc-1",
      is_future: false,
    },
  };
}

/** A 970.55 EUR October period (850.50 rent + 120.05 charges), unpaid. */
function seedOctoberPeriod(remaining = "970.55") {
  store.transactions.push({
    id: "period-oct",
    leaseId: "lease-1",
    userId: "user-1",
    amount: remaining,
    rentPortion: "850.50",
    chargesPortion: "120.05",
    paidAt: null,
    status: "PENDING",
    periodStart: new Date("2026-10-01T00:00:00.000Z"),
    periodEnd: new Date("2026-10-31T00:00:00.000Z"),
    dueDate: new Date("2026-10-05T00:00:00.000Z"),
    bankTransactionId: null,
    receiptType: null,
    receiptNumber: null,
  });
}

/** What `computeDuePeriods` sees, as the billing dialog reads it. */
function duePeriods(now = new Date("2026-10-20T00:00:00.000Z")) {
  return computeDuePeriods(
    store.transactions.map((t) => ({
      id: t.id,
      periodStart: t.periodStart,
      periodEnd: t.periodEnd,
      dueDate: t.dueDate,
      amount: t.amount,
      paidAt: t.paidAt,
    })),
    now
  );
}

/** What was received for the month: the paid rows. */
function receivedInOctober(): Decimal {
  return store.transactions
    .filter(
      (t) =>
        t.paidAt !== null && t.periodStart.toISOString().slice(0, 7) === "2026-10"
    )
    .reduce((sum, t) => sum.plus(t.amount), new Decimal(0));
}

beforeEach(() => {
  store.events.length = 0;
  store.transactions.length = 0;
  store.connection = { id: "conn-1", userId: "user-1", providerItemId: "item-1" };
  vi.clearAllMocks();
  process.env.BANK_WEBHOOK_SECRET = SECRET;
});

describe("bank webhook — the obligation survives a partial transfer", () => {
  it("a 400 EUR transfer leaves 570.55 owed and the month collectable", async () => {
    seedOctoberPeriod();

    const response = await POST(
      bankRequest(transfer("tx-400", 400, "2026-10-12"))
    );
    expect(response.status).toBe(200);

    const period = store.transactions.find((t) => t.id === "period-oct")!;
    // THE REGRESSION: the row used to be rewritten to 400 with paidAt set, so the
    // obligation existed in no row and the month stopped being offered.
    expect(period.amount).toBe("570.55");
    expect(period.paidAt).toBeNull();

    const due = duePeriods();
    expect(due).toHaveLength(1);
    expect(due[0].remaining).toBe("570.55");

    // The money received is recorded separately.
    expect(store.transactions).toHaveLength(2);
    expect(receivedInOctober().toFixed(2)).toBe("400.00");
  });

  it("the follow-up transfer closes the month and the receipts sum to 970.55", async () => {
    seedOctoberPeriod();
    await POST(bankRequest(transfer("tx-400", 400, "2026-10-12")));
    await POST(bankRequest(transfer("tx-570", 570.55, "2026-10-28")));

    const period = store.transactions.find((t) => t.id === "period-oct")!;
    expect(period.paidAt).not.toBeNull();
    // Neither lost nor double counted.
    expect(receivedInOctober().toFixed(2)).toBe("970.55");
    expect(duePeriods()).toHaveLength(0);
  });

  it("claims no receipt, because this handler produces no document", async () => {
    seedOctoberPeriod();
    await POST(bankRequest(transfer("tx-400", 400, "2026-10-12")));
    await POST(bankRequest(transfer("tx-570", 570.55, "2026-10-28")));

    // A quittance is a legal document; /billing used to advertise one that could
    // not be downloaded because only the reference had been written.
    for (const row of store.transactions) {
      expect(row.receiptType).toBeNull();
      expect(row.receiptNumber).toBeNull();
    }
  });
});

describe("bank webhook — matching is by period, date and real balance", () => {
  it("an unrelated small transfer writes nothing and is left for review", async () => {
    seedOctoberPeriod();

    await POST(bankRequest(transfer("tx-12", 12, "2026-10-12")));

    // No Transaction write at all: the period row is untouched.
    expect(store.transactions).toHaveLength(1);
    expect(store.transactions[0].amount).toBe("970.55");
    expect(store.events[0].processedAt).not.toBeNull();
    expect(store.events[0].error).toMatch(/no rent period matched/);
  });

  it("an overpayment is never auto-allocated", async () => {
    seedOctoberPeriod();

    await POST(bankRequest(transfer("tx-1500", 1500, "2026-10-12")));

    expect(store.transactions).toHaveLength(1);
    expect(store.events[0].error).toMatch(/no rent period matched/);
  });

  it("a partial received in October never settles September", async () => {
    seedOctoberPeriod();
    store.transactions[0].periodStart = new Date("2026-09-01T00:00:00.000Z");
    store.transactions[0].periodEnd = new Date("2026-09-30T00:00:00.000Z");

    await POST(bankRequest(transfer("tx-400", 400, "2026-10-12")));

    expect(store.transactions).toHaveLength(1);
    expect(store.events[0].error).toMatch(/no rent period matched/);
  });
});

describe("bank webhook — replay and concurrency", () => {
  it("the same delivery twice writes nothing the second time", async () => {
    seedOctoberPeriod();
    const body = transfer("tx-400", 400, "2026-10-12");

    const first = await POST(bankRequest(body));
    const second = await POST(bankRequest(body));

    expect(first.status).toBe(200);
    expect(await second.json()).toEqual({ received: true, deduplicated: true });
    // One payment row, not two: the UNIQUE dedupe key refused the redelivery
    // before any money was touched.
    expect(store.transactions).toHaveLength(2);
    expect(receivedInOctober().toFixed(2)).toBe("400.00");
  });

  it("does not raise a unique violation on the transfer itself", async () => {
    seedOctoberPeriod();
    const body = transfer("tx-400", 400, "2026-10-12");

    await POST(bankRequest(body));
    const second = await POST(bankRequest(body));

    // A 500 here would make the provider retry forever.
    expect(second.status).toBe(200);
  });

  it("an event without a timestamp is still deduplicated", async () => {
    seedOctoberPeriod();
    // `timestamp` is optional in the provider schema; replay protection keyed on it,
    // so this event used to be reprocessed in full on every redelivery.
    const body = { ...transfer("tx-400", 400, "2026-10-12") } as Record<string, unknown>;
    delete body.timestamp;

    await POST(bankRequest(body));
    await POST(bankRequest(body));

    expect(receivedInOctober().toFixed(2)).toBe("400.00");
    expect(store.events).toHaveLength(1);
  });

  it("a transfer already recorded is not booked a second time", async () => {
    seedOctoberPeriod();
    // The transfer was already booked (manually, or by a delivery that beat the
    // event key). `bankTransactionId` is UNIQUE: the handler must stop there rather
    // than raise, because a 500 makes the provider retry forever.
    store.transactions.push({
      id: "txn-booked",
      leaseId: "lease-1",
      userId: "user-1",
      amount: "400.00",
      rentPortion: "350.52",
      chargesPortion: "49.48",
      paidAt: new Date("2026-10-12T00:00:00.000Z"),
      status: "PARTIAL",
      periodStart: new Date("2026-10-01T00:00:00.000Z"),
      periodEnd: new Date("2026-10-31T00:00:00.000Z"),
      dueDate: new Date("2026-10-05T00:00:00.000Z"),
      bankTransactionId: "tx-400",
      receiptType: null,
      receiptNumber: null,
    });

    const response = await POST(bankRequest(transfer("tx-400", 400, "2026-10-12")));

    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ received: true, deduplicated: true });
    // Still one payment of 400: not booked twice.
    expect(receivedInOctober().toFixed(2)).toBe("400.00");
  });

  it("two distinct transfers on the SAME month do not lose rent", async () => {
    seedOctoberPeriod();
    // The concurrency defect: both deliveries read 970.55 owed before either wrote,
    // so each used to write 670.55 — the month then claimed to owe 970.55 with
    // 600 EUR received, and 300 EUR of rent disappeared from the ledger. The
    // compare-and-set on the balance makes the loser re-read and re-derive.
    const responses = await Promise.all([
      POST(bankRequest(transfer("tx-a", 300, "2026-10-12"))),
      POST(bankRequest(transfer("tx-b", 300, "2026-10-13"))),
    ]);

    for (const response of responses) expect(response.status).toBe(200);
    expect(store.events.filter((e) => e.error !== null)).toHaveLength(0);

    const period = store.transactions.find((t) => t.id === "period-oct")!;
    // Both transfers are booked...
    expect(receivedInOctober().toFixed(2)).toBe("600.00");
    // ...and the balance is reduced by both, once each.
    expect(period.amount).toBe("370.55");
    // The invariant that was broken: what is owed plus what arrived is the month.
    expect(new Decimal(period.amount).plus(receivedInOctober()).toFixed(2)).toBe("970.55");
  });

  it("two distinct transfers processed concurrently each mark their OWN event", async () => {
    seedOctoberPeriod();
    // A second open period for another lease, so both transfers have a target.
    store.transactions.push({ ...store.transactions[0], id: "period-oct-2", leaseId: "lease-2" });

    const responses = await Promise.all([
      POST(bankRequest(transfer("tx-a", 400, "2026-10-12"))),
      POST(bankRequest(transfer("tx-b", 300, "2026-10-13"))),
    ]);

    for (const response of responses) expect(response.status).toBe(200);
    // Each event updated by its own id — never "the last one in the table".
    expect(store.events).toHaveLength(2);
    for (const event of store.events) {
      expect(event.processedAt).not.toBeNull();
    }
    expect(store.events.filter((e) => e.error !== null)).toHaveLength(0);
  });

  it("marks the event it inserted, not the most recent one", async () => {
    seedOctoberPeriod();
    await POST(bankRequest(transfer("tx-400", 400, "2026-10-12")));

    // An unrelated event arriving afterwards must not steal the processed flag.
    await POST(
      bankRequest({ event_type: "item.refreshed", item_id: "item-1" })
    );

    const transactionEvent = store.events.find((e) => e.eventType === "transaction.created")!;
    expect(transactionEvent.processedAt).not.toBeNull();
  });
});

describe("bank webhook — trust boundary unchanged", () => {
  it("refuses a body with no signature", async () => {
    const response = await POST(
      new Request("https://rent-ready.test/api/webhooks/bank", {
        method: "POST",
        body: JSON.stringify(transfer("tx-1", 400, "2026-10-12")),
      }) as never
    );
    expect(response.status).toBe(401);
    expect(store.events).toHaveLength(0);
  });

  it("refuses a forged signature", async () => {
    const response = await POST(
      new Request("https://rent-ready.test/api/webhooks/bank", {
        method: "POST",
        headers: { "x-bridge-signature": "00".repeat(32) },
        body: JSON.stringify(transfer("tx-1", 400, "2026-10-12")),
      }) as never
    );
    expect(response.status).toBe(401);
    expect(store.events).toHaveLength(0);
  });

  it("refuses a malformed body", async () => {
    const response = await POST(
      new Request("https://rent-ready.test/api/webhooks/bank", {
        method: "POST",
        headers: {
          "x-bridge-signature": createHmac("sha256", SECRET)
            .update('{"event_type":')
            .digest("hex"),
        },
        body: '{"event_type":',
      }) as never
    );
    expect(response.status).toBe(400);
    expect(store.events).toHaveLength(0);
  });
});

describe("bank webhook — the payload is validated, not asserted", () => {
  // The route used to declare `let payload: BankWebhookPayload` and assign
  // `JSON.parse(rawBody)` to it. TypeScript was satisfied and nothing checked the
  // shape, so `payload.transaction.amount` was trusted to be a number before being
  // compared against a rent balance. A valid signature proves the provider sent
  // the body; it does not prove the body has this shape.
  //
  // These go through the real route with a valid signature, so they fail if the
  // route stops validating. An earlier version of this file re-declared the Zod
  // schema locally and tested the copy, which would have kept passing after the
  // route's own schema was deleted.

  /** A signed `transaction.created` whose inner transaction is overridden. */
  function withTransaction(overrides: Record<string, unknown>) {
    return {
      event_type: "transaction.created",
      item_id: "item-1",
      transaction: {
        id: "tx-bad",
        amount: 850,
        currency_code: "EUR",
        description: "VIR SEPA",
        date: "2026-10-12",
        account_id: "acc-1",
        is_future: false,
        ...overrides,
      },
    };
  }

  async function post(payload: unknown) {
    return POST(bankRequest(payload));
  }

  it("accepts a well-formed transfer", async () => {
    seedOctoberPeriod();

    const response = await post(transfer("tx-ok", 970.55, "2026-10-12"));

    expect(response.status).toBe(200);
  });

  it("refuses a non-numeric amount rather than comparing it as a number", async () => {
    seedOctoberPeriod();

    // The shape the assertion silently accepted: a string amount reaches
    // `new Decimal(...)` and either throws or coerces to NaN, and a NaN comparison
    // matches no period — or, worse, is treated as "close enough".
    const response = await post(withTransaction({ amount: "850" }));

    expect(response.status).toBe(400);
    expect(receivedInOctober().toFixed(2)).toBe("0.00");
  });

  it("refuses a missing currency, which would be compared as undefined", async () => {
    seedOctoberPeriod();

    const response = await post(withTransaction({ currency_code: undefined }));

    expect(response.status).toBe(400);
    expect(receivedInOctober().toFixed(2)).toBe("0.00");
  });

  it("refuses NaN, which JSON cannot carry and which would poison the comparison", async () => {
    seedOctoberPeriod();

    // Sent as a raw literal rather than through JSON.stringify, since JSON has no
    // NaN: this is the shape a hand-crafted request would have.
    const raw = '{"event_type":"transaction.created","item_id":"item-1","transaction":{"id":"tx-nan","amount":NaN,"currency_code":"EUR","description":"x","date":"2026-10-12","account_id":"acc-1","is_future":false}}';
    const response = await POST(
      new Request("https://rent-ready.test/api/webhooks/bank", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-bridge-signature": createHmac("sha256", SECRET).update(raw).digest("hex"),
        },
        body: raw,
      }) as never
    );

    expect(response.status).toBe(400);
    expect(receivedInOctober().toFixed(2)).toBe("0.00");
  });

  it("refuses a transfer with no id, which the replay key is built from", async () => {
    seedOctoberPeriod();

    const response = await post(withTransaction({ id: undefined }));

    expect(response.status).toBe(400);
  });
});