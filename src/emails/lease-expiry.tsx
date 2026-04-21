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

interface LeaseExpiryEmailProps {
  landlordFirstName: string;
  propertyAddress: string;
  leaseEndDate: Date;
  daysUntilExpiry: number;
  dashboardUrl: string;
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export function LeaseExpiryEmail({
  landlordFirstName,
  propertyAddress,
  leaseEndDate,
  daysUntilExpiry,
  dashboardUrl,
}: LeaseExpiryEmailProps) {
  const formattedEndDate = formatDate(leaseEndDate);
  const isUrgent = daysUntilExpiry <= 30;

  return (
    <Html>
      <Head />
      <Preview>
        [Fin de bail] {propertyAddress} — expiration le {formattedEndDate}
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.headerSection}>
            <Heading style={styles.logo}>Rent-Ready</Heading>
            {isUrgent && (
              <Text style={styles.urgentBadge}>ACTION REQUISE</Text>
            )}
          </Section>

          {/* Main Content */}
          <Section style={styles.mainSection}>
            <Text style={styles.greeting}>Bonjour {landlordFirstName},</Text>

            <Text style={styles.text}>
              Le bail concernant <strong>{propertyAddress}</strong> arrive à
              échéance le <strong>{formattedEndDate}</strong>
              {daysUntilExpiry > 0
                ? `, soit dans ${daysUntilExpiry} jour${daysUntilExpiry !== 1 ? "s" : ""}.`
                : ", soit aujourd'hui."}
            </Text>

            {daysUntilExpiry > 60 && (
              <Text style={styles.text}>
                Vous avez encore un peu de temps, mais nous vous recommandons
                de commencer à préparer le renouvellement ou le départ du
                locataire dès maintenant.
              </Text>
            )}

            {daysUntilExpiry > 0 && daysUntilExpiry <= 60 && (
              <>
                <Text style={styles.text}>
                  Il est temps de préparer le renouvellement du bail ou
                  d&apos;initier la procédure de départ. Pensez à :
                </Text>
                <Section style={styles.checklist}>
                  <Text style={styles.checkItem}>
                    &#x2713; Envoyer le congé au locataire (délai legal : 3
                    à 6 mois selon la situation)
                  </Text>
                  <Text style={styles.checkItem}>
                    &#x2713; Planifier l&apos;état des lieux de sortie
                  </Text>
                  <Text style={styles.checkItem}>
                    &#x2713; Vérifier les documents du locataire (
                    garant, assurance)
                  </Text>
                  <Text style={styles.checkItem}>
                    &#x2713; Préparer le renouvellement ou rechercher un
                    nouveau locataire
                  </Text>
                </Section>
              </>
            )}

            {daysUntilExpiry === 0 && (
              <Text style={styles.text}>
                <strong>Le bail expire aujourd&apos;hui.</strong> Nous vous
                rappelons qu&apos;en France, un bail qui arrive à échéance est
                automatiquement reconduit si aucun congé n&apos;a été donné.
                Agissez dès maintenant.
              </Text>
            )}

            {daysUntilExpiry < 0 && (
              <Text style={styles.text}>
                <strong>Le bail a expiré.</strong> Si vous n&apos;avez pas
                encore renouvelé ou signé de départ avec le locataire,
                rapprochez-vous de vos obligations légales rapidement.
              </Text>
            )}

            {/* CTA */}
            <Section style={styles.ctaSection}>
              <Button href={dashboardUrl} style={styles.ctaButton}>
                Gérer depuis mon tableau de bord
              </Button>
            </Section>

            <Hr style={styles.divider} />

            <Text style={styles.textSmall}>
              Cet email vous a été envoyé automatiquement par Rent-Ready. Pour
              gérer vos préférences de notification, consultez votre tableau de
              bord.
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
  urgentBadge: {
    fontSize: "13px",
    fontWeight: "700" as const,
    color: "#ffffff",
    backgroundColor: "#d97706",
    padding: "4px 12px",
    borderRadius: "4px",
    marginTop: "8px",
    display: "inline-block",
    letterSpacing: "0.05em",
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
  checklist: {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "20px 24px",
    marginBottom: "24px",
  },
  checkItem: {
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
