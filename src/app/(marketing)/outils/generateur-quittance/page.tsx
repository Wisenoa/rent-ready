import type { Metadata } from "next";
import { GenerateurQuittanceClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "Générateur de Quittance de Loyer — PDF Conforme | RentReady",
  description: "Générez des quittances de loyer personnalisées et conformes. Outil gratuit pour propriétaires avec calculs automatiques des montants et dates.",
  keywords: [
    "générateur quittance de loyer",
    "quittance PDF gratuit",
    "quittance loyer conforme",
    "générer quittance",
    "modèle quittance loyer PDF",
  ],
  openGraph: {
    title: "Générateur de Quittance de Loyer PDF | RentReady",
    description:
      "Générez une quittance de loyer PDF conforme à la loi en 30 secondes. Mentions obligatoires, mention IRL INSEE. Gratuit.",
    type: "website",
    url: "https://www.rentready.fr/outils/generateur-quittance",
    siteName: "RentReady",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Générateur de Quittance de Loyer PDF | RentReady",
    description: "Générez une quittance de loyer PDF conforme à la loi en 30 secondes. Mentions obligatoires, mention IRL INSEE. Gratuit.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  robots: { index: true, follow: true },
  
  alternates: {
    canonical: "https://www.rentready.fr/outils/generateur-quittance",
  },
};

export default function GenerateurQuittancePage() {
  return <GenerateurQuittanceClient />;
}
