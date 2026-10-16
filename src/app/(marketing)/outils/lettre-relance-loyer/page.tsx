import Link from "next/link";
import { Check } from "lucide-react";

import { LettreRelanceClient } from "./calculator-client";
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
    title: "Lettre de Relance Loyer Impayé 2026 — Amiable & Mise en Demeure",
    description:
      "Générez gratuitement une lettre de relance amiable ou une mise en demeure de payer un loyer impayé (LRAR). Décompte exact loyer/charges et procédure légale.",
    url: "/outils/lettre-relance-loyer",
    ogType: "outil",
  });
}

const breadcrumb = [
  { label: "Accueil", href: "/" },
  { label: "Outils", href: "/outils" },
  { label: "Lettre de relance loyer", href: "/outils/lettre-relance-loyer" },
];

const ETAPES_PROCEDURE = [
  "J+5 à J+10 : premier rappel amiable par courrier simple ou e-mail pour écarter un simple oubli ou incident bancaire.",
  "J+15 : mise en demeure de payer envoyée par lettre recommandée avec accusé de réception (LRAR) laissant un délai de 8 jours.",
  "Information simultanée de la caution solidaire, de Visale ou de l'assurance loyers impayés (GLI) dans les délais du contrat.",
  "À défaut de règlement : commandement de payer délivré par commissaire de justice visant la clause résolutoire (délai légal de 6 semaines, art. 24 loi du 6 juillet 1989).",
];

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Quand envoyer une première lettre de relance pour loyer impayé ?",
    answer:
      "Dès 5 à 10 jours ouvrés après la date d'exigibilité prévue au bail, il est conseillé d'adresser un premier rappel amiable. Si le retard dépasse 15 jours sans réponse ni accord d'échelonnement écrit, envoyez une mise en demeure par lettre recommandée avec accusé de réception (LRAR).",
  },
  {
    question: "Quelle est la différence entre une mise en demeure et un commandement de payer ?",
    answer:
      "La mise en demeure est rédigée et envoyée par le propriétaire bailleur en LRAR pour réclamer formellement le solde impayé sous huitaine. Le commandement de payer est un acte obligatoirement signifié par un commissaire de justice (ancien huissier) : c'est lui seul qui fait courir le délai légal de 6 semaines de la clause résolutoire prévu à l'article 24 de la loi du 6 juillet 1989.",
  },
  {
    question: "Peut-on facturer des pénalités de retard ou des frais de relance au locataire ?",
    answer:
      "Non. En bail d'habitation soumis à la loi du 6 juillet 1989, l'article 4 i) et p) répute non écrite toute clause qui autorise le bailleur à percevoir des amendes ou pénalités en cas de retard de paiement, ou qui met à la charge du locataire des frais de relance ou d'expédition de quittance.",
  },
  {
    question: "Que faire si le locataire a payé une partie seulement du loyer ?",
    answer:
      "Indiquez la somme effectivement reçue dans le champ « Déjà versé » : le courrier réclamera uniquement le solde restant dû. Pour la somme encaissée, remettez un reçu de paiement partiel (et non une quittance complète) grâce à notre générateur de quittance et reçu partiel.",
  },
  {
    question: "Faut-il prévenir le garant ou la CAF en cas d'impayé ?",
    answer:
      "Oui. Si le bail comporte une caution solidaire ou une garantie Visale / GLI, vérifiez les délais de déclaration imposés par l'acte de cautionnement ou la police d'assurance. Lorsque le locataire perçoit une aide au logement (APL) et que l'impayé atteint au moins deux mois de loyer net ou deux fois le montant brut, le bailleur doit le signaler à la CAF ou à la MSA.",
  },
];

function LettreRelanceJsonLd() {
  const schema = buildGraphSchema(
    buildBreadcrumbSchema([
      { name: "Accueil", url: "https://lokna.fr" },
      { name: "Outils", url: "https://lokna.fr/outils" },
      { name: "Lettre de relance loyer", url: "https://lokna.fr/outils/lettre-relance-loyer" },
    ]),
    buildWebApplicationSchema({
      name: "Générateur de Lettre de Relance Loyer Impayé",
      description:
        "Rédigez gratuitement une lettre de relance amiable ou une mise en demeure de payer un loyer impayé (LRAR) avec décompte exact loyer et charges.",
      url: "/outils/lettre-relance-loyer",
    }),
    buildHowToSchema({
      name: "Comment rédiger une lettre de relance pour loyer impayé",
      description:
        "Obtenez un courrier de relance amiable ou une mise en demeure en LRAR avec le décompte précis des sommes dues.",
      url: "/outils/lettre-relance-loyer",
      steps: [
        {
          name: "Choisissez le niveau de relance",
          text: "Sélectionnez la relance amiable pour un premier retard ou la mise en demeure en LRAR avant saisine d'un commissaire de justice.",
        },
        {
          name: "Renseignez les montants de l'échéance",
          text: "Indiquez le loyer hors charges, les provisions sur charges et un éventuel paiement partiel déjà encaissé.",
        },
        {
          name: "Complétez les coordonnées et copiez le courrier",
          text: "Vérifiez l'aperçu complet de la lettre et copiez-la en un clic pour votre envoi.",
        },
      ],
    }),
    buildFAQPageSchema(FAQ_ITEMS)
  );
  return <SchemaMarkup data={schema} breadcrumbRenderedByComponent />;
}

