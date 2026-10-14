"use client";

import { useRef, useState } from "react";
import Decimal from "decimal.js";
import { Plus, RotateCcw, X } from "lucide-react";

import { AMOUNT_ERROR_MESSAGES, centsOf, formatEuros, parseAmount } from "@/lib/tools/amount";
import {
  REGULARISATION_ERROR_MESSAGES,
  REGULARISATION_EXAMPLE,
  computeRegularisation,
  parseIsoDate,
  validateRegularisation,
  type ChargesRegime,
  type RegularisationError,
} from "@/lib/tools/charges-regularisation";
import {
  AmountField,
  ChoiceGroup,
  DateField,
  FieldMessages,
  ToolSheet,
  ToolStep,
  ToolWorkbench,
  describedBy,
  fieldClass,
} from "@/components/marketing/tools/ToolForm";
import { ResultBadge, ResultFigure, ResultJump, ResultPanel, ResultPending, ResultRows } from "@/components/marketing/tools/ToolResult";
import { CopyButton } from "@/components/marketing/tools/CopyButton";
import { useDebouncedValue } from "@/components/marketing/tools/use-debounced-value";

interface Line {
  id: number;
  label: string;
  amount: string;
  /** Shown as placeholder and used while the whole form is still the example. */
  example?: string;
}

const SUGGESTIONS = [
  "Eau froide",
  "Eau chaude collective",
  "Chauffage collectif",
  "Ascenseur",
  "Entretien des parties communes",
  "Espaces verts",
  "Ordures ménagères (TEOM)",
];

const frenchDecimal = (value: string) => value.replace(".", ",");
const INITIAL_LINES: Line[] = REGULARISATION_EXAMPLE.lines.map((line, index) => ({
  id: index + 1,
  label: line.label,
  amount: "",
  example: frenchDecimal(line.amount),
}));
const EXAMPLE_PROVISION = frenchDecimal(REGULARISATION_EXAMPLE.monthlyProvision);
const EXAMPLE_MONTHS = String(REGULARISATION_EXAMPLE.monthsPaid);
const MAX_LINES = 20;

const REGIME_CHOICES = [
  { value: "provisions" as const, label: "Des provisions", description: "Un montant chaque mois, régularisé une fois par an." },
  { value: "forfait" as const, label: "Un forfait", description: "Un montant fixe versé avec le loyer, sans régularisation." },
];

const LONG_DATE = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
function formatDate(date: Date): string {
  const text = LONG_DATE.format(date);
  return date.getUTCDate() === 1 ? text.replace(/^1 /, "1er ") : text;
}

function errorFor(errors: RegularisationError[], ...codes: RegularisationError[]): string | null {
  const found = errors.find((error) => codes.includes(error));
  return found ? REGULARISATION_ERROR_MESSAGES[found] : null;
}

