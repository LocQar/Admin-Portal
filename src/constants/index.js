import { Warehouse, Inbox, Home, LayoutDashboard, Package, Users, Settings, Truck, MessageSquare, AlertOctagon, Grid3X3, Building2, UserCheck, Briefcase, Smartphone, DollarSign, Receipt, TrendingUp, History } from 'lucide-react';

// ============ ROLES & PERMISSIONS ============
export const ROLES = {
  SUPER_ADMIN: {
    id: 'super_admin',
    name: 'Super Admin',
    level: 100,
    color: '#6366F1',
    permissions: ['*']
  },
  ADMIN: {
    id: 'admin',
    name: 'Administrator',
    level: 80,
    color: '#FBBF24',
    permissions: ['dashboard.*', 'packages.*', 'lockers.*', 'dropbox.*', 'terminals.*', 'customers.*', 'staff.*', 'reports.*', 'dispatch.*', 'accounting.*']
  },
  MANAGER: {
    id: 'manager',
    name: 'Branch Manager',
    level: 60,
    color: '#60A5FA',
    permissions: ['dashboard.view', 'packages.*', 'dropbox.*', 'lockers.*', 'terminals.view', 'customers.*', 'staff.view', 'reports.view', 'dispatch.*']
  },
  AGENT: {
    id: 'agent',
    name: 'Field Agent',
    level: 40,
    color: '#4ADE80',
    permissions: ['dashboard.view', 'packages.view', 'packages.scan', 'packages.receive', 'dropbox.view', 'dropbox.collect', 'lockers.view', 'lockers.open', 'dispatch.view']
  },
  SUPPORT: {
    id: 'support',
    name: 'Support',
    level: 30,
    color: '#A78BFA',
    permissions: ['dashboard.view', 'packages.view', 'packages.track', 'customers.*', 'tickets.*']
  },
  VIEWER: {
    id: 'viewer',
    name: 'View Only',
    level: 10,
    color: '#9CA3AF',
    permissions: ['dashboard.view', 'packages.view', 'lockers.view']
  },
};

export const resolveRole = (userRole, customRoles = []) => {
  if (ROLES[userRole]) return ROLES[userRole];
  return customRoles.find(r => r.key === userRole) || null;
};

export const hasPermission = (userRole, permission, customRoles = []) => {
  const role = resolveRole(userRole, customRoles);
  if (!role) return false;
  if (role.permissions.includes('*')) return true;
  if (role.permissions.includes(permission)) return true;
  const [module] = permission.split('.');
  return role.permissions.includes(`${module}.*`);
};

export const PRESET_COLORS = ['#F87171', '#FBBF24', '#4ADE80', '#60A5FA', '#A78BFA', '#F9A8D4', '#5EEAD4', '#FB923C', '#22D3EE', '#BEF264'];

// ============ KEYBOARD SHORTCUTS ============
export const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], action: 'search', label: 'Global Search' },
  { keys: ['Ctrl', 'S'], action: 'scan', label: 'Scan Package' },
  { keys: ['Ctrl', 'N'], action: 'newPackage', label: 'New Package' },
  { keys: ['Ctrl', 'D'], action: 'dispatch', label: 'Dispatch' },
  { keys: ['Esc'], action: 'close', label: 'Close Modal' },
];

// ============ DELIVERY METHODS ============
export const DELIVERY_METHODS = {
  warehouse_to_locker: {
    id: 'warehouse_to_locker',
    label: 'Warehouse → Locker',
    icon: Warehouse,
    color: '#60A5FA'
  },
  dropbox_to_locker: {
    id: 'dropbox_to_locker',
    label: 'Dropbox → Locker',
    icon: Inbox,
    color: '#A78BFA'
  },
  locker_to_home: {
    id: 'locker_to_home',
    label: 'Locker → Home',
    icon: Home,
    color: '#4ADE80'
  },
};

// ============ PACKAGE STATUSES ============
export const PACKAGE_STATUSES = {
  pending: { label: 'Pending', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.07)' },
  at_warehouse: { label: 'At Warehouse', color: '#818CF8', bg: 'rgba(129, 140, 248, 0.07)' },
  at_dropbox: { label: 'At Dropbox', color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.07)' },
  in_transit_to_locker: { label: 'Transit → Locker', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.07)' },
  in_transit_to_home: { label: 'Transit → Home', color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.07)' },
  delivered_to_locker: { label: 'In Locker', color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.07)' },
  delivered_to_home: { label: 'Delivered', color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.07)' },
  picked_up: { label: 'Picked Up', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.07)' },
  expired: { label: 'Expired', color: '#F87171', bg: 'rgba(248, 113, 113, 0.07)' },
};

