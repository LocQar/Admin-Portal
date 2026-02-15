import React from 'react';
import { Plus, FileDown, Package, Truck, Grid3X3, TrendingUp, Receipt, Search, Filter, Download, Eye, Bell, Printer, Info, Building2, CheckCircle2, Clock, Send, AlertTriangle, CreditCard, Key, Command, RefreshCw, Phone, MessageSquare, Ticket, ChevronDown, ChevronRight, FileText, Cog } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard, QuickAction } from '../components/ui';
import { StatusBadge } from '../components/ui/Badge';
import { TIERS, portalShipmentsData, portalShipmentTrend, bulkShipmentsData, portalRateCard, terminalsData, getTerminalAddress, getLockerAddress, portalTerminalAvailability, portalInvoicesData, apiKeysData, portalWebhookLogsData } from '../constants/mockData';

export const PartnerPortalPage = ({
  activeSubMenu,
  setActiveSubMenu,
  loading,
  setShowExport,
  addToast,
}) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-6">
      {/* Portal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: TIERS.gold.bg }}>🟡</div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2" style={{ color: theme.text.primary }}>
              Jumia Ghana <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: TIERS.gold.bg, color: TIERS.gold.color }}>Gold Partner</span>
            </h1>
            <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Portal Home'} • Partner Self-Service Portal</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => addToast({ type: 'info', message: 'Opening API docs' })} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><FileText size={16} />API Docs</button>
          <button onClick={() => addToast({ type: 'info', message: 'Opening support chat' })} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><MessageSquare size={16} />Support</button>
          <button onClick={() => { setActiveSubMenu('Ship Now'); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}><Plus size={18} />Ship Now</button>
        </div>
      </div>

      {/* Portal Home */}
      {(!activeSubMenu || activeSubMenu === 'Portal Home') && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MetricCard title="This Month" value="130" change="8.3%" changeType="up" icon={Package} subtitle="packages shipped" theme={theme} loading={loading} />
            <MetricCard title="In Transit" value={portalShipmentsData.filter(p => p.status.includes('transit') || p.status === 'at_warehouse' || p.status === 'pending').length} icon={Truck} theme={theme} loading={loading} />
            <MetricCard title="In Lockers" value={portalShipmentsData.filter(p => p.status === 'delivered_to_locker').length} icon={Grid3X3} subtitle="awaiting pickup" theme={theme} loading={loading} />
            <MetricCard title="Delivery Rate" value="96.2%" change="1.4%" changeType="up" icon={TrendingUp} theme={theme} loading={loading} />
            <MetricCard title="Pending Invoice" value="GH₵ 17.5K" icon={Receipt} subtitle="Due Feb 15" theme={theme} loading={loading} />
          </div>

          {/* Alerts */}
          {portalShipmentsData.some(p => p.status === 'expired' || p.daysInLocker >= 3) && (
            <div className="p-4 rounded-2xl" style={{ backgroundColor: 'rgba(212,170,90,0.05)', border: '1px solid rgba(212,170,90,0.2)' }}>
              <p className="text-sm font-semibold mb-2" style={{ color: '#D4AA5A' }}>⚠️ Attention Required</p>
              <div className="flex flex-wrap gap-2">
                {portalShipmentsData.filter(p => p.status === 'expired').length > 0 && (
                  <span className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: 'rgba(212,142,138,0.1)', color: '#D48E8A' }}>🔴 {portalShipmentsData.filter(p => p.status === 'expired').length} expired package(s) — will be returned</span>
                )}
                {portalShipmentsData.filter(p => p.daysInLocker >= 3 && p.status === 'delivered_to_locker').length > 0 && (
                  <span className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: 'rgba(212,170,90,0.1)', color: '#D4AA5A' }}>🟡 {portalShipmentsData.filter(p => p.daysInLocker >= 3 && p.status === 'delivered_to_locker').length} package(s) nearing expiry (3+ days)</span>
                )}
              </div>
            </div>
          )}

          {/* Shipment Trend + Status Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold" style={{ color: theme.text.primary }}>Shipment Trend</h3>
                <div className="flex gap-3">{[{ l: 'Shipped', c: theme.chart.blue }, { l: 'Delivered', c: theme.chart.green }, { l: 'Returned', c: theme.chart.coral }].map(i => (<span key={i.l} className="flex items-center gap-1 text-xs" style={{ color: theme.text.muted }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: i.c }} />{i.l}</span>))}</div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={portalShipmentTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                  <Area type="monotone" dataKey="shipped" name="Shipped" stroke={theme.chart.blue} fill={theme.chart.blue + '20'} strokeWidth={2} />
                  <Area type="monotone" dataKey="delivered" name="Delivered" stroke={theme.chart.green} fill="transparent" strokeWidth={2} />
                  <Area type="monotone" dataKey="returned" name="Returned" stroke={theme.chart.coral} fill="transparent" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Current Status</h3>
              <div className="space-y-3">
                {[
                  { label: 'In Locker', count: portalShipmentsData.filter(p => p.status === 'delivered_to_locker').length, color: '#81C995' },
                  { label: 'In Transit', count: portalShipmentsData.filter(p => p.status.includes('transit')).length, color: '#7EA8C9' },
                  { label: 'At Warehouse', count: portalShipmentsData.filter(p => p.status === 'at_warehouse').length, color: '#6366f1' },
                  { label: 'Pending', count: portalShipmentsData.filter(p => p.status === 'pending').length, color: '#D4AA5A' },
                  { label: 'Picked Up', count: portalShipmentsData.filter(p => p.status === 'picked_up').length, color: '#78716C' },
                  { label: 'Expired', count: portalShipmentsData.filter(p => p.status === 'expired').length, color: '#D48E8A' },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm" style={{ color: theme.text.secondary }}><span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />{s.label}</span>
                    <span className="font-bold text-lg" style={{ color: s.color }}>{s.count}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: theme.text.muted }}>Total Active</span>
                  <span className="font-bold" style={{ color: theme.text.primary }}>{portalShipmentsData.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: theme.text.muted }}>Quick Actions</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              <QuickAction icon={Plus} label="Ship Package" theme={theme} onClick={() => setActiveSubMenu('Ship Now')} />
              <QuickAction icon={FileDown} label="Bulk Upload" theme={theme} onClick={() => setActiveSubMenu('Ship Now')} badge="CSV" />
              <QuickAction icon={Search} label="Track" theme={theme} onClick={() => setActiveSubMenu('Track Packages')} />
              <QuickAction icon={Grid3X3} label="Locker Map" theme={theme} onClick={() => setActiveSubMenu('Locker Map')} />
              <QuickAction icon={Receipt} label="Invoices" theme={theme} onClick={() => setActiveSubMenu('My Billing')} />
              <QuickAction icon={Command} label="API Console" theme={theme} onClick={() => setActiveSubMenu('API Console')} />
            </div>
          </div>

          {/* Recent Shipments */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Recent Shipments</h3>
              <button onClick={() => setActiveSubMenu('Track Packages')} className="text-sm" style={{ color: theme.accent.primary }}>View All →</button>
            </div>
            <table className="w-full">
              <thead><tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Order ID</th>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Destination</th>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Locker</th>
              </tr></thead>
              <tbody>
                {portalShipmentsData.slice(0, 5).map(s => (
                  <tr key={s.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <td className="p-3"><span className="font-mono text-sm" style={{ color: theme.text.primary }}>{s.id}</span><br/><span className="text-xs" style={{ color: theme.text.muted }}>{s.waybill}</span></td>
                    <td className="p-3"><span className="text-sm" style={{ color: theme.text.primary }}>{s.customer}</span></td>
                    <td className="p-3 hidden md:table-cell">
                      <p className="text-sm" style={{ color: theme.text.primary }}>{s.destination}</p>
                      {s.locker !== '-' && (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Grid3X3 size={12} style={{ color: theme.accent.primary }} />
                          <span className="text-xs font-mono font-medium" style={{ color: theme.accent.primary }}>{s.locker}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-3"><StatusBadge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Account Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h4 className="text-sm font-semibold mb-3" style={{ color: theme.text.muted }}>Account Details</h4>
              <div className="space-y-2 text-sm">{[['Partner ID', 'PTR-001'], ['Tier', 'Gold'], ['SLA', '24 hours'], ['Contract', 'Until Dec 2025'], ['Account Manager', 'Akua Mansa']].map(([l, v]) => (
                <div key={l} className="flex justify-between"><span style={{ color: theme.text.muted }}>{l}</span><span className="font-medium" style={{ color: theme.text.primary }}>{v}</span></div>
              ))}</div>
            </div>
            <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h4 className="text-sm font-semibold mb-3" style={{ color: theme.text.muted }}>API Usage Today</h4>
              <div className="mb-3">
                <div className="flex justify-between mb-1"><span className="text-sm" style={{ color: theme.text.muted }}>Calls</span><span className="text-sm font-mono" style={{ color: theme.text.primary }}>342 / 1,000</span></div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}><div className="h-full rounded-full" style={{ width: '34.2%', backgroundColor: '#7EA8C9' }} /></div>
              </div>
              <div className="space-y-2 text-sm">{[['Rate Limit', '1,000/day'], ['Last Call', '2 min ago'], ['Avg Response', '120ms'], ['Error Rate', '0.2%']].map(([l, v]) => (
                <div key={l} className="flex justify-between"><span style={{ color: theme.text.muted }}>{l}</span><span className="font-medium" style={{ color: theme.text.primary }}>{v}</span></div>
              ))}</div>
            </div>
            <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h4 className="text-sm font-semibold mb-3" style={{ color: theme.text.muted }}>This Month's Summary</h4>
              <div className="space-y-2 text-sm">{[['Packages Shipped', '130'], ['Delivered', '125 (96.2%)'], ['Returns', '5 (3.8%)'], ['Avg Pickup Time', '18 hrs'], ['Revenue', 'GH₵ 15,600']].map(([l, v]) => (
                <div key={l} className="flex justify-between"><span style={{ color: theme.text.muted }}>{l}</span><span className="font-medium" style={{ color: theme.text.primary }}>{v}</span></div>
              ))}</div>
            </div>
          </div>
        </div>
      )}

      {/* ========== SHIP NOW ========== */}
      {activeSubMenu === 'Ship Now' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Single Shipment Form */}
            <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h3 className="font-semibold mb-1 flex items-center gap-2" style={{ color: theme.text.primary }}><Package size={20} style={{ color: theme.accent.primary}} />Single Shipment</h3>
              <p className="text-sm mb-6" style={{ color: theme.text.muted }}>Create a new package for locker delivery</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Order ID *</label><input placeholder="e.g. JUM-2024-0461" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
                  <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Package Size *</label>
                    <select className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                      <option value="">Select size</option>{portalRateCard.map(r => <option key={r.size} value={r.size}>{r.size} ({r.dimensions}) — GH₵ {r.pricePerDay}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Customer Name *</label><input placeholder="Full name" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
                  <div>
                    <label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Phone Number (Address) *</label>
                    <input placeholder="+233..." className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} />
                    <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Phone resolves to pinned locker address</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Destination Terminal *</label>
                    <select className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                      <option value="">Select terminal</option>{terminalsData.filter(t => t.status === 'online').map(t => <option key={t.id} value={t.id}>{t.name} — {getTerminalAddress(t)}</option>)}</select>
                    <p className="text-xs mt-1 font-mono" style={{ color: theme.accent.primary }}>Address auto-fills from pinned phone</p>
                  </div>
                  <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Package Value (GH₵)</label><input type="number" placeholder="0.00" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Weight (kg)</label><input type="number" placeholder="0.0" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
                  <div className="flex items-end gap-3">
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-orange-500" /><span className="text-sm" style={{ color: theme.text.secondary }}>Cash on Delivery</span></label>
                    <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-orange-500" /><span className="text-sm" style={{ color: theme.text.secondary }}>Fragile</span></label>
                  </div>
                </div>
                <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Notes</label><textarea rows={2} placeholder="Special instructions..." className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent resize-none" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => addToast({ type: 'success', message: 'Shipment created! Waybill: LQ-2024-01211' })} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}><Send size={16} />Create Shipment</button>
                  <button onClick={() => addToast({ type: 'info', message: 'Generating label...' })} className="px-6 py-3 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Printer size={16} className="inline mr-2" />Print Label</button>
                </div>
              </div>
            </div>

            {/* Bulk Upload */}
            <div className="space-y-6">
              <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <h3 className="font-semibold mb-1 flex items-center gap-2" style={{ color: theme.text.primary }}><FileDown size={20} style={{ color: '#B5A0D1' }} />Bulk Upload</h3>
                <p className="text-sm mb-6" style={{ color: theme.text.muted }}>Upload a CSV file to create multiple shipments at once</p>
                <div className="border-2 border-dashed rounded-2xl p-8 text-center" style={{ borderColor: theme.border.secondary }}>
                  <FileDown size={40} style={{ color: theme.icon.muted }} className="mx-auto mb-3" />
                  <p className="font-medium mb-1" style={{ color: theme.text.primary }}>Drop CSV file here or click to browse</p>
                  <p className="text-sm mb-4" style={{ color: theme.text.muted }}>Max 500 packages per upload • CSV or XLSX format</p>
                  <button onClick={() => addToast({ type: 'info', message: 'File browser opened' })} className="px-6 py-2.5 rounded-xl text-sm" style={{ backgroundColor: '#B5A0D1', color: '#1C1917' }}>Choose File</button>
                </div>
                <div className="flex items-center gap-4 mt-4">
                  <button onClick={() => addToast({ type: 'info', message: 'Downloading template...' })} className="text-sm flex items-center gap-1" style={{ color: theme.accent.primary }}><Download size={14} />Download CSV Template</button>
                  <button onClick={() => addToast({ type: 'info', message: 'Opening field mapping guide' })} className="text-sm flex items-center gap-1" style={{ color: '#7EA8C9' }}><Info size={14} />Field Guide</button>
                </div>
              </div>

              {/* Rate Card */}
              <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}><CreditCard size={20} style={{ color: '#D4AA5A' }} />Your Rate Card</h3>
                <table className="w-full">
                  <thead><tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <th className="text-left p-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Size</th>
                    <th className="text-left p-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Dimensions</th>
                    <th className="text-left p-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Max Wt.</th>
                    <th className="text-left p-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Price</th>
                    <th className="text-left p-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Free Storage</th>
                  </tr></thead>
                  <tbody>{portalRateCard.map(r => (
                    <tr key={r.size} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                      <td className="p-2 font-medium" style={{ color: theme.text.primary }}>{r.size}</td>
                      <td className="p-2 text-sm" style={{ color: theme.text.secondary }}>{r.dimensions}</td>
                      <td className="p-2 text-sm" style={{ color: theme.text.secondary }}>{r.maxWeight}</td>
                      <td className="p-2 font-bold" style={{ color: theme.accent.primary }}>GH₵ {r.pricePerDay}</td>
                      <td className="p-2 text-sm" style={{ color: theme.text.muted }}>{r.storageFree} days (then ₵{r.storagePerDay}/day)</td>
                    </tr>
                  ))}</tbody>
                </table>
                <p className="text-xs mt-3" style={{ color: theme.text.muted }}>* Gold tier pricing. 15% discount on volumes over 100/month.</p>
              </div>
            </div>
          </div>

          {/* Active Batches */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}><h3 className="font-semibold" style={{ color: theme.text.primary }}>Active Batches</h3></div>
            <table className="w-full"><thead><tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Batch</th>
              <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Terminal</th>
              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Progress</th>
              <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>ETA</th>
            </tr></thead><tbody>
              {bulkShipmentsData.filter(b => b.partner === 'Jumia Ghana').map(b => (
                <tr key={b.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <td className="p-3"><span className="font-mono font-bold" style={{ color: theme.text.primary }}>{b.id}</span><br/><span className="text-xs" style={{ color: theme.text.muted }}>{b.packages} packages</span></td>
                  <td className="p-3 hidden md:table-cell" style={{ color: theme.text.secondary }}>{b.terminal}</td>
                  <td className="p-3"><StatusBadge status={b.status} /></td>
                  <td className="p-3"><div className="flex items-center gap-2"><div className="w-20 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}><div className="h-full rounded-full" style={{ width: `${(b.delivered / b.packages) * 100}%`, backgroundColor: '#81C995' }} /></div><span className="text-xs font-mono" style={{ color: theme.text.secondary }}>{b.delivered}/{b.packages}</span></div></td>
                  <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{b.eta}</span></td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </div>
      )}

      {/* ========== TRACK PACKAGES ========== */}
      {activeSubMenu === 'Track Packages' && (
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
              <Search size={18} style={{ color: theme.icon.muted }} />
              <input placeholder="Search by Order ID, Waybill, Phone, or Locker Address..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: theme.text.primary }} />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Filter size={16} />Filters</button>
            <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={16} />Export</button>
          </div>

          {/* Status Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {[['all', 'All', portalShipmentsData.length], ['delivered_to_locker', 'In Locker', portalShipmentsData.filter(p => p.status === 'delivered_to_locker').length], ['in_transit_to_locker', 'In Transit', portalShipmentsData.filter(p => p.status.includes('transit')).length], ['pending', 'Pending', portalShipmentsData.filter(p => p.status === 'pending' || p.status === 'at_warehouse').length], ['picked_up', 'Picked Up', portalShipmentsData.filter(p => p.status === 'picked_up').length], ['expired', 'Expired', portalShipmentsData.filter(p => p.status === 'expired').length]].map(([k, l, c]) => (
              <button key={k} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: k === 'all' ? theme.accent.light : 'transparent', color: k === 'all' ? theme.accent.primary : theme.text.muted, border: k === 'all' ? `1px solid ${theme.accent.border}` : '1px solid transparent' }}>{l} <span className="ml-1 font-mono">({c})</span></button>
            ))}
          </div>

          {/* Full Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="overflow-x-auto"><table className="w-full">
              <thead><tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Order / Waybill</th>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Destination</th>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Locker</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Pickup Code</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Age</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Value</th>
                <th className="text-right p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
              </tr></thead>
              <tbody>{portalShipmentsData.map(s => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${theme.border.primary}`, backgroundColor: s.status === 'expired' ? 'rgba(212,142,138,0.03)' : s.daysInLocker >= 3 && s.status === 'delivered_to_locker' ? 'rgba(212,170,90,0.03)' : 'transparent' }}>
                  <td className="p-3"><span className="font-mono font-medium text-sm" style={{ color: theme.text.primary }}>{s.id}</span><br/><span className="text-xs font-mono" style={{ color: theme.text.muted }}>{s.waybill}</span></td>
                  <td className="p-3"><span className="text-sm" style={{ color: theme.text.primary }}>{s.customer}</span><br/><span className="text-xs" style={{ color: theme.text.muted }}>{s.phone}</span></td>
                  <td className="p-3 hidden md:table-cell">
                    <p className="text-sm" style={{ color: theme.text.primary }}>{s.destination}</p>
                    {s.locker !== '-' && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Grid3X3 size={12} style={{ color: theme.accent.primary }} />
                        <span className="text-xs font-mono font-medium" style={{ color: theme.accent.primary }}>{s.locker}</span>
                        {(() => { const t = terminalsData.find(t => t.name === s.destination); return t ? <span className="text-xs font-mono" style={{ color: theme.text.muted }}>({getLockerAddress(s.locker, s.destination)})</span> : null; })()}
                      </div>
                    )}
                    {s.locker === '-' && (() => { const t = terminalsData.find(t => t.name === s.destination); return t ? <p className="text-xs font-mono mt-0.5" style={{ color: theme.text.muted }}>{getTerminalAddress(t)}</p> : null; })()}
                  </td>
                  <td className="p-3"><StatusBadge status={s.status} /></td>
                  <td className="p-3 hidden lg:table-cell">{s.pickupCode ? <span className="font-mono font-bold tracking-wider" style={{ color: '#81C995' }}>{s.pickupCode}</span> : '—'}</td>
                  <td className="p-3 hidden lg:table-cell">{s.daysInLocker > 0 ? <span className={`text-sm font-medium ${s.daysInLocker >= 5 ? 'text-red-500' : s.daysInLocker >= 3 ? 'text-amber-500' : ''}`} style={{ color: s.daysInLocker < 3 ? theme.text.secondary : undefined }}>{s.daysInLocker}d</span> : '—'}</td>
                  <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.primary }}>GH₵ {s.value}</span></td>
                  <td className="p-3 text-right">
                    <button onClick={() => addToast({ type: 'info', message: `Tracking ${s.waybill}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Eye size={14} /></button>
                    {s.status === 'delivered_to_locker' && <button onClick={() => addToast({ type: 'info', message: `Sending reminder to ${s.customer}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: '#D4AA5A' }}><Bell size={14} /></button>}
                    <button onClick={() => addToast({ type: 'info', message: 'Printing label...' })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Printer size={14} /></button>
                  </td>
                </tr>
              ))}</tbody>
            </table></div>
          </div>
        </div>
      )}

      {/* ========== LOCKER MAP ========== */}
      {activeSubMenu === 'Locker Map' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl" style={{ backgroundColor: 'rgba(126,168,201,0.05)', border: '1px solid rgba(126,168,201,0.2)' }}>
            <div className="flex items-center gap-2"><Info size={18} style={{ color: '#7EA8C9' }} /><p className="text-sm" style={{ color: '#7EA8C9' }}>Real-time locker availability across all terminals. Data refreshes every 5 minutes.</p></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {portalTerminalAvailability.map(t => {
              const utilizationPct = Math.round(((t.totalLockers - t.available) / t.totalLockers) * 100);
              const utilizationColor = utilizationPct > 85 ? '#D48E8A' : utilizationPct > 60 ? '#D4AA5A' : '#81C995';
              return (
                <div key={t.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3"><Building2 size={20} style={{ color: theme.accent.primary }} /><div><p className="font-semibold" style={{ color: theme.text.primary }}>{t.name}</p><p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{getTerminalAddress(t)}</p><p className="text-xs" style={{ color: theme.text.muted }}>{t.location}</p></div></div>
                      <StatusBadge status={t.status} />
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between mb-1"><span className="text-xs" style={{ color: theme.text.muted }}>Utilization</span><span className="text-sm font-bold" style={{ color: utilizationColor }}>{utilizationPct}%</span></div>
                      <div className="w-full h-3 rounded-full" style={{ backgroundColor: theme.border.primary }}><div className="h-full rounded-full transition-all" style={{ width: `${utilizationPct}%`, backgroundColor: utilizationColor }} /></div>
                      <div className="flex justify-between mt-1 text-xs" style={{ color: theme.text.muted }}><span>{t.available} available</span><span>{t.totalLockers} total</span></div>
                    </div>
                    <div className="space-y-2">
                      {[{ label: 'Small', ...t.small, color: '#81C995' }, { label: 'Medium', ...t.medium, color: '#7EA8C9' }, { label: 'Large', ...t.large, color: '#B5A0D1' }, { label: 'XLarge', ...t.xlarge, color: '#D4AA5A' }].map(s => (
                        <div key={s.label} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                          <span className="text-sm flex items-center gap-2" style={{ color: theme.text.secondary }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />{s.label}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: theme.border.primary }}><div className="h-full rounded-full" style={{ width: `${s.total > 0 ? ((s.total - s.available) / s.total) * 100 : 0}%`, backgroundColor: s.color }} /></div>
                            <span className="font-mono text-sm w-12 text-right" style={{ color: s.available > 0 ? '#81C995' : '#D48E8A' }}>{s.available}/{s.total}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="border-t p-3" style={{ borderColor: theme.border.primary }}>
                    <button onClick={() => addToast({ type: 'info', message: `Reserving locker at ${t.name}` })} className="w-full py-2 rounded-xl text-sm" style={{ backgroundColor: t.available > 0 ? theme.accent.light : 'transparent', color: t.available > 0 ? theme.accent.primary : theme.text.muted, border: `1px solid ${t.available > 0 ? theme.accent.border : theme.border.primary}` }} disabled={t.available === 0}>{t.available > 0 ? 'Reserve Locker' : 'No Lockers Available'}</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========== MY BILLING ========== */}
      {activeSubMenu === 'My Billing' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Outstanding" value={`GH₵ ${portalInvoicesData.filter(i => i.status === 'pending').reduce((s, i) => s + i.total, 0).toLocaleString()}`} icon={Receipt} theme={theme} loading={loading} subtitle="1 pending invoice" />
            <MetricCard title="Paid (YTD)" value={`GH₵ ${portalInvoicesData.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0).toLocaleString()}`} icon={CheckCircle2} theme={theme} loading={loading} />
            <MetricCard title="Total Packages" value={portalInvoicesData.reduce((s, i) => s + i.packages, 0)} icon={Package} theme={theme} loading={loading} subtitle="Last 4 months" />
            <MetricCard title="Avg Monthly" value={`GH₵ ${Math.round(portalInvoicesData.reduce((s, i) => s + i.total, 0) / portalInvoicesData.length).toLocaleString()}`} icon={TrendingUp} theme={theme} loading={loading} />
          </div>

          {/* Pending Invoice Alert */}
          {portalInvoicesData.some(i => i.status === 'pending') && (
            <div className="p-5 rounded-2xl flex flex-col md:flex-row md:items-center gap-4" style={{ backgroundColor: 'rgba(212,170,90,0.05)', border: '1px solid rgba(212,170,90,0.2)' }}>
              <div className="flex items-center gap-3 flex-1"><AlertTriangle size={24} style={{ color: '#D4AA5A' }} /><div><p className="font-semibold" style={{ color: '#D4AA5A' }}>Invoice Due</p><p className="text-sm" style={{ color: theme.text.muted }}>{portalInvoicesData.find(i => i.status === 'pending')?.id} — GH₵ {portalInvoicesData.find(i => i.status === 'pending')?.total.toLocaleString()} due by {portalInvoicesData.find(i => i.status === 'pending')?.dueDate}</p></div></div>
              <div className="flex gap-2">
                <button onClick={() => addToast({ type: 'info', message: 'Opening payment portal...' })} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: '#D4AA5A', color: '#1C1917' }}>Pay Now</button>
                <button onClick={() => addToast({ type: 'info', message: 'Downloading invoice PDF...' })} className="px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={14} className="inline mr-1" />Download</button>
              </div>
            </div>
          )}

          {/* Invoices Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}><h3 className="font-semibold" style={{ color: theme.text.primary }}>Invoice History</h3></div>
            <table className="w-full"><thead><tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Invoice</th>
              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Period</th>
              <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Packages</th>
              <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Subtotal</th>
              <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Tax</th>
              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Total</th>
              <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Due Date</th>
              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
              <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
            </tr></thead><tbody>
              {portalInvoicesData.map(inv => (
                <tr key={inv.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <td className="p-4"><span className="font-mono font-medium" style={{ color: theme.text.primary }}>{inv.id}</span></td>
                  <td className="p-4"><span style={{ color: theme.text.primary }}>{inv.period}</span></td>
                  <td className="p-4 hidden md:table-cell"><span style={{ color: theme.text.secondary }}>{inv.packages}</span></td>
                  <td className="p-4 hidden md:table-cell"><span style={{ color: theme.text.secondary }}>GH₵ {inv.amount.toLocaleString()}</span></td>
                  <td className="p-4 hidden lg:table-cell"><span style={{ color: theme.text.muted }}>GH₵ {inv.tax.toLocaleString()}</span></td>
                  <td className="p-4"><span className="font-bold" style={{ color: theme.text.primary }}>GH₵ {inv.total.toLocaleString()}</span></td>
                  <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{inv.dueDate}</span></td>
                  <td className="p-4"><StatusBadge status={inv.status} /></td>
                  <td className="p-4 text-right">
                    <button onClick={() => addToast({ type: 'info', message: `Downloading ${inv.id}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Download size={14} /></button>
                    <button onClick={() => addToast({ type: 'info', message: `Viewing ${inv.id}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Eye size={14} /></button>
                    {inv.status === 'pending' && <button onClick={() => addToast({ type: 'info', message: 'Opening payment...' })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: '#D4AA5A' }}><CreditCard size={14} /></button>}
                  </td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </div>
      )}

      {/* ========== API CONSOLE ========== */}
      {activeSubMenu === 'API Console' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="API Calls Today" value="342" icon={TrendingUp} theme={theme} loading={loading} subtitle="of 1,000 limit" />
            <MetricCard title="Avg Response" value="120ms" icon={Clock} theme={theme} loading={loading} />
            <MetricCard title="Success Rate" value="99.8%" icon={CheckCircle2} theme={theme} loading={loading} />
            <MetricCard title="Webhook Events" value="48" icon={Send} theme={theme} loading={loading} subtitle="today" />
          </div>

          {/* API Key */}
          <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}><Key size={20} style={{ color: '#D4AA5A' }} />Your API Keys</h3>
            <div className="space-y-3">
              {apiKeysData.filter(k => k.partner === 'Jumia Ghana').map(k => (
                <div key={k.id} className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                  <div className="flex-1">
                    <div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: k.env === 'production' ? 'rgba(129,201,149,0.1)' : 'rgba(212,170,90,0.1)', color: k.env === 'production' ? '#81C995' : '#D4AA5A' }}>{k.env}</span><StatusBadge status={k.status === 'revoked' ? 'expired' : k.status} /></div>
                    <code className="text-sm mt-1 block font-mono" style={{ color: theme.text.primary }}>{k.key}</code>
                    <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Created: {k.created} • Last used: {k.lastUsed} • Calls today: {k.callsToday}/{k.rateLimit}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => addToast({ type: 'success', message: 'Key copied to clipboard' })} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(126,168,201,0.1)', color: '#7EA8C9' }}>Copy Key</button>
                    <button onClick={() => addToast({ type: 'warning', message: 'Are you sure? This will invalidate the current key.' })} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(212,170,90,0.1)', color: '#D4AA5A' }}>Regenerate</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* API Playground */}
          <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}><Command size={20} style={{ color: '#B5A0D1' }} />API Playground</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Endpoint</label>
                <select className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                  <option>POST /v2/packages — Create Package</option>
                  <option>GET /v2/packages/:id — Get Package</option>
                  <option>GET /v2/packages/:id/track — Track Package</option>
                  <option>POST /v2/batches — Create Batch</option>
                  <option>GET /v2/terminals — List Terminals</option>
                  <option>GET /v2/terminals/:id/availability — Locker Availability</option>
                  <option>GET /v2/invoices — List Invoices</option>
                </select>
                <label className="text-xs font-semibold uppercase block mt-4 mb-2" style={{ color: theme.text.muted }}>Request Body</label>
                <pre className="p-4 rounded-xl text-sm overflow-x-auto" style={{ backgroundColor: theme.bg.primary, color: '#81C995', fontFamily: theme.font.mono, border: `1px solid ${theme.border.primary}` }}>{`{
  "order_id": "JUM-2024-0461",
  "customer_name": "Kwame Mensah",
  "customer_phone": "+233551234567",
  "terminal_id": "TRM-001",
  "size": "medium",
  "value": 120.00,
  "cod": false,
  "notify": true
}`}</pre>
                <button onClick={() => addToast({ type: 'success', message: 'API call successful! Status: 201 Created' })} className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm" style={{ backgroundColor: '#B5A0D1', color: '#1C1917' }}><Send size={16} />Send Request</button>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Response</label>
                <pre className="p-4 rounded-xl text-sm overflow-x-auto h-full min-h-[280px]" style={{ backgroundColor: theme.bg.primary, color: '#7EA8C9', fontFamily: theme.font.mono, border: `1px solid ${theme.border.primary}` }}>{`// 201 Created — 120ms
{
  "success": true,
  "data": {
    "waybill": "LQ-2024-01211",
    "order_id": "JUM-2024-0461",
    "status": "pending",
    "terminal": "Achimota Mall",
    "estimated_delivery": "2024-01-15T16:00:00Z",
    "tracking_url": "https://track.locqar.com/LQ-2024-01211",
    "label_url": "https://api.locqar.com/v2/labels/LQ-2024-01211.pdf"
  }
}`}</pre>
              </div>
            </div>
          </div>

          {/* Webhook Logs */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <h3 className="font-semibold flex items-center gap-2" style={{ color: theme.text.primary }}><Send size={18} />Webhook Delivery Log</h3>
              <div className="flex gap-2">
                <button onClick={() => addToast({ type: 'info', message: 'Opening webhook settings' })} className="px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Cog size={12} className="inline mr-1" />Configure</button>
                <button onClick={() => addToast({ type: 'info', message: 'Testing webhook endpoint...' })} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: 'rgba(129,201,149,0.1)', color: '#81C995' }}>Test Webhook</button>
              </div>
            </div>
            <table className="w-full"><thead><tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Event</th>
              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
              <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Response</th>
              <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Time</th>
              <th className="text-left p-3 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Timestamp</th>
              <th className="text-right p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
            </tr></thead><tbody>
              {portalWebhookLogsData.map(w => (
                <tr key={w.id} style={{ borderBottom: `1px solid ${theme.border.primary}`, backgroundColor: w.status !== 200 ? 'rgba(212,142,138,0.03)' : 'transparent' }}>
                  <td className="p-3"><span className="font-mono text-sm" style={{ color: theme.text.primary }}>{w.event}</span></td>
                  <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-mono ${w.status === 200 ? 'text-emerald-500' : 'text-red-500'}`} style={{ backgroundColor: w.status === 200 ? 'rgba(129,201,149,0.1)' : 'rgba(212,142,138,0.1)' }}>{w.status}</span>{w.error && <span className="text-xs text-red-500 ml-1">{w.error}</span>}</td>
                  <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{w.responseTime}</span></td>
                  <td className="p-3 hidden md:table-cell"><span className="text-xs font-mono" style={{ color: theme.text.muted }}>{w.timestamp.split(' ')[1]}</span></td>
                  <td className="p-3 hidden lg:table-cell"><span className="text-xs" style={{ color: theme.text.muted }}>{w.timestamp}</span></td>
                  <td className="p-3 text-right">
                    <button onClick={() => addToast({ type: 'info', message: `Payload: ${w.payload}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Eye size={14} /></button>
                    {w.status !== 200 && <button onClick={() => addToast({ type: 'info', message: 'Retrying webhook...' })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: '#D4AA5A' }}><RefreshCw size={14} /></button>}
                  </td>
                </tr>
              ))}
            </tbody></table>
          </div>
        </div>
      )}

      {/* ========== HELP CENTER ========== */}
      {activeSubMenu === 'Help Center' && (
        <div className="space-y-6 max-w-4xl">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[{ icon: Phone, label: 'Call Support', desc: '+233 55 139 9333', action: 'Call Now', color: '#7EA8C9' }, { icon: MessageSquare, label: 'WhatsApp', desc: 'Chat with support team', action: 'Open Chat', color: '#25D366' }, { icon: Send, label: 'Email', desc: 'partners@locqar.com', action: 'Send Email', color: theme.accent.primary }].map(c => (
              <div key={c.label} className="p-5 rounded-2xl border text-center" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${c.color}15` }}><c.icon size={24} style={{ color: c.color }} /></div>
                <p className="font-semibold" style={{ color: theme.text.primary }}>{c.label}</p>
                <p className="text-sm mt-1 mb-4" style={{ color: theme.text.muted }}>{c.desc}</p>
                <button onClick={() => addToast({ type: 'info', message: c.action })} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: c.color, color: '#1C1917' }}>{c.action}</button>
              </div>
            ))}
          </div>

          {/* Submit Ticket */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}><Ticket size={20} style={{ color: theme.accent.primary }} />Submit a Support Ticket</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Category</label>
                  <select className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                    <option>Delivery Issue</option><option>Billing / Invoice</option><option>API / Technical</option><option>Locker Problem</option><option>Account</option><option>Other</option></select></div>
                <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Priority</label>
                  <select className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></div>
              </div>
              <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Subject</label><input placeholder="Brief description of the issue" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
              <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Related Package (optional)</label><input placeholder="Waybill or Order ID" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
              <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Description</label><textarea rows={4} placeholder="Describe the issue in detail..." className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent resize-none" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
              <button onClick={() => addToast({ type: 'success', message: 'Ticket submitted! ID: TKT-004. Our team will respond within 4 hours.' })} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}><Send size={16} />Submit Ticket</button>
            </div>
          </div>

          {/* FAQ */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Frequently Asked Questions</h3>
            <div className="space-y-3">
              {[
                { q: 'How long are packages stored in lockers?', a: 'Packages are stored for 5 days free. After that, storage fees apply per your rate card. After 7 days, packages are returned.' },
                { q: 'How do I set up webhooks?', a: 'Go to API Console → Configure Webhooks. Add your endpoint URL and select the events you want to receive. We support package.created, package.in_transit, package.delivered, package.picked_up, and package.expired events.' },
                { q: 'What happens to expired packages?', a: 'Expired packages are queued for return to your warehouse. You can arrange collection or we can dispatch them. A return fee of GH₵ 5 per package applies.' },
                { q: 'Can I reserve specific lockers?', a: 'Yes! Use the Locker Map to reserve lockers at specific terminals. Reservations last 24 hours. You can also reserve via API using POST /v2/lockers/reserve.' },
                { q: 'How do I upgrade my tier?', a: 'Tier upgrades are based on monthly volume. Silver: 50+ packages/month, Gold: 100+ packages/month. Contact your account manager for custom plans.' },
                { q: 'What payment methods do you accept?', a: 'We accept bank transfer, Mobile Money (MTN, Telecel, AirtelTigo), and direct debit. Payment terms are Net-15 for Gold tier partners.' },
              ].map((faq, i) => (
                <details key={i} className="group rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
                  <summary className="flex items-center justify-between p-4 cursor-pointer" style={{ backgroundColor: theme.bg.tertiary }}>
                    <span className="font-medium text-sm" style={{ color: theme.text.primary }}>{faq.q}</span>
                    <ChevronDown size={16} style={{ color: theme.icon.muted }} className="group-open:rotate-180 transition-transform" />
                  </summary>
                  <div className="p-4 text-sm" style={{ color: theme.text.secondary }}>{faq.a}</div>
                </details>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Resources & Documentation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[{ icon: FileText, label: 'API Documentation', desc: 'Complete REST API reference', color: '#7EA8C9' }, { icon: FileDown, label: 'CSV Template', desc: 'Bulk upload spreadsheet template', color: '#81C995' }, { icon: Cog, label: 'Webhook Guide', desc: 'Set up real-time event notifications', color: '#B5A0D1' }, { icon: CreditCard, label: 'Billing FAQ', desc: 'Payment methods, invoicing, refunds', color: '#D4AA5A' }].map(r => (
                <button key={r.label} onClick={() => addToast({ type: 'info', message: `Opening ${r.label}` })} className="flex items-center gap-4 p-4 rounded-xl border text-left hover:bg-white/5" style={{ borderColor: theme.border.primary }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${r.color}15` }}><r.icon size={20} style={{ color: r.color }} /></div>
                  <div><p className="font-medium text-sm" style={{ color: theme.text.primary }}>{r.label}</p><p className="text-xs" style={{ color: theme.text.muted }}>{r.desc}</p></div>
                  <ChevronRight size={16} style={{ color: theme.icon.muted }} className="ml-auto" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
