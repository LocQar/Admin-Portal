import { apiClient } from '@/shared/api/client';
import type { CredentialsLoginInput } from '../schemas';
import type { AuthUser, LoginResponse } from '../types';

/**
 * Admin portal auth — talks to dashboard-api at `/api/admin/auth/*`.
 *
 * The portal is internal-staff only; there's no OTP or demo login.
 * Customers and partners use the mobile app, not this portal.
 */
export const authApi = {
  loginWithCredentials: (body: CredentialsLoginInput) =>
    apiClient.post<LoginResponse>('/api/admin/auth/login', body, { skipAuth: true }),

  refresh: (refreshToken: string) =>
    apiClient.post<LoginResponse>(
      '/api/admin/auth/refresh',
      { refreshToken },
      { skipAuth: true },
    ),

  me: () => apiClient.get<AuthUser>('/api/admin/me'),
};
