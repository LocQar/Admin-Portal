import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const Toast = ({ message, type = 'info', onClose }) => {
  const { theme } = useTheme();
  const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
  const Icon = icons[type] || Info;
  const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };

  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slide-in"
      style={{ backgroundColor: theme.bg.card, borderColor: colors[type] }}
    >
      <Icon size={20} style={{ color: colors[type] }} />
      <span className="text-sm flex-1" style={{ color: theme.text.primary }}>{message}</span>
      <button onClick={onClose} className="p-1 rounded hover:bg-white/10">
        <X size={16} style={{ color: theme.text.muted }} />
      </button>
    </div>
  );
};

export const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    {toasts.map(toast => (
      <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />
    ))}
  </div>
);
