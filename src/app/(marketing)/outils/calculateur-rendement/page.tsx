import type { Metadata } from "next";
import { YieldCalculatorClient } from "./calculator-client";
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
    title: "Calculateur Rendement Locatif — NET & BRUT 2026 | RentReady",
    description:
      "Calculez votre rendement locatif NET et BRUT en quelques clics. Outil gratuit pour investisseurs immobiliers avec indicateurs détaillés.",
    url: "/outils/calculateur-rendement",
    ogType: "outil",
  });
}

function CalculateurRendementJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur Rendement Locatif", url: "https://www.rentready.fr/outils/calculateur-rendement" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Rendement Locatif NET & BRUT",
      description:
        "Outil gratuit pour calculer le rendement locatif brut et net de votre investissement immobilier, avec indicators de performance détaillés.",
      url: "/outils/calculateur-rendement",
    }),
    buildHowToSchema({
      name: "Comment calculer le rendement locatif",
      description:
        "Calculez le rendement NET et BRUT de votre investissement locatif pour évaluer sa rentabilité.",
      url: "/outils/calculateur-rendement",
      steps: [
        {
          name: "Entrez le prix d'achat du bien",
          text: "Indiquez le prix d'acquisition complet du bien (frais d'agence et de notaire inclus).",
        },
        {
          name: "Saisissez le montant du loyer mensuel",
          text: "Indiquez le loyer mensuel hors charges que vous percevez ou prévoyez de percevoir.",
        },
        {
          name: "Ajoutez les charges annuelles",
          text: "Saisissez les charges de propriété annuelles (taxe foncière, entretien, assurances, charges de copropriété).",
        },
        {
          name: "Consultez les indicateurs de rendement",
          text: "Visualisez le rendement brut, le rendement net, et l'estimation du rendement net-net après impôt.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function CalculateurRendementPage() {
  return (
    <>
      <CalculateurRendementJsonLd />
      <YieldCalculatorClient />
    </>
  );
}
