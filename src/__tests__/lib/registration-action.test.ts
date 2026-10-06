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
 * These tests CALL the action with a stubbed auth server. The stub is
 * deliberately faithful to the failure: it exposes only `signUpEmail`, so
 * `auth.api.signUp` is genuinely `undefined` and reading `.email` off it throws
 * exactly as Better Auth did. An earlier version of this file asserted on the
 * source text instead, which meant a call to the wrong endpoint passed as long
 * as the string "signUpEmail" appeared somewhere in the file.
 *
 * The form side is a client component that needs a DOM; the suite runs in a node
 * environment, so its toast wiring is not covered here. That part was verified
 * manually in a browser against a running server: the account is created
 * (firstName populated, subscriptionStatus TRIAL), sign-in returns a session, and
 * /dashboard, /properties, /tenants, /leases and /billing all return 200 with
 * the empty state "Aucun bien".
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const { prismaMock, signUpEmail, stripeCreate } = vi.hoisted(() => ({
  prismaMock: {
    user: { findUnique: vi.fn(), update: vi.fn() },
  },
  signUpEmail: vi.fn(),
  stripeCreate: vi.fn(async () => ({ id: "cus_123" })),
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
// Only `signUpEmail` exists, exactly as on the Better Auth server API. If the
// action goes back to `auth.api.signUp.email`, this is undefined and the call
// throws — the original defect, reproduced.
vi.mock("@/lib/auth-server", () => ({
  auth: { api: { signUpEmail } },
}));
vi.mock("@/lib/stripe", () => ({
  getStripe: () => ({ customers: { create: stripeCreate } }),
}));

import { registerWithStripeCustomer } from "@/lib/actions/register-actions";

const CREDENTIALS = {
  firstName: "Camille",
  lastName: "Durand",
  email: "camille@example.com",
  password: "correct-horse-battery",
};

beforeEach(() => {
  vi.clearAllMocks();
  prismaMock.user.findUnique.mockResolvedValue(null);
  signUpEmail.mockResolvedValue({ user: { id: "user-1" } });
});

describe("registerWithStripeCustomer", () => {
  it("creates the account through the endpoint this version exposes", async () => {
    // If the action called `auth.api.signUp.email` this would throw, the catch
    // would swallow it, and success would be false.
    const result = await registerWithStripeCustomer(CREDENTIALS);

    expect(result.success).toBe(true);
    expect(result.userId).toBe("user-1");
    expect(signUpEmail).toHaveBeenCalledWith({
      body: {
        email: CREDENTIALS.email,
        password: CREDENTIALS.password,
        name: "Camille Durand",
        firstName: "Camille",
        lastName: "Durand",
      },
    });
  });

  it("refuses an address that already has an account, without calling the endpoint", async () => {
    prismaMock.user.findUnique.mockResolvedValue({ id: "existing" });

    const result = await registerWithStripeCustomer(CREDENTIALS);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Un compte avec cet email existe déjà.");
    expect(signUpEmail).not.toHaveBeenCalled();
  });

  it("does not send a blank name when only one part is given", async () => {
    // `${firstName} ${lastName}` with both empty produced " ", which the
    // endpoint rejects; the action trims, so the caller cannot cause that.
    await registerWithStripeCustomer({ ...CREDENTIALS, firstName: "  ", lastName: "  " });

    const body = signUpEmail.mock.calls[0][0].body as { name: string };
    expect(body.name).toBe("");
  });

  it("reports a thrown failure instead of swallowing it, without leaking it", async () => {
    // A registration that throws must not look like a no-op on the form.
    //
    // This assertion used to expect the thrown text to reach the caller verbatim:
    //
    //   expect(result.error).toBe("Le service d'authentification est indisponible.");
    //
    // That encoded the defect this change fixes. With the database stopped,
    // Prisma's message reached the browser and the form rendered
    // `could not open file "global/pg_filenode.map": I/O error` to the visitor.
    // The intent — do not swallow — is kept; the leak is not.
    signUpEmail.mockRejectedValue(
      new Error("Le service d'authentification est indisponible.")
    );

    const result = await registerWithStripeCustomer(CREDENTIALS);

    expect(result.success).toBe(false);
    // Reported, not swallowed…
    expect(result.error).toBeTruthy();
    expect(result.error).not.toBe("");
    // …but classified.
    expect(result.error).toBe(
      "Le service est momentanément indisponible. Réessayez dans un instant."
    );
  });

  it("never returns a database error to the caller", async () => {
    // The exact failure observed when the postgres container was stopped, and
    // the one Playwright captured rendered inside the registration page.
    signUpEmail.mockRejectedValue(
      new Error('could not open file "global/pg_filenode.map": I/O error')
    );

    const result = await registerWithStripeCustomer(CREDENTIALS);

    expect(result.success).toBe(false);
    expect(result.error).not.toContain("pg_filenode");
    expect(result.error).not.toContain("I/O error");
    expect(result.error).not.toContain("global/");
    expect(result.error).not.toMatch(/["']/);
  });

  it("keeps a Better Auth code actionable", async () => {
    signUpEmail.mockRejectedValue(
      Object.assign(new Error("User already exists. Use another email."), {
        code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
      })
    );

    const result = await registerWithStripeCustomer(CREDENTIALS);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Un compte existe déjà avec cette adresse email.");
  });

  it("still succeeds when the background Stripe customer creation fails", async () => {
    // Stripe is best-effort by design: the account exists, so a Stripe outage
    // must not be reported as a failed registration.
    stripeCreate.mockRejectedValueOnce(new Error("Stripe unreachable"));

    const result = await registerWithStripeCustomer(CREDENTIALS);

    expect(result.success).toBe(true);
    expect(result.userId).toBe("user-1");
  });
});
