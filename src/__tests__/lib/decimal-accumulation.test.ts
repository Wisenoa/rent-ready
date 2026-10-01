// @ts-nocheck -- This file deliberately reproduces the broken arithmetic in order
// to prove it is broken: `number + Decimal` and `reduce(..., 0)` are exactly the
// type errors the compiler reported in the dashboards, and these tests assert the
// runtime consequence (a concatenated string rather than a total). The whole file
// opts out so the intended failures are not confused with accidental ones.

import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";

/**
 * A number-seeded accumulator concatenated Decimals into a string.
 *
 * Found on the property and tenant pages (`reduce((sum, tx) => sum + tx.amount, 0)`)
 * and in the transactions dashboard (`totalCollected += tx.amount`). Decimal's `+`
 * is string concatenation, so a property owing 740,50 + 300,25 rendered as the
 * literal string "0740.5300.25", and `rentAmount + chargesAmount` on the two
 * dashboard pages produced "85050" instead of 900.
 *
 * These pin the failure mode so the arithmetic cannot be reintroduced by
 * someone reaching for `+` again.
 */

/** The pattern that was broken. */
function numberSeededReduceBroken(amounts: Decimal[]): unknown {
  return amounts.reduce((sum, tx) => sum + tx, 0);
}

/** The pattern now used. */
function decimalSeededReduce(amounts: Decimal[]): Decimal {
  return amounts.reduce((sum, tx) => sum.plus(tx), new Decimal(0));
}

describe("money accumulation on Decimal", () => {
  it("a number-seeded reduce concatenates instead of adding", () => {
    const broken = numberSeededReduceBroken([new Decimal("740.50")]);
    expect(typeof broken).toBe("string");
    // Documented so the test pins why the seed must be a Decimal.
    expect(String(broken)).toBe("0740.5");
  });

  it("the broken reduce mangles a realistic property total", () => {
    const broken = String(
      numberSeededReduceBroken([new Decimal("740.50"), new Decimal("300.25")])
    );
    expect(broken).toBe("0740.5300.25");
    expect(broken).not.toContain("1040.75");
  });

  it("a Decimal-seeded reduce adds correctly", () => {
    const total = decimalSeededReduce([new Decimal("740.50"), new Decimal("300.25")]);
    expect(total.toString()).toBe("1040.75");
  });

  it("rent plus charges is addition, not concatenation", () => {
    const rent = new Decimal("850");
    const charges = new Decimal("50");

    // What the dashboards did.
    expect(typeof (rent + charges)).toBe("string");
    expect(String(rent + charges)).toBe("85050");

    // What they do now.
    expect(new Decimal(rent).plus(charges).toString()).toBe("900");
  });

  it("+= on a number accumulator also concatenates", () => {
    let broken = 0;
    broken += new Decimal("740.50");
    expect(typeof broken).toBe("string");
    broken += new Decimal("300.25");
    expect(String(broken)).toBe("0740.5300.25");
  });

  it("repeated accumulation stays exact to the cent", () => {
    const amounts = Array.from({ length: 365 }, () => new Decimal("740.50"));
    const total = decimalSeededReduce(amounts);
    // 365 x 740.50, which float accumulation would not land on exactly.
    expect(total.toString()).toBe("270282.5");
  });

  it("a single amount accumulates unchanged", () => {
    expect(decimalSeededReduce([new Decimal("640.55")]).toString()).toBe("640.55");
  });

  it("an empty list sums to zero, not an empty string", () => {
    expect(decimalSeededReduce([]).toString()).toBe("0");
    expect(String(numberSeededReduceBroken([]))).toBe("0");
  });

  it("formatting the sum yields the currency a landlord expects", () => {
    const total = decimalSeededReduce([new Decimal("740.50"), new Decimal("300.25")]);
    const rendered = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
      total.toDecimalPlaces(2).toNumber()
    );
    expect(rendered).toContain("1");
    expect(rendered).not.toContain("0740");
  });
});
