import type { Metadata } from "next";
import { LettreRelanceClient } from "./calculator-client";
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
    title: "Générateur Lettre Relance Loyer 2026 — Mise en Demeure | RentReady",
    description:
      "Modèle de lettre de relance pour loyer impayé. Document gratuit pour réclamer le paiement du loyer avec instructions légales et modèles gratuits.",
    url: "/outils/lettre-relance-loyer",
    ogType: "outil",
  });
}

function LettreRelanceJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Lettre de Relance Loyer", url: "https://www.rentready.fr/outils/lettre-relance-loyer" },
    ]),
    buildWebApplicationSchema({
      name: "Générateur de Lettre de Relance Loyer",
      description:
        "Générez une lettre de relance pour loyer impayé. Modèle gratuit avec instructions légales et modèles de mise en demeure pour propriétaire bailleur.",
      url: "/outils/lettre-relance-loyer",
    }),
    buildHowToSchema({
      name: "Comment rédiger une lettre de relance pour loyer impayé",
      description:
        "Générez une lettre de relance et une mise en demeure formelle pour réclamer le paiement d'un loyer impayé en toute conformité juridique.",
      url: "/outils/lettre-relance-loyer",
      steps: [
        {
          name: "Entrez les informations du bailleur et du locataire",
          text: "Saisissez les noms, adresses et références du bail pour identificar les parties concernées.",
        },
        {
          name: "Précisez les détails de l'impayé",
          text: "Indiquez le montant du loyer impayé, la période concerned et la date limite de paiement.",
        },
        {
          name: "Sélectionnez le type de courrier",
          text: "Choisissez entre une lettre de relance simple (première demande) ou une mise en demeure (dernière étape avant procédure).",
        },
        {
          name: "Générez et téléchargez le document",
          text: "Téléchargez la lettre de relance prête à être envoyée par courrier recommandé avec accusé de réception.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function LettreRelanceLoyerPage() {
  return (
    <>
      <LettreRelanceJsonLd />
      <LettreRelanceClient />
    </>
  );
}
