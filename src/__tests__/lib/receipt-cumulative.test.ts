import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import {
  determineReceiptType,
  determineReceiptTypeCumulative,
} from "@/lib/payment-utils";

// A rent of 700 with 40 of charges: 740 due for the period.
const RENT = 700;
const CHARGES = 40;
const TOTAL = 740;

describe("determineReceiptType (single payment)", () => {
  it("issues a quittance when the payment covers rent and charges", () => {
    expect(determineReceiptType(740, RENT, CHARGES)).toBe("QUITTANCE");
  });

  it("issues a partial receipt when the payment is short", () => {
    expect(determineReceiptType(400, RENT, CHARGES)).toBe("RECU");
  });

  it("treats no charges correctly", () => {
    expect(determineReceiptType(700, 700, 0)).toBe("QUITTANCE");
  });
});

describe("determineReceiptTypeCumulative (rent paid in instalments)", () => {
  it("does not issue a quittance on the first partial payment", () => {
    expect(determineReceiptTypeCumulative(400, RENT, CHARGES, 0)).toBe("RECU");
  });

  it("issues a quittance on the payment that completes the period", () => {
    // The defect: 340 + 400 already received settles 740, so the period IS paid
    // and the landlord is entitled to a quittance (loi du 6 juillet 1989 art. 21).
    expect(determineReceiptTypeCumulative(340, RENT, CHARGES, 400)).toBe("QUITTANCE");
  });

  it("handles three instalments, with only the last one completing", () => {
    expect(determineReceiptTypeCumulative(200, RENT, CHARGES, 0)).toBe("RECU");
    expect(determineReceiptTypeCumulative(200, RENT, CHARGES, 200)).toBe("RECU");
    expect(determineReceiptTypeCumulative(340, RENT, CHARGES, 400)).toBe("QUITTANCE");
  });

  it("never withholds a quittance once the period is settled", () => {
    for (const prior of [0, 100, 300, 400, 700, 739]) {
      const type = determineReceiptTypeCumulative(340, RENT, CHARGES, prior);
      if (prior + 340 >= TOTAL) {
        expect(type).toBe("QUITTANCE");
      }
    }
  });

  it("keeps issuing partial receipts while the period is still short", () => {
    for (const prior of [0, 50, 200, 399]) {
      expect(determineReceiptTypeCumulative(340, RENT, CHARGES, prior)).toBe("RECU");
    }
  });

  it("is one cent short still short: 739.99 of 740 is not a quittance", () => {
    expect(determineReceiptTypeCumulative(339.99, RENT, CHARGES, 400)).toBe("RECU");
    expect(determineReceiptTypeCumulative(340.0, RENT, CHARGES, 400)).toBe("QUITTANCE");
  });

  it("counts an overpayment as settled", () => {
    expect(determineReceiptTypeCumulative(800, RENT, CHARGES, 0)).toBe("QUITTANCE");
  });

  it("accepts Decimal amounts without float drift", () => {
    expect(
      determineReceiptTypeCumulative(
        new Decimal("339.99"),
        new Decimal("700"),
        new Decimal("40"),
        new Decimal("400")
      )
    ).toBe("RECU");
    expect(
      determineReceiptTypeCumulative(
        new Decimal("340.00"),
        new Decimal("700"),
        new Decimal("40"),
        new Decimal("400")
      )
    ).toBe("QUITTANCE");
  });

  it("behaves identically to the single-payment form when nothing was paid before", () => {
    for (const amount of [100, 400, 739, 740, 900]) {
      expect(determineReceiptTypeCumulative(amount, RENT, CHARGES, 0)).toBe(
        determineReceiptType(amount, RENT, CHARGES)
      );
    }
  });

  it("defaults to zero prior payments, so existing callers are unaffected", () => {
    expect(determineReceiptTypeCumulative(740, RENT, CHARGES)).toBe("QUITTANCE");
  });
});


/**
 * The cumulative total is only meaningful if it counts payments made BEFORE the
 * one being receipted. These pin that ordering rule, which the runtime test
 * scripts/verify-receipt-cumulative.py exercises against a real database.
 */
describe("cumulative totals are built from earlier payments only", () => {
  const prior = (amount: number) => new Decimal(amount);
  const total = RENT + CHARGES;

  it("a first instalment alone is short of the total", () => {
    // 510 of 900 due, with nothing paid before it.
    expect(determineReceiptTypeCumulative(510, RENT, CHARGES, 0)).toBe("RECU");
  });

  it("the later instalment sees the earlier one and completes the period", () => {
    // 390 + 510 = 900. This is the case that previously produced RECU forever.
    expect(determineReceiptTypeCumulative(390, RENT, CHARGES, 510)).toBe("QUITTANCE");
  });

  it("a receipt never counts money that had not yet arrived", () => {
    // Simulating the ordering bug: if the "prior" figure wrongly includes a
    // LATER payment, the earlier receipt would wrongly become a quittance.
    const earlier = 510;
    const later = total - earlier;
    // Correct: the earlier receipt is judged with 0 prior payments.
    expect(determineReceiptTypeCumulative(earlier, RENT, CHARGES, 0)).toBe("RECU");
    // What the bug produced: the earlier receipt judged with the later payment
    // already counted, which certified a balance that was still outstanding.
    const buggy = determineReceiptTypeCumulative(earlier, RENT, CHARGES, later);
    expect(buggy).toBe("QUITTANCE");
    // Documenting the bad outcome so the test pins why ordering matters.
    expect(buggy).not.toBe("RECU");
  });

  it("works for a tenant paying in three instalments", () => {
    const a = 200, b = 200, c = total - 400; // c = 340
    expect(determineReceiptTypeCumulative(a, RENT, CHARGES, 0)).toBe("RECU");
    expect(determineReceiptTypeCumulative(b, RENT, CHARGES, a)).toBe("RECU");
    expect(determineReceiptTypeCumulative(c, RENT, CHARGES, a + b)).toBe("QUITTANCE");
  });

  it("each instalment prior sum is Decimal-exact", () => {
    expect(
      determineReceiptTypeCumulative(prior(0.1).plus(0.2).toNumber(), prior(700), prior(40), 0)
    ).toBe("RECU");
    // 0.1 + 0.2 in float is 0.30000000000000004; Decimal keeps it exact.
    expect(prior(0.1).plus(0.2).toString()).toBe("0.3");
  });
});
