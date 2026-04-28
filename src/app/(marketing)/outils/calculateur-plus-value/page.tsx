import type { Metadata } from "next";
import { PlusValueClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import {
  buildGraphSchema,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildHowToSchema,
} from "@/lib/seo/structured-data";

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur Plus-Value Immobilière 2026 — Gratuit | RentReady",
    description: "Estimez votre plus-value immobilière et l'impôt à payer lors de la vente d'un bien. Outil gratuit avec tous les abattements légaux applicables.",
    url: "/outils/calculateur-plus-value",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Plus-Value", href: "/outils/calculateur-plus-value" },
];

function PlusValueJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur Plus-Value", url: "https://www.rentready.fr/outils/calculateur-plus-value" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Plus-Value Immobilière",
      description:
        "Estimez votre plus-value immobilière et l'impôt à payer lors de la vente d'un bien. Outil gratuit avec abattements pour résidence principale, durée de détention, et travaux.",
      url: "/outils/calculateur-plus-value",
    }),
    buildHowToSchema({
      name: "Comment calculer la plus-value immobilière",
      description:
        "Estimez votre plus-value immobilière nette d'impôt en tenant compte des abattements légaux selon la durée de détention.",
      url: "/outils/calculateur-plus-value",
      steps: [
        {
          name: "Saisissez le prix de vente",
          text: "Indiquez le prix de vente du bien immobilier tel qu'il figure dans l'acte authentique.",
        },
        {
          name: "Indiquez le prix d'acquisition",
          text: "Précisez le prix d'achat initial ou la valeur vénale au moment de l'acquisition.",
        },
        {
          name: "Ajoutez les frais et travaux",
          text: "Ajoutez les frais d'acquisition (frais de notaire, droits de mutation) et les travaux de rénovation éventuels.",
        },
        {
          name: "Visualisez votre plus-value nette",
          text: "Consultez le montant de votre plus-value imposable et l'estimation d'impôt après abattements.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function PlusValuePage() {
  return (
    <>
      <PlusValueJsonLd />
      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>📊</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Calculateur de Plus-Value Immobilière
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Estimez votre plus-value nette d'impôt lors de la vente d'un bien immobilier. Tient compte des abattements légaux selon la durée de détention.
            </p>
          </div>
          <PlusValueClient />
        </div>
      </div>
    </>
  );
}
