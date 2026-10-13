"use client";

import type { CSSProperties } from "react";
import { AnimatePresence, m } from "framer-motion";
import { cn } from "@/lib/utils";
import { Amount } from "./Amount";
import { MONTH_LABEL, type MonthRow, type MonthState } from "./month-types";
import styles from "./home.module.css";

/**
 * The month as Lokna's follow-up screen shows it: what was due, what came in,
 * what is left, one line per home. It renders on the server with the state it
 * is given, then animates between states: figures count, a settled line gets
 * its tick, the line that needs attention turns terracotta, and the last event
 * slides into the footer.
 *
 * `intro` plays the one-time depth entrance used in the hero (CSS, so it also
 * runs before hydration and without JavaScript).
 */

const ease = [0.2, 0.7, 0.2, 1] as const;

/**
 * Status mark: an outlined dot (expected), a terracotta dot (partial) or a
 * tick that draws itself (settled). Plain CSS transitions on stacked layers,
 * so rapid state changes — scrolling fast through the story — never leave a
 * mark half-mounted.
 */
function Marker({ state }: { state: MonthRow["state"] }) {
  return (
    <span aria-hidden="true" data-state={state} className={cn(styles.marker, "relative mt-[3px] grid size-4 place-items-center")}>
      <span className={styles.dot} />
      <svg viewBox="0 0 16 16" className={styles.tick}>
        <circle cx="8" cy="8" r="8" fill="#2F6B4F" />
        <path d="M4.6 8.3 7 10.6l4.4-4.9" fill="none" stroke="#FDFCF9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
      </svg>
    </span>
  );
}

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
        "grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-x-3 border-b border-l-[3px] border-b-[#E7E3DA] px-4 last:border-b-0 sm:px-5",
        compact ? "py-2.5 lg:py-3" : "py-3",
        partial ? "border-l-[#A63F17] bg-[#F7ECE3] pl-[13px] sm:pl-[17px]" : "border-l-transparent"
      )}
    >
      <Marker state={row.state} />
      <div className="min-w-0">
        <p className="truncate text-[14px] text-[#15241F]">
          <span className="font-medium">{row.home}</span>
          <span className="text-[#5A6660]"> · {row.street}</span>
        </p>
        <p className={cn("text-[12.5px] text-[#5C6560]", compact && "max-lg:hidden")}>{row.tenant}</p>
        <AnimatePresence initial={false} mode="wait">
          <m.p
            key={`${row.status}-${row.document}-${row.reminder}`}
            initial={{ y: 6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -6, opacity: 0 }}
            transition={{ duration: 0.22, ease }}
            className={cn(
              "mt-1 text-[12.5px]",
              paid && "text-[#2F6B4F]",
              partial && "font-medium text-[#A63F17]",
              row.state === "upcoming" && "text-[#5C6560]"
            )}
          >
            {row.status}
            {row.document ? <span className="font-normal text-[#4F5D56]"> · {row.document}</span> : null}
            {row.reminder ? <span className="block font-normal text-[#4F5D56]">{row.reminder}</span> : null}
          </m.p>
        </AnimatePresence>
      </div>
      <p className="text-right">
        <span
          className={cn(
            "block whitespace-nowrap text-[14px] transition-colors duration-500",
            partial ? "font-semibold text-[#A63F17]" : "text-[#15241F]"
          )}
        >
          <Amount cents={row.amountCents} label={partial ? row.outstanding : paid ? row.paid : row.due} />
        </span>
        <span className="block text-[12px] text-[#5C6560]">
          {partial ? "reste dû" : paid ? "reçu" : "attendu"}
        </span>
      </p>
    </li>
  );
}

export function LivePanel({
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
        <p className="text-[12.5px] tabular-nums text-[#5C6560]">{state.asOf}</p>
      </div>

      <dl className={cn("grid grid-cols-3 gap-2 border-y border-[#E7E3DA] px-4 sm:px-5", compact ? "py-2 lg:py-3" : "py-3")}>
        {[
          { label: "Attendu", cents: state.dueCents, value: state.due, tone: "text-[#15241F]" },
          { label: "Reçu", cents: state.paidCents, value: state.paid, tone: "text-[#2F6B4F]" },
          {
            label: "Reste dû",
            cents: state.outstandingCents,
            value: state.outstanding,
            tone: state.outstandingCents === 0 ? "text-[#2F6B4F]" : "text-[#A63F17]",
          },
        ].map((item) => (
          <div key={item.label}>
            <dt className="text-[12px] text-[#5C6560]">{item.label}</dt>
            <dd className={cn("whitespace-nowrap text-[15px] font-semibold transition-colors duration-500 sm:text-[17px]", item.tone)}>
              <Amount cents={item.cents} label={item.value} />
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
        <p className="w-[4.5rem] text-right text-[12px] tabular-nums text-[#4F5D56]">{state.percent} % reçu</p>
      </div>

      <ul className="mt-2">
        {state.rows.map((row, i) => (
          <RowLine key={row.id} row={row} index={i} intro={intro} compact={compact} />
        ))}
      </ul>

      <div
        className={cn(
          "relative h-10 overflow-hidden border-t border-[#E7E3DA] bg-[#F4F1EA] text-[12.5px] text-[#4F5D56]",
          compact && "max-lg:hidden"
        )}
      >
        <AnimatePresence initial={false}>
          <m.p
            key={state.event}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%", opacity: 0, transition: { duration: 0.2 } }}
            transition={{ duration: 0.4, ease }}
            className="absolute inset-0 flex items-center gap-2 px-4 sm:px-5"
          >
            <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#0B3B2C]" />
            <span className="truncate">{state.event}</span>
          </m.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
