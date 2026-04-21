import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { sendMagicLinkEmail } from "@/lib/auth-email-link";
import { emailService } from "@/lib/email/service";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ],
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
