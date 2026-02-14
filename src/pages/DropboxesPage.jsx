import React from 'react';
import { Inbox, Download, Plus, CheckCircle2, AlertTriangle, Clock, Package, Truck, Eye, Edit, Calendar, UserCheck, Route, Phone, RefreshCw, UserPlus, MessageSquare, Building2, Grid3X3, ChevronRight, Check, Circle, ArrowUpRight, ArrowDownRight, Search, CheckCircle } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
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

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
            <Inbox size={28} style={{ color: '#8b5cf6' }} /> Dropbox Management
          </h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Overview'} • {dropboxesData.filter(d => d.status === 'active').length} active dropboxes</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={16} />Export</button>
          {hasPermission(currentUser.role, 'packages.receive') && (
            <button onClick={() => addToast({ type: 'info', message: 'New dropbox setup wizard' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: '#8b5cf6' }}><Plus size={18} />Add Dropbox</button>
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
            <div className="p-4 rounded-2xl border flex items-start gap-4" style={{ backgroundColor: 'rgba(239,68,68,0.05)', borderColor: 'rgba(239,68,68,0.2)' }}>
              <AlertTriangle size={24} className="text-red-500 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-red-500 mb-1">Attention Required</p>
                <div className="flex flex-wrap gap-2">
                  {dropboxesData.filter(d => d.status === 'full').map(d => (
                    <span key={d.id} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>🔴 {d.name} is FULL — collection overdue</span>
                  ))}
                  {dropboxesData.filter(d => d.alerts.includes('near_full') && d.status !== 'full').map(d => (
                    <span key={d.id} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>🟡 {d.name} at {Math.round(d.currentFill / d.capacity * 100)}% — schedule collection</span>
                  ))}
                  {dropboxesData.filter(d => d.alerts.includes('collection_due')).map(d => (
                    <span key={d.id} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>🔵 {d.name} collection due soon</span>
                  ))}
                </div>
              </div>
              <button onClick={() => addToast({ type: 'info', message: 'Dispatching emergency collections...' })} className="px-4 py-2 rounded-xl text-white text-sm shrink-0" style={{ backgroundColor: '#ef4444' }}>Dispatch Now</button>
            </div>
          )}

          {/* Fill Level Chart */}
          <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Fill Levels Today</h3>
              <div className="flex gap-3">
                {[{ l: 'Achimota', c: theme.accent.primary }, { l: 'Osu', c: '#8b5cf6' }, { l: 'Tema', c: '#ef4444' }].map(i => (
                  <span key={i.l} className="flex items-center gap-1 text-xs" style={{ color: theme.text.muted }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: i.c }} />{i.l}</span>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dropboxFillHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                <Area type="monotone" dataKey="dbx001" name="Achimota Overpass" stroke={theme.accent.primary} fill={`${theme.accent.primary}20`} strokeWidth={2} />
                <Area type="monotone" dataKey="dbx003" name="Osu Oxford St" stroke="#8b5cf6" fill="transparent" strokeWidth={2} />
                <Area type="monotone" dataKey="dbx004" name="Tema Comm. 1" stroke="#ef4444" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Dropbox Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dropboxesData.map(dbx => {
              const fillPercent = Math.round((dbx.currentFill / dbx.capacity) * 100);
              const fillColor = fillPercent >= 95 ? '#ef4444' : fillPercent >= 75 ? '#f59e0b' : fillPercent >= 50 ? '#3b82f6' : '#10b981';
              const isUrgent = dbx.status === 'full' || dbx.alerts.includes('collection_overdue');
              return (
                <div key={dbx.id} className="rounded-2xl border overflow-hidden transition-all hover:shadow-lg" style={{ backgroundColor: theme.bg.card, borderColor: isUrgent ? '#ef4444' : theme.border.primary, borderWidth: isUrgent ? 2 : 1 }}>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: fillPercent >= 85 ? 'rgba(239,68,68,0.1)' : 'rgba(139,92,246,0.1)' }}>
                          <Inbox size={24} style={{ color: fillPercent >= 85 ? '#ef4444' : '#8b5cf6' }} />
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
                      <div className="p-2 rounded-lg" style={{ backgroundColor: isUrgent ? 'rgba(239,68,68,0.1)' : theme.bg.tertiary }}>
                        <p className="text-xs" style={{ color: isUrgent ? '#ef4444' : theme.text.muted }}>Next Collection</p>
                        <p className="font-medium" style={{ color: isUrgent ? '#ef4444' : theme.text.primary }}>{dbx.nextCollection?.split(' ')[1] || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs" style={{ color: theme.text.muted }}>
                      <span>Avg. {dbx.avgDailyVolume}/day</span>
                      <span>Total out: {dbx.packagesOut}</span>
                      <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: dbx.type === 'premium' ? 'rgba(139,92,246,0.1)' : theme.bg.tertiary, color: dbx.type === 'premium' ? '#8b5cf6' : theme.text.muted }}>{dbx.type}</span>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex border-t" style={{ borderColor: theme.border.primary }}>
                    <button onClick={() => addToast({ type: 'info', message: `Scheduling collection for ${dbx.name}` })} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: '#8b5cf6' }}>
                      <Truck size={14} />Collect
                    </button>
                    <div className="w-px" style={{ backgroundColor: theme.border.primary }} />
                    <button onClick={() => addToast({ type: 'info', message: `Opening details for ${dbx.name}` })} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: theme.text.secondary }}>
                      <Eye size={14} />Details
                    </button>
                    <div className="w-px" style={{ backgroundColor: theme.border.primary }} />
                    <button onClick={() => addToast({ type: 'info', message: `Editing ${dbx.name}` })} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: theme.text.secondary }}>
                      <Edit size={14} />Edit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
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
            <button onClick={() => addToast({ type: 'info', message: 'Schedule new collection' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: '#8b5cf6' }}><Plus size={16} />Schedule Collection</button>
            <button onClick={() => addToast({ type: 'info', message: 'Auto-optimizing routes...' })} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Route size={16} />Optimize Routes</button>
          </div>

          {/* Priority Collections First */}
          {collectionsData.filter(c => c.status === 'overdue').length > 0 && (
            <div className="p-4 rounded-2xl" style={{ backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
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
                      <button onClick={() => addToast({ type: 'info', message: `Calling ${c.agent}...` })} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}><Phone size={12} className="inline mr-1" />Call Agent</button>
                      <button onClick={() => addToast({ type: 'success', message: `Reassigning ${c.dropboxName} collection` })} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444' }}><RefreshCw size={12} className="inline mr-1" />Reassign</button>
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
                <input value={collectionSearch} onChange={e => setCollectionSearch(e.target.value)} placeholder="Search collections..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                {[['all', 'All'], ['overdue', 'Overdue'], ['in_progress', 'In Progress'], ['scheduled', 'Scheduled'], ['completed', 'Completed']].map(([val, label]) => (
                  <button key={val} onClick={() => setCollectionStatusFilter(val)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap" style={{ backgroundColor: collectionStatusFilter === val ? theme.accent.primary : 'transparent', color: collectionStatusFilter === val ? '#fff' : theme.text.muted }}>{label}</button>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filteredCollections.length} of {collectionsData.length} collections</p>

          {/* All Collections Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
                  <tr key={col.id} style={{ borderBottom: `1px solid ${theme.border.primary}`, backgroundColor: col.status === 'overdue' ? 'rgba(239,68,68,0.03)' : 'transparent' }}>
                    <td className="p-4"><span className="font-mono text-sm" style={{ color: theme.text.primary }}>{col.id}</span><br/><span className="text-xs" style={{ color: theme.text.muted }}>{col.scheduled}</span></td>
                    <td className="p-4"><span className="text-sm" style={{ color: theme.text.primary }}>{col.dropboxName}</span><br/><span className="text-xs font-mono" style={{ color: theme.text.muted }}>{col.dropbox}</span></td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: 'rgba(139,92,246,0.1)' }}>{col.agent.charAt(0)}</div>
                        <span className="text-sm" style={{ color: theme.text.primary }}>{col.agent}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell"><span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}>{col.vehicle}</span></td>
                    <td className="p-4"><span className="font-bold" style={{ color: theme.text.primary }}>{col.packages}</span></td>
                    <td className="p-4 hidden md:table-cell"><StatusBadge status={col.priority} /></td>
                    <td className="p-4"><StatusBadge status={col.status === 'overdue' ? 'expired' : col.status} /></td>
                    <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: col.status === 'overdue' ? '#ef4444' : theme.text.muted }}>{col.eta}</span></td>
                    <td className="p-4 text-right">
                      {col.status === 'scheduled' && <button onClick={() => addToast({ type: 'success', message: `Collection ${col.id} started` })} className="p-2 rounded-lg hover:bg-white/5 text-emerald-500"><CheckCircle size={16} /></button>}
                      {col.status !== 'completed' && <button onClick={() => addToast({ type: 'info', message: `Reassigning ${col.id}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><RefreshCw size={16} /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            <button onClick={() => addToast({ type: 'info', message: 'Assign agent form opened' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: '#8b5cf6' }}><UserPlus size={16} />Assign Agent</button>
            <button onClick={() => addToast({ type: 'info', message: 'Auto-balancing agent workloads...' })} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><RefreshCw size={16} />Auto-Balance</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dropboxAgentsData.map(agent => (
              <div key={agent.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: 'rgba(139,92,246,0.1)' }}>{agent.photo}</div>
                      <div>
                        <p className="font-semibold text-lg" style={{ color: theme.text.primary }}>{agent.name}</p>
                        <p className="text-sm" style={{ color: theme.text.muted }}>{agent.phone} • {agent.zone}</p>
                        <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{agent.vehicle}</p>
                      </div>
                    </div>
                    <StatusBadge status={agent.status} />
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[['Today', agent.collectionsToday, '#8b5cf6'], ['Collected', agent.totalCollected, '#3b82f6'], ['Rating', `★ ${agent.rating}`, '#f59e0b'], ['Avg Time', agent.avgCollectionTime, '#10b981']].map(([l, v, c]) => (
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
                        const fc = fp >= 95 ? '#ef4444' : fp >= 75 ? '#f59e0b' : '#10b981';
                        return (
                          <div key={dbxId} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                            <div className="flex items-center gap-3">
                              <Inbox size={16} style={{ color: '#8b5cf6' }} />
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
                  <button onClick={() => addToast({ type: 'info', message: `Calling ${agent.name}...` })} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: '#3b82f6' }}><Phone size={14} />Call</button>
                  <div className="w-px" style={{ backgroundColor: theme.border.primary }} />
                  <button onClick={() => addToast({ type: 'info', message: `Messaging ${agent.name}...` })} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: '#10b981' }}><MessageSquare size={14} />Message</button>
                  <div className="w-px" style={{ backgroundColor: theme.border.primary }} />
                  <button onClick={() => addToast({ type: 'info', message: `Editing ${agent.name} assignments` })} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: theme.text.secondary }}><Edit size={14} />Edit</button>
                </div>
              </div>
            ))}
          </div>

          {/* Coverage Summary */}
          <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
                        <div key={a.id} className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: a.status === 'active' ? 'rgba(16,185,129,0.2)' : a.status === 'on_delivery' ? 'rgba(59,130,246,0.2)' : 'rgba(107,114,128,0.2)' }}>{a.photo}</div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Package Flow */}
      {activeSubMenu === 'Package Flow' && (
        <div className="space-y-6">
          {/* Flow Stage Summary */}
          <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Dropbox → Locker Pipeline</h3>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {[
                { label: 'In Dropbox', count: dropboxFlowData.filter(f => f.stage === 'awaiting_collection').length, color: '#f59e0b', icon: Inbox },
                { label: 'Overdue', count: dropboxFlowData.filter(f => f.stage === 'collection_overdue').length, color: '#ef4444', icon: AlertTriangle },
                { label: 'Collected', count: dropboxFlowData.filter(f => f.stage === 'collected').length, color: '#3b82f6', icon: CheckCircle },
                { label: 'In Transit', count: dropboxFlowData.filter(f => f.stage === 'in_transit').length, color: '#6366f1', icon: Truck },
                { label: 'At Terminal', count: dropboxFlowData.filter(f => f.stage === 'at_terminal').length, color: '#8b5cf6', icon: Building2 },
                { label: 'In Locker', count: dropboxFlowData.filter(f => f.stage === 'delivered_to_locker').length, color: '#10b981', icon: Grid3X3 },
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
          </div>

          {/* Active Flow Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
                      <tr key={flow.id} style={{ borderBottom: `1px solid ${theme.border.primary}`, backgroundColor: flow.stage === 'collection_overdue' ? 'rgba(239,68,68,0.03)' : 'transparent' }}>
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
                                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: idx <= currentStep ? (stageInfo?.color || '#6b7280') : theme.border.primary }}>
                                  {idx < currentStep ? <Check size={10} className="text-white" /> : idx === currentStep ? <Circle size={6} className="text-white fill-white" /> : null}
                                </div>
                                {idx < steps.length - 1 && <div className="w-3 h-0.5" style={{ backgroundColor: idx < currentStep ? (stageInfo?.color || '#6b7280') : theme.border.primary }} />}
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
                          <span className="text-sm" style={{ color: flow.stage === 'collection_overdue' ? '#ef4444' : theme.text.muted }}>{flow.eta}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Flow Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h3 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Avg. Flow Time</h3>
              <div className="space-y-3">
                {[['Dropbox → Collection', '2.4 hrs', '#f59e0b'], ['Collection → Terminal', '1.2 hrs', '#6366f1'], ['Terminal → Locker', '0.5 hrs', '#10b981'], ['Total End-to-End', '4.1 hrs', '#8b5cf6']].map(([l, v, c]) => (
                  <div key={l} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: theme.text.muted }}>{l}</span>
                    <span className="font-bold" style={{ color: c }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h3 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Top Dropboxes by Volume</h3>
              <div className="space-y-3">
                {dropboxesData.filter(d => d.status !== 'maintenance').sort((a, b) => b.avgDailyVolume - a.avgDailyVolume).slice(0, 4).map((d, i) => (
                  <div key={d.id} className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#a3a3a3' : i === 2 ? '#cd7c32' : theme.border.secondary }}>{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: theme.text.primary }}>{d.name}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: '#8b5cf6' }}>{d.avgDailyVolume}/day</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h3 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Bottlenecks</h3>
              <div className="space-y-3">
                {dropboxFlowData.filter(f => f.stage === 'collection_overdue').length > 0 ? (
                  dropboxFlowData.filter(f => f.stage === 'collection_overdue').map(f => (
                    <div key={f.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.05)' }}>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
