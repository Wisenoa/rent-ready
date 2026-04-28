"use server";

import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
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

/**
 * Send a tenant invitation email with magic link.
 * Called after generatePortalLink — sends the portal URL to the tenant.
 */
export async function sendTenantInvitation(tenantId: string): Promise<ActionResult> {
  try {
    const userId = await getCurrentUserId();

    // Verify tenant belongs to this landlord
    const tenant = await prisma.tenant.findFirst({
      where: { id: tenantId, userId },
      include: {
        leases: {
          where: { status: "ACTIVE" },
          include: { property: true },
          take: 1,
        },
      },
    });
    if (!tenant) {
      return { success: false, error: "Locataire introuvable." };
    }

    if (!tenant.email) {
      return { success: false, error: "Ce locataire n'a pas d'adresse email." };
    }

    // Reuse or create a portal token
    const existingToken = await prisma.tenantAccessToken.findFirst({
      where: {
        tenantId,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
    });

    const token = existingToken?.token ?? nanoid(32);
    if (!existingToken) {
      await prisma.tenantAccessToken.create({
        data: {
          tenantId,
          token,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        },
      });
    }

    const portalUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://app.rent-ready.fr"}/portal/${token}`;

    // Get landlord info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { firstName: true, lastName: true },
    });
    if (!user) {
      return { success: false, error: "Utilisateur non trouvé." };
    }

    const activeLease = tenant.leases[0];
    const propertyAddress = activeLease
      ? [activeLease.property.addressLine1, activeLease.property.city]
          .filter(Boolean)
          .join(", ")
      : undefined;

    // Send email via Resend
    const { resend, fromEmail } = await import("@/lib/email");
    const { TenantInvitationEmail } = await import("../../../emails/tenant-invitation");

    const emailResult = await resend.emails.send({
      from: fromEmail,
      to: tenant.email,
      subject: "Accédez à votre espace locataire - Rent-Ready",
      react: (
        <TenantInvitationEmail
          tenantFirstName={tenant.firstName}
          landlordFirstName={user.firstName}
          landlordLastName={user.lastName}
          portalUrl={portalUrl}
          propertyAddress={propertyAddress}
        />
      ),
    });

    if (emailResult.error) {
      console.error("Resend error:", emailResult.error);
      return { success: false, error: "Échec de l'envoi de l'email." };
    }

    return { success: true, data: { sentTo: tenant.email } };
  } catch (error) {
    console.error("sendTenantInvitation error:", error);
    return { success: false, error: "Impossible d'envoyer l'invitation par email." };
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

export async function getPortalQuittances(
  tenantId: string,
  opts: { page?: number; limit?: number } = {}
) {
  const hasAccess = await verifyPortalAccess(tenantId);
  if (!hasAccess) return { quittances: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };

  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  const skip = (page - 1) * limit;

  const where = {
    lease: { tenantId },
    status: "PAID",
    receiptType: { not: null },
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
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
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    quittances: transactions.map((tx) => ({
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
  })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
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

        // Allowlist only safe file extensions to prevent path traversal / executable uploads
        const allowedExtensions = ["jpg", "jpeg", "png", "gif", "webp", "pdf", "doc", "docx", "xls", "xlsx"];
        const ext = (file.name.split(".").pop() ?? "").toLowerCase();
        if (!allowedExtensions.includes(ext)) {
          return { success: false, error: `Type de fichier non autorisé: .${ext}` };
        }
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

export async function getMaintenanceTickets(
  tenantId: string,
  opts: { page?: number; limit?: number } = {}
) {
  const hasAccess = await verifyPortalAccess(tenantId);
  if (!hasAccess) return { tickets: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };

  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  const skip = (page - 1) * limit;

  const where = { tenantId };

  const [tickets, total] = await Promise.all([
    prisma.maintenanceTicket.findMany({
      where,
      include: {
        attachments: true,
        property: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.maintenanceTicket.count({ where }),
  ]);

  return {
    tickets: tickets.map((t) => ({
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
    })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

// ─── Tenant Payments ───

export async function getPendingPayments(
  tenantId: string,
  opts: { page?: number; limit?: number } = {}
) {
  const hasAccess = await verifyPortalAccess(tenantId);
  if (!hasAccess) return { payments: [], pagination: { page: 1, limit: 20, total: 0, pages: 0 } };

  const page = Math.max(1, opts.page ?? 1);
  const limit = Math.min(100, Math.max(1, opts.limit ?? 20));
  const skip = (page - 1) * limit;

  const where = {
    lease: { tenantId },
    status: { in: ["PENDING", "LATE"] },
  };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      include: {
        lease: {
          include: { property: true },
        },
      },
      orderBy: { dueDate: "asc" },
      skip,
      take: limit,
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    payments: transactions.map((tx) => ({
    id: tx.id,
    amount: tx.amount,
    rentPortion: tx.rentPortion,
    chargesPortion: tx.chargesPortion,
    dueDate: tx.dueDate.toISOString(),
    periodStart: tx.periodStart.toISOString(),
    periodEnd: tx.periodEnd.toISOString(),
    status: tx.status,
    propertyName: tx.lease.property.name,
  })),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function initiatePayment(
  transactionId: string,
  tenantId: string
): Promise<ActionResult & { data?: { url: string } }> {
  try {
    const hasAccess = await verifyPortalAccess(tenantId);
    if (!hasAccess) {
      return { success: false, error: "Accès non autorisé." };
    }

    const tx = await prisma.transaction.findFirst({
      where: { id: transactionId, lease: { tenantId } },
      include: {
        lease: {
          include: { tenant: true, property: true, user: true },
        },
      },
    });

    if (!tx) {
      return { success: false, error: "Paiement introuvable." };
    }

    if (tx.status === "PAID") {
      return { success: false, error: "Ce paiement a déjà été effectué." };
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

    // Create a Stripe Checkout session for this specific payment amount
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Loyer ${tx.periodStart.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })} — ${tx.lease.property.name}`,
              description: `Paiement du loyer et charges pour ${tx.lease.property.name}`,
            },
            unit_amount: Math.round(tx.amount * 100), // convert to cents
          },
          quantity: 1,
        },
      ],
      customer_email: tx.lease.tenant.email ?? undefined,
      metadata: {
        transactionId: tx.id,
        tenantId,
        type: "rent_payment",
      },
      success_url: `${appUrl}/portal/payment-success?session_id={CHECKOUT_SESSION_ID}&tx=${tx.id}`,
      cancel_url: `${appUrl}/portal/${await getPortalTokenForTenant(tenantId)}`,
    });

    if (!session.url) {
      return { success: false, error: "Impossible de créer la session de paiement." };
    }

    return { success: true, data: { url: session.url } };
  } catch (error) {
    console.error("initiatePayment error:", error);
    return { success: false, error: "Erreur lors de l'initiation du paiement." };
  }
}

async function getPortalTokenForTenant(tenantId: string): Promise<string> {
  const token = await prisma.tenantAccessToken.findFirst({
    where: {
      tenantId,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
    orderBy: { createdAt: "desc" },
  });
  return token?.token ?? "";
}

// ─── Tenant-Landlord Messages ───

export async function getOrCreateConversation(tenantId: string) {
  const hasAccess = await verifyPortalAccess(tenantId);
  if (!hasAccess) return null;

  const lease = await prisma.lease.findFirst({
    where: { tenantId, status: "ACTIVE" },
    select: { id: true, userId: true },
  });

  if (!lease) return null;

  let conversation = await prisma.conversation.findUnique({
    where: { leaseId: lease.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: {
          tenant: { select: { firstName: true, lastName: true } },
          user: { select: { firstName: true, lastName: true } },
        },
      },
    },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: { leaseId: lease.id, tenantId, userId: lease.userId },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            tenant: { select: { firstName: true, lastName: true } },
            user: { select: { firstName: true, lastName: true } },
          },
        },
      },
    });
  }

  // Mark landlord messages as read
  await prisma.message.updateMany({
    where: { conversationId: conversation.id, senderType: "LANDLORD", isRead: false },
    data: { isRead: true },
  });

  return {
    id: conversation.id,
    messages: conversation.messages.map((m) => ({
      id: m.id,
      content: m.content,
      senderType: m.senderType,
      senderName:
        m.senderType === "TENANT"
          ? `${m.tenant?.firstName ?? ""} ${m.tenant?.lastName ?? ""}`.trim()
          : `${m.user?.firstName ?? ""} ${m.user?.lastName ?? ""}`.trim(),
      isRead: m.isRead,
      createdAt: m.createdAt.toISOString(),
    })),
    unreadCount: conversation.messages.filter((m) => !m.isRead && m.senderType === "LANDLORD").length,
  };
}

export async function sendMessage(
  tenantId: string,
  content: string
): Promise<ActionResult> {
  try {
    const hasAccess = await verifyPortalAccess(tenantId);
    if (!hasAccess) return { success: false, error: "Accès non autorisé." };

    if (!content.trim()) {
      return { success: false, error: "Le message ne peut pas être vide." };
    }

    const lease = await prisma.lease.findFirst({
      where: { tenantId, status: "ACTIVE" },
      select: { id: true, userId: true },
    });

    if (!lease) return { success: false, error: "Aucun bail actif trouvé." };

    // Get or create conversation
    let conversation = await prisma.conversation.findUnique({
      where: { leaseId: lease.id },
    });

    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: { leaseId: lease.id, tenantId, userId: lease.userId },
      });
    }

    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        tenantId,
        senderType: "TENANT",
        content: content.trim(),
      },
    });

    await prisma.conversation.update({
      where: { id: conversation.id },
      data: { lastMessageAt: new Date() },
    });

    revalidatePath("/portal");
    return { success: true };
  } catch (error) {
    console.error("sendMessage error:", error);
    return { success: false, error: "Impossible d'envoyer le message." };
  }
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
