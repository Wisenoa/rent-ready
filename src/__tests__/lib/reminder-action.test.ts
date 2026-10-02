/**
 * The relance button: which months it may chase, and what it tells the landlord.
 *
 * Two defects motivated this file.
 *
 * 1. THE GUARD REFUSED THE CASE IT EXISTS FOR. `sendPaymentReminder` accepted
 *    only `status === "LATE" || status === "PENDING"`. Nothing in the codebase
 *    ever writes `LATE`, and a partially paid month keeps `PARTIAL` — so a
 *    landlord who saw "40 jours de retard" on a 400/970,55 month and pressed
 *    Relancer was told "Cette transaction n'est pas en retard". The button was a
 *    trap on the exact scenario a relance is for.
 *
 * 2. THE SUCCESS WAS NOT PROOF OF A SEND. The action's own refusal carries a
 *    reason, and losing it ("Impossible d'envoyer la relance") would leave the
 *    landlord hunting in the wrong place, so `describeReminderToast` is tested
 *    directly: a provider failure must never read as a sent email (AGENTS.md §37).
 *
 * The action is called for real here, with the email provider and the AI drafter
 * stubbed. An earlier version of this suite asserted on the source text, so
 * re-introducing the defect left every assertion passing.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import Decimal from "decimal.js";

const { storeRef, sendMock, renderToBufferMock, documentCountMock, draftMock, notificationCreate } =
  vi.hoisted(() => {
    const storeRef = { current: null as unknown };
    // Invokes the element's component the way the real renderer would, so the
    // props the email was built from are observable. A stub that returned a
    // fixed buffer without rendering would prove nothing about the amount.
    const renderToBufferMock = vi.fn(
      async (element: { type?: unknown; props?: Record<string, unknown> }) => {
        const type = element?.type;
        if (typeof type === "function") {
          (type as (props: Record<string, unknown>) => unknown)(element.props ?? {});
        }
        return Buffer.from("<html>relance</html>");
      }
    );
    // Typed so `mock.calls` entries are real tuples rather than `[]` — an
    // untyped `vi.fn()` types its calls as zero-argument, and reading a call
    // site then fails at COMPILE time in the assertion rather than on a real
    // behaviour change.
    const sendMock = vi.fn(
      async (
        _payload: Record<string, unknown>
      ): Promise<{
        data: { id: string } | null;
        error: { message: string; statusCode: number } | null;
        headers: Record<string, string>;
      }> => ({
        data: { id: "email-1" },
        error: null,
        headers: {},
      })
    );
    const documentCountMock = vi.fn(async () => 0);
    const draftMock = vi.fn(async () => ({ subject: "Objet", body: "Corps" }));
    const notificationCreate = vi.fn(
      async (_args: { data: Record<string, unknown> }): Promise<Record<string, never>> => ({})
    );
    return {
      storeRef,
      sendMock,
      renderToBufferMock,
      documentCountMock,
      draftMock,
      notificationCreate,
    };
  }
);

vi.mock("@/lib/prisma", () => ({
  get prisma() {
    return (storeRef.current as { prisma: unknown }).prisma;
  },
}));
vi.mock("@/lib/email", () => ({
  resend: { emails: { send: sendMock } },
  fromEmail: "Rent-Ready <test@example.com>",
}));
vi.mock("@/lib/ai/lease-analyzer", () => ({
  generateRentFollowUpDraft: draftMock,
}));
vi.mock("@/lib/auth", () => ({ getCurrentUserId: vi.fn(async () => "landlord-1") }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
// The PDF render is not what is under test; a buffer is enough to reach the send.
// `StyleSheet` is included because `quittance-generator` builds its styles at
// module scope, and the action imports it transitively.
vi.mock("@react-pdf/renderer", () => ({
  // Invokes the element's component, the way the real renderer would, so the
  // props the email was built from are observable. Returning a fixed buffer
  // without rendering would prove nothing about which figure was passed in.
  renderToBuffer: renderToBufferMock,
  StyleSheet: { create: (sheet: Record<string, unknown>) => sheet },
  pdf: vi.fn(),
  Document: () => null,
  Page: () => null,
  Text: () => null,
  View: () => null,
}));
vi.mock("../../emails/payment-reminder", () => ({
  PaymentReminderEmail: () => null,
}));

import { sendPaymentReminder } from "@/lib/actions/transaction-actions";
import {
  describeReminderToast,
  reportReminder,
  type ReminderToastSink,
} from "@/lib/domain/reminder-outcome";

const PAST = new Date("2026-08-05T00:00:00.000Z");
const FUTURE = new Date(Date.now() + 30 * 86_400_000);

interface TxOptions {
  id?: string;
  amount?: string;
  status?: string;
  paidAt?: Date | null;
  dueDate?: Date;
  userId?: string;
}

function transaction(options: TxOptions = {}) {
  return {
    id: options.id ?? "period-1",
    userId: options.userId ?? "landlord-1",
    amount: new Decimal(options.amount ?? "970.55"),
    status: options.status ?? "PENDING",
    paidAt: options.paidAt ?? null,
    dueDate: options.dueDate ?? PAST,
    lease: {
      id: "lease-1",
      property: {
        addressLine1: "12 rue des Lilas",
        postalCode: "69003",
        city: "Lyon",
        name: "Villa",
      },
      tenant: {
        id: "tenant-1",
        firstName: "Ana",
        lastName: "Silva",
        email: "ana@example.com",
      },
    },
    user: { firstName: "Karim", lastName: "Benali" },
  };
}

function useTransaction(tx: unknown): void {
  storeRef.current = {
    prisma: {
      transaction: { findUnique: vi.fn(async () => tx) },
      document: { count: documentCountMock },
      notification: { create: notificationCreate },
    },
  };
}

/** A provider that accepted the message — Resend's real success shape. */
function accepted() {
  sendMock.mockResolvedValue({ data: { id: "email-1" }, error: null, headers: {} });
}

