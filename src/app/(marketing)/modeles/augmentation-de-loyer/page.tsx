import type { Metadata } from "next";
import Link from "next/link";
import dynamic from "next/dynamic";
import React from "react";
// Dynamic import: FinalCta uses framer-motion (heavy, below-fold)
const FinalCta = dynamic(
  () => import("@/components/landing/final-cta"),
  { ssr: false, loading: () => <div style={{minHeight:400}} aria-hidden="true" /> }
);
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata() {
  return baseMetadata({
    title: "Modèle Lettre Augmentation de Loyer — Gratuit | RentReady",
    description: "Modèle de lettre pour augmenter le loyer en cours de bail. Calculs révision IRL et règles dineo-occupy pour incrementer合法的租金.",
    url: "/modeles/augmentation-de-loyer",
    ogType: "template",
  });
}
;

const conditionsAugmentation = [
  {
    titre: "Intervalle d'un an",
    description:
      "La révision ne peut avoir lieu qu'une fois par an, à la date anniversaire du bail. Vous ne pouvez pas réviser plus fréquemment.",
  },
  {
    titre: "Clause de révision dans le bail",
    description:
      "Le bail doit contenir une clause prévoyant la révision annuelle du loyer selon un indice de référence (IRL ou ILAT). Sans cette clause, aucune révision n'est possible.",
  },
  {
    titre: "Indice de référence",
    description:
      "L'augmentation ne peut pas dépasser la variation de l'IRL (Indice de Référence des Loyers) publié par l'INSEE, ou l'ILAT pour les locations commerciales.",
  },
  {
    titre: "Délai de prévenance",
    description:
      "Le bailleur doit informer le locataire au moins 1 mois avant la date d'anniversaire du bail (ou 3 mois pour la location meublée).",
  },
];

const zonesTendues2026 = [
  { ville: "Paris", statut: "Encadrement actif depuis 2019" },
  { ville: "Lyon", statut: "Encadrement depuis 2021" },
  { ville: "Bordeaux", statut: "Encadrement depuis 2022" },
  { ville: "Montpellier", statut: "Encadrement depuis 2023" },
  { ville: "Grenoble", statut: "Encadrement depuis 2023" },
  { ville: "Lille", statut: "Encadrement depuis 2023" },
  { ville: "Rennes", statut: "Encadrement depuis 2023" },
  { ville: "Nantes", statut: "Encadrement depuis 2024" },
  { ville: "Marseille", statut: "Encadrement depuis 2024" },
  { ville: "Toulouse", statut: "Encadrement depuis 2024" },
];

const faqData = [
  {
    question:
      " Peut-on augmenter le loyer tous les ans ?",
    answer:
      "Oui, la révision du loyer selon l'IRL peut avoir lieu une fois par an, à la date anniversaire du bail. Mais attention : en zone tendue, le montant du loyer ne peut pas dépasser le loyer de référence minoré (soit -5 % à -20 % selon les communes). Le bailleur ne peut pas pratiquer une hausse supérieure à l'IRL sous prétexte de 'mise à niveau'.",
  },
  {
    question:
      "Comment calculer l'augmentation avec l'IRL ?",
    answer:
      "La formule est simple : Nouveau loyer = Loyer actuel × (Nouvel IRL / Ancien IRL). Par exemple, pour un loyer de 800 € avec un IRL qui passe de 138,38 à 141,02 : 800 × (141,02 / 138,38) = 815,26 €. L'augmentation maximale est de 1,9 % dans cet exemple.",
  },
  {
    question:
      "Que se passe-t-il si le bail ne contient pas de clause de révision ?",
    answer:
      "Si le bail ne contient pas de clause de révision automatique du loyer, le bailleur ne peut pas imposes une augmentation en cours de bail. Il faudra attendre le renouvellement du bail pour négocier un nouveau loyer, ce qui est possible mais doit respecter l'encadrement en zone tendue.",
  },
];

function AugmentationLoyerJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr/" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/modeles" },
          { "@type": "ListItem", position: 3, name: "Augmentation de loyer", item: "https://www.rentready.fr/modeles/augmentation-de-loyer" },
        ],
      },
      {
        "@type": "HowTo",
        name: "Comment rédiger une lettre d'augmentation de loyer",
        description:
          "Guide pour calculer et rédiger une lettre d'augmentation de loyer conforme à l'IRL 2026.",
        step: [
          {
            "@type": "HowToStep",
            name: "Vérifier les conditions",
            text: "Vérifiez qu'une clause de révision figure dans le bail et que le délai d'un an est respecté.",
          },
          {
            "@type": "HowToStep",
            name: "Calculer l'augmentation IRL",
            text: "Appliquez la formule : Nouveau loyer = Loyer actuel × (Nouvel IRL / Ancien IRL).",
          },
          {
            "@type": "HowToStep",
            name: "Rédiger le courrier",
            text: "Mentionnez le nouvel indice IRL, le nouveau loyer, et la date d'application.",
          },
          {
            "@type": "HowToStep",
            name: "Envoyer dans les délais",
            text: "Envoyez la lettre au moins 1 mois avant la date d'anniversaire du bail.",
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
        name: "Modèle Lettre Augmentation de Loyer — RentReady",
        description:
          "Modèle gratuit de lettre d'augmentation de loyer. Révision IRL 2026, zones tendues, guide complet.",
        author: {
          "@type": "Organization",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Modèle Lettre Augmentation de Loyer",
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

export default function AugmentationDeLoyerPage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <AugmentationLoyerJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="inline-block rounded-lg bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
            Modèle gratuit — Téléchargement instantané
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle Lettre Augmentation de Loyer
            <br />
            <span className="text-blue-600">Gratuit et Conforme IRL 2026</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Téléchargez notre modèle de lettre d'augmentation de loyer gratuit.
            Révision selon l'IRL, applicable aux zones tendues, prêt à personnaliser
            et à envoyer.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-blue-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-blue-700 w-full sm:w-auto"
            >
              Calculer et générer →
            </Link>
            <Link
              href="/blog/charges-locatives-guide-complet"
              className="inline-block rounded-lg border border-stone-300 bg-white px-8 py-3.5 font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50 w-full sm:w-auto"
            >
              Guide sur les charges
            </Link>
          </div>
        </header>

        {/* Lead */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Quand et comment un bailleur peut-il augmenter le loyer ?
          </h2>
          <p className="mb-4 text-stone-700">
            En France, l'augmentation de loyer est encadrée par la loi pour éviter
            les hausses abusives. Le bailleur ne peut augmenter le loyer qu'en
            appliquant la variation de l'<strong>Indice de Référence des Loyers
            (IRL)</strong> publié trimestriellement par l'INSEE, et ce, uniquement
            si le bail contient une clause de révision.
          </p>
          <p className="mb-4 text-stone-700">
            En <strong>zone tendue</strong> (villes où la demande excède l'offre),
            des plafonds supplémentaires s'appliquent. Le loyer ne peut pas
            dépasser un certain seuil, et les hausses excessives sont
            passibles de sanctions.
          </p>
          <p className="text-stone-700">
            Notre modèle de lettre d'augmentation de loyer vous permet de
            rédiger un courrier conforme, avec le bon indice IRL, le calcul
            correct, et dans les délais réglementaires.
          </p>
        </section>

        {/* Conditions */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Les conditions pour augmenter le loyer
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {conditionsAugmentation.map((condition) => (
              <div
                key={condition.titre}
                className="rounded-xl border border-stone-200 bg-white p-6"
              >
                <h3 className="mb-3 text-lg font-semibold text-stone-900">
                  ✓ {condition.titre}
                </h3>
                <p className="text-sm text-stone-600">{condition.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Calcul IRL */}
        <section className="mb-16 rounded-2xl bg-blue-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Calculer l'augmentation : la formule IRL
          </h2>
          <p className="mb-6 text-stone-700">
            L'augmentation de loyer est calculée selon la formule suivante :
          </p>
          <div className="mb-6 rounded-xl border border-blue-200 bg-white p-6 text-center">
            <div className="font-mono text-lg font-bold text-stone-900">
              Nouveau loyer = Loyer actuel × (Nouvel IRL ÷ Ancien IRL)
            </div>
          </div>
          <p className="mb-6 text-stone-700">
            <strong>Exemple concret :</strong>
          </p>
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <ul className="space-y-2 text-sm text-stone-700">
              <li>• Loyer actuel : <strong>800 €/mois</strong></li>
              <li>• Ancien IRL (T2 2024) : <strong>138,38</strong></li>
              <li>• Nouvel IRL (T2 2025) : <strong>141,02</strong></li>
              <li>• Calcul : 800 × (141,02 ÷ 138,38) = <strong>815,26 €/mois</strong></li>
              <li>• Augmentation : <strong>+15,26 €/mois (+1,9 %)</strong></li>
            </ul>
          </div>
          <p className="mt-4 text-sm text-stone-500">
            💡 Les indices IRL sont publiés par l'INSEE chaque trimestre. Vous
            pouvez les retrouver sur le site institutionnel ou les consulter
            directement dans RentReady.
          </p>
        </section>

        {/* Zones tendues */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Zones tendues et plafonds 2026
          </h2>
          <p className="mb-6 text-stone-600">
            En zone tendue, le loyer ne peut pas dépasser un seuil maximal. La
            loi Elan a étendue l'encadrement des loyers à plusieurs grandes villes.
            Voici les communes concerné :
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {zonesTendues2026.map((zone) => (
              <div
                key={zone.ville}
                className="flex items-center justify-between rounded-xl border border-stone-200 bg-white p-4"
              >
                <span className="text-sm font-medium text-stone-900">{zone.ville}</span>
                <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                  {zone.statut}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm text-stone-700">
              <strong>⚠️ Important :</strong> en zone tendue, si le loyer de
              référence est dépassé, le bailleur risque une sanction pouvant
              aller jusqu'à 5 000 € d'amende. Le modèle de courrier prend
              automatiquement en compte le plafond applicable à votre commune.
            </p>
          </div>
        </section>

        {/* Rédiger le courrier */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Rédiger le courrier d'augmentation : ce qu'il doit contenir
          </h2>
          <p className="mb-6 text-stone-700">
            Le courrier d'augmentation de loyer doit être envoyé par lettre
            recommandée avec accusé de réception. Il doit mentionner :
          </p>
          <ul className="mb-6 space-y-2 text-sm text-stone-700">
            <li>• <strong>Vos coordonnées complètes</strong> (nom, adresse)</li>
            <li>• <strong>Coordonnées du locataire</strong> (nom, adresse du bien)</li>
            <li>• <strong>Référence du bail</strong> (date de signature)</li>
            <li>• <strong>Indice IRL utilisé</strong> (trimestre et année)</li>
            <li>• <strong>Loyer actuel et nouveau loyer</strong> (montants nets)</li>
            <li>• <strong>Date d'application</strong> (date d'anniversaire du bail)</li>
            <li>• <strong>Calcul détaillé</strong> de la hausse appliquée</li>
            <li>• <strong>Mode de paiement</strong> (si unchanged, le mentionner)</li>
          </ul>
          <p className="text-sm text-stone-600">
            Le courrier doit être envoyé au moins <strong>1 mois avant</strong> la
            date d'anniversaire du bail pour les locations nues (3 mois pour les
            locations meublées).
          </p>
        </section>

        {/* Modèle de courrier */}
        <section className="mb-16 rounded-2xl bg-stone-900 px-6 py-14 text-white shadow-lg">
          <div className="max-w-3xl mx-auto">
            <h2 className="mb-4 text-xl font-bold text-white">
              Modèle de courrier d'augmentation de loyer
            </h2>
            <p className="mb-6 text-stone-300">
              Voici un exemple de courrier à envoyer. Vous pouvez le personnaliser
              directement dans RentReady :
            </p>
            <div className="rounded-xl border border-stone-700 bg-stone-800 p-6 font-mono text-sm text-stone-300">
              <p className="mb-2 font-bold text-white">[Votre nom et adresse]</p>
              <p className="mb-2">[Code postal, Ville]</p>
              <p className="mb-4 mt-4">[Nom du locataire]</p>
              <p className="mb-2">[Adresse du locataire]</p>
              <p className="mb-4 mt-4">
                <strong>Objet : Révision de loyer — [Adresse du bien]</strong>
              </p>
              <p className="mb-4">
                Madame, Monsieur,
              </p>
              <p className="mb-4">
                Conformément à la clause de révision prévue dans votre bail en
                date du [date], je vous informe de la révision annuelle de votre
                loyer basée sur l'indice de référence des loyers (IRL).
              </p>
              <p className="mb-4">
                Indice de référence : <strong>IRL T2 2025 = 141,02</strong>
                <br />
                Ancien loyer : <strong>800,00 €/mois</strong>
                <br />
                Nouveau loyer : <strong>815,26 €/mois</strong>
                <br />
                soit une augmentation de <strong>+1,9 %</strong>.
              </p>
              <p className="mb-4">
                Cette augmentation s'appliquera à compter du{' '}
                <strong>[date d'anniversaire du bail]</strong>.
              </p>
              <p className="mb-4">
                Je reste à votre disposition pour tout renseignement complémentaire.
              </p>
              <p className="mb-4">Cordialement,</p>
              <p className="mb-2 font-bold text-white">[Votre signature]</p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
              >
                Télécharger le modèle PDF →
              </Link>
              <Link
                href="/register"
                className="inline-block rounded-lg border border-stone-600 bg-stone-800 px-6 py-3 font-medium text-white shadow-sm transition-colors hover:bg-stone-700"
              >
                Utiliser avec RentReady →
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur l'augmentation de loyer
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
            Calculer et générer vos lettres d'augmentation automatiquement
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            RentReady calcula automatiquement l'augmentation IRL, génère le
            courrier PDF et vous alerte 2 mois avant la date d'anniversaire
            du bail.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            Essai gratuit 14 jours →
          </Link>
        </section>

        {/* Internal links */}
        <nav className="flex flex-wrap justify-center gap-4 text-sm text-stone-500">
          <Link href="/bail" className="text-blue-600 hover:underline">
            Gestion des baux →
          </Link>
          <Link href="/quittances" className="text-blue-600 hover:underline">
            Quittances →
          </Link>
          <Link href="/pricing" className="text-blue-600 hover:underline">
            Tarifs →
          </Link>
          <Link href="/blog" className="text-blue-600 hover:underline">
            Blog →
          </Link>
        </nav>
      </article>

      <FinalCta />
    </div>
  );
}
