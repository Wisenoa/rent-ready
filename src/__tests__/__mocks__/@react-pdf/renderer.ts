/**
 * Stand-in for @react-pdf/renderer in the test suite.
 *
 * The real library needs a browser/DOM to render, which the node environment does
 * not provide. What tests DO assert on is what the receipt SAYS, so these
 * components render their children instead of swallowing them: a test can mount
 * `QuittancePDF` through `react-dom/server` and read the actual strings the
 * landlord and the tenant would see. A receipt is a legal document — asserting on
 * the props it was handed misses the whole defect class where a figure is right
 * in the data and wrong on the page.
 *
 * `renderToBuffer` additionally records the props of each rendering where a test
 * can read them, and returns a real, minimal PDF so `embedFacturX` (pdf-lib) can
 * still load the bytes it is given, exactly as in production.
 */
import { Fragment, createElement, type ReactNode } from "react";
import type { ReactElement } from "react";

/**
 * Render children rather than null. `react-pdf` reads them; a test needs to.
 */
function passthrough({ children }: { children?: ReactNode }) {
  return createElement(Fragment, null, children);
}

export const Document = passthrough;
export const Page = passthrough;
export const Text = passthrough;
export const View = passthrough;
export const StyleSheet = { create: () => ({}) };

/** What each rendering was asked to print, oldest first. */
export const renderings: Array<Record<string, unknown>> = [];

function minimalPdf(text: string): Buffer {
  const safe = text.replace(/[()\\]/g, "").replace(/[\r\n]/g, " ");
  const stream = `BT /F1 12 Tf 40 700 Td (${safe}) Tj ET`;
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${body}\nendobj\n`;
  });

  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += `${offset.toString().padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${
    objects.length + 1
  } /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;

  return Buffer.from(pdf, "latin1");
}

export async function renderToBuffer(element: ReactElement): Promise<Buffer> {
  const data = (element.props as { data?: Record<string, unknown> }).data;
  if (data) renderings.push(data);
  return minimalPdf(data ? String(data.receiptNumber ?? "") : "");
}

export async function pdf(element: ReactElement) {
  return {
    toBlob: async () => new Blob([new Uint8Array(await renderToBuffer(element))]),
  };
}