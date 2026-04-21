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

interface PasswordResetEmailProps {
  email: string;
  resetLink: string;
  expiresIn?: string;
}

export function PasswordResetEmail({
  email,
  resetLink,
  expiresIn = "1 heure",
}: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Réinitialisation de votre mot de passe Rent-Ready</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.headerSection}>
            <Heading style={styles.logo}>Rent-Ready</Heading>
          </Section>

          {/* Main Content */}
          <Section style={styles.mainSection}>
            <Text style={styles.greeting}>Bonjour,</Text>

            <Text style={styles.text}>
              Nous avons reçu une demande de réinitialisation de mot de passe pour{" "}
              <strong>{email}</strong>.
            </Text>

            <Text style={styles.text}>
              Cliquez sur le bouton ci-dessous pour définir un nouveau mot de passe.
              Ce lien expire dans <strong>{expiresIn}</strong> et ne peut être utilisé qu&apos;une seule fois.
            </Text>

            <Section style={styles.ctaSection}>
              <Button href={resetLink} style={styles.ctaButton}>
                Réinitialiser mon mot de passe
              </Button>
            </Section>

            <Text style={styles.text}>
              Si vous n&apos;avez pas demandé cette réinitialisation, vous pouvez ignorer cet email.
              Votre mot de passe actuel reste inchangé.
            </Text>

            <Hr style={styles.divider} />

            <Text style={styles.textSmall}>
              Le lien de réinitialisation :{" "}
              <Link style={styles.link} href={resetLink}>
                {resetLink}
              </Link>
            </Text>

            <Text style={styles.textSmall}>
              Si le bouton ne fonctionne pas, copiez-collez le lien ci-dessus dans votre navigateur.
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
    maxWidth: "480px",
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
