/**
 * Roles known to the admin portal.
 *
 * `STAFF_ADMIN` is the only one issued by the real backend
 * (`/api/admin/auth/login`). The others are kept for MSW offline mode and
 * legacy components that haven't been retired yet.
 */
export type UserRole =
  | 'STAFF_ADMIN'
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'AGENT'
  | 'SUPPORT'
  | 'VIEWER'
  | 'CUSTOMER';

export interface AuthUser {
  id: number | string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt?: number;
}

export interface LoginResponse extends AuthTokens {
  user: AuthUser;
}
