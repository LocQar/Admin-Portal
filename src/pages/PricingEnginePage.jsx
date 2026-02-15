import React from 'react';
import { Download, Warehouse, Inbox, Home, Truck } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { pricingRevenueData } from '../constants/mockData';

const BASE_RATE_CARD = [
  { id: 'SZ-S', size: 'Small', dimensions: '30×20×15 cm', maxWeight: 2, basePrice: 12, icon: '📦' },
  { id: 'SZ-M', size: 'Medium', dimensions: '45×35×25 cm', maxWeight: 5, basePrice: 18, icon: '📦' },
  { id: 'SZ-L', size: 'Large', dimensions: '60×45×35 cm', maxWeight: 10, basePrice: 25, icon: '📦' },
  { id: 'SZ-XL', size: 'XLarge', dimensions: '80×60×45 cm', maxWeight: 20, basePrice: 38, icon: '📦' },
];

const SLA_TIERS = [
  { id: 'SLA-STD', name: 'Standard', description: 'Next-day delivery to locker', hours: 24, multiplier: 1.0, color: '#78716C', icon: '🕐' },
  { id: 'SLA-EXP', name: 'Express', description: 'Same-day delivery (before 6PM)', hours: 8, multiplier: 1.5, color: '#D4AA5A', icon: '⚡' },
  { id: 'SLA-RUSH', name: 'Rush', description: 'Within 4 hours', hours: 4, multiplier: 2.2, color: '#D48E8A', icon: '🔥' },
  { id: 'SLA-ECO', name: 'Economy', description: '2-3 business days', hours: 72, multiplier: 0.75, color: '#81C995', icon: '🌿' },
];

const DELIVERY_METHOD_PRICING = [
  { id: 'DM-WL', method: 'warehouse_to_locker', label: 'Warehouse → Locker', baseMarkup: 0, description: 'Standard flow. Package from partner warehouse to locker terminal.', icon: Warehouse, color: '#7EA8C9' },
  { id: 'DM-DL', method: 'dropbox_to_locker', label: 'Dropbox → Locker', baseMarkup: 3, description: 'Customer drops off at dropbox, collected and routed to locker.', icon: Inbox, color: '#B5A0D1' },
  { id: 'DM-LH', method: 'locker_to_home', label: 'Locker → Home', baseMarkup: 8, description: 'Last-mile home delivery from locker terminal. Includes driver dispatch.', icon: Home, color: '#81C995' },
  { id: 'DM-WH', method: 'warehouse_to_home', label: 'Warehouse → Home (Direct)', baseMarkup: 12, description: 'Direct home delivery bypassing locker network. Premium service.', icon: Truck, color: '#D4AA5A' },
];

const SURCHARGES = [
  { id: 'SC-COD', name: 'Cash on Delivery', type: 'percentage', value: 3.5, basis: 'package_value', description: 'COD collection fee on declared value', active: true, category: 'collection' },
  { id: 'SC-INS', name: 'Insurance', type: 'percentage', value: 1.5, basis: 'package_value', description: 'Transit insurance on declared value', active: true, category: 'protection' },
  { id: 'SC-FRAG', name: 'Fragile Handling', type: 'flat', value: 5, basis: null, description: 'Special handling for fragile items', active: true, category: 'handling' },
  { id: 'SC-OW', name: 'Overweight', type: 'per_kg', value: 3, basis: 'excess_weight', description: 'Per kg charge above size max weight', active: true, category: 'handling' },
  { id: 'SC-STOR', name: 'Extended Storage', type: 'per_day', value: 0, basis: 'days_after_free', description: 'Daily charge after free storage period', active: true, category: 'storage', tiers: { Small: 2, Medium: 3, Large: 5, XLarge: 8 } },
  { id: 'SC-WEEKEND', name: 'Weekend Delivery', type: 'flat', value: 5, basis: null, description: 'Saturday/Sunday delivery surcharge', active: true, category: 'timing' },
  { id: 'SC-HOLIDAY', name: 'Holiday Delivery', type: 'flat', value: 10, basis: null, description: 'Public holiday delivery surcharge', active: false, category: 'timing' },
  { id: 'SC-RETURN', name: 'Return to Sender', type: 'flat', value: 8, basis: null, description: 'Fee for returning expired/refused packages', active: true, category: 'handling' },
  { id: 'SC-REDELIVER', name: 'Redelivery', type: 'flat', value: 6, basis: null, description: 'Charge for failed delivery reattempt', active: true, category: 'handling' },
  { id: 'SC-SMS', name: 'SMS Notification', type: 'flat', value: 0.05, basis: null, description: 'Per SMS sent to customer', active: true, category: 'communication' },
  { id: 'SC-WA', name: 'WhatsApp Notification', type: 'flat', value: 0.02, basis: null, description: 'Per WhatsApp message sent', active: true, category: 'communication' },
];

