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

// ─── Types ───

export interface QuittanceData {
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
  rentAmount: number;
  chargesAmount: number;
  totalAmount: number;
  periodStart: Date;
  periodEnd: Date;
  paidAt: Date;
  receiptNumber: string;
  isFullPayment: boolean;
}

// ─── Styles ───

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a2e",
    backgroundColor: "#fafaf8",
  },
  header: {
    marginBottom: 30,
    borderBottom: "2px solid #3b5998",
    paddingBottom: 15,
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#3b5998",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 10,
    color: "#666",
  },
  receiptNumber: {
    fontSize: 9,
    color: "#888",
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#3b5998",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  partyBlock: {
    width: "45%",
    padding: 12,
    backgroundColor: "#f0f0ec",
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
  amountTable: {
    marginTop: 10,
    borderTop: "1px solid #ddd",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottom: "1px solid #eee",
    paddingHorizontal: 8,
  },
  amountLabel: {
    fontSize: 10,
  },
  amountValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    textAlign: "right",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#3b5998",
    borderRadius: 4,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  totalValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  remainingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: "#dc3545",
    borderRadius: 4,
    marginTop: 4,
  },
  remainingLabel: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  remainingValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  legalNotice: {
    marginTop: 30,
    padding: 12,
    backgroundColor: "#f0f0ec",
    borderRadius: 4,
    borderLeft: "3px solid #3b5998",
  },
  legalText: {
    fontSize: 8,
    color: "#666",
    lineHeight: 1.6,
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
  warningBanner: {
    backgroundColor: "#fff3cd",
    padding: 10,
    borderRadius: 4,
    borderLeft: "3px solid #ffc107",
    marginBottom: 20,
  },
  warningText: {
    fontSize: 9,
    color: "#856404",
    fontFamily: "Helvetica-Bold",
  },
});

// ─── Helpers ───

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

// ─── Document Component ───

