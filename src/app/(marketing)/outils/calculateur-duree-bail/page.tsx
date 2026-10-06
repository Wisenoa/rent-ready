import type { Metadata } from "next";
import { DureeBailClient } from "./calculator-client";
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
      "Calculateur Durée de Bail — Gratuit | RentReady",
    description:
      "Déterminez la durée de bail recommandée pour votre location : 3 ans (meublé) ou 6 ans (nu). Estimez aussi la durée moyenne de location avant relocation.",
    url: "/outils/calculateur-duree-bail",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Durée de Bail", href: "/outils/calculateur-duree-bail" },
];

function DureeBailJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur Durée de Bail", url: "https://www.rentready.fr/outils/calculateur-duree-bail" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Durée de Bail",
      description:
        "Déterminez la durée de bail recommandée en fonction du type de bien (meublé ou nu) et estimez la durée moyenne de location avant relocation.",
      url: "/outils/calculateur-duree-bail",
    }),
    buildHowToSchema({
      name: "Comment choisir la durée de bail appropriée",
      description:
        "Apprenez à choisir entre un bail de 3 ans et un bail de 6 ans selon votre situation et le type de location.",
      url: "/outils/calculateur-duree-bail",
      steps: [
        {
          name: "Identifiez le type de location",
          text: "Un bail de 3 ans est obligatoire pour les locations meublées. Un bail de 6 ans est obligatoire pour les locations nues (vides). Le bail mobilité est de 1 à 10 mois, non renouvelable.",
        },
        {
          name: "Estimez votre horizon de placement",
          text: "Si vous envisagez une vente à moyen terme (moins de 6 ans), un bail de 3 ans meublé offre plus de flexibilité. Pour un placement long terme, le bail de 6 ans assure une meilleure sécurité.",
        },
        {
          name: "Calculez le coût du turnover",
          text: "Chaque changement de locataire implique des coûts :地去新的寻租广告、整修工程、可能的无租金期间。6年合同可减少这些成本。",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function DureeBailPage() {
  return (
    <>
      <DureeBailJsonLd />
      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>📋</span> Obligatoire
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Calculateur de Durée de Bail
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Déterminez la durée de bail minimale obligatoire selon le type de bien et estimez le coût moyen du changement de locataire pourPlanifier votre investissement locatif.
            </p>
          </div>
          <DureeBailClient />
        </div>
      </div>
    </>
  );
}
