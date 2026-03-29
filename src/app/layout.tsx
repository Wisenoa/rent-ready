import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { CookieConsent } from "@/components/cookie-consent";
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
  title: {
    default: "RentReady — Gestion Locative Intelligente",
    template: "%s | RentReady",
  },
  description:
    "Simplifiez votre gestion locative. Quittances automatiques, suivi des loyers et intelligence artificielle pour les propriétaires bailleurs.",
  keywords: [
    "gestion locative",
    "quittance de loyer",
    "propriétaire bailleur",
    "SaaS immobilier",
    "France",
  ],
  twitter: {
    card: "summary_large_image",
    title: "RentReady — Gestion Locative Intelligente",
    description:
      "Quittances automatiques, suivi bancaire DSP2, et IA pour les propriétaires bailleurs. 15 €/mois.",
    site: "@rentready_fr",
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
        <CookieConsent />
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
