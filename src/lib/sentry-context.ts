/**
 * Sentry User Context Utilities
 *
 * Helpers to bind authenticated user identity to Sentry events on the server.
 * Call setUserContext() in API routes after resolving the session so that
 * every subsequent exception in that request carries the user ID / email.
 *
 * Usage in an API route handler:
 *
 *   import { setUserContext, clearUserContext } from "@/lib/sentry-context";
 *   import { requireUser } from "@/lib/auth";
 *
 *   export async function GET() {
 *     const user = await requireUser();
 *     setUserContext(user);
 *     ...
 *   }
 */

import * as Sentry from "@sentry/nextjs";

export interface SentryUser {
  id: string;
  email?: string | null;
  name?: string | null;
}

/**
 * Set Sentry user context for the current scope.
 * Call this as early as possible in a route handler, after authentication.
 */
export function setUserContext(user: SentryUser | null | undefined): void {
  if (!user) {
    Sentry.setUser(null);
    return;
  }

  Sentry.setUser({
    id: user.id,
    email: user.email ?? undefined,
    username: user.name ?? undefined,
  });
}

/**
 * Clear Sentry user context (call on logout or unauthenticated routes).
 */
export function clearUserContext(): void {
  Sentry.setUser(null);
}

/**
 * Wrap a Next.js App Router route handler to automatically:
 *   1. Set Sentry user context when a session is available
 *   2. Capture and re-throw unhandled exceptions with Sentry
 *
 * @example
 *   export const GET = withSentryContext(async (req) => {
 *     const user = await requireUser();
 *     // ... your handler logic
 *   });
 */
export function withSentryContext<T extends (...args: never[]) => Promise<Response>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      // Only capture truly unexpected errors — intentional HTTP errors
      // (like NextResponse.json({}, { status: 401 })) won't throw here.
      Sentry.captureException(error);
      throw error;
    }
  }) as T;
}
