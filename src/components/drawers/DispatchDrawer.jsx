import React, { useState, useEffect, useMemo } from 'react';
import { X, Truck, MapPin, Send, Eye, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { Checkbox } from '../ui/Checkbox';
import { StatusBadge, DeliveryMethodBadge } from '../ui/Badge';
import { packagesData, driversData } from '../../constants/mockData';

export const DispatchDrawer = ({ isOpen, onClose, onViewFull }) => {
  const { theme } = useTheme();
  const [selected, setSelected] = useState([]);
  const [driverId, setDriverId] = useState('');

  const pendingPackages = useMemo(() =>
    packagesData.filter(p => ['pending', 'at_warehouse', 'at_dropbox'].includes(p.status)),
  []);

  const inTransitCount = packagesData.filter(p => p.status.startsWith('in_transit')).length;
  const activeDrivers = driversData.filter(d => d.status !== 'offline');
  const selectedDriver = driversData.find(d => String(d.id) === driverId);

  useEffect(() => {
    if (isOpen) {
      setSelected([]);
      setDriverId('');
    }
  }, [isOpen]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelected(prev => prev.length === pendingPackages.length ? [] : pendingPackages.map(p => p.id));
  };

  const handleDispatch = () => {
    if (selected.length === 0 || !selectedDriver) return;
    // addToast({ type: 'success', message: `${selected.length} package${selected.length > 1 ? 's' : ''} dispatched to ${selectedDriver.name}` });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] border-l shadow-2xl z-50 flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accent.light }}>
            <Truck size={20} style={{ color: theme.accent.primary }} />
          </div>
          <div>
            <h2 className="font-semibold" style={{ color: theme.text.primary }}>Quick Dispatch</h2>
            <p className="text-xs" style={{ color: theme.text.muted }}>Assign packages to drivers</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}>
          <X size={18} />
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 p-4 border-b" style={{ borderColor: theme.border.primary }}>
        <div className="p-3 rounded-xl text-center" style={{ backgroundColor: theme.bg.tertiary }}>
          <p className="text-lg font-bold" style={{ color: theme.accent.primary }}>{pendingPackages.length}</p>
          <p className="text-xs" style={{ color: theme.text.muted }}>Pending</p>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ backgroundColor: theme.bg.tertiary }}>
          <p className="text-lg font-bold" style={{ color: '#7EA8C9' }}>{inTransitCount}</p>
          <p className="text-xs" style={{ color: theme.text.muted }}>In Transit</p>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ backgroundColor: theme.bg.tertiary }}>
          <p className="text-lg font-bold" style={{ color: '#81C995' }}>{activeDrivers.length}</p>
          <p className="text-xs" style={{ color: theme.text.muted }}>Active Drivers</p>
        </div>
      </div>

      {/* Package List */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: theme.border.primary }}>
          <div className="flex items-center gap-2">
            <Checkbox checked={selected.length === pendingPackages.length && pendingPackages.length > 0} onChange={toggleAll} theme={theme} />
            <span className="text-sm" style={{ color: theme.text.secondary }}>
              {selected.length > 0 ? `${selected.length} selected` : 'Select all'}
            </span>
          </div>
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary }}>
            {pendingPackages.length} packages
          </span>
        </div>

        {pendingPackages.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500" />
            <p className="font-medium" style={{ color: theme.text.primary }}>All caught up!</p>
            <p className="text-sm mt-1" style={{ color: theme.text.muted }}>No pending packages to dispatch</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: theme.border.primary }}>
            {pendingPackages.map(pkg => (
              <div
                key={pkg.id}
                onClick={() => toggleSelect(pkg.id)}
                className={`flex items-start gap-3 p-4 cursor-pointer transition-colors ${selected.includes(pkg.id) ? '' : 'hover:bg-white/5'}`}
                style={{ backgroundColor: selected.includes(pkg.id) ? theme.accent.light : 'transparent', borderColor: theme.border.primary }}
              >
                <div className="pt-0.5">
                  <Checkbox checked={selected.includes(pkg.id)} onChange={() => toggleSelect(pkg.id)} theme={theme} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium" style={{ color: theme.text.primary }}>{pkg.waybill}</span>
                    <DeliveryMethodBadge method={pkg.deliveryMethod} />
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: theme.text.secondary }}>{pkg.customer}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs" style={{ color: theme.text.muted }}>
                      <MapPin size={12} /> {pkg.destination}
                    </span>
                    <span className="text-xs" style={{ color: theme.text.muted }}>{pkg.size} • {pkg.weight}</span>
                  </div>
                </div>
                <StatusBadge status={pkg.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Driver & Dispatch */}
      <div className="border-t p-4 space-y-3" style={{ borderColor: theme.border.primary }}>
        <div>
          <label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Assign Driver</label>
          <select
            value={driverId}
            onChange={e => setDriverId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border text-sm"
            style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}
          >
            <option value="">Select driver</option>
            {activeDrivers.map(d => (
              <option key={d.id} value={d.id}>{d.name} — {d.zone} ({d.deliveriesToday} today)</option>
            ))}
          </select>
        </div>

        {selectedDriver && (
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold" style={{ backgroundColor: '#81C995', color: '#1C1917' }}>
              {selectedDriver.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{selectedDriver.name}</p>
              <p className="text-xs" style={{ color: theme.text.muted }}>{selectedDriver.vehicle}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: '#D4AA5A' }}>★ {selectedDriver.rating}</p>
              <p className="text-xs" style={{ color: theme.text.muted }}>{selectedDriver.zone}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleDispatch}
            disabled={selected.length === 0 || !driverId}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium ${selected.length === 0 || !driverId ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}
          >
            <Send size={16} /> Dispatch {selected.length > 0 ? `${selected.length} Package${selected.length > 1 ? 's' : ''}` : ''}
          </button>
          <button
            onClick={() => {
              onViewFull();
              onClose();
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
          >
            <Eye size={16} /> Full View
          </button>
        </div>
      </div>
    </div>
  );
};
