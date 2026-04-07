import React from 'react';
import { Shield } from 'lucide-react';
import { ALL_STATUSES, DELIVERY_METHODS, ROLES } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';

// Statuses that should show a live animated pulse dot
const LIVE_STATUSES = new Set(['active', 'online', 'on_delivery', 'in_progress', 'in_transit_to_locker', 'in_transit_to_home']);

export const StatusBadge = ({ status }) => {
  const { theme } = useTheme();
  const isLight = theme.name === 'light';
  const config = ALL_STATUSES[status] || { label: status, color: '#78716C', bg: 'rgba(107, 114, 128, 0.1)' };
  const isLive = LIVE_STATUSES.has(status);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap"
      style={{
        backgroundColor: isLight ? `${config.color}20` : config.bg,
        color: config.color,
        border: `1px solid ${config.color}${isLight ? '40' : '30'}`,
      }}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${isLive ? 'pulse-dot' : ''}`}
        style={{ backgroundColor: config.color }}
      />
      {config.label}
    </span>
  );
};


export const DeliveryMethodBadge = ({ method }) => {
  const { theme } = useTheme();
  const isLight = theme.name === 'light';
  const config = DELIVERY_METHODS[method] || DELIVERY_METHODS.warehouse_to_locker;
  const Icon = config.icon;
  return (
    <div
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md"
      style={{
        backgroundColor: `${config.color}${isLight ? '18' : '12'}`,
        border: `1px solid ${config.color}${isLight ? '35' : '25'}`,
      }}
    >
      <Icon size={12} style={{ color: config.color }} />
      <span className="text-xs font-medium" style={{ color: config.color }}>
        {config.label}
      </span>
    </div>
  );
};

export const RoleBadge = ({ role, customRoles = [] }) => {
  const { theme } = useTheme();
  const isLight = theme.name === 'light';
  let r = ROLES[role];
  if (!r) r = customRoles.find(cr => cr.key === role);
  if (!r) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{
        backgroundColor: `${r.color}${isLight ? '20' : '18'}`,
        color: r.color,
        border: `1px solid ${r.color}${isLight ? '40' : '30'}`,
      }}
    >
      <Shield size={10} />
      {r.name}
    </span>
  );
};
