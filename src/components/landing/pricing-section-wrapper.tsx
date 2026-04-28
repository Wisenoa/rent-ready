"use client";

import { useState } from "react";
import { PricingToggle } from "@/components/landing/pricing-toggle";
import { PricingCard } from "@/components/landing/pricing-card";
import { SubscribeButton } from "@/components/subscribe-button";
import { AnnualSubscribeButton } from "@/components/annual-subscribe-button";

const plans = {
  starter: {
    name: "Starter",
    description:
      "Pour les propriétaires qui commencent à investir et veulent structurer leur gestion locative.",
    monthlyPrice: 9,
    annualPrice: 89,
    badge: "Idéal pour démarrer",
    badgeColor: "blue" as const,
    isHighlighted: false,
    highlightColor: "blue" as const,
    propertyLimit: "Jusqu'à 3 biens",
    features: [
      "Jusqu'à 3 biens immobiliers",
      "Locataires illimités",
      "Quittances conformes loi 1989",
      "Détection automatique des loyers (Open Banking)",
      "Révision IRL connectée INSEE",
      "Portail locataire",
      "Support email",
      "Mises à jour légales incluses",
    ],
    ctaNote: "Sans carte bancaire · Annulable en 1 clic",
  },
  pro: {
    name: "Pro",
    description:
      "Pour les propriétaires aguerris qui gèrent plusieurs biens et veulent une automatisation complète.",
    monthlyPrice: 15,
    annualPrice: 149,
    badge: "Le plus populaire",
    badgeColor: "emerald" as const,
    isHighlighted: true,
    highlightColor: "emerald" as const,
    propertyLimit: "Jusqu'à 10 biens",
    features: [
      "Jusqu'à 10 biens immobiliers",
      "Locataires illimités",
      "Quittances et reçus conformes loi 1989",
      "Détection automatique des loyers (Open Banking DSP2)",
      "Révision IRL connectée INSEE",
      "Portail locataire avec gestion maintenance",
      "OCR factures artisans (IA)",
      "Conformité Factur-X et e-reporting B2C 2026",
      "Support email prioritaire",
      "Mises à jour légales incluses",
      "Export comptable",
      "Relance automatique impayés",
    ],
    ctaNote: "Sans carte bancaire · Annulable en 1 clic",
  },
  agency: {
    name: "Agency",
    description:
      "Pour les gestionnaires de biens et agences qui supervisent des portfolios importants.",
    monthlyPrice: null,
    annualPrice: null,
    badge: "Volume adapté",
    badgeColor: "amber" as const,
    isHighlighted: false,
    highlightColor: "amber" as const,
    propertyLimit: "Plus de 10 biens",
    features: [
      "Biens illimités",
      "Locataires illimités",
      "Tout du plan Pro",
      "Multi-utilisateurs & rôles",
      "API & intégrations",
      "Onboarding personnalisé",
      "Support dédié + SLA",
      "Reporting avancé",
      "Conformité Factur-X & e-reporting",
    ],
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
  return <SubscribeButton />;
}

function ProCTA({ isAnnual }: { isAnnual: boolean }) {
  if (isAnnual) {
    return (
      <AnnualSubscribeButton
        annualPriceLabel="S'abonner — 149 €/an"
        badgeLabel="2 mois gratuits"
      />
    );
  }
  return <SubscribeButton />;
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
              href="mailto:contact@rentready.fr"
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
