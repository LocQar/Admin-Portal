import React from 'react';
import { Download } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { auditLogData } from '../constants/mockDataPart2';

export const AuditLogPage = ({ setShowExport }) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>
            Audit Log
          </h1>
          <p style={{ color: theme.text.muted }}>Track all system activities</p>
        </div>
        <button
          onClick={() => setShowExport(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm"
          style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
        >
          <Download size={16} />Export
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>
                User
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>
                Action
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>
                Timestamp
              </th>
              <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>
                IP Address
              </th>
            </tr>
          </thead>
          <tbody>
            {auditLogData.map(log => (
              <tr key={log.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                <td className="p-4">
                  <span style={{ color: theme.text.primary }}>{log.user}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm" style={{ color: theme.text.secondary }}>{log.action}</span>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span className="text-sm font-mono" style={{ color: theme.text.muted }}>{log.timestamp}</span>
                </td>
                <td className="p-4 hidden lg:table-cell">
                  <span className="text-sm font-mono" style={{ color: theme.text.muted }}>{log.ip}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
