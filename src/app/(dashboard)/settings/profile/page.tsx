import { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/auth";
import { ProfileForm } from "@/components/profile-form";

export const metadata: Metadata = {
  title: "Mon profil",
};

export default async function ProfileSettingsPage() {
  const userId = await getAuthenticatedUserId();

  // Scoped by the session id, not by a URL parameter: this page has none, and
  // the read must never be able to reach another landlord's row.
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      lastName: true,
      phone: true,
      addressLine1: true,
      addressLine2: true,
      postalCode: true,
      city: true,
    },
  });

  if (!user) {
    return <p className="text-muted-foreground">Profil introuvable.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Mon profil</h1>
        <p className="text-muted-foreground mt-1">
          Votre adresse figure en bloc « bailleur » sur chaque quittance de loyer.
          Elle est obligatoire pour en générer une.
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  );
}
