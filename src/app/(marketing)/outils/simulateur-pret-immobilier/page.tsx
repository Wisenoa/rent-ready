import type { Metadata } from "next";
import { SimulateurPretClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export async function generateMetadata() {
  return baseMetadata({
    title: "Simulateur de Prêt Immobilier — Calcul Mensualité en Ligne | RentReady",
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

export default function SimulateurPretPage() {
  return (
    <>
      <SchemaMarkup data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Simulateur de Prêt Immobilier",
        description: "Calculez votre mensualité de prêt immobilier avec tableau d'amortissement. Simulateur gratuit pour investisseurs locatifs.",
        url: "https://www.rentready.fr/outils/simulateur-pret-immobilier",
        applicationCategory: "FinancialApplication",
        operatingSystem: "Web",
      }} />
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
