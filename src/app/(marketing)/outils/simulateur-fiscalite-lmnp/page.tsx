import type { Metadata } from "next";
import { SimulateurLmnpClient } from "./calculator-client";
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
    title: "Simulateur Fiscal LMNP 2026 — Loueur Meublé Non Professionnel | RentReady",
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

function SimulateurFiscalLmnpJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Simulateur Fiscal LMNP", url: "https://www.rentready.fr/outils/simulateur-fiscalite-lmnp" },
    ]),
    buildWebApplicationSchema({
      name: "Simulateur Fiscal LMNP",
      description:
        "Estimez vos impôts en LMNP (loueur meublé non professionnel). Comparez le régime micro-BIC avec le régime réel pour trouver le plus avantageux.",
      url: "/outils/simulateur-fiscalite-lmnp",
    }),
    buildHowToSchema({
      name: "Comment estimer ses impôts en LMNP",
      description:
        "Estimez votre imposition en statut LMNP en comparant le régime micro-BIC avec le régime réel pour choisir le plus avantageux fiscalement.",
      url: "/outils/simulateur-fiscalite-lmnp",
      steps: [
        {
          name: "Saisissez vos revenus locatifs",
          text: "Indiquez vos revenus locatifs annuels hors charges et le nombre de mois de location dans l'année.",
        },
        {
          name: "Choisissez le régime fiscal",
          text: "Sélectionnez le régime micro-BIC (abattement forfaitaire de 50%) ou le régime réel (déduction des charges et amortissements).",
        },
        {
          name: "Ajoutez vos charges et amortissements",
          text: "En régime réel, ajoutez vos charges (travaux, intérêts d'emprunt, assurances) et l'amortissement du bien.",
        },
        {
          name: "Comparez les deux régimes",
          text: "Visualisez l'estimation d'impôt pour chaque régime et identifié lequel est le plus avantageux pour votre situation.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function SimulateurFiscalLmnpPage() {
  return (
    <>
      <SimulateurFiscalLmnpJsonLd />
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
