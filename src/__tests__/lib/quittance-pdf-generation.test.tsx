import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Decimal from "decimal.js";
import { computeQuittanceDocument } from "@/lib/tools/quittance-document";
import { QuittancePdfDocument, type QuittanceParties } from "@/lib/tools/quittance-pdf";
import { pdf, renderToBuffer } from "@react-pdf/renderer";

describe("quittance-pdf-generation (art. 21 loi 1989 documentary & byte generation)", () => {
  const parties: QuittanceParties = {
    bailleurNom: "Marie Dupont",
    bailleurAdresse: "14 rue de Rivoli, 75004 Paris",
    locataireNom: "Lucas Martin",
    bienAdresse: "28 rue Oberkampf, 75011 Paris",
    villeSignature: "Paris",
  };

  it("generates a legally compliant full QUITTANCE DE LOYER and valid PDF bytes", async () => {
    const computed = computeQuittanceDocument({
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

    expect(computed.ok).toBe(true);
    if (!computed.ok) return;

    const doc = computed.result;
    expect(doc.isQuittance).toBe(true);
    expect(doc.documentTitle).toBe("QUITTANCE DE LOYER");

    // 1. Inspect rendered content and legal mentions
    const markup = renderToStaticMarkup(<QuittancePdfDocument doc={doc} parties={parties} />);
    expect(markup).toContain("QUITTANCE DE LOYER");
    expect(markup).toContain("Marie Dupont");
    expect(markup).toContain("Lucas Martin");
    expect(markup).toContain("28 rue Oberkampf");
    expect(markup).toContain("Loyer nu (hors charges)");
    expect(markup).toContain("750,00 €");
    expect(markup).toContain("80,00 €");
    expect(markup).toContain("830,00 €");
    expect(markup).toContain("article 21 de la loi n° 89-462 du 6 juillet 1989");
    // Under full quittance, there must be NO outstanding balance row
    expect(markup).not.toContain("Solde restant dû sur la période");

    // 2. Programmatic PDF bytes generation
    const element = <QuittancePdfDocument doc={doc} parties={parties} />;
    const buffer = await renderToBuffer(element as any);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(50);
    const pdfHeader = buffer.subarray(0, 5).toString("latin1");
    expect(pdfHeader).toBe("%PDF-");

    const blobResult = await pdf(element as any);
    const blob = await blobResult.toBlob();
    expect(blob.size).toBeGreaterThan(50);
  });

  it("switches to REÇU DE PAIEMENT PARTIEL when rent is not paid in full, displays remaining balance and denies quittance effect", async () => {
    const computed = computeQuittanceDocument({
      ...parties,
      annee: 2026,
      mois: 3,
      datePaiement: "2026-03-08",
      typeCharges: "provision",
      statutPaiement: "partiel",
      modePaiement: "virement",
      loyerMensuel: new Decimal("800.00"),
      chargesMensuelles: new Decimal("100.00"), // total due: 900.00
      montantVerse: new Decimal("500.00"), // remaining: 400.00
      prorata: false,
    });

    expect(computed.ok).toBe(true);
    if (!computed.ok) return;

    const doc = computed.result;
    expect(doc.isQuittance).toBe(false);
    expect(doc.documentTitle).toBe("REÇU DE PAIEMENT PARTIEL DE LOYER");
    expect(doc.resteDu.toFixed(2)).toBe("400.00");

    // 1. Inspect rendered content
    const markup = renderToStaticMarkup(<QuittancePdfDocument doc={doc} parties={parties} />);
    expect(markup).toContain("REÇU DE PAIEMENT PARTIEL DE LOYER");
    expect(markup).toContain("500,00 €");
    expect(markup).toContain("reçu de paiement partiel");
    expect(markup).toContain("ne vaut pas quittance libératoire");

    // 2. Programmatic PDF bytes generation
    const element = <QuittancePdfDocument doc={doc} parties={parties} />;
    const buffer = await renderToBuffer(element as any);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(50);
    expect(buffer.subarray(0, 5).toString("latin1")).toBe("%PDF-");
  });
});
