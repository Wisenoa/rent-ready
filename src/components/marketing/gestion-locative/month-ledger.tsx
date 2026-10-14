import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import {
  EXAMPLE_AS_OF_LABEL,
  EXAMPLE_MONTH_LABEL,
  EXAMPLE_ROWS,
  EXAMPLE_TOTALS,
  type ExampleRow,
} from "./example-month";

/**
 * The month as a landlord reads it in Lokna: what was due, what came in, what is
 * left. Paid rows stay quiet; the one exception opens up and says what to do.
 *
 * Server-rendered from `example-month.ts`; nothing here computes money. The
 * numbered marks refer to the notes printed under the ledger.
 */

const COLS =
  "lg:grid lg:grid-cols-[minmax(0,2.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.55fr)] lg:gap-x-6";

function Mark({ n }: { n: number }) {
  return (
    <sup
      aria-hidden="true"
      className="ml-1.5 inline-grid size-4 translate-y-[-1px] place-items-center rounded-[3px] border border-current text-[10px] font-semibold leading-none not-italic"
    >
      {n}
    </sup>
  );
}

function Amount({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ink" | "muted" | "alert";
}) {
  return (
    <span
      className={cn(
        "hidden text-right text-[15px] tabular-nums lg:block",
        tone === "ink" && "text-[#15241F]",
        tone === "muted" && "text-[#5C6560]",
        tone === "alert" && "font-semibold text-[#A63F17]"
      )}
    >
      <span className="sr-only">{label} : </span>
      {value === "—" ? (
        <>
          <span aria-hidden="true">—</span>
          <span className="sr-only">rien</span>
        </>
      ) : (
        value
      )}
    </span>
  );
}

function Row({ row, mark }: { row: ExampleRow; mark?: number }) {
  const exception = !row.settled;
  const status = exception ? "Paiement partiel" : `Réglé le ${row.lastPaymentLabel}`;
  const document = exception ? "Reçu de paiement partiel" : "Quittance prête";

  return (
    <li
      className={cn(
        "border-b border-[#D9D5CC] px-4 sm:px-5 lg:px-4",
        exception
          ? "border-l-2 border-l-[#A63F17] bg-[#F6EADF]/70 py-4"
          : "py-3.5"
      )}
    >
      <div className={cn("grid grid-cols-[minmax(0,1fr)_auto] gap-x-4", COLS, "lg:items-baseline")}>
        <div className="flex items-baseline gap-2.5">
          <span
            aria-hidden="true"
            className={cn(
              "size-2 shrink-0 translate-y-[-1px] rounded-full",
              exception ? "bg-[#A63F17]" : "bg-[#7FA68E]"
            )}
          />
          <p className="min-w-0">
            <span className="font-medium text-[#15241F]">{row.home}</span>
            <span className="text-[#4F5D56]"> · {row.street}</span>
            <span className="block text-[13px] text-[#5C6560]">{row.tenant}</span>
          </p>
        </div>

        {/* Small screens: the one figure that matters for this row. */}
        <p className="text-right lg:hidden">
          <span
            className={cn(
              "block text-[15px] tabular-nums",
              exception ? "font-semibold text-[#A63F17]" : "text-[#4F5D56]"
            )}
          >
            {formatCurrency(exception ? row.outstanding : row.paid)}
          </span>
          <span className="block text-[12px] text-[#5C6560]">
            {exception ? "reste dû" : "reçu"}
          </span>
        </p>

        <Amount label="Attendu" value={formatCurrency(row.due)} tone="muted" />
        <Amount label="Reçu" value={formatCurrency(row.paid)} tone={exception ? "ink" : "muted"} />
        <Amount
          label="Reste dû"
          value={row.outstanding.isZero() ? "—" : formatCurrency(row.outstanding)}
          tone={exception ? "alert" : "muted"}
        />

        <p
          className={cn(
            "col-span-2 mt-1.5 pl-[18px] text-[13px] leading-5 lg:col-span-1 lg:mt-0 lg:pl-0 lg:text-right",
            exception ? "text-[#A63F17]" : "text-[#2F6B4F]"
          )}
        >
          <span className={cn(exception && "font-semibold")}>{status}</span>
          <span className="text-[#4F5D56] lg:block">
            <span className="lg:hidden"> · </span>
            {document}
            {mark ? <Mark n={mark} /> : null}
          </span>
        </p>
      </div>

      {exception ? (
        <p className="mt-3 border-t border-[#E6CDBB] pt-3 text-[13px] leading-6 text-[#4F5D56] lg:ml-[18px] lg:max-w-[62ch]">
          {formatCurrency(row.paid)} reçus le {row.lastPaymentLabel} sur{" "}
          {formatCurrency(row.due)}. La quittance attendra le solde de{" "}
          {formatCurrency(row.outstanding)}.{" "}
          <span className="text-[#15241F]">
            Vous relancez {row.tenant.split(" ")[0]} avec ces montants, puis
            vous enregistrez le solde à réception.
          </span>
        </p>
      ) : null}
    </li>
  );
}

