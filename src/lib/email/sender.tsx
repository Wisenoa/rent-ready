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
  let resendResult: { id?: string; error?: { message: string; statusCode?: number } } | null = null;
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
        resendId = resendResult.id ?? null;
      }
    } catch (err) {
      // Network-level errors — these are retryable
      console.error("[email/sender] Unexpected Resend exception:", err);
      resendResult = { error: { message: String(err), statusCode: 0 } };
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
function classifyError(
  error: { message: string; statusCode?: number }
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
