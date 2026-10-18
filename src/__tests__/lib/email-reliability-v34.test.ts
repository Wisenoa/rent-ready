import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';
const { prismaMock, sendEmail, requestReset } = vi.hoisted(() => ({
  prismaMock: {
    user: { findUnique: vi.fn() },
    transaction: { findUnique: vi.fn(), findFirst: vi.fn() },
    lease: { findUnique: vi.fn(), findFirst: vi.fn() },
    tenant: { findFirst: vi.fn(), findUnique: vi.fn() },
  }, sendEmail: vi.fn(), requestReset: vi.fn(),
}));
vi.mock('@/lib/prisma', () => ({ prisma: prismaMock }));
vi.mock('@/lib/email/sender', () => ({ sendEmail }));
vi.mock('@/lib/auth-server', () => ({ auth: { api: { getSession: async () => ({ user: { id: 'alice' } }), requestPasswordReset: requestReset } } }));
vi.mock('@/lib/rate-limit', () => ({ rateLimit: async () => ({ success: true }), getClientIp: () => '127.0.0.1' }));
import { emailService } from '@/lib/email/service';
import { POST as reminder } from '@/app/api/email/send-rent-reminder/route';
import { POST as expiry } from '@/app/api/email/send-lease-expiry/route';
import { POST as invitation } from '@/app/api/email/send-tenant-invitation/route';
import { POST as reset } from '@/app/api/email/send-password-reset/route';

beforeEach(() => { vi.resetAllMocks(); });
const request = (body: object) => new NextRequest('http://localhost/api/email/test', { method: 'POST', body: JSON.stringify(body) });

describe('external email outcomes', () => {
  it('does not turn a provider refusal into a sent password reset', async () => {
    sendEmail.mockResolvedValue({ ok: false, error: 'provider down', retryable: true });
    await expect(emailService.sendPasswordResetEmail('alice@example.test', 'http://localhost/reset-password?token=test')).rejects.toThrow('fournisseur');
  });
  it('returns only after the provider accepts the password reset email', async () => {
    sendEmail.mockResolvedValue({ ok: true, id: 'message-id' });
    await expect(emailService.sendPasswordResetEmail('alice@example.test', 'http://localhost/reset-password?token=test')).resolves.toBeUndefined();
    expect(sendEmail).toHaveBeenCalledOnce();
  });
  it('never sends another landlord’s rent reminder', async () => {
    prismaMock.transaction.findFirst.mockResolvedValue(null);
    expect((await reminder(request({ transactionId: 'bob-payment' }))).status).toBe(404);
    expect(sendEmail).not.toHaveBeenCalled();
    expect(prismaMock.transaction.findFirst).toHaveBeenCalledWith({ where: { id: 'bob-payment', userId: 'alice' }, select: { id: true } });
  });
  it('never sends another landlord’s lease notice', async () => {
    prismaMock.lease.findFirst.mockResolvedValue(null);
    expect((await expiry(request({ leaseId: 'bob-lease' }))).status).toBe(404);
    expect(sendEmail).not.toHaveBeenCalled();
  });
  it('does not relay an arbitrary invitation URL to a tenant', async () => {
    prismaMock.user.findUnique.mockResolvedValue({ firstName: 'Alice', lastName: 'Test' });
    prismaMock.tenant.findFirst.mockResolvedValue({ leases: [] });
    expect((await invitation(request({ tenantId: 'alice-tenant', portalUrl: 'https://evil.example/portal/token' }))).status).toBe(400);
    expect(sendEmail).not.toHaveBeenCalled();
  });
  it('does not report a missing recipient as a welcome email sent', async () => {
    prismaMock.user.findUnique.mockResolvedValue(null);
    await expect(emailService.sendWelcomeEmail('missing')).rejects.toThrow('Destinataire');
  });
  it('does not fabricate reset links when email is unconfigured', async () => {
    vi.stubEnv('RESEND_API_KEY', '');
    expect((await reset(request({ email: 'alice@example.test' }))).status).toBe(503);
    expect(requestReset).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });
  it('delegates token issuance to Better Auth and preserves provider failures', async () => {
    vi.stubEnv('RESEND_API_KEY', 'local-fixture');
    requestReset.mockRejectedValueOnce(new Error('provider unavailable'));
    expect((await reset(request({ email: 'alice@example.test' }))).status).toBe(503);
    expect(requestReset).toHaveBeenCalledOnce();
    vi.unstubAllEnvs();
  });
});
