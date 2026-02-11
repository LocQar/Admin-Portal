import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard, Package, Users, Settings, ChevronDown, ChevronRight, Search, Truck, MapPin, DollarSign, Box, Bell, Plus, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertTriangle, Filter, Download, Eye, Edit, Trash2, RefreshCw, TrendingUp, Calendar, ChevronLeft, X, QrCode, Building2, UserCheck, PackageX, Timer, Grid3X3, Sun, Moon, Shield, Key, Lock, Unlock, UserPlus, Phone, MessageSquare, Send, Printer, Banknote, Battery, BatteryWarning, Thermometer, Scan, Home, Warehouse, Circle, CheckCircle, Inbox, Route, Car, Wrench, Cog, Briefcase, Users2, Award, Ticket, Receipt, CreditCard, FileText, Command, Keyboard, Check, Info, AlertOctagon, XCircle, ChevronFirst, ChevronLast, MoreHorizontal, FileDown, Loader2, Menu, Smartphone, LogOut, History, Mail } from 'lucide-react';

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
} from './pages';

// ============ MODAL COMPONENTS ============
import {
  GlobalSearchModal,
  ShortcutsModal,
  SessionTimeoutModal,
  ExportModal,
  ReassignModal,
  ReturnModal,
} from './components/modals';

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
} from './constants/mockData';

// ============ CONTEXT ============
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
const ToastContext = createContext();


// ============ ROLES & PERMISSIONS ============

const ROLES = {
  SUPER_ADMIN: { id: 'super_admin', name: 'Super Admin', level: 100, color: '#FF6B58', permissions: ['*'] },
  ADMIN: { id: 'admin', name: 'Administrator', level: 80, color: '#f59e0b', permissions: ['dashboard.*', 'packages.*', 'lockers.*', 'dropbox.*', 'terminals.*', 'customers.*', 'staff.*', 'reports.*', 'dispatch.*', 'accounting.*'] },
  MANAGER: { id: 'manager', name: 'Branch Manager', level: 60, color: '#3b82f6', permissions: ['dashboard.view', 'packages.*', 'dropbox.*', 'lockers.*', 'terminals.view', 'customers.*', 'staff.view', 'reports.view', 'dispatch.*'] },
  AGENT: { id: 'agent', name: 'Field Agent', level: 40, color: '#10b981', permissions: ['dashboard.view', 'packages.view', 'packages.scan', 'packages.receive', 'dropbox.view', 'dropbox.collect', 'lockers.view', 'lockers.open', 'dispatch.view'] },
  SUPPORT: { id: 'support', name: 'Support', level: 30, color: '#8b5cf6', permissions: ['dashboard.view', 'packages.view', 'packages.track', 'customers.*', 'tickets.*'] },
  VIEWER: { id: 'viewer', name: 'View Only', level: 10, color: '#6b7280', permissions: ['dashboard.view', 'packages.view', 'lockers.view'] },
};

const hasPermission = (userRole, permission) => {
  const role = ROLES[userRole];
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
  warehouse_to_locker: { id: 'warehouse_to_locker', label: 'Warehouse → Locker', icon: Warehouse, color: '#3b82f6' },
  dropbox_to_locker: { id: 'dropbox_to_locker', label: 'Dropbox → Locker', icon: Inbox, color: '#8b5cf6' },
  locker_to_home: { id: 'locker_to_home', label: 'Locker → Home', icon: Home, color: '#10b981' },
};

