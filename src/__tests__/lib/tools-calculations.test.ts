/**
 * The arithmetic behind /outils/calculateur-irl and
 * /outils/calculateur-charges-locatives: parsing what a landlord types,
 * rounding, and the cases a calculator gets wrong when it uses floats.
 */
import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";

import {
  formatEuros,
  formatIndex,
  formatSignedEuros,
  formatSignedPercent,
  parseAmount,
  toCents,
} from "@/lib/tools/amount";
import { findPair, indexVariation, reviseRent, revisionPairs } from "@/lib/tools/irl-revision";
import {
  computeRegularisation,
  daysInclusive,
  parseIsoDate,
  validateRegularisation,
  type RegularisationInput,
} from "@/lib/tools/charges-regularisation";
import { IRL_INDICES, calculateRentRevision, getLatestIrl } from "@/lib/irl-calculator";

const d = (value: Decimal.Value) => new Decimal(value);
// Intl puts a narrow no-break space between thousands and a no-break space before €.
const plain = (text: string) => text.replace(/[  ]/g, " ");

describe("saisie d'un montant", () => {
  it.each([
    ["800", "800"],
    ["800,50", "800.5"],
    ["800.50", "800.5"],
    ["1 250,50", "1250.5"],
    ["1 250,50 €", "1250.5"],
    ["1.250,50", "1250.5"],
    ["€ 75", "75"],
    [" 0,5 ", "0.5"],
    ["0", "0"],
  ])("reads %j as %s euros", (input, expected) => {
    const parsed = parseAmount(input);
    expect(parsed.ok && parsed.value.toString()).toBe(expected);
  });

  it.each([
    ["", "empty"],
    ["   ", "empty"],
    ["abc", "invalid"],
    ["12,3,4", "invalid"],
    ["1e3", "invalid"],
    ["-50", "negative"],
    ["−50", "negative"],
    ["10,555", "too-precise"],
    ["20000000", "too-large"],
  ])("rejects %j (%s)", (input, error) => {
    expect(parseAmount(input)).toEqual({ ok: false, error });
  });

  it("never goes through a float: 0,1 + 0,2 is 0,3", () => {
    const a = parseAmount("0,1");
    const b = parseAmount("0,2");
    expect(a.ok && b.ok && a.value.plus(b.value).toString()).toBe("0.3");
  });
});

describe("affichage français", () => {
  it("formats euros with French separators", () => {
    expect(plain(formatEuros(d("1250.5")))).toBe("1 250,50 €");
    expect(plain(formatSignedEuros(d("9.22")))).toBe("+9,22 €");
    expect(plain(formatSignedEuros(d("-3.1")))).toBe("−3,10 €");
    expect(plain(formatSignedEuros(d("0")))).toBe("0,00 €");
  });

  it("formats a variation and an index as INSEE prints them", () => {
    expect(formatSignedPercent(d("1.15"))).toBe("+1,15 %");
    expect(formatSignedPercent(d("-0.4249"))).toBe("−0,42 %");
    expect(formatIndex(146.6)).toBe("146,60");
  });

  it("rounds half up to the cent, not to the nearest float", () => {
    // 1.005 is 1.00499999… as a float, so Math.round(1.005 * 100) / 100 gives 1.
    expect(Math.round(1.005 * 100) / 100).toBe(1);
    expect(toCents(d("1.005")).toString()).toBe("1.01");
    expect(toCents(d("2.675")).toString()).toBe("2.68");
  });
});

