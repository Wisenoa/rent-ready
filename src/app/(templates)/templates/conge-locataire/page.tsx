import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Modèle Congé Locataire Gratuit 2026 — Délai & Motif Obligatoire",
  description:
    "Modèle de congé locataire gratuit. Le propriétaire donne congé à son locataire avec motif obligatoire et délai légal. Téléchargez en PDF.",
  keywords: [
    "conge locataire",
    "modele conge locataire",
    "delai preavis location",
    "conge proprietaire bail",
  ],
  openGraph: {
    title: "Modèle Congé Locataire 2026 — RentReady",
    description:
      "Congé locataire gratuit avec motif obligatoire et délai légal. PDF téléchargeable.",
    type: "website",
    url: "https://www.rentready.fr/templates/conge-locataire",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/templates/conge-locataire",
  },
};

const faqData = [
  {
    question: "Quel délai pour donner congé à un locataire ?",
    answer:
      "Le délai de préavis est de 3 mois pour une location vide et 1 mois pour une location meublée. En zone tendue, le délai peut être réduit à 1 mois pour le locataire en cas de relocation ou de vente.",
  },
  {
    question: "Le congé doit-il être envoyé en recommandée ?",
    answer:
      "Oui. Le congé doit être adressé par lettre recommandée avec accusé de réception, ou signifié par huissier. L'envoi en recommandée avec AR est la méthode la plus courante et la plus sûre.",
  },
  {
    question: "Le motif du congé est-il obligatoire ?",
    answer:
      "Oui, pour le congé donné par le propriétaire. Les motifs légitimes sont : relocation (vente, réutilisation), manquement du locataire (impayés, troubles de voisinage), ou motif légitime et sérieux.",
  },
  {
    question: "Que se passe-t-il si le locataire ne part pas ?",
    answer:
      "Si le locataire ne part pas à la fin du préavis, le propriétaire peut engager une procédure d'expulsion. Cette procédure est longue (plusieurs mois) et doit être confiée à un avocat.",
  },
];

export default function CongeLocatairePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-sm font-medium text-red-700">
            📬 Congé du locataire
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle de Congé Locataire
            <br />
            <span className="text-red-600">Par le Propriétaire</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Lettre de congédiement du propriétaire au locataire. Respecte les
            délais légaux et les motifs obligatoires. Téléchargez en PDF et envoyez
            en recommandée AR.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700"
            >
              Utiliser ce modèle
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
            >
              Voir tous les modèles
            </Link>
          </div>
        </header>

        <section className="mb-20">
          <h2 className="mb-8 text-2xl font-bold text-stone-900">
            Ce que contient le modèle
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Motif obligatoire",
                desc: "Mention du motif légitime (repreneur, vente, manquement) conforme à la loi.",
                icon: "⚖️",
              },
              {
                title: "Délai de préavis",
                desc: "3 mois (vide) ou 1 mois (meublé). Le modèle calcule automatiquement la date de fin.",
                icon: "📅",
              },
              {
                title: "Envoi recommandée AR",
                desc: "Instructions pour l'envoi en recommandée avec accusé de réception.",
                icon: "📮",
              },
              {
                title: "PDF téléchargeable",
                desc: "Lettre formatée prête à imprimer et à envoyer.",
                icon: "📄",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-xl border border-stone-200 bg-white p-5"
              >
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="mb-1 font-semibold text-stone-900">{item.title}</h3>
                  <p className="text-sm text-stone-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 rounded-2xl bg-red-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Motifs de congé légitimes
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Reprise du logement pour habitation",
              "Vente du bien immobilier",
              "Manquement grave du locataire (impayés, troubles)",
              "Motif légitime et sérieux",
              "Expiration de la durée du bail",
              "Non-respect de l'obligation d'assurance",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="size-5 text-red-600" />
                <span className="text-sm text-stone-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Envoyez un congé en conformité légale
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Notre modèle respecte les délais et formes légales. Téléchargez,
            personnalisez et envoyez en recommandée AR.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-red-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-red-700"
          >
            Essai gratuit 14 jours
          </Link>
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-bold text-stone-900">
            Questions fréquentes
          </h2>
          <div className="mx-auto max-w-3xl space-y-4">
            {faqData.map((item, i) => (
              <details
                key={i}
                className="group rounded-xl border border-stone-200 bg-white"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-medium text-stone-900 list-none">
                  {item.question}
                  <span className="ml-4 text-stone-400 transition-transform group-open:rotate-180">
                    ▼
                  </span>
                </summary>
                <div className="px-6 pb-4 text-sm leading-relaxed text-stone-600">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </section>

        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/templates/conge-proprietaire" className="text-blue-600 hover:underline">
            Congé propriétaire →
          </Link>
          <Link href="/templates/etat-des-lieux" className="text-blue-600 hover:underline">
            État des lieux →
          </Link>
          <Link href="/templates" className="text-blue-600 hover:underline">
            ← Tous les modèles
          </Link>
        </nav>
      </article>
    </div>
  );
}
