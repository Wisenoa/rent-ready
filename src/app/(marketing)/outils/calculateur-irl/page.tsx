import type { Metadata } from "next";
import { IRLCalculatorClient } from "./calculator-client";
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
    title: "Calculateur IRL 2026 — Indice de Référence des Loyers | RentReady",
    description:
      "Calculez la révision de loyer avec l'IRL 2026. Historique des indices INSEE, formule officielle et simulateur gratuit pour propriétaires et locataires.",
    url: "/outils/calculateur-irl",
    ogType: "outil",
  });
}

function CalculateurIRLJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur IRL", url: "https://www.rentready.fr/outils/calculateur-irl" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur IRL — Indice de Référence des Loyers",
      description:
        "Outil gratuit pour consulter l'historique des Indices de Référence des Loyers (IRL) et leur variation annuelle. Source : INSEE.",
      url: "/outils/calculateur-irl",
    }),
    buildHowToSchema({
      name: "Comment utiliser le Calculateur IRL",
      description:
        "Consultez l'historique des Indices de Référence des Loyers et la variation annuelle pour ajuster votre loyer conformément à la loi.",
      url: "/outils/calculateur-irl",
      steps: [
        {
          name: "Sélectionnez le trimestre de référence",
          text: "Choisissez le trimestre deseado pour consulter l'indice IRL correspondant (ex : T4 2024).",
        },
        {
          name: "Entrez le montant de votre loyer actuel",
          text: "Saisissez le montant du loyer actuel hors charges pour voir l'évolution de l'indice.",
        },
        {
          name: "Consultez l'indice IRL et la variation annuelle",
          text: "Visualisez l'indice du trimestre sélectionné et comparez-le avec les trimestres précédents.",
        },
        {
          name: "Analysez l'impact sur votre loyer",
          text: "Estimez le montant du loyer révisé en fonction de la variation de l'IRL.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function CalculateurIRLPage() {
  return (
    <>
      <CalculateurIRLJsonLd />
      <IRLCalculatorClient />
    </>
  );
}