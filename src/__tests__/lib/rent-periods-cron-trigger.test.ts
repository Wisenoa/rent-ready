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
 * The cron route IS executed below, with the generator stubbed. It used not to be
 * importable because `@/lib/prisma` was reached at module scope; the route now
 * imports it dynamically, and the vitest React plugin makes the module loadable
 * regardless. The assertions that mattered — that an unset or wrong secret does
 * the work anyway — are answered by the response and by whether the generator was
 * called, not by where a string sits in the file. The previous version of this
 * header claimed the route could not be imported; that is no longer true, and it
 * has been corrected rather than left to mislead the next agent.
 *
 * What remains a source check, and why, is stated at each block.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { NextRequest } from "next/server";

const { generateMock, leaseCountMock } = vi.hoisted(() => ({
  generateMock: vi.fn(async (_userId?: string) => ({ leases: 2, created: 3 })),
  leaseCountMock: vi.fn(async () => 4),
}));

vi.mock("@/lib/domain/generate-rent-periods", () => ({
  generateRentPeriodsForAllLeases: generateMock,
}));
// The dry-run branch reaches prisma through a dynamic import, which vi.mock
// intercepts like any other. Only `lease.count` is called.
vi.mock("@/lib/prisma", () => ({ prisma: { lease: { count: leaseCountMock } } }));

import { GET } from "@/app/api/cron/rent-periods/route";

const SECRET = "cron-secret-for-tests";
const original = process.env.CRON_SECRET;

function cronRequest(token?: string): NextRequest {
  return new Request("https://rent-ready.test/api/cron/rent-periods", {
    headers: token ? { authorization: `Bearer ${token}` } : {},
  }) as unknown as NextRequest;
}

beforeEach(() => {
  vi.clearAllMocks();
  generateMock.mockResolvedValue({ leases: 2, created: 3 });
  process.env.CRON_SECRET = SECRET;
});

afterEach(() => {
  if (original === undefined) delete process.env.CRON_SECRET;
  else process.env.CRON_SECRET = original;
});

describe("the cron endpoint is a closed door", () => {
  it("does nothing at all when CRON_SECRET is unset", async () => {
    // An unset secret must never degrade into "no auth required".
    delete process.env.CRON_SECRET;

    const res = await GET(cronRequest());

    expect(res.status).toBe(500);
    expect(generateMock).not.toHaveBeenCalled();
  });

  it("does nothing at all when CRON_SECRET is unset, even with a bearer token", async () => {
    // The failure this prevents: a deployment that forgets the env var accepts
    // every caller, because there is no secret to compare against.
    delete process.env.CRON_SECRET;

    const res = await GET(cronRequest("anything"));

    expect(res.status).toBe(500);
    expect(generateMock).not.toHaveBeenCalled();
  });

  it("refuses a missing bearer token before generating anything", async () => {
    const res = await GET(cronRequest());

    expect(res.status).toBe(401);
    // The decisive assertion: the work is not done and only then refused.
    expect(generateMock).not.toHaveBeenCalled();
  });

  it("refuses a wrong bearer token before generating anything", async () => {
    const res = await GET(cronRequest("not-the-secret"));

    expect(res.status).toBe(401);
    expect(generateMock).not.toHaveBeenCalled();
  });

  it("refuses a token that merely extends the secret", async () => {
    const res = await GET(cronRequest(`${SECRET}-extra`));

    expect(res.status).toBe(401);
    expect(generateMock).not.toHaveBeenCalled();
  });
});

describe("the cron endpoint with the right token", () => {
  it("generates and reports what it did", async () => {
    const res = await GET(cronRequest(SECRET));

    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ success: true, leases: 2, created: 3 });
    expect(generateMock).toHaveBeenCalledTimes(1);
  });

  it("reports 'created' as null on a dry run, rather than counting as created", async () => {
    // Counting what it would look at is not measuring "created"; a dry run that
    // reported 0 created would read as "nothing was missing" (AGENTS.md §37).
    const res = await GET(
      new Request("https://rent-ready.test/api/cron/rent-periods?dryRun=true", {
        headers: { authorization: `Bearer ${SECRET}` },
      }) as unknown as NextRequest
    );

    expect(await res.json()).toMatchObject({ dryRun: true, created: null });
  });

  it("can be restricted to one landlord, which is a debugging aid not a bypass", async () => {
    await GET(
      new Request("https://rent-ready.test/api/cron/rent-periods?userId=user-7", {
        headers: { authorization: `Bearer ${SECRET}` },
      }) as unknown as NextRequest
    );

    expect(generateMock).toHaveBeenCalledWith("user-7");
  });

  it("reports a failure instead of pretending the periods exist", async () => {
    generateMock.mockRejectedValue(new Error("database is down"));

    const res = await GET(cronRequest(SECRET));

    expect(res.status).toBe(500);
  });
});

