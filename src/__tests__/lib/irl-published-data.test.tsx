/**
 * IRL values must be the ones INSEE published — never an estimate.
 *
 * Checked on 14/10/2026 against INSEE (série 001515333, Informations rapides):
 * T1 2026 = 146,60, T2 2026 = 148,37 (+1,15 % sur un an), T3 2025 = 145,77.
 * T3 2026 is scheduled for 15/10/2026 at 08:45 and was NOT published when this
 * test was written: it must not appear in the data before that.
 *
 * When T3 2026 is published, the IRL mini-PR adds it to IRL_INDICES and to the
 * calculator's history and updates LATEST below. /guides/irl-2026 reads
 * IRL_INDICES, so it follows without an edit.
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";
import { renderToStaticMarkup } from "react-dom/server";

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

});

describe("guide IRL", () => {
  const source = readFileSync(join(process.cwd(), "src/app/(marketing)/guides/irl-2026/page.tsx"), "utf8");

  it("types no index by hand: every value comes from IRL_INDICES", () => {
    expect(source).not.toMatch(/\b14\d,\d{2}\b/);
    expect(source).toContain("getLatestIrl()");
  });

  it("shows the latest published index, its year-on-year change and a worked example", async () => {
    const { default: IRL2026GuidePage } = await import("@/app/(marketing)/guides/irl-2026/page");
    const html = renderToStaticMarkup(<IRL2026GuidePage />);
    expect(html).toContain("Dernier IRL publié (T2 2026)");
    expect(html).toContain('<p class="mt-2 text-4xl font-bold text-ink">148,37</p>');
    expect(html).toContain("+1,15 %"); // 148,37 / 146,68 (T2 2025)
    expect(html).toContain("800 × (148,37 / 146,68) = 809,22 €");
    // The four latest indices, with INSEE's year-on-year changes.
    expect(html).toContain("<strong>T3 2025</strong> : 145,77 (+0,87 % sur un an)");
    // Values the guide used to show for 2025, none of them published by INSEE.
    expect(html).not.toMatch(/146,22|145,65|145,18/);
  });

  it("its FAQ structured data carries the same latest index", async () => {
    const { default: IRL2026GuidePage } = await import("@/app/(marketing)/guides/irl-2026/page");
    const html = renderToStaticMarkup(<IRL2026GuidePage />);
    const faq = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1]))
      .find((ld) => ld["@type"] === "FAQPage");
    expect(faq.mainEntity[0].acceptedAnswer.text).toContain("148,37 au titre du 2ème trimestre 2026");
  });
});
