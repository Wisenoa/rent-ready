import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta").then((mod) => mod.FinalCta),
  { loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title:
      "Modèle Congé Propriétaire 2026 — Gratuit & Téléchargement PDF | RentReady",
    description:
      "Modèle congé donné par le propriétaire : motifs légaux, préavis 2-6 mois, envoi en recommandé. Téléchargez gratuitement, personnalisez en 2 minutes.",
    url: "/modeles/conge-proprietaire",
    ogType: "template",
  });
}

const motifsProprietaire = [
  {
    motif: "Reprise du logement pour habiter",
    duree: "6 mois de préavis",
    condition: "Le propriétaire ou un proche doit s'engager à habiter le logement pendant au moins 6 mois consécutifs.",
  },
  {
    motif: "Vente du logement",
    duree: "6 mois de préavis",
    condition: "La vente doit être réelle et sérieuse. Le locataire bénéficie d'un droit de préemption sur le bien.",
  },
  {
    motif: "Motif légitime et sérieux",
    duree: "3 mois de préavis",
    condition: "Comportement grave du locataire : impayés prolongés, troubles de voisinage, utilisation 非 conforme du logement.",
  },
  {
    motif: "Travaux importants",
    duree: "6 mois de préavis",
    condition: "Travaux nécessitant l'évacuation du logement ou rendant les lieux inhabitables, nécessitant uneads for extended period.",
  },
];

const delaisPreavis = [
  { duree: "6 mois", cas: "Reprise pour habiter, vente, travaux importants (3 mois en zone tendue)" },
  { duree: "3 mois", cas: "Motif légitime et sérieux (comportement du locataire)" },
  { duree: "1 mois", cas: "Bail mobilité uniquement — mais le propriétaire ne peut PAS donner congé d'un bail mobilité" },
];

const faqData = [
  {
    question: "Quel délai de préavis pour donner un congé en tant que propriétaire ?",
    answer:
      "En général, le délai de préavis est de 6 mois pour le propriétaire (3 mois en zone tendue). Ce délai passe à 3 mois uniquement en cas de motif légitime et sérieux (comportement grave du locataire : impayés, troubles de voisinage). Le délai d'un mois ne s'applique qu'au bail mobilité ET uniquement pour le locataire, jamais pour le propriétaire.",
  },
  {
    question: "Le congé doit-il être envoyé en recommandé avec accusé de réception ?",
    answer:
      "Oui. Le congé donné par le propriétaire au locataire doit être envoyé par lettre recommandée avec accusé de réception, ou signifié par acte d'huissier. L'envoi en main propre n'est pas juridiquement valide.",
  },
  {
    question: "Le propriétaire peut-il donner un congé sans motif ?",
    answer:
      "Non. En France, le propriétaire ne peut donner congé à son locataire qu'avec un motif légitime : reprise du logement pour habiter, vente, ou motif légitime et sérieux. Donner congé 'sans motif' expose le propriétaire à une demande de dommages et intérêts du locataire devant le juge.",
  },
  {
    question: "Le locataire peut-il contester un congé ?",
    answer:
      "Oui. Le locataire peut contester le congé devant la commission de conciliation (CDPENCL) ou le juge des contentieux de la protection dans un délai de 2 mois suivant la notification. Le juge appréciera si le motif est réel et sérieux.",
  },
  {
    question: "Faut-il payer une indemnité au locataire âgé ?",
    answer:
      "Oui. Si le propriétaire donne congé pour reprendre le logement ou le vendre, et que le locataire est âgé de plus de 65 ans ou en perte d'autonomie, le propriétaire peut être condamné à verser une indemnité de relocation équivalente aux frais de recherche d'un nouveau logement.",
  },
];

function CongeProprietaireJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr/" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/modeles" },
          { "@type": "ListItem", position: 3, name: "Congé Propriétaire", item: "https://www.rentready.fr/modeles/conge-proprietaire" },
        ],
      },
      {
        "@type": "HowTo",
        name: "Comment donner un congé en tant que propriétaire",
        description: "Modèle gratuit de congé donné par le propriétaire. Motifs légaux, délais de préavis, envoi recommandé AR.",
        step: [
          { "@type": "HowToStep", name: "Vérifier le motif", text: "Assurez-vous d'avoir un motif légitime pour donner congé. Sans motif, le congé est irrégulier et expose à des poursuites." },
          { "@type": "HowToStep", name: "Respecter le délai de préavis", text: "6 mois en général (3 mois en zone tendue). Le délai court à compter de la réception de la lettre par le locataire." },
          { "@type": "HowToStep", name: "Rédiger le courrier", text: "Utilisez le modèle en précisant le motif, la date de fin de bail, et les conditions d'évacuation." },
          { "@type": "HowToStep", name: "Envoyer en recommandé AR", text: "Envoyez impérativement en lettre recommandée avec accusé de réception. Conservez une copie et l'accusé." },
        ],
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Congé Propriétaire",
        mainEntity: faqData.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };
  return <SchemaMarkup data={data} />;
}

