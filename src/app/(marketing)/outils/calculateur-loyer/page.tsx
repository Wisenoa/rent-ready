import type { Metadata } from "next";
import { LoyerCalculatorClient } from "./calculator-client";
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
    title: "Calculateur de Loyer au m² — Gratuit | RentReady",
    description:
      "Estimez le loyer de votre bien selon la surface et le prix au m². Applicable en zone tendue et non tendue. Outil gratuit — mis à jour 2025.",
    url: "/outils/calculateur-loyer",
    ogType: "outil",
  });
}

function CalculateurLoyerJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur de Loyer", url: "https://www.rentready.fr/outils/calculateur-loyer" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Loyer au m²",
      description:
        "Estimez le loyer de votre bien immobilier selon la surface en m² et le prix au m² applicable dans votre zone géographique.",
      url: "/outils/calculateur-loyer",
    }),
    buildHowToSchema({
      name: "Comment estimer un loyer avec le Calculateur de Loyer",
      description:
        "Estimez le loyer de votre bien selon la surface, le prix au m² et la zone géographique (tendue ou non tendue).",
      url: "/outils/calculateur-loyer",
      steps: [
        {
          name: "Entrez la surface du bien (en m²)",
          text: "Saisissez la surface habitable du bien en mètres carrés,hors annexes et parties communes.",
        },
        {
          name: "Entrez le prix au m² dans votre zone",
          text: "Indiquez le prix de référence au m² pour votre commune ou zone géographique.",
        },
        {
          name: "Sélectionnez la zone (tendue ou non tendue)",
          text: "Choisissez si votre bien est situé en zone tendue (encadrement des loyers) ou non tendue.",
        },
        {
          name: "Consultez le loyer estimé",
          text: "Visualisez le loyer mensuel estimé et vérifiez sa conformité avec les plafonds en vigueur.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function CalculateurLoyerPage() {
  return (
    <>
      <CalculateurLoyerJsonLd />
      <LoyerCalculatorClient />
    </>
  );
}