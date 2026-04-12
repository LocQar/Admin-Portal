import { z } from 'zod';

const PHONE = z
  .string()
  .trim()
  .regex(/^(\+?\d{9,13}|0\d{9,12})$/, 'Enter a valid phone number');

/**
 * Mirrors `CreateCourierCompanyDto` on dashboard-api. Code is the upper-snake
 * external identifier (DHL, JUMIA), name is the human label.
 */
export const createCourierCompanySchema = z.object({
  code: z
    .string()
    .trim()
    .min(2, 'Code must be at least 2 characters')
    .max(20, 'Code must be 20 characters or fewer')
    .regex(/^[A-Z0-9_-]+$/, 'Use uppercase letters, digits, dash or underscore'),
  name: z.string().trim().min(2, 'Name is required').max(80),
  contactPhone: PHONE.optional().or(z.literal('').transform(() => undefined)),
  contactEmail: z.string().trim().email('Enter a valid email').optional().or(z.literal('').transform(() => undefined)),
});
export type CreateCourierCompanyInput = z.infer<typeof createCourierCompanySchema>;

/**
 * Mirrors `CreateCourierStaffDto`. loginPhone is what the courier enters at
 * the kiosk; cardNumber is optional and used only when the locker has a
 * card reader.
 */
export const createCourierStaffSchema = z.object({
  companyId: z.number().int().positive('Pick a courier company'),
  nickname: z.string().trim().min(2, 'Name is required').max(60),
  loginPhone: PHONE,
  cardNumber: z
    .string()
    .trim()
    .max(40, 'Card number must be 40 characters or fewer')
    .optional()
    .or(z.literal('').transform(() => undefined)),
});
export type CreateCourierStaffInput = z.infer<typeof createCourierStaffSchema>;
