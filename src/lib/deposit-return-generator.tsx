/**
 * Deposit Return / Settlement Form (Décompte de Dépôt de Garantie)
 * Required under French law (Article 22, loi du 6 juillet 1989).
 * Must itemize any deductions and return within 2 months of lease end.
 */
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
import { formatCurrency } from "@/lib/format";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DepositReturnItem {
  description: string;
  amount: number; // negative if deduction
}

export interface DepositReturnData {
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
  propertyAddress: string;
  // Lease info
  leaseStartDate: Date;
  leaseEndDate: Date;
  moveOutDate: Date;
  depositAmount: number;
  // Deductions
  deductions: DepositReturnItem[];
  totalDeductions: number;
  // Return amount
  amountToReturn: number;
  returnDeadline: Date;
  paymentMethod?: string;
  // Meta
  generatedAt: Date;
  referenceNumber: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a2e",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2px solid #2e7d32",
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#2e7d32",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
  },
  reference: {
    fontSize: 9,
    color: "#888",
    marginTop: 4,
  },
  section: {
    marginBottom: 22,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#2e7d32",
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 1,
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  partyBlock: {
    width: "45%",
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
  },
  partyLabel: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  partyName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
  },
  partyAddress: {
    fontSize: 9,
    color: "#444",
    lineHeight: 1.5,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  infoBox: {
    width: "47%",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    borderLeft: "3px solid #2e7d32",
  },
  infoLabel: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  // Deposit summary box
  depositBox: {
    backgroundColor: "#e8f5e9",
    borderRadius: 6,
    padding: 16,
    marginBottom: 20,
    border: "1px solid #a5d6a7",
  },
  depositRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  depositLabel: {
    fontSize: 10,
  },
  depositValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  depositTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTop: "2px solid #a5d6a7",
    marginTop: 8,
  },
  depositTotalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#2e7d32",
  },
  depositTotalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#2e7d32",
    textAlign: "right",
  },
  // Deductions table
  deductionsTable: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 4,
  },
  tableHeaderText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#666",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottom: "1px solid #f0f0f0",
  },
  tableDescCol: {
    flex: 1,
    fontSize: 10,
  },
  tableAmountCol: {
    width: 100,
    fontSize: 10,
    textAlign: "right",
    color: "#c62828",
  },
  tableDeductionLabel: {
    fontSize: 8,
    color: "#888",
    marginTop: 2,
  },
  // Return amount highlight
  returnBox: {
    backgroundColor: "#fff8e1",
    borderRadius: 6,
    padding: 16,
    border: "2px solid #f9a825",
    marginBottom: 20,
  },
  returnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  returnLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#f57f17",
  },
  returnValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#f57f17",
  },
  returnSubtext: {
    fontSize: 8,
    color: "#888",
    marginTop: 4,
    textAlign: "right",
  },
  // Legal notice
  legalNotice: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    borderLeft: "3px solid #2e7d32",
  },
  legalTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#2e7d32",
    marginBottom: 6,
    textTransform: "uppercase",
  },
  legalText: {
    fontSize: 8,
    color: "#666",
    lineHeight: 1.6,
  },
  // Signature block
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  signatureBox: {
    width: "45%",
    alignItems: "center",
  },
  signatureLabel: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  signatureLine: {
    width: "100%",
    borderBottom: "1px solid #333",
    marginBottom: 4,
    height: 30,
  },
  signatureName: {
    fontSize: 9,
    color: "#444",
    textAlign: "center",
  },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 50,
    right: 50,
    borderTop: "1px solid #ddd",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 7,
    color: "#999",
    textAlign: "center",
  },
});

// ─── PDF Component ────────────────────────────────────────────────────────────

interface DepositReturnPDFProps {
  data: DepositReturnData;
}

