import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Reminder had a `leaseId` column (indexed, and accepted by the validation layer)
 * and both /api/reminders routes included `{ lease: {...} }` — but the relation
 * was never declared on the model. Prisma rejects an unknown relation in
 * `include` at runtime, so both routes returned 500 on every authenticated call.
 *
 * Verified before and after: the query threw "Invalid `prisma.reminder.findMany()`
 * invocation", then succeeded and returned the nested lease with its property and
 * tenant.
 *
 * This pins the schema invariant, because the compiler cannot check it: a missing
 * Prisma relation is invisible to tsc when the row is typed loosely, and only
 * appears at runtime.
 */

const schema = readFileSync(join(process.cwd(), "prisma/schema.prisma"), "utf8");

function model(name: string): string {
  const start = schema.indexOf(`\nmodel ${name} {`);
  if (start === -1) throw new Error(`model ${name} not found`);
  return schema.slice(start, schema.indexOf("\n}", start));
}

describe("Reminder lease relation", () => {
  it("declares the relation its API routes include", () => {
    expect(model("Reminder")).toMatch(/\n\s+lease\s+Lease\?\s+@relation\(/);
  });

  it("keeps the leaseId column and its index", () => {
    const m = model("Reminder");
    expect(m).toMatch(/\n\s+leaseId\s+String\?/);
    expect(m).toMatch(/@@index\(\[leaseId\]\)/);
  });

  it("has the back-reference on Lease", () => {
    expect(model("Lease")).toMatch(/\n\s+reminders\s+Reminder\[\]/);
  });

  it("deletes the reminder with its lease, matching the other cascade relations", () => {
    const m = model("Reminder");
    const lease = /\n\s+lease\s+Lease\?\s+@relation\([^)]*onDelete:\s*Cascade[^)]*\)/s.exec(m);
    expect(lease, "the lease relation should cascade on delete").not.toBeNull();
  });

  it("has a migration for the constraint, so a fresh database matches", () => {
    const { readdirSync, existsSync, readFileSync: read } = require("node:fs");
    const dir = join(process.cwd(), "prisma/migrations");
    let found = false;
    for (const entry of readdirSync(dir)) {
      const f = join(dir, entry, "migration.sql");
      if (existsSync(f) && read(f, "utf8").includes("Reminder_leaseId_fkey")) found = true;
    }
    // Without the migration a fresh database lacks the foreign key the relation
    // relies on, and the error moves from "unknown relation" to a constraint
    // violation at insert time.
    expect(found, "no migration creates Reminder_leaseId_fkey").toBe(true);
  });
});