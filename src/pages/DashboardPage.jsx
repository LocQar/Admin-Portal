import React, { useMemo, useState } from "react";
import {
  Download, RefreshCw, Package, Grid3X3, Truck, Clock, DollarSign,
  Scan, Plus, Route, Home, AlertTriangle, Users, MapPin, LayoutDashboard,
  CheckCircle2, X, Wifi, WifiOff, Wrench, Award, ChevronRight, Zap, Bell, Send,
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis,
  Tooltip, BarChart, Bar,
} from "recharts";
import { useTheme } from "../contexts/ThemeContext";
import { MetricCard, QuickAction, GlassCard, TableSkeleton } from "../components/ui";
import { StatusPieChart } from "../components/charts";
import { DELIVERY_METHODS, hasPermission, formatMoney } from "../constants";
import {
  packagesData, terminalData, hourlyData, notifications, terminalsData,
} from "../constants/mockData";

/* ── Shared chart tooltip style builder ─────────────────────────────────── */
const chartTooltipStyle = (theme) => ({
  backgroundColor: theme.name === 'dark' ? 'rgba(10,10,10,0.92)' : '#fff',
  border: `1px solid ${theme.border.primary}`,
  borderRadius: 12,
  backdropFilter: 'blur(12px)',
  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
  padding: '10px 14px',
});

