import React from 'react';
import { Plus, Search, Grid3X3, Unlock, Package, Wrench, TrendingUp, Building2, MapPin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { StatusBadge } from '../components/ui/Badge';
import { hasPermission } from '../constants';
import { terminalsData, phonePinData, getTerminalAddress } from '../constants/mockData';

export const TerminalsPage = ({
  currentUser,
  terminalSearch,
  setTerminalSearch,
  terminalStatusFilter,
  setTerminalStatusFilter,
  filteredTerminals,
}) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Terminals</h1>
          <p style={{ color: theme.text.muted }}>{terminalsData.length} terminals &bull; {terminalsData.filter(t => t.status === 'online').length} online</p>
        </div>
        {hasPermission(currentUser.role, 'terminals.manage') && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Plus size={18} />Add Terminal</button>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          ['Total Lockers', terminalsData.reduce((s, t) => s + t.totalLockers, 0), Grid3X3, null],
          ['Available', terminalsData.reduce((s, t) => s + t.available, 0), Unlock, '#10b981'],
          ['Occupied', terminalsData.reduce((s, t) => s + t.occupied, 0), Package, '#3b82f6'],
          ['Maintenance', terminalsData.reduce((s, t) => s + t.maintenance, 0), Wrench, '#ef4444'],
          ['Utilization', `${Math.round(terminalsData.reduce((s, t) => s + t.occupied, 0) / terminalsData.reduce((s, t) => s + t.totalLockers, 0) * 100)}%`, TrendingUp, '#8b5cf6'],
        ].map(([l, v, I, c]) => (
          <div key={l} className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="flex items-center gap-2 mb-1">
              <I size={16} style={{ color: c || theme.accent.primary }} />
              <span className="text-xs" style={{ color: theme.text.muted }}>{l}</span>
            </div>
            <p className="text-2xl font-bold" style={{ color: c || theme.text.primary }}>{v}</p>
          </div>
        ))}
      </div>
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.muted }} />
          <input value={terminalSearch} onChange={e => setTerminalSearch(e.target.value)} placeholder="Search terminals..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
          {[['all', 'All'], ['online', 'Online'], ['maintenance', 'Maintenance']].map(([val, label]) => (
            <button key={val} onClick={() => setTerminalStatusFilter(val)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: terminalStatusFilter === val ? theme.accent.primary : 'transparent', color: terminalStatusFilter === val ? '#fff' : theme.text.muted }}>{label}</button>
          ))}
        </div>
      </div>
      <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filteredTerminals.length} of {terminalsData.length} terminals</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTerminals.map(t => {
          const utilPct = Math.round(t.occupied / t.totalLockers * 100);
          return (
            <div key={t.id} className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${theme.accent.primary}15` }}>
                    <Building2 size={20} style={{ color: theme.accent.primary }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: theme.text.primary }}>{t.name}</p>
                    <p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{getTerminalAddress(t)}</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: theme.text.muted }}><MapPin size={12} />{t.location} &bull; {phonePinData.filter(p => p.pinnedTerminal === t.name).length} pinned users</p>
                  </div>
                </div>
                <StatusBadge status={t.status} />
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: theme.text.muted }}>Utilization</span>
                  <span className="text-xs font-medium" style={{ color: utilPct > 80 ? '#ef4444' : utilPct > 60 ? '#f59e0b' : '#10b981' }}>{utilPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${utilPct}%`, backgroundColor: utilPct > 80 ? '#ef4444' : utilPct > 60 ? '#f59e0b' : '#10b981' }} />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {[['Total', t.totalLockers, null], ['Open', t.available, '#10b981'], ['In Use', t.occupied, '#3b82f6'], ['Maint.', t.maintenance, '#ef4444']].map(([l, v, c]) => (
                  <div key={l} className="p-2 rounded-lg" style={{ backgroundColor: c ? `${c}10` : theme.bg.tertiary }}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                    <p className="text-lg font-bold" style={{ color: c || theme.text.primary }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