const PACKAGE_STATUSES = {
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

const ALL_STATUSES = {
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

// ============ SAMPLE DATA ============
const terminalData = [
  { month: 'Jan', accra: 600, achimota: 450, kotoka: 300 },
  { month: 'Feb', accra: 750, achimota: 500, kotoka: 350 },
  { month: 'Mar', accra: 680, achimota: 800, kotoka: 400 },
  { month: 'Apr', accra: 900, achimota: 700, kotoka: 380 },
  { month: 'May', accra: 720, achimota: 950, kotoka: 420 },
  { month: 'Jun', accra: 800, achimota: 600, kotoka: 350 },
];

const hourlyData = [
  { hour: '6AM', packages: 12 }, { hour: '8AM', packages: 45 }, { hour: '10AM', packages: 78 },
  { hour: '12PM', packages: 92 }, { hour: '2PM', packages: 85 }, { hour: '4PM', packages: 110 },
  { hour: '6PM', packages: 95 }, { hour: '8PM', packages: 42 }, { hour: '10PM', packages: 18 },
];

const packagesData = [
  { id: 1, waybill: 'LQ-2024-00001', customer: 'Joe Doe', phone: '+233551399333', email: 'joe@email.com', destination: 'Achimota Mall', locker: 'A-15', size: 'Medium', status: 'delivered_to_locker', deliveryMethod: 'warehouse_to_locker', product: "Pick 'N' Go", daysInLocker: 2, value: 450, cod: true, weight: '2.5kg', createdAt: '2024-01-15 08:30' },
  { id: 2, waybill: 'LQ-2024-00002', customer: 'Jane Doe', phone: '+233557821456', email: 'jane@email.com', destination: 'Accra Mall', locker: 'B-08', size: 'Large', status: 'in_transit_to_locker', deliveryMethod: 'dropbox_to_locker', product: 'Dropbox Express', daysInLocker: 0, value: 320, cod: false, weight: '5.2kg', createdAt: '2024-01-15 09:15' },
  { id: 3, waybill: 'LQ-2024-00003', customer: 'Michael Mensah', phone: '+233549876321', email: 'michael@email.com', destination: 'Dome', locker: '-', size: 'Small', status: 'delivered_to_home', deliveryMethod: 'locker_to_home', product: 'Home Delivery', daysInLocker: 0, value: 180, cod: false, weight: '0.8kg', createdAt: '2024-01-14 14:20' },
  { id: 4, waybill: 'LQ-2024-00004', customer: 'Sarah Asante', phone: '+233551234567', email: 'sarah@email.com', destination: 'Kotoka T3', locker: 'K-22', size: 'Medium', status: 'delivered_to_locker', deliveryMethod: 'warehouse_to_locker', product: 'Airport Pickup', daysInLocker: 1, value: 890, cod: true, weight: '3.1kg', createdAt: '2024-01-15 07:45' },
  { id: 5, waybill: 'LQ-2024-00005', customer: 'Kwame Boateng', phone: '+233559876543', email: 'kwame@email.com', destination: 'Achimota Mall', locker: 'A-03', size: 'XLarge', status: 'expired', deliveryMethod: 'warehouse_to_locker', product: "Pick 'N' Go", daysInLocker: 7, value: 275, cod: false, weight: '8.5kg', createdAt: '2024-01-08 10:00' },
  { id: 6, waybill: 'LQ-2024-00006', customer: 'Ama Serwaa', phone: '+233542345678', email: 'ama@email.com', destination: 'Accra Mall', locker: '-', size: 'Small', status: 'at_warehouse', deliveryMethod: 'warehouse_to_locker', product: 'Standard', daysInLocker: 0, value: 150, cod: true, weight: '1.2kg', createdAt: '2024-01-15 11:30' },
  { id: 7, waybill: 'LQ-2024-00007', customer: 'Kofi Mensah', phone: '+233551112222', email: 'kofi@email.com', destination: 'West Hills', locker: '-', size: 'Medium', status: 'pending', deliveryMethod: 'dropbox_to_locker', product: 'Dropbox Express', daysInLocker: 0, value: 220, cod: false, weight: '2.0kg', createdAt: '2024-01-15 12:00' },
  { id: 8, waybill: 'LQ-2024-00008', customer: 'Efua Owusu', phone: '+233553334444', email: 'efua@email.com', destination: 'Tema', locker: '-', size: 'Large', status: 'in_transit_to_home', deliveryMethod: 'locker_to_home', product: 'Home Delivery', daysInLocker: 0, value: 550, cod: true, weight: '6.5kg', createdAt: '2024-01-15 06:30' },
  { id: 9, waybill: 'LQ-2024-00009', customer: 'Yaw Asiedu', phone: '+233555556666', email: 'yaw@email.com', destination: 'Achimota Mall', locker: '-', size: 'Small', status: 'at_dropbox', deliveryMethod: 'dropbox_to_locker', product: 'Dropbox Express', daysInLocker: 0, value: 95, cod: false, weight: '0.5kg', createdAt: '2024-01-15 13:45' },
  { id: 10, waybill: 'LQ-2024-00010', customer: 'Akosua Mensah', phone: '+233557778888', email: 'akosua@email.com', destination: 'Junction Mall', locker: 'J-05', size: 'Medium', status: 'delivered_to_locker', deliveryMethod: 'warehouse_to_locker', product: 'Standard', daysInLocker: 3, value: 340, cod: false, weight: '2.8kg', createdAt: '2024-01-12 09:00' },
];

const lockersData = [
  { id: 'A-01', terminal: 'Achimota Mall', size: 'Small', status: 'available', temp: 24, battery: 95 },
  { id: 'A-15', terminal: 'Achimota Mall', size: 'Medium', status: 'occupied', temp: 25, battery: 91, package: 'LQ-2024-00001' },
  { id: 'A-20', terminal: 'Achimota Mall', size: 'Large', status: 'maintenance', temp: null, battery: 15 },
  { id: 'B-01', terminal: 'Accra Mall', size: 'Small', status: 'available', temp: 23, battery: 98 },
  { id: 'B-08', terminal: 'Accra Mall', size: 'Large', status: 'reserved', temp: 24, battery: 85 },
  { id: 'K-22', terminal: 'Kotoka T3', size: 'Medium', status: 'occupied', temp: 22, battery: 90, package: 'LQ-2024-00004' },
  { id: 'A-03', terminal: 'Achimota Mall', size: 'XLarge', status: 'occupied', temp: 24, battery: 88, package: 'LQ-2024-00005' },
  { id: 'J-05', terminal: 'Junction Mall', size: 'Medium', status: 'occupied', temp: 23, battery: 92, package: 'LQ-2024-00010' },
];

const terminalsData = [
  { id: 'TRM-001', name: 'Achimota Mall', location: 'Achimota', region: 'Greater Accra', city: 'Achimota', totalLockers: 120, available: 45, occupied: 68, maintenance: 7, status: 'online', lat: 5.6145, lng: -0.2270 },
  { id: 'TRM-002', name: 'Accra Mall', location: 'Tetteh Quarshie', region: 'Greater Accra', city: 'Accra', totalLockers: 85, available: 32, occupied: 50, maintenance: 3, status: 'online', lat: 5.6280, lng: -0.1750 },
  { id: 'TRM-003', name: 'Kotoka T3', location: 'Airport', region: 'Greater Accra', city: 'Airport', totalLockers: 70, available: 28, occupied: 40, maintenance: 2, status: 'online', lat: 5.6052, lng: -0.1668 },
  { id: 'TRM-004', name: 'West Hills Mall', location: 'Weija', region: 'Greater Accra', city: 'Weija', totalLockers: 60, available: 20, occupied: 35, maintenance: 5, status: 'maintenance', lat: 5.5580, lng: -0.3150 },
  { id: 'TRM-005', name: 'Junction Mall', location: 'Nungua', region: 'Greater Accra', city: 'Nungua', totalLockers: 50, available: 18, occupied: 30, maintenance: 2, status: 'online', lat: 5.5920, lng: -0.0780 },
];

// LocQar Address System: GHA-GRT-ACC-LQ015
// Format: [Country 3]-[Region 3]-[City 3]-[Locker ID]
const getTerminalAddress = (terminal) => {
  const city = (terminal.city || terminal.location).substring(0, 3).toUpperCase();
  const num = terminal.id.replace('TRM-', '');
  return `${city}-LQ${num}`;
};

const getLockerAddress = (lockerId, terminalName) => {
  const terminal = terminalsData.find(t => t.name === terminalName);
  if (!terminal) return null;
  const city = (terminal.city || terminal.location).substring(0, 3).toUpperCase();
  const num = lockerId.replace(/[A-Z]-/i, '').padStart(3, '0');
  return `${city}-LQ${num}`;
};

// Phone-to-Locker Pinning: customers pin their phone to their preferred locker location
const phonePinData = [
  { phone: '+233551399333', customer: 'Joe Doe', pinnedTerminal: 'Achimota Mall', pinnedAddress: 'ACH-LQ001', pinnedAt: '2024-01-10' },
  { phone: '+233557821456', customer: 'Jane Doe', pinnedTerminal: 'Accra Mall', pinnedAddress: 'ACC-LQ002', pinnedAt: '2024-01-12' },
  { phone: '+233549876321', customer: 'Michael Mensah', pinnedTerminal: 'Achimota Mall', pinnedAddress: 'ACH-LQ001', pinnedAt: '2023-12-05' },
  { phone: '+233551234567', customer: 'Sarah Asante', pinnedTerminal: 'Kotoka T3', pinnedAddress: 'AIR-LQ003', pinnedAt: '2024-01-08' },
  { phone: '+233559876543', customer: 'Kwame Boateng', pinnedTerminal: 'Achimota Mall', pinnedAddress: 'ACH-LQ001', pinnedAt: '2023-11-20' },
  { phone: '+233542345678', customer: 'Ama Serwaa', pinnedTerminal: 'Accra Mall', pinnedAddress: 'ACC-LQ002', pinnedAt: '2024-01-14' },
  { phone: '+233551112222', customer: 'Kofi Mensah', pinnedTerminal: 'West Hills Mall', pinnedAddress: 'WEI-LQ004', pinnedAt: '2024-01-03' },
  { phone: '+233553334444', customer: 'Efua Owusu', pinnedTerminal: 'Junction Mall', pinnedAddress: 'NUN-LQ005', pinnedAt: '2023-12-18' },
];

const customersData = [
  { id: 1, name: 'Joe Doe', email: 'joe@email.com', phone: '+233551399333', type: 'individual', totalOrders: 15, totalSpent: 2450, status: 'active', joined: '2023-06-15' },
  { id: 2, name: 'Jane Doe', email: 'jane@email.com', phone: '+233557821456', type: 'individual', totalOrders: 8, totalSpent: 1280, status: 'active', joined: '2023-08-22' },
  { id: 3, name: 'Jumia Ghana', email: 'logistics@jumia.com.gh', phone: '+233302123456', type: 'b2b', totalOrders: 450, totalSpent: 45000, status: 'active', joined: '2023-01-10' },
  { id: 4, name: 'Melcom Ltd', email: 'shipping@melcom.com', phone: '+233302654321', type: 'b2b', totalOrders: 280, totalSpent: 32000, status: 'active', joined: '2023-02-15' },
  { id: 5, name: 'Michael Mensah', email: 'michael@email.com', phone: '+233549876321', type: 'individual', totalOrders: 5, totalSpent: 890, status: 'active', joined: '2023-10-01' },
];

const SUBSCRIPTION_PLANS = [
  { id: 'PLAN-BASIC', name: 'Basic', price: 25, period: 'month', deliveries: 5, lockerAccess: 'standard', color: '#6b7280', description: '5 deliveries/mo, standard lockers' },
  { id: 'PLAN-STD', name: 'Standard', price: 45, period: 'month', deliveries: 15, lockerAccess: 'standard', color: '#3b82f6', description: '15 deliveries/mo, standard lockers' },
  { id: 'PLAN-PREM', name: 'Premium', price: 75, period: 'month', deliveries: 40, lockerAccess: 'priority', color: '#8b5cf6', description: '40 deliveries/mo, priority lockers' },
  { id: 'PLAN-UNLIM', name: 'Unlimited', price: 120, period: 'month', deliveries: -1, lockerAccess: 'priority', color: '#f59e0b', description: 'Unlimited deliveries, priority lockers' },
];

const subscribersData = [
  { id: 'SUB-001', name: 'Kwame Asante', email: 'kwame.asante@ug.edu.gh', phone: '+233551234001', university: 'University of Ghana', campus: 'Legon', studentId: 'UG-10458723', plan: 'PLAN-STD', status: 'active', startDate: '2024-09-01', renewalDate: '2025-03-01', deliveriesUsed: 12, terminal: 'Achimota Mall', lastDelivery: '2025-01-10', verified: true, autoRenew: true, notes: 'Regular user, prefers Achimota Mall terminal.',
    paymentHistory: [
      { date: '2025-01-01', amount: 45, method: 'Mobile Money', status: 'completed', invoiceId: 'INV-S001-01' },
      { date: '2024-12-01', amount: 45, method: 'Mobile Money', status: 'completed', invoiceId: 'INV-S001-02' },
      { date: '2024-11-01', amount: 45, method: 'Card', status: 'completed', invoiceId: 'INV-S001-03' },
      { date: '2024-10-01', amount: 45, method: 'Card', status: 'completed', invoiceId: 'INV-S001-04' },
    ],
    deliveryLog: [
      { date: '2025-01-10', waybill: 'LQ-2025-00112', terminal: 'Achimota Mall', status: 'picked_up', lockerSize: 'Medium' },
      { date: '2025-01-05', waybill: 'LQ-2025-00098', terminal: 'Achimota Mall', status: 'picked_up', lockerSize: 'Small' },
      { date: '2024-12-28', waybill: 'LQ-2024-00987', terminal: 'Achimota Mall', status: 'picked_up', lockerSize: 'Large' },
      { date: '2024-12-20', waybill: 'LQ-2024-00945', terminal: 'Achimota Mall', status: 'expired', lockerSize: 'Small' },
    ],
  },
  { id: 'SUB-002', name: 'Ama Serwaa', email: 'ama.serwaa@knust.edu.gh', phone: '+233557891002', university: 'KNUST', campus: 'Main Campus', studentId: 'KN-20234891', plan: 'PLAN-PREM', status: 'active', startDate: '2024-08-15', renewalDate: '2025-02-15', deliveriesUsed: 34, terminal: 'Kotoka T3', lastDelivery: '2025-01-14', verified: true, autoRenew: true, notes: 'High-volume user. Contacts support frequently about locker sizes.',
    paymentHistory: [
      { date: '2025-01-15', amount: 75, method: 'Card', status: 'completed', invoiceId: 'INV-S002-01' },
      { date: '2024-12-15', amount: 75, method: 'Card', status: 'completed', invoiceId: 'INV-S002-02' },
      { date: '2024-11-15', amount: 75, method: 'Mobile Money', status: 'completed', invoiceId: 'INV-S002-03' },
      { date: '2024-10-15', amount: 75, method: 'Mobile Money', status: 'completed', invoiceId: 'INV-S002-04' },
      { date: '2024-09-15', amount: 75, method: 'Card', status: 'completed', invoiceId: 'INV-S002-05' },
    ],
    deliveryLog: [
      { date: '2025-01-14', waybill: 'LQ-2025-00145', terminal: 'Kotoka T3', status: 'picked_up', lockerSize: 'Large' },
      { date: '2025-01-09', waybill: 'LQ-2025-00101', terminal: 'Kotoka T3', status: 'picked_up', lockerSize: 'Medium' },
      { date: '2025-01-03', waybill: 'LQ-2025-00067', terminal: 'Kotoka T3', status: 'picked_up', lockerSize: 'Small' },
      { date: '2024-12-22', waybill: 'LQ-2024-00956', terminal: 'Kotoka T3', status: 'delivered_to_locker', lockerSize: 'Medium' },
      { date: '2024-12-10', waybill: 'LQ-2024-00890', terminal: 'Accra Mall', status: 'picked_up', lockerSize: 'Large' },
    ],
  },
  { id: 'SUB-003', name: 'Yaw Mensah', email: 'yaw.mensah@ucc.edu.gh', phone: '+233549876003', university: 'University of Cape Coast', campus: 'North Campus', studentId: 'UCC-30127845', plan: 'PLAN-BASIC', status: 'active', startDate: '2024-10-01', renewalDate: '2025-04-01', deliveriesUsed: 3, terminal: 'West Hills Mall', lastDelivery: '2024-12-20', verified: true, autoRenew: true, notes: 'Low usage. Consider outreach for engagement.',
    paymentHistory: [
      { date: '2025-01-01', amount: 25, method: 'Mobile Money', status: 'completed', invoiceId: 'INV-S003-01' },
      { date: '2024-12-01', amount: 25, method: 'Mobile Money', status: 'completed', invoiceId: 'INV-S003-02' },
      { date: '2024-11-01', amount: 25, method: 'Mobile Money', status: 'completed', invoiceId: 'INV-S003-03' },
    ],
    deliveryLog: [
      { date: '2024-12-20', waybill: 'LQ-2024-00934', terminal: 'West Hills Mall', status: 'picked_up', lockerSize: 'Small' },
      { date: '2024-11-15', waybill: 'LQ-2024-00812', terminal: 'West Hills Mall', status: 'picked_up', lockerSize: 'Small' },
      { date: '2024-10-28', waybill: 'LQ-2024-00723', terminal: 'West Hills Mall', status: 'picked_up', lockerSize: 'Medium' },
    ],
  },
  { id: 'SUB-004', name: 'Efua Owusu', email: 'efua.owusu@ug.edu.gh', phone: '+233558234004', university: 'University of Ghana', campus: 'City Campus', studentId: 'UG-10567234', plan: 'PLAN-UNLIM', status: 'active', startDate: '2024-07-01', renewalDate: '2025-01-01', deliveriesUsed: 67, terminal: 'Accra Mall', lastDelivery: '2025-01-15', verified: true, autoRenew: true, notes: 'Power user. Unlimited plan since July. Excellent retention.',
    paymentHistory: [
      { date: '2025-01-01', amount: 120, method: 'Bank Transfer', status: 'completed', invoiceId: 'INV-S004-01' },
      { date: '2024-12-01', amount: 120, method: 'Bank Transfer', status: 'completed', invoiceId: 'INV-S004-02' },
      { date: '2024-11-01', amount: 120, method: 'Card', status: 'completed', invoiceId: 'INV-S004-03' },
      { date: '2024-10-01', amount: 120, method: 'Card', status: 'completed', invoiceId: 'INV-S004-04' },
      { date: '2024-09-01', amount: 120, method: 'Bank Transfer', status: 'completed', invoiceId: 'INV-S004-05' },
    ],
    deliveryLog: [
      { date: '2025-01-15', waybill: 'LQ-2025-00178', terminal: 'Accra Mall', status: 'picked_up', lockerSize: 'Large' },
      { date: '2025-01-12', waybill: 'LQ-2025-00156', terminal: 'Accra Mall', status: 'picked_up', lockerSize: 'Medium' },
      { date: '2025-01-08', waybill: 'LQ-2025-00089', terminal: 'Accra Mall', status: 'picked_up', lockerSize: 'Small' },
      { date: '2025-01-02', waybill: 'LQ-2025-00034', terminal: 'Accra Mall', status: 'picked_up', lockerSize: 'XLarge' },
    ],
  },
  { id: 'SUB-005', name: 'Kofi Appiah', email: 'kofi.appiah@ashesi.edu.gh', phone: '+233542345005', university: 'Ashesi University', campus: 'Berekuso', studentId: 'ASH-40289156', plan: 'PLAN-STD', status: 'expired', startDate: '2024-06-01', renewalDate: '2024-12-01', deliveriesUsed: 15, terminal: 'Junction Mall', lastDelivery: '2024-11-28', verified: true, autoRenew: false, notes: 'Subscription expired Dec 2024. Last payment failed. Needs follow-up.',
    paymentHistory: [
      { date: '2024-12-01', amount: 45, method: 'Card', status: 'failed', invoiceId: 'INV-S005-01' },
      { date: '2024-11-01', amount: 45, method: 'Card', status: 'completed', invoiceId: 'INV-S005-02' },
      { date: '2024-10-01', amount: 45, method: 'Card', status: 'completed', invoiceId: 'INV-S005-03' },
      { date: '2024-09-01', amount: 45, method: 'Mobile Money', status: 'completed', invoiceId: 'INV-S005-04' },
    ],
    deliveryLog: [
      { date: '2024-11-28', waybill: 'LQ-2024-00867', terminal: 'Junction Mall', status: 'picked_up', lockerSize: 'Medium' },
      { date: '2024-11-10', waybill: 'LQ-2024-00789', terminal: 'Junction Mall', status: 'picked_up', lockerSize: 'Small' },
      { date: '2024-10-20', waybill: 'LQ-2024-00678', terminal: 'Junction Mall', status: 'expired', lockerSize: 'Medium' },
    ],
  },
  { id: 'SUB-006', name: 'Abena Darkwa', email: 'abena.darkwa@gimpa.edu.gh', phone: '+233551678006', university: 'GIMPA', campus: 'Greenhill', studentId: 'GIM-50345672', plan: 'PLAN-PREM', status: 'active', startDate: '2024-09-15', renewalDate: '2025-03-15', deliveriesUsed: 28, terminal: 'Achimota Mall', lastDelivery: '2025-01-12', verified: true, autoRenew: true, notes: 'GIMPA business student. Often receives textbooks.',
    paymentHistory: [
      { date: '2025-01-15', amount: 75, method: 'Mobile Money', status: 'completed', invoiceId: 'INV-S006-01' },
      { date: '2024-12-15', amount: 75, method: 'Mobile Money', status: 'completed', invoiceId: 'INV-S006-02' },
      { date: '2024-11-15', amount: 75, method: 'Card', status: 'completed', invoiceId: 'INV-S006-03' },
      { date: '2024-10-15', amount: 75, method: 'Card', status: 'completed', invoiceId: 'INV-S006-04' },
    ],
    deliveryLog: [
      { date: '2025-01-12', waybill: 'LQ-2025-00134', terminal: 'Achimota Mall', status: 'picked_up', lockerSize: 'Large' },
      { date: '2025-01-04', waybill: 'LQ-2025-00056', terminal: 'Achimota Mall', status: 'picked_up', lockerSize: 'Medium' },
      { date: '2024-12-18', waybill: 'LQ-2024-00912', terminal: 'Achimota Mall', status: 'picked_up', lockerSize: 'Large' },
    ],
  },
  { id: 'SUB-007', name: 'Kweku Boateng', email: 'kweku.b@uew.edu.gh', phone: '+233549012007', university: 'University of Education, Winneba', campus: 'North Campus', studentId: 'UEW-60478923', plan: 'PLAN-BASIC', status: 'suspended', startDate: '2024-08-01', renewalDate: '2025-02-01', deliveriesUsed: 5, terminal: 'Tema', lastDelivery: '2024-10-15', verified: false, autoRenew: false, notes: 'Suspended due to disputed payment. Student ID unverified. Awaiting documents.',
    paymentHistory: [
      { date: '2024-11-01', amount: 25, method: 'Mobile Money', status: 'refunded', invoiceId: 'INV-S007-01' },
      { date: '2024-10-01', amount: 25, method: 'Mobile Money', status: 'completed', invoiceId: 'INV-S007-02' },
      { date: '2024-09-01', amount: 25, method: 'Mobile Money', status: 'completed', invoiceId: 'INV-S007-03' },
    ],
    deliveryLog: [
      { date: '2024-10-15', waybill: 'LQ-2024-00690', terminal: 'Tema', status: 'picked_up', lockerSize: 'Small' },
      { date: '2024-09-20', waybill: 'LQ-2024-00578', terminal: 'Tema', status: 'picked_up', lockerSize: 'Small' },
    ],
  },
  { id: 'SUB-008', name: 'Adwoa Frimpong', email: 'adwoa.f@knust.edu.gh', phone: '+233557345008', university: 'KNUST', campus: 'Main Campus', studentId: 'KN-20567834', plan: 'PLAN-STD', status: 'active', startDate: '2024-10-15', renewalDate: '2025-04-15', deliveriesUsed: 9, terminal: 'Kotoka T3', lastDelivery: '2025-01-08', verified: true, autoRenew: true, notes: 'Roommate of Ama Serwaa. Referred by SUB-002.',
    paymentHistory: [
      { date: '2025-01-15', amount: 45, method: 'Card', status: 'completed', invoiceId: 'INV-S008-01' },
      { date: '2024-12-15', amount: 45, method: 'Card', status: 'completed', invoiceId: 'INV-S008-02' },
      { date: '2024-11-15', amount: 45, method: 'Card', status: 'completed', invoiceId: 'INV-S008-03' },
    ],
    deliveryLog: [
      { date: '2025-01-08', waybill: 'LQ-2025-00078', terminal: 'Kotoka T3', status: 'picked_up', lockerSize: 'Medium' },
      { date: '2024-12-15', waybill: 'LQ-2024-00878', terminal: 'Kotoka T3', status: 'picked_up', lockerSize: 'Small' },
      { date: '2024-11-22', waybill: 'LQ-2024-00801', terminal: 'Kotoka T3', status: 'picked_up', lockerSize: 'Medium' },
    ],
  },
  { id: 'SUB-009', name: 'Nana Agyei', email: 'nana.agyei@ug.edu.gh', phone: '+233553456009', university: 'University of Ghana', campus: 'Legon', studentId: 'UG-10623478', plan: 'PLAN-PREM', status: 'pending', startDate: '2025-02-01', renewalDate: '2025-08-01', deliveriesUsed: 0, terminal: 'Accra Mall', lastDelivery: null, verified: false, autoRenew: true, notes: 'New application. Awaiting student ID verification.',
    paymentHistory: [
      { date: '2025-01-28', amount: 75, method: 'Mobile Money', status: 'pending', invoiceId: 'INV-S009-01' },
    ],
    deliveryLog: [],
  },
  { id: 'SUB-010', name: 'Akua Mensah', email: 'akua.m@ucc.edu.gh', phone: '+233548901010', university: 'University of Cape Coast', campus: 'South Campus', studentId: 'UCC-30234567', plan: 'PLAN-UNLIM', status: 'active', startDate: '2024-09-01', renewalDate: '2025-03-01', deliveriesUsed: 52, terminal: 'West Hills Mall', lastDelivery: '2025-01-13', verified: true, autoRenew: true, notes: 'Active Unlimited subscriber. Uses multiple terminals.',
    paymentHistory: [
      { date: '2025-01-01', amount: 120, method: 'Bank Transfer', status: 'completed', invoiceId: 'INV-S010-01' },
      { date: '2024-12-01', amount: 120, method: 'Bank Transfer', status: 'completed', invoiceId: 'INV-S010-02' },
      { date: '2024-11-01', amount: 120, method: 'Card', status: 'completed', invoiceId: 'INV-S010-03' },
      { date: '2024-10-01', amount: 120, method: 'Card', status: 'completed', invoiceId: 'INV-S010-04' },
    ],
    deliveryLog: [
      { date: '2025-01-13', waybill: 'LQ-2025-00167', terminal: 'West Hills Mall', status: 'picked_up', lockerSize: 'Large' },
      { date: '2025-01-07', waybill: 'LQ-2025-00082', terminal: 'West Hills Mall', status: 'picked_up', lockerSize: 'Medium' },
      { date: '2024-12-30', waybill: 'LQ-2024-00978', terminal: 'Accra Mall', status: 'picked_up', lockerSize: 'Small' },
      { date: '2024-12-20', waybill: 'LQ-2024-00934', terminal: 'West Hills Mall', status: 'delivered_to_locker', lockerSize: 'XLarge' },
    ],
  },
];

const subscriberGrowthData = [
  { month: 'Sep', count: 3, revenue: 145 },
  { month: 'Oct', count: 5, revenue: 270 },
  { month: 'Nov', count: 6, revenue: 355 },
  { month: 'Dec', count: 8, revenue: 490 },
  { month: 'Jan', count: 9, revenue: 560 },
  { month: 'Feb', count: 10, revenue: 615 },
];

const subscriberChurnData = {
  churnRate: 10,
  retentionRate: 90,
  avgDuration: 4.2,
  newThisMonth: 2,
  cancelledThisMonth: 1,
};

const driversData = [
  { id: 1, name: 'Kwesi Asante', phone: '+233551234567', vehicle: 'Toyota Hiace - GR-1234-20', zone: 'Accra Central', status: 'active', deliveriesToday: 12, rating: 4.8 },
  { id: 2, name: 'Kofi Mensah', phone: '+233559876543', vehicle: 'Nissan Urvan - GW-5678-21', zone: 'East Legon', status: 'on_delivery', deliveriesToday: 8, rating: 4.6 },
  { id: 3, name: 'Yaw Boateng', phone: '+233542345678', vehicle: 'Kia Bongo - GN-9012-22', zone: 'Tema', status: 'offline', deliveriesToday: 0, rating: 4.9 },
  { id: 4, name: 'Kwame Asiedu', phone: '+233553456789', vehicle: 'Toyota Hiace - GR-3456-21', zone: 'Achimota', status: 'active', deliveriesToday: 15, rating: 4.7 },
];

const routesData = [
  {
    id: 'RT-001', zone: 'Accra Central', status: 'active', driver: driversData[0],
    startTime: '08:00', estEndTime: '10:30', distance: '28 km', createdAt: '2024-01-15 07:30',
    stops: [
      { id: 1, order: 1, terminal: 'Achimota Mall', packages: [1, 5], delivered: 2, eta: '08:25', status: 'completed', arrivedAt: '08:22' },
      { id: 2, order: 2, terminal: 'Accra Mall', packages: [2, 6], delivered: 1, eta: '09:00', status: 'in_progress', arrivedAt: '08:55' },
      { id: 3, order: 3, terminal: 'Kotoka T3', packages: [4], delivered: 0, eta: '09:40', status: 'pending', arrivedAt: null },
    ],
    timeline: [
      { time: '07:30', event: 'Route created', icon: 'route', by: 'System' },
      { time: '07:35', event: 'Driver Kwesi Asante assigned', icon: 'user', by: 'Admin' },
      { time: '08:00', event: 'Route started — driver departed warehouse', icon: 'truck', by: 'Kwesi Asante' },
      { time: '08:22', event: 'Arrived at Achimota Mall (Stop 1)', icon: 'mappin', by: 'Kwesi Asante' },
      { time: '08:28', event: '2 packages delivered at Achimota Mall', icon: 'package', by: 'Kwesi Asante' },
      { time: '08:55', event: 'Arrived at Accra Mall (Stop 2)', icon: 'mappin', by: 'Kwesi Asante' },
      { time: '09:02', event: '1 package delivered at Accra Mall', icon: 'package', by: 'Kwesi Asante' },
    ]
  },
  {
    id: 'RT-002', zone: 'East Legon', status: 'active', driver: driversData[1],
    startTime: '08:30', estEndTime: '10:00', distance: '15 km', createdAt: '2024-01-15 08:00',
    stops: [
      { id: 1, order: 1, terminal: 'Junction Mall', packages: [10], delivered: 1, eta: '08:50', status: 'completed', arrivedAt: '08:48' },
      { id: 2, order: 2, terminal: 'West Hills Mall', packages: [7], delivered: 0, eta: '09:30', status: 'pending', arrivedAt: null },
    ],
    timeline: [
      { time: '08:00', event: 'Route created', icon: 'route', by: 'System' },
      { time: '08:10', event: 'Driver Kofi Mensah assigned', icon: 'user', by: 'Admin' },
      { time: '08:30', event: 'Route started', icon: 'truck', by: 'Kofi Mensah' },
      { time: '08:48', event: 'Arrived at Junction Mall (Stop 1)', icon: 'mappin', by: 'Kofi Mensah' },
      { time: '08:52', event: '1 package delivered at Junction Mall', icon: 'package', by: 'Kofi Mensah' },
    ]
  },
  {
    id: 'RT-003', zone: 'Tema', status: 'pending', driver: driversData[2],
    startTime: '09:00', estEndTime: '11:00', distance: '22 km', createdAt: '2024-01-15 08:30',
    stops: [
      { id: 1, order: 1, terminal: 'Accra Mall', packages: [], delivered: 0, eta: '09:25', status: 'pending', arrivedAt: null },
      { id: 2, order: 2, terminal: 'Achimota Mall', packages: [9], delivered: 0, eta: '10:00', status: 'pending', arrivedAt: null },
      { id: 3, order: 3, terminal: 'West Hills Mall', packages: [], delivered: 0, eta: '10:40', status: 'pending', arrivedAt: null },
    ],
    timeline: [
      { time: '08:30', event: 'Route created', icon: 'route', by: 'System' },
      { time: '08:35', event: 'Driver Yaw Boateng assigned', icon: 'user', by: 'Admin' },
    ]
  }
];

const ticketsData = [
  { id: 'TKT-001', customer: 'Joe Doe', subject: 'Cannot open locker A-15', category: 'Technical', status: 'open', priority: 'high', created: '2024-01-15 10:30', assignee: 'Support Team' },
  { id: 'TKT-002', customer: 'Jane Doe', subject: 'Package not received', category: 'Delivery', status: 'in_progress', priority: 'medium', created: '2024-01-15 09:15', assignee: 'Kweku Appiah' },
  { id: 'TKT-003', customer: 'Michael Mensah', subject: 'Refund request', category: 'Billing', status: 'pending', priority: 'low', created: '2024-01-14 16:45', assignee: null },
];

const transactionsData = [
  { id: 'TXN-001', date: '2024-01-15', description: 'Package delivery - LQ-2024-00001', customer: 'Joe Doe', amount: 450, type: 'credit', status: 'completed' },
  { id: 'TXN-002', date: '2024-01-15', description: 'COD Collection - LQ-2024-00004', customer: 'Sarah Asante', amount: 890, type: 'credit', status: 'pending' },
  { id: 'TXN-003', date: '2024-01-14', description: 'Refund - LQ-2024-00003', customer: 'Michael Mensah', amount: -50, type: 'debit', status: 'completed' },
  { id: 'TXN-004', date: '2024-01-15', description: 'B2B Invoice Payment - Jumia', customer: 'Jumia Ghana', amount: 15000, type: 'credit', status: 'completed' },
];

const invoicesData = [
  { id: 'INV-001', customer: 'Jumia Ghana', date: '2024-01-01', dueDate: '2024-01-31', amount: 15000, status: 'paid' },
  { id: 'INV-002', customer: 'Melcom Ltd', date: '2024-01-01', dueDate: '2024-01-31', amount: 12500, status: 'pending' },
  { id: 'INV-003', customer: 'Joe Doe', date: '2024-01-10', dueDate: '2024-01-25', amount: 450, status: 'overdue' },
];

const partnersData = [
  { id: 1, name: 'Jumia Ghana', email: 'logistics@jumia.com.gh', phone: '+233302123456', type: 'e-commerce', tier: 'gold', totalOrders: 450, monthlyVolume: 120, totalSpent: 45000, revenue: 15000, status: 'active', joined: '2023-01-10', contractEnd: '2025-12-31', sla: '24hr', apiCalls: 12450, lastApiCall: '2 min ago', deliveryRate: 97.2, logo: '🟡' },
  { id: 2, name: 'Melcom Ltd', email: 'shipping@melcom.com', phone: '+233302654321', type: 'retail', tier: 'silver', totalOrders: 280, monthlyVolume: 75, totalSpent: 32000, revenue: 12500, status: 'active', joined: '2023-02-15', contractEnd: '2025-06-30', sla: '48hr', apiCalls: 8200, lastApiCall: '15 min ago', deliveryRate: 94.8, logo: '🔵' },
  { id: 3, name: 'Telecel Ghana', email: 'logistics@telecel.com.gh', phone: '+233302987654', type: 'telecom', tier: 'gold', totalOrders: 180, monthlyVolume: 45, totalSpent: 28000, revenue: 8500, status: 'active', joined: '2023-05-20', contractEnd: '2025-09-30', sla: '24hr', apiCalls: 5600, lastApiCall: '1 hour ago', deliveryRate: 96.1, logo: '🔴' },
  { id: 4, name: 'Hubtel', email: 'ops@hubtel.com', phone: '+233302456789', type: 'fintech', tier: 'bronze', totalOrders: 95, monthlyVolume: 30, totalSpent: 12000, revenue: 4200, status: 'active', joined: '2023-08-01', contractEnd: '2025-03-31', sla: '72hr', apiCalls: 2100, lastApiCall: '3 hours ago', deliveryRate: 91.5, logo: '🟢' },
  { id: 5, name: 'CompuGhana', email: 'shipping@compughana.com', phone: '+233302111222', type: 'electronics', tier: 'bronze', totalOrders: 65, monthlyVolume: 18, totalSpent: 8500, revenue: 2800, status: 'inactive', joined: '2023-11-10', contractEnd: '2024-11-10', sla: '48hr', apiCalls: 450, lastApiCall: '2 weeks ago', deliveryRate: 88.3, logo: '⚫' },
];


const partnerMonthlyData = [
  { month: 'Aug', jumia: 95, melcom: 60, telecel: 30, hubtel: 20 },
  { month: 'Sep', jumia: 110, melcom: 65, telecel: 35, hubtel: 22 },
  { month: 'Oct', jumia: 105, melcom: 70, telecel: 40, hubtel: 25 },
  { month: 'Nov', jumia: 120, melcom: 75, telecel: 38, hubtel: 28 },
  { month: 'Dec', jumia: 150, melcom: 80, telecel: 45, hubtel: 30 },
  { month: 'Jan', jumia: 130, melcom: 78, telecel: 42, hubtel: 32 },
];

const TIERS = {
  gold: { label: 'Gold', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', perks: 'Priority SLA, Dedicated Support, Custom API Limits' },
  silver: { label: 'Silver', color: '#a3a3a3', bg: 'rgba(163,163,163,0.1)', perks: 'Standard SLA, Email Support, Standard API Limits' },
  bronze: { label: 'Bronze', color: '#cd7c32', bg: 'rgba(205,124,50,0.1)', perks: 'Basic SLA, Ticket Support, Basic API Limits' },
};

const dropboxesData = [
  { id: 'DBX-001', name: 'Achimota Overpass', location: 'Achimota', address: 'Near Achimota Interchange', capacity: 50, currentFill: 42, status: 'active', lastCollection: '2024-01-15 10:30', nextCollection: '2024-01-15 16:00', assignedAgent: 'Yaw Boateng', agentPhone: '+233542345678', terminal: 'Achimota Mall', packagesIn: 42, packagesOut: 485, avgDailyVolume: 35, installDate: '2023-03-15', type: 'standard', alerts: ['near_full'] },
  { id: 'DBX-002', name: 'Madina Market', location: 'Madina', address: 'Madina Market Main Gate', capacity: 40, currentFill: 12, status: 'active', lastCollection: '2024-01-15 11:00', nextCollection: '2024-01-15 17:00', assignedAgent: 'Kwesi Asante', agentPhone: '+233551234567', terminal: 'Achimota Mall', packagesIn: 12, packagesOut: 320, avgDailyVolume: 22, installDate: '2023-04-20', type: 'standard', alerts: [] },
  { id: 'DBX-003', name: 'Osu Oxford Street', location: 'Osu', address: 'Oxford Street, near Frankie\'s', capacity: 35, currentFill: 31, status: 'active', lastCollection: '2024-01-15 09:00', nextCollection: '2024-01-15 14:00', assignedAgent: 'Kwame Asiedu', agentPhone: '+233553456789', terminal: 'Accra Mall', packagesIn: 31, packagesOut: 410, avgDailyVolume: 28, installDate: '2023-02-10', type: 'premium', alerts: ['near_full', 'collection_due'] },
  { id: 'DBX-004', name: 'Tema Community 1', location: 'Tema', address: 'Community 1, near Shell Station', capacity: 30, currentFill: 30, status: 'full', lastCollection: '2024-01-14 16:00', nextCollection: '2024-01-15 08:00', assignedAgent: 'Kofi Mensah', agentPhone: '+233559876543', terminal: 'Junction Mall', packagesIn: 30, packagesOut: 180, avgDailyVolume: 15, installDate: '2023-06-01', type: 'standard', alerts: ['full', 'collection_overdue'] },
  { id: 'DBX-005', name: 'East Legon A&C Mall', location: 'East Legon', address: 'A&C Mall Entrance', capacity: 45, currentFill: 18, status: 'active', lastCollection: '2024-01-15 12:00', nextCollection: '2024-01-15 18:00', assignedAgent: 'Yaw Boateng', agentPhone: '+233542345678', terminal: 'Accra Mall', packagesIn: 18, packagesOut: 290, avgDailyVolume: 20, installDate: '2023-05-15', type: 'premium', alerts: [] },
  { id: 'DBX-006', name: 'Spintex Baatsona', location: 'Spintex', address: 'Baatsona Total Junction', capacity: 35, currentFill: 28, status: 'active', lastCollection: '2024-01-15 08:30', nextCollection: '2024-01-15 15:00', assignedAgent: 'Kwesi Asante', agentPhone: '+233551234567', terminal: 'Junction Mall', packagesIn: 28, packagesOut: 350, avgDailyVolume: 25, installDate: '2023-07-10', type: 'standard', alerts: ['collection_due'] },
  { id: 'DBX-007', name: 'Kaneshie Market', location: 'Kaneshie', address: 'Kaneshie Market, Gate 2', capacity: 40, currentFill: 0, status: 'maintenance', lastCollection: '2024-01-13 10:00', nextCollection: null, assignedAgent: null, agentPhone: null, terminal: 'West Hills Mall', packagesIn: 0, packagesOut: 220, avgDailyVolume: 18, installDate: '2023-08-22', type: 'standard', alerts: ['maintenance'] },
  { id: 'DBX-008', name: 'Dansoman Roundabout', location: 'Dansoman', address: 'Near Dansoman Roundabout', capacity: 30, currentFill: 8, status: 'active', lastCollection: '2024-01-15 13:00', nextCollection: '2024-01-16 08:00', assignedAgent: 'Kwame Asiedu', agentPhone: '+233553456789', terminal: 'West Hills Mall', packagesIn: 8, packagesOut: 145, avgDailyVolume: 12, installDate: '2023-09-05', type: 'standard', alerts: [] },
];

const collectionsData = [
  { id: 'COL-001', dropbox: 'DBX-001', dropboxName: 'Achimota Overpass', agent: 'Yaw Boateng', scheduled: '2024-01-15 16:00', status: 'scheduled', packages: 42, terminal: 'Achimota Mall', priority: 'high', eta: '45 min', vehicle: 'Motorbike' },
  { id: 'COL-002', dropbox: 'DBX-003', dropboxName: 'Osu Oxford Street', agent: 'Kwame Asiedu', scheduled: '2024-01-15 14:00', status: 'overdue', packages: 31, terminal: 'Accra Mall', priority: 'high', eta: 'Overdue', vehicle: 'Van' },
  { id: 'COL-003', dropbox: 'DBX-004', dropboxName: 'Tema Community 1', agent: 'Kofi Mensah', scheduled: '2024-01-15 08:00', status: 'overdue', packages: 30, terminal: 'Junction Mall', priority: 'high', eta: 'Overdue', vehicle: 'Motorbike' },
  { id: 'COL-004', dropbox: 'DBX-006', dropboxName: 'Spintex Baatsona', agent: 'Kwesi Asante', scheduled: '2024-01-15 15:00', status: 'scheduled', packages: 28, terminal: 'Junction Mall', priority: 'medium', eta: '1.5 hrs', vehicle: 'Van' },
  { id: 'COL-005', dropbox: 'DBX-002', dropboxName: 'Madina Market', agent: 'Kwesi Asante', scheduled: '2024-01-15 17:00', status: 'scheduled', packages: 12, terminal: 'Achimota Mall', priority: 'low', eta: '3 hrs', vehicle: 'Van' },
  { id: 'COL-006', dropbox: 'DBX-005', dropboxName: 'East Legon A&C Mall', agent: 'Yaw Boateng', scheduled: '2024-01-15 18:00', status: 'scheduled', packages: 18, terminal: 'Accra Mall', priority: 'low', eta: '4 hrs', vehicle: 'Motorbike' },
  { id: 'COL-007', dropbox: 'DBX-008', dropboxName: 'Dansoman Roundabout', agent: 'Kwame Asiedu', scheduled: '2024-01-16 08:00', status: 'scheduled', packages: 8, terminal: 'West Hills Mall', priority: 'low', eta: 'Tomorrow', vehicle: 'Van' },
  { id: 'COL-008', dropbox: 'DBX-001', dropboxName: 'Achimota Overpass', agent: 'Yaw Boateng', scheduled: '2024-01-15 10:30', status: 'completed', packages: 38, terminal: 'Achimota Mall', priority: 'medium', eta: 'Done', vehicle: 'Motorbike' },
  { id: 'COL-009', dropbox: 'DBX-002', dropboxName: 'Madina Market', agent: 'Kwesi Asante', scheduled: '2024-01-15 11:00', status: 'completed', packages: 25, terminal: 'Achimota Mall', priority: 'low', eta: 'Done', vehicle: 'Van' },
];



// ============ PRICING ENGINE DATA ============
const BASE_RATE_CARD = [
  { id: 'SZ-S', size: 'Small', dimensions: '30×20×15 cm', maxWeight: 2, basePrice: 12, icon: '📦' },
  { id: 'SZ-M', size: 'Medium', dimensions: '45×35×25 cm', maxWeight: 5, basePrice: 18, icon: '📦' },
  { id: 'SZ-L', size: 'Large', dimensions: '60×45×35 cm', maxWeight: 10, basePrice: 25, icon: '📦' },
  { id: 'SZ-XL', size: 'XLarge', dimensions: '80×60×45 cm', maxWeight: 20, basePrice: 38, icon: '📦' },
];

const SLA_TIERS = [
  { id: 'SLA-STD', name: 'Standard', description: 'Next-day delivery to locker', hours: 24, multiplier: 1.0, color: '#6b7280', icon: '🕐' },
  { id: 'SLA-EXP', name: 'Express', description: 'Same-day delivery (before 6PM)', hours: 8, multiplier: 1.5, color: '#f59e0b', icon: '⚡' },
  { id: 'SLA-RUSH', name: 'Rush', description: 'Within 4 hours', hours: 4, multiplier: 2.2, color: '#ef4444', icon: '🔥' },
  { id: 'SLA-ECO', name: 'Economy', description: '2-3 business days', hours: 72, multiplier: 0.75, color: '#10b981', icon: '🌿' },
];

const DELIVERY_METHOD_PRICING = [
  { id: 'DM-WL', method: 'warehouse_to_locker', label: 'Warehouse → Locker', baseMarkup: 0, description: 'Standard flow. Package from partner warehouse to locker terminal.', icon: Warehouse, color: '#3b82f6' },
  { id: 'DM-DL', method: 'dropbox_to_locker', label: 'Dropbox → Locker', baseMarkup: 3, description: 'Customer drops off at dropbox, collected and routed to locker.', icon: Inbox, color: '#8b5cf6' },
  { id: 'DM-LH', method: 'locker_to_home', label: 'Locker → Home', baseMarkup: 8, description: 'Last-mile home delivery from locker terminal. Includes driver dispatch.', icon: Home, color: '#10b981' },
  { id: 'DM-WH', method: 'warehouse_to_home', label: 'Warehouse → Home (Direct)', baseMarkup: 12, description: 'Direct home delivery bypassing locker network. Premium service.', icon: Truck, color: '#f59e0b' },
];

const SURCHARGES = [
  { id: 'SC-COD', name: 'Cash on Delivery', type: 'percentage', value: 3.5, basis: 'package_value', description: 'COD collection fee on declared value', active: true, category: 'collection' },
  { id: 'SC-INS', name: 'Insurance', type: 'percentage', value: 1.5, basis: 'package_value', description: 'Transit insurance on declared value', active: true, category: 'protection' },
  { id: 'SC-FRAG', name: 'Fragile Handling', type: 'flat', value: 5, basis: null, description: 'Special handling for fragile items', active: true, category: 'handling' },
  { id: 'SC-OW', name: 'Overweight', type: 'per_kg', value: 3, basis: 'excess_weight', description: 'Per kg charge above size max weight', active: true, category: 'handling' },
  { id: 'SC-STOR', name: 'Extended Storage', type: 'per_day', value: 0, basis: 'days_after_free', description: 'Daily charge after free storage period', active: true, category: 'storage', tiers: { Small: 2, Medium: 3, Large: 5, XLarge: 8 } },
  { id: 'SC-WEEKEND', name: 'Weekend Delivery', type: 'flat', value: 5, basis: null, description: 'Saturday/Sunday delivery surcharge', active: true, category: 'timing' },
  { id: 'SC-HOLIDAY', name: 'Holiday Delivery', type: 'flat', value: 10, basis: null, description: 'Public holiday delivery surcharge', active: false, category: 'timing' },
  { id: 'SC-RETURN', name: 'Return to Sender', type: 'flat', value: 8, basis: null, description: 'Fee for returning expired/refused packages', active: true, category: 'handling' },
  { id: 'SC-REDELIVER', name: 'Redelivery', type: 'flat', value: 6, basis: null, description: 'Charge for failed delivery reattempt', active: true, category: 'handling' },
  { id: 'SC-SMS', name: 'SMS Notification', type: 'flat', value: 0.05, basis: null, description: 'Per SMS sent to customer', active: true, category: 'communication' },
  { id: 'SC-WA', name: 'WhatsApp Notification', type: 'flat', value: 0.02, basis: null, description: 'Per WhatsApp message sent', active: true, category: 'communication' },
];

const PARTNER_PRICING_OVERRIDES = [
  { partnerId: 1, partnerName: 'Jumia Ghana', tier: 'gold', logo: '🟡', volumeDiscount: 15, customRates: { Small: 10.20, Medium: 15.30, Large: 21.25, XLarge: 32.30 }, slaDefault: 'SLA-STD', codRate: 3.0, freeStorageDays: 5, monthlyMinimum: 100, contractRate: true, notes: 'Custom rate card effective Jan 2024' },
  { partnerId: 2, partnerName: 'Melcom Ltd', tier: 'silver', logo: '🔵', volumeDiscount: 10, customRates: { Small: 10.80, Medium: 16.20, Large: 22.50, XLarge: 34.20 }, slaDefault: 'SLA-STD', codRate: 3.5, freeStorageDays: 3, monthlyMinimum: 50, contractRate: true, notes: 'Standard silver pricing' },
  { partnerId: 3, partnerName: 'Telecel Ghana', tier: 'gold', logo: '🔴', volumeDiscount: 15, customRates: { Small: 10.20, Medium: 15.30, Large: 21.25, XLarge: 32.30 }, slaDefault: 'SLA-EXP', codRate: 3.0, freeStorageDays: 5, monthlyMinimum: 100, contractRate: true, notes: 'Express SLA by default' },
  { partnerId: 4, partnerName: 'Hubtel', tier: 'bronze', logo: '🟢', volumeDiscount: 5, customRates: null, slaDefault: 'SLA-STD', codRate: 3.5, freeStorageDays: 3, monthlyMinimum: 0, contractRate: false, notes: 'Standard public pricing' },
  { partnerId: 5, partnerName: 'CompuGhana', tier: 'bronze', logo: '⚫', volumeDiscount: 5, customRates: null, slaDefault: 'SLA-STD', codRate: 3.5, freeStorageDays: 3, monthlyMinimum: 0, contractRate: false, notes: 'Inactive — contract expired' },
];

const VOLUME_DISCOUNT_TIERS = [
  { min: 0, max: 49, discount: 0, label: 'Standard' },
  { min: 50, max: 99, discount: 5, label: 'Bronze' },
  { min: 100, max: 249, discount: 10, label: 'Silver' },
  { min: 250, max: 499, discount: 15, label: 'Gold' },
  { min: 500, max: Infinity, discount: 20, label: 'Enterprise' },
];

const STORAGE_FREE_DAYS = { bronze: 3, silver: 3, gold: 5, enterprise: 7, individual: 5 };


const staffData = [
  { id: 1, name: 'John Doe', email: 'john@locqar.com', role: 'SUPER_ADMIN', terminal: 'All', team: 'Management', status: 'active', lastActive: '2 min ago', performance: 98 },
  { id: 2, name: 'Akua Mansa', email: 'akua@locqar.com', role: 'ADMIN', terminal: 'All', team: 'Management', status: 'active', lastActive: '15 min ago', performance: 95 },
  { id: 3, name: 'Kofi Asante', email: 'kofi@locqar.com', role: 'MANAGER', terminal: 'Achimota Mall', team: 'Operations', status: 'active', lastActive: '1 hour ago', performance: 92 },
  { id: 4, name: 'Yaw Boateng', email: 'yaw@locqar.com', role: 'AGENT', terminal: 'Achimota Mall', team: 'Field', status: 'active', lastActive: '5 min ago', performance: 88 },
  { id: 5, name: 'Kweku Appiah', email: 'kweku@locqar.com', role: 'SUPPORT', terminal: 'All', team: 'Support', status: 'active', lastActive: '10 min ago', performance: 90 },
  { id: 6, name: 'Adjoa Frimpong', email: 'adjoa@locqar.com', role: 'VIEWER', terminal: 'Accra Mall', team: 'Operations', status: 'inactive', lastActive: '3 days ago', performance: 75 },
];

const teamsData = [
  { id: 1, name: 'Management', members: 2, lead: 'John Doe', color: '#4E0F0F' },
  { id: 2, name: 'Operations', members: 4, lead: 'Kofi Asante', color: '#3b82f6' },
  { id: 3, name: 'Field', members: 8, lead: 'Yaw Boateng', color: '#10b981' },
  { id: 4, name: 'Support', members: 3, lead: 'Kweku Appiah', color: '#8b5cf6' },
];

const smsTemplatesData = [
  { id: 'TPL-001', name: 'Package Ready for Pickup', channel: 'sms', event: 'delivered_to_locker', message: 'Hi {customer}, your package {waybill} is ready at {terminal}, Locker {locker}. Pickup code: {code}. Valid for 5 days.', active: true, sentCount: 4820, deliveryRate: 98.2, lastSent: '2 min ago' },
  { id: 'TPL-002', name: 'Package in Transit', channel: 'sms', event: 'in_transit', message: 'Hi {customer}, your package {waybill} is on its way to {terminal}. ETA: {eta}. Track: {trackUrl}', active: true, sentCount: 3210, deliveryRate: 97.8, lastSent: '5 min ago' },
  { id: 'TPL-003', name: 'Pickup Reminder (Day 3)', channel: 'sms', event: 'reminder_day3', message: 'Reminder: Your package {waybill} has been in Locker {locker} for 3 days. Please pick up before {expiryDate} to avoid return. Code: {code}', active: true, sentCount: 1580, deliveryRate: 97.5, lastSent: '1 hour ago' },
  { id: 'TPL-004', name: 'Package Expiring Soon', channel: 'sms', event: 'expiry_warning', message: '⚠️ URGENT: Package {waybill} expires TOMORROW at {terminal}. Pick up today or it will be returned. Locker {locker}, Code: {code}', active: true, sentCount: 890, deliveryRate: 96.8, lastSent: '3 hours ago' },
  { id: 'TPL-005', name: 'Package Expired', channel: 'sms', event: 'expired', message: 'Your package {waybill} has expired at {terminal} and will be returned to sender. Contact support: 0800-LOCQAR', active: true, sentCount: 245, deliveryRate: 95.1, lastSent: '1 day ago' },
  { id: 'TPL-006', name: 'COD Payment Required', channel: 'sms', event: 'cod_pending', message: 'Hi {customer}, package {waybill} requires COD payment of GH₵{amount}. Pay via MoMo to 055XXXXXXX or at pickup. Code: {code}', active: true, sentCount: 1120, deliveryRate: 97.0, lastSent: '30 min ago' },
  { id: 'TPL-007', name: 'Welcome - Locker Ready (WA)', channel: 'whatsapp', event: 'delivered_to_locker', message: '📦 *Package Ready!*\n\nHi {customer},\nYour package *{waybill}* is ready for pickup.\n\n📍 *Location:* {terminal}\n🔐 *Locker:* {locker}\n🔑 *Code:* {code}\n⏰ *Expires:* {expiryDate}\n\nNeed help? Reply to this message.', active: true, sentCount: 3650, deliveryRate: 99.1, lastSent: '1 min ago' },
  { id: 'TPL-008', name: 'Tracking Update (WA)', channel: 'whatsapp', event: 'in_transit', message: '🚚 *Delivery Update*\n\nHi {customer},\nYour package *{waybill}* is on the move!\n\n📍 Current: {currentLocation}\n🏁 Destination: {terminal}\n⏰ ETA: {eta}\n\nTrack live: {trackUrl}', active: true, sentCount: 2890, deliveryRate: 99.3, lastSent: '3 min ago' },
  { id: 'TPL-009', name: 'Pickup Reminder (WA)', channel: 'whatsapp', event: 'reminder_day3', message: '⏰ *Pickup Reminder*\n\nHi {customer},\nYour package *{waybill}* has been waiting for 3 days.\n\n📍 {terminal}, Locker {locker}\n🔑 Code: {code}\n📅 Expires: {expiryDate}\n\nDon\'t miss it! 🙏', active: true, sentCount: 1340, deliveryRate: 99.0, lastSent: '2 hours ago' },
  { id: 'TPL-010', name: 'Dropbox Confirmation (WA)', channel: 'whatsapp', event: 'dropbox_deposit', message: '✅ *Package Deposited*\n\nHi {customer},\nYour package *{waybill}* has been deposited at *{dropboxName}*.\n\nWe\'ll notify you when it\'s ready at your chosen locker.\n\n🔄 Status: Processing\n⏰ Expected: {eta}', active: true, sentCount: 980, deliveryRate: 99.2, lastSent: '15 min ago' },
  { id: 'TPL-011', name: 'Home Delivery ETA (WA)', channel: 'whatsapp', event: 'out_for_delivery', message: '🏠 *Out for Delivery*\n\nHi {customer},\nYour package *{waybill}* is out for home delivery!\n\n🚚 Driver: {driverName}\n📞 Contact: {driverPhone}\n⏰ ETA: {eta}\n\nPlease ensure someone is available to receive.', active: true, sentCount: 760, deliveryRate: 98.8, lastSent: '20 min ago' },
  { id: 'TPL-012', name: 'B2B Batch Notification', channel: 'sms', event: 'bulk_shipment', message: 'LocQar: Batch {batchId} ({packageCount} packages) received from {partnerName}. Processing to {terminal}. ETA: {eta}. Portal: {portalUrl}', active: false, sentCount: 320, deliveryRate: 97.5, lastSent: '1 day ago' },
  { id: 'TPL-013', name: 'Package Ready - Email', channel: 'email', event: 'delivered_to_locker', message: 'Subject: Your LocQar Package is Ready for Pickup\n\nDear {customer},\n\nGreat news! Your package ({waybill}) has been delivered to your designated LocQar smart locker.\n\nPickup Details:\n- Terminal: {terminal}\n- Locker: {locker}\n- Pickup Code: {code}\n- Expires: {expiryDate}\n\nPlease collect your package within 5 days to avoid return.\n\nNeed help? Reply to this email or call 0800-LOCQAR.\n\nBest regards,\nLocQar Team', active: true, sentCount: 2150, deliveryRate: 99.5, lastSent: '5 min ago' },
  { id: 'TPL-014', name: 'Delivery Confirmation - Email', channel: 'email', event: 'picked_up', message: 'Subject: Package Delivered Successfully\n\nDear {customer},\n\nThis confirms that your package ({waybill}) was successfully picked up from {terminal}.\n\nDelivery Summary:\n- Waybill: {waybill}\n- Terminal: {terminal}\n- Picked Up: {pickupTime}\n\nThank you for using LocQar!\n\nBest regards,\nLocQar Team', active: true, sentCount: 1890, deliveryRate: 99.6, lastSent: '10 min ago' },
  { id: 'TPL-015', name: 'Weekly Summary - Email', channel: 'email', event: 'weekly_digest', message: 'Subject: Your Weekly LocQar Summary\n\nDear {customer},\n\nHere is your delivery summary for the past week:\n\n- Packages Received: {weeklyReceived}\n- Packages Picked Up: {weeklyPickedUp}\n- Pending Pickup: {weeklyPending}\n\nUpcoming Expiries: {expiringCount} packages\n\nView your dashboard: {dashboardUrl}\n\nBest regards,\nLocQar Team', active: true, sentCount: 890, deliveryRate: 99.2, lastSent: '1 day ago' },
  { id: 'TPL-016', name: 'Invoice/Receipt - Email', channel: 'email', event: 'payment_received', message: 'Subject: LocQar Payment Receipt - {invoiceId}\n\nDear {customer},\n\nPayment Received:\n- Invoice: {invoiceId}\n- Amount: GH₵ {amount}\n- Method: {paymentMethod}\n- Date: {paymentDate}\n\nPackage: {waybill}\nService: {serviceType}\n\nThank you for your payment.\n\nBest regards,\nLocQar Billing Team', active: true, sentCount: 1560, deliveryRate: 99.4, lastSent: '30 min ago' },
];

const notificationHistoryData = [
  { id: 'MSG-001', template: 'Package Ready for Pickup', channel: 'sms', recipient: 'Joe Doe', phone: '+233551399333', waybill: 'LQ-2024-00001', status: 'delivered', sentAt: '2024-01-15 14:32', deliveredAt: '2024-01-15 14:32', cost: 0.05 },
  { id: 'MSG-002', template: 'Welcome - Locker Ready (WA)', channel: 'whatsapp', recipient: 'Joe Doe', phone: '+233551399333', waybill: 'LQ-2024-00001', status: 'read', sentAt: '2024-01-15 14:32', deliveredAt: '2024-01-15 14:33', cost: 0.02 },
  { id: 'MSG-003', template: 'Tracking Update (WA)', channel: 'whatsapp', recipient: 'Jane Doe', phone: '+233557821456', waybill: 'LQ-2024-00002', status: 'delivered', sentAt: '2024-01-15 14:20', deliveredAt: '2024-01-15 14:20', cost: 0.02 },
  { id: 'MSG-004', template: 'Package in Transit', channel: 'sms', recipient: 'Jane Doe', phone: '+233557821456', waybill: 'LQ-2024-00002', status: 'delivered', sentAt: '2024-01-15 14:15', deliveredAt: '2024-01-15 14:15', cost: 0.05 },
  { id: 'MSG-005', template: 'Pickup Reminder (Day 3)', channel: 'sms', recipient: 'Kwame Boateng', phone: '+233559876543', waybill: 'LQ-2024-00005', status: 'delivered', sentAt: '2024-01-15 09:00', deliveredAt: '2024-01-15 09:01', cost: 0.05 },
  { id: 'MSG-006', template: 'Pickup Reminder (WA)', channel: 'whatsapp', recipient: 'Kwame Boateng', phone: '+233559876543', waybill: 'LQ-2024-00005', status: 'read', sentAt: '2024-01-15 09:00', deliveredAt: '2024-01-15 09:00', cost: 0.02 },
  { id: 'MSG-007', template: 'Package Expiring Soon', channel: 'sms', recipient: 'Kwame Boateng', phone: '+233559876543', waybill: 'LQ-2024-00005', status: 'delivered', sentAt: '2024-01-14 09:00', deliveredAt: '2024-01-14 09:01', cost: 0.05 },
  { id: 'MSG-008', template: 'COD Payment Required', channel: 'sms', recipient: 'Sarah Asante', phone: '+233551234567', waybill: 'LQ-2024-00004', status: 'delivered', sentAt: '2024-01-15 08:00', deliveredAt: '2024-01-15 08:00', cost: 0.05 },
  { id: 'MSG-009', template: 'Home Delivery ETA (WA)', channel: 'whatsapp', recipient: 'Efua Owusu', phone: '+233553334444', waybill: 'LQ-2024-00008', status: 'sent', sentAt: '2024-01-15 14:30', deliveredAt: null, cost: 0.02 },
  { id: 'MSG-010', template: 'Package in Transit', channel: 'sms', recipient: 'Ama Serwaa', phone: '+233542345678', waybill: 'LQ-2024-00006', status: 'failed', sentAt: '2024-01-15 12:00', deliveredAt: null, cost: 0.00, error: 'Invalid number' },
  { id: 'MSG-011', template: 'Dropbox Confirmation (WA)', channel: 'whatsapp', recipient: 'Yaw Asiedu', phone: '+233555556666', waybill: 'LQ-2024-00009', status: 'read', sentAt: '2024-01-15 13:50', deliveredAt: '2024-01-15 13:50', cost: 0.02 },
  { id: 'MSG-012', template: 'Package Ready for Pickup', channel: 'sms', recipient: 'Akosua Mensah', phone: '+233557778888', waybill: 'LQ-2024-00010', status: 'delivered', sentAt: '2024-01-12 09:30', deliveredAt: '2024-01-12 09:31', cost: 0.05 },
  { id: 'MSG-013', template: 'Package Ready - Email', channel: 'email', recipient: 'Joe Doe', phone: 'joe.doe@email.com', waybill: 'LQ-2024-00001', status: 'opened', sentAt: '2024-01-15 14:33', deliveredAt: '2024-01-15 14:33', cost: 0.01 },
  { id: 'MSG-014', template: 'Delivery Confirmation - Email', channel: 'email', recipient: 'Jane Doe', phone: 'jane.doe@email.com', waybill: 'LQ-2024-00002', status: 'delivered', sentAt: '2024-01-15 14:21', deliveredAt: '2024-01-15 14:21', cost: 0.01 },
  { id: 'MSG-015', template: 'Invoice/Receipt - Email', channel: 'email', recipient: 'Sarah Asante', phone: 'sarah.a@company.com', waybill: 'LQ-2024-00004', status: 'opened', sentAt: '2024-01-15 08:05', deliveredAt: '2024-01-15 08:05', cost: 0.01 },
  { id: 'MSG-016', template: 'Weekly Summary - Email', channel: 'email', recipient: 'Kwame Boateng', phone: 'kwame.b@gmail.com', waybill: 'LQ-2024-00005', status: 'delivered', sentAt: '2024-01-14 06:00', deliveredAt: '2024-01-14 06:01', cost: 0.01 },
  { id: 'MSG-017', template: 'Package Ready - Email', channel: 'email', recipient: 'Efua Owusu', phone: 'efua.o@outlook.com', waybill: 'LQ-2024-00008', status: 'bounced', sentAt: '2024-01-15 14:31', deliveredAt: null, cost: 0.00, error: 'Mailbox full' },
  { id: 'MSG-018', template: 'Invoice/Receipt - Email', channel: 'email', recipient: 'Yaw Asiedu', phone: 'yaw.asiedu@work.com', waybill: 'LQ-2024-00009', status: 'opened', sentAt: '2024-01-15 13:55', deliveredAt: '2024-01-15 13:55', cost: 0.01 },
];

const autoRulesData = [
  { id: 'RULE-001', name: 'Locker Deposit → Pickup Notification', trigger: 'delivered_to_locker', channels: ['sms', 'whatsapp'], templates: ['TPL-001', 'TPL-007'], delay: '0 min', active: true, fired: 4820, description: 'Send pickup code via SMS + WhatsApp when package is deposited in locker' },
  { id: 'RULE-002', name: 'Transit Update', trigger: 'in_transit', channels: ['whatsapp'], templates: ['TPL-008'], delay: '0 min', active: true, fired: 2890, description: 'Send WhatsApp tracking update when package leaves terminal' },
  { id: 'RULE-003', name: '3-Day Pickup Reminder', trigger: 'days_in_locker_3', channels: ['sms', 'whatsapp'], templates: ['TPL-003', 'TPL-009'], delay: '9:00 AM', active: true, fired: 1580, description: 'Remind customer after 3 days in locker' },
  { id: 'RULE-004', name: 'Expiry Warning (Day 4)', trigger: 'days_in_locker_4', channels: ['sms'], templates: ['TPL-004'], delay: '8:00 AM', active: true, fired: 890, description: 'Urgent SMS warning 1 day before expiry' },
  { id: 'RULE-005', name: 'Package Expired', trigger: 'expired', channels: ['sms'], templates: ['TPL-005'], delay: '0 min', active: true, fired: 245, description: 'Notify customer when package is expired and queued for return' },
  { id: 'RULE-006', name: 'COD Pending Alert', trigger: 'cod_pending', channels: ['sms'], templates: ['TPL-006'], delay: '0 min', active: true, fired: 1120, description: 'Send COD payment instructions when COD package arrives' },
  { id: 'RULE-007', name: 'Dropbox Deposit Confirmation', trigger: 'dropbox_deposit', channels: ['whatsapp'], templates: ['TPL-010'], delay: '0 min', active: true, fired: 980, description: 'Confirm package deposited in dropbox via WhatsApp' },
  { id: 'RULE-008', name: 'Home Delivery Dispatch', trigger: 'out_for_delivery', channels: ['whatsapp'], templates: ['TPL-011'], delay: '0 min', active: true, fired: 760, description: 'Send driver details and ETA for home deliveries' },
  { id: 'RULE-009', name: 'B2B Batch Received', trigger: 'bulk_shipment_received', channels: ['sms'], templates: ['TPL-012'], delay: '5 min', active: false, fired: 320, description: 'Notify B2B partner when bulk shipment is received' },
  { id: 'RULE-010', name: 'Email Pickup Confirmation', trigger: 'delivered_to_locker', channels: ['email'], templates: ['TPL-013'], delay: '0 min', active: true, fired: 2150, description: 'Send email with pickup details when package is deposited in locker' },
  { id: 'RULE-011', name: 'Email Delivery Receipt', trigger: 'picked_up', channels: ['email'], templates: ['TPL-014'], delay: '0 min', active: true, fired: 1890, description: 'Send email confirmation when package is picked up' },
  { id: 'RULE-012', name: 'Weekly Email Digest', trigger: 'weekly_schedule', channels: ['email'], templates: ['TPL-015'], delay: 'Monday 6:00 AM', active: true, fired: 890, description: 'Send weekly delivery summary every Monday morning' },
  { id: 'RULE-013', name: 'Payment Receipt Email', trigger: 'payment_received', channels: ['email'], templates: ['TPL-016'], delay: '0 min', active: true, fired: 1560, description: 'Send invoice/receipt email when payment is confirmed' },
];

const msgVolumeData = [
  { date: 'Mon', sms: 420, whatsapp: 380, email: 210 },
  { date: 'Tue', sms: 480, whatsapp: 450, email: 245 },
  { date: 'Wed', sms: 510, whatsapp: 490, email: 260 },
  { date: 'Thu', sms: 390, whatsapp: 370, email: 195 },
  { date: 'Fri', sms: 550, whatsapp: 520, email: 280 },
  { date: 'Sat', sms: 320, whatsapp: 280, email: 140 },
  { date: 'Sun', sms: 180, whatsapp: 150, email: 85 },
];

const MSG_STATUSES = {
  delivered: { label: 'Delivered', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: '✓✓' },
  read: { label: 'Read', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: '✓✓' },
  opened: { label: 'Opened', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', icon: '👁' },
  sent: { label: 'Sent', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: '✓' },
  failed: { label: 'Failed', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: '✕' },
  bounced: { label: 'Bounced', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: '↩' },
  pending: { label: 'Pending', color: '#6b7280', bg: 'rgba(107,114,128,0.1)', icon: '⏳' },
};

const auditLogData = [
  { id: 1, user: 'John Doe', action: 'Opened locker A-15', timestamp: '2024-01-15 14:32:15', ip: '192.168.1.100' },
  { id: 2, user: 'Kofi Asante', action: 'Updated package LQ-2024-00002 status', timestamp: '2024-01-15 14:28:00', ip: '192.168.1.105' },
  { id: 3, user: 'Yaw Boateng', action: 'Scanned package LQ-2024-00007', timestamp: '2024-01-15 14:15:30', ip: '192.168.1.110' },
  { id: 4, user: 'Akua Mansa', action: 'Created new customer account', timestamp: '2024-01-15 13:45:00', ip: '192.168.1.102' },
  { id: 5, user: 'John Doe', action: 'Generated monthly report', timestamp: '2024-01-15 12:00:00', ip: '192.168.1.100' },
];

// ============ SLA BREACH ALERTS DATA ============
const SLA_SEVERITY = {
  on_track: { label: 'On Track', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: CheckCircle2, pulse: false },
  warning: { label: 'Warning', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: AlertTriangle, pulse: false },
  critical: { label: 'Critical', color: '#f97316', bg: 'rgba(249,115,22,0.1)', icon: AlertOctagon, pulse: true },
  breached: { label: 'BREACHED', color: '#ef4444', bg: 'rgba(239,68,68,0.15)', icon: XCircle, pulse: true },
};

const ESCALATION_RULES = [
  { level: 0, name: 'Monitoring', triggerPct: 0, actions: ['Standard tracking active'], color: '#10b981', icon: Eye, role: 'System' },
  { level: 1, name: 'Auto-Alert', triggerPct: 75, actions: ['SMS + WhatsApp to customer', 'Push notification to assigned agent', 'Flag in agent dashboard'], color: '#f59e0b', icon: Bell, role: 'System' },
  { level: 2, name: 'Manager Escalation', triggerPct: 90, actions: ['Urgent alert to branch manager', 'Auto-reassign to nearest available driver', 'Priority queue bump'], color: '#f97316', icon: Users, role: 'Branch Manager' },
  { level: 3, name: 'Executive Escalation', triggerPct: 100, actions: ['Alert operations director', 'Auto-generate incident report', 'Freeze new deliveries to terminal', 'Customer compensation workflow'], color: '#ef4444', icon: AlertOctagon, role: 'Ops Director' },
];

const slaBreachData = [
  { id: 1, waybill: 'LQ-2024-00002', customer: 'Jane Doe', phone: '+233557821456', slaType: 'Express', terminal: 'Accra Mall', slaHours: 8, elapsedHours: 6.8, remainingMin: 72, pctUsed: 85, severity: 'critical', escalationLevel: 2, agent: 'Kofi Mensah', manager: 'Kofi Asante', createdAt: '2024-01-15 09:15', deadline: '17:15 today', lastAction: 'Manager notified, driver reassigned', acknowledgedBy: null, product: 'Dropbox Express', size: 'Large' },
  { id: 2, waybill: 'LQ-2024-00006', customer: 'Ama Serwaa', phone: '+233542345678', slaType: 'Standard', terminal: 'Accra Mall', slaHours: 24, elapsedHours: 20.5, remainingMin: 210, pctUsed: 85.4, severity: 'warning', escalationLevel: 1, agent: 'Kwesi Asante', manager: null, createdAt: '2024-01-14 15:30', deadline: '15:30 today', lastAction: 'Customer reminder sent', acknowledgedBy: null, product: 'Standard', size: 'Small' },
  { id: 3, waybill: 'LQ-2024-00007', customer: 'Kofi Mensah', phone: '+233551112222', slaType: 'Standard', terminal: 'West Hills', slaHours: 24, elapsedHours: 23.5, remainingMin: 30, pctUsed: 97.9, severity: 'critical', escalationLevel: 2, agent: 'Kwame Asiedu', manager: 'Kofi Asante', createdAt: '2024-01-14 12:30', deadline: '12:30 today', lastAction: 'Acknowledged by manager, priority dispatch', acknowledgedBy: 'Kofi Asante', product: 'Dropbox Express', size: 'Medium' },
  { id: 4, waybill: 'LQ-2024-00008', customer: 'Efua Owusu', phone: '+233553334444', slaType: 'Rush', terminal: 'Tema', slaHours: 4, elapsedHours: 4.2, remainingMin: -12, pctUsed: 105, severity: 'breached', escalationLevel: 3, agent: 'Kofi Mensah', manager: 'Kofi Asante', createdAt: '2024-01-15 10:00', deadline: '14:00 today (OVERDUE)', lastAction: 'Incident report generated, exec notified', acknowledgedBy: 'Kofi Asante', product: 'Home Delivery', size: 'Large' },
  { id: 5, waybill: 'LQ-2024-00004', customer: 'Sarah Asante', phone: '+233551234567', slaType: 'Express', terminal: 'Kotoka T3', slaHours: 8, elapsedHours: 7.2, remainingMin: 48, pctUsed: 90, severity: 'critical', escalationLevel: 2, agent: 'Kwesi Asante', manager: 'Kofi Asante', createdAt: '2024-01-15 07:45', deadline: '15:45 today', lastAction: 'Manager escalation pending ack', acknowledgedBy: null, product: 'Airport Pickup', size: 'Medium' },
  { id: 6, waybill: 'LQ-2024-00010', customer: 'Akosua Mensah', phone: '+233557778888', slaType: 'Standard', terminal: 'Junction Mall', slaHours: 24, elapsedHours: 25.0, remainingMin: -60, pctUsed: 104.2, severity: 'breached', escalationLevel: 3, agent: 'Kwame Asiedu', manager: 'Kofi Asante', createdAt: '2024-01-14 09:00', deadline: '09:00 today (OVERDUE)', lastAction: 'Exec alert + incident report', acknowledgedBy: null, product: 'Standard', size: 'Medium' },
  { id: 7, waybill: 'LQ-2024-00001', customer: 'Joe Doe', phone: '+233551399333', slaType: 'Standard', terminal: 'Achimota Mall', slaHours: 24, elapsedHours: 12.0, remainingMin: 720, pctUsed: 50, severity: 'on_track', escalationLevel: 0, agent: 'Yaw Boateng', manager: null, createdAt: '2024-01-15 08:30', deadline: '08:30 tomorrow', lastAction: 'In transit — on schedule', acknowledgedBy: null, product: "Pick 'N' Go", size: 'Medium' },
  { id: 8, waybill: 'LQ-2024-00009', customer: 'Yaw Asiedu', phone: '+233555556666', slaType: 'Standard', terminal: 'Achimota Mall', slaHours: 24, elapsedHours: 5.2, remainingMin: 1128, pctUsed: 21.7, severity: 'on_track', escalationLevel: 0, agent: 'Yaw Boateng', manager: null, createdAt: '2024-01-15 13:45', deadline: '13:45 tomorrow', lastAction: 'At dropbox — awaiting collection', acknowledgedBy: null, product: 'Dropbox Express', size: 'Small' },
  { id: 9, waybill: 'LQ-2024-00011', customer: 'Abena Osei', phone: '+233559998877', slaType: 'Economy', terminal: 'Tema', slaHours: 72, elapsedHours: 18.0, remainingMin: 3240, pctUsed: 25, severity: 'on_track', escalationLevel: 0, agent: 'Kwesi Asante', manager: null, createdAt: '2024-01-14 20:00', deadline: '2024-01-17 20:00', lastAction: 'Processing at hub — on schedule', acknowledgedBy: null, product: 'Economy Saver', size: 'Large' },
  { id: 10, waybill: 'LQ-2024-00012', customer: 'Kwaku Frimpong', phone: '+233541112233', slaType: 'Rush', terminal: 'Accra Mall', slaHours: 4, elapsedHours: 3.1, remainingMin: 54, pctUsed: 77.5, severity: 'warning', escalationLevel: 1, agent: 'Kofi Mensah', manager: null, createdAt: '2024-01-15 12:00', deadline: '16:00 today', lastAction: 'Agent alerted — en route to pickup', acknowledgedBy: null, product: 'Home Delivery', size: 'Small' },
  { id: 11, waybill: 'LQ-2024-00013', customer: 'Adwoa Boateng', phone: '+233557654321', slaType: 'Express', terminal: 'West Hills', slaHours: 8, elapsedHours: 2.5, remainingMin: 330, pctUsed: 31.3, severity: 'on_track', escalationLevel: 0, agent: 'Kwame Asiedu', manager: null, createdAt: '2024-01-15 11:30', deadline: '19:30 today', lastAction: 'Package scanned at origin terminal', acknowledgedBy: null, product: 'Dropbox Express', size: 'Medium' },
  { id: 12, waybill: 'LQ-2024-00014', customer: 'Nana Agyemang', phone: '+233543216789', slaType: 'Standard', terminal: 'Kotoka T3', slaHours: 24, elapsedHours: 22.0, remainingMin: 120, pctUsed: 91.7, severity: 'critical', escalationLevel: 2, agent: 'Yaw Boateng', manager: 'Kofi Asante', createdAt: '2024-01-14 14:00', deadline: '14:00 today', lastAction: 'Manager notified — driver dispatched urgently', acknowledgedBy: 'Kofi Asante', product: 'Airport Pickup', size: 'Large' },
  { id: 13, waybill: 'LQ-2024-00015', customer: 'Esi Quaye', phone: '+233558887766', slaType: 'Economy', terminal: 'Junction Mall', slaHours: 72, elapsedHours: 45.0, remainingMin: 1620, pctUsed: 62.5, severity: 'on_track', escalationLevel: 0, agent: 'Kwesi Asante', manager: null, createdAt: '2024-01-13 15:00', deadline: '2024-01-16 15:00', lastAction: 'In transit between hubs', acknowledgedBy: null, product: 'Economy Saver', size: 'Small' },
  { id: 14, waybill: 'LQ-2024-00016', customer: 'Kwabena Darko', phone: '+233549876543', slaType: 'Rush', terminal: 'Achimota Mall', slaHours: 4, elapsedHours: 4.5, remainingMin: -30, pctUsed: 112.5, severity: 'breached', escalationLevel: 3, agent: 'Yaw Boateng', manager: 'Kofi Asante', createdAt: '2024-01-15 09:00', deadline: '13:00 today (OVERDUE)', lastAction: 'Exec alert sent — compensation in progress', acknowledgedBy: null, product: "Pick 'N' Go", size: 'Medium' },
  { id: 15, waybill: 'LQ-2024-00017', customer: 'Akua Mensah', phone: '+233556543210', slaType: 'Express', terminal: 'Tema', slaHours: 8, elapsedHours: 6.0, remainingMin: 120, pctUsed: 75, severity: 'warning', escalationLevel: 1, agent: 'Kofi Mensah', manager: null, createdAt: '2024-01-15 08:00', deadline: '16:00 today', lastAction: 'Auto-alert sent to agent and customer', acknowledgedBy: null, product: 'Standard', size: 'Large' },
];

const escalationLog = [
  { id: 1, waybill: 'LQ-2024-00008', level: 3, severity: 'breached', action: 'Executive Alert — Ops Director notified. Incident #INC-047 auto-generated. Terminal deliveries paused.', by: 'System', role: 'Auto', timestamp: '2024-01-15 14:05', acked: false },
  { id: 2, waybill: 'LQ-2024-00010', level: 3, severity: 'breached', action: 'Executive Alert — SLA breached by 1hr. Incident #INC-048 created. Customer compensation initiated.', by: 'System', role: 'Auto', timestamp: '2024-01-15 09:05', acked: false },
  { id: 3, waybill: 'LQ-2024-00008', level: 2, severity: 'critical', action: 'Manager Kofi Asante acknowledged. Driver reassigned from Kofi Mensah → Kwesi Asante (closer).', by: 'Kofi Asante', role: 'Manager', timestamp: '2024-01-15 13:30', acked: true },
  { id: 4, waybill: 'LQ-2024-00002', level: 2, severity: 'critical', action: 'Manager escalation triggered — Kofi Asante notified via SMS. Awaiting acknowledgement.', by: 'System', role: 'Auto', timestamp: '2024-01-15 15:45', acked: false },
  { id: 5, waybill: 'LQ-2024-00004', level: 2, severity: 'critical', action: 'Manager escalation — Pending acknowledgement from Kofi Asante.', by: 'System', role: 'Auto', timestamp: '2024-01-15 15:00', acked: false },
  { id: 6, waybill: 'LQ-2024-00007', level: 2, severity: 'critical', action: 'Manager acknowledged. Priority dispatch ordered.', by: 'Kofi Asante', role: 'Manager', timestamp: '2024-01-15 11:00', acked: true },
  { id: 7, waybill: 'LQ-2024-00002', level: 1, severity: 'warning', action: 'Auto-alert: SMS + WhatsApp sent to customer Jane Doe and agent Kofi Mensah.', by: 'System', role: 'Auto', timestamp: '2024-01-15 14:30', acked: true },
  { id: 8, waybill: 'LQ-2024-00006', level: 1, severity: 'warning', action: 'Auto-alert: SMS reminder sent to customer Ama Serwaa.', by: 'System', role: 'Auto', timestamp: '2024-01-15 11:30', acked: true },
  { id: 9, waybill: 'LQ-2024-00004', level: 1, severity: 'warning', action: 'Auto-alert: WhatsApp sent to agent Kwesi Asante.', by: 'System', role: 'Auto', timestamp: '2024-01-15 13:30', acked: true },
  { id: 10, waybill: 'LQ-2024-00016', level: 3, severity: 'breached', action: 'Executive Alert — Rush SLA breached by 30min. Incident #INC-049 created. Customer refund initiated.', by: 'System', role: 'Auto', timestamp: '2024-01-15 13:05', acked: false },
  { id: 11, waybill: 'LQ-2024-00016', level: 2, severity: 'critical', action: 'Manager Kofi Asante notified. Attempting driver reassignment for Achimota area.', by: 'System', role: 'Auto', timestamp: '2024-01-15 12:30', acked: false },
  { id: 12, waybill: 'LQ-2024-00014', level: 2, severity: 'critical', action: 'Manager acknowledged. Priority dispatch to Kotoka T3 ordered immediately.', by: 'Kofi Asante', role: 'Manager', timestamp: '2024-01-15 12:15', acked: true },
  { id: 13, waybill: 'LQ-2024-00012', level: 1, severity: 'warning', action: 'Auto-alert: SMS + WhatsApp sent to customer Kwaku Frimpong and agent Kofi Mensah.', by: 'System', role: 'Auto', timestamp: '2024-01-15 15:00', acked: true },
  { id: 14, waybill: 'LQ-2024-00017', level: 1, severity: 'warning', action: 'Auto-alert: Email + SMS sent to customer Akua Mensah. Agent Kofi Mensah flagged.', by: 'System', role: 'Auto', timestamp: '2024-01-15 14:00', acked: false },
  { id: 15, waybill: 'LQ-2024-00014', level: 1, severity: 'warning', action: 'Auto-alert: Customer Nana Agyemang notified via WhatsApp. Pickup window closing.', by: 'System', role: 'Auto', timestamp: '2024-01-15 10:00', acked: true },
];

const slaComplianceTrend = [
  { date: 'Mon', total: 57, onTime: 45, warning: 8, breached: 4 },
  { date: 'Tue', total: 60, onTime: 52, warning: 6, breached: 2 },
  { date: 'Wed', total: 64, onTime: 48, warning: 10, breached: 6 },
  { date: 'Thu', total: 63, onTime: 55, warning: 5, breached: 3 },
  { date: 'Fri', total: 71, onTime: 60, warning: 7, breached: 4 },
  { date: 'Sat', total: 43, onTime: 38, warning: 4, breached: 1 },
  { date: 'Sun', total: 25, onTime: 22, warning: 2, breached: 1 },
];

const slaComplianceMonthly = [
  { date: 'Week 1', total: 383, onTime: 320, warning: 42, breached: 21 },
  { date: 'Week 2', total: 405, onTime: 345, warning: 38, breached: 22 },
  { date: 'Week 3', total: 392, onTime: 310, warning: 52, breached: 30 },
  { date: 'Week 4', total: 383, onTime: 320, warning: 42, breached: 21 },
];

const slaBreachCauses = [
  { cause: 'Late Driver Dispatch', count: 34, pct: 38, color: '#ef4444' },
  { cause: 'High Terminal Volume', count: 22, pct: 25, color: '#f97316' },
  { cause: 'System Processing Delay', count: 18, pct: 20, color: '#f59e0b' },
  { cause: 'Customer No-Show', count: 15, pct: 17, color: '#8b5cf6' },
];

// ============ UTILITY COMPONENTS ============

// Toast Notification System
const Toast = ({ message, type = 'info', onClose }) => {
  const theme = useContext(ThemeContext);
  const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
  const Icon = icons[type] || Info;
  const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b', info: '#3b82f6' };
  
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border animate-slide-in" style={{ backgroundColor: theme.bg.card, borderColor: colors[type] }}>
      <Icon size={20} style={{ color: colors[type] }} />
      <span className="text-sm flex-1" style={{ color: theme.text.primary }}>{message}</span>
      <button onClick={onClose} className="p-1 rounded hover:bg-white/10"><X size={16} style={{ color: theme.text.muted }} /></button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => (
  <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
    {toasts.map(toast => <Toast key={toast.id} {...toast} onClose={() => removeToast(toast.id)} />)}
  </div>
);

// Loading Skeleton
const Skeleton = ({ className = '', variant = 'text' }) => {
  const theme = useContext(ThemeContext);
  const baseClass = "animate-pulse rounded";
  const variants = {
    text: "h-4 w-full",
    title: "h-6 w-3/4",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24",
    card: "h-32 w-full rounded-xl",
  };
  return <div className={`${baseClass} ${variants[variant]} ${className}`} style={{ backgroundColor: theme.border.primary }} />;
};

const TableSkeleton = ({ rows = 5, cols = 6, theme }) => (
  <div className="animate-pulse">
    {[...Array(rows)].map((_, i) => (
      <div key={i} className="flex gap-4 p-4" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
        {[...Array(cols)].map((_, j) => (
          <div key={j} className="h-4 rounded flex-1" style={{ backgroundColor: theme.border.primary, width: j === 0 ? '20%' : 'auto' }} />
        ))}
      </div>
    ))}
  </div>
);

// Empty State
const EmptyState = ({ icon: Icon = Package, title, description, action, theme }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4">
    <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: theme.accent.light }}>
      <Icon size={40} style={{ color: theme.accent.primary }} />
    </div>
    <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text.primary }}>{title}</h3>
    <p className="text-sm text-center max-w-md mb-6" style={{ color: theme.text.muted }}>{description}</p>
    {action && <button className="px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}>{action}</button>}
  </div>
);

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange, pageSize, onPageSizeChange, totalItems, theme }) => {
  const pages = [];
  const maxVisible = 5;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start + 1 < maxVisible) start = Math.max(1, end - maxVisible + 1);
  
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: theme.border.primary }}>
      <div className="flex items-center gap-2">
        <span className="text-sm" style={{ color: theme.text.muted }}>Show</span>
        <select value={pageSize} onChange={(e) => onPageSizeChange(Number(e.target.value))} className="px-2 py-1 rounded-lg text-sm border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
          {[10, 25, 50, 100].map(size => <option key={size} value={size}>{size}</option>)}
        </select>
        <span className="text-sm" style={{ color: theme.text.muted }}>of {totalItems} items</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="p-2 rounded-lg disabled:opacity-50" style={{ color: theme.text.secondary }}><ChevronFirst size={16} /></button>
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg disabled:opacity-50" style={{ color: theme.text.secondary }}><ChevronLeft size={16} /></button>
        {pages.map(page => (
          <button key={page} onClick={() => onPageChange(page)} className="w-8 h-8 rounded-lg text-sm" style={{ backgroundColor: currentPage === page ? theme.accent.primary : 'transparent', color: currentPage === page ? '#fff' : theme.text.secondary }}>{page}</button>
        ))}
        <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg disabled:opacity-50" style={{ color: theme.text.secondary }}><ChevronRight size={16} /></button>
        <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-lg disabled:opacity-50" style={{ color: theme.text.secondary }}><ChevronLast size={16} /></button>
      </div>
    </div>
  );
};

