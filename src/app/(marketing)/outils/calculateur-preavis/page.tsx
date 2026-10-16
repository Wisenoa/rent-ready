import Link from "next/link";
import { Check } from "lucide-react";

import { PreavisCalculatorClient } from "./calculator-client";
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
    title: "Calculateur de Préavis Location 2026 — 1 Mois, 3 Mois ou 6 Mois",
    description:
      "Calculez gratuitement la durée et la date exacte de fin de préavis d'un bail vide, meublé ou mobilité (locataire 1 ou 3 mois, propriétaire 3 ou 6 mois, zone tendue, mutation).",
    url: "/outils/calculateur-preavis",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Calculateur de préavis", href: "/outils/calculateur-preavis" },
];

const REGLES_PREAVIS = [
  "Décompte de quantième à quantième (art. 641 CPC) : un préavis d'un mois reçu le 15 avril s'achève le 15 mai à minuit.",
  "Locataire en meublé ou bail mobilité : préavis d'un mois dans toute la France, sans motif à justifier.",
  "Locataire en location vide : 3 mois dans le cas général, réduit à 1 mois en zone tendue ou sur justificatif joint dès l'envoi du congé (emploi, mutation sans condition de distance, santé, RSA, AAH, HLM).",
  "Propriétaire bailleur : uniquement à l'échéance du bail (préavis de 6 mois en vide, 3 mois en meublé) pour vente, reprise ou motif légitime et sérieux.",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Comment se calcule la date exacte de fin d'un préavis d'un mois ou de trois mois ?",
    answer:
      "Conformément à l'article 641 du Code de procédure civile, un délai exprimé en mois se calcule de quantième à quantième à partir du jour de la réception effective du congé par son destinataire. Par exemple, une lettre recommandée retirée le 12 mars pour un préavis d'un mois fait courir le préavis jusqu'au 12 avril inclus. À défaut de quantième identique (par exemple un congé d'un mois reçu le 31 janvier), le délai expire le dernier jour du mois suivant (le 28 ou le 29 février).",
  },
  {
    question: "Existe-t-il une distance minimale pour bénéficier du préavis réduit à 1 mois en cas de mutation ?",
    answer:
      "Non. La Cour de cassation juge de manière constante que l'article 15 I de la loi du 6 juillet 1989 n'impose aucune condition d'éloignement géographique pour une mutation professionnelle, qui peut même intervenir au sein de la même commune.",
  },
  {
    question: "Que se passe-t-il si le locataire oublie de joindre son justificatif de préavis réduit ?",
    answer:
      "L'article 15 I de la loi du 6 juillet 1989 impose au locataire souhaitant bénéficier du préavis réduit à un mois de préciser le motif invoqué et d'en justifier au moment de l'envoi de la lettre de congé. À défaut de mention du motif ou de pièce justificative jointe, le délai de préavis applicable de plein droit est de trois mois.",
  },
  {
    question: "Une démission donne-t-elle droit au préavis réduit d'un mois en location vide ?",
    answer:
      "Non, hors zone tendue. La perte d'emploi visée par l'article 15 I couvre le licenciement, la rupture conventionnelle, la fin de CDD ou le non-renouvellement de contrat, mais n'inclut pas la démission volontaire ni le départ à la retraite. En revanche, si le logement est situé en zone tendue, le préavis est d'un mois dans tous les cas.",
  },
  {
    question: "Comment est calculé le loyer du dernier mois de préavis ?",
    answer:
      "Lorsque le préavis se termine en cours de mois, le loyer et les charges du dernier mois sont dus au prorata du nombre de jours écoulés jusqu'à l'expiration du préavis (sauf si un nouveau locataire entre dans les lieux plus tôt avec l'accord du bailleur). Vous pouvez calculer ce montant au centime près sur notre calculateur de prorata de loyer.",
  },
];

function CalculateurPreavisJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Calculateur de préavis", url: "https://lokna.fr/outils/calculateur-preavis" },
    ]),
    buildWebApplicationSchema({
      name: "Calculateur de Préavis de Location (Locataire & Propriétaire)",
      description:
        "Calculez la durée légale du préavis (1, 3 ou 6 mois) et la date exacte de fin de bail de quantième à quantième selon la loi du 6 juillet 1989.",
      url: "/outils/calculateur-preavis",
    }),
    buildHowToSchema({
      name: "Comment calculer son délai et sa date de fin de préavis",
      description:
        "Déterminez le délai de préavis applicable (1, 3 ou 6 mois) et la date exacte d'effet du congé.",
      url: "/outils/calculateur-preavis",
      steps: [
        {
          name: "Indiquez qui donne congé et le type de bail",
          text: "Choisissez entre un congé donné par le locataire ou par le propriétaire bailleur, en location vide, meublée ou bail mobilité.",
        },
        {
          name: "Sélectionnez le motif éventuel de préavis réduit",
          text: "En location vide côté locataire, indiquez si le bien est en zone tendue ou si un motif légal (emploi, mutation, santé, RSA/AAH) s'applique.",
        },
        {
          name: "Renseignez la date de réception ou d'échéance",
          text: "L'outil calcule la date exacte de quantième à quantième conformément à l'article 641 du Code de procédure civile.",
        },
      ],
    }),
    buildFAQPageSchema(FAQ_ITEMS)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

