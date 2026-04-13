import { describe, it, expect } from "vitest";
import {
  determineReceiptType,
  generateReceiptNumber,
} from "@/lib/payment-utils";

describe("determineReceiptType", () => {
  it("returns QUITTANCE when amount covers full rent + charges", () => {
    expect(determineReceiptType(1200, 1000, 200)).toBe("QUITTANCE");
  });

  it("returns QUITTANCE when amount exceeds total due", () => {
    expect(determineReceiptType(1250, 1000, 200)).toBe("QUITTANCE");
  });

  it("returns RECU when amount is less than total due", () => {
    expect(determineReceiptType(900, 1000, 200)).toBe("RECU");
  });

  it("returns RECU when amount equals exactly charges only", () => {
    expect(determineReceiptType(200, 1000, 200)).toBe("RECU");
  });

  it("handles zero charges", () => {
    expect(determineReceiptType(500, 500, 0)).toBe("QUITTANCE");
    expect(determineReceiptType(499, 500, 0)).toBe("RECU");
  });

  it("handles fractional amounts", () => {
    expect(determineReceiptType(1000.50, 800.25, 200.25)).toBe("QUITTANCE");
    expect(determineReceiptType(1000.24, 800.25, 200.25)).toBe("RECU");
  });
});

describe("generateReceiptNumber", () => {
  it("generates correct QUITTANCE prefix and format", () => {
    const date = new Date("2026-03-15");
    const result = generateReceiptNumber("QUITTANCE", date, 1);
    expect(result).toBe("QUI-2026-03-0001");
  });

  it("generates correct RECU prefix and format", () => {
    const date = new Date("2026-04-01");
    const result = generateReceiptNumber("RECU", date, 42);
    expect(result).toBe("REC-2026-04-0042");
  });

  it("pads sequence numbers correctly", () => {
    const date = new Date("2026-01-01");
    expect(generateReceiptNumber("QUITTANCE", date, 1)).toBe("QUI-2026-01-0001");
    expect(generateReceiptNumber("QUITTANCE", date, 99)).toBe("QUI-2026-01-0099");
    expect(generateReceiptNumber("QUITTANCE", date, 100)).toBe("QUI-2026-01-0100");
    expect(generateReceiptNumber("QUITTANCE", date, 9999)).toBe("QUI-2026-01-9999");
  });
});
