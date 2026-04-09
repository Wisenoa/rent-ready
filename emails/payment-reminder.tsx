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
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type ReminderTone = "friendly" | "formal" | "legal";

interface PaymentReminderEmailProps {
  tenantFirstName: string;
  landlordFirstName: string;
  landlordLastName: string;
  propertyAddress: string;
  amountDue: number;
  dueDate: Date;
  daysLate: number;
  tone: ReminderTone;
  letterUrl?: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

const TONE_CONFIG = {
  friendly: {
    subject: "Rappel : votre loyer en attente",
    preview: "Un petit rappel pour votre paiement en retard",
    color: "#059669",
    label: "Rappel paiement",
    ctaLabel: "Régler mon loyer",
    intro:
      "Bonjour {tenantFirstName}, j'espère que vous allez bien. Je me permets de vous contacter car votre paiement du {dueDateFormatted} n'a pas encore été enregistré.",
    closing:
      "N'hésitez pas à me contacter si vous avez des questions ou si vous rencontrez des difficultés.",
  },
  formal: {
    subject: "Relance pour loyer impayé - {propertyAddress}",
    preview: "Courrier de relance pour paiement en retard",
    color: "#d97706",
    label: "Relance formelle",
    ctaLabel: "Régler maintenant",
    intro:
      "Monsieur/Madame {tenantFirstName}, par la présente, je vous informe qu'à ce jour, le paiement de votre loyer demeure en attente depuis le {dueDateFormatted}.",
    closing:
      "Je vous prie de procéder au réglement dans les meilleurs délais afin d'éviter toutes procédures	contentieuses.",
  },
  legal: {
    subject: "MISE EN DEMEURE - {propertyAddress} - Loyer impayé",
    preview: "Mise en demeure pour loyer impayé",
    color: "#dc2626",
    label: "Mise en demeure",
    ctaLabel: "Régler immédiatement",
    intro:
      "{tenantFirstName}, conformément aux dispositions de l'article 24 de la loi du 6 juillet 1989, je vous mets en demeure de procéder au réglement de la somme due dans un délai de {daysRemaining} jours.",
    closing:
      "À défaut de paiement dans ce délai, je serai contraint d'engager toute procédure légale appropriée pour défendre mes intérêts.",
  },
};

export function PaymentReminderEmail({
  tenantFirstName,
  landlordFirstName,
  landlordLastName,
  propertyAddress,
  amountDue,
  dueDate,
  daysLate,
  tone,
  letterUrl,
}: PaymentReminderEmailProps) {
  const config = TONE_CONFIG[tone];
  const dueDateFormatted = format(dueDate, "d MMMM yyyy", { locale: fr });
  const daysRemaining = Math.max(0, 14 - daysLate);

  return (
    <EmailHtml>
      <Head />
      <Preview>{config.preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.headerSection}>
            <Heading style={{ ...styles.logo, color: config.color }}>
              Rent-Ready
            </Heading>
            <Text style={styles.labelTag}>{config.label}</Text>
          </Section>

          {/* Main Content */}
          <Section style={styles.mainSection}>
            <Text style={styles.greeting}>Bonjour {tenantFirstName},</Text>

            <Text style={styles.text}>
              {config.intro
                .replace("{tenantFirstName}", tenantFirstName)
                .replace("{dueDateFormatted}", dueDateFormatted)
                .replace("{daysRemaining}", String(daysRemaining))}
            </Text>

            {/* Payment Details Card */}
            <Section style={styles.paymentCard}>
              <Text style={styles.cardProperty}>{propertyAddress}</Text>
              <Text style={styles.cardAmount}>{formatCurrency(amountDue)}</Text>
              <Text style={styles.cardLabel}>Montant dû</Text>
              <Text style={styles.cardDueDate}>
                Échéance : {dueDateFormatted} ({daysLate} jour{daysLate > 1 ? "s" : ""} de retard)
              </Text>
            </Section>

            <Section style={styles.ctaSection}>
              <Button
                href={letterUrl ?? "#"}
                style={{ ...styles.ctaButton, backgroundColor: config.color }}
              >
                {config.ctaLabel}
              </Button>
            </Section>

            {letterUrl && (
              <Text style={styles.downloadHint}>
                Télécharger la lettre officielle :{" "}
                <Link href={letterUrl}>PDF de relance</Link>
              </Text>
            )}

            <Text style={styles.text}>{config.closing}</Text>

            <Text style={styles.signature}>
              Cordialement,
              <br />
              <strong>
                {landlordFirstName} {landlordLastName}
              </strong>
            </Text>
          </Section>

          <Hr style={styles.hr} />

          {/* Footer */}
          <Section style={styles.footerSection}>
            <Text style={styles.footerText}>
              Cet email a été envoyé via Rent-Ready, votre outil de gestion locative.
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
    margin: "0",
  },
  labelTag: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "8px",
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
  paymentCard: {
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "24px",
    textAlign: "center" as const,
    border: "1px solid #e2e8f0",
  },
  cardProperty: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "8px",
  },
  cardAmount: {
    fontSize: "32px",
    fontWeight: "700" as const,
    color: "#1e293b",
    marginBottom: "4px",
  },
  cardLabel: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "8px",
  },
  cardDueDate: {
    fontSize: "14px",
    color: "#64748b",
  },
  ctaSection: {
    textAlign: "center" as const,
    marginBottom: "16px",
  },
  ctaButton: {
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600" as const,
    padding: "12px 32px",
    textDecoration: "none",
  },
  downloadHint: {
    fontSize: "13px",
    color: "#64748b",
    textAlign: "center" as const,
    marginBottom: "16px",
  },
  signature: {
    fontSize: "15px",
    lineHeight: "24px",
    color: "#334155",
    marginTop: "8px",
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