import React, { useState, useEffect } from 'react';
import { RefreshCw, X, Package, MapPin, Car } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { StatusBadge } from '../ui/Badge';
import { terminalsData, driversData } from '../../constants/mockData';

export const ReassignModal = ({ isOpen, onClose, pkg, addToast }) => {
  const { theme } = useTheme();
  const [reassignType, setReassignType] = useState('terminal');
  const [selectedTerminal, setSelectedTerminal] = useState('');
  const [selectedDriver, setSelectedDriver] = useState('');
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState('normal');

  useEffect(() => {
    if (isOpen && pkg) {
      setReassignType('terminal');
      setSelectedTerminal('');
      setSelectedDriver('');
      setReason('');
      setPriority('normal');
    }
  }, [isOpen, pkg]);

  if (!isOpen || !pkg) return null;

  const handleSubmit = () => {
    if (reassignType === 'terminal' && !selectedTerminal) { addToast({ type: 'warning', message: 'Please select a destination terminal' }); return; }
    if (reassignType === 'driver' && !selectedDriver) { addToast({ type: 'warning', message: 'Please select a driver' }); return; }
    const target = reassignType === 'terminal' ? selectedTerminal : selectedDriver;
    addToast({ type: 'success', message: `${pkg.waybill} reassigned to ${target}` });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-lg rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: theme.text.primary }}><RefreshCw size={20} className="text-amber-500" /> Reassign Package</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.icon.muted }}><X size={18} /></button>
        </div>

        {/* Package Info */}
        <div className="p-3 rounded-xl border mb-5 flex items-center gap-3" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
          <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accent.light }}><Package size={18} style={{ color: theme.accent.primary }} /></div>
          <div className="flex-1">
            <p className="font-mono text-sm font-medium" style={{ color: theme.accent.primary }}>{pkg.waybill}</p>
            <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.customer} · {pkg.destination}</p>
          </div>
          <StatusBadge status={pkg.status} />
        </div>

        <div className="space-y-4">
          {/* Reassign Type */}
          <div>
            <label className="text-sm mb-2 block" style={{ color: theme.text.muted }}>Reassign To</label>
            <div className="flex gap-2">
              {[['terminal', 'Terminal', MapPin], ['driver', 'Driver', Car]].map(([k, l, Icon]) => (
                <button key={k} onClick={() => setReassignType(k)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm" style={{ backgroundColor: reassignType === k ? theme.accent.light : theme.bg.tertiary, color: reassignType === k ? theme.accent.primary : theme.text.secondary, border: reassignType === k ? `1px solid ${theme.accent.border}` : `1px solid ${theme.border.primary}` }}>
                  <Icon size={16} /> {l}
                </button>
              ))}
            </div>
          </div>

          {/* Terminal Select */}
          {reassignType === 'terminal' && (
            <div>
              <label className="text-sm mb-2 block" style={{ color: theme.text.muted }}>Destination Terminal</label>
              <select value={selectedTerminal} onChange={e => setSelectedTerminal(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                <option value="">Select terminal...</option>
                {terminalsData.filter(t => t.name !== pkg.destination).map(t => (
                  <option key={t.id} value={t.name}>{t.name} — {t.available} lockers available</option>
                ))}
              </select>
            </div>
          )}

          {/* Driver Select */}
          {reassignType === 'driver' && (
            <div>
              <label className="text-sm mb-2 block" style={{ color: theme.text.muted }}>Assign Driver</label>
              <select value={selectedDriver} onChange={e => setSelectedDriver(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                <option value="">Select driver...</option>
                {driversData.filter(d => d.status !== 'offline').map(d => (
                  <option key={d.id} value={d.name}>{d.name} — {d.zone} ({d.status})</option>
                ))}
              </select>
            </div>
          )}

          {/* Priority */}
          <div>
            <label className="text-sm mb-2 block" style={{ color: theme.text.muted }}>Priority</label>
            <div className="flex gap-2">
              {[['normal', 'Normal', '#78716C'], ['high', 'High', '#D4AA5A'], ['urgent', 'Urgent', '#D48E8A']].map(([k, l, c]) => (
                <button key={k} onClick={() => setPriority(k)} className="flex-1 py-2 rounded-xl text-sm" style={{ backgroundColor: priority === k ? c + '15' : theme.bg.tertiary, color: priority === k ? c : theme.text.secondary, border: priority === k ? `1px solid ${c}30` : `1px solid ${theme.border.primary}` }}>{l}</button>
              ))}
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-sm mb-2 block" style={{ color: theme.text.muted }}>Reason</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2} placeholder="Why is this package being reassigned?" className="w-full px-3 py-2.5 rounded-xl border text-sm resize-none" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }} />
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2" style={{ backgroundColor: '#D4AA5A', color: '#1C1917' }}>
            <RefreshCw size={16} /> Reassign Package
          </button>
        </div>
      </div>
    </div>
  );
};
