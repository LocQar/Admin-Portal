import React, { useState, useMemo } from 'react';
import { FileDown, Plus, Search, X, Truck, CheckCircle2, MapPin, Route, Users, Clock, ChevronLeft, ChevronUp, ChevronDown, RefreshCw, Edit, Trash2, Star, UserPlus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Pagination } from '../components/ui';
import { StatusBadge, DeliveryMethodBadge } from '../components/ui/Badge';
import { hasPermission } from '../constants';
import { packagesData, driversData, terminalsData, routesData, getTerminalAddress } from '../constants/mockData';

// ─── initial data ─────────────────────────────────────────────────────────────
const INIT_ROUTES = [
  ...routesData,
  {
    id: 'RT-002', zone: 'East Legon', status: 'pending', driver: driversData[1],
    startTime: '09:30', estEndTime: '12:00', distance: '22 km', createdAt: '2024-01-15 09:00',
    stops: [
      { id: 10, order: 1, terminal: 'Kotoka T3', packages: [4], delivered: 0, eta: '09:55', status: 'pending', arrivedAt: null },
    ],
    timeline: [{ time: '09:00', event: 'Route created', icon: 'route', by: 'System' }]
  },
  {
    id: 'RT-003', zone: 'Weija / West', status: 'completed', driver: driversData[3],
    startTime: '07:00', estEndTime: '09:30', distance: '35 km', createdAt: '2024-01-15 06:45',
    stops: [
      { id: 20, order: 1, terminal: 'West Hills Mall', packages: [7], delivered: 1, eta: '07:40', status: 'completed', arrivedAt: '07:38' },
    ],
    timeline: [
      { time: '06:45', event: 'Route created', icon: 'route', by: 'System' },
      { time: '09:25', event: 'Route completed', icon: 'truck', by: 'Kwame Asiedu' }
    ]
  },
];

