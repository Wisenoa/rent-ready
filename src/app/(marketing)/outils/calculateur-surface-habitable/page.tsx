import type { Metadata } from "next";
import { SurfaceHabitableClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur de Surface Habitable — Loi Boutin 2025 | RentReady",
    description: "Calculez la surface habitable d'un logement selon la loi Boutin. Outil gratuit pour vérifier la surface exact et éviter les litiges delojeur.",
    url: "/outils/calculateur-surface-habitable",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Surface Habitable", href: "/outils/calculateur-surface-habitable" },
];

export default function SurfaceHabitablePage() {
  return (
    <>
      <SchemaMarkup data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Calculateur de Surface Habitable",
        description: "Calculez la surface habitable selon la loi Boutin. Outil gratuit pour mesurer la surface exact d'un logement et éviter les litiges.",
        url: "https://www.rentready.fr/outils/calculateur-surface-habitable",
        applicationCategory: "UtilityApplication",
        operatingSystem: "Web",
      }} />
      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>📐</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Calculateur de Surface Habitable
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Calculez la surface habitable d'un logement selon la loi Boutin. Utilisez cet outil pour vérifier la surface exacte avant de signer un bail et éviter les litiges.
            </p>
          </div>
          <SurfaceHabitableClient />
        </div>
      </div>
    </>
  );
}
