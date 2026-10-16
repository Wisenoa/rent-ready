import { describe, it, expect } from "vitest";
import React from "react";
import fs from "node:fs";
import path from "node:path";
import Decimal from "decimal.js";
import { computeQuittanceDocument } from "@/lib/tools/quittance-document";
import { QuittancePdfDocument, type QuittanceParties, type PdfPrimitives } from "@/lib/tools/quittance-pdf";
// Direct import bypassing the vitest alias to exercise real react-pdf engine
import * as RealReactPdf from "../../../node_modules/.pnpm/@react-pdf+renderer@4.4.1_react@19.1.0/node_modules/@react-pdf/renderer/lib/react-pdf.js";

describe("real react-pdf generation and inspection", () => {
  const scratchDir = "/home/ubuntu/.gemini/antigravity-cli/brain/01b768dc-3665-4a20-9ed6-156e69a5e69b/scratch";
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  const realPrimitives: PdfPrimitives = {
    Document: RealReactPdf.Document,
    Page: RealReactPdf.Page,
    View: RealReactPdf.View,
    Text: RealReactPdf.Text,
    StyleSheet: RealReactPdf.StyleSheet,
  };

  const parties: QuittanceParties = {
    bailleurNom: "Marie Dupont",
    bailleurAdresse: "14 rue de Rivoli, 75004 Paris",
    locataireNom: "Lucas Martin",
    bienAdresse: "28 rue Oberkampf, 75011 Paris",
    villeSignature: "Paris",
  };

  it("generates a real binary PDF file for full QUITTANCE DE LOYER", async () => {
    const comp = computeQuittanceDocument({
      ...parties,
      annee: 2026,
      mois: 3,
      datePaiement: "2026-03-05",
      typeCharges: "provision",
      statutPaiement: "complet",
      modePaiement: "virement",
      loyerMensuel: new Decimal("750.00"),
      chargesMensuelles: new Decimal("80.00"),
      prorata: false,
    });
    expect(comp.ok).toBe(true);
    if (!comp.ok) return;

    const doc = (
      <QuittancePdfDocument
        doc={comp.result}
        parties={parties}
        primitives={realPrimitives}
      />
    );
    const pdfPath = path.join(scratchDir, "quittance-complete.pdf");
    await RealReactPdf.renderToFile(doc, pdfPath);

    expect(fs.existsSync(pdfPath)).toBe(true);
    const stat = fs.statSync(pdfPath);
    expect(stat.size).toBeGreaterThan(1000); // Real multi-KB PDF with fonts & layout

    const bytes = fs.readFileSync(pdfPath);
    const contentStr = bytes.toString("latin1");
    expect(contentStr.startsWith("%PDF-1.")).toBe(true);
    expect(contentStr).toContain("%%EOF");
  });

  it("generates a real binary PDF file for REÇU DE PAIEMENT PARTIEL DE LOYER", async () => {
    const comp = computeQuittanceDocument({
      ...parties,
      annee: 2026,
      mois: 3,
      datePaiement: "2026-03-08",
      typeCharges: "provision",
      statutPaiement: "partiel",
      modePaiement: "virement",
      loyerMensuel: new Decimal("800.00"),
      chargesMensuelles: new Decimal("100.00"),
      montantVerse: new Decimal("500.00"),
      prorata: false,
    });
    expect(comp.ok).toBe(true);
    if (!comp.ok) return;

    const doc = (
      <QuittancePdfDocument
        doc={comp.result}
        parties={parties}
        primitives={realPrimitives}
      />
    );
    const pdfPath = path.join(scratchDir, "recu-partiel.pdf");
    await RealReactPdf.renderToFile(doc, pdfPath);

    expect(fs.existsSync(pdfPath)).toBe(true);
    const stat = fs.statSync(pdfPath);
    expect(stat.size).toBeGreaterThan(1000);

    const bytes = fs.readFileSync(pdfPath);
    const contentStr = bytes.toString("latin1");
    expect(contentStr.startsWith("%PDF-1.")).toBe(true);
    expect(contentStr).toContain("%%EOF");
  });
});
