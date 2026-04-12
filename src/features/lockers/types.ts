/**
 * Locker domain types.
 *
 * A Station is the physical locker kiosk (terminal) — one per site,
 * identified by a serial number (SN) like `WNS-ACH-001`.
 * A Locker is a single compartment (door) within a station, identified
 * by a human-friendly code like `A-01` or by `{stationSn, doorNo}`.
 *
 * These mirror what the NestJS dashboard-api is expected to return; MSW
 * handlers in `src/mocks/handlers/lockers.ts` return data with the same shape.
 */

export type LockerStatus = 'available' | 'occupied' | 'reserved' | 'maintenance' | 'offline';

/**
 * Door size codes come from Winnsen hardware — matches src/shared/constants/lockers.js.
 */
export type DoorSizeCode = 0 | 1 | 2 | 3 | 4 | 5;

export type StationStatus = 'online' | 'offline' | 'maintenance';

export interface Station {
  id: string;
  sn: string;
  name: string;
  location: string;
  region: string;
  city: string;
  totalLockers: number;
  available: number;
  occupied: number;
  maintenance: number;
  status: StationStatus;
  connect: 0 | 1;
  lat: number;
  lng: number;
  /**
   * Customer support number displayed on the kiosk touch screen so a stranded
   * pickup can call for help. Mirrors the Winnsen "Help Phone Number" field.
   */
  helpPhoneNumber: string | null;
  /** Last time the door state was reconciled with the physical terminal. */
  lastSyncedAt: string | null;
}

/**
 * Result of a `Sync from terminal` operation. Returns the diff so the operator
 * can see exactly which doors were corrected and what changed.
 */
export interface SyncFromTerminalResult {
  stationSn: string;
  syncedAt: string;
  doorsChecked: number;
  doorsReconciled: number;
  changes: Array<{
    lockerId: string;
    doorNo: number;
    field: 'occupied' | 'opened' | 'enabled';
    before: 0 | 1;
    after: 0 | 1;
  }>;
}

export interface Locker {
  id: string;
  stationSn: string;
  stationName: string;
  doorNo: number;
  size: DoorSizeCode;
  sizeLabel: string;
  status: LockerStatus;
  enabled: 0 | 1;
  occupied: 0 | 1;
  opened: 0 | 1;
  temp: number | null;
  battery: number;
  /** Waybill of the package currently inside, if any. */
  packageId?: string;
}

export interface LockerFilters {
  stationSn?: string;
  status?: LockerStatus;
  size?: DoorSizeCode;
  search?: string;
}

export interface DoorOperationResult {
  lockerId: string;
  action: 'open' | 'close' | 'lock' | 'unlock';
  status: 'ok' | 'failed' | 'pending';
  message?: string;
  timestamp: string;
}

/**
 * Unified activity row for a single locker. Two sources are merged:
 *   - DOOR_COMMAND: admin/agent issued an open/close/lock/unlock from the
 *     portal or kiosk. The actor is the staff member whose token signed
 *     the request.
 *   - PACKAGE: an order-progress event whose `lockerCode` + `lockerDoorNo`
 *     point at this door — drop-offs and pickups by agents, guests, or
 *     subscribers.
 *
 * The shape is intentionally flat so the timeline component can render it
 * uniformly without branching on `kind` for layout.
 */
export type LockerEventKind = 'DOOR_COMMAND' | 'PACKAGE';

export interface LockerEvent {
  id: string;
  lockerId: string;
  stationSn: string;
  doorNo: number;
  kind: LockerEventKind;
  /** Machine code: 'open'/'close' for DOOR_COMMAND, OrderEventCode for PACKAGE. */
  action: string;
  /** Human-readable label for the timeline. */
  label: string;
  /** Audit-override identity string: ADMIN:<id>:<email>, AGENT:<id>, CUSTOMER:+phone, SYSTEM. */
  actor: string;
  /** Order code when this row represents a package movement. */
  packageCode?: string;
  /** Reason text supplied for admin overrides. */
  reason?: string;
  createdAt: string;
}
