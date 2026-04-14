import { http, HttpResponse } from 'msw';
import { cloudConfig } from '@/shared/config/cloud';
import type {
  DoorOperationResult,
  Locker,
  LockerEvent,
  Station,
  SyncFromTerminalResult,
} from '@/features/lockers/types';
import { EVENT_LABELS, type OrderEventCode } from '@/features/orders/types';
import { orders } from './orders';

const apiUrl = cloudConfig.apiUrl;

// In-memory state the handlers mutate so updates (status change, door open)
// are visible on subsequent reads during the session.
const stations: Station[] = [];

const lockers: Locker[] = [];

/**
 * The "physical" door state as reported by the kiosk hardware. In reality this
 * lives on the locker terminal and only the kiosk knows the truth — the admin
 * portal mirrors it but can drift after a flaky internet drop. We seed two
 * deliberate divergences so the Sync button has something to fix:
 *   - A-15: admin says occupied=1 opened=0, terminal says occupied=0 opened=0
 *           (recipient picked up while the kiosk was offline)
 *   - K-22: admin says occupied=1 opened=0, terminal says occupied=1 opened=1
 *           (door physically open but admin doesn't know)
 */
interface PhysicalDoorState {
  occupied: 0 | 1;
  opened: 0 | 1;
  enabled: 0 | 1;
}

const physicalDoorState = new Map<string, PhysicalDoorState>();
function seedPhysicalState() {
  for (const l of lockers) {
    physicalDoorState.set(l.id, {
      occupied: l.occupied,
      opened: l.opened,
      enabled: l.enabled,
    });
  }
}
seedPhysicalState();

/**
 * Per-door audit log of every command issued from the portal/kiosk. The real
 * backend will derive the actor from the bearer token; in MSW the only mock
 * staff user is `admin@locqar.com`, so we hard-code that identity here.
 *
 * Seeded with a few historical entries so the timeline isn't empty on first
 * load — gives the operator something to read while validating the UI.
 */
const doorAuditLog: LockerEvent[] = [];
let nextDoorEventId = 1;

function pushDoorAudit(
  locker: Locker,
  action: 'open' | 'close' | 'lock' | 'unlock',
  actor: string,
  reason?: string,
): LockerEvent {
  const evt: LockerEvent = {
    id: `door-${nextDoorEventId++}`,
    lockerId: locker.id,
    stationSn: locker.stationSn,
    doorNo: locker.doorNo,
    kind: 'DOOR_COMMAND',
    action,
    label: `Door ${action}`,
    actor,
    reason,
    createdAt: new Date().toISOString(),
  };
  doorAuditLog.push(evt);
  return evt;
}

function seedDoorAudit() {
  // No seed data — start with an empty audit log.
}
seedDoorAudit();

/**
 * Walk every order's progress rows and emit a LockerEvent for each one whose
 * locker pointer matches this door. Used by the per-locker activity timeline.
 */
function packageEventsForLocker(locker: Locker): LockerEvent[] {
  const events: LockerEvent[] = [];
  const doorNoStr = String(locker.doorNo);
  for (const order of orders) {
    for (const progress of order.orderProgresses) {
      if (
        progress.lockerCode !== locker.stationSn ||
        progress.lockerDoorNo !== doorNoStr
      ) {
        continue;
      }
      const statusCode = progress.status.code;
      // Map order status changes back to a friendly event code/label.
      // Real backend stores the actual event code on the progress row;
      // here we infer from status + description.
      const inferred = inferEventCode(statusCode, progress.createdBy);
      events.push({
        id: `pkg-${order.code}-${progress.id}`,
        lockerId: locker.id,
        stationSn: locker.stationSn,
        doorNo: locker.doorNo,
        kind: 'PACKAGE',
        action: inferred.code,
        label: inferred.label,
        actor: progress.createdBy ?? 'SYSTEM',
        packageCode: order.code,
        reason: progress.description ?? undefined,
        createdAt: progress.createdAt,
      });
    }
  }
  return events;
}

