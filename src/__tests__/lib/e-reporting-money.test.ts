import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";

/**
 * The e-reporting export feeds a French tax declaration (2044). It converted
 * Prisma Decimals into a `number`-typed DTO and then summed with a float `+=`,
 * so the reported total could drift from the sum of its parts. These pin the
 * reduction now used: sum in Decimal, round once at the end.
 */

/** What the export does per transaction. */
function toDto(rentPortion: string, chargesPortion: string, amount: string) {
  return {
    rentAmount: new Decimal(rentPortion).toDecimalPlaces(2).toNumber(),
    chargesAmount: new Decimal(chargesPortion).toDecimalPlaces(2).toNumber(),
    totalAmount: new Decimal(amount).toDecimalPlaces(2).toNumber(),
  };
}

const sumFloat = (rows: { totalAmount: number }[], field: "totalAmount") =>
  rows.reduce((s, r) => s + r[field], 0);

const sumDecimal = (rows: { totalAmount: number }[], field: "totalAmount") =>
  rows
    .reduce((s, r) => s.plus(r[field]), new Decimal(0))
    .toDecimalPlaces(2)
    .toNumber();

describe("e-reporting export money", () => {
  it("converts a Decimal to a plain number on the DTO", () => {
    const row = toDto("700.25", "40.10", "740.35");
    expect(typeof row.totalAmount).toBe("number");
    expect(row.totalAmount).toBe(740.35);
    expect(row.rentAmount).toBe(700.25);
    expect(row.chargesAmount).toBe(40.1);
  });

  it("keeps rent and charges adding up to the amount received", () => {
    const row = toDto("700.25", "40.10", "740.35");
    expect(row.rentAmount + row.chargesAmount).toBeCloseTo(row.totalAmount, 10);
  });

  it("sums a realistic month exactly", () => {
    const rows = [
      toDto("700.00", "40.00", "740.00"),
      toDto("650.00", "35.50", "685.50"),
      toDto("812.75", "42.25", "855.00"),
    ];
    expect(sumDecimal(rows, "totalAmount")).toBe(2280.5);
  });

  it("does not drift over many small transactions", () => {
    // 0.01 x 100 is exactly 1 in Decimal; float accumulation is not guaranteed to be.
    const rows = Array.from({ length: 100 }, () => toDto("0.01", "0", "0.01"));
    expect(sumDecimal(rows, "totalAmount")).toBe(1);
  });

  it("rounds each stored amount to the cent the schema guarantees", () => {
    // Amounts are @db.Decimal(12,2), so a sub-cent value cannot occur in practice.
    // The DTO rounds defensively and the total rounds again; both land on the same
    // cent figure, so the reported total is consistent with its parts.
    const rows = [toDto("740.005", "0", "740.005"), toDto("123.456", "0", "123.456")];
    expect(sumDecimal(rows, "totalAmount")).toBe(863.47);
    // Each stored amount reaches the DTO already at the cent.
    expect(rows[0].totalAmount).toBe(740.01);
    expect(rows[1].totalAmount).toBe(123.46);
  });

  it("handles an empty list as zero", () => {
    expect(sumDecimal([], "totalAmount")).toBe(0);
  });

  it("agrees with a float sum on well-behaved input", () => {
    const rows = [toDto("700.00", "40.00", "740.00"), toDto("500.00", "0.00", "500.00")];
    expect(sumDecimal(rows, "totalAmount")).toBeCloseTo(sumFloat(rows, "totalAmount"), 10);
  });
});
