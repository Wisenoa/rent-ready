"use client";

import { useState } from "react";

import {
  computePreavis,
  MOTIFS_REDUITS_LABELS,
  PREAVIS_ERROR_MESSAGES,
  type AuteurConge,
  type MotifReduitLocataire,
  type TypeBailPreavis,
} from "@/lib/tools/preavis";
import { CopyButton } from "@/components/marketing/tools/CopyButton";
import {
  ChoiceGroup,
  DateField,
  SelectField,
  ToolSheet,
  ToolStep,
  ToolWorkbench,
} from "@/components/marketing/tools/ToolForm";
import {
  ResultBadge,
  ResultFigure,
  ResultFormula,
  ResultJump,
  ResultPanel,
  ResultPending,
  ResultRows,
} from "@/components/marketing/tools/ToolResult";

const MOTIF_OPTIONS = (Object.keys(MOTIFS_REDUITS_LABELS) as MotifReduitLocataire[]).map((key) => ({
  value: key,
  label: MOTIFS_REDUITS_LABELS[key],
}));

export function PreavisCalculatorClient() {
  const [auteur, setAuteur] = useState<AuteurConge>("locataire");
  const [typeBail, setTypeBail] = useState<TypeBailPreavis>("vide");
  const [motifLocataire, setMotifLocataire] = useState<MotifReduitLocataire>("zone-tendue");
  const [dateReference, setDateReference] = useState("2026-04-15");
  const [edited, setEdited] = useState(false);

  const mark = <T,>(setter: (val: T) => void) => (val: T) => {
    setEdited(true);
    setter(val);
  };

  const outcome = computePreavis({
    auteur,
    typeBail,
    motifLocataire,
    dateReference,
  });

  const dateErr = !outcome.ok ? PREAVIS_ERROR_MESSAGES[outcome.error] : null;
  const res = outcome.ok ? outcome.result : null;

  return (
    <ToolWorkbench
      form={
        <ToolSheet label="Calculateur de délai de préavis de location">
          <ToolStep
            step={1}
            title="Qui donne congé et pour quel type de bail ?"
            description="Le locataire peut donner congé à tout moment en cours de bail, tandis que le propriétaire bailleur ne peut donner congé qu'à l'échéance du contrat."
          >
            <ChoiceGroup
              name="auteur-conge"
              legend="Auteur du congé"
              value={auteur}
              onChange={mark(setAuteur)}
              choices={[
                {
                  value: "locataire",
                  label: "Congé donné par le locataire",
                  description: "À tout moment (préavis de 1 ou 3 mois)",
                },
                {
                  value: "bailleur",
                  label: "Congé donné par le propriétaire",
                  description: "À l'échéance du bail (6 ou 3 mois)",
                },
              ]}
            />

            <ChoiceGroup
              name="type-bail-preavis"
              legend="Type de contrat de location"
              value={typeBail}
              onChange={mark(setTypeBail)}
              choices={[
                {
                  value: "vide",
                  label: "Location vide",
                  description: auteur === "locataire" ? "3 mois ou 1 mois réduit" : "Préavis bailleur : 6 mois",
                },
                {
                  value: "meublee",
                  label: "Location meublée",
                  description: auteur === "locataire" ? "Préavis locataire : 1 mois" : "Préavis bailleur : 3 mois",
                },
                {
                  value: "mobilite",
                  label: "Bail mobilité",
                  description: "1 à 10 mois (préavis locataire 1 mois)",
                },
              ]}
            />
          </ToolStep>

          {auteur === "locataire" && typeBail === "vide" ? (
            <ToolStep
              step={2}
              title="Situation géographique ou motif légal de réduction"
              description="En location vide, l'article 15 I de la loi du 6 juillet 1989 réduit le préavis du locataire de 3 mois à 1 mois dans les communes en zone tendue ou pour l'un des motifs légaux ci-dessous."
            >
              <SelectField
                id="preavis-motif-locataire"
                label="Situation ou motif invoqué dans la lettre de congé"
                value={motifLocataire}
                onChange={(v) => mark(setMotifLocataire)(v as MotifReduitLocataire)}
                options={MOTIF_OPTIONS}
                hint="Pour bénéficier du préavis réduit à 1 mois, le motif et son justificatif doivent être joints dès l'envoi du congé."
              />
            </ToolStep>
          ) : null}

          <ToolStep
            step={auteur === "locataire" && typeBail === "vide" ? 3 : 2}
            title={
              auteur === "locataire"
                ? "Date de réception effective du congé par le bailleur"
                : "Date d'échéance du contrat de location"
            }
            description={
              auteur === "locataire"
                ? "Le préavis court à compter du jour où le propriétaire reçoit effectivement la LRAR, l'acte de commissaire de justice ou la remise en main propre contre récépissé."
                : "Indiquez la date de fin du bail en cours pour connaître la date limite à laquelle le locataire doit avoir reçu votre congé."
            }
          >
            <DateField
              id="preavis-date-reference"
              label={
                auteur === "locataire"
                  ? "Date de réception du congé par le bailleur"
                  : "Date d'échéance du bail"
              }
              value={dateReference}
              onChange={mark(setDateReference)}
              error={dateErr}
            />
          </ToolStep>

          {res ? (
            <ResultJump
              label={
                res.auteur === "locataire"
                  ? `Fin du préavis (${res.delaiMois} mois)`
                  : res.typeBail === "mobilite"
                    ? "Fin automatique du bail mobilité"
                    : `Réception au plus tard (${res.delaiMois} mois)`
              }
              value={res.dateCalculeeFr}
              detail={res.fondementLegal}
            />
          ) : null}
        </ToolSheet>
      }
      result={
        <ResultPanel
          title="Délai légal & date clé"
          badge={
            res ? (
              edited ? (
                <ResultBadge tone="sage">Votre calcul</ResultBadge>
              ) : (
                <ResultBadge tone="example">Exemple · 15 avril 2026</ResultBadge>
              )
            ) : null
          }
          footer={
            res ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CopyButton
                  text={
                    res.auteur === "locataire"
                      ? `Préavis locataire : ${res.delaiMois} mois (${res.fondementLegal}) — Réception le ${res.dateReferenceFr}, fin du préavis le ${res.dateCalculeeFr}.`
                      : `Congé bailleur : ${res.delaiMois} mois (${res.fondementLegal}) — Échéance du bail le ${res.dateReferenceFr}, réception au plus tard le ${res.dateCalculeeFr}.`
                  }
                  label="Copier le calendrier"
                  copiedLabel="Calendrier copié"
                />
              </div>
            ) : undefined
          }
        >
          {res ? (
            <>
              <ResultFigure
                label={
                  res.auteur === "locataire"
                    ? `Date de fin du préavis (${res.delaiMois} mois)`
                    : res.typeBail === "mobilite"
                      ? "Terme du bail mobilité (sans congé)"
                      : `Date limite de réception par le locataire (${res.delaiMois} mois)`
                }
                text={res.dateCalculeeFr}
                caption={<>{res.explicationRegle}</>}
              />

              <ResultRows
                rows={[
                  {
                    label: "Durée légale du préavis",
                    value: res.delaiMois === 0 ? "Aucun congé requis" : `${res.delaiMois} mois`,
                    strong: true,
                  },
                  {
                    label:
                      res.auteur === "locataire"
                        ? "Point de départ (réception par le bailleur)"
                        : "Date d'échéance du bail",
                    value: res.dateReferenceFr,
                  },
                  {
                    label:
                      res.auteur === "locataire"
                        ? "Terme du préavis (de quantième à quantième)"
                        : "Date butoir de réception par le locataire",
                    value: res.dateCalculeeFr,
                    strong: true,
                  },
                  {
                    label: "Texte de référence",
                    value: res.fondementLegal,
                  },
                  {
                    label: "Justificatif à joindre au courrier",
                    value: res.justificatifRequis ? "Obligatoire à l'envoi" : "Non requis",
                  },
                ]}
              />

              <ResultFormula>
                {res.dateReferenceFr} {res.auteur === "locataire" ? "+" : "−"} {res.delaiMois} mois (art. 641 CPC) ={" "}
                {res.dateCalculeeFr}
              </ResultFormula>
            </>
          ) : (
            <ResultPending>
              Indiquez une date valide pour calculer le terme exact du préavis de quantième à quantième.
            </ResultPending>
          )}
        </ResultPanel>
      }
    />
  );
}