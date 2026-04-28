/**
 * Move-in / Move-out Checklist (État des Lieux)
 * French law requires a formal check-in/check-out report for every lease.
 * Law 89-462 of 6 July 1989, Article 3.
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

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChecklistType = "ENTRY" | "EXIT";

export interface ChecklistItem {
  category: string;
  label: string;
  condition?: "NEW" | "GOOD" | "FAIR" | "WORN" | "DAMAGED" | "NA" | "MISSING";
  comment?: string;
}

export interface ChecklistData {
  type: ChecklistType;
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
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postalCode: string;
    surface?: number;
    type?: string;
    floor?: string;
    rooms?: number;
  };
  // Inspection date
  inspectionDate: Date;
  // Items grouped by category
  items: ChecklistItem[];
  // Overall comments
  generalComment?: string;
  // Signature
  referenceNumber: string;
  generatedAt: Date;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const COLORS = {
  entry: "#1565c0",
  exit: "#6a1b9a",
};

const styles = StyleSheet.create({
  page: {
    padding: 45,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a2e",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 24,
    paddingBottom: 15,
  },
  title: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
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
  badge: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 8,
  },
  badgeItem: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 10,
    paddingBottom: 5,
    borderBottom: "1px solid #e0e0e0",
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
  },
  infoBox: {
    width: "30%",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
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
  // Checklist table
  categoryHeader: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 4,
    marginTop: 12,
  },
  categoryTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 2,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#666",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottom: "1px solid #f5f5f5",
    alignItems: "flex-start",
  },
  itemLabel: {
    flex: 1,
    fontSize: 9,
    color: "#1a1a2e",
    lineHeight: 1.4,
  },
  conditionBadge: {
    width: 70,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 3,
    alignItems: "center",
    marginRight: 8,
  },
  conditionText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textTransform: "uppercase",
  },
  commentCell: {
    flex: 1,
    fontSize: 8,
    color: "#666",
    fontStyle: "italic",
  },
  // Summary boxes
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 10,
  },
  summaryBox: {
    width: "47%",
    padding: 12,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
  },
  summaryIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  summaryIconText: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  summaryLabel: {
    fontSize: 9,
    color: "#666",
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
  },
  // General comments
  commentBox: {
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    padding: 12,
    borderLeft: "3px solid #e0e0e0",
  },
  commentLabel: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  commentText: {
    fontSize: 9,
    color: "#444",
    lineHeight: 1.6,
  },
  // Legal notice
  legalNotice: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    borderLeft: "3px solid #e0e0e0",
  },
  legalTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#666",
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
    left: 45,
    right: 45,
    borderTop: "1px solid #ddd",
    paddingTop: 10,
  },
  footerText: {
    fontSize: 7,
    color: "#999",
    textAlign: "center",
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const CONDITION_COLORS: Record<string, string> = {
  NEW: "#2e7d32",
  GOOD: "#388e3c",
  FAIR: "#f57c00",
  WORN: "#e64a19",
  DAMAGED: "#c62828",
  MISSING: "#b71c1c",
  NA: "#9e9e9e",
};

function getConditionLabel(c: string) {
  const labels: Record<string, string> = {
    NEW: "Neuf",
    GOOD: "Bon",
    FAIR: "ÉÉtat",
    WORN: "Usé",
    DAMAGED: "Endommagé",
    MISSING: "Manquant",
    NA: "N/A",
  };
  return labels[c] || c;
}

// Group items by category
function groupByCategory(items: ChecklistItem[]): Record<string, ChecklistItem[]> {
  return items.reduce(
    (acc, item) => {
      const cat = item.category || "Général";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    },
    {} as Record<string, ChecklistItem[]>
  );
}

const CATEGORY_COLORS = [
  "#37474f",
  "#00695c",
  "#6a1b9a",
  "#1565c0",
  "#2e7d32",
  "#e65100",
  "#4527a0",
  "#283593",
];

// ─── PDF Component ────────────────────────────────────────────────────────────

interface ChecklistPDFProps {
  data: ChecklistData;
}

export function ChecklistPDF({ data }: ChecklistPDFProps) {
  const {
    type,
    landlord,
    tenant,
    property,
    inspectionDate,
    items,
    generalComment,
    referenceNumber,
    generatedAt,
  } = data;

  const color = type === "ENTRY" ? COLORS.entry : COLORS.exit;
  const typeLabel = type === "ENTRY" ? "État des Lieux d'Entrée" : "État des Lieux de Sortie";
  const typeSubtitle =
    type === "ENTRY"
      ? "Checklist de remise des clés au locataire"
      : "Checklist de restitution des clés par le locataire";

  const grouped = groupByCategory(items);
  const categoryKeys = Object.keys(grouped);
  const totalItems = items.length;
  const damagedItems = items.filter((i) =>
    ["WORN", "DAMAGED", "MISSING"].includes(i.condition || "")
  ).length;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.header, { borderBottom: `2px solid ${color}`, marginBottom: 12 }]}>
            <View style={styles.badge}>
              <View style={[styles.badgeItem, { backgroundColor: color }]}>
                <Text style={styles.badgeText}>{typeLabel}</Text>
              </View>
            </View>
            <Text style={[styles.title, { color }]}>{typeLabel}</Text>
            <Text style={styles.subtitle}>{typeSubtitle}</Text>
            <Text style={styles.reference}>
              Réf: {referenceNumber} | Généré le{" "}
              {format(generatedAt, "d MMMM yyyy", { locale: fr })}
            </Text>
          </View>
        </View>

        {/* Parties */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>Parties</Text>
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

        {/* Property + inspection info */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>Logement</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Adresse</Text>
              <Text style={styles.infoValue}>{property.addressLine1}</Text>
            </View>
            {property.surface && (
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Surface</Text>
                <Text style={styles.infoValue}>{property.surface} m²</Text>
              </View>
            )}
            {property.rooms && (
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Pièces</Text>
                <Text style={styles.infoValue}>{property.rooms}</Text>
              </View>
            )}
            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Date d&apos;inspection</Text>
              <Text style={styles.infoValue}>
                {format(inspectionDate, "d MMMM yyyy", { locale: fr })}
              </Text>
            </View>
            {property.type && (
              <View style={styles.infoBox}>
                <Text style={styles.infoLabel}>Type</Text>
                <Text style={styles.infoValue}>{property.type}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>
            Résumé de l&apos;inspection
          </Text>
          <View style={styles.summaryGrid}>
            <View
              style={[
                styles.summaryBox,
                { backgroundColor: "#e8f5e9" },
              ]}
            >
              <View
                style={[
                  styles.summaryIcon,
                  { backgroundColor: "#2e7d32" },
                ]}
              >
                <Text style={styles.summaryIconText}>{totalItems}</Text>
              </View>
              <View>
                <Text style={styles.summaryLabel}>Points vérifiés</Text>
                <Text style={[styles.summaryValue, { color: "#2e7d32" }]}>
                  {totalItems - damagedItems} OK / {damagedItems} à surveiller
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.summaryBox,
                { backgroundColor: "#f3e5f5" },
              ]}
            >
              <View
                style={[
                  styles.summaryIcon,
                  { backgroundColor: color },
                ]}
              >
                <Text style={styles.summaryIconText}>
                  {categoryKeys.length}
                </Text>
              </View>
              <View>
                <Text style={styles.summaryLabel}>Catégories</Text>
                <Text style={[styles.summaryValue, { color }]}>
                  {categoryKeys.length} pièces / zones
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Checklist items by category */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color }]}>
            Détail de l&apos;inspection
          </Text>
          {categoryKeys.map((cat, catIdx) => {
            const catColor = CATEGORY_COLORS[catIdx % CATEGORY_COLORS.length];
            return (
              <View key={cat}>
                <View style={[styles.categoryHeader, { backgroundColor: catColor }]}>
                  <Text style={styles.categoryTitle}>{cat}</Text>
                </View>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
                    Élément
                  </Text>
                  <Text style={[styles.tableHeaderCell, { width: 78, textAlign: "center" }]}>
                    État
                  </Text>
                  <Text style={[styles.tableHeaderCell, { flex: 1 }]}>
                    Commentaire
                  </Text>
                </View>
                {grouped[cat].map((item, idx) => {
                  const cond = item.condition || "NA";
                  const condColor = CONDITION_COLORS[cond] || "#9e9e9e";
                  return (
                    <View key={idx} style={styles.tableRow}>
                      <Text style={styles.itemLabel}>{item.label}</Text>
                      <View
                        style={[
                          styles.conditionBadge,
                          { backgroundColor: condColor },
                        ]}
                      >
                        <Text style={styles.conditionText}>
                          {getConditionLabel(cond)}
                        </Text>
                      </View>
                      <Text style={styles.commentCell}>
                        {item.comment || "—"}
                      </Text>
                    </View>
                  );
                })}
              </View>
            );
          })}
        </View>

        {/* General comments */}
        {generalComment && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color }]}>
              Observations générales
            </Text>
            <View style={styles.commentBox}>
              <Text style={styles.commentText}>{generalComment}</Text>
            </View>
          </View>
        )}

        {/* Legal notice */}
        <View style={styles.legalNotice}>
          <Text style={styles.legalTitle}>Cadre légal</Text>
          <Text style={styles.legalText}>
            L&apos;état des lieux est régi par l&apos;article 3 de la loi n° 89-462 du 6 juillet 1989.
            Il doit être établi de manière contradictoire entre le bailleur et le locataire.
            Un état des lieux de sortie mentionnant des dégradations peut justifier
            une retenue sur le dépôt de garantie, à condition d&apos;être appuyé par des
            justificatifs (photos, devis). Le locataire dispose de 2 mois après la sortie
            pour contester le décompte.
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
