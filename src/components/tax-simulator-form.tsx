"use client";

import { useMemo, useState } from "react";
import {
  TrendingDown,
  TrendingUp,
  Award,
  Euro,
  CheckCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
  type TaxSimulationInput,
  type TaxSimulationResult,
  type MarginalTaxRate,
  compareTaxRegimes,
  MARGINAL_TAX_RATES,
  JEANBRUN_RATES,
  SOCIAL_LEVIES_RATE,
  JEANBRUN_DURATION_YEARS,
} from "@/lib/tax-simulator";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";

// ─── Helpers ────────────────────────────────────────────────────────

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const currencyFormatterPrecise = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatCurrency(amount: number, precise = false): string {
  return precise
    ? currencyFormatterPrecise.format(amount)
    : currencyFormatter.format(amount);
}

function formatPercent(value: number): string {
  return `${value.toFixed(1)} %`;
}

// ─── Default input values ───────────────────────────────────────────

const DEFAULT_INPUT: TaxSimulationInput = {
  propertyValue: 200000,
  annualRent: 12000,
  annualCharges: 2000,
  loanInterest: 3000,
  otherDeductions: 500,
  marginalTaxRate: 30,
  furnishedRental: true,
  jeanbrunEligible: true,
  jeanbrunRate: 4.5,
};

// ─── Component ──────────────────────────────────────────────────────

