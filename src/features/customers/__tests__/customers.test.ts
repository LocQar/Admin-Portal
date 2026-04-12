import { describe, expect, it } from 'vitest';
import { customersApi } from '../api/customersApi';
import { ordersApi } from '@/features/orders/api/ordersApi';

describe('customers api (MSW)', () => {
  it('aggregates customers from seeded orders', async () => {
    const page = await customersApi.list({ page: 1, size: 25 });
    expect(page.pageable.total).toBeGreaterThan(0);
    // Each seeded order has a unique recipient phone, so total customers
    // should be at least the number of unique recipients (>= 3).
    expect(page.data.length).toBeGreaterThanOrEqual(3);
    // Phones come back in E.164.
    for (const c of page.data) {
      expect(c.phone).toMatch(/^\+?\d+$/);
      expect(c.totalOrders).toBeGreaterThanOrEqual(1);
    }
  });

  it('returns the customer that matches a phone substring', async () => {
    const page = await customersApi.list({ q: '000111' });
    expect(page.data.length).toBeGreaterThanOrEqual(1);
    expect(page.data.every((c) => c.phone.includes('000111'))).toBe(true);
  });

  it('exposes lifetime counts on the detail endpoint', async () => {
    // Use the seeded customer that owns LQ-2026-00001 (recipient +233244000111).
    const detail = await customersApi.getByPhone('+233244000111');
    expect(detail.phone).toBe('+233244000111');
    expect(detail.totalOrders).toBe(detail.activeOrders + detail.completedOrders);
    expect(detail.orders.length).toBe(detail.totalOrders);
    // Newest first
    for (let i = 1; i < detail.orders.length; i++) {
      expect(+new Date(detail.orders[i - 1].createdAt)).toBeGreaterThanOrEqual(
        +new Date(detail.orders[i].createdAt),
      );
    }
  });

  it('returns 404 for an unknown phone', async () => {
    await expect(customersApi.getByPhone('+999000111222')).rejects.toMatchObject({
      status: 404,
    });
  });

  it('reflects newly created orders in the customer aggregation', async () => {
    const phone = `+2330000${Date.now().toString().slice(-6)}`;
    // Create a fresh order against this phone.
    const code = `LQ-CUST-${Date.now()}`;
    await ordersApi.create({
      code,
      type: 'CUS_1LOC',
      desLockerCode: 'WNS-ACH-001',
      recipientPhoneNumber: phone,
    });
    const detail = await customersApi.getByPhone(phone);
    expect(detail.totalOrders).toBe(1);
    expect(detail.activeOrders).toBe(1);
    expect(detail.orders[0].code).toBe(code);
  });
});
