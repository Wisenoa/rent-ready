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

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "Modèle Bail Colocation — Gratuit | RentReady",
    description: "Téléchargez notre modèle de bail de colocation gratuit et conforme. Contrats pour plusieurs locataires avec clauses partagées et individuelles.",
    url: "/templates/bail-colocation",
    ogType: "template",
  });
}

const typesColoc = [
  {
    titre: "Colocation sans clause de solidarité",
    description:
      "Chaque colocataire est locataire de sa chambre uniquement. Caution et obligations sont séparées. Les plus fragiles mais aussi les plus justes.",
  },
  {
    titre: "Colocation avec clause de solidarité",
    description:
      "La clause de solidarité signifie que si un colocataire ne paie pas, les autres doivent assumer sa part. Protectrice pour le bailleur mais à risque pour les colocataires.",
  },
  {
    titre: "Colocation SCI / société",
    description:
      "Une société ou une SCI peut être locataire unique et sous-louer les chambres. Cadre juridique différent, plus complexe.",
  },
];

const obligationsColoc = [
  { titre: "Dépôt du dossier complet", detail: "Chaque candidat doit fournir un dossier complet (CDI, avis d'imposition, pièce d'identité)" },
  { titre: "Caution(s)", detail: "Une ou plusieurs cautions peuvent être demandées. Peut être une caution bancaire ou un garant personnel." },
  { titre: "État des lieux d'entrée", detail: "Un état des lieux d'entrée doit être réalisé avec chaque colocataire, ou un seul état des lieux collectif avec signatures de chacun." },
  { titre: "Répartition des charges", detail: "Les charges peuvent être réparties équitablement ou par clé de répartition définie dans le bail." },
  { titre: "Règles de vie communes", detail: "Le règlement intérieur peut compléter le bail pour organiser la vie commune (horaires, invités, espaces partagés)." },
  { titre: "Assurance multirisque", detail: "Chaque colocataire doit souscrire une assurance multirisque habitation. Le bailleur doit vérifier." },
];

const faqData = [
  {
    question: "Faut-il un seul bail ou un bail par colocataire ?",
    answer:
      "Techniquement, un seul bail pour tous les locataires est la norme. Chaque colocataire signe le même bail et est solidairement responsable sauf mention contraire. Notre modèle inclut l'option de clause de solidarité.",
  },
  {
    question: "La clause de solidarité est-elle obligatoire ?",
    answer:
      "Non. La clause de solidarité est facultative mais fortement recommandée pour les bailleurs en colocation. Si elle est incluse, chaque locataire est responsable de l'intégralité du loyer si les autres ne payent pas. Sans elle, le bailleur doit poursuivre chaque locataire séparément pour sa part.",
  },
  {
    question: "Comment gérer le départ d'un colocataire ?",
    answer:
      "Le départ d'un colocataire nécessite un avenant au bail. Sans clause de solidarité, le colocataire sortant reste engagé pour sa part jusqu'à la fin du bail ou jusqu'à la signature d'un nouvel avenant. Avec clause de solidarité totale, les autres colocataires doivent assumer sa part.",
  },
  {
    question: "Peut-on ajouter un nouveau colocataire en cours de bail ?",
    answer:
      "Oui, c'est possible via un avenant au bail. Le nouveau colocataire doit signer l'avenant et fournir un dossier complet. Le bailleur peut refuser ou imposer des conditions.",
  },
  {
    question: "Combien de colocataires maximum dans un logement ?",
    answer:
      "Il n'y a pas de plafond légal national, mais certaines communes ont établi des règles minimales de surface par occupant (souvent 9m² minimum par chambre et 70m² minimum pour le logement entier). Vérifiez la réglementation locale.",
  },
];

function BailColocJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr/" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/templates" },
          { "@type": "ListItem", position: 3, name: "Bail Colocation", item: "https://www.rentready.fr/templates/bail-colocation" },
        ],
      },
      {
        "@type": "HowTo",
        name: "Comment rédiger un bail colocation",
        description: "Modèle gratuit de bail colocation. Clauses solidarité, partage des charges, gestion des départs.",
        step: [
          {
            "@type": "HowToStep",
            name: "Choisir le type de colocation",
            text: "Définissez si la clause de solidarité est incluse ou non. Ce choix impacte directement la protection du bailleur et des colocataires.",
          },
          {
            "@type": "HowToStep",
            name: "Préparer les dossiers",
            text: "Chaque colocataire doit fournir un dossier complet. Nous recommandons d'utiliser un dossier unique pour tous les candidats.",
          },
          {
            "@type": "HowToStep",
            name: "Rédiger le bail",
            text: "Complétez le modèle en intégrant les informations spécifiques : nombre de chambres, répartition des charges, montant du loyer.",
          },
          {
            "@type": "HowToStep",
            name: "Signer et état des lieux",
            text: "Tous les colocataires doivent signer le bail. Réalisez un état des lieux collectif countersigné par tous.",
          },
        ],
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Bail Colocation",
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

export default function BailColocationPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <BailColocJsonLd />
      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="mb-4 inline-block rounded-lg bg-purple-100 px-4 py-1.5 text-sm font-medium text-purple-700">
            Modèle gratuit — Téléchargement instantané
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle Bail Colocation
            <br />
            <span className="text-purple-600">Contrat Multi-Locataire</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Téléchargez notre modèle de bail colocation gratuit. Clauses solidarité, partage des charges, gestion des départs.
            Répondre aux besoins des colocataires et protéger le bailleur.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-purple-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-purple-700 w-full sm:w-auto"
            >
              Utiliser avec RentReady →
            </Link>
            <Link
              href="/templates"
              className="inline-block rounded-lg border border-stone-300 bg-white px-8 py-3.5 font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 w-full sm:w-auto"
            >
              Tous les modèles →
            </Link>
          </div>
        </header>

        {/* Colocation types */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Les 3 types de colocation
          </h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {typesColoc.map((t) => (
              <div key={t.titre} className="rounded-xl border border-stone-200 bg-white p-6">
                <h3 className="mb-3 text-lg font-semibold text-stone-900">✓ {t.titre}</h3>
                <p className="text-sm text-stone-600">{t.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Obligations */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Obligations du bailleur en colocation
          </h2>
          <p className="mb-6 text-stone-700">
            La colocation impose des obligations spécifiques au bailleur. Voici les points critiques à respecter :
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {obligationsColoc.map((o) => (
              <div key={o.titre} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <span className="mt-0.5 text-purple-600 font-bold">✓</span>
                <div>
                  <p className="font-semibold text-stone-900">{o.titre}</p>
                  <p className="text-sm text-stone-600">{o.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Clause solidarité */}
        <section className="mb-16 rounded-2xl bg-purple-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            La clause de solidarité : notre recommandation
          </h2>
          <p className="mb-4 text-stone-700">
            Pour protéger le bailleur, nous recommandons fortement d'inclure une <strong>clause de solidarité</strong> dans le bail de colocation. Cette clause signifie que chaque colocataire est responsable de l'intégralité du loyer en cas de défaillance d'un autre.
          </p>
          <p className="mb-4 text-stone-700">
            Pour les colocataires, cela signifie qu'ils doivent choisir leurs colocataires avec soin. Pour le bailleur, c'est la garantie d'être payé même si un colocataire devient défaillant.
          </p>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-stone-700">
              <strong>⚠️ Attention :</strong> La clause de solidarité doit être expressément mentionnée dans le bail. Elle ne se présume pas. Notre modèle inclut cette clause par défaut avec la mention « clause de solidarité partielle ou totale ».
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur la colocation
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
            Gérez vos colocations avec RentReady
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            Suivi des paiements par colocataire, partage automatique des charges, alertes pour les départs. Essai gratuit 14 jours.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-purple-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-purple-700"
          >
            Essai gratuit 14 jours →
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/templates/bail-vide" className="text-blue-600 hover:underline">Bail vide →</Link>
          <Link href="/templates/bail-meuble" className="text-blue-600 hover:underline">Bail meublé →</Link>
          <Link href="/templates/etat-des-lieux" className="text-blue-600 hover:underline">État des lieux →</Link>
          <Link href="/templates/conge-locataire" className="text-blue-600 hover:underline">Congé locataire →</Link>
          <Link href="/pricing" className="text-blue-600 hover:underline">Tarifs →</Link>
        </nav>
      </article>
      <FinalCta />
    </div>
  );
}
