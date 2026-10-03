/**
 * PRIORITÉ 3 — l'ordre économique ne doit pas être l'ordre de saisie.
 *
 * Un propriétaire rattrape un retard : il saisit aujourd'hui un virement du 5,
 * puis un autre du 15. L'ordre dans la base est l'inverse de l'ordre des faits,
 * et rien ne doit dépendre de l'ordre d'insertion.
 *
 * Le domaine trie explicitement (`period-settlement.ts` : `ordered =
 * [...received].sort(byPaymentOrder)`) avant d'allouer chaque versement, ce qui
 * est la bonne façon de faire — mais « la logique est là » n'est pas « la
 * logique tient ». Ces tests l'exercent avec l'ordre perturbé.
 *
 * On passe par `recordRentPayment` et non `settleRentPeriod` directement : c'est
 * le service qui crée la ligne d'acompte d'un versement partiel. Appeler le
 * domaine seul laisserait le mois sans trace des versements — mesuré : la
 * première version de ce fichier reduceit la période de 900 à 400 sans qu'aucune
 * ligne datée n'apparaisse, donc il n'y avait rien à trier.
 */
import { describe, it, expect, beforeEach, vi } from "vitest";

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: null as unknown } }));

vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return (storeRef.current as { prisma: unknown }).prisma;
  },
}));

import { recordRentPayment } from "@/lib/services/rent-payments";
import { createStore, lease, periodRow, type Store } from "./payment-store";

const TOTAL = "900";
const PS = new Date("2026-01-01T00:00:00.000Z");
const PE = new Date("2026-01-31T00:00:00.000Z");
const T = (day: number) => new Date(`2026-01-${String(day).padStart(2, "0")}T09:00:00.000Z`);

function store(): Store {
  return storeRef.current as Store;
}

/** The days, read in the order the facts happened rather than the order of entry. */
function paidDaysInDateOrder() {
  return store()
    .rows.filter((r) => r.paidAt !== null)
    .sort((a, b) => a.paidAt!.getTime() - b.paidAt!.getTime())
    .map((r) => r.paidAt!.getUTCDate());
}

async function pay(amount: string, day: number) {
  const r = await recordRentPayment({
    userId: "landlord-1",
    leaseId: "lease-1",
    amount,
    periodStart: PS,
    periodEnd: PE,
    dueDate: PS,
    paidAt: T(day),
    duePeriodId: "period-1",
  });
  if (!r.ok) throw new Error(`paiement refuse (${r.code}): ${r.error}`);
  return r;
}

function period() {
  return store().rows.find((r) => r.id === "period-1")!;
}

describe("l'ordre des dates prime sur l'ordre de saisie", () => {
  beforeEach(() => {
    storeRef.current = createStore({
      leases: [lease("lease-1", "landlord-1", TOTAL, "0")],
      rows: [periodRow({ id: "period-1", amount: TOTAL, periodStart: PS, periodEnd: PE })],
    });
  });

  it("un paiement antidaté ENREGISTRÉ APRÈS un plus récent reste daté avant", async () => {
    await pay("300", 15);
    await pay("200", 5);

    expect(paidDaysInDateOrder()).toEqual([5, 15]);

    // And the month's state does not depend on the order of writing.
    expect(period().amount).toBe("400.00");
    expect(period().status).toBe("PENDING");
  });

  it("un paiement antidaté peut solder le mois même étant saisi en second", async () => {
    await pay("300", 20);
    const closing = await pay("600", 5);

    expect(closing.receiptType).toBe("QUITTANCE");
    expect(period().status).toBe("PAID");
    expect(period().receiptType).toBe("QUITTANCE");
  });

  it("trois versements antidatés : l'ordre de saisie ne change pas le résultat", async () => {
    // Saisis dans le désordre : 15, 5, 25.
    await pay("400", 15);
    await pay("200", 5);
    const closing = await pay("300", 25);

    expect(closing.receiptType).toBe("QUITTANCE");
    expect(period().receiptType).toBe("QUITTANCE");

    const received = store()
      .rows.filter((r) => r.paidAt !== null)
      .reduce((s, r) => s + Number(r.amount), 0);
    expect(received).toBe(900);
  });

  it("un versement au-dessus du solde est refusé, quelle que soit sa date", async () => {
    await pay("800", 10);

    // Daté bien avant, mais au-dessus de ce que le mois peut absorber.
    const refused = await recordRentPayment({
      userId: "landlord-1",
      leaseId: "lease-1",
      amount: "500",
      periodStart: PS,
      periodEnd: PE,
      dueDate: PS,
      paidAt: T(5),
      duePeriodId: "period-1",
    });

    expect(refused.ok).toBe(false);
    if (!refused.ok) expect(refused.code).toBe("AMOUNT_ABOVE_BALANCE");

    // Le refus ne laisse aucune trace : une date ancienne ne l'a pas fait passer.
    expect(paidDaysInDateOrder()).toEqual([10]);
  });

  it("chaque versement garde sa propre nature, antidatage ou non", async () => {
    await pay("300", 20);
    await pay("600", 5);

    const byDate = store()
      .rows.filter((r) => r.paidAt !== null)
      .sort((a, b) => a.paidAt!.getTime() - b.paidAt!.getTime());

    // C'est le CUMUL À CETTE DATE qui décide de la nature du versement, et la
    // date, pas l'ordre de saisie :
    //
    //   j5  = 600  QUITTANCE  PAID      <- saisi en second, solde le mois
    //   j20 = 300  RECU       PARTIAL   <- saisi en premier, reste un acompte
    //
    // J'avais d'abord écrit l'inverse de ce que le produit fait, en supposant que
    // « le versement du 5 » resterait l'acompte parce qu'il l'a été. La mesure
    // dit le contraire et le produit a raison : au 5, 600 EUR étaient dus depuis
    // le 5, donc c'est le 5 qui porte la quittance.
    expect(byDate[0].receiptType).toBe("QUITTANCE");
    expect(byDate[0].status).toBe("PAID");
    expect(byDate[1].receiptType).toBe("RECU");
    expect(byDate[1].status).toBe("PARTIAL");
  });
});