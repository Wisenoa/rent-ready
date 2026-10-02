import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The weekly KPI digest emailed leadership figures that were never measured.
 *
 *   Core Web Vitals: GREEN   — hardcoded "green"; Plausible does not report CWV
 *                              at all (that is Search Console / CrUX), so the
 *                              digest asserted a passing score unconditionally
 *   MRR: 0 €                 — 0 when Stripe was unconfigured or unreachable
 *   Trial -> Paid: 0 %       — needs a trial concept the schema does not have
 *   Clients renouvelés: 0    — "churned", actually; needs event history
 *   Non-brand clicks: 0      — was a flat 65% of pageviews
 *   Baux créés: 0             — filtered AuditAction "LEASE_CREATED", which is
 *                              not a member of the enum, so it matched nothing
 *
 * It also called prisma.subscription.count(), and the schema has no Subscription
 * model, so prisma.subscription is undefined and the endpoint threw on every run.
 *
 * `null` now means "not measured" and the email prints N/C. These tests pin the
 * rule rather than the rendering, because the rendering is a template string.
 */

const route = readFileSync(
  join(process.cwd(), "src/app/api/cron/kpi-digest/route.ts"),
  "utf8"
);

describe("KPI digest reports only what it measures", () => {
  it("never queries a Prisma model that does not exist", () => {
    const schema = readFileSync(join(process.cwd(), "prisma/schema.prisma"), "utf8");
    // Prisma exposes a model in lowerCamelCase (AuditLog -> prisma.auditLog), so
    // the comparison has to normalise case or every multi-word model looks absent.
    const models = new Set(
      [...schema.matchAll(/^model (\w+)/gm)].map((m) => [
        m[1],
        m[1][0].toLowerCase() + m[1].slice(1),
      ]).flat()
    );
    // Prisma always exposes these; they are accessors, not models, so they do not
    // appear in schema.prisma.
    const reserved = new Set(["user", "$transaction", "$queryRaw", "$executeRaw", "$disconnect", "$connect", "$on"]);
    for (const m of route.matchAll(/prisma\.(\w+)\./g)) {
      if (reserved.has(m[1])) continue;
      expect(
        models.has(m[1]),
        `prisma.${m[1]} is not a model in the schema, so it is undefined at runtime`
      ).toBe(true);
    }
  });

  it("does not hardcode a Core Web Vitals verdict", () => {
    // The type union may contain "green"; what must not exist is assigning it.
    expect(route).not.toMatch(/cwvStatus:\s*"green"\s*(as const)?\s*,/);
    expect(route).not.toMatch(/cwvStatus:\s*"green"\s*;/);
  });

  it("does not fabricate a zero MRR when Stripe is absent or fails", () => {
    // 0 MRR is a measurement; unconfigured Stripe is not a measurement.
    expect(route).not.toMatch(/mrr:\s*0\b/);
  });

  it("does not invent churn, trial conversion or new customers", () => {
    for (const field of ["newPaidCustomers", "churnedCustomers", "trialToPaidRate"]) {
      expect(route, `${field} must not be a hardcoded 0`).not.toMatch(
        new RegExp(`${field}:\\s*0\\b`)
      );
    }
  });

  it("does not derive clicks from a fixed percentage of pageviews", () => {
    expect(route).not.toMatch(/nonBrandedClicks:\s*Math\.floor\(/);
  });

  it("only filters AuditLog on enum members", () => {
    const schema = readFileSync(join(process.cwd(), "prisma/schema.prisma"), "utf8");
    const start = schema.indexOf("enum AuditAction");
    const values = new Set(
      [...schema.slice(start).matchAll(/^\s*(\w+)/gm)].map((m) => m[1])
    );
    for (const m of route.matchAll(/action:\s*"(\w+)"/g)) {
      expect(
        values.has(m[1]),
        `AuditAction has no member "${m[1]}", so the filter matches nothing`
      ).toBe(true);
    }
  });

  it("renders an unmeasured metric as N/C rather than 0", () => {
    expect(route).toContain("function metric(");
    expect(route).toMatch(/function metric\([^)]*\)[^{]*\{\s*if \(value === null/);
  });

  it("separates measured from unmeasured in the type system", () => {
    expect(route).toContain("type Measured<T> = T | null;");
  });
});