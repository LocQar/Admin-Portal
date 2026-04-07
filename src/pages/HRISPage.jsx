import React, { useState, useMemo } from 'react';
import {
  UserPlus, UserMinus, Users, CalendarDays, Eye, X, Search,
  CheckCircle2, Circle, FileText, Shield, ClipboardList,
  ChevronDown, Download, RotateCcw,
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard } from '../components/ui';
import { onboardingData, offboardingData, alumniData, staffData } from '../constants/mockDataPart2';

// ── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `GH₵ ${Number(n).toLocaleString('en-GH')}`;

const daysUntil = (dateStr) => {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return Math.ceil((new Date(dateStr) - today) / 86400000);
};

const checklistProgress = (cl) => {
  const vals = Object.values(cl);
  return Math.round((vals.filter(Boolean).length / vals.length) * 100);
};

const docsSubmitted = (docs) => docs.filter(d => d.status === 'submitted').length;

const EXIT_TYPE_COLORS = {
  resignation:  { bg: '#F59E0B15', text: '#D97706' },
  termination:  { bg: '#EF444415', text: '#DC2626' },
  retirement:   { bg: '#8B5CF615', text: '#7C3AED' },
  contract_end: { bg: '#3B82F615', text: '#2563EB' },
};

const EXIT_REASON_LABELS = {
  career_growth: 'Career Growth',
  compensation:  'Compensation',
  culture:       'Culture',
  relocation:    'Relocation',
  performance:   'Performance',
  contract_end:  'Contract End',
  retirement:    'Retirement',
  other:         'Other',
};

// ── Progress bar ─────────────────────────────────────────────────────────────
function ProgressPill({ pct }) {
  const color = pct >= 80 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444';
  return (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 rounded-full overflow-hidden" style={{ background: '#00000015' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 4 }} />
      </div>
      <span style={{ color, fontSize: 12, fontWeight: 600 }}>{pct}%</span>
    </div>
  );
}

// ── Overlay + Drawer shell ────────────────────────────────────────────────────
function Drawer({ width = 480, onClose, title, subtitle, children, footer }) {
  const { theme } = useTheme();
  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />
      <div className="fixed right-0 top-0 h-full z-50 flex flex-col" style={{ width, background: theme.bg.card, borderLeft: `1px solid ${theme.border.primary}`, boxShadow: '-8px 0 32px rgba(0,0,0,0.15)' }}>
        <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
          <div>
            <p style={{ color: theme.text.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>HRIS</p>
            <h2 style={{ color: theme.text.primary, fontWeight: 700, fontSize: 16, marginTop: 2 }}>{title}</h2>
            {subtitle && <p style={{ color: theme.text.muted, fontSize: 12, marginTop: 2 }}>{subtitle}</p>}
          </div>
          <button onClick={onClose} style={{ color: theme.text.muted, padding: 6, borderRadius: 8 }}><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
        {footer && <div style={{ borderTop: `1px solid ${theme.border.primary}` }}>{footer}</div>}
      </div>
    </>
  );
}

// ── Onboarding Detail Drawer ──────────────────────────────────────────────────
const CHECKLIST_LABELS = {
  contractSigned:       'Contract Signed',
  idVerified:           'ID Verified (Ghana Card)',
  bankDetailsSubmitted: 'Bank Details Submitted',
  ssnitFormSubmitted:   'SSNIT Form Submitted',
  equipmentIssued:      'Equipment Issued',
  systemAccessGranted:  'System Access Granted',
  inductionCompleted:   'Induction Completed',
  trainingCompleted:    'Training Completed',
};

const TERMINALS   = ['Achimota Mall', 'Accra Mall', 'Kotoka T3', 'Junction Mall', 'West Hills Mall', 'All'];
const TEAMS       = ['Management', 'Operations', 'Field', 'Support'];
const PRESET_ROLES = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'AGENT', 'SUPPORT', 'VIEWER'];

