import type { Metadata } from "next";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Home,
  CalendarDays,
  Euro,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  verifyPortalToken,
  getPortalQuittances,
  getMaintenanceTickets,
} from "@/lib/actions/portal-actions";
import { PortalQuittances } from "./quittances";
import { MaintenanceForm } from "./maintenance-form";
import { TicketList } from "./ticket-list";

export const metadata: Metadata = {
  title: "Espace Locataire — RentReady",
  robots: {
    index: false,
    follow: false,
  },
};

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

const LEASE_TYPE_LABELS: Record<string, string> = {
  UNFURNISHED: "Location vide",
  FURNISHED: "Location meublée",
  COMMERCIAL: "Bail commercial",
  SEASONAL: "Location saisonnière",
};

export default async function PortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const data = await verifyPortalToken(token);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <ShieldAlert className="size-16 text-muted-foreground/40 mb-4" />
            <h1 className="text-xl font-semibold">Lien invalide ou expiré</h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-xs">
              Ce lien d&apos;accès n&apos;est plus valide. Veuillez contacter
              votre propriétaire pour obtenir un nouveau lien.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { tenant, lease, property, landlord } = data;

  const [quittances, tickets] = await Promise.all([
    getPortalQuittances(tenant.id),
    getMaintenanceTickets(tenant.id),
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              Espace Locataire
            </h1>
            <p className="text-sm text-muted-foreground">
              {tenant.firstName} {tenant.lastName}
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            RentReady
          </Badge>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-6">
        {/* Tenant & Lease Info */}
        {lease && property && (
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Home className="size-4 text-muted-foreground" />
                {property.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {property.addressLine1}
                {property.addressLine2 && `, ${property.addressLine2}`}
                {" — "}
                {property.postalCode} {property.city}
              </p>

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Euro className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Loyer + charges</p>
                    <p className="font-semibold font-mono">
                      {formatCurrency(lease.rentAmount + lease.chargesAmount)}
                      <span className="text-muted-foreground font-normal">
                        /mois
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Début du bail</p>
                    <p className="font-medium">
                      {format(new Date(lease.startDate), "dd MMMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  {LEASE_TYPE_LABELS[lease.leaseType] ?? lease.leaseType}
                </Badge>
              </div>

              <p className="text-xs text-muted-foreground">
                Propriétaire : {landlord.firstName} {landlord.lastName}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs defaultValue="quittances">
          <TabsList className="w-full">
            <TabsTrigger value="quittances" className="flex-1">
              Mes Quittances
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex-1">
              Maintenance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="quittances" className="mt-4">
            <PortalQuittances quittances={quittances} />
          </TabsContent>

          <TabsContent value="maintenance" className="mt-4 space-y-6">
            <MaintenanceForm tenantId={tenant.id} />
            <div>
              <h3 className="text-sm font-medium mb-3">Mes demandes</h3>
              <TicketList tickets={tickets} />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
