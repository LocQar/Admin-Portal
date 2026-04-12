/**
 * Courier domain — mirrors the Winnsen legacy "Courier Company / Courier Staff"
 * model so we can attach a real identity to LOCKER_AGENT_DROPOFF events.
 *
 * A CourierCompany is a logistics partner (DHL, Jumia Express, etc.).
 * A CourierStaff is an individual delivery agent attached to one company.
 * AuthorizedLockers is the per-company allow-list of locker codes the
 * company's agents are allowed to drop off into. The legacy system stores
 * this as a flat link table on each terminal; we expose it from the company
 * side because that's how the admin portal will edit it.
 */

export interface CourierCompany {
  id: number;
  code: string;
  name: string;
  logoUrl: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  active: boolean;
  staffCount: number;
  authorizedLockerCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourierStaff {
  id: number;
  companyId: number;
  companyCode: string;
  companyName: string;
  nickname: string;
  loginPhone: string;
  cardNumber: string | null;
  active: boolean;
  totalDropoffs: number;
  lastDropoffAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CourierCompaniesPage {
  data: CourierCompany[];
  pageable: { page: number; size: number; total: number };
}

export interface CourierStaffPage {
  data: CourierStaff[];
  pageable: { page: number; size: number; total: number };
}

export interface CourierCompanyDetail extends CourierCompany {
  staff: CourierStaff[];
  authorizedLockerCodes: string[];
}

export interface CourierCompanyListFilters {
  page?: number;
  size?: number;
  q?: string;
}

export interface CourierStaffListFilters {
  page?: number;
  size?: number;
  q?: string;
  companyId?: number;
}

export interface CreateCourierCompanyInput {
  code: string;
  name: string;
  contactPhone?: string;
  contactEmail?: string;
}

export interface CreateCourierStaffInput {
  companyId: number;
  nickname: string;
  loginPhone: string;
  cardNumber?: string;
}