const PARTNER_PRICING_OVERRIDES = [
  { partnerId: 1, partnerName: 'Jumia Ghana', tier: 'gold', logo: '🟡', volumeDiscount: 15, customRates: { Small: 10.20, Medium: 15.30, Large: 21.25, XLarge: 32.30 }, slaDefault: 'SLA-STD', codRate: 3.0, freeStorageDays: 5, monthlyMinimum: 100, contractRate: true, notes: 'Custom rate card effective Jan 2024' },
  { partnerId: 2, partnerName: 'Melcom Ltd', tier: 'silver', logo: '🔵', volumeDiscount: 10, customRates: { Small: 10.80, Medium: 16.20, Large: 22.50, XLarge: 34.20 }, slaDefault: 'SLA-STD', codRate: 3.5, freeStorageDays: 3, monthlyMinimum: 50, contractRate: true, notes: 'Standard silver pricing' },
  { partnerId: 3, partnerName: 'Telecel Ghana', tier: 'gold', logo: '🔴', volumeDiscount: 15, customRates: { Small: 10.20, Medium: 15.30, Large: 21.25, XLarge: 32.30 }, slaDefault: 'SLA-EXP', codRate: 3.0, freeStorageDays: 5, monthlyMinimum: 100, contractRate: true, notes: 'Express SLA by default' },
  { partnerId: 4, partnerName: 'Hubtel', tier: 'bronze', logo: '🟢', volumeDiscount: 5, customRates: null, slaDefault: 'SLA-STD', codRate: 3.5, freeStorageDays: 3, monthlyMinimum: 0, contractRate: false, notes: 'Standard public pricing' },
  { partnerId: 5, partnerName: 'CompuGhana', tier: 'bronze', logo: '⚫', volumeDiscount: 5, customRates: null, slaDefault: 'SLA-STD', codRate: 3.5, freeStorageDays: 3, monthlyMinimum: 0, contractRate: false, notes: 'Inactive — contract expired' },
];

const VOLUME_DISCOUNT_TIERS = [
  { min: 0, max: 49, discount: 0, label: 'Standard' },
  { min: 50, max: 99, discount: 5, label: 'Bronze' },
  { min: 100, max: 249, discount: 10, label: 'Silver' },
  { min: 250, max: 499, discount: 15, label: 'Gold' },
  { min: 500, max: Infinity, discount: 20, label: 'Enterprise' },
];

const STORAGE_FREE_DAYS = { bronze: 3, silver: 3, gold: 5, enterprise: 7, individual: 5 };

const TIERS = {
  gold: { label: 'Gold', color: '#D4AA5A', bg: 'rgba(212,170,90,0.1)', perks: 'Priority SLA, Dedicated Support, Custom API Limits' },
  silver: { label: 'Silver', color: '#a3a3a3', bg: 'rgba(163,163,163,0.1)', perks: 'Standard SLA, Email Support, Standard API Limits' },
  bronze: { label: 'Bronze', color: '#cd7c32', bg: 'rgba(205,124,50,0.1)', perks: 'Basic SLA, Ticket Support, Basic API Limits' },
};

