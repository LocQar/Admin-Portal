import { authHandlers } from './auth';
import { couriersHandlers } from './couriers';
import { customersHandlers } from './customers';
import { lockersHandlers } from './lockers';
import { notificationsHandlers } from './notifications';
import { ordersHandlers } from './orders';

export const handlers = [
  ...authHandlers,
  ...lockersHandlers,
  ...ordersHandlers,
  ...customersHandlers,
  ...couriersHandlers,
  ...notificationsHandlers,
];
