"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import type { ActionResult } from "./property-actions";

// ─── Portal Token Management ───

export async function generatePortalLink(tenantId: string): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    // Verify tenant belongs to this landlord
    const tenant = await prisma.tenant.findFirst({
      where: { id: tenantId, userId },
    });
    if (!tenant) {
      return { success: false, error: "Locataire introuvable." };
    }

    const token = nanoid(32);

    await prisma.tenantAccessToken.create({
      data: {
        tenantId,
        token,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    const url = `/portal/${token}`;
    return { success: true, data: { url, token } };
  } catch (error) {
    console.error("generatePortalLink error:", error);
    return { success: false, error: "Impossible de générer le lien d'accès." };
  }
}

export async function verifyPortalToken(token: string) {
  const accessToken = await prisma.tenantAccessToken.findUnique({
    where: { token },
    include: {
      tenant: {
        include: {
          leases: {
            where: { status: "ACTIVE" },
            include: {
              property: true,
              transactions: {
                where: { status: "PAID", receiptType: { not: null } },
                orderBy: { periodStart: "desc" },
              },
            },
            take: 1,
          },
          user: true,
        },
      },
    },
  });

  if (!accessToken) return null;

  // Check expiry
  if (accessToken.expiresAt && accessToken.expiresAt < new Date()) {
    return null;
  }

  // Update lastUsedAt
  await prisma.tenantAccessToken.update({
    where: { id: accessToken.id },
    data: { lastUsedAt: new Date() },
  });

  const tenant = accessToken.tenant;
  const activeLease = tenant.leases[0] ?? null;

  return {
    tenant: {
      id: tenant.id,
      firstName: tenant.firstName,
      lastName: tenant.lastName,
      email: tenant.email,
      phone: tenant.phone,
      addressLine1: tenant.addressLine1,
      addressLine2: tenant.addressLine2,
      city: tenant.city,
      postalCode: tenant.postalCode,
    },
    lease: activeLease
      ? {
          id: activeLease.id,
          rentAmount: activeLease.rentAmount,
          chargesAmount: activeLease.chargesAmount,
          depositAmount: activeLease.depositAmount,
          startDate: activeLease.startDate.toISOString(),
          endDate: activeLease.endDate?.toISOString() ?? null,
          leaseType: activeLease.leaseType,
          status: activeLease.status,
        }
      : null,
    property: activeLease
      ? {
          id: activeLease.property.id,
          name: activeLease.property.name,
          addressLine1: activeLease.property.addressLine1,
          addressLine2: activeLease.property.addressLine2,
          city: activeLease.property.city,
          postalCode: activeLease.property.postalCode,
          type: activeLease.property.type,
        }
      : null,
    landlord: {
      firstName: tenant.user.firstName,
      lastName: tenant.user.lastName,
      addressLine1: tenant.user.addressLine1,
      addressLine2: tenant.user.addressLine2,
      city: tenant.user.city,
      postalCode: tenant.user.postalCode,
    },
  };
}

// ─── Portal Token Verification Helper ───

async function verifyPortalAccess(tenantId: string): Promise<boolean> {
  const token = await prisma.tenantAccessToken.findFirst({
    where: {
      tenantId,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });
  return !!token;
}

// ─── Quittances ───

export async function getPortalQuittances(tenantId: string) {
  const hasAccess = await verifyPortalAccess(tenantId);
  if (!hasAccess) return [];

  const transactions = await prisma.transaction.findMany({
    where: {
      lease: { tenantId },
      status: "PAID",
      receiptType: { not: null },
    },
    include: {
      lease: {
        include: {
          property: true,
          tenant: true,
        },
      },
      user: true,
    },
    orderBy: { periodStart: "desc" },
  });

  return transactions.map((tx) => ({
    id: tx.id,
    amount: tx.amount,
    rentAmount: tx.lease.rentAmount,
    chargesAmount: tx.lease.chargesAmount,
    periodStart: tx.periodStart.toISOString(),
    periodEnd: tx.periodEnd.toISOString(),
    paidAt: tx.paidAt!.toISOString(),
    receiptType: tx.receiptType!,
    receiptNumber: tx.receiptNumber,
    // Full data needed for PDF generation
    landlord: {
      firstName: tx.user.firstName,
      lastName: tx.user.lastName,
      addressLine1: tx.user.addressLine1,
      addressLine2: tx.user.addressLine2 ?? undefined,
      city: tx.user.city,
      postalCode: tx.user.postalCode,
    },
    tenant: {
      firstName: tx.lease.tenant.firstName,
      lastName: tx.lease.tenant.lastName,
      addressLine1: tx.lease.tenant.addressLine1,
      addressLine2: tx.lease.tenant.addressLine2 ?? undefined,
      city: tx.lease.tenant.city,
      postalCode: tx.lease.tenant.postalCode,
    },
    propertyAddress: [
      tx.lease.property.addressLine1,
      tx.lease.property.addressLine2,
      `${tx.lease.property.postalCode} ${tx.lease.property.city}`,
    ]
      .filter(Boolean)
      .join(", "),
  }));
}

// ─── Maintenance Tickets ───

export async function createMaintenanceTicket(
  formData: FormData
): Promise<ActionResult> {
  try {
    const tenantId = formData.get("tenantId") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const priority = formData.get("priority") as string;

    if (!tenantId || !title || !description) {
      return { success: false, error: "Veuillez remplir tous les champs obligatoires." };
    }

    // Verify the tenant has a valid portal access token
    const hasAccess = await verifyPortalAccess(tenantId);
    if (!hasAccess) {
      return { success: false, error: "Accès non autorisé." };
    }

    // Get tenant's active lease to find propertyId
    const lease = await prisma.lease.findFirst({
      where: { tenantId, status: "ACTIVE" },
      select: { propertyId: true },
    });

    if (!lease) {
      return { success: false, error: "Aucun bail actif trouvé." };
    }

    // Handle file uploads
    const files = formData.getAll("files") as File[];
    const attachmentData: {
      fileName: string;
      fileType: string;
      fileUrl: string;
      fileSize: number;
    }[] = [];

    if (files.length > 0) {
      const uploadDir = join(process.cwd(), "public/uploads/maintenance");
      await mkdir(uploadDir, { recursive: true });

      for (const file of files) {
        if (!(file instanceof File) || file.size === 0) continue;

        const ext = file.name.split(".").pop() ?? "bin";
        const uniqueName = `${nanoid(16)}.${ext}`;
        const filePath = join(uploadDir, uniqueName);
        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(filePath, buffer);

        attachmentData.push({
          fileName: file.name,
          fileType: file.type,
          fileUrl: `/uploads/maintenance/${uniqueName}`,
          fileSize: file.size,
        });
      }
    }

    const validPriorities = ["LOW", "MEDIUM", "HIGH", "URGENT"] as const;
    const safePriority = validPriorities.includes(
      priority as (typeof validPriorities)[number]
    )
      ? (priority as (typeof validPriorities)[number])
      : "MEDIUM";

    const ticket = await prisma.maintenanceTicket.create({
      data: {
        tenantId,
        propertyId: lease.propertyId,
        title,
        description,
        priority: safePriority,
        attachments: {
          create: attachmentData,
        },
      },
    });

    revalidatePath(`/portal/`);
    return { success: true, data: { ticketId: ticket.id } };
  } catch (error) {
    console.error("createMaintenanceTicket error:", error);
    return { success: false, error: "Impossible de créer le ticket." };
  }
}

export async function getMaintenanceTickets(tenantId: string) {
  const hasAccess = await verifyPortalAccess(tenantId);
  if (!hasAccess) return [];

  const tickets = await prisma.maintenanceTicket.findMany({
    where: { tenantId },
    include: {
      attachments: true,
      property: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return tickets.map((t) => ({
    id: t.id,
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    propertyName: t.property.name,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    resolvedAt: t.resolvedAt?.toISOString() ?? null,
    attachments: t.attachments.map((a) => ({
      id: a.id,
      fileName: a.fileName,
      fileType: a.fileType,
      fileUrl: a.fileUrl,
      fileSize: a.fileSize,
    })),
  }));
}

// ─── Landlord: Update Ticket Status ───

export async function updateTicketStatus(
  ticketId: string,
  status: string
): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    const validStatuses = ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"] as const;
    if (!validStatuses.includes(status as (typeof validStatuses)[number])) {
      return { success: false, error: "Statut invalide." };
    }

    // Verify landlord owns the property linked to this ticket
    const ticket = await prisma.maintenanceTicket.findUnique({
      where: { id: ticketId },
      include: { property: { select: { userId: true } } },
    });

    if (!ticket || ticket.property.userId !== userId) {
      return { success: false, error: "Ticket introuvable ou accès non autorisé." };
    }

    const safeStatus = status as (typeof validStatuses)[number];

    await prisma.maintenanceTicket.update({
      where: { id: ticketId },
      data: {
        status: safeStatus,
        resolvedAt: safeStatus === "RESOLVED" ? new Date() : undefined,
      },
    });

    revalidatePath("/maintenance");
    return { success: true };
  } catch (error) {
    console.error("updateTicketStatus error:", error);
    return { success: false, error: "Impossible de mettre à jour le statut." };
  }
}