function inferEventCode(
  status: string,
  createdBy: string | null,
): { code: string; label: string } {
  const actorKind = createdBy?.split(':')[0];
  if (status === 'READY_FOR_PICKUP') {
    if (actorKind === 'AGENT') return { code: 'LOCKER_AGENT_DROPOFF' as OrderEventCode, label: EVENT_LABELS.LOCKER_AGENT_DROPOFF };
    if (actorKind === 'CUSTOMER') return { code: 'LOCKER_GUEST_DROPOFF' as OrderEventCode, label: EVENT_LABELS.LOCKER_GUEST_DROPOFF };
    return { code: 'LOCKER_AGENT_DROPOFF' as OrderEventCode, label: EVENT_LABELS.LOCKER_AGENT_DROPOFF };
  }
  if (status === 'COMPLETED_PICKUP') {
    if (actorKind === 'AGENT') return { code: 'LOCKER_AGENT_COLLECT' as OrderEventCode, label: EVENT_LABELS.LOCKER_AGENT_COLLECT };
    if (actorKind === 'CUSTOMER') return { code: 'LOCKER_GUEST_COLLECT' as OrderEventCode, label: EVENT_LABELS.LOCKER_GUEST_COLLECT };
    return { code: 'LOCKER_GUEST_COLLECT' as OrderEventCode, label: EVENT_LABELS.LOCKER_GUEST_COLLECT };
  }
  if (status === 'AWAIT_PACKAGE') {
    return { code: 'LOCKER_SELECTED' as OrderEventCode, label: 'Door reserved' };
  }
  return { code: status, label: status.replaceAll('_', ' ').toLowerCase() };
}

function matchesFilters(l: Locker, url: URL): boolean {
  const station = url.searchParams.get('stationSn');
  if (station && l.stationSn !== station) return false;
  const status = url.searchParams.get('status');
  if (status && l.status !== status) return false;
  const size = url.searchParams.get('size');
  if (size !== null && l.size !== Number(size)) return false;
  const q = url.searchParams.get('q')?.toLowerCase();
  if (q) {
    const hay = `${l.id} ${l.stationName} ${l.packageId ?? ''}`.toLowerCase();
    if (!hay.includes(q)) return false;
  }
  return true;
}

