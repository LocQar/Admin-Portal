import React, { useState, useMemo } from 'react';
import { Download, Search, Plus, ArrowUpRight, ArrowDownRight, DollarSign, Banknote, TrendingUp, Receipt, Calendar, FileText, Briefcase, CreditCard, X, Trash2, Edit, CheckCircle, Clock, AlertTriangle, Eye } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard } from '../components/ui';
import { StatusBadge } from '../components/ui/Badge';
import { transactionsData, invoicesData, pricingRevenueData, terminalData } from '../constants/mockData';

const TXN_TYPES = ['credit', 'debit'];
const TXN_STATUSES = ['completed', 'pending', 'failed'];
const INV_STATUSES = ['paid', 'pending', 'overdue'];

const NewTransactionModal = ({ onClose, onSave, theme }) => {
  const [form, setForm] = useState({ description: '', customer: '', amount: '', type: 'credit', status: 'completed', date: new Date().toISOString().slice(0, 10) });
  const [errors, setErrors] = useState({});
  const update = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Required';
    if (!form.customer.trim()) e.customer = 'Required';
    if (!form.amount || isNaN(parseFloat(form.amount))) e.amount = 'Valid amount required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const inputStyle = (f) => ({ backgroundColor: 'transparent', borderColor: errors[f] ? '#D48E8A' : theme.border.primary, color: theme.text.primary });
  const lbl = "text-xs font-semibold uppercase block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-md rounded-2xl border p-6 space-y-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg" style={{ color: theme.text.primary }}>Record Transaction</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><X size={18} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className={lbl} style={{ color: theme.text.muted }}>Description *</label>
            <input value={form.description} onChange={e => update('description', e.target.value)} placeholder="Package delivery - LQ-2024-..." className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('description')} />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Customer *</label>
              <input value={form.customer} onChange={e => update('customer', e.target.value)} placeholder="Customer name" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('customer')} />
              {errors.customer && <p className="text-xs text-red-500 mt-1">{errors.customer}</p>}
            </div>
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Amount (GH₵) *</label>
              <input type="number" value={form.amount} onChange={e => update('amount', e.target.value)} placeholder="0.00" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('amount')} />
              {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Type</label>
              <div className="flex gap-2">
                {TXN_TYPES.map(t => (
                  <button key={t} onClick={() => update('type', t)} className="flex-1 py-2 rounded-xl text-sm capitalize" style={{ backgroundColor: form.type === t ? (t === 'credit' ? '#81C99520' : '#D48E8A20') : theme.bg.tertiary, color: form.type === t ? (t === 'credit' ? '#81C995' : '#D48E8A') : theme.text.muted, border: `1px solid ${form.type === t ? (t === 'credit' ? '#81C99540' : '#D48E8A40') : theme.border.primary}` }}>{t}</button>
                ))}
              </div>
            </div>
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Status</label>
              <select value={form.status} onChange={e => update('status', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                {TXN_STATUSES.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={lbl} style={{ color: theme.text.muted }}>Date</label>
            <input type="date" value={form.date} onChange={e => update('date', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('date')} />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={() => { if (validate()) onSave(form); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>Record Transaction</button>
        </div>
      </div>
    </div>
  );
};

const InvoiceDrawer = ({ invoice, onClose, onSave, theme }) => {
  const isEdit = !!invoice?.id;
  const [form, setForm] = useState(invoice || { customer: '', amount: '', date: new Date().toISOString().slice(0, 10), dueDate: '', status: 'pending', description: '' });
  const [errors, setErrors] = useState({});
  const update = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.customer.trim()) e.customer = 'Required';
    if (!form.amount || isNaN(parseFloat(form.amount))) e.amount = 'Valid amount required';
    if (!form.dueDate) e.dueDate = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const inputStyle = (f) => ({ backgroundColor: 'transparent', borderColor: errors[f] ? '#D48E8A' : theme.border.primary, color: theme.text.primary });
  const lbl = "text-xs font-semibold uppercase block mb-1.5";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 w-full sm:w-[440px] border-l shadow-2xl flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <div>
            <p className="text-xs" style={{ color: theme.text.muted }}>{isEdit ? 'EDIT INVOICE' : 'NEW INVOICE'}</p>
            <h2 className="font-semibold" style={{ color: theme.text.primary }}>{isEdit ? invoice.id : 'Create Invoice'}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className={lbl} style={{ color: theme.text.muted }}>Customer / Company *</label>
            <input value={form.customer} onChange={e => update('customer', e.target.value)} placeholder="Jumia Ghana" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('customer')} />
            {errors.customer && <p className="text-xs text-red-500 mt-1">{errors.customer}</p>}
          </div>
          <div>
            <label className={lbl} style={{ color: theme.text.muted }}>Description</label>
            <textarea value={form.description || ''} onChange={e => update('description', e.target.value)} rows={2} placeholder="Monthly service invoice..." className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent resize-none" style={{ borderColor: theme.border.primary, color: theme.text.primary }} />
          </div>
          <div>
            <label className={lbl} style={{ color: theme.text.muted }}>Amount (GH₵) *</label>
            <input type="number" value={form.amount} onChange={e => update('amount', e.target.value)} placeholder="0.00" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('amount')} />
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Invoice Date</label>
              <input type="date" value={form.date} onChange={e => update('date', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('date')} />
            </div>
            <div>
              <label className={lbl} style={{ color: theme.text.muted }}>Due Date *</label>
              <input type="date" value={form.dueDate} onChange={e => update('dueDate', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('dueDate')} />
              {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
            </div>
          </div>
          <div>
            <label className={lbl} style={{ color: theme.text.muted }}>Status</label>
            <div className="flex gap-2">
              {[['pending', '#D4AA5A'], ['paid', '#81C995'], ['overdue', '#D48E8A']].map(([s, c]) => (
                <button key={s} onClick={() => update('status', s)} className="flex-1 py-2.5 rounded-xl text-sm capitalize" style={{ backgroundColor: form.status === s ? `${c}15` : theme.bg.tertiary, color: form.status === s ? c : theme.text.muted, border: `1px solid ${form.status === s ? `${c}40` : theme.border.primary}` }}>{s}</button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={() => { if (validate()) onSave(form); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
            {isEdit ? 'Save Changes' : 'Create Invoice'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const AccountingPage = ({
  activeSubMenu, loading, setShowExport,
  txnSearch: _txnSearch, setTxnSearch: _setTxnSearch,
  txnStatusFilter: _txnStatusFilter, setTxnStatusFilter: _setTxnStatusFilter,
  txnSort: _txnSort, setTxnSort: _setTxnSort,
  filteredTransactions: _filteredTransactions,
  invSearch: _invSearch, setInvSearch: _setInvSearch,
  invStatusFilter: _invStatusFilter, setInvStatusFilter: _setInvStatusFilter,
  filteredInvoices: _filteredInvoices,
  addToast,
}) => {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState(transactionsData);
  const [invoices, setInvoices] = useState(invoicesData);
  const [txnSearch, setTxnSearch] = useState('');
  const [txnStatusFilter, setTxnStatusFilter] = useState('all');
  const [txnSort, setTxnSort] = useState({ field: 'date', dir: 'desc' });
  const [invSearch, setInvSearch] = useState('');
  const [invStatusFilter, setInvStatusFilter] = useState('all');
  const [showNewTxn, setShowNewTxn] = useState(false);
  const [editTxn, setEditTxn] = useState(null);
  const [showInvDrawer, setShowInvDrawer] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = !txnSearch || t.description.toLowerCase().includes(txnSearch.toLowerCase()) || t.customer.toLowerCase().includes(txnSearch.toLowerCase()) || t.id.toLowerCase().includes(txnSearch.toLowerCase());
      const matchStatus = txnStatusFilter === 'all' || t.status === txnStatusFilter;
      return matchSearch && matchStatus;
    }).sort((a, b) => {
      const av = a[txnSort.field] ?? '';
      const bv = b[txnSort.field] ?? '';
      return txnSort.dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
    });
  }, [transactions, txnSearch, txnStatusFilter, txnSort]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(i => {
      const matchSearch = !invSearch || i.customer.toLowerCase().includes(invSearch.toLowerCase()) || i.id.toLowerCase().includes(invSearch.toLowerCase());
      const matchStatus = invStatusFilter === 'all' || i.status === invStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [invoices, invSearch, invStatusFilter]);

  const totalRevenue = transactions.filter(t => t.type === 'credit' && t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const pendingCOD = transactions.filter(t => t.status === 'pending').reduce((s, t) => s + t.amount, 0);
  const paidInvoices = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0);

  const handleSaveTxn = (form) => {
    if (form.id) {
      setTransactions(prev => prev.map(t => t.id === form.id ? { ...t, ...form, amount: parseFloat(form.amount) } : t));
      addToast?.({ type: 'success', message: `Transaction ${form.id} updated` });
    } else {
      const newId = `TXN-${String(transactions.length + 1).padStart(3, '0')}`;
      setTransactions(prev => [{ ...form, id: newId, amount: form.type === 'debit' ? -Math.abs(parseFloat(form.amount)) : parseFloat(form.amount) }, ...prev]);
      addToast?.({ type: 'success', message: `Transaction recorded: ${newId}` });
    }
    setShowNewTxn(false);
    setEditTxn(null);
  };

  const handleSaveInvoice = (form) => {
    if (form.id) {
      setInvoices(prev => prev.map(i => i.id === form.id ? { ...i, ...form, amount: parseFloat(form.amount) } : i));
      addToast?.({ type: 'success', message: `Invoice ${form.id} updated` });
    } else {
      const newId = `INV-${String(invoices.length + 1).padStart(3, '0')}`;
      setInvoices(prev => [{ ...form, id: newId, amount: parseFloat(form.amount) }, ...prev]);
      addToast?.({ type: 'success', message: `Invoice ${newId} created` });
    }
    setShowInvDrawer(false);
    setEditInvoice(null);
  };

  const handleDelete = () => {
    if (deleteConfirm?.type === 'txn') {
      setTransactions(prev => prev.filter(t => t.id !== deleteConfirm.item.id));
      addToast?.({ type: 'warning', message: `Transaction ${deleteConfirm.item.id} deleted` });
    } else {
      setInvoices(prev => prev.filter(i => i.id !== deleteConfirm.item.id));
      addToast?.({ type: 'warning', message: `Invoice ${deleteConfirm.item.id} deleted` });
    }
    setDeleteConfirm(null);
  };

  const markInvoicePaid = (inv) => {
    setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'paid' } : i));
    addToast?.({ type: 'success', message: `Invoice ${inv.id} marked as paid` });
  };

  const sortTxnFn = (field) => setTxnSort(prev => ({ field, dir: prev.field === field && prev.dir === 'asc' ? 'desc' : 'asc' }));

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Accounting</h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Transactions'}</p>
        </div>
        <button onClick={() => setShowExport?.(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
          <Download size={16} /> Export
        </button>
      </div>

      {(!activeSubMenu || activeSubMenu === 'Transactions') && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Total Revenue" value={`GH₵ ${(totalRevenue / 1000).toFixed(1)}K`} change="18.7%" changeType="up" icon={DollarSign} theme={theme} loading={loading} />
            <MetricCard title="Pending" value={`GH₵ ${(pendingCOD / 1000).toFixed(1)}K`} icon={Banknote} theme={theme} loading={loading} />
            <MetricCard title="Paid Invoices" value={`GH₵ ${(paidInvoices / 1000).toFixed(1)}K`} change="12.5%" changeType="up" icon={TrendingUp} theme={theme} loading={loading} />
            <MetricCard title="Transactions" value={transactions.length.toLocaleString()} icon={Receipt} theme={theme} loading={loading} />
          </div>

          {/* Header + New Txn */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border flex-1" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <Search size={16} style={{ color: theme.icon.muted }} />
              <input value={txnSearch} onChange={e => setTxnSearch(e.target.value)} placeholder="Search transactions..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: theme.text.primary }} />
              {txnSearch && <button onClick={() => setTxnSearch('')} style={{ color: theme.text.muted }}><X size={16} /></button>}
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
              {[['all', 'All'], ['completed', 'Completed'], ['pending', 'Pending']].map(([v, l]) => (
                <button key={v} onClick={() => setTxnStatusFilter(v)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: txnStatusFilter === v ? theme.accent.primary : 'transparent', color: txnStatusFilter === v ? theme.accent.contrast : theme.text.muted }}>{l}</button>
              ))}
            </div>
            <button onClick={() => setShowNewTxn(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
              <Plus size={16} /> Record
            </button>
          </div>

          <p className="text-xs" style={{ color: theme.text.muted }}>{filteredTransactions.length} of {transactions.length} transactions</p>

          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    {[['id', 'TXN ID'], ['date', 'Date', 'hidden md:table-cell'], ['description', 'Description', 'hidden lg:table-cell'], ['customer', 'Customer'], ['amount', 'Amount']].map(([field, label, hide]) => (
                      <th key={field} onClick={() => sortTxnFn(field)} className={`text-left p-4 text-xs font-semibold uppercase cursor-pointer select-none ${hide || ''}`} style={{ color: txnSort.field === field ? theme.accent.primary : theme.text.muted }}>
                        <span className="flex items-center gap-1">{label}{txnSort.field === field && (txnSort.dir === 'asc' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />)}</span>
                      </th>
                    ))}
                    <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                    <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(t => (
                    <tr key={t.id} className="hover:bg-white/5" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                      <td className="p-4"><span className="font-mono text-sm" style={{ color: theme.text.primary }}>{t.id}</span></td>
                      <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{t.date}</span></td>
                      <td className="p-4 hidden lg:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{t.description}</span></td>
                      <td className="p-4"><span style={{ color: theme.text.primary }}>{t.customer}</span></td>
                      <td className="p-4">
                        <span className={`font-medium ${t.amount < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                          {t.amount < 0 ? '-' : '+'}GH₵ {Math.abs(t.amount).toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4"><StatusBadge status={t.status} /></td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => setEditTxn(t)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.accent.primary }} title="Edit"><Edit size={14} /></button>
                          <button onClick={() => setDeleteConfirm({ type: 'txn', item: t })} className="p-1.5 rounded-lg hover:bg-white/5 text-red-400" title="Delete"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredTransactions.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-sm" style={{ color: theme.text.muted }}>No transactions found</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeSubMenu === 'Invoices' && (
        <>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl border flex-1" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <Search size={16} style={{ color: theme.icon.muted }} />
              <input value={invSearch} onChange={e => setInvSearch(e.target.value)} placeholder="Search invoices..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: theme.text.primary }} />
              {invSearch && <button onClick={() => setInvSearch('')} style={{ color: theme.text.muted }}><X size={16} /></button>}
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
              {[['all', 'All'], ['paid', 'Paid'], ['pending', 'Pending'], ['overdue', 'Overdue']].map(([v, l]) => (
                <button key={v} onClick={() => setInvStatusFilter(v)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: invStatusFilter === v ? theme.accent.primary : 'transparent', color: invStatusFilter === v ? theme.accent.contrast : theme.text.muted }}>{l}</button>
              ))}
            </div>
            <button onClick={() => { setEditInvoice(null); setShowInvDrawer(true); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
              <Plus size={16} /> Create Invoice
            </button>
          </div>

          <p className="text-xs" style={{ color: theme.text.muted }}>{filteredInvoices.length} of {invoices.length} invoices</p>

          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Invoice</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Date</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Due Date</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Amount</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                  <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map(inv => (
                  <tr key={inv.id} className="hover:bg-white/5" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <td className="p-4"><span className="font-mono text-sm" style={{ color: theme.text.primary }}>{inv.id}</span></td>
                    <td className="p-4"><span style={{ color: theme.text.primary }}>{inv.customer}</span></td>
                    <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{inv.date}</span></td>
                    <td className="p-4 hidden md:table-cell">
                      <span className={`text-sm ${inv.status === 'overdue' ? 'text-red-400 font-medium' : ''}`} style={{ color: inv.status !== 'overdue' ? theme.text.muted : undefined }}>{inv.dueDate}</span>
                    </td>
                    <td className="p-4"><span className="font-medium" style={{ color: theme.text.primary }}>GH₵ {inv.amount.toLocaleString()}</span></td>
                    <td className="p-4"><StatusBadge status={inv.status} /></td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {inv.status !== 'paid' && (
                          <button onClick={() => markInvoicePaid(inv)} className="p-1.5 rounded-lg hover:bg-white/5 text-emerald-400" title="Mark Paid"><CheckCircle size={14} /></button>
                        )}
                        <button onClick={() => { setEditInvoice(inv); setShowInvDrawer(true); }} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.accent.primary }} title="Edit"><Edit size={14} /></button>
                        <button onClick={() => setDeleteConfirm({ type: 'inv', item: inv })} className="p-1.5 rounded-lg hover:bg-white/5 text-red-400" title="Delete"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredInvoices.length === 0 && <tr><td colSpan={7} className="p-8 text-center text-sm" style={{ color: theme.text.muted }}>No invoices found</td></tr>}
              </tbody>
            </table>
          </div>
        </>
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
                  <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} labelStyle={{ color: theme.text.primary }} formatter={v => `GH₵ ${v.toLocaleString()}`} />
                  <Bar dataKey="standard" stackId="a" fill={theme.chart?.stone || '#78716C'} name="Standard" />
                  <Bar dataKey="express" stackId="a" fill={theme.chart?.amber || '#D4AA5A'} name="Express" />
                  <Bar dataKey="rush" stackId="a" fill={theme.chart?.coral || '#D48E8A'} name="Rush" />
                  <Bar dataKey="economy" stackId="a" fill={theme.chart?.green || '#81C995'} radius={[4, 4, 0, 0]} name="Economy" />
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
                  <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} labelStyle={{ color: theme.text.primary }} />
                  <Line type="monotone" dataKey="accra" stroke={theme.chart?.blue || '#7EA8C9'} strokeWidth={2} name="Accra Mall" />
                  <Line type="monotone" dataKey="achimota" stroke={theme.chart?.green || '#81C995'} strokeWidth={2} name="Achimota Mall" />
                  <Line type="monotone" dataKey="kotoka" stroke={theme.chart?.amber || '#D4AA5A'} strokeWidth={2} name="Kotoka T3" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Invoice Aging</h3>
              <div className="space-y-3">
                {[['Paid', invoices.filter(i => i.status === 'paid').length, '#81C995'], ['Pending', invoices.filter(i => i.status === 'pending').length, '#D4AA5A'], ['Overdue', invoices.filter(i => i.status === 'overdue').length, '#D48E8A']].map(([label, count, color]) => (
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
                {[['Daily Revenue Report', Calendar, "Today's revenue summary"], ['Monthly Summary', FileText, 'Full month financial overview'], ['COD Collection Report', Banknote, 'Cash on delivery reconciliation'], ['Partner Billing', Briefcase, 'Partner invoice generation'], ['Tax Report', Receipt, 'VAT and tax breakdown'], ['Expense Report', CreditCard, 'Operational expenses']].map(([name, Icon, desc]) => (
                  <div key={name} className="p-3 rounded-xl border flex items-center gap-3" style={{ borderColor: theme.border.primary }}>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accent.light }}><Icon size={16} style={{ color: theme.accent.primary }} /></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{name}</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{desc}</p>
                    </div>
                    <button onClick={() => addToast?.({ type: 'success', message: `Generating ${name}...` })} className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary }}>Generate</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {(showNewTxn || editTxn) && (
        <NewTransactionModal
          onClose={() => { setShowNewTxn(false); setEditTxn(null); }}
          onSave={handleSaveTxn}
          theme={theme}
        />
      )}
      {(showInvDrawer) && (
        <InvoiceDrawer
          invoice={editInvoice}
          onClose={() => { setShowInvDrawer(false); setEditInvoice(null); }}
          onSave={handleSaveInvoice}
          theme={theme}
        />
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setDeleteConfirm(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-sm rounded-2xl border p-6 space-y-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>Delete {deleteConfirm.type === 'txn' ? 'Transaction' : 'Invoice'}?</h3>
            <p className="text-sm" style={{ color: theme.text.muted }}>Remove <span className="font-mono font-semibold" style={{ color: theme.text.primary }}>{deleteConfirm.item.id}</span> permanently?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: '#D48E8A', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
