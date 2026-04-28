import type { Metadata } from "next";
import { DepositCalculatorClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  buildGraphSchema,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildHowToSchema,
  buildFAQPageSchema,
} from "@/lib/seo/structured-data";
import { SchemaMarkup } from "@/components/seo/schema-markup";

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "Calculateur Caution de Loyer — Zone Tendue & Non Tendue | RentReady",
    description:
      "Calculez le dépôt de garantie maximum légal pour votre location en France. Outil gratuit respectant les plafonds selon la zone géographique.",
    url: "/outils/calculateur-caution",
    ogType: "outil",
  });
}

const breadcrumbItems = [
  { name: "Accueil", url: "https://www.rentready.fr" },
  { name: "Outils", url: "https://www.rentready.fr/outils" },
  { name: "Calculateur Caution", url: "https://www.rentready.fr/outils/calculateur-caution" },
];

const faqData = [
  {
    question: "Qu'est-ce qu'une zone tendue ?",
    answer:
      "Une zone tendue est une zone géographique où il existe un déséquilibre important entre l'offre et la demande de logements. En France, les villes de plus de 50 000 habitants avec un marché locatif tendu sont classées comme telles. Dans ces zones, le dépôt de garantie est limité à 1 mois de loyer (contre 2 mois en zone non tendue).",
  },
  {
    question: "Le dépôt de garantie est-il restitué à la fin du bail ?",
    answer:
      "Oui, le dépôt de garantie doit être restitué au locataire dans les 2 mois suivant la remise des clés, déduction faite des sommes dues au titre des éventuels dégradations ou impayés. Si des retenues sont faites, le propriétaire doit fournir un état exécutoire des sommes retenues.",
  },
  {
    question: "Peut-on demander une caution en plus du dépôt ?",
    answer:
      "Oui, en plus du dépôt de garantie, le bailleur peut demander au locataire de fournir une caution (garant), c'est-à-dire un tiers qui s'engage à payer en cas de défaillance. La caution peut être un garant physique (parent, ami) ou une garantie loyers impayés (GLI) via une assurance.",
  },
  {
    question: "Le dépôt de garantie doit-il être bloqué sur un compte ?",
    answer:
      "Depuis la loi ALUR de 2014, le dépôt de garantie doit être restitué dans les mêmes conditions que le loyer. En pratique, le propriétaire verse le dépôt sur son compte mais doit pouvoir le restituer en cas de départ dans les règles.",
  },
  {
    question: "La règle du dépôt est-elle différente pour une location meublée ?",
    answer:
      "En zone tendue, le dépôt maximum est limité à 1 mois, que le bien soit meublé ou vide. En zone non tendue, le dépôt peut atteindre 2 mois pour une location meublée (contre 1 mois pour le vide), quelle que soit la zone.",
  },
];

function CautionJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema(breadcrumbItems),
    buildWebApplicationSchema({
      name: "Calculateur Caution de Loyer",
      description:
        "Calculez le dépôt de garantie maximum légal pour votre location en zone tendue ou non tendue en France.",
      url: "/outils/calculateur-caution",
    }),
    buildHowToSchema({
      name: "Comment calculer le dépôt de garantie maximum",
      description:
        "Calculez le montant maximum de dépôt de garantie légal pour votre location selon la zone géographique et le type de bail.",
      url: "/outils/calculateur-caution",
      steps: [
        {
          name: "Saisissez le montant du loyer",
          text: "Indiquez le montant de votre loyer mensuel hors charges tel que mentionné dans votre bail.",
        },
        {
          name: "Sélectionnez la zone géographique",
          text: "Précisez si votre bien est situé en zone tendue (Paris, Lyon, Marseille...) ou en zone non tendue.",
        },
        {
          name: "Indiquez le type de location",
          text: "Choisissez entre location vide ou meublée pour appliquer le bon plafond de dépôt de garantie.",
        },
        {
          name: "Consultez le résultat",
          text: "Visualisez le montant maximum de dépôt de garantie légal applicable à votre situation.",
        },
      ],
    }),
    buildFAQPageSchema(faqData)
  );
  return <SchemaMarkup data={schema} />;
}

export default function CalculateurCautionPage() {
  return (
    <>
      <CautionJsonLd />
      <DepositCalculatorClient />
    </>
  );
}
