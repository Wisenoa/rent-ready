import type { Metadata } from "next";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { Breadcrumb } from "@/components/seo/Breadcrumb";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "Bail électronique vs bail papier : lequel choisir en 2026 ?",
    description:
      "Le bail de location peut être signé numérique ou sur papier. Comparatif juridique, avantages pratiques, valeur probante et coût — tout pour choisir sereinement.",
    url: "/comparatif/bail-electronique-vs-papier",
    ogType: "website",
  });
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  name: "Bail électronique vs bail papier",
  mainEntity: [
    {
      "@type": "Question",
      name: "Le bail électronique a-t-il la même valeur juridique qu'un bail papier ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui, depuis l'ordonnance du 16 novembre 2017 et son décret d'application, le bail d'habitation peut être conclu et signé par voie électronique (e-signature) avec la même valeur probante qu'un contrat sur support papier. Les deux sont opposables devant les tribunaux.",
      },
    },
    {
      "@type": "Question",
      name: "Comment signer un bail de location électronique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Le bail électronique utilise un prestataire de signature électronique certifié (comme Yousign, DocuSign). Le processus : le bailleur prépare le bail, envoie un lien au locataire par email, le locataire signe en ligne avec un code ou une authentification. Chaque signataire reçoit une copie.",
      },
    },
    {
      "@type": "Question",
      name: "Le locataire peut-il refuser de signer le bail par voie électronique ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. Le locataire a le droit de refuser la signature électronique. Le bailleur doit alors fournir une version papier. Ce refus ne peut pas être un motif de non-conclusion du bail.",
      },
    },
    {
      "@type": "Question",
      name: "Faut-il conserver le bail électronique comme un bail papier ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oui. L'obligation de conservation de 3 ans (durée de prescription pour les actions relatives au bail) s'applique aussi au bail électronique. Le bailleur doit s'assurer que le fichier numérique (PDF avec preuve de signature) est stocké de manière sûre et accessible pendant cette durée.",
      },
    },
    {
      "@type": "Question",
      name: "Le bail électronique coûte-t-il plus cher ?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Les coûts varient. Avec RentReady, la signature électronique est incluse dans l'abonnement. Les prestataires spécialisés (Yousign, DocuSign) facturent généralement entre 1 € et 3 € par signature. Le gain en temps et en organisation compense largement ce coût.",
      },
    },
  ],
};

const comparison = [
  {
    feature: "Valeur juridique légale",
    electronic: true,
    paper: true,
    note: "Identique depuis l'ordonnance de 2017",
  },
  {
    feature: "Opposable devant le tribunal",
    electronic: true,
    paper: true,
    note: "Les deux font foi en cas de litige",
  },
  {
    feature: "Conservation 3 ans minimum",
    electronic: true,
    paper: false,
    note: "Le papier se détériore ; le PDF se copie",
  },
  {
    feature: "Envoi instantané à distance",
    electronic: true,
    paper: false,
    note: "Pas besoin de rendez-vous pour signer",
  },
  {
    feature: "Pas de frais d'impression/affranchissement",
    electronic: true,
    paper: false,
    note: "Économie de temps et d'argent",
  },
  {
    feature: "Droit du locataire de refuser",
    electronic: true,
    paper: true,
    note: "Le locataire peut exiger le format papier",
  },
  {
    feature: "Preuve de signaturehorodatée",
    electronic: true,
    paper: false,
    note: "Horodatage certifié : aucun contest possible",
  },
  {
    feature: "Accès rapide en cas de litige",
    electronic: true,
    paper: false,
    note: "Recherche instantanée vs archive physique",
  },
  {
    feature: "Intégration gestion locative",
    electronic: true,
    paper: false,
    note: "Automatisation quittances, relances, alertes",
  },
];

