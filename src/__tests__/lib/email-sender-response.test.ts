/**
 * The email sender read the Resend response id from the wrong place.
 *
 * Resend 6 returns `{ data, error, headers }`. The code did:
 *
 *   let resendResult: { id?: string; error?: {...} } | null = null;
 *   resendResult = await resend.emails.send(...);
 *   resendId = resendResult.id ?? null;
 *
 * `res.id` is always undefined — the id lives in `res.data.id`.
 *
 * That mattered because `resendId` gates both the persisted status and the
 * function's return:
 *
 *   status: resendId ? "SENT" : ...            -> every delivery logged PENDING
 *   return resendId ? { ok: true } : ...      -> every send returned ok: false
 *
 * So RentReady reported each email as failed even when Resend had accepted it,
 * which would make senders retry or treat delivery as broken.
 *
 * These tests CALL `sendEmail` with a stubbed Resend that returns the real
 * `{ data: { id }, error: null }` shape. An earlier version asserted on the
 * source text, so reverting to `resendResult.id` — the actual defect — would
 * have left every assertion in the file passing.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const { send, emailLogCreate, fromEmail } = vi.hoisted(() => {
  const send = vi.fn();
  // Typed so `mock.calls` is a real tuple rather than an empty one.
  const emailLogCreate = vi.fn(
    async (_args: { data: Record<string, unknown> }): Promise<Record<string, never>> => ({})
  );
  return {
    send,
    emailLogCreate,
    fromEmail: "RentReady <bonjour@example.com>",
  };
});

vi.mock("@/lib/email", () => ({ resend: { emails: { send } }, fromEmail }));
vi.mock("@/lib/prisma", () => ({ prisma: { emailLog: { create: emailLogCreate } } }));

import { sendEmail } from "@/lib/email/sender";

const OPTIONS = {
  clientId: "quittance-2026-0007",
  to: "locataire@example.com",
  subject: "Votre quittance de loyer",
  // The renderer is irrelevant to what is under test; a valid element is enough.
  react: { type: "div", props: {}, key: null } as unknown as React.ReactElement,
  emailType: "QUITTANCE" as never,
};

const originalKey = process.env.RESEND_API_KEY;

beforeEach(() => {
  vi.clearAllMocks();
  process.env.RESEND_API_KEY = "re_test";
});

afterEach(() => {
  if (originalKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = originalKey;
});

/** The EmailLog row the sender persisted. */
function logged(): Record<string, unknown> | undefined {
  const [call] = emailLogCreate.mock.calls[0] ?? [];
  return (call as { data: Record<string, unknown> } | undefined)?.data;
}

describe("a delivered email", () => {
  beforeEach(() => {
    // The real SDK's success shape: the id is nested, never at the top level.
    send.mockResolvedValue({ data: { id: "abc-123" }, error: null, headers: {} });
  });

  it("reads the id from data.id and reports success", async () => {
    const result = await sendEmail(OPTIONS);

    expect(result).toEqual({ ok: true, id: "abc-123" });
  });

  it("logs the delivery as SENT with the message id", async () => {
    await sendEmail(OPTIONS);

    // The defect made this PENDING with a null id for every real delivery, which
    // is what made the dashboard report broken email while Resend had accepted it.
    expect(logged()).toMatchObject({ status: "SENT", resendId: "abc-123" });
  });

  it("joins multiple recipients into the log", async () => {
    await sendEmail({ ...OPTIONS, to: ["a@example.com", "b@example.com"] });

    expect(logged()).toMatchObject({ to: "a@example.com, b@example.com" });
    expect(send).toHaveBeenCalledWith(expect.objectContaining({ to: ["a@example.com", "b@example.com"] }));
  });
});

describe("a rejected email", () => {
  it("reports a permanent failure as non-retryable and logs it BOUNCED", async () => {
    send.mockResolvedValue({
      data: null,
      error: { message: "The from address is not verified.", statusCode: 422, name: "validation_error" },
      headers: {},
    });

    const result = await sendEmail(OPTIONS);

    expect(result).toEqual({
      ok: false,
      error: "[Resend 422] The from address is not verified.",
      retryable: false,
    });
    expect(logged()).toMatchObject({ status: "BOUNCED", errorMessage: "The from address is not verified." });
  });

  it("reports a transient failure as retryable and logs it FAILED", async () => {
    send.mockResolvedValue({
      data: null,
      error: { message: "Service unavailable", statusCode: 503, name: "internal_server_error" },
      headers: {},
    });

    const result = await sendEmail(OPTIONS);

    expect(result).toEqual({ ok: false, error: "[Resend 503] Service unavailable", retryable: true });
    expect(logged()).toMatchObject({ status: "FAILED" });
  });

  it("treats a thrown network error as a retryable failure, not a crash", async () => {
    send.mockRejectedValue(new Error("ECONNRESET"));

    const result = await sendEmail(OPTIONS);

    expect(result).toMatchObject({ ok: false, retryable: true });
    expect(logged()).toMatchObject({ status: "FAILED" });
  });
});

describe("when Resend is not configured", () => {
  it("logs PENDING and does not claim a delivery", async () => {
    // Product honesty (AGENTS.md §37): with no key the email was never sent, so
    // the caller must be told so rather than handed a fake success.
    delete process.env.RESEND_API_KEY;
    send.mockResolvedValue({ data: { id: "should-not-be-used" }, error: null, headers: {} });

    const result = await sendEmail(OPTIONS);

    expect(result.ok).toBe(false);
    expect(send).not.toHaveBeenCalled();
    expect(logged()).toMatchObject({ status: "PENDING", resendId: null });
  });
});

describe("logging must never mask the send result", () => {
  it("returns ok:true even when the EmailLog write fails", async () => {
    send.mockResolvedValue({ data: { id: "abc-123" }, error: null, headers: {} });
    emailLogCreate.mockRejectedValueOnce(new Error("DB down"));

    const result = await sendEmail(OPTIONS);

    expect(result).toEqual({ ok: true, id: "abc-123" });
  });
});
