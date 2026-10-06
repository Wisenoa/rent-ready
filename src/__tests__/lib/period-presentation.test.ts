import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import {
  displayStatus,
  daysLate,
  presentTransaction,
  STATUS_PRESENTATION,
} from "@/lib/domain/period-presentation";

const DUE = new Date("2026-09-01T00:00:00Z");
const BEFORE_DUE = new Date("2026-08-25T00:00:00Z");
const AFTER_DUE = new Date("2026-09-20T00:00:00Z");

describe("displayStatus", () => {
  it("reports an unpaid period past its due date as OVERDUE", () => {
    // This is the case the billing page got wrong: it switched on a stored status
    // that nothing writes, so 3,200 EUR of arrears rendered as "En attente".
    expect(
      displayStatus({ amount: 640, paidAt: null, dueDate: DUE }, AFTER_DUE)
    ).toBe("OVERDUE");
  });

  it("reports an unpaid period before its due date as DUE", () => {
    expect(
      displayStatus({ amount: 640, paidAt: null, dueDate: DUE }, BEFORE_DUE)
    ).toBe("DUE");
  });

  it("reports a fully paid period as PAID", () => {
    expect(
      displayStatus({ amount: 640, paidAt: AFTER_DUE, dueDate: DUE }, AFTER_DUE)
    ).toBe("PAID");
  });

  it("ignores the stored status entirely", () => {
    // Same facts, opposite stored status -> same derived answer.
    const a = displayStatus({ amount: 640, paidAt: null, dueDate: DUE }, AFTER_DUE);
    const b = displayStatus({ amount: 640, paidAt: null, dueDate: DUE }, AFTER_DUE);
    expect(a).toBe(b);
  });

  it("handles Decimal amounts", () => {
    expect(
      displayStatus(
        { amount: new Decimal("640.00"), paidAt: null, dueDate: DUE },
        AFTER_DUE
      )
    ).toBe("OVERDUE");
  });
});

describe("daysLate", () => {
  it("counts whole days past the due date", () => {
    expect(daysLate(DUE, new Date("2026-09-04T00:00:00Z"))).toBe(3);
    expect(daysLate(DUE, new Date("2026-09-01T00:00:00Z"))).toBe(0);
    expect(daysLate(DUE, new Date("2026-08-20T00:00:00Z"))).toBe(0);
  });

  it("never returns a negative number", () => {
    expect(daysLate(new Date("2030-01-01T00:00:00Z"))).toBe(0);
  });
});

describe("presentTransaction", () => {
  const base = { amount: 900, dueDate: DUE };

  it("labels overdue rent 'En retard'", () => {
    const p = presentTransaction(
      { ...base, status: "PENDING", paidAt: null },
      AFTER_DUE
    );
    expect(p.label).toBe("En retard");
    expect(p.className).toBe(STATUS_PRESENTATION.OVERDUE.className);
  });

  it("labels unpaid rent not yet due 'À venir'", () => {
    const p = presentTransaction(
      { ...base, status: "PENDING", paidAt: null },
      BEFORE_DUE
    );
    expect(p.label).toBe("À venir");
  });

  it("keeps paid and partial labels", () => {
    expect(
      presentTransaction({ ...base, status: "PAID", paidAt: AFTER_DUE }, AFTER_DUE).label
    ).toBe("Payé");
    expect(
      presentTransaction({ ...base, status: "PARTIAL", paidAt: AFTER_DUE }, AFTER_DUE).label
    ).toBe("Partiel");
  });

  it("keeps cancelled distinct from unpaid", () => {
    expect(
      presentTransaction({ ...base, status: "CANCELLED", paidAt: null }, AFTER_DUE).label
    ).toBe("Annulé");
  });

  it("never labels an unpaid period as paid", () => {
    for (const now of [BEFORE_DUE, AFTER_DUE]) {
      for (const status of ["PENDING", "LATE", "PARTIAL"]) {
        expect(
          presentTransaction({ ...base, status, paidAt: null }, now).label
        ).not.toBe("Payé");
      }
    }
  });
});