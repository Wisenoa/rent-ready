import type { Metadata } from "next";
import { CongeVenteClient } from "./calculator-client";
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
    title: "Générateur Congé pour Vente 2026 — Lettre Congé Vendeur | RentReady",
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

function CongeVenteJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Congé pour Vente", url: "https://www.rentready.fr/outils/generateur-conge-vente" },
    ]),
    buildWebApplicationSchema({
      name: "Générateur de Congé pour Vente",
      description:
        "Générez un congé pour vente conforme au Code de la construction. Modèle gratuit de lettre de congé pour vendre un bien locatif avec notification légale au locataire.",
      url: "/outils/generateur-conge-vente",
    }),
    buildHowToSchema({
      name: "Comment rédiger un congé pour vente",
      description:
        "Rédigez un congé pour vente conforme à la loi en informant le locataire au moins 6 mois avant la date d'effet par lettre recommandée avec accusé de réception.",
      url: "/outils/generateur-conge-vente",
      steps: [
        {
          name: "Vérifiez les conditions du congé pour vente",
          text: "Assurez-vous que le bail est en cours et que vous respectez le délai de prévenance de 6 mois avant la date d'effet souhaitée.",
        },
        {
          name: "Générez le document",
          text: "Remplissez les informations du bailleur et du locataire dans notre générateur pour produire un modèle de congé conforme.",
        },
        {
          name: "Envoyez en lettre recommandée",
          text: "Adressez le congé en lettre recommandée avec accusé de réception au locataire pour prouver la date de notification.",
        },
        {
          name: "Respectez le délai de réflexion",
          text: "Le locataire dispose d'un délai pour contester ou accepter le congé. La vente ne peut intervenir qu'à l'expiration de ce délai.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function CongeVentePage() {
  return (
    <>
      <CongeVenteJsonLd />
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
