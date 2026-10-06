import { test as base, expect } from '@playwright/test'

/**
 * The key cookie-consent.tsx reads before showing its banner.
 * Kept in sync with src/components/cookie-consent.tsx — if that name changes,
 * this file must change with it, otherwise the banner silently comes back.
 */
const COOKIE_CONSENT_KEY = 'rentready_cookie_consent'

/**
 * A test user who has already answered the cookie banner.
 *
 * The banner mounts, then waits DELAY_MS (1500ms) before it appears, so a test
 * that merely checks "is it visible?" is racing a timer. On a dev server that
 * recompiles a route, the check runs on page N (banner not yet mounted) and the
 * banner appears on page N+1, on top of whatever the test is clicking next.
 * That is how helpers/auth.ts came to fail ~33% of the time with
 * "Refuser ... intercepts pointer events" on the « Ajouter » button.
 *
 * Seeding localStorage through an init script makes the decision deterministic:
 * it is set before the first navigation, so the banner never mounts at all.
 * This is not a workaround for a product bug — a real returning landlord has
 * stored a decision too — and it removes a timer from every E2E test.
 *
 * Every spec imports `test` from here rather than from @playwright/test, so the
 * seeding is applied by construction instead of by remembering to call it.
 */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript((key: string) => {
      window.localStorage.setItem(key, 'accepted')
    }, COOKIE_CONSENT_KEY)

    // `use` here is Playwright's fixture callback, not React's use hook.
    // react-hooks/rules-of-hooks cannot tell them apart and flags every
    // Playwright fixture; the disable is scoped to this single line.
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(page)
  },
})

export { expect }
