import Link from "next/link";

import { ChargesCalculator } from "./ChargesCalculator";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  buildGraphSchema,
  buildBreadcrumbSchema,
  buildFAQPageSchema,
  buildWebApplicationSchema,
  buildHowToSchema,
} from "@/lib/seo/structured-data";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { ToolHeader } from "@/components/marketing/tools/ToolHeader";
import { ToolCta, ToolExplainer, ToolFaq, type FaqItem } from "@/components/marketing/tools/ToolContent";

// Rendered on demand. SEO/marketing content, not product surface: prerendering the
// ~135-page content suite exhausted the Node heap during `next build`
// ("Ineffective mark-compacts near heap limit"). All data is local, so rendering
// per request costs ~ms and every URL keeps working.
export const revalidate = 3600;

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur Charges Locatives — Provision & Déduction",
    description:
      "Calculez la répartition des charges locatives entre propriétaire et locataire. Outil gratuit basé sur les règles légales françaises.",
    url: "/outils/calculateur-charges-locatives",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur Charges Locatives", href: "/outils/calculateur-charges-locatives" },
];

const SERVICE_PUBLIC_CHARGES = "https://www.service-public.gouv.fr/particuliers/vosdroits/F947";
const LINK = "text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest";

// Checked 14/10/2026: loi n° 89-462 art. 7-1, 8-1, 23, 25-10, 25-18 (Légifrance)
// and service-public.gouv.fr F947 (vérifié par Service-Public le 15/04/2025).
const FAQ: FaqItem[] = [
  {
    question: "Que sont les charges locatives ?",
    answer:
      "Ce sont les dépenses liées à l'usage du logement que le propriétaire paie puis se fait rembourser par le locataire : eau, chauffage collectif, ascenseur, entretien des parties communes, taxe d'enlèvement des ordures ménagères. Leur liste est fixée par le décret du 26 août 1987 ; une dépense qui n'y figure pas ne peut pas être imputée au locataire.",
  },
  {
    question: "Comment fonctionne la régularisation annuelle ?",
    answer:
      "Quand le bail prévoit des provisions, elles sont régularisées au moins une fois par an : on compare les provisions versées aux charges récupérables réelles. Un mois avant, le propriétaire communique au locataire le décompte par nature de charges et le mode de répartition ; les justificatifs restent à sa disposition pendant six mois (article 23 de la loi du 6 juillet 1989).",
  },
  {
    question: "Provisions ou forfait : quelle différence ?",
    answer:
      "Les provisions sont des avances régularisées chaque année. Le forfait est un montant fixe versé avec le loyer, qui ne peut donner lieu ni à complément ni à régularisation. En location vide, les charges se paient par provisions, sauf en colocation où le forfait est possible ; en meublé, le bail choisit l'un ou l'autre ; le bail mobilité impose le forfait.",
  },
  {
    question: "Que se passe-t-il si la régularisation est faite tard ?",
    answer:
      "Si elle n'a pas été faite avant la fin de l'année civile qui suit l'année où les charges étaient dues, le locataire peut demander à payer le complément en douze mensualités. Le propriétaire peut réclamer des charges impayées pendant trois ans.",
  },
  {
    question: "Quelles dépenses ne sont pas récupérables ?",
    answer:
      "Tout ce qui n'est pas dans la liste du décret : la taxe foncière (hors taxe d'enlèvement des ordures ménagères), l'assurance du propriétaire, les frais de gestion ou d'agence, les gros travaux et le remplacement d'équipements.",
  },
];

function CalculateurChargesJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Calculateur Charges Locatives", url: "https://lokna.fr/outils/calculateur-charges-locatives" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Charges Locatives",
      description:
        "Outil gratuit qui calcule la régularisation annuelle des charges locatives : provisions versées, charges récupérables réelles et montant à régler ou à rembourser.",
      url: "/outils/calculateur-charges-locatives",
    }),
    buildHowToSchema({
      name: "Comment calculer la régularisation des charges locatives",
      description: "Comparez les provisions versées par le locataire aux charges récupérables réelles de la période.",
      url: "/outils/calculateur-charges-locatives",
      steps: [
        { name: "Vérifiez le mode de paiement des charges", text: "Provisions régularisées chaque année ou forfait : un forfait ne se régularise pas." },
        { name: "Indiquez la période", text: "Choisissez la période régularisée et, si besoin, les dates d'arrivée ou de départ du locataire." },
        { name: "Saisissez les provisions versées", text: "Indiquez la provision mensuelle et le nombre de mois payés." },
        { name: "Saisissez les charges récupérables", text: "Reportez les charges récupérables de la période, ligne par ligne, et lisez le montant à régler ou à rembourser." },
      ],
    }),
    buildFAQPageSchema(FAQ)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

const REGIMES = [
  { lease: "Location vide", rule: "Provisions, régularisées chaque année", note: "Forfait possible seulement en colocation" },
  { lease: "Location meublée", rule: "Provisions ou forfait", note: "Le bail précise le mode choisi" },
  { lease: "Colocation", rule: "Provisions ou forfait", note: "Le bail précise le mode choisi" },
  { lease: "Bail mobilité", rule: "Forfait", note: "Jamais de régularisation" },
];

const RECOVERABLE = [
  { title: "Ascenseurs et monte-charge", detail: "Électricité, exploitation de l'appareil." },
  { title: "Eau et chauffage collectif", detail: "Eau froide et chaude des occupants, énergie du chauffage collectif." },
  { title: "Installations individuelles", detail: "Entretien du chauffage et de la production d'eau chaude, distribution d'eau." },
  { title: "Parties communes intérieures", detail: "Électricité, produits et personnel d'entretien." },
  { title: "Espaces extérieurs", detail: "Voies de circulation, aires de stationnement, espaces verts." },
  { title: "Taxes et redevances", detail: "Taxe d'enlèvement des ordures ménagères, taxe de balayage." },
  { title: "Gardien ou employé d'immeuble", detail: "Une partie de son salaire, sous conditions." },
];

/** The calendar year before the one in progress: the usual regularisation period. */
function lastYear(): { start: string; end: string } {
  const year = new Date().getUTCFullYear() - 1;
  return { start: `${year}-01-01`, end: `${year}-12-31` };
}

