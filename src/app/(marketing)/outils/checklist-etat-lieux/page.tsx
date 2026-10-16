import Link from "next/link";
import { Check } from "lucide-react";

import { ChecklistEDLClient } from "./calculator-client";
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
    title: "Checklist État des Lieux Entrée & Sortie 2026 — Décret de 2016",
    description:
      "Préparez gratuitement votre état des lieux d'entrée ou de sortie conformément au décret n° 2016-382 du 30 mars 2016 : relevés de compteurs, clés, inspection pièce par pièce et vétusté.",
    url: "/outils/checklist-etat-lieux",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Checklist état des lieux", href: "/outils/checklist-etat-lieux" },
];

const REGLES_DECRET_2016 = [
  "Décret n° 2016-382 du 30 mars 2016 : l'état des lieux décrit le logement pièce par pièce ainsi que les relevés des compteurs individuels et le détail des clés.",
  "Droit de rectification à l'entrée (art. 3-2 loi du 6 juillet 1989) : 10 jours calendaires pour tout élément, et le premier mois de la période de chauffe pour le chauffage.",
  "Gratuité de l'état des lieux amiable : aucuns frais ne peuvent être facturés au locataire lorsque le constat est réalisé directement entre les parties.",
  "Vétusté normale : l'usure liée à l'écoulement du temps et à l'usage normal du bien reste à la charge du propriétaire bailleur.",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Quel texte réglementaire fixe le contenu obligatoire d'un état des lieux ?",
    answer:
      "C'est le décret n° 2016-382 du 30 mars 2016, pris en application de l'article 3-2 de la loi n° 89-462 du 6 juillet 1989, qui fixe les mentions obligatoires de l'état des lieux d'entrée et de sortie : type d'état des lieux, date, localisation du logement, noms et adresses des parties, relevés des compteurs individuels d'eau ou d'énergie, détail et destination des clés, description précise de l'état des revêtements de chaque pièce et signature des parties.",
  },
  {
    question: "Le locataire peut-il faire modifier l'état des lieux d'entrée après la remise des clés ?",
    answer:
      "Oui. Conformément à l'article 3-2 de la loi du 6 juillet 1989, le locataire peut demander au bailleur ou à son représentant de compléter l'état des lieux d'entrée dans un délai de 10 jours calendaires à compter de son établissement. Pour l'état des éléments de chauffage, cette demande peut être formulée pendant tout le premier mois de la période de chauffe.",
  },
  {
    question: "Quelle différence entre dégradation locative et vétusté normale à la sortie ?",
    answer:
      "La vétusté est l'état d'usure ou de détérioration résultant du temps ou de l'usage normal des matériaux et éléments d'équipement (par exemple un jaunissement progressif des peintures après plusieurs années). Seules les dégradations anormales, un défaut d'entretien courant ou une transformation non autorisée peuvent donner lieu à une retenue justifiée sur le dépôt de garantie.",
  },
  {
    question: "Que se passe-t-il si l'une des parties refuse d'établir ou de signer l'état des lieux ?",
    answer:
      "Si l'état des lieux ne peut pas être établi contradictoirement et à l'amiable, il est réalisé par un commissaire de justice (ancien huissier), à l'initiative de la partie la plus diligente, qui convoque les deux parties au moins sept jours à l'avance par lettre recommandée. Dans ce seul cas, les frais tarifés sont partagés par moitié entre le bailleur et le locataire.",
  },
];

function ChecklistEtatLieuxJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Checklist état des lieux", url: "https://lokna.fr/outils/checklist-etat-lieux" },
    ]),
    buildWebApplicationSchema({
      name: "Checklist Interactive d'État des Lieux (Entrée & Sortie)",
      description:
        "Checklist interactive d'état des lieux conforme au décret n° 2016-382 du 30 mars 2016 : relevés des compteurs, inventaire des clés et contrôle pièce par pièce.",
      url: "/outils/checklist-etat-lieux",
    }),
    buildHowToSchema({
      name: "Comment réussir un état des lieux d'entrée ou de sortie",
      description:
        "Vérifiez méthodiquement les compteurs, les clés et chaque pièce du logement selon le décret du 30 mars 2016.",
      url: "/outils/checklist-etat-lieux",
      steps: [
        {
          name: "Choisissez entrée ou sortie et identifiez le bien",
          text: "Sélectionnez le moment de l'état des lieux et renseignez la date, le nom du locataire et l'adresse du logement.",
        },
        {
          name: "Relevez les compteurs et comptez les clés",
          text: "Notez les index d'électricité, d'eau et de gaz ainsi que le nombre exact de clés et de badges remis.",
        },
        {
          name: "Inspectez chaque pièce et copiez la synthèse",
          text: "Qualifiez chaque poste (bon état, usure normale, anomalie) et copiez le récapitulatif complet.",
        },
      ],
    }),
    buildFAQPageSchema(FAQ_ITEMS)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

