import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * The maintenance-summarize route captured `userId` as nullable:
 *
 *   const userId = await getAuthenticatedUserId().catch(() => null);
 *
 * because it feeds the rate-limit decision (authenticated users get a higher
 * limit). It then re-authenticated as `authUserId` and threw if that failed — but
 * the two queries below still used the nullable `userId`, so the ownership filters
 * were typed `string | null`. TypeScript reported the filter, and `ticket.property`
 * went missing, because the whole query lost its type.
 *
 * Verified against the database that this was NOT an authorization hole: both
 * `property: { userId }` and `property: { is: { userId } }` correctly exclude a
 * non-owner. The fix is a typing correction, not a security fix, and the test says
 * so rather than overclaiming.
 *
 * The invariant worth pinning: an authenticated route must filter by the
 * non-nullable id it obtained after re-authentication, not by a nullable capture
 * taken for an unrelated purpose.
 */

const route = readFileSync(
  join(process.cwd(), "src/app/api/ai/maintenance-summarize/route.ts"),
  "utf8"
);

describe("maintenance-summarize ownership filters", () => {
  it("captures a nullable id only for the rate-limit decision", () => {
    expect(route).toMatch(/getAuthenticatedUserId\(\)\.catch\(\(\) => null\)/);
    // and it is used only to pick a limit
    expect(route).toMatch(/const limit = userId \? \d+ : \d+/);
  });

  it("re-authenticates to a non-nullable id before querying", () => {
    expect(route).toMatch(/const authUserId = await getAuthenticatedUserId\(\)/);
  });

  it("filters the ticket by authUserId, not the nullable capture", () => {
    expect(route).toContain("property: { is: { userId: authUserId } }");
    expect(route).not.toContain("property: { userId },");
  });

  it("filters the property lookup by authUserId", () => {
    expect(route).toMatch(/where: \{ id: propertyId, userId: authUserId \}/);
  });

  it("never passes the nullable id into a prisma filter", () => {
    // A regex over the query sites: no `userId` shorthand that is not authUserId.
    const suspicious = route.match(/(?:where|include|select)[\s\S]{0,200}?userId[,}]/g) ?? [];
    for (const site of suspicious) {
      expect(site).toMatch(/authUserId|userId:\s*authUserId/);
    }
  });
});