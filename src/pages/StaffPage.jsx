import React, { useState, useMemo } from 'react';
import { UserPlus, Search, ArrowUpRight, ArrowDownRight, Edit, Key, Trash2, Users2, X, Eye, Phone, Mail, Star, CheckCircle, XCircle, LayoutGrid, List, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { RoleBadge, StatusBadge } from '../components/ui/Badge';
import { hasPermission, ROLES } from '../constants';
import { staffData, teamsData, terminalsData } from '../constants/mockData';

const SHIFTS = ['morning', 'afternoon', 'evening', 'night', 'flexible'];
const TEAMS = ['Management', 'Operations', 'Field', 'Support'];

const StaffDrawer = ({ staff, onClose, onSave, theme }) => {
  const isEdit = !!staff?.id;
  const [form, setForm] = useState(staff || {
    name: '', email: '', phone: '', role: 'AGENT', title: '', department: '', terminal: '', team: 'Field', shift: 'morning', status: 'active',
  });
  const [errors, setErrors] = useState({});
  const update = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim()) e.email = 'Required';
    if (!form.role) e.role = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const inputStyle = (f) => ({ backgroundColor: 'transparent', borderColor: errors[f] ? '#D48E8A' : theme.border.primary, color: theme.text.primary });
  const lbl = "text-xs font-semibold uppercase block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full sm:w-[460px] border-l shadow-2xl flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <div>
            <p className="text-xs" style={{ color: theme.text.muted }}>{isEdit ? 'EDIT STAFF' : 'NEW STAFF MEMBER'}</p>
            <h2 className="font-semibold" style={{ color: theme.text.primary }}>{isEdit ? staff.name : 'Add Staff'}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Full Name *</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Kofi Asante" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('name')} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Phone</label>
              <input value={form.phone || ''} onChange={e => update('phone', e.target.value)} placeholder="+233..." className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('phone')} />
            </div>
          </div>
          <div>
            <label className={lbl} style={{ color: theme.text.muted }}>Email *</label>
            <input value={form.email} onChange={e => update('email', e.target.value)} placeholder="kofi@locqar.com" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('email')} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Job Title</label>
              <input value={form.title || ''} onChange={e => update('title', e.target.value)} placeholder="e.g. Terminal Manager" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('title')} />
            </div>
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Department</label>
              <input value={form.department || ''} onChange={e => update('department', e.target.value)} placeholder="e.g. Operations" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('department')} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Role *</label>
              <select value={form.role} onChange={e => update('role', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: errors.role ? '#D48E8A' : theme.border.primary, color: theme.text.primary }}>
                {Object.entries(ROLES).map(([k, v]) => <option key={k} value={k.toUpperCase()}>{v.name}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Team</label>
              <select value={form.team || 'Field'} onChange={e => update('team', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Terminal</label>
              <select value={form.terminal || 'All'} onChange={e => update('terminal', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                <option value="All">All Terminals</option>
                {terminalsData.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Shift</label>
              <select value={form.shift || 'morning'} onChange={e => update('shift', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                {SHIFTS.map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={lbl} style={{ color: theme.text.muted }}>Status</label>
            <div className="flex gap-2">
              {[['active', 'Active', '#81C995'], ['inactive', 'Inactive', '#A8A29E']].map(([v, l, c]) => (
                <button key={v} onClick={() => update('status', v)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ backgroundColor: form.status === v ? `${c}15` : theme.bg.tertiary, color: form.status === v ? c : theme.text.secondary, border: `1px solid ${form.status === v ? `${c}40` : theme.border.primary}` }}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={() => { if (validate()) onSave(form); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
            {isEdit ? 'Save Changes' : 'Add Staff Member'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const StaffPage = ({
  currentUser, activeSubMenu, loading, addToast,
  // Props from App.jsx retained for compat but we use local state
  staffSearch: _staffSearch, setStaffSearch: _setStaffSearch,
  staffRoleFilter: _staffRoleFilter, setStaffRoleFilter: _setStaffRoleFilter,
  staffSort: _staffSort, setStaffSort: _setStaffSort,
  filteredStaff: _filteredStaff, setConfirmDialog,
}) => {
  const { theme } = useTheme();
  const [staff, setStaff] = useState(staffData);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [sort, setSort] = useState({ field: 'name', dir: 'asc' });
  const [drawer, setDrawer] = useState(null);
  const [viewStaff, setViewStaff] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [view, setView] = useState('list');

  const filteredStaff = useMemo(() => {
    let list = staff.filter(s => {
      const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase()) || (s.phone || '').includes(search);
      const matchRole = roleFilter === 'all' || s.role === roleFilter.toUpperCase();
      return matchSearch && matchRole;
    });
    list = [...list].sort((a, b) => {
      const av = a[sort.field] ?? '';
      const bv = b[sort.field] ?? '';
      return sort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
    return list;
  }, [staff, search, roleFilter, sort]);

  const handleSave = (form) => {
    if (form.id) {
      setStaff(prev => prev.map(s => s.id === form.id ? { ...s, ...form } : s));
      addToast?.({ type: 'success', message: `${form.name} updated` });
    } else {
      const newMember = { ...form, id: Date.now(), performance: 80, lastActive: 'Just added', packagesHandled: 0, tasksCompleted: 0, totalLogins: 0, ticketsResolved: 0, avatar: form.name.charAt(0), joinDate: new Date().toISOString().slice(0, 10) };
      setStaff(prev => [newMember, ...prev]);
      addToast?.({ type: 'success', message: `${form.name} added to staff` });
    }
    setDrawer(null);
  };

  const handleDelete = (member) => {
    setStaff(prev => prev.filter(s => s.id !== member.id));
    addToast?.({ type: 'warning', message: `${member.name} removed` });
    setDeleteConfirm(null);
    if (viewStaff?.id === member.id) setViewStaff(null);
  };

  const handleResetPassword = (member) => {
    addToast?.({ type: 'success', message: `Password reset sent to ${member.email}` });
  };

  const sortFn = (field) => setSort(prev => ({ field, dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc' }));

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Staff Management</h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Agents'}</p>
        </div>
        {hasPermission(currentUser?.role, 'staff.manage') && (!activeSubMenu || activeSubMenu === 'Agents') && (
          <button onClick={() => setDrawer({})} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
            <UserPlus size={18} /> Add Staff
          </button>
        )}
      </div>

      {(!activeSubMenu || activeSubMenu === 'Agents') && (
        <>
          {/* Role summary cards */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Object.values(ROLES).map(r => (
              <button key={r.id} onClick={() => setRoleFilter(roleFilter === r.id ? 'all' : r.id)} className="p-3 rounded-xl border transition-all" style={{ backgroundColor: roleFilter === r.id ? `${r.color}15` : theme.bg.card, borderColor: roleFilter === r.id ? `${r.color}40` : theme.border.primary }}>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                  <span className="text-xs truncate" style={{ color: theme.text.muted }}>{r.name}</span>
                </div>
                <p className="text-2xl font-bold" style={{ color: roleFilter === r.id ? r.color : theme.text.primary }}>
                  {staff.filter(s => s.role === r.id.toUpperCase()).length}
                </p>
              </button>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border flex-1" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <Search size={16} style={{ color: theme.icon.muted }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email, phone..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: theme.text.primary }} />
              {search && <button onClick={() => setSearch('')} style={{ color: theme.text.muted }}><X size={16} /></button>}
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
              {[['all', 'All'], ['active', 'Active'], ['inactive', 'Inactive']].map(([v, l]) => (
                <button key={v} onClick={() => { if (v === 'all') setRoleFilter('all'); }} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: theme.bg.card + '00', color: theme.text.muted }}>
                  {/* status filter placeholder - role filter handled by cards above */}
                  {l}
                </button>
              ))}
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
              {[['grid', LayoutGrid], ['list', List]].map(([v, Icon]) => (
                <button key={v} onClick={() => setView(v)}
                  className="p-1.5 rounded-lg transition-all"
                  title={v === 'grid' ? 'Grid view' : 'List view'}
                  style={{ backgroundColor: view === v ? theme.accent.primary : 'transparent', color: view === v ? theme.accent.contrast : theme.text.muted }}>
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs" style={{ color: theme.text.muted }}>{filteredStaff.length} of {staff.length} staff</p>

          {/* Grid View */}
          {view === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredStaff.map(s => (
                <div key={s.id} onClick={() => setViewStaff(s)} className="p-4 rounded-2xl border cursor-pointer group hover:border-opacity-80 transition-all space-y-3" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0" style={{ backgroundColor: ROLES[s.role.toLowerCase()]?.color ? `${ROLES[s.role.toLowerCase()]?.color}20` : theme.bg.tertiary, color: ROLES[s.role.toLowerCase()]?.color || theme.accent.primary }}>{s.name.charAt(0)}</div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>{s.name}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{s.title ?? s.role}</p>
                      </div>
                    </div>
                    <StatusBadge status={s.status} />
                  </div>
                  <div className="space-y-1 text-xs" style={{ color: theme.text.secondary }}>
                    {s.department && <p><span style={{ color: theme.text.muted }}>Dept: </span>{s.department}</p>}
                    <p><span style={{ color: theme.text.muted }}>Terminal: </span>{s.terminal || '—'}</p>
                    <p><span style={{ color: theme.text.muted }}>Email: </span><span className="truncate">{s.email}</span></p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: theme.border.primary }}>
                    <RoleBadge role={s.role} />
                    <div className="flex items-center gap-1.5">
                      <div className="w-12 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.border.primary }}>
                        <div className="h-full rounded-full" style={{ width: `${s.performance}%`, backgroundColor: s.performance > 90 ? '#81C995' : s.performance > 75 ? '#D4AA5A' : '#D48E8A' }} />
                      </div>
                      <span className="text-xs" style={{ color: theme.text.muted }}>{s.performance}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setViewStaff(s)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }} title="View"><Eye size={14} /></button>
                    {hasPermission(currentUser?.role, 'staff.manage') && (
                      <>
                        <button onClick={() => setDrawer(s)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.accent.primary }} title="Edit"><Edit size={14} /></button>
                        <button onClick={() => handleResetPassword(s)} className="p-1.5 rounded-lg hover:bg-white/5 text-amber-400" title="Reset Password"><Key size={14} /></button>
                        <button onClick={() => setDeleteConfirm(s)} className="p-1.5 rounded-lg hover:bg-white/5 text-red-400" title="Remove"><Trash2 size={14} /></button>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {filteredStaff.length === 0 && <p className="col-span-full text-center py-10 text-sm" style={{ color: theme.text.muted }}>No staff found</p>}
            </div>
          )}

          {/* List/Table View */}
          {view === 'list' && <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    {[['name', 'Staff'], ['title', 'Title', 'hidden md:table-cell'], ['role', 'Role'], ['team', 'Team', 'hidden md:table-cell'], ['terminal', 'Terminal', 'hidden lg:table-cell'], ['performance', 'Performance', 'hidden lg:table-cell'], ['status', 'Status']].map(([field, label, hide]) => (
                      <th key={field} onClick={() => sortFn(field)} className={`text-left p-4 text-xs font-semibold uppercase cursor-pointer select-none ${hide || ''}`} style={{ color: sort.field === field ? theme.accent.primary : theme.text.muted }}>
                        <span className="flex items-center gap-1">{label}{sort.field === field && (sort.dir === 'asc' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}</span>
                      </th>
                    ))}
                    <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map(s => (
                    <tr key={s.id} className="hover:bg-white/5 cursor-pointer" style={{ borderBottom: `1px solid ${theme.border.primary}` }} onClick={() => setViewStaff(s)}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0" style={{ backgroundColor: ROLES[s.role.toLowerCase()]?.color ? `${ROLES[s.role.toLowerCase()]?.color}20` : theme.bg.tertiary, color: ROLES[s.role.toLowerCase()]?.color || theme.accent.primary }}>
                            {s.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{s.name}</p>
                            <p className="text-xs" style={{ color: theme.text.muted }}>{s.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="text-sm" style={{ color: theme.text.secondary }}>{s.title ?? '—'}</p>
                        {s.department && <p className="text-xs" style={{ color: theme.text.muted }}>{s.department}</p>}
                      </td>
                      <td className="p-4"><RoleBadge role={s.role} /></td>
                      <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{s.team}</span></td>
                      <td className="p-4 hidden lg:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{s.terminal}</span></td>
                      <td className="p-4 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.border.primary }}>
                            <div className="h-full rounded-full" style={{ width: `${s.performance}%`, backgroundColor: s.performance > 90 ? '#81C995' : s.performance > 75 ? '#D4AA5A' : '#D48E8A' }} />
                          </div>
                          <span className="text-xs" style={{ color: theme.text.muted }}>{s.performance}%</span>
                        </div>
                      </td>
                      <td className="p-4"><StatusBadge status={s.status} /></td>
                      <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setViewStaff(s)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }} title="View"><Eye size={15} /></button>
                          {hasPermission(currentUser?.role, 'staff.manage') && (
                            <>
                              <button onClick={() => setDrawer(s)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.accent.primary }} title="Edit"><Edit size={15} /></button>
                              <button onClick={() => handleResetPassword(s)} className="p-1.5 rounded-lg hover:bg-white/5 text-amber-400" title="Reset Password"><Key size={15} /></button>
                              <button onClick={() => setDeleteConfirm(s)} className="p-1.5 rounded-lg hover:bg-white/5 text-red-400" title="Remove"><Trash2 size={15} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredStaff.length === 0 && (
                    <tr><td colSpan={7} className="p-10 text-center text-sm" style={{ color: theme.text.muted }}>No staff found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>}
        </>
      )}

      {activeSubMenu === 'Teams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {teamsData.map(t => (
            <div key={t.id} className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${t.color}15` }}>
                    <Users2 size={20} style={{ color: t.color }} />
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: theme.text.primary }}>{t.name}</p>
                    <p className="text-sm" style={{ color: theme.text.muted }}>Lead: {t.lead}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold" style={{ color: t.color }}>{t.members}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>members</p>
                </div>
              </div>
              <p className="text-sm mb-3" style={{ color: theme.text.muted }}>{t.description}</p>
              <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: theme.border.primary }}>
                <div>
                  <p className="text-xs" style={{ color: theme.text.muted }}>Avg Performance</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-sm font-semibold" style={{ color: theme.text.primary }}>{t.avgPerformance}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs" style={{ color: theme.text.muted }}>Active Projects</p>
                  <p className="text-sm font-semibold text-right mt-0.5" style={{ color: theme.text.primary }}>{t.activeProjects}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubMenu === 'Performance' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>Performance Overview</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Staff</th>
                <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Role</th>
                <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Packages</th>
                <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Tasks</th>
                <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Performance</th>
                <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Avg Response</th>
                <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Last Active</th>
              </tr>
            </thead>
            <tbody>
              {[...staff].sort((a, b) => b.performance - a.performance).map(s => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: `${ROLES[s.role.toLowerCase()]?.color || theme.accent.primary}20`, color: ROLES[s.role.toLowerCase()]?.color || theme.accent.primary }}>{s.name.charAt(0)}</div>
                      <span className="text-sm" style={{ color: theme.text.primary }}>{s.name}</span>
                    </div>
                  </td>
                  <td className="p-4"><RoleBadge role={s.role} /></td>
                  <td className="p-4 hidden md:table-cell"><span className="text-sm font-medium" style={{ color: theme.text.primary }}>{s.packagesHandled?.toLocaleString()}</span></td>
                  <td className="p-4 hidden md:table-cell"><span className="text-sm font-medium" style={{ color: theme.text.primary }}>{s.tasksCompleted}</span></td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.border.primary }}>
                        <div className="h-full rounded-full" style={{ width: `${s.performance}%`, backgroundColor: s.performance > 90 ? '#81C995' : s.performance > 75 ? '#D4AA5A' : '#D48E8A' }} />
                      </div>
                      <span className="text-sm font-semibold" style={{ color: s.performance > 90 ? '#81C995' : s.performance > 75 ? '#D4AA5A' : '#D48E8A' }}>{s.performance}%</span>
                    </div>
                  </td>
                  <td className="p-4 hidden lg:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{s.avgResponseTime}</span></td>
                  <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{s.lastActive}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      {/* View Profile Drawer */}
      {viewStaff && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewStaff(null)} />
          <div className="absolute inset-y-0 right-0 w-full sm:w-[400px] border-l shadow-2xl flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
              <p className="font-semibold" style={{ color: theme.text.primary }}>Staff Profile</p>
              <div className="flex items-center gap-2">
                <button onClick={() => { setDrawer(viewStaff); setViewStaff(null); }} className="px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Edit</button>
                <button onClick={() => setViewStaff(null)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><X size={18} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: `${theme.accent.primary}20`, color: theme.accent.primary }}>{viewStaff.name.charAt(0)}</div>
                <div>
                  <p className="text-lg font-bold" style={{ color: theme.text.primary }}>{viewStaff.name}</p>
                  {viewStaff.title && <p className="text-sm font-medium" style={{ color: theme.text.secondary }}>{viewStaff.title}</p>}
                  <RoleBadge role={viewStaff.role} />
                  <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{viewStaff.department ?? viewStaff.team} · {viewStaff.terminal}</p>
                </div>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                {[['Packages', viewStaff.packagesHandled?.toLocaleString(), theme.accent.primary], ['Tasks', viewStaff.tasksCompleted, '#81C995'], ['Tickets', viewStaff.ticketsResolved, '#B5A0D1']].map(([l, v, c]) => (
                  <div key={l} className="p-3 rounded-xl border text-center" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                    <p className="text-lg font-bold mt-0.5" style={{ color: c }}>{v}</p>
                  </div>
                ))}
              </div>
              {/* Details */}
              <div className="space-y-2">
                {[['Job Title', viewStaff.title || '—'], ['Department', viewStaff.department || viewStaff.team || '—'], ['Email', viewStaff.email], ['Phone', viewStaff.phone || '—'], ['Shift', viewStaff.shift], ['Joined', viewStaff.joinDate], ['Last Active', viewStaff.lastActive], ['Avg Response', viewStaff.avgResponseTime]].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: theme.border.primary }}>
                    <span className="text-xs" style={{ color: theme.text.muted }}>{l}</span>
                    <span className="text-sm" style={{ color: theme.text.primary }}>{v}</span>
                  </div>
                ))}
              </div>
              {/* Performance bar */}
              <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold" style={{ color: theme.text.muted }}>Performance</p>
                  <p className="text-sm font-bold" style={{ color: viewStaff.performance > 90 ? '#81C995' : viewStaff.performance > 75 ? '#D4AA5A' : '#D48E8A' }}>{viewStaff.performance}%</p>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                  <div className="h-full rounded-full" style={{ width: `${viewStaff.performance}%`, backgroundColor: viewStaff.performance > 90 ? '#81C995' : viewStaff.performance > 75 ? '#D4AA5A' : '#D48E8A' }} />
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
              <button onClick={() => { handleResetPassword(viewStaff); }} className="flex-1 py-2.5 rounded-xl border text-xs" style={{ borderColor: theme.border.primary, color: '#D4AA5A' }}><Key size={14} className="inline mr-1" />Reset Password</button>
              {hasPermission(currentUser?.role, 'staff.manage') && (
                <button onClick={() => { setDeleteConfirm(viewStaff); setViewStaff(null); }} className="py-2.5 px-4 rounded-xl border text-sm text-red-400" style={{ borderColor: '#D48E8A40' }}><Trash2 size={15} /></button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-sm rounded-2xl border p-6 space-y-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>Remove Staff Member?</h3>
            <p className="text-sm" style={{ color: theme.text.muted }}>Permanently remove <span className="font-semibold" style={{ color: theme.text.primary }}>{deleteConfirm.name}</span>? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: '#D48E8A', color: '#fff' }}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Drawer (reuse) */}
      {drawer !== null && <StaffDrawer staff={drawer?.id ? drawer : null} onClose={() => setDrawer(null)} onSave={handleSave} theme={theme} />}
    </div>
  );
};
