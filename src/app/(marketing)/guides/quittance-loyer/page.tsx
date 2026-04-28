import type { Metadata } from "next";
export const revalidate = 604800;

import Link from "next/link";
import { ArrowRight, FileText, Download } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title:
      "Comment Faire une Quittance de Loyer 2026 — Guide & Modèle Gratuit | RentReady",
    description:
      "Guide complet : comment faire une quittance de loyer, mentions obligatoires, modèle gratuit à télécharger. Obligatoire sur simple demande du locataire.",
    url: "/guides/quittance-loyer",
    ogType: "website",
  });
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Comment rédiger et délivrer une quittance de loyer",
  description:
    "Guide complet : mentions obligatoires d'une quittance de loyer, obligation légale, timing de délivrance, provisions vs forfait charges, et automatisation.",
  step: [
    {
      "@type": "HowToStep",
      name: "Comprendre l'obligation légale de délivrer une quittance",
      text: "Depuis la loi du 6 juillet 1989, le bailleur est tenu de délivrer une quittance de loyer dans le mois suivant la demande écrite du locataire — gratuitement. La quittance prouve le paiement et protège locataire et bailleur.",
    },
    {
      "@type": "HowToStep",
      name: "Inclure toutes les mentions obligatoires",
      text: "Une quittance doit contenir : nom et adresse du bailleur, nom et adresse du locataire, adresse du bien loué, période de location, montant du loyer principal et date de réglement, montant des charges et mode de réglement, mode de paiement utilisé, et signature du bailleur.",
    },
    {
      "@type": "HowToStep",
      name: "Délivrer la quittance à chaque paiement intégral",
      text: "La quittance doit être délivrée à chaque paiement intégral du loyer et des charges. En cas de paiement partiel, délivrez un reçu mentionnant le montant payé et le solde restant dû plutôt qu'une quittance.",
    },
    {
      "@type": "HowToStep",
      name: "Choisir entre provisions et forfait pour les charges",
      text: "Provisions pour charges : acompte mensuel régularisé annuellement selon les dépenses réelles. Forfait de charges : montant fixe non régularisable, possible uniquement si le bail le prévoit expressément pour certains types de logement.",
    },
    {
      "@type": "HowToStep",
      name: "Automatiser la génération des quittances",
      text: "Utilisez un outil de gestion locative pour générer automatiquement les quittances à chaque paiement enregistré. Envoyez-les directement par email au locataire ou téléchargez-les en PDF. Évitez les erreurs de calcul et les oublis.",
    },
  ],
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "La quittance de loyer est-elle obligatoire ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, depuis la loi du 6 juillet 1989, le bailleur est tenu de délivrer une quittance de loyer dans le mois suivant la demande écrite du locataire — gratuitement. La quittance doit être délivrée à chaque paiement intégral du loyer et des charges.",
      },
    },
    {
      "@type": "Question",
      name: "Quelles sont les mentions obligatoires sur une quittance de loyer ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Une quittance doit contenir : nom et adresse du bailleur, nom et adresse du locataire, adresse du bien loué, période de location couverte, montant du loyer principal et date de réglement, montant des charges et mode de réglement, mode de paiement utilisé (virement, chèque, espèces...), et signature du bailleur.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on facturer des frais pour délivrer une quittance ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non, la délivrance d'une quittance de loyer est gratuite. Le bailleur ne peut pas facturer de frais pour la'édition ou l'envoi de la quittance, que ce soit sur papier ou par email.",
      },
    },
    {
      "@type": "Question",
      name: "Quittance ou reçu : quelle différence ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La quittance est délivrée lors d'un paiement intégral du loyer et des charges. Le reçu est remis en cas de paiement partiel : il mentionne le montant réellement payé et le solde restant dû. Les deux documents ont valeur probante.",
      },
    },
    {
      "@type": "Question",
      name: "Provisions pour charges ou forfait de charges : que choisir ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les provisions pour charges (acompte mensuel régularisé annuellement) sont le régime le plus courant. Le forfait de charges (montant fixe non régularisable) n'est possible que si le bail le prévoit expressément et concerne certains types de logement.",
      },
    },
    {
      "@type": "Question",
      name: "Comment envoyer une quittance de loyer ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La quittance peut être envoyée par email (avec accord du locataire) ou remise sur papier. Il est recommandé de la transmettre par email car elle est instantanément accessible et archivable. Conservez toujours une copie de la quittance envoyée.",
      },
    },
  ],
};

