import { beforeEach, describe, expect, it } from 'vitest';
import { activityApi } from '../api/activityApi';
import { lockersApi } from '@/features/lockers/api/lockersApi';
import { useAuthStore } from '@/features/auth/stores/authStore';

describe('cross-cutting activity feed (MSW)', () => {
  beforeEach(() => {
    useAuthStore.setState({
      user: { id: 1, email: 'a@b.c', name: 'Test', role: 'SUPER_ADMIN' },
      accessToken: 'mock.access.test',
      refreshToken: 'mock.refresh.test',
    });
  });

  it('returns events from every station, newest first', async () => {
    const events = await activityApi.list();
    expect(events.length).toBeGreaterThan(0);
    const stations = new Set(events.map((e) => e.stationSn));
    // Seeded data spans multiple stations (Achimota, Kotoka, Accra Mall)
    expect(stations.size).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < events.length; i++) {
      expect(events[i - 1].createdAt >= events[i].createdAt).toBe(true);
    }
  });

  it('filters by station', async () => {
    const events = await activityApi.list({ station: 'WNS-ACH-001' });
    expect(events.length).toBeGreaterThan(0);
    expect(events.every((e) => e.stationSn === 'WNS-ACH-001')).toBe(true);
  });

  it('filters by kind', async () => {
    const doors = await activityApi.list({ kind: 'DOOR_COMMAND' });
    expect(doors.every((e) => e.kind === 'DOOR_COMMAND')).toBe(true);
    const pkgs = await activityApi.list({ kind: 'PACKAGE' });
    expect(pkgs.every((e) => e.kind === 'PACKAGE')).toBe(true);
    expect(pkgs.some((e) => !!e.packageCode)).toBe(true);
  });

  it('filters by actor prefix', async () => {
    const adminEvents = await activityApi.list({ actor: 'ADMIN' });
    expect(adminEvents.length).toBeGreaterThan(0);
    expect(adminEvents.every((e) => e.actor.startsWith('ADMIN'))).toBe(true);

    const agentEvents = await activityApi.list({ actor: 'AGENT' });
    expect(agentEvents.every((e) => e.actor.startsWith('AGENT'))).toBe(true);
  });

  it('free-text search matches package code', async () => {
    const results = await activityApi.list({ q: 'LQ-2026-00002' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((e) => e.packageCode === 'LQ-2026-00002')).toBe(true);
  });

  it('free-text search matches reason text', async () => {
    const results = await activityApi.list({ q: 'jammed' });
    expect(results.length).toBeGreaterThan(0);
    expect(results.some((e) => e.reason?.toLowerCase().includes('jammed'))).toBe(true);
  });

  it('respects the limit parameter', async () => {
    const limited = await activityApi.list({ limit: 2 });
    expect(limited.length).toBeLessThanOrEqual(2);
  });

  it('newly issued door commands appear in the feed immediately', async () => {
    const before = await activityApi.list({ station: 'WNS-JUN-005' });
    await lockersApi.sendDoorCommand('J-12', {
      action: 'unlock',
      reason: 'Activity feed integration test',
    });
    const after = await activityApi.list({ station: 'WNS-JUN-005' });
    expect(after.length).toBe(before.length + 1);
    const fresh = after[0];
    expect(fresh.lockerId).toBe('J-12');
    expect(fresh.action).toBe('unlock');
    expect(fresh.reason).toBe('Activity feed integration test');
    expect(fresh.actor).toBe('ADMIN:1:admin@locqar.com');
    // Restore
    await lockersApi.sendDoorCommand('J-12', { action: 'lock' });
  });

  it('combining filters narrows correctly (station + kind)', async () => {
    const results = await activityApi.list({
      station: 'WNS-ACH-001',
      kind: 'DOOR_COMMAND',
    });
    expect(results.every((e) => e.stationSn === 'WNS-ACH-001')).toBe(true);
    expect(results.every((e) => e.kind === 'DOOR_COMMAND')).toBe(true);
  });
});
