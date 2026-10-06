import type { Metadata } from "next";
import { AugmentationLoyerClient } from "./calculator-client";
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
      "Calculateur Augmentation de Loyer 2026 — Gratuit | RentReady",
    description:
      "Calculez l'augmentation légale de votre loyer 2026 selon l'IRL. Estimation gratuite et conforme à la loi Alur pour propriétaires et locataires.",
    url: "/outils/calculateur-augmentation-loyer",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Augmentation Loyer", href: "/outils/calculateur-augmentation-loyer" },
];

function AugmentationLoyerJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur Augmentation Loyer", url: "https://www.rentready.fr/outils/calculateur-augmentation-loyer" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur d'Augmentation de Loyer",
      description:
        "Estimez l'augmentation légale de loyer en 2026 selon l'Indice de Référence des Loyers (IRL) et la loi Alur. Outil gratuit pour propriétaires et locataires.",
      url: "/outils/calculateur-augmentation-loyer",
    }),
    buildHowToSchema({
      name: "Comment calculer une augmentation de loyer légale",
      description:
        "Calculez l'augmentation de loyer maximale légale en utilisant l'Indice de Référence des Loyers. Cette méthode est obligatoire en zone tendue et encadrée par la loi.",
      url: "/outils/calculateur-augmentation-loyer",
      steps: [
        {
          name: "Récupérez le loyer actuel hors charges",
          text: "Identifiez le montant du loyer hors charges (charges non comprises) inscrit dans le bail en cours.",
        },
        {
          name: "Notez l'indice IRL de référence du bail",
          text: "Repérez dans le bail la clause d'indexation et l'indice IRL de référence utilisé lors de la dernière révision.",
        },
        {
          name: "Obtenez le nouvel IRL en vigueur",
          text: "Consultez l'IRL du dernier trimestre publié par l'INSEE (disponible sur insee.fr ou notre calculateur IRL).",
        },
        {
          name: "Calculez et vérifiez la conformité",
          text: "Appliquer la formule : nouveau loyer = loyer actuel × (nouvel IRL / ancien IRL). Comparez au résultat de notre calculateur.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function AugmentationLoyerPage() {
  return (
    <>
      <AugmentationLoyerJsonLd />
      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>📈</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Calculateur d'Augmentation de Loyer 2026
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Estimez l'augmentation légale de votre loyer en utilisant l'Indice de Référence des Loyers (IRL). Cet outil est conforme à la réglementation en vigueur pour les zones tendues et non tendues.
            </p>
          </div>
          <AugmentationLoyerClient />
        </div>
      </div>
    </>
  );
}
