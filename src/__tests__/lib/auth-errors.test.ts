import { describe, it, expect } from "vitest";

import { authErrorMessage } from "@/lib/auth-errors";

/**
 * The login and register forms used to render `result.error.message` with a
 * French fallback:
 *
 *   toast.error(result.error.message ?? "Identifiants incorrects")
 *
 * Better Auth always sets `message`, and always in English. Measured on the
 * running app: a wrong password produced the toast "Invalid email or password"
 * on a product whose entire interface is French. The fallback was unreachable.
 *
 * So the invariant is the reason this module exists: **no auth error ever
 * reaches a French interface in English.** That is checkable, and it is the only
 * thing that keeps it true when a new auth route is added.
 */
describe("auth errors are French", () => {
  it("translates the codes the auth routes actually return", () => {
    expect(authErrorMessage({ code: "INVALID_EMAIL_OR_PASSWORD" })).toMatch(
      /adresse email ou mot de passe incorrect/i
    );
    expect(authErrorMessage({ code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL" })).toMatch(
      /existe déjà/i
    );
    expect(authErrorMessage({ code: "EMAIL_NOT_VERIFIED" })).toMatch(/confirmez/i);
    expect(authErrorMessage({ code: "TOO_MANY_REQUESTS" })).toMatch(/trop de tentatives/i);
  });

  it("never returns the upstream English text", () => {
    // Whatever arrives — a known code, an unknown code, a bare status, nothing
    // at all — the answer must be French and must not echo `message`.
    const inputs: unknown[] = [
      { code: "INVALID_EMAIL_OR_PASSWORD", message: "Invalid email or password" },
      { code: "SOMETHING_NEW_IN_BETTER_AUTH", message: "Something went wrong" },
      { message: "User not found" },
      { code: null, message: "Invalid password" },
      { status: 500, message: "Internal Server Error" },
      { status: 429 },
      null,
      undefined,
      "Invalid email or password",
      42,
    ];

    for (const input of inputs) {
      const message = authErrorMessage(input);
      expect(typeof message).toBe("string");
      expect(message.length).toBeGreaterThan(0);

      // No sentence that is plainly the upstream English string.
      expect(message).not.toMatch(
        /invalid email or password|user not found|invalid password|something went wrong|internal server error/i
      );
    }
  });

  it("falls back to something actionable rather than a bare error", () => {
    const message = authErrorMessage({ code: "UNKNOWN_CODE_FROM_UPSTREAM" });
    // It must say what the user can do, not merely that something failed.
    expect(message).toMatch(/vérifiez|réessayez|patientez/i);
  });

  it("treats a 429 as a rate limit and a 5xx as unavailability", () => {
    expect(authErrorMessage({ status: 429 })).toMatch(/trop de tentatives|patientez/i);
    expect(authErrorMessage({ status: 503 })).toMatch(/indisponible|réessayez/i);
  });
});