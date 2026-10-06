import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import Decimal from "decimal.js";

// ─── Mock setup ──────────────────────────────────────────────────────────────

vi.mock("@/lib/auth-server", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    tenant: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    lease: {
      findMany: vi.fn(),
    },
    maintenanceTickets: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    message: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
    conversation: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
  },
}));

const { auth } = await import("@/lib/auth-server");
const { prisma } = await import("@/lib/prisma");

// ─── Helpers ────────────────────────────────────────────────────────────────

function mockSession(userId: string = "user-1") {
  vi.mocked(auth.api.getSession).mockResolvedValue({
    user: { id: userId, name: "Test User", email: "test@example.com" },
    session: { id: "session-1", expiresAt: new Date() },
  } as any);
}

function mockUnauthorized() {
  vi.mocked(auth.api.getSession).mockResolvedValue(null as any);
}

async function getRouteHandler() {
  const { GET, POST } = await import("@/app/api/tenants/route");
  return { GET, POST };
}

async function getIdRouteHandler() {
  const mod = await import("@/app/api/tenants/[id]/route");
  return { GET: mod.GET, PATCH: mod.PATCH, DELETE: mod.DELETE };
}

// ─── GET /api/tenants ────────────────────────────────────────────────────────

describe("GET /api/tenants", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it("returns 401 when unauthenticated", async () => {
    mockUnauthorized();
    const { GET } = await getRouteHandler();
    const req = new NextRequest("http://localhost/api/tenants");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns paginated tenants excluding archived by default", async () => {
    mockSession();
    vi.mocked(prisma.tenant.findMany).mockResolvedValue([
      {
        id: "tenant-1",
        firstName: "Marie",
        lastName: "Dupont",
        email: "marie@example.com",
        phone: "0601020304",
        addressLine1: "12 Rue de la Paix",
        addressLine2: null,
        city: "Paris",
        postalCode: "75001",
        userId: "user-1",
        dateOfBirth: null,
        placeOfBirth: null,
        emergencyName: null,
        emergencyPhone: null,
        archived: false,
        archivedAt: null,
        employerName: null,
        employerPhone: null,
        employerAddress: null,
        monthlyIncome: null,
        idDocumentType: null,
        idDocumentNumber: null,
        idDocumentExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    vi.mocked(prisma.tenant.count).mockResolvedValue(1);

    const { GET } = await getRouteHandler();
    const req = new NextRequest("http://localhost/api/tenants");
    const res = await GET(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(1);
    expect(json.data[0].firstName).toBe("Marie");
    expect(prisma.tenant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1", archived: false } })
    );
  });

  it("includes archived tenants when ?includeArchived=true", async () => {
    mockSession();
    vi.mocked(prisma.tenant.findMany).mockResolvedValue([]);
    vi.mocked(prisma.tenant.count).mockResolvedValue(0);

    const { GET } = await getRouteHandler();
    const req = new NextRequest("http://localhost/api/tenants?includeArchived=true");
    await GET(req);

    expect(prisma.tenant.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-1" } })
    );
  });
});

// ─── POST /api/tenants ───────────────────────────────────────────────────────

describe("POST /api/tenants", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it("creates a tenant with all new fields", async () => {
    mockSession();
    vi.mocked(prisma.tenant.create).mockResolvedValue({
      id: "tenant-new",
      firstName: "Jean",
      lastName: "Martin",
      email: "jean@example.com",
      phone: "0601020305",
      addressLine1: "14 Rue de la Paix",
      addressLine2: null,
      city: "Paris",
      postalCode: "75001",
      userId: "user-1",
      dateOfBirth: new Date("1990-05-15"),
      placeOfBirth: "Lyon",
      emergencyName: "Pierre Martin",
      emergencyPhone: "0606060606",
      archived: false,
      archivedAt: null,
      employerName: "Acme Corp",
      employerPhone: "0102030405",
      employerAddress: "10 Avenue des Champs",
      monthlyIncome: new Decimal(3500),
      idDocumentType: "PASSPORT",
      idDocumentNumber: "AB123456",
      idDocumentExpiry: new Date("2030-01-01"),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    const { POST } = await getRouteHandler();
    const body = {
      firstName: "Jean",
      lastName: "Martin",
      email: "jean@example.com",
      phone: "0601020305",
      addressLine1: "14 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      dateOfBirth: "1990-05-15",
      placeOfBirth: "Lyon",
      emergencyName: "Pierre Martin",
      emergencyPhone: "0606060606",
      employerName: "Acme Corp",
      employerPhone: "0102030405",
      employerAddress: "10 Avenue des Champs",
      monthlyIncome: "3500.00",
      idDocumentType: "PASSPORT",
      idDocumentNumber: "AB123456",
      idDocumentExpiry: "2030-01-01",
    };

    const req = new NextRequest("http://localhost/api/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json.data.id).toBe("tenant-new");
    expect(json.data.employerName).toBe("Acme Corp");
    expect(json.data.idDocumentType).toBe("PASSPORT");
  });

  it("rejects invalid email", async () => {
    mockSession();

    const { POST } = await getRouteHandler();
    const body = {
      firstName: "Jean",
      lastName: "Martin",
      email: "not-an-email",
      addressLine1: "14 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
    };

    const req = new NextRequest("http://localhost/api/tenants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

// ─── GET /api/tenants/[id] ───────────────────────────────────────────────────

describe("GET /api/tenants/[id]", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it("returns tenant with active lease and maintenance", async () => {
    mockSession();
    vi.mocked(prisma.tenant.findUnique).mockResolvedValue({
      id: "tenant-1",
      firstName: "Marie",
      lastName: "Dupont",
      email: "marie@example.com",
      phone: "0601020304",
      addressLine1: "12 Rue de la Paix",
      addressLine2: null,
      city: "Paris",
      postalCode: "75001",
      userId: "user-1",
      dateOfBirth: null,
      placeOfBirth: null,
      emergencyName: null,
      emergencyPhone: null,
      archived: false,
      archivedAt: null,
      employerName: "Acme",
      employerPhone: null,
      employerAddress: null,
      monthlyIncome: null,
      idDocumentType: null,
      idDocumentNumber: null,
      idDocumentExpiry: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as any);

    vi.mocked(prisma.lease.findMany).mockResolvedValue([
      {
        id: "lease-1",
        status: "ACTIVE",
        rentAmount: new (await import("decimal.js"))(1200),
        startDate: new Date("2024-01-01"),
        endDate: new Date("2024-12-31"),
        propertyId: "prop-1",
        tenantId: "tenant-1",
        userId: "user-1",
        securityDeposit: new (await import("decimal.js"))(2400),
        createdAt: new Date(),
        updatedAt: new Date(),
        property: {
          id: "prop-1",
          name: "Appartement Rivoli",
          addressLine1: "12 Rue de Rivoli",
          city: "Paris",
          postalCode: "75001",
          userId: "user-1",
          type: "APARTMENT",
          addressLine2: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      },
    ]);

    const { GET } = await getIdRouteHandler();
    const req = new NextRequest("http://localhost/api/tenants/tenant-1");
    const res = await GET(req, { params: Promise.resolve({ id: "tenant-1" }) } as any);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.firstName).toBe("Marie");
    expect(json.data.activeLease).toBeDefined();
    expect(json.data.activeLease.property.name).toBe("Appartement Rivoli");
  });

  it("returns 404 for unowned tenant", async () => {
    mockSession();
    vi.mocked(prisma.tenant.findUnique).mockResolvedValue(null);

    const { GET } = await getIdRouteHandler();
    const req = new NextRequest("http://localhost/api/tenants/other-tenant");
    const res = await GET(req, { params: Promise.resolve({ id: "other-tenant" }) } as any);
    expect(res.status).toBe(404);
  });
});

// ─── PATCH /api/tenants/[id] — soft delete ───────────────────────────────────

describe("PATCH /api/tenants/[id] — soft delete", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it("archives tenant when archived=true", async () => {
    mockSession();
    vi.mocked(prisma.tenant.findUnique).mockResolvedValue({
      id: "tenant-1",
      userId: "user-1",
      archived: false,
    } as any);
    vi.mocked(prisma.tenant.update).mockResolvedValue({
      id: "tenant-1",
      userId: "user-1",
      archived: true,
      archivedAt: new Date(),
    } as any);

    const { PATCH } = await getIdRouteHandler();
    const req = new NextRequest("http://localhost/api/tenants/tenant-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: true }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: "tenant-1" }) } as any);
    expect(res.status).toBe(200);
    expect(prisma.tenant.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "tenant-1" },
        data: expect.objectContaining({ archived: true }),
      })
    );
  });

  it("updates employer info", async () => {
    mockSession();
    vi.mocked(prisma.tenant.findUnique).mockResolvedValue({
      id: "tenant-1",
      userId: "user-1",
      archived: false,
    } as any);
    vi.mocked(prisma.tenant.update).mockResolvedValue({
      id: "tenant-1",
      userId: "user-1",
      employerName: "New Employer",
      employerPhone: "0102030405",
      monthlyIncome: new (await import("decimal.js"))(4500),
    } as any);

    const { PATCH } = await getIdRouteHandler();
    const req = new NextRequest("http://localhost/api/tenants/tenant-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employerName: "New Employer",
        employerPhone: "0102030405",
        monthlyIncome: "4500.00",
      }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: "tenant-1" }) } as any);
    expect(res.status).toBe(200);
  });
});

// ─── Communication Log ───────────────────────────────────────────────────────

describe("GET /api/communications", () => {
  beforeEach(() => vi.clearAllMocks());
  afterEach(() => vi.restoreAllMocks());

  it("returns 401 when unauthenticated", async () => {
    mockUnauthorized();
    const { GET } = await import("@/app/api/communications/route");
    const req = new NextRequest("http://localhost/api/communications");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("returns paginated communications filtered by tenantId", async () => {
    mockSession();
    vi.mocked(prisma.message).mockReturnValue({
      findMany: vi.fn().mockResolvedValue([
        {
          id: "msg-1",
          senderType: "TENANT",
          channel: "EMAIL",
          communicationType: "MAINTENANCE_REQUEST",
          subject: "Fuite d'eau",
          isRead: false,
          createdAt: new Date(),
          tenant: { id: "tenant-1", firstName: "Marie", lastName: "Dupont" },
          conversation: { id: "conv-1" },
        },
      ]),
      count: vi.fn().mockResolvedValue(1),
    } as any);

    const { GET } = await import("@/app/api/communications/route");
    const req = new NextRequest(
      "http://localhost/api/communications?tenantId=tenant-1&page=1&limit=20"
    );
    const res = await GET(req);
    expect(res.status).toBe(200);
  });
});
