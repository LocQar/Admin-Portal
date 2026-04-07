import React, { useState, useMemo } from 'react';
import { Download, Package, Clock, Award, Users, TrendingUp, AlertTriangle, Zap, Star, BarChart2, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard } from '../components/ui';
import { StatusBadge } from '../components/ui/Badge';
import { terminalData, hourlyData, packagesData, terminalsData, pricingRevenueData, couriersData } from '../constants/mockData';
import { PredictiveRevenueChart, ChurnRiskHeatmap } from '../components/analytics/PredictiveCharts';

const DATE_RANGES = [
  { key: '7d', label: '7 days', mult: 0.25 },
  { key: '30d', label: '30 days', mult: 1 },
  { key: '90d', label: '90 days', mult: 3 },
  { key: '1y', label: '1 year', mult: 12 },
];

const STATUS_COLORS = {
  delivered_to_locker: '#81C995',
  in_transit_to_locker: '#7EA8C9',
  pending: '#D4AA5A',
  at_warehouse: '#B5A0D1',
  expired: '#D48E8A',
  delivered_to_home: '#34D399',
  in_transit_to_home: '#60A5FA',
};

export const AnalyticsPage = ({ loading, setShowExport }) => {
  const { theme } = useTheme();
  const [dateRange, setDateRange] = useState('30d');

  const mult = DATE_RANGES.find(r => r.key === dateRange)?.mult ?? 1;

  const metrics = useMemo(() => ({
    deliveries: Math.round(12847 * mult),
    avgTime: (2.4 * (dateRange === '7d' ? 0.95 : dateRange === '90d' ? 1.05 : dateRange === '1y' ? 1.1 : 1)).toFixed(1),
    satisfaction: Math.min(99, Math.round(94 + (mult - 1) * 0.5)),
    customers: Math.round(3456 * Math.max(1, mult * 0.4)),
  }), [dateRange, mult]);

  const statusBreakdown = useMemo(() => {
    const counts = {};
    packagesData.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1; });
    return Object.entries(counts)
      .map(([status, value]) => ({ status, value, label: status.replace(/_/g, ' ') }))
      .sort((a, b) => b.value - a.value);
  }, []);

  const topCouriers = useMemo(() =>
    [...couriersData]
      .filter(c => c.totalDeliveries > 0)
      .sort((a, b) => b.totalDeliveries - a.totalDeliveries)
      .slice(0, 5)
  , []);

  const revenueByMethod = [
    { method: 'Warehouse→Locker', revenue: 28400, color: '#7EA8C9' },
    { method: 'Dropbox→Locker', revenue: 11200, color: '#B5A0D1' },
    { method: 'Locker→Home', revenue: 8900, color: '#81C995' },
    { method: 'Warehouse→Home', revenue: 5600, color: '#D4AA5A' },
  ].map(d => ({ ...d, revenue: Math.round(d.revenue * mult) }));

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* ── HEADER ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Analytics & AI Insights</h1>
        <div className="flex items-center gap-2">
          {/* Date Range Filter */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
            {DATE_RANGES.map(r => (
              <button key={r.key} onClick={() => setDateRange(r.key)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: dateRange === r.key ? theme.accent.primary : 'transparent', color: dateRange === r.key ? theme.accent.contrast : theme.text.muted }}>
                {r.label}
              </button>
            ))}
          </div>
          <button onClick={() => setShowExport && setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Download size={16} />Export
          </button>
        </div>
      </div>

      {/* ── METRICS ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Deliveries" value={metrics.deliveries.toLocaleString()} change="15.2%" changeType="up" icon={Package} theme={theme} loading={loading} />
        <MetricCard title="Avg. Delivery Time" value={`${metrics.avgTime} hrs`} change="8.5%" changeType="down" icon={Clock} theme={theme} loading={loading} />
        <MetricCard title="Customer Satisfaction" value={`${metrics.satisfaction}%`} change="2.1%" changeType="up" icon={Award} theme={theme} loading={loading} />
        <MetricCard title="Active Customers" value={metrics.customers.toLocaleString()} change="12.8%" changeType="up" icon={Users} theme={theme} loading={loading} />
      </div>

      {/* ── ROW 1: Revenue Forecast + Delivery Methods ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2" style={{ color: theme.text.primary }}>
                <TrendingUp size={18} className="text-purple-500" /> Revenue Forecast (AI Model)
              </h3>
              <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>Projected revenue based on current growth trajectory</p>
            </div>
            <div className="flex items-center gap-3 text-xs" style={{ color: theme.text.muted }}>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent.primary }} />Actual</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500" />Projected</span>
            </div>
          </div>
          <PredictiveRevenueChart />
        </div>

        <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Delivery Methods</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={[
                { name: 'Warehouse→Locker', value: packagesData.filter(p => p.deliveryMethod === 'warehouse_to_locker').length },
                { name: 'Dropbox→Locker', value: packagesData.filter(p => p.deliveryMethod === 'dropbox_to_locker').length },
                { name: 'Locker→Home', value: packagesData.filter(p => p.deliveryMethod === 'locker_to_home').length },
              ]} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                <Cell fill={theme.chart.blue} /><Cell fill={theme.chart.violet} /><Cell fill={theme.chart.green} />
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} labelStyle={{ color: theme.text.primary }} itemStyle={{ color: theme.text.secondary }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {[['Warehouse→Locker', theme.chart.blue], ['Dropbox→Locker', theme.chart.violet], ['Locker→Home', theme.chart.green]].map(([l, c]) => (
              <div key={l} className="flex items-center gap-2 text-xs">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
                <span style={{ color: theme.text.secondary }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 2: Terminal Throughput + Package Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold flex items-center gap-2" style={{ color: theme.text.primary }}>
              <BarChart2 size={18} style={{ color: theme.chart.blue }} /> Terminal Throughput
            </h3>
            <span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted }}>Monthly packages</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={terminalData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} labelStyle={{ color: theme.text.primary }} itemStyle={{ color: theme.text.secondary }} />
              <Bar dataKey="accra" fill={theme.chart.blue} radius={[3, 3, 0, 0]} name="Accra Mall" barSize={12} />
              <Bar dataKey="achimota" fill={theme.chart.amber} radius={[3, 3, 0, 0]} name="Achimota" barSize={12} />
              <Bar dataKey="kotoka" fill={theme.chart.green} radius={[3, 3, 0, 0]} name="Kotoka T3" barSize={12} />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            {[['Accra Mall', theme.chart.blue], ['Achimota', theme.chart.amber], ['Kotoka T3', theme.chart.green]].map(([l, c]) => (
              <div key={l} className="flex items-center gap-1.5 text-xs">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: c }} />
                <span style={{ color: theme.text.muted }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
            <Activity size={18} style={{ color: theme.chart.violet }} /> Package Status Breakdown
          </h3>
          <div className="space-y-2.5">
            {statusBreakdown.map(({ status, value, label }) => {
              const pct = Math.round(value / packagesData.length * 100);
              const color = STATUS_COLORS[status] || theme.text.muted;
              return (
                <div key={status}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs capitalize" style={{ color: theme.text.secondary }}>{label}</span>
                    <span className="text-xs font-medium font-mono" style={{ color }}>{value} <span style={{ color: theme.text.muted }}>({pct}%)</span></span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ backgroundColor: theme.bg.tertiary }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ROW 3: Revenue by Method + Top Couriers ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
            <TrendingUp size={18} style={{ color: '#81C995' }} /> Revenue by Delivery Method
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueByMethod} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="method" type="category" width={130} tick={{ fill: theme.text.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: theme.bg.card, borderRadius: 12, border: `1px solid ${theme.border.primary}` }} labelStyle={{ color: theme.text.primary }} itemStyle={{ color: theme.text.secondary }} formatter={v => `GH₵ ${v.toLocaleString()}`} />
              <Bar dataKey="revenue" radius={[0, 4, 4, 0]} barSize={20}>
                {revenueByMethod.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
            <h3 className="font-semibold flex items-center gap-2" style={{ color: theme.text.primary }}>
              <Star size={18} style={{ color: '#D4AA5A' }} /> Top Couriers
            </h3>
          </div>
          <div className="divide-y" style={{ borderColor: theme.border.primary }}>
            {topCouriers.map((c, i) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                <div className="w-6 text-center font-bold text-sm" style={{ color: i === 0 ? '#D4AA5A' : theme.text.muted }}>#{i + 1}</div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary }}>
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: theme.text.primary }}>{c.name}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{c.zone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: theme.text.primary }}>{c.totalDeliveries.toLocaleString()}</p>
                  <p className="text-xs flex items-center justify-end gap-0.5" style={{ color: '#D4AA5A' }}>
                    <Star size={10} fill="#D4AA5A" /> {c.rating}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── ROW 4: AI Insights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <h3 className="font-semibold mb-1 flex items-center gap-2" style={{ color: theme.text.primary }}>
            <AlertTriangle size={18} className="text-orange-500" /> Subscriber Churn Risk
          </h3>
          <p className="text-xs mb-4" style={{ color: theme.text.muted }}>AI analysis of user engagement vs ticket volume</p>
          <ChurnRiskHeatmap />
        </div>

        <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <h3 className="font-semibold mb-1 flex items-center gap-2" style={{ color: theme.text.primary }}>
            <Zap size={18} className="text-red-500" /> SLA Breach Forecast (24h)
          </h3>
          <p className="text-xs mb-4" style={{ color: theme.text.muted }}>Terminals predicted to overflow based on incoming volume</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={[
              { terminal: 'Achimota', probability: 85 },
              { terminal: 'Accra Mall', probability: 45 },
              { terminal: 'Kotoka', probability: 30 },
              { terminal: 'Junction', probability: 15 },
              { terminal: 'West Hills', probability: 10 },
            ]} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} horizontal={false} />
              <XAxis type="number" hide />
              <YAxis dataKey="terminal" type="category" width={100} tick={{ fill: theme.text.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: theme.bg.card, borderRadius: 12, border: `1px solid ${theme.border.primary}` }} labelStyle={{ color: theme.text.primary }} itemStyle={{ color: theme.text.secondary }} formatter={v => `${v}% risk`} />
              <Bar dataKey="probability" radius={[0, 4, 4, 0]} barSize={20}>
                {[85, 45, 30, 15, 10].map((entry, index) => (
                  <Cell key={index} fill={entry > 80 ? theme.chart.coral : entry > 40 ? theme.chart.amber : theme.chart.green} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── ROW 5: Terminal Utilization + Hourly Volume ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>Terminal Utilization Live</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                {['Terminal', 'Lockers', 'Utilization', 'Status'].map((h, i) => (
                  <th key={h} className={`text-left p-3 text-xs font-semibold uppercase ${i === 3 ? 'hidden md:table-cell' : ''}`} style={{ color: theme.text.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {terminalsData.map(t => {
                const util = Math.round(t.occupied / t.totalLockers * 100);
                return (
                  <tr key={t.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <td className="p-3">
                      <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{t.name}</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{t.location}</p>
                    </td>
                    <td className="p-3 text-sm" style={{ color: theme.text.primary }}>{t.totalLockers}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full" style={{ backgroundColor: theme.bg.tertiary }}>
                          <div className="h-full rounded-full" style={{ width: `${util}%`, backgroundColor: util > 80 ? '#D48E8A' : util > 60 ? '#D4AA5A' : '#81C995' }} />
                        </div>
                        <span className="text-xs font-medium" style={{ color: theme.text.secondary }}>{util}%</span>
                      </div>
                    </td>
                    <td className="p-3 hidden md:table-cell"><StatusBadge status={t.status} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Hourly Volume</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} labelStyle={{ color: theme.text.primary }} itemStyle={{ color: theme.text.secondary }} />
              <Bar dataKey="packages" fill={theme.chart.blue} radius={[4, 4, 0, 0]} name="Packages" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
