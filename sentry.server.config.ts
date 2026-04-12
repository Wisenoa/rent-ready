import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // More aggressive sampling on server (API routes can be high volume)
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 1.0,

  // Environment
  environment: process.env.NEXT_PUBLIC_APP_ENV || "development",

  // Release
  release: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",

  // Depth = 5 should handle most async trace chains in Next.js
  maxBreadcrumbs: 50,

  // Filter non-actionable noise
  ignoreErrors: [
    "Concurrent mutation detected",
    "AbortError",
    "Non-Error promise rejection captured",
    "TypeError: Failed to fetch",
  ],

  denyUrls: [
    /favicon\.ico/,
    /\/api\/health/,
    /\/_next\/static/,
  ],
});

// Export utilities for use in API routes
export { Sentry };
export const captureException = Sentry.captureException.bind(Sentry);
export const addBreadcrumb = Sentry.addBreadcrumb.bind(Sentry);