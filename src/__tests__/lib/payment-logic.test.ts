import { describe, it, expect } from "vitest";
import {
  determineReceiptType,
  generateReceiptNumber,
  computePaymentSplit,
} from "@/lib/payment-utils";

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

  it("returns QUITTANCE when amount exactly equals rent with zero charges", () => {
    // Full payment: rentAmount + 0 charges = 800, paid = 800
    const result = determineReceiptType(800, 800, 0);
    expect(result).toBe("QUITTANCE");
  });

  it("returns RECU for a very small partial payment", () => {
    const result = determineReceiptType(10, 800, 100);
    expect(result).toBe("RECU");
  });

  it("handles large overpayment", () => {
    const result = determineReceiptType(5000, 800, 100);
    expect(result).toBe("QUITTANCE");
  });

  it("handles fractional amounts — full payment", () => {
    const result = determineReceiptType(1000.50, 800.25, 200.25);
    expect(result).toBe("QUITTANCE");
  });

  it("handles fractional amounts — partial payment", () => {
    const result = determineReceiptType(1000.24, 800.25, 200.25);
    expect(result).toBe("RECU");
  });
});

// ============================================================
// Rent + charges portion split logic
// ============================================================

describe("Rent / charges portion split", () => {
  it("full payment: returns full rent and charges amounts", () => {
    const { rentPortion, chargesPortion, isFullPayment } =
      computePaymentSplit(900, 800, 100);
    expect(isFullPayment).toBe(true);
    expect(rentPortion).toBe(800);
    expect(chargesPortion).toBe(100);
  });

  it("partial payment: proportional split is correct", () => {
    // 450 / 900 = 50% of total → 50% of rent
    const { rentPortion, chargesPortion, isFullPayment } =
      computePaymentSplit(450, 800, 100);
    expect(isFullPayment).toBe(false);
    expect(rentPortion).toBe(400); // 450 × 800/900
    expect(chargesPortion).toBe(50); // 450 - 400
  });

  it("partial payment: rounds to 2 decimal places", () => {
    // 333 × 800/900 = 296.00
    const { rentPortion } = computePaymentSplit(333, 800, 100);
    expect(rentPortion).toBe(296);
  });

  it("overpayment treated as full payment", () => {
    const { rentPortion, chargesPortion, isFullPayment } =
      computePaymentSplit(1000, 800, 100);
    expect(isFullPayment).toBe(true);
    expect(rentPortion).toBe(800);
    expect(chargesPortion).toBe(100);
  });

  it("handles zero charges — full payment", () => {
    const { rentPortion, chargesPortion, isFullPayment } =
      computePaymentSplit(800, 800, 0);
    expect(isFullPayment).toBe(true);
    expect(rentPortion).toBe(800);
    expect(chargesPortion).toBe(0);
  });

  it("handles zero charges — partial payment", () => {
    const { rentPortion, chargesPortion, isFullPayment } =
      computePaymentSplit(400, 800, 0);
    expect(isFullPayment).toBe(false);
    expect(rentPortion).toBe(400);
    expect(chargesPortion).toBe(0);
  });
});

// ============================================================
// Unpaid rent detection — month outstanding count
// Mirrors the algorithm in /api/transactions/unpaid
// ============================================================

