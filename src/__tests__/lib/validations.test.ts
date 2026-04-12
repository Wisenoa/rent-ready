import { describe, it, expect } from "vitest";
import { propertySchema } from "@/lib/validations/property";
import { tenantSchema } from "@/lib/validations/tenant";
import { leaseSchema } from "@/lib/validations/lease";
import { transactionSchema } from "@/lib/validations/transaction";

describe("propertySchema", () => {
  it("validates a correct property", () => {
    const valid = {
      name: "Appartement Rivoli",
      type: "APARTMENT",
      addressLine1: "12 Rue de Rivoli",
      city: "Paris",
      postalCode: "75001",
    };
    expect(propertySchema.safeParse(valid).success).toBe(true);
  });

  it("rejects empty name", () => {
    const invalid = {
      name: "",
      type: "APARTMENT",
      addressLine1: "12 Rue de Rivoli",
      city: "Paris",
      postalCode: "75001",
    };
    expect(propertySchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects invalid property type", () => {
    const invalid = {
      name: "Appartement",
      type: "CASTLE",
      addressLine1: "12 Rue",
      city: "Paris",
      postalCode: "75001",
    };
    expect(propertySchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts optional fields", () => {
    const valid = {
      name: "Studio",
      type: "STUDIO",
      addressLine1: "5 Rue de la Paix",
      city: "Lyon",
      postalCode: "69001",
      surface: 25,
      rooms: 1,
      description: "Petit studio lumineux",
    };
    expect(propertySchema.safeParse(valid).success).toBe(true);
  });
});

describe("tenantSchema", () => {
  it("validates a correct tenant", () => {
    const valid = {
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean@example.com",
      addressLine1: "12 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
    };
    expect(tenantSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects missing required fields", () => {
    const invalid = {
      firstName: "Jean",
      // missing lastName
      addressLine1: "12 Rue",
      city: "Paris",
      postalCode: "75001",
    };
    expect(tenantSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts optional phone", () => {
    const valid = {
      firstName: "Marie",
      lastName: "Martin",
      email: "marie@example.com",
      phone: "0601020304",
      addressLine1: "5 Avenue des Champs",
      city: "Paris",
      postalCode: "75008",
    };
    expect(tenantSchema.safeParse(valid).success).toBe(true);
  });
});

describe("leaseSchema", () => {
  it("validates a correct lease", () => {
    const valid = {
      propertyId: "prop_123",
      tenantId: "tenant_456",
      rentAmount: 850,
      chargesAmount: 50,
      depositAmount: 850,
      startDate: "2026-01-01",
      paymentDay: 1,
    };
    expect(leaseSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects negative rent amount", () => {
    const invalid = {
      propertyId: "prop_123",
      tenantId: "tenant_456",
      rentAmount: -100,
      chargesAmount: 50,
      depositAmount: 850,
      startDate: "2026-01-01",
    };
    expect(leaseSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects negative charges amount", () => {
    const invalid = {
      propertyId: "prop_123",
      tenantId: "tenant_456",
      rentAmount: 850,
      chargesAmount: -10,
      depositAmount: 850,
      startDate: "2026-01-01",
    };
    expect(leaseSchema.safeParse(invalid).success).toBe(false);
  });
});

describe("transactionSchema", () => {
  it("validates a correct transaction", () => {
    const valid = {
      leaseId: "lease_123",
      amount: 900,
      periodStart: "2026-01-01",
      periodEnd: "2026-01-31",
      dueDate: "2026-01-01",
    };
    expect(transactionSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects zero amount", () => {
    const invalid = {
      leaseId: "lease_123",
      amount: 0,
      periodStart: "2026-01-01",
      periodEnd: "2026-01-31",
      dueDate: "2026-01-01",
    };
    expect(transactionSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects missing leaseId", () => {
    const invalid = {
      amount: 900,
      periodStart: "2026-01-01",
      periodEnd: "2026-01-31",
      dueDate: "2026-01-01",
    };
    expect(transactionSchema.safeParse(invalid).success).toBe(false);
  });

  it("accepts optional paymentMethod", () => {
    const valid = {
      leaseId: "lease_123",
      amount: 900,
      periodStart: "2026-01-01",
      periodEnd: "2026-01-31",
      dueDate: "2026-01-01",
      paymentMethod: "DIRECT_DEBIT",
    };
    expect(transactionSchema.safeParse(valid).success).toBe(true);
  });
});
