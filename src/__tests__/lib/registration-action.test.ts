import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Registration — the product's front door — was completely broken.
 *
 *   const result = await auth.api.signUp.email({ body: { ... } });
 *
 * `signUp` is undefined on the Better Auth server API in this version; the
 * server-side endpoint is `signUpEmail`. Every submission threw
 *
 *   [register] Error: TypeError: Cannot read properties of undefined (reading 'email')
 *
 * POST /register returned 200, so the failure was silent to the user: the form
 * simply stayed on the page. Found by driving the real form in a browser, not by
 * a test.
 *
 * Verified after the fix, end to end against a running server: the account is
 * created (firstName populated, subscriptionStatus TRIAL), sign-in returns a
 * session, and /dashboard, /properties, /tenants, /leases and /billing all
 * return 200 with the empty state "Aucun bien".
 */

const action = readFileSync(
  join(process.cwd(), "src/lib/actions/register-actions.ts"),
  "utf8"
);
const form = readFileSync(
  join(process.cwd(), "src/app/register/register-form.tsx"),
  "utf8"
);

describe("registration server action", () => {
  it("calls signUpEmail, the endpoint this version exposes", () => {
    expect(action).toContain("auth.api.signUpEmail");
    expect(action).not.toContain("auth.api.signUp.email");
  });

  it("passes a body, since the endpoint is an endpoint not a method chain", () => {
    expect(action).toMatch(/auth\.api\.signUpEmail\(\{\s*\n?\s*body:/);
  });

  it("is reached from the real registration form", () => {
    expect(form).toContain("registerWithStripeCustomer");
    expect(form).toContain("signIn.email");
  });

  it("reports failure to the user instead of swallowing it", () => {
    // The catch returns { success: false } and the form toasts it, so a future
    // regression surfaces rather than looking like a no-op.
    expect(action).toMatch(/return \{ success: false, error:/);
    expect(form).toMatch(/registerResult\.success/);
    expect(form).toMatch(/toast\.error/);
  });

  it("does not send an empty name when only one part is given", () => {
    // `${firstName} ${lastName}` with both empty produced " " which the endpoint
    // rejects; the form always supplies a full name, but the action trims anyway.
    expect(action).toMatch(/name: `\$\{firstName\} \$\{lastName\}`\.trim\(\)/);
  });
});