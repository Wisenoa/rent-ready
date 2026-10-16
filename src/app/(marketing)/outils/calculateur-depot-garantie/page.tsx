import Link from "next/link";
import { Check } from "lucide-react";

import { DepotGarantieCalculatorClient } from "./calculator-client";
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
    title: "Calculateur de Dépôt de Garantie 2026 — Plafond, Restitution & Pénalité",
    description:
      "Calculez gratuitement le plafond légal du dépôt de garantie (1 mois en location vide, 2 mois en meublé, 0 € en bail mobilité), le délai de restitution et la majoration de 10 % en cas de retard.",
    url: "/outils/calculateur-depot-garantie",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur de dépôt de garantie", href: "/outils/calculateur-depot-garantie" },
];

const REGLES_DEPOT = [
  "Plafond légal : 1 mois de loyer hors charges en location vide (art. 22), 2 mois hors charges en location meublée (art. 25-6), 0 € en bail mobilité (art. 25-17).",
  "La localisation en zone tendue ne modifie jamais le plafond du dépôt de garantie.",
  "Délai de restitution : 1 mois après remise des clés si l'état des lieux de sortie est conforme à l'entrée, 2 mois en cas de différences.",
  "Retard de restitution : majoration légale de 10 % du loyer mensuel hors charges pour chaque période mensuelle commencée en retard.",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Quel est le montant maximum d'un dépôt de garantie en location vide et en meublé ?",
    answer:
      "Pour une résidence principale, le dépôt de garantie est plafonné à 1 mois de loyer hors charges en location vide (article 22 de la loi du 6 juillet 1989) et à 2 mois de loyer hors charges en location meublée (article 25-6). En bail mobilité, tout dépôt de garantie est interdit (article 25-17). De plus, aucun dépôt ne peut être demandé si le loyer est payable d'avance pour une période supérieure à deux mois.",
  },
  {
    question: "La zone tendue change-t-elle le montant du dépôt de garantie ?",
    answer:
      "Non. La zone tendue réduit le préavis du locataire à 1 mois en location vide et encadre l'évolution des loyers à la relocation, mais elle n'a aucun effet sur le plafond du dépôt de garantie (qui reste de 1 mois hors charges en vide et 2 mois hors charges en meublé).",
  },
  {
    question: "Dans quel délai le propriétaire doit-il restituer le dépôt de garantie ?",
    answer:
      "Le délai court à compter du jour de la remise des clés par le locataire : il est de 1 mois maximum lorsque l'état des lieux de sortie est conforme à l'état des lieux d'entrée, et de 2 mois maximum lorsque des différences sont constatées entre l'entrée et la sortie.",
  },
  {
    question: "Comment fonctionne la retenue provisoire de 20 % en copropriété ?",
    answer:
      "Lorsque le logement loué se situe dans un immeuble collectif en copropriété et que les comptes annuels ne sont pas encore arrêtés au départ du locataire, l'article 22 autorise le bailleur à conserver une provision ne pouvant excéder 20 % du dépôt de garantie. La régularisation définitive et la restitution du solde doivent intervenir dans le mois qui suit l'approbation définitive des comptes de l'immeuble.",
  },
  {
    question: "Quelle est la pénalité en cas de restitution tardive du dépôt de garantie ?",
    answer:
      "À défaut de restitution dans le délai légal de 1 ou 2 mois, le dépôt de garantie restant dû au locataire est majoré d'une somme égale à 10 % du loyer mensuel en principal (hors charges) pour chaque période mensuelle commencée en retard, sauf si le retard résulte de l'absence de communication par le locataire de sa nouvelle adresse.",
  },
];

function CalculateurDepotGarantieJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Calculateur de dépôt de garantie", url: "https://lokna.fr/outils/calculateur-depot-garantie" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Dépôt de Garantie (Plafond & Restitution)",
      description:
        "Calculez le plafond légal du dépôt de garantie (bail vide, meublé, mobilité), le solde à restituer, la provision de 20 % en copropriété et la pénalité légale de retard de 10 %.",
      url: "/outils/calculateur-depot-garantie",
    }),
    buildHowToSchema({
      name: "Comment calculer le plafond et la restitution du dépôt de garantie",
      description:
        "Vérifiez le montant maximal autorisé à la signature du bail et le décompte de restitution à la sortie du locataire.",
      url: "/outils/calculateur-depot-garantie",
      steps: [
        {
          name: "Sélectionnez le type de bail et saisissez le loyer hors charges",
          text: "Choisissez location vide (1 mois), location meublée (2 mois) ou bail mobilité (0 €) et indiquez le loyer mensuel hors charges.",
        },
        {
          name: "Précisez la conformité de l'état des lieux de sortie",
          text: "Indiquez si l'état des lieux de sortie est conforme à l'entrée (délai de 1 mois) ou présente des différences (délai de 2 mois).",
        },
        {
          name: "Ajoutez les retenues justifiées et vérifiez le solde",
          text: "Le calculateur affiche le solde à restituer, la provision maximale de 20 % en copropriété et la majoration éventuelle de 10 % par mois de retard.",
        },
      ],
    }),
    buildFAQPageSchema(FAQ_ITEMS)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

