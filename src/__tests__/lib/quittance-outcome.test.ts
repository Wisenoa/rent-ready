/**
 * What the user is told when a payment is marked as paid without a receipt.
 *
 * `markTransactionPaid` writes the payment and *then* asks `generateQuittance`
 * for a receipt. The receipt step can legitimately fail — most often because
 * the landlord's own address is incomplete, which is the state of every account
 * created before the profile page existed. The payment is real either way, so
 * the action must not fail; but reporting a bare success made the UI say
 * "Paiement validé" while no receipt existed anywhere (AGENTS.md §21, §37 —
 * buttons that pretend an action occurred).
 *
 * So a missing receipt becomes an explicit warning carried in `data`, and the
 * button shows it instead of a clean success.
 *
 * The decision itself lives in `describeQuittanceOutcome` because
 * `transaction-actions.tsx` is JSX (its reminder path renders an email
 * component) and cannot be imported by the test runner — the same constraint
 * `transaction-due-period.test.ts` documents. The wiring between that function,
 * the action's payload and the button's toast is therefore pinned by reading
 * their sources, and the behaviour by calling the function.
 */

import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  describeQuittanceOutcome,
  QUITTANCE_UNAVAILABLE_FALLBACK,
} from "@/lib/domain/quittance-outcome";

const ADDRESS_ERROR =
  "Complétez votre adresse de propriétaire dans Mon profil pour pouvoir générer une quittance.";

describe("describeQuittanceOutcome", () => {
  it("reports the generator's reason when it refused", () => {
    // The refusal message is the only actionable information the user gets about
    // why no receipt appeared, so it must survive verbatim.
    const outcome = describeQuittanceOutcome({ success: false, error: ADDRESS_ERROR });

    expect(outcome.warning).toBe(ADDRESS_ERROR);
    expect(outcome.receiptUrl).toBeUndefined();
  });

  it("still reports something when the generator failed without a reason", () => {
    const outcome = describeQuittanceOutcome({ success: false });

    expect(outcome.warning).toBe(QUITTANCE_UNAVAILABLE_FALLBACK);
  });

  it("exposes the receipt url when a receipt was really produced", () => {
    const outcome = describeQuittanceOutcome({
      success: true,
      data: { receiptUrl: "/api/receipts/quittance-2026-0007.pdf" },
    });

    expect(outcome.receiptUrl).toBe("/api/receipts/quittance-2026-0007.pdf");
    expect(outcome.warning).toBeUndefined();
  });

  it("does not report success-with-no-receipt as a clean success", () => {
    // A successful call that produced no URL means there is no document to
    // download; saying nothing would put the user back to searching for one.
    for (const data of [undefined, {}, { receiptUrl: "" }, { receiptUrl: null }]) {
      const outcome = describeQuittanceOutcome({ success: true, data });

      expect(outcome.warning).toBe(QUITTANCE_UNAVAILABLE_FALLBACK);
      expect(outcome.receiptUrl).toBeUndefined();
    }
  });
});

describe("markTransactionPaid wiring", () => {
  const source = readFileSync(
    join(process.cwd(), "src/lib/actions/transaction-actions.tsx"),
    "utf8"
  );
  const action = source.slice(source.indexOf("export async function markTransactionPaid"));

  it("carries the reason into the payload instead of dropping it", () => {
    expect(action).toContain("describeQuittanceOutcome(await generateQuittance(id))");
    expect(action).toContain("quittanceError: outcome.warning");
  });

  it("still succeeds when no receipt could be produced", () => {
    // Returning success:false here would make it look like the payment was not
    // recorded — which is worse than the original bug, not better.
    expect(action).toMatch(/success: true/);
    // And the failure must not be silent on the server either.
    expect(action).toContain("quittance not generated");
  });
});

describe("mark-paid-button wiring", () => {
  const source = readFileSync(
    join(process.cwd(), "src/app/(dashboard)/billing/mark-paid-button.tsx"),
    "utf8"
  );

  it("warns with the reason rather than showing a bare success", () => {
    expect(source).toContain("quittanceError");
    expect(source).toContain("toast.warning");
    expect(source).toMatch(/la quittance n'a pas pu être générée/);
  });

  it("only shows the plain success when no warning came back", () => {
    const warningIndex = source.indexOf("if (quittanceError)");
    const successIndex = source.indexOf('toast.success("Paiement validé")');

    // The success toast must be the last resort, after the warning branch —
    // otherwise the user is told everything worked while holding no receipt.
    expect(warningIndex).toBeGreaterThan(-1);
    expect(successIndex).toBeGreaterThan(warningIndex);
  });
});