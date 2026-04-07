import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Modèle Congé Donné par le Propriétaire 2026 — Motif & Délai Légal",
  description:
    "Modèle gratuit de congé donné par le propriétaire au locataire. Motif obligatoire, délai de 3 ou 6 mois selon le motif. Téléchargez en PDF.",
  keywords: [
    "conge proprietaire",
    "modele conge proprietaire",
    "delai preavis proprietaire",
    "conge pour vendre",
    "conge pour habiter",
  ],
  openGraph: {
    title: "Modèle Congé Propriétaire 2026 — RentReady",
    description:
      "Congé donné par le propriétaire. Motif obligatoire et délai légal. PDF téléchargeable.",
    type: "website",
    url: "https://www.rentready.fr/templates/conge-proprietaire",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/templates/conge-proprietaire",
  },
};

const faqData = [
  {
    question: "Quel délai pour un congé donné par le propriétaire ?",
    answer:
      "Le délai est de 6 mois si le congé est donné sans motif (reprise pour vendre ou habiter) et de 3 mois en cas de manquement du locataire. En zone tendue, le délai peut être réduit dans certains cas.",
  },
  {
    question: "Le motif est-il obligatoire dans un congé propriétaire ?",
    answer:
      "Oui. Depuis la loi ALUR de 2014, le propriétaire doit indiquer le motif du congé. Les motifsacceptés sont la reprise pour habiter, la vente du bien, ou un motif légitime et sérieux (troubles de voisinage, impayés).",
  },
  {
    question: "Le congé pour vendre nécessite-t-il une promesse de vente ?",
    answer:
      "Oui. Pour donner congé avec le motif de vente, le propriétaire doit fournir un justificatif: promesse de vente signée ou compromis de vente. Le locataire qui acheterait le bien dispose alors d'un droit de préemption.",
  },
  {
    question: "Le locataire peut-il contester le congé ?",
    answer:
      "Oui. Le locataire peut contester le congé devant le tribunal judiciaire s'il estime que le motif est fraudé ou que les formes n'ont pas été respectées. Le propriétaire doit pouvoir prouver le motif invoqué.",
  },
];

export default function CongeProprietairePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-100 px-4 py-1.5 text-sm font-medium text-orange-700">
            🏠 Congé du propriétaire
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Congé Donné par le Propriétaire
            <br />
            <span className="text-orange-600">Motif Obligatoire</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Le propriétaire met fin au bail de son locataire avec un motif
            légitime. Délai de 6 mois, forme en recommandée AR.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
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
            Les 3 motifs légitimes de congé
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Reprise pour habiter",
                desc: "Le propriétaire reprend le logement pour y habiter personnellement ou y loger sa famille proche (enfants, parents).",
                icon: "🏠",
              },
              {
                title: "Vente du bien",
                desc: "Le propriétaire vend le bien. Le locataire a un droit de préemption s'il est dans les lieux depuis plus de 3 ans.",
                icon: "🏢",
              },
              {
                title: "Motif légitime sérieux",
                desc: "Troubles de voisinage avérés, impayés persistants, non-respect de l'assurance obligatoire.",
                icon: "⚖️",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
              >
                <div className="mb-3 text-3xl">{item.icon}</div>
                <h3 className="mb-2 text-lg font-semibold text-stone-900">{item.title}</h3>
                <p className="text-sm text-stone-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-20 rounded-2xl bg-orange-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Ce que contient le modèle
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Motif de congé coché parmi les 3 motifs légitimes",
              "Délai de préavis respecté automatiquement",
              "Clause de contestation possible",
              "Instructions pour envoi en recommandée AR",
              "PDF prêt à imprimer",
              "Modèle conforme loi ALUR 2014",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="size-5 text-orange-600" />
                <span className="text-sm text-stone-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Donnez congé en toute conformité légale
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Notre modèle intègre automatiquement les délais légaux et les mentions obligatoires.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-orange-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-orange-700"
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
          <Link href="/templates/conge-locataire" className="text-blue-600 hover:underline">
            Congé locataire →
          </Link>
          <Link href="/templates" className="text-blue-600 hover:underline">
            ← Tous les modèles
          </Link>
        </nav>
      </article>
    </div>
  );
}
