import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Decimal from "decimal.js";
import { AlertCircle, ArrowRight, CreditCard } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReminderButton } from "@/components/reminder-button";
import { getRentExceptions } from "@/lib/queries/arrears";
import { formatCurrency } from "@/lib/format";

/**
 * « À traiter » — the exceptions that need a decision today.
 *
 * The dashboard answered "what does my portfolio look like" and never "what is
 * asking for me": `revenue.late` was computed on every render and never shown,
 * so a landlord with two months overdue read four KPIs of totals and no
 * exception.
 *
 * This section is placed ABOVE the KPIs on purpose. Buried under charts it would
 * answer a question nobody came to ask; the product promise is to detect, explain
 * and propose an action, in that order, before the totals.
 *
 * It renders nothing when there is no exception. An empty card saying "tout va
 * bien" spends the space that the exception itself needs, and trains the eye to
 * skim past the section — which is how a late month gets missed again.
 */
export async function ArrearsSection({ userId }: { userId: string }) {
  const exceptions = await getRentExceptions(userId);

  if (exceptions.length === 0) return null;

  const total = exceptions.reduce(
    (sum, exception) => sum.plus(new Decimal(exception.remaining)),
    new Decimal(0)
  );

  return (
    <Card className="shadow-sm border-red-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertCircle className="size-5 text-red-600" />
          À traiter
        </CardTitle>
        <CardDescription>
          {exceptions.length} période
          {exceptions.length > 1 ? "s" : ""} en retard —{" "}
          {formatCurrency(total.toFixed(2))} à recouvrer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="divide-y divide-border/30">
          {exceptions.map((exception) => {
            const partial = new Decimal(exception.alreadyPaid).gt(0);

            return (
              <li
                key={exception.transactionId}
                className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {exception.tenant.firstName} {exception.tenant.lastName}
                    <span className="text-muted-foreground font-normal">
                      {" "}
                      — {exception.property.name}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Période de{" "}
                    {format(exception.periodStart, "MMMM yyyy", { locale: fr })}
                    {" · échéance le "}
                    {format(exception.dueDate, "d MMMM yyyy", { locale: fr })}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    {/* The balance, not the month's total. On a month that already
                        received a part, showing only the balance left the landlord
                        reading "570,55" against a 970,55 month with no way to tell
                        them apart. */}
                    <span className="text-sm font-mono font-semibold text-red-700">
                      {partial
                        ? `${formatCurrency(exception.remaining)} / ${formatCurrency(exception.totalDue)}`
                        : formatCurrency(exception.remaining)}
                    </span>
                    {partial && (
                      <Badge variant="secondary" className="text-xs">
                        Partiellement payé
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className="text-xs text-red-700 border-red-200"
                    >
                      {exception.daysLate} jour
                      {exception.daysLate > 1 ? "s" : ""} de retard
                    </Badge>
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <ReminderButton
                    transactionId={exception.transactionId}
                    label="Relancer"
                  />
                  {/* Straight to the screen where the payment is recorded, rather
                      than back to the dashboard the landlord is already reading. */}
                  <Link
                    href="/billing"
                    className="inline-flex items-center justify-center rounded-lg bg-stone-900 px-3 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-stone-800"
                  >
                    <CreditCard className="size-4 mr-1" />
                    Encaisser
                    <ArrowRight className="size-3 ml-1" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}