import type { Metadata } from "next";
export const revalidate = 604800;

import Link from "next/link";
import { ArrowRight, FileText, Download } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title:
      "Lettre Relance Loyer Impayé 2026 — Modèle Gratuit & Guide | RentReady",
    description:
      "Modèle de lettre de relance pour loyers impayés à télécharger. Modèle gratuit, personnalisable, à envoyer en recommandé. Procédure et délais.",
    url: "/guides/relance-loyer",
    ogType: "website",
  });
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment recouvrer un loyer impayé étape par étape",
  description:
    "Procédure légale complète pour recouvrer un loyer impayé : relance, mise en demeure, délai, preuves à conserver et assignation au tribunal.",
  step: [
    {
      "@type": "HowToStep",
      name: "Constater l'impayé et envoyer une relance simple",
      text: "Le lendemain de la date d'échéance, vérifiez si le virement a bien été effectué. N'attendez pas au-delà du 5 du mois. Envoyez un email ou un courrier simple rappelant l'échéance et les coordonnées pour effectuer le réglement.",
    },
    {
      "@type": "HowToStep",
      name: "Envoyer une mise en demeure par LRAR",
      text: "Entre J+8 et J+15, envoyez une lettre de mise en demeure en recommandé avec accusé de réception. Mentionnez le montant dû, le délai de réglement (8 jours) et les conséquences (procédure judiciaire, expulsion).",
    },
    {
      "@type": "HowToStep",
      name: "Rédiger une lettre de relance complète",
      text: "La lettre doit contenir : identification du bailleur et du locataire, références du bail (date, durée, montant), montant total dû avec détail (loyer + charges), période concernée, délai de réglement, et mention des conséquences juridiques.",
    },
    {
      "@type": "HowToStep",
      name: "Constituer un dossier de preuves",
      text: "Conservez les relevés bancaires montrant l'absence de virement, les échanges d'emails ou SMS avec le locataire, la copie de la lettre de relance avec l'accusé de réception, et les attestations écrites si le locataire reconnaît l'impayé.",
    },
    {
      "@type": "HowToStep",
      name: "Assigner le locataire au tribunal si l'impayé persiste",
      text: "Si l'impayé persiste après 2 mois, vous pouvez assigner le locataire devant le tribunal judiciaire. Si le tribunal vous donne raison, faites signifier un commandement de quitter les lieux par un huissier.",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Combien de temps après la date d'échéance peut-on relancer un loyer impayé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La relance simple (email ou courrier) peut être envoyée dès le lendemain de la date d'échéance. Il est recommandé de ne pas attendre au-delà du 5 du mois. Entre J+8 et J+15, envoyez une mise en demeure en recommandé avec accusé de réception (LRAR).",
      },
    },
    {
      "@type": "Question",
      name: "Que doit contenir une lettre de mise en demeure pour loyer impayé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La lettre doit mentionner : l'identification complète du bailleur et du locataire, les références du bail (date, durée, montant du loyer), le montant total dû avec le détail (loyer HT, charges, taxes), la période concernée, le délai de réglement imparti (généralement 8 jours), et les conséquences juridiques en cas de non-paiement (procédure judiciaire, expulsion).",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on expulser un locataire pour un seul mois de loyer impayé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, un seul mois de loyer impayé suffit pour engager une procédure d'expulsion. Toutefois, la procédure est longue (plusieurs mois) et nécessite une décision de justice. Il est essentiel de constituer un dossier de preuves solide et de respecter chaque étape légale.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles preuves conserver en cas d'impayé ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Conservez absolument : les relevés bancaires attestant de l'absence de virement, tous les échanges d'emails ou SMS avec le locataire, la copie de la lettre de relance avec l'accusé de réception, et toute attestation écrite où le locataire reconnaîtrait l'impayé.",
      },
    },
    {
      "@type": "Question",
      name: "La Garantie Loyers Impayés (GLI) est-elle obligatoire ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non, la GLI n'est pas obligatoire mais elle est fortement recommandée. Elle rembourse les loyers impayés (dans la limite du plafond contractuel) et peut prendre en charge les frais de procédure. Le coût varie entre 2 % et 4 % du montant annuel du loyer charges comprises.",
      },
    },
    {
      "@type": "Question",
      name: "Que se passe-t-il si le tribunal donne raison au bailleur ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Si le tribunal judiciaire donne raison au bailleur, il peut soit résilier le bail et ordonner l'expulsion, soit simplement condamner le locataire à payer les sommes dues. En cas de résiliation, un commandement de quitter les lieux doit être signifié par un huissier avant toute expulsion.",
      },
    },
  ],
};

