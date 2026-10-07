import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { sendMagicLinkEmail } from "@/lib/auth-email-link";
import { emailService } from "@/lib/email/service";

export const auth = betterAuth({
  baseURL:
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.PORT ? `http://localhost:${process.env.PORT}` : undefined),
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  /**
   * Better Auth rate-limits auth endpoints PER IP by default. The E2E suite
   * registers a fresh account per test — 35 of them in a full run, all from
   * 127.0.0.1 — so the limit is reached mid-suite and registration silently
   * hangs on /register with no error, which is what several tests were failing
   * on rather than on anything they claimed to test.
   *
   * Disabled outside production only. In production it stays on: brute-forcing a
   * password is a real attack, and the limit is part of the defence.
   */
  rateLimit: {
    enabled: process.env.NODE_ENV === "production",
  },
  // Better Auth rejects a callback whose origin is not listed here. Hardcoding
  // "http://localhost:3000" meant that on any other port the CSRF origin check
  // failed, so sign-in and magic links were refused with a bare 403. Accept the
  // configured origin, plus the localhost ports used in development.
  // Better Auth's origin check rejects any callback not listed here with
  // INVALID_ORIGIN, which surfaced as a silent hang: registration succeeded and
  // returned a userId, then signIn.email never completed, leaving the new user on
  // /register with no error.
  //
  // In production only the configured public origin is trusted. In development
  // the loopback range is trusted wholesale, because pinning individual ports
  // breaks on the next port anyone chooses.
  // Better Auth's origin check rejects any callback not listed here with
  // INVALID_ORIGIN, which surfaced as a silent hang: registration succeeded and
  // returned a userId, then signIn.email never completed, leaving the new user
  // stuck on /register with no error shown.
  //
  // Patterns use Better Auth's own wildcard syntax ("*" and "?"), not RegExp —
  // matchesOriginPattern calls pattern.includes(...), which a RegExp does not
  // have. Enumerating ports is whack-a-mole, so the whole loopback range is
  // trusted in development and only the configured origin in production.
  trustedOrigins: [
    ...(process.env.NEXT_PUBLIC_AUTH_URL
      ? [process.env.NEXT_PUBLIC_AUTH_URL]
      : process.env.NEXT_PUBLIC_APP_URL
        ? [process.env.NEXT_PUBLIC_APP_URL]
        : []),
    ...(process.env.NODE_ENV === "production"
      ? []
      : [
          "http://localhost",
          "http://127.0.0.1",
          // Any loopback port, for `next dev -p <n>`.
          "http://localhost:*",
          "http://127.0.0.1:*",
        ]),
  ].filter((origin): origin is string => Boolean(origin)),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  emailLink: {
    enabled: true,
    expiresIn: 15 * 60, // 15 minutes
    sendMagicLink: async ({ email, url }: { email: string; url: string }) => {
      try {
        await sendMagicLinkEmail({ email, magicLink: url });
      } catch (err) {
        console.error("[magic-link] Failed to send email:", err);
        // Don't throw — better-auth surfaces its own error
      }
    },
  },
  /** Fires after a magic-link sign-in/sign-up is verified.
   *  Send a welcome email to newly created users.
   */
  hooks: {},
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh every 24h
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 min cache
    },
  },
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        defaultValue: "",
        input: true,
      },
      lastName: {
        type: "string",
        defaultValue: "",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      addressLine1: {
        type: "string",
        defaultValue: "",
        input: false,
      },
      addressLine2: {
        type: "string",
        required: false,
        input: false,
      },
      city: {
        type: "string",
        defaultValue: "",
        input: false,
      },
      postalCode: {
        type: "string",
        defaultValue: "",
        input: false,
      },
      country: {
        type: "string",
        defaultValue: "France",
        input: false,
      },
      stripeCustomerId: {
        type: "string",
        required: false,
        input: false,
      },
      stripeSubscriptionId: {
        type: "string",
        required: false,
        input: false,
      },
      subscriptionStatus: {
        type: "string",
        defaultValue: "TRIAL",
        input: false,
      },
      trialEndsAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;