export function TaxSimulatorForm() {
  const [input, setInput] = useState<TaxSimulationInput>(DEFAULT_INPUT);

  const comparison = useMemo(() => compareTaxRegimes(input), [input]);

  function updateField<K extends keyof TaxSimulationInput>(
    key: K,
    value: TaxSimulationInput[K],
  ) {
    setInput((prev) => ({ ...prev, [key]: value }));
  }

  function handleNumberChange(
    key: keyof TaxSimulationInput,
    raw: string,
  ) {
    const parsed = parseFloat(raw);
    updateField(key, isNaN(parsed) ? 0 : parsed);
  }

  const results: Array<{
    key: string;
    result: TaxSimulationResult;
    isBest: boolean;
  }> = [
    {
      key: "micro",
      result: comparison.lmnpMicroBic,
      isBest:
        comparison.lmnpMicroBic.totalTax <=
          comparison.lmnpReel.totalTax &&
        comparison.lmnpMicroBic.totalTax <=
          comparison.jeanbrun.totalTax,
    },
    {
      key: "reel",
      result: comparison.lmnpReel,
      isBest:
        comparison.lmnpReel.totalTax <
          comparison.lmnpMicroBic.totalTax &&
        comparison.lmnpReel.totalTax <= comparison.jeanbrun.totalTax,
    },
    {
      key: "jeanbrun",
      result: comparison.jeanbrun,
      isBest:
        comparison.jeanbrun.totalTax <
          comparison.lmnpMicroBic.totalTax &&
        comparison.jeanbrun.totalTax < comparison.lmnpReel.totalTax,
    },
  ];

  return (
    <div className="space-y-8">
      {/* ─── Input form ─────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Paramètres de simulation</CardTitle>
          <CardDescription>
            Renseignez les caractéristiques de votre investissement locatif
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Row 1: Property & rent */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="propertyValue">Valeur du bien</Label>
              <InputGroup>
                <InputGroupInput
                  id="propertyValue"
                  type="number"
                  min={0}
                  step={1000}
                  value={input.propertyValue || ""}
                  onChange={(e) =>
                    handleNumberChange("propertyValue", e.target.value)
                  }
                  placeholder="200 000"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>€</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualRent">Loyer annuel brut</Label>
              <InputGroup>
                <InputGroupInput
                  id="annualRent"
                  type="number"
                  min={0}
                  step={100}
                  value={input.annualRent || ""}
                  onChange={(e) =>
                    handleNumberChange("annualRent", e.target.value)
                  }
                  placeholder="12 000"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>€/an</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <p className="text-xs text-muted-foreground">
                soit {formatCurrency(input.annualRent / 12)}/mois
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualCharges">Charges annuelles</Label>
              <InputGroup>
                <InputGroupInput
                  id="annualCharges"
                  type="number"
                  min={0}
                  step={100}
                  value={input.annualCharges || ""}
                  onChange={(e) =>
                    handleNumberChange("annualCharges", e.target.value)
                  }
                  placeholder="2 000"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>€/an</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          {/* Row 2: Loan & deductions */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="loanInterest">Intérêts d&apos;emprunt</Label>
              <InputGroup>
                <InputGroupInput
                  id="loanInterest"
                  type="number"
                  min={0}
                  step={100}
                  value={input.loanInterest || ""}
                  onChange={(e) =>
                    handleNumberChange("loanInterest", e.target.value)
                  }
                  placeholder="3 000"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>€/an</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otherDeductions">Autres charges déductibles</Label>
              <InputGroup>
                <InputGroupInput
                  id="otherDeductions"
                  type="number"
                  min={0}
                  step={100}
                  value={input.otherDeductions || ""}
                  onChange={(e) =>
                    handleNumberChange("otherDeductions", e.target.value)
                  }
                  placeholder="500"
                />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>€/an</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="marginalTaxRate">
                Taux marginal d&apos;imposition
              </Label>
              <Select
                value={input.marginalTaxRate}
                onValueChange={(val) =>
                  updateField("marginalTaxRate", val as MarginalTaxRate)
                }
              >
                <SelectTrigger id="marginalTaxRate" className="w-full">
                  <SelectValue placeholder="Sélectionnez" />
                </SelectTrigger>
                <SelectContent>
                  {MARGINAL_TAX_RATES.map((rate) => (
                    <SelectItem key={rate} value={rate}>
                      {rate} %
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Row 3: Options */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label>Type de location</Label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="furnishedRental"
                    checked={input.furnishedRental}
                    onChange={() => updateField("furnishedRental", true)}
                    className="accent-primary"
                  />
                  <span className="text-sm">Meublée</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="furnishedRental"
                    checked={!input.furnishedRental}
                    onChange={() => updateField("furnishedRental", false)}
                    className="accent-primary"
                  />
                  <span className="text-sm">Nue</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Éligible Dispositif Jeanbrun</Label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={input.jeanbrunEligible}
                  onChange={(e) =>
                    updateField("jeanbrunEligible", e.target.checked)
                  }
                  className="accent-primary size-4 rounded"
                />
                <span className="text-sm">
                  Location intermédiaire ou sociale
                </span>
              </label>
            </div>

            {input.jeanbrunEligible && (
              <div className="space-y-2">
                <Label htmlFor="jeanbrunRate">Taux Jeanbrun</Label>
                <Select
                  value={input.jeanbrunRate}
                  onValueChange={(val) =>
                    updateField("jeanbrunRate", val as number)
                  }
                >
                  <SelectTrigger id="jeanbrunRate" className="w-full">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent>
                    {JEANBRUN_RATES.map((rate) => (
                      <SelectItem key={rate} value={rate}>
                        {rate} % —{" "}
                        {rate === 3.5
                          ? "Standard"
                          : rate === 4.5
                            ? "Intermédiaire"
                            : "Social"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Sur {JEANBRUN_DURATION_YEARS} ans ·{" "}
                  {formatCurrency(
                    input.propertyValue * (input.jeanbrunRate / 100),
                  )}
                  /an d&apos;amortissement
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ─── Recommendation banner ──────────────────────────────── */}
      {comparison.annualSavings > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border-2 border-primary/20 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Award className="size-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                Recommandation
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {comparison.recommendation}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5">
            <TrendingDown className="size-4 text-primary" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Économie annuelle</p>
              <p className="text-lg font-bold font-mono text-primary">
                {formatCurrency(comparison.annualSavings)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─── Results grid ───────────────────────────────────────── */}
      <div className="grid gap-4 md:grid-cols-3">
        {results.map(({ key, result, isBest }) => (
          <ResultCard key={key} result={result} isBest={isBest} />
        ))}
      </div>
    </div>
  );
}

// ─── Result card ────────────────────────────────────────────────────

function ResultCard({
  result,
  isBest,
}: {
  result: TaxSimulationResult;
  isBest: boolean;
}) {
  return (
    <Card
      className={cn(
        "relative transition-shadow",
        isBest && "ring-2 ring-primary/30 shadow-md",
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold">
            {result.regime}
          </CardTitle>
          {isBest && (
            <Badge variant="default" className="gap-1">
              <CheckCircle className="size-3" />
              Optimal
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <ResultRow
          label="Revenu brut"
          value={formatCurrency(result.grossIncome, true)}
        />

        <Separator />

        <ResultRow
          label="Déductions"
          value={`- ${formatCurrency(result.deductions, true)}`}
          muted
        />
        <ResultRow
          label="Revenu imposable"
          value={formatCurrency(result.taxableIncome, true)}
          highlight
        />

        <Separator />

        <ResultRow
          label="Impôt sur le revenu"
          value={formatCurrency(result.incomeTax, true)}
          muted
        />
        <ResultRow
          label={`Prélèvements sociaux (${(SOCIAL_LEVIES_RATE * 100).toFixed(1)} %)`}
          value={formatCurrency(result.socialLevies, true)}
          muted
        />
        <ResultRow
          label="Total fiscalité"
          value={formatCurrency(result.totalTax, true)}
          variant="destructive"
        />

        <Separator />

        <ResultRow
          label="Revenu net"
          value={formatCurrency(result.netIncome, true)}
          variant="success"
          bold
        />
      </CardContent>

      <CardFooter className="justify-between text-xs text-muted-foreground">
        <span>Taux effectif</span>
        <span
          className={cn(
            "font-mono font-semibold",
            isBest ? "text-primary" : "text-foreground",
          )}
        >
          {formatPercent(result.effectiveTaxRate)}
        </span>
      </CardFooter>
    </Card>
  );
}

// ─── Result row ─────────────────────────────────────────────────────

function ResultRow({
  label,
  value,
  muted = false,
  highlight = false,
  bold = false,
  variant,
}: {
  label: string;
  value: string;
  muted?: boolean;
  highlight?: boolean;
  bold?: boolean;
  variant?: "destructive" | "success";
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span
        className={cn(
          "text-xs",
          muted ? "text-muted-foreground" : "text-foreground",
        )}
      >
        {label}
      </span>
      <span
        className={cn(
          "text-xs font-mono tabular-nums text-right",
          muted && "text-muted-foreground",
          highlight && "font-semibold text-foreground",
          bold && "text-sm font-bold",
          variant === "destructive" && "font-semibold text-destructive",
          variant === "success" && "font-semibold text-success",
        )}
      >
        {value}
      </span>
    </div>
  );
}
