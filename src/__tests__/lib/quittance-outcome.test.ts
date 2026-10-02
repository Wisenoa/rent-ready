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
 * The action side is covered by CALLING markTransactionPaid in
 * mark-transaction-paid.test.ts (it mocks the database and the generator). The
 * two functions below are the pure decision each side makes, and the button's
 * client component is reduced to picking the matching sonner call, so the
 * success-vs-warning rule is executable here too.
 *
 * Note: an earlier version of this file asserted on the SOURCE TEXT of
 * mark-paid-button.tsx and transaction-actions.tsx. That style passed even after
 * the warning branch was neutralised, so it guarded nothing. Nothing here reads
 * source any more.
 */

import { describe, it, expect, vi } from "vitest";

import {
  describeQuittanceOutcome,
  describeMarkPaidToast,
  reportMarkPaid,
  QUITTANCE_UNAVAILABLE_FALLBACK,
  type ToastSink,
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

describe("describeMarkPaidToast", () => {
  it("warns with the reason instead of claiming a clean success", () => {
    // This is the exact shape markTransactionPaid returns when generateQuittance
    // refused: the payment is recorded, no receipt exists.
    const toast = describeMarkPaidToast({
      success: true,
      data: { receiptType: "QUITTANCE", quittanceError: ADDRESS_ERROR },
    });

    expect(toast.tone).toBe("warning");
    expect(toast.message).toContain(ADDRESS_ERROR);
    expect(toast.message).toContain("la quittance n'a pas pu être générée");
    // The success wording must not be the whole message here, or the user is
    // still told everything worked.
    expect(toast.message).not.toBe("Paiement validé");
  });

  it("confirms plainly once a receipt really was produced", () => {
    const toast = describeMarkPaidToast({
      success: true,
      data: { receiptType: "QUITTANCE", receiptUrl: "/api/receipts/quittance-2026-0007.pdf" },
    });

    expect(toast).toEqual({ tone: "success", message: "Paiement validé" });
  });

  it("still errors when the action itself failed", () => {
    const toast = describeMarkPaidToast({ success: false, error: "Transaction introuvable." });

    expect(toast).toEqual({ tone: "error", message: "Transaction introuvable." });
  });

  it("has a fallback message when the action failed without a reason", () => {
    expect(describeMarkPaidToast({ success: false })).toEqual({
      tone: "error",
      message: "Impossible de valider le paiement",
    });
  });

  it("does not treat a non-string quittanceError as a warning", () => {
    // Guards the shape check itself: truthy non-strings must not leak into the
    // user-facing message.
    for (const data of [{}, { quittanceError: null }, { quittanceError: "" }]) {
      expect(describeMarkPaidToast({ success: true, data }).tone).toBe("success");
    }
  });
});

describe("reportMarkPaid", () => {
  function sink() {
    return {
      error: vi.fn(),
      warning: vi.fn(),
      success: vi.fn(),
    } satisfies ToastSink & Record<string, ReturnType<typeof vi.fn>>;
  }

  it("warns instead of reporting a bare success when no receipt came out", () => {
    // This is the regression under test: the original bug toasted
    // "Paiement validé" while no quittance existed anywhere.
    const toasts = sink();

    reportMarkPaid(
      { success: true, data: { receiptType: "QUITTANCE", quittanceError: ADDRESS_ERROR } },
      toasts
    );

    expect(toasts.warning).toHaveBeenCalledTimes(1);
    expect(toasts.warning.mock.calls[0][0]).toContain(ADDRESS_ERROR);
    // The critical assertions: a success toast here would restore the bug.
    expect(toasts.success).not.toHaveBeenCalled();
    expect(toasts.error).not.toHaveBeenCalled();
  });

  it("confirms plainly when a receipt really was produced", () => {
    const toasts = sink();

    reportMarkPaid({ success: true, data: { receiptUrl: "/api/receipts/q.pdf" } }, toasts);

    expect(toasts.success).toHaveBeenCalledWith("Paiement validé");
    expect(toasts.warning).not.toHaveBeenCalled();
  });

  it("errors when the action itself failed, without a warning", () => {
    const toasts = sink();

    reportMarkPaid({ success: false, error: "Transaction introuvable." }, toasts);

    expect(toasts.error).toHaveBeenCalledWith("Transaction introuvable.");
    expect(toasts.success).not.toHaveBeenCalled();
  });

  it("shows the warning long enough to read an address-related reason", () => {
    const toasts = sink();

    reportMarkPaid({ success: true, data: { quittanceError: ADDRESS_ERROR } }, toasts);

    // An 8s toast is the difference between a user reading the reason and
    // missing it, which would put them back to hunting for a receipt.
    expect(toasts.warning).toHaveBeenCalledWith(expect.any(String), { duration: 8000 });
  });
});
