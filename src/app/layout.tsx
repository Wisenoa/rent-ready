import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/cookie-consent";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/organization-schema";
import { Analytics } from "@vercel/analytics/react";
import { WebVitalsProvider } from "@/components/web-vitals-provider";
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
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
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
    languages: {
      // Self-referencing hreflang for French locale (RentReady is FR-only)
      fr: "https://www.rentready.fr",
      "fr-FR": "https://www.rentready.fr",
      // x-default: same as primary locale for single-locale sites
      // Update this when expanding to additional locales (en, es, de)
      "x-default": "https://www.rentready.fr",
    },
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
      <head>
        {/* Resource hints — preconnect to third-party services for lower latency */}
        <link rel="preconnect" href="https://vitals.vercel-insights.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://vitals.vercel-insights.com" />
        <link rel="preconnect" href="https://o1.ingest.sentry.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://o1.ingest.sentry.io" />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        {/* Skip to main content — accessibility WCAG 2.1 AA */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-[#1a1a2e] focus:px-3 focus:py-1.5 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:ring-offset-2"
        >
          Aller au contenu principal
        </a>
        <Analytics />
        <WebVitalsProvider />
        {children}
        <OrganizationSchema />
        <WebSiteSchema />
        <CookieConsent />
      </body>
    </html>
  );
}
