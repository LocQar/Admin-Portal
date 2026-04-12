import { useQuery } from '@tanstack/react-query';
import { customersApi } from '../api/customersApi';
import type { CustomerListFilters } from '../types';

export const customerKeys = {
  all: ['customers'] as const,
  lists: () => [...customerKeys.all, 'list'] as const,
  list: (filters: CustomerListFilters) => [...customerKeys.lists(), filters] as const,
  detail: (phone: string) => [...customerKeys.all, 'detail', phone] as const,
};

export function useCustomers(filters: CustomerListFilters = {}) {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => customersApi.list(filters),
  });
}

export function useCustomer(phone: string | undefined) {
  return useQuery({
    queryKey: phone ? customerKeys.detail(phone) : ['customers', 'none'],
    queryFn: () => customersApi.getByPhone(phone as string),
    enabled: !!phone,
  });
}
