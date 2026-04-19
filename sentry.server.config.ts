import * as Sentry from "@sentry/nextjs";

// NOTE: Sentry.init() is called in instrumentation.ts (server side).
// This file exists only for backwards compatibility and utilities.
// Do NOT call Sentry.init() here — it will cause double initialization.

// Export utilities for use in API routes
export { Sentry };
export const captureException = Sentry.captureException.bind(Sentry);
export const addBreadcrumb = Sentry.addBreadcrumb.bind(Sentry);
