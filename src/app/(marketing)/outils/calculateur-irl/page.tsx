import type { Metadata } from "next";
import { IRLCalculatorClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur IRL 2025 — Indice de Référence des Loyers | RentReady",
    description: "Consultez l'historique des IRL et la variation annuelle. Outil gratuit pour propriétaires et locataires. Mis à jour Avril 2025 — Source INSEE.",
    url: "/outils/calculateur-irl",
    ogType: "outil",
  });
}
;

export default function CalculateurIRLPage() {
  return <IRLCalculatorClient />;
}