import type { Metadata } from "next";
import { ChargesCalculatorClient } from "./calculator-client";
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
    title: "Calculateur Charges Locatives — Provision & Déduction | RentReady",
    description:
      "Calculez la répartition des charges locatives entre propriétaire et locataire. Outil gratuit basé sur les règles légales françaises.",
    url: "/outils/calculateur-charges-locatives",
    ogType: "outil",
  });
}

function CalculateurChargesJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur Charges Locatives", url: "https://www.rentready.fr/outils/calculateur-charges-locatives" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Charges Locatives",
      description:
        "Outil gratuit pour calculer la répartition des charges locatives entre propriétaire et locataire, et estimer la provision mensuelle à demander.",
      url: "/outils/calculateur-charges-locatives",
    }),
    buildHowToSchema({
      name: "Comment calculer les charges locatives",
      description:
        "Calculez la répartition des charges entre propriétaire et locataire selon les règles légales françaises.",
      url: "/outils/calculateur-charges-locatives",
      steps: [
        {
          name: "Entrez le montant total des charges annuelles",
          text: "Saisissez le montant total des charges de propriété pour l'année (copropriété, entretien, assurances).",
        },
        {
          name: "Précisez les charges récupérables",
          text: "Indiquez quelle part des charges est récupérable auprès du locataire selon la loi.",
        },
        {
          name: "Entrez la surface du bien",
          text: "Indiquez la surface habitable du bien pour le calcul de la répartition au m².",
        },
        {
          name: "Consultez la répartition et la provision mensuelle",
          text: "Visualisez le montant à votre charge, la partlocataire, et la provision mensuelle recommandée.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function CalculateurChargesLocativesPage() {
  return (
    <>
      <CalculateurChargesJsonLd />
      <ChargesCalculatorClient />
    </>
  );
}
