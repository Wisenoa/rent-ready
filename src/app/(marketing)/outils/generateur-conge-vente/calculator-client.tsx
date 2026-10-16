"use client";

import { useState } from "react";

import { AMOUNT_ERROR_MESSAGES, formatEuros, parseAmount } from "@/lib/tools/amount";
import {
  computeCongeVente,
  CONGE_VENTE_ERROR_MESSAGES,
  type TypeBailConge,
} from "@/lib/tools/conge-vente";
import { CopyButton } from "@/components/marketing/tools/CopyButton";
import {
  AmountField,
  ChoiceGroup,
  DateField,
  TextField,
  ToolSheet,
  ToolStep,
  ToolWorkbench,
} from "@/components/marketing/tools/ToolForm";
import {
  DocumentSheet,
  ResultBadge,
  ResultJump,
  ResultPanel,
  ResultPending,
} from "@/components/marketing/tools/ToolResult";

export function CongeVenteClient() {
  const [typeBail, setTypeBail] = useState<TypeBailConge>("vide");
  const [dateEcheanceBail, setDateEcheanceBail] = useState("2026-11-30");
  const [dateCourrier, setDateCourrier] = useState("2026-04-15");

  const [prixVenteInput, setPrixVenteInput] = useState("245000");
  const [descriptionBien, setDescriptionBien] = useState(
    "Appartement T3 de 62 m² au 3e étage (lot n° 14) et cave n° 8 en sous-sol"
  );
  const [conditionsPaiement, setConditionsPaiement] = useState(
    "Paiement comptant à la signature de l'acte authentique devant notaire, hors frais d'acte notarié à la charge de l'acquéreur"
  );

  const [bailleurNom, setBailleurNom] = useState("Hélène Marchand");
  const [bailleurAdresse, setBailleurAdresse] = useState("19 cours Mirabeau, 13100 Aix-en-Provence");
  const [locataireNom, setLocataireNom] = useState("Nicolas Bernard");
  const [bienAdresse, setBienAdresse] = useState("42 rue de la République, 13001 Marseille");
  const [villeCourrier, setVilleCourrier] = useState("Aix-en-Provence");
  const [edited, setEdited] = useState(false);

  const mark = <T,>(setter: (val: T) => void) => (val: T) => {
    setEdited(true);
    setter(val);
  };

  const parsedPrix = parseAmount(prixVenteInput, 50_000_000);
  const prixError = !parsedPrix.ok
    ? AMOUNT_ERROR_MESSAGES[parsedPrix.error]
    : parsedPrix.value.isZero()
      ? CONGE_VENTE_ERROR_MESSAGES["zero-price"]
      : null;

  const outcome =
    !prixError && parsedPrix.ok
      ? computeCongeVente({
          typeBail,
          dateEcheanceBail,
          dateCourrier,
          prixVente: parsedPrix.value,
          conditionsPaiement,
          descriptionBien,
          bailleurNom,
          bailleurAdresse,
          locataireNom,
          bienAdresse,
          villeCourrier,
        })
      : null;

  const domainError = outcome && !outcome.ok ? CONGE_VENTE_ERROR_MESSAGES[outcome.error] : null;
  const conge = outcome && outcome.ok ? outcome.result : null;

  return (
    <ToolWorkbench
      variant="document"
      form={
        <ToolSheet label="Générateur de lettre de congé pour vente">
          <ToolStep
            step={1}
            title="Type de bail et échéance"
            description="Le congé pour vente ne peut prendre effet qu'à l'échéance du bail en cours. Le délai court à compter de la réception effective par le locataire."
          >
            <ChoiceGroup
              name="type-bail-conge"
              legend="Nature du contrat de location"
              value={typeBail}
              onChange={mark(setTypeBail)}
              choices={[
                {
                  value: "vide",
                  label: "Location vide (art. 15)",
                  description: "Préavis 6 mois · droit de préemption du locataire",
                },
                {
                  value: "meublee",
                  label: "Location meublée (art. 25-8)",
                  description: "Préavis 3 mois · sans droit de préemption légal",
                },
              ]}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <DateField
                id="conge-date-echeance"
                label="Date d'échéance du bail"
                value={dateEcheanceBail}
                onChange={mark(setDateEcheanceBail)}
                error={domainError}
                hint={
                  conge
                    ? `Réception impérative au plus tard le ${conge.dateLimiteReceptionFr}.`
                    : undefined
                }
              />
              <DateField
                id="conge-date-courrier"
                label="Date d'envoi prévue du courrier"
                value={dateCourrier}
                onChange={mark(setDateCourrier)}
              />
            </div>

            {conge && conge.estHorsDelai ? (
              <div className="rounded-lg border border-[#EAD7AE] bg-[#FBF3E2] px-4 py-3 text-[13.5px] leading-5 text-[#7A5512]">
                <strong>Attention au délai légal :</strong> pour une échéance au {conge.dateEcheanceFr}, le locataire doit avoir{" "}
                <strong>reçu</strong> le congé au plus tard le {conge.dateLimiteReceptionFr} ({conge.delaiPreavisMois} mois avant
                l&apos;échéance). Passé cette date, le bail est reconduit tacitement.
              </div>
            ) : null}
          </ToolStep>

          <ToolStep
            step={2}
            title="Prix, conditions et désignation des locaux vendus"
            description="En location vide, l'indication du prix de vente et la désignation exacte des locaux loués sont exigées à peine de nullité du congé."
          >
            <AmountField
              id="conge-prix-vente"
              label="Prix de vente proposé (hors frais d'acte notarié)"
              value={prixVenteInput}
              onChange={mark(setPrixVenteInput)}
              placeholder="245000"
              suffix="€"
              error={prixError}
            />

            <TextField
              id="conge-description-bien"
              label="Désignation précise des locaux loués et annexes vendus"
              value={descriptionBien}
              onChange={mark(setDescriptionBien)}
              placeholder="Ex. Appartement T3 de 62 m² au 3e étage (lot n° 14) et cave n° 8"
              hint="Reprenez la consistance exacte figurant dans le contrat de location."
            />

            <TextField
              id="conge-conditions-paiement"
              label="Modalités de paiement du prix"
              value={conditionsPaiement}
              onChange={mark(setConditionsPaiement)}
              placeholder="Paiement comptant le jour de la signature de l'acte authentique"
            />
          </ToolStep>

          <ToolStep
            step={3}
            title="Identité du bailleur et du locataire"
            description="Si le logement est loué à plusieurs colocataires ou époux cotitulaires, le congé doit être notifié à chacun d'eux."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="conge-bailleur-nom"
                label="Nom et prénom du bailleur (ou SCI)"
                value={bailleurNom}
                onChange={mark(setBailleurNom)}
                placeholder="Ex. Hélène Marchand"
              />
              <TextField
                id="conge-bailleur-adresse"
                label="Adresse du bailleur"
                value={bailleurAdresse}
                onChange={mark(setBailleurAdresse)}
                placeholder="Ex. 19 cours Mirabeau, 13100 Aix-en-Provence"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField
                id="conge-locataire-nom"
                label="Nom et prénom du locataire"
                value={locataireNom}
                onChange={mark(setLocataireNom)}
                placeholder="Ex. Nicolas Bernard"
              />
              <TextField
                id="conge-bien-adresse"
                label="Adresse du logement loué"
                value={bienAdresse}
                onChange={mark(setBienAdresse)}
                placeholder="Ex. 42 rue de la République, 13001 Marseille"
              />
            </div>
            <TextField
              id="conge-ville-courrier"
              label="Fait à (ville)"
              value={villeCourrier}
              onChange={mark(setVilleCourrier)}
              placeholder="Aix-en-Provence"
            />
          </ToolStep>

          {conge ? (
            <ResultJump
              label={`Congé pour vente (${conge.delaiPreavisMois} mois)`}
              value={`Avant le ${conge.dateLimiteReceptionFr}`}
              detail={`Offre à ${formatEuros(conge.prixVente)}`}
            />
          ) : null}
        </ToolSheet>
      }
      result={
        <ResultPanel
          title="Calendrier & lettre de congé"
          badge={
            conge ? (
              edited ? (
                <ResultBadge tone="sage">Votre courrier</ResultBadge>
              ) : (
                <ResultBadge tone="example">Exemple pré-rempli</ResultBadge>
              )
            ) : null
          }
          footer={
            conge ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CopyButton
                    text={conge.plainText}
                    label="Copier le congé (avec mentions légales)"
                    copiedLabel="Congé copié"
                  />
                </div>
                <p className="text-[12px] leading-4.5 text-ink-muted">
                  {conge.droitPreemption
                    ? "N'oubliez pas de joindre la notice d'information obligatoire (arrêté du 13 décembre 2017). Les 5 premiers alinéas de l'article 15 II sont inclus dans le texte copié."
                    : "Notifiez ce congé par LRAR, acte de commissaire de justice ou remise en main propre contre récépissé ou émargement."}
                </p>
              </div>
            ) : undefined
          }
        >
          {conge ? (
            <div className="space-y-4">
              <dl className="grid grid-cols-2 gap-2.5 rounded-xl border border-line-soft bg-paper p-3.5 text-[13px]">
                <div>
                  <dt className="text-[11.5px] text-ink-muted">Réception au plus tard le</dt>
                  <dd className="mt-0.5 font-semibold text-forest-deep">{conge.dateLimiteReceptionFr}</dd>
                </div>
                <div>
                  <dt className="text-[11.5px] text-ink-muted">Échéance du bail</dt>
                  <dd className="mt-0.5 font-semibold text-ink">{conge.dateEcheanceFr}</dd>
                </div>
                {conge.finOffrePreemptionFr ? (
                  <div className="col-span-2 border-t border-line-soft pt-2">
                    <dt className="text-[11.5px] text-ink-muted">
                      Délai d&apos;acceptation de l&apos;offre par le locataire (2 premiers mois du préavis)
                    </dt>
                    <dd className="mt-0.5 font-medium text-ink">
                      Du {conge.dateLimiteReceptionFr} au {conge.finOffrePreemptionFr}
                    </dd>
                  </div>
                ) : null}
              </dl>

              <DocumentSheet>
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-3 text-[12.5px]">
                  <div>
                    <p className="font-semibold text-ink">{bailleurNom || "Nom du bailleur"}</p>
                    <p className="text-ink-muted">{bailleurAdresse || "Adresse du bailleur"}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-ink">À {locataireNom || "Nom du locataire"}</p>
                    <p className="text-ink-muted">{bienAdresse || "Adresse du logement"}</p>
                  </div>
                </div>

                <p className="mt-3 rounded-lg bg-cream/70 px-3 py-2 text-[12.5px] font-semibold text-ink">
                  {conge.objet}
                </p>

                <div className="mt-3.5 space-y-2.5 text-[12.8px] leading-5 text-ink">
                  {conge.paragraphs.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>

                <p className="mt-3.5 text-right text-[12.5px] font-semibold text-ink">
                  {bailleurNom || "Signature du bailleur"}
                </p>

                {conge.alineasArt15 ? (
                  <details className="mt-4 border-t border-line-soft pt-3 text-[11.5px] leading-4.5 text-ink-muted">
                    <summary className="cursor-pointer font-semibold text-forest">
                      Voir les 5 alinéas de l&apos;article 15 II reproduits à peine de nullité
                    </summary>
                    <div className="mt-2 space-y-2">
                      {conge.alineasArt15.map((a, idx) => (
                        <p key={idx}>{a}</p>
                      ))}
                    </div>
                  </details>
                ) : null}
              </DocumentSheet>
            </div>
          ) : (
            <ResultPending>
              Complétez la date d&apos;échéance du bail et le prix de vente pour calculer la date limite de notification et
              afficher le courrier.
            </ResultPending>
          )}
        </ResultPanel>
      }
    />
  );
}