const NOTES = [
  "Un loyer réglé reste discret. Sa quittance est prête à télécharger en PDF.",
  "Un versement incomplet reste visible jusqu'au solde : reçu de paiement partiel, reste dû, de quoi relancer si besoin.",
  "Les montants attendus viennent des baux. Vous enregistrez ce qui arrive, Lokna fait les comptes.",
];

export function MonthLedger() {
  const [first, ...rest] = EXAMPLE_ROWS;
  const exceptionIndex = rest.findIndex((r) => !r.settled);

  return (
    <figure aria-labelledby="ledger-title" className="mt-12 sm:mt-16 lg:mt-20">
      <div className="flex flex-col gap-1 border-t-2 border-[#15241F] pt-4 sm:flex-row sm:items-baseline sm:justify-between">
        <h2
          id="ledger-title"
          className="font-[family-name:var(--font-serif)] text-[2rem] leading-none tracking-[-0.02em] text-[#0B3B2C] sm:text-[2.5rem]"
        >
          {EXAMPLE_MONTH_LABEL}
        </h2>
        <p className="text-[13px] text-[#5C6560]">
          Au {EXAMPLE_AS_OF_LABEL} · {EXAMPLE_ROWS.length} logements ·
          exemple fictif
        </p>
      </div>

      <div className="-mx-5 mt-5 sm:mx-0">
        <div
          aria-hidden="true"
          className={cn(
            "hidden border-b border-[#15241F]/70 px-4 pb-2 text-[12px] font-medium text-[#4F5D56]",
            COLS
          )}
        >
          <span>Logement et locataire</span>
          <span className="text-right">Attendu</span>
          <span className="text-right">Reçu</span>
          <span className="text-right">Reste dû</span>
          <span className="text-right">Situation</span>
        </div>

        <ol className="border-t border-[#D9D5CC] lg:border-t-0">
          <Row row={first} mark={1} />
          {rest.map((row, i) => (
            <Row key={row.id} row={row} mark={i === exceptionIndex ? 2 : undefined} />
          ))}
        </ol>

        <div
          className={cn(
            "border-b-[3px] border-double border-[#15241F] px-4 py-4 sm:px-5 lg:px-4",
            COLS
          )}
        >
          <p className="mb-2 text-[13px] font-semibold text-[#15241F] lg:mb-0 lg:self-baseline">
            Total du mois
            <Mark n={3} />
          </p>
          <dl className="grid grid-cols-3 gap-3 lg:contents">
            {[
              { label: "Attendu", value: EXAMPLE_TOTALS.due, tone: "text-[#15241F]" },
              { label: "Reçu", value: EXAMPLE_TOTALS.paid, tone: "text-[#2F6B4F]" },
              { label: "Reste dû", value: EXAMPLE_TOTALS.outstanding, tone: "text-[#A63F17]" },
            ].map((total) => (
              <div key={total.label} className="lg:text-right">
                <dt className="text-[12px] text-[#5C6560] lg:sr-only">{total.label}</dt>
                <dd
                  className={cn(
                    "whitespace-nowrap text-[15px] font-semibold tabular-nums sm:text-base",
                    total.tone
                  )}
                >
                  {formatCurrency(total.value)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <figcaption>
        <ol className="mt-6 grid gap-x-8 gap-y-3 text-[13px] leading-6 text-[#4F5D56] lg:grid-cols-3">
          {NOTES.map((note, i) => (
            <li key={note} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-[3px] grid size-4 shrink-0 place-items-center rounded-[3px] border border-[#4F5D56] text-[10px] font-semibold leading-none"
              >
                {i + 1}
              </span>
              <span>{note}</span>
            </li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
