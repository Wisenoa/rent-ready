import type { Metadata } from "next";
import { DepositCalculatorClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur Caution de Loyer — Zone Tendue & Non Tendue | RentReady",
    description: "Calculez le dépôt de garantie maximum légal pour votre location en France. Outil gratuit respectant les plafonds selon la zone géographique.",
    url: "/outils/calculateur-caution",
    ogType: "outil",
  });
}
;

export { DepositCalculatorClient as default } from "./calculator-client";