// ── RoleSelect — preset + custom roles ───────────────────────────────────────
function RoleSelect({ value, onChange, customRoles = [], onAddCustomRole, style }) {
  const { theme } = useTheme();
  const [adding, setAdding] = useState(false);
  const [newRole, setNewRole] = useState('');
  const allRoles = [...PRESET_ROLES, ...customRoles];

  const confirm = () => {
    const trimmed = newRole.trim().toUpperCase().replace(/\s+/g, '_');
    if (!trimmed) return;
    if (!allRoles.includes(trimmed)) onAddCustomRole(trimmed);
    onChange(trimmed);
    setAdding(false);
    setNewRole('');
  };

  if (adding) {
    return (
      <div className="flex gap-2">
        <input
          autoFocus
          value={newRole}
          onChange={e => setNewRole(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') confirm(); if (e.key === 'Escape') { setAdding(false); setNewRole(''); } }}
          placeholder="e.g. COURIER_LEAD"
          className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none"
          style={{ ...style, textTransform: 'uppercase' }}
        />
        <button onClick={confirm} className="px-3 py-2 rounded-xl text-sm font-medium text-white" style={{ background: '#4F46E5' }}>Add</button>
        <button onClick={() => { setAdding(false); setNewRole(''); }} className="px-3 py-2 rounded-xl text-sm" style={{ color: theme.text.muted }}>✕</button>
      </div>
    );
  }

  return (
    <select value={value}
      onChange={e => e.target.value === '__custom__' ? setAdding(true) : onChange(e.target.value)}
      className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
      style={style}>
      {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
      <option disabled style={{ color: theme.border.primary }}>──────────</option>
      <option value="__custom__">+ Add custom role…</option>
    </select>
  );
}

function OnboardingDrawer({ record, onClose, onUpdate, addToast, customRoles = [], onAddCustomRole }) {
  const { theme } = useTheme();
  const [drawerTab, setDrawerTab] = useState('Checklist');
  const [emp, setEmp] = useState(record);

  const toggleCheck = (key) => {
    const updated = { ...emp, checklist: { ...emp.checklist, [key]: !emp.checklist[key] } };
    setEmp(updated);
    onUpdate(updated);
    addToast({ type: 'success', message: `${CHECKLIST_LABELS[key]} marked ${updated.checklist[key] ? 'complete' : 'incomplete'}` });
  };

  const markDoc = (idx) => {
    const docs = emp.documents.map((d, i) => i === idx ? { ...d, status: 'submitted', uploadedAt: '2026-03-04' } : d);
    const updated = { ...emp, documents: docs };
    setEmp(updated);
    onUpdate(updated);
    addToast({ type: 'success', message: `${emp.documents[idx].type} marked as submitted` });
  };

  const saveAccess = () => {
    onUpdate(emp);
    addToast({ type: 'success', message: 'Access setup saved successfully' });
  };

  const tabBtn = (t) => (
    <button key={t} onClick={() => setDrawerTab(t)}
      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{ background: drawerTab === t ? theme.bg.card : 'transparent', color: drawerTab === t ? theme.text.primary : theme.text.muted, boxShadow: drawerTab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}
    >{t}</button>
  );

  const pct = checklistProgress(emp.checklist);

  return (
    <Drawer width={480} onClose={onClose} title={`Onboarding — ${emp.name}`} subtitle={`${emp.role} · Starts ${emp.startDate}`}>
      {/* Employee header */}
      <div className="p-5" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white" style={{ background: '#4F46E5' }}>{emp.avatar}</div>
          <div>
            <p style={{ color: theme.text.primary, fontWeight: 600 }}>{emp.name}</p>
            <p style={{ color: theme.text.muted, fontSize: 12 }}>{emp.email} · {emp.phone}</p>
          </div>
        </div>
        <ProgressPill pct={pct} />
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 p-3" style={{ borderBottom: `1px solid ${theme.border.primary}`, background: theme.bg.input }}>
        {['Checklist', 'Documents', 'Access Setup'].map(tabBtn)}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {drawerTab === 'Checklist' && Object.entries(emp.checklist).map(([key, done]) => (
          <button key={key} onClick={() => toggleCheck(key)}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
            style={{ background: done ? '#10B98108' : theme.bg.input, border: `1.5px solid ${done ? '#10B98130' : theme.border.primary}` }}>
            {done
              ? <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
              : <Circle size={18} style={{ color: theme.text.muted, flexShrink: 0 }} />}
            <span style={{ color: done ? '#10B981' : theme.text.secondary, fontWeight: 500, fontSize: 13 }}>{CHECKLIST_LABELS[key]}</span>
          </button>
        ))}

        {drawerTab === 'Documents' && emp.documents.map((doc, i) => (
          <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: theme.bg.input, border: `1.5px solid ${theme.border.primary}` }}>
            <div className="flex items-center gap-2">
              <FileText size={15} style={{ color: theme.text.muted }} />
              <span style={{ color: theme.text.primary, fontSize: 13, fontWeight: 500 }}>{doc.type}</span>
            </div>
            <div className="flex items-center gap-2">
              {doc.status === 'submitted'
                ? <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: '#10B98115', color: '#10B981' }}><CheckCircle2 size={10} /> Submitted</span>
                : <button onClick={() => markDoc(i)} className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ background: `${theme.accent?.primary ?? '#4F46E5'}18`, color: theme.accent?.primary ?? '#4F46E5' }}>Mark Submitted</button>}
              {doc.uploadedAt && <span style={{ color: theme.text.muted, fontSize: 11 }}>{doc.uploadedAt}</span>}
            </div>
          </div>
        ))}

        {drawerTab === 'Access Setup' && (
          <div className="space-y-4">
            <div>
              <p style={{ color: theme.text.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Role</p>
              <RoleSelect value={emp.access.role} onChange={v => setEmp({ ...emp, access: { ...emp.access, role: v } })}
                customRoles={customRoles} onAddCustomRole={onAddCustomRole}
                style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary, outline: 'none' }} />
            </div>
            {[
              { label: 'Terminal', key: 'terminal', options: TERMINALS },
              { label: 'Team', key: 'team', options: TEAMS },
            ].map(({ label, key, options }) => (
              <div key={key}>
                <p style={{ color: theme.text.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label}</p>
                <select
                  value={emp.access[key]}
                  onChange={e => setEmp({ ...emp, access: { ...emp.access, [key]: e.target.value } })}
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
                >
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div>
              <p style={{ color: theme.text.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Courier Card No.</p>
              <input value={emp.access.cardNo ?? ''} onChange={e => setEmp({ ...emp, access: { ...emp.access, cardNo: e.target.value } })}
                placeholder="e.g. CRD-016" className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: theme.bg.input, border: `1.5px solid ${theme.border.primary}` }}>
              <div>
                <p style={{ color: theme.text.primary, fontSize: 13, fontWeight: 500 }}>System Access</p>
                <p style={{ color: theme.text.muted, fontSize: 12 }}>Portal login enabled</p>
              </div>
              <button onClick={() => setEmp({ ...emp, access: { ...emp.access, systemAccess: !emp.access.systemAccess } })}
                className="w-11 h-6 rounded-full transition-all relative"
                style={{ background: emp.access.systemAccess ? '#10B981' : theme.border.primary }}>
                <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all" style={{ left: emp.access.systemAccess ? 22 : 2 }} />
              </button>
            </div>
            <button onClick={saveAccess} className="w-full py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: theme.accent?.primary ?? '#4F46E5' }}>
              Save Access Setup
            </button>
          </div>
        )}
      </div>
    </Drawer>
  );
}

// ── Offboarding Detail Drawer ─────────────────────────────────────────────────
const OFB_CHECKLIST_LABELS = {
  equipmentReturned:      'Equipment Returned',
  accessRevoked:          'System Access Revoked',
  handoverCompleted:      'Handover Completed',
  finalPayslipGenerated:  'Final Payslip Generated',
  clearanceSigned:        'Clearance Form Signed',
  exitInterviewDone:      'Exit Interview Done',
};

const REASON_CATEGORIES = ['career_growth', 'compensation', 'culture', 'relocation', 'performance', 'contract_end', 'retirement', 'other'];

function OffboardingDrawer({ record, onClose, onUpdate, onComplete, addToast }) {
  const { theme } = useTheme();
  const [drawerTab, setDrawerTab] = useState('Checklist');
  const [emp, setEmp] = useState(record);

  const toggleCheck = (key) => {
    const updated = { ...emp, checklist: { ...emp.checklist, [key]: !emp.checklist[key] } };
    setEmp(updated);
    onUpdate(updated);
    addToast({ type: 'success', message: `${OFB_CHECKLIST_LABELS[key]} marked ${updated.checklist[key] ? 'complete' : 'pending'}` });
  };

  const saveInterview = () => {
    const updated = { ...emp, exitInterview: { ...emp.exitInterview, conductedBy: 'Admin', conductedAt: new Date().toISOString().slice(0, 10) } };
    setEmp(updated);
    onUpdate(updated);
    addToast({ type: 'success', message: 'Exit interview saved' });
  };

  const markSettlementProcessed = () => {
    const updated = { ...emp, settlement: { ...emp.settlement, status: 'processing' } };
    setEmp(updated);
    onUpdate(updated);
    addToast({ type: 'success', message: 'Settlement marked as processing' });
  };

  const markSettlementPaid = () => {
    const updated = { ...emp, settlement: { ...emp.settlement, status: 'paid' } };
    setEmp(updated);
    onUpdate(updated);
    addToast({ type: 'success', message: 'Settlement marked as paid' });
  };

  const allChecklistDone = Object.values(emp.checklist).every(Boolean);

  const done = Object.values(emp.checklist).filter(Boolean).length;
  const total = Object.keys(emp.checklist).length;

  const tabBtn = (t) => (
    <button key={t} onClick={() => setDrawerTab(t)}
      className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
      style={{ background: drawerTab === t ? theme.bg.card : 'transparent', color: drawerTab === t ? theme.text.primary : theme.text.muted, boxShadow: drawerTab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}
    >{t}</button>
  );

  const exitC = EXIT_TYPE_COLORS[emp.exitType] ?? EXIT_TYPE_COLORS.resignation;
  const days = daysUntil(emp.exitDate);

  return (
    <Drawer width={500} onClose={onClose} title={`Offboarding — ${emp.name}`} subtitle={`${emp.role} · ${emp.team}`}>
      {/* Employee header */}
      <div className="p-5" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-base" style={{ background: exitC.text }}>{emp.name[0]}</div>
            <div>
              <p style={{ color: theme.text.primary, fontWeight: 600 }}>{emp.name}</p>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium capitalize mt-0.5" style={{ background: exitC.bg, color: exitC.text }}>{emp.exitType.replace('_', ' ')}</span>
            </div>
          </div>
          <div className="text-right">
            <p style={{ color: days < 7 ? '#EF4444' : theme.text.muted, fontSize: 12, fontWeight: 600 }}>
              {days > 0 ? `${days} days left` : 'Today'}
            </p>
            <p style={{ color: theme.text.muted, fontSize: 11 }}>{emp.exitDate}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span style={{ color: theme.text.muted, fontSize: 12 }}>{done}/{total} tasks complete</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#00000015' }}>
            <div style={{ width: `${Math.round(done / total * 100)}%`, height: '100%', background: done === total ? '#10B981' : '#F59E0B', borderRadius: 4 }} />
          </div>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-1 p-3" style={{ borderBottom: `1px solid ${theme.border.primary}`, background: theme.bg.input }}>
        {['Checklist', 'Exit Interview', 'Settlement'].map(tabBtn)}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        {drawerTab === 'Checklist' && Object.entries(emp.checklist).map(([key, done]) => (
          <button key={key} onClick={() => toggleCheck(key)}
            className="w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left"
            style={{ background: done ? '#10B98108' : theme.bg.input, border: `1.5px solid ${done ? '#10B98130' : theme.border.primary}` }}>
            {done
              ? <CheckCircle2 size={18} style={{ color: '#10B981', flexShrink: 0 }} />
              : <Circle size={18} style={{ color: theme.text.muted, flexShrink: 0 }} />}
            <span style={{ color: done ? '#10B981' : theme.text.secondary, fontWeight: 500, fontSize: 13 }}>{OFB_CHECKLIST_LABELS[key]}</span>
          </button>
        ))}

        {drawerTab === 'Exit Interview' && (
          <div className="space-y-4">
            <div>
              <p style={{ color: theme.text.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Reason Category</p>
              <select value={emp.exitInterview.reasonCategory}
                onChange={e => setEmp({ ...emp, exitInterview: { ...emp.exitInterview, reasonCategory: e.target.value } })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}>
                {REASON_CATEGORIES.map(r => <option key={r} value={r}>{EXIT_REASON_LABELS[r]}</option>)}
              </select>
            </div>
            <div>
              <p style={{ color: theme.text.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Feedback / Notes</p>
              <textarea rows={4} value={emp.exitInterview.feedback}
                onChange={e => setEmp({ ...emp, exitInterview: { ...emp.exitInterview, feedback: e.target.value } })}
                placeholder="Employee's comments and observations…"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
                style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
            </div>
            <div>
              <p style={{ color: theme.text.secondary, fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Rehire Eligible?</p>
              <div className="flex gap-3">
                {[{ v: true, label: 'Yes', c: '#10B981' }, { v: false, label: 'No', c: '#EF4444' }].map(({ v, label, c }) => (
                  <button key={label} onClick={() => setEmp({ ...emp, exitInterview: { ...emp.exitInterview, rehireEligible: v } })}
                    className="flex-1 py-2 rounded-xl border text-sm font-medium transition-all"
                    style={{
                      background: emp.exitInterview.rehireEligible === v ? `${c}18` : 'transparent',
                      borderColor: emp.exitInterview.rehireEligible === v ? c : theme.border.primary,
                      color: emp.exitInterview.rehireEligible === v ? c : theme.text.secondary,
                    }}>{label}</button>
                ))}
              </div>
            </div>
            <button onClick={saveInterview} className="w-full py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: theme.accent?.primary ?? '#4F46E5' }}>
              Save Interview
            </button>
          </div>
        )}

        {drawerTab === 'Settlement' && (() => {
          const s = emp.settlement;
          const statusColor = { pending: '#F59E0B', processing: '#3B82F6', paid: '#10B981' }[s.status] ?? '#6B7280';
          return (
            <div className="space-y-4">
              {[
                { label: 'Last Working Day', value: s.lastWorkingDay },
                { label: 'Leave Days Balance', value: `${s.leaveDaysBalance} days` },
                { label: 'Leave Payout', value: fmt(s.leavePayout) },
                { label: 'Pro-Rata Salary', value: fmt(s.proRataSalary) },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between items-center py-2" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <span style={{ color: theme.text.muted, fontSize: 13 }}>{label}</span>
                  <span style={{ color: theme.text.primary, fontWeight: 500, fontSize: 13 }}>{value}</span>
                </div>
              ))}
              <div className="p-4 rounded-2xl text-center" style={{ background: `${theme.accent?.primary ?? '#4F46E5'}10`, border: `1.5px solid ${theme.accent?.primary ?? '#4F46E5'}25` }}>
                <p style={{ color: theme.text.muted, fontSize: 12, marginBottom: 4 }}>Total Settlement</p>
                <p style={{ color: theme.accent?.primary ?? '#4F46E5', fontWeight: 800, fontSize: 26 }}>{fmt(s.totalSettlement)}</p>
                <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize" style={{ background: `${statusColor}18`, color: statusColor }}>{s.status}</span>
              </div>
              {s.status === 'pending' && (
                <button onClick={markSettlementProcessed} className="w-full py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: '#F59E0B' }}>
                  Mark as Processing
                </button>
              )}
              {s.status === 'processing' && (
                <button onClick={markSettlementPaid} className="w-full py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: '#10B981' }}>
                  Mark as Paid
                </button>
              )}
              {allChecklistDone && s.status === 'paid' && (
                <button onClick={() => onComplete(emp)} className="w-full py-2.5 rounded-xl text-sm font-medium text-white mt-2" style={{ background: '#4F46E5' }}>
                  Complete Offboarding → Move to Alumni
                </button>
              )}
            </div>
          );
        })()}
      </div>
    </Drawer>
  );
}

// ── Alumni Drawer ─────────────────────────────────────────────────────────────
function AlumniDrawer({ record, onClose, onRehire, onUpdateNotes, theme }) {
  const [notes, setNotes] = useState(record.notes);
  const [notesDirty, setNotesDirty] = useState(false);
  const joinDate  = new Date(record.joinDate);
  const exitDate  = new Date(record.exitDate);
  const months    = Math.round((exitDate - joinDate) / (1000 * 60 * 60 * 24 * 30));
  const exitC     = EXIT_TYPE_COLORS[record.exitType] ?? EXIT_TYPE_COLORS.resignation;

  return (
    <Drawer width={420} onClose={onClose} title={record.name} subtitle={`${record.role} · ${record.team}`}
      footer={
        <div className="p-5 flex gap-3">
          <button onClick={() => onRehire(record)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: '#4F46E5' }}>
            <RotateCcw size={14} /> Re-hire
          </button>
          {notesDirty && (
            <button onClick={() => { onUpdateNotes(record.id, notes); setNotesDirty(false); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: '#10B981' }}>
              Save Notes
            </button>
          )}
          <button onClick={onClose} className={notesDirty ? 'py-2.5 px-4 rounded-xl border text-sm' : 'flex-1 py-2.5 rounded-xl border text-sm'} style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Close</button>
        </div>
      }>
      <div className="p-5 space-y-4">
        {/* Avatar + info */}
        <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: theme.bg.input }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-lg" style={{ background: '#6B7280' }}>{record.name[0]}</div>
          <div>
            <p style={{ color: theme.text.primary, fontWeight: 600, fontSize: 15 }}>{record.name}</p>
            <p style={{ color: theme.text.muted, fontSize: 12 }}>{record.role} · {record.terminal}</p>
            <p style={{ color: theme.text.muted, fontSize: 12 }}>Served {months} months</p>
          </div>
        </div>

        {/* Dates */}
        {[{ label: 'Joined', value: record.joinDate }, { label: 'Left', value: record.exitDate }].map(({ label, value }) => (
          <div key={label} className="flex justify-between py-2" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
            <span style={{ color: theme.text.muted, fontSize: 13 }}>{label}</span>
            <span style={{ color: theme.text.primary, fontSize: 13, fontWeight: 500 }}>{value}</span>
          </div>
        ))}

        {/* Exit details */}
        <div className="flex justify-between py-2" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
          <span style={{ color: theme.text.muted, fontSize: 13 }}>Exit Type</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize" style={{ background: exitC.bg, color: exitC.text }}>{record.exitType.replace('_', ' ')}</span>
        </div>
        <div className="flex justify-between py-2" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
          <span style={{ color: theme.text.muted, fontSize: 13 }}>Exit Reason</span>
          <span style={{ color: theme.text.secondary, fontSize: 13 }}>{EXIT_REASON_LABELS[record.exitReason] ?? record.exitReason}</span>
        </div>
        <div className="flex justify-between py-2" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
          <span style={{ color: theme.text.muted, fontSize: 13 }}>Rehire Eligible</span>
          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: record.rehireEligible ? '#10B98115' : '#EF444415', color: record.rehireEligible ? '#10B981' : '#EF4444' }}>
            {record.rehireEligible ? 'Eligible' : 'Not Eligible'}
          </span>
        </div>

        {/* Notes */}
        <div>
          <p style={{ color: theme.text.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Notes</p>
          <textarea rows={3} value={notes} onChange={e => { setNotes(e.target.value); setNotesDirty(true); }}
            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
            style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
        </div>
      </div>
    </Drawer>
  );
}

// ── Initiate Offboarding Modal ────────────────────────────────────────────────
function InitiateExitModal({ onClose, onConfirm, staffData, theme }) {
  const [form, setForm] = useState({ employeeId: '', exitDate: '', exitType: 'resignation' });
  const active = (staffData ?? []).filter(s => s.status === 'active');
  const selected = active.find(s => String(s.id) === String(form.employeeId));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="rounded-2xl p-6 w-96 shadow-2xl" style={{ background: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
        <div className="flex items-center justify-between mb-4">
          <h3 style={{ color: theme.text.primary, fontWeight: 700, fontSize: 16 }}>Initiate Offboarding</h3>
          <button onClick={onClose} style={{ color: theme.text.muted }}><X size={16} /></button>
        </div>
        <div className="space-y-3">
          <div>
            <p style={{ color: theme.text.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Employee</p>
            <select value={form.employeeId} onChange={e => setForm({ ...form, employeeId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}>
              <option value="">Select employee…</option>
              {active.map(s => <option key={s.id} value={s.id}>{s.name} — {s.role}</option>)}
            </select>
          </div>
          <div>
            <p style={{ color: theme.text.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Exit Date</p>
            <input type="date" value={form.exitDate} onChange={e => setForm({ ...form, exitDate: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
          </div>
          <div>
            <p style={{ color: theme.text.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Exit Type</p>
            <select value={form.exitType} onChange={e => setForm({ ...form, exitType: e.target.value })}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}>
              {['resignation', 'termination', 'retirement', 'contract_end'].map(t => (
                <option key={t} value={t}>{t.replace('_', ' ')}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={() => selected && onConfirm(selected, form)} disabled={!form.employeeId || !form.exitDate}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-40"
            style={{ background: '#EF4444' }}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ── New Hire Drawer ───────────────────────────────────────────────────────────
function NewHireDrawer({ onClose, onSave, customRoles = [], onAddCustomRole }) {
  const { theme } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'AGENT', team: 'Field', terminal: 'West Hills Mall', startDate: '' });
  const [err, setErr] = useState({});
  const upd = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErr(p => ({ ...p, [f]: false })); };
  const is = (f) => ({ background: theme.bg.input, borderColor: err[f] ? '#EF4444' : theme.border.primary, color: theme.text.primary, outline: 'none' });

  const handleSave = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.email.trim()) e.email = true;
    if (!form.phone.trim()) e.phone = true;
    if (!form.startDate) e.startDate = true;
    setErr(e);
    if (Object.keys(e).length) return;
    onSave({
      id: `ONB-${Date.now()}`,
      ...form,
      hiredBy: 'Admin',
      avatar: form.name[0].toUpperCase(),
      checklist: { contractSigned: false, idVerified: false, bankDetailsSubmitted: false, ssnitFormSubmitted: false, equipmentIssued: false, systemAccessGranted: false, inductionCompleted: false, trainingCompleted: false },
      documents: [
        { type: 'Ghana Card', status: 'pending', uploadedAt: null },
        { type: 'SSNIT Form', status: 'pending', uploadedAt: null },
        { type: 'Bank Details', status: 'pending', uploadedAt: null },
        { type: 'Employment Contract', status: 'pending', uploadedAt: null },
      ],
      access: { role: form.role, terminal: form.terminal, team: form.team, systemAccess: false, cardNo: null },
    });
    onClose();
  };

  const fields = [
    { key: 'name', label: 'Full Name *', type: 'text', ph: 'Kofi Asante', span: 2 },
    { key: 'email', label: 'Email *', type: 'email', ph: 'kofi.a@locqar.com', span: 2 },
    { key: 'phone', label: 'Phone *', type: 'text', ph: '+233551234567', span: 1 },
    { key: 'startDate', label: 'Start Date *', type: 'date', ph: '', span: 1 },
  ];

  return (
    <Drawer width={460} onClose={onClose} title="Add New Hire" subtitle="Create an onboarding record"
      footer={
        <div className="p-5 flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-1.5 text-white" style={{ background: '#4F46E5' }}>
            <UserPlus size={14} /> Add to Onboarding
          </button>
        </div>
      }>
      <div className="p-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {fields.map(({ key, label, type, ph, span }) => (
            <div key={key} className={span === 2 ? 'col-span-2' : ''}>
              <p style={{ color: theme.text.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label}</p>
              <input type={type} value={form[key]} onChange={e => upd(key, e.target.value)} placeholder={ph}
                className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is(key)} />
              {err[key] && <p className="text-xs mt-1" style={{ color: '#EF4444' }}>Required</p>}
            </div>
          ))}
        </div>
        <div>
          <p style={{ color: theme.text.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Role</p>
          <RoleSelect value={form.role} onChange={v => upd('role', v)} customRoles={customRoles} onAddCustomRole={onAddCustomRole}
            style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary, outline: 'none' }} />
        </div>
        {[{ label: 'Team', key: 'team', options: TEAMS }, { label: 'Terminal', key: 'terminal', options: TERMINALS }].map(({ label, key, options }) => (
          <div key={key}>
            <p style={{ color: theme.text.secondary, fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{label}</p>
            <select value={form[key]} onChange={e => upd(key, e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm"
              style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary, outline: 'none' }}>
              {options.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        ))}
      </div>
    </Drawer>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export const HRISPage = ({ activeSubMenu, loading, addToast }) => {
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState(activeSubMenu || 'Onboarding');
  const [onboarding, setOnboarding] = useState(onboardingData);
  const [offboarding, setOffboarding] = useState(offboardingData);
  const [alumni, setAlumni] = useState(alumniData);
  const [selectedOnboard, setSelectedOnboard] = useState(null);
  const [selectedOffboard, setSelectedOffboard] = useState(null);
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [showInitiateExit, setShowInitiateExit] = useState(false);
  const [showNewHire, setShowNewHire] = useState(false);
  const [customRoles, setCustomRoles] = useState([]);
  const handleAddCustomRole = (role) => setCustomRoles(prev => prev.includes(role) ? prev : [...prev, role]);
  const [search, setSearch] = useState('');
  const [rehireFilter, setRehireFilter] = useState('all');

  React.useEffect(() => { if (activeSubMenu) setActiveTab(activeSubMenu); }, [activeSubMenu]);

  // Metric values
  const nextExitDays = useMemo(() => {
    const days = offboarding.map(e => daysUntil(e.exitDate)).filter(d => d >= 0);
    return days.length ? Math.min(...days) : null;
  }, [offboarding]);

  // Handlers
  const updateOnboard = (updated) => {
    setOnboarding(prev => prev.map(e => e.id === updated.id ? updated : e));
    if (selectedOnboard?.id === updated.id) setSelectedOnboard(updated);
  };

  const updateOffboard = (updated) => {
    setOffboarding(prev => prev.map(e => e.id === updated.id ? updated : e));
    if (selectedOffboard?.id === updated.id) setSelectedOffboard(updated);
  };

  const confirmExit = (employee, form) => {
    const newRecord = {
      id: `OFB-${Date.now()}`,
      employeeId: employee.id,
      name: employee.name,
      role: employee.role,
      terminal: employee.terminal,
      team: employee.team,
      exitDate: form.exitDate,
      exitType: form.exitType,
      initiatedBy: 'John Doe',
      initiatedAt: '2026-03-04',
      status: 'in_progress',
      checklist: { equipmentReturned: false, accessRevoked: false, handoverCompleted: false, finalPayslipGenerated: false, clearanceSigned: false, exitInterviewDone: false },
      exitInterview: { conductedBy: null, conductedAt: null, reasonCategory: 'other', feedback: '', rehireEligible: null },
      settlement: { lastWorkingDay: form.exitDate, leaveDaysBalance: 0, leavePayout: 0, proRataSalary: 0, totalSettlement: 0, status: 'pending' },
    };
    setOffboarding(prev => [newRecord, ...prev]);
    setShowInitiateExit(false);
    addToast({ type: 'success', message: `Offboarding initiated for ${employee.name}` });
  };

  const completeOffboarding = (emp) => {
    setOffboarding(prev => prev.filter(e => e.id !== emp.id));
    setAlumni(prev => [{
      id: `ALM-${Date.now()}`,
      name: emp.name,
      role: emp.role,
      team: emp.team,
      terminal: emp.terminal,
      joinDate: '—',
      exitDate: emp.exitDate,
      exitType: emp.exitType,
      rehireEligible: emp.exitInterview.rehireEligible ?? false,
      exitReason: emp.exitInterview.reasonCategory,
      notes: emp.exitInterview.feedback || '',
    }, ...prev]);
    setSelectedOffboard(null);
    addToast({ type: 'success', message: `${emp.name} moved to Alumni` });
  };

  const updateAlumniNotes = (id, notes) => {
    setAlumni(prev => prev.map(a => a.id === id ? { ...a, notes } : a));
    addToast({ type: 'success', message: 'Notes saved' });
  };

  const handleAddNewHire = (record) => {
    setOnboarding(prev => [record, ...prev]);
    addToast({ type: 'success', message: `${record.name} added to Onboarding` });
  };

  const rehireAlumni = (alum) => {
    const newHire = {
      id: `ONB-${Date.now()}`,
      name: alum.name,
      email: '',
      phone: '',
      role: alum.role,
      team: alum.team,
      terminal: alum.terminal,
      startDate: '',
      hiredBy: 'John Doe',
      avatar: alum.name[0],
      checklist: { contractSigned: false, idVerified: false, bankDetailsSubmitted: false, ssnitFormSubmitted: false, equipmentIssued: false, systemAccessGranted: false, inductionCompleted: false, trainingCompleted: false },
      documents: [
        { type: 'Ghana Card', status: 'pending', uploadedAt: null },
        { type: 'SSNIT Form', status: 'pending', uploadedAt: null },
        { type: 'Bank Details', status: 'pending', uploadedAt: null },
        { type: 'Employment Contract', status: 'pending', uploadedAt: null },
      ],
      access: { role: alum.role, terminal: alum.terminal, team: alum.team, systemAccess: false, cardNo: null },
    };
    setOnboarding(prev => [newHire, ...prev]);
    setSelectedAlumni(null);
    setActiveTab('Onboarding');
    addToast({ type: 'success', message: `${alum.name} moved to Onboarding pipeline` });
  };

  // ── Shared styles ──
  const tableHeader = (cols) => (
    <tr style={{ background: theme.bg.input }}>
      {cols.map(h => <th key={h} className="text-left px-4 py-3" style={{ color: theme.text.muted, fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>)}
    </tr>
  );

  const rowBg = (i) => ({ background: i % 2 === 0 ? 'transparent' : theme.bg.hover, borderTop: `1px solid ${theme.border.primary}` });

  // ── ONBOARDING TAB ──
  const renderOnboarding = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ color: theme.text.primary, fontWeight: 600, fontSize: 15 }}>New Hires ({onboarding.length})</h2>
        <button onClick={() => setShowNewHire(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ background: '#4F46E5' }}>
          <UserPlus size={14} /> Add New Hire
        </button>
      </div>
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: theme.border.primary }}>
        <table className="w-full text-sm">
          <thead>{tableHeader(['Employee', 'Role', 'Terminal', 'Start Date', 'Progress', 'Documents', ''])}</thead>
          <tbody>
            {onboarding.map((emp, i) => {
              const pct = checklistProgress(emp.checklist);
              const docs = docsSubmitted(emp.documents);
              return (
                <tr key={emp.id} style={rowBg(i)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#4F46E5' }}>{emp.avatar}</div>
                      <div>
                        <p style={{ color: theme.text.primary, fontWeight: 500 }}>{emp.name}</p>
                        <p style={{ color: theme.text.muted, fontSize: 11 }}>{emp.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#3B82F615', color: '#2563EB' }}>{emp.role}</span></td>
                  <td className="px-4 py-3" style={{ color: theme.text.secondary, fontSize: 13 }}>{emp.terminal}</td>
                  <td className="px-4 py-3" style={{ color: theme.text.secondary, fontSize: 13 }}>
                    <div className="flex items-center gap-1"><CalendarDays size={11} style={{ color: theme.text.muted }} />{emp.startDate}</div>
                  </td>
                  <td className="px-4 py-3"><ProgressPill pct={pct} /></td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium" style={{ color: docs === emp.documents.length ? '#10B981' : theme.text.muted }}>{docs}/{emp.documents.length} submitted</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedOnboard(emp)} className="p-1.5 rounded-lg" style={{ color: theme.text.muted, background: theme.bg.input }} title="View"><Eye size={14} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── OFFBOARDING TAB ──
  const renderOffboarding = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 style={{ color: theme.text.primary, fontWeight: 600, fontSize: 15 }}>Exit Pipeline ({offboarding.length})</h2>
        <button onClick={() => setShowInitiateExit(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: '#EF444418', color: '#DC2626', border: '1px solid #EF444430' }}>
          <UserMinus size={14} /> Initiate Offboarding
        </button>
      </div>
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: theme.border.primary }}>
        <table className="w-full text-sm">
          <thead>{tableHeader(['Employee', 'Role', 'Exit Date', 'Type', 'Checklist', 'Interview', 'Settlement', ''])}</thead>
          <tbody>
            {offboarding.map((emp, i) => {
              const done = Object.values(emp.checklist).filter(Boolean).length;
              const total = Object.keys(emp.checklist).length;
              const days = daysUntil(emp.exitDate);
              const exitC = EXIT_TYPE_COLORS[emp.exitType] ?? EXIT_TYPE_COLORS.resignation;
              const settColor = { pending: '#F59E0B', processing: '#3B82F6', paid: '#10B981' }[emp.settlement.status] ?? '#6B7280';
              return (
                <tr key={emp.id} style={rowBg(i)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: exitC.text }}>{emp.name[0]}</div>
                      <div>
                        <p style={{ color: theme.text.primary, fontWeight: 500 }}>{emp.name}</p>
                        <p style={{ color: theme.text.muted, fontSize: 11 }}>{emp.terminal}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: theme.text.secondary, fontSize: 13 }}>{emp.role}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <CalendarDays size={11} style={{ color: days < 7 ? '#EF4444' : theme.text.muted }} />
                      <span style={{ color: days < 7 ? '#EF4444' : theme.text.secondary, fontSize: 13 }}>{emp.exitDate}</span>
                    </div>
                    <p style={{ color: theme.text.muted, fontSize: 11 }}>{days > 0 ? `${days}d left` : 'Today'}</p>
                  </td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize" style={{ background: exitC.bg, color: exitC.text }}>{emp.exitType.replace('_', ' ')}</span></td>
                  <td className="px-4 py-3"><span style={{ color: done === total ? '#10B981' : theme.text.muted, fontSize: 13 }}>{done}/{total}</span></td>
                  <td className="px-4 py-3">
                    {emp.exitInterview.conductedBy
                      ? <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#10B98115', color: '#10B981' }}>Done</span>
                      : <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: '#F59E0B15', color: '#D97706' }}>Pending</span>}
                  </td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize" style={{ background: `${settColor}15`, color: settColor }}>{emp.settlement.status}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedOffboard(emp)} className="p-1.5 rounded-lg" style={{ color: theme.text.muted, background: theme.bg.input }} title="Manage"><Eye size={14} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── ALUMNI TAB ──
  const filteredAlumni = useMemo(() => {
    let list = alumni;
    if (rehireFilter === 'eligible') list = list.filter(a => a.rehireEligible);
    if (rehireFilter === 'not_eligible') list = list.filter(a => !a.rehireEligible);
    if (search.trim()) list = list.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.role.toLowerCase().includes(search.toLowerCase()));
    return list;
  }, [alumni, rehireFilter, search]);

  const renderAlumni = () => (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-48">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.muted }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search alumni…"
            className="w-full pl-9 pr-4 py-2 rounded-xl border text-sm outline-none"
            style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
        </div>
        {[{ v: 'all', l: 'All' }, { v: 'eligible', l: 'Rehire Eligible' }, { v: 'not_eligible', l: 'Not Eligible' }].map(({ v, l }) => (
          <button key={v} onClick={() => setRehireFilter(v)}
            className="px-3 py-2 rounded-xl text-xs font-medium border"
            style={{ background: rehireFilter === v ? (theme.accent?.primary ?? '#4F46E5') : 'transparent', color: rehireFilter === v ? '#fff' : theme.text.secondary, borderColor: rehireFilter === v ? 'transparent' : theme.border.primary }}>
            {l}
          </button>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: theme.border.primary }}>
        <table className="w-full text-sm">
          <thead>{tableHeader(['Name', 'Role', 'Team', 'Joined', 'Left', 'Exit Type', 'Rehire', ''])}</thead>
          <tbody>
            {filteredAlumni.map((alum, i) => {
              const exitC = EXIT_TYPE_COLORS[alum.exitType] ?? EXIT_TYPE_COLORS.resignation;
              return (
                <tr key={alum.id} style={rowBg(i)}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#6B7280' }}>{alum.name[0]}</div>
                      <span style={{ color: theme.text.primary, fontWeight: 500 }}>{alum.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: theme.text.secondary, fontSize: 13 }}>{alum.role}</td>
                  <td className="px-4 py-3" style={{ color: theme.text.secondary, fontSize: 13 }}>{alum.team}</td>
                  <td className="px-4 py-3" style={{ color: theme.text.muted, fontSize: 13 }}>{alum.joinDate}</td>
                  <td className="px-4 py-3" style={{ color: theme.text.muted, fontSize: 13 }}>{alum.exitDate}</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize" style={{ background: exitC.bg, color: exitC.text }}>{alum.exitType.replace('_', ' ')}</span></td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: alum.rehireEligible ? '#10B98115' : '#EF444415', color: alum.rehireEligible ? '#10B981' : '#EF4444' }}>
                      {alum.rehireEligible ? 'Eligible' : 'Not Eligible'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setSelectedAlumni(alum)} className="p-1.5 rounded-lg" style={{ color: theme.text.muted, background: theme.bg.input }}><Eye size={14} /></button>
                      {alum.rehireEligible && (
                        <button onClick={() => rehireAlumni(alum)} className="px-2.5 py-1 rounded-lg text-xs font-medium" style={{ background: `${theme.accent?.primary ?? '#4F46E5'}18`, color: theme.accent?.primary ?? '#4F46E5' }}>
                          Re-hire
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  // ── Render ──
  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>HRIS</h1>
          <p style={{ color: theme.text.muted, fontSize: 13 }}>Human Resources — Onboarding & Offboarding</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
          <Download size={15} /> Export
        </button>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <MetricCard title="In Onboarding" value={onboarding.length} icon={UserPlus} loading={loading} />
        <MetricCard title="In Offboarding" value={offboarding.length} icon={UserMinus} loading={loading} />
        <MetricCard title="Days to Next Exit" value={nextExitDays !== null ? `${nextExitDays}d` : '—'} icon={CalendarDays} loading={loading} />
        <MetricCard title="Alumni" value={alumni.length} icon={Users} loading={loading} />
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-6 p-1 rounded-xl w-fit" style={{ background: theme.bg.input }}>
        {['Onboarding', 'Offboarding', 'Alumni'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
            style={{ background: activeTab === tab ? theme.bg.card : 'transparent', color: activeTab === tab ? theme.text.primary : theme.text.muted, boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Onboarding'  && renderOnboarding()}
      {activeTab === 'Offboarding' && renderOffboarding()}
      {activeTab === 'Alumni'      && renderAlumni()}

      {/* Drawers */}
      {selectedOnboard && (
        <OnboardingDrawer record={selectedOnboard} onClose={() => setSelectedOnboard(null)} onUpdate={updateOnboard} addToast={addToast} customRoles={customRoles} onAddCustomRole={handleAddCustomRole} />
      )}
      {selectedOffboard && (
        <OffboardingDrawer record={selectedOffboard} onClose={() => setSelectedOffboard(null)} onUpdate={updateOffboard} onComplete={completeOffboarding} addToast={addToast} />
      )}
      {selectedAlumni && (
        <AlumniDrawer record={selectedAlumni} onClose={() => setSelectedAlumni(null)} onRehire={rehireAlumni} onUpdateNotes={updateAlumniNotes} theme={theme} />
      )}

      {/* New hire drawer */}
      {showNewHire && (
        <NewHireDrawer onClose={() => setShowNewHire(false)} onSave={handleAddNewHire} customRoles={customRoles} onAddCustomRole={handleAddCustomRole} />
      )}

      {/* Initiate exit modal */}
      {showInitiateExit && (
        <InitiateExitModal onClose={() => setShowInitiateExit(false)} onConfirm={confirmExit} staffData={staffData} theme={theme} />
      )}
    </div>
  );
};
