import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

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
  denyUrls: [
    /favicon\.ico/,
    /\/_next\/static/,
  ],

  // Release for source map matching
  release: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",
});

// Required for Sentry router instrumentation
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