export default function CalculateurChargesLocativesPage() {
  const period = lastYear();
  return (
    <>
      <CalculateurChargesJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Outil gratuit · sans inscription"
            title="Calculateur de Charges Locatives"
            intro="La régularisation annuelle des charges : ce que le locataire a versé en provisions, ce que les charges ont réellement coûté, et qui doit quoi à qui."
            facts={[
              { label: "Règle", value: "Article 23, loi du 6 juillet 1989" },
              { label: "Liste", value: "Décret du 26 août 1987" },
            ]}
          />

          <div className="mt-10">
            <ChargesCalculator defaultStart={period.start} defaultEnd={period.end} />
          </div>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="calcul-title" title="Comment se calcule la régularisation ?">
              <p>
                La régularisation compare deux montants sur la même période : les charges récupérables réellement dues pour
                le logement, et les provisions que le locataire a versées.
              </p>
              <p className="not-prose rounded-lg bg-white px-4 py-3.5 text-center text-[15px] font-medium text-ink ring-1 ring-line">
                Régularisation = charges récupérables de la période − provisions versées
              </p>
              <p>
                Un résultat positif est un complément que le locataire doit payer ; un résultat négatif, un trop-perçu que vous
                lui remboursez. Si le locataire est arrivé ou parti en cours de période, sa part est calculée au prorata des
                jours d&apos;occupation, la méthode usuelle ; le bail ou le décompte de copropriété peuvent prévoir une autre
                clé de répartition. Les montants sont calculés au centime, sans arrondi intermédiaire.
              </p>
              <p>
                Pour présenter le décompte au locataire, partez de notre{" "}
                <Link href="/templates/repartition-charges">modèle de répartition des charges</Link>, et vérifiez chaque ligne
                avec la <Link href="/blog/charges-locatives-recuperables-liste-2026">liste détaillée des charges récupérables</Link>.
              </p>
            </ToolExplainer>

            <section aria-labelledby="regimes-title" className="border-t border-line pt-10">
              <h2 id="regimes-title" className="text-[1.5rem] font-semibold tracking-[-0.025em] text-ink sm:text-[1.65rem]">
                Provisions ou forfait : ce que prévoit le bail
              </h2>
              <p className="mt-3 max-w-3xl text-[16px] leading-7 text-ink-muted">
                Un forfait de charges ne peut donner lieu ni à complément ni à régularisation. Avant de calculer, vérifiez le
                mode inscrit dans le bail.
              </p>
              <div className="mt-5 overflow-hidden rounded-xl border border-line bg-white">
                <table className="w-full text-left text-[14.5px]">
                  <caption className="sr-only">Mode de paiement des charges selon le type de bail</caption>
                  <thead className="bg-paper text-[12.5px] text-ink-muted">
                    <tr>
                      <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">Bail</th>
                      <th scope="col" className="px-4 py-2.5 font-medium sm:px-5">Paiement des charges</th>
                      <th scope="col" className="hidden px-5 py-2.5 font-medium sm:table-cell">À savoir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line-soft">
                    {REGIMES.map((regime) => (
                      <tr key={regime.lease}>
                        <th scope="row" className="px-4 py-3 align-top font-medium text-ink sm:px-5">
                          {regime.lease}
                        </th>
                        <td className="px-4 py-3 align-top text-ink sm:px-5">
                          {regime.rule}
                          <span className="mt-0.5 block text-[13px] text-ink-muted sm:hidden">{regime.note}</span>
                        </td>
                        <td className="hidden px-5 py-3 align-top text-ink-muted sm:table-cell">{regime.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-[13.5px] leading-6 text-ink-muted">
                Articles 8-1, 23, 25-10 et 25-18 de la loi du 6 juillet 1989 ;{" "}
                <a href={SERVICE_PUBLIC_CHARGES} className={LINK} rel="noopener">
                  Service-Public, charges locatives
                </a>
                .
              </p>
            </section>

            <section aria-labelledby="recuperables-title" className="border-t border-line pt-10">
              <h2 id="recuperables-title" className="text-[1.5rem] font-semibold tracking-[-0.025em] text-ink sm:text-[1.65rem]">
                Les charges récupérables
              </h2>
              <p className="mt-3 max-w-3xl text-[16px] leading-7 text-ink-muted">
                La liste du décret du 26 août 1987 est limitative. Elle se regroupe en sept familles :
              </p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {RECOVERABLE.map((item) => (
                  <li key={item.title} className="rounded-xl border border-line bg-white px-4 py-3.5">
                    <p className="text-[15px] font-semibold text-ink">{item.title}</p>
                    <p className="mt-1 text-[14px] leading-6 text-ink-muted">{item.detail}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-5 max-w-3xl text-[15px] leading-7 text-ink-muted">
                Ne sont pas récupérables : la taxe foncière, l&apos;assurance du propriétaire, les frais de gestion ou
                d&apos;agence, les gros travaux et le remplacement d&apos;équipements.
              </p>
            </section>

            <ToolFaq items={FAQ} title="Questions fréquentes sur les charges locatives" />

            <ToolCta title="Vous gérez plusieurs locations ?">
              Dans Lokna, chaque <Link href="/bail" className={LINK}>bail</Link> enregistre le loyer et la provision pour
              charges, et chaque paiement donne une <Link href="/quittances" className={LINK}>quittance</Link> qui distingue le
              loyer et les charges. La régularisation annuelle se fait avec ce calculateur.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}