describe("révision IRL", () => {
  it("compares a quarter with the same quarter one year earlier", () => {
    const pair = findPair(2, 2026)!;
    expect(pair.current.quarter).toBe("T2-2026");
    expect(pair.previous.quarter).toBe("T2-2025");
  });

  it("offers only published pairs, latest first, for every quarter", () => {
    for (const trimester of [1, 2, 3, 4] as const) {
      const pairs = revisionPairs(trimester);
      expect(pairs.length).toBeGreaterThan(4);
      expect(pairs[0].current.year).toBeGreaterThan(pairs[1].current.year);
      for (const { current, previous } of pairs) {
        expect(previous.trimester).toBe(trimester);
        expect(previous.year).toBe(current.year - 1);
      }
    }
    // T1 2020 is the oldest index: it has no year-ago pair to offer.
    expect(revisionPairs(1).some((p) => p.current.quarter === "T1-2020")).toBe(false);
  });

  it("never offers an index that is not in the published table", () => {
    const latest = getLatestIrl();
    for (const trimester of [1, 2, 3, 4] as const) {
      for (const { current } of revisionPairs(trimester)) {
        expect(IRL_INDICES).toContainEqual(current);
        expect(current.year * 10 + current.trimester).toBeLessThanOrEqual(latest.year * 10 + latest.trimester);
      }
    }
  });

  it("800 € revised with T2 2026 / T2 2025 gives 809,22 €, +9,22 € a month, +110,64 € a year, +1,15 %", () => {
    const result = reviseRent(d("800"), findPair(2, 2026)!);
    expect(result.newRent.toFixed(2)).toBe("809.22");
    expect(result.monthlyDifference.toFixed(2)).toBe("9.22");
    expect(result.annualDifference.toFixed(2)).toBe("110.64");
    expect(formatSignedPercent(result.variation)).toBe("+1,15 %");
  });

  it("agrees with calculateRentRevision, the function the lease screen uses, on every pair", () => {
    for (const trimester of [1, 2, 3, 4] as const) {
      for (const pair of revisionPairs(trimester)) {
        for (const rent of ["1", "487.35", "800", "1250.5", "99999.99"]) {
          const product = calculateRentRevision({
            currentRent: rent,
            referenceIrlQuarter: pair.previous.quarter,
            newIrlQuarter: pair.current.quarter,
          });
          expect(reviseRent(d(rent), pair).newRent.toNumber()).toBe(product.newRent);
        }
      }
    }
  });

  it("does not round the ratio before applying it", () => {
    // 1 000 000 € × 148,37 / 146,68: rounding the ratio to 4 decimals would give 1 011 500,00 €.
    const result = reviseRent(d("1000000"), findPair(2, 2026)!);
    expect(result.newRent.toFixed(2)).toBe(d(1000000).times(148.37).dividedBy(146.68).toDecimalPlaces(2).toFixed(2));
    expect(result.newRent.toFixed(2)).toBe("1011521.68");
  });

  it("lowers the rent when the index falls", () => {
    // No quarter has fallen year on year since 2020, so the arithmetic is
    // checked on two published indices where the later one is lower:
    // T2 2024 = 145,17 then T3 2024 = 144,51.
    const fall = { previous: IRL_INDICES.find((e) => e.quarter === "T2-2024")!, current: IRL_INDICES.find((e) => e.quarter === "T3-2024")! };
    const result = reviseRent(d("800"), fall);
    expect(result.newRent.toFixed(2)).toBe("796.36");
    expect(result.newRent.lessThan(800)).toBe(true);
    expect(result.monthlyDifference.isNegative()).toBe(true);
    expect(result.variation.isNegative()).toBe(true);
  });

  it("leaves the rent unchanged at 0 € and keeps 0 € at 0 €", () => {
    const result = reviseRent(d("0"), findPair(2, 2026)!);
    expect(result.newRent.toFixed(2)).toBe("0.00");
  });

  it("states the variation of the index, not of the rounded rent", () => {
    // On a 1 € rent the rounded rents differ by 0,01 € (1 %), the index by 1,15 %.
    const result = reviseRent(d("1"), findPair(2, 2026)!);
    expect(indexVariation(result.pair).toFixed(2)).toBe("1.15");
    expect(result.variation.toFixed(2)).toBe("1.15");
  });
});

const year2025 = {
  periodStart: parseIsoDate("2025-01-01")!,
  periodEnd: parseIsoDate("2025-12-31")!,
};

function input(overrides: Partial<RegularisationInput> = {}): RegularisationInput {
  return {
    ...year2025,
    occupancy: null,
    charges: [d("180"), d("165"), d("420"), d("655")],
    monthlyProvision: d("100"),
    monthsPaid: 12,
    ...overrides,
  };
}

