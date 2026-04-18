import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";
import { SchemaMarkup, breadcrumbSchema } from "@/components/seo/schema-markup";
import { ContentReviewBadge } from "@/components/seo/ContentReviewBadge";
import { TrustLogos } from "@/components/seo/TrustLogos";

// Dynamic import: FinalCta uses framer-motion (heavy, below-fold)
// → code-split so it doesn't block initial JS bundle or INP
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta") as unknown as Promise<React.ComponentType<unknown>>,
  { ssr: true, loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);

export const metadata: Metadata = {
  title: "Modèle Quittance de Loyer Gratuit — Conforme Loi 1989 | RentReady",
  description: "Téléchargez notre modèle de quittance de loyer gratuit et conforme. Document officiel pour justifier le paiement du loyer et des charges.",
  keywords: [
    "modèle quittance de loyer",
    "quittance loyer gratuit",
    "quittance de loyer PDF",
    "modèle quittance conforme",
    "reçu loyer",
    "quittance bail",
  ],
  openGraph: {
    title: "Modèle Quittance de Loyer Gratuit — RentReady",
    description:
      "Modèle de quittance de loyer gratuit et conforme à la loi. Mentions obligatoires, mention IRL INSEE. Générez en 30 secondes.",
    type: "website",
    url: "https://www.rentready.fr/modeles/quittance-de-loyer",
    siteName: "RentReady",
    images: [
      {
        url: "https://www.rentready.fr/og-image.png",
        width: 1200,
        height: 630,
        alt: "RentReady — Modèle Quittance de Loyer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modèle Quittance de Loyer Gratuit — RentReady",
    description:
      "Modèle de quittance de loyer gratuit et conforme à la loi. Mentions obligatoires, mention IRL INSEE. Générez en 30 secondes.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  robots: { index: true, follow: true },
  
  alternates: {
    canonical: "https://www.rentready.fr/modeles/quittance-de-loyer",
  },
};

const mentionsObligatoires = [
  "Le nom du bailleur et son adresse",
  "Le nom du locataire et son adresse",
  "L'adresse du bien loué",
  "La période couverte par la quittance (mois et année)",
  "Le montant du loyer hors charges",
  "Le montant des charges locatives",
  "La date de paiement du loyer",
  "Le mode de paiement utilisé (virement, chèque, espèces)",
];

const faqData = [
  {
    question:
      "La quittance de loyer est-elle obligatoire pour le propriétaire ?",
    answer:
      "Oui, depuis la loi du 6 juillet 1989 (article 21), le bailleur est tenu de délivrer une quittance de loyer au locataire qui en fait la demande, gratuitement et dans un délai de 30 jours. Cette obligation s'applique à chaque paiement, qu'il soit mensuel ou non.",
  },
  {
    question:
      "Combien de temps faut-il pour créer une quittance avec RentReady ?",
    answer:
      "Avec RentReady, la création d'une quittance prend environ 30 secondes. Sélectionnez le locataire, choisissez le mois et le montant est automatiquement pré-rempli depuis votre base. La quittance PDF est générée instantanément avec toutes les mentions obligatoires.",
  },
  {
    question:
      "Faut-il indiquer l'indice IRL sur chaque quittance de loyer ?",
    answer:
      "L'indice IRL (Indice de Référence des Loyers) n'est pas obligatoire sur chaque quittance. Cependant, depuis le 1er janvier 2016, la mention de l'IRL de référence pour l'année en cours est exigée pour les quittances délivrées dans le cadre d'une révision de loyer. Vérifiez que votre modèle intègre cette information automatiquement.",
  },
];

function QuittanceLoyerJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr/" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/modeles" },
          { "@type": "ListItem", position: 3, name: "Quittance de loyer", item: "https://www.rentready.fr/modeles/quittance-de-loyer" },
        ],
      },
      {
        "@type": "HowTo",
        name: "Comment créer une quittance de loyer conforme",
        description:
          "Guide pour rédiger une quittance de loyer valide avec toutes les mentions obligatoires requises par la loi du 6 juillet 1989.",
        step: [
          {
            "@type": "HowToStep",
            name: "Identifier les parties",
            text: "Renseignez le nom complet du bailleur et du locataire, ainsi que l'adresse du bien loué.",
          },
          {
            "@type": "HowToStep",
            name: "Indiquer la période",
            text: "Précisez le mois et l'année couverts par la quittance de loyer.",
          },
          {
            "@type": "HowToStep",
            name: "Mentionner les montants",
            text: "Indiquez clairement le montant du loyer hors charges et le montant des charges locatives séparément.",
          },
          {
            "@type": "HowToStep",
            name: "Noter la date et le mode de paiement",
            text: "Date de paiement effectif et mode de règlement utilisé (virement, chèque, espèces).",
          },
        ],
        tool: {
          "@type": "SoftwareApplication",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "Article",
        name: "Modèle Quittance de Loyer Gratuit — RentReady",
        description:
          "Téléchargez un modèle de quittance de loyer gratuit et conforme à la loi du 6 juillet 1989. Mentionne automatiquement l'IRL INSEE.",
        author: {
          "@type": "Organization",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Modèle Quittance de Loyer",
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
  return <SchemaMarkup data={data} />;
}

export default function QuittanceDeLoyerPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <QuittanceLoyerJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="inline-block rounded-lg bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
            Modèle gratuit — Téléchargement instantané
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle Quittance de Loyer
            <br />
            <span className="text-blue-600">Gratuit et Conforme</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Téléchargez notre modèle de quittance de loyer gratuit, conformes à
            la loi du 6 juillet 1989. Mentionne automatiquement l'IRL INSEE, prêt
            à personnaliser en 30 secondes.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-blue-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-blue-700 w-full sm:w-auto"
            >
              Générer ma quittance →
            </Link>
            <Link
              href="/blog/charges-locatives-guide-complet"
              className="inline-block rounded-lg border border-stone-300 bg-white px-8 py-3.5 font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 w-full sm:w-auto"
            >
              Guide sur les charges
            </Link>
          </div>

          {/* E-E-A-T: content review badge — shows template is maintained */}
          <div className="mt-8">
            <ContentReviewBadge updatedAt="2026-04-10" category="template" />
          </div>
        </header>

        {/* Trust signals */}
        <div className="mb-16">
          <TrustLogos variant="certifications-only" />
        </div>

        {/* Lead section */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Qu'est-ce qu'une quittance de loyer ?
          </h2>
          <p className="mb-4 text-stone-700">
            Une quittance de loyer est un document officiel délivré par le
            bailleur au locataire pour attester du paiement effectif d'un loyer.
            Elle constitue une preuve légale du règlement et doit être délivrée
            gratuitement au locataire qui en fait la demande, dans un délai de{" "}
            <strong>30 jours</strong> maximum suivant le paiement.
          </p>
          <p className="text-stone-700">
            Depuis la{" "}
            <strong>loi du 6 juillet 1989</strong> (article 21), toute omission
            de délivrance d'une quittance peut entraîner des sanctions. C'est
            pourquoi disposer d'un modèle conforme est essentiel pour tout
            propriétaire bailleur.
          </p>
        </section>

        {/* Mentions obligatoires */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Mentions obligatoires de la quittance de loyer
          </h2>
          <p className="mb-6 text-stone-600">
            Pour être valide, une quittance de loyer doit contenir les 8 mentions
            obligatoires suivantes, définies par la réglementation :
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {mentionsObligatoires.map((mention, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {index + 1}
                </div>
                <span className="text-sm text-stone-700">{mention}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-stone-500">
            💡 Notre modèle intègre automatiquement toutes ces mentions. Il
            vous suffit de sélectionner le locataire et le mois concerné.
          </p>
        </section>

        {/* Quand délivrer */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Quand délivrer une quittance de loyer ?
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <div className="mb-3 text-3xl">📩</div>
              <h3 className="mb-2 text-base font-semibold text-stone-900">
                Sur demande du locataire
              </h3>
              <p className="text-sm text-stone-600">
                Le locataire peut demander une quittance à tout moment. Le
                bailleur doit la fournir dans les 30 jours.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <div className="mb-3 text-3xl">💳</div>
              <h3 className="mb-2 text-base font-semibold text-stone-900">
                Après chaque paiement
              </h3>
              <p className="text-sm text-stone-600">
                En cas de paiement mensuel, une quittance peut être délivrée
                chaque mois pour simplifier la comptabilité.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <div className="mb-3 text-3xl">📋</div>
              <h3 className="mb-2 text-base font-semibold text-stone-900">
                Fin d'année pour les impôts
              </h3>
              <p className="text-sm text-stone-600">
                Pour la déclaration de revenus, le locataire peut avoir besoin
                d'un récapitulatif annuel. Anticipez en génère un export.
              </p>
            </div>
          </div>
        </section>

        {/* Notre modèle */}
        <section className="mb-16 rounded-2xl bg-blue-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Notre modèle de quittance de loyer gratuit
          </h2>
          <p className="mb-6 text-stone-700">
            Notre modèle de quittance de loyer est entièrement gratuit, conforme
            à la réglementation en vigueur et automatiquement mis à jour avec les
            derniers indices IRL publiés par l'INSEE. Plus besoin de chercher
            sur Excel ou Word : tout est pré-rempli.
          </p>
          <ul className="mb-6 grid gap-3">
            {[
              "✓ Mention de l'IRL INSEE intégrée automatiquement",
              "✓ Format PDF prêt à imprimer ou envoyer par email",
              "✓ Zéro erreur de calcul grâce aux montants pré-remplis",
              "✓ Archivé automatiquement pour traçabilité",
              "✓ Personnalisable avec votre logo et vos coordonnées",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-stone-700">
                <span className="text-emerald-600">{item.split(" ")[0]}</span>
                <span>{item.substring(2)}</span>
              </li>
            ))}
          </ul>
          <Link
            href="/register"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            Utiliser le modèle gratuit →
          </Link>
        </section>

        {/* CTA produit */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <h2 className="mb-4 text-xl font-bold text-stone-900">
                Comment créer une quittance en 30 secondes avec RentReady ?
              </h2>
              <p className="mb-4 text-stone-700">
                Avec RentReady, la création d'une quittance de loyer est
                instantanée. Notre logiciel récupère automatiquement les
                informations de votre bail : montant du loyer, charges, nom du
                locataire, adresse du bien. Vous n'avez plus qu'à cliquer.
              </p>
              <ol className="space-y-3">
                {[
                  "Connectez-vous à votre espace RentReady",
                  "Sélectionnez le locataire et le mois concerné",
                  "Cliquez sur « Générer la quittance »",
                  "Téléchargez le PDF ou envoyez-le directement au locataire",
                ].map((step, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-stone-700">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col items-center justify-center rounded-2xl bg-stone-900 p-8 text-white lg:w-72">
              <div className="text-5xl font-bold">30s</div>
              <div className="mt-2 text-sm text-stone-300">temps de création</div>
              <Link
                href="/register"
                className="mt-6 inline-block w-full rounded-lg bg-blue-600 px-5 py-2.5 text-center font-medium text-white transition-colors hover:bg-blue-700"
              >
                Essai gratuit 14j
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur la quittance de loyer
          </h2>
          <div className="space-y-4">
            {faqData.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-stone-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-stone-900">
                  {item.question}
                  <span className="ml-4 text-stone-400 transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="border-t border-stone-100 p-5 text-sm text-stone-600">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA final */}
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Générez vos quittances de loyer en 1 clic
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Essai 14 jours sans carte bancaire. Quittances PDF conformes,
            mention IRL intégrée, envoi automatique au locataire.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            Commencer gratuitement →
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/quittances" className="text-blue-600 hover:underline">
            Quittances automatiques →
          </Link>
          <Link href="/bail" className="text-blue-600 hover:underline">
            Gestion des baux →
          </Link>
          <Link href="/blog" className="text-blue-600 hover:underline">
            Blog juridique →
          </Link>
          <Link href="/pricing" className="text-blue-600 hover:underline">
            Tarifs →
          </Link>
        </nav>
      </article>

      <FinalCta />
    </div>
  );
}
