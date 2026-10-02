"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { updateProfile } from "@/lib/actions/profile-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ProfileData = {
  firstName: string;
  lastName: string;
  phone: string | null;
  addressLine1: string;
  addressLine2: string | null;
  postalCode: string;
  city: string;
};

type Fields = {
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  postalCode: string;
  city: string;
};

function toFields(user: ProfileData): Fields {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone ?? "",
    addressLine1: user.addressLine1,
    addressLine2: user.addressLine2 ?? "",
    postalCode: user.postalCode,
    city: user.city,
  };
}

/**
 * Plain controlled inputs rather than react-hook-form: the field set is fixed and
 * small, and keeping the values in local state means a rejected submission
 * leaves everything the landlord typed on screen (AGENTS.md, forms must preserve
 * work after a recoverable error).
 */
export function ProfileForm({ user }: { user: ProfileData }) {
  const router = useRouter();
  const [fields, setFields] = useState<Fields>(() => toFields(user));
  const [isPending, startTransition] = useTransition();

  function set<K extends keyof Fields>(key: K, value: Fields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData();
    for (const [key, value] of Object.entries(fields)) {
      formData.append(key, value);
    }

    startTransition(async () => {
      const result = await updateProfile(formData);

      if (result.success) {
        toast.success("Profil enregistré");
        router.refresh();
      } else {
        toast.error(result.error ?? "Impossible d'enregistrer votre profil.");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Identité</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="firstName">Prénom *</Label>
            <Input
              id="firstName"
              autoComplete="given-name"
              value={fields.firstName}
              onChange={(e) => set("firstName", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lastName">Nom *</Label>
            <Input
              id="lastName"
              autoComplete="family-name"
              value={fields.lastName}
              onChange={(e) => set("lastName", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              type="tel"
              autoComplete="tel"
              placeholder="06 00 00 00 00"
              value={fields.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adresse du propriétaire</CardTitle>
          <p className="text-muted-foreground text-sm">
            Elle apparaît en bloc « bailleur » sur vos quittances de loyer.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="addressLine1">Adresse *</Label>
            <Input
              id="addressLine1"
              autoComplete="address-line1"
              placeholder="12 rue de la Paix"
              value={fields.addressLine1}
              onChange={(e) => set("addressLine1", e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="addressLine2">Complément d&apos;adresse</Label>
            <Input
              id="addressLine2"
              autoComplete="address-line2"
              placeholder="Bâtiment, étage, etc."
              value={fields.addressLine2}
              onChange={(e) => set("addressLine2", e.target.value)}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="postalCode">Code postal *</Label>
              <Input
                id="postalCode"
                inputMode="numeric"
                autoComplete="postal-code"
                placeholder="75002"
                value={fields.postalCode}
                onChange={(e) => set("postalCode", e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                autoComplete="address-level2"
                placeholder="Paris"
                value={fields.city}
                onChange={(e) => set("city", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={isPending}>
        {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
        Enregistrer
      </Button>
    </form>
  );
}
