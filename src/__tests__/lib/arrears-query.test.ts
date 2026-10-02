/**
 * The dashboard's « À traiter » section.
 *
 * The claim under test is that a landlord is TOLD about unpaid rent, and that
 * the number they are told is the same number every other screen shows.
 *
 * Both were false before this card:
 *
 *   - `getDashboardStats` computed `revenue.late` on every dashboard render and
 *     the page never displayed it. A landlord with two months overdue read four
 *     KPIs of totals and no exception.
 *   - `getLeaseArrears` existed in `generate-rent-periods.ts` and had no caller:
 *     the view that was needed was written and left unused.
 *
 * The regression that matters most is the SECOND one. Two screens computing
 * "what is overdue" with two different predicates is how a product ends up
 * telling a landlord "1 impayé" on the dashboard and showing three in the table.
 * So these tests run the real `getDashboardStats` over the same fake database and
 * compare, rather than hardcoding a total that would only prove addition works.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import Decimal from "decimal.js";

const { prismaMock } = vi.hoisted(() => {
  /**
   * `getDashboardStats` issues eighteen queries in one `Promise.all`, so the fake
   * cannot be a queue of canned answers: it has to answer by WHAT is being
   * asked. Arrears are the only thing under test, so the transaction aggregate is
   * real — it applies the `where` it is given, as Prisma would — and every other
   * model returns empty.
   *
   * `decimal.js` is imported lazily inside the aggregate: `vi.hoisted` runs
   * before the module's imports, so `Decimal` is not in scope here.
   */
  const rows: Array<Record<string, unknown>> = [];

  const matches = (row: Record<string, unknown>, where: Record<string, unknown>): boolean => {
    for (const [key, filter] of Object.entries(where)) {
      if (key === "userId" && row.userId !== filter) return false;
      if (key === "leaseId") {
        // `{ in: [...] }` is how `getRentExceptions` scopes the receipts query.
        // Without it the fake matched nothing and every partial month reported
        // 0.00 received.
        const list =
          filter && typeof filter === "object"
            ? (filter as { in?: string[] }).in
            : undefined;
        if (list && !list.includes(row.leaseId as string)) return false;
        if (!list && row.leaseId !== filter) return false;
      }

      if (key === "paidAt") {
        if (filter === null && row.paidAt !== null) return false;
        const not =
          filter && typeof filter === "object"
            ? (filter as { not?: unknown }).not
            : undefined;
        if (not === null && row.paidAt === null) return false;
      }

      if (key === "dueDate" && filter && typeof filter === "object") {
        const { lt } = filter as { lt?: Date };
        const due = row.dueDate as Date | undefined;
        if (lt !== undefined && (!due || due >= lt)) return false;
      }

      if (key === "status") {
        if (typeof filter === "string" && row.status !== filter) return false;
        const not =
          filter && typeof filter === "object"
            ? (filter as { not?: string }).not
            : undefined;
        if (not !== undefined && row.status === not) return false;
      }
    }
    return true;
  };

  const selected = (where: Record<string, unknown>) =>
    rows.filter((row) => matches(row, where));

  const prismaMock = {
    transaction: {
      findMany: vi.fn(
        async ({
          where,
          orderBy,
        }: {
          where: Record<string, unknown>;
          orderBy?: Record<string, "asc" | "desc">;
        }) => {
          const found = selected(where);
          // Prisma sorts; a fake that does not makes every ordering assertion
          // pass or fail for the wrong reason.
          const [field, direction] = Object.entries(orderBy ?? {})[0] ?? [];
          if (!field) return found;
          const sorted = [...found].sort((a, b) => {
            const left = a[field];
            const right = b[field];
            if (left instanceof Date && right instanceof Date) {
              return left.getTime() - right.getTime();
            }
            return String(left).localeCompare(String(right));
          });
          return direction === "desc" ? sorted.reverse() : sorted;
        }
      ),
      aggregate: vi.fn(
        async ({
          where,
          _sum,
        }: {
          where: Record<string, unknown>;
          _sum?: { amount?: boolean };
        }) => {
          const matched = selected(where);
          if (!_sum?.amount) return { _sum: {}, _count: matched.length };
          const { default: Dec } = await import("decimal.js");
          const total = matched.reduce(
            (sum, row) => sum.plus(new Dec(row.amount as string)),
            new Dec(0)
          );
          return {
            _sum: { amount: matched.length ? total : null },
            _count: matched.length,
          };
        }
      ),
      count: vi.fn(async () => 0),
      findFirst: vi.fn(async () => null),
    },
    property: {
      count: vi.fn(async () => 0),
      findMany: vi.fn(async () => []),
    },
    lease: {
      count: vi.fn(async () => 0),
      findMany: vi.fn(async () => []),
    },
    expense: {
      aggregate: vi.fn(async () => ({ _sum: { amount: null } })),
      groupBy: vi.fn(async () => []),
    },
    maintenanceTicket: {
      count: vi.fn(async () => 0),
      findMany: vi.fn(async () => []),
      groupBy: vi.fn(async () => []),
    },
    __rows: rows,
  };

  return { prismaMock };
});

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));

