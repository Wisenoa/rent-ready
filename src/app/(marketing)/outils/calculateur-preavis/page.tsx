import type { Metadata } from "next";
import { PreavisCalculatorClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur de Préavis Locataire — Gratuit | RentReady",
    description: "Calculez la durée de préavis légale pour votre départ de location selon la zone géographique, le type de bail, et votre situation. Outil gratuit — base ...",
    url: "/outils/calculateur-preavis",
    ogType: "outil",
  });
}
;

export default function CalculateurPreavisPage() {
  return <PreavisCalculatorClient />;
}