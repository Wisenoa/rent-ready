/**
 * Registration failures, translated for a visitor.
 *
 * The registration action used to return `error.message` verbatim:
 *
 *   } catch (error: any) {
 *     const message = error?.message ?? "Erreur lors de la création du compte.";
 *     return { success: false, error: message };
 *   }
 *
 * With the database stopped, Prisma threw
 *
 *   could not open file "global/pg_filenode.map": I/O error
 *
 * and Playwright captured that string rendered in the page, during the run that
 * produced 38 `waitForURL` timeouts. It names an infrastructure mechanism and
 * hands a reader a map of the system. It must not cross the trust boundary.
 *
 * The full error stays in the server log, where it can be diagnosed. What is
 * returned is classified: either a message the visitor can act on, or a generic
 * "come back in a moment".
 */

import { AUTH_ERROR_MESSAGES, type AuthErrorLike } from "@/lib/auth-errors";

export const GENERIC_REGISTER_ERROR =
  "Le service est momentanément indisponible. Réessayez dans un instant.";

/**
 * Anything carrying a quote, a path, a colon-separated code, a stack frame or a
 * SQL keyword is machine output, not a sentence written for a visitor.
 */
function looksLikeInfrastructure(raw: string): boolean {
  return /["'\\]|\/\/|:\s|\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE|ECONN|PG\d|ETIMEDOUT|ENOTFOUND|Traceback|at\s+\w+\.)/i.test(
    raw
  );
}

/**
 * Map a thrown value to a message a visitor may read.
 *
 * Better Auth identifies a failure by an UPPER_SNAKE `code`
 * (`USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL`, `PASSWORD_TOO_SHORT`, …), so the code
 * is looked up in the same table the login form uses rather than in a second,
 * looser set of patterns kept here. One table, one source of truth.
 *
 * The code is trusted only after the infrastructure check: an error whose text
 * carries a quote, a path or a stack frame is machine output whatever it calls
 * itself.
 */
export function registerErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") return GENERIC_REGISTER_ERROR;

  const { code, status, message } = error as AuthErrorLike;

  // Infrastructure, whatever the code claims.
  if (typeof message === "string" && looksLikeInfrastructure(message)) {
    return GENERIC_REGISTER_ERROR;
  }

  if (code && Object.prototype.hasOwnProperty.call(AUTH_ERROR_MESSAGES, code)) {
    return AUTH_ERROR_MESSAGES[code];
  }
  if (status === 429) return AUTH_ERROR_MESSAGES.TOO_MANY_REQUESTS;
  if (typeof status === "number" && status >= 500) {
    return GENERIC_REGISTER_ERROR;
  }

  return GENERIC_REGISTER_ERROR;
}

/**
 * Last line of defence, for text the action has already classified.
 *
 * The action returns a message it produced itself, so trusting it is normally
 * right. This exists for the day someone changes the action: it asks only
 * whether the string LOOKS like machine output, and never reclassifies it.
 *
 * Using `registerErrorMessage` here instead would be a bug: it maps a *known*
 * failure to its French message, and text that is already correct ("Un compte
 * avec cet email existe déjà.") matches none of those patterns and would be
 * replaced by the generic one. That turns a precise message into a useless one.
 */
export function visitorSafe(text: string | undefined | null): string {
  const raw = typeof text === "string" ? text : "";
  if (!raw) return GENERIC_REGISTER_ERROR;
  return looksLikeInfrastructure(raw) ? GENERIC_REGISTER_ERROR : raw;
}
