import React, { useState } from 'react';
import { FileDown, Download } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const ExportModal = ({ isOpen, onClose, onExport, dataType }) => {
  const { theme } = useTheme();
  const [format, setFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-md rounded-2xl border p-6"
        style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: theme.text.primary }}>
          <FileDown size={20} /> Export {dataType}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm mb-2 block" style={{ color: theme.text.muted }}>Format</label>
            <div className="flex gap-2">
              {['csv', 'xlsx', 'pdf'].map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className="flex-1 py-2 rounded-xl text-sm uppercase"
                  style={{
                    backgroundColor: format === f ? theme.accent.light : theme.bg.tertiary,
                    color: format === f ? theme.accent.primary : theme.text.secondary,
                    border: format === f ? `1px solid ${theme.accent.border}` : `1px solid ${theme.border.primary}`
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm mb-2 block" style={{ color: theme.text.muted }}>Date Range</label>
            <select
              value={dateRange}
              onChange={e => setDateRange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border"
              style={{
                backgroundColor: theme.bg.tertiary,
                borderColor: theme.border.primary,
                color: theme.text.primary
              }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border"
            style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onExport(format, dateRange); onClose(); }}
            className="flex-1 py-2 rounded-xl text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: theme.accent.primary }}
          >
            <Download size={16} /> Export
          </button>
        </div>
      </div>
    </div>
  );
};
