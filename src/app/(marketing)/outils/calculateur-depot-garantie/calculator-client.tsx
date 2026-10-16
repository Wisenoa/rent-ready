"use client";

import { useState } from "react";
import Decimal from "decimal.js";

import { AMOUNT_ERROR_MESSAGES, formatEuros, parseAmount } from "@/lib/tools/amount";
import {
  computeDepotGarantie,
  DEPOT_GARANTIE_ERROR_MESSAGES,
  type ConformiteEtatLieux,
  type PeriodiciteLoyer,
  type TypeBailDepot,
} from "@/lib/tools/depot-garantie";
import { CopyButton } from "@/components/marketing/tools/CopyButton";
import {
  AmountField,
  ChoiceGroup,
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

const RETARD_OPTIONS = Array.from({ length: 13 }, (_, idx) => ({
  value: String(idx),
  label:
    idx === 0
      ? "0 mois (restitution dans le délai légal)"
      : idx === 1
        ? "1 période mensuelle commencée en retard (+10 %)"
        : `${idx} périodes mensuelles commencées en retard (+${idx * 10} %)`,
}));

export function DepotGarantieCalculatorClient() {
  const [typeBail, setTypeBail] = useState<TypeBailDepot>("vide");
  const [periodicite, setPeriodicite] = useState<PeriodiciteLoyer>("mensuel");
  const [loyerHcInput, setLoyerHcInput] = useState("820");

  const [conformiteEdl, setConformiteEdl] = useState<ConformiteEtatLieux>("conforme");
  const [enCopropriete, setEnCopropriete] = useState<"oui" | "non">("oui");
  const [retenuesInput, setRetenuesInput] = useState("0");
  const [moisRetard, setMoisRetard] = useState("0");
  const [edited, setEdited] = useState(false);

  const mark = <T,>(setter: (val: T) => void) => (val: T) => {
    setEdited(true);
    setter(val);
  };

  const pLoyer = parseAmount(loyerHcInput, 100_000);
  const pRetenues =
    retenuesInput.trim() === ""
      ? { ok: true as const, value: new Decimal(0) }
      : parseAmount(retenuesInput, 200_000);

  const loyerErr = !pLoyer.ok
    ? AMOUNT_ERROR_MESSAGES[pLoyer.error]
    : pLoyer.value.isZero()
      ? DEPOT_GARANTIE_ERROR_MESSAGES["zero-rent"]
      : null;
  const retenuesErr = !pRetenues.ok ? AMOUNT_ERROR_MESSAGES[pRetenues.error] : null;

  const outcome =
    !loyerErr && !retenuesErr && pLoyer.ok && pRetenues.ok
      ? computeDepotGarantie({
          typeBail,
          periodicite,
          loyerMensuelHc: pLoyer.value,
          conformiteEdl,
          enCopropriete: enCopropriete === "oui",
          retenuesJustifiees: pRetenues.value,
          moisRetardRestitution: Number(moisRetard),
        })
      : null;

  const res = outcome && outcome.ok ? outcome.result : null;

  return (
    <ToolWorkbench
      form={
        <ToolSheet label="Calculateur de dépôt de garantie (plafond légal et restitution)">
          <ToolStep
            step={1}
            title="Type de bail et loyer hors charges"
            description="Le plafond légal dépend uniquement du type de bail (1 mois HC en location vide, 2 mois HC en location meublée, 0 € en bail mobilité), que le logement soit situé en zone tendue ou non."
          >
            <ChoiceGroup
              name="type-bail-depot"
              legend="Nature du contrat de location"
              value={typeBail}
              onChange={mark(setTypeBail)}
              choices={[
                {
                  value: "vide",
                  label: "Location vide (art. 22)",
                  description: "Plafond : 1 mois de loyer hors charges",
                },
                {
                  value: "meublee",
                  label: "Location meublée (art. 25-6)",
                  description: "Plafond : 2 mois de loyer hors charges",
                },
                {
                  value: "mobilite",
                  label: "Bail mobilité (art. 25-17)",
                  description: "Dépôt de garantie interdit (0 €)",
                },
              ]}
            />

            <AmountField
              id="depot-loyer-hc"
              label="Loyer mensuel hors charges (en principal)"
              value={loyerHcInput}
              onChange={mark(setLoyerHcInput)}
              placeholder="820"
              suffix="€ / mois"
              size="lg"
              error={loyerErr}
            />

            <ChoiceGroup
              name="periodicite-loyer-depot"
              legend="Périodicité de paiement prévue au bail"
              value={periodicite}
              onChange={mark(setPeriodicite)}
              choices={[
                {
                  value: "mensuel",
                  label: "Paiement mensuel (cas général)",
                  description: "Dépôt de garantie autorisé",
                },
                {
                  value: "plus-de-deux-mois",
                  label: "Payable d'avance pour > 2 mois",
                  description: "Ex. trimestre d'avance → dépôt interdit",
                },
              ]}
            />
          </ToolStep>

          <ToolStep
            step={2}
            title="Restitution, retenues et pénalité de retard en fin de bail"
            description="En fin de location, le délai légal de restitution est de 1 mois si l'état des lieux de sortie est conforme à l'entrée, et de 2 mois en cas de différences."
          >
            <ChoiceGroup
              name="conformite-edl-depot"
              legend="État des lieux de sortie comparé à l'entrée"
              value={conformiteEdl}
              onChange={mark(setConformiteEdl)}
              choices={[
                {
                  value: "conforme",
                  label: "Conforme à l'entrée",
                  description: "Délai maximal de restitution : 1 mois",
                },
                {
                  value: "differences",
                  label: "Différences constatées",
                  description: "Délai maximal de restitution : 2 mois",
                },
              ]}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <AmountField
                id="depot-retenues"
                label="Retenues justifiées (devis, factures, impayés)"
                value={retenuesInput}
                onChange={mark(setRetenuesInput)}
                placeholder="0"
                suffix="€"
                error={retenuesErr}
              />
              <ChoiceGroup
                name="copropriete-depot"
                legend="Logement en copropriété ?"
                value={enCopropriete}
                onChange={mark(setEnCopropriete)}
                choices={[
                  { value: "oui", label: "Oui (provision 20 % max)" },
                  { value: "non", label: "Non (monopropriété)" },
                ]}
              />
            </div>

            <SelectField
              id="depot-retard"
              label="Retard éventuel de restitution (article 22 alinéa 7)"
              value={moisRetard}
              onChange={mark(setMoisRetard)}
              options={RETARD_OPTIONS}
              hint="La loi applique une majoration égale à 10 % du loyer mensuel hors charges par période mensuelle commencée en retard."
            />
          </ToolStep>

          {res ? (
            <ResultJump
              label="Plafond légal du dépôt de garantie"
              value={formatEuros(res.plafondLegal)}
              detail={`Restitution sous ${res.delaiRestitutionMois} mois : ${formatEuros(res.totalAPayerAuLocataire)}`}
            />
          ) : null}
        </ToolSheet>
      }
      result={
        <ResultPanel
          title="Plafond & restitution"
          badge={
            res ? (
              edited ? (
                <ResultBadge tone="sage">Votre calcul</ResultBadge>
              ) : (
                <ResultBadge tone="example">Exemple · 820 € HC</ResultBadge>
              )
            ) : null
          }
          footer={
            res ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CopyButton
                  text={`Plafond légal du dépôt de garantie : ${formatEuros(res.plafondLegal)} (${res.nbMoisPlafond} mois HC) | Délai de restitution : ${res.delaiRestitutionMois} mois | Montant à restituer au locataire : ${formatEuros(res.totalAPayerAuLocataire)}`}
                  label="Copier le résultat"
                  copiedLabel="Résultat copié"
                />
              </div>
            ) : undefined
          }
        >
          {res ? (
            <>
              <ResultFigure
                label="Plafond légal du dépôt de garantie à la signature"
                cents={res.plafondLegalCents}
                text={formatEuros(res.plafondLegal)}
                muted={res.plafondLegal.isZero()}
                caption={
                  res.motifInterdiction ? (
                    <>{res.motifInterdiction}</>
                  ) : (
                    <>
                      Soit <strong>{res.nbMoisPlafond} mois</strong> de loyer hors charges (
                      {formatEuros(res.loyerMensuelHc)}). Ce montant ne peut jamais être révisé en cours de bail ni
                      lors de son renouvellement.
                    </>
                  )
                }
              />

              <ResultRows
                rows={[
                  {
                    label: "Délai légal de restitution après remise des clés",
                    value: `${res.delaiRestitutionMois} mois`,
                    strong: true,
                  },
                  ...(res.provisionMaxCopropriete.greaterThan(0)
                    ? [
                        {
                          label: "Retenue provisoire maximale en copropriété (20 %)",
                          detail: "Jusqu'à l'arrêté annuel des comptes du syndicat (art. 22)",
                          value: formatEuros(res.provisionMaxCopropriete),
                        },
                      ]
                    : []),
                  {
                    label: "Retenues justifiées déduites",
                    value: `−${formatEuros(res.retenuesJustifiees)}`,
                  },
                  {
                    label: "Solde à restituer (hors pénalité de retard)",
                    value: formatEuros(res.soldeRestitueHorsPenalite),
                    strong: true,
                  },
                  ...(res.penaliteTotaleRetard.greaterThan(0)
                    ? [
                        {
                          label: `Pénalité légale de retard (${res.moisRetardRestitution} × 10 % du loyer HC)`,
                          detail: `${res.moisRetardRestitution} × ${formatEuros(res.penaliteParMois)} (art. 22 al. 7)`,
                          value: `+${formatEuros(res.penaliteTotaleRetard)}`,
                        },
                        {
                          label: "Total dû au locataire (majoration incluse)",
                          value: formatEuros(res.totalAPayerAuLocataire),
                          strong: true,
                        },
                      ]
                    : []),
                  ...(res.complementDuParLocataire.greaterThan(0)
                    ? [
                        {
                          label: "Solde restant dû par le locataire au-delà du dépôt",
                          value: formatEuros(res.complementDuParLocataire),
                          strong: true,
                        },
                      ]
                    : []),
                ]}
              />

              <ResultFormula>
                {res.nbMoisPlafond} × {formatEuros(res.loyerMensuelHc)} = {formatEuros(res.plafondLegal)} (pénalité de
                retard : {formatEuros(res.penaliteParMois)} / mois entamé)
              </ResultFormula>
            </>
          ) : (
            <ResultPending>
              Indiquez le loyer mensuel hors charges pour calculer le plafond légal du dépôt de garantie et les règles de
              restitution.
            </ResultPending>
          )}
        </ResultPanel>
      }
    />
  );
}