// Bulk Actions Bar
const BulkActionsBar = ({ selectedCount, onClear, onAction, actions, theme }) => {
  if (selectedCount === 0) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-6 py-3 rounded-2xl shadow-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.accent.border }}>
      <span className="text-sm" style={{ color: theme.text.primary }}><span className="font-bold">{selectedCount}</span> selected</span>
      <div className="h-6 w-px" style={{ backgroundColor: theme.border.primary }} />
      {actions.map(a => (
        <button key={a.id} onClick={() => onAction(a.id)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: a.color + '15', color: a.color }}>
          <a.icon size={16} />{a.label}
        </button>
      ))}
      <button onClick={onClear} className="p-1.5 rounded-lg" style={{ color: theme.text.muted }}><X size={18} /></button>
    </div>
  );
};


// ============ SCAN MODAL ============
const ScanModal = ({ isOpen, onClose, theme, userRole, addToast, onViewPackage, onReassign, onReturn }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isOpen) { setQuery(''); setResult(null); setSearched(false); }
  }, [isOpen]);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.length < 3) { setResult(null); setSearched(false); return; }
    const q = value.toUpperCase().trim();
    const found = packagesData.find(p => p.waybill.toUpperCase() === q || p.waybill.toUpperCase().includes(q));
    setResult(found || null);
    setSearched(true);
  };

  const handleConfirmScan = () => {
    if (!result) return;
    setHistory(prev => {
      const filtered = prev.filter(h => h.id !== result.id);
      return [{ ...result, scannedAt: new Date().toLocaleTimeString() }, ...filtered].slice(0, 5);
    });
    addToast({ type: 'success', message: `Package ${result.waybill} scanned successfully` });
  };

  const handleAction = (action) => {
    if (!result) return;
    if (action === 'reassigned') { onReassign(result); onClose(); return; }
    if (action === 'marked for return') { onReturn(result); onClose(); return; }
    addToast({ type: 'success', message: `Package ${result.waybill} ${action}` });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-lg rounded-2xl border shadow-2xl mx-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accent.light }}>
            <Scan size={20} style={{ color: theme.accent.primary }} />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold" style={{ color: theme.text.primary }}>Scan Package</h2>
            <p className="text-xs" style={{ color: theme.text.muted }}>Enter or scan a waybill number</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><X size={18} /></button>
        </div>

        {/* Input */}
        <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: result ? '#10b981' : searched && !result ? '#ef4444' : theme.border.primary }}>
            <QrCode size={18} style={{ color: theme.text.muted }} />
            <input
              type="text"
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="LQ-2024-00001"
              autoFocus
              className="flex-1 bg-transparent outline-none font-mono text-sm"
              style={{ color: theme.text.primary }}
            />
            {query && (
              <button onClick={() => handleSearch('')} className="p-1 rounded" style={{ color: theme.text.muted }}><X size={14} /></button>
            )}
          </div>
        </div>

        {/* Result */}
        <div className="max-h-[60vh] overflow-y-auto">
          {searched && !result && (
            <div className="p-8 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
                <PackageX size={28} className="text-red-500" />
              </div>
              <p className="font-medium" style={{ color: theme.text.primary }}>Package not found</p>
              <p className="text-sm mt-1" style={{ color: theme.text.muted }}>No package matches "{query}"</p>
            </div>
          )}

          {result && (
            <div className="p-4 space-y-4">
              {/* Package header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono font-semibold" style={{ color: theme.text.primary }}>{result.waybill}</p>
                  <p className="text-sm" style={{ color: theme.text.muted }}>{result.customer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <DeliveryMethodBadge method={result.deliveryMethod} />
                  <StatusBadge status={result.status} />
                </div>
              </div>

              {/* Status flow */}
              <div className="p-3 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                <PackageStatusFlow status={result.status} deliveryMethod={result.deliveryMethod} />
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                {[
                  ['Customer', result.customer],
                  ['Phone', result.phone],
                  ['Destination', result.destination],
                  ['Locker', result.locker !== '-' ? result.locker : '—'],
                  ['Value', `GH₵ ${result.value}`],
                  ['Weight', result.weight],
                  ['Size', result.size],
                  ['Service', result.product],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{value}</p>
                  </div>
                ))}
                {result.locker !== '-' && (
                  <div>
                    <p className="text-xs" style={{ color: theme.text.muted }}>Locker Address</p>
                    <p className="text-sm font-mono font-medium" style={{ color: theme.accent.primary }}>{getLockerAddress(result.locker, result.destination)}</p>
                  </div>
                )}
                {result.cod && (
                  <div>
                    <p className="text-xs" style={{ color: theme.text.muted }}>COD</p>
                    <p className="text-sm font-medium text-amber-500">GH₵ {result.value}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button onClick={handleConfirmScan} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: theme.accent.primary }}>
                  <CheckCircle2 size={16} /> Confirm Scan
                </button>
                <button onClick={() => { onViewPackage(result); onClose(); }} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                  <Eye size={16} /> Details
                </button>
              </div>

              {hasPermission(userRole, 'packages.update') && (
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={() => handleAction('marked as delivered')} className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-emerald-500 text-xs" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <CheckCircle2 size={18} /> Delivered
                  </button>
                  <button onClick={() => handleAction('reassigned')} className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-amber-500 text-xs" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <RefreshCw size={18} /> Reassign
                  </button>
                  <button onClick={() => handleAction('marked for return')} className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-red-500 text-xs" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <PackageX size={18} /> Return
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Scan History */}
          {!searched && history.length > 0 && (
            <div className="p-4">
              <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Recent Scans</p>
              <div className="space-y-2">
                {history.map(h => (
                  <button key={h.id} onClick={() => handleSearch(h.waybill)} className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-white/5" style={{ backgroundColor: theme.bg.tertiary }}>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accent.light }}><Package size={16} style={{ color: theme.accent.primary }} /></div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm truncate" style={{ color: theme.text.primary }}>{h.waybill}</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{h.customer} • {h.destination}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <StatusBadge status={h.status} />
                      <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{h.scannedAt}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!searched && history.length === 0 && (
            <div className="p-8 text-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: theme.accent.light }}>
                <Scan size={28} style={{ color: theme.accent.primary }} />
              </div>
              <p className="font-medium" style={{ color: theme.text.primary }}>Ready to scan</p>
              <p className="text-sm mt-1" style={{ color: theme.text.muted }}>Type a waybill number to look up a package</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 p-3 border-t text-xs" style={{ borderColor: theme.border.primary, color: theme.text.muted }}>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.bg.tertiary }}>⌘S</kbd> Open scanner</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.bg.tertiary }}>ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  );
};


// ============ NEW PACKAGE DRAWER ============
const STEP_LABELS = ['Customer', 'Package', 'Delivery', 'Review'];
const PRODUCTS = ['Standard', "Pick 'N' Go", 'Dropbox Express', 'Home Delivery', 'Airport Pickup'];
const SIZES = ['Small', 'Medium', 'Large', 'XLarge'];

const NewPackageDrawer = ({ isOpen, onClose, theme, addToast }) => {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    customer: '', phone: '', email: '',
    size: '', weight: '', value: '', cod: false, fragile: false, product: '',
    deliveryMethod: '', destination: '', notes: '',
  });

  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setErrors({});
      setForm({ customer: '', phone: '', email: '', size: '', weight: '', value: '', cod: false, fragile: false, product: '', deliveryMethod: '', destination: '', notes: '' });
    }
  }, [isOpen]);

  const pinnedInfo = useMemo(() => phonePinData.find(p => p.phone === form.phone), [form.phone]);

  useEffect(() => {
    if (pinnedInfo) {
      const terminal = terminalsData.find(t => t.name === pinnedInfo.pinnedTerminal);
      if (terminal) setForm(prev => ({ ...prev, destination: terminal.id }));
    }
  }, [pinnedInfo]);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (step === 0) {
      if (!form.customer.trim()) e.customer = 'Required';
      if (!form.phone.trim()) e.phone = 'Required';
    }
    if (step === 1) {
      if (!form.size) e.size = 'Required';
      if (!form.product) e.product = 'Required';
    }
    if (step === 2) {
      if (!form.deliveryMethod) e.deliveryMethod = 'Required';
      if (!form.destination) e.destination = 'Required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    setStep(s => Math.min(s + 1, 3));
  };

  const handleSubmit = () => {
    const waybill = `LQ-2024-${String(packagesData.length + 1).padStart(5, '0')}`;
    const terminal = terminalsData.find(t => t.id === form.destination);
    addToast({ type: 'success', message: `Package created! Waybill: ${waybill} → ${terminal?.name || form.destination}` });
    onClose();
  };

  if (!isOpen) return null;

  const inputStyle = (field) => ({
    backgroundColor: 'transparent',
    borderColor: errors[field] ? '#ef4444' : theme.border.primary,
    color: theme.text.primary,
  });

  const labelCls = "text-xs font-semibold uppercase block mb-1.5";

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] border-l shadow-2xl z-50 flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
        <div>
          <p className="text-xs" style={{ color: theme.text.muted }}>NEW PACKAGE</p>
          <h2 className="font-semibold" style={{ color: theme.text.primary }}>{STEP_LABELS[step]}</h2>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><X size={18} /></button>
      </div>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: theme.border.primary }}>
        {STEP_LABELS.map((label, i) => (
          <React.Fragment key={label}>
            <button onClick={() => { if (i < step) setStep(i); }} className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold" style={{
                backgroundColor: i < step ? theme.accent.primary : i === step ? theme.accent.light : theme.bg.tertiary,
                color: i < step ? '#fff' : i === step ? theme.accent.primary : theme.text.muted,
              }}>
                {i < step ? <Check size={14} /> : i + 1}
              </div>
              <span className="text-xs hidden sm:inline" style={{ color: i === step ? theme.text.primary : theme.text.muted }}>{label}</span>
            </button>
            {i < 3 && <div className="flex-1 h-0.5" style={{ backgroundColor: i < step ? theme.accent.primary : theme.border.primary }} />}
          </React.Fragment>
        ))}
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Step 1: Customer */}
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Customer Name *</label>
              <input value={form.customer} onChange={e => update('customer', e.target.value)} placeholder="Full name" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('customer')} />
              {errors.customer && <p className="text-xs text-red-500 mt-1">{errors.customer}</p>}
            </div>
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Phone Number *</label>
              <input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+233..." className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('phone')} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              {pinnedInfo && (
                <div className="flex items-center gap-2 mt-2 p-2.5 rounded-lg" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <MapPin size={14} className="text-emerald-500 shrink-0" />
                  <p className="text-xs text-emerald-500">
                    <span className="font-semibold">{pinnedInfo.customer}</span> has pinned locker: <span className="font-mono font-semibold">{pinnedInfo.pinnedAddress}</span> ({pinnedInfo.pinnedTerminal})
                  </p>
                </div>
              )}
            </div>
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Email</label>
              <input value={form.email} onChange={e => update('email', e.target.value)} placeholder="email@example.com" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('email')} />
            </div>
          </div>
        )}

        {/* Step 2: Package Details */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Package Size *</label>
              <div className="grid grid-cols-4 gap-2">
                {SIZES.map(s => (
                  <button key={s} onClick={() => update('size', s)} className="py-2.5 rounded-xl text-sm border text-center" style={{
                    backgroundColor: form.size === s ? theme.accent.light : theme.bg.tertiary,
                    color: form.size === s ? theme.accent.primary : theme.text.secondary,
                    borderColor: form.size === s ? theme.accent.border : errors.size ? '#ef4444' : theme.border.primary,
                  }}>{s}</button>
                ))}
              </div>
              {errors.size && <p className="text-xs text-red-500 mt-1">{errors.size}</p>}
            </div>
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Product / Service *</label>
              <select value={form.product} onChange={e => update('product', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: errors.product ? '#ef4444' : theme.border.primary, color: theme.text.primary }}>
                <option value="">Select service</option>
                {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {errors.product && <p className="text-xs text-red-500 mt-1">{errors.product}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls} style={{ color: theme.text.muted }}>Weight (kg)</label>
                <input type="number" value={form.weight} onChange={e => update('weight', e.target.value)} placeholder="0.0" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('weight')} />
              </div>
              <div>
                <label className={labelCls} style={{ color: theme.text.muted }}>Value (GH₵)</label>
                <input type="number" value={form.value} onChange={e => update('value', e.target.value)} placeholder="0.00" className="w-full px-3 py-2.5 rounded-xl border text-sm" style={inputStyle('value')} />
              </div>
            </div>
            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.cod} onChange={e => update('cod', e.target.checked)} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm" style={{ color: theme.text.secondary }}>Cash on Delivery</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.fragile} onChange={e => update('fragile', e.target.checked)} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm" style={{ color: theme.text.secondary }}>Fragile</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 3: Delivery */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Delivery Method *</label>
              <div className="space-y-2">
                {Object.values(DELIVERY_METHODS).map(m => (
                  <button key={m.id} onClick={() => update('deliveryMethod', m.id)} className="w-full flex items-center gap-3 p-3 rounded-xl border text-left" style={{
                    backgroundColor: form.deliveryMethod === m.id ? `${m.color}10` : theme.bg.tertiary,
                    borderColor: form.deliveryMethod === m.id ? m.color : errors.deliveryMethod ? '#ef4444' : theme.border.primary,
                  }}>
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${m.color}20` }}><m.icon size={18} style={{ color: m.color }} /></div>
                    <span className="text-sm font-medium" style={{ color: form.deliveryMethod === m.id ? m.color : theme.text.secondary }}>{m.label}</span>
                    {form.deliveryMethod === m.id && <CheckCircle2 size={16} style={{ color: m.color }} className="ml-auto" />}
                  </button>
                ))}
              </div>
              {errors.deliveryMethod && <p className="text-xs text-red-500 mt-1">{errors.deliveryMethod}</p>}
            </div>
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Destination Terminal *</label>
              <select value={form.destination} onChange={e => update('destination', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: errors.destination ? '#ef4444' : theme.border.primary, color: theme.text.primary }}>
                <option value="">Select terminal</option>
                {terminalsData.filter(t => t.status === 'online').map(t => (
                  <option key={t.id} value={t.id}>{t.name} — {getTerminalAddress(t)}</option>
                ))}
              </select>
              {errors.destination && <p className="text-xs text-red-500 mt-1">{errors.destination}</p>}
              {pinnedInfo && (
                <p className="text-xs font-mono mt-1" style={{ color: theme.accent.primary }}>Auto-filled from pinned phone address</p>
              )}
            </div>
            <div>
              <label className={labelCls} style={{ color: theme.text.muted }}>Notes</label>
              <textarea rows={3} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Special instructions..." className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent resize-none" style={{ borderColor: theme.border.primary, color: theme.text.primary }} />
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (() => {
          const terminal = terminalsData.find(t => t.id === form.destination);
          const method = DELIVERY_METHODS[form.deliveryMethod];
          const waybill = `LQ-2024-${String(packagesData.length + 1).padStart(5, '0')}`;
          return (
            <div className="space-y-4">
              {/* Waybill */}
              <div className="p-4 rounded-xl text-center" style={{ backgroundColor: theme.accent.light, border: `1px solid ${theme.accent.border}` }}>
                <p className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Waybill Number</p>
                <p className="text-xl font-mono font-bold mt-1" style={{ color: theme.accent.primary }}>{waybill}</p>
              </div>

              {/* Customer */}
              <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</h4>
                  <button onClick={() => setStep(0)} className="text-xs" style={{ color: theme.accent.primary }}>Edit</button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: theme.accent.primary }}>{form.customer.charAt(0) || '?'}</div>
                  <div>
                    <p className="font-medium" style={{ color: theme.text.primary }}>{form.customer}</p>
                    <p className="text-sm" style={{ color: theme.text.muted }}>{form.phone}{form.email ? ` • ${form.email}` : ''}</p>
                  </div>
                </div>
              </div>

              {/* Package */}
              <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Package</h4>
                  <button onClick={() => setStep(1)} className="text-xs" style={{ color: theme.accent.primary }}>Edit</button>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><p className="text-xs" style={{ color: theme.text.muted }}>Size</p><p style={{ color: theme.text.primary }}>{form.size}</p></div>
                  <div><p className="text-xs" style={{ color: theme.text.muted }}>Service</p><p style={{ color: theme.text.primary }}>{form.product}</p></div>
                  {form.weight && <div><p className="text-xs" style={{ color: theme.text.muted }}>Weight</p><p style={{ color: theme.text.primary }}>{form.weight}kg</p></div>}
                  {form.value && <div><p className="text-xs" style={{ color: theme.text.muted }}>Value</p><p style={{ color: theme.text.primary }}>GH₵ {form.value}</p></div>}
                  {form.cod && <div><p className="text-xs" style={{ color: theme.text.muted }}>COD</p><p className="text-amber-500 font-medium">Yes — GH₵ {form.value || '0'}</p></div>}
                  {form.fragile && <div><p className="text-xs" style={{ color: theme.text.muted }}>Fragile</p><p className="text-red-500 font-medium">Yes</p></div>}
                </div>
              </div>

              {/* Delivery */}
              <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Delivery</h4>
                  <button onClick={() => setStep(2)} className="text-xs" style={{ color: theme.accent.primary }}>Edit</button>
                </div>
                <div className="space-y-3 text-sm">
                  {method && (
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${method.color}20` }}><method.icon size={14} style={{ color: method.color }} /></div>
                      <span style={{ color: theme.text.primary }}>{method.label}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-xs" style={{ color: theme.text.muted }}>Terminal</p><p style={{ color: theme.text.primary }}>{terminal?.name || '—'}</p></div>
                    <div><p className="text-xs" style={{ color: theme.text.muted }}>Address</p><p className="font-mono" style={{ color: theme.accent.primary }}>{terminal ? getTerminalAddress(terminal) : '—'}</p></div>
                  </div>
                  {form.notes && <div><p className="text-xs" style={{ color: theme.text.muted }}>Notes</p><p style={{ color: theme.text.secondary }}>{form.notes}</p></div>}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Footer Navigation */}
      <div className="p-4 border-t flex gap-3" style={{ borderColor: theme.border.primary }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <ChevronLeft size={16} /> Back
          </button>
        )}
        {step < 3 ? (
          <button onClick={handleNext} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: theme.accent.primary }}>
            Next <ChevronRight size={16} />
          </button>
        ) : (
          <button onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: theme.accent.primary }}>
            <Send size={16} /> Create Package
          </button>
        )}
      </div>
    </div>
  );
};


