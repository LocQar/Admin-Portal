import React, { useState, useEffect } from 'react';
import { UserCheck, X, Package, User, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { StatusBadge } from '../ui/Badge';
import { couriersData } from '../../constants/mockData';

export const AssignCourierModal = ({ isOpen, onClose, pkg, packages, onAssign, addToast }) => {
  const { theme } = useTheme();
  const [selectedCourier, setSelectedCourier] = useState(null);

  useEffect(() => {
    if (isOpen && pkg) {
      setSelectedCourier(pkg.courier ? pkg.courier.id : null);
    }
  }, [isOpen, pkg]);

  if (!isOpen || !pkg) return null;

  const activeCouriers = couriersData.filter(c => c.status === 1);

  const getAssignedCount = (courierId) =>
    (packages || []).filter(p => p.courier?.id === courierId).length;

  const handleSubmit = () => {
    if (!selectedCourier && !pkg.courier) {
      addToast({ type: 'warning', message: 'Please select a courier to assign' });
      return;
    }
    const courier = selectedCourier
      ? couriersData.find(c => c.id === selectedCourier) || null
      : null;
    onAssign(pkg, courier ? { id: courier.id, name: courier.name } : null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-md rounded-2xl border p-6"
        style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: theme.text.primary }}>
            <UserCheck size={20} style={{ color: theme.accent.primary }} />
            Assign Courier
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.icon.muted }}>
            <X size={18} />
          </button>
        </div>

        {/* Package Info */}
        <div
          className="p-3 rounded-xl border mb-5 flex items-center gap-3"
          style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}
        >
          <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accent.light }}>
            <Package size={18} style={{ color: theme.accent.primary }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm font-medium" style={{ color: theme.accent.primary }}>{pkg.waybill}</p>
            <p className="text-xs truncate" style={{ color: theme.text.muted }}>{pkg.customer} · {pkg.destination} · {pkg.size}</p>
          </div>
          <StatusBadge status={pkg.status} />
        </div>

        {/* Current assignment notice */}
        {pkg.courier && (
          <div
            className="p-3 rounded-xl border mb-4 flex items-center gap-2"
            style={{ backgroundColor: `${theme.accent.primary}10`, borderColor: `${theme.accent.primary}30` }}
          >
            <CheckCircle size={15} style={{ color: theme.accent.primary }} />
            <p className="text-sm" style={{ color: theme.text.secondary }}>
              Currently assigned to <span className="font-medium" style={{ color: theme.text.primary }}>{pkg.courier.name}</span>
            </p>
          </div>
        )}

        {/* Courier List */}
        <div className="space-y-2 mb-6">
          <p className="text-sm mb-3" style={{ color: theme.text.muted }}>Select courier to assign:</p>

          {/* Unassign option */}
          <button
            onClick={() => setSelectedCourier(null)}
            className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
            style={{
              backgroundColor: selectedCourier === null ? `${theme.accent.primary}10` : theme.bg.tertiary,
              borderColor: selectedCourier === null ? `${theme.accent.primary}40` : theme.border.primary,
            }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: theme.bg.hover }}
            >
              <User size={16} style={{ color: theme.text.muted }} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: theme.text.secondary }}>Unassigned</p>
              <p className="text-xs" style={{ color: theme.text.muted }}>Remove courier assignment</p>
            </div>
            {selectedCourier === null && (
              <CheckCircle size={16} style={{ color: theme.accent.primary }} />
            )}
          </button>

          {activeCouriers.map(courier => {
            const count = getAssignedCount(courier.id);
            const isSelected = selectedCourier === courier.id;
            return (
              <button
                key={courier.id}
                onClick={() => setSelectedCourier(courier.id)}
                className="w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all"
                style={{
                  backgroundColor: isSelected ? `${theme.accent.primary}10` : theme.bg.tertiary,
                  borderColor: isSelected ? `${theme.accent.primary}40` : theme.border.primary,
                }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                  style={{
                    backgroundColor: isSelected ? `${theme.accent.primary}20` : theme.bg.hover,
                    color: isSelected ? theme.accent.primary : theme.text.muted,
                  }}
                >
                  {courier.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{courier.name}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>
                    {courier.phone} · {count} package{count !== 1 ? 's' : ''} assigned
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle size={16} style={{ color: theme.accent.primary }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-sm"
            style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2"
            style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}
          >
            <UserCheck size={16} />
            {selectedCourier ? 'Assign Courier' : 'Unassign'}
          </button>
        </div>
      </div>
    </div>
  );
};
