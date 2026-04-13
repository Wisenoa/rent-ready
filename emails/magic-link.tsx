import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
  email: string;
  magicLink: string;
  expiresIn: string;
}

export function MagicLinkEmail({ email, magicLink, expiresIn }: MagicLinkEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Votre lien de connexion RentReady</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.heading}>Connexion à RentReady</Heading>
          <Text style={styles.text}>
            Une demande de connexion a été effectuée pour <strong>{email}</strong>.
          </Text>
          <Text style={styles.text}>
            Cliquez sur le bouton ci-dessous pour vous connecter. Ce lien expire dans{" "}
            <strong>{expiresIn}</strong> et ne peut être utilisé qu&apos;une seule fois.
          </Text>
          <Section style={styles.buttonSection}>
            <Button style={styles.button} href={magicLink}>
              Se connecter à RentReady
            </Button>
          </Section>
          <Text style={styles.textSmall}>
            Si vous n&apos;avez pas demandé ce lien, vous pouvez ignorer cet email en toute sécurité.
          </Text>
          <Text style={styles.textSmall}>
            Le lien de connexion :{" "}
            <Link style={styles.link} href={magicLink}>
              {magicLink}
            </Link>
          </Text>
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
  heading: {
    fontSize: "24px",
    fontWeight: "600" as const,
    color: "#1a1a1a",
    marginBottom: "24px",
  },
  text: {
    fontSize: "16px",
    lineHeight: "24px",
    color: "#444444",
    marginBottom: "16px",
  },
  textSmall: {
    fontSize: "14px",
    lineHeight: "20px",
    color: "#888888",
    marginTop: "16px",
  },
  buttonSection: {
    textAlign: "center" as const,
    margin: "32px 0",
  },
  button: {
    backgroundColor: "#2563eb",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600" as const,
    padding: "14px 28px",
    textDecoration: "none",
  },
  link: {
    color: "#2563eb",
    fontSize: "14px",
  },
};
