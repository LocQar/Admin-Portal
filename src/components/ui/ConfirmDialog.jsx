import React, { useEffect } from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const variantConfig = {
  danger: { color: '#ef4444', icon: AlertTriangle },
  warning: { color: '#f59e0b', icon: AlertTriangle },
  info: { color: '#3b82f6', icon: Info },
};

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  variant = 'danger',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
}) => {
  const { theme } = useTheme();
  const config = variantConfig[variant] || variantConfig.danger;
  const Icon = config.icon;

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-sm rounded-2xl border p-6"
        style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg hover:bg-white/10"
        >
          <X size={16} style={{ color: theme.icon.muted }} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
            style={{ backgroundColor: `${config.color}15` }}
          >
            <Icon size={28} style={{ color: config.color }} />
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text.primary }}>
            {title}
          </h3>
          <p className="text-sm mb-6" style={{ color: theme.text.muted }}>
            {message}
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:bg-white/5"
            style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-medium transition-colors hover:opacity-90"
            style={{ backgroundColor: config.color }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
