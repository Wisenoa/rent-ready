"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { profileSchema } from "@/lib/validations/profile";
import type { ActionResult } from "./property-actions";

/**
 * Update the authenticated landlord's own profile.
 *
 * The scope is derived from the session, never from the submitted data: there is
 * no user id in the payload to tamper with. `where: { id: userId }` is a
 * primary-key lookup rather than a findUnique on an id from the browser, so a
 * client cannot write to another landlord's row.
 */
export async function updateProfile(formData: FormData): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const raw = Object.fromEntries(formData.entries());
    const parsed = profileSchema.safeParse(raw);

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Données invalides",
      };
    }

    const { firstName, lastName, phone, addressLine1, addressLine2, postalCode, city } =
      parsed.data;

    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName,
        lastName,
        phone: phone || null,
        addressLine1,
        addressLine2: addressLine2 || null,
        postalCode,
        city,
        // Better Auth displays `name` everywhere (user menu, greeting). Keep it
        // in sync so the profile the landlord just corrected is the one shown.
        name: `${firstName} ${lastName}`.trim(),
      },
    });

    revalidatePath("/settings/profile");
    return { success: true };
  } catch (error) {
    console.error("updateProfile error:", error);
    return { success: false, error: "Impossible d'enregistrer votre profil." };
  }
}
