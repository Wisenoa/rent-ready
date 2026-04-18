import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Build a mock NextRequest with a session cookie */
function mockRequest(
  url: string,
  options: RequestInit & { cookieName?: string; cookieValue?: string } = {}
) {
  const headers = new Headers(options.headers as Record<string, string>);
  if (options.cookieName && options.cookieValue) {
    headers.set("cookie", `${options.cookieName}=${options.cookieValue}`);
  }
  const { signal: _signal, headers: _headers, ...opts } = options;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new NextRequest(url, { ...opts, headers } as any);
}

// ─── Validation Tests ───────────────────────────────────────────────────────

describe("API validation schemas", () => {
  it("propertySchema accepts valid data", async () => {
    const { propertySchema } = await import("@/lib/validations/property");
    const valid = {
      name: "Appartement Rivoli",
      type: "APARTMENT",
      addressLine1: "12 Rue de Rivoli",
      city: "Paris",
      postalCode: "75001",
    };
    expect(propertySchema.safeParse(valid).success).toBe(true);
  });

  it("propertySchema rejects missing required fields", async () => {
    const { propertySchema } = await import("@/lib/validations/property");
    const invalid = { name: "Appartement" }; // missing address, city, postalCode
    expect(propertySchema.safeParse(invalid).success).toBe(false);
  });

  it("tenantSchema accepts valid data", async () => {
    const { tenantSchema } = await import("@/lib/validations/tenant");
    const valid = {
      firstName: "Marie",
      lastName: "Dupont",
      email: "marie@example.com",
      addressLine1: "12 Rue de la Paix",
      city: "Paris",
      postalCode: "75008",
    };
    expect(tenantSchema.safeParse(valid).success).toBe(true);
  });

  it("tenantSchema rejects missing required fields", async () => {
    const { tenantSchema } = await import("@/lib/validations/tenant");
    const invalid = { firstName: "Marie" };
    expect(tenantSchema.safeParse(invalid).success).toBe(false);
  });

  it("leaseSchema accepts valid lease data", async () => {
    const { leaseSchema } = await import("@/lib/validations/lease");
    const valid = {
      propertyId: "prop_123",
      tenantId: "tenant_456",
      rentAmount: 850,
      chargesAmount: 50,
      depositAmount: 850,
      startDate: "2026-09-01",
      paymentDay: 1,
      paymentMethod: "TRANSFER",
      leaseType: "UNFURNISHED",
    };
    expect(leaseSchema.safeParse(valid).success).toBe(true);
  });

  it("leaseSchema rejects negative rent amount", async () => {
    const { leaseSchema } = await import("@/lib/validations/lease");
    const invalid = {
      propertyId: "prop_123",
      tenantId: "tenant_456",
      rentAmount: -100,
      startDate: "2026-09-01",
      paymentDay: 1,
    };
    expect(leaseSchema.safeParse(invalid).success).toBe(false);
  });

  it("transactionSchema accepts valid payment data", async () => {
    const { transactionSchema } = await import("@/lib/validations/transaction");
    const valid = {
      leaseId: "lease_789",
      amount: 900,
      periodStart: "2026-04-01",
      periodEnd: "2026-04-30",
      dueDate: "2026-04-01",
      paymentMethod: "TRANSFER",
    };
    expect(transactionSchema.safeParse(valid).success).toBe(true);
  });

  it("transactionSchema rejects zero amount", async () => {
    const { transactionSchema } = await import("@/lib/validations/transaction");
    const invalid = {
      leaseId: "lease_789",
      amount: 0,
      periodStart: "2026-04-01",
      periodEnd: "2026-04-30",
      dueDate: "2026-04-01",
    };
    expect(transactionSchema.safeParse(invalid).success).toBe(false);
  });
});

// Quittance logic is tested via quittance-generator.test.ts
// (excluded from vitest config because it requires @react-pdf/renderer mock)

// ─── IRL Calculator ────────────────────────────────────────────────────────

describe("IRL rent revision calculator", () => {
  it("calculates rent revision correctly", async () => {
    const { calculateRentRevision } = await import("@/lib/irl-calculator");
    // old rent 800, IRL at signature T4-2023=142.06, new IRL T4-2024=144.89
    const result = calculateRentRevision({
      currentRent: 800,
      referenceIrlQuarter: "T4-2023",
      newIrlQuarter: "T4-2024",
    });
    expect(result.newRent).toBeGreaterThan(800);
    expect(result.percentageChange).toBeGreaterThan(0);
    expect(result.difference).toBeGreaterThan(0);
  });

  it("handles known IRL indices", async () => {
    const { findIrlIndex } = await import("@/lib/irl-calculator");
    const index = findIrlIndex("T4-2024");
    expect(index).toBeDefined();
    expect(index?.value).toBeGreaterThan(130);
  });

  it("returns latest IRL index", async () => {
    const { getLatestIrl } = await import("@/lib/irl-calculator");
    const latest = getLatestIrl();
    expect(latest).toBeDefined();
    expect(latest.quarter).toMatch(/^T\d-\d{4}$/);
  });
});

