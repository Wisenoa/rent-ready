// Paid fiscal comparison delegates amortisation and Jeanbrun rules to the public engines.
import Decimal from "decimal.js";
import { computeFiscaliteLmnp } from "@/lib/tools/fiscalite-lmnp";
import { computeLoiJeanbrun } from "@/lib/tools/loi-jeanbrun";
export const SOCIAL_LEVIES_RATE = 0.186;
export const MICRO_BIC_ABATEMENT = 0.5;
export const MICRO_FONCIER_ABATEMENT = 0.3;
export const JEANBRUN_DURATION_YEARS = 9;
export const MARGINAL_TAX_RATES = [0, 11, 30, 41, 45] as const;
export type MarginalTaxRate = (typeof MARGINAL_TAX_RATES)[number];
export const JEANBRUN_RATES = [3.5, 4.5, 5.5] as const;
export type JeanbrunRate = (typeof JEANBRUN_RATES)[number];

export interface TaxSimulationInput {
  propertyValue: number; // Valeur du bien (€)
  annualRent: number; // Loyer annuel brut (€)
  annualCharges: number; // Charges annuelles (€)
  loanInterest: number; // Intérêts d'emprunt annuels (€)
  otherDeductions: number; // Autres charges déductibles (€)
  marginalTaxRate: MarginalTaxRate; // Taux marginal d'imposition
  furnishedRental: boolean; // Location meublée (LMNP) ou nue
  jeanbrunEligible: boolean; // Éligible au dispositif Jeanbrun
  jeanbrunRate: number; // Taux d'amortissement Jeanbrun (3.5 to 5.5)
}

export interface TaxSimulationResult {
  regime: string;
  eligible: boolean;
  grossIncome: number;
  deductions: number;
  taxableIncome: number;
  incomeTax: number;
  socialLevies: number; // Prélèvements sociaux
  totalTax: number;
  netIncome: number;
  effectiveTaxRate: number; // As a percentage (0–100)
}

export interface TaxComparison {
  lmnpMicroBic: TaxSimulationResult; // LMNP Micro-BIC (50% abattement)
  lmnpReel: TaxSimulationResult; // LMNP Réel
  jeanbrun: TaxSimulationResult; // Dispositif Jeanbrun
  recommendation: string; // Which regime is best
  annualSavings: number; // Savings vs worst option
}

const d = (value: Decimal.Value) => new Decimal(value);
const money = (value: Decimal) => value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP);
function amounts(input: TaxSimulationInput) {
  for (const value of [input.propertyValue, input.annualRent, input.annualCharges, input.loanInterest, input.otherDeductions]) {
    if (!Number.isFinite(value) || value < 0) throw new Error("Les montants doivent être positifs ou nuls et finis.");
  }
  return { gross: d(input.annualRent), charges: d(input.annualCharges).plus(input.otherDeductions), interest: d(input.loanInterest) };
}
function result(input: TaxSimulationInput, regime: string, taxable: Decimal, deductions: Decimal, socialRate: string, eligible = true): TaxSimulationResult {
  const { gross, charges, interest } = amounts(input);
  const incomeTax = money(taxable.times(input.marginalTaxRate).div(100));
  const socialLevies = money(taxable.times(socialRate));
  const totalTax = incomeTax.plus(socialLevies);
  return { regime, eligible, grossIncome: money(gross).toNumber(), deductions: money(deductions).toNumber(),
    taxableIncome: money(taxable).toNumber(), incomeTax: incomeTax.toNumber(), socialLevies: socialLevies.toNumber(),
    totalTax: totalTax.toNumber(), netIncome: money(gross.minus(charges).minus(interest).minus(totalTax)).toNumber(),
    effectiveTaxRate: gross.gt(0) ? money(totalTax.div(gross).times(100)).toNumber() : 0 };
}
function lmnp(input: TaxSimulationInput) {
  const { gross, charges, interest } = amounts(input);
  return computeFiscaliteLmnp({ recettesAnnuelles: gross, chargesDeductiblesAnnuelles: charges,
    interetsEmpruntAnnuels: interest, valeurBienImmobilier: d(input.propertyValue),
    valeurMobilierEtTravaux: d(0), tmi: input.marginalTaxRate });
}
export function calculateLmnpMicroBic(input: TaxSimulationInput): TaxSimulationResult {
  const { gross } = amounts(input);
  const outcome = lmnp(input);
  const deductions = input.furnishedRental
    ? outcome.ok ? outcome.result.microBic.abattement : Decimal.min(gross, Decimal.max(305, money(gross.times("0.5"))))
    : money(gross.times("0.3"));
  const eligible = input.furnishedRental ? gross.lte(83600) : gross.lte(15000);
  return result(input, input.furnishedRental ? "LMNP Micro-BIC" : "Micro-Foncier", gross.minus(deductions), deductions, input.furnishedRental ? "0.186" : "0.172", eligible);
}
export function calculateLmnpReel(input: TaxSimulationInput): TaxSimulationResult {
  const { gross, charges, interest } = amounts(input);
  const outcome = lmnp(input);
  const amortisation = input.furnishedRental && outcome.ok ? outcome.result.reelSimplifie.amortissementImpute : d(0);
  const deductions = charges.plus(interest).plus(amortisation);
  return result(input, input.furnishedRental ? "LMNP Réel" : "Foncier Réel", Decimal.max(0, gross.minus(deductions)), deductions, input.furnishedRental ? "0.186" : "0.172");
}
export function calculateJeanbrun(input: TaxSimulationInput): TaxSimulationResult {
  const { gross, charges, interest } = amounts(input);
  const secteur = input.jeanbrunRate === 5.5 ? "tres-social" : input.jeanbrunRate === 4.5 ? "social" : "intermediaire";
  const outcome = computeLoiJeanbrun({ prixAcquisition: d(input.propertyValue), loyerMensuelHc: gross.div(12),
    chargesAnnuellesDeductibles: charges, interetsEmpruntAnnuels: interest, secteur, tmi: input.marginalTaxRate });
  const row = outcome.ok ? outcome.result.echeancier9Ans[0] : null;
  const taxable = row?.baseImposableFoncier ?? Decimal.max(0, gross.minus(charges).minus(interest));
  return result(input, "Dispositif Jeanbrun (neuf)", taxable, charges.plus(interest).plus(row?.amortissementAnnuel ?? 0), "0.172", input.jeanbrunEligible && outcome.ok);
}
export function compareTaxRegimes(input: TaxSimulationInput): TaxComparison {
  const lmnpMicroBic = calculateLmnpMicroBic(input);
  const lmnpReel = calculateLmnpReel(input);
  const jeanbrun = calculateJeanbrun(input);
  const eligible = [lmnpMicroBic, lmnpReel, jeanbrun].filter(row => row.eligible).sort((a, b) => d(a.totalTax).cmp(b.totalTax));
  const best = eligible[0];
  const worst = eligible[eligible.length - 1];
  return { lmnpMicroBic, lmnpReel, jeanbrun,
    recommendation: `${best.regime} présente l’impôt annuel estimé le plus faible parmi les options retenues. Cette comparaison à TMI constante ne chiffre pas les économies sur le revenu global, les reports pluriannuels ni l’impôt à la revente. L’éligibilité reste à vérifier.`,
    annualSavings: money(d(worst.totalTax).minus(best.totalTax)).toNumber() };
}
