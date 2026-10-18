import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { analyticsPayloadSchema, safeAnalyticsPath } from "@/lib/analytics/privacy";
import { POST } from "@/app/api/analytics/page-view/route";
import { safeAuthCallback } from "@/lib/auth-redirect";
import { analyticsConsentMaxAge } from "@/lib/analytics/client";

beforeEach(() => vi.restoreAllMocks());
afterEach(() => vi.unstubAllGlobals());
function request(body: unknown, consent = "accepted") {
  return new NextRequest("http://localhost/api/analytics/page-view", { method: "POST",
    headers: { cookie: `lokna_cookie_consent=${consent}` }, body: JSON.stringify(body) });
}
describe("analytics data minimization", () => {
  it("synchronizes only the remaining consent lifetime, never a new 180 days", () => {
    const recordedAt = Date.now() - 179 * 86400000;
    vi.stubGlobal("window", {});
    vi.stubGlobal("localStorage", { getItem: (key: string) => key === "lokna_cookie_consent" ? "accepted" : String(recordedAt) });
    expect(analyticsConsentMaxAge()).toBeGreaterThanOrEqual(86399);
    expect(analyticsConsentMaxAge()).toBeLessThanOrEqual(86400);
  });
  it("drops calculator inputs and all query strings", () => {
    expect(safeAnalyticsPath("/outils/calculateur-irl?email=private@example.test&loyer=850&token=secret")).toBe("/outils/calculateur-irl");
  });
  it.each(["/portal/secret-token", "/properties/private-address", "/billing?tx=secret", "/unknown/name@example.test"])("does not record %s", path => expect(safeAnalyticsPath(path)).toBeNull());
  it("redacts dynamic marketing paths", () => expect(safeAnalyticsPath("/bail/name@example.test")).toBe("/bail/[slug]"));
  it("whitelists event fields", () => expect(analyticsPayloadSchema.parse({ path: "/", event: "pageview", email: "secret", referrer: "secret", ip: "secret" })).toEqual({ path: "/", event: "pageview" }));
  it("rejects product events fabricated in the browser", async () => {
    expect((await POST(request({ event: "signup_completed", path: "/" }))).status).toBe(400);
  });
  it.each(["rejected", ""])("does not collect without consent (%s)", async consent => {
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    expect((await POST(request({ path: "/" }, consent))).status).toBe(204);
    expect(log).not.toHaveBeenCalled();
  });
  it("never logs supplied private fields or request IPs", async () => {
    const log = vi.spyOn(console, "info").mockImplementation(() => {});
    await POST(request({ event: "pageview", path: "/outils/calculateur-irl?email=secret&rent=850", referrer: "secret", ip: "secret" }));
    const saved = JSON.parse(String(log.mock.calls[0][0]));
    expect(saved.path).toBe("/outils/calculateur-irl");
    expect(JSON.stringify(saved)).not.toContain("secret");
    expect(saved).not.toHaveProperty("ip");
    expect(saved).not.toHaveProperty("userAgent");
  });
});
describe("authentication callback", () => {
  it.each(["javascript:alert(1)", "//evil.test", "/\\evil.test", "https://evil.test"])("rejects %s", url => expect(safeAuthCallback(url)).toBe("/dashboard"));
  it("preserves a valid internal destination", () => expect(safeAuthCallback("/leases?new=1")).toBe("/leases?new=1"));
});
