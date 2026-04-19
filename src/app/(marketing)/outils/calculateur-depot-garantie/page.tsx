import type { Metadata } from "next";
import { DepotGarantieCalculatorClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur de Dépôt de Garantie — Gratuit | RentReady",
    description: "Calculez le dépôt de garantie maximum légal pour votre location selon la zone géographique (tendue ou non) et le type de bail. Outil gratuit — base léga...",
    url: "/outils/calculateur-depot-garantie",
    ogType: "outil",
  });
}
;

export default function CalculateurDepotGarantiePage() {
  return <DepotGarantieCalculatorClient />;
}