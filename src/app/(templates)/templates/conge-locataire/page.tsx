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
      "Le délai de préavis est de 3 mois pour une location vide et 1 mois pour une location meublée. En zone tendue, le délai peut être réduit à 1 mois pour le locataire en cas de relocation ou de vente. Le délai court à compter de la date de présentation de la lettre recommandée.",
  },
  {
    question: "Le congé doit-il être envoyé en recommandée ?",
    answer:
      "Oui. Le congé doit être adressé par lettre recommandée avec accusé de réception, ou signifié par huissier. L'envoi en recommandée avec AR est la méthode la plus courante et la plus sûre. L'envoi par email ou en main propre n'est pas recevable.",
  },
  {
    question: "Le motif du congé est-il obligatoire ?",
    answer:
      "Oui, pour le congé donné par le propriétaire. Les motifs légitimes sont : relocation (vente, réutilisation), manquement du locataire (impayés, troubles de voisinage), ou motif légitime et sérieux. Ne pas indiquer de motif ou indiquer un motif frauduleux expose le propriétaire à des sanctions.",
  },
  {
    question: "Que se passe-t-il si le locataire ne part pas ?",
    answer:
      "Si le locataire ne part pas à la fin du préavis, le propriétaire peut engager une procédure d'expulsion. Cette procédure est longue (plusieurs mois) et doit être confiée à un avocat. En cas d'impayés, le propriétaire peut également signaler le locataire au FICP (Fichier des Incidents de Crédit).",
  },
  {
    question: "Le locataire a-t-il un droit de préemption lors d'une vente ?",
    answer:
      "Oui. Si le congé est donné pour vendre le bien, le locataire qui occupe depuis plus de 3 ans dispose d'un droit de préemption. Le propriétaire doit l'informer de ce droit dans le congé et lui laisser un délai pour acheter le bien avant de le proposer à un tiers.",
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

function CongeLocataireJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      orgSchema,
      webSiteSchema,
      {
        "@type": "WebPage",
        name: "Modèle Congé Locataire 2026 — RentReady",
        description:
          "Modèle de congé locataire gratuit avec motif obligatoire et délai légal. PDF téléchargeable.",
        url: "https://www.rentready.fr/templates/conge-locataire",
        isPartOf: {
          "@type": "WebSite",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Congé Locataire",
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

export default function CongeLocatairePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <CongeLocataireJsonLd />

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
              Télécharger le modèle PDF
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-red-700 shadow-sm border border-red-200 transition-colors hover:bg-red-50"
            >
              Générer avec RentReady →
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
                desc: "Mention du motif légitime (repreneur, vente, manquement) conforme à la loi ALUR 2014.",
                icon: "⚖️",
              },
              {
                title: "Délai de préavis",
                desc: "3 mois (vide) ou 1 mois (meublé). Le modèle calcule automatiquement la date de fin.",
                icon: "📅",
              },
              {
                title: "Envoi recommandée AR",
                desc: "Instructions détaillées pour l'envoi en recommandée avec accusé de réception.",
                icon: "📮",
              },
              {
                title: "PDF téléchargeable",
                desc: "Lettre formatée prête à imprimer et à envoyer en 2 clics.",
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
              "Reprise du logement pour habitation personnelle ou famille",
              "Vente du bien immobilier (avec promesse de vente)",
              "Manquement grave du locataire (impayés, troubles de voisinage)",
              "Motif légitime et sérieux (non-respect de l'assurance)",
              "Expiration de la durée du bail (bail à durée déterminée)",
              "Non-respect de l'obligation d'assurance locative",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="size-5 text-red-600" />
                <span className="text-sm text-stone-700">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-stone-500">
            Source : Loi du 6 juillet 1989 (art. 15), Loi ALUR 2014
          </p>
        </section>

        {/* Step-by-step */}
        <section className="mb-20 rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Comment donner congé à un locataire
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Vérifiez le motif et le délai applicable",
                desc: "Identifiez le motif légal applicable (reprise, vente, manquement) et le délai de préavis correspondant (3 mois ou 1 mois).",
              },
              {
                step: "2",
                title: "Remplissez le modèle de congé",
                desc: "Téléchargez le modèle, complétez vos coordonnées, celles du locataire, l'adresse du bien, le motif et la date de fin de bail.",
              },
              {
                step: "3",
                title: "Joignez les pièces justificatives",
                desc: "Pour un congé pour vendre, joignez la promesse de vente. Pour une reprise, joignez un justificatif de votre intention d'habiter.",
              },
              {
                step: "4",
                title: "Envoyez en recommandée AR",
                desc: "Envoyez le courrier en lettre recommandée avec accusé de réception. La date de présentation fait foi pour le délai.",
              },
              {
                step: "5",
                title: "Conservez l'accusé de réception",
                desc: "Conservez l'accusé de réception pendant au moins 5 ans. Il prove votre démarche en cas de litige.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
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
            Congé donné par le propriétaire vs. congé donné par le locataire
          </h2>
          <p className="mb-6 text-stone-600">
            Le congé donné par le propriétaire est plus encadré que celui du locataire.
            Voici les différences principales.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-300">
                  <th className="text-left py-3 px-4 font-semibold text-stone-900">Critère</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone-900">Par le Propriétaire</th>
                  <th className="text-left py-3 px-4 font-semibold text-red-700">Par le Locataire</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {[
                  ["Délai (vide)", "3 mois", "3 mois (ou 1 mois zone tendue)"],
                  ["Délai (meublé)", "1 mois", "1 mois"],
                  ["Motif obligatoire", "Oui (légal)", "Non (libre)"],
                  ["Forme", "Recommandée AR ou huissier", "Recommandée AR ou huissier"],
                  ["Droit de préemption locataire", "Oui (si vente + 3 ans)", "N/A"],
                  ["Possibilité de contester", "Oui (tribunal)", "Limitée"],
                ].map(([critere, proprietaire, locataire]) => (
                  <tr key={critere} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-medium text-stone-700">{critere}</td>
                    <td className="py-3 px-4 text-stone-600">{proprietaire}</td>
                    <td className="py-3 px-4 text-red-700 font-medium">{locataire}</td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-red-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-red-700"
            >
              Essai gratuit 14 jours
            </Link>
            <Link
              href="/templates/conge-proprietaire"
              className="inline-block rounded-lg border border-red-500 px-6 py-3 font-medium text-red-300 transition-colors hover:bg-red-800"
            >
              Congé propriétaire →
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
              { href: "/guides/relance-loyer", label: "Guide : relancer un locataire pour impayés →" },
              { href: "/blog/preavis-location-delais-etapes", label: "Préavis de location : délais et étapes →" },
              { href: "/blog/droit-preemption-locataire", label: "Droit de préemption du locataire : mode d'emploi →" },
              { href: "/glossaire-immobilier", label: "Glossaire de la location immobilière →" },
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

        {/* Related templates */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8">
          <h2 className="mb-4 text-lg font-bold text-stone-900">
            Téléchargez aussi
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { href: "/templates/conge-proprietaire", label: "Congé propriétaire", emoji: "📄", desc: "Donner son congé" },
              { href: "/templates/etat-des-lieux", label: "État des lieux", emoji: "📋", desc: "Entrée et sortie" },
            ].map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="flex items-center gap-3 rounded-xl border border-stone-200 p-4 text-sm transition-shadow hover:shadow-sm"
              >
                <span className="text-2xl">{t.emoji}</span>
                <div>
                  <p className="font-medium text-stone-900">{t.label}</p>
                  <p className="text-xs text-stone-500">{t.desc}</p>
                </div>
              </Link>
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
