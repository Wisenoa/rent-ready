/**
 * Question ouverte, posée par BUG B : une fois qu'un mois est soldé, la ligne
 * qui l'a soldé porte « Quittance », mais la generation du document recalcule
 * le reglement depuis les PAIEMENTS DU MOIS et peut donc re-decider « Reçu ».
 *
 * Cas joue par le golden path :
 *   900 dus -> 400 le 10 (ligne « Reçu », PARTIAL) -> 500 le 20 (solde la ligne
 *   de periode).
 *
 * Ce que le test cherche a verifier, sans presupposer la reponse :
 *   - quel `receiptType` la reglementation du domain donne-t-elle quand on
 *     rejoue le mois avec [400, 500] ?
 *   - et quand on ne rejoue que [500], c'est-a-dire quand on ne voit que ce que
 *     porte la ligne qui a solde ?
 *
 * Si les deux reponses different, alors la ligne de periode et l'historique
 * des paiements ne decrivent pas le meme mois, et c'est cela qu'il faut trancher
 * — pas une ligne de code a ajuster.
 */

import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { settlePeriodPayments } from "@/lib/domain/period-settlement";

const RENT = new Decimal(900);
const CHARGES = new Decimal(0);

function replay(payments: Array<{ id: string; amount: string; day: number }>) {
  const rows = payments.map((p) => ({
    id: p.id,
    amount: new Decimal(p.amount),
    paidAt: new Date(`2026-01-${String(p.day).padStart(2, "0")}T09:00:00.000Z`),
    createdAt: new Date(`2026-01-${String(p.day).padStart(2, "0")}T09:00:00.000Z`),
  }));
  const current = rows[rows.length - 1];
  return settlePeriodPayments({
    rentAmount: RENT,
    chargesAmount: CHARGES,
    payments: rows,
    current,
  });
}

describe("BUG B — le type de quittance survit-il au recalcul ?", () => {
  it("mois soldé en deux versements : l'historique complet dit Quittance", () => {
    const r = replay([
      { id: "instalment", amount: "400", day: 10 },
      { id: "closing", amount: "500", day: 20 },
    ]);
    expect(r.receiptType).toBe("QUITTANCE");
  });

  it("un seul versement : Quittance", () => {
    const r = replay([{ id: "closing", amount: "900", day: 5 }]);
    expect(r.receiptType).toBe("QUITTANCE");
  });

  it("l'acompte seul reste un Reçu", () => {
    const r = replay([{ id: "instalment", amount: "400", day: 10 }]);
    expect(r.receiptType).toBe("RECU");
  });

  it("LE POINT : ne voir que le versement qui solde donne un verdict différent", () => {
    // C'est ce que voit `generateQuittance` si `periodPayments` ne contient pas
    // l'acompte : 500 contre 900 dus, donc « Reçu » — alors que la ligne porte
    // bien « Quittance » et que le mois est soldé.
    const r = replay([{ id: "closing", amount: "500", day: 20 }]);
    expect(r.receiptType).toBe("RECU");
  });
});