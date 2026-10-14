import type { Metadata } from "next";
import { formatEntryPrice, formatProPrice, formatProAnnualPrice } from "@/data/entity";
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
import dynamicImport from "next/dynamic";
import React from "react";

import { TrustLogos } from "@/components/seo/TrustLogos";
import { ContentReviewBadge } from "@/components/seo/ContentReviewBadge";
import { baseMetadata } from "@/lib/seo/metadata";

// Dynamic import: FinalCta and MarketingFooter use framer-motion (heavy)
// → code-split so they don't block initial JS bundle or INP
const FinalCta = dynamicImport(
  () => import("@/components/landing/final-cta").then((mod) => mod.FinalCta),
  { loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);
const MarketingFooter = dynamicImport(
  () => import("@/components/landing/marketing-footer").then((mod) => mod.MarketingFooter),
  { loading: () => <div aria-hidden="true" /> }
);
const GlassNav = dynamicImport(
  () => import("@/components/landing/glass-nav").then((mod) => mod.GlassNav),
  { loading: () => <div style={{ minHeight: 64 }} aria-hidden="true" /> }
);

export async function generateMetadata() {
  return baseMetadata({
    title:
      "Fonctionnalités Lokna — quittances auto, IRL et suivi des loyers (2026)",
    description:
      `Quittances conformes loi 1989, reçus de paiement partiel, suivi des loyers, révision IRL INSEE et portail locataire. À partir de ${formatEntryPrice()}.`,
    url: "/features",
    ogType: "feature",
  });
}

/* ─── FAQ data for schema ─── */
// Every answer here is also published as FAQPage structured data. Describe what
// the product does today, checked against the code — never a planned feature.
const featureFaqs = [
  {
    question: "Lokna génère-t-il des quittances de loyer conformes à la loi ?",
    answer:
      "Oui. La quittance distingue le loyer et les charges, comme l'exige l'article 21 de la loi du 6 juillet 1989, et reprend les parties, le logement, la période et la date du paiement. Elle n'est délivrée qu'une fois le mois réglé en totalité ; un paiement partiel donne lieu à un reçu.",
  },
  {
    question: "Comment les paiements de loyer sont-ils suivis ?",
    answer:
      "Vous enregistrez chaque paiement reçu depuis le suivi du mois. Lokna l'impute sur le loyer attendu, calcule le reste dû et indique si le mois est payé, partiellement payé ou impayé. Lokna ne se connecte pas à votre banque.",
  },
  {
    question: "La révision de loyer IRL est-elle automatique ?",
    answer:
      "Le calcul l'est : Lokna applique la formule légale avec l'indice de référence des loyers publié par l'INSEE. La révision n'est appliquée au bail qu'après votre validation.",
  },
  {
    question: "Comment le locataire accède-t-il à son portail ?",
    answer:
      "Par un lien personnel que vous lui envoyez depuis Lokna, sans mot de passe à créer. Il y consulte ses quittances et ses paiements, et peut signaler un incident.",
  },
  {
    question: "Combien de biens puis-je gérer avec Lokna ?",
    answer:
      `La formule Starter couvre jusqu'à 3 logements, la formule Pro jusqu'à 10 logements à ${formatProPrice()} (${formatProAnnualPrice()} par an, soit 2 mois offerts). Les deux formules donnent accès aux mêmes fonctionnalités.`,
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
import { SITE_URL } from "@/data/entity";

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.
export const revalidate = 3600;

function FeaturesJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: SITE_URL },
      { name: "Fonctionnalités", url: `${SITE_URL}/features` },
    ]),
    buildOrganizationSchema({ "@id": `${SITE_URL}/#organization` }),
    buildWebPageSchema({
      name: "Fonctionnalités Lokna",
      description:
        "Toutes les fonctionnalités du logiciel de gestion locative Lokna pour propriétaires bailleurs.",
      url: `${SITE_URL}/features`,
    }),
    buildSoftwareAppSchema({
      name: "Lokna",
      applicationCategory: "BusinessApplication",
      offers: [
        {
          name: "Abonnement mensuel",
          description: `${formatProPrice()} pour gérer jusqu'à 10 biens`,
          price: "15.00",
          priceCurrency: "EUR",
        },
      ],
      features: [
        "Quittances de loyer conformes à la loi du 6 juillet 1989",
        "Reçu en cas de paiement partiel",
        "Suivi des loyers attendus, payés et du reste dû",
        "Révision IRL calculée avec l'indice INSEE",
        "Portail locataire avec signalement d'incident",
        "Relance de loyer par e-mail",
        "Export CSV des paiements",
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
      "La quittance est générée lorsque le paiement enregistré solde le mois. Elle sépare le loyer et les charges, comme l'exige l'article 21 de la loi du 6 juillet 1989.",
    features: [
      {
        icon: FileText,
        title: "Quittance PDF",
        detail:
          "Bailleur, locataire, logement, période, loyer et charges : les montants viennent du bail et des paiements enregistrés.",
      },
      {
        icon: CreditCard,
        title: "Reçu de paiement partiel",
        detail:
          "Un versement qui ne couvre pas tout le mois donne un reçu, pas une quittance. La quittance suit quand le solde est réglé.",
      },
      {
        icon: Search,
        title: "Historique des documents",
        detail:
          "Chaque quittance et chaque reçu restent rattachés au mois et au bail concernés, téléchargeables à tout moment.",
      },
    ],
  },
  {
    id: "suivi-paiements",
    icon: RefreshCcw,
    title: "Suivi des paiements",
    tagline: "Le mois en un coup d'œil",
    description:
      "Lokna sait ce que chaque locataire doit payer chaque mois. Vous enregistrez les paiements reçus ; Lokna calcule le reste dû. Aucune connexion bancaire n'est nécessaire.",
    features: [
      {
        icon: Zap,
        title: "Paiement enregistré en quelques secondes",
        detail:
          "Montant, date, mode de paiement : le versement est imputé sur le loyer attendu du mois.",
      },
      {
        icon: BarChart3,
        title: "Payé, partiel ou impayé",
        detail:
          "L'état du mois est calculé à partir des paiements, jamais saisi à la main. Plusieurs versements peuvent solder un même mois.",
      },
      {
        icon: Bell,
        title: "Relance par e-mail",
        detail:
          "En cas de retard, vous envoyez au locataire une relance en trois tons, du rappel cordial à la mise en demeure.",
      },
    ],
  },
  {
    id: "revision-irl",
    icon: CalendarDays,
    title: "Révision de Loyer IRL",
    tagline: "Indice INSEE",
    description:
      "La révision annuelle est calculée avec l'indice de référence des loyers publié par l'INSEE, selon la formule de l'article 17-1 de la loi du 6 juillet 1989.",
    features: [
      {
        icon: RefreshCcw,
        title: "Calcul du nouveau loyer",
        detail:
          "Lokna compare l'indice de référence du bail au dernier indice publié et affiche le nouveau montant.",
      },
      {
        icon: FileCheck2,
        title: "Validation par vous",
        detail:
          "Le nouveau loyer ne s'applique au bail qu'après votre confirmation.",
      },
    ],
  },
  {
    id: "portail-locataire",
    icon: Users,
    title: "Portail Locataire",
    tagline: "Un espace pour votre locataire",
    description:
      "Si vous l'invitez, votre locataire accède à son espace pour consulter ses paiements, télécharger ses quittances et signaler un incident.",
    features: [
      {
        icon: Smartphone,
        title: "Espace dédié",
        detail:
          "Historique des paiements, quittances et reçus du locataire, au même endroit.",
      },
      {
        icon: Wrench,
        title: "Signalement d'incident",
        detail:
          "Le locataire décrit le problème, indique l'urgence et joint des photos.",
      },
      {
        icon: Lock,
        title: "Accès par lien personnel",
        detail:
          "Le locataire entre par un lien que vous lui envoyez. Il ne voit que son propre logement.",
      },
    ],
  },
  {
    id: "maintenance",
    icon: Wrench,
    title: "Suivi Maintenance",
    tagline: "De la déclaration à la résolution",
    description:
      "Les incidents signalés par vos locataires sont rattachés au logement, avec leur urgence et leur état d'avancement.",
    features: [
      {
        icon: Building2,
        title: "Lien avec le bien",
        detail:
          "Chaque intervention est liée au logement concerné. Vous gardez l'historique de chaque bien.",
      },
      {
        icon: BrainCircuit,
        title: "Suivi de l'état",
        detail:
          "Ouvert, en cours, résolu : le locataire voit l'avancement depuis son portail.",
      },
    ],
  },
  {
    id: "conformite",
    icon: ShieldCheck,
    title: "Données & Export",
    tagline: "Vos données restent les vôtres",
    description:
      "Vos données sont hébergées en France et exportables à tout moment.",
    features: [
      {
        icon: FileText,
        title: "Export CSV",
        detail:
          "Exportez les paiements de loyer de l'année, par exemple pour préparer votre déclaration de revenus fonciers.",
      },
      {
        icon: Lock,
        title: "Hébergement en France",
        detail:
          "Serveurs OVH situés en France, connexion chiffrée (HTTPS).",
      },
    ],
  },
];

/* ─── Feature list for quick-scan table ─── */
const quickFeatures = [
  "Quittances PDF conformes loi 1989",
  "Reçu en cas de paiement partiel",
  "Suivi des loyers attendus et du reste dû",
  "Révision IRL calculée avec l'indice INSEE",
  "Portail locataire avec signalement d'incident",
  "Relance par e-mail en trois tons",
  "Suivi des dépenses par bien",
  "Export CSV des paiements",
  "Jusqu'à 10 logements",
];

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.

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
            <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600 sm:text-xl">
              Quittances, suivi des paiements, révision IRL, portail
              locataire, maintenance : les mêmes fonctionnalités dans chaque
              formule, à partir de {formatEntryPrice()}.
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
          <p className="mb-8 text-center text-sm font-semibold uppercase tracking-[0.15em] text-stone-600">
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
                  <p className="mt-4 text-lg text-stone-600">{group.description}</p>

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
                            <p className="mt-0.5 text-sm text-stone-600">{feat.detail}</p>
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
                    <Icon className="h-20 w-20 text-blue-600/40" strokeWidth={1} />
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
          <p className="mb-10 text-center text-sm font-semibold uppercase tracking-[0.15em] text-stone-600">
            Sur quoi Lokna s'appuie
          </p>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {[
              { label: "Loi du 6 juillet 1989", sub: "Quittances et reçus" },
              { label: "INSEE", sub: "Indice de référence des loyers" },
              { label: "Export CSV", sub: "Vos données, à tout moment" },
              { label: "Hébergement FR", sub: "OVH — Données en France" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-base font-semibold text-stone-800">{item.label}</p>
                <p className="mt-1 text-sm text-stone-600">{item.sub}</p>
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
