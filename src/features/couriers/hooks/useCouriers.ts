import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { couriersApi } from '../api/couriersApi';
import type {
  CourierCompanyListFilters,
  CourierStaffListFilters,
  CreateCourierCompanyInput,
  CreateCourierStaffInput,
} from '../types';

export const courierKeys = {
  all: ['couriers'] as const,
  companies: () => [...courierKeys.all, 'companies'] as const,
  companyList: (filters: CourierCompanyListFilters) =>
    [...courierKeys.companies(), 'list', filters] as const,
  companyDetail: (id: number) =>
    [...courierKeys.companies(), 'detail', id] as const,
  staff: () => [...courierKeys.all, 'staff'] as const,
  staffList: (filters: CourierStaffListFilters) =>
    [...courierKeys.staff(), 'list', filters] as const,
};

export function useCourierCompanies(filters: CourierCompanyListFilters = {}) {
  return useQuery({
    queryKey: courierKeys.companyList(filters),
    queryFn: () => couriersApi.listCompanies(filters),
  });
}

export function useCourierCompany(id: number | undefined) {
  return useQuery({
    queryKey: id ? courierKeys.companyDetail(id) : ['couriers', 'company', 'none'],
    queryFn: () => couriersApi.getCompany(id as number),
    enabled: !!id,
  });
}

export function useCourierStaff(filters: CourierStaffListFilters = {}) {
  return useQuery({
    queryKey: courierKeys.staffList(filters),
    queryFn: () => couriersApi.listStaff(filters),
  });
}

export function useCreateCourierCompany() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCourierCompanyInput) => couriersApi.createCompany(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: courierKeys.companies() });
    },
  });
}

export function useCreateCourierStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCourierStaffInput) => couriersApi.createStaff(body),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: courierKeys.staff() });
      qc.invalidateQueries({
        queryKey: courierKeys.companyDetail(variables.companyId),
      });
      qc.invalidateQueries({ queryKey: courierKeys.companies() });
    },
  });
}

export function useSetCompanyAuthorizedLockers() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lockerCodes }: { id: number; lockerCodes: string[] }) =>
      couriersApi.setCompanyAuthorizedLockers(id, lockerCodes),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: courierKeys.companyDetail(variables.id) });
      qc.invalidateQueries({ queryKey: courierKeys.companies() });
    },
  });
}
