import { QueryCache, QueryClient } from '@tanstack/react-query';
import { errorMessage } from './errors';

/**
 * Global TanStack Query config.
 *
 * - Queries: 30s stale, 5min gc, no refetch on window focus (admin portal is long-lived).
 * - Mutations: surface errors via a global toast unless the caller provides their own onError.
 * - The toast call is wired in providers.tsx after the ToastProvider is mounted (via setter).
 */

type ToastFn = (opts: { type: 'error' | 'success' | 'info' | 'warning'; message: string }) => void;

let toastFn: ToastFn | null = null;

export function registerQueryToast(fn: ToastFn): void {
  toastFn = fn;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      // Only show toast for background refetch failures, not initial loads
      // (initial loads typically show an error UI in the component)
      if (query.state.data !== undefined) {
        toastFn?.({ type: 'error', message: errorMessage(error) });
      }
    },
  }),
});
