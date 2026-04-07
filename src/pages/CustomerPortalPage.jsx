import React, { useState, useMemo } from 'react';
import {
  Package, MapPin, Truck, Grid3X3, Search, X, LogOut, Sun, Moon,
  ChevronRight, ChevronLeft, ChevronDown, Copy, Check, Building2,
  Download, DollarSign, FileText, Eye, EyeOff, Shield, CreditCard,
  Menu, Bell, AlertOctagon, TrendingUp, LayoutDashboard, Settings,
  Clock, Key, ArrowUpRight, RefreshCw, CheckCircle2, Circle,
  Activity, Users, Globe, Mail, Phone, AlertTriangle, Zap,
  Plus, ArrowRight, Warehouse, Inbox, Home as HomeIcon, User, BadgeCheck,
  Upload, FileSpreadsheet, AlertCircle,
  Code2, Link2, Power, Send, RotateCcw, PackageX, ThumbsUp, ThumbsDown, ClipboardCheck,
  HelpCircle,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { StatusBadge } from '../components/ui/Badge';
import { packagesData } from '../constants/mockData';

// ── Mock data ──────────────────────────────────────────────────────────────
const INVOICES = [
  { id: 'INV-2026-003', period: 'Mar 2026', shipments: 48, amount: 2400,  status: 'pending',  dueDate: '2026-04-01', paidDate: null },
  { id: 'INV-2026-002', period: 'Feb 2026', shipments: 61, amount: 3050,  status: 'paid',     dueDate: '2026-03-01', paidDate: '2026-02-28' },
  { id: 'INV-2026-001', period: 'Jan 2026', shipments: 55, amount: 2750,  status: 'paid',     dueDate: '2026-02-01', paidDate: '2026-01-30' },
  { id: 'INV-2025-012', period: 'Dec 2025', shipments: 72, amount: 3600,  status: 'paid',     dueDate: '2026-01-01', paidDate: '2025-12-29' },
  { id: 'INV-2025-011', period: 'Nov 2025', shipments: 39, amount: 1950,  status: 'paid',     dueDate: '2025-12-01', paidDate: '2025-11-28' },
];

const MONTHLY_DATA = [
  { month: 'Aug', shipments: 38, completed: 35 },
  { month: 'Sep', shipments: 44, completed: 41 },
  { month: 'Oct', shipments: 52, completed: 49 },
  { month: 'Nov', shipments: 39, completed: 36 },
  { month: 'Dec', shipments: 72, completed: 70 },
  { month: 'Jan', shipments: 55, completed: 51 },
  { month: 'Feb', shipments: 61, completed: 58 },
  { month: 'Mar', shipments: 48, completed: 44 },
];

const METHOD_DATA = [
  { name: 'Warehouse → Locker', value: 65, color: '#7EA8C9' },
  { name: 'Dropbox → Locker',   value: 25, color: '#B5A0D1' },
  { name: 'Locker → Home',      value: 10, color: '#81C995' },
];

const ACTIVE_DISPATCHES = [
  { id: 'DSP-001', courier: 'Kwesi Asante',   phone: '+233551234567', packages: 4, terminal: 'Achimota Mall', status: 'in_transit', eta: '~2h',    dispatchedAt: '06:30 AM', waybills: ['LQ-2024-00002', 'LQ-2024-00013', 'LQ-2024-00023', 'LQ-2024-00007'] },
  { id: 'DSP-002', courier: 'Kofi Mensah',    phone: '+233559876543', packages: 3, terminal: 'Accra Mall',    status: 'in_transit', eta: '~45 min', dispatchedAt: '07:15 AM', waybills: ['LQ-2024-00006', 'LQ-2024-00022', 'LQ-2024-00025'] },
  { id: 'DSP-003', courier: 'Adjoa Frimpong', phone: '+233542345678', packages: 2, terminal: 'Junction Mall', status: 'arrived',    eta: 'Arrived', dispatchedAt: '05:00 AM', waybills: ['LQ-2024-00010', 'LQ-2024-00021'] },
];

// ── Returns mock data ──────────────────────────────────────────────────────
const RETURN_REASONS = {
  wrong_item:       { label: 'Wrong Item',        color: '#D97706', bg: '#D9770615' },
  damaged:          { label: 'Damaged on Arrival', color: '#EF4444', bg: '#EF444415' },
  not_as_described: { label: 'Not as Described',  color: '#8B5CF6', bg: '#8B5CF615' },
  changed_mind:     { label: 'Changed Mind',       color: '#6B7280', bg: '#6B728015' },
  other:            { label: 'Other',              color: '#6B7280', bg: '#6B728015' },
};
const RETURN_STATUSES = {
  pending:    { label: 'Pending Review', color: '#D97706', bg: '#D9770615' },
  approved:   { label: 'Approved',       color: '#818CF8', bg: '#818CF815' },
  in_transit: { label: 'In Transit',     color: '#8B5CF6', bg: '#8B5CF615' },
  received:   { label: 'Received',       color: '#81C995', bg: '#81C99515' },
  rejected:   { label: 'Rejected',       color: '#EF4444', bg: '#EF444415' },
};
const RETURNS_MOCK = [
  { id: 'RET-2026-001', originalWaybill: 'LQ-2024-00002', customer: 'Ama Darko',      phone: '+233551234567', terminal: 'Achimota Mall',   requestedAt: '2026-03-04', reason: 'wrong_item',       notes: 'Received red shoes, ordered blue.',          value: 250,  status: 'pending',    returnWaybill: null,          timeline: [{ status: 'pending', date: '2026-03-04', note: 'Return requested by customer' }] },
  { id: 'RET-2026-002', originalWaybill: 'LQ-2024-00006', customer: 'Kwabena Mensah', phone: '+233559876543', terminal: 'Accra Mall',       requestedAt: '2026-03-02', reason: 'damaged',          notes: 'Screen cracked on arrival.',                 value: 1200, status: 'in_transit',  returnWaybill: 'LQ-RET-A1B2C3', timeline: [{ status: 'pending', date: '2026-03-02', note: 'Return requested' }, { status: 'approved', date: '2026-03-03', note: 'Approved by operations team' }, { status: 'in_transit', date: '2026-03-04', note: 'Package picked up from locker' }] },
  { id: 'RET-2026-003', originalWaybill: 'LQ-2024-00010', customer: 'Abena Osei',     phone: '+233542345678', terminal: 'Junction Mall',    requestedAt: '2026-02-28', reason: 'not_as_described', notes: 'Product specs don\'t match listing.',         value: 450,  status: 'approved',   returnWaybill: 'LQ-RET-D4E5F6', timeline: [{ status: 'pending', date: '2026-02-28', note: 'Return requested' }, { status: 'approved', date: '2026-03-01', note: 'Approved — customer to drop at locker' }] },
  { id: 'RET-2026-004', originalWaybill: 'LQ-2024-00013', customer: 'Kofi Asante',    phone: '+233201234567', terminal: 'West Hills Mall',  requestedAt: '2026-02-25', reason: 'changed_mind',     notes: '',                                           value: 80,   status: 'received',   returnWaybill: 'LQ-RET-G7H8I9', timeline: [{ status: 'pending', date: '2026-02-25', note: 'Return requested' }, { status: 'approved', date: '2026-02-26', note: 'Approved' }, { status: 'in_transit', date: '2026-02-27', note: 'In transit' }, { status: 'received', date: '2026-02-28', note: 'Received at warehouse' }] },
  { id: 'RET-2026-005', originalWaybill: 'LQ-2024-00015', customer: 'Efua Mensah',    phone: '+233248765432', terminal: 'Kotoka T3',        requestedAt: '2026-03-01', reason: 'wrong_item',       notes: 'Item matches order description per review.',  value: 600,  status: 'rejected',   returnWaybill: null,          timeline: [{ status: 'pending', date: '2026-03-01', note: 'Return requested' }, { status: 'rejected', date: '2026-03-02', note: 'Rejected — item matches order' }] },
  { id: 'RET-2026-006', originalWaybill: 'LQ-2024-00022', customer: 'Yaa Boateng',    phone: '+233274321098', terminal: 'Accra Mall',       requestedAt: '2026-03-05', reason: 'damaged',          notes: 'Packaging torn, item damaged in transit.',   value: 320,  status: 'pending',    returnWaybill: null,          timeline: [{ status: 'pending', date: '2026-03-05', note: 'Return requested by customer' }] },
];

const SUPPORT_TICKETS = [
  { id: 'TKT-001', subject: 'Package LQ-2024-00002 not delivered', category: 'delivery', priority: 'high', status: 'open', createdAt: '2026-03-04', updatedAt: '2026-03-05',
    messages: [
      { from: 'user', text: 'The package was supposed to be delivered on March 3rd but the customer says it\'s not in the locker.', time: '2026-03-04 10:22' },
      { from: 'support', text: 'Hi, we\'re looking into this. Our courier team will check the delivery logs and get back to you within 2 hours.', time: '2026-03-04 11:05' },
    ],
  },
  { id: 'TKT-002', subject: 'Invoice INV-2025-012 discrepancy', category: 'billing', priority: 'medium', status: 'resolved', createdAt: '2026-01-10', updatedAt: '2026-01-12',
    messages: [
      { from: 'user', text: 'Invoice INV-2025-012 shows 72 shipments but we counted 70 from our records.', time: '2026-01-10 09:00' },
      { from: 'support', text: 'After review, 2 shipments were processed on Dec 31 and billed in December — which is correct. I\'ve attached the breakdown.', time: '2026-01-11 14:20' },
      { from: 'user', text: 'Understood, thank you for clarifying.', time: '2026-01-12 08:45' },
    ],
  },
  { id: 'TKT-003', subject: 'API rate limit increase request', category: 'technical', priority: 'low', status: 'open', createdAt: '2026-03-05', updatedAt: '2026-03-05',
    messages: [
      { from: 'user', text: 'We\'re hitting the 1000 req/min limit during peak hours. Can we get it raised to 5000?', time: '2026-03-05 16:30' },
    ],
  },
];

// ── Integrations mock data ──────────────────────────────────────────────────
const INTEGRATION_KEYS = [
  { id: 'key-1', name: 'Production ERP', prefix: 'lq_live_Jm3x', full: 'lq_live_Jm3xK9pQr7Wn2vY8sT5uZ1bC4dF6gH', scopes: ['shipments:read', 'shipments:write', 'dispatch:read'], createdAt: '2025-06-01', lastUsed: '2026-03-04', status: 'active' },
  { id: 'key-2', name: 'Staging / QA',   prefix: 'lq_test_Kp9w', full: 'lq_test_Kp9wM2rQs5Xn8vT3uY7bB4cE6fH1jL', scopes: ['shipments:read', 'shipments:write'], createdAt: '2025-09-15', lastUsed: '2026-02-20', status: 'active' },
  { id: 'key-3', name: 'Legacy',         prefix: 'lq_live_Aa1b', full: 'lq_live_Aa1bB2cC3dD4eE5fF6gG7hH8iI9jJ', scopes: ['shipments:read'], createdAt: '2024-11-01', lastUsed: '2025-08-10', status: 'revoked' },
];

const INTEGRATION_WEBHOOKS = [
  { id: 'wh-1', url: 'https://api.jumia.com.gh/webhooks/locqar', events: ['package.delivered', 'package.in_locker', 'dispatch.updated'], status: 'active',  lastDelivery: '2026-03-04 14:32', successRate: 98.5, secret: 'whsec_abc123' },
  { id: 'wh-2', url: 'https://erp.jumia.com.gh/events/logistics',  events: ['shipment.created', 'invoice.generated'],                    status: 'paused', lastDelivery: '2026-02-15 09:20', successRate: 94.2, secret: 'whsec_def456' },
];

const WEBHOOK_EVENTS = [
  { id: 'shipment.created',   label: 'Shipment Created',   desc: 'A new shipment is booked' },
  { id: 'package.in_locker',  label: 'Package in Locker',  desc: 'Package deposited and ready for pickup' },
  { id: 'package.delivered',  label: 'Package Delivered',  desc: 'Package picked up or delivered to home' },
  { id: 'package.exception',  label: 'Package Exception',  desc: 'Delivery exception or SLA breach' },
  { id: 'dispatch.updated',   label: 'Dispatch Updated',   desc: 'Courier dispatch status changed' },
  { id: 'invoice.generated',  label: 'Invoice Generated',  desc: 'Monthly invoice is ready' },
  { id: 'invoice.paid',       label: 'Invoice Paid',       desc: 'Payment confirmed' },
];

const API_SCOPES = [
  { id: 'shipments:read',  label: 'Shipments Read',  desc: 'View shipment records and status' },
  { id: 'shipments:write', label: 'Shipments Write', desc: 'Create and update shipments' },
  { id: 'dispatch:read',   label: 'Dispatch Read',   desc: 'View courier dispatch records' },
  { id: 'invoices:read',   label: 'Invoices Read',   desc: 'View invoices and billing history' },
  { id: 'analytics:read',  label: 'Analytics Read',  desc: 'Access analytics and reports' },
  { id: 'webhooks:manage', label: 'Webhooks Manage', desc: 'Create and manage webhook endpoints' },
];

const SLA_CONTRACTED = { deliveryWindow: '24 hours', pickupWindow: '72 hours', uptime: '99.5%', support: '24 hours' };
const SLA_ACTUAL     = { onTime: 94.2, avgHours: 18.4, pickupRate: 88.7, uptime: 99.8 };
const SLA_BREACHES   = [
  { waybill: 'LQ-2024-00005', issue: 'Pickup overdue (7+ days)', terminal: 'Achimota Mall', days: 4, date: '2026-02-28' },
  { waybill: 'LQ-2024-00018', issue: 'Pickup overdue (8+ days)', terminal: 'West Hills Mall', days: 5, date: '2026-02-26' },
];

const INITIAL_NOTIFS = [
  { id: 1, type: 'package', color: '#818CF8', title: 'Package in locker',    body: 'LQ-2024-00001 is now in Achimota Mall locker A-15. Ready for pickup.',     time: '5m ago',  read: false },
  { id: 2, type: 'sla',     color: '#D4AA5A', title: 'SLA breach warning',   body: 'LQ-2024-00005 has been in locker 7 days. Pickup deadline in 24h.',           time: '2h ago',  read: false },
  { id: 3, type: 'billing', color: '#D4AA5A', title: 'Invoice due in 7 days',body: 'INV-2026-003 for GH₵ 2,400 due Apr 1, 2026. Please arrange payment.',       time: '1d ago',  read: false },
  { id: 4, type: 'package', color: '#81C995', title: 'Delivery completed',   body: 'LQ-2024-00003 was successfully delivered to home address.',                   time: '2d ago',  read: true  },
  { id: 5, type: 'system',  color: '#7EA8C9', title: 'API key expiring',     body: 'Your live API key expires in 30 days. Rotate it in Account > API Access.',   time: '3d ago',  read: true  },
  { id: 6, type: 'package', color: '#818CF8', title: 'Batch dispatched',     body: '4 packages dispatched to Achimota Mall by courier Kwesi Asante.',            time: '5d ago',  read: true  },
  { id: 7, type: 'billing', color: '#81C995', title: 'Invoice paid',         body: 'INV-2026-002 (GH₵ 3,050) has been marked as paid. Thank you!',               time: '6d ago',  read: true  },
];

const ENTERPRISE_ACCOUNTS = {
  'logistics@jumia.com.gh': {
    company: 'Jumia Ghana', accountId: 'ENT-JMG-001', plan: 'Enterprise Pro',
    sla: '99.5% uptime · 24h support', accountManager: 'Sarah Amponsah', amEmail: 'sarah@locqar.com',
    contractEnd: '2026-12-31', apiKey: 'lq_live_Jm3xK9pQr7Wn2vY8sT5uZ1bC4dF6gH',
    webhookUrl: 'https://api.jumia.com.gh/webhooks/locqar', ratePerShipment: 50,
    terminals: ['Achimota Mall', 'Accra Mall', 'Junction Mall'],
    contacts: [
      { name: 'Kwabena Amoa',   role: 'Primary',   email: 'logistics@jumia.com.gh', phone: '+233302123456' },
      { name: 'Ama Darko',      role: 'Billing',   email: 'billing@jumia.com.gh',   phone: '+233302123457' },
      { name: 'Kofi Tech',      role: 'Technical', email: 'tech@jumia.com.gh',      phone: '+233302123458' },
    ],
  },
  'shipping@melcom.com': {
    company: 'Melcom Ltd', accountId: 'ENT-MLM-002', plan: 'Enterprise',
    sla: '99.2% uptime · 48h support', accountManager: 'John Doe', amEmail: 'john@locqar.com',
    contractEnd: '2026-06-30', apiKey: 'lq_live_Ml7wP3qRs9Xn5vT2uY8bA1cD4eG6hJ',
    webhookUrl: 'https://api.melcom.com/hooks/locqar', ratePerShipment: 45,
    terminals: ['Accra Mall', 'West Hills Mall'],
    contacts: [
      { name: 'Ernest Boateng', role: 'Primary', email: 'shipping@melcom.com',  phone: '+233302654321' },
      { name: 'Adwoa Frempong', role: 'Billing', email: 'accounts@melcom.com',  phone: '+233302654322' },
    ],
  },
};

const ENT_MENU = [
  { group: 'Overview',    items: [{ icon: LayoutDashboard, label: 'Dashboard',      id: 'dashboard' }] },
  { group: 'Operations',  items: [
      { icon: Package,      label: 'Shipments',     id: 'shipments',  subItems: ['All', 'In Transit', 'In Lockers', 'Completed', 'Exceptions'] },
      { icon: Truck,        label: 'Active Dispatch',id: 'dispatch' },
      { icon: RotateCcw,   label: 'Returns',        id: 'returns' },
      { icon: Search,       label: 'Track',         id: 'track' },
      { icon: Bell,         label: 'Notifications', id: 'notifications' },
      { icon: AlertOctagon, label: 'SLA Monitor',   id: 'sla' },
  ]},
  { group: 'Finance',     items: [
      { icon: FileText,     label: 'Invoices',      id: 'invoices' },
      { icon: TrendingUp,   label: 'Analytics',     id: 'analytics' },
  ]},
  { group: 'Account', items: [
      { icon: Settings,     label: 'Settings',      id: 'account' },
      { icon: HelpCircle,   label: 'Support',       id: 'support' },
  ]},
];

// ── Individual redirect ────────────────────────────────────────────────────
export const IndividualCustomerRedirect = ({ currentUser, onLogout }) => {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6" style={{ backgroundColor: theme.bg.primary }}>
      <div className="w-full max-w-sm text-center space-y-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: theme.text.primary }}>LocQar</h1>
          <p className="text-sm mt-1" style={{ color: theme.text.muted }}>Hi {currentUser?.name?.split(' ')[0]}! Your portal is on the LocQar mobile app.</p>
        </div>
        <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: '#D4AA5A20' }}>
            <Globe size={22} style={{ color: '#D4AA5A' }} />
          </div>
          <p className="font-semibold" style={{ color: theme.text.primary }}>Use the LocQar App</p>
          <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Track packages, manage your locker address, and view your delivery history from the mobile app.</p>
        </div>
        <button onClick={onLogout} className="text-sm flex items-center gap-1.5 mx-auto" style={{ color: theme.text.muted }}>
          <LogOut size={13} /> Sign out
        </button>
      </div>
    </div>
  );
};

// ── Entry point ────────────────────────────────────────────────────────────
export const CustomerPortalPage = ({ currentUser, onLogout, themeName, setThemeName }) => {
  const { theme } = useTheme();
  if (currentUser?.type !== 'b2b') {
    return <IndividualCustomerRedirect currentUser={currentUser} onLogout={onLogout} />;
  }
  return <EnterprisePortal currentUser={currentUser} onLogout={onLogout} themeName={themeName} setThemeName={setThemeName} />;
};

// ── CSV Template columns ────────────────────────────────────────────────────
const CSV_TEMPLATE_COLS = ['recipient_name', 'recipient_phone', 'recipient_email', 'description', 'value', 'size', 'cod', 'cod_amount', 'delivery_method', 'terminal', 'notes'];
const CSV_TEMPLATE_EXAMPLE = [
  'Kofi Mensah', '+233551234567', 'kofi@email.com', 'Electronics', '250', 'M', 'false', '', 'warehouse_to_locker', 'Achimota Mall', '',
  'Ama Serwaa',  '+233559876543', '',               'Clothing',    '80',  'S', 'true',  '80', 'dropbox_to_locker',   'Accra Mall',    'Handle with care',
];

function downloadCsvTemplate() {
  const rows = [CSV_TEMPLATE_COLS, CSV_TEMPLATE_EXAMPLE.slice(0, CSV_TEMPLATE_COLS.length), CSV_TEMPLATE_EXAMPLE.slice(CSV_TEMPLATE_COLS.length)];
  const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'locqar-bulk-shipment-template.csv'; a.click();
  URL.revokeObjectURL(url);
}

function parseShipmentCsv(text) {
  const lines = text.trim().split('\n').filter(Boolean);
  if (lines.length < 2) return { rows: [], errors: ['File appears empty — needs a header row and at least one data row.'] };
  const errors = [];
  const rows = [];
  lines.slice(1).forEach((line, i) => {
    const vals = line.split(',').map(v => v.replace(/^"|"$/g, '').trim());
    const row = Object.fromEntries(CSV_TEMPLATE_COLS.map((k, j) => [k, vals[j] ?? '']));
    const rowNum = i + 2;
    if (!row.recipient_name)  errors.push(`Row ${rowNum}: recipient_name is required`);
    if (!row.recipient_phone) errors.push(`Row ${rowNum}: recipient_phone is required`);
    if (!row.description)     errors.push(`Row ${rowNum}: description is required`);
    if (!row.value || isNaN(Number(row.value))) errors.push(`Row ${rowNum}: value must be a number`);
    if (errors.length === 0 || rows.length < 50) rows.push(row);
  });
  return { rows, errors };
}

