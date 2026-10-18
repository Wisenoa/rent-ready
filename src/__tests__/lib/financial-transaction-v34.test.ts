import { beforeEach, describe, expect, it, vi } from 'vitest';
const { transaction } = vi.hoisted(() => ({ transaction: vi.fn() }));
vi.mock('@/lib/prisma', () => ({ prisma: { $transaction: transaction } }));
import { withFinancialTransaction } from '@/lib/services/financial-transaction';
beforeEach(() => { transaction.mockReset(); });

describe('financial transaction recovery', () => {
  it.each([
    Object.assign(new Error('serialization'), { code: 'P2034' }),
    Object.assign(new Error('commit serialization'), { name: 'DriverAdapterError', cause: { kind: 'TransactionWriteConflict' } }),
  ])('restarts the entire transaction after a serialization conflict', async conflict => {
    transaction.mockRejectedValueOnce(conflict).mockResolvedValueOnce('committed');
    expect(await withFinancialTransaction(async () => 'committed')).toBe('committed');
    expect(transaction).toHaveBeenCalledTimes(2);
    expect(transaction.mock.calls[0][0]).toBe(transaction.mock.calls[1][0]);
  });
  it('does not retry unrelated database or provider failures', async () => {
    const error = new Error('storage unavailable');
    transaction.mockRejectedValue(error);
    await expect(withFinancialTransaction(async () => 'unreachable')).rejects.toThrow('storage unavailable');
    expect(transaction).toHaveBeenCalledTimes(1);
  });
  it('bounds retries instead of keeping a failing request alive forever', async () => {
    const conflict = Object.assign(new Error('serialization'), { code: 'P2034' });
    transaction.mockRejectedValue(conflict);
    await expect(withFinancialTransaction(async () => 'unreachable')).rejects.toThrow('serialization');
    expect(transaction).toHaveBeenCalledTimes(8);
  });
});
