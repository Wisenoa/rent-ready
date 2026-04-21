import type { Metadata } from "next";
import { CongeVenteClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export async function generateMetadata() {
  return baseMetadata({
    title: "Générateur de Congé pour Vente — Lettre de Congé Vendeur | RentReady",
    description: "Générez un congé pour vente conforme au Code de la construction. Document gratuit avec modèle de lettre de congé pour vendre votre bien locatif.",
    url: "/outils/generateur-conge-vente",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Congé pour Vente", href: "/outils/generateur-conge-vente" },
];

export default function CongeVentePage() {
  return (
    <>
      <SchemaMarkup data={{
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Générateur de Congé pour Vente",
        description: "Générez un congé pour vente conforme. Modèle gratuit de lettre de congé pour vendre un bien locatif avec notification légale au locataire.",
        url: "https://www.rentready.fr/outils/generateur-conge-vente",
        applicationCategory: "LegalServiceApplication",
        operatingSystem: "Web",
      }} />
      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>📄</span> Outil gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Générateur de Congé pour Vente
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed">
              Générez un congé pour vente conforme au Code de la construction et de l'habitation. Document prêt à envoyer en lettre recommandée avec accusé de réception.
            </p>
          </div>
          <CongeVenteClient />
        </div>
      </div>
    </>
  );
}