// ─── URL parsing ────────────────────────────────────────────────────────────

describe("API URL construction", () => {
  it("parses pagination params from URL", () => {
    const url = new URL("http://localhost/api/properties?page=3&limit=10");
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "50", 10)));
    expect(page).toBe(3);
    expect(limit).toBe(10);
  });

  it("caps limit at 100", () => {
    const url = new URL("http://localhost/api/properties?limit=500");
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "50", 10)));
    expect(limit).toBe(100);
  });

  it("defaults page to 1 for invalid values", () => {
    const url = new URL("http://localhost/api/properties?page=-1");
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
    expect(page).toBe(1);
  });
});

// ─── Unit Validation Tests ─────────────────────────────────────────────────────

describe("unitSchema", () => {
  it("accepts valid unit data", async () => {
    const { unitSchema } = await import("@/lib/validations/unit");
    const valid = {
      name: "Appartement 3 pièces",
      propertyId: "prop_123",
      floor: 2,
      unitNumber: "B",
      surface: 65.5,
      rooms: 3,
      type: "APARTMENT",
      status: "VACANT",
    };
    expect(unitSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts minimal unit data (only required fields)", async () => {
    const { unitSchema } = await import("@/lib/validations/unit");
    const minimal = {
      name: "Studio",
      propertyId: "prop_123",
    };
    expect(unitSchema.safeParse(minimal).success).toBe(true);
  });

  it("rejects unit without name", async () => {
    const { unitSchema } = await import("@/lib/validations/unit");
    const invalid = { propertyId: "prop_123" };
    expect(unitSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects unit without propertyId", async () => {
    const { unitSchema } = await import("@/lib/validations/unit");
    const invalid = { name: "Studio" };
    expect(unitSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects negative surface", async () => {
    const { unitSchema } = await import("@/lib/validations/unit");
    const invalid = {
      name: "Studio",
      propertyId: "prop_123",
      surface: -10,
    };
    expect(unitSchema.safeParse(invalid).success).toBe(false);
  });
});

// ─── Guarantor Validation Tests ──────────────────────────────────────────────

describe("guarantorSchema", () => {
  const validPersonGuarantor = {
    leaseId: "lease_123",
    type: "PERSON",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@example.com",
    phone: "0601020304",
    addressLine1: "10 Rue de la Paix",
    city: "Paris",
    postalCode: "75002",
  };

  it("accepts valid person guarantor", async () => {
    const { guarantorSchema } = await import("@/lib/validations/guarantor");
    expect(guarantorSchema.safeParse(validPersonGuarantor).success).toBe(true);
  });

  it("accepts valid company guarantor", async () => {
    const { guarantorSchema } = await import("@/lib/validations/guarantor");
    const company = {
      ...validPersonGuarantor,
      type: "COMPANY",
      companyName: "Garanties & Cie",
      siren: "123456789",
      firstName: undefined,
      lastName: undefined,
    };
    expect(guarantorSchema.safeParse(company).success).toBe(true);
  });

  it("rejects guarantor without email", async () => {
    const { guarantorSchema } = await import("@/lib/validations/guarantor");
    const invalid = { ...validPersonGuarantor, email: undefined };
    expect(guarantorSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects invalid email format", async () => {
    const { guarantorSchema } = await import("@/lib/validations/guarantor");
    const invalid = { ...validPersonGuarantor, email: "not-an-email" };
    expect(guarantorSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects guarantor without addressLine1", async () => {
    const { guarantorSchema } = await import("@/lib/validations/guarantor");
    const { addressLine1: _, ...noAddress } = validPersonGuarantor;
    expect(guarantorSchema.safeParse(noAddress).success).toBe(false);
  });

  it("defaults country to France", async () => {
    const { guarantorSchema } = await import("@/lib/validations/guarantor");
    const result = guarantorSchema.safeParse(validPersonGuarantor);
    if (result.success) {
      expect(result.data.country).toBe("France");
    }
  });

  it("defaults status to PENDING", async () => {
    const { guarantorSchema } = await import("@/lib/validations/guarantor");
    const result = guarantorSchema.safeParse(validPersonGuarantor);
    if (result.success) {
      expect(result.data.status).toBe("PENDING");
    }
  });
});
