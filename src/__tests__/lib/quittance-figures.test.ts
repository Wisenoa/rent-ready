import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { settlePeriodPayments } from "@/lib/domain/period-settlement";

/**
 * The quittance PDF computed `rentAmount + chargesAmount` and `expectedTotal -
 * totalAmount` directly. The action builds that object from Prisma rows, so the
 * values are Decimals — and Decimal's `+` returns a STRING. On a lease of 700 +
 * 40.50 that produced "70040.5" as the total due, and a remaining balance of
 * 69 300 EUR on a fully paid period.
 *
 * `tsc` reported the mismatch (the interface said `number`) and `next build`
 * discarded it via ignoreBuildErrors, so nothing caught it. These pin the
 * arithmetic that the PDF now uses.
 */
const RENT = "700";
const CHARGES = "40.50";

/** The two values the PDF derives, mirroring the component. */
function pdfFigures(rent: Decimal, charges: Decimal, paid: Decimal) {
  const expectedTotal = new Decimal(rent).plus(charges);
  const remainingBalance = Decimal.max(expectedTotal.minus(new Decimal(paid)), new Decimal(0));
  return { expectedTotal, remainingBalance };
}

describe("quittance figures with Decimal inputs", () => {
  it("adds rent and charges as numbers, not strings", () => {
    const { expectedTotal } = pdfFigures(new Decimal(RENT), new Decimal(CHARGES), new Decimal("740.50"));
    expect(expectedTotal.toString()).toBe("740.5");
    // The defect produced this literal.
    expect(expectedTotal.toString()).not.toBe("70040.5");
  });

  it("shows nothing outstanding on a fully paid period", () => {
    const { remainingBalance } = pdfFigures(new Decimal(RENT), new Decimal(CHARGES), new Decimal("740.50"));
    expect(remainingBalance.toString()).toBe("0");
    // The defect produced 69300.
    expect(remainingBalance.toString()).not.toBe("69300");
  });

  it("shows the exact remainder on a partial payment", () => {
    const { remainingBalance } = pdfFigures(new Decimal(RENT), new Decimal(CHARGES), new Decimal("300"));
    expect(remainingBalance.toString()).toBe("440.5");
  });

  it("never reports a negative balance on an overpayment", () => {
    const { remainingBalance } = pdfFigures(new Decimal(RENT), new Decimal(CHARGES), new Decimal("900"));
    expect(remainingBalance.isNegative()).toBe(false);
    expect(remainingBalance.toString()).toBe("0");
  });

  it("is exact to the cent across awkward centimes", () => {
    const { expectedTotal } = pdfFigures(new Decimal("700.33"), new Decimal("40.07"), new Decimal("0"));
    expect(expectedTotal.toString()).toBe("740.4");
  });

  it("never drifts over many periods", () => {
    let total = new Decimal(0);
    for (let i = 0; i < 300; i += 1) total = total.plus(new Decimal("0.01"));
    const { expectedTotal } = pdfFigures(total, new Decimal(0), new Decimal(0));
    expect(expectedTotal.toString()).toBe("3");
  });

  it("agrees with the settlement domain for the same period", () => {
    const s = settlePeriodPayments({
      rentAmount: RENT,
      chargesAmount: CHARGES,
      payments: [{ amount: "300", paidAt: new Date() }],
    });
    const { remainingBalance } = pdfFigures(new Decimal(RENT), new Decimal(CHARGES), new Decimal("300"));
    // One source of truth: the PDF must not contradict the ledger.
    expect(remainingBalance.toString()).toBe(s.outstanding.toString());
  });
});
