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

interface WelcomeEmailProps {
  firstName: string;
  productName?: string;
  loginUrl: string;
}

export function WelcomeEmail({
  firstName,
  productName = "Rent-Ready",
  loginUrl,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Bienvenue sur {productName} — Votre espace de gestion locative est prêt
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.headerSection}>
            <Heading style={styles.logo}>{productName}</Heading>
          </Section>

          {/* Main Content */}
          <Section style={styles.mainSection}>
            <Text style={styles.greeting}>Bonjour {firstName},</Text>

            <Text style={styles.text}>
              Bienvenue sur <strong>{productName}</strong> ! Votre compte a été créé avec succès.
            </Text>

            <Text style={styles.text}>
              Voici ce que vous pouvez faire dès maintenant :
            </Text>

            <Section style={styles.featureList}>
              <Text style={styles.featureItem}>
                &#x2022; <strong>Ajouter vos biens</strong> — Immobilisez vos propriétés et gérez-les depuis un tableau de bord unique
              </Text>
              <Text style={styles.featureItem}>
                &#x2022; <strong>Créer des leases</strong> — Dialectez vos bails et suivez-les automatiquement
              </Text>
              <Text style={styles.featureItem}>
                &#x2022; <strong>Suivre les paiements</strong> — Consultez les quittances et détectez les retards en temps réel
              </Text>
              <Text style={styles.featureItem}>
                &#x2022; <strong>Rappels automatiques</strong> — Ne manquez plus une date de paiement ou d&apos;échéance
              </Text>
            </Section>

            <Section style={styles.ctaSection}>
              <Button href={loginUrl} style={styles.ctaButton}>
                Accéder à mon espace
              </Button>
            </Section>

            <Hr style={styles.divider} />

            <Text style={styles.textSmall}>
              Si vous avez des questions, notre équipe est disponible à{" "}
              <Link style={styles.link} href="mailto:support@rent-ready.fr">
                support@rent-ready.fr
              </Link>
              .
            </Text>

            <Text style={styles.textSmall}>
              L&apos;équipe {productName}
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
  link: {
    color: "#2563eb",
    fontSize: "14px",
  },
};
