"use client";

import { useState } from "react";
import Decimal from "decimal.js";

import { AMOUNT_ERROR_MESSAGES, formatEuros, parseAmount } from "@/lib/tools/amount";
import {
  computeFiscaliteLmnp,
  FISCALITE_LMNP_ERROR_MESSAGES,
  type TmiRate,
} from "@/lib/tools/fiscalite-lmnp";
import { CopyButton } from "@/components/marketing/tools/CopyButton";
import {
  AmountField,
  ChoiceGroup,
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

const TMI_CHOICES: { value: `${TmiRate}`; label: string; description: string }[] = [
  { value: "0", label: "0 %", description: "Non imposable" },
  { value: "11", label: "11 %", description: "Tranche 1" },
  { value: "30", label: "30 %", description: "Tranche 2" },
  { value: "41", label: "41 %", description: "Tranche 3" },
];

export function SimulateurLmnpClient() {
  const [recettesInput, setRecettesInput] = useState("10800");
  const [chargesInput, setChargesInput] = useState("2100");
  const [interetsInput, setInteretsInput] = useState("2900");
  const [valeurBienInput, setValeurBienInput] = useState("180000");
  const [valeurMobilierInput, setValeurMobilierInput] = useState("7000");
  const [tmi, setTmi] = useState<`${TmiRate}`>("30");
  const [edited, setEdited] = useState(false);

  const mark = <T,>(setter: (val: T) => void) => (val: T) => {
    setEdited(true);
    setter(val);
  };

  const pRecettes = parseAmount(recettesInput, 1_000_000);
  const pCharges =
    chargesInput.trim() === ""
      ? { ok: true as const, value: new Decimal(0) }
      : parseAmount(chargesInput, 500_000);
  const pInterets =
    interetsInput.trim() === ""
      ? { ok: true as const, value: new Decimal(0) }
      : parseAmount(interetsInput, 500_000);
  const pBien = parseAmount(valeurBienInput, 20_000_000);
  const pMobilier =
    valeurMobilierInput.trim() === ""
      ? { ok: true as const, value: new Decimal(0) }
      : parseAmount(valeurMobilierInput, 1_000_000);

  const recettesErr = !pRecettes.ok
    ? AMOUNT_ERROR_MESSAGES[pRecettes.error]
    : pRecettes.value.isZero()
      ? FISCALITE_LMNP_ERROR_MESSAGES["zero-revenue"]
      : null;
  const chargesErr = !pCharges.ok ? AMOUNT_ERROR_MESSAGES[pCharges.error] : null;
  const interetsErr = !pInterets.ok ? AMOUNT_ERROR_MESSAGES[pInterets.error] : null;
  const bienErr = !pBien.ok
    ? AMOUNT_ERROR_MESSAGES[pBien.error]
    : pBien.value.isZero()
      ? FISCALITE_LMNP_ERROR_MESSAGES["zero-property"]
      : null;
  const mobilierErr = !pMobilier.ok ? AMOUNT_ERROR_MESSAGES[pMobilier.error] : null;

  const hasError = Boolean(recettesErr || chargesErr || interetsErr || bienErr || mobilierErr);

  const outcome =
    !hasError && pRecettes.ok && pCharges.ok && pInterets.ok && pBien.ok && pMobilier.ok
      ? computeFiscaliteLmnp({
          recettesAnnuelles: pRecettes.value,
          chargesDeductiblesAnnuelles: pCharges.value,
          interetsEmpruntAnnuels: pInterets.value,
          valeurBienImmobilier: pBien.value,
          valeurMobilierEtTravaux: pMobilier.value,
          tmi: Number(tmi) as TmiRate,
        })
      : null;

  const res = outcome && outcome.ok ? outcome.result : null;

  return (
    <ToolWorkbench
      form={
        <ToolSheet label="Simulateur de fiscalité LMNP (Micro-BIC vs Régime Réel)">
          <ToolStep
            step={1}
            title="Recettes locatives et tranche marginale d'imposition"
            description="En location meublée (LMNP), les recettes annuelles comprennent les loyers hors charges ET les provisions ou forfaits de charges encaissés."
          >
            <AmountField
              id="lmnp-recettes"
              label="Recettes locatives annuelles (loyers + charges)"
              value={recettesInput}
              onChange={mark(setRecettesInput)}
              placeholder="10800"
              suffix="€ / an"
              size="lg"
              error={recettesErr}
            />

            {res && res.depassePlafondMicroBic ? (
              <div className="rounded-lg border border-[#EAD7AE] bg-[#FBF3E2] px-4 py-3 text-[13.5px] leading-5 text-[#7A5512]">
                <strong>Plafond Micro-BIC dépassé (77 700 €) :</strong> au-delà de 77 700 € de recettes annuelles en location
                meublée longue durée (article 50-0 du CGI), le régime Réel Simplifié s&apos;applique de plein droit.
              </div>
            ) : null}

            <ChoiceGroup
              name="lmnp-tmi"
              legend="Votre tranche marginale d'imposition (TMI)"
              value={tmi}
              onChange={mark(setTmi)}
              columns={4}
              compact
              choices={TMI_CHOICES}
              hint="S'y ajoutent les prélèvements sociaux de 17,2 % sur le bénéfice BIC net imposable."
            />
          </ToolStep>

          <ToolStep
            step={2}
            title="Charges déductibles au régime réel"
            description="Indiquez vos charges annuelles réelles (taxe foncière, copropriété, assurance PNO, expert-comptable) ainsi que les intérêts d'emprunt et l'assurance de prêt."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <AmountField
                id="lmnp-charges"
                label="Charges annuelles (hors crédit)"
                value={chargesInput}
                onChange={mark(setChargesInput)}
                placeholder="2100"
                suffix="€ / an"
                error={chargesErr}
              />
              <AmountField
                id="lmnp-interets"
                label="Intérêts d'emprunt & assurance prêt"
                value={interetsInput}
                onChange={mark(setInteretsInput)}
                placeholder="2900"
                suffix="€ / an"
                error={interetsErr}
              />
            </div>
          </ToolStep>

          <ToolStep
            step={3}
            title="Valeur amortissable du bien et du mobilier"
            description="Au régime réel, la part bâtie (estimée à 85 % du bien hors terrain sur 30 ans) et le mobilier (sur 7 ans) sont amortis sans pouvoir créer de déficit fiscal (art. 39 C du CGI)."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <AmountField
                id="lmnp-valeur-bien"
                label="Valeur du bien immobilier"
                value={valeurBienInput}
                onChange={mark(setValeurBienInput)}
                placeholder="180000"
                suffix="€"
                error={bienErr}
              />
              <AmountField
                id="lmnp-valeur-mobilier"
                label="Valeur du mobilier et équipements"
                value={valeurMobilierInput}
                onChange={mark(setValeurMobilierInput)}
                placeholder="7000"
                suffix="€"
                error={mobilierErr}
              />
            </div>
          </ToolStep>

          {res ? (
            <ResultJump
              label={
                res.regimePlusAvantageux === "reel"
                  ? "Économie annuelle au Régime Réel"
                  : "Économie annuelle au Micro-BIC"
              }
              value={formatEuros(res.economieAnnuelleReel.abs())}
              detail={`Micro-BIC : ${formatEuros(res.microBic.impotTotal)} vs Réel : ${formatEuros(res.reelSimplifie.impotTotal)}`}
            />
          ) : null}
        </ToolSheet>
      }
      result={
        <ResultPanel
          title="Comparatif Micro-BIC vs Réel"
          badge={
            res ? (
              edited ? (
                <ResultBadge tone="sage">Votre simulation</ResultBadge>
              ) : (
                <ResultBadge tone="example">Exemple · 900 € / mois</ResultBadge>
              )
            ) : null
          }
          footer={
            res ? (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CopyButton
                  text={`LMNP (${formatEuros(res.recettesAnnuelles)} / an, TMI ${res.tmi} %) — Micro-BIC : ${formatEuros(res.microBic.impotTotal)} d'impôt | Régime Réel : ${formatEuros(res.reelSimplifie.impotTotal)} d'impôt (économie annuelle : ${formatEuros(res.economieAnnuelleReel.abs())}).`}
                  label="Copier le comparatif"
                  copiedLabel="Comparatif copié"
                />
              </div>
            ) : undefined
          }
        >
          {res ? (
            <>
              <ResultFigure
                label={
                  res.regimePlusAvantageux === "reel"
                    ? "Économie d'impôt annuelle avec le Régime Réel"
                    : "Économie d'impôt annuelle avec le Micro-BIC"
                }
                cents={res.economieAnnuelleCents}
                text={formatEuros(res.economieAnnuelleReel.abs())}
                caption={
                  res.regimePlusAvantageux === "reel" ? (
                    <>
                      Le <strong>Régime Réel Simplifié</strong> ramène votre fiscalité annuelle (IR + PS) à{" "}
                      <strong>{formatEuros(res.reelSimplifie.impotTotal)}</strong> contre{" "}
                      <strong>{formatEuros(res.microBic.impotTotal)}</strong> en Micro-BIC.
                    </>
                  ) : (
                    <>
                      L&apos;abattement forfaitaire de 50 % du <strong>Micro-BIC</strong> est plus avantageux que vos charges et
                      amortissements actuels.
                    </>
                  )
                }
              />

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div
                  className={`rounded-xl border p-3.5 ${
                    res.regimePlusAvantageux === "micro"
                      ? "border-forest bg-sage-50/70"
                      : "border-line-soft bg-paper"
                  }`}
                >
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-muted">Micro-BIC (50 %)</p>
                  <p className="mt-1 text-[1.25rem] font-semibold tabular-nums text-ink">
                    {formatEuros(res.microBic.impotTotal)}
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink-muted">
                    Base : {formatEuros(res.microBic.baseImposable)}
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-3.5 ${
                    res.regimePlusAvantageux === "reel"
                      ? "border-forest bg-sage-50/70"
                      : "border-line-soft bg-paper"
                  }`}
                >
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-forest">Régime Réel</p>
                  <p className="mt-1 text-[1.25rem] font-semibold tabular-nums text-forest-deep">
                    {formatEuros(res.reelSimplifie.impotTotal)}
                  </p>
                  <p className="mt-0.5 text-[12px] text-ink-muted">
                    Base : {formatEuros(res.reelSimplifie.baseImposable)}
                  </p>
                </div>
              </div>

              <ResultRows
                rows={[
                  {
                    label: "Résultat avant amortissement (Réel)",
                    detail: `${formatEuros(res.recettesAnnuelles)} − ${formatEuros(res.reelSimplifie.totalChargesEtInterets)} de charges/intérêts`,
                    value: formatEuros(res.reelSimplifie.resultatAvantAmortissement),
                  },
                  {
                    label: "Dotation annuelle aux amortissements",
                    detail: `Bâti : ${formatEuros(res.reelSimplifie.dotationAmortissementBati)} + Mobilier : ${formatEuros(res.reelSimplifie.dotationAmortissementMobilier)}`,
                    value: formatEuros(res.reelSimplifie.dotationAmortissementTotale),
                  },
                  {
                    label: "Amortissement imputé sur l'exercice (art. 39 C)",
                    detail:
                      res.reelSimplifie.amortissementReportable.greaterThan(0)
                        ? `Dont ${formatEuros(res.reelSimplifie.amortissementReportable)} mis en réserve reportable`
                        : "100 % absorbé sur l'exercice",
                    value: formatEuros(res.reelSimplifie.amortissementImpute),
                    strong: true,
                  },
                  {
                    label: `Impôt au Réel (IR ${res.tmi} % + PS 17,2 %)`,
                    detail: `Sur une base BIC imposable de ${formatEuros(res.reelSimplifie.baseImposable)}`,
                    value: formatEuros(res.reelSimplifie.impotTotal),
                    strong: true,
                  },
                  {
                    label: "Impact fiscal à la revente (loi de finances)",
                    detail: "Les amortissements déduits minorent le prix d'achat retenu pour le calcul de la plus-value (art. 150 VB)",
                    value: `+${formatEuros(res.reelSimplifie.amortissementImpute)} de PV brute`,
                  },
                ]}
              />

              <ResultFormula>
                Micro-BIC {formatEuros(res.microBic.impotTotal)} − Réel {formatEuros(res.reelSimplifie.impotTotal)} ={" "}
                {formatEuros(res.economieAnnuelleReel)} / an
              </ResultFormula>
            </>
          ) : (
            <ResultPending>
              Complétez vos recettes annuelles et la valeur du bien pour comparer le régime Micro-BIC et le régime Réel Simplifié.
            </ResultPending>
          )}
        </ResultPanel>
      }
    />
  );
}
