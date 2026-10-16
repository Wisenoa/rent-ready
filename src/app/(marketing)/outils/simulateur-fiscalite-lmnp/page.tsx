import Link from "next/link";
import { Check } from "lucide-react";

import { SimulateurLmnpClient } from "./calculator-client";
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
    title: "Simulateur Fiscalité LMNP 2026 — Micro-BIC vs Régime Réel",
    description:
      "Comparez gratuitement l'impôt en LMNP entre le régime Micro-BIC (abattement 50 %) et le Régime Réel Simplifié (charges déductibles et amortissement selon l'article 39 C du CGI).",
    url: "/outils/simulateur-fiscalite-lmnp",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Simulateur fiscalité LMNP", href: "/outils/simulateur-fiscalite-lmnp" },
];

const REGLES_LMNP = [
  "Micro-BIC (art. 50-0 CGI) : abattement forfaitaire de 50 % en location meublée longue durée jusqu'à 77 700 € de recettes annuelles.",
  "Régime Réel Simplifié : déduction des charges réelles (taxe foncière, copropriété, assurance, comptabilité, intérêts d'emprunt).",
  "Plafonnement de l'amortissement (art. 39 C CGI) : l'amortissement du bâti et du mobilier ne peut pas créer de déficit fiscal, mais l'excédent est reportable sans limite de durée.",
  "Assiette sociale et fiscale : l'impôt sur le revenu (TMI) et les prélèvements sociaux (17,2 %) s'appliquent tous deux au bénéfice BIC net après amortissement.",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Quelles conditions faut-il remplir pour relever du statut LMNP ?",
    answer:
      "En vertu de l'article 155 IV du Code général des impôts, un bailleur est Loueur en Meublé Non Professionnel (LMNP) tant que ses recettes locatives meublées annuelles (loyers charges comprises du foyer fiscal) n'excèdent pas 23 000 € OU restent inférieures aux autres revenus d'activité du foyer fiscal (salaires, BIC, BNC, pensions).",
  },
  {
    question: "Pourquoi le Régime Réel permet-il souvent de ramener l'impôt LMNP à 0 € ?",
    answer:
      "Au régime réel, outre les charges de copropriété, la taxe foncière et les intérêts d'emprunt, vous déduisez chaque année l'amortissement comptable de la construction (hors terrain) et du mobilier. Tant que la somme de vos charges et de vos dotations d'amortissement couvre vos recettes locatives, votre résultat BIC imposable est ramené à 0 €, tant pour l'impôt sur le revenu que pour les prélèvements sociaux de 17,2 %.",
  },
  {
    question: "Que devient la part d'amortissement qui dépasse le résultat de l'année ?",
    answer:
      "Conformément à l'article 39 C du CGI, la dotation aux amortissements ne peut pas créer ni augmenter un déficit fiscal sur l'exercice. La fraction d'amortissement non déduite n'est toutefois pas perdue : elle est stockée en amortissements réputés différés et s'imputera sur les bénéfices de location meublée des années suivantes.",
  },
  {
    question: "Quelles sont les recettes à déclarer en Micro-BIC ?",
    answer:
      "En location meublée (catégorie des Bénéfices Industriels et Commerciaux — BIC), le chiffre d'affaires imposable comprend à la fois les loyers hors charges et les provisions ou forfaits de charges payés par le locataire au cours de l'année civile.",
  },
];

function SimulateurLmnpJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Simulateur fiscalité LMNP", url: "https://lokna.fr/outils/simulateur-fiscalite-lmnp" },
    ]),
    buildWebApplicationSchema({
      name: "Simulateur de Fiscalité LMNP (Micro-BIC vs Régime Réel)",
      description:
        "Comparez votre imposition en location meublée non professionnelle (LMNP) entre le régime Micro-BIC et le Régime Réel Simplifié avec amortissement.",
      url: "/outils/simulateur-fiscalite-lmnp",
    }),
    buildHowToSchema({
      name: "Comment comparer le Micro-BIC et le Régime Réel en LMNP",
      description:
        "Mesurez l'économie d'impôt annuelle entre l'abattement forfaitaire de 50 % et l'amortissement comptable au réel.",
      url: "/outils/simulateur-fiscalite-lmnp",
      steps: [
        {
          name: "Indiquez vos recettes annuelles et votre TMI",
          text: "Renseignez le total des loyers charges comprises encaissés sur l'année et sélectionnez votre tranche marginale d'imposition.",
        },
        {
          name: "Saisissez vos charges et intérêts d'emprunt",
          text: "Additionnez vos charges déductibles (taxe foncière, copropriété, assurance, comptabilité) et vos intérêts de crédit.",
        },
        {
          name: "Renseignez la valeur du bien et du mobilier",
          text: "Le simulateur calcule la dotation aux amortissements, applique le plafonnement de l'article 39 C du CGI et affiche l'économie d'impôt.",
        },
      ],
    }),
    buildFAQPageSchema(FAQ_ITEMS)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

