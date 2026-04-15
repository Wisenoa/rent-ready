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
      "Le délai est de 6 mois si le congé est donné pour reprise (habiter) ou vente, et de 3 mois en cas de manquement grave du locataire (impayés, troubles de voisinage). En zone tendue, le délai minimal est de 3 mois pour le motif de reprise ou vente. Le délai court à partir de la date de présentation de la lettre recommandée.",
  },
  {
    question: "Le motif est-il obligatoire dans un congé propriétaire ?",
    answer:
      "Oui. Depuis la loi ALUR de 2014, le propriétaire doit indiquer le motif du congé. Les motifs acceptés sont : la reprise pour habiter, la vente du bien, ou un motif légitime et sérieux (troubles de voisinage avérés, impayés persistants). Ne pas указать de motif expose le propriétaire à des sanctions financières.",
  },
  {
    question: "Le congé pour vendre nécessite-t-il une promesse de vente ?",
    answer:
      "Oui. Pour donner congé avec le motif de vente, le propriétaire doit fournir un justificatif : promesse de vente signée ou compromis de vente. Le locataire qui achèterait le bien dispose alors d'un droit de préemption s'il est dans les lieux depuis plus de 3 ans (article 15, loi du 6 juillet 1989).",
  },
  {
    question: "Le locataire peut-il contester le congé ?",
    answer:
      "Oui. Le locataire peut contester le congé devant le tribunal judiciaire s'il estime que le motif est frauduleux ou que les formes n'ont pas été respectées. Le propriétaire doit pouvoir prouver le motif invoqué. En cas de contestation réussie, des dommages et intérêts peuvent être réclamés.",
  },
  {
    question: "Quelles sont les sanctions si le congé est irrégulier ?",
    answer:
      "Si le congé est déclaré nul ou abusif, le propriétaire peut être condamné à verser au locataire : le rappel de loyers des périodes d'occupation illicite, des dommages et intérêts, et les frais de procédure. L'absence de motif ou un motif frauduleux constitue un abus de droit.",
  },
];

