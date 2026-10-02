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
 *
 * WHY THIS STAYS A SOURCE-READING TEST
 *
 * The claim is about schema.prisma declaring a relation, and the schema is not a
 * module anything imports — it is a file Prisma reads to generate a client. A
 * relation either exists in the generated client or it does not, and asserting on
 * the declaration is checking the same thing one step earlier, where it is
 * legible. (The route-level behaviour — the query returning the nested lease
 * instead of throwing — is verified by driving the routes, as this header records.)
 *
 * There is no runtime alternative that is not strictly worse: importing the
 * generated Prisma client and asking it for the relation metadata would prove the
 * same fact through a generated artefact, and would break whenever the client is
 * regenerated in a different state than the test run.
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
  // No /s flag: tsconfig targets ES2017, where dotAll is not available. The
  // relation declaration is matched with an explicit [\s\S] instead.
  const lease =
    /\n\s+lease\s+Lease\?\s+@relation\([\s\S]*?onDelete:\s*Cascade[\s\S]*?\)/.exec(m);
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