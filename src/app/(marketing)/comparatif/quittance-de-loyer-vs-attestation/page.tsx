import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "Quittance de loyer vs attestation de paiement — Quelle différence en 2026 ?",
    description:
      "La quittance de loyer est-elle obligatoire ? L'attestation de paiement suffit-elle ? Décryptage juridique et pratique pour les propriétaires et locataires français.",
    url: "/comparatif/quittance-de-loyer-vs-attestation",
    ogType: "website",
  });
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "Quittance de loyer vs attestation de paiement",
  mainEntity: [
    {
      "@type": "Question",
      name: "La quittance de loyer est-elle obligatoire en France ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, depuis la loi du 6 juillet 1989 (article 21), le bailleur est dans l'obligation de délivrer une quittance de loyer dans le mois qui suit le paiement intégral du loyer, sur simple demande du locataire. Le locataire peut demander une quittance à tout moment. Le refus du bailleur est sanctionnable.",
      },
    },
    {
      "@type": "Question",
      name: "Une attestation de paiement peut-elle remplacer une quittance ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Non. L'attestation de paiement indique qu'un paiement a été reçu mais ne contient pas toutes les mentions obligatoires (montant du loyer, provisions pour charges, date, signature). Elle ne vaut pas quittance au sens de la loi et ne protège pas le bailleur en cas de litige.",
      },
    },
    {
      "@type": "Question",
      name: "Que doit contenir une quittance de loyer légale ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Une quittance doit indiquer : le nom et adresse du bailleur, le nom du locataire, l'adresse du logement, la période de paiement, le montant total versé (loyer + charges), la date du paiement, la signature du bailleur. En zone tendue, elle doit aussi indiquer le montant du loyer de référence et le cas échéant le dépassement.",
      },
    },
    {
      "@type": "Question",
      name: "Peut-on envoyer une quittance de loyer par email ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, depuis la loi du 17 décembre 2014, la quittance peut être transmise par voie électronique (email, espace locataire) si le locataire ne s'y oppose pas. Elle a la même valeur juridique qu'une quittance papier.",
      },
    },
    {
      "@type": "Question",
      name: "Comment obtenir une quittance de loyer gratuite ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RentReady génère automatiquement des quittances légales gratuites. Le bailleur saisit les informations du bail une fois, et chaque paiement déclenche une quittance PDF conforme à la loi de 1989, prête à envoyer au locataire.",
      },
    },
  ],
};

const comparison = [
  {
    feature: "Mention légale obligatoire",
    quittance: true,
    attestation: false,
    detail: "Seule la quittance répond à l'obligation légale",
  },
  {
    feature: "Montant détaillé (loyer + charges)",
    quittance: true,
    attestation: false,
    detail: "L'attestation ne détaille pas toujours le solde",
  },
  {
    feature: "Période de paiement",
    quittance: true,
    attestation: "Parfois",
    detail: "Dépend du modèle utilisé",
  },
  {
    feature: "Signature du bailleur",
    quittance: true,
    attestation: "Rarement",
    detail: "Pas toujours présente sur une attestation",
  },
  {
    feature: "Valeur juridique en cas de litige",
    quittance: true,
    attestation: false,
    detail: "Preuve recevable devant le tribunal",
  },
  {
    feature: "Exigible par le locataire",
    quittance: true,
    attestation: false,
    detail: "Le locataire a droit à une quittance sur demande",
  },
  {
    feature: "Compatible zone tendue (encadrement)",
    quittance: true,
    attestation: false,
    detail: "La quittance indique les plafonds de loyer",
  },
  {
    feature: "Génération automatique",
    quittance: true,
    attestation: false,
    detail: "Les outils comme RentReady automatisent la quittance",
  },
];

