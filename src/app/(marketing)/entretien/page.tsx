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
      "Suivi Maintenance 2026 — Déclarez et résolvez les interventions",
    description:
      "Vos locataires signalent un incident avec photos et niveau d'urgence ; vous suivez l'intervention jusqu'à sa résolution. Historique complet par logement.",
    // /maintenance is the authenticated dashboard route; this public page is
    // its own canonical.
    url: "/entretien",
    ogType: "template",
  });
}
;

const features = [
  {
    title: "Déclaration en ligne",
    description:
      "Vos locataires signalent une panne ou incident depuis leur portail. Photos, description, urgence — en quelques clics.",
    icon: "📲",
  },
  {
    title: "Niveau d'urgence",
    description:
      "Le locataire indique l'urgence de sa demande : faible, moyenne, élevée ou urgente. Vous voyez d'abord ce qui ne peut pas attendre.",
    icon: "🚦",
  },
  {
    title: "Historique par bien",
    description:
      "Toutes les interventions sont archivées par propriété. Historique complet pour anticiper les gros travaux.",
    icon: "📋",
  },
  {
    title: "Suivi de l'avancement",
    description:
      "Ouvert, en cours, résolu : le locataire voit l'état de sa demande depuis son portail. Plus besoin d'appels pour savoir où ça en est.",
    icon: "⚡",
  },
  {
    title: "Photos jointes",
    description:
      "Le locataire joint des photos du problème à sa demande. Elles restent rattachées à l'intervention.",
    icon: "📷",
  },

];

const steps = [
  {
    step: "1",
    title: "Le locataire signale",
    description:
      "Depuis son portail, il décrit le problème, ajoute des photos et indique le niveau d'urgence.",
  },
  {
    step: "2",
    title: "Vous évaluez",
    description:
      "Vous consultez la demande depuis votre espace et lancez l'intervention.",
  },
  {
    step: "3",
    title: "Intervention et suivi",
    description:
      "Vous passez la demande « en cours » : le locataire voit que l'intervention avance.",
  },
  {
    step: "4",
    title: "Clôture et archivage",
    description:
      "L'intervention est marquée résolue et reste dans l'historique du logement.",
  },
];

const faqData = [
  {
    question: "Comment un locataire signale-t-il une panne ?",
    answer:
      "Le locataire se connecte à son portail dédié, clique sur « Signaler un incident », ajoute une description, des photos et indique le niveau d'urgence. La demande apparaît dans votre espace.",
  },
  {
    question: "Comment sont classées les demandes de maintenance ?",
    answer:
      "Le locataire choisit le niveau d'urgence en déclarant l'incident : faible, moyenne, élevée ou urgente. Une fuite d'eau, une panne de chauffage ou une porte qui ne ferme plus relèvent de l'urgence ; une retouche de peinture peut attendre."
  },
  {
    question: "Puis-je garder une trace des travaux ?",
    answer:
      "Oui. Chaque intervention reste dans l'historique du logement, avec les photos jointes par le locataire. Le coût des travaux s'enregistre dans le suivi des dépenses du même logement.",
  },
  {
    question: "Le locataire voit-il l'avancement de l'intervention ?",
    answer:
      "Oui. Le locataire voit l'état de sa demande (ouverte, en cours, résolue) depuis son portail, et vous depuis votre espace. Plus besoin d'appels ou de relances pour savoir où en est la réparation.",
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
            name: "Suivi des interventions",
            item: `${SITE_URL}/entretien`,
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: `${SITE_NAME} — Suivi des interventions`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `${SITE_URL}/entretien`,
        description:
          "Gérez les demandes de réparation de vos locations : déclaration en ligne par le locataire, niveau d'urgence, historique par bien, suivi de l'avancement.",
        offers: {
          ...paidOffer(),
        },
        featureList: [
          "Déclaration d'incident en ligne",
          "Niveau d'urgence indiqué par le locataire",
          "Historique par bien",
          "Suivi de l'avancement",
          "Photos jointes",
        ],
      },
      {
        "@type": "FAQPage",
        name: `FAQ — Suivi des interventions ${SITE_NAME}`,
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
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <MaintenanceJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Suivez vos interventions
            <br />
            sans courir après.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Chaque demande de réparation déclarée, suivie et résolue — avec
            historique et photos. Le locataire voit où en est sa demande.
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
                <h3 className="mb-2 text-lg font-semibold text-stone-900">
                  {feature.title}
                </h3>
                <p className="text-sm text-stone-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mb-20">
          <h2 className="mb-8 text-2xl font-bold text-stone-900">
            Comment ça marche ?
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((item) => (
              <div key={item.step} className="rounded-xl border border-stone-200 bg-white p-6">
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-700">
                  {item.step}
                </div>
                <h3 className="mb-2 text-base font-semibold text-stone-900">
                  {item.title}
                </h3>
                <p className="text-sm text-stone-600">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Urgency levels */}
        <section className="mb-20 rounded-2xl bg-orange-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Priorités selon la gravité
          </h2>
          <p className="mb-6 text-stone-700">
            Le locataire indique la gravité de l&apos;incident pour vous permettre
            de traiter les vraies urgences en premier. Quelques repères :
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
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Gérez toutes vos interventions en un seul endroit
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Plus de messages éparpillés, plus de dossiers oubliés. Chaque
            intervention est traçable du signalement à la résolution.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            Essai gratuit 14 jours
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-600">
          <Link
            href="/bail"
            className="text-blue-600 hover:underline"
          >
            Gestion des baux →
          </Link>
          <Link
            href="/quittances"
            className="text-blue-600 hover:underline"
          >
            Quittances de loyer →
          </Link>
          <Link
            href="/pricing"
            className="text-blue-600 hover:underline"
          >
            Tarifs →
          </Link>
        </nav>
      </article>

      <FinalCta />
    </div>
  );
}
