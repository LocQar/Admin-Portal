import React, { useState, useMemo } from 'react';
import {
  X, Edit, Printer, Grid3X3, Timer, Banknote, CheckCircle2, RefreshCw,
  PackageX, MessageSquare, Save, Truck, MapPin, User, Phone,
  Package, Clock, AlertTriangle, Send, CheckCircle, Building2,
  Warehouse, Inbox, Home as HomeIcon, ChevronRight, Copy, Check,
  Shield, Star, KeyRound, Loader2,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { StatusBadge, DeliveryMethodBadge, PackageStatusFlow } from '../ui';
import { hasPermission, DELIVERY_METHODS } from '../../constants';
import { terminalsData, getLockerAddress, getTerminalAddress } from '../../constants/mockData';

// ── Print label ──────────────────────────────────────────────────────────────
const printLabel = (pkg) => {
  const lockerAddr = (() => {
    const t = terminalsData.find(t => t.name === pkg.destination);
    return t ? (pkg.locker !== '-' ? getLockerAddress(pkg.locker, pkg.destination) : getTerminalAddress(t)) : '—';
  })();
  const method = DELIVERY_METHODS[pkg.deliveryMethod]?.label || pkg.deliveryMethod || '';
  const html = `<!DOCTYPE html><html><head><title>Label – ${pkg.waybill}</title>
<style>* { box-sizing: border-box; margin: 0; padding: 0; } body { background: #fff; font-family: 'Courier New', Courier, monospace; } .page { width: 4in; padding: 14px; border: 2px solid #111; } .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 10px; } .brand { font-size: 22px; font-weight: 900; letter-spacing: -1px; } .brand-sub { font-size: 9px; color: #555; margin-top: 2px; } .date { font-size: 10px; color: #555; text-align: right; } .waybill { font-size: 26px; font-weight: 900; letter-spacing: 3px; text-align: center; border: 2px solid #111; padding: 8px; margin: 10px 0; } .barcode-area { text-align: center; font-size: 44px; letter-spacing: 6px; line-height: 1; margin: 4px 0 10px; overflow: hidden; } .dest-box { border: 2px solid #111; padding: 10px; margin: 10px 0; text-align: center; } .dest-addr { font-size: 28px; font-weight: 900; letter-spacing: 4px; } .dest-name { font-size: 12px; margin-top: 4px; } .dest-comp { font-size: 11px; color: #555; margin-top: 2px; } .lbl { font-size: 8px; font-weight: bold; text-transform: uppercase; color: #666; margin-bottom: 2px; } .val { font-size: 13px; font-weight: bold; } .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin: 8px 0; } .cell { padding: 6px 8px; border: 1px solid #ccc; } .row { display: flex; justify-content: space-between; align-items: center; padding: 4px 0; border-bottom: 1px dashed #ddd; } .badges { display: flex; gap: 6px; margin: 8px 0; flex-wrap: wrap; } .badge { font-size: 10px; font-weight: bold; border: 1.5px solid #111; padding: 2px 8px; } .badge-inv { background: #111; color: #fff; } .footer { font-size: 8px; color: #888; text-align: center; border-top: 1px dashed #ccc; padding-top: 6px; margin-top: 8px; } @media print { @page { margin: 0.2in; } }</style></head><body>
<div class="page">
  <div class="header"><div><div class="brand">LocQar™</div><div class="brand-sub">Smart Locker Network</div></div><div class="date">${new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}<br/>${new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })}</div></div>
  <div class="waybill">${pkg.waybill}</div>
  <div class="barcode-area">||| ${pkg.waybill.replace(/-/g,' ')} |||</div>
  <div class="dest-box"><div class="lbl">Delivery Destination</div><div class="dest-addr">${lockerAddr}</div><div class="dest-name">${pkg.destination}</div>${pkg.locker && pkg.locker !== '-' ? `<div class="dest-comp">Compartment ${pkg.locker}</div>` : ''}</div>
  <div class="row"><div><div class="lbl">Recipient</div><div class="val">${pkg.customer}</div></div><div style="text-align:right; font-size:11px;">${pkg.phone}</div></div>
  <div class="grid2" style="margin-top:10px;"><div class="cell"><div class="lbl">Service</div><div class="val" style="font-size:11px;">${pkg.product || '—'}</div></div><div class="cell"><div class="lbl">Method</div><div class="val" style="font-size:11px;">${method}</div></div><div class="cell"><div class="lbl">Size</div><div class="val" style="font-size:11px;">${pkg.size}</div></div><div class="cell"><div class="lbl">Weight</div><div class="val" style="font-size:11px;">${pkg.weight || '—'}</div></div><div class="cell"><div class="lbl">Value</div><div class="val" style="font-size:11px;">GH₵ ${pkg.value}</div></div><div class="cell"><div class="lbl">Created</div><div class="val" style="font-size:10px;">${pkg.createdAt || '—'}</div></div></div>
  <div class="badges"><div class="badge">${pkg.size.toUpperCase()}</div>${pkg.cod ? '<div class="badge badge-inv">CASH ON DELIVERY</div>' : ''}</div>
  <div class="footer">LocQar Locker Network • locqar.com • ${pkg.waybill}</div>
</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close();}}</script>
</body></html>`;
  const w = window.open('', '_blank', 'width=500,height=700');
  if (w) { w.document.write(html); w.document.close(); }
};

// ── Timeline generator ───────────────────────────────────────────────────────
const buildTimeline = (pkg, palette) => {
  const created = pkg.createdAt || '2024-01-15 08:00';
  const courier = pkg.courier?.name;

  const base = [{ color: palette.info, icon: Package, label: 'Order created', note: `Waybill ${pkg.waybill} issued`, time: created, done: true }];

  const byStatus = {
    pending:               [],
    at_dropbox:            [{ color: palette.secondary, icon: Inbox,     label: 'Deposited at dropbox',       note: 'Awaiting collection', time: created, done: true }],
    at_warehouse:          [{ color: palette.info, icon: Warehouse, label: 'Received at warehouse',       note: 'Package sorted & ready', time: created, done: true }],
    in_transit_to_locker:  [
      { color: palette.info, icon: Warehouse, label: 'Received at warehouse',   note: 'Sorted & assigned to route', time: created, done: true },
      { color: palette.info, icon: Truck,     label: 'Out for delivery',        note: courier ? `Courier: ${courier}` : 'En route to terminal', time: 'In progress', done: true, current: true },
    ],
    delivered_to_locker:   [
      { color: palette.info, icon: Warehouse, label: 'Received at warehouse',   note: 'Sorted & assigned to route', time: created, done: true },
      { color: palette.info, icon: Truck,     label: 'Out for delivery',        note: courier ? `Courier: ${courier}` : 'En route', time: created, done: true },
      { color: palette.success, icon: Grid3X3,   label: `Deposited in locker ${pkg.locker !== '-' ? pkg.locker : ''}`, note: `${pkg.destination} — awaiting pickup`, time: created, done: true, current: true },
    ],
    in_transit_to_home:    [
      { color: palette.info, icon: Warehouse, label: 'Received at warehouse',   note: 'Sorted for home delivery', time: created, done: true },
      { color: palette.info, icon: Truck,     label: 'Out for home delivery',   note: courier ? `Courier: ${courier}` : 'En route', time: 'In progress', done: true, current: true },
    ],
    delivered_to_home:     [
      { color: palette.info, icon: Warehouse, label: 'Received at warehouse',   note: 'Sorted for home delivery', time: created, done: true },
      { color: palette.info, icon: Truck,     label: 'Out for home delivery',   note: courier ? `Courier: ${courier}` : 'Delivered', time: created, done: true },
      { color: palette.success, icon: HomeIcon,  label: 'Delivered to home',       note: 'Successfully delivered', time: created, done: true, current: true },
    ],
    picked_up:             [
      { color: palette.info, icon: Warehouse, label: 'Received at warehouse',   note: 'Package processed', time: created, done: true },
      { color: palette.info, icon: Truck,     label: 'Delivered to locker',     note: `${pkg.destination}`, time: created, done: true },
      { color: palette.success, icon: CheckCircle2, label: 'Picked up by recipient', note: pkg.customer, time: created, done: true, current: true },
    ],
    expired:               [
      { color: palette.info, icon: Warehouse, label: 'Received at warehouse',   note: 'Package processed', time: created, done: true },
      { color: palette.info, icon: Truck,     label: 'Delivered to locker',     note: `${pkg.destination}`, time: created, done: true },
      { color: palette.error, icon: AlertTriangle, label: 'Package expired',     note: 'Not collected within storage window', time: created, done: true, current: true },
    ],
  };

  const steps = byStatus[pkg.status] || [];
  return [...base, ...steps];
};

// ── Mock notification history per package ────────────────────────────────────
const buildNotifHistory = (pkg) => [
  { id: 1, channel: 'SMS',      msg: `Your package ${pkg.waybill} is ready for pickup at ${pkg.destination}.`,     sentAt: '08:35 AM', status: 'delivered' },
  { id: 2, channel: 'WhatsApp', msg: `Hi ${pkg.customer?.split(' ')[0]}, your package has arrived! Locker ${pkg.locker || 'assigned'}.`, sentAt: '08:36 AM', status: 'read' },
];

const SIZES = ['Small', 'Medium', 'Large', 'Extra Large'];

// ── Component ────────────────────────────────────────────────────────────────
export const PackageDetailDrawer = ({ pkg, onClose, userRole, addToast, onReassign, onReturn, onMarkDelivered, onSave }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('details');
  const [isEditing, setIsEditing] = useState(false);
  const [copiedWaybill, setCopiedWaybill] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [msgChannel, setMsgChannel] = useState('SMS');
  const [sentMsgs, setSentMsgs] = useState([]);
  const [pinResending, setPinResending] = useState(false);
  const [pinLastSent, setPinLastSent] = useState(null);
  const [form, setForm] = useState({
    customer: pkg?.customer ?? '',
    phone: pkg?.phone ?? '',
    destination: pkg?.destination ?? '',
    product: pkg?.product ?? '',
    value: pkg?.value ?? 0,
    weight: pkg?.weight ?? '',
    size: pkg?.size ?? 'Medium',
    notes: pkg?.notes ?? '',
  });

  if (!pkg) return null;

  const timelinePalette = useMemo(() => ({
    info: theme.status.info,
    success: theme.status.success,
    error: theme.status.error,
    secondary: theme.accent.secondary,
  }), [theme]);
  const chanColors = useMemo(() => ({ SMS: theme.status.success, WhatsApp: theme.status.success, Email: theme.status.info }), [theme]);
  const timeline = useMemo(() => buildTimeline(pkg, timelinePalette), [pkg, timelinePalette]);
  const notifHistory = useMemo(() => buildNotifHistory(pkg), [pkg]);

  const lockerAddr = useMemo(() => {
    const t = terminalsData.find(t => t.name === pkg.destination);
    return t ? (pkg.locker && pkg.locker !== '-' ? getLockerAddress(pkg.locker, pkg.destination) : getTerminalAddress(t)) : '—';
  }, [pkg]);

  const slaUrgent = pkg.daysInLocker > 5;
  const slaWarning = !slaUrgent && pkg.daysInLocker >= 3;

  const upd = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const handleSave = () => {
    if (onSave) onSave({ ...pkg, ...form });
    if (addToast) addToast({ type: 'success', message: `${pkg.waybill} updated` });
    setIsEditing(false);
  };

  const handleDelivered = () => {
    if (onMarkDelivered) onMarkDelivered(pkg);
    if (addToast) addToast({ type: 'success', message: `${pkg.waybill} marked as delivered` });
    onClose();
  };

  const handleSendMsg = () => {
    if (!msgText.trim()) return;
    setSentMsgs(p => [...p, { id: Date.now(), channel: msgChannel, msg: msgText, sentAt: 'Just now', status: 'delivered' }]);
    if (addToast) addToast({ type: 'success', message: `${msgChannel} sent to ${pkg.customer}` });
    setMsgText('');
  };

  const handleResendPin = (channel) => {
    setPinResending(true);
    setTimeout(() => {
      setPinResending(false);
      setPinLastSent({ channel, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) });
      if (addToast) addToast({
        type: 'success',
        message: `Pickup PIN resent via ${channel} to ${channel === 'SMS' ? pkg.phone : (pkg.email || pkg.phone)}`,
      });
    }, 1200);
  };

  const copyWaybill = () => {
    navigator.clipboard.writeText(pkg.waybill).catch(() => {});
    setCopiedWaybill(true);
    setTimeout(() => setCopiedWaybill(false), 1500);
  };

  const is = { backgroundColor: 'transparent', borderColor: theme.border.primary, color: theme.text.primary };
  const labelCls = "text-xs font-semibold uppercase block mb-1.5";

  // ── SLA urgency banner ──
  const slaBanner = pkg.status === 'delivered_to_locker' && (slaUrgent || slaWarning) ? (
    <div className="mx-4 mt-3 flex items-center gap-2 px-3 py-2 rounded-xl" style={{ backgroundColor: slaUrgent ? theme.status.error + '15' : theme.status.warning + '15', border: `1px solid ${slaUrgent ? theme.status.error + '40' : theme.status.warning + '40'}` }}>
      <AlertTriangle size={13} style={{ color: slaUrgent ? theme.status.error : theme.status.warning, flexShrink: 0 }} />
      <p className="text-xs" style={{ color: slaUrgent ? theme.status.error : theme.status.warning }}>
        {slaUrgent ? `Storage limit exceeded — ${pkg.daysInLocker} days in locker. Expiry risk.` : `${pkg.daysInLocker} days in locker — customer should pick up soon.`}
      </p>
    </div>
  ) : null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[500px] border-l shadow-2xl z-50 flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>

      {/* ── Header ── */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
        <div>
          <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Package</p>
          <div className="flex items-center gap-2 mt-0.5">
            <h2 className="font-bold font-mono" style={{ color: theme.text.primary }}>{pkg.waybill}</h2>
            <button onClick={copyWaybill} style={{ color: theme.icon.muted }}>
              {copiedWaybill ? <Check size={13} style={{ color: theme.status.success }} /> : <Copy size={13} />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          {hasPermission(userRole, 'packages.update') && !isEditing && (
            <button onClick={() => setIsEditing(true)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.icon.primary }} title="Edit">
              <Edit size={17} />
            </button>
          )}
          {isEditing && (
            <>
              <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
                <Save size={13} /> Save
              </button>
              <button onClick={() => setIsEditing(false)} className="px-2.5 py-1.5 rounded-lg text-sm" style={{ color: theme.text.muted }}>Cancel</button>
            </>
          )}
          <button onClick={() => printLabel(pkg)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.icon.primary }} title="Print">
            <Printer size={17} />
          </button>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.icon.primary }}>
            <X size={17} />
          </button>
        </div>
      </div>

      {/* ── Status + flow ── */}
      {!isEditing && (
        <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <div className="flex items-center justify-between mb-3">
            <DeliveryMethodBadge method={pkg.deliveryMethod} />
            <div className="flex items-center gap-2">
              {pkg.cod && <span className="text-xs px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: theme.status.warning + '20', color: theme.status.warning }}>COD GH₵{pkg.value}</span>}
              <StatusBadge status={pkg.status} />
            </div>
          </div>
          <PackageStatusFlow status={pkg.status} deliveryMethod={pkg.deliveryMethod} />
        </div>
      )}

      {/* ── Locker badge ── */}
      {!isEditing && pkg.locker && pkg.locker !== '-' && (
        <div className="mx-4 mt-3 p-3 rounded-xl flex items-center justify-between" style={{ backgroundColor: theme.status.success + '10', border: `1px solid ${theme.status.success + '30'}` }}>
          <div className="flex items-center gap-3">
            <Grid3X3 size={18} style={{ color: theme.status.success }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: theme.status.success }}>Locker {pkg.locker}</p>
              <p className="text-xs font-mono" style={{ color: theme.status.success, opacity: 0.8 }}>{lockerAddr} · {pkg.destination}</p>
            </div>
          </div>
          {pkg.daysInLocker > 0 && (
            <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: slaUrgent ? theme.status.error : slaWarning ? theme.status.warning : theme.status.success }}>
              <Timer size={14} /> {pkg.daysInLocker}d
            </div>
          )}
        </div>
      )}

      {/* SLA urgency banner */}
      {slaBanner}

      {/* ── Tabs ── */}
      {!isEditing && (
        <div className="flex gap-1 px-4 pt-3 pb-0 border-b" style={{ borderColor: theme.border.primary }}>
          {['details', 'timeline', 'messages'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="px-4 py-2 rounded-t-xl text-sm capitalize border-b-2 transition-all"
              style={{
                borderBottomColor: activeTab === tab ? theme.accent.primary : 'transparent',
                color: activeTab === tab ? theme.accent.primary : theme.text.muted,
                fontWeight: activeTab === tab ? 600 : 400,
              }}
            >
              {tab === 'messages' ? `Messages${sentMsgs.length > 0 ? ` (${notifHistory.length + sentMsgs.length})` : ` (${notifHistory.length})`}` : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">

        {/* ── EDIT MODE ── */}
        {isEditing && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ color: theme.text.muted }} className={labelCls}>Customer Name</label>
                <input value={form.customer} onChange={e => upd('customer', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is} />
              </div>
              <div>
                <label style={{ color: theme.text.muted }} className={labelCls}>Phone</label>
                <input value={form.phone} onChange={e => upd('phone', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is} />
              </div>
            </div>
            <div>
              <label style={{ color: theme.text.muted }} className={labelCls}>Destination Terminal</label>
              <select value={form.destination} onChange={e => upd('destination', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is}>
                {terminalsData.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: theme.text.muted }} className={labelCls}>Product / Service</label>
              <input value={form.product} onChange={e => upd('product', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label style={{ color: theme.text.muted }} className={labelCls}>Value (GH₵)</label>
                <input type="number" value={form.value} onChange={e => upd('value', Number(e.target.value))} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is} />
              </div>
              <div>
                <label style={{ color: theme.text.muted }} className={labelCls}>Weight</label>
                <input value={form.weight} onChange={e => upd('weight', e.target.value)} placeholder="e.g. 2.5 kg" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is} />
              </div>
              <div>
                <label style={{ color: theme.text.muted }} className={labelCls}>Size</label>
                <select value={form.size} onChange={e => upd('size', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={is}>
                  {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ color: theme.text.muted }} className={labelCls}>Notes</label>
              <textarea value={form.notes} onChange={e => upd('notes', e.target.value)} rows={3} placeholder="Internal notes…" className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} />
            </div>
          </div>
        )}

        {/* ── DETAILS TAB ── */}
        {!isEditing && activeTab === 'details' && (
          <>
            {/* Customer */}
            <div className="p-4 rounded-2xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
              <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Recipient</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm" style={{ backgroundColor: theme.accent.primary + '20', color: theme.accent.primary }}>
                  {pkg.customer.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold" style={{ color: theme.text.primary }}>{pkg.customer}</p>
                  <p className="text-sm flex items-center gap-1 mt-0.5" style={{ color: theme.text.muted }}>
                    <Phone size={11} /> {pkg.phone}
                  </p>
                  {pkg.email && <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.email}</p>}
                </div>
              </div>
            </div>

            {/* Package details grid */}
            <div className="p-4 rounded-2xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
              <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Package Details</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                {[
                  ['Destination', pkg.destination],
                  ['Locker Address', lockerAddr],
                  ['Service', pkg.product],
                  ['Value', `GH₵ ${pkg.value}`],
                  ['Weight', pkg.weight || '—'],
                  ['Size', pkg.size],
                  ['Created', pkg.createdAt?.slice(0, 10) || '—'],
                  ['Method', DELIVERY_METHODS[pkg.deliveryMethod]?.label],
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                    <p className={`mt-0.5 font-medium ${l === 'Locker Address' ? 'font-mono text-xs' : ''}`} style={{ color: l === 'Locker Address' ? theme.accent.primary : theme.text.primary }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Pickup PIN — only when in locker */}
            {pkg.status === 'delivered_to_locker' && (() => {
              const pin = pkg.pickupPin || String(100000 + (pkg.id * 137 % 900000)).slice(0, 6);
              const canSeePin = userRole === 'super_admin';
              return (
                <div className="p-4 rounded-2xl border" style={{ backgroundColor: theme.status.info + '08', borderColor: theme.status.info + '30' }}>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Pickup PIN</p>
                    <div className="flex items-center gap-1.5">
                      {!canSeePin && (
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: theme.status.warning + '15', color: theme.status.warning }}>
                          Restricted
                        </span>
                      )}
                      <KeyRound size={14} style={{ color: theme.status.info }} />
                    </div>
                  </div>

                  {/* PIN digits */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    {pin.split('').map((digit, i) => (
                      <div
                        key={i}
                        className="w-10 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-xl border"
                        style={{ backgroundColor: theme.bg.card, borderColor: theme.status.info + '40', color: theme.text.primary }}
                      >
                        {canSeePin ? digit : '•'}
                      </div>
                    ))}
                  </div>

                  {/* Last sent notice */}
                  {pinLastSent && (
                    <p className="text-center text-xs mb-3" style={{ color: theme.status.success }}>
                      PIN resent via {pinLastSent.channel} at {pinLastSent.time}
                    </p>
                  )}

                  {/* Resend buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleResendPin('SMS')}
                      disabled={pinResending}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all"
                      style={{ borderColor: theme.status.info + '40', color: theme.status.info, backgroundColor: theme.status.info + '10', opacity: pinResending ? 0.6 : 1 }}
                    >
                      {pinResending ? <Loader2 size={14} className="animate-spin" /> : <Phone size={14} />}
                      Resend SMS
                    </button>
                    <button
                      onClick={() => handleResendPin('Email')}
                      disabled={pinResending}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all"
                      style={{ borderColor: theme.status.info + '40', color: theme.status.info, backgroundColor: theme.status.info + '10', opacity: pinResending ? 0.6 : 1 }}
                    >
                      {pinResending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                      Resend Email
                    </button>
                  </div>

                  {/* Contact info */}
                  <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2" style={{ borderColor: theme.status.info + '20' }}>
                    <div>
                      <p className="text-xs" style={{ color: theme.text.muted }}>SMS to</p>
                      <p className="text-xs font-medium font-mono mt-0.5" style={{ color: theme.text.secondary }}>{pkg.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: theme.text.muted }}>Email to</p>
                      <p className="text-xs font-medium mt-0.5 truncate" style={{ color: theme.text.secondary }}>{pkg.email || '—'}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Courier */}
            {pkg.courier && (
              <div className="p-4 rounded-2xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Assigned Courier</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm" style={{ backgroundColor: theme.status.info + '20', color: theme.status.info }}>
                    {pkg.courier.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: theme.text.primary }}>{pkg.courier.name}</p>
                    <p className="text-xs" style={{ color: theme.text.muted }}>Courier ID #{pkg.courier.id}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-1" style={{ color: theme.status.warning }}>
                    <Star size={12} fill={theme.status.warning} /> <span className="text-xs font-semibold">4.8</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {hasPermission(userRole, 'packages.update') && (
              <div className="grid grid-cols-3 gap-2">
                <button onClick={handleDelivered} className="flex flex-col items-center gap-2 p-3.5 rounded-xl" style={{ backgroundColor: theme.status.success + '15', border: `1px solid ${theme.status.success + '30'}`, color: theme.status.success }}>
                  <CheckCircle2 size={20} /><span className="text-xs font-medium">Mark Delivered</span>
                </button>
                <button onClick={() => onReassign && onReassign(pkg)} className="flex flex-col items-center gap-2 p-3.5 rounded-xl" style={{ backgroundColor: theme.status.warning + '15', border: `1px solid ${theme.status.warning + '30'}`, color: theme.status.warning }}>
                  <RefreshCw size={20} /><span className="text-xs font-medium">Reassign</span>
                </button>
                <button onClick={() => onReturn && onReturn(pkg)} className="flex flex-col items-center gap-2 p-3.5 rounded-xl" style={{ backgroundColor: theme.status.error + '15', border: `1px solid ${theme.status.error + '30'}`, color: theme.status.error }}>
                  <PackageX size={20} /><span className="text-xs font-medium">Return</span>
                </button>
              </div>
            )}
          </>
        )}

        {/* ── TIMELINE TAB ── */}
        {!isEditing && activeTab === 'timeline' && (
          <div>
            <div className="relative">
              {timeline.map((step, i) => (
                <div key={i} className="flex gap-3 relative pb-4">
                  {i < timeline.length - 1 && (
                    <div className="absolute left-[15px] top-8 bottom-0 w-px" style={{ backgroundColor: theme.border.primary }} />
                  )}
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center relative z-10" style={{ backgroundColor: step.done ? `${step.color}20` : theme.bg.tertiary, border: `2px solid ${step.done ? step.color : theme.border.primary}` }}>
                    <step.icon size={14} style={{ color: step.done ? step.color : theme.text.muted }} />
                  </div>
                  <div className="flex-1 pt-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold" style={{ color: step.current ? step.color : theme.text.primary }}>{step.label}</p>
                      {step.current && <span className="text-xs px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${step.color}20`, color: step.color }}>Current</span>}
                    </div>
                    {step.note && <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{step.note}</p>}
                    <p className="text-xs mt-0.5" style={{ color: theme.text.muted, opacity: 0.6 }}>{step.time}</p>
                  </div>
                </div>
              ))}

              {/* Pending future steps */}
              {pkg.status === 'delivered_to_locker' && (
                <div className="flex gap-3 relative pb-4 opacity-40">
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: theme.bg.tertiary, border: `2px dashed ${theme.border.primary}` }}>
                    <User size={14} style={{ color: theme.text.muted }} />
                  </div>
                  <div className="pt-1">
                    <p className="text-sm" style={{ color: theme.text.muted }}>Pickup by recipient</p>
                    <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>Pending</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MESSAGES TAB ── */}
        {!isEditing && activeTab === 'messages' && (
          <div className="space-y-4">
            {/* Compose */}
            {hasPermission(userRole, 'packages.view') && (
              <div className="p-4 rounded-2xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Send Notification</p>
                {/* Channel pills */}
                <div className="flex gap-2 mb-3">
                  {['SMS', 'WhatsApp', 'Email'].map(ch => (
                    <button key={ch} onClick={() => setMsgChannel(ch)} className="px-3 py-1 rounded-lg text-xs font-medium border" style={{ backgroundColor: msgChannel === ch ? `${chanColors[ch]}20` : 'transparent', color: msgChannel === ch ? chanColors[ch] : theme.text.muted, borderColor: msgChannel === ch ? `${chanColors[ch]}40` : theme.border.primary }}>
                      {ch}
                    </button>
                  ))}
                </div>
                <div className="text-xs mb-2 flex items-center gap-2" style={{ color: theme.text.muted }}>
                  <Phone size={10} /> To: {pkg.phone} ({pkg.customer})
                </div>
                {/* Quick templates */}
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {[
                    `Your package ${pkg.waybill} is ready for pickup.`,
                    `Reminder: ${pkg.waybill} at ${pkg.destination} locker ${pkg.locker}.`,
                    `Package ${pkg.waybill} will expire in 24h.`,
                  ].map((t, i) => (
                    <button key={i} onClick={() => setMsgText(t)} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, color: theme.text.muted }}>
                      Template {i + 1}
                    </button>
                  ))}
                </div>
                <textarea value={msgText} onChange={e => setMsgText(e.target.value)} rows={2} placeholder="Type message…" className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} />
                <button onClick={handleSendMsg} disabled={!msgText.trim()} className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium disabled:opacity-40" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
                  <Send size={14} /> Send {msgChannel}
                </button>
              </div>
            )}

            {/* History */}
            <div>
              <p className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>Notification History</p>
              <div className="space-y-2">
                {[...sentMsgs, ...notifHistory].map((m, i) => (
                  <div key={m.id || i} className="flex gap-3 p-3 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${chanColors[m.channel] || theme.status.info}20` }}>
                      <MessageSquare size={13} style={{ color: chanColors[m.channel] || theme.status.info }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold" style={{ color: chanColors[m.channel] || theme.status.info }}>{m.channel}</span>
                        <span className="text-xs" style={{ color: theme.text.muted }}>{m.sentAt}</span>
                      </div>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: theme.text.secondary }}>{m.msg}</p>
                      <span className="inline-flex items-center gap-1 text-xs mt-1" style={{ color: m.status === 'read' ? theme.status.success : m.status === 'delivered' ? theme.status.info : theme.text.muted }}>
                        <CheckCircle size={10} /> {m.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};


