import Decimal from "decimal.js";
import { settlePeriodPayments } from "@/lib/domain/period-settlement";
import { formatCurrency } from "@/lib/format";
import type { IssuedDocument, MonthRow, MonthState, MonthStep, RowState } from "./month-types";

/**
 * October for a landlord with three homes, told in five moments.
 *
 * Only the inputs are written here: rents, charges, when money arrived and when
 * a reminder went out. Everything derived — paid, left to pay, quittance or
 * reçu — comes from `settlePeriodPayments`, the rule the product applies, so the
 * homepage cannot show a state the software would not produce. Amounts are
 * formatted here, on the server, and handed to the panel as strings.
 */

const DUE_DAY = 5;

type Lease = {
  id: string;
  home: string;
  street: string;
  tenant: string;
  rent: string;
  charges: string;
  payments: { day: number; amount: string }[];
  reminderDay?: number;
};

const LEASES: Lease[] = [
  {
    id: "studio",
    home: "Studio",
    street: "rue Gambetta",
    tenant: "Julien Moreau",
    rent: "480.00",
    charges: "40.00",
    payments: [{ day: 3, amount: "520.00" }],
  },
  {
    id: "t2",
    home: "T2",
    street: "rue Saint-Aubin",
    tenant: "Léa Bernard",
    rent: "640.00",
    charges: "60.00",
    payments: [{ day: 5, amount: "700.00" }],
  },
  {
    id: "t3",
    home: "T3",
    street: "boulevard Foch",
    tenant: "Emma Laurent",
    rent: "780.00",
    charges: "70.00",
    payments: [
      { day: 6, amount: "500.00" },
      { day: 18, amount: "350.00" },
    ],
    reminderDay: 12,
  },
];

export const MONTH_STEPS: MonthStep[] = [
  {
    day: 1,
    date: "1er oct.",
    title: "Le mois s'ouvre",
    text: "Les loyers d'octobre sont attendus pour le 5. Vous n'avez rien saisi : Lokna les connaît déjà, ils viennent des baux.",
    event: "3 loyers attendus pour le 5 octobre",
  },
  {
    day: 5,
    date: "5 oct.",
    title: "Deux virements arrivent",
    text: "Vous enregistrez les deux paiements. Les lignes passent au vert et se font discrètes ; leurs quittances sont prêtes.",
    event: "Quittances prêtes pour Julien Moreau et Léa Bernard",
  },
  {
    day: 6,
    date: "6 oct.",
    title: "Un versement incomplet",
    text: "Emma Laurent verse 500 € sur 850 €. Le reste dû reste en évidence, et Lokna prépare un reçu de paiement partiel, pas une quittance.",
    event: "Reçu de paiement partiel de 500,00 € pour Emma Laurent",
  },
  {
    day: 12,
    date: "12 oct.",
    title: "Un retard en évidence",
    text: "Le solde est en retard. Le suivi affiche les 350 € restant dus et depuis quand : vous relancez Emma Laurent avec les bons montants.",
    event: "350,00 € en retard pour Emma Laurent",
  },
  {
    day: 18,
    date: "18 oct.",
    title: "Le mois se referme",
    text: "Le solde arrive. Les deux versements couvrent le loyer et les charges : la quittance d'octobre est prête, le mois est à 100 %.",
    event: "Quittance d'octobre prête pour Emma Laurent",
  },
];

function dayLabel(day: number): string {
  return day === 1 ? "1er oct." : `${day} oct.`;
}

function at(day: number): Date {
  return new Date(Date.UTC(2026, 9, day, 18));
}

function cents(value: Decimal): number {
  return value.times(100).toDecimalPlaces(0).toNumber();
}

