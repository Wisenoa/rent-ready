/**
 * Better Auth error codes → French messages.
 *
 * ## Why this exists
 *
 * `signIn.email()` returns `{ error: { code, message, status } }`. The forms were
 * rendering `result.error.message` with a French fallback:
 *
 *   toast.error(result.error.message ?? "Identifiants incorrects")
 *
 * Better Auth always sets `message`, and always in English. Measured on the
 * running app: a wrong password showed the toast **"Invalid email or
 * password"** — on a product whose entire interface is French. The French
 * fallback was unreachable code.
 *
 * Mapping the `code` fixes the language and keeps the message stable regardless
 * of what upstream wording changes to. An unknown code falls back to a French
 * generic that says what to do, never to a raw English string.
 */

/** Codes we have seen or that Better Auth documents for the auth routes. */
const AUTH_ERROR_MESSAGES: Record<string, string> = {
  // sign-in / sign-up
  INVALID_EMAIL_OR_PASSWORD:
    "Adresse email ou mot de passe incorrect.",
  INVALID_EMAIL:
    "Cette adresse email n'est pas valide.",
  INVALID_PASSWORD:
    "Le mot de passe est incorrect.",
  USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL:
    "Un compte existe déjà avec cette adresse email.",
  USER_NOT_FOUND:
    "Aucun compte ne correspond à cette adresse email.",
  EMAIL_NOT_VERIFIED:
    "Confirmez votre adresse email avant de vous connecter.",
  // session / token
  INVALID_TOKEN: "Votre session a expiré. Reconnectez-vous.",
  SESSION_EXPIRED: "Votre session a expiré. Reconnectez-vous.",
  INVALID_OR_EXPIRED_TOKEN: "Votre session a expiré. Reconnectez-vous.",
  // credentials / policy
  PASSWORD_TOO_SHORT: "Le mot de passe doit contenir au moins 8 caractères.",
  PASSWORD_TOO_LONG:
    "Le mot de passe est trop long (72 caractères maximum).",
  CREDENTIAL_ACCOUNT_NOT_FOUND:
    "Aucun compte ne correspond à ces identifiants.",
  // provider
  PROVIDER_NOT_FOUND: "Ce moyen de connexion n'est pas disponible.",
  SOCIAL_ACCOUNT_ALREADY_LINKED:
    "Ce compte est déjà associé à une autre méthode de connexion.",
  // rate limit
  TOO_MANY_REQUESTS:
    "Trop de tentatives. Patientez quelques minutes avant de réessayer.",
};

/** Shown when an error arrives with no code we recognise. */
const GENERIC_MESSAGE =
  "Connexion impossible. Vérifiez votre adresse email et votre mot de passe.";

export interface AuthErrorLike {
  code?: string | null;
  message?: string | null;
  status?: number | null;
}

/**
 * A French, actionable message for an auth error.
 *
 * Never returns upstream text: an unrecognised code would otherwise put an
 * English sentence in a French interface, which is what this module exists to
 * prevent.
 */
export function authErrorMessage(error: unknown): string {
  if (!error || typeof error !== "object") return GENERIC_MESSAGE;

  const { code, status } = error as AuthErrorLike;

  if (code && AUTH_ERROR_MESSAGES[code]) return AUTH_ERROR_MESSAGES[code];

  if (status === 429) return AUTH_ERROR_MESSAGES.TOO_MANY_REQUESTS;
  if (typeof status === "number" && status >= 500) {
    return "Le service est momentanément indisponible. Réessayez dans un instant.";
  }

  return GENERIC_MESSAGE;
}