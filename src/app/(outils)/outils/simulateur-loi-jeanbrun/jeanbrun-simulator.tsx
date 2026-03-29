"use client";

import { useState, useMemo } from "react";
import { Calculator, TrendingUp, ChevronDown } from "lucide-react";

/* ─── Constants ─── */
const TMI_OPTIONS = [0, 0.11, 0.3, 0.41, 0.45] as const;
const PRELEVEMENTS_SOCIAUX = 0.172;
const MICRO_BIC_ABATTEMENT = 0.5;
const REEL_AMORT_RATE = 0.02; // 80% × 2.5%
const LAND_EXCLUSION = 0.8;

const JEANBRUN_RATES: Record<number, number> = {
  1: 0.055,
  2: 0.055,
  3: 0.055,
  4: 0.045,
  5: 0.045,
  6: 0.045,
  7: 0.035,
  8: 0.035,
  9: 0.035,
};

/* ─── Types ─── */
interface RegimeResult {
  label: string;
  recettesBrutes: number;
  chargesDeductibles: number;
  amortissement: number;
  revenuImposable: number;
  impot: number;
  prelevementsSociaux: number;
  revenuNet: number;
}

/* ─── Helpers ─── */
function fmt(n: number): string {
  return Math.round(n).toLocaleString("fr-FR");
}

function fmtPct(n: number): string {
  return (n * 100).toLocaleString("fr-FR", { maximumFractionDigits: 1 });
}

function computeResults(
  valeurBien: number,
  loyerMensuel: number,
  chargesAnnuelles: number,
  tmi: number
): { regimes: RegimeResult[]; bestIdx: number } {
  const recettes = loyerMensuel * 12;

  // ── Micro-BIC ──
  const microImposable = recettes * MICRO_BIC_ABATTEMENT;
  const microImpot = microImposable * tmi;
  const microPS = microImposable * PRELEVEMENTS_SOCIAUX;
  const microNet = recettes - chargesAnnuelles - microImpot - microPS;

  // ── Réel simplifié ──
  const reelAmort = valeurBien * REEL_AMORT_RATE;
  const reelCharges = chargesAnnuelles + reelAmort;
  const reelImposable = Math.max(0, recettes - reelCharges);
  const reelImpot = reelImposable * tmi;
  const reelPS = reelImposable * PRELEVEMENTS_SOCIAUX;
  const reelNet = recettes - chargesAnnuelles - reelImpot - reelPS;

  // ── Jeanbrun (year 1 for cards) ──
  const jbAmort = valeurBien * LAND_EXCLUSION * JEANBRUN_RATES[1];
  const jbCharges = chargesAnnuelles + jbAmort;
  const jbImposable = Math.max(0, recettes - jbCharges);
  const jbImpot = jbImposable * tmi;
  const jbPS = jbImposable * PRELEVEMENTS_SOCIAUX;
  const jbNet = recettes - chargesAnnuelles - jbImpot - jbPS;

  const regimes: RegimeResult[] = [
    {
      label: "LMNP Micro-BIC",
      recettesBrutes: recettes,
      chargesDeductibles: 0,
      amortissement: 0,
      revenuImposable: microImposable,
      impot: microImpot,
      prelevementsSociaux: microPS,
      revenuNet: microNet,
    },
    {
      label: "LMNP Réel simplifié",
      recettesBrutes: recettes,
      chargesDeductibles: chargesAnnuelles,
      amortissement: reelAmort,
      revenuImposable: reelImposable,
      impot: reelImpot,
      prelevementsSociaux: reelPS,
      revenuNet: reelNet,
    },
    {
      label: "Dispositif Jeanbrun",
      recettesBrutes: recettes,
      chargesDeductibles: chargesAnnuelles,
      amortissement: jbAmort,
      revenuImposable: jbImposable,
      impot: jbImpot,
      prelevementsSociaux: jbPS,
      revenuNet: jbNet,
    },
  ];

  let bestIdx = 0;
  regimes.forEach((r, i) => {
    if (r.revenuNet > regimes[bestIdx].revenuNet) bestIdx = i;
  });

  return { regimes, bestIdx };
}

