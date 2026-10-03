import { describe, it, expect } from "vitest";
import { transactionSchema } from "@/lib/validations/transaction";

/**
 * BUG A — « Moyen de paiement » est facultatif, mais un Select de base-ui
 * intact envoie `""`. `transactionSchema` le rejetait au nom de l'enum
 * (« Invalid option: expected one of "TRANSFER"|… »), si bien qu'un
 * propriétaire qui payait par virement ne pouvait pas saisir son paiement sans
 * renseigner un champ qui n'est pas obligatoire.
 *
 * La distinction que ces tests verrouillent est « aucune valeur » contre « une
 * valeur » : une chaîne vide est une absence, une valeur fausse reste fausse.
 */
const base = {
  leaseId: "l1",
  amount: 400,
  periodStart: "2026-01-01",
  periodEnd: "2026-01-31",
  dueDate: "2026-01-05",
};

describe("moyen de paiement facultatif", () => {
  it("accepte une chaîne vide : le champ n'a pas été touché", () => {
    const r = transactionSchema.safeParse({ ...base, paymentMethod: "" });
    expect(r.success).toBe(true);
    expect(r.success && r.data.paymentMethod).toBeUndefined();
  });

  it("accepte null et undefined", () => {
    expect(transactionSchema.safeParse({ ...base, paymentMethod: null }).success).toBe(true);
    expect(
      transactionSchema.safeParse({ ...base, paymentMethod: undefined }).success,
    ).toBe(true);
  });

  it("accepte une absence totale du champ", () => {
    expect(transactionSchema.safeParse(base).success).toBe(true);
  });

  it("conserve une valeur valide de l'enum", () => {
    for (const m of ["TRANSFER", "CHECK", "CASH", "DIRECT_DEBIT", "OTHER"]) {
      const r = transactionSchema.safeParse({ ...base, paymentMethod: m });
      expect(r.success, `${m} devrait être accepté`).toBe(true);
      expect(r.success && r.data.paymentMethod).toBe(m);
    }
  });

  it("refuse toujours une valeur qui n'appartient pas à l'enum", () => {
    // Le point à ne pas perdre : « facultatif » ne doit pas devenir
    // « n'importe quoi est accepté ».
    for (const m of ["VIREMENT", "virement", "bitcoin", "1234"]) {
      const r = transactionSchema.safeParse({ ...base, paymentMethod: m });
      expect(r.success, `${m} doit être refusé`).toBe(false);
    }
  });

  it("ne valide pas le reste du schéma moins bien qu'avant", () => {
    expect(transactionSchema.safeParse({ ...base, amount: 0 }).success).toBe(false);
    expect(transactionSchema.safeParse({ ...base, leaseId: "" }).success).toBe(false);
  });
});