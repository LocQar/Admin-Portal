import { Warehouse, Inbox, Home, LayoutDashboard, Package, Users, Settings, Truck, MessageSquare, AlertOctagon, Grid3X3, Building2, UserCheck, Briefcase, Smartphone, DollarSign, Receipt, TrendingUp, History } from 'lucide-react';

// ============ ROLES & PERMISSIONS ============
export const ROLES = {
  SUPER_ADMIN: {
    id: 'super_admin',
    name: 'Super Admin',
    level: 100,
    color: '#7EA8C9',
    permissions: ['*']
  },
  ADMIN: {
    id: 'admin',
    name: 'Administrator',
    level: 80,
    color: '#D4AA5A',
    permissions: ['dashboard.*', 'packages.*', 'lockers.*', 'dropbox.*', 'terminals.*', 'customers.*', 'staff.*', 'reports.*', 'dispatch.*', 'accounting.*']
  },
  MANAGER: {
    id: 'manager',
    name: 'Branch Manager',
    level: 60,
    color: '#81C995',
    permissions: ['dashboard.view', 'packages.*', 'dropbox.*', 'lockers.*', 'terminals.view', 'customers.*', 'staff.view', 'reports.view', 'dispatch.*']
  },
  AGENT: {
    id: 'agent',
    name: 'Field Agent',
    level: 40,
    color: '#B5A0D1',
    permissions: ['dashboard.view', 'packages.view', 'packages.scan', 'packages.receive', 'dropbox.view', 'dropbox.collect', 'lockers.view', 'lockers.open', 'dispatch.view']
  },
  SUPPORT: {
    id: 'support',
    name: 'Support',
    level: 30,
    color: '#D48E8A',
    permissions: ['dashboard.view', 'packages.view', 'packages.track', 'customers.*', 'tickets.*']
  },
  VIEWER: {
    id: 'viewer',
    name: 'View Only',
    level: 10,
    color: '#A8A29E',
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

export const PRESET_COLORS = ['#D48E8A', '#D4AA5A', '#81C995', '#7EA8C9', '#B5A0D1', '#D4A0B9', '#7EC4B8', '#C49B6A', '#82BFD4', '#B8C972'];

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
    color: '#7EA8C9'
  },
  dropbox_to_locker: {
    id: 'dropbox_to_locker',
    label: 'Dropbox → Locker',
    icon: Inbox,
    color: '#B5A0D1'
  },
  locker_to_home: {
    id: 'locker_to_home',
    label: 'Locker → Home',
    icon: Home,
    color: '#81C995'
  },
};

// ============ PACKAGE STATUSES ============
export const PACKAGE_STATUSES = {
  pending: { label: 'Pending', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
  at_warehouse: { label: 'At Warehouse', color: '#B5A0D1', bg: 'rgba(181, 160, 209, 0.07)' },
  at_dropbox: { label: 'At Dropbox', color: '#B5A0D1', bg: 'rgba(181, 160, 209, 0.07)' },
  in_transit_to_locker: { label: 'Transit → Locker', color: '#7EA8C9', bg: 'rgba(126, 168, 201, 0.07)' },
  in_transit_to_home: { label: 'Transit → Home', color: '#7EA8C9', bg: 'rgba(126, 168, 201, 0.07)' },
  delivered_to_locker: { label: 'In Locker', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  delivered_to_home: { label: 'Delivered', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  picked_up: { label: 'Picked Up', color: '#A8A29E', bg: 'rgba(168, 162, 158, 0.07)' },
  expired: { label: 'Expired', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
};

export const ALL_STATUSES = {
  ...PACKAGE_STATUSES,
  available: { label: 'Available', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  occupied: { label: 'Occupied', color: '#7EA8C9', bg: 'rgba(126, 168, 201, 0.07)' },
  reserved: { label: 'Reserved', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
  maintenance: { label: 'Maintenance', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
  active: { label: 'Active', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  inactive: { label: 'Inactive', color: '#A8A29E', bg: 'rgba(168, 162, 158, 0.07)' },
  offline: { label: 'Offline', color: '#A8A29E', bg: 'rgba(168, 162, 158, 0.07)' },
  online: { label: 'Online', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  on_delivery: { label: 'On Delivery', color: '#7EA8C9', bg: 'rgba(126, 168, 201, 0.07)' },
  open: { label: 'Open', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
  in_progress: { label: 'In Progress', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
  completed: { label: 'Completed', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  paid: { label: 'Paid', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  overdue: { label: 'Overdue', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
  full: { label: 'Full', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
  individual: { label: 'Individual', color: '#7EA8C9', bg: 'rgba(126, 168, 201, 0.07)' },
  b2b: { label: 'B2B Partner', color: '#B5A0D1', bg: 'rgba(181, 160, 209, 0.07)' },
  high: { label: 'High', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
  medium: { label: 'Medium', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
  low: { label: 'Low', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  failed: { label: 'Failed', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
  refunded: { label: 'Refunded', color: '#A8A29E', bg: 'rgba(168, 162, 158, 0.07)' },
  suspended: { label: 'Suspended', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
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
    color: '#A8A29E',
    description: '5 deliveries/mo, standard lockers'
  },
  {
    id: 'PLAN-STD',
    name: 'Standard',
    price: 45,
    period: 'month',
    deliveries: 15,
    lockerAccess: 'standard',
    color: '#7EA8C9',
    description: '15 deliveries/mo, standard lockers'
  },
  {
    id: 'PLAN-PREM',
    name: 'Premium',
    price: 75,
    period: 'month',
    deliveries: 40,
    lockerAccess: 'priority',
    color: '#B5A0D1',
    description: '40 deliveries/mo, priority lockers'
  },
  {
    id: 'PLAN-UNLIM',
    name: 'Unlimited',
    price: 120,
    period: 'month',
    deliveries: -1,
    lockerAccess: 'priority',
    color: '#D4AA5A',
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
