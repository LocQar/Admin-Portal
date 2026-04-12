import { z } from 'zod';

export const credentialsLoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type CredentialsLoginInput = z.infer<typeof credentialsLoginSchema>;
