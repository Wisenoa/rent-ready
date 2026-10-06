import type { Metadata } from "next";
import { ProvisionChargesClient } from "./calculator-client";
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
      "Calculateur Provision sur Charges — Gratuit | RentReady",
    description:
      "Calculez la provision mensuelle sur charges locatives à demander au locataire. Estimez le montant公平 en fonction des charges de copropriété réelles.",
    url: "/outils/calculateur-provision-charges",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Provision Charges", href: "/outils/calculateur-provision-charges" },
];

function ProvisionChargesJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur Provision sur Charges", url: "https://www.rentready.fr/outils/calculateur-provision-charges" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Provision sur Charges",
      description:
        "Estimez la provision mensuelle sur charges à demander au locataire selon les dépenses réelles de copropriété. Évitez les régularisations importantes en fin d'année.",
      url: "/outils/calculateur-provision-charges",
    }),
    buildHowToSchema({
      name: "Comment calculer la provision sur charges locatives",
      description:
        "Apprenez à estimer correctement la provision mensuelle sur charges pour couvrir les dépenses réelles et éviter les régularisations importantes.",
      url: "/outils/calculateur-provision-charges",
      steps: [
        {
          name: "Identifiez les charges récupérables",
          text: "Les charges récupérables comprennent : eau froide, chauffage collectif, ascended, entretien des parties communes, taxes d'enlèvement des ordures ménagères, etc.",
        },
        {
          name: "Estimez les charges annuelles",
          text: "À partir du dernier appel de fonds de copropriété ou de vos propres dépenses, estimez le total annuel des charges récupérables.",
        },
        {
          name: "Divisez par le nombre de lots",
          text: "La provision par lot est Calculée au prorata de la surface habitable ou des tantièmes de copropriété.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function ProvisionChargesPage() {
  return (
    <>
      <ProvisionChargesJsonLd />
      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>📊</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Calculateur de Provision sur Charges
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Estimez le montant de la provision mensuelle sur charges à demander au locataire pour couvrir les dépenses réelles de copropriété et éviter les régularisations importantes.
            </p>
          </div>
          <ProvisionChargesClient />
        </div>
      </div>
    </>
  );
}
