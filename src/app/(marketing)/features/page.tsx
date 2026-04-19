import type { Metadata } from "next";
import Link from "next/link";
import {
  FileText,
  Building2,
  Users,
  Receipt,
  RefreshCcw,
  Wrench,
  ShieldCheck,
  BrainCircuit,
  BarChart3,
  Bell,
  Smartphone,
  Lock,
  CreditCard,
  Search,
  CalendarDays,
  FileCheck2,
  Zap,
} from "lucide-react";
import dynamic from "next/dynamic";
import React from "react";

import { TrustLogos } from "@/components/seo/TrustLogos";
import { ContentReviewBadge } from "@/components/seo/ContentReviewBadge";
import { baseMetadata } from "@/lib/seo/metadata";

// ISR: revalidate marketing pages at CDN edge every hour
// Keeps content fresh while serving cached HTML for TTFB < 100ms
export const revalidate = 3600;

// Dynamic import: FinalCta and MarketingFooter use framer-motion (heavy)
// → code-split so they don't block initial JS bundle or INP
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta") as unknown as Promise<React.ComponentType<unknown>> as unknown as Promise<React.ComponentType<unknown>>,
  { ssr: true, loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);
const MarketingFooter = dynamic(
  () => import("@/components/landing/marketing-footer"),
  { ssr: true, loading: () => <div aria-hidden="true" /> }
);
const GlassNav = dynamic(
  () => import("@/components/landing/glass-nav"),
  { ssr: true, loading: () => <div style={{ minHeight: 64 }} aria-hidden="true" /> }
);

export async function generateMetadata() {
  return baseMetadata({
    title: "Fonctionnalités — Logiciel gestion locative | RentReady",
    description: "Fonctionnalités RentReady: quittances conformes, détection automatique, révision IRL, portail locataire, gestion des baux et financement.",
    url: "/features",
    ogType: "feature",
  });
}

/* ─── FAQ data for schema ─── */
const featureFaqs = [
  {
    question: "RentReady génère-t-il des quittances de loyer conformes à la loi ?",
    answer:
      "Oui. Chaque quittance inclut toutes les mentions obligatoires de la loi du 6 juillet 1989 : identité du bailleur et du locataire, adresse du bien, période couverte, montant du loyer charges comprises, date de paiement, mode de paiement, référence du bail, signature et indice IRL INSEE.",
  },
  {
    question: "Comment fonctionne la détection automatique des loyers via Open Banking ?",
    answer:
      "Via l'Open Banking DSP2, RentReady lit les mouvements bancaires de votre compte pour identifier automatiquement les virements de loyer. Chaque loyer reçu est catégorisé et archivé sans saisie manuelle.",
  },
  {
    question: "La révision de loyer IRL est-elle automatique ?",
    answer:
      "Oui. RentReady se connecte automatiquement à l'INDICE INSEE pour calculer la nouvelle provision de loyer. Vous recevez une notification quand la révision doit être appliquée et le bail est mis à jour automatiquement.",
  },
  {
    question: "Le portail locataire est-il accessible sans mot de passe ?",
    answer:
      "Oui. Le locataire accède à son portail via un lien magic link envoyé par email. Aucun mot de passe n'est nécessaire. Il peut consulter ses quittances, soumettre des demandes de maintenance et voir l'historique de ses paiements.",
  },
  {
    question: "RentReady est-il conforme Factur-X pour la facturation ?",
    answer:
      "Oui. RentReady génère des factures au format Factur-X, le standard obligatoire pour la facturation électronique en France, et prépare votre entreprise pour l'e-reporting B2C obligatoire à partir de 2027.",
  },
  {
    question: "Combien de biens puis-je gérer avec RentReady ?",
    answer:
      "L'abonnement à 15 €/mois permet de gérer jusqu'à 10 biens immobiliers avec locataires illimités. L'abonnement annuel à 150 € vous offre 2 mois gratuits.",
  },
];

