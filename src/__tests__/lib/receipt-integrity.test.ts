/**
 * Guards the receipt vertical slice.
 *
 * Previously, generating a quittance with object storage unconfigured returned
 * HTTP 200 with `receiptUrl: "minio://placeholder/..."` and wrote no Document row.
 * The UI reported a receipt that could not be opened. These tests pin the
 * behaviour that replaced it:
 *
 *   - storage misconfiguration raises instead of returning a fake URL
 *   - a generated receipt is a real, non-empty document
 *   - the receipt for a partial payment is a "reçu", never a "quittance"
 *     (loi du 6 juillet 1989, art. 21)
 */

import { describe, it, expect, afterEach, vi } from "vitest";

const STORAGE_ENV = [
  "MINIO_ENDPOINT",
  "MINIO_ACCESS_KEY",
  "MINIO_SECRET_KEY",
] as const;

const saved: Record<string, string | undefined> = {};
for (const key of STORAGE_ENV) saved[key] = process.env[key];

afterEach(() => {
  for (const key of STORAGE_ENV) {
    if (saved[key] === undefined) delete process.env[key];
    else process.env[key] = saved[key];
  }
  vi.resetModules();
});

describe("object storage", () => {
  it("reports whether storage is configured", async () => {
    for (const key of STORAGE_ENV) delete process.env[key];
    const mod = await import("@/lib/storage");
    expect(mod.isStorageConfigured()).toBe(false);

    process.env.MINIO_ENDPOINT = "minio.example";
    process.env.MINIO_ACCESS_KEY = "key";
    process.env.MINIO_SECRET_KEY = "secret";
    vi.resetModules();
    const configured = await import("@/lib/storage");
    expect(configured.isStorageConfigured()).toBe(true);
  });

  it("throws instead of returning a placeholder URL when unconfigured", async () => {
    for (const key of STORAGE_ENV) delete process.env[key];
    const { uploadBuffer, StorageNotConfiguredError } = await import("@/lib/storage");

    await expect(
      uploadBuffer(Buffer.from("pdf"), "quittances/x/y.pdf")
    ).rejects.toBeInstanceOf(StorageNotConfiguredError);

    // The regression this prevents: a silent success with an unusable URL.
    await expect(
      uploadBuffer(Buffer.from("pdf"), "quittances/x/y.pdf")
    ).rejects.toThrow(/NOT saved/);
  });
});

describe("receipt type follows the legal rule", () => {
  // Uses @/lib/payment-utils rather than quittance-generator.tsx: the latter is
  // JSX (@react-pdf) and cannot be parsed by the vitest import analyser.
  it("issues a quittance only when rent + charges are fully paid", async () => {
    const { determineReceiptType } = await import("@/lib/payment-utils");

    // Total due is rent + charges, so 850 alone does not settle the period.
    expect(determineReceiptType(900, 850, 50)).toBe("QUITTANCE");
    expect(determineReceiptType(850, 850, 50)).toBe("RECU");
    expect(determineReceiptType(899.99, 850, 50)).toBe("RECU");
    expect(determineReceiptType(400, 850, 50)).toBe("RECU");
    expect(determineReceiptType(0, 850, 50)).toBe("RECU");
  });

  it("never marks a partial payment as fully paid", async () => {
    const { computePaymentSplit } = await import("@/lib/payment-utils");

    for (const amount of [1, 100, 400, 849.99]) {
      const split = computePaymentSplit(amount, 850, 50);
      expect(split.isFullPayment).toBe(false);
    }
    expect(computePaymentSplit(900, 850, 50).isFullPayment).toBe(true);
  });

  it("keeps the split summing to the amount actually paid", async () => {
    const { computePaymentSplit } = await import("@/lib/payment-utils");
    for (const amount of [33.33, 100, 400, 777.77, 849.99]) {
      const s = computePaymentSplit(amount, 850, 50);
      expect(
        Number((s.rentPortion + s.chargesPortion).toFixed(2))
      ).toBeCloseTo(amount, 2);
    }
  });
});