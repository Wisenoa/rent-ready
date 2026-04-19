import type { Metadata } from "next";
import { LoyerCalculatorClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur de Loyer au m² — Gratuit | RentReady",
    description: "Estimez le loyer de votre bien selon la surface et le prix au m². Applicable en zone tendue et non tendue. Outil gratuit — mis à jour 2025.",
    url: "/outils/calculateur-loyer",
    ogType: "outil",
  });
}
;

export default function CalculateurLoyerPage() {
  return <LoyerCalculatorClient />;
}