describe("régularisation des charges", () => {
  it("1 420 € of charges against 12 × 100 € of provisions: the tenant owes 220 €", () => {
    const result = computeRegularisation(input());
    expect(result.chargesTotal.toFixed(2)).toBe("1420.00");
    expect(result.provisionsTotal.toFixed(2)).toBe("1200.00");
    expect(result.balance.toFixed(2)).toBe("220.00");
    expect(result.direction).toBe("tenant-owes");
  });

  it("provisions above the charges: the landlord pays the difference back", () => {
    const result = computeRegularisation(input({ monthlyProvision: d("125.50") }));
    expect(result.provisionsTotal.toFixed(2)).toBe("1506.00");
    expect(result.balance.toFixed(2)).toBe("-86.00");
    expect(result.direction).toBe("landlord-owes");
  });

  it("provisions equal to the charges: nothing is owed", () => {
    const result = computeRegularisation(input({ charges: [d("1200")] }));
    expect(result.balance.isZero()).toBe(true);
    expect(result.direction).toBe("balanced");
  });

  it("no provision paid: the whole share is owed", () => {
    const result = computeRegularisation(input({ monthlyProvision: d("0") }));
    expect(result.balance.toFixed(2)).toBe("1420.00");
  });

  it("no charge: every provision is paid back", () => {
    const result = computeRegularisation(input({ charges: [] }));
    expect(result.balance.toFixed(2)).toBe("-1200.00");
    expect(result.direction).toBe("landlord-owes");
  });

  it("adds amounts with cents exactly", () => {
    const result = computeRegularisation(input({ charges: [d("0.1"), d("0.2")], monthlyProvision: d("0"), monthsPaid: 0 }));
    expect(result.chargesTotal.toString()).toBe("0.3");
  });

  it("prorates to the days of occupancy and rounds the share once, half up", () => {
    // Arrived 1 June 2025: 214 days of 365. 1 420 × 214 / 365 = 832,547… → 832,55 €.
    const result = computeRegularisation(
      input({ occupancy: { start: parseIsoDate("2025-06-01")!, end: parseIsoDate("2025-12-31")! }, monthsPaid: 7 })
    );
    expect(result.periodDays).toBe(365);
    expect(result.occupiedDays).toBe(214);
    expect(result.prorated).toBe(true);
    expect(result.tenantShare.toFixed(2)).toBe("832.55");
    expect(result.provisionsTotal.toFixed(2)).toBe("700.00");
    expect(result.balance.toFixed(2)).toBe("132.55");
  });

  it("counts leap days", () => {
    expect(daysInclusive(parseIsoDate("2024-01-01")!, parseIsoDate("2024-12-31")!)).toBe(366);
    expect(daysInclusive(parseIsoDate("2024-02-28")!, parseIsoDate("2024-03-01")!)).toBe(3);
  });

  it("does not prorate when the tenant was there the whole period", () => {
    const result = computeRegularisation(input({ occupancy: { ...{ start: year2025.periodStart, end: year2025.periodEnd } } }));
    expect(result.prorated).toBe(false);
    expect(result.tenantShare.toFixed(2)).toBe("1420.00");
  });

  it("gives the monthly equivalent of a year of charges, not of a shorter period", () => {
    expect(computeRegularisation(input()).monthlyEquivalent?.toFixed(2)).toBe("118.33");
    const sixMonths = computeRegularisation(input({ periodEnd: parseIsoDate("2025-06-30")!, monthsPaid: 6 }));
    expect(sixMonths.monthlyEquivalent).toBeNull();
  });

  it.each([
    [{ periodEnd: parseIsoDate("2024-12-31")! }, "period-order"],
    [{ periodEnd: parseIsoDate("2026-01-02")! }, "period-too-long"],
    [{ occupancy: { start: parseIsoDate("2025-06-01")!, end: parseIsoDate("2025-05-01")! } }, "occupancy-order"],
    [{ occupancy: { start: parseIsoDate("2024-12-01")!, end: parseIsoDate("2025-05-01")! } }, "occupancy-outside-period"],
    [{ monthsPaid: 13 }, "months-invalid"],
    [{ monthsPaid: 2.5 }, "months-invalid"],
    [{ monthsPaid: -1 }, "months-invalid"],
  ] as const)("rejects an inconsistent input (%#: %s)", (overrides, error) => {
    expect(validateRegularisation(input(overrides as Partial<RegularisationInput>))).toContain(error);
  });

  it("accepts a regular year", () => {
    expect(validateRegularisation(input())).toEqual([]);
  });

  it("rejects dates that do not exist", () => {
    expect(parseIsoDate("2025-02-30")).toBeNull();
    expect(parseIsoDate("2025-13-01")).toBeNull();
    expect(parseIsoDate("01/02/2025")).toBeNull();
    expect(parseIsoDate("2024-02-29")?.toISOString()).toBe("2024-02-29T00:00:00.000Z");
  });
});
