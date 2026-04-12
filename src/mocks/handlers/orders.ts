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

export const orders: Order[] = [
  {
    id: 1,
    code: 'LQ-2026-00001',
    recipientPhoneNumber: '+233244000111',
    senderPhoneNumber: '+233244000222',
    desLockerCode: 'WNS-ACH-001',
    srcLockerCode: null,
    description: 'Documents',
    doorToDoorEnabled: false,
    pickupPaymentEnabled: false,
    dropOffPaymentEnabled: false,
    storageSize: 'M',
    storageDurationHours: 48,
    createdBy: 'CUSTOMER:+233244000222',
    updatedBy: 'CUSTOMER:+233244000222',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    type: { id: 1, code: 'CUS_1LOC' },
    status: makeStatus('AWAIT_PACKAGE'),
    orderProgresses: [
      {
        id: 1,
        statusId: 1,
        status: makeStatus('CREATED'),
        lockerCode: null,
        lockerDoorNo: null,
        lockerSize: null,
        lockerOpenCode: null,
        description: 'Order created',
        createdBy: 'SYSTEM',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      },
      {
        id: 2,
        statusId: 2,
        status: makeStatus('AWAIT_PACKAGE'),
        lockerCode: 'WNS-ACH-001',
        lockerDoorNo: '15',
        lockerSize: 'M',
        lockerOpenCode: '4827',
        description: 'Awaiting drop-off',
        createdBy: 'SYSTEM',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      },
    ],
  },
  {
    id: 2,
    code: 'LQ-2026-00002',
    recipientPhoneNumber: '+233244000333',
    senderPhoneNumber: '+233244000444',
    desLockerCode: 'WNS-ACC-002',
    srcLockerCode: null,
    description: 'Phone',
    doorToDoorEnabled: false,
    pickupPaymentEnabled: false,
    dropOffPaymentEnabled: false,
    storageSize: 'S',
    storageDurationHours: 48,
    createdBy: 'CUSTOMER:+233244000444',
    updatedBy: 'AGENT:1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    type: { id: 1, code: 'CUS_1LOC' },
    status: makeStatus('READY_FOR_PICKUP'),
    orderProgresses: [
      {
        id: 3,
        statusId: 3,
        status: makeStatus('READY_FOR_PICKUP'),
        lockerCode: 'WNS-ACC-002',
        lockerDoorNo: '8',
        lockerSize: 'S',
        lockerOpenCode: '7193',
        description: 'Package dropped off by agent',
        createdBy: 'AGENT:1',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
    ],
  },
  {
    id: 3,
    code: 'LQ-2026-00003',
    recipientPhoneNumber: '+233244000555',
    senderPhoneNumber: '+233244000666',
    desLockerCode: 'WNS-KOT-003',
    srcLockerCode: null,
    description: 'Books',
    doorToDoorEnabled: false,
    pickupPaymentEnabled: false,
    dropOffPaymentEnabled: false,
    storageSize: 'M',
    storageDurationHours: 48,
    createdBy: 'CUSTOMER:+233244000666',
    updatedBy: 'CUSTOMER:+233244000555',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    type: { id: 1, code: 'CUS_1LOC' },
    status: makeStatus('COMPLETED_PICKUP'),
    orderProgresses: [
      {
        id: 4,
        statusId: 4,
        status: makeStatus('COMPLETED_PICKUP'),
        lockerCode: 'WNS-KOT-003',
        lockerDoorNo: '22',
        lockerSize: 'M',
        lockerOpenCode: '2461',
        description: 'Picked up by recipient',
        createdBy: 'CUSTOMER:+233244000555',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      },
    ],
  },
];

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
