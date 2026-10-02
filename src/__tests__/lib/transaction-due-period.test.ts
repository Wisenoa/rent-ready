/**
 * The payment dialog posts a rent period id instead of typed dates.
 *
 * That id arrives from the browser, so it is untrusted input like any other. If
 * it were trusted, a hand-crafted POST could settle a rent period belonging to
 * another landlord, at dates the attacker chose, and produce a quittance for it.
 *
 * Two things are pinned here:
 *   - `resolveDuePeriod` scopes the lookup to the authenticated landlord AND to
 *     the lease in the same submission, and only returns an unpaid period;
 *   - `createTransaction` takes the period dates from that row rather than from
 *     the form, and refuses rather than falling back when the row is gone.
 *
 * The action itself is a `.tsx` module: `sendPaymentReminder` in the same file
 * renders JSX, which the vitest import analyser cannot parse (the same
 * constraint `profile-address.test.ts` documents). So the database contract is
 * asserted against `resolveDuePeriod` — the whole of the untrusted-id handling —
 * and the action is checked by reading its source.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: { transaction: { findFirst: vi.fn() } },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import { resolveDuePeriod } from "@/lib/queries/due-periods";

const ROW = {
  id: "period-1",
  periodStart: new Date("2026-10-01T00:00:00.000Z"),
  periodEnd: new Date("2026-10-31T00:00:00.000Z"),
  dueDate: new Date("2026-10-03T00:00:00.000Z"),
};

describe("resolveDuePeriod", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.transaction.findFirst.mockResolvedValue(ROW);
  });

  it("scopes the lookup to the owner and the lease together", async () => {
    await resolveDuePeriod("landlord-1", "lease-1", "period-1");

    // Ownership is in the query, not a check afterwards: a findUnique followed by
    // an `if` is one forgotten `if` away from a cross-tenant read.
    expect(prismaMock.transaction.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "period-1", leaseId: "lease-1", userId: "landlord-1", paidAt: null },
      })
    );
  });

  it("returns the period dates so they can replace whatever the form claimed", async () => {
    const period = await resolveDuePeriod("landlord-1", "lease-1", "period-1");
    expect(period?.periodStart).toEqual(new Date("2026-10-01T00:00:00.000Z"));
  });

  it("returns null for a period that is not this landlord's, or already paid", async () => {
    prismaMock.transaction.findFirst.mockResolvedValue(null);
    expect(await resolveDuePeriod("attacker", "lease-1", "victim-period")).toBeNull();
  });
});

describe("createTransaction source", () => {
  const source = readFileSync(
    join(process.cwd(), "src/lib/actions/transaction-actions.tsx"),
    "utf8"
  );

  it("resolves the posted period id through the scoped lookup", () => {
    expect(source).toContain("resolveDuePeriod(userId, lease.id, duePeriodId)");
  });

  it("overwrites the posted dates with the period's own dates", () => {
    // Otherwise a payload naming October's id with September's dates books the
    // payment on the wrong month — the exact defect this change removes.
    expect(source).toContain("periodStart = period.periodStart");
    expect(source).toContain("periodEnd = period.periodEnd");
    expect(source).toContain("dueDate = period.dueDate");
  });

  it("refuses instead of falling back when the period no longer exists", () => {
    const guard = source.indexOf("if (!period) {");
    expect(guard).toBeGreaterThan(-1);
    // A fallback here would let a rejected id post the raw form dates instead.
    expect(source.slice(guard, guard + 260)).toContain("success: false");
  });

  it("settles the chosen row and never falls through to a second insert", () => {
    // The insert path would book the same month twice if a rejected or
    // already-settled period simply fell through.
    expect(source).toContain("{ id: duePeriodId }");
    expect(source).toMatch(
      /if \(duePeriodId\) \{\s*return \{\s*success: false/
    );
  });
});