import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
const { create, processEvent, constructEvent, currentUser } = vi.hoisted(() => ({ create: vi.fn(), processEvent: vi.fn(), constructEvent: vi.fn(), currentUser: vi.fn() }));
vi.mock('stripe', () => ({ default: class { checkout = { sessions: { create } }; webhooks = { constructEvent }; } }));
vi.mock('@/lib/auth', () => ({ getCurrentUser: currentUser }));
vi.mock('@/lib/services/stripe-webhooks', () => ({ processStripeEvent: processEvent }));
import { createCheckoutSession } from '@/lib/stripe';
import { createSubscriptionCheckout } from '@/lib/actions/subscription-actions';
import { trialEndAtCreation, stripeSubscriptionStatus, isAccessBlocked } from '@/lib/domain/subscription';

const parameters = { priceId: 'price_local', userId: 'owner', successUrl: 'http://localhost/billing', cancelUrl: 'http://localhost/billing' };
beforeEach(() => { vi.clearAllMocks(); vi.stubEnv('STRIPE_SECRET_KEY', 'sk_test_fixture'); });

describe('billing boundaries', () => {
  it('assigns exactly fourteen days once from the creation timestamp', () => {
    const created = new Date('2026-10-01T12:00:00Z');
    expect(trialEndAtCreation(created)).toEqual(new Date('2026-10-15T12:00:00Z'));
  });
  it('never introduces a fresh Stripe trial on an expired account', async () => {
    await createCheckoutSession({ ...parameters, trialEndsAt: new Date(0) });
    expect(create.mock.calls[0][0].subscription_data).toEqual({ metadata: { userId: 'owner' } });
  });
  it('uses only the remaining account trial', async () => {
    const end = new Date(Date.now() + 7 * 86400000);
    await createCheckoutSession({ ...parameters, trialEndsAt: end });
    expect(create.mock.calls[0][0].subscription_data.trial_end).toBe(Math.floor(end.getTime() / 1000));
    expect(create.mock.calls[0][0].subscription_data).not.toHaveProperty('trial_period_days');
  });
  it('never charges early when less than 48 hours of trial remain', async () => {
    await expect(createCheckoutSession({ ...parameters, trialEndsAt: new Date(Date.now() + 36 * 3600000) })).rejects.toThrow('aucun paiement anticipé');
    expect(create).not.toHaveBeenCalled();
  });
  it('does not invent a Stripe trial for a legacy account', async () => {
    await createCheckoutSession({ ...parameters, trialEndsAt: null });
    expect(create.mock.calls[0][0].subscription_data).not.toHaveProperty('trial_end');
    expect(isAccessBlocked('TRIAL', null)).toBe(false);
  });
  it('treats unknown Stripe states as expired', () => expect(stripeSubscriptionStatus('new-state')).toBe('EXPIRED'));
  it('expires at the exact timestamp', () => {
    const now = new Date('2026-10-15T12:00:00Z');
    expect(isAccessBlocked('TRIAL', now, now)).toBe(true);
  });
  it('refuses runtime-invalid plan values before calling Stripe', async () => {
    currentUser.mockResolvedValue({ id: 'owner', subscriptionStatus: 'EXPIRED', trialEndsAt: new Date(0) });
    const outcome = await Reflect.apply(createSubscriptionCheckout, undefined, ['not-a-plan', 'month']);
    expect(outcome.success).toBe(false);
    expect(create).not.toHaveBeenCalled();
  });
});

// The route is tested separately from the SDK configuration above: its injected
// constructEvent fails closed before dispatching any domain operation.
describe('webhook failure does not acknowledge processing', () => {
  it('rejects a missing signature', async () => {
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const res = await POST(new NextRequest('http://localhost/api/webhooks/stripe', { method: 'POST', body: '{}' }));
    expect(res.status).toBe(400);
    expect(processEvent).not.toHaveBeenCalled();
    expect(constructEvent).not.toHaveBeenCalled();
  });
  it('rejects an invalid signature before domain processing', async () => {
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_local_fixture');
    constructEvent.mockImplementationOnce(() => { throw new Error('Invalid signature'); });
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const res = await POST(new NextRequest('http://localhost/api/webhooks/stripe', { method: 'POST', headers: { 'stripe-signature': 'invalid' }, body: '{}' }));
    expect(res.status).toBe(400);
    expect(processEvent).not.toHaveBeenCalled();
  });
  it('returns a retryable error when processing fails after verification', async () => {
    vi.stubEnv('STRIPE_WEBHOOK_SECRET', 'whsec_local_fixture');
    constructEvent.mockReturnValueOnce({ id: 'evt_local_fixture', type: 'customer.subscription.updated' });
    processEvent.mockRejectedValueOnce(new Error('Local QA provider failure'));
    const { POST } = await import('@/app/api/webhooks/stripe/route');
    const res = await POST(new NextRequest('http://localhost/api/webhooks/stripe', { method: 'POST', headers: { 'stripe-signature': 'fixture' }, body: '{}' }));
    expect(res.status).toBe(500);
    expect(await res.json()).not.toHaveProperty('received', true);
  });
});