import { getRentExceptions } from "@/lib/queries/arrears";
import { getDashboardStats } from "@/lib/queries/dashboard-stats";

const NOW = new Date("2026-10-20T00:00:00.000Z");

/**
 * Dates for the tests that compare `getRentExceptions` with `getDashboardStats`.
 *
 * `getDashboardStats` reads the system clock and takes no `now`, while
 * `getRentExceptions` accepts one. Comparing them with an injected clock that
 * disagrees with the system one would compare two different questions, so these
 * fixtures are anchored to the real clock and always sit safely in the past.
 */
const REAL_PAST_A = new Date(Date.now() - 40 * 86_400_000);
const REAL_PAST_B = new Date(Date.now() - 5 * 86_400_000);
const SEPT_START = new Date("2026-09-01T00:00:00.000Z");
const OCT_START = new Date("2026-10-01T00:00:00.000Z");
const SEPT_DUE = new Date("2026-09-05T00:00:00.000Z");
const OCT_DUE = new Date("2026-10-05T00:00:00.000Z");

/** An unpaid period row, as Prisma would return it. */
function period(options: {
  id: string;
  amount: string;
  dueDate: Date;
  periodStart: Date;
  status?: string;
}) {
  return {
    id: options.id,
    userId: "landlord-1",
    leaseId: "lease-1",
    amount: new Decimal(options.amount),
    periodStart: options.periodStart,
    periodEnd: new Date(options.periodStart.getTime() + 30 * 86_400_000),
    dueDate: options.dueDate,
    paidAt: null,
    status: options.status ?? "PENDING",
    lease: {
      property: { name: "Villa" },
      tenant: { firstName: "Ana", lastName: "Silva" },
    },
  };
}

/** Money already received against a month: a sibling receipt row. */
function receipt(periodStart: Date, amount: string) {
  return {
    id: `receipt-${amount}`,
    userId: "landlord-1",
    leaseId: "lease-1",
    amount: new Decimal(amount),
    periodStart,
    periodEnd: new Date(periodStart.getTime() + 30 * 86_400_000),
    dueDate: OCT_DUE,
    paidAt: new Date("2026-10-02T00:00:00.000Z"),
    status: "PARTIAL",
  };
}

function seed(rows: Array<Record<string, unknown>>): void {
  prismaMock.__rows.length = 0;
  prismaMock.__rows.push(...rows);
}

beforeEach(() => {
  vi.clearAllMocks();
  seed([]);
});

describe("getRentExceptions — what the landlord is shown", () => {
  it("lists an unpaid month past its due date, with the amount and the lateness", async () => {
    // Card's first acceptance criterion: the amount and the days of delay must be
    // visible on the dashboard, without opening /billing.
    seed([
      period({
        id: "period-sep",
        amount: "970.55",
        dueDate: SEPT_DUE,
        periodStart: SEPT_START,
      }),
    ]);

    const [exception] = await getRentExceptions("landlord-1", NOW);

    expect(exception.remaining).toBe("970.55");
    expect(exception.daysLate).toBe(45);
    expect(exception.status).toBe("OVERDUE");
    expect(exception.tenant).toEqual({ firstName: "Ana", lastName: "Silva" });
    expect(exception.property).toEqual({ name: "Villa" });
  });

  it("returns nothing when there is nothing overdue", async () => {
    // The section disappears rather than showing an empty card (criterion 4).
    expect(await getRentExceptions("landlord-1", NOW)).toEqual([]);
  });

  it("excludes a month that is not yet due", async () => {
    seed([
      period({
        id: "period-nov",
        amount: "970.55",
        dueDate: new Date("2026-11-05T00:00:00.000Z"),
        periodStart: new Date("2026-11-01T00:00:00.000Z"),
      }),
    ]);

    expect(await getRentExceptions("landlord-1", NOW)).toEqual([]);
  });

  it("never lists another landlord's arrears", async () => {
    seed([
      {
        ...period({
          id: "theirs",
          amount: "970.55",
          dueDate: SEPT_DUE,
          periodStart: SEPT_START,
        }),
        userId: "landlord-2",
      },
    ]);

    // Multi-tenancy is a property of the query, not a check afterwards
    // (AGENTS.md 7-8): the other landlord's money is simply not in the result.
    expect(await getRentExceptions("landlord-1", NOW)).toEqual([]);
    expect(await getRentExceptions("landlord-2", NOW)).toHaveLength(1);
  });

  it("orders the most overdue first", async () => {
    seed([
      period({
        id: "p-oct",
        amount: "100.00",
        dueDate: OCT_DUE,
        periodStart: OCT_START,
      }),
      period({
        id: "p-sep",
        amount: "200.00",
        dueDate: SEPT_DUE,
        periodStart: SEPT_START,
      }),
    ]);

    const exceptions = await getRentExceptions("landlord-1", NOW);

    expect(exceptions.map((e) => e.transactionId)).toEqual(["p-sep", "p-oct"]);
  });
});

