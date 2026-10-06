import type { Metadata } from "next";
import { IndemnitePreavisClient } from "./calculator-client";
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
      "Calculateur Indemnité de Préavis — Gratuit | RentReady",
    description:
      "Calculez l'indemnité de préavis pour résiliation de bail de location. Estimez le montant à verser en cas de départ anticipé du locataire ou de giving notice par le propriétaire.",
    url: "/outils/calculateur-indemnite-preavis",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Indemnité Préavis", href: "/outils/calculateur-indemnite-preavis" },
];

function IndemnitePreavisJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur Indemnité de Préavis", url: "https://www.rentready.fr/outils/calculateur-indemnite-preavis" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur d'Indemnité de Préavis",
      description:
        "Estimez l'indemnité de préavis due en cas de résiliation de bail de location. Applicable au locataire comme au bailleur, selon la durée restante et le loyer.",
      url: "/outils/calculateur-indemnite-preavis",
    }),
    buildHowToSchema({
      name: "Comment calculer l'indemnité de préavis de votre bail",
      description:
        "Calculez l'indemnité de préavis légale lors d'une rupture de bail de location. Comprend le cas du locataire, du bailleur, et les règles en zone tendue.",
      url: "/outils/calculateur-indemnite-preavis",
      steps: [
        {
          name: "Identifiez le contexte de la rupture",
          text: "Est-ce le locataire qui donne préavis ou le bailleur ? Les règles diffèrent légèrement (durée du préavis, indemnité).",
        },
        {
          name: "Déterminez la durée de préavis applicable",
          text: "En zone tendue : 1 mois pour le locataire. En zone non tendue : 3 mois (locataire). Pour le bailleur qui reprend : toujours 3 mois (6 mois en cas de raison légitime).",
        },
        {
          name: "Calculez l'indemnité",
          text: "L'indemnité habituelle = loyer × 1/12 (un mois) ou au prorata des месяцев restants. Vérifiez les accordslocatifs applicables.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function IndemnitePreavisPage() {
  return (
    <>
      <IndemnitePreavisJsonLd />
      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>⏱️</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Calculateur d'Indemnité de Préavis
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Estimez l'indemnité de préavis due lors de la résiliation d'un bail de location. Applicable pour le locataire comme pour le bailleur.
            </p>
          </div>
          <IndemnitePreavisClient />
        </div>
      </div>
    </>
  );
}
