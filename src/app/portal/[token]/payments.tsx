"use client";

import { useTransition } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CreditCard, Loader2, Calendar, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export interface PortalPayment {
  id: string;
  amount: number;
  rentPortion: number;
  chargesPortion: number;
  dueDate: string;
  periodStart: string;
  periodEnd: string;
  status: string;
  propertyName: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function PayButton({
  transactionId,
  tenantId,
}: {
  transactionId: string;
  tenantId: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handlePay() {
    startTransition(async () => {
      try {
        const { initiatePayment } = await import("@/lib/actions/portal-actions");
        const result = await initiatePayment(transactionId, tenantId);

        if (result.success && result.data?.url) {
          window.location.href = result.data.url;
        } else {
          toast.error(result.error ?? "Erreur lors du paiement");
        }
      } catch {
        toast.error("Erreur lors du paiement");
      }
    });
  }

  return (
    <Button
      onClick={handlePay}
      disabled={isPending}
      size="sm"
      className="gap-1.5"
    >
      {isPending ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <CreditCard className="size-4" />
      )}
      {isPending ? "Redirection..." : "Payer en ligne"}
    </Button>
  );
}

export function PortalPayments({
  payments,
  tenantId,
}: {
  payments: PortalPayment[];
  tenantId: string;
}) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CreditCard className="size-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-medium">Aucun paiement en attente</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Tous vos paiements sont à jour. Rien à payer pour le moment.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <AlertTriangle className="size-4 text-amber-600 shrink-0" />
        <p className="text-sm text-amber-800">
          Les paiements sont traités de manière sécurisée par Stripe.
          Aucun frais supplémentaire.
        </p>
      </div>

      <div className="space-y-3">
        {payments.map((payment) => (
          <Card key={payment.id} className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm font-medium leading-snug">
                  Loyer {format(new Date(payment.periodStart), "MMMM yyyy", { locale: fr })}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className={
                    payment.status === "LATE"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }
                >
                  {payment.status === "LATE" ? "En retard" : "En attente"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                <span>
                  Échéance :{" "}
                  {format(new Date(payment.dueDate), "dd MMMM yyyy", { locale: fr })}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xl font-semibold font-mono">
                    {formatCurrency(payment.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                   Dont{" "}
                    {formatCurrency(payment.rentPortion)} (loyer){" "}
                    {payment.chargesPortion > 0 &&
                      `+ ${formatCurrency(payment.chargesPortion)} (charges)`}
                  </p>
                </div>
                <PayButton transactionId={payment.id} tenantId={tenantId} />
              </div>

              <p className="text-xs text-muted-foreground">
                {payment.propertyName}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
