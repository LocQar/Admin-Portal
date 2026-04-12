import { describe, expect, it, beforeEach } from 'vitest';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/authApi';

describe('admin auth (MSW)', () => {
  beforeEach(() => {
    useAuthStore.setState({ user: null, accessToken: null, refreshToken: null });
  });

  it('signs in with valid staff credentials', async () => {
    const result = await authApi.loginWithCredentials({
      email: 'admin@locqar.com',
      password: 'changeme123',
    });
    expect(result.user.email).toBe('admin@locqar.com');
    expect(result.user.role).toBe('STAFF_ADMIN');
    expect(result.accessToken).toMatch(/^mock\.access\./);
    expect(result.refreshToken).toMatch(/^mock\.refresh\./);
    // Public user payload must not leak the password field
    expect((result.user as unknown as { password?: string }).password).toBeUndefined();
  });

  it('rejects wrong password', async () => {
    await expect(
      authApi.loginWithCredentials({
        email: 'admin@locqar.com',
        password: 'wrong-password-1',
      }),
    ).rejects.toMatchObject({ status: 401 });
  });

  it('rejects unknown email', async () => {
    await expect(
      authApi.loginWithCredentials({
        email: 'nobody@locqar.com',
        password: 'changeme123',
      }),
    ).rejects.toMatchObject({ status: 401 });
  });

  it('refresh returns a fresh token pair', async () => {
    const result = await authApi.refresh('mock.refresh.123');
    expect(result.accessToken).toMatch(/^mock\.access\./);
    expect(result.refreshToken).toMatch(/^mock\.refresh\./);
  });

  it('refresh rejects missing token', async () => {
    await expect(authApi.refresh('')).rejects.toMatchObject({ status: 401 });
  });

  it('authStore persists session', () => {
    useAuthStore.getState().setSession({
      user: { id: 1, email: 'admin@locqar.com', role: 'STAFF_ADMIN' },
      accessToken: 'a',
      refreshToken: 'r',
    });
    expect(useAuthStore.getState().isAuthenticated()).toBe(true);
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().isAuthenticated()).toBe(false);
  });
});
