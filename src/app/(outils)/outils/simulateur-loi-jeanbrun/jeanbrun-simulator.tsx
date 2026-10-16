"use client";

import { useState } from "react";
import Decimal from "decimal.js";

import { AMOUNT_ERROR_MESSAGES, formatEuros, parseAmount } from "@/lib/tools/amount";
import type { TmiRate } from "@/lib/tools/fiscalite-lmnp";
import {
  computeLoiJeanbrun,
  LOI_JEANBRUN_ERROR_MESSAGES,
} from "@/lib/tools/loi-jeanbrun";
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

export function JeanbrunSimulator() {
  const [prixInput, setPrixInput] = useState("210000");
  const [loyerMensuelInput, setLoyerMensuelInput] = useState("920");
  const [chargesAnnuellesInput, setChargesAnnuellesInput] = useState("2400");
  const [tmi, setTmi] = useState<`${TmiRate}`>("30");
  const [edited, setEdited] = useState(false);

  const mark = <T,>(setter: (val: T) => void) => (val: T) => {
    setEdited(true);
    setter(val);
  };

  const pPrix = parseAmount(prixInput, 20_000_000);
  const pLoyer = parseAmount(loyerMensuelInput, 100_000);
  const pCharges =
    chargesAnnuellesInput.trim() === ""
      ? { ok: true as const, value: new Decimal(0) }
      : parseAmount(chargesAnnuellesInput, 500_000);

  const prixErr = !pPrix.ok
    ? AMOUNT_ERROR_MESSAGES[pPrix.error]
    : pPrix.value.isZero()
      ? LOI_JEANBRUN_ERROR_MESSAGES["zero-price"]
      : null;
  const loyerErr = !pLoyer.ok
    ? AMOUNT_ERROR_MESSAGES[pLoyer.error]
    : pLoyer.value.isZero()
      ? LOI_JEANBRUN_ERROR_MESSAGES["zero-rent"]
      : null;
  const chargesErr = !pCharges.ok ? AMOUNT_ERROR_MESSAGES[pCharges.error] : null;

  const outcome =
    !prixErr && !loyerErr && !chargesErr && pPrix.ok && pLoyer.ok && pCharges.ok
      ? computeLoiJeanbrun({
          prixAcquisition: pPrix.value,
          loyerMensuelHc: pLoyer.value,
          chargesAnnuellesDeductibles: pCharges.value,
          tmi: Number(tmi) as TmiRate,
        })
      : null;

  const res = outcome && outcome.ok ? outcome.result : null;

  return (
    <div className="space-y-8">
      <ToolWorkbench
        form={
          <ToolSheet label="Simulateur d'amortissement dégressif sur 9 ans (dispositif Jeanbrun) vs LMNP">
            <ToolStep
              step={1}
              title="Prix d'acquisition et loyer mensuel"
              description="La base amortissable retenue pour le barème dégressif sur 9 ans représente 80 % du prix d'acquisition (exclusion forfaitaire de 20 % au titre du terrain)."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <AmountField
                  id="jeanbrun-prix"
                  label="Prix d'acquisition du bien"
                  value={prixInput}
                  onChange={mark(setPrixInput)}
                  placeholder="210000"
                  suffix="€"
                  error={prixErr}
                />
                <AmountField
                  id="jeanbrun-loyer"
                  label="Loyer mensuel hors charges"
                  value={loyerMensuelInput}
                  onChange={mark(setLoyerMensuelInput)}
                  placeholder="920"
                  suffix="€ / mois"
                  error={loyerErr}
                />
              </div>
            </ToolStep>

            <ToolStep
              step={2}
              title="Charges annuelles et tranche d'imposition"
              description="Le simulateur compare sur 9 ans la fiscalité totale (TMI + 17,2 % de prélèvements sociaux) selon trois profils : Micro-BIC (abattement 50 %), LMNP Réel linéaire et amortissement dégressif (5,5 % / 4,5 % / 3,5 %)."
            >
              <AmountField
                id="jeanbrun-charges"
                label="Charges annuelles déductibles (taxe foncière, copropriété, intérêts)"
                value={chargesAnnuellesInput}
                onChange={mark(setChargesAnnuellesInput)}
                placeholder="2400"
                suffix="€ / an"
                error={chargesErr}
              />

              <ChoiceGroup
                name="jeanbrun-tmi"
                legend="Tranche marginale d'imposition (TMI)"
                value={tmi}
                onChange={mark(setTmi)}
                columns={4}
                compact
                choices={TMI_CHOICES}
              />
            </ToolStep>

            {res ? (
              <ResultJump
                label="Économie sur 9 ans vs Micro-BIC"
                value={formatEuros(res.cumul9Ans.economieVsMicroBic)}
                detail={`Impôt 9 ans : ${formatEuros(res.cumul9Ans.impotAmortissementDegressif)}`}
              />
            ) : null}
          </ToolSheet>
        }
        result={
          <ResultPanel
            title="Comparaison fiscale sur 9 ans"
            badge={
              res ? (
                edited ? (
                  <ResultBadge tone="sage">Votre simulation</ResultBadge>
                ) : (
                  <ResultBadge tone="example">Exemple · 210 000 €</ResultBadge>
                )
              ) : null
            }
            footer={
              res ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CopyButton
                    text={`Comparatif sur 9 ans (${formatEuros(res.prixAcquisition)}, TMI ${res.tmi} %) : Micro-BIC ${formatEuros(res.cumul9Ans.impotMicroBic)} | LMNP linéaire ${formatEuros(res.cumul9Ans.impotLmnpLineaire)} | Amortissement dégressif 9 ans ${formatEuros(res.cumul9Ans.impotAmortissementDegressif)} (économie vs Micro-BIC : ${formatEuros(res.cumul9Ans.economieVsMicroBic)}).`}
                    label="Copier le comparatif 9 ans"
                    copiedLabel="Comparatif copié"
                  />
                </div>
              ) : undefined
            }
          >
            {res ? (
              <>
                <ResultFigure
                  label="Économie d'impôt cumulée sur 9 ans (vs Micro-BIC)"
                  cents={res.cumul9Ans.economieVsMicroBicCents}
                  text={formatEuros(res.cumul9Ans.economieVsMicroBic)}
                  caption={
                    <>
                      Pour un amortissement dégressif total de{" "}
                      <strong>{formatEuros(res.cumul9Ans.amortissementTotalDegressif)}</strong> sur 9 ans (base bâtie
                      80 % = {formatEuros(res.baseAmortissable80Pct)}).
                    </>
                  }
                />

                <ResultRows
                  rows={[
                    {
                      label: "Impôt cumulé sur 9 ans en Micro-BIC (50 %)",
                      detail: `Taux global ${res.tauxGlobalImpositionPct.toFixed(1).replace(".", ",")} % (TMI ${res.tmi} % + PS 17,2 %)`,
                      value: formatEuros(res.cumul9Ans.impotMicroBic),
                    },
                    {
                      label: "Impôt cumulé sur 9 ans en LMNP Réel linéaire",
                      detail: "85 % du bien amorti linéairement sur 30 ans",
                      value: formatEuros(res.cumul9Ans.impotLmnpLineaire),
                    },
                    {
                      label: "Impôt cumulé sur 9 ans (profil dégressif 5,5 / 4,5 / 3,5 %)",
                      detail: "80 % du bien amorti par paliers de 3 ans",
                      value: formatEuros(res.cumul9Ans.impotAmortissementDegressif),
                      strong: true,
                    },
                  ]}
                />

                <ResultFormula>
                  Micro-BIC {formatEuros(res.cumul9Ans.impotMicroBic)} − Dégressif{" "}
                  {formatEuros(res.cumul9Ans.impotAmortissementDegressif)} ={" "}
                  {formatEuros(res.cumul9Ans.economieVsMicroBic)} sur 9 ans
                </ResultFormula>
              </>
            ) : (
              <ResultPending>
                Indiquez le prix d&apos;acquisition et le loyer mensuel pour afficher le comparatif sur 9 ans.
              </ResultPending>
            )}
          </ResultPanel>
        }
      />

      {res ? (
        <section
          aria-labelledby="echeancier-jeanbrun-title"
          className="overflow-hidden rounded-2xl border border-line bg-white"
        >
          <div className="border-b border-line-soft bg-paper px-5 py-4 sm:px-7">
            <h2 id="echeancier-jeanbrun-title" className="text-[16px] font-semibold text-ink">
              Échéancier annuel de l&apos;amortissement dégressif sur 9 ans
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px]">
              <caption className="sr-only">
                Détail annuel de l&apos;amortissement dégressif et de l&apos;impôt sur 9 ans
              </caption>
              <thead className="bg-cream/60 text-left text-[12px] uppercase tracking-wider text-ink-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-6">Année</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Taux appliqué</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Dotation amortissement</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Base imposable</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold sm:px-6">Impôt annuel (IR + PS)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft tabular-nums">
                {res.echeancier9Ans.map((row) => (
                  <tr key={row.annee} className="hover:bg-cream/40">
                    <th scope="row" className="px-4 py-2.5 text-left font-medium text-ink sm:px-6">
                      Année {row.annee}
                    </th>
                    <td className="px-4 py-2.5 text-right text-ink-muted">{row.tauxAmortissementPct}</td>
                    <td className="px-4 py-2.5 text-right text-ink">{formatEuros(row.dotationAmortissement)}</td>
                    <td className="px-4 py-2.5 text-right text-ink-muted">{formatEuros(row.baseImposable)}</td>
                    <td className="px-4 py-2.5 text-right font-medium text-forest-deep sm:px-6">
                      {formatEuros(row.impotAnnuel)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}
    </div>
  );
}
