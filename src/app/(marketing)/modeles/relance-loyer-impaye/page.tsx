import type { Metadata } from "next";
import Link from "next/link";
import { FinalCta } from "@/components/landing/final-cta";
import { SchemaMarkup } from "@/components/seo/schema-markup";

export const metadata: Metadata = {
  title: "Modèle Relance Loyer Impayé — Gratuit | RentReady",
  description:
    "Modèle lettre de relance loyer impayé gratuit. Mise en demeure, modelo officiel, téléchargement PDF.Conforme законодательству.适用于 tous les propriétaires.",
  keywords: [
    "lettre relance loyer impayé",
    "mise en demeure loyer",
    "relance loyer impayé modèle",
    "modèle lettre impayé",
  ],
  openGraph: {
    title: "Modèle Relance Loyer Impayé — RentReady",
    description:
      "Modèle de lettre de relance loyer impayé gratuit. Mise en demeure conforme, téléchargement PDF instantané.",
    type: "website",
    url: "https://www.rentready.fr/modeles/relance-loyer-impaye",
    siteName: "RentReady",
    images: [
      {
        url: "https://www.rentready.fr/og-image.png",
        width: 1200,
        height: 630,
        alt: "RentReady — Modèle Relance Loyer Impayé",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modèle Relance Loyer Impayé — RentReady",
    description:
      "Modèle de lettre de relance loyer impayé gratuit. Mise en demeure conforme.",
    images: ["https://www.rentready.fr/og-image.png"],
  },
  alternates: {
    canonical: "https://www.rentready.fr/modeles/relance-loyer-impaye",
  },
};

const etapesRelance = [
  {
    etape: "1",
    titre: "Vérifier l'impayé",
    description:
      "Avant toute relance, vérifiez votre compte pour confirmer qu'il s'agit bien d'un impayé (pas un retard de virement, par exemple).",
  },
  {
    etape: "2",
    titre: "Envoyer une relance amiable",
    description:
      "Contactez le locataire par téléphone ou email pour comprendre la situation. Un retard ponctuel est souvent résolu rapidement.",
  },
  {
    etape: "3",
    titre: "Envoyer une lettre de rappel",
    description:
      "Si le retard persiste, envoyez un courrier (ou email) rappelant le montant dût et la date limite de règlement.",
  },
  {
    etape: "4",
    titre: "Délivrer une mise en demeure",
    description:
      "En cas de non-paiement prolongé, adressez une mise en demeure en recommandé avec accusé de réception.",
  },
];

const protectionsLocataire = [
  "Le locataire est protégé pendant la trêve hivernale (1er novembre - 31 mars) : aucune procédure de沙滩ement ne peut être engagée.",
  "En cas de surendettement, le locataire peut demander un délai de grâce au juge, ce qui suspend la procédure.",
  "Le bailleur ne peut pas couper l'eau, l'électricité ou le chauffage sous peine de sanctions pénales.",
  "Toute clause résolutoire doit respecter un délai de prévenance minimum de 30 jours avant application.",
];

const faqData = [
  {
    question:
      "À partir de combien de jours de retard peut-on envoyer une relance ?",
    answer:
      "techniquement, dès le jour où le loyer n'est pas payé à la date prévue dans le bail. En pratique, on attend généralement 5 à 10 jours pour laisser le temps à la transaction d'âtre traitée. Passé 30 jours, il est recommandé d'engager la procédure de relance formelle pour préserver vos droits.",
  },
  {
    question:
      "La mise en demeure doit-elle être envoyée en recommandé avec accusé de réception ?",
    answer:
      "Oui, la mise en demeure doit être adressée par lettre recommandée avec accusé de réception pour имеет юридическую силу. Elle constitue le point de départ du délai de 30 jours avant application de la clause résolutoire. Conservez une copie cachetée par La Poste.",
  },
  {
    question:
      "Que se passe-t-il après 2 mois d'impayé ?",
    answer:
      "après 2 mois d'impayé, le bailleur peut engager une procédure d'expulsion. Cela passe par l'activation de la clause résolutoire dans le bail, puis une assignation au tribunal. Attention : la trêve hivernale suspend toute procédure entre novembre et mars. Un délais de grâce peut aussi être accordé au locataire.",
  },
];

function RelanceLoyerJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Accueil", item: "https://www.rentready.fr/" },
          { "@type": "ListItem", position: 2, name: "Modèles", item: "https://www.rentready.fr/modeles" },
          { "@type": "ListItem", position: 3, name: "Relance loyer impayé", item: "https://www.rentready.fr/modeles/relance-loyer-impaye" },
        ],
      },
      {
        "@type": "HowTo",
        name: "Comment relancer un loyer impayé étape par étape",
        description:
          "Guide pour rédiger une lettre de relance loyer impayé et une mise en demeure conforme à la loi.",
        step: etapesRelance.map((item) => ({
          "@type": "HowToStep",
          name: item.titre,
          text: item.description,
        })),
        tool: {
          "@type": "SoftwareApplication",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "Article",
        name: "Modèle Relance Loyer Impayé — RentReady",
        description:
          "Modèle gratuit de lettre de relance loyer impayé et de mise en demeure. Téléchargement PDF instantané.",
        author: {
          "@type": "Organization",
          name: "RentReady",
          url: "https://www.rentready.fr",
        },
      },
      {
        "@type": "FAQPage",
        name: "FAQ — Modèle Relance Loyer Impayé",
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

export default function RelanceLoyerImpayePage() {
  return (
    <div className="min-h-screen bg-[#f8f7f4] font-[family-name:var(--font-sans)] antialiased">
      <RelanceLoyerJsonLd />

      <article className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Hero */}
        <header className="mb-16 text-center">
          <div className="inline-block rounded-lg bg-blue-100 px-4 py-1.5 text-sm font-medium text-blue-700 mb-4">
            Modèle gratuit — Téléchargement instantané
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
            Modèle Relance Loyer Impayé
            <br />
            <span className="text-blue-600">Gratuit et Conforme</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-stone-600">
            Télécharger notre modèle de lettre de relance loyer impayé gratuit.
            Relance amiable и mise en demeure, prêt à personnaliser et à envoyer
            en recommandé.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="inline-block rounded-lg bg-blue-600 px-8 py-3.5 font-medium text-white shadow transition-colors hover:bg-blue-700 w-full sm:w-auto"
            >
              Utiliser le modèle →
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
            Le problème des loyers impayés et l'importance de la documentation
          </h2>
          <p className="mb-4 text-stone-700">
            En France, environ <strong>2,5 % des loyers</strong> ne sont pas
            réglés dans les délais. Pour le bailleur, un impayé peut rapidement
            représenter plusieurs milliers d'euros. C'est pourquoi une réaction
            rapide и documentée est essentielle.
          </p>
          <p className="mb-4 text-stone-700">
            Chaque démarche doit être <strong>écrite et datée</strong> : emails,
            lettres, mises en demeure. Ces documents constituent vos preuves en
            cas de procédure judiciaire et démontrent votre bonne foi.
          </p>
          <p className="text-stone-700">
            Notre modèle vous permet de relancer efficacement tout en respectant
            le cadre légal, notamment la procédure de conciliation obligatoire
            avant toute沙滩ement.
          </p>
        </section>

        {/* Relance amiable */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Relance amiable : première étape
          </h2>
          <p className="mb-6 text-stone-600">
            La relance amiable est la première étape en cas de retard de paiement.
            Elle permet souvent de résoudre le problème sans procédure lourde.
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {etapesRelance.map((etape) => (
              <div
                key={etape.etape}
                className="rounded-xl border border-stone-200 bg-white p-6"
              >
                <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-600">
                  {etape.etape}
                </div>
                <h3 className="mb-2 text-base font-semibold text-stone-900">
                  {etape.titre}
                </h3>
                <p className="text-sm text-stone-600">{etape.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-xl border border-stone-200 bg-white p-6">
            <h3 className="mb-3 text-base font-semibold text-stone-900">
              Contenu d'une lettre de relance amiable
            </h3>
            <ul className="space-y-2 text-sm text-stone-700">
              <li>• Rappel du montant dû (loyer + charges)</li>
              <li>• Date d'échéance dépassée</li>
              <li>• Demande de règlement sous X jours (ex : 10 jours)</li>
              <li>• Rappel des conséquences du non-paiement</li>
              <li>• Canal de contact proposé (téléphone, email)</li>
            </ul>
          </div>
        </section>

        {/* Mise en demeure */}
        <section className="mb-16 rounded-2xl bg-blue-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Mise en demeure : l'avertissement formel
          </h2>
          <p className="mb-4 text-stone-700">
            La mise en demeure est le документ officiel qui marque le passage à
            une étape juridique serieuse. Elle doit contenir les éléments
            suivants pour avoir une valeur légale :
          </p>
          <ul className="mb-6 space-y-2 text-sm text-stone-700">
            <li>• <strong>Identité complète</strong> du bailleur et du locataire</li>
            <li>• <strong>Adresse du bien</strong> concerné</li>
            <li>• <strong>Montant exact</strong> de l'impayé (loyer + charges)</li>
            <li>• <strong>Période(s)</strong> concernée(s)</li>
            <li>• <strong>Deadline</strong> pour le règlement (minimum 30 jours)</li>
            <li>• <strong>Mention de la clause résolutoire</strong> du bail</li>
            <li>• <strong>Signature</strong> du bailleur</li>
          </ul>
          <div className="rounded-xl border border-red-200 bg-white p-4">
            <p className="text-sm font-medium text-red-700">
              ⚠️ Important : la mise en demeure doit être envoyée en
              <strong> recommandé avec accusé de réception</strong> pour avoir
              une valeur juridique. Conservez le récépissé cacheté.
            </p>
          </div>
        </section>

        {/* Template de lettre */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Modèle de lettre de relance loyer impayé
          </h2>
          <p className="mb-6 text-stone-700">
            Voici le modèle de lettre de relance que vous pouvez utiliser.
            Téléchargez la version PDF prête à personnaliser :
          </p>
          <div className="rounded-xl border border-stone-200 bg-stone-50 p-6 font-mono text-sm text-stone-800">
            <p className="mb-2 font-bold">[Votre nom et adresse]</p>
            <p className="mb-2">[Code postal, Ville]</p>
            <p className="mb-4 mt-4">[Nom du locataire]</p>
            <p className="mb-2">[Adresse du locataire]</p>
            <p className="mb-4 mt-4">
              <strong>Objet : Relance pour impayé de loyer —{' '}
              [Adresse du bien]</strong>
            </p>
            <p className="mb-4">
              Madame, Monsieur,
            </p>
            <p className="mb-4">
              Par la présente, je me permets de vous rappeler que le loyer du
              mois de [mois/année], d'un montant de [montant] EUR, n'a pas été
              réglé à ce jour.
            </p>
            <p className="mb-4">
              Je vous prie de bien vouloir effectuer le règlement dans un délai
              de <strong>10 jours</strong> à compter de la réception du présent
              courrier, par virement bancaire sur mon compte :
            </p>
            <p className="mb-2">Titulaire : [Votre nom]</p>
            <p className="mb-2">IBAN : [Votre IBAN]</p>
            <p className="mb-4">
              À défaut de règlement dans ce délai, je me verrai dans l'obligation
              d'engager les procédures prévues par le bail et la législation en
              vigueur, sans autre préavis.
            </p>
            <p className="mb-4">Dans l'attente de votre réponse, je vous prie d'agréer...</p>
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
              className="inline-block rounded-lg border border-stone-300 bg-white px-6 py-3 font-medium text-stone-700 shadow-sm transition-colors hover:bg-stone-50"
            >
              Utiliser avec RentReady →
            </Link>
          </div>
        </section>

        {/* Procédure impayé persistant */}
        <section className="mb-16 rounded-2xl border border-stone-200 bg-white p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            Procédure en cas d'impayé persistant
          </h2>
          <p className="mb-6 text-stone-700">
            Si le locataire ne sempre pas malgré la mise en demeure, voici la
            procédure à suivre :
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-4 rounded-xl border border-stone-200 p-5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
                1
              </div>
              <div>
                <h3 className="mb-1 text-base font-semibold text-stone-900">
                  Courrier en recommandé avec AR
                </h3>
                <p className="text-sm text-stone-600">
                  Envoyez la mise en demeure. C'est le point de départ du délai
                  de grâce de 30 jours.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-stone-200 p-5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
                2
              </div>
              <div>
                <h3 className="mb-1 text-base font-semibold text-stone-900">
                  Assignation au tribunal judiciaire
                </h3>
                <p className="text-sm text-stone-600">
                  Passé le délai de 30 jours, saisissez le tribunal pour faire
                  constat de l'inexécution du bail.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 rounded-xl border border-stone-200 p-5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-bold text-red-700">
                3
              </div>
              <div>
                <h3 className="mb-1 text-base font-semibold text-stone-900">
                  Procédure d'expulsion
                </h3>
                <p className="text-sm text-stone-600">
                  Obtention d'une décision judiciaire, puis intervention d'un
                  huissier pour l'expulsion. Possible uniquement hors trêve
                  hivernale.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Protections locataire */}
        <section className="mb-16 rounded-2xl border border-amber-200 bg-amber-50 p-8 sm:p-10">
          <h2 className="mb-4 text-xl font-bold text-stone-900">
            🛡️ Protections du locataire à connaître
          </h2>
          <p className="mb-6 text-stone-700">
            En tant que bailleur, vous devez connaître les protections légales
            dont bénéficie le locataire. Elles limitent vos possibilités d'action :
          </p>
          <ul className="space-y-3">
            {protectionsLocataire.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-stone-700">
                <span className="text-amber-600">ℹ️</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-stone-600">
            💡 Ces protections ne dispensent pas le locataire de payer son
            loyer. Elles visent à encadrer la procédure pour éviter les abus.
          </p>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes sur les loyers impayés
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
            Gérez vos relances automatiquement
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-stone-300">
            RentReady détecte automatiquement les impayés et génère les lettres
            de relance. workflow complet, archivage légal.
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
