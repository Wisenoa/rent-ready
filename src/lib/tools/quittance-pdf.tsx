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

export const quittancePdfRawStyles = {
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
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
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
    textTransform: "uppercase" as const,
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
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 18,
    textAlign: "justify" as const,
  },
  table: {
    borderWidth: 1,
    borderColor: "#DCD8CE",
    borderRadius: 4,
    overflow: "hidden" as const,
    marginBottom: 22,
  },
  row: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ECE8DF",
  },
  rowTotal: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 9,
    paddingHorizontal: 12,
    backgroundColor: "#1E3A2F",
  },
  rowLabel: { fontSize: 10.5 },
  rowValue: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  rowTotalLabel: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#FFFFFF" },
  rowTotalValue: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#FFFFFF" },
  rowBalance: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
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
    alignItems: "flex-end" as const,
  },
  legalFooter: {
    marginTop: 28,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E0D5",
    fontSize: 8.8,
    color: "#5C6B64",
  },
};

export const quittancePdfStyles = StyleSheet.create(quittancePdfRawStyles);

export interface PdfPrimitives {
  Document: React.ComponentType<any>;
  Page: React.ComponentType<any>;
  View: React.ComponentType<any>;
  Text: React.ComponentType<any>;
  StyleSheet?: { create: (styles: any) => any };
}

export function QuittancePdfDocument({
  doc,
  parties,
  primitives,
}: {
  doc: QuittanceComputed;
  parties: QuittanceParties;
  primitives?: PdfPrimitives;
}) {
  const Doc = primitives?.Document ?? Document;
  const Pg = primitives?.Page ?? Page;
  const Vw = primitives?.View ?? View;
  const Tx = primitives?.Text ?? Text;
  const ss = primitives?.StyleSheet ?? StyleSheet;
  const styles = ss.create(quittancePdfRawStyles);

  const bailleurNom = parties.bailleurNom.trim() || "Nom du bailleur";
  const bailleurAdresse = parties.bailleurAdresse.trim() || "Adresse du bailleur";
  const locataireNom = parties.locataireNom.trim() || "Nom du locataire";
  const bienAdresse = parties.bienAdresse.trim() || "Adresse du logement loué";
  const villeSignature = parties.villeSignature.trim() || "Paris";

  return (
    <Doc title={`${doc.documentShortLabel} — ${doc.periodeCourte}`}>
      <Pg size="A4" style={styles.page}>
        <Vw style={styles.headerBox}>
          <Tx style={styles.title}>{doc.documentTitle}</Tx>
          <Tx style={styles.subtitle}>Période : {doc.periodeLabel}</Tx>
        </Vw>

        <Vw style={styles.partiesRow}>
          <Vw style={styles.partyBox}>
            <Tx style={styles.partyLabel}>Bailleur</Tx>
            <Tx style={styles.partyName}>{bailleurNom}</Tx>
            <Tx>{bailleurAdresse}</Tx>
          </Vw>
          <Vw style={styles.partyBox}>
            <Tx style={styles.partyLabel}>Locataire & logement loué</Tx>
            <Tx style={styles.partyName}>{locataireNom}</Tx>
            <Tx>{bienAdresse}</Tx>
          </Vw>
        </Vw>

        <Tx style={styles.paragraph}>{doc.attestationParagraph}</Tx>

        <Tx style={styles.sectionTitle}>Détail du règlement</Tx>
        <Vw style={styles.table}>
          <Vw style={styles.row}>
            <Tx style={styles.rowLabel}>Loyer nu (hors charges)</Tx>
            <Tx style={styles.rowValue}>{formatEuros(doc.loyerAppele)}</Tx>
          </Vw>
          <Vw style={styles.row}>
            <Tx style={styles.rowLabel}>{doc.chargesLabel}</Tx>
            <Tx style={styles.rowValue}>{formatEuros(doc.chargesAppelees)}</Tx>
          </Vw>
          <Vw style={styles.row}>
            <Tx style={styles.rowLabel}>Total appelé pour la période</Tx>
            <Tx style={styles.rowValue}>{formatEuros(doc.totalAppele)}</Tx>
          </Vw>
          <Vw style={styles.rowTotal}>
            <Tx style={styles.rowTotalLabel}>
              Somme reçue le {doc.datePaiementFr} ({doc.modePaiementLabel})
            </Tx>
            <Tx style={styles.rowTotalValue}>{formatEuros(doc.montantEncaisse)}</Tx>
          </Vw>
          {!doc.isQuittance ? (
            <Vw style={styles.rowBalance}>
              <Tx style={styles.rowBalanceText}>Solde restant dû sur la période</Tx>
              <Tx style={styles.rowBalanceText}>{formatEuros(doc.resteDu)}</Tx>
            </Vw>
          ) : null}
        </Vw>

        <Vw style={styles.signatureBlock}>
          <Tx>
            Fait à {villeSignature}, le {doc.datePaiementFr}
          </Tx>
          <Tx style={{ marginTop: 6, fontFamily: "Helvetica-Bold" }}>
            Le bailleur : {bailleurNom}
          </Tx>
        </Vw>

        <Vw style={styles.legalFooter}>
          <Tx>{doc.reserveLegaleParagraph}</Tx>
        </Vw>
      </Pg>
    </Doc>
  );
}