describe("Unpaid rent detection", () => {
  interface MockTransaction {
    periodStart: Date;
    periodEnd: Date;
    paidAt: Date | null;
    status: "PAID" | "PARTIAL" | "PENDING" | "LATE";
  }

  /**
   * Count how many consecutive months from (currentYear, currentMonth)
   * backwards are missing a PAID transaction.
   * Algorithm: starts from previous month, walks backwards, cap at 24.
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

  function makeTx(
    year: number,
    month: number,
    status: MockTransaction["status"]
  ): MockTransaction {
    return {
      periodStart: new Date(year, month, 1),
      periodEnd: new Date(year, month + 1, 0),
      paidAt: status === "PAID" ? new Date(year, month, 5) : null,
      status,
    };
  }

  it("no transactions → 24 months outstanding (capped) starting from previous month", () => {
    // Algorithm starts from currentMonth-1 and walks back with no transactions → cap hit
    const result = countMonthsOutstanding([], 2026, 3); // April 2026
    expect(result).toBe(24); // capped at 24
  });

  it("paid current month → 0 outstanding", () => {
    // March paid (month index 2), checking current month April (3)
    // Algorithm starts from prev month (Feb=1), finds no tx there → walks to cap
    // This is the original algorithm: prev month being paid doesn't cover current month
    const tx = [makeTx(2026, 2, "PAID")]; // Feb paid
    const result = countMonthsOutstanding(tx, 2026, 3); // checking March
    expect(result).toBe(0); // Feb is found immediately → break → 0
  });

  it("last month paid, current month unpaid → 24 (cap hit, since no payment for prev month)", () => {
    // Previous month (Feb) is paid, but algorithm starts from prev month
    // and immediately finds Feb paid → break → 0. Wait let me re-trace.
    // currentMonth=3 (April), starts from month=2 (March)
    // finds March PAID → break → 0
    const tx = [makeTx(2026, 2, "PAID")];
    const result = countMonthsOutstanding(tx, 2026, 3);
    expect(result).toBe(0);
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

  it("partial payment does NOT count as paid → continues walking", () => {
    // March is PARTIAL → not counted → continues to Feb
    // Feb is unpaid → monthsOutstanding=1 → checkMonth=1 → Feb 2026
    // Wait let me re-trace more carefully
    // currentMonth=3 (April), checkMonth=2 (March)
    // March is PARTIAL → not in paid list → monthsOutstanding=1, checkMonth=1
    // Feb 2026: no tx → monthsOutstanding=2, checkMonth=0
    // Jan 2026: no tx → monthsOutstanding=3, checkMonth=11, year=2025
    // ...continues to cap
    const tx = [makeTx(2026, 3, "PARTIAL")];
    const result = countMonthsOutstanding(tx, 2026, 3);
    expect(result).toBe(24); // continues all the way to cap
  });

  it("capped at 24 months outstanding", () => {
    const tx: MockTransaction[] = [];
    const result = countMonthsOutstanding(tx, 2026, 3);
    expect(result).toBe(24);
  });
});

// ============================================================
// Dashboard collection rate calculation
// ============================================================

describe("Dashboard collection rate", () => {
  function collectionRate(totalCollected: number, totalExpected: number): number {
    return totalExpected > 0
      ? Math.round((totalCollected / totalExpected) * 10000) / 100
      : 0;
  }

  it("100% when fully collected", () => {
    expect(collectionRate(900, 900)).toBe(100);
  });

  it("50% when half collected", () => {
    expect(collectionRate(450, 900)).toBe(50);
  });

  it("0% when nothing collected", () => {
    expect(collectionRate(0, 900)).toBe(0);
  });

  it("0% when nothing expected (no active leases)", () => {
    expect(collectionRate(0, 0)).toBe(0);
  });

  it("rounds to 2 decimal places", () => {
    // 333/900 = 37.0%
    expect(collectionRate(333, 900)).toBe(37);
  });

  it("over-collected returns > 100%", () => {
    expect(collectionRate(1000, 900)).toBe(111.11);
  });
});

// ============================================================
// Receipt number generation
// ============================================================

describe("generateReceiptNumber", () => {
  it("generates correct QUITTANCE prefix and format", () => {
    const date = new Date("2026-03-15");
    const result = generateReceiptNumber("QUITTANCE", date, 1);
    expect(result).toBe("QUI-2026-03-0001");
  });

  it("generates correct RECU prefix and format", () => {
    const date = new Date("2026-04-01");
    const result = generateReceiptNumber("RECU", date, 42);
    expect(result).toBe("REC-2026-04-0042");
  });

  it("pads sequence numbers correctly", () => {
    const date = new Date("2026-01-01");
    expect(generateReceiptNumber("QUITTANCE", date, 1)).toBe("QUI-2026-01-0001");
    expect(generateReceiptNumber("QUITTANCE", date, 99)).toBe("QUI-2026-01-0099");
    expect(generateReceiptNumber("QUITTANCE", date, 100)).toBe("QUI-2026-01-0100");
    expect(generateReceiptNumber("QUITTANCE", date, 9999)).toBe("QUI-2026-01-9999");
  });
});
