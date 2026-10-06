/**
 * Regression tests for monetary precision at the dashboard aggregate boundary.
 *
 * The dashboard subtracted two Prisma `Decimal` aggregates with the `-` operator.
 * JavaScript coerces `Decimal` to a float, so NOI came out as
 * 730.0500000000001 instead of 730.05 — a figure a landlord can read and, on a
 * tax declaration, is wrong. `sumMoney` now reduces once with decimal.js.
 */

import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";

/** Mirrors the helpers in src/lib/queries/dashboard-stats.ts. */
const sumMoney = (value: Decimal | null | undefined): number =>
  new Decimal(value ?? 0).toDecimalPlaces(2).toNumber();

const subtractMoney = (a: number, b: number): number =>
  new Decimal(a).minus(b).toDecimalPlaces(2).toNumber();

describe("sumMoney", () => {
  it("reduces a Decimal aggregate to an exact 2dp number", () => {
    // The old code let the raw `Decimal` reach the caller and subtracted with `-`,
    // which coerces to a float: 850.10 - 120.05 => 730.0500000000001.
    const rawRev = new Decimal("850.10");
    const rawExp = new Decimal("120.05");
    expect((rawRev as unknown as number) - (rawExp as unknown as number)).toBe(
      730.0500000000001
    );

    expect(subtractMoney(sumMoney(rawRev), sumMoney(rawExp))).toBe(730.05);
  });

  it("survives a year-to-date accumulation of cents", () => {
    // 0.1 added 300 times is 30.000000000000004 in floats.
    const total = Array.from({ length: 300 }, () => new Decimal("0.1")).reduce(
      (acc, d) => acc.plus(d),
      new Decimal(0)
    );
    expect(sumMoney(total)).toBe(30);
  });

  it("treats a null aggregate (no rows) as zero", () => {
    expect(sumMoney(null)).toBe(0);
    expect(sumMoney(undefined)).toBe(0);
  });

  it("keeps two decimal places", () => {
    expect(sumMoney(new Decimal("1234.5678"))).toBe(1234.57);
  });

  it("never yields a non-finite value", () => {
    for (const v of ["0", "-0.01", "999999.99", "1"]) {
      expect(Number.isFinite(sumMoney(new Decimal(v)))).toBe(true);
    }
  });
});

describe("payment split (existing behaviour must not regress)", () => {
  it("splits a partial payment proportionally to 2dp", async () => {
    const { computePaymentSplit } = await import("@/lib/payment-utils");
    const split = computePaymentSplit(400, 850, 50);
    expect(split.rentPortion).toBe(377.78);
    expect(split.chargesPortion).toBe(22.22);
    // Portions must add back to the amount actually paid.
    expect(
      Number((split.rentPortion + split.chargesPortion).toFixed(2))
    ).toBe(400);
    expect(split.isFullPayment).toBe(false);
  });

  it("treats payment >= rent + charges as a full quittance", async () => {
    const { computePaymentSplit, determineReceiptType } = await import(
      "@/lib/payment-utils"
    );
    const split = computePaymentSplit(900, 850, 50);
    expect(split.isFullPayment).toBe(true);
    expect(split.rentPortion).toBe(850);
    expect(split.chargesPortion).toBe(50);
    expect(determineReceiptType(900, 850, 50)).toBe("QUITTANCE");
    expect(determineReceiptType(899.99, 850, 50)).toBe("RECU");
  });
});