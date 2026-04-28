import type { Metadata } from "next";
import { PreavisCalculatorClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  buildGraphSchema,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildHowToSchema,
} from "@/lib/seo/structured-data";
import { SchemaMarkup } from "@/components/seo/schema-markup";

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur de Préavis Locataire — Gratuit | RentReady",
    description:
      "Calculez la durée de préavis légale pour votre départ de location selon la zone géographique, le type de bail, et votre situation. Outil gratuit — base légale 2026.",
    url: "/outils/calculateur-preavis",
    ogType: "outil",
  });
}

function CalculateurPreavisJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur de Préavis", url: "https://www.rentready.fr/outils/calculateur-preavis" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Préavis Locataire",
      description:
        "Outil gratuit pour calculer la durée de préavis légale applicable lors d'un départ de location, selon la zone géographique, le type de bail et la situation du locataire.",
      url: "/outils/calculateur-preavis",
    }),
    buildHowToSchema({
      name: "Comment calculer la durée de préavis de départ",
      description:
        "Déterminez la durée de préavis légale pour votre départ de location en fonction de votre situation et de la zone géographique.",
      url: "/outils/calculateur-preavis",
      steps: [
        {
          name: "Sélectionnez votre situation",
          text: "Indiquez si vous êtes en zone tendue (ou si vous avez une justification : perte d'emploi, mutation, santé).",
        },
        {
          name: "Précisez le type de bail",
          text: "Choisissez bail vide, bail meublé, ou bail mobilité. La durée du préavis diffère selon le type.",
        },
        {
          name: "Indiquez la zone géographique",
          text: "Précisez si le bien est situé en zone tendue ou non tendue pour appliquer le régime approprié.",
        },
        {
          name: "Consultez la durée de préavis applicable",
          text: "Visualisez la durée légale du préavis en mois et la date limite de départ effective.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function CalculateurPreavisPage() {
  return (
    <>
      <CalculateurPreavisJsonLd />
      <PreavisCalculatorClient />
    </>
  );
}