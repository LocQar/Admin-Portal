import { z } from 'zod';

const ORDER_EVENT = z.enum([
  'CONFIRMED',
  'LOCKER_AGENT_DROPOFF',
  'LOCKER_GUEST_DROPOFF',
  'LOCKER_SUBSCRIBER_DROPOFF',
  'LOCKER_AGENT_COLLECT',
  'LOCKER_GUEST_COLLECT',
  'LOCKER_SUBSCRIBER_COLLECT',
  'CANCELED',
  'RECALL_REQUESTED',
  'RETURN_REQUESTED',
  'LOCKER_SELECTED',
]);

/**
 * Manual override / event recording schema. The `reason` field is required by
 * the backend (`AdminOrderEventDto`) and is permanently logged in
 * `OrderProgress.description` for audit.
 */
export const orderEventSchema = z.object({
  event: ORDER_EVENT,
  reason: z
    .string()
    .min(8, 'Explain why you are recording this manually (min 8 chars)')
    .max(280, 'Reason must be 280 characters or fewer'),
  lockerCode: z.string().optional(),
  lockerDoorNo: z.string().optional(),
  lockerSize: z.string().optional(),
  lockerPinCode: z.string().optional(),
});
export type OrderEventInput = z.infer<typeof orderEventSchema>;

const ORDER_TYPE = z.enum(['PARTNER_LOC', 'PARTNER_2LOC', 'CUS_1LOC', 'CUS_2LOC']);
const STORAGE_SIZE = z.enum(['SMALL', 'MEDIUM', 'LARGE', 'XL']);
const STORAGE_HOURS = z.union([z.literal(2), z.literal(6), z.literal(24), z.literal(72)]);

// Loose Ghana mobile pattern: leading + or 0, then 9-13 digits.
const PHONE = z
  .string()
  .trim()
  .regex(/^(\+?\d{9,13}|0\d{9,12})$/, 'Enter a valid phone number');

/**
 * Walk-in order creation. Mirrors `CreateOrderDto` on dashboard-api.
 * `code` is generated on the client (timestamp-based) so the operator
 * doesn't have to type one — staff can override it if needed.
 */
export const createOrderSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(4, 'Order code must be at least 4 characters')
      .max(40, 'Order code must be 40 characters or fewer'),
    type: ORDER_TYPE,
    desLockerCode: z.string().trim().min(1, 'Destination locker is required'),
    srcLockerCode: z.string().trim().optional(),
    recipientPhoneNumber: PHONE,
    senderPhoneNumber: PHONE.optional().or(z.literal('').transform(() => undefined)),
    description: z.string().max(280).optional(),
    storageSize: STORAGE_SIZE.optional(),
    storageDurationHours: STORAGE_HOURS.optional(),
  })
  .refine(
    (v) => {
      // 2LOC types require srcLockerCode
      if (v.type === 'PARTNER_2LOC' || v.type === 'CUS_2LOC') {
        return !!v.srcLockerCode && v.srcLockerCode.length > 0;
      }
      return true;
    },
    { path: ['srcLockerCode'], message: 'Source locker is required for 2-locker orders' },
  );
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
