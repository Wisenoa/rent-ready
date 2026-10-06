/**
 * `isFullPayment` decide le TITRE et le LIBELLE d'une quittance PDF :
 * « Total acquitté » contre « Montant reçu », plus l'affichage ou non du solde
 * restant (quittance-generator.tsx).
 *
 * Il est calculé par `period-settlement.ts:189` :
 *
 *   isFullPayment: currentAmount.gte(totalDue)
 *
 * c'est-à-dire depuis CE SEUL versement, pas depuis le cumul du mois. Sur un mois
 * de 900 soldé par 400 puis 500 :
 *
 *   versement de 400  -> 400 >= 900  faux   (correct : ce n'est pas tout)
 *   versement de 500  -> 500 >= 900  faux   (FAUX : le mois EST soldé)
 *
 * La question que ce test pose, sans la presupposer : un document genere pour
 * un mois entierement encaisse peut-il s'imprimer « Montant reçu » avec un solde
 * restant alors que plus rien n'est du ?
 */
import { describe, it, expect } from "vitest";
import { settlePeriodPayments } from "@/lib/domain/period-settlement";
import Decimal from "decimal.js";

const T = (day: number) => new Date(`2026-01-${String(day).padStart(2, "0")}T09:00:00.000Z`);

function replay(amounts: number[]) {
  const rows = amounts.map((a, i) => ({
    id: `tx-${i}`,
    amount: new Decimal(a),
    paidAt: T(5 + i * 5),
    createdAt: T(5 + i * 5),
  }));
  const current = rows[rows.length - 1];
  return settlePeriodPayments({
    rentAmount: new Decimal(900),
    chargesAmount: new Decimal(0),
    payments: rows,
    current: {
      amount: current.amount,
      paidAt: current.paidAt,
      createdAt: current.createdAt,
    },
  });
}

describe("isFullPayment et le libelle du document", () => {
  it("paiement unique du montant du mois : acquitté", () => {
    const s = replay([900]);
    expect(s.status).toBe("PAID");
    expect(s.isFullPayment).toBe(true);
  });

  it("deux versements dont le DERNIER solde le mois", () => {
    const s = replay([400, 500]);

    // Le statut est juste : le mois est soldé.
    expect(s.status).toBe("PAID");
    expect(s.outstanding.toFixed(2)).toBe("0.00");

    // Le mois est solde, donc le document doit le DIRE. Lu depuis ce seul
    // versement il valait false : 500 >= 900 est faux, alors que le mois avait
    // recu 900.
    expect(s.isFullPayment).toBe(true);
  });

  it("trois versements, dernier soldeur : meme situation", () => {
    const s = replay([200, 300, 400]);
    expect(s.status).toBe("PAID");
    expect(s.isFullPayment).toBe(true);
  });

  it("un acompte seul reste non acquitté — c'est la vollee exacte", () => {
    const s = replay([400]);
    expect(s.status).toBe("PARTIAL");
    expect(s.isFullPayment).toBe(false);
  });
});