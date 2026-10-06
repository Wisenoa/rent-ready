import type { Metadata } from "next";
import { CoutDemangementClient } from "./calculator-client";
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
      "Estimateur Cout de Déménagement — Gratuit | RentReady",
    description:
      "Estimez le coût de votre déménagement : volume à déménager, distance, services可选 (démontage, emballage, stockage). Comparez les fourchette de prix en France.",
    url: "/outils/estimateur-cout-demangement",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Estimateur Cout Déménagement", href: "/outils/estimateur-cout-demangement" },
];

function CoutDemangementJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Estimateur Cout de Déménagement", url: "https://www.rentready.fr/outils/estimateur-cout-demangement" },
    ]),
    buildWebApplicationSchema({
      name: "Estimateur de Cout de Déménagement",
      description:
        "Estimez le coût de votre déménagement en fonction du volume, de la distance et des services的选择 (emballage, démontage, stockage). Outil gratuit pour propriétaires bailleurs.",
      url: "/outils/estimateur-cout-demangement",
    }),
    buildHowToSchema({
      name: "Comment estimer le coût de son déménagement",
      description:
        "Apprenez à estimer le coût de votre déménagement en prenant en compte le volume, la distance et les services的选择.",
      url: "/outils/estimateur-cout-demangement",
      steps: [
        {
          name: "Calculez le volume à déménager",
          text: "Estimez le volume total de vos meubles et affaires en mètres cubes. Une méthode simple : superficie actuelle × 0.4 pour un logement meublé, × 0.3 pour un logement vide.",
        },
        {
          name: "Mesurez la distance",
          text: "La distance entre votre logement actuel et le nouveau en kilomètres. Une distance de plus de 500 km implique généralement des frais deafsibilité.",
        },
        {
          name: "Choisissez les services",
          text: "Déterminez les services complementaires : emballage par le déménageur, démontage des meubles, stockage temporaire, emulation de piano ou œuvres dart.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function CoutDemangementPage() {
  return (
    <>
      <CoutDemangementJsonLd />
      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>📦</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Estimateur de Cout de Déménagement
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Estimez le budget de votre déménagement selon le volume à déplacer, la distance et les services的选择. fourchettes de prix indicatives en euros, TTC.
            </p>
          </div>
          <CoutDemangementClient />
        </div>
      </div>
    </>
  );
}
