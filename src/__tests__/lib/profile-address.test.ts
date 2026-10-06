/**
 * The landlord address on a quittance.
 *
 * `User.addressLine1 / postalCode / city` default to "" in the schema, and until
 * this change no screen anywhere let a landlord fill them in: registration
 * collects only name, email and password, and Better Auth is configured with
 * `addressLine1` as `input: false`. A beta landlord could therefore generate a
 * quittance whose "bailleur" block was empty — a document the tenant cannot use.
 *
 * Two things are pinned here:
 *   - the profile form's Zod contract (a complete FR address, or nothing)
 *   - generateQuittance refuses, with an actionable message, when the address is
 *     incomplete, and does so without allocating a receipt number or writing a
 *     document.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

const { prismaMock, allocateMock, pdfMock } = vi.hoisted(() => ({
  prismaMock: {
    transaction: {
      findUnique: vi.fn(),
      aggregate: vi.fn(),
      update: vi.fn(),
    },
  },
  allocateMock: vi.fn(),
  pdfMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: prismaMock }));
vi.mock("@/lib/auth", () => ({ getCurrentUserId: async () => "landlord-1" }));
// @/lib/quittance-generator is deliberately NOT mocked. It is a .tsx with JSX,
// and it IS importable: @vitejs/plugin-react (vitest.config.ts:23) compiles the
// JSX and @react-pdf/renderer@4.4.1 is really installed in node_modules, so the
// import resolves on its own. Verified by importing the module for real (exports
// QuittancePDF, determineReceiptType, determineReceiptTypeCumulative,
// generateReceiptNumber), with and without the test alias below.
//
// An earlier version of this file mocked it on the false belief that the vitest
// import analyser could not parse JSX. That mock is gone; the address guard runs
// before determineReceiptTypeCumulative anyway, so nothing here depended on it.
//
// Do NOT read the `@react-pdf/renderer` alias (vitest.config.ts:40) as a fix for
// module resolution — it is not, and the two are easy to confuse. It swaps the
// real PDF engine for the DOM-free stub in __tests__/__mocks__ so tests can read
// the strings and recorded renderings of the receipt. Deleting it leaves this
// file green but costs 8 tests in quittance-reproducible.test.ts, which asserts
// on what the document actually printed. That, not resolution, is why it stays.
vi.mock("@/lib/receipt-number", () => ({
  allocateReceiptNumber: allocateMock,
}));
vi.mock("@/lib/actions/quittance-pdf-server", () => ({
  generateAndUploadQuittancePdf: pdfMock,
}));

const valid = {
  firstName: "Marie",
  lastName: "Durand",
  phone: "",
  addressLine1: "12 rue de la Paix",
  addressLine2: "",
  postalCode: "75002",
  city: "Paris",
};

describe("profileSchema", () => {
  it("accepts a complete French address", async () => {
    const { profileSchema } = await import("@/lib/validations/profile");
    expect(profileSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects an incomplete address, field by field", async () => {
    const { profileSchema } = await import("@/lib/validations/profile");

    // These are the three fields printed in the bailleur block. An empty one is
    // the exact state a landlord was in before this card.
    expect(
      profileSchema.safeParse({ ...valid, addressLine1: "" }).success
    ).toBe(false);
    expect(profileSchema.safeParse({ ...valid, city: "" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...valid, postalCode: "" }).success).toBe(
      false
    );
  });

  it("rejects a postal code that is not five digits", async () => {
    const { profileSchema } = await import("@/lib/validations/profile");
    expect(profileSchema.safeParse({ ...valid, postalCode: "75" }).success).toBe(
      false
    );
    expect(profileSchema.safeParse({ ...valid, postalCode: "7500A" }).success).toBe(
      false
    );
  });

  it("rejects a missing landlord name", async () => {
    const { profileSchema } = await import("@/lib/validations/profile");
    expect(profileSchema.safeParse({ ...valid, firstName: "" }).success).toBe(
      false
    );
    expect(profileSchema.safeParse({ ...valid, lastName: "" }).success).toBe(
      false
    );
  });
});

/** A paid transaction, owned by the session user, with the given landlord row. */
function paidTransaction(landlord: {
  addressLine1: string;
  city: string;
  postalCode: string;
}) {
  return {
    id: "tx-1",
    userId: "landlord-1",
    leaseId: "lease-1",
    paidAt: new Date("2026-10-01"),
    createdAt: new Date("2026-10-01"),
    amount: 900,
    periodStart: new Date("2026-10-01"),
    periodEnd: new Date("2026-10-31"),
    receiptType: null,
    lease: {
      rentAmount: 850,
      chargesAmount: 50,
      property: {
        addressLine1: "5 rue du-test",
        addressLine2: null,
        postalCode: "69001",
        city: "Lyon",
      },
      tenant: {
        firstName: "Jean",
        lastName: "Dupont",
        addressLine1: "3 rue du-locataire",
        addressLine2: null,
        city: "Lyon",
        postalCode: "69002",
      },
    },
    user: {
      firstName: "Marie",
      lastName: "Durand",
      addressLine2: null,
      ...landlord,
    },
  };
}

describe("generateQuittance requires a complete landlord address", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prismaMock.transaction.aggregate.mockResolvedValue({ _sum: { amount: null } });
  });

  it("refuses when the landlord address is empty, and says what to do", async () => {
    prismaMock.transaction.findUnique.mockResolvedValue(
      paidTransaction({ addressLine1: "", city: "", postalCode: "" })
    );

    const { generateQuittance } = await import(
      "@/lib/actions/quittance-actions"
    );
    const result = await generateQuittance("tx-1");

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/adresse/i);
    // Actionable: it points at the screen where the problem is fixable.
    expect(result.error).toMatch(/profil/i);
  });

  it("refuses when only the postal code is missing", async () => {
    prismaMock.transaction.findUnique.mockResolvedValue(
      paidTransaction({ addressLine1: "12 rue de la Paix", city: "Paris", postalCode: "" })
    );

    const { generateQuittance } = await import(
      "@/lib/actions/quittance-actions"
    );
    const result = await generateQuittance("tx-1");

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/adresse/i);
  });

  it("consumes no receipt number and writes no document when it refuses", async () => {
    prismaMock.transaction.findUnique.mockResolvedValue(
      paidTransaction({ addressLine1: "", city: "Paris", postalCode: "75002" })
    );

    const { generateQuittance } = await import(
      "@/lib/actions/quittance-actions"
    );
    await generateQuittance("tx-1");

    // Burning a number on a document that was never issued would leave gaps in
    // the landlord's receipt sequence.
    expect(allocateMock).not.toHaveBeenCalled();
    expect(pdfMock).not.toHaveBeenCalled();
    expect(prismaMock.transaction.update).not.toHaveBeenCalled();
  });

  it("still blocks a landlord who cannot pay a receipt for someone else's transaction", async () => {
    // Ownership is checked before the address, so an address check can never
    // become an oracle for "does this transaction exist for another user".
    prismaMock.transaction.findUnique.mockResolvedValue({
      ...paidTransaction({ addressLine1: "", city: "", postalCode: "" }),
      userId: "someone-else",
    });

    const { generateQuittance } = await import(
      "@/lib/actions/quittance-actions"
    );
    const result = await generateQuittance("tx-1");

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/autorisé/);
  });
});
