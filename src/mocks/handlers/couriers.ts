import { http, HttpResponse } from 'msw';
import { cloudConfig } from '@/shared/config/cloud';
import type {
  CourierCompaniesPage,
  CourierCompany,
  CourierCompanyDetail,
  CourierStaff,
  CourierStaffPage,
  CreateCourierCompanyInput,
  CreateCourierStaffInput,
} from '@/features/couriers/types';

const apiUrl = cloudConfig.apiUrl;

let nextCompanyId = 100;
let nextStaffId = 100;

interface CourierCompanyRow extends CourierCompany {
  authorizedLockerCodes: string[];
}

export const courierCompanies: CourierCompanyRow[] = [
  {
    id: 1,
    code: 'JUMIA',
    name: 'Jumia Express',
    logoUrl: null,
    contactPhone: '+233244500001',
    contactEmail: 'ops@jumia.com.gh',
    active: true,
    staffCount: 0,
    authorizedLockerCount: 0,
    authorizedLockerCodes: ['WNS-ACH-001', 'WNS-ACC-002', 'WNS-KOT-003'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  },
  {
    id: 2,
    code: 'DHL',
    name: 'DHL Ghana',
    logoUrl: null,
    contactPhone: '+233302213090',
    contactEmail: 'gh.ops@dhl.com',
    active: true,
    staffCount: 0,
    authorizedLockerCount: 0,
    authorizedLockerCodes: ['WNS-KOT-003'],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
  },
  {
    id: 3,
    code: 'GLOVO',
    name: 'Glovo Ghana',
    logoUrl: null,
    contactPhone: '+233244500003',
    contactEmail: 'partners.gh@glovo.com',
    active: false,
    staffCount: 0,
    authorizedLockerCount: 0,
    authorizedLockerCodes: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
  },
];

export const courierStaff: CourierStaff[] = [
  {
    id: 1,
    companyId: 1,
    companyCode: 'JUMIA',
    companyName: 'Jumia Express',
    nickname: 'Joe Mensah',
    loginPhone: '+233244111001',
    cardNumber: 'CARD-J001',
    active: true,
    totalDropoffs: 47,
    lastDropoffAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 2,
    companyId: 1,
    companyCode: 'JUMIA',
    companyName: 'Jumia Express',
    nickname: 'Ama Boateng',
    loginPhone: '+233244111002',
    cardNumber: 'CARD-J002',
    active: true,
    totalDropoffs: 33,
    lastDropoffAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 21).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
  },
  {
    id: 3,
    companyId: 2,
    companyCode: 'DHL',
    companyName: 'DHL Ghana',
    nickname: 'Kwame Asante',
    loginPhone: '+233244222001',
    cardNumber: null,
    active: true,
    totalDropoffs: 12,
    lastDropoffAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
];

function refreshCounts(): void {
  for (const company of courierCompanies) {
    company.staffCount = courierStaff.filter((s) => s.companyId === company.id).length;
    company.authorizedLockerCount = company.authorizedLockerCodes.length;
  }
}
refreshCounts();

function toCompanyView(row: CourierCompanyRow): CourierCompany {
  // Strip the authorizedLockerCodes for list views — they live on the detail.
  const { authorizedLockerCodes: _omit, ...rest } = row;
  return rest;
}

export const couriersHandlers = [
  // ── Companies ────────────────────────────────────────────────────────────
  http.get(`${apiUrl}/api/admin/courier-companies`, ({ request }) => {
    refreshCounts();
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);
    const q = url.searchParams.get('q')?.toLowerCase().trim();

    let filtered: CourierCompanyRow[] = [...courierCompanies];
    if (q) {
      filtered = filtered.filter(
        (c) =>
          c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q),
      );
    }
    filtered.sort((a, b) => a.name.localeCompare(b.name));

    const start = (page - 1) * size;
    const data = filtered.slice(start, start + size).map(toCompanyView);
    const body: CourierCompaniesPage = {
      data,
      pageable: { page, size, total: filtered.length },
    };
    return HttpResponse.json(body);
  }),

  http.get(`${apiUrl}/api/admin/courier-companies/:id`, ({ params }) => {
    refreshCounts();
    const id = Number(params.id);
    const row = courierCompanies.find((c) => c.id === id);
    if (!row) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: `Courier company ${id} not found` },
        { status: 404 },
      );
    }
    const detail: CourierCompanyDetail = {
      ...toCompanyView(row),
      authorizedLockerCodes: [...row.authorizedLockerCodes],
      staff: courierStaff
        .filter((s) => s.companyId === id)
        .sort((a, b) => a.nickname.localeCompare(b.nickname)),
    };
    return HttpResponse.json(detail);
  }),

  http.post(`${apiUrl}/api/admin/courier-companies`, async ({ request }) => {
    const body = (await request.json()) as CreateCourierCompanyInput;
    if (courierCompanies.some((c) => c.code === body.code)) {
      return HttpResponse.json(
        { code: 'DUPLICATE_CODE', message: `Courier company ${body.code} already exists.` },
        { status: 409 },
      );
    }
    const now = new Date().toISOString();
    const row: CourierCompanyRow = {
      id: ++nextCompanyId,
      code: body.code,
      name: body.name,
      logoUrl: null,
      contactPhone: body.contactPhone ?? null,
      contactEmail: body.contactEmail ?? null,
      active: true,
      staffCount: 0,
      authorizedLockerCount: 0,
      authorizedLockerCodes: [],
      createdAt: now,
      updatedAt: now,
    };
    courierCompanies.push(row);
    const detail: CourierCompanyDetail = {
      ...toCompanyView(row),
      authorizedLockerCodes: [],
      staff: [],
    };
    return HttpResponse.json(detail, { status: 201 });
  }),

  http.put(
    `${apiUrl}/api/admin/courier-companies/:id/authorized-lockers`,
    async ({ params, request }) => {
      const id = Number(params.id);
      const row = courierCompanies.find((c) => c.id === id);
      if (!row) {
        return HttpResponse.json({ code: 'NOT_FOUND' }, { status: 404 });
      }
      const body = (await request.json()) as { lockerCodes: string[] };
      row.authorizedLockerCodes = [...new Set(body.lockerCodes)];
      row.updatedAt = new Date().toISOString();
      refreshCounts();
      const detail: CourierCompanyDetail = {
        ...toCompanyView(row),
        authorizedLockerCodes: [...row.authorizedLockerCodes],
        staff: courierStaff.filter((s) => s.companyId === id),
      };
      return HttpResponse.json(detail);
    },
  ),

  // ── Staff ────────────────────────────────────────────────────────────────
  http.get(`${apiUrl}/api/admin/courier-staff`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);
    const q = url.searchParams.get('q')?.toLowerCase().trim();
    const companyId = url.searchParams.get('companyId');

    let filtered = [...courierStaff];
    if (companyId) {
      filtered = filtered.filter((s) => s.companyId === Number(companyId));
    }
    if (q) {
      filtered = filtered.filter(
        (s) =>
          s.nickname.toLowerCase().includes(q) ||
          s.loginPhone.toLowerCase().includes(q) ||
          s.companyName.toLowerCase().includes(q),
      );
    }
    filtered.sort((a, b) => a.nickname.localeCompare(b.nickname));

    const start = (page - 1) * size;
    const data = filtered.slice(start, start + size);
    const body: CourierStaffPage = {
      data,
      pageable: { page, size, total: filtered.length },
    };
    return HttpResponse.json(body);
  }),

  http.post(`${apiUrl}/api/admin/courier-staff`, async ({ request }) => {
    const body = (await request.json()) as CreateCourierStaffInput;
    const company = courierCompanies.find((c) => c.id === body.companyId);
    if (!company) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: `Courier company ${body.companyId} not found` },
        { status: 404 },
      );
    }
    if (courierStaff.some((s) => s.loginPhone === body.loginPhone)) {
      return HttpResponse.json(
        { code: 'DUPLICATE_PHONE', message: `Login phone ${body.loginPhone} already in use.` },
        { status: 409 },
      );
    }
    const now = new Date().toISOString();
    const staff: CourierStaff = {
      id: ++nextStaffId,
      companyId: company.id,
      companyCode: company.code,
      companyName: company.name,
      nickname: body.nickname,
      loginPhone: body.loginPhone,
      cardNumber: body.cardNumber ?? null,
      active: true,
      totalDropoffs: 0,
      lastDropoffAt: null,
      createdAt: now,
      updatedAt: now,
    };
    courierStaff.push(staff);
    refreshCounts();
    return HttpResponse.json(staff, { status: 201 });
  }),
];
