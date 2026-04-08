import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Modèle Bail Colocation Gratuit 2026 — Clause de Solidarité",
  description:
    "Modèle de bail colocation gratuit avec clause de solidarité. Gérez plusieurs locataires dans un même bien. Téléchargez en PDF, conformité loi 1989.",
  keywords: [
    "bail colocation",
    "modele colocation",
    "clause solidarite colocation",
    "bail plusieurs locataires",
    "colocation loi 1989",
  ],
  openGraph: {
    title: "Modèle Bail Colocation 2026 — Clause Solidarité | RentReady",
    description:
      "Bail colocation gratuit avec clause de solidarité. Téléchargeable en PDF, personnalisez les conditions.",
    type: "website",
    url: "https://www.rentready.fr/templates/colocation",
    siteName: "RentReady",
  },
  alternates: {
    canonical: "https://www.rentready.fr/templates/colocation",
  },
};

const features = [
  {
    title: "Clause de solidarité",
    description:
      "Chaque colocataire est responsable de l'intégralité du loyer. Protège le propriétaire en cas de défaillance d'un locataire.",
    icon: "🤝",
  },
  {
    title: "Loyers individualisés",
    description:
      "Possibilité de fixer des montants différents pour chaque chambre avec une clé de répartition claire.",
    icon: "💰",
  },
  {
    title: "OSP (Orientation de la Shared)",
    description:
      "Le bail colocation peut être conclu sans OSP, permettant à chaque colocataire de partir individuellement.",
    icon: "🚪",
  },
  {
    title: "Inventaire commun",
    description:
      "Un seul inventaire pour le bien complet. Chaque chambre peut avoir son propre état des lieux.",
    icon: "📋",
  },
  {
    title: "Charges partagées",
    description:
      "Répartition équilibrée des charges avec tableau de répartition joint au bail.",
    icon: "📊",
  },
  {
    title: "Ajout/retrait de colocataire",
    description:
      "Clause permettant le changement de colocataire sans rupture du bail principal.",
    icon: "🔄",
  },
];

const faqData = [
  {
    question: "Qu'est-ce que la clause de solidarité dans une colocation ?",
    answer:
      "La clause de solidarité signifie que chaque colocataire est tenu responsable de la totalité du loyer et des charges, pas seulement de sa part. Si un colocataire ne paie pas, le propriétaire peut réclamer l'intégralité des sommes dues à n'importe lequel des colocataires. La durée de la solidarité peut être limitée à 18 mois (loi Elan).",
  },
  {
    question: "Peut-on avoir des loyers différents dans une colocation ?",
    answer:
      "Oui. Il est possible de fixer des montants différents pour chaque chambre, avec une clé de répartition jointe au bail. Chaque locataire signe alors pour un montant individualisé tout en restant solidairement responsable des sommes totales.",
  },
  {
    question: "Qu'est-ce que l'OSP (Orientation de la Shared) ?",
    answer:
      "L'OSP permet à chaque colocataire de donner son congé individuellement (avec un préavis de 3 mois) sans que cela n'affecte les autres. Sans OSP, le départ d'un colocataire peut entraîner la fin du bail pour tous.",
  },
  {
    question: "Combien de colocataires maximum dans un bail ?",
    answer:
      "La loi ne fixe pas de nombre maximum explicite, mais un arrêté municipal peut encadrer la colocation (ex. : maximum 6 à Paris). En pratique, 2 à 5 colocataires est le plus courant. Au-delà, le logement peut être requalifié en habitation de tourism.",
  },
  {
    question: "Comment ajouter ou retirer un colocataire en cours de bail ?",
    answer:
      "L'ajout d'un nouveau colocataire nécessite un avenant au bail signé par toutes les parties. Le retrait d'un colocataire peut se faire par simple notification au propriétaire, en particulier si le bail inclut une clause de changement de colocataire. Sans clause spécifique, le départ nécessite l'accord du propriétaire et des autres colocataires.",
  },
];

function ColocationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "Modèle Bail Colocation 2026 — RentReady",
        description:
          "Modèle de bail colocation gratuit avec clause de solidarité. PDF téléchargeable.",
        url: "https://www.rentready.fr/templates/colocation",
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Colocation",
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