export const ALL_STATUSES = {
  ...PACKAGE_STATUSES,
  available: { label: 'Available', color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.07)' },
  occupied: { label: 'Occupied', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.07)' },
  reserved: { label: 'Reserved', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.07)' },
  maintenance: { label: 'Maintenance', color: '#F87171', bg: 'rgba(248, 113, 113, 0.07)' },
  active: { label: 'Active', color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.07)' },
  inactive: { label: 'Inactive', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.07)' },
  offline: { label: 'Offline', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.07)' },
  online: { label: 'Online', color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.07)' },
  on_delivery: { label: 'On Delivery', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.07)' },
  open: { label: 'Open', color: '#F87171', bg: 'rgba(248, 113, 113, 0.07)' },
  in_progress: { label: 'In Progress', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.07)' },
  completed: { label: 'Completed', color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.07)' },
  paid: { label: 'Paid', color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.07)' },
  overdue: { label: 'Overdue', color: '#F87171', bg: 'rgba(248, 113, 113, 0.07)' },
  full: { label: 'Full', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.07)' },
  individual: { label: 'Individual', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.07)' },
  b2b: { label: 'B2B Partner', color: '#A78BFA', bg: 'rgba(167, 139, 250, 0.07)' },
  high: { label: 'High', color: '#F87171', bg: 'rgba(248, 113, 113, 0.07)' },
  medium: { label: 'Medium', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.07)' },
  low: { label: 'Low', color: '#4ADE80', bg: 'rgba(74, 222, 128, 0.07)' },
  failed: { label: 'Failed', color: '#F87171', bg: 'rgba(248, 113, 113, 0.07)' },
  refunded: { label: 'Refunded', color: '#9CA3AF', bg: 'rgba(156, 163, 175, 0.07)' },
  suspended: { label: 'Suspended', color: '#FBBF24', bg: 'rgba(251, 191, 36, 0.07)' },
};

// ============ SUBSCRIPTION PLANS ============
export const SUBSCRIPTION_PLANS = [
  {
    id: 'PLAN-BASIC',
    name: 'Basic',
    price: 25,
    period: 'month',
    deliveries: 5,
    lockerAccess: 'standard',
    color: '#9CA3AF',
    description: '5 deliveries/mo, standard lockers'
  },
  {
    id: 'PLAN-STD',
    name: 'Standard',
    price: 45,
    period: 'month',
    deliveries: 15,
    lockerAccess: 'standard',
    color: '#60A5FA',
    description: '15 deliveries/mo, standard lockers'
  },
  {
    id: 'PLAN-PREM',
    name: 'Premium',
    price: 75,
    period: 'month',
    deliveries: 40,
    lockerAccess: 'priority',
    color: '#A78BFA',
    description: '40 deliveries/mo, priority lockers'
  },
  {
    id: 'PLAN-UNLIM',
    name: 'Unlimited',
    price: 120,
    period: 'month',
    deliveries: -1,
    lockerAccess: 'priority',
    color: '#FBBF24',
    description: 'Unlimited deliveries, priority lockers'
  },
];

// ============ MENU STRUCTURE ============
export const MENU_GROUPS = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', permission: 'dashboard.view' }
    ]
  },
  {
    label: 'Operations',
    items: [
      { icon: Package, label: 'Packages', id: 'packages', permission: 'packages.view', subItems: ['All Packages', 'In Locker', 'Pending Pickup', 'Expired'] },
      { icon: Truck, label: 'Dispatch', id: 'dispatch', permission: 'packages.dispatch', subItems: ['Outgoing', 'Route Planning', 'Driver Assignment'] },
      { icon: MessageSquare, label: 'Notifications', id: 'notifications', permission: 'packages.view', subItems: ['Message Center', 'Templates', 'Auto-Rules', 'History', 'Settings'] },
      { icon: Truck, label: 'Fleet', id: 'fleet', permission: 'terminals.view' },
      { icon: AlertOctagon, label: 'SLA Monitor', id: 'sla', permission: 'packages.view', subItems: ['Live Monitor', 'Escalation Rules', 'Compliance', 'Incident Log'] },
    ]
  },
  {
    label: 'Management',
    items: [
      { icon: Grid3X3, label: 'Lockers', id: 'lockers', permission: 'lockers.view', subItems: ['All Lockers', 'Maintenance', 'Configuration'] },
      { icon: Inbox, label: 'Dropboxes', id: 'dropboxes', permission: 'packages.view', subItems: ['Overview', 'Collections', 'Agents', 'Package Flow'] },
      { icon: Building2, label: 'Terminals', id: 'terminals', permission: 'terminals.view' },
      { icon: Users, label: 'Customers', id: 'customers', permission: 'customers.view', subItems: ['All Customers', 'Subscribers', 'B2B Partners', 'Support Tickets'] },
      { icon: UserCheck, label: 'Staff', id: 'staff', permission: 'staff.view', subItems: ['Agents', 'Teams', 'Performance'] },
    ]
  },
  {
    label: 'Business',
    items: [
      { icon: Briefcase, label: 'Business Portal', id: 'portal', permission: 'reports.view', subItems: ['Partner Dashboard', 'Bulk Shipments', 'Invoices & Billing', 'API Management', 'Partner Analytics'] },
      { icon: Smartphone, label: 'Partner Portal', id: 'selfservice', permission: 'dashboard.view', subItems: ['Portal Home', 'Ship Now', 'Track Packages', 'Locker Map', 'My Billing', 'API Console', 'Help Center'] },
      { icon: DollarSign, label: 'Accounting', id: 'accounting', permission: 'reports.view', subItems: ['Transactions', 'Invoices', 'Reports'] },
      { icon: Receipt, label: 'Pricing Engine', id: 'pricing', permission: 'reports.view', subItems: ['Rate Card', 'Delivery Methods', 'SLA Tiers', 'Surcharges', 'Volume Discounts', 'Partner Overrides'] },
      { icon: TrendingUp, label: 'Analytics', id: 'analytics', permission: 'reports.view' },
      { icon: History, label: 'Audit Log', id: 'audit', permission: 'reports.view' },
    ]
  },
];