describe("getRentExceptions — the partially paid month", () => {
  it("shows the balance left AND the month's total", async () => {
    // 400 received on a 970.55 month leaves 570.55 owed. `paidAt` stays null and
    // the row's amount is the balance, so the month is still an exception — and
    // the total is what makes "570,55" mean something.
    seed([
      period({
        id: "period-oct",
        amount: "570.55",
        dueDate: OCT_DUE,
        periodStart: OCT_START,
      }),
      receipt(OCT_START, "400.00"),
    ]);

    const [exception] = await getRentExceptions("landlord-1", NOW);

    expect(exception.remaining).toBe("570.55");
    expect(exception.alreadyPaid).toBe("400.00");
    expect(exception.totalDue).toBe("970.55");
    expect(exception.status).toBe("OVERDUE");
  });

  it("does not list a month that has been settled", async () => {
    // The settled row carries `paidAt`, so it is never in the open set: the
    // section must not offer a relance for a month that has been paid.
    seed([
      {
        ...period({
          id: "closed",
          amount: "970.55",
          dueDate: OCT_DUE,
          periodStart: OCT_START,
        }),
        paidAt: new Date("2026-10-06T00:00:00.000Z"),
      },
    ]);

    expect(await getRentExceptions("landlord-1", NOW)).toEqual([]);
  });

  it("ignores a cancelled receipt when working out what was received", async () => {
    // A cancelled receipt keeps its amount for the audit trail but is not money
    // received; counting it would invent a partial payment that never happened.
    seed([
      period({
        id: "period-oct",
        amount: "970.55",
        dueDate: OCT_DUE,
        periodStart: OCT_START,
      }),
      { ...receipt(OCT_START, "400.00"), status: "CANCELLED" },
    ]);

    const [exception] = await getRentExceptions("landlord-1", NOW);

    expect(exception.alreadyPaid).toBe("0.00");
    expect(exception.totalDue).toBe("970.55");
  });
});

describe("the exception list and getDashboardStats cannot disagree", () => {
  it("sums to the same cents as the dashboard's own `revenue.late`", async () => {
    seed([
      period({
        id: "p-a",
        amount: "970.55",
        dueDate: REAL_PAST_A,
        periodStart: new Date(REAL_PAST_A.getTime() - 20 * 86_400_000),
      }),
      period({
        id: "p-b",
        amount: "570.55",
        dueDate: REAL_PAST_B,
        periodStart: new Date(REAL_PAST_B.getTime() - 20 * 86_400_000),
      }),
    ]);

    // Both functions really run, over the same fake database. `revenue.late` is
    // the number the dashboard would print; the sum of the listed rows is the
    // number the section would print. Comparing them is the whole point: two
    // screens answering "what is overdue" with two predicates is how a landlord
    // ends up told "1 impayé" on one screen and shown three on another.
    const [exceptions, stats] = await Promise.all([
      getRentExceptions("landlord-1", new Date()),
      getDashboardStats("landlord-1"),
    ]);

    const fromList = exceptions.reduce(
      (sum, e) => sum.plus(new Decimal(e.remaining)),
      new Decimal(0)
    );

    expect(fromList.toFixed(2)).toBe(new Decimal(stats.revenue.late).toFixed(2));
    // Guard against a vacuous pass: both must be the real figure.
    expect(stats.revenue.late).toBe(1541.1);
  });

  it("agrees with the dashboard when a month is only partly paid", async () => {
    // The partial is where the two screens historically diverged: the period
    // row's `amount` is the BALANCE, so a dashboard summing it and a table
    // showing the month's total are reading different columns.
    seed([
      period({
        id: "p-b",
        amount: "570.55",
        dueDate: REAL_PAST_B,
        periodStart: new Date(REAL_PAST_B.getTime() - 20 * 86_400_000),
      }),
    ]);

    const [exceptions, stats] = await Promise.all([
      getRentExceptions("landlord-1", new Date()),
      getDashboardStats("landlord-1"),
    ]);

    expect(exceptions[0].remaining).toBe("570.55");
    expect(stats.revenue.late).toBe(570.55);
  });

  it("selects on the same predicate the dashboard's arrears aggregate uses", async () => {
    // Pinned structurally: the listed set must be exactly
    // { userId, paidAt: null, dueDate < now }.
    seed([]);
    await getRentExceptions("landlord-1", NOW);

    const where = prismaMock.transaction.findMany.mock.calls[0][0].where as {
      userId: string;
      paidAt: null;
      dueDate: { lt: Date };
    };
    expect(where.userId).toBe("landlord-1");
    expect(where.paidAt).toBeNull();
    expect(where.dueDate.lt).toEqual(NOW);
  });
});