export default function ColocationPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <ColocationJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            👥 Bail de colocation
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle de Bail Colocation
            <br />
            <span className="text-purple-600">Clause de Solidarité</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Gérez plusieurs locataires dans un même bien avec un bail unique.
            Clause de solidarité, loyers individualisés, ajout de colocataire
            en cours de bail.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-purple-700"
            >
              Télécharger le modèle PDF
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-purple-700 shadow-sm border border-purple-200 transition-colors hover:bg-purple-50"
            >
              Générer avec RentReady →
            </Link>
          </div>
        </header>

        <section className="mb-20">
          <h2 className="mb-8 text-2xl font-bold text-stone-900">
            Caractéristiques du bail colocation
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-stone-200/50 bg-white/60 p-6 shadow-sm backdrop-blur-sm"
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

        <section className="mb-20 rounded-2xl bg-purple-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Clauses optionnelles disponibles
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              "Clause de solidarité limitée (18 mois max, loi Elan)",
              "OSP (Orientation de la Shared Peace)",
              "Clause d'individualisation du loyer",
              "Clause de sous-location interdite",
              "Clause de changement de colocataire",
              "Clause de répartition des charges locatives",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="size-5 text-purple-600" />
                <span className="text-sm text-stone-700">{item}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-stone-500">
            Source : Loi du 6 juillet 1989 (art. 8-1), loi Elan 2018
          </p>
        </section>

        {/* Step-by-step */}
        <section className="mb-20 rounded-2xl bg-white p-8 shadow-sm sm:p-10">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Comment utiliser ce modèle de bail colocation
          </h2>
          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Choisissez la structure juridique",
                desc: "Décidez si vous souhaitez une clause de solidarité (tous responsables) ou individuelle (chaque locataire ne paie que sa part).",
              },
              {
                step: "2",
                title: "Définissez la répartition des loyers",
                desc: "Attribuez un montant à chaque chambre et établissez une clé de répartition claire pour les charges.",
              },
              {
                step: "3",
                title: "Remplissez les informations",
                desc: "Indiquez les coordonnées de chaque colocataire, la description du bien, le montant total du loyer et sa répartition.",
              },
              {
                step: "4",
                title: "Personnalisez les clauses",
                desc: "Ajoutez la clause de changement de colocataire, les conditions de sortie anticipée, et la clause de répartition des charges.",
              },
              {
                step: "5",
                title: "Faites signer par toutes les parties",
                desc: "Chaque colocataire doit signer le bail. Joignez l'état des lieux et les annexes (DPE, diagnostics).",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
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
            Colocation avec ou sans clause de solidarité
          </h2>
          <p className="mb-6 text-stone-600">
            La clause de solidarité protège le propriétaire mais engage chaque
            colocataire au-delà de sa part. Voici les différences clés.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-300">
                  <th className="text-left py-3 px-4 font-semibold text-stone-900">Critère</th>
                  <th className="text-left py-3 px-4 font-semibold text-stone-900">Avec Solidarité</th>
                  <th className="text-left py-3 px-4 font-semibold text-purple-700">Sans Solidarité</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {[
                  ["Protection propriétaire", "Maximale (1 seul interlocuteur)", "Limitée (plusieurs interlocuteurs)"],
                  ["Risque pour colocataire", "Élevé (responsable de tout)", "Limité (sa part uniquement)"],
                  ["Départ anticipé", "Tous restent responsables 18 mois max", "Seul le partant est concerné"],
                  ["Contentieux", "Plus simple (1 seul debtor)", "Plus complexe (plusieurs parties)"],
                  ["Recommandé pour", "Propriétaires de biens neufs", "Colocataires между собой"],
                  ["Durée solidarité", "Max 18 mois (loi Elan)", "N/A"],
                ].map(([critere, solidarite, sans]) => (
                  <tr key={critere} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-medium text-stone-700">{critere}</td>
                    <td className="py-3 px-4 text-stone-600">{solidarite}</td>
                    <td className="py-3 px-4 text-purple-700 font-medium">{sans}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Louez à plusieurs en toute sécurité
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Notre modèle de bail colocation vous protège en cas de défaillance
            d'un colocataire grâce à la clause de solidarité.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-purple-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-purple-700"
            >
              Essai gratuit 14 jours
            </Link>
            <Link
              href="/templates/etat-des-lieux"
              className="inline-block rounded-lg border border-purple-500 px-6 py-3 font-medium text-purple-300 transition-colors hover:bg-purple-800"
            >
              État des lieux →
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
              { href: "/blog/colocation-guide-proprietaire", label: "Guide de la colocation pour propriétaires →" },
              { href: "/blog/gestion-colocation-etat-des-lieux", label: "État des lieux en colocation : nos conseils →" },
              { href: "/glossaire-immobilier", label: "Glossaire de la location immobilière →" },
              { href: "/templates/etat-des-lieux", label: "Modèle d'état des lieux →" },
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
          <Link href="/templates/bail-meuble" className="text-blue-600 hover:underline">
            Bail meublé →
          </Link>
          <Link href="/templates/bail-commercial" className="text-blue-600 hover:underline">
            Bail commercial →
          </Link>
          <Link href="/templates/bail-mobilite" className="text-blue-600 hover:underline">
            Bail mobilité →
          </Link>
          <Link href="/templates" className="text-blue-600 hover:underline">
            ← Tous les modèles
          </Link>
        </nav>
      </article>
    </div>
  );
}
