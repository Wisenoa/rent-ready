import { describe, it, expect } from "vitest";
import Decimal from "decimal.js";
import { calculateRentRevision } from "@/lib/irl-calculator";
import { computeFiscaliteLmnp } from "@/lib/tools/fiscalite-lmnp";
import { computeLoiJeanbrun } from "@/lib/tools/loi-jeanbrun";
import { leaseSchema, standaloneLeaseSchema } from "@/lib/validations/lease";

const d = (value: Decimal.Value) => new Decimal(value);
const lmnp = { recettesAnnuelles: d(12000), chargesDeductiblesAnnuelles: d(1000), interetsEmpruntAnnuels: d(0), valeurBienImmobilier: d(100000), valeurMobilierEtTravaux: d(0), tmi: 30 as const };
const jeanbrun = { prixAcquisition: d(100000), loyerMensuelHc: d(500), chargesAnnuellesDeductibles: d(5000), interetsEmpruntAnnuels: d(2000), secteur: "intermediaire" as const, tmi: 30 as const };
const lease = { propertyId: "property", tenantId: "tenant", rentAmount: 850, chargesAmount: 70, depositAmount: 850, startDate: "2026-10-01" };

describe("independent financial references, rules checked 18 October 2026", () => {
  it("does not produce NaN on zero rent", () => {
    const out = calculateRentRevision({ currentRent: 0, referenceIrlQuarter: "T3-2025", newIrlQuarter: "T3-2026" });
    expect(out.newRent).toBe(0);
    expect(out.percentageChange).toBe(0);
  });
  it.each([-1, Infinity, NaN])("rejects invalid IRL rent %s", rent => {
    expect(() => calculateRentRevision({ currentRent: rent, referenceIrlQuarter: "T3-2025", newIrlQuarter: "T3-2026" })).toThrow();
  });
  it("uses rounded cents for both rents and the displayed difference", () => {
    const out = calculateRentRevision({ currentRent: "850.005", referenceIrlQuarter: "T3-2025", newIrlQuarter: "T3-2026" });
    expect(out.currentRent).toBe(850.01);
    expect(d(out.newRent).minus(out.currentRent).toFixed(2)).toBe(d(out.difference).toFixed(2));
  });
  it("keeps the verified T3 2026 index", () => {
    const out = calculateRentRevision({ currentRent: 850, referenceIrlQuarter: "T3-2025", newIrlQuarter: "T3-2026" });
    expect(out.newIrl.value).toBe(148.06);
    expect(out.newRent).toBe(863.35);
    expect(out.difference).toBe(13.35);
  });
  it("applies 18.6% social levies to the 2026 LMNP micro-BIC base", () => {
    const out = computeFiscaliteLmnp(lmnp);
    expect(out.ok && out.result.microBic.prelevementsSociaux.toFixed(2)).toBe("1116.00");
    expect(out.ok && out.result.microBic.impotTotal.toFixed(2)).toBe("2916.00");
  });
  it.each([[83600, false], [83600.01, true]])("uses the 2026 micro-BIC threshold at %s euros", (revenue, over) => {
    const out = computeFiscaliteLmnp({ ...lmnp, recettesAnnuelles: d(revenue) });
    expect(out.ok && out.result.depassePlafondMicroBic).toBe(over);
  });
  it.each([d(-1), d(NaN), d(Infinity)])("refuses negative or non-finite deductible amounts (%s)", amount => {
    expect(computeFiscaliteLmnp({ ...lmnp, chargesDeductiblesAnnuelles: amount }).ok).toBe(false);
    expect(computeLoiJeanbrun({ ...jeanbrun, chargesAnnuellesDeductibles: amount }).ok).toBe(false);
  });
  it("deducts interest first when identifying the global-income deficit (BOFiP 4142)", () => {
    // Rents 6,000; interest 2,000; charges 5,000; amortisation 2,800.
    // Interest is fully absorbed; the remaining deficit 3,800 is from other deductions.
    const out = computeLoiJeanbrun(jeanbrun);
    expect(out.ok).toBe(true);
    if (!out.ok) return;
    expect(out.result.echeancier9Ans[0].deficitImputeRevenuGlobal.toFixed(2)).toBe("3800.00");
    expect(out.result.echeancier9Ans[0].deficitReportable.toFixed(2)).toBe("0.00");
    // The classical regime already deducts its 1,000 deficit (300 euros at 30%).
    expect(out.result.echeancier9Ans[0].economieVsFoncierClassique.toFixed(2)).toBe("840.00");
  });
});

describe("lease trust boundaries", () => {
  it.each(["propertyId", "tenantId"])("requires %s in every form", field => {
    const input = { ...lease, [field]: "" };
    expect(leaseSchema.safeParse(input).success).toBe(false);
    expect(standaloneLeaseSchema.safeParse(input).success).toBe(false);
  });
  it.each(["2026-02-30", "garbage"])("rejects impossible dates %s", startDate => {
    expect(leaseSchema.safeParse({ ...lease, startDate }).success).toBe(false);
  });
  it("rejects an inverted lease period", () => expect(leaseSchema.safeParse({ ...lease, endDate: "2026-09-01" }).success).toBe(false));
  it("applies the same deposit ceiling on all entry points", () => expect(leaseSchema.safeParse({ ...lease, depositAmount: 851 }).success).toBe(false));
});

import { calculateJeanbrun, calculateLmnpReel, compareTaxRegimes, type TaxSimulationInput } from '@/lib/tax-simulator';
const dashboardInput: TaxSimulationInput = { propertyValue: 100000, annualRent: 12000, annualCharges: 1000, loanInterest: 0, otherDeductions: 0, marginalTaxRate: 30, furnishedRental: false, jeanbrunEligible: true, jeanbrunRate: 3.5 };
describe('the paid fiscal screen uses the same statutory rules', () => {
  it('amortizes 80% of the price with the same statutory ceiling', () => {
    expect(calculateJeanbrun(dashboardInput).deductions).toBe(3800);
    expect(calculateJeanbrun(dashboardInput).socialLevies).toBe(1410.40);
    expect(calculateJeanbrun({ ...dashboardInput, propertyValue: 1000000 }).deductions).toBe(9000);
  });
  it('applies 17.2% to unfurnished real rental profits', () => {
    expect(calculateLmnpReel(dashboardInput).socialLevies).toBe(1892);
  });
  it('does not recommend an unchecked Jeanbrun option', () => {
    const out = compareTaxRegimes({ ...dashboardInput, jeanbrunEligible: false });
    expect(out.jeanbrun.eligible).toBe(false);
    expect(out.recommendation).not.toContain('Dispositif Jeanbrun');
  });
});
