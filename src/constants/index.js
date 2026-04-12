import { Warehouse, Inbox, Home, LayoutDashboard, Package, Users, Users2, Truck, MessageSquare, AlertOctagon, Grid3X3, Building2, UserCheck, Briefcase, Smartphone, DollarSign, Receipt, TrendingUp, History, GitBranch, Handshake, Wallet, UserPlus, Cloud, Activity } from 'lucide-react';

// Re-export shared constants
export { DOOR_SIZES, WAYBILL_API_STATUSES, COURIER_STATUSES, PACKAGE_STATUSES, ALL_STATUSES } from '../shared/constants/index.js';
export { ROLES, resolveRole, hasPermission } from '../shared/constants/index.js';
export { PRESET_COLORS, LOCQAR_BRAND } from '../shared/constants/index.js';
export { SUBSCRIPTION_PLANS } from '../shared/constants/index.js';
export { DELIVERY_METHODS as DELIVERY_METHODS_DATA } from '../shared/constants/index.js';

// ============ DELIVERY METHODS (with icons, Admin-Portal-specific) ============
export const DELIVERY_METHODS = {
  warehouse_to_locker: {
    id: 'warehouse_to_locker',
    label: 'Warehouse \u2192 Locker',
    icon: Warehouse,
    color: '#7EA8C9'
  },
  dropbox_to_locker: {
    id: 'dropbox_to_locker',
    label: 'Dropbox \u2192 Locker',
    icon: Inbox,
    color: '#B5A0D1'
  },
  locker_to_home: {
    id: 'locker_to_home',
    label: 'Locker \u2192 Home',
    icon: Home,
    color: '#81C995'
  },
};

// ============ KEYBOARD SHORTCUTS ============
export const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], action: 'search', label: 'Global Search' },
  { keys: ['Ctrl', 'S'], action: 'scan', label: 'Scan Package' },
  { keys: ['Ctrl', 'N'], action: 'newPackage', label: 'New Package' },
  { keys: ['Ctrl', 'D'], action: 'dispatch', label: 'Dispatch' },
  { keys: ['Esc'], action: 'close', label: 'Close Modal' },
];

// ============ MENU STRUCTURE ============
export const MENU_GROUPS = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', permission: 'dashboard.view' },
      { icon: Cloud, label: 'Cloud Config', id: 'cloudconfig', permission: 'reports.view' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { icon: Package, label: 'Packages', id: 'packages', permission: 'packages.view', subItems: ['All Packages', 'In Locker', 'Pending Pickup', 'Expired'] },
      { icon: Activity, label: 'Activity', id: 'activity', permission: 'lockers.view' },
      { icon: Truck, label: 'Dispatch', id: 'dispatch', permission: 'packages.dispatch', subItems: ['Outgoing', 'Route Planning', 'Driver Assignment'] },
      { icon: MessageSquare, label: 'Notifications', id: 'notifications', permission: 'packages.view', subItems: ['Message Center', 'Templates', 'Auto-Rules', 'History', 'Settings'] },
      { icon: Truck, label: 'Fleet', id: 'fleet', permission: 'terminals.view' },
      { icon: AlertOctagon, label: 'SLA Monitor', id: 'sla', permission: 'packages.view', subItems: ['Live Monitor', 'Escalation Rules', 'Compliance', 'Incident Log'] },
      { icon: GitBranch, label: 'Workflows', id: 'workflows', permission: 'dashboard.view' },
    ]
  },
  {
    label: 'Management',
    items: [
      { icon: Grid3X3, label: 'Lockers', id: 'lockers', permission: 'lockers.view', subItems: ['Terminals', 'Maintenance', 'Configuration'] },
      { icon: Inbox, label: 'Dropboxes', id: 'dropboxes', permission: 'packages.view', subItems: ['Overview', 'Collections', 'Agents', 'Package Flow'] },
      { icon: Users, label: 'Customers', id: 'customers', permission: 'customers.view', subItems: ['All Customers', 'Subscribers', 'B2B Partners', 'Support Tickets'] },
      { icon: UserCheck, label: 'Staff', id: 'staff', permission: 'staff.view', subItems: ['Agents', 'Teams', 'Performance'] },
      { icon: Users2, label: 'Couriers', id: 'couriers', permission: 'staff.view' },
    ]
  },
];
