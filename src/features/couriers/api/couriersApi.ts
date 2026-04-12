import { apiClient } from '@/shared/api/client';
import type {
  CourierCompaniesPage,
  CourierCompanyDetail,
  CourierCompanyListFilters,
  CourierStaff,
  CourierStaffListFilters,
  CourierStaffPage,
  CreateCourierCompanyInput,
  CreateCourierStaffInput,
} from '../types';

function toQuery(filters: object): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v === undefined || v === null || v === '') continue;
    params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const couriersApi = {
  // Companies
  listCompanies: (filters: CourierCompanyListFilters = {}) =>
    apiClient.get<CourierCompaniesPage>(
      `/api/admin/courier-companies${toQuery(filters)}`,
    ),

  getCompany: (id: number) =>
    apiClient.get<CourierCompanyDetail>(`/api/admin/courier-companies/${id}`),

  createCompany: (body: CreateCourierCompanyInput) =>
    apiClient.post<CourierCompanyDetail>(`/api/admin/courier-companies`, body),

  setCompanyAuthorizedLockers: (id: number, lockerCodes: string[]) =>
    apiClient.put<CourierCompanyDetail>(
      `/api/admin/courier-companies/${id}/authorized-lockers`,
      { lockerCodes },
    ),

  // Staff
  listStaff: (filters: CourierStaffListFilters = {}) =>
    apiClient.get<CourierStaffPage>(`/api/admin/courier-staff${toQuery(filters)}`),

  createStaff: (body: CreateCourierStaffInput) =>
    apiClient.post<CourierStaff>(`/api/admin/courier-staff`, body),
};
