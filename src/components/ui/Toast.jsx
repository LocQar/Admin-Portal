import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const DURATION = 4000;

export const Toast = ({ message, type = 'info', action, onClose }) => {
  const { theme } = useTheme();
  const [progress, setProgress] = useState(100);

  const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
  const Icon = icons[type] || Info;
  const colors = {
    success: theme.status.success,
    error: theme.status.error,
    warning: theme.status.warning,
    info: theme.status.info,
  };
  const color = colors[type];

  useEffect(() => {
    const timer = setTimeout(onClose, DURATION);
    const interval = setInterval(() => {
      setProgress(prev => Math.max(0, prev - (100 / (DURATION / 50))));
    }, 50);
    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onClose]);

  return (
    <div
      className="flex items-center gap-3 pl-4 pr-3 py-3 rounded-xl shadow-xl border overflow-hidden relative animate-slide-in"
      style={{
        backgroundColor: theme.bg.card,
        borderColor: theme.border.primary,
        minWidth: 260,
        maxWidth: 360,
      }}
    >
      {/* Left color accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
        style={{ backgroundColor: color }}
      />
      <Icon size={18} style={{ color }} className="shrink-0" />
      <span className="text-sm flex-1 leading-snug" style={{ color: theme.text.primary }}>{message}</span>
      {action && (
        <button
          onClick={() => { action.onClick(); onClose(); }}
          className="px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {action.label}
        </button>
      )}
      <button
        onClick={onClose}
        className="p-1.5 rounded-lg shrink-0 transition-colors"
        style={{ color: theme.icon.muted }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = theme.bg.hover; e.currentTarget.style.color = theme.text.primary; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = theme.icon.muted; }}
      >
        <X size={14} />
      </button>
      {/* Progress bar */}
      <div
        className="absolute bottom-0 left-0 h-0.5 transition-all duration-[50ms] ease-linear"
        style={{ width: `${progress}%`, backgroundColor: color, opacity: 0.5 }}
      />
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

