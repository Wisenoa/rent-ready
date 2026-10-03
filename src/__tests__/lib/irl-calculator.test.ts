import { describe, it, expect } from "vitest";
import {
  calculateRentRevision,
  findIrlIndex,
  getLatestIrl,
  formatQuarterLabel,
  getAvailableQuarters,
  IRL_INDICES,
  IRL_SOURCE_URL,
} from "@/lib/irl-calculator";

/**
 * These values are transcribed from the official INSEE series
 * https://www.insee.fr/fr/statistiques/serie/001515333 (France métropolitaine,
 * base 100 au 4e trimestre 1998), checked on 2026-10-04.
 *
 * They are pinned by number on purpose. The suite used to assert only the shape
 * of the table, so five wrong indices (2024 T2/T4, 2025 T1/T2/T3) and the two
 * 2026 quarters shipped unnoticed — and `getLatestIrl()` feeds the revision cron,
 * meaning RentReady proposed a revised rent computed from a false index.
 *
 * When INSEE publishes a new quarter, add it here from the INSEE series, not
 * from a blog post or a competitor's calculator.
 */
const INSEE_SERIES: Record<string, number> = {
  "T1-2020": 130.57,
  "T2-2020": 130.57,
  "T3-2020": 130.59,
  "T4-2020": 130.52,
  "T1-2021": 130.69,
  "T2-2021": 131.12,
  "T3-2021": 131.67,
  "T4-2021": 132.62,
  "T1-2022": 133.93,
  "T2-2022": 135.84,
  "T3-2022": 136.27,
  "T4-2022": 137.26,
  "T1-2023": 138.61,
  "T2-2023": 140.59,
  "T3-2023": 141.03,
  "T4-2023": 142.06,
  "T1-2024": 143.46,
  "T2-2024": 145.17,
  "T3-2024": 144.51,
  "T4-2024": 144.64,
  "T1-2025": 145.47,
  "T2-2025": 146.68,
  "T3-2025": 145.77,
  "T4-2025": 145.78,
  "T1-2026": 146.6,
  "T2-2026": 148.37,
};

describe("IRL_INDICES values match the official INSEE series", () => {
  it.each(Object.entries(INSEE_SERIES))(
    "%s is the published INSEE value",
    (quarter, value) => {
      const entry = findIrlIndex(quarter);
      expect(entry, `${quarter} is missing from IRL_INDICES`).toBeDefined();
      expect(entry?.value).toBe(value);
    }
  );

  it("carries a Journal officiel publication date for every quarter", () => {
    for (const entry of IRL_INDICES) {
      expect(entry.publicationDate, `${entry.quarter}`).toMatch(
        /^\d{4}-\d{2}-\d{2}$/
      );
    }
  });

  it("points at the INSEE series so the values are verifiable", () => {
    expect(IRL_SOURCE_URL).toContain("insee.fr");
    expect(IRL_SOURCE_URL).toContain("001515333");
  });
});

describe("IRL_INDICES ordering", () => {
  it("is sorted ascending by year then quarter, so the last element is the latest", () => {
    const sorted = [...IRL_INDICES].sort((a, b) =>
      a.year - b.year || a.trimester - b.trimester
    );
    expect(IRL_INDICES.map((e) => e.quarter)).toEqual(
      sorted.map((e) => e.quarter)
    );
  });

  it("has no duplicate quarter", () => {
    const quarters = IRL_INDICES.map((e) => e.quarter);
    expect(new Set(quarters).size).toBe(quarters.length);
  });

  it("keeps year and trimester consistent with the quarter label", () => {
    for (const entry of IRL_INDICES) {
      const [, quarterNumber, quarterYear] = entry.quarter.match(
        /^T(\d)-(\d{4})$/
      ) as RegExpMatchArray;
      expect(entry.trimester, entry.quarter).toBe(Number(quarterNumber));
      expect(entry.year, entry.quarter).toBe(Number(quarterYear));
    }
  });
});

describe("getLatestIrl", () => {
  it("returns the last entry in the indices array", () => {
    const latest = getLatestIrl();
    expect(latest).toBeDefined();
    expect(latest.quarter).toMatch(/^T\d-\d{4}$/);
    expect(latest.value).toBeGreaterThan(0);
  });

  it("returns the current published quarter, not a stale one", () => {
    // If INSEE publishes a new quarter, this test is what tells you the table
    // was not updated. Do not relax it without updating IRL_INDICES first.
    expect(getLatestIrl().quarter).toBe("T2-2026");
    expect(getLatestIrl().value).toBe(148.37);
  });
});