export default function CalculateurDepotGarantiePage() {
  return (
    <>
      <CalculateurDepotGarantieJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Outil gratuit · sans inscription"
            title="Calculateur de dépôt de garantie : plafond légal et restitution"
            intro="Vérifiez le montant maximal autorisé à la signature du bail (vide, meublé ou mobilité) et calculez au centime près le solde à restituer en fin de location, la provision de 20 % en copropriété et la majoration de retard."
            facts={[
              { label: "Location vide", value: "1 mois hors charges" },
              { label: "Location meublée", value: "2 mois hors charges" },
              { label: "Référence", value: "Loi n° 89-462 · art. 22 & 25-6" },
            ]}
          />

          <div className="mt-10">
            <DepotGarantieCalculatorClient />
          </div>

          <section aria-labelledby="regles-depot-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="regles-depot-title" className="text-[17px] font-semibold text-ink">
              Les 4 règles impératives de l&apos;article 22 de la loi du 6 juillet 1989
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {REGLES_DEPOT.map((item) => (
                <li key={item} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-ink-muted">
              Sources :{" "}
              <a
                href="https://www.service-public.gouv.fr/particuliers/vosdroits/F31269"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Service-Public.fr — Dépôt de garantie (F31269)
              </a>{" "}
              et{" "}
              <a
                href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000028806696"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Légifrance — article 22 de la loi n° 89-462
              </a>
              . Consultez aussi notre{" "}
              <Link
                href="/guides/depot-garantie"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
              >
                guide complet du dépôt de garantie
              </Link>
              .
            </p>
          </section>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="explications-depot" title="Comment gérer le dépôt de garantie de la signature du bail à la remise des clés ?">
              <p>
                Dans le langage courant, le <strong>dépôt de garantie</strong> est souvent appelé à tort « caution ». En droit
                locatif français, la caution désigne la personne (ou l&apos;organisme comme Visale) qui se porte garante des
                impayés, tandis que le dépôt de garantie est la somme d&apos;argent versée au bailleur lors de l&apos;entrée dans
                les lieux pour couvrir d&apos;éventuels manquements du locataire (impayés de loyer ou de charges, réparations
                locatives constatées à la sortie).
              </p>
              <h3>1. Aucune révision en cours de bail</h3>
              <p>
                L&apos;article 22 de la loi du 6 juillet 1989 interdit expressément toute révision du montant du dépôt de garantie
                en cours de bail ou lors de son renouvellement, même lorsque le loyer augmente chaque année selon l&apos;
                <Link href="/outils/calculateur-irl">Indice de Référence des Loyers (IRL)</Link>.
              </p>
              <h3>2. Justifier chaque retenue à la sortie du locataire</h3>
              <p>
                Toute retenue opérée sur le dépôt de garantie doit être fondée sur la comparaison contradictoire entre l&apos;état
                des lieux d&apos;entrée et l&apos;état des lieux de sortie (que vous pouvez préparer avec notre{" "}
                <Link href="/outils/checklist-etat-lieux">checklist d&apos;état des lieux</Link> ou notre{" "}
                <Link href="/templates/etat-des-lieux">modèle d&apos;état des lieux</Link>) et justifiée par la remise au locataire
                d&apos;un devis, d&apos;une facture ou d&apos;un décompte de{" "}
                <Link href="/outils/calculateur-charges-locatives">régularisation de charges locatives</Link>. L&apos;usure normale
                liée au temps (vétusté) reste intégralement à la charge du bailleur.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur le dépôt de garantie" />
          </div>

          <div className="mt-16">
            <ToolCta title="Suivez vos baux et vos dépôts de garantie dans Lokna">
              Enregistrez le dépôt de garantie de chaque bail, suivez vos échéances de loyer et retrouvez tous les documents de
              vos locations au même endroit.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}