export default function CongeProprietairePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <CongeProprietaireJsonLd />
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-lg bg-red-100 px-4 py-1.5 text-sm font-medium text-red-700">
            Modèle gratuit — Téléchargement instantané
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle Congé Propriétaire
            <br />
            <span className="text-red-600">Donner son Congé au Locataire</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Téléchargez notre modèle de congé propriétaire gratuit. Motifs légaux, délais de préavis, envoi recommandé AR.
            Conforme loi de 1989.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-red-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-red-700 w-full sm:w-auto"
            >
              Utiliser avec RentReady →
            </Link>
            <Link
              href="/modeles"
              className="inline-block rounded-lg border border-stone-300 bg-white px-8 py-3.5 font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 w-full sm:w-auto"
            >
              Tous les modèles →
            </Link>
          </div>
        </header>

        {/* Motifs */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Les 4 motifs légaux pour donner congé
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {motifsProprietaire.map((m) => (
              <div key={m.motif} className="rounded-xl border border-stone-200 bg-white p-6">
                <div className="mb-2 inline-block rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                  {m.duree}
                </div>
                <h3 className="mb-3 text-lg font-semibold text-stone-900">✓ {m.motif}</h3>
                <p className="text-sm text-stone-600">{m.condition}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Délais */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Délais de préavis selon le motif
          </h2>
          <p className="mb-6 text-stone-700">
            Le délai de préavis dépend du motif invoqué et de la zone géographique. En zone tendue (villes où l'encadrement s'applique), certains délais sont réduits :
          </p>
          <div className="space-y-3">
            {delaisPreavis.map((d) => (
              <div key={d.duree} className="flex items-center gap-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <span className="text-xl font-bold text-red-600">{d.duree}</span>
                <span className="text-sm text-stone-700">{d.cas}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Comment donner */}
        <section className="mb-16 rounded-2xl bg-red-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Comment donner un congé en 4 étapes
          </h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Vérifier le motif", text: "Assurez-vous d'avoir un motif légitime. Sans motif, le congé est irrégulier et expose à des poursuites." },
              { step: "2", title: "Respecter le délai", text: "6 mois en général (3 mois en zone tendue). Le délai court à compter de la réception de la lettre." },
              { step: "3", title: "Rédiger le courrier", text: "Utilisez le modèle en précisant le motif, la date de fin de bail, et les conditions d'évacuation." },
              { step: "4", title: "Envoyer en recommandé AR", text: "Envoyez impérativement en lettre recommandée avec accusé de réception. Conservez une copie." },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4 rounded-xl border border-stone-200 bg-white p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">{s.step}</span>
                <div>
                  <p className="font-semibold text-stone-900">{s.title}</p>
                  <p className="text-sm text-stone-600">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur le congé propriétaire
          </h2>
          <div className="space-y-4">
            {faqData.map((item) => (
              <details key={item.question} className="group rounded-xl border border-stone-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-semibold text-stone-900">
                  {item.question}
                  <span className="ml-4 text-stone-400 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="border-t border-stone-100 p-5 text-sm text-stone-600">{item.answer}</div>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Gérez vos baux et congés avec RentReady
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Alertes de renouvellement de bail, suivi des préavis, generation automatique des courriers. Essai gratuit 14 jours.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-red-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-red-700"
          >
            Essai gratuit 14 jours →
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/bail" className="text-blue-600 hover:underline">Gestion des baux →</Link>
          <Link href="/modeles/conge-locataire" className="text-blue-600 hover:underline">Congé locataire →</Link>
          <Link href="/pricing" className="text-blue-600 hover:underline">Tarifs →</Link>
          <Link href="/modeles" className="text-blue-600 hover:underline">Tous les modèles →</Link>
        </nav>
      </article>
      <FinalCta />
    </div>
  );
}
