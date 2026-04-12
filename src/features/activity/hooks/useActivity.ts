import { useQuery } from '@tanstack/react-query';
import { activityApi, type ActivityFilters } from '../api/activityApi';

export const activityKeys = {
  all: ['activity'] as const,
  list: (filters: ActivityFilters) => [...activityKeys.all, 'list', filters] as const,
};

/**
 * Cross-cutting locker activity feed. Polls every 30s so the ops dashboard
 * stays current without a websocket. The query is keyed by the full filter
 * object so changing any filter cuts a fresh fetch.
 */
export function useActivity(filters: ActivityFilters = {}) {
  return useQuery({
    queryKey: activityKeys.list(filters),
    queryFn: () => activityApi.list(filters),
    refetchInterval: 30_000,
  });
}