/* ─── JSON-LD ─── */
import {
  buildOrganizationSchema,
  buildWebPageSchema,
  buildSoftwareAppSchema,
  buildFAQPageSchema,
  buildBreadcrumbSchema,
  buildGraphSchema,
} from "@/lib/seo/structured-data";

function FeaturesJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://www.rentready.fr" },
      { name: "Fonctionnalités", url: "https://www.rentready.fr/features" },
    ]),
    buildOrganizationSchema({ "@id": "https://www.rentready.fr/#organization" }),
    buildWebPageSchema({
      name: "Fonctionnalités RentReady",
      description:
        "Toutes les fonctionnalités du logiciel de gestion locative RentReady pour propriétaires bailleurs.",
      url: "https://www.rentready.fr/features",
    }),
    buildSoftwareAppSchema({
      name: "RentReady",
      applicationCategory: "BusinessApplication",
      offers: [
        {
          name: "Abonnement mensuel",
          description: "15 €/mois pour gérer jusqu'à 10 biens",
          price: "15.00",
          priceCurrency: "EUR",
        },
      ],
      features: [
        "Quittances de loyer conformes loi 1989",
        "Détection automatique des virements Open Banking",
        "Révision IRL connectée INSEE",
        "Portail locataire avec maintenance",
        "OCR factures artisans par IA",
        "Conformité Factur-X",
        "Relance automatique impayés",
        "Export comptable",
      ],
    }),
    buildFAQPageSchema(featureFaqs)
  );

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/* ─── Feature categories ─── */