// ============ DISPATCH DRAWER ============
const DispatchDrawer = ({ isOpen, onClose, theme, addToast, onViewFull }) => {
  const [selected, setSelected] = useState([]);
  const [driverId, setDriverId] = useState('');

  const pendingPackages = useMemo(() =>
    packagesData.filter(p => ['pending', 'at_warehouse', 'at_dropbox'].includes(p.status)),
  []);

  const inTransitCount = packagesData.filter(p => p.status.startsWith('in_transit')).length;
  const activeDrivers = driversData.filter(d => d.status !== 'offline');
  const selectedDriver = driversData.find(d => String(d.id) === driverId);

  useEffect(() => {
    if (isOpen) { setSelected([]); setDriverId(''); }
  }, [isOpen]);

  const toggleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    setSelected(prev => prev.length === pendingPackages.length ? [] : pendingPackages.map(p => p.id));
  };

  const handleDispatch = () => {
    if (selected.length === 0 || !selectedDriver) return;
    addToast({ type: 'success', message: `${selected.length} package${selected.length > 1 ? 's' : ''} dispatched to ${selectedDriver.name}` });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] border-l shadow-2xl z-50 flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accent.light }}>
            <Truck size={20} style={{ color: theme.accent.primary }} />
          </div>
          <div>
            <h2 className="font-semibold" style={{ color: theme.text.primary }}>Quick Dispatch</h2>
            <p className="text-xs" style={{ color: theme.text.muted }}>Assign packages to drivers</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><X size={18} /></button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 p-4 border-b" style={{ borderColor: theme.border.primary }}>
        <div className="p-3 rounded-xl text-center" style={{ backgroundColor: theme.bg.tertiary }}>
          <p className="text-lg font-bold" style={{ color: theme.accent.primary }}>{pendingPackages.length}</p>
          <p className="text-xs" style={{ color: theme.text.muted }}>Pending</p>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ backgroundColor: theme.bg.tertiary }}>
          <p className="text-lg font-bold" style={{ color: '#3b82f6' }}>{inTransitCount}</p>
          <p className="text-xs" style={{ color: theme.text.muted }}>In Transit</p>
        </div>
        <div className="p-3 rounded-xl text-center" style={{ backgroundColor: theme.bg.tertiary }}>
          <p className="text-lg font-bold" style={{ color: '#10b981' }}>{activeDrivers.length}</p>
          <p className="text-xs" style={{ color: theme.text.muted }}>Active Drivers</p>
        </div>
      </div>

      {/* Package List */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: theme.border.primary }}>
          <div className="flex items-center gap-2">
            <Checkbox checked={selected.length === pendingPackages.length && pendingPackages.length > 0} onChange={toggleAll} theme={theme} />
            <span className="text-sm" style={{ color: theme.text.secondary }}>
              {selected.length > 0 ? `${selected.length} selected` : 'Select all'}
            </span>
          </div>
          <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary }}>
            {pendingPackages.length} packages
          </span>
        </div>

        {pendingPackages.length === 0 ? (
          <div className="p-8 text-center">
            <CheckCircle2 size={32} className="mx-auto mb-2 text-emerald-500" />
            <p className="font-medium" style={{ color: theme.text.primary }}>All caught up!</p>
            <p className="text-sm mt-1" style={{ color: theme.text.muted }}>No pending packages to dispatch</p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: theme.border.primary }}>
            {pendingPackages.map(pkg => (
              <div key={pkg.id} onClick={() => toggleSelect(pkg.id)} className={`flex items-start gap-3 p-4 cursor-pointer transition-colors ${selected.includes(pkg.id) ? '' : 'hover:bg-white/5'}`} style={{ backgroundColor: selected.includes(pkg.id) ? theme.accent.light : 'transparent', borderColor: theme.border.primary }}>
                <div className="pt-0.5">
                  <Checkbox checked={selected.includes(pkg.id)} onChange={() => toggleSelect(pkg.id)} theme={theme} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-medium" style={{ color: theme.text.primary }}>{pkg.waybill}</span>
                    <DeliveryMethodBadge method={pkg.deliveryMethod} />
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: theme.text.secondary }}>{pkg.customer}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs" style={{ color: theme.text.muted }}>
                      <MapPin size={12} /> {pkg.destination}
                    </span>
                    <span className="text-xs" style={{ color: theme.text.muted }}>{pkg.size} • {pkg.weight}</span>
                  </div>
                </div>
                <StatusBadge status={pkg.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Driver & Dispatch */}
      <div className="border-t p-4 space-y-3" style={{ borderColor: theme.border.primary }}>
        <div>
          <label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Assign Driver</label>
          <select value={driverId} onChange={e => setDriverId(e.target.value)} className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
            <option value="">Select driver</option>
            {activeDrivers.map(d => (
              <option key={d.id} value={d.id}>{d.name} — {d.zone} ({d.deliveriesToday} today)</option>
            ))}
          </select>
        </div>

        {selectedDriver && (
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: '#10b981' }}>{selectedDriver.name.charAt(0)}</div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{selectedDriver.name}</p>
              <p className="text-xs" style={{ color: theme.text.muted }}>{selectedDriver.vehicle}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium" style={{ color: '#f59e0b' }}>★ {selectedDriver.rating}</p>
              <p className="text-xs" style={{ color: theme.text.muted }}>{selectedDriver.zone}</p>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleDispatch}
            disabled={selected.length === 0 || !driverId}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm font-medium ${selected.length === 0 || !driverId ? 'opacity-50 cursor-not-allowed' : ''}`}
            style={{ backgroundColor: theme.accent.primary }}
          >
            <Send size={16} /> Dispatch {selected.length > 0 ? `${selected.length} Package${selected.length > 1 ? 's' : ''}` : ''}
          </button>
          <button onClick={() => { onViewFull(); onClose(); }} className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Eye size={16} /> Full View
          </button>
        </div>
      </div>
    </div>
  );
};


// ============ UI COMPONENTS ============

const StatusBadge = ({ status }) => {
  const config = ALL_STATUSES[status] || { label: status, color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' };
  return <span className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap" style={{ backgroundColor: config.bg, color: config.color }}>{config.label}</span>;
};

const DeliveryMethodBadge = ({ method }) => {
  const config = DELIVERY_METHODS[method] || DELIVERY_METHODS.warehouse_to_locker;
  const Icon = config.icon;
  return <div className="flex items-center gap-1.5"><Icon size={14} style={{ color: config.color }} /><span className="text-xs font-medium" style={{ color: config.color }}>{config.label}</span></div>;
};

const RoleBadge = ({ role }) => {
  const r = ROLES[role];
  if (!r) return null;
  return <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${r.color}15`, color: r.color }}><Shield size={10} />{r.name}</span>;
};