/** A provider that refused — the shape the action must not report as sent. */
function rejected() {
  sendMock.mockResolvedValue({
    data: null,
    error: { message: "The from address is not verified.", statusCode: 422 },
    headers: {},
  });
}

/** The payload handed to the email provider by the last send. */
function sentPayload(): Record<string, unknown> {
  const [call] = sendMock.mock.calls.at(-1) ?? [];
  return call ?? {};
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
  documentCountMock.mockResolvedValue(0);
  draftMock.mockResolvedValue({ subject: "Objet", body: "Corps" });
  notificationCreate.mockResolvedValue({});
});

describe("sendPaymentReminder — the guard", () => {
  it("relances a month that is unpaid and past its due date", async () => {
    useTransaction(transaction({ status: "PENDING" }));
    accepted();

    const result = await sendPaymentReminder("period-1", "friendly");

    expect(result.success).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("relances a PARTIALLY paid month that has fallen overdue", async () => {
    // THE defect. The button sits on a row the dashboard has just labelled
    // « 40 jours de retard », and the old guard answered "Cette transaction
    // n'est pas en retard". A partial payment is the case a relance exists for.
    useTransaction(transaction({ status: "PARTIAL", amount: "570.55" }));
    accepted();

    const result = await sendPaymentReminder("period-1", "friendly");

    expect(result.success).toBe(true);
    expect(sendMock).toHaveBeenCalledTimes(1);
  });

  it("chases the balance still owed, not the month's full rent", async () => {
    // Asking a tenant who already paid 400 EUR for the month's original 970,55
    // would be a demand for money that has already been handed over.
    useTransaction(transaction({ status: "PARTIAL", amount: "570.55" }));
    accepted();

    await sendPaymentReminder("period-1", "friendly");

    // The figure the tenant is asked for is the balance still owed (570.55),
    // not the month's original rent the period was generated with.
    const [renderCall] = renderToBufferMock.mock.calls[0];
    expect(renderCall.props?.amountDue).toBe(570.55);
  });

  it("refuses a month that is not yet due", async () => {
    useTransaction(transaction({ dueDate: FUTURE }));
    accepted();

    const result = await sendPaymentReminder("period-1", "friendly");

    expect(result.success).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("refuses a month that has already been settled", async () => {
    useTransaction(
      transaction({ paidAt: new Date("2026-08-06T00:00:00.000Z"), status: "PAID" })
    );
    accepted();

    const result = await sendPaymentReminder("period-1", "friendly");

    expect(result.success).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("does not touch another landlord's period", async () => {
    // Multi-tenancy: the ownership check precedes everything else.
    useTransaction(transaction({ userId: "landlord-2" }));
    accepted();

    const result = await sendPaymentReminder("period-1", "friendly");

    expect(result.success).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it("does not derive lateness from a stored status", async () => {
    // Nothing writes `LATE`, and `PENDING` is also what a month due in three
    // weeks carries. Only the dates decide, so the same stored status is chased
    // or refused according to when it falls due.
    useTransaction(transaction({ status: "PENDING", dueDate: PAST }));
    accepted();
    expect((await sendPaymentReminder("period-1", "friendly")).success).toBe(true);

    useTransaction(transaction({ status: "PENDING", dueDate: FUTURE }));
    expect((await sendPaymentReminder("period-2", "friendly")).success).toBe(false);
  });
});

describe("sendPaymentReminder — what it reports back", () => {
  it("reports the provider's failure instead of a success", async () => {
    // Product honesty (AGENTS.md §37): Resend refused, so no email left.
    useTransaction(transaction());
    rejected();

    const result = await sendPaymentReminder("period-1", "friendly");

    expect(result.success).toBe(false);
    expect(sendMock).toHaveBeenCalledTimes(1);
    // And nothing is logged as sent when nothing was sent.
    expect(notificationCreate).not.toHaveBeenCalled();
  });

  it("records the reminder against the owner who asked for it", async () => {
    useTransaction(transaction());
    accepted();

    await sendPaymentReminder("period-1", "formal");

    const [call] = notificationCreate.mock.calls.at(-1) ?? [];
    expect(call?.data.userId).toBe("landlord-1");
  });
});

describe("describeReminderToast", () => {
  it("never claims a send the provider refused", () => {
    const outcome = describeReminderToast({
      success: false,
      error: "Échec de l'envoi de l'email de relance.",
    });
    expect(outcome.tone).toBe("error");
    expect(outcome.message).toBe("Échec de l'envoi de l'email de relance.");
  });

  it("keeps the action's own reason, so the landlord knows which case it is", () => {
    // "not yet due" and "already settled" are different problems; a generic
    // failure sends the landlord looking in the wrong place.
    expect(describeReminderToast({ success: false, error: "Déjà réglée" }).message).toBe(
      "Déjà réglée"
    );
    expect(
      describeReminderToast({ success: false, error: "Pas encore échue" }).message
    ).toBe("Pas encore échue");
  });

  it("confirms a real send", () => {
    const outcome = describeReminderToast({ success: true, data: { daysLate: 40 } });
    expect(outcome.tone).toBe("success");
    expect(outcome.message).toContain("40 jours de retard");
  });

  it("stays singular for one day of lateness", () => {
    expect(describeReminderToast({ success: true, data: { daysLate: 1 } }).message).toContain(
      "1 jour de retard"
    );
  });

  it("does not invent a lateness the action did not report", () => {
    expect(describeReminderToast({ success: true }).message).toBe(
      "Email de relance envoyée au locataire."
    );
  });
});

describe("reportReminder — the toast the button shows", () => {
  function sink() {
    const calls: Array<[string, string]> = [];
    const sink: ReminderToastSink = {
      error: (message) => calls.push(["error", message]),
      success: (message) => calls.push(["success", message]),
    };
    return { calls, sink };
  }

  it("routes a refusal to the error toast", () => {
    const { calls, sink: toasts } = sink();
    reportReminder({ success: false, error: "Pas encore échue" }, toasts);
    expect(calls).toEqual([["error", "Pas encore échue"]]);
  });

  it("routes a delivery to the success toast", () => {
    const { calls, sink: toasts } = sink();
    reportReminder({ success: true, data: { daysLate: 12 } }, toasts);
    expect(calls[0][0]).toBe("success");
    expect(calls[0][1]).toContain("12 jours");
  });
});