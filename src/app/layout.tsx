import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/cookie-consent";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/organization-schema";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rentready.fr"),
  title: {
    default: "RentReady — Gestion Locative Intelligente",
    template: "%s | RentReady",
  },
  description:
    "Simplifiez votre gestion locative. Quittances automatiques, suivi des loyers et intelligence artificielle pour les propriétaires bailleurs. À partir de 15 €/mois.",
  keywords: [
    "gestion locative",
    "quittance de loyer",
    "propriétaire bailleur",
    "SaaS immobilier",
    "révision loyer IRL",
    "calcul loyer",
    "location immobilière France",
    "gestion locative Paris",
    "gestion locative Lyon",
    "suivi des loyers",
  ],
  authors: [{ name: "RentReady" }],
  creator: "RentReady",
  publisher: "RentReady",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://www.rentready.fr",
    siteName: "RentReady",
    title: "RentReady — Gestion Locative Intelligente",
    description:
      "Quittances automatiques, suivi bancaire DSP2, et IA pour les propriétaires bailleurs. À partir de 15 €/mois.",
    images: [
      {
        url: "https://www.rentready.fr/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "RentReady — Gestion Locative Intelligente",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RentReady — Gestion Locative Intelligente",
    description:
      "Quittances automatiques, suivi bancaire DSP2, et IA pour les propriétaires bailleurs. 15 €/mois.",
    site: "@rentready_fr",
    images: ["https://www.rentready.fr/opengraph-image.png"],
  },
  alternates: {
    canonical: "https://www.rentready.fr",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {children}
        <OrganizationSchema />
        <WebSiteSchema />
        <CookieConsent />
      </body>
    </html>
  );
}
