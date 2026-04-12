import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../api/ordersApi';
import type { CreateOrderInput, OrderEventInput } from '../schemas';
import type { OrderListFilters } from '../types';

export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: OrderListFilters) => [...orderKeys.lists(), filters] as const,
  detail: (code: string) => [...orderKeys.all, 'detail', code] as const,
  stats: (params: { startTime?: number; endTime?: number }) =>
    [...orderKeys.all, 'stats', params] as const,
};

export function useOrders(filters: OrderListFilters = {}) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => ordersApi.list(filters),
  });
}

export function useOrder(code: string | undefined) {
  return useQuery({
    queryKey: code ? orderKeys.detail(code) : ['orders', 'none'],
    queryFn: () => ordersApi.getByCode(code as string),
    enabled: !!code,
  });
}

export function useOrderStats(params: { startTime?: number; endTime?: number } = {}) {
  return useQuery({
    queryKey: orderKeys.stats(params),
    queryFn: () => ordersApi.stats(params),
  });
}

/**
 * Records a manual drop-off / pickup / cancel event.
 * Invalidates the detail + lists on success so the timeline + status pill update.
 */
export function useRecordOrderEvent(code: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: OrderEventInput) => ordersApi.recordEvent(code, input),
    onSuccess: (updated) => {
      qc.setQueryData(orderKeys.detail(code), updated);
      qc.invalidateQueries({ queryKey: orderKeys.lists() });
      qc.invalidateQueries({ queryKey: [...orderKeys.all, 'stats'] });
    },
  });
}

/**
 * Creates a walk-in order. Invalidates the lists + stats so the new order
 * shows up immediately. The newly created order is also seeded into the
 * detail cache so the navigate-to-detail step is instant.
 */
export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateOrderInput) => ordersApi.create(input),
    onSuccess: (created) => {
      qc.setQueryData(orderKeys.detail(created.code), created);
      qc.invalidateQueries({ queryKey: orderKeys.lists() });
      qc.invalidateQueries({ queryKey: [...orderKeys.all, 'stats'] });
    },
  });
}