export default function BailElectroniqueVsPapier() {
  return (
    <>
      <SchemaMarkup data={faqSchema} />
      <Breadcrumb
        items={[
          { label: "Accueil", href: "/" },
          { label: "Comparatifs", href: "/comparatif" },
          { label: "Bail électronique vs papier", href: "/comparatif/bail-electronique-vs-papier", isCurrentPage: true },
        ]}
      />

      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Header */}
        <header className="mb-16 text-center">
          <p className="mb-3 text-sm font-medium tracking-wide text-blue-600 uppercase">
            Comparatif — Signature du bail
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Bail électronique vs bail papier : lequel choisir ?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-stone-600">
            Depuis 2017, le bail de location peut être signé numériquement avec la même valeur
            juridique. Retour sur les avantages concrets du format électronique pour les bailleurs.
          </p>
        </header>

        {/* Legal reminder */}
        <div className="mb-12 rounded-xl border-l-4 border-green-500 bg-green-50 p-6">
          <p className="font-semibold text-green-900">Cadre légal</p>
          <p className="mt-1 text-sm text-green-800">
            L'ordonnance n°2017-1676 du 16 novembre 2017 et son décret d'application reconnaissent
            la signature électronique comme equivalente à la signature manuscrite pour les contrats
            location. Le reglement eIDAS (UE n°910/2014) garantit la reconnaissance transfrontalière.
          </p>
        </div>

        {/* Comparison table */}
        <section className="mb-16 overflow-x-auto">
          <h2 className="mb-6 text-xl font-bold text-stone-900">
            Comparaison directe
          </h2>
          <table className="w-full text-sm min-w-[540px]">
            <thead>
              <tr className="border-b border-stone-200 text-left">
                <th className="py-3 pr-4 font-semibold text-stone-900">Critère</th>
                <th className="py-3 px-4 text-center font-semibold text-blue-700">Bail électronique ✓</th>
                <th className="py-3 px-4 text-center font-semibold text-stone-500">Bail papier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {comparison.map((row) => (
                <tr key={row.feature} className="hover:bg-stone-50">
                  <td className="py-3 pr-4">
                    <span className="font-medium text-stone-700">{row.feature}</span>
                    <p className="text-xs text-stone-400 mt-0.5">{row.note}</p>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.electronic ? (
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-stone-300" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.paper ? (
                      <Check className="mx-auto h-5 w-5 text-green-600" />
                    ) : (
                      <X className="mx-auto h-5 w-5 text-stone-300" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Benefits section */}
        <section className="mb-16 grid gap-6 sm:grid-cols-3">
          {[
            {
              icon: "⚡",
              title: "Rapidité",
              description:
                "Envoyez le bail par email en 2 minutes. Le locataire signe depuis son smartphone ou ordinateur, où qu'il soit. Plus de rendez-vous physique obligatoire.",
            },
            {
              icon: "🔒",
              title: "Sécurité juridique",
              description:
                "La signature électronique horodatée et certifié crée une preuve infalsifiable. En cas de litige, vous avez l'équivalent d'un acte authentique numérique.",
            },
            {
              icon: "📁",
              title: "Organisation",
              description:
                "Tous vos baux sont stockés numériquement, searchables et accessibles. Plus de dossiers physiques à chercher, de documents perdus ou de signatures non datées.",
            },
          ].map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-xl border border-stone-200 bg-white p-6 text-center shadow-sm"
            >
              <span className="text-3xl" role="img" aria-hidden="true">
                {benefit.icon}
              </span>
              <h3 className="mt-3 text-lg font-bold text-stone-900">{benefit.title}</h3>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
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
            Créez et signez vos baux en ligne
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-stone-300">
            RentReady vous permet de préparer vos baux, les envoyer pour signature électronique
            et les archiver automatiquement. Conforme loi de 1989 et ordinance 2017.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow transition-colors hover:bg-blue-700"
          >
            Essai gratuit 14 jours →
          </Link>
        </section>
      </main>
    </>
  );
}
