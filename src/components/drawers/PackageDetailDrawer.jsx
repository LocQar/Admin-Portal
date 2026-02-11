import React, { useState } from 'react';
import { X, Edit, Printer, Grid3X3, Timer, Banknote, CheckCircle2, RefreshCw, PackageX, MessageSquare, Send } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { StatusBadge, DeliveryMethodBadge, PackageStatusFlow } from '../ui';
import { hasPermission, DELIVERY_METHODS } from '../../constants';
import { terminalsData, getLockerAddress, getTerminalAddress } from '../../constants/mockData';

export const PackageDetailDrawer = ({ pkg, onClose, userRole, onReassign, onReturn }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('details');

  if (!pkg) return null;

  const handleAction = (action) => {
    if (action === 'reassigned') {
      onReassign(pkg);
      return;
    }
    if (action === 'marked for return') {
      onReturn(pkg);
      return;
    }
    // addToast({ type: 'success', message: `Package ${action} successfully` });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] border-l shadow-2xl z-50 flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
        <div>
          <p className="text-xs" style={{ color: theme.text.muted }}>PACKAGE</p>
          <h2 className="font-semibold" style={{ color: theme.text.primary }}>{pkg.waybill}</h2>
        </div>
        <div className="flex gap-2">
          {hasPermission(userRole, 'packages.update') && (
            <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}>
              <Edit size={18} />
            </button>
          )}
          <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}>
            <Printer size={18} />
          </button>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}>
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
        <div className="flex items-center justify-between mb-3">
          <DeliveryMethodBadge method={pkg.deliveryMethod} />
          <StatusBadge status={pkg.status} />
        </div>
        <PackageStatusFlow status={pkg.status} deliveryMethod={pkg.deliveryMethod} />
      </div>

      {pkg.locker && pkg.locker !== '-' && (
        <div className="mx-4 mt-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Grid3X3 size={20} className="text-emerald-500" />
              <div>
                <p className="text-sm font-medium text-emerald-500">Locker {pkg.locker}</p>
                <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.destination}</p>
                <p className="text-xs font-mono" style={{ color: '#10b981' }}>{getLockerAddress(pkg.locker, pkg.destination)}</p>
              </div>
            </div>
            {pkg.daysInLocker > 0 && (
              <div className="flex items-center gap-1">
                <Timer size={14} className={pkg.daysInLocker > 5 ? 'text-red-500' : 'text-amber-500'} />
                <span className={`text-sm ${pkg.daysInLocker > 5 ? 'text-red-500' : 'text-amber-500'}`}>{pkg.daysInLocker}d</span>
              </div>
            )}
          </div>
          {pkg.cod && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-emerald-500/20">
              <Banknote size={16} className="text-amber-500" />
              <span className="text-sm text-amber-500 font-medium">COD: GH₵ {pkg.value}</span>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-1 p-4 border-b" style={{ borderColor: theme.border.primary }}>
        {['details', 'tracking', 'messages'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-4 py-2 rounded-lg text-sm capitalize"
            style={{
              backgroundColor: activeTab === tab ? theme.bg.tertiary : 'transparent',
              color: activeTab === tab ? theme.text.primary : theme.text.muted
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
              <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Customer</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: theme.accent.primary }}>
                  {pkg.customer.charAt(0)}
                </div>
                <div>
                  <p style={{ color: theme.text.primary }}>{pkg.customer}</p>
                  <p className="text-sm" style={{ color: theme.text.muted }}>{pkg.phone}</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
              <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Destination', pkg.destination],
                  ['Locker Address', (() => {
                    const t = terminalsData.find(t => t.name === pkg.destination);
                    return t ? (pkg.locker !== '-' ? getLockerAddress(pkg.locker, pkg.destination) : getTerminalAddress(t)) : '—';
                  })()],
                  ['Service', pkg.product],
                  ['Value', `GH₵ ${pkg.value}`],
                  ['Weight', pkg.weight],
                  ['Size', pkg.size],
                  ['Method', DELIVERY_METHODS[pkg.deliveryMethod]?.label]
                ].map(([l, v]) => (
                  <div key={l}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                    <p
                      className={l === 'Locker Address' ? 'font-mono' : ''}
                      style={{ color: l === 'Locker Address' ? theme.accent.primary : theme.text.primary }}
                    >
                      {v}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {hasPermission(userRole, 'packages.update') && (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAction('marked as delivered')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl text-emerald-500"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}
                >
                  <CheckCircle2 size={20} />
                  <span className="text-xs">Delivered</span>
                </button>
                <button
                  onClick={() => handleAction('reassigned')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl text-amber-500"
                  style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}
                >
                  <RefreshCw size={20} />
                  <span className="text-xs">Reassign</span>
                </button>
                <button
                  onClick={() => handleAction('marked for return')}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl text-red-500"
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                >
                  <PackageX size={20} />
                  <span className="text-xs">Return</span>
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tracking' && (
          <div className="space-y-4">
            {[
              { time: '14:32', event: 'Deposited in Locker A-15', current: true },
              { time: '12:18', event: 'Arrived at terminal' },
              { time: '08:45', event: 'Out for delivery' },
              { time: 'Yesterday', event: 'Received at warehouse' }
            ].map((t, i) => (
              <div key={i} className="flex gap-3">
                <div
                  className={`w-3 h-3 rounded-full mt-1 ${t.current ? 'bg-emerald-500' : ''}`}
                  style={{ backgroundColor: t.current ? undefined : theme.border.secondary }}
                />
                <div>
                  <p style={{ color: theme.text.primary }}>{t.event}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{t.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="text-center py-8">
            <MessageSquare size={32} style={{ color: theme.text.muted }} className="mx-auto mb-2" />
            <p className="text-sm" style={{ color: theme.text.muted }}>No messages</p>
            {hasPermission(userRole, 'customers.communicate') && (
              <button className="mt-4 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}>
                <Send size={14} className="inline mr-2" />Send SMS
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
