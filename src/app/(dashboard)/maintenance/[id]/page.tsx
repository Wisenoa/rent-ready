import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  ArrowLeft,
  Wrench,
  Building2,
  User,
  Calendar,
  Tag,
  Paperclip,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { StatusChangeButtons } from "@/components/maintenance/status-change-buttons";
import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { InternalNotesThread } from "@/components/maintenance/internal-notes-thread";
import { StatusChangeButtons } from "@/components/maintenance/status-change-buttons";

export const metadata: Metadata = {
  title: "Détail demande — Maintenance",
};

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: React.ElementType }> = {
  OPEN: { label: "Ouvert", className: "bg-amber-50 text-amber-700 border-amber-200", icon: AlertCircle },
  IN_PROGRESS: { label: "En cours", className: "bg-blue-50 text-blue-700 border-blue-200", icon: Clock },
  RESOLVED: { label: "Résolu", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  CLOSED: { label: "Fermé", className: "bg-gray-100 text-gray-600 border-gray-200", icon: XCircle },
};

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  LOW: { label: "Basse", className: "bg-slate-50 text-slate-600 border-slate-200" },
  MEDIUM: { label: "Moyenne", className: "bg-blue-50 text-blue-600 border-blue-200" },
  HIGH: { label: "Haute", className: "bg-orange-50 text-orange-600 border-orange-200" },
  URGENT: { label: "Urgente", className: "bg-red-50 text-red-600 border-red-200" },
};

const CATEGORY_LABELS: Record<string, string> = {
  PLUMBING: "Plomberie",
  ELECTRICAL: "Électricité",
  HEATING: "Chauffage",
  STRUCTURAL: "Maçonnerie / Structure",
  OTHER: "Autre",
};

type Props = { params: Promise<{ id: string }> };

export default async function MaintenanceDetailPage({ params }: Props) {
  const { id } = await params;
  const userId = await getAuthenticatedUserId();

  const ticket = await prisma.maintenanceTicket.findUnique({
    where: { id },
    include: {
      tenant: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } },
      property: {
        select: {
          id: true,
          name: true,
          addressLine1: true,
          postalCode: true,
          city: true,
          userId: true,
        },
      },
      unit: { select: { id: true, name: true } },
      attachments: { orderBy: { createdAt: "asc" } },
      internalNotes: {
        include: { ticket: false },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ticket || ticket.property.userId !== userId) {
    notFound();
  }

  const statusCfg = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.OPEN;
  const priorityCfg = PRIORITY_CONFIG[ticket.priority] ?? PRIORITY_CONFIG.MEDIUM;
  const StatusIcon = statusCfg.icon;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div>
        <Button variant="ghost" size="sm" asChild className="gap-1.5 text-muted-foreground">
          <Link href="/maintenance">
            <ArrowLeft className="size-4" />
            Retour à la liste
          </Link>
        </Button>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{ticket.title}</h1>
            <Badge variant="secondary" className={statusCfg.className}>
              <StatusIcon className="size-3.5 mr-1" />
              {statusCfg.label}
            </Badge>
            <Badge variant="secondary" className={priorityCfg.className}>
              {priorityCfg.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Demandé le{" "}
            {format(ticket.createdAt, "dd MMMM yyyy 'à' HH:mm", { locale: fr })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Wrench className="size-4 text-muted-foreground" />
                Description
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm whitespace-pre-line">{ticket.description}</p>
            </CardContent>
          </Card>

          {/* Attachments */}
          {ticket.attachments.length > 0 && (
            <Card className="shadow-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Paperclip className="size-4 text-muted-foreground" />
                  Pièces jointes ({ticket.attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {ticket.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative rounded-lg border border-border/50 overflow-hidden hover:ring-2 hover:ring-primary/30 transition-all block"
                    >
                      {att.fileType.startsWith("image/") ? (
                        <img
                          src={att.fileUrl}
                          alt={att.fileName}
                          className="w-full aspect-square object-cover"
                        />
                      ) : (
                        <div className="w-full aspect-square flex flex-col items-center justify-center bg-muted/30 text-muted-foreground">
                          <Paperclip className="size-8 mb-1" />
                          <span className="text-xs text-center px-2">
                            {att.fileName.split(".").pop()?.toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-xs text-white truncate">{att.fileName}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Internal notes thread — landlord only */}
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageSquare className="size-4 text-muted-foreground" />
                Notes internes
                <Badge variant="secondary" className="ml-1 bg-amber-50 text-amber-700 border-amber-200">
                  Privé
                </Badge>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                Ces notes sont invisibles pour le locataire.
              </p>
            </CardHeader>
            <CardContent>
              <InternalNotesThread
                ticketId={ticket.id}
                notes={ticket.internalNotes.map((n) => ({
                  id: n.id,
                  content: n.content,
                  createdAt: n.createdAt.toISOString(),
                  authorId: n.authorId,
                }))}
              />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Ticket meta */}
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="text-base">Détails</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Category */}
              <div className="flex items-start gap-3">
                <Tag className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Catégorie</p>
                  <p className="text-sm font-medium">
                    {CATEGORY_LABELS[ticket.category] ?? ticket.category}
                  </p>
                </div>
              </div>

              {/* Tenant */}
              <Separator />
              <div className="flex items-start gap-3">
                <User className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Locataire</p>
                  <p className="text-sm font-medium">
                    {ticket.tenant.firstName} {ticket.tenant.lastName}
                  </p>
                  {ticket.tenant.email && (
                    <p className="text-xs text-muted-foreground">{ticket.tenant.email}</p>
                  )}
                  {ticket.tenant.phone && (
                    <p className="text-xs text-muted-foreground">{ticket.tenant.phone}</p>
                  )}
                </div>
              </div>

              {/* Property */}
              <Separator />
              <div className="flex items-start gap-3">
                <Building2 className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Bien</p>
                  <p className="text-sm font-medium">{ticket.property.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {ticket.property.addressLine1}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {ticket.property.postalCode} {ticket.property.city}
                  </p>
                  {ticket.unit && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Unité : {ticket.unit.name}
                    </p>
                  )}
                </div>
              </div>

              {/* Dates */}
              <Separator />
              <div className="flex items-start gap-3">
                <Calendar className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Créé le</p>
                  <p className="text-sm">
                    {format(ticket.createdAt, "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
                  </p>
                  {ticket.resolvedAt && (
                    <>
                      <p className="text-xs text-muted-foreground mt-2">Résolu le</p>
                      <p className="text-sm">
                        {format(ticket.resolvedAt, "dd/MM/yyyy 'à' HH:mm", { locale: fr })}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Status update */}
              <Separator />
              <StatusChangeButtons
                ticketId={ticket.id}
                currentStatus={ticket.status}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
