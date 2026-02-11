import React from 'react';
import { Shield } from 'lucide-react';
import { ALL_STATUSES, DELIVERY_METHODS, ROLES } from '../../constants';

export const StatusBadge = ({ status }) => {
  const config = ALL_STATUSES[status] || { label: status, color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' };
  return (
    <span
      className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
      style={{ backgroundColor: config.bg, color: config.color }}
    >
      {config.label}
    </span>
  );
};

export const DeliveryMethodBadge = ({ method }) => {
  const config = DELIVERY_METHODS[method] || DELIVERY_METHODS.warehouse_to_locker;
  const Icon = config.icon;
  return (
    <div className="flex items-center gap-1.5">
      <Icon size={14} style={{ color: config.color }} />
      <span className="text-xs font-medium" style={{ color: config.color }}>
        {config.label}
      </span>
    </div>
  );
};

export const RoleBadge = ({ role }) => {
  const r = ROLES[role];
  if (!r) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${r.color}15`, color: r.color }}
    >
      <Shield size={10} />
      {r.name}
    </span>
  );
};
