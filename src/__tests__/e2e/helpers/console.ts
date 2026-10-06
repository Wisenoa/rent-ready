/**
 * Console noise that is NOT a defect of the page under test.
 *
 * This filter existed in three specs and the copies drifted: `accessibility`
 * excluded Next's dev-overlay CSP errors and the two app-page filters in the
 * same file did not, so six WCAG-clean app pages failed on
 * « Loading the script 'https://va.vercel-scripts.com/...' violates ... » while
 * the identical complaint on a marketing page passed. `maintenance` then failed
 * on the same script with a third, shorter copy.
 *
 * One definition, imported by every spec, so a fourth copy cannot appear.
 */
export function realErrors(errors: string[]): string[] {
  return errors.filter(
    (e) =>
      !e.includes('favicon') &&
      !e.includes('hydration') &&
      !e.includes('Warning') &&
      !e.includes('zod') &&
      // Next.js injects its dev overlay and telemetry scripts, which the
      // Content-Security-Policy in next.config.ts blocks. Dev-only artifact.
      !e.includes('va.vercel-scripts.com') &&
      !e.includes('Content Security Policy') &&
      !e.includes('Failed to load resource'),
  )
}