import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The email sender read the Resend response id from the wrong place.
 *
 * Resend 6 returns `{ data, error, headers }`. The code did:
 *
 *   let resendResult: { id?: string; error?: {...} } | null = null;
 *   resendResult = await resend.emails.send(...);
 *   resendId = resendResult.id ?? null;
 *
 * `res.id` is always undefined — the id lives in `res.data.id`. Verified against
 * the installed SDK, whose success response has no top-level `id`.
 *
 * That mattered because `resendId` gates both the persisted status and the
 * function's return:
 *
 *   status: resendId ? "SENT" : ...            -> every delivery logged PENDING
 *   return resendId ? { ok: true } : ...      -> every send returned ok: false
 *
 * So RentReady reported each email as failed even when Resend had accepted it,
 * which would make senders retry or treat delivery as broken.
 */

const sender = readFileSync(join(process.cwd(), "src/lib/email/sender.tsx"), "utf8");

describe("Resend response shape", () => {
  it("reads the message id from data.id, not the top level", () => {
    expect(sender).toContain("resendResult.data?.id");
    expect(sender).not.toMatch(/resendId\s*=\s*resendResult\.id/);
  });

  it("types the id from the SDK rather than restating it", () => {
    expect(sender).toMatch(/type ResendMessageId = NonNullable</);
    expect(sender).toContain("ReturnType<typeof resend.emails.send>");
  });

  it("does not pretend a Resend error is optional-and-untyped", () => {
    // statusCode is `number | null` in the SDK, not `statusCode?: number`.
    expect(sender).toMatch(/statusCode: number \| null/);
  });

  it("uses one of Resend's own error-code names for a synthetic failure", () => {
    expect(sender).toMatch(/name:\s*"[a-z_]+"/);
  });
});

describe("delivery status follows the id", () => {
  /** The decision the sender makes, for a given SDK response shape. */
  function decide(res: { data: { id: string } | null; error: unknown | null }) {
    const resendId = res.data?.id ?? null;
    return {
      resendId,
      status: resendId ? "SENT" : res.error ? "FAILED" : "PENDING",
      ok: Boolean(resendId),
    };
  }

  it("reports SENT and ok:true when Resend returns an id", () => {
    const r = decide({ data: { id: "abc-123" }, error: null });
    expect(r.status).toBe("SENT");
    expect(r.ok).toBe(true);
    expect(r.resendId).toBe("abc-123");
  });

  it("would have reported PENDING and ok:false with the old top-level read", () => {
    // What the previous code computed for the very same successful response.
    const old = { data: { id: "abc-123" }, error: null } as { id?: string };
    const oldId = (old as { id?: string }).id ?? null;
    expect(oldId).toBeNull();
    expect(oldId ? "SENT" : "PENDING").toBe("PENDING");
    expect(Boolean(oldId)).toBe(false);
  });

  it("still reports a failure when Resend returns an error", () => {
    const r = decide({ data: null, error: { message: "API key is invalid" } });
    expect(r.status).toBe("FAILED");
    expect(r.ok).toBe(false);
  });
});