function compute9YearProjection(
  valeurBien: number,
  loyerMensuel: number,
  chargesAnnuelles: number,
  tmi: number
) {
  const recettes = loyerMensuel * 12;
  const reelAmort = valeurBien * REEL_AMORT_RATE;

  return Array.from({ length: 9 }, (_, i) => {
    const year = i + 1;
    const jbRate = JEANBRUN_RATES[year];
    const jbAmort = valeurBien * LAND_EXCLUSION * jbRate;

    const reelImposable = Math.max(
      0,
      recettes - chargesAnnuelles - reelAmort
    );
    const reelFiscal = reelImposable * (tmi + PRELEVEMENTS_SOCIAUX);

    const jbImposable = Math.max(0, recettes - chargesAnnuelles - jbAmort);
    const jbFiscal = jbImposable * (tmi + PRELEVEMENTS_SOCIAUX);

    return {
      year,
      jbAmort,
      reelAmort,
      jbRate,
      economie: reelFiscal - jbFiscal,
    };
  });
}

/* ─── Component ─── */
export function JeanbrunSimulator() {
  const [valeurBien, setValeurBien] = useState(200_000);
  const [loyerMensuel, setLoyerMensuel] = useState(800);
  const [chargesAnnuelles, setChargesAnnuelles] = useState(3_000);
  const [tmi, setTmi] = useState(0.3);

  const { regimes, bestIdx } = useMemo(
    () => computeResults(valeurBien, loyerMensuel, chargesAnnuelles, tmi),
    [valeurBien, loyerMensuel, chargesAnnuelles, tmi]
  );

  const projection = useMemo(
    () =>
      compute9YearProjection(valeurBien, loyerMensuel, chargesAnnuelles, tmi),
    [valeurBien, loyerMensuel, chargesAnnuelles, tmi]
  );

  const totalEconomie = projection.reduce((s, p) => s + p.economie, 0);

  return (
    <div className="space-y-10">
      {/* ── Input form ── */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Calculator className="size-5" />
          </div>
          <h2 className="text-lg font-semibold text-stone-900">
            Paramètres de simulation
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <NumberInput
            id="valeurBien"
            label="Valeur du bien (€)"
            value={valeurBien}
            onChange={setValeurBien}
            min={10_000}
            step={5_000}
          />
          <NumberInput
            id="loyerMensuel"
            label="Loyer mensuel brut (€)"
            value={loyerMensuel}
            onChange={setLoyerMensuel}
            min={0}
            step={50}
          />
          <NumberInput
            id="chargesAnnuelles"
            label="Charges annuelles déductibles (€)"
            value={chargesAnnuelles}
            onChange={setChargesAnnuelles}
            min={0}
            step={500}
          />
          <div className="space-y-2">
            <label
              htmlFor="tmi"
              className="block text-sm font-medium text-stone-700"
            >
              Tranche marginale d&apos;imposition (TMI)
            </label>
            <div className="relative">
              <select
                id="tmi"
                value={tmi}
                onChange={(e) => setTmi(Number(e.target.value))}
                className="h-10 w-full appearance-none rounded-lg border border-stone-200 bg-white px-3 pr-10 text-sm text-stone-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                {TMI_OPTIONS.map((rate) => (
                  <option key={rate} value={rate}>
                    {fmtPct(rate)}&nbsp;%
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ── Result cards ── */}
      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <TrendingUp className="size-5" />
          </div>
          <h2 className="text-lg font-semibold text-stone-900">
            Comparaison des régimes fiscaux
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {regimes.map((r, i) => (
            <div
              key={r.label}
              className={`relative rounded-2xl border bg-white p-5 shadow-sm transition-shadow hover:shadow-md ${
                i === bestIdx
                  ? "border-blue-600 ring-1 ring-blue-600"
                  : "border-stone-200"
              }`}
            >
              {i === bestIdx && (
                <span className="absolute -top-3 left-4 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
                  Recommandé
                </span>
              )}

              <h3 className="mb-4 text-base font-semibold text-stone-900">
                {r.label}
              </h3>

              <dl className="space-y-2 text-sm">
                <ResultRow
                  label="Revenus bruts annuels"
                  value={`${fmt(r.recettesBrutes)} €`}
                />
                <ResultRow
                  label="Charges déductibles"
                  value={`${fmt(r.chargesDeductibles)} €`}
                />
                <ResultRow
                  label="Amortissement"
                  value={
                    r.amortissement > 0 ? `${fmt(r.amortissement)} €` : "—"
                  }
                />
                <ResultRow
                  label="Revenu imposable"
                  value={`${fmt(r.revenuImposable)} €`}
                />
                <ResultRow
                  label="Impôt sur le revenu"
                  value={`${fmt(r.impot)} €`}
                  negative
                />
                <ResultRow
                  label="Prélèvements sociaux"
                  value={`${fmt(r.prelevementsSociaux)} €`}
                  negative
                />

                <div className="border-t border-stone-100 pt-2">
                  <ResultRow
                    label="Revenu net après fiscalité"
                    value={`${fmt(r.revenuNet)} €`}
                    bold
                    highlight={i === bestIdx}
                  />
                </div>
              </dl>
            </div>
          ))}
        </div>
      </div>

      {/* ── 9-year projection table ── */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-stone-900">
          Projection sur 9 ans : Jeanbrun vs Réel
        </h2>
        <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-700">
                <th className="px-4 py-3 font-semibold">Année</th>
                <th className="px-4 py-3 text-right font-semibold">
                  Taux Jeanbrun
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  Amortissement Jeanbrun
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  Amortissement Réel
                </th>
                <th className="px-4 py-3 text-right font-semibold">
                  Économie Jeanbrun
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {projection.map((row) => (
                <tr
                  key={row.year}
                  className={row.year % 2 === 0 ? "bg-stone-50/50" : ""}
                >
                  <td className="px-4 py-2.5 font-medium text-stone-700">
                    {row.year}
                  </td>
                  <td className="px-4 py-2.5 text-right text-stone-600">
                    {fmtPct(row.jbRate)}&nbsp;%
                  </td>
                  <td className="px-4 py-2.5 text-right text-stone-600">
                    {fmt(row.jbAmort)}&nbsp;€
                  </td>
                  <td className="px-4 py-2.5 text-right text-stone-600">
                    {fmt(row.reelAmort)}&nbsp;€
                  </td>
                  <td
                    className={`px-4 py-2.5 text-right font-medium ${
                      row.economie > 0
                        ? "text-emerald-600"
                        : row.economie < 0
                          ? "text-red-500"
                          : "text-stone-500"
                    }`}
                  >
                    {row.economie > 0 ? "+" : ""}
                    {fmt(row.economie)}&nbsp;€
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-stone-200 bg-stone-50 font-semibold">
                <td className="px-4 py-3 text-stone-900" colSpan={4}>
                  Total économie sur 9 ans
                </td>
                <td
                  className={`px-4 py-3 text-right ${
                    totalEconomie > 0
                      ? "text-emerald-600"
                      : totalEconomie < 0
                        ? "text-red-500"
                        : "text-stone-700"
                  }`}
                >
                  {totalEconomie > 0 ? "+" : ""}
                  {fmt(totalEconomie)}&nbsp;€
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p className="mt-3 text-xs text-stone-400">
          L&apos;économie représente la différence d&apos;imposition totale
          (IR&nbsp;+&nbsp;PS) entre le régime réel et le dispositif Jeanbrun,
          sur la base des paramètres saisis.
        </p>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function NumberInput({
  id,
  label,
  value,
  onChange,
  min = 0,
  step = 1,
}: {
  id: string;
  label: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  step?: number;
}) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-stone-700">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        step={step}
        value={value}
        onChange={(e) => {
          const v = Number(e.target.value);
          if (!Number.isNaN(v)) onChange(v);
        }}
        className="h-10 w-full rounded-lg border border-stone-200 bg-white px-3 text-sm text-stone-900 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
      />
    </div>
  );
}

function ResultRow({
  label,
  value,
  bold,
  negative,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  negative?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt
        className={`${bold ? "font-semibold text-stone-800" : "text-stone-500"}`}
      >
        {label}
      </dt>
      <dd
        className={`text-right tabular-nums ${
          highlight
            ? "font-bold text-blue-600"
            : bold
              ? "font-semibold text-stone-900"
              : negative
                ? "text-red-500"
                : "text-stone-700"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
