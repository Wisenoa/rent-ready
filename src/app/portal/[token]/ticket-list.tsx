"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  ImageIcon,
  Video,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface PortalTicket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  propertyName: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  attachments: {
    id: string;
    fileName: string;
    fileType: string;
    fileUrl: string;
    fileSize: number;
  }[];
}

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; icon: React.ElementType }
> = {
  OPEN: {
    label: "Ouvert",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: AlertCircle,
  },
  IN_PROGRESS: {
    label: "En cours",
    className: "bg-blue-50 text-blue-700 border-blue-200",
    icon: Clock,
  },
  RESOLVED: {
    label: "Résolu",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  CLOSED: {
    label: "Fermé",
    className: "bg-gray-100 text-gray-600 border-gray-200",
    icon: XCircle,
  },
};

const PRIORITY_CONFIG: Record<string, { label: string; className: string }> = {
  LOW: { label: "Basse", className: "bg-slate-50 text-slate-600 border-slate-200" },
  MEDIUM: { label: "Moyenne", className: "bg-blue-50 text-blue-600 border-blue-200" },
  HIGH: { label: "Haute", className: "bg-orange-50 text-orange-600 border-orange-200" },
  URGENT: { label: "Urgente", className: "bg-red-50 text-red-600 border-red-200" },
};

export function TicketList({ tickets }: { tickets: PortalTicket[] }) {
  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Wrench className="size-12 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-medium">Aucune demande</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Vos demandes de maintenance apparaîtront ici.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => {
        const statusCfg = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.OPEN;
        const priorityCfg =
          PRIORITY_CONFIG[ticket.priority] ?? PRIORITY_CONFIG.MEDIUM;
        const StatusIcon = statusCfg.icon;

        return (
          <Card key={ticket.id} className="shadow-sm border-border/50">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm font-medium leading-snug">
                  {ticket.title}
                </CardTitle>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Badge variant="secondary" className={priorityCfg.className}>
                    {priorityCfg.label}
                  </Badge>
                  <Badge variant="secondary" className={statusCfg.className}>
                    <StatusIcon className="size-3 mr-1" />
                    {statusCfg.label}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {ticket.description}
              </p>

              {ticket.attachments.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {ticket.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-lg border border-border/50 overflow-hidden hover:ring-2 hover:ring-primary/30 transition-all"
                    >
                      {att.fileType.startsWith("image/") ? (
                        <img
                          src={att.fileUrl}
                          alt={att.fileName}
                          className="w-16 h-16 object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 flex flex-col items-center justify-center bg-muted/30">
                          {att.fileType.startsWith("video/") ? (
                            <Video className="size-5 text-muted-foreground" />
                          ) : (
                            <ImageIcon className="size-5 text-muted-foreground" />
                          )}
                          <span className="text-[9px] text-muted-foreground mt-0.5">
                            {att.fileName.split(".").pop()}
                          </span>
                        </div>
                      )}
                    </a>
                  ))}
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Créé le{" "}
                {format(new Date(ticket.createdAt), "dd MMMM yyyy 'à' HH:mm", {
                  locale: fr,
                })}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
