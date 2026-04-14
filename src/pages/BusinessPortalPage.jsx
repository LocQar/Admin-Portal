import React, { useState } from 'react';
import { Briefcase, Download, Plus, Building2, Package, DollarSign, TrendingUp, Eye, Edit, Truck, CheckCircle2, Clock, FileDown, Route, Receipt, CreditCard, Banknote, AlertTriangle, Printer, Send, Key, BarChart, Lock, Unlock, FileText, Cog, X, Copy, Upload, Trash2, Check, Globe, Bell } from 'lucide-react';
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard } from '../components/ui';
import { GlassCard } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { partnersData, TIERS, bulkShipmentsData, apiKeysData, partnerMonthlyData } from '../constants/mockData';

export const BusinessPortalPage = ({
  activeSubMenu,
  loading,
  setShowExport,
  addToast,
}) => {
  const { theme } = useTheme();

  // Modal visibility state
  const [showOnboardModal, setShowOnboardModal] = useState(false);
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showPartnerDetail, setShowPartnerDetail] = useState(null);
  const [showBatchDetail, setShowBatchDetail] = useState(null);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [confirmRevoke, setConfirmRevoke] = useState(null);
  const [generatedKey, setGeneratedKey] = useState(null);

  // Onboard partner form
  const [onboardForm, setOnboardForm] = useState({ companyName: '', email: '', phone: '', type: 'ecommerce', tier: 'silver', slaTarget: '95' });

  // New batch form
  const [batchForm, setBatchForm] = useState({ partner: '', terminal: '', packageCount: '', notes: '' });

  // Import CSV state
  const [importFile, setImportFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  // Invoice form
  const [invoiceForm, setInvoiceForm] = useState({ partner: '', period: '', lineItems: [{ description: '', amount: '' }] });

  // Generate key form
  const [keyForm, setKeyForm] = useState({ partner: '', env: 'production', rateLimit: '1000', permissions: { packages: true, tracking: true, lockers: false, billing: false, webhooks: false } });

  // Webhook form
  const [webhookForm, setWebhookForm] = useState({ url: '', events: { package_created: true, package_delivered: false, package_picked_up: false, locker_assigned: false, delivery_failed: false, invoice_generated: false } });

  const invoiceTotal = invoiceForm.lineItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

  // Shared modal overlay component
  const ModalOverlay = ({ children, onClose, title, wide }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className={`rounded-2xl border shadow-2xl ${wide ? 'w-full max-w-2xl' : 'w-full max-w-lg'} max-h-[85vh] overflow-y-auto`} style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: theme.border.primary }}>
          <h3 className="text-lg font-semibold" style={{ color: theme.text.primary }}>{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10" style={{ color: theme.text.muted }}><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );

  // Shared input style
  const inputStyle = { backgroundColor: theme.bg.tertiary, color: theme.text.primary, borderColor: theme.border.primary };
  const labelStyle = { color: theme.text.secondary };

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
          <button onClick={() => setShowExport(true)} className="btn-outline flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><Download size={16} />Export</button>
          <button onClick={() => { setOnboardForm({ companyName: '', email: '', phone: '', type: 'ecommerce', tier: 'silver', slaTarget: '95' }); setShowOnboardModal(true); }} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><Plus size={18} />Onboard Partner</button>
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
                <GlassCard key={k} className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: t.bg }}>{k === 'gold' ? '🥇' : k === 'silver' ? '🥈' : '🥉'}</div>
                  <div className="flex-1">
                    <p className="font-semibold" style={{ color: t.color }}>{t.label} Tier</p>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{t.perks}</p>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{count}</p>
                </GlassCard>
              );
            })}
          </div>
          <div className="space-y-4">
            {partnersData.map(p => (
              <GlassCard key={p.id} className="hover:border-opacity-50 transition-all">
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
                    <div><p className="text-xs" style={{ color: theme.text.muted }}>Revenue</p><p className="text-lg font-bold" style={{ color: theme.status.success }}>GH₵ {(p.revenue / 1000).toFixed(1)}K</p></div>
                    <div><p className="text-xs" style={{ color: theme.text.muted }}>Delivery</p><p className="text-lg font-bold" style={{ color: p.deliveryRate > 95 ? theme.status.success : p.deliveryRate > 90 ? theme.status.warning : theme.status.error }}>{p.deliveryRate}%</p></div>
                    <div><p className="text-xs" style={{ color: theme.text.muted }}>API Calls</p><p className="text-lg font-bold" style={{ color: theme.accent.primary }}>{(p.apiCalls / 1000).toFixed(1)}K</p></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowPartnerDetail(p)} className="px-3 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary, border: `1px solid ${theme.accent.border}` }}><Eye size={14} className="inline mr-1" />View Portal</button>
                    <button className="p-2 rounded-xl" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted }}><Edit size={16} /></button>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t flex items-center gap-6 text-sm" style={{ borderColor: theme.border.primary }}>
                  <span style={{ color: theme.text.muted }}>Contract: <span style={{ color: theme.text.secondary }}>until {p.contractEnd}</span></span>
                  <span style={{ color: theme.text.muted }}>Total Orders: <span style={{ color: theme.text.secondary }}>{p.totalOrders}</span></span>
                  <span style={{ color: theme.text.muted }}>Last API: <span style={{ color: theme.text.secondary }}>{p.lastApiCall}</span></span>
                </div>
              </GlassCard>
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
            <button onClick={() => { setBatchForm({ partner: '', terminal: '', packageCount: '', notes: '' }); setShowBatchModal(true); }} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><Plus size={16} />New Batch</button>
            <button onClick={() => { setImportFile(null); setShowImportModal(true); }} className="btn-outline flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><FileDown size={16} />Import CSV</button>
          </div>
          <GlassCard noPadding className="overflow-hidden">
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
                          <div className="h-full rounded-full" style={{ width: `${(b.delivered / b.packages) * 100}%`, backgroundColor: b.delivered === b.packages ? theme.status.success : theme.accent.primary }} />
                        </div>
                        <span className="text-xs font-mono" style={{ color: theme.text.secondary }}>{b.delivered}/{b.packages}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{b.eta}</span></td>
                    <td className="p-4 text-right">
                      <button onClick={() => setShowBatchDetail(b)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }} title="View batch"><Eye size={16} /></button>
                      <button onClick={() => setShowBatchDetail(b)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }} title="Track batch"><Route size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
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
          <GlassCard noPadding className="overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Partner Invoices</h3>
              <button onClick={() => { setInvoiceForm({ partner: '', period: '', lineItems: [{ description: '', amount: '' }] }); setShowInvoiceModal(true); }} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><Plus size={16} />Create Invoice</button>
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
                    <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: inv.status === 'overdue' ? theme.status.error : theme.text.muted }}>{inv.due}</span></td>
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
          </GlassCard>
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
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>API Documentation</h3>
              <div className="flex gap-2">
                <button onClick={() => setShowDocsModal(true)} className="btn-primary px-4 py-2 rounded-xl text-sm"><FileText size={14} className="inline mr-2" />View Docs</button>
                <button onClick={() => { setWebhookForm({ url: '', events: { package_created: true, package_delivered: false, package_picked_up: false, locker_assigned: false, delivery_failed: false, invoice_generated: false } }); setShowWebhookModal(true); }} className="btn-outline px-4 py-2 rounded-xl text-sm"><Cog size={14} className="inline mr-2" />Webhooks</button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[{ label: 'REST API', desc: 'Package CRUD, tracking, locker management', version: 'v2.1', color: theme.accent.primary },
                { label: 'Webhooks', desc: 'Real-time status updates, delivery events', version: '12 events', color: theme.status.success },
                { label: 'Bulk Upload', desc: 'CSV/JSON batch import, up to 500 packages', version: 'v1.3', color: theme.chart.violet }
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
          </GlassCard>
          <GlassCard noPadding className="overflow-hidden">
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>API Keys</h3>
              <button onClick={() => { setKeyForm({ partner: '', env: 'production', rateLimit: '1000', permissions: { packages: true, tracking: true, lockers: false, billing: false, webhooks: false } }); setGeneratedKey(null); setShowKeyModal(true); }} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"><Key size={16} />Generate Key</button>
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
                      <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: k.env === 'production' ? `${theme.status.success}15` : `${theme.status.warning}15`, color: k.env === 'production' ? theme.status.success : theme.status.warning }}>{k.env}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                          <div className="h-full rounded-full" style={{ width: `${(k.callsToday / k.rateLimit) * 100}%`, backgroundColor: k.callsToday / k.rateLimit > 0.8 ? theme.status.error : k.callsToday / k.rateLimit > 0.5 ? theme.status.warning : theme.status.success }} />
                        </div>
                        <span className="text-xs font-mono" style={{ color: theme.text.secondary }}>{k.callsToday}/{k.rateLimit}</span>
                      </div>
                    </td>
                    <td className="p-4"><StatusBadge status={k.status === 'revoked' ? 'expired' : k.status} /></td>
                    <td className="p-4 text-right">
                      <button onClick={() => { navigator.clipboard.writeText(k.key).then(() => addToast({ type: 'success', message: 'API key copied to clipboard' })).catch(() => addToast({ type: 'error', message: 'Failed to copy key' })); }} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }} title="Copy key"><Copy size={16} /></button>
                      {k.status === 'active' ? (
                        <button onClick={() => setConfirmRevoke({ key: k, action: 'revoke' })} className="p-2 rounded-lg hover:bg-white/5 text-red-500" title="Revoke key"><Lock size={16} /></button>
                      ) : (
                        <button onClick={() => setConfirmRevoke({ key: k, action: 'reactivate' })} className="p-2 rounded-lg hover:bg-white/5 text-emerald-500" title="Reactivate key"><Unlock size={16} /></button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassCard>
        </div>
      )}

      {/* Partner Analytics */}
      {activeSubMenu === 'Partner Analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <GlassCard className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: theme.text.primary }}>Monthly Volume by Partner</h3>
                <div className="flex gap-3">
                  {[{ l: 'Jumia', c: theme.chart.blue }, { l: 'Melcom', c: theme.chart.teal }, { l: 'Telecel', c: theme.chart.green }, { l: 'Hubtel', c: theme.chart.amber }].map(i => (
                    <span key={i.l} className="flex items-center gap-1 text-xs" style={{ color: theme.text.muted }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: i.c }} />{i.l}</span>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsBarChart data={partnerMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} labelStyle={{ color: theme.text.primary }} itemStyle={{ color: theme.text.secondary }} />
                  <Bar dataKey="jumia" fill={theme.chart.blue} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="melcom" fill={theme.chart.teal} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="telecel" fill={theme.chart.green} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="hubtel" fill={theme.chart.amber} radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </GlassCard>
            <GlassCard>
              <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Partner Leaderboard</h3>
              <div className="space-y-4">
                {partnersData.filter(p => p.status === 'active').sort((a, b) => b.monthlyVolume - a.monthlyVolume).map((p, i) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: i === 0 ? theme.status.warning : i === 1 ? '#a3a3a3' : i === 2 ? '#cd7c32' : theme.border.secondary, color: '#1C1917' }}>{i + 1}</span>
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
            </GlassCard>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard>
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
                        <div className="h-full rounded-full" style={{ width: `${p.deliveryRate}%`, backgroundColor: p.deliveryRate > 95 ? theme.status.success : p.deliveryRate > 90 ? theme.status.warning : theme.status.error }} />
                      </div>
                      <span className="text-sm font-bold w-14 text-right" style={{ color: p.deliveryRate > 95 ? theme.status.success : p.deliveryRate > 90 ? theme.status.warning : theme.status.error }}>{p.deliveryRate}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
            <GlassCard>
              <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Revenue by Partner</h3>
              <div className="space-y-4">
                {partnersData.filter(p => p.status === 'active').sort((a, b) => b.revenue - a.revenue).map(p => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{p.logo}</span>
                      <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{p.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold" style={{ color: theme.status.success }}>GH₵ {(p.revenue / 1000).toFixed(1)}K</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{((p.revenue / partnersData.reduce((s, x) => s + x.revenue, 0)) * 100).toFixed(1)}% share</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      )}
      {/* ========== MODALS ========== */}

      {/* Onboard Partner Modal */}
      {showOnboardModal && (
        <ModalOverlay title="Onboard New Partner" onClose={() => setShowOnboardModal(false)}>
          <form onSubmit={e => { e.preventDefault(); setShowOnboardModal(false); addToast({ type: 'success', message: `${onboardForm.companyName} onboarded successfully` }); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>Company Name</label>
              <input required value={onboardForm.companyName} onChange={e => setOnboardForm({ ...onboardForm, companyName: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle} placeholder="e.g. Jumia Ghana" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>Email</label>
                <input required type="email" value={onboardForm.email} onChange={e => setOnboardForm({ ...onboardForm, email: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle} placeholder="partner@company.com" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>Phone</label>
                <input required value={onboardForm.phone} onChange={e => setOnboardForm({ ...onboardForm, phone: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle} placeholder="+233 XX XXX XXXX" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>Partner Type</label>
                <select value={onboardForm.type} onChange={e => setOnboardForm({ ...onboardForm, type: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle}>
                  <option value="ecommerce">E-Commerce</option>
                  <option value="retail">Retail</option>
                  <option value="logistics">Logistics</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>Tier</label>
                <select value={onboardForm.tier} onChange={e => setOnboardForm({ ...onboardForm, tier: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle}>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>SLA Target (%)</label>
              <input required type="number" min="80" max="100" value={onboardForm.slaTarget} onChange={e => setOnboardForm({ ...onboardForm, slaTarget: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle} />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowOnboardModal(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: theme.text.muted }}>Cancel</button>
              <button type="submit" className="btn-primary px-6 py-2 rounded-xl text-sm">Onboard Partner</button>
            </div>
          </form>
        </ModalOverlay>
      )}

      {/* Partner Detail Modal */}
      {showPartnerDetail && (
        <ModalOverlay title={showPartnerDetail.name} onClose={() => setShowPartnerDetail(null)} wide>
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl" style={{ backgroundColor: TIERS[showPartnerDetail.tier]?.bg }}>{showPartnerDetail.logo}</div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold" style={{ color: theme.text.primary }}>{showPartnerDetail.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: TIERS[showPartnerDetail.tier]?.bg, color: TIERS[showPartnerDetail.tier]?.color }}>{TIERS[showPartnerDetail.tier]?.label}</span>
                  <StatusBadge status={showPartnerDetail.status} />
                </div>
                <p className="text-sm" style={{ color: theme.text.muted }}>{showPartnerDetail.type}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                <p className="text-xs font-medium mb-1" style={{ color: theme.text.muted }}>Contact</p>
                <p className="text-sm" style={{ color: theme.text.primary }}>{showPartnerDetail.email}</p>
                <p className="text-sm" style={{ color: theme.text.secondary }}>{showPartnerDetail.phone || 'No phone listed'}</p>
              </div>
              <div className="p-3 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                <p className="text-xs font-medium mb-1" style={{ color: theme.text.muted }}>Contract</p>
                <p className="text-sm" style={{ color: theme.text.primary }}>Until {showPartnerDetail.contractEnd}</p>
                <p className="text-sm" style={{ color: theme.text.secondary }}>SLA: {showPartnerDetail.sla}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Delivery Stats</p>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Monthly Volume', value: showPartnerDetail.monthlyVolume, color: theme.text.primary },
                  { label: 'Total Orders', value: showPartnerDetail.totalOrders, color: theme.text.primary },
                  { label: 'Delivery Rate', value: `${showPartnerDetail.deliveryRate}%`, color: showPartnerDetail.deliveryRate > 95 ? theme.status.success : theme.status.warning },
                  { label: 'Revenue', value: `GH₵ ${(showPartnerDetail.revenue / 1000).toFixed(1)}K`, color: theme.status.success },
                ].map(s => (
                  <div key={s.label} className="text-center p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{s.label}</p>
                    <p className="text-lg font-bold" style={{ color: s.color }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Recent API Activity</p>
              <div className="p-3 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: theme.text.secondary }}>Total API Calls</span>
                  <span className="font-bold" style={{ color: theme.accent.primary }}>{(showPartnerDetail.apiCalls / 1000).toFixed(1)}K</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm" style={{ color: theme.text.secondary }}>Last API Call</span>
                  <span className="text-sm" style={{ color: theme.text.primary }}>{showPartnerDetail.lastApiCall}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setShowPartnerDetail(null)} className="px-4 py-2 rounded-xl text-sm" style={{ color: theme.text.muted }}>Close</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* New Batch Modal */}
      {showBatchModal && (
        <ModalOverlay title="New Bulk Shipment Batch" onClose={() => setShowBatchModal(false)}>
          <form onSubmit={e => { e.preventDefault(); setShowBatchModal(false); addToast({ type: 'success', message: `Batch created for ${batchForm.partner || 'partner'} with ${batchForm.packageCount} packages` }); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>Partner</label>
              <select required value={batchForm.partner} onChange={e => setBatchForm({ ...batchForm, partner: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle}>
                <option value="">Select partner...</option>
                {partnersData.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                {partnersData.length === 0 && <option value="demo">Demo Partner</option>}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>Terminal Destination</label>
              <input required value={batchForm.terminal} onChange={e => setBatchForm({ ...batchForm, terminal: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle} placeholder="e.g. Accra Central Terminal" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>Package Count</label>
              <input required type="number" min="1" value={batchForm.packageCount} onChange={e => setBatchForm({ ...batchForm, packageCount: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle} placeholder="Number of packages" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>Notes</label>
              <textarea value={batchForm.notes} onChange={e => setBatchForm({ ...batchForm, notes: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle} rows={3} placeholder="Optional notes..." />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowBatchModal(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: theme.text.muted }}>Cancel</button>
              <button type="submit" className="btn-primary px-6 py-2 rounded-xl text-sm">Create Batch</button>
            </div>
          </form>
        </ModalOverlay>
      )}

      {/* Import CSV Modal */}
      {showImportModal && (
        <ModalOverlay title="Import CSV" onClose={() => setShowImportModal(false)}>
          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer"
              style={{ borderColor: dragOver ? theme.accent.primary : theme.border.primary, backgroundColor: dragOver ? `${theme.accent.primary}08` : 'transparent' }}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) setImportFile(f); }}
              onClick={() => { const input = document.createElement('input'); input.type = 'file'; input.accept = '.csv'; input.onchange = e => { if (e.target.files[0]) setImportFile(e.target.files[0]); }; input.click(); }}
            >
              <Upload size={32} className="mx-auto mb-3" style={{ color: theme.text.muted }} />
              {importFile ? (
                <div>
                  <p className="font-medium" style={{ color: theme.text.primary }}>{importFile.name}</p>
                  <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{(importFile.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="font-medium" style={{ color: theme.text.primary }}>Drop CSV file here or click to browse</p>
                  <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Supports .csv files up to 10MB</p>
                </div>
              )}
            </div>
            <button onClick={() => addToast({ type: 'info', message: 'CSV template download started' })} className="flex items-center gap-2 text-sm" style={{ color: theme.accent.primary }}>
              <Download size={14} /> Download CSV template
            </button>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={() => setShowImportModal(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: theme.text.muted }}>Cancel</button>
              <button
                onClick={() => { if (!importFile) { addToast({ type: 'warning', message: 'Please select a CSV file first' }); return; } setShowImportModal(false); addToast({ type: 'success', message: `Imported ${importFile.name} successfully` }); }}
                className="btn-primary px-6 py-2 rounded-xl text-sm"
              >Import</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Batch Detail Modal */}
      {showBatchDetail && (
        <ModalOverlay title={`Batch ${showBatchDetail.id}`} onClose={() => setShowBatchDetail(null)} wide>
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Partner', value: showBatchDetail.partner },
                { label: 'Terminal', value: showBatchDetail.terminal },
                { label: 'Created', value: showBatchDetail.created },
                { label: 'ETA', value: showBatchDetail.eta },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{item.label}</p>
                  <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{item.value}</p>
                </div>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Progress</p>
              <div className="flex items-center gap-3 mb-2">
                <StatusBadge status={showBatchDetail.status} />
                <span className="text-sm font-mono" style={{ color: theme.text.secondary }}>{showBatchDetail.delivered}/{showBatchDetail.packages} delivered</span>
              </div>
              <div className="w-full h-3 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${(showBatchDetail.delivered / showBatchDetail.packages) * 100}%`, backgroundColor: showBatchDetail.delivered === showBatchDetail.packages ? theme.status.success : theme.accent.primary }} />
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Tracking Timeline</p>
              <div className="space-y-3">
                {[
                  { time: showBatchDetail.created, event: 'Batch created', icon: Plus, done: true },
                  { time: showBatchDetail.created, event: 'Packages scanned in', icon: Package, done: showBatchDetail.delivered > 0 },
                  { time: '', event: 'In transit to terminal', icon: Truck, done: ['in_transit', 'at_terminal', 'delivered_to_locker'].includes(showBatchDetail.status) },
                  { time: '', event: 'Arrived at terminal', icon: Building2, done: ['at_terminal', 'delivered_to_locker'].includes(showBatchDetail.status) },
                  { time: '', event: 'Delivered to lockers', icon: CheckCircle2, done: showBatchDetail.status === 'delivered_to_locker' },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: step.done ? `${theme.status.success}20` : theme.bg.tertiary }}>
                      <step.icon size={14} style={{ color: step.done ? theme.status.success : theme.text.muted }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm" style={{ color: step.done ? theme.text.primary : theme.text.muted }}>{step.event}</p>
                      {step.time && <p className="text-xs" style={{ color: theme.text.muted }}>{step.time}</p>}
                    </div>
                    {step.done && <Check size={14} style={{ color: theme.status.success }} />}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Package Summary</p>
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl text-center" style={{ backgroundColor: `${theme.status.success}10` }}>
                  <p className="text-lg font-bold" style={{ color: theme.status.success }}>{showBatchDetail.delivered}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>Delivered</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ backgroundColor: `${theme.status.warning}10` }}>
                  <p className="text-lg font-bold" style={{ color: theme.status.warning }}>{showBatchDetail.pending}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>Pending</p>
                </div>
                <div className="p-3 rounded-xl text-center" style={{ backgroundColor: `${theme.accent.primary}10` }}>
                  <p className="text-lg font-bold" style={{ color: theme.accent.primary }}>{showBatchDetail.packages}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>Total</p>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setShowBatchDetail(null)} className="px-4 py-2 rounded-xl text-sm" style={{ color: theme.text.muted }}>Close</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Create Invoice Modal */}
      {showInvoiceModal && (
        <ModalOverlay title="Create Invoice" onClose={() => setShowInvoiceModal(false)} wide>
          <form onSubmit={e => { e.preventDefault(); setShowInvoiceModal(false); addToast({ type: 'success', message: `Invoice created for ${invoiceForm.partner || 'partner'} — GH₵ ${invoiceTotal.toLocaleString()}` }); }} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>Partner</label>
                <select required value={invoiceForm.partner} onChange={e => setInvoiceForm({ ...invoiceForm, partner: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle}>
                  <option value="">Select partner...</option>
                  {partnersData.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  {partnersData.length === 0 && <option value="Demo Partner">Demo Partner</option>}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>Billing Period</label>
                <input required type="month" value={invoiceForm.period} onChange={e => setInvoiceForm({ ...invoiceForm, period: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={labelStyle}>Line Items</label>
                <button type="button" onClick={() => setInvoiceForm({ ...invoiceForm, lineItems: [...invoiceForm.lineItems, { description: '', amount: '' }] })} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg" style={{ color: theme.accent.primary, backgroundColor: theme.accent.light }}>
                  <Plus size={12} /> Add Item
                </button>
              </div>
              <div className="space-y-2">
                {invoiceForm.lineItems.map((item, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input required value={item.description} onChange={e => { const items = [...invoiceForm.lineItems]; items[i] = { ...items[i], description: e.target.value }; setInvoiceForm({ ...invoiceForm, lineItems: items }); }} className="flex-1 px-3 py-2 rounded-xl border text-sm" style={inputStyle} placeholder="Description" />
                    <input required type="number" min="0" step="0.01" value={item.amount} onChange={e => { const items = [...invoiceForm.lineItems]; items[i] = { ...items[i], amount: e.target.value }; setInvoiceForm({ ...invoiceForm, lineItems: items }); }} className="w-32 px-3 py-2 rounded-xl border text-sm" style={inputStyle} placeholder="Amount" />
                    {invoiceForm.lineItems.length > 1 && (
                      <button type="button" onClick={() => setInvoiceForm({ ...invoiceForm, lineItems: invoiceForm.lineItems.filter((_, j) => j !== i) })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.status.error }}><Trash2 size={14} /></button>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
              <span className="font-medium" style={{ color: theme.text.secondary }}>Total</span>
              <span className="text-lg font-bold" style={{ color: theme.status.success }}>GH₵ {invoiceTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowInvoiceModal(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: theme.text.muted }}>Cancel</button>
              <button type="submit" className="btn-primary px-6 py-2 rounded-xl text-sm">Create Invoice</button>
            </div>
          </form>
        </ModalOverlay>
      )}

      {/* Generate API Key Modal */}
      {showKeyModal && (
        <ModalOverlay title={generatedKey ? 'API Key Generated' : 'Generate API Key'} onClose={() => setShowKeyModal(false)}>
          {generatedKey ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border" style={{ borderColor: theme.status.success, backgroundColor: `${theme.status.success}08` }}>
                <p className="text-xs font-medium mb-2" style={{ color: theme.status.success }}>Your new API key (copy it now — it will not be shown again):</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm px-3 py-2 rounded-lg break-all" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary, fontFamily: 'monospace' }}>{generatedKey}</code>
                  <button onClick={() => { navigator.clipboard.writeText(generatedKey).then(() => addToast({ type: 'success', message: 'Key copied to clipboard' })); }} className="p-2 rounded-lg" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary }}><Copy size={16} /></button>
                </div>
              </div>
              <div className="flex justify-end">
                <button onClick={() => setShowKeyModal(false)} className="btn-primary px-6 py-2 rounded-xl text-sm">Done</button>
              </div>
            </div>
          ) : (
            <form onSubmit={e => { e.preventDefault(); const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; let key = 'lq_' + (keyForm.env === 'production' ? 'live_' : 'test_'); for (let i = 0; i < 32; i++) key += chars.charAt(Math.floor(Math.random() * chars.length)); setGeneratedKey(key); addToast({ type: 'success', message: 'API key generated' }); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={labelStyle}>Partner</label>
                <select required value={keyForm.partner} onChange={e => setKeyForm({ ...keyForm, partner: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle}>
                  <option value="">Select partner...</option>
                  {partnersData.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  {partnersData.length === 0 && <option value="Demo Partner">Demo Partner</option>}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={labelStyle}>Environment</label>
                  <select value={keyForm.env} onChange={e => setKeyForm({ ...keyForm, env: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle}>
                    <option value="production">Production</option>
                    <option value="sandbox">Sandbox</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={labelStyle}>Rate Limit (calls/day)</label>
                  <input required type="number" min="100" value={keyForm.rateLimit} onChange={e => setKeyForm({ ...keyForm, rateLimit: e.target.value })} className="w-full px-3 py-2 rounded-xl border text-sm" style={inputStyle} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={labelStyle}>Permissions</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(keyForm.permissions).map(([perm, checked]) => (
                    <label key={perm} className="flex items-center gap-2 p-2 rounded-lg cursor-pointer" style={{ backgroundColor: checked ? `${theme.accent.primary}10` : 'transparent' }}>
                      <input type="checkbox" checked={checked} onChange={e => setKeyForm({ ...keyForm, permissions: { ...keyForm.permissions, [perm]: e.target.checked } })} className="rounded" />
                      <span className="text-sm capitalize" style={{ color: theme.text.primary }}>{perm}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowKeyModal(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: theme.text.muted }}>Cancel</button>
                <button type="submit" className="btn-primary px-6 py-2 rounded-xl text-sm">Generate Key</button>
              </div>
            </form>
          )}
        </ModalOverlay>
      )}

      {/* Revoke/Reactivate Confirmation Modal */}
      {confirmRevoke && (
        <ModalOverlay title={confirmRevoke.action === 'revoke' ? 'Revoke API Key' : 'Reactivate API Key'} onClose={() => setConfirmRevoke(null)}>
          <div className="space-y-4">
            <div className="p-4 rounded-xl" style={{ backgroundColor: confirmRevoke.action === 'revoke' ? `${theme.status.error}10` : `${theme.status.success}10` }}>
              <p className="text-sm" style={{ color: theme.text.primary }}>
                {confirmRevoke.action === 'revoke'
                  ? `Are you sure you want to revoke the API key for ${confirmRevoke.key.partner}? This will immediately disable all API access using this key.`
                  : `Are you sure you want to reactivate the API key for ${confirmRevoke.key.partner}? This will restore API access using this key.`
                }
              </p>
              <div className="mt-2">
                <code className="text-xs px-2 py-1 rounded" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary, fontFamily: 'monospace' }}>{confirmRevoke.key.key}</code>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmRevoke(null)} className="px-4 py-2 rounded-xl text-sm" style={{ color: theme.text.muted }}>Cancel</button>
              <button
                onClick={() => {
                  const msg = confirmRevoke.action === 'revoke'
                    ? `Key ${confirmRevoke.key.key} revoked`
                    : `Key for ${confirmRevoke.key.partner} reactivated`;
                  addToast({ type: confirmRevoke.action === 'revoke' ? 'warning' : 'success', message: msg });
                  setConfirmRevoke(null);
                }}
                className="px-6 py-2 rounded-xl text-sm font-medium text-white"
                style={{ backgroundColor: confirmRevoke.action === 'revoke' ? theme.status.error : theme.status.success }}
              >
                {confirmRevoke.action === 'revoke' ? 'Revoke Key' : 'Reactivate Key'}
              </button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* API Docs Modal */}
      {showDocsModal && (
        <ModalOverlay title="API Documentation" onClose={() => setShowDocsModal(false)} wide>
          <div className="space-y-4">
            <p className="text-sm" style={{ color: theme.text.secondary }}>LocQar Partner API enables programmatic access to package management, locker assignments, tracking, and billing.</p>
            <div>
              <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Endpoints</p>
              <div className="space-y-2">
                {[
                  { method: 'POST', path: '/api/v2/packages', desc: 'Create a new package' },
                  { method: 'GET', path: '/api/v2/packages/:id', desc: 'Get package details' },
                  { method: 'GET', path: '/api/v2/packages', desc: 'List packages with filters' },
                  { method: 'PUT', path: '/api/v2/packages/:id/status', desc: 'Update package status' },
                  { method: 'POST', path: '/api/v2/batches', desc: 'Create bulk shipment batch' },
                  { method: 'GET', path: '/api/v2/lockers/available', desc: 'Check locker availability' },
                  { method: 'POST', path: '/api/v2/lockers/assign', desc: 'Assign package to locker' },
                  { method: 'GET', path: '/api/v2/tracking/:trackingId', desc: 'Track package by ID' },
                  { method: 'GET', path: '/api/v2/invoices', desc: 'List invoices' },
                  { method: 'POST', path: '/api/v2/webhooks', desc: 'Register webhook endpoint' },
                ].map((ep, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                    <span className="px-2 py-0.5 rounded text-xs font-bold font-mono" style={{
                      backgroundColor: ep.method === 'GET' ? `${theme.status.success}20` : ep.method === 'POST' ? `${theme.accent.primary}20` : `${theme.status.warning}20`,
                      color: ep.method === 'GET' ? theme.status.success : ep.method === 'POST' ? theme.accent.primary : theme.status.warning,
                    }}>{ep.method}</span>
                    <code className="text-sm flex-1" style={{ color: theme.text.primary, fontFamily: 'monospace' }}>{ep.path}</code>
                    <span className="text-xs" style={{ color: theme.text.muted }}>{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>Authentication</p>
              <div className="p-3 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                <p className="text-sm" style={{ color: theme.text.secondary }}>Include your API key in the <code className="px-1 py-0.5 rounded text-xs" style={{ backgroundColor: theme.bg.tertiary, fontFamily: 'monospace' }}>Authorization</code> header:</p>
                <code className="block mt-2 text-sm p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary, color: theme.accent.primary, fontFamily: 'monospace' }}>Authorization: Bearer lq_live_xxxxx</code>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button onClick={() => setShowDocsModal(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: theme.text.muted }}>Close</button>
            </div>
          </div>
        </ModalOverlay>
      )}

      {/* Webhook Configuration Modal */}
      {showWebhookModal && (
        <ModalOverlay title="Webhook Configuration" onClose={() => setShowWebhookModal(false)}>
          <form onSubmit={e => { e.preventDefault(); setShowWebhookModal(false); addToast({ type: 'success', message: 'Webhook endpoint saved' }); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={labelStyle}>Webhook URL</label>
              <div className="flex items-center gap-2">
                <Globe size={16} style={{ color: theme.text.muted }} />
                <input required type="url" value={webhookForm.url} onChange={e => setWebhookForm({ ...webhookForm, url: e.target.value })} className="flex-1 px-3 py-2 rounded-xl border text-sm" style={inputStyle} placeholder="https://your-api.com/webhooks/locqar" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={labelStyle}>Events to Subscribe</label>
              <div className="space-y-2">
                {Object.entries(webhookForm.events).map(([event, checked]) => (
                  <label key={event} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer" style={{ backgroundColor: checked ? `${theme.accent.primary}10` : 'transparent' }}>
                    <input type="checkbox" checked={checked} onChange={e => setWebhookForm({ ...webhookForm, events: { ...webhookForm.events, [event]: e.target.checked } })} className="rounded" />
                    <Bell size={14} style={{ color: checked ? theme.accent.primary : theme.text.muted }} />
                    <span className="text-sm" style={{ color: theme.text.primary }}>{event.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between pt-2">
              <button type="button" onClick={() => { if (!webhookForm.url) { addToast({ type: 'warning', message: 'Enter a webhook URL first' }); return; } addToast({ type: 'info', message: 'Test webhook sent to ' + webhookForm.url }); }} className="flex items-center gap-2 text-sm px-3 py-2 rounded-xl" style={{ color: theme.accent.primary, backgroundColor: theme.accent.light }}>
                <Send size={14} /> Send Test
              </button>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowWebhookModal(false)} className="px-4 py-2 rounded-xl text-sm" style={{ color: theme.text.muted }}>Cancel</button>
                <button type="submit" className="btn-primary px-6 py-2 rounded-xl text-sm">Save Webhook</button>
              </div>
            </div>
          </form>
        </ModalOverlay>
      )}
    </div>
  );
};
