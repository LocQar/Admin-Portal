import React, { useState, useMemo } from 'react';
import { Search, Users2, UserCheck, UserX, QrCode, CreditCard, Phone, ToggleLeft, ToggleRight, Upload, Download, Package, Plus, Star, X, Trash2, Eye, Edit, LayoutGrid, List, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { COURIER_STATUSES } from '../constants';
import { couriersData, terminalsData } from '../constants/mockData';

const VEHICLE_TYPES = ['Motorcycle', 'Bicycle', 'Car', 'Van'];

const CourierDrawer = ({ courier, onClose, onSave, theme }) => {
  const isEdit = !!courier?.id;
  const [form, setForm] = useState(courier || {
    name: '', phone: '', email: '', terminal: '', zone: '',
    vehicleType: 'Motorcycle', vehiclePlate: '', notes: '', status: 1,
  });
  const [errors, setErrors] = useState({});

  const update = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.terminal) e.terminal = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave(form);
  };

  const labelCls = "text-xs font-semibold uppercase block mb-1.5";
  const inputStyle = (field) => ({
    backgroundColor: 'transparent',
    borderColor: errors[field] ? '#D48E8A' : theme.border.primary,
    color: theme.text.primary,
  });

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full sm:w-[460px] border-l shadow-2xl flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <div>
            <p className="text-xs" style={{ color: theme.text.muted }}>{isEdit ? 'EDIT COURIER' : 'NEW COURIER'}</p>
            <h2 className="font-semibold" style={{ color: theme.text.primary }}>{isEdit ? courier.name : 'Add Courier'}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Name + Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Full Name *</label>
              <input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Kwesi Asante" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('name')} />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Phone *</label>
              <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+233..." className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('phone')} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelCls} style={{ color: theme.text.muted }}>Email</label>
            <input value={form.email || ''} onChange={e => update('email', e.target.value)} placeholder="courier@locqar.com" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('email')} />
          </div>

          {/* Terminal + Zone */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Assigned Terminal *</label>
              <select value={form.terminal} onChange={e => update('terminal', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: errors.terminal ? '#D48E8A' : theme.border.primary, color: theme.text.primary }}>
                <option value="">Select terminal</option>
                {terminalsData.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
              {errors.terminal && <p className="text-xs text-red-500 mt-1">{errors.terminal}</p>}
            </div>
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Zone / Area</label>
              <input value={form.zone || ''} onChange={e => update('zone', e.target.value)} placeholder="e.g. North Accra" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('zone')} />
            </div>
          </div>

          {/* Vehicle */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Vehicle Type</label>
              <select value={form.vehicleType || 'Motorcycle'} onChange={e => update('vehicleType', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Plate Number</label>
              <input value={form.vehiclePlate || ''} onChange={e => update('vehiclePlate', e.target.value)} placeholder="GW-1234-23" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('vehiclePlate')} />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className={labelCls} style={{ color: theme.text.muted }}>Status</label>
            <div className="flex gap-2">
              {[[1, 'Active', '#81C995'], [0, 'Disabled', '#A8A29E']].map(([v, l, c]) => (
                <button key={v} onClick={() => update('status', v)} className="flex-1 py-2.5 rounded-xl text-sm" style={{ backgroundColor: form.status === v ? `${c}15` : theme.bg.tertiary, color: form.status === v ? c : theme.text.secondary, border: form.status === v ? `1px solid ${c}40` : `1px solid ${theme.border.primary}` }}>{l}</button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelCls} style={{ color: theme.text.muted }}>Notes</label>
            <textarea value={form.notes || ''} onChange={e => update('notes', e.target.value)} rows={3} placeholder="Any additional info..." className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent resize-none" style={{ borderColor: theme.border.primary, color: theme.text.primary }} />
          </div>
        </div>

        <div className="p-4 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
            {isEdit ? 'Save Changes' : 'Add Courier'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const CouriersPage = ({ addToast, packages = [] }) => {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [terminalFilter, setTerminalFilter] = useState('all');
  const [couriers, setCouriers] = useState(couriersData);
  const [drawerCourier, setDrawerCourier] = useState(null); // null=closed, {}=new, {...}=edit
  const [viewCourier, setViewCourier] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileInputRef = React.useRef(null);
  const [view, setView] = useState('list');

  const filteredCouriers = useMemo(() => {
    return couriers.filter(c => {
      const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search) || (c.cardNo || '').toLowerCase().includes(search.toLowerCase()) || (c.email || '').toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || String(c.status) === statusFilter;
      const matchesTerminal = terminalFilter === 'all' || c.terminal === terminalFilter;
      return matchesSearch && matchesStatus && matchesTerminal;
    });
  }, [couriers, search, statusFilter, terminalFilter]);

  const totalCouriers = couriers.length;
  const activeCouriers = couriers.filter(c => c.status === 1).length;
  const disabledCouriers = couriers.filter(c => c.status === 0).length;
  const avgRating = couriers.length ? (couriers.reduce((s, c) => s + (c.rating || 0), 0) / couriers.length).toFixed(1) : '—';

  const handleToggleStatus = (courierId) => {
    setCouriers(prev => prev.map(c => {
      if (c.id === courierId) {
        const newStatus = c.status === 1 ? 0 : 1;
        addToast?.({ type: 'success', message: `${c.name} ${newStatus === 1 ? 'enabled' : 'disabled'}` });
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  const handleSave = (form) => {
    if (form.id) {
      // Edit
      setCouriers(prev => prev.map(c => c.id === form.id ? { ...c, ...form } : c));
      addToast?.({ type: 'success', message: `${form.name} updated` });
    } else {
      // Create
      const maxId = couriers.reduce((m, c) => Math.max(m, c.id), 0);
      const newId = maxId + 1;
      const newCourier = {
        ...form,
        id: newId,
        cardNo: `CRD-${String(newId).padStart(3, '0')}`,
        qrCode: `CUR-QR-${String(newId).padStart(3, '0')}`,
        totalDeliveries: 0,
        rating: null,
        joinDate: new Date().toISOString().slice(0, 10),
      };
      setCouriers(prev => [newCourier, ...prev]);
      addToast?.({ type: 'success', message: `Courier ${form.name} added` });
    }
    setDrawerCourier(null);
  };

  const handleDelete = (courier) => {
    setCouriers(prev => prev.filter(c => c.id !== courier.id));
    addToast?.({ type: 'warning', message: `${courier.name} removed` });
    setDeleteConfirm(null);
    if (viewCourier?.id === courier.id) setViewCourier(null);
  };

  // CSV Export
  const exportToCSV = () => {
    const rows = filteredCouriers.map(c => ({ Name: c.name, Phone: c.phone, Email: c.email || '', Terminal: c.terminal, Zone: c.zone || '', Vehicle: c.vehicleType || '', Plate: c.vehiclePlate || '', CardNo: c.cardNo, QRCode: c.qrCode, Status: c.status === 1 ? 'Active' : 'Disabled', Deliveries: c.totalDeliveries || 0, Rating: c.rating || '' }));
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(','), ...rows.map(r => headers.map(h => `"${r[h]}"`).join(','))].join('\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: `couriers_${new Date().toISOString().slice(0, 10)}.csv` });
    a.click();
    addToast?.({ type: 'success', message: `Exported ${rows.length} couriers` });
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const lines = ev.target.result.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        const imported = lines.slice(1).map((line, i) => {
          const vals = line.split(',').map(v => v.replace(/"/g, '').trim());
          const row = Object.fromEntries(headers.map((h, j) => [h, vals[j] || '']));
          const maxId = couriers.reduce((m, c) => Math.max(m, c.id), 0);
          return { id: maxId + i + 1, name: row.Name || '', phone: row.Phone || '', email: row.Email || '', terminal: row.Terminal || '', zone: row.Zone || '', vehicleType: row.Vehicle || 'Motorcycle', vehiclePlate: row.Plate || '', cardNo: row.CardNo || `CRD-IMP-${i}`, qrCode: row.QRCode || `CUR-IMP-${i}`, status: row.Status === 'Disabled' ? 0 : 1, totalDeliveries: parseInt(row.Deliveries) || 0, rating: parseFloat(row.Rating) || null, joinDate: new Date().toISOString().slice(0, 10) };
        });
        setCouriers(prev => [...prev, ...imported]);
        addToast?.({ type: 'success', message: `Imported ${imported.length} couriers` });
      } catch {
        addToast?.({ type: 'error', message: 'Import failed — check file format' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const terminals = [...new Set(couriersData.map(c => c.terminal).filter(Boolean))];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Couriers</h1>
          <p style={{ color: theme.text.muted }}>Manage courier accounts and terminal access</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Upload size={16} /> Import
          </button>
          <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Download size={16} /> Export
          </button>
          <button onClick={() => setDrawerCourier({})} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
            <Plus size={18} /> Add Courier
          </button>
        </div>
      </div>
      <input type="file" ref={fileInputRef} accept=".csv" onChange={handleImport} className="hidden" />

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          ['Total', totalCouriers, Users2, theme.accent.primary],
          ['Active', activeCouriers, UserCheck, '#81C995'],
          ['Disabled', disabledCouriers, UserX, '#A8A29E'],
          ['Avg Rating', avgRating, Star, '#D4AA5A'],
        ].map(([label, value, Icon, color]) => (
          <div key={label} className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>{label}</p>
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${color}15` }}>
                <Icon size={16} style={{ color }} />
              </div>
            </div>
            <p className="text-2xl font-bold" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border flex-1" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <Search size={16} style={{ color: theme.icon.muted }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone, email, card..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: theme.text.primary }} />
          {search && <button onClick={() => setSearch('')} style={{ color: theme.text.muted }}><X size={16} /></button>}
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
          {[['all', 'All'], ['1', 'Active'], ['0', 'Disabled']].map(([val, label]) => (
            <button key={val} onClick={() => setStatusFilter(val)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: statusFilter === val ? theme.accent.primary : 'transparent', color: statusFilter === val ? theme.accent.contrast : theme.text.muted }}>{label}</button>
          ))}
        </div>
        <select value={terminalFilter} onChange={e => setTerminalFilter(e.target.value)} className="px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }}>
          <option value="all">All Terminals</option>
          {terminals.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
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

      <p className="text-xs" style={{ color: theme.text.muted }}>{filteredCouriers.length} of {totalCouriers} couriers</p>

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCouriers.map(courier => {
            const statusInfo = COURIER_STATUSES[courier.status];
            const assignedCount = packages.filter(p => p.courier?.id === courier.id).length;
            return (
              <div key={courier.id} onClick={() => setViewCourier(courier)} className="p-4 rounded-2xl border cursor-pointer group hover:border-opacity-80 transition-all space-y-3" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold flex-shrink-0" style={{ backgroundColor: `${statusInfo?.color || theme.accent.primary}20`, color: statusInfo?.color || theme.accent.primary }}>{courier.name.charAt(0)}</div>
                    <div>
                      <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>{courier.name}</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{courier.vehicleType || '—'}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${statusInfo?.color}15`, color: statusInfo?.color }}>{statusInfo?.label}</span>
                </div>
                <div className="space-y-1.5 text-xs" style={{ color: theme.text.secondary }}>
                  <p><span style={{ color: theme.text.muted }}>Terminal: </span>{courier.terminal || '—'}</p>
                  <p><span style={{ color: theme.text.muted }}>Zone: </span>{courier.zone || '—'}</p>
                  <p><span style={{ color: theme.text.muted }}>Phone: </span><span className="font-mono">{courier.phone}</span></p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: theme.border.primary }}>
                  <div className="flex items-center gap-1">
                    <Package size={12} style={{ color: theme.accent.primary }} />
                    <span className="text-xs font-semibold" style={{ color: theme.text.primary }}>{courier.totalDeliveries ?? 0}</span>
                    <span className="text-xs" style={{ color: theme.text.muted }}>deliveries</span>
                  </div>
                  {courier.rating && <div className="flex items-center gap-1"><Star size={11} className="fill-amber-400 text-amber-400" /><span className="text-xs font-medium" style={{ color: theme.text.primary }}>{courier.rating}</span></div>}
                </div>
                <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setViewCourier(courier)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }} title="View"><Eye size={14} /></button>
                  <button onClick={() => setDrawerCourier(courier)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.accent.primary }} title="Edit"><Edit size={14} /></button>
                  <button onClick={() => setDeleteConfirm(courier)} className="p-1.5 rounded-lg hover:bg-white/5 text-red-400" title="Delete"><Trash2 size={14} /></button>
                </div>
              </div>
            );
          })}
          {filteredCouriers.length === 0 && <p className="col-span-full text-center py-10 text-sm" style={{ color: theme.text.muted }}>No couriers found</p>}
        </div>
      )}

      {/* List/Table View */}
      {view === 'list' && <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Courier</th>
                <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Terminal / Zone</th>
                <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Phone</th>
                <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Card / QR</th>
                <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Deliveries</th>
                <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Rating</th>
                <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCouriers.map(courier => {
                const statusInfo = COURIER_STATUSES[courier.status];
                const assignedCount = packages.filter(p => p.courier?.id === courier.id).length;
                return (
                  <tr key={courier.id} className="hover:bg-white/5 cursor-pointer" style={{ borderBottom: `1px solid ${theme.border.primary}` }} onClick={() => setViewCourier(courier)}>
                    <td className="p-4" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center gap-3" onClick={() => setViewCourier(courier)}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: `${statusInfo?.color || theme.accent.primary}20`, color: statusInfo?.color || theme.accent.primary }}>
                          {courier.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{courier.name}</p>
                          <p className="text-xs" style={{ color: theme.text.muted }}>{courier.email || courier.vehicleType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <p className="text-sm" style={{ color: theme.text.primary }}>{courier.terminal || '—'}</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{courier.zone || ''}</p>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Phone size={13} style={{ color: theme.icon.muted }} />
                        <span className="text-sm font-mono" style={{ color: theme.text.secondary }}>{courier.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <CreditCard size={13} style={{ color: theme.icon.muted }} />
                        <span className="text-xs font-mono" style={{ color: theme.text.secondary }}>{courier.cardNo}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <QrCode size={13} style={{ color: theme.icon.muted }} />
                        <span className="text-xs font-mono" style={{ color: theme.text.muted }}>{courier.qrCode}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Package size={13} style={{ color: theme.accent.primary }} />
                        <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{courier.totalDeliveries ?? 0}</span>
                      </div>
                      {assignedCount > 0 && <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{assignedCount} active</p>}
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      {courier.rating ? (
                        <div className="flex items-center gap-1">
                          <Star size={13} className="fill-amber-400 text-amber-400" />
                          <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{courier.rating}</span>
                        </div>
                      ) : <span className="text-sm" style={{ color: theme.text.muted }}>—</span>}
                    </td>
                    <td className="p-4" onClick={e => e.stopPropagation()}>
                      <button onClick={() => handleToggleStatus(courier.id)} className="inline-flex items-center gap-1.5 text-xs" style={{ color: courier.status === 1 ? '#81C995' : '#A8A29E' }}>
                        {courier.status === 1 ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                        <span>{statusInfo?.label}</span>
                      </button>
                    </td>
                    <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setViewCourier(courier)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }} title="View"><Eye size={15} /></button>
                        <button onClick={() => setDrawerCourier(courier)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.accent.primary }} title="Edit"><Edit size={15} /></button>
                        <button onClick={() => setDeleteConfirm(courier)} className="p-1.5 rounded-lg hover:bg-white/5 text-red-400" title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredCouriers.length === 0 && (
                <tr><td colSpan={8} className="p-10 text-center text-sm" style={{ color: theme.text.muted }}>No couriers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>}

      {/* Add / Edit Drawer */}
      {drawerCourier !== null && (
        <CourierDrawer
          courier={drawerCourier?.id ? drawerCourier : null}
          onClose={() => setDrawerCourier(null)}
          onSave={handleSave}
          theme={theme}
        />
      )}

      {/* View Drawer */}
      {viewCourier && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setViewCourier(null)} />
          <div className="absolute inset-y-0 right-0 w-full sm:w-[400px] border-l shadow-2xl flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
            <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
              <p className="font-semibold" style={{ color: theme.text.primary }}>Courier Profile</p>
              <div className="flex items-center gap-2">
                <button onClick={() => { setDrawerCourier(viewCourier); setViewCourier(null); }} className="px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Edit</button>
                <button onClick={() => setViewCourier(null)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><X size={18} /></button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Avatar + Name */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: `${theme.accent.primary}20`, color: theme.accent.primary }}>
                  {viewCourier.name.charAt(0)}
                </div>
                <div>
                  <p className="text-lg font-bold" style={{ color: theme.text.primary }}>{viewCourier.name}</p>
                  <p className="text-sm" style={{ color: theme.text.muted }}>{viewCourier.terminal} · {viewCourier.zone}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block" style={{ backgroundColor: `${COURIER_STATUSES[viewCourier.status]?.color}15`, color: COURIER_STATUSES[viewCourier.status]?.color }}>
                    {COURIER_STATUSES[viewCourier.status]?.label}
                  </span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  ['Deliveries', viewCourier.totalDeliveries ?? 0, theme.accent.primary],
                  ['Rating', viewCourier.rating ? `${viewCourier.rating} ★` : '—', '#D4AA5A'],
                  ['Active Pkgs', packages.filter(p => p.courier?.id === viewCourier.id).length, '#81C995'],
                ].map(([l, v, c]) => (
                  <div key={l} className="p-3 rounded-xl border text-center" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                    <p className="text-lg font-bold mt-0.5" style={{ color: c }}>{v}</p>
                  </div>
                ))}
              </div>

              {/* Details */}
              <div className="space-y-3">
                {[
                  ['Phone', viewCourier.phone],
                  ['Email', viewCourier.email || '—'],
                  ['Card No', viewCourier.cardNo],
                  ['QR Code', viewCourier.qrCode],
                  ['Vehicle', viewCourier.vehicleType ? `${viewCourier.vehicleType}${viewCourier.vehiclePlate ? ` — ${viewCourier.vehiclePlate}` : ''}` : '—'],
                  ['Joined', viewCourier.joinDate || '—'],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between py-2.5 border-b" style={{ borderColor: theme.border.primary }}>
                    <span className="text-xs" style={{ color: theme.text.muted }}>{l}</span>
                    <span className="text-sm font-mono" style={{ color: theme.text.primary }}>{v}</span>
                  </div>
                ))}
              </div>

              {viewCourier.notes && (
                <div className="p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                  <p className="text-xs mb-1" style={{ color: theme.text.muted }}>Notes</p>
                  <p className="text-sm" style={{ color: theme.text.secondary }}>{viewCourier.notes}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
              <button onClick={() => { handleToggleStatus(viewCourier.id); setViewCourier(prev => ({ ...prev, status: prev.status === 1 ? 0 : 1 })); }} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: viewCourier.status === 1 ? '#A8A29E' : '#81C995' }}>
                {viewCourier.status === 1 ? 'Disable Courier' : 'Enable Courier'}
              </button>
              <button onClick={() => { setDeleteConfirm(viewCourier); setViewCourier(null); }} className="py-2.5 px-4 rounded-xl border text-sm text-red-400" style={{ borderColor: '#D48E8A40' }}>
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-sm rounded-2xl border p-6 space-y-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg" style={{ color: theme.text.primary }}>Remove Courier?</h3>
            <p className="text-sm" style={{ color: theme.text.muted }}>
              Remove <span className="font-semibold" style={{ color: theme.text.primary }}>{deleteConfirm.name}</span> from the system? This cannot be undone.
            </p>
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
