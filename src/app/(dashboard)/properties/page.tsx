import { Metadata } from "next";
import { Building2, Plus, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Biens",
};

const properties = [
  {
    id: "1",
    name: "Appartement Rue de Rivoli",
    type: "APARTMENT",
    address: "45 Rue de Rivoli, 75004 Paris",
    surface: 65,
    rooms: 3,
    rent: 1200,
    charges: 150,
    status: "occupied",
    tenant: "Marie Dupont",
  },
  {
    id: "2",
    name: "Studio Bd Haussmann",
    type: "STUDIO",
    address: "122 Bd Haussmann, 75008 Paris",
    surface: 28,
    rooms: 1,
    rent: 750,
    charges: 80,
    status: "occupied",
    tenant: "Pierre Martin",
  },
  {
    id: "3",
    name: "Maison Vincennes",
    type: "HOUSE",
    address: "12 Rue du Château, 94300 Vincennes",
    surface: 95,
    rooms: 4,
    rent: 1400,
    charges: 200,
    status: "occupied",
    tenant: "Jean & Sophie Leroy",
  },
  {
    id: "4",
    name: "Parking Bastille",
    type: "PARKING",
    address: "8 Place de la Bastille, 75011 Paris",
    surface: 12,
    rooms: 0,
    rent: 150,
    charges: 0,
    status: "occupied",
    tenant: "Luc Bernard",
  },
];

const typeLabels: Record<string, string> = {
  APARTMENT: "Appartement",
  STUDIO: "Studio",
  HOUSE: "Maison",
  PARKING: "Parking",
  COMMERCIAL: "Commercial",
  OTHER: "Autre",
};

export default function PropertiesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Biens</h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre patrimoine immobilier
          </p>
        </div>
        <Button>
          <Plus className="size-4 mr-2" />
          Ajouter un bien
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <Card
            key={property.id}
            className="shadow-sm border-border/50 hover:shadow-md transition-shadow cursor-pointer"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Building2 className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{property.name}</CardTitle>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <MapPin className="size-3" />
                      {property.address}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="secondary" className="text-xs">
                  {typeLabels[property.type] || property.type}
                </Badge>
                {property.surface > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {property.surface} m²
                  </Badge>
                )}
                {property.rooms > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {property.rooms} pièce{property.rooms > 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-border/30">
                <div>
                  <p className="text-xs text-muted-foreground">Loyer + charges</p>
                  <p className="text-sm font-semibold font-mono">
                    {(property.rent + property.charges).toLocaleString("fr-FR")} €/mois
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Locataire</p>
                  <p className="text-sm">{property.tenant}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
