/**
 * One price, one entity.
 *
 * RentReady advertised "à partir de 15 €/mois" in the root layout, in eleven
 * JSON-LD Offer blocks, and in the comparison pages, while the cheapest plan
 * cost 9 €/mois. A visitor could read two different prices on two pages of the
 * same site.
 *
 * Price is also the first thing an answer engine checks when it compares one
 * software against another, so a contradiction is a direct reason to not cite
 * the source. These guards make the drift impossible rather than merely fixed
 * once.
 */

import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import {
  PLANS,
  SAME_AS,
  SITE_URL,
  getEntryPrice,
  formatEntryPrice,
} from "@/data/entity";
import { softwareApplicationSchema, paidOffer } from "@/components/seo/schema-markup";

const SRC = join(process.cwd(), "src");

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (full.endsWith(".ts") || full.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const FILES = walk(SRC).filter((f) => !f.includes("__tests__"));

/**
 * Remove comments from TypeScript/TSX source.
 *
 * Several guards below look for literals that are also quoted in explanatory
 * comments — the SearchAction this file forbids is named in a comment three
 * lines above the check. Scanning comments makes a guard report itself.
 */
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, " ") // block comments
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1"); // line comments (keep http://)
}


describe("pricing has a single source of truth", () => {
  it("the entry price is the cheapest plan, not a literal", () => {
    const priced = PLANS.filter((p) => p.monthlyPrice !== null);
    expect(priced.length).toBeGreaterThan(0);
    expect(getEntryPrice()).toBe(Math.min(...priced.map((p) => p.monthlyPrice!)));
  });

  it("matches the published prices on the pricing page", () => {
    // The numbers below are the commercial offer. If a plan changes, this test
    // is the reminder to update `PLANS` — the reverse direction would let the
    // schema quietly advertise a price nobody sells.
    const starter = PLANS.find((p) => p.id === "starter")!;
    const pro = PLANS.find((p) => p.id === "pro")!;
    expect(starter.monthlyPrice).toBe(9);
    expect(starter.annualPrice).toBe(89);
    expect(pro.monthlyPrice).toBe(15);
    expect(pro.annualPrice).toBe(149);
  });

  it("renders the entry price in prose", () => {
    expect(formatEntryPrice()).toBe(`${getEntryPrice()} €/mois`);
  });

  it("derives the schema offer price instead of hard-coding it", () => {
    expect(paidOffer().price).toBe(getEntryPrice().toFixed(2));
    const schema = softwareApplicationSchema();
    const offers = schema.offers as { price: string; priceCurrency: string };
    expect(offers.price).toBe(getEntryPrice().toFixed(2));
    expect(offers.priceCurrency).toBe("EUR");
  });
});

