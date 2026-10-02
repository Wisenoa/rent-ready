import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Rent period generation had no caller.
 *
 * `generateRentPeriodsForAllLeases` existed and was correct, but nothing
 * invoked it: periods were only materialised when a lease was created or
 * amended. A lease created in March therefore had one PENDING period, and in
 * April the dashboard, the payments page and the arrears totals had nothing left
 * to show. The loop was silently broken from the second month.
 *
 * Two triggers now exist — a cron route and a read-path backstop — and both go
 * through the same domain function. What is worth pinning here is:
 *
 *   1. the cron route is not an open door (no secret, wrong secret -> refused)
 *   2. the backstop is actually wired into the two pages a landlord opens daily
 *   3. no second implementation of period generation crept in
 *
 * The route itself is not imported: it pulls in `@/lib/prisma`, which needs a
 * live database at import time, and the guard being tested is a pure function of
 * `process.env.CRON_SECRET` plus a header. Reading the source pins the same
 * invariant without a database, matching kpi-digest-honesty.test.ts.
 */

const route = readFileSync(
  join(process.cwd(), "src/app/api/cron/rent-periods/route.ts"),
  "utf8"
);
const dashboard = readFileSync(
  join(process.cwd(), "src/app/(dashboard)/dashboard/page.tsx"),
  "utf8"
);
const billing = readFileSync(
  join(process.cwd(), "src/app/(dashboard)/billing/page.tsx"),
  "utf8"
);

describe("rent periods cron is authenticated", () => {
  it("refuses to run at all when CRON_SECRET is unset", () => {
    expect(route).toMatch(/const cronSecret = process\.env\.CRON_SECRET/);
    expect(route).toMatch(/if \(!cronSecret\) \{/);
    // An unset secret must never degrade into "no auth required".
    expect(route).toMatch(/\{ status: 500 \}/);
  });

  it("rejects a missing or wrong bearer token before any generation", () => {
    expect(route).toMatch(/authHeader !== `Bearer \$\{cronSecret\}`/);
    expect(route).toMatch(/\{ error: "Unauthorized" \}, \{ status: 401 \}/);

    // The check must come before the generator is called, otherwise the endpoint
    // does the work and only then refuses.
    const guardIndex = route.indexOf("authHeader !== `Bearer");
    const callIndex = route.indexOf("generateRentPeriodsForAllLeases(userId)");
    expect(guardIndex).toBeGreaterThan(-1);
    expect(callIndex).toBeGreaterThan(guardIndex);
  });

  it("is scheduled daily by vercel.json", () => {
    const vercel = JSON.parse(
      readFileSync(join(process.cwd(), "vercel.json"), "utf8")
    );
    const entry = vercel.crons.find(
      (c: { path: string }) => c.path === "/api/cron/rent-periods"
    );
    expect(entry, "no vercel.json cron targets /api/cron/rent-periods").toBeDefined();
    // Five fields, daily. Vercel sends Authorization: Bearer $CRON_SECRET when the
    // env var is set, which is exactly what the route requires above.
    expect(entry.schedule.trim().split(/\s+/)).toHaveLength(5);
  });
});

describe("rent periods are backfilled on the pages a landlord reads", () => {
  it("runs before the dashboard reads its stats", () => {
    expect(dashboard).toContain("await ensureRentPeriods(userId)");
    expect(dashboard.indexOf("await ensureRentPeriods(userId)")).toBeLessThan(
      dashboard.indexOf("getDashboardStats(userId)")
    );
  });

  it("runs before the payments page queries its transactions", () => {
    expect(billing).toContain("await ensureRentPeriods(userId)");
    expect(billing.indexOf("await ensureRentPeriods(userId)")).toBeLessThan(
      billing.indexOf("prisma.transaction.findMany")
    );
  });

  it("never lets a failed backfill break the page", () => {
    const backstop = readFileSync(
      join(process.cwd(), "src/lib/queries/rent-periods.ts"),
      "utf8"
    );
    expect(backstop).toMatch(/try \{[\s\S]*\} catch \(error\)/);
    expect(backstop).toContain("console.error(");
  });
});

describe("generation has a single implementation", () => {
  it("only generate-rent-periods.ts writes periods", () => {
    const callers = [
      dashboard,
      billing,
      route,
      readFileSync(
        join(process.cwd(), "src/lib/queries/rent-periods.ts"),
        "utf8"
      ),
    ];
    for (const source of callers) {
      // Every caller must delegate to the domain function, never enumerate
      // months itself.
      expect(source).not.toMatch(/enumerateRentPeriods/);
      expect(source).not.toMatch(/periodStart:\s*new Date\(/);
    }
  });
});
