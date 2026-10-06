import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MaintenanceRequestEmailProps {
  ticketId: string;
  tenantFirstName: string;
  tenantLastName: string;
  landlordFirstName: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  propertyAddress: string;
  unitName?: string | null;
  createdAt: string;
}

const PRIORITY_COLORS: Record<string, string> = {
  LOW: "#16a34a",
  MEDIUM: "#ca8a04",
  HIGH: "#ea580c",
  URGENT: "#dc2626",
};

const PRIORITY_LABELS: Record<string, string> = {
  LOW: "Basse",
  MEDIUM: "Moyenne",
  HIGH: "Haute",
  URGENT: "Urgente",
};

export function MaintenanceRequestEmail({
  ticketId,
  tenantFirstName,
  tenantLastName,
  landlordFirstName,
  title,
  description,
  priority,
  category,
  propertyAddress,
  unitName,
  createdAt,
}: MaintenanceRequestEmailProps) {
  const priorityColor = PRIORITY_COLORS[priority] ?? "#6b7280";
  const priorityLabel = PRIORITY_LABELS[priority] ?? priority;
  const formattedDate = new Date(createdAt).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Html>
      <Head />
      <Preview>
        Nouvelle demande de maintenance — {title} ({priorityLabel})
      </Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.headerSection}>
            <Heading style={styles.logo}>Rent-Ready</Heading>
            <Text style={styles.subtitle}>Nouvelle demande de maintenance</Text>
          </Section>

          {/* Main Content */}
          <Section style={styles.mainSection}>
            <Text style={styles.greeting}>Bonjour {landlordFirstName},</Text>

            <Text style={styles.text}>
              Une nouvelle demande de maintenance a été soumise par{" "}
              <strong>
                {tenantFirstName} {tenantLastName}
              </strong>{" "}
              pour le bien situé à {propertyAddress}
              {unitName ? ` — ${unitName}` : ""}.
            </Text>

            {/* Ticket Details Card */}
            <Section style={styles.ticketCard}>
              <Section style={styles.ticketHeader}>
                <Text style={styles.ticketTitle}>{title}</Text>
                <Section style={{ ...styles.priorityBadge, backgroundColor: priorityColor }}>
                  <Text style={styles.priorityText}>{priorityLabel}</Text>
                </Section>
              </Section>

              <Hr style={styles.divider} />

              <Section style={styles.detailGrid}>
                <Text style={styles.detailLabel}>Catégorie</Text>
                <Text style={styles.detailValue}>{category}</Text>

                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>{formattedDate}</Text>

                <Text style={styles.detailLabel}>Bien</Text>
                <Text style={styles.detailValue}>
                  {propertyAddress}
                  {unitName ? ` — ${unitName}` : ""}
                </Text>

                <Text style={styles.detailLabel}>N° de demande</Text>
                <Text style={styles.detailValueMono}>{ticketId.slice(0, 8)}</Text>
              </Section>

              <Hr style={styles.divider} />

              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{description}</Text>
            </Section>

            <Text style={styles.textSmall}>
              Vous pouvez consulter cette demande et la traiter depuis votre
              tableau de bord Rent-Ready.
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
    maxWidth: "560px",
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
  ticketCard: {
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    padding: "24px",
    marginBottom: "24px",
    border: "1px solid #e5e7eb",
  },
  ticketHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "16px",
  },
  ticketTitle: {
    fontSize: "18px",
    fontWeight: "600" as const,
    color: "#1a1a1a",
    margin: "0",
    flex: 1,
    marginRight: "12px",
  },
  priorityBadge: {
    borderRadius: "4px",
    padding: "4px 10px",
    flexShrink: 0,
  },
  priorityText: {
    fontSize: "12px",
    fontWeight: "600" as const,
    color: "#ffffff",
    margin: "0",
  },
  divider: {
    borderColor: "#e5e7eb",
    margin: "16px 0",
  },
  detailGrid: {
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: "8px 16px",
  },
  detailLabel: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0",
    alignSelf: "center",
  },
  detailValue: {
    fontSize: "14px",
    color: "#1a1a1a",
    margin: "0",
  },
  detailValueMono: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0",
    fontFamily: "monospace",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "600" as const,
    color: "#6b7280",
    marginBottom: "8px",
    marginTop: "0",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
  },
  description: {
    fontSize: "15px",
    lineHeight: "24px",
    color: "#374151",
    margin: "0",
    whiteSpace: "pre-wrap" as const,
  },
  textSmall: {
    fontSize: "14px",
    lineHeight: "20px",
    color: "#6b7280",
    marginTop: "8px",
  },
};
