import React from 'react';
import { Clock } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const SessionTimeoutModal = ({ isOpen, onExtend, onLogout, remainingTime }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-sm rounded-2xl border p-6 text-center" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
          <Clock size={32} className="text-amber-500" />
        </div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: theme.text.primary }}>Session Expiring</h2>
        <p className="text-sm mb-4" style={{ color: theme.text.muted }}>Your session will expire in <span className="font-bold text-amber-500">{remainingTime}s</span>. Would you like to continue?</p>
        <div className="flex gap-3">
          <button onClick={onLogout} className="flex-1 py-2 rounded-xl border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Logout</button>
          <button onClick={onExtend} className="flex-1 py-2 rounded-xl" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>Continue Session</button>
        </div>
      </div>
    </div>
  );
};
