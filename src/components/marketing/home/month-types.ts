/**
 * Shapes shared by the server-computed month (`month-script.ts`) and the
 * components that draw it. Kept apart so client components can import them
 * without pulling decimal.js and the settlement rule into the browser.
 */

export const MONTH_LABEL = "Octobre 2026";

export type RowState = "upcoming" | "paid" | "partial";

export type MonthRow = {
  id: string;
  /** The amount the row shows (reste dû, reçu or attendu), in cents, for animation. */
  amountCents: number;
  home: string;
  street: string;
  tenant: string;
  state: RowState;
  due: string;
  paid: string;
  outstanding: string;
  /** Short status line, e.g. "Réglé le 3 oct." */
  status: string;
  /** The document this row gives access to, if any. */
  document: string | null;
  /** Set when a reminder has gone out for this row. */
  reminder: string | null;
};

/** The document a payment produced at this moment, as the product would issue it. */
export type IssuedDocument = {
  kind: "quittance" | "recu";
  tenant: string;
  home: string;
  /** Total due for the period. */
  due: string;
  /** Paid so far for the period. */
  paid: string;
  /** Left to pay; "0,00 €" for a quittance. */
  outstanding: string;
};

export type MonthState = {
  asOf: string;
  /** Totals in cents, for the animated figures only; the strings stay canonical. */
  dueCents: number;
  paidCents: number;
  outstandingCents: number;
  document: IssuedDocument | null;
  rows: MonthRow[];
  due: string;
  paid: string;
  outstanding: string;
  /** Share of the month received, 0–100, for the progress bar only. */
  percent: number;
  /** What just happened, in one line. */
  event: string;
};

export type MonthStep = {
  day: number;
  date: string;
  title: string;
  text: string;
  event: string;
};