// ── Import Shipments Modal ──────────────────────────────────────────────────
function ImportShipmentsModal({ theme, onClose, onImport }) {
  const [file, setFile]       = useState(null);
  const [parsed, setParsed]   = useState(null); // { rows, errors }
  const [dragging, setDragging] = useState(false);

  const processFile = (f) => {
    if (!f || !f.name.endsWith('.csv')) return;
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => setParsed(parseShipmentCsv(e.target.result));
    reader.readAsText(f);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  const handleImport = () => {
    const clean = parsed.rows.filter((_, i) => !parsed.errors.some(err => err.startsWith(`Row ${i + 2}:`)));
    onImport(clean);
    onClose();
  };

  const canImport = parsed && parsed.rows.length > 0 && parsed.errors.length === 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="rounded-2xl shadow-2xl w-full max-w-lg mx-4" style={{ background: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#4F46E515' }}>
              <FileSpreadsheet size={18} style={{ color: '#4F46E5' }} />
            </div>
            <div>
              <p style={{ color: theme.text.primary, fontWeight: 700, fontSize: 15 }}>Bulk Import Shipments</p>
              <p style={{ color: theme.text.muted, fontSize: 12 }}>Upload a CSV file to create multiple orders at once</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: theme.text.muted }}><X size={16} /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Template download */}
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: theme.bg.input, border: `1px solid ${theme.border.primary}` }}>
            <div>
              <p style={{ color: theme.text.secondary, fontSize: 13, fontWeight: 500 }}>Need the template?</p>
              <p style={{ color: theme.text.muted, fontSize: 11 }}>Download and fill in the provided CSV format</p>
            </div>
            <button
              onClick={downloadCsvTemplate}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium"
              style={{ background: '#4F46E518', color: '#4F46E5' }}
            >
              <Download size={12} /> Template
            </button>
          </div>

          {/* Drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('csv-file-input').click()}
            className="flex flex-col items-center justify-center gap-2 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all"
            style={{
              borderColor: dragging ? '#4F46E5' : file ? '#10B981' : theme.border.primary,
              background: dragging ? '#4F46E508' : file ? '#10B98108' : theme.bg.input,
            }}
          >
            <input id="csv-file-input" type="file" accept=".csv" className="hidden" onChange={e => processFile(e.target.files[0])} />
            {file ? (
              <>
                <FileSpreadsheet size={28} style={{ color: '#10B981' }} />
                <p style={{ color: '#10B981', fontWeight: 600, fontSize: 13 }}>{file.name}</p>
                <p style={{ color: theme.text.muted, fontSize: 11 }}>Click to replace</p>
              </>
            ) : (
              <>
                <Upload size={28} style={{ color: theme.text.muted }} />
                <p style={{ color: theme.text.secondary, fontWeight: 500, fontSize: 13 }}>Drop your CSV here, or click to browse</p>
                <p style={{ color: theme.text.muted, fontSize: 11 }}>Only .csv files · max 500 rows</p>
              </>
            )}
          </div>

          {/* Parse results */}
          {parsed && (
            <div>
              {parsed.errors.length > 0 ? (
                <div className="rounded-xl p-3 space-y-1.5" style={{ background: '#EF444410', border: '1px solid #EF444430' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <AlertCircle size={14} style={{ color: '#EF4444' }} />
                    <p style={{ color: '#EF4444', fontSize: 12, fontWeight: 600 }}>{parsed.errors.length} error{parsed.errors.length > 1 ? 's' : ''} found</p>
                  </div>
                  {parsed.errors.slice(0, 5).map((e, i) => (
                    <p key={i} style={{ color: '#EF4444', fontSize: 11 }}>• {e}</p>
                  ))}
                  {parsed.errors.length > 5 && <p style={{ color: '#EF4444', fontSize: 11 }}>…and {parsed.errors.length - 5} more</p>}
                </div>
              ) : (
                <div className="rounded-xl p-3 flex items-center gap-2" style={{ background: '#10B98110', border: '1px solid #10B98130' }}>
                  <CheckCircle2 size={14} style={{ color: '#10B981' }} />
                  <p style={{ color: '#10B981', fontSize: 13, fontWeight: 500 }}>
                    {parsed.rows.length} shipment{parsed.rows.length !== 1 ? 's' : ''} ready to import
                  </p>
                </div>
              )}

              {/* Preview table */}
              {parsed.rows.length > 0 && (
                <div className="mt-3 rounded-xl overflow-hidden border" style={{ borderColor: theme.border.primary }}>
                  <div className="overflow-x-auto max-h-40">
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ background: theme.bg.input }}>
                          {['Recipient', 'Phone', 'Description', 'Value', 'Method'].map(h => (
                            <th key={h} className="text-left px-3 py-2" style={{ color: theme.text.muted, fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {parsed.rows.slice(0, 5).map((r, i) => (
                          <tr key={i} style={{ borderTop: `1px solid ${theme.border.primary}` }}>
                            <td className="px-3 py-2" style={{ color: theme.text.primary }}>{r.recipient_name}</td>
                            <td className="px-3 py-2" style={{ color: theme.text.secondary }}>{r.recipient_phone}</td>
                            <td className="px-3 py-2" style={{ color: theme.text.secondary }}>{r.description}</td>
                            <td className="px-3 py-2" style={{ color: theme.text.secondary }}>GH₵ {r.value}</td>
                            <td className="px-3 py-2" style={{ color: theme.text.muted }}>{r.delivery_method?.replace(/_/g, ' ')}</td>
                          </tr>
                        ))}
                        {parsed.rows.length > 5 && (
                          <tr style={{ borderTop: `1px solid ${theme.border.primary}` }}>
                            <td colSpan={5} className="px-3 py-2 text-center" style={{ color: theme.text.muted }}>+{parsed.rows.length - 5} more rows</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex gap-3" style={{ borderTop: `1px solid ${theme.border.primary}` }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!canImport}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: canImport ? '#10B981' : theme.bg.input, color: canImport ? '#fff' : theme.text.muted, cursor: canImport ? 'pointer' : 'not-allowed' }}
          >
            Import {parsed?.rows.length > 0 ? `${parsed.rows.length} Shipments` : ''}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── New Shipment Drawer ─────────────────────────────────────────────────────
const DELIVERY_OPTIONS = [
  { id: 'warehouse_to_locker', label: 'Warehouse → Locker', desc: 'Drop off at our warehouse, we deliver to recipient\'s chosen locker', icon: Warehouse, color: '#7EA8C9' },
  { id: 'dropbox_to_locker',   label: 'Dropbox → Locker',   desc: 'Drop package in any LocQar dropbox, routed to recipient\'s locker',  icon: Inbox,    color: '#B5A0D1' },
  { id: 'locker_to_home',      label: 'Locker → Home',      desc: 'Recipient collects from locker then requests home delivery',        icon: HomeIcon,  color: '#81C995' },
];
const PARCEL_SIZES = [
  { id: 'S', label: 'Small',   desc: 'Up to 2kg · fits in a small box',  dims: '20×15×10cm' },
  { id: 'M', label: 'Medium',  desc: 'Up to 5kg · standard parcel',      dims: '35×25×20cm' },
  { id: 'L', label: 'Large',   desc: 'Up to 15kg · bulky items',         dims: '60×40×30cm' },
  { id: 'R', label: 'Regular', desc: 'Up to 10kg · envelopes/documents', dims: '40×30×5cm'  },
];
const TERMINALS_LIST = ['Achimota Mall', 'Accra Mall', 'Kotoka T3', 'Junction Mall', 'West Hills Mall'];

const STEPS = ['Recipient', 'Package', 'Delivery', 'Confirm'];

// ── Dispatch Form Drawer (Create / Edit) ───────────────────────────────────
const DISPATCH_STATUSES = [
  { id: 'scheduled',  label: 'Scheduled',  color: '#D97706' },
  { id: 'in_transit', label: 'In Transit', color: '#818CF8' },
  { id: 'arrived',    label: 'Arrived',    color: '#10B981' },
  { id: 'completed',  label: 'Completed',  color: '#6B7280' },
];

// ── API Key Form Drawer ─────────────────────────────────────────────────────
function KeyFormDrawer({ theme, onClose, onSave }) {
  const [form, setForm] = useState({ name: '', scopes: [] });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleScope = (s) => setForm(p => ({
    ...p, scopes: p.scopes.includes(s) ? p.scopes.filter(x => x !== s) : [...p.scopes, s],
  }));
  const valid = form.name.trim() && form.scopes.length > 0;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="w-full max-w-md h-full flex flex-col" style={{ backgroundColor: theme.bg.card, borderLeft: `1px solid ${theme.border.primary}` }}>
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0" style={{ borderColor: theme.border.primary }}>
          <div>
            <h3 className="font-bold" style={{ color: theme.text.primary }}>Create API Key</h3>
            <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>The full key is shown only once — save it immediately</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ color: theme.text.muted }}><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>Key Name</label>
            <input value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Production ERP"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: theme.text.muted }}>Permissions (Scopes)</label>
            <div className="space-y-2">
              {API_SCOPES.map(s => (
                <label key={s.id} onClick={() => toggleScope(s.id)}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all"
                  style={{ borderColor: form.scopes.includes(s.id) ? '#818CF840' : theme.border.primary, backgroundColor: form.scopes.includes(s.id) ? '#818CF808' : theme.bg.tertiary }}>
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: form.scopes.includes(s.id) ? '#818CF8' : theme.border.secondary }}>
                    {form.scopes.includes(s.id) && <Check size={10} color="#fff" />}
                  </div>
                  <div className="flex-1 select-none">
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{s.label}</p>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{s.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button disabled={!valid} onClick={() => onSave(form)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: valid ? 'linear-gradient(135deg,#6366F1,#818CF8)' : theme.border.primary, opacity: valid ? 1 : 0.5 }}>
            Generate Key
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Webhook Form Drawer ─────────────────────────────────────────────────────
function WebhookFormDrawer({ webhook: initial, theme, onClose, onSave }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState(initial || { url: '', events: [], status: 'active', secret: '' });
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleEvent = (e) => setForm(p => ({
    ...p, events: p.events.includes(e) ? p.events.filter(x => x !== e) : [...p.events, e],
  }));
  const valid = form.url.startsWith('http') && form.events.length > 0;
  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
      <div className="w-full max-w-md h-full flex flex-col" style={{ backgroundColor: theme.bg.card, borderLeft: `1px solid ${theme.border.primary}` }}>
        <div className="flex items-center justify-between p-5 border-b flex-shrink-0" style={{ borderColor: theme.border.primary }}>
          <h3 className="font-bold" style={{ color: theme.text.primary }}>{isEdit ? 'Edit Webhook' : 'Add Webhook Endpoint'}</h3>
          <button onClick={onClose} className="p-2 rounded-xl" style={{ color: theme.text.muted }}><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>Endpoint URL</label>
            <input value={form.url} onChange={e => f('url', e.target.value)}
              placeholder="https://api.yourapp.com/webhooks/locqar"
              className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono outline-none"
              style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>Signing Secret <span className="font-normal">(optional — auto-generated if blank)</span></label>
            <input value={form.secret} onChange={e => f('secret', e.target.value)} placeholder="whsec_..."
              className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono outline-none"
              style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
            <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Verify deliveries via the <code className="px-1 py-0.5 rounded" style={{ backgroundColor: '#818CF815', color: '#818CF8' }}>X-LocQar-Signature</code> header</p>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-2" style={{ color: theme.text.muted }}>Events to Subscribe</label>
            <div className="space-y-1.5">
              {WEBHOOK_EVENTS.map(ev => (
                <label key={ev.id} onClick={() => toggleEvent(ev.id)}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all"
                  style={{ borderColor: form.events.includes(ev.id) ? '#818CF840' : theme.border.primary, backgroundColor: form.events.includes(ev.id) ? '#818CF808' : theme.bg.tertiary }}>
                  <div className="w-4 h-4 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: form.events.includes(ev.id) ? '#818CF8' : theme.border.secondary }}>
                    {form.events.includes(ev.id) && <Check size={10} color="#fff" />}
                  </div>
                  <div className="flex-1 select-none">
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{ev.label}</p>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{ev.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between p-3.5 rounded-xl border" style={{ borderColor: theme.border.primary }}>
            <div>
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>Active</p>
              <p className="text-xs" style={{ color: theme.text.muted }}>{form.status === 'active' ? 'Endpoint is receiving events' : 'Endpoint is paused'}</p>
            </div>
            <button onClick={() => f('status', form.status === 'active' ? 'paused' : 'active')}
              className="w-12 h-6 rounded-full flex items-center transition-all"
              style={{ backgroundColor: form.status === 'active' ? '#818CF8' : theme.border.secondary, justifyContent: form.status === 'active' ? 'flex-end' : 'flex-start', padding: '2px' }}>
              <div className="w-5 h-5 rounded-full bg-white shadow" />
            </button>
          </div>
        </div>
        <div className="p-5 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button disabled={!valid} onClick={() => onSave(form)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: valid ? 'linear-gradient(135deg,#6366F1,#818CF8)' : theme.border.primary, opacity: valid ? 1 : 0.5 }}>
            {isEdit ? 'Save Changes' : 'Add Endpoint'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dispatch Form Drawer ────────────────────────────────────────────────────
function DispatchFormDrawer({ dispatch: initial, theme, onClose, onSave }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState(initial || {
    courier: '', phone: '', terminal: TERMINALS_LIST[0],
    status: 'scheduled', eta: '', dispatchedAt: '', waybills: [],
  });
  const [errors, setErrors]   = useState({});
  const [waybillInput, setWaybillInput] = useState('');

  const up = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: undefined })); };

  const addWaybill = () => {
    const w = waybillInput.trim().toUpperCase();
    if (!w || form.waybills.includes(w)) return;
    up('waybills', [...form.waybills, w]);
    setWaybillInput('');
  };

  const removeWaybill = (w) => up('waybills', form.waybills.filter(x => x !== w));

  const validate = () => {
    const e = {};
    if (!form.courier.trim()) e.courier = 'Required';
    if (!form.phone.trim())   e.phone   = 'Required';
    if (!form.terminal)       e.terminal = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      ...form,
      id: initial?.id || `DSP-${Date.now().toString(36).toUpperCase().slice(-4)}`,
      packages: form.waybills.length,
      dispatchedAt: form.dispatchedAt || new Date().toLocaleTimeString('en-GH', { hour: '2-digit', minute: '2-digit' }),
    });
  };

  const inp = (f) => ({
    className: 'w-full px-3 py-2.5 rounded-xl border text-sm outline-none',
    style: { background: theme.bg.input, borderColor: errors[f] ? '#EF4444' : theme.border.primary, color: theme.text.primary },
  });
  const lbl = (t, req) => (
    <label style={{ color: theme.text.muted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>
      {t}{req && <span style={{ color: '#EF4444' }}> *</span>}
    </label>
  );

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={onClose} />
      <div className="fixed right-0 top-0 h-full z-50 flex flex-col" style={{ width: 480, background: theme.bg.card, borderLeft: `1px solid ${theme.border.primary}`, boxShadow: '-8px 0 40px rgba(0,0,0,0.18)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#818CF815' }}>
              <Truck size={18} style={{ color: '#818CF8' }} />
            </div>
            <div>
              <p style={{ color: theme.text.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Active Dispatch</p>
              <h2 style={{ color: theme.text.primary, fontWeight: 700, fontSize: 16, marginTop: 2 }}>{isEdit ? 'Edit Dispatch' : 'New Dispatch'}</h2>
            </div>
          </div>
          <button onClick={onClose} style={{ color: theme.text.muted }}><X size={18} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Courier */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              {lbl('Courier Name', true)}
              <input value={form.courier} onChange={e => up('courier', e.target.value)} placeholder="Kwesi Asante" {...inp('courier')} />
              {errors.courier && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{errors.courier}</p>}
            </div>
            <div>
              {lbl('Phone', true)}
              <input value={form.phone} onChange={e => up('phone', e.target.value)} placeholder="+233…" {...inp('phone')} />
              {errors.phone && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{errors.phone}</p>}
            </div>
          </div>

          {/* Terminal */}
          <div>
            {lbl('Terminal')}
            <select value={form.terminal} onChange={e => up('terminal', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}>
              {TERMINALS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            {lbl('Status')}
            <div className="grid grid-cols-2 gap-2">
              {DISPATCH_STATUSES.map(s => (
                <button key={s.id} onClick={() => up('status', s.id)}
                  className="flex items-center gap-2 p-3 rounded-xl border transition-all"
                  style={{
                    background: form.status === s.id ? `${s.color}12` : theme.bg.input,
                    borderColor: form.status === s.id ? s.color : theme.border.primary,
                  }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  <span style={{ color: form.status === s.id ? s.color : theme.text.secondary, fontSize: 13, fontWeight: 500 }}>{s.label}</span>
                  {form.status === s.id && <Check size={12} style={{ color: s.color, marginLeft: 'auto' }} />}
                </button>
              ))}
            </div>
          </div>

          {/* ETA + Dispatched */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              {lbl('ETA')}
              <input value={form.eta} onChange={e => up('eta', e.target.value)} placeholder="e.g. ~2h, 14:30" {...inp('eta')} />
            </div>
            <div>
              {lbl('Dispatched At')}
              <input value={form.dispatchedAt} onChange={e => up('dispatchedAt', e.target.value)} placeholder="e.g. 08:30 AM" {...inp('dispatchedAt')} />
            </div>
          </div>

          {/* Waybills */}
          <div>
            {lbl('Waybills')}
            <div className="flex gap-2 mb-2">
              <input
                value={waybillInput}
                onChange={e => setWaybillInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addWaybill())}
                placeholder="LQ-2024-00001 then Enter"
                className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
              />
              <button onClick={addWaybill}
                className="px-3 py-2 rounded-xl border text-sm font-medium"
                style={{ borderColor: theme.border.primary, color: theme.text.secondary, background: theme.bg.input }}>
                <Plus size={14} />
              </button>
            </div>
            {form.waybills.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 p-3 rounded-xl border" style={{ borderColor: theme.border.primary, background: theme.bg.input }}>
                {form.waybills.map(w => (
                  <span key={w} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg font-mono"
                    style={{ background: theme.bg.card, border: `1px solid ${theme.border.primary}`, color: theme.text.secondary }}>
                    {w}
                    <button onClick={() => removeWaybill(w)} style={{ color: theme.text.muted, lineHeight: 0 }}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ color: theme.text.muted, fontSize: 12 }}>No waybills added yet</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex gap-3" style={{ borderTop: `1px solid ${theme.border.primary}` }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            Cancel
          </button>
          <button onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
            style={{ background: '#818CF8' }}>
            {isEdit ? 'Save Changes' : 'Create Dispatch'}
          </button>
        </div>
      </div>
    </>
  );
}

function NewShipmentDrawer({ accountTerminals = [], onClose, onSubmit, theme }) {
  const [step, setStep]   = useState(0);
  const [success, setSuccess] = useState(null); // waybill string after submit
  const [form, setForm]   = useState({
    // Step 0 — recipient
    recipientName: '', recipientPhone: '', recipientEmail: '',
    // Step 1 — package
    description: '', value: '', size: 'M', cod: false, codAmount: '', fragile: false,
    // Step 2 — delivery
    method: 'warehouse_to_locker', terminal: accountTerminals[0] || TERMINALS_LIST[0], notes: '',
  });
  const [errors, setErrors] = useState({});

  const up = (f, v) => { setForm(p => ({ ...p, [f]: v })); setErrors(p => ({ ...p, [f]: undefined })); };

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.recipientName.trim())  e.recipientName  = 'Required';
      if (!form.recipientPhone.trim()) e.recipientPhone = 'Required';
    }
    if (step === 1) {
      if (!form.description.trim()) e.description = 'Required';
      if (!form.value || isNaN(Number(form.value)) || Number(form.value) <= 0) e.value = 'Enter a valid amount';
      if (form.cod && (!form.codAmount || isNaN(Number(form.codAmount)))) e.codAmount = 'Enter COD amount';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const back = () => setStep(s => s - 1);

  const handleSubmit = () => {
    const waybill = `LQ-ENT-${Date.now().toString(36).toUpperCase().slice(-6)}`;
    onSubmit({ ...form, waybill, status: 'pending', createdAt: new Date().toISOString().split('T')[0] });
    setSuccess(waybill);
  };

  const inp = (f) => ({
    className: `w-full px-3 py-2.5 rounded-xl border text-sm outline-none`,
    style: { background: theme.bg.input, borderColor: errors[f] ? '#EF4444' : theme.border.primary, color: theme.text.primary },
  });

  const lbl = (text, req) => (
    <label style={{ color: theme.text.muted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>
      {text}{req && <span style={{ color: '#EF4444' }}> *</span>}
    </label>
  );

  return (
    <>
      <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={!success ? onClose : undefined} />
      <div className="fixed right-0 top-0 h-full z-50 flex flex-col" style={{ width: 520, background: theme.bg.card, borderLeft: `1px solid ${theme.border.primary}`, boxShadow: '-8px 0 40px rgba(0,0,0,0.18)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
          <div>
            <p style={{ color: theme.text.muted, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Enterprise Portal</p>
            <h2 style={{ color: theme.text.primary, fontWeight: 700, fontSize: 16, marginTop: 2 }}>New Shipment Order</h2>
          </div>
          {!success && <button onClick={onClose} style={{ color: theme.text.muted }}><X size={18} /></button>}
        </div>

        {/* Success screen */}
        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: '#10B98115', border: '2px solid #10B981' }}>
              <BadgeCheck size={32} style={{ color: '#10B981' }} />
            </div>
            <h3 style={{ color: theme.text.primary, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Order Created!</h3>
            <p style={{ color: theme.text.muted, fontSize: 13, marginBottom: 20 }}>Your shipment has been registered and is awaiting processing.</p>
            <div className="px-6 py-4 rounded-2xl mb-6 w-full" style={{ background: theme.bg.input, border: `1.5px solid ${theme.border.primary}` }}>
              <p style={{ color: theme.text.muted, fontSize: 11, marginBottom: 4 }}>WAYBILL NUMBER</p>
              <p style={{ color: theme.text.primary, fontWeight: 800, fontSize: 22, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}>{success}</p>
              <p style={{ color: theme.text.muted, fontSize: 12, marginTop: 6 }}>{form.method.replace(/_/g, ' ')} · {form.terminal} · Size {form.size}</p>
            </div>
            <p style={{ color: theme.text.muted, fontSize: 12, marginBottom: 20 }}>Present this waybill at your designated drop-off point. You'll receive SMS and email updates as the package moves.</p>
            <button onClick={onClose} className="w-full py-3 rounded-xl font-medium text-white" style={{ background: '#4F46E5' }}>Done</button>
          </div>
        ) : (
          <>
            {/* Step indicator */}
            <div className="flex items-center gap-0 px-6 py-4" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
              {STEPS.map((s, idx) => (
                <React.Fragment key={s}>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{
                        background: idx < step ? '#10B981' : idx === step ? '#4F46E5' : theme.bg.input,
                        color: idx <= step ? '#fff' : theme.text.muted,
                        border: `1.5px solid ${idx < step ? '#10B981' : idx === step ? '#4F46E5' : theme.border.primary}`,
                      }}>
                      {idx < step ? <Check size={11} /> : idx + 1}
                    </div>
                    <span style={{ color: idx === step ? theme.text.primary : theme.text.muted, fontSize: 12, fontWeight: idx === step ? 600 : 400 }}>{s}</span>
                  </div>
                  {idx < STEPS.length - 1 && <div className="flex-1 mx-2 h-px" style={{ background: idx < step ? '#10B981' : theme.border.primary }} />}
                </React.Fragment>
              ))}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">

              {/* ── Step 0: Recipient ── */}
              {step === 0 && (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#4F46E515' }}>
                      <User size={18} style={{ color: '#4F46E5' }} />
                    </div>
                    <div>
                      <p style={{ color: theme.text.primary, fontWeight: 600 }}>Recipient Details</p>
                      <p style={{ color: theme.text.muted, fontSize: 12 }}>Who is receiving this package?</p>
                    </div>
                  </div>
                  <div>
                    {lbl('Full Name', true)}
                    <input value={form.recipientName} onChange={e => up('recipientName', e.target.value)} placeholder="e.g. Kofi Mensah" {...inp('recipientName')} />
                    {errors.recipientName && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{errors.recipientName}</p>}
                  </div>
                  <div>
                    {lbl('Phone Number', true)}
                    <input value={form.recipientPhone} onChange={e => up('recipientPhone', e.target.value)} placeholder="+233..." {...inp('recipientPhone')} />
                    {errors.recipientPhone && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{errors.recipientPhone}</p>}
                  </div>
                  <div>
                    {lbl('Email (optional)')}
                    <input value={form.recipientEmail} onChange={e => up('recipientEmail', e.target.value)} placeholder="kofi@email.com" {...inp('recipientEmail')} />
                  </div>
                </>
              )}

              {/* ── Step 1: Package ── */}
              {step === 1 && (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#F59E0B15' }}>
                      <Package size={18} style={{ color: '#D97706' }} />
                    </div>
                    <div>
                      <p style={{ color: theme.text.primary, fontWeight: 600 }}>Package Details</p>
                      <p style={{ color: theme.text.muted, fontSize: 12 }}>What are you sending?</p>
                    </div>
                  </div>
                  <div>
                    {lbl('Package Description', true)}
                    <input value={form.description} onChange={e => up('description', e.target.value)} placeholder="e.g. Clothing, Electronics, Documents…" {...inp('description')} />
                    {errors.description && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{errors.description}</p>}
                  </div>
                  <div>
                    {lbl('Declared Value (GH₵)', true)}
                    <input type="number" value={form.value} onChange={e => up('value', e.target.value)} placeholder="0.00" min="0" {...inp('value')} />
                    {errors.value && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{errors.value}</p>}
                  </div>

                  {/* Parcel size */}
                  <div>
                    {lbl('Parcel Size')}
                    <div className="grid grid-cols-2 gap-2">
                      {PARCEL_SIZES.map(sz => (
                        <button key={sz.id} onClick={() => up('size', sz.id)}
                          className="text-left p-3 rounded-xl border transition-all"
                          style={{
                            background: form.size === sz.id ? '#4F46E510' : theme.bg.input,
                            borderColor: form.size === sz.id ? '#4F46E5' : theme.border.primary,
                          }}>
                          <div className="flex items-center justify-between mb-1">
                            <span style={{ color: theme.text.primary, fontWeight: 600, fontSize: 13 }}>{sz.label}</span>
                            {form.size === sz.id && <Check size={12} style={{ color: '#4F46E5' }} />}
                          </div>
                          <p style={{ color: theme.text.muted, fontSize: 11 }}>{sz.desc}</p>
                          <p style={{ color: theme.text.muted, fontSize: 10, marginTop: 2, fontFamily: 'monospace' }}>{sz.dims}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Flags */}
                  <div className="flex gap-3">
                    <button onClick={() => up('fragile', !form.fragile)}
                      className="flex-1 flex items-center gap-2 p-3 rounded-xl border"
                      style={{ background: form.fragile ? '#EF444410' : theme.bg.input, borderColor: form.fragile ? '#EF4444' : theme.border.primary }}>
                      <div className={`w-4 h-4 rounded flex items-center justify-center`} style={{ background: form.fragile ? '#EF4444' : 'transparent', border: `1.5px solid ${form.fragile ? '#EF4444' : theme.border.primary}` }}>
                        {form.fragile && <Check size={10} color="#fff" />}
                      </div>
                      <span style={{ color: form.fragile ? '#EF4444' : theme.text.secondary, fontSize: 13 }}>Fragile</span>
                    </button>
                    <button onClick={() => up('cod', !form.cod)}
                      className="flex-1 flex items-center gap-2 p-3 rounded-xl border"
                      style={{ background: form.cod ? '#10B98110' : theme.bg.input, borderColor: form.cod ? '#10B981' : theme.border.primary }}>
                      <div className="w-4 h-4 rounded flex items-center justify-center" style={{ background: form.cod ? '#10B981' : 'transparent', border: `1.5px solid ${form.cod ? '#10B981' : theme.border.primary}` }}>
                        {form.cod && <Check size={10} color="#fff" />}
                      </div>
                      <span style={{ color: form.cod ? '#10B981' : theme.text.secondary, fontSize: 13 }}>Cash on Delivery</span>
                    </button>
                  </div>
                  {form.cod && (
                    <div>
                      {lbl('COD Amount (GH₵)', true)}
                      <input type="number" value={form.codAmount} onChange={e => up('codAmount', e.target.value)} placeholder="Amount to collect from recipient" {...inp('codAmount')} />
                      {errors.codAmount && <p style={{ color: '#EF4444', fontSize: 11, marginTop: 3 }}>{errors.codAmount}</p>}
                    </div>
                  )}
                </>
              )}

              {/* ── Step 2: Delivery ── */}
              {step === 2 && (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#10B98115' }}>
                      <Truck size={18} style={{ color: '#10B981' }} />
                    </div>
                    <div>
                      <p style={{ color: theme.text.primary, fontWeight: 600 }}>Delivery Options</p>
                      <p style={{ color: theme.text.muted, fontSize: 12 }}>How should this package be handled?</p>
                    </div>
                  </div>

                  {/* Method */}
                  <div>
                    {lbl('Delivery Method')}
                    <div className="space-y-2">
                      {DELIVERY_OPTIONS.map(opt => {
                        const Icon = opt.icon;
                        return (
                          <button key={opt.id} onClick={() => up('method', opt.id)}
                            className="w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3"
                            style={{
                              background: form.method === opt.id ? `${opt.color}12` : theme.bg.input,
                              borderColor: form.method === opt.id ? opt.color : theme.border.primary,
                            }}>
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${opt.color}20` }}>
                              <Icon size={16} style={{ color: opt.color }} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span style={{ color: theme.text.primary, fontWeight: 600, fontSize: 13 }}>{opt.label}</span>
                                {form.method === opt.id && <Check size={13} style={{ color: opt.color }} />}
                              </div>
                              <p style={{ color: theme.text.muted, fontSize: 12, marginTop: 2 }}>{opt.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Terminal */}
                  <div>
                    {lbl('Drop-off / Destination Terminal')}
                    <select value={form.terminal} onChange={e => up('terminal', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}>
                      {TERMINALS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  {/* Notes */}
                  <div>
                    {lbl('Special Instructions (optional)')}
                    <textarea value={form.notes} onChange={e => up('notes', e.target.value)} rows={3}
                      placeholder="Any handling notes for this shipment…"
                      className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
                      style={{ background: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
                    />
                  </div>
                </>
              )}

              {/* ── Step 3: Confirm ── */}
              {step === 3 && (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#4F46E515' }}>
                      <CheckCircle2 size={18} style={{ color: '#4F46E5' }} />
                    </div>
                    <div>
                      <p style={{ color: theme.text.primary, fontWeight: 600 }}>Review & Confirm</p>
                      <p style={{ color: theme.text.muted, fontSize: 12 }}>Check all details before submitting</p>
                    </div>
                  </div>

                  {[
                    { label: 'Recipient', items: [
                      ['Name', form.recipientName], ['Phone', form.recipientPhone],
                      form.recipientEmail && ['Email', form.recipientEmail],
                    ].filter(Boolean) },
                    { label: 'Package', items: [
                      ['Description', form.description], ['Declared Value', `GH₵ ${Number(form.value).toLocaleString()}`],
                      ['Size', PARCEL_SIZES.find(s => s.id === form.size)?.label],
                      form.fragile && ['Handling', 'Fragile'],
                      form.cod && ['COD', `GH₵ ${Number(form.codAmount).toLocaleString()}`],
                    ].filter(Boolean) },
                    { label: 'Delivery', items: [
                      ['Method', DELIVERY_OPTIONS.find(o => o.id === form.method)?.label],
                      ['Terminal', form.terminal],
                      form.notes && ['Notes', form.notes],
                    ].filter(Boolean) },
                  ].map(sec => (
                    <div key={sec.label} className="rounded-2xl overflow-hidden border" style={{ borderColor: theme.border.primary }}>
                      <div className="px-4 py-2.5" style={{ background: theme.bg.input }}>
                        <p style={{ color: theme.text.muted, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{sec.label}</p>
                      </div>
                      <div className="px-4 divide-y" style={{ '--tw-divide-opacity': 1 }}>
                        {sec.items.map(([k, v]) => (
                          <div key={k} className="flex items-start justify-between py-2.5 gap-4" style={{ borderTop: `1px solid ${theme.border.primary}` }}>
                            <span style={{ color: theme.text.muted, fontSize: 13, minWidth: 100 }}>{k}</span>
                            <span style={{ color: theme.text.primary, fontSize: 13, fontWeight: 500, textAlign: 'right' }}>{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 flex gap-3" style={{ borderTop: `1px solid ${theme.border.primary}` }}>
              {step > 0 && (
                <button onClick={back} className="px-5 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                  Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button onClick={next} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: '#4F46E5' }}>
                  Continue <ArrowRight size={14} />
                </button>
              ) : (
                <button onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-white" style={{ background: '#10B981' }}>
                  <BadgeCheck size={15} /> Submit Order
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// ── Enterprise Portal ──────────────────────────────────────────────────────
function EnterprisePortal({ currentUser, onLogout, themeName, setThemeName }) {
  const { theme } = useTheme();

  // Layout
  const [isCollapsed, setIsCollapsed]     = useState(false);
  const [mobileSidebarOpen, setMobileOpen]= useState(false);
  const [expandedMenus, setExpandedMenus] = useState(['shipments']);

  // Navigation
  const [activeMenu, setActiveMenu]       = useState('dashboard');
  const [activeSubMenu, setActiveSubMenu] = useState(null);

  // Header UI
  const [showProfile, setShowProfile]     = useState(false);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [notifs, setNotifs]               = useState(INITIAL_NOTIFS);
  const [search, setSearch]               = useState('');

  // Page state
  const [shipSearch, setShipSearch]       = useState('');
  const [statusFilter, setStatusFilter]   = useState('all');
  const [showNewShip, setShowNewShip]     = useState(false);
  const [showImport, setShowImport]       = useState(false);
  const [createdShipments, setCreatedShipments] = useState([]);
  const [dispatches, setDispatches]       = useState(ACTIVE_DISPATCHES);
  const [dispatchForm, setDispatchForm]   = useState(null); // null=closed, {}=new, {..d}=edit
  const [deleteDispatch, setDeleteDispatch] = useState(null); // dispatch to confirm-delete
  const [copiedKey, setCopiedKey]         = useState(false);
  const [revealKey, setRevealKey]         = useState(false);
  // Returns
  const [returns, setReturns]             = useState(RETURNS_MOCK);
  const [returnFilter, setReturnFilter]   = useState('all');
  const [viewReturn, setViewReturn]       = useState(null);
  const [rejectTarget, setRejectTarget]   = useState(null);
  const [rejectNote, setRejectNote]       = useState('');
  // Integrations
  const [apiKeys, setApiKeys]             = useState(INTEGRATION_KEYS);
  const [webhooks, setWebhooks]           = useState(INTEGRATION_WEBHOOKS);
  const [keyForm, setKeyForm]             = useState(null); // null=closed, {}=open
  const [webhookForm, setWebhookForm]     = useState(null); // null=closed, {}=new, {...w}=edit
  const [newKeyRevealed, setNewKeyRevealed] = useState(null); // { name, key } — shown once after creation
  const [copiedIntKey, setCopiedIntKey]   = useState(null); // key id
  const [intTab, setIntTab]               = useState('keys');
  const [copiedWaybill, setCopiedWaybill] = useState(null);
  const [notifFilter, setNotifFilter]     = useState('all');

  const account = ENTERPRISE_ACCOUNTS[currentUser?.email] || {
    company: currentUser?.name || 'Enterprise', accountId: 'ENT-001', plan: 'Enterprise',
    sla: '99.5% uptime', accountManager: 'LocQar Support', amEmail: 'support@locqar.com',
    contractEnd: '2026-12-31', apiKey: 'lq_live_demo_key_xxxxxxxxxxxxxxxxxxxx',
    webhookUrl: '', ratePerShipment: 50, terminals: ['Achimota Mall'],
    contacts: [{ name: currentUser?.name || 'User', role: 'Primary', email: currentUser?.email, phone: currentUser?.phone }],
  };

  // Settings state
  const [settingsTab, setSettingsTab]       = useState('profile');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm]       = useState({ name: account.company, industry: 'E-commerce', address: '', website: '' });
  const [teamContacts, setTeamContacts]     = useState(account.contacts.map((c, i) => ({ ...c, id: `c-${i}` })));
  const [contactForm, setContactForm]       = useState(null);
  const [notifPrefs, setNotifPrefs]         = useState({ pkg_in_locker: true, pkg_delivered: true, pkg_exception: true, dispatch_updated: false, sla_warning: true, sla_breach: true, inv_generated: true, inv_due: true });
  const [notifEmails, setNotifEmails]       = useState([account.contacts[0]?.email ?? ''].filter(Boolean));
  const [notifEmailInput, setNotifEmailInput] = useState('');
  const [twoFA, setTwoFA]                   = useState(false);
  const [ipAllowlist, setIpAllowlist]       = useState(['0.0.0.0/0']);
  const [ipInput, setIpInput]               = useState('');
  // Billing state
  const [invoiceList, setInvoiceList]       = useState(INVOICES);
  const [payingInvoice, setPayingInvoice]   = useState(null);
  const [payRef, setPayRef]                 = useState('');
  const [editingPayment, setEditingPayment] = useState(false);
  const [paymentForm, setPaymentForm]       = useState({ type: 'bank', bank: 'GCB Bank', accountNo: '1234567890', accountName: account.company, branch: 'Accra Central', momoProvider: 'MTN MoMo', momoNumber: '', momoName: account.company });
  const [secSessions, setSecSessions]       = useState([
    { id: 1, device: 'Chrome on macOS',    location: 'Accra, Ghana',  ip: '41.66.25.142', lastActive: '2026-03-05 14:23', current: true },
    { id: 2, device: 'Firefox on Windows', location: 'Kumasi, Ghana', ip: '41.75.10.88',  lastActive: '2026-03-04 09:11', current: false },
  ]);
  // Support
  const [tickets, setTickets]               = useState(SUPPORT_TICKETS);
  const [ticketForm, setTicketForm]         = useState(null); // null=closed, {}=new
  const [viewTicket, setViewTicket]         = useState(null);
  const [ticketReply, setTicketReply]       = useState('');
  // Track
  const [trackQuery, setTrackQuery]         = useState('');
  const [trackResult, setTrackResult]       = useState(null);
  const [trackSearched, setTrackSearched]   = useState(false);
  // Analytics date range
  const [analyticsPeriod, setAnalyticsPeriod] = useState('6m'); // '3m','6m','1y'
  // Dispatch reassign
  const [reassignTarget, setReassignTarget] = useState(null); // dispatch being reassigned
  const [reassignCourier, setReassignCourier] = useState('');
  const [reassignPhone, setReassignPhone]   = useState('');
  // Returns initiate
  const [initiateReturn, setInitiateReturn] = useState(false);
  const [returnInitForm, setReturnInitForm] = useState({ waybill: '', reason: 'wrong_item', notes: '' });

  const allShipments = useMemo(() => {
    const matched = packagesData.filter(p =>
      (currentUser?.phone && p.phone === currentUser.phone) ||
      (currentUser?.email && p.email === currentUser.email)
    );
    const base = matched.length > 0 ? matched : packagesData;
    return [...createdShipments, ...base];
  }, [currentUser, createdShipments]);

  const filteredShipments = useMemo(() => {
    const q = shipSearch.toLowerCase();
    return allShipments.filter(p => {
      const matchQ = !shipSearch || p.waybill.toLowerCase().includes(q) || p.customer?.toLowerCase().includes(q) || p.destination?.toLowerCase().includes(q);
      const matchSub = !activeSubMenu || activeSubMenu === 'All'
        || (activeSubMenu === 'In Transit' && ['in_transit_to_locker','in_transit_to_home','accepted'].includes(p.status))
        || (activeSubMenu === 'In Lockers' && p.status === 'delivered_to_locker')
        || (activeSubMenu === 'Completed'  && ['picked_up','delivered_to_home'].includes(p.status))
        || (activeSubMenu === 'Exceptions' && ['expired','failed'].includes(p.status));
      const matchStatus = statusFilter === 'all' || p.status === statusFilter;
      return matchQ && matchSub && matchStatus;
    });
  }, [allShipments, shipSearch, activeSubMenu, statusFilter]);

  const kpis = useMemo(() => ({
    total:     allShipments.length,
    active:    allShipments.filter(p => ['assigned','accepted','in_transit_to_locker','in_transit_to_home'].includes(p.status)).length,
    inLocker:  allShipments.filter(p => p.status === 'delivered_to_locker').length,
    completed: allShipments.filter(p => ['picked_up','delivered_to_home'].includes(p.status)).length,
    value:     allShipments.reduce((s, p) => s + (p.value || 0), 0),
  }), [allShipments]);

  const unread    = notifs.filter(n => !n.read).length;
  const pendingInv = INVOICES.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);

  const toggleMenu = (id) => setExpandedMenus(p => p.includes(id) ? p.filter(m => m !== id) : [...p, id]);

  const nav = (id, sub = null) => {
    setActiveMenu(id);
    setActiveSubMenu(sub);
    setMobileOpen(false);
    setShowProfile(false);
  };

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));

  const copyKey = () => {
    navigator.clipboard.writeText(account.apiKey).catch(() => {});
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const copyWaybill = (w) => {
    navigator.clipboard.writeText(w).catch(() => {});
    setCopiedWaybill(w);
    setTimeout(() => setCopiedWaybill(null), 1500);
  };

  // Stub toast — no-op since there's no toast UI yet
  const addToast = (msg, type) => {};

  const PAGE_LABEL = {
    dashboard: 'Dashboard', shipments: 'Shipments', dispatch: 'Active Dispatch',
    notifications: 'Notifications', sla: 'SLA Monitor',
    invoices: 'Invoices', analytics: 'Analytics', integrations: 'Integrations', account: 'Account & Settings',
    returns: 'Returns',
    support: 'Support & Help',
    track: 'Track Shipment',
  };

  // ── Sidebar ──────────────────────────────────────────────────────────────
  const sidebar = (
    <aside
      className={`${isCollapsed ? 'w-20' : 'w-64'} border-r flex flex-col transition-all duration-200 flex-shrink-0`}
      style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}
    >
      {/* Logo row */}
      <div className="h-16 flex items-center justify-between px-4 border-b flex-shrink-0" style={{ borderColor: theme.border.primary }}>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <span className="font-black text-base tracking-tight" style={{ color: theme.text.primary }}>LocQar</span>
            <span className="text-xs px-1.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: '#818CF820', color: '#818CF8' }}>ENT</span>
          </div>
        )}
        {isCollapsed && (
          <span className="font-bold text-sm" style={{ color: theme.text.primary }}>LQ</span>
        )}
        {!isCollapsed && (
          <button onClick={() => setIsCollapsed(true)} className="p-1.5 rounded-lg" style={{ color: theme.icon.muted }}>
            <ChevronLeft size={16} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {ENT_MENU.map((group, gi) => (
          <div key={group.group} className={gi > 0 ? 'mt-5' : ''}>
            {!isCollapsed && (
              <p className="px-3 mb-1.5 text-xs font-semibold uppercase tracking-wider" style={{ color: theme.text.muted }}>{group.group}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = activeMenu === item.id;
                const hasUnread = item.id === 'notifications' && unread > 0;
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => { nav(item.id); if (item.subItems) toggleMenu(item.id); }}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                      style={{
                        backgroundColor: isActive ? theme.accent.light : 'transparent',
                        border: isActive ? `1px solid ${theme.accent.border}` : '1px solid transparent',
                        color: isActive ? theme.accent.primary : theme.text.secondary,
                      }}
                    >
                      <div className="relative flex-shrink-0">
                        <item.icon size={18} />
                        {hasUnread && <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: theme.status.error, color: '#fff', fontSize: '9px' }}>{unread}</span>}
                      </div>
                      {!isCollapsed && (
                        <>
                          <span className="flex-1 text-sm text-left">{item.label}</span>
                          {item.subItems && (
                            <ChevronDown size={14} className={`transition-transform ${expandedMenus.includes(item.id) ? 'rotate-180' : ''}`} style={{ color: theme.icon.muted }} />
                          )}
                        </>
                      )}
                    </button>
                    {!isCollapsed && item.subItems && expandedMenus.includes(item.id) && (
                      <div className="mt-0.5 ml-4 pl-3 space-y-0.5" style={{ borderLeft: `1px solid ${theme.border.primary}` }}>
                        {item.subItems.map(sub => (
                          <button
                            key={sub}
                            onClick={() => nav(item.id, sub)}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-sm transition-all"
                            style={{
                              color: activeSubMenu === sub && activeMenu === item.id ? theme.accent.primary : theme.text.muted,
                              backgroundColor: activeSubMenu === sub && activeMenu === item.id ? theme.accent.light : 'transparent',
                            }}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-2 border-t space-y-0.5" style={{ borderColor: theme.border.primary }}>
        <button
          onClick={() => nav('account')}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
          style={{
            backgroundColor: activeMenu === 'account' ? theme.accent.light : 'transparent',
            border: activeMenu === 'account' ? `1px solid ${theme.accent.border}` : '1px solid transparent',
            color: activeMenu === 'account' ? theme.accent.primary : theme.text.secondary,
          }}
        >
          <Settings size={18} />
          {!isCollapsed && <span className="text-sm">Account & Settings</span>}
        </button>
        {isCollapsed && (
          <button onClick={() => setIsCollapsed(false)} className="w-full flex items-center justify-center px-3 py-2 rounded-xl" style={{ color: theme.icon.muted }}>
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </aside>
  );

  // ── Header ───────────────────────────────────────────────────────────────
  const header = (
    <header className="h-16 border-b px-4 flex items-center justify-between flex-shrink-0 sticky top-0 z-30" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
      {/* Left */}
      <div className="flex items-center gap-3">
        <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg md:hidden" style={{ color: theme.icon.primary }}>
          <Menu size={20} />
        </button>
        {/* Search bar */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl border w-44 md:w-72" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
          <Search size={14} style={{ color: theme.icon.muted }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search..."
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: theme.text.primary }}
          />
          {search && <button onClick={() => setSearch('')} style={{ color: theme.text.muted }}><X size={13} /></button>}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Theme */}
        <button onClick={() => setThemeName(t => t === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
          {themeName === 'dark' ? <Sun size={17} style={{ color: theme.icon.primary }} /> : <Moon size={17} style={{ color: theme.icon.primary }} />}
        </button>

        {/* Notifications bell */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifPanel(p => !p); setShowProfile(false); }}
            className="relative p-2.5 rounded-xl border"
            style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}
          >
            <Bell size={17} style={{ color: theme.icon.primary }} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold" style={{ backgroundColor: theme.status.error, color: '#fff' }}>
                {unread}
              </span>
            )}
          </button>
          {showNotifPanel && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifPanel(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <div className="p-3.5 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                  <span className="font-semibold text-sm" style={{ color: theme.text.primary }}>Notifications {unread > 0 && <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs" style={{ backgroundColor: theme.status.error, color: '#fff' }}>{unread}</span>}</span>
                  {unread > 0 && <button onClick={markAllRead} className="text-xs" style={{ color: theme.accent.primary }}>Mark all read</button>}
                </div>
                {/* Filter pills */}
                <div className="flex gap-1 p-2 border-b" style={{ borderColor: theme.border.primary }}>
                  {['all','package','sla','billing','system'].map(f => (
                    <button key={f} onClick={() => setNotifFilter(f)} className="px-2.5 py-1 rounded-lg text-xs font-medium capitalize" style={{ backgroundColor: notifFilter === f ? theme.accent.light : 'transparent', color: notifFilter === f ? theme.accent.primary : theme.text.muted }}>
                      {f === 'all' ? 'All' : f}
                    </button>
                  ))}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y" style={{ borderColor: theme.border.primary }}>
                  {notifs.filter(n => notifFilter === 'all' || n.type === notifFilter).map(n => (
                    <button
                      key={n.id}
                      onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                      className="w-full text-left flex gap-3 p-3 transition-colors"
                      style={{ backgroundColor: n.read ? 'transparent' : `${n.color}08` }}
                    >
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: n.read ? 'transparent' : n.color }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{n.title}</p>
                        <p className="text-xs mt-0.5 line-clamp-1" style={{ color: theme.text.muted }}>{n.body}</p>
                        <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{n.time}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile */}
        <div className="relative hidden md:block pl-2 border-l" style={{ borderColor: theme.border.primary }}>
          <button
            onClick={() => { setShowProfile(p => !p); setShowNotifPanel(false); }}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl transition-colors hover:bg-white/5"
          >
            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold" style={{ backgroundColor: '#818CF820', color: '#818CF8', border: '2px solid #818CF830' }}>
              {(account.company || 'E').charAt(0)}
            </div>
            <div className="text-left hidden lg:block">
              <p className="text-sm font-medium leading-none" style={{ color: theme.text.primary }}>{account.company}</p>
              <p className="text-xs leading-none mt-0.5" style={{ color: theme.text.muted }}>{account.plan}</p>
            </div>
            <ChevronDown size={13} style={{ color: theme.icon.muted }} />
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border shadow-2xl z-50 overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0" style={{ backgroundColor: '#818CF820', color: '#818CF8' }}>
                      {(account.company || 'E').charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate" style={{ color: theme.text.primary }}>{account.company}</p>
                      <p className="text-xs truncate" style={{ color: theme.text.muted }}>{currentUser.email}</p>
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium" style={{ backgroundColor: '#818CF820', color: '#818CF8' }}>{account.plan}</span>
                    </div>
                  </div>
                </div>
                <div className="p-1.5">
                  {[
                    { label: 'Account & Settings', icon: Settings,   id: 'account' },
                    { label: 'Notifications',       icon: Bell,       id: 'notifications' },
                    { label: 'SLA Monitor',         icon: Activity,   id: 'sla' },
                  ].map(item => (
                    <button key={item.id} onClick={() => { nav(item.id); setShowProfile(false); }} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left">
                      <item.icon size={15} style={{ color: theme.icon.muted }} />
                      <span className="text-sm" style={{ color: theme.text.secondary }}>{item.label}</span>
                    </button>
                  ))}
                </div>
                <div className="p-1.5 border-t" style={{ borderColor: theme.border.primary }}>
                  <button onClick={onLogout} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-500/5 text-left">
                    <LogOut size={15} style={{ color: '#D48E8A' }} />
                    <span className="text-sm" style={{ color: '#D48E8A' }}>Sign out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );

  // ── Shared styles ─────────────────────────────────────────────────────────
  const card = { backgroundColor: theme.bg.card, borderColor: theme.border.primary };
  const inputStyle = { backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary };

  // ── Page: Dashboard ───────────────────────────────────────────────────────
  const renderDashboard = () => (
    <div className="space-y-5">
      {/* Welcome + alert */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold" style={{ color: theme.text.primary }}>Welcome back, {account.company}</h1>
          <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>{account.plan} · {account.accountId}</p>
        </div>
        {pendingInv > 0 && (
          <button onClick={() => nav('invoices')} className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm" style={{ backgroundColor: '#D4AA5A10', border: '1px solid #D4AA5A40', color: '#D4AA5A' }}>
            <CreditCard size={14} /> Invoice due: <strong>GH₵ {pendingInv.toLocaleString()}</strong>
          </button>
        )}
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Total Shipments', value: kpis.total,                              color: '#818CF8', icon: Package,     sub: 'All time',        onClick: () => nav('shipments', 'All') },
          { label: 'Active',          value: kpis.active,                             color: '#7EA8C9', icon: Truck,       sub: 'In transit',      onClick: () => nav('shipments', 'In Transit') },
          { label: 'In Lockers',      value: kpis.inLocker,                           color: '#81C995', icon: Grid3X3,    sub: 'Awaiting pickup', onClick: () => nav('shipments', 'In Lockers') },
          { label: 'Total Value',     value: `GH₵ ${kpis.value.toLocaleString()}`,   color: '#D4AA5A', icon: DollarSign, sub: 'Shipment value',  onClick: () => nav('invoices') },
        ].map(({ label, value, color, icon: Icon, sub, onClick }) => (
          <button key={label} onClick={onClick} className="p-4 rounded-2xl border text-left transition-all hover:shadow-md" style={card}>
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.text.muted }}>{label}</p>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                <Icon size={13} style={{ color }} />
              </div>
            </div>
            <p className="text-xl font-bold" style={{ color: theme.text.primary }}>{value}</p>
            <p className="text-xs mt-0.5 flex items-center gap-1" style={{ color: theme.text.muted }}>{sub} <ArrowUpRight size={11} /></p>
          </button>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Monthly trend */}
        <div className="p-5 rounded-2xl border" style={card}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Shipment Volume</h3>
            <span className="text-xs font-semibold" style={{ color: '#81C995' }}>Last 8 months</span>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={MONTHLY_DATA} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: theme.text.muted }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: theme.text.muted }} axisLine={false} tickLine={false} width={30} />
              <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12, color: theme.text.primary, fontSize: 12 }} />
              <Bar dataKey="shipments" fill="#818CF8" radius={[4,4,0,0]} name="Shipments" />
              <Bar dataKey="completed" fill="#81C995" radius={[4,4,0,0]} name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Performance */}
        <div className="p-5 rounded-2xl border space-y-3.5" style={card}>
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Account Performance</h3>
          {[
            { label: 'On-time delivery',   value: '94.2%', bar: 94, color: '#81C995' },
            { label: 'Pickup rate',        value: '88.7%', bar: 89, color: '#7EA8C9' },
            { label: 'Locker utilization', value: '71.3%', bar: 71, color: '#818CF8' },
          ].map(({ label, value, bar, color }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span style={{ color: theme.text.muted }}>{label}</span>
                <span className="font-semibold" style={{ color: theme.text.primary }}>{value}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                <div className="h-full rounded-full" style={{ width: `${bar}%`, backgroundColor: color }} />
              </div>
            </div>
          ))}
          <div className="pt-2 grid grid-cols-2 gap-3 border-t" style={{ borderColor: theme.border.primary }}>
            <div><p className="text-xs" style={{ color: theme.text.muted }}>Avg delivery time</p><p className="text-sm font-bold mt-0.5" style={{ color: theme.text.primary }}>1.8 days</p></div>
            <div><p className="text-xs" style={{ color: theme.text.muted }}>Active terminals</p><p className="text-sm font-bold mt-0.5" style={{ color: theme.text.primary }}>{account.terminals.length}</p></div>
          </div>
        </div>
      </div>

      {/* Recent shipments */}
      <div className="rounded-2xl border overflow-hidden" style={card}>
        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Recent Shipments</h3>
          <button onClick={() => nav('shipments', 'All')} className="text-xs flex items-center gap-1" style={{ color: theme.accent.primary }}>View all <ChevronRight size={12} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: theme.bg.tertiary }}>
                {['Waybill', 'Recipient', 'Destination', 'Status', 'Value'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: theme.text.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allShipments.slice(0, 6).map((pkg, i) => (
                <tr key={pkg.id} style={{ borderTop: i > 0 ? `1px solid ${theme.border.primary}` : 'none' }}>
                  <td className="px-4 py-3"><span className="font-mono text-xs font-bold" style={{ color: theme.text.primary }}>{pkg.waybill}</span></td>
                  <td className="px-4 py-3 text-sm" style={{ color: theme.text.secondary }}>{pkg.customer}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: theme.text.secondary }}>{pkg.destination}</td>
                  <td className="px-4 py-3"><StatusBadge status={pkg.status} /></td>
                  <td className="px-4 py-3 text-sm font-mono font-semibold" style={{ color: theme.text.primary }}>GH₵ {pkg.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.text.muted }}>Quick Actions</p>
        <button onClick={() => nav('track')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium"
          style={{ borderColor: theme.border.primary, color: theme.text.secondary, backgroundColor: theme.bg.card }}>
          <Search size={14} /> Track Package
        </button>
        <button onClick={() => setShowNewShip(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium"
          style={{ borderColor: theme.border.primary, color: theme.text.secondary, backgroundColor: theme.bg.card }}>
          <Plus size={14} /> New Shipment
        </button>
        <button onClick={() => nav('support')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm font-medium"
          style={{ borderColor: theme.border.primary, color: theme.text.secondary, backgroundColor: theme.bg.card }}>
          <HelpCircle size={14} /> Get Support
        </button>
      </div>

      {/* Terminals */}
      <div className="rounded-2xl border overflow-hidden" style={card}>
        <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Contracted Terminals</h3>
        </div>
        <div className="grid md:grid-cols-3">
          {account.terminals.map((t, i) => (
            <div key={t} className="flex items-center gap-3 p-4" style={{ borderRight: i < account.terminals.length - 1 ? `1px solid ${theme.border.primary}` : 'none' }}>
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#81C99520' }}>
                <MapPin size={14} style={{ color: '#81C995' }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{t}</p>
                <p className="text-xs" style={{ color: '#81C995' }}>Active</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Page: Shipments ───────────────────────────────────────────────────────
  const renderShipments = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Shipments{activeSubMenu ? ` — ${activeSubMenu}` : ''}</h2>
          <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{filteredShipments.length} shipment{filteredShipments.length !== 1 ? 's' : ''} · GH₵ {filteredShipments.reduce((s, p) => s + (p.value || 0), 0).toLocaleString()}</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card, color: theme.text.secondary }}>
            <Download size={14} /> Export
          </button>
          <button
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium"
            style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card, color: theme.text.secondary }}
          >
            <Upload size={14} /> Import
          </button>
          <button
            onClick={() => setShowNewShip(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium"
            style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card, color: theme.text.secondary }}
          >
            <Plus size={14} /> New Shipment
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-48 flex items-center gap-2 px-3 py-2.5 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <Search size={14} style={{ color: theme.icon.muted }} />
          <input value={shipSearch} onChange={e => setShipSearch(e.target.value)} placeholder="Waybill, recipient, destination…" className="flex-1 bg-transparent text-sm outline-none" style={{ color: theme.text.primary }} />
          {shipSearch && <button onClick={() => setShipSearch('')} style={{ color: theme.text.muted }}><X size={13} /></button>}
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-2.5 rounded-xl border text-sm" style={inputStyle}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="at_warehouse">At Warehouse</option>
          <option value="in_transit_to_locker">In Transit</option>
          <option value="delivered_to_locker">In Locker</option>
          <option value="picked_up">Picked Up</option>
          <option value="expired">Expired</option>
        </select>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={card}>
        {filteredShipments.length === 0 ? (
          <div className="text-center py-12">
            <Package size={36} className="mx-auto mb-2" style={{ color: theme.text.muted }} />
            <p className="text-sm" style={{ color: theme.text.muted }}>No shipments match your filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: theme.bg.tertiary }}>
                  {['Waybill', 'Recipient', 'Destination', 'Status', 'Value', 'Method'].map(h => (
                    <th key={h} className="text-left px-4 py-2.5 text-xs font-semibold uppercase tracking-wide" style={{ color: theme.text.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((pkg, i) => (
                  <tr key={pkg.id} className="hover:bg-white/5 transition-colors" style={{ borderTop: i > 0 ? `1px solid ${theme.border.primary}` : 'none' }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold" style={{ color: theme.text.primary }}>{pkg.waybill}</span>
                        <button onClick={() => copyWaybill(pkg.waybill)} style={{ color: theme.icon.muted }}>
                          {copiedWaybill === pkg.waybill ? <Check size={11} style={{ color: '#81C995' }} /> : <Copy size={11} />}
                        </button>
                        {pkg.cod && <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: '#D4AA5A15', color: '#D4AA5A' }}>COD</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm" style={{ color: theme.text.primary }}>{pkg.customer}</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm" style={{ color: theme.text.secondary }}>{pkg.destination}</p>
                      {pkg.locker && pkg.locker !== '-' && <p className="text-xs font-mono" style={{ color: theme.text.muted }}>#{pkg.locker}</p>}
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={pkg.status} /></td>
                    <td className="px-4 py-3 text-sm font-mono font-semibold" style={{ color: theme.text.primary }}>GH₵ {pkg.value}</td>
                    <td className="px-4 py-3 text-xs capitalize" style={{ color: theme.text.muted }}>{pkg.deliveryMethod?.replace(/_/g, ' ')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  // ── Page: Dispatch ────────────────────────────────────────────────────────
  const handleSaveDispatch = (d) => {
    setDispatches(prev => prev.some(x => x.id === d.id) ? prev.map(x => x.id === d.id ? d : x) : [d, ...prev]);
    setDispatchForm(null);
  };
  const handleDeleteDispatch = (id) => {
    setDispatches(prev => prev.filter(x => x.id !== id));
    setDeleteDispatch(null);
  };

  const renderDispatch = () => {
    const statusInfo = (s) => DISPATCH_STATUSES.find(x => x.id === s) ?? DISPATCH_STATUSES[0];
    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Active Dispatch</h2>
            <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>Couriers currently handling your packages</p>
          </div>
          <button
            onClick={() => setDispatchForm({})}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium"
            style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card, color: theme.text.secondary }}
          >
            <Plus size={14} /> New Dispatch
          </button>
        </div>

        {/* Summary metrics */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'In Transit',      value: dispatches.filter(d => d.status === 'in_transit').length,   color: '#818CF8', icon: Truck },
            { label: 'Pkgs Dispatched', value: dispatches.reduce((s, d) => s + (d.packages || 0), 0),      color: '#7EA8C9', icon: Package },
            { label: 'Arrived Today',   value: dispatches.filter(d => d.status === 'arrived').length,      color: '#81C995', icon: CheckCircle2 },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="p-4 rounded-2xl border" style={card}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                  <Icon size={16} style={{ color }} />
                </div>
                <div>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{label}</p>
                  <p className="text-xl font-bold mt-0.5" style={{ color: theme.text.primary }}>{value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dispatch cards */}
        {dispatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border" style={card}>
            <Truck size={32} className="mb-3" style={{ color: theme.text.muted }} />
            <p style={{ color: theme.text.secondary, fontWeight: 500 }}>No dispatches yet</p>
            <p style={{ color: theme.text.muted, fontSize: 13, marginTop: 4 }}>Create a new dispatch to track courier deliveries</p>
            <button onClick={() => setDispatchForm({})} className="mt-4 flex items-center gap-1.5 px-4 py-2 rounded-xl border text-sm"
              style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
              <Plus size={13} /> New Dispatch
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {dispatches.map(d => {
              const si = statusInfo(d.status);
              return (
                <div key={d.id} className="p-4 rounded-2xl border" style={card}>
                  {/* Card header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                        style={{ backgroundColor: '#818CF820', color: '#818CF8' }}>
                        {(d.courier || '?').charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>{d.courier}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{d.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ backgroundColor: `${si.color}18`, color: si.color }}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: si.color }} />
                        {si.label}
                      </span>
                      {/* Edit */}
                      <button onClick={() => setDispatchForm(d)}
                        className="p-1.5 rounded-lg"
                        style={{ color: theme.text.muted, background: theme.bg.input }}
                        title="Edit">
                        <FileText size={13} />
                      </button>
                      {/* Re-assign */}
                      <button onClick={() => { setReassignTarget(d); setReassignCourier(d.courier); setReassignPhone(d.phone); }}
                        className="p-2 rounded-xl text-xs font-medium border"
                        style={{ borderColor: theme.border.primary, color: '#D97706', backgroundColor: '#D9770610' }}
                        title="Re-assign courier">
                        <RefreshCw size={14} />
                      </button>
                      {/* Delete */}
                      <button onClick={() => setDeleteDispatch(d)}
                        className="p-1.5 rounded-lg"
                        style={{ color: '#EF4444', background: '#EF444410' }}
                        title="Delete">
                        <X size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Meta row */}
                  <div className="flex items-center gap-6 pt-3 border-t text-xs flex-wrap" style={{ borderColor: theme.border.primary }}>
                    <div><span style={{ color: theme.text.muted }}>Terminal: </span><span className="font-medium" style={{ color: theme.text.primary }}>{d.terminal}</span></div>
                    <div><span style={{ color: theme.text.muted }}>Packages: </span><span className="font-bold" style={{ color: '#818CF8' }}>{d.packages}</span></div>
                    {d.eta && <div><span style={{ color: theme.text.muted }}>ETA: </span><span className="font-medium" style={{ color: theme.text.primary }}>{d.eta}</span></div>}
                    {d.dispatchedAt && <div><span style={{ color: theme.text.muted }}>Dispatched: </span><span className="font-medium" style={{ color: theme.text.primary }}>{d.dispatchedAt}</span></div>}
                  </div>

                  {/* Waybills */}
                  {d.waybills?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {d.waybills.map(w => (
                        <span key={w} className="font-mono text-xs px-2 py-0.5 rounded-lg"
                          style={{ backgroundColor: theme.bg.tertiary ?? theme.bg.input, color: theme.text.secondary }}>
                          {w}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Delete confirmation */}
        {deleteDispatch && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.45)' }}>
            <div className="rounded-2xl p-6 w-80 shadow-2xl" style={{ background: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: '#EF444415' }}>
                <AlertTriangle size={20} style={{ color: '#EF4444' }} />
              </div>
              <h3 style={{ color: theme.text.primary, fontWeight: 700, textAlign: 'center', fontSize: 15, marginBottom: 6 }}>Delete Dispatch?</h3>
              <p style={{ color: theme.text.muted, textAlign: 'center', fontSize: 13, marginBottom: 20 }}>
                Remove dispatch <strong style={{ color: theme.text.primary }}>{deleteDispatch.id}</strong> for {deleteDispatch.courier}? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteDispatch(null)} className="flex-1 py-2.5 rounded-xl border text-sm"
                  style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
                <button onClick={() => handleDeleteDispatch(deleteDispatch.id)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
                  style={{ background: '#EF4444' }}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Re-assign Modal */}
        {reassignTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="rounded-2xl shadow-2xl w-full max-w-sm mx-4" style={{ background: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: theme.border.primary }}>
                <h3 className="font-bold" style={{ color: theme.text.primary }}>Re-assign Courier</h3>
                <button onClick={() => setReassignTarget(null)} style={{ color: theme.text.muted }}><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-sm" style={{ color: theme.text.muted }}>Dispatch <span className="font-mono font-bold" style={{ color: theme.text.primary }}>{reassignTarget?.id}</span> · {reassignTarget?.packages} packages</p>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>New Courier Name</label>
                  <input value={reassignCourier} onChange={e => setReassignCourier(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>Phone</label>
                  <input value={reassignPhone} onChange={e => setReassignPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
                </div>
              </div>
              <div className="px-5 py-4 flex gap-3 border-t" style={{ borderColor: theme.border.primary }}>
                <button onClick={() => setReassignTarget(null)} className="flex-1 py-2.5 rounded-xl border text-sm"
                  style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
                <button
                  onClick={() => {
                    setDispatches(prev => prev.map(d => d.id === reassignTarget.id ? { ...d, courier: reassignCourier, phone: reassignPhone } : d));
                    setReassignTarget(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: 'linear-gradient(135deg,#D97706,#F59E0B)', color: '#fff' }}>
                  Re-assign
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Page: Notifications ───────────────────────────────────────────────────
  const renderNotifications = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Notifications</h2>
          <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>{unread} unread</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-sm px-3 py-1.5 rounded-xl border" style={{ borderColor: theme.border.primary, color: theme.accent.primary, backgroundColor: theme.bg.card }}>
            Mark all read
          </button>
        )}
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'all',     label: 'All',     count: notifs.length },
          { id: 'package', label: 'Packages',count: notifs.filter(n => n.type === 'package').length },
          { id: 'sla',     label: 'SLA',     count: notifs.filter(n => n.type === 'sla').length },
          { id: 'billing', label: 'Billing', count: notifs.filter(n => n.type === 'billing').length },
          { id: 'system',  label: 'System',  count: notifs.filter(n => n.type === 'system').length },
        ].map(f => (
          <button key={f.id} onClick={() => setNotifFilter(f.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all" style={{
            backgroundColor: notifFilter === f.id ? theme.accent.light : theme.bg.card,
            borderColor: notifFilter === f.id ? theme.accent.border : theme.border.primary,
            color: notifFilter === f.id ? theme.accent.primary : theme.text.secondary,
          }}>
            {f.label}
            <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ backgroundColor: notifFilter === f.id ? theme.accent.primary : theme.bg.tertiary, color: notifFilter === f.id ? '#fff' : theme.text.muted }}>
              {f.count}
            </span>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border overflow-hidden" style={card}>
        {notifs.filter(n => notifFilter === 'all' || n.type === notifFilter).map((n, i, arr) => (
          <button
            key={n.id}
            onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
            className="w-full text-left flex gap-4 p-4 hover:bg-white/3 transition-colors"
            style={{ borderBottom: i < arr.length - 1 ? `1px solid ${theme.border.primary}` : 'none', backgroundColor: n.read ? 'transparent' : `${n.color}08` }}
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${n.color}15` }}>
              {n.type === 'package' ? <Package size={16} style={{ color: n.color }} />
               : n.type === 'sla' ? <AlertOctagon size={16} style={{ color: n.color }} />
               : n.type === 'billing' ? <CreditCard size={16} style={{ color: n.color }} />
               : <Shield size={16} style={{ color: n.color }} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold" style={{ color: theme.text.primary }}>{n.title}</p>
                <span className="text-xs flex-shrink-0" style={{ color: theme.text.muted }}>{n.time}</span>
              </div>
              <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{n.body}</p>
            </div>
            {!n.read && <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: n.color }} />}
          </button>
        ))}
      </div>
    </div>
  );

  // ── Page: SLA Monitor ─────────────────────────────────────────────────────
  const renderSLA = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>SLA Monitor</h2>
        <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>Contract compliance for {account.company}</p>
      </div>

      {/* Contract vs Actual */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Contracted terms */}
        <div className="p-5 rounded-2xl border" style={card}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#818CF820' }}>
              <Shield size={14} style={{ color: '#818CF8' }} />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Contracted Terms</h3>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Delivery Window',  value: SLA_CONTRACTED.deliveryWindow },
              { label: 'Pickup Window',    value: SLA_CONTRACTED.pickupWindow },
              { label: 'Uptime Guarantee', value: SLA_CONTRACTED.uptime },
              { label: 'Support Response', value: SLA_CONTRACTED.support },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span style={{ color: theme.text.muted }}>{label}</span>
                <span className="font-semibold" style={{ color: theme.text.primary }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actual metrics */}
        <div className="p-5 rounded-2xl border space-y-3" style={card}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#81C99520' }}>
              <Activity size={14} style={{ color: '#81C995' }} />
            </div>
            <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Actual Performance</h3>
          </div>
          {[
            { label: 'On-time delivery',   value: `${SLA_ACTUAL.onTime}%`,      bar: SLA_ACTUAL.onTime,      target: 95,  color: SLA_ACTUAL.onTime >= 95 ? '#81C995' : '#D4AA5A' },
            { label: 'Pickup rate',        value: `${SLA_ACTUAL.pickupRate}%`,  bar: SLA_ACTUAL.pickupRate,  target: 90,  color: SLA_ACTUAL.pickupRate >= 90 ? '#81C995' : '#D4AA5A' },
            { label: 'Platform uptime',    value: `${SLA_ACTUAL.uptime}%`,      bar: SLA_ACTUAL.uptime,      target: 99.5,color: '#81C995' },
          ].map(({ label, value, bar, color }) => (
            <div key={label}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span style={{ color: theme.text.muted }}>{label}</span>
                <span className="font-semibold" style={{ color }}>{value}</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(bar, 100)}%`, backgroundColor: color }} />
              </div>
            </div>
          ))}
          <div className="pt-2 border-t" style={{ borderColor: theme.border.primary }}>
            <p className="text-xs" style={{ color: theme.text.muted }}>Avg delivery time</p>
            <p className="text-base font-bold mt-0.5" style={{ color: theme.text.primary }}>{SLA_ACTUAL.avgHours}h <span className="text-xs font-normal" style={{ color: '#81C995' }}>vs 24h target ✓</span></p>
          </div>
        </div>
      </div>

      {/* SLA Breaches */}
      <div className="rounded-2xl border overflow-hidden" style={card}>
        <div className="p-4 border-b flex items-center gap-2" style={{ borderColor: theme.border.primary }}>
          <AlertTriangle size={16} style={{ color: '#D4AA5A' }} />
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Active Breaches</h3>
          <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: '#D4AA5A20', color: '#D4AA5A' }}>{SLA_BREACHES.length}</span>
        </div>
        {SLA_BREACHES.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle2 size={32} className="mx-auto mb-2" style={{ color: '#81C995' }} />
            <p className="text-sm font-medium" style={{ color: '#81C995' }}>No active SLA breaches</p>
          </div>
        ) : SLA_BREACHES.map((b, i) => (
          <div key={b.waybill} className="flex items-center gap-4 p-4" style={{ borderTop: i > 0 ? `1px solid ${theme.border.primary}` : 'none' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D4AA5A20' }}>
              <Clock size={15} style={{ color: '#D4AA5A' }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-mono font-bold" style={{ color: theme.text.primary }}>{b.waybill}</p>
              <p className="text-xs" style={{ color: theme.text.muted }}>{b.issue} · {b.terminal}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ backgroundColor: '#D48E8A20', color: '#D48E8A' }}>+{b.days}d overdue</span>
              <button onClick={() => { setActiveMenu('support'); setTicketForm({ subject: `SLA Breach — ${b.waybill}`, category: 'delivery', priority: 'high', message: `Package ${b.waybill} at ${b.terminal} is ${b.days} day(s) overdue. Issue: ${b.issue}` }); }}
                className="text-xs px-2.5 py-1 rounded-lg font-semibold"
                style={{ backgroundColor: '#EF444415', color: '#EF4444' }}>
                Escalate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Historical Breach Log */}
      <div className="rounded-2xl border overflow-hidden" style={card}>
        <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Historical Breach Log</h3>
        </div>
        {[
          { waybill: 'LQ-2024-00005', issue: 'Pickup overdue', terminal: 'Accra Mall', days: 3, resolvedAt: '2026-02-15', resolution: 'Package picked up by recipient' },
          { waybill: 'LQ-2024-00009', issue: 'Delivery overdue', terminal: 'Junction Mall', days: 2, resolvedAt: '2026-02-02', resolution: 'Delivered on next route' },
          { waybill: 'LQ-2024-00014', issue: 'Pickup overdue', terminal: 'West Hills Mall', days: 5, resolvedAt: '2026-01-28', resolution: 'Customer collected after reminder SMS' },
        ].map((b, i) => (
          <div key={b.waybill} className="flex items-center gap-4 p-4 border-b last:border-0" style={{ borderColor: theme.border.primary }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#81C99520' }}>
              <CheckCircle2 size={15} style={{ color: '#81C995' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-mono font-bold" style={{ color: theme.text.primary }}>{b.waybill}</p>
              <p className="text-xs" style={{ color: theme.text.muted }}>{b.issue} · {b.terminal} · +{b.days}d overdue</p>
              <p className="text-xs mt-0.5" style={{ color: '#81C995' }}>{b.resolution}</p>
            </div>
            <span className="text-xs flex-shrink-0" style={{ color: theme.text.muted }}>Resolved {b.resolvedAt}</span>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Page: Invoices ────────────────────────────────────────────────────────
  const renderInvoices = () => {
    const pf = paymentForm;
    const isMomo = pf.type === 'momo';
    const MOMO_PROVIDERS = [
      { id: 'MTN MoMo', label: 'MTN MoMo', color: '#D97706', bg: '#D9770615' },
      { id: 'Telecel Cash', label: 'Telecel Cash', color: '#EF4444', bg: '#EF444415' },
      { id: 'AirtelTigo Money', label: 'AirtelTigo Money', color: '#3B82F6', bg: '#3B82F615' },
    ];
    const activeMomo = MOMO_PROVIDERS.find(m => m.id === pf.momoProvider) || MOMO_PROVIDERS[0];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Invoices</h2>
          <button
            onClick={() => {
              const csv = ['Invoice ID,Period,Shipments,Amount,Status,Due Date,Paid Date',
                ...invoiceList.map(i => `${i.id},${i.period},${i.shipments},${i.amount},${i.status},${i.dueDate},${i.paidDate || ''}`)
              ].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a'); a.href = url; a.download = 'locqar-invoices.csv'; a.click();
              URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium"
            style={{ borderColor: theme.border.primary, color: theme.text.secondary, backgroundColor: theme.bg.card }}
          >
            <Download size={13} /> Export Statement
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { label: 'Outstanding', value: `GH₵ ${invoiceList.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0).toLocaleString()}`, color: '#D4AA5A', sub: `${invoiceList.filter(i => i.status === 'pending').length} invoice(s) pending` },
            { label: 'Paid (YTD)', value: `GH₵ ${invoiceList.filter(i => i.status === 'paid').reduce((s, i) => s + i.amount, 0).toLocaleString()}`, color: '#81C995', sub: `${invoiceList.filter(i => i.status === 'paid').length} invoices paid` },
            { label: 'Rate / Shipment', value: `GH₵ ${account.ratePerShipment}`, color: '#818CF8', sub: account.plan },
          ].map(({ label, value, color, sub }) => (
            <div key={label} className="p-4 rounded-2xl border" style={card}>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.text.muted }}>{label}</p>
              <p className="text-2xl font-black mt-2" style={{ color }}>{value}</p>
              <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* Invoice list */}
        <div className="rounded-2xl border overflow-hidden" style={card}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
            <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Invoice History</h3>
          </div>
          {invoiceList.map((inv, i) => (
            <div key={inv.id} className="flex items-center gap-4 p-4 border-b last:border-0" style={{ borderColor: theme.border.primary }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: inv.status === 'paid' ? '#81C99520' : '#D4AA5A20' }}>
                <FileText size={16} style={{ color: inv.status === 'paid' ? '#81C995' : '#D4AA5A' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold font-mono" style={{ color: theme.text.primary }}>{inv.id}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium capitalize"
                    style={{ backgroundColor: inv.status === 'paid' ? '#81C99520' : '#D4AA5A20', color: inv.status === 'paid' ? '#81C995' : '#D4AA5A' }}>
                    {inv.status}
                  </span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>
                  {inv.period} · {inv.shipments} shipments {inv.paidDate ? `· Paid ${inv.paidDate}` : `· Due ${inv.dueDate}`}
                </p>
              </div>
              <p className="text-base font-bold font-mono" style={{ color: theme.text.primary }}>GH₵ {inv.amount.toLocaleString()}</p>
              <div className="flex items-center gap-2">
                {inv.status === 'pending' ? (
                  <button onClick={() => { setPayingInvoice(inv); setPayRef(''); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold"
                    style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff' }}>
                    Pay Now
                  </button>
                ) : (
                  <button className="text-xs px-3 py-2 rounded-xl border" style={{ borderColor: theme.border.primary, color: theme.text.muted }}>
                    Dispute
                  </button>
                )}
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs flex-shrink-0"
                  style={{ borderColor: theme.border.primary, color: theme.text.muted, backgroundColor: theme.bg.tertiary }}>
                  <Download size={12} /> PDF
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pay Now Modal */}
        {payingInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="rounded-2xl shadow-2xl w-full max-w-md mx-4" style={{ background: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: theme.border.primary }}>
                <div>
                  <h3 className="font-bold" style={{ color: theme.text.primary }}>Pay Invoice</h3>
                  <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{payingInvoice.id} · GH₵ {payingInvoice.amount.toLocaleString()}</p>
                </div>
                <button onClick={() => setPayingInvoice(null)} style={{ color: theme.text.muted }}><X size={16} /></button>
              </div>
              <div className="p-6 space-y-4">
                {isMomo ? (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: `${activeMomo.color}12`, border: `1px solid ${activeMomo.color}30` }}>
                    <p className="text-xs font-semibold mb-3" style={{ color: activeMomo.color }}>{activeMomo.label} Payment</p>
                    {[
                      { label: 'Send To', value: '0551234567 (LocQar Payments)' },
                      { label: 'Amount', value: `GH₵ ${payingInvoice.amount.toLocaleString()}` },
                      { label: 'Reference', value: payingInvoice.id },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm mb-2">
                        <span style={{ color: theme.text.muted }}>{label}</span>
                        <span className="font-semibold font-mono" style={{ color: theme.text.primary }}>{value}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 rounded-xl" style={{ backgroundColor: '#818CF808', border: `1px solid #818CF825` }}>
                    <p className="text-xs font-semibold mb-3" style={{ color: '#818CF8' }}>Bank Transfer Details</p>
                    {[
                      { label: 'Bank', value: pf.bank },
                      { label: 'Account No.', value: pf.accountNo },
                      { label: 'Account Name', value: pf.accountName },
                      { label: 'Amount', value: `GH₵ ${payingInvoice.amount.toLocaleString()}` },
                      { label: 'Reference', value: payingInvoice.id },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between text-sm mb-2">
                        <span style={{ color: theme.text.muted }}>{label}</span>
                        <span className="font-semibold font-mono" style={{ color: theme.text.primary }}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>
                    {isMomo ? 'MoMo Transaction ID' : 'Bank Transaction Reference'}
                  </label>
                  <input value={payRef} onChange={e => setPayRef(e.target.value)}
                    placeholder={isMomo ? 'e.g. 1234567890' : 'e.g. GCB-2026-XXXX'}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none font-mono"
                    style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
                </div>
              </div>
              <div className="px-6 py-4 flex gap-3 border-t" style={{ borderColor: theme.border.primary }}>
                <button onClick={() => setPayingInvoice(null)} className="flex-1 py-2.5 rounded-xl border text-sm"
                  style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
                <button
                  disabled={!payRef.trim()}
                  onClick={() => {
                    setInvoiceList(prev => prev.map(i => i.id === payingInvoice.id ? { ...i, status: 'paid', paidDate: new Date().toISOString().slice(0, 10) } : i));
                    setPayingInvoice(null); setPayRef('');
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: payRef.trim() ? 'linear-gradient(135deg,#6366F1,#818CF8)' : theme.border.primary, color: payRef.trim() ? '#fff' : theme.text.muted }}>
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Page: Track Shipment ──────────────────────────────────────────────────
  const renderTrack = () => {
    const handleSearch = () => {
      if (!trackQuery.trim()) return;
      const q = trackQuery.trim().toUpperCase();
      const found = allShipments.find(p => p.waybill?.toUpperCase() === q || p.waybill?.toUpperCase().includes(q));
      setTrackResult(found || null);
      setTrackSearched(true);
    };

    const STATUS_STEPS = ['assigned', 'accepted', 'in_transit_to_locker', 'delivered_to_locker', 'picked_up'];
    const statusIdx = (s) => STATUS_STEPS.indexOf(s);
    const currentIdx = trackResult ? Math.max(0, statusIdx(trackResult.status)) : -1;
    const stepLabel = ['Assigned', 'Accepted', 'In Transit', 'In Locker', 'Picked Up'];

    return (
      <div className="space-y-5 max-w-2xl">
        <div>
          <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Track Shipment</h2>
          <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>Enter a waybill number to check real-time status</p>
        </div>

        {/* Search bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: theme.text.muted }} />
            <input
              value={trackQuery}
              onChange={e => setTrackQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="e.g. LQ-2024-00002"
              className="w-full pl-10 pr-4 py-3 rounded-2xl border text-sm outline-none font-mono"
              style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }}
            />
          </div>
          <button onClick={handleSearch}
            className="px-6 py-3 rounded-2xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff' }}>
            Track
          </button>
        </div>

        {/* Result */}
        {trackSearched && !trackResult && (
          <div className="p-8 rounded-2xl border text-center" style={card}>
            <PackageX size={36} className="mx-auto mb-3" style={{ color: theme.text.muted }} />
            <p className="font-semibold" style={{ color: theme.text.primary }}>No shipment found</p>
            <p className="text-sm mt-1" style={{ color: theme.text.muted }}>Check the waybill number and try again</p>
          </div>
        )}

        {trackResult && (
          <div className="space-y-4">
            {/* Package card */}
            <div className="p-5 rounded-2xl border" style={card}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.text.muted }}>Waybill</p>
                  <p className="text-xl font-black font-mono mt-1" style={{ color: theme.text.primary }}>{trackResult.waybill}</p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full font-semibold capitalize"
                  style={{ backgroundColor: '#818CF820', color: '#818CF8' }}>
                  {trackResult.status?.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { label: 'Recipient', value: trackResult.customer },
                  { label: 'Destination', value: trackResult.destination || trackResult.terminal },
                  { label: 'Description', value: trackResult.description },
                  { label: 'Value', value: `GH₵ ${(trackResult.value || 0).toLocaleString()}` },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{label}</p>
                    <p className="font-medium mt-0.5" style={{ color: theme.text.primary }}>{value || '—'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress bar */}
            <div className="p-5 rounded-2xl border" style={card}>
              <h3 className="font-semibold text-sm mb-5" style={{ color: theme.text.primary }}>Delivery Progress</h3>
              <div className="relative">
                {/* Line */}
                <div className="absolute top-4 left-4 right-4 h-0.5" style={{ backgroundColor: theme.border.primary }} />
                <div className="absolute top-4 left-4 h-0.5 transition-all"
                  style={{ width: `${currentIdx >= 0 ? (currentIdx / (STATUS_STEPS.length - 1)) * 100 : 0}%`, backgroundColor: '#818CF8' }} />
                {/* Steps */}
                <div className="relative flex justify-between">
                  {STATUS_STEPS.map((s, i) => (
                    <div key={s} className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all"
                        style={{
                          backgroundColor: i <= currentIdx ? '#818CF8' : theme.bg.card,
                          borderColor: i <= currentIdx ? '#818CF8' : theme.border.primary,
                        }}>
                        {i <= currentIdx ? <Check size={14} color="#fff" /> : <span className="text-xs" style={{ color: theme.text.muted }}>{i + 1}</span>}
                      </div>
                      <p className="text-xs text-center font-medium" style={{ color: i <= currentIdx ? '#818CF8' : theme.text.muted }}>{stepLabel[i]}</p>
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

  // ── Page: Support ─────────────────────────────────────────────────────────
  const renderSupport = () => {
    const PRIORITIES = { high: { label: 'High', color: '#EF4444', bg: '#EF444415' }, medium: { label: 'Medium', color: '#D97706', bg: '#D9770615' }, low: { label: 'Low', color: '#6B7280', bg: '#6B728015' } };
    const CATEGORIES = ['delivery', 'billing', 'technical', 'account', 'other'];

    const handleNewTicket = () => {
      if (!ticketForm?.subject?.trim()) return;
      const ticket = {
        id: `TKT-${String(tickets.length + 1).padStart(3, '0')}`,
        subject: ticketForm.subject,
        category: ticketForm.category || 'delivery',
        priority: ticketForm.priority || 'medium',
        status: 'open',
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        messages: [{ from: 'user', text: ticketForm.message || ticketForm.subject, time: new Date().toISOString().slice(0, 16).replace('T', ' ') }],
      };
      setTickets(prev => [ticket, ...prev]);
      setTicketForm(null);
    };

    const handleReply = (ticket) => {
      if (!ticketReply.trim()) return;
      const msg = { from: 'user', text: ticketReply, time: new Date().toISOString().slice(0, 16).replace('T', ' ') };
      setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, messages: [...t.messages, msg], updatedAt: new Date().toISOString().slice(0, 10) } : t));
      setViewTicket(prev => prev ? { ...prev, messages: [...prev.messages, msg] } : prev);
      setTicketReply('');
    };

    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Support &amp; Help</h2>
            <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>Raise tickets, chat with your account manager</p>
          </div>
          <button onClick={() => setTicketForm({ subject: '', category: 'delivery', priority: 'medium', message: '' })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff' }}>
            <Plus size={15} /> New Ticket
          </button>
        </div>

        {/* Quick contact cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl border" style={card}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#818CF815' }}>
                <User size={17} style={{ color: '#818CF8' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>Account Manager</p>
                <p className="text-xs" style={{ color: theme.text.muted }}>{account.accountManager}</p>
              </div>
            </div>
            <a href={`mailto:${account.amEmail}`}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-xl w-full justify-center font-medium"
              style={{ backgroundColor: '#818CF815', color: '#818CF8' }}>
              <Mail size={14} /> {account.amEmail}
            </a>
          </div>
          <div className="p-5 rounded-2xl border" style={card}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#81C99520' }}>
                <MessageSquare size={17} style={{ color: '#81C995' }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>24/7 Support</p>
                <p className="text-xs" style={{ color: theme.text.muted }}>Average response: 2 hours</p>
              </div>
            </div>
            <div className="text-sm px-4 py-2 rounded-xl text-center font-medium" style={{ backgroundColor: '#81C99520', color: '#81C995' }}>
              +233 30 200 0000
            </div>
          </div>
        </div>

        {/* Tickets list */}
        <div className="rounded-2xl border overflow-hidden" style={card}>
          <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
            <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Support Tickets</h3>
          </div>
          {tickets.length === 0 && (
            <div className="text-center py-10" style={{ color: theme.text.muted }}>
              <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No tickets yet</p>
            </div>
          )}
          {tickets.map((t, i) => (
            <button key={t.id} onClick={() => setViewTicket(t)}
              className="w-full text-left flex items-center gap-4 p-4 hover:bg-white/3 transition-colors border-b last:border-0"
              style={{ borderColor: theme.border.primary }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: PRIORITIES[t.priority]?.bg || '#6B728015' }}>
                <AlertCircle size={15} style={{ color: PRIORITIES[t.priority]?.color || '#6B7280' }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold font-mono" style={{ color: theme.text.primary }}>{t.id}</p>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: t.status === 'open' ? '#818CF815' : '#81C99515', color: t.status === 'open' ? '#818CF8' : '#81C995' }}>
                    {t.status}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: PRIORITIES[t.priority]?.bg, color: PRIORITIES[t.priority]?.color }}>
                    {PRIORITIES[t.priority]?.label}
                  </span>
                </div>
                <p className="text-sm mt-0.5 truncate" style={{ color: theme.text.secondary }}>{t.subject}</p>
                <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>Updated {t.updatedAt} · {t.messages.length} message(s)</p>
              </div>
              <ChevronRight size={16} style={{ color: theme.text.muted }} />
            </button>
          ))}
        </div>

        {/* New Ticket Modal */}
        {ticketForm !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="rounded-2xl shadow-2xl w-full max-w-md mx-4" style={{ background: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: theme.border.primary }}>
                <h3 className="font-bold" style={{ color: theme.text.primary }}>New Support Ticket</h3>
                <button onClick={() => setTicketForm(null)} style={{ color: theme.text.muted }}><X size={16} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>Subject</label>
                  <input value={ticketForm.subject} onChange={e => setTicketForm(p => ({ ...p, subject: e.target.value }))}
                    placeholder="Briefly describe your issue"
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>Category</label>
                    <select value={ticketForm.category} onChange={e => setTicketForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none capitalize"
                      style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>Priority</label>
                    <select value={ticketForm.priority} onChange={e => setTicketForm(p => ({ ...p, priority: e.target.value }))}
                      className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none capitalize"
                      style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                      {Object.entries(PRIORITIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>Message</label>
                  <textarea value={ticketForm.message} onChange={e => setTicketForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Describe your issue in detail..."
                    rows={4}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
                    style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
                </div>
              </div>
              <div className="px-6 py-4 flex gap-3 border-t" style={{ borderColor: theme.border.primary }}>
                <button onClick={() => setTicketForm(null)} className="flex-1 py-2.5 rounded-xl border text-sm"
                  style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
                <button onClick={handleNewTicket}
                  disabled={!ticketForm.subject.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: ticketForm.subject.trim() ? 'linear-gradient(135deg,#6366F1,#818CF8)' : theme.border.primary, color: ticketForm.subject.trim() ? '#fff' : theme.text.muted }}>
                  Submit Ticket
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Ticket Drawer */}
        {viewTicket && (
          <>
            <div className="fixed inset-0 z-40" style={{ background: 'rgba(0,0,0,0.35)' }} onClick={() => setViewTicket(null)} />
            <div className="fixed right-0 top-0 h-full z-50 flex flex-col" style={{ width: 480, background: theme.bg.card, borderLeft: `1px solid ${theme.border.primary}`, boxShadow: '-8px 0 40px rgba(0,0,0,0.18)' }}>
              <div className="flex items-center justify-between px-6 py-4 border-b flex-shrink-0" style={{ borderColor: theme.border.primary }}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.text.muted }}>{viewTicket.id}</p>
                  <h3 className="font-bold mt-0.5" style={{ color: theme.text.primary }}>{viewTicket.subject}</h3>
                </div>
                <button onClick={() => setViewTicket(null)} style={{ color: theme.text.muted }}><X size={18} /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {viewTicket.messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-xs px-4 py-3 rounded-2xl text-sm" style={{
                      backgroundColor: m.from === 'user' ? '#818CF8' : theme.bg.tertiary,
                      color: m.from === 'user' ? '#fff' : theme.text.primary,
                    }}>
                      <p>{m.text}</p>
                      <p className="text-xs mt-1.5 opacity-60">{m.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              {viewTicket.status === 'open' && (
                <div className="p-4 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
                  <input value={ticketReply} onChange={e => setTicketReply(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleReply(viewTicket)}
                    placeholder="Reply..."
                    className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
                  <button onClick={() => handleReply(viewTicket)}
                    className="px-4 py-2.5 rounded-xl font-semibold text-sm"
                    style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff' }}>
                    <Send size={15} />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  };

  // ── Page: Analytics ───────────────────────────────────────────────────────
  const renderAnalytics = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Analytics</h2>
        <div className="flex gap-1.5">
          {['3m','6m','1y'].map(p => (
            <button key={p} onClick={() => setAnalyticsPeriod(p)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
              style={{ backgroundColor: analyticsPeriod === p ? theme.accent.primary : theme.bg.card, borderColor: analyticsPeriod === p ? theme.accent.primary : theme.border.primary, color: analyticsPeriod === p ? '#fff' : theme.text.secondary }}>
              {p === '3m' ? '3 Months' : p === '6m' ? '6 Months' : '1 Year'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Avg / Month',   value: Math.round(MONTHLY_DATA.reduce((s, d) => s + d.shipments, 0) / MONTHLY_DATA.length), color: '#818CF8', suffix: ' shipments' },
          { label: 'Completion Rate',value: `${Math.round(MONTHLY_DATA.reduce((s, d) => s + d.completed, 0) / MONTHLY_DATA.reduce((s, d) => s + d.shipments, 0) * 100)}%`, color: '#81C995', suffix: '' },
          { label: 'YTD Shipments', value: MONTHLY_DATA.slice(5).reduce((s, d) => s + d.shipments, 0), color: '#7EA8C9', suffix: ' total' },
          { label: 'YTD Revenue',   value: `GH₵ ${(MONTHLY_DATA.slice(5).reduce((s, d) => s + d.shipments, 0) * account.ratePerShipment).toLocaleString()}`, color: '#D4AA5A', suffix: '' },
        ].map(({ label, value, color, suffix }) => (
          <div key={label} className="p-4 rounded-2xl border" style={card}>
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.text.muted }}>{label}</p>
            <p className="text-xl font-bold mt-2" style={{ color }}>{value}{suffix && <span className="text-xs font-normal ml-1" style={{ color: theme.text.muted }}>{suffix}</span>}</p>
          </div>
        ))}
      </div>

      {/* Monthly volume */}
      <div className="p-5 rounded-2xl border" style={card}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Monthly Shipment Volume</h3>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#818CF8' }} /> Total</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#81C995' }} /> Completed</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={MONTHLY_DATA} barCategoryGap="25%">
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: theme.text.muted }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: theme.text.muted }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12, color: theme.text.primary, fontSize: 12 }} />
            <Bar dataKey="shipments" fill="#818CF8" radius={[5,5,0,0]} name="Total Shipments" />
            <Bar dataKey="completed" fill="#81C995" radius={[5,5,0,0]} name="Completed" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Method + terminal split */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Delivery method */}
        <div className="p-5 rounded-2xl border" style={card}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: theme.text.primary }}>Delivery Methods</h3>
          <div className="space-y-3">
            {METHOD_DATA.map(m => (
              <div key={m.name}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded" style={{ backgroundColor: m.color }} /><span style={{ color: theme.text.muted }}>{m.name}</span></span>
                  <span className="font-semibold" style={{ color: theme.text.primary }}>{m.value}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                  <div className="h-full rounded-full" style={{ width: `${m.value}%`, backgroundColor: m.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Terminal utilization */}
        <div className="p-5 rounded-2xl border" style={card}>
          <h3 className="font-semibold text-sm mb-4" style={{ color: theme.text.primary }}>Terminal Utilization</h3>
          <div className="space-y-3">
            {account.terminals.map((t, i) => {
              const utilization = [68, 52, 41][i] || 55;
              return (
                <div key={t}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span style={{ color: theme.text.muted }}>{t}</span>
                    <span className="font-semibold" style={{ color: theme.text.primary }}>{utilization}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.tertiary }}>
                    <div className="h-full rounded-full" style={{ width: `${utilization}%`, backgroundColor: ['#818CF8','#7EA8C9','#81C995'][i] || '#B5A0D1' }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="pt-3 mt-2 border-t text-xs" style={{ borderColor: theme.border.primary }}>
            <div className="flex items-center gap-2" style={{ color: theme.text.muted }}>
              <Zap size={12} style={{ color: '#81C995' }} />
              <span>Busiest terminal: <strong style={{ color: theme.text.primary }}>{account.terminals[0]}</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Exceptions breakdown */}
      <div className="p-5 rounded-2xl border" style={card}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Exception Breakdown</h3>
          <button
            onClick={() => {
              const csv = ['Status,Count', 'Expired,3', 'Failed,1', 'Overdue Pickup,2'].join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = URL.createObjectURL(blob); const a = document.createElement('a');
              a.href = url; a.download = 'analytics-exceptions.csv'; a.click(); URL.revokeObjectURL(url);
            }}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border"
            style={{ borderColor: theme.border.primary, color: theme.text.secondary, backgroundColor: theme.bg.tertiary }}>
            <Download size={11} /> CSV
          </button>
        </div>
        <div className="space-y-3">
          {[
            { label: 'Expired in Locker',   count: 3, color: '#EF4444' },
            { label: 'Failed Delivery',      count: 1, color: '#D97706' },
            { label: 'Overdue Pickup',       count: 2, color: '#8B5CF6' },
            { label: 'Damaged in Transit',   count: 1, color: '#D48E8A' },
          ].map(e => (
            <div key={e.label} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                <span style={{ color: theme.text.muted }}>{e.label}</span>
              </div>
              <span className="font-bold" style={{ color: e.color }}>{e.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Page: Returns ──────────────────────────────────────────────────────────
  const renderReturns = () => {
    const stamp = (status, note) => ({ status, date: new Date().toISOString().slice(0, 10), note });

    const handleApprove = (ret) => {
      const waybill = 'LQ-RET-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      setReturns(prev => prev.map(r => r.id === ret.id ? {
        ...r, status: 'approved', returnWaybill: waybill,
        timeline: [...r.timeline, stamp('approved', 'Approved — customer to drop at locker')],
      } : r));
      setViewReturn(v => v?.id === ret.id ? { ...v, status: 'approved', returnWaybill: waybill } : v);
      addToast(`${ret.id} approved — return waybill ${waybill} issued`, 'success');
    };

    const handleReject = () => {
      setReturns(prev => prev.map(r => r.id === rejectTarget.id ? {
        ...r, status: 'rejected',
        timeline: [...r.timeline, stamp('rejected', rejectNote || 'Return rejected')],
      } : r));
      setViewReturn(v => v?.id === rejectTarget.id ? { ...v, status: 'rejected' } : v);
      addToast(`${rejectTarget.id} rejected`, 'info');
      setRejectTarget(null);
      setRejectNote('');
    };

    const handleMarkReceived = (ret) => {
      setReturns(prev => prev.map(r => r.id === ret.id ? {
        ...r, status: 'received',
        timeline: [...r.timeline, stamp('received', 'Package received at warehouse')],
      } : r));
      setViewReturn(v => v?.id === ret.id ? { ...v, status: 'received' } : v);
      addToast(`${ret.id} marked as received`, 'success');
    };

    const filtered = returns.filter(r => returnFilter === 'all' || r.status === returnFilter);

    const metrics = [
      { label: 'Pending Review', count: returns.filter(r => r.status === 'pending').length,    color: '#D97706', bg: '#D9770615', icon: PackageX },
      { label: 'In Progress',    count: returns.filter(r => ['approved','in_transit'].includes(r.status)).length, color: '#818CF8', bg: '#818CF815', icon: RotateCcw },
      { label: 'Received',       count: returns.filter(r => r.status === 'received').length,   color: '#81C995', bg: '#81C99515', icon: ClipboardCheck },
      { label: 'Total Value',    count: `GH₵ ${returns.reduce((s,r)=>s+r.value,0).toLocaleString()}`, color: '#8B5CF6', bg: '#8B5CF615', icon: DollarSign, isValue: true },
    ];

    const FILTER_TABS = [
      { id: 'all',        label: 'All',        count: returns.length },
      { id: 'pending',    label: 'Pending',    count: returns.filter(r=>r.status==='pending').length },
      { id: 'approved',   label: 'Approved',   count: returns.filter(r=>r.status==='approved').length },
      { id: 'in_transit', label: 'In Transit', count: returns.filter(r=>r.status==='in_transit').length },
      { id: 'received',   label: 'Received',   count: returns.filter(r=>r.status==='received').length },
      { id: 'rejected',   label: 'Rejected',   count: returns.filter(r=>r.status==='rejected').length },
    ];

    return (
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="text-lg font-bold" style={{ color: theme.text.primary }}>Returns</h2>
            <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>Reverse logistics — manage customer return requests</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setInitiateReturn(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ backgroundColor: '#EF444415', color: '#EF4444', border: '1px solid #EF444430' }}>
              <RotateCcw size={15} /> Initiate Return
            </button>
            <div className="flex items-center gap-2 text-xs px-3.5 py-2 rounded-xl" style={{ backgroundColor: '#818CF808', border: '1px solid #818CF820' }}>
              <RotateCcw size={12} style={{ color: '#818CF8' }} />
              <span style={{ color: theme.text.muted }}>7-day return window · All terminals</span>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4">
          {metrics.map(({ label, count, color, bg, icon: Icon, isValue }) => (
            <div key={label} className="p-4 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold" style={{ color: theme.text.muted }}>{label}</p>
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg }}>
                  <Icon size={13} style={{ color }} />
                </div>
              </div>
              <p className="text-2xl font-black" style={{ color: isValue ? color : theme.text.primary }}>{count}</p>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {FILTER_TABS.map(t => (
            <button key={t.id} onClick={() => setReturnFilter(t.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
              style={{
                backgroundColor: returnFilter === t.id ? '#818CF815' : theme.bg.secondary,
                color: returnFilter === t.id ? '#818CF8' : theme.text.secondary,
                border: `1px solid ${returnFilter === t.id ? '#818CF840' : theme.border.primary}`,
              }}>
              {t.label}
              {t.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{ backgroundColor: returnFilter === t.id ? '#818CF830' : theme.bg.tertiary, color: returnFilter === t.id ? '#818CF8' : theme.text.muted }}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Returns table */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 rounded-2xl border border-dashed" style={{ borderColor: theme.border.primary }}>
            <RotateCcw size={32} style={{ color: theme.text.muted, marginBottom: 12 }} />
            <p className="font-semibold" style={{ color: theme.text.primary }}>No returns in this category</p>
            <p className="text-sm mt-1" style={{ color: theme.text.muted }}>Returns initiated by customers will appear here</p>
          </div>
        ) : (
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: theme.bg.secondary }}>
                  {['Return ID', 'Original Waybill', 'Customer', 'Terminal', 'Reason', 'Requested', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: theme.text.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((ret, i) => {
                  const st = RETURN_STATUSES[ret.status];
                  const rsn = RETURN_REASONS[ret.reason];
                  return (
                    <tr key={ret.id} style={{ borderTop: i > 0 ? `1px solid ${theme.border.primary}` : 'none' }}>
                      <td className="px-4 py-3.5">
                        <p className="font-semibold text-xs font-mono" style={{ color: theme.text.primary }}>{ret.id}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs font-mono px-2 py-0.5 rounded-lg" style={{ backgroundColor: theme.bg.secondary, color: theme.text.secondary }}>{ret.originalWaybill}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{ret.customer}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{ret.phone}</p>
                      </td>
                      <td className="px-4 py-3.5 text-xs" style={{ color: theme.text.secondary }}>{ret.terminal}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: rsn.bg, color: rsn.color }}>{rsn.label}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs whitespace-nowrap" style={{ color: theme.text.muted }}>{ret.requestedAt}</td>
                      <td className="px-4 py-3.5">
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewReturn(ret)} className="p-1.5 rounded-lg border" style={{ borderColor: theme.border.primary, color: theme.icon.muted }}>
                            <Eye size={13} />
                          </button>
                          {ret.status === 'pending' && (
                            <>
                              <button onClick={() => handleApprove(ret)}
                                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium"
                                style={{ backgroundColor: '#81C99515', color: '#81C995', border: '1px solid #81C99530' }}>
                                <ThumbsUp size={11} /> Approve
                              </button>
                              <button onClick={() => { setRejectTarget(ret); setRejectNote(''); }}
                                className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium"
                                style={{ backgroundColor: '#EF444415', color: '#EF4444', border: '1px solid #EF444430' }}>
                                <ThumbsDown size={11} /> Reject
                              </button>
                            </>
                          )}
                          {ret.status === 'in_transit' && (
                            <button onClick={() => handleMarkReceived(ret)}
                              className="flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg font-medium"
                              style={{ backgroundColor: '#81C99515', color: '#81C995', border: '1px solid #81C99530' }}>
                              <ClipboardCheck size={11} /> Mark Received
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
        )}

        {/* Return Policy info */}
        <div className="flex items-start gap-3 p-4 rounded-2xl border" style={{ backgroundColor: '#818CF808', borderColor: '#818CF820' }}>
          <AlertCircle size={14} style={{ color: '#818CF8', marginTop: 1, flexShrink: 0 }} />
          <div className="text-xs space-y-1" style={{ color: theme.text.muted }}>
            <p className="font-semibold" style={{ color: theme.text.secondary }}>Return Policy</p>
            <p>Customers may initiate returns within <strong style={{ color: theme.text.primary }}>7 days</strong> of package collection. Approved returns must be dropped at the original terminal within <strong style={{ color: theme.text.primary }}>48 hours</strong>. Returns are subject to enterprise review — damaged or used items may be rejected.</p>
          </div>
        </div>

        {/* ── Return Detail Drawer ── */}
        {viewReturn && (() => {
          const ret = returns.find(r => r.id === viewReturn.id) || viewReturn;
          const st = RETURN_STATUSES[ret.status];
          const rsn = RETURN_REASONS[ret.reason];
          return (
            <div className="fixed inset-0 z-50 flex justify-end" style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
              <div className="w-full max-w-lg h-full flex flex-col" style={{ backgroundColor: theme.bg.card, borderLeft: `1px solid ${theme.border.primary}` }}>
                {/* Drawer header */}
                <div className="flex items-start justify-between p-5 border-b flex-shrink-0" style={{ borderColor: theme.border.primary }}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold" style={{ color: theme.text.primary }}>{ret.id}</h3>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</span>
                    </div>
                    <p className="text-xs" style={{ color: theme.text.muted }}>Original: <span className="font-mono" style={{ color: theme.text.secondary }}>{ret.originalWaybill}</span></p>
                  </div>
                  <button onClick={() => setViewReturn(null)} className="p-2 rounded-xl" style={{ color: theme.text.muted }}><X size={18} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                  {/* Customer + package info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3.5 rounded-xl border space-y-2" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
                      <p className="text-xs font-semibold" style={{ color: theme.text.muted }}>Customer</p>
                      <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>{ret.customer}</p>
                      <p className="text-xs font-mono" style={{ color: theme.text.muted }}>{ret.phone}</p>
                    </div>
                    <div className="p-3.5 rounded-xl border space-y-2" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
                      <p className="text-xs font-semibold" style={{ color: theme.text.muted }}>Package Value</p>
                      <p className="font-bold text-lg" style={{ color: '#818CF8' }}>GH₵ {ret.value.toLocaleString()}</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{ret.terminal}</p>
                    </div>
                  </div>

                  {/* Reason + notes */}
                  <div className="p-4 rounded-xl border space-y-2" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: rsn.bg, color: rsn.color }}>{rsn.label}</span>
                      <p className="text-xs" style={{ color: theme.text.muted }}>Requested {ret.requestedAt}</p>
                    </div>
                    {ret.notes && <p className="text-sm" style={{ color: theme.text.secondary }}>"{ret.notes}"</p>}
                    {!ret.notes && <p className="text-xs italic" style={{ color: theme.text.muted }}>No additional notes provided</p>}
                  </div>

                  {/* Return waybill */}
                  {ret.returnWaybill && (
                    <div className="flex items-center gap-3 p-3.5 rounded-xl border" style={{ backgroundColor: '#81C99508', borderColor: '#81C99530' }}>
                      <RotateCcw size={14} style={{ color: '#81C995', flexShrink: 0 }} />
                      <div>
                        <p className="text-xs font-semibold" style={{ color: '#81C995' }}>Return Waybill Issued</p>
                        <p className="text-sm font-mono font-bold mt-0.5" style={{ color: theme.text.primary }}>{ret.returnWaybill}</p>
                      </div>
                    </div>
                  )}

                  {/* Timeline */}
                  <div>
                    <p className="text-xs font-semibold mb-3" style={{ color: theme.text.muted }}>Timeline</p>
                    <div className="space-y-0">
                      {ret.timeline.map((t, ti) => {
                        const tst = RETURN_STATUSES[t.status];
                        return (
                          <div key={ti} className="flex gap-3">
                            <div className="flex flex-col items-center">
                              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: tst.bg }}>
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: tst.color }} />
                              </div>
                              {ti < ret.timeline.length - 1 && <div className="w-px flex-1 my-1" style={{ backgroundColor: theme.border.primary }} />}
                            </div>
                            <div className="pb-4">
                              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{tst.label}</p>
                              <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{t.date} · {t.note}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Drawer actions */}
                <div className="p-5 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
                  {ret.status === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(ret)}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                        style={{ background: 'linear-gradient(135deg,#10B981,#34D399)', color: '#fff' }}>
                        <ThumbsUp size={14} /> Approve Return
                      </button>
                      <button onClick={() => { setRejectTarget(ret); setRejectNote(''); setViewReturn(null); }}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border"
                        style={{ borderColor: '#EF444440', color: '#EF4444', backgroundColor: '#EF444408' }}>
                        <ThumbsDown size={14} /> Reject
                      </button>
                    </>
                  )}
                  {ret.status === 'in_transit' && (
                    <button onClick={() => handleMarkReceived(ret)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)' }}>
                      <ClipboardCheck size={14} /> Mark as Received
                    </button>
                  )}
                  {['received', 'rejected', 'approved'].includes(ret.status) && (
                    <button onClick={() => setViewReturn(null)}
                      className="flex-1 py-2.5 rounded-xl border text-sm"
                      style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                      Close
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── Reject Confirmation Modal ── */}
        {rejectTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EF444415' }}>
                  <ThumbsDown size={18} style={{ color: '#EF4444' }} />
                </div>
                <div>
                  <p className="font-bold" style={{ color: theme.text.primary }}>Reject Return</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{rejectTarget.id} · {rejectTarget.customer}</p>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>Reason for rejection (optional)</label>
                <textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)} rows={3}
                  placeholder="e.g. Item is used and not eligible for return..."
                  className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
                  style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setRejectTarget(null)}
                  className="flex-1 py-2.5 rounded-xl border text-sm"
                  style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
                <button onClick={handleReject}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: '#EF4444' }}>Confirm Reject</button>
              </div>
            </div>
          </div>
        )}

        {/* Initiate Return Modal */}
        {initiateReturn && (
          <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
            <div className="rounded-2xl shadow-2xl w-full max-w-md mx-4" style={{ background: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
              <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: theme.border.primary }}>
                <div>
                  <h3 className="font-bold" style={{ color: theme.text.primary }}>Initiate Return</h3>
                  <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>Create a return request for a delivered package</p>
                </div>
                <button onClick={() => setInitiateReturn(false)} style={{ color: theme.text.muted }}><X size={16} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>Waybill Number</label>
                  <input value={returnInitForm.waybill} onChange={e => setReturnInitForm(p => ({ ...p, waybill: e.target.value }))}
                    placeholder="e.g. LQ-2024-00002"
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none font-mono"
                    style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>Return Reason</label>
                  <select value={returnInitForm.reason} onChange={e => setReturnInitForm(p => ({ ...p, reason: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                    {Object.entries(RETURN_REASONS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>Notes</label>
                  <textarea value={returnInitForm.notes} onChange={e => setReturnInitForm(p => ({ ...p, notes: e.target.value }))}
                    placeholder="Describe the issue..."
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
                    style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
                </div>
              </div>
              <div className="px-6 py-4 flex gap-3 border-t" style={{ borderColor: theme.border.primary }}>
                <button onClick={() => setInitiateReturn(false)} className="flex-1 py-2.5 rounded-xl border text-sm"
                  style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
                <button
                  disabled={!returnInitForm.waybill.trim()}
                  onClick={() => {
                    const pkg = allShipments.find(p => p.waybill?.toUpperCase() === returnInitForm.waybill.trim().toUpperCase());
                    const newReturn = {
                      id: `RET-2026-${String(returns.length + 1).padStart(3, '0')}`,
                      originalWaybill: returnInitForm.waybill.trim().toUpperCase(),
                      customer: pkg?.customer || 'Unknown',
                      phone: pkg?.phone || '',
                      terminal: pkg?.destination || pkg?.terminal || 'Unknown',
                      requestedAt: new Date().toISOString().slice(0, 10),
                      reason: returnInitForm.reason,
                      notes: returnInitForm.notes,
                      value: pkg?.value || 0,
                      status: 'pending',
                      returnWaybill: null,
                      timeline: [{ status: 'pending', date: new Date().toISOString().slice(0, 10), note: 'Return initiated by enterprise client' }],
                    };
                    setReturns(prev => [newReturn, ...prev]);
                    setInitiateReturn(false);
                    setReturnInitForm({ waybill: '', reason: 'wrong_item', notes: '' });
                  }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                  style={{ background: returnInitForm.waybill.trim() ? 'linear-gradient(135deg,#EF4444,#DC2626)' : theme.border.primary, color: returnInitForm.waybill.trim() ? '#fff' : theme.text.muted }}>
                  Submit Return
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Page: Account & Settings ───────────────────────────────────────────────
  const renderAccount = () => {
    const handleSaveKey = (form) => {
      const prefix = 'lq_live_' + Math.random().toString(36).slice(2,6).toUpperCase();
      const full = prefix + Math.random().toString(36).slice(2,30).toUpperCase().slice(0,28);
      const newKey = { id:`key-${Date.now()}`, name:form.name, prefix:prefix.slice(0,12), full, scopes:form.scopes, createdAt:new Date().toISOString().slice(0,10), lastUsed:'—', status:'active' };
      setApiKeys(prev => [newKey, ...prev]);
      setKeyForm(null);
      setNewKeyRevealed({ name:form.name, key:full });
    };
    const handleSaveWebhook = (form) => {
      const secret = form.secret || 'whsec_' + Math.random().toString(36).slice(2,14);
      if (form.id) {
        setWebhooks(prev => prev.map(w => w.id===form.id ? {...form,secret} : w));
      } else {
        setWebhooks(prev => [{ ...form, secret, id:`wh-${Date.now()}`, lastDelivery:'—', successRate:100 }, ...prev]);
      }
      setWebhookForm(null);
    };
    const copyIntKey = (id, full) => {
      navigator.clipboard.writeText(full).catch(()=>{});
      setCopiedIntKey(id);
      setTimeout(() => setCopiedIntKey(null), 2000);
    };

    const SETTINGS_TABS = [
      { id:'profile',       label:'Profile',       icon:Building2 },
      { id:'team',          label:'Team',          icon:Users },
      { id:'notifications', label:'Notifications', icon:Bell },
      { id:'billing',       label:'Billing',       icon:CreditCard },
      { id:'integrations',  label:'Integrations',  icon:Code2 },
      { id:'security',      label:'Security',      icon:Shield },
    ];

    // Toggle component
    const Toggle = ({ isOn, onToggle }) => (
      <button
        onClick={onToggle}
        className="w-11 h-6 rounded-full flex items-center transition-all flex-shrink-0"
        style={{
          backgroundColor: isOn ? '#6366F1' : theme.border.primary,
          justifyContent: isOn ? 'flex-end' : 'flex-start',
          padding: '2px',
        }}
      >
        <div className="w-5 h-5 rounded-full bg-white" style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
      </button>
    );

    // ── Profile tab ──
    const renderProfile = () => (
      <div className="space-y-4">
        {/* Company header card */}
        <div className="p-5 rounded-2xl border" style={card}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold flex-shrink-0"
                style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff' }}>
                {(account.company || 'E').charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-base" style={{ color: theme.text.primary }}>{profileForm.name || account.company}</h3>
                <p className="text-sm" style={{ color: theme.text.muted }}>{account.accountId} · {account.plan}</p>
                <span className="inline-flex items-center gap-1 text-xs mt-1 px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: '#81C99515', color: '#81C995' }}>
                  <Shield size={10} /> Verified
                </span>
              </div>
            </div>
            <button
              onClick={() => setEditingProfile(e => !e)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all"
              style={{
                borderColor: editingProfile ? theme.accent.border : theme.border.primary,
                backgroundColor: editingProfile ? theme.accent.light : theme.bg.card,
                color: editingProfile ? theme.accent.primary : theme.text.secondary,
              }}
            >
              {editingProfile ? <X size={13} /> : <FileText size={13} />}
              {editingProfile ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {editingProfile ? (
            <div className="pt-4 border-t" style={{ borderColor: theme.border.primary }}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Company Name', key: 'name', placeholder: 'Your company name' },
                  { label: 'Industry', key: 'industry', placeholder: 'e.g. E-commerce' },
                  { label: 'Address', key: 'address', placeholder: 'Office address' },
                  { label: 'Website', key: 'website', placeholder: 'https://yourcompany.com' },
                ].map(({ label, key, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>{label}</label>
                    <input
                      value={profileForm[key]}
                      onChange={e => setProfileForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
                      style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary, color: theme.text.primary }}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={() => { setEditingProfile(false); addToast('Profile updated', 'success'); }}
                className="mt-4 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)' }}
              >
                <Check size={14} /> Save Changes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-8 gap-y-3 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
              {[
                ['Account ID',        account.accountId],
                ['Plan',              account.plan],
                ['SLA',               account.sla],
                ['Contract Expires',  account.contractEnd],
                ['Rate per Shipment', `GH₵ ${account.ratePerShipment}`],
                ['Account Manager',   account.accountManager],
                ['Manager Email',     account.amEmail],
                ['Company Name',      profileForm.name],
                ...(profileForm.industry ? [['Industry', profileForm.industry]] : []),
                ...(profileForm.address  ? [['Address',  profileForm.address]]  : []),
                ...(profileForm.website  ? [['Website',  profileForm.website]]  : []),
              ].map(([l, v]) => (
                <div key={l}>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                  <p className="text-sm font-medium mt-0.5" style={{ color: theme.text.primary }}>{v}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );

    // ── Team tab ──
    const renderTeam = () => (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-sm" style={{ color: theme.text.primary }}>Team Members</h3>
            <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{teamContacts.length} member{teamContacts.length !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setContactForm({})}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-white"
            style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)' }}
          >
            <Plus size={13} /> Add Member
          </button>
        </div>

        <div className="rounded-2xl border overflow-hidden" style={card}>
          {teamContacts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users size={28} style={{ color: theme.text.muted, marginBottom: 10 }} />
              <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>No team members yet</p>
              <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Add members to manage notifications and access</p>
            </div>
          ) : (
            teamContacts.map((contact, i) => (
              <div key={contact.id} className="flex items-center gap-3 p-4"
                style={{ borderBottom: i < teamContacts.length - 1 ? `1px solid ${theme.border.primary}` : 'none' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)', color: '#fff' }}>
                  {(contact.name || '?').charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold" style={{ color: theme.text.primary }}>{contact.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: '#818CF810', color: '#818CF8' }}>{contact.role}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs flex items-center gap-1" style={{ color: theme.text.muted }}>
                      <Mail size={10} /> {contact.email}
                    </span>
                    {contact.phone && (
                      <span className="text-xs flex items-center gap-1" style={{ color: theme.text.muted }}>
                        <Phone size={10} /> {contact.phone}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setContactForm({ ...contact })}
                    className="p-2 rounded-xl border transition-colors"
                    style={{ borderColor: theme.border.primary, color: theme.icon.muted }}
                  >
                    <FileText size={13} />
                  </button>
                  <button
                    onClick={() => setTeamContacts(prev => prev.filter(c => c.id !== contact.id))}
                    className="p-2 rounded-xl border"
                    style={{ borderColor: '#EF444430', color: '#EF4444' }}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Contact form modal */}
        {contactForm !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.55)' }}>
            <div className="w-full max-w-md rounded-2xl overflow-hidden" style={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
              <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: theme.border.primary }}>
                <p className="font-bold text-sm" style={{ color: theme.text.primary }}>
                  {contactForm.id ? 'Edit Member' : 'Add Team Member'}
                </p>
                <button onClick={() => setContactForm(null)} style={{ color: theme.text.muted }}><X size={16} /></button>
              </div>
              <div className="p-5 space-y-4">
                {[
                  { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Jane Doe' },
                  { label: 'Email',     key: 'email', type: 'email', placeholder: 'jane@company.com' },
                  { label: 'Phone',     key: 'phone', type: 'tel',  placeholder: '+233...' },
                ].map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>{label}</label>
                    <input
                      type={type}
                      value={contactForm[key] || ''}
                      onChange={e => setContactForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                      style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary, color: theme.text.primary }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>Role</label>
                  <select
                    value={contactForm.role || 'Primary'}
                    onChange={e => setContactForm(p => ({ ...p, role: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                    style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary, color: theme.text.primary }}
                  >
                    {['Primary', 'Billing', 'Technical', 'Operations'].map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-1">
                  <button onClick={() => setContactForm(null)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium"
                    style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
                  <button
                    onClick={() => {
                      if (!contactForm.name || !contactForm.email) return;
                      if (contactForm.id) {
                        setTeamContacts(prev => prev.map(c => c.id === contactForm.id ? contactForm : c));
                      } else {
                        setTeamContacts(prev => [...prev, { ...contactForm, id: `c-${Date.now()}`, role: contactForm.role || 'Primary' }]);
                      }
                      setContactForm(null);
                      addToast(contactForm.id ? 'Member updated' : 'Member added', 'success');
                    }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)' }}
                  >
                    {contactForm.id ? 'Save Changes' : 'Add Member'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );

    // ── Notifications tab ──
    const renderNotifications = () => {
      const sections = [
        {
          title: 'Packages',
          items: [
            { key: 'pkg_in_locker',  label: 'Package in Locker',  desc: 'When a package is deposited and ready for pickup' },
            { key: 'pkg_delivered',  label: 'Package Delivered',  desc: 'When a package has been picked up or delivered' },
            { key: 'pkg_exception',  label: 'Package Exception',  desc: 'Delivery exceptions or issues requiring attention' },
          ],
        },
        {
          title: 'Operations',
          items: [
            { key: 'dispatch_updated', label: 'Dispatch Updated', desc: 'When courier dispatch status changes' },
            { key: 'sla_warning',      label: 'SLA Warning',      desc: 'When a package is approaching SLA deadline' },
            { key: 'sla_breach',       label: 'SLA Breach',       desc: 'When an SLA deadline has been missed' },
          ],
        },
        {
          title: 'Billing',
          items: [
            { key: 'inv_generated', label: 'Invoice Generated', desc: 'When a new monthly invoice is ready' },
            { key: 'inv_due',       label: 'Invoice Due',       desc: 'Reminders before invoice payment deadline' },
          ],
        },
      ];

      return (
        <div className="space-y-4">
          {sections.map(section => (
            <div key={section.title} className="rounded-2xl border overflow-hidden" style={card}>
              <div className="px-5 py-3.5 border-b" style={{ borderColor: theme.border.primary }}>
                <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>{section.title}</p>
              </div>
              <div className="divide-y" style={{ borderColor: theme.border.primary }}>
                {section.items.map(item => (
                  <div key={item.key} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{item.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{item.desc}</p>
                    </div>
                    <Toggle
                      isOn={notifPrefs[item.key]}
                      onToggle={() => setNotifPrefs(p => ({ ...p, [item.key]: !p[item.key] }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Notification emails */}
          <div className="rounded-2xl border overflow-hidden" style={card}>
            <div className="px-5 py-3.5 border-b" style={{ borderColor: theme.border.primary }}>
              <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>Notification Emails</p>
              <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>Send event notifications to these email addresses</p>
            </div>
            <div className="p-5 space-y-3">
              {notifEmails.map(email => (
                <div key={email} className="flex items-center justify-between px-3 py-2.5 rounded-xl border"
                  style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.secondary }}>
                  <span className="text-sm flex items-center gap-2" style={{ color: theme.text.primary }}>
                    <Mail size={13} style={{ color: theme.icon.muted }} />{email}
                  </span>
                  <button onClick={() => setNotifEmails(prev => prev.filter(e => e !== email))}
                    style={{ color: theme.text.muted }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="email"
                  value={notifEmailInput}
                  onChange={e => setNotifEmailInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && notifEmailInput.includes('@') && !notifEmails.includes(notifEmailInput)) {
                      setNotifEmails(prev => [...prev, notifEmailInput.trim()]);
                      setNotifEmailInput('');
                    }
                  }}
                  placeholder="Add email address..."
                  className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none"
                  style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary, color: theme.text.primary }}
                />
                <button
                  onClick={() => {
                    if (notifEmailInput.includes('@') && !notifEmails.includes(notifEmailInput)) {
                      setNotifEmails(prev => [...prev, notifEmailInput.trim()]);
                      setNotifEmailInput('');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white"
                  style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)' }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    };

    // ── Billing tab ──
    const renderBilling = () => {
      const outstanding = invoiceList.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0);
      const paidYTD     = invoiceList.filter(i => i.status === 'paid' && i.id.startsWith('INV-2026')).reduce((s, i) => s + i.amount, 0);
      const avgMonthly  = Math.round(invoiceList.reduce((s, i) => s + i.amount, 0) / invoiceList.length);
      const spendData   = MONTHLY_DATA.map(d => ({ ...d, spend: d.shipments * account.ratePerShipment }));
      const billingContacts = teamContacts.filter(c => ['Billing', 'Primary'].includes(c.role));
      const BANKS = ['GCB Bank', 'Ecobank Ghana', 'Stanbic Bank', 'Absa Bank', 'Zenith Bank', 'Fidelity Bank'];
      const MOMO_PROVIDERS = [
        { id: 'MTN MoMo',        color: '#F59E0B', bg: '#F59E0B15', border: '#F59E0B30' },
        { id: 'Telecel Cash',    color: '#EF4444', bg: '#EF444415', border: '#EF444430' },
        { id: 'AirtelTigo Money',color: '#3B82F6', bg: '#3B82F615', border: '#3B82F630' },
      ];
      const pf = paymentForm;
      const isMomo = pf.type === 'momo';
      const activeMomo = MOMO_PROVIDERS.find(p => p.id === pf.momoProvider) || MOMO_PROVIDERS[0];

      return (
        <div className="space-y-5">

          {/* ── Summary metrics ── */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Outstanding Balance', value: `GH₵ ${outstanding.toLocaleString()}`, sub: outstanding > 0 ? `${invoiceList.filter(i=>i.status==='pending').length} invoice(s) due` : 'All paid', color: outstanding > 0 ? '#D97706' : '#81C995', bg: outstanding > 0 ? '#D9770610' : '#81C99510', icon: AlertTriangle },
              { label: 'Paid This Year',       value: `GH₵ ${paidYTD.toLocaleString()}`,    sub: `${invoiceList.filter(i=>i.status==='paid'&&i.id.startsWith('INV-2026')).length} invoices settled`, color: '#81C995', bg: '#81C99510', icon: Check },
              { label: 'Avg Monthly Spend',    value: `GH₵ ${avgMonthly.toLocaleString()}`,  sub: `GH₵ ${account.ratePerShipment}/shipment`, color: '#818CF8', bg: '#818CF810', icon: TrendingUp },
            ].map(({ label, value, sub, color, bg, icon: Icon }) => (
              <div key={label} className="p-4 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold" style={{ color: theme.text.muted }}>{label}</p>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: bg }}>
                    <Icon size={13} style={{ color }} />
                  </div>
                </div>
                <p className="text-xl font-black" style={{ color: theme.text.primary }}>{value}</p>
                <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{sub}</p>
              </div>
            ))}
          </div>

          {/* ── Monthly Spend Chart ── */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="px-5 py-3.5 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <div>
                <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>Monthly Spend</p>
                <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>GH₵ {account.ratePerShipment}/shipment · Last 8 months</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: '#818CF810', color: '#818CF8' }}>GH₵</span>
            </div>
            <div className="px-4 py-4" style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={spendData} barSize={22}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 11 }} />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12, fontSize: 12 }}
                    labelStyle={{ color: theme.text.primary, fontWeight: 600 }}
                    formatter={(v) => [`GH₵ ${v.toLocaleString()}`, 'Spend']}
                  />
                  <Bar dataKey="spend" fill="#818CF8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Invoice History ── */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="px-5 py-3.5 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>Invoice History</p>
              <button onClick={() => addToast('All invoices exported', 'success')}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border"
                style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                <Download size={12} /> Export All
              </button>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: theme.bg.secondary }}>
                  {['Invoice', 'Period', 'Shipments', 'Amount', 'Status', 'Due / Paid', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: theme.text.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoiceList.map((inv, i) => (
                  <tr key={inv.id} style={{ borderTop: i > 0 ? `1px solid ${theme.border.primary}` : 'none' }}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: inv.status === 'paid' ? '#81C99515' : '#D9770615' }}>
                          <FileText size={12} style={{ color: inv.status === 'paid' ? '#81C995' : '#D97706' }} />
                        </div>
                        <span className="font-medium text-xs" style={{ color: theme.text.primary }}>{inv.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: theme.text.secondary }}>{inv.period}</td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: theme.text.secondary }}>{inv.shipments} pkgs</td>
                    <td className="px-4 py-3.5 font-bold text-sm" style={{ color: theme.text.primary }}>GH₵ {inv.amount.toLocaleString()}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                        style={{ backgroundColor: inv.status === 'paid' ? '#81C99515' : '#D9770615', color: inv.status === 'paid' ? '#81C995' : '#D97706' }}>
                        {inv.status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs" style={{ color: theme.text.muted }}>
                      {inv.status === 'paid' ? `Paid ${inv.paidDate}` : `Due ${inv.dueDate}`}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => addToast(`${inv.id} downloaded`, 'info')}
                          className="p-1.5 rounded-lg border" style={{ borderColor: theme.border.primary, color: theme.icon.muted }}>
                          <Download size={12} />
                        </button>
                        {inv.status === 'pending' && (
                          <button onClick={() => { setPayingInvoice(inv); setPayRef(''); }}
                            className="text-xs px-3 py-1.5 rounded-lg font-semibold text-white"
                            style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)' }}>
                            Pay Now
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Payment Method ── */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="px-5 py-3.5 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <div>
                <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>Payment Method</p>
                <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{isMomo ? `${pf.momoProvider} · Mobile Money` : 'Bank Transfer'} · Monthly billing cycle</p>
              </div>
              <button onClick={() => setEditingPayment(e => !e)}
                className="text-xs px-3 py-1.5 rounded-xl border"
                style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                {editingPayment ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editingPayment ? (
              <div className="p-5 space-y-5">
                {/* Type selector */}
                <div>
                  <label className="block text-xs font-semibold mb-2" style={{ color: theme.text.muted }}>Payment Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[['bank', CreditCard, 'Bank Transfer'], ['momo', Phone, 'Mobile Money']].map(([t, Icon, label]) => (
                      <button key={t} onClick={() => setPaymentForm(p => ({ ...p, type: t }))}
                        className="flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left"
                        style={{ borderColor: pf.type === t ? '#818CF8' : theme.border.primary, backgroundColor: pf.type === t ? '#818CF808' : theme.bg.tertiary }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: pf.type === t ? '#818CF820' : theme.bg.secondary }}>
                          <Icon size={15} style={{ color: pf.type === t ? '#818CF8' : theme.text.muted }} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: pf.type === t ? theme.text.primary : theme.text.secondary }}>{label}</p>
                          <p className="text-xs" style={{ color: theme.text.muted }}>{t === 'bank' ? 'GCB, Ecobank, Stanbic…' : 'MTN, Telecel, AirtelTigo'}</p>
                        </div>
                        {pf.type === t && <Check size={14} style={{ color: '#818CF8', marginLeft: 'auto', flexShrink: 0 }} />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bank fields */}
                {pf.type === 'bank' && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ['Bank', 'bank', 'select', BANKS],
                      ['Account Name', 'accountName', 'text', null],
                      ['Account Number', 'accountNo', 'text', null],
                      ['Branch', 'branch', 'text', null],
                    ].map(([label, key, type, opts]) => (
                      <div key={key}>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>{label}</label>
                        {type === 'select' ? (
                          <select value={pf[key]} onChange={e => setPaymentForm(p => ({ ...p, [key]: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                            style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                            {opts.map(o => <option key={o}>{o}</option>)}
                          </select>
                        ) : (
                          <input value={pf[key]} onChange={e => setPaymentForm(p => ({ ...p, [key]: e.target.value }))}
                            className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                            style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* MoMo fields */}
                {pf.type === 'momo' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold mb-2" style={{ color: theme.text.muted }}>Network Provider</label>
                      <div className="grid grid-cols-3 gap-2">
                        {MOMO_PROVIDERS.map(mp => (
                          <button key={mp.id} onClick={() => setPaymentForm(p => ({ ...p, momoProvider: mp.id }))}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl border transition-all"
                            style={{ borderColor: pf.momoProvider === mp.id ? mp.color : theme.border.primary, backgroundColor: pf.momoProvider === mp.id ? mp.bg : theme.bg.tertiary }}>
                            <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white flex-shrink-0"
                              style={{ backgroundColor: mp.color }}>
                              {mp.id === 'MTN MoMo' ? 'M' : mp.id === 'Telecel Cash' ? 'T' : 'A'}
                            </div>
                            <p className="text-xs font-semibold leading-tight text-center" style={{ color: pf.momoProvider === mp.id ? mp.color : theme.text.secondary }}>
                              {mp.id}
                            </p>
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>MoMo Phone Number</label>
                        <input value={pf.momoNumber} onChange={e => setPaymentForm(p => ({ ...p, momoNumber: e.target.value }))}
                          placeholder="+233 XX XXX XXXX"
                          className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono outline-none"
                          style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>Account Name</label>
                        <input value={pf.momoName} onChange={e => setPaymentForm(p => ({ ...p, momoName: e.target.value }))}
                          className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                          style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
                      </div>
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-xl" style={{ backgroundColor: '#F59E0B08', border: '1px solid #F59E0B20' }}>
                      <AlertTriangle size={13} style={{ color: '#F59E0B', marginTop: 1, flexShrink: 0 }} />
                      <p className="text-xs" style={{ color: theme.text.muted }}>LocQar will send a MoMo payment prompt to this number for each invoice. Ensure the number is active and has sufficient funds.</p>
                    </div>
                  </div>
                )}

                <button onClick={() => { setEditingPayment(false); addToast('Payment method updated', 'success'); }}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)' }}>
                  Save Payment Method
                </button>
              </div>
            ) : (
              <div className="p-5">
                {/* View: MoMo */}
                {isMomo ? (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-lg text-white flex-shrink-0"
                        style={{ backgroundColor: activeMomo.color }}>
                        {pf.momoProvider === 'MTN MoMo' ? 'M' : pf.momoProvider === 'Telecel Cash' ? 'T' : 'A'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>{pf.momoProvider}</p>
                          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: activeMomo.bg, color: activeMomo.color }}>Mobile Money</span>
                        </div>
                        <p className="text-xs mt-0.5 font-mono" style={{ color: theme.text.muted }}>
                          {pf.momoNumber ? pf.momoNumber.slice(0, 4) + '•'.repeat(4) + pf.momoNumber.slice(-3) : 'No number set'} · {pf.momoName || account.company}
                        </p>
                      </div>
                      <span className="ml-auto text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: '#81C99515', color: '#81C995' }}>Active</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
                      {[
                        ['Network',       pf.momoProvider],
                        ['Account Name',  pf.momoName || account.company],
                        ['Phone Number',  pf.momoNumber ? pf.momoNumber.slice(0,4)+'•'.repeat(4)+pf.momoNumber.slice(-3) : '—'],
                        ['Billing Cycle', 'Monthly (1st of month)'],
                        ['Payment Terms', 'Prompt on invoice'],
                        ['Auto-debit',    'Enabled'],
                      ].map(([l, v]) => (
                        <div key={l}>
                          <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                          <p className="text-sm font-medium mt-0.5" style={{ color: theme.text.primary }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  /* View: Bank Transfer */
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: '#818CF810', border: '1px solid #818CF820' }}>
                        <CreditCard size={20} style={{ color: '#818CF8' }} />
                      </div>
                      <div>
                        <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>{pf.bank}</p>
                        <p className="text-xs mt-0.5 font-mono" style={{ color: theme.text.muted }}>
                          {pf.accountNo.slice(0,3)}{'•'.repeat(5)}{pf.accountNo.slice(-2)} · {pf.branch}
                        </p>
                      </div>
                      <span className="ml-auto text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: '#81C99515', color: '#81C995' }}>Active</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-8 gap-y-2 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
                      {[
                        ['Bank',           pf.bank],
                        ['Account Name',   pf.accountName || account.company],
                        ['Account Number', pf.accountNo.slice(0,3)+'•'.repeat(5)+pf.accountNo.slice(-2)],
                        ['Branch',         pf.branch],
                        ['Billing Cycle',  'Monthly (1st of month)'],
                        ['Payment Terms',  'Net 30'],
                      ].map(([l, v]) => (
                        <div key={l}>
                          <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                          <p className="text-sm font-medium mt-0.5" style={{ color: theme.text.primary }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ── Contract Details ── */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="px-5 py-3.5 border-b" style={{ borderColor: theme.border.primary }}>
              <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>Contract Details</p>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-x-8 gap-y-3 mb-5">
                {[
                  ['Plan',               account.plan],
                  ['Contract End',       account.contractEnd],
                  ['Rate per Shipment',  `GH₵ ${account.ratePerShipment}`],
                  ['SLA Commitment',     account.sla],
                  ['Assigned Terminals', account.terminals?.join(', ') || '—'],
                  ['Account Manager',    account.accountManager],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                    <p className="text-sm font-medium mt-0.5" style={{ color: theme.text.primary }}>{v}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-xl" style={{ backgroundColor: '#818CF808', border: '1px solid #818CF820' }}>
                <ArrowUpRight size={14} style={{ color: '#818CF8', flexShrink: 0 }} />
                <p className="text-xs" style={{ color: theme.text.muted }}>
                  To upgrade your plan or renegotiate terms, contact your account manager{' '}
                  <span style={{ color: '#818CF8' }}>{account.accountManager}</span> at{' '}
                  <span style={{ color: '#818CF8' }}>{account.amEmail}</span>.
                </p>
              </div>
            </div>
          </div>

          {/* ── Billing Contacts ── */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="px-5 py-3.5 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <div>
                <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>Billing Contacts</p>
                <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>Receive invoice emails and payment reminders</p>
              </div>
              <button onClick={() => setSettingsTab('team')}
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-xl border"
                style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                <Plus size={12} /> Manage in Team
              </button>
            </div>
            {billingContacts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm" style={{ color: theme.text.muted }}>No billing contacts assigned. Go to Team to add one.</p>
              </div>
            ) : (
              billingContacts.map((c, i) => (
                <div key={c.id || i} className="flex items-center gap-3 px-5 py-4"
                  style={{ borderTop: i > 0 ? `1px solid ${theme.border.primary}` : 'none' }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center font-semibold text-sm flex-shrink-0"
                    style={{ backgroundColor: '#818CF820', color: '#818CF8' }}>
                    {(c.name || '?').charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{c.name}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-xs flex items-center gap-1" style={{ color: theme.text.muted }}><Mail size={10} /> {c.email}</span>
                      {c.phone && <span className="text-xs flex items-center gap-1" style={{ color: theme.text.muted }}><Phone size={10} /> {c.phone}</span>}
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted }}>{c.role}</span>
                </div>
              ))
            )}
          </div>

          {/* ── Pay Now Modal ── */}
          {payingInvoice && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <div className="w-full max-w-md rounded-2xl p-6 space-y-5" style={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold" style={{ color: theme.text.primary }}>Pay Invoice</h3>
                  <button onClick={() => setPayingInvoice(null)} className="p-2 rounded-xl" style={{ color: theme.text.muted }}><X size={18} /></button>
                </div>

                {/* Invoice summary */}
                <div className="p-4 rounded-xl border space-y-2" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
                  {[
                    ['Invoice', payingInvoice.id],
                    ['Period',  payingInvoice.period],
                    ['Shipments', `${payingInvoice.shipments} packages`],
                    ['Due Date', payingInvoice.dueDate],
                  ].map(([l, v]) => (
                    <div key={l} className="flex items-center justify-between text-sm">
                      <span style={{ color: theme.text.muted }}>{l}</span>
                      <span className="font-medium" style={{ color: theme.text.primary }}>{v}</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 border-t text-base font-bold" style={{ borderColor: theme.border.primary }}>
                    <span style={{ color: theme.text.primary }}>Total Due</span>
                    <span style={{ color: '#818CF8' }}>GH₵ {payingInvoice.amount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Payment instructions — MoMo or Bank */}
                {isMomo ? (
                  <div className="p-3.5 rounded-xl space-y-3" style={{ backgroundColor: activeMomo.bg, border: `1px solid ${activeMomo.border}` }}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center font-black text-xs text-white flex-shrink-0" style={{ backgroundColor: activeMomo.color }}>
                        {pf.momoProvider === 'MTN MoMo' ? 'M' : pf.momoProvider === 'Telecel Cash' ? 'T' : 'A'}
                      </div>
                      <p className="text-xs font-semibold" style={{ color: activeMomo.color }}>Pay via {pf.momoProvider}</p>
                    </div>
                    {[
                      ['Send To',   pf.momoNumber || '+233 XX XXX XXXX'],
                      ['Name',      pf.momoName || account.company],
                      ['Amount',    `GH₵ ${payingInvoice.amount.toLocaleString()}`],
                      ['Reference', payingInvoice.id],
                    ].map(([l, v]) => (
                      <div key={l} className="flex items-center justify-between text-xs">
                        <span style={{ color: theme.text.muted }}>{l}</span>
                        <span className="font-mono font-semibold" style={{ color: theme.text.primary }}>{v}</span>
                      </div>
                    ))}
                    <p className="text-xs pt-1 border-t" style={{ borderColor: activeMomo.border, color: theme.text.muted }}>
                      A payment prompt will be sent to the registered MoMo number. Enter your PIN to approve.
                    </p>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl space-y-2" style={{ backgroundColor: '#818CF808', border: '1px solid #818CF820' }}>
                    <p className="text-xs font-semibold" style={{ color: '#818CF8' }}>Bank Transfer Details</p>
                    {[['Bank', 'LocQar Financial Services, GCB Bank'], ['Account No.', '0123456789'], ['Branch', 'Accra Head Office'], ['Reference', payingInvoice.id]].map(([l, v]) => (
                      <div key={l} className="flex items-center justify-between text-xs">
                        <span style={{ color: theme.text.muted }}>{l}</span>
                        <span className="font-mono font-semibold" style={{ color: theme.text.primary }}>{v}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: theme.text.muted }}>{isMomo ? 'MoMo Transaction ID' : 'Bank Reference / Transaction ID'}</label>
                  <input value={payRef} onChange={e => setPayRef(e.target.value)} placeholder={isMomo ? 'e.g. 3456789012' : 'e.g. GCB2026030512345'}
                    className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setPayingInvoice(null)}
                    className="flex-1 py-2.5 rounded-xl border text-sm"
                    style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                    Cancel
                  </button>
                  <button
                    disabled={!payRef.trim()}
                    onClick={() => {
                      setInvoiceList(prev => prev.map(i => i.id === payingInvoice.id ? { ...i, status: 'paid', paidDate: new Date().toISOString().slice(0, 10) } : i));
                      addToast(`Payment submitted for ${payingInvoice.id}`, 'success');
                      setPayingInvoice(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                    style={{ background: payRef.trim() ? 'linear-gradient(135deg,#6366F1,#818CF8)' : theme.border.primary, opacity: payRef.trim() ? 1 : 0.5 }}>
                    Confirm Payment
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    // ── Integrations tab ──
    const renderIntegrations = () => (
      <div className="space-y-4">
        {/* Sub-tab switcher */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ backgroundColor: theme.bg.secondary }}>
          {[['keys', 'API Keys', Key], ['webhooks', 'Webhooks', Zap]].map(([id, label, Icon]) => (
            <button key={id} onClick={() => setIntTab(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: intTab === id ? theme.bg.card : 'transparent',
                color: intTab === id ? theme.text.primary : theme.text.muted,
                boxShadow: intTab === id ? theme.shadow : 'none',
              }}>
              <Icon size={14} />{label}
            </button>
          ))}
        </div>

        {/* API Keys */}
        {intTab === 'keys' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: theme.text.primary }}>
                API Keys <span className="font-normal" style={{ color: theme.text.muted }}>({apiKeys.length})</span>
              </p>
              <button onClick={() => setKeyForm({})} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium"
                style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card, color: theme.text.secondary }}>
                <Plus size={14} /> New Key
              </button>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl text-sm" style={{ backgroundColor: '#818CF808', border: '1px solid #818CF820' }}>
              <Shield size={14} style={{ color: '#818CF8', marginTop: 1, flexShrink: 0 }} />
              <p style={{ color: theme.text.muted }}>Keep API keys secret. Store them in environment variables — never commit to version control. Revoke any key that may be compromised.</p>
            </div>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: theme.bg.secondary }}>
                    {['Name', 'Key Prefix', 'Scopes', 'Created', 'Last Used', 'Status', ''].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: theme.text.muted }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {apiKeys.map((k, i) => (
                    <tr key={k.id} style={{ borderTop: i > 0 ? `1px solid ${theme.border.primary}` : 'none' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: theme.text.primary }}>{k.name}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <code className="text-xs px-2 py-1 rounded-lg font-mono"
                            style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}>
                            {k.prefix}{'•'.repeat(14)}
                          </code>
                          {k.status === 'active' && (
                            <button onClick={() => copyIntKey(k.id, k.full)} className="p-1.5 rounded-lg transition-all"
                              style={{
                                backgroundColor: copiedIntKey === k.id ? '#81C99510' : theme.bg.tertiary,
                                color: copiedIntKey === k.id ? '#81C995' : theme.icon.muted,
                              }}>
                              {copiedIntKey === k.id ? <Check size={11} /> : <Copy size={11} />}
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {k.scopes.map(s => (
                            <span key={s} className="text-xs px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: '#818CF810', color: '#818CF8' }}>{s}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: theme.text.muted }}>{k.createdAt}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: theme.text.muted }}>{k.lastUsed}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: k.status === 'active' ? '#81C99515' : '#EF444415',
                            color: k.status === 'active' ? '#81C995' : '#EF4444',
                          }}>
                          {k.status === 'active' ? 'Active' : 'Revoked'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {k.status === 'active' && (
                          <button
                            onClick={() => setApiKeys(prev => prev.map(x => x.id === k.id ? { ...x, status: 'revoked' } : x))}
                            className="text-xs px-2.5 py-1.5 rounded-lg border"
                            style={{ borderColor: '#EF444430', color: '#EF4444' }}>
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Webhooks */}
        {intTab === 'webhooks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold" style={{ color: theme.text.primary }}>
                Webhook Endpoints <span className="font-normal" style={{ color: theme.text.muted }}>({webhooks.length})</span>
              </p>
              <button onClick={() => setWebhookForm({})} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium"
                style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card, color: theme.text.secondary }}>
                <Plus size={14} /> Add Endpoint
              </button>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl text-sm" style={{ backgroundColor: '#818CF808', border: '1px solid #818CF820' }}>
              <Zap size={14} style={{ color: '#818CF8', marginTop: 1, flexShrink: 0 }} />
              <p style={{ color: theme.text.muted }}>
                LocQar POSTs to your endpoints when events occur. Verify deliveries using the{' '}
                <code className="text-xs px-1 py-0.5 rounded" style={{ backgroundColor: '#818CF815', color: '#818CF8' }}>X-LocQar-Signature</code>
                {' '}header and your signing secret.
              </p>
            </div>
            {webhooks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 rounded-2xl border border-dashed" style={{ borderColor: theme.border.primary }}>
                <Zap size={30} style={{ color: theme.text.muted, marginBottom: 10 }} />
                <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>No webhook endpoints</p>
                <p className="text-sm mt-1 mb-4" style={{ color: theme.text.muted }}>Receive real-time events in your platform</p>
                <button onClick={() => setWebhookForm({})} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)' }}>
                  <Plus size={14} /> Add First Endpoint
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {webhooks.map(w => (
                  <div key={w.id} className="p-4 rounded-2xl border" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: w.status === 'active' ? '#818CF815' : theme.bg.tertiary }}>
                          <Zap size={16} style={{ color: w.status === 'active' ? '#818CF8' : theme.text.muted }} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-mono truncate" style={{ color: theme.text.primary }}>{w.url}</p>
                          <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>
                            Last delivery: {w.lastDelivery}
                            {w.successRate !== undefined && w.lastDelivery !== '—' && (
                              <> · <span style={{ color: w.successRate >= 95 ? '#81C995' : '#D97706' }}>{w.successRate}% success</span></>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                          style={{
                            backgroundColor: w.status === 'active' ? '#81C99515' : '#D9770615',
                            color: w.status === 'active' ? '#81C995' : '#D97706',
                          }}>
                          {w.status === 'active' ? 'Active' : 'Paused'}
                        </span>
                        <button onClick={() => setWebhookForm(w)} className="p-2 rounded-xl border"
                          style={{ borderColor: theme.border.primary, color: theme.icon.muted }}>
                          <FileText size={13} />
                        </button>
                        <button onClick={() => setWebhooks(prev => prev.filter(x => x.id !== w.id))}
                          className="p-2 rounded-xl border" style={{ borderColor: '#EF444430', color: '#EF4444' }}>
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t" style={{ borderColor: theme.border.primary }}>
                      {w.events.map(ev => {
                        const evInfo = WEBHOOK_EVENTS.find(x => x.id === ev);
                        return (
                          <span key={ev} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ backgroundColor: '#818CF810', color: '#818CF8' }}>
                            {evInfo?.label || ev}
                          </span>
                        );
                      })}
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => setWebhooks(prev => prev.map(x => x.id === w.id ? { ...x, status: x.status === 'active' ? 'paused' : 'active' } : x))}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border"
                        style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                        <Power size={11} /> {w.status === 'active' ? 'Pause' : 'Resume'}
                      </button>
                      <button
                        onClick={() => addToast(`Test event sent to ${w.url.replace(/https?:\/\//, '').slice(0, 40)}`, 'info')}
                        className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border"
                        style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                        <Send size={11} /> Send Test
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );

    // ── Security tab ──
    const renderSecurity = () => (
      <div className="space-y-4">
        {/* Two-factor authentication */}
        <div className="rounded-2xl border overflow-hidden" style={card}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: theme.border.primary }}>
            <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>Two-Factor Authentication</p>
          </div>
          <div className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: twoFA ? '#81C99515' : theme.bg.secondary }}>
                <Shield size={20} style={{ color: twoFA ? '#81C995' : theme.icon.muted }} />
              </div>
              <div>
                <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>Authenticator App</p>
                <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>Require a second factor when signing in</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: twoFA ? '#81C99515' : theme.bg.secondary,
                  color: twoFA ? '#81C995' : theme.text.muted,
                }}>
                {twoFA ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <Toggle isOn={twoFA} onToggle={() => {
              setTwoFA(v => !v);
              addToast(twoFA ? '2FA disabled' : '2FA enabled', twoFA ? 'info' : 'success');
            }} />
          </div>
        </div>

        {/* Active sessions */}
        <div className="rounded-2xl border overflow-hidden" style={card}>
          <div className="px-5 py-3.5 border-b" style={{ borderColor: theme.border.primary }}>
            <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>Active Sessions</p>
            <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>Devices currently signed into your account</p>
          </div>
          <div className="divide-y" style={{ borderColor: theme.border.primary }}>
            {secSessions.map(session => (
              <div key={session.id} className="flex items-center gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: session.current ? '#818CF815' : theme.bg.secondary }}>
                  <Globe size={16} style={{ color: session.current ? '#818CF8' : theme.icon.muted }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{session.device}</p>
                    {session.current && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: '#81C99515', color: '#81C995' }}>Current</span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>
                    {session.location} · {session.ip} · {session.lastActive}
                  </p>
                </div>
                {!session.current && (
                  <button
                    onClick={() => {
                      setSecSessions(prev => prev.filter(s => s.id !== session.id));
                      addToast('Session terminated', 'success');
                    }}
                    className="text-xs px-2.5 py-1.5 rounded-lg border"
                    style={{ borderColor: '#EF444430', color: '#EF4444' }}>
                    Terminate
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

          {/* IP Allowlist */}
          <div className="rounded-2xl border overflow-hidden" style={card}>
            <div className="px-5 py-3.5 border-b" style={{ borderColor: theme.border.primary }}>
              <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>IP Allowlist</p>
              <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>Restrict API access to trusted IP ranges (CIDR notation)</p>
            </div>
            <div className="p-5 space-y-3">
              {ipAllowlist.map(ip => (
                <div key={ip} className="flex items-center justify-between px-3 py-2.5 rounded-xl border"
                  style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.secondary }}>
                  <span className="text-sm font-mono" style={{ color: theme.text.primary }}>{ip}</span>
                  <button onClick={() => setIpAllowlist(prev => prev.filter(x => x !== ip))}
                    style={{ color: theme.text.muted }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={ipInput}
                  onChange={e => setIpInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && ipInput.trim() && !ipAllowlist.includes(ipInput.trim())) {
                      setIpAllowlist(prev => [...prev, ipInput.trim()]);
                      setIpInput('');
                    }
                  }}
                  placeholder="e.g. 192.168.1.0/24"
                  className="flex-1 px-3 py-2.5 rounded-xl border text-sm outline-none font-mono"
                  style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary, color: theme.text.primary }}
                />
                <button
                  onClick={() => {
                    const val = ipInput.trim();
                    if (val && /^[\d.:/a-fA-F]+$/.test(val) && !ipAllowlist.includes(val)) {
                      setIpAllowlist(prev => [...prev, val]);
                      setIpInput('');
                    }
                  }}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-white"
                  style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)' }}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
    );

    return (
      <div className="max-w-5xl">
        {/* Page header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>Account &amp; Settings</h2>
          <p className="text-sm mt-0.5" style={{ color: theme.text.muted }}>Manage your account, team, billing and integrations</p>
        </div>

        {/* Two-column layout */}
        <div className="flex gap-6 items-start">
          {/* Left nav */}
          <div className="flex flex-col rounded-2xl border overflow-hidden flex-shrink-0" style={{ width: 200, ...card }}>
            <div className="p-2 space-y-0.5">
              {SETTINGS_TABS.map(({ id, label, icon: Icon }) => {
                const isActive = settingsTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setSettingsTab(id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                    style={{
                      backgroundColor: isActive ? theme.accent.light : 'transparent',
                      color: isActive ? theme.accent.primary : theme.text.secondary,
                      border: isActive ? `1px solid ${theme.accent.border}` : '1px solid transparent',
                    }}
                  >
                    <Icon size={15} />
                    {label}
                  </button>
                );
              })}
            </div>
            <div className="p-2 border-t mt-auto" style={{ borderColor: theme.border.primary }}>
              <button
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
                style={{ color: '#EF4444', backgroundColor: 'transparent' }}
              >
                <LogOut size={15} /> Sign Out
              </button>
            </div>
          </div>

          {/* Right content */}
          <div className="flex-1 min-w-0">
            {settingsTab === 'profile'       && renderProfile()}
            {settingsTab === 'team'          && renderTeam()}
            {settingsTab === 'notifications' && renderNotifications()}
            {settingsTab === 'billing'       && renderBilling()}
            {settingsTab === 'integrations'  && renderIntegrations()}
            {settingsTab === 'security'      && renderSecurity()}
          </div>
        </div>

        {/* Drawers and modals */}
        {keyForm !== null && <KeyFormDrawer theme={theme} onClose={() => setKeyForm(null)} onSave={handleSaveKey} />}
        {webhookForm !== null && (
          <WebhookFormDrawer webhook={webhookForm?.id ? webhookForm : null} theme={theme} onClose={() => setWebhookForm(null)} onSave={handleSaveWebhook} />
        )}

        {/* New-key one-time reveal modal */}
        {newKeyRevealed && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}>
            <div className="w-full max-w-md rounded-2xl p-6 space-y-4" style={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}` }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: '#81C99515' }}>
                  <Key size={18} style={{ color: '#81C995' }} />
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: theme.text.primary }}>Key Created: {newKeyRevealed.name}</h3>
                  <p className="text-xs" style={{ color: theme.text.muted }}>Copy it now — this is the only time you'll see the full key</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: '#81C99530' }}>
                <code className="flex-1 text-xs font-mono break-all" style={{ color: theme.text.primary }}>{newKeyRevealed.key}</code>
                <button onClick={() => { navigator.clipboard.writeText(newKeyRevealed.key).catch(() => {}); }}
                  className="p-2 rounded-lg flex-shrink-0" style={{ backgroundColor: '#81C99515', color: '#81C995' }}>
                  <Copy size={13} />
                </button>
              </div>
              <div className="flex items-start gap-2 p-3 rounded-xl" style={{ backgroundColor: '#D9770610', border: '1px solid #D9770630' }}>
                <AlertTriangle size={13} style={{ color: '#D97706', marginTop: 1, flexShrink: 0 }} />
                <p className="text-xs" style={{ color: '#D97706' }}>This key will not be shown again. Store it in a secure environment variable.</p>
              </div>
              <button onClick={() => setNewKeyRevealed(null)}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#6366F1,#818CF8)' }}>
                I've saved my key
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: theme.bg.primary }}>
      <style>{`.font-mono { font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', monospace !important; } ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${theme.border.secondary}; border-radius: 3px; }`}</style>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">{sidebar}</div>
        </>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex">{sidebar}</div>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {header}

        {/* Breadcrumb */}
        <div className="px-6 py-2.5 border-b flex items-center gap-2 text-xs flex-shrink-0" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
          <span style={{ color: theme.text.muted }}>{account.company}</span>
          <ChevronRight size={12} style={{ color: theme.text.muted }} />
          <span className="font-medium" style={{ color: theme.text.primary }}>{PAGE_LABEL[activeMenu] || activeMenu}</span>
          {activeSubMenu && (
            <>
              <ChevronRight size={12} style={{ color: theme.text.muted }} />
              <span style={{ color: theme.text.muted }}>{activeSubMenu}</span>
            </>
          )}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {activeMenu === 'dashboard'     && renderDashboard()}
          {activeMenu === 'shipments'     && renderShipments()}
          {activeMenu === 'dispatch'      && renderDispatch()}
          {activeMenu === 'notifications' && renderNotifications()}
          {activeMenu === 'sla'           && renderSLA()}
          {activeMenu === 'invoices'      && renderInvoices()}
          {activeMenu === 'analytics'     && renderAnalytics()}
          {activeMenu === 'account'       && renderAccount()}
          {activeMenu === 'returns'       && renderReturns()}
          {activeMenu === 'support'       && renderSupport()}
          {activeMenu === 'track'         && renderTrack()}
        </main>
      </div>

      {/* New Shipment Drawer */}
      {showNewShip && (
        <NewShipmentDrawer
          accountTerminals={account.terminals}
          theme={theme}
          onClose={() => setShowNewShip(false)}
          onSubmit={(order) => {
            setCreatedShipments(prev => [{
              id: `created-${Date.now()}`,
              waybill: order.waybill,
              customer: order.recipientName,
              phone: order.recipientPhone,
              destination: order.terminal,
              status: 'pending',
              value: Number(order.value) || 0,
              deliveryMethod: order.method,
              cod: order.cod,
              locker: '-',
            }, ...prev]);
          }}
        />
      )}

      {/* Import Shipments Modal */}
      {showImport && (
        <ImportShipmentsModal
          theme={theme}
          onClose={() => setShowImport(false)}
          onImport={(rows) => {
            const now = Date.now();
            const mapped = rows.map((r, i) => ({
              id: `import-${now}-${i}`,
              waybill: `LQ-ENT-${(now + i).toString(36).toUpperCase().slice(-6)}`,
              customer: r.recipient_name,
              phone: r.recipient_phone,
              destination: r.terminal || account.terminals[0] || 'Achimota Mall',
              status: 'pending',
              value: Number(r.value) || 0,
              deliveryMethod: r.delivery_method || 'warehouse_to_locker',
              cod: r.cod === 'true',
              locker: '-',
            }));
            setCreatedShipments(prev => [...mapped, ...prev]);
          }}
        />
      )}

      {/* Dispatch Form Drawer */}
      {dispatchForm !== null && (
        <DispatchFormDrawer
          dispatch={dispatchForm?.id ? dispatchForm : null}
          theme={theme}
          onClose={() => setDispatchForm(null)}
          onSave={handleSaveDispatch}
        />
      )}
    </div>
  );
}
