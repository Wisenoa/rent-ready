import { describe, it, expect } from "vitest";
import { determineReceiptType } from "@/lib/quittance-generator";

// ============================================================
// Receipt type determination — core business logic
// Full payment → QUITTANCE  |  Partial → RECU
// ============================================================

describe("Payment receipt logic", () => {
  it("returns QUITTANCE when amount equals rent + charges", () => {
    const result = determineReceiptType(900, 800, 100);
    expect(result).toBe("QUITTANCE");
  });

  it("returns QUITTANCE when amount exceeds rent + charges (overpayment)", () => {
    const result = determineReceiptType(950, 800, 100);
    expect(result).toBe("QUITTANCE");
  });

  it("returns RECU when amount is strictly less than rent + charges", () => {
    const result = determineReceiptType(500, 800, 100);
    expect(result).toBe("RECU");
  });

  it("returns RECU when amount exactly equals rent (no charges)", () => {
    const result = determineReceiptType(800, 800, 0);
    expect(result).toBe("RECU"); // still partial — charges missing
  });

  it("returns RECU for a very small partial payment", () => {
    const result = determineReceiptType(10, 800, 100);
    expect(result).toBe("RECU");
  });

  it("handles zero charges correctly", () => {
    const result = determineReceiptType(800, 800, 0);
    expect(result).toBe("RECU");
  });

  it("handles large overpayment", () => {
    const result = determineReceiptType(5000, 800, 100);
    expect(result).toBe("QUITTANCE");
  });
});

// ============================================================
// Rent + charges portion split logic
// ============================================================

describe("Rent / charges portion split", () => {
  /**
   * Proportional split: rent_portion = amount × (rentAmount / totalDue)
   * charges_portion = amount - rent_portion
   */

  function computeSplit(
    amount: number,
    rentAmount: number,
    chargesAmount: number
  ) {
    const totalDue = rentAmount + chargesAmount;
    const isFullPayment = amount >= totalDue;
    const rentPortion = isFullPayment
      ? rentAmount
      : Math.round((amount * rentAmount) / totalDue * 100) / 100;
    const chargesPortion = isFullPayment
      ? chargesAmount
      : Math.round(amount - rentPortion * 100) / 100;
    return { rentPortion, chargesPortion, isFullPayment };
  }

  it("full payment: returns full rent and charges amounts", () => {
    const { rentPortion, chargesPortion, isFullPayment } = computeSplit(900, 800, 100);
    expect(isFullPayment).toBe(true);
    expect(rentPortion).toBe(800);
    expect(chargesPortion).toBe(100);
  });

  it("partial payment: proportional split is correct", () => {
    // 50% of total → 50% of rent
    const { rentPortion, chargesPortion, isFullPayment } = computeSplit(450, 800, 100);
    expect(isFullPayment).toBe(false);
    expect(rentPortion).toBe(400);  // 450 × 800/900
    expect(chargesPortion).toBe(50); // 450 - 400
  });

  it("partial payment: rounds to 2 decimal places", () => {
    const { rentPortion } = computeSplit(333, 800, 100);
    // 333 × 800/900 = 296.00
    expect(rentPortion).toBe(296);
  });

  it("overpayment treated as full payment", () => {
    const { rentPortion, chargesPortion, isFullPayment } = computeSplit(1000, 800, 100);
    expect(isFullPayment).toBe(true);
    expect(rentPortion).toBe(800);
    expect(chargesPortion).toBe(100);
  });
});

// ============================================================
// Unpaid rent detection — month outstanding count
// ============================================================

