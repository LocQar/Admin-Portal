import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import LockersListPage from '@/features/lockers/pages/LockersListPage';
import ActivityFeedPage from '@/features/activity/pages/ActivityFeedPage';
import { useAuthStore } from '@/features/auth/stores/authStore';
import { useLogout } from '@/features/auth/hooks/useAuth';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard, Package, Users, Settings, ChevronDown, ChevronRight, Search, Truck, MapPin, DollarSign, Box, Bell, Plus, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertTriangle, Filter, Download, Eye, Edit, Trash2, RefreshCw, TrendingUp, Calendar, ChevronLeft, X, QrCode, Building2, UserCheck, PackageX, Timer, Grid3X3, Sun, Moon, Shield, Key, Lock, Unlock, UserPlus, Phone, MessageSquare, Send, Printer, Banknote, Battery, BatteryWarning, Thermometer, Scan, Home, Warehouse, Circle, CheckCircle, Inbox, Route, Car, Wrench, Cog, Briefcase, Users2, Award, Ticket, Receipt, CreditCard, FileText, Command, Keyboard, Check, Info, AlertOctagon, XCircle, ChevronFirst, ChevronLast, MoreHorizontal, FileDown, Loader2, Menu, Smartphone, LogOut, History, Mail, Wallet } from 'lucide-react';

// ============ PAGE COMPONENTS ============
import {
  DashboardPage,
  AuditLogPage,
  SettingsPage,
  PackagesPage,
  AnalyticsPage,
  DropboxesPage,
  DispatchPage,
  TerminalsPage,
  LockersPage,
  StaffPage,
  AccountingPage,
  BusinessPortalPage,
  PartnerPortalPage,
  NotificationsPage,
  SLAMonitorPage,
  CustomersPage,
  PricingEnginePage,
  FleetPage,
  CouriersPage,
  WorkflowsPage,
  CRMPage,
  PayrollPage,
  HRISPage,
  LoginPage,
  CustomerPortalPage,
  CloudConfigPage,
} from './pages';

// ============ MODAL COMPONENTS ============
import {
  GlobalSearchModal,
  ShortcutsModal,
  SessionTimeoutModal,
  ExportModal,
  ReassignModal,
  ReturnModal,
  ScanModal,
  AssignCourierModal,
} from './components/modals';

// ============ LAYOUT COMPONENTS ============
import { Sidebar } from './components/layout/Sidebar';

// ============ DRAWER COMPONENTS ============
import {
  NewPackageDrawer,
  DispatchDrawer,
  PackageDetailDrawer,
} from './components/drawers';

// ============ UI COMPONENTS ============
import {
  StatusBadge,
  DeliveryMethodBadge,
  Checkbox,
  Skeleton,
  TableSkeleton,
  EmptyState,
  Pagination,
  Toast,
  ToastContainer,
  PackageStatusFlow,
  MetricCard,
  QuickAction,
  RoleBadge,
  BulkActionsBar,
  Breadcrumb,
  ConfirmDialog,
} from './components/ui';

// ============ MOCK DATA ============
import {
  notifications,
  pricingRevenueData,
  apiKeysData,
  bulkShipmentsData,
  dropboxAgentsData,
  dropboxFlowData,
  DROPBOX_FLOW_STAGES,
  dropboxFillHistory,
  portalShipmentsData,
  portalInvoicesData,
  portalWebhookLogsData,
  portalRateCard,
  portalShipmentTrend,
  portalTerminalAvailability,
  staffData,
  teamsData,
  // Additional mock data required by the legacy shell (re-exported from mockDataPart2)
  driversData,
  customersData,
  subscribersData,
  transactionsData,
  invoicesData,
  ticketsData,
  collectionsData,
  smsTemplatesData,
  notificationHistoryData,
  autoRulesData,
} from './constants/mockData';

// The Locqar-master App.jsx referenced these symbols without ever importing
// or defining them. Stubbed here so the legacy shell can mount. Real data will
// come from the NestJS dashboard-api in Phase 5 — tracked in
// C:\Users\smile\.claude\plans\sleepy-hugging-ember.md.
const slaBreachData = [];
const escalationLog = [];
const SLA_SEVERITY = {};
const SLA_TIERS = [];
const ESCALATION_RULES = [];
const SUBSCRIPTION_PLANS = [];
// Fallback seed data when /packages and /lockers endpoints are unreachable.
// Empty arrays are safe: the legacy shell also re-fetches on mount.
const INITIAL_PACKAGES = [];
const INITIAL_LOCKERS = [];

// ============ CONTEXT ============
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { api } from './utils/api';
const ToastContext = createContext();


// ============ ROLES & PERMISSIONS ============

const ROLES = {
  SUPER_ADMIN: { id: 'super_admin', name: 'Super Admin', level: 100, color: '#7EA8C9', permissions: ['*'] },
  ADMIN: { id: 'admin', name: 'Administrator', level: 80, color: '#D4AA5A', permissions: ['dashboard.*', 'packages.*', 'lockers.*', 'dropbox.*', 'terminals.*', 'customers.*', 'staff.*', 'reports.*', 'dispatch.*', 'accounting.*', 'crm.*'] },
  MANAGER: { id: 'manager', name: 'Branch Manager', level: 60, color: '#81C995', permissions: ['dashboard.view', 'packages.*', 'dropbox.*', 'lockers.*', 'terminals.view', 'customers.*', 'staff.view', 'reports.view', 'dispatch.*', 'crm.view'] },
  AGENT: { id: 'agent', name: 'Field Agent', level: 40, color: '#B5A0D1', permissions: ['dashboard.view', 'packages.view', 'packages.scan', 'packages.receive', 'dropbox.view', 'dropbox.collect', 'lockers.view', 'lockers.open', 'dispatch.view'] },
  SUPPORT: { id: 'support', name: 'Support', level: 30, color: '#D48E8A', permissions: ['dashboard.view', 'packages.view', 'packages.track', 'customers.*', 'tickets.*'] },
  VIEWER: { id: 'viewer', name: 'View Only', level: 10, color: '#A8A29E', permissions: ['dashboard.view', 'packages.view', 'lockers.view'] },
  CUSTOMER: { id: 'customer', name: 'Customer', level: 5, color: '#D4AA5A', permissions: ['packages.view.own', 'subscription.view', 'profile.manage'] },
};

const resolveRole = (userRole, customRoles = []) => {
  if (ROLES[userRole]) return ROLES[userRole];
  return customRoles.find(r => r.key === userRole) || null;
};

const hasPermission = (userRole, permission, customRoles = []) => {
  const role = resolveRole(userRole, customRoles);
  if (!role) return false;
  if (role.permissions.includes('*')) return true;
  if (role.permissions.includes(permission)) return true;
  const [module] = permission.split('.');
  return role.permissions.includes(`${module}.*`);
};

// ============ KEYBOARD SHORTCUTS ============
const SHORTCUTS = [
  { keys: ['Ctrl', 'K'], action: 'search', label: 'Global Search' },
  { keys: ['Ctrl', 'S'], action: 'scan', label: 'Scan Package' },
  { keys: ['Ctrl', 'N'], action: 'newPackage', label: 'New Package' },
  { keys: ['Ctrl', 'D'], action: 'dispatch', label: 'Dispatch' },
  { keys: ['Esc'], action: 'close', label: 'Close Modal' },
];

// ============ CONSTANTS ============
const DELIVERY_METHODS = {
  warehouse_to_locker: { id: 'warehouse_to_locker', label: 'Warehouse → Locker', icon: Warehouse, color: '#7EA8C9' },
  dropbox_to_locker: { id: 'dropbox_to_locker', label: 'Dropbox → Locker', icon: Inbox, color: '#B5A0D1' },
  locker_to_home: { id: 'locker_to_home', label: 'Locker → Home', icon: Home, color: '#81C995' },
};

