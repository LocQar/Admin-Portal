import { apiClient } from '@/shared/api/client';
import type { CreateOrderInput, OrderEventInput } from '../schemas';
import type { Order, OrderListFilters, OrdersPage, OrderStats } from '../types';

function toQuery(filters: OrderListFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.page !== undefined) params.set('page', String(filters.page));
  if (filters.size !== undefined) params.set('size', String(filters.size));
  if (filters.q) params.set('q', filters.q);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const ordersApi = {
  list: (filters: OrderListFilters = {}) =>
    apiClient.get<OrdersPage>(`/api/admin/orders${toQuery(filters)}`),

  /**
   * The list endpoint is currently the only way to fetch a single order — the
   * backend doesn't expose `GET /api/admin/orders/:code` yet. We narrow the
   * page down by code via `?q=` and pick the exact match.
   */
  getByCode: async (code: string): Promise<Order> => {
    const page = await apiClient.get<OrdersPage>(
      `/api/admin/orders?q=${encodeURIComponent(code)}&size=10`,
    );
    const exact = page.data.find((o) => o.code === code);
    if (!exact) {
      throw new Error(`Order ${code} not found`);
    }
    return exact;
  },

  stats: (params: { startTime?: number; endTime?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.startTime) qs.set('startTime', String(params.startTime));
    if (params.endTime) qs.set('endTime', String(params.endTime));
    const suffix = qs.toString() ? `?${qs}` : '';
    return apiClient.get<OrderStats>(`/api/admin/orders/stats${suffix}`);
  },

  /**
   * Manual event recording (audit override).
   * Maps 1:1 with `POST /api/admin/orders/:code/events` on the backend.
   */
  recordEvent: (code: string, body: OrderEventInput) =>
    apiClient.post<Order>(
      `/api/admin/orders/${encodeURIComponent(code)}/events`,
      body,
    ),

  /**
   * Walk-in order creation. Mirrors `POST /api/admin/orders` on the backend
   * (admin-only endpoint that delegates to `OrdersService.createOrder`).
   */
  create: (body: CreateOrderInput) =>
    apiClient.post<Order>('/api/admin/orders', body),
};
