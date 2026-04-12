import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';
import { server } from '@/mocks/server';

// jsdom's localStorage is flaky in some versions; provide a minimal in-memory shim
// if it's missing or non-functional. Zustand persist needs getItem/setItem/removeItem.
(() => {
  const store = new Map<string, string>();
  const shim: Storage = {
    get length() {
      return store.size;
    },
    clear: () => store.clear(),
    getItem: (key) => store.get(key) ?? null,
    key: (index) => Array.from(store.keys())[index] ?? null,
    removeItem: (key) => {
      store.delete(key);
    },
    setItem: (key, value) => {
      store.set(key, String(value));
    },
  };
  try {
    if (typeof window !== 'undefined') {
      Object.defineProperty(window, 'localStorage', { value: shim, configurable: true });
      Object.defineProperty(window, 'sessionStorage', { value: shim, configurable: true });
    }
  } catch {
    // ignore
  }
})();

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
