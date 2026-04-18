import type { Metadata } from "next";
import { ChargesCalculatorClient } from "./calculator-client";

export const metadata: Metadata = {
  title: "Calculateur Charges Locatives — Provision & Déduction | RentReady",
  description: "Calculez la répartition des charges locatives entre propriétaire et locataire. Outil gratuit basé sur les règles légales françaises.",
  keywords: [
    "calculateur charges locatives",
    "provision charges locatives",
    "charges récupérables location",
    "taxe foncière déductible",
    "calcul charges propriétaire",
  ],
  openGraph: {
    title: "Calculateur Charges Locatives | RentReady",
    description:
      "Estimez le coût réel de vos charges locatives et la provision mensuelle à demander. Gratuit et instantané.",
    type: "website",
    url: "https://www.rentready.fr/outils/calculateur-charges-locatives",
    siteName: "RentReady",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Calculateur Charges Locatives | RentReady",
    description: "Estimez le coût réel de vos charges locatives et la provision mensuelle à demander. Gratuit et instantané.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  robots: { index: true, follow: true },
  
  alternates: {
    canonical: "https://www.rentready.fr/outils/calculateur-charges-locatives",
  },
};

export default function CalculateurChargesLocativesPage() {
  return <ChargesCalculatorClient />;
}