export const DashboardPage = ({
  currentUser,
  metrics,
  loading,
  setLoading,
  setShowExport,
  setShowScanModal,
  setShowNewPackage,
  setShowDispatchDrawer,
  setActiveMenu,
  setActiveSubMenu,
  addToast,
}) => {
  const { theme } = useTheme();
  const [showTerminalGrid, setShowTerminalGrid] = useState(true);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);
  const [showHomeDelivery, setShowHomeDelivery] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);

  // ── Alert computations ───────────────────────────────────────────────────
  const expiredPkgs = useMemo(() =>
    packagesData.filter(p => p.status === 'expired'), []);
  const nearExpiryPkgs = useMemo(() =>
    packagesData.filter(p => p.status === 'delivered_to_locker' && (p.daysInLocker || 0) >= 4), []);
  const maintenanceTerminals = useMemo(() =>
    terminalsData.filter(t => t.status === 'maintenance'), []);
  const pendingDispatch = useMemo(() =>
    packagesData.filter(p => p.status === 'at_warehouse').length, []);

  const alerts = useMemo(() => {
    const all = [
      ...(expiredPkgs.length > 0 ? [{ id: 'expired', type: 'error', icon: Package, color: theme.status.error, label: `${expiredPkgs.length} expired package${expiredPkgs.length > 1 ? 's' : ''}`, action: 'packages', sub: 'Expired' }] : []),
      ...(nearExpiryPkgs.length > 0 ? [{ id: 'nearExpiry', type: 'warning', icon: Clock, color: theme.status.warning, label: `${nearExpiryPkgs.length} package${nearExpiryPkgs.length > 1 ? 's' : ''} near expiry (4+ days)`, action: 'packages', sub: 'In Locker' }] : []),
      ...(maintenanceTerminals.length > 0 ? [{ id: 'maintenance', type: 'warning', icon: Wrench, color: theme.status.warning, label: `${maintenanceTerminals.map(t => t.name).join(', ')} in maintenance`, action: 'terminals', sub: null }] : []),
      ...(pendingDispatch > 0 ? [{ id: 'dispatch', type: 'info', icon: Truck, color: theme.status.info, label: `${pendingDispatch} package${pendingDispatch > 1 ? 's' : ''} ready for dispatch`, action: 'dispatch', sub: 'Outgoing' }] : []),
    ];
    return all.filter(a => !dismissedAlerts.includes(a.id));
  }, [expiredPkgs, nearExpiryPkgs, maintenanceTerminals, pendingDispatch, dismissedAlerts, theme]);

  // ── Courier leaderboard ─────────────────────────────────────────────────
  const courierLeaderboard = useMemo(() => {
    const stats = {};
    packagesData.forEach(p => {
      if (p.courier) {
        const n = p.courier.name;
        if (!stats[n]) stats[n] = { name: n, deliveries: 0 };
        stats[n].deliveries++;
      }
    });
    return Object.values(stats).sort((a, b) => b.deliveries - a.deliveries).slice(0, 4);
  }, []);

  const statusDistribution = useMemo(
    () => [
      { name: "In Locker", value: packagesData.filter(p => p.status === "delivered_to_locker").length },
      { name: "In Transit", value: packagesData.filter(p => p.status.includes("transit")).length },
      { name: "Pending", value: packagesData.filter(p => p.status === "pending").length },
      { name: "Expired", value: packagesData.filter(p => p.status === "expired").length },
      { name: "Other", value: packagesData.filter(p => !["delivered_to_locker", "pending", "expired"].includes(p.status) && !p.status.includes("transit")).length },
    ],
    [],
  );

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const medalColors = [theme.chart.amber, theme.chart.stone, theme.chart.violet, theme.text.muted];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>
            {greeting}, {(currentUser.name ?? currentUser.email ?? 'there').split(/[\s@]/)[0]}
          </h1>
          <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>
            Here's your network overview for today.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTerminalGrid(s => !s)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{
              backgroundColor: showTerminalGrid ? theme.accent.primary : 'transparent',
              color: showTerminalGrid ? theme.accent.contrast : theme.text.secondary,
              border: `1px solid ${showTerminalGrid ? theme.accent.primary : theme.border.primary}`,
            }}
          >
            <Grid3X3 size={16} /> Terminals
          </button>
          <button onClick={() => setShowExport(true)} className="btn-outline flex items-center gap-2">
            <Download size={16} /> Export
          </button>
          <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }} className="btn-outline flex items-center gap-2">
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* ── Alerts Banner ── */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(alert => (
            <div key={alert.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border" style={{ backgroundColor: `${alert.color}0a`, borderColor: `${alert.color}30` }}>
              <alert.icon size={15} style={{ color: alert.color, flexShrink: 0 }} />
              <p className="flex-1 text-sm font-medium" style={{ color: alert.color }}>{alert.label}</p>
              <button
                onClick={() => { setActiveMenu(alert.action); if (alert.sub) setActiveSubMenu(alert.sub); }}
                className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition-colors"
                style={{ backgroundColor: `${alert.color}15`, color: alert.color }}
              >
                View <ChevronRight size={11} />
              </button>
              <button onClick={() => setDismissedAlerts(p => [...p, alert.id])} className="p-1 rounded-lg transition-opacity hover:opacity-100" style={{ color: alert.color, opacity: 0.5 }}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ── KPI Metrics ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <MetricCard title="Total Packages" value={metrics.totalPackages.toLocaleString()} change="12.5%" changeType="up" icon={Package} loading={loading} />
        <MetricCard title="In Lockers" value={metrics.inLockers.toLocaleString()} change="8.2%" changeType="up" icon={Grid3X3} subtitle="Awaiting pickup" loading={loading} />
        <MetricCard title="In Transit" value={metrics.inTransit.toLocaleString()} icon={Truck} loading={loading} />
        <MetricCard title="Pending Pickup" value={metrics.pendingPickup.toLocaleString()} change="5.1%" changeType="down" icon={Clock} loading={loading} />
        <MetricCard title="Revenue" value={formatMoney(metrics.revenue)} change="18.7%" changeType="up" icon={DollarSign} loading={loading} />
      </div>

      {/* ── Quick Actions ── */}
      <GlassCard>
        <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: theme.text.muted }}>Quick Actions</h3>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          <QuickAction icon={Scan} label="Scan" disabled={!hasPermission(currentUser.role, "packages.scan")} onClick={() => setShowScanModal(true)} />
          <QuickAction icon={Plus} label="New Package" disabled={!hasPermission(currentUser.role, "packages.receive")} onClick={() => setShowNewPackage(true)} />
          <QuickAction icon={Truck} label="Dispatch" disabled={!hasPermission(currentUser.role, "packages.dispatch")} onClick={() => setShowDispatchDrawer(true)} badge="12" />
          <QuickAction icon={Route} label="Route Plan" disabled={!hasPermission(currentUser.role, "packages.dispatch")} onClick={() => { setActiveMenu("dispatch"); setActiveSubMenu("Route Planning"); }} />
          <QuickAction icon={Home} label="Home Delivery" disabled={!hasPermission(currentUser.role, "packages.dispatch")} onClick={() => setShowHomeDelivery(true)} />
          <QuickAction icon={AlertTriangle} label="Report Issue" onClick={() => setShowReportIssue(true)} />
          <QuickAction icon={Grid3X3} label="Lockers" onClick={() => setActiveMenu("lockers")} />
          <QuickAction icon={Users} label="Customers" onClick={() => setActiveMenu("customers")} />
        </div>
      </GlassCard>

      {/* ── Terminal Network Status ── */}
      {showTerminalGrid && (
        <GlassCard noPadding>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
            <div className="flex items-center gap-2.5">
              <MapPin size={15} style={{ color: theme.icon.muted }} />
              <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Terminal Network</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${theme.status.success}18`, color: theme.status.success }}>
                {terminalsData.filter(t => t.status === 'online').length}/{terminalsData.length} online
              </span>
            </div>
            <button onClick={() => setActiveMenu('terminals')} className="text-xs font-medium flex items-center gap-1 transition-colors hover:opacity-80" style={{ color: theme.accent.primary }}>
              Manage <ChevronRight size={11} />
            </button>
          </div>
          <div className="grid md:grid-cols-5 divide-x" style={{ borderColor: theme.border.primary }}>
            {terminalsData.map(t => {
              const occupancy = Math.round((t.occupied / t.totalLockers) * 100);
              const isOnline = t.status === 'online';
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveMenu('terminals')}
                  className="p-4 text-left transition-colors hover:bg-white/5"
                  style={{ borderColor: theme.border.primary }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold truncate" style={{ color: theme.text.primary }}>{t.name}</span>
                    {isOnline
                      ? <span className="w-2 h-2 rounded-full flex-shrink-0 pulse-dot" style={{ backgroundColor: theme.status.success }} />
                      : <Wrench size={11} style={{ color: theme.status.warning, flexShrink: 0 }} />}
                  </div>
                  <p className="text-lg font-bold tabular-nums" style={{ color: theme.text.primary }}>{occupancy}%</p>
                  <div className="mt-1.5 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${occupancy}%`, backgroundColor: occupancy > 80 ? theme.status.warning : theme.status.success }} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs" style={{ color: theme.text.muted }}>
                    <span>{t.available} free</span>
                    {t.maintenance > 0 && <span style={{ color: theme.status.warning }}>! {t.maintenance}</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>
      )}

      {/* ── Delivery Methods ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.values(DELIVERY_METHODS).map(m => {
          const count = packagesData.filter(p => p.deliveryMethod === m.id).length;
          return (
            <GlassCard key={m.id} hover className="!p-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl shrink-0" style={{ backgroundColor: theme.bg.tertiary, border: `1px solid ${theme.border.secondary}` }}>
                  <m.icon size={22} style={{ color: theme.text.primary }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm leading-snug" style={{ color: theme.text.primary }}>{m.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>Active route</p>
                </div>
                <p className="text-2xl font-bold tabular-nums" style={{ color: theme.text.primary }}>{count}</p>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GlassCard className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>Terminal Performance</h3>
            <div className="flex gap-3">
              {[
                { label: "Accra", color: theme.chart.blue },
                { label: "Achimota", color: theme.chart.teal },
                { label: "Kotoka", color: theme.chart.green },
              ].map(l => (
                <span key={l.label} className="flex items-center gap-1.5 text-xs" style={{ color: theme.text.muted }}>
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />
                  {l.label}
                </span>
              ))}
            </div>
          </div>
          {loading ? <TableSkeleton rows={3} cols={1} /> : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={terminalData}>
                <defs>
                  <linearGradient id="grad-blue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={theme.chart.blue} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={theme.chart.blue} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                <Tooltip contentStyle={chartTooltipStyle(theme)} labelStyle={{ color: theme.text.primary, fontWeight: 600, marginBottom: 4 }} itemStyle={{ color: theme.text.secondary, fontSize: 12 }} />
                <Area type="monotone" dataKey="accra" stroke={theme.chart.blue} fill="url(#grad-blue)" strokeWidth={2} />
                <Area type="monotone" dataKey="achimota" stroke={theme.chart.teal} fill="transparent" strokeWidth={2} />
                <Area type="monotone" dataKey="kotoka" stroke={theme.chart.green} fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Package Status</h3>
          {loading ? <TableSkeleton rows={3} cols={1} /> : (
            <>
              <StatusPieChart data={statusDistribution} theme={theme} />
              <div className="space-y-2.5 mt-4">
                {statusDistribution.map((s, i) => (
                  <div key={s.name} className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-sm" style={{ color: theme.text.secondary }}>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: theme.chart.series[i] }} />
                      {s.name}
                    </span>
                    <span className="font-semibold tabular-nums" style={{ color: theme.text.primary }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </GlassCard>
      </div>

      {/* ── Analytics Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Peak Hours</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 10 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 10 }} />
              <Tooltip contentStyle={chartTooltipStyle(theme)} labelStyle={{ color: theme.text.primary, fontWeight: 600 }} />
              <Bar dataKey="packages" fill={theme.chart.blue} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Recent Activity</h3>
          <div className="space-y-0">
            {notifications.slice(0, 5).map((n, idx, arr) => {
              const dotColor = n.type === 'error' ? theme.status.error : n.type === 'warning' ? theme.status.warning : n.type === 'success' ? theme.status.success : theme.status.info;
              return (
                <div key={n.id} className="flex gap-3 relative">
                  {idx < arr.length - 1 && <div className="absolute left-[7px] top-5 bottom-0 w-px" style={{ backgroundColor: theme.border.primary }} />}
                  <div className="w-3.5 h-3.5 rounded-full shrink-0 mt-1.5 relative z-10" style={{ backgroundColor: dotColor, boxShadow: `0 0 0 3px ${theme.name === 'dark' ? 'rgba(255,255,255,0.05)' : '#fff'}` }} />
                  <div className="pb-3.5">
                    <p className="text-sm leading-snug" style={{ color: theme.text.primary }}>{n.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{n.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>

      {/* ── Courier Leaderboard ── */}
      <GlassCard noPadding>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
          <div className="flex items-center gap-2.5">
            <Award size={15} style={{ color: theme.chart.amber }} />
            <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Courier Leaderboard</h3>
          </div>
          <button onClick={() => setActiveMenu('couriers')} className="text-xs font-medium flex items-center gap-1 transition-colors hover:opacity-80" style={{ color: theme.accent.primary }}>
            All couriers <ChevronRight size={11} />
          </button>
        </div>
        <div className="grid md:grid-cols-4 divide-x" style={{ borderColor: theme.border.primary }}>
          {courierLeaderboard.map((c, i) => {
            const medals = ['\uD83E\uDD47', '\uD83E\uDD48', '\uD83E\uDD49', ''];
            return (
              <div key={c.name} className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{medals[i]}</span>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold" style={{ backgroundColor: `${medalColors[i]}20`, color: medalColors[i] }}>
                    {c.name.charAt(0)}
                  </div>
                </div>
                <p className="text-sm font-semibold" style={{ color: theme.text.primary }}>{c.name}</p>
                <p className="text-xs mt-0.5 tabular-nums" style={{ color: theme.text.muted }}>{c.deliveries} deliveries</p>
                <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                  <div className="h-full rounded-full transition-all" style={{ width: `${(c.deliveries / courierLeaderboard[0].deliveries) * 100}%`, backgroundColor: medalColors[i] }} />
                </div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      {/* ========== HOME DELIVERY MODAL ========== */}
      {showHomeDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowHomeDelivery(false)}>
          <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: theme.border.primary }}>
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: theme.text.primary }}>
                <Home size={20} style={{ color: theme.accent.primary }} />Home Delivery Queue
              </h2>
              <button onClick={() => setShowHomeDelivery(false)} className="p-2 rounded-xl hover:bg-white/5" style={{ color: theme.text.muted }}><X size={18} /></button>
            </div>
            <div className="p-5">
              <p className="text-sm mb-4" style={{ color: theme.text.muted }}>Packages awaiting home delivery dispatch</p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                      <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Waybill</th>
                      <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</th>
                      <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Address</th>
                      <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                      <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packagesData.filter(p => p.deliveryMethod === 'home_delivery' || p.status === 'at_warehouse').slice(0, 8).map(p => (
                      <tr key={p.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                        <td className="p-3"><span className="font-mono text-sm" style={{ color: theme.text.primary }}>{p.waybill || p.id}</span></td>
                        <td className="p-3"><span className="text-sm" style={{ color: theme.text.primary }}>{p.recipient || p.customer || 'N/A'}</span></td>
                        <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{p.address || p.destination || 'Pending'}</span></td>
                        <td className="p-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${theme.status.warning}15`, color: theme.status.warning }}>{(p.status || '').replace(/_/g, ' ')}</span></td>
                        <td className="p-3"><span className="text-sm font-mono" style={{ color: theme.text.muted }}>{p.daysInLocker || 0}d</span></td>
                      </tr>
                    ))}
                    {packagesData.filter(p => p.deliveryMethod === 'home_delivery' || p.status === 'at_warehouse').length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-sm" style={{ color: theme.text.muted }}>No packages currently awaiting home delivery</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => { setShowHomeDelivery(false); setActiveMenu('dispatch'); setActiveSubMenu('Home Delivery'); }} className="btn-primary flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium">
                  <Truck size={16} />Go to Dispatch
                </button>
                <button onClick={() => setShowHomeDelivery(false)} className="btn-outline px-5 py-2.5 rounded-xl border text-sm">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========== REPORT ISSUE MODAL ========== */}
      {showReportIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }} onClick={() => setShowReportIssue(false)}>
          <div className="w-full max-w-lg rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: theme.border.primary }}>
              <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: theme.text.primary }}>
                <AlertTriangle size={20} style={{ color: theme.status.warning }} />Report Issue
              </h2>
              <button onClick={() => setShowReportIssue(false)} className="p-2 rounded-xl hover:bg-white/5" style={{ color: theme.text.muted }}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Issue Type *</label>
                <select className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}>
                  <option value="">Select issue type</option>
                  <option value="locker_malfunction">Locker Malfunction</option>
                  <option value="package_damage">Package Damage</option>
                  <option value="delivery_delay">Delivery Delay</option>
                  <option value="system_error">System Error</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Terminal / Locker *</label>
                <select className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}>
                  <option value="">Select terminal</option>
                  {terminalsData.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.status})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Description *</label>
                <textarea rows={4} placeholder="Describe the issue in detail..." className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent resize-none" style={{ borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Severity *</label>
                <select className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setShowReportIssue(false); addToast({ type: 'success', message: 'Issue reported successfully! Ticket ID: ISS-' + Math.floor(1000 + Math.random() * 9000) }); }} className="btn-primary flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium">
                  <Send size={16} />Submit Report
                </button>
                <button onClick={() => setShowReportIssue(false)} className="btn-outline px-6 py-3 rounded-xl border text-sm">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
