import Decimal from "decimal.js";
import { settlePeriodPayments } from "@/lib/domain/period-settlement";

/**
 * The fictional month shown on /gestion-locative.
 *
 * Three homes owned by one landlord, two paid in full, one paid in part. Only the
 * inputs are written here (rent, charges, payments). Every derived figure —
 * what is due, what remains, whether the document is a quittance or a reçu —
 * comes from `settlePeriodPayments`, the rule the product itself applies, so the
 * landing cannot show a state the software would not produce.
 */

export const EXAMPLE_MONTH_LABEL = "Octobre 2026";
const AS_OF = new Date("2026-10-12T18:00:00Z");
export const EXAMPLE_AS_OF_LABEL = "12 octobre 2026";

type ExampleLease = {
  id: string;
  home: string;
  street: string;
  tenant: string;
  rent: string;
  charges: string;
  payments: { amount: string; paidAt: string; label: string }[];
};

const LEASES: ExampleLease[] = [
  {
    id: "studio",
    home: "Studio",
    street: "rue Gambetta, Angers",
    tenant: "Julien Moreau",
    rent: "480.00",
    charges: "40.00",
    payments: [{ amount: "520.00", paidAt: "2026-10-03", label: "3 oct." }],
  },
  {
    id: "t2",
    home: "T2",
    street: "rue Saint-Aubin, Angers",
    tenant: "Léa Bernard",
    rent: "640.00",
    charges: "60.00",
    payments: [{ amount: "700.00", paidAt: "2026-10-05", label: "5 oct." }],
  },
  {
    id: "t3",
    home: "T3",
    street: "boulevard Foch, Angers",
    tenant: "Emma Laurent",
    rent: "780.00",
    charges: "70.00",
    payments: [{ amount: "500.00", paidAt: "2026-10-06", label: "6 oct." }],
  },
];

export type ExampleRow = {
  id: string;
  home: string;
  street: string;
  tenant: string;
  rent: Decimal;
  charges: Decimal;
  due: Decimal;
  paid: Decimal;
  outstanding: Decimal;
  settled: boolean;
  document: "QUITTANCE" | "RECU";
  lastPaymentLabel: string | null;
};

export const EXAMPLE_ROWS: ExampleRow[] = LEASES.map((lease) => {
  const settlement = settlePeriodPayments({
    rentAmount: lease.rent,
    chargesAmount: lease.charges,
    payments: lease.payments.map((p) => ({
      amount: p.amount,
      paidAt: new Date(`${p.paidAt}T12:00:00Z`),
    })),
    asOf: AS_OF,
  });

  return {
    id: lease.id,
    home: lease.home,
    street: lease.street,
    tenant: lease.tenant,
    rent: new Decimal(lease.rent),
    charges: new Decimal(lease.charges),
    due: settlement.totalDue,
    paid: settlement.paid,
    outstanding: settlement.outstanding,
    settled: settlement.settled,
    document: settlement.receiptType,
    lastPaymentLabel: lease.payments.at(-1)?.label ?? null,
  };
});

export const EXAMPLE_TOTALS = EXAMPLE_ROWS.reduce(
  (totals, row) => ({
    due: totals.due.plus(row.due),
    paid: totals.paid.plus(row.paid),
    outstanding: totals.outstanding.plus(row.outstanding),
  }),
  { due: new Decimal(0), paid: new Decimal(0), outstanding: new Decimal(0) }
);

export function exampleRow(id: string): ExampleRow {
  const row = EXAMPLE_ROWS.find((r) => r.id === id);
  if (!row) throw new Error(`Unknown example lease: ${id}`);
  return row;
}
