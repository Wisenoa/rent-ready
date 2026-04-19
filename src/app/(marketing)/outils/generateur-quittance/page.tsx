import type { Metadata } from "next";
import { GenerateurQuittanceClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Générateur de Quittance de Loyer — PDF Conforme | RentReady",
    description: "Générez des quittances de loyer personnalisées et conformes. Outil gratuit pour propriétaires avec calculs automatiques des montants et dates.",
    url: "/outils/generateur-quittance",
    ogType: "outil",
  });
}
;

export default function GenerateurQuittancePage() {
  return <GenerateurQuittanceClient />;
}
