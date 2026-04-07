import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Download, Plus, Search, X, Eye, CheckCircle2, RefreshCw, MapPin, Grid3X3, ArrowUpRight, ArrowDownRight, UserCheck, User, Trash2, LayoutGrid, List, ChevronRight, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Checkbox, EmptyState, TableSkeleton, Pagination } from '../components/ui';
import { StatusBadge, DeliveryMethodBadge } from '../components/ui/Badge';
import { hasPermission, DELIVERY_METHODS } from '../constants';
import { terminalsData, getTerminalAddress, getLockerAddress } from '../constants/mockData';

export const PackagesPage = ({
  currentUser,
  loading,
  activeSubMenu,
  filteredPackages,
  paginatedPackages,
  packageSearch,
  setPackageSearch,
  packageFilter,
  setPackageFilter,
  methodFilter,
  setMethodFilter,
  packageSort,
  setPackageSort,
  currentPage,
  setCurrentPage,
  pageSize,
  setPageSize,
  totalPages,
  selectedItems,
  toggleSelectAll,
  toggleSelectItem,
  setShowExport,
  setShowNewPackage,
  setSelectedPackage,
  setReassignPackage,
  setAssignCourierPackage,
  onMarkDelivered,
  onDeletePackage,
  addToast,
}) => {
  const { theme } = useTheme();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [view, setView] = useState('list');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [localFilters, setLocalFilters] = useState({ size: 'all', cod: 'all', destination: 'all', minValue: '', maxValue: '', daysInLocker: 'all' });
  const filterPanelRef = useRef(null);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => { if (filterPanelRef.current && !filterPanelRef.current.contains(e.target)) setShowFilterPanel(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const destinations = useMemo(() => ['all', ...Array.from(new Set((filteredPackages || []).map(p => p.destination))).sort()], [filteredPackages]);

  const localFiltered = useMemo(() => {
    return (filteredPackages || []).filter(p => {
      if (localFilters.size !== 'all' && p.size.toLowerCase().replace(' ', '_') !== localFilters.size) return false;
      if (localFilters.cod === 'cod' && !p.cod) return false;
      if (localFilters.cod === 'non_cod' && p.cod) return false;
      if (localFilters.destination !== 'all' && p.destination !== localFilters.destination) return false;
      if (localFilters.minValue !== '' && p.value < Number(localFilters.minValue)) return false;
      if (localFilters.maxValue !== '' && p.value > Number(localFilters.maxValue)) return false;
      if (localFilters.daysInLocker === '0' && p.daysInLocker !== 0) return false;
      if (localFilters.daysInLocker === '1-2' && !(p.daysInLocker >= 1 && p.daysInLocker <= 2)) return false;
      if (localFilters.daysInLocker === '3-5' && !(p.daysInLocker >= 3 && p.daysInLocker <= 5)) return false;
      if (localFilters.daysInLocker === '5+' && p.daysInLocker <= 5) return false;
      return true;
    });
  }, [filteredPackages, localFilters]);

  const localPaginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return localFiltered.slice(start, start + pageSize);
  }, [localFiltered, currentPage, pageSize]);

  const localTotalPages = Math.max(1, Math.ceil(localFiltered.length / pageSize));

  const activeFilterCount = Object.entries(localFilters).filter(([k, v]) => v !== 'all' && v !== '').length;
  const setLF = (k, v) => { setLocalFilters(p => ({ ...p, [k]: v })); };
  const clearFilters = () => setLocalFilters({ size: 'all', cod: 'all', destination: 'all', minValue: '', maxValue: '', daysInLocker: 'all' });

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Packages</h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'All Packages'} • {localFiltered.length}{localFiltered.length !== filteredPackages.length ? ` of ${filteredPackages.length}` : ''} packages</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Download size={16} /> Export
          </button>
          {hasPermission(currentUser.role, 'packages.receive') && (
            <button onClick={() => setShowNewPackage(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
              <Plus size={18} /> Add Package
            </button>
          )}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Total</p>
          <p className="text-2xl font-bold mt-1" style={{ color: theme.text.primary }}>{localFiltered.length}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>In Locker</p>
          <p className="text-2xl font-bold mt-1" style={{ color: theme.text.primary }}>{filteredPackages.filter(p => p.status === 'delivered_to_locker').length}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>In Transit</p>
          <p className="text-2xl font-bold mt-1" style={{ color: theme.text.primary }}>{filteredPackages.filter(p => p.status.startsWith('in_transit')).length}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Pending</p>
          <p className="text-2xl font-bold mt-1" style={{ color: theme.text.primary }}>{filteredPackages.filter(p => ['pending', 'at_warehouse', 'at_dropbox'].includes(p.status)).length}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Total Value</p>
          <p className="text-2xl font-bold mt-1" style={{ color: theme.accent.primary }}>GH₵ {filteredPackages.reduce((sum, p) => sum + p.value, 0).toLocaleString()}</p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3">
        <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <Search size={18} style={{ color: theme.icon.muted }} />
          <input
            type="text"
            value={packageSearch}
            onChange={e => { setPackageSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by waybill, customer, phone, destination..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: theme.text.primary }}
          />
          {packageSearch && <button onClick={() => { setPackageSearch(''); setCurrentPage(1); }} className="p-1 rounded" style={{ color: theme.text.muted }}><X size={16} /></button>}
        </div>

        {/* Filter button */}
        <div className="relative" ref={filterPanelRef}>
          <button
            onClick={() => setShowFilterPanel(p => !p)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all"
            style={{
              backgroundColor: showFilterPanel || activeFilterCount > 0 ? theme.accent.light : theme.bg.card,
              borderColor: activeFilterCount > 0 ? theme.accent.primary : theme.border.primary,
              color: activeFilterCount > 0 ? theme.accent.primary : theme.text.secondary,
            }}
          >
            <SlidersHorizontal size={16} />
            Filters
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
                {activeFilterCount}
              </span>
            )}
            <ChevronDown size={14} style={{ transform: showFilterPanel ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>

          {/* Filter Panel */}
          {showFilterPanel && (
            <div
              className="absolute right-0 top-full mt-2 w-80 rounded-2xl border shadow-2xl z-40 p-4 space-y-5"
              style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}
            >
              {/* Size */}
              <div>
                <p className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>Package Size</p>
                <div className="flex flex-wrap gap-2">
                  {[['all', 'All'], ['small', 'Small'], ['medium', 'Medium'], ['large', 'Large'], ['xlarge', 'XLarge']].map(([k, l]) => (
                    <button key={k} onClick={() => setLF('size', k)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                      style={{ backgroundColor: localFilters.size === k ? theme.accent.primary : 'transparent', color: localFilters.size === k ? theme.accent.contrast : theme.text.secondary, borderColor: localFilters.size === k ? theme.accent.primary : theme.border.primary }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* COD */}
              <div>
                <p className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>Payment</p>
                <div className="flex gap-2">
                  {[['all', 'All'], ['cod', 'COD Only'], ['non_cod', 'Non-COD']].map(([k, l]) => (
                    <button key={k} onClick={() => setLF('cod', k)}
                      className="flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all"
                      style={{ backgroundColor: localFilters.cod === k ? theme.accent.primary : 'transparent', color: localFilters.cod === k ? theme.accent.contrast : theme.text.secondary, borderColor: localFilters.cod === k ? theme.accent.primary : theme.border.primary }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination */}
              <div>
                <p className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>Destination</p>
                <select
                  value={localFilters.destination}
                  onChange={e => setLF('destination', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm"
                  style={{ backgroundColor: 'transparent', borderColor: theme.border.primary, color: theme.text.primary }}
                >
                  {destinations.map(d => <option key={d} value={d}>{d === 'all' ? 'All Destinations' : d}</option>)}
                </select>
              </div>

              {/* Value Range */}
              <div>
                <p className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>Value (GH₵)</p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={localFilters.minValue}
                    onChange={e => setLF('minValue', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border text-sm bg-transparent"
                    style={{ borderColor: theme.border.primary, color: theme.text.primary }}
                  />
                  <span style={{ color: theme.text.muted }}>—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={localFilters.maxValue}
                    onChange={e => setLF('maxValue', e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border text-sm bg-transparent"
                    style={{ borderColor: theme.border.primary, color: theme.text.primary }}
                  />
                </div>
              </div>

              {/* Days in Locker */}
              <div>
                <p className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>Days in Locker</p>
                <div className="flex gap-2 flex-wrap">
                  {[['all', 'Any'], ['0', '0d'], ['1-2', '1–2d'], ['3-5', '3–5d'], ['5+', '5+d']].map(([k, l]) => (
                    <button key={k} onClick={() => setLF('daysInLocker', k)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium border transition-all"
                      style={{ backgroundColor: localFilters.daysInLocker === k ? '#D4AA5A' : 'transparent', color: localFilters.daysInLocker === k ? '#fff' : theme.text.secondary, borderColor: localFilters.daysInLocker === k ? '#D4AA5A' : theme.border.primary }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="w-full py-2 rounded-xl text-sm border" style={{ borderColor: '#D48E8A40', color: '#D48E8A' }}>
                  Clear {activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 -mt-2">
          {localFilters.size !== 'all' && <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border" style={{ backgroundColor: theme.accent.light, borderColor: theme.accent.border, color: theme.accent.primary }}>Size: {localFilters.size}<button onClick={() => setLF('size', 'all')}><X size={11} /></button></span>}
          {localFilters.cod !== 'all' && <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border" style={{ backgroundColor: theme.accent.light, borderColor: theme.accent.border, color: theme.accent.primary }}>{localFilters.cod === 'cod' ? 'COD Only' : 'Non-COD'}<button onClick={() => setLF('cod', 'all')}><X size={11} /></button></span>}
          {localFilters.destination !== 'all' && <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border" style={{ backgroundColor: theme.accent.light, borderColor: theme.accent.border, color: theme.accent.primary }}>{localFilters.destination}<button onClick={() => setLF('destination', 'all')}><X size={11} /></button></span>}
          {(localFilters.minValue !== '' || localFilters.maxValue !== '') && <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border" style={{ backgroundColor: theme.accent.light, borderColor: theme.accent.border, color: theme.accent.primary }}>GH₵ {localFilters.minValue || '0'} – {localFilters.maxValue || '∞'}<button onClick={() => { setLF('minValue', ''); setLF('maxValue', ''); }}><X size={11} /></button></span>}
          {localFilters.daysInLocker !== 'all' && <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs border" style={{ backgroundColor: '#D4AA5A15', borderColor: '#D4AA5A40', color: '#D4AA5A' }}>Locker: {localFilters.daysInLocker}d<button onClick={() => setLF('daysInLocker', 'all')}><X size={11} /></button></span>}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {[['all', 'All'], ['locker', 'In Locker'], ['pending_pickup', 'Pending Pickup'], ['transit', 'In Transit'], ['expired', 'Expired']].map(([k, l]) => (
            <button key={k} onClick={() => { setPackageFilter(k); setCurrentPage(1); }} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: packageFilter === k ? theme.accent.light : 'transparent', color: packageFilter === k ? theme.accent.primary : theme.text.muted, border: packageFilter === k ? `1px solid ${theme.accent.border}` : '1px solid transparent' }}>{l}</button>
          ))}
        </div>
        <div className="h-6 w-px hidden md:block" style={{ backgroundColor: theme.border.primary }} />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm" style={{ color: theme.text.muted }}>Method:</span>
          {[['all', 'All'], ...Object.entries(DELIVERY_METHODS).map(([k, v]) => [k, v.label])].map(([k, l]) => (
            <button key={k} onClick={() => { setMethodFilter(k); setCurrentPage(1); }} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: methodFilter === k ? (DELIVERY_METHODS[k]?.color || theme.accent.primary) + '15' : 'transparent', color: methodFilter === k ? DELIVERY_METHODS[k]?.color || theme.accent.primary : theme.text.muted }}>{l}</button>
          ))}
        </div>
        <div className="ml-auto flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
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

      {/* Grid View */}
      {view === 'grid' && !loading && localFiltered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {localPaginated.map(pkg => (
            <div key={pkg.id} onClick={() => setSelectedPackage(pkg)} className="p-4 rounded-2xl border cursor-pointer group hover:border-opacity-80 transition-all space-y-3" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono font-semibold text-sm" style={{ color: theme.text.primary }}>{pkg.waybill}</p>
                  <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{pkg.product}</p>
                </div>
                <StatusBadge status={pkg.status} />
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: `${theme.accent.primary}20`, color: theme.accent.primary }}>{pkg.customer.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{pkg.customer}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.phone}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={12} style={{ color: theme.text.muted }} />
                <p className="text-xs truncate" style={{ color: theme.text.secondary }}>{pkg.destination}</p>
              </div>
              {pkg.locker !== '-' && (
                <div className="flex items-center gap-1.5">
                  <Grid3X3 size={12} style={{ color: theme.accent.primary }} />
                  <span className="text-xs font-mono font-medium" style={{ color: theme.accent.primary }}>{pkg.locker}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: theme.border.primary }}>
                <DeliveryMethodBadge method={pkg.deliveryMethod} />
                <span className="text-xs font-semibold" style={{ color: theme.text.primary }}>GH₵ {pkg.value}{pkg.cod && <span className="ml-1 text-amber-500">COD</span>}</span>
              </div>
              <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                <button onClick={() => setSelectedPackage(pkg)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }} title="View"><Eye size={14} /></button>
                {hasPermission(currentUser.role, 'packages.update') && (
                  <>
                    <button onClick={() => onMarkDelivered(pkg)} className="p-1.5 rounded-lg hover:bg-white/5 text-emerald-500" title="Mark Delivered"><CheckCircle2 size={14} /></button>
                    <button onClick={() => setReassignPackage(pkg)} className="p-1.5 rounded-lg hover:bg-white/5 text-amber-500" title="Reassign"><RefreshCw size={14} /></button>
                  </>
                )}
                {hasPermission(currentUser.role, 'packages.delete') && (
                  <button onClick={() => setDeleteConfirm(pkg)} className="p-1.5 rounded-lg hover:bg-white/5 text-red-400" title="Delete"><Trash2 size={14} /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {view === 'grid' && !loading && localFiltered.length === 0 && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <EmptyState icon={Plus} title="No packages found" description="There are no packages matching your current filters." theme={theme} />
        </div>
      )}

      {/* List/Table View */}
      {view === 'list' && <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
        {loading ? <TableSkeleton rows={pageSize} cols={7} theme={theme} /> : localFiltered.length === 0 ? (
          <EmptyState icon={Plus} title="No packages found" description="There are no packages matching your current filters. Try adjusting your search criteria." action="Add New Package" theme={theme} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <th className="text-left p-4 w-10">
                      <Checkbox checked={selectedItems.length === localPaginated.length && localPaginated.length > 0} onChange={toggleSelectAll} theme={theme} />
                    </th>
                    {[
                      { label: 'Package', field: 'waybill', cls: '' },
                      { label: 'Customer', field: 'customer', cls: 'hidden md:table-cell' },
                      { label: 'Method', field: null, cls: 'hidden lg:table-cell' },
                      { label: 'Destination', field: 'destination', cls: 'hidden md:table-cell' },
                      { label: 'Status', field: 'status', cls: '' },
                      { label: 'Courier', field: null, cls: 'hidden lg:table-cell' },
                      { label: 'Value', field: 'value', cls: 'hidden lg:table-cell' },
                    ].map(col => (
                      <th key={col.label} className={`text-left p-4 text-xs font-semibold uppercase ${col.cls}`} style={{ color: theme.text.muted }}>
                        {col.field ? (
                          <button onClick={() => setPackageSort(prev => ({ field: col.field, dir: prev.field === col.field && prev.dir === 'asc' ? 'desc' : 'asc' }))} className="flex items-center gap-1 hover:opacity-80">
                            {col.label}
                            {packageSort.field === col.field && (
                              packageSort.dir === 'asc' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />
                            )}
                          </button>
                        ) : col.label}
                      </th>
                    ))}
                    <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {localPaginated.map(pkg => (
                    <tr key={pkg.id} className="cursor-pointer hover:bg-white/5" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                      <td className="p-4" onClick={e => e.stopPropagation()}>
                        <Checkbox checked={selectedItems.includes(pkg.id)} onChange={() => toggleSelectItem(pkg.id)} theme={theme} />
                      </td>
                      <td className="p-4" onClick={() => setSelectedPackage(pkg)}>
                        <p className="font-mono font-medium" style={{ color: theme.text.primary }}>{pkg.waybill}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.product}</p>
                      </td>
                      <td className="p-4 hidden md:table-cell" onClick={() => setSelectedPackage(pkg)}>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>{pkg.customer.charAt(0)}</div>
                          <div>
                            <p className="text-sm" style={{ color: theme.text.primary }}>{pkg.customer}</p>
                            <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden lg:table-cell" onClick={() => setSelectedPackage(pkg)}><DeliveryMethodBadge method={pkg.deliveryMethod} /></td>
                      <td className="p-4 hidden md:table-cell" onClick={() => setSelectedPackage(pkg)}>
                        <div className="flex items-start gap-2">
                          <MapPin size={14} className="mt-0.5 shrink-0" style={{ color: theme.icon.muted }} />
                          <div>
                            <p className="text-sm" style={{ color: theme.text.primary }}>{pkg.destination}</p>
                            {pkg.locker !== '-' && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Grid3X3 size={12} style={{ color: theme.accent.primary }} />
                                <span className="text-xs font-mono font-medium" style={{ color: theme.accent.primary }}>{pkg.locker}</span>
                                {(() => { const t = terminalsData.find(t => t.name === pkg.destination); return t ? <span className="text-xs font-mono" style={{ color: theme.text.muted }}>({getLockerAddress(pkg.locker, pkg.destination)})</span> : null; })()}
                              </div>
                            )}
                            {pkg.locker === '-' && (() => { const t = terminalsData.find(t => t.name === pkg.destination); return t ? <p className="text-xs font-mono mt-0.5" style={{ color: theme.text.muted }}>{getTerminalAddress(t)}</p> : null; })()}
                          </div>
                        </div>
                      </td>
                      <td className="p-4" onClick={() => setSelectedPackage(pkg)}><StatusBadge status={pkg.status} /></td>
                      <td className="p-4 hidden lg:table-cell" onClick={e => e.stopPropagation()}>
                        {pkg.courier ? (
                          <button
                            onClick={() => setAssignCourierPackage(pkg)}
                            className="flex items-center gap-1.5 group"
                            title="Reassign courier"
                          >
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ backgroundColor: `${theme.accent.primary}20`, color: theme.accent.primary }}>
                              {pkg.courier.name.charAt(0)}
                            </div>
                            <span className="text-sm group-hover:underline" style={{ color: theme.text.primary }}>{pkg.courier.name}</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setAssignCourierPackage(pkg)}
                            className="flex items-center gap-1.5 text-xs rounded-lg px-2 py-1 border"
                            style={{ borderColor: theme.border.primary, color: theme.text.muted }}
                            title="Assign courier"
                          >
                            <User size={12} /> Assign
                          </button>
                        )}
                      </td>
                      <td className="p-4 hidden lg:table-cell" onClick={() => setSelectedPackage(pkg)}>
                        <span className="text-sm" style={{ color: theme.text.primary }}>GH₵ {pkg.value}</span>
                        {pkg.cod && <span className="ml-2 text-xs text-amber-500">COD</span>}
                      </td>
                      <td className="p-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setSelectedPackage(pkg)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }} title="View"><Eye size={15} /></button>
                          {hasPermission(currentUser.role, 'packages.update') && (
                            <>
                              <button onClick={() => onMarkDelivered(pkg)} className="p-1.5 rounded-lg hover:bg-white/5 text-emerald-500" title="Mark Delivered"><CheckCircle2 size={15} /></button>
                              <button onClick={() => setReassignPackage(pkg)} className="p-1.5 rounded-lg hover:bg-white/5 text-amber-500" title="Reassign"><RefreshCw size={15} /></button>
                              <button onClick={() => setAssignCourierPackage(pkg)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.accent.primary }} title="Assign Courier"><UserCheck size={15} /></button>
                            </>
                          )}
                          {hasPermission(currentUser.role, 'packages.delete') && (
                            <button onClick={() => setDeleteConfirm(pkg)} className="p-1.5 rounded-lg hover:bg-white/5 text-red-400" title="Delete"><Trash2 size={15} /></button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination currentPage={currentPage} totalPages={localTotalPages} onPageChange={setCurrentPage} pageSize={pageSize} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} totalItems={localFiltered.length} theme={theme} />
          </>
        )}
      </div>}

      {view === 'grid' && localFiltered.length > 0 && (
        <Pagination currentPage={currentPage} totalPages={localTotalPages} onPageChange={setCurrentPage} pageSize={pageSize} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} totalItems={localFiltered.length} theme={theme} />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-sm rounded-2xl border p-6 space-y-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-lg" style={{ color: theme.text.primary }}>Delete Package?</h3>
            <p className="text-sm" style={{ color: theme.text.muted }}>
              Remove <span className="font-mono font-semibold" style={{ color: theme.text.primary }}>{deleteConfirm.waybill}</span> permanently? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
              <button onClick={() => { onDeletePackage(deleteConfirm); setDeleteConfirm(null); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: '#D48E8A', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
