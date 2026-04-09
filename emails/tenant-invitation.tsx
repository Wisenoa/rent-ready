import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html as EmailHtml,
  Link,
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
    <EmailHtml>
      <Head />
      <Preview>
        Accédez à votre espace locataire - {landlordFirstName} {landlordLastName} vous invite
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.headerSection}>
            <Heading style={styles.logo}>Rent-Ready</Heading>
          </Section>

          {/* Main Content */}
          <Section style={styles.mainSection}>
            <Text style={styles.greeting}>Bonjour {tenantFirstName},</Text>

            <Text style={styles.text}>
              <strong>{landlordFirstName} {landlordLastName}</strong> vous invite à accéder à
              votre espace locataire sur Rent-Ready.
            </Text>

            {propertyAddress && (
              <Text style={styles.text}>
                Vous pourrez consulter les informations relatives à votre location situ&#xe9;e
                au {propertyAddress}.
              </Text>
            )}

            <Text style={styles.text}>
              Via cet espace, vous pourrez notamment :
            </Text>

            <Section style={styles.featureList}>
              <Text style={styles.featureItem}>&#x2022; Consulter votre bail et vos quittances de loyer</Text>
              <Text style={styles.featureItem}>&#x2022; Suivre l&apos;historique de vos paiements</Text>
              <Text style={styles.featureItem}>&#x2022; Soumettre des demandes d&apos;intervention</Text>
              <Text style={styles.featureItem}>&#x2022; Communiquer avec votre propri&#xe9;taire</Text>
            </Section>

            <Section style={styles.ctaSection}>
              <Button href={portalUrl} style={styles.ctaButton}>
                Accéder à mon espace
              </Button>
            </Section>

            <Text style={styles.text}>
              Ce lien est valable <strong>30 jours</strong>. Si vous n&apos;avez pas besoin
              d&apos;accéder à votre espace, vous pouvez ignorer cet email.
            </Text>
          </Section>

          <Hr style={styles.hr} />

          {/* Footer */}
          <Section style={styles.footerSection}>
            <Text style={styles.footerText}>
              Cet email a été envoyé par Rent-Ready, votre outil de gestion locative.
            </Text>
            <Text style={styles.footerText}>
              <Link href="https://rent-ready.fr" style={styles.footerLink}>
                rent-ready.fr
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </EmailHtml>
  );
}

const styles = {
  body: {
    backgroundColor: "#f8fafc",
    fontFamily: "Helvetica, Arial, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    margin: "0 auto",
    maxWidth: "600px",
    padding: "32px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  headerSection: {
    textAlign: "center" as const,
    marginBottom: "24px",
  },
  logo: {
    fontSize: "24px",
    fontWeight: "700" as const,
    color: "#6366f1",
    margin: "0",
  },
  mainSection: {
    marginBottom: "24px",
  },
  greeting: {
    fontSize: "18px",
    color: "#1e293b",
    marginBottom: "16px",
  },
  text: {
    fontSize: "15px",
    lineHeight: "24px",
    color: "#334155",
    marginBottom: "16px",
  },
  featureList: {
    marginBottom: "24px",
    paddingLeft: "8px",
  },
  featureItem: {
    fontSize: "15px",
    lineHeight: "28px",
    color: "#334155",
  },
  ctaSection: {
    textAlign: "center" as const,
    marginBottom: "24px",
  },
  ctaButton: {
    backgroundColor: "#6366f1",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600" as const,
    padding: "12px 32px",
    textDecoration: "none",
  },
  hr: {
    borderColor: "#e2e8f0",
    margin: "24px 0",
  },
  footerSection: {
    textAlign: "center" as const,
  },
  footerText: {
    fontSize: "13px",
    color: "#94a3b8",
    marginBottom: "8px",
  },
  footerLink: {
    color: "#6366f1",
    textDecoration: "none",
  },
};
