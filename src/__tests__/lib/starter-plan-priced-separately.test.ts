/**
 * The pricing page sold Starter and charged Pro.
 *
 * `/pricing` and the homepage pricing section both advertised a Starter plan at
 * 9 €/mois and 89 €/an. Neither CTA could say which plan it stood for:
 *
 *   function StarterCTA({ isAnnual }) { … return <SubscribeButton />; }
 *   function ProCTA({ isAnnual })     { … return <SubscribeButton />; }
 *
 * `SubscribeButton` took no argument, and `createSubscriptionCheckout` picked its
 * price by interval alone:
 *
 *   const plan = interval === "year" ? PLANS.ANNUAL : PLANS.MONTHLY;
 *
 * `PLANS` contained Pro and nothing else. So "S'abonner — 9 €/mois" created a
 * Stripe Checkout for 15 €/mois, and "89 €/an" for 149 €/an: a 67 % overcharge,
 * on the two most visited commercial pages, reached by clicking the cheapest
 * option.
 *
 * Nothing was caught by a test because both halves were individually plausible —
 * the pricing table carried the right numbers, and the checkout used a real
 * price id. The defect lived in the absence of a link between them.
 */
import { describe, it, expect } from "vitest";
import { PLANS, resolvePlan } from "@/lib/stripe";
import { readFileSync } from "fs";
import { join } from "path";

const SRC = join(process.cwd(), "src");

describe("chaque plan affiché a un prix qui lui est propre", () => {
  it("résout Starter et Pro vers des entrées distinctes", () => {
    expect(resolvePlan("starter", "month")).toBe(PLANS.STARTER_MONTHLY);
    expect(resolvePlan("starter", "year")).toBe(PLANS.STARTER_ANNUAL);
    expect(resolvePlan("pro", "month")).toBe(PLANS.MONTHLY);
    expect(resolvePlan("pro", "year")).toBe(PLANS.ANNUAL);
  });

  it("ne confond jamais deux plans", () => {
    const ids = [
      resolvePlan("starter", "month").priceIdEnv,
      resolvePlan("starter", "year").priceIdEnv,
      resolvePlan("pro", "month").priceIdEnv,
      resolvePlan("pro", "year").priceIdEnv,
    ];
    // Four plans, four distinct Stripe prices. A shared id means one of the four
    // prices on the page is not the price that gets charged.
    expect(new Set(ids).size).toBe(4);
  });

  it("les montants correspondent à ce qu'annonce la page pricing", () => {
    // From src/data/entity.ts, which pricing-consistency.test.ts also pins.
    expect(PLANS.STARTER_MONTHLY.price).toBe(900); // 9 €/mois
    expect(PLANS.STARTER_ANNUAL.price).toBe(8900); // 89 €/an
    expect(PLANS.MONTHLY.price).toBe(1500); // 15 €/mois
    expect(PLANS.ANNUAL.price).toBe(14900); // 149 €/an
  });

  it("le checkout choisit par plan et non par intervalle seul", () => {
    const action = readFileSync(
      join(SRC, "lib", "actions", "subscription-actions.ts"),
      "utf8"
    );
    expect(action).toContain("resolvePlan(plan, interval)");
    // The shape of the old defect: a price chosen by interval with no plan in
    // sight, which can only ever reach one plan.
    expect(action).not.toMatch(
      /interval === "year" \? PLANS\.ANNUAL : PLANS\.MONTHLY/
    );
  });

  it("un Price manquant refuse la vente au lieu de substituer un autre plan", () => {
    const action = readFileSync(
      join(SRC, "lib", "actions", "subscription-actions.ts"),
      "utf8"
    );
    // Returning "Configuration Stripe incomplète" for every plan was safe. What
    // was NOT safe is the temptation this guards: falling back to Pro so the
    // sale goes through.
    expect(action).toContain("resolvePlan(plan, interval)");
    expect(action).not.toMatch(/\?\s*PLANS\.(ANNUAL|MONTHLY)\s*:\s*PLANS\./);
    expect(action).toMatch(/if \(!priceId\) \{[\s\S]{0,900}success: false/);
  });

  it("les 4 CTA de la page pricing déclarent leur plan", () => {
    const wrapper = readFileSync(
      join(SRC, "components", "landing", "pricing-section-wrapper.tsx"),
      "utf8"
    );
    expect(wrapper).toContain('<SubscribeButton plan="starter" />');
    expect(wrapper).toContain('<SubscribeButton plan="pro" />');
    expect(wrapper).toContain('plan="starter"');
    expect(wrapper).toContain('plan="pro"');
  });
});