export default function SimulateurLmnpPage() {
  return (
    <>
      <SimulateurLmnpJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Outil gratuit · sans inscription"
            title="Simulateur de fiscalité LMNP (Micro-BIC vs Régime Réel)"
            intro="Comparez en temps réel l'impôt sur le revenu et les prélèvements sociaux (17,2 %) d'une location meublée longue durée entre l'abattement forfaitaire de 50 % du Micro-BIC et l'amortissement au Régime Réel Simplifié."
            facts={[
              { label: "Micro-BIC", value: "Abattement 50 % (plafond 77 700 €)" },
              { label: "Régime Réel", value: "Charges + amortissements (art. 39 C)" },
              { label: "Prélèvements sociaux", value: "17,2 % inclus" },
            ]}
          />

          <div className="mt-10">
            <SimulateurLmnpClient />
          </div>

          <section aria-labelledby="regles-lmnp-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="regles-lmnp-title" className="text-[17px] font-semibold text-ink">
              Règles fiscales intégrées dans la simulation
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {REGLES_LMNP.map((item) => (
                <li key={item} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-ink-muted">
              Sources :{" "}
              <a
                href="https://www.impots.gouv.fr/particulier/les-locations-meublees"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                impots.gouv.fr — Les locations meublées
              </a>{" "}
              et notre fiche{" "}
              <Link
                href="/glossaire-immobilier/location-meuble"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
              >
                location meublée dans le glossaire
              </Link>
              .
            </p>
          </section>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="explications-lmnp" title="Micro-BIC ou Régime Réel : comment choisir en location meublée ?">
              <p>
                Contrairement à la location vide imposée dans la catégorie des revenus fonciers, la{" "}
                <strong>location meublée</strong> relève de la catégorie des Bénéfices Industriels et Commerciaux (BIC). Ce cadre
                comptable offre deux options fiscales très différentes pour un propriétaire bailleur non professionnel (LMNP).
              </p>
              <h3>1. Le régime Micro-BIC : la simplicité de l&apos;abattement de 50 %</h3>
              <p>
                Pour une location meublée d&apos;habitation longue durée dont les recettes annuelles ne dépassent pas 77 700 €
                (article 50-0 du CGI), l&apos;administration fiscale applique automatiquement un abattement forfaitaire de 50 %. Vous
                êtes donc imposé (à votre TMI + 17,2 % de prélèvements sociaux) sur la moitié de vos loyers charges comprises,
                quel que soit le montant réel de vos charges.
              </p>
              <h3>2. Le Régime Réel Simplifié : déduction des charges et amortissement</h3>
              <p>
                Sur option (ou de plein droit au-delà de 77 700 €), le régime réel vous permet de déduire l&apos;ensemble de vos
                charges réelles (taxe foncière, charges de copropriété, assurance PNO, frais de tenue de comptabilité,{" "}
                <Link href="/outils/simulateur-pret-immobilier">intérêts d&apos;emprunt</Link>) puis d&apos;amortir chaque année la
                valeur du bâti (hors terrain) et du mobilier. Dès que vos charges et amortissements dépassent 50 % de vos
                recettes, le régime réel devient mathématiquement plus avantageux que le Micro-BIC.
              </p>
              <h3>3. Impact à la revente : la réforme de la plus-value LMNP</h3>
              <p>
                <strong>Attention à la revente :</strong> En application de la loi de finances (article 150 VB du CGI), les cessions intervenues depuis le 15 février 2025 et en 2026 intègrent désormais les amortissements déduits durant la location dans l&apos;assiette de la plus-value des particuliers. Le prix d&apos;acquisition retenu est minoré du total des amortissements pratiqués, ce qui majore d&apos;autant la plus-value brute. Utilisez notre{" "}
                <Link href="/outils/calculateur-plus-value">calculateur de plus-value immobilière</Link> pour chiffrer l&apos;impôt exact en fin d&apos;opération.
              </p>
              <p>
                Pour évaluer la performance globale de votre opération avant impôt, utilisez notre{" "}
                <Link href="/outils/calculateur-rendement">calculateur de rentabilité locative</Link>, et pour préparer le contrat
                de location, consultez notre <Link href="/templates/bail-meuble">modèle de bail meublé</Link>.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur la fiscalité LMNP" />
          </div>

          <div className="mt-16">
            <ToolCta title="Retrouvez tous vos loyers et charges meublés dans Lokna">
              Centralisez vos baux meublés, vos appels de loyer, vos provisions ou forfaits de charges et vos quittances PDF au
              même endroit.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}
