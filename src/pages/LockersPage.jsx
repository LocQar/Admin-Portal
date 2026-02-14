import React from 'react';
import { Plus, Search, Grid3X3, Unlock, Package, AlertTriangle, ArrowUpRight, ArrowDownRight, Thermometer, Battery, BatteryWarning, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TableSkeleton } from '../components/ui';
import { StatusBadge } from '../components/ui/Badge';
import { hasPermission } from '../constants';
import { lockersData, terminalsData, getLockerAddress } from '../constants/mockData';

export const LockersPage = ({
  currentUser,
  activeSubMenu,
  loading,
  lockerSearch,
  setLockerSearch,
  lockerStatusFilter,
  setLockerStatusFilter,
  lockerTerminalFilter,
  setLockerTerminalFilter,
  lockerSizeFilter,
  setLockerSizeFilter,
  lockerSort,
  setLockerSort,
  filteredLockers,
  addToast,
}) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Locker Management</h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'All Lockers'}</p>
        </div>
        {hasPermission(currentUser.role, 'lockers.manage') && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}><Plus size={18} />Add Locker</button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          ['Total', lockersData.length, Grid3X3, null],
          ['Available', lockersData.filter(l => l.status === 'available').length, Unlock, '#10b981'],
          ['Occupied', lockersData.filter(l => l.status === 'occupied').length, Package, '#3b82f6'],
          ['Maintenance', lockersData.filter(l => l.status === 'maintenance').length, AlertTriangle, '#ef4444']
        ].map(([l, v, I, c]) => (
          <div key={l} className="p-5 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="flex justify-between">
              <div>
                <p className="text-sm" style={{ color: theme.text.muted }}>{l}</p>
                <p className="text-3xl font-bold mt-1" style={{ color: c || theme.text.primary }}>{v}</p>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: `${c || theme.accent.primary}15` }}><I size={24} style={{ color: c || theme.accent.primary }} /></div>
            </div>
          </div>
        ))}
      </div>

      {(!activeSubMenu || activeSubMenu === 'All Lockers') && (
        <div>
          {/* Search & Filters */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
                <input value={lockerSearch} onChange={e => setLockerSearch(e.target.value)} placeholder="Search lockers..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                {[['all', 'All'], ['available', 'Available'], ['occupied', 'Occupied'], ['reserved', 'Reserved'], ['maintenance', 'Maint.']].map(([val, label]) => (
                  <button key={val} onClick={() => setLockerStatusFilter(val)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: lockerStatusFilter === val ? theme.accent.primary : 'transparent', color: lockerStatusFilter === val ? '#fff' : theme.text.muted }}>{label}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                {[['all', 'All Terminals'], ...terminalsData.map(t => [t.name, t.name])].map(([val, label]) => (
                  <button key={val} onClick={() => setLockerTerminalFilter(val)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap" style={{ backgroundColor: lockerTerminalFilter === val ? theme.accent.primary : 'transparent', color: lockerTerminalFilter === val ? '#fff' : theme.text.muted }}>{label}</button>
                ))}
              </div>
              <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                {[['all', 'All Sizes'], ['small', 'Small'], ['medium', 'Medium'], ['large', 'Large'], ['xlarge', 'XLarge']].map(([val, label]) => (
                  <button key={val} onClick={() => setLockerSizeFilter(val)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: lockerSizeFilter === val ? theme.accent.primary : 'transparent', color: lockerSizeFilter === val ? '#fff' : theme.text.muted }}>{label}</button>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filteredLockers.length} of {lockersData.length} lockers</p>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            {loading ? <TableSkeleton rows={6} cols={8} theme={theme} /> : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    {[['id', 'ID'], ['terminal', 'Terminal'], ['size', 'Size', 'hidden md:table-cell'], ['status', 'Status'], ['package', 'Package', 'hidden lg:table-cell'], ['temp', 'Temp', 'hidden md:table-cell'], ['battery', 'Battery', 'hidden md:table-cell']].map(([field, label, hide]) => (
                      <th key={field} className={`text-left p-3 text-xs font-semibold uppercase cursor-pointer select-none ${hide || ''}`} style={{ color: lockerSort.field === field ? theme.accent.primary : theme.text.muted }} onClick={() => setLockerSort(prev => ({ field, dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc' }))}>
                        <span className="flex items-center gap-1">{label}{lockerSort.field === field && (lockerSort.dir === 'asc' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}</span>
                      </th>
                    ))}
                    <th className="text-right p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLockers.map(l => (
                    <tr key={l.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                      <td className="p-3">
                        <span className="font-mono font-bold" style={{ color: theme.text.primary }}>{l.id}</span>
                        <p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{getLockerAddress(l.id, l.terminal)}</p>
                      </td>
                      <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{l.terminal}</span></td>
                      <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{l.size}</span></td>
                      <td className="p-3"><StatusBadge status={l.status} /></td>
                      <td className="p-3 hidden lg:table-cell">{l.package ? <span className="text-sm font-mono" style={{ color: theme.accent.primary }}>{l.package}</span> : '—'}</td>
                      <td className="p-3 hidden md:table-cell">{l.temp ? <div className="flex items-center gap-1"><Thermometer size={14} style={{ color: theme.icon.muted }} /><span className="text-sm" style={{ color: theme.text.secondary }}>{l.temp}°C</span></div> : '—'}</td>
                      <td className="p-3 hidden md:table-cell">
                        <div className="flex items-center gap-2">
                          {l.battery < 20 ? <BatteryWarning size={14} className="text-red-500" /> : <Battery size={14} style={{ color: theme.icon.muted }} />}
                          <span className={`text-sm ${l.battery < 20 ? 'text-red-500' : ''}`} style={{ color: l.battery >= 20 ? theme.text.secondary : undefined }}>{l.battery}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => addToast({ type: 'success', message: `Locker ${l.id} opened` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Unlock size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeSubMenu === 'Maintenance' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>Lockers in Maintenance</h3>
            <p className="text-sm mt-1" style={{ color: theme.text.muted }}>Lockers currently offline or flagged for maintenance</p>
          </div>
          {loading ? <TableSkeleton rows={4} cols={6} theme={theme} /> : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>ID</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Terminal</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Size</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Battery</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Temp</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {lockersData.filter(l => l.status === 'maintenance' || l.battery < 20).map(l => (
                  <tr key={l.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <td className="p-3"><span className="font-mono font-bold" style={{ color: theme.text.primary }}>{l.id}</span></td>
                    <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{l.terminal}</span></td>
                    <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{l.size}</span></td>
                    <td className="p-3 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        {l.battery < 20 ? <BatteryWarning size={14} className="text-red-500" /> : <Battery size={14} style={{ color: theme.icon.muted }} />}
                        <span className={`text-sm ${l.battery < 20 ? 'text-red-500 font-semibold' : ''}`} style={{ color: l.battery >= 20 ? theme.text.secondary : undefined }}>{l.battery}%</span>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell">{l.temp ? <span className="text-sm" style={{ color: theme.text.secondary }}>{l.temp}°C</span> : '—'}</td>
                    <td className="p-3"><StatusBadge status={l.status === 'maintenance' ? 'maintenance' : 'low_battery'} /></td>
                  </tr>
                ))}
                {lockersData.filter(l => l.status === 'maintenance' || l.battery < 20).length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-sm" style={{ color: theme.text.muted }}>No lockers currently in maintenance</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeSubMenu === 'Configuration' && (
        <div className="space-y-4">
          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="flex items-center gap-3 mb-4">
              <Settings size={20} style={{ color: theme.accent.primary }} />
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Locker Timeout Settings</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[['Pickup Window', '48 hours', 'Time before package is flagged as expired'], ['Reservation Hold', '2 hours', 'Max time a locker stays reserved'], ['Maintenance Alert', '20%', 'Battery threshold for maintenance flag']].map(([label, value, desc]) => (
                <div key={label} className="p-4 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                  <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{label}</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: theme.accent.primary }}>{value}</p>
                  <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="flex items-center gap-3 mb-4">
              <Grid3X3 size={20} style={{ color: theme.accent.primary }} />
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Size Distribution by Terminal</h3>
            </div>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Terminal</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Small</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Medium</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Large</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>XLarge</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {terminalsData.map(t => {
                    const tLockers = lockersData.filter(l => l.terminal === t.name);
                    return (
                      <tr key={t.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                        <td className="p-3"><span className="text-sm font-medium" style={{ color: theme.text.primary }}>{t.name}</span></td>
                        <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{tLockers.filter(l => l.size === 'Small').length}</span></td>
                        <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{tLockers.filter(l => l.size === 'Medium').length}</span></td>
                        <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{tLockers.filter(l => l.size === 'Large').length}</span></td>
                        <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{tLockers.filter(l => l.size === 'XLarge').length}</span></td>
                        <td className="p-3"><span className="text-sm font-semibold" style={{ color: theme.text.primary }}>{tLockers.length}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
