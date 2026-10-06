import type { Metadata } from "next";
import { RentabiliteClient } from "./calculator-client";
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
      "Calculateur Rentabilité Locative — Gratuit | RentReady",
    description:
      "Calculez la rentabilité brute et nette de votre investissement locatif. Analysez le rendement locatif avec tous les frais déductibles pour une estimation précise.",
    url: "/outils/calculateur-rentabilite",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Rentabilité", href: "/outils/calculateur-rentabilite" },
];

function RentabiliteJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur Rentabilité Locative", url: "https://www.rentready.fr/outils/calculateur-rentabilite" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Rentabilité Locative",
      description:
        "Calculez le rendement brut et net de votre investissement locatif en tenant compte de tous les frais. Comparaison avec les benchmarks par ville.",
      url: "/outils/calculateur-rentabilite",
    }),
    buildHowToSchema({
      name: "Comment calculer la rentabilité d'un investissement locatif",
      description:
        "Apprenez à calculer le rendement locatif brut et net pour évaluer la performance de votre investissement immobilier.",
      url: "/outils/calculateur-rentabilite",
      steps: [
        {
          name: "Estimez le prix d'achat total",
          text: "Incluez le prix du bien, les frais de notaire (environ 7-8%), et les éventuels frais d'agence.",
        },
        {
          name: "Calculez le revenu locatif annuel",
          text: "Multipliez le loyer mensuel par 12, puis déduisez la vacance locative estimée.",
        },
        {
          name: "Listez les charges annuelles",
          text: "Incluez la taxe foncière, assurance PNO, frais de gestion, charges de copropriété, et intérêts d'emprunt.",
        },
        {
          name: "Obtenez votre rendement",
          text: "Le rendement net = (loyer annuel net de charges / prix d'achat total) × 100.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function RentabilitePage() {
  return (
    <>
      <RentabiliteJsonLd />
      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>💰</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Calculateur de Rentabilité Locative
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Estimez le rendement brut et net de votre investissement locatif. Analysez votre rentabilité avec les benchmarks par ville en France.
            </p>
          </div>
          <RentabiliteClient />
        </div>
      </div>
    </>
  );
}
