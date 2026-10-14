import type { Metadata } from "next";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { baseMetadata } from "@/lib/seo/metadata";
import { ToolCallout } from "@/components/marketing/site/ToolCallout";

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.
export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  return baseMetadata({
    title:
      "Dépôt de Garantie Location 2026 — Règles, Montant & Restitution",
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
      name: "Restituer le dépôt dans le délai légal",
      text: "Le dépôt doit être restitué dans un délai d'un mois après la remise des clés si l'état des lieux de sortie est conforme à celui d'entrée, de deux mois sinon. En cas de retenue, le bailleur justifie chaque montant. En cas de retard, le solde dû est majoré de 10 % du loyer mensuel hors charges par mois de retard commencé (article 22 de la loi du 6 juillet 1989).",
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
      text: "Location vide : 1 mois de loyer hors charges au plus. Location meublée : 2 mois au plus. Bail mobilité : dépôt interdit. Restitution : 1 mois après la remise des clés si l'état des lieux de sortie est conforme, 2 mois sinon. Toute clause supérieure est nulle et le locataire peut demander le remboursement.",
    },
  ],
};

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.

export default function DepotGarantieGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
      <header className="mb-12">
        <nav className="mb-6 text-sm text-stone-600">
          <Link href="/" className="hover:text-stone-700">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/guides" className="hover:text-stone-700">Guides pratiques</Link>
          <span className="mx-2">›</span>
          <span>Dépôt de garantie</span>
        </nav>
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-sage-100 px-3 py-1 text-xs font-medium text-forest">
          Guide gratuit
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.03em] text-ink sm:text-4xl">
          Dépôt de garantie : règles 2026 pour le propriétaire
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-stone-600">
          Montant maximum, délais de restitution, cas de retenue — voici tout ce que le
          propriétaire bailleur doit savoir sur le dépôt de garantie en location.
        </p>
      </header>

      <ToolCallout
        className="mb-10"
        title="Calculer le plafond du dépôt de garantie"
        text="Un mois de loyer hors charges en location vide, deux en meublé : vérifiez le montant pour votre bail."
        tool={{ href: "/outils/calculateur-depot-garantie", label: "Calculer le plafond" }}
        secondary={{ href: "/outils/checklist-etat-lieux", label: "Checklist état des lieux" }}
      />
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
          Le locataire peut demander le remboursement du surplus ; cette action se
          prescrit par trois ans (article 7-1 de la loi du 6 juillet 1989).
        </p>

        <h2>Restitution du dépôt de garantie</h2>
        <p>
          Le dépôt de garantie doit être restitué au locataire dans un délai
          d&apos;<strong>un mois</strong> après la remise des clés si l&apos;état des
          lieux de sortie est conforme à celui d&apos;entrée, et de{' '}
          <strong>deux mois</strong> dans le cas contraire (article 22 de la loi du 6
          juillet 1989).
        </p>
        <p>
          En cas de retenue, le bailleur doit justifier chaque montant déduit en joignant
          un état des lieux comparatif et des factures. En cas de retard, le solde
          restant dû est majoré de <strong>10 % du loyer mensuel hors charges pour
          chaque mois de retard commencé</strong>. Cette majoration n&apos;est pas
          due si le retard vient de ce que le locataire n&apos;a pas indiqué sa
          nouvelle adresse lors de la remise des clés.
        </p>
        <p>
          Dans un immeuble en copropriété, le bailleur peut conserver une provision
          d&apos;au plus <strong>20 % du dépôt</strong> jusqu&apos;à l&apos;approbation
          définitive des comptes de l&apos;immeuble ; il régularise alors les charges
          et restitue le solde dans le mois qui suit.
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
                <th className="pb-3 font-semibold text-ink">Type de location</th>
                <th className="pb-3 font-semibold text-ink">Dépôt maximum</th>
                <th className="pb-3 font-semibold text-ink">Restitution</th>
              </tr>
            </thead>
            <tbody className="text-stone-600">
              <tr className="border-b border-stone-100">
                <td className="py-2">Vide</td>
                <td className="py-2">1 mois hors charges</td>
                <td className="py-2">1 mois si état des lieux conforme, 2 mois sinon</td>
              </tr>
              <tr className="border-b border-stone-100">
                <td className="py-2">Meublée</td>
                <td className="py-2">2 mois hors charges</td>
                <td className="py-2">1 mois si état des lieux conforme, 2 mois sinon</td>
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
        <h2 className="mb-3 text-xl font-semibold text-ink">
          Gérez vos dépôts de garantie avec Lokna
        </h2>
        <p className="mx-auto mb-6 max-w-md text-stone-600">
          Le dépôt de garantie est enregistré avec le bail, à côté du loyer et des
          charges, pour le retrouver au moment de la sortie du locataire.
        </p>
        <Link
          href="/register"
          className="inline-flex items-center gap-2 rounded-lg bg-forest px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-forest-hover"
        >
          Essai gratuit 14 jours
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </article>
    </>
  );
}
