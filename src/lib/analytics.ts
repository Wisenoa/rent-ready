/**
 * Analytics service — centralises all KPI event capture.
 *
 * Events are forwarded to:
 *   - PostHog (product: signups, activation, feature usage)
 *   - Existing /api/analytics/page-view log (for custom pageview pipeline)
 *
 * Usage in Server Components / API routes:
 *   import { trackEvent } from '@/lib/analytics';
 *   await trackEvent('signup_completed', { userId, method: 'google' });
 *
 * Usage in Client Components:
 *   import { useTrackEvent } from '@/hooks/useTrackEvent';
 *   const { trackEvent } = useTrackEvent();
 *   trackEvent('lease_created', { leaseId });
 */

import { getPostHog } from '@/lib/posthog';

// ──────────────────────────────────────────────────────────────────────────────
// Event catalogue — aligned to Q2 OKR KRs
// ──────────────────────────────────────────────────────────────────────────────

export type AnalyticsEvent =
  // Signup / Acquisition
  | 'page_view'
  | 'signup_started'
  | 'signup_completed'             // KR-P1
  | 'demo_requested'
  // Activation
  | 'property_created'             // KR-P4
  | 'tenant_created'               // KR-P4
  | 'lease_created'                // KR-P4
  | 'first_lease_created'          // KR-P3 — 48h activation milestone
  | 'onboarding_completed'         // KR-P4
  // Revenue
  | 'trial_started'
  | 'trial_to_paid'                // KR-B3
  | 'subscription_cancelled'      // KR-B5 churn
  | 'mrr_changed'
  // Core Web Vitals pings (also sent to Vercel Analytics in web-vitals.ts)
  | 'cwv_lcp'
  | 'cwv_cls'
  | 'cwv_inp'
  | 'cwv_fcp'
  | 'cwv_ttfb';

export interface AnalyticsProperties {
  // Common
  path?: string;
  userId?: string;
  email?: string;
  sessionId?: string;
  // Signup
  signupMethod?: 'email' | 'google' | ' invite';
  // Onboarding
  propertyId?: string;
  propertyType?: string;
  tenantId?: string;
  leaseId?: string;
  // Revenue
  plan?: string;
  mrrCents?: number;
  currency?: string;
  // CWV
  cwvValue?: number;
  cwvRating?: 'good' | 'needs-improvement' | 'poor';
  cwvId?: string;
  // Misc
  [key: string]: string | number | boolean | undefined;
}

// ──────────────────────────────────────────────────────────────────────────────
// Track a single event
// ──────────────────────────────────────────────────────────────────────────────

export async function trackEvent(
  event: AnalyticsEvent,
  properties: AnalyticsProperties = {}
): Promise<void> {
  const posthog = getPostHog();

  try {
    // Always capture in PostHog (server-side)
    if (event !== 'page_view') {
      // page_view is handled by /api/analytics/page-view
      await posthog.capture(event, {
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Analytics] ${event}`, properties);
    }
  } catch (err) {
    // Never throw — analytics must never break the app
    console.error(`[Analytics] Failed to track ${event}:`, err);
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Convenience helpers
// ──────────────────────────────────────────────────────────────────────────────

export async function trackSignup(
  userId: string,
  email: string,
  method: 'email' | 'google' = 'email'
): Promise<void> {
  const posthog = getPostHog();
  try {
    // Identify the new user immediately
    await posthog.identify(userId, { email, signupMethod: method });
    await posthog.capture('signup_completed', { userId, email, method });
  } catch {}
}

export async function trackFirstLeaseCreated(props: {
  userId: string;
  email: string;
  leaseId: string;
  propertyId: string;
}): Promise<void> {
  const posthog = getPostHog();
  try {
    await posthog.capture('first_lease_created', props);
    await posthog.capture('onboarding_completed', props);
    // Mark user as activated
    await posthog.group('user_activated', { userId: props.userId });
  } catch {}
}

export async function trackTrialToPaid(
  userId: string,
  email: string,
  plan: string,
  mrrCents: number
): Promise<void> {
  const posthog = getPostHog();
  try {
    await posthog.capture('trial_to_paid', { userId, email, plan, mrrCents });
  } catch {}
}
