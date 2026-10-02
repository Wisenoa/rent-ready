/**
 * The PATCH routes must not be able to write a settlement state.
 *
 * Both used to copy `status` and `paidAt` straight from the request body, with no
 * validation at all. `POST { "status": "PAID" }` on a period that had received
 * nothing made the dashboard count a month as collected while the month's
 * receipts summed to zero — the figure RentReady shows no longer being the money
 * that came in. `status: "PENDING"` did the reverse and made a real payment
 * disappear.
 *
 * A period's status is DERIVED from the money received (AGENTS.md 11), so these
 * tests call the real handlers and assert the refusal, rather than reading their
 * source.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { prismaMock, sessionMock } = vi.hoisted(() => ({
  prismaMock: {
    transaction: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    lease: { findFirst: vi.fn() },
    $transaction: vi.fn(
      async (fn: (tx: typeof prismaMock) => Promise<unknown>) => fn(prismaMock)
    ),
  },
  sessionMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/auth-server", () => ({
  auth: { api: { getSession: sessionMock } },
}));

import { PATCH as patchPayment, DELETE as deletePayment } from "@/app/api/payments/[id]/route";
import { PATCH as patchTransaction } from "@/app/api/transactions/[id]/route";

const OWNER = "landlord-1";

function request(body: unknown): NextRequest {
  return new NextRequest("https://rentready.test/api/payments/tx-1", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

const PARAMS = { params: Promise.resolve({ id: "tx-1" }) };

beforeEach(() => {
  vi.clearAllMocks();
  sessionMock.mockResolvedValue({ user: { id: OWNER } });
  prismaMock.transaction.findFirst.mockResolvedValue({
    id: "tx-1",
    userId: OWNER,
    leaseId: "lease-1",
    amount: "970.55",
  });
  prismaMock.transaction.updateMany.mockResolvedValue({ count: 1 });
  prismaMock.transaction.findUnique.mockResolvedValue({ id: "tx-1" });
  prismaMock.transaction.findMany.mockResolvedValue([]);
  prismaMock.transaction.update.mockResolvedValue({ id: "tx-1" });
  prismaMock.transaction.create.mockResolvedValue({ id: "period-reopened" });
});

describe("PATCH /api/payments/[id]", () => {
  it("refuses to write PAID on a period that received nothing", async () => {
    const response = await patchPayment(request({ status: "PAID" }), PARAMS);

    expect(response.status).toBe(400);
    // No write of any kind: the refusal happens before the database is touched.
    expect(prismaMock.transaction.updateMany).not.toHaveBeenCalled();
    expect(prismaMock.transaction.update).not.toHaveBeenCalled();
  });

  it("refuses a client-supplied paidAt, which is what made money appear", async () => {
    const response = await patchPayment(
      request({ status: "PENDING", paidAt: "2026-10-05T00:00:00.000Z" }),
      PARAMS
    );

    expect(response.status).toBe(400);
    expect(prismaMock.transaction.updateMany).not.toHaveBeenCalled();
  });

  it("refuses a client-supplied amount", async () => {
    const response = await patchPayment(request({ amount: "9999.99" }), PARAMS);

    expect(response.status).toBe(400);
    expect(prismaMock.transaction.updateMany).not.toHaveBeenCalled();
  });

  it("still allows the annotation, scoped to the owner", async () => {
    const response = await patchPayment(request({ notes: "virement du 5" }), PARAMS);

    expect(response.status).toBe(200);
    // Ownership is in the write, not a check afterwards: knowing another
    // landlord's id is not enough.
    expect(prismaMock.transaction.updateMany).toHaveBeenCalledWith({
      where: { id: "tx-1", userId: OWNER },
      data: { notes: "virement du 5" },
    });
  });

  it("reports not found when the id belongs to someone else", async () => {
    prismaMock.transaction.updateMany.mockResolvedValue({ count: 0 });

    const response = await patchPayment(request({ notes: "nope" }), PARAMS);

    expect(response.status).toBe(404);
  });

  it("requires authentication", async () => {
    sessionMock.mockResolvedValue(null);

    const response = await patchPayment(request({ status: "PAID" }), PARAMS);

    expect(response.status).toBe(401);
    expect(prismaMock.transaction.updateMany).not.toHaveBeenCalled();
  });
});

describe("PATCH /api/transactions/[id]", () => {
  it("refuses a status write there too", async () => {
    const response = await patchTransaction(request({ status: "PAID" }), PARAMS);

    expect(response.status).toBe(400);
    expect(prismaMock.transaction.updateMany).not.toHaveBeenCalled();
  });

  it("allows notes, scoped to the owner", async () => {
    const response = await patchTransaction(request({ notes: "chèque" }), PARAMS);

    expect(response.status).toBe(200);
    expect(prismaMock.transaction.updateMany).toHaveBeenCalledWith({
      where: { id: "tx-1", userId: OWNER },
      data: { notes: "chèque" },
    });
  });
});

describe("DELETE /api/payments/[id] — the correction path", () => {
  // The full behaviour (the balance going back to being collectable) is covered
  // on rows in rent-payment-door.test.ts. What matters here is that the route
  // exists, is authenticated, is scoped, and answers with what became
  // collectable instead of a bare success.
  it("cancels the receipt and returns the balance that is collectable again", async () => {
    prismaMock.transaction.findFirst.mockResolvedValue({
      id: "tx-1",
      userId: OWNER,
      leaseId: "lease-1",
      amount: "970.55",
      paidAt: new Date("2026-10-05T00:00:00.000Z"),
      status: "PAID",
      periodStart: new Date("2026-10-01T00:00:00.000Z"),
      periodEnd: new Date("2026-10-31T00:00:00.000Z"),
      dueDate: new Date("2026-10-03T00:00:00.000Z"),
      lease: { rentAmount: "850.50", chargesAmount: "120.05" },
    });
    // No unpaid period row: the receipt WAS the month, so it is re-materialised.
    prismaMock.transaction.findFirst
      .mockResolvedValueOnce({
        id: "tx-1",
        userId: OWNER,
        leaseId: "lease-1",
        amount: "970.55",
        paidAt: new Date("2026-10-05T00:00:00.000Z"),
        status: "PAID",
        periodStart: new Date("2026-10-01T00:00:00.000Z"),
        periodEnd: new Date("2026-10-31T00:00:00.000Z"),
        dueDate: new Date("2026-10-03T00:00:00.000Z"),
        lease: { rentAmount: "850.50", chargesAmount: "120.05" },
      })
      .mockResolvedValue(null);

    const response = await deletePayment(
      new NextRequest("https://rentready.test/api/payments/tx-1", { method: "DELETE" }),
      PARAMS
    );

    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      data: { status: string; collectable: string };
    };
    expect(body.data.status).toBe("CANCELLED");
    // 850.50 + 120.05 is owed again: the month is collectable through the dialog.
    expect(body.data.collectable).toBe("970.55");
  });

  it("refuses a payment id belonging to another landlord", async () => {
    prismaMock.transaction.findFirst.mockResolvedValue(null);

    const response = await deletePayment(
      new NextRequest("https://rentready.test/api/payments/tx-1", { method: "DELETE" }),
      PARAMS
    );

    expect(response.status).toBe(404);
    expect(prismaMock.transaction.update).not.toHaveBeenCalled();
  });

  it("requires authentication", async () => {
    sessionMock.mockResolvedValue(null);

    const response = await deletePayment(
      new NextRequest("https://rentready.test/api/payments/tx-1", { method: "DELETE" }),
      PARAMS
    );

    expect(response.status).toBe(401);
  });
});