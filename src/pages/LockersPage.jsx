import React, { useState, useMemo } from 'react';
import { Plus, Search, Grid3X3, Unlock, Package, AlertTriangle, ArrowUpRight, ArrowDownRight, Thermometer, Battery, BatteryWarning, Settings, DoorOpen, DoorClosed, X, Trash2, Edit, Eye, Wrench, CheckCircle, ToggleLeft, ToggleRight, LayoutGrid, List, ChevronDown, ChevronUp, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { StatusBadge } from '../components/ui/Badge';
import { hasPermission, DOOR_SIZES } from '../constants';
import { lockersData, terminalsData, getLockerAddress } from '../constants/mockData';

const LOCKER_STATUSES = ['available', 'occupied', 'reserved', 'maintenance'];
const SIZE_LABELS = ['Small', 'Medium', 'Large', 'XLarge'];

const LockerDrawer = ({ locker, onClose, onSave, theme }) => {
  const isEdit = !!locker?.id;
  const [form, setForm] = useState(locker || { terminal: '', doorNo: '', sizeLabel: 'Medium', status: 'available', enabled: 1, temp: 24, battery: 100 });
  const [errors, setErrors] = useState({});
  const update = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.terminal) e.terminal = 'Required';
    if (!form.doorNo && !isEdit) e.doorNo = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const inputStyle = (f) => ({ backgroundColor: 'transparent', borderColor: errors[f] ? '#D48E8A' : theme.border.primary, color: theme.text.primary });
  const lbl = "text-xs font-semibold uppercase block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full sm:w-[440px] border-l shadow-2xl flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <div>
            <p className="text-xs" style={{ color: theme.text.muted }}>{isEdit ? 'EDIT LOCKER' : 'ADD LOCKER'}</p>
            <h2 className="font-semibold" style={{ color: theme.text.primary }}>{isEdit ? locker.id : 'New Locker'}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Terminal *</label>
              <select value={form.terminal} onChange={e => update('terminal', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: errors.terminal ? '#D48E8A' : theme.border.primary, color: theme.text.primary }}>
                <option value="">Select terminal</option>
                {terminalsData.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
              {errors.terminal && <p className="text-xs text-red-500 mt-1">{errors.terminal}</p>}
            </div>
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Door # {!isEdit && '*'}</label>
              <input type="number" value={form.doorNo} onChange={e => update('doorNo', e.target.value)} placeholder="e.g. 12" disabled={isEdit} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ ...inputStyle('doorNo'), opacity: isEdit ? 0.5 : 1 }} />
              {errors.doorNo && <p className="text-xs text-red-500 mt-1">{errors.doorNo}</p>}
            </div>
          </div>

          <div>
            <label className={lbl} style={{ color: theme.text.muted }}>Size</label>
            <div className="grid grid-cols-4 gap-2">
              {SIZE_LABELS.map(s => (
                <button key={s} onClick={() => update('sizeLabel', s)} className="py-2.5 rounded-xl text-sm border text-center" style={{ backgroundColor: form.sizeLabel === s ? theme.accent.light : theme.bg.tertiary, color: form.sizeLabel === s ? theme.accent.primary : theme.text.secondary, borderColor: form.sizeLabel === s ? theme.accent.border : theme.border.primary }}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <label className={lbl} style={{ color: theme.text.muted }}>Status</label>
            <div className="grid grid-cols-2 gap-2">
              {[['available', '#81C995'], ['occupied', '#7EA8C9'], ['reserved', '#D4AA5A'], ['maintenance', '#D48E8A']].map(([s, c]) => (
                <button key={s} onClick={() => update('status', s)} className="py-2.5 rounded-xl text-sm capitalize" style={{ backgroundColor: form.status === s ? `${c}15` : theme.bg.tertiary, color: form.status === s ? c : theme.text.muted, border: `1px solid ${form.status === s ? `${c}40` : theme.border.primary}` }}>{s}</button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Temperature (°C)</label>
              <input type="number" value={form.temp || ''} onChange={e => update('temp', parseInt(e.target.value))} placeholder="24" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('temp')} />
            </div>
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Battery (%)</label>
              <input type="number" min="0" max="100" value={form.battery || ''} onChange={e => update('battery', parseInt(e.target.value))} placeholder="100" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('battery')} />
            </div>
          </div>

          <div>
            <label className={lbl} style={{ color: theme.text.muted }}>Enabled</label>
            <div className="flex gap-2">
              {[[1, 'Enabled', '#81C995'], [0, 'Disabled', '#A8A29E']].map(([v, l, c]) => (
                <button key={v} onClick={() => update('enabled', v)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ backgroundColor: form.enabled === v ? `${c}15` : theme.bg.tertiary, color: form.enabled === v ? c : theme.text.muted, border: `1px solid ${form.enabled === v ? `${c}40` : theme.border.primary}` }}>{l}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={() => { if (validate()) onSave(form); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
            {isEdit ? 'Save Changes' : 'Add Locker'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const LockersPage = ({
  currentUser, activeSubMenu, loading,
  lockerSearch: _ls, setLockerSearch: _sls,
  lockerStatusFilter: _lsf, setLockerStatusFilter: _slsf,
  lockerTerminalFilter: _ltf, setLockerTerminalFilter: _sltf,
  lockerSizeFilter: _lszf, setLockerSizeFilter: _slszf,
  lockerSort: _lsort, setLockerSort: _slsort,
  filteredLockers: _fl,
  addToast, onOpenLocker,
}) => {
  const { theme } = useTheme();
  const [lockers, setLockers] = useState(lockersData);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [terminalFilter, setTerminalFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [sort, setSort] = useState({ field: 'id', dir: 'asc' });
  const [drawer, setDrawer] = useState(null);
  const [viewLocker, setViewLocker] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [expandedTerminals, setExpandedTerminals] = useState({});

  const filteredLockers = useMemo(() => {
    return lockers.filter(l => {
      const matchSearch = !search || l.id.toLowerCase().includes(search.toLowerCase()) || l.terminal.toLowerCase().includes(search.toLowerCase()) || (l.package || '').toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || l.status === statusFilter;
      const matchTerminal = terminalFilter === 'all' || l.terminal === terminalFilter;
      const matchSize = sizeFilter === 'all' || l.sizeLabel === sizeFilter;
      return matchSearch && matchStatus && matchTerminal && matchSize;
    }).sort((a, b) => {
      const av = a[sort.field] ?? '';
      const bv = b[sort.field] ?? '';
      return sort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [lockers, search, statusFilter, terminalFilter, sizeFilter, sort]);

  const handleSave = (form) => {
    if (form.id) {
      setLockers(prev => prev.map(l => l.id === form.id ? { ...l, ...form } : l));
      addToast?.({ type: 'success', message: `Locker ${form.id} updated` });
    } else {
      const terminal = terminalsData.find(t => t.name === form.terminal);
      const termSn = terminal?.id.replace('TRM-', '') || '00';
      const newId = `${form.terminal.charAt(0).toUpperCase()}-${String(form.doorNo).padStart(2, '0')}`;
      const newLocker = { ...form, id: newId, terminalSn: `WNS-TRM-${termSn}`, doorNo: parseInt(form.doorNo), size: SIZE_LABELS.indexOf(form.sizeLabel), opened: 0, occupied: form.status === 'occupied' ? 1 : 0, package: null };
      setLockers(prev => [newLocker, ...prev]);
      addToast?.({ type: 'success', message: `Locker ${newId} added` });
    }
    setDrawer(null);
  };

  const handleDelete = (locker) => {
    setLockers(prev => prev.filter(l => l.id !== locker.id));
    addToast?.({ type: 'warning', message: `Locker ${locker.id} removed` });
    setDeleteConfirm(null);
    if (viewLocker?.id === locker.id) setViewLocker(null);
  };

  const handleMaintenanceToggle = (locker) => {
    const newStatus = locker.status === 'maintenance' ? 'available' : 'maintenance';
    setLockers(prev => prev.map(l => l.id === locker.id ? { ...l, status: newStatus } : l));
    addToast?.({ type: 'success', message: `Locker ${locker.id} ${newStatus === 'maintenance' ? 'flagged for maintenance' : 'cleared from maintenance'}` });
    if (viewLocker?.id === locker.id) setViewLocker(prev => ({ ...prev, status: newStatus }));
  };

  const handleOpenLocker = (locker) => {
    addToast?.({ type: 'success', message: `Remote open sent to ${locker.id}` });
    onOpenLocker?.(locker.id);
  };

  const sortFn = (field) => setSort(prev => ({ field, dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc' }));

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Locker Management</h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'All Lockers'}</p>
        </div>
        {hasPermission(currentUser?.role, 'lockers.manage') && (!activeSubMenu || activeSubMenu === 'All Lockers') && (
          <button onClick={() => setDrawer({})} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
            <Plus size={18} /> Add Locker
          </button>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[['Total', lockers.length, Grid3X3, theme.accent.primary], ['Available', lockers.filter(l => l.status === 'available').length, Unlock, '#81C995'], ['Occupied', lockers.filter(l => l.status === 'occupied').length, Package, '#7EA8C9'], ['Maintenance', lockers.filter(l => l.status === 'maintenance').length, AlertTriangle, '#D48E8A']].map(([l, v, I, c]) => (
          <div key={l} className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>{l}</p>
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${c}15` }}><I size={16} style={{ color: c }} /></div>
            </div>
            <p className="text-2xl font-bold" style={{ color: c }}>{v}</p>
          </div>
        ))}
      </div>

      {(!activeSubMenu || activeSubMenu === 'All Lockers') && (
        <>
          {/* View mode toggle */}
          <div className="flex items-center justify-between">
            <p className="text-sm" style={{ color: theme.text.muted }}>{filteredLockers.length} of {lockers.length} lockers</p>
            <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
              <button onClick={() => setViewMode('grid')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: viewMode === 'grid' ? theme.accent.primary : 'transparent', color: viewMode === 'grid' ? theme.accent.contrast : theme.text.muted }}>
                <LayoutGrid size={13} /> Grid
              </button>
              <button onClick={() => setViewMode('list')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: viewMode === 'list' ? theme.accent.primary : 'transparent', color: viewMode === 'list' ? theme.accent.contrast : theme.text.muted }}>
                <List size={13} /> List
              </button>
              <button onClick={() => setViewMode('terminal')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: viewMode === 'terminal' ? theme.accent.primary : 'transparent', color: viewMode === 'terminal' ? theme.accent.contrast : theme.text.muted }}>
                <Grid3X3 size={13} /> Terminal
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl border flex-1" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <Search size={16} style={{ color: theme.icon.muted }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID, terminal, package..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: theme.text.primary }} />
                {search && <button onClick={() => setSearch('')} style={{ color: theme.text.muted }}><X size={16} /></button>}
              </div>
              <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                {[['all', 'All'], ['available', 'Available'], ['occupied', 'Occupied'], ['reserved', 'Reserved'], ['maintenance', 'Maint.']].map(([v, l]) => (
                  <button key={v} onClick={() => setStatusFilter(v)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: statusFilter === v ? theme.accent.primary : 'transparent', color: statusFilter === v ? theme.accent.contrast : theme.text.muted }}>{l}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                {[['all', 'All Terminals'], ...terminalsData.map(t => [t.name, t.name.split(' ')[0]])].map(([v, l]) => (
                  <button key={v} onClick={() => setTerminalFilter(v)} className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap" style={{ backgroundColor: terminalFilter === v ? theme.accent.primary : 'transparent', color: terminalFilter === v ? theme.accent.contrast : theme.text.muted }}>{l}</button>
                ))}
              </div>
              <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                {[['all', 'All Sizes'], ...SIZE_LABELS.map(s => [s, s])].map(([v, l]) => (
                  <button key={v} onClick={() => setSizeFilter(v)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: sizeFilter === v ? theme.accent.primary : 'transparent', color: sizeFilter === v ? theme.accent.contrast : theme.text.muted }}>{l}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {filteredLockers.map(l => {
                const STATUS_COLORS = { available: '#81C995', occupied: '#7EA8C9', reserved: '#D4AA5A', maintenance: '#D48E8A' };
                const sc = STATUS_COLORS[l.status] || '#A8A29E';
                return (
                  <div key={l.id} onClick={() => setViewLocker(l)} className="p-3 rounded-xl border cursor-pointer group transition-all hover:scale-[1.02]" style={{ backgroundColor: `${sc}10`, borderColor: `${sc}40` }}>
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-mono font-bold text-sm" style={{ color: sc }}>{l.id}</span>
                      {l.package && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: theme.accent.primary }} title={l.package} />}
                    </div>
                    <p className="text-xs truncate" style={{ color: theme.text.muted }}>{l.terminal}</p>
                    <p className="text-xs mt-0.5" style={{ color: theme.text.secondary }}>{l.sizeLabel}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs capitalize px-1.5 py-0.5 rounded-md font-medium" style={{ backgroundColor: `${sc}20`, color: sc }}>{l.status}</span>
                      {l.opened === 1 && <DoorOpen size={11} style={{ color: '#D4AA5A' }} />}
                    </div>
                    <div className="flex items-center justify-end gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleOpenLocker(l)} className="p-1 rounded hover:bg-white/10" style={{ color: theme.text.muted }} title="Remote Open"><DoorOpen size={11} /></button>
                      {hasPermission(currentUser?.role, 'lockers.manage') && (
                        <>
                          <button onClick={() => setDrawer(l)} className="p-1 rounded hover:bg-white/10" style={{ color: theme.accent.primary }} title="Edit"><Edit size={11} /></button>
                          <button onClick={() => setDeleteConfirm(l)} className="p-1 rounded hover:bg-white/10 text-red-400" title="Delete"><Trash2 size={11} /></button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {filteredLockers.length === 0 && <p className="col-span-full text-center py-10 text-sm" style={{ color: theme.text.muted }}>No lockers found</p>}
            </div>
          )}

          {/* Terminal View */}
          {viewMode === 'terminal' && (
            <div className="space-y-4">
              {terminalsData.map(terminal => {
                const tLockers = lockers.filter(l => l.terminal === terminal.name);
                const available = tLockers.filter(l => l.status === 'available').length;
                const occupied = tLockers.filter(l => l.status === 'occupied').length;
                const maintenance = tLockers.filter(l => l.status === 'maintenance').length;
                const reserved = tLockers.filter(l => l.status === 'reserved').length;
                const fillPct = tLockers.length > 0 ? Math.round((occupied / tLockers.length) * 100) : 0;
                const isExpanded = expandedTerminals[terminal.id] !== false; // expanded by default
                const STATUS_COLORS = { available: '#81C995', occupied: '#7EA8C9', reserved: '#D4AA5A', maintenance: '#D48E8A' };
                return (
                  <div key={terminal.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    {/* Terminal header */}
                    <button
                      className="w-full flex items-center justify-between p-4 hover:bg-white/5"
                      onClick={() => setExpandedTerminals(p => ({ ...p, [terminal.id]: !isExpanded }))}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${theme.accent.primary}15` }}>
                          <Grid3X3 size={18} style={{ color: theme.accent.primary }} />
                        </div>
                        <div className="text-left">
                          <p className="font-semibold" style={{ color: theme.text.primary }}>{terminal.name}</p>
                          <p className="text-xs" style={{ color: theme.text.muted }}>{terminal.location} • {tLockers.length} compartments</p>
                        </div>
                        <div className="flex items-center gap-1.5 ml-2">
                          {terminal.status === 'online'
                            ? <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#81C99520', color: '#81C995' }}><Wifi size={10} /> Online</span>
                            : <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#D48E8A20', color: '#D48E8A' }}><WifiOff size={10} /> Offline</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-3 text-xs">
                          {[['Available', available, '#81C995'], ['Occupied', occupied, '#7EA8C9'], ['Reserved', reserved, '#D4AA5A'], ['Maint.', maintenance, '#D48E8A']].map(([l, v, c]) => (
                            <span key={l} style={{ color: c }}><span className="font-bold">{v}</span> <span style={{ color: theme.text.muted }}>{l}</span></span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${fillPct}%`, backgroundColor: fillPct > 80 ? '#D48E8A' : fillPct > 60 ? '#D4AA5A' : '#81C995' }} />
                          </div>
                          <span className="text-xs font-mono" style={{ color: theme.text.muted }}>{fillPct}%</span>
                        </div>
                        {isExpanded ? <ChevronUp size={16} style={{ color: theme.text.muted }} /> : <ChevronDown size={16} style={{ color: theme.text.muted }} />}
                      </div>
                    </button>

                    {/* Compartment grid */}
                    {isExpanded && (
                      <div className="border-t p-4" style={{ borderColor: theme.border.primary }}>
                        {/* Legend */}
                        <div className="flex items-center gap-4 mb-3 text-xs" style={{ color: theme.text.muted }}>
                          {[['Available', '#81C995'], ['Occupied', '#7EA8C9'], ['Reserved', '#D4AA5A'], ['Maintenance', '#D48E8A']].map(([l, c]) => (
                            <span key={l} className="flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: `${c}40`, border: `1.5px solid ${c}` }} />
                              {l}
                            </span>
                          ))}
                        </div>

                        {/* Grid */}
                        <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))' }}>
                          {tLockers.sort((a, b) => a.doorNo - b.doorNo).map(locker => {
                            const sc = STATUS_COLORS[locker.status] || '#A8A29E';
                            return (
                              <button
                                key={locker.id}
                                onClick={() => setViewLocker(locker)}
                                title={`${locker.id} • ${locker.sizeLabel} • ${locker.status}${locker.package ? ` • ${locker.package}` : ''}`}
                                className="relative group rounded-lg p-1.5 text-left transition-all hover:scale-105"
                                style={{ backgroundColor: `${sc}18`, border: `1.5px solid ${sc}50` }}
                              >
                                <p className="text-xs font-mono font-bold leading-tight" style={{ color: sc }}>{locker.id}</p>
                                <p className="text-xs leading-tight mt-0.5" style={{ color: theme.text.muted, fontSize: 9 }}>{locker.sizeLabel[0]}</p>
                                {locker.package && (
                                  <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ backgroundColor: theme.accent.primary }} title={locker.package} />
                                )}
                                {locker.opened === 1 && (
                                  <DoorOpen size={8} className="absolute bottom-1 right-1" style={{ color: '#D4AA5A' }} />
                                )}
                              </button>
                            );
                          })}
                          {tLockers.length === 0 && (
                            <p className="col-span-full text-center text-sm py-4" style={{ color: theme.text.muted }}>No compartments configured for this terminal</p>
                          )}
                        </div>

                        {/* Quick actions footer */}
                        <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: theme.border.primary }}>
                          <button
                            onClick={() => setDrawer({ terminal: terminal.name })}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border"
                            style={{ borderColor: theme.border.primary, color: theme.text.muted }}
                          >
                            <Plus size={12} /> Add Compartment
                          </button>
                          <button
                            onClick={() => { tLockers.filter(l => l.status === 'available').forEach(l => handleOpenLocker(l)); }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border"
                            style={{ borderColor: '#D4AA5A40', color: '#D4AA5A' }}
                            title="Bulk open all available doors"
                          >
                            <DoorOpen size={12} /> Open All Available
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    {[['id', 'ID'], ['doorNo', 'Door #', 'hidden sm:table-cell'], ['terminal', 'Terminal'], ['sizeLabel', 'Size', 'hidden md:table-cell'], ['status', 'Status'], ['doorState', 'Door', 'hidden lg:table-cell'], ['package', 'Package', 'hidden lg:table-cell'], ['temp', 'Temp', 'hidden md:table-cell'], ['battery', 'Battery', 'hidden md:table-cell']].map(([field, label, hide]) => (
                      <th key={field} onClick={() => sortFn(field)} className={`text-left p-3 text-xs font-semibold uppercase cursor-pointer select-none ${hide || ''}`} style={{ color: sort.field === field ? theme.accent.primary : theme.text.muted }}>
                        <span className="flex items-center gap-1">{label}{sort.field === field && (sort.dir === 'asc' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}</span>
                      </th>
                    ))}
                    <th className="text-right p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLockers.map(l => (
                    <tr key={l.id} className="hover:bg-white/5 cursor-pointer" style={{ borderBottom: `1px solid ${theme.border.primary}` }} onClick={() => setViewLocker(l)}>
                      <td className="p-3">
                        <span className="font-mono font-bold" style={{ color: theme.text.primary }}>{l.id}</span>
                        <p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{getLockerAddress(l.id, l.terminal)}</p>
                      </td>
                      <td className="p-3 hidden sm:table-cell"><span className="text-sm font-mono" style={{ color: theme.text.primary }}>#{l.doorNo}</span></td>
                      <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{l.terminal}</span></td>
                      <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{l.sizeLabel}</span></td>
                      <td className="p-3"><StatusBadge status={l.status} /></td>
                      <td className="p-3 hidden lg:table-cell">
                        {l.opened ? <span className="text-xs flex items-center gap-1" style={{ color: '#D4AA5A' }}><DoorOpen size={13} /> Open</span> : <span className="text-xs flex items-center gap-1" style={{ color: '#81C995' }}><DoorClosed size={13} /> Closed</span>}
                      </td>
                      <td className="p-3 hidden lg:table-cell">{l.package ? <span className="text-xs font-mono" style={{ color: theme.accent.primary }}>{l.package}</span> : <span style={{ color: theme.text.muted }}>—</span>}</td>
                      <td className="p-3 hidden md:table-cell">{l.temp ? <div className="flex items-center gap-1"><Thermometer size={13} style={{ color: theme.icon.muted }} /><span className="text-sm" style={{ color: theme.text.secondary }}>{l.temp}°C</span></div> : '—'}</td>
                      <td className="p-3 hidden md:table-cell">
                        <div className="flex items-center gap-1.5">
                          {l.battery < 20 ? <BatteryWarning size={13} className="text-red-400" /> : <Battery size={13} style={{ color: theme.icon.muted }} />}
                          <span className={`text-sm ${l.battery < 20 ? 'text-red-400' : ''}`} style={{ color: l.battery >= 20 ? theme.text.secondary : undefined }}>{l.battery}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleOpenLocker(l)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }} title="Remote Open"><DoorOpen size={14} /></button>
                          <button onClick={() => handleMaintenanceToggle(l)} className={`p-1.5 rounded-lg hover:bg-white/5`} style={{ color: l.status === 'maintenance' ? '#81C995' : '#D4AA5A' }} title={l.status === 'maintenance' ? 'Clear Maintenance' : 'Flag Maintenance'}><Wrench size={14} /></button>
                          {hasPermission(currentUser?.role, 'lockers.manage') && (
                            <>
                              <button onClick={() => setDrawer(l)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.accent.primary }} title="Edit"><Edit size={14} /></button>
                              <button onClick={() => setDeleteConfirm(l)} className="p-1.5 rounded-lg hover:bg-white/5 text-red-400" title="Delete"><Trash2 size={14} /></button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredLockers.length === 0 && <tr><td colSpan={10} className="p-8 text-center text-sm" style={{ color: theme.text.muted }}>No lockers found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
          )}
        </>
      )}

      {activeSubMenu === 'Maintenance' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
            <div>
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Lockers Requiring Attention</h3>
              <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>In maintenance or low battery</p>
            </div>
            <span className="text-sm font-medium px-3 py-1 rounded-full" style={{ backgroundColor: '#D48E8A15', color: '#D48E8A' }}>
              {lockers.filter(l => l.status === 'maintenance' || l.battery < 20).length} issues
            </span>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Locker</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden sm:table-cell" style={{ color: theme.text.muted }}>Door #</th>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Terminal</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Battery</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Issue</th>
                <th className="text-right p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {lockers.filter(l => l.status === 'maintenance' || l.battery < 20).map(l => (
                <tr key={l.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <td className="p-3"><span className="font-mono font-bold" style={{ color: theme.text.primary }}>{l.id}</span></td>
                  <td className="p-3 hidden sm:table-cell"><span className="text-sm font-mono" style={{ color: theme.text.secondary }}>#{l.doorNo}</span></td>
                  <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{l.terminal}</span></td>
                  <td className="p-3 hidden md:table-cell">
                    <div className="flex items-center gap-1.5">
                      {l.battery < 20 ? <BatteryWarning size={13} className="text-red-400" /> : <Battery size={13} style={{ color: theme.icon.muted }} />}
                      <span className={`text-sm ${l.battery < 20 ? 'text-red-400 font-semibold' : ''}`} style={{ color: l.battery >= 20 ? theme.text.secondary : undefined }}>{l.battery}%</span>
                    </div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    {l.status === 'maintenance' && <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#D48E8A15', color: '#D48E8A' }}>Maintenance</span>}
                    {l.battery < 20 && l.status !== 'maintenance' && <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#D4AA5A15', color: '#D4AA5A' }}>Low Battery</span>}
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => handleMaintenanceToggle(l)} className="px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: '#81C99540', color: '#81C995' }}>
                      {l.status === 'maintenance' ? 'Clear' : 'Resolved'}
                    </button>
                  </td>
                </tr>
              ))}
              {lockers.filter(l => l.status === 'maintenance' || l.battery < 20).length === 0 && (
                <tr><td colSpan={6} className="p-8 text-center text-sm" style={{ color: theme.text.muted }}>No lockers in maintenance</td></tr>
              )}
            </tbody>
          </table>
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
                    {['Terminal', 'Small', 'Medium', 'Large', 'XLarge', 'Total'].map(h => <th key={h} className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {terminalsData.map(t => {
                    const tLockers = lockers.filter(l => l.terminal === t.name);
                    return (
                      <tr key={t.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                        <td className="p-3"><span className="text-sm font-medium" style={{ color: theme.text.primary }}>{t.name}</span></td>
                        {SIZE_LABELS.map(sz => <td key={sz} className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{tLockers.filter(l => l.sizeLabel === sz).length}</span></td>)}
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

      {/* View Drawer */}
      {viewLocker && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewLocker(null)} />
          <div className="absolute inset-y-0 right-0 w-full sm:w-[380px] border-l shadow-2xl flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
              <div>
                <p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{getLockerAddress(viewLocker.id, viewLocker.terminal)}</p>
                <p className="font-semibold" style={{ color: theme.text.primary }}>Locker {viewLocker.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setDrawer(viewLocker); setViewLocker(null); }} className="px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Edit</button>
                <button onClick={() => setViewLocker(null)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><X size={18} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <StatusBadge status={viewLocker.status} />
              <div className="grid grid-cols-3 gap-3">
                {[['Door #', `#${viewLocker.doorNo}`, theme.accent.primary], ['Size', viewLocker.sizeLabel, theme.text.primary], ['Enabled', viewLocker.enabled ? 'Yes' : 'No', viewLocker.enabled ? '#81C995' : '#A8A29E']].map(([l, v, c]) => (
                  <div key={l} className="p-3 rounded-xl border text-center" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                    <p className="text-sm font-bold mt-0.5" style={{ color: c }}>{v}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {[['Terminal', viewLocker.terminal], ['Door State', viewLocker.opened ? 'Open' : 'Closed'], ['Package', viewLocker.package || '—'], ['Temperature', viewLocker.temp ? `${viewLocker.temp}°C` : '—'], ['Battery', `${viewLocker.battery}%`], ['SN', viewLocker.terminalSn]].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between py-2 border-b" style={{ borderColor: theme.border.primary }}>
                    <span className="text-xs" style={{ color: theme.text.muted }}>{l}</span>
                    <span className="text-sm font-mono" style={{ color: theme.text.primary }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
              <button onClick={() => handleOpenLocker(viewLocker)} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                <DoorOpen size={14} className="inline mr-1.5" />Remote Open
              </button>
              <button onClick={() => handleMaintenanceToggle(viewLocker)} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: '#D4AA5A40', color: '#D4AA5A' }}>
                <Wrench size={14} className="inline mr-1.5" />{viewLocker.status === 'maintenance' ? 'Clear' : 'Maintenance'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Drawer */}
      {drawer !== null && <LockerDrawer locker={drawer?.id ? drawer : null} onClose={() => setDrawer(null)} onSave={handleSave} theme={theme} />}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-sm rounded-2xl border p-6 space-y-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>Remove Locker?</h3>
            <p className="text-sm" style={{ color: theme.text.muted }}>Remove locker <span className="font-mono font-semibold" style={{ color: theme.text.primary }}>{deleteConfirm.id}</span> permanently?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: '#D48E8A', color: '#fff' }}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
