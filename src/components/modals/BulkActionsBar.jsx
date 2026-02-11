import React from 'react';
import { X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const BulkActionsBar = ({ selectedCount, onClear, onAction, actions }) => {
  const { theme } = useTheme();

  if (selectedCount === 0) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-6 py-3 rounded-2xl shadow-xl border"
      style={{ backgroundColor: theme.bg.card, borderColor: theme.accent.border }}
    >
      <span className="text-sm" style={{ color: theme.text.primary }}>
        <span className="font-bold">{selectedCount}</span> selected
      </span>
      <div className="h-6 w-px" style={{ backgroundColor: theme.border.primary }} />
      {actions.map(a => (
        <button
          key={a.id}
          onClick={() => onAction(a.id)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
          style={{ backgroundColor: a.color + '15', color: a.color }}
        >
          <a.icon size={16} />
          {a.label}
        </button>
      ))}
      <button onClick={onClear} className="p-1.5 rounded-lg" style={{ color: theme.text.muted }}>
        <X size={18} />
      </button>
    </div>
  );
};
