import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { MONTH_LABEL, type MonthRow, type MonthState } from "./month-types";
import styles from "./home.module.css";

/**
 * The month as Lokna's follow-up screen shows it: what was due, what came in,
 * what is left, and one line per home. Stateless, so the hero renders it on the
 * server and the story re-renders it as the month moves forward.
 *
 * `intro` plays the one-time entrance used in the hero.
 */

function RowLine({
  row,
  index,
  intro,
  compact,
}: {
  row: MonthRow;
  index: number;
  intro: boolean;
  compact: boolean;
}) {
  const partial = row.state === "partial";
  const paid = row.state === "paid";

  return (
    <li
      style={{ "--i": index } as CSSProperties}
      className={cn(
        styles.row,
        intro && styles.rowIn,
        "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 border-b border-[#E7E3DA] px-4 last:border-b-0 sm:px-5",
        compact ? "py-2.5 lg:py-3" : "py-3",
        partial
          ? "border-l-[3px] border-l-[#A63F17] bg-[#F7ECE3] pl-[13px] sm:pl-[17px]"
          : "border-l-[3px] border-l-transparent"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "mt-[7px] size-2 rounded-full",
          paid && "bg-[#7FA68E]",
          partial && "bg-[#A63F17]",
          row.state === "upcoming" && "border border-[#9AA39D] bg-transparent"
        )}
      />
      <div className="min-w-0">
        <p className="truncate text-[14px] text-[#15241F]">
          <span className="font-medium">{row.home}</span>
          <span className="text-[#5A6660]"> · {row.street}</span>
        </p>
        <p className={cn("text-[12.5px] text-[#5C6560]", compact && "max-lg:hidden")}>{row.tenant}</p>
        <p
          className={cn(
            "mt-1 text-[12.5px]",
            paid && "text-[#2F6B4F]",
            partial && "font-medium text-[#A63F17]",
            row.state === "upcoming" && "text-[#5C6560]"
          )}
        >
          {row.status}
          {row.document ? (
            <span className="font-normal text-[#4F5D56]"> · {row.document}</span>
          ) : null}
        </p>
        {row.reminder ? (
          <p className="mt-0.5 text-[12.5px] text-[#4F5D56]">{row.reminder}</p>
        ) : null}
      </div>
      <p className="text-right">
        <span
          className={cn(
            "block whitespace-nowrap text-[14px] tabular-nums",
            partial ? "font-semibold text-[#A63F17]" : "text-[#15241F]"
          )}
        >
          {partial ? row.outstanding : paid ? row.paid : row.due}
        </span>
        <span className="block text-[12px] text-[#5C6560]">
          {partial ? "reste dû" : paid ? "reçu" : "attendu"}
        </span>
      </p>
    </li>
  );
}

export function MonthPanel({
  state,
  intro = false,
  compact = false,
  className,
}: {
  state: MonthState;
  intro?: boolean;
  /** Below lg, drop secondary lines so the panel can stay pinned on a phone. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[#15241F]/10 bg-[#FDFCF9] text-[#15241F] shadow-[0_40px_80px_-40px_rgba(6,24,18,0.55),0_2px_6px_-2px_rgba(6,24,18,0.12)]",
        intro && styles.panelIn,
        className
      )}
    >
      <div className="flex items-baseline justify-between gap-3 px-4 pb-3 pt-4 sm:px-5 sm:pt-5">
        <p className="font-[family-name:var(--font-serif)] text-[1.6rem] leading-none tracking-[-0.02em] text-[#0B3B2C] sm:text-[1.9rem]">
          {MONTH_LABEL}
        </p>
        <p className="text-[12.5px] text-[#5C6560]">{state.asOf}</p>
      </div>

      <dl className="grid grid-cols-3 gap-2 border-y border-[#E7E3DA] px-4 py-3 sm:px-5">
        {[
          { label: "Attendu", value: state.due, tone: "text-[#15241F]" },
          { label: "Reçu", value: state.paid, tone: "text-[#2F6B4F]" },
          { label: "Reste dû", value: state.outstanding, tone: "text-[#A63F17]" },
        ].map((item) => (
          <div key={item.label}>
            <dt className="text-[12px] text-[#5C6560]">{item.label}</dt>
            <dd className={cn("whitespace-nowrap text-[15px] font-semibold tabular-nums sm:text-[17px]", item.tone)}>
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center gap-3 px-4 pt-3 sm:px-5">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#E7E3DA]">
          <div
            style={{ "--p": state.percent / 100 } as CSSProperties}
            className={cn("h-full origin-left rounded-full bg-[#2F6B4F]", intro ? styles.barIn : styles.bar)}
          />
        </div>
        <p className="w-[4.5rem] text-right text-[12px] tabular-nums text-[#4F5D56]">
          {state.percent} % reçu
        </p>
      </div>

      <ul className="mt-2">
        {state.rows.map((row, i) => (
          <RowLine key={row.id} row={row} index={i} intro={intro} compact={compact} />
        ))}
      </ul>

      <p className={cn("flex items-start gap-2 border-t border-[#E7E3DA] bg-[#F4F1EA] px-4 py-2.5 text-[12.5px] text-[#4F5D56] sm:px-5", compact && "max-lg:hidden")}>
        <span aria-hidden="true" className="mt-[5px] size-1.5 shrink-0 rounded-full bg-[#0B3B2C]" />
        <span>{state.event}</span>
      </p>
    </div>
  );
}
