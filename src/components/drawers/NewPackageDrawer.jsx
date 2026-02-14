import React, { useState, useEffect, useMemo } from 'react';
import { X, Check, ChevronLeft, ChevronRight, Send, MapPin, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { DELIVERY_METHODS } from '../../constants';
import { terminalsData, phonePinData, packagesData, getTerminalAddress } from '../../constants/mockData';

const STEP_LABELS = ['Customer', 'Package', 'Delivery', 'Review'];
const PRODUCTS = ['Standard', "Pick 'N' Go", 'Dropbox Express', 'Home Delivery', 'Airport Pickup'];
const SIZES = ['Small', 'Medium', 'Large', 'XLarge'];

export const NewPackageDrawer = ({ isOpen, onClose }) => {
  const { theme } = useTheme();
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    customer: '', phone: '', email: '',
    size: '', weight: '', value: '', cod: false, fragile: false, product: '',
    deliveryMethod: '', destination: '', notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setErrors({});
      setForm({ customer: '', phone: '', email: '', size: '', weight: '', value: '', cod: false, fragile: false, product: '', deliveryMethod: '', destination: '', notes: '' });
    }
  }, [isOpen]);

  const pinnedInfo = useMemo(() => phonePinData.find(p => p.phone === form.phone), [form.phone]);

  useEffect(() => {
    if (pinnedInfo) {
      const terminal = terminalsData.find(t => t.name === pinnedInfo.pinnedTerminal);
      if (terminal) setForm(prev => ({ ...prev, destination: terminal.id }));
    }
  }, [pinnedInfo]);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.customer.trim()) e.customer = 'Required';
      if (!form.phone.trim()) e.phone = 'Required';
    }
    if (step === 1) {
      if (!form.size) e.size = 'Required';
      if (!form.product) e.product = 'Required';
    }
    if (step === 2) {
      if (!form.deliveryMethod) e.deliveryMethod = 'Required';
      if (!form.destination) e.destination = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    setStep(s => Math.min(s + 1, 3));
  };

  const handleSubmit = () => {
    const waybill = `LQ-2024-${String(packagesData.length + 1).padStart(5, '0')}`;
    const terminal = terminalsData.find(t => t.id === form.destination);
    // addToast({ type: 'success', message: `Package created! Waybill: ${waybill} → ${terminal?.name || form.destination}` });
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = (field) => ({
    backgroundColor: 'transparent',
    borderColor: errors[field] ? '#D48E8A' : theme.border.primary,
    color: theme.text.primary,
  });

  const labelCls = "text-xs font-semibold uppercase block mb-1.5";

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] border-l shadow-2xl z-50 flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
        <div>
          <p className="text-xs" style={{ color: theme.text.muted }}>NEW PACKAGE</p>
          <h2 className="font-semibold" style={{ color: theme.text.primary }}>{STEP_LABELS[step]}</h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}>
          <X size={18} />
        </button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: theme.border.primary }}>
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={label}>
            <button onClick={() => { if (i < step) setStep(i); }} className="flex items-center gap-1.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
                style={{
                  backgroundColor: i < step ? theme.accent.primary : i === step ? theme.accent.light : theme.bg.tertiary,
                  color: i < step ? theme.accent.contrast : i === step ? theme.accent.primary : theme.text.muted,
                }}
              >
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className="text-xs hidden sm:inline" style={{ color: i === step ? theme.text.primary : theme.text.muted }}>
                {label}
              </span>
            </button>
            {i < 3 && <div className="flex-1 h-0.5" style={{ backgroundColor: i < step ? theme.accent.primary : theme.border.primary }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Step 1: Customer */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Customer Name *</label>
              <input value={form.customer} onChange={e => update('customer', e.target.value)} placeholder="Full name" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('customer')} />
              {errors.customer && <p className="text-xs text-red-500 mt-1">{errors.customer}</p>}
            </div>
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Phone Number *</label>
              <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+233..." className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('phone')} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              {pinnedInfo && (
                <div className="flex items-center gap-2 mt-2 p-2.5 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <MapPin size={14} className="text-emerald-500 shrink-0" />
                  <p className="text-xs text-emerald-500">
                    <span className="font-semibold">{pinnedInfo.customer}</span> has pinned locker: <span className="font-mono font-semibold">{pinnedInfo.pinnedAddress}</span> ({pinnedInfo.pinnedTerminal})
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Email</label>
              <input value={form.email} onChange={e => update('email', e.target.value)} placeholder="email@example.com" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('email')} />
            </div>
          </div>
        )}

        {/* Step 2: Package Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Package Size *</label>
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => update('size', s)}
                    className="py-2.5 rounded-xl text-sm border text-center"
                    style={{
                      backgroundColor: form.size === s ? theme.accent.light : theme.bg.tertiary,
                      color: form.size === s ? theme.accent.primary : theme.text.secondary,
                      borderColor: form.size === s ? theme.accent.border : errors.size ? '#D48E8A' : theme.border.primary,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {errors.size && <p className="text-xs text-red-500 mt-1">{errors.size}</p>}
            </div>
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Product / Service *</label>
              <select value={form.product} onChange={e => update('product', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: errors.product ? '#D48E8A' : theme.border.primary, color: theme.text.primary }}>
                <option value="">Select service</option>
                {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.product && <p className="text-xs text-red-500 mt-1">{errors.product}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: theme.text.muted }}>Weight (kg)</label>
                <input type="number" value={form.weight} onChange={e => update('weight', e.target.value)} placeholder="0.0" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('weight')} />
              </div>
              <div>
                <label className={labelCls} style={{ color: theme.text.muted }}>Value (GH₵)</label>
                <input type="number" value={form.value} onChange={e => update('value', e.target.value)} placeholder="0.00" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('value')} />
              </div>
            </div>
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.cod} onChange={e => update('cod', e.target.checked)} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm" style={{ color: theme.text.secondary }}>Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.fragile} onChange={e => update('fragile', e.target.checked)} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm" style={{ color: theme.text.secondary }}>Fragile</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Delivery */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Delivery Method *</label>
              <div className="space-y-2">
                {Object.values(DELIVERY_METHODS).map(m => (
                  <button
                    key={m.id}
                    onClick={() => update('deliveryMethod', m.id)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl border text-left"
                    style={{
                      backgroundColor: form.deliveryMethod === m.id ? `${m.color}10` : theme.bg.tertiary,
                      borderColor: form.deliveryMethod === m.id ? m.color : errors.deliveryMethod ? '#D48E8A' : theme.border.primary,
                    }}
                  >
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${m.color}20` }}>
                      <m.icon size={18} style={{ color: m.color }} />
                    </div>
                    <span className="text-sm font-medium" style={{ color: form.deliveryMethod === m.id ? m.color : theme.text.secondary }}>
                      {m.label}
                    </span>
                    {form.deliveryMethod === m.id && <CheckCircle2 size={16} style={{ color: m.color }} className="ml-auto" />}
                  </button>
                ))}
              </div>
              {errors.deliveryMethod && <p className="text-xs text-red-500 mt-1">{errors.deliveryMethod}</p>}
            </div>
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Destination Terminal *</label>
              <select value={form.destination} onChange={e => update('destination', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: errors.destination ? '#D48E8A' : theme.border.primary, color: theme.text.primary }}>
                <option value="">Select terminal</option>
                {terminalsData.filter(t => t.status === 'online').map(t => (
                  <option key={t.id} value={t.id}>{t.name} — {getTerminalAddress(t)}</option>
                ))}
              </select>
              {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
              {pinnedInfo && (
                <p className="text-xs font-mono mt-1" style={{ color: theme.accent.primary }}>Auto-filled from pinned phone address</p>
              )}
            </div>
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Notes</label>
              <textarea rows={3} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Special instructions..." className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent resize-none" style={{ borderColor: theme.border.primary, color: theme.text.primary }} />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (() => {
          const terminal = terminalsData.find(t => t.id === form.destination);
          const method = DELIVERY_METHODS[form.deliveryMethod];
          const waybill = `LQ-2024-${String(packagesData.length + 1).padStart(5, '0')}`;
          return (
            <div className="space-y-4">
              {/* Waybill */}
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: theme.accent.light, border: `1px solid ${theme.accent.border}` }}>
                <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Waybill Number</p>
                <p className="text-xl font-mono font-bold mt-1" style={{ color: theme.accent.primary }}>{waybill}</p>
              </div>

              {/* Customer */}
              <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</h4>
                  <button onClick={() => setStep(0)} className="text-xs" style={{ color: theme.accent.primary }}>Edit</button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
                    {form.customer.charAt(0) || '?'}
                  </div>
                  <div>
                    <p className="font-medium" style={{ color: theme.text.primary }}>{form.customer}</p>
                    <p className="text-sm" style={{ color: theme.text.muted }}>{form.phone}{form.email ? ` • ${form.email}` : ''}</p>
                  </div>
                </div>
              </div>

              {/* Package */}
              <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Package</h4>
                  <button onClick={() => setStep(1)} className="text-xs" style={{ color: theme.accent.primary }}>Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs" style={{ color: theme.text.muted }}>Size</p><p style={{ color: theme.text.primary }}>{form.size}</p></div>
                  <div><p className="text-xs" style={{ color: theme.text.muted }}>Service</p><p style={{ color: theme.text.primary }}>{form.product}</p></div>
                  {form.weight && <div><p className="text-xs" style={{ color: theme.text.muted }}>Weight</p><p style={{ color: theme.text.primary }}>{form.weight}kg</p></div>}
                  {form.value && <div><p className="text-xs" style={{ color: theme.text.muted }}>Value</p><p style={{ color: theme.text.primary }}>GH₵ {form.value}</p></div>}
                  {form.cod && <div><p className="text-xs" style={{ color: theme.text.muted }}>COD</p><p className="text-amber-500 font-medium">Yes — GH₵ {form.value || '0'}</p></div>}
                  {form.fragile && <div><p className="text-xs" style={{ color: theme.text.muted }}>Fragile</p><p className="text-red-500 font-medium">Yes</p></div>}
                </div>
              </div>

              {/* Delivery */}
              <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Delivery</h4>
                  <button onClick={() => setStep(2)} className="text-xs" style={{ color: theme.accent.primary }}>Edit</button>
                </div>
                <div className="space-y-3 text-sm">
                  {method && (
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${method.color}20` }}>
                        <method.icon size={14} style={{ color: method.color }} />
                      </div>
                      <span style={{ color: theme.text.primary }}>{method.label}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-xs" style={{ color: theme.text.muted }}>Terminal</p><p style={{ color: theme.text.primary }}>{terminal?.name || '—'}</p></div>
                    <div><p className="text-xs" style={{ color: theme.text.muted }}>Address</p><p className="font-mono" style={{ color: theme.accent.primary }}>{terminal ? getTerminalAddress(terminal) : '—'}</p></div>
                  </div>
                  {form.notes && <div><p className="text-xs" style={{ color: theme.text.muted }}>Notes</p><p style={{ color: theme.text.secondary }}>{form.notes}</p></div>}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <ChevronLeft size={16} /> Back
          </button>
        )}
        {step < 3 ? (
          <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
            <Send size={16} /> Create Package
          </button>
        )}
      </div>
    </div>
  );
};
