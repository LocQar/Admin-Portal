import { http, HttpResponse } from 'msw';
import { cloudConfig } from '@/shared/config/cloud';
import type {
  CustomerDetail,
  CustomerSummary,
  CustomersPage,
} from '@/features/customers/types';
import type { Order, OrderStatusCode } from '@/features/orders/types';
import { orders } from './orders';

const apiUrl = cloudConfig.apiUrl;

const TERMINAL_STATUSES: ReadonlyArray<OrderStatusCode> = [
  'COMPLETED_PICKUP',
  'CANCELED',
  'RETURNED_TO_SENDER',
  'EXPIRED_PICKUP',
];

/**
 * Walks the in-memory orders list and folds it down to one entry per recipient
 * phone. The first time we see a phone we seed a summary; subsequent orders
 * update the running counts and the lastOrderAt cursor.
 */
function buildSummaries(): CustomerSummary[] {
  const byPhone = new Map<string, CustomerSummary>();

  // Iterate oldest-first so firstSeenAt naturally lands on the earliest order.
  const sorted = [...orders].sort(
    (a, b) => +new Date(a.createdAt) - +new Date(b.createdAt),
  );

  for (const o of sorted) {
    const phone = o.recipientPhoneNumber;
    const existing = byPhone.get(phone);
    const isTerminal = TERMINAL_STATUSES.includes(o.status.code);

    if (!existing) {
      byPhone.set(phone, {
        phone,
        name: null,
        firstSeenAt: o.createdAt,
        lastOrderAt: o.createdAt,
        totalOrders: 1,
        activeOrders: isTerminal ? 0 : 1,
        completedOrders: isTerminal ? 1 : 0,
        lastStatus: o.status.code,
      });
    } else {
      existing.totalOrders += 1;
      if (isTerminal) existing.completedOrders += 1;
      else existing.activeOrders += 1;
      // sorted ascending → the latest iteration always has the newest createdAt
      existing.lastOrderAt = o.createdAt;
      existing.lastStatus = o.status.code;
    }
  }

  // Return newest-active customers first.
  return [...byPhone.values()].sort(
    (a, b) => +new Date(b.lastOrderAt) - +new Date(a.lastOrderAt),
  );
}

function ordersForPhone(phone: string): Order[] {
  return orders
    .filter((o) => o.recipientPhoneNumber === phone)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export const customersHandlers = [
  http.get(`${apiUrl}/api/admin/customers`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);
    const q = url.searchParams.get('q')?.toLowerCase().trim();

    let summaries = buildSummaries();
    if (q) {
      summaries = summaries.filter(
        (c) =>
          c.phone.toLowerCase().includes(q) ||
          (c.name?.toLowerCase().includes(q) ?? false),
      );
    }

    const start = (page - 1) * size;
    const data = summaries.slice(start, start + size);
    const body: CustomersPage = {
      data,
      pageable: { page, size, total: summaries.length },
    };
    return HttpResponse.json(body);
  }),

  http.get(`${apiUrl}/api/admin/customers/:phone`, ({ params }) => {
    const phone = decodeURIComponent(params.phone as string);
    const summary = buildSummaries().find((c) => c.phone === phone);
    if (!summary) {
      return HttpResponse.json(
        { code: 'NOT_FOUND', message: `No orders for ${phone}` },
        { status: 404 },
      );
    }
    const body: CustomerDetail = {
      ...summary,
      orders: ordersForPhone(phone),
    };
    return HttpResponse.json(body);
  }),
];
