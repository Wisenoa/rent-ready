import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedUserId } from "@/lib/auth";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import React from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { generateRentFollowUpDraft } from "@/lib/ai/lease-analyzer";

async function generateLetterPdf(
  transactionId: string,
  tone: "friendly" | "formal" | "legal"
): Promise<Buffer> {
  const { Document, Page, Text, View, StyleSheet } = await import("@react-pdf/renderer");

  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      lease: { include: { property: true, tenant: true } },
      user: true,
    },
  });

  if (!transaction) throw new Error("Transaction not found");

  const { lease, user } = transaction;
  const { property, tenant } = lease;
  const daysLate = Math.floor(
    (Date.now() - transaction.dueDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const previousAttempts = await prisma.document.count({
    where: {
      userId: user.id,
      type: "OTHER",
      createdAt: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
    },
  });

  const dueDateFormatted = format(transaction.dueDate, "d MMMM yyyy", { locale: fr });
  const draft = await generateRentFollowUpDraft(
    `${tenant.firstName} ${tenant.lastName}`,
    `${property.addressLine1}, ${property.postalCode} ${property.city}`,
    transaction.amount,
    dueDateFormatted,
    daysLate,
    previousAttempts,
    tone
  );

  const styles = StyleSheet.create({
    page: { padding: 60, fontFamily: "Helvetica", color: "#1a1a2e" },
    header: { marginBottom: 40 },
    title: { fontSize: 18, fontFamily: "Helvetica-Bold", marginBottom: 4 },
    subtitle: { fontSize: 11, color: "#666" },
    section: { marginBottom: 20 },
    sectionTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#333", marginBottom: 8 },
    text: { fontSize: 11, lineHeight: 1.6, marginBottom: 8 },
    bold: { fontFamily: "Helvetica-Bold" },
    addressBlock: { marginBottom: 30 },
    dateBlock: { marginBottom: 20 },
    body: { marginBottom: 30 },
    footer: { marginTop: 50, borderTop: "1px solid #ccc", paddingTop: 20 },
    footerText: { fontSize: 9, color: "#999" },
    signature: { marginTop: 40 },
  });

  const LandlordLetter = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {tone === "legal" ? "MISE EN DEMEURE" : "LETTRE DE RELANCE"}
          </Text>
          <Text style={styles.subtitle}>Rent-Ready - Gestion Locative</Text>
        </View>

        {/* Date and Reference */}
        <View style={styles.dateBlock}>
          <Text style={styles.text}>Paris, le {format(new Date(), "d MMMM yyyy", { locale: fr })}</Text>
        </View>

        {/* Addresses */}
        <View style={styles.addressBlock}>
          <Text style={styles.text}>
            <Text style={styles.bold}>{user.firstName} {user.lastName}</Text>
          </Text>
          <Text style={styles.text}>{user.addressLine1}</Text>
          {user.addressLine2 && <Text style={styles.text}>{user.addressLine2}</Text>}
          <Text style={styles.text}>
            {user.postalCode} {user.city}
          </Text>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.text}>
            <Text style={styles.bold}>À l'attention de :</Text>
          </Text>
          <Text style={styles.text}>
            {tenant.firstName} {tenant.lastName}
          </Text>
          <Text style={styles.text}>{tenant.addressLine1}</Text>
          {tenant.addressLine2 && <Text style={styles.text}>{tenant.addressLine2}</Text>}
          <Text style={styles.text}>
            {tenant.postalCode} {tenant.city}
          </Text>
        </View>

        {/* Subject */}
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.text}>
            <Text style={styles.bold}>Objet : </Text>
            {draft.subject}
          </Text>
          <Text style={{ ...styles.text, marginTop: 4 }}>
            Réf. : {property.addressLine1} - Loyer {format(transaction.periodStart, "MMMM yyyy", { locale: fr })}
          </Text>
        </View>

        {/* Body */}
        <View style={styles.body}>
          {draft.body.split("\n\n").map((para, i) => (
            <Text key={i} style={styles.text}>
              {para}
            </Text>
          ))}
        </View>

        {/* Payment Details */}
        <View style={{ marginBottom: 20, padding: 15, backgroundColor: "#f5f5f5" }}>
          <Text style={styles.text}>
            <Text style={styles.bold}>Détails du paiement en retard :</Text>
          </Text>
          <Text style={styles.text}>Bien : {property.addressLine1}, {property.postalCode} {property.city}</Text>
          <Text style={styles.text}>Période : {format(transaction.periodStart, "MMMM yyyy", { locale: fr })}</Text>
          <Text style={styles.text}>Montant dû : {transaction.amount.toFixed(2)} €</Text>
          <Text style={styles.text}>Date d'échéance : {dueDateFormatted}</Text>
          <Text style={styles.text}>Jours de retard : {daysLate} jour{daysLate > 1 ? "s" : ""}</Text>
        </View>

        {/* Next Steps */}
        {draft.nextSteps && (
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.text}>
              <Text style={styles.bold}>Prochaines étapes : </Text>
              {draft.nextSteps}
            </Text>
          </View>
        )}

        {/* Signature */}
        <View style={styles.signature}>
          <Text style={styles.text}>Cordialement,</Text>
          <Text style={{ ...styles.text, marginTop: 20 }}>
            <Text style={styles.bold}>{user.firstName} {user.lastName}</Text>
          </Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Document généré par Rent-Ready - rent-ready.fr
          </Text>
          <Text style={styles.footerText}>
            Ce courrier est informatif et ne constitue pas un acte juridique définitif.
            Consultez un professionnel du droit pour toute action en justice.
          </Text>
        </View>
      </Page>
    </Document>
  );

  return await renderToBuffer(<LandlordLetter />);
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const txId = searchParams.get("tx");
    const tone = (searchParams.get("tone") as "friendly" | "formal" | "legal") ?? "formal";

    if (!txId) {
      return NextResponse.json({ error: "Missing tx parameter" }, { status: 400 });
    }

    const userId = await getAuthenticatedUserId();
    const transaction = await prisma.transaction.findUnique({
      where: { id: txId },
      select: { userId: true },
    });

    if (!transaction || transaction.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const pdfBuffer = await generateLetterPdf(txId, tone);

    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="lettre-relance-${txId.slice(-6)}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Letter PDF error:", error);
    return NextResponse.json({ error: "Failed to generate letter" }, { status: 500 });
  }
}