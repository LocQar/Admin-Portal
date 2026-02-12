import { Warehouse, Inbox, Home, LayoutDashboard, Package, Users, Settings, Truck, MessageSquare, AlertOctagon, Grid3X3, Building2, UserCheck, Briefcase, Smartphone, DollarSign, Receipt, TrendingUp, History } from 'lucide-react';

// ============ ROLES & PERMISSIONS ============
export const ROLES = {
  SUPER_ADMIN: {
    id: 'super_admin',
    name: 'Super Admin',
    level: 100,
    color: '#FF6B58',
    permissions: ['*']
  },
  ADMIN: {
    id: 'admin',
    name: 'Administrator',
    level: 80,
    color: '#f59e0b',
    permissions: ['dashboard.*', 'packages.*', 'lockers.*', 'dropbox.*', 'terminals.*', 'customers.*', 'staff.*', 'reports.*', 'dispatch.*', 'accounting.*']
  },
  MANAGER: {
    id: 'manager',
    name: 'Branch Manager',
    level: 60,
    color: '#3b82f6',
    permissions: ['dashboard.view', 'packages.*', 'dropbox.*', 'lockers.*', 'terminals.view', 'customers.*', 'staff.view', 'reports.view', 'dispatch.*']
  },
  AGENT: {
    id: 'agent',
    name: 'Field Agent',
    level: 40,
    color: '#10b981',
    permissions: ['dashboard.view', 'packages.view', 'packages.scan', 'packages.receive', 'dropbox.view', 'dropbox.collect', 'lockers.view', 'lockers.open', 'dispatch.view']
  },
  SUPPORT: {
    id: 'support',
    name: 'Support',
    level: 30,
    color: '#8b5cf6',
    permissions: ['dashboard.view', 'packages.view', 'packages.track', 'customers.*', 'tickets.*']
  },
  VIEWER: {
    id: 'viewer',
    name: 'View Only',
    level: 10,
    color: '#6b7280',
    permissions: ['dashboard.view', 'packages.view', 'lockers.view']
  },
};

export const hasPermission = (userRole, permission) => {
  const role = ROLES[userRole];
  if (!role) return false;
  if (role.permissions.includes('*')) return true;
  if (role.permissions.includes(permission)) return true;
  const [module] = permission.split('.');
  return role.permissions.includes(`${module}.*`);
};

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
    color: '#3b82f6'
  },
  dropbox_to_locker: {
    id: 'dropbox_to_locker',
    label: 'Dropbox → Locker',
    icon: Inbox,
    color: '#8b5cf6'
  },
  locker_to_home: {
    id: 'locker_to_home',
    label: 'Locker → Home',
    icon: Home,
    color: '#10b981'
  },
};

// ============ PACKAGE STATUSES ============
export const PACKAGE_STATUSES = {
  pending: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  at_warehouse: { label: 'At Warehouse', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
  at_dropbox: { label: 'At Dropbox', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  in_transit_to_locker: { label: 'Transit → Locker', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  in_transit_to_home: { label: 'Transit → Home', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
  delivered_to_locker: { label: 'In Locker', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  delivered_to_home: { label: 'Delivered', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  picked_up: { label: 'Picked Up', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  expired: { label: 'Expired', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
};

export const ALL_STATUSES = {
  ...PACKAGE_STATUSES,
  available: { label: 'Available', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  occupied: { label: 'Occupied', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  reserved: { label: 'Reserved', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  maintenance: { label: 'Maintenance', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  active: { label: 'Active', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  inactive: { label: 'Inactive', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  offline: { label: 'Offline', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  online: { label: 'Online', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  on_delivery: { label: 'On Delivery', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  open: { label: 'Open', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  in_progress: { label: 'In Progress', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  completed: { label: 'Completed', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  paid: { label: 'Paid', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  overdue: { label: 'Overdue', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  full: { label: 'Full', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  individual: { label: 'Individual', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  b2b: { label: 'B2B Partner', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
  high: { label: 'High', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  medium: { label: 'Medium', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  low: { label: 'Low', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
  failed: { label: 'Failed', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
  refunded: { label: 'Refunded', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
  suspended: { label: 'Suspended', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
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
    color: '#6b7280',
    description: '5 deliveries/mo, standard lockers'
  },
  {
    id: 'PLAN-STD',
    name: 'Standard',
    price: 45,
    period: 'month',
    deliveries: 15,
    lockerAccess: 'standard',
    color: '#3b82f6',
    description: '15 deliveries/mo, standard lockers'
  },
  {
    id: 'PLAN-PREM',
    name: 'Premium',
    price: 75,
    period: 'month',
    deliveries: 40,
    lockerAccess: 'priority',
    color: '#8b5cf6',
    description: '40 deliveries/mo, priority lockers'
  },
  {
    id: 'PLAN-UNLIM',
    name: 'Unlimited',
    price: 120,
    period: 'month',
    deliveries: -1,
    lockerAccess: 'priority',
    color: '#f59e0b',
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
