/**
 * The payment dialog posts a rent period id instead of typed dates.
 *
 * That id arrives from the browser, so it is untrusted input like any other. If
 * it were trusted, a hand-crafted POST could settle a rent period belonging to
 * another landlord, at dates the attacker chose, and produce a quittance for it.
 *
 * `resolveDuePeriod` still scopes the lookup to the authenticated landlord AND
 * to the lease in the same submission. What changed is the caller: `createTransaction`
 * is now a thin adapter over the payment door
 * (`src/lib/services/rent-payments.ts`), so instead of asserting which strings its
 * source contains, these tests execute it and check what it wrote — the period's
 * own dates win over the posted ones, an unowned id is refused rather than
 * falling back, and the collectable balance is re-derived server-side.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const { prismaMock, storeRef, generateQuittanceMock, fallbackPrismaMock } = vi.hoisted(() => {
  const findFirst = vi.fn();
  return {
    prismaMock: { transaction: { findFirst } },
    // Used when no store is seeded, i.e. the `resolveDuePeriod` block.
    fallbackPrismaMock: { transaction: { findFirst } },
    storeRef: { current: null as unknown },
    generateQuittanceMock: vi.fn(),
  };
});

// The door and the action read the seeded store; `resolveDuePeriod` is asserted
// on its own query shape below, so it gets a store whose `findFirst` is a spy.
vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return (storeRef.current as { prisma: unknown } | null)?.prisma ?? fallbackPrismaMock;
  },
}));
vi.mock("@/lib/actions/quittance-actions", () => ({
  generateQuittance: generateQuittanceMock,
}));
vi.mock("@/lib/auth", () => ({ getCurrentUserId: vi.fn(async () => "landlord-1") }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { resolveDuePeriod } from "@/lib/queries/due-periods";
import { createTransaction } from "@/lib/actions/transaction-actions";
import { createStore, monthReceipts, periodRow, lease, type Store } from "./payment-store";

/** The store seeded for the current test. */
function store(): Store {
  return storeRef.current as Store;
}

const ROW = {
  id: "period-1",
  periodStart: new Date("2026-10-01T00:00:00.000Z"),
  periodEnd: new Date("2026-10-31T00:00:00.000Z"),
  dueDate: new Date("2026-10-03T00:00:00.000Z"),
};

describe("resolveDuePeriod", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storeRef.current = null;
    prismaMock.transaction.findFirst.mockResolvedValue(ROW);
  });

  it("scopes the lookup to the owner and the lease together", async () => {
    await resolveDuePeriod("landlord-1", "lease-1", "period-1");

    // Ownership is in the query, not a check afterwards: a findUnique followed by
    // an `if` is one forgotten `if` away from a cross-tenant read.
    expect(prismaMock.transaction.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "period-1", leaseId: "lease-1", userId: "landlord-1", paidAt: null },
      })
    );
  });

  it("returns the period dates so they can replace whatever the form claimed", async () => {
    const period = await resolveDuePeriod("landlord-1", "lease-1", "period-1");
    expect(period?.periodStart).toEqual(new Date("2026-10-01T00:00:00.000Z"));
  });

  it("returns null for a period that is not this landlord's, or already paid", async () => {
    prismaMock.transaction.findFirst.mockResolvedValue(null);
    expect(await resolveDuePeriod("attacker", "lease-1", "victim-period")).toBeNull();
  });
});

const OCT = new Date("2026-10-01T00:00:00.000Z");

function form(overrides: Record<string, string> = {}): FormData {
  const data = new FormData();
  const fields: Record<string, string> = {
    leaseId: "lease-1",
    amount: "970.55",
    // Deliberately September's dates next to October's period id.
    periodStart: "2026-09-01",
    periodEnd: "2026-09-30",
    dueDate: "2026-09-01",
    duePeriodId: "period-1",
    ...overrides,
  };
  for (const [key, value] of Object.entries(fields)) data.append(key, value);
  return data;
}

describe("createTransaction — the posted period id is untrusted", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    storeRef.current = createStore({
      leases: [lease("lease-1", "landlord-1", "850.50", "120.05")],
      rows: [periodRow({ id: "period-1", amount: "970.55" })],
    });
    generateQuittanceMock.mockResolvedValue({ success: true, data: {} });
  });

  it("books the payment on the period the id names, not on the posted dates", async () => {
    const result = await createTransaction(form());

    expect(result.success).toBe(true);
    // October's receipts, not September's: the row's dates replace the form's.
    expect(monthReceipts(store(), "lease-1", OCT).toFixed(2)).toBe("970.55");
  });

  it("refuses a period id that is not this landlord's, instead of falling back", async () => {
    // A fallback would post the raw form dates against a rejected id, which is
    // how another landlord's rent period was settleable.
    storeRef.current = createStore({
      leases: [lease("lease-1", "landlord-1", "850.50", "120.05")],
      rows: [periodRow({ id: "victim-period", amount: "970.55", userId: "attacker" })],
    });

    const result = await createTransaction(form({ duePeriodId: "victim-period" }));

    expect(result.success).toBe(false);
    expect(monthReceipts(store(), "lease-1", OCT).toFixed(2)).toBe("0.00");
  });

  it("refuses a period that has already been settled", async () => {
    // settling twice would book the month twice; `settleRentPeriod` matching no
    // row is a refusal, not a fall-through to an insert.
    storeRef.current = createStore({
      leases: [lease("lease-1", "landlord-1", "850.50", "120.05")],
      rows: [
        {
          ...periodRow({ id: "period-1", amount: "970.55" }),
          paidAt: new Date("2026-10-05T00:00:00.000Z"),
          status: "PAID",
        },
      ],
    });

    const result = await createTransaction(form());

    expect(result.success).toBe(false);
  });

  it("re-derives the collectable balance server-side, not from the browser", async () => {
    // The dialog's `max` is ergonomics. Without this check a crafted POST books
    // 1000 EUR against a 970.55 EUR month.
    const result = await createTransaction(form({ amount: "1000" }));

    expect(result.success).toBe(false);
    expect(result.success === false && result.error).toContain("dépasse le reste à payer");
    expect(monthReceipts(store(), "lease-1", OCT).toFixed(2)).toBe("0.00");
  });
});