describe("findIrlIndex", () => {
  it("finds an existing IRL index by quarter", () => {
    const index = findIrlIndex("T4-2024");
    expect(index).toBeDefined();
    expect(index?.quarter).toBe("T4-2024");
  });

  it("returns undefined for a quarter that does not exist", () => {
    expect(findIrlIndex("T9-2024")).toBeUndefined();
  });
});

describe("calculateRentRevision", () => {
  it("applies the legal formula: rent × (new IRL / reference IRL)", () => {
    const result = calculateRentRevision({
      currentRent: 800,
      referenceIrlQuarter: "T4-2023",
      newIrlQuarter: "T4-2024",
    });

    // 800 × (144.64 / 142.06) = 814.53
    expect(result.newRent).toBeCloseTo(814.53, 2);
    expect(result.difference).toBeCloseTo(14.53, 2);
    expect(result.percentageChange).toBeCloseTo(1.82, 2);
    expect(result.referenceIrl.quarter).toBe("T4-2023");
    expect(result.newIrl.quarter).toBe("T4-2024");
  });

  it("raises the rent by the published year-on-year change when the reference is a year earlier", () => {
    const result = calculateRentRevision({
      currentRent: 700,
      referenceIrlQuarter: "T2-2025",
      newIrlQuarter: "T2-2026",
    });
    // 700 × (148.37 / 146.68) = 708.07, i.e. the +1.15 % INSEE published for T2-2026
    expect(result.newRent).toBeCloseTo(708.07, 2);
    expect(result.percentageChange).toBeCloseTo(1.15, 2);
  });

  it("leaves the rent unchanged when both indices are equal", () => {
    const result = calculateRentRevision({
      currentRent: 500,
      referenceIrlQuarter: "T1-2020",
      newIrlQuarter: "T1-2020",
    });
    expect(result.newRent).toBe(500);
    expect(result.difference).toBe(0);
    expect(result.percentageChange).toBe(0);
  });

  it("rounds to the cent, never to floating-point noise", () => {
    const result = calculateRentRevision({
      currentRent: 733.33,
      referenceIrlQuarter: "T3-2023",
      newIrlQuarter: "T3-2024",
    });
    expect(result.newRent).toBeCloseTo(751.43, 2);
    expect(Number.isInteger(result.newRent * 100)).toBe(true);
  });

  it("throws for unknown reference IRL quarter", () => {
    expect(() =>
      calculateRentRevision({
        currentRent: 800,
        referenceIrlQuarter: "T9-2024",
        newIrlQuarter: "T4-2024",
      })
    ).toThrow();
  });

  it("throws for unknown new IRL quarter", () => {
    expect(() =>
      calculateRentRevision({
        currentRent: 800,
        referenceIrlQuarter: "T4-2023",
        newIrlQuarter: "T0-2024",
      })
    ).toThrow();
  });

  it("returns a formula string a landlord can check by hand", () => {
    const result = calculateRentRevision({
      currentRent: 1000,
      referenceIrlQuarter: "T1-2024",
      newIrlQuarter: "T2-2024",
    });
    expect(result.formula).toContain("1000");
    expect(result.formula).toContain("145.17");
    expect(result.formula).toContain("143.46");
  });
});

describe("formatQuarterLabel", () => {
  it("formats valid quarters in French", () => {
    expect(formatQuarterLabel("T1-2024")).toContain("1er trimestre");
    expect(formatQuarterLabel("T2-2024")).toContain("2ème trimestre");
    expect(formatQuarterLabel("T3-2024")).toContain("3ème trimestre");
    expect(formatQuarterLabel("T4-2024")).toContain("4ème trimestre");
  });

  it("returns original string for invalid format", () => {
    expect(formatQuarterLabel("invalid")).toBe("invalid");
    expect(formatQuarterLabel("2024-T1")).toBe("2024-T1");
  });
});

describe("getAvailableQuarters", () => {
  it("returns an array of quarter strings", () => {
    const quarters = getAvailableQuarters();
    expect(Array.isArray(quarters)).toBe(true);
    expect(quarters.length).toBeGreaterThan(0);
    expect(quarters[0]).toMatch(/^T\d-\d{4}$/);
  });

  it("all quarters match the expected format", () => {
    const quarters = getAvailableQuarters();
    for (const q of quarters) {
      expect(q).toMatch(/^T\d-\d{4}$/);
    }
  });
});