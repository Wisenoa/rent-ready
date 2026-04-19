import type { Metadata } from "next";
import { IRLCalculatorClient } from "./calculator-client";
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
    title: "Calculateur Révision de Loyer IRL 2026 — Gratuit | RentReady",
    description:
      "Calculez la révision de loyer selon l'indice IRL. Outil gratuit pour ajuster automatiquement le loyer du bail de location avec les derniers indices INSEE 2026.",
    url: "/outils/calculateur-revision-irl",
    ogType: "outil",
  });
}

function CalculateurRevisionIRLJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Calculateur Révision IRL", url: "https://www.rentready.fr/outils/calculateur-revision-irl" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Révision de Loyer IRL",
      description:
        "Outil gratuit pour calculer la révision de loyer annuelle selon l'Indice de Référence des Loyers (IRL) publié par l'INSEE.",
      url: "/outils/calculateur-revision-irl",
    }),
    buildHowToSchema({
      name: "Comment réviser un loyer avec l'IRL",
      description:
        "Calculez le nouveau montant du loyer révisé selon la variation de l'Indice de Référence des Loyers et la clause du bail.",
      url: "/outils/calculateur-revision-irl",
      steps: [
        {
          name: "Entrez le loyer actuel hors charges",
          text: "Saisissez le montant du loyer hors charges en cours avant révision.",
        },
        {
          name: "Sélectionnez l'indice IRL de référence",
          text: "Indiquez l'indice IRL du trimestre utilisé dans le bail (date de dernière révision).",
        },
        {
          name: "Sélectionnez le nouvel indice IRL",
          text: "Choisissez l'indice IRL du trimestre le plus récent pour calculer la variation.",
        },
        {
          name: "Visualisez le nouveau loyer révisé",
          text: "Consultez le montant du loyer révisé, la variation en euros et en pourcentage, et la date d'effet.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function CalculateurRevisionIRLPage() {
  return (
    <>
      <CalculateurRevisionIRLJsonLd />
      <IRLCalculatorClient />
    </>
  );
}
