import { beforeEach, describe, expect, it } from 'vitest';
import { lockersApi } from '../api/lockersApi';
import { useAuthStore } from '@/features/auth/stores/authStore';

describe('lockers feature (MSW)', () => {
  beforeEach(() => {
    // Give requests a token so the apiClient attaches Authorization header
    useAuthStore.setState({
      user: { id: 1, email: 'a@b.c', name: 'Test', role: 'SUPER_ADMIN' },
      accessToken: 'mock.access.test',
      refreshToken: 'mock.refresh.test',
    });
  });

  it('lists stations', async () => {
    const stations = await lockersApi.listStations();
    expect(stations.length).toBeGreaterThanOrEqual(5);
    expect(stations.find((s) => s.sn === 'WNS-ACH-001')?.name).toBe('Achimota Mall');
  });

  it('gets a single station by SN', async () => {
    const station = await lockersApi.getStation('WNS-KOT-003');
    expect(station.name).toBe('Kotoka T3');
  });

  it('404 on unknown station', async () => {
    await expect(lockersApi.getStation('WNS-FAKE-999')).rejects.toMatchObject({ status: 404 });
  });

  it('lists lockers and filters by station', async () => {
    const all = await lockersApi.listLockers();
    expect(all.length).toBeGreaterThanOrEqual(10);
    const achimota = await lockersApi.listLockers({ stationSn: 'WNS-ACH-001' });
    expect(achimota.every((l) => l.stationSn === 'WNS-ACH-001')).toBe(true);
  });

  it('filters lockers by status', async () => {
    const occupied = await lockersApi.listLockers({ status: 'occupied' });
    expect(occupied.every((l) => l.status === 'occupied')).toBe(true);
    expect(occupied.length).toBeGreaterThan(0);
  });

  it('searches lockers by id', async () => {
    const result = await lockersApi.listLockers({ search: 'A-15' });
    expect(result.map((l) => l.id)).toContain('A-15');
  });

  it('gets a locker detail', async () => {
    const locker = await lockersApi.getLocker('A-15');
    expect(locker.status).toBe('occupied');
    expect(locker.packageId).toBe('LQ-2024-00001');
  });

  it('updates locker status', async () => {
    const updated = await lockersApi.updateLocker('A-01', { status: 'maintenance' });
    expect(updated.status).toBe('maintenance');
    // Round-trip: subsequent fetch reflects the update
    const fresh = await lockersApi.getLocker('A-01');
    expect(fresh.status).toBe('maintenance');
    // Restore for test isolation
    await lockersApi.updateLocker('A-01', { status: 'available' });
  });

  it('sends door-open command', async () => {
    const result = await lockersApi.sendDoorCommand('A-01', { action: 'open' });
    expect(result.status).toBe('ok');
    expect(result.action).toBe('open');
    const locker = await lockersApi.getLocker('A-01');
    expect(locker.opened).toBe(1);
    // Restore
    await lockersApi.sendDoorCommand('A-01', { action: 'close' });
  });

  it('refuses door-open when station is offline', async () => {
    // W-02 is on WNS-WHM-004 which has connect: 0
    await expect(
      lockersApi.sendDoorCommand('W-02', { action: 'open' }),
    ).rejects.toMatchObject({ status: 503, code: 'STATION_OFFLINE' });
  });

  it('returns 404 for unknown locker', async () => {
    await expect(lockersApi.getLocker('ZZZ-999')).rejects.toMatchObject({ status: 404 });
  });

  it('updates station help phone number', async () => {
    const updated = await lockersApi.updateStation('WNS-ACH-001', {
      helpPhoneNumber: '+233244999888',
    });
    expect(updated.helpPhoneNumber).toBe('+233244999888');
    const fresh = await lockersApi.getStation('WNS-ACH-001');
    expect(fresh.helpPhoneNumber).toBe('+233244999888');
    // Restore
    await lockersApi.updateStation('WNS-ACH-001', { helpPhoneNumber: '+233302000111' });
  });

  it('clears station help phone number with null', async () => {
    const updated = await lockersApi.updateStation('WNS-ACC-002', {
      helpPhoneNumber: null,
    });
    expect(updated.helpPhoneNumber).toBeNull();
    // Restore
    await lockersApi.updateStation('WNS-ACC-002', { helpPhoneNumber: '+233302000222' });
  });

  it('syncs station from terminal — reconciles divergent doors', async () => {
    // Pre-seed: A-15 admin says occupied=1 but physical truth says 0,
    // K-22 admin says opened=0 but physical truth says 1.
    const result = await lockersApi.syncStationFromTerminal('WNS-ACH-001');
    expect(result.stationSn).toBe('WNS-ACH-001');
    expect(result.doorsChecked).toBeGreaterThan(0);
    expect(result.doorsReconciled).toBeGreaterThanOrEqual(1);
    const a15Change = result.changes.find((c) => c.lockerId === 'A-15' && c.field === 'occupied');
    expect(a15Change).toMatchObject({ before: 1, after: 0 });

    // After sync, the admin view should reflect the corrected state
    const a15 = await lockersApi.getLocker('A-15');
    expect(a15.occupied).toBe(0);
    expect(a15.status).toBe('available');

    // lastSyncedAt is updated
    const station = await lockersApi.getStation('WNS-ACH-001');
    expect(station.lastSyncedAt).toBeTruthy();
  });

  it('sync is idempotent — second call reports zero reconciliations', async () => {
    await lockersApi.syncStationFromTerminal('WNS-ACC-002');
    const second = await lockersApi.syncStationFromTerminal('WNS-ACC-002');
    expect(second.doorsReconciled).toBe(0);
    expect(second.changes).toHaveLength(0);
  });

  it('refuses sync when station is offline', async () => {
    await expect(
      lockersApi.syncStationFromTerminal('WNS-WHM-004'),
    ).rejects.toMatchObject({ status: 503, code: 'STATION_OFFLINE' });
  });

  it('returns 404 when syncing unknown station', async () => {
    await expect(
      lockersApi.syncStationFromTerminal('WNS-FAKE-999'),
    ).rejects.toMatchObject({ status: 404 });
  });

  describe('activity timeline', () => {
    it('returns seeded door audit + package events for A-15, newest first', async () => {
      const events = await lockersApi.listLockerEvents('A-15');
      expect(events.length).toBeGreaterThanOrEqual(3);
      // Newest-first ordering
      for (let i = 1; i < events.length; i++) {
        expect(events[i - 1].createdAt >= events[i].createdAt).toBe(true);
      }
      // Has both kinds: seeded admin door command + package event from order LQ-2026-00001
      expect(events.some((e) => e.kind === 'DOOR_COMMAND')).toBe(true);
      expect(events.some((e) => e.kind === 'PACKAGE' && e.packageCode === 'LQ-2026-00001')).toBe(true);
    });

    it('door command writes an audit row tagged with the admin actor', async () => {
      const before = await lockersApi.listLockerEvents('A-01');
      await lockersApi.sendDoorCommand('A-01', { action: 'open' });
      const after = await lockersApi.listLockerEvents('A-01');
      expect(after.length).toBe(before.length + 1);
      const newest = after[0];
      expect(newest.kind).toBe('DOOR_COMMAND');
      expect(newest.action).toBe('open');
      expect(newest.actor).toBe('ADMIN:1:admin@locqar.com');
      expect(newest.lockerId).toBe('A-01');
      // Restore so other tests don't see the locker in the wrong physical state
      await lockersApi.sendDoorCommand('A-01', { action: 'close' });
    });

    it('package events expose the correct actor identity from order progresses', async () => {
      // LQ-2026-00002 is at door B-08 (Accra Mall, door 8) and was dropped by AGENT:1
      const events = await lockersApi.listLockerEvents('B-08');
      const pkg = events.find((e) => e.packageCode === 'LQ-2026-00002');
      expect(pkg).toBeDefined();
      expect(pkg!.kind).toBe('PACKAGE');
      expect(pkg!.actor).toBe('AGENT:1');
      expect(pkg!.action).toBe('LOCKER_AGENT_DROPOFF');
    });

    it('returns empty array for a locker with no activity', async () => {
      // J-12 is a fresh available locker on Junction Mall with no orders or seeded audit
      const events = await lockersApi.listLockerEvents('J-12');
      expect(events).toEqual([]);
    });

    it('returns 404 for unknown locker', async () => {
      await expect(lockersApi.listLockerEvents('ZZZ-999')).rejects.toMatchObject({ status: 404 });
    });

    it('door command persists the reason into the audit row', async () => {
      const reason = 'Recipient called: door jammed at 14:32, manual inspection';
      await lockersApi.sendDoorCommand('A-03', { action: 'open', reason });
      const events = await lockersApi.listLockerEvents('A-03');
      const newest = events[0];
      expect(newest.kind).toBe('DOOR_COMMAND');
      expect(newest.action).toBe('open');
      expect(newest.reason).toBe(reason);
      // Restore
      await lockersApi.sendDoorCommand('A-03', { action: 'close' });
    });
  });
});
