import React from 'react';
import { Briefcase, Download, Plus, Building2, Package, DollarSign, TrendingUp, Eye, Edit, Truck, CheckCircle2, Clock, FileDown, Route, Receipt, CreditCard, Banknote, AlertTriangle, Printer, Send, Key, BarChart, Lock, Unlock, FileText, Cog } from 'lucide-react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard } from '../components/ui';
import { StatusBadge } from '../components/ui/Badge';
import { partnersData, TIERS, bulkShipmentsData, apiKeysData, partnerMonthlyData } from '../constants/mockData';

export const BusinessPortalPage = ({
  activeSubMenu,
  loading,
  setShowExport,
  addToast,
}) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
            <Briefcase size={28} style={{ color: theme.accent.primary }} /> Business Portal
          </h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Partner Dashboard'} • {partnersData.filter(p => p.status === 'active').length} active partners</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={16} />Export</button>
          <button onClick={() => addToast({ type: 'info', message: 'Partner onboarding form opened' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Plus size={18} />Onboard Partner</button>
        </div>
      </div>

      {/* Partner Dashboard */}
      {(!activeSubMenu || activeSubMenu === 'Partner Dashboard') && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Active Partners" value={partnersData.filter(p => p.status === 'active').length} icon={Building2} theme={theme} loading={loading} />
            <MetricCard title="Monthly Volume" value={partnersData.reduce((s, p) => s + p.monthlyVolume, 0)} change="14.3%" changeType="up" icon={Package} theme={theme} loading={loading} />
            <MetricCard title="Partner Revenue" value={`GH₵ ${(partnersData.reduce((s, p) => s + p.revenue, 0) / 1000).toFixed(1)}K`} change="22.1%" changeType="up" icon={DollarSign} theme={theme} loading={loading} />
            <MetricCard title="Avg Delivery Rate" value={`${(partnersData.filter(p => p.status === 'active').reduce((s, p) => s + p.deliveryRate, 0) / partnersData.filter(p => p.status === 'active').length).toFixed(1)}%`} icon={TrendingUp} theme={theme} loading={loading} />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(TIERS).map(([k, t]) => {
              const count = partnersData.filter(p => p.tier === k).length;
              return (
                <div key={k} className="p-4 rounded-xl border flex items-center gap-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: t.bg }}>{k === 'gold' ? '🥇' : k === 'silver' ? '🥈' : '🥉'}</div>
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: t.color }}>{t.label} Tier</p>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{t.perks}</p>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{count}</p>
                </div>
              );
            })}
          </div>
          <div className="space-y-4">
            {partnersData.map(p => (
              <div key={p.id} className="p-5 rounded-2xl border hover:border-opacity-50 transition-all" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: TIERS[p.tier]?.bg }}>{p.logo}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-lg" style={{ color: theme.text.primary }}>{p.name}</p>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: TIERS[p.tier]?.bg, color: TIERS[p.tier]?.color }}>{TIERS[p.tier]?.label}</span>
                        <StatusBadge status={p.status} />
                      </div>
                      <p className="text-sm" style={{ color: theme.text.muted }}>{p.type} • {p.email} • SLA: {p.sla}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-6 text-center">
                    <div><p className="text-xs" style={{ color: theme.text.muted }}>Monthly Vol.</p><p className="text-lg font-bold" style={{ color: theme.text.primary }}>{p.monthlyVolume}</p></div>
                    <div><p className="text-xs" style={{ color: theme.text.muted }}>Revenue</p><p className="text-lg font-bold" style={{ color: '#10b981' }}>GH₵ {(p.revenue / 1000).toFixed(1)}K</p></div>
                    <div><p className="text-xs" style={{ color: theme.text.muted }}>Delivery</p><p className="text-lg font-bold" style={{ color: p.deliveryRate > 95 ? '#10b981' : p.deliveryRate > 90 ? '#f59e0b' : '#ef4444' }}>{p.deliveryRate}%</p></div>
                    <div><p className="text-xs" style={{ color: theme.text.muted }}>API Calls</p><p className="text-lg font-bold" style={{ color: '#3b82f6' }}>{(p.apiCalls / 1000).toFixed(1)}K</p></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => addToast({ type: 'info', message: `Viewing ${p.name} portal` })} className="px-3 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary, border: `1px solid ${theme.accent.border}` }}><Eye size={14} className="inline mr-1" />View Portal</button>
                    <button className="p-2 rounded-xl" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted }}><Edit size={16} /></button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center gap-6 text-sm" style={{ borderColor: theme.border.primary }}>
                  <span style={{ color: theme.text.muted }}>Contract: <span style={{ color: theme.text.secondary }}>until {p.contractEnd}</span></span>
                  <span style={{ color: theme.text.muted }}>Total Orders: <span style={{ color: theme.text.secondary }}>{p.totalOrders}</span></span>
                  <span style={{ color: theme.text.muted }}>Last API: <span style={{ color: theme.text.secondary }}>{p.lastApiCall}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bulk Shipments */}
      {activeSubMenu === 'Bulk Shipments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Active Batches" value={bulkShipmentsData.filter(b => b.status !== 'delivered_to_locker').length} icon={Truck} theme={theme} loading={loading} />
            <MetricCard title="Total Packages" value={bulkShipmentsData.reduce((s, b) => s + b.packages, 0)} icon={Package} theme={theme} loading={loading} />
            <MetricCard title="Delivered" value={bulkShipmentsData.reduce((s, b) => s + b.delivered, 0)} icon={CheckCircle2} theme={theme} loading={loading} />
            <MetricCard title="Pending" value={bulkShipmentsData.reduce((s, b) => s + b.pending, 0)} icon={Clock} theme={theme} loading={loading} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => addToast({ type: 'info', message: 'New bulk shipment form' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Plus size={16} />New Batch</button>
            <button onClick={() => addToast({ type: 'info', message: 'Import CSV dialog' })} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><FileDown size={16} />Import CSV</button>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Batch</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Partner</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Terminal</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Progress</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>ETA</th>
                  <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bulkShipmentsData.map(b => (
                  <tr key={b.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <td className="p-4"><span className="font-mono font-bold" style={{ color: theme.text.primary }}>{b.id}</span><br/><span className="text-xs" style={{ color: theme.text.muted }}>{b.created}</span></td>
                    <td className="p-4"><span style={{ color: theme.text.primary }}>{b.partner}</span></td>
                    <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{b.terminal}</span></td>
                    <td className="p-4"><StatusBadge status={b.status} /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                          <div className="h-full rounded-full" style={{ width: `${(b.delivered / b.packages) * 100}%`, backgroundColor: b.delivered === b.packages ? '#10b981' : '#3b82f6' }} />
                        </div>
                        <span className="text-xs font-mono" style={{ color: theme.text.secondary }}>{b.delivered}/{b.packages}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{b.eta}</span></td>
                    <td className="p-4 text-right">
                      <button onClick={() => addToast({ type: 'info', message: `Viewing batch ${b.id}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Eye size={16} /></button>
                      <button onClick={() => addToast({ type: 'info', message: `Tracking batch ${b.id}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Route size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoices & Billing */}
      {activeSubMenu === 'Invoices & Billing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Total Billed" value="GH₵ 43K" change="18.5%" changeType="up" icon={Receipt} theme={theme} loading={loading} />
            <MetricCard title="Collected" value="GH₵ 27.5K" icon={CreditCard} theme={theme} loading={loading} />
            <MetricCard title="Outstanding" value="GH₵ 15.5K" icon={Banknote} theme={theme} loading={loading} />
            <MetricCard title="Overdue" value="GH₵ 450" icon={AlertTriangle} theme={theme} loading={loading} subtitle="1 invoice" />
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Partner Invoices</h3>
              <button onClick={() => addToast({ type: 'info', message: 'Generate invoice' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Plus size={16} />Create Invoice</button>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Invoice</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Partner</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Period</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Due Date</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Amount</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                  <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[{ id: 'INV-B001', partner: 'Jumia Ghana', period: 'Jan 2024', due: '2024-01-31', amount: 15000, status: 'paid' },
                  { id: 'INV-B002', partner: 'Melcom Ltd', period: 'Jan 2024', due: '2024-01-31', amount: 12500, status: 'pending' },
                  { id: 'INV-B003', partner: 'Telecel Ghana', period: 'Jan 2024', due: '2024-01-31', amount: 8500, status: 'pending' },
                  { id: 'INV-B004', partner: 'Hubtel', period: 'Jan 2024', due: '2024-01-31', amount: 4200, status: 'pending' },
                  { id: 'INV-B005', partner: 'Jumia Ghana', period: 'Dec 2023', due: '2024-01-15', amount: 13200, status: 'paid' },
                  { id: 'INV-B006', partner: 'CompuGhana', period: 'Nov 2023', due: '2023-12-15', amount: 450, status: 'overdue' }
                ].map(inv => (
                  <tr key={inv.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <td className="p-4"><span className="font-mono font-medium" style={{ color: theme.text.primary }}>{inv.id}</span></td>
                    <td className="p-4"><span style={{ color: theme.text.primary }}>{inv.partner}</span></td>
                    <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{inv.period}</span></td>
                    <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: inv.status === 'overdue' ? '#ef4444' : theme.text.muted }}>{inv.due}</span></td>
                    <td className="p-4"><span className="font-medium" style={{ color: theme.text.primary }}>GH₵ {inv.amount.toLocaleString()}</span></td>
                    <td className="p-4"><StatusBadge status={inv.status} /></td>
                    <td className="p-4 text-right">
                      <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Eye size={16} /></button>
                      <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Printer size={16} /></button>
                      {inv.status !== 'paid' && <button onClick={() => addToast({ type: 'success', message: `Reminder sent to ${inv.partner}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Send size={16} /></button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* API Management */}
      {activeSubMenu === 'API Management' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Active Keys" value={apiKeysData.filter(k => k.status === 'active').length} icon={Key} theme={theme} loading={loading} />
            <MetricCard title="Calls Today" value={apiKeysData.reduce((s, k) => s + k.callsToday, 0).toLocaleString()} icon={TrendingUp} theme={theme} loading={loading} />
            <MetricCard title="Calls This Month" value={`${(apiKeysData.reduce((s, k) => s + k.callsMonth, 0) / 1000).toFixed(1)}K`} icon={BarChart} theme={theme} loading={loading} />
            <MetricCard title="Revoked Keys" value={apiKeysData.filter(k => k.status === 'revoked').length} icon={Lock} theme={theme} loading={loading} />
          </div>
          <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>API Documentation</h3>
              <div className="flex gap-2">
                <button onClick={() => addToast({ type: 'info', message: 'Opening API docs...' })} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary, border: `1px solid ${theme.accent.border}` }}><FileText size={14} className="inline mr-2" />View Docs</button>
                <button onClick={() => addToast({ type: 'info', message: 'Opening webhook config...' })} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Cog size={14} className="inline mr-2" />Webhooks</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{ label: 'REST API', desc: 'Package CRUD, tracking, locker management', version: 'v2.1', color: '#3b82f6' },
                { label: 'Webhooks', desc: 'Real-time status updates, delivery events', version: '12 events', color: '#10b981' },
                { label: 'Bulk Upload', desc: 'CSV/JSON batch import, up to 500 packages', version: 'v1.3', color: '#8b5cf6' }
              ].map(api => (
                <div key={api.label} className="p-4 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: api.color }} />
                    <span className="font-medium" style={{ color: theme.text.primary }}>{api.label}</span>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${api.color}15`, color: api.color }}>{api.version}</span>
                  </div>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{api.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>API Keys</h3>
              <button onClick={() => addToast({ type: 'info', message: 'Generate new API key' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Key size={16} />Generate Key</button>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Partner</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Key</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Environment</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Usage Today</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                  <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeysData.map(k => (
                  <tr key={k.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <td className="p-4"><span style={{ color: theme.text.primary }}>{k.partner}</span></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm px-2 py-1 rounded" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary, fontFamily: theme.font.mono }}>{k.key}</code>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: k.env === 'production' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', color: k.env === 'production' ? '#10b981' : '#f59e0b' }}>{k.env}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                          <div className="h-full rounded-full" style={{ width: `${(k.callsToday / k.rateLimit) * 100}%`, backgroundColor: k.callsToday / k.rateLimit > 0.8 ? '#ef4444' : k.callsToday / k.rateLimit > 0.5 ? '#f59e0b' : '#10b981' }} />
                        </div>
                        <span className="text-xs font-mono" style={{ color: theme.text.secondary }}>{k.callsToday}/{k.rateLimit}</span>
                      </div>
                    </td>
                    <td className="p-4"><StatusBadge status={k.status === 'revoked' ? 'expired' : k.status} /></td>
                    <td className="p-4 text-right">
                      <button onClick={() => addToast({ type: 'info', message: 'Key copied to clipboard' })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Eye size={16} /></button>
                      {k.status === 'active' ? (
                        <button onClick={() => addToast({ type: 'warning', message: `Key ${k.key} revoked` })} className="p-2 rounded-lg hover:bg-white/5 text-red-500"><Lock size={16} /></button>
                      ) : (
                        <button onClick={() => addToast({ type: 'success', message: `Key reactivated` })} className="p-2 rounded-lg hover:bg-white/5 text-emerald-500"><Unlock size={16} /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Partner Analytics */}
      {activeSubMenu === 'Partner Analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: theme.text.primary }}>Monthly Volume by Partner</h3>
                <div className="flex gap-3">
                  {[{ l: 'Jumia', c: theme.accent.primary }, { l: 'Melcom', c: '#3b82f6' }, { l: 'Telecel', c: '#10b981' }, { l: 'Hubtel', c: '#f59e0b' }].map(i => (
                    <span key={i.l} className="flex items-center gap-1 text-xs" style={{ color: theme.text.muted }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: i.c }} />{i.l}</span>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsBarChart data={partnerMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                  <Bar dataKey="jumia" fill={theme.accent.primary} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="melcom" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="telecel" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="hubtel" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
            <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Partner Leaderboard</h3>
              <div className="space-y-4">
                {partnersData.filter(p => p.status === 'active').sort((a, b) => b.monthlyVolume - a.monthlyVolume).map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#a3a3a3' : i === 2 ? '#cd7c32' : theme.border.secondary }}>{i + 1}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{p.name}</p>
                      <div className="w-full h-1.5 rounded-full mt-1" style={{ backgroundColor: theme.border.primary }}>
                        <div className="h-full rounded-full" style={{ width: `${(p.monthlyVolume / 150) * 100}%`, backgroundColor: TIERS[p.tier]?.color }} />
                      </div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: theme.text.primary }}>{p.monthlyVolume}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>SLA Compliance</h3>
              <div className="space-y-4">
                {partnersData.filter(p => p.status === 'active').map(p => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{p.logo}</span>
                      <div>
                        <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{p.name}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>SLA: {p.sla}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                        <div className="h-full rounded-full" style={{ width: `${p.deliveryRate}%`, backgroundColor: p.deliveryRate > 95 ? '#10b981' : p.deliveryRate > 90 ? '#f59e0b' : '#ef4444' }} />
                      </div>
                      <span className="text-sm font-bold w-14 text-right" style={{ color: p.deliveryRate > 95 ? '#10b981' : p.deliveryRate > 90 ? '#f59e0b' : '#ef4444' }}>{p.deliveryRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Revenue by Partner</h3>
              <div className="space-y-4">
                {partnersData.filter(p => p.status === 'active').sort((a, b) => b.revenue - a.revenue).map(p => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{p.logo}</span>
                      <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{p.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold" style={{ color: '#10b981' }}>GH₵ {(p.revenue / 1000).toFixed(1)}K</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{((p.revenue / partnersData.reduce((s, x) => s + x.revenue, 0)) * 100).toFixed(1)}% share</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
