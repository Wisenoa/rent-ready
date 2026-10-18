import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { prisma } from '@/lib/prisma';
import { recordRentPayment, cancelRentPayment } from '@/lib/services/rent-payments';
import { generateRentPeriodsForLease } from '@/lib/domain/generate-rent-periods';
// Fail before registering cleanup hooks if somebody invokes this suite with a
// non-disposable database. Never fall back to the repository's real .env.
if (process.env.DATABASE_URL) {
  const database = new URL(process.env.DATABASE_URL);
  if (!["localhost", "127.0.0.1", "[::1]"].includes(database.hostname) || !/^\/(lokna_v34|rentready_test_[a-z0-9_]+)$/.test(database.pathname)) {
    throw new Error("V3.4 database tests require a disposable local QA database");
  }
}

const userId = `history-v34-${Date.now()}`;
let propertyId: string;
let tenantId: string;
const start = new Date('2026-10-01');
const end = new Date('2026-10-31');
const dueDate = new Date('2026-10-05');
async function lease(materialize = true) {
  const row = await prisma.lease.create({ data: { userId, propertyId, tenantId, rentAmount: 850, chargesAmount: 70, depositAmount: 850, startDate: start } });
  if (materialize) await generateRentPeriodsForLease(row.id, new Date('2026-10-10'));
  return row.id;
}
const pay = (leaseId: string, amount: number) => recordRentPayment({ userId, leaseId, amount, periodStart: start, periodEnd: end, dueDate, paidAt: new Date('2026-10-10') });
async function balance(leaseId: string) {
  const row = await prisma.transaction.findFirstOrThrow({ where: { leaseId, paidAt: null, status: { not: 'CANCELLED' } } });
  return row.amount.toFixed(2);
}
describe.skipIf(!process.env.DATABASE_URL)('payment history and concurrency on a real database', () => {
  beforeAll(async () => {
    await prisma.user.create({ data: { id: userId, email: `${userId}@example.test`, name: 'QA' } });
    propertyId = (await prisma.property.create({ data: { userId, name: 'QA', addressLine1: '1 rue Test', postalCode: '75001', city: 'Paris', type: 'APARTMENT' } })).id;
    tenantId = (await prisma.tenant.create({ data: { userId, firstName: 'QA', lastName: 'QA', addressLine1: '1 rue Test', postalCode: '75001', city: 'Paris' } })).id;
  });
  afterAll(async () => { await prisma.user.deleteMany({ where: { id: userId } }); });
  it('reopens historical 420 euros after a lease revision, not the new contractual balance', async () => {
    const id = await lease();
    await pay(id, 500);
    const closing = await pay(id, 420);
    expect(closing.ok).toBe(true);
    if (!closing.ok) throw new Error(closing.error);
    await prisma.lease.update({ where: { id }, data: { rentAmount: 900, chargesAmount: 100 } });
    const canceled = await cancelRentPayment({ userId, transactionId: closing.transactionId });
    expect(canceled.ok && canceled.collectable).toBe('420.00');
    expect(await balance(id)).toBe('420.00');
    const open = await prisma.transaction.findFirstOrThrow({ where: { leaseId: id, paidAt: null } });
    expect(open.rentPortion.toFixed(2)).toBe('850.00');
    expect(open.chargesPortion.toFixed(2)).toBe('70.00');
  });
  it('does not overcollect when no materialized period exists', async () => {
    const id = await lease(false);
    const results = await Promise.allSettled([pay(id, 600), pay(id, 600)]);
    expect(results.filter(r => r.status === 'fulfilled' && r.value.ok)).toHaveLength(1);
    const sum = await prisma.transaction.aggregate({ where: { leaseId: id, paidAt: { not: null }, status: { not: 'CANCELLED' } }, _sum: { amount: true } });
    expect(sum._sum.amount?.toFixed(2)).toBe('600.00');
  });
  it('restores both payments without losing money under concurrent cancellation', async () => {
    const id = await lease();
    const first = await pay(id, 500);
    const second = await pay(id, 200);
    if (!first.ok || !second.ok) throw new Error('fixture payment failed');
    const results = await Promise.all([cancelRentPayment({ userId, transactionId: first.transactionId }), cancelRentPayment({ userId, transactionId: second.transactionId })]);
    expect(results.every(r => r.ok)).toBe(true);
    expect(await balance(id)).toBe('920.00');
  });
});
