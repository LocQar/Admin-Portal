import React from 'react';
import { Download, Package, Clock, Award, Users } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard } from '../components/ui';
import { StatusBadge } from '../components/ui/Badge';
import { terminalData, hourlyData, packagesData, terminalsData, pricingRevenueData } from '../constants/mockData';

export const AnalyticsPage = ({ loading, setShowExport }) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Analytics</h1>
        <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={16} />Export</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Deliveries" value="12,847" change="15.2%" changeType="up" icon={Package} theme={theme} loading={loading} />
        <MetricCard title="Avg. Delivery Time" value="2.4 hrs" change="8.5%" changeType="down" icon={Clock} theme={theme} loading={loading} />
        <MetricCard title="Customer Satisfaction" value="94%" change="2.1%" changeType="up" icon={Award} theme={theme} loading={loading} />
        <MetricCard title="Active Customers" value="3,456" change="12.8%" changeType="up" icon={Users} theme={theme} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Delivery Trends (Monthly)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={terminalData}>
              <defs>
                <linearGradient id="gradAnalytics" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={theme.accent.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={theme.accent.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
              <Area type="monotone" dataKey="accra" stroke={theme.accent.primary} fill="url(#gradAnalytics)" strokeWidth={2} name="Accra Mall" />
              <Area type="monotone" dataKey="achimota" stroke="#3b82f6" fill="transparent" strokeWidth={2} name="Achimota" />
              <Area type="monotone" dataKey="kotoka" stroke="#10b981" fill="transparent" strokeWidth={2} name="Kotoka T3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Delivery Methods</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={[
                  { name: 'Warehouse→Locker', value: packagesData.filter(p => p.deliveryMethod === 'warehouse_to_locker').length },
                  { name: 'Dropbox→Locker', value: packagesData.filter(p => p.deliveryMethod === 'dropbox_to_locker').length },
                  { name: 'Locker→Home', value: packagesData.filter(p => p.deliveryMethod === 'locker_to_home').length },
                ]}
                cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value"
              >
                <Cell fill="#3b82f6" /><Cell fill="#8b5cf6" /><Cell fill="#10b981" />
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {[['Warehouse→Locker', '#3b82f6'], ['Dropbox→Locker', '#8b5cf6'], ['Locker→Home', '#10b981']].map(([l, c]) => (
              <div key={l} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                <span style={{ color: theme.text.secondary }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Hourly Volume</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
              <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
              <Bar dataKey="packages" fill={theme.accent.primary} radius={[4, 4, 0, 0]} name="Packages" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>SLA Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={pricingRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} formatter={v => `GH₵ ${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="standard" stroke="#6b7280" fill="transparent" strokeWidth={2} name="Standard" />
              <Area type="monotone" dataKey="express" stroke="#f59e0b" fill="transparent" strokeWidth={2} name="Express" />
              <Area type="monotone" dataKey="rush" stroke="#ef4444" fill="transparent" strokeWidth={2} name="Rush" />
              <Area type="monotone" dataKey="economy" stroke="#10b981" fill="transparent" strokeWidth={2} name="Economy" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>Terminal Performance</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Terminal</th>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Lockers</th>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Utilization</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {terminalsData.map(t => {
                const util = Math.round(t.occupied / t.totalLockers * 100);
                return (
                  <tr key={t.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <td className="p-3">
                      <div><span className="text-sm font-medium" style={{ color: theme.text.primary }}>{t.name}</span></div>
                      <span className="text-xs" style={{ color: theme.text.muted }}>{t.location}</span>
                    </td>
                    <td className="p-3"><span className="text-sm" style={{ color: theme.text.primary }}>{t.totalLockers}</span></td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                          <div className="h-full rounded-full" style={{ width: `${util}%`, backgroundColor: util > 80 ? '#ef4444' : util > 60 ? '#f59e0b' : '#10b981' }} />
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
          <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Top Terminals</h3>
          <div className="space-y-4">
            {terminalsData.sort((a, b) => b.occupied - a.occupied).slice(0, 5).map((t, i) => (
              <div key={t.id} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: i === 0 ? '#f59e0b' : i === 1 ? '#a3a3a3' : i === 2 ? '#cd7c32' : theme.border.secondary }}>{i + 1}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{t.name}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{t.occupied} active &bull; {t.available} open</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
