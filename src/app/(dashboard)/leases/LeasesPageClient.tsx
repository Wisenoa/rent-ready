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
      <PageShell maxWidth="default" className="space-y-8 pb-16">
        {/* ────────────────────────────────────────────────────────────────── */}
        {/* 1. ENTÊTE ÉDITORIAL DU REGISTRE DES BAUX                           */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-[#151413]/10 pb-6">
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold">
              CONTRATS LOCATIFS
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-[#151413]">
              Registre des Baux
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6760] max-w-xl">
              Suivi exhaustif des baux d&apos;habitation et commerciaux, des conditions financières et des obligations d&apos;indexation.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              href="/leases/new"
              className="inline-flex items-center justify-center gap-1.5 bg-[#151413] text-[#F8F6F0] hover:bg-[#151413]/90 text-xs font-medium px-3.5 py-2 transition-colors"
            >
              <Plus className="size-3.5" />
              Créer un bail
            </Link>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* 2. REGISTRE ARCHITECTURAL OU ÉTAT VIDE                             */}
        {/* ────────────────────────────────────────────────────────────────── */}
        {leases.length === 0 ? (
          <div className="border border-[#151413]/10 bg-[#FAF8F3] p-12 text-center space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#151413]/15 bg-white text-[#151413]">
              <FileText className="size-5" />
            </div>
            <div className="space-y-1 max-w-sm mx-auto">
              <h2 className="font-serif text-xl text-[#151413]">
                Aucun bail de location actif
              </h2>
              <p className="text-xs text-[#6B6760] leading-relaxed">
                Rattachez un locataire à l&apos;un de vos biens immobiliers pour matérialiser les échéances et générer vos quittances.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/leases/new"
                className="inline-flex items-center justify-center gap-1.5 bg-[#151413] text-[#F8F6F0] hover:bg-[#151413]/90 text-xs font-medium px-4 py-2 transition-colors"
              >
                <Plus className="size-3.5" />
                Créer un bail
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={startWizard}
                className="text-xs border-[#151413]/15 text-[#151413]"
              >
                Lancer l&apos;assistant
              </Button>
            </div>
          </div>
        ) : (
          <div className="border border-[#151413]/10 bg-[#FAF8F3] overflow-hidden">
            {/* Barre de métadonnées du registre */}
            <div className="border-b border-[#151413]/10 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-sm font-semibold tracking-tight text-[#151413]">
                  Contrats sous gestion
                </h2>
                <p className="text-xs text-[#6B6760] mt-0.5">
                  {leases.length} contrat{leases.length > 1 ? "s" : ""} enregistré{leases.length > 1 ? "s" : ""}
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#6B6760]">
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
                  <tr className="border-b border-[#151413]/10 bg-[#F2EFE9]/40 text-[11px] uppercase tracking-wider text-[#6B6760] font-semibold">
                    <th className="py-2.5 px-4 font-normal">Bien immobilier</th>
                    <th className="py-2.5 px-4 font-normal">Locataire</th>
                    <th className="py-2.5 px-4 font-normal">Type & Durée</th>
                    <th className="py-2.5 px-4 font-normal text-right">Ventilation</th>
                    <th className="py-2.5 px-4 font-normal text-right">Total mensuel</th>
                    <th className="py-2.5 px-4 font-normal">Statut</th>
                    <th className="py-2.5 px-4 font-normal text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#151413]/10 text-xs">
                  {leases.map((lease) => {
                    const statusCfg = STATUS_TONES[lease.status] ?? STATUS_TONES.DRAFT;
                    const totalMonthly = lease.rentAmount + lease.chargesAmount;

                    return (
                      <tr
                        key={lease.id}
                        data-slot="card"
                        className="hover:bg-[#F2EFE9]/50 transition-colors group"
                      >
                        {/* 1. Bien */}
                        <td className="py-3.5 px-4">
                          <Link
                            href={`/leases/${lease.id}`}
                            className="font-medium text-[#151413] hover:underline block"
                          >
                            {lease.property.name}
                          </Link>
                          <span className="text-[11px] text-[#6B6760] truncate block max-w-xs">
                            {lease.property.addressLine1}, {lease.property.city}
                          </span>
                        </td>

                        {/* 2. Locataire */}
                        <td className="py-3.5 px-4">
                          <div className="font-medium text-[#151413]">
                            {lease.tenant.firstName} {lease.tenant.lastName}
                          </div>
                        </td>

                        {/* 3. Type & Durée */}
                        <td className="py-3.5 px-4">
                          <span className="text-[#151413] block font-medium">
                            {LEASE_TYPE_LABELS[lease.leaseType] ?? lease.leaseType}
                          </span>
                          <span className="text-[11px] text-[#6B6760] font-mono">
                            Prise d&apos;effet : {format(new Date(lease.startDate), "dd/MM/yyyy", { locale: fr })}
                          </span>
                        </td>

                        {/* 4. Ventilation */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <span className="font-mono text-xs text-[#6B6760]">
                            {formatCurrency(lease.rentAmount)} + {formatCurrency(lease.chargesAmount)}
                          </span>
                          <span className="block text-[10px] text-[#9E9A90]">
                            loyer HC + chg
                          </span>
                        </td>

                        {/* 5. Total */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <Money amount={totalMonthly} tone="ink" size="sm" />
                          <span className="block text-[10px] text-[#6B6760]">/ mois</span>
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
                            className="inline-flex items-center gap-1 text-xs font-medium text-[#151413] hover:underline group-hover:translate-x-0.5 transition-transform"
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
            <div className="md:hidden divide-y divide-[#151413]/10">
              {leases.map((lease) => {
                const statusCfg = STATUS_TONES[lease.status] ?? STATUS_TONES.DRAFT;
                const totalMonthly = lease.rentAmount + lease.chargesAmount;

                return (
                  <Link
                    key={lease.id}
                    href={`/leases/${lease.id}`}
                    data-slot="card"
                    className="block p-4 space-y-2.5 bg-[#FAF8F3] hover:bg-[#F2EFE9]/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-medium text-sm text-[#151413] block">
                          {lease.property.name}
                        </span>
                        <span className="text-xs text-[#6B6760]">
                          {lease.tenant.firstName} {lease.tenant.lastName}
                        </span>
                      </div>
                      <div className="text-right">
                        <Money amount={totalMonthly} tone="ink" size="sm" />
                        <span className="block text-[10px] text-[#6B6760]">/ mois</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-[#151413]/5 text-[#6B6760]">
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