describe("scheduling — why this stays a source check", () => {
  const readCrons = async () => {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    return JSON.parse(readFileSync(join(process.cwd(), "vercel.json"), "utf8")).crons as Array<{
      path: string;
      schedule: string;
    }>;
  };

  it("is scheduled daily by vercel.json", async () => {
    // This one is not about code behaviour at all: it is about a deploy
    // configuration file, which is data. No execution of the route can show
    // whether Vercel will call it, and the schedule string only exists in
    // vercel.json. Vercel sends Authorization: Bearer *** when CRON_SECRET is
    // set, which is what the route requires above.
    const entry = (await readCrons()).find((c) => c.path === "/api/cron/rent-periods");

    expect(entry, "no vercel.json cron targets /api/cron/rent-periods").toBeDefined();
    expect(entry?.schedule.trim().split(/\s+/)).toHaveLength(5);
  });

  it("also schedules the revision reminder, which used to exist but never fire", async () => {
    // `/api/cron/revision-check` was never in vercel.json, AND its filter
    // (`revisionDate >= now`) could not match anything because the only writer,
    // `applyRentRevision`, stored `new Date()` — the moment the button was clicked,
    // always in the past. Two independent reasons it was dead code that read in
    // the source as an automation. Both are fixed: it is scheduled here, and
    // `revisionDate` is now the next anniversary (see `lease-revision.test.ts`).
    const entry = (await readCrons()).find((c) => c.path === "/api/cron/revision-check");

    expect(entry, "no vercel.json cron targets /api/cron/revision-check").toBeDefined();
    expect(entry?.schedule.trim().split(/\s+/)).toHaveLength(5);
  });

  it("schedules nothing else, so a removed cron cannot linger", async () => {
    // `/api/cron/kpi-digest` was the third orphan: never scheduled, no caller,
    // and most of what it emailed leadership was not measurable in this
    // deployment. It was deleted rather than wired up, so it must not reappear in
    // the schedule either.
    const paths = (await readCrons()).map((c) => c.path);

    expect(paths).toContain("/api/cron/rent-periods");
    expect(paths).toContain("/api/cron/revision-check");
    expect(paths).toHaveLength(2);
  });
});

describe("the read-path backstop is wired where a landlord reads", () => {
  // These stay on the source, and the reason is specific: the claim is about
  // ORDER WITHIN A SERVER COMPONENT — that `ensureRentPeriods` is awaited before
  // the query that depends on it. The dashboard and the billing page are async
  // server components with no entry point a test can call to observe sequencing;
  // the only difference between "backfill first" and "query first" is the order of
  // two statements in one function body. Rendering them needs a DOM and a
  // database, and would assert the rendered numbers rather than the order that
  // causes them.
  //
  // What these do NOT claim: that the backstop is correct. That is covered by
  // executing `ensureRentPeriods` itself.
  async function sources() {
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const at = (p: string) => readFileSync(join(process.cwd(), p), "utf8");
    return {
      dashboard: at("src/app/(dashboard)/dashboard/page.tsx"),
      billing: at("src/app/(dashboard)/billing/page.tsx"),
      backstop: at("src/lib/queries/rent-periods.ts"),
      route: at("src/app/api/cron/rent-periods/route.ts"),
    };
  }

  it("runs before the dashboard reads its stats", async () => {
    const { dashboard } = await sources();
    expect(dashboard).toContain("await ensureRentPeriods(userId)");
    expect(dashboard.indexOf("await ensureRentPeriods(userId)")).toBeLessThan(
      dashboard.indexOf("getDashboardStats(userId)")
    );
  });

  it("runs before the payments page queries its transactions", async () => {
    const { billing } = await sources();
    expect(billing).toContain("await ensureRentPeriods(userId)");
    expect(billing.indexOf("await ensureRentPeriods(userId)")).toBeLessThan(
      billing.indexOf("prisma.transaction.findMany")
    );
  });

  it("never lets a failed backfill break the page", async () => {
    // Product honesty: a landlord must still see their (possibly stale) data if
    // generation fails, rather than a 500.
    const { backstop } = await sources();
    expect(backstop).toMatch(/try \{[\s\S]*\} catch \(error\)/);
    expect(backstop).toContain("console.error(");
  });

  it("generation has a single implementation", async () => {
    // The failure this prevents: a caller enumerating months itself, which is how
    // two implementations drift and one of them gets the rules wrong. That is a
    // claim about what does NOT appear in four files, so there is nothing to call.
    const { dashboard, billing, route, backstop } = await sources();
    for (const source of [dashboard, billing, route, backstop]) {
      expect(source).not.toMatch(/enumerateRentPeriods/);
      expect(source).not.toMatch(/periodStart:\s*new Date\(/);
    }
  });
});
