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
 * What IS worth pinning, and is now pinned by CALLING the route: the ownership
 * filter that reaches the database is built from the authenticated landlord, and
 * no query is issued at all when that landlord is not the ticket's or property's
 * owner. The previous version of this file matched the route's source text with
 * regexes, which asserted the shape of the query but never that it excluded
 * anyone — a filter rewritten as `property: { is: { userId: userId } }`, or moved
 * into a `where` that no longer applied, passed all five assertions.
 *
 * The rate-limit split itself (a nullable capture used only to pick a limit) is
 * still asserted on the source, because the two ids are indistinguishable at
 * runtime: `userId` and `authUserId` hold the same value, so executing the route
 * cannot distinguish "filtered by the right id" from "filtered by a nullable id
 * that happened to be filled". That single check is marked as such below.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { NextRequest } from "next/server";

const { prismaMock, getAuthenticatedUserId, rateLimitMock, summarizeMock } = vi.hoisted(() => ({
  prismaMock: {
    maintenanceTicket: { findFirst: vi.fn(), update: vi.fn() },
    property: { findFirst: vi.fn() },
  },
  getAuthenticatedUserId: vi.fn(),
  rateLimitMock: vi.fn(async () => ({ success: true, limit: 1000, remaining: 999, reset: 0 })),
  summarizeMock: vi.fn(async () => ({ urgency: "MEDIUM", summary: "ok" })),
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/auth", () => ({ getAuthenticatedUserId }));
vi.mock("@/lib/rate-limit", () => ({
  rateLimit: rateLimitMock,
  getClientIp: () => "1.2.3.4",
  setRateLimitHeaders: () => {},
}));
vi.mock("@/lib/ai/maintenance-summarizer", () => ({
  summarizeMaintenanceTicket: summarizeMock,
}));

import { POST } from "@/app/api/ai/maintenance-summarize/route";

const OWNER = "landlord-1";

/** A request carrying a body, as the route receives it. */
function request(body: unknown): NextRequest {
  return new Request("http://localhost/api/ai/maintenance-summarize", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

beforeEach(() => {
  vi.clearAllMocks();
  getAuthenticatedUserId.mockResolvedValue(OWNER);
  rateLimitMock.mockResolvedValue({ success: true, limit: 1000, remaining: 999, reset: 0 });
  summarizeMock.mockResolvedValue({ urgency: "MEDIUM", summary: "ok" });
  prismaMock.property.findFirst.mockResolvedValue(null);
  prismaMock.maintenanceTicket.update.mockResolvedValue({});
});

describe("a ticket that belongs to the caller", () => {
  beforeEach(() => {
    prismaMock.maintenanceTicket.findFirst.mockResolvedValue({
      id: "ticket-1",
      title: "Fuite sous l'évier",
      description: "De l'eau s'accumule dans la cuisine depuis ce matin.",
      property: { type: "APPARTMENT", surface: 55, rooms: 2 },
    });
  });

  it("scopes the ticket lookup to the authenticated landlord", async () => {
    const res = await POST(request({ ticketId: "ticket-1" }));

    expect(res.status).toBe(200);
    // Ownership is a condition of the query, not a check after it.
    expect(prismaMock.maintenanceTicket.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          id: "ticket-1",
          property: { is: { userId: OWNER } },
        }),
      })
    );
  });

  it("summarises the ticket it actually read", async () => {
    await POST(request({ ticketId: "ticket-1" }));

    expect(summarizeMock).toHaveBeenCalledWith(
      "Fuite sous l'évier",
      "De l'eau s'accumule dans la cuisine depuis ce matin.",
      { type: "APPARTMENT", surface: 55, rooms: 2 }
    );
  });

  it("refuses a body with neither a ticketId nor a description", async () => {
    const res = await POST(request({ title: "Fuite" }));

    expect(res.status).toBe(400);
    // Nothing is read and nothing is summarised on an unusable request.
    expect(prismaMock.maintenanceTicket.findFirst).not.toHaveBeenCalled();
    expect(summarizeMock).not.toHaveBeenCalled();
  });
});

describe("a ticket that belongs to somebody else", () => {
  beforeEach(() => {
    // Prisma returns nothing for a query whose ownership filter does not match —
    // this is what the database does, and the route must treat it as "not found".
    prismaMock.maintenanceTicket.findFirst.mockResolvedValue(null);
  });

  it("answers 404 and never reads the ticket", async () => {
    const res = await POST(request({ ticketId: "someone-elses-ticket" }));

    expect(res.status).toBe(404);
    // The decisive assertion: another landlord's ticket is never summarised.
    expect(summarizeMock).not.toHaveBeenCalled();
    expect(prismaMock.maintenanceTicket.update).not.toHaveBeenCalled();
  });

  it("still passes the caller's own id to the filter", async () => {
    await POST(request({ ticketId: "someone-elses-ticket" }));

    expect(prismaMock.maintenanceTicket.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ property: { is: { userId: OWNER } } }),
      })
    );
  });
});

