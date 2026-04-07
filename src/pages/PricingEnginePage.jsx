import React, { useState } from 'react';
import { Download, Warehouse, Inbox, Home, Truck, Edit2, X, ToggleLeft, ToggleRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { pricingRevenueData } from '../constants/mockData';

const INITIAL_RATE_CARD = [
  { id: 'SZ-S', size: 'Small', dimensions: '30×20×15 cm', maxWeight: 2, basePrice: 12, icon: '📦' },
  { id: 'SZ-M', size: 'Medium', dimensions: '45×35×25 cm', maxWeight: 5, basePrice: 18, icon: '📦' },
  { id: 'SZ-L', size: 'Large', dimensions: '60×45×35 cm', maxWeight: 10, basePrice: 25, icon: '📦' },
  { id: 'SZ-XL', size: 'XLarge', dimensions: '80×60×45 cm', maxWeight: 20, basePrice: 38, icon: '📦' },
];

const INITIAL_SLA_TIERS = [
  { id: 'SLA-STD', name: 'Standard', description: 'Next-day delivery to locker', hours: 24, multiplier: 1.0, color: '#78716C', icon: '🕐' },
  { id: 'SLA-EXP', name: 'Express', description: 'Same-day delivery (before 6PM)', hours: 8, multiplier: 1.5, color: '#D4AA5A', icon: '⚡' },
  { id: 'SLA-RUSH', name: 'Rush', description: 'Within 4 hours', hours: 4, multiplier: 2.2, color: '#D48E8A', icon: '🔥' },
  { id: 'SLA-ECO', name: 'Economy', description: '2-3 business days', hours: 72, multiplier: 0.75, color: '#81C995', icon: '🌿' },
];

const INITIAL_DELIVERY_METHODS = [
  { id: 'DM-WL', method: 'warehouse_to_locker', label: 'Warehouse → Locker', baseMarkup: 0, description: 'Standard flow. Package from partner warehouse to locker terminal.', icon: Warehouse, color: '#7EA8C9' },
  { id: 'DM-DL', method: 'dropbox_to_locker', label: 'Dropbox → Locker', baseMarkup: 3, description: 'Customer drops off at dropbox, collected and routed to locker.', icon: Inbox, color: '#B5A0D1' },
  { id: 'DM-LH', method: 'locker_to_home', label: 'Locker → Home', baseMarkup: 8, description: 'Last-mile home delivery from locker terminal. Includes driver dispatch.', icon: Home, color: '#81C995' },
  { id: 'DM-WH', method: 'warehouse_to_home', label: 'Warehouse → Home (Direct)', baseMarkup: 12, description: 'Direct home delivery bypassing locker network. Premium service.', icon: Truck, color: '#D4AA5A' },
];

const INITIAL_SURCHARGES = [
  { id: 'SC-COD', name: 'Cash on Delivery', type: 'percentage', value: 3.5, description: 'COD collection fee on declared value', active: true, category: 'collection' },
  { id: 'SC-INS', name: 'Insurance', type: 'percentage', value: 1.5, description: 'Transit insurance on declared value', active: true, category: 'protection' },
  { id: 'SC-FRAG', name: 'Fragile Handling', type: 'flat', value: 5, description: 'Special handling for fragile items', active: true, category: 'handling' },
  { id: 'SC-OW', name: 'Overweight', type: 'per_kg', value: 3, description: 'Per kg charge above size max weight', active: true, category: 'handling' },
  { id: 'SC-STOR', name: 'Extended Storage', type: 'per_day', value: 0, description: 'Daily charge after free storage period', active: true, category: 'storage', tiers: { Small: 2, Medium: 3, Large: 5, XLarge: 8 } },
  { id: 'SC-WEEKEND', name: 'Weekend Delivery', type: 'flat', value: 5, description: 'Saturday/Sunday delivery surcharge', active: true, category: 'timing' },
  { id: 'SC-HOLIDAY', name: 'Holiday Delivery', type: 'flat', value: 10, description: 'Public holiday delivery surcharge', active: false, category: 'timing' },
  { id: 'SC-RETURN', name: 'Return to Sender', type: 'flat', value: 8, description: 'Fee for returning expired/refused packages', active: true, category: 'handling' },
  { id: 'SC-REDELIVER', name: 'Redelivery', type: 'flat', value: 6, description: 'Charge for failed delivery reattempt', active: true, category: 'handling' },
  { id: 'SC-SMS', name: 'SMS Notification', type: 'flat', value: 0.05, description: 'Per SMS sent to customer', active: true, category: 'communication' },
  { id: 'SC-WA', name: 'WhatsApp Notification', type: 'flat', value: 0.02, description: 'Per WhatsApp message sent', active: true, category: 'communication' },
];

const INITIAL_VOLUME_TIERS = [
  { min: 0, max: 49, discount: 0, label: 'Standard' },
  { min: 50, max: 99, discount: 5, label: 'Bronze' },
  { min: 100, max: 249, discount: 10, label: 'Silver' },
  { min: 250, max: 499, discount: 15, label: 'Gold' },
  { min: 500, max: Infinity, discount: 20, label: 'Enterprise' },
];

const STORAGE_FREE_DAYS = { bronze: 3, silver: 3, gold: 5, enterprise: 7, individual: 5 };

const INITIAL_PARTNERS = [
  { partnerId: 1, partnerName: 'Jumia Ghana', tier: 'gold', logo: '🟡', volumeDiscount: 15, customRates: { Small: 10.20, Medium: 15.30, Large: 21.25, XLarge: 32.30 }, slaDefault: 'SLA-STD', codRate: 3.0, freeStorageDays: 5, monthlyMinimum: 100, contractRate: true, notes: 'Custom rate card effective Jan 2024' },
  { partnerId: 2, partnerName: 'Melcom Ltd', tier: 'silver', logo: '🔵', volumeDiscount: 10, customRates: { Small: 10.80, Medium: 16.20, Large: 22.50, XLarge: 34.20 }, slaDefault: 'SLA-STD', codRate: 3.5, freeStorageDays: 3, monthlyMinimum: 50, contractRate: true, notes: 'Standard silver pricing' },
  { partnerId: 3, partnerName: 'Telecel Ghana', tier: 'gold', logo: '🔴', volumeDiscount: 15, customRates: { Small: 10.20, Medium: 15.30, Large: 21.25, XLarge: 32.30 }, slaDefault: 'SLA-EXP', codRate: 3.0, freeStorageDays: 5, monthlyMinimum: 100, contractRate: true, notes: 'Express SLA by default' },
  { partnerId: 4, partnerName: 'Hubtel', tier: 'bronze', logo: '🟢', volumeDiscount: 5, customRates: null, slaDefault: 'SLA-STD', codRate: 3.5, freeStorageDays: 3, monthlyMinimum: 0, contractRate: false, notes: 'Standard public pricing' },
  { partnerId: 5, partnerName: 'CompuGhana', tier: 'bronze', logo: '⚫', volumeDiscount: 5, customRates: null, slaDefault: 'SLA-STD', codRate: 3.5, freeStorageDays: 3, monthlyMinimum: 0, contractRate: false, notes: 'Inactive — contract expired' },
];

const TIER_META = {
  gold: { label: 'Gold', color: '#D4AA5A', bg: 'rgba(212,170,90,0.1)' },
  silver: { label: 'Silver', color: '#a3a3a3', bg: 'rgba(163,163,163,0.1)' },
  bronze: { label: 'Bronze', color: '#cd7c32', bg: 'rgba(205,124,50,0.1)' },
};

const IC = "w-full px-3 py-2 rounded-xl border text-sm mt-1";

export const PricingEnginePage = ({ activeSubMenu, setShowExport, addToast }) => {
  const { theme } = useTheme();
  const toast = (msg) => addToast && addToast({ type: 'success', message: msg });
  const is = (extra = {}) => ({ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary, ...extra });

  const [rateCard, setRateCard] = useState(INITIAL_RATE_CARD);
  const [slaTiers, setSlaTiers] = useState(INITIAL_SLA_TIERS);
  const [deliveryMethods, setDeliveryMethods] = useState(INITIAL_DELIVERY_METHODS);
  const [surcharges, setSurcharges] = useState(INITIAL_SURCHARGES);
  const [volumeTiers, setVolumeTiers] = useState(INITIAL_VOLUME_TIERS);
  const [partners, setPartners] = useState(INITIAL_PARTNERS);

  const [editRate, setEditRate] = useState(null);
  const [editSla, setEditSla] = useState(null);
  const [editDM, setEditDM] = useState(null);
  const [editSC, setEditSC] = useState(null);
  const [editVT, setEditVT] = useState(null);
  const [editPartner, setEditPartner] = useState(null);

  const F = ({ label, children }) => (
    <div>
      <label className="text-xs block mb-1" style={{ color: theme.text.muted }}>{label}</label>
      {children}
    </div>
  );

  const SmModal = ({ title, onClose, onSave, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-sm rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-semibold" style={{ color: theme.text.primary }}>{title}</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/5" style={{ color: theme.icon.muted }}><X size={18} /></button>
        </div>
        <div className="space-y-3">{children}</div>
        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={onSave} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>Save</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4 md:p-6">

      {/* ── RATE CARD EDIT MODAL ── */}
      {editRate && (
        <SmModal title={`Edit Rate — ${editRate.size}`} onClose={() => setEditRate(null)} onSave={() => { setRateCard(p => p.map(r => r.id === editRate.id ? editRate : r)); setEditRate(null); toast(`${editRate.size} rate updated`); }}>
          <F label="Base Price (GH₵)"><input type="number" step="0.01" value={editRate.basePrice} onChange={e => setEditRate({ ...editRate, basePrice: parseFloat(e.target.value) || 0 })} className={IC} style={is()} /></F>
          <F label="Max Weight (kg)"><input type="number" step="0.5" value={editRate.maxWeight} onChange={e => setEditRate({ ...editRate, maxWeight: parseFloat(e.target.value) || 0 })} className={IC} style={is()} /></F>
          <F label="Dimensions"><input type="text" value={editRate.dimensions} onChange={e => setEditRate({ ...editRate, dimensions: e.target.value })} className={IC} style={is()} /></F>
        </SmModal>
      )}

      {/* ── SLA TIER EDIT MODAL ── */}
      {editSla && (
        <SmModal title={`Edit SLA — ${editSla.name}`} onClose={() => setEditSla(null)} onSave={() => { setSlaTiers(p => p.map(s => s.id === editSla.id ? editSla : s)); setEditSla(null); toast(`${editSla.name} SLA updated`); }}>
          <F label="Window (hours)"><input type="number" value={editSla.hours} onChange={e => setEditSla({ ...editSla, hours: parseInt(e.target.value) || 0 })} className={IC} style={is()} /></F>
          <F label="Price Multiplier"><input type="number" step="0.05" value={editSla.multiplier} onChange={e => setEditSla({ ...editSla, multiplier: parseFloat(e.target.value) || 0 })} className={IC} style={is()} /></F>
          <F label="Description"><input type="text" value={editSla.description} onChange={e => setEditSla({ ...editSla, description: e.target.value })} className={IC} style={is()} /></F>
        </SmModal>
      )}

      {/* ── DELIVERY METHOD EDIT MODAL ── */}
      {editDM && (
        <SmModal title="Edit Delivery Method" onClose={() => setEditDM(null)} onSave={() => { setDeliveryMethods(p => p.map(d => d.id === editDM.id ? editDM : d)); setEditDM(null); toast('Delivery method updated'); }}>
          <F label="Label"><input type="text" value={editDM.label} onChange={e => setEditDM({ ...editDM, label: e.target.value })} className={IC} style={is()} /></F>
          <F label="Base Markup (%)"><input type="number" step="0.5" value={editDM.baseMarkup} onChange={e => setEditDM({ ...editDM, baseMarkup: parseFloat(e.target.value) || 0 })} className={IC} style={is()} /></F>
          <F label="Description"><textarea rows={2} value={editDM.description} onChange={e => setEditDM({ ...editDM, description: e.target.value })} className={`${IC} resize-none`} style={is()} /></F>
        </SmModal>
      )}

      {/* ── SURCHARGE EDIT MODAL ── */}
      {editSC && (
        <SmModal title={`Edit — ${editSC.name}`} onClose={() => setEditSC(null)} onSave={() => { setSurcharges(p => p.map(s => s.id === editSC.id ? editSC : s)); setEditSC(null); toast(`${editSC.name} updated`); }}>
          <F label="Name"><input type="text" value={editSC.name} onChange={e => setEditSC({ ...editSC, name: e.target.value })} className={IC} style={is()} /></F>
          <F label={`Value ${editSC.type === 'percentage' ? '(%)' : editSC.type === 'per_kg' ? '(GH₵/kg)' : editSC.type === 'per_day' ? '(GH₵/day)' : '(GH₵)'}`}>
            <input type="number" step="0.01" value={editSC.value} onChange={e => setEditSC({ ...editSC, value: parseFloat(e.target.value) || 0 })} className={IC} style={is()} />
          </F>
          <F label="Description"><input type="text" value={editSC.description} onChange={e => setEditSC({ ...editSC, description: e.target.value })} className={IC} style={is()} /></F>
          <div className="flex items-center justify-between py-1">
            <span className="text-sm" style={{ color: theme.text.secondary }}>Active</span>
            <button onClick={() => setEditSC({ ...editSC, active: !editSC.active })} style={{ color: editSC.active ? '#81C995' : theme.icon.muted }}>
              {editSC.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
            </button>
          </div>
        </SmModal>
      )}

      {/* ── VOLUME TIER EDIT MODAL ── */}
      {editVT && (
        <SmModal title={`Edit Tier — ${editVT.label}`} onClose={() => setEditVT(null)} onSave={() => { setVolumeTiers(p => p.map(v => v.label === editVT.label ? editVT : v)); setEditVT(null); toast(`${editVT.label} tier updated`); }}>
          <div className="grid grid-cols-2 gap-3">
            <F label="Min Packages"><input type="number" value={editVT.min} onChange={e => setEditVT({ ...editVT, min: parseInt(e.target.value) || 0 })} className={IC} style={is()} /></F>
            <F label="Max Packages"><input type="number" value={editVT.max === Infinity ? '' : editVT.max} placeholder="∞" onChange={e => setEditVT({ ...editVT, max: e.target.value ? parseInt(e.target.value) : Infinity })} className={IC} style={is()} /></F>
          </div>
          <F label="Discount (%)"><input type="number" step="0.5" value={editVT.discount} onChange={e => setEditVT({ ...editVT, discount: parseFloat(e.target.value) || 0 })} className={IC} style={is()} /></F>
        </SmModal>
      )}

      {/* ── PARTNER OVERRIDE DRAWER ── */}
      {editPartner && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setEditPartner(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-lg h-full overflow-y-auto border-l flex flex-col" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{editPartner.logo}</span>
                <div>
                  <h3 className="font-semibold" style={{ color: theme.text.primary }}>{editPartner.partnerName}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: TIER_META[editPartner.tier]?.bg, color: TIER_META[editPartner.tier]?.color }}>{editPartner.tier}</span>
                </div>
              </div>
              <button onClick={() => setEditPartner(null)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.icon.muted }}><X size={18} /></button>
            </div>

            <div className="flex-1 p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <F label="Tier">
                  <select value={editPartner.tier} onChange={e => setEditPartner({ ...editPartner, tier: e.target.value })} className={IC} style={is()}>
                    <option value="gold">Gold</option>
                    <option value="silver">Silver</option>
                    <option value="bronze">Bronze</option>
                  </select>
                </F>
                <F label="Volume Discount (%)">
                  <input type="number" step="0.5" value={editPartner.volumeDiscount} onChange={e => setEditPartner({ ...editPartner, volumeDiscount: parseFloat(e.target.value) || 0 })} className={IC} style={is()} />
                </F>
                <F label="COD Rate (%)">
                  <input type="number" step="0.1" value={editPartner.codRate} onChange={e => setEditPartner({ ...editPartner, codRate: parseFloat(e.target.value) || 0 })} className={IC} style={is()} />
                </F>
                <F label="Free Storage Days">
                  <input type="number" value={editPartner.freeStorageDays} onChange={e => setEditPartner({ ...editPartner, freeStorageDays: parseInt(e.target.value) || 0 })} className={IC} style={is()} />
                </F>
                <F label="Monthly Minimum">
                  <input type="number" value={editPartner.monthlyMinimum} onChange={e => setEditPartner({ ...editPartner, monthlyMinimum: parseInt(e.target.value) || 0 })} className={IC} style={is()} />
                </F>
                <F label="Default SLA">
                  <select value={editPartner.slaDefault} onChange={e => setEditPartner({ ...editPartner, slaDefault: e.target.value })} className={IC} style={is()}>
                    <option value="SLA-STD">Standard</option>
                    <option value="SLA-EXP">Express</option>
                    <option value="SLA-RUSH">Rush</option>
                    <option value="SLA-ECO">Economy</option>
                  </select>
                </F>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium" style={{ color: theme.text.primary }}>Custom Rate Card</p>
                  <button onClick={() => setEditPartner({ ...editPartner, customRates: editPartner.customRates ? null : { Small: 10, Medium: 15, Large: 21, XLarge: 32 } })} style={{ color: editPartner.customRates ? '#81C995' : theme.icon.muted }}>
                    {editPartner.customRates ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                  </button>
                </div>
                {editPartner.customRates && (
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(editPartner.customRates).map(([sz, price]) => (
                      <F key={sz} label={`${sz} (GH₵)`}>
                        <input type="number" step="0.01" value={price} onChange={e => setEditPartner({ ...editPartner, customRates: { ...editPartner.customRates, [sz]: parseFloat(e.target.value) || 0 } })} className={IC} style={is()} />
                      </F>
                    ))}
                  </div>
                )}
                {!editPartner.customRates && <p className="text-xs" style={{ color: theme.text.muted }}>Using standard public pricing</p>}
              </div>

              <div className="flex items-center justify-between py-1 border-t" style={{ borderColor: theme.border.primary }}>
                <span className="text-sm" style={{ color: theme.text.secondary }}>Contract Rate</span>
                <button onClick={() => setEditPartner({ ...editPartner, contractRate: !editPartner.contractRate })} style={{ color: editPartner.contractRate ? '#81C995' : theme.icon.muted }}>
                  {editPartner.contractRate ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                </button>
              </div>

              <F label="Notes">
                <textarea rows={3} value={editPartner.notes} onChange={e => setEditPartner({ ...editPartner, notes: e.target.value })} className={`${IC} resize-none`} style={is()} />
              </F>
            </div>

            <div className="p-6 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
              <button onClick={() => setEditPartner(null)} className="flex-1 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
              <button onClick={() => { setPartners(p => p.map(x => x.partnerId === editPartner.partnerId ? editPartner : x)); setEditPartner(null); toast(`${editPartner.partnerName} override saved`); }} className="flex-1 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>Save Override</button>
            </div>
          </div>
        </div>
      )}

      {/* ── HEADER ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Pricing Engine</h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Rate Card'}</p>
        </div>
        <button onClick={() => setShowExport && setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
          <Download size={16} />Export
        </button>
      </div>

      {/* ══════════════ RATE CARD ══════════════ */}
      {(!activeSubMenu || activeSubMenu === 'Rate Card') && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rateCard.map(r => (
              <div key={r.id} className="p-5 rounded-2xl border relative group" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <button onClick={() => setEditRate({ ...r })} className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-opacity" style={{ color: theme.icon.muted }}>
                  <Edit2 size={14} />
                </button>
                <div className="text-2xl mb-2">{r.icon}</div>
                <p className="font-semibold" style={{ color: theme.text.primary }}>{r.size}</p>
                <p className="text-xs mb-2" style={{ color: theme.text.muted }}>{r.dimensions}</p>
                <p className="text-3xl font-bold" style={{ color: theme.accent.primary }}>GH₵ {r.basePrice}</p>
                <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Max {r.maxWeight} kg</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Base Rate Comparison</h3>
            </div>
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  {['Size', 'Dimensions', 'Max Weight', 'Base Price', 'Express (1.5×)', 'Rush (2.2×)', ''].map((h, i) => (
                    <th key={i} className={`text-left p-3 text-xs font-semibold uppercase ${i >= 4 ? 'hidden md:table-cell' : ''}`} style={{ color: theme.text.muted }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rateCard.map(r => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <td className="p-3 font-medium text-sm" style={{ color: theme.text.primary }}>{r.size}</td>
                    <td className="p-3 text-sm" style={{ color: theme.text.secondary }}>{r.dimensions}</td>
                    <td className="p-3 text-sm" style={{ color: theme.text.secondary }}>{r.maxWeight} kg</td>
                    <td className="p-3 font-medium text-sm" style={{ color: theme.accent.primary }}>GH₵ {r.basePrice.toFixed(2)}</td>
                    <td className="p-3 text-sm hidden md:table-cell" style={{ color: '#D4AA5A' }}>GH₵ {(r.basePrice * 1.5).toFixed(2)}</td>
                    <td className="p-3 text-sm hidden md:table-cell" style={{ color: '#D48E8A' }}>GH₵ {(r.basePrice * 2.2).toFixed(2)}</td>
                    <td className="p-3">
                      <button onClick={() => setEditRate({ ...r })} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.icon.muted }}><Edit2 size={14} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ══════════════ DELIVERY METHODS ══════════════ */}
      {activeSubMenu === 'Delivery Methods' && (
        <div className="space-y-4">
          {deliveryMethods.map(dm => (
            <div key={dm.id} className="p-5 rounded-2xl border flex flex-col md:flex-row md:items-center gap-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${dm.color}15` }}>
                <dm.icon size={24} style={{ color: dm.color }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold" style={{ color: theme.text.primary }}>{dm.label}</p>
                <p className="text-sm" style={{ color: theme.text.muted }}>{dm.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold" style={{ color: dm.baseMarkup > 0 ? dm.color : '#81C995' }}>+{dm.baseMarkup}%</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>markup on base</p>
                </div>
                <button onClick={() => setEditDM({ ...dm })} className="p-2 rounded-xl hover:bg-white/5" style={{ color: theme.icon.muted }}><Edit2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════ SLA TIERS ══════════════ */}
      {activeSubMenu === 'SLA Tiers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {slaTiers.map(sla => (
              <div key={sla.id} className="p-5 rounded-2xl border relative group" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <button onClick={() => setEditSla({ ...sla })} className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-opacity" style={{ color: theme.icon.muted }}>
                  <Edit2 size={14} />
                </button>
                <div className="text-2xl mb-2">{sla.icon}</div>
                <p className="font-semibold" style={{ color: sla.color }}>{sla.name}</p>
                <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{sla.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold" style={{ color: theme.text.primary }}>{sla.hours}</span>
                  <span className="text-sm mb-1" style={{ color: theme.text.muted }}>hrs</span>
                </div>
                <p className="text-sm mt-2" style={{ color: sla.color }}>{sla.multiplier}× multiplier</p>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Revenue by SLA Tier</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pricingRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} tickFormatter={v => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} labelStyle={{ color: theme.text.primary }} itemStyle={{ color: theme.text.secondary }} formatter={v => `GH₵ ${v.toLocaleString()}`} />
                <Bar dataKey="standard" fill={theme.chart.stone} name="Standard" />
                <Bar dataKey="express" fill={theme.chart.amber} name="Express" />
                <Bar dataKey="rush" fill={theme.chart.coral} name="Rush" />
                <Bar dataKey="economy" fill={theme.chart.green} name="Economy" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ══════════════ SURCHARGES ══════════════ */}
      {activeSubMenu === 'Surcharges' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>Surcharges & Fees</h3>
            <div className="flex gap-3 text-xs" style={{ color: theme.text.muted }}>
              <span style={{ color: '#81C995' }}>{surcharges.filter(s => s.active).length} active</span>
              <span>· {surcharges.filter(s => !s.active).length} inactive</span>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                {['Surcharge', 'Category', 'Type', 'Value', 'Active', ''].map((h, i) => (
                  <th key={i} className={`text-left p-3 text-xs font-semibold uppercase ${i === 1 ? 'hidden md:table-cell' : ''}`} style={{ color: theme.text.muted }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {surcharges.map(sc => (
                <tr key={sc.id} style={{ borderBottom: `1px solid ${theme.border.primary}`, opacity: sc.active ? 1 : 0.5 }}>
                  <td className="p-3">
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{sc.name}</p>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{sc.description}</p>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}>{sc.category}</span>
                  </td>
                  <td className="p-3 text-sm capitalize" style={{ color: theme.text.secondary }}>{sc.type.replace(/_/g, '/')}</td>
                  <td className="p-3 font-medium text-sm" style={{ color: theme.accent.primary }}>
                    {sc.type === 'percentage' ? `${sc.value}%` : sc.type === 'per_day' && sc.tiers ? 'Tiered' : `GH₵ ${sc.value}`}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => { setSurcharges(p => p.map(s => s.id === sc.id ? { ...s, active: !s.active } : s)); toast(`${sc.name} ${sc.active ? 'deactivated' : 'activated'}`); }}
                      title={sc.active ? 'Click to deactivate' : 'Click to activate'}
                      style={{ color: sc.active ? '#81C995' : theme.icon.muted }}
                    >
                      {sc.active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                    </button>
                  </td>
                  <td className="p-3">
                    <button onClick={() => setEditSC({ ...sc })} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.icon.muted }}><Edit2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ══════════════ VOLUME DISCOUNTS ══════════════ */}
      {activeSubMenu === 'Volume Discounts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {volumeTiers.map((vt, i) => (
              <div key={vt.label} className="p-5 rounded-2xl border relative group" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <button onClick={() => setEditVT({ ...vt })} className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-opacity" style={{ color: theme.icon.muted }}>
                  <Edit2 size={14} />
                </button>
                <p className="font-semibold" style={{ color: theme.text.primary }}>{vt.label}</p>
                <p className="text-xs mb-2" style={{ color: theme.text.muted }}>{vt.min}–{vt.max === Infinity ? '∞' : vt.max} pkgs/mo</p>
                <p className="text-3xl font-bold" style={{ color: i === 0 ? theme.text.muted : '#81C995' }}>{vt.discount}%</p>
                <p className="text-xs" style={{ color: theme.text.muted }}>discount</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border p-5" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Free Storage Days by Tier</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(STORAGE_FREE_DAYS).map(([tier, days]) => (
                <div key={tier} className="p-3 rounded-xl border text-center" style={{ borderColor: theme.border.primary }}>
                  <p className="text-xs capitalize mb-1" style={{ color: theme.text.muted }}>{tier}</p>
                  <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{days}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>days free</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ PARTNER OVERRIDES ══════════════ */}
      {activeSubMenu === 'Partner Overrides' && (
        <div className="space-y-4">
          {partners.map(pp => (
            <div key={pp.partnerId} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pp.logo}</span>
                  <div>
                    <p className="font-semibold" style={{ color: theme.text.primary }}>{pp.partnerName}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: TIER_META[pp.tier]?.bg, color: TIER_META[pp.tier]?.color }}>{pp.tier}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs" style={{ color: theme.text.muted }}>Volume Discount</p>
                    <p className="text-xl font-bold" style={{ color: '#81C995' }}>{pp.volumeDiscount}%</p>
                  </div>
                  <button onClick={() => setEditPartner({ ...pp, customRates: pp.customRates ? { ...pp.customRates } : null })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                    <Edit2 size={12} />Edit Override
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
                  {pp.customRates
                    ? Object.entries(pp.customRates).map(([sz, price]) => (
                      <div key={sz} className="p-2 rounded-lg text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{sz}</p>
                        <p className="font-bold" style={{ color: theme.accent.primary }}>GH₵ {price}</p>
                      </div>
                    ))
                    : <span className="col-span-4 text-sm" style={{ color: theme.text.muted }}>Standard public pricing</span>}
                  <div className="p-2 rounded-lg text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>COD Rate</p>
                    <p className="font-bold" style={{ color: theme.text.primary }}>{pp.codRate}%</p>
                  </div>
                  <div className="p-2 rounded-lg text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>Free Storage</p>
                    <p className="font-bold" style={{ color: theme.text.primary }}>{pp.freeStorageDays} days</p>
                  </div>
                  <div className="p-2 rounded-lg text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>Min/Month</p>
                    <p className="font-bold" style={{ color: theme.text.primary }}>{pp.monthlyMinimum || '—'}</p>
                  </div>
                </div>
                {pp.notes && <p className="text-xs mt-3 italic" style={{ color: theme.text.muted }}>{pp.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
