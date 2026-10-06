import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
const isValidDsn = dsn && !dsn.includes("your-sentry-dsn") && !dsn.includes("project-id");

if (isValidDsn) {
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
  denyUrls: [
    /favicon\.ico/,
    /\/api\/health/,
    /\/_next\/static/,
  ],

  // Release for source map matching
  release: process.env.NEXT_PUBLIC_APP_VERSION || "unknown",

  /**
   * NOT routed through a tunnel, deliberately — and this is a known gap, not an
   * oversight.
   *
   * The build config asked for one (`tunnelRoute: '/api/sentry-error'`) and it
   * did nothing twice over: Sentry 10 has no `tunnelUrl`/`tunnelRoute` option on
   * `SentryBuildOptions` at all — `tsc` rejects both — and it has no exported
   * `makeFetchTransport` to build a replacement with. The browser SDK therefore
   * posts straight to sentry.io.
   *
   * Consequences, stated plainly rather than papered over:
   *   - client-side errors are only visible once NEXT_PUBLIC_SENTRY_DSN is set;
   *   - if the Content-Security-Policy does not allow sentry.io, the browser
   *     drops those events and nothing reaches us.
   *
   * src/app/api/sentry-error/route.ts exists and forwards an envelope to Sentry,
   * and logs it when no DSN is set rather than letting it disappear. Wiring the
   * browser SDK to it needs a custom Transport implementation against Sentry's
   * internal types — worth doing deliberately, with its own test, not as a
   * two-line change pretending to work.
   */
});
}
