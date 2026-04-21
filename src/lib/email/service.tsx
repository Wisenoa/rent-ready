/**
 * Central email service — single place for all transactional email dispatch.
 *
 * Each function wraps:
 *   1. Data fetching (from DB or parameters)
 *   2. Template instantiation
 *   3. sendEmail() call with a stable clientId for idempotency
 *
 * Email types are defined in prisma/schema.prisma as the EmailType enum.
 * New email types must be added to that enum first.
 */

import { nanoid } from "nanoid";
import { sendEmail } from "./sender";
import { prisma } from "@/lib/prisma";
import { fromEmail } from "@/lib/email";
import { WelcomeEmail } from "../../../emails/welcome";
import { PasswordResetEmail } from "../../../emails/password-reset";
import { TenantInvitationEmail } from "../../../emails/tenant-invitation";
import { PaymentReminderEmail } from "../../../emails/payment-reminder";
import { LeaseExpiryEmail } from "../../../emails/lease-expiry";
import type { EmailType } from "@prisma/client";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function appUrl(path: string = ""): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.VERCEL_URL ??
    "https://app.rent-ready.fr";
  return `${base}${path}`;
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Send a welcome email to a newly registered user.
 * Call this from the user creation / sign-up callback.
 *
 * @param userId  — the newly created user's ID
 */
async function sendWelcomeEmail(userId: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, firstName: true, lastName: true },
  });

  if (!user?.email) {
    console.warn("[email/service] sendWelcomeEmail: user not found or has no email", userId);
    return;
  }

  const loginUrl = appUrl("/dashboard");
  const clientId = `welcome-${user.id}-${Date.now()}`;

  await sendEmail({
    clientId,
    to: user.email,
    subject: "Bienvenue sur Rent-Ready — Votre espace de gestion locative est prêt",
    react: (
      <WelcomeEmail
        firstName={user.firstName || user.email.split("@")[0]}
        loginUrl={loginUrl}
      />
    ),
    emailType: "WELCOME",
    relatedEntityId: user.id,
    relatedEntityType: "User",
  });
}

/**
 * Send a password-reset email.
 * Call this from the password-reset flow (better-auth oob/callback).
 *
 * @param email     — the account email
 * @param resetLink — the magic-link / OOB reset URL
 */
async function sendPasswordResetEmail(
  email: string,
  resetLink: string
): Promise<void> {
  const clientId = `password-reset-${email}-${Date.now()}`;

  await sendEmail({
    clientId,
    to: email,
    subject: "Réinitialisation de votre mot de passe Rent-Ready",
    react: <PasswordResetEmail email={email} resetLink={resetLink} />,
    emailType: "PASSWORD_RESET",
    relatedEntityId: email,
    relatedEntityType: "User",
  });
}

/**
 * Send a tenant portal invitation email.
 * Call this when inviting a tenant to the portal.
 *
 * @param tenantId        — the tenant's ID
 * @param portalUrl       — the magic-link URL for the tenant
 * @param landlordName    — full name of the inviting landlord
 * @param propertyAddress — optional property address for context
 */
async function sendTenantInvitationEmail(
  tenantId: string,
  portalUrl: string,
  landlordFirstName: string,
  landlordLastName: string,
  propertyAddress?: string
): Promise<void> {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { id: true, email: true, firstName: true },
  });

  if (!tenant?.email) {
    console.warn("[email/service] sendTenantInvitationEmail: tenant not found or has no email", tenantId);
    return;
  }

  const clientId = `tenant-invite-${tenant.id}-${Date.now()}`;

  await sendEmail({
    clientId,
    to: tenant.email,
    subject: "Accédez à votre espace locataire — Rent-Ready",
    react: (
      <TenantInvitationEmail
        tenantFirstName={tenant.firstName}
        landlordFirstName={landlordFirstName}
        landlordLastName={landlordLastName}
        portalUrl={portalUrl}
        propertyAddress={propertyAddress}
      />
    ),
    emailType: "TENANT_INVITATION",
    relatedEntityId: tenant.id,
    relatedEntityType: "Tenant",
  });
}

/**
 * Send a rent payment reminder email to a tenant.
 * Call this from a cron job that scans for overdue transactions.
 *
 * @param transactionId — the overdue Transaction ID
 * @param tone         — email tone: "friendly" | "formal" | "legal"
 */
