/**
 * When an IRL rent revision may be applied — the date question, not the
 * arithmetic (the arithmetic lives in `irl-calculator.ts` and is tested there).
 *
 * `Lease.revisionDate` is documented in the schema as « Date anniversaire de
 * révision » and every consumer reads it that way: the lease page prints it as
 * "Date de révision IRL", the revision page counts the days remaining until it,
 * the preview route reports `daysUntilRevision`, and the tenant portal calls it
 * `renewalDate`. All four are forward-looking.
 *
 * `applyRentRevision` wrote `new Date()` into it — the moment the button was
 * clicked, always in the past. So `daysUntilRevision` was negative on every
 * lease, and `/api/cron/revision-check`, which selects `revisionDate >= now`,
 * could not match a single row: the only writer stored a date that had already
 * passed by the time the cron read it. A reminder that can never fire is worse
 * than no reminder, because it reads in the code as an automation that exists.
 *
 * The rule is here, once, and every writer goes through it.
 */

/**
 * The `startDate` anniversary `years` years later, on the CALENDAR.
 *
 * Adding 365 days instead would drift: three anniversaries of a March lease would
 * land on 31 May rather than 1 June, because each leap year eats a day that the
 * next addition never gives back. A revision date that creeps a day earlier every
 * year is not an anniversary.
 *
 * Day 29/30/31 of a month that does not exist in the target year rolls to the
 * first of the following month: a lease signed on 31 January revises on 1 March
 * in a common year, since there is no 31 February. Clamping to the last day of the
 * month instead (28 February) would move the date backwards every year.
 */
function anniversary(startDate: Date, years: number): Date {
  const year = startDate.getUTCFullYear() + years;
  const month = startDate.getUTCMonth();
  const day = startDate.getUTCDate();

  // Date.UTC normalises an out-of-range day by rolling into the next month, which
  // is exactly the 29/30/31 -> 1st-of-next-month rule above.
  return new Date(Date.UTC(year, month, day));
}

export function nextRevisionDate(
  startDate: Date,
  from: Date,
  endDate?: Date | null
): Date | null {
  // The first anniversary can already be behind us — a lease signed three years
  // ago still has revisions ahead of it, so walk forward year by year rather than
  // giving up. Bounded by the lease's own life: no lease is revised 200 years on.
  for (let years = 1; years <= 200; years += 1) {
    const candidate = anniversary(startDate, years);
    if (candidate.getTime() <= from.getTime()) continue;
    // Past the end of the term: there is no revision left to apply to a lease
    // that has run out.
    if (endDate && candidate.getTime() > endDate.getTime()) return null;
    return candidate;
  }
  return null;
}

/**
 * Whether a lease can be revised at all.
 *
 * Only leases that recorded an IRL reference at signature carry one: the
 * revision is a variation on that reference, so without it there is nothing to
 * vary from. FURNISHED leases are excluded for the same reason — no IRL.
 */
export function isRevisable(lease: {
  irlReferenceQuarter?: string | null;
  leaseType?: string | null;
}): boolean {
  if (!lease.irlReferenceQuarter) return false;
  return lease.leaseType !== "FURNISHED";
}