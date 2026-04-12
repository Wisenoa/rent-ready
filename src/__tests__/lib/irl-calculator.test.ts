import { describe, it, expect } from "vitest";
import {
  calculateRentRevision,
  findIrlIndex,
  getLatestIrl,
  formatQuarterLabel,
  getAvailableQuarters,
} from "@/lib/irl-calculator";

describe("findIrlIndex", () => {
  it("finds an existing IRL index by quarter", () => {
    const index = findIrlIndex("T4-2024");
    expect(index).toBeDefined();
    expect(index?.quarter).toBe("T4-2024");
  });

  it("returns undefined for non-existent quarter", () => {
    expect(findIrlIndex("T1-2020")).toBeUndefined();
  });
});

describe("getLatestIrl", () => {
  it("returns the last entry in the indices array", () => {
    const latest = getLatestIrl();
    expect(latest).toBeDefined();
    expect(latest.quarter).toMatch(/^T\d-\d{4}$/);
    expect(latest.value).toBeGreaterThan(0);
  });
});

describe("calculateRentRevision", () => {
  it("calculates correct rent revision with valid indices", () => {
    const result = calculateRentRevision({
      currentRent: 800,
      referenceIrlQuarter: "T4-2023",
      newIrlQuarter: "T4-2024",
    });

    // Result is returned directly (not wrapped in {success: true})
    expect(result.newRent).toBeGreaterThan(800);
    expect(result.difference).toBeCloseTo(result.newRent - 800, 2);
    expect(result.percentageChange).toBeCloseTo(
      Math.round(((result.newRent - 800) / 800) * 10000) / 100,
      2
    );
    expect(result.referenceIrl.quarter).toBe("T4-2023");
    expect(result.newIrl.quarter).toBe("T4-2024");
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

  it("returns correct formula string", () => {
    const result = calculateRentRevision({
      currentRent: 1000,
      referenceIrlQuarter: "T1-2024",
      newIrlQuarter: "T2-2024",
    });
    expect(typeof result.formula).toBe("string");
    expect(result.formula).toContain("1000");
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
