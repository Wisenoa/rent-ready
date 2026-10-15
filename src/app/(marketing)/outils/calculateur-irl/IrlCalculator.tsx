"use client";

import { useState, useSyncExternalStore } from "react";
import Decimal from "decimal.js";
import { ArrowRight, RotateCcw } from "lucide-react";

import { getLatestIrl, IRL_SOURCE_URL } from "@/lib/irl-calculator";
import { AMOUNT_ERROR_MESSAGES, centsOf, formatEuros, formatIndex, formatSignedEuros, formatSignedPercent, parseAmount } from "@/lib/tools/amount";
import {
  TRIMESTERS,
  findPair,
  publicationLabel,
  quarterShortLabel,
  reviseRent,
  revisionPairs,
  type Trimester,
} from "@/lib/tools/irl-revision";
import { AmountField, ChoiceGroup, SelectField, ToolSheet, ToolStep, ToolWorkbench } from "@/components/marketing/tools/ToolForm";
import { ResultBadge, ResultFigure, ResultFormula, ResultJump, ResultPanel, ResultPending, ResultRows } from "@/components/marketing/tools/ToolResult";
import { CopyButton } from "@/components/marketing/tools/CopyButton";
import { useDebouncedValue } from "@/components/marketing/tools/use-debounced-value";

const EXAMPLE_RENT = new Decimal(800);
const latest = getLatestIrl();
const nextExpected =
  latest.trimester === 4
    ? { trimester: 1 as Trimester, year: latest.year + 1 }
    : { trimester: (latest.trimester + 1) as Trimester, year: latest.year };

const TRIMESTER_CHOICES = TRIMESTERS.map((t) => ({
  value: String(t) as `${Trimester}`,
  label: `T${t}`,
  description: ["janv.–mars", "avr.–juin", "juil.–sept.", "oct.–déc."][t - 1],
}));

function latestYear(trimester: Trimester): number {
  return revisionPairs(trimester)[0].current.year;
}

interface CalculatorState {
  rent: string;
  trimester: Trimester;
  year: number;
}

const DEFAULT_STATE: CalculatorState = {
  rent: "",
  trimester: latest.trimester as Trimester,
  year: latestYear(latest.trimester as Trimester),
};

/**
 * The share link carries the rent, the quarter and the year — nothing that
 * identifies a person or a dwelling.
 */
function readSharedState(search: string): CalculatorState | null {
  const params = new URLSearchParams(search);
  const trimester = Number(params.get("trimestre"));
  if (!TRIMESTERS.includes(trimester as Trimester)) return null;
  const year = Number(params.get("annee"));
  const rent = params.get("loyer") ?? "";
  return {
    rent: parseAmount(rent).ok ? rent : "",
    trimester: trimester as Trimester,
    year: findPair(trimester as Trimester, year) ? year : latestYear(trimester as Trimester),
  };
}

// The query string is read after hydration (the server renders the defaults),
// and only as a starting point: whatever the visitor changes takes precedence.
const noSubscription = () => () => {};

