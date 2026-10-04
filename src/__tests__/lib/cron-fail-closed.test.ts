import { describe, it, expect } from "vitest";
import { readFileSync } from "fs";
import { join } from "path";

const SRC = join(process.cwd(), "src");

/**
 * `POST /api/email/cron-dispatch` was open to anyone.
 *
 * The guard was:
 *
 *   const cronSecret = process.env.CRON_SECRET;
 *   if (cronSecret) { …verify the Bearer token… }
 *
 * With no CRON_SECRET configured, the check was skipped entirely. And
 * CRON_SECRET was absent from `.env` and commented out in `.env.example`, so that
 * was the default state, not an edge case. The two sibling crons
 * (`/api/cron/rent-periods`, `/api/cron/revision-check`) fail closed on the same
 * variable; only this one did not.
 *
 * Demonstrated before the fix, with no Authorization header at all:
 *
 *   POST {"type":"rent-reminder","transactionId":"inexistant-test"}
 *   → 200 {"sent":true,"type":"rent-reminder","transactionId":"inexistant-test"}
 *
 * That endpoint sends rent reminders to real tenants. A missing secret is a
 * misconfiguration, and a misconfiguration must never widen access — so it has to
 * fail the request rather than skip the check.
 *
 * The same call also answered `sent: true` for a transaction that does not exist:
 * the email service returned `void` and `return`ed early, so the caller could not
 * distinguish "sent" from "nothing happened". A cron that reports success while
 * sending nothing is worse than one that fails loudly.
 */
describe("les crons echouent fermes", () => {
  const CRONS = [
    "app/api/email/cron-dispatch/route.ts",
    "app/api/cron/rent-periods/route.ts",
    "app/api/cron/revision-check/route.ts",
  ];

  it.each(CRONS)("%s refuses a missing CRON_SECRET", (relativePath) => {
    const source = readFileSync(join(SRC, relativePath), "utf8");
    const code = source
      .replace(/\/\*[\s\S]*?\*\//g, " ")
      .replace(/\/\/[^\n]*/g, " ");

    const readsSecret = code.includes("CRON_SECRET");
    expect(readsSecret, `${relativePath} should read CRON_SECRET`).toBe(true);

    // The failure mode: a bare `if (cronSecret) {` skips the check when the
    // variable is unset. What is required is the negated form.
    expect(
      code,
      `${relativePath} skips the auth check when CRON_SECRET is absent — use "if (!cronSecret)" so it fails closed`
    ).not.toMatch(/if\s*\(\s*!?\s*cronSecret\s*\)\s*\{?\s*(?!.*(?:500|Unauthorized))/s);

    // And the fail-closed form must exist, returning a server error.
    expect(
      code,
      `${relativePath} must refuse the request when CRON_SECRET is missing`
    ).toMatch(/if\s*\(\s*!\s*cronSecret\s*\)/);
  });

  it("the email service reports what it actually did", () => {
    const source = readFileSync(
      join(SRC, "lib", "email", "service.tsx"),
      "utf8"
    );

    // A `void` return cannot distinguish a send from a no-op.
    const signature = /async function sendRentReminderEmail\([\s\S]*?\):\s*Promise<([^>]+)>/.exec(
      source
    );
    expect(signature, "sendRentReminderEmail signature not found").not.toBeNull();
    expect(
      signature![1],
      "sendRentReminderEmail must return a SendResult, not void"
    ).toContain("SendResult");

    // Every early return states an outcome, so no caller can assume success.
    for (const outcome of ["not_found", "no_email"]) {
      expect(
        source,
        `an early return must report "${outcome}" rather than returning silently`
      ).toContain(`status: "${outcome}"`);
    }
    expect(source).toContain('return { status: "sent" };');
  });
});