export default function QuittanceVsAttestation() {
  return (
    <>
      <SchemaMarkup data={faqSchema} />
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Comparatifs", href: "/comparatif" },
          { label: "Quittance vs attestation", href: "/comparatif/quittance-de-loyer-vs-attestation", isCurrentPage: true },
        ]}
      />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Header */}
        <header className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-blue-600 uppercase">
            Comparatif — Documents locatifs
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Quittance de loyer vs attestation de paiement
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            Beaucoup de bailleurs confondent quittance et attestation. Retour sur les obligations
            légales, les différences pratiques, et pourquoi seule la quittance vous protège.
          </p>
        </header>

        {/* Legal reminder */}
        <div className="mb-12 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-6">
          <p className="font-semibold text-blue-900">Rappel légal</p>
          <p className="mt-1 text-sm text-blue-800">
            Selon l'article 21 de la loi du 6 juillet 1989, le bailleur doit fournir une{' '}
            <strong>quittance</strong> dans le mois suivant le paiement intégral du loyer, sur
            simple demande du locataire. L'attestation de paiement ne remplace pas la quittance.
          </p>
        </div>

        {/* Comparison table */}
        <section className="mb-16 overflow-x-auto">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Comparaison des deux documents
          </h2>
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-stone-200 text-left">
                <th className="py-3 pr-4 font-semibold text-stone-900">Critère</th>
                <th className="py-3 px-4 text-center font-semibold text-green-700">Quittance ✓</th>
                <th className="py-3 px-4 text-center font-semibold text-stone-500">Attestation ✗</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {comparison.map((row) => (
                <tr key={row.feature} className="hover:bg-stone-50">
                  <td className="py-3 pr-4 font-medium text-stone-700">{row.feature}</td>
                  <td className="py-3 px-4 text-center">
                    {row.quittance === true ? (
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    ) : row.quittance === false ? (
                      <X className="mx-auto h-5 w-5 text-stone-300" />
                    ) : (
                      <span className="text-xs text-stone-500">{row.quittance}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.attestation === true ? (
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    ) : row.attestation === false ? (
                      <X className="mx-auto h-5 w-5 text-red-400" />
                    ) : (
                      <span className="text-xs text-stone-500">{row.attestation}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-xs text-stone-400 text-center">
            ✓ Oui &nbsp; ✗ Non
          </p>
        </section>

        {/* Deep dive sections */}
        <section className="mb-16 grid gap-8 sm:grid-cols-2">
          <div className="rounded-xl border border-green-200 bg-green-50 p-6">
            <h3 className="text-lg font-bold text-green-900">La quittance de loyer</h3>
            <p className="mt-2 text-sm text-green-800 leading-relaxed">
              Document officiel qui prouve le paiement intégral du loyer. Elle est{' '}
              <strong>obligatoire</strong> sur demande du locataire et doit contenir les mentions
              légales. Elle est opposable en justice et constitue la meilleure preuve en cas de
              litige sur les paiements.
            </p>
            <p className="mt-3 text-sm text-green-700">
              ⇒ Obligatoire selon l'article 21 de la loi de 1989
            </p>
          </div>
          <div className="rounded-xl border border-stone-200 bg-white p-6">
            <h3 className="text-lg font-bold text-stone-700">L'attestation de paiement</h3>
            <p className="mt-2 text-sm text-stone-600 leading-relaxed">
              Document informel parfois remis après un paiement. Elle n'a <strong>pas de valeur
              légale</strong> au sens de la loi de 1989 et ne remplace pas la quittance. Utile comme
              reçu interne mais insuffisante en cas de litige.
            </p>
            <p className="mt-3 text-sm text-stone-500">
              ⇒ Ne répond pas à l'obligation légale de quittance
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16 bg-[#f8f7f4] rounded-2xl p-8">
          <h2 className="mb-6 text-2xl font-bold text-stone-900">
            Questions fréquentes
          </h2>
          <div className="divide-y divide-stone-200">
            {faqSchema.mainEntity.map((faq) => (
              <details key={faq.name} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between font-medium text-stone-900">
                  {faq.name}
                  <span className="ml-4 shrink-0 text-stone-400 transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-stone-600 leading-relaxed">
                  {faq.acceptedAnswer.text}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl bg-stone-900 px-6 py-14 text-center text-white shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Générez des quittances légales automatiquement
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-stone-300">
            Avec RentReady, chaque paiement déclenche une quittance PDF conforme à la loi de 1989.
            Plus besoin de se poser la question — tout est automatique.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            Créer mon compte gratuitement →
          </Link>
        </section>
      </main>
    </>
  );
}
