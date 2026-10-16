import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type { QuittanceComputed } from "./quittance-document";

export interface QuittanceParties {
  bailleurNom: string;
  bailleurAdresse: string;
  locataireNom: string;
  bienAdresse: string;
  villeSignature: string;
}

export function formatEuros(amount: { toFixed: (n: number) => string }): string {
  const [intPart, decPart] = amount.toFixed(2).split(".");
  const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${withSpaces},${decPart} €`;
}

export const quittancePdfStyles = StyleSheet.create({
  page: {
    padding: 46,
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: "#15241F",
    lineHeight: 1.55,
  },
  headerBox: {
    borderBottomWidth: 1.5,
    borderBottomColor: "#1E3A2F",
    paddingBottom: 14,
    marginBottom: 22,
  },
  title: {
    fontSize: 17,
    fontFamily: "Helvetica-Bold",
    color: "#1E3A2F",
    letterSpacing: 0.4,
  },
  subtitle: {
    fontSize: 11,
    color: "#4A5A53",
    marginTop: 4,
  },
  partiesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 22,
  },
  partyBox: {
    flex: 1,
    padding: 12,
    backgroundColor: "#F7F5F0",
    borderRadius: 4,
  },
  partyLabel: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1E3A2F",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  partyName: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1E3A2F",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 18,
    textAlign: "justify",
  },
  table: {
    borderWidth: 1,
    borderColor: "#DCD8CE",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 22,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ECE8DF",
  },
  rowTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: "#1E3A2F",
  },
  rowLabel: { fontSize: 10.5 },
  rowValue: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  rowTotalLabel: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#FFFFFF" },
  rowTotalValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#FFFFFF" },
  rowBalance: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#FBF3E2",
  },
  rowBalanceText: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: "#7A5512",
  },
  signatureBlock: {
    marginTop: 8,
    alignItems: "flex-end",
  },
  legalFooter: {
    marginTop: 28,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E0D5",
    fontSize: 8.8,
    color: "#5C6B64",
  },
});

export function QuittancePdfDocument({
  doc,
  parties,
}: {
  doc: QuittanceComputed;
  parties: QuittanceParties;
}) {
  const bailleurNom = parties.bailleurNom.trim() || "Nom du bailleur";
  const bailleurAdresse = parties.bailleurAdresse.trim() || "Adresse du bailleur";
  const locataireNom = parties.locataireNom.trim() || "Nom du locataire";
  const bienAdresse = parties.bienAdresse.trim() || "Adresse du logement loué";
  const villeSignature = parties.villeSignature.trim() || "Paris";

  return (
    <Document title={`${doc.documentShortLabel} — ${doc.periodeCourte}`}>
      <Page size="A4" style={quittancePdfStyles.page}>
        <View style={quittancePdfStyles.headerBox}>
          <Text style={quittancePdfStyles.title}>{doc.documentTitle}</Text>
          <Text style={quittancePdfStyles.subtitle}>Période : {doc.periodeLabel}</Text>
        </View>

        <View style={quittancePdfStyles.partiesRow}>
          <View style={quittancePdfStyles.partyBox}>
            <Text style={quittancePdfStyles.partyLabel}>Bailleur</Text>
            <Text style={quittancePdfStyles.partyName}>{bailleurNom}</Text>
            <Text>{bailleurAdresse}</Text>
          </View>
          <View style={quittancePdfStyles.partyBox}>
            <Text style={quittancePdfStyles.partyLabel}>Locataire & logement loué</Text>
            <Text style={quittancePdfStyles.partyName}>{locataireNom}</Text>
            <Text>{bienAdresse}</Text>
          </View>
        </View>

        <Text style={quittancePdfStyles.paragraph}>{doc.attestationParagraph}</Text>

        <Text style={quittancePdfStyles.sectionTitle}>Détail du règlement</Text>
        <View style={quittancePdfStyles.table}>
          <View style={quittancePdfStyles.row}>
            <Text style={quittancePdfStyles.rowLabel}>Loyer nu (hors charges)</Text>
            <Text style={quittancePdfStyles.rowValue}>{formatEuros(doc.loyerAppele)}</Text>
          </View>
          <View style={quittancePdfStyles.row}>
            <Text style={quittancePdfStyles.rowLabel}>{doc.chargesLabel}</Text>
            <Text style={quittancePdfStyles.rowValue}>{formatEuros(doc.chargesAppelees)}</Text>
          </View>
          <View style={quittancePdfStyles.row}>
            <Text style={quittancePdfStyles.rowLabel}>Total appelé pour la période</Text>
            <Text style={quittancePdfStyles.rowValue}>{formatEuros(doc.totalAppele)}</Text>
          </View>
          <View style={quittancePdfStyles.rowTotal}>
            <Text style={quittancePdfStyles.rowTotalLabel}>
              Somme reçue le {doc.datePaiementFr} ({doc.modePaiementLabel})
            </Text>
            <Text style={quittancePdfStyles.rowTotalValue}>{formatEuros(doc.montantEncaisse)}</Text>
          </View>
          {!doc.isQuittance ? (
            <View style={quittancePdfStyles.rowBalance}>
              <Text style={quittancePdfStyles.rowBalanceText}>Solde restant dû sur la période</Text>
              <Text style={quittancePdfStyles.rowBalanceText}>{formatEuros(doc.resteDu)}</Text>
            </View>
          ) : null}
        </View>

        <View style={quittancePdfStyles.signatureBlock}>
          <Text>
            Fait à {villeSignature}, le {doc.datePaiementFr}
          </Text>
          <Text style={{ marginTop: 6, fontFamily: "Helvetica-Bold" }}>
            Le bailleur : {bailleurNom}
          </Text>
        </View>

        <View style={quittancePdfStyles.legalFooter}>
          <Text>{doc.reserveLegaleParagraph}</Text>
        </View>
      </Page>
    </Document>
  );
}
