import { apiClient } from '@/shared/api/client';
import type {
  DoorCommandInput,
  UpdateLockerInput,
  UpdateStationInput,
} from '../schemas';
import type {
  DoorOperationResult,
  Locker,
  LockerEvent,
  LockerFilters,
  Station,
  SyncFromTerminalResult,
} from '../types';

function toQuery(filters: LockerFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.stationSn) params.set('stationSn', filters.stationSn);
  if (filters.status) params.set('status', filters.status);
  if (filters.size !== undefined) params.set('size', String(filters.size));
  if (filters.search) params.set('q', filters.search);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const lockersApi = {
  listStations: () => apiClient.get<Station[]>('/stations'),
  getStation: (sn: string) => apiClient.get<Station>(`/stations/${encodeURIComponent(sn)}`),

  updateStation: (sn: string, input: UpdateStationInput) =>
    apiClient.patch<Station>(`/stations/${encodeURIComponent(sn)}`, input),

  /** Reconcile admin-side door state with the physical terminal. */
  syncStationFromTerminal: (sn: string) =>
    apiClient.post<SyncFromTerminalResult>(
      `/stations/${encodeURIComponent(sn)}/sync`,
    ),

  listLockers: (filters: LockerFilters = {}) =>
    apiClient.get<Locker[]>(`/lockers${toQuery(filters)}`),
  getLocker: (id: string) => apiClient.get<Locker>(`/lockers/${encodeURIComponent(id)}`),

  updateLocker: (id: string, input: UpdateLockerInput) =>
    apiClient.patch<Locker>(`/lockers/${encodeURIComponent(id)}`, input),

  sendDoorCommand: (id: string, input: DoorCommandInput) =>
    apiClient.post<DoorOperationResult>(
      `/lockers/${encodeURIComponent(id)}/door`,
      input,
    ),

  /** Per-door activity timeline: door audit + package events, newest first. */
  listLockerEvents: (id: string) =>
    apiClient.get<LockerEvent[]>(`/lockers/${encodeURIComponent(id)}/events`),
};
