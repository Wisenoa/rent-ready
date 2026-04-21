import type { Metadata } from "next";
import { PlusValueClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur de Plus-Value Immobilière — Plus-Value 2025 | RentReady",
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

export default function PlusValuePage() {
  return (
    <>
      <SchemaMarkup data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculateur de Plus-Value Immobilière",
        description: "Estimez votre plus-value immobilière et l'impôt à payer. Outil gratuit avec abattements pour résidence principale, durée de détention, et travaux.",
        url: "https://www.rentready.fr/outils/calculateur-plus-value",
        applicationCategory: "FinancialApplication",
        operatingSystem: "Web",
      }} />
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
