import type { Metadata } from "next";
import { IRLCalculatorClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur Révision de Loyer IRL 2026 — Gratuit | RentReady",
    description: "Calculez la révision de loyer selon lindice IRL. Outil gratuit pour ajuster automatiquement le loyer au Bail de location avec les derniers indices.",
    url: "/outils/calculateur-revision-irl",
    ogType: "outil",
  });
}
;

export { IRLCalculatorClient as default } from "./calculator-client";
