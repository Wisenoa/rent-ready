import type { Metadata } from "next";
import { LettreRelanceClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Générateur de Lettre de Relance Loyer — Mise en Demeure | RentReady",
    description: "Modèle de lettre de relance pour loyer impayé. Document gratuit pour réclamer le paiement du loyer avec instructions légales et نموذج gratuits.",
    url: "/outils/lettre-relance-loyer",
    ogType: "outil",
  });
}
;

export default function LettreRelanceLoyerPage() {
  return <LettreRelanceClient />;
}
