"use client";

import { useState } from "react";
import Decimal from "decimal.js";

import { AMOUNT_ERROR_MESSAGES, formatEuros, parseAmount } from "@/lib/tools/amount";
import {
  computePretImmobilier,
  PRET_IMMOBILIER_ERROR_MESSAGES,
} from "@/lib/tools/pret-immobilier";
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

const DUREE_OPTIONS = [7, 10, 12, 15, 18, 20, 22, 25, 27].map((y) => ({
  value: String(y),
  label: `${y} ans (${y * 12} mensualités)`,
}));

export function SimulateurPretClient() {
  const [montantProjetInput, setMontantProjetInput] = useState("220000");
  const [apportInput, setApportInput] = useState("30000");
  const [dureeAnnees, setDureeAnnees] = useState("20");
  const [tauxNominalInput, setTauxNominalInput] = useState("3,45");
  const [tauxAssuranceInput, setTauxAssuranceInput] = useState("0,30");
  const [edited, setEdited] = useState(false);

  const mark = <T,>(setter: (val: T) => void) => (val: T) => {
    setEdited(true);
    setter(val);
  };

  const pProjet = parseAmount(montantProjetInput, 50_000_000);
  const pApport =
    apportInput.trim() === ""
      ? { ok: true as const, value: new Decimal(0) }
      : parseAmount(apportInput, 50_000_000);
  const pTaux = parseAmount(tauxNominalInput, 20);
  const pAssurance =
    tauxAssuranceInput.trim() === ""
      ? { ok: true as const, value: new Decimal(0) }
      : parseAmount(tauxAssuranceInput, 5);

  const projetErr = !pProjet.ok ? AMOUNT_ERROR_MESSAGES[pProjet.error] : null;
  const apportErr = !pApport.ok ? AMOUNT_ERROR_MESSAGES[pApport.error] : null;
  const tauxErr = !pTaux.ok ? "Indiquez un taux nominal compris entre 0 et 20 %, par exemple 3,45." : null;
  const assuranceErr = !pAssurance.ok ? "Indiquez un taux d'assurance compris entre 0 et 5 %, par exemple 0,30." : null;

  const outcome =
    !projetErr && !apportErr && !tauxErr && !assuranceErr && pProjet.ok && pApport.ok && pTaux.ok && pAssurance.ok
      ? computePretImmobilier({
          montantProjet: pProjet.value,
          apportPersonnel: pApport.value,
          dureeAnnees: Number(dureeAnnees),
          tauxNominalAnnuel: pTaux.value,
          tauxAssuranceAnnuel: pAssurance.value,
        })
      : null;

  const domainErr = outcome && !outcome.ok ? PRET_IMMOBILIER_ERROR_MESSAGES[outcome.error] : null;
  const res = outcome && outcome.ok ? outcome.result : null;

  return (
    <div className="space-y-8">
      <ToolWorkbench
        form={
          <ToolSheet label="Simulateur de prêt immobilier">
            <ToolStep
              step={1}
              title="Montant du projet et apport personnel"
              description="Le capital emprunté correspond au coût total financé diminué de votre apport personnel."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <AmountField
                  id="pret-montant-projet"
                  label="Coût du projet (prix + frais)"
                  value={montantProjetInput}
                  onChange={mark(setMontantProjetInput)}
                  placeholder="220000"
                  suffix="€"
                  error={projetErr}
                />
                <AmountField
                  id="pret-apport"
                  label="Apport personnel"
                  value={apportInput}
                  onChange={mark(setApportInput)}
                  placeholder="30000"
                  suffix="€"
                  error={apportErr ?? domainErr}
                />
              </div>
            </ToolStep>

            <ToolStep
              step={2}
              title="Durée et taux du crédit"
              description="En investissement locatif, les intérêts d'emprunt et les cotisations d'assurance emprunteur sont déductibles des revenus fonciers ou BIC au régime réel."
            >
              <SelectField
                id="pret-duree"
                label="Durée de remboursement"
                value={dureeAnnees}
                onChange={mark(setDureeAnnees)}
                options={DUREE_OPTIONS}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <AmountField
                  id="pret-taux-nominal"
                  label="Taux nominal annuel (hors assurance)"
                  value={tauxNominalInput}
                  onChange={mark(setTauxNominalInput)}
                  placeholder="3,45"
                  suffix="% / an"
                  error={tauxErr}
                />
                <AmountField
                  id="pret-taux-assurance"
                  label="Taux d'assurance emprunteur"
                  value={tauxAssuranceInput}
                  onChange={mark(setTauxAssuranceInput)}
                  placeholder="0,30"
                  suffix="% / an"
                  error={assuranceErr}
                  hint="Calculé sur le capital initial emprunté."
                />
              </div>
            </ToolStep>

            {res ? (
              <ResultJump
                label={`Mensualité sur ${res.dureeAnnees} ans`}
                value={formatEuros(res.mensualiteTotale)}
                detail={`Capital emprunté : ${formatEuros(res.capitalEmprunte)}`}
              />
            ) : null}
          </ToolSheet>
        }
        result={
          <ResultPanel
            title="Mensualité & coût du crédit"
            badge={
              res ? (
                edited ? (
                  <ResultBadge tone="sage">Votre simulation</ResultBadge>
                ) : (
                  <ResultBadge tone="example">Exemple · 190 000 € sur 20 ans</ResultBadge>
                )
              ) : null
            }
            footer={
              res ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CopyButton
                    text={`Prêt de ${formatEuros(res.capitalEmprunte)} sur ${res.dureeAnnees} ans (${res.tauxNominalAnnuel.toFixed(2).replace(".", ",")} %) : mensualité ${formatEuros(res.mensualiteTotale)} (dont ${formatEuros(res.mensualiteAssurance)} d'assurance), coût total du crédit ${formatEuros(res.coutTotalCredit)}.`}
                    label="Copier la simulation"
                    copiedLabel="Simulation copiée"
                  />
                </div>
              ) : undefined
            }
          >
            {res ? (
              <>
                <ResultFigure
                  label="Mensualité totale (assurance incluse)"
                  cents={res.mensualiteTotaleCents}
                  text={formatEuros(res.mensualiteTotale)}
                  caption={
                    <>
                      Dont <strong>{formatEuros(res.mensualiteHorsAssurance)}</strong> de crédit (capital + intérêts) et{" "}
                      <strong>{formatEuros(res.mensualiteAssurance)}</strong> d&apos;assurance sur{" "}
                      {res.nombreMensualites} mois.
                    </>
                  }
                />

                <ResultRows
                  rows={[
                    {
                      label: "Capital emprunté",
                      value: formatEuros(res.capitalEmprunte),
                      strong: true,
                    },
                    {
                      label: `Total des intérêts (${res.tauxNominalAnnuel.toFixed(2).replace(".", ",")} %)`,
                      detail: `Sur ${res.dureeAnnees} ans`,
                      value: formatEuros(res.totalInterets),
                    },
                    {
                      label: `Total de l'assurance (${res.tauxAssuranceAnnuel.toFixed(2).replace(".", ",")} %)`,
                      value: formatEuros(res.totalAssurance),
                    },
                    {
                      label: "Coût total du crédit (intérêts + assurance)",
                      value: formatEuros(res.coutTotalCredit),
                      strong: true,
                    },
                    {
                      label: "Total remboursé à la banque",
                      value: formatEuros(res.coutTotalRembourse),
                    },
                  ]}
                />

                <ResultFormula>
                  {formatEuros(res.mensualiteHorsAssurance)} + {formatEuros(res.mensualiteAssurance)} ={" "}
                  {formatEuros(res.mensualiteTotale)} / mois
                </ResultFormula>
              </>
            ) : (
              <ResultPending>
                Vérifiez les montants et les taux saisis pour calculer votre mensualité et votre tableau d&apos;amortissement.
              </ResultPending>
            )}
          </ResultPanel>
        }
      />

      {res ? (
        <section
          aria-labelledby="amortissement-title"
          className="overflow-hidden rounded-2xl border border-line bg-white"
        >
          <details className="group" open>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 border-b border-line-soft bg-paper px-5 py-4 text-[16px] font-semibold text-ink hover:text-forest [&::-webkit-details-marker]:hidden sm:px-7">
              <span id="amortissement-title">
                Tableau d&apos;amortissement annuel ({res.dureeAnnees} ans)
              </span>
              <span className="text-[13.5px] font-medium text-forest">
                <span className="group-open:hidden">Afficher l&apos;échéancier ↓</span>
                <span className="hidden group-open:inline">Masquer l&apos;échéancier ↑</span>
              </span>
            </summary>
            <div className="overflow-x-auto">
              <table className="w-full text-[13.5px]">
                <caption className="sr-only">
                  Tableau d&apos;amortissement annuel du prêt immobilier sur {res.dureeAnnees} ans
                </caption>
                <thead className="bg-cream/60 text-left text-[12px] uppercase tracking-wider text-ink-muted">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold sm:px-6">Année</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Capital amorti</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Intérêts payés</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold">Assurance</th>
                    <th scope="col" className="px-4 py-3 text-right font-semibold sm:px-6">Capital restant dû</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line-soft tabular-nums">
                  {res.tableauAnnuel.map((row) => (
                    <tr key={row.annee} className="hover:bg-cream/40">
                      <th scope="row" className="px-4 py-2.5 text-left font-medium text-ink sm:px-6">
                        Année {row.annee}
                      </th>
                      <td className="px-4 py-2.5 text-right text-ink">{formatEuros(row.capitalRembourse)}</td>
                      <td className="px-4 py-2.5 text-right text-ink-muted">{formatEuros(row.interetsPayes)}</td>
                      <td className="px-4 py-2.5 text-right text-ink-muted">{formatEuros(row.assurancePayee)}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-ink sm:px-6">
                        {formatEuros(row.capitalRestantDu)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </section>
      ) : null}
    </div>
  );
}
