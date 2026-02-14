import React, { useState, useMemo } from 'react';
import { Plus, Search, Grid3X3, Unlock, Package, Wrench, TrendingUp, Building2, MapPin, X, Clock, Activity, BarChart3, Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { StatusBadge } from '../components/ui/Badge';
import { hasPermission } from '../constants';
import { terminalsData, phonePinData, getTerminalAddress, lockersData, packagesData } from '../constants/mockData';

export const TerminalsPage = ({
  currentUser,
  terminalSearch,
  setTerminalSearch,
  terminalStatusFilter,
  setTerminalStatusFilter,
  filteredTerminals,
}) => {
  const { theme } = useTheme();
  const [selectedTerminal, setSelectedTerminal] = useState(null);

  const terminalDetails = useMemo(() => {
    if (!selectedTerminal) return null;
    const lockers = lockersData.filter(l => l.terminal === selectedTerminal.name);
    const packages = packagesData.filter(p => p.destination === selectedTerminal.name);
    const pinnedUsers = phonePinData.filter(p => p.pinnedTerminal === selectedTerminal.name);
    return { lockers, packages, pinnedUsers };
  }, [selectedTerminal]);

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Terminals</h1>
          <p style={{ color: theme.text.muted }}>{terminalsData.length} terminals &bull; {terminalsData.filter(t => t.status === 'online').length} online</p>
        </div>
        {hasPermission(currentUser.role, 'terminals.manage') && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}><Plus size={18} />Add Terminal</button>
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
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
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
            <div
              key={t.id}
              onClick={() => setSelectedTerminal(t)}
              className="p-5 rounded-2xl border cursor-pointer hover:border-opacity-60 transition-all"
              style={{ backgroundColor: theme.bg.card, borderColor: selectedTerminal?.id === t.id ? theme.accent.primary : theme.border.primary }}
            >
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

      {/* Terminal Detail Drawer */}
      {selectedTerminal && terminalDetails && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setSelectedTerminal(null)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="relative w-full max-w-lg h-full overflow-y-auto p-6"
            style={{ backgroundColor: theme.bg.primary }}
            onClick={e => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${theme.accent.primary}15` }}>
                  <Building2 size={24} style={{ color: theme.accent.primary }} />
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>{selectedTerminal.name}</h2>
                  <p className="text-sm font-mono" style={{ color: theme.accent.primary }}>{getTerminalAddress(selectedTerminal)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTerminal(null)} className="p-2 rounded-xl" style={{ color: theme.text.muted }}><X size={20} /></button>
            </div>

            {/* Status & Location */}
            <div className="p-4 rounded-xl border mb-4" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium" style={{ color: theme.text.primary }}>Status</span>
                <StatusBadge status={selectedTerminal.status} />
              </div>
              <div className="space-y-2 text-sm">
                {[
                  ['Location', selectedTerminal.location],
                  ['Region', selectedTerminal.region],
                  ['Terminal ID', selectedTerminal.id],
                  ['Coordinates', `${selectedTerminal.lat}, ${selectedTerminal.lng}`],
                  ['Pinned Users', `${terminalDetails.pinnedUsers.length} customers`],
                ].map(([l, v]) => (
                  <div key={l} className="flex justify-between">
                    <span style={{ color: theme.text.muted }}>{l}</span>
                    <span className="font-medium" style={{ color: theme.text.primary }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Locker Breakdown */}
            <div className="p-4 rounded-xl border mb-4" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
              <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text.primary }}>Locker Breakdown</h3>
              <div className="grid grid-cols-4 gap-3 text-center mb-4">
                {[['Total', selectedTerminal.totalLockers, null], ['Available', selectedTerminal.available, '#10b981'], ['Occupied', selectedTerminal.occupied, '#3b82f6'], ['Maint.', selectedTerminal.maintenance, '#ef4444']].map(([l, v, c]) => (
                  <div key={l} className="p-3 rounded-xl" style={{ backgroundColor: c ? `${c}10` : theme.bg.tertiary }}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                    <p className="text-xl font-bold" style={{ color: c || theme.text.primary }}>{v}</p>
                  </div>
                ))}
              </div>
              {/* Size Distribution */}
              <h4 className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>Size Distribution (estimated)</h4>
              <div className="space-y-2">
                {[
                  { label: 'Small', pct: 30, color: '#10b981' },
                  { label: 'Medium', pct: 35, color: '#3b82f6' },
                  { label: 'Large', pct: 25, color: '#8b5cf6' },
                  { label: 'XLarge', pct: 10, color: '#f59e0b' },
                ].map(s => {
                  const count = Math.floor(selectedTerminal.totalLockers * s.pct / 100);
                  return (
                    <div key={s.label} className="flex items-center gap-3">
                      <span className="text-xs w-14" style={{ color: theme.text.secondary }}>{s.label}</span>
                      <div className="flex-1 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                        <div className="h-full rounded-full" style={{ width: `${s.pct}%`, backgroundColor: s.color }} />
                      </div>
                      <span className="text-xs font-mono w-8 text-right" style={{ color: theme.text.muted }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Lockers at this Terminal */}
            {terminalDetails.lockers.length > 0 && (
              <div className="p-4 rounded-xl border mb-4" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text.primary }}>Tracked Lockers ({terminalDetails.lockers.length})</h3>
                <div className="space-y-2">
                  {terminalDetails.lockers.map(l => (
                    <div key={l.id} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm" style={{ color: theme.text.primary }}>{l.id}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{
                          backgroundColor: l.status === 'available' ? '#10b98115' : l.status === 'occupied' ? '#3b82f615' : l.status === 'reserved' ? '#f59e0b15' : '#ef444415',
                          color: l.status === 'available' ? '#10b981' : l.status === 'occupied' ? '#3b82f6' : l.status === 'reserved' ? '#f59e0b' : '#ef4444'
                        }}>{l.status}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs" style={{ color: theme.text.muted }}>
                        <span>{l.size}</span>
                        {l.temp && <span>{l.temp}°C</span>}
                        <span>{l.battery}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Active Packages at this Terminal */}
            {terminalDetails.packages.length > 0 && (
              <div className="p-4 rounded-xl border mb-4" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text.primary }}>Packages ({terminalDetails.packages.length})</h3>
                <div className="space-y-2">
                  {terminalDetails.packages.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                      <div>
                        <span className="font-mono text-sm font-medium" style={{ color: theme.text.primary }}>{p.waybill}</span>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{p.customer}</p>
                      </div>
                      <StatusBadge status={p.status} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pinned Users */}
            {terminalDetails.pinnedUsers.length > 0 && (
              <div className="p-4 rounded-xl border" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
                <h3 className="text-sm font-semibold mb-3" style={{ color: theme.text.primary }}>Pinned Users ({terminalDetails.pinnedUsers.length})</h3>
                <div className="space-y-2">
                  {terminalDetails.pinnedUsers.map((u, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{u.customer}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{u.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{u.pinnedAddress}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>Since {u.pinnedAt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