export default function RelanceLoyerGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mb-12">
        <nav className="mb-6 text-sm text-stone-500">
          <Link href="/" className="hover:text-stone-700">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/guides" className="hover:text-stone-700">Guides pratiques</Link>
          <span className="mx-2">›</span>
          <span>Lettre de relance pour loyer impayé</span>
        </nav>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
          Guide gratuit
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Lettre de relance pour loyer impayé
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Face à un loyer impayé, la relance écrite est la première étape.
          Téléchargez notre modèle gratuit, comprenez la procédure et les délais
          légaux.
        </p>
      </header>

      {/* Download CTA */}
      <div className="mb-12 rounded-2xl border border-red-200/60 bg-gradient-to-br from-red-50 to-white p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Modèle de lettre de relance impayé
            </h2>
            <p className="mt-1 text-stone-600">
              Téléchargez notre modèle gratuit — personnalisez-le et envoyez-le en
              recommandé avec accusé de réception.
            </p>
          </div>
          <Link
            href="/templates/relance-loyer-impaye"
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            <Download className="size-4" />
            Télécharger le modèle
          </Link>
        </div>
      </div>

      <div className="prose prose-stone max-w-none">
        <h2>La procédure de recouvrement d&apos;un loyer impayé</h2>
        <p>
          Environ 2 à 3 % des locations génèrent un impayé chaque année en France.
          La procédure de recouvrement est строго réglementée. Voici les étapes
          légales et les délais à respecter :
        </p>

        <div className="not-prose my-6 space-y-3">
          {[
            { day: "J+1", step: "Constatation de l&apos;impayé", desc: "Le lendemain de la date d&apos;échéance, vérifiez si le virement a bien été effectué. Ne wait pas au-delà du 5 du mois." },
            { day: "J+3", step: "Relance simple", desc: "Envoyez un email ou un courrier simple rappelant l&apos;échéance et les coordonnées pour effectuer le réglement." },
            { day: "J+8 à 15", step: "Mise en demeure (LRAR)", desc: "Envoyez une lettre de mise en demeure en recommandé avec accusé de réception. Mentionnez le montant dû, le délai de réglement (8 jours) et les conséquences." },
            { day: "J+2 mois", step: "Assignation au tribunal", desc: "Si l&apos;impayé persiste après 2 mois, vous pouvez assigner le locataire devant le tribunal judiciaire." },
            { day: "Post-judgment", step: "Commandement de quitter les lieux", desc: "Si le tribunal vous donne raison, faites signifier un commandement de quitter les lieux par un huissier." },
          ].map((item) => (
            <div key={item.day} className="flex gap-4 rounded-lg border border-stone-200 bg-white p-4">
              <div className="shrink-0 rounded-lg bg-stone-100 px-3 py-1 text-center text-xs font-bold text-stone-600">
                {item.day}
              </div>
              <div>
                <h3 className="font-semibold text-stone-900">{item.step}</h3>
                <p className="text-sm text-stone-600">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2>Que mettre dans une lettre de relance ?</h2>
        <p>
          La lettre de relance doit être claire, factuelle et firmum. Elle doit contenir :
        </p>
        <ul>
          <li><strong>L&apos;identification du bailleur</strong> — nom, adresse, références du bien</li>
          <li><strong>L&apos;identification du locataire</strong> — nom, adresse du bien loué</li>
          <li><strong>Références du bail</strong> — date de signature, durée, montant du loyer</li>
          <li><strong>Montant de l&apos;impayé</strong> — montant total dû avec le détail (loyer + charges)</li>
          <li><strong>Période concernée</strong> — mois(s) de l&apos;impayé</li>
          <li><strong>Délai de réglement</strong> — généralement 8 jours par LRAR</li>
          <li><strong>Conséquences en cas de non-paiement</strong> — mention de la procédure judiciaire et de l&apos;expulsion</li>
        </ul>

        <h2>Comment prouver l&apos;impayé ?</h2>
        <p>
          Conservez absolument toutes les preuves du non-paiement :
        </p>
        <ul>
          <li>Relevés bancaires montrant l&apos;absence de virement</li>
          <li>Échanges d&apos;emails ou de SMS avec le locataire</li>
          <li>Copie de la lettre de relance (gardez le accusé de réception)</li>
          <li>Attestations écrites de proches si le locataire reconnaît l&apos;impayé</li>
        </ul>

        <h2>La Garantie Loyers Impayés (GLI)</h2>
        <p>
          Souscrire une GLI (Garantie Loyers Impayés) vous protège contre les défaillances
          de paiement. La GLI rembourse les loyers impayés (dans la limite du plafond
          contractuel) et peut prendre en charge les frais de procédure. Le coût varie
          entre 2 % et 4 % du montant annuel du loyer.
        </p>
      </div>

      {/* FAQ Section */}
      <section className="mt-16 rounded-2xl border border-stone-200/60 bg-white p-8">
        <h2 className="mb-6 text-2xl font-bold text-stone-900">Questions fréquentes sur la relance de loyer impayé</h2>
        <div className="space-y-4">
          {[
            {
              q: "Combien de temps après la date d'échéance peut-on relancer un loyer impayé ?",
              a: "La relance simple (email ou courrier) peut être envoyée dès le lendemain de la date d'échéance. Il est recommandé de ne pas attendre au-delà du 5 du mois. Entre J+8 et J+15, envoyez une mise en demeure en LRAR.",
            },
            {
              q: "Que doit contenir une lettre de mise en demeure pour loyer impayé ?",
              a: "La lettre doit mentionner : identification complète du bailleur et du locataire, références du bail, montant total dû avec le détail, période concernée, délai de réglement (8 jours), et conséquences juridiques en cas de non-paiement.",
            },
            {
              q: "Peut-on expulser un locataire pour un seul mois de loyer impayé ?",
              a: "Oui, un seul mois de loyer impayé suffit pour engager une procédure d'expulsion. La procédure est toutefois longue (plusieurs mois) et nécessite une décision de justice.",
            },
            {
              q: "Quelles preuves conserver en cas d'impayé ?",
              a: "Conservez : relevés bancaires attestant de l'absence de virement, échanges d'emails ou SMS avec le locataire, copie de la lettre de relance avec accusé de réception, et toute attestation écrite reconnaissant l'impayé.",
            },
            {
              q: "La Garantie Loyers Impayés (GLI) est-elle obligatoire ?",
              a: "Non, la GLI n'est pas obligatoire mais elle est fortement recommandée. Elle rembourse les loyers impayés et peut prendre en charge les frais de procédure. Le coût varie entre 2 % et 4 % du montant annuel du loyer.",
            },
            {
              q: "Que se passe-t-il si le tribunal donne raison au bailleur ?",
              a: "Le tribunal peut résilier le bail et ordonner l'expulsion, ou simplement condamner le locataire à payer. En cas de résiliation, un commandement de quitter les lieux doit être signifié par un huissier avant toute expulsion.",
            },
          ].map((item, i) => (
            <details key={i} className="group rounded-lg border border-stone-200 bg-stone-50 open:bg-white">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 font-medium text-stone-900 hover:text-red-600">
                {item.q}
                <span className="shrink-0 text-stone-400 transition-transform group-open:rotate-180">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="border-t border-stone-200 p-4 text-stone-600">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      <div className="mt-12 rounded-xl border border-stone-200/60 bg-stone-50 p-8 text-center">
        <h2 className="mb-3 text-xl font-bold text-stone-900">
          Protégez-vous contre les impayés
        </h2>
        <p className="mx-auto mb-6 max-w-md text-stone-600">
          With RentReady, détectez les retards de paiement en temps réel et lancez la
          procédure de recouvrement avant qu&apos;il ne soit trop tard.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Essai gratuit 14 jours
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/templates/relance-loyer-impaye"
            className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition-colors hover:bg-stone-50"
          >
            <FileText className="size-4" />
            Modèle gratuit
          </Link>
        </div>
      </div>
    </article>
    </>
  );
}
