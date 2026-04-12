import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  message: string;
  title?: string;
  duration?: number;
}

export type ToastInput = Omit<Toast, 'id'>;

export interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: ToastInput) => void;
  removeToast: (id: number) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_DURATION = 4000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counterRef = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: ToastInput) => {
      counterRef.current += 1;
      const id = Date.now() * 1000 + counterRef.current;
      const duration = toast.duration ?? DEFAULT_DURATION;
      setToasts((prev) => [...prev, { ...toast, id }]);
      if (duration > 0) {
        setTimeout(() => removeToast(id), duration);
      }
    },
    [removeToast],
  );

  const clearToasts = useCallback(() => setToasts([]), []);

  const value = useMemo<ToastContextValue>(
    () => ({ toasts, addToast, removeToast, clearToasts }),
    [toasts, addToast, removeToast, clearToasts],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastContext;
