"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";

export interface SearchResults {
  tenants: Array<{ id: string; name: string; email: string | null }>;
  properties: Array<{ id: string; name: string; address: string }>;
}

export async function searchAll(query: string): Promise<SearchResults> {
  const userId = await getCurrentUserId();

  const trimmed = query.trim();

  const [tenants, properties] = await Promise.all([
    prisma.tenant.findMany({
      where: {
        userId,
        ...(trimmed
          ? {
              OR: [
                { firstName: { contains: trimmed, mode: "insensitive" } },
                { lastName: { contains: trimmed, mode: "insensitive" } },
                { email: { contains: trimmed, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      select: { id: true, firstName: true, lastName: true, email: true },
      orderBy: { firstName: "asc" },
      take: 5,
    }),
    prisma.property.findMany({
      where: {
        userId,
        ...(trimmed
          ? {
              OR: [
                { name: { contains: trimmed, mode: "insensitive" } },
                { addressLine1: { contains: trimmed, mode: "insensitive" } },
                { city: { contains: trimmed, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      select: { id: true, name: true, addressLine1: true, city: true },
      orderBy: { name: "asc" },
      take: 5,
    }),
  ]);

  return {
    tenants: tenants.map((t) => ({
      id: t.id,
      name: `${t.firstName} ${t.lastName}`,
      email: t.email,
    })),
    properties: properties.map((p) => ({
      id: p.id,
      name: p.name,
      address: `${p.addressLine1}, ${p.city}`,
    })),
  };
}