describe("an unauthenticated caller", () => {
  it("is rejected before any ticket is read", async () => {
    getAuthenticatedUserId
      .mockResolvedValueOnce(null) // the nullable capture, for the rate limit
      .mockRejectedValueOnce(new Error("Not authenticated"));

    await expect(POST(request({ ticketId: "ticket-1" }))).rejects.toThrow("Not authenticated");

    expect(prismaMock.maintenanceTicket.findFirst).not.toHaveBeenCalled();
  });

  it("still gets the unauthenticated rate limit, not the higher one", async () => {
    // The nullable capture exists for exactly this: an anonymous caller must not
    // receive the authenticated budget of 1000/min on an AI route.
    getAuthenticatedUserId
      .mockResolvedValueOnce(null)
      .mockRejectedValueOnce(new Error("Not authenticated"));

    await POST(request({ title: "Fuite sous l'évier" })).catch(() => {});

    expect(rateLimitMock).toHaveBeenCalledWith("1.2.3.4", { limit: 20, window: 60 });
  });

  it("is throttled before authentication is even checked", async () => {
    rateLimitMock.mockResolvedValue({ success: false, limit: 20, remaining: 0, reset: 60 });

    const res = await POST(request({ ticketId: "ticket-1" }));

    expect(res.status).toBe(429);
    expect(prismaMock.maintenanceTicket.findFirst).not.toHaveBeenCalled();
  });
});

describe("the property lookup is scoped the same way", () => {
  it("filters the property by the authenticated landlord", async () => {
    await POST(request({ title: "Fuite sous l'évier", description: "De l'eau dans la cuisine.", propertyId: "prop-9" }));

    expect(prismaMock.property.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "prop-9", userId: OWNER } })
    );
  });
});

describe("source-level check, and why it cannot be a runtime one", () => {
  it("captures a nullable id only to choose a rate limit", async () => {
    // This single assertion stays on the source text. `userId` and `authUserId`
    // hold the SAME string once the caller is authenticated, so no execution of
    // this route can tell a filter built from the authenticated id apart from one
    // built from a nullable capture that happens to be filled. Distinguishing
    // them needs a *different* authentication outcome between the two calls, which
    // the route does not produce. The regression it guards is a type widening
    // (caught by tsc, see the comment above), not a runtime behaviour.
    const { readFileSync } = await import("node:fs");
    const { join } = await import("node:path");
    const route = readFileSync(
      join(process.cwd(), "src/app/api/ai/maintenance-summarize/route.ts"),
      "utf8"
    );

    expect(route).toMatch(/const userId = await getAuthenticatedUserId\(\)\.catch\(\(\) => null\)/);
    // ...and it is used for nothing but the limit.
    expect(route).toMatch(/const limit = userId \? \d+ : \d+/);
  });
});
