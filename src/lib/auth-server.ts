import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

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
