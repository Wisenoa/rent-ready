import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Edge runtime has lower limits — be conservative
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.02 : 1.0,

  environment: process.env.NEXT_PUBLIC_APP_ENV || "development",
  release: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",

  // Strip noisy middleware noise
  ignoreErrors: [
    "Concurrent mutation detected",
    "AbortError",
    "Non-Error promise rejection captured",
  ],

  denyUrls: [
    /favicon\.ico/,
    /\/api\/health/,
    /\/_next\/static/,
  ],
});