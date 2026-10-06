/**
 * BUG B — la ligne qui solde un mois doit porter sa PROPRE quittance.
 *
 * `settleRentPeriod` écrivait `status`, `isFullPayment` et les montants figés
 * sur la ligne de période lorsqu'un paiement soldait l'obligation, mais pas
 * `receiptType`. Comme /billing conditionne son bouton de téléchargement à
 * `tx.receiptType`, la ligne qui soldait n'en avait aucun : la quittance
 * n'était atteignable que depuis la ligne de l'acompte antérieur, et la ligne
 * qui avait effectivement soldé l'obligation ne pouvait pas produire son propre
 * document.
 *
 * L'invariant vérifié ici est économique, pas cosmétique :
 *   - le versement qui solde le mois porte « Quittance » sur SA ligne ;
 *   - le versement d'acompte reste « Reçu », même après que le mois fut soldé.
 *     Le fait qu'un paiement ultérieur solde le mois ne réécrit pas la nature
 *     économique d'un versement déjà enregistré.
 *
 * Même store en mémoire que `settle-rent-period.test.ts` : il applique les
 * mêmes clauses `where` que Prisma, ce qu'un mock écrit à la main ne fait pas.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: null as unknown } }));

vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return (storeRef.current as { prisma: unknown }).prisma;
  },
}));

import { settleRentPeriod } from "@/lib/domain/generate-rent-periods";
import { createStore, lease, periodRow, type Store } from "./payment-store";

/** A 900 EUR January, no charges: the golden path's own figures. */
const TOTAL = "900";

const JAN = {
  periodStart: new Date("2026-01-01T00:00:00.000Z"),
  periodEnd: new Date("2026-01-31T00:00:00.000Z"),
};

function store(): Store {
  return storeRef.current as Store;
}

function row(id: string) {
  return store().rows.find((r) => r.id === id)!;
}

function pay(amount: string, day: number) {
  return {
    amount,
    paidAt: new Date(`2026-01-${String(day).padStart(2, "0")}T09:00:00.000Z`),
  };
}

/** Record a payment; when it is short, write the instalment's own row. */
async function record(amount: string, day: number) {
  const result = await settleRentPeriod("period-1", pay(amount, day));
  if (!result.applied || result.closed) return { ...result, receiptId: null };

  const { settlement } = result;
  const created = await (
    store().prisma as unknown as {
      transaction: { create: (a: { data: Record<string, unknown> }) => Promise<{ id: string }> };
    }
  ).transaction.create({
    data: {
      userId: "landlord-1",
      leaseId: "lease-1",
      amount: Number(amount),
      rentPortion: settlement.rentPortion.toNumber(),
      chargesPortion: settlement.chargesPortion.toNumber(),
      periodStart: JAN.periodStart,
      periodEnd: JAN.periodEnd,
      dueDate: JAN.periodStart,
      paidAt: new Date(`2026-01-${String(day).padStart(2, "0")}T09:00:00.000Z`),
      status: settlement.status,
      isFullPayment: settlement.isFullPayment,
      receiptType: settlement.receiptType,
    },
  });
  return { ...result, receiptId: created.id };
}

describe("BUG B — la ligne qui solde porte sa quittance", () => {
  beforeEach(() => {
    storeRef.current = createStore({
      leases: [lease("lease-1", "landlord-1", TOTAL, "0")],
      rows: [periodRow({ id: "period-1", amount: TOTAL, ...JAN })],
    });
  });

  it("un acompte ne ferme pas le mois et vaut « Reçu »", async () => {
    const r = await record("400", 10);

    expect(r.applied).toBe(true);
    expect(r.closed).toBe(false);
    expect(r.settlement.receiptType).toBe("RECU");

    // La période reste ouverte et collectable : un acompte ne consomme pas
    // l'obligation.
    expect(row("period-1").amount).toBe("500.00");
    expect(row("period-1").paidAt).toBeNull();
    expect(row(r.receiptId!).receiptType).toBe("RECU");
  });

  it("le solde porte « Quittance » SUR LA LIGNE QUI SOLDE", async () => {
    await record("400", 10);
    const closing = await record("500", 20);

    expect(closing.applied).toBe(true);
    expect(closing.closed).toBe(true);
    expect(closing.settlement.receiptType).toBe("QUITTANCE");

    // C'est exactement ce qui manquait : sans ce `receiptType`, la ligne qui
    // soldait n'affichait aucun bouton de téléchargement dans /billing.
    const settled = row("period-1");
    expect(settled.receiptType).toBe("QUITTANCE");
    expect(settled.status).toBe("PAID");
    // NOT asserted: `isFullPayment` is derived from `currentAmount.gte(totalDue)`
    // (period-settlement.ts:189), i.e. from THIS payment alone — a 500 instalment
    // closing a 900 month leaves it false, while a single 900 payment leaves it
    // true. Whether a row that discharges the obligation should report
    // "full payment" is a separate question from which row carries the receipt,
    // and it is not settled by this card. Recorded here rather than silently
    // changed: it is a financial invariant (AGENTS.md 10) and this is not the
    // evidence needed to move it.
  });

  it("un paiement unique en une fois porte aussi la quittance", async () => {
    // Le modèle doit tenir sans passer par un acompte.
    const r = await record("900", 5);

    expect(r.closed).toBe(true);
    expect(row("period-1").receiptType).toBe("QUITTANCE");
  });

  it("trois versements soldent le mois et la ligne porte la quittance", async () => {
    const a = await record("300", 5);
    await record("300", 10);
    const c = await record("300", 20);

    expect(a.closed).toBe(false);
    expect(c.closed).toBe(true);
    expect(row("period-1").receiptType).toBe("QUITTANCE");
  });

  it("un règlement ultérieur ne réécrit PAS le type d'un versement déjà passé", async () => {
    const first = await record("400", 10);
    await record("500", 20);

    // L'acompte reste un acompte. Solder le mois par ailleurs ne transforme pas
    // un versement passé en quittance : ce serait réécrire son histoire.
    expect(row(first.receiptId!).receiptType).toBe("RECU");
    expect(row(first.receiptId!).status).toBe("PARTIAL");
  });
});