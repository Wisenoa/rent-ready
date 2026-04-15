import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/landing/final-cta";

export const metadata: Metadata = {
  title: "Modèle Contrat de Location Gratuit — Bail Conforme Loi Alur | RentReady",
  description:
    "Téléchargez notre modèle contrat de location gratuit et conforme à la loi du 6 juillet 1989 et à la loi Alur. Bail vide ou meublé, clauses obligatoires,下载 rapide.",
  keywords: [
    "modèle contrat de location",
    "bail location appartement",
    "modèle bail gratuit",
    "contrat location PDF",
    "bail meublé",
    "bail vide",
  ],
  openGraph: {
    title: "Modèle Contrat de Location Gratuit — RentReady",
    description:
      "Modèle de bail de location gratuit et conforme à la loi. Bail vide ou meublé, clauses obligatoires, prêt à personnaliser.",
    type: "website",
    url: "https://www.rentready.fr/modeles/contrat-de-location",
    siteName: "RentReady",
    images: [
      {
        url: "https://www.rentready.fr/og-image.png",
        width: 1200,
        height: 630,
        alt: "RentReady — Modèle Contrat de Location",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modèle Contrat de Location Gratuit — RentReady",
    description:
      "Modèle de bail de location gratuit et conforme à la loi. Bail vide ou meublé, clauses obligatoires.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  alternates: {
    canonical: "https://www.rentready.fr/modeles/contrat-de-location",
  },
};

const clausesObligatoires = [
  "Identité des parties (bailleur et locataire)",
  "Désignation du bien loué (adresse complète, superficie, consistance)",
  "Objet du contrat (usage d'habitation uniquement)",
  "Date de prise d'effet et durée du bail",
  "Montant du loyer et modalités de paiement",
  "Charges locatives et provisions",
  "Dépôt de garantie et conditions de restitution",
  "Travaux et entretien (état des lieux entrant)",
  "Conditions de résiliation et préavis",
  "Clause résolutoire pour impayés",
  "Mention relative aux.Diagnostics énergétiques (DPE)",
  "Annexe informativa (état des lieux, inventaire)",
];

const clausesInterdites = [
  "Interdiction de la clause de solidarité (sauf exceptions)",
  "Interdiction de facturer des frais de dossier au locataire",
  "Interdiction de demander un cautionnement bancaire",
  "Clause de hausse de loyer supérieurs à l'IRL",
  "Clause pénalisante pour le locataire en cas de départ anticipé",
  "Clause interdisant la location de machines électroménagers",
  "Clause imposant au locataire l'assurance du bien",
];

const faqData = [
  {
    question:
      "Quelle est la différence entre un bail vide et un bail meublé ?",
    answer:
      "Le bail meublé offre plus de flexibilité : sa durée est de 12 mois minimum (contre 3 ans pour un bail vide), et le préavis est de 1 mois au lieu de 3 mois. Le loyer d'un meublé est généralement plus élevé pour compenser les équipements fournis. Les mentions obligatoires diffèrent également, notamment l'inventaire précis des meubles.",
  },
  {
    question:
      "Le modèle de bail est-il conforme à la loi Alur et à la loi ÉLAN ?",
    answer:
      "Oui, notre modèle de bail est élaboré en collaboration avec des juristes spécialisés en droit locatif. Il intègre automatiquement les dernières évolutions législatives : encadrement des loyers en zone tendue, état des lieux numérique, dépôt de garantie limité à 1 mois (2 mois en zone tendue), et Clause résolutoire obligatoire pour les impayés.",
  },
  {
    question:
      "Combien de temps doit-on conserver son bail après la fin de location ?",
    answer:
      "En matière fiscale, vous devez conserver vos baux et leurs annexes pendant 5 ans minimum après la fin de la location (pour les revenus fonciers). En matière civile, le délai de prescription pour contester un bail est de 5 ans. Nous vous recommandons de les archiver durant toute la durée de propriété du bien, plus 5 ans.",
  },
];

function ContratLocationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "HowTo",
        name: "Comment rédiger un bail de location conforme",
        description:
          "Guide pour rédiger un contrat de location valide avec toutes les clauses obligatoires requises par la loi du 6 juillet 1989 et la loi Alur.",
        step: [
          {
            "@type": "HowToStep",
            name: "Identifier les parties",
            text: "Renseignez l'identité complète du bailleur et du locataire, leurs coordonnées.",
          },
          {
            "@type": "HowToStep",
            name: "Décrire le bien",
            text: "Adresse complète, superficie Loi Carrez, consistance (pièces, équipements).",
          },
          {
            "@type": "HowToStep",
            name: "Fixer le loyer et les charges",
            text: "Montant du loyer, charges, modalités de révision annuelle selon l'IRL.",
          },
          {
            "@type": "HowToStep",
            name: "Ajouter les annexes obligatoires",
            text: "État des lieux, DPE, inventaire (si meublé), règlement de copropriété.",
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
        name: "Modèle Contrat de Location Gratuit — RentReady",
        description:
          "Téléchargez un modèle de bail de location gratuit et conforme à la loi Alur. Bail vide ou meublé avec toutes les clauses obligatoires.",
        author: {
          "@type": "Organization",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Modèle Contrat de Location",
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

export default function ContratDeLocationPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <ContratLocationJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="inline-block rounded-lg bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
            Modèle gratuit — Téléchargement instantané
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle Contrat de Location
            <br />
            <span className="text-blue-600">Gratuit et Conforme Loi Alur</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Téléchargez notre modèle de bail de location gratuit,100% conforme à
            la loi du 6 juillet 1989 et à la loi Alur. Bail vide ou meublé, clauses
            obligatoires incluses, prêt à personnaliser.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-blue-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-blue-700 w-full sm:w-auto"
            >
              Générer mon bail →
            </Link>
            <Link
              href="/blog/charges-locatives-guide-complet"
              className="inline-block rounded-lg border border-stone-300 bg-white px-8 py-3.5 font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 w-full sm:w-auto"
            >
              Guide charges locatives
            </Link>
          </div>
        </header>

        {/* Lead */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Pourquoi un contrat de location conforme est essentiel ?
          </h2>
          <p className="mb-4 text-stone-700">
            Le contrat de location (ou bail) est le document fondateur de toute
            relation locative. Il définit les droits et obligations de chaque
            partie et constitue la référence juridique en cas de litige. Un bail
            mal rédigé ou incomplet peut être considéré comme{" "}
            <strong>non opposable</strong> au locataire et exposer le bailleur à
            des sanctions.
          </p>
          <p className="text-stone-700">
            La loi du <strong>6 juillet 1989</strong> impose un cadre strict
            pour la rédaction des baux, renforcé par la{" "}
            <strong>loi Alur</strong> (2014) et la{" "}
            <strong>loi ÉLAN</strong> (2018). Notre modèle est mis à jour à
            chaque évolution réglementaire pour garantir votre conformité.
          </p>
        </section>

        {/* Clauses obligatoires */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Les clauses obligatoires du bail de location
          </h2>
          <p className="mb-6 text-stone-600">
            Un bail de location doit impérativement contenir les éléments
            suivants pour être valide et opposable :
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {clausesObligatoires.map((clause, index) => (
              <div
                key={index}
                className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-4"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                  {index + 1}
                </div>
                <span className="text-sm text-stone-700">{clause}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Bail vide vs meublé */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Bail vide vs bail meublé : différences clés
          </h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-bold text-stone-900">
                🏠 Bail vide (non meublé)
              </h3>
              <ul className="space-y-2 text-sm text-stone-700">
                <li>• Durée minimale : <strong>3 ans</strong></li>
                <li>• Préavis minimum : <strong>3 mois</strong></li>
                <li>• Dépôt de garantie : <strong>1 mois</strong> (2 mois en zone tendue)</li>
                <li>• Révision du loyer : selon IRL uniquement</li>
                <li>• Aucune obligation d'équipements</li>
                <li>• Encadrement des loyers applicable en zone tendue</li>
              </ul>
            </div>
            <div className="rounded-xl border border-stone-200 bg-white p-6">
              <h3 className="mb-4 text-lg font-bold text-stone-900">
                🛋️ Bail meublé
              </h3>
              <ul className="space-y-2 text-sm text-stone-700">
                <li>• Durée minimale : <strong>12 mois</strong></li>
                <li>• Préavis minimum : <strong>1 mois</strong></li>
                <li>• Dépôt de garantie : <strong>2 mois</strong></li>
                <li>• Loyer libre (pas d'encadrement en zone tendue pour le meublé)</li>
                <li>• Inventaire détaillé des équipements obligatoire</li>
                <li>• Mobilier minimum selon décret : liste légale à fournir</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Clauses interdites */}
        <section className="mb-16 rounded-2xl border border-red-200 bg-red-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            ⚠️ Clauses interdites et clauses abusives
          </h2>
          <p className="mb-6 text-stone-700">
            Certaines clauses sont purement et simplement interdites par la loi.
            Si votre bail en contient, elles sont réputées non écrites (art. 6 de
            la loi du 6 juillet 1989) :
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {clausesInterdites.map((clause, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-lg bg-white p-3"
              >
                <span className="text-red-500">✗</span>
                <span className="text-sm text-stone-700">{clause}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-stone-600">
            💡 Notre modèle de bail vérifie automatiquement la conformité de
            chaque clause avant génération.
          </p>
        </section>

        {/* Notre modèle */}
        <section className="mb-16 rounded-2xl bg-blue-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Notre modèle de contrat de location gratuit
          </h2>
          <p className="mb-6 text-stone-700">
            Notre modèle de bail est entièrement gratuit, régulièrement mis à jour
            avec les évolutions légales (loi Alur, loi ÉLAN, encadrement des
            loyers 2024-2026), et disponible en version bail vide et bail meublé.
          </p>
          <ul className="mb-6 grid gap-3">
            {[
              "✓ Clauses obligatoires intégrées automatiquement",
              "✓ Clauses interdites signalées et bloquées",
              "✓ DPE et diagnostics joints automatiquement",
              "✓ Calcul du dépôt de garantie selon la zone",
              "✓ Option bail vide ou bail meublé",
              "✓ Export PDF prêt à signer",
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

        {/* Combien de temps garder */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Combien de temps garder son bail ?
          </h2>
          <p className="mb-4 text-stone-700">
            La question de la conservation des baux est souvent sous-estimée. Or,
            plusieurs réglementations imposent des délais de garde minima :
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-stone-700">
              <span className="text-blue-600 font-bold">📂</span>
              <div>
                <strong>Fiscalité :</strong> conservez vos baux et leurs annexes
                pendant <strong>5 ans</strong> après la fin de la location pour
                justifier vos revenus fonciers auprès de l'administration fiscale.
              </div>
            </li>
            <li className="flex items-start gap-3 text-sm text-stone-700">
              <span className="text-blue-600 font-bold">⚖️</span>
              <div>
                <strong>Prescription civile :</strong> le délai de prescription
                pour contester un bail ou un congé est de{" "}
                <strong>5 ans</strong>. Conservez vos documents durant cette
                période.
              </div>
            </li>
            <li className="flex items-start gap-3 text-sm text-stone-700">
              <span className="text-blue-600 font-bold">🏛️</span>
              <div>
                <strong>Preuve en cas de litige :</strong> en cas de procédure
                judiciaire (impayés, dégradation, sortie du locataire), le bail
                et l'état des lieux constituent vos pièces principales.
              </div>
            </li>
          </ul>
          <p className="mt-4 text-sm text-stone-500">
            💡 Avec RentReady, tous vos baux sont archivés automatiquement et
            accessibles à tout moment depuis votre espace.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur le bail de location
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
            Créez votre bail de location en 10 minutes
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Modèle gratuit, assistant guidé, signature électronique. Fini les
            allers-retours fastidieux entre Word et PDF.
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
          <Link href="/bail" className="text-blue-600 hover:underline">
            Gestion des baux →
          </Link>
          <Link href="/etat-des-lieux" className="text-blue-600 hover:underline">
            État des lieux →
          </Link>
          <Link href="/quittances" className="text-blue-600 hover:underline">
            Quittances →
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
