/**
 * `revisionDate` is read forward by four consumers and written by this rule.
 *
 * The lease page prints it as « Date de révision IRL », the revision page counts
 * the days remaining until it, `/api/leases/[id]/revision-preview` reports
 * `daysUntilRevision`, and the tenant portal calls it `renewalDate`. Every one of
 * them treats it as a date in the FUTURE.
 *
 * It used to be `new Date()` — the moment the landlord clicked « appliquer » — so
 * `daysUntilRevision` was negative on every lease that had ever been revised. And
 * `/api/cron/revision-check` selects `revisionDate >= now`, so with the only
 * writer storing a date already in the past, that cron could not match a single
 * row in the entire database. A reminder that cannot fire reads in the code as an
 * automation that exists.
 *
 * These are pure date assertions, so they are unit tests: there is nothing here a
 * database would decide.
 */
import { describe, it, expect } from "vitest";
import { isRevisable, nextRevisionDate } from "@/lib/domain/lease-revision";

describe("the next revision date is in the future", () => {
  it("is the anniversary of the lease start, a year out", () => {
    const date = nextRevisionDate(
      new Date("2026-03-10T00:00:00.000Z"),
      new Date("2026-03-10T00:00:00.000Z")
    );

    expect(date?.toISOString()).toBe("2027-03-10T00:00:00.000Z");
  });

  it("never returns today, even when today IS the anniversary", () => {
    // The case the old `new Date()` got wrong. Applying a revision on its own date
    // has just consumed that anniversary, so the next one is twelve months out;
    // returning today would leave the lease due again immediately, and the cron
    // would notify about a revision the landlord had just applied.
    const anniversary = new Date("2026-03-10T00:00:00.000Z");
    const date = nextRevisionDate(anniversary, new Date("2026-03-10T18:00:00.000Z"));

    expect(date?.toISOString()).toBe("2027-03-10T00:00:00.000Z");
  });

  it("walks forward for a lease whose first anniversary is already past", () => {
    // Signed in June 2023 and read in February 2026: the 2024, 2025 and 2026-01-01
    // anniversaries are all behind us, and the June one is still ahead. The answer
    // is that June, not a date derived by adding years to the start.
    const date = nextRevisionDate(
      new Date("2023-06-01T00:00:00.000Z"),
      new Date("2026-02-10T00:00:00.000Z")
    );

    expect(date?.toISOString()).toBe("2026-06-01T00:00:00.000Z");
  });

  it("does not drift a day earlier every leap year", () => {
    // The reason this is calendar arithmetic and not 365-day arithmetic. A lease
    // signed 1 June 2020 has anniversaries on 1 June every year; adding 365 days
    // three times lands on 31 May, so the revision would creep a day earlier with
    // each leap year and eventually cross into the month before.
    for (const from of [
      new Date("2026-01-01T00:00:00.000Z"),
      new Date("2027-01-01T00:00:00.000Z"),
      new Date("2028-01-01T00:00:00.000Z"),
    ]) {
      expect(nextRevisionDate(new Date("2020-06-01T00:00:00.000Z"), from)?.getUTCDate()).toBe(1);
      expect(nextRevisionDate(new Date("2020-06-01T00:00:00.000Z"), from)?.getUTCMonth()).toBe(5);
    }
  });

  it("picks the very next anniversary when several have passed", () => {
    const date = nextRevisionDate(
      new Date("2020-01-15T00:00:00.000Z"),
      new Date("2026-09-20T00:00:00.000Z")
    );

    expect(date?.toISOString()).toBe("2027-01-15T00:00:00.000Z");
  });

  it("keeps the day of the month across a leap day", () => {
    // A lease starting 29 February has no 29 February to land on in a common
    // year. Anniversary arithmetic on elapsed time carries it to 1 March, which is
    // the defensible reading — and it does not drift earlier every four years the
    // way clamping to the 28th would.
    const date = nextRevisionDate(
      new Date("2024-02-29T00:00:00.000Z"),
      new Date("2025-01-01T00:00:00.000Z")
    );

    expect(date?.toISOString()).toBe("2025-03-01T00:00:00.000Z");
  });

  it("has no date once the lease has run out", () => {
    // A three-year lease read six months after it ended has no revision left to
    // apply. Returning a date would have the cron notify about revising a lease
    // that no longer exists.
    const date = nextRevisionDate(
      new Date("2023-01-01T00:00:00.000Z"),
      new Date("2026-07-01T00:00:00.000Z"),
      new Date("2025-12-31T00:00:00.000Z")
    );

    expect(date).toBeNull();
  });

  it("still has a date when the anniversary falls before the endDate", () => {
    const date = nextRevisionDate(
      new Date("2023-01-01T00:00:00.000Z"),
      new Date("2026-01-02T00:00:00.000Z"),
      new Date("2027-06-30T00:00:00.000Z")
    );

    expect(date?.toISOString()).toBe("2027-01-01T00:00:00.000Z");
  });
});

describe("which leases carry a revision at all", () => {
  it("needs an IRL reference recorded at signature", () => {
    // The revision is a variation on that reference, so without one there is
    // nothing to vary from — and leaving `revisionDate` null is what keeps the
    // revision cron from reminding a landlord about a lease it cannot revise.
    expect(isRevisable({ irlReferenceQuarter: null, leaseType: "UNFURNISHED" })).toBe(false);
    expect(isRevisable({ irlReferenceQuarter: "", leaseType: "UNFURNISHED" })).toBe(false);
    expect(isRevisable({ irlReferenceQuarter: "T4-2025", leaseType: "UNFURNISHED" })).toBe(true);
  });

  it("excludes a furnished lease, which has no IRL", () => {
    expect(isRevisable({ irlReferenceQuarter: "T4-2025", leaseType: "FURNISHED" })).toBe(false);
    expect(isRevisable({ irlReferenceQuarter: "T4-2025", leaseType: "COMMERCIAL" })).toBe(true);
  });
});