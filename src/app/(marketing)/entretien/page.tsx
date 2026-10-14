import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/landing/final-cta";
import { SITE_NAME, SITE_URL } from "@/data/entity";
import { baseMetadata } from "@/lib/seo/metadata";
import { paidOffer } from "@/components/seo/schema-markup";

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.
export const revalidate = 3600;

export async function generateMetadata() {
  return baseMetadata({
    title:
      "Entretien des logements 2026 — Suivez les travaux et leurs dépenses",
    description:
      "Gardez la trace des travaux de chaque logement : dépenses par catégorie, historique par bien, reprise pour la déclaration. Le signalement par le locataire n'est pas encore disponible.",
    // /maintenance is the authenticated dashboard route; this public page is
    // its own canonical.
    url: "/entretien",
    ogType: "template",
  });
}
;

// What exists today: expenses recorded per property, by category. Tenants cannot
// report an incident yet — the reporting form lives in the tenant portal, and no
// screen lets a landlord give a tenant access to it. Say so; do not describe the
// reporting flow until it can be reached.
const features = [
  {
    title: "Dépenses par logement",
    description:
      "Plomberie, électricité, entretien, rénovation : chaque dépense est rattachée au logement concerné, avec sa catégorie, sa date et son montant.",
    icon: "🧾",
  },
  {
    title: "Historique par bien",
    description:
      "Tous les travaux d'un logement au même endroit, pour anticiper les gros chantiers et répondre quand on vous demande ce qui a été fait.",
    icon: "📋",
  },
  {
    title: "Utile pour la déclaration",
    description:
      "Les dépenses de l'année sont reprises avec vos loyers encaissés pour préparer votre déclaration de revenus fonciers.",
    icon: "📊",
  },
  {
    title: "Signalement par le locataire",
    description:
      "Pas encore disponible : vos locataires ne peuvent pas encore déclarer un incident en ligne. Ils vous contactent comme aujourd'hui.",
    icon: "⏳",
  },
];

const steps = [
  {
    step: "1",
    title: "Le locataire vous prévient",
    description:
      "Par téléphone, e-mail ou courrier, comme aujourd'hui : il décrit le problème et son urgence.",
  },
  {
    step: "2",
    title: "Vous évaluez",
    description:
      "Réparation locative à la charge du locataire, ou travaux à la vôtre ? Le décret n° 87-712 liste les réparations locatives.",
  },
  {
    step: "3",
    title: "Vous faites intervenir",
    description:
      "Artisan, devis, rendez-vous : vous organisez l'intervention.",
  },
  {
    step: "4",
    title: "Vous enregistrez la dépense",
    description:
      "Le coût est rattaché au logement dans Lokna et reste dans son historique.",
  },
];

const faqData = [
  {
    question: "Mes locataires peuvent-ils signaler une panne dans Lokna ?",
    answer:
      "Pas encore. Le signalement en ligne par le locataire n'est pas disponible aujourd'hui : vos locataires vous préviennent comme d'habitude, et vous enregistrez ensuite les travaux dans Lokna.",
  },
  {
    question: "Comment garder une trace des travaux d'un logement ?",
    answer:
      "Enregistrez chaque dépense dans Lokna : montant, date, catégorie (plomberie, électricité, entretien, rénovation…) et logement concerné. L'historique de chaque bien reste consultable à tout moment.",
  },
  {
    question: "Qui paie une réparation : le bailleur ou le locataire ?",
    answer:
      "Le locataire prend en charge l'entretien courant et les menues réparations, listés par le décret n° 87-712 du 26 août 1987. Les réparations dues à la vétusté, à un vice de construction ou à un cas de force majeure restent à la charge du bailleur (article 7 de la loi du 6 juillet 1989).",
  },
];

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.

function MaintenanceJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        name: "Fil d'Ariane",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Accueil",
            item: SITE_URL,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Entretien des logements",
            item: `${SITE_URL}/entretien`,
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: `${SITE_NAME} — Entretien des logements`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `${SITE_URL}/entretien`,
        description:
          "Suivez les travaux de vos locations : dépenses par logement et par catégorie, historique par bien.",
        offers: {
          ...paidOffer(),
        },
        featureList: [
          "Dépenses par logement et par catégorie",
          "Historique des travaux par bien",
        ],
      },
      {
        "@type": "FAQPage",
        name: `FAQ — Entretien des logements ${SITE_NAME}`,
        mainEntity: faqData.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-cream font-[family-name:var(--font-sans)] antialiased">
      <MaintenanceJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-semibold tracking-[-0.03em] text-ink sm:text-5xl">
            Gardez la trace
            <br />
            de vos travaux.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Chaque dépense de travaux rattachée à son logement, avec son
            historique. Le signalement en ligne par le locataire n&apos;est pas
            encore disponible.
          </p>
        </header>

        {/* Features grid */}
        <section className="mb-20">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-stone-200/50 bg-white/60 p-6 shadow-sm backdrop-blur-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 text-3xl">{feature.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-ink">
                  {feature.title}
                </h3>
                <p className="text-sm text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mb-20">
          <h2 className="mb-8 text-2xl font-semibold text-ink">
            Comment ça marche ?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div key={item.step} className="rounded-xl border border-stone-200 bg-white p-6">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-700">
                  {item.step}
                </div>
                <h3 className="mb-2 text-base font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Urgency levels */}
        <section className="mb-20 rounded-2xl bg-orange-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-semibold text-ink">
            Priorités selon la gravité
          </h2>
          <p className="mb-6 text-stone-700">
            Quand un locataire vous signale un problème, quelques repères pour
            traiter les vraies urgences en premier :
          </p>
          <ul className="grid gap-3 sm:grid-cols-3">
            <li className="flex items-start gap-2 text-sm text-stone-600">
              <span className="text-red-500 font-bold">Urgent —</span>
              <span>Fuite d&apos;eau, panne chauffage, porte verrouillée</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-stone-600">
              <span className="text-amber-500 font-bold">Normal —</span>
              <span>Réparation électroménager, fuite mineure, joint</span>
            </li>
            <li className="flex items-start gap-2 text-sm text-stone-600">
              <span className="text-stone-600 font-bold">Cosmétique —</span>
              <span>Peinture, joint légèrement abimé, petites retouches</span>
            </li>
          </ul>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-2xl bg-forest px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-semibold sm:text-3xl">
            Tous les travaux de vos logements au même endroit
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-cream/80">
            Plus de factures éparpillées : chaque dépense est rattachée à son
            logement et reprise pour votre déclaration.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-forest px-6 py-3 font-medium text-white shadow transition-colors hover:bg-forest-hover"
          >
            Essai gratuit 14 jours
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-600">
          <Link
            href="/bail"
            className="text-forest hover:underline"
          >
            Gestion des baux →
          </Link>
          <Link
            href="/quittances"
            className="text-forest hover:underline"
          >
            Quittances de loyer →
          </Link>
          <Link
            href="/pricing"
            className="text-forest hover:underline"
          >
            Tarifs →
          </Link>
        </nav>
      </article>

      <FinalCta />
    </div>
  );
}
