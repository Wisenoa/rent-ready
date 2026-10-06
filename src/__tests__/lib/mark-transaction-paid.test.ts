/**
 * `markTransactionPaid` must no longer let the browser decide the amount.
 *
 * The action used to write the `amount` argument straight onto the period row.
 * That argument came from the client, with no ceiling and no relation to the
 * period, so a crafted call marked a 970.55 EUR month paid for 0.01 EUR. The
 * dashboard then counted a settled month whose receipts summed to nothing — the
 * displayed amount stopped being the amount received.
 *
 * These tests call the real action. The payment bookkeeping itself is covered on
 * rows in rent-payment-door.test.ts; what is under test here is the wiring this
 * change is about: the amount the action passes to the door, and what it does
 * with the receipt afterwards.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const { storeRef, generateQuittanceMock } = vi.hoisted(() => ({
  // Swapped per test; the prisma mock reads through it.
  storeRef: { current: null as unknown },
  generateQuittanceMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return (storeRef.current as { prisma: unknown }).prisma;
  },
}));
vi.mock("@/lib/actions/quittance-actions", () => ({
  generateQuittance: generateQuittanceMock,
}));
vi.mock("@/lib/auth", () => ({ getCurrentUserId: vi.fn(async () => "landlord-1") }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

import { markTransactionPaid } from "@/lib/actions/transaction-actions";
import { createStore, monthReceipts, periodRow, lease, type Store } from "./payment-store";

const ADDRESS_ERROR =
  "Complétez votre adresse de propriétaire dans Mon profil pour pouvoir générer une quittance.";

const OCT = new Date("2026-10-01T00:00:00.000Z");

/** The store seeded for the current test. */
function store() {
  return storeRef.current as Store;
}

beforeEach(() => {
  vi.clearAllMocks();
  storeRef.current = createStore({
    leases: [lease("lease-1", "landlord-1", "850.50", "120.05")],
    rows: [periodRow({ amount: "970.55" })],
  });
  // The receipt path is exercised in its own describe below; here it only has to
  // not throw.
  generateQuittanceMock.mockResolvedValue({
    success: true,
    data: { receiptUrl: "/api/receipts/quittance-2026-0007.pdf" },
  });
});

describe("markTransactionPaid — the amount is the row's own balance", () => {
  it("settles the month's real balance, not the figure the caller passed", async () => {
    // The button sends the row's amount, so the normal path settles 970.55.
    const result = await markTransactionPaid("period-oct");

    expect(result.success).toBe(true);
    expect(monthReceipts(store(), "lease-1", OCT).toFixed(2)).toBe("970.55");
  });

  it("does not let an aberrant amount close the month", async () => {
    // The defect: 0.01 of 970.55 marked the month paid and the dashboard
    // reported a settled month whose receipts summed to nothing.
    const result = await markTransactionPaid("period-oct", 0.01);

    // 0.01 is a legitimate partial payment, so it is recorded — but the month
    // stays open with its balance, which is what the browser could not do before.
    expect(result.success).toBe(true);
    const open = store().rows.find((r) => r.paidAt === null);
    expect(open?.amount).toBe("970.54");
    expect(monthReceipts(store(), "lease-1", OCT).toFixed(2)).toBe("0.01");
  });

  it("refuses an amount above the balance and writes nothing", async () => {
    const result = await markTransactionPaid("period-oct", 9999.99);

    expect(result.success).toBe(false);
    expect(monthReceipts(store(), "lease-1", OCT).toFixed(2)).toBe("0.00");
    expect(generateQuittanceMock).not.toHaveBeenCalled();
  });

  it("does not touch another landlord's period", async () => {
    const result = await markTransactionPaid("someone-elses-period");

    expect(result.success).toBe(false);
    expect(monthReceipts(store(), "lease-1", OCT).toFixed(2)).toBe("0.00");
  });
});

describe("markTransactionPaid when the quittance cannot be produced", () => {
  it("carries the generator's reason back instead of dropping it", async () => {
    // The refusal message is the only actionable information the user gets about
    // why no receipt appeared, so it must survive verbatim into the payload.
    generateQuittanceMock.mockResolvedValue({ success: false, error: ADDRESS_ERROR });

    const result = await markTransactionPaid("period-oct");

    expect(result.success).toBe(true);
    expect(result.data?.quittanceError).toBe(ADDRESS_ERROR);
    expect(result.data?.receiptUrl).toBeUndefined();
  });

  it("does not report a success that produced no receipt as a clean success", async () => {
    // A successful generator call that yields no URL means there is no document
    // to download; saying nothing would send the user hunting for one.
    generateQuittanceMock.mockResolvedValue({ success: true, data: {} });

    const result = await markTransactionPaid("period-oct");

    expect(result.data?.quittanceError).toBeTruthy();
    expect(result.data?.receiptUrl).toBeUndefined();
  });
});

describe("markTransactionPaid when the quittance is produced", () => {
  it("returns the receipt url and no warning", async () => {
    generateQuittanceMock.mockResolvedValue({
      success: true,
      data: { receiptUrl: "/api/receipts/quittance-2026-0007.pdf" },
    });

    const result = await markTransactionPaid("period-oct");

    expect(result.data?.receiptUrl).toBe("/api/receipts/quittance-2026-0007.pdf");
    expect(result.data?.quittanceError).toBeUndefined();
  });
});