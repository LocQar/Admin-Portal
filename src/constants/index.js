import { Warehouse, Inbox, Home, LayoutDashboard, Package, Users, Truck, Bell, AlertTriangle, Grid3X3, Building2, UserCheck, Briefcase, Smartphone, DollarSign, Receipt, TrendingUp, History, GitBranch, Handshake, Wallet, UserPlus, Cloud, Activity, Send, MapPin, Shield, BoxSelect } from 'lucide-react';

// Re-export shared constants
export { DOOR_SIZES, WAYBILL_API_STATUSES, COURIER_STATUSES, PACKAGE_STATUSES, ALL_STATUSES } from '../shared/constants/index.js';
export { ROLES, resolveRole, hasPermission } from '../shared/constants/index.js';
export { PRESET_COLORS, LOCQAR_BRAND } from '../shared/constants/index.js';
export { SUBSCRIPTION_PLANS } from '../shared/constants/index.js';
export { DELIVERY_METHODS as DELIVERY_METHODS_DATA } from '../shared/constants/index.js';

// ============ CURRENCY ============
const CURRENCY_KEY = 'locqar.currency';

export const CURRENCIES = {
  GHS: { code: 'GHS', symbol: 'GH₵', name: 'Ghanaian Cedi' },
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  NGN: { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  KES: { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  XOF: { code: 'XOF', symbol: 'CFA', name: 'West African CFA' },
};

export const getCurrency = () => {
  const saved = localStorage.getItem(CURRENCY_KEY);
  return CURRENCIES[saved] || CURRENCIES.GHS;
};

export const setCurrency = (code) => {
  localStorage.setItem(CURRENCY_KEY, code);
};

/** Format a number as currency, e.g. "GH₵ 1,250.00" */
export const formatMoney = (amount, opts = {}) => {
  const cur = getCurrency();
  const num = Number(amount) || 0;
  const decimals = opts.decimals ?? (num % 1 === 0 ? 0 : 2);
  return `${cur.symbol} ${num.toLocaleString('en', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
};

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
      { icon: Package, label: 'Packages', id: 'packages', permission: 'packages.view' },
      { icon: Activity, label: 'Activity', id: 'activity', permission: 'lockers.view' },
      { icon: Send, label: 'Dispatch', id: 'dispatch', permission: 'packages.dispatch' },
      { icon: Bell, label: 'Notifications', id: 'notifications', permission: 'packages.view' },
      { icon: Truck, label: 'Fleet', id: 'fleet', permission: 'terminals.view' },
      { icon: Shield, label: 'SLA Monitor', id: 'sla', permission: 'packages.view' },
      { icon: GitBranch, label: 'Workflows', id: 'workflows', permission: 'dashboard.view' },
    ]
  },
  {
    label: 'Management',
    items: [
      { icon: Grid3X3, label: 'Lockers', id: 'lockers', permission: 'lockers.view' },
      { icon: BoxSelect, label: 'Dropboxes', id: 'dropboxes', permission: 'packages.view' },
      { icon: Users, label: 'Customers', id: 'customers', permission: 'customers.view' },
      { icon: UserCheck, label: 'Staff', id: 'staff', permission: 'staff.view' },
      { icon: Briefcase, label: 'Couriers', id: 'couriers', permission: 'staff.view' },
    ]
  },
];
