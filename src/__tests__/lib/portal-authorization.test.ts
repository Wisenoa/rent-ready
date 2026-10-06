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
 * The rule: a tenantId is not authorisation. The token must be presented and must
 * match.
 *
 * These tests CALL the exported actions with a stubbed database. `verifyPortalAccess`
 * itself is private to the "use server" module, but it is not the thing worth
 * pinning: what matters is that each exported action refuses to read or write
 * anything without a valid token, and that is observable from outside. An earlier
 * version asserted on the module's source text, which meant an action that checked
 * the token and then queried a different tenant still passed.
 *
 * The stub decides access the way Prisma does — a token row exists for (tenantId,
 * token) and is unexpired, otherwise `findFirst` returns null — so a query that
 * dropped the tenant or the token from its filter would find a row here and be
 * reported as authorised.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const { prismaMock, tokens } = vi.hoisted(() => ({
  /** The token rows the fake database holds. */
  tokens: [] as Array<{ id: string; tenantId: string; token: string; expiresAt: Date | null }>,
  prismaMock: {
    tenantAccessToken: {
      findFirst: vi.fn(),
      update: vi.fn(async () => ({})),
    },
    transaction: { findMany: vi.fn(async () => []), count: vi.fn(async () => 0) },
    maintenanceTicket: { findMany: vi.fn(async () => []), count: vi.fn(async () => 0), create: vi.fn() },
    conversation: { findFirst: vi.fn(), upsert: vi.fn() },
    message: { findMany: vi.fn(async () => []), create: vi.fn() },
    tenant: { findFirst: vi.fn(), findUnique: vi.fn() },
    lease: { findFirst: vi.fn() },
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/stripe", () => ({ stripe: {} }));

import {
  getPortalQuittances,
  getPendingPayments,
  getMaintenanceTickets,
  getOrCreateConversation,
  sendMessage,
  createMaintenanceTicket,
} from "@/lib/actions/portal-actions";

const VICTIM = "tenant-victim";
const VALID_TOKEN = "tok-valid-for-victim";
/** A token that exists, but for a different tenant. */
const OTHER_TENANT_TOKEN = "tok-valid-for-someone-else";

beforeEach(() => {
  vi.clearAllMocks();
  tokens.length = 0;
  tokens.push(
    { id: "tok-row-1", tenantId: VICTIM, token: VALID_TOKEN, expiresAt: null },
    { id: "tok-row-2", tenantId: "tenant-other", token: OTHER_TENANT_TOKEN, expiresAt: null }
  );

  // Prisma semantics: a row is returned when it matches every condition the query
  // actually states. Conditions the query omits are simply not applied — which is
  // what makes a dropped filter observable here: if the action ever stops matching
  // the token, this stub starts finding a row and authorises the caller, and the
  // "reads nothing" assertions fail.
  prismaMock.tenantAccessToken.findFirst.mockImplementation(
    async ({ where }: { where: { tenantId?: string; token?: string } }) => {
      const candidates = tokens.filter(
        (t) =>
          (where.tenantId === undefined || t.tenantId === where.tenantId) &&
          (where.token === undefined || t.token === where.token)
      );
      // `OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]`
      return (
        candidates.find((t) => t.expiresAt === null || t.expiresAt.getTime() > Date.now()) ?? null
      );
    }
  );
  prismaMock.transaction.count.mockResolvedValue(0);
  prismaMock.maintenanceTicket.count.mockResolvedValue(0);
});

/** Nothing sensitive was read. */
function readNothing() {
  expect(prismaMock.transaction.findMany).not.toHaveBeenCalled();
  expect(prismaMock.maintenanceTicket.findMany).not.toHaveBeenCalled();
  expect(prismaMock.message.findMany).not.toHaveBeenCalled();
}

describe("a caller presenting no token", () => {
  it("reads no quittances for a tenant id alone", async () => {
    const result = await getPortalQuittances(VICTIM, "");

    expect(result.quittances).toEqual([]);
    readNothing();
  });

  it("reads no pending payments for a tenant id alone", async () => {
    const result = await getPendingPayments(VICTIM, "");

    expect(result.payments).toEqual([]);
    readNothing();
  });

  it("reads no maintenance tickets for a tenant id alone", async () => {
    const result = await getMaintenanceTickets(VICTIM, "");

    expect(result.tickets ?? []).toEqual([]);
    readNothing();
  });

  it("cannot read the conversation for a tenant id alone", async () => {
    await getOrCreateConversation(VICTIM, "");

    expect(prismaMock.conversation.findFirst).not.toHaveBeenCalled();
    expect(prismaMock.conversation.upsert).not.toHaveBeenCalled();
  });

  it("cannot send a message as a tenant id alone", async () => {
    await sendMessage(VICTIM, "", "Bonjour, ma chauffe est en panne.");

    expect(prismaMock.message.create).not.toHaveBeenCalled();
  });

  it("cannot open a maintenance ticket as a tenant id alone", async () => {
    const form = new FormData();
    form.append("tenantId", VICTIM);
    form.append("title", "Fuite sous l'évier");
    form.append("description", "De l'eau s'accumule dans la cuisine.");
    form.append("priority", "NORMAL");

    await createMaintenanceTicket(form);

    expect(prismaMock.maintenanceTicket.create).not.toHaveBeenCalled();
  });
});

describe("a caller presenting a token that belongs to another tenant", () => {
  it("reads nothing, because the token and the tenant are matched together", async () => {
    // The core of the vulnerability: a token that is valid, but not for this
    // tenant, must not unlock this tenant's records.
    const result = await getPortalQuittances(VICTIM, OTHER_TENANT_TOKEN);

    expect(result.quittances).toEqual([]);
    readNothing();
  });

  it("cannot read pending payments of the other tenant", async () => {
    const result = await getPendingPayments(VICTIM, OTHER_TENANT_TOKEN);

    expect(result.payments).toEqual([]);
    readNothing();
  });

  it("cannot send a message to the other tenant's conversation", async () => {
    await sendMessage(VICTIM, OTHER_TENANT_TOKEN, "Bonjour");

    expect(prismaMock.message.create).not.toHaveBeenCalled();
  });
});

describe("a caller presenting a token that does not exist", () => {
  it("reads nothing", async () => {
    const result = await getPortalQuittances(VICTIM, "tok-guessed");

    expect(result.quittances).toEqual([]);
    readNothing();
  });

  it("cannot open a maintenance ticket", async () => {
    const form = new FormData();
    form.append("tenantId", VICTIM);
    form.append("token", "tok-guessed");
    form.append("title", "Fuite sous l'évier");
    form.append("description", "De l'eau s'accumule dans la cuisine.");
    form.append("priority", "NORMAL");

    await createMaintenanceTicket(form);

    expect(prismaMock.maintenanceTicket.create).not.toHaveBeenCalled();
  });
});

describe("an expired token", () => {
  it("reads nothing, so a leaked link stops working", async () => {
    tokens.length = 0;
    tokens.push({
      id: "tok-expired",
      tenantId: VICTIM,
      token: VALID_TOKEN,
      expiresAt: new Date(Date.now() - 60_000),
    });

    const result = await getPortalQuittances(VICTIM, VALID_TOKEN);

    expect(result.quittances).toEqual([]);
    readNothing();
  });
});

describe("the tenant holding their own valid token", () => {
  it("does read that tenant's quittances", async () => {
    // Without this the assertions above would pass on a portal that shows nothing
    // to anybody.
    const result = await getPortalQuittances(VICTIM, VALID_TOKEN);

    expect(prismaMock.transaction.findMany).toHaveBeenCalled();
    expect(result.quittances).toEqual([]);
  });

  it("marks the token as used without blocking on the bookkeeping write", async () => {
    await getPortalQuittances(VICTIM, VALID_TOKEN);

    expect(prismaMock.tenantAccessToken.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "tok-row-1" } })
    );
  });
});
