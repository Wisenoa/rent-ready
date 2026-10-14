import type { ReactNode } from "react";

import { Amount } from "@/components/marketing/home/Amount";

/**
 * The result of a free tool, drawn like the product surfaces of the homepage:
 * one figure that answers the question, the lines that justify it, then the
 * actions. Presentational; the calculator computes every value it shows.
 */
export function ResultPanel({
  title,
  badge,
  children,
  footer,
}: {
  title: string;
  badge?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section
      id="resultat"
      aria-label={title}
      className="scroll-mt-24 overflow-hidden rounded-2xl border border-ink/10 bg-[#FDFCF9] text-ink shadow-[0_40px_80px_-48px_rgba(6,24,18,0.55)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-line-soft px-5 py-4 sm:px-6">
        <h2 className="text-[15px] font-semibold">{title}</h2>
        {badge}
      </div>
      <div className="px-5 py-5 sm:px-6">{children}</div>
      {footer ? <div className="border-t border-line-soft bg-paper px-5 py-4 sm:px-6">{footer}</div> : null}
    </section>
  );
}

export function ResultBadge({ tone = "neutral", children }: { tone?: "neutral" | "sage" | "example"; children: ReactNode }) {
  const tones = {
    neutral: "bg-paper text-ink ring-line",
    sage: "bg-sage-50 text-sage-700 ring-sage-200",
    example: "bg-[#FBF3E2] text-[#7A5512] ring-[#EAD7AE]",
  } as const;
  return (
    <span className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-[12.5px] font-medium ring-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}

/** The figure that answers the question, with what it means underneath. */
export function ResultFigure({
  label,
  cents,
  text,
  caption,
  muted = false,
}: {
  label: string;
  cents: number;
  text: string;
  caption: ReactNode;
  muted?: boolean;
}) {
  return (
    <div>
      <p className="text-[13.5px] font-medium text-ink-muted">{label}</p>
      <p
        className={`mt-1 text-[2.6rem] font-semibold leading-none tracking-[-0.035em] sm:text-[2.9rem] ${
          muted ? "text-ink-soft" : "text-forest-deep"
        }`}
      >
        <Amount cents={cents} label={text} />
      </p>
      <div className="mt-2.5 text-[14.5px] leading-6 text-ink">{caption}</div>
    </div>
  );
}

export interface ResultRow {
  label: ReactNode;
  value: ReactNode;
  detail?: ReactNode;
  strong?: boolean;
}

export function ResultRows({ rows }: { rows: ResultRow[] }) {
  return (
    <dl className="mt-5 border-t border-line-soft">
      {rows.map((row, index) => (
        <div
          key={index}
          className={`flex items-baseline justify-between gap-4 border-b border-line-soft py-3 text-[14.5px] last:border-b-0 ${
            row.strong ? "font-semibold" : ""
          }`}
        >
          <dt className={row.strong ? "text-ink" : "text-ink-muted"}>
            {row.label}
            {row.detail ? <span className="mt-0.5 block text-[12.5px] font-normal text-ink-muted">{row.detail}</span> : null}
          </dt>
          <dd className="shrink-0 text-right tabular-nums text-ink">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A calculation written out so it can be checked by hand. */
export function ResultFormula({ children }: { children: ReactNode }) {
  return (
    <p className="mt-4 rounded-lg bg-paper px-3.5 py-3 text-center text-[14px] tabular-nums text-ink ring-1 ring-line-soft">
      {children}
    </p>
  );
}

/** Shown in place of the figure while the form holds an error. */
export function ResultPending({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-line px-4 py-8 text-center text-[14.5px] leading-6 text-ink-muted">
      {children}
    </div>
  );
}

/**
 * Below `lg` the result comes after the form. This line, at the end of the
 * form, gives the answer at once and links down to the detail — instead of a
 * sticky bar that would cover the fields.
 */
export function ResultJump({ label, value, detail }: { label: string; value: string; detail?: string }) {
  return (
    <a
      href="#resultat"
      className="flex items-center justify-between gap-3 border-t border-line-soft bg-sage-50 px-5 py-4 text-ink transition-colors hover:bg-sage-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-forest sm:px-7 lg:hidden"
    >
      <span className="min-w-0">
        <span className="block text-[13px] text-ink-muted">{label}</span>
        <span className="block text-[1.2rem] font-semibold tabular-nums tracking-[-0.02em] text-forest-deep">{value}</span>
        {detail ? <span className="block text-[13.5px] tabular-nums text-ink">{detail}</span> : null}
      </span>
      <span className="shrink-0 text-[14px] font-medium text-forest">Voir le détail ↓</span>
    </a>
  );
}
