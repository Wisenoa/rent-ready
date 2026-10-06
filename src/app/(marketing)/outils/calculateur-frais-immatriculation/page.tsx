import type { Metadata } from "next";
import { FraisImmatriculationClient } from "./calculator-client";
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
      "Calculateur Frais d'Immatriculation — Gratuit | RentReady",
    description:
      "Estimez les frais de Mutation (frais de notaires) pour l'achat d'un bien immobilier. Calculez les droits de mutation et les émoluments du notaire.",
    url: "/outils/calculateur-frais-immatriculation",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Frais Immatriculation", href: "/outils/calculateur-frais-immatriculation" },
];

function FraisImmatriculationJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur Frais d'Immatriculation", url: "https://www.rentready.fr/outils/calculateur-frais-immatriculation" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Frais d'Immatriculation",
      description:
        "Estimez les frais de mutation (frais de notaires) lors de l'achat d'un bien immobilier : droits de mutation, émoluments du notaire, et frais de gestion.",
      url: "/outils/calculateur-frais-immatriculation",
    }),
    buildHowToSchema({
      name: "Comment calculer les frais d'immatriculation d'un bien",
      description:
        "Apprenez à estimer les frais de notaire lors de l'achat d'un bien immobilier, y compris les droits de mutation et les émoluments.",
      url: "/outils/calculateur-frais-immatriculation",
      steps: [
        {
          name: "Identifiez le prix d'achat",
          text: "Le prix d'achat est le prix négocié avec le vendeur, hors frais de notaire. En cas de négociations incluent des meubles, separer le prix du fonds de commerce du prix de l'immobilier.",
        },
        {
          name: "Calculez les droits de mutation",
          text: "Les droits de mutation sont composés de la taxe de publicité foncière (1.2% à 4.5% selon les départements), de la taxeadditionnelle (1.2% à 1.4%), et des frais de gestion (2.5% du montant). En savoir plus sur les taux par département.",
        },
        {
          name: "Ajoutez les émoluments du notaire",
          text: "Les émoluments du notaire sont réglementés et calculés selon un barème décroissant appliqué au prix d'achat. Pour un bien à 300 000 €, les émoluments sont d'environ 3 000 € HT.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function FraisImmatriculationPage() {
  return (
    <>
      <FraisImmatriculationJsonLd />
      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>🏛️</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Calculateur de Frais d'Immatriculation
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Estimez les frais de mutation (frais de notaires) lors de l'achat d'un bien immobilier. Calculez les droits de mutation, les émoluments du notaire et le budget total.
            </p>
          </div>
          <FraisImmatriculationClient />
        </div>
      </div>
    </>
  );
}