export function ChargesCalculator({ defaultStart, defaultEnd }: { defaultStart: string; defaultEnd: string }) {
  const [regime, setRegime] = useState<ChargesRegime>("provisions");
  const [periodStart, setPeriodStart] = useState(defaultStart);
  const [periodEnd, setPeriodEnd] = useState(defaultEnd);
  const [partial, setPartial] = useState(false);
  const [occupancyStart, setOccupancyStart] = useState(defaultStart);
  const [occupancyEnd, setOccupancyEnd] = useState(defaultEnd);
  const [provisionText, setProvisionText] = useState("");
  const [monthsText, setMonthsText] = useState(EXAMPLE_MONTHS);
  const [lines, setLines] = useState<Line[]>(INITIAL_LINES);
  const nextId = useRef(INITIAL_LINES.length + 1);

  const isExample = provisionText.trim() === "" && lines.every((line) => line.amount.trim() === "");

  // ── Parsing ────────────────────────────────────────────────────────────────
  const start = parseIsoDate(periodStart);
  const end = parseIsoDate(periodEnd);
  const occStart = partial ? parseIsoDate(occupancyStart) : null;
  const occEnd = partial ? parseIsoDate(occupancyEnd) : null;

  const provision = parseAmount(isExample ? EXAMPLE_PROVISION : provisionText, 100_000);
  const provisionError = isExample || provision.ok ? null : provision.error === "empty" ? "Indiquez la provision mensuelle (0 si aucune)." : AMOUNT_ERROR_MESSAGES[provision.error];

  const monthsValid = /^\d{1,2}$/.test(monthsText.trim());
  const months = monthsValid ? Number(monthsText.trim()) : NaN;

  const lineResults = lines.map((line) => {
    const text = isExample ? line.example ?? "" : line.amount;
    if (text.trim() === "") return { line, value: null, error: null };
    const parsed = parseAmount(text, 1_000_000);
    return parsed.ok
      ? { line, value: parsed.value, error: null }
      : { line, value: null, error: AMOUNT_ERROR_MESSAGES[parsed.error] };
  });

  const dateErrors = {
    start: start ? null : "Indiquez une date valide.",
    end: end ? null : "Indiquez une date valide.",
    occStart: partial && !occStart ? "Indiquez une date valide." : null,
    occEnd: partial && !occEnd ? "Indiquez une date valide." : null,
  };

  const input =
    start && end && (!partial || (occStart && occEnd))
      ? {
          periodStart: start,
          periodEnd: end,
          occupancy: partial && occStart && occEnd ? { start: occStart, end: occEnd } : null,
          charges: lineResults.flatMap((r) => (r.value ? [r.value] : [])),
          monthlyProvision: provision.ok ? provision.value : new Decimal(0),
          monthsPaid: monthsValid ? months : -1,
        }
      : null;
  const ruleErrors = input ? validateRegularisation(input) : [];
  const blocked =
    !input || ruleErrors.length > 0 || Boolean(provisionError) || lineResults.some((r) => r.error) || Object.values(dateErrors).some(Boolean);
  const computed = input && !blocked ? { input, result: computeRegularisation(input) } : null;
  const result = computed?.result ?? null;

  const chargesSum = lineResults.reduce((sum, r) => (r.value ? sum.plus(r.value) : sum), new Decimal(0));

  // ── Wording ────────────────────────────────────────────────────────────────
  const verdict = result
    ? result.direction === "tenant-owes"
      ? { caption: "à régler par le locataire", badge: "Complément", sentence: `Les charges dues (${formatEuros(result.tenantShare)}) dépassent les provisions versées (${formatEuros(result.provisionsTotal)}) : le locataire doit la différence.` }
      : result.direction === "landlord-owes"
        ? { caption: "à rembourser au locataire", badge: "Trop-perçu", sentence: `Les provisions versées (${formatEuros(result.provisionsTotal)}) dépassent les charges dues (${formatEuros(result.tenantShare)}) : vous remboursez la différence au locataire.` }
        : { caption: "rien à régler de part et d'autre", badge: "Équilibre", sentence: "Les provisions versées couvrent exactement les charges dues." }
    : null;
  const announced = useDebouncedValue(
    result && verdict && !isExample ? `Régularisation : ${formatEuros(result.balance.abs())} ${verdict.caption}.` : "",
    700
  );

  // ── Actions ────────────────────────────────────────────────────────────────
  function updateLine(id: number, patch: Partial<Line>) {
    setLines((current) => current.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  }
  function addLine(label: string) {
    if (lines.length >= MAX_LINES) return;
    const id = nextId.current++;
    // Leaving the example: keep its amounts as real values so nothing jumps.
    setLines((current) => [
      ...(isExample ? current.map((line) => ({ ...line, amount: line.example ?? "" })) : current),
      { id, label, amount: "" },
    ]);
    if (isExample) setProvisionText(EXAMPLE_PROVISION);
    window.requestAnimationFrame(() => document.getElementById(`charge-montant-${id}`)?.focus());
  }
  function removeLine(id: number) {
    setLines((current) => current.filter((line) => line.id !== id));
  }
  function reset() {
    setRegime("provisions");
    setPeriodStart(defaultStart);
    setPeriodEnd(defaultEnd);
    setPartial(false);
    setOccupancyStart(defaultStart);
    setOccupancyEnd(defaultEnd);
    setProvisionText("");
    setMonthsText(EXAMPLE_MONTHS);
    setLines(INITIAL_LINES);
  }

  const unusedSuggestions = SUGGESTIONS.filter((label) => !lines.some((line) => line.label === label));

  // ── Form ───────────────────────────────────────────────────────────────────
  const form = (
    <ToolSheet label="Calcul de la régularisation des charges">
      <ToolStep step={1} title="Comment le bail fait payer les charges">
        <ChoiceGroup
          name="regime"
          legend="Le bail prévoit"
          choices={REGIME_CHOICES}
          value={regime}
          onChange={setRegime}
          hint="Location vide : toujours des provisions, sauf en colocation. Bail mobilité : toujours un forfait. Location meublée et colocation : le bail précise l'un ou l'autre."
        />
      </ToolStep>

      {regime === "provisions" ? (
        <>
          <ToolStep step={2} title="La période régularisée" description="En général l'année civile écoulée, ou la période couverte par le décompte de copropriété.">
            <div className="grid gap-4 sm:grid-cols-2">
              <DateField id="periode-debut" label="Du" value={periodStart} onChange={setPeriodStart} error={dateErrors.start} />
              <DateField
                id="periode-fin"
                label="Au"
                value={periodEnd}
                onChange={setPeriodEnd}
                error={dateErrors.end ?? errorFor(ruleErrors, "period-order", "period-too-long")}
              />
            </div>
            <label className="flex cursor-pointer items-start gap-3 text-[14.5px] leading-6 text-ink">
              <input
                type="checkbox"
                checked={partial}
                onChange={(event) => setPartial(event.target.checked)}
                className="mt-1 size-[18px] shrink-0 cursor-pointer rounded border-line accent-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
              />
              <span>
                Le locataire n&apos;a occupé le logement qu&apos;une partie de cette période
                <span className="block text-[13.5px] text-ink-muted">Arrivée ou départ en cours d&apos;année : sa part est calculée au prorata des jours.</span>
              </span>
            </label>
            {partial ? (
              <div className="grid gap-4 rounded-xl bg-paper p-4 ring-1 ring-line-soft sm:grid-cols-2">
                <DateField
                  id="occupation-debut"
                  label="Arrivée (ou début de période)"
                  value={occupancyStart}
                  onChange={setOccupancyStart}
                  min={periodStart}
                  max={periodEnd}
                  error={dateErrors.occStart}
                />
                <DateField
                  id="occupation-fin"
                  label="Départ (ou fin de période)"
                  value={occupancyEnd}
                  onChange={setOccupancyEnd}
                  min={periodStart}
                  max={periodEnd}
                  error={dateErrors.occEnd ?? errorFor(ruleErrors, "occupancy-order", "occupancy-outside-period")}
                />
              </div>
            ) : null}
          </ToolStep>

          <ToolStep step={3} title="Les provisions versées" description="Ce que le locataire a payé en provisions pour charges sur la période.">
            <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_11rem]">
              <AmountField
                id="provision"
                label="Provision mensuelle"
                value={provisionText}
                onChange={setProvisionText}
                placeholder={isExample ? EXAMPLE_PROVISION : "0,00"}
                suffix="€ / mois"
                error={provisionError}
              />
              <div>
                <label htmlFor="mois" className="block text-[14.5px] font-medium text-ink">
                  Mois versés
                </label>
                <div className="relative mt-2">
                  <input
                    id="mois"
                    name="mois"
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    value={monthsText}
                    onChange={(event) => setMonthsText(event.target.value)}
                    aria-invalid={errorFor(ruleErrors, "months-invalid") || !monthsValid ? true : undefined}
                    aria-describedby={describedBy("mois", undefined, !monthsValid ? REGULARISATION_ERROR_MESSAGES["months-invalid"] : errorFor(ruleErrors, "months-invalid"))}
                    className={fieldClass(!monthsValid || Boolean(errorFor(ruleErrors, "months-invalid")), "h-12 pl-4 pr-14 text-[16px]")}
                  />
                  <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[14px] text-ink-muted">
                    mois
                  </span>
                </div>
                <FieldMessages id="mois" error={!monthsValid ? REGULARISATION_ERROR_MESSAGES["months-invalid"] : errorFor(ruleErrors, "months-invalid")} />
              </div>
            </div>
          </ToolStep>

          <ToolStep
            step={4}
            title="Les charges récupérables de la période"
            description={
              <>
                Les montants du décompte de copropriété ou de vos factures, pour le logement et pour toute la période. Seules les
                dépenses de la liste du décret du 26 août 1987 sont récupérables.
              </>
            }
          >
            <ul className="space-y-2.5">
              {lineResults.map(({ line, error }, index) => (
                <li key={line.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-2 gap-y-1 sm:grid-cols-[minmax(0,1fr)_10.5rem_auto]">
                  <div className="col-span-2 min-w-0 sm:col-span-1">
                    <label htmlFor={`charge-libelle-${line.id}`} className="sr-only">
                      Libellé de la charge {index + 1}
                    </label>
                    <input
                      id={`charge-libelle-${line.id}`}
                      type="text"
                      value={line.label}
                      placeholder="Libellé de la charge"
                      onChange={(event) => updateLine(line.id, { label: event.target.value })}
                      className={fieldClass(false, "h-11 px-3.5 text-[15px]")}
                    />
                  </div>
                  <div className="relative min-w-0">
                    <label htmlFor={`charge-montant-${line.id}`} className="sr-only">
                      Montant {line.label ? `: ${line.label}` : `de la charge ${index + 1}`}
                    </label>
                    <input
                      id={`charge-montant-${line.id}`}
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      value={line.amount}
                      placeholder={isExample ? line.example ?? "0,00" : "0,00"}
                      onChange={(event) => updateLine(line.id, { amount: event.target.value })}
                      aria-invalid={error ? true : undefined}
                      aria-describedby={error ? `charge-montant-${line.id}-error` : undefined}
                      className={fieldClass(Boolean(error), "h-11 pl-3.5 pr-9 text-right text-[15px]")}
                    />
                    <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-[14px] text-ink-muted">
                      €
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLine(line.id)}
                    aria-label={`Supprimer ${line.label || `la charge ${index + 1}`}`}
                    className="inline-flex size-11 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-paper hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                  >
                    <X aria-hidden="true" className="size-4" />
                  </button>
                  {error ? (
                    <p id={`charge-montant-${line.id}-error`} className="col-span-2 text-[13.5px] font-medium text-[#A1281E] sm:col-span-3">
                      {error}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>

            {lines.length < MAX_LINES ? (
              <div>
                <p className="text-[13.5px] text-ink-muted">Ajouter une ligne</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {unusedSuggestions.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => addLine(label)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[13.5px] text-ink transition-colors hover:border-sage-300 hover:bg-sage-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                    >
                      <Plus aria-hidden="true" className="size-3.5 text-forest" />
                      {label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => addLine("")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-sage-300 px-3 py-1.5 text-[13.5px] font-medium text-forest transition-colors hover:bg-sage-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest"
                  >
                    <Plus aria-hidden="true" className="size-3.5" />
                    Autre charge
                  </button>
                </div>
              </div>
            ) : null}

            <div className="flex items-baseline justify-between gap-4 border-t border-line-soft pt-4 text-[15px]">
              <span className="font-medium text-ink">Total des charges récupérables</span>
              <span className="font-semibold tabular-nums text-ink">{formatEuros(chargesSum)}</span>
            </div>

            <details className="group rounded-xl bg-paper px-4 py-3 ring-1 ring-line-soft">
              <summary className="cursor-pointer list-none text-[14px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                <span className="underline decoration-line underline-offset-4 group-open:no-underline">Ce qui ne se récupère pas sur le locataire</span>
              </summary>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-[14px] leading-6 text-ink-muted">
                <li>La taxe foncière (seule la taxe d&apos;enlèvement des ordures ménagères est récupérable).</li>
                <li>L&apos;assurance propriétaire non occupant et les frais de gestion ou d&apos;agence.</li>
                <li>Les gros travaux, les grosses réparations et le remplacement des équipements.</li>
                <li>Plus généralement, toute dépense absente de la liste du décret du 26 août 1987.</li>
              </ul>
            </details>
          </ToolStep>
          {result && verdict ? (
            <ResultJump
              label={isExample ? "Exemple : régularisation" : "Régularisation"}
              value={result.direction === "balanced" ? "Rien à régler" : formatEuros(result.balance.abs())}
              detail={result.direction === "balanced" ? undefined : verdict.caption}
            />
          ) : null}
        </>
      ) : (
        <div className="border-t border-line-soft px-5 py-6 sm:px-7">
          <p className="text-[15px] leading-7 text-ink">
            Avec un forfait, il n&apos;y a rien à calculer : le montant versé avec le loyer est définitif. Il ne peut donner lieu ni
            à un complément ni à une régularisation (articles 8-1, 25-10 et 25-18 de la loi du 6 juillet 1989).
          </p>
        </div>
      )}
    </ToolSheet>
  );

  // ── Result ─────────────────────────────────────────────────────────────────
  const resultPanel =
    regime === "forfait" ? (
      <ResultPanel title="Régularisation des charges" badge={<ResultBadge tone="neutral">Forfait</ResultBadge>}>
        <p className="text-[1.35rem] font-semibold leading-snug tracking-[-0.02em] text-ink">Pas de régularisation</p>
        <p className="mt-2.5 text-[14.5px] leading-6 text-ink-muted">
          Un forfait de charges versé avec le loyer ne se régularise pas : ni complément à demander, ni trop-perçu à rendre.
        </p>
      </ResultPanel>
    ) : (
      <ResultPanel
        title="Régularisation des charges"
        badge={isExample ? <ResultBadge tone="example">Exemple</ResultBadge> : verdict ? <ResultBadge tone={result?.direction === "balanced" ? "sage" : "neutral"}>{verdict.badge}</ResultBadge> : null}
        footer={
          result ? (
            <div className="flex flex-wrap items-center gap-2.5">
              <CopyButton text={result.balance.abs().toFixed(2).replace(".", ",")} label="Copier le montant" />
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
        {computed && result && verdict ? (
          <>
            <ResultFigure
              label={`Du ${formatDate(computed.input.periodStart)} au ${formatDate(computed.input.periodEnd)}`}
              cents={centsOf(result.balance.abs())}
              text={formatEuros(result.balance.abs())}
              muted={result.direction === "balanced"}
              caption={<span className="font-semibold">{verdict.caption}</span>}
            />
            <p className="mt-4 text-[14.5px] leading-6 text-ink-muted">{verdict.sentence}</p>
            <ResultRows
              rows={[
                { label: "Charges récupérables de la période", value: formatEuros(result.chargesTotal) },
                ...(result.prorated
                  ? [
                      {
                        label: "Part du locataire",
                        detail: `${result.occupiedDays} jours d'occupation sur ${result.periodDays}`,
                        value: formatEuros(result.tenantShare),
                      },
                    ]
                  : []),
                {
                  label: "Provisions versées",
                  detail: `${formatEuros(computed.input.monthlyProvision)} × ${computed.input.monthsPaid} mois`,
                  value: `− ${formatEuros(result.provisionsTotal)}`,
                },
                {
                  label: result.direction === "landlord-owes" ? "À rembourser au locataire" : result.direction === "tenant-owes" ? "À régler par le locataire" : "Solde",
                  value: formatEuros(result.balance.abs()),
                  strong: true,
                },
              ]}
            />
            {result.monthlyEquivalent && !result.prorated ? (
              <p className="mt-4 rounded-lg bg-paper px-3.5 py-3 text-[13.5px] leading-5 text-ink ring-1 ring-line-soft">
                Repère pour la provision suivante : <strong className="font-semibold tabular-nums">{formatEuros(result.monthlyEquivalent)}</strong> par
                mois (charges de la période ÷ 12), à rapprocher du budget prévisionnel de la copropriété.
              </p>
            ) : null}
            <p className="mt-3 text-[12.5px] leading-5 text-ink-muted">
              Envoyez au locataire le décompte par nature de charges un mois avant la régularisation ; les justificatifs restent à sa
              disposition six mois (article 23 de la loi du 6 juillet 1989).
            </p>
          </>
        ) : (
          <ResultPending>Complétez ou corrigez les champs signalés pour voir la régularisation.</ResultPending>
        )}
        <p role="status" aria-live="polite" className="sr-only">
          {announced}
        </p>
      </ResultPanel>
    );

  return <ToolWorkbench form={form} result={resultPanel} />;
}
