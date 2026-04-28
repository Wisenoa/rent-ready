/**
 * Unpaid Rent Notice (Lettre de Relance pour Loyers Impayés)
 * First formal notice before legal proceedings.
 * French law: the bailleur must put the locataire en demeure before any further action.
 * Article 7 of Law 89-462 of 6 July 1989.
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
    borderBottom: "2px solid #b71c1c",
    paddingBottom: 15,
  },
  noticeLabel: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#b71c1c",
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 8,
  },
  reference: {
    fontSize: 9,
    color: "#666",
  },
  dateAndRef: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dateBlock: {
    alignItems: "flex-end",
  },
  dateLabel: {
    fontSize: 8,
    color: "#888",
    textTransform: "uppercase",
  },
  dateValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  partiesRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  partyBox: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f5f5f5",
    borderRadius: 4,
    borderLeft: "3px solid #b71c1c",
  },
  partyLabel: {
    fontSize: 7,
    color: "#888",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  partyName: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
  },
  partyAddress: {
    fontSize: 9,
    color: "#444",
    lineHeight: 1.5,
  },
  subjectLine: {
    backgroundColor: "#fff3f3",
    borderLeft: "4px solid #b71c1c",
    padding: 12,
    marginBottom: 20,
  },
  subjectText: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#b71c1c",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  body: {
    marginBottom: 16,
    lineHeight: 1.7,
    fontSize: 10,
    color: "#222",
  },
  paragraph: {
    marginBottom: 12,
    lineHeight: 1.7,
  },
  highlightBox: {
    backgroundColor: "#fff8f8",
    border: "1px solid #ef9a9a",
    borderRadius: 4,
    padding: 14,
    marginBottom: 16,
  },
  highlightTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#b71c1c",
    marginBottom: 8,
  },
  highlightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    paddingBottom: 6,
    borderBottom: "1px solid #ef9a9a",
  },
  highlightLabel: {
    fontSize: 9,
    color: "#555",
  },
  highlightValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a2e",
  },
  redValue: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#b71c1c",
    textAlign: "right",
  },
  warningBox: {
    backgroundColor: "#fff3cd",
    borderLeft: "3px solid #f5a623",
    padding: 12,
    marginBottom: 20,
    marginTop: 10,
  },
  warningText: {
    fontSize: 9,
    color: "#856404",
    lineHeight: 1.6,
  },
  legalBasis: {
    backgroundColor: "#f5f5f5",
    borderLeft: "3px solid #666",
    padding: 12,
    marginBottom: 20,
  },
  legalText: {
    fontSize: 8.5,
    color: "#555",
    lineHeight: 1.7,
    fontStyle: "italic",
  },
  signatureRow: {
    flexDirection: "row",
    gap: 32,
    marginTop: 30,
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
});

function formatDate(date: Date): string {
  return format(date, "d MMMM yyyy", { locale: fr });
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
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

export interface RelanceData {
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
  unpaidAmount: number;
  unpaidMonths: number;
  periodStart: Date;
  periodEnd: Date;
  paymentDeadline: Date;
  generatedAt: Date;
  noticeNumber: 1 | 2 | 3;
}

export function RelancePDF({ data }: { data: RelanceData }) {
  const noticeType =
    data.noticeNumber === 1
      ? "1ère"
      : data.noticeNumber === 2
        ? "2e"
        : "3e";
  const remainingGracePeriodDays =
    data.noticeNumber === 1 ? 15 : data.noticeNumber === 2 ? 8 : 0;

  return (
    <Document
      title={`Relance pour loyers impayés — ${data.tenant.lastName}`}
      author={`${data.landlord.firstName} ${data.landlord.lastName}`}
      subject={`Lettre de mise en demeure — ${noticeType} relance`}
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.noticeLabel}>
            Lettre de {noticeType} Relance — Loyers Impayés
          </Text>
          <Text style={styles.reference}>
            Document généré par RentReady — référence :{" "}
            {data.generatedAt.toISOString().slice(0, 10).replace(/-/g, "")}
          </Text>
        </View>

        {/* Date + Ref block */}
        <View style={styles.dateAndRef}>
          <View />
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Date d'envoi</Text>
            <Text style={styles.dateValue}>
              {formatDate(data.generatedAt)}
            </Text>
          </View>
        </View>

        {/* Sender (Bailleur) address — top left */}
        <View style={styles.section}>
          <Text style={{ fontSize: 8, color: "#888", marginBottom: 8 }}>
            Expéditeur (Bailleur)
          </Text>
          <Text
            style={{ fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 3 }}
          >
            {data.landlord.firstName} {data.landlord.lastName}
          </Text>
          <Text style={{ fontSize: 9, lineHeight: 1.5 }}>
            {formatAddress(data.landlord)}
          </Text>
        </View>

        {/* Recipient (Locataire) */}
        <View style={styles.section}>
          <Text style={{ fontSize: 8, color: "#888", marginBottom: 8 }}>
            Destinataire (Locataire)
          </Text>
          <Text
            style={{ fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 3 }}
          >
            {data.tenant.firstName} {data.tenant.lastName}
          </Text>
          <Text style={{ fontSize: 9, lineHeight: 1.5 }}>
            {data.tenant.addressLine1}
            {data.tenant.addressLine2
              ? `\n${data.tenant.addressLine2}`
              : ""}
            {"\n"}
            {data.tenant.postalCode} {data.tenant.city}
          </Text>
        </View>

        {/* Objet (Subject line) */}
        <View style={styles.subjectLine}>
          <Text style={styles.subjectText}>
            Objet : Mise en demeure de payer les loyers impayés
            {data.noticeNumber > 1 ? ` — {noticeType} relanc` : ""}
          </Text>
          <Text style={{ fontSize: 9, color: "#666", marginTop: 6 }}>
            LRAR recommandée avec accusé de réception
          </Text>
        </View>

        {/* Unpaid summary box */}
        <View style={styles.highlightBox}>
          <Text style={styles.highlightTitle}>
            Récapitulatif des sommes dues
          </Text>
          <View style={styles.highlightRow}>
            <Text style={styles.highlightLabel}>Période impayée</Text>
            <Text style={styles.highlightValue}>
              {formatDate(data.periodStart)} au {formatDate(data.periodEnd)}
            </Text>
          </View>
          <View style={styles.highlightRow}>
            <Text style={styles.highlightLabel}>Nombre de mois impayés</Text>
            <Text style={styles.highlightValue}>{data.unpaidMonths} mois</Text>
          </View>
          <View style={styles.highlightRow}>
            <Text style={styles.highlightLabel}>Montant total impayé</Text>
            <Text style={styles.redValue}>{formatCurrency(data.unpaidAmount)}</Text>
          </View>
          <View style={styles.highlightRow}>
            <Text style={styles.highlightLabel}>Bien concerné</Text>
            <Text style={styles.highlightValue}>{data.propertyAddress}</Text>
          </View>
        </View>

        {/* Body */}
        <View style={styles.body}>
          <Text style={styles.paragraph}>
            Madame, Monsieur,{"\n\n"}
            Par la présente, nous vous mettons formellement en demeure de
            procéder au règlement de la somme de{" "}
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              {formatCurrency(data.unpaidAmount)}
            </Text>{" "}
            correspondant à{" "}
            {data.unpaidMonths === 1
              ? "un mois de loyer et charges"
              : `${data.unpaidMonths} mois de loyers et charges`}{" "}
            demeurés impayés à ce jour, au titre de votre location du bien
            situé{" "}
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              {data.propertyAddress}
            </Text>
            .
          </Text>

          <Text style={styles.paragraph}>
            Conformément aux dispositions de l'article 7 de la loi n° 89-462 du
            6 juillet 1989 tendant à améliorer les rapports locatifs, le
            locataire qui n'a pas acquitté un loyer ou une provision pour
            charges à son échéance dispose d'un délai de{" "}
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              {remainingGracePeriodDays > 0
                ? `${remainingGracePeriodDays} jours`
                : "délai échu"}
            </Text>{" "}
            pour procéder au paiement.
          </Text>

          {data.noticeNumber === 1 && (
            <Text style={styles.paragraph}>
              Nous vous invitons à régler la somme due dans les meilleurs délais
              et au plus tard dans un délai de 15 jours à compter de la réception
              de la présente mise en demeure. Ce paiement peut être effectué par
              virement bancaire sur le compte dont les coordonnées figurent sur
              votre avis d'échéance.
            </Text>
          )}

          {data.noticeNumber === 2 && (
            <Text style={styles.paragraph}>
              En l'absence de paiement dans un délai de 8 jours à compter de la
              réception de cette {noticeType}e mise en demeure, nous serons dans
              l'obligation d'engager la procédure de résiliation de bail devant le
              tribunal judiciaire, conformément à l'article 24 de la loi du 6
              juillet 1989.
            </Text>
          )}

          {data.noticeNumber === 3 && (
            <Text style={styles.paragraph}>
              Cette troisième mise en demeure constitue l'étape préalable
              obligatoire avant notre assignation au tribunal. Nous vous mettons
              en demeure de procéder au paiement intégral sous 48 heures, failing
              quoi nous engageons immédiatement la procédure judiciaire.
            </Text>
          )}
        </View>

        {/* Warning box */}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            <Text style={{ fontFamily: "Helvetica-Bold" }}>
              Important :{" "}
            </Text>
            Conformément à l'article 7 de la loi du 6 juillet 1989, le
            locataire qui n'a pas acquitté le loyer ou la provision pour charges
            à son échéance est considéré comme défaillant. Le bailleur peut, si
            le délai de grâce est écoulé sans paiement, demander la résiliation
            du bail au tribunal.
          </Text>
        </View>

        {/* Legal basis */}
        <View style={styles.legalBasis}>
          <Text
            style={{
              fontSize: 8,
              fontFamily: "Helvetica-Bold",
              color: "#555",
              marginBottom: 6,
            }}
          >
            Fondements juridiques
          </Text>
          <Text style={styles.legalText}>
            Article 7, loi n°89-462 du 6 juillet 1989 (modifiée) : « Le
            locataire qui ne paie pas le loyer ou les charges doit être mis en
            demeure par lettre recommandée avec accusé de réception. »{"\n"}
            Article 24, loi n°89-462 du 6 juillet 1989 : « Le bailleur peut
            demander la résiliation judiciaire du bail si, à l'expiration du
            délai de grâce, le locataire ne s'est pas acquitté des sommes dues.
          </Text>
        </View>

        {/* Signature */}
        <View style={styles.signatureRow}>
          <View>
            <Text style={{ fontSize: 8, color: "#888", marginBottom: 4 }}>
              Le Bailleur
            </Text>
            <Text
              style={{ fontSize: 10, fontFamily: "Helvetica-Bold", marginTop: 4 }}
            >
              {data.landlord.firstName} {data.landlord.lastName}
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: 8, color: "#888", marginBottom: 4 }}>
              Le Locataire (pour acknowledgement)
            </Text>
            <Text style={{ fontSize: 10, color: "#aaa", marginTop: 4 }}>
              Signature et date :
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Document généré par RentReady — Gestion Locative Intelligente —
            {formatDate(new Date())} — Confidentiel
          </Text>
        </View>
      </Page>
    </Document>
  );
}
