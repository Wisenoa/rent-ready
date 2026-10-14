"use client";

import { useState } from "react";
import { PricingToggle } from "@/components/landing/pricing-toggle";
import { PricingCard } from "@/components/landing/pricing-card";
import { SubscribeButton } from "@/components/subscribe-button";
import { AnnualSubscribeButton } from "@/components/annual-subscribe-button";

/**
 * Starter and Pro give access to the same features; they differ by the number
 * of properties. A feature appears here only once it is available in the
 * product — planned features stay out until they ship (AGENTS.md §37).
 */
const SHARED_FEATURES = [
  "Locataires illimités",
  "Quittances et reçus conformes loi 1989",
  "Suivi des loyers et du reste dû",
  "Révision IRL calculée avec l'indice INSEE",
  "Quittances et reçus en PDF, à télécharger",
  "Dépenses par logement",
  "Export CSV des paiements",
];

const plans = {
  starter: {
    name: "Starter",
    description:
      "Pour les propriétaires qui louent jusqu'à 3 logements.",
    monthlyPrice: 9,
    annualPrice: 89,
    badge: "Idéal pour démarrer",
    badgeColor: "blue" as const,
    isHighlighted: false,
    highlightColor: "blue" as const,
    propertyLimit: "Jusqu'à 3 biens",
    features: ["Jusqu'à 3 biens immobiliers", ...SHARED_FEATURES],
    ctaNote: "Sans carte bancaire · Annulable en 1 clic",
  },
  pro: {
    name: "Pro",
    description:
      "Les mêmes fonctionnalités, pour les propriétaires qui louent jusqu'à 10 logements.",
    monthlyPrice: 15,
    annualPrice: 149,
    badge: "Au-delà de 3 logements",
    badgeColor: "emerald" as const,
    isHighlighted: true,
    highlightColor: "emerald" as const,
    propertyLimit: "Jusqu'à 10 biens",
    features: ["Jusqu'à 10 biens immobiliers", ...SHARED_FEATURES],
    ctaNote: "Sans carte bancaire · Annulable en 1 clic",
  },
  agency: {
    name: "Agency",
    description:
      "Pour les propriétaires qui louent plus de 10 logements.",
    monthlyPrice: null,
    annualPrice: null,
    badge: "Volume adapté",
    badgeColor: "amber" as const,
    isHighlighted: false,
    highlightColor: "amber" as const,
    propertyLimit: "Plus de 10 biens",
    features: ["Plus de 10 biens immobiliers", ...SHARED_FEATURES],
    ctaNote: "Contacter notre équipe commerciale",
  },
};

function StarterCTA({ isAnnual }: { isAnnual: boolean }) {
  if (isAnnual) {
    return (
      <AnnualSubscribeButton
        annualPriceLabel="S'abonner — 89 €/an"
        badgeLabel="2 mois gratuits"
      />
    );
  }
  return <SubscribeButton plan="starter" />;
}

function ProCTA({ isAnnual }: { isAnnual: boolean }) {
  if (isAnnual) {
    return (
      <AnnualSubscribeButton
        plan="pro"
        annualPriceLabel="S'abonner — 149 €/an"
        badgeLabel="2 mois gratuits"
      />
    );
  }
  return <SubscribeButton plan="pro" />;
}

export function PricingSectionWrapper() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div>
      {/* Toggle */}
      <div className="mb-12">
        <PricingToggle isAnnual={isAnnual} onToggle={setIsAnnual} />
      </div>

      {/* Cards */}
      <div className="grid gap-6 lg:grid-cols-3">
        <PricingCard
          name={plans.starter.name}
          description={plans.starter.description}
          monthlyPrice={plans.starter.monthlyPrice}
          annualPrice={plans.starter.annualPrice}
          isAnnual={isAnnual}
          badge={plans.starter.badge}
          badgeColor={plans.starter.badgeColor}
          isHighlighted={plans.starter.isHighlighted}
          highlightColor={plans.starter.highlightColor}
          features={plans.starter.features}
          cta={<StarterCTA isAnnual={isAnnual} />}
          ctaNote={plans.starter.ctaNote}
          propertyLimit={plans.starter.propertyLimit}
        />

        <PricingCard
          name={plans.pro.name}
          description={plans.pro.description}
          monthlyPrice={plans.pro.monthlyPrice}
          annualPrice={plans.pro.annualPrice}
          isAnnual={isAnnual}
          badge={plans.pro.badge}
          badgeColor={plans.pro.badgeColor}
          isHighlighted={plans.pro.isHighlighted}
          highlightColor={plans.pro.highlightColor}
          features={plans.pro.features}
          cta={<ProCTA isAnnual={isAnnual} />}
          ctaNote={plans.pro.ctaNote}
          propertyLimit={plans.pro.propertyLimit}
        />

        <PricingCard
          name={plans.agency.name}
          description={plans.agency.description}
          monthlyPrice={plans.agency.monthlyPrice}
          annualPrice={plans.agency.annualPrice}
          isAnnual={isAnnual}
          badge={plans.agency.badge}
          badgeColor={plans.agency.badgeColor}
          isHighlighted={plans.agency.isHighlighted}
          highlightColor={plans.agency.highlightColor}
          features={plans.agency.features}
          cta={
            <a
              href="mailto:contact@lokna.fr"
              className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-stone-200 bg-white py-4 text-sm font-semibold text-stone-700 shadow-lg transition-colors hover:border-stone-300 hover:bg-stone-50"
            >
              Contacter ventes
            </a>
          }
          ctaNote="Réponse sous 24h"
          propertyLimit={plans.agency.propertyLimit}
        />
      </div>
    </div>
  );
}
