import { describe, expect, it } from 'vitest';
import { couriersApi } from '../api/couriersApi';

describe('couriers api (MSW)', () => {
  it('lists seeded courier companies', async () => {
    const page = await couriersApi.listCompanies({ page: 1, size: 25 });
    expect(page.pageable.total).toBeGreaterThanOrEqual(3);
    const codes = page.data.map((c) => c.code);
    expect(codes).toContain('JUMIA');
    expect(codes).toContain('DHL');
    // Companies are sorted by name.
    const names = page.data.map((c) => c.name);
    expect([...names].sort((a, b) => a.localeCompare(b))).toEqual(names);
  });

  it('filters companies by code substring', async () => {
    const page = await couriersApi.listCompanies({ q: 'jum' });
    expect(page.data.length).toBeGreaterThanOrEqual(1);
    expect(page.data.every((c) => c.code === 'JUMIA' || c.name.toLowerCase().includes('jum'))).toBe(true);
  });

  it('returns the company detail with staff and authorized lockers', async () => {
    const detail = await couriersApi.getCompany(1);
    expect(detail.code).toBe('JUMIA');
    expect(detail.staff.length).toBeGreaterThanOrEqual(2);
    // Each seeded staff should belong to this company.
    expect(detail.staff.every((s) => s.companyId === 1)).toBe(true);
    // Authorized lockers reflect the row.
    expect(detail.authorizedLockerCodes.length).toBe(detail.authorizedLockerCount);
  });

  it('returns 404 for an unknown company id', async () => {
    await expect(couriersApi.getCompany(99999)).rejects.toMatchObject({ status: 404 });
  });

  it('rejects duplicate company codes', async () => {
    await expect(
      couriersApi.createCompany({ code: 'JUMIA', name: 'Jumia Express II' }),
    ).rejects.toMatchObject({ status: 409 });
  });

  it('creates a new courier company and reflects it in the list', async () => {
    const code = `TEST${Date.now()}`.slice(0, 18).toUpperCase();
    const created = await couriersApi.createCompany({
      code,
      name: 'Test Courier',
      contactPhone: '+233244999999',
    });
    expect(created.code).toBe(code);
    expect(created.staff).toEqual([]);
    expect(created.authorizedLockerCodes).toEqual([]);

    const page = await couriersApi.listCompanies({ q: code.toLowerCase() });
    expect(page.data.some((c) => c.code === code)).toBe(true);
  });

  it('persists locker authorizations via the PUT endpoint', async () => {
    const updated = await couriersApi.setCompanyAuthorizedLockers(2, [
      'WNS-ACH-001',
      'WNS-WHM-004',
    ]);
    expect(new Set(updated.authorizedLockerCodes)).toEqual(
      new Set(['WNS-ACH-001', 'WNS-WHM-004']),
    );
    expect(updated.authorizedLockerCount).toBe(2);

    // Round-trip: detail GET should return the same set.
    const detail = await couriersApi.getCompany(2);
    expect(new Set(detail.authorizedLockerCodes)).toEqual(
      new Set(['WNS-ACH-001', 'WNS-WHM-004']),
    );
  });

  it('lists staff filtered by companyId', async () => {
    const page = await couriersApi.listStaff({ companyId: 1 });
    expect(page.data.length).toBeGreaterThanOrEqual(2);
    expect(page.data.every((s) => s.companyId === 1)).toBe(true);
  });

  it('rejects duplicate login phones when creating staff', async () => {
    // First create succeeds
    const phone = `+2330000${Date.now().toString().slice(-6)}`;
    await couriersApi.createStaff({
      companyId: 1,
      nickname: 'Dup Test',
      loginPhone: phone,
    });
    // Second create with same phone fails
    await expect(
      couriersApi.createStaff({
        companyId: 1,
        nickname: 'Dup Test 2',
        loginPhone: phone,
      }),
    ).rejects.toMatchObject({ status: 409 });
  });

  it('refreshes the company staff count after adding a courier', async () => {
    const before = await couriersApi.getCompany(2);
    const beforeCount = before.staff.length;
    const phone = `+233222${Date.now().toString().slice(-6)}`;

    await couriersApi.createStaff({
      companyId: 2,
      nickname: 'New DHL Driver',
      loginPhone: phone,
    });

    const after = await couriersApi.getCompany(2);
    expect(after.staff.length).toBe(beforeCount + 1);
    expect(after.staffCount).toBe(beforeCount + 1);
    expect(after.staff.some((s) => s.loginPhone === phone)).toBe(true);
  });
});
