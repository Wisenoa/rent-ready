import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface TenantInvitationEmailProps {
  tenantFirstName: string;
  landlordFirstName: string;
  landlordLastName: string;
  portalUrl: string;
  propertyAddress?: string;
}

export function TenantInvitationEmail({
  tenantFirstName,
  landlordFirstName,
  landlordLastName,
  portalUrl,
  propertyAddress,
}: TenantInvitationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Accédez à votre espace locataire — {propertyAddress ?? "Rent-Ready"}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.headerSection}>
            <Heading style={styles.logo}>Rent-Ready</Heading>
            <Text style={styles.subtitle}>Espace Locataire</Text>
          </Section>

          {/* Main Content */}
          <Section style={styles.mainSection}>
            <Text style={styles.greeting}>Bonjour {tenantFirstName},</Text>

            <Text style={styles.text}>
              Vous avez été invité par{" "}
              <strong>
                {landlordFirstName} {landlordLastName}
              </strong>{" "}
              à accéder à votre espace locataire sur Rent-Ready
              {propertyAddress ? ` pour le bien situé à ${propertyAddress}` : ""}.
            </Text>

            <Text style={styles.text}>
              Votre espace vous permet de :
            </Text>

            <Section style={styles.featureList}>
              <Text style={styles.featureItem}>
                &#x2022; Consulter votre historique de paiements et télécharger vos quittances
              </Text>
              <Text style={styles.featureItem}>
                &#x2022; Soumettre des demandes de maintenance en ligne
              </Text>
              <Text style={styles.featureItem}>
                &#x2022; Accéder à vos documents de bail
              </Text>
              <Text style={styles.featureItem}>
                &#x2022; Communiquer facilement avec votre propriétaire
              </Text>
            </Section>

            {/* CTA */}
            <Section style={styles.ctaSection}>
              <Button href={portalUrl} style={styles.ctaButton}>
                Accéder à mon espace locataire
              </Button>
            </Section>

            <Text style={styles.textSmall}>
              Ce lien est valable 7 jours. Si vous n&apos;avez pas reçu ce
              message de manière attendue, vous pouvez ignorer cet email.
            </Text>

            <Hr style={styles.divider} />

            <Text style={styles.textSmall}>
              L&apos;équipe Rent-Ready — Gestion locative simplifiée
            </Text>
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
    padding: "40px",
    maxWidth: "520px",
  },
  headerSection: {
    textAlign: "center" as const,
    marginBottom: "32px",
  },
  logo: {
    fontSize: "28px",
    fontWeight: "700" as const,
    color: "#1a1a1a",
    margin: "0",
  },
  subtitle: {
    fontSize: "14px",
    color: "#6b7280",
    marginTop: "4px",
    marginBottom: "0",
  },
  mainSection: {
    marginBottom: "24px",
  },
  greeting: {
    fontSize: "18px",
    fontWeight: "600" as const,
    color: "#1a1a1a",
    marginBottom: "20px",
  },
  text: {
    fontSize: "16px",
    lineHeight: "24px",
    color: "#444444",
    marginBottom: "16px",
  },
  featureList: {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "20px 24px",
    marginBottom: "24px",
  },
  featureItem: {
    fontSize: "15px",
    lineHeight: "26px",
    color: "#374151",
    marginBottom: "8px",
  },
  ctaSection: {
    textAlign: "center" as const,
    margin: "32px 0",
  },
  ctaButton: {
    backgroundColor: "#2563eb",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600" as const,
    padding: "14px 32px",
    textDecoration: "none",
  },
  divider: {
    borderColor: "#e5e7eb",
    margin: "24px 0",
  },
  textSmall: {
    fontSize: "14px",
    lineHeight: "20px",
    color: "#6b7280",
    marginTop: "8px",
  },
};
