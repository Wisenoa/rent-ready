import type { Metadata } from "next";
import { ChecklistEDLClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  buildGraphSchema,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildHowToSchema,
} from "@/lib/seo/structured-data";
import { SchemaMarkup } from "@/components/seo/schema-markup";

export async function generateMetadata() {
  return baseMetadata({
    title: "Checklist État des Lieux — Interactive | RentReady",
    description:
      "Checklist interactive pour réaliser un état des lieux entrée ou sortie conforme à la loi. Parcourez chaque pièce, cochez les éléments, et générez un reçu récapitulatif.",
    url: "/outils/checklist-etat-lieux",
    ogType: "outil",
  });
}

function ChecklistEDLJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Checklist État des Lieux", url: "https://www.rentready.fr/outils/checklist-etat-lieux" },
    ]),
    buildWebApplicationSchema({
      name: "Checklist État des Lieux Interactif",
      description:
        "Checklist interactive pour réaliser un état des lieux entrée ou sortie conforme à la loi du 6 juillet 1989. Parcourez chaque pièce et générez un reçu.",
      url: "/outils/checklist-etat-lieux",
    }),
    buildHowToSchema({
      name: "Comment réaliser un état des lieux conforme",
      description:
        "Utilisez la checklist interactive pour réaliser un état des lieux entrée ou sortie complet et juridiquement valide.",
      url: "/outils/checklist-etat-lieux",
      steps: [
        {
          name: "Sélectionnez le type d'état des lieux",
          text: "Choisissez entre état des lieux d'entrée (début de location) ou de sortie (fin de location).",
        },
        {
          name: "Parcourez chaque pièce du bien",
          text: "Navigatez pièce par pièce : salon, chambres, cuisine, salle de bain, WC, annexes.",
        },
        {
          name: "Notez l'état de chaque élément",
          text: "Cochez OK, défaillant ou absent pour chaque élément listé dans la pièce. Ajoutez des photos si nécessaire.",
        },
        {
          name: "Générez le reçu de l'état des lieux",
          text: "Téléchargez le reçu récapitulatif de l'état des lieux avec toutes les observations pour signature.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function ChecklistEDLPage() {
  return (
    <>
      <ChecklistEDLJsonLd />
      <ChecklistEDLClient />
    </>
  );
}