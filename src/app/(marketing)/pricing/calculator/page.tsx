import type { Metadata } from "next";
import { PricingCalculatorClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  buildGraphSchema,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildHowToSchema,
} from "@/lib/seo/structured-data";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title:
      "Estimateur de Prix RentReady 2026 — Combien coûte RentReady ? | RentReady",
    description:
      "Estimez le coût de RentReady selon le nombre de biens et les fonctionnalités choisies. Comparaison Starter à 9 €/mois, Pro à 15 €/mois, et Agency sur devis. Calculez votre tarif en 30 secondes.",
    url: "/pricing/calculator",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Tarifs", href: "/pricing" },
  { label: "Estimateur de prix", href: "/pricing/calculator" },
];

function PricingCalculatorJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Tarifs", url: "https://www.rentready.fr/pricing" },
      {
        name: "Estimateur de prix",
        url: "https://www.rentready.fr/pricing/calculator",
      },
    ]),
    buildWebApplicationSchema({
      name: "Estimateur de Prix RentReady",
      description:
        "Estimez le coût de votre abonnement RentReady en fonction du nombre de biens gérés et du plan choisi.",
      url: "/pricing/calculator",
    }),
    buildHowToSchema({
      name: "Comment utiliser l'estimateur de prix RentReady",
      description:
        "Sélectionnez le nombre de biens que vous gérez et les fonctionnalités souhaitées pour estimer votre tarif mensuel RentReady.",
      url: "/pricing/calculator",
      steps: [
        {
          name: "Sélectionnez votre nombre de biens",
          text: "Choisissez entre 1 et 10+ biens pour voir les plans adaptés.",
        },
        {
          name: "Choisissez les fonctionnalités",
          text: "Cochez les fonctionnalités dont vous avez besoin (relance automatique, OCR, export comptable).",
        },
        {
          name: "Comparez les plans",
          text: "Visualisez le plan recommandé et le tarif mensuel estimé.",
        },
        {
          name: "Inscrivez-vous gratuitement",
          text: "Démarrez votre essai gratuit de 14 jours sans carte bancaire.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function PricingCalculatorPage() {
  return (
    <>
      <PricingCalculatorJsonLd />
      <Breadcrumb items={breadcrumbItems} />
      <PricingCalculatorClient />
    </>
  );
}
