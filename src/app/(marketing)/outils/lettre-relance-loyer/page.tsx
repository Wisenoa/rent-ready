import type { Metadata } from "next";
import { LettreRelanceClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "Générateur de Lettre de Relance Loyer — Mise en Demeure | RentReady",
  description: "Modèle de lettre de relance pour loyer impayé. Document gratuit pour réclamer le paiement du loyer avec instructions légales et نموذج gratuits.",
  keywords: [
    "générateur lettre relance loyer",
    "mise en demeure loyer impayé",
    "lettre relance gratuite",
    "modèle relance loyer",
  ],
  openGraph: {
    title: "Générateur de Lettre de Relance Loyer | RentReady",
    description:
      "Générez une lettre de relance loyer impayé ou une mise en demeure conforme. Gratuit, instantané.",
    type: "website",
    url: "https://www.rentready.fr/outils/lettre-relance-loyer",
    siteName: "RentReady",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Générateur de Lettre de Relance Loyer | RentReady",
    description: "Générez une lettre de relance loyer impayé ou une mise en demeure conforme. Gratuit et instantané.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  robots: { index: true, follow: true },
  
  alternates: {
    canonical: "https://www.rentready.fr/outils/lettre-relance-loyer",
  },
};

export default function LettreRelanceLoyerPage() {
  return <LettreRelanceClient />;
}
