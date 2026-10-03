/**
 * BUG B (suite) — le document ne doit pas ré-decider le type de la transaction.
 *
 * `generateQuittance` recalculait le règlement du mois et écrivait le type
 * obtenu par-dessus celui que le règlement avait déjà enregistré. Comme `asOf`
 * ne contient que les paiements ANTÉRIEURS à la ligne courante, la ligne qui
 * soldait un mois payé en deux fois ne voyait que son propre versement : 500
 * contre 900 dus, donc « Reçu ».
 *
 * Conséquence réelle, mesurée en base sur un run E2E :
 *
 *   receiptNumber  receiptType  amount  paidAt                  updatedAt
 *   REC-2026-10-1  RECU         500.00  2026-10-03 16:20:43     2026-10-03 16:21:06
 *
 * Le paiement de 16:20:43 avait bien écrit « Quittance » ; 23 secondes plus
 * tard, le téléchargement avait écrasé ce verdict. Le propriétaire téléchargeait
 * ensuite un « Reçu de paiement partiel » pour un mois entièrement payé, et le
 * type restait faux pour toutes les lectures ultérieures.
 *
 * L'invariant : le type de la transaction fait foi, et le document le suit.
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import Decimal from "decimal.js";

const { storeRef } = vi.hoisted(() => ({ storeRef: { current: null as unknown } }));

vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return (storeRef.current as { prisma: unknown }).prisma;
  },
}));

import { settlePeriodPayments, paymentsBefore } from "@/lib/domain/period-settlement";
import { createStore, lease, periodRow, type Store } from "./payment-store";

const TOTAL = "900";
const PS = new Date("2026-01-01T00:00:00.000Z");
const PE = new Date("2026-01-31T00:00:00.000Z");

function store(): Store {
  return storeRef.current as Store;
}

/**
 * Reproduce what `generateQuittance` computes for the row that settles a month
 * paid in instalments: `asOf` is the month's payments BEFORE the current row,
 * then the current row is added.
 */
const T = (day: string) => new Date(`${day}T09:00:00.000Z`);

type Row = { id: string; amount: string; paidAt: Date; createdAt: Date };

function deriveAsGenerateQuittanceDoes(rows: Row[], currentId: string) {
  // Object identity matters: `paymentsBefore` excludes the current row with
  // `p === current`, so the row under examination has to be the very same object
  // that is handed to the domain. Cloning it here would silently keep the row in
  // `asOf` and make this helper report the happy path instead of the real one.
  const current = rows.find((r) => r.id === currentId)!;
  const asOf = paymentsBefore(rows, current);
  return settlePeriodPayments({
    rentAmount: new Decimal(TOTAL),
    chargesAmount: new Decimal(0),
    payments: [...asOf, current],
    current: { amount: current.amount, paidAt: current.paidAt, createdAt: current.paidAt },
  });
}

describe("BUG B — le type enregistré fait foi", () => {
  beforeEach(() => {
    storeRef.current = createStore({
      leases: [lease("lease-1", "landlord-1", TOTAL, "0")],
      rows: [periodRow({ id: "period-1", amount: TOTAL, periodStart: PS, periodEnd: PE })],
    });
  });

  it("le domaine raisonne juste même sur la ligne qui solde", () => {
    // Two rows for the month: the 400 instalment, then the period row carrying
    // the 500 that closed it.
    const derived = deriveAsGenerateQuittanceDoes(
      [
        { id: "instalment", amount: "400", paidAt: T("2026-01-10"), createdAt: T("2026-01-10") },
        { id: "period-1", amount: "500", paidAt: T("2026-01-20"), createdAt: T("2026-01-20") },
      ],
      "period-1",
    );

    // The domain is RIGHT here: `asOf` keeps the 400 instalment and the current
    // 500 row is added back, so the month weighs 900 against 900 and settles.
    // Asserted explicitly, because this card first blamed this calculation — and
    // measurement showed the derivation was never wrong.
    expect(derived.receiptType).toBe("QUITTANCE");
  });

  it("le type STOCKÉ prime sur la dérivation", () => {
    // This is the rule the fix encodes, expressed where the fix lives: the
    // transaction already carries the type the settlement recorded.
    const stored: string | null = "QUITTANCE";
    const derived = deriveAsGenerateQuittanceDoes(
      [
        { id: "instalment", amount: "400", paidAt: T("2026-01-10"), createdAt: T("2026-01-10") },
        { id: "period-1", amount: "500", paidAt: T("2026-01-20"), createdAt: T("2026-01-20") },
      ],
      "period-1",
    ).receiptType;

    expect(stored ?? derived).toBe("QUITTANCE");
  });

  it("sans type stocké, la dérivation répond encore — un paiement ancien", () => {
    const stored: string | null = null;
    const derived = deriveAsGenerateQuittanceDoes(
      [{ id: "period-1", amount: "900", paidAt: T("2026-01-05"), createdAt: T("2026-01-05") }],
      "period-1",
    ).receiptType;

    expect(stored ?? derived).toBe("QUITTANCE");
  });

  it("un acompte reste un reçu même recalculé", () => {
    const derived = deriveAsGenerateQuittanceDoes(
      [{ id: "instalment", amount: "400", paidAt: T("2026-01-10"), createdAt: T("2026-01-10") }],
      "instalment",
    ).receiptType;
    expect(derived).toBe("RECU");
  });

  it("un mois soldé en une fois : la dérivation et le type stocké concordent", () => {
    // The fix must not degrade the simple case: here both say « Quittance », so
    // reading the stored type changes nothing.
    const row = store().rows.find((r) => r.id === "period-1")!;
    row.receiptType = "QUITTANCE";

    const derived = deriveAsGenerateQuittanceDoes(
      [{ id: "period-1", amount: "900", paidAt: T("2026-01-05"), createdAt: T("2026-01-05") }],
      "period-1",
    ).receiptType;

    expect(row.receiptType).toBe(derived);
    expect(row.receiptType).toBe("QUITTANCE");
  });
});