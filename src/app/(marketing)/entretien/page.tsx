import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/landing/final-cta";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title:
      "Suivi Maintenance 2026 — Déclarez et résolvez les interventions | RentReady",
    description:
      "Déclarez, suivez et résolvez les interventions de maintenance. Historique complet, photos, priorisation. Simplifiez la gestion locative 2026.",
    url: "/maintenance",
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
    title: "Priorisation automatique",
    description:
      "Chaque demande est catégorisée (urgent, normal, cosmetic). Vous savez immédiatement ce qui ne peut pas attendre.",
    icon: "🚦",
  },
  {
    title: "Historique par bien",
    description:
      "Toutes les interventions sont archivées par propriété. Historique complet pour anticiper les gros travaux.",
    icon: "📋",
  },
  {
    title: "Suivi en temps réel",
    description:
      "Locataire et bailleur voient l'état d'avancement. Plus besoin d'appels ou de relances pour savoir où ça en est.",
    icon: "⚡",
  },
  {
    title: "Pièces jointes et photos",
    description:
      "Photos du problème, devis, factures — tout est rangé dans le dossier de l'intervention. Plus rien ne s'égare.",
    icon: "📷",
  },
  {
    title: "Rappels automatiques",
    description:
      "Les interventions non résolues génèrent des rappels. Vous ne ratez plus aucun dossier.",
    icon: "⏰",
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
    title: "Vous évaluez et attribuez",
    description:
      "Vous consultez la demande, la catégorisez (urgent/normal/cosmétique) et lancez l'intervention.",
  },
  {
    step: "3",
    title: "Intervention et suivi",
    description:
      "Artisan notifié, rendez-vous planifié, photos du résultat — tout est enregistré.",
  },
  {
    step: "4",
    title: "Clôture et archivage",
    description:
      "L'intervention est marquée résolue. Factures et photos sont archivées automatiquement.",
  },
];

const faqData = [
  {
    question: "Comment un locataire signale-t-il une panne ?",
    answer:
      "Le locataire se connecte à son portail dédié, clique sur « Signaler un incident », ajoute une description, des photos et indique le niveau d'urgence. Vous êtes immédiatement notifié.",
  },
  {
    question: "Comment sont classées les demandes de maintenance ?",
    answer:
      "Chaque demande est automatiquement catégorisée en trois niveaux : Urgent (fuite d'eau, panne chauffage, porte verrouillée), Normal (réparation électroménager, fuite mineure) et Cosmétique (peinture, petites retouches). Cela vous permet de traiter les vraies urgences en premier.",
  },
  {
    question: "Puis-je archiver les factures et devis liés à une intervention ?",
    answer:
      "Oui. Chaque intervention dispose d'un dossier dédié où vous pouvez joindre les devis, factures et photos de l'intervention résolue. Cet historique est lié au bien et consultable à tout moment.",
  },
  {
    question: "Le locataire voit-il l'avancement de l'intervention ?",
    answer:
      "Oui. Locataire et bailleur voient l'état d'avancement en temps réel depuis leur portail respectif. Plus besoin d'appels ou de relances pour savoir où en est la réparation.",
  },
];

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
            item: "https://www.rentready.fr",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Suivi des interventions",
            item: "https://www.rentready.fr/maintenance",
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        name: "RentReady — Suivi des interventions",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://www.rentready.fr/maintenance",
        description:
          "Gérez les demandes de réparation et maintenance de vos locations : déclaration en ligne, priorisation automatique, historique par bien, suivi en temps réel.",
        offers: {
          "@type": "Offer",
          price: "15.00",
          priceCurrency: "EUR",
          priceValidUntil: "2027-12-31",
          availability: "https://schema.org/InStock",
          url: "https://www.rentready.fr/register",
        },
        featureList: [
          "Déclaration de maintenance en ligne",
          "Priorisation automatique (urgent/normal/cosmétique)",
          "Historique par bien",
          "Suivi en temps réel",
          "Pièces jointes et photos",
          "Rappels automatiques",
        ],
      },
      {
        "@type": "Organization",
        name: "RentReady",
        url: "https://www.rentready.fr",
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "contact@rentready.fr",
          availableLanguage: "French",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Suivi des interventions RentReady",
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
            historique, photos et rappels. Locataire et bailleur voient tout en
            temps réel.
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
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-lg font-bold text-orange-600">
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
            Chaque incident est classé automatiquement pour vous permettre de
            traiter les vrais urgences en premier.
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
              <span className="text-stone-400 font-bold">Cosmétique —</span>
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
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
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