export default function LettreRelanceLoyerPage() {
  return (
    <>
      <LettreRelanceJsonLd />
      <div className="bg-cream">
        <div className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
          <ToolHeader
            breadcrumb={breadcrumb}
            eyebrow="Outil gratuit · sans inscription"
            title="Générateur de lettre de relance de loyer impayé"
            intro="Rédigez en quelques secondes un premier rappel amiable ou une mise en demeure formelle en LRAR avec le décompte exact du loyer, des charges et d'un éventuel paiement partiel."
            facts={[
              { label: "2 modèles", value: "Relance amiable & Mise en demeure LRAR" },
              { label: "Cadre légal", value: "Loi n° 89-462 · art. 7 et 24" },
              { label: "Clause résolutoire", value: "6 semaines après commandement" },
            ]}
          />

          <div className="mt-10">
            <LettreRelanceClient />
          </div>

          <section aria-labelledby="procedure-title" className="mt-8 rounded-2xl border border-line bg-paper px-5 py-6 sm:px-7">
            <h2 id="procedure-title" className="text-[17px] font-semibold text-ink">
              Calendrier légal en cas de retard de loyer
            </h2>
            <ul className="mt-4 grid gap-x-8 gap-y-3 md:grid-cols-2">
              {ETAPES_PROCEDURE.map((etape) => (
                <li key={etape} className="flex gap-2.5 text-[14.5px] leading-6 text-ink">
                  <Check aria-hidden="true" className="mt-1 size-4 shrink-0 text-sage-600" strokeWidth={2.25} />
                  {etape}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[14px] leading-6 text-ink-muted">
              Sources :{" "}
              <a
                href="https://www.service-public.gouv.fr/particuliers/vosdroits/F31272"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Service-Public.fr — Impayés de loyer (F31272)
              </a>{" "}
              et{" "}
              <a
                href="https://www.legifrance.gouv.fr/loda/article_lc/LEGIARTI000047897103"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
                rel="noopener"
              >
                Légifrance — article 24 de la loi du 6 juillet 1989
              </a>
              . Consultez également notre{" "}
              <Link
                href="/guides/relance-loyer"
                className="text-forest underline decoration-sage-300 underline-offset-4 hover:decoration-forest"
              >
                guide de la relance de loyer impayé
              </Link>
              .
            </p>
          </section>

          <div className="mt-16 space-y-14">
            <ToolExplainer id="explications-relance" title="Comment réagir face à un loyer impayé sans commettre d'erreur de procédure ?">
              <p>
                Le paiement du loyer et des charges récupérables aux termes convenus constitue la première obligation du
                locataire en vertu de l&apos;article 7 a) de la loi n° 89-462 du 6 juillet 1989. Lorsqu&apos;une échéance reste
                impayée, agir avec méthode permet à la fois de favoriser une régularisation rapide et de conserver des preuves
                datées si une procédure de recouvrement devient nécessaire.
              </p>
              <h3>Étape 1 : le rappel amiable (J+5 à J+10)</h3>
              <p>
                La majorité des retards proviennent d&apos;un changement de coordonnées bancaires, d&apos;un oubli de virement
                manuel ou d&apos;un décalage ponctuel de trésorerie. Un courrier courtois rappelant le détail de l&apos;échéance
                permet de débloquer la situation sans dégrader la relation locative. Si le locataire effectue un versement
                partiel, délivrez-lui un reçu avec notre{" "}
                <Link href="/outils/generateur-quittance">générateur de quittance et reçu partiel</Link>.
              </p>
              <h3>Étape 2 : la mise en demeure par LRAR (J+15)</h3>
              <p>
                En l&apos;absence de réponse, adressez une{" "}
                <Link href="/templates/relance-loyer-impaye">mise en demeure de payer</Link> par lettre recommandée avec accusé de
                réception (LRAR). Ce courrier établit formellement la date de votre réclamation, fixe un délai de huit jours pour
                solder la dette et prépare, en parallèle, la déclaration auprès de la caution solidaire ou de votre assurance
                loyers impayés.
              </p>
              <h3>Étape 3 : le commandement de payer et le délai de 6 semaines</h3>
              <p>
                Depuis la loi n° 2023-668 du 27 juillet 2023 modifiant l&apos;article 24 de la loi du 6 juillet 1989, tout contrat
                de bail d&apos;habitation contient obligatoirement une clause résolutoire pour défaut de paiement du loyer ou des
                charges. Pour la mettre en œuvre, vous devez mandater un commissaire de justice qui délivre un{" "}
                <strong>commandement de payer</strong>. Le locataire dispose alors d&apos;un délai légal de{" "}
                <strong>six semaines</strong> (contre deux mois auparavant) pour régler sa dette ou solliciter des délais de
                paiement auprès du juge.
              </p>
            </ToolExplainer>

            <ToolFaq items={FAQ_ITEMS} title="Questions fréquentes sur la relance de loyer" />
          </div>

          <div className="mt-16">
            <ToolCta title="Visualisez d'un coup d'œil vos loyers encaissés et les soldes en attente">
              Dans Lokna, chaque échéance affiche immédiatement si le loyer est réglé, partiellement payé ou en retard, avec le
              calcul exact du solde restant dû par locataire.
            </ToolCta>
          </div>
        </div>
      </div>
    </>
  );
}
