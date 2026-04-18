import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export const metadata: Metadata = {
  title: "Outils Immobiliers Gratuits — Calculateurs & Générateurs | RentReady",
  description:
    "Accédez à nos calculateurs immobiliers gratuits : révision IRL, rendement locatif, caution de loyer, générateur de quittance. Outils SEO-friendly pour propriétaires.",
  keywords: [
    "calculateur loyer",
    "calculateur IRL",
    "calculateur rendement locatif",
    "générateur quittance",
    "outils immobiliers gratuits",
    "calculateur caution",
  ],
  openGraph: {
    title: "Outils Immobiliers Gratuits | RentReady",
    description:
      "Calculateurs gratuits pour propriétaires : IRL, rendement, caution. Générez vos documents locatifs en 30 secondes.",
    type: "website",
    url: "https://www.rentready.fr/outils",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/outils",
  },
};

const TOOLS = [
  {
    title: "Calculateur Révision IRL",
    description:
      "Calculez la nouvelle révision de loyer selon l'IRL 2026. Formule légale, historique INSEE inclus.",
    href: "/outils/calculateur-revision-irl",
    icon: "📈",
    category: "Calculateurs",
    badge: "Populaire",
  },
  {
    title: "Calculateur Rendement Locatif",
    description:
      "Estimez le rendement NET et BRUT de votre investissement. Benchmarks Paris vs Province inclus.",
    href: "/outils/calculateur-rendement",
    icon: "🏠",
    category: "Calculateurs",
    badge: null,
  },
  {
    title: "Calculateur Caution de Loyer",
    description:
      "Calculez le dépôt de garantie maximum selon la zone tendue ou non tendue.",
    href: "/outils/calculateur-caution",
    icon: "🔐",
    category: "Calculateurs",
    badge: null,
  },
  {
    title: "Générateur de Quittance de Loyer",
    description:
      "Générez une quittance de loyer PDF conforme à la loi du 6 juillet 1989. Téléchargement instantané.",
    href: "/outils/generateur-quittance",
    icon: "🧾",
    category: "Générateurs",
    badge: "Nouveau",
  },
  {
    title: "Modèle de Bail de Location",
    description:
      "Téléchargez un modèle de bail conforme à la loi 1989. Bail vide, meublé, mobilité, colocation.",
    href: "/modeles",
    icon: "📄",
    category: "Modèles",
    badge: null,
  },
  {
    title: "État des Lieux",
    description:
      "Modèle gratuit d'état des lieux entrada/sortie. Conforme aux exigences légales.",
    href: "/modeles/etat-des-lieux",
    icon: "🏠",
    category: "Modèles",
    badge: null,
  },
];

const breadcrumbItems = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
];

const jsonLdData = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbItems.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.label,
    item: `https://www.rentready.fr${item.href}`,
  })),
};

export default function OutilsPage() {
  return (
    <>
      <SchemaMarkup data={jsonLdData} />

      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>🧮</span> 100% Gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight">
              Outils Immobiliers Gratuits pour Propriétaires
            </h1>
            <p className="text-lg text-stone-600 leading-relaxed max-w-2xl">
              Calculateurs, générateurs et modèles pour gérer votre location en toute conformité. Aucun compte requis — tous les outils sont gratuits et accessible immédiatement.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="group bg-white rounded-2xl shadow border border-stone-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-200 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{tool.icon}</span>
                  {tool.badge && (
                    <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {tool.badge}
                    </span>
                  )}
                </div>
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">
                  {tool.category}
                </div>
                <h2 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </h2>
                <p className="text-stone-500 text-sm leading-relaxed flex-1">
                  {tool.description}
                </p>
                <div className="mt-4 text-sm font-semibold text-blue-600 group-hover:underline">
                  Utiliser →
                </div>
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-stone-100 rounded-2xl p-6 mb-10 text-center">
            <p className="text-stone-600 mb-4">
              Besoin d'un outil qui n'existe pas encore ? Notre plateforme propose aussi la gestion locative complète.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/pricing"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Essai gratuit
              </Link>
              <Link
                href="/bail"
                className="border border-stone-300 hover:border-blue-400 text-stone-700 font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Modèles gratuits
              </Link>
            </div>
          </div>

          <FinalCta />
        </div>
      </div>
    </>
  );
}