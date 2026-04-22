import type { Metadata } from "next";
export const revalidate = 604800;

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title: "Dépôt de garantie location 2026 : règles, montant, restitution",
    description:
      "Dépôt de garantie location : montant maximum (1 ou 2 mois), modalités de restitution, déductibilité des dégradations. Guide complet pour le propriétaire bailleur.",
    url: "/guides/depot-garantie",
    ogType: "website",
  });
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "Gérer le dépôt de garantie d'une location",
  description:
    "Guide complet : montant maximum du dépôt de garantie, délais de restitution, cas de retenue et dégradations en fin de bail.",
  step: [
    {
      "@type": "HowToStep",
      name: "Vérifier le montant maximum autorisé",
      text: "En location vide, le dépôt ne peut pas dépasser 1 mois de loyer hors charges. En location meublée, le maximum est de 2 mois. Le bail mobilité interdit tout dépôt de garantie. Une clause excédant ces plafonds est nulle.",
    },
    {
      "@type": "HowToStep",
      name: "Restituer le dépôt dans les 2 mois",
      text: "Le dépôt doit être restitué au locataire dans les 2 mois suivant la remise des clés. En cas de retenue, le bailleur doit justifier chaque montant avec l'état des lieux comparatif et des factures. Passé le délai, des intérêts s'appliquent.",
    },
    {
      "@type": "HowToStep",
      name: "Évaluer les dégradations à l'état des lieux de sortie",
      text: "Le dépôt couvre les sommes dues : loyers/charges impayés, dégradations au-delà de l'usure normale, violations du bail non régularisées. L'usure normale (traces légères, usure des sols) n'est pas imputable au locataire.",
    },
    {
      "@type": "HowToStep",
      name: "Souscrire une assurance GLI en complément",
      text: "La Garantie Loyers Impayés (GLI) ne remplace pas le dépôt de garantie — les deux sont complémentaires. La GLI couvre les impayés de loyer tandis que le dépôt couvre les dégradations et les sommes dues en fin de bail.",
    },
    {
      "@type": "HowToStep",
      name: "Respecter le tableau récapitulatif légal",
      text: "Location vide : 1 mois max, restitution 2 mois. Location meublée : 2 mois max, restitution 2 mois. Bail mobilité : dépôt interdit. Toute clause supérieure est nulle et le locataire peut demander remboursement.",
    },
  ],
};

export default function DepotGarantieGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mb-12">
        <nav className="mb-6 text-sm text-stone-500">
          <Link href="/" className="hover:text-stone-700">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/guides" className="hover:text-stone-700">Guides pratiques</Link>
          <span className="mx-2">›</span>
          <span>Dépôt de garantie</span>
        </nav>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
          Guide gratuit
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Dépôt de garantie : règles 2026 pour le propriétaire
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Montant maximum, délais de restitution, cas de retenue — voici tout ce que le
          propriétaire bailleur doit savoir sur le dépôt de garantie en location.
        </p>
      </header>

      <div className="prose prose-stone max-w-none">
        <h2>Quel montant de dépôt de garantie ?</h2>
        <p>
          Le dépôt de garantie est encadré par la loi. Son montant dépend du type de
          bail et ne peut pas dépasser un plafond légal :
        </p>
        <ul>
          <li><strong>Location vide</strong> : maximum 1 mois de loyer hors charges</li>
          <li><strong>Location meublée</strong> : maximum 2 mois de loyer hors charges</li>
          <li><strong>Bail mobilité</strong> : interdit — aucun dépôt de garantie ne peut être demandé</li>
        </ul>
        <p>
          Une clause exigeant un dépôt supérieur est <strong>nulle de plein droit</strong>.
          Le locataire peut demander le remboursement du surplus dans les 2 mois suivant
          la signature.
        </p>

        <h2>Restitution du dépôt de garantie</h2>
        <p>
          Le dépôt de garantie doit être restitué au locataire dans un délai maximum de{' '}
          <strong>2 mois</strong> après la remise des clés par le locataire.
        </p>
        <p>
          En cas de retenue, le bailleur doit justifier chaque montant déduit en joignant
          un état des lieux comparatif et des factures. Passé le délai de 2 mois sans
          restitution, le dépôt produit <strong>intérêts au taux légal</strong>.
        </p>

        <h2>Quand peut-on retenir une partie du dépôt ?</h2>
        <p>
          Le dépôt de garantie couvre les sommes dues par le locataire en fin de bail :
        </p>
        <ul>
          <li>Loyer et charges impayés</li>
          <li>Dégradations constatées à l&apos;état des lieux de sortie (au-delà de l&apos;usure normale)</li>
          <li>Violations du bail non régularisées</li>
        </ul>
        <p>
          L&apos;usure normale d&apos;un logement ne peut pas être imputée au locataire. La
          jurisprudence considère que les signes normaux d&apos;usage quotidien (traces
          légères sur les murs, usure des sols) ne justifient pas une retenue.
        </p>

        <h2>Dépôt de garantie et assurance GLI</h2>
        <p>
          De nombreux propriétaires souscrivent une Garantie Loyers Impayés (GLI) pour se
          protéger en cas de défaillance du locataire. La GLI ne remplace pas le dépôt
          de garantie — les deux sont complémentaires et cumulables.
        </p>

        <h2>Récapitulatif</h2>
        <div className="not-prose my-6 rounded-xl border border-stone-200 bg-white p-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-left">
                <th className="pb-3 font-semibold text-stone-900">Type de location</th>
                <th className="pb-3 font-semibold text-stone-900">Dépôt maximum</th>
                <th className="pb-3 font-semibold text-stone-900">Restitution</th>
              </tr>
            </thead>
            <tbody className="text-stone-600">
              <tr className="border-b border-stone-100">
                <td className="py-2">Vide</td>
                <td className="py-2">1 mois hors charges</td>
                <td className="py-2">2 mois après sortie</td>
              </tr>
              <tr className="border-b border-stone-100">
                <td className="py-2">Meublée</td>
                <td className="py-2">2 mois hors charges</td>
                <td className="py-2">2 mois après sortie</td>
              </tr>
              <tr>
                <td className="py-2">Mobilité</td>
                <td className="py-2">Interdit</td>
                <td className="py-2">N/A</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-12 rounded-xl border border-stone-200/60 bg-stone-50 p-8 text-center">
        <h2 className="mb-3 text-xl font-bold text-stone-900">
          Gérez vos dépôts de garantie avec RentReady
        </h2>
        <p className="mx-auto mb-6 max-w-md text-stone-600">
          Suivez les dépôts reçus, générez automatiquement les reçus, et gérez les
          régularisations de sortie en toute conformité.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Essai gratuit 14 jours
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
    </>
  );
}
