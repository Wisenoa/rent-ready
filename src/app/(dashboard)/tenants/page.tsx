import { Metadata } from "next";
import { Plus, Mail, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const metadata: Metadata = {
  title: "Locataires",
};

const tenants = [
  {
    id: "1",
    firstName: "Marie",
    lastName: "Dupont",
    email: "marie.dupont@email.com",
    phone: "06 12 34 56 78",
    property: "Apt. Rue de Rivoli",
    rent: 1200,
    charges: 150,
    leaseStart: "01/09/2024",
    status: "active",
    paymentStatus: "up_to_date",
  },
  {
    id: "2",
    firstName: "Pierre",
    lastName: "Martin",
    email: "p.martin@email.com",
    phone: "06 98 76 54 32",
    property: "Studio Bd Haussmann",
    rent: 750,
    charges: 80,
    leaseStart: "01/01/2025",
    status: "active",
    paymentStatus: "up_to_date",
  },
  {
    id: "3",
    firstName: "Jean",
    lastName: "Leroy",
    email: "jean.leroy@email.com",
    phone: "06 55 44 33 22",
    property: "Maison Vincennes",
    rent: 1400,
    charges: 200,
    leaseStart: "15/03/2023",
    status: "active",
    paymentStatus: "late",
  },
  {
    id: "4",
    firstName: "Luc",
    lastName: "Bernard",
    email: "luc.b@email.com",
    phone: "06 11 22 33 44",
    property: "Parking Bastille",
    rent: 150,
    charges: 0,
    leaseStart: "01/06/2025",
    status: "active",
    paymentStatus: "up_to_date",
  },
];

function getInitials(firstName: string, lastName: string) {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

export default function TenantsPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Locataires</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos locataires et leurs baux
          </p>
        </div>
        <Button>
          <Plus className="size-4 mr-2" />
          Ajouter un locataire
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {tenants.map((tenant) => (
          <Card
            key={tenant.id}
            className="shadow-sm border-border/50 hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <Avatar className="h-11 w-11">
                  <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                    {getInitials(tenant.firstName, tenant.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {tenant.firstName} {tenant.lastName}
                    </CardTitle>
                    <Badge
                      variant={tenant.paymentStatus === "late" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {tenant.paymentStatus === "up_to_date" ? "À jour" : "En retard"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {tenant.property}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-3.5" />
                  <span>{tenant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="size-3.5" />
                  <span>{tenant.phone}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/30">
                <div>
                  <p className="text-xs text-muted-foreground">Loyer + charges</p>
                  <p className="text-sm font-semibold font-mono">
                    {(tenant.rent + tenant.charges).toLocaleString("fr-FR")} €/mois
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Bail depuis</p>
                  <p className="text-sm">{tenant.leaseStart}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
