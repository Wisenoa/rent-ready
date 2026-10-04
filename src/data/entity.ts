/**
 * Single source of truth for the facts that describe RentReady as an entity.
 *
 * WHY THIS FILE EXISTS
 *
 * These values were duplicated across ~20 files — the root layout, every
 * SoftwareApplication block, every city page, the comparison pages, the FAQ
 * answers — and they drifted. A visitor could read "à partir de 15 €/mois" on
 * one page and "dès 9 €/mois" on the pricing page; the JSON-LD advertised a
 * different price again. For a search engine or an answer engine comparing
 * RentReady against other vendors, contradictory pricing is the strongest
 * possible reason to not cite the source at all: the number is the first
 * thing anyone checks.
 *
 * The rule from here on: a price, a plan name, a feature list, or an entity
 * attribute is declared HERE and imported. A literal price in a page is a
 * bug, and `pricing-consistency.test.ts` fails the build when one appears.
 */

/** Canonical origin. Used for canonical URLs, schema `url`, sitemap, robots. */
export const SITE_URL = "https://www.rentready.fr";

export const SITE_NAME = "RentReady";

/** One-sentence description of the product, for schema and metadata. */
export const SITE_DESCRIPTION =
  "Logiciel de gestion locative pour propriétaires bailleurs indépendants en France : quittances de loyer automatiques, suivi des loyers, révision IRL et génération des documents de location.";

export type PlanId = "starter" | "pro" | "agency";

export interface Plan {
  id: PlanId;
  /** Name as displayed to the landlord. */
  name: string;
  /** Monthly price in euros. `null` means "sur devis" (contact us). */
  monthlyPrice: number | null;
  /** Annual price in euros. `null` when there is no annual offer. */
  annualPrice: number | null;
  /** How many properties the plan covers. `null` means unlimited. */
  properties: number | null;
  /** One line for the pricing table and for comparison pages. */
  summary: string;
}

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 9,
    annualPrice: 89,
    properties: 3,
    summary: "Jusqu'à 3 biens, gestion locative complète",
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: 15,
    annualPrice: 149,
    properties: 10,
    summary: "Jusqu'à 10 biens, OCR IA, Factur-X, relance automatique",
  },
  {
    id: "agency",
    name: "Agency",
    monthlyPrice: null,
    annualPrice: null,
    properties: null,
    summary: "Biens illimités, support dédié, API et intégrations",
  },
];

/**
 * The entry price — the number that appears in the root layout description, in
 * every SoftwareApplication offer, and in the meta description of the pages
 * that sell the product.
 *
 * It is the cheapest plan with a published monthly price, not a hand-typed
 * literal. Adding a cheaper plan moves every mention of the price at once.
 */
export function getEntryPrice(): number {
  const priced = PLANS.filter((p) => p.monthlyPrice !== null);
  if (priced.length === 0) {
    throw new Error("No plan has a monthly price; the entry price is undefined.");
  }
  return Math.min(...priced.map((p) => p.monthlyPrice as number));
}

/** "9 €/mois" — for prose. */
/**
 * The plan most landlords end up on — up to 10 properties, which is the upper
 * bound of the target audience (1–10 biens).
 *
 * Several pages describe this tier in prose ("15 €/mois", "149 €/an"). Those
 * strings used to be typed, and one FAQ went further and called it "ce tarif
 * unique" — a single price — while PLANS has had three tiers since the start.
 */
export function getProPrice(): number {
  const plan = PLANS.find((p) => p.id === "pro");
  if (!plan || plan.monthlyPrice === null) {
    throw new Error("The pro plan has no monthly price");
  }
  return plan.monthlyPrice;
}

export function formatProAnnualPrice(): string {
  const plan = PLANS.find((p) => p.id === "pro");
  if (!plan || plan.annualPrice === null) {
    throw new Error("The pro plan has no annual price");
  }
  return `${plan.annualPrice} €`;
}

export function formatProPrice(): string {
  return `${getProPrice().toLocaleString("fr-FR")} €/mois`;
}

export function formatEntryPrice(): string {
  return `${getEntryPrice()} €/mois`;
}

/**
 * Date after which the advertised `price` in schema.org Offers must be
 * re-checked. An Offer whose price is stale is worse than no Offer: Google
 * shows a price in search results and users arrive to a different one.
 */
export const PRICE_VALID_UNTIL = "2027-12-31";

/** Capabilities advertised in SoftwareApplication `featureList`. */
export const FEATURE_LIST = [
  "Quittances de loyer conformes à la loi du 6 juillet 1989",
  "Suivi des loyers et détection des impayés",
  "Révision de loyer indexée sur l'IRL publié par l'INSEE",
  "Génération des baux, états des lieux et lettres de relance",
  "Portail locataire",
  "Conformité Factur-X et e-reporting B2C",
];

/**
 * Government reporting deadline quoted on several pages.
 *
 * It was written as both 2026 and 2027 depending on the file. The current
 * French schedule puts B2C e-reporting at 1 September 2026; the reform that
 * moved the large-company deadline to 2027 concerns a different taxpayer
 * population. Keep one constant, and re-verify it against impots.gouv.fr
 * before changing it — it is a dated regulatory claim.
 */
export const E_REPORTING_YEAR = 2026;

/**
 * External profiles that identify this organisation.
 *
 * Only list a URL that actually resolves to a RentReady account. A `sameAs`
 * pointing at a 404 — or at an unrelated company with a similar name — is a
 * negative identity signal: it tells a crawler that this entity cannot be
 * corroborated anywhere, which is worse than having no `sameAs` at all.
 *
 * Verified live on 2026-10-04:
 *   twitter.com/rentready_fr        → 404, removed
 *   linkedin.com/company/rentready  → 404, removed
 *   facebook.com/rentready.fr       → 200, kept
 *
 * The list is deliberately short. Add a profile here only once it resolves,
 * and re-check it: a handle that dies silently is the exact failure this
 * constant exists to prevent.
 */
export const SAME_AS = ["https://www.facebook.com/rentready.fr"];

/** Founding year. Only claim what can be substantiated in the legal notice. */
export const FOUNDING_YEAR = 2024;