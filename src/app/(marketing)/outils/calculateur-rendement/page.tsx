import type { Metadata } from "next";
import { YieldCalculatorClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur Rendement Locatif — NET & BRUT 2026 | RentReady",
    description: "Calculez votre rendement locatif NET et BRUT en quelques clics. Outil gratuit pour investisseurs immobiliers avec indicateurs détaillés.",
    url: "/outils/calculateur-rendement",
    ogType: "outil",
  });
}
;

export { YieldCalculatorClient as default } from "./calculator-client";
