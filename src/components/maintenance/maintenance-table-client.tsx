"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TicketStatusButton } from "@/components/ticket-status-button";
import { MaintenanceEmptyState } from "@/components/maintenance-empty-state";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: Date;
  attachments: { id: string }[];
  tenant: { firstName: string; lastName: string };
  property: { id: string; name: string };
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Ouvert", className: "bg-amber-50 text-amber-700 border-amber-200" },
  IN_PROGRESS: { label: "En cours", className: "bg-blue-50 text-blue-700 border-blue-200" },
  RESOLVED: { label: "Résolu", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CLOSED: { label: "Fermé", className: "bg-gray-100 text-gray-600 border-gray-200" },
};

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  LOW: { label: "Basse", className: "bg-slate-50 text-slate-600 border-slate-200" },
  MEDIUM: { label: "Moyenne", className: "bg-blue-50 text-blue-600 border-blue-200" },
  HIGH: { label: "Haute", className: "bg-orange-50 text-orange-600 border-orange-200" },
  URGENT: { label: "Urgente", className: "bg-red-50 text-red-600 border-red-200" },
};

interface MaintenanceTableClientProps {
  tickets: Ticket[];
  properties: { id: string; name: string }[];
  hasProperties: boolean;
  hasTenants: boolean;
}

export function MaintenanceTableClient({
  tickets,
  properties,
  hasProperties,
  hasTenants,
}: MaintenanceTableClientProps) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [propertyFilter, setPropertyFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");

  const filtered = tickets.filter((t) => {
    if (statusFilter !== "ALL" && t.status !== statusFilter) return false;
    if (propertyFilter !== "ALL" && t.property.id !== propertyFilter) return false;
    if (priorityFilter !== "ALL" && t.priority !== priorityFilter) return false;
    return true;
  });

  const statusCounts = {
    OPEN: tickets.filter((t) => t.status === "OPEN").length,
    IN_PROGRESS: tickets.filter((t) => t.status === "IN_PROGRESS").length,
    RESOLVED: tickets.filter((t) => t.status === "RESOLVED").length,
    CLOSED: tickets.filter((t) => t.status === "CLOSED").length,
  };

  return (
    <div className="space-y-6">
      {/* Filter bar */}
      <Card className="shadow-sm border-border/50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="size-4" />
              <span>Filtrer :</span>
            </div>

            {/* Status badges — click to filter */}
            <div className="flex items-center gap-1 text-sm flex-wrap">
              <span className="text-muted-foreground mr-1">Statut :</span>
              {[
                { value: "ALL", label: "Tous", className: "bg-gray-50 text-gray-600 border-gray-200" },
                { value: "OPEN", label: `${statusCounts.OPEN} Ouvert(s)`, className: "bg-amber-50 text-amber-700 border-amber-200" },
                { value: "IN_PROGRESS", label: `${statusCounts.IN_PROGRESS} En cours`, className: "bg-blue-50 text-blue-700 border-blue-200" },
                { value: "RESOLVED", label: `${statusCounts.RESOLVED} Résolu(s)`, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                { value: "CLOSED", label: `${statusCounts.CLOSED} Fermé(s)`, className: "bg-gray-100 text-gray-600 border-gray-200" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-2 py-0.5 rounded border text-xs transition-colors ${
                    statusFilter === opt.value
                      ? "ring-2 ring-primary ring-offset-1 " + opt.className
                      : "bg-transparent text-muted-foreground border-transparent hover:bg-muted/50"
                  } ${opt.className}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Secondary filters */}
          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {/* Property filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Bien :</span>
              <Select value={propertyFilter} onValueChange={setPropertyFilter}>
                <SelectTrigger className="h-8 w-[180px] text-xs">
                  <SelectValue placeholder="Tous les biens" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Tous les biens</SelectItem>
                  {properties.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Priorité :</span>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="h-8 w-[140px] text-xs">
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Toutes</SelectItem>
                  {Object.entries(PRIORITY_CONFIG).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(statusFilter !== "ALL" || propertyFilter !== "ALL" || priorityFilter !== "ALL") && (
              <button
                onClick={() => { setStatusFilter("ALL"); setPropertyFilter("ALL"); setPriorityFilter("ALL"); }}
                className="text-xs text-primary hover:underline ml-2"
              >
                Réinitialiser les filtres
              </button>
            )}

            <div className="ml-auto text-sm text-muted-foreground">
              {filtered.length} / {tickets.length} demande{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table or empty state */}
      {filtered.length > 0 ? (
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Toutes les demandes</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead>Locataire</TableHead>
                  <TableHead>Bien</TableHead>
                  <TableHead>Priorité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Pièces jointes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((ticket) => {
                  const statusCfg = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.OPEN;
                  const priorityCfg = PRIORITY_CONFIG[ticket.priority] ?? PRIORITY_CONFIG.MEDIUM;

                  return (
                    <TableRow
                      key={ticket.id}
                      className="cursor-pointer hover:bg-muted/30 transition-colors"
                    >
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        <Link href={`/maintenance/${ticket.id}`} className="block">
                          {format(ticket.createdAt, "dd/MM/yyyy", { locale: fr })}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link href={`/maintenance/${ticket.id}`} className="block">
                          <p className="text-sm font-medium">{ticket.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {ticket.description}
                          </p>
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm">
                        <Link href={`/maintenance/${ticket.id}`} className="block">
                          {ticket.tenant.firstName} {ticket.tenant.lastName}
                        </Link>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        <Link href={`/maintenance/${ticket.id}`} className="block hover:text-foreground">
                          {ticket.property.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={priorityCfg.className}>
                          {priorityCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={statusCfg.className}>
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ticket.attachments.length > 0 ? (
                          <Link href={`/maintenance/${ticket.id}`} className="inline-block">
                            {ticket.attachments.length} pièce(s)
                          </Link>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <TicketStatusButton
                          ticketId={ticket.id}
                          currentStatus={ticket.status}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <MaintenanceEmptyState hasProperties={hasProperties} hasTenants={hasTenants} />
      )}
    </div>
  );
}
