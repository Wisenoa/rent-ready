/**
 * What happened to the quittance when a payment was marked as paid.
 *
 * `markTransactionPaid` records the payment BEFORE it asks for a receipt, so a
 * receipt failure must not turn the action into a failure — the money really is
 * recorded. But it must not vanish either: generateQuittance refuses when the
 * landlord's own address is incomplete, and that is the default state of every
 * account created before the profile page existed. Swallowing that error made
 * the UI claim "Paiement validé" while no receipt existed anywhere.
 *
 * So the outcome is split in two, and both halves are needed:
 *   - the action still succeeds (the payment is real);
 *   - a warning travels to the UI, which shows it instead of a clean success.
 *
 * This lives in its own module so the decision can be tested by calling it.
 * `vitest.config.ts` wires @vitejs/plugin-react, so `transaction-actions.tsx`
 * is now importable too and the action itself is covered by calling it
 * (see mark-transaction-paid.test.ts).
 */

/** The message shown when no receipt could be produced, if generateQuittance gave none. */
export const QUITTANCE_UNAVAILABLE_FALLBACK =
  "La quittance n'a pas pu être générée.";

export type QuittanceOutcome = {
  /** Set only when a receipt document was actually produced. */
  receiptUrl?: string;
  /** Set only when the payment is recorded but no receipt exists. */
  warning?: string;
};

export function describeQuittanceOutcome(result: {
  success: boolean;
  error?: string;
  data?: unknown;
}): QuittanceOutcome {
  if (!result.success) {
    return { warning: result.error ?? QUITTANCE_UNAVAILABLE_FALLBACK };
  }

  const receiptUrl =
    typeof result.data === "object" && result.data !== null
      ? (result.data as { receiptUrl?: unknown }).receiptUrl
      : undefined;

  // A successful call with no URL means the generator produced nothing usable.
  // Report it as a warning rather than letting the UI imply a receipt is ready.
  return typeof receiptUrl === "string" && receiptUrl.length > 0
    ? { receiptUrl }
    : { warning: QUITTANCE_UNAVAILABLE_FALLBACK };
}

/** What the MarkPaidButton should show the user once the action has returned. */
export type MarkPaidToast = {
  tone: "error" | "warning" | "success";
  message: string;
};

/**
 * Turn the action's result into the toast to display.
 *
 * The button itself is a client component and the suite runs in a node
 * environment with no DOM, so a rule written there would go untested — an
 * earlier version had its warning branch in the component and a dead-branch
 * mutation still passed the suite. Deciding here means the button contains no
 * conditional to protect, and this rule is executed by the tests.
 *
 * Order matters: a missing receipt outranks the success message, or the user is
 * told everything worked while holding no document.
 */
export function describeMarkPaidToast(result: {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
}): MarkPaidToast {
  if (!result.success) {
    return { tone: "error", message: result.error ?? "Impossible de valider le paiement" };
  }

  const receiptError = result.data?.quittanceError;
  if (typeof receiptError === "string" && receiptError.length > 0) {
    return {
      tone: "warning",
      message: `Paiement validé, mais la quittance n'a pas pu être générée : ${receiptError}`,
    };
  }

  return { tone: "success", message: "Paiement validé" };
}

/** The subset of sonner's API this component uses, so tests can substitute it. */
export type ToastSink = {
  error: (message: string) => void;
  warning: (message: string, options?: { duration?: number }) => void;
  success: (message: string) => void;
};

/**
 * Report an outcome to the user through the injected toast.
 *
 * Kept separate from the component so the success/warning/error choice is
 * executed by the test suite rather than living in unrendered client code.
 */
export function reportMarkPaid(
  result: { success: boolean; error?: string; data?: Record<string, unknown> },
  toasts: ToastSink
): void {
  const outcome = describeMarkPaidToast(result);

  if (outcome.tone === "error") {
    toasts.error(outcome.message);
    return;
  }

  if (outcome.tone === "warning") {
    // Long enough to read an address-related reason without rushing it.
    toasts.warning(outcome.message, { duration: 8000 });
    return;
  }

  toasts.success(outcome.message);
}