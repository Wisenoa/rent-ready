import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface LeaseExpiryEmailProps {
  landlordFirstName: string;
  propertyAddress: string;
  leaseEndDate: Date;
  daysUntilExpiry: number;
  dashboardUrl: string;
}

/**
 * Email sent to landlords when a lease is approaching its expiry date.
 * Warns them to renew or prepare to vacant the property.
 */
export function LeaseExpiryEmail({
  landlordFirstName,
  propertyAddress,
  leaseEndDate,
  daysUntilExpiry,
  dashboardUrl,
}: LeaseExpiryEmailProps) {
  const formattedEndDate = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(leaseEndDate);

  const urgencyColor = daysUntilExpiry <= 30 ? "#dc2626" : daysUntilExpiry <= 60 ? "#d97706" : "#1d4ed8";
  const urgencyLabel =
    daysUntilExpiry <= 30
      ? "Urgent — expiration proche"
      : daysUntilExpiry <= 60
        ? "À renouveler bientôt"
        : "Fin de bail à surveiller";

  return (
    <Html>
      <Head />
      <Preview>
        [{urgencyLabel}] Votre bail pour {propertyAddress} expire le {formattedEndDate}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.headerSection}>
            <Heading style={styles.heading}>
              Fin de bail — {propertyAddress}
            </Heading>
            <Text style={{ ...styles.urgencyBadge, color: urgencyColor }}>
              {urgencyLabel}
            </Text>
          </Section>

          {/* Body */}
          <Section style={styles.bodySection}>
            <Text style={styles.greeting}>Bonjour {landlordFirstName},</Text>

            <Text style={styles.paragraph}>
              Votre bail pour le bien situé à{" "}
              <strong>{propertyAddress}</strong> arrive à échéance le{" "}
              <strong>{formattedEndDate}</strong>.
            </Text>

            <Text style={styles.paragraph}>
              Il vous reste <strong>{daysUntilExpiry} jours</strong> pour
              prendre les décisions appropriées :
            </Text>

            <Section style={styles.actionList}>
              <Text style={styles.actionItem}>
                1. Contacter votre locataire pour discuter du renouvellement
              </Text>
              <Text style={styles.actionItem}>
                2. Vérifier l'état du bien lors de l'état des lieux de sortie
              </Text>
              <Text style={styles.actionItem}>
                3. Mettre à jour votre documentation avec Rent-Ready
              </Text>
            </Section>

            <Section style={styles.ctaSection}>
              <Button href={dashboardUrl} style={styles.primaryButton}>
                Gérer mes biens
              </Button>
            </Section>
          </Section>

          <Hr style={styles.hr} />

          {/* Footer */}
          <Section style={styles.footerSection}>
            <Text style={styles.footerText}>
              Cet email a été envoyé automatiquement par Rent-Ready. Vous le recevez
              parce que vous gérez un bien locatif avec notre plateforme.
            </Text>
            <Link href={dashboardUrl} style={styles.footerLink}>
              Modifier mes préférences email
            </Link>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    margin: "40px auto",
    padding: "32px",
    maxWidth: "560px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  headerSection: {
    marginBottom: "24px",
  },
  heading: {
    fontSize: "22px",
    fontWeight: "700" as const,
    color: "#1a1a1a",
    marginBottom: "8px",
  },
  urgencyBadge: {
    fontSize: "13px",
    fontWeight: "600" as const,
    letterSpacing: "0.5px",
    textTransform: "uppercase" as const,
    margin: "0",
  },
  bodySection: {
    marginBottom: "24px",
  },
  greeting: {
    fontSize: "16px",
    color: "#1a1a1a",
    marginBottom: "16px",
  },
  paragraph: {
    fontSize: "15px",
    lineHeight: "24px",
    color: "#444444",
    marginBottom: "16px",
  },
  actionList: {
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
    padding: "16px 20px",
    marginBottom: "24px",
  },
  actionItem: {
    fontSize: "14px",
    lineHeight: "22px",
    color: "#374151",
    marginBottom: "8px",
  },
  ctaSection: {
    textAlign: "center" as const,
    marginTop: "24px",
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600" as const,
    padding: "12px 24px",
    textDecoration: "none",
  },
  hr: {
    borderColor: "#e5e7eb",
    margin: "24px 0",
  },
  footerSection: {
    marginTop: "8px",
  },
  footerText: {
    fontSize: "12px",
    color: "#9ca3af",
    lineHeight: "18px",
    marginBottom: "8px",
  },
  footerLink: {
    fontSize: "12px",
    color: "#6b7280",
    textDecoration: "underline",
  },
};
