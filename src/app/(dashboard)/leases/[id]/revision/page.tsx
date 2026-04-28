import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowLeft, TrendingUp, TrendingDown, Scale, Info, Calendar } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { getLatestIrl, getAvailableQuarters, formatQuarterLabel } from "@/lib/irl-calculator";
import { RevisionActions } from "./revision-actions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  return { title: "Révision de loyer — LocationReady" };
}

async function getLease(leaseId: string, userId: string) {
  return prisma.lease.findFirst({
    where: { id: leaseId, userId },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          type: true,
          addressLine1: true,
          city: true,
        },
      },
      tenant: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      transactions: {
        where: { status: "PAID" },
        orderBy: { paidAt: "desc" },
        take: 3,
      },
    },
  });
}

export default async function LeaseRevisionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();

  const lease = await getLease(id, userId);
  if (!lease) notFound();

  const latestIrl = getLatestIrl();
  const availableQuarters = getAvailableQuarters();

  // Compute revision against latest IRL
  let revision = null;
  let error: string | null = null;

  if (lease.irlReferenceQuarter && lease.irlReferenceValue !== null) {
    const { calculateRentRevision } = await import("@/lib/irl-calculator");
    const revisionCap = 0.05;
    try {
      const raw = calculateRentRevision({
        currentRent: Number(lease.rentAmount),
        referenceIrlQuarter: lease.irlReferenceQuarter,
        newIrlQuarter: latestIrl.quarter,
      });

      const isCapped = raw.percentageChange > revisionCap * 100;
      const cappedNewRent = isCapped
        ? Math.round(Number(lease.rentAmount) * (1 + revisionCap) * 100) / 100
        : raw.newRent;

      revision = {
        ...raw,
        isCapped,
        cappedNewRent,
        cappedDifference: Math.round((cappedNewRent - Number(lease.rentAmount)) * 100) / 100,
        cappedPercentage: isCapped ? revisionCap * 100 : raw.percentageChange,
      };
    } catch (e) {
      error = e instanceof Error ? e.message : "Erreur de calcul";
    }
  } else {
    error = "IRL de référence manquant";
  }

  const nextRevisionDate = lease.revisionDate
    ? new Date(lease.revisionDate)
    : null;

  const daysUntil = nextRevisionDate
    ? Math.ceil(
        (nextRevisionDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      )
    : null;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link
          href="/leases"
          className="mt-1 inline-flex size-9 items-center justify-center rounded-md border border-border bg-background hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            Révision de loyer
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Bail — {lease.property.name} · {lease.tenant.firstName}{" "}
            {lease.tenant.lastName}
          </p>
        </div>
      </div>

      {/* Current terms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Conditions actuelles du bail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Loyer HC</p>
              <p className="font-semibold text-lg">
                {Number(lease.rentAmount).toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Charges</p>
              <p className="font-semibold text-lg">
                {Number(lease.chargesAmount).toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                })}
              </p>
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date de début</p>
              <p className="font-medium">
                {new Date(lease.startDate).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            {nextRevisionDate && (
              <div>
                <p className="text-muted-foreground">Prochaine révision</p>
                <p className="font-medium flex items-center gap-1.5">
                  {nextRevisionDate.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {daysUntil !== null && daysUntil <= 30 && (
                    <Badge variant="destructive" className="text-xs">
                      <Calendar className="size-3 mr-1" />
                      dans {daysUntil}j
                    </Badge>
                  )}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error state */}
      {error && (
        <Card className="border-destructive/50">
          <CardContent className="flex items-start gap-3 py-4">
            <Info className="size-5 text-destructive mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-destructive">IRL non configuré</p>
              <p className="text-sm text-muted-foreground mt-1">
                {error}. Vous devez configurer l&apos;IRL de référence lors de la
                création du bail pour pouvoir calculer une révision.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revision preview */}
      {revision && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Scale className="size-4" />
                Aperçu de la révision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Legal cap warning */}
              {revision.isCapped && (
                <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm">
                  <Info className="size-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-amber-900">
                      Augmentation plafonnée à 5%
                    </p>
                    <p className="text-amber-700 mt-0.5">
                      L&apos;augmentation légale de{" "}
                      {revision.percentageChange.toFixed(2)}% dépasse le plafond
                      de 5% (Article 17-1). Le loyer révisé est limité à{" "}
                      <strong>
                        {revision.cappedNewRent.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </strong>
                      .
                    </p>
                  </div>
                </div>
              )}

              {/* IRL info */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-muted-foreground text-xs mb-1">
                    IRL de référence (signature)
                  </p>
                  <p className="font-semibold">
                    {formatQuarterLabel(lease.irlReferenceQuarter!)}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {lease.irlReferenceValue}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-muted-foreground text-xs mb-1">
                    IRL applicable (dernier connu)
                  </p>
                  <p className="font-semibold">
                    {formatQuarterLabel(latestIrl.quarter)}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono">
                    {latestIrl.value}
                  </p>
                </div>
              </div>

              {/* Rent change */}
              <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Loyer actuel</p>
                    <p className="text-2xl font-bold">
                      {revision.currentRent.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {revision.difference >= 0 ? (
                      <TrendingUp className="size-5 text-destructive" />
                    ) : (
                      <TrendingDown className="size-5 text-emerald-600" />
                    )}
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Nouveau loyer</p>
                      <p className="text-2xl font-bold text-primary">
                        {revision.cappedNewRent.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-background/80 px-4 py-2">
                  <p className="text-sm text-muted-foreground">Variation</p>
                  <p
                    className={`font-semibold text-sm ${
                      revision.cappedDifference >= 0
                        ? "text-destructive"
                        : "text-emerald-600"
                    }`}
                  >
                    {revision.cappedDifference >= 0 ? "+" : ""}
                    {revision.cappedDifference.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}{" "}
                    <span className="text-muted-foreground font-normal">
                      ({revision.cappedPercentage.toFixed(2)}%)
                    </span>
                  </p>
                </div>

                <p className="text-xs text-muted-foreground text-center mt-3 font-mono">
                  {revision.formula}
                </p>
              </div>

              <Separator />

              {/* Actions */}
              {!revision.isCapped && (
                <p className="text-xs text-muted-foreground">
                  Le nouveau loyer respecte le plafond légal de 5%. Vous pouvez
                  appliquer cette révision en toute conformité avec l&apos;Article
                  17-1 de la loi du 6 juillet 1989.
                </p>
              )}

              <RevisionActions
                leaseId={lease.id}
                newRent={revision.cappedNewRent}
                newIrlQuarter={latestIrl.quarter}
                newIrlValue={latestIrl.value}
                isCapped={revision.isCapped}
                canApply={!error && !!lease.irlReferenceQuarter}
              />
            </CardContent>
          </Card>

          {/* Historical transactions */}
          {lease.transactions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Derniers paiements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lease.transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between text-sm py-2 border-b last:border-0"
                    >
                      <div>
                        <p className="font-medium">
                          {new Date(tx.periodStart).toLocaleDateString("fr-FR", {
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reçu le{" "}
                          {tx.paidAt
                            ? new Date(tx.paidAt).toLocaleDateString("fr-FR")
                            : "en attente"}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {tx.amount.toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}