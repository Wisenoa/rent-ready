import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { formatCurrency } from "./format";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BailData {
  landlord: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
  };
  tenant: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
  };
  property: {
    name: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    surface?: number;
    type?: string;
  };
  // Lease terms
  leaseType: "UNFURNISHED" | "FURNISHED" | "COMMERCIAL" | "SEASONAL";
  startDate: Date;
  endDate?: Date | null;
  rentAmount: number;
  chargesAmount: number;
  depositAmount: number;
  paymentDay: number;
  paymentMethod: string;
  // IRL
  irlReferenceQuarter?: string | null;
  irlReferenceValue?: number | null;
  // Meta
  leaseId: string;
  generatedAt: Date;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1a1a2e",
    backgroundColor: "#ffffff",
  },
  // Header
  header: {
    marginBottom: 24,
    borderBottom: "2px solid #1e3a5f",
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 8,
    color: "#666",
  },
  // Section
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "1px solid #ddd",
    paddingBottom: 4,
  },
  // Parties row
  partiesRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 12,
  },
  partyBox: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f4f7fb",
    borderRadius: 4,
    borderLeft: "3px solid #1e3a5f",
  },
  partyLabel: {
    fontSize: 7,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  partyName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  partyAddress: {
    fontSize: 8,
    color: "#444",
    lineHeight: 1.5,
  },
  // Property box
  propertyBox: {
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    borderLeft: "3px solid #4a90d9",
    marginBottom: 12,
  },
  propertyName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  propertyAddress: {
    fontSize: 8,
    color: "#444",
    lineHeight: 1.5,
  },
  // Terms grid
  termsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  termCell: {
    width: "48%",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: "#fafafa",
    borderRadius: 3,
  },
  termLabel: {
    fontSize: 8,
    color: "#666",
  },
  termValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  termValueFull: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
    textAlign: "right",
    flex: 1,
  },
  // Financial summary
  financialBox: {
    padding: 12,
    backgroundColor: "#f4f7fb",
    borderRadius: 4,
    marginBottom: 12,
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderBottom: "1px solid #e0e0e0",
  },
  financialLabel: {
    fontSize: 9,
    color: "#444",
  },
  financialValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  financialTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    marginTop: 4,
  },
  financialTotalLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
  },
  financialTotalValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
  },
  // Clause box
  clauseBox: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fffbe6",
    borderRadius: 4,
    borderLeft: "3px solid #f5a623",
  },
  clauseTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#856404",
    marginBottom: 4,
  },
  clauseText: {
    fontSize: 8,
    color: "#856404",
    lineHeight: 1.6,
  },
  // Legal notice
  legalNotice: {
    marginTop: 16,
    padding: 10,
    backgroundColor: "#f0f0ec",
    borderRadius: 4,
    borderLeft: "3px solid #1e3a5f",
  },
  legalText: {
    fontSize: 7.5,
    color: "#555",
    lineHeight: 1.6,
  },
  // Signature section
  signatureRow: {
    flexDirection: "row",
    gap: 32,
    marginTop: 24,
    marginBottom: 16,
  },
  signatureBox: {
    flex: 1,
    paddingTop: 8,
    borderTop: "1px solid #333",
  },
  signatureLabel: {
    fontSize: 8,
    color: "#888",
    marginTop: 4,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 40,
    left: 50,
    right: 50,
    borderTop: "1px solid #ddd",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 7,
    color: "#999",
    textAlign: "center",
  },
  // Page number
  pageNumbers: {
    position: "absolute",
    bottom: 30,
    right: 50,
    fontSize: 7,
    color: "#999",
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const LEASE_TYPE_LABELS: Record<string, string> = {
  UNFURNISHED: "Location vide",
  FURNISHED: "Location meublée",
  COMMERCIAL: "Bail commercial",
  SEASONAL: "Location saisonnière",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  TRANSFER: "Virement bancaire",
  CHECK: "Chèque",
  CASH: "Espèces",
  DIRECT_DEBIT: "Prélèvement automatique",
  OTHER: "Autre",
};

function formatDate(date: Date): string {
  return format(date, "d MMMM yyyy", { locale: fr });
}

function formatAddress(addr: {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  postalCode: string;
}): string {
  const lines = [addr.addressLine1];
  if (addr.addressLine2) lines.push(addr.addressLine2);
  lines.push(`${addr.postalCode} ${addr.city}`);
  return lines.join("\n");
}

// ─── Document ─────────────────────────────────────────────────────────────────

export function BailPDF({ data }: { data: BailData }) {
  const totalMonthly = data.rentAmount + data.chargesAmount;
  const leaseDuration =
    data.endDate
      ? `${Math.ceil(
          (new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) /
            (1000 * 60 * 60 * 24 * 365)
        )} an(s)`
      : "Durée indéterminée";

  const isZoneTendue = ["UNFURNISHED", "FURNISHED"].includes(data.leaseType);

  return (
    <Document
      title={`Bail ${LEASE_TYPE_LABELS[data.leaseType]} — ${data.property.name}`}
      author={`${data.landlord.firstName} ${data.landlord.lastName}`}
      subject={`Contrat de ${LEASE_TYPE_LABELS[data.leaseType]}`}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Contrat de {LEASE_TYPE_LABELS[data.leaseType]}
          </Text>
          <Text style={styles.subtitle}>
            Bail de location — Référence : {data.leaseId.slice(0, 8).toUpperCase()}
          </Text>
        </View>

        {/* Parties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parties contractantes</Text>
          <View style={styles.partiesRow}>
            <View style={styles.partyBox}>
              <Text style={styles.partyLabel}>Bailleur (Propriétaire)</Text>
              <Text style={styles.partyName}>
                {data.landlord.firstName} {data.landlord.lastName}
              </Text>
              <Text style={styles.partyAddress}>
                {formatAddress(data.landlord)}
              </Text>
            </View>
            <View style={styles.partyBox}>
              <Text style={styles.partyLabel}>Locataire</Text>
              <Text style={styles.partyName}>
                {data.tenant.firstName} {data.tenant.lastName}
              </Text>
              <Text style={styles.partyAddress}>
                {formatAddress(data.tenant)}
              </Text>
            </View>
          </View>
        </View>

        {/* Property */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Désignation du bien</Text>
          <View style={styles.propertyBox}>
            <Text style={styles.propertyName}>{data.property.name}</Text>
            <Text style={styles.propertyAddress}>
              {[
                data.property.addressLine1,
                data.property.addressLine2,
                `${data.property.postalCode} ${data.property.city}`,
              ]
                .filter(Boolean)
                .join("\n")}
            </Text>
            {(data.property.surface || data.property.type) && (
              <Text style={{ fontSize: 8, color: "#666", marginTop: 4 }}>
                {data.property.type && `Type : ${data.property.type}`}
                {data.property.type && data.property.surface && " — "}
                {data.property.surface && `Surface : ${data.property.surface} m²`}
              </Text>
            )}
          </View>
        </View>

        {/* Duration */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Durée et dates</Text>
          <View style={styles.termsGrid}>
            <View style={styles.termCell}>
              <Text style={styles.termLabel}>Date de début</Text>
              <Text style={styles.termValue}>{formatDate(data.startDate)}</Text>
            </View>
            <View style={styles.termCell}>
              <Text style={styles.termLabel}>Date de fin</Text>
              <Text style={styles.termValue}>
                {data.endDate ? formatDate(new Date(data.endDate)) : "Indéterminée"}
              </Text>
            </View>
            <View style={styles.termCell}>
              <Text style={styles.termLabel}>Durée minimale</Text>
              <Text style={styles.termValue}>
                {isZoneTendue ? "3 ans (zone tendue)" : "1 an minimum"}
              </Text>
            </View>
            <View style={styles.termCell}>
              <Text style={styles.termLabel}>Durée du contrat</Text>
              <Text style={styles.termValue}>{leaseDuration}</Text>
            </View>
          </View>
        </View>

        {/* Financial terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conditions financières</Text>
          <View style={styles.financialBox}>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Loyer hors charges (HC)</Text>
              <Text style={styles.financialValue}>
                {formatCurrency(data.rentAmount)} / mois
              </Text>
            </View>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>
                Provisions pour charges
              </Text>
              <Text style={styles.financialValue}>
                {formatCurrency(data.chargesAmount)} / mois
              </Text>
            </View>
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Dépôt de garantie</Text>
              <Text style={styles.financialValue}>
                {formatCurrency(data.depositAmount)}
              </Text>
            </View>
            <View style={styles.financialTotal}>
              <Text style={styles.financialTotalLabel}>
                Total charges comprises
              </Text>
              <Text style={styles.financialTotalValue}>
                {formatCurrency(totalMonthly)} / mois
              </Text>
            </View>
          </View>
        </View>

        {/* Payment terms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modalités de paiement</Text>
          <View style={styles.termsGrid}>
            <View style={styles.termCell}>
              <Text style={styles.termLabel}>Jour de paiement</Text>
              <Text style={styles.termValue}>
                Le {data.paymentDay} de chaque mois
              </Text>
            </View>
            <View style={styles.termCell}>
              <Text style={styles.termLabel}>Mode de paiement</Text>
              <Text style={styles.termValue}>
                {PAYMENT_METHOD_LABELS[data.paymentMethod] ?? data.paymentMethod}
              </Text>
            </View>
          </View>
        </View>

        {/* IRL Reference */}
        {(data.irlReferenceQuarter || data.irlReferenceValue) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Référence IRL (révision du loyer)
            </Text>
            <View style={styles.termsGrid}>
              <View style={styles.termCell}>
                <Text style={styles.termLabel}>Trimestre de référence</Text>
                <Text style={styles.termValue}>
                  {data.irlReferenceQuarter ?? "—"}
                </Text>
              </View>
              <View style={styles.termCell}>
                <Text style={styles.termLabel}>Valeur IRL</Text>
                <Text style={styles.termValue}>
                  {data.irlReferenceValue ?? "—"}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Key legal clauses */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Clauses essentielles du bail
          </Text>

          {/* Residence clause */}
          <View style={styles.clauseBox}>
            <Text style={styles.clauseTitle}>
              1. Clause de résidence principale
            </Text>
            <Text style={styles.clauseText}>
              Le locataire s&apos;engage à occuper les lieux comme résidence
              principale et effective pendant toute la durée du bail. Il ne peut
              les sous-louer sauf accord préalable et écrit du bailleur.
            </Text>
          </View>

          {/* IRL revision clause */}
          <View style={styles.clauseBox}>
            <Text style={styles.clauseTitle}>
              2. Clause de révision du loyer (IRL)
            </Text>
            <Text style={styles.clauseText}>
              Le loyer sera révisé chaque année à la date anniversary du bail
              selon l&apos;Indice de Référence des Loyers (IRL) publié par
              l&apos;INSEE. En cas de variation positive, le nouveau loyer sera
              calculé ainsi : nouveau loyer = loyer actuel × (IRL nouveau / IRL
              ancien).
              {data.irlReferenceQuarter && data.irlReferenceValue
                ? ` IRL de référence : ${data.irlReferenceQuarter} — Valeur : ${data.irlReferenceValue}.`
                : " L&apos;IRL applicable sera celui publié au Journal Officiel à la date de révision."}
            </Text>
          </View>

          {/* Deposit clause */}
          <View style={styles.clauseBox}>
            <Text style={styles.clauseTitle}>
              3. Dépôt de garantie
            </Text>
            <Text style={styles.clauseText}>
              Le dépôt de garantie, d&apos;un montant de{" "}
              {formatCurrency(data.depositAmount)}, sera restitué au locataire
              dans un délai maximum de 2 mois suivant la remise des clés, déduction
              faite des sommes légitimement dues (loyer impayé, dégradations,
              charges non régularisées). Aucune majoration ne peut être appliquée.
            </Text>
          </View>

          {/* Termination clause */}
          <View style={styles.clauseBox}>
            <Text style={styles.clauseTitle}>
              4. Congé du bailleur
            </Text>
            <Text style={styles.clauseText}>
              En zone tendue, le bailleur peut donner congé à l&apos;issue des
              3 ans de location, avec un préavis de 6 mois, pour reprendre le
              logement, le vendre, ou pour motif légitime et sérieux. En zone
              non tendue, le délai de préavis est de 3 mois.
            </Text>
          </View>
        </View>

        {/* Legal notice */}
        <View style={styles.legalNotice}>
          <Text style={styles.legalText}>
            Ce bail est soumis aux dispositions de la loi n° 89-462 du 6 juillet
            1989 tendant à améliorer les rapports locatifs. Les parties
            reconnaissent avoir reçu un exemplar du présent contrat conforme à la
            réglementation en vigueur. Toutes les modifications doivent faire
            l&apos;objet d&apos;un avenant écrit signé des deux parties. Le
            locataire peut demander au bailleur une quittance pour tout paiement.
            Document généré par RentReady —{" "}
            {formatDate(data.generatedAt)}.
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 8 }}>Signature du Bailleur</Text>
            <Text style={styles.signatureLabel}>
              {data.landlord.firstName} {data.landlord.lastName}
            </Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={{ fontSize: 8 }}>Signature du Locataire</Text>
            <Text style={styles.signatureLabel}>
              {data.tenant.firstName} {data.tenant.lastName}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            RentReady — Gestion Locative Intelligente — Bail confidentiel entre
            les parties —
          </Text>
        </View>
      </Page>
    </Document>
  );
}
