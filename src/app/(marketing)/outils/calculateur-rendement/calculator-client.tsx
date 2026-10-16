"use client";

import { useState } from "react";
import Decimal from "decimal.js";

import { AMOUNT_ERROR_MESSAGES, formatEuros, parseAmount } from "@/lib/tools/amount";
import {
  computeRendementLocatif,
  formatPercent,
  RENDEMENT_ERROR_MESSAGES,
} from "@/lib/tools/rendement-locatif";
import { CopyButton } from "@/components/marketing/tools/CopyButton";
import {
  AmountField,
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

const VACANCE_OPTIONS = [
  { value: "0", label: "0 mois / an (occupation 100 %)" },
  { value: "0.5", label: "0,5 mois / an (~15 jours de rotation)" },
  { value: "1", label: "1 mois / an (8,3 % de vacance)" },
  { value: "2", label: "2 mois / an (16,7 % de vacance)" },
];

export function YieldCalculatorClient() {
  return <YieldCalculatorInner />;
}

function YieldCalculatorInner() {
  const [prixAchatInput, setPrixAchatInput] = useState("185000");
  const [fraisAcquisitionInput, setFraisAcquisitionInput] = useState("14800");
  const [travauxInput, setTravauxInput] = useState("5200");

  const [loyerMensuelInput, setLoyerMensuelInput] = useState("850");
  const [vacanceMois, setVacanceMois] = useState("0.5");

  const [taxeFonciereInput, setTaxeFonciereInput] = useState("980");
  const [chargesNonRecupInput, setChargesNonRecupInput] = useState("540");
  const [assuranceInput, setAssuranceInput] = useState("240");
  const [edited, setEdited] = useState(false);

  const mark = <T,>(setter: (val: T) => void) => (val: T) => {
    setEdited(true);
    setter(val);
  };

  const pPrix = parseAmount(prixAchatInput, 50_000_000);
  const pFrais = fraisAcquisitionInput.trim() === "" ? { ok: true as const, value: new Decimal(0) } : parseAmount(fraisAcquisitionInput, 10_000_000);
  const pTravaux = travauxInput.trim() === "" ? { ok: true as const, value: new Decimal(0) } : parseAmount(travauxInput, 10_000_000);
  const pLoyer = parseAmount(loyerMensuelInput, 200_000);
  const pTf = taxeFonciereInput.trim() === "" ? { ok: true as const, value: new Decimal(0) } : parseAmount(taxeFonciereInput, 500_000);
  const pCharges = chargesNonRecupInput.trim() === "" ? { ok: true as const, value: new Decimal(0) } : parseAmount(chargesNonRecupInput, 500_000);
  const pAssurance = assuranceInput.trim() === "" ? { ok: true as const, value: new Decimal(0) } : parseAmount(assuranceInput, 200_000);

  const prixError = !pPrix.ok ? AMOUNT_ERROR_MESSAGES[pPrix.error] : pPrix.value.isZero() ? RENDEMENT_ERROR_MESSAGES["zero-price"] : null;
  const fraisError = !pFrais.ok ? AMOUNT_ERROR_MESSAGES[pFrais.error] : null;
  const travauxError = !pTravaux.ok ? AMOUNT_ERROR_MESSAGES[pTravaux.error] : null;
  const loyerError = !pLoyer.ok ? AMOUNT_ERROR_MESSAGES[pLoyer.error] : pLoyer.value.isZero() ? RENDEMENT_ERROR_MESSAGES["zero-rent"] : null;
  const tfError = !pTf.ok ? AMOUNT_ERROR_MESSAGES[pTf.error] : null;
  const chargesError = !pCharges.ok ? AMOUNT_ERROR_MESSAGES[pCharges.error] : null;
  const assuranceError = !pAssurance.ok ? AMOUNT_ERROR_MESSAGES[pAssurance.error] : null;

  const hasError = Boolean(prixError || fraisError || travauxError || loyerError || tfError || chargesError || assuranceError);

  const outcome =
    !hasError && pPrix.ok && pFrais.ok && pTravaux.ok && pLoyer.ok && pTf.ok && pCharges.ok && pAssurance.ok
      ? computeRendementLocatif({
          prixAchat: pPrix.value,
          fraisAcquisition: pFrais.value,
          travaux: pTravaux.value,
          loyerMensuelHc: pLoyer.value,
          vacanceMoisParAn: new Decimal(vacanceMois),
          taxeFonciereAnnuelle: pTf.value,
          chargesNonRecuperablesAnnuelles: pCharges.value,
          assuranceAnnuelle: pAssurance.value,
        })
      : null;

  const res = outcome && outcome.ok ? outcome.result : null;

  return (
    <ToolWorkbench
      form={
        <ToolSheet label="Calculateur de rentabilité et rendement locatif">
          <ToolStep
            step={1}
            title="Coût complet d'acquisition"
            description="Distinguez le prix d'achat net vendeur, les frais d'acquisition (notaire ~7,5 à 8 % dans l'ancien, ~2 à 3 % dans le neuf) et l'enveloppe de travaux."
          >
            <AmountField
              id="rendement-prix-achat"
              label="Prix d'achat du bien"
              value={prixAchatInput}
              onChange={mark(setPrixAchatInput)}
              placeholder="185000"
              suffix="€"
              size="lg"
              error={prixError}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <AmountField
                id="rendement-frais-notaire"
                label="Frais de notaire et d'acquisition"
                value={fraisAcquisitionInput}
                onChange={mark(setFraisAcquisitionInput)}
                placeholder="14800"
                suffix="€"
                error={fraisError}
              />
              <AmountField
                id="rendement-travaux"
                label="Travaux et ameublement"
                value={travauxInput}
                onChange={mark(setTravauxInput)}
                placeholder="5200"
                suffix="€"
                error={travauxError}
              />
            </div>
          </ToolStep>

          <ToolStep
            step={2}
            title="Loyers hors charges et vacance locative"
            description="Ne retenez que le loyer hors charges : les provisions sur charges récupérables ne constituent pas un revenu pour le bailleur."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <AmountField
                id="rendement-loyer-hc"
                label="Loyer mensuel hors charges"
                value={loyerMensuelInput}
                onChange={mark(setLoyerMensuelInput)}
                placeholder="850"
                suffix="€ / mois"
                error={loyerError}
              />
              <SelectField
                id="rendement-vacance"
                label="Vacance locative estimée"
                value={vacanceMois}
                onChange={mark(setVacanceMois)}
                options={VACANCE_OPTIONS}
              />
            </div>
          </ToolStep>

          <ToolStep
            step={3}
            title="Charges annuelles supportées par le propriétaire"
            description="Indiquez les dépenses qui restent définitivement à votre charge (hors charges récupérables sur le locataire)."
          >
            <div className="grid gap-4 sm:grid-cols-3">
              <AmountField
                id="rendement-taxe-fonciere"
                label="Taxe foncière (hors TEOM)"
                value={taxeFonciereInput}
                onChange={mark(setTaxeFonciereInput)}
                placeholder="980"
                suffix="€ / an"
                error={tfError}
              />
              <AmountField
                id="rendement-charges-copro"
                label="Charges non récupérables"
                value={chargesNonRecupInput}
                onChange={mark(setChargesNonRecupInput)}
                placeholder="540"
                suffix="€ / an"
                error={chargesError}
              />
              <AmountField
                id="rendement-assurance"
                label="Assurance PNO / GLI"
                value={assuranceInput}
                onChange={mark(setAssuranceInput)}
                placeholder="240"
                suffix="€ / an"
                error={assuranceError}
              />
            </div>
          </ToolStep>

          {res ? (
            <ResultJump
              label="Rendement net de charges"
              value={formatPercent(res.rendementNetCharges)}
              detail={`Brut : ${formatPercent(res.rendementBrutSurPrix)} · Net annuel : ${formatEuros(res.revenuNetAnnuel)}`}
            />
          ) : null}
        </ToolSheet>
      }
      result={
        <ResultPanel
          title="Rentabilité du projet"
          badge={
            res ? (
              edited ? (
                <ResultBadge tone="sage">Votre calcul</ResultBadge>
              ) : (
                <ResultBadge tone="example">Exemple · 185 000 €</ResultBadge>
              )
            ) : null
          }
          footer={
            res ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CopyButton
                  text={`Rendement brut : ${formatPercent(res.rendementBrutSurPrix)} | Rendement net de charges : ${formatPercent(res.rendementNetCharges)} | Revenu net annuel avant impôt : ${formatEuros(res.revenuNetAnnuel)}`}
                  label="Copier la synthèse"
                  copiedLabel="Synthèse copiée"
                />
              </div>
            ) : undefined
          }
        >
          {res ? (
            <>
              <ResultFigure
                label="Rendement net de charges (avant impôt)"
                text={formatPercent(res.rendementNetCharges)}
                caption={
                  <>
                    Soit <strong>{formatEuros(res.revenuNetAnnuel)}</strong> de revenu net annuel (
                    {formatEuros(res.revenuNetMensuel)} / mois) pour un coût total acte en main de{" "}
                    <strong>{formatEuros(res.coutTotalProjet)}</strong>.
                  </>
                }
              />

              <ResultRows
                rows={[
                  {
                    label: "Rendement brut (sur prix d'achat)",
                    detail: `${formatEuros(res.loyerAnnuelPlein)} ÷ ${formatEuros(res.prixAchat)}`,
                    value: formatPercent(res.rendementBrutSurPrix),
                    strong: true,
                  },
                  {
                    label: "Rendement brut acte en main",
                    detail: `Inclut ${formatEuros(res.fraisAcquisition.plus(res.travaux))} de frais et travaux`,
                    value: formatPercent(res.rendementBrutActeEnMain),
                  },
                  {
                    label: "Loyers annuels encaissés (après vacance)",
                    detail: res.perteVacanceAnnuelle.greaterThan(0)
                      ? `Après déduction de ${formatEuros(res.perteVacanceAnnuelle)} de vacance`
                      : "12 mois pleins hors charges",
                    value: formatEuros(res.loyerAnnuelEffectif),
                  },
                  {
                    label: "Charges propriétaire annuelles",
                    detail: "Taxe foncière + charges non récupérables + assurances",
                    value: `−${formatEuros(res.totalChargesAnnuelles)}`,
                  },
                  {
                    label: "Revenu net annuel avant impôt",
                    value: formatEuros(res.revenuNetAnnuel),
                    strong: true,
                  },
                ]}
              />

              <ResultFormula>
                ({formatEuros(res.loyerAnnuelEffectif)} − {formatEuros(res.totalChargesAnnuelles)}) ÷{" "}
                {formatEuros(res.coutTotalProjet)} = {formatPercent(res.rendementNetCharges)}
              </ResultFormula>
            </>
          ) : (
            <ResultPending>
              Corrigez les montants indiqués en rouge pour calculer le rendement brut et le rendement net de charges.
            </ResultPending>
          )}
        </ResultPanel>
      }
    />
  );
}
