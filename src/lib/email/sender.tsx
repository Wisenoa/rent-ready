/**
 * Low-level email sender backed by Resend.
 *
 * All outgoing emails MUST go through this module. It handles:
 * - Resend API calls with typed result returns
 * - DB audit logging (EmailLog) so we have a record of every sent email
 * - Error classification (transient vs permanent) for retry logic
 * - Idempotency via clientId deduplication
 *
 * High-level dispatch (template selection, data mapping, recipient resolution)
 * lives in service.ts — NOT here.
 */

import { resend, fromEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import type { EmailType } from "@prisma/client";

export type EmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string; retryable: boolean };

/** Classification of email types for the EmailLog table */
export type EmailTypeEnum = Exclude<EmailType, "EMAIL_TYPE_UNSPECIFIED">;

export interface SendEmailOptions {
  /** RFC 2046 compliant Content-ID for idempotency / deduplication */
  clientId: string;
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  /**
   * Human-readable email type used for filtering in the EmailLog.
   * Must match a value in the EmailType enum.
   */
  emailType: EmailTypeEnum;
  /**
   * Optional ID of the primary related entity (e.g. userId, leaseId).
   * Stored on the EmailLog for quick lookups.
   */
  relatedEntityId?: string;
  relatedEntityType?: string;
}

/**
 * Send a single email via Resend and log it to the DB.
 *
 * If RESEND_API_KEY is missing, the email is logged with status=PENDING
 * so it can be retried later — it will NOT silently fail.
 *
 * @returns EmailResult — always returns, never throws
 */
export async function sendEmail(
  options: SendEmailOptions
): Promise<EmailResult> {
  const {
    clientId,
    to,
    subject,
    react,
    emailType,
    relatedEntityId,
    relatedEntityType,
  } = options;

  const recipientList = Array.isArray(to) ? to : [to];

  // ── 1. Try to send via Resend ─────────────────────────────────────────────
  // Resend 6 returns `{ data, error, headers }` — the message id lives in
  // `data.id`, NOT at the top level. Reading `result.id` always yielded undefined,
  // which left resendId null, so every successfully delivered email returned
  // { ok: false } and its EmailLog row was written as PENDING instead of SENT.
  // Verified against the installed SDK, and the type is derived from it rather
  // than restated, so an SDK upgrade cannot silently reintroduce the mismatch.
  // Only what this function consumes: the delivered message id and a classified
  // failure. Deriving the SDK's whole return type would require reproducing
  // `headers` and its closed error-code union, which this code neither reads nor
  // can construct — so the id type is still taken from the SDK and the error is
  // normalised to the fields classifyError uses.
  type ResendMessageId = NonNullable<
    Extract<Awaited<ReturnType<typeof resend.emails.send>>, { data: unknown }>["data"]
  >["id"];
  type ResendSendResult = {
    data: { id: ResendMessageId } | null;
    error: { message: string; statusCode: number | null; name: string } | null;
  };
  let resendResult: ResendSendResult | null = null;
  let resendId: string | null = null;

  if (process.env.RESEND_API_KEY) {
    try {
      resendResult = await resend.emails.send({
        from: fromEmail,
        to: recipientList,
        subject,
        react,
        // Tag for Resend analytics dashboard
        tags: [{ name: "type", value: emailType }],
      });

      if (resendResult.error) {
        console.error("[email/sender] Resend API error:", resendResult.error);
      } else {
        resendId = resendResult.data?.id ?? null;
      }
    } catch (err) {
      // Network-level errors — these are retryable
      console.error("[email/sender] Unexpected Resend exception:", err);
      resendResult = {
        data: null,
        // name must be one of Resend's own error codes; internal_server_error is
        // the closest for a local exception (thrown before or during the HTTP call).
        error: {
          message: String(err),
          statusCode: null,
          name: "internal_server_error",
        },
      };
    }
  } else {
    console.warn("[email/sender] RESEND_API_KEY not set — skipping send, logging PENDING");
  }

  // ── 2. Persist EmailLog record ───────────────────────────────────────────
  try {
    await prisma.emailLog.create({
      data: {
        clientId,
        from: fromEmail,
        to: recipientList.join(", "),
        subject,
        emailType,
        status: resendId
          ? "SENT"
          : resendResult?.error
            ? classifyError(resendResult.error).retryable
              ? "FAILED"
              : "BOUNCED"
            : "PENDING",
        resendId: resendId ?? null,
        errorMessage: resendResult?.error?.message ?? null,
        relatedEntityId: relatedEntityId ?? null,
        relatedEntityType: relatedEntityType ?? null,
      },
    });
  } catch (logErr) {
    // Logging failure must never block the email result
    console.error("[email/sender] Failed to write EmailLog:", logErr);
  }

  // ── 3. Return typed result ───────────────────────────────────────────────
  if (resendId) {
    return { ok: true, id: resendId };
  }

  if (resendResult?.error) {
    const classified = classifyError(resendResult.error);
    return { ok: false, error: classified.message, retryable: classified.retryable };
  }

  return {
    ok: false,
    error: "Email send was skipped (no RESEND_API_KEY or unknown error)",
    retryable: true,
  };
}

/** Classify a Resend error into retryable vs permanent. */
/**
 * Classify a send failure. Resend's ErrorResponse is
 * `{ message: string; statusCode: number | null; name: <closed union> }` — note
 * statusCode is nullable, not optional — so the parameter matches it exactly.
 */
function classifyError(
  error: { message: string; statusCode: number | null; name: string }
): { message: string; retryable: boolean } {
  // Permanent errors — do not retry
  const permanentCodes = new Set([400, 401, 403, 404, 422]);
  if (error.statusCode && permanentCodes.has(error.statusCode)) {
    return {
      message: `[Resend ${error.statusCode}] ${error.message}`,
      retryable: false,
    };
  }

  // Transient errors — safe to retry
  return {
    message: `[Resend ${error.statusCode ?? "unknown"}] ${error.message}`,
    retryable: true,
  };
}