export const lockersHandlers = [
  http.get(`${apiUrl}/stations`, () => HttpResponse.json(stations)),

  // Station registration (REST fallback for kiosk or manual portal registration)
  http.post(`${apiUrl}/stations/register`, async ({ request }) => {
    const body = (await request.json()) as {
      sn: string;
      name?: string;
      location?: string;
      doorCount?: number;
      lat?: number;
      lng?: number;
    };
    const existing = stations.find((s) => s.sn === body.sn);
    if (existing) {
      // Update existing
      if (body.name) existing.name = body.name;
      if (body.location) existing.location = body.location;
      return HttpResponse.json(existing);
    }
    // Create new station
    const newStation: Station = {
      id: `TRM-${String(stations.length + 1).padStart(3, '0')}`,
      sn: body.sn,
      name: body.name || body.sn,
      location: body.location || 'Unknown',
      region: 'Greater Accra',
      city: '',
      totalLockers: body.doorCount || 0,
      available: body.doorCount || 0,
      occupied: 0,
      maintenance: 0,
      status: 'online',
      connect: 1,
      lat: body.lat || 0,
      lng: body.lng || 0,
      helpPhoneNumber: null,
      lastSyncedAt: new Date().toISOString(),
    };
    stations.push(newStation);
    return HttpResponse.json(newStation, { status: 201 });
  }),

  http.get(`${apiUrl}/stations/:sn`, ({ params }) => {
    const station = stations.find((s) => s.sn === params.sn);
    if (!station) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Station not found' }, { status: 404 });
    return HttpResponse.json(station);
  }),

  http.patch(`${apiUrl}/stations/:sn`, async ({ params, request }) => {
    const idx = stations.findIndex((s) => s.sn === params.sn);
    if (idx === -1) {
      return HttpResponse.json({ code: 'NOT_FOUND', message: 'Station not found' }, { status: 404 });
    }
    const body = (await request.json()) as {
      name?: string;
      location?: string;
      helpPhoneNumber?: string | null;
    };
    if (body.name !== undefined) stations[idx].name = body.name;
    if (body.location !== undefined) stations[idx].location = body.location;
    if (body.helpPhoneNumber !== undefined) {
      stations[idx].helpPhoneNumber = body.helpPhoneNumber;
    }
    return HttpResponse.json(stations[idx]);
  }),

  /**
   * Sync from terminal — walks every locker on this station and reconciles the
   * admin-side view with the physical door state. Returns the diff so the
   * operator can see exactly what was corrected. This is the equivalent of
   * Winnsen's "Sync from terminal" button on the door info screen.
   */
  http.post(`${apiUrl}/stations/:sn/sync`, ({ params }) => {
    const stationIdx = stations.findIndex((s) => s.sn === params.sn);
    if (stationIdx === -1) {
      return HttpResponse.json({ code: 'NOT_FOUND', message: 'Station not found' }, { status: 404 });
    }
    const station = stations[stationIdx];
    if (station.connect === 0) {
      return HttpResponse.json(
        { code: 'STATION_OFFLINE', message: `Station ${station.sn} is offline.` },
        { status: 503 },
      );
    }

    const stationLockers = lockers.filter((l) => l.stationSn === station.sn);
    const changes: SyncFromTerminalResult['changes'] = [];

    for (const locker of stationLockers) {
      const truth = physicalDoorState.get(locker.id);
      if (!truth) continue;
      (['occupied', 'opened', 'enabled'] as const).forEach((field) => {
        if (locker[field] !== truth[field]) {
          changes.push({
            lockerId: locker.id,
            doorNo: locker.doorNo,
            field,
            before: locker[field],
            after: truth[field],
          });
          (locker[field] as 0 | 1) = truth[field];
        }
      });
      // Status follows occupancy: if the door is now empty and was reading
      // occupied/reserved, drop it back to "available".
      if (locker.occupied === 0 && (locker.status === 'occupied' || locker.status === 'reserved')) {
        locker.status = 'available';
      }
    }

    const now = new Date().toISOString();
    station.lastSyncedAt = now;

    const result: SyncFromTerminalResult = {
      stationSn: station.sn,
      syncedAt: now,
      doorsChecked: stationLockers.length,
      doorsReconciled: new Set(changes.map((c) => c.lockerId)).size,
      changes,
    };
    return HttpResponse.json(result);
  }),

  http.get(`${apiUrl}/lockers`, ({ request }) => {
    const url = new URL(request.url);
    return HttpResponse.json(lockers.filter((l) => matchesFilters(l, url)));
  }),

  http.get(`${apiUrl}/lockers/:id`, ({ params }) => {
    const locker = lockers.find((l) => l.id === params.id);
    if (!locker) return HttpResponse.json({ code: 'NOT_FOUND', message: 'Locker not found' }, { status: 404 });
    return HttpResponse.json(locker);
  }),

  http.patch(`${apiUrl}/lockers/:id`, async ({ params, request }) => {
    const idx = lockers.findIndex((l) => l.id === params.id);
    if (idx === -1) return HttpResponse.json({ code: 'NOT_FOUND' }, { status: 404 });
    const body = (await request.json()) as { status?: Locker['status']; enabled?: 0 | 1 };
    if (body.status) lockers[idx].status = body.status;
    if (body.enabled !== undefined) lockers[idx].enabled = body.enabled;
    return HttpResponse.json(lockers[idx]);
  }),

  http.post(`${apiUrl}/lockers/:id/door`, async ({ params, request }) => {
    const idx = lockers.findIndex((l) => l.id === params.id);
    if (idx === -1) return HttpResponse.json({ code: 'NOT_FOUND' }, { status: 404 });
    const body = (await request.json()) as {
      action: 'open' | 'close' | 'lock' | 'unlock';
      reason?: string;
    };

    // Reject door ops when the station is offline
    const station = stations.find((s) => s.sn === lockers[idx].stationSn);
    if (station?.connect === 0) {
      return HttpResponse.json(
        { code: 'STATION_OFFLINE', message: `Station ${station.sn} is offline.` },
        { status: 503 },
      );
    }

    if (body.action === 'open') lockers[idx].opened = 1;
    if (body.action === 'close' || body.action === 'lock') lockers[idx].opened = 0;
    // Keep the physical truth in lockstep so a follow-up sync won't undo this.
    const truth = physicalDoorState.get(lockers[idx].id);
    if (truth) truth.opened = lockers[idx].opened;

    // Audit row — real backend derives identity from the bearer token. The
    // MSW mock has a single staff user, so the actor string is fixed.
    pushDoorAudit(lockers[idx], body.action, 'ADMIN:1:admin@locqar.com', body.reason);

    const result: DoorOperationResult = {
      lockerId: params.id as string,
      action: body.action,
      status: 'ok',
      message: `Door ${body.action} command delivered`,
      timestamp: new Date().toISOString(),
    };
    return HttpResponse.json(result);
  }),

  /**
   * Activity timeline for one door — merges the door audit log with package
   * events derived from order progress rows. Newest first.
   */
  http.get(`${apiUrl}/lockers/:id/events`, ({ params }) => {
    const locker = lockers.find((l) => l.id === params.id);
    if (!locker) {
      return HttpResponse.json({ code: 'NOT_FOUND', message: 'Locker not found' }, { status: 404 });
    }
    const doorEvents = doorAuditLog.filter((e) => e.lockerId === locker.id);
    const pkgEvents = packageEventsForLocker(locker);
    const merged = [...doorEvents, ...pkgEvents].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
    return HttpResponse.json(merged);
  }),

  /**
   * Cross-cutting activity feed across all stations + lockers. Same row shape
   * as the per-locker timeline so the UI component is reusable. Filters:
   *   - station: SN of a single station (e.g. WNS-ACH-001)
   *   - lockerId: a single door
   *   - kind: DOOR_COMMAND | PACKAGE
   *   - actor: ADMIN | AGENT | CUSTOMER | SYSTEM (matches the prefix of the
   *     actor string)
   *   - q: free text — matches against label, package code, locker id, reason
   *   - since: ISO timestamp; only events at or after this time
   *   - limit: cap result count (default 200)
   */
  http.get(`${apiUrl}/activity`, ({ request }) => {
    const url = new URL(request.url);
    const station = url.searchParams.get('station');
    const lockerId = url.searchParams.get('lockerId');
    const kind = url.searchParams.get('kind');
    const actor = url.searchParams.get('actor');
    const q = url.searchParams.get('q')?.toLowerCase();
    const since = url.searchParams.get('since');
    const limit = Number(url.searchParams.get('limit') ?? 200);

    const targetLockers = lockers.filter((l) => {
      if (station && l.stationSn !== station) return false;
      if (lockerId && l.id !== lockerId) return false;
      return true;
    });
    const targetIds = new Set(targetLockers.map((l) => l.id));

    const doorEvents = doorAuditLog.filter((e) => targetIds.has(e.lockerId));
    const pkgEvents = targetLockers.flatMap((l) => packageEventsForLocker(l));

    let merged = [...doorEvents, ...pkgEvents];

    if (kind) merged = merged.filter((e) => e.kind === kind);
    if (actor) merged = merged.filter((e) => e.actor.startsWith(actor));
    if (since) merged = merged.filter((e) => e.createdAt >= since);
    if (q) {
      merged = merged.filter((e) => {
        const hay = `${e.label} ${e.lockerId} ${e.packageCode ?? ''} ${e.reason ?? ''} ${e.actor}`.toLowerCase();
        return hay.includes(q);
      });
    }

    merged.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (merged.length > limit) merged = merged.slice(0, limit);

    return HttpResponse.json(merged);
  }),
];
