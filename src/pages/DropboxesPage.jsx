import React, { useState } from 'react';
import { Inbox, Download, Plus, CheckCircle2, AlertTriangle, Clock, Package, Truck, Eye, Edit, Calendar, UserCheck, Route, Phone, RefreshCw, UserPlus, MessageSquare, Building2, Grid3X3, ChevronRight, Check, Circle, ArrowUpRight, ArrowDownRight, Search, CheckCircle, LayoutGrid, List, Filter } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { GlassCard } from '../components/ui/Card';
import { MetricCard, TableSkeleton } from '../components/ui';
import { StatusBadge } from '../components/ui/Badge';
import { hasPermission } from '../constants';
import { dropboxesData, collectionsData, dropboxAgentsData, dropboxFillHistory, dropboxFlowData, DROPBOX_FLOW_STAGES } from '../constants/mockData';

export const DropboxesPage = ({
  currentUser,
  loading,
  setLoading,
  activeSubMenu,
  setShowExport,
  addToast,
  collectionSearch,
  setCollectionSearch,
  collectionStatusFilter,
  setCollectionStatusFilter,
  collectionSort,
  setCollectionSort,
  filteredCollections,
}) => {
  const { theme } = useTheme();

  // Modal states
  const [showAddDropbox, setShowAddDropbox] = useState(false);
  const [showDispatchConfirm, setShowDispatchConfirm] = useState(false);
  const [detailDrawer, setDetailDrawer] = useState(null); // dropbox object or null
  const [editDropbox, setEditDropbox] = useState(null); // dropbox object or null
  const [showScheduleCollection, setShowScheduleCollection] = useState(false);
  const [showOptimizeRoutes, setShowOptimizeRoutes] = useState(false);
  const [optimizeProgress, setOptimizeProgress] = useState(false);
  const [callAgent, setCallAgent] = useState(null); // { name, phone }
  const [messageAgent, setMessageAgent] = useState(null); // { name, phone }
  const [messageText, setMessageText] = useState('');
  const [reassignModal, setReassignModal] = useState(null); // { type, id, label }
  const [showAssignAgent, setShowAssignAgent] = useState(false);
  const [showAutoBalance, setShowAutoBalance] = useState(false);

  // Form states for Add/Edit Dropbox
  const [dropboxForm, setDropboxForm] = useState({ name: '', address: '', lat: '', lng: '', capacity: '', agent: '', hours: '' });

  // Form states for Schedule Collection
  const [scheduleForm, setScheduleForm] = useState({ dropbox: '', date: '', time: '', agent: '', priority: 'normal' });

  // Reassign selected agent
  const [reassignAgent, setReassignAgent] = useState('');

  // Assign agent selected
  const [assignAgentSelected, setAssignAgentSelected] = useState('');

  // View toggle & sorting for Overview dropbox grid
  const [dbxView, setDbxView] = useState('grid');
  const [dbxSortBy, setDbxSortBy] = useState('name');
  const [dbxSortDir, setDbxSortDir] = useState('asc');
  const toggleDbxSort = (field) => {
    if (dbxSortBy === field) setDbxSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setDbxSortBy(field); setDbxSortDir('asc'); }
  };
  const sortedDropboxes = [...dropboxesData].sort((a, b) => {
    let av, bv;
    if (dbxSortBy === 'capacity') { av = a.currentFill / a.capacity; bv = b.currentFill / b.capacity; }
    else if (dbxSortBy === 'collections') { av = a.packagesOut; bv = b.packagesOut; }
    else { av = a[dbxSortBy]; bv = b[dbxSortBy]; }
    if (typeof av === 'string') { av = av.toLowerCase(); bv = (bv || '').toLowerCase(); }
    if (av < bv) return dbxSortDir === 'asc' ? -1 : 1;
    if (av > bv) return dbxSortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const resetDropboxForm = () => setDropboxForm({ name: '', address: '', lat: '', lng: '', capacity: '', agent: '', hours: '' });
  const resetScheduleForm = () => setScheduleForm({ dropbox: '', date: '', time: '', agent: '', priority: 'normal' });

  // Reusable modal overlay
  const ModalOverlay = ({ children, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-lg rounded-2xl border shadow-2xl overflow-auto max-h-[90vh]" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
        {children}
      </div>
    </div>
  );

  // Reusable drawer overlay (slides from right)
  const DrawerOverlay = ({ children, onClose }) => (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-md h-full overflow-auto border-l shadow-2xl" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
        {children}
      </div>
    </div>
  );

  // Reusable form input
  const FormInput = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: theme.text.muted }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="w-full px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
    </div>
  );

  // Reusable form select
  const FormSelect = ({ label, value, onChange, options }) => (
    <div>
      <label className="block text-xs font-semibold mb-1" style={{ color: theme.text.muted }}>{label}</label>
      <select value={value} onChange={onChange} className="w-full px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}>
        <option value="">Select...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
            <Inbox size={28} style={{ color: theme.chart.violet }} /> Dropbox Management
          </h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Overview'} • {dropboxesData.filter(d => d.status === 'active').length} active dropboxes</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExport(true)} className="btn-outline flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><Download size={16} />Export</button>
          {hasPermission(currentUser.role, 'packages.receive') && (
            <button onClick={() => { resetDropboxForm(); setShowAddDropbox(true); }} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><Plus size={18} />Add Dropbox</button>
          )}
        </div>
      </div>

      {/* Overview */}
      {(!activeSubMenu || activeSubMenu === 'Overview') && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MetricCard title="Total Dropboxes" value={dropboxesData.length} icon={Inbox} theme={theme} loading={loading} />
            <MetricCard title="Active" value={dropboxesData.filter(d => d.status === 'active').length} icon={CheckCircle2} theme={theme} loading={loading} />
            <MetricCard title="Full / Near Full" value={dropboxesData.filter(d => d.currentFill / d.capacity > 0.8).length} icon={AlertTriangle} theme={theme} loading={loading} subtitle="Need attention" />
            <MetricCard title="Packages Waiting" value={dropboxesData.reduce((s, d) => s + d.currentFill, 0)} icon={Package} theme={theme} loading={loading} />
            <MetricCard title="Overdue Collections" value={collectionsData.filter(c => c.status === 'overdue').length} icon={Clock} theme={theme} loading={loading} subtitle={collectionsData.filter(c => c.status === 'overdue').length > 0 ? 'Action required!' : 'All on time'} />
          </div>

          {/* Alerts Banner */}
          {dropboxesData.some(d => d.alerts.length > 0) && (
            <div className="p-4 rounded-2xl border flex items-start gap-4" style={{ backgroundColor: 'rgba(212,142,138,0.05)', borderColor: 'rgba(212,142,138,0.2)' }}>
              <AlertTriangle size={24} className="text-red-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-red-500 mb-1">Attention Required</p>
                <div className="flex flex-wrap gap-2">
                  {dropboxesData.filter(d => d.status === 'full').map(d => (
                    <span key={d.id} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(212,142,138,0.1)', color: theme.status.error }}>🔴 {d.name} is FULL — collection overdue</span>
                  ))}
                  {dropboxesData.filter(d => d.alerts.includes('near_full') && d.status !== 'full').map(d => (
                    <span key={d.id} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(212,170,90,0.1)', color: theme.status.warning }}>🟡 {d.name} at {Math.round(d.currentFill / d.capacity * 100)}% — schedule collection</span>
                  ))}
                  {dropboxesData.filter(d => d.alerts.includes('collection_due')).map(d => (
                    <span key={d.id} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(126,168,201,0.1)', color: theme.accent.primary }}>🔵 {d.name} collection due soon</span>
                  ))}
                </div>
              </div>
              <button onClick={() => setShowDispatchConfirm(true)} className="btn-primary px-4 py-2 rounded-xl text-sm shrink-0">Dispatch Now</button>
            </div>
          )}

          {/* Fill Level Chart */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Fill Levels Today</h3>
              <div className="flex gap-3">
                {[{ l: 'Achimota', c: theme.accent.primary }, { l: 'Osu', c: theme.chart.violet }, { l: 'Tema', c: theme.status.error }].map(i => (
                  <span key={i.l} className="flex items-center gap-1 text-xs" style={{ color: theme.text.muted }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: i.c }} />{i.l}</span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dropboxFillHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} labelStyle={{ color: theme.text.primary }} itemStyle={{ color: theme.text.secondary }} />
                <Area type="monotone" dataKey="dbx001" name="Achimota Overpass" stroke={theme.chart.blue} fill={theme.chart.blue + '20'} strokeWidth={2} />
                <Area type="monotone" dataKey="dbx003" name="Osu Oxford St" stroke={theme.chart.violet} fill="transparent" strokeWidth={2} />
                <Area type="monotone" dataKey="dbx004" name="Tema Comm. 1" stroke={theme.chart.coral} fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Dropbox Grid Header with View Toggle */}
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>All Dropboxes</h3>
            <span className="text-sm" style={{ color: theme.text.muted }}>({dropboxesData.length})</span>
            <div className="ml-auto flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
              {[['grid', LayoutGrid], ['list', List]].map(([v, Icon]) => (
                <button key={v} onClick={() => setDbxView(v)}
                  className="p-1.5 rounded-lg transition-all"
                  title={v === 'grid' ? 'Grid view' : 'List view'}
                  style={{ backgroundColor: dbxView === v ? theme.accent.primary : 'transparent', color: dbxView === v ? theme.accent.contrast : theme.text.muted }}>
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Grid View */}
          {dbxView === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedDropboxes.map(dbx => {
              const fillPercent = Math.round((dbx.currentFill / dbx.capacity) * 100);
              const fillColor = fillPercent >= 95 ? theme.status.error : fillPercent >= 75 ? theme.status.warning : fillPercent >= 50 ? theme.accent.primary : theme.status.success;
              const isUrgent = dbx.status === 'full' || dbx.alerts.includes('collection_overdue');
              return (
                <GlassCard noPadding key={dbx.id} className="overflow-hidden transition-all hover:shadow-lg" style={{ borderColor: isUrgent ? theme.status.error : undefined, borderWidth: isUrgent ? 2 : 1 }}>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: fillPercent >= 85 ? 'rgba(212,142,138,0.1)' : 'rgba(181,160,209,0.1)' }}>
                          <Inbox size={24} style={{ color: fillPercent >= 85 ? theme.status.error : theme.chart.violet }} />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: theme.text.primary }}>{dbx.name}</p>
                          <p className="text-xs" style={{ color: theme.text.muted }}>{dbx.id} • {dbx.location}</p>
                        </div>
                      </div>
                      <StatusBadge status={dbx.status} />
                    </div>

                    {/* Fill Level Gauge */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium" style={{ color: theme.text.muted }}>Fill Level</span>
                        <span className="text-sm font-bold" style={{ color: fillColor }}>{dbx.currentFill}/{dbx.capacity} ({fillPercent}%)</span>
                      </div>
                      <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: theme.border.primary }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${fillPercent}%`, backgroundColor: fillColor, boxShadow: fillPercent >= 85 ? `0 0 8px ${fillColor}40` : 'none' }} />
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-xs" style={{ color: theme.text.muted }}>0</span>
                        <span className="text-xs" style={{ color: theme.text.muted }}>{dbx.capacity}</span>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                        <p className="text-xs" style={{ color: theme.text.muted }}>Agent</p>
                        <p className="font-medium truncate" style={{ color: theme.text.primary }}>{dbx.assignedAgent || '—'}</p>
                      </div>
                      <div className="p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                        <p className="text-xs" style={{ color: theme.text.muted }}>Terminal</p>
                        <p className="font-medium truncate" style={{ color: theme.text.primary }}>{dbx.terminal}</p>
                      </div>
                      <div className="p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                        <p className="text-xs" style={{ color: theme.text.muted }}>Last Collection</p>
                        <p className="font-medium" style={{ color: theme.text.primary }}>{dbx.lastCollection?.split(' ')[1] || '—'}</p>
                      </div>
                      <div className="p-2 rounded-lg" style={{ backgroundColor: isUrgent ? 'rgba(212,142,138,0.1)' : theme.bg.tertiary }}>
                        <p className="text-xs" style={{ color: isUrgent ? theme.status.error : theme.text.muted }}>Next Collection</p>
                        <p className="font-medium" style={{ color: isUrgent ? theme.status.error : theme.text.primary }}>{dbx.nextCollection?.split(' ')[1] || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs" style={{ color: theme.text.muted }}>
                      <span>Avg. {dbx.avgDailyVolume}/day</span>
                      <span>Total out: {dbx.packagesOut}</span>
                      <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: dbx.type === 'premium' ? 'rgba(181,160,209,0.1)' : theme.bg.tertiary, color: dbx.type === 'premium' ? theme.chart.violet : theme.text.muted }}>{dbx.type}</span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex border-t" style={{ borderColor: theme.border.primary }}>
                    <button onClick={() => { setScheduleForm({ dropbox: dbx.id, date: '', time: '', agent: dbx.assignedAgent || '', priority: 'normal' }); setShowScheduleCollection(true); }} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: theme.chart.violet }}>
                      <Truck size={14} />Collect
                    </button>
                    <div className="w-px" style={{ backgroundColor: theme.border.primary }} />
                    <button onClick={() => setDetailDrawer(dbx)} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: theme.text.secondary }}>
                      <Eye size={14} />Details
                    </button>
                    <div className="w-px" style={{ backgroundColor: theme.border.primary }} />
                    <button onClick={() => { setDropboxForm({ name: dbx.name, address: dbx.address, lat: '', lng: '', capacity: String(dbx.capacity), agent: dbx.assignedAgent || '', hours: '' }); setEditDropbox(dbx); }} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: theme.text.secondary }}>
                      <Edit size={14} />Edit
                    </button>
                  </div>
                </GlassCard>
              );
            })}
          </div>
          )}

          {/* List View */}
          {dbxView === 'list' && (
          <GlassCard noPadding className="overflow-hidden">
            <div className="overflow-x-auto">
              <div className="grid text-xs font-semibold uppercase px-4 py-3"
                style={{ gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr 0.8fr', backgroundColor: theme.bg.tertiary, borderBottom: `1px solid ${theme.border.primary}`, minWidth: 700 }}>
                {[['name', 'Name'], ['address', 'Address'], ['capacity', 'Capacity'], ['assignedAgent', 'Agent'], ['status', 'Status'], ['collections', 'Collections']].map(([field, label]) => (
                  <span key={field} className="cursor-pointer select-none flex items-center gap-1" style={{ color: dbxSortBy === field ? theme.accent.primary : theme.text.muted }} onClick={() => toggleDbxSort(field)}>
                    {label}{dbxSortBy === field && (dbxSortDir === 'asc' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}
                  </span>
                ))}
              </div>
              {sortedDropboxes.map((dbx, i) => {
                const fillPercent = Math.round((dbx.currentFill / dbx.capacity) * 100);
                const fillColor = fillPercent >= 95 ? theme.status.error : fillPercent >= 75 ? theme.status.warning : fillPercent >= 50 ? theme.accent.primary : theme.status.success;
                return (
                  <div key={dbx.id} className="grid items-center px-4 py-3 cursor-pointer group hover:bg-white/5 transition-colors"
                    style={{ gridTemplateColumns: '1.5fr 2fr 1fr 1fr 1fr 0.8fr', minWidth: 700, borderBottom: i < sortedDropboxes.length - 1 ? `1px solid ${theme.border.primary}` : 'none' }}
                    onClick={() => setDetailDrawer(dbx)}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: fillPercent >= 85 ? 'rgba(212,142,138,0.1)' : 'rgba(181,160,209,0.1)' }}>
                        <Inbox size={16} style={{ color: fillPercent >= 85 ? theme.status.error : theme.chart.violet }} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold" style={{ color: theme.text.primary }}>{dbx.name}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{dbx.id}</p>
                      </div>
                    </div>
                    <span className="text-sm truncate pr-2" style={{ color: theme.text.secondary }}>{dbx.address || dbx.location}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-14 h-1.5 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                        <div className="h-full rounded-full" style={{ width: `${fillPercent}%`, backgroundColor: fillColor }} />
                      </div>
                      <span className="text-xs font-mono whitespace-nowrap" style={{ color: fillColor }}>{dbx.currentFill}/{dbx.capacity}</span>
                    </div>
                    <span className="text-sm truncate" style={{ color: theme.text.secondary }}>{dbx.assignedAgent || '—'}</span>
                    <StatusBadge status={dbx.status} />
                    <span className="text-sm font-mono" style={{ color: theme.text.secondary }}>{dbx.packagesOut}</span>
                  </div>
                );
              })}
              {sortedDropboxes.length === 0 && (
                <p className="p-8 text-center text-sm" style={{ color: theme.text.muted }}>No dropboxes found</p>
              )}
            </div>
          </GlassCard>
          )}
        </div>
      )}

      {/* Collections Schedule */}
      {activeSubMenu === 'Collections' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Scheduled" value={collectionsData.filter(c => c.status === 'scheduled').length} icon={Calendar} theme={theme} loading={loading} />
            <MetricCard title="In Progress" value={collectionsData.filter(c => c.status === 'in_progress').length} icon={Truck} theme={theme} loading={loading} />
            <MetricCard title="Completed Today" value={collectionsData.filter(c => c.status === 'completed').length} icon={CheckCircle2} theme={theme} loading={loading} />
            <MetricCard title="Overdue" value={collectionsData.filter(c => c.status === 'overdue').length} icon={AlertTriangle} theme={theme} loading={loading} subtitle={collectionsData.filter(c => c.status === 'overdue').length > 0 ? '⚠️ Needs dispatch' : 'All clear'} />
          </div>

          <div className="flex gap-2">
            <button onClick={() => { resetScheduleForm(); setShowScheduleCollection(true); }} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><Plus size={16} />Schedule Collection</button>
            <button onClick={() => setShowOptimizeRoutes(true)} className="btn-outline flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><Route size={16} />Optimize Routes</button>
          </div>

          {/* Priority Collections First */}
          {collectionsData.filter(c => c.status === 'overdue').length > 0 && (
            <div className="p-4 rounded-2xl" style={{ backgroundColor: 'rgba(212,142,138,0.05)', border: '1px solid rgba(212,142,138,0.2)' }}>
              <p className="text-sm font-semibold text-red-500 mb-3 flex items-center gap-2"><AlertTriangle size={16} /> Overdue Collections</p>
              <div className="space-y-2">
                {collectionsData.filter(c => c.status === 'overdue').map(c => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: theme.bg.card }}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                      <div>
                        <p className="font-medium" style={{ color: theme.text.primary }}>{c.dropboxName}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{c.packages} packages • Assigned: {c.agent}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { const agentData = dropboxAgentsData.find(a => a.name === c.agent); setCallAgent({ name: c.agent, phone: agentData?.phone || 'N/A' }); }} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(126,168,201,0.1)', color: theme.accent.primary }}><Phone size={12} className="inline mr-1" />Call Agent</button>
                      <button onClick={() => { setReassignAgent(''); setReassignModal({ type: 'collection', id: c.id, label: `${c.dropboxName} collection (${c.id})` }); }} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(212,142,138,0.1)', color: theme.status.error }}><RefreshCw size={12} className="inline mr-1" />Reassign</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* All Collections - Search & Filters */}
          <div className="flex flex-col gap-3 mb-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
                <input value={collectionSearch} onChange={e => setCollectionSearch(e.target.value)} placeholder="Search collections..." className="glass-card w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                {[['all', 'All'], ['overdue', 'Overdue'], ['in_progress', 'In Progress'], ['scheduled', 'Scheduled'], ['completed', 'Completed']].map(([val, label]) => (
                  <button key={val} onClick={() => setCollectionStatusFilter(val)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap" style={{ backgroundColor: collectionStatusFilter === val ? theme.accent.primary : 'transparent', color: collectionStatusFilter === val ? theme.accent.contrast : theme.text.muted }}>{label}</button>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filteredCollections.length} of {collectionsData.length} collections</p>

          {/* All Collections Table */}
          <GlassCard noPadding className="overflow-hidden">
            <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>All Collections</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  {[['id', 'Collection'], ['dropboxName', 'Dropbox'], ['agent', 'Agent', 'hidden md:table-cell'], ['vehicle', 'Vehicle', 'hidden lg:table-cell'], ['packages', 'Packages'], ['priority', 'Priority', 'hidden md:table-cell'], ['status', 'Status'], ['eta', 'ETA', 'hidden md:table-cell']].map(([field, label, hide]) => (
                    <th key={field} className={`text-left p-4 text-xs font-semibold uppercase cursor-pointer select-none ${hide || ''}`} style={{ color: collectionSort.field === field ? theme.accent.primary : theme.text.muted }} onClick={() => setCollectionSort(prev => ({ field, dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc' }))}>
                      <span className="flex items-center gap-1">{label}{collectionSort.field === field && (collectionSort.dir === 'asc' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}</span>
                    </th>
                  ))}
                  <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCollections.map(col => (
                  <tr key={col.id} style={{ borderBottom: `1px solid ${theme.border.primary}`, backgroundColor: col.status === 'overdue' ? 'rgba(212,142,138,0.03)' : 'transparent' }}>
                    <td className="p-4"><span className="font-mono text-sm" style={{ color: theme.text.primary }}>{col.id}</span><br/><span className="text-xs" style={{ color: theme.text.muted }}>{col.scheduled}</span></td>
                    <td className="p-4"><span className="text-sm" style={{ color: theme.text.primary }}>{col.dropboxName}</span><br/><span className="text-xs font-mono" style={{ color: theme.text.muted }}>{col.dropbox}</span></td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: 'rgba(181,160,209,0.1)' }}>{col.agent.charAt(0)}</div>
                        <span className="text-sm" style={{ color: theme.text.primary }}>{col.agent}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell"><span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}>{col.vehicle}</span></td>
                    <td className="p-4"><span className="font-bold" style={{ color: theme.text.primary }}>{col.packages}</span></td>
                    <td className="p-4 hidden md:table-cell"><StatusBadge status={col.priority} /></td>
                    <td className="p-4"><StatusBadge status={col.status === 'overdue' ? 'expired' : col.status} /></td>
                    <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: col.status === 'overdue' ? theme.status.error : theme.text.muted }}>{col.eta}</span></td>
                    <td className="p-4 text-right">
                      {col.status === 'scheduled' && <button onClick={() => addToast({ type: 'success', message: `Collection ${col.id} started` })} className="p-2 rounded-lg hover:bg-white/5 text-emerald-500"><CheckCircle size={16} /></button>}
                      {col.status !== 'completed' && <button onClick={() => { setReassignAgent(''); setReassignModal({ type: 'collection', id: col.id, label: `${col.dropboxName} collection (${col.id})` }); }} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><RefreshCw size={16} /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      )}

      {/* Agent Assignments */}
      {activeSubMenu === 'Agents' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Active Agents" value={dropboxAgentsData.filter(a => a.status !== 'offline').length} icon={UserCheck} theme={theme} loading={loading} />
            <MetricCard title="Collections Today" value={dropboxAgentsData.reduce((s, a) => s + a.collectionsToday, 0)} icon={Inbox} theme={theme} loading={loading} />
            <MetricCard title="Packages Collected" value={dropboxAgentsData.reduce((s, a) => s + a.totalCollected, 0)} icon={Package} theme={theme} loading={loading} />
            <MetricCard title="Unassigned Dropboxes" value={dropboxesData.filter(d => !d.assignedAgent && d.status !== 'maintenance').length} icon={AlertTriangle} theme={theme} loading={loading} />
          </div>

          <div className="flex gap-2">
            <button onClick={() => { setAssignAgentSelected(''); setShowAssignAgent(true); }} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><UserPlus size={16} />Assign Agent</button>
            <button onClick={() => setShowAutoBalance(true)} className="btn-outline flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><RefreshCw size={16} />Auto-Balance</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dropboxAgentsData.map(agent => (
              <GlassCard noPadding key={agent.id} className="overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: 'rgba(181,160,209,0.1)' }}>{agent.photo}</div>
                      <div>
                        <p className="font-semibold text-lg" style={{ color: theme.text.primary }}>{agent.name}</p>
                        <p className="text-sm" style={{ color: theme.text.muted }}>{agent.phone} • {agent.zone}</p>
                        <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{agent.vehicle}</p>
                      </div>
                    </div>
                    <StatusBadge status={agent.status} />
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[['Today', agent.collectionsToday, theme.chart.violet], ['Collected', agent.totalCollected, theme.accent.primary], ['Rating', `★ ${agent.rating}`, theme.status.warning], ['Avg Time', agent.avgCollectionTime, theme.status.success]].map(([l, v, c]) => (
                      <div key={l} className="p-2 rounded-lg text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                        <p className="font-bold" style={{ color: c }}>{v}</p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>Assigned Dropboxes ({agent.assignedDropboxes.length})</p>
                    <div className="space-y-2">
                      {agent.assignedDropboxes.map(dbxId => {
                        const dbx = dropboxesData.find(d => d.id === dbxId);
                        if (!dbx) return null;
                        const fp = Math.round((dbx.currentFill / dbx.capacity) * 100);
                        const fc = fp >= 95 ? theme.status.error : fp >= 75 ? theme.status.warning : theme.status.success;
                        return (
                          <div key={dbxId} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                            <div className="flex items-center gap-3">
                              <Inbox size={16} style={{ color: theme.chart.violet }} />
                              <div>
                                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{dbx.name}</p>
                                <p className="text-xs" style={{ color: theme.text.muted }}>{dbxId} • {dbx.location}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1">
                                <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                                  <div className="h-full rounded-full" style={{ width: `${fp}%`, backgroundColor: fc }} />
                                </div>
                                <span className="text-xs font-mono" style={{ color: fc }}>{fp}%</span>
                              </div>
                              <span className="text-xs" style={{ color: theme.text.muted }}>Next: {dbx.nextCollection?.split(' ')[1] || 'N/A'}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex border-t" style={{ borderColor: theme.border.primary }}>
                  <button onClick={() => setCallAgent({ name: agent.name, phone: agent.phone })} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: theme.accent.primary }}><Phone size={14} />Call</button>
                  <div className="w-px" style={{ backgroundColor: theme.border.primary }} />
                  <button onClick={() => { setMessageText(''); setMessageAgent({ name: agent.name, phone: agent.phone }); }} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: theme.status.success }}><MessageSquare size={14} />Message</button>
                  <div className="w-px" style={{ backgroundColor: theme.border.primary }} />
                  <button onClick={() => { setReassignAgent(''); setReassignModal({ type: 'agent', id: agent.id, label: `${agent.name}'s dropbox assignments` }); }} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: theme.text.secondary }}><Edit size={14} />Edit</button>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Coverage Summary */}
          <GlassCard>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Zone Coverage</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...new Set(dropboxAgentsData.map(a => a.zone))].map(zone => {
                const agents = dropboxAgentsData.filter(a => a.zone === zone);
                const dbxCount = agents.reduce((s, a) => s + a.assignedDropboxes.length, 0);
                return (
                  <div key={zone} className="p-4 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                    <p className="font-medium" style={{ color: theme.text.primary }}>{zone}</p>
                    <p className="text-sm" style={{ color: theme.text.muted }}>{agents.length} agent{agents.length !== 1 ? 's' : ''} • {dbxCount} dropbox{dbxCount !== 1 ? 'es' : ''}</p>
                    <div className="flex gap-1 mt-2">
                      {agents.map(a => (
                        <div key={a.id} className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: a.status === 'active' ? 'rgba(129,201,149,0.2)' : a.status === 'on_delivery' ? 'rgba(126,168,201,0.2)' : 'rgba(120,113,108,0.2)' }}>{a.photo}</div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Package Flow */}
      {activeSubMenu === 'Package Flow' && (
        <div className="space-y-6">
          {/* Flow Stage Summary */}
          <GlassCard>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Dropbox → Locker Pipeline</h3>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {[
                { label: 'In Dropbox', count: dropboxFlowData.filter(f => f.stage === 'awaiting_collection').length, color: theme.status.warning, icon: Inbox },
                { label: 'Overdue', count: dropboxFlowData.filter(f => f.stage === 'collection_overdue').length, color: theme.status.error, icon: AlertTriangle },
                { label: 'Collected', count: dropboxFlowData.filter(f => f.stage === 'collected').length, color: theme.accent.primary, icon: CheckCircle },
                { label: 'In Transit', count: dropboxFlowData.filter(f => f.stage === 'in_transit').length, color: '#6366f1', icon: Truck },
                { label: 'At Terminal', count: dropboxFlowData.filter(f => f.stage === 'at_terminal').length, color: theme.chart.violet, icon: Building2 },
                { label: 'In Locker', count: dropboxFlowData.filter(f => f.stage === 'delivered_to_locker').length, color: theme.status.success, icon: Grid3X3 },
              ].map((stage, idx, arr) => (
                <React.Fragment key={stage.label}>
                  <div className="flex flex-col items-center p-3 rounded-xl min-w-[90px]" style={{ backgroundColor: `${stage.color}10` }}>
                    <stage.icon size={20} style={{ color: stage.color }} />
                    <p className="text-2xl font-bold mt-1" style={{ color: stage.color }}>{stage.count}</p>
                    <p className="text-xs text-center" style={{ color: stage.color }}>{stage.label}</p>
                  </div>
                  {idx < arr.length - 1 && <ChevronRight size={20} style={{ color: theme.icon.muted }} className="hidden md:block shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </GlassCard>

          {/* Active Flow Table */}
          <GlassCard noPadding className="overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Active Package Flow</h3>
              <div className="flex gap-2">
                <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 800); }} className="p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}><RefreshCw size={16} /></button>
              </div>
            </div>
            {loading ? <TableSkeleton rows={6} cols={7} theme={theme} /> : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Package</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Dropbox</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Stage</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Flow Progress</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Target Locker</th>
                    <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {dropboxFlowData.map(flow => {
                    const stageInfo = DROPBOX_FLOW_STAGES[flow.stage];
                    const steps = ['Dropbox', 'Collected', 'Transit', 'Terminal', 'Locker'];
                    const currentStep = stageInfo?.step ?? 0;
                    return (
                      <tr key={flow.id} style={{ borderBottom: `1px solid ${theme.border.primary}`, backgroundColor: flow.stage === 'collection_overdue' ? 'rgba(212,142,138,0.03)' : 'transparent' }}>
                        <td className="p-4">
                          <span className="font-mono font-medium text-sm" style={{ color: theme.text.primary }}>{flow.waybill}</span>
                          <br/><span className="text-xs" style={{ color: theme.text.muted }}>{flow.depositTime}</span>
                        </td>
                        <td className="p-4"><span className="text-sm" style={{ color: theme.text.primary }}>{flow.customer}</span></td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="text-sm" style={{ color: theme.text.primary }}>{flow.dropboxName}</span>
                          <br/><span className="text-xs font-mono" style={{ color: theme.text.muted }}>{flow.dropbox}</span>
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: stageInfo?.bg, color: stageInfo?.color }}>{stageInfo?.label}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-0.5">
                            {steps.map((step, idx) => (
                              <React.Fragment key={step}>
                                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: idx <= currentStep ? (stageInfo?.color || '#78716C') : theme.border.primary }}>
                                  {idx < currentStep ? <Check size={10} style={{ color: '#1C1917' }} /> : idx === currentStep ? <Circle size={6} style={{ color: '#1C1917', fill: '#1C1917' }} /> : null}
                                </div>
                                {idx < steps.length - 1 && <div className="w-3 h-0.5" style={{ backgroundColor: idx < currentStep ? (stageInfo?.color || '#78716C') : theme.border.primary }} />}
                              </React.Fragment>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <div className="flex items-center gap-1">
                            <Grid3X3 size={14} style={{ color: theme.icon.muted }} />
                            <span className="font-mono text-sm" style={{ color: theme.text.primary }}>{flow.targetLocker}</span>
                          </div>
                          <span className="text-xs" style={{ color: theme.text.muted }}>{flow.targetTerminal}</span>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <span className="text-sm" style={{ color: flow.stage === 'collection_overdue' ? theme.status.error : theme.text.muted }}>{flow.eta}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </GlassCard>

          {/* Flow Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassCard>
              <h3 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Avg. Flow Time</h3>
              <div className="space-y-3">
                {[['Dropbox → Collection', '2.4 hrs', theme.status.warning], ['Collection → Terminal', '1.2 hrs', '#6366f1'], ['Terminal → Locker', '0.5 hrs', theme.status.success], ['Total End-to-End', '4.1 hrs', theme.chart.violet]].map(([l, v, c]) => (
                  <div key={l} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: theme.text.muted }}>{l}</span>
                    <span className="font-bold" style={{ color: c }}>{v}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
            <GlassCard>
              <h3 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Top Dropboxes by Volume</h3>
              <div className="space-y-3">
                {dropboxesData.filter(d => d.status !== 'maintenance').sort((a, b) => b.avgDailyVolume - a.avgDailyVolume).slice(0, 4).map((d, i) => (
                  <div key={d.id} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: i === 0 ? theme.status.warning : i === 1 ? '#a3a3a3' : i === 2 ? '#cd7c32' : theme.border.secondary, color: '#1C1917' }}>{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: theme.text.primary }}>{d.name}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: theme.chart.violet }}>{d.avgDailyVolume}/day</span>
                  </div>
                ))}
              </div>
            </GlassCard>
            <GlassCard>
              <h3 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Bottlenecks</h3>
              <div className="space-y-3">
                {dropboxFlowData.filter(f => f.stage === 'collection_overdue').length > 0 ? (
                  dropboxFlowData.filter(f => f.stage === 'collection_overdue').map(f => (
                    <div key={f.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: 'rgba(212,142,138,0.05)' }}>
                      <AlertTriangle size={14} className="text-red-500 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-red-500">{f.dropboxName}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{f.waybill} stuck — collection overdue</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center py-4">
                    <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
                    <p className="text-sm text-emerald-500">No bottlenecks detected</p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      )}
      {/* ===== MODALS ===== */}

      {/* 1. Add Dropbox Modal */}
      {showAddDropbox && (
        <ModalOverlay onClose={() => setShowAddDropbox(false)}>
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: theme.text.primary }}>Add New Dropbox</h2>
            <div className="space-y-3">
              <FormInput label="Dropbox Name" value={dropboxForm.name} onChange={e => setDropboxForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Kaneshie Market" />
              <FormInput label="Address" value={dropboxForm.address} onChange={e => setDropboxForm(f => ({ ...f, address: e.target.value }))} placeholder="Full street address" />
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Latitude" value={dropboxForm.lat} onChange={e => setDropboxForm(f => ({ ...f, lat: e.target.value }))} placeholder="5.6037" />
                <FormInput label="Longitude" value={dropboxForm.lng} onChange={e => setDropboxForm(f => ({ ...f, lng: e.target.value }))} placeholder="-0.1870" />
              </div>
              <FormInput label="Capacity (packages)" value={dropboxForm.capacity} onChange={e => setDropboxForm(f => ({ ...f, capacity: e.target.value }))} type="number" placeholder="50" />
              <FormSelect label="Assigned Agent" value={dropboxForm.agent} onChange={e => setDropboxForm(f => ({ ...f, agent: e.target.value }))} options={dropboxAgentsData.map(a => ({ value: a.name, label: `${a.name} (${a.zone})` }))} />
              <FormInput label="Operating Hours" value={dropboxForm.hours} onChange={e => setDropboxForm(f => ({ ...f, hours: e.target.value }))} placeholder="e.g. 06:00 - 22:00" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowAddDropbox(false)} className="btn-outline px-4 py-2 rounded-xl text-sm">Cancel</button>
              <button onClick={() => { setShowAddDropbox(false); addToast({ type: 'success', message: `Dropbox "${dropboxForm.name}" created successfully` }); }} className="btn-primary px-4 py-2 rounded-xl text-sm">Create Dropbox</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* 2. Dispatch Now Confirmation */}
      {showDispatchConfirm && (
        <ModalOverlay onClose={() => setShowDispatchConfirm(false)}>
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(212,142,138,0.1)' }}>
              <Truck size={28} style={{ color: theme.status.error }} />
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: theme.text.primary }}>Dispatch Emergency Collection</h2>
            <p className="text-sm mb-6" style={{ color: theme.text.muted }}>
              Dispatch emergency collection for all {dropboxesData.filter(d => d.status === 'full' || d.alerts.includes('near_full') || d.alerts.includes('collection_due')).length} pending dropboxes? This will notify all assigned agents immediately.
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowDispatchConfirm(false)} className="btn-outline px-5 py-2 rounded-xl text-sm">Cancel</button>
              <button onClick={() => { setShowDispatchConfirm(false); addToast({ type: 'success', message: 'Emergency dispatch sent to all agents' }); }} className="btn-primary px-5 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.status.error }}>Confirm Dispatch</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* 3. Dropbox Detail Drawer */}
      {detailDrawer && (() => {
        const dbx = detailDrawer;
        const fillPercent = Math.round((dbx.currentFill / dbx.capacity) * 100);
        const fillColor = fillPercent >= 95 ? theme.status.error : fillPercent >= 75 ? theme.status.warning : fillPercent >= 50 ? theme.accent.primary : theme.status.success;
        const relatedCollections = collectionsData.filter(c => c.dropbox === dbx.id);
        return (
          <DrawerOverlay onClose={() => setDetailDrawer(null)}>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Dropbox Details</h2>
                <button onClick={() => setDetailDrawer(null)} className="p-2 rounded-lg hover:bg-white/5 text-lg" style={{ color: theme.text.muted }}>&times;</button>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(181,160,209,0.1)' }}>
                  <Inbox size={24} style={{ color: theme.chart.violet }} />
                </div>
                <div>
                  <p className="font-semibold" style={{ color: theme.text.primary }}>{dbx.name}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{dbx.id} -- {dbx.location}</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Info rows */}
                <div className="grid grid-cols-2 gap-3">
                  {[['Address', dbx.address], ['Terminal', dbx.terminal], ['Agent', dbx.assignedAgent || 'Unassigned'], ['Type', dbx.type], ['Installed', dbx.installDate], ['Status', dbx.status]].map(([l, v]) => (
                    <div key={l} className="p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                      <p className="text-sm font-medium capitalize" style={{ color: theme.text.primary }}>{v}</p>
                    </div>
                  ))}
                </div>

                {/* Capacity utilization bar */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold" style={{ color: theme.text.muted }}>Capacity Utilization</span>
                    <span className="text-sm font-bold" style={{ color: fillColor }}>{dbx.currentFill}/{dbx.capacity} ({fillPercent}%)</span>
                  </div>
                  <div className="w-full h-4 rounded-full overflow-hidden" style={{ backgroundColor: theme.border.primary }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${fillPercent}%`, backgroundColor: fillColor }} />
                  </div>
                </div>

                {/* Package stats */}
                <div className="grid grid-cols-3 gap-3">
                  {[['Current', dbx.currentFill, theme.chart.violet], ['Daily Avg', dbx.avgDailyVolume, theme.accent.primary], ['Total Out', dbx.packagesOut, theme.status.success]].map(([l, v, c]) => (
                    <div key={l} className="p-3 rounded-xl text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                      <p className="text-lg font-bold" style={{ color: c }}>{v}</p>
                    </div>
                  ))}
                </div>

                {/* Recent collections */}
                <div>
                  <p className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>Recent Collections</p>
                  {relatedCollections.length > 0 ? relatedCollections.map(col => (
                    <div key={col.id} className="flex items-center justify-between p-3 rounded-xl mb-2" style={{ backgroundColor: theme.bg.tertiary }}>
                      <div>
                        <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{col.id}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{col.scheduled} -- {col.agent}</p>
                      </div>
                      <StatusBadge status={col.status === 'overdue' ? 'expired' : col.status} />
                    </div>
                  )) : (
                    <p className="text-sm" style={{ color: theme.text.muted }}>No recent collections</p>
                  )}
                </div>

                {/* Assigned agent */}
                {dbx.assignedAgent && (
                  <div>
                    <p className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>Assigned Agent</p>
                    <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: 'rgba(181,160,209,0.1)' }}>
                        {dropboxAgentsData.find(a => a.name === dbx.assignedAgent)?.photo || '?'}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{dbx.assignedAgent}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{dbx.agentPhone}</p>
                      </div>
                      <button onClick={() => { setCallAgent({ name: dbx.assignedAgent, phone: dbx.agentPhone }); }} className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(126,168,201,0.1)', color: theme.accent.primary }}><Phone size={14} /></button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DrawerOverlay>
        );
      })()}

      {/* 4. Edit Dropbox Modal */}
      {editDropbox && (
        <ModalOverlay onClose={() => setEditDropbox(null)}>
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: theme.text.primary }}>Edit Dropbox - {editDropbox.name}</h2>
            <div className="space-y-3">
              <FormInput label="Dropbox Name" value={dropboxForm.name} onChange={e => setDropboxForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Kaneshie Market" />
              <FormInput label="Address" value={dropboxForm.address} onChange={e => setDropboxForm(f => ({ ...f, address: e.target.value }))} placeholder="Full street address" />
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Latitude" value={dropboxForm.lat} onChange={e => setDropboxForm(f => ({ ...f, lat: e.target.value }))} placeholder="5.6037" />
                <FormInput label="Longitude" value={dropboxForm.lng} onChange={e => setDropboxForm(f => ({ ...f, lng: e.target.value }))} placeholder="-0.1870" />
              </div>
              <FormInput label="Capacity (packages)" value={dropboxForm.capacity} onChange={e => setDropboxForm(f => ({ ...f, capacity: e.target.value }))} type="number" placeholder="50" />
              <FormSelect label="Assigned Agent" value={dropboxForm.agent} onChange={e => setDropboxForm(f => ({ ...f, agent: e.target.value }))} options={dropboxAgentsData.map(a => ({ value: a.name, label: `${a.name} (${a.zone})` }))} />
              <FormInput label="Operating Hours" value={dropboxForm.hours} onChange={e => setDropboxForm(f => ({ ...f, hours: e.target.value }))} placeholder="e.g. 06:00 - 22:00" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setEditDropbox(null)} className="btn-outline px-4 py-2 rounded-xl text-sm">Cancel</button>
              <button onClick={() => { setEditDropbox(null); addToast({ type: 'success', message: `Dropbox "${dropboxForm.name}" updated successfully` }); }} className="btn-primary px-4 py-2 rounded-xl text-sm">Save Changes</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* 5. Schedule Collection Modal */}
      {showScheduleCollection && (
        <ModalOverlay onClose={() => setShowScheduleCollection(false)}>
          <div className="p-6">
            <h2 className="text-lg font-bold mb-4" style={{ color: theme.text.primary }}>Schedule Collection</h2>
            <div className="space-y-3">
              <FormSelect label="Dropbox" value={scheduleForm.dropbox} onChange={e => setScheduleForm(f => ({ ...f, dropbox: e.target.value }))} options={dropboxesData.filter(d => d.status !== 'maintenance').map(d => ({ value: d.id, label: `${d.name} (${d.id})` }))} />
              <div className="grid grid-cols-2 gap-3">
                <FormInput label="Date" value={scheduleForm.date} onChange={e => setScheduleForm(f => ({ ...f, date: e.target.value }))} type="date" />
                <FormInput label="Time" value={scheduleForm.time} onChange={e => setScheduleForm(f => ({ ...f, time: e.target.value }))} type="time" />
              </div>
              <FormSelect label="Assign Agent" value={scheduleForm.agent} onChange={e => setScheduleForm(f => ({ ...f, agent: e.target.value }))} options={dropboxAgentsData.map(a => ({ value: a.name, label: `${a.name} (${a.zone})` }))} />
              <FormSelect label="Priority" value={scheduleForm.priority} onChange={e => setScheduleForm(f => ({ ...f, priority: e.target.value }))} options={[{ value: 'low', label: 'Low' }, { value: 'normal', label: 'Normal' }, { value: 'high', label: 'High' }, { value: 'urgent', label: 'Urgent' }]} />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowScheduleCollection(false)} className="btn-outline px-4 py-2 rounded-xl text-sm">Cancel</button>
              <button onClick={() => { setShowScheduleCollection(false); addToast({ type: 'success', message: `Collection scheduled for ${scheduleForm.dropbox || 'selected dropbox'}` }); }} className="btn-primary px-4 py-2 rounded-xl text-sm">Schedule</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* 6. Optimize Routes Modal */}
      {showOptimizeRoutes && (
        <ModalOverlay onClose={() => { if (!optimizeProgress) { setShowOptimizeRoutes(false); } }}>
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(181,160,209,0.1)' }}>
              <Route size={28} style={{ color: theme.chart.violet }} />
            </div>
            {!optimizeProgress ? (
              <>
                <h2 className="text-lg font-bold mb-2" style={{ color: theme.text.primary }}>Optimize Routes</h2>
                <p className="text-sm mb-6" style={{ color: theme.text.muted }}>
                  Optimize collection routes for {dropboxAgentsData.filter(a => a.status !== 'offline').length} active agents across {dropboxesData.filter(d => d.status === 'active').length} dropboxes?
                </p>
                <div className="flex justify-center gap-3">
                  <button onClick={() => setShowOptimizeRoutes(false)} className="btn-outline px-5 py-2 rounded-xl text-sm">Cancel</button>
                  <button onClick={() => { setOptimizeProgress(true); setTimeout(() => { setOptimizeProgress(false); setShowOptimizeRoutes(false); addToast({ type: 'success', message: `Routes optimized for ${dropboxAgentsData.filter(a => a.status !== 'offline').length} agents` }); }, 2000); }} className="btn-primary px-5 py-2 rounded-xl text-sm">Start Optimization</button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-2" style={{ color: theme.text.primary }}>Optimizing Routes...</h2>
                <p className="text-sm mb-4" style={{ color: theme.text.muted }}>
                  Optimizing routes for {dropboxAgentsData.filter(a => a.status !== 'offline').length} agents...
                </p>
                <div className="w-full h-2 rounded-full overflow-hidden mb-2" style={{ backgroundColor: theme.border.primary }}>
                  <div className="h-full rounded-full animate-pulse" style={{ width: '70%', backgroundColor: theme.chart.violet, transition: 'width 2s ease-in-out' }} />
                </div>
                <p className="text-xs" style={{ color: theme.text.muted }}>Please wait...</p>
              </>
            )}
          </div>
        </ModalOverlay>
      )}

      {/* 7a. Call Agent Confirmation */}
      {callAgent && (
        <ModalOverlay onClose={() => setCallAgent(null)}>
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(126,168,201,0.1)' }}>
              <Phone size={28} style={{ color: theme.accent.primary }} />
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: theme.text.primary }}>Call Agent</h2>
            <p className="text-sm mb-1" style={{ color: theme.text.muted }}>Call <strong style={{ color: theme.text.primary }}>{callAgent.name}</strong> at</p>
            <p className="text-lg font-mono font-bold mb-6" style={{ color: theme.accent.primary }}>{callAgent.phone}</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setCallAgent(null)} className="btn-outline px-5 py-2 rounded-xl text-sm">Cancel</button>
              <button onClick={() => { setCallAgent(null); addToast({ type: 'success', message: `Calling ${callAgent.name} at ${callAgent.phone}...` }); }} className="btn-primary px-5 py-2 rounded-xl text-sm">Call Now</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* 7b. Message Agent Modal */}
      {messageAgent && (
        <ModalOverlay onClose={() => setMessageAgent(null)}>
          <div className="p-6">
            <h2 className="text-lg font-bold mb-1" style={{ color: theme.text.primary }}>Message {messageAgent.name}</h2>
            <p className="text-xs mb-4" style={{ color: theme.text.muted }}>{messageAgent.phone}</p>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: theme.text.muted }}>Message</label>
              <textarea value={messageText} onChange={e => setMessageText(e.target.value)} rows={4} placeholder="Type your message..." className="w-full px-3 py-2 rounded-xl border text-sm resize-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setMessageAgent(null)} className="btn-outline px-4 py-2 rounded-xl text-sm">Cancel</button>
              <button onClick={() => { setMessageAgent(null); addToast({ type: 'success', message: `Message sent to ${messageAgent.name}` }); }} className="btn-primary px-4 py-2 rounded-xl text-sm">Send Message</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* 8. Reassign Modal */}
      {reassignModal && (
        <ModalOverlay onClose={() => setReassignModal(null)}>
          <div className="p-6">
            <h2 className="text-lg font-bold mb-2" style={{ color: theme.text.primary }}>Reassign</h2>
            <p className="text-sm mb-4" style={{ color: theme.text.muted }}>
              Reassign <strong style={{ color: theme.text.primary }}>{reassignModal.label}</strong> to a different agent.
            </p>
            <FormSelect label="New Agent" value={reassignAgent} onChange={e => setReassignAgent(e.target.value)} options={dropboxAgentsData.map(a => ({ value: a.name, label: `${a.name} - ${a.zone} (${a.status})` }))} />
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setReassignModal(null)} className="btn-outline px-4 py-2 rounded-xl text-sm">Cancel</button>
              <button onClick={() => { setReassignModal(null); addToast({ type: 'success', message: `Reassigned to ${reassignAgent || 'selected agent'}` }); }} className="btn-primary px-4 py-2 rounded-xl text-sm">Reassign</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* 9. Assign Agent Modal */}
      {showAssignAgent && (
        <ModalOverlay onClose={() => setShowAssignAgent(false)}>
          <div className="p-6">
            <h2 className="text-lg font-bold mb-2" style={{ color: theme.text.primary }}>Assign Agent to Dropbox</h2>
            <p className="text-sm mb-4" style={{ color: theme.text.muted }}>
              {dropboxesData.filter(d => !d.assignedAgent && d.status !== 'maintenance').length} unassigned dropbox(es) available.
            </p>
            <div className="space-y-3">
              <FormSelect label="Select Agent" value={assignAgentSelected} onChange={e => setAssignAgentSelected(e.target.value)} options={dropboxAgentsData.map(a => ({ value: a.name, label: `${a.name} - ${a.zone} (${a.assignedDropboxes.length} dropboxes)` }))} />
              <div>
                <label className="block text-xs font-semibold mb-2" style={{ color: theme.text.muted }}>Available Agents</label>
                <div className="space-y-2 max-h-48 overflow-auto">
                  {dropboxAgentsData.map(a => (
                    <div key={a.id} onClick={() => setAssignAgentSelected(a.name)} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all" style={{ backgroundColor: assignAgentSelected === a.name ? 'rgba(181,160,209,0.15)' : theme.bg.tertiary, borderWidth: 1, borderColor: assignAgentSelected === a.name ? theme.chart.violet : 'transparent' }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{ backgroundColor: 'rgba(181,160,209,0.1)' }}>{a.photo}</div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{a.name}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{a.zone} -- {a.assignedDropboxes.length} dropbox(es) -- {a.status}</p>
                      </div>
                      {assignAgentSelected === a.name && <CheckCircle2 size={18} style={{ color: theme.chart.violet }} />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button onClick={() => setShowAssignAgent(false)} className="btn-outline px-4 py-2 rounded-xl text-sm">Cancel</button>
              <button onClick={() => { setShowAssignAgent(false); addToast({ type: 'success', message: `${assignAgentSelected || 'Agent'} assigned successfully` }); }} className="btn-primary px-4 py-2 rounded-xl text-sm">Assign</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* 10. Auto-Balance Confirmation */}
      {showAutoBalance && (
        <ModalOverlay onClose={() => setShowAutoBalance(false)}>
          <div className="p-6 text-center">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(181,160,209,0.1)' }}>
              <RefreshCw size={28} style={{ color: theme.chart.violet }} />
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: theme.text.primary }}>Auto-Balance Workloads</h2>
            <p className="text-sm mb-6" style={{ color: theme.text.muted }}>
              Auto-balance workloads across {dropboxAgentsData.length} agents? This will redistribute dropbox assignments based on location, capacity, and current workload.
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowAutoBalance(false)} className="btn-outline px-5 py-2 rounded-xl text-sm">Cancel</button>
              <button onClick={() => { setShowAutoBalance(false); addToast({ type: 'success', message: `Workloads auto-balanced across ${dropboxAgentsData.length} agents` }); }} className="btn-primary px-5 py-2 rounded-xl text-sm">Balance Now</button>
            </div>
          </div>
        </ModalOverlay>
      )}
    </div>
  );
};
