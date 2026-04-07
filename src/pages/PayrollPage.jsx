import React, { useState, useMemo } from 'react';
import {
  Wallet, Users2, Clock, Shield, Eye, Printer, X, Search,
  CheckCircle2, AlertTriangle, CalendarDays, UserCheck,
  Package, Truck, Download, Plus, Minus, ArrowRight,
  FileSpreadsheet, BadgeCheck, StickyNote, ChevronRight,
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard } from '../components/ui';
import { salaryConfig, payPeriodsData, payrollRecordsData, staffData, driversData, couriersData } from '../constants/mockData';

// ============ GHANA TAX CALCULATIONS ============
const GH_TAX_BANDS = [
  { max: 365,      rate: 0.00 },
  { max: 1000,     rate: 0.05 },
  { max: 6000,     rate: 0.10 },
  { max: 10000,    rate: 0.175 },
  { max: 20000,    rate: 0.25 },
  { max: Infinity, rate: 0.30 },
];

function calcAnnualTax(annualGross) {
  let tax = 0, remaining = annualGross, prevMax = 0;
  for (const band of GH_TAX_BANDS) {
    const bandSize = band.max === Infinity ? remaining : band.max - prevMax;
    const taxable = Math.min(remaining, bandSize);
    tax += taxable * band.rate;
    remaining -= taxable;
    prevMax = band.max;
    if (remaining <= 0) break;
  }
  return tax;
}

function calcDeductions(monthlyGross) {
  if (monthlyGross <= 0) return { ssnitEmployee: 0, ssnitEmployer: 0, incomeTax: 0, totalDeductions: 0, netPay: 0 };
  const ssnitEmployee = Math.round(monthlyGross * 0.055);
  const ssnitEmployer = Math.round(monthlyGross * 0.13);
  const taxable = monthlyGross - ssnitEmployee;
  const incomeTax = Math.round(calcAnnualTax(taxable * 12) / 12);
  const totalDeductions = ssnitEmployee + incomeTax;
  return { ssnitEmployee, ssnitEmployer, incomeTax, totalDeductions, netPay: monthlyGross - totalDeductions };
}

function buildLiveRecord(employee, type, deliveryCount = 0) {
  let baseGross = 0, deliveryEarnings = 0, bonus = 0;
  if (type === 'staff') {
    baseGross = salaryConfig.staff[employee.id]?.base ?? 0;
  } else if (type === 'courier') {
    const { ratePerDelivery, bonus: bonusCfg } = salaryConfig.couriers;
    deliveryEarnings = deliveryCount * ratePerDelivery;
    bonus = deliveryCount >= bonusCfg.threshold ? bonusCfg.amount : 0;
  } else if (type === 'driver') {
    baseGross = salaryConfig.drivers.baseSalary;
    deliveryEarnings = deliveryCount * salaryConfig.drivers.ratePerDelivery;
  }
  const grossPay = baseGross + deliveryEarnings + bonus;
  return {
    employeeId: employee.id,
    employeeName: employee.name,
    employeeType: type,
    role: type === 'staff' ? employee.role : type === 'courier' ? 'Courier' : 'Driver',
    terminal: employee.terminal ?? employee.zone ?? '—',
    deliveryCount, baseGross, deliveryEarnings, bonus, grossPay,
    ...calcDeductions(grossPay),
  };
}