export default function CalculateurPreavisPage() {
  return (
    <>
      <CalculateurPreavisJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Outil gratuit · sans inscription"
            title="Calculateur de préavis de location (locataire et propriétaire)"
            intro="Déterminez la durée légale du préavis (1 mois, 3 mois ou 6 mois) et calculez la date exacte de fin de préavis ou de notification de quantième à quantième selon la loi du 6 juillet 1989."
            facts={[
              { label: "Locataire", value: "1 mois (meublé / réduit) ou 3 mois" },
              { label: "Propriétaire", value: "6 mois (vide) ou 3 mois (meublé)" },
              { label: "Calcul des dates", value: "Quantième à quantième (art. 641 CPC)" },
            ]}
          />

          <div className="mt-10">
            <PreavisCalculatorClient />
          </div>

          <section aria-labelledby="regles-preavis-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="regles-preavis-title" className="text-[17px] font-semibold text-ink">
              Les 4 règles légales du préavis locatif
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {REGLES_PREAVIS.map((item) => (
                <li key={item} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-ink-muted">
              Sources :{" "}
              <a
                href="https://www.service-public.gouv.fr/particuliers/vosdroits/F1168"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Service-Public.fr — Préavis et congé du locataire (F1168)
              </a>{" "}
              et{" "}
              <Link
                href="/glossaire-immobilier/preavis-loyer"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
              >
                notre fiche glossaire sur le préavis
              </Link>
              .
            </p>
          </section>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="explications-preavis" title="Comment fonctionnent les délais de préavis en location vide et meublée ?">
              <p>
                La loi n° 89-462 du 6 juillet 1989 organise un équilibre asymétrique entre les parties au contrat de location :
                le locataire peut donner congé à tout moment sans motif, tandis que le propriétaire bailleur ne peut récupérer
                son bien qu&apos;à l&apos;échéance du bail et pour trois motifs limitativement énumérés par la loi.
              </p>
              <h3>1. Congé donné par le locataire : 1 mois ou 3 mois</h3>
              <p>
                En location meublée (article 25-8) comme en bail mobilité (article 25-15), le préavis du locataire est toujours
                d&apos;<strong>un mois</strong>. En location vide (article 15 I), le délai de principe est de{" "}
                <strong>trois mois</strong>, mais il est ramené à <strong>un mois</strong> dès lors que le logement est situé en
                zone tendue ou que le locataire justifie d&apos;un événement professionnel (premier emploi, mutation, perte
                d&apos;emploi, nouvel emploi consécutif à une perte d&apos;emploi), médical ou social (RSA, AAH, attribution
                d&apos;un logement social). Consultez notre{" "}
                <Link href="/templates/conge-locataire">modèle de lettre de congé locataire</Link>.
              </p>
              <h3>2. Congé donné par le propriétaire bailleur : 6 mois ou 3 mois avant l&apos;échéance</h3>
              <p>
                Le bailleur doit notifier son congé au moins <strong>six mois</strong> avant la fin du bail en location vide et{" "}
                <strong>trois mois</strong> avant en location meublée. S&apos;il s&apos;agit d&apos;un congé pour vendre, utilisez
                directement notre <Link href="/outils/generateur-conge-vente">générateur de congé pour vente</Link> ou notre{" "}
                <Link href="/templates/conge-proprietaire">modèle de congé propriétaire</Link>.
              </p>
              <h3>3. Que préparer avant la fin du préavis ?</h3>
              <p>
                Lorsque le préavis s&apos;achève en cours de mois, calculez la dernière échéance sur notre{" "}
                <Link href="/outils/calculateur-loyer">calculateur de prorata de loyer</Link>, préparez la remise des clés avec
                notre <Link href="/outils/checklist-etat-lieux">checklist d&apos;état des lieux</Link> et vérifiez le délai de
                remboursement sur notre{" "}
                <Link href="/outils/calculateur-depot-garantie">calculateur de dépôt de garantie</Link>.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur le préavis de location" />
          </div>

          <div className="mt-16">
            <ToolCta title="Suivez vos baux et vos fins de location dans Lokna">
              Retrouvez les dates d&apos;échéance de vos baux, calculez vos proratas d&apos;entrée ou de sortie et éditez vos
              quittances PDF dans un seul espace.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}