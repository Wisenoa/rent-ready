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
 * This lives in its own module because `transaction-actions.tsx` is JSX (the
 * reminder email below renders a component) and therefore cannot be imported by
 * the test runner; the decision is worth pinning behaviourally, not by reading
 * source text.
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