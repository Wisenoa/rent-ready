import Link from "next/link";
import { Check } from "lucide-react";

import { YieldCalculatorClient } from "./calculator-client";
import { baseMetadata } from "@/lib/seo/metadata";
import {
  buildGraphSchema,
  buildBreadcrumbSchema,
  buildWebApplicationSchema,
  buildHowToSchema,
  buildFAQPageSchema,
} from "@/lib/seo/structured-data";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { ToolHeader } from "@/components/marketing/tools/ToolHeader";
import { ToolCta, ToolExplainer, ToolFaq, type FaqItem } from "@/components/marketing/tools/ToolContent";

export const revalidate = 3600;

export async function generateMetadata() {
  return baseMetadata({
    title: "Calculateur de Rentabilité Locative 2026 — Rendement Brut & Net",
    description:
      "Calculez gratuitement le rendement locatif brut, acte en main et net de charges de votre investissement immobilier (frais de notaire, travaux, vacance, taxe foncière).",
    url: "/outils/calculateur-rendement",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur de rendement locatif", href: "/outils/calculateur-rendement" },
];

const HYPOTHESES_CALCUL = [
  "Seul le loyer hors charges est retenu au numérateur : les provisions sur charges récupérables ne sont que des avances remboursées par le locataire.",
  "Le rendement net de charges rapporte le revenu net annuel au coût total « acte en main » (prix d'achat + frais de notaire + travaux).",
  "La taxe d'enlèvement des ordures ménagères (TEOM) étant récupérable sur le locataire (décret n° 87-713), seule la taxe foncière nette est déduite.",
  "La vacance locative entre deux baux est intégrée en nombre de mois de loyer non perçus par an.",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Quelle est la différence entre rentabilité brute et rentabilité nette de charges ?",
    answer:
      "La rentabilité brute divise simplement 12 mois de loyer hors charges par le prix d'achat du bien. La rentabilité nette de charges ajoute au coût d'achat les frais de notaire et les travaux, puis retranche des loyers la vacance locative, la taxe foncière, les charges de copropriété non récupérables et les assurances (PNO, GLI).",
  },
  {
    question: "Faut-il inclure les provisions sur charges dans le loyer pour calculer le rendement ?",
    answer:
      "Non. Les provisions sur charges versées chaque mois par le locataire servent uniquement à rembourser les dépenses récupérables payées par le propriétaire (eau, entretien des parties communes, TEOM). Les inclure gonflerait artificiellement le rendement brut.",
  },
  {
    question: "Quel taux de frais de notaire retenir dans l'ancien et dans le neuf ?",
    answer:
      "Pour un logement ancien, les frais d'acquisition (droits de mutation, émoluments du notaire et débours) représentent généralement entre 7,5 % et 8 % du prix d'achat. Dans l'immobilier neuf (VEFA), les droits d'enregistrement sont réduits et les frais s'établissent autour de 2 % à 3 %.",
  },
  {
    question: "Comment passer du rendement net de charges au rendement net-net (après impôt) ?",
    answer:
      "La fiscalité dépend du régime choisi (location vide au micro-foncier ou au réel, location meublée au Micro-BIC ou au LMNP Réel avec amortissement). Une fois votre revenu net avant impôt calculé ici, utilisez notre simulateur de fiscalité LMNP pour mesurer l'impôt sur le revenu et les prélèvements sociaux (17,2 %).",
  },
];

function CalculateurRendementJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Calculateur de rendement locatif", url: "https://lokna.fr/outils/calculateur-rendement" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Rentabilité et Rendement Locatif",
      description:
        "Calculez le rendement locatif brut, acte en main et net de charges (frais de notaire, travaux, vacance locative, taxe foncière, charges non récupérables).",
      url: "/outils/calculateur-rendement",
    }),
    buildHowToSchema({
      name: "Comment calculer la rentabilité locative d'un bien immobilier",
      description:
        "Comparez le rendement brut et le rendement net de charges à partir du coût complet d'acquisition et des charges annuelles.",
      url: "/outils/calculateur-rendement",
      steps: [
        {
          name: "Renseignez le coût complet d'acquisition",
          text: "Indiquez le prix d'achat net vendeur, les frais de notaire et l'enveloppe de travaux ou d'ameublement.",
        },
        {
          name: "Saisissez le loyer mensuel hors charges et la vacance",
          text: "Indiquez le loyer hors charges attendu et estimez la vacance locative annuelle entre deux locataires.",
        },
        {
          name: "Déduisez les charges propriétaire",
          text: "Ajoutez la taxe foncière (hors TEOM), les charges de copropriété non récupérables et l'assurance PNO pour obtenir le rendement net.",
        },
      ],
    }),
    buildFAQPageSchema(FAQ_ITEMS)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

