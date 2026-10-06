import { Resend } from "resend";

/**
 * Lazy Resend client.
 *
 * `new Resend(undefined)` throws at module-evaluation time, so instantiating at
 * import scope crashed the build whenever `RESEND_API_KEY` was absent (it is not
 * in `.env.example`). Resolution now happens on first send instead: importing
 * this module is always safe, and only an actual send without credentials fails.
 */
let client: Resend | null = null;

function getResend(): Resend {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured — cannot send email. Set it in the environment."
    );
  }
  if (!client) {
    client = new Resend(apiKey);
  }
  return client;
}

export const fromEmail = process.env.RESEND_DOMAIN
  ? `Rent-Ready <notifications@${process.env.RESEND_DOMAIN}>`
  : "Rent-Ready <noreply@rent-ready.fr>";

/**
 * Thin proxy so callers keep using `resend.emails.send(...)`.
 * Throws a clear configuration error when the API key is missing, instead of
 * failing obscurely at import time.
 */
export const resend = {
  get emails() {
    return getResend().emails;
  },
};