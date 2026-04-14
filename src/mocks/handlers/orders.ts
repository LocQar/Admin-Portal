import { http, HttpResponse } from 'msw';
import { cloudConfig } from '@/shared/config/cloud';
import type {
  Order,
  OrderEventCode,
  OrderStatusCode,
  OrderTypeCode,
  OrdersPage,
  OrderStats,
} from '@/features/orders/types';

const apiUrl = cloudConfig.apiUrl;

let nextProgressId = 1000;
let nextOrderId = 1000;

function makeStatus(code: OrderStatusCode) {
  return { id: 1, code, name: code };
}

export const orders: Order[] = [];

// Status transitions when an admin records an event manually.
const EVENT_TRANSITIONS: Record<OrderEventCode, OrderStatusCode | null> = {
  CONFIRMED: 'AWAIT_PACKAGE',
  LOCKER_AGENT_DROPOFF: 'READY_FOR_PICKUP',
  LOCKER_GUEST_DROPOFF: 'READY_FOR_PICKUP',
  LOCKER_SUBSCRIBER_DROPOFF: 'READY_FOR_PICKUP',
  LOCKER_AGENT_COLLECT: 'COMPLETED_PICKUP',
  LOCKER_GUEST_COLLECT: 'COMPLETED_PICKUP',
  LOCKER_SUBSCRIBER_COLLECT: 'COMPLETED_PICKUP',
  CANCELED: 'CANCELED',
  RECALL_REQUESTED: 'RECALL_REQUESTED',
  RETURN_REQUESTED: 'AWAIT_RETURNED_PACKAGE',
  LOCKER_SELECTED: null,
};

function computeStats(): OrderStats {
  const stats: OrderStats = { total: 0, delivered: 0, returned: 0, recalled: 0, processing: 0 };
  for (const o of orders) {
    stats.total += 1;
    if (o.status.code === 'COMPLETED_PICKUP') stats.delivered += 1;
    else if (o.status.code === 'RETURNED_TO_SENDER') stats.returned += 1;
    else if (o.status.code === 'RECALLED' || o.status.code === 'RECALL_REQUESTED') stats.recalled += 1;
    else stats.processing += 1;
  }
  return stats;
}

export const ordersHandlers = [
  http.get(`${apiUrl}/api/admin/orders/stats`, () => HttpResponse.json(computeStats())),

  http.get(`${apiUrl}/api/admin/orders`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const size = Number(url.searchParams.get('size') ?? 25);
    const q = url.searchParams.get('q')?.toLowerCase();

    let filtered = orders;
    if (q) {
      filtered = orders.filter(
        (o) =>
          o.code.toLowerCase().includes(q) ||
          o.recipientPhoneNumber.toLowerCase().includes(q) ||
          (o.senderPhoneNumber ?? '').toLowerCase().includes(q),
      );
    }

    const start = (page - 1) * size;
    const data = filtered.slice(start, start + size);
    const body: OrdersPage = {
      data,
      pageable: { page, size, total: filtered.length },
    };
    return HttpResponse.json(body);
  }),

  http.post(`${apiUrl}/api/admin/orders`, async ({ request }) => {
    const body = (await request.json()) as {
      code: string;
      type: OrderTypeCode;
      desLockerCode: string;
      srcLockerCode?: string;
      recipientPhoneNumber: string;
      senderPhoneNumber?: string;
      description?: string;
      storageSize?: string;
      storageDurationHours?: number;
    };

    if (orders.some((o) => o.code === body.code)) {
      return HttpResponse.json(
        { code: 'DUPLICATE_CODE', message: `Order ${body.code} already exists.` },
        { status: 409 },
      );
    }

    const isTwoLoc = body.type === 'CUS_2LOC' || body.type === 'PARTNER_2LOC';
    if (isTwoLoc && !body.srcLockerCode) {
      return HttpResponse.json(
        { code: 'MISSING_SRC_LOCKER', message: 'srcLockerCode required for 2-locker orders.' },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const initialStatus: OrderStatusCode = isTwoLoc
      ? 'PENDING_SRC_LOCKER_SELECTION'
      : 'AWAIT_PACKAGE';

    const newOrder: Order = {
      id: ++nextOrderId,
      code: body.code,
      recipientPhoneNumber: body.recipientPhoneNumber,
      senderPhoneNumber: body.senderPhoneNumber ?? null,
      desLockerCode: body.desLockerCode,
      srcLockerCode: body.srcLockerCode ?? null,
      description: body.description ?? null,
      doorToDoorEnabled: false,
      pickupPaymentEnabled: false,
      dropOffPaymentEnabled: false,
      storageSize: body.storageSize ?? null,
      storageDurationHours: body.storageDurationHours ?? null,
      createdBy: 'ADMIN:1:admin@locqar.com',
      updatedBy: 'ADMIN:1:admin@locqar.com',
      createdAt: now,
      updatedAt: now,
      type: { id: 1, code: body.type },
      status: makeStatus(initialStatus),
      orderProgresses: [
        {
          id: ++nextProgressId,
          statusId: nextProgressId,
          status: makeStatus('CREATED'),
          lockerCode: null,
          lockerDoorNo: null,
          lockerSize: null,
          lockerOpenCode: null,
          description: 'Walk-in order created at warehouse counter',
          createdBy: 'ADMIN:1:admin@locqar.com',
          createdAt: now,
        },
        {
          id: ++nextProgressId,
          statusId: nextProgressId,
          status: makeStatus(initialStatus),
          lockerCode: body.desLockerCode,
          lockerDoorNo: null,
          lockerSize: body.storageSize ?? null,
          lockerOpenCode: null,
          description: null,
          createdBy: 'ADMIN:1:admin@locqar.com',
          createdAt: now,
        },
      ],
    };

    orders.unshift(newOrder);
    return HttpResponse.json(newOrder, { status: 201 });
  }),

  http.post(`${apiUrl}/api/admin/orders/:code/events`, async ({ params, request }) => {
    const idx = orders.findIndex((o) => o.code === params.code);
    if (idx === -1) {
      return HttpResponse.json({ code: 'NOT_FOUND', message: 'Order not found' }, { status: 404 });
    }
    const body = (await request.json()) as {
      event: OrderEventCode;
      reason: string;
      lockerCode?: string;
      lockerDoorNo?: string;
      lockerSize?: string;
      lockerPinCode?: string;
    };

    const nextStatus = EVENT_TRANSITIONS[body.event];
    if (!nextStatus) {
      return HttpResponse.json(
        { code: 'INVALID_EVENT', message: `Event ${body.event} not supported here.` },
        { status: 400 },
      );
    }

    const order = orders[idx];
    order.status = makeStatus(nextStatus);
    order.updatedAt = new Date().toISOString();
    order.updatedBy = 'ADMIN:1:admin@locqar.com';
    order.orderProgresses = [
      ...order.orderProgresses,
      {
        id: ++nextProgressId,
        statusId: nextProgressId,
        status: makeStatus(nextStatus),
        lockerCode: body.lockerCode ?? null,
        lockerDoorNo: body.lockerDoorNo ?? null,
        lockerSize: body.lockerSize ?? null,
        lockerOpenCode: body.lockerPinCode ?? null,
        description: `[ADMIN OVERRIDE: ${body.reason}]`,
        createdBy: 'ADMIN:1:admin@locqar.com',
        createdAt: new Date().toISOString(),
      },
    ];

    return HttpResponse.json(order);
  }),
];
