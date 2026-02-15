import React from 'react';
import { Download, Package, Clock, Award, Users, TrendingUp, AlertTriangle, Zap } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard } from '../components/ui';
import { StatusBadge } from '../components/ui/Badge';
import { terminalData, hourlyData, packagesData, terminalsData, pricingRevenueData } from '../constants/mockData';
import { PredictiveRevenueChart, ChurnRiskHeatmap } from '../components/analytics/PredictiveCharts';

export const AnalyticsPage = ({ loading, setShowExport }) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Analytics & AI Insights</h1>
        <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={16} />Export</button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Deliveries" value="12,847" change="15.2%" changeType="up" icon={Package} theme={theme} loading={loading} />
        <MetricCard title="Avg. Delivery Time" value="2.4 hrs" change="8.5%" changeType="down" icon={Clock} theme={theme} loading={loading} />
        <MetricCard title="Customer Satisfaction" value="94%" change="2.1%" changeType="up" icon={Award} theme={theme} loading={loading} />
        <MetricCard title="Active Customers" value="3,456" change="12.8%" changeType="up" icon={Users} theme={theme} loading={loading} />
      </div>

      {/* --- REVENUE & DELIVERY TRENDS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Revenue Forecast */}
        <div className="lg:col-span-2 p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2" style={{ color: theme.text.primary }}><TrendingUp size={18} className="text-purple-500" /> Revenue Forecast (AI Model)</h3>
              <p className="text-xs text-muted-foreground">Projected revenue based on current growth trajectory.</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.accent.primary }}></div> Actual</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Projected</span>
            </div>
          </div>
          <PredictiveRevenueChart />
        </div>

        {/* Delivery Methods Donut */}
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
                <Cell fill={theme.chart.blue} /><Cell fill={theme.chart.violet} /><Cell fill={theme.chart.green} />
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {[['Warehouse→Locker', theme.chart.blue], ['Dropbox→Locker', theme.chart.violet], ['Locker→Home', theme.chart.green]].map(([l, c]) => (
              <div key={l} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                <span style={{ color: theme.text.secondary }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- RISK & PREDICTIONS ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Churn Risk Heatmap */}
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <h3 className="font-semibold mb-1 flex items-center gap-2" style={{ color: theme.text.primary }}>
            <AlertTriangle size={18} className="text-orange-500" /> Subscriber Churn Risk
          </h3>
          <p className="text-xs text-muted-foreground mb-4">AI analysis of user engagement vs ticket volume.</p>
          <ChurnRiskHeatmap />
        </div>

        {/* SLA Breach Prediction */}
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <h3 className="font-semibold mb-1 flex items-center gap-2" style={{ color: theme.text.primary }}>
            <Zap size={18} className="text-red-500" /> SLA Breach Forecast (24h)
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Terminals predicted to overflow based on incoming volume.</p>
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
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: theme.bg.card, borderRadius: 12, border: `1px solid ${theme.border.primary}` }} />
              <Bar dataKey="probability" radius={[0, 4, 4, 0]} barSize={20}>
                {
                  [85, 45, 30, 15, 10].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry > 80 ? theme.chart.coral : entry > 40 ? theme.chart.amber : theme.chart.green} />
                  ))
                }
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- BOTTOM ROW: HOURLY & TERMINALS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>Terminal Utilization Live</h3>
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
              <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
              <Bar dataKey="packages" fill={theme.chart.blue} radius={[4, 4, 0, 0]} name="Packages" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