const MetricCard = ({ title, value, change, changeType, icon: Icon, subtitle, theme, loading }) => (
  <div className="rounded-2xl p-5 border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
    {loading ? (
      <div className="animate-pulse">
        <div className="h-4 w-20 rounded mb-2" style={{ backgroundColor: theme.border.primary }} />
        <div className="h-8 w-24 rounded mb-1" style={{ backgroundColor: theme.border.primary }} />
        <div className="h-3 w-16 rounded" style={{ backgroundColor: theme.border.primary }} />
      </div>
    ) : (
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm" style={{ color: theme.text.secondary }}>{title}</p>
          <p className="text-3xl font-bold mt-1" style={{ color: theme.text.primary }}>{value}</p>
          {change && <p className={`text-sm mt-1 flex items-center ${changeType === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>{changeType === 'up' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}{change}</p>}
          {subtitle && <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{subtitle}</p>}
        </div>
        <div className="p-3 rounded-xl" style={{ backgroundColor: theme.accent.light }}><Icon size={24} style={{ color: theme.accent.primary }} /></div>
      </div>
    )}
  </div>
);

const QuickAction = ({ icon: Icon, label, theme, disabled, onClick, badge }) => (
  <button disabled={disabled} onClick={onClick} className={`flex flex-col items-center gap-2 p-4 rounded-xl border relative ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'} transition-all`} style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
    {badge && <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs text-white flex items-center justify-center" style={{ backgroundColor: theme.accent.primary }}>{badge}</span>}
    <div className="p-3 rounded-lg" style={{ backgroundColor: theme.accent.light }}><Icon size={20} style={{ color: theme.accent.primary }} /></div>
    <span className="text-xs" style={{ color: theme.text.secondary }}>{label}</span>
  </button>
);

const Checkbox = ({ checked, onChange, theme }) => (
  <button onClick={onChange} className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors" style={{ backgroundColor: checked ? theme.accent.primary : 'transparent', borderColor: checked ? theme.accent.primary : theme.border.secondary }}>
    {checked && <Check size={12} className="text-white" />}
  </button>
);

// ============ SIDEBAR ============
const Sidebar = ({ isCollapsed, setIsCollapsed, activeMenu, setActiveMenu, activeSubMenu, setActiveSubMenu, theme, userRole, isMobile, onCloseMobile }) => {
  const [expandedMenus, setExpandedMenus] = useState(['packages']);
  const menuGroups = [
    { label: 'Overview', items: [{ icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', permission: 'dashboard.view' }] },
    { label: 'Operations', items: [
      { icon: Package, label: 'Packages', id: 'packages', permission: 'packages.view', subItems: ['All Packages', 'In Locker', 'Pending Pickup', 'Expired'] },
      { icon: Truck, label: 'Dispatch', id: 'dispatch', permission: 'packages.dispatch', subItems: ['Outgoing', 'Route Planning', 'Driver Assignment'] },
      { icon: MessageSquare, label: 'Notifications', id: 'notifications', permission: 'packages.view', subItems: ['Message Center', 'Templates', 'Auto-Rules', 'History', 'Settings'] },
      { icon: AlertOctagon, label: 'SLA Monitor', id: 'sla', permission: 'packages.view', subItems: ['Live Monitor', 'Escalation Rules', 'Compliance', 'Incident Log'] },
    ]},
    { label: 'Management', items: [
      { icon: Grid3X3, label: 'Lockers', id: 'lockers', permission: 'lockers.view', subItems: ['All Lockers', 'Maintenance', 'Configuration'] },
      { icon: Inbox, label: 'Dropboxes', id: 'dropboxes', permission: 'packages.view', subItems: ['Overview', 'Collections', 'Agents', 'Package Flow'] },
      { icon: Building2, label: 'Terminals', id: 'terminals', permission: 'terminals.view' },
      { icon: Users, label: 'Customers', id: 'customers', permission: 'customers.view', subItems: ['All Customers', 'Subscribers', 'B2B Partners', 'Support Tickets'] },
      { icon: UserCheck, label: 'Staff', id: 'staff', permission: 'staff.view', subItems: ['Agents', 'Teams', 'Performance'] },
    ]},
    { label: 'Business', items: [
      { icon: Briefcase, label: 'Business Portal', id: 'portal', permission: 'reports.view', subItems: ['Partner Dashboard', 'Bulk Shipments', 'Invoices & Billing', 'API Management', 'Partner Analytics'] },
      { icon: Smartphone, label: 'Partner Portal', id: 'selfservice', permission: 'dashboard.view', subItems: ['Portal Home', 'Ship Now', 'Track Packages', 'Locker Map', 'My Billing', 'API Console', 'Help Center'] },
      { icon: DollarSign, label: 'Accounting', id: 'accounting', permission: 'reports.view', subItems: ['Transactions', 'Invoices', 'Reports'] },
      { icon: Receipt, label: 'Pricing Engine', id: 'pricing', permission: 'reports.view', subItems: ['Rate Card', 'Delivery Methods', 'SLA Tiers', 'Surcharges', 'Volume Discounts', 'Partner Overrides'] },
      { icon: TrendingUp, label: 'Analytics', id: 'analytics', permission: 'reports.view' },
      { icon: History, label: 'Audit Log', id: 'audit', permission: 'reports.view' },
    ]},
  ];
  const toggleMenu = (id) => setExpandedMenus(p => p.includes(id) ? p.filter(m => m !== id) : [...p, id]);

  const handleMenuClick = (item) => {
    if (item.subItems) toggleMenu(item.id);
    setActiveMenu(item.id);
    setActiveSubMenu(null);
    if (isMobile) onCloseMobile();
  };

  const handleSubMenuClick = (item, sub) => {
    setActiveMenu(item.id);
    setActiveSubMenu(sub);
    if (isMobile) onCloseMobile();
  };

  return (
    <>
      {isMobile && <div className="fixed inset-0 bg-black/50 z-40" onClick={onCloseMobile} />}
      <aside className={`${isMobile ? 'fixed inset-y-0 left-0 z-50' : ''} ${isCollapsed && !isMobile ? 'w-20' : 'w-72'} border-r flex flex-col transition-all`} style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
        <div className="h-16 flex items-center justify-between px-4 border-b" style={{ borderColor: theme.border.primary }}>
          {(!isCollapsed || isMobile) && <span className="font-bold text-lg" style={{ color: theme.text.primary }}>LocQar</span>}
          {isCollapsed && !isMobile && <span className="font-bold text-sm" style={{ color: theme.text.primary }}>LQ</span>}
          {!isMobile && <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-lg" style={{ backgroundColor: theme.bg.hover }}>{isCollapsed ? <ChevronRight size={18} style={{ color: theme.text.secondary }}/> : <ChevronLeft size={18} style={{ color: theme.text.secondary }}/>}</button>}
          {isMobile && <button onClick={onCloseMobile} className="p-2 rounded-lg" style={{ color: theme.text.secondary }}><X size={18} /></button>}
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuGroups.map((group, idx) => (
            <div key={group.label} className={idx > 0 ? 'mt-6' : ''}>
              {(!isCollapsed || isMobile) && <p className="px-3 mb-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>{group.label}</p>}
              <div className="space-y-1">
                {group.items.map((item) => {
                  if (!hasPermission(userRole, item.permission)) return null;
                  return (
                    <div key={item.id}>
                      <button onClick={() => handleMenuClick(item)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ backgroundColor: activeMenu === item.id ? theme.accent.light : 'transparent', border: activeMenu === item.id ? `1px solid ${theme.accent.border}` : '1px solid transparent', color: activeMenu === item.id ? theme.accent.primary : theme.text.secondary }}>
                        <item.icon size={20} />
                        {(!isCollapsed || isMobile) && <><span className="flex-1 text-sm text-left">{item.label}</span>{item.subItems && <ChevronDown size={16} className={`transition-transform ${expandedMenus.includes(item.id) ? 'rotate-180' : ''}`} />}</>}
                      </button>
                      {(!isCollapsed || isMobile) && item.subItems && expandedMenus.includes(item.id) && (
                        <div className="mt-1 ml-4 pl-4 space-y-1" style={{ borderLeft: `1px solid ${theme.border.primary}` }}>
                          {item.subItems.map(sub => (
                            <button key={sub} onClick={() => handleSubMenuClick(item, sub)} className="w-full text-left px-3 py-2 rounded-lg text-sm" style={{ color: activeSubMenu === sub ? theme.accent.primary : theme.text.muted, backgroundColor: activeSubMenu === sub ? theme.accent.light : 'transparent' }}>{sub}</button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-3 border-t" style={{ borderColor: theme.border.primary }}>
          <button onClick={() => { setActiveMenu('settings'); if (isMobile) onCloseMobile(); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl" style={{ color: activeMenu === 'settings' ? theme.accent.primary : theme.text.secondary, backgroundColor: activeMenu === 'settings' ? theme.accent.light : 'transparent' }}>
            <Settings size={20} />{(!isCollapsed || isMobile) && <span className="text-sm">Settings</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

// ============ PACKAGE STATUS FLOW ============
const PackageStatusFlow = ({ status, deliveryMethod }) => {
  const method = DELIVERY_METHODS[deliveryMethod] || DELIVERY_METHODS.warehouse_to_locker;
  let steps = deliveryMethod === 'dropbox_to_locker' 
    ? ['Pending', 'At Dropbox', 'In Transit', 'In Locker', 'Picked Up']
    : deliveryMethod === 'locker_to_home'
    ? ['Pending', 'At Warehouse', 'In Transit', 'Delivered']
    : ['Pending', 'At Warehouse', 'In Transit', 'In Locker', 'Picked Up'];
  const statusMap = { pending: 0, at_warehouse: 1, at_dropbox: 1, in_transit_to_locker: 2, in_transit_to_home: 2, delivered_to_locker: 3, delivered_to_home: 3, picked_up: 4 };
  const currentStep = statusMap[status] ?? 0;
  
  return (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, idx) => (
        <React.Fragment key={step}>
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${idx === currentStep ? 'ring-2 ring-offset-1' : ''}`} style={{ backgroundColor: idx <= currentStep ? method.color : 'rgba(107, 114, 128, 0.2)', ringColor: method.color }}>
              {idx < currentStep ? <CheckCircle size={14} className="text-white" /> : idx === currentStep ? <Circle size={8} className="text-white fill-white" /> : <Circle size={8} style={{ color: 'rgba(107, 114, 128, 0.5)' }} />}
            </div>
            <span className={`text-xs mt-1 ${idx === currentStep ? 'font-medium' : ''}`} style={{ color: idx <= currentStep ? method.color : '#6b7280' }}>{step}</span>
          </div>
          {idx < steps.length - 1 && <div className="flex-1 h-0.5 -mt-4" style={{ backgroundColor: idx < currentStep ? method.color : 'rgba(107, 114, 128, 0.2)' }} />}
        </React.Fragment>
      ))}
    </div>
  );
};


// ============ PACKAGE DETAIL DRAWER ============
const PackageDetailDrawer = ({ pkg, onClose, theme, userRole, addToast, onReassign, onReturn }) => {
  const [activeTab, setActiveTab] = useState('details');
  if (!pkg) return null;

  const handleAction = (action) => {
    if (action === 'reassigned') { onReassign(pkg); return; }
    if (action === 'marked for return') { onReturn(pkg); return; }
    addToast({ type: 'success', message: `Package ${action} successfully` });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] border-l shadow-2xl z-50 flex flex-col" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
      <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: theme.border.primary }}>
        <div><p className="text-xs" style={{ color: theme.text.muted }}>PACKAGE</p><h2 className="font-semibold" style={{ color: theme.text.primary }}>{pkg.waybill}</h2></div>
        <div className="flex gap-2">
          {hasPermission(userRole, 'packages.update') && <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><Edit size={18} /></button>}
          <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><Printer size={18} /></button>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.secondary }}><X size={18} /></button>
        </div>
      </div>
      <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
        <div className="flex items-center justify-between mb-3"><DeliveryMethodBadge method={pkg.deliveryMethod} /><StatusBadge status={pkg.status} /></div>
        <PackageStatusFlow status={pkg.status} deliveryMethod={pkg.deliveryMethod} />
      </div>
      {pkg.locker && pkg.locker !== '-' && (
        <div className="mx-4 mt-4 p-4 rounded-xl" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Grid3X3 size={20} className="text-emerald-500" />
              <div><p className="text-sm font-medium text-emerald-500">Locker {pkg.locker}</p><p className="text-xs" style={{ color: theme.text.muted }}>{pkg.destination}</p><p className="text-xs font-mono" style={{ color: '#10b981' }}>{getLockerAddress(pkg.locker, pkg.destination)}</p></div>
            </div>
            {pkg.daysInLocker > 0 && <div className="flex items-center gap-1"><Timer size={14} className={pkg.daysInLocker > 5 ? 'text-red-500' : 'text-amber-500'} /><span className={`text-sm ${pkg.daysInLocker > 5 ? 'text-red-500' : 'text-amber-500'}`}>{pkg.daysInLocker}d</span></div>}
          </div>
          {pkg.cod && <div className="flex items-center gap-2 mt-3 pt-3 border-t border-emerald-500/20"><Banknote size={16} className="text-amber-500" /><span className="text-sm text-amber-500 font-medium">COD: GH₵ {pkg.value}</span></div>}
        </div>
      )}
      <div className="flex gap-1 p-4 border-b" style={{ borderColor: theme.border.primary }}>
        {['details', 'tracking', 'messages'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className="px-4 py-2 rounded-lg text-sm capitalize" style={{ backgroundColor: activeTab === tab ? theme.bg.tertiary : 'transparent', color: activeTab === tab ? theme.text.primary : theme.text.muted }}>{tab}</button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'details' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
              <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Customer</h3>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: theme.accent.primary }}>{pkg.customer.charAt(0)}</div>
                <div><p style={{ color: theme.text.primary }}>{pkg.customer}</p><p className="text-sm" style={{ color: theme.text.muted }}>{pkg.phone}</p></div>
              </div>
            </div>
            <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
              <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[['Destination', pkg.destination], ['Locker Address', (() => { const t = terminalsData.find(t => t.name === pkg.destination); return t ? (pkg.locker !== '-' ? getLockerAddress(pkg.locker, pkg.destination) : getTerminalAddress(t)) : '—'; })()], ['Service', pkg.product], ['Value', `GH₵ ${pkg.value}`], ['Weight', pkg.weight], ['Size', pkg.size], ['Method', DELIVERY_METHODS[pkg.deliveryMethod]?.label]].map(([l, v]) => (
                  <div key={l}><p className="text-xs" style={{ color: theme.text.muted }}>{l}</p><p className={l === 'Locker Address' ? 'font-mono' : ''} style={{ color: l === 'Locker Address' ? theme.accent.primary : theme.text.primary }}>{v}</p></div>
                ))}
              </div>
            </div>
            {hasPermission(userRole, 'packages.update') && (
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => handleAction('marked as delivered')} className="flex flex-col items-center gap-2 p-3 rounded-xl text-emerald-500" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}><CheckCircle2 size={20} /><span className="text-xs">Delivered</span></button>
                <button onClick={() => handleAction('reassigned')} className="flex flex-col items-center gap-2 p-3 rounded-xl text-amber-500" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}><RefreshCw size={20} /><span className="text-xs">Reassign</span></button>
                <button onClick={() => handleAction('marked for return')} className="flex flex-col items-center gap-2 p-3 rounded-xl text-red-500" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}><PackageX size={20} /><span className="text-xs">Return</span></button>
              </div>
            )}
          </div>
        )}
        {activeTab === 'tracking' && (
          <div className="space-y-4">
            {[{ time: '14:32', event: 'Deposited in Locker A-15', current: true }, { time: '12:18', event: 'Arrived at terminal' }, { time: '08:45', event: 'Out for delivery' }, { time: 'Yesterday', event: 'Received at warehouse' }].map((t, i) => (
              <div key={i} className="flex gap-3">
                <div className={`w-3 h-3 rounded-full mt-1 ${t.current ? 'bg-emerald-500' : ''}`} style={{ backgroundColor: t.current ? undefined : theme.border.secondary }} />
                <div><p style={{ color: theme.text.primary }}>{t.event}</p><p className="text-xs" style={{ color: theme.text.muted }}>{t.time}</p></div>
              </div>
            ))}
          </div>
        )}
        {activeTab === 'messages' && (
          <div className="text-center py-8">
            <MessageSquare size={32} style={{ color: theme.text.muted }} className="mx-auto mb-2" />
            <p className="text-sm" style={{ color: theme.text.muted }}>No messages</p>
            {hasPermission(userRole, 'customers.communicate') && (
              <button className="mt-4 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Send size={14} className="inline mr-2" />Send SMS</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============ PIE CHART FOR STATUS DISTRIBUTION ============
const StatusPieChart = ({ data, theme }) => {
  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280'];
  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
          {data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
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
  const [currentUser, setCurrentUser] = useState({ name: 'John Doe', email: 'john@locqar.com', role: 'SUPER_ADMIN' });
  const [packageFilter, setPackageFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [packageSearch, setPackageSearch] = useState('');
  const [packageSort, setPackageSort] = useState({ field: 'createdAt', dir: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showNewPackage, setShowNewPackage] = useState(false);
  const [showDispatchDrawer, setShowDispatchDrawer] = useState(false);
  const [reassignPackage, setReassignPackage] = useState(null);
  const [returnPackage, setReturnPackage] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeTab, setRouteTab] = useState('stops');
  const [expandedStops, setExpandedStops] = useState([]);

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
  const [metrics, setMetrics] = useState({ totalPackages: 1847, inLockers: 892, inTransit: 234, pendingPickup: 156, revenue: 48200 });

  const addToast = useCallback((toast) => {
    const id = Date.now();
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

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
      setMetrics(prev => ({ ...prev, totalPackages: prev.totalPackages + Math.floor(Math.random() * 3), inTransit: Math.max(0, prev.inTransit + Math.floor(Math.random() * 3) - 1) }));
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
      addToast({ type: 'success', message: `${count} package${count > 1 ? 's' : ''} marked as delivered` });
      setSelectedItems([]);
    } else if (action === 'print') {
      addToast({ type: 'success', message: `Printing labels for ${count} package${count > 1 ? 's' : ''}` });
      setSelectedItems([]);
    } else if (action === 'delete') {
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
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.location.toLowerCase().includes(q) || t.region.toLowerCase().includes(q) || t.city.toLowerCase().includes(q));
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
    if (lockerSizeFilter !== 'all') result = result.filter(l => l.size.toLowerCase() === lockerSizeFilter);
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
      result = result.filter(s => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.terminal.toLowerCase().includes(q));
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

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: theme.bg.primary, fontFamily: theme.font.primary }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;600&display=swap'); * { font-family: 'Sora', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; } ::-webkit-scrollbar { width: 6px; height: 6px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${theme.border.secondary}; border-radius: 3px; } .font-mono { font-family: 'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace !important; } @keyframes slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } } .animate-slide-in { animation: slide-in 0.3s ease-out; }`}</style>

        {(!isMobile || mobileSidebarOpen) && (
          <Sidebar isCollapsed={sidebarCollapsed} setIsCollapsed={setSidebarCollapsed} activeMenu={activeMenu} setActiveMenu={setActiveMenu} activeSubMenu={activeSubMenu} setActiveSubMenu={setActiveSubMenu} theme={theme} userRole={currentUser.role} isMobile={isMobile} onCloseMobile={() => setMobileSidebarOpen(false)} />
        )}

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 border-b px-4 md:px-6 flex items-center justify-between sticky top-0 z-30" style={{ backgroundColor: theme.bg.secondary, borderColor: theme.border.primary }}>
            <div className="flex items-center gap-3">
              {isMobile && <button onClick={() => setMobileSidebarOpen(true)} className="p-2 rounded-lg" style={{ color: theme.text.secondary }}><Menu size={20} /></button>}
              <button onClick={() => setShowSearch(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border w-48 md:w-96" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                <Search size={16} style={{ color: theme.text.muted }} />
                <span className="text-sm hidden md:inline" style={{ color: theme.text.muted }}>Search...</span>
                <kbd className="ml-auto px-1.5 py-0.5 rounded text-xs hidden md:inline" style={{ backgroundColor: theme.bg.secondary, color: theme.text.muted }}>⌘K</kbd>
              </button>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button onClick={() => setShowShortcuts(true)} className="p-2.5 rounded-xl border hidden md:flex" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}><Keyboard size={18} style={{ color: theme.text.secondary }} /></button>
              <button onClick={() => setThemeName(t => t === 'dark' ? 'light' : 'dark')} className="p-2.5 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>{themeName === 'dark' ? <Sun size={18} style={{ color: theme.text.secondary }} /> : <Moon size={18} style={{ color: theme.text.secondary }} />}</button>
              {hasPermission(currentUser.role, 'packages.scan') && <button onClick={() => setShowScanModal(true)} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><QrCode size={18} />Scan</button>}
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2.5 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}><Bell size={18} style={{ color: theme.text.secondary }} /><span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs text-white flex items-center justify-center" style={{ backgroundColor: theme.accent.primary }}>{notifications.filter(n => !n.read).length}</span></button>
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-xl z-50" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                      <span className="font-semibold" style={{ color: theme.text.primary }}>Notifications</span>
                      <button onClick={() => setShowNotifications(false)} className="text-xs" style={{ color: theme.accent.primary }}>Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className="p-3 border-b flex gap-3" style={{ backgroundColor: n.read ? 'transparent' : theme.accent.light, borderColor: theme.border.primary }}>
                          <div className={`w-2 h-2 rounded-full mt-2 ${n.type === 'error' ? 'bg-red-500' : n.type === 'warning' ? 'bg-amber-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                          <div><p className="text-sm" style={{ color: theme.text.primary }}>{n.title}</p><p className="text-xs" style={{ color: theme.text.muted }}>{n.time}</p></div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden md:flex items-center gap-3 pl-3 border-l" style={{ borderColor: theme.border.primary }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-semibold" style={{ backgroundColor: ROLES[currentUser.role]?.color }}>{currentUser.name.charAt(0)}</div>
                <div className="text-right">
                  <p className="text-sm" style={{ color: theme.text.primary }}>{currentUser.name}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{ROLES[currentUser.role]?.name}</p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content Area */}
          <main className="flex-1 overflow-auto">
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
                addToast={addToast}
              />
            )}

            {/* Lockers Page */}
            {activeMenu === 'lockers' && (
              <LockersPage
                currentUser={currentUser}
                loading={loading}
                activeSubMenu={activeSubMenu}
                setShowExport={setShowExport}
                lockerSearch={lockerSearch}
                setLockerSearch={setLockerSearch}
                lockerStatusFilter={lockerStatusFilter}
                setLockerStatusFilter={setLockerStatusFilter}
                lockerTerminalFilter={lockerTerminalFilter}
                setLockerTerminalFilter={setLockerTerminalFilter}
                lockerSizeFilter={lockerSizeFilter}
                setLockerSizeFilter={setLockerSizeFilter}
                lockerSort={lockerSort}
                setLockerSort={setLockerSort}
                filteredLockers={filteredLockers}
                addToast={addToast}
              />
            )}


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
                setShowDispatchDrawer={setShowDispatchDrawer}
                filteredDispatchPackages={filteredDispatchPackages}
                dispatchSearch={dispatchSearch}
                setDispatchSearch={setDispatchSearch}
                setDispatchPage={setDispatchPage}
                dispatchFilter={dispatchFilter}
                setDispatchFilter={setDispatchFilter}
                selectedDispatchItems={selectedDispatchItems}
                paginatedDispatchPackages={paginatedDispatchPackages}
                toggleDispatchSelectAll={toggleDispatchSelectAll}
                toggleDispatchSelectItem={toggleDispatchSelectItem}
                dispatchSort={dispatchSort}
                setDispatchSort={setDispatchSort}
                setSelectedPackage={setSelectedPackage}
                dispatchTotalPages={dispatchTotalPages}
                dispatchPage={dispatchPage}
                dispatchPageSize={dispatchPageSize}
                setDispatchPageSize={setDispatchPageSize}
                selectedRoute={selectedRoute}
                setSelectedRoute={setSelectedRoute}
                routeTab={routeTab}
                setRouteTab={setRouteTab}
                expandedStops={expandedStops}
                setExpandedStops={setExpandedStops}
                driverSearch={driverSearch}
                setDriverSearch={setDriverSearch}
                driverSort={driverSort}
                setDriverSort={setDriverSort}
                filteredDrivers={filteredDrivers}
                addToast={addToast}
              />
            )}


            {/* Customers Page */}
            {activeMenu === 'customers' && (
              <CustomersPage
                currentUser={currentUser}
                loading={loading}
                customerSearch={customerSearch}
                setCustomerSearch={setCustomerSearch}
                customerTypeFilter={customerTypeFilter}
                setCustomerTypeFilter={setCustomerTypeFilter}
                customerSort={customerSort}
                setCustomerSort={setCustomerSort}
                filteredCustomers={filteredCustomers}
                addToast={addToast}
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
              />
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
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Pricing Engine</h1>
                    <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Rate Card'}</p>
                  </div>
                  <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={16} />Export</button>
                </div>

                {(!activeSubMenu || activeSubMenu === 'Rate Card') && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {BASE_RATE_CARD.map(r => (
                        <div key={r.id} className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                          <div className="text-2xl mb-2">{r.icon}</div>
                          <p className="font-semibold" style={{ color: theme.text.primary }}>{r.size}</p>
                          <p className="text-xs mb-2" style={{ color: theme.text.muted }}>{r.dimensions}</p>
                          <p className="text-3xl font-bold" style={{ color: theme.accent.primary }}>GH₵ {r.basePrice}</p>
                          <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Max {r.maxWeight} kg</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
                        <h3 className="font-semibold" style={{ color: theme.text.primary }}>Base Rate Comparison</h3>
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Size</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Dimensions</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Max Weight</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Base Price</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Express (1.5x)</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Rush (2.2x)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {BASE_RATE_CARD.map(r => (
                            <tr key={r.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <td className="p-3"><span className="font-medium" style={{ color: theme.text.primary }}>{r.size}</span></td>
                              <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{r.dimensions}</span></td>
                              <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{r.maxWeight} kg</span></td>
                              <td className="p-3"><span className="font-medium" style={{ color: theme.accent.primary }}>GH₵ {r.basePrice.toFixed(2)}</span></td>
                              <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: '#f59e0b' }}>GH₵ {(r.basePrice * 1.5).toFixed(2)}</span></td>
                              <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: '#ef4444' }}>GH₵ {(r.basePrice * 2.2).toFixed(2)}</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeSubMenu === 'Delivery Methods' && (
                  <div className="space-y-4">
                    {DELIVERY_METHOD_PRICING.map(dm => (
                      <div key={dm.id} className="p-5 rounded-2xl border flex flex-col md:flex-row md:items-center gap-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${dm.color}15` }}>
                          <dm.icon size={24} style={{ color: dm.color }} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold" style={{ color: theme.text.primary }}>{dm.label}</p>
                          <p className="text-sm" style={{ color: theme.text.muted }}>{dm.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold" style={{ color: dm.baseMarkup > 0 ? dm.color : '#10b981' }}>+{dm.baseMarkup}%</p>
                          <p className="text-xs" style={{ color: theme.text.muted }}>markup on base</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSubMenu === 'SLA Tiers' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {SLA_TIERS.map(sla => (
                        <div key={sla.id} className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                          <div className="text-2xl mb-2">{sla.icon}</div>
                          <p className="font-semibold" style={{ color: sla.color }}>{sla.name}</p>
                          <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{sla.description}</p>
                          <div className="flex items-end gap-1">
                            <span className="text-3xl font-bold" style={{ color: theme.text.primary }}>{sla.hours}</span>
                            <span className="text-sm mb-1" style={{ color: theme.text.muted }}>hrs</span>
                          </div>
                          <p className="text-sm mt-2" style={{ color: sla.color }}>{sla.multiplier}x multiplier</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Revenue by SLA Tier</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={pricingRevenueData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                          <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} formatter={v => `GH₵ ${v.toLocaleString()}`} />
                          <Bar dataKey="standard" fill="#6b7280" radius={[0, 0, 0, 0]} name="Standard" />
                          <Bar dataKey="express" fill="#f59e0b" name="Express" />
                          <Bar dataKey="rush" fill="#ef4444" name="Rush" />
                          <Bar dataKey="economy" fill="#10b981" radius={[0, 0, 0, 0]} name="Economy" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {activeSubMenu === 'Surcharges' && (
                  <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
                      <h3 className="font-semibold" style={{ color: theme.text.primary }}>Surcharges & Fees</h3>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Surcharge</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Category</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Type</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Value</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SURCHARGES.map(sc => (
                          <tr key={sc.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <td className="p-3">
                              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{sc.name}</p>
                              <p className="text-xs" style={{ color: theme.text.muted }}>{sc.description}</p>
                            </td>
                            <td className="p-3 hidden md:table-cell"><span className="text-xs px-2 py-1 rounded-full capitalize" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}>{sc.category}</span></td>
                            <td className="p-3"><span className="text-sm capitalize" style={{ color: theme.text.secondary }}>{sc.type.replace('_', '/')}</span></td>
                            <td className="p-3"><span className="font-medium" style={{ color: theme.accent.primary }}>{sc.type === 'percentage' ? `${sc.value}%` : sc.type === 'per_day' && sc.tiers ? 'Tiered' : `GH₵ ${sc.value}`}</span></td>
                            <td className="p-3">
                              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: sc.active ? '#10b98115' : '#ef444415', color: sc.active ? '#10b981' : '#ef4444' }}>{sc.active ? 'Active' : 'Inactive'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeSubMenu === 'Volume Discounts' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {VOLUME_DISCOUNT_TIERS.map((vt, i) => (
                        <div key={vt.label} className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                          <p className="font-semibold" style={{ color: theme.text.primary }}>{vt.label}</p>
                          <p className="text-xs mb-2" style={{ color: theme.text.muted }}>{vt.min}–{vt.max === Infinity ? '∞' : vt.max} pkgs/mo</p>
                          <p className="text-3xl font-bold" style={{ color: i === 0 ? theme.text.muted : '#10b981' }}>{vt.discount}%</p>
                          <p className="text-xs" style={{ color: theme.text.muted }}>discount</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl border p-5" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Free Storage Days by Tier</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {Object.entries(STORAGE_FREE_DAYS).map(([tier, days]) => (
                          <div key={tier} className="p-3 rounded-xl border text-center" style={{ borderColor: theme.border.primary }}>
                            <p className="text-xs capitalize mb-1" style={{ color: theme.text.muted }}>{tier}</p>
                            <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{days}</p>
                            <p className="text-xs" style={{ color: theme.text.muted }}>days free</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSubMenu === 'Partner Overrides' && (
                  <div className="space-y-4">
                    {PARTNER_PRICING_OVERRIDES.map(pp => (
                      <div key={pp.partnerId} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{pp.logo}</span>
                            <div>
                              <p className="font-semibold" style={{ color: theme.text.primary }}>{pp.partnerName}</p>
                              <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: TIERS[pp.tier]?.bg, color: TIERS[pp.tier]?.color }}>{pp.tier}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm" style={{ color: theme.text.muted }}>Volume Discount</p>
                            <p className="text-xl font-bold" style={{ color: '#10b981' }}>{pp.volumeDiscount}%</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 text-sm">
                            {pp.customRates ? Object.entries(pp.customRates).map(([sz, price]) => (
                              <div key={sz} className="p-2 rounded-lg text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                                <p className="text-xs" style={{ color: theme.text.muted }}>{sz}</p>
                                <p className="font-bold" style={{ color: theme.accent.primary }}>GH₵ {price}</p>
                              </div>
                            )) : <span className="col-span-4 text-sm" style={{ color: theme.text.muted }}>Standard public pricing</span>}
                            <div className="p-2 rounded-lg text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                              <p className="text-xs" style={{ color: theme.text.muted }}>COD Rate</p>
                              <p className="font-bold" style={{ color: theme.text.primary }}>{pp.codRate}%</p>
                            </div>
                            <div className="p-2 rounded-lg text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                              <p className="text-xs" style={{ color: theme.text.muted }}>Free Storage</p>
                              <p className="font-bold" style={{ color: theme.text.primary }}>{pp.freeStorageDays} days</p>
                            </div>
                            <div className="p-2 rounded-lg text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                              <p className="text-xs" style={{ color: theme.text.muted }}>Min/Month</p>
                              <p className="font-bold" style={{ color: theme.text.primary }}>{pp.monthlyMinimum || '—'}</p>
                            </div>
                          </div>
                          {pp.notes && <p className="text-xs mt-3 italic" style={{ color: theme.text.muted }}>{pp.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Audit Log Page */}
            {activeMenu === 'audit' && (
              <AuditLogPage
                currentUser={currentUser}
                loading={loading}
                auditSearch={auditSearch}
                setAuditSearch={setAuditSearch}
                auditTypeFilter={auditTypeFilter}
                setAuditTypeFilter={setAuditTypeFilter}
                auditSort={auditSort}
                setAuditSort={setAuditSort}
                filteredAudit={filteredAudit}
              />
            )}

            {/* Settings Page */}
            {activeMenu === 'settings' && (
              <SettingsPage
                currentUser={currentUser}
                themeName={themeName}
                setThemeName={setThemeName}
                addToast={addToast}
              />
            )}
          </main>
        </div>

        {/* Modals & Overlays */}
        {selectedPackage && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedPackage(null)} />
            <PackageDetailDrawer pkg={selectedPackage} onClose={() => setSelectedPackage(null)} theme={theme} userRole={currentUser.role} addToast={addToast} onReassign={(p) => { setSelectedPackage(null); setReassignPackage(p); }} onReturn={(p) => { setSelectedPackage(null); setReturnPackage(p); }} />
          </>
        )}

        <GlobalSearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} onNavigate={handleSearchNavigate} />
        <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
        <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} onExport={handleExport} dataType={activeMenu} />
        <ScanModal isOpen={showScanModal} onClose={() => setShowScanModal(false)} theme={theme} userRole={currentUser.role} addToast={addToast} onViewPackage={(pkg) => { setSelectedPackage(pkg); setActiveMenu('packages'); }} onReassign={setReassignPackage} onReturn={setReturnPackage} />
        <NewPackageDrawer isOpen={showNewPackage} onClose={() => setShowNewPackage(false)} theme={theme} addToast={addToast} />
        <DispatchDrawer isOpen={showDispatchDrawer} onClose={() => setShowDispatchDrawer(false)} theme={theme} addToast={addToast} onViewFull={() => setActiveMenu('dispatch')} />
        <ReassignModal isOpen={!!reassignPackage} onClose={() => setReassignPackage(null)} pkg={reassignPackage} addToast={addToast} />
        <ReturnModal isOpen={!!returnPackage} onClose={() => setReturnPackage(null)} pkg={returnPackage} addToast={addToast} />

        {/* Compose Message Modal */}
        {composeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setComposeOpen(false)}>
            <div className="w-full max-w-2xl rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
              <div className="p-5 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}><Send size={20} style={{ color: '#10b981' }} /></div>
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
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm" style={{ backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)' }}><Smartphone size={18} />SMS</button>
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
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }}><Send size={16} />Send Now</button>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted, border: `1px solid ${theme.border.primary}` }}><Clock size={16} />Schedule Later</button>
                  </div>
                </div>
              </div>
              <div className="p-5 border-t flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                <button onClick={() => setComposeOpen(false)} className="px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
                <div className="flex gap-2">
                  <button onClick={() => addToast({ type: 'info', message: 'Test message sent to your phone' })} className="px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Send Test</button>
                  <button onClick={() => { addToast({ type: 'success', message: 'Message sent successfully!' }); setComposeOpen(false); }} className="px-6 py-2.5 rounded-xl text-white text-sm" style={{ backgroundColor: '#10b981' }}>Send Message</button>
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
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(37,211,102,0.1)' }}><MessageSquare size={20} style={{ color: '#25D366' }} /></div>
                  ) : selectedTemplate.channel === 'email' ? (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(139,92,246,0.1)' }}><Mail size={20} style={{ color: '#8b5cf6' }} /></div>
                  ) : (
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.1)' }}><Smartphone size={20} style={{ color: '#3b82f6' }} /></div>
                  )}
                  <div>
                    <h2 className="font-semibold" style={{ color: theme.text.primary }}>{selectedTemplate.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 rounded-full text-xs uppercase font-medium" style={{ backgroundColor: selectedTemplate.channel === 'whatsapp' ? 'rgba(37,211,102,0.1)' : selectedTemplate.channel === 'email' ? 'rgba(139,92,246,0.1)' : 'rgba(59,130,246,0.1)', color: selectedTemplate.channel === 'whatsapp' ? '#25D366' : selectedTemplate.channel === 'email' ? '#8b5cf6' : '#3b82f6' }}>{selectedTemplate.channel}</span>
                      <span className="text-xs font-mono" style={{ color: theme.text.muted }}>{selectedTemplate.id}</span>
                      {selectedTemplate.active ? <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>Active</span> : <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: 'rgba(107,114,128,0.1)', color: '#6b7280' }}>Inactive</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedTemplate(null)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><X size={20} /></button>
              </div>
              <div className="p-5 space-y-5">
                {/* Trigger Event */}
                <div>
                  <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Trigger Event</label>
                  <span className="px-3 py-1.5 rounded-lg text-sm font-mono" style={{ backgroundColor: 'rgba(245,158,11,0.1)', color: '#f59e0b' }}>{selectedTemplate.event}</span>
                </div>

                {/* Message Preview */}
                <div>
                  <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Message Preview</label>
                  <div className="p-5 rounded-xl" style={{ backgroundColor: selectedTemplate.channel === 'whatsapp' ? 'rgba(37,211,102,0.05)' : selectedTemplate.channel === 'email' ? 'rgba(139,92,246,0.05)' : theme.bg.tertiary, border: selectedTemplate.channel === 'whatsapp' ? '1px solid rgba(37,211,102,0.2)' : selectedTemplate.channel === 'email' ? '1px solid rgba(139,92,246,0.2)' : `1px solid ${theme.border.primary}` }}>
                    {selectedTemplate.channel === 'whatsapp' && (
                      <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid rgba(37,211,102,0.15)' }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#25D366' }}><MessageSquare size={14} className="text-white" /></div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: theme.text.primary }}>LocQar</p>
                          <p className="text-xs" style={{ color: theme.text.muted }}>WhatsApp Business</p>
                        </div>
                      </div>
                    )}
                    {selectedTemplate.channel === 'email' && (
                      <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: '1px solid rgba(139,92,246,0.15)' }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#8b5cf6' }}><Mail size={14} className="text-white" /></div>
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
                    <p className="text-2xl font-bold" style={{ color: '#10b981' }}>{selectedTemplate.deliveryRate}%</p>
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
                  <button onClick={() => { addToast({ type: 'info', message: `Test send: ${selectedTemplate.id}` }); }} className="px-4 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: '#10b981' }}>Test Send</button>
                  <button onClick={() => { addToast({ type: 'info', message: `Editing ${selectedTemplate.name}` }); setSelectedTemplate(null); }} className="px-4 py-2.5 rounded-xl text-white text-sm" style={{ backgroundColor: '#10b981' }}>Edit Template</button>
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
                  <button onClick={() => setSlaSelectedItem(null)} className="p-2 rounded-lg hover:bg-white/5"><X size={18} style={{ color: theme.text.muted }} /></button>
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
                          <div className="text-sm font-medium" style={{ color: f.label === 'Remaining' && item.remainingMin <= 0 ? '#ef4444' : theme.text.primary }}>{f.value}</div>
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
                                    {evt.acked && <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981' }}>Acked</span>}
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
                      <button onClick={() => { addToast({ type: 'success', message: `Acknowledged ${item.waybill}` }); setSlaSelectedItem(null); }} className="px-3 py-2 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: '#10b981' }}>
                        <span className="flex items-center gap-1.5"><CheckCircle2 size={14} /> Acknowledge</span>
                      </button>
                    )}
                    {item.escalationLevel < 3 && (
                      <button onClick={() => { addToast({ type: 'warning', message: `Escalated ${item.waybill} to L${item.escalationLevel + 1}` }); setSlaSelectedItem(null); }} className="px-3 py-2 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: '#f97316' }}>
                        <span className="flex items-center gap-1.5"><AlertTriangle size={14} /> Escalate to L{item.escalationLevel + 1}</span>
                      </button>
                    )}
                    <button onClick={() => { addToast({ type: 'info', message: `Reassigning agent for ${item.waybill}` }); }} className="px-3 py-2 rounded-xl border text-sm font-medium" style={{ borderColor: theme.border.primary, color: '#3b82f6' }}>
                      <span className="flex items-center gap-1.5"><Users size={14} /> Reassign</span>
                    </button>
                    <button onClick={() => { addToast({ type: 'info', message: `SLA override requested for ${item.waybill}` }); }} className="px-3 py-2 rounded-xl border text-sm font-medium" style={{ borderColor: theme.border.primary, color: '#8b5cf6' }}>
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
                      <div className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ backgroundColor: plan?.color || theme.accent.primary }}>{s.name.charAt(0)}</div>
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
                  <button onClick={() => { addToast({ type: 'info', message: `Upgrade initiated for ${s.name}` }); }} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: '#8b5cf6' }}>Upgrade Plan</button>
                  {s.status === 'active' ? (
                    <button onClick={() => { addToast({ type: 'warning', message: `${s.name} suspended` }); setSubscriberDetailItem(null); }} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: '#ef4444' }}>Suspend</button>
                  ) : (
                    <button onClick={() => { addToast({ type: 'success', message: `${s.name} reactivated` }); setSubscriberDetailItem(null); }} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: '#10b981' }}>Reactivate</button>
                  )}
                  <button onClick={() => addToast({ type: 'success', message: `Message sent to ${s.name}` })} className="px-4 py-2 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: '#3b82f6' }}>Send Message</button>
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
                  <button className="w-12 h-6 rounded-full p-0.5 transition-all" style={{ backgroundColor: '#10b981' }}>
                    <div className="w-5 h-5 rounded-full bg-white transform translate-x-6 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="p-6 border-t flex justify-end gap-3" style={{ borderColor: theme.border.primary }}>
                <button onClick={() => setShowAddSubscriber(false)} className="px-4 py-2.5 rounded-xl text-sm border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
                <button onClick={() => { addToast({ type: 'success', message: 'New subscriber added successfully!' }); setShowAddSubscriber(false); }} className="px-4 py-2.5 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: theme.accent.primary }}>Add Subscriber</button>
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
              { id: 'dispatch', label: 'Dispatch Selected', icon: Truck, color: '#3b82f6' },
              { id: 'markDelivered', label: 'Mark Delivered', icon: CheckCircle2, color: '#10b981' },
              { id: 'export', label: 'Export Selected', icon: FileDown, color: '#8b5cf6' },
              { id: 'print', label: 'Print Labels', icon: Printer, color: '#f59e0b' },
            ]}
            theme={theme}
          />
        )}
        <BulkActionsBar
          selectedCount={selectedSubscribers.length}
          onClear={() => setSelectedSubscribers([])}
          onAction={handleSubscriberBulkAction}
          actions={[
            { id: 'message', label: 'Send Message', icon: MessageSquare, color: '#3b82f6' },
            { id: 'export', label: 'Export Selected', icon: FileDown, color: '#8b5cf6' },
            { id: 'changePlan', label: 'Change Plan', icon: ArrowUpRight, color: '#f59e0b' },
            { id: 'suspend', label: 'Suspend Selected', icon: Lock, color: '#ef4444' },
          ]}
          theme={theme}
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
  );
}

// Wrap with ThemeProvider
export default function LocQarERP() {
  return (
    <ThemeProvider>
      <LocQarERPInner />
    </ThemeProvider>
  );
}