import React from 'react';
import { FileDown, Plus, Search, X, Package, Truck, Eye, CheckCircle2, MapPin, ArrowUpRight, ArrowDownRight, Route, Users, Clock, ChevronLeft, GripVertical, ChevronUp, ChevronDown, Car, RefreshCw } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { TableSkeleton, Pagination } from '../components/ui';
import { StatusBadge, DeliveryMethodBadge } from '../components/ui/Badge';
import { hasPermission } from '../constants';
import { packagesData, driversData, terminalsData, routesData, getTerminalAddress } from '../constants/mockData';

export const DispatchPage = ({
  currentUser,
  activeSubMenu,
  loading,
  setShowExport,
  setShowDispatchDrawer,
  filteredDispatchPackages,
  dispatchSearch,
  setDispatchSearch,
  setDispatchPage,
  dispatchFilter,
  setDispatchFilter,
  selectedDispatchItems,
  paginatedDispatchPackages,
  toggleDispatchSelectAll,
  toggleDispatchSelectItem,
  dispatchSort,
  setDispatchSort,
  setSelectedPackage,
  addToast,
  dispatchTotalPages,
  dispatchPage,
  dispatchPageSize,
  setDispatchPageSize,
  selectedRoute,
  setSelectedRoute,
  routeTab,
  setRouteTab,
  expandedStops,
  setExpandedStops,
  driverSearch,
  setDriverSearch,
  driverSort,
  setDriverSort,
  filteredDrivers,
}) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Dispatch</h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Outgoing'}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><FileDown size={18} />Export</button>
          <button onClick={() => setShowDispatchDrawer(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}><Plus size={18} />New Dispatch</button>
        </div>
      </div>

      {/* Outgoing Sub-tab */}
      {(!activeSubMenu || activeSubMenu === 'Outgoing') && (
        <div className="space-y-4">
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Ready</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#f59e0b' }}>{filteredDispatchPackages.filter(p => ['pending', 'at_warehouse', 'at_dropbox'].includes(p.status)).length}</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>In Transit</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#3b82f6' }}>{filteredDispatchPackages.filter(p => p.status.startsWith('in_transit')).length}</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Delivered</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#10b981' }}>{filteredDispatchPackages.filter(p => p.status.startsWith('delivered')).length}</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Active Drivers</p>
              <p className="text-2xl font-bold mt-1" style={{ color: theme.text.primary }}>{driversData.filter(d => d.status !== 'offline').length}</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Total Value</p>
              <p className="text-2xl font-bold mt-1" style={{ color: theme.accent.primary }}>GH₵ {filteredDispatchPackages.reduce((sum, p) => sum + p.value, 0).toLocaleString()}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <Search size={18} style={{ color: theme.icon.muted }} />
            <input type="text" value={dispatchSearch} onChange={e => { setDispatchSearch(e.target.value); setDispatchPage(1); }} placeholder="Search by waybill, customer, phone, destination..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: theme.text.primary }} />
            {dispatchSearch && <button onClick={() => { setDispatchSearch(''); setDispatchPage(1); }} className="p-1 rounded" style={{ color: theme.text.muted }}><X size={16} /></button>}
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex flex-wrap gap-2">
              {[['all', 'All'], ['ready', 'Ready'], ['in_transit', 'In Transit'], ['delivered', 'Delivered']].map(([k, l]) => (
                <button key={k} onClick={() => { setDispatchFilter(k); setDispatchPage(1); }} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: dispatchFilter === k ? theme.accent.light : 'transparent', color: dispatchFilter === k ? theme.accent.primary : theme.text.muted, border: dispatchFilter === k ? `1px solid ${theme.accent.border}` : '1px solid transparent' }}>{l}</button>
              ))}
            </div>
            <div className="h-6 w-px hidden md:block" style={{ backgroundColor: theme.border.primary }} />
            <div className="flex items-center gap-2 text-sm" style={{ color: theme.text.muted }}>
              <span>{filteredDispatchPackages.length} package{filteredDispatchPackages.length !== 1 ? 's' : ''}</span>
              {selectedDispatchItems.length > 0 && <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary }}>{selectedDispatchItems.length} selected</span>}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            {loading ? <TableSkeleton rows={5} cols={7} theme={theme} /> : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <th className="p-4 w-10"><input type="checkbox" checked={paginatedDispatchPackages.length > 0 && selectedDispatchItems.length === paginatedDispatchPackages.length} onChange={toggleDispatchSelectAll} className="rounded" /></th>
                    {[
                      { label: 'Package', field: 'waybill', cls: '' },
                      { label: 'Customer', field: 'customer', cls: 'hidden md:table-cell' },
                      { label: 'Method', field: null, cls: 'hidden lg:table-cell' },
                      { label: 'Destination', field: 'destination', cls: 'hidden md:table-cell' },
                      { label: 'Size', field: 'size', cls: 'hidden lg:table-cell' },
                      { label: 'Status', field: 'status', cls: '' },
                    ].map(col => (
                      <th key={col.label} className={`text-left p-4 text-xs font-semibold uppercase ${col.cls}`} style={{ color: theme.text.muted }}>
                        {col.field ? (
                          <button onClick={() => setDispatchSort(prev => ({ field: col.field, dir: prev.field === col.field && prev.dir === 'asc' ? 'desc' : 'asc' }))} className="flex items-center gap-1 hover:opacity-80">
                            {col.label}
                            {dispatchSort.field === col.field && (dispatchSort.dir === 'asc' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}
                          </button>
                        ) : col.label}
                      </th>
                    ))}
                    <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDispatchPackages.map(pkg => (
                    <tr key={pkg.id} className="hover:bg-white/5 cursor-pointer" style={{ borderBottom: `1px solid ${theme.border.primary}` }} onClick={() => setSelectedPackage(pkg)}>
                      <td className="p-4" onClick={e => e.stopPropagation()}><input type="checkbox" checked={selectedDispatchItems.includes(pkg.id)} onChange={() => toggleDispatchSelectItem(pkg.id)} className="rounded" /></td>
                      <td className="p-4">
                        <span className="font-mono text-sm" style={{ color: theme.accent.primary }}>{pkg.waybill}</span>
                        <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{pkg.size} · {pkg.weight}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell">
                        <p className="text-sm" style={{ color: theme.text.primary }}>{pkg.customer}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.phone}</p>
                      </td>
                      <td className="p-4 hidden lg:table-cell"><DeliveryMethodBadge method={pkg.deliveryMethod} /></td>
                      <td className="p-4 hidden md:table-cell">
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: theme.icon.muted }} />
                          <div>
                            <p className="text-sm" style={{ color: theme.text.primary }}>{pkg.destination}</p>
                            {(() => { const t = terminalsData.find(t => t.name === pkg.destination); return t ? <p className="text-xs font-mono mt-0.5" style={{ color: theme.text.muted }}>{getTerminalAddress(t)}</p> : null; })()}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{pkg.size}</span></td>
                      <td className="p-4"><StatusBadge status={pkg.status} /></td>
                      <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedPackage(pkg)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }} title="View"><Eye size={15} /></button>
                          {hasPermission(currentUser.role, 'packages.dispatch') && (
                            <button onClick={() => addToast({ type: 'info', message: `${pkg.waybill} dispatched` })} className="p-1.5 rounded-lg hover:bg-white/5 text-blue-500" title="Dispatch"><Truck size={15} /></button>
                          )}
                          {hasPermission(currentUser.role, 'packages.update') && (
                            <button onClick={() => addToast({ type: 'success', message: `${pkg.waybill} marked as delivered` })} className="p-1.5 rounded-lg hover:bg-white/5 text-emerald-500" title="Mark Delivered"><CheckCircle2 size={15} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginatedDispatchPackages.length === 0 && (
                    <tr><td colSpan={9} className="p-12 text-center" style={{ color: theme.text.muted }}>
                      <Package size={40} className="mx-auto mb-3 opacity-30" />
                      <p className="text-sm">No packages match your filters</p>
                    </td></tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {dispatchTotalPages > 1 && (
            <Pagination currentPage={dispatchPage} totalPages={dispatchTotalPages} onPageChange={setDispatchPage} pageSize={dispatchPageSize} onPageSizeChange={(s) => { setDispatchPageSize(s); setDispatchPage(1); }} totalItems={filteredDispatchPackages.length} theme={theme} />
          )}
        </div>
      )}

      {/* Route Planning Sub-tab */}
      {activeSubMenu === 'Route Planning' && (
        <div className="space-y-4">
          {!selectedRoute ? (
            <>
              {/* ====== ROUTE LIST VIEW ====== */}
              {/* Summary Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                  <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Routes</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: theme.accent.primary }}>{routesData.filter(r => r.status === 'active').length}<span className="text-sm font-normal" style={{ color: theme.text.muted }}>/{routesData.length}</span></p>
                  <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>active</p>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                  <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Total Stops</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#3b82f6' }}>{routesData.reduce((s, r) => s + r.stops.length, 0)}</p>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                  <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Packages</p>
                  <p className="text-2xl font-bold mt-1" style={{ color: '#10b981' }}>{routesData.reduce((s, r) => s + r.stops.reduce((ss, st) => ss + st.packages.length, 0), 0)}</p>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                  <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Avg Completion</p>
                  {(() => {
                    const totalPkgs = routesData.reduce((s, r) => s + r.stops.reduce((ss, st) => ss + st.packages.length, 0), 0);
                    const totalDel = routesData.reduce((s, r) => s + r.stops.reduce((ss, st) => ss + st.delivered, 0), 0);
                    return <p className="text-2xl font-bold mt-1" style={{ color: '#f59e0b' }}>{totalPkgs > 0 ? Math.round((totalDel / totalPkgs) * 100) : 0}%</p>;
                  })()}
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center gap-3" style={{ borderColor: theme.border.secondary, backgroundColor: theme.bg.card }}>
                <div className="p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}><MapPin size={28} style={{ color: theme.icon.muted }} /></div>
                <p className="font-medium text-sm" style={{ color: theme.text.secondary }}>Map View Coming Soon</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {terminalsData.map(t => (
                    <span key={t.id} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted }}>{t.name} ({t.lat.toFixed(2)}, {t.lng.toFixed(2)})</span>
                  ))}
                </div>
              </div>

              {/* Create Route + Optimize buttons */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium" style={{ color: theme.text.secondary }}>{routesData.length} routes</p>
                <div className="flex gap-2">
                  <button onClick={() => addToast({ type: 'success', message: 'Routes optimized successfully' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Route size={16} /> Optimize</button>
                  <button onClick={() => addToast({ type: 'info', message: 'Create route wizard coming soon' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}><Plus size={16} /> Create Route</button>
                </div>
              </div>

              {/* Route Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {routesData.map(r => {
                  const totalPkgs = r.stops.reduce((s, st) => s + st.packages.length, 0);
                  const totalDel = r.stops.reduce((s, st) => s + st.delivered, 0);
                  const pct = totalPkgs > 0 ? Math.round((totalDel / totalPkgs) * 100) : 0;
                  const statusColors = { active: '#10b981', pending: '#f59e0b', completed: '#6b7280' };
                  const clr = statusColors[r.status] || '#6b7280';
                  return (
                    <div key={r.id} className="rounded-2xl border overflow-hidden cursor-pointer hover:shadow-lg transition-shadow" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={() => { setSelectedRoute(r); setRouteTab('stops'); setExpandedStops([]); }}>
                      <div className="p-4">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-semibold" style={{ color: theme.text.primary }}>{r.zone}</p>
                            <p className="text-xs font-mono" style={{ color: theme.text.muted }}>{r.id}</p>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ backgroundColor: clr + '15', color: clr }}>{r.status}</span>
                        </div>

                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span style={{ color: theme.text.muted }}>{totalDel}/{totalPkgs} delivered</span>
                            <span style={{ color: theme.text.muted }}>{pct}%</span>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: clr }} />
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                          <div><span style={{ color: theme.text.muted }}>Stops:</span> <span style={{ color: theme.text.primary }}>{r.stops.length}</span></div>
                          <div><span style={{ color: theme.text.muted }}>Distance:</span> <span style={{ color: theme.text.primary }}>{r.distance}</span></div>
                          <div><span style={{ color: theme.text.muted }}>Start:</span> <span style={{ color: theme.text.primary }}>{r.startTime}</span></div>
                          <div><span style={{ color: theme.text.muted }}>ETA:</span> <span style={{ color: theme.text.primary }}>{r.estEndTime}</span></div>
                        </div>

                        {/* Stop Preview */}
                        <div className="flex items-center gap-1.5 mb-3">
                          {r.stops.map((st, i) => {
                            const stClr = st.status === 'completed' ? '#10b981' : st.status === 'in_progress' ? '#3b82f6' : theme.border.secondary;
                            return (
                              <React.Fragment key={st.id}>
                                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: stClr }} title={st.terminal} />
                                {i < r.stops.length - 1 && <div className="flex-1 h-px" style={{ backgroundColor: theme.border.secondary }} />}
                              </React.Fragment>
                            );
                          })}
                        </div>
                        <div className="flex gap-2 text-xs overflow-hidden" style={{ color: theme.text.muted }}>
                          {r.stops.slice(0, 3).map(st => <span key={st.id} className="truncate">{st.terminal}</span>)}
                          {r.stops.length > 3 && <span>+{r.stops.length - 3}</span>}
                        </div>

                        {/* Driver */}
                        <div className="flex items-center gap-2 pt-3 mt-3 border-t" style={{ borderColor: theme.border.primary }}>
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: clr }}>{r.driver.name.charAt(0)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm truncate" style={{ color: theme.text.primary }}>{r.driver.name}</p>
                            <p className="text-xs font-mono truncate" style={{ color: theme.text.muted }}>{r.driver.vehicle.split(' - ')[1]}</p>
                          </div>
                          {r.status === 'active' && <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0" />}
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="flex border-t" style={{ borderColor: theme.border.primary }}>
                        <button onClick={(e) => { e.stopPropagation(); setSelectedRoute(r); setRouteTab('stops'); setExpandedStops([]); }} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs hover:bg-white/5" style={{ color: theme.accent.primary }}>
                          <Eye size={14} /> View Details
                        </button>
                        <div className="w-px" style={{ backgroundColor: theme.border.primary }} />
                        <button onClick={(e) => { e.stopPropagation(); addToast({ type: 'info', message: `Reassigning route: ${r.zone}` }); }} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs hover:bg-white/5" style={{ color: theme.text.muted }}>
                          <RefreshCw size={14} /> Reassign
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              {/* ====== ROUTE DETAIL VIEW ====== */}
              {(() => {
                const r = selectedRoute;
                const totalPkgs = r.stops.reduce((s, st) => s + st.packages.length, 0);
                const totalDel = r.stops.reduce((s, st) => s + st.delivered, 0);
                const statusColors = { active: '#10b981', pending: '#f59e0b', completed: '#6b7280' };
                const clr = statusColors[r.status] || '#6b7280';
                const allRoutePkgs = r.stops.flatMap(st => st.packages.map(pid => ({ ...packagesData.find(p => p.id === pid), stopTerminal: st.terminal, stopStatus: st.status }))).filter(p => p.id);
                return (
                  <div className="space-y-4">
                    {/* Back + Header */}
                    <div className="flex items-center gap-3">
                      <button onClick={() => setSelectedRoute(null)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><ChevronLeft size={20} /></button>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h2 className="font-semibold text-lg" style={{ color: theme.text.primary }}>{r.zone}</h2>
                          <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ backgroundColor: clr + '15', color: clr }}>{r.status}</span>
                        </div>
                        <p className="text-xs font-mono" style={{ color: theme.text.muted }}>{r.id} · {r.distance} · {r.startTime} — {r.estEndTime}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: clr }}>{r.driver.name.charAt(0)}</div>
                        <div className="hidden sm:block">
                          <p className="text-sm" style={{ color: theme.text.primary }}>{r.driver.name}</p>
                          <p className="text-xs" style={{ color: theme.text.muted }}>{r.driver.phone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4 text-sm">
                          <span style={{ color: theme.text.muted }}>{r.stops.filter(s => s.status === 'completed').length}/{r.stops.length} stops completed</span>
                          <span style={{ color: theme.text.muted }}>{totalDel}/{totalPkgs} packages delivered</span>
                        </div>
                        <span className="text-sm font-semibold" style={{ color: clr }}>{totalPkgs > 0 ? Math.round((totalDel / totalPkgs) * 100) : 0}%</span>
                      </div>
                      <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${totalPkgs > 0 ? (totalDel / totalPkgs) * 100 : 0}%`, backgroundColor: clr }} />
                      </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                      {['stops', 'packages', 'timeline'].map(tab => (
                        <button key={tab} onClick={() => setRouteTab(tab)} className="flex-1 px-4 py-2 rounded-lg text-sm capitalize" style={{ backgroundColor: routeTab === tab ? theme.bg.card : 'transparent', color: routeTab === tab ? theme.text.primary : theme.text.muted, boxShadow: routeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>{tab}</button>
                      ))}
                    </div>

                    {/* ---- STOPS TAB ---- */}
                    {routeTab === 'stops' && (
                      <div className="space-y-0">
                        {r.stops.map((stop, idx) => {
                          const terminal = terminalsData.find(t => t.name === stop.terminal);
                          const stopPkgs = stop.packages.map(pid => packagesData.find(p => p.id === pid)).filter(Boolean);
                          const isExpanded = expandedStops.includes(stop.id);
                          const stClr = stop.status === 'completed' ? '#10b981' : stop.status === 'in_progress' ? '#3b82f6' : '#9ca3af';
                          return (
                            <div key={stop.id} className="flex gap-3">
                              {/* Timeline column */}
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0" style={{ backgroundColor: stClr }}>{stop.order}</div>
                                {idx < r.stops.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: theme.border.secondary }} />}
                              </div>
                              {/* Stop Card */}
                              <div className="flex-1 mb-3 rounded-xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                                <div className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium" style={{ color: theme.text.primary }}>{stop.terminal}</p>
                                        <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: stClr + '15', color: stClr }}>{stop.status.replace('_', ' ')}</span>
                                      </div>
                                      {terminal && <p className="text-xs font-mono mt-0.5" style={{ color: theme.text.muted }}>{getTerminalAddress(terminal)}</p>}
                                      <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: theme.text.muted }}>
                                        <span>ETA: {stop.eta}</span>
                                        {stop.arrivedAt && <span>Arrived: {stop.arrivedAt}</span>}
                                        <span>{stop.packages.length} pkg{stop.packages.length !== 1 ? 's' : ''}</span>
                                        <span>{stop.delivered} delivered</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <button onClick={() => addToast({ type: 'success', message: `Stop ${stop.order} marked complete` })} className="p-1.5 rounded-lg hover:bg-white/5 text-emerald-500" title="Mark Complete"><CheckCircle2 size={15} /></button>
                                      <button onClick={() => addToast({ type: 'info', message: `Stop ${stop.order} skipped` })} className="p-1.5 rounded-lg hover:bg-white/5 text-amber-500" title="Skip"><ArrowUpRight size={15} /></button>
                                      <button onClick={() => addToast({ type: 'warning', message: `Stop ${stop.order} removed` })} className="p-1.5 rounded-lg hover:bg-white/5 text-red-500" title="Remove Stop"><X size={15} /></button>
                                      <div className="p-1.5 cursor-grab" style={{ color: theme.text.muted }} title="Drag to reorder"><GripVertical size={15} /></div>
                                    </div>
                                  </div>
                                </div>

                                {/* Expand to see packages */}
                                {stopPkgs.length > 0 && (
                                  <>
                                    <button onClick={() => setExpandedStops(prev => prev.includes(stop.id) ? prev.filter(i => i !== stop.id) : [...prev, stop.id])} className="w-full flex items-center justify-center gap-1 py-1.5 text-xs border-t hover:bg-white/5" style={{ borderColor: theme.border.primary, color: theme.text.muted }}>
                                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                      {isExpanded ? 'Hide' : 'Show'} {stopPkgs.length} package{stopPkgs.length !== 1 ? 's' : ''}
                                    </button>
                                    {isExpanded && (
                                      <div className="border-t" style={{ borderColor: theme.border.primary }}>
                                        {stopPkgs.map(pkg => (
                                          <div key={pkg.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                                            <Package size={14} style={{ color: theme.icon.muted }} />
                                            <span className="font-mono text-xs" style={{ color: theme.accent.primary }}>{pkg.waybill}</span>
                                            <span className="text-xs flex-1" style={{ color: theme.text.secondary }}>{pkg.customer}</span>
                                            <span className="text-xs" style={{ color: theme.text.muted }}>{pkg.size}</span>
                                            <StatusBadge status={pkg.status} />
                                            <button onClick={() => setSelectedPackage(pkg)} className="p-1 rounded hover:bg-white/5" style={{ color: theme.text.muted }}><Eye size={13} /></button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {/* Add Stop */}
                        <div className="flex gap-3">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-dashed shrink-0" style={{ borderColor: theme.border.secondary, color: theme.text.muted }}><Plus size={14} /></div>
                          </div>
                          <div className="flex-1 mb-3">
                            <select onChange={(e) => { if (e.target.value) { addToast({ type: 'success', message: `${e.target.value} added as stop ${r.stops.length + 1}` }); e.target.value = ''; } }} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }}>
                              <option value="">Add stop...</option>
                              {terminalsData.filter(t => !r.stops.find(s => s.terminal === t.name)).map(t => (
                                <option key={t.id} value={t.name}>{t.name} — {t.location}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ---- PACKAGES TAB ---- */}
                    {routeTab === 'packages' && (
                      <div className="space-y-4">
                        {/* Package Summary */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-3 rounded-xl text-center" style={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
                            <p className="text-lg font-bold" style={{ color: theme.text.primary }}>{totalPkgs}</p>
                            <p className="text-xs" style={{ color: theme.text.muted }}>Total</p>
                          </div>
                          <div className="p-3 rounded-xl text-center" style={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
                            <p className="text-lg font-bold" style={{ color: '#10b981' }}>{totalDel}</p>
                            <p className="text-xs" style={{ color: theme.text.muted }}>Delivered</p>
                          </div>
                          <div className="p-3 rounded-xl text-center" style={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
                            <p className="text-lg font-bold" style={{ color: '#f59e0b' }}>{totalPkgs - totalDel}</p>
                            <p className="text-xs" style={{ color: theme.text.muted }}>Pending</p>
                          </div>
                        </div>

                        {/* Package Table */}
                        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                          <table className="w-full">
                            <thead>
                              <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Waybill</th>
                                <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Customer</th>
                                <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Stop</th>
                                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                                <th className="text-left p-3 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Size</th>
                                <th className="text-right p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {allRoutePkgs.length > 0 ? allRoutePkgs.map(pkg => (
                                <tr key={pkg.id} className="hover:bg-white/5" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                                  <td className="p-3"><span className="font-mono text-sm" style={{ color: theme.accent.primary }}>{pkg.waybill}</span></td>
                                  <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.primary }}>{pkg.customer}</span></td>
                                  <td className="p-3 hidden md:table-cell"><span className="text-xs" style={{ color: theme.text.muted }}>{pkg.stopTerminal}</span></td>
                                  <td className="p-3"><StatusBadge status={pkg.status} /></td>
                                  <td className="p-3 hidden lg:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{pkg.size}</span></td>
                                  <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                      <button onClick={() => setSelectedPackage(pkg)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }} title="View"><Eye size={15} /></button>
                                      <button onClick={() => addToast({ type: 'warning', message: `${pkg.waybill} removed from route` })} className="p-1.5 rounded-lg hover:bg-white/5 text-red-500" title="Remove"><X size={15} /></button>
                                    </div>
                                  </td>
                                </tr>
                              )) : (
                                <tr><td colSpan={6} className="p-8 text-center" style={{ color: theme.text.muted }}>
                                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                                  <p className="text-sm">No packages assigned to this route</p>
                                </td></tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* ---- TIMELINE TAB ---- */}
                    {routeTab === 'timeline' && (
                      <div className="rounded-2xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <div className="space-y-0">
                          {r.timeline.map((evt, idx) => {
                            const iconMap = { route: Route, user: Users, truck: Truck, mappin: MapPin, package: Package };
                            const EvtIcon = iconMap[evt.icon] || Clock;
                            return (
                              <div key={idx} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: theme.bg.tertiary }}><EvtIcon size={14} style={{ color: theme.icon.muted }} /></div>
                                  {idx < r.timeline.length - 1 && <div className="w-0.5 flex-1 my-1" style={{ backgroundColor: theme.border.secondary }} />}
                                </div>
                                <div className="pb-4 flex-1">
                                  <p className="text-sm" style={{ color: theme.text.primary }}>{evt.event}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs" style={{ color: theme.text.muted }}>{evt.time}</span>
                                    <span className="text-xs" style={{ color: theme.text.muted }}>· {evt.by}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </>
          )}
        </div>
      )}

      {/* Driver Assignment Sub-tab */}
      {activeSubMenu === 'Driver Assignment' && (
        <div className="space-y-4">
          {/* Driver Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Total Drivers</p>
              <p className="text-2xl font-bold mt-1" style={{ color: theme.text.primary }}>{driversData.length}</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Active</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#10b981' }}>{driversData.filter(d => d.status === 'active').length}</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>On Delivery</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#3b82f6' }}>{driversData.filter(d => d.status === 'on_delivery').length}</p>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Offline</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#ef4444' }}>{driversData.filter(d => d.status === 'offline').length}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <Search size={18} style={{ color: theme.icon.muted }} />
            <input type="text" value={driverSearch} onChange={e => setDriverSearch(e.target.value)} placeholder="Search by driver name, phone, zone..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: theme.text.primary }} />
            {driverSearch && <button onClick={() => setDriverSearch('')} className="p-1 rounded" style={{ color: theme.text.muted }}><X size={16} /></button>}
          </div>

          {/* Drivers Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  {[
                    { label: 'Driver', field: 'name', cls: '' },
                    { label: 'Vehicle', field: null, cls: 'hidden md:table-cell' },
                    { label: 'Zone', field: 'zone', cls: 'hidden lg:table-cell' },
                    { label: 'Status', field: 'status', cls: '' },
                    { label: 'Deliveries', field: 'deliveriesToday', cls: '' },
                    { label: 'Rating', field: 'rating', cls: 'hidden md:table-cell' },
                  ].map(col => (
                    <th key={col.label} className={`text-left p-4 text-xs font-semibold uppercase ${col.cls}`} style={{ color: theme.text.muted }}>
                      {col.field ? (
                        <button onClick={() => setDriverSort(prev => ({ field: col.field, dir: prev.field === col.field && prev.dir === 'asc' ? 'desc' : 'asc' }))} className="flex items-center gap-1 hover:opacity-80">
                          {col.label}
                          {driverSort.field === col.field && (driverSort.dir === 'asc' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}
                        </button>
                      ) : col.label}
                    </th>
                  ))}
                  <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDrivers.map(d => {
                  const driverColors = { active: '#10b981', on_delivery: '#3b82f6', offline: '#6b7280' };
                  const capacity = 20;
                  return (
                  <tr key={d.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: driverColors[d.status] || '#6b7280' }}>{d.name.charAt(0)}</div>
                          {d.status === 'active' && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2" style={{ borderColor: theme.bg.card }} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{d.name}</p>
                          <p className="text-xs" style={{ color: theme.text.muted }}>{d.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <p className="text-sm" style={{ color: theme.text.secondary }}>{d.vehicle.split(' - ')[0]}</p>
                      <p className="text-xs font-mono" style={{ color: theme.text.muted }}>{d.vehicle.split(' - ')[1]}</p>
                    </td>
                    <td className="p-4 hidden lg:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{d.zone}</span></td>
                    <td className="p-4"><StatusBadge status={d.status} /></td>
                    <td className="p-4">
                      <div>
                        <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{d.deliveriesToday}</span>
                        <span className="text-xs" style={{ color: theme.text.muted }}>/{capacity}</span>
                      </div>
                      <div className="w-16 h-1.5 rounded-full mt-1 overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                        <div className="h-full rounded-full" style={{ width: `${Math.min((d.deliveriesToday / capacity) * 100, 100)}%`, backgroundColor: d.deliveriesToday > capacity * 0.8 ? '#ef4444' : d.deliveriesToday > capacity * 0.5 ? '#f59e0b' : '#10b981' }} />
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: '#f59e0b' }}>★ {d.rating}</span></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => addToast({ type: 'info', message: `Viewing ${d.name}'s details` })} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }} title="View"><Eye size={15} /></button>
                        {hasPermission(currentUser.role, 'packages.dispatch') && d.status !== 'offline' && (
                          <button onClick={() => addToast({ type: 'success', message: `Packages assigned to ${d.name}` })} className="p-1.5 rounded-lg hover:bg-white/5 text-blue-500" title="Assign Packages"><Package size={15} /></button>
                        )}
                        {hasPermission(currentUser.role, 'packages.dispatch') && d.status === 'on_delivery' && (
                          <button onClick={() => addToast({ type: 'info', message: `${d.name} recalled` })} className="p-1.5 rounded-lg hover:bg-white/5 text-amber-500" title="Recall Driver"><RefreshCw size={15} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ); })}
                {filteredDrivers.length === 0 && (
                  <tr><td colSpan={7} className="p-12 text-center" style={{ color: theme.text.muted }}>
                    <Car size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No drivers match your search</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
