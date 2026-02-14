import React, { useState, useEffect } from 'react';
import { PackageX, X, Warehouse, ArrowUpRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { StatusBadge } from '../ui/Badge';

const RETURN_REASONS = [
  { id: 'expired', label: 'Package Expired', desc: 'Exceeded locker storage time' },
  { id: 'refused', label: 'Customer Refused', desc: 'Customer declined delivery' },
  { id: 'damaged', label: 'Package Damaged', desc: 'Damaged during transit/storage' },
  { id: 'wrong_address', label: 'Wrong Address', desc: 'Incorrect destination' },
  { id: 'unclaimed', label: 'Unclaimed', desc: 'Customer did not pick up' },
  { id: 'other', label: 'Other', desc: 'Other reason' },
];

export const ReturnModal = ({ isOpen, onClose, pkg, addToast }) => {
  const { theme } = useTheme();
  const [returnReason, setReturnReason] = useState('');
  const [returnMethod, setReturnMethod] = useState('warehouse');
  const [notes, setNotes] = useState('');
  const [waiveReturn, setWaiveReturn] = useState(false);

  useEffect(() => {
    if (isOpen && pkg) {
      setReturnReason('');
      setReturnMethod('warehouse');
      setNotes('');
      setWaiveReturn(false);
    }
  }, [isOpen, pkg]);

  if (!isOpen || !pkg) return null;

  const handleSubmit = () => {
    if (!returnReason) { addToast({ type: 'warning', message: 'Please select a return reason' }); return; }
    const reasonLabel = RETURN_REASONS.find(r => r.id === returnReason)?.label || returnReason;
    addToast({ type: 'success', message: `${pkg.waybill} marked for return — ${reasonLabel}` });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-lg rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: theme.text.primary }}><PackageX size={20} className="text-red-500" /> Return Package</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.icon.muted }}><X size={18} /></button>
        </div>

        {/* Package Info */}
        <div className="p-3 rounded-xl border mb-5 flex items-center gap-3" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
          <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}><PackageX size={18} className="text-red-500" /></div>
          <div className="flex-1">
            <p className="font-mono text-sm font-medium" style={{ color: theme.accent.primary }}>{pkg.waybill}</p>
            <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.customer} · {pkg.destination}</p>
          </div>
          <StatusBadge status={pkg.status} />
        </div>

        <div className="space-y-4">
          {/* Return Reason */}
          <div>
            <label className="text-sm mb-2 block" style={{ color: theme.text.muted }}>Reason for Return</label>
            <div className="grid grid-cols-2 gap-2">
              {RETURN_REASONS.map(r => (
                <button key={r.id} onClick={() => setReturnReason(r.id)} className="p-3 rounded-xl text-left text-sm" style={{ backgroundColor: returnReason === r.id ? 'rgba(239, 68, 68, 0.08)' : theme.bg.tertiary, color: returnReason === r.id ? '#D48E8A' : theme.text.secondary, border: returnReason === r.id ? '1px solid rgba(239, 68, 68, 0.3)' : `1px solid ${theme.border.primary}` }}>
                  <p className="font-medium text-xs">{r.label}</p>
                  <p className="text-xs mt-0.5 opacity-70">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Return Method */}
          <div>
            <label className="text-sm mb-2 block" style={{ color: theme.text.muted }}>Return To</label>
            <div className="flex gap-2">
              {[['warehouse', 'Warehouse', Warehouse], ['sender', 'Sender', ArrowUpRight]].map(([k, l, Icon]) => (
                <button key={k} onClick={() => setReturnMethod(k)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm" style={{ backgroundColor: returnMethod === k ? theme.accent.light : theme.bg.tertiary, color: returnMethod === k ? theme.accent.primary : theme.text.secondary, border: returnMethod === k ? `1px solid ${theme.accent.border}` : `1px solid ${theme.border.primary}` }}>
                  <Icon size={16} /> {l}
                </button>
              ))}
            </div>
          </div>

          {/* Return Fee */}
          <div className="p-3 rounded-xl flex items-center justify-between" style={{ backgroundColor: theme.bg.tertiary, border: `1px solid ${theme.border.primary}` }}>
            <div>
              <p className="text-sm" style={{ color: theme.text.primary }}>Return Fee</p>
              <p className="text-xs" style={{ color: theme.text.muted }}>Standard return handling charge</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-semibold ${waiveReturn ? 'line-through opacity-50' : ''}`} style={{ color: theme.text.primary }}>GH₵ 8.00</span>
              <button onClick={() => setWaiveReturn(!waiveReturn)} className="px-2.5 py-1 rounded-lg text-xs" style={{ backgroundColor: waiveReturn ? 'rgba(16, 185, 129, 0.1)' : theme.bg.tertiary, color: waiveReturn ? '#81C995' : theme.text.muted, border: waiveReturn ? '1px solid rgba(16, 185, 129, 0.3)' : `1px solid ${theme.border.primary}` }}>
                {waiveReturn ? 'Waived' : 'Waive'}
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm mb-2 block" style={{ color: theme.text.muted }}>Notes (optional)</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Additional notes for the return..." className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl text-white text-sm flex items-center justify-center gap-2 bg-red-500">
            <PackageX size={16} /> Confirm Return
          </button>
        </div>
      </div>
    </div>
  );
};