export function DepositReturnPDF({ data }: DepositReturnPDFProps) {
  const {
    landlord,
    tenant,
    propertyAddress,
    leaseStartDate,
    leaseEndDate,
    moveOutDate,
    depositAmount,
    deductions,
    totalDeductions,
    amountToReturn,
    returnDeadline,
    paymentMethod,
    generatedAt,
    referenceNumber,
  } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Décompte de Dépôt de Garantie</Text>
          <Text style={styles.subtitle}>
            État des lieux de sortie — Reversement du dépôt de garantie
          </Text>
          <Text style={styles.reference}>
            Réf: {referenceNumber} | Généré le{" "}
            {format(generatedAt, "d MMMM yyyy", { locale: fr })}
          </Text>
        </View>

        {/* Parties */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parties</Text>
          <View style={styles.row}>
            <View style={styles.partyBlock}>
              <Text style={styles.partyLabel}>Bailleur</Text>
              <Text style={styles.partyName}>
                {landlord.firstName} {landlord.lastName}
              </Text>
              <Text style={styles.partyAddress}>
                {landlord.addressLine1}
                {landlord.addressLine2 ? `\n${landlord.addressLine2}` : ""}
                {"\n"}
                {landlord.postalCode} {landlord.city}
              </Text>
            </View>
            <View style={styles.partyBlock}>
              <Text style={styles.partyLabel}>Locataire</Text>
              <Text style={styles.partyName}>
                {tenant.firstName} {tenant.lastName}
              </Text>
              <Text style={styles.partyAddress}>
                {tenant.addressLine1}
                {tenant.addressLine2 ? `\n${tenant.addressLine2}` : ""}
                {"\n"}
                {tenant.postalCode} {tenant.city}
              </Text>
            </View>
          </View>
        </View>

        {/* Property + Lease info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations du Bail</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Adresse du logement</Text>
              <Text style={styles.infoValue}>{propertyAddress}</Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Date d&apos;entrée</Text>
              <Text style={styles.infoValue}>
                {format(leaseStartDate, "d MMMM yyyy", { locale: fr })}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Date de sortie</Text>
              <Text style={styles.infoValue}>
                {format(moveOutDate, "d MMMM yyyy", { locale: fr })}
              </Text>
            </View>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Fin théorique du bail</Text>
              <Text style={styles.infoValue}>
                {format(leaseEndDate, "d MMMM yyyy", { locale: fr })}
              </Text>
            </View>
            {paymentMethod && (
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Mode de reversement</Text>
                <Text style={styles.infoValue}>{paymentMethod}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Deposit summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dépôt de Garantie</Text>
          <View style={styles.depositBox}>
            <View style={styles.depositRow}>
              <Text style={styles.depositLabel}>Dépôt reçu à l&apos;entrée</Text>
              <Text style={styles.depositValue}>
                {formatCurrency(depositAmount)}
              </Text>
            </View>
            <View style={styles.depositRow}>
              <Text style={styles.depositLabel}>
                Total des retenues ({deductions.length} poste
                {deductions.length !== 1 ? "s" : ""})
              </Text>
              <Text style={[styles.depositValue, { color: "#c62828" }]}>
                − {formatCurrency(totalDeductions)}
              </Text>
            </View>
            <View style={styles.depositTotalRow}>
              <Text style={styles.depositTotalLabel}>
                Montant à reverser au locataire
              </Text>
              <Text style={styles.depositTotalValue}>
                {formatCurrency(amountToReturn)}
              </Text>
            </View>
          </View>
        </View>

        {/* Deductions detail */}
        {deductions.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Détail des Retenues</Text>
            <View style={styles.deductionsTable}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableHeaderText, { flex: 1 }]}>
                  Désignation
                </Text>
                <Text style={[styles.tableHeaderText, { width: 100, textAlign: "right" }]}>
                  Montant
                </Text>
              </View>
              {deductions.map((item, i) => (
                <View key={i} style={styles.tableRow}>
                  <View style={styles.tableDescCol}>
                    <Text style={styles.tableDescCol}>{item.description}</Text>
                  </View>
                  <Text style={styles.tableAmountCol}>
                    − {formatCurrency(Math.abs(item.amount))}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Amount to return */}
        <View style={styles.returnBox}>
          <View style={styles.returnRow}>
            <View>
              <Text style={styles.returnLabel}>Montant à reverser</Text>
              <Text style={styles.returnSubtext}>
                Délai de reversement:{" "}
                {format(returnDeadline, "d MMMM yyyy", { locale: fr })}
                {" "}
                <Text style={{ color: "#c62828" }}>
                  (article 22, loi du 6 juillet 1989)
                </Text>
              </Text>
            </View>
            <Text style={styles.returnValue}>{formatCurrency(amountToReturn)}</Text>
          </View>
        </View>

        {/* Legal notice */}
        <View style={styles.legalNotice}>
          <Text style={styles.legalTitle}>Informations légales</Text>
          <Text style={styles.legalText}>
            Conformément à l&apos;article 22 de la loi n° 89-462 du 6 juillet 1989,
            le dépôt de garantie doit être restitué dans un délai maximum de 2 mois
            à compter de la restitution des clés par le locataire. En cas de retenue,
            le bailleur doit fournir un état des lieux de sortie détaillé et
            justifié. Le non-respect de ces délais expose le bailleur au versement
            de intérêts au taux légal.
          </Text>
        </View>

        {/* Signatures */}
        <View style={styles.signatureRow}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Signature du bailleur</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>
              {landlord.firstName} {landlord.lastName}
            </Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Signature du locataire</Text>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureName}>
              {tenant.firstName} {tenant.lastName}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Document généré automatiquement | Réf: {referenceNumber} |{" "}
            {format(generatedAt, "d MMMM yyyy", { locale: fr })}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