export default function CalculateurRendementPage() {
  return (
    <>
      <CalculateurRendementJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Outil gratuit · sans inscription"
            title="Calculateur de rentabilité et rendement locatif"
            intro="Mesurez l'écart réel entre le rendement brut affiché sur une annonce et le rendement net de charges « acte en main » après frais de notaire, travaux, vacance locative et taxe foncière."
            facts={[
              { label: "3 indicateurs", value: "Brut, Acte en main, Net de charges" },
              { label: "Précision", value: "Calcul au centime près" },
              { label: "Accès", value: "100 % gratuit, sans e-mail" },
            ]}
          />

          <div className="mt-10">
            <YieldCalculatorClient />
          </div>

          <section aria-labelledby="hypotheses-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="hypotheses-title" className="text-[17px] font-semibold text-ink">
              Méthodologie et hypothèses retenues par le calculateur
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {HYPOTHESES_CALCUL.map((item) => (
                <li key={item} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-ink-muted">
              Pour approfondir les définitions, consultez notre fiche{" "}
              <Link
                href="/glossaire-immobilier/rendement-locatif"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
              >
                rendement locatif dans le glossaire immobilier
              </Link>
              .
            </p>
          </section>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="explications-rendement" title="Comment analyser la rentabilité d'un investissement locatif ?">
              <p>
                Comparer deux biens immobiliers sur la seule base du <strong>rendement brut</strong> conduit souvent à des erreurs
                d&apos;arbitrage : un studio ancien avec des charges d&apos;ascenseur et de chauffage collectif élevées ou une
                forte rotation locative peut afficher un rendement brut flatteur tout en dégageant un rendement net inférieur à un
                deux-pièces aux charges maîtrisées.
              </p>
              <p className="not-prose rounded-lg bg-white px-4 py-3.5 text-center text-[15px] font-medium text-ink ring-1 ring-line">
                Rendement net de charges = (Loyers HC encaissés − Charges bailleur) ÷ (Prix + Frais d&apos;acquisition + Travaux) × 100
              </p>
              <h3>1. Du prix d&apos;annonce au coût « acte en main »</h3>
              <p>
                Les frais d&apos;acquisition (communément appelés « frais de notaire ») et les travaux de mise en état mobilisent
                du capital dès le premier jour. Les intégrer au dénominateur fait baisser le taux facial d&apos;environ 0,4 à 1
                point, mais reflète le véritable capital immobilisé par l&apos;investisseur. Si vous financez l&apos;opération à
                crédit, simulez vos mensualités avec notre{" "}
                <Link href="/outils/simulateur-pret-immobilier">simulateur de prêt immobilier</Link>.
              </p>
              <h3>2. Distinguer charges récupérables et charges propriétaire</h3>
              <p>
                En copropriété, seule la quote-part listée par le décret n° 87-713 du 26 août 1987 est refacturable au locataire.
                Les honoraires du syndic, l&apos;assurance de l&apos;immeuble et les travaux votés en assemblée générale restent à
                la charge du bailleur. Vous pouvez ventiler précisément ces postes grâce à notre{" "}
                <Link href="/outils/calculateur-charges-locatives">calculateur de charges locatives</Link>.
              </p>
              <h3>3. L&apos;impact décisif du régime fiscal</h3>
              <p>
                Le rendement calculé ci-dessus est un rendement <strong>avant impôt</strong>. En location meublée, le choix entre
                l&apos;abattement forfaitaire de 50 % du Micro-BIC et la déduction des charges et amortissements au Régime Réel
                modifie fortement la rentabilité nette après impôt : comparez les deux options sur notre{" "}
                <Link href="/outils/simulateur-fiscalite-lmnp">simulateur de fiscalité LMNP</Link>.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur le calcul de rentabilité locative" />
          </div>

          <div className="mt-16">
            <ToolCta title="Suivez les loyers et les charges de vos biens dans Lokna">
              Une fois le bien acquis et loué, Lokna centralise vos baux, vos appels de loyer, vos régularisations de charges et
              vos quittances au même endroit.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}
