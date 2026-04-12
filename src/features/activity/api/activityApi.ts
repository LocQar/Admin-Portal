import { apiClient } from '@/shared/api/client';
import type { LockerEvent, LockerEventKind } from '@/features/lockers/types';

export interface ActivityFilters {
  station?: string;
  lockerId?: string;
  kind?: LockerEventKind;
  /** Actor prefix: ADMIN, AGENT, CUSTOMER, SYSTEM. */
  actor?: 'ADMIN' | 'AGENT' | 'CUSTOMER' | 'SYSTEM';
  q?: string;
  since?: string;
  limit?: number;
}

function toQuery(filters: ActivityFilters): string {
  const params = new URLSearchParams();
  if (filters.station) params.set('station', filters.station);
  if (filters.lockerId) params.set('lockerId', filters.lockerId);
  if (filters.kind) params.set('kind', filters.kind);
  if (filters.actor) params.set('actor', filters.actor);
  if (filters.q) params.set('q', filters.q);
  if (filters.since) params.set('since', filters.since);
  if (filters.limit !== undefined) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const activityApi = {
  list: (filters: ActivityFilters = {}) =>
    apiClient.get<LockerEvent[]>(`/activity${toQuery(filters)}`),
};
