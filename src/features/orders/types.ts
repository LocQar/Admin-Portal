/**
 * Types mirroring dashboard-api Order shapes.
 *
 * Source of truth: dashboard-api/src/orders/state-machine/order-status.switch.ts
 * and the Prisma `Order` / `OrderProgress` models.
 *
 * Keep these in sync until we generate them from the OpenAPI spec.
 */

export type OrderStatusCode =
  | 'CREATED'
  | 'PENDING_SRC_LOCKER_SELECTION'
  | 'AWAIT_PACKAGE'
  | 'READY_FOR_PICKUP'
  | 'EXPIRED_PICKUP'
  | 'COMPLETED_PICKUP'
  | 'RECALL_REQUESTED'
  | 'RECALLED'
  | 'AWAIT_RETURNED_PACKAGE'
  | 'RETURNED_PACKAGE_READY'
  | 'RETURNED_TO_SENDER'
  | 'CANCELED'
  | 'AWAIT_TRANSIT'
  | 'EN_ROUTE_TO_LOCKER';

export type OrderEventCode =
  | 'CONFIRMED'
  | 'LOCKER_AGENT_DROPOFF'
  | 'LOCKER_GUEST_DROPOFF'
  | 'LOCKER_SUBSCRIBER_DROPOFF'
  | 'LOCKER_AGENT_COLLECT'
  | 'LOCKER_GUEST_COLLECT'
  | 'LOCKER_SUBSCRIBER_COLLECT'
  | 'CANCELED'
  | 'RECALL_REQUESTED'
  | 'RETURN_REQUESTED'
  | 'LOCKER_SELECTED';

export type OrderTypeCode =
  | 'PARTNER_LOC'
  | 'PARTNER_2LOC'
  | 'CUS_1LOC'
  | 'CUS_2LOC';

export interface OrderProgress {
  id: number;
  statusId: number;
  status: { id: number; code: OrderStatusCode; name?: string };
  lockerCode: string | null;
  lockerDoorNo: string | null;
  lockerSize: string | null;
  lockerOpenCode: string | null;
  description: string | null;
  createdBy: string | null;
  createdAt: string;
}

export interface Order {
  id: number;
  code: string;
  recipientPhoneNumber: string;
  senderPhoneNumber: string | null;
  desLockerCode: string;
  srcLockerCode: string | null;
  description: string | null;
  doorToDoorEnabled: boolean;
  pickupPaymentEnabled: boolean;
  dropOffPaymentEnabled: boolean;
  storageSize: string | null;
  storageDurationHours: number | null;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  type: { id: number; code: OrderTypeCode; name?: string };
  status: { id: number; code: OrderStatusCode; name?: string };
  orderProgresses: OrderProgress[];
}

export interface OrdersPage {
  data: Order[];
  pageable: { page: number; size: number; total: number };
}

export interface OrderStats {
  total: number;
  delivered: number;
  returned: number;
  recalled: number;
  processing: number;
}

export interface OrderListFilters {
  page?: number;
  size?: number;
  q?: string;
}

/**
 * Drop-off events transition AWAIT_PACKAGE → READY_FOR_PICKUP.
 * Pickup events transition READY_FOR_PICKUP → COMPLETED_PICKUP.
 *
 * The portal exposes these as the "Record drop-off / Record pickup" actions
 * on the order detail page. They map to the same `POST /api/admin/orders/:code/events`
 * endpoint with different `event` codes.
 */
export const DROPOFF_EVENTS: ReadonlyArray<OrderEventCode> = [
  'LOCKER_AGENT_DROPOFF',
  'LOCKER_GUEST_DROPOFF',
  'LOCKER_SUBSCRIBER_DROPOFF',
];

export const PICKUP_EVENTS: ReadonlyArray<OrderEventCode> = [
  'LOCKER_AGENT_COLLECT',
  'LOCKER_GUEST_COLLECT',
  'LOCKER_SUBSCRIBER_COLLECT',
];

export const EVENT_LABELS: Record<OrderEventCode, string> = {
  CONFIRMED: 'Confirmed',
  LOCKER_AGENT_DROPOFF: 'Drop-off — Agent',
  LOCKER_GUEST_DROPOFF: 'Drop-off — Guest',
  LOCKER_SUBSCRIBER_DROPOFF: 'Drop-off — Subscriber',
  LOCKER_AGENT_COLLECT: 'Pickup — Agent',
  LOCKER_GUEST_COLLECT: 'Pickup — Guest',
  LOCKER_SUBSCRIBER_COLLECT: 'Pickup — Subscriber',
  CANCELED: 'Canceled',
  RECALL_REQUESTED: 'Recall requested',
  RETURN_REQUESTED: 'Return requested',
  LOCKER_SELECTED: 'Locker selected',
};

export const STATUS_LABELS: Record<OrderStatusCode, string> = {
  CREATED: 'Created',
  PENDING_SRC_LOCKER_SELECTION: 'Pending locker selection',
  AWAIT_PACKAGE: 'Awaiting drop-off',
  READY_FOR_PICKUP: 'Ready for pickup',
  EXPIRED_PICKUP: 'Pickup expired',
  COMPLETED_PICKUP: 'Picked up',
  RECALL_REQUESTED: 'Recall requested',
  RECALLED: 'Recalled',
  AWAIT_RETURNED_PACKAGE: 'Awaiting return drop-off',
  RETURNED_PACKAGE_READY: 'Return ready',
  RETURNED_TO_SENDER: 'Returned to sender',
  CANCELED: 'Canceled',
  AWAIT_TRANSIT: 'Awaiting transit',
  EN_ROUTE_TO_LOCKER: 'En route',
};
