import React from 'react';
import { Download, Search, Plus, ArrowUpRight, ArrowDownRight, DollarSign, Banknote, TrendingUp, Receipt, Calendar, FileText, Briefcase, CreditCard } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard, TableSkeleton } from '../components/ui';
import { StatusBadge } from '../components/ui/Badge';
import { transactionsData, invoicesData, pricingRevenueData, terminalData } from '../constants/mockData';

export const AccountingPage = ({
  activeSubMenu,
  loading,
  setShowExport,
  txnSearch,
  setTxnSearch,
  txnStatusFilter,
  setTxnStatusFilter,
  txnSort,
  setTxnSort,
  filteredTransactions,
  invSearch,
  setInvSearch,
  invStatusFilter,
  setInvStatusFilter,
  filteredInvoices,
  addToast,
}) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Accounting</h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Transactions'}</p>
        </div>
        <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
          <Download size={16} /> Export
        </button>
      </div>

      {(!activeSubMenu || activeSubMenu === 'Transactions') && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Total Revenue" value="GH₵ 68.5K" change="18.7%" changeType="up" icon={DollarSign} theme={theme} loading={loading} />
            <MetricCard title="Pending COD" value="GH₵ 4.2K" icon={Banknote} theme={theme} loading={loading} />
            <MetricCard title="This Month" value="GH₵ 48.2K" change="12.5%" changeType="up" icon={TrendingUp} theme={theme} loading={loading} />
            <MetricCard title="Transactions" value="1,847" icon={Receipt} theme={theme} loading={loading} />
          </div>
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
              <input value={txnSearch} onChange={e => setTxnSearch(e.target.value)} placeholder="Search transactions..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
              {[['all', 'All'], ['completed', 'Completed'], ['pending', 'Pending']].map(([val, label]) => (
                <button key={val} onClick={() => setTxnStatusFilter(val)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: txnStatusFilter === val ? theme.accent.primary : 'transparent', color: txnStatusFilter === val ? '#fff' : theme.text.muted }}>{label}</button>
              ))}
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filteredTransactions.length} of {transactionsData.length} transactions</p>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            {loading ? <TableSkeleton rows={4} cols={6} theme={theme} /> : (
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    {[['id', 'Transaction'], ['date', 'Date', 'hidden md:table-cell'], ['description', 'Description', 'hidden lg:table-cell'], ['customer', 'Customer'], ['amount', 'Amount']].map(([field, label, hide]) => (
                      <th key={field} className={`text-left p-4 text-xs font-semibold uppercase cursor-pointer select-none ${hide || ''}`} style={{ color: txnSort.field === field ? theme.accent.primary : theme.text.muted }} onClick={() => setTxnSort(prev => ({ field, dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc' }))}>
                        <span className="flex items-center gap-1">{label}{txnSort.field === field && (txnSort.dir === 'asc' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}</span>
                      </th>
                    ))}
                    <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(t => (
                    <tr key={t.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                      <td className="p-4"><span className="font-mono" style={{ color: theme.text.primary }}>{t.id}</span></td>
                      <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{t.date}</span></td>
                      <td className="p-4 hidden lg:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{t.description}</span></td>
                      <td className="p-4"><span style={{ color: theme.text.primary }}>{t.customer}</span></td>
                      <td className="p-4"><span className={`font-medium ${t.amount < 0 ? 'text-red-500' : 'text-emerald-500'}`}>GH₵ {Math.abs(t.amount).toLocaleString()}</span></td>
                      <td className="p-4"><StatusBadge status={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}

      {activeSubMenu === 'Invoices' && (
        <div>
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <div className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
              <input value={invSearch} onChange={e => setInvSearch(e.target.value)} placeholder="Search invoices..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
              {[['all', 'All'], ['paid', 'Paid'], ['pending', 'Pending'], ['overdue', 'Overdue']].map(([val, label]) => (
                <button key={val} onClick={() => setInvStatusFilter(val)} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: invStatusFilter === val ? theme.accent.primary : 'transparent', color: invStatusFilter === val ? '#fff' : theme.text.muted }}>{label}</button>
              ))}
            </div>
          </div>
          <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filteredInvoices.length} of {invoicesData.length} invoices</p>
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Invoices</h3>
              <button onClick={() => addToast({ type: 'info', message: 'Invoice form opened' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}><Plus size={16} />Create Invoice</button>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Invoice</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Date</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Due Date</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Amount</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <td className="p-4"><span className="font-mono" style={{ color: theme.text.primary }}>{inv.id}</span></td>
                    <td className="p-4"><span style={{ color: theme.text.primary }}>{inv.customer}</span></td>
                    <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{inv.date}</span></td>
                    <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{inv.dueDate}</span></td>
                    <td className="p-4"><span className="font-medium" style={{ color: theme.text.primary }}>GH₵ {inv.amount.toLocaleString()}</span></td>
                    <td className="p-4"><StatusBadge status={inv.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubMenu === 'Reports' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Revenue by SLA Tier</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={pricingRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} formatter={v => `GH₵ ${v.toLocaleString()}`} />
                  <Bar dataKey="standard" stackId="a" fill="#6b7280" radius={[0, 0, 0, 0]} name="Standard" />
                  <Bar dataKey="express" stackId="a" fill="#f59e0b" name="Express" />
                  <Bar dataKey="rush" stackId="a" fill="#ef4444" name="Rush" />
                  <Bar dataKey="economy" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} name="Economy" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Revenue by Terminal</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={terminalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                  <Line type="monotone" dataKey="accra" stroke="#3b82f6" strokeWidth={2} name="Accra Mall" />
                  <Line type="monotone" dataKey="achimota" stroke="#10b981" strokeWidth={2} name="Achimota Mall" />
                  <Line type="monotone" dataKey="kotoka" stroke="#f59e0b" strokeWidth={2} name="Kotoka T3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Invoice Aging</h3>
              <div className="space-y-3">
                {[
                  ['Current (0-30 days)', invoicesData.filter(i => i.status === 'paid').length, '#10b981'],
                  ['Due (30-60 days)', invoicesData.filter(i => i.status === 'pending').length, '#f59e0b'],
                  ['Overdue (60+ days)', invoicesData.filter(i => i.status === 'overdue').length, '#ef4444'],
                ].map(([label, count, color]) => (
                  <div key={label} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: `${color}10` }}>
                    <span className="text-sm" style={{ color: theme.text.primary }}>{label}</span>
                    <span className="font-bold" style={{ color }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2 p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Quick Reports</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  { name: 'Daily Revenue Report', icon: Calendar, desc: 'Today\'s revenue summary' },
                  { name: 'Monthly Summary', icon: FileText, desc: 'Full month financial overview' },
                  { name: 'COD Collection Report', icon: Banknote, desc: 'Cash on delivery reconciliation' },
                  { name: 'Partner Billing', icon: Briefcase, desc: 'Partner invoice generation' },
                  { name: 'Tax Report', icon: Receipt, desc: 'VAT and tax breakdown' },
                  { name: 'Expense Report', icon: CreditCard, desc: 'Operational expenses' },
                ].map(report => (
                  <div key={report.name} className="p-3 rounded-xl border flex items-center gap-3" style={{ borderColor: theme.border.primary }}>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accent.light }}><report.icon size={16} style={{ color: theme.accent.primary }} /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{report.name}</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{report.desc}</p>
                    </div>
                    <button onClick={() => addToast({ type: 'success', message: `Generating ${report.name}...` })} className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary }}>Generate</button>
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
