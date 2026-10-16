import Link from "next/link";
import { Check } from "lucide-react";

import { CongeVenteClient } from "./calculator-client";
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
    title: "Générateur de Congé pour Vente 2026 — Préavis, Offre & Modèle",
    description:
      "Calculez la date limite de notification et rédigez une lettre de congé pour vendre conforme à la loi du 6 juillet 1989 (article 15 en location vide, article 25-8 en meublé).",
    url: "/outils/generateur-conge-vente",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Congé pour vente", href: "/outils/generateur-conge-vente" },
];

const REGLES_VALIDITE = [
  "Location vide (art. 15) : le congé doit être reçu par le locataire au moins 6 mois avant la date d'échéance du bail.",
  "Location meublée (art. 25-8) : le congé doit être reçu au moins 3 mois avant l'échéance du bail, sans droit de préemption légal.",
  "Offre de vente obligatoire en location vide : indication du prix, des conditions et reproduction des 5 premiers alinéas de l'article 15 II à peine de nullité.",
  "Notification par LRAR, acte de commissaire de justice ou remise en main propre contre récépissé ou émargement, accompagnée de la notice d'information en location vide.",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Quelle date compte pour le respect du préavis de 6 mois ou 3 mois ?",
    answer:
      "C'est la date de réception effective du congé par le locataire qui fait foi (date de première présentation retirée de la LRAR, date de signification par le commissaire de justice, ou date du récépissé en main propre), et non la date d'expédition du courrier. Si un pli recommandé n'est pas retiré par le locataire, le congé est considéré comme non reçu : à l'approche de la date limite, privilégiez la signification par commissaire de justice.",
  },
  {
    question: "Comment fonctionne le droit de préemption du locataire en location vide ?",
    answer:
      "En location vide à usage de résidence principale (article 15 II de la loi du 6 juillet 1989), le congé pour vendre vaut offre de vente au profit du locataire pendant les deux premiers mois du délai légal de préavis (soit entre 6 mois et 4 mois avant l'échéance du bail). S'il accepte l'offre, il dispose de 2 mois pour signer l'acte authentique, ou de 4 mois s'il indique recourir à un prêt immobilier.",
  },
  {
    question: "Le locataire d'un logement meublé bénéficie-t-il d'un droit de préemption ?",
    answer:
      "Non. L'article 25-8 de la loi du 6 juillet 1989 fixe le préavis du congé pour vendre un logement meublé à 3 mois avant l'échéance du bail et ne prévoit pas de droit de préemption légal au profit du locataire.",
  },
  {
    question: "Peut-on donner un congé pour vente après l'achat d'un bien occupé ?",
    answer:
      "Lorsque vous achetez un logement déjà occupé en location vide, l'article 15 I prévoit des délais spécifiques : si le terme du bail en cours intervient moins de 3 ans après la date d'acquisition, vous ne pouvez donner congé pour vendre qu'au terme de la première reconduction tacite ou du premier renouvellement du bail.",
  },
  {
    question: "Qu'est-ce que la protection des locataires âgés à faibles ressources ?",
    answer:
      "En vertu de l'article 15 III de la loi du 6 juillet 1989, le bailleur ne peut s'opposer au renouvellement du bail à l'égard d'un locataire âgé de plus de 65 ans (ou ayant à sa charge une personne de plus de 65 ans vivant dans le logement) dont les ressources annuelles sont inférieures au plafond en vigueur pour l'attribution des logements conventionnés, sans lui proposer un relogement correspondant à ses besoins et à ses possibilités, sauf si le bailleur remplit lui-même l'une de ces conditions d'âge ou de ressources.",
  },
];

function CongeVenteJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Congé pour vente", url: "https://lokna.fr/outils/generateur-conge-vente" },
    ]),
    buildWebApplicationSchema({
      name: "Générateur de Congé pour Vente",
      description:
        "Calculez la date limite de notification et rédigez une lettre de congé pour vente conforme aux articles 15 et 25-8 de la loi du 6 juillet 1989.",
      url: "/outils/generateur-conge-vente",
    }),
    buildHowToSchema({
      name: "Comment rédiger et notifier un congé pour vente",
      description:
        "Vérifiez la date limite de réception du préavis (6 mois en vide, 3 mois en meublé) et générez la lettre avec les mentions obligatoires.",
      url: "/outils/generateur-conge-vente",
      steps: [
        {
          name: "Indiquez le type de bail et sa date d'échéance",
          text: "Sélectionnez location vide (préavis de 6 mois) ou location meublée (préavis de 3 mois) et renseignez la date de fin du bail.",
        },
        {
          name: "Précisez le prix de vente et la description des locaux",
          text: "Indiquez le prix hors frais d'acte notarié et la désignation exacte du logement et de ses annexes (cave, parking).",
        },
        {
          name: "Copiez le courrier et joignez la notice d'information",
          text: "Copiez la lettre incluant la reproduction des 5 premiers alinéas de l'article 15 II et notifiez-la par LRAR ou commissaire de justice.",
        },
      ],
    }),
    buildFAQPageSchema(FAQ_ITEMS)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

