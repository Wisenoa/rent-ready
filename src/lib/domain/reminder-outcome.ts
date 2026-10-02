/**
 * What the landlord is told after asking for a relance.
 *
 * Sending a relance hands control to an external provider: Resend either
 * accepted the message or it did not. Reporting success unconditionally would
 * be exactly the fake-success the product rules forbid (AGENTS.md §37) — the
 * landlord walks away believing the tenant was chased, and nobody ever was.
 *
 * So the decision lives here, in a module the test suite can CALL, rather than in
 * the button. The button is a client component and the suite runs in node with
 * no DOM, so a branch written there would go unexecuted: an earlier version of
 * `MarkPaidButton` had exactly that problem, and a dead-branch mutation passed
 * the whole suite.
 *
 * Mirrors `describeMarkPaidToast` in `./quittance-outcome`, for the same reason.
 */

export type ReminderTone = "friendly" | "formal" | "legal";

export const TONE_LABEL: Record<ReminderTone, string> = {
  friendly: "rappel",
  formal: "relance formelle",
  legal: "mise en demeure",
};

/** The subset of sonner's API the button uses, so tests can substitute it. */
export type ReminderToastSink = {
  error: (message: string) => void;
  success: (message: string) => void;
};

export type ReminderToast = {
  tone: "error" | "success";
  message: string;
};

/**
 * Turn the action's result into the toast to display.
 *
 * A refusal keeps the action's own reason: "not yet due" and "already settled"
 * are different problems for the landlord and a generic failure would send them
 * looking in the wrong place.
 */
export function describeReminderToast(result: {
  success: boolean;
  error?: string;
  data?: Record<string, unknown>;
}): ReminderToast {
  if (!result.success) {
    return {
      tone: "error",
      message: result.error ?? "Impossible d'envoyer la relance.",
    };
  }

  const daysLate = result.data?.daysLate;
  const days = typeof daysLate === "number" ? daysLate : null;
  const lateness =
    days === null
      ? "relance envoyée"
      : days > 0
        ? `relance envoyée (${days} jour${days > 1 ? "s" : ""} de retard)`
        : "relance envoyée";

  return { tone: "success", message: `Email de ${lateness} au locataire.` };
}

/** Report the outcome through the injected toast. */
export function reportReminder(
  result: { success: boolean; error?: string; data?: Record<string, unknown> },
  toasts: ReminderToastSink
): void {
  const outcome = describeReminderToast(result);
  if (outcome.tone === "error") {
    toasts.error(outcome.message);
    return;
  }
  toasts.success(outcome.message);
}