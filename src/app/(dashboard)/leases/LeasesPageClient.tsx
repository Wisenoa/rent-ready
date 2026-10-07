"use client";

import Link from "next/link";
import { Plus, FileText, ArrowRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { LeaseForm } from "@/components/lease-form";
import {
  useOnboardingWizard,
  OnboardingWizardHost,
} from "@/components/onboarding-trigger";
import { formatCurrency } from "@/lib/format";
import {
  PageShell,
  Money,
  StatusBadge,
  StatusDot,
  type StatusTone,
} from "@/components/design-system";

const LEASE_TYPE_LABELS: Record<string, string> = {
  UNFURNISHED: "Location vide",
  FURNISHED: "Location meublée",
  COMMERCIAL: "Bail commercial",
  SEASONAL: "Location saisonnière",
};

const STATUS_TONES: Record<string, { label: string; tone: StatusTone }> = {
  DRAFT: { label: "Brouillon", tone: "neutral" },
  ACTIVE: { label: "Actif", tone: "calm" },
  TERMINATED: { label: "Résilié", tone: "neutral" },
  EXPIRED: { label: "Expiré", tone: "delayed" },
};

interface LeasesPageClientProps {
  leases: Array<{
    id: string;
    status: string;
    rentAmount: number;
    chargesAmount: number;
    leaseType: string;
    paymentMethod: string;
    startDate: Date;
    endDate: Date | null;
    irlReferenceQuarter: string | null;
    property: { id: string; name: string; addressLine1: string; city: string };
    tenant: { id: string; firstName: string; lastName: string };
    transactions: Array<{ status: string; amount: number; dueDate: Date }>;
  }>;
  properties: Array<{ id: string; name: string; addressLine1: string; city: string }>;
  tenants: Array<{ id: string; firstName: string; lastName: string }>;
}

export function LeasesPageClient({ leases, properties, tenants }: LeasesPageClientProps) {
  const { startWizard, wizardOpen, handleOpenChange, variant } =
    useOnboardingWizard({ autoOpen: false });

  const propertiesForForm = properties.map((p) => ({
    id: p.id,
    name: p.name,
    addressLine1: p.addressLine1,
    city: p.city,
  }));

  const tenantsForForm = tenants.map((t) => ({
    id: t.id,
    firstName: t.firstName,
    lastName: t.lastName,
  }));

  return (
    <>
      <PageShell maxWidth="default" className="space-y-6 pb-16">
        {/* ────────────────────────────────────────────────────────────────── */}
        {/* 1. ENTÊTE DU REGISTRE DES BAUX                                     */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-neutral-200/80 pb-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
              Registre des Baux
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-xl">
              Suivi exhaustif des baux d&apos;habitation et commerciaux, des conditions financières et des obligations d&apos;indexation.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/leases/new"
              className="inline-flex items-center justify-center gap-1.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-medium px-3.5 py-2 rounded-md shadow-sm transition-colors"
            >
              <Plus className="size-3.5" />
              Créer un bail
            </Link>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* 2. REGISTRE OU ÉTAT VIDE                                           */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {leases.length === 0 ? (
          <div className="rounded-lg border border-neutral-200/80 bg-white p-12 text-center space-y-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-800">
              <FileText className="size-5" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h2 className="text-lg font-semibold text-neutral-900">
                Aucun bail de location actif
              </h2>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Rattachez un locataire à l&apos;un de vos biens immobiliers pour matérialiser les échéances et générer vos quittances.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/leases/new"
                className="inline-flex items-center justify-center gap-1.5 bg-neutral-900 text-white hover:bg-neutral-800 text-xs font-medium px-4 py-2 rounded-md shadow-sm transition-colors"
              >
                <Plus className="size-3.5" />
                Créer un bail
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={startWizard}
                className="text-xs border-neutral-300 text-neutral-700 hover:bg-neutral-50 rounded-md"
              >
                Lancer l&apos;assistant
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-neutral-200/80 bg-white overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            {/* Barre de métadonnées du registre */}
            <div className="border-b border-neutral-200/80 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-neutral-900">
                  Contrats sous gestion
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  {leases.length} contrat{leases.length > 1 ? "s" : ""} enregistré{leases.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-neutral-500">
                <span className="inline-flex items-center gap-1.5">
                  <StatusDot tone="calm" />
                  <span>Actif</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <StatusDot tone="neutral" />
                  <span>Brouillon / Résilié</span>
                </span>
              </div>
            </div>

            {/* Table Desktop (>= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-neutral-50/70 text-[11px] font-semibold text-neutral-600">
                    <th className="py-2.5 px-4 font-normal">Bien immobilier</th>
                    <th className="py-2.5 px-4 font-normal">Locataire</th>
                    <th className="py-2.5 px-4 font-normal">Type & Durée</th>
                    <th className="py-2.5 px-4 font-normal text-right">Ventilation</th>
                    <th className="py-2.5 px-4 font-normal text-right">Total mensuel</th>
                    <th className="py-2.5 px-4 font-normal">Statut</th>
                    <th className="py-2.5 px-4 font-normal text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/80 text-xs">
                  {leases.map((lease) => {
                    const statusCfg = STATUS_TONES[lease.status] ?? STATUS_TONES.DRAFT;
                    const totalMonthly = lease.rentAmount + lease.chargesAmount;

                    return (
                      <tr
                        key={lease.id}
                        data-slot="card"
                        className="hover:bg-neutral-50/60 transition-colors group"
                      >
                        {/* 1. Bien */}
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/leases/${lease.id}`}
                            className="font-medium text-neutral-900 hover:underline block"
                          >
                            {lease.property.name}
                          </Link>
                          <span className="text-[11px] text-neutral-500 truncate block max-w-xs">
                            {lease.property.addressLine1}, {lease.property.city}
                          </span>
                        </td>

                        {/* 2. Locataire */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-neutral-900">
                            {lease.tenant.firstName} {lease.tenant.lastName}
                          </div>
                        </td>

                        {/* 3. Type & Durée */}
                        <td className="py-3.5 px-4">
                          <span className="text-neutral-900 block font-medium">
                            {LEASE_TYPE_LABELS[lease.leaseType] ?? lease.leaseType}
                          </span>
                          <span className="text-[11px] text-neutral-500 tabular-nums">
                            Prise d&apos;effet : {format(new Date(lease.startDate), "dd/MM/yyyy", { locale: fr })}
                          </span>
                        </td>

                        {/* 4. Ventilation */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span className="tabular-nums text-xs text-neutral-600">
                            {formatCurrency(lease.rentAmount)} + {formatCurrency(lease.chargesAmount)}
                          </span>
                          <span className="block text-[10px] text-neutral-400">
                            loyer HC + chg
                          </span>
                        </td>

                        {/* 5. Total */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <Money amount={totalMonthly} tone="ink" size="sm" />
                          <span className="block text-[10px] text-neutral-500">/ mois</span>
                        </td>

                        {/* 6. Statut */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <StatusBadge tone={statusCfg.tone} showDot size="xs">
                            {statusCfg.label}
                          </StatusBadge>
                        </td>

                        {/* 7. Action */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <Link
                            href={`/leases/${lease.id}`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-900 hover:text-neutral-700 hover:underline group-hover:translate-x-0.5 transition-transform"
                          >
                            <span>Consulter</span>
                            <ArrowRight className="size-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Liste Mobile (< 768px) adaptée haute densité */}
            <div className="md:hidden divide-y divide-neutral-200/80">
              {leases.map((lease) => {
                const statusCfg = STATUS_TONES[lease.status] ?? STATUS_TONES.DRAFT;
                const totalMonthly = lease.rentAmount + lease.chargesAmount;

                return (
                  <Link
                    key={lease.id}
                    href={`/leases/${lease.id}`}
                    data-slot="card"
                    className="block p-4 space-y-2.5 bg-white hover:bg-neutral-50/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-medium text-sm text-neutral-900 block">
                          {lease.property.name}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {lease.tenant.firstName} {lease.tenant.lastName}
                        </span>
                      </div>
                      <div className="text-right">
                        <Money amount={totalMonthly} tone="ink" size="sm" />
                        <span className="block text-[10px] text-neutral-500">/ mois</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-neutral-100 text-neutral-500">
                      <span className="text-[11px]">
                        {LEASE_TYPE_LABELS[lease.leaseType] ?? lease.leaseType}
                      </span>
                      <StatusBadge tone={statusCfg.tone} showDot size="xs">
                        {statusCfg.label}
                      </StatusBadge>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </PageShell>

      <OnboardingWizardHost
        open={wizardOpen}
        onOpenChange={handleOpenChange}
        variant={variant}
      />
    </>
  );
}