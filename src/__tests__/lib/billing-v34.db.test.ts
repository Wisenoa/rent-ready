import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import Stripe from "stripe";
import { NextRequest } from "next/server";

const { stripe } = vi.hoisted(() => ({ stripe: { current: null as Stripe | null } }));
vi.mock("@/lib/stripe", () => ({ getStripe: () => stripe.current }));
const { session } = vi.hoisted(() => ({ session: { userId: "" } }));
vi.mock("@/lib/auth-server", () => ({ auth: { api: { getSession: async () => ({ user: { id: session.userId } }) } } }));

import { prisma } from "@/lib/prisma";
import { processStripeEvent } from "@/lib/services/stripe-webhooks";
import { assertSubscriptionAccess } from "@/lib/subscription-access";
import { POST as createProperty } from "@/app/api/properties/route";
import { PATCH as updateLease } from "@/app/api/leases/[id]/route";
import * as generation from "@/lib/domain/generate-rent-periods";

// Fail before registering cleanup hooks if somebody invokes this suite with a
// non-disposable database. Never fall back to the repository's real .env.
if (process.env.DATABASE_URL) {
  const database = new URL(process.env.DATABASE_URL);
  if (!["localhost", "127.0.0.1", "[::1]"].includes(database.hostname) || !/^\/(lokna_v34|rentready_test_[a-z0-9_]+)$/.test(database.pathname)) {
    throw new Error("V3.4 database tests require a disposable local QA database");
  }
}

const run = `billing-v34-${Date.now()}`;
const owner = `${run}-owner`;
const other = `${run}-other`;
const eventIds: string[] = [];
let periodId: string;
let leaseId: string;
let retrieve: ReturnType<typeof vi.spyOn>;

function event(type: string, object: object, id = `${run}-${eventIds.length}`): Stripe.Event {
  eventIds.push(id);
  const body = JSON.stringify({ id, type, object: "event", data: { object }, created: 1, livemode: false, pending_webhooks: 1 });
  const secret = "whsec_local_fixture";
  const header = stripe.current!.webhooks.generateTestHeaderString({ payload: body, secret });
  return stripe.current!.webhooks.constructEvent(body, header, secret);
}
function subscription(status: string, id = "sub_v34") {
  return { id, object: "subscription", status, customer: "cus_v34", metadata: { userId: owner } };
}
function checkout(amount = 92000, paymentStatus = "paid") {
  return { id: `${run}-checkout`, object: "checkout.session", mode: "payment", payment_status: paymentStatus,
    currency: "eur", amount_total: amount, payment_intent: `${run}-intent`,
    metadata: { type: "rent_payment", transactionId: periodId, tenantId: `${run}-tenant` } };
}

