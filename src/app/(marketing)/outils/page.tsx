import type { Metadata } from "next";
import Link from "next/link";
import React from "react";
import { SchemaMarkup, breadcrumbSchema } from "@/components/seo/schema-markup";
import { FinalCta } from "@/components/landing/final-cta";
import { Breadcrumb } from "@/components/seo/Breadcrumb";
import { baseMetadata } from "@/lib/seo/metadata";
import { buildOrganizationSchema, buildWebSiteSchema, buildGraphSchema } from "@/lib/seo/structured-data";

export async function generateMetadata() {
  return baseMetadata({
    title:
      "Outils Immobiliers Gratuits 2026 — Calculateurs & Générateurs | RentReady",
    description:
      "Accédez à nos calculateurs immobiliers gratuits 2026 : révision IRL, rendement, dépôt de garantie, charges locatives. Outils professionnels pour propriétaires bailleurs.",
    url: "/outils",
    ogType: "website",
  });
}

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
    title: "Calculateur de Loyer",
    description:
      "Estimez le loyer de votre bien selon la surface et le prix au m². Zones tendues et non tendues.",
    href: "/outils/calculateur-loyer",
    icon: "🏠",
    category: "Calculateurs",
    badge: null,
  },
  {
    title: "Calculateur de Dépôt de Garantie",
    description:
      "Calculez le dépôt de garantie maximum selon la zone géographique et le type de bail.",
    href: "/outils/calculateur-depot-garantie",
    icon: "🔐",
    category: "Calculateurs",
    badge: null,
  },
  {
    title: "Calculateur Caution de Loyer",
    description:
      "Calculez le dépôt de garantie maximum selon la zone tendue ou non tendue.",
    href: "/outils/calculateur-caution",
    icon: "🛡️",
    category: "Calculateurs",
    badge: null,
  },
  {
    title: "Calculateur Charges Locatives",
    description:
      "Estimez le coût réel de vos charges de propriété et la provision mensuelle à demander au locataire.",
    href: "/outils/calculateur-charges-locatives",
    icon: "📊",
    category: "Calculateurs",
    badge: null,
  },
  {
    title: "Calculateur Rendement Locatif",
    description:
      "Estimez le rendement NET et BRUT de votre investissement. Benchmarks Paris vs Province inclus.",
    href: "/outils/calculateur-rendement",
    icon: "💰",
    category: "Calculateurs",
    badge: null,
  },
  {
    title: "Calculateur IRL",
    description:
      "Consultez l'historique des IRL et la variation annuelle. Outil de reference pour propriétaires et locataires.",
    href: "/outils/calculateur-irl",
    icon: "📉",
    category: "Calculateurs",
    badge: null,
  },
  {
    title: "Checklist État des Lieux",
    description:
      "Checklist complète pour realiser un état des lieux entrada ou sortie conforme. Téléchargement gratuit.",
    href: "/outils/checklist-etat-lieux",
    icon: "📋",
    category: "Checklists",
    badge: null,
  },
  {
    title: "Calculateur de Préavis Locataire",
    description:
      "Calculez la durée de préavis applicable selon votre situation et votre zone géographique.",
    href: "/outils/calculateur-preavis",
    icon: "⏱️",
    category: "Calculateurs",
    badge: null,
  },
  {
    title: "Simulateur de Prêt Immobilier",
    description:
      "Calculez votre mensualité de prêt immobilier avec tableau d'amortissement. simulateur gratuit pour investisseurs.",
    href: "/outils/simulateur-pret-immobilier",
    icon: "🏦",
    category: "Calculateurs",
    badge: "Nouveau",
  },
  {
    title: "Calculateur de Plus-Value Immobilière",
    description:
      "Estimez votre plus-value et l'impôt à payer lors de la vente d'un bien. Tous les abattements légaux inclus.",
    href: "/outils/calculateur-plus-value",
    icon: "📊",
    category: "Calculateurs",
    badge: "Nouveau",
  },
  {
    title: "Calculateur de Surface Habitable",
    description:
      "Calculez la surface habitable selon la loi Boutin. Vérifiez la surface exacte avant de signer un bail.",
    href: "/outils/calculateur-surface-habitable",
    icon: "📐",
    category: "Calculateurs",
    badge: "Nouveau",
  },
  {
    title: "Simulateur Fiscal LMNP",
    description:
      "Comparez micro-BIC vs régime réel pour votre location meublée. Calculez amortissements et déficit imputable.",
    href: "/outils/simulateur-fiscalite-lmnp",
    icon: "🏠",
    category: "Calculateurs",
    badge: "Nouveau",
  },
  {
    title: "Lettre de Relance Loyer",
    description:
      "Générez une lettre de relance amiable ou une mise en demeure conforme. Prête à copier ou envoyer.",
    href: "/outils/lettre-relance-loyer",
    icon: "✉️",
    category: "Générateurs",
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
    title: "Générateur de Congé pour Vente",
    description:
      "Générez un congé pour vente conforme. Document gratuit avec lettre type à envoyer en recommandée.",
    href: "/outils/generateur-conge-vente",
    icon: "📄",
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

function OutilsJsonLd() {
  const data = buildGraphSchema(
    buildOrganizationSchema(),
    buildWebSiteSchema("Outils Immobiliers Gratuits — RentReady", "/outils"),
    breadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Outils", url: "https://www.rentready.fr/outils" },
    ])
  );
  return <SchemaMarkup data={data} />;
}

export default function OutilsPage() {
  return (
    <>
      <OutilsJsonLd />

      <div className="min-h-screen bg-[#f8f7f4]">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <Breadcrumb items={breadcrumbItems} />

          <div className="mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
              <span>🧮</span> 100% Gratuit
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3 leading-tight text-balance">
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