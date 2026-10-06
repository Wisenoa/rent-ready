/**
 * What the receipt SAYS, not what it was handed.
 *
 * A previous suite asserted on the props `QuittancePDF` received and called that
 * coverage. It is not: on a period paid in instalments the props carried the
 * right balance while the component printed `rent + charges - this payment`
 * instead — 670,55 on a month with 370,55 left. Reverting the component to that
 * line kept every one of those tests green, which is exactly the mutation this
 * file exists to catch.
 *
 * So these tests MOUNT the component and read its output. `@react-pdf/renderer`
 * is aliased to a stub whose elements render their children, which lets
 * `react-dom/server` produce the strings the landlord and the tenant actually
 * read.
 *
 * The figures under test come from the real `settlePeriodPayments`, not from
 * literals typed here: a hard-coded 370,55 would only prove the arithmetic in the
 * test file, not that the document prints what the domain decided.
 */

import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

import { QuittancePDF, type QuittanceData } from "@/lib/quittance-generator";
import { settlePeriodPayments } from "@/lib/domain/period-settlement";

const RENT = new Decimal("850.50");
const CHARGES = new Decimal("120.05");
const TOTAL_DUE = RENT.plus(CHARGES); // 970,55

function party(firstName: string, lastName: string) {
  return {
    firstName,
    lastName,
    addressLine1: "1 rue Exemple",
    city: "Paris",
    postalCode: "75001",
  };
}

/**
 * Build the document the way `generateQuittance` does: the balance comes from
 * `settlePeriodPayments` over the payments received up to and including the one
 * being receipted.
 */
function receiptFor(payments: Array<{ amount: string; day: number }>) {
  const settled = payments.map((p) => ({
    amount: new Decimal(p.amount),
    paidAt: new Date(`2026-10-${String(p.day).padStart(2, "0")}T10:00:00.000Z`),
    createdAt: new Date(`2026-10-${String(p.day).padStart(2, "0")}T10:00:00.000Z`),
  }));
  const current = settled[settled.length - 1];

  const settlement = settlePeriodPayments({
    rentAmount: RENT,
    chargesAmount: CHARGES,
    payments: settled,
    current,
  });

  const data: QuittanceData = {
    landlord: party("Marie", "Durand"),
    tenant: party("Jean", "Dupont"),
    propertyAddress: "5 rue du-test, 69001 Lyon",
    rentAmount: RENT,
    chargesAmount: CHARGES,
    totalAmount: current.amount,
    remainingAmount: settlement.outstanding.toDecimalPlaces(2),
    periodStart: new Date("2026-10-01T00:00:00.000Z"),
    periodEnd: new Date("2026-10-31T00:00:00.000Z"),
    paidAt: current.paidAt,
    receiptNumber: settlement.settled
      ? "QUI-2026-10-0001"
      : "REC-2026-10-0001",
    isFullPayment: settlement.receiptType === "QUITTANCE",
  };

  return { data, settlement };
}

/** The receipt as text: what a reader of the PDF sees. */
function printed(data: QuittanceData): string {
  return renderToStaticMarkup(
    createElement(QuittancePDF, { data })
  );
}

describe("the balance printed on a receipt for a period paid in instalments", () => {
  it("states 370,55 after 300 + 300 on a 970,55 month", () => {
    const { data, settlement } = receiptFor([
      { amount: "300", day: 5 },
      { amount: "300", day: 20 },
    ]);
    // The domain's answer, pinned first: 970,55 - 600.
    expect(settlement.outstanding.toFixed(2)).toBe("370.55");

    const text = printed(data);

    expect(text).toContain("Solde restant dû");
    expect(text).toContain("370,55");
    // The figure the component used to compute itself, and the one this file
    // exists to keep off the page.
    expect(text).not.toContain("670,55");
  });

  it("states the full balance on the first instalment, not the whole month", () => {
    const { data, settlement } = receiptFor([{ amount: "400", day: 5 }]);
    expect(settlement.outstanding.toFixed(2)).toBe("570.55");

    expect(printed(data)).toContain("570,55");
  });

  it("prints no balance line once the month is settled", () => {
    const { data, settlement } = receiptFor([
      { amount: "400", day: 5 },
      { amount: "570.55", day: 20 },
    ]);
    expect(settlement.settled).toBe(true);

    const text = printed(data);

    expect(text).toContain("Quittance de Loyer");
    // A settled month has nothing left to announce; printing a line at 0,00
    // would read as a debt that does not exist.
    expect(text).not.toContain("Solde restant dû");
  });

  it("never prints a negative balance when the payment exceeds the month", () => {
    const { data } = receiptFor([
      { amount: "970.55", day: 5 },
      { amount: "229.45", day: 20 },
    ]);

    const text = printed(data);

    // A hyphen appears in dates and in the reference, so the negative-balance
    // check looks for the French minus sign the currency format would emit.
    expect(text).not.toContain("−");
    expect(text).not.toContain("Solde restant dû");
  });

  it("prints the amounts of the period it describes", () => {
    const { data } = receiptFor([
      { amount: "300", day: 5 },
      { amount: "300", day: 20 },
    ]);

    const text = printed(data);

    // The month, not this payment, and the payment that is being attested.
    expect(text).toContain("850,50");
    expect(text).toContain("120,05");
    expect(text).toContain("970,55");
    expect(text).toContain("300,00");
  });
});