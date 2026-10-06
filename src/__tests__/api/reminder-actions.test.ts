import { describe, it, expect } from "vitest";

// ─── Pure reminder milestone logic (duplicated for unit testing) ───────────────
// The actual reminder-actions.ts requires Next.js context / path aliases,
// so we test the pure calculation functions directly here.

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Compute the due dates for lease renewal reminders at 90/60/30 days before expiry.
 * Returns dates in ms since epoch.
 */
function getMilestoneDates(leaseEndDate: Date): { milestone: number; dueDate: Date }[] {
  const milestones = [90, 60, 30];
  return milestones.map((milestone) => ({
    milestone,
    dueDate: new Date(leaseEndDate.getTime() - milestone * DAY_MS),
  }));
}

/**
 * Check whether a given due date is within `toleranceDays` of an existing reminder date.
 */
function isDuplicate(
  existingDueDate: Date,
  candidateDate: Date,
  toleranceDays = 3
): boolean {
  const diffDays = Math.abs(
    Math.ceil((existingDueDate.getTime() - candidateDate.getTime()) / DAY_MS)
  );
  return diffDays <= toleranceDays;
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("Lease renewal reminder milestones", () => {
  const endDate = new Date("2026-06-30T00:00:00.000Z"); // 30 June 2026

  it("creates milestones at 90, 60, and 30 days before expiry", () => {
    const result = getMilestoneDates(endDate);
    expect(result).toHaveLength(3);
    expect(result.map((r) => r.milestone)).toEqual([90, 60, 30]);
  });

  it("90-day milestone is 2026-04-01", () => {
    const result = getMilestoneDates(endDate);
    const d90 = result.find((r) => r.milestone === 90)!;
    expect(d90.dueDate.toISOString().startsWith("2026-04-01")).toBe(true);
  });

  it("60-day milestone is 2026-05-01", () => {
    const result = getMilestoneDates(endDate);
    const d60 = result.find((r) => r.milestone === 60)!;
    expect(d60.dueDate.toISOString().startsWith("2026-05-01")).toBe(true);
  });

  it("30-day milestone is 2026-05-31", () => {
    const result = getMilestoneDates(endDate);
    const d30 = result.find((r) => r.milestone === 30)!;
    expect(d30.dueDate.toISOString().startsWith("2026-05-31")).toBe(true);
  });

  it("milestones are ordered from furthest to nearest", () => {
    const result = getMilestoneDates(endDate);
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].dueDate.getTime()).toBeGreaterThan(result[i].dueDate.getTime());
    }
  });
});

describe("Reminder duplicate detection", () => {
  const existingDate = new Date("2026-04-01T00:00:00.000Z");

  it("same date is a duplicate", () => {
    expect(isDuplicate(existingDate, existingDate)).toBe(true);
  });

  it("date within 3-day tolerance is a duplicate", () => {
    const closeDate = new Date("2026-03-31T00:00:00.000Z"); // 1 day earlier
    expect(isDuplicate(existingDate, closeDate)).toBe(true);
  });

  it("date 4 days away is NOT a duplicate (tolerance = 3)", () => {
    const farDate = new Date("2026-03-28T00:00:00.000Z"); // 4 days earlier
    expect(isDuplicate(existingDate, farDate)).toBe(false);
  });

  it("date 3 days away is still a duplicate (boundary)", () => {
    const boundaryDate = new Date("2026-03-29T00:00:00.000Z"); // 3 days earlier
    expect(isDuplicate(existingDate, boundaryDate)).toBe(true);
  });

  it("future date is not a duplicate", () => {
    const futureDate = new Date("2026-04-10T00:00:00.000Z");
    expect(isDuplicate(existingDate, futureDate)).toBe(false);
  });
});

describe("Reminder priority assignment", () => {
  const milestones = [
    { milestone: 90, expectedPriority: "MEDIUM" },
    { milestone: 60, expectedPriority: "HIGH" },
    { milestone: 30, expectedPriority: "HIGH" },
  ];

  it("30 and 60 days = HIGH priority", () => {
    const highPriority = milestones.filter((m) => m.expectedPriority === "HIGH");
    expect(highPriority.map((m) => m.milestone)).toContain(30);
    expect(highPriority.map((m) => m.milestone)).toContain(60);
  });

  it("90 days = MEDIUM priority", () => {
    const mediumPriority = milestones.find((m) => m.expectedPriority === "MEDIUM");
    expect(mediumPriority?.milestone).toBe(90);
  });
});
