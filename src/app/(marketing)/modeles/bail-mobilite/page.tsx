import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta"),
  { loading: () => <div style={{ minHeight: 400 }} aria-hidden="true" /> }
);
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Modèle Bail Mobilité — Gratuit | RentReady",
    description: "Téléchargez notre modèle de bail mobilité gratuit. Location meublée de 1 à 10 mois sans possibilité de prolongation ni révision loyer.",
    url: "/modeles/bail-mobilite",
    ogType: "template",
  });
}
;

const caractMobilite = [
  {
    titre: "Durée de 1 à 10 mois",
    description:
      "Le bail mobilité est conclu pour une durée déterminée de 1 à 10 mois maximum. Il ne peut pas être reconduit tacite.",
  },
  {
    titre: "Meublé obligatoire",
    description:
      "Le logement doit être entièrement meublé selon les normes minimales (lit, table, chaises, ustensiles de cuisine, réfrigérateur…).",
  },
  {
    titre: "Motif de mobilité requis",
    description:
      "Le locataire doit JUSTIFIER d'un motif de mobilité professionnelle : mutation, mission temporaire, formation professionnelle, premier emploi.",
  },
  {
    titre: "Sans dépôt de garantie",
    description:
      "Interdiction de demander un dépôt de garantie pour le bail mobilité.唯一的保障是 l'assurance locative obligatoire.",
  },
  {
    titre: "Sans encadrement de loyer",
    description:
      "En zone tendue, le loyer du bail mobilité n'est pas soumis à l'encadrement des loyers (dérogation permise par la loi ELAN).",
  },
  {
    titre: "Fin anticipée possible",
    description:
      "Le locataire peut résilier le bail à tout moment avec un préavis de 1 mois. Le bailleur ne peut pas résilier anticipatement.",
  },
];

const motifsMobilite = [
  { motif: "Mutations professionnelles", detail: "Changement de poste ou de ville pour raison professionnelle" },
  { motif: "Missions temporaires", detail: "CDD, mission, stage, contrat d'avenir" },
  { motif: "Formations professionnelles", detail: "Formation continue, reconversion, études supérieures" },
  { motif: "Premier emploi", detail: "Jeunes diplômés entrant sur le marché du travail" },
  { motif: "Création d'entreprise", detail: "Portage salarial, freelance en phase de lancement" },
  { motif: "Situation de handicap", detail: "Évolution de l'autonomie ou situation médicale" },
];

const faqData = [
  {
    question: "Le bail mobilité peut-il être reconduit ?",
    answer:
      "Non. Le bail mobilité est un bail à durée déterminée qui expire automatiquement à son terme. Il ne peut pas être reconduit tacite. Si le logement vous convient, un nouveau bail (pas un bail mobilité) devra être signé.",
  },
  {
    question: "Peut-on habiter en zone tendue avec un bail mobilité ?",
    answer:
      "Oui. En zone tendue, le bail mobilité échappe à l'encadrement des loyers. C'est l'un de ses avantages : le bailleur peut fixer librement le montant du loyer. C'est aussi un risque pour le locataire en zone tendue.",
  },
  {
    question: "Le dépôt de garantie est-il autorisé ?",
    answer:
      "Non. Le dépôt de garantie est interdit pour le bail mobilité (loi ELAN 2018). En contrepartie, le locataire peut être demandé de fournir une attestation d'assurance risques locatifs.",
  },
  {
    question: "Comment résilier un bail mobilité ?",
    answer:
      "Le locataire peut résilier à tout moment avec un préavis de 1 mois (lettre recommandée avec AR). Le bailleur ne peut PAS résilier en cours de bail — sauf en cas de non-paiement ou de trouble de voisinage.",
  },
  {
    question: "Le bail mobilité est-il renouvelable ?",
    answer:
      "Un bail mobilité ne peut pas dépasser 10 mois. Après 10 mois, si le locataire reste dans le logement, un nouveau bail (ordinaire) doit être signé. Le locataire peut également bénéficier d'un bail mobilité dans un autre logement.",
  },
];

function BailMobiliteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr/" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/modeles" },
          { "@type": "ListItem", position: 3, name: "Bail Mobilité", item: "https://www.rentready.fr/modeles/bail-mobilite" },
        ],
      },
      {
        "@type": "HowTo",
        name: "Comment rédiger un bail mobilité",
        description: "Modèle gratuit de bail mobilité pour location meublée temporaire 1-10 mois, conforme loi Elan 2018.",
        step: [
          {
            "@type": "HowToStep",
            name: "Vérifier l'éligibilité",
            text: "Confirmez que le logement est meublé et que le locataire Justifie d'un motif de mobilité professionnelle.",
          },
          {
            "@type": "HowToStep",
            name: "Rédiger le bail",
            text: "Utilisez le modèle bail mobilité en adaptant les clauses aux spécificités du logement.",
          },
          {
            "@type": "HowToStep",
            name: "Collecter les pièces",
            text: "Obtenez l'attestation d'assurance, la pièce d'identité du locataire, et le motif de mobilité.",
          },
          {
            "@type": "HowToStep",
            name: "Signer et remettre",
            text: "Signez le bail en 2 exemplaires et remettez un exemplaire au locataire.",
          },
        ],
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Mobilité",
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

export default function BailMobilitePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailMobiliteJsonLd />
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-lg bg-green-100 px-4 py-1.5 text-sm font-medium text-green-700">
            Modèle gratuit — Téléchargement instantané
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle Bail Mobilité
            <br />
            <span className="text-green-600">Location Meublée 1-10 mois</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Téléchargez notre modèle de bail mobilité gratuit. Location meublée temporaire pour mobilité professionnelle.
            Conforme loi ELAN 2018 — prêt à signer.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-green-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-green-700 w-full sm:w-auto"
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

        {/* Ce qu'il faut savoir */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Le bail mobilité : c'est quoi ?
          </h2>
          <p className="mb-4 text-stone-700">
            Créé par la <strong>loi ELAN de 2018</strong>, le bail mobilité est un contrat de location meublée designed specifically for temporary housing needs related to professional mobility. It can last between <strong>1 and 10 months</strong> and cannot be renewed — it simply ends when the term expires.
          </p>
          <p className="mb-4 text-stone-700">
            C'est un outil précieux pour les entreprises qui accueillent des salariés en mobilité temporaire (mutations, missions), ainsi que pour les jeunes actifs en début de carrière qui ont besoin d'un logement quickly without being locked into a long-term commitment.
          </p>
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-stone-700">
              <strong>⚠️ Important :</strong> Sans dépôt de garantie autorisé pour le bail mobilité. Le bailleur doit donc être particulièrement vigilant sur l'assurance du locataire et potentially require a guarantee institutionnel (VISALE, Loca-Pass).
            </p>
          </div>
        </section>

        {/* Caractéristiques */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Les 6 caractéristiques clés du bail mobilité
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {caractMobilite.map((c) => (
              <div key={c.titre} className="rounded-xl border border-stone-200 bg-white p-6">
                <h3 className="mb-3 text-lg font-semibold text-stone-900">✓ {c.titre}</h3>
                <p className="text-sm text-stone-600">{c.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Motifs éligibles */}
        <section className="mb-16 rounded-2xl bg-blue-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Quels sont les motifs de mobilité acceptés ?
          </h2>
          <p className="mb-6 text-stone-700">
            Pour conclure un bail mobilité, le locataire doit fournir un justificatif de mobilité professionnelle. Voici les motifs reconnus :
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {motifsMobilite.map((m) => (
              <div key={m.motif} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-4">
                <span className="mt-0.5 text-green-600 text-lg">✓</span>
                <div>
                  <p className="font-semibold text-stone-900">{m.motif}</p>
                  <p className="text-sm text-stone-600">{m.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Clauses obligatoires */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Clauses obligatoires du bail mobilité
          </h2>
          <p className="mb-6 text-stone-700">
            Le bail mobilité doit imperatively contenir les éléments suivants. Notre modèle les intègre tous :
          </p>
          <ul className="space-y-3 text-sm text-stone-700">
            <li>• <strong>Durée déterminée précise</strong> (ex : 6 mois, du 1er avril au 30 septembre)</li>
            <li>• <strong>Liste des meubles et équipements</strong> avec état de l'inventaire</li>
            <li>• <strong>Montant du loyer et charges</strong> (sans dépôt de garantie)</li>
            <li>• <strong>Motif de mobilité</strong> + pièce justificative jointe</li>
            <li>• <strong>Conditions de résiliation</strong> (préavis 1 mois pour le locataire)</li>
            <li>• <strong>Attestation d'assurance risques locatifs</strong> obligatoire</li>
            <li>• <strong>Dépôt du dossier de diagnostic technique (DDT)</strong></li>
            <li>• <strong>Évolution annuelle du loyer</strong> (indexation possible si mentionnée)</li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur le bail mobilité
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

        {/* CTA final */}
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Générez vos baux mobilité automatiquement
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            RentReady génère votre bail mobilité PDF en 2 minutes, avec inventory et clauses conformes. Essai gratuit 14 jours.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-green-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-green-700"
          >
            Essai gratuit 14 jours →
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/bail" className="text-blue-600 hover:underline">Gestion des baux →</Link>
          <Link href="/quittances" className="text-blue-600 hover:underline">Quittances →</Link>
          <Link href="/pricing" className="text-blue-600 hover:underline">Tarifs →</Link>
          <Link href="/modeles/contrat-de-location" className="text-blue-600 hover:underline">Bail standard →</Link>
          <Link href="/modeles/quittance-de-loyer" className="text-blue-600 hover:underline">Quittance →</Link>
        </nav>
      </article>
      <FinalCta />
    </div>
  );
}
