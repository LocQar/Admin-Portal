import { http, HttpResponse } from 'msw';
import { cloudConfig } from '@/shared/config/cloud';
import type { AuthUser } from '@/features/auth/types';

const apiUrl = cloudConfig.apiUrl;

/**
 * MSW mirror of dashboard-api `/api/admin/auth/*` for offline dev.
 *
 * Single canonical staff admin user. The portal is internal-staff only,
 * so there's no OTP, no demo login, no role-switcher.
 */

const ADMIN_USER: AuthUser & { password: string } = {
  id: 1,
  email: 'admin@locqar.com',
  name: 'Admin',
  role: 'STAFF_ADMIN',
  password: 'changeme123',
};

function publicUser(u: AuthUser & { password: string }): AuthUser {
  const { password: _pw, ...rest } = u;
  return rest;
}

function makeTokens() {
  return {
    accessToken: `mock.access.${Date.now()}`,
    refreshToken: `mock.refresh.${Date.now()}`,
    expiresAt: Date.now() + 60 * 60 * 1000,
  };
}

export const authHandlers = [
  http.post(`${apiUrl}/api/admin/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    if (
      body.email.trim().toLowerCase() !== ADMIN_USER.email ||
      body.password !== ADMIN_USER.password
    ) {
      return HttpResponse.json(
        { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
        { status: 401 },
      );
    }
    return HttpResponse.json({ user: publicUser(ADMIN_USER), ...makeTokens() });
  }),

  http.post(`${apiUrl}/api/admin/auth/refresh`, async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as { refreshToken?: string };
    if (!body.refreshToken) {
      return HttpResponse.json(
        { code: 'NO_REFRESH', message: 'Missing refresh token' },
        { status: 401 },
      );
    }
    return HttpResponse.json({ user: publicUser(ADMIN_USER), ...makeTokens() });
  }),

  http.get(`${apiUrl}/api/admin/me`, ({ request }) => {
    const auth = request.headers.get('authorization');
    if (!auth) return HttpResponse.json({ code: 'UNAUTHENTICATED' }, { status: 401 });
    return HttpResponse.json(publicUser(ADMIN_USER));
  }),

  http.get(`${apiUrl}/health`, () => HttpResponse.json({ status: 'ok', mode: 'msw' })),
];