const orgSchema = {
  "@type": "Organization",
  "@id": "https://www.rentready.fr/#organization",
  name: "RentReady",
  url: "https://www.rentready.fr",
  logo: "https://www.rentready.fr/logo.png",
  description:
    "Logiciel de gestion locative automatisée pour propriétaires bailleurs indépendants en France.",
  sameAs: [
    "https://twitter.com/rentready_fr",
    "https://www.linkedin.com/company/rentready",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: "contact@rentready.fr",
    availableLanguage: "French",
  },
};
const webSiteSchema = {
  "@type": "WebSite",
  "@id": "https://www.rentready.fr/#website",
  name: "RentReady",
  url: "https://www.rentready.fr",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.rentready.fr/recherche?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

function CongeProprietaireJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      orgSchema,
      webSiteSchema,
      {
        "@type": "WebPage",
        name: "Modèle Congé Propriétaire 2026 — RentReady",
        description:
          "Modèle gratuit de congé donné par le propriétaire au locataire. Motif obligatoire et délai légal.",
        url: "https://www.rentready.fr/templates/conge-proprietaire",
        isPartOf: {
          "@type": "WebSite",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Congé Propriétaire",
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

export default function CongeProprietairePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <CongeProprietaireJsonLd />

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
              Télécharger le modèle PDF
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-orange-700 shadow-sm border border-orange-200 transition-colors hover:bg-orange-50"
            >
              Générer avec RentReady →
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
                desc: "Le propriétaire reprend le logement pour y habiter personnellement ou y loger sa famille proche (enfants, parents). Doit être une vraie reprise (pas un motif de complaisance).",
                icon: "🏠",
              },
              {
                title: "Vente du bien",
                desc: "Le propriétaire vend le bien. Le locataire a un droit de préemption s'il est dans les lieux depuis plus de 3 ans. Doit être attesté par une promesse de vente.",
                icon: "🏢",
              },
              {
                title: "Motif légitime sérieux",
                desc: "Troubles de voisinage avérés, impayés persistants, non-respect de l'assurance obligatoire. Doit être documenté et étayé par des preuves.",
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
            Références légales
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              "Article 15, loi du 6 juillet 1989 (délais de préavis)",
              "Loi ALUR 2014 (obligation de motif pour le propriétaire)",
              "Article 15 III (droit de préemption du locataire)",
              "Jurisprudence : Cour de Cassation, 3e chambre civile",
              "Loi Elan 2018 (encadrement des délais en zone tendue)",
              "Article 472 du Code de procédure civile (contestations)",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="size-5 text-orange-600" />
                <span className="text-sm text-stone-700">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Step-by-step */}
        <section className="mb-20 rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Comment donner congé à un locataire (propiétaire)
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Identifiez le motif légal applicable",
                desc: "Choisissez parmi les 3 motifs légitimes : reprise pour habiter, vente, ou motif légitime sérieux. Chaque motif exige des justifications spécifiques.",
              },
              {
                step: "2",
                title: "Rassemblez les pièces justificatives",
                desc: "Pour une vente : promesse de vente signée. Pour une reprise : justificatif de votre situation (attestation d'embauche, etc.). Pour un manquement : preuves (courriers, constats d'huissier).",
              },
              {
                step: "3",
                title: "Calculez la date de fin de préavis",
                desc: "Le délai est de 6 mois en zone non tendue (reprise/vente) ou 3 mois en cas de manquement. Ajoutez le délai à la date de présentation de la lettre recommandée.",
              },
              {
                step: "4",
                title: "Remplissez et envoyez le modèle",
                desc: "Téléchargez le modèle, complétez vos informations et celles du locataire, joignez les pièces justificatives, puis envoyez en lettre recommandée AR.",
              },
              {
                step: "5",
                title: "Conservez les preuves",
                desc: "Gardez l'accusé de réception pendant au moins 5 ans. Il constitue la preuve de la date de notificación et du respect des délais légaux.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">{item.title}</h3>
                  <p className="text-sm text-stone-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Comparison */}
        <section className="mb-20 rounded-2xl bg-stone-100 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Congé propriétaire vs. congé locataire : comparatif
          </h2>
          <p className="mb-6 text-stone-600">
            Le congé du propriétaire est soumis à des obligations plus strictes
            que celui du locataire. Voici les différences clés.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-300">
                  <th className="text-left py-3 px-4 font-semibold text-stone-900">Critère</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone-900">Congé Propriétaire</th>
                  <th className="text-left py-3 px-4 font-semibold text-orange-700">Congé Locataire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {[
                  ["Délai principal (vide)", "6 mois (reprise/vente)", "3 mois"],
                  ["Délai réduit (zone tendue)", "3 mois", "1 mois"],
                  ["Motif obligatoire", "Oui (loi ALUR 2014)", "Non (libre)"],
                  ["Pièces justificatives", "Oui (promesse de vente, etc.)", "Non requis"],
                  ["Droit de préemption", "Oui (si vente + 3 ans d'occupation)", "N/A"],
                  ["Sanction irrégulier", "Dommages et intérêts au locataire", "N/A (préavis réduit)"],
                  ["Contestable", "Oui (tribunal judiciaire)", "Très limité"],
                ].map(([critere, proprietaire, locataire]) => (
                  <tr key={critere} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-medium text-stone-700">{critere}</td>
                    <td className="py-3 px-4 text-stone-600">{proprietaire}</td>
                    <td className="py-3 px-4 text-orange-700 font-medium">{locataire}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Donnez congé en toute conformité légale
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Notre modèle intègre automatiquement les délais légaux et les mentions obligatoires.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-orange-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-orange-700"
            >
              Essai gratuit 14 jours
            </Link>
            <Link
              href="/outils/calculateur-irl-2026"
              className="inline-block rounded-lg border border-orange-500 px-6 py-3 font-medium text-orange-300 transition-colors hover:bg-orange-800"
            >
              Simulateur IRL →
            </Link>
          </div>
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

        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8">
          <h2 className="mb-4 text-lg font-bold text-stone-900">
            Ressources complémentaires
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { href: "/blog/preavis-location-delais-etapes", label: "Préavis de location : délais et étapes à suivre →" },
              { href: "/blog/droit-preemption-locataire", label: "Droit de préemption du locataire : mode d'emploi →" },
              { href: "/glossaire-immobilier", label: "Glossaire de la location immobilière →" },
              { href: "/templates/conge-locataire", label: "Congé donné par le locataire →" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-blue-600 hover:underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/templates/conge-locataire" className="text-blue-600 hover:underline">
            Congé locataire →
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
