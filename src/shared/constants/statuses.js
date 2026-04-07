// ============ WINNSEN API CONSTANTS ============
export const WAYBILL_API_STATUSES = {
  11: { code: 11, label: 'Courier Dropped Off', phase: 'dropoff' },
  12: { code: 12, label: 'User Dropped Off', phase: 'dropoff' },
  13: { code: 13, label: 'In Locker', phase: 'stored' },
  20: { code: 20, label: 'Picked Up (Normal)', phase: 'pickup' },
  21: { code: 21, label: 'Picked Up (Overtime)', phase: 'pickup' },
  22: { code: 22, label: 'Courier Picked Up', phase: 'pickup' },
  30: { code: 30, label: 'Expired - Returned', phase: 'expired' },
  31: { code: 31, label: 'Expired - Courier Retrieved', phase: 'expired' },
  32: { code: 32, label: 'Expired - Admin Retrieved', phase: 'expired' },
  99: { code: 99, label: 'Cancelled', phase: 'cancelled' },
};

export const COURIER_STATUSES = {
  1: { code: 1, label: 'Active', color: '#10B981' },
  0: { code: 0, label: 'Disabled', color: '#94A3B8' },
};

// ============ PACKAGE STATUSES ============
export const PACKAGE_STATUSES = {
  pending:               { label: 'Pending',          color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  at_warehouse:          { label: 'At Warehouse',      color: '#6366F1', bg: 'rgba(99,102,241,0.10)' },
  at_dropbox:            { label: 'At Dropbox',        color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)' },
  assigned:              { label: 'Assigned',          color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  accepted:              { label: 'Accepted',          color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
  in_transit_to_locker:  { label: 'Transit → Locker',  color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
  in_transit_to_home:    { label: 'Transit → Home',    color: '#06B6D4', bg: 'rgba(6,182,212,0.10)' },
  delivered_to_locker:   { label: 'In Locker',         color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
  delivered_to_home:     { label: 'Delivered',         color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
  picked_up:             { label: 'Picked Up',         color: '#64748B', bg: 'rgba(100,116,139,0.10)' },
  recalled:              { label: 'Recalled',          color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
  expired:               { label: 'Expired',           color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
};

export const ALL_STATUSES = {
  ...PACKAGE_STATUSES,
  available:     { label: 'Available',    color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
  occupied:      { label: 'Occupied',     color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
  reserved:      { label: 'Reserved',     color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  maintenance:   { label: 'Maintenance',  color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
  active:        { label: 'Active',       color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
  inactive:      { label: 'Inactive',     color: '#94A3B8', bg: 'rgba(148,163,184,0.10)' },
  offline:       { label: 'Offline',      color: '#94A3B8', bg: 'rgba(148,163,184,0.10)' },
  online:        { label: 'Online',       color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
  on_delivery:   { label: 'On Delivery',  color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
  open:          { label: 'Open',         color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
  in_progress:   { label: 'In Progress',  color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  completed:     { label: 'Completed',    color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
  paid:          { label: 'Paid',         color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
  overdue:       { label: 'Overdue',      color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
  full:          { label: 'Full',         color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  individual:    { label: 'Individual',   color: '#3B82F6', bg: 'rgba(59,130,246,0.10)' },
  b2b:           { label: 'B2B Partner',  color: '#8B5CF6', bg: 'rgba(139,92,246,0.10)' },
  high:          { label: 'High',         color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
  medium:        { label: 'Medium',       color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  low:           { label: 'Low',          color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
  failed:        { label: 'Failed',       color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
  refunded:      { label: 'Refunded',     color: '#94A3B8', bg: 'rgba(148,163,184,0.10)' },
  suspended:     { label: 'Suspended',    color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  connected:     { label: 'Connected',    color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
  disconnected:  { label: 'Disconnected', color: '#EF4444', bg: 'rgba(239,68,68,0.10)' },
  enabled:       { label: 'Enabled',      color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
  disabled:      { label: 'Disabled',     color: '#94A3B8', bg: 'rgba(148,163,184,0.10)' },
  door_open:     { label: 'Open',         color: '#D97706', bg: 'rgba(217,119,6,0.10)' },
  door_closed:   { label: 'Closed',       color: '#10B981', bg: 'rgba(16,185,129,0.10)' },
};
