import { apiClient } from '@/shared/api/client';
import type {
  CustomerDetail,
  CustomerListFilters,
  CustomersPage,
} from '../types';

function toQuery(filters: CustomerListFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.page !== undefined) params.set('page', String(filters.page));
  if (filters.size !== undefined) params.set('size', String(filters.size));
  if (filters.q) params.set('q', filters.q);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const customersApi = {
  list: (filters: CustomerListFilters = {}) =>
    apiClient.get<CustomersPage>(`/api/admin/customers${toQuery(filters)}`),

  /**
   * Phone numbers contain `+` which must be encoded for the URL.
   * The detail endpoint returns the customer summary plus recent orders.
   */
  getByPhone: (phone: string) =>
    apiClient.get<CustomerDetail>(
      `/api/admin/customers/${encodeURIComponent(phone)}`,
    ),
};
