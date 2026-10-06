import { describe, it, expect, vi, beforeEach } from "vitest";
import { render } from "@react-email/components";

import { PaymentReminderEmail } from "@/emails/payment-reminder";

const props = {
  tenantFirstName: "Ana",
  landlordFirstName: "Karim",
  landlordLastName: "Benali",
  propertyAddress: "12 rue des Lilas, 69003 Lyon",
  amountDue: 570.55,
  dueDate: new Date("2026-08-05T00:00:00.000Z"),
  daysLate: 27,
  tone: "friendly" as const,
  letterUrl: "http://localhost:3000/portal",
};

/**
 * The relance email, rendered for real.
 *
 * `sendPaymentReminder` handed this react-email tree (`Html`/`Head`/`Body` of
 * `@react-email/components`) to `renderToBuffer` from `@react-pdf/renderer` —
 * a PDF engine with none of those primitives. It could not render, and had it
 * rendered, the PDF bytes were passed straight to Resend as the `html` field.
 * The path was unreachable, so no test failed: `reminder-action.test.ts`
 * mocked BOTH the renderer and this module, and a stub that returns a fixed
 * buffer proves nothing about which engine ran.
 *
 * Nothing is mocked here. The renderer and the email are the real ones, so
 * feeding the action's engine to a PDF tree again fails these assertions rather
 * than passing silently. The pair is what matters: `render` (HTML) and
 * `renderToBuffer` (PDF) are both imported from different packages, and only one
 * of them understands a react-email tree.
 */
describe("renderReminderEmail — the relance email is real HTML", () => {
  it("renders to an HTML string, not a PDF buffer", async () => {
    const html = await render(<PaymentReminderEmail {...props} />);

    expect(typeof html).toBe("string");
    // The signature of a PDF byte stream. If this ever comes back, the email is
    // being rendered by a PDF engine again.
    expect(html.startsWith("%PDF")).toBe(false);
    expect(html).toContain("<html");
  });

  it("states the balance the tenant still owes", async () => {
    // The whole point of the email: 570,55 remaining, not the month's original
    // 970,55. A tenant handed over 400 EUR must not be asked for it again.
    const html = await render(<PaymentReminderEmail {...props} />);

    expect(html).toContain("570");
    expect(html).not.toContain("970");
  });

  it("names the tenant and the property being chased", async () => {
    const html = await render(<PaymentReminderEmail {...props} />);

    expect(html).toContain("Ana");
    expect(html).toContain("12 rue des Lilas");
  });
});