export const PricingEnginePage = ({ activeSubMenu, setShowExport }) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Pricing Engine</h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Rate Card'}</p>
        </div>
        <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
          <Download size={16} />Export
        </button>
      </div>

      {(!activeSubMenu || activeSubMenu === 'Rate Card') && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {BASE_RATE_CARD.map(r => (
              <div key={r.id} className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
                  <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Size</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Dimensions</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Max Weight</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Base Price</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Express (1.5x)</th>
                  <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Rush (2.2x)</th>
                </tr>
              </thead>
              <tbody>
                {BASE_RATE_CARD.map(r => (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                    <td className="p-3"><span className="font-medium" style={{ color: theme.text.primary }}>{r.size}</span></td>
                    <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{r.dimensions}</span></td>
                    <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{r.maxWeight} kg</span></td>
                    <td className="p-3"><span className="font-medium" style={{ color: theme.accent.primary }}>GH₵ {r.basePrice.toFixed(2)}</span></td>
                    <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: '#D4AA5A' }}>GH₵ {(r.basePrice * 1.5).toFixed(2)}</span></td>
                    <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: '#D48E8A' }}>GH₵ {(r.basePrice * 2.2).toFixed(2)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubMenu === 'Delivery Methods' && (
        <div className="space-y-4">
          {DELIVERY_METHOD_PRICING.map(dm => (
            <div key={dm.id} className="p-5 rounded-2xl border flex flex-col md:flex-row md:items-center gap-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${dm.color}15` }}>
                <dm.icon size={24} style={{ color: dm.color }} />
              </div>
              <div className="flex-1">
                <p className="font-semibold" style={{ color: theme.text.primary }}>{dm.label}</p>
                <p className="text-sm" style={{ color: theme.text.muted }}>{dm.description}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold" style={{ color: dm.baseMarkup > 0 ? dm.color : '#81C995' }}>+{dm.baseMarkup}%</p>
                <p className="text-xs" style={{ color: theme.text.muted }}>markup on base</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSubMenu === 'SLA Tiers' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {SLA_TIERS.map(sla => (
              <div key={sla.id} className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <div className="text-2xl mb-2">{sla.icon}</div>
                <p className="font-semibold" style={{ color: sla.color }}>{sla.name}</p>
                <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{sla.description}</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold" style={{ color: theme.text.primary }}>{sla.hours}</span>
                  <span className="text-sm mb-1" style={{ color: theme.text.muted }}>hrs</span>
                </div>
                <p className="text-sm mt-2" style={{ color: sla.color }}>{sla.multiplier}x multiplier</p>
              </div>
            ))}
          </div>
          <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Revenue by SLA Tier</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={pricingRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} formatter={v => `GH₵ ${v.toLocaleString()}`} />
                <Bar dataKey="standard" fill={theme.chart.stone} radius={[0, 0, 0, 0]} name="Standard" />
                <Bar dataKey="express" fill={theme.chart.amber} name="Express" />
                <Bar dataKey="rush" fill={theme.chart.coral} name="Rush" />
                <Bar dataKey="economy" fill={theme.chart.green} radius={[0, 0, 0, 0]} name="Economy" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {activeSubMenu === 'Surcharges' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
            <h3 className="font-semibold" style={{ color: theme.text.primary }}>Surcharges & Fees</h3>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Surcharge</th>
                <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Category</th>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Type</th>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Value</th>
                <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {SURCHARGES.map(sc => (
                <tr key={sc.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                  <td className="p-3">
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{sc.name}</p>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{sc.description}</p>
                  </td>
                  <td className="p-3 hidden md:table-cell"><span className="text-xs px-2 py-1 rounded-full capitalize" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}>{sc.category}</span></td>
                  <td className="p-3"><span className="text-sm capitalize" style={{ color: theme.text.secondary }}>{sc.type.replace('_', '/')}</span></td>
                  <td className="p-3"><span className="font-medium" style={{ color: theme.accent.primary }}>{sc.type === 'percentage' ? `${sc.value}%` : sc.type === 'per_day' && sc.tiers ? 'Tiered' : `GH₵ ${sc.value}`}</span></td>
                  <td className="p-3">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: sc.active ? '#81C99515' : '#D48E8A15', color: sc.active ? '#81C995' : '#D48E8A' }}>{sc.active ? 'Active' : 'Inactive'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeSubMenu === 'Volume Discounts' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {VOLUME_DISCOUNT_TIERS.map((vt, i) => (
              <div key={vt.label} className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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

      {activeSubMenu === 'Partner Overrides' && (
        <div className="space-y-4">
          {PARTNER_PRICING_OVERRIDES.map(pp => (
            <div key={pp.partnerId} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{pp.logo}</span>
                  <div>
                    <p className="font-semibold" style={{ color: theme.text.primary }}>{pp.partnerName}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: TIERS[pp.tier]?.bg, color: TIERS[pp.tier]?.color }}>{pp.tier}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm" style={{ color: theme.text.muted }}>Volume Discount</p>
                  <p className="text-xl font-bold" style={{ color: '#81C995' }}>{pp.volumeDiscount}%</p>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
                  {pp.customRates ? Object.entries(pp.customRates).map(([sz, price]) => (
                    <div key={sz} className="p-2 rounded-lg text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{sz}</p>
                      <p className="font-bold" style={{ color: theme.accent.primary }}>GH₵ {price}</p>
                    </div>
                  )) : <span className="col-span-4 text-sm" style={{ color: theme.text.muted }}>Standard public pricing</span>}
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
