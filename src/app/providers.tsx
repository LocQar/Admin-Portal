import { type ReactNode, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient, registerQueryToast } from '@/shared/api/queryClient';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ToastProvider, useToast } from '@/contexts/ToastContext';
// @ts-ignore - UI primitive still JSX, typed in a later step
import { ToastContainer } from '@/components/ui/Toast';

function QueryToastBridge() {
  const { addToast, toasts, removeToast } = useToast();
  useEffect(() => {
    registerQueryToast(({ type, message }) => addToast({ type, message }));
  }, [addToast]);
  return <ToastContainer toasts={toasts} removeToast={removeToast} />;
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <QueryToastBridge />
          {children}
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />}
        </ToastProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