const PACKAGE_STATUSES = {
  pending: { label: 'Pending', color: '#D4AA5A', bg: 'rgba(212, 170, 90, 0.07)' },
  at_warehouse: { label: 'At Warehouse', color: '#818CF8', bg: 'rgba(129, 140, 248, 0.07)' },
  at_dropbox: { label: 'At Dropbox', color: '#B5A0D1', bg: 'rgba(181, 160, 209, 0.07)' },
  in_transit_to_locker: { label: 'Transit → Locker', color: '#7EA8C9', bg: 'rgba(126, 168, 201, 0.07)' },
  in_transit_to_home: { label: 'Transit → Home', color: '#22D3EE', bg: 'rgba(34, 211, 238, 0.07)' },
  delivered_to_locker: { label: 'In Locker', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  delivered_to_home: { label: 'Delivered', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  picked_up: { label: 'Picked Up', color: '#A8A29E', bg: 'rgba(168, 162, 158, 0.07)' },
  expired: { label: 'Expired', color: '#D48E8A', bg: 'rgba(212, 142, 138, 0.07)' },
};

const ALL_STATUSES = {
  ...PACKAGE_STATUSES,
  available: { label: 'Available', color: '#81C995', bg: 'rgba(129, 201, 149, 0.07)' },
  occupied: { label: 'Occupied', color: '#7EA8C9', bg: 'rgba(126, 168, 201, 0.07)' },
  reserved: { label: 'Reserved', color: '#B5A0D1', bg: 'rgba(181, 160, 209, 0.07)' },
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


// ============ PIE CHART FOR STATUS DISTRIBUTION ============
const StatusPieChart = ({ data, theme }) => {
  const COLORS = theme.chart?.series || ['#5B9BD5', '#4CAF82', '#E4A63A', '#D97066', '#9B7FD4'];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
          {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} labelStyle={{ color: theme.text.primary }} itemStyle={{ color: theme.text.secondary }} />
      </PieChart>
    </ResponsiveContainer>
  );
};

// ============ MAIN APP COMPONENT ============
function LocQarERPInner() {
  const { theme, themeName, setThemeName, toggleTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const currentUser = useAuthStore((s) => s.user);
  const setCurrentUser = useAuthStore((s) => s.setUser);
  const logoutMutation = useLogout();
  const handleLogout = () => logoutMutation.mutate();
  const [customRoles, setCustomRoles] = useState([
    { id: 'custom_business_owner', key: 'CUSTOM_BUSINESS_OWNER', name: 'Business Owner', level: 20, color: '#D4A0B9', permissions: ['dashboard.view', 'reports.view'], isCustom: true, createdAt: '2024-01-10T00:00:00Z' },
  ]);
  const [packageFilter, setPackageFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [packageSearch, setPackageSearch] = useState('');
  const [packageSort, setPackageSort] = useState({ field: 'createdAt', dir: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showNewPackage, setShowNewPackage] = useState(false);
  const [showDispatchDrawer, setShowDispatchDrawer] = useState(false);
  const [reassignPackage, setReassignPackage] = useState(null);
  const [assignCourierPackage, setAssignCourierPackage] = useState(null);
  const [returnPackage, setReturnPackage] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeTab, setRouteTab] = useState('stops');
  const [expandedStops, setExpandedStops] = useState([]);

  // API Data State
  const [packagesData, setPackagesData] = useState([]);
  const [lockersData, setLockersData] = useState([]);
  const [terminalsData, setTerminalsData] = useState([]);

  // Notification state
  const [notifHistSearch, setNotifHistSearch] = useState('');
  const [notifHistChannel, setNotifHistChannel] = useState('all');
  const [notifHistStatus, setNotifHistStatus] = useState('all');
  const [notifHistSort, setNotifHistSort] = useState({ field: 'sentAt', dir: 'desc' });
  const [notifHistPage, setNotifHistPage] = useState(1);
  const [notifHistPageSize, setNotifHistPageSize] = useState(10);
  const [notifTemplateSearch, setNotifTemplateSearch] = useState('');
  const [notifTemplateChannel, setNotifTemplateChannel] = useState('all');
  const [notifRuleSearch, setNotifRuleSearch] = useState('');
  const [quickSendChannel, setQuickSendChannel] = useState('sms');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [composeOpen, setComposeOpen] = useState(false);

  // SLA Monitor state
  const [slaSearch, setSlaSearch] = useState('');
  const [slaSeverityFilter, setSlaSeverityFilter] = useState('all');
  const [slaSort, setSlaSort] = useState({ field: 'pctUsed', dir: 'desc' });
  const [slaPage, setSlaPage] = useState(1);
  const [slaPageSize, setSlaPageSize] = useState(10);
  const [slaSelectedItem, setSlaSelectedItem] = useState(null);
  const [expandedSlaRows, setExpandedSlaRows] = useState([]);
  const [incidentSearch, setIncidentSearch] = useState('');
  const [incidentSeverityFilter, setIncidentSeverityFilter] = useState('all');
  const [incidentSort, setIncidentSort] = useState({ field: 'timestamp', dir: 'desc' });
  const [incidentPage, setIncidentPage] = useState(1);
  const [incidentPageSize, setIncidentPageSize] = useState(10);
  const [compliancePeriod, setCompliancePeriod] = useState('week');
  const [selectedSlaItems, setSelectedSlaItems] = useState([]);
  const [slaTierFilter, setSlaTierFilter] = useState('all');
  const [incidentLevelFilter, setIncidentLevelFilter] = useState('all');
  const [slaExpandedIncident, setSlaExpandedIncident] = useState(null);

  // Terminals & Lockers filters
  const [terminalSearch, setTerminalSearch] = useState('');
  const [terminalStatusFilter, setTerminalStatusFilter] = useState('all');
  const [lockerSearch, setLockerSearch] = useState('');
  const [lockerStatusFilter, setLockerStatusFilter] = useState('all');
  const [lockerTerminalFilter, setLockerTerminalFilter] = useState('all');
  const [lockerSizeFilter, setLockerSizeFilter] = useState('all');
  const [lockerSort, setLockerSort] = useState({ field: 'id', dir: 'asc' });

  // Customers filters
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all');
  const [customerSort, setCustomerSort] = useState({ field: 'name', dir: 'asc' });
  const [ticketSearch, setTicketSearch] = useState('');
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState('all');
  const [ticketStatusFilter, setTicketStatusFilter] = useState('all');
  const [subscriberSearch, setSubscriberSearch] = useState('');
  const [subscriberPlanFilter, setSubscriberPlanFilter] = useState('all');
  const [subscriberStatusFilter, setSubscriberStatusFilter] = useState('all');
  const [subscriberUniversityFilter, setSubscriberUniversityFilter] = useState('all');
  const [subscriberSort, setSubscriberSort] = useState({ field: 'name', dir: 'asc' });
  const [selectedSubscribers, setSelectedSubscribers] = useState([]);
  const [subscriberDetailItem, setSubscriberDetailItem] = useState(null);
  const [showAddSubscriber, setShowAddSubscriber] = useState(false);
  const [expandedSubscriberRows, setExpandedSubscriberRows] = useState([]);
  const [showSubscriberAnalytics, setShowSubscriberAnalytics] = useState(false);
  const [subscriberNotes, setSubscriberNotes] = useState({});

  // Staff filters
  const [staffSearch, setStaffSearch] = useState('');
  const [staffRoleFilter, setStaffRoleFilter] = useState('all');
  const [staffSort, setStaffSort] = useState({ field: 'name', dir: 'asc' });

  // Accounting filters
  const [txnSearch, setTxnSearch] = useState('');
  const [txnStatusFilter, setTxnStatusFilter] = useState('all');
  const [txnSort, setTxnSort] = useState({ field: 'date', dir: 'desc' });
  const [invSearch, setInvSearch] = useState('');
  const [invStatusFilter, setInvStatusFilter] = useState('all');

  // Dropbox Collections filters
  const [collectionSearch, setCollectionSearch] = useState('');
  const [collectionStatusFilter, setCollectionStatusFilter] = useState('all');
  const [collectionSort, setCollectionSort] = useState({ field: 'status', dir: 'asc' });

  const [dispatchSearch, setDispatchSearch] = useState('');
  const [dispatchSort, setDispatchSort] = useState({ field: 'createdAt', dir: 'desc' });
  const [dispatchFilter, setDispatchFilter] = useState('all');
  const [dispatchPage, setDispatchPage] = useState(1);
  const [dispatchPageSize, setDispatchPageSize] = useState(10);
  const [selectedDispatchItems, setSelectedDispatchItems] = useState([]);
  const [driverSearch, setDriverSearch] = useState('');
  const [driverSort, setDriverSort] = useState({ field: 'name', dir: 'asc' });
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [metrics, setMetrics] = useState({ totalPackages: 0, inLockers: 0, inTransit: 0, pendingPickup: 0, revenue: 0 });
  const shortcutLabel = useMemo(() => {
    if (typeof navigator === 'undefined') return 'Ctrl+K';
    return /Mac|iPhone|iPad|iPod/i.test(navigator.platform) ? 'Cmd+K' : 'Ctrl+K';
  }, []);
  const pageMeta = useMemo(() => {
    const map = {
      dashboard: { title: 'Operations Overview', subtitle: 'Live health of package flow, lockers, terminals, and revenue.' },
      packages: { title: 'Package Operations', subtitle: 'Track package lifecycle, exceptions, and delivery outcomes.' },
      dispatch: { title: 'Dispatch Control', subtitle: 'Plan routes, assign drivers, and resolve failed runs.' },
      notifications: { title: 'Customer Messaging', subtitle: 'Manage outbound templates, alerts, and communication history.' },
      fleet: { title: 'Fleet & Vehicle Health', subtitle: 'Monitor vehicle readiness and courier assignment capacity.' },
      sla: { title: 'SLA Monitor', subtitle: 'Detect service breaches and apply escalation policies quickly.' },
      lockers: { title: 'Locker Inventory', subtitle: 'Capacity, maintenance, and operational readiness of lockers.' },
      dropboxes: { title: 'Dropbox Operations', subtitle: 'Collection activity, agents, and package flow across drop points.' },
      terminals: { title: 'Terminal Network', subtitle: 'Performance, status, and coverage across physical locations.' },
      customers: { title: 'CRM Hub', subtitle: 'Customers, subscribers, B2B partners, and support workflows.' },
      staff: { title: 'Staff Management', subtitle: 'Team roles, performance, and workforce visibility.' },
      couriers: { title: 'Courier Performance', subtitle: 'Track courier productivity, reliability, and workload balance.' },
      hris: { title: 'HRIS', subtitle: 'Onboarding, offboarding, and alumni workforce records.' },
      accounting: { title: 'Accounting', subtitle: 'Transactions, invoices, and reconciliation operations.' },
      payroll: { title: 'Payroll', subtitle: 'Compensation cycles, payouts, and payroll records.' },
      portal: { title: 'Business Portal', subtitle: 'Partner onboarding, shipments, billing, and API usage.' },
      selfservice: { title: 'Partner Self-Service', subtitle: 'Simulate partner-facing journey and service tools.' },
      pricing: { title: 'Pricing Engine', subtitle: 'Control delivery rates, surcharges, and commercial tiers.' },
      crm: { title: 'CRM Pipeline', subtitle: 'Manage leads, contacts, activities, and conversion stages.' },
      analytics: { title: 'Analytics', subtitle: 'Business trends and operational performance insights.' },
      audit: { title: 'Audit & Compliance', subtitle: 'Trace actions, risk events, and compliance history.' },
      cloudconfig: { title: 'Cloud Config', subtitle: 'Manage locker hardware configuration across your network.' },
      settings: { title: 'Platform Settings', subtitle: 'Global system configuration and access controls.' },
    };
    return map[activeMenu] || { title: 'Admin Portal', subtitle: 'Manage end-to-end locker and business operations.' };
  }, [activeMenu]);
  const contextStats = useMemo(() => {
    if (activeMenu === 'packages') return [
      { label: 'Records', value: packagesData.length },
      { label: 'Selected', value: selectedItems.length },
    ];
    if (activeMenu === 'dispatch') return [
      { label: 'Selected', value: selectedDispatchItems.length },
      { label: 'Sort', value: dispatchSort.field },
    ];
    if (activeMenu === 'lockers') return [
      { label: 'Lockers', value: lockersData.length },
      { label: 'Terminals', value: terminalsData.length },
    ];
    if (activeMenu === 'customers') return [
      { label: 'Selected Subs', value: selectedSubscribers.length },
      { label: 'View', value: activeSubMenu || 'All Customers' },
    ];
    if (activeMenu === 'staff') return [
      { label: 'Staff', value: staffData.length },
      { label: 'Teams', value: teamsData.length },
    ];
    return [];
  }, [activeMenu, packagesData.length, selectedItems.length, selectedDispatchItems.length, dispatchSort.field, lockersData.length, terminalsData.length, selectedSubscribers.length, activeSubMenu]);

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Fetch data from backend
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pkgs, lkrs, terms] = await Promise.all([
        api.get('/packages'),
        api.get('/lockers'),
        api.get('/lockers'), // Note: Terminals endpoint not yet implemented, using lockers as placeholder or fallback
      ]);
      setPackagesData(pkgs.length > 0 ? pkgs : INITIAL_PACKAGES);
      setLockersData(lkrs.length > 0 ? lkrs : INITIAL_LOCKERS);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Fallback to mock data on error/if backend is unreachable
      setPackagesData(INITIAL_PACKAGES);
      setLockersData(INITIAL_LOCKERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenLocker = useCallback(async (lockerId) => {
    try {
      await api.post(`/lockers/${lockerId}/open`, {});
      addToast({ type: 'success', message: `Locker ${lockerId} opened successfully` });
      // Refresh data to show potential status changes
      fetchData();
    } catch (error) {
      console.error('Failed to open locker:', error);
      addToast({ type: 'error', message: `Failed to open locker ${lockerId}: ${error.message}` });
    }
  }, [addToast, fetchData]);

  useEffect(() => { const timer = setTimeout(() => setLoading(false), 1000); return () => clearTimeout(timer); }, []);
  useEffect(() => { const checkMobile = () => setIsMobile(window.innerWidth < 768); checkMobile(); window.addEventListener('resize', checkMobile); return () => window.removeEventListener('resize', checkMobile); }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'k': e.preventDefault(); setShowSearch(true); break;
          case 's': e.preventDefault(); setShowScanModal(true); break;
          case 'n': e.preventDefault(); setShowNewPackage(true); break;
          case 'd': e.preventDefault(); setShowDispatchDrawer(true); break;
        }
      }
      if (e.key === 'Escape') { setShowSearch(false); setShowShortcuts(false); setShowScanModal(false); setShowNewPackage(false); setShowDispatchDrawer(false); setSelectedPackage(null); }
      if (e.key === '?') setShowShortcuts(true);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [addToast]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Metrics will be updated from real API data
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const filteredPackages = useMemo(() => {
    let result = packagesData.filter(pkg => {
      if (packageFilter !== 'all') {
        const statusMap = { warehouse: 'at_warehouse', transit: ['in_transit_to_locker', 'in_transit_to_home'], locker: 'delivered_to_locker', pending_pickup: 'delivered_to_locker', delivered: ['delivered_to_locker', 'delivered_to_home', 'picked_up'], expired: 'expired' };
        const match = statusMap[packageFilter];
        if (Array.isArray(match) ? !match.includes(pkg.status) : pkg.status !== match) return false;
      }
      if (methodFilter !== 'all' && pkg.deliveryMethod !== methodFilter) return false;
      if (packageSearch) {
        const q = packageSearch.toLowerCase();
        if (!pkg.waybill.toLowerCase().includes(q) && !pkg.customer.toLowerCase().includes(q) && !pkg.phone.includes(q) && !pkg.destination.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    result.sort((a, b) => {
      const { field, dir } = packageSort;
      let aVal = a[field], bVal = b[field];
      if (field === 'value') { aVal = Number(aVal); bVal = Number(bVal); }
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [packageFilter, methodFilter, packageSearch, packageSort]);

  const paginatedPackages = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPackages.slice(start, start + pageSize);
  }, [filteredPackages, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredPackages.length / pageSize);
  const toggleSelectAll = () => { if (selectedItems.length === paginatedPackages.length) { setSelectedItems([]); } else { setSelectedItems(paginatedPackages.map(p => p.id)); } };
  const toggleSelectItem = (id) => { setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); };
  const handleBulkAction = (action) => {
    const count = selectedItems.length;
    if (action === 'dispatch') {
      setShowDispatchDrawer(true);
    } else if (action === 'export') {
      setShowExport(true);
    } else if (action === 'markDelivered') {
      setPackagesData(prev => prev.map(p => selectedItems.includes(p.id) ? { ...p, status: 'delivered_to_locker' } : p));
      addToast({ type: 'success', message: `${count} package${count > 1 ? 's' : ''} marked as delivered` });
      setSelectedItems([]);
    } else if (action === 'print') {
      addToast({ type: 'success', message: `Printing labels for ${count} package${count > 1 ? 's' : ''}` });
      setSelectedItems([]);
    } else if (action === 'delete') {
      setPackagesData(prev => prev.filter(p => !selectedItems.includes(p.id)));
      addToast({ type: 'warning', message: `${count} package${count > 1 ? 's' : ''} removed` });
      setSelectedItems([]);
    } else {
      addToast({ type: 'success', message: `${action} applied to ${count} packages` });
      setSelectedItems([]);
    }
  };
  const handleExport = (format) => { addToast({ type: 'success', message: `Exporting ${activeMenu} data as ${format.toUpperCase()}...` }); };
  const handleSearchNavigate = (menu, item) => { setActiveMenu(menu); if (menu === 'packages') setSelectedPackage(item); };

  const toggleSubscriberSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([]);
    } else {
      setSelectedSubscribers(filteredSubscribers.map(s => s.id));
    }
  };
  const toggleSubscriberSelect = (id) => {
    setSelectedSubscribers(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  const handleSubscriberBulkAction = (action) => {
    const count = selectedSubscribers.length;
    if (action === 'message') {
      addToast({ type: 'success', message: `Message sent to ${count} subscriber${count > 1 ? 's' : ''}` });
    } else if (action === 'export') {
      addToast({ type: 'success', message: `Exporting ${count} subscriber${count > 1 ? 's' : ''} data...` });
    } else if (action === 'changePlan') {
      addToast({ type: 'info', message: `Plan change initiated for ${count} subscriber${count > 1 ? 's' : ''}` });
    } else if (action === 'suspend') {
      addToast({ type: 'warning', message: `${count} subscriber${count > 1 ? 's' : ''} suspended` });
    }
    setSelectedSubscribers([]);
  };

  const DISPATCH_STATUSES = ['pending', 'at_warehouse', 'at_dropbox', 'in_transit_to_locker', 'in_transit_to_home', 'delivered_to_locker', 'delivered_to_home'];
  const filteredDispatchPackages = useMemo(() => {
    let result = packagesData.filter(pkg => {
      if (!DISPATCH_STATUSES.includes(pkg.status)) return false;
      if (dispatchFilter === 'ready' && !['pending', 'at_warehouse', 'at_dropbox'].includes(pkg.status)) return false;
      if (dispatchFilter === 'in_transit' && !pkg.status.startsWith('in_transit')) return false;
      if (dispatchFilter === 'delivered' && !pkg.status.startsWith('delivered')) return false;
      if (dispatchSearch) {
        const q = dispatchSearch.toLowerCase();
        if (!pkg.waybill.toLowerCase().includes(q) && !pkg.customer.toLowerCase().includes(q) && !pkg.phone.includes(q) && !pkg.destination.toLowerCase().includes(q)) return false;
      }
      return true;
    });
    result.sort((a, b) => {
      const { field, dir } = dispatchSort;
      let aVal = a[field], bVal = b[field];
      if (field === 'value') { aVal = Number(aVal); bVal = Number(bVal); }
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [dispatchFilter, dispatchSearch, dispatchSort]);

  const paginatedDispatchPackages = useMemo(() => {
    const start = (dispatchPage - 1) * dispatchPageSize;
    return filteredDispatchPackages.slice(start, start + dispatchPageSize);
  }, [filteredDispatchPackages, dispatchPage, dispatchPageSize]);

  const dispatchTotalPages = Math.ceil(filteredDispatchPackages.length / dispatchPageSize);
  const toggleDispatchSelectAll = () => { if (selectedDispatchItems.length === paginatedDispatchPackages.length) { setSelectedDispatchItems([]); } else { setSelectedDispatchItems(paginatedDispatchPackages.map(p => p.id)); } };
  const toggleDispatchSelectItem = (id) => { setSelectedDispatchItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); };

  const filteredDrivers = useMemo(() => {
    let result = [...driversData];
    if (driverSearch) {
      const q = driverSearch.toLowerCase();
      result = result.filter(d => d.name.toLowerCase().includes(q) || d.phone.includes(q) || d.zone.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      const { field, dir } = driverSort;
      let aVal = a[field], bVal = b[field];
      if (typeof aVal === 'number') return dir === 'asc' ? aVal - bVal : bVal - aVal;
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [driverSearch, driverSort]);

  // Notification filters
  const filteredNotifHistory = useMemo(() => {
    let result = [...notificationHistoryData];
    if (notifHistChannel !== 'all') result = result.filter(m => m.channel === notifHistChannel);
    if (notifHistStatus !== 'all') result = result.filter(m => m.status === notifHistStatus);
    if (notifHistSearch) {
      const q = notifHistSearch.toLowerCase();
      result = result.filter(m => m.recipient.toLowerCase().includes(q) || m.phone.includes(q) || m.template.toLowerCase().includes(q) || m.waybill.toLowerCase().includes(q) || m.id.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      const { field, dir } = notifHistSort;
      let aVal = a[field], bVal = b[field];
      if (typeof aVal === 'number') return dir === 'asc' ? aVal - bVal : bVal - aVal;
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = (bVal || '').toLowerCase(); }
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [notifHistSearch, notifHistChannel, notifHistStatus, notifHistSort]);

  const notifHistTotalPages = Math.ceil(filteredNotifHistory.length / notifHistPageSize);
  const paginatedNotifHistory = filteredNotifHistory.slice((notifHistPage - 1) * notifHistPageSize, notifHistPage * notifHistPageSize);

  const filteredTemplates = useMemo(() => {
    let result = [...smsTemplatesData];
    if (notifTemplateChannel !== 'all') result = result.filter(t => t.channel === notifTemplateChannel);
    if (notifTemplateSearch) {
      const q = notifTemplateSearch.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.message.toLowerCase().includes(q) || t.event.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
    }
    return result;
  }, [notifTemplateSearch, notifTemplateChannel]);

  const filteredRules = useMemo(() => {
    let result = [...autoRulesData];
    if (notifRuleSearch) {
      const q = notifRuleSearch.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.trigger.toLowerCase().includes(q));
    }
    return result;
  }, [notifRuleSearch]);

  // SLA filters
  const filteredSlaItems = useMemo(() => {
    let result = [...slaBreachData];
    if (slaSeverityFilter !== 'all') result = result.filter(s => s.severity === slaSeverityFilter);
    if (slaTierFilter !== 'all') result = result.filter(s => s.slaType === slaTierFilter);
    if (slaSearch) {
      const q = slaSearch.toLowerCase();
      result = result.filter(s => s.waybill.toLowerCase().includes(q) || s.customer.toLowerCase().includes(q) || s.terminal.toLowerCase().includes(q) || s.agent.toLowerCase().includes(q) || s.product.toLowerCase().includes(q) || s.slaType.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      const { field, dir } = slaSort;
      let aVal = a[field], bVal = b[field];
      if (typeof aVal === 'number') return dir === 'asc' ? aVal - bVal : bVal - aVal;
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [slaSearch, slaSeverityFilter, slaTierFilter, slaSort]);

  const slaTotalPages = Math.ceil(filteredSlaItems.length / slaPageSize);
  const paginatedSlaItems = filteredSlaItems.slice((slaPage - 1) * slaPageSize, slaPage * slaPageSize);

  const slaAgentPerformance = useMemo(() => {
    const agentMap = {};
    slaBreachData.forEach(s => {
      if (!agentMap[s.agent]) agentMap[s.agent] = { agent: s.agent, total: 0, onTrack: 0, warning: 0, critical: 0, breached: 0, totalPct: 0 };
      const a = agentMap[s.agent];
      a.total++;
      a[s.severity === 'on_track' ? 'onTrack' : s.severity]++;
      a.totalPct += s.pctUsed;
    });
    return Object.values(agentMap).map(a => ({
      ...a,
      avgPctUsed: Math.round(a.totalPct / a.total),
      complianceRate: a.total > 0 ? Math.round(((a.onTrack) / a.total) * 100) : 100,
    })).sort((a, b) => b.complianceRate - a.complianceRate);
  }, []);

  const filteredIncidents = useMemo(() => {
    let result = [...escalationLog];
    if (incidentSeverityFilter !== 'all') result = result.filter(l => l.severity === incidentSeverityFilter);
    if (incidentLevelFilter !== 'all') result = result.filter(l => l.level === Number(incidentLevelFilter));
    if (incidentSearch) {
      const q = incidentSearch.toLowerCase();
      result = result.filter(l => l.waybill.toLowerCase().includes(q) || l.action.toLowerCase().includes(q) || l.by.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      const { field, dir } = incidentSort;
      let aVal = a[field], bVal = b[field];
      if (typeof aVal === 'number') return dir === 'asc' ? aVal - bVal : bVal - aVal;
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [incidentSearch, incidentSeverityFilter, incidentLevelFilter, incidentSort]);

  const incidentTotalPages = Math.ceil(filteredIncidents.length / incidentPageSize);
  const paginatedIncidents = filteredIncidents.slice((incidentPage - 1) * incidentPageSize, incidentPage * incidentPageSize);

  // Terminals filter
  const filteredTerminals = useMemo(() => {
    let result = [...terminalsData];
    if (terminalSearch) {
      const q = terminalSearch.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.location.toLowerCase().includes(q) || t.region.toLowerCase().includes(q) || t.city.toLowerCase().includes(q) || (t.sn || '').toLowerCase().includes(q));
    }
    if (terminalStatusFilter !== 'all') result = result.filter(t => t.status === terminalStatusFilter);
    return result;
  }, [terminalSearch, terminalStatusFilter]);

  // Lockers filter + sort
  const filteredLockers = useMemo(() => {
    let result = [...lockersData];
    if (lockerSearch) {
      const q = lockerSearch.toLowerCase();
      result = result.filter(l => String(l.id).includes(q) || l.terminal.toLowerCase().includes(q) || (l.package || '').toLowerCase().includes(q));
    }
    if (lockerStatusFilter !== 'all') result = result.filter(l => l.status.toLowerCase() === lockerStatusFilter);
    if (lockerTerminalFilter !== 'all') result = result.filter(l => l.terminal === lockerTerminalFilter);
    if (lockerSizeFilter !== 'all') result = result.filter(l => l.sizeLabel === lockerSizeFilter);
    result.sort((a, b) => {
      const { field, dir } = lockerSort;
      let aVal = a[field], bVal = b[field];
      if (typeof aVal === 'number') return dir === 'asc' ? aVal - bVal : bVal - aVal;
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [lockerSearch, lockerStatusFilter, lockerTerminalFilter, lockerSizeFilter, lockerSort]);

  // Customers filter + sort
  const filteredCustomers = useMemo(() => {
    let result = [...customersData];
    if (customerSearch) {
      const q = customerSearch.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q));
    }
    if (customerTypeFilter !== 'all') result = result.filter(c => c.type.toLowerCase() === customerTypeFilter);
    result.sort((a, b) => {
      const { field, dir } = customerSort;
      let aVal = field === 'totalSpent' ? a.totalSpent : field === 'totalOrders' ? a.totalOrders : a[field];
      let bVal = field === 'totalSpent' ? b.totalSpent : field === 'totalOrders' ? b.totalOrders : b[field];
      if (typeof aVal === 'number') return dir === 'asc' ? aVal - bVal : bVal - aVal;
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [customerSearch, customerTypeFilter, customerSort]);

  // Support tickets filter
  const filteredTickets = useMemo(() => {
    let result = [...ticketsData];
    if (ticketSearch) {
      const q = ticketSearch.toLowerCase();
      result = result.filter(t => String(t.id).includes(q) || t.customer.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q));
    }
    if (ticketPriorityFilter !== 'all') result = result.filter(t => t.priority.toLowerCase() === ticketPriorityFilter);
    if (ticketStatusFilter !== 'all') result = result.filter(t => t.status.toLowerCase().replace(/\s+/g, '_') === ticketStatusFilter);
    return result;
  }, [ticketSearch, ticketPriorityFilter, ticketStatusFilter]);

  // Subscribers filter + sort
  const filteredSubscribers = useMemo(() => {
    let result = [...subscribersData];
    if (subscriberSearch) {
      const q = subscriberSearch.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.university.toLowerCase().includes(q) || s.studentId.toLowerCase().includes(q) || s.phone.includes(q));
    }
    if (subscriberPlanFilter !== 'all') result = result.filter(s => s.plan === subscriberPlanFilter);
    if (subscriberStatusFilter !== 'all') result = result.filter(s => s.status === subscriberStatusFilter);
    if (subscriberUniversityFilter !== 'all') result = result.filter(s => s.university === subscriberUniversityFilter);
    result.sort((a, b) => {
      const { field, dir } = subscriberSort;
      let aVal = field === 'deliveriesUsed' ? a.deliveriesUsed : a[field];
      let bVal = field === 'deliveriesUsed' ? b.deliveriesUsed : b[field];
      if (typeof aVal === 'number') return dir === 'asc' ? aVal - bVal : bVal - aVal;
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [subscriberSearch, subscriberPlanFilter, subscriberStatusFilter, subscriberUniversityFilter, subscriberSort]);

  const subscriberUniversities = useMemo(() => [...new Set(subscribersData.map(s => s.university))], []);

  // Staff filter + sort
  const filteredStaff = useMemo(() => {
    let result = [...staffData];
    if (staffSearch) {
      const q = staffSearch.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.terminal.toLowerCase().includes(q) || s.phone.includes(q) || s.team.toLowerCase().includes(q));
    }
    if (staffRoleFilter !== 'all') result = result.filter(s => s.role === staffRoleFilter);
    result.sort((a, b) => {
      const { field, dir } = staffSort;
      let aVal = a[field], bVal = b[field];
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [staffSearch, staffRoleFilter, staffSort]);

  // Transactions filter + sort
  const filteredTransactions = useMemo(() => {
    let result = [...transactionsData];
    if (txnSearch) {
      const q = txnSearch.toLowerCase();
      result = result.filter(t => String(t.id).includes(q) || t.customer.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));
    }
    if (txnStatusFilter !== 'all') result = result.filter(t => t.status.toLowerCase() === txnStatusFilter);
    result.sort((a, b) => {
      const { field, dir } = txnSort;
      let aVal = field === 'amount' ? a.amount : field === 'date' ? new Date(a.date) : a[field];
      let bVal = field === 'amount' ? b.amount : field === 'date' ? new Date(b.date) : b[field];
      if (aVal instanceof Date) return dir === 'asc' ? aVal - bVal : bVal - aVal;
      if (typeof aVal === 'number') return dir === 'asc' ? aVal - bVal : bVal - aVal;
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [txnSearch, txnStatusFilter, txnSort]);

  // Invoices filter
  const filteredInvoices = useMemo(() => {
    let result = [...invoicesData];
    if (invSearch) {
      const q = invSearch.toLowerCase();
      result = result.filter(i => String(i.id).includes(q) || i.customer.toLowerCase().includes(q));
    }
    if (invStatusFilter !== 'all') result = result.filter(i => i.status.toLowerCase() === invStatusFilter);
    return result;
  }, [invSearch, invStatusFilter]);

  // Collections filter + sort
  const filteredCollections = useMemo(() => {
    let result = [...collectionsData];
    if (collectionSearch) {
      const q = collectionSearch.toLowerCase();
      result = result.filter(c => String(c.id).includes(q) || c.dropboxName.toLowerCase().includes(q) || c.agent.toLowerCase().includes(q));
    }
    if (collectionStatusFilter !== 'all') result = result.filter(c => c.status.toLowerCase().replace(/\s+/g, '_') === collectionStatusFilter);
    result.sort((a, b) => {
      const { field, dir } = collectionSort;
      let aVal = a[field], bVal = b[field];
      if (typeof aVal === 'number') return dir === 'asc' ? aVal - bVal : bVal - aVal;
      if (typeof aVal === 'string') { aVal = aVal.toLowerCase(); bVal = bVal.toLowerCase(); }
      if (aVal < bVal) return dir === 'asc' ? -1 : 1;
      if (aVal > bVal) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return result;
  }, [collectionSearch, collectionStatusFilter, collectionSort]);

  // Sync sidebar sub-menu clicks to package filter
  useEffect(() => {
    if (activeMenu === 'packages' && activeSubMenu) {
      const subMenuToFilter = { 'All Packages': 'all', 'In Locker': 'locker', 'Pending Pickup': 'pending_pickup', 'Expired': 'expired' };
      if (subMenuToFilter[activeSubMenu]) { setPackageFilter(subMenuToFilter[activeSubMenu]); setCurrentPage(1); }
    }
  }, [activeMenu, activeSubMenu]);

  const statusDistribution = useMemo(() => [
    { name: 'In Locker', value: packagesData.filter(p => p.status === 'delivered_to_locker').length },
    { name: 'In Transit', value: packagesData.filter(p => p.status.includes('transit')).length },
    { name: 'Pending', value: packagesData.filter(p => p.status === 'pending').length },
    { name: 'Expired', value: packagesData.filter(p => p.status === 'expired').length },
    { name: 'Other', value: packagesData.filter(p => !['delivered_to_locker', 'pending', 'expired'].includes(p.status) && !p.status.includes('transit')).length },
  ], []);

  // ── AUTH GATE ──────────────────────────────────────────────────────────────
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.role === 'CUSTOMER') {
    return <CustomerPortalPage currentUser={currentUser} onLogout={handleLogout} themeName={themeName} setThemeName={setThemeName} />;
  }
  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${theme.bg.primary} 0%, ${theme.bg.secondary} 50%, ${theme.bg.primary} 100%)`, fontFamily: theme.font.primary }}>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl opacity-30"
        style={{ background: `radial-gradient(circle, ${theme.accent.primary}35 0%, transparent 70%)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20"
        style={{ background: `radial-gradient(circle, ${theme.status.info}35 0%, transparent 70%)` }}
      />
      <style>{`::-webkit-scrollbar { width: 6px; height: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${theme.border.secondary}; border-radius: 3px; } .font-mono { font-family: ${theme.font.mono} !important; } @keyframes slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slide-in { animation: slide-in 0.3s ease-out; }`}</style>

      {(!isMobile || mobileSidebarOpen) && (
        <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} activeMenu={activeMenu} setActiveMenu={setActiveMenu} activeSubMenu={activeSubMenu} setActiveSubMenu={setActiveSubMenu} theme={theme} userRole={currentUser.role} isMobile={isMobile} onCloseMobile={() => setMobileSidebarOpen(false)} customRoles={customRoles} />
      )}

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <header className="h-16 border-b px-4 md:px-6 flex items-center justify-between sticky top-0 z-30" style={{ backgroundColor: theme.name === 'dark' ? 'rgba(10,10,10,0.75)' : 'rgba(255,255,255,0.95)', borderColor: theme.border.primary, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}>
          <div className="flex items-center gap-3">
            {isMobile && <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-lg" style={{ color: theme.icon.primary }}><Menu size={20} /></button>}
            <button onClick={() => setShowSearch(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border w-52 md:w-[28rem] transition-all duration-150" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }} aria-label="Open global search">
              <Search size={16} style={{ color: theme.icon.muted }} />
              <span className="text-sm hidden md:inline" style={{ color: theme.text.muted }}>Search packages, lockers, customers...</span>
              <kbd className="ml-auto px-1.5 py-0.5 rounded text-xs hidden md:inline" style={{ backgroundColor: theme.bg.secondary, color: theme.text.muted }}>{shortcutLabel}</kbd>
            </button>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setShowShortcuts(true)} className="p-2.5 rounded-xl border hidden md:flex" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}><Keyboard size={18} style={{ color: theme.icon.primary }} /></button>
            <button onClick={() => setThemeName(t => t === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>{themeName === 'dark' ? <Sun size={18} style={{ color: theme.icon.primary }} /> : <Moon size={18} style={{ color: theme.icon.primary }} />}</button>
            {hasPermission(currentUser.role, 'packages.scan', customRoles) && <button onClick={() => setShowScanModal(true)} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}><QrCode size={18} />Scan</button>}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2.5 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}><Bell size={18} style={{ color: theme.icon.primary }} /><span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center" style={{ backgroundColor: theme.status.error, color: '#fff' }}>{notifications.filter(n => !n.read).length}</span></button>
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-xl z-50" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                  <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                    <span className="font-semibold" style={{ color: theme.text.primary }}>Notifications</span>
                    <button onClick={() => setShowNotifications(false)} className="text-xs" style={{ color: theme.accent.primary }}>Mark all read</button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map(n => (
                      <div key={n.id} className="p-3 border-b flex gap-3" style={{ backgroundColor: n.read ? 'transparent' : theme.accent.light, borderColor: theme.border.primary }}>
                        <div className="w-2 h-2 rounded-full mt-2" style={{ backgroundColor: n.type === 'error' ? theme.status.error : n.type === 'warning' ? theme.status.warning : n.type === 'success' ? theme.status.success : theme.status.info }} />
                        <div><p className="text-sm" style={{ color: theme.text.primary }}>{n.title}</p><p className="text-xs" style={{ color: theme.text.muted }}>{n.time}</p></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* Profile dropdown */}
            <div className="hidden md:block relative pl-3 border-l" style={{ borderColor: theme.border.primary }}>
              <button
                onClick={() => setShowProfileMenu(p => !p)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold" style={{ backgroundColor: ROLES[currentUser.role]?.color + '30', color: ROLES[currentUser.role]?.color, border: `2px solid ${ROLES[currentUser.role]?.color}50` }}>{(currentUser.name ?? currentUser.email ?? '?').charAt(0).toUpperCase()}</div>
                <div className="text-left">
                  <p className="text-sm font-medium leading-none" style={{ color: theme.text.primary }}>{currentUser.name ?? currentUser.email}</p>
                  <p className="text-xs leading-none mt-0.5" style={{ color: theme.text.muted }}>{ROLES[currentUser.role]?.name}</p>
                </div>
                <ChevronDown size={13} style={{ color: theme.icon.muted }} />
              </button>

              {showProfileMenu && (
                <>
                  {/* Backdrop */}
                  <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border shadow-2xl z-50 overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    {/* User info header */}
                    <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: ROLES[currentUser.role]?.color + '20', color: ROLES[currentUser.role]?.color }}>
                          {(currentUser.name ?? currentUser.email ?? '?').charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-sm truncate" style={{ color: theme.text.primary }}>{currentUser.name ?? currentUser.email}</p>
                          <p className="text-xs truncate" style={{ color: theme.text.muted }}>{currentUser.email}</p>
                          <span className="inline-block text-xs px-2 py-0.5 rounded-full mt-1 font-medium" style={{ backgroundColor: ROLES[currentUser.role]?.color + '20', color: ROLES[currentUser.role]?.color }}>
                            {ROLES[currentUser.role]?.name}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="p-1.5">
                      {[
                        { label: 'Settings',       icon: Settings,  menu: 'settings',   always: true },
                        { label: 'Notifications',  icon: Bell,      menu: 'notifications', always: true },
                        { label: 'Audit Log',      icon: History,   menu: 'audit',      role: ['SUPER_ADMIN', 'ADMIN'] },
                        { label: 'Keyboard Shortcuts', icon: Keyboard, action: () => { setShowShortcuts(true); setShowProfileMenu(false); }, always: true },
                      ].filter(item => item.always || (item.role && item.role.includes(currentUser.role))).map(item => {
                        const Icon = item.icon;
                        const handleClick = item.action || (() => { setActiveMenu(item.menu); setShowProfileMenu(false); });
                        return (
                          <button key={item.label} onClick={handleClick} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 text-left transition-colors">
                            <Icon size={15} style={{ color: theme.icon.muted }} />
                            <span className="text-sm" style={{ color: theme.text.secondary }}>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="p-1.5 border-t" style={{ borderColor: theme.border.primary }}>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-red-500/5 text-left transition-colors">
                        <LogOut size={15} style={{ color: '#D48E8A' }} />
                        <span className="text-sm font-medium" style={{ color: '#D48E8A' }}>Sign out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <Breadcrumb
          activeMenu={activeMenu}
          activeSubMenu={activeSubMenu}
          onNavigate={(menuId, subMenu) => { setActiveMenu(menuId); setActiveSubMenu(subMenu); }}
        />
        <section className="px-4 md:px-6 pt-2 pb-3 border-b" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.secondary }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-sm md:text-base font-semibold" style={{ color: theme.text.primary }}>{pageMeta.title}</h1>
              <p className="text-xs md:text-sm" style={{ color: theme.text.muted }}>{pageMeta.subtitle}</p>
            </div>
            {contextStats.length > 0 && (
              <div className="flex items-center gap-2">
                {contextStats.map((stat) => (
                  <div key={stat.label} className="px-2.5 py-1 rounded-lg border text-xs" style={{ borderColor: theme.border.primary, color: theme.text.secondary, backgroundColor: theme.bg.tertiary }}>
                    <span style={{ color: theme.text.muted }}>{stat.label}:</span>{' '}
                    <span className="font-semibold" style={{ color: theme.text.primary }}>{stat.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto px-2 md:px-3">
          {/* Dashboard */}
          {activeMenu === 'dashboard' && (
            <DashboardPage
              currentUser={currentUser}
              metrics={metrics}
              loading={loading}
              setLoading={setLoading}
              setShowExport={setShowExport}
              setShowScanModal={setShowScanModal}
              setShowNewPackage={setShowNewPackage}
              setShowDispatchDrawer={setShowDispatchDrawer}
              setActiveMenu={setActiveMenu}
              setActiveSubMenu={setActiveSubMenu}
              addToast={addToast}
            />
          )}

          {/* Packages Page */}
          {activeMenu === 'packages' && (
            <PackagesPage
              currentUser={currentUser}
              loading={loading}
              activeSubMenu={activeSubMenu}
              filteredPackages={filteredPackages}
              paginatedPackages={paginatedPackages}
              packageSearch={packageSearch}
              setPackageSearch={setPackageSearch}
              packageFilter={packageFilter}
              setPackageFilter={setPackageFilter}
              methodFilter={methodFilter}
              setMethodFilter={setMethodFilter}
              packageSort={packageSort}
              setPackageSort={setPackageSort}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              setPageSize={setPageSize}
              totalPages={totalPages}
              selectedItems={selectedItems}
              toggleSelectAll={toggleSelectAll}
              toggleSelectItem={toggleSelectItem}
              setShowExport={setShowExport}
              setShowNewPackage={setShowNewPackage}
              setSelectedPackage={setSelectedPackage}
              setReassignPackage={setReassignPackage}
              setAssignCourierPackage={setAssignCourierPackage}
              onMarkDelivered={(pkg) => { setPackagesData(prev => prev.map(p => p.id === pkg.id ? { ...p, status: 'delivered_to_locker' } : p)); addToast({ type: 'success', message: `${pkg.waybill} marked as delivered` }); }}
              onDeletePackage={(pkg) => { setPackagesData(prev => prev.filter(p => p.id !== pkg.id)); addToast({ type: 'warning', message: `${pkg.waybill} deleted` }); }}
              addToast={addToast}
            />
          )}

          {/* Dropbox Management */}
          {activeMenu === 'dropboxes' && (
            <DropboxesPage
              currentUser={currentUser}
              loading={loading}
              setLoading={setLoading}
              activeSubMenu={activeSubMenu}
              setShowExport={setShowExport}
              addToast={addToast}
              collectionSearch={collectionSearch}
              setCollectionSearch={setCollectionSearch}
              collectionStatusFilter={collectionStatusFilter}
              setCollectionStatusFilter={setCollectionStatusFilter}
              collectionSort={collectionSort}
              setCollectionSort={setCollectionSort}
              filteredCollections={filteredCollections}
            />
          )}


          {/* Notifications Page */}
          {activeMenu === 'notifications' && (
            <NotificationsPage
              currentUser={currentUser}
              loading={loading}
              activeSubMenu={activeSubMenu}
              setShowExport={setShowExport}
              setComposeOpen={setComposeOpen}
              addToast={addToast}
            />
          )}

          {/* Lockers Page — typed feature module (Phase 4 migration). The
              legacy LockersPage has been retired in favor of the new terminals
              hierarchy under src/features/lockers. */}
          {activeMenu === 'lockers' && <LockersListPage />}

          {/* Cross-cutting Activity feed — typed feature module. */}
          {activeMenu === 'activity' && <ActivityFeedPage />}


          {/* Terminals Page */}
          {activeMenu === 'terminals' && (
            <TerminalsPage
              currentUser={currentUser}
              loading={loading}
              activeSubMenu={activeSubMenu}
              setShowExport={setShowExport}
              terminalSearch={terminalSearch}
              setTerminalSearch={setTerminalSearch}
              terminalStatusFilter={terminalStatusFilter}
              setTerminalStatusFilter={setTerminalStatusFilter}
              filteredTerminals={filteredTerminals}
              addToast={addToast}
            />
          )}

          {/* SLA Monitor Page */}
          {activeMenu === 'sla' && (
            <SLAMonitorPage
              currentUser={currentUser}
              loading={loading}
              activeSubMenu={activeSubMenu}
              setShowExport={setShowExport}
              addToast={addToast}
              slaBreachData={slaBreachData}
              escalationLog={escalationLog}
            />
          )}

          {/* Dispatch Page */}
          {activeMenu === 'dispatch' && (
            <DispatchPage
              currentUser={currentUser}
              loading={loading}
              activeSubMenu={activeSubMenu}
              setShowExport={setShowExport}
              addToast={addToast}
            />
          )}

          {/* Fleet Page */}
          {activeMenu === 'fleet' && (
            <FleetPage
              currentUser={currentUser}
              loading={loading}
              activeSubMenu={activeSubMenu}
              setShowExport={setShowExport}
              addToast={addToast}
            />
          )}


          {/* Workflows Page */}
          {activeMenu === 'workflows' && (
            <WorkflowsPage addToast={addToast} />
          )}

          {/* Customers Page */}
          {activeMenu === 'customers' && (
            <CustomersPage
              currentUser={currentUser}
              loading={loading}
              activeSubMenu={activeSubMenu}
              customerSearch={customerSearch}
              setCustomerSearch={setCustomerSearch}
              customerTypeFilter={customerTypeFilter}
              setCustomerTypeFilter={setCustomerTypeFilter}
              customerSort={customerSort}
              setCustomerSort={setCustomerSort}
              filteredCustomers={filteredCustomers}
              filteredSubscribers={filteredSubscribers}
              subscriberSearch={subscriberSearch}
              setSubscriberSearch={setSubscriberSearch}
              subscriberPlanFilter={subscriberPlanFilter}
              setSubscriberPlanFilter={setSubscriberPlanFilter}
              subscriberStatusFilter={subscriberStatusFilter}
              setSubscriberStatusFilter={setSubscriberStatusFilter}
              subscriberUniversityFilter={subscriberUniversityFilter}
              setSubscriberUniversityFilter={setSubscriberUniversityFilter}
              subscriberSort={subscriberSort}
              setSubscriberSort={setSubscriberSort}
              subscriberUniversities={subscriberUniversities}
              selectedSubscribers={selectedSubscribers}
              toggleSubscriberSelectAll={toggleSubscriberSelectAll}
              toggleSubscriberSelect={toggleSubscriberSelect}
              subscriberDetailItem={subscriberDetailItem}
              setSubscriberDetailItem={setSubscriberDetailItem}
              filteredTickets={filteredTickets}
              ticketSearch={ticketSearch}
              setTicketSearch={setTicketSearch}
              ticketPriorityFilter={ticketPriorityFilter}
              setTicketPriorityFilter={setTicketPriorityFilter}
              ticketStatusFilter={ticketStatusFilter}
              setTicketStatusFilter={setTicketStatusFilter}
              addToast={addToast}
              setShowExport={setShowExport}
              setConfirmDialog={setConfirmDialog}
            />
          )}


          {/* Staff Page */}
          {activeMenu === 'staff' && (
            <StaffPage
              currentUser={currentUser}
              activeSubMenu={activeSubMenu}
              loading={loading}
              staffSearch={staffSearch}
              setStaffSearch={setStaffSearch}
              staffRoleFilter={staffRoleFilter}
              setStaffRoleFilter={setStaffRoleFilter}
              staffSort={staffSort}
              setStaffSort={setStaffSort}
              filteredStaff={filteredStaff}
              addToast={addToast}
              setShowExport={setShowExport}
              setConfirmDialog={setConfirmDialog}
            />
          )}


          {/* Couriers Page */}
          {activeMenu === 'couriers' && (
            <CouriersPage addToast={addToast} packages={packagesData} />
          )}

          {/* HRIS Page */}
          {activeMenu === 'hris' && (
            <HRISPage activeSubMenu={activeSubMenu} loading={loading} addToast={addToast} />
          )}

          {/* Accounting Page */}
          {activeMenu === 'accounting' && (
            <AccountingPage
              activeSubMenu={activeSubMenu}
              loading={loading}
              setShowExport={setShowExport}
              txnSearch={txnSearch}
              setTxnSearch={setTxnSearch}
              txnStatusFilter={txnStatusFilter}
              setTxnStatusFilter={setTxnStatusFilter}
              txnSort={txnSort}
              setTxnSort={setTxnSort}
              filteredTransactions={filteredTransactions}
              invSearch={invSearch}
              setInvSearch={setInvSearch}
              invStatusFilter={invStatusFilter}
              setInvStatusFilter={setInvStatusFilter}
              filteredInvoices={filteredInvoices}
              addToast={addToast}
            />
          )}


          {/* Payroll Page */}
          {activeMenu === 'payroll' && (
            <PayrollPage
              activeSubMenu={activeSubMenu}
              loading={loading}
              addToast={addToast}
            />
          )}

          {/* Business Portal */}
          {activeMenu === 'portal' && (
            <BusinessPortalPage
              activeSubMenu={activeSubMenu}
              loading={loading}
              setShowExport={setShowExport}
              addToast={addToast}
            />
          )}


          {/* ============ PARTNER SELF-SERVICE PORTAL ============ */}
          {activeMenu === 'selfservice' && (
            <PartnerPortalPage
              activeSubMenu={activeSubMenu}
              setActiveSubMenu={setActiveSubMenu}
              loading={loading}
              setShowExport={setShowExport}
              addToast={addToast}
            />
          )}


          {/* Analytics Page */}
          {activeMenu === 'analytics' && (
            <AnalyticsPage
              currentUser={currentUser}
              loading={loading}
              activeSubMenu={activeSubMenu}
              setShowExport={setShowExport}
            />
          )}

          {/* Pricing Engine Page */}
          {activeMenu === 'pricing' && (
            <PricingEnginePage
              activeSubMenu={activeSubMenu}
              setShowExport={setShowExport}
              addToast={addToast}
            />
          )}

          {/* CRM Page */}
          {activeMenu === 'crm' && (
            <CRMPage
              activeSubMenu={activeSubMenu}
              currentUser={currentUser}
              loading={loading}
              setShowExport={setShowExport}
              addToast={addToast}
            />
          )}

          {/* Audit Log Page */}
          {activeMenu === 'audit' && (
            <AuditLogPage
              setShowExport={setShowExport}
            />
          )}

          {/* Cloud Config Page */}
          {activeMenu === 'cloudconfig' && (
            <CloudConfigPage
              addToast={addToast}
            />
          )}

          {/* Settings Page */}
          {activeMenu === 'settings' && (
            <SettingsPage
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              themeName={themeName}
              setThemeName={setThemeName}
              setShowShortcuts={setShowShortcuts}
              addToast={addToast}
              customRoles={customRoles}
              setCustomRoles={setCustomRoles}
            />
          )}
        </main>
      </div>

      {/* Modals & Overlays */}
      {selectedPackage && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedPackage(null)} />
          <PackageDetailDrawer pkg={selectedPackage} onClose={() => setSelectedPackage(null)} userRole={currentUser.role} addToast={addToast} onReassign={(p) => { setSelectedPackage(null); setReassignPackage(p); }} onReturn={(p) => { setSelectedPackage(null); setReturnPackage(p); }} onMarkDelivered={(p) => { setPackagesData(prev => prev.map(x => x.id === p.id ? { ...x, status: 'delivered_to_locker' } : x)); setSelectedPackage(null); }} onSave={(updated) => { setPackagesData(prev => prev.map(x => x.id === updated.id ? updated : x)); setSelectedPackage(updated); }} />
        </>
      )}

      <GlobalSearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} onNavigate={handleSearchNavigate} />
      <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} onExport={handleExport} dataType={activeMenu} />
      <ScanModal isOpen={showScanModal} onClose={() => setShowScanModal(false)} userRole={currentUser.role} addToast={addToast} onViewPackage={(pkg) => { setSelectedPackage(pkg); setActiveMenu('packages'); }} onReassign={setReassignPackage} onReturn={setReturnPackage} />
      <NewPackageDrawer isOpen={showNewPackage} onClose={() => setShowNewPackage(false)} addToast={addToast} onSubmit={(pkg) => { setPackagesData(prev => [pkg, ...prev]); }} />
      <DispatchDrawer isOpen={showDispatchDrawer} onClose={() => setShowDispatchDrawer(false)} addToast={addToast} onViewFull={() => setActiveMenu('dispatch')} />
      <ReassignModal isOpen={!!reassignPackage} onClose={() => setReassignPackage(null)} pkg={reassignPackage} addToast={addToast} onReassign={(pkg, newDestination) => { setPackagesData(prev => prev.map(p => p.id === pkg.id ? { ...p, destination: newDestination, locker: '-', status: 'in_transit_to_locker' } : p)); setReassignPackage(null); }} />
      <ReturnModal isOpen={!!returnPackage} onClose={() => setReturnPackage(null)} pkg={returnPackage} addToast={addToast} />
      <AssignCourierModal isOpen={!!assignCourierPackage} onClose={() => setAssignCourierPackage(null)} pkg={assignCourierPackage} packages={packagesData} onAssign={(pkg, courier) => { setPackagesData(prev => prev.map(p => p.id === pkg.id ? { ...p, courier } : p)); addToast({ type: 'success', message: courier ? `${pkg.waybill} assigned to ${courier.name}` : `${pkg.waybill} unassigned` }); setAssignCourierPackage(null); }} addToast={addToast} />

      {/* Compose Message Modal */}
      {composeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setComposeOpen(false)}>
          <div className="w-full max-w-2xl rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(129,201,149,0.1)' }}><Send size={20} style={{ color: '#81C995' }} /></div>
                <div>
                  <h2 className="font-semibold text-lg" style={{ color: theme.text.primary }}>Compose Message</h2>
                  <p className="text-sm" style={{ color: theme.text.muted }}>Send a custom or template-based notification</p>
                </div>
              </div>
              <button onClick={() => setComposeOpen(false)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><X size={20} /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Channel</label>
                <div className="grid grid-cols-4 gap-2">
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(126,168,201,0.1)', color: '#7EA8C9', border: '1px solid rgba(126,168,201,0.3)' }}><Smartphone size={18} />SMS</button>
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted, border: `1px solid ${theme.border.primary}` }}><MessageSquare size={18} />WhatsApp</button>
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted, border: `1px solid ${theme.border.primary}` }}><Mail size={18} />Email</button>
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted, border: `1px solid ${theme.border.primary}` }}><Users size={18} />All</button>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Recipients</label>
                <div className="flex gap-2">
                  <input placeholder="Enter phone numbers, customer names, or select a group..." className="flex-1 px-4 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} />
                  <button className="px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Browse</button>
                </div>
                <div className="flex gap-2 mt-2">
                  {['All Customers', 'Pending Pickups', 'Expiring Today', 'COD Pending'].map(grp => (
                    <button key={grp} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted }}>{grp}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Template (optional)</label>
                <select className="w-full px-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                  <option value="">Custom message (no template)</option>
                  {smsTemplatesData.map(t => <option key={t.id} value={t.id}>[{t.channel.toUpperCase()}] {t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Message</label>
                <textarea rows={5} placeholder="Type your message here... Use {customer}, {waybill}, {terminal}, {locker}, {code}, {eta} as variables." className="w-full px-4 py-3 rounded-xl border text-sm bg-transparent resize-none" style={{ borderColor: theme.border.primary, color: theme.text.primary }} />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs" style={{ color: theme.text.muted }}>0 / 160 characters (1 SMS segment)</span>
                  <span className="text-xs" style={{ color: theme.text.muted }}>Est. cost: GH₵ 0.00</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Schedule</label>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm" style={{ backgroundColor: 'rgba(129,201,149,0.1)', color: '#81C995', border: '1px solid rgba(129,201,149,0.3)' }}><Send size={16} />Send Now</button>
                  <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted, border: `1px solid ${theme.border.primary}` }}><Clock size={16} />Schedule Later</button>
                </div>
              </div>
            </div>
            <div className="p-5 border-t flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <button onClick={() => setComposeOpen(false)} className="px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
              <div className="flex gap-2">
                <button onClick={() => addToast({ type: 'info', message: 'Test message sent to your phone' })} className="px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Send Test</button>
                <button onClick={() => { addToast({ type: 'success', message: 'Message sent successfully!' }); setComposeOpen(false); }} className="px-6 py-2.5 rounded-xl text-sm" style={{ backgroundColor: '#81C995', color: '#1C1917' }}>Send Message</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedTemplate(null)}>
          <div className="w-full max-w-xl rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <div className="flex items-center gap-3">
                {selectedTemplate.channel === 'whatsapp' ? (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(129,201,149,0.1)' }}><MessageSquare size={20} style={{ color: '#81C995' }} /></div>
                ) : selectedTemplate.channel === 'email' ? (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(181,160,209,0.1)' }}><Mail size={20} style={{ color: '#B5A0D1' }} /></div>
                ) : (
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(126,168,201,0.1)' }}><Smartphone size={20} style={{ color: '#7EA8C9' }} /></div>
                )}
                <div>
                  <h2 className="font-semibold" style={{ color: theme.text.primary }}>{selectedTemplate.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-xs uppercase font-medium" style={{ backgroundColor: selectedTemplate.channel === 'whatsapp' ? 'rgba(129,201,149,0.1)' : selectedTemplate.channel === 'email' ? 'rgba(181,160,209,0.1)' : 'rgba(126,168,201,0.1)', color: selectedTemplate.channel === 'whatsapp' ? '#81C995' : selectedTemplate.channel === 'email' ? '#B5A0D1' : '#7EA8C9' }}>{selectedTemplate.channel}</span>
                    <span className="text-xs font-mono" style={{ color: theme.text.muted }}>{selectedTemplate.id}</span>
                    {selectedTemplate.active ? <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(129,201,149,0.1)', color: '#81C995' }}>Active</span> : <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(120,113,108,0.1)', color: '#78716C' }}>Inactive</span>}
                  </div>
                </div>
              </div>
              <button onClick={() => setSelectedTemplate(null)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><X size={20} /></button>
            </div>
            <div className="p-5 space-y-5">
              {/* Trigger Event */}
              <div>
                <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Trigger Event</label>
                <span className="px-3 py-1.5 rounded-lg text-sm font-mono" style={{ backgroundColor: 'rgba(212,170,90,0.1)', color: '#D4AA5A' }}>{selectedTemplate.event}</span>
              </div>

              {/* Message Preview */}
              <div>
                <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Message Preview</label>
                <div className="p-5 rounded-xl" style={{ backgroundColor: selectedTemplate.channel === 'whatsapp' ? 'rgba(129,201,149,0.05)' : selectedTemplate.channel === 'email' ? 'rgba(181,160,209,0.05)' : theme.bg.tertiary, border: selectedTemplate.channel === 'whatsapp' ? '1px solid rgba(129,201,149,0.2)' : selectedTemplate.channel === 'email' ? '1px solid rgba(181,160,209,0.2)' : `1px solid ${theme.border.primary}` }}>
                  {selectedTemplate.channel === 'whatsapp' && (
                    <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid rgba(129,201,149,0.15)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#81C995' }}><MessageSquare size={14} style={{ color: '#1C1917' }} /></div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: theme.text.primary }}>LocQar</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>WhatsApp Business</p>
                      </div>
                    </div>
                  )}
                  {selectedTemplate.channel === 'email' && (
                    <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid rgba(181,160,209,0.15)' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B5A0D1' }}><Mail size={14} style={{ color: '#1C1917' }} /></div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: theme.text.primary }}>LocQar</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>noreply@locqar.com</p>
                      </div>
                    </div>
                  )}
                  <pre className="text-sm whitespace-pre-wrap leading-relaxed" style={{ color: theme.text.secondary, fontFamily: theme.font.primary }}>{selectedTemplate.message}</pre>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-xl text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                  <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{selectedTemplate.sentCount.toLocaleString()}</p>
                  <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Total Sent</p>
                </div>
                <div className="p-4 rounded-xl text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                  <p className="text-2xl font-bold" style={{ color: '#81C995' }}>{selectedTemplate.deliveryRate}%</p>
                  <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Delivery Rate</p>
                </div>
                <div className="p-4 rounded-xl text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                  <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{selectedTemplate.lastSent}</p>
                  <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Last Sent</p>
                </div>
              </div>

              {/* Variables Used */}
              <div>
                <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Variables Used</label>
                <div className="flex flex-wrap gap-2">
                  {(selectedTemplate.message.match(/\{(\w+)\}/g) || []).map((v, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg text-xs font-mono" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary, border: `1px solid ${theme.accent.border}` }}>{v}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-5 border-t flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
              <button onClick={() => setSelectedTemplate(null)} className="px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Close</button>
              <div className="flex gap-2">
                <button onClick={() => { addToast({ type: 'info', message: `Test send: ${selectedTemplate.id}` }); }} className="px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: '#81C995' }}>Test Send</button>
                <button onClick={() => { addToast({ type: 'info', message: `Editing ${selectedTemplate.name}` }); setSelectedTemplate(null); }} className="px-4 py-2.5 rounded-xl text-sm" style={{ backgroundColor: '#81C995', color: '#1C1917' }}>Edit Template</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SLA Detail Modal */}
      {slaSelectedItem && (() => {
        const item = slaSelectedItem;
        const sev = SLA_SEVERITY[item.severity];
        const SevIcon = sev.icon;
        const tier = SLA_TIERS.find(t => t.name === item.slaType) || SLA_TIERS[0];
        const itemEscalations = escalationLog.filter(e => e.waybill === item.waybill).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const pctClamped = Math.min(item.pctUsed, 100);
        const circumference = 2 * Math.PI * 54;
        const strokeOffset = circumference - (pctClamped / 100) * circumference;
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSlaSelectedItem(null)}>
            <div className="w-full max-w-2xl rounded-2xl border overflow-hidden" onClick={e => e.stopPropagation()} style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
              {/* Header */}
              <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: sev.bg, color: sev.color }}>
                    <SevIcon size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold" style={{ color: theme.text.primary }}>{item.waybill}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: sev.bg, color: sev.color }}>{sev.label}</span>
                    </div>
                    <div className="text-sm" style={{ color: theme.text.muted }}>{item.customer} • {item.terminal}</div>
                  </div>
                </div>
                <button onClick={() => setSlaSelectedItem(null)} className="p-2 rounded-lg hover:bg-white/5"><X size={18} style={{ color: theme.icon.muted }} /></button>
              </div>

              <div className="p-5 space-y-5 max-h-[70vh] overflow-y-auto">
                {/* Progress Ring + Info Grid */}
                <div className="flex gap-6">
                  {/* SVG Progress Ring */}
                  <div className="flex-shrink-0 flex flex-col items-center">
                    <svg width="130" height="130" viewBox="0 0 130 130">
                      <circle cx="65" cy="65" r="54" fill="none" stroke={theme.border.primary} strokeWidth="8" />
                      <circle cx="65" cy="65" r="54" fill="none" stroke={sev.color} strokeWidth="8" strokeLinecap="round"
                        strokeDasharray={circumference} strokeDashoffset={strokeOffset}
                        transform="rotate(-90 65 65)" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                      <text x="65" y="58" textAnchor="middle" fill={sev.color} fontSize="22" fontWeight="bold">{item.pctUsed.toFixed(0)}%</text>
                      <text x="65" y="78" textAnchor="middle" fill={theme.text.muted} fontSize="11">SLA Used</text>
                    </svg>
                    <div className="mt-2 text-center">
                      <span className="text-lg">{tier.icon}</span>
                      <div className="text-xs font-medium mt-0.5" style={{ color: tier.color }}>{tier.name}</div>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-3">
                    {[
                      { label: 'SLA Tier', value: `${item.slaType} (${item.slaHours}h)` },
                      { label: 'Terminal', value: item.terminal },
                      { label: 'Agent', value: item.agent },
                      { label: 'Manager', value: item.manager || '—' },
                      { label: 'Created', value: item.createdAt },
                      { label: 'Deadline', value: item.deadline },
                      { label: 'Elapsed', value: `${item.elapsedHours}h of ${item.slaHours}h` },
                      { label: 'Remaining', value: item.remainingMin > 0 ? `${Math.floor(item.remainingMin / 60)}h ${item.remainingMin % 60}m` : `Overdue by ${Math.abs(item.remainingMin)}m` },
                    ].map((f, i) => (
                      <div key={i}>
                        <div className="text-xs" style={{ color: theme.text.muted }}>{f.label}</div>
                        <div className="text-sm font-medium" style={{ color: f.label === 'Remaining' && item.remainingMin <= 0 ? '#D48E8A' : theme.text.primary }}>{f.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer & Product */}
                <div className="p-3 rounded-xl grid grid-cols-3 gap-3" style={{ backgroundColor: theme.bg.tertiary }}>
                  <div>
                    <div className="text-xs" style={{ color: theme.text.muted }}>Phone</div>
                    <div className="text-sm font-medium" style={{ color: theme.text.primary }}>{item.phone}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: theme.text.muted }}>Product</div>
                    <div className="text-sm font-medium" style={{ color: theme.text.primary }}>{item.product}</div>
                  </div>
                  <div>
                    <div className="text-xs" style={{ color: theme.text.muted }}>Size</div>
                    <div className="text-sm font-medium" style={{ color: theme.text.primary }}>{item.size}</div>
                  </div>
                </div>

                {/* Last Action */}
                <div className="p-3 rounded-xl" style={{ backgroundColor: `${sev.color}10`, border: `1px solid ${sev.color}30` }}>
                  <div className="text-xs font-medium mb-1" style={{ color: sev.color }}>Last Action</div>
                  <div className="text-sm" style={{ color: theme.text.primary }}>{item.lastAction}</div>
                </div>

                {/* Escalation Timeline */}
                <div>
                  <div className="text-sm font-semibold mb-3" style={{ color: theme.text.primary }}>Escalation Timeline ({itemEscalations.length} events)</div>
                  {itemEscalations.length > 0 ? (
                    <div className="relative pl-6 space-y-0">
                      <div className="absolute left-[9px] top-2 bottom-2 w-0.5" style={{ backgroundColor: theme.border.primary }} />
                      {itemEscalations.map((evt, i) => {
                        const evtSev = SLA_SEVERITY[evt.severity] || SLA_SEVERITY.warning;
                        const rule = ESCALATION_RULES[evt.level] || ESCALATION_RULES[0];
                        return (
                          <div key={evt.id} className="relative pb-4">
                            <div className="absolute -left-6 top-1 w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center" style={{ backgroundColor: theme.bg.card, borderColor: evtSev.color }}>
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: evtSev.color }} />
                            </div>
                            <div className="ml-2 p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: rule.color + '20', color: rule.color }}>{`L${evt.level}`}</span>
                                  <span className="text-xs font-medium" style={{ color: theme.text.primary }}>{rule.name}</span>
                                  {evt.acked && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(129,201,149,0.1)', color: '#81C995' }}>Acked</span>}
                                </div>
                                <span className="text-xs" style={{ color: theme.text.muted }}>{evt.timestamp.split(' ')[1]}</span>
                              </div>
                              <div className="text-xs" style={{ color: theme.text.secondary }}>{evt.action}</div>
                              <div className="text-xs mt-1" style={{ color: theme.text.muted }}>By: {evt.by} ({evt.role})</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-sm" style={{ color: theme.text.muted }}>No escalation events yet — SLA is on track</div>
                  )}
                </div>
              </div>

              {/* Action Footer */}
              <div className="p-5 border-t flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                <button onClick={() => setSlaSelectedItem(null)} className="px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Close</button>
                <div className="flex gap-2 flex-wrap">
                  {!item.acknowledgedBy && (
                    <button onClick={() => { addToast({ type: 'success', message: `Acknowledged ${item.waybill}` }); setSlaSelectedItem(null); }} className="px-3 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: '#81C995', color: '#1C1917' }}>
                      <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> Acknowledge</span>
                    </button>
                  )}
                  {item.escalationLevel < 3 && (
                    <button onClick={() => { addToast({ type: 'warning', message: `Escalated ${item.waybill} to L${item.escalationLevel + 1}` }); setSlaSelectedItem(null); }} className="px-3 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: '#C49B6A', color: '#1C1917' }}>
                      <span className="flex items-center gap-1.5"><AlertTriangle size={14} /> Escalate to L{item.escalationLevel + 1}</span>
                    </button>
                  )}
                  <button onClick={() => { addToast({ type: 'info', message: `Reassigning agent for ${item.waybill}` }); }} className="px-3 py-2 rounded-xl border text-sm font-medium" style={{ borderColor: theme.border.primary, color: '#7EA8C9' }}>
                    <span className="flex items-center gap-1.5"><Users size={14} /> Reassign</span>
                  </button>
                  <button onClick={() => { addToast({ type: 'info', message: `SLA override requested for ${item.waybill}` }); }} className="px-3 py-2 rounded-xl border text-sm font-medium" style={{ borderColor: theme.border.primary, color: '#B5A0D1' }}>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> Override SLA</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Subscriber Detail Modal */}
      {subscriberDetailItem && (() => {
        const s = subscriberDetailItem;
        const plan = SUBSCRIPTION_PLANS.find(p => p.id === s.plan);
        const usagePct = plan && plan.deliveries > 0 ? Math.min(Math.round(s.deliveriesUsed / plan.deliveries * 100), 100) : s.deliveriesUsed > 0 ? 100 : 0;
        const circumference = 2 * Math.PI * 54;
        const strokeDashoffset = circumference - (usagePct / 100) * circumference;
        return (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-8 pb-8" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSubscriberDetailItem(null)}>
            <div className="w-full max-w-2xl max-h-full overflow-y-auto rounded-2xl border" style={{ backgroundColor: theme.bg.primary, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="p-6 border-b" style={{ borderColor: theme.border.primary }}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: plan?.color || theme.accent.primary, color: plan?.color ? '#fff' : theme.accent.contrast }}>{s.name.charAt(0)}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold" style={{ color: theme.text.primary }}>{s.name}</h3>
                        {s.verified ? <CheckCircle size={16} className="text-emerald-500" /> : <AlertTriangle size={16} className="text-amber-500" />}
                      </div>
                      <p className="text-sm" style={{ color: theme.text.muted }}>{s.university} &bull; {s.campus}</p>
                      <p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{s.studentId}</p>
                    </div>
                  </div>
                  <button onClick={() => setSubscriberDetailItem(null)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><X size={18} /></button>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                {/* Progress Ring + Info Grid */}
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <svg width="128" height="128" viewBox="0 0 128 128">
                      <circle cx="64" cy="64" r="54" fill="none" stroke={theme.border.primary} strokeWidth="8" />
                      <circle cx="64" cy="64" r="54" fill="none" stroke={plan?.color || theme.accent.primary} strokeWidth="8" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} transform="rotate(-90 64 64)" />
                      <text x="64" y="58" textAnchor="middle" fill={theme.text.primary} fontSize="20" fontWeight="bold">{usagePct}%</text>
                      <text x="64" y="76" textAnchor="middle" fill={theme.text.muted} fontSize="10">usage</text>
                    </svg>
                  </div>
                  <div className="flex-1 grid grid-cols-2 gap-3">
                    {[
                      ['Plan', plan?.name || '—'],
                      ['Price', `GH₵${plan?.price}/mo`],
                      ['Status', s.status],
                      ['Terminal', s.terminal],
                      ['Start Date', s.startDate],
                      ['Renewal Date', s.renewalDate],
                      ['Phone', s.phone],
                      ['Email', s.email],
                      ['Auto-Renew', s.autoRenew ? 'Enabled' : 'Disabled'],
                      ['Verified', s.verified ? 'Yes' : 'No'],
                    ].map(([label, val]) => (
                      <div key={label} className="p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{label}</p>
                        <p className="text-sm font-medium truncate" style={{ color: label === 'Status' ? (ALL_STATUSES[val]?.color || theme.text.primary) : theme.text.primary }}>{label === 'Status' ? (ALL_STATUSES[val]?.label || val) : val}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment History */}
                <div>
                  <h4 className="text-sm font-semibold mb-3" style={{ color: theme.text.primary }}>Payment History</h4>
                  <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: theme.bg.tertiary }}>
                          {['Date', 'Amount', 'Method', 'Status', 'Invoice'].map(h => (
                            <th key={h} className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(s.paymentHistory || []).map((p, i) => (
                          <tr key={i} style={{ borderTop: `1px solid ${theme.border.primary}` }}>
                            <td className="p-3 text-xs" style={{ color: theme.text.secondary }}>{p.date}</td>
                            <td className="p-3 text-xs font-mono font-semibold" style={{ color: theme.text.primary }}>GH₵{p.amount}</td>
                            <td className="p-3 text-xs" style={{ color: theme.text.secondary }}>{p.method}</td>
                            <td className="p-3"><StatusBadge status={p.status} /></td>
                            <td className="p-3 text-xs font-mono" style={{ color: theme.accent.primary }}>{p.invoiceId}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Delivery History */}
                <div>
                  <h4 className="text-sm font-semibold mb-3" style={{ color: theme.text.primary }}>Delivery History</h4>
                  <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
                    <table className="w-full">
                      <thead>
                        <tr style={{ backgroundColor: theme.bg.tertiary }}>
                          {['Date', 'Waybill', 'Terminal', 'Locker Size', 'Status'].map(h => (
                            <th key={h} className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {(s.deliveryLog || []).map((d, i) => (
                          <tr key={i} style={{ borderTop: `1px solid ${theme.border.primary}` }}>
                            <td className="p-3 text-xs" style={{ color: theme.text.secondary }}>{d.date}</td>
                            <td className="p-3 text-xs font-mono" style={{ color: theme.text.primary }}>{d.waybill}</td>
                            <td className="p-3 text-xs" style={{ color: theme.text.secondary }}>{d.terminal}</td>
                            <td className="p-3 text-xs" style={{ color: theme.text.secondary }}>{d.lockerSize}</td>
                            <td className="p-3"><StatusBadge status={d.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Internal Notes */}
                <div>
                  <h4 className="text-sm font-semibold mb-3" style={{ color: theme.text.primary }}>Internal Notes</h4>
                  <textarea
                    value={subscriberNotes[s.id] !== undefined ? subscriberNotes[s.id] : (s.notes || '')}
                    onChange={e => setSubscriberNotes(prev => ({ ...prev, [s.id]: e.target.value }))}
                    placeholder="Add internal notes about this subscriber..."
                    className="w-full p-3 rounded-xl border text-sm resize-none"
                    rows={3}
                    style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
                  />
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t flex flex-wrap gap-2 justify-end" style={{ borderColor: theme.border.primary }}>
                <button onClick={() => setSubscriberDetailItem(null)} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Close</button>
                <button onClick={() => { addToast({ type: 'info', message: `Upgrade initiated for ${s.name}` }); }} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: '#B5A0D1', color: '#1C1917' }}>Upgrade Plan</button>
                {s.status === 'active' ? (
                  <button onClick={() => { addToast({ type: 'warning', message: `${s.name} suspended` }); setSubscriberDetailItem(null); }} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: '#D48E8A', color: '#1C1917' }}>Suspend</button>
                ) : (
                  <button onClick={() => { addToast({ type: 'success', message: `${s.name} reactivated` }); setSubscriberDetailItem(null); }} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: '#81C995', color: '#1C1917' }}>Reactivate</button>
                )}
                <button onClick={() => addToast({ type: 'success', message: `Message sent to ${s.name}` })} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ backgroundColor: '#7EA8C9', color: '#1C1917' }}>Send Message</button>
                <button onClick={() => addToast({ type: 'success', message: `${s.name}'s data exported` })} className="px-4 py-2 rounded-xl text-sm font-medium border" style={{ borderColor: theme.border.primary, color: theme.text.primary }}>Export</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Add Subscriber Form Modal */}
      {showAddSubscriber && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setShowAddSubscriber(false)}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border" style={{ backgroundColor: theme.bg.primary, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b" style={{ borderColor: theme.border.primary }}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold" style={{ color: theme.text.primary }}>Add Subscriber</h3>
                <button onClick={() => setShowAddSubscriber(false)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><X size={18} /></button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {[['Name', 'Full student name'], ['Email', 'student@university.edu'], ['Phone', '+233...'], ['Student ID', 'e.g. UG/2024/001']].map(([label, placeholder]) => (
                <div key={label}>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>{label}</label>
                  <input placeholder={placeholder} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>University</label>
                <select className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}>
                  <option value="">Select university...</option>
                  {subscriberUniversities.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Campus</label>
                <input placeholder="e.g. Main Campus" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-2 block" style={{ color: theme.text.secondary }}>Plan</label>
                <div className="grid grid-cols-2 gap-3">
                  {SUBSCRIPTION_PLANS.map(p => (
                    <label key={p.id} className="p-3 rounded-xl border cursor-pointer hover:border-current transition-all" style={{ borderColor: theme.border.primary }}>
                      <input type="radio" name="subPlan" value={p.id} className="hidden peer" />
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.color }} />
                        <span className="text-sm font-semibold" style={{ color: theme.text.primary }}>{p.name}</span>
                      </div>
                      <p className="text-xs font-mono" style={{ color: p.color }}>GH₵{p.price}/mo</p>
                      <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{p.description}</p>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Terminal</label>
                <select className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}>
                  <option value="">Select terminal...</option>
                  {terminalsData.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                <div>
                  <p className="text-sm font-medium" style={{ color: theme.text.primary }}>Auto-Renew</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>Automatically renew subscription</p>
                </div>
                <button className="w-12 h-6 rounded-full p-0.5 transition-all" style={{ backgroundColor: '#81C995' }}>
                  <div className="w-5 h-5 rounded-full bg-white transform translate-x-6 transition-transform" />
                </button>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3" style={{ borderColor: theme.border.primary }}>
              <button onClick={() => setShowAddSubscriber(false)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
              <button onClick={() => { addToast({ type: 'success', message: 'New subscriber added successfully!' }); setShowAddSubscriber(false); }} className="px-4 py-2.5 rounded-xl text-sm font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>Add Subscriber</button>
            </div>
          </div>
        </div>
      )}

      <SessionTimeoutModal isOpen={showSessionWarning} onExtend={() => { setShowSessionWarning(false); setSessionTimeout(60); }} onLogout={() => addToast({ type: 'info', message: 'Logging out...' })} remainingTime={sessionTimeout} />

      {!(activeMenu === 'customers' && activeSubMenu === 'Subscribers') && (
        <BulkActionsBar
          selectedCount={selectedItems.length}
          onClear={() => setSelectedItems([])}
          onAction={handleBulkAction}
          actions={[
            { id: 'dispatch', label: 'Dispatch Selected', icon: Truck, color: '#7EA8C9' },
            { id: 'markDelivered', label: 'Mark Delivered', icon: CheckCircle2, color: '#81C995' },
            { id: 'export', label: 'Export Selected', icon: FileDown, color: '#B5A0D1' },
            { id: 'print', label: 'Print Labels', icon: Printer, color: '#D4AA5A' },
            { id: 'delete', label: 'Delete Selected', icon: Trash2, color: '#D48E8A' },
          ]}
        />
      )}
      <BulkActionsBar
        selectedCount={selectedSubscribers.length}
        onClear={() => setSelectedSubscribers([])}
        onAction={handleSubscriberBulkAction}
        actions={[
          { id: 'message', label: 'Send Message', icon: MessageSquare, color: '#7EA8C9' },
          { id: 'export', label: 'Export Selected', icon: FileDown, color: '#B5A0D1' },
          { id: 'changePlan', label: 'Change Plan', icon: ArrowUpRight, color: '#D4AA5A' },
          { id: 'suspend', label: 'Suspend Selected', icon: Lock, color: '#D48E8A' },
        ]}
      />

      <ConfirmDialog
        isOpen={!!confirmDialog}
        onClose={() => setConfirmDialog(null)}
        onConfirm={() => { confirmDialog?.onConfirm?.(); setConfirmDialog(null); }}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        variant={confirmDialog?.variant || 'danger'}
        confirmLabel={confirmDialog?.confirmLabel}
        cancelLabel={confirmDialog?.cancelLabel}
      />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
}

// Error boundary to surface crashes instead of blank screen
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace', color: '#f87171', background: '#0A0A0A', minHeight: '100vh' }}>
          <h2 style={{ color: '#fbbf24', marginBottom: 16 }}>LocQar Admin — Startup Error</h2>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 13 }}>{String(this.state.error)}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', fontSize: 11, color: '#9ca3af', marginTop: 16 }}>{this.state.error?.stack}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

// Legacy admin shell. ThemeProvider is now mounted by src/app/providers.tsx
// (single source of truth for the whole app, including /login). Kept inline
// ErrorBoundary for runtime safety.
export default function LegacyAdminShell() {
  return (
    <ErrorBoundary>
      <LocQarERPInner />
    </ErrorBoundary>
  );
}
