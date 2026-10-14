/**
 * IRL values must be the ones INSEE published — never an estimate.
 *
 * Checked on 14/10/2026 against INSEE (série 001515333, Informations rapides):
 * T1 2026 = 146,60, T2 2026 = 148,37 (+1,15 % sur un an), T3 2025 = 145,77.
 * T3 2026 is scheduled for 15/10/2026 at 08:45 and was NOT published when this
 * test was written: it must not appear in the data before that.
 *
 * When T3 2026 is published, the IRL mini-PR adds it to IRL_INDICES and to the
 * calculator's history, updates LATEST below, and fixes the /guides/irl-2026
 * headline (still showing T4 2025 = 145,78, see the todo at the end).
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

import { IRL_INDICES, calculateRentRevision, findIrlIndex, getLatestIrl } from "@/lib/irl-calculator";

const OFFICIAL: Record<string, number> = {
  "T3-2025": 145.77,
  "T4-2025": 145.78,
  "T1-2026": 146.6,
  "T2-2026": 148.37,
};
const LATEST = { quarter: "T2-2026", value: 148.37 };

describe("indices IRL publiés", () => {
  it.each(Object.entries(OFFICIAL))("%s matches the value published by INSEE", (quarter, value) => {
    expect(findIrlIndex(quarter)?.value).toBe(value);
  });

  it("the latest index is the last one INSEE published, not an estimate", () => {
    expect(getLatestIrl()).toMatchObject(LATEST);
    expect(findIrlIndex("T3-2026")).toBeUndefined();
  });

  it("the calculator's history table shows the same values as the library", () => {
    const client = readFileSync(
      join(process.cwd(), "src/app/(marketing)/outils/calculateur-irl/calculator-client.tsx"),
      "utf8"
    );
    const rows = [...client.matchAll(/\{ quarter: "T([1-4]) (\d{4})", value: ([\d.]+)/g)];
    expect(rows.length).toBeGreaterThan(8);
    for (const [, trimester, year, value] of rows) {
      const entry = IRL_INDICES.find((e) => e.quarter === `T${trimester}-${year}`);
      expect(entry, `T${trimester}-${year} missing from IRL_INDICES`).toBeDefined();
      expect(entry!.value).toBe(Number(value));
    }
    expect(rows[0].slice(1, 3).join("-")).toBe("2-2026");
  });

  it("a revision with the latest year-on-year indices gives the expected rent", () => {
    // 800 € × 148,37 / 146,68 (T2 2026 / T2 2025) = 809,22 €
    const result = calculateRentRevision({
      currentRent: "800.00",
      referenceIrlQuarter: "T2-2025",
      newIrlQuarter: "T2-2026",
    });
    expect(result.newRent.toFixed(2)).toBe("809.22");
  });

  it.todo("IRL mini-PR: /guides/irl-2026 headline shows the latest published index (still T4 2025 = 145,78)");
});
