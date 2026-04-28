import type { Metadata } from "next";
import { GenerateurQuittanceClient } from "./calculator-client";
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
    title: "Générateur de Quittance de Loyer 2026 — PDF Conforme | RentReady",
    description:
      "Générez des quittances de loyer personnalisées et conformes. Outil gratuit pour propriétaires avec calculs automatiques des montants et dates.",
    url: "/outils/generateur-quittance",
    ogType: "outil",
  });
}

function GenerateurQuittanceJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
      { name: "Générateur de Quittance", url: "https://www.rentready.fr/outils/generateur-quittance" },
    ]),
    buildWebApplicationSchema({
      name: "Générateur de Quittance de Loyer PDF",
      description:
        "Générez des quittances de loyer PDF personnalisées et conformes à la loi du 6 juillet 1989. Outil gratuit avec calculs automatiques.",
      url: "/outils/generateur-quittance",
    }),
    buildHowToSchema({
      name: "Comment générer une quittance de loyer",
      description:
        "Créez une quittance de loyer PDF conforme en quelques clics, avec toutes les mentions légales obligatoires.",
      url: "/outils/generateur-quittance",
      steps: [
        {
          name: "Entrez les informations du propriétaire",
          text: "Saisissez votre nom, adresse et références du bien pour identificar le bailleur.",
        },
        {
          name: "Entrez les informations du locataire",
          text: "Indiquez le nom et l'adresse du locataire tels que mentionnés dans le bail.",
        },
        {
          name: "Saisissez les détails du paiement",
          text: "Indiquez le montant du loyer, des charges, la période concernnée et la date de paiement.",
        },
        {
          name: "Générez et téléchargez le PDF",
          text: "Téléchargez votre quittance de loyer PDF prête à être envoyée au locataire avec les mentions légales.",
        },
      ],
    })
  );
  return <SchemaMarkup data={schema} />;
}

export default function GenerateurQuittancePage() {
  return (
    <>
      <GenerateurQuittanceJsonLd />
      <GenerateurQuittanceClient />
    </>
  );
}
