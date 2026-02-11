import React from 'react';
import { Keyboard, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], action: 'search', label: 'Global Search' },
  { keys: ['Ctrl', 'S'], action: 'scan', label: 'Quick Scan' },
  { keys: ['Ctrl', 'N'], action: 'new', label: 'New Package' },
  { keys: ['Ctrl', 'D'], action: 'dispatch', label: 'New Dispatch' },
  { keys: ['Ctrl', 'Shift', '/'], action: 'shortcuts', label: 'Show Shortcuts' },
  { keys: ['Esc'], action: 'close', label: 'Close Modal' },
];

export const ShortcutsModal = ({ isOpen, onClose }) => {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-md rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: theme.text.primary }}><Keyboard size={20} /> Keyboard Shortcuts</h2>
          <button onClick={onClose} className="p-2 rounded-lg" style={{ color: theme.text.muted }}><X size={18} /></button>
        </div>
        <div className="space-y-3">
          {SHORTCUTS.map(s => (
            <div key={s.action} className="flex items-center justify-between py-2">
              <span style={{ color: theme.text.secondary }}>{s.label}</span>
              <div className="flex gap-1">{s.keys.map(k => <kbd key={k} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}>{k}</kbd>)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
