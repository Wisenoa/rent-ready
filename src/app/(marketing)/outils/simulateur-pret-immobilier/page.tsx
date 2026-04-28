import type { Metadata } from "next";
import { SimulateurPretClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import {
  buildGraphSchema,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildHowToSchema,
} from "@/lib/seo/structured-data";

export async function generateMetadata() {
  return baseMetadata({
    title: "Simulateur Prêt Immobilier 2026 — Calcul Mensualité en Ligne | RentReady",
    description: "Calculez votre mensualité de prêt immobilier en ligne. Simulateur gratuit avec tableau d'amortissement, taux d'intérêt et durée personnalisables.",
    url: "/outils/simulateur-pret-immobilier",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Simulateur Prêt Immobilier", href: "/outils/simulateur-pret-immobilier" },
];

function SimulateurPretJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Simulateur Prêt Immobilier", url: "https://www.rentready.fr/outils/simulateur-pret-immobilier" },
    ]),
    buildWebApplicationSchema({
      name: "Simulateur de Prêt Immobilier",
      description:
        "Calculez votre mensualité de prêt immobilier en ligne. Simulateur gratuit avec tableau d'amortissement, taux d'intérêt et durée personnalisables.",
      url: "/outils/simulateur-pret-immobilier",
    }),
    buildHowToSchema({
      name: "Comment calculer sa mensualité de prêt immobilier",
      description:
        "Calculez la mensualité de votre emprunt immobilier et visualisez le tableau d'amortissement complet pour planifier votre investissement.",
      url: "/outils/simulateur-pret-immobilier",
      steps: [
        {
          name: "Saisissez le montant emprunté",
          text: "Indiquez le montant total que vous souhaitez emprunter pour financer votre projet immobilier.",
        },
        {
          name: "Définissez le taux d'intérêt",
          text: "Précisez le taux d'intérêt annuel proposé par votre banque ou négocié pour ce prêt.",
        },
        {
          name: "Choisissez la durée de emprunt",
          text: "Sélectionnez la durée de remboursement souhaitée, généralement entre 10 et 25 ans.",
        },
        {
          name: "Visualisez le tableau d'amortissement",
          text: "Consultez la répartition de chaque mensualité entre intérêts et capital amorti sur toute la durée du prêt.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function SimulateurPretPage() {
  return (
    <>
      <SimulateurPretJsonLd />
      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>🏦</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Simulateur de Prêt Immobilier
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Calculez la mensualité de votre emprunt immobilier et visualisez le tableau d'amortissement complet. Outil gratuit pour prepare your projet d'investissement.
            </p>
          </div>
          <SimulateurPretClient />
          <FinalCta />
        </div>
      </div>
    </>
  );
}