function monthAt(day: number, event: string): MonthState {
  let issued: IssuedDocument | null = null;
  let due = new Decimal(0);
  let paid = new Decimal(0);
  let outstanding = new Decimal(0);

  const rows = LEASES.map((lease): MonthRow => {
    const received = lease.payments.filter((p) => p.day <= day);
    const settlement = settlePeriodPayments({
      rentAmount: lease.rent,
      chargesAmount: lease.charges,
      payments: received.map((p) => ({ amount: p.amount, paidAt: at(p.day) })),
      asOf: at(day),
    });
    due = due.plus(settlement.totalDue);
    paid = paid.plus(settlement.paid);
    outstanding = outstanding.plus(settlement.outstanding);

    const last = received.at(-1);
    // A payment that landed today produces a document: a quittance once the
    // period is settled, a reçu de paiement partiel before.
    if (last?.day === day) {
      issued = {
        kind: settlement.settled ? "quittance" : "recu",
        tenant: lease.tenant,
        home: `${lease.home} · ${lease.street}`,
        due: formatCurrency(settlement.totalDue),
        paid: formatCurrency(settlement.paid),
        outstanding: formatCurrency(settlement.outstanding),
      };
    }
    const reminded =
      lease.reminderDay !== undefined && lease.reminderDay <= day && !settlement.settled;

    let state: RowState;
    let status: string;
    let document: string | null;
    if (settlement.settled && last) {
      state = "paid";
      status = `Réglé le ${dayLabel(last.day)}`;
      document = "Quittance prête";
    } else if (settlement.paid.gt(0)) {
      state = "partial";
      status = "Paiement partiel";
      document = "Reçu de paiement partiel";
    } else {
      state = "upcoming";
      status = `Attendu le ${DUE_DAY} oct.`;
      document = null;
    }

    return {
      id: lease.id,
      amountCents: cents(
        state === "partial" ? settlement.outstanding : state === "paid" ? settlement.paid : settlement.totalDue
      ),
      home: lease.home,
      street: lease.street,
      tenant: lease.tenant,
      state,
      due: formatCurrency(settlement.totalDue),
      paid: formatCurrency(settlement.paid),
      outstanding: formatCurrency(settlement.outstanding),
      status,
      document,
      // Lokna shows the delay; it does not send the reminder (no e-mail provider in
      // production). The landlord relaunches with the amounts shown here.
      reminder: reminded ? `En retard depuis le ${DUE_DAY} oct.` : null,
    };
  });

  return {
    asOf: day === 1 ? "Au 1er octobre" : `Au ${day} octobre`,
    rows,
    dueCents: cents(due),
    paidCents: cents(paid),
    outstandingCents: cents(outstanding),
    document: issued,
    due: formatCurrency(due),
    paid: formatCurrency(paid),
    outstanding: formatCurrency(outstanding),
    percent: due.isZero() ? 0 : paid.dividedBy(due).times(100).toDecimalPlaces(0).toNumber(),
    event,
  };
}

export const MONTH_STATES: MonthState[] = MONTH_STEPS.map((step) =>
  monthAt(step.day, step.event)
);

/** The moment the page shows without animation: one payment short, the case Lokna exists for. */
export const HERO_STATE = MONTH_STATES[2];

/**
 * The hero's few seconds: each payment of October landing in turn, ending with
 * the balance that turns Emma Laurent's reçu into a quittance. Event lines are
 * built from the same inputs, so the amounts cannot drift from the figures.
 */
/** "de Léa", but "d'Emma". */
function from(name: string): string {
  return /^[aeiouyàâéèêëîïôûùh]/i.test(name) ? `d'${name}` : `de ${name}`;
}

function arrivalEvent(day: number): string {
  for (const lease of LEASES) {
    const payment = lease.payments.find((p) => p.day === day);
    if (!payment) continue;
    const received = lease.payments.filter((p) => p.day <= day);
    const settlement = settlePeriodPayments({
      rentAmount: lease.rent,
      chargesAmount: lease.charges,
      payments: received.map((p) => ({ amount: p.amount, paidAt: at(p.day) })),
      asOf: at(day),
    });
    const amount = formatCurrency(payment.amount);
    if (!settlement.settled) return `${amount} reçus ${from(lease.tenant)} · reçu de paiement partiel prêt`;
    return received.length > 1
      ? `Solde de ${amount} reçu ${from(lease.tenant)} · quittance prête`
      : `${amount} reçus ${from(lease.tenant)} · quittance prête`;
  }
  return "3 loyers attendus pour le 5 octobre";
}

export const HERO_SEQUENCE: MonthState[] = [1, 3, 5, 6, 18].map((day) =>
  monthAt(day, arrivalEvent(day))
);
