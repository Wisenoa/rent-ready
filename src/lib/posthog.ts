/**
 * PostHog server-side client for product analytics.
 *
 * Used to track: signup rates, onboarding completion, first-lease creation,
 * page views, feature usage, and custom KPI events.
 *
 * Env vars required (add to .env):
 *   POSTHOG_API_KEY=<your-postHog-project-api-key>
 *   POSTHOG_HOST=https://app.posthog.com
 *   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
 *   NEXT_PUBLIC_POSTHOG_KEY=<your-postHog-project-client-api-key>
 */

import { PostHog } from 'postHog-node';

let _posthog: PostHog | null = null;

export function getPostHog(): PostHog {
  if (!_posthog) {
    const apiKey = process.env.POSTHOG_API_KEY;
    const host = process.env.POSTHOG_HOST ?? 'https://app.posthog.com';

    if (!apiKey) {
      // Return a no-op client when not configured (dev/pre-launch)
      console.warn('[PostHog] POSTHOG_API_KEY not set — analytics disabled');
      return {
        capture: () => {},
        identify: () => {},
        group: () => {},
        shutdown: async () => {},
      } as unknown as PostHog;
    }

    _posthog = new PostHog(apiKey, {
      host,
      flushAt: 20,
      flushInterval: 10000,
    });
  }
  return _posthog;
}

/**
 * Key events to track (KPI alignment with Q2 OKR):
 *
 * KR-P1  signup_completed         — visitor → signup conversion
 * KR-P3  first_lease_created      — user activated within 48h
 * KR-P4  onboarding_completed     — property + tenant + lease in one session
 * KR-P4  property_created
 * KR-P4  tenant_created
 * KR-P4  lease_created
 * KR-B3  trial_to_paid            — conversion event
 * KR-S1  page_view               — tracked via /api/analytics/page-view
 */
