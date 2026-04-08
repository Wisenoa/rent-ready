import type { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Wrench, Filter } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
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

export const metadata: Metadata = {
  title: "Maintenance",
};

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

export default async function MaintenancePage() {
  const userId = await getAuthenticatedUserId();

  const [tickets, properties] = await Promise.all([
    prisma.maintenanceTicket.findMany({
      where: {
        property: { userId },
      },
      include: {
        tenant: { select: { firstName: true, lastName: true } },
        property: { select: { id: true, name: true } },
        attachments: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.property.findMany({
      where: { userId },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Maintenance</h1>
        <p className="text-muted-foreground mt-1">
          Demandes de réparation de vos locataires
        </p>
      </div>

      {/* Filter bar */}
      <Card className="shadow-sm border-border/50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="size-4" />
              <span>Filtrer :</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="text-muted-foreground">Statut :</span>
              <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-amber-200">
                {tickets.filter(t => t.status === "OPEN").length} Ouvert(s)
              </Badge>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                {tickets.filter(t => t.status === "IN_PROGRESS").length} En cours
              </Badge>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                {tickets.filter(t => t.status === "RESOLVED").length} Résolu(s)
              </Badge>
              <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
                {tickets.filter(t => t.status === "CLOSED").length} Fermé(s)
              </Badge>
            </div>
            <div className="ml-auto text-sm text-muted-foreground">
              {tickets.length} demande{tickets.length !== 1 ? "s" : ""} au total
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table or empty state */}
      {tickets.length > 0 ? (
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
                {tickets.map((ticket) => {
                  const statusCfg =
                    STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.OPEN;
                  const priorityCfg =
                    PRIORITY_CONFIG[ticket.priority] ?? PRIORITY_CONFIG.MEDIUM;

                  return (
                    <TableRow key={ticket.id}>
                      <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                        {format(ticket.createdAt, "dd/MM/yyyy", { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm font-medium">{ticket.title}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {ticket.description}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {ticket.tenant.firstName} {ticket.tenant.lastName}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ticket.property.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={priorityCfg.className}
                        >
                          {priorityCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={statusCfg.className}
                        >
                          {statusCfg.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {ticket.attachments.length > 0 ? (
                          <div className="flex gap-1">
                            {ticket.attachments.slice(0, 3).map((att) => (
                              <a
                                key={att.id}
                                href={att.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded border border-border/50 overflow-hidden hover:ring-2 hover:ring-primary/30 transition-all"
                              >
                                {att.fileType.startsWith("image/") ? (
                                  <img
                                    src={att.fileUrl}
                                    alt={att.fileName}
                                    className="w-8 h-8 object-cover"
                                  />
                                ) : (
                                  <div className="w-8 h-8 flex items-center justify-center bg-muted/30 text-[8px] text-muted-foreground">
                                    {att.fileName.split(".").pop()}
                                  </div>
                                )}
                              </a>
                            ))}
                            {ticket.attachments.length > 3 && (
                              <span className="text-xs self-center ml-1">
                                +{ticket.attachments.length - 3}
                              </span>
                            )}
                          </div>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
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
        <Card className="shadow-sm border-border/50">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Wrench className="size-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold mb-1">
              Aucune demande de maintenance
            </h3>
            <p className="text-muted-foreground text-sm">
              Les demandes de vos locataires apparaîtront ici.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