const featureGroups = [
  {
    id: "quittances",
    icon: Receipt,
    title: "Quittances & Reçus",
    tagline: "Conformes loi du 6 juillet 1989",
    description:
      "Générez des quittances de loyer parfaitement conformes à la loi de 1989. Chaque quittance inclut toutes les mentions obligatoires et est horodatée.",
    features: [
      {
        icon: FileText,
        title: "Quittance PDF personnalisée",
        detail:
          "Logo, mentions légales, dégradé de garantie, tudo automatique. Prête à signer et à envoyer.",
      },
      {
        icon: CreditCard,
        title: "Détection des paiements",
        detail:
          "Connexion Open Banking DSP2 : les virements arrivent automatiquement et déclenchent la quittance.",
      },
      {
        icon: Search,
        title: "Historique des quittances",
        detail:
          "Chaque quittance est archivée et retrouvable en 1 clic. Recherchez par locataire, bien ou date.",
      },
    ],
  },
  {
    id: "gestion-bancaire",
    icon: RefreshCcw,
    title: "Automatisation Bancaire",
    tagline: "Open Banking DSP2",
    description:
      "Oubliez la saisie manuelle des paiements. RentReady se connecte à votre banque et détecte automatiquement les versements de loyer.",
    features: [
      {
        icon: Zap,
        title: "Détection temps réel",
        detail:
          "Chaque virement de loyer est repéré en temps réel via l'API bancaire. Zéro saisie, zéro oubli.",
      },
      {
        icon: ShieldCheck,
        title: "Sécurité maximale",
        detail:
          "Accès lecture seule à votre compte. Aucune possibilité de prélèvements ou d'opérations.",
      },
      {
        icon: BarChart3,
        title: "Suivi des retards",
        detail:
          "Historique visuel des paiements. Les retards sont immédiatement signalés dans le dashboard.",
      },
    ],
  },
  {
    id: "revision-irl",
    icon: CalendarDays,
    title: "Révision de Loyer IRL",
    tagline: "Connectée INSEE en temps réel",
    description:
      "La révision de loyer basée sur l'Indice de Référence des Loyers (IRL) est automatiques. L'INSEE met à jour l'indice ? Votre nouveau loyer est calculé instantanément.",
    features: [
      {
        icon: RefreshCcw,
        title: "Calcul automatique",
        detail:
          "À chaque date anniversaire de bail, le nouveau loyer est recalculé avec l'IRL le plus récent.",
      },
      {
        icon: FileCheck2,
        title: "Courrier de révision",
        detail:
          "Un courrier de notification prêt à envoyer au locataire avec le nouveau montant et la méthode de calcul.",
      },
      {
        icon: Bell,
        title: "Alerte 30 jours avant",
        detail:
          "Vous recevez une notification 30 jours avant la date de révision pour anticiper et valider.",
      },
    ],
  },
  {
    id: "portail-locataire",
    icon: Users,
    title: "Portail Locataire",
    tagline: "Réduction de vos tâches administratives",
    description:
      "Vos locataires accèdent à leur espace pour consulter leurs paiements, télécharger leurs quittances et déclarer des incidents. Vous gagnez du temps, ils gagnent en transparence.",
    features: [
      {
        icon: Smartphone,
        title: "Espace dédié",
        detail:
          "Chaque locataire a son propre portail avec historique des paiements, loyers en cours et reçus.",
      },
      {
        icon: Wrench,
        title: "Demande de maintenance",
        detail:
          "Les locataires peuvent déclarer un incident en quelques clics avec photo. Vous êtes notifié immédiatement.",
      },
      {
        icon: Lock,
        title: "Accès sécurisé",
        detail:
          "Authentification par email + mot de passe. Vous contrôlez qui a accès à quel bien.",
      },
    ],
  },
  {
    id: "maintenance",
    icon: Wrench,
    title: "Suivi Maintenance",
    tagline: "De la déclaration à la résolution",
    description:
      "Gérez les interventions de maintenance de vos biens : déclaration, suivi artisan, validation des factures, paiement. Tout est tracé.",
    features: [
      {
        icon: BrainCircuit,
        title: "OCR des factures",
        detail:
          "Scannez une facture artisanale et l'IA en extrait automatiquement le montant, la date et le prestataire.",
      },
      {
        icon: Building2,
        title: "Lien avec le bien",
        detail:
          "Chaque intervention est liée au bien concerné. Vous avez l'historique complet de chaque logement.",
      },
      {
        icon: Bell,
        title: "Notifications",
        detail:
          "Rappels automatiques pour les interventions en attente. Plus jamais une réparation qui traîne.",
      },
    ],
  },
  {
    id: "conformite",
    icon: ShieldCheck,
    title: "Conformité & Sécurité",
    tagline: "Conforme Factur-X et e-reporting B2C 2027",
    description:
      "La réglementation évolue. RentReady intègre en avance les obligations légales : Factur-X pour la facturation, e-reporting B2C pour les plateformes.",
    features: [
      {
        icon: ShieldCheck,
        title: "Conformité Factur-X",
        detail:
          "Format factures accepté par l'administration fiscale française. Plus de rejet de vos fichiers.",
      },
      {
        icon: Lock,
        title: "Hébergement sécurisé",
        detail:
          "Données hébergées en France (OVH). Chiffrement AES-256 au repos et TLS 1.3 en transit.",
      },
      {
        icon: FileText,
        title: "Audit trail",
        detail:
          "Chaque action dans le système est tracée. Vous avez une piste d'audit complète pour votre comptabilité.",
      },
    ],
  },
];

/* ─── Feature list for quick-scan table ─── */
const quickFeatures = [
  "Quittances PDF conformes loi 1989",
  "Détection automatique virements (Open Banking DSP2)",
  "Révision IRL automatique avec alerte 30 jours",
  "Portail locataire avec maintenance",
  "OCR factures artisans par IA",
  "Conformité Factur-X et e-reporting B2C 2027",
  "Dashboard propriétaire en temps réel",
  "Export comptable (CSV, PDF)",
  "Relance automatique des impayés",
  "Mises à jour légales incluses",
  "Jusqu'à 10 biens immobiliers",
  "Support email prioritaire",
];