// ============ HELPERS ============
const fmt = (n) => `GH₵ ${Number(n).toLocaleString('en-GH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

const TYPE_ICONS  = { staff: UserCheck, courier: Package, driver: Truck };
const TYPE_COLORS = {
  staff:   { bg: '#3B82F615', text: '#3B82F6' },
  courier: { bg: '#F59E0B15', text: '#D97706' },
  driver:  { bg: '#10B98115', text: '#059669' },
};
const STATUS_COLORS = {
  draft:    { bg: '#F59E0B15', text: '#D97706' },
  approved: { bg: '#3B82F615', text: '#3B82F6' },
  paid:     { bg: '#10B98115', text: '#059669' },
};

const LIVE_COURIER_DELIVERIES = { 1: 87, 2: 65, 3: 0, 4: 92, 5: 83, 6: 0 };
const LIVE_DRIVER_DELIVERIES  = { 1: 12, 2: 8,  3: 0, 4: 15 };

// Workflow steps
const WORKFLOW_STEPS = ['Generated', 'Under Review', 'Approved', 'Disbursed'];
const getWorkflowStep = (status) =>
  status === 'paid' ? 3 : status === 'approved' ? 2 : 1;

// ============ ADJUSTMENT MODAL ============
function AdjustmentModal({ target, onSave, onClose, theme }) {
  const [kind, setKind] = useState('bonus');
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  const handleSave = () => {
    const amt = parseFloat(amount);
    if (!desc.trim() || isNaN(amt) || amt <= 0) return;
    onSave({ id: Date.now(), kind, desc: desc.trim(), amount: amt });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="rounded-2xl p-6 w-96 shadow-2xl" style={{ background: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: theme.text.primary, fontWeight: 700, fontSize: 15 }}>
            Adjust: {target.employeeName}
          </h3>
          <button onClick={onClose} style={{ color: theme.text.muted }}><X size={16} /></button>
        </div>

        {/* Kind toggle */}
        <div className="flex gap-2 mb-4 p-1 rounded-xl" style={{ background: theme.bg.input }}>
          {[{ id: 'bonus', label: 'Bonus / Allowance', color: '#10B981' }, { id: 'deduction', label: 'Deduction', color: '#EF4444' }].map(k => (
            <button
              key={k.id}
              onClick={() => setKind(k.id)}
              className="flex-1 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: kind === k.id ? k.color : 'transparent',
                color: kind === k.id ? '#fff' : theme.text.secondary,
              }}
            >
              {kind === k.id && (k.id === 'bonus' ? <Plus size={11} className="inline mr-1" /> : <Minus size={11} className="inline mr-1" />)}
              {k.label}
            </button>
          ))}
        </div>

        {/* Description */}
        <label style={{ color: theme.text.muted, fontSize: 12, display: 'block', marginBottom: 4 }}>Description</label>
        <input
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="e.g. Performance bonus, Loan repayment…"
          className="w-full px-3 py-2 rounded-xl border text-sm outline-none mb-3"
          style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
        />

        {/* Amount */}
        <label style={{ color: theme.text.muted, fontSize: 12, display: 'block', marginBottom: 4 }}>Amount (GH₵)</label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0.00"
          min="0"
          className="w-full px-3 py-2 rounded-xl border text-sm outline-none mb-5"
          style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!desc.trim() || !amount || parseFloat(amount) <= 0}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{
              background: kind === 'bonus' ? '#10B981' : '#EF4444',
              opacity: (!desc.trim() || !amount || parseFloat(amount) <= 0) ? 0.5 : 1,
            }}
          >
            Add Adjustment
          </button>
        </div>
      </div>
    </div>
  );
}

// ============ PAYSLIP DRAWER ============
function PayslipDrawer({ record, adjustments, period, onClose, addToast, theme }) {
  if (!record) return null;
  const TypeIcon = TYPE_ICONS[record.employeeType] ?? UserCheck;
  const adjs = adjustments[`${record.employeeType}-${record.employeeId}`] ?? [];

  const row = (label, value, accent = false, muted = false) => (
    <div className="flex justify-between items-center py-1.5">
      <span style={{ color: muted ? theme.text.muted : theme.text.secondary, fontSize: 13 }}>{label}</span>
      <span style={{ color: accent ? theme.accent?.primary ?? '#4F46E5' : theme.text.primary, fontWeight: accent ? 700 : 500, fontSize: 13 }}>{value}</span>
    </div>
  );
  const divider = () => <div style={{ height: 1, background: theme.border.primary, margin: '8px 0' }} />;

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.3)' }} onClick={onClose} />
      <div
        className="fixed right-0 top-0 h-full z-50 flex flex-col overflow-hidden"
        style={{ width: 420, background: theme.bg.card, borderLeft: `1px solid ${theme.border.primary}`, boxShadow: '-8px 0 32px rgba(0,0,0,0.15)' }}
      >
        <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
          <div>
            <p style={{ color: theme.text.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Payslip</p>
            <h2 style={{ color: theme.text.primary, fontWeight: 700, fontSize: 16, marginTop: 2 }}>{period?.label ?? ''}</h2>
          </div>
          <button onClick={onClose} style={{ color: theme.text.muted, padding: 6, borderRadius: 8 }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Employee */}
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: theme.bg.input }}>
            <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-base" style={{ background: TYPE_COLORS[record.employeeType]?.text ?? '#6366F1' }}>
              {record.employeeName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p style={{ color: theme.text.primary, fontWeight: 600, fontSize: 15 }}>{record.employeeName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <TypeIcon size={12} style={{ color: TYPE_COLORS[record.employeeType]?.text }} />
                <p style={{ color: theme.text.muted, fontSize: 12 }}>{record.role} · {period?.label}</p>
              </div>
            </div>
          </div>

          {/* Earnings */}
          <div className="p-4 rounded-2xl" style={{ background: theme.bg.input }}>
            <p style={{ color: theme.text.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 8 }}>Earnings</p>
            {record.baseGross > 0 && row('Base Salary', fmt(record.baseGross))}
            {record.deliveryEarnings > 0 && row(`Delivery Pay (${record.deliveryCount} × ${record.employeeType === 'courier' ? 'GH₵12' : 'GH₵8'})`, fmt(record.deliveryEarnings))}
            {record.bonus > 0 && row('Performance Bonus', fmt(record.bonus))}
            {adjs.filter(a => a.kind === 'bonus').map(a => (
              <div key={a.id} className="flex justify-between items-center py-1.5">
                <span style={{ color: '#10B981', fontSize: 13 }}>+ {a.desc}</span>
                <span style={{ color: '#10B981', fontWeight: 500, fontSize: 13 }}>{fmt(a.amount)}</span>
              </div>
            ))}
            {adjs.filter(a => a.kind === 'deduction').map(a => (
              <div key={a.id} className="flex justify-between items-center py-1.5">
                <span style={{ color: '#EF4444', fontSize: 13 }}>- {a.desc}</span>
                <span style={{ color: '#EF4444', fontWeight: 500, fontSize: 13 }}>{fmt(a.amount)}</span>
              </div>
            ))}
            {divider()}
            {row('Gross Pay', fmt(record.grossPay))}
          </div>

          {/* Deductions */}
          <div className="p-4 rounded-2xl" style={{ background: theme.bg.input }}>
            <p style={{ color: theme.text.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 8 }}>Deductions</p>
            {row('SSNIT Employee (5.5%)', fmt(record.ssnitEmployee))}
            {row('Income Tax (GRA)', fmt(record.incomeTax))}
            {divider()}
            {row('Total Deductions', fmt(record.totalDeductions))}
          </div>

          {/* Employer cost */}
          <div className="p-4 rounded-2xl" style={{ background: theme.bg.input }}>
            <p style={{ color: theme.text.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 8 }}>Employer Contribution</p>
            {row('SSNIT Employer (13%)', fmt(record.ssnitEmployer), false, true)}
          </div>

          {/* Net */}
          <div className="p-4 rounded-2xl text-center" style={{ background: `${theme.accent?.primary ?? '#4F46E5'}12`, border: `1.5px solid ${theme.accent?.primary ?? '#4F46E5'}30` }}>
            <p style={{ color: theme.text.muted, fontSize: 12, marginBottom: 4 }}>Net Pay</p>
            <p style={{ color: theme.accent?.primary ?? '#4F46E5', fontWeight: 800, fontSize: 28 }}>{fmt(record.netPay)}</p>
          </div>
        </div>

        <div className="p-5 flex gap-3" style={{ borderTop: `1px solid ${theme.border.primary}` }}>
          <button
            onClick={() => addToast({ type: 'success', message: 'Payslip sent to printer' })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium"
            style={{ background: theme.accent?.primary ?? '#4F46E5', color: '#fff' }}
          >
            <Printer size={15} /> Print
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}

// ============ MAIN PAGE ============
export const PayrollPage = ({ activeSubMenu, loading, addToast }) => {
  const { theme } = useTheme();

  const [selectedPeriodId, setSelectedPeriodId] = useState('PP-2026-03');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [payslipRecord, setPayslipRecord] = useState(null);
  const [periods, setPeriods] = useState(payPeriodsData);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [approvalNote, setApprovalNote] = useState('');
  const [activeTab, setActiveTab] = useState(activeSubMenu || 'Overview');
  const [adjustments, setAdjustments] = useState({});     // key: `type-id` → [{id, kind, desc, amount}]
  const [adjustTarget, setAdjustTarget] = useState(null); // employee to adjust

  React.useEffect(() => { if (activeSubMenu) setActiveTab(activeSubMenu); }, [activeSubMenu]);

  // ── Live records for current period ──
  const currentPeriodRecords = useMemo(() => {
    if (selectedPeriodId !== 'PP-2026-03') {
      return payrollRecordsData.filter(r => r.periodId === selectedPeriodId);
    }
    return [
      ...(staffData ?? []).map(s => buildLiveRecord(s, 'staff')),
      ...(couriersData ?? []).map(c => buildLiveRecord(c, 'courier', LIVE_COURIER_DELIVERIES[c.id] ?? 0)),
      ...(driversData ?? []).map(d => buildLiveRecord(d, 'driver', LIVE_DRIVER_DELIVERIES[d.id] ?? 0)),
    ];
  }, [selectedPeriodId]);

  // ── Apply per-employee adjustments ──
  const adjustedRecords = useMemo(() => currentPeriodRecords.map(r => {
    const key = `${r.employeeType}-${r.employeeId}`;
    const adjs = adjustments[key] ?? [];
    if (!adjs.length) return r;
    const adjTotal = adjs.reduce((s, a) => a.kind === 'bonus' ? s + a.amount : s - a.amount, 0);
    const newGross = Math.max(0, r.grossPay + adjTotal);
    return { ...r, grossPay: newGross, ...calcDeductions(newGross) };
  }), [currentPeriodRecords, adjustments]);

  // ── Displayed records (filtered) ──
  const displayedRecords = useMemo(() => {
    let list = adjustedRecords;
    if (typeFilter !== 'all') list = list.filter(r => r.employeeType === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r => r.employeeName.toLowerCase().includes(q) || r.role.toLowerCase().includes(q));
    }
    return list;
  }, [adjustedRecords, typeFilter, search]);

  const currentPeriod = periods.find(p => p.id === 'PP-2026-03') ?? periods[0];
  const liveTotalNet = useMemo(() => adjustedRecords.reduce((s, r) => s + r.netPay, 0), [adjustedRecords]);
  const liveSsnit = useMemo(() => adjustedRecords.reduce((s, r) => s + r.ssnitEmployer, 0), [adjustedRecords]);
  const draftCount = periods.filter(p => p.status === 'draft').length;
  const totalCount = adjustedRecords.length;
  const paidCount = adjustedRecords.filter(r => r.netPay > 0).length;

  // ── Type breakdown ──
  const typeBreakdown = useMemo(() => ['staff', 'courier', 'driver'].map(t => {
    const recs = adjustedRecords.filter(r => r.employeeType === t);
    return { type: t, count: recs.length, gross: recs.reduce((s, r) => s + r.grossPay, 0), net: recs.reduce((s, r) => s + r.netPay, 0) };
  }), [adjustedRecords]);

  // ── Handlers ──
  const handleApprove = (periodId) => {
    setPeriods(prev => prev.map(p =>
      p.id === periodId ? { ...p, status: 'approved', approvedBy: 'John Doe', approvedAt: new Date().toISOString().split('T')[0], approvalNote } : p
    ));
    setConfirmDialog(null);
    setApprovalNote('');
    addToast({ type: 'success', message: 'Payroll period approved for disbursement' });
  };

  const handleMarkPaid = (periodId) => {
    setPeriods(prev => prev.map(p =>
      p.id === periodId ? { ...p, status: 'paid', paidAt: new Date().toISOString().split('T')[0] } : p
    ));
    setConfirmDialog(null);
    addToast({ type: 'success', message: 'Payroll marked as paid — disbursement recorded' });
  };

  const handleAddAdjustment = (adj) => {
    const key = `${adjustTarget.employeeType}-${adjustTarget.employeeId}`;
    setAdjustments(prev => ({ ...prev, [key]: [...(prev[key] ?? []), adj] }));
    setAdjustTarget(null);
    addToast({ type: 'success', message: `${adj.kind === 'bonus' ? 'Bonus' : 'Deduction'} added for ${adjustTarget.employeeName}` });
  };

  const handleExportCSV = () => {
    const headers = ['Employee', 'Type', 'Role', 'Terminal', 'Deliveries', 'Base', 'Delivery Pay', 'Bonus', 'Gross', 'SSNIT (EE)', 'Income Tax', 'Total Deductions', 'Net Pay'];
    const rows = displayedRecords.map(r => [
      r.employeeName, r.employeeType, r.role, r.terminal, r.deliveryCount,
      r.baseGross, r.deliveryEarnings, r.bonus, r.grossPay,
      r.ssnitEmployee, r.incomeTax, r.totalDeductions, r.netPay,
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payroll-${selectedPeriodId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', message: `Exported ${displayedRecords.length} payslips to CSV` });
  };

  const selectedPeriod = periods.find(p => p.id === selectedPeriodId);
  const chartData = [...periods].reverse().map(p => ({ name: p.label.split(' ')[0], net: p.totalNet }));

  // ── Badges ──
  const StatusBadge = ({ status }) => {
    const c = STATUS_COLORS[status] ?? STATUS_COLORS.draft;
    const Icon = status === 'paid' ? BadgeCheck : status === 'approved' ? CheckCircle2 : AlertTriangle;
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize" style={{ background: c.bg, color: c.text }}>
        <Icon size={10} /> {status}
      </span>
    );
  };

  const TypeBadge = ({ type }) => {
    const c = TYPE_COLORS[type] ?? TYPE_COLORS.staff;
    const Icon = TYPE_ICONS[type] ?? UserCheck;
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize" style={{ background: c.bg, color: c.text }}>
        <Icon size={10} /> {type}
      </span>
    );
  };

  // ============ WORKFLOW STEPPER ============
  const renderWorkflowBanner = () => {
    const draftPeriod = periods.find(p => p.status === 'draft' || p.status === 'approved');
    if (!draftPeriod) return null;
    const step = getWorkflowStep(draftPeriod.status);

    return (
      <div className="mb-6 p-5 rounded-2xl border" style={{ background: theme.bg.card, borderColor: theme.border.primary }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p style={{ color: theme.text.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Current Period</p>
            <h3 style={{ color: theme.text.primary, fontWeight: 700, fontSize: 15, marginTop: 2 }}>{draftPeriod.label} Payroll</h3>
          </div>
          <div className="text-right">
            <p style={{ color: theme.text.muted, fontSize: 11 }}>Estimated Net</p>
            <p style={{ color: '#10B981', fontWeight: 700, fontSize: 18 }}>{fmt(liveTotalNet)}</p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-2 mb-4">
          {WORKFLOW_STEPS.map((label, idx) => {
            const done = idx < step;
            const active = idx === step;
            const color = done ? '#10B981' : active ? (theme.accent?.primary ?? '#4F46E5') : theme.text.muted;
            return (
              <React.Fragment key={label}>
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      background: done ? '#10B98115' : active ? `${theme.accent?.primary ?? '#4F46E5'}18` : theme.bg.input,
                      border: `1.5px solid ${done ? '#10B981' : active ? (theme.accent?.primary ?? '#4F46E5') : theme.border.primary}`,
                      color,
                    }}
                  >
                    {done ? <CheckCircle2 size={14} /> : idx + 1}
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <p style={{ color, fontWeight: active ? 700 : 500, fontSize: 12, whiteSpace: 'nowrap' }}>{label}</p>
                    {active && <p style={{ color: theme.text.muted, fontSize: 10 }}>In progress</p>}
                    {done && <p style={{ color: '#10B981', fontSize: 10 }}>Complete</p>}
                  </div>
                </div>
                {idx < WORKFLOW_STEPS.length - 1 && (
                  <ChevronRight size={14} style={{ color: theme.text.muted, shrink: 0 }} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Action row */}
        <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: theme.bg.input }}>
          <div className="flex-1">
            {draftPeriod.status === 'draft' && (
              <p style={{ color: theme.text.secondary, fontSize: 13 }}>
                Review all payslips before approving this period for disbursement.
              </p>
            )}
            {draftPeriod.status === 'approved' && (
              <p style={{ color: theme.text.secondary, fontSize: 13 }}>
                Approved by <strong>{draftPeriod.approvedBy}</strong> on {draftPeriod.approvedAt}. Ready for disbursement.
              </p>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            {draftPeriod.status === 'draft' && (
              <>
                <button
                  onClick={() => { setSelectedPeriodId(draftPeriod.id); setActiveTab('Payslips'); }}
                  className="px-3 py-2 rounded-xl text-xs font-medium border"
                  style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
                >
                  Review Payslips
                </button>
                <button
                  onClick={() => setConfirmDialog({ type: 'approve', periodId: draftPeriod.id, label: draftPeriod.label })}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white"
                  style={{ background: theme.accent?.primary ?? '#4F46E5' }}
                >
                  Approve <ArrowRight size={12} />
                </button>
              </>
            )}
            {draftPeriod.status === 'approved' && (
              <button
                onClick={() => setConfirmDialog({ type: 'pay', periodId: draftPeriod.id, label: draftPeriod.label })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white"
                style={{ background: '#10B981' }}
              >
                Mark Disbursed <ArrowRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ============ OVERVIEW TAB ============
  const renderOverview = () => (
    <div className="space-y-6">
      {/* Workflow banner */}
      {renderWorkflowBanner()}

      {/* Type breakdown */}
      <div className="grid grid-cols-3 gap-4">
        {typeBreakdown.map(({ type, count, gross, net }) => {
          const Icon = TYPE_ICONS[type];
          const c = TYPE_COLORS[type];
          return (
            <div key={type} className="p-4 rounded-2xl border" style={{ background: theme.bg.card, borderColor: theme.border.primary }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: c.bg }}>
                  <Icon size={16} style={{ color: c.text }} />
                </div>
                <p style={{ color: theme.text.secondary, fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{type}s</p>
              </div>
              <p style={{ color: theme.text.muted, fontSize: 11, marginBottom: 2 }}>{count} employees</p>
              <p style={{ color: '#10B981', fontWeight: 700, fontSize: 16 }}>{fmt(net)}</p>
              <p style={{ color: theme.text.muted, fontSize: 11 }}>Gross {fmt(gross)}</p>
            </div>
          );
        })}
      </div>

      {/* Pay periods table */}
      <div>
        <h2 style={{ color: theme.text.primary, fontWeight: 600, fontSize: 15, marginBottom: 12 }}>All Pay Periods</h2>
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: theme.border.primary }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: theme.bg.input }}>
                {['Period', 'Date Range', 'Employees', 'Gross', 'Deductions', 'Net', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3" style={{ color: theme.text.muted, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? 'transparent' : theme.bg.hover, borderTop: `1px solid ${theme.border.primary}` }}>
                  <td className="px-4 py-3" style={{ color: theme.text.primary, fontWeight: 600 }}>{p.label}</td>
                  <td className="px-4 py-3" style={{ color: theme.text.muted, fontSize: 12 }}>
                    <div className="flex items-center gap-1"><CalendarDays size={11} />{p.startDate} – {p.endDate}</div>
                  </td>
                  <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{p.employeeCount}</td>
                  <td className="px-4 py-3" style={{ color: theme.text.primary }}>{fmt(p.totalGross)}</td>
                  <td className="px-4 py-3" style={{ color: '#EF4444' }}>{fmt(p.totalDeductions)}</td>
                  <td className="px-4 py-3" style={{ color: '#10B981', fontWeight: 600 }}>{fmt(p.totalNet)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {p.status === 'draft' && (
                        <button
                          onClick={() => setConfirmDialog({ type: 'approve', periodId: p.id, label: p.label })}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium"
                          style={{ background: `${theme.accent?.primary ?? '#4F46E5'}18`, color: theme.accent?.primary ?? '#4F46E5' }}
                        >Approve</button>
                      )}
                      {p.status === 'approved' && (
                        <button
                          onClick={() => setConfirmDialog({ type: 'pay', periodId: p.id, label: p.label })}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium"
                          style={{ background: '#10B98118', color: '#059669' }}
                        >Mark Paid</button>
                      )}
                      <button
                        onClick={() => { setSelectedPeriodId(p.id); setActiveTab('Payslips'); }}
                        className="p-1.5 rounded-lg"
                        style={{ color: theme.text.muted, background: theme.bg.input }}
                        title="View payslips"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ============ PAYSLIPS TAB ============
  const renderPayslips = () => (
    <div>
      {/* Period selector */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {periods.map(p => (
          <button
            key={p.id}
            onClick={() => setSelectedPeriodId(p.id)}
            className="px-3 py-1.5 rounded-xl text-xs font-medium border transition-all"
            style={{
              background: selectedPeriodId === p.id ? (theme.accent?.primary ?? '#4F46E5') : 'transparent',
              color: selectedPeriodId === p.id ? '#fff' : theme.text.secondary,
              borderColor: selectedPeriodId === p.id ? 'transparent' : theme.border.primary,
            }}
          >{p.label}</button>
        ))}
      </div>

      {/* Search + filters + export */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.muted }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search employees…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border text-sm outline-none"
            style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
          />
        </div>
        {['all', 'staff', 'courier', 'driver'].map(t => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className="px-3 py-2 rounded-xl text-xs font-medium border capitalize"
            style={{
              background: typeFilter === t ? (theme.accent?.primary ?? '#4F46E5') : 'transparent',
              color: typeFilter === t ? '#fff' : theme.text.secondary,
              borderColor: typeFilter === t ? 'transparent' : theme.border.primary,
            }}
          >{t === 'all' ? 'All' : t}</button>
        ))}
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border"
          style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
        >
          <FileSpreadsheet size={13} /> Export CSV
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: theme.border.primary }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: theme.bg.input }}>
              {['Employee', 'Type', 'Role', 'Deliveries', 'Gross', 'SSNIT (EE)', 'Income Tax', 'Net Pay', 'Adj.', ''].map(h => (
                <th key={h} className="text-left px-4 py-3" style={{ color: theme.text.muted, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedRecords.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12" style={{ color: theme.text.muted }}>No employees match your filters</td>
              </tr>
            ) : displayedRecords.map((r, i) => {
              const key = `${r.employeeType}-${r.employeeId}`;
              const adjCount = (adjustments[key] ?? []).length;
              return (
                <tr key={key + i} style={{ background: i % 2 === 0 ? 'transparent' : theme.bg.hover, borderTop: `1px solid ${theme.border.primary}` }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: TYPE_COLORS[r.employeeType]?.text ?? '#6366F1' }}>
                        {r.employeeName[0]}
                      </div>
                      <span style={{ color: theme.text.primary, fontWeight: 500 }}>{r.employeeName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3"><TypeBadge type={r.employeeType} /></td>
                  <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{r.role}</td>
                  <td className="px-4 py-3" style={{ color: theme.text.secondary, fontVariantNumeric: 'tabular-nums' }}>
                    {r.deliveryCount > 0 ? r.deliveryCount : <span style={{ color: theme.text.muted }}>—</span>}
                  </td>
                  <td className="px-4 py-3" style={{ color: theme.text.primary, fontVariantNumeric: 'tabular-nums' }}>{fmt(r.grossPay)}</td>
                  <td className="px-4 py-3" style={{ color: '#EF4444', fontVariantNumeric: 'tabular-nums' }}>{fmt(r.ssnitEmployee)}</td>
                  <td className="px-4 py-3" style={{ color: '#EF4444', fontVariantNumeric: 'tabular-nums' }}>{fmt(r.incomeTax)}</td>
                  <td className="px-4 py-3" style={{ color: '#10B981', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(r.netPay)}</td>
                  <td className="px-4 py-3">
                    {/* Adjustment badge + add button */}
                    <div className="flex items-center gap-1">
                      {adjCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded-full text-xs font-medium" style={{ background: '#F59E0B15', color: '#D97706' }}>
                          {adjCount}
                        </span>
                      )}
                      <button
                        onClick={() => setAdjustTarget(r)}
                        className="p-1 rounded-lg"
                        style={{ color: theme.text.muted, background: theme.bg.input }}
                        title="Add adjustment"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setPayslipRecord(r)}
                      className="p-1.5 rounded-lg"
                      style={{ color: theme.text.muted, background: theme.bg.input }}
                      title="View payslip"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      {displayedRecords.length > 0 && (
        <div className="flex gap-6 mt-3 px-1">
          {[
            { label: 'Total Gross', value: displayedRecords.reduce((s, r) => s + r.grossPay, 0), color: theme.text.primary },
            { label: 'Total Deductions', value: displayedRecords.reduce((s, r) => s + r.totalDeductions, 0), color: '#EF4444' },
            { label: 'Total Net', value: displayedRecords.reduce((s, r) => s + r.netPay, 0), color: '#10B981' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p style={{ color: theme.text.muted, fontSize: 11 }}>{label}</p>
              <p style={{ color, fontWeight: 700, fontSize: 15 }}>{fmt(value)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // ============ PAY PERIODS TAB ============
  const renderPayPeriods = () => (
    <div className="space-y-6">
      <div className="p-5 rounded-2xl border" style={{ background: theme.bg.card, borderColor: theme.border.primary }}>
        <h3 style={{ color: theme.text.primary, fontWeight: 600, marginBottom: 16, fontSize: 14 }}>Net Payroll Trend</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
            <XAxis dataKey="name" tick={{ fill: theme.text.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: theme.text.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `GH₵${(v/1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12, color: theme.text.primary }}
              formatter={v => [fmt(v), 'Net Pay']}
            />
            <Bar dataKey="net" fill={theme.accent?.primary ?? '#4F46E5'} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 style={{ color: theme.text.primary, fontWeight: 600, marginBottom: 12, fontSize: 14 }}>Pay Period History</h3>
        <div className="rounded-2xl overflow-hidden border" style={{ borderColor: theme.border.primary }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: theme.bg.input }}>
                {['Period', 'Date Range', 'Employees', 'Gross', 'Net', 'Status', 'Approved By', 'Paid On', 'Note'].map(h => (
                  <th key={h} className="text-left px-4 py-3" style={{ color: theme.text.muted, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {periods.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? 'transparent' : theme.bg.hover, borderTop: `1px solid ${theme.border.primary}` }}>
                  <td className="px-4 py-3" style={{ color: theme.text.primary, fontWeight: 600 }}>{p.label}</td>
                  <td className="px-4 py-3" style={{ color: theme.text.muted, fontSize: 12 }}>{p.startDate} – {p.endDate}</td>
                  <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{p.employeeCount}</td>
                  <td className="px-4 py-3" style={{ color: theme.text.primary }}>{fmt(p.totalGross)}</td>
                  <td className="px-4 py-3" style={{ color: '#10B981', fontWeight: 600 }}>{fmt(p.totalNet)}</td>
                  <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{p.approvedBy ?? '—'}</td>
                  <td className="px-4 py-3" style={{ color: theme.text.secondary }}>{p.paidAt ?? '—'}</td>
                  <td className="px-4 py-3" style={{ color: theme.text.muted, fontSize: 12, maxWidth: 140 }}>
                    {p.approvalNote ? <span title={p.approvalNote} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><StickyNote size={11} />{p.approvalNote.slice(0, 30)}{p.approvalNote.length > 30 ? '…' : ''}</span> : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ============ CONFIRM DIALOG ============
  const renderConfirm = () => {
    if (!confirmDialog) return null;
    const isApprove = confirmDialog.type === 'approve';
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
        <div className="rounded-2xl p-6 w-96 shadow-2xl" style={{ background: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
          <div className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: isApprove ? '#3B82F615' : '#10B98115' }}>
            {isApprove ? <BadgeCheck size={22} style={{ color: '#3B82F6' }} /> : <CheckCircle2 size={22} style={{ color: '#10B981' }} />}
          </div>
          <h3 style={{ color: theme.text.primary, fontWeight: 700, textAlign: 'center', fontSize: 16, marginBottom: 4 }}>
            {isApprove ? 'Approve Payroll?' : 'Mark as Paid?'}
          </h3>
          <p style={{ color: theme.text.muted, textAlign: 'center', fontSize: 13, marginBottom: 16 }}>
            {isApprove
              ? `Approve ${confirmDialog.label} payroll for disbursement?`
              : `Confirm ${confirmDialog.label} payroll has been disbursed?`}
          </p>

          {isApprove && (
            <div className="mb-4">
              <label style={{ color: theme.text.muted, fontSize: 12, display: 'block', marginBottom: 4 }}>
                Approval Note (optional)
              </label>
              <textarea
                value={approvalNote}
                onChange={e => setApprovalNote(e.target.value)}
                placeholder="Add a note for the record…"
                rows={2}
                className="w-full px-3 py-2 rounded-xl border text-sm outline-none resize-none"
                style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setConfirmDialog(null); setApprovalNote(''); }}
              className="flex-1 py-2.5 rounded-xl border text-sm"
              style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
            >Cancel</button>
            <button
              onClick={() => isApprove ? handleApprove(confirmDialog.periodId) : handleMarkPaid(confirmDialog.periodId)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
              style={{ background: isApprove ? (theme.accent?.primary ?? '#4F46E5') : '#10B981' }}
            >Confirm</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 md:p-6">
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Payroll</h1>
          <p style={{ color: theme.text.muted, fontSize: 13 }}>{currentPeriod?.label} · {currentPeriod?.employeeCount} employees</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm"
          style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
        >
          <Download size={15} /> Export
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Payroll (Month)" value={fmt(liveTotalNet)} icon={Wallet} change="+3.2%" changeType="up" loading={loading} />
        <MetricCard title="Pending Approval" value={draftCount === 0 ? 'None' : `${draftCount} period${draftCount > 1 ? 's' : ''}`} icon={Clock} loading={loading} />
        <MetricCard title="Employees Covered" value={`${paidCount} / ${totalCount}`} icon={Users2} loading={loading} />
        <MetricCard title="SSNIT Liability" value={fmt(liveSsnit)} icon={Shield} loading={loading} />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: theme.bg.input }}>
        {['Overview', 'Payslips', 'Pay Periods'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{
              background: activeTab === tab ? theme.bg.card : 'transparent',
              color: activeTab === tab ? theme.text.primary : theme.text.muted,
              boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
            }}
          >{tab}</button>
        ))}
      </div>

      {activeTab === 'Overview'    && renderOverview()}
      {activeTab === 'Payslips'    && renderPayslips()}
      {activeTab === 'Pay Periods' && renderPayPeriods()}

      <PayslipDrawer
        record={payslipRecord}
        adjustments={adjustments}
        period={selectedPeriod}
        onClose={() => setPayslipRecord(null)}
        addToast={addToast}
        theme={theme}
      />

      {renderConfirm()}

      {adjustTarget && (
        <AdjustmentModal
          target={adjustTarget}
          onSave={handleAddAdjustment}
          onClose={() => setAdjustTarget(null)}
          theme={theme}
        />
      )}
    </div>
  );
};