describe.skipIf(!process.env.DATABASE_URL)("billing reliability with real PostgreSQL and mocked Stripe", () => {
  beforeAll(async () => {
    stripe.current = new Stripe("sk_test_local_fixture");
    retrieve = vi.spyOn(stripe.current.subscriptions, "retrieve");
    session.userId = owner;
    await prisma.user.createMany({ data: [owner, other].map(id => ({ id, email: `${id}@example.test`, name: "Test", subscriptionStatus: "ACTIVE" as const })) });
    const property = await prisma.property.create({ data: { userId: owner, name: "Test", type: "APARTMENT", addressLine1: "1 rue Test", postalCode: "75001", city: "Paris" } });
    await prisma.tenant.create({ data: { id: `${run}-tenant`, userId: owner, firstName: "Test", lastName: "Locataire", addressLine1: "1 rue Test", postalCode: "75001", city: "Paris" } });
    const lease = await prisma.lease.create({ data: { userId: owner, propertyId: property.id, tenantId: `${run}-tenant`, rentAmount: 850, chargesAmount: 70, depositAmount: 850, startDate: new Date("2026-10-01") } });
    leaseId = lease.id;
    const period = await prisma.transaction.create({ data: { userId: owner, leaseId, amount: 920, rentPortion: 850, chargesPortion: 70, periodStart: new Date("2026-10-01"), periodEnd: new Date("2026-10-31"), dueDate: new Date("2026-10-05") } });
    periodId = period.id;
  });
  afterAll(async () => {
    await prisma.stripeWebhookEvent.deleteMany({ where: { stripeEventId: { in: eventIds } } });
    await prisma.user.deleteMany({ where: { id: { in: [owner, other] } } });
    vi.restoreAllMocks();
  });

  it("refuses expired users at the API even when they bypass the page", async () => {
    await prisma.user.update({ where: { id: owner }, data: { subscriptionStatus: "EXPIRED" } });
    const res = await createProperty(new NextRequest("http://localhost/api/properties", { method: "POST", body: JSON.stringify({ name: "forbidden" }) }));
    expect(res.status).toBe(403);
    await expect(assertSubscriptionAccess(owner)).rejects.toThrow("abonnement");
    await prisma.user.update({ where: { id: owner }, data: { subscriptionStatus: "ACTIVE" } });
  });
  it("updates unpaid expectations when the rent is edited through the API", async () => {
    const lease = await prisma.lease.findUniqueOrThrow({ where: { id: leaseId } });
    const edit = (rentAmount: number, chargesAmount: number) => updateLease(new NextRequest(`http://localhost/api/leases/${leaseId}`, {
      method: "PATCH", body: JSON.stringify({ propertyId: lease.propertyId, tenantId: lease.tenantId, startDate: "2026-10-01", rentAmount, chargesAmount, depositAmount: 850 }),
    }), { params: Promise.resolve({ id: leaseId }) });
    expect((await edit(900, 80)).status).toBe(200);
    expect((await prisma.transaction.findUniqueOrThrow({ where: { id: periodId } })).amount.toFixed(2)).toBe("980.00");
    expect((await edit(850, 70)).status).toBe(200);
    expect((await prisma.transaction.findUniqueOrThrow({ where: { id: periodId } })).amount.toFixed(2)).toBe("920.00");
    const failure = vi.spyOn(generation, "rerateUnpaidRentPeriods").mockRejectedValueOnce(new Error("Local QA generation failure"));
    expect((await edit(1000, 90)).status).toBe(500);
    expect((await prisma.lease.findUniqueOrThrow({ where: { id: leaseId } })).rentAmount.toFixed(2)).toBe("850.00");
    expect((await prisma.transaction.findUniqueOrThrow({ where: { id: periodId } })).amount.toFixed(2)).toBe("920.00");
    failure.mockRestore();
  });
  it("does not claim asynchronous checkout completion as money received", async () => {
    await processStripeEvent(event("checkout.session.completed", checkout(92000, "unpaid")));
    expect((await prisma.transaction.findUniqueOrThrow({ where: { id: periodId } })).paidAt).toBeNull();
  });
  it("records a paid tenant checkout without userId/customer through the canonical payment door", async () => {
    const paid = event("checkout.session.async_payment_succeeded", checkout());
    const results = await Promise.all([processStripeEvent(paid), processStripeEvent(paid)]);
    expect(results.sort()).toEqual(["already_processed", "processed"]);
    const row = await prisma.transaction.findUniqueOrThrow({ where: { id: periodId } });
    expect(row.amount.toFixed(2)).toBe("920.00");
    expect(row.status).toBe("PAID");
    expect(row.isFullPayment).toBe(true);
    expect(row.receiptType).toBe("QUITTANCE");
    expect(row.receiptRentAmount?.toFixed(2)).toBe("850.00");
    expect(await prisma.transaction.count({ where: { leaseId, paidAt: { not: null } } })).toBe(1);
    await processStripeEvent(event("checkout.session.completed", checkout()));
    expect(await prisma.transaction.count({ where: { leaseId, paidAt: { not: null } } })).toBe(1);
  });
  it("rolls back the event marker when settlement fails, allowing retry", async () => {
    const failed = event("checkout.session.completed", { ...checkout(), payment_intent: "pi_other", metadata: { type: "rent_payment", tenantId: "foreign", transactionId: periodId } });
    await expect(processStripeEvent(failed)).rejects.toThrow("collectable");
    expect(await prisma.stripeWebhookEvent.findUnique({ where: { stripeEventId: failed.id } })).toBeNull();
  });
  it("uses provider state instead of an old active event and preserves the account trial", async () => {
    const trial = new Date("2026-10-10");
    await prisma.user.update({ where: { id: owner }, data: { trialEndsAt: trial } });
    retrieve.mockResolvedValue(subscription("past_due"));
    await processStripeEvent(event("customer.subscription.updated", subscription("active")));
    const user = await prisma.user.findUniqueOrThrow({ where: { id: owner } });
    expect(user.subscriptionStatus).toBe("PAST_DUE");
    expect(user.trialEndsAt).toEqual(trial);
  });
  it("retries provider outages without committing a marker or changing access", async () => {
    retrieve.mockRejectedValueOnce(new Error("Stripe unavailable"));
    const failed = event("customer.subscription.updated", subscription("active"));
    await expect(processStripeEvent(failed)).rejects.toThrow("Stripe unavailable");
    expect(await prisma.stripeWebhookEvent.findUnique({ where: { stripeEventId: failed.id } })).toBeNull();
    expect((await prisma.user.findUniqueOrThrow({ where: { id: owner } })).subscriptionStatus).toBe("PAST_DUE");
  });
  it("does not let an old cancellation cancel a replacement subscription", async () => {
    await prisma.user.update({ where: { id: owner }, data: { stripeSubscriptionId: "sub_replacement", subscriptionStatus: "ACTIVE" } });
    retrieve.mockResolvedValue(subscription("canceled"));
    await processStripeEvent(event("customer.subscription.deleted", subscription("canceled")));
    expect((await prisma.user.findUniqueOrThrow({ where: { id: owner } })).subscriptionStatus).toBe("ACTIVE");
  });
});