async function sendRentReminderEmail(
  transactionId: string,
  tone: "friendly" | "formal" | "legal" = "friendly"
): Promise<void> {
  const tx = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      lease: {
        include: {
          property: { select: { addressLine1: true, city: true, postalCode: true } },
          tenant: { select: { id: true, email: true, firstName: true } },
        },
      },
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  });

  if (!tx) {
    console.warn("[email/service] sendRentReminderEmail: transaction not found", transactionId);
    return;
  }

  const { lease, user } = tx;
  const { tenant, property } = lease;

  if (!tenant.email) {
    console.warn("[email/service] sendRentReminderEmail: tenant has no email", tenant.id);
    return;
  }

  const daysLate = Math.floor(
    (Date.now() - tx.dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const propertyAddress = `${property.addressLine1}, ${property.postalCode} ${property.city}`;
  const letterUrl = appUrl(`/transactions/${tx.id}/letter?tone=${tone}`);

  const subject =
    tone === "legal"
      ? `MISE EN DEMEURE — ${property.addressLine1} — Loyer impayé`
      : tone === "formal"
        ? `Relance pour loyer impayé — ${property.addressLine1}`
        : "Rappel : votre loyer en attente";

  const clientId = `rent-reminder-${tx.id}-${tone}-${Date.now()}`;

  await sendEmail({
    clientId,
    to: tenant.email,
    subject,
    react: (
      <PaymentReminderEmail
        tenantFirstName={tenant.firstName}
        landlordFirstName={user.firstName}
        landlordLastName={user.lastName}
        propertyAddress={propertyAddress}
        amountDue={tx.amount}
        dueDate={tx.dueDate}
        daysLate={Math.max(0, daysLate)}
        tone={tone}
        letterUrl={letterUrl}
      />
    ),
    emailType: tone === "legal" ? "PAYMENT_LATE" : "RENT_REMINDER",
    relatedEntityId: tx.id,
    relatedEntityType: "Transaction",
  });
}

/**
 * Send a demo-request notification to the sales team.
 * Call this from the /api/lead/demo endpoint after a demo request is submitted.
 */
async function sendDemoRequestNotification(
  lead: {
    name: string;
    email: string;
    properties?: string;
    message?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }
): Promise<void> {
  const salesEmail = process.env.SALES_EMAIL ?? "contact@rent-ready.fr";
  const clientId = `demo-request-${lead.email}-${Date.now()}`;

  await sendEmail({
    clientId,
    to: salesEmail,
    subject: `[Rent-Ready] Nouvelle demande de démo — ${lead.name}`,
    react: (
      <DemoRequestEmail
        name={lead.name}
        email={lead.email}
        properties={lead.properties}
        message={lead.message}
        utmSource={lead.utmSource}
        utmMedium={lead.utmMedium}
        utmCampaign={lead.utmCampaign}
      />
    ),
    emailType: "DEMO_REQUEST",
  });
}

// ─── Internal-only email template ────────────────────────────────────────────

/** Minimal HTML email for demo request notifications to the internal sales team */
function DemoRequestEmail({
  name,
  email,
  properties,
  message,
  utmSource,
  utmMedium,
  utmCampaign,
}: {
  name: string;
  email: string;
  properties?: string;
  message?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}) {
  const { Html, Head, Body, Container, Heading, Text, Section } = require("@react-email/components");

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: "#f6f9fc", fontFamily: "sans-serif" }}>
        <Container style={{ backgroundColor: "#fff", borderRadius: "8px", margin: "40px auto", padding: "32px", maxWidth: "520px" }}>
          <Heading style={{ fontSize: "20px", fontWeight: "700", color: "#1a1a1a", marginBottom: "24px" }}>
            Nouvelle demande de démo
          </Heading>

          <Section>
            <Text style={{ fontSize: "15px", lineHeight: "22px", color: "#444" }}>
              <strong>Nom :</strong> {name}
            </Text>
            <Text style={{ fontSize: "15px", lineHeight: "22px", color: "#444" }}>
              <strong>Email :</strong>{" "}
              <a href={`mailto:${email}`} style={{ color: "#2563eb" }}>{email}</a>
            </Text>
            {properties && (
              <Text style={{ fontSize: "15px", lineHeight: "22px", color: "#444" }}>
                <strong>Nombre de biens :</strong> {properties}
              </Text>
            )}
            {message && (
              <Text style={{ fontSize: "15px", lineHeight: "22px", color: "#444", marginTop: "16px" }}>
                <strong>Message :</strong><br />{message}
              </Text>
            )}
            {(utmSource || utmMedium || utmCampaign) && (
              <Text style={{ fontSize: "13px", color: "#888", marginTop: "20px" }}>
                UTM : {utmSource ? `source=${utmSource}` : ""} {utmMedium ? `medium=${utmMedium}` : ""} {utmCampaign ? `campaign=${utmCampaign}` : ""}
              </Text>
            )}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/**
 * Send a lease-expiry warning email to the landlord.
 * Call this from a cron job that scans leases approaching their end date.
 *
 * @param leaseId — the Lease ID
 */
async function sendLeaseExpiryEmail(leaseId: string): Promise<void> {
  const lease = await prisma.lease.findUnique({
    where: { id: leaseId },
    include: {
      property: { select: { addressLine1: true, city: true, postalCode: true } },
      tenant: { select: { firstName: true } },
      user: { select: { id: true, email: true, firstName: true } },
    },
  });

  if (!lease) {
    console.warn("[email/service] sendLeaseExpiryEmail: lease not found", leaseId);
    return;
  }

  if (!lease.user?.email || !lease.user?.firstName) {
    console.warn("[email/service] sendLeaseExpiryEmail: landlord has no email or firstName", lease.userId);
    return;
  }

  const propertyAddress = `${lease.property.addressLine1}, ${lease.postalCode} ${lease.property.city}`;
  const daysUntilExpiry = Math.floor(
    (lease.endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const dashboardUrl = appUrl("/dashboard");
  const clientId = `lease-expiry-${lease.id}-${Date.now()}`;

  await sendEmail({
    clientId,
    to: lease.user.email,
    subject: `[Fin de bail] ${propertyAddress} — expiration le ${new Intl.DateTimeFormat("fr-FR").format(lease.endDate)}`,
    react: (
      <LeaseExpiryEmail
        landlordFirstName={lease.user.firstName}
        propertyAddress={propertyAddress}
        leaseEndDate={lease.endDate}
        daysUntilExpiry={Math.max(0, daysUntilExpiry)}
        dashboardUrl={dashboardUrl}
      />
    ),
    emailType: "LEASE_EXPIRING",
    relatedEntityId: lease.id,
    relatedEntityType: "Lease",
  });
}

// ─── Export the public surface ────────────────────────────────────────────────

export const emailService = {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendTenantInvitationEmail,
  sendRentReminderEmail,
  sendLeaseExpiryEmail,
  sendDemoRequestNotification,
};

export type { EmailType };