export default function QuittanceLoyerGuidePage() {
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
          <span>Comment faire une quittance de loyer</span>
        </nav>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
          Guide gratuit
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Comment faire une quittance de loyer
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          La quittance de loyer est obligatoire sur simple demande du locataire. Découvrez
          les mentions obligatoires, les bons réflexes, et télécharger notre modèle
          gratuit.
        </p>
      </header>

      {/* Download CTA */}
      <div className="mb-12 rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-white p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Modèle de quittance de loyer gratuit
            </h2>
            <p className="mt-1 text-stone-600">
              Quittance conforme avec toutes les mentions obligatoires — à imprimer et signer.
            </p>
          </div>
          <Link
            href="/templates/recu-loyer"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Download className="size-4" />
            Télécharger le modèle
          </Link>
        </div>
      </div>

      <div className="prose prose-stone max-w-none">
        <h2>Quittance de loyer : définition et obligation légale</h2>
        <p>
          La quittance de loyer est le document qui prouve le paiement du loyer par le
          locataire au bailleur. Depuis la loi du 6 juillet 1989, le bailleur est{' '}
          <strong>tenu de délivrer une quittance</strong> dans le mois suivant la demande
          écrite du locataire — et ce, gratuitement.
        </p>
        <p>
          Environ 2 à 3 % des locations en France génèrent des litiges liés au paiement
          du loyer. La quittance constitue la preuve irréfutable du paiement et protège
          aussi bien le locataire que le bailleur.
        </p>

        <h2>Mentions obligatoires sur une quittance</h2>
        <p>
          Une quittance mal rédigée peut être contestée. Assurez-vous d&apos;inclure
          systématiquement les éléments suivants :
        </p>
        <ul>
          <li><strong>Nom et adresse du bailleur</strong> (ou du gestionnaire mandataire)</li>
          <li><strong>Nom et adresse du locataire</strong></li>
          <li><strong>Adresse du bien loué</strong></li>
          <li><strong>Période de location</strong> couverte par le paiement</li>
          <li><strong>Montant du loyer principal</strong> et sa date de réglement</li>
          <li><strong>Montant des charges</strong> et leur mode de réglement (provisions ou forfait)</li>
          <li><strong>Mode de paiement utilisé</strong> (virement, chèque, espèces, etc.)</li>
          <li><strong>Signature du bailleur</strong> ou de son représentant</li>
        </ul>

        <h2>Quand faut-il délivrer une quittance ?</h2>
        <p>
          La quittance doit être délivrée à chaque paiement intégral du loyer et des
          charges. Même en cas de paiement en plusieurs fois dans le mois, une quittance
          unique peut couvrir l&apos;ensemble du mois.
        </p>
        <p>
          Si le locataire paie partiellement, on parle d&apos;un <em>reçu</em> plutôt que
          d&apos;une quittance. Le reçu mentionne alors le montant réellement payé et le
          solde restant dû.
        </p>

        <h2>Charges locatives : provisions ou forfait ?</h2>
        <p>
          Le bailleur peut choisir entre deux régimes pour les charges :
        </p>
        <ul>
          <li><strong>Provisions pour charges</strong> — le locataire paie un acompte mensuel, régularisé annuellement selon les dépenses réelles. Ce régime exige une utilité annuelle.</li>
          <li><strong>Forfait de charges</strong> — un montant fixe, non subjectable à régularisation. Possible uniquement si le bail le prévoit expressément et pour certains types de logement (petites surfaces, charges non individualisables).</li>
        </ul>

        <h2>Comment automatiser</h2>
        <p>
          With RentReady, les quittances sont générées automatiquement à chaque paiement
          enregistré. Vous pouvez les envoyer directement au locataire par email ou les
          télécharger en PDF. Fini les erreurs de calcul et les oublis.
        </p>
      </div>

      {/* FAQ Section */}
      <section className="mt-16 rounded-2xl border border-stone-200/60 bg-white p-8">
        <h2 className="mb-6 text-2xl font-bold text-stone-900">Questions fréquentes sur la quittance de loyer</h2>
        <div className="space-y-4">
          {[
            {
              q: "La quittance de loyer est-elle obligatoire ?",
              a: "Oui, depuis la loi du 6 juillet 1989, le bailleur est tenu de délivrer une quittance de loyer dans le mois suivant la demande écrite du locataire — gratuitement. La quittance doit être délivrée à chaque paiement intégral du loyer et des charges.",
            },
            {
              q: "Quelles sont les mentions obligatoires sur une quittance de loyer ?",
              a: "Une quittance doit contenir : nom et adresse du bailleur, nom et adresse du locataire, adresse du bien loué, période de location couverte, montant du loyer principal et date de réglement, montant des charges et mode de réglement, mode de paiement utilisé, et signature du bailleur.",
            },
            {
              q: "Peut-on facturer des frais pour délivrer une quittance ?",
              a: "Non, la délivrance d'une quittance de loyer est gratuite. Le bailleur ne peut pas facturer de frais pour l'édition ou l'envoi de la quittance, que ce soit sur papier ou par email.",
            },
            {
              q: "Quittance ou reçu : quelle différence ?",
              a: "La quittance est délivrée lors d'un paiement intégral du loyer et des charges. Le reçu est remis en cas de paiement partiel : il mentionne le montant réellement payé et le solde restant dû. Les deux documents ont valeur probante.",
            },
            {
              q: "Provisions pour charges ou forfait de charges : que choisir ?",
              a: "Les provisions pour charges (acompte mensuel régularisé annuellement) sont le régime le plus courant. Le forfait de charges (montant fixe non régularisable) n'est possible que si le bail le prévoit expressément et concerne certains types de logement.",
            },
            {
              q: "Comment envoyer une quittance de loyer ?",
              a: "La quittance peut être envoyée par email (avec accord du locataire) ou remise sur papier. Il est recommandé de la transmettre par email car elle est instantanément accessible et archivable. Conservez toujours une copie.",
            },
          ].map((item, i) => (
            <details key={i} className="group rounded-lg border border-stone-200 bg-stone-50 open:bg-white">
              <summary className="flex cursor-pointer items-center justify-between gap-4 p-4 font-medium text-stone-900 hover:text-blue-600">
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
          Générez vos quittances automatiquement
        </h2>
        <p className="mx-auto mb-6 max-w-md text-stone-600">
          With RentReady, créez des quittances en 2 clics. Archivage automatique,
          envoi email au locataire, historique intact.
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
            href="/templates/recu-loyer"
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