/* ─── Component ─── */
export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <FeaturesJsonLd />
      <GlassNav />

      {/* ── Hero ── */}
      <header className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-br from-blue-100/50 via-teal-50/30 to-transparent blur-3xl"
        />
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.2em] text-blue-600">
              Fonctionnalités
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl lg:text-6xl">
              Un outil complet pour gérer vos{" "}
              <span className="bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                locations sans stress
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-500 sm:text-xl">
              Quitances, bancauterie automatique, révision IRL, portail
              locataire, maintenance — tout est inclus dans un seul abonnement
              à 15 €/mois.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-stone-900 px-8 py-4 text-[15px] font-semibold text-white shadow-xl shadow-stone-900/15 transition-colors hover:bg-stone-800"
              >
                Essai gratuit 14 jours
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-8 py-4 text-[15px] font-semibold text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
              >
                Demander une démo
              </Link>
            </div>

            {/* E-E-A-T: content review badge */}
            <div className="mt-8 flex justify-center">
              <ContentReviewBadge updatedAt="2026-04-10" category="article" />
            </div>
          </div>
        </div>
      </header>

      {/* Trust signals */}
      <div className="border-y border-stone-200 bg-white/60">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
          <TrustLogos variant="full" />
        </div>
      </div>

      {/* ── Quick feature scan ── */}
      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.15em] text-stone-400">
            Tout ce dont vous avez besoin
          </p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickFeatures.map((f) => (
              <li key={f} className="flex items-start gap-3 text-sm text-stone-600">
                <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-blue-100 text-[10px] font-bold text-blue-600">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Feature groups ── */}
      <main className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="space-y-24">
          {featureGroups.map((group, groupIdx) => {
            const Icon = group.icon;
            const isReversed = groupIdx % 2 === 1;
            return (
              <section
                key={group.id}
                id={group.id}
                className="grid gap-12 lg:grid-cols-2 lg:gap-20"
                aria-labelledby={`${group.id}-heading`}
              >
                {/* Copy */}
                <div className={isReversed ? "lg:order-2" : ""}>
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-stone-200/60 bg-white shadow-sm">
                    <Icon className="h-6 w-6 text-blue-600" strokeWidth={1.75} />
                  </div>
                  <p className="mb-2 text-[13px] font-semibold uppercase tracking-[0.15em] text-blue-600">
                    {group.tagline}
                  </p>
                  <h2
                    id={`${group.id}-heading`}
                    className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl"
                  >
                    {group.title}
                  </h2>
                  <p className="mt-4 text-lg text-stone-500">{group.description}</p>

                  {/* Feature bullets */}
                  <ul className="mt-8 space-y-5">
                    {group.features.map((feat) => {
                      const FeatIcon = feat.icon;
                      return (
                        <li key={feat.title} className="flex gap-4">
                          <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-blue-600">
                            <FeatIcon className="h-4 w-4" strokeWidth={1.75} />
                          </span>
                          <div>
                            <p className="font-semibold text-stone-800">{feat.title}</p>
                            <p className="mt-0.5 text-sm text-stone-500">{feat.detail}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Visual placeholder */}
                <div
                  className={`flex items-center justify-center rounded-3xl border border-stone-200/50 bg-gradient-to-br from-stone-100 to-stone-50 p-16 ${
                    isReversed ? "lg:order-1" : ""
                  }`}
                  aria-hidden
                >
                  <div className="flex h-48 w-48 items-center justify-center rounded-full bg-gradient-to-br from-blue-100/60 to-teal-100/60">
                    <Icon className="h-20 w-20 text-blue-500/40" strokeWidth={1} />
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      </main>

      {/* ── Integration strip ── */}
      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <p className="mb-10 text-center text-sm font-semibold uppercase tracking-[0.15em] text-stone-400">
            Écosystème & Conformité
          </p>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { label: "Open Banking", sub: "DSP2 — Lecture compte" },
              { label: "Factur-X", sub: "Format officiel facturas" },
              { label: "e-reporting B2C", sub: "Obligation 2027" },
              { label: "Hébergement FR", sub: "OVH — Données en France" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-base font-semibold text-stone-800">{item.label}</p>
                <p className="mt-1 text-sm text-stone-400">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <FinalCta />
      <MarketingFooter />
    </div>
  );
}