export default function CongeVentePage() {
  return (
    <>
      <CongeVenteJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Outil gratuit · sans inscription"
            title="Générateur de congé pour vente (bail vide et meublé)"
            intro="Calculez la date limite à laquelle votre locataire doit avoir reçu le congé avant l'échéance du bail et générez le courrier complet avec les mentions obligatoires des articles 15 et 25-8 de la loi du 6 juillet 1989."
            facts={[
              { label: "Location vide", value: "6 mois + droit de préemption" },
              { label: "Location meublée", value: "3 mois avant l'échéance" },
              { label: "Référence", value: "Loi n° 89-462 · art. 15 & 25-8" },
            ]}
          />

          <div className="mt-10">
            <CongeVenteClient />
          </div>

          <section aria-labelledby="validite-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="validite-title" className="text-[17px] font-semibold text-ink">
              Conditions de validité d&apos;un congé pour vendre
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {REGLES_VALIDITE.map((regle) => (
                <li key={regle} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {regle}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-ink-muted">
              Sources :{" "}
              <a
                href="https://www.service-public.gouv.fr/particuliers/vosdroits/F929"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Service-Public.fr — Congé donné par le bailleur (F929)
              </a>{" "}
              et{" "}
              <a
                href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000047897118"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Légifrance — article 15 de la loi n° 89-462 du 6 juillet 1989
              </a>
              .
            </p>
          </section>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="explications-conge-vente" title="Comment donner congé pour vendre sans risque de nullité ?">
              <p>
                Contrairement au locataire qui peut quitter les lieux à tout moment en respectant son{" "}
                <Link href="/outils/calculateur-preavis">délai de préavis</Link>, le propriétaire bailleur ne peut récupérer son
                logement pour le vendre libre d&apos;occupation qu&apos;à l&apos;échéance du contrat de bail (tous les 3 ans en
                location vide détenue par une personne physique ou une SCI familiale, tous les 6 ans pour une personne morale, et
                tous les ans en location meublée classique).
              </p>
              <h3>1. Le formalisme strict de l&apos;article 15 II en location vide</h3>
              <p>
                En location vide, le congé pour vendre vaut <strong>offre de vente</strong> au profit du locataire en place. Pour
                être valable, le courrier doit obligatoirement mentionner le prix de vente (hors commission d&apos;agence si le
                locataire achète directement sans intermédiaire) et les modalités de paiement, décrire précisément les locaux loués
                et leurs annexes (cave, stationnement), reproduire intégralement les cinq premiers alinéas de l&apos;article 15 II
                de la loi du 6 juillet 1989, et être accompagné de la notice d&apos;information ministérielle fixée par
                l&apos;arrêté du 13 décembre 2017.
              </p>
              <h3>2. Le décompte des délais : réception effective et non expédition</h3>
              <p>
                La Cour de cassation rappelle régulièrement que le délai de préavis de 6 mois (en vide) ou de 3 mois (en meublé)
                s&apos;apprécie à la date à laquelle le locataire <strong>reçoit effectivement</strong> le courrier. Si vous
                envoyez une lettre recommandée avec accusé de réception quelques jours avant la date butoir et que le locataire ne
                va la retirer au bureau de poste qu&apos;après cette date — ou ne la retire pas — le congé est tardif et le bail est
                reconduit tacitement pour 3 ans (ou 1 an en meublé). Anticipez d&apos;au moins trois semaines ou recourez à un
                commissaire de justice.
              </p>
              <h3>3. Vous souhaitez vendre le bien occupé sans donner congé ?</h3>
              <p>
                Si vous vendez le logement en cours de bail <strong>occupé</strong> (sans demander le départ du locataire), vous
                n&apos;avez pas à délivrer de congé pour vente et le locataire ne dispose pas du droit de préemption de
                l&apos;article 15 II (hors cas particuliers de première vente après division d&apos;immeuble). Le bail se poursuit
                simplement avec le nouvel acquéreur, à qui le{" "}
                <Link href="/outils/calculateur-depot-garantie">dépôt de garantie</Link> est transféré. Consultez aussi notre{" "}
                <Link href="/templates/conge-proprietaire">modèle de congé propriétaire</Link> et notre{" "}
                <Link href="/glossaire-immobilier/conge-location">entrée de glossaire sur le congé</Link>.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur le congé pour vente" />
          </div>

          <div className="mt-16">
            <ToolCta title="Centralisez les dates d'échéance de vos baux dans Lokna">
              Retrouvez sur chaque bail sa date de début, sa durée, le type de location (vide ou meublée) et les informations de
              vos locataires dans un seul espace.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}