export function QuittancePDF({ data }: { data: QuittanceData }) {
  const documentTitle = data.isFullPayment
    ? "Quittance de Loyer"
    : "Reçu de Paiement Partiel";

  const expectedTotal = data.rentAmount + data.chargesAmount;
  const remainingBalance = expectedTotal - data.totalAmount;

  return (
    <Document
      title={documentTitle}
      author={`${data.landlord.firstName} ${data.landlord.lastName}`}
      subject={`${documentTitle} - ${format(data.periodStart, "MMMM yyyy", { locale: fr })}`}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{documentTitle}</Text>
          <Text style={styles.subtitle}>
            Période : du {formatDate(data.periodStart)} au{" "}
            {formatDate(data.periodEnd)}
          </Text>
          <Text style={styles.receiptNumber}>
            Réf. : {data.receiptNumber}
          </Text>
        </View>

        {/* Warning banner for partial payment */}
        {!data.isFullPayment && (
          <View style={styles.warningBanner}>
            <Text style={styles.warningText}>
              ATTENTION : Ce document est un reçu de paiement partiel et non
              une quittance de loyer. Le montant reçu (
              {formatCurrency(data.totalAmount)}) est inférieur au montant dû (
              {formatCurrency(expectedTotal)}). Solde restant dû :{" "}
              {formatCurrency(remainingBalance)}.{"\n"}
              Conformément à l'article 21 de la loi n°89-462, une quittance ne
              peut être délivrée que pour un paiement intégral du loyer et des
              charges.
            </Text>
          </View>
        )}

        {/* Parties — full addresses required by law */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parties</Text>
          <View style={styles.row}>
            <View style={styles.partyBlock}>
              <Text style={styles.partyLabel}>Bailleur</Text>
              <Text style={styles.partyName}>
                {data.landlord.firstName} {data.landlord.lastName}
              </Text>
              <Text style={styles.partyAddress}>
                {formatAddress(data.landlord)}
              </Text>
            </View>
            <View style={styles.partyBlock}>
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
          <Text style={styles.sectionTitle}>Bien concerné</Text>
          <Text style={{ fontSize: 10 }}>{data.propertyAddress}</Text>
        </View>

        {/* Amounts — MUST legally separate loyer de base and charges */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail du paiement</Text>
          <View style={styles.amountTable}>
            {/* Ligne 1: Loyer de base (hors charges) */}
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>
                Loyer de base (hors charges)
              </Text>
              <Text style={styles.amountValue}>
                {formatCurrency(data.rentAmount)}
              </Text>
            </View>
            {/* Ligne 2: Provisions pour charges */}
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>
                Provisions pour charges
              </Text>
              <Text style={styles.amountValue}>
                {formatCurrency(data.chargesAmount)}
              </Text>
            </View>
            {/* Total dû */}
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>
                Total dû pour la période
              </Text>
              <Text style={styles.amountValue}>
                {formatCurrency(expectedTotal)}
              </Text>
            </View>
            {/* Total paid */}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>
                {data.isFullPayment ? "Total acquitté" : "Montant reçu"}
              </Text>
              <Text style={styles.totalValue}>
                {formatCurrency(data.totalAmount)}
              </Text>
            </View>
            {/* Remaining balance for partial payment */}
            {!data.isFullPayment && remainingBalance > 0 && (
              <View style={styles.remainingRow}>
                <Text style={styles.remainingLabel}>
                  Solde restant dû
                </Text>
                <Text style={styles.remainingValue}>
                  {formatCurrency(remainingBalance)}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Payment date */}
        <View style={styles.section}>
          <Text style={{ fontSize: 10 }}>
            Paiement reçu le {formatDate(data.paidAt)}.
          </Text>
        </View>

        {/* Legal notice */}
        <View style={styles.legalNotice}>
          {data.isFullPayment ? (
            <Text style={styles.legalText}>
              La présente quittance est délivrée sous réserve de tous droits du
              bailleur, conformément aux dispositions de l'article 21 de la loi
              n°89-462 du 6 juillet 1989 modifiée. Cette quittance annule et
              remplace tout reçu qui aurait pu être établi pour la même période.
              {"\n\n"}
              Le bailleur est tenu de transmettre gratuitement la quittance au
              locataire qui en fait la demande (loi ALUR du 24 mars 2014). La
              quittance porte sur le loyer et les charges du bail. Si le
              locataire a effectué un paiement partiel, le bailleur remet un
              reçu pour le montant versé.
            </Text>
          ) : (
            <Text style={styles.legalText}>
              Le présent reçu atteste du paiement partiel indiqué ci-dessus.
              Conformément à l'article 21 de la loi n°89-462 du 6 juillet 1989,
              une quittance ne peut être délivrée que pour un paiement intégral
              du loyer et des charges. Ce reçu ne constitue pas une quittance et
              ne libère pas le locataire du solde restant dû de{" "}
              {formatCurrency(remainingBalance)}.
            </Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Document généré par RentReady — Gestion Locative Intelligente —{" "}
            {formatDate(new Date())}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

// ─── Validation ───

/**
 * Determines whether a payment qualifies for a Quittance (full receipt)
 * or only a Reçu (partial receipt) per French law.
 *
 * Règle métier stricte (loi du 6 juillet 1989, art. 21):
 * - Paiement >= loyer + charges → "Quittance de loyer"
 * - Paiement < loyer + charges → "Reçu de paiement partiel"
 */
export function determineReceiptType(
  amountPaid: number,
  rentAmount: number,
  chargesAmount: number
): "QUITTANCE" | "RECU" {
  const totalDue = rentAmount + chargesAmount;
  return amountPaid >= totalDue ? "QUITTANCE" : "RECU";
}

/**
 * Generate a sequential receipt number
 * Format: QUI-2026-03-0001 or REC-2026-03-0001
 */
export function generateReceiptNumber(
  type: "QUITTANCE" | "RECU",
  date: Date,
  sequence: number
): string {
  const prefix = type === "QUITTANCE" ? "QUI" : "REC";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const seq = String(sequence).padStart(4, "0");
  return `${prefix}-${year}-${month}-${seq}`;
}
