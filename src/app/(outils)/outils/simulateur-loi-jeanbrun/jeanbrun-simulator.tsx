"use client";

import { useState } from "react";
import Decimal from "decimal.js";

import { AMOUNT_ERROR_MESSAGES, formatEuros, parseAmount } from "@/lib/tools/amount";
import type { TmiRate } from "@/lib/tools/fiscalite-lmnp";
import {
  computeLoiJeanbrun,
  LOI_JEANBRUN_ERROR_MESSAGES,
  SECTEUR_JEANBRUN_INFO,
  type SecteurJeanbrun,
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

const SECTEUR_CHOICES: { value: SecteurJeanbrun; label: string; description: string }[] = [
  {
    value: "intermediaire",
    label: "Secteur intermédiaire (3,5 % / an)",
    description: "Loyer plafonné conventionné · 31,5 % amortis sur 9 ans",
  },
  {
    value: "social",
    label: "Secteur social (4,5 % / an)",
    description: "Loyer décoté d'environ 15 % · 40,5 % amortis sur 9 ans",
  },
  {
    value: "tres-social",
    label: "Secteur très social (5,5 % / an)",
    description: "Loyer décoté d'environ 30 % · 49,5 % amortis sur 9 ans",
  },
];

export function JeanbrunSimulator() {
  const [prixInput, setPrixInput] = useState("210000");
  const [loyerMensuelInput, setLoyerMensuelInput] = useState("920");
  const [chargesAnnuellesInput, setChargesAnnuellesInput] = useState("2400");
  const [interetsAnnuelsInput, setInteretsAnnuelsInput] = useState("1800");
  const [secteur, setSecteur] = useState<SecteurJeanbrun>("social");
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
  const pInterets =
    interetsAnnuelsInput.trim() === ""
      ? { ok: true as const, value: new Decimal(0) }
      : parseAmount(interetsAnnuelsInput, 500_000);

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
  const interetsErr = !pInterets.ok ? AMOUNT_ERROR_MESSAGES[pInterets.error] : null;

  const outcome =
    !prixErr && !loyerErr && !chargesErr && !interetsErr && pPrix.ok && pLoyer.ok && pCharges.ok && pInterets.ok
      ? computeLoiJeanbrun({
          prixAcquisition: pPrix.value,
          loyerMensuelHc: pLoyer.value,
          chargesAnnuellesDeductibles: pCharges.value,
          interetsEmpruntAnnuels: pInterets.value,
          secteur,
          tmi: Number(tmi) as TmiRate,
        })
      : null;

  const res = outcome && outcome.ok ? outcome.result : null;

  return (
    <div className="space-y-8">
      <ToolWorkbench
        form={
          <ToolSheet label="Simulateur Statut du Bailleur Privé (Loi Jeanbrun 2026)">
            <ToolStep
              step={1}
              title="Prix du bien et niveau de loyer conventionné"
              description="Cette simulation utilise les taux du neuf en immeuble collectif (CGI art. 31 I-1° i). Elle ne chiffre pas l’ancien réhabilité, dont les taux diffèrent. Base : 80 % du prix d’acquisition net de frais."
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
                  label="Loyer mensuel hors charges prévu"
                  value={loyerMensuelInput}
                  onChange={mark(setLoyerMensuelInput)}
                  placeholder="920"
                  suffix="€ / mois"
                  error={loyerErr}
                />
              </div>

              <ChoiceGroup
                name="jeanbrun-secteur"
                legend="Option de loyer conventionné (taux d'amortissement)"
                value={secteur}
                onChange={mark(setSecteur)}
                choices={SECTEUR_CHOICES}
              />
            </ToolStep>

            <ToolStep
              step={2}
              title="Charges annuelles et tranche d'imposition (TMI)"
              description="L'amortissement et les charges déductibles viennent en déduction des revenus fonciers. Le déficit foncier généré hors intérêts est imputable sur votre revenu global jusqu'à 10 700 € / an."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <AmountField
                  id="jeanbrun-charges"
                  label="Charges déductibles (taxe foncière, copro, assurance PNO)"
                  value={chargesAnnuellesInput}
                  onChange={mark(setChargesAnnuellesInput)}
                  placeholder="2400"
                  suffix="€ / an"
                  error={chargesErr}
                />
                <AmountField
                  id="jeanbrun-interets"
                  label="Intérêts d'emprunt annuels"
                  value={interetsAnnuelsInput}
                  onChange={mark(setInteretsAnnuelsInput)}
                  placeholder="1800"
                  suffix="€ / an"
                  error={interetsErr}
                />
              </div>

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
                label="Économie d'impôt sur 9 ans"
                value={formatEuros(res.statutJeanbrun.economieTotaleVsFoncierClassique)}
                detail={`Impôt Jeanbrun : ${formatEuros(res.statutJeanbrun.impotTotal9Ans)} sur 9 ans`}
              />
            ) : null}
          </ToolSheet>
        }
        result={
          <ResultPanel
            title="Comparaison fiscale sur 9 ans (Location nue)"
            badge={
              res ? (
                edited ? (
                  <ResultBadge tone="sage">Votre simulation</ResultBadge>
                ) : (
                  <ResultBadge tone="example">Exemple · 210 000 € ({res.tauxAmortissementAnnuelPct} % / an)</ResultBadge>
                )
              ) : null
            }
            footer={
              res ? (
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CopyButton
                    text={`Statut Bailleur Privé (${formatEuros(res.prixAcquisition)}, secteur ${SECTEUR_JEANBRUN_INFO[res.secteur].label}, TMI ${res.tmi} %) — Impôt 9 ans : ${formatEuros(res.statutJeanbrun.impotTotal9Ans)} contre ${formatEuros(res.regimeFoncierClassique.impotTotal9Ans)} au réel classique (économie : ${formatEuros(res.statutJeanbrun.economieTotaleVsFoncierClassique)}).`}
                    label="Copier le comparatif 9 ans"
                    copiedLabel="Comparatif copié"
                  />
                </div>
              ) : undefined
            }
          >
            {res ? (
              <>
                <p className="mb-4 text-sm text-ink-muted">Simulation indicative à TMI et loyers constants sur neuf années pleines, pour un seul bien neuf. L’éligibilité, les plafonds de loyers et de ressources, les autres revenus du foyer et l’impôt de revente ne sont pas vérifiés. Le plafond d’amortissement est partagé par le foyer fiscal.</p>
              <ResultFigure
                  label="Économie d'impôt sur 9 ans vs régime foncier classique"
                  cents={res.statutJeanbrun.economieTotaleCents}
                  text={formatEuros(res.statutJeanbrun.economieTotaleVsFoncierClassique)}
                  caption={
                    <>
                      {res.amortissementPlafonne ? (
                        <>
                          Déduction annuelle plafonnée au maximum légal de{" "}
                          <strong>{res.plafondAnnuelEuros.toLocaleString("fr-FR")}&nbsp;€ / an</strong> pour le{" "}
                          {SECTEUR_JEANBRUN_INFO[res.secteur].label} (calcul théorique : {formatEuros(res.amortissementTheorique)}).
                        </>
                      ) : (
                        <>
                          Grâce à la déduction annuelle d&apos;un amortissement de{" "}
                          <strong>{formatEuros(res.amortissementAnnuel)}</strong> ({res.tauxAmortissementAnnuelPct} % de la base
                          bâtie de {formatEuros(res.baseAmortissable80Pct)}, sous le plafond légal de {res.plafondAnnuelEuros.toLocaleString("fr-FR")}&nbsp;€/an).
                        </>
                      )}
                    </>
                  }
                />

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-line-soft bg-paper p-3.5">
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-ink-muted">
                      Foncier réel classique
                    </p>
                    <p className="mt-1 text-[1.25rem] font-semibold tabular-nums text-ink">
                      {formatEuros(res.regimeFoncierClassique.impotTotal9Ans)}
                    </p>
                    <p className="mt-0.5 text-[12px] text-ink-muted">
                      Sans amortissement du bâti (9 ans)
                    </p>
                  </div>

                  <div className="rounded-xl border border-forest bg-sage-50/70 p-3.5">
                    <p className="text-[12px] font-semibold uppercase tracking-wider text-forest">
                      Statut Bailleur Privé
                    </p>
                    <p className="mt-1 text-[1.25rem] font-semibold tabular-nums text-forest-deep">
                      {formatEuros(res.statutJeanbrun.impotTotal9Ans)}
                    </p>
                    <p className="mt-0.5 text-[12px] text-ink-muted">
                      Avec amortissement ({res.tauxAmortissementAnnuelPct} % / an)
                    </p>
                  </div>
                </div>

                <ResultRows
                  rows={[
                    {
                      label: "Amortissement annuel déductible",
                      detail: res.amortissementPlafonne
                        ? `Plafonné à ${res.plafondAnnuelEuros.toLocaleString("fr-FR")} € / an (théorique : ${res.tauxAmortissementAnnuelPct} % = ${formatEuros(res.amortissementTheorique)})`
                        : `${res.tauxAmortissementAnnuelPct} % sur 80 % du prix (${formatEuros(res.baseAmortissable80Pct)})`,
                      value: `${formatEuros(res.amortissementAnnuel)} / an`,
                      strong: true,
                    },
                    {
                      label: "Cumul des amortissements sur 9 ans",
                      detail: "Déduits des revenus fonciers ou imputés sur le revenu global",
                      value: formatEuros(res.amortissementTotal9Ans),
                      strong: true,
                    },
                    {
                      label: "Imposition foncière annuelle au réel classique",
                      detail: `Taux global ${res.tauxGlobalImpositionPct.toFixed(1).replace(".", ",")} % (IR ${res.tmi} % + PS 17,2 %) sans amortissement`,
                      value: `${formatEuros(res.regimeFoncierClassique.impotAnnuel)} / an`,
                    },
                    {
                      label: "Avertissement fiscal à la revente",
                      detail: "Les amortissements déduits majorent la plus-value brute imposable à la cession",
                      value: `−${formatEuros(res.statutJeanbrun.amortissementReintegreRevente)} sur le prix d'achat`,
                    },
                  ]}
                />

                <ResultFormula>
                  Foncier classique {formatEuros(res.regimeFoncierClassique.impotTotal9Ans)} − Statut Jeanbrun{" "}
                  {formatEuros(res.statutJeanbrun.impotTotal9Ans)} ={" "}
                  {formatEuros(res.statutJeanbrun.economieTotaleVsFoncierClassique)} d&apos;économie sur 9 ans
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
              Échéancier annuel du Statut du Bailleur Privé sur 9 ans ({SECTEUR_JEANBRUN_INFO[res.secteur].label})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-[13.5px]">
              <caption className="sr-only">
                Détail annuel de l&apos;amortissement et de l&apos;impôt sur 9 ans
              </caption>
              <thead className="bg-cream/60 text-left text-[12px] uppercase tracking-wider text-ink-muted">
                <tr>
                  <th scope="col" className="px-4 py-3 font-semibold sm:px-6">Année</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Loyers bruts</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Charges & intérêts</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Amortissement</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold">Déficit imputé (max 10 700 €)</th>
                  <th scope="col" className="px-4 py-3 text-right font-semibold sm:px-6">Impôt foncier annuel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft tabular-nums">
                {res.echeancier9Ans.map((row) => (
                  <tr key={row.annee} className="hover:bg-cream/40">
                    <th scope="row" className="px-4 py-2.5 text-left font-medium text-ink sm:px-6">
                      Année {row.annee}
                    </th>
                    <td className="px-4 py-2.5 text-right text-ink-muted">{formatEuros(row.loyerAnnuel)}</td>
                    <td className="px-4 py-2.5 text-right text-ink-muted">{formatEuros(row.chargesDeductibles)}</td>
                    <td className="px-4 py-2.5 text-right text-ink font-medium">{formatEuros(row.amortissementAnnuel)}</td>
                    <td className="px-4 py-2.5 text-right text-ink-muted">
                      {row.deficitImputeRevenuGlobal.greaterThan(0)
                        ? formatEuros(row.deficitImputeRevenuGlobal)
                        : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-right font-medium text-forest-deep sm:px-6">
                      {formatEuros(row.impotFoncierAnnuel)}
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
