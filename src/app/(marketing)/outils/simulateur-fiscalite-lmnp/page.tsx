import type { Metadata } from "next";
import { SimulateurLmnpClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export async function generateMetadata() {
  return baseMetadata({
    title: "Simulateur Fiscal LMNP — Loueur Meublé Non Professionnel 2025 | RentReady",
    description: "Estimez vos impôts en LMNP (loueur meublé non professionnel). Comparaison micro-BIC vs réel, amortissement et déficit imputable. Outil gratuit.",
    url: "/outils/simulateur-fiscalite-lmnp",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Simulateur Fiscal LMNP", href: "/outils/simulateur-fiscalite-lmnp" },
];

export default function SimulateurFiscalLmnpPage() {
  return (
    <>
      <SchemaMarkup data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Simulateur Fiscal LMNP",
        description: "Estimez vos impôts en LMNP (loueur meublé non professionnel). Comparez micro-BIC et régime réel, calculez amortissements et déficit.",
        url: "https://www.rentready.fr/outils/simulateur-fiscalite-lmnp",
        applicationCategory: "FinancialApplication",
        operatingSystem: "Web",
      }} />
      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>🏠</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Simulateur Fiscal LMNP
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Estimez votre imposition en statut LMNP (Loueur Meublé Non Professionnel). Comparez le régime micro-BIC avec le régime réel pour trouver le plus avantageux.
            </p>
          </div>
          <SimulateurLmnpClient />
        </div>
      </div>
    </>
  );
}
