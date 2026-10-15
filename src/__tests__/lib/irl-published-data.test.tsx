/**
 * IRL values must be the ones INSEE published — never an estimate.
 *
 * Checked against INSEE (série 001515333): T1 2026 = 146,60, T2 2026 = 148,37
 * (+1,15 % sur un an), T3 2025 = 145,77 on 14/10/2026; T3 2026 = 148,06
 * (+1,57 % sur un an) on 15/10/2026, from the INSEE BDM API
 * (bdm.insee.fr/series/sdmx/data/SERIES_BDM/001515333, LAST_UPDATE 2026-10-15,
 * OBS_QUAL "DEF"). T4 2026 is due in January 2027: it must not appear before.
 *
 * When INSEE publishes a new quarter, add it to IRL_INDICES and update LATEST
 * below. /guides/irl-2026, /outils/calculateur-irl and /outils read
 * IRL_INDICES, so they follow without an edit.
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
  "T3-2026": 148.06,
};
const LATEST = { quarter: "T3-2026", value: 148.06 };

describe("indices IRL publiés", () => {
  it.each(Object.entries(OFFICIAL))("%s matches the value published by INSEE", (quarter, value) => {
    expect(findIrlIndex(quarter)?.value).toBe(value);
  });

  it("the latest index is the last one INSEE published, not an estimate", () => {
    expect(getLatestIrl()).toMatchObject(LATEST);
    expect(findIrlIndex("T4-2026")).toBeUndefined();
  });

  it("the calculator and its page read IRL_INDICES and type no index by hand", () => {
    for (const file of ["IrlCalculator.tsx", "page.tsx"]) {
      const source = readFileSync(join(process.cwd(), "src/app/(marketing)/outils/calculateur-irl", file), "utf8");
      expect(source, file).not.toMatch(/\b1[34]\d[.,]\d{1,2}\b/);
      expect(source, file).toMatch(/from "@\/lib\/(irl-calculator|tools\/irl-revision)"/);
    }
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
    expect(html).toContain("Dernier IRL publié (T3 2026)");
    expect(html).toContain('<p class="mt-2 text-4xl font-bold text-ink">148,06</p>');
    expect(html).toContain("+1,57 %"); // 148,06 / 145,77 (T3 2025)
    expect(html).toContain("800 × (148,06 / 145,77) = 812,57 €");
    // Its Journal officiel date is not known yet: the guide says INSEE released it.
    expect(html).toContain("publié par l&#x27;INSEE le 15 octobre 2026");
    // The four latest indices, with INSEE's year-on-year changes.
    expect(html).toContain("<strong>T2 2026</strong> : 148,37 (+1,15 % sur un an)");
    // Values the guide used to show for 2025, none of them published by INSEE.
    expect(html).not.toMatch(/146,22|145,65|145,18/);
  });

  it("its FAQ structured data carries the same latest index", async () => {
    const { default: IRL2026GuidePage } = await import("@/app/(marketing)/guides/irl-2026/page");
    const html = renderToStaticMarkup(<IRL2026GuidePage />);
    const faq = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)]
      .map((m) => JSON.parse(m[1]))
      .find((ld) => ld["@type"] === "FAQPage");
    expect(faq.mainEntity[0].acceptedAnswer.text).toContain("148,06 au titre du 3ème trimestre 2026");
  });
});
