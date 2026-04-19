import type { Metadata } from "next";
import { ChargesCalculatorClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur Charges Locatives — Provision & Déduction | RentReady",
    description: "Calculez la répartition des charges locatives entre propriétaire et locataire. Outil gratuit basé sur les règles légales françaises.",
    url: "/outils/calculateur-charges-locatives",
    ogType: "outil",
  });
}
;

export default function CalculateurChargesLocativesPage() {
  return <ChargesCalculatorClient />;
}
