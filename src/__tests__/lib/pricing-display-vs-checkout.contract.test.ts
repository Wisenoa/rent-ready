/**
 * The contract between the price DISPLAYED and the price CHARGED.
 *
 * There are two plan tables and they were never tied together:
 *
 *   src/data/entity.ts   PLANS — what /pricing renders, what the JSON-LD offers,
 *                               what the articles quote. Euros.
 *   src/lib/stripe.ts    PLANS — what Stripe Checkout charges. Cents, plus the
 *                               env var naming the Price.
 *
 * Both happened to carry the same numbers, so nothing failed — and that is
 * precisely the failure mode. Two tables that agree today, for no structural
 * reason, will not agree after the next price change: someone edits the page, or
 * the Stripe amount, and the gap is only visible when a landlord is charged a
 * different sum from the one they agreed to.
 *
 * This went wrong once already. The Starter plan was displayed at 9 €/mois and
 * had no Stripe Price at all, so its checkout fell through to the Pro plan at
 * 15 €/mois — a 67 % overcharge on the two most visited commercial pages, found
 * by a subagent auditing money pages rather than by a test.
 *
 * So the rule is narrow and mechanical: **the displayed euros and the charged
 * cents are the same number**, derived from each side rather than restated here.
 * If the price changes, one of these fails.
 */
import { describe, it, expect } from "vitest";
import { PLANS as DISPLAYED, type Plan, type PlanId } from "@/data/entity";
import { PLANS as CHARGED, resolvePlan, type PlanKey } from "@/lib/stripe";
import { readFileSync } from "fs";
import { join } from "path";

const ROOT = process.cwd();

/** Plans that can actually be bought. `agency` is `sur devis`, so it has no price. */
const PURCHASABLE: PlanKey[] = ["starter", "pro"];

const displayed = (id: PlanId): Plan => {
  const plan = DISPLAYED.find((p) => p.id === id);
  if (!plan) throw new Error(`aucun plan affiche pour ${id}`);
  return plan;
};

describe("prix affiché ↔ prix facturé", () => {
  it.each(PURCHASABLE)(
    "le montant Stripe du plan %s vaut exactement le prix affiché",
    (id) => {
      const plan = displayed(id);

      // Monthly. Euros to cents, and the conversion is the only place rounding
      // could sneak in: a displayed 9.99 € that charges 999 € is a P0.
      const monthly = resolvePlan(id, "month");
      expect(
        monthly.price,
        `${id}: le checkout mensuel (${monthly.price} centimes) ne correspond pas à l'affichage (${plan.monthlyPrice} €)`
      ).toBe((plan.monthlyPrice ?? 0) * 100);

      // Annual, only when one is published.
      if (plan.annualPrice !== null) {
        const annual = resolvePlan(id, "year");
        expect(
          annual.price,
          `${id}: le checkout annuel (${annual.price} centimes) ne correspond pas à l'affichage (${plan.annualPrice} €)`
        ).toBe(plan.annualPrice * 100);
      }
    }
  );

  it.each(PURCHASABLE)("le plan %s a un Stripe Price par intervalle", (id) => {
    // Four plans, four distinct env vars. A shared one means one of the displayed
    // prices is not the price that gets charged — the original Starter defect.
    const envs = [resolvePlan(id, "month").priceIdEnv, resolvePlan(id, "year").priceIdEnv];
    expect(new Set(envs).size, `${id}: les deux intervalles partagent un Price ID`).toBe(2);

    const example = readFileSync(join(ROOT, ".env.example"), "utf8");
    for (const env of envs) {
      expect(
        example,
        `${env} n'est pas declare dans .env.example : sans lui, la vente est refusee`
      ).toContain(env);
    }
  });

  it("les 4 combinaisons resolvePlan donne 4 prix distincts", () => {
    const prices = PURCHASABLE.flatMap((id) => [
      resolvePlan(id, "month").price,
      resolvePlan(id, "year").price,
    ]);
    expect(new Set(prices).size, "deux combinaisons partagent le meme montant").toBe(4);
  });

  it("les 4 combinaisons donnent 4 prix Stripe distincts des 4 prix affiches", () => {
    // The whole point, stated as one assertion: the set of numbers a visitor can
    // be quoted and the set of numbers they can be charged are the same set.
    const displayedAmounts = PURCHASABLE.flatMap((id) => {
      const plan = displayed(id);
      const out = [plan.monthlyPrice];
      if (plan.annualPrice !== null) out.push(plan.annualPrice);
      return out;
    });
    const chargedAmounts = PURCHASABLE.flatMap((id) => [
      resolvePlan(id, "month").price,
      resolvePlan(id, "year").price,
    ]);

    expect([...displayedAmounts].sort((a, b) => (a ?? 0) - (b ?? 0)).length).toBe(4);
    expect(new Set(chargedAmounts).size).toBe(4);
    expect(
      chargedAmounts.slice().sort((a, b) => a - b),
      "les montants Stripe ne sont pas les montants affiches × 100"
    ).toEqual(
      displayedAmounts
        .map((e) => (e ?? 0) * 100)
        .sort((a, b) => a - b)
    );
  });

  it("un plan sur devis n'a pas de prix ni de checkout", () => {
    const agency = DISPLAYED.find((p) => p.id === "agency");
    expect(agency, "le plan agency a disparu").toBeDefined();
    expect(agency?.monthlyPrice).toBeNull();
    // There is no `resolvePlan("agency")`, which is the point: it cannot be
    // bought, and the type system refuses to say otherwise.
    expect(["starter", "pro"]).not.toContain("agency");
  });
});
