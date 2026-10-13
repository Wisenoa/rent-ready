type SentrySdk = typeof import("@sentry/nextjs");

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isValidDsn = dsn && !dsn.includes("your-sentry-dsn") && !dsn.includes("project-id");

// The only browser-side Sentry setup (the former sentry.client.config.ts
// initialised the SDK a second time and was deprecated by @sentry/nextjs).
//
// The SDK is loaded on demand rather than imported: a static import put ~125 kB
// (compressed) of JavaScript on every page, parsed before hydration, even when
// no DSN is configured — which is the case in production today. With a DSN the
// SDK still initialises, a moment after the page instead of before it.
//
// Events go straight to sentry.io, not through /api/sentry-error: Sentry 10
// has no tunnel option, and wiring that route needs a custom Transport, which
// is worth doing deliberately with its own test. Until NEXT_PUBLIC_SENTRY_DSN
// is set (and the CSP allows sentry.io), no browser error reaches us.
let sentry: SentrySdk | undefined;

if (isValidDsn) {
  void import("@sentry/nextjs").then((Sentry) => {
    sentry = Sentry;
    Sentry.init({
      dsn,

      // Performance monitoring
      tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

      // Session replay for debugging UX issues
      replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.05 : 0,

      // Error replay (session when user hits an error)
      replaysOnErrorSampleRate: 0.1,

      // Environment
      environment: process.env.NEXT_PUBLIC_APP_ENV || "development",

      // Filter out known non-actionable errors
      ignoreErrors: [
        "Concurrent mutation detected",
        "AbortError",
        "ResizeObserver loop",
        "Non-Error promise rejection captured",
      ],

      // Don't capture from favicon, health checks
      denyUrls: [/favicon\.ico/, /\/api\/health/, /\/_next\/static/],

      // Release for source map matching
      release: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
    });
  });
}

// Required for Sentry router instrumentation; a no-op until the SDK is loaded.
export function onRouterTransitionStart(
  ...args: Parameters<SentrySdk["captureRouterTransitionStart"]>
): void {
  sentry?.captureRouterTransitionStart(...args);
}
