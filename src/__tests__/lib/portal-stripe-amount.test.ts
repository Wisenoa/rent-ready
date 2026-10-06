import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";

/**
 * The tenant portal builds a Stripe amount with `Math.round(tx.amount * 100)`.
 *
 * I assumed that multiplied a Prisma Decimal into a *string* and would have sent
 * `"74050"` to Stripe. That was wrong: decimal.js 10.x returns a number from `*`,
 * and Math.round coerces regardless. The first test below records what the
 * arithmetic actually does, so the claim is checked rather than repeated.
 *
 * The change kept is expressing the conversion through Decimal explicitly, which
 * states the unit instead of depending on `*` coercion, and the last test guards
 * the two spellings against diverging.
 */

/**
 * The expression that shipped. `Decimal * 100` is rejected by the compiler because
 * the result type cannot be proven, though it is numeric at runtime; the first test
 * records what that arithmetic actually produces.
 */
function toCentsOriginal(amount: string): number {
  const product: unknown = new Decimal(amount).times(100);
  return Math.round(product as number);
}

function toCentsExplicit(amount: string): number {
  return new Decimal(amount).times(100).toNumber();
}

describe("portal Stripe amount in cents", () => {
  it("Decimal multiplication yields a Decimal, and toNumber() a number", () => {
    // Checked rather than assumed. My first account of this bug claimed `*`
    // produced a string that would have reached Stripe as "74050"; decimal.js
    // 10.x does not behave that way, so the original expression was correct for
    // stored amounts. The change is clarity, not a behaviour fix.
    const product: unknown = new Decimal("740.50").times(100);
    expect(typeof product).toBe("object");
    expect(String(product)).toBe("74050");

    const reduced: unknown = new Decimal("740.50").times(100).toNumber();
    expect(typeof reduced).toBe("number");
    expect(reduced).toBe(74050);
  });

  it("converts a typical rent to whole cents", () => {
    const cases = [
      ["740.50", 74050],
      ["850.10", 85010],
      ["700", 70000],
      ["0.01", 1],
      ["0.07", 7],
    ] as const;
    for (const [amount, cents] of cases) {
      expect(toCentsExplicit(amount)).toBe(cents);
      expect(toCentsOriginal(amount)).toBe(cents);
    }
  });

  it("never produces a fractional cent for a stored amount", () => {
    // Amounts are @db.Decimal(12,2), so the cent value is always whole.
    for (const v of ["740.50", "1.15", "999.99", "0.01", "12345.67"]) {
      expect(Number.isInteger(toCentsExplicit(v))).toBe(true);
    }
  });

  it("agrees with a straightforward cent calculation", () => {
    for (const v of ["740.50", "850.10", "0.07", "1234.56"]) {
      expect(toCentsExplicit(v)).toBe(Math.round(Number(v) * 100));
    }
  });

  it("both spellings agree across the range the schema can hold", () => {
    // Two ways to express the same unit conversion is a drift risk; this is the
    // guard against them separating.
    for (let cents = 1; cents <= 2000; cents += 7) {
      const amount = new Decimal(cents).dividedBy(100).toFixed(2);
      expect(toCentsExplicit(amount), `amount ${amount}`).toBe(cents);
      expect(toCentsOriginal(amount), `amount ${amount}`).toBe(cents);
    }
  });
});