export function IrlCalculator() {
  const search = useSyncExternalStore(noSubscription, () => window.location.search, () => "");
  const [edits, setEdits] = useState<Partial<CalculatorState>>({});
  const { rent: rentText, trimester, year } = { ...DEFAULT_STATE, ...readSharedState(search), ...edits };
  const setRentText = (rent: string) => setEdits((current) => ({ ...current, rent }));
  const setYear = (value: number) => setEdits((current) => ({ ...current, year: value }));

  const pairs = revisionPairs(trimester);
  const pair = findPair(trimester, year) ?? pairs[0];

  const isExample = rentText.trim() === "";
  const parsed = parseAmount(rentText, 100_000);
  const rentError = isExample
    ? null
    : !parsed.ok
      ? AMOUNT_ERROR_MESSAGES[parsed.error]
      : parsed.value.isZero()
        ? "Indiquez un loyer supérieur à 0 €."
        : null;
  const rent = isExample ? EXAMPLE_RENT : parsed.ok && !rentError ? parsed.value : null;

  const result = rent ? reviseRent(rent, pair) : null;

  const summary = result
    ? result.monthlyDifference.isZero()
      ? `Le loyer reste à ${formatEuros(result.newRent)} par mois.`
      : `Le loyer passe de ${formatEuros(result.currentRent)} à ${formatEuros(result.newRent)} par mois.`
    : "";
  const announced = useDebouncedValue(isExample ? "" : summary, 700);

  function changeTrimester(next: Trimester) {
    setEdits((current) => ({ ...current, trimester: next, year: findPair(next, year) ? year : latestYear(next) }));
  }

  function reset() {
    window.history.replaceState(null, "", window.location.pathname);
    setEdits({ ...DEFAULT_STATE });
  }

  function shareUrl(): string {
    const params = new URLSearchParams({
      loyer: (rent ?? EXAMPLE_RENT).toFixed(2),
      trimestre: String(trimester),
      annee: String(pair.current.year),
    });
    return `${window.location.origin}${window.location.pathname}?${params}`;
  }

  const waitingForNext = trimester === nextExpected.trimester && pair.current.year === pairs[0].current.year;

  const form = (
    <ToolSheet label="Calcul de la révision du loyer">
      <ToolStep step={1} title="Votre loyer actuel" description="Le loyer hors charges que paie le locataire aujourd'hui.">
        <AmountField
          id="loyer"
          label="Loyer mensuel hors charges"
          value={rentText}
          onChange={setRentText}
          placeholder="800,00"
          suffix="€ / mois"
          size="lg"
          error={rentError}
          hint={isExample ? "Le résultat ci-contre est un exemple pour 800 € : saisissez votre loyer." : undefined}
        />
      </ToolStep>

      <ToolStep
        step={2}
        title="Le trimestre de référence du bail"
        description="Il figure dans la clause de révision. À défaut, c'est le trimestre du dernier indice publié à la signature du bail."
      >
        <ChoiceGroup
          name="trimestre"
          legend="Trimestre de référence"
          choices={TRIMESTER_CHOICES}
          value={String(trimester) as `${Trimester}`}
          onChange={(value) => changeTrimester(Number(value) as Trimester)}
          columns={4}
          compact
        />
      </ToolStep>

      <ToolStep step={3} title="L'indice à appliquer">
        <SelectField
          id="indice"
          label="Indice de l'année de révision"
          value={String(pair.current.year)}
          onChange={(value) => setYear(Number(value))}
          options={pairs.map((p) => ({
            value: String(p.current.year),
            label: `${quarterShortLabel(p.current)} — ${formatIndex(p.current.value)}`,
          }))}
          hint={
            waitingForNext ? (
              <>
                Le T{nextExpected.trimester} {nextExpected.year} n&apos;est pas encore publié par l&apos;INSEE : le plus récent pour
                ce trimestre est celui de {pair.current.year}. Il est comparé au même trimestre un an plus tôt.
              </>
            ) : (
              "Le dernier indice publié pour ce trimestre est proposé. Il est comparé au même trimestre un an plus tôt."
            )
          }
        />
      </ToolStep>
      {result ? (
        <ResultJump
          label={isExample ? "Exemple pour 800 € : nouveau loyer" : "Nouveau loyer hors charges"}
          value={formatEuros(result.newRent)}
          detail={`${formatSignedEuros(result.monthlyDifference)} par mois`}
        />
      ) : null}
    </ToolSheet>
  );

  const resultPanel = (
    <ResultPanel
      title="Révision du loyer"
      badge={isExample ? <ResultBadge tone="example">Exemple pour 800 €</ResultBadge> : <ResultBadge tone="sage">Votre calcul</ResultBadge>}
      footer={
        result ? (
          <div className="flex flex-wrap items-center gap-2.5">
            <CopyButton text={result.newRent.toFixed(2).replace(".", ",")} label="Copier le nouveau loyer" />
            <CopyButton text={shareUrl} label="Copier le lien" copiedLabel="Lien copié" icon="link" variant="quiet" />
            <button
              type="button"
              onClick={reset}
              className="inline-flex min-h-10 items-center gap-1.5 rounded-md px-2.5 text-[14px] font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
            >
              <RotateCcw aria-hidden="true" className="size-4" />
              Recommencer
            </button>
          </div>
        ) : null
      }
    >
      {result ? (
        <>
          <ResultFigure
            label="Nouveau loyer hors charges"
            cents={centsOf(result.newRent)}
            text={formatEuros(result.newRent)}
            caption={
              <>
                <span className="font-semibold tabular-nums">{formatSignedEuros(result.monthlyDifference)}</span> par mois
                <span aria-hidden="true" className="mx-2 text-line">
                  |
                </span>
                IRL <span className="font-semibold tabular-nums">{formatSignedPercent(result.variation)}</span> sur un an
              </>
            }
          />
          <p className="mt-4 text-[14.5px] leading-6 text-ink-muted">{summary}</p>

          <ResultRows
            rows={[
              { label: "Loyer actuel", value: formatEuros(result.currentRent) },
              { label: "Nouveau loyer", value: formatEuros(result.newRent), strong: true },
              { label: "Différence par mois", value: formatSignedEuros(result.monthlyDifference) },
              { label: "Sur douze mois", value: formatSignedEuros(result.annualDifference) },
            ]}
          />

          <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2 rounded-xl bg-paper p-3.5 ring-1 ring-line-soft">
            <IndexTile label="Ancien indice" quarter={quarterShortLabel(result.pair.previous)} value={formatIndex(result.pair.previous.value)} />
            <ArrowRight aria-hidden="true" className="size-4 text-ink-muted" />
            <IndexTile label="Nouvel indice" quarter={quarterShortLabel(result.pair.current)} value={formatIndex(result.pair.current.value)} />
          </div>

          <ResultFormula>
            {formatEuros(result.currentRent)} × {formatIndex(result.pair.current.value)} ÷ {formatIndex(result.pair.previous.value)} ={" "}
            <strong className="font-semibold">{formatEuros(result.newRent)}</strong>
          </ResultFormula>

          <p className="mt-3 text-[12.5px] leading-5 text-ink-muted">
            Indices{" "}
            <a href={IRL_SOURCE_URL} className="underline decoration-line underline-offset-2 hover:text-ink" rel="noopener">
              INSEE, série 001515333
            </a>
            . {quarterShortLabel(result.pair.current)} {publicationLabel(result.pair.current)}. Résultat
            arrondi au centime le plus proche.
          </p>
        </>
      ) : (
        <ResultPending>Corrigez le loyer pour voir le nouveau montant.</ResultPending>
      )}
      <p role="status" aria-live="polite" className="sr-only">
        {announced}
      </p>
    </ResultPanel>
  );

  return <ToolWorkbench form={form} result={resultPanel} />;
}

function IndexTile({ label, quarter, value }: { label: string; quarter: string; value: string }) {
  return (
    <div className="min-w-0 text-center">
      <p className="text-[12px] text-ink-muted">{label}</p>
      <p className="mt-0.5 text-[17px] font-semibold tabular-nums text-ink">{value}</p>
      <p className="text-[12.5px] tabular-nums text-ink-muted">{quarter}</p>
    </div>
  );
}
