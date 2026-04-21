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

interface PaymentReminderEmailProps {
  tenantFirstName: string;
  landlordFirstName: string;
  landlordLastName: string;
  propertyAddress: string;
  amountDue: number;
  dueDate: Date;
  daysLate: number;
  tone: "friendly" | "formal" | "legal";
  letterUrl: string;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

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
  const formattedAmount = formatCurrency(amountDue);
  const formattedDueDate = formatDate(dueDate);

  const isFriendly = tone === "friendly";
  const isFormal = tone === "formal";
  const isLegal = tone === "legal";

  const previewText = isLegal
    ? `MISE EN DEMEURE — ${propertyAddress} — Loyer impayé`
    : isFormal
      ? `Relance pour loyer impayé — ${propertyAddress}`
      : "Rappel : votre loyer en attente";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.headerSection}>
            <Heading style={styles.logo}>Rent-Ready</Heading>
            {isLegal && (
              <Text style={styles.legalBadge}>MISE EN DEMEURE</Text>
            )}
          </Section>

          {/* Main Content */}
          <Section style={styles.mainSection}>
            <Text style={styles.greeting}>Bonjour {tenantFirstName},</Text>

            {isFriendly && (
              <>
                <Text style={styles.text}>
                  Nous espèrons que tout va bien de votre côté. Nous vous écrivons pour un petit rappel concernant votre paiement de
                  loyer.
                </Text>
                <Text style={styles.text}>
                  Votre loyer de <strong>{formattedAmount}</strong> pour{" "}
                  <strong>{propertyAddress}</strong> était dû le{" "}
                  <strong>{formattedDueDate}</strong>, soit il y a{" "}
                  <strong>{daysLate} jour{daysLate !== 1 ? "s" : ""}</strong>.
                </Text>
              </>
            )}

            {isFormal && (
              <>
                <Text style={styles.text}>
                  Par la présente, nous vous informons qu&apos;à ce jour, le
                  solde de votre compte affiche un retard de paiement
                  correspondant à votre loyer.
                </Text>
                <Text style={styles.text}>
                  <strong>Détails du retard :</strong>
                </Text>
                <Section style={styles.detailBox}>
                  <Text style={styles.detailItem}>
                    &#x2022; <strong>Propriété :</strong> {propertyAddress}
                  </Text>
                  <Text style={styles.detailItem}>
                    &#x2022; <strong>Montant dû :</strong> {formattedAmount}
                  </Text>
                  <Text style={styles.detailItem}>
                    &#x2022; <strong>Date d&apos;échéance :</strong>{" "}
                    {formattedDueDate}
                  </Text>
                  <Text style={styles.detailItem}>
                    &#x2022; <strong>Nombre de jours de retard :</strong>{" "}
                    {daysLate}
                  </Text>
                </Section>
              </>
            )}

            {isLegal && (
              <>
                <Text style={styles.text}>
                  Conformément aux dispositions légales en vigueur, nous vous
                  mettons en demeure de procéder au réglement de la somme due
                  dans les plus brefs délais.
                </Text>
                <Section style={styles.legalBox}>
                  <Text style={styles.legalText}>
                    <strong>Propriété :</strong> {propertyAddress}
                  </Text>
                  <Text style={styles.legalText}>
                    <strong>Montant réclamé :</strong> {formattedAmount}
                  </Text>
                  <Text style={styles.legalText}>
                    <strong>Loyer daté du :</strong> {formattedDueDate}
                  </Text>
                  <Text style={styles.legalText}>
                    <strong>Nombre de jours de retard :</strong> {daysLate}{" "}
                    jour{daysLate !== 1 ? "s" : ""}
                  </Text>
                </Section>
                <Text style={styles.text}>
                  À défaut de réglement dans un délai de{" "}
                  <strong>8 jours</strong> à compter de la réception du
                  présent email, nous nous réservons le droit d&apos;engager
                  les poursuites légales nécessaires.
                </Text>
              </>
            )}

            {/* Payment CTA */}
            <Section style={styles.ctaSection}>
              <Button href={letterUrl} style={isLegal ? styles.legalCtaButton : styles.ctaButton}>
                {isLegal
                  ? "Voir la lettre de mise en demeure"
                  : "Régler mon loyer"}
              </Button>
            </Section>

            {isFriendly && (
              <Text style={styles.text}>
                Si vous avez déjà effectué ce réglement, merci de bien vouloir
                ignorer ce message. Sinon, n&apos;hésitez pas à contacter{" "}
                {landlordFirstName} {landlordLastName} si vous avez des
                questions.
              </Text>
            )}

            {isFormal && (
              <Text style={styles.text}>
                Nous restons à votre entière disposition pour tout accord de
                réglement échelonné. Contactez votre propriétaire directement.
              </Text>
            )}

            <Hr style={styles.divider} />

            <Text style={styles.textSmall}>
              Cet email a été envoyé via Rent-Ready par{" "}
              <strong>
                {landlordFirstName} {landlordLastName}
              </strong>
              .
            </Text>
            <Text style={styles.textSmall}>
              Vous recevez ce message car vous êtes locataire associé à ce bien.
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
  legalBadge: {
    fontSize: "13px",
    fontWeight: "700" as const,
    color: "#ffffff",
    backgroundColor: "#dc2626",
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
  detailBox: {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "16px 20px",
    marginBottom: "24px",
  },
  detailItem: {
    fontSize: "15px",
    lineHeight: "26px",
    color: "#374151",
    marginBottom: "4px",
  },
  legalBox: {
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "20px 24px",
    marginBottom: "24px",
  },
  legalText: {
    fontSize: "15px",
    lineHeight: "26px",
    color: "#7f1d1d",
    marginBottom: "6px",
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
  legalCtaButton: {
    backgroundColor: "#dc2626",
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
