import { describe, expect, it } from 'vitest';
import { ordersApi } from '../api/ordersApi';
import { createOrderSchema, orderEventSchema } from '../schemas';

describe('orders api (MSW)', () => {
  it('lists seeded orders', async () => {
    const page = await ordersApi.list({ page: 1, size: 25 });
    expect(page.pageable.total).toBeGreaterThan(0);
    expect(page.data[0].code).toMatch(/^LQ-/);
  });

  it('filters by code via q', async () => {
    const page = await ordersApi.list({ q: 'LQ-2026-00001' });
    expect(page.data).toHaveLength(1);
    expect(page.data[0].code).toBe('LQ-2026-00001');
  });

  it('returns stats', async () => {
    const stats = await ordersApi.stats();
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.delivered + stats.processing + stats.recalled + stats.returned).toBeLessThanOrEqual(
      stats.total,
    );
  });

  it('records a manual drop-off and transitions status to READY_FOR_PICKUP', async () => {
    const before = await ordersApi.getByCode('LQ-2026-00001');
    expect(before.status.code).toBe('AWAIT_PACKAGE');

    const after = await ordersApi.recordEvent('LQ-2026-00001', {
      event: 'LOCKER_AGENT_DROPOFF',
      reason: 'Sensor missed dropoff at 14:32',
      lockerCode: 'WNS-ACH-001',
      lockerDoorNo: '15',
    });
    expect(after.status.code).toBe('READY_FOR_PICKUP');
    const last = after.orderProgresses[after.orderProgresses.length - 1];
    expect(last.description).toContain('[ADMIN OVERRIDE:');
    expect(last.createdBy).toMatch(/^ADMIN:/);
  });

  it('returns 404 for unknown order events', async () => {
    await expect(
      ordersApi.recordEvent('LQ-NOPE', {
        event: 'LOCKER_AGENT_DROPOFF',
        reason: 'this should fail because the code does not exist',
      }),
    ).rejects.toMatchObject({ status: 404 });
  });
});

describe('walk-in order creation (MSW)', () => {
  it('creates a single-locker order and returns AWAIT_PACKAGE', async () => {
    const code = `LQ-TEST-${Date.now()}`;
    const created = await ordersApi.create({
      code,
      type: 'CUS_1LOC',
      desLockerCode: 'WNS-ACH-001',
      recipientPhoneNumber: '+233244999000',
      storageSize: 'MEDIUM',
      storageDurationHours: 24,
    });
    expect(created.code).toBe(code);
    expect(created.status.code).toBe('AWAIT_PACKAGE');
    expect(created.createdBy).toMatch(/^ADMIN:/);
    expect(created.orderProgresses.length).toBeGreaterThanOrEqual(2);

    // Should now appear in the list
    const list = await ordersApi.list({ q: code });
    expect(list.data.find((o) => o.code === code)).toBeDefined();
  });

  it('rejects duplicate codes with 409', async () => {
    const code = `LQ-DUP-${Date.now()}`;
    await ordersApi.create({
      code,
      type: 'CUS_1LOC',
      desLockerCode: 'WNS-ACH-001',
      recipientPhoneNumber: '+233244999111',
    });
    await expect(
      ordersApi.create({
        code,
        type: 'CUS_1LOC',
        desLockerCode: 'WNS-ACH-001',
        recipientPhoneNumber: '+233244999222',
      }),
    ).rejects.toMatchObject({ status: 409 });
  });

  it('requires srcLockerCode for 2LOC orders', async () => {
    await expect(
      ordersApi.create({
        code: `LQ-2LOC-${Date.now()}`,
        type: 'CUS_2LOC',
        desLockerCode: 'WNS-ACH-001',
        recipientPhoneNumber: '+233244999333',
      } as never),
    ).rejects.toMatchObject({ status: 400 });
  });
});

describe('createOrderSchema', () => {
  it('rejects malformed phone numbers', () => {
    const result = createOrderSchema.safeParse({
      code: 'LQ-X-1',
      type: 'CUS_1LOC',
      desLockerCode: 'WNS-ACH-001',
      recipientPhoneNumber: 'not-a-phone',
    });
    expect(result.success).toBe(false);
  });

  it('flags 2LOC orders missing srcLockerCode at the schema level', () => {
    const result = createOrderSchema.safeParse({
      code: 'LQ-X-2',
      type: 'CUS_2LOC',
      desLockerCode: 'WNS-ACH-001',
      recipientPhoneNumber: '+233244000111',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path.includes('srcLockerCode'));
      expect(issue).toBeDefined();
    }
  });

  it('accepts a valid 1LOC payload', () => {
    const result = createOrderSchema.safeParse({
      code: 'LQ-OK-1',
      type: 'CUS_1LOC',
      desLockerCode: 'WNS-ACH-001',
      recipientPhoneNumber: '+233244000111',
      storageSize: 'MEDIUM',
      storageDurationHours: 24,
    });
    expect(result.success).toBe(true);
  });
});

describe('orderEventSchema', () => {
  it('requires reason of at least 8 chars', () => {
    const result = orderEventSchema.safeParse({
      event: 'LOCKER_AGENT_DROPOFF',
      reason: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('accepts a valid payload', () => {
    const result = orderEventSchema.safeParse({
      event: 'LOCKER_AGENT_DROPOFF',
      reason: 'Sensor missed the dropoff event at 14:32',
    });
    expect(result.success).toBe(true);
  });
});
