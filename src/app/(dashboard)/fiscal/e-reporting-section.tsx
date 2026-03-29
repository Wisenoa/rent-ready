"use client";

import { useState, useTransition } from "react";
import {
  Download,
  FileJson,
  FileSpreadsheet,
  Info,
  ChevronLeft,
  ChevronRight,
  Users,
  Receipt,
  EuroIcon,
  Loader2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function getCurrentMonth(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const date = new Date(y, m - 1 + delta, 1);
  const ny = date.getFullYear();
  const nm = String(date.getMonth() + 1).padStart(2, "0");
  return `${ny}-${nm}`;
}

function formatMonthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  const date = new Date(y, m - 1, 1);
  return date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

interface SummaryData {
  totalCollected: number;
  totalRent: number;
  totalCharges: number;
  transactionCount: number;
  tenantCount: number;
}

export function EReportingSection() {
  const [month, setMonth] = useState(getCurrentMonth);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loadingFormat, setLoadingFormat] = useState<string | null>(null);

  function handleMonthChange(delta: number) {
    const next = shiftMonth(month, delta);
    setSummary(null);
    setError(null);
    setMonth(next);
  }

  function fetchPreview() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/e-reporting/export?month=${month}&format=json`,
        );
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          throw new Error(
            body?.error ?? `Erreur ${res.status}`,
          );
        }
        const data = await res.json();
        setSummary(data.summary);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Une erreur est survenue",
        );
      }
    });
  }

  async function handleExport(format: "json" | "csv") {
    setLoadingFormat(format);
    try {
      const res = await fetch(
        `/api/e-reporting/export?month=${month}&format=${format}`,
      );
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Erreur ${res.status}`);
      }

      const blob = await res.blob();
      const ext = format === "csv" ? "csv" : "json";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `e-reporting-b2c-${month}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Échec du téléchargement",
      );
    } finally {
      setLoadingFormat(null);
    }
  }

  const isCurrentMonth = month === getCurrentMonth();

  return (
    <div className="space-y-4">
      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
        <Info className="size-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div className="text-sm text-blue-800 dark:text-blue-300">
          <p className="font-medium mb-1">
            E-reporting B2C — Obligation à venir
          </p>
          <p>
            L&apos;obligation de e-reporting B2C entre en vigueur le 1er
            septembre 2027 pour les micro-entrepreneurs. RentReady prépare vos
            données dès maintenant pour une transition en douceur.
          </p>
        </div>
      </div>

      {/* Month selector + actions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base font-semibold">
            E-Reporting B2C
          </CardTitle>
          <Badge variant="secondary" className="text-xs">
            Art. 261-D-2° CGI
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleMonthChange(-1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-sm font-medium min-w-32 text-center capitalize">
                {formatMonthLabel(month)}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleMonthChange(1)}
                disabled={isCurrentMonth}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchPreview}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <Receipt className="size-4 mr-2" />
              )}
              Aperçu
            </Button>
          </div>

          {/* Error display */}
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {/* Summary preview */}
          {summary && (
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                  <EuroIcon className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total encaissé
                  </p>
                  <p className="text-sm font-bold font-mono">
                    {formatCurrency(summary.totalCollected)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                  <Users className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Locataires</p>
                  <p className="text-sm font-bold font-mono">
                    {summary.tenantCount}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10">
                  <Receipt className="size-4 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Transactions</p>
                  <p className="text-sm font-bold font-mono">
                    {summary.transactionCount}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Export buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => handleExport("json")}
              disabled={loadingFormat !== null}
            >
              {loadingFormat === "json" ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <FileJson className="size-4 mr-2" />
              )}
              Exporter JSON
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport("csv")}
              disabled={loadingFormat !== null}
            >
              {loadingFormat === "csv" ? (
                <Loader2 className="size-4 mr-2 animate-spin" />
              ) : (
                <FileSpreadsheet className="size-4 mr-2" />
              )}
              Exporter CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