// ─── CreateRouteDrawer ─────────────────────────────────────────────────────────
const CreateRouteDrawer = ({ onClose, onSave, drivers, theme }) => {
  const [form, setForm] = useState({ zone: '', driverId: '', startTime: '08:00', estEndTime: '10:30' });
  const [stops, setStops] = useState([]);
  const [stopTerminal, setStopTerminal] = useState('');
  const [err, setErr] = useState({});
  const upd = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErr(p => ({ ...p, [f]: undefined })); };
  const is = { backgroundColor: 'transparent', borderColor: theme.border.primary, color: theme.text.primary };

  const addStop = () => {
    if (!stopTerminal) return;
    setStops(p => [...p, { id: Date.now(), order: p.length + 1, terminal: stopTerminal, packages: [], delivered: 0, eta: '--', status: 'pending', arrivedAt: null }]);
    setStopTerminal('');
  };

  const handleSave = () => {
    const e = {};
    if (!form.zone.trim()) e.zone = true;
    if (!form.driverId) e.driverId = true;
    if (stops.length === 0) e.stops = true;
    setErr(e);
    if (Object.keys(e).length) return;
    const driver = drivers.find(d => d.id === parseInt(form.driverId));
    onSave({
      id: `RT-${String(Date.now()).slice(-3)}`,
      zone: form.zone, status: 'pending', driver,
      startTime: form.startTime, estEndTime: form.estEndTime,
      distance: `${Math.round(stops.length * 8 + 5)} km`,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      stops,
      timeline: [{ time: form.startTime, event: 'Route created', icon: 'route', by: 'Admin' }]
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full sm:w-[480px] h-full border-l shadow-2xl flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: theme.border.primary }}>
          <div>
            <p className="text-xs uppercase font-semibold" style={{ color: theme.text.muted }}>New Route</p>
            <h2 className="font-semibold" style={{ color: theme.text.primary }}>Create Dispatch Route</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div>
            <label className="text-xs uppercase font-semibold block mb-1.5" style={{ color: theme.text.muted }}>Zone / Route Name *</label>
            <input value={form.zone} onChange={e => upd('zone', e.target.value)} placeholder="e.g. Accra Central" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ ...is, borderColor: err.zone ? '#D48E8A' : theme.border.primary }} />
          </div>
          <div>
            <label className="text-xs uppercase font-semibold block mb-1.5" style={{ color: theme.text.muted }}>Assign Driver *</label>
            <select value={form.driverId} onChange={e => upd('driverId', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ ...is, borderColor: err.driverId ? '#D48E8A' : theme.border.primary }}>
              <option value="">Select driver...</option>
              {drivers.filter(d => d.status !== 'offline').map(d => (
                <option key={d.id} value={d.id}>{d.name} — {d.zone} ({d.status})</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs uppercase font-semibold block mb-1.5" style={{ color: theme.text.muted }}>Start Time</label>
              <input type="time" value={form.startTime} onChange={e => upd('startTime', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is} />
            </div>
            <div>
              <label className="text-xs uppercase font-semibold block mb-1.5" style={{ color: theme.text.muted }}>Est. End Time</label>
              <input type="time" value={form.estEndTime} onChange={e => upd('estEndTime', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is} />
            </div>
          </div>

          <div>
            <label className="text-xs uppercase font-semibold block mb-1.5" style={{ color: theme.text.muted }}>Stops *</label>
            <div className="flex gap-2">
              <select value={stopTerminal} onChange={e => setStopTerminal(e.target.value)} className="flex-1 px-3 py-2 rounded-xl border text-sm" style={{ ...is, borderColor: err.stops ? '#D48E8A' : theme.border.primary }}>
                <option value="">Select terminal...</option>
                {terminalsData.filter(t => !stops.find(s => s.terminal === t.name)).map(t => (
                  <option key={t.id} value={t.name}>{t.name}</option>
                ))}
              </select>
              <button onClick={addStop} className="px-3 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
                <Plus size={16} />
              </button>
            </div>
            {err.stops && <p className="text-xs text-red-400 mt-1">Add at least one stop</p>}
            {stops.length > 0 && (
              <div className="mt-3 space-y-2">
                {stops.map((s, i) => (
                  <div key={s.id} className="flex items-center gap-2 px-3 py-2 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary }}>{i + 1}</div>
                    <span className="flex-1 text-sm" style={{ color: theme.text.primary }}>{s.terminal}</span>
                    <button onClick={() => setStops(p => p.filter(x => x.id !== s.id).map((x, j) => ({ ...x, order: j + 1 })))} style={{ color: theme.icon.muted }}><X size={14} /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="p-5 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
            <Route size={15} />Create Route
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── DriverDrawer ─────────────────────────────────────────────────────────────
const DriverDrawer = ({ driver, onClose, onSave, theme }) => {
  const isEdit = !!driver?.id;
  const [form, setForm] = useState(driver || { name: '', phone: '', vehicle: '', zone: '', status: 'active', deliveriesToday: 0, rating: 5.0 });
  const [err, setErr] = useState({});
  const upd = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErr(p => ({ ...p, [f]: undefined })); };
  const is = (f) => ({ backgroundColor: 'transparent', borderColor: err[f] ? '#D48E8A' : theme.border.primary, color: theme.text.primary });

  const handleSave = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.phone.trim()) e.phone = true;
    setErr(e);
    if (Object.keys(e).length) return;
    onSave(isEdit ? form : { ...form, id: Date.now() });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full sm:w-[420px] h-full border-l shadow-2xl flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: theme.border.primary }}>
          <div>
            <p className="text-xs uppercase font-semibold" style={{ color: theme.text.muted }}>{isEdit ? 'Edit Driver' : 'New Driver'}</p>
            <h2 className="font-semibold" style={{ color: theme.text.primary }}>{isEdit ? form.name : 'Add Driver'}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {[['name', 'Full Name *', 'text', 'Kwesi Asante'], ['phone', 'Phone *', 'text', '+233551234567'], ['vehicle', 'Vehicle & Plate', 'text', 'Toyota Hiace - GW-1234-23'], ['zone', 'Zone', 'text', 'Accra Central']].map(([f, lbl, type, ph]) => (
            <div key={f}>
              <label className="text-xs uppercase font-semibold block mb-1.5" style={{ color: theme.text.muted }}>{lbl}</label>
              <input type={type} value={form[f]} onChange={e => upd(f, e.target.value)} placeholder={ph} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is(f)} />
            </div>
          ))}
          <div>
            <label className="text-xs uppercase font-semibold block mb-1.5" style={{ color: theme.text.muted }}>Status</label>
            <div className="flex gap-2">
              {['active', 'on_delivery', 'offline'].map(s => (
                <button key={s} onClick={() => upd('status', s)} className="flex-1 py-2 rounded-xl border text-xs capitalize" style={{ backgroundColor: form.status === s ? (s === 'active' ? '#81C99520' : s === 'on_delivery' ? '#D4AA5A20' : '#78716C20') : theme.bg.tertiary, color: form.status === s ? (s === 'active' ? '#81C995' : s === 'on_delivery' ? '#D4AA5A' : '#78716C') : theme.text.muted, borderColor: form.status === s ? 'transparent' : theme.border.primary }}>{s.replace('_', ' ')}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
            {isEdit ? 'Save Changes' : 'Add Driver'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const DispatchPage = ({ currentUser, activeSubMenu, loading, setShowExport, addToast }) => {
  const { theme } = useTheme();
  const toast = (msg, type = 'success', action) => addToast && addToast({ type, message: msg, ...(action && { action }) });

  // ── data state ──
  const [packages, setPackages] = useState(packagesData);
  const [drivers, setDrivers] = useState(driversData);
  const [routes, setRoutes] = useState(INIT_ROUTES);

  // ── outgoing tab state ──
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState({ field: 'createdAt', dir: 'desc' });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);

  // ── route planning state ──
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeTab, setRouteTab] = useState('stops');
  const [expandedStops, setExpandedStops] = useState([]);
  const [addStopTerminal, setAddStopTerminal] = useState('');
  const [reassignDriverId, setReassignDriverId] = useState('');

  // ── driver tab state ──
  const [driverSearch, setDriverSearch] = useState('');
  const [driverSort, setDriverSort] = useState({ field: 'name', dir: 'asc' });

  // ── active tab (internal navigation) ──
  const [activeTab, setActiveTab] = useState(activeSubMenu || 'Outgoing');
  React.useEffect(() => { if (activeSubMenu) setActiveTab(activeSubMenu); }, [activeSubMenu]);

  // ── modals ──
  const [showCreateRoute, setShowCreateRoute] = useState(false);
  const [driverDrawer, setDriverDrawer] = useState(null); // null=closed, false=new, obj=edit
  const [deleteRoute, setDeleteRoute] = useState(null);
  const [deleteDriver, setDeleteDriver] = useState(null);

  // ── computed: outgoing ──
  const filteredPackages = useMemo(() => {
    let data = [...packages];
    if (filter === 'ready') data = data.filter(p => ['pending', 'at_warehouse', 'at_dropbox'].includes(p.status));
    else if (filter === 'assigned') data = data.filter(p => p.status === 'assigned');
    else if (filter === 'in_transit') data = data.filter(p => p.status.startsWith('in_transit'));
    else if (filter === 'delivered') data = data.filter(p => p.status.startsWith('delivered'));
    if (search) {
      const q = search.toLowerCase();
      data = data.filter(p => p.waybill.toLowerCase().includes(q) || p.customer.toLowerCase().includes(q) || p.destination.toLowerCase().includes(q) || p.phone?.includes(q));
    }
    const { field, dir } = sort;
    data.sort((a, b) => {
      const av = a[field] ?? ''; const bv = b[field] ?? '';
      return dir === 'asc' ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return data;
  }, [packages, filter, search, sort]);

  const paginated = useMemo(() => filteredPackages.slice((page - 1) * pageSize, page * pageSize), [filteredPackages, page, pageSize]);
  const totalPages = Math.ceil(filteredPackages.length / pageSize);

  // ── computed: drivers ──
  const filteredDrivers = useMemo(() => {
    let data = [...drivers];
    if (driverSearch) {
      const q = driverSearch.toLowerCase();
      data = data.filter(d => d.name.toLowerCase().includes(q) || d.zone?.toLowerCase().includes(q) || d.phone?.includes(q));
    }
    const { field, dir } = driverSort;
    data.sort((a, b) => dir === 'asc' ? (a[field] > b[field] ? 1 : -1) : (a[field] < b[field] ? 1 : -1));
    return data;
  }, [drivers, driverSearch, driverSort]);

  // ── sort helper ──
  const toggleSort = (field) => setSort(s => ({ field, dir: s.field === field && s.dir === 'asc' ? 'desc' : 'asc' }));
  const SortIcon = ({ field }) => sort.field === field ? (sort.dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null;

  // ── package actions ──
  const handleDispatch = (pkg) => {
    const snap = packages.slice();
    setPackages(p => p.map(x => x.id === pkg.id ? { ...x, status: 'assigned' } : x));
    toast(`${pkg.waybill} assigned to courier`, 'success', { label: 'Undo', onClick: () => { setPackages(snap); toast('Dispatch undone', 'info'); } });
  };
  const handlePackageRecall = (pkg) => {
    const snap = packages.slice();
    setPackages(p => p.map(x => x.id === pkg.id ? { ...x, status: 'recalled' } : x));
    toast(`${pkg.waybill} recalled from courier`, 'warning', { label: 'Undo', onClick: () => { setPackages(snap); toast('Recall undone', 'info'); } });
  };
  const handleMarkDelivered = (pkg) => {
    const snap = packages.slice();
    setPackages(p => p.map(x => x.id === pkg.id ? { ...x, status: 'delivered_to_locker' } : x));
    toast(`${pkg.waybill} marked as delivered`, 'success', { label: 'Undo', onClick: () => { setPackages(snap); toast('Delivery undone', 'info'); } });
  };

  // ── route actions ──
  const handleCreateRoute = (newRoute) => {
    setRoutes(p => [newRoute, ...p]);
    toast(`Route ${newRoute.id} created`);
  };
  const handleDeleteRoute = (route) => {
    const snap = routes.slice();
    setRoutes(p => p.filter(r => r.id !== route.id));
    if (selectedRoute?.id === route.id) setSelectedRoute(null);
    setDeleteRoute(null);
    toast(`Route ${route.id} deleted`, 'warning', { label: 'Undo', onClick: () => { setRoutes(snap); toast('Route restored', 'info'); } });
  };
  const handleReassignDriver = (routeId) => {
    if (!reassignDriverId) return;
    const driver = drivers.find(d => d.id === parseInt(reassignDriverId));
    if (!driver) return;
    const snap = routes.slice();
    setRoutes(p => p.map(r => r.id === routeId ? { ...r, driver, timeline: [...r.timeline, { time: new Date().toTimeString().slice(0, 5), event: `Driver reassigned to ${driver.name}`, icon: 'user', by: 'Admin' }] } : r));
    if (selectedRoute?.id === routeId) setSelectedRoute(r => ({ ...r, driver }));
    setReassignDriverId('');
    toast(`Route reassigned to ${driver.name}`, 'success', { label: 'Undo', onClick: () => { setRoutes(snap); toast('Reassignment undone', 'info'); } });
  };
  const handleMarkStopComplete = (routeId, stopId) => {
    const snap = routes.slice();
    setRoutes(p => p.map(r => r.id !== routeId ? r : {
      ...r,
      stops: r.stops.map(s => s.id !== stopId ? s : { ...s, status: 'completed', arrivedAt: new Date().toTimeString().slice(0, 5), delivered: s.packages.length }),
      timeline: [...r.timeline, { time: new Date().toTimeString().slice(0, 5), event: 'Stop marked complete', icon: 'mappin', by: 'Admin' }]
    }));
    toast('Stop marked complete', 'success', { label: 'Undo', onClick: () => { setRoutes(snap); toast('Stop restored', 'info'); } });
  };
  const handleAddStop = (routeId) => {
    if (!addStopTerminal) return;
    const snap = routes.slice();
    setRoutes(p => p.map(r => r.id !== routeId ? r : {
      ...r,
      stops: [...r.stops, { id: Date.now(), order: r.stops.length + 1, terminal: addStopTerminal, packages: [], delivered: 0, eta: '--', status: 'pending', arrivedAt: null }]
    }));
    setAddStopTerminal('');
    toast('Stop added to route', 'success', { label: 'Undo', onClick: () => { setRoutes(snap); toast('Stop removed', 'info'); } });
  };
  const handleRemoveStop = (routeId, stopId) => {
    const snap = routes.slice();
    setRoutes(p => p.map(r => r.id !== routeId ? r : {
      ...r,
      stops: r.stops.filter(s => s.id !== stopId).map((s, i) => ({ ...s, order: i + 1 }))
    }));
    toast('Stop removed', 'warning', { label: 'Undo', onClick: () => { setRoutes(snap); toast('Stop restored', 'info'); } });
  };

  // ── driver actions ──
  const handleSaveDriver = (form) => {
    if (form.id && drivers.find(d => d.id === form.id)) {
      setDrivers(p => p.map(d => d.id === form.id ? form : d));
      toast(`${form.name} updated`);
    } else {
      setDrivers(p => [...p, form]);
      toast(`${form.name} added`);
    }
  };
  const handleDeleteDriver = (driver) => {
    const snap = drivers.slice();
    setDrivers(p => p.filter(d => d.id !== driver.id));
    setDeleteDriver(null);
    toast(`${driver.name} removed`, 'warning', { label: 'Undo', onClick: () => { setDrivers(snap); toast('Driver restored', 'info'); } });
  };
  const handleRecall = (driver) => {
    const snap = drivers.slice();
    setDrivers(p => p.map(d => d.id === driver.id ? { ...d, status: 'active' } : d));
    toast(`${driver.name} recalled`, 'success', { label: 'Undo', onClick: () => { setDrivers(snap); toast('Recall undone', 'info'); } });
  };

  // ── bulk package actions ──
  const handleBulkDispatch = () => {
    const toDispatch = selected.filter(id => {
      const pkg = packages.find(p => p.id === id);
      return pkg && ['pending', 'at_warehouse', 'at_dropbox'].includes(pkg.status);
    });
    const snap = packages.slice();
    setPackages(p => p.map(x => toDispatch.includes(x.id) ? { ...x, status: 'assigned' } : x));
    setSelected([]);
    toast(`${toDispatch.length} package${toDispatch.length !== 1 ? 's' : ''} dispatched`, 'success', { label: 'Undo', onClick: () => { setPackages(snap); toast('Bulk dispatch undone', 'info'); } });
  };

  // ── route status actions ──
  const handleStartRoute = (routeId) => {
    const snap = routes.slice();
    setRoutes(p => p.map(r => r.id !== routeId ? r : {
      ...r, status: 'active',
      timeline: [...r.timeline, { time: new Date().toTimeString().slice(0, 5), event: 'Route started', icon: 'truck', by: 'Admin' }]
    }));
    toast('Route started', 'success', { label: 'Undo', onClick: () => { setRoutes(snap); toast('Route start undone', 'info'); } });
  };
  const handleCompleteRoute = (routeId) => {
    const snap = routes.slice();
    setRoutes(p => p.map(r => r.id !== routeId ? r : {
      ...r, status: 'completed',
      timeline: [...r.timeline, { time: new Date().toTimeString().slice(0, 5), event: 'Route completed', icon: 'truck', by: 'Admin' }]
    }));
    setSelectedRoute(null);
    toast('Route completed', 'success', { label: 'Undo', onClick: () => { setRoutes(snap); toast('Route completion undone', 'info'); } });
  };

  // ── metric helpers ──
  const ready = packages.filter(p => ['pending', 'at_warehouse', 'at_dropbox'].includes(p.status)).length;
  const assignedCount = packages.filter(p => p.status === 'assigned').length;
  const inTransit = packages.filter(p => p.status.startsWith('in_transit')).length;
  const delivered = packages.filter(p => p.status.startsWith('delivered')).length;
  const activeDrivers = drivers.filter(d => d.status !== 'offline').length;

  const STOP_COLORS = { completed: '#81C995', in_progress: '#D4AA5A', pending: theme.border.primary };
  const TIMELINE_ICONS = { route: Route, truck: Truck, user: Users, mappin: MapPin };

  return (
    <div className="p-4 md:p-6">

      {/* ── MODALS ── */}
      {showCreateRoute && <CreateRouteDrawer onClose={() => setShowCreateRoute(false)} onSave={handleCreateRoute} drivers={drivers} theme={theme} />}
      {driverDrawer !== null && <DriverDrawer driver={driverDrawer || undefined} onClose={() => setDriverDrawer(null)} onSave={handleSaveDriver} theme={theme} />}

      {/* Delete Route Confirm */}
      {deleteRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setDeleteRoute(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-sm rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold mb-2" style={{ color: theme.text.primary }}>Delete Route {deleteRoute.id}?</h3>
            <p className="text-sm mb-5" style={{ color: theme.text.muted }}>This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteRoute(null)} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
              <button onClick={() => handleDeleteRoute(deleteRoute)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: '#D48E8A', color: '#1C1917' }}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Driver Confirm */}
      {deleteDriver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setDeleteDriver(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-sm rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold mb-2" style={{ color: theme.text.primary }}>Remove {deleteDriver.name}?</h3>
            <p className="text-sm mb-5" style={{ color: theme.text.muted }}>This will remove the driver from the system.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteDriver(null)} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
              <button onClick={() => handleDeleteDriver(deleteDriver)} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: '#D48E8A', color: '#1C1917' }}>Remove</button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Dispatch</h1>
        <div className="flex gap-2">
          {activeTab === 'Route Planning' && (
            <button onClick={() => setShowCreateRoute(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
              <Plus size={16} />Create Route
            </button>
          )}
          {activeTab === 'Driver Assignment' && (
            <button onClick={() => setDriverDrawer(false)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
              <UserPlus size={16} />Add Driver
            </button>
          )}
          <button onClick={() => setShowExport && setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <FileDown size={16} />Export
          </button>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      <div className="flex items-center gap-1 mb-6 p-1 rounded-xl w-fit" style={{ backgroundColor: theme.bg.tertiary }}>
        {['Outgoing', 'Route Planning', 'Driver Assignment'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{ backgroundColor: activeTab === tab ? theme.accent.primary : 'transparent', color: activeTab === tab ? theme.accent.contrast : theme.text.muted }}>
            {tab}
          </button>
        ))}
      </div>

      {/* ════════════════ OUTGOING ════════════════ */}
      {activeTab === 'Outgoing' && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {[
              { label: 'Ready', value: ready, color: '#D4AA5A' },
              { label: 'Assigned', value: assignedCount, color: '#7EA8C9' },
              { label: 'In Transit', value: inTransit, color: '#B5A0D1' },
              { label: 'Delivered', value: delivered, color: '#81C995' },
              { label: 'Active Drivers', value: activeDrivers, color: theme.accent.primary },
              { label: 'Total Value', value: `GH₵ ${packages.reduce((s, p) => s + (p.value || 0), 0).toLocaleString()}`, color: '#D4AA5A' },
            ].map(m => (
              <div key={m.label} className="p-4 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <p className="text-xs mb-1" style={{ color: theme.text.muted }}>{m.label}</p>
                <p className="text-xl font-bold" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search waybill, customer, destination..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }}><X size={14} /></button>}
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
              {[['all', 'All'], ['ready', 'Ready'], ['assigned', 'Assigned'], ['in_transit', 'In Transit'], ['delivered', 'Delivered']].map(([v, l]) => (
                <button key={v} onClick={() => { setFilter(v); setPage(1); }} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: filter === v ? theme.accent.primary : 'transparent', color: filter === v ? theme.accent.contrast : theme.text.muted }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <th className="p-3 w-10">
                    <input type="checkbox" checked={selected.length === paginated.length && paginated.length > 0} onChange={e => setSelected(e.target.checked ? paginated.map(p => p.id) : [])} className="rounded" />
                  </th>
                  {[['waybill', 'Package'], ['customer', 'Customer'], ['deliveryMethod', 'Method', 'hidden lg:table-cell'], ['destination', 'Destination', 'hidden md:table-cell'], ['status', 'Status'], ['', 'Actions']].map(([f, l, cls = '']) => (
                    <th key={l} onClick={() => f && toggleSort(f)} className={`text-left p-3 text-xs font-semibold uppercase cursor-pointer select-none ${cls}`} style={{ color: theme.text.muted }}>
                      <span className="flex items-center gap-1">{l}{f && <SortIcon field={f} />}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map(pkg => (
                  <tr key={pkg.id} className="hover:bg-white/3" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <td className="p-3">
                      <input type="checkbox" checked={selected.includes(pkg.id)} onChange={() => setSelected(p => p.includes(pkg.id) ? p.filter(x => x !== pkg.id) : [...p, pkg.id])} className="rounded" />
                    </td>
                    <td className="p-3">
                      <p className="text-xs font-mono font-medium" style={{ color: theme.accent.primary }}>{pkg.waybill}</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.size} · {pkg.weight}</p>
                    </td>
                    <td className="p-3 hidden md:table-cell">
                      <p className="text-sm" style={{ color: theme.text.primary }}>{pkg.customer}</p>
                      <p className="text-xs font-mono" style={{ color: theme.text.muted }}>{pkg.phone}</p>
                    </td>
                    <td className="p-3 hidden lg:table-cell"><DeliveryMethodBadge method={pkg.deliveryMethod} /></td>
                    <td className="p-3 hidden md:table-cell">
                      <p className="text-sm" style={{ color: theme.text.primary }}>{pkg.destination}</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{(() => { const t = terminalsData.find(x => x.name === pkg.destination); return t ? getTerminalAddress(t) : pkg.destination; })()}</p>
                    </td>
                    <td className="p-3"><StatusBadge status={pkg.status} /></td>
                    <td className="p-3">
                      <div className="flex items-center gap-1 justify-end">
                        {hasPermission(currentUser?.role, 'packages.dispatch') && ['pending', 'at_warehouse', 'at_dropbox'].includes(pkg.status) && (
                          <button onClick={() => handleDispatch(pkg)} className="p-1.5 rounded-lg hover:bg-white/5" title="Assign to Courier" style={{ color: '#7EA8C9' }}><Truck size={14} /></button>
                        )}
                        {hasPermission(currentUser?.role, 'packages.dispatch') && pkg.status === 'assigned' && (
                          <button onClick={() => handlePackageRecall(pkg)} className="p-1.5 rounded-lg hover:bg-white/5" title="Recall from Courier" style={{ color: '#D48E8A' }}><RefreshCw size={14} /></button>
                        )}
                        {hasPermission(currentUser?.role, 'packages.update') && !['delivered_to_locker', 'delivered_to_home', 'picked_up'].includes(pkg.status) && (
                          <button onClick={() => handleMarkDelivered(pkg)} className="p-1.5 rounded-lg hover:bg-white/5" title="Mark Delivered" style={{ color: '#81C995' }}><CheckCircle2 size={14} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-sm" style={{ color: theme.text.muted }}>No packages found</td></tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} pageSize={pageSize} onPageSizeChange={s => { setPageSize(s); setPage(1); }} totalItems={filteredPackages.length} />
            </div>
          )}

          {/* Bulk Action Bar */}
          {selected.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl" style={{ backgroundColor: theme.bg.card, border: `1.5px solid ${theme.border.primary}` }}>
              <span className="text-sm font-medium" style={{ color: theme.text.secondary }}>{selected.length} selected</span>
              <div style={{ width: 1, height: 18, backgroundColor: theme.border.primary }} />
              {hasPermission(currentUser?.role, 'packages.dispatch') && (
                <button onClick={handleBulkDispatch} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
                  <Truck size={14} /> Dispatch All
                </button>
              )}
              <button onClick={() => setSelected([])} className="px-3 py-2 rounded-xl text-sm" style={{ color: theme.text.muted, backgroundColor: theme.bg.input }}>Clear</button>
            </div>
          )}
        </>
      )}

      {/* ════════════════ ROUTE PLANNING ════════════════ */}
      {activeTab === 'Route Planning' && (
        <>
          {!selectedRoute ? (
            <>
              {/* Route Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Active Routes', value: `${routes.filter(r => r.status === 'active').length} / ${routes.length}`, color: theme.accent.primary },
                  { label: 'Total Stops', value: routes.reduce((s, r) => s + r.stops.length, 0), color: '#7EA8C9' },
                  { label: 'Packages Out', value: routes.reduce((s, r) => s + r.stops.reduce((ss, st) => ss + st.packages.length, 0), 0), color: '#D4AA5A' },
                  { label: 'Avg Completion', value: (() => { const t = routes.reduce((s, r) => { const pkg = r.stops.reduce((ss, st) => ss + st.packages.length, 0); const del = r.stops.reduce((ss, st) => ss + st.delivered, 0); return { pkg: s.pkg + pkg, del: s.del + del }; }, { pkg: 0, del: 0 }); return t.pkg ? `${Math.round(t.del / t.pkg * 100)}%` : '—'; })(), color: '#81C995' },
                ].map(m => (
                  <div key={m.label} className="p-4 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <p className="text-xs mb-1" style={{ color: theme.text.muted }}>{m.label}</p>
                    <p className="text-xl font-bold" style={{ color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>

              {/* Route Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {routes.map(route => {
                  const totalPkg = route.stops.reduce((s, st) => s + st.packages.length, 0);
                  const delPkg = route.stops.reduce((s, st) => s + st.delivered, 0);
                  const pct = totalPkg ? Math.round(delPkg / totalPkg * 100) : 0;
                  const statusColor = route.status === 'active' ? '#81C995' : route.status === 'completed' ? '#7EA8C9' : '#D4AA5A';
                  return (
                    <div key={route.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
                        <div className="flex items-center justify-between mb-1">
                          <div>
                            <p className="font-semibold" style={{ color: theme.text.primary }}>{route.zone}</p>
                            <p className="text-xs font-mono" style={{ color: theme.text.muted }}>{route.id}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ backgroundColor: `${statusColor}15`, color: statusColor }}>{route.status}</span>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-xs mb-1" style={{ color: theme.text.muted }}>
                            <span>Delivery progress</span>
                            <span style={{ color: pct === 100 ? '#81C995' : theme.text.secondary }}>{pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full" style={{ backgroundColor: theme.bg.tertiary }}>
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#81C995' : '#D4AA5A' }} />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          {[['Stops', route.stops.length], ['Distance', route.distance], ['Start', route.startTime], ['ETA', route.estEndTime]].map(([l, v]) => (
                            <div key={l}><span style={{ color: theme.text.muted }}>{l}: </span><span className="font-medium" style={{ color: theme.text.secondary }}>{v}</span></div>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex gap-1">
                            {route.stops.map(s => <div key={s.id} className="w-2 h-2 rounded-full" style={{ backgroundColor: STOP_COLORS[s.status] }} />)}
                          </div>
                          <span className="text-xs" style={{ color: theme.text.muted }}>{route.stops.map(s => s.terminal).slice(0, 2).join(' → ')}{route.stops.length > 2 ? ` +${route.stops.length - 2}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary }}>{route.driver?.name?.charAt(0)}</div>
                          <div>
                            <p className="text-xs font-medium" style={{ color: theme.text.primary }}>{route.driver?.name}</p>
                            <p className="text-xs font-mono" style={{ color: theme.text.muted }}>{route.driver?.vehicle?.split(' - ')[1] || '—'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => { setSelectedRoute(route); setRouteTab('stops'); }} className="flex-1 py-2 rounded-xl text-xs border" style={{ borderColor: theme.accent.border, color: theme.accent.primary }}>View Details</button>
                          {route.status === 'pending' && (
                            <button onClick={() => handleStartRoute(route.id)} className="px-3 py-2 rounded-xl text-xs font-medium" style={{ backgroundColor: '#10B98118', color: '#10B981', border: '1px solid #10B98130' }} title="Start Route">▶</button>
                          )}
                          {route.status === 'active' && (
                            <button onClick={() => handleCompleteRoute(route.id)} className="px-3 py-2 rounded-xl text-xs font-medium" style={{ backgroundColor: '#7EA8C918', color: '#7EA8C9', border: '1px solid #7EA8C930' }} title="Complete Route">✓</button>
                          )}
                          <button onClick={() => setDeleteRoute(route)} className="p-2 rounded-xl border" style={{ borderColor: theme.border.primary, color: '#D48E8A' }}><Trash2 size={13} /></button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* ── Route Detail View ── */
            <>
              <button onClick={() => setSelectedRoute(null)} className="flex items-center gap-2 text-sm mb-5 hover:opacity-80" style={{ color: theme.text.secondary }}>
                <ChevronLeft size={16} />Back to Routes
              </button>

              {/* Detail Header */}
              <div className="p-5 rounded-2xl border mb-5" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="font-bold text-lg" style={{ color: theme.text.primary }}>{selectedRoute.zone}</h2>
                      <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: selectedRoute.status === 'active' ? '#81C99520' : selectedRoute.status === 'completed' ? '#7EA8C920' : '#D4AA5A20', color: selectedRoute.status === 'active' ? '#81C995' : selectedRoute.status === 'completed' ? '#7EA8C9' : '#D4AA5A' }}>{selectedRoute.status}</span>
                      {selectedRoute.status === 'pending' && (
                        <button onClick={() => handleStartRoute(selectedRoute.id)} className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: '#10B98118', color: '#10B981', border: '1px solid #10B98130' }}>
                          <Truck size={11} /> Start Route
                        </button>
                      )}
                      {selectedRoute.status === 'active' && (
                        <button onClick={() => handleCompleteRoute(selectedRoute.id)} className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: '#7EA8C918', color: '#7EA8C9', border: '1px solid #7EA8C930' }}>
                          <CheckCircle2 size={11} /> Complete Route
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs" style={{ color: theme.text.muted }}>
                      <span>ID: <span className="font-mono" style={{ color: theme.text.secondary }}>{selectedRoute.id}</span></span>
                      <span>{selectedRoute.distance}</span>
                      <span>Start: {selectedRoute.startTime}</span>
                      <span>ETA: {selectedRoute.estEndTime}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary }}>{selectedRoute.driver?.name?.charAt(0)}</div>
                    <div>
                      <p className="font-medium text-sm" style={{ color: theme.text.primary }}>{selectedRoute.driver?.name}</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{selectedRoute.driver?.phone}</p>
                    </div>
                    {/* Reassign Driver */}
                    <div className="flex items-center gap-2">
                      <select value={reassignDriverId} onChange={e => setReassignDriverId(e.target.value)} className="px-2 py-1.5 rounded-lg border text-xs" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                        <option value="">Reassign...</option>
                        {drivers.filter(d => d.status !== 'offline' && d.id !== selectedRoute.driver?.id).map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                      {reassignDriverId && (
                        <button onClick={() => handleReassignDriver(selectedRoute.id)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>Apply</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Route Tabs */}
              <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit" style={{ backgroundColor: theme.bg.tertiary }}>
                {['stops', 'packages', 'timeline'].map(t => (
                  <button key={t} onClick={() => setRouteTab(t)} className="px-4 py-1.5 rounded-lg text-sm capitalize font-medium" style={{ backgroundColor: routeTab === t ? theme.accent.primary : 'transparent', color: routeTab === t ? theme.accent.contrast : theme.text.muted }}>
                    {t}
                  </button>
                ))}
              </div>

              {/* ── Stops Tab ── */}
              {routeTab === 'stops' && (
                <div className="space-y-3">
                  {(routes.find(r => r.id === selectedRoute.id)?.stops ?? []).map((stop, i) => {
                    const isExpanded = expandedStops.includes(stop.id);
                    const stopColor = STOP_COLORS[stop.status];
                    return (
                      <div key={stop.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <div className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: `${stopColor}20`, color: stopColor }}>{i + 1}</div>
                            <div className="flex-1">
                              <p className="font-medium" style={{ color: theme.text.primary }}>{stop.terminal}</p>
                              <p className="text-xs" style={{ color: theme.text.muted }}>{(() => { const t = terminalsData.find(x => x.name === stop.terminal); return t ? getTerminalAddress(t) : stop.terminal; })()} · ETA {stop.eta}{stop.arrivedAt ? ` · Arrived ${stop.arrivedAt}` : ''}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: `${stopColor}20`, color: stopColor }}>{stop.status.replace('_', ' ')}</span>
                              <div className="flex gap-1">
                                {stop.status !== 'completed' && (
                                  <button onClick={() => handleMarkStopComplete(selectedRoute.id, stop.id)} className="p-1.5 rounded-lg hover:bg-white/5" title="Mark Complete" style={{ color: '#81C995' }}><CheckCircle2 size={14} /></button>
                                )}
                                <button onClick={() => handleRemoveStop(selectedRoute.id, stop.id)} className="p-1.5 rounded-lg hover:bg-white/5" title="Remove Stop" style={{ color: '#D48E8A' }}><Trash2 size={14} /></button>
                                <button onClick={() => setExpandedStops(p => isExpanded ? p.filter(x => x !== stop.id) : [...p, stop.id])} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.icon.muted }}>
                                  {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-4 mt-2 text-xs" style={{ color: theme.text.muted }}>
                            <span>{stop.packages.length} packages assigned</span>
                            <span style={{ color: '#81C995' }}>{stop.delivered} delivered</span>
                          </div>
                        </div>
                        {isExpanded && stop.packages.length > 0 && (
                          <div className="border-t px-4 py-2" style={{ borderColor: theme.border.primary }}>
                            {stop.packages.map(pkgId => {
                              const pkg = packages.find(p => p.id === pkgId);
                              if (!pkg) return null;
                              return (
                                <div key={pkgId} className="flex items-center gap-3 py-2 border-b last:border-0" style={{ borderColor: theme.border.primary }}>
                                  <p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{pkg.waybill}</p>
                                  <p className="text-xs flex-1" style={{ color: theme.text.secondary }}>{pkg.customer}</p>
                                  <p className="text-xs hidden md:block" style={{ color: theme.text.muted }}>{pkg.size}</p>
                                  <StatusBadge status={pkg.status} />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {/* Add Stop */}
                  {(routes.find(r => r.id === selectedRoute.id)?.status ?? 'pending') !== 'completed' && (
                    <div className="flex gap-2">
                      <select value={addStopTerminal} onChange={e => setAddStopTerminal(e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}>
                        <option value="">Add a stop...</option>
                        {terminalsData.filter(t => !(routes.find(r => r.id === selectedRoute.id)?.stops ?? []).find(s => s.terminal === t.name)).map(t => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                      <button onClick={() => handleAddStop(selectedRoute.id)} disabled={!addStopTerminal} className="px-4 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ── Packages Tab ── */}
              {routeTab === 'packages' && (() => {
                const routePackageIds = (routes.find(r => r.id === selectedRoute.id)?.stops ?? []).flatMap(s => s.packages);
                const routePkgs = packages.filter(p => routePackageIds.includes(p.id));
                const del = routePkgs.filter(p => p.status.startsWith('delivered')).length;
                return (
                  <div>
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[['Total', routePkgs.length, theme.text.primary], ['Delivered', del, '#81C995'], ['Pending', routePkgs.length - del, '#D4AA5A']].map(([l, v, c]) => (
                        <div key={l} className="p-3 rounded-xl border text-center" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                          <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                          <p className="text-xl font-bold" style={{ color: c }}>{v}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <table className="w-full">
                        <thead><tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                          {['Waybill', 'Customer', 'Size', 'Status'].map(h => <th key={h} className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>{h}</th>)}
                        </tr></thead>
                        <tbody>
                          {routePkgs.map(pkg => (
                            <tr key={pkg.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <td className="p-3 font-mono text-xs" style={{ color: theme.accent.primary }}>{pkg.waybill}</td>
                              <td className="p-3 text-sm" style={{ color: theme.text.secondary }}>{pkg.customer}</td>
                              <td className="p-3 text-sm" style={{ color: theme.text.muted }}>{pkg.size}</td>
                              <td className="p-3"><StatusBadge status={pkg.status} /></td>
                            </tr>
                          ))}
                          {routePkgs.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-sm" style={{ color: theme.text.muted }}>No packages on this route</td></tr>}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* ── Timeline Tab ── */}
              {routeTab === 'timeline' && (
                <div className="space-y-3">
                  {(routes.find(r => r.id === selectedRoute.id)?.timeline ?? []).map((ev, i) => {
                    const Icon = TIMELINE_ICONS[ev.icon] || Clock;
                    const timelineLen = routes.find(r => r.id === selectedRoute.id)?.timeline?.length ?? 0;
                    return (
                      <div key={i} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.bg.tertiary }}><Icon size={14} style={{ color: theme.accent.primary }} /></div>
                          {i < timelineLen - 1 && <div className="w-px flex-1 mt-2" style={{ backgroundColor: theme.border.primary }} />}
                        </div>
                        <div className="pb-4">
                          <p className="text-sm" style={{ color: theme.text.primary }}>{ev.event}</p>
                          <p className="text-xs" style={{ color: theme.text.muted }}>{ev.time} · {ev.by}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ════════════════ DRIVER ASSIGNMENT ════════════════ */}
      {activeTab === 'Driver Assignment' && (
        <>
          {/* Driver Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Drivers', value: drivers.length, color: theme.accent.primary },
              { label: 'Active', value: drivers.filter(d => d.status === 'active').length, color: '#81C995' },
              { label: 'On Delivery', value: drivers.filter(d => d.status === 'on_delivery').length, color: '#D4AA5A' },
              { label: 'Offline', value: drivers.filter(d => d.status === 'offline').length, color: '#78716C' },
            ].map(m => (
              <div key={m.label} className="p-4 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <p className="text-xs mb-1" style={{ color: theme.text.muted }}>{m.label}</p>
                <p className="text-xl font-bold" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="relative max-w-sm mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
            <input value={driverSearch} onChange={e => setDriverSearch(e.target.value)} placeholder="Search name, zone, phone..." className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
          </div>

          {/* Drivers Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  {[['name', 'Driver'], ['vehicle', 'Vehicle', 'hidden md:table-cell'], ['zone', 'Zone', 'hidden lg:table-cell'], ['status', 'Status'], ['deliveriesToday', 'Deliveries'], ['rating', 'Rating', 'hidden md:table-cell'], ['', 'Actions']].map(([f, l, cls = '']) => (
                    <th key={l} onClick={() => f && setDriverSort(s => ({ field: f, dir: s.field === f && s.dir === 'asc' ? 'desc' : 'asc' }))} className={`text-left p-3 text-xs font-semibold uppercase cursor-pointer ${cls}`} style={{ color: theme.text.muted }}>{l}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map(driver => {
                  const statusColor = driver.status === 'active' ? '#81C995' : driver.status === 'on_delivery' ? '#D4AA5A' : '#78716C';
                  const cap = Math.round(driver.deliveriesToday / 20 * 100);
                  return (
                    <tr key={driver.id} className="hover:bg-white/3" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: `${statusColor}20`, color: statusColor }}>{driver.name.charAt(0)}</div>
                            {driver.status === 'active' && <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-current animate-pulse" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{driver.name}</p>
                            <p className="text-xs font-mono" style={{ color: theme.text.muted }}>{driver.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell text-sm" style={{ color: theme.text.secondary }}>{driver.vehicle}</td>
                      <td className="p-3 hidden lg:table-cell text-sm" style={{ color: theme.text.muted }}>{driver.zone}</td>
                      <td className="p-3">
                        <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ backgroundColor: `${statusColor}15`, color: statusColor }}>{driver.status.replace('_', ' ')}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: theme.bg.tertiary }}>
                            <div className="h-full rounded-full" style={{ width: `${Math.min(cap, 100)}%`, backgroundColor: cap > 80 ? '#D48E8A' : cap > 50 ? '#D4AA5A' : '#81C995' }} />
                          </div>
                          <span className="text-xs" style={{ color: theme.text.secondary }}>{driver.deliveriesToday}/20</span>
                        </div>
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <span className="text-xs flex items-center gap-1" style={{ color: '#D4AA5A' }}><Star size={10} fill="#D4AA5A" />{driver.rating}</span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button onClick={() => setDriverDrawer(driver)} className="p-1.5 rounded-lg hover:bg-white/5" title="Edit" style={{ color: theme.icon.muted }}><Edit size={13} /></button>
                          {driver.status === 'on_delivery' && hasPermission(currentUser?.role, 'packages.dispatch') && (
                            <button onClick={() => handleRecall(driver)} className="p-1.5 rounded-lg hover:bg-white/5" title="Recall" style={{ color: '#D4AA5A' }}><RefreshCw size={13} /></button>
                          )}
                          <button onClick={() => setDeleteDriver(driver)} className="p-1.5 rounded-lg hover:bg-white/5" title="Delete" style={{ color: '#D48E8A' }}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredDrivers.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-sm" style={{ color: theme.text.muted }}>No drivers found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};
