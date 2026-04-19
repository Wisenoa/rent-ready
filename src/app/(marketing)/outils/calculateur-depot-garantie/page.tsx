import type { Metadata } from "next";
import { DepotGarantieCalculatorClient } from "./calculator-client";
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
    title: "Calculateur de Dépôt de Garantie — Gratuit | RentReady",
    description:
      "Calculez le dépôt de garantie maximum légal pour votre location selon la zone géographique (tendue ou non) et le type de bail. Outil gratuit — base légale mise à jour 2025.",
    url: "/outils/calculateur-depot-garantie",
    ogType: "outil",
  });
}

function CalculateurDepotGarantieJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur Dépôt de Garantie", url: "https://www.rentready.fr/outils/calculateur-depot-garantie" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Dépôt de Garantie",
      description:
        "Outil gratuit pour calculer le montant maximum du dépôt de garantie autorisé selon la zone géographique et le type de bail en France.",
      url: "/outils/calculateur-depot-garantie",
    }),
    buildHowToSchema({
      name: "Comment calculer le dépôt de garantie maximum",
      description:
        "Calculez le plafond légal du dépôt de garantie pour votre location selon la zone et le type de bail.",
      url: "/outils/calculateur-depot-garantie",
      steps: [
        {
          name: "Sélectionnez le type de bail",
          text: "Choisissez entre bail vide, bail meublé, bail mobilité ou bail professionnel.",
        },
        {
          name: "Indiquez le montant mensuel du loyer charges comprises",
          text: "Saisissez le montant du loyer charges comprises pour calculer le plafond对应的 dépôt.",
        },
        {
          name: "Sélectionnez la zone géographique",
          text: "Précisez si le bien est situé en zone tendue (encadrement) ou non tendue.",
        },
        {
          name: "Consultez le dépôt de garantie maximum légal",
          text: "Visualisez le plafond légal et vérifiez que le montant de votre dépôt est conforme.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function CalculateurDepotGarantiePage() {
  return (
    <>
      <CalculateurDepotGarantieJsonLd />
      <DepotGarantieCalculatorClient />
    </>
  );
}