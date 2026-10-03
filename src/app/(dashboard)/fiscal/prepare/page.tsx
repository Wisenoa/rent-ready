import { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Building2,
  MapPin,
  Receipt,
  TrendingUp,
  Wrench,
  Home,
  FileText,
  Download,
} from "lucide-react";

import { getAuthenticatedUserId } from "@/lib/auth";
import { getFiscalDeclaration, isValidFiscalYear } from "@/lib/queries/fiscal-prepare";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { formatCurrency } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ year?: string }> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { year } = await searchParams;
  return { title: `Préparation Déclaration 2577 — ${year ?? String(new Date().getFullYear() - 1)}` };
}

const EXPENSE_CATEGORY_LABELS: Record<string, string> = {
  PLUMBING: "Plomberie",
  ELECTRICAL: "Électricité",
  GENERAL_MAINTENANCE: "Entretien général",
  INSURANCE: "Assurance",
  TAX: "Impôts & Taxes",
  CONDO_FEES: "Charges de copropriété",
  MANAGEMENT_FEES: "Frais de gestion",
  RENOVATION: "Rénovation / Travaux",
  OTHER: "Autre",
};


export default async function FiscalPreparePage({
  searchParams,
}: Props) {
  const { year: yearParam } = await searchParams;
  const now = new Date();
  const defaultYear = now.getFullYear() - 1;
  const parsed = parseInt(yearParam ?? String(defaultYear), 10);
  const year = isValidFiscalYear(parsed) ? parsed : defaultYear;
  const userId = await getAuthenticatedUserId();

  // The selection rule (which leases a declared year covers, why the current
  // lease status must not decide it, why every lease of the year is summed) is
  // documented in the query. This page and /api/fiscal/prepare read it, so the
  // screen and the export cannot disagree on a figure that goes on a tax form.
  const declaration = await getFiscalDeclaration(userId, year);
  const propertyReports = declaration.properties;
  const { globalTotalRent, globalTotalExpenses, globalNetIncome } =
    declaration.summary;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Préparation 2577 — {year}
          </h1>
          <p className="text-muted-foreground mt-1">
            Revenus et charges par bien pour la déclaration des revenus fonciers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Exercice {year}
          </Badge>
        </div>
      </div>

      {/* Global summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="size-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Revenus locatifs nets
                </p>
                <p className="text-sm font-semibold font-mono">
                  {formatCurrency(globalTotalRent)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100">
                <Wrench className="size-4 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Charges déductibles
                </p>
                <p className="text-sm font-semibold font-mono">
                  {formatCurrency(globalTotalExpenses)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                <Home className="size-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Résultat netglobal
                </p>
                <p
                  className={`text-sm font-semibold font-mono ${
                    globalNetIncome >= 0
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {formatCurrency(globalNetIncome)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Per-property reports */}
      {propertyReports.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucun bien trouvé. Ajoutez vos biens pour commencer la préparation
            fiscale.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {propertyReports.map(({
            propertyId,
            propertyName,
            addressLine1,
            postalCode,
            city,
            cadastralRef,
            leases,
            totalRentReceived,
            totalChargesReceived,
            expensesByCategory,
            totalExpenses,
            netIncome,
            occupancyMonths,
            transactionDetails: txList,
          }) => (
            <Card key={propertyId}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Building2 className="size-4 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        {propertyName}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="size-3" />
                        {addressLine1}, {postalCode}{" "}
                        {city}
                      </p>
                      {cadastralRef && (
                        <p className="text-xs text-muted-foreground font-mono mt-0.5">
                          Ref. cadastrale: {cadastralRef}
                        </p>
                      )}
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {occupancyMonths}/12 mois
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Revenue + Expense summary */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">Loyers perçus</p>
                    <p className="text-sm font-semibold font-mono">
                      {formatCurrency(totalRentReceived)}
                    </p>
                    {totalChargesReceived > 0 && (
                      <p className="text-xs text-muted-foreground">
                        + {formatCurrency(totalChargesReceived)} charges
                      </p>
                    )}
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">
                      Charges déductibles
                    </p>
                    <p className="text-sm font-semibold font-mono text-amber-600">
                      -{formatCurrency(totalExpenses)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {Object.keys(expensesByCategory).length} catégories
                    </p>
                  </div>
                  <div className="rounded-lg border p-3">
                    <p className="text-xs text-muted-foreground">
                      Revenu net {year}
                    </p>
                    <p
                      className={`text-sm font-semibold font-mono ${
                        netIncome >= 0 ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {formatCurrency(netIncome)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {/* Every lease covering the year, not just the current
                          one: a property re-let mid-year had two tenants, and
                          naming only the first misrepresented the year. */}
                      {leases.length > 0
                        ? `Locataire${leases.length > 1 ? "s" : ""}: ${leases
                            .map((lease) => lease.tenantName)
                            .join(", ")}`
                        : "Aucun locataire"}
                    </p>
                  </div>
                </div>

                {/* Expenses by category */}
                {Object.keys(expensesByCategory).length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Wrench className="size-4 text-muted-foreground" />
                        Charges par catégorie
                      </p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Catégorie</TableHead>
                            <TableHead className="text-right">Montant</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(expensesByCategory).map(
                            ([cat, amt]) => (
                              <TableRow key={cat}>
                                <TableCell className="text-sm">
                                  {EXPENSE_CATEGORY_LABELS[cat] ?? cat}
                                </TableCell>
                                <TableCell className="text-right font-mono text-sm">
                                  {formatCurrency(amt)}
                                </TableCell>
                              </TableRow>
                            )
                          )}
                          <TableRow className="font-semibold">
                            <TableCell className="text-sm">Total</TableCell>
                            <TableCell className="text-right font-mono text-sm">
                              {formatCurrency(totalExpenses)}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}

                {/* Recent transactions */}
                {txList.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Receipt className="size-4 text-muted-foreground" />
                        Échéances {year}
                      </p>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Période</TableHead>
                            <TableHead>Loyer</TableHead>
                            <TableHead>Charges</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Payé le</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {txList.map((tx) => (
                            <TableRow key={tx.id}>
                              <TableCell className="text-sm">
                                {format(
                                  new Date(tx.periodStart),
                                  "MMM yyyy",
                                  { locale: fr }
                                )}
                              </TableCell>
                              <TableCell className="font-mono text-sm">
                                {formatCurrency(Number(tx.rentPortion))}
                              </TableCell>
                              <TableCell className="font-mono text-sm text-muted-foreground">
                                {formatCurrency(Number(tx.chargesPortion))}
                              </TableCell>
                              <TableCell className="font-mono text-sm font-medium">
                                {formatCurrency(Number(tx.amount))}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {tx.paidAt
                                  ? format(
                                      new Date(tx.paidAt),
                                      "d MMM yyyy",
                                      { locale: fr }
                                    )
                                  : "—"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}

                {txList.length === 0 &&
                  Object.keys(expensesByCategory).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune transaction ni charge pour cette période.
                    </p>
                  )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Footer note */}
      <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
        <p className="flex items-center gap-2 font-medium text-foreground mb-1">
          <FileText className="size-4" />
          Note pour la déclaration 2577
        </p>
        <p>
          Ces données sont indicative. Ne reportez que les montants effectivement
          déclarables selon votre régime fiscal (micro-BIC ou réel). Les charges
          sont déductibles uniquement pour le régime réel. Consultez un
          expert-comptable pour votre situation.
        </p>
      </div>
    </div>
  );
}
