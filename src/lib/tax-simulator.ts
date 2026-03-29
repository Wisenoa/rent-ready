// Tax simulation engine — LMNP classique vs Dispositif Jeanbrun (2026)
// Pure TypeScript, no server-only imports — runs in the browser

// ─── Constants (2026) ───────────────────────────────────────────────

export const SOCIAL_LEVIES_RATE = 0.186; // 18.6% (CSG 10.6% + CRDS 0.5% + Solidarité 7.5%)
export const MICRO_BIC_ABATEMENT = 0.5; // 50% abattement for meublé
export const MICRO_FONCIER_ABATEMENT = 0.3; // 30% for location nue
export const JEANBRUN_DURATION_YEARS = 9;

export const MARGINAL_TAX_RATES = [0, 11, 30, 41, 45] as const;
export type MarginalTaxRate = (typeof MARGINAL_TAX_RATES)[number];

export const JEANBRUN_RATES = [3.5, 4.5, 5.5] as const;
export type JeanbrunRate = (typeof JEANBRUN_RATES)[number];

// ─── Types ──────────────────────────────────────────────────────────

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

// ─── Helpers ────────────────────────────────────────────────────────

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function clampPositive(value: number): number {
  return Math.max(0, value);
}

// ─── LMNP Micro-BIC ────────────────────────────────────────────────

export function calculateLmnpMicroBic(
  input: TaxSimulationInput,
): TaxSimulationResult {
  const grossIncome = round2(input.annualRent);
  const abatement = input.furnishedRental
    ? MICRO_BIC_ABATEMENT
    : MICRO_FONCIER_ABATEMENT;
  const deductions = round2(grossIncome * abatement);
  const taxableIncome = round2(clampPositive(grossIncome - deductions));

  const marginalRate = input.marginalTaxRate / 100;
  const incomeTax = round2(taxableIncome * marginalRate);
  const socialLevies = round2(taxableIncome * SOCIAL_LEVIES_RATE);
  const totalTax = round2(incomeTax + socialLevies);
  const netIncome = round2(grossIncome - totalTax);

  const effectiveTaxRate =
    grossIncome > 0 ? round2((totalTax / grossIncome) * 100) : 0;

  return {
    regime: input.furnishedRental ? "LMNP Micro-BIC" : "Micro-Foncier",
    grossIncome,
    deductions,
    taxableIncome,
    incomeTax,
    socialLevies,
    totalTax,
    netIncome,
    effectiveTaxRate,
  };
}

// ─── LMNP Réel ─────────────────────────────────────────────────────

export function calculateLmnpReel(
  input: TaxSimulationInput,
): TaxSimulationResult {
  const grossIncome = round2(input.annualRent);

  // Amortissement du bien sur ~25-30 ans (~3.33%/an hors terrain)
  const amortissement = input.furnishedRental
    ? round2(input.propertyValue * 0.0333)
    : 0;

  const totalDeductions = round2(
    input.annualCharges +
      input.loanInterest +
      input.otherDeductions +
      amortissement,
  );

  const taxableIncome = round2(clampPositive(grossIncome - totalDeductions));
  const marginalRate = input.marginalTaxRate / 100;
  const incomeTax = round2(taxableIncome * marginalRate);
  const socialLevies = round2(taxableIncome * SOCIAL_LEVIES_RATE);
  const totalTax = round2(incomeTax + socialLevies);

  // Net income = gross - total tax - real charges (not amortissement which is non-cash)
  const cashCharges = round2(
    input.annualCharges + input.loanInterest + input.otherDeductions,
  );
  const netIncome = round2(grossIncome - totalTax - cashCharges);

  const effectiveTaxRate =
    grossIncome > 0 ? round2((totalTax / grossIncome) * 100) : 0;

  return {
    regime: input.furnishedRental ? "LMNP Réel" : "Foncier Réel",
    grossIncome,
    deductions: totalDeductions,
    taxableIncome,
    incomeTax,
    socialLevies,
    totalTax,
    netIncome,
    effectiveTaxRate,
  };
}

// ─── Dispositif Jeanbrun ────────────────────────────────────────────

export function calculateJeanbrun(
  input: TaxSimulationInput,
): TaxSimulationResult {
  const grossIncome = round2(input.annualRent);

  // Jeanbrun amortissement: propertyValue × jeanbrunRate% per year over 9 years
  const jeanbrunAmortissement = round2(
    input.propertyValue * (input.jeanbrunRate / 100),
  );

  const totalDeductions = round2(
    input.annualCharges +
      input.loanInterest +
      input.otherDeductions +
      jeanbrunAmortissement,
  );

  const taxableIncome = round2(clampPositive(grossIncome - totalDeductions));
  const marginalRate = input.marginalTaxRate / 100;
  const incomeTax = round2(taxableIncome * marginalRate);
  const socialLevies = round2(taxableIncome * SOCIAL_LEVIES_RATE);
  const totalTax = round2(incomeTax + socialLevies);

  const cashCharges = round2(
    input.annualCharges + input.loanInterest + input.otherDeductions,
  );
  const netIncome = round2(grossIncome - totalTax - cashCharges);

  const effectiveTaxRate =
    grossIncome > 0 ? round2((totalTax / grossIncome) * 100) : 0;

  return {
    regime: "Dispositif Jeanbrun",
    grossIncome,
    deductions: totalDeductions,
    taxableIncome,
    incomeTax,
    socialLevies,
    totalTax,
    netIncome,
    effectiveTaxRate,
  };
}

// ─── Comparison ─────────────────────────────────────────────────────

export function compareTaxRegimes(input: TaxSimulationInput): TaxComparison {
  const lmnpMicroBic = calculateLmnpMicroBic(input);
  const lmnpReel = calculateLmnpReel(input);
  const jeanbrun = calculateJeanbrun(input);

  const results = [
    { key: "lmnpMicroBic" as const, result: lmnpMicroBic },
    { key: "lmnpReel" as const, result: lmnpReel },
    { key: "jeanbrun" as const, result: jeanbrun },
  ];

  // Best = lowest total tax
  const sorted = [...results].sort(
    (a, b) => a.result.totalTax - b.result.totalTax,
  );
  const best = sorted[0];
  const worst = sorted[sorted.length - 1];
  const annualSavings = round2(worst.result.totalTax - best.result.totalTax);

  const recommendations: Record<string, string> = {
    lmnpMicroBic: `Le régime ${lmnpMicroBic.regime} est le plus avantageux pour votre situation. Sa simplicité administrative en fait un excellent choix.`,
    lmnpReel: `Le régime ${lmnpReel.regime} est le plus avantageux. La déduction des charges réelles et de l'amortissement réduit significativement votre base imposable.`,
    jeanbrun: `Le Dispositif Jeanbrun est le plus avantageux grâce à son taux d'amortissement majoré de ${input.jeanbrunRate}%. Sur ${JEANBRUN_DURATION_YEARS} ans, l'économie est considérable.`,
  };

  return {
    lmnpMicroBic,
    lmnpReel,
    jeanbrun,
    recommendation: recommendations[best.key],
    annualSavings,
  };
}