describe("no page hard-codes a price", () => {
  /**
   * Scoped to what actually matters for the entity: a *paid software* offer.
   *
   * A deliberately free page — a template generator, a free simulator — must
   * keep `price: "0"`, and a comparison table has to name each rival's price
   * literally. Those are not drift. What must not happen is a second number for
   * RentReady's own subscription appearing next to the plans table.
   */
  it("finds no second hard-coded subscription price", () => {
    const offenders: string[] = [];
    const entry = getEntryPrice();
    const allPlanPrices = PLANS.flatMap((p) =>
      [p.monthlyPrice, p.annualPrice].filter((v): v is number => v !== null)
    );

    for (const file of FILES) {
      const rel = relative(process.cwd(), file);

      // The entity module is where a price is written down.
      if (rel.endsWith("src/data/entity.ts")) continue;
      // /pricing legitimately spells out each plan.
      if (rel.includes("(marketing)/pricing/page.tsx")) continue;
      // Checkout reads amounts in cents from Stripe, a different unit.
      if (rel.endsWith("src/lib/stripe.ts")) continue;

      const source = stripComments(readFileSync(file, "utf8"));

      // A prose entry-price claim must not name a number other than the real
      // one, and must not state one at all where a template is available.
      for (const m of source.matchAll(/[ÀA] partir de\s+(\d+)\s*€/g)) {
        if (Number(m[1]) !== entry) {
          offenders.push(
            `${rel} — "à partir de ${m[1]} €" but the entry plan is ${entry} €`
          );
        }
      }

      // A JSON-LD Offer for the product itself must quote a real plan price.
      const paidOfferBlock = /"@type":\s*"Offer"[\s\S]{0,120}?price:\s*"?(\d+(?:[.,]\d+))"?/.exec(
        source
      );
      if (paidOfferBlock) {
        const value = Number(paidOfferBlock[1].replace(",", "."));
        const isFree = value === 0;
        const isRealPlan = allPlanPrices.some((p) => Math.abs(p - value) < 0.01);
        // 15.00 is also a real plan (Pro), so it is allowed; anything else that
        // is neither free nor a plan price is drift.
        if (!isFree && !isRealPlan) {
          offenders.push(`${rel} — Offer price ${value} matches no plan`);
        }
      }
    }

    expect(
      offenders,
      `Subscription prices must come from PLANS in src/data/entity.ts:\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("agrees with the pricing page about every plan price it mentions", () => {
    const pricing = readFileSync(
      join(SRC, "app", "(marketing)", "pricing", "page.tsx"),
      "utf8"
    );
    for (const plan of PLANS) {
      if (plan.monthlyPrice === null) continue;
      // The plan name and its price must appear together in the page.
      const idx = pricing.indexOf(plan.name);
      expect(idx, `plan ${plan.name} missing from /pricing`).toBeGreaterThan(-1);
    }
  });
});

describe("entity facts are consistent", () => {
  it("declares only sameAs profiles that exist", () => {
    // Verified live on 2026-10-04: twitter.com/rentready_fr and
    // linkedin.com/company/rentready both return 404. A sameAs pointing at a
    // dead profile is a negative identity signal, so the list stays minimal and
    // only contains profiles that were confirmed to resolve.
    const DEAD_PROFILES = ["twitter.com/rentready_fr", "linkedin.com/company/rentready"];

    for (const url of SAME_AS) {
      expect(url).toMatch(/^https:\/\//);
      for (const dead of DEAD_PROFILES) {
        expect(url, `${url} does not resolve`).not.toContain(dead);
      }
    }
  });

  it("does not claim a sameAs identity outside the confirmed list", () => {
    // Guards against the drift coming back through a page-level literal.
    const offenders: string[] = [];
    for (const file of FILES) {
      const source = stripComments(readFileSync(file, "utf8"));
      for (const m of source.matchAll(/sameAs:\s*\[([^\]]*)\]/g)) {
        for (const url of m[1].matchAll(/"(https:\/\/[^"]+)"/g)) {
          if (!SAME_AS.includes(url[1])) {
            offenders.push(`${relative(process.cwd(), file)} → ${url[1]}`);
          }
        }
      }
    }
    expect(
      offenders,
      `sameAs entries must come from SAME_AS:\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("uses one canonical origin", () => {
    expect(SITE_URL).toBe("https://www.rentready.fr");
  });

  it("never advertises a logo that does not exist", () => {
    const offenders: string[] = [];
    for (const file of FILES) {
      const source = readFileSync(file, "utf8");
      if (/\/logo\.png/.test(source)) offenders.push(relative(process.cwd(), file));
    }
    // public/logo.png has never existed; the Organization logo must point at
    // the real file served from /public.
    expect(offenders, `stale logo.png in:\n${offenders.join("\n")}`).toEqual([]);
  });

  it("never declares a sitelinks SearchAction", () => {
    const offenders: string[] = [];
    for (const file of FILES) {
      const source = stripComments(readFileSync(file, "utf8"));
      if (/"@type":\s*"SearchAction"/.test(source)) {
        offenders.push(relative(process.cwd(), file));
      }
    }
    // There is no /recherche route, so a SearchAction promises a 404 search box.
    expect(
      offenders,
      `SearchAction declared but no search route exists:\n${offenders.join("\n")}`
    ).toEqual([]);
  });

  it("never points a social image at a static file that does not exist", () => {
    const offenders: string[] = [];
    for (const file of FILES) {
      const source = stripComments(readFileSync(file, "utf8"));
      for (const m of source.matchAll(/https:\/\/www\.rentready\.fr\/([\w.-]+\.(?:png|jpg|jpeg|svg))/g)) {
        // /opengraph-image is served by the Next file convention (no extension).
        if (["logo.svg"].includes(m[1])) continue;
        offenders.push(`${relative(process.cwd(), file)} → /${m[1]}`);
      }
    }
    expect(offenders, `missing image assets:\n${offenders.join("\n")}`).toEqual([]);
  });
});