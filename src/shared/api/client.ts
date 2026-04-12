/**
 * Typed fetch wrapper with auth + refresh interceptors.
 *
 * Usage:
 *   const user = await apiClient.get<User>('/auth/me');
 *   await apiClient.post('/packages', body);
 *
 * Design notes:
 * - Reads access token from Zustand authStore (avoid circular import by
 *   lazily importing the store inside the interceptor).
 * - On 401, calls /auth/refresh once and retries the original request.
 *   If refresh fails, logs out and re-throws.
 * - All errors become ApiError instances.
 */

import { cloudConfig } from '@/shared/config/cloud';
import { ApiError, normalizeError } from './errors';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  signal?: AbortSignal;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

let isRefreshing = false;
let refreshPromise: Promise<void> | null = null;

async function runRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, signal, headers = {}, skipAuth = false } = options;

  // Lazy import to avoid circular dependency with authStore
  const { useAuthStore } = await import('@/features/auth/stores/authStore');
  const token = skipAuth ? null : useAuthStore.getState().accessToken;

  const init: RequestInit = {
    method,
    signal,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body !== undefined) {
    init.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${cloudConfig.apiUrl}${endpoint}`;
  const response = await fetch(url, init);

  if (response.status === 401 && !skipAuth) {
    // Try to refresh and retry once
    try {
      await refreshAccessToken();
      return runRequest<T>(endpoint, { ...options, skipAuth: false });
    } catch {
      const { useAuthStore: store } = await import('@/features/auth/stores/authStore');
      store.getState().logout();
      throw await normalizeError(response);
    }
  }

  if (!response.ok) {
    throw await normalizeError(response);
  }

  // 204 No Content
  if (response.status === 204) return undefined as T;

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType.includes('application/json')) {
    return (await response.json()) as T;
  }
  return (await response.text()) as unknown as T;
}

async function refreshAccessToken(): Promise<void> {
  if (isRefreshing && refreshPromise) return refreshPromise;
  isRefreshing = true;

  refreshPromise = (async () => {
    const { useAuthStore } = await import('@/features/auth/stores/authStore');
    const refreshToken = useAuthStore.getState().refreshToken;
    if (!refreshToken) {
      throw new ApiError({ status: 401, code: 'NO_REFRESH_TOKEN', message: 'Session expired' });
    }

    const response = await fetch(`${cloudConfig.apiUrl}/api/admin/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw await normalizeError(response);
    }

    const data = (await response.json()) as {
      accessToken: string;
      refreshToken?: string;
    };
    useAuthStore.getState().setTokens(data.accessToken, data.refreshToken ?? refreshToken);
  })();

  try {
    await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

export const apiClient = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    runRequest<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    runRequest<T>(endpoint, { ...options, method: 'POST', body }),
  put: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    runRequest<T>(endpoint, { ...options, method: 'PUT', body }),
  patch: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    runRequest<T>(endpoint, { ...options, method: 'PATCH', body }),
  delete: <T = void>(endpoint: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    runRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
