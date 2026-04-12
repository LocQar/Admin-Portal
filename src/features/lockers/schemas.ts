import { z } from 'zod';

export const lockerStatusSchema = z.enum([
  'available',
  'occupied',
  'reserved',
  'maintenance',
  'offline',
]);

export const updateLockerSchema = z.object({
  status: lockerStatusSchema.optional(),
  enabled: z.union([z.literal(0), z.literal(1)]).optional(),
  note: z.string().max(500).optional(),
});
export type UpdateLockerInput = z.infer<typeof updateLockerSchema>;

export const doorCommandSchema = z.object({
  action: z.enum(['open', 'close', 'lock', 'unlock']),
  reason: z.string().max(280).optional(),
});
export type DoorCommandInput = z.infer<typeof doorCommandSchema>;

/**
 * Patch payload for editing the operational metadata on a station — e.g.
 * changing the help phone number after the support line moves. Other fields
 * (sn, lat/lng) are immutable from the admin portal.
 */
export const updateStationSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  location: z.string().trim().min(2).max(120).optional(),
  helpPhoneNumber: z
    .string()
    .trim()
    .regex(/^(\+?\d{9,13}|0\d{9,12})$/, 'Enter a valid phone number')
    .nullable()
    .optional(),
});
export type UpdateStationInput = z.infer<typeof updateStationSchema>;
