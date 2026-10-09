import { describe, it, expect } from "vitest";
import { HOME_FAQ_ITEMS } from "@/components/marketing/home/faq-data";
import {
  buildOrganizationSchema,
  buildWebSiteSchema,
  buildFAQPageSchema,
  buildGraphSchema,
} from "@/lib/seo/structured-data";
import { PLANS } from "@/lib/stripe";
import { trackHomepageEvent } from "@/lib/analytics/homepage-tracker";

describe("Homepage B.3 Production Migration Integrity", () => {
  it("FAQ items strictly reflect proven product truth without speculative claims", () => {
    expect(HOME_FAQ_ITEMS).toHaveLength(4);

    const questions = HOME_FAQ_ITEMS.map((f) => f.question);
    expect(questions).toContain("Pourquoi quitter un tableur Excel pour RentReady ?");
    expect(questions).toContain("Comment fonctionne l'essai gratuit de 14 jours ?");
    expect(questions).toContain("Que se passe-t-il en cas de versement partiel d'un locataire ?");
    expect(questions).toContain("Mes données d'encaissement sont-elles exportables ?");

    // Must NOT contain unproven or speculative claims
    const allText = HOME_FAQ_ITEMS.map((f) => `${f.question} ${f.answer}`).join(" ");
    expect(allText).not.toContain("Factur-X");
    expect(allText).not.toContain("Jeanbrun");
    expect(allText).not.toContain("e-reporting");
    expect(allText).not.toContain("grand livre");
  });

  it("Structured data builds a valid Schema.org graph with Organization, WebSite and FAQPage", () => {
    const graph = buildGraphSchema(
      buildOrganizationSchema(),
      buildWebSiteSchema(),
      buildFAQPageSchema(HOME_FAQ_ITEMS)
    );

    expect(graph["@context"]).toBe("https://schema.org");
    const nodes = (graph as { "@graph": Array<{ "@type": string }> })["@graph"];
    expect(nodes).toBeDefined();
    expect(nodes.length).toBeGreaterThanOrEqual(3);

    const types = nodes.map((n) => n["@type"]);
    expect(types).toContain("Organization");
    expect(types).toContain("WebSite");
    expect(types).toContain("FAQPage");

    const faqNode = nodes.find((n) => n["@type"] === "FAQPage") as {
      mainEntity: Array<{ name: string; acceptedAnswer: { text: string } }>;
    };
    expect(faqNode.mainEntity).toHaveLength(4);
    expect(faqNode.mainEntity[0].name).toBe(HOME_FAQ_ITEMS[0].question);
  });

  it("Pricing on homepage corresponds strictly to Stripe pricing tiers", () => {
    expect(PLANS.STARTER_MONTHLY.price).toBe(900); // 9 € in cents
    expect(PLANS.STARTER_ANNUAL.price).toBe(8900); // 89 € in cents
    expect(PLANS.MONTHLY.price).toBe(1500); // 15 € in cents
    expect(PLANS.ANNUAL.price).toBe(14900); // 149 € in cents
  });

  it("Analytics event tracker executes safely in node environment without crashing", () => {
    expect(() => {
      trackHomepageEvent({
        name: "homepage_hero_cta_click",
        properties: { position: "hero" },
      });
    }).not.toThrow();
  });
});
