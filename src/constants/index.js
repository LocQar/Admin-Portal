import { Warehouse, Inbox, Home, LayoutDashboard, Package, Users, Users2, Truck, MessageSquare, AlertOctagon, Grid3X3, Building2, UserCheck, Briefcase, Smartphone, DollarSign, Receipt, TrendingUp, History, GitBranch, Handshake, Wallet, UserPlus } from 'lucide-react';

// Re-export shared constants (inlined from @locqar/shared)
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
      { icon: GitBranch, label: 'Workflows', id: 'workflows', permission: 'dashboard.view' },
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
      { icon: Users2, label: 'Couriers', id: 'couriers', permission: 'staff.view' },
      { icon: UserPlus, label: 'HRIS', id: 'hris', permission: 'staff.view', subItems: ['Onboarding', 'Offboarding', 'Alumni'] },
    ]
  },
  {
    label: 'Business',
    items: [
      { icon: Briefcase, label: 'Business Portal', id: 'portal', permission: 'reports.view', subItems: ['Partner Dashboard', 'Bulk Shipments', 'Invoices & Billing', 'API Management', 'Partner Analytics'] },
      { icon: Smartphone, label: 'Partner Portal', id: 'selfservice', permission: 'dashboard.view', subItems: ['Portal Home', 'Ship Now', 'Track Packages', 'Locker Map', 'My Billing', 'API Console', 'Help Center'] },
      { icon: DollarSign, label: 'Accounting', id: 'accounting', permission: 'reports.view', subItems: ['Transactions', 'Invoices', 'Reports'] },
      { icon: Wallet, label: 'Payroll', id: 'payroll', permission: 'accounting.*', subItems: ['Overview', 'Payslips', 'Pay Periods'] },
      { icon: Receipt, label: 'Pricing Engine', id: 'pricing', permission: 'reports.view', subItems: ['Rate Card', 'Delivery Methods', 'SLA Tiers', 'Surcharges', 'Volume Discounts', 'Partner Overrides'] },
      { icon: Handshake, label: 'CRM', id: 'crm', permission: 'crm.view', subItems: ['Dashboard', 'Leads', 'Pipeline', 'Contacts', 'Activities', 'Reports'] },
      { icon: TrendingUp, label: 'Analytics', id: 'analytics', permission: 'reports.view' },
      { icon: History, label: 'Audit Log', id: 'audit', permission: 'reports.view' },
    ]
  },
];
