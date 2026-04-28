import type { Metadata } from "next";
import { SurfaceHabitableClient } from "./calculator-client";
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
    title: "Calculateur de Surface Habitable — loi Boutin 2026 | RentReady",
    description: "Calculez la surface habitable d'un logement selon la loi Boutin. Outil gratuit pour vérifier la surface exacte et éviter les litiges avec le locataire.",
    url: "/outils/calculateur-surface-habitable",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Surface Habitable", href: "/outils/calculateur-surface-habitable" },
];

function SurfaceHabitableJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur Surface Habitable", url: "https://www.rentready.fr/outils/calculateur-surface-habitable" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Surface Habitable",
      description:
        "Calculez la surface habitable d'un logement selon la loi Boutin. Outil gratuit pour mesurer la surface exacte d'un logement et éviter les litiges.",
      url: "/outils/calculateur-surface-habitable",
    }),
    buildHowToSchema({
      name: "Comment calculer la surface habitable selon la loi Boutin",
      description:
        "Mesurez la surface habitable d'un logement en excluant les murs, cloisons, marches, cages d'escalier, gaines et embrasures de portes et fenêtres.",
      url: "/outils/calculateur-surface-habitable",
      steps: [
        {
          name: "Mesurez la surface de chaque pièce",
          text: "Mesurez la longueur et la largeur de chaque pièce principale (séjour, chambres, cuisine, salle de bain) hormis les annexes.",
        },
        {
          name: "Excluez les surfaces non comptabilisées",
          text: "Retirez les murs, cloisons, marches, cages d'escalier, gaines et embrasures de portes et fenêtres de la surface totale.",
        },
        {
          name: "Vérifiez la hauteur sous plafond",
          text: "Seules les pièces avec une hauteur sous plafond d'au moins 1,80 m sont comptabilisées comme surface habitable.",
        },
        {
          name: "Calculez le total",
          text: "Additionnez la surface de toutes les pièces éligibles pour obtenir la surface habitable totale du logement.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function SurfaceHabitablePage() {
  return (
    <>
      <SurfaceHabitableJsonLd />
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
