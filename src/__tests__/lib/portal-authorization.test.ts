import { describe, it, expect } from "vitest";

/**
 * The tenant portal's only credential is the access token in the URL.
 *
 * `verifyPortalAccess(tenantId)` used to ask merely whether *any* valid token
 * existed for that tenant. The server actions that use it — sendMessage,
 * createMaintenanceTicket, initiatePayment, getPortalQuittances,
 * getMaintenanceTickets, getPendingPayments, getOrCreateConversation — are
 * callable directly by any browser without rendering the page, so a caller who
 * guessed or enumerated a tenantId could read another landlord's rent records and
 * write messages and maintenance tickets as that tenant.
 *
 * These pin the query shape rather than the helper, because the helper is private
 * to a "use server" module and cannot be imported into a unit test. The rule is:
 * a tenantId is not authorisation. The token must be presented and must match.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(
  join(process.cwd(), "src/lib/actions/portal-actions.tsx"),
  "utf8"
);

describe("tenant portal authorisation", () => {
  it("requires a token, not just a tenant id", () => {
    expect(source).toContain(
      "async function verifyPortalAccess(tenantId: string, token: string)"
    );
    // A bare tenantId must no longer be accepted anywhere.
    expect(source).not.toContain("verifyPortalAccess(tenantId)");
  });

  it("matches the presented token in the query, not just the tenant", () => {
    const i = source.indexOf("async function verifyPortalAccess");
    const body = source.slice(i, source.indexOf("\n}", i));
    // Both the tenant and the token are part of the lookup, so an invalid or
    // expired token cannot slip through and a timing difference cannot reveal
    // whether a token exists.
    expect(body).toContain("tenantId");
    expect(body).toContain("token,");
    expect(body).toContain("expiresAt");
  });

  it("rejects a missing tenantId or token before touching the database", () => {
    const i = source.indexOf("async function verifyPortalAccess");
    const body = source.slice(i, source.indexOf("\n}", i));
    expect(body).toContain("if (!tenantId || !token) return false;");
  });

  it("gates every tenant-facing action on the token", () => {
    const gated = [
      "getPortalQuittances",
      "createMaintenanceTicket",
      "getMaintenanceTickets",
      "getPendingPayments",
      "initiatePayment",
      "getOrCreateConversation",
      "sendMessage",
    ];
    for (const fn of gated) {
      const at = source.indexOf(`export async function ${fn}`);
      expect(at, `${fn} not found`).toBeGreaterThan(-1);
      const next = source.indexOf("export async function", at + 1);
      const body = source.slice(at, next === -1 ? source.length : next);
      if (fn === "createMaintenanceTicket") {
        // Reads the token from the submitted form.
        expect(body).toContain('formData.get("token")');
      }
      expect(
        body,
        `${fn} must verify the token, not just that the tenant has one`
      ).toContain("verifyPortalAccess(tenantId, token)");
    }
  });

  it("requires the token on the maintenance form, which posts a tenantId", () => {
    const i = source.indexOf("export async function createMaintenanceTicket");
    const body = source.slice(i, source.indexOf("export async function", i + 1));
    expect(body).toContain('formData.get("token") as string');
    expect(body).toContain("if (!token)");
  });
});