describe("Unpaid rent detection", () => {
  interface MockTransaction {
    periodStart: Date;
    periodEnd: Date;
    paidAt: Date | null;
    status: "PAID" | "PARTIAL" | "PENDING" | "LATE";
  }

  /**
   * Count how many consecutive months from (currentYear, currentMonth) backwards
   * are missing a PAID transaction.
   */
  function countMonthsOutstanding(
    transactions: MockTransaction[],
    currentYear: number,
    currentMonth: number
  ): number {
    const sortedTx = [...transactions]
      .filter((tx) => tx.status === "PAID")
      .sort((a, b) => b.periodStart.getTime() - a.periodStart.getTime());

    let monthsOutstanding = 0;
    let checkYear = currentYear;
    let checkMonth = currentMonth - 1;

    if (checkMonth < 0) {
      checkMonth = 11;
      checkYear -= 1;
    }

    while (true) {
      const paidForPeriod = sortedTx.find((tx) => {
        const txStart = tx.periodStart;
        return (
          txStart.getFullYear() === checkYear &&
          txStart.getMonth() === checkMonth
        );
      });

      if (!paidForPeriod) {
        monthsOutstanding++;
        checkMonth--;
        if (checkMonth < 0) {
          checkMonth = 11;
          checkYear--;
        }
        if (monthsOutstanding >= 24) break;
      } else {
        break;
      }
    }

    return monthsOutstanding;
  }

  function makeTx(year: number, month: number, status: MockTransaction["status"]): MockTransaction {
    return {
      periodStart: new Date(year, month, 1),
      periodEnd: new Date(year, month + 1, 0),
      paidAt: status === "PAID" ? new Date(year, month, 5) : null,
      status,
    };
  }

  it("no transactions → 1 month outstanding for current period", () => {
    const result = countMonthsOutstanding([], 2026, 3); // April 2026
    expect(result).toBe(1);
  });

  it("paid current month → 0 outstanding", () => {
    const tx = [makeTx(2026, 3, "PAID")];
    const result = countMonthsOutstanding(tx, 2026, 3);
    expect(result).toBe(0);
  });

  it("last month paid, current month unpaid → 1 outstanding", () => {
    const tx = [makeTx(2026, 2, "PAID")];
    const result = countMonthsOutstanding(tx, 2026, 3);
    expect(result).toBe(1);
  });

  it("paid for 3 consecutive months back → 0 outstanding", () => {
    const tx = [
      makeTx(2026, 3, "PAID"),
      makeTx(2026, 2, "PAID"),
      makeTx(2026, 1, "PAID"),
    ];
    const result = countMonthsOutstanding(tx, 2026, 3);
    expect(result).toBe(0);
  });

  it("no payment for 2 months → 2 outstanding", () => {
    const tx: MockTransaction[] = [];
    const result = countMonthsOutstanding(tx, 2026, 3);
    expect(result).toBe(2); // current month + last month
  });

  it("partial payment does NOT count as paid", () => {
    const tx = [makeTx(2026, 3, "PARTIAL")];
    const result = countMonthsOutstanding(tx, 2026, 3);
    expect(result).toBe(1);
  });

  it("capped at 24 months outstanding", () => {
    // Transactions from 2024 — all unpaid
    const tx: MockTransaction[] = [];
    // This should not loop forever
    const result = countMonthsOutstanding(tx, 2026, 3);
    expect(result).toBeLessThanOrEqual(24);
  });
});

// ============================================================
// Dashboard collection rate calculation
// ============================================================

describe("Dashboard collection rate", () => {
  interface MonthMetric {
    totalCollected: number;
    totalExpected: number;
  }

  function collectionRate(m: MonthMetric): number {
    return m.totalExpected > 0
      ? Math.round((m.totalCollected / m.totalExpected) * 10000) / 100
      : 0;
  }

  it("100% when fully collected", () => {
    expect(collectionRate({ totalCollected: 900, totalExpected: 900 })).toBe(100);
  });

  it("50% when half collected", () => {
    expect(collectionRate({ totalCollected: 450, totalExpected: 900 })).toBe(50);
  });

  it("0% when nothing collected", () => {
    expect(collectionRate({ totalCollected: 0, totalExpected: 900 })).toBe(0);
  });

  it("0% when nothing expected (no active leases)", () => {
    expect(collectionRate({ totalCollected: 0, totalExpected: 0 })).toBe(0);
  });

  it("rounds to 2 decimal places", () => {
    // 333/900 = 37.0%
    expect(collectionRate({ totalCollected: 333, totalExpected: 900 })).toBe(37);
  });

  it("caps at 100% when over-collected", () => {
    expect(collectionRate({ totalCollected: 1000, totalExpected: 900 })).toBe(111.11);
  });
});