export default function ChecklistEtatLieuxPage() {
  return (
    <>
      <ChecklistEtatLieuxJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Outil gratuit · sans inscription"
            title="Checklist d'état des lieux d'entrée et de sortie"
            intro="Contrôlez méthodiquement les compteurs d'énergie, les jeux de clés et chaque pièce du logement conformément au décret n° 2016-382 du 30 mars 2016, puis copiez votre relevé synthétique."
            facts={[
              { label: "Cadre légal", value: "Décret n° 2016-382 du 30 mars 2016" },
              { label: "Rectification entrée", value: "10 jours + 1er mois de chauffe" },
              { label: "10 postes clés", value: "Compteurs, clés, pièces & DAAF" },
            ]}
          />

          <div className="mt-10">
            <ChecklistEDLClient />
          </div>

          <section aria-labelledby="decret-edl-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="decret-edl-title" className="text-[17px] font-semibold text-ink">
              Garanties légales de l&apos;article 3-2 et du décret du 30 mars 2016
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {REGLES_DECRET_2016.map((item) => (
                <li key={item} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-ink-muted">
              Sources :{" "}
              <a
                href="https://www.legifrance.gouv.fr/loda/id/JORFTEXT000032320564"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Légifrance — Décret n° 2016-382 du 30 mars 2016
              </a>{" "}
              et{" "}
              <a
                href="https://www.service-public.gouv.fr/particuliers/vosdroits/F31270"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Service-Public.fr — État des lieux (F31270)
              </a>
              .
            </p>
          </section>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="explications-edl" title="Pourquoi la précision de l'état des lieux protège à la fois le bailleur et le locataire ?">
              <p>
                En l&apos;absence d&apos;état des lieux d&apos;entrée, l&apos;article 1731 du Code civil présume que le locataire a
                reçu le logement en bon état de réparations locatives — mais l&apos;article 3-2 de la loi du 6 juillet 1989 précise
                que la partie qui a fait obstacle à l&apos;établissement de l&apos;acte ne peut pas se prévaloir de cette
                présomption.
              </p>
              <h3>1. Comparer l&apos;entrée et la sortie sur un document unique ou de forme similaire</h3>
              <p>
                Le décret du 30 mars 2016 impose que l&apos;état des lieux d&apos;entrée et de sortie soient établis sous une
                forme permettant de comparer facilement l&apos;évolution de chaque pièce. Consultez également notre{" "}
                <Link href="/templates/etat-des-lieux">modèle complet d&apos;état des lieux</Link> pour préparer votre document
                contradictoire.
              </p>
              <h3>2. Délai de restitution du dépôt de garantie après remise des clés</h3>
              <p>
                Le résultat de l&apos;état des lieux de sortie détermine directement le délai de remboursement du{" "}
                <Link href="/outils/calculateur-depot-garantie">dépôt de garantie</Link> : <strong>1 mois</strong> si l&apos;état
                des lieux de sortie est conforme à l&apos;entrée, ou <strong>2 mois</strong> si des dégradations ou anomalies y sont
                consignées. Retrouvez toutes les règles de retenue sur devis ou facture dans notre{" "}
                <Link href="/guides/depot-garantie">guide du dépôt de garantie</Link>.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur l'état des lieux" />
          </div>

          <div className="mt-16">
            <ToolCta title="Conservez les informations de vos baux et de vos locataires dans Lokna">
              Centralisez vos contrats de location, le suivi de vos loyers et l&apos;édition de vos quittances PDF dans un seul
              espace clair.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}