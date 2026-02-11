import React from 'react';
import { UserPlus, Search, ArrowUpRight, ArrowDownRight, Edit, Key, Trash2, Users2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TableSkeleton } from '../components/ui';
import { RoleBadge, StatusBadge } from '../components/ui/Badge';
import { hasPermission, ROLES } from '../constants';
import { staffData, teamsData } from '../constants/mockData';

export const StaffPage = ({
  currentUser,
  activeSubMenu,
  loading,
  staffSearch,
  setStaffSearch,
  staffRoleFilter,
  setStaffRoleFilter,
  staffSort,
  setStaffSort,
  filteredStaff,
}) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Staff Management</h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Agents'}</p>
        </div>
        {hasPermission(currentUser.role, 'staff.manage') && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><UserPlus size={18} />Add Staff</button>
        )}
      </div>

      {(!activeSubMenu || activeSubMenu === 'Agents') && (
        <>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
            {Object.values(ROLES).map(r => (
              <div key={r.id} className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-xs" style={{ color: theme.text.muted }}>{r.name}</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{staffData.filter(s => s.role === r.id.toUpperCase()).length}</p>
              </div>
            ))}
          </div>
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.muted }} />
              <input value={staffSearch} onChange={e => setStaffSearch(e.target.value)} placeholder="Search staff..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
            </div>
            <div className="flex gap-1 p-1 rounded-xl flex-wrap" style={{ backgroundColor: theme.bg.tertiary }}>
              {[['all', 'All'], ...Object.entries(ROLES).map(([k, v]) => [k, v.name])].map(([val, label]) => (
                <button key={val} onClick={() => setStaffRoleFilter(val)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: staffRoleFilter === val ? theme.accent.primary : 'transparent', color: staffRoleFilter === val ? '#fff' : theme.text.muted }}>{label}</button>
              ))}
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filteredStaff.length} of {staffData.length} staff</p>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            {loading ? <TableSkeleton rows={6} cols={6} theme={theme} /> : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    {[['name', 'Staff'], ['role', 'Role'], ['team', 'Team', 'hidden md:table-cell'], ['terminal', 'Terminal', 'hidden lg:table-cell'], ['status', 'Status']].map(([field, label, hide]) => (
                      <th key={field} className={`text-left p-4 text-xs font-semibold uppercase cursor-pointer select-none ${hide || ''}`} style={{ color: staffSort.field === field ? theme.accent.primary : theme.text.muted }} onClick={() => setStaffSort(prev => ({ field, dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc' }))}>
                        <span className="flex items-center gap-1">{label}{staffSort.field === field && (staffSort.dir === 'asc' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}</span>
                      </th>
                    ))}
                    <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map(s => (
                    <tr key={s.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: ROLES[s.role]?.color }}>{s.name.charAt(0)}</div>
                          <div>
                            <p style={{ color: theme.text.primary }}>{s.name}</p>
                            <p className="text-sm" style={{ color: theme.text.muted }}>{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4"><RoleBadge role={s.role} /></td>
                      <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{s.team}</span></td>
                      <td className="p-4 hidden lg:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{s.terminal}</span></td>
                      <td className="p-4"><StatusBadge status={s.status} /></td>
                      <td className="p-4 text-right">
                        {hasPermission(currentUser.role, 'staff.manage') && (
                          <>
                            <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Edit size={16} /></button>
                            <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Key size={16} /></button>
                            <button className="p-2 rounded-lg hover:bg-white/5 text-red-500"><Trash2 size={16} /></button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {activeSubMenu === 'Teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamsData.map(t => (
            <div key={t.id} className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${t.color}15` }}>
                  <Users2 size={20} style={{ color: t.color }} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: theme.text.primary }}>{t.name}</p>
                  <p className="text-sm" style={{ color: theme.text.muted }}>Lead: {t.lead}</p>
                </div>
              </div>
              <p className="text-3xl font-bold" style={{ color: t.color }}>{t.members}</p>
              <p className="text-sm" style={{ color: theme.text.muted }}>members</p>
            </div>
          ))}
        </div>
      )}

      {activeSubMenu === 'Performance' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Staff</th>
                <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Role</th>
                <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Performance</th>
                <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {staffData.map(s => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: ROLES[s.role]?.color }}>{s.name.charAt(0)}</div>
                      <span style={{ color: theme.text.primary }}>{s.name}</span>
                    </div>
                  </td>
                  <td className="p-4"><RoleBadge role={s.role} /></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                        <div className="h-full rounded-full" style={{ width: `${s.performance}%`, backgroundColor: s.performance > 90 ? '#10b981' : s.performance > 75 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span className="text-sm" style={{ color: theme.text.secondary }}>{s.performance}%</span>
                    </div>
                  </td>
                  <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{s.lastActive}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
