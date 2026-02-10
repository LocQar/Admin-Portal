import React, { useState, useEffect, useMemo, useCallback, createContext, useContext } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { LayoutDashboard, Package, Users, Settings, ChevronDown, ChevronRight, Search, Truck, MapPin, DollarSign, Box, Bell, Plus, ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, AlertTriangle, Filter, Download, Eye, Edit, Trash2, RefreshCw, TrendingUp, Calendar, ChevronLeft, X, QrCode, Building2, UserCheck, PackageX, Timer, Grid3X3, Sun, Moon, Shield, Key, Lock, Unlock, UserPlus, Phone, MessageSquare, Send, Printer, Banknote, Battery, BatteryWarning, Thermometer, Scan, Home, Warehouse, Circle, CheckCircle, Inbox, Route, Car, Wrench, Cog, Briefcase, Users2, Award, Ticket, Receipt, CreditCard, FileText, Command, Keyboard, Check, Info, AlertOctagon, XCircle, ChevronFirst, ChevronLast, MoreHorizontal, FileDown, Loader2, Menu, Smartphone, LogOut, History } from 'lucide-react';

// ============ CONTEXT ============
const ThemeContext = createContext();
const ToastContext = createContext();

// ============ DESIGN TOKENS ============

// --- Core Palette ---
const palette = {
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
  // Dark scale
  navy900: '#0A1628',
  navy800: '#152238',
  navy700: '#1E3A5F',
  navy600: '#2A4A73',
  navy500: '#3D6098',
  navy400: '#5E7290',
  // Light scale
  cream100: '#F5F1E8',
  cream200: '#EDE9E0',
  cream300: '#E2DED5',
  cream400: '#D5D1C8',
  // Gray scale
  gray900: '#111827',
  gray800: '#1F2937',
  gray700: '#374151',
  gray600: '#4B5563',
  gray500: '#6b7280',
  gray400: '#8B9AAF',
  gray300: '#9CA3AF',
  gray200: '#D1D5DB',
  gray100: '#F3F4F6',
  // Accent (LocQar Coral)
  coral600: '#E5503E',
  coral500: '#FF6B58',
  coral400: '#FF8A7A',
  coral300: '#FFB0A5',
  coral200: '#FFD4CE',
  coral100: '#FFF1EF',
  // Semantic
  emerald600: '#059669',
  emerald500: '#10b981',
  emerald400: '#34D399',
  emerald300: '#6EE7B7',
  amber600: '#D97706',
  amber500: '#f59e0b',
  amber400: '#FBBF24',
  amber300: '#FCD34D',
  red600: '#DC2626',
  red500: '#ef4444',
  red400: '#FF4D4D',
  red300: '#FCA5A5',
  blue600: '#2563EB',
  blue500: '#3b82f6',
  blue400: '#60A5FA',
  blue300: '#93C5FD',
  indigo500: '#6366f1',
  violet500: '#8b5cf6',
  cyan500: '#06b6d4',
  orange500: '#f97316',
  // Brand / platform
  whatsapp: '#25D366',
  // Member tiers
  silver: '#a3a3a3',
  bronze: '#cd7c32',
  gold: '#f59e0b',
};

// --- Typography ---
const typography = {
  fonts: {
    primary: "'Sora', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
  },
  fontSizes: {
    xs: '0.75rem',     // 12px  — tw: text-xs
    sm: '0.875rem',    // 14px  — tw: text-sm
    base: '1rem',      // 16px  — tw: text-base
    lg: '1.125rem',    // 18px  — tw: text-lg
    xl: '1.25rem',     // 20px  — tw: text-xl
    '2xl': '1.5rem',   // 24px  — tw: text-2xl
    '3xl': '1.875rem', // 30px  — tw: text-3xl
  },
  fontWeights: {
    normal: 400,     // tw: font-normal
    medium: 500,     // tw: font-medium
    semibold: 600,   // tw: font-semibold
    bold: 700,       // tw: font-bold
  },
  letterSpacing: {
    tight: '-0.025em',  // tw: tracking-tight
    normal: '0em',      // tw: tracking-normal
    wide: '0.025em',    // tw: tracking-wide
    wider: '0.05em',    // tw: tracking-wider
    widest: '0.1em',    // tw: tracking-widest (used for uppercase labels)
  },
  lineHeight: {
    none: 1,        // tw: leading-none
    tight: 1.25,    // tw: leading-tight
    snug: 1.375,    // tw: leading-snug
    normal: 1.5,    // tw: leading-normal
    relaxed: 1.625, // tw: leading-relaxed
  },
};

// --- Spacing (4px base grid) ---
// tw: p-0..p-12 / gap-0..gap-12 / m-0..m-12
const spacing = {
  0: '0px',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
};

// --- Radii ---
const radii = {
  none: '0px',
  sm: '4px',       // tw: rounded
  md: '6px',       // tw: rounded-md
  lg: '8px',       // tw: rounded-lg
  xl: '12px',      // tw: rounded-xl
  '2xl': '16px',   // tw: rounded-2xl
  '3xl': '24px',   // tw: rounded-3xl
  full: '9999px',  // tw: rounded-full
};

// --- Shadows ---
const shadows = {
  none: 'none',
  sm: '0 1px 2px rgba(0,0,0,0.05)',                                         // tw: shadow-sm
  md: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)',    // tw: shadow-md
  lg: '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',  // tw: shadow-lg
  xl: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', // tw: shadow-xl
  '2xl': '0 25px 50px -12px rgba(0,0,0,0.25)',                              // tw: shadow-2xl
  glow: (color) => `0 0 8px ${color}40`,       // Dynamic glow for progress bars, active states
  accentGlow: `0 0 12px rgba(255,107,88,0.35)`, // LocQar coral glow
  innerSm: 'inset 0 1px 2px rgba(0,0,0,0.06)',  // Subtle inset for inputs
};

// --- Borders (pre-composed strings) ---
const borders = {
  // Base
  thin: (color) => `1px solid ${color}`,
  medium: (color) => `2px solid ${color}`,
  // Input states (composed at theme level)
  inputDefault: (thm) => `1px solid ${thm.border.primary}`,
  inputFocus: (thm) => `1px solid ${thm.accent.primary}`,
  inputError: `1px solid ${palette.red500}`,
  // Cards
  card: (thm) => `1px solid ${thm.border.primary}`,
  cardHover: (thm) => `1px solid ${thm.border.secondary}`,
  cardAccent: (thm) => `1px solid ${thm.accent.border}`,
  // Status variants
  statusSuccess: `1px solid ${palette.emerald500}`,
  statusWarning: `1px solid ${palette.amber500}`,
  statusError: `1px solid ${palette.red500}`,
  statusInfo: `1px solid ${palette.blue500}`,
};

// --- Overlays & Alpha helpers ---
const alpha = (hex, opacity) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
};

const overlays = {
  backdrop: 'rgba(0,0,0,0.5)',           // tw: bg-black/50 — modal/drawer backdrop
  light5: 'rgba(255,255,255,0.05)',      // tw: bg-white/5  — subtle hover on dark
  light10: 'rgba(255,255,255,0.1)',      // tw: bg-white/10 — hover on dark
  dark5: 'rgba(0,0,0,0.05)',             // subtle hover on light
  dark10: 'rgba(0,0,0,0.1)',             // hover on light
  // Status backgrounds (10% opacity)
  successBg: alpha(palette.emerald500, 0.1),
  warningBg: alpha(palette.amber500, 0.1),
  errorBg: alpha(palette.red500, 0.1),
  infoBg: alpha(palette.blue500, 0.1),
  // Subtle status backgrounds (3-5% opacity)
  successSubtle: alpha(palette.emerald500, 0.05),
  warningSubtle: alpha(palette.amber500, 0.05),
  errorSubtle: alpha(palette.red500, 0.03),
  infoSubtle: alpha(palette.blue500, 0.05),
  // Emphasis status (15-20%)
  successEmphasis: alpha(palette.emerald500, 0.2),
  warningEmphasis: alpha(palette.amber500, 0.15),
  errorEmphasis: alpha(palette.red500, 0.15),
  infoEmphasis: alpha(palette.blue500, 0.15),
  // Platform overlays
  whatsappBg: alpha(palette.whatsapp, 0.1),
  whatsappSubtle: alpha(palette.whatsapp, 0.05),
  whatsappEmphasis: alpha(palette.whatsapp, 0.15),
  // Tier overlays
  silverBg: alpha(palette.silver, 0.1),
  bronzeBg: alpha(palette.bronze, 0.1),
  goldBg: alpha(palette.amber500, 0.1),
  // Additional semantic
  violetBg: alpha(palette.violet500, 0.1),
  indigoBg: alpha(palette.indigo500, 0.1),
  cyanBg: alpha(palette.cyan500, 0.1),
  orangeBg: alpha(palette.orange500, 0.1),
  grayBg: alpha(palette.gray500, 0.1),
  grayEmphasis: alpha(palette.gray500, 0.2),
};

// --- Animations & Transitions ---
const transitions = {
  // Durations
  fast: '100ms',      // tw: duration-100 — micro-interactions
  normal: '150ms',    // tw: duration-150 — default Tailwind
  moderate: '200ms',  // tw: duration-200 — buttons, toggles
  slow: '300ms',      // tw: duration-300 — drawers, panels
  slower: '500ms',    // tw: duration-500 — page transitions
  // Easing curves
  easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',     // Smooth decelerate — drawers, modals
  easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',    // Default — general use
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',  // Bouncy — tooltips, toasts
  linear: 'linear',
  // Pre-composed transitions (spread into style={})
  all: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
  colors: 'color 150ms, background-color 150ms, border-color 150ms',
  transform: 'transform 200ms cubic-bezier(0.16, 1, 0.3, 1)',
  opacity: 'opacity 150ms ease',
  // Stagger delays (for lists / grid animations)
  stagger: (index, base = 50) => `${index * base}ms`,
};

const keyframes = {
  slideIn: `@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`,
  slideOut: `@keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }`,
  fadeIn: `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`,
  fadeOut: `@keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }`,
  scaleIn: `@keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }`,
  pulse: `@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`,
  spin: `@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`,
  bounce: `@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }`,
};

// --- Z-Index Scale ---
const zIndex = {
  base: 0,
  dropdown: 30,     // Menus, popovers
  sticky: 35,       // Sticky headers, bars
  actionBar: 40,    // Bulk-action floating bars
  modal: 50,        // Modals, drawers, overlays
  toast: 60,        // Toast notifications (above modals)
};

// ============ THEMES (dark & light, using tokens) ============
const themes = {
  dark: {
    name: 'dark',
    bg: { primary: palette.navy900, secondary: palette.navy800, tertiary: palette.navy700, card: palette.navy800, hover: palette.navy700 },
    border: { primary: 'rgba(255,255,255,0.08)', secondary: 'rgba(255,255,255,0.15)', focus: palette.coral500 },
    text: { primary: palette.white, secondary: palette.gray400, muted: palette.navy400 },
    accent: { primary: palette.coral500, secondary: palette.coral400, light: alpha(palette.coral500, 0.12), border: alpha(palette.coral500, 0.3) },
    font: typography.fonts,
    status: { success: palette.emerald400, warning: palette.amber500, error: palette.red400, info: palette.blue500 },
    // Extended: selection & buttons
    selection: { bg: alpha(palette.coral500, 0.15), border: alpha(palette.coral500, 0.4), text: palette.coral400 },
    button: {
      primary: { bg: palette.coral500, text: palette.white, hoverBg: palette.coral600, activeBg: palette.coral600, disabledBg: palette.gray600, disabledText: palette.gray400 },
      secondary: { bg: 'transparent', text: palette.gray400, border: 'rgba(255,255,255,0.15)', hoverBg: 'rgba(255,255,255,0.05)', activeBg: 'rgba(255,255,255,0.08)' },
      ghost: { bg: 'transparent', text: palette.gray400, hoverBg: 'rgba(255,255,255,0.05)' },
      danger: { bg: palette.red500, text: palette.white, hoverBg: palette.red600 },
    },
    input: { bg: 'transparent', border: 'rgba(255,255,255,0.08)', focusBorder: palette.coral500, placeholder: palette.navy400, text: palette.white },
    overlay: { backdrop: overlays.backdrop, glass: 'rgba(21,34,56,0.85)' },
  },
  light: {
    name: 'light',
    bg: { primary: palette.cream100, secondary: palette.white, tertiary: palette.cream100, card: palette.white, hover: palette.cream200 },
    border: { primary: 'rgba(0,0,0,0.08)', secondary: 'rgba(0,0,0,0.12)', focus: palette.coral500 },
    text: { primary: palette.navy900, secondary: palette.navy700, muted: palette.gray400 },
    accent: { primary: palette.coral500, secondary: palette.coral400, light: alpha(palette.coral500, 0.08), border: alpha(palette.coral500, 0.2) },
    font: typography.fonts,
    status: { success: palette.emerald400, warning: palette.amber500, error: palette.red400, info: palette.blue500 },
    // Extended: selection & buttons
    selection: { bg: alpha(palette.coral500, 0.1), border: alpha(palette.coral500, 0.3), text: palette.coral600 },
    button: {
      primary: { bg: palette.coral500, text: palette.white, hoverBg: palette.coral600, activeBg: palette.coral600, disabledBg: palette.gray200, disabledText: palette.gray400 },
      secondary: { bg: 'transparent', text: palette.navy700, border: 'rgba(0,0,0,0.12)', hoverBg: 'rgba(0,0,0,0.04)', activeBg: 'rgba(0,0,0,0.06)' },
      ghost: { bg: 'transparent', text: palette.navy700, hoverBg: 'rgba(0,0,0,0.04)' },
      danger: { bg: palette.red500, text: palette.white, hoverBg: palette.red600 },
    },
    input: { bg: 'transparent', border: 'rgba(0,0,0,0.08)', focusBorder: palette.coral500, placeholder: palette.gray400, text: palette.navy900 },
    overlay: { backdrop: overlays.backdrop, glass: 'rgba(255,255,255,0.85)' },
  }
};

// ============ COMPONENT RECIPES ============
// Spread into style={{}} — usage: style={{ ...recipes.card(theme) }}
const recipes = {
  // --- Cards ---
  card: (thm) => ({
    backgroundColor: thm.bg.card,
    borderRadius: radii['2xl'],
    border: `1px solid ${thm.border.primary}`,
  }),
  cardHover: (thm) => ({
    backgroundColor: thm.bg.card,
    borderRadius: radii['2xl'],
    border: `1px solid ${thm.border.secondary}`,
  }),
  cardAccent: (thm) => ({
    backgroundColor: thm.bg.card,
    borderRadius: radii['2xl'],
    border: `1px solid ${thm.accent.border}`,
  }),

  // --- Buttons ---
  btnPrimary: (thm) => ({
    backgroundColor: thm.button.primary.bg,
    color: thm.button.primary.text,
    borderRadius: radii.xl,
    border: 'none',
    cursor: 'pointer',
    transition: transitions.all,
    fontWeight: typography.fontWeights.medium,
    fontSize: typography.fontSizes.sm,
  }),
  btnSecondary: (thm) => ({
    backgroundColor: thm.button.secondary.bg,
    color: thm.button.secondary.text,
    borderRadius: radii.xl,
    border: `1px solid ${thm.button.secondary.border || thm.border.primary}`,
    cursor: 'pointer',
    transition: transitions.all,
    fontWeight: typography.fontWeights.medium,
    fontSize: typography.fontSizes.sm,
  }),
  btnGhost: (thm) => ({
    backgroundColor: 'transparent',
    color: thm.button.ghost.text,
    borderRadius: radii.lg,
    border: 'none',
    cursor: 'pointer',
    transition: transitions.all,
  }),
  btnDanger: (thm) => ({
    backgroundColor: thm.button.danger.bg,
    color: thm.button.danger.text,
    borderRadius: radii.xl,
    border: 'none',
    cursor: 'pointer',
    transition: transitions.all,
    fontWeight: typography.fontWeights.medium,
    fontSize: typography.fontSizes.sm,
  }),
  btnIcon: (thm) => ({
    backgroundColor: 'transparent',
    color: thm.text.secondary,
    borderRadius: radii.lg,
    border: 'none',
    cursor: 'pointer',
    transition: transitions.all,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),

  // --- Inputs ---
  input: (thm) => ({
    backgroundColor: thm.input.bg,
    color: thm.input.text,
    borderRadius: radii.xl,
    border: `1px solid ${thm.input.border}`,
    fontSize: typography.fontSizes.sm,
    transition: transitions.colors,
    outline: 'none',
  }),
  inputFocus: (thm) => ({
    borderColor: thm.input.focusBorder,
    boxShadow: `0 0 0 3px ${alpha(palette.coral500, 0.15)}`,
  }),

  // --- Badges / Chips ---
  badge: (color, bg) => ({
    backgroundColor: bg || alpha(color, 0.1),
    color: color,
    borderRadius: radii.full,
    fontWeight: typography.fontWeights.medium,
    fontSize: typography.fontSizes.xs,
    lineHeight: typography.lineHeight.none,
  }),
  chip: (thm) => ({
    backgroundColor: thm.bg.tertiary,
    color: thm.text.secondary,
    borderRadius: radii.full,
    fontSize: typography.fontSizes.xs,
    fontWeight: typography.fontWeights.medium,
    border: `1px solid ${thm.border.primary}`,
  }),

  // --- Toast ---
  toast: (thm, accentColor) => ({
    backgroundColor: thm.bg.card,
    borderRadius: radii.xl,
    border: `1px solid ${accentColor}`,
    boxShadow: shadows.lg,
    animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  }),

  // --- Glass bar (frosted top/bottom bars) ---
  glassBar: (thm) => ({
    backgroundColor: thm.overlay.glass,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderBottom: `1px solid ${thm.border.primary}`,
  }),
  glassBarBottom: (thm) => ({
    backgroundColor: thm.overlay.glass,
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderTop: `1px solid ${thm.border.primary}`,
  }),

  // --- Modal / Drawer ---
  modal: (thm) => ({
    backgroundColor: thm.bg.card,
    borderRadius: radii['2xl'],
    border: `1px solid ${thm.border.primary}`,
    boxShadow: shadows['2xl'],
  }),
  drawer: (thm) => ({
    backgroundColor: thm.bg.secondary,
    borderLeft: `1px solid ${thm.border.primary}`,
    boxShadow: shadows['2xl'],
  }),

  // --- Progress Bar ---
  progressTrack: (thm) => ({
    backgroundColor: thm.border.primary,
    borderRadius: radii.full,
    overflow: 'hidden',
  }),
  progressFill: (color, pct) => ({
    width: `${pct}%`,
    backgroundColor: color,
    borderRadius: radii.full,
    transition: transitions.all,
    boxShadow: pct >= 85 ? shadows.glow(color) : 'none',
  }),

  // --- Table row ---
  tableRow: (thm, highlight = false, highlightColor = palette.red500) => ({
    borderBottom: `1px solid ${thm.border.primary}`,
    backgroundColor: highlight ? alpha(highlightColor, 0.03) : 'transparent',
    transition: transitions.colors,
  }),

  // --- Stat card (dashboard numbers) ---
  statCard: (thm, accentColor) => ({
    backgroundColor: thm.bg.card,
    borderRadius: radii['2xl'],
    border: `1px solid ${thm.border.primary}`,
    borderLeft: `4px solid ${accentColor || thm.accent.primary}`,
  }),
};

// ============ TAILWIND CLASS MAP (Reference) ============
// palette.coral500  → text-[#FF6B58]  bg-[#FF6B58]
// palette.navy900   → bg-[#0A1628]
// radii.xl          → rounded-xl    (12px)
// radii['2xl']      → rounded-2xl   (16px)
// radii.full        → rounded-full  (9999px)
// shadows.lg        → shadow-lg
// shadows['2xl']    → shadow-2xl
// spacing[4]        → p-4 / m-4 / gap-4  (1rem)
// typography.fontSizes.xs → text-xs (0.75rem)
// typography.fontSizes.sm → text-sm (0.875rem)
// transitions.fast  → duration-100
// transitions.normal → duration-150
// transitions.slow  → duration-300
// zIndex.modal      → z-50
// zIndex.actionBar  → z-40
// zIndex.dropdown   → z-30
// overlays.backdrop → bg-black/50


// ============ ROLES & PERMISSIONS ============

const ROLES = {
  SUPER_ADMIN: { id: 'super_admin', name: 'Super Admin', level: 100, color: palette.coral500, permissions: ['*'] },
  ADMIN: { id: 'admin', name: 'Administrator', level: 80, color: palette.amber500, permissions: ['dashboard.*', 'packages.*', 'lockers.*', 'dropbox.*', 'terminals.*', 'customers.*', 'staff.*', 'reports.*', 'dispatch.*', 'accounting.*'] },
  MANAGER: { id: 'manager', name: 'Branch Manager', level: 60, color: palette.blue500, permissions: ['dashboard.view', 'packages.*', 'dropbox.*', 'lockers.*', 'terminals.view', 'customers.*', 'staff.view', 'reports.view', 'dispatch.*'] },
  AGENT: { id: 'agent', name: 'Field Agent', level: 40, color: palette.emerald500, permissions: ['dashboard.view', 'packages.view', 'packages.scan', 'packages.receive', 'dropbox.view', 'dropbox.collect', 'lockers.view', 'lockers.open', 'dispatch.view'] },
  SUPPORT: { id: 'support', name: 'Support', level: 30, color: palette.violet500, permissions: ['dashboard.view', 'packages.view', 'packages.track', 'customers.*', 'tickets.*'] },
  VIEWER: { id: 'viewer', name: 'View Only', level: 10, color: palette.gray500, permissions: ['dashboard.view', 'packages.view', 'lockers.view'] },
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
  warehouse_to_locker: { id: 'warehouse_to_locker', label: 'Warehouse → Locker', icon: Warehouse, color: palette.blue500 },
  dropbox_to_locker: { id: 'dropbox_to_locker', label: 'Dropbox → Locker', icon: Inbox, color: palette.violet500 },
  locker_to_home: { id: 'locker_to_home', label: 'Locker → Home', icon: Home, color: palette.emerald500 },
};

const PACKAGE_STATUSES = {
  pending: { label: 'Pending', color: palette.amber500, bg: overlays.warningBg },
  at_warehouse: { label: 'At Warehouse', color: palette.indigo500, bg: overlays.indigoBg },
  at_dropbox: { label: 'At Dropbox', color: palette.violet500, bg: overlays.violetBg },
  in_transit_to_locker: { label: 'Transit → Locker', color: palette.blue500, bg: overlays.infoBg },
  in_transit_to_home: { label: 'Transit → Home', color: palette.cyan500, bg: overlays.cyanBg },
  delivered_to_locker: { label: 'In Locker', color: palette.emerald500, bg: overlays.successBg },
  delivered_to_home: { label: 'Delivered', color: palette.emerald500, bg: overlays.successBg },
  picked_up: { label: 'Picked Up', color: palette.gray500, bg: overlays.grayBg },
  expired: { label: 'Expired', color: palette.red500, bg: overlays.errorBg },
};

const ALL_STATUSES = {
  ...PACKAGE_STATUSES,
  available: { label: 'Available', color: palette.emerald500, bg: overlays.successBg },
  occupied: { label: 'Occupied', color: palette.blue500, bg: overlays.infoBg },
  reserved: { label: 'Reserved', color: palette.amber500, bg: overlays.warningBg },
  maintenance: { label: 'Maintenance', color: palette.red500, bg: overlays.errorBg },
  active: { label: 'Active', color: palette.emerald500, bg: overlays.successBg },
  inactive: { label: 'Inactive', color: palette.gray500, bg: overlays.grayBg },
  offline: { label: 'Offline', color: palette.gray500, bg: overlays.grayBg },
  online: { label: 'Online', color: palette.emerald500, bg: overlays.successBg },
  on_delivery: { label: 'On Delivery', color: palette.blue500, bg: overlays.infoBg },
  open: { label: 'Open', color: palette.red500, bg: overlays.errorBg },
  in_progress: { label: 'In Progress', color: palette.amber500, bg: overlays.warningBg },
  completed: { label: 'Completed', color: palette.emerald500, bg: overlays.successBg },
  paid: { label: 'Paid', color: palette.emerald500, bg: overlays.successBg },
  overdue: { label: 'Overdue', color: palette.red500, bg: overlays.errorBg },
  full: { label: 'Full', color: palette.amber500, bg: overlays.warningBg },
  individual: { label: 'Individual', color: palette.blue500, bg: overlays.infoBg },
  b2b: { label: 'B2B Partner', color: palette.violet500, bg: overlays.violetBg },
  high: { label: 'High', color: palette.red500, bg: overlays.errorBg },
  medium: { label: 'Medium', color: palette.amber500, bg: overlays.warningBg },
  low: { label: 'Low', color: palette.emerald500, bg: overlays.successBg },
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

const driversData = [
  { id: 1, name: 'Kwesi Asante', phone: '+233551234567', vehicle: 'Toyota Hiace - GR-1234-20', zone: 'Accra Central', status: 'active', deliveriesToday: 12, rating: 4.8 },
  { id: 2, name: 'Kofi Mensah', phone: '+233559876543', vehicle: 'Nissan Urvan - GW-5678-21', zone: 'East Legon', status: 'on_delivery', deliveriesToday: 8, rating: 4.6 },
  { id: 3, name: 'Yaw Boateng', phone: '+233542345678', vehicle: 'Kia Bongo - GN-9012-22', zone: 'Tema', status: 'offline', deliveriesToday: 0, rating: 4.9 },
  { id: 4, name: 'Kwame Asiedu', phone: '+233553456789', vehicle: 'Toyota Hiace - GR-3456-21', zone: 'Achimota', status: 'active', deliveriesToday: 15, rating: 4.7 },
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

const apiKeysData = [
  { id: 1, partner: 'Jumia Ghana', key: 'lq_live_jum_****a8f2', env: 'production', created: '2023-01-15', lastUsed: '2 min ago', status: 'active', callsToday: 342, rateLimit: 1000, callsMonth: 12450 },
  { id: 2, partner: 'Jumia Ghana', key: 'lq_test_jum_****b3c1', env: 'sandbox', created: '2023-01-10', lastUsed: '1 day ago', status: 'active', callsToday: 12, rateLimit: 500, callsMonth: 890 },
  { id: 3, partner: 'Melcom Ltd', key: 'lq_live_mel_****d4e5', env: 'production', created: '2023-02-20', lastUsed: '15 min ago', status: 'active', callsToday: 187, rateLimit: 500, callsMonth: 8200 },
  { id: 4, partner: 'Telecel Ghana', key: 'lq_live_tel_****f6g7', env: 'production', created: '2023-05-25', lastUsed: '1 hour ago', status: 'active', callsToday: 95, rateLimit: 500, callsMonth: 5600 },
  { id: 5, partner: 'CompuGhana', key: 'lq_live_cmp_****h8i9', env: 'production', created: '2023-11-15', lastUsed: '2 weeks ago', status: 'revoked', callsToday: 0, rateLimit: 200, callsMonth: 0 },
];

const bulkShipmentsData = [
  { id: 'BSH-001', partner: 'Jumia Ghana', packages: 45, status: 'in_transit_to_locker', created: '2024-01-15 08:00', eta: '14:00 today', delivered: 12, pending: 33, terminal: 'Achimota Mall' },
  { id: 'BSH-002', partner: 'Melcom Ltd', packages: 28, status: 'delivered_to_locker', created: '2024-01-14 10:00', eta: 'Completed', delivered: 28, pending: 0, terminal: 'Accra Mall' },
  { id: 'BSH-003', partner: 'Telecel Ghana', packages: 15, status: 'pending', created: '2024-01-15 12:00', eta: '10:00 tomorrow', delivered: 0, pending: 15, terminal: 'Kotoka T3' },
  { id: 'BSH-004', partner: 'Jumia Ghana', packages: 62, status: 'in_transit_to_locker', created: '2024-01-15 06:00', eta: '18:00 today', delivered: 38, pending: 24, terminal: 'Junction Mall' },
  { id: 'BSH-005', partner: 'Hubtel', packages: 20, status: 'at_warehouse', created: '2024-01-15 11:00', eta: '16:00 today', delivered: 0, pending: 20, terminal: 'West Hills Mall' },
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
  gold: { label: 'Gold', color: palette.amber500, bg: overlays.warningBg, perks: 'Priority SLA, Dedicated Support, Custom API Limits' },
  silver: { label: 'Silver', color: palette.silver, bg: overlays.silverBg, perks: 'Standard SLA, Email Support, Standard API Limits' },
  bronze: { label: 'Bronze', color: palette.bronze, bg: overlays.bronzeBg, perks: 'Basic SLA, Ticket Support, Basic API Limits' },
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

const dropboxAgentsData = [
  { id: 1, name: 'Yaw Boateng', phone: '+233542345678', vehicle: 'Honda CG125 Motorbike', assignedDropboxes: ['DBX-001', 'DBX-005'], zone: 'North Accra', status: 'active', collectionsToday: 3, totalCollected: 56, rating: 4.9, avgCollectionTime: '22 min', photo: '🧑🏾' },
  { id: 2, name: 'Kwesi Asante', phone: '+233551234567', vehicle: 'Toyota Hiace Van - GR-1234-20', assignedDropboxes: ['DBX-002', 'DBX-006'], zone: 'East Accra', status: 'on_delivery', collectionsToday: 2, totalCollected: 37, rating: 4.8, avgCollectionTime: '28 min', photo: '👨🏾' },
  { id: 3, name: 'Kwame Asiedu', phone: '+233553456789', vehicle: 'Toyota Hiace Van - GR-3456-21', assignedDropboxes: ['DBX-003', 'DBX-008'], zone: 'South Accra', status: 'active', collectionsToday: 1, totalCollected: 31, rating: 4.7, avgCollectionTime: '25 min', photo: '👨🏿' },
  { id: 4, name: 'Kofi Mensah', phone: '+233559876543', vehicle: 'Nissan Urvan Van - GW-5678-21', assignedDropboxes: ['DBX-004'], zone: 'Tema', status: 'offline', collectionsToday: 0, totalCollected: 0, rating: 4.6, avgCollectionTime: '30 min', photo: '🧔🏾' },
];

const dropboxFlowData = [
  { id: 'DFL-001', waybill: 'LQ-2024-00009', customer: 'Yaw Asiedu', dropbox: 'DBX-001', dropboxName: 'Achimota Overpass', depositTime: '2024-01-15 13:45', collectionId: 'COL-001', targetLocker: 'A-12', targetTerminal: 'Achimota Mall', stage: 'awaiting_collection', eta: '16:00' },
  { id: 'DFL-002', waybill: 'LQ-2024-00011', customer: 'Ama Darko', dropbox: 'DBX-003', dropboxName: 'Osu Oxford Street', depositTime: '2024-01-15 08:20', collectionId: 'COL-002', targetLocker: 'B-14', targetTerminal: 'Accra Mall', stage: 'collection_overdue', eta: 'Overdue' },
  { id: 'DFL-003', waybill: 'LQ-2024-00012', customer: 'Kofi Appiah', dropbox: 'DBX-006', dropboxName: 'Spintex Baatsona', depositTime: '2024-01-15 11:10', collectionId: 'COL-004', targetLocker: 'J-08', targetTerminal: 'Junction Mall', stage: 'awaiting_collection', eta: '15:00' },
  { id: 'DFL-004', waybill: 'LQ-2024-00013', customer: 'Efua Mensah', dropbox: 'DBX-001', dropboxName: 'Achimota Overpass', depositTime: '2024-01-15 09:00', collectionId: 'COL-008', targetLocker: 'A-07', targetTerminal: 'Achimota Mall', stage: 'in_transit', eta: '14:30' },
  { id: 'DFL-005', waybill: 'LQ-2024-00014', customer: 'Kweku Duah', dropbox: 'DBX-002', dropboxName: 'Madina Market', depositTime: '2024-01-15 10:15', collectionId: 'COL-009', targetLocker: 'A-19', targetTerminal: 'Achimota Mall', stage: 'delivered_to_locker', eta: 'Done' },
  { id: 'DFL-006', waybill: 'LQ-2024-00015', customer: 'Adwoa Sika', dropbox: 'DBX-004', dropboxName: 'Tema Community 1', depositTime: '2024-01-14 15:30', collectionId: 'COL-003', targetLocker: 'J-02', targetTerminal: 'Junction Mall', stage: 'collection_overdue', eta: 'Overdue' },
];

// ============ PARTNER SELF-SERVICE PORTAL DATA ============
const portalShipmentsData = [
  { id: 'JUM-2024-0451', waybill: 'LQ-2024-01201', customer: 'Kofi Asante', phone: '+233551234567', destination: 'Achimota Mall', locker: 'A-12', size: 'Medium', status: 'delivered_to_locker', pickupCode: '8472', daysInLocker: 1, value: 85, weight: '1.8kg', createdAt: '2024-01-15 08:00', deliveredAt: '2024-01-15 10:30', batchId: 'BSH-001' },
  { id: 'JUM-2024-0452', waybill: 'LQ-2024-01202', customer: 'Ama Darko', phone: '+233559876543', destination: 'Accra Mall', locker: 'B-03', size: 'Small', status: 'delivered_to_locker', pickupCode: '5139', daysInLocker: 0, value: 45, weight: '0.5kg', createdAt: '2024-01-15 08:00', deliveredAt: '2024-01-15 11:00', batchId: 'BSH-001' },
  { id: 'JUM-2024-0453', waybill: 'LQ-2024-01203', customer: 'Efua Mensah', phone: '+233542345678', destination: 'Achimota Mall', locker: '-', size: 'Large', status: 'in_transit_to_locker', pickupCode: null, daysInLocker: 0, value: 320, weight: '4.2kg', createdAt: '2024-01-15 08:00', deliveredAt: null, batchId: 'BSH-001' },
  { id: 'JUM-2024-0454', waybill: 'LQ-2024-01204', customer: 'Kweku Duah', phone: '+233553456789', destination: 'Kotoka T3', locker: '-', size: 'Medium', status: 'in_transit_to_locker', pickupCode: null, daysInLocker: 0, value: 150, weight: '2.1kg', createdAt: '2024-01-15 08:00', deliveredAt: null, batchId: 'BSH-001' },
  { id: 'JUM-2024-0455', waybill: 'LQ-2024-01205', customer: 'Adwoa Sika', phone: '+233557778888', destination: 'Junction Mall', locker: 'J-09', size: 'Small', status: 'picked_up', pickupCode: '2951', daysInLocker: 0, value: 65, weight: '0.3kg', createdAt: '2024-01-14 10:00', deliveredAt: '2024-01-14 14:00', batchId: 'BSH-004' },
  { id: 'JUM-2024-0456', waybill: 'LQ-2024-01206', customer: 'Yaw Mensah', phone: '+233551112233', destination: 'Achimota Mall', locker: 'A-07', size: 'Medium', status: 'delivered_to_locker', pickupCode: '6284', daysInLocker: 3, value: 210, weight: '3.0kg', createdAt: '2024-01-12 09:00', deliveredAt: '2024-01-12 13:00', batchId: null },
  { id: 'JUM-2024-0457', waybill: 'LQ-2024-01207', customer: 'Akua Boateng', phone: '+233554445566', destination: 'West Hills Mall', locker: '-', size: 'XLarge', status: 'at_warehouse', pickupCode: null, daysInLocker: 0, value: 890, weight: '12.5kg', createdAt: '2024-01-15 12:00', deliveredAt: null, batchId: null },
  { id: 'JUM-2024-0458', waybill: 'LQ-2024-01208', customer: 'Kofi Appiah', phone: '+233556667788', destination: 'Accra Mall', locker: 'B-11', size: 'Medium', status: 'expired', pickupCode: '1739', daysInLocker: 7, value: 175, weight: '2.2kg', createdAt: '2024-01-08 08:00', deliveredAt: '2024-01-08 12:00', batchId: null },
  { id: 'JUM-2024-0459', waybill: 'LQ-2024-01209', customer: 'Efua Owusu', phone: '+233558899001', destination: 'Achimota Mall', locker: '-', size: 'Small', status: 'pending', pickupCode: null, daysInLocker: 0, value: 55, weight: '0.4kg', createdAt: '2024-01-15 14:00', deliveredAt: null, batchId: null },
  { id: 'JUM-2024-0460', waybill: 'LQ-2024-01210', customer: 'Kwame Asiedu', phone: '+233551122334', destination: 'Junction Mall', locker: 'J-02', size: 'Large', status: 'delivered_to_locker', pickupCode: '4067', daysInLocker: 2, value: 420, weight: '5.8kg', createdAt: '2024-01-13 07:00', deliveredAt: '2024-01-13 11:00', batchId: 'BSH-004' },
];

const portalInvoicesData = [
  { id: 'INV-P001', period: 'January 2024', issueDate: '2024-02-01', dueDate: '2024-02-15', packages: 130, amount: 15600, tax: 1872, total: 17472, status: 'pending', pdfUrl: '#' },
  { id: 'INV-P002', period: 'December 2023', issueDate: '2024-01-01', dueDate: '2024-01-15', packages: 115, amount: 13800, tax: 1656, total: 15456, status: 'paid', paidDate: '2024-01-12', pdfUrl: '#' },
  { id: 'INV-P003', period: 'November 2023', issueDate: '2023-12-01', dueDate: '2023-12-15', packages: 98, amount: 11760, tax: 1411, total: 13171, status: 'paid', paidDate: '2023-12-10', pdfUrl: '#' },
  { id: 'INV-P004', period: 'October 2023', issueDate: '2023-11-01', dueDate: '2023-11-15', packages: 105, amount: 12600, tax: 1512, total: 14112, status: 'paid', paidDate: '2023-11-14', pdfUrl: '#' },
];

const portalWebhookLogsData = [
  { id: 'WH-001', event: 'package.delivered_to_locker', url: 'https://api.jumia.com.gh/webhooks/locqar', status: 200, timestamp: '2024-01-15 14:32:15', responseTime: '120ms', payload: '{"waybill":"LQ-2024-01201","status":"delivered_to_locker","locker":"A-12"}' },
  { id: 'WH-002', event: 'package.picked_up', url: 'https://api.jumia.com.gh/webhooks/locqar', status: 200, timestamp: '2024-01-15 14:28:00', responseTime: '85ms', payload: '{"waybill":"LQ-2024-01205","status":"picked_up"}' },
  { id: 'WH-003', event: 'package.in_transit', url: 'https://api.jumia.com.gh/webhooks/locqar', status: 200, timestamp: '2024-01-15 14:15:30', responseTime: '95ms', payload: '{"waybill":"LQ-2024-01203","status":"in_transit_to_locker"}' },
  { id: 'WH-004', event: 'package.expired', url: 'https://api.jumia.com.gh/webhooks/locqar', status: 500, timestamp: '2024-01-15 12:00:00', responseTime: '5002ms', payload: '{"waybill":"LQ-2024-01208","status":"expired"}', error: 'Timeout' },
  { id: 'WH-005', event: 'batch.processing', url: 'https://api.jumia.com.gh/webhooks/locqar', status: 200, timestamp: '2024-01-15 08:05:00', responseTime: '110ms', payload: '{"batchId":"BSH-001","packages":45,"status":"processing"}' },
];

const portalRateCard = [
  { size: 'Small', dimensions: '30×20×15 cm', maxWeight: '2 kg', pricePerDay: 8, storageFree: 3, storagePerDay: 2 },
  { size: 'Medium', dimensions: '45×35×25 cm', maxWeight: '5 kg', pricePerDay: 12, storageFree: 3, storagePerDay: 3 },
  { size: 'Large', dimensions: '60×45×35 cm', maxWeight: '10 kg', pricePerDay: 18, storageFree: 3, storagePerDay: 5 },
  { size: 'XLarge', dimensions: '80×60×45 cm', maxWeight: '20 kg', pricePerDay: 25, storageFree: 3, storagePerDay: 8 },
];

const portalShipmentTrend = [
  { month: 'Aug', shipped: 95, delivered: 92, returned: 3 },
  { month: 'Sep', shipped: 110, delivered: 106, returned: 4 },
  { month: 'Oct', shipped: 105, delivered: 101, returned: 4 },
  { month: 'Nov', shipped: 120, delivered: 117, returned: 3 },
  { month: 'Dec', shipped: 150, delivered: 144, returned: 6 },
  { month: 'Jan', shipped: 130, delivered: 125, returned: 5 },
];

// ============ PRICING ENGINE DATA ============
const BASE_RATE_CARD = [
  { id: 'SZ-S', size: 'Small', dimensions: '30×20×15 cm', maxWeight: 2, basePrice: 12, icon: '📦' },
  { id: 'SZ-M', size: 'Medium', dimensions: '45×35×25 cm', maxWeight: 5, basePrice: 18, icon: '📦' },
  { id: 'SZ-L', size: 'Large', dimensions: '60×45×35 cm', maxWeight: 10, basePrice: 25, icon: '📦' },
  { id: 'SZ-XL', size: 'XLarge', dimensions: '80×60×45 cm', maxWeight: 20, basePrice: 38, icon: '📦' },
];

const SLA_TIERS = [
  { id: 'SLA-STD', name: 'Standard', description: 'Next-day delivery to locker', hours: 24, multiplier: 1.0, color: palette.gray500, icon: '🕐' },
  { id: 'SLA-EXP', name: 'Express', description: 'Same-day delivery (before 6PM)', hours: 8, multiplier: 1.5, color: palette.amber500, icon: '⚡' },
  { id: 'SLA-RUSH', name: 'Rush', description: 'Within 4 hours', hours: 4, multiplier: 2.2, color: palette.red500, icon: '🔥' },
  { id: 'SLA-ECO', name: 'Economy', description: '2-3 business days', hours: 72, multiplier: 0.75, color: palette.emerald500, icon: '🌿' },
];

const DELIVERY_METHOD_PRICING = [
  { id: 'DM-WL', method: 'warehouse_to_locker', label: 'Warehouse → Locker', baseMarkup: 0, description: 'Standard flow. Package from partner warehouse to locker terminal.', icon: Warehouse, color: palette.blue500 },
  { id: 'DM-DL', method: 'dropbox_to_locker', label: 'Dropbox → Locker', baseMarkup: 3, description: 'Customer drops off at dropbox, collected and routed to locker.', icon: Inbox, color: palette.violet500 },
  { id: 'DM-LH', method: 'locker_to_home', label: 'Locker → Home', baseMarkup: 8, description: 'Last-mile home delivery from locker terminal. Includes driver dispatch.', icon: Home, color: palette.emerald500 },
  { id: 'DM-WH', method: 'warehouse_to_home', label: 'Warehouse → Home (Direct)', baseMarkup: 12, description: 'Direct home delivery bypassing locker network. Premium service.', icon: Truck, color: palette.amber500 },
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

const pricingRevenueData = [
  { month: 'Aug', standard: 8200, express: 3400, rush: 1200, economy: 2100 },
  { month: 'Sep', standard: 9100, express: 3800, rush: 1500, economy: 2300 },
  { month: 'Oct', standard: 8800, express: 4200, rush: 1800, economy: 2000 },
  { month: 'Nov', standard: 10500, express: 4800, rush: 2200, economy: 2500 },
  { month: 'Dec', standard: 12800, express: 5600, rush: 3100, economy: 2800 },
  { month: 'Jan', standard: 11200, express: 5100, rush: 2600, economy: 2400 },
];

const portalTerminalAvailability = terminalsData.map(t => ({
  ...t,
  small: { total: Math.floor(t.totalLockers * 0.3), available: Math.floor(t.available * 0.35) },
  medium: { total: Math.floor(t.totalLockers * 0.35), available: Math.floor(t.available * 0.3) },
  large: { total: Math.floor(t.totalLockers * 0.25), available: Math.floor(t.available * 0.25) },
  xlarge: { total: Math.floor(t.totalLockers * 0.1), available: Math.floor(t.available * 0.1) },
}));

const DROPBOX_FLOW_STAGES = {
  awaiting_collection: { label: 'In Dropbox', color: palette.amber500, bg: overlays.warningBg, step: 0 },
  collection_overdue: { label: 'Collection Overdue', color: palette.red500, bg: overlays.errorBg, step: 0 },
  collected: { label: 'Collected', color: palette.blue500, bg: overlays.infoBg, step: 1 },
  in_transit: { label: 'In Transit to Terminal', color: palette.indigo500, bg: overlays.indigoBg, step: 2 },
  at_terminal: { label: 'At Terminal', color: palette.violet500, bg: overlays.violetBg, step: 3 },
  delivered_to_locker: { label: 'In Locker', color: palette.emerald500, bg: overlays.successBg, step: 4 },
};

const dropboxFillHistory = [
  { time: '6AM', dbx001: 5, dbx003: 8, dbx004: 22 },
  { time: '8AM', dbx001: 12, dbx003: 15, dbx004: 25 },
  { time: '10AM', dbx001: 25, dbx003: 22, dbx004: 28 },
  { time: '12PM', dbx001: 35, dbx003: 28, dbx004: 30 },
  { time: '2PM', dbx001: 42, dbx003: 31, dbx004: 30 },
];

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
  { id: 2, name: 'Operations', members: 4, lead: 'Kofi Asante', color: palette.blue500 },
  { id: 3, name: 'Field', members: 8, lead: 'Yaw Boateng', color: palette.emerald500 },
  { id: 4, name: 'Support', members: 3, lead: 'Kweku Appiah', color: palette.violet500 },
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
];

const msgVolumeData = [
  { date: 'Mon', sms: 420, whatsapp: 380 },
  { date: 'Tue', sms: 480, whatsapp: 450 },
  { date: 'Wed', sms: 510, whatsapp: 490 },
  { date: 'Thu', sms: 390, whatsapp: 370 },
  { date: 'Fri', sms: 550, whatsapp: 520 },
  { date: 'Sat', sms: 320, whatsapp: 280 },
  { date: 'Sun', sms: 180, whatsapp: 150 },
];

const MSG_STATUSES = {
  delivered: { label: 'Delivered', color: palette.emerald500, bg: overlays.successBg, icon: '✓✓' },
  read: { label: 'Read', color: palette.blue500, bg: overlays.infoBg, icon: '✓✓' },
  sent: { label: 'Sent', color: palette.amber500, bg: overlays.warningBg, icon: '✓' },
  failed: { label: 'Failed', color: palette.red500, bg: overlays.errorBg, icon: '✕' },
  pending: { label: 'Pending', color: palette.gray500, bg: overlays.grayBg, icon: '⏳' },
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
  on_track: { label: 'On Track', color: palette.emerald500, bg: overlays.successBg, icon: CheckCircle2, pulse: false },
  warning: { label: 'Warning', color: palette.amber500, bg: overlays.warningBg, icon: AlertTriangle, pulse: false },
  critical: { label: 'Critical', color: palette.orange500, bg: overlays.orangeBg, icon: AlertOctagon, pulse: true },
  breached: { label: 'BREACHED', color: palette.red500, bg: overlays.errorEmphasis, icon: XCircle, pulse: true },
};

const ESCALATION_RULES = [
  { level: 0, name: 'Monitoring', triggerPct: 0, actions: ['Standard tracking active'], color: palette.emerald500, icon: Eye, role: 'System' },
  { level: 1, name: 'Auto-Alert', triggerPct: 75, actions: ['SMS + WhatsApp to customer', 'Push notification to assigned agent', 'Flag in agent dashboard'], color: palette.amber500, icon: Bell, role: 'System' },
  { level: 2, name: 'Manager Escalation', triggerPct: 90, actions: ['Urgent alert to branch manager', 'Auto-reassign to nearest available driver', 'Priority queue bump'], color: palette.orange500, icon: Users, role: 'Branch Manager' },
  { level: 3, name: 'Executive Escalation', triggerPct: 100, actions: ['Alert operations director', 'Auto-generate incident report', 'Freeze new deliveries to terminal', 'Customer compensation workflow'], color: palette.red500, icon: AlertOctagon, role: 'Ops Director' },
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

const notifications = [
  { id: 1, title: 'Locker A-20 needs maintenance', type: 'warning', time: '5 min ago', read: false },
  { id: 2, title: 'Dropbox DBX-004 is full', type: 'warning', time: '10 min ago', read: false },
  { id: 3, title: 'New shipment from Jumia (45 packages)', type: 'info', time: '15 min ago', read: false },
  { id: 4, title: 'Package LQ-2024-00005 expired', type: 'error', time: '1 hour ago', read: true },
  { id: 5, title: 'Driver Kwesi completed 12 deliveries', type: 'success', time: '2 hours ago', read: true },
];


// ============ UTILITY COMPONENTS ============

// Toast Notification System
const Toast = ({ message, type = 'info', onClose }) => {
  const theme = useContext(ThemeContext);
  const icons = { success: CheckCircle, error: XCircle, warning: AlertTriangle, info: Info };
  const Icon = icons[type] || Info;
  const colors = { success: palette.emerald500, error: palette.red500, warning: palette.amber500, info: palette.blue500 };
  
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

// Global Search Modal
const GlobalSearchModal = ({ isOpen, onClose, theme, onNavigate }) => {
  const [query, setQuery] = useState('');
  
  const results = useMemo(() => {
    if (!query || query.length < 2) return { packages: [], customers: [], lockers: [] };
    const q = query.toLowerCase();
    return {
      packages: packagesData.filter(p => p.waybill.toLowerCase().includes(q) || p.customer.toLowerCase().includes(q) || p.phone.includes(q)).slice(0, 5),
      customers: customersData.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)).slice(0, 3),
      lockers: lockersData.filter(l => l.id.toLowerCase().includes(q) || l.terminal.toLowerCase().includes(q) || (getLockerAddress(l.id, l.terminal) || '').toLowerCase().includes(q)).slice(0, 3),
    };
  }, [query]);

  const hasResults = results.packages.length > 0 || results.customers.length > 0 || results.lockers.length > 0;

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-2xl rounded-2xl border shadow-2xl" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <Search size={20} style={{ color: theme.text.muted }} />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by phone, waybill, address code, name..." autoFocus className="flex-1 bg-transparent outline-none text-lg" style={{ color: theme.text.primary }} />
          <kbd className="px-2 py-1 rounded text-xs" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted }}>ESC</kbd>
        </div>
        {query.length >= 2 && (
          <div className="max-h-96 overflow-y-auto p-2">
            {!hasResults ? (
              <p className="p-4 text-center" style={{ color: theme.text.muted }}>No results found for "{query}"</p>
            ) : (
              <>
                {results.packages.length > 0 && (
                  <div className="mb-4">
                    <p className="px-3 py-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Packages</p>
                    {results.packages.map(pkg => (
                      <button key={pkg.id} onClick={() => { onNavigate('packages', pkg); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left">
                        <Package size={18} style={{ color: theme.accent.primary }} />
                        <div className="flex-1"><p className="font-mono text-sm" style={{ color: theme.text.primary }}>{pkg.waybill}</p><p className="text-xs" style={{ color: theme.text.muted }}>{pkg.customer} • {pkg.destination}</p></div>
                        <StatusBadge status={pkg.status} />
                      </button>
                    ))}
                  </div>
                )}
                {results.customers.length > 0 && (
                  <div className="mb-4">
                    <p className="px-3 py-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customers</p>
                    {results.customers.map(c => (
                      <button key={c.id} onClick={() => { onNavigate('customers', c); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left">
                        <Users size={18} style={{ color: palette.blue500 }} />
                        <div className="flex-1"><p className="text-sm" style={{ color: theme.text.primary }}>{c.name}</p><p className="text-xs" style={{ color: theme.text.muted }}>{c.email}</p></div>
                        <StatusBadge status={c.type} />
                      </button>
                    ))}
                  </div>
                )}
                {results.lockers.length > 0 && (
                  <div>
                    <p className="px-3 py-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Lockers</p>
                    {results.lockers.map(l => (
                      <button key={l.id} onClick={() => { onNavigate('lockers', l); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left">
                        <Grid3X3 size={18} style={{ color: palette.emerald500 }} />
                        <div className="flex-1"><p className="font-mono text-sm" style={{ color: theme.text.primary }}>{l.id}</p><p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{getLockerAddress(l.id, l.terminal)}</p><p className="text-xs" style={{ color: theme.text.muted }}>{l.terminal}</p></div>
                        <StatusBadge status={l.status} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <div className="flex items-center gap-4 p-3 border-t text-xs" style={{ borderColor: theme.border.primary, color: theme.text.muted }}>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.bg.tertiary }}>↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.bg.tertiary }}>↵</kbd> Select</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.bg.tertiary }}>ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  );
};

// Keyboard Shortcuts Modal
const ShortcutsModal = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-md rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: theme.text.primary }}><Keyboard size={20} /> Keyboard Shortcuts</h2>
          <button onClick={onClose} className="p-2 rounded-lg" style={{ color: theme.text.muted }}><X size={18} /></button>
        </div>
        <div className="space-y-3">
          {SHORTCUTS.map(s => (
            <div key={s.action} className="flex items-center justify-between py-2">
              <span style={{ color: theme.text.secondary }}>{s.label}</span>
              <div className="flex gap-1">{s.keys.map(k => <kbd key={k} className="px-2 py-1 rounded text-xs" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}>{k}</kbd>)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Session Timeout Warning
const SessionTimeoutModal = ({ isOpen, onExtend, onLogout, remainingTime, theme }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-sm rounded-2xl border p-6 text-center" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: overlays.warningBg }}>
          <Clock size={32} className="text-amber-500" />
        </div>
        <h2 className="text-lg font-semibold mb-2" style={{ color: theme.text.primary }}>Session Expiring</h2>
        <p className="text-sm mb-4" style={{ color: theme.text.muted }}>Your session will expire in <span className="font-bold text-amber-500">{remainingTime}s</span>. Would you like to continue?</p>
        <div className="flex gap-3">
          <button onClick={onLogout} className="flex-1 py-2 rounded-xl border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Logout</button>
          <button onClick={onExtend} className="flex-1 py-2 rounded-xl text-white" style={{ backgroundColor: theme.accent.primary }}>Continue Session</button>
        </div>
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

// Export Modal
const ExportModal = ({ isOpen, onClose, onExport, dataType, theme }) => {
  const [format, setFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('all');

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-md rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2" style={{ color: theme.text.primary }}><FileDown size={20} /> Export {dataType}</h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm mb-2 block" style={{ color: theme.text.muted }}>Format</label>
            <div className="flex gap-2">{['csv', 'xlsx', 'pdf'].map(f => (
              <button key={f} onClick={() => setFormat(f)} className="flex-1 py-2 rounded-xl text-sm uppercase" style={{ backgroundColor: format === f ? theme.accent.light : theme.bg.tertiary, color: format === f ? theme.accent.primary : theme.text.secondary, border: format === f ? `1px solid ${theme.accent.border}` : `1px solid ${theme.border.primary}` }}>{f}</button>
            ))}</div>
          </div>
          <div>
            <label className="text-sm mb-2 block" style={{ color: theme.text.muted }}>Date Range</label>
            <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="w-full px-3 py-2 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2 rounded-xl border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Cancel</button>
          <button onClick={() => { onExport(format, dateRange); onClose(); }} className="flex-1 py-2 rounded-xl text-white flex items-center justify-center gap-2" style={{ backgroundColor: theme.accent.primary }}><Download size={16} /> Export</button>
        </div>
      </div>
    </div>
  );
};


// ============ UI COMPONENTS ============

const StatusBadge = ({ status }) => {
  const config = ALL_STATUSES[status] || { label: status, color: palette.gray500, bg: overlays.grayBg };
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
      { icon: Users, label: 'Customers', id: 'customers', permission: 'customers.view', subItems: ['All Customers', 'B2B Partners', 'Support Tickets'] },
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
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${idx === currentStep ? 'ring-2 ring-offset-1' : ''}`} style={{ backgroundColor: idx <= currentStep ? method.color : overlays.grayEmphasis, ringColor: method.color }}>
              {idx < currentStep ? <CheckCircle size={14} className="text-white" /> : idx === currentStep ? <Circle size={8} className="text-white fill-white" /> : <Circle size={8} style={{ color: alpha(palette.gray500, 0.5) }} />}
            </div>
            <span className={`text-xs mt-1 ${idx === currentStep ? 'font-medium' : ''}`} style={{ color: idx <= currentStep ? method.color : palette.gray500 }}>{step}</span>
          </div>
          {idx < steps.length - 1 && <div className="flex-1 h-0.5 -mt-4" style={{ backgroundColor: idx < currentStep ? method.color : overlays.grayEmphasis }} />}
        </React.Fragment>
      ))}
    </div>
  );
};


// ============ PACKAGE DETAIL DRAWER ============
const PackageDetailDrawer = ({ pkg, onClose, theme, userRole, addToast }) => {
  const [activeTab, setActiveTab] = useState('details');
  if (!pkg) return null;

  const handleAction = (action) => {
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
        <div className="mx-4 mt-4 p-4 rounded-xl" style={{ backgroundColor: overlays.successBg, border: '1px solid rgba(16, 185, 129, 0.2)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Grid3X3 size={20} className="text-emerald-500" />
              <div><p className="text-sm font-medium text-emerald-500">Locker {pkg.locker}</p><p className="text-xs" style={{ color: theme.text.muted }}>{pkg.destination}</p><p className="text-xs font-mono" style={{ color: palette.emerald500 }}>{getLockerAddress(pkg.locker, pkg.destination)}</p></div>
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
                <button onClick={() => handleAction('marked as delivered')} className="flex flex-col items-center gap-2 p-3 rounded-xl text-emerald-500" style={{ backgroundColor: overlays.successBg, border: '1px solid rgba(16, 185, 129, 0.2)' }}><CheckCircle2 size={20} /><span className="text-xs">Delivered</span></button>
                <button onClick={() => handleAction('reassigned')} className="flex flex-col items-center gap-2 p-3 rounded-xl text-amber-500" style={{ backgroundColor: overlays.warningBg, border: '1px solid rgba(245, 158, 11, 0.2)' }}><RefreshCw size={20} /><span className="text-xs">Reassign</span></button>
                <button onClick={() => handleAction('marked for return')} className="flex flex-col items-center gap-2 p-3 rounded-xl text-red-500" style={{ backgroundColor: overlays.errorBg, border: '1px solid rgba(239, 68, 68, 0.2)' }}><PackageX size={20} /><span className="text-xs">Return</span></button>
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
  const COLORS = [palette.emerald500, palette.blue500, palette.amber500, palette.red500, palette.gray500];
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
export default function LocQarERP() {
  const [themeName, setThemeName] = useState('dark');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: 'John Doe', email: 'john@locqar.com', role: 'SUPER_ADMIN' });
  const [packageFilter, setPackageFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [toasts, setToasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [metrics, setMetrics] = useState({ totalPackages: 1847, inLockers: 892, inTransit: 234, pendingPickup: 156, revenue: 48200 });

  const theme = themes[themeName];

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
          case 's': e.preventDefault(); addToast({ type: 'info', message: 'Scanner activated' }); break;
          case 'n': e.preventDefault(); addToast({ type: 'info', message: 'New package form opened' }); break;
        }
      }
      if (e.key === 'Escape') { setShowSearch(false); setShowShortcuts(false); setSelectedPackage(null); }
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
    return packagesData.filter(pkg => {
      if (packageFilter !== 'all') {
        const statusMap = { warehouse: 'at_warehouse', transit: ['in_transit_to_locker', 'in_transit_to_home'], locker: 'delivered_to_locker', pending_pickup: 'delivered_to_locker', delivered: ['delivered_to_locker', 'delivered_to_home', 'picked_up'], expired: 'expired' };
        const match = statusMap[packageFilter];
        if (Array.isArray(match) ? !match.includes(pkg.status) : pkg.status !== match) return false;
      }
      if (methodFilter !== 'all' && pkg.deliveryMethod !== methodFilter) return false;
      return true;
    });
  }, [packageFilter, methodFilter]);

  const paginatedPackages = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPackages.slice(start, start + pageSize);
  }, [filteredPackages, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredPackages.length / pageSize);
  const toggleSelectAll = () => { if (selectedItems.length === paginatedPackages.length) { setSelectedItems([]); } else { setSelectedItems(paginatedPackages.map(p => p.id)); } };
  const toggleSelectItem = (id) => { setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]); };
  const handleBulkAction = (action) => { addToast({ type: 'success', message: `${action} applied to ${selectedItems.length} packages` }); setSelectedItems([]); };
  const handleExport = (format) => { addToast({ type: 'success', message: `Exporting ${activeMenu} data as ${format.toUpperCase()}...` }); };
  const handleSearchNavigate = (menu, item) => { setActiveMenu(menu); if (menu === 'packages') setSelectedPackage(item); };

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
    <ThemeContext.Provider value={theme}>
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
              {hasPermission(currentUser.role, 'packages.scan') && <button onClick={() => addToast({ type: 'info', message: 'Scanner ready' })} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><QrCode size={18} />Scan</button>}
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
              <div className="p-4 md:p-6 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Good afternoon, {currentUser.name.split(' ')[0]} 👋</h1>
                    <p style={{ color: theme.text.muted }}>Here's your network overview.</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                      <Download size={16} /> Export
                    </button>
                    <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1000); }} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                      <RefreshCw size={16} /> Refresh
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <MetricCard title="Total Packages" value={metrics.totalPackages.toLocaleString()} change="12.5%" changeType="up" icon={Package} theme={theme} loading={loading} />
                  <MetricCard title="In Lockers" value={metrics.inLockers.toLocaleString()} change="8.2%" changeType="up" icon={Grid3X3} subtitle="Awaiting pickup" theme={theme} loading={loading} />
                  <MetricCard title="In Transit" value={metrics.inTransit.toLocaleString()} icon={Truck} theme={theme} loading={loading} />
                  <MetricCard title="Pending Pickup" value={metrics.pendingPickup.toLocaleString()} change="5.1%" changeType="down" icon={Clock} theme={theme} loading={loading} />
                  <MetricCard title="Revenue" value={`GH₵ ${(metrics.revenue / 1000).toFixed(1)}K`} change="18.7%" changeType="up" icon={DollarSign} theme={theme} loading={loading} />
                </div>

                <div className="p-4 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: theme.text.muted }}>Quick Actions</h3>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    <QuickAction icon={Scan} label="Scan" theme={theme} disabled={!hasPermission(currentUser.role, 'packages.scan')} onClick={() => addToast({ type: 'info', message: 'Scanner activated' })} />
                    <QuickAction icon={Plus} label="New Package" theme={theme} disabled={!hasPermission(currentUser.role, 'packages.receive')} onClick={() => addToast({ type: 'info', message: 'New package form' })} />
                    <QuickAction icon={Truck} label="Dispatch" theme={theme} disabled={!hasPermission(currentUser.role, 'packages.dispatch')} onClick={() => setActiveMenu('dispatch')} badge="12" />
                    <QuickAction icon={Route} label="Route Plan" theme={theme} disabled={!hasPermission(currentUser.role, 'packages.dispatch')} onClick={() => { setActiveMenu('dispatch'); setActiveSubMenu('Route Planning'); }} />
                    <QuickAction icon={Home} label="Home Delivery" theme={theme} disabled={!hasPermission(currentUser.role, 'packages.dispatch')} onClick={() => addToast({ type: 'info', message: 'Home delivery queue' })} />
                    <QuickAction icon={AlertTriangle} label="Report Issue" theme={theme} onClick={() => addToast({ type: 'warning', message: 'Issue report form' })} />
                    <QuickAction icon={Grid3X3} label="Lockers" theme={theme} onClick={() => setActiveMenu('lockers')} />
                    <QuickAction icon={Users} label="Customers" theme={theme} onClick={() => setActiveMenu('customers')} />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.values(DELIVERY_METHODS).map(m => {
                    const count = packagesData.filter(p => p.deliveryMethod === m.id).length;
                    return (
                      <div key={m.id} className="p-4 rounded-xl border flex items-center gap-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <div className="p-3 rounded-xl" style={{ backgroundColor: `${m.color}15` }}><m.icon size={24} style={{ color: m.color }} /></div>
                        <div className="flex-1"><p className="font-medium" style={{ color: theme.text.primary }}>{m.label}</p></div>
                        <p className="text-2xl font-bold" style={{ color: m.color }}>{count}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold" style={{ color: theme.text.primary }}>Terminal Performance</h3>
                      <div className="flex gap-2">
                        {[{ label: 'Accra', color: theme.accent.primary }, { label: 'Achimota', color: palette.blue500 }, { label: 'Kotoka', color: palette.emerald500 }].map(l => (
                          <span key={l.label} className="flex items-center gap-1 text-xs" style={{ color: theme.text.muted }}>
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.color }} />{l.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    {loading ? <TableSkeleton rows={3} cols={1} theme={theme} /> : (
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={terminalData}>
                          <defs>
                            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor={theme.accent.primary} stopOpacity={0.3}/>
                              <stop offset="95%" stopColor={theme.accent.primary} stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                          <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                          <Area type="monotone" dataKey="accra" stroke={theme.accent.primary} fill="url(#grad)" strokeWidth={2} />
                          <Area type="monotone" dataKey="achimota" stroke="#3b82f6" fill="transparent" strokeWidth={2} />
                          <Area type="monotone" dataKey="kotoka" stroke="#10b981" fill="transparent" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>
                  <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Package Status</h3>
                    {loading ? <TableSkeleton rows={3} cols={1} theme={theme} /> : (
                      <>
                        <StatusPieChart data={statusDistribution} theme={theme} />
                        <div className="space-y-2 mt-4">
                          {statusDistribution.map((s, i) => (
                            <div key={s.name} className="flex items-center justify-between">
                              <span className="flex items-center gap-2 text-sm" style={{ color: theme.text.secondary }}>
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: [palette.emerald500, palette.blue500, palette.amber500, palette.red500, palette.gray500][i] }} />
                                {s.name}
                              </span>
                              <span className="font-medium" style={{ color: theme.text.primary }}>{s.value}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Peak Hours</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <BarChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                        <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 10 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 10 }} />
                        <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                        <Bar dataKey="packages" fill={theme.accent.primary} radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Recent Activity</h3>
                    <div className="space-y-3">
                      {notifications.slice(0, 5).map(n => (
                        <div key={n.id} className="flex gap-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${n.type === 'error' ? 'bg-red-500' : n.type === 'warning' ? 'bg-amber-500' : n.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                          <div>
                            <p className="text-sm" style={{ color: theme.text.primary }}>{n.title}</p>
                            <p className="text-xs" style={{ color: theme.text.muted }}>{n.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Packages Page */}
            {activeMenu === 'packages' && (
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Packages</h1>
                    <p style={{ color: theme.text.muted }}>{activeSubMenu || 'All Packages'} • {filteredPackages.length} packages</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                      <Download size={16} /> Export
                    </button>
                    {hasPermission(currentUser.role, 'packages.receive') && (
                      <button onClick={() => addToast({ type: 'info', message: 'New package form opened' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}>
                        <Plus size={18} /> Add Package
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {[['all', 'All'], ['locker', 'In Locker'], ['pending_pickup', 'Pending Pickup'], ['transit', 'In Transit'], ['expired', 'Expired']].map(([k, l]) => (
                    <button key={k} onClick={() => { setPackageFilter(k); setCurrentPage(1); }} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: packageFilter === k ? theme.accent.light : 'transparent', color: packageFilter === k ? theme.accent.primary : theme.text.muted, border: packageFilter === k ? `1px solid ${theme.accent.border}` : '1px solid transparent' }}>{l}</button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <span className="text-sm py-2" style={{ color: theme.text.muted }}>Method:</span>
                  {[['all', 'All'], ...Object.entries(DELIVERY_METHODS).map(([k, v]) => [k, v.label])].map(([k, l]) => (
                    <button key={k} onClick={() => { setMethodFilter(k); setCurrentPage(1); }} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: methodFilter === k ? (DELIVERY_METHODS[k]?.color || theme.accent.primary) + '15' : 'transparent', color: methodFilter === k ? DELIVERY_METHODS[k]?.color || theme.accent.primary : theme.text.muted }}>{l}</button>
                  ))}
                </div>

                <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                  {loading ? <TableSkeleton rows={pageSize} cols={7} theme={theme} /> : filteredPackages.length === 0 ? (
                    <EmptyState icon={Package} title="No packages found" description="There are no packages matching your current filters. Try adjusting your search criteria." action="Add New Package" theme={theme} />
                  ) : (
                    <>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <th className="text-left p-4 w-10">
                                <Checkbox checked={selectedItems.length === paginatedPackages.length && paginatedPackages.length > 0} onChange={toggleSelectAll} theme={theme} />
                              </th>
                              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Package</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Customer</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Method</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Destination</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Value</th>
                              <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginatedPackages.map(pkg => (
                              <tr key={pkg.id} className="cursor-pointer hover:bg-white/5" style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                                <td className="p-4" onClick={e => e.stopPropagation()}>
                                  <Checkbox checked={selectedItems.includes(pkg.id)} onChange={() => toggleSelectItem(pkg.id)} theme={theme} />
                                </td>
                                <td className="p-4" onClick={() => setSelectedPackage(pkg)}>
                                  <p className="font-mono font-medium" style={{ color: theme.text.primary }}>{pkg.waybill}</p>
                                  <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.product}</p>
                                </td>
                                <td className="p-4 hidden md:table-cell" onClick={() => setSelectedPackage(pkg)}>
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: theme.accent.primary }}>{pkg.customer.charAt(0)}</div>
                                    <div>
                                      <p className="text-sm" style={{ color: theme.text.primary }}>{pkg.customer}</p>
                                      <p className="text-xs" style={{ color: theme.text.muted }}>{pkg.phone}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4 hidden lg:table-cell" onClick={() => setSelectedPackage(pkg)}><DeliveryMethodBadge method={pkg.deliveryMethod} /></td>
                                <td className="p-4 hidden md:table-cell" onClick={() => setSelectedPackage(pkg)}>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <MapPin size={14} style={{ color: theme.text.muted }} />
                                      <span className="text-sm" style={{ color: theme.text.secondary }}>{pkg.destination}</span>
                                      {pkg.locker !== '-' && <span className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}>{pkg.locker}</span>}
                                    </div>
                                    {(() => { const t = terminalsData.find(t => t.name === pkg.destination); return t ? <p className="text-xs font-mono mt-0.5" style={{ color: theme.accent.primary }}>{pkg.locker !== '-' ? getLockerAddress(pkg.locker, pkg.destination) : getTerminalAddress(t)}</p> : null; })()}
                                  </div>
                                </td>
                                <td className="p-4" onClick={() => setSelectedPackage(pkg)}><StatusBadge status={pkg.status} /></td>
                                <td className="p-4 hidden lg:table-cell" onClick={() => setSelectedPackage(pkg)}>
                                  <span className="text-sm" style={{ color: theme.text.primary }}>GH₵ {pkg.value}</span>
                                  {pkg.cod && <span className="ml-2 text-xs text-amber-500">COD</span>}
                                </td>
                                <td className="p-4 text-right">
                                  <button onClick={() => setSelectedPackage(pkg)} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Eye size={16} /></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} pageSize={pageSize} onPageSizeChange={(size) => { setPageSize(size); setCurrentPage(1); }} totalItems={filteredPackages.length} theme={theme} />
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Dropbox Management */}
            {activeMenu === 'dropboxes' && (
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
                      <Inbox size={28} style={{ color: palette.violet500 }} /> Dropbox Management
                    </h1>
                    <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Overview'} • {dropboxesData.filter(d => d.status === 'active').length} active dropboxes</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={16} />Export</button>
                    {hasPermission(currentUser.role, 'packages.receive') && (
                      <button onClick={() => addToast({ type: 'info', message: 'New dropbox setup wizard' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: palette.violet500 }}><Plus size={18} />Add Dropbox</button>
                    )}
                  </div>
                </div>

                {/* Overview */}
                {(!activeSubMenu || activeSubMenu === 'Overview') && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <MetricCard title="Total Dropboxes" value={dropboxesData.length} icon={Inbox} theme={theme} loading={loading} />
                      <MetricCard title="Active" value={dropboxesData.filter(d => d.status === 'active').length} icon={CheckCircle2} theme={theme} loading={loading} />
                      <MetricCard title="Full / Near Full" value={dropboxesData.filter(d => d.currentFill / d.capacity > 0.8).length} icon={AlertTriangle} theme={theme} loading={loading} subtitle="Need attention" />
                      <MetricCard title="Packages Waiting" value={dropboxesData.reduce((s, d) => s + d.currentFill, 0)} icon={Package} theme={theme} loading={loading} />
                      <MetricCard title="Overdue Collections" value={collectionsData.filter(c => c.status === 'overdue').length} icon={Clock} theme={theme} loading={loading} subtitle={collectionsData.filter(c => c.status === 'overdue').length > 0 ? 'Action required!' : 'All on time'} />
                    </div>

                    {/* Alerts Banner */}
                    {dropboxesData.some(d => d.alerts.length > 0) && (
                      <div className="p-4 rounded-2xl border flex items-start gap-4" style={{ backgroundColor: overlays.errorSubtle, borderColor: overlays.errorEmphasis }}>
                        <AlertTriangle size={24} className="text-red-500 mt-0.5 shrink-0" />
                        <div className="flex-1">
                          <p className="font-semibold text-red-500 mb-1">Attention Required</p>
                          <div className="flex flex-wrap gap-2">
                            {dropboxesData.filter(d => d.status === 'full').map(d => (
                              <span key={d.id} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: overlays.errorBg, color: palette.red500 }}>🔴 {d.name} is FULL — collection overdue</span>
                            ))}
                            {dropboxesData.filter(d => d.alerts.includes('near_full') && d.status !== 'full').map(d => (
                              <span key={d.id} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: overlays.warningBg, color: palette.amber500 }}>🟡 {d.name} at {Math.round(d.currentFill / d.capacity * 100)}% — schedule collection</span>
                            ))}
                            {dropboxesData.filter(d => d.alerts.includes('collection_due')).map(d => (
                              <span key={d.id} className="px-3 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: overlays.infoBg, color: palette.blue500 }}>🔵 {d.name} collection due soon</span>
                            ))}
                          </div>
                        </div>
                        <button onClick={() => addToast({ type: 'info', message: 'Dispatching emergency collections...' })} className="px-4 py-2 rounded-xl text-white text-sm shrink-0" style={{ backgroundColor: palette.red500 }}>Dispatch Now</button>
                      </div>
                    )}

                    {/* Fill Level Chart */}
                    <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold" style={{ color: theme.text.primary }}>Fill Levels Today</h3>
                        <div className="flex gap-3">
                          {[{ l: 'Achimota', c: theme.accent.primary }, { l: 'Osu', c: palette.violet500 }, { l: 'Tema', c: palette.red500 }].map(i => (
                            <span key={i.l} className="flex items-center gap-1 text-xs" style={{ color: theme.text.muted }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: i.c }} />{i.l}</span>
                          ))}
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart data={dropboxFillHistory}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                          <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                          <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                          <Area type="monotone" dataKey="dbx001" name="Achimota Overpass" stroke={theme.accent.primary} fill={`${theme.accent.primary}20`} strokeWidth={2} />
                          <Area type="monotone" dataKey="dbx003" name="Osu Oxford St" stroke="#8b5cf6" fill="transparent" strokeWidth={2} />
                          <Area type="monotone" dataKey="dbx004" name="Tema Comm. 1" stroke="#ef4444" fill="transparent" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Dropbox Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {dropboxesData.map(dbx => {
                        const fillPercent = Math.round((dbx.currentFill / dbx.capacity) * 100);
                        const fillColor = fillPercent >= 95 ? palette.red500 : fillPercent >= 75 ? palette.amber500 : fillPercent >= 50 ? palette.blue500 : palette.emerald500;
                        const isUrgent = dbx.status === 'full' || dbx.alerts.includes('collection_overdue');
                        return (
                          <div key={dbx.id} className="rounded-2xl border overflow-hidden transition-all hover:shadow-lg" style={{ backgroundColor: theme.bg.card, borderColor: isUrgent ? palette.red500 : theme.border.primary, borderWidth: isUrgent ? 2 : 1 }}>
                            <div className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: fillPercent >= 85 ? overlays.errorBg : overlays.violetBg }}>
                                    <Inbox size={24} style={{ color: fillPercent >= 85 ? palette.red500 : palette.violet500 }} />
                                  </div>
                                  <div>
                                    <p className="font-semibold" style={{ color: theme.text.primary }}>{dbx.name}</p>
                                    <p className="text-xs" style={{ color: theme.text.muted }}>{dbx.id} • {dbx.location}</p>
                                  </div>
                                </div>
                                <StatusBadge status={dbx.status} />
                              </div>

                              {/* Fill Level Gauge */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs font-medium" style={{ color: theme.text.muted }}>Fill Level</span>
                                  <span className="text-sm font-bold" style={{ color: fillColor }}>{dbx.currentFill}/{dbx.capacity} ({fillPercent}%)</span>
                                </div>
                                <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: theme.border.primary }}>
                                  <div className="h-full rounded-full transition-all" style={{ width: `${fillPercent}%`, backgroundColor: fillColor, boxShadow: fillPercent >= 85 ? `0 0 8px ${fillColor}40` : 'none' }} />
                                </div>
                                <div className="flex justify-between mt-1">
                                  <span className="text-xs" style={{ color: theme.text.muted }}>0</span>
                                  <span className="text-xs" style={{ color: theme.text.muted }}>{dbx.capacity}</span>
                                </div>
                              </div>

                              {/* Info Grid */}
                              <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                                <div className="p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                                  <p className="text-xs" style={{ color: theme.text.muted }}>Agent</p>
                                  <p className="font-medium truncate" style={{ color: theme.text.primary }}>{dbx.assignedAgent || '—'}</p>
                                </div>
                                <div className="p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                                  <p className="text-xs" style={{ color: theme.text.muted }}>Terminal</p>
                                  <p className="font-medium truncate" style={{ color: theme.text.primary }}>{dbx.terminal}</p>
                                </div>
                                <div className="p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                                  <p className="text-xs" style={{ color: theme.text.muted }}>Last Collection</p>
                                  <p className="font-medium" style={{ color: theme.text.primary }}>{dbx.lastCollection?.split(' ')[1] || '—'}</p>
                                </div>
                                <div className="p-2 rounded-lg" style={{ backgroundColor: isUrgent ? overlays.errorBg : theme.bg.tertiary }}>
                                  <p className="text-xs" style={{ color: isUrgent ? palette.red500 : theme.text.muted }}>Next Collection</p>
                                  <p className="font-medium" style={{ color: isUrgent ? palette.red500 : theme.text.primary }}>{dbx.nextCollection?.split(' ')[1] || 'N/A'}</p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-xs" style={{ color: theme.text.muted }}>
                                <span>Avg. {dbx.avgDailyVolume}/day</span>
                                <span>Total out: {dbx.packagesOut}</span>
                                <span className="px-2 py-0.5 rounded-full" style={{ backgroundColor: dbx.type === 'premium' ? overlays.violetBg : theme.bg.tertiary, color: dbx.type === 'premium' ? palette.violet500 : theme.text.muted }}>{dbx.type}</span>
                              </div>
                            </div>

                            {/* Actions Footer */}
                            <div className="flex border-t" style={{ borderColor: theme.border.primary }}>
                              <button onClick={() => addToast({ type: 'info', message: `Scheduling collection for ${dbx.name}` })} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: palette.violet500 }}>
                                <Truck size={14} />Collect
                              </button>
                              <div className="w-px" style={{ backgroundColor: theme.border.primary }} />
                              <button onClick={() => addToast({ type: 'info', message: `Opening details for ${dbx.name}` })} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: theme.text.secondary }}>
                                <Eye size={14} />Details
                              </button>
                              <div className="w-px" style={{ backgroundColor: theme.border.primary }} />
                              <button onClick={() => addToast({ type: 'info', message: `Editing ${dbx.name}` })} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: theme.text.secondary }}>
                                <Edit size={14} />Edit
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Collections Schedule */}
                {activeSubMenu === 'Collections' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MetricCard title="Scheduled" value={collectionsData.filter(c => c.status === 'scheduled').length} icon={Calendar} theme={theme} loading={loading} />
                      <MetricCard title="In Progress" value={collectionsData.filter(c => c.status === 'in_progress').length} icon={Truck} theme={theme} loading={loading} />
                      <MetricCard title="Completed Today" value={collectionsData.filter(c => c.status === 'completed').length} icon={CheckCircle2} theme={theme} loading={loading} />
                      <MetricCard title="Overdue" value={collectionsData.filter(c => c.status === 'overdue').length} icon={AlertTriangle} theme={theme} loading={loading} subtitle={collectionsData.filter(c => c.status === 'overdue').length > 0 ? '⚠️ Needs dispatch' : 'All clear'} />
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => addToast({ type: 'info', message: 'Schedule new collection' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: palette.violet500 }}><Plus size={16} />Schedule Collection</button>
                      <button onClick={() => addToast({ type: 'info', message: 'Auto-optimizing routes...' })} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Route size={16} />Optimize Routes</button>
                    </div>

                    {/* Priority Collections First */}
                    {collectionsData.filter(c => c.status === 'overdue').length > 0 && (
                      <div className="p-4 rounded-2xl" style={{ backgroundColor: overlays.errorSubtle, border: '1px solid rgba(239,68,68,0.2)' }}>
                        <p className="text-sm font-semibold text-red-500 mb-3 flex items-center gap-2"><AlertTriangle size={16} /> Overdue Collections</p>
                        <div className="space-y-2">
                          {collectionsData.filter(c => c.status === 'overdue').map(c => (
                            <div key={c.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: theme.bg.card }}>
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                                <div>
                                  <p className="font-medium" style={{ color: theme.text.primary }}>{c.dropboxName}</p>
                                  <p className="text-xs" style={{ color: theme.text.muted }}>{c.packages} packages • Assigned: {c.agent}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => addToast({ type: 'info', message: `Calling ${c.agent}...` })} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: overlays.infoBg, color: palette.blue500 }}><Phone size={12} className="inline mr-1" />Call Agent</button>
                                <button onClick={() => addToast({ type: 'success', message: `Reassigning ${c.dropboxName} collection` })} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: overlays.errorBg, color: palette.red500 }}><RefreshCw size={12} className="inline mr-1" />Reassign</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* All Collections Table */}
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
                        <h3 className="font-semibold" style={{ color: theme.text.primary }}>All Collections</h3>
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Collection</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Dropbox</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Agent</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Vehicle</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Packages</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Priority</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>ETA</th>
                            <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {collectionsData.sort((a, b) => { const order = { overdue: 0, in_progress: 1, scheduled: 2, completed: 3 }; return (order[a.status] ?? 9) - (order[b.status] ?? 9); }).map(col => (
                            <tr key={col.id} style={{ borderBottom: `1px solid ${theme.border.primary}`, backgroundColor: col.status === 'overdue' ? overlays.errorSubtle : 'transparent' }}>
                              <td className="p-4"><span className="font-mono text-sm" style={{ color: theme.text.primary }}>{col.id}</span><br/><span className="text-xs" style={{ color: theme.text.muted }}>{col.scheduled}</span></td>
                              <td className="p-4"><span className="text-sm" style={{ color: theme.text.primary }}>{col.dropboxName}</span><br/><span className="text-xs font-mono" style={{ color: theme.text.muted }}>{col.dropbox}</span></td>
                              <td className="p-4 hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: overlays.violetBg }}>{col.agent.charAt(0)}</div>
                                  <span className="text-sm" style={{ color: theme.text.primary }}>{col.agent}</span>
                                </div>
                              </td>
                              <td className="p-4 hidden lg:table-cell"><span className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}>{col.vehicle}</span></td>
                              <td className="p-4"><span className="font-bold" style={{ color: theme.text.primary }}>{col.packages}</span></td>
                              <td className="p-4 hidden md:table-cell"><StatusBadge status={col.priority} /></td>
                              <td className="p-4"><StatusBadge status={col.status === 'overdue' ? 'expired' : col.status} /></td>
                              <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: col.status === 'overdue' ? palette.red500 : theme.text.muted }}>{col.eta}</span></td>
                              <td className="p-4 text-right">
                                {col.status === 'scheduled' && <button onClick={() => addToast({ type: 'success', message: `Collection ${col.id} started` })} className="p-2 rounded-lg hover:bg-white/5 text-emerald-500"><CheckCircle size={16} /></button>}
                                {col.status !== 'completed' && <button onClick={() => addToast({ type: 'info', message: `Reassigning ${col.id}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><RefreshCw size={16} /></button>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Agent Assignments */}
                {activeSubMenu === 'Agents' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MetricCard title="Active Agents" value={dropboxAgentsData.filter(a => a.status !== 'offline').length} icon={UserCheck} theme={theme} loading={loading} />
                      <MetricCard title="Collections Today" value={dropboxAgentsData.reduce((s, a) => s + a.collectionsToday, 0)} icon={Inbox} theme={theme} loading={loading} />
                      <MetricCard title="Packages Collected" value={dropboxAgentsData.reduce((s, a) => s + a.totalCollected, 0)} icon={Package} theme={theme} loading={loading} />
                      <MetricCard title="Unassigned Dropboxes" value={dropboxesData.filter(d => !d.assignedAgent && d.status !== 'maintenance').length} icon={AlertTriangle} theme={theme} loading={loading} />
                    </div>

                    <div className="flex gap-2">
                      <button onClick={() => addToast({ type: 'info', message: 'Assign agent form opened' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: palette.violet500 }}><UserPlus size={16} />Assign Agent</button>
                      <button onClick={() => addToast({ type: 'info', message: 'Auto-balancing agent workloads...' })} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><RefreshCw size={16} />Auto-Balance</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {dropboxAgentsData.map(agent => (
                        <div key={agent.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: overlays.violetBg }}>{agent.photo}</div>
                                <div>
                                  <p className="font-semibold text-lg" style={{ color: theme.text.primary }}>{agent.name}</p>
                                  <p className="text-sm" style={{ color: theme.text.muted }}>{agent.phone} • {agent.zone}</p>
                                  <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>{agent.vehicle}</p>
                                </div>
                              </div>
                              <StatusBadge status={agent.status} />
                            </div>

                            <div className="grid grid-cols-4 gap-3 mb-4">
                              {[['Today', agent.collectionsToday, palette.violet500], ['Collected', agent.totalCollected, palette.blue500], ['Rating', `★ ${agent.rating}`, palette.amber500], ['Avg Time', agent.avgCollectionTime, palette.emerald500]].map(([l, v, c]) => (
                                <div key={l} className="p-2 rounded-lg text-center" style={{ backgroundColor: theme.bg.tertiary }}>
                                  <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                                  <p className="font-bold" style={{ color: c }}>{v}</p>
                                </div>
                              ))}
                            </div>

                            <div>
                              <p className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>Assigned Dropboxes ({agent.assignedDropboxes.length})</p>
                              <div className="space-y-2">
                                {agent.assignedDropboxes.map(dbxId => {
                                  const dbx = dropboxesData.find(d => d.id === dbxId);
                                  if (!dbx) return null;
                                  const fp = Math.round((dbx.currentFill / dbx.capacity) * 100);
                                  const fc = fp >= 95 ? palette.red500 : fp >= 75 ? palette.amber500 : palette.emerald500;
                                  return (
                                    <div key={dbxId} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                                      <div className="flex items-center gap-3">
                                        <Inbox size={16} style={{ color: palette.violet500 }} />
                                        <div>
                                          <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{dbx.name}</p>
                                          <p className="text-xs" style={{ color: theme.text.muted }}>{dbxId} • {dbx.location}</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1">
                                          <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                                            <div className="h-full rounded-full" style={{ width: `${fp}%`, backgroundColor: fc }} />
                                          </div>
                                          <span className="text-xs font-mono" style={{ color: fc }}>{fp}%</span>
                                        </div>
                                        <span className="text-xs" style={{ color: theme.text.muted }}>Next: {dbx.nextCollection?.split(' ')[1] || 'N/A'}</span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                          <div className="flex border-t" style={{ borderColor: theme.border.primary }}>
                            <button onClick={() => addToast({ type: 'info', message: `Calling ${agent.name}...` })} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: palette.blue500 }}><Phone size={14} />Call</button>
                            <div className="w-px" style={{ backgroundColor: theme.border.primary }} />
                            <button onClick={() => addToast({ type: 'info', message: `Messaging ${agent.name}...` })} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: palette.emerald500 }}><MessageSquare size={14} />Message</button>
                            <div className="w-px" style={{ backgroundColor: theme.border.primary }} />
                            <button onClick={() => addToast({ type: 'info', message: `Editing ${agent.name} assignments` })} className="flex-1 flex items-center justify-center gap-2 py-3 text-sm hover:bg-white/5" style={{ color: theme.text.secondary }}><Edit size={14} />Edit</button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Coverage Summary */}
                    <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Zone Coverage</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...new Set(dropboxAgentsData.map(a => a.zone))].map(zone => {
                          const agents = dropboxAgentsData.filter(a => a.zone === zone);
                          const dbxCount = agents.reduce((s, a) => s + a.assignedDropboxes.length, 0);
                          return (
                            <div key={zone} className="p-4 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                              <p className="font-medium" style={{ color: theme.text.primary }}>{zone}</p>
                              <p className="text-sm" style={{ color: theme.text.muted }}>{agents.length} agent{agents.length !== 1 ? 's' : ''} • {dbxCount} dropbox{dbxCount !== 1 ? 'es' : ''}</p>
                              <div className="flex gap-1 mt-2">
                                {agents.map(a => (
                                  <div key={a.id} className="w-6 h-6 rounded-full flex items-center justify-center text-xs" style={{ backgroundColor: a.status === 'active' ? overlays.successEmphasis : a.status === 'on_delivery' ? overlays.infoEmphasis : overlays.grayEmphasis }}>{a.photo}</div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Package Flow */}
                {activeSubMenu === 'Package Flow' && (
                  <div className="space-y-6">
                    {/* Flow Stage Summary */}
                    <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Dropbox → Locker Pipeline</h3>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        {[
                          { label: 'In Dropbox', count: dropboxFlowData.filter(f => f.stage === 'awaiting_collection').length, color: palette.amber500, icon: Inbox },
                          { label: 'Overdue', count: dropboxFlowData.filter(f => f.stage === 'collection_overdue').length, color: palette.red500, icon: AlertTriangle },
                          { label: 'Collected', count: dropboxFlowData.filter(f => f.stage === 'collected').length, color: palette.blue500, icon: CheckCircle },
                          { label: 'In Transit', count: dropboxFlowData.filter(f => f.stage === 'in_transit').length, color: palette.indigo500, icon: Truck },
                          { label: 'At Terminal', count: dropboxFlowData.filter(f => f.stage === 'at_terminal').length, color: palette.violet500, icon: Building2 },
                          { label: 'In Locker', count: dropboxFlowData.filter(f => f.stage === 'delivered_to_locker').length, color: palette.emerald500, icon: Grid3X3 },
                        ].map((stage, idx, arr) => (
                          <React.Fragment key={stage.label}>
                            <div className="flex flex-col items-center p-3 rounded-xl min-w-[90px]" style={{ backgroundColor: `${stage.color}10` }}>
                              <stage.icon size={20} style={{ color: stage.color }} />
                              <p className="text-2xl font-bold mt-1" style={{ color: stage.color }}>{stage.count}</p>
                              <p className="text-xs text-center" style={{ color: stage.color }}>{stage.label}</p>
                            </div>
                            {idx < arr.length - 1 && <ChevronRight size={20} style={{ color: theme.text.muted }} className="hidden md:block shrink-0" />}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Active Flow Table */}
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                        <h3 className="font-semibold" style={{ color: theme.text.primary }}>Active Package Flow</h3>
                        <div className="flex gap-2">
                          <button onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 800); }} className="p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}><RefreshCw size={16} /></button>
                        </div>
                      </div>
                      {loading ? <TableSkeleton rows={6} cols={7} theme={theme} /> : (
                        <table className="w-full">
                          <thead>
                            <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Package</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Dropbox</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Stage</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Flow Progress</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Target Locker</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>ETA</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dropboxFlowData.map(flow => {
                              const stageInfo = DROPBOX_FLOW_STAGES[flow.stage];
                              const steps = ['Dropbox', 'Collected', 'Transit', 'Terminal', 'Locker'];
                              const currentStep = stageInfo?.step ?? 0;
                              return (
                                <tr key={flow.id} style={{ borderBottom: `1px solid ${theme.border.primary}`, backgroundColor: flow.stage === 'collection_overdue' ? overlays.errorSubtle : 'transparent' }}>
                                  <td className="p-4">
                                    <span className="font-mono font-medium text-sm" style={{ color: theme.text.primary }}>{flow.waybill}</span>
                                    <br/><span className="text-xs" style={{ color: theme.text.muted }}>{flow.depositTime}</span>
                                  </td>
                                  <td className="p-4"><span className="text-sm" style={{ color: theme.text.primary }}>{flow.customer}</span></td>
                                  <td className="p-4 hidden md:table-cell">
                                    <span className="text-sm" style={{ color: theme.text.primary }}>{flow.dropboxName}</span>
                                    <br/><span className="text-xs font-mono" style={{ color: theme.text.muted }}>{flow.dropbox}</span>
                                  </td>
                                  <td className="p-4">
                                    <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: stageInfo?.bg, color: stageInfo?.color }}>{stageInfo?.label}</span>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex items-center gap-0.5">
                                      {steps.map((step, idx) => (
                                        <React.Fragment key={step}>
                                          <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: idx <= currentStep ? (stageInfo?.color || palette.gray500) : theme.border.primary }}>
                                            {idx < currentStep ? <Check size={10} className="text-white" /> : idx === currentStep ? <Circle size={6} className="text-white fill-white" /> : null}
                                          </div>
                                          {idx < steps.length - 1 && <div className="w-3 h-0.5" style={{ backgroundColor: idx < currentStep ? (stageInfo?.color || palette.gray500) : theme.border.primary }} />}
                                        </React.Fragment>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="p-4 hidden md:table-cell">
                                    <div className="flex items-center gap-1">
                                      <Grid3X3 size={14} style={{ color: theme.text.muted }} />
                                      <span className="font-mono text-sm" style={{ color: theme.text.primary }}>{flow.targetLocker}</span>
                                    </div>
                                    <span className="text-xs" style={{ color: theme.text.muted }}>{flow.targetTerminal}</span>
                                  </td>
                                  <td className="p-4 hidden lg:table-cell">
                                    <span className="text-sm" style={{ color: flow.stage === 'collection_overdue' ? palette.red500 : theme.text.muted }}>{flow.eta}</span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>

                    {/* Flow Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h3 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Avg. Flow Time</h3>
                        <div className="space-y-3">
                          {[['Dropbox → Collection', '2.4 hrs', palette.amber500], ['Collection → Terminal', '1.2 hrs', palette.indigo500], ['Terminal → Locker', '0.5 hrs', palette.emerald500], ['Total End-to-End', '4.1 hrs', palette.violet500]].map(([l, v, c]) => (
                            <div key={l} className="flex items-center justify-between">
                              <span className="text-sm" style={{ color: theme.text.muted }}>{l}</span>
                              <span className="font-bold" style={{ color: c }}>{v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h3 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Top Dropboxes by Volume</h3>
                        <div className="space-y-3">
                          {dropboxesData.filter(d => d.status !== 'maintenance').sort((a, b) => b.avgDailyVolume - a.avgDailyVolume).slice(0, 4).map((d, i) => (
                            <div key={d.id} className="flex items-center gap-3">
                              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: i === 0 ? palette.amber500 : i === 1 ? palette.silver : i === 2 ? palette.bronze : theme.border.secondary }}>{i + 1}</span>
                              <div className="flex-1">
                                <p className="text-sm" style={{ color: theme.text.primary }}>{d.name}</p>
                              </div>
                              <span className="text-sm font-bold" style={{ color: palette.violet500 }}>{d.avgDailyVolume}/day</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h3 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Bottlenecks</h3>
                        <div className="space-y-3">
                          {dropboxFlowData.filter(f => f.stage === 'collection_overdue').length > 0 ? (
                            dropboxFlowData.filter(f => f.stage === 'collection_overdue').map(f => (
                              <div key={f.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: overlays.errorSubtle }}>
                                <AlertTriangle size={14} className="text-red-500 shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-red-500">{f.dropboxName}</p>
                                  <p className="text-xs" style={{ color: theme.text.muted }}>{f.waybill} stuck — collection overdue</p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="flex flex-col items-center py-4">
                              <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
                              <p className="text-sm text-emerald-500">No bottlenecks detected</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notifications Page */}
            {activeMenu === 'notifications' && (
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
                      <MessageSquare size={28} style={{ color: palette.emerald500 }} /> SMS & WhatsApp Notifications
                    </h1>
                    <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Message Center'} • Manage customer communications</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={16} />Export</button>
                    <button onClick={() => addToast({ type: 'info', message: 'Compose new message' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: palette.emerald500 }}><Send size={18} />Send Message</button>
                  </div>
                </div>

                {/* Message Center */}
                {(!activeSubMenu || activeSubMenu === 'Message Center') && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <MetricCard title="Sent Today" value={notificationHistoryData.filter(n => n.sentAt.includes('2024-01-15')).length.toLocaleString()} icon={Send} theme={theme} loading={loading} subtitle="SMS + WhatsApp" />
                      <MetricCard title="Delivered" value={notificationHistoryData.filter(n => ['delivered','read'].includes(n.status)).length} change="98.2%" changeType="up" icon={CheckCircle2} theme={theme} loading={loading} />
                      <MetricCard title="Read (WA)" value={notificationHistoryData.filter(n => n.status === 'read').length} icon={Eye} theme={theme} loading={loading} subtitle="WhatsApp only" />
                      <MetricCard title="Failed" value={notificationHistoryData.filter(n => n.status === 'failed').length} icon={AlertTriangle} theme={theme} loading={loading} subtitle={notificationHistoryData.filter(n => n.status === 'failed').length > 0 ? 'Review needed' : 'All clear'} />
                      <MetricCard title="Cost Today" value={`GH₵ ${notificationHistoryData.reduce((s, n) => s + n.cost, 0).toFixed(2)}`} icon={Banknote} theme={theme} loading={loading} subtitle="SMS: ₵0.05 / WA: ₵0.02" />
                    </div>

                    {/* Channel Split Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: overlays.infoBg }}>
                            <Smartphone size={24} style={{ color: palette.blue500 }} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold" style={{ color: theme.text.primary }}>SMS Channel</p>
                            <p className="text-sm" style={{ color: theme.text.muted }}>Via Hubtel SMS Gateway</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: overlays.successBg, color: palette.emerald500 }}>● Active</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                            <p className="text-xs" style={{ color: theme.text.muted }}>Sent Today</p>
                            <p className="text-xl font-bold" style={{ color: palette.blue500 }}>{notificationHistoryData.filter(n => n.channel === 'sms').length}</p>
                          </div>
                          <div className="p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                            <p className="text-xs" style={{ color: theme.text.muted }}>Delivery Rate</p>
                            <p className="text-xl font-bold" style={{ color: palette.emerald500 }}>97.8%</p>
                          </div>
                          <div className="p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                            <p className="text-xs" style={{ color: theme.text.muted }}>Templates</p>
                            <p className="text-xl font-bold" style={{ color: theme.text.primary }}>{smsTemplatesData.filter(t => t.channel === 'sms').length}</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 rounded-xl text-sm" style={{ backgroundColor: overlays.infoSubtle, border: '1px solid rgba(59,130,246,0.15)' }}>
                          <p style={{ color: palette.blue500 }}>Balance: <span className="font-bold">12,450 credits</span> (~GH₵ 622.50)</p>
                        </div>
                      </div>
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: overlays.whatsappBg }}>
                            <MessageSquare size={24} style={{ color: palette.whatsapp }} />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold" style={{ color: theme.text.primary }}>WhatsApp Business</p>
                            <p className="text-sm" style={{ color: theme.text.muted }}>Via Meta Business API</p>
                          </div>
                          <span className="px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: overlays.successBg, color: palette.emerald500 }}>● Active</span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div className="p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                            <p className="text-xs" style={{ color: theme.text.muted }}>Sent Today</p>
                            <p className="text-xl font-bold" style={{ color: palette.whatsapp }}>{notificationHistoryData.filter(n => n.channel === 'whatsapp').length}</p>
                          </div>
                          <div className="p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                            <p className="text-xs" style={{ color: theme.text.muted }}>Read Rate</p>
                            <p className="text-xl font-bold" style={{ color: palette.emerald500 }}>94.5%</p>
                          </div>
                          <div className="p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                            <p className="text-xs" style={{ color: theme.text.muted }}>Templates</p>
                            <p className="text-xl font-bold" style={{ color: theme.text.primary }}>{smsTemplatesData.filter(t => t.channel === 'whatsapp').length}</p>
                          </div>
                        </div>
                        <div className="mt-4 p-3 rounded-xl text-sm" style={{ backgroundColor: overlays.whatsappSubtle, border: '1px solid rgba(37,211,102,0.15)' }}>
                          <p style={{ color: palette.whatsapp }}>Tier: <span className="font-bold">Standard (1,000/day)</span> • Used: 486 today</p>
                        </div>
                      </div>
                    </div>

                    {/* Message Volume Chart */}
                    <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold" style={{ color: theme.text.primary }}>Message Volume (This Week)</h3>
                        <div className="flex gap-3">
                          <span className="flex items-center gap-1 text-xs" style={{ color: theme.text.muted }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.blue500 }} />SMS</span>
                          <span className="flex items-center gap-1 text-xs" style={{ color: theme.text.muted }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: palette.whatsapp }} />WhatsApp</span>
                        </div>
                      </div>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={msgVolumeData}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                          <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                          <Bar dataKey="sms" name="SMS" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="whatsapp" name="WhatsApp" fill="#25D366" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Quick Send */}
                    <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}><Send size={18} style={{ color: palette.emerald500 }} />Quick Send</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Channel</label>
                          <div className="flex gap-2">
                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm" style={{ backgroundColor: overlays.infoBg, color: palette.blue500, border: '1px solid rgba(59,130,246,0.3)' }}><Smartphone size={16} />SMS</button>
                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted, border: `1px solid ${theme.border.primary}` }}><MessageSquare size={16} />WhatsApp</button>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Recipient</label>
                          <input placeholder="Phone or customer name..." className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Template</label>
                          <select className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary, backgroundColor: theme.bg.tertiary }}>
                            <option value="">Select template...</option>
                            {smsTemplatesData.filter(t => t.channel === 'sms').map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button onClick={() => addToast({ type: 'success', message: 'Message sent successfully!' })} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-white text-sm" style={{ backgroundColor: palette.emerald500 }}><Send size={16} />Send Now</button>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Message Preview</label>
                        <div className="p-4 rounded-xl" style={{ backgroundColor: theme.bg.tertiary, border: `1px dashed ${theme.border.secondary}` }}>
                          <p className="text-sm" style={{ color: theme.text.secondary }}>Select a template above to preview the message, or type a custom message below...</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-4 text-xs" style={{ color: theme.text.muted }}>
                        <span>💡 Variables: {'{'}<span style={{ color: theme.accent.primary }}>customer</span>{'}'}, {'{'}<span style={{ color: theme.accent.primary }}>waybill</span>{'}'}, {'{'}<span style={{ color: theme.accent.primary }}>terminal</span>{'}'}, {'{'}<span style={{ color: theme.accent.primary }}>locker</span>{'}'}, {'{'}<span style={{ color: theme.accent.primary }}>code</span>{'}'}, {'{'}<span style={{ color: theme.accent.primary }}>eta</span>{'}'}</span>
                      </div>
                    </div>

                    {/* Recent Messages */}
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                        <h3 className="font-semibold" style={{ color: theme.text.primary }}>Recent Messages</h3>
                        <button onClick={() => { setActiveSubMenu('History'); }} className="text-sm" style={{ color: theme.accent.primary }}>View All →</button>
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Channel</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Recipient</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Template</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Package</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Sent</th>
                          </tr>
                        </thead>
                        <tbody>
                          {notificationHistoryData.slice(0, 6).map(msg => {
                            const st = MSG_STATUSES[msg.status] || MSG_STATUSES.pending;
                            return (
                              <tr key={msg.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    {msg.channel === 'whatsapp' ? (
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: overlays.whatsappBg }}><MessageSquare size={16} style={{ color: palette.whatsapp }} /></div>
                                    ) : (
                                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: overlays.infoBg }}><Smartphone size={16} style={{ color: palette.blue500 }} /></div>
                                    )}
                                    <span className="text-xs uppercase font-medium" style={{ color: msg.channel === 'whatsapp' ? palette.whatsapp : palette.blue500 }}>{msg.channel}</span>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <p className="text-sm" style={{ color: theme.text.primary }}>{msg.recipient}</p>
                                  <p className="text-xs font-mono" style={{ color: theme.text.muted }}>{msg.phone}</p>
                                </td>
                                <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{msg.template}</span></td>
                                <td className="p-3 hidden lg:table-cell"><span className="text-sm font-mono" style={{ color: theme.accent.primary }}>{msg.waybill}</span></td>
                                <td className="p-3">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: st.bg, color: st.color }}>
                                    <span>{st.icon}</span> {st.label}
                                  </span>
                                </td>
                                <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{msg.sentAt.split(' ')[1]}</span></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Templates */}
                {activeSubMenu === 'Templates' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: overlays.infoBg, color: palette.blue500 }}>SMS: {smsTemplatesData.filter(t => t.channel === 'sms').length}</span>
                        <span className="px-3 py-1.5 rounded-lg text-sm" style={{ backgroundColor: overlays.whatsappBg, color: palette.whatsapp }}>WhatsApp: {smsTemplatesData.filter(t => t.channel === 'whatsapp').length}</span>
                      </div>
                      <button onClick={() => addToast({ type: 'info', message: 'New template editor opened' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: palette.emerald500 }}><Plus size={16} />New Template</button>
                    </div>
                    <div className="space-y-4">
                      {smsTemplatesData.map(tpl => (
                        <div key={tpl.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                          <div className="p-5">
                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-4">
                              <div className="flex items-start gap-3 flex-1">
                                {tpl.channel === 'whatsapp' ? (
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: overlays.whatsappBg }}><MessageSquare size={20} style={{ color: palette.whatsapp }} /></div>
                                ) : (
                                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: overlays.infoBg }}><Smartphone size={20} style={{ color: palette.blue500 }} /></div>
                                )}
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-semibold" style={{ color: theme.text.primary }}>{tpl.name}</p>
                                    <span className="px-2 py-0.5 rounded-full text-xs uppercase font-medium" style={{ backgroundColor: tpl.channel === 'whatsapp' ? overlays.whatsappBg : overlays.infoBg, color: tpl.channel === 'whatsapp' ? palette.whatsapp : palette.blue500 }}>{tpl.channel}</span>
                                    <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted }}>{tpl.event}</span>
                                    {!tpl.active && <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: overlays.grayBg, color: palette.gray500 }}>Inactive</span>}
                                  </div>
                                  <p className="text-sm font-mono mt-2" style={{ color: theme.text.muted }}>{tpl.id}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button onClick={() => addToast({ type: 'info', message: `Testing template ${tpl.id}` })} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: overlays.successBg, color: palette.emerald500 }}>Test Send</button>
                                <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Edit size={16} /></button>
                                <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Trash2 size={16} /></button>
                              </div>
                            </div>
                            {/* Message Preview */}
                            <div className="p-4 rounded-xl mb-4" style={{ backgroundColor: tpl.channel === 'whatsapp' ? overlays.whatsappSubtle : theme.bg.tertiary, border: tpl.channel === 'whatsapp' ? '1px solid rgba(37,211,102,0.15)' : `1px solid ${theme.border.primary}` }}>
                              <pre className="text-sm whitespace-pre-wrap" style={{ color: theme.text.secondary, fontFamily: theme.font.primary }}>{tpl.message}</pre>
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                              <span style={{ color: theme.text.muted }}>Sent: <span className="font-medium" style={{ color: theme.text.primary }}>{tpl.sentCount.toLocaleString()}</span></span>
                              <span style={{ color: theme.text.muted }}>Delivery: <span className="font-medium" style={{ color: palette.emerald500 }}>{tpl.deliveryRate}%</span></span>
                              <span style={{ color: theme.text.muted }}>Last: <span style={{ color: theme.text.secondary }}>{tpl.lastSent}</span></span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Auto-Rules */}
                {activeSubMenu === 'Auto-Rules' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: overlays.successSubtle, border: '1px solid rgba(16,185,129,0.2)' }}>
                      <div className="flex items-center gap-3">
                        <Info size={20} style={{ color: palette.emerald500 }} />
                        <div>
                          <p className="text-sm font-medium" style={{ color: palette.emerald500 }}>Automation Engine Active</p>
                          <p className="text-xs" style={{ color: theme.text.muted }}>Auto-rules trigger notifications based on package events. {autoRulesData.filter(r => r.active).length} of {autoRulesData.length} rules are active.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => addToast({ type: 'info', message: 'New automation rule editor' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: palette.emerald500 }}><Plus size={16} />New Rule</button>
                      <button onClick={() => addToast({ type: 'info', message: 'Importing rule presets...' })} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><FileDown size={16} />Import Preset</button>
                    </div>
                    <div className="space-y-4">
                      {autoRulesData.map(rule => (
                        <div key={rule.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: rule.active ? theme.border.primary : overlays.grayEmphasis, opacity: rule.active ? 1 : 0.7 }}>
                          <div className="p-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: rule.active ? overlays.successBg : overlays.grayBg }}>
                                  {rule.active ? <Cog size={20} style={{ color: palette.emerald500 }} /> : <Cog size={20} style={{ color: palette.gray500 }} />}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-semibold" style={{ color: theme.text.primary }}>{rule.name}</p>
                                    {rule.active ? <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: overlays.successBg, color: palette.emerald500 }}>Active</span> : <span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: overlays.grayBg, color: palette.gray500 }}>Disabled</span>}
                                  </div>
                                  <p className="text-sm mt-1" style={{ color: theme.text.muted }}>{rule.description}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => addToast({ type: rule.active ? 'warning' : 'success', message: `Rule ${rule.active ? 'disabled' : 'enabled'}` })} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: rule.active ? overlays.errorBg : overlays.successBg, color: rule.active ? palette.red500 : palette.emerald500 }}>{rule.active ? 'Disable' : 'Enable'}</button>
                                <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Edit size={16} /></button>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-4 p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Trigger:</span>
                                <span className="px-2 py-0.5 rounded text-xs font-mono" style={{ backgroundColor: overlays.warningBg, color: palette.amber500 }}>{rule.trigger}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Channels:</span>
                                <div className="flex gap-1">
                                  {rule.channels.map(ch => (
                                    <span key={ch} className="px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: ch === 'whatsapp' ? overlays.whatsappBg : overlays.infoBg, color: ch === 'whatsapp' ? palette.whatsapp : palette.blue500 }}>{ch.toUpperCase()}</span>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Delay:</span>
                                <span className="text-xs" style={{ color: theme.text.secondary }}>{rule.delay}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Fired:</span>
                                <span className="text-xs font-bold" style={{ color: palette.emerald500 }}>{rule.fired.toLocaleString()}×</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* History */}
                {activeSubMenu === 'History' && (
                  <div className="space-y-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                        {['All', 'SMS', 'WhatsApp'].map(ch => (
                          <button key={ch} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: ch === 'All' ? theme.bg.card : 'transparent', color: ch === 'All' ? theme.text.primary : theme.text.muted }}>{ch}</button>
                        ))}
                      </div>
                      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                        {Object.entries(MSG_STATUSES).map(([k, v]) => (
                          <button key={k} className="px-3 py-1.5 rounded-lg text-xs" style={{ color: theme.text.muted }}>{v.icon} {v.label}</button>
                        ))}
                      </div>
                      <div className="ml-auto flex gap-2">
                        <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={16} />Export</button>
                      </div>
                    </div>
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      {loading ? <TableSkeleton rows={10} cols={7} theme={theme} /> : (
                        <table className="w-full">
                          <thead>
                            <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>ID</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Channel</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Recipient</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Template</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Package</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Sent At</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Cost</th>
                              <th className="text-right p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {notificationHistoryData.map(msg => {
                              const st = MSG_STATUSES[msg.status] || MSG_STATUSES.pending;
                              return (
                                <tr key={msg.id} style={{ borderBottom: `1px solid ${theme.border.primary}`, backgroundColor: msg.status === 'failed' ? overlays.errorSubtle : 'transparent' }}>
                                  <td className="p-3"><span className="font-mono text-xs" style={{ color: theme.text.muted }}>{msg.id}</span></td>
                                  <td className="p-3">
                                    {msg.channel === 'whatsapp' ? (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: overlays.whatsappBg, color: palette.whatsapp }}><MessageSquare size={10} />WA</span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: overlays.infoBg, color: palette.blue500 }}><Smartphone size={10} />SMS</span>
                                    )}
                                  </td>
                                  <td className="p-3">
                                    <p className="text-sm" style={{ color: theme.text.primary }}>{msg.recipient}</p>
                                    <p className="text-xs font-mono" style={{ color: theme.text.muted }}>{msg.phone}</p>
                                  </td>
                                  <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{msg.template}</span></td>
                                  <td className="p-3 hidden lg:table-cell"><span className="text-sm font-mono" style={{ color: theme.accent.primary }}>{msg.waybill}</span></td>
                                  <td className="p-3">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: st.bg, color: st.color }}>
                                      <span>{st.icon}</span> {st.label}
                                    </span>
                                    {msg.error && <p className="text-xs mt-1 text-red-500">{msg.error}</p>}
                                  </td>
                                  <td className="p-3 hidden md:table-cell"><span className="text-sm font-mono" style={{ color: theme.text.muted }}>{msg.sentAt}</span></td>
                                  <td className="p-3 hidden lg:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>GH₵ {msg.cost.toFixed(2)}</span></td>
                                  <td className="p-3 text-right">
                                    {msg.status === 'failed' && <button onClick={() => addToast({ type: 'info', message: `Retrying ${msg.id}...` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: palette.amber500 }}><RefreshCw size={14} /></button>}
                                    <button onClick={() => addToast({ type: 'info', message: `Resending to ${msg.recipient}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Send size={14} /></button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

                {/* Settings */}
                {activeSubMenu === 'Settings' && (
                  <div className="space-y-6 max-w-4xl">
                    {/* SMS Provider */}
                    <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: overlays.infoBg }}><Smartphone size={20} style={{ color: palette.blue500 }} /></div>
                        <div>
                          <h3 className="font-semibold" style={{ color: theme.text.primary }}>SMS Gateway Configuration</h3>
                          <p className="text-sm" style={{ color: theme.text.muted }}>Configure your SMS provider settings</p>
                        </div>
                        <span className="ml-auto px-3 py-1 rounded-full text-xs" style={{ backgroundColor: overlays.successBg, color: palette.emerald500 }}>● Connected</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Provider</label>
                          <select className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                            <option>Hubtel SMS</option>
                            <option>Arkesel</option>
                            <option>mNotify</option>
                            <option>Twilio</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Sender ID</label>
                          <input value="LocQar" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} readOnly />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>API Key</label>
                          <input value="hb_live_****8f2a" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent font-mono" style={{ borderColor: theme.border.primary, color: theme.text.primary }} readOnly />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Cost per SMS</label>
                          <input value="GH₵ 0.05" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} readOnly />
                        </div>
                      </div>
                    </div>

                    {/* WhatsApp Config */}
                    <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: overlays.whatsappBg }}><MessageSquare size={20} style={{ color: palette.whatsapp }} /></div>
                        <div>
                          <h3 className="font-semibold" style={{ color: theme.text.primary }}>WhatsApp Business API</h3>
                          <p className="text-sm" style={{ color: theme.text.muted }}>Configure Meta WhatsApp Business settings</p>
                        </div>
                        <span className="ml-auto px-3 py-1 rounded-full text-xs" style={{ backgroundColor: overlays.successBg, color: palette.emerald500 }}>● Connected</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Business Number</label>
                          <input value="+233 55 139 9333" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} readOnly />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>API Version</label>
                          <input value="v18.0" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent font-mono" style={{ borderColor: theme.border.primary, color: theme.text.primary }} readOnly />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Access Token</label>
                          <input value="EAAGx****b7ZD" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent font-mono" style={{ borderColor: theme.border.primary, color: theme.text.primary }} readOnly />
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Daily Limit</label>
                          <input value="1,000 messages/day (Standard tier)" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} readOnly />
                        </div>
                      </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Notification Preferences</h3>
                      <div className="space-y-4">
                        {[['Default channel for transactional', 'SMS + WhatsApp', true], ['Default channel for marketing', 'WhatsApp only', true], ['Send delivery receipt confirmation', 'Via WhatsApp', true], ['Enable quiet hours (10PM - 7AM)', 'Queue messages', true], ['Retry failed messages automatically', 'Max 3 retries', true], ['Include tracking URL in messages', 'Short URL via bit.ly', false]].map(([label, desc, active]) => (
                          <div key={label} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                            <div>
                              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{label}</p>
                              <p className="text-xs" style={{ color: theme.text.muted }}>{desc}</p>
                            </div>
                            <div onClick={() => addToast({ type: 'info', message: `Setting toggled` })} className="w-12 h-6 rounded-full cursor-pointer relative" style={{ backgroundColor: active ? palette.emerald500 : theme.border.secondary }}>
                              <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all" style={{ left: active ? '26px' : '2px' }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => addToast({ type: 'success', message: 'Settings saved successfully' })} className="px-6 py-2.5 rounded-xl text-white text-sm" style={{ backgroundColor: palette.emerald500 }}>Save Settings</button>
                      <button onClick={() => addToast({ type: 'info', message: 'Sending test message...' })} className="px-6 py-2.5 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>Send Test Message</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lockers Page */}
            {activeMenu === 'lockers' && (
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Locker Management</h1>
                    <p style={{ color: theme.text.muted }}>{activeSubMenu || 'All Lockers'}</p>
                  </div>
                  {hasPermission(currentUser.role, 'lockers.manage') && (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Plus size={18} />Add Locker</button>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    ['Total', lockersData.length, Grid3X3, null],
                    ['Available', lockersData.filter(l => l.status === 'available').length, Unlock, palette.emerald500],
                    ['Occupied', lockersData.filter(l => l.status === 'occupied').length, Package, palette.blue500],
                    ['Maintenance', lockersData.filter(l => l.status === 'maintenance').length, AlertTriangle, palette.red500]
                  ].map(([l, v, I, c]) => (
                    <div key={l} className="p-5 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-sm" style={{ color: theme.text.muted }}>{l}</p>
                          <p className="text-3xl font-bold mt-1" style={{ color: c || theme.text.primary }}>{v}</p>
                        </div>
                        <div className="p-3 rounded-xl" style={{ backgroundColor: `${c || theme.accent.primary}15` }}><I size={24} style={{ color: c || theme.accent.primary }} /></div>
                      </div>
                    </div>
                  ))}
                </div>

                {(!activeSubMenu || activeSubMenu === 'All Lockers') && (
                  <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    {loading ? <TableSkeleton rows={6} cols={8} theme={theme} /> : (
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>ID</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Terminal</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Size</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Package</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Temp</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Battery</th>
                            <th className="text-right p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lockersData.map(l => (
                            <tr key={l.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <td className="p-3">
                                <span className="font-mono font-bold" style={{ color: theme.text.primary }}>{l.id}</span>
                                <p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{getLockerAddress(l.id, l.terminal)}</p>
                              </td>
                              <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{l.terminal}</span></td>
                              <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{l.size}</span></td>
                              <td className="p-3"><StatusBadge status={l.status} /></td>
                              <td className="p-3 hidden lg:table-cell">{l.package ? <span className="text-sm font-mono" style={{ color: theme.accent.primary }}>{l.package}</span> : '—'}</td>
                              <td className="p-3 hidden md:table-cell">{l.temp ? <div className="flex items-center gap-1"><Thermometer size={14} style={{ color: theme.text.muted }} /><span className="text-sm" style={{ color: theme.text.secondary }}>{l.temp}°C</span></div> : '—'}</td>
                              <td className="p-3 hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                  {l.battery < 20 ? <BatteryWarning size={14} className="text-red-500" /> : <Battery size={14} style={{ color: theme.text.muted }} />}
                                  <span className={`text-sm ${l.battery < 20 ? 'text-red-500' : ''}`} style={{ color: l.battery >= 20 ? theme.text.secondary : undefined }}>{l.battery}%</span>
                                </div>
                              </td>
                              <td className="p-3 text-right">
                                <button onClick={() => addToast({ type: 'success', message: `Locker ${l.id} opened` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Unlock size={16} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {activeSubMenu === 'Maintenance' && (
                  <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
                      <h3 className="font-semibold" style={{ color: theme.text.primary }}>Lockers in Maintenance</h3>
                      <p className="text-sm mt-1" style={{ color: theme.text.muted }}>Lockers currently offline or flagged for maintenance</p>
                    </div>
                    {loading ? <TableSkeleton rows={4} cols={6} theme={theme} /> : (
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>ID</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Terminal</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Size</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Battery</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Temp</th>
                            <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lockersData.filter(l => l.status === 'maintenance' || l.battery < 20).map(l => (
                            <tr key={l.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <td className="p-3"><span className="font-mono font-bold" style={{ color: theme.text.primary }}>{l.id}</span></td>
                              <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{l.terminal}</span></td>
                              <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{l.size}</span></td>
                              <td className="p-3 hidden md:table-cell">
                                <div className="flex items-center gap-2">
                                  {l.battery < 20 ? <BatteryWarning size={14} className="text-red-500" /> : <Battery size={14} style={{ color: theme.text.muted }} />}
                                  <span className={`text-sm ${l.battery < 20 ? 'text-red-500 font-semibold' : ''}`} style={{ color: l.battery >= 20 ? theme.text.secondary : undefined }}>{l.battery}%</span>
                                </div>
                              </td>
                              <td className="p-3 hidden md:table-cell">{l.temp ? <span className="text-sm" style={{ color: theme.text.secondary }}>{l.temp}°C</span> : '—'}</td>
                              <td className="p-3"><StatusBadge status={l.status === 'maintenance' ? 'maintenance' : 'low_battery'} /></td>
                            </tr>
                          ))}
                          {lockersData.filter(l => l.status === 'maintenance' || l.battery < 20).length === 0 && (
                            <tr><td colSpan={6} className="p-8 text-center text-sm" style={{ color: theme.text.muted }}>No lockers currently in maintenance</td></tr>
                          )}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {activeSubMenu === 'Configuration' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="flex items-center gap-3 mb-4">
                        <Settings size={20} style={{ color: theme.accent.primary }} />
                        <h3 className="font-semibold" style={{ color: theme.text.primary }}>Locker Timeout Settings</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[['Pickup Window', '48 hours', 'Time before package is flagged as expired'], ['Reservation Hold', '2 hours', 'Max time a locker stays reserved'], ['Maintenance Alert', '20%', 'Battery threshold for maintenance flag']].map(([label, value, desc]) => (
                          <div key={label} className="p-4 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                            <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{label}</p>
                            <p className="text-2xl font-bold mt-1" style={{ color: theme.accent.primary }}>{value}</p>
                            <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="flex items-center gap-3 mb-4">
                        <Grid3X3 size={20} style={{ color: theme.accent.primary }} />
                        <h3 className="font-semibold" style={{ color: theme.text.primary }}>Size Distribution by Terminal</h3>
                      </div>
                      <div className="rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
                        <table className="w-full">
                          <thead>
                            <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Terminal</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Small</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Medium</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Large</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>XLarge</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {terminalsData.map(t => {
                              const tLockers = lockersData.filter(l => l.terminal === t.name);
                              return (
                                <tr key={t.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                                  <td className="p-3"><span className="text-sm font-medium" style={{ color: theme.text.primary }}>{t.name}</span></td>
                                  <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{tLockers.filter(l => l.size === 'Small').length}</span></td>
                                  <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{tLockers.filter(l => l.size === 'Medium').length}</span></td>
                                  <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{tLockers.filter(l => l.size === 'Large').length}</span></td>
                                  <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{tLockers.filter(l => l.size === 'XLarge').length}</span></td>
                                  <td className="p-3"><span className="text-sm font-semibold" style={{ color: theme.text.primary }}>{tLockers.length}</span></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Terminals Page */}
            {activeMenu === 'terminals' && (
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Terminals</h1>
                    <p style={{ color: theme.text.muted }}>{terminalsData.length} terminals &bull; {terminalsData.filter(t => t.status === 'online').length} online</p>
                  </div>
                  {hasPermission(currentUser.role, 'terminals.manage') && (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Plus size={18} />Add Terminal</button>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                  {[
                    ['Total Lockers', terminalsData.reduce((s, t) => s + t.totalLockers, 0), Grid3X3, null],
                    ['Available', terminalsData.reduce((s, t) => s + t.available, 0), Unlock, palette.emerald500],
                    ['Occupied', terminalsData.reduce((s, t) => s + t.occupied, 0), Package, palette.blue500],
                    ['Maintenance', terminalsData.reduce((s, t) => s + t.maintenance, 0), Wrench, palette.red500],
                    ['Utilization', `${Math.round(terminalsData.reduce((s, t) => s + t.occupied, 0) / terminalsData.reduce((s, t) => s + t.totalLockers, 0) * 100)}%`, TrendingUp, palette.violet500],
                  ].map(([l, v, I, c]) => (
                    <div key={l} className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="flex items-center gap-2 mb-1">
                        <I size={16} style={{ color: c || theme.accent.primary }} />
                        <span className="text-xs" style={{ color: theme.text.muted }}>{l}</span>
                      </div>
                      <p className="text-2xl font-bold" style={{ color: c || theme.text.primary }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {terminalsData.map(t => {
                    const utilPct = Math.round(t.occupied / t.totalLockers * 100);
                    return (
                      <div key={t.id} className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${theme.accent.primary}15` }}>
                              <Building2 size={20} style={{ color: theme.accent.primary }} />
                            </div>
                            <div>
                              <p className="font-semibold" style={{ color: theme.text.primary }}>{t.name}</p>
                              <p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{getTerminalAddress(t)}</p>
                              <p className="text-xs flex items-center gap-1" style={{ color: theme.text.muted }}><MapPin size={12} />{t.location} &bull; {phonePinData.filter(p => p.pinnedTerminal === t.name).length} pinned users</p>
                            </div>
                          </div>
                          <StatusBadge status={t.status} />
                        </div>
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs" style={{ color: theme.text.muted }}>Utilization</span>
                            <span className="text-xs font-medium" style={{ color: utilPct > 80 ? palette.red500 : utilPct > 60 ? palette.amber500 : palette.emerald500 }}>{utilPct}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${utilPct}%`, backgroundColor: utilPct > 80 ? palette.red500 : utilPct > 60 ? palette.amber500 : palette.emerald500 }} />
                          </div>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center">
                          {[['Total', t.totalLockers, null], ['Open', t.available, palette.emerald500], ['In Use', t.occupied, palette.blue500], ['Maint.', t.maintenance, palette.red500]].map(([l, v, c]) => (
                            <div key={l} className="p-2 rounded-lg" style={{ backgroundColor: c ? `${c}10` : theme.bg.tertiary }}>
                              <p className="text-xs" style={{ color: theme.text.muted }}>{l}</p>
                              <p className="text-lg font-bold" style={{ color: c || theme.text.primary }}>{v}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SLA Monitor Page */}
            {activeMenu === 'sla' && (
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>SLA Monitor</h1>
                    <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Live Monitor'}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={16} />Export</button>
                  </div>
                </div>

                {(!activeSubMenu || activeSubMenu === 'Live Monitor') && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.entries(SLA_SEVERITY).map(([key, sev]) => {
                        const count = slaBreachData.filter(s => s.severity === key).length;
                        return (
                          <div key={key} className="p-4 rounded-xl border" style={{ backgroundColor: sev.bg, borderColor: theme.border.primary }}>
                            <div className="flex items-center gap-2 mb-2">
                              <sev.icon size={18} style={{ color: sev.color }} />
                              <span className="text-sm font-medium" style={{ color: sev.color }}>{sev.label}</span>
                            </div>
                            <p className="text-3xl font-bold" style={{ color: sev.color }}>{count}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
                        <h3 className="font-semibold" style={{ color: theme.text.primary }}>Active SLA Tracking</h3>
                      </div>
                      {loading ? <TableSkeleton rows={6} cols={7} theme={theme} /> : (
                        <table className="w-full">
                          <thead>
                            <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Waybill</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>SLA</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Terminal</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Progress</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Severity</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Deadline</th>
                            </tr>
                          </thead>
                          <tbody>
                            {slaBreachData.sort((a, b) => b.pctUsed - a.pctUsed).map(s => {
                              const sev = SLA_SEVERITY[s.severity];
                              return (
                                <tr key={s.id} style={{ borderBottom: `1px solid ${theme.border.primary}`, backgroundColor: s.severity === 'breached' ? overlays.errorSubtle : undefined }}>
                                  <td className="p-3"><span className="font-mono text-sm" style={{ color: theme.accent.primary }}>{s.waybill}</span></td>
                                  <td className="p-3">
                                    <p className="text-sm" style={{ color: theme.text.primary }}>{s.customer}</p>
                                    <p className="text-xs" style={{ color: theme.text.muted }}>{s.product}</p>
                                  </td>
                                  <td className="p-3 hidden md:table-cell">
                                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: `${SLA_TIERS.find(t => t.name === s.slaType)?.color || palette.gray500}15`, color: SLA_TIERS.find(t => t.name === s.slaType)?.color || palette.gray500 }}>{s.slaType}</span>
                                  </td>
                                  <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{s.terminal}</span></td>
                                  <td className="p-3">
                                    <div className="flex items-center gap-2">
                                      <div className="w-16 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                                        <div className="h-full rounded-full" style={{ width: `${Math.min(s.pctUsed, 100)}%`, backgroundColor: sev.color }} />
                                      </div>
                                      <span className="text-xs font-medium" style={{ color: sev.color }}>{Math.round(s.pctUsed)}%</span>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ backgroundColor: sev.bg, color: sev.color }}>{sev.label}</span>
                                  </td>
                                  <td className="p-3 hidden lg:table-cell"><span className="text-xs font-mono" style={{ color: s.remainingMin < 0 ? palette.red500 : theme.text.muted }}>{s.deadline}</span></td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                )}

                {activeSubMenu === 'Escalation Rules' && (
                  <div className="space-y-4">
                    {ESCALATION_RULES.map(rule => (
                      <div key={rule.level} className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${rule.color}15` }}>
                            <rule.icon size={20} style={{ color: rule.color }} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <p className="font-semibold" style={{ color: theme.text.primary }}>Level {rule.level}: {rule.name}</p>
                              <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${rule.color}15`, color: rule.color }}>{rule.role}</span>
                            </div>
                            <p className="text-sm" style={{ color: theme.text.muted }}>Triggers at {rule.triggerPct}% of SLA time</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold" style={{ color: rule.color }}>{rule.triggerPct}%</p>
                          </div>
                        </div>
                        <div className="pl-14 space-y-1">
                          {rule.actions.map((action, i) => (
                            <div key={i} className="flex items-center gap-2">
                              <CheckCircle2 size={14} style={{ color: rule.color }} />
                              <span className="text-sm" style={{ color: theme.text.secondary }}>{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSubMenu === 'Compliance' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {(() => {
                        const totals = slaComplianceTrend.reduce((acc, d) => ({ total: acc.total + d.total, onTime: acc.onTime + d.onTime, warning: acc.warning + d.warning, breached: acc.breached + d.breached }), { total: 0, onTime: 0, warning: 0, breached: 0 });
                        return [
                          ['Total Shipments', totals.total, Package, null],
                          ['On Time', `${Math.round(totals.onTime / totals.total * 100)}%`, CheckCircle2, palette.emerald500],
                          ['Warnings', totals.warning, AlertTriangle, palette.amber500],
                          ['Breached', totals.breached, XCircle, palette.red500],
                        ].map(([l, v, I, c]) => (
                          <div key={l} className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                            <div className="flex items-center gap-2 mb-1"><I size={16} style={{ color: c || theme.accent.primary }} /><span className="text-xs" style={{ color: theme.text.muted }}>{l}</span></div>
                            <p className="text-2xl font-bold" style={{ color: c || theme.text.primary }}>{v}</p>
                          </div>
                        ));
                      })()}
                    </div>
                    <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Weekly SLA Compliance</h3>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={slaComplianceTrend}>
                          <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                          <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                          <Bar dataKey="onTime" stackId="a" fill="#10b981" name="On Time" />
                          <Bar dataKey="warning" stackId="a" fill="#f59e0b" name="Warning" />
                          <Bar dataKey="breached" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} name="Breached" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {activeSubMenu === 'Incident Log' && (
                  <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
                      <h3 className="font-semibold" style={{ color: theme.text.primary }}>Escalation History</h3>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Time</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Waybill</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Level</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Severity</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Action</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>By</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Acked</th>
                        </tr>
                      </thead>
                      <tbody>
                        {escalationLog.map(log => {
                          const sev = SLA_SEVERITY[log.severity];
                          return (
                            <tr key={log.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <td className="p-3"><span className="text-xs font-mono" style={{ color: theme.text.muted }}>{log.timestamp}</span></td>
                              <td className="p-3"><span className="font-mono text-sm" style={{ color: theme.accent.primary }}>{log.waybill}</span></td>
                              <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.primary }}>L{log.level}</span></td>
                              <td className="p-3"><span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: sev?.bg, color: sev?.color }}>{sev?.label}</span></td>
                              <td className="p-3 hidden md:table-cell"><span className="text-xs" style={{ color: theme.text.secondary }}>{log.action.substring(0, 80)}{log.action.length > 80 ? '...' : ''}</span></td>
                              <td className="p-3">
                                <span className="text-xs" style={{ color: theme.text.primary }}>{log.by}</span>
                                <p className="text-xs" style={{ color: theme.text.muted }}>{log.role}</p>
                              </td>
                              <td className="p-3">
                                {log.acked ? <CheckCircle2 size={16} className="text-emerald-500" /> : <Circle size={16} style={{ color: theme.text.muted }} />}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Dispatch Page */}
            {activeMenu === 'dispatch' && (
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Dispatch</h1>
                    <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Outgoing'}</p>
                  </div>
                  <button onClick={() => addToast({ type: 'info', message: 'New dispatch created' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Plus size={18} />New Dispatch</button>
                </div>

                {(!activeSubMenu || activeSubMenu === 'Outgoing') && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <MetricCard title="Pending" value={packagesData.filter(p => ['pending', 'at_warehouse', 'at_dropbox'].includes(p.status)).length} icon={Package} theme={theme} loading={loading} />
                      <MetricCard title="In Transit" value={packagesData.filter(p => p.status.startsWith('in_transit')).length} icon={Truck} theme={theme} loading={loading} />
                      <MetricCard title="Delivered Today" value={packagesData.filter(p => p.status.startsWith('delivered')).length} icon={CheckCircle2} theme={theme} loading={loading} />
                      <MetricCard title="Active Drivers" value={driversData.filter(d => d.status !== 'offline').length} icon={Car} theme={theme} loading={loading} />
                    </div>
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                        <h3 className="font-semibold" style={{ color: theme.text.primary }}>Outgoing Packages</h3>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary }}>{packagesData.filter(p => ['pending', 'at_warehouse', 'at_dropbox'].includes(p.status)).length} ready</span>
                      </div>
                      {loading ? <TableSkeleton rows={5} cols={6} theme={theme} /> : (
                        <table className="w-full">
                          <thead>
                            <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Waybill</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Destination</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Size</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                              <th className="text-left p-3 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Method</th>
                            </tr>
                          </thead>
                          <tbody>
                            {packagesData.filter(p => ['pending', 'at_warehouse', 'at_dropbox', 'in_transit_to_locker', 'in_transit_to_home'].includes(p.status)).map(p => (
                              <tr key={p.id} className="hover:bg-white/5 cursor-pointer" style={{ borderBottom: `1px solid ${theme.border.primary}` }} onClick={() => setSelectedPackage(p)}>
                                <td className="p-3"><span className="font-mono text-sm" style={{ color: theme.accent.primary }}>{p.waybill}</span></td>
                                <td className="p-3"><span className="text-sm" style={{ color: theme.text.primary }}>{p.customer}</span></td>
                                <td className="p-3 hidden md:table-cell">
                                  <span className="text-sm" style={{ color: theme.text.secondary }}>{p.destination}</span>
                                  {(() => { const t = terminalsData.find(t => t.name === p.destination); return t ? <p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{getTerminalAddress(t)}</p> : null; })()}
                                </td>
                                <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{p.size}</span></td>
                                <td className="p-3"><StatusBadge status={p.status} /></td>
                                <td className="p-3 hidden lg:table-cell"><span className="text-xs" style={{ color: theme.text.muted }}>{DELIVERY_METHODS[p.deliveryMethod]?.label}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                )}

                {activeSubMenu === 'Route Planning' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="flex items-center gap-4 mb-6">
                        <Route size={32} style={{ color: theme.accent.primary }} />
                        <div>
                          <h3 className="font-semibold text-lg" style={{ color: theme.text.primary }}>Route Planning</h3>
                          <p className="text-sm" style={{ color: theme.text.muted }}>Optimize delivery routes for efficiency</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                          { zone: 'Accra Central', stops: 14, time: '2.5 hrs', distance: '28 km', driver: 'Kwesi Asante', packages: 14 },
                          { zone: 'East Legon', stops: 8, time: '1.5 hrs', distance: '15 km', driver: 'Kofi Mensah', packages: 8 },
                          { zone: 'Tema', stops: 11, time: '2 hrs', distance: '22 km', driver: 'Yaw Boateng', packages: 11 },
                        ].map(r => (
                          <div key={r.zone} className="p-4 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                            <div className="flex items-center justify-between mb-3">
                              <p className="font-semibold" style={{ color: theme.text.primary }}>{r.zone}</p>
                              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#10b98115', color: palette.emerald500 }}>Active</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div><span style={{ color: theme.text.muted }}>Stops:</span> <span style={{ color: theme.text.primary }}>{r.stops}</span></div>
                              <div><span style={{ color: theme.text.muted }}>Time:</span> <span style={{ color: theme.text.primary }}>{r.time}</span></div>
                              <div><span style={{ color: theme.text.muted }}>Distance:</span> <span style={{ color: theme.text.primary }}>{r.distance}</span></div>
                              <div><span style={{ color: theme.text.muted }}>Packages:</span> <span style={{ color: theme.text.primary }}>{r.packages}</span></div>
                            </div>
                            <div className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: theme.border.primary }}>
                              <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: palette.blue500 }}>{r.driver.charAt(0)}</div>
                              <span className="text-sm" style={{ color: theme.text.secondary }}>{r.driver}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeSubMenu === 'Driver Assignment' && (
                  <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}><h3 className="font-semibold" style={{ color: theme.text.primary }}>Drivers</h3></div>
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                          <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Driver</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Vehicle</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Zone</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Today</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {driversData.map(d => (
                          <tr key={d.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: palette.emerald500 }}>{d.name.charAt(0)}</div>
                                <div>
                                  <p className="text-sm" style={{ color: theme.text.primary }}>{d.name}</p>
                                  <p className="text-xs" style={{ color: theme.text.muted }}>{d.phone}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{d.vehicle}</span></td>
                            <td className="p-4 hidden lg:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{d.zone}</span></td>
                            <td className="p-4"><StatusBadge status={d.status} /></td>
                            <td className="p-4"><span className="text-sm font-medium" style={{ color: theme.text.primary }}>{d.deliveriesToday}</span></td>
                            <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: palette.amber500 }}>★ {d.rating}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Customers Page */}
            {activeMenu === 'customers' && (
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Customers</h1>
                    <p style={{ color: theme.text.muted }}>{activeSubMenu || 'All Customers'}</p>
                  </div>
                  {hasPermission(currentUser.role, 'customers.manage') && (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Plus size={18} />Add Customer</button>
                  )}
                </div>

                {(!activeSubMenu || activeSubMenu === 'All Customers') && (
                  <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    {loading ? <TableSkeleton rows={5} cols={5} theme={theme} /> : (
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Type</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Orders</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Total Spent</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {customersData.map(c => {
                            const pin = phonePinData.find(p => p.phone === c.phone);
                            return (
                            <tr key={c.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <td className="p-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: c.type === 'b2b' ? palette.violet500 : theme.accent.primary }}>{c.name.charAt(0)}</div>
                                  <div>
                                    <p style={{ color: theme.text.primary }}>{c.name}</p>
                                    <p className="text-sm" style={{ color: theme.text.muted }}>{c.email}</p>
                                    {pin && <p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{pin.pinnedAddress}</p>}
                                  </div>
                                </div>
                              </td>
                              <td className="p-4"><StatusBadge status={c.type} /></td>
                              <td className="p-4 hidden md:table-cell"><span className="font-medium" style={{ color: theme.text.primary }}>{c.totalOrders}</span></td>
                              <td className="p-4 hidden md:table-cell"><span style={{ color: theme.text.primary }}>GH₵ {c.totalSpent.toLocaleString()}</span></td>
                              <td className="p-4"><StatusBadge status={c.status} /></td>
                            </tr>
                          ); })}
                        </tbody>
                      </table>
                    )}
                  </div>
                )}

                {activeSubMenu === 'B2B Partners' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {customersData.filter(c => c.type === 'b2b').map(c => (
                      <div key={c.id} className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: overlays.violetBg }}>
                            <Briefcase size={24} className="text-violet-500" />
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold" style={{ color: theme.text.primary }}>{c.name}</p>
                            <p className="text-sm" style={{ color: theme.text.muted }}>{c.email}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg" style={{ color: theme.text.primary }}>GH₵ {c.totalSpent.toLocaleString()}</p>
                            <p className="text-xs" style={{ color: theme.text.muted }}>{c.totalOrders} orders</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeSubMenu === 'Support Tickets' && (
                  <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                          <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Ticket</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Customer</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Subject</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Priority</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ticketsData.map(t => (
                          <tr key={t.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <td className="p-4"><span className="font-mono" style={{ color: theme.text.primary }}>{t.id}</span></td>
                            <td className="p-4 hidden md:table-cell"><span style={{ color: theme.text.primary }}>{t.customer}</span></td>
                            <td className="p-4"><span className="text-sm" style={{ color: theme.text.secondary }}>{t.subject}</span></td>
                            <td className="p-4 hidden md:table-cell"><StatusBadge status={t.priority} /></td>
                            <td className="p-4"><StatusBadge status={t.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Staff Page */}
            {activeMenu === 'staff' && (
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Staff Management</h1>
                    <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Agents'}</p>
                  </div>
                  {hasPermission(currentUser.role, 'staff.manage') && (
                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><UserPlus size={18} />Add Staff</button>
                  )}
                </div>

                {(!activeSubMenu || activeSubMenu === 'Agents') && (
                  <>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
                      {Object.values(ROLES).map(r => (
                        <div key={r.id} className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: r.color }} />
                            <span className="text-xs" style={{ color: theme.text.muted }}>{r.name}</span>
                          </div>
                          <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{staffData.filter(s => s.role === r.id.toUpperCase()).length}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      {loading ? <TableSkeleton rows={6} cols={6} theme={theme} /> : (
                        <table className="w-full">
                          <thead>
                            <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Staff</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Role</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Team</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Terminal</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                              <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {staffData.map(s => (
                              <tr key={s.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: ROLES[s.role]?.color }}>{s.name.charAt(0)}</div>
                                    <div>
                                      <p style={{ color: theme.text.primary }}>{s.name}</p>
                                      <p className="text-sm" style={{ color: theme.text.muted }}>{s.email}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4"><RoleBadge role={s.role} /></td>
                                <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{s.team}</span></td>
                                <td className="p-4 hidden lg:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{s.terminal}</span></td>
                                <td className="p-4"><StatusBadge status={s.status} /></td>
                                <td className="p-4 text-right">
                                  {hasPermission(currentUser.role, 'staff.manage') && (
                                    <>
                                      <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Edit size={16} /></button>
                                      <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Key size={16} /></button>
                                      <button className="p-2 rounded-lg hover:bg-white/5 text-red-500"><Trash2 size={16} /></button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                )}

                {activeSubMenu === 'Teams' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teamsData.map(t => (
                      <div key={t.id} className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${t.color}15` }}>
                            <Users2 size={20} style={{ color: t.color }} />
                          </div>
                          <div>
                            <p className="font-semibold" style={{ color: theme.text.primary }}>{t.name}</p>
                            <p className="text-sm" style={{ color: theme.text.muted }}>Lead: {t.lead}</p>
                          </div>
                        </div>
                        <p className="text-3xl font-bold" style={{ color: t.color }}>{t.members}</p>
                        <p className="text-sm" style={{ color: theme.text.muted }}>members</p>
                      </div>
                    ))}
                  </div>
                )}

                {activeSubMenu === 'Performance' && (
                  <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                          <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Staff</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Role</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Performance</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Last Active</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staffData.map(s => (
                          <tr key={s.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs" style={{ backgroundColor: ROLES[s.role]?.color }}>{s.name.charAt(0)}</div>
                                <span style={{ color: theme.text.primary }}>{s.name}</span>
                              </div>
                            </td>
                            <td className="p-4"><RoleBadge role={s.role} /></td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                                  <div className="h-full rounded-full" style={{ width: `${s.performance}%`, backgroundColor: s.performance > 90 ? palette.emerald500 : s.performance > 75 ? palette.amber500 : palette.red500 }} />
                                </div>
                                <span className="text-sm" style={{ color: theme.text.secondary }}>{s.performance}%</span>
                              </div>
                            </td>
                            <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{s.lastActive}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Accounting Page */}
            {activeMenu === 'accounting' && (
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Accounting</h1>
                    <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Transactions'}</p>
                  </div>
                  <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                    <Download size={16} /> Export
                  </button>
                </div>

                {(!activeSubMenu || activeSubMenu === 'Transactions') && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <MetricCard title="Total Revenue" value="GH₵ 68.5K" change="18.7%" changeType="up" icon={DollarSign} theme={theme} loading={loading} />
                      <MetricCard title="Pending COD" value="GH₵ 4.2K" icon={Banknote} theme={theme} loading={loading} />
                      <MetricCard title="This Month" value="GH₵ 48.2K" change="12.5%" changeType="up" icon={TrendingUp} theme={theme} loading={loading} />
                      <MetricCard title="Transactions" value="1,847" icon={Receipt} theme={theme} loading={loading} />
                    </div>
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      {loading ? <TableSkeleton rows={4} cols={6} theme={theme} /> : (
                        <table className="w-full">
                          <thead>
                            <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Transaction</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Date</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Description</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Amount</th>
                              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactionsData.map(t => (
                              <tr key={t.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                                <td className="p-4"><span className="font-mono" style={{ color: theme.text.primary }}>{t.id}</span></td>
                                <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{t.date}</span></td>
                                <td className="p-4 hidden lg:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{t.description}</span></td>
                                <td className="p-4"><span style={{ color: theme.text.primary }}>{t.customer}</span></td>
                                <td className="p-4"><span className={`font-medium ${t.amount < 0 ? 'text-red-500' : 'text-emerald-500'}`}>GH₵ {Math.abs(t.amount).toLocaleString()}</span></td>
                                <td className="p-4"><StatusBadge status={t.status} /></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                )}

                {activeSubMenu === 'Invoices' && (
                  <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                      <h3 className="font-semibold" style={{ color: theme.text.primary }}>Invoices</h3>
                      <button onClick={() => addToast({ type: 'info', message: 'Invoice form opened' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Plus size={16} />Create Invoice</button>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                          <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Invoice</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Date</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Due Date</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Amount</th>
                          <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoicesData.map(inv => (
                          <tr key={inv.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <td className="p-4"><span className="font-mono" style={{ color: theme.text.primary }}>{inv.id}</span></td>
                            <td className="p-4"><span style={{ color: theme.text.primary }}>{inv.customer}</span></td>
                            <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{inv.date}</span></td>
                            <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{inv.dueDate}</span></td>
                            <td className="p-4"><span className="font-medium" style={{ color: theme.text.primary }}>GH₵ {inv.amount.toLocaleString()}</span></td>
                            <td className="p-4"><StatusBadge status={inv.status} /></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeSubMenu === 'Reports' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Revenue by SLA Tier</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={pricingRevenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                            <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} formatter={v => `GH₵ ${v.toLocaleString()}`} />
                            <Bar dataKey="standard" stackId="a" fill="#6b7280" radius={[0, 0, 0, 0]} name="Standard" />
                            <Bar dataKey="express" stackId="a" fill="#f59e0b" name="Express" />
                            <Bar dataKey="rush" stackId="a" fill="#ef4444" name="Rush" />
                            <Bar dataKey="economy" stackId="a" fill="#10b981" radius={[4, 4, 0, 0]} name="Economy" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Revenue by Terminal</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <LineChart data={terminalData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                            <Line type="monotone" dataKey="accra" stroke="#3b82f6" strokeWidth={2} name="Accra Mall" />
                            <Line type="monotone" dataKey="achimota" stroke="#10b981" strokeWidth={2} name="Achimota Mall" />
                            <Line type="monotone" dataKey="kotoka" stroke="#f59e0b" strokeWidth={2} name="Kotoka T3" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Invoice Aging</h3>
                        <div className="space-y-3">
                          {[
                            ['Current (0-30 days)', invoicesData.filter(i => i.status === 'paid').length, palette.emerald500],
                            ['Due (30-60 days)', invoicesData.filter(i => i.status === 'pending').length, palette.amber500],
                            ['Overdue (60+ days)', invoicesData.filter(i => i.status === 'overdue').length, palette.red500],
                          ].map(([label, count, color]) => (
                            <div key={label} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: `${color}10` }}>
                              <span className="text-sm" style={{ color: theme.text.primary }}>{label}</span>
                              <span className="font-bold" style={{ color }}>{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="lg:col-span-2 p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Quick Reports</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {[
                            { name: 'Daily Revenue Report', icon: Calendar, desc: 'Today\'s revenue summary' },
                            { name: 'Monthly Summary', icon: FileText, desc: 'Full month financial overview' },
                            { name: 'COD Collection Report', icon: Banknote, desc: 'Cash on delivery reconciliation' },
                            { name: 'Partner Billing', icon: Briefcase, desc: 'Partner invoice generation' },
                            { name: 'Tax Report', icon: Receipt, desc: 'VAT and tax breakdown' },
                            { name: 'Expense Report', icon: CreditCard, desc: 'Operational expenses' },
                          ].map(report => (
                            <div key={report.name} className="p-3 rounded-xl border flex items-center gap-3" style={{ borderColor: theme.border.primary }}>
                              <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accent.light }}><report.icon size={16} style={{ color: theme.accent.primary }} /></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{report.name}</p>
                                <p className="text-xs" style={{ color: theme.text.muted }}>{report.desc}</p>
                              </div>
                              <button onClick={() => addToast({ type: 'success', message: `Generating ${report.name}...` })} className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary }}>Generate</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Business Portal */}
            {activeMenu === 'portal' && (
              <div className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
                      <Briefcase size={28} style={{ color: theme.accent.primary }} /> Business Portal
                    </h1>
                    <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Partner Dashboard'} • {partnersData.filter(p => p.status === 'active').length} active partners</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={16} />Export</button>
                    <button onClick={() => addToast({ type: 'info', message: 'Partner onboarding form opened' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Plus size={18} />Onboard Partner</button>
                  </div>
                </div>

                {/* Partner Dashboard */}
                {(!activeSubMenu || activeSubMenu === 'Partner Dashboard') && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MetricCard title="Active Partners" value={partnersData.filter(p => p.status === 'active').length} icon={Building2} theme={theme} loading={loading} />
                      <MetricCard title="Monthly Volume" value={partnersData.reduce((s, p) => s + p.monthlyVolume, 0)} change="14.3%" changeType="up" icon={Package} theme={theme} loading={loading} />
                      <MetricCard title="Partner Revenue" value={`GH₵ ${(partnersData.reduce((s, p) => s + p.revenue, 0) / 1000).toFixed(1)}K`} change="22.1%" changeType="up" icon={DollarSign} theme={theme} loading={loading} />
                      <MetricCard title="Avg Delivery Rate" value={`${(partnersData.filter(p => p.status === 'active').reduce((s, p) => s + p.deliveryRate, 0) / partnersData.filter(p => p.status === 'active').length).toFixed(1)}%`} icon={TrendingUp} theme={theme} loading={loading} />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {Object.entries(TIERS).map(([k, t]) => {
                        const count = partnersData.filter(p => p.tier === k).length;
                        return (
                          <div key={k} className="p-4 rounded-xl border flex items-center gap-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: t.bg }}>{k === 'gold' ? '🥇' : k === 'silver' ? '🥈' : '🥉'}</div>
                            <div className="flex-1">
                              <p className="font-semibold" style={{ color: t.color }}>{t.label} Tier</p>
                              <p className="text-xs" style={{ color: theme.text.muted }}>{t.perks}</p>
                            </div>
                            <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{count}</p>
                          </div>
                        );
                      })}
                    </div>
                    <div className="space-y-4">
                      {partnersData.map(p => (
                        <div key={p.id} className="p-5 rounded-2xl border hover:border-opacity-50 transition-all" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                          <div className="flex flex-col md:flex-row md:items-center gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: TIERS[p.tier]?.bg }}>{p.logo}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="font-semibold text-lg" style={{ color: theme.text.primary }}>{p.name}</p>
                                  <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: TIERS[p.tier]?.bg, color: TIERS[p.tier]?.color }}>{TIERS[p.tier]?.label}</span>
                                  <StatusBadge status={p.status} />
                                </div>
                                <p className="text-sm" style={{ color: theme.text.muted }}>{p.type} • {p.email} • SLA: {p.sla}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-6 text-center">
                              <div><p className="text-xs" style={{ color: theme.text.muted }}>Monthly Vol.</p><p className="text-lg font-bold" style={{ color: theme.text.primary }}>{p.monthlyVolume}</p></div>
                              <div><p className="text-xs" style={{ color: theme.text.muted }}>Revenue</p><p className="text-lg font-bold" style={{ color: palette.emerald500 }}>GH₵ {(p.revenue / 1000).toFixed(1)}K</p></div>
                              <div><p className="text-xs" style={{ color: theme.text.muted }}>Delivery</p><p className="text-lg font-bold" style={{ color: p.deliveryRate > 95 ? palette.emerald500 : p.deliveryRate > 90 ? palette.amber500 : palette.red500 }}>{p.deliveryRate}%</p></div>
                              <div><p className="text-xs" style={{ color: theme.text.muted }}>API Calls</p><p className="text-lg font-bold" style={{ color: palette.blue500 }}>{(p.apiCalls / 1000).toFixed(1)}K</p></div>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => addToast({ type: 'info', message: `Viewing ${p.name} portal` })} className="px-3 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary, border: `1px solid ${theme.accent.border}` }}><Eye size={14} className="inline mr-1" />View Portal</button>
                              <button className="p-2 rounded-xl" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted }}><Edit size={16} /></button>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t flex items-center gap-6 text-sm" style={{ borderColor: theme.border.primary }}>
                            <span style={{ color: theme.text.muted }}>Contract: <span style={{ color: theme.text.secondary }}>until {p.contractEnd}</span></span>
                            <span style={{ color: theme.text.muted }}>Total Orders: <span style={{ color: theme.text.secondary }}>{p.totalOrders}</span></span>
                            <span style={{ color: theme.text.muted }}>Last API: <span style={{ color: theme.text.secondary }}>{p.lastApiCall}</span></span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bulk Shipments */}
                {activeSubMenu === 'Bulk Shipments' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MetricCard title="Active Batches" value={bulkShipmentsData.filter(b => b.status !== 'delivered_to_locker').length} icon={Truck} theme={theme} loading={loading} />
                      <MetricCard title="Total Packages" value={bulkShipmentsData.reduce((s, b) => s + b.packages, 0)} icon={Package} theme={theme} loading={loading} />
                      <MetricCard title="Delivered" value={bulkShipmentsData.reduce((s, b) => s + b.delivered, 0)} icon={CheckCircle2} theme={theme} loading={loading} />
                      <MetricCard title="Pending" value={bulkShipmentsData.reduce((s, b) => s + b.pending, 0)} icon={Clock} theme={theme} loading={loading} />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => addToast({ type: 'info', message: 'New bulk shipment form' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Plus size={16} />New Batch</button>
                      <button onClick={() => addToast({ type: 'info', message: 'Import CSV dialog' })} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><FileDown size={16} />Import CSV</button>
                    </div>
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Batch</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Partner</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Terminal</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Progress</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>ETA</th>
                            <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bulkShipmentsData.map(b => (
                            <tr key={b.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <td className="p-4"><span className="font-mono font-bold" style={{ color: theme.text.primary }}>{b.id}</span><br/><span className="text-xs" style={{ color: theme.text.muted }}>{b.created}</span></td>
                              <td className="p-4"><span style={{ color: theme.text.primary }}>{b.partner}</span></td>
                              <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{b.terminal}</span></td>
                              <td className="p-4"><StatusBadge status={b.status} /></td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-20 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                                    <div className="h-full rounded-full" style={{ width: `${(b.delivered / b.packages) * 100}%`, backgroundColor: b.delivered === b.packages ? palette.emerald500 : palette.blue500 }} />
                                  </div>
                                  <span className="text-xs font-mono" style={{ color: theme.text.secondary }}>{b.delivered}/{b.packages}</span>
                                </div>
                              </td>
                              <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{b.eta}</span></td>
                              <td className="p-4 text-right">
                                <button onClick={() => addToast({ type: 'info', message: `Viewing batch ${b.id}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Eye size={16} /></button>
                                <button onClick={() => addToast({ type: 'info', message: `Tracking batch ${b.id}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Route size={16} /></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Invoices & Billing */}
                {activeSubMenu === 'Invoices & Billing' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MetricCard title="Total Billed" value="GH₵ 43K" change="18.5%" changeType="up" icon={Receipt} theme={theme} loading={loading} />
                      <MetricCard title="Collected" value="GH₵ 27.5K" icon={CreditCard} theme={theme} loading={loading} />
                      <MetricCard title="Outstanding" value="GH₵ 15.5K" icon={Banknote} theme={theme} loading={loading} />
                      <MetricCard title="Overdue" value="GH₵ 450" icon={AlertTriangle} theme={theme} loading={loading} subtitle="1 invoice" />
                    </div>
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                        <h3 className="font-semibold" style={{ color: theme.text.primary }}>Partner Invoices</h3>
                        <button onClick={() => addToast({ type: 'info', message: 'Generate invoice' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Plus size={16} />Create Invoice</button>
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Invoice</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Partner</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Period</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Due Date</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Amount</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                            <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[{ id: 'INV-B001', partner: 'Jumia Ghana', period: 'Jan 2024', due: '2024-01-31', amount: 15000, status: 'paid' },
                            { id: 'INV-B002', partner: 'Melcom Ltd', period: 'Jan 2024', due: '2024-01-31', amount: 12500, status: 'pending' },
                            { id: 'INV-B003', partner: 'Telecel Ghana', period: 'Jan 2024', due: '2024-01-31', amount: 8500, status: 'pending' },
                            { id: 'INV-B004', partner: 'Hubtel', period: 'Jan 2024', due: '2024-01-31', amount: 4200, status: 'pending' },
                            { id: 'INV-B005', partner: 'Jumia Ghana', period: 'Dec 2023', due: '2024-01-15', amount: 13200, status: 'paid' },
                            { id: 'INV-B006', partner: 'CompuGhana', period: 'Nov 2023', due: '2023-12-15', amount: 450, status: 'overdue' }
                          ].map(inv => (
                            <tr key={inv.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <td className="p-4"><span className="font-mono font-medium" style={{ color: theme.text.primary }}>{inv.id}</span></td>
                              <td className="p-4"><span style={{ color: theme.text.primary }}>{inv.partner}</span></td>
                              <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{inv.period}</span></td>
                              <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: inv.status === 'overdue' ? palette.red500 : theme.text.muted }}>{inv.due}</span></td>
                              <td className="p-4"><span className="font-medium" style={{ color: theme.text.primary }}>GH₵ {inv.amount.toLocaleString()}</span></td>
                              <td className="p-4"><StatusBadge status={inv.status} /></td>
                              <td className="p-4 text-right">
                                <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Eye size={16} /></button>
                                <button className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Printer size={16} /></button>
                                {inv.status !== 'paid' && <button onClick={() => addToast({ type: 'success', message: `Reminder sent to ${inv.partner}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Send size={16} /></button>}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* API Management */}
                {activeSubMenu === 'API Management' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MetricCard title="Active Keys" value={apiKeysData.filter(k => k.status === 'active').length} icon={Key} theme={theme} loading={loading} />
                      <MetricCard title="Calls Today" value={apiKeysData.reduce((s, k) => s + k.callsToday, 0).toLocaleString()} icon={TrendingUp} theme={theme} loading={loading} />
                      <MetricCard title="Calls This Month" value={`${(apiKeysData.reduce((s, k) => s + k.callsMonth, 0) / 1000).toFixed(1)}K`} icon={BarChart} theme={theme} loading={loading} />
                      <MetricCard title="Revoked Keys" value={apiKeysData.filter(k => k.status === 'revoked').length} icon={Lock} theme={theme} loading={loading} />
                    </div>
                    <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold" style={{ color: theme.text.primary }}>API Documentation</h3>
                        <div className="flex gap-2">
                          <button onClick={() => addToast({ type: 'info', message: 'Opening API docs...' })} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.light, color: theme.accent.primary, border: `1px solid ${theme.accent.border}` }}><FileText size={14} className="inline mr-2" />View Docs</button>
                          <button onClick={() => addToast({ type: 'info', message: 'Opening webhook config...' })} className="px-4 py-2 rounded-xl text-sm border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Cog size={14} className="inline mr-2" />Webhooks</button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[{ label: 'REST API', desc: 'Package CRUD, tracking, locker management', version: 'v2.1', color: palette.blue500 },
                          { label: 'Webhooks', desc: 'Real-time status updates, delivery events', version: '12 events', color: palette.emerald500 },
                          { label: 'Bulk Upload', desc: 'CSV/JSON batch import, up to 500 packages', version: 'v1.3', color: palette.violet500 }
                        ].map(api => (
                          <div key={api.label} className="p-4 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: api.color }} />
                              <span className="font-medium" style={{ color: theme.text.primary }}>{api.label}</span>
                              <span className="ml-auto text-xs px-2 py-0.5 rounded" style={{ backgroundColor: `${api.color}15`, color: api.color }}>{api.version}</span>
                            </div>
                            <p className="text-xs" style={{ color: theme.text.muted }}>{api.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                        <h3 className="font-semibold" style={{ color: theme.text.primary }}>API Keys</h3>
                        <button onClick={() => addToast({ type: 'info', message: 'Generate new API key' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Key size={16} />Generate Key</button>
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Partner</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Key</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Environment</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Usage Today</th>
                            <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                            <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {apiKeysData.map(k => (
                            <tr key={k.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <td className="p-4"><span style={{ color: theme.text.primary }}>{k.partner}</span></td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <code className="text-sm px-2 py-1 rounded" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary, fontFamily: theme.font.mono }}>{k.key}</code>
                                </div>
                              </td>
                              <td className="p-4 hidden md:table-cell">
                                <span className="px-2 py-1 rounded-full text-xs" style={{ backgroundColor: k.env === 'production' ? overlays.successBg : overlays.warningBg, color: k.env === 'production' ? palette.emerald500 : palette.amber500 }}>{k.env}</span>
                              </td>
                              <td className="p-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                                    <div className="h-full rounded-full" style={{ width: `${(k.callsToday / k.rateLimit) * 100}%`, backgroundColor: k.callsToday / k.rateLimit > 0.8 ? palette.red500 : k.callsToday / k.rateLimit > 0.5 ? palette.amber500 : palette.emerald500 }} />
                                  </div>
                                  <span className="text-xs font-mono" style={{ color: theme.text.secondary }}>{k.callsToday}/{k.rateLimit}</span>
                                </div>
                              </td>
                              <td className="p-4"><StatusBadge status={k.status === 'revoked' ? 'expired' : k.status} /></td>
                              <td className="p-4 text-right">
                                <button onClick={() => addToast({ type: 'info', message: 'Key copied to clipboard' })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Eye size={16} /></button>
                                {k.status === 'active' ? (
                                  <button onClick={() => addToast({ type: 'warning', message: `Key ${k.key} revoked` })} className="p-2 rounded-lg hover:bg-white/5 text-red-500"><Lock size={16} /></button>
                                ) : (
                                  <button onClick={() => addToast({ type: 'success', message: `Key reactivated` })} className="p-2 rounded-lg hover:bg-white/5 text-emerald-500"><Unlock size={16} /></button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Partner Analytics */}
                {activeSubMenu === 'Partner Analytics' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold" style={{ color: theme.text.primary }}>Monthly Volume by Partner</h3>
                          <div className="flex gap-3">
                            {[{ l: 'Jumia', c: theme.accent.primary }, { l: 'Melcom', c: palette.blue500 }, { l: 'Telecel', c: palette.emerald500 }, { l: 'Hubtel', c: palette.amber500 }].map(i => (
                              <span key={i.l} className="flex items-center gap-1 text-xs" style={{ color: theme.text.muted }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: i.c }} />{i.l}</span>
                            ))}
                          </div>
                        </div>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={partnerMonthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                            <Bar dataKey="jumia" fill={theme.accent.primary} radius={[4, 4, 0, 0]} />
                            <Bar dataKey="melcom" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="telecel" fill="#10b981" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="hubtel" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Partner Leaderboard</h3>
                        <div className="space-y-4">
                          {partnersData.filter(p => p.status === 'active').sort((a, b) => b.monthlyVolume - a.monthlyVolume).map((p, i) => (
                            <div key={p.id} className="flex items-center gap-3">
                              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: i === 0 ? palette.amber500 : i === 1 ? palette.silver : i === 2 ? palette.bronze : theme.border.secondary }}>{i + 1}</span>
                              <div className="flex-1">
                                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{p.name}</p>
                                <div className="w-full h-1.5 rounded-full mt-1" style={{ backgroundColor: theme.border.primary }}>
                                  <div className="h-full rounded-full" style={{ width: `${(p.monthlyVolume / 150) * 100}%`, backgroundColor: TIERS[p.tier]?.color }} />
                                </div>
                              </div>
                              <span className="text-sm font-bold" style={{ color: theme.text.primary }}>{p.monthlyVolume}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>SLA Compliance</h3>
                        <div className="space-y-4">
                          {partnersData.filter(p => p.status === 'active').map(p => (
                            <div key={p.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{p.logo}</span>
                                <div>
                                  <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{p.name}</p>
                                  <p className="text-xs" style={{ color: theme.text.muted }}>SLA: {p.sla}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                                  <div className="h-full rounded-full" style={{ width: `${p.deliveryRate}%`, backgroundColor: p.deliveryRate > 95 ? palette.emerald500 : p.deliveryRate > 90 ? palette.amber500 : palette.red500 }} />
                                </div>
                                <span className="text-sm font-bold w-14 text-right" style={{ color: p.deliveryRate > 95 ? palette.emerald500 : p.deliveryRate > 90 ? palette.amber500 : palette.red500 }}>{p.deliveryRate}%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Revenue by Partner</h3>
                        <div className="space-y-4">
                          {partnersData.filter(p => p.status === 'active').sort((a, b) => b.revenue - a.revenue).map(p => (
                            <div key={p.id} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-lg">{p.logo}</span>
                                <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{p.name}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold" style={{ color: palette.emerald500 }}>GH₵ {(p.revenue / 1000).toFixed(1)}K</p>
                                <p className="text-xs" style={{ color: theme.text.muted }}>{((p.revenue / partnersData.reduce((s, x) => s + x.revenue, 0)) * 100).toFixed(1)}% share</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ============ PARTNER SELF-SERVICE PORTAL ============ */}
            {activeMenu === 'selfservice' && (
              <div className="p-4 md:p-6">
                {/* Portal Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: TIERS.gold.bg }}>🟡</div>
                    <div>
                      <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2" style={{ color: theme.text.primary }}>
                        Jumia Ghana <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: TIERS.gold.bg, color: TIERS.gold.color }}>Gold Partner</span>
                      </h1>
                      <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Portal Home'} • Partner Self-Service Portal</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => addToast({ type: 'info', message: 'Opening API docs' })} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><FileText size={16} />API Docs</button>
                    <button onClick={() => addToast({ type: 'info', message: 'Opening support chat' })} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><MessageSquare size={16} />Support</button>
                    <button onClick={() => { setActiveSubMenu('Ship Now'); }} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Plus size={18} />Ship Now</button>
                  </div>
                </div>

                {/* Portal Home */}
                {(!activeSubMenu || activeSubMenu === 'Portal Home') && (
                  <div className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <MetricCard title="This Month" value="130" change="8.3%" changeType="up" icon={Package} subtitle="packages shipped" theme={theme} loading={loading} />
                      <MetricCard title="In Transit" value={portalShipmentsData.filter(p => p.status.includes('transit') || p.status === 'at_warehouse' || p.status === 'pending').length} icon={Truck} theme={theme} loading={loading} />
                      <MetricCard title="In Lockers" value={portalShipmentsData.filter(p => p.status === 'delivered_to_locker').length} icon={Grid3X3} subtitle="awaiting pickup" theme={theme} loading={loading} />
                      <MetricCard title="Delivery Rate" value="96.2%" change="1.4%" changeType="up" icon={TrendingUp} theme={theme} loading={loading} />
                      <MetricCard title="Pending Invoice" value="GH₵ 17.5K" icon={Receipt} subtitle="Due Feb 15" theme={theme} loading={loading} />
                    </div>

                    {/* Alerts */}
                    {portalShipmentsData.some(p => p.status === 'expired' || p.daysInLocker >= 3) && (
                      <div className="p-4 rounded-2xl" style={{ backgroundColor: overlays.warningSubtle, border: '1px solid rgba(245,158,11,0.2)' }}>
                        <p className="text-sm font-semibold mb-2" style={{ color: palette.amber500 }}>⚠️ Attention Required</p>
                        <div className="flex flex-wrap gap-2">
                          {portalShipmentsData.filter(p => p.status === 'expired').length > 0 && (
                            <span className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: overlays.errorBg, color: palette.red500 }}>🔴 {portalShipmentsData.filter(p => p.status === 'expired').length} expired package(s) — will be returned</span>
                          )}
                          {portalShipmentsData.filter(p => p.daysInLocker >= 3 && p.status === 'delivered_to_locker').length > 0 && (
                            <span className="px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: overlays.warningBg, color: palette.amber500 }}>🟡 {portalShipmentsData.filter(p => p.daysInLocker >= 3 && p.status === 'delivered_to_locker').length} package(s) nearing expiry (3+ days)</span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Shipment Trend + Status Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-semibold" style={{ color: theme.text.primary }}>Shipment Trend</h3>
                          <div className="flex gap-3">{[{ l: 'Shipped', c: theme.accent.primary }, { l: 'Delivered', c: palette.emerald500 }, { l: 'Returned', c: palette.red500 }].map(i => (<span key={i.l} className="flex items-center gap-1 text-xs" style={{ color: theme.text.muted }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: i.c }} />{i.l}</span>))}</div>
                        </div>
                        <ResponsiveContainer width="100%" height={220}>
                          <AreaChart data={portalShipmentTrend}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                            <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                            <Area type="monotone" dataKey="shipped" name="Shipped" stroke={theme.accent.primary} fill={`${theme.accent.primary}20`} strokeWidth={2} />
                            <Area type="monotone" dataKey="delivered" name="Delivered" stroke="#10b981" fill="transparent" strokeWidth={2} />
                            <Area type="monotone" dataKey="returned" name="Returned" stroke="#ef4444" fill="transparent" strokeWidth={2} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Current Status</h3>
                        <div className="space-y-3">
                          {[
                            { label: 'In Locker', count: portalShipmentsData.filter(p => p.status === 'delivered_to_locker').length, color: palette.emerald500 },
                            { label: 'In Transit', count: portalShipmentsData.filter(p => p.status.includes('transit')).length, color: palette.blue500 },
                            { label: 'At Warehouse', count: portalShipmentsData.filter(p => p.status === 'at_warehouse').length, color: palette.indigo500 },
                            { label: 'Pending', count: portalShipmentsData.filter(p => p.status === 'pending').length, color: palette.amber500 },
                            { label: 'Picked Up', count: portalShipmentsData.filter(p => p.status === 'picked_up').length, color: palette.gray500 },
                            { label: 'Expired', count: portalShipmentsData.filter(p => p.status === 'expired').length, color: palette.red500 },
                          ].map(s => (
                            <div key={s.label} className="flex items-center justify-between">
                              <span className="flex items-center gap-2 text-sm" style={{ color: theme.text.secondary }}><span className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />{s.label}</span>
                              <span className="font-bold text-lg" style={{ color: s.color }}>{s.count}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
                          <div className="flex justify-between text-sm">
                            <span style={{ color: theme.text.muted }}>Total Active</span>
                            <span className="font-bold" style={{ color: theme.text.primary }}>{portalShipmentsData.length}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="p-4 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <h3 className="text-sm font-semibold mb-4" style={{ color: theme.text.muted }}>Quick Actions</h3>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                        <QuickAction icon={Plus} label="Ship Package" theme={theme} onClick={() => setActiveSubMenu('Ship Now')} />
                        <QuickAction icon={FileDown} label="Bulk Upload" theme={theme} onClick={() => setActiveSubMenu('Ship Now')} badge="CSV" />
                        <QuickAction icon={Search} label="Track" theme={theme} onClick={() => setActiveSubMenu('Track Packages')} />
                        <QuickAction icon={Grid3X3} label="Locker Map" theme={theme} onClick={() => setActiveSubMenu('Locker Map')} />
                        <QuickAction icon={Receipt} label="Invoices" theme={theme} onClick={() => setActiveSubMenu('My Billing')} />
                        <QuickAction icon={Command} label="API Console" theme={theme} onClick={() => setActiveSubMenu('API Console')} />
                      </div>
                    </div>

                    {/* Recent Shipments */}
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                        <h3 className="font-semibold" style={{ color: theme.text.primary }}>Recent Shipments</h3>
                        <button onClick={() => setActiveSubMenu('Track Packages')} className="text-sm" style={{ color: theme.accent.primary }}>View All →</button>
                      </div>
                      <table className="w-full">
                        <thead><tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Order ID</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Destination</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Locker</th>
                        </tr></thead>
                        <tbody>
                          {portalShipmentsData.slice(0, 5).map(s => (
                            <tr key={s.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <td className="p-3"><span className="font-mono text-sm" style={{ color: theme.text.primary }}>{s.id}</span><br/><span className="text-xs" style={{ color: theme.text.muted }}>{s.waybill}</span></td>
                              <td className="p-3"><span className="text-sm" style={{ color: theme.text.primary }}>{s.customer}</span></td>
                              <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{s.destination}</span></td>
                              <td className="p-3"><StatusBadge status={s.status} /></td>
                              <td className="p-3 hidden md:table-cell">{s.locker !== '-' ? <span className="font-mono text-sm px-2 py-0.5 rounded" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}>{s.locker}</span> : <span style={{ color: theme.text.muted }}>—</span>}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Account Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h4 className="text-sm font-semibold mb-3" style={{ color: theme.text.muted }}>Account Details</h4>
                        <div className="space-y-2 text-sm">{[['Partner ID', 'PTR-001'], ['Tier', 'Gold'], ['SLA', '24 hours'], ['Contract', 'Until Dec 2025'], ['Account Manager', 'Akua Mansa']].map(([l, v]) => (
                          <div key={l} className="flex justify-between"><span style={{ color: theme.text.muted }}>{l}</span><span className="font-medium" style={{ color: theme.text.primary }}>{v}</span></div>
                        ))}</div>
                      </div>
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h4 className="text-sm font-semibold mb-3" style={{ color: theme.text.muted }}>API Usage Today</h4>
                        <div className="mb-3">
                          <div className="flex justify-between mb-1"><span className="text-sm" style={{ color: theme.text.muted }}>Calls</span><span className="text-sm font-mono" style={{ color: theme.text.primary }}>342 / 1,000</span></div>
                          <div className="w-full h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}><div className="h-full rounded-full" style={{ width: '34.2%', backgroundColor: palette.blue500 }} /></div>
                        </div>
                        <div className="space-y-2 text-sm">{[['Rate Limit', '1,000/day'], ['Last Call', '2 min ago'], ['Avg Response', '120ms'], ['Error Rate', '0.2%']].map(([l, v]) => (
                          <div key={l} className="flex justify-between"><span style={{ color: theme.text.muted }}>{l}</span><span className="font-medium" style={{ color: theme.text.primary }}>{v}</span></div>
                        ))}</div>
                      </div>
                      <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h4 className="text-sm font-semibold mb-3" style={{ color: theme.text.muted }}>This Month's Summary</h4>
                        <div className="space-y-2 text-sm">{[['Packages Shipped', '130'], ['Delivered', '125 (96.2%)'], ['Returns', '5 (3.8%)'], ['Avg Pickup Time', '18 hrs'], ['Revenue', 'GH₵ 15,600']].map(([l, v]) => (
                          <div key={l} className="flex justify-between"><span style={{ color: theme.text.muted }}>{l}</span><span className="font-medium" style={{ color: theme.text.primary }}>{v}</span></div>
                        ))}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========== SHIP NOW ========== */}
                {activeSubMenu === 'Ship Now' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Single Shipment Form */}
                      <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                        <h3 className="font-semibold mb-1 flex items-center gap-2" style={{ color: theme.text.primary }}><Package size={20} style={{ color: theme.accent.primary }} />Single Shipment</h3>
                        <p className="text-sm mb-6" style={{ color: theme.text.muted }}>Create a new package for locker delivery</p>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Order ID *</label><input placeholder="e.g. JUM-2024-0461" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
                            <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Package Size *</label>
                              <select className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                                <option value="">Select size</option>{portalRateCard.map(r => <option key={r.size} value={r.size}>{r.size} ({r.dimensions}) — GH₵ {r.pricePerDay}</option>)}</select></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Customer Name *</label><input placeholder="Full name" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
                            <div>
                              <label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Phone Number (Address) *</label>
                              <input placeholder="+233..." className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} onChange={e => { const pin = phonePinData.find(p => p.phone === e.target.value); if (pin) addToast({ type: 'info', message: `${pin.customer} has pinned locker: ${pin.pinnedAddress} (${pin.pinnedTerminal})` }); }} />
                              <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Phone resolves to pinned locker address</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Destination Terminal *</label>
                              <select className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                                <option value="">Select terminal</option>{terminalsData.filter(t => t.status === 'online').map(t => <option key={t.id} value={t.id}>{t.name} — {getTerminalAddress(t)}</option>)}</select>
                              <p className="text-xs mt-1 font-mono" style={{ color: theme.accent.primary }}>Address auto-fills from pinned phone</p>
                            </div>
                            <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Package Value (GH₵)</label><input type="number" placeholder="0.00" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Weight (kg)</label><input type="number" placeholder="0.0" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
                            <div className="flex items-end gap-3">
                              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-orange-500" /><span className="text-sm" style={{ color: theme.text.secondary }}>Cash on Delivery</span></label>
                              <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="w-4 h-4 accent-orange-500" /><span className="text-sm" style={{ color: theme.text.secondary }}>Fragile</span></label>
                            </div>
                          </div>
                          <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Notes</label><textarea rows={2} placeholder="Special instructions..." className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent resize-none" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
                          <div className="flex gap-3 pt-2">
                            <button onClick={() => addToast({ type: 'success', message: 'Shipment created! Waybill: LQ-2024-01211' })} className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm font-medium" style={{ backgroundColor: theme.accent.primary }}><Send size={16} />Create Shipment</button>
                            <button onClick={() => addToast({ type: 'info', message: 'Generating label...' })} className="px-6 py-3 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Printer size={16} className="inline mr-2" />Print Label</button>
                          </div>
                        </div>
                      </div>

                      {/* Bulk Upload */}
                      <div className="space-y-6">
                        <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                          <h3 className="font-semibold mb-1 flex items-center gap-2" style={{ color: theme.text.primary }}><FileDown size={20} style={{ color: palette.violet500 }} />Bulk Upload</h3>
                          <p className="text-sm mb-6" style={{ color: theme.text.muted }}>Upload a CSV file to create multiple shipments at once</p>
                          <div className="border-2 border-dashed rounded-2xl p-8 text-center" style={{ borderColor: theme.border.secondary }}>
                            <FileDown size={40} style={{ color: theme.text.muted }} className="mx-auto mb-3" />
                            <p className="font-medium mb-1" style={{ color: theme.text.primary }}>Drop CSV file here or click to browse</p>
                            <p className="text-sm mb-4" style={{ color: theme.text.muted }}>Max 500 packages per upload • CSV or XLSX format</p>
                            <button onClick={() => addToast({ type: 'info', message: 'File browser opened' })} className="px-6 py-2.5 rounded-xl text-white text-sm" style={{ backgroundColor: palette.violet500 }}>Choose File</button>
                          </div>
                          <div className="flex items-center gap-4 mt-4">
                            <button onClick={() => addToast({ type: 'info', message: 'Downloading template...' })} className="text-sm flex items-center gap-1" style={{ color: theme.accent.primary }}><Download size={14} />Download CSV Template</button>
                            <button onClick={() => addToast({ type: 'info', message: 'Opening field mapping guide' })} className="text-sm flex items-center gap-1" style={{ color: palette.blue500 }}><Info size={14} />Field Guide</button>
                          </div>
                        </div>

                        {/* Rate Card */}
                        <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                          <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}><CreditCard size={20} style={{ color: palette.amber500 }} />Your Rate Card</h3>
                          <table className="w-full">
                            <thead><tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <th className="text-left p-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Size</th>
                              <th className="text-left p-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Dimensions</th>
                              <th className="text-left p-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Max Wt.</th>
                              <th className="text-left p-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Price</th>
                              <th className="text-left p-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Free Storage</th>
                            </tr></thead>
                            <tbody>{portalRateCard.map(r => (
                              <tr key={r.size} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                                <td className="p-2 font-medium" style={{ color: theme.text.primary }}>{r.size}</td>
                                <td className="p-2 text-sm" style={{ color: theme.text.secondary }}>{r.dimensions}</td>
                                <td className="p-2 text-sm" style={{ color: theme.text.secondary }}>{r.maxWeight}</td>
                                <td className="p-2 font-bold" style={{ color: theme.accent.primary }}>GH₵ {r.pricePerDay}</td>
                                <td className="p-2 text-sm" style={{ color: theme.text.muted }}>{r.storageFree} days (then ₵{r.storagePerDay}/day)</td>
                              </tr>
                            ))}</tbody>
                          </table>
                          <p className="text-xs mt-3" style={{ color: theme.text.muted }}>* Gold tier pricing. 15% discount on volumes over 100/month.</p>
                        </div>
                      </div>
                    </div>

                    {/* Active Batches */}
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}><h3 className="font-semibold" style={{ color: theme.text.primary }}>Active Batches</h3></div>
                      <table className="w-full"><thead><tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                        <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Batch</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Terminal</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Progress</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>ETA</th>
                      </tr></thead><tbody>
                        {bulkShipmentsData.filter(b => b.partner === 'Jumia Ghana').map(b => (
                          <tr key={b.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <td className="p-3"><span className="font-mono font-bold" style={{ color: theme.text.primary }}>{b.id}</span><br/><span className="text-xs" style={{ color: theme.text.muted }}>{b.packages} packages</span></td>
                            <td className="p-3 hidden md:table-cell" style={{ color: theme.text.secondary }}>{b.terminal}</td>
                            <td className="p-3"><StatusBadge status={b.status} /></td>
                            <td className="p-3"><div className="flex items-center gap-2"><div className="w-20 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}><div className="h-full rounded-full" style={{ width: `${(b.delivered / b.packages) * 100}%`, backgroundColor: palette.emerald500 }} /></div><span className="text-xs font-mono" style={{ color: theme.text.secondary }}>{b.delivered}/{b.packages}</span></div></td>
                            <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{b.eta}</span></td>
                          </tr>
                        ))}
                      </tbody></table>
                    </div>
                  </div>
                )}

                {/* ========== TRACK PACKAGES ========== */}
                {activeSubMenu === 'Track Packages' && (
                  <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="flex gap-3">
                      <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                        <Search size={18} style={{ color: theme.text.muted }} />
                        <input placeholder="Search by Order ID, Waybill, Phone, or Locker Address..." className="flex-1 bg-transparent outline-none text-sm" style={{ color: theme.text.primary }} />
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Filter size={16} />Filters</button>
                      <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={16} />Export</button>
                    </div>

                    {/* Status Quick Filters */}
                    <div className="flex flex-wrap gap-2">
                      {[['all', 'All', portalShipmentsData.length], ['delivered_to_locker', 'In Locker', portalShipmentsData.filter(p => p.status === 'delivered_to_locker').length], ['in_transit_to_locker', 'In Transit', portalShipmentsData.filter(p => p.status.includes('transit')).length], ['pending', 'Pending', portalShipmentsData.filter(p => p.status === 'pending' || p.status === 'at_warehouse').length], ['picked_up', 'Picked Up', portalShipmentsData.filter(p => p.status === 'picked_up').length], ['expired', 'Expired', portalShipmentsData.filter(p => p.status === 'expired').length]].map(([k, l, c]) => (
                        <button key={k} className="px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: k === 'all' ? theme.accent.light : 'transparent', color: k === 'all' ? theme.accent.primary : theme.text.muted, border: k === 'all' ? `1px solid ${theme.accent.border}` : '1px solid transparent' }}>{l} <span className="ml-1 font-mono">({c})</span></button>
                      ))}
                    </div>

                    {/* Full Table */}
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="overflow-x-auto"><table className="w-full">
                        <thead><tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Order / Waybill</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customer</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Destination</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Locker</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Pickup Code</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Age</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Value</th>
                          <th className="text-right p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                        </tr></thead>
                        <tbody>{portalShipmentsData.map(s => (
                          <tr key={s.id} style={{ borderBottom: `1px solid ${theme.border.primary}`, backgroundColor: s.status === 'expired' ? overlays.errorSubtle : s.daysInLocker >= 3 && s.status === 'delivered_to_locker' ? overlays.warningSubtle : 'transparent' }}>
                            <td className="p-3"><span className="font-mono font-medium text-sm" style={{ color: theme.text.primary }}>{s.id}</span><br/><span className="text-xs font-mono" style={{ color: theme.text.muted }}>{s.waybill}</span></td>
                            <td className="p-3"><span className="text-sm" style={{ color: theme.text.primary }}>{s.customer}</span><br/><span className="text-xs" style={{ color: theme.text.muted }}>{s.phone}</span></td>
                            <td className="p-3 hidden md:table-cell">
                              <span className="text-sm" style={{ color: theme.text.secondary }}>{s.destination}</span>
                              {(() => { const t = terminalsData.find(t => t.name === s.destination); return t ? <p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{s.locker !== '-' ? getLockerAddress(s.locker, s.destination) : getTerminalAddress(t)}</p> : null; })()}
                            </td>
                            <td className="p-3"><StatusBadge status={s.status} /></td>
                            <td className="p-3 hidden md:table-cell">{s.locker !== '-' ? <span className="font-mono text-sm px-2 py-0.5 rounded" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}>{s.locker}</span> : '—'}</td>
                            <td className="p-3 hidden lg:table-cell">{s.pickupCode ? <span className="font-mono font-bold tracking-wider" style={{ color: palette.emerald500 }}>{s.pickupCode}</span> : '—'}</td>
                            <td className="p-3 hidden lg:table-cell">{s.daysInLocker > 0 ? <span className={`text-sm font-medium ${s.daysInLocker >= 5 ? 'text-red-500' : s.daysInLocker >= 3 ? 'text-amber-500' : ''}`} style={{ color: s.daysInLocker < 3 ? theme.text.secondary : undefined }}>{s.daysInLocker}d</span> : '—'}</td>
                            <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.primary }}>GH₵ {s.value}</span></td>
                            <td className="p-3 text-right">
                              <button onClick={() => addToast({ type: 'info', message: `Tracking ${s.waybill}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Eye size={14} /></button>
                              {s.status === 'delivered_to_locker' && <button onClick={() => addToast({ type: 'info', message: `Sending reminder to ${s.customer}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: palette.amber500 }}><Bell size={14} /></button>}
                              <button onClick={() => addToast({ type: 'info', message: 'Printing label...' })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Printer size={14} /></button>
                            </td>
                          </tr>
                        ))}</tbody>
                      </table></div>
                    </div>
                  </div>
                )}

                {/* ========== LOCKER MAP ========== */}
                {activeSubMenu === 'Locker Map' && (
                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl" style={{ backgroundColor: overlays.infoSubtle, border: '1px solid rgba(59,130,246,0.2)' }}>
                      <div className="flex items-center gap-2"><Info size={18} style={{ color: palette.blue500 }} /><p className="text-sm" style={{ color: palette.blue500 }}>Real-time locker availability across all terminals. Data refreshes every 5 minutes.</p></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {portalTerminalAvailability.map(t => {
                        const utilizationPct = Math.round(((t.totalLockers - t.available) / t.totalLockers) * 100);
                        const utilizationColor = utilizationPct > 85 ? palette.red500 : utilizationPct > 60 ? palette.amber500 : palette.emerald500;
                        return (
                          <div key={t.id} className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                            <div className="p-5">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3"><Building2 size={20} style={{ color: theme.accent.primary }} /><div><p className="font-semibold" style={{ color: theme.text.primary }}>{t.name}</p><p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{getTerminalAddress(t)}</p><p className="text-xs" style={{ color: theme.text.muted }}>{t.location}</p></div></div>
                                <StatusBadge status={t.status} />
                              </div>
                              <div className="mb-4">
                                <div className="flex justify-between mb-1"><span className="text-xs" style={{ color: theme.text.muted }}>Utilization</span><span className="text-sm font-bold" style={{ color: utilizationColor }}>{utilizationPct}%</span></div>
                                <div className="w-full h-3 rounded-full" style={{ backgroundColor: theme.border.primary }}><div className="h-full rounded-full transition-all" style={{ width: `${utilizationPct}%`, backgroundColor: utilizationColor }} /></div>
                                <div className="flex justify-between mt-1 text-xs" style={{ color: theme.text.muted }}><span>{t.available} available</span><span>{t.totalLockers} total</span></div>
                              </div>
                              <div className="space-y-2">
                                {[{ label: 'Small', ...t.small, color: palette.emerald500 }, { label: 'Medium', ...t.medium, color: palette.blue500 }, { label: 'Large', ...t.large, color: palette.violet500 }, { label: 'XLarge', ...t.xlarge, color: palette.amber500 }].map(s => (
                                  <div key={s.label} className="flex items-center justify-between p-2 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                                    <span className="text-sm flex items-center gap-2" style={{ color: theme.text.secondary }}><span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />{s.label}</span>
                                    <div className="flex items-center gap-3">
                                      <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: theme.border.primary }}><div className="h-full rounded-full" style={{ width: `${s.total > 0 ? ((s.total - s.available) / s.total) * 100 : 0}%`, backgroundColor: s.color }} /></div>
                                      <span className="font-mono text-sm w-12 text-right" style={{ color: s.available > 0 ? palette.emerald500 : palette.red500 }}>{s.available}/{s.total}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                            <div className="border-t p-3" style={{ borderColor: theme.border.primary }}>
                              <button onClick={() => addToast({ type: 'info', message: `Reserving locker at ${t.name}` })} className="w-full py-2 rounded-xl text-sm" style={{ backgroundColor: t.available > 0 ? theme.accent.light : 'transparent', color: t.available > 0 ? theme.accent.primary : theme.text.muted, border: `1px solid ${t.available > 0 ? theme.accent.border : theme.border.primary}` }} disabled={t.available === 0}>{t.available > 0 ? 'Reserve Locker' : 'No Lockers Available'}</button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ========== MY BILLING ========== */}
                {activeSubMenu === 'My Billing' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MetricCard title="Outstanding" value={`GH₵ ${portalInvoicesData.filter(i => i.status === 'pending').reduce((s, i) => s + i.total, 0).toLocaleString()}`} icon={Receipt} theme={theme} loading={loading} subtitle="1 pending invoice" />
                      <MetricCard title="Paid (YTD)" value={`GH₵ ${portalInvoicesData.filter(i => i.status === 'paid').reduce((s, i) => s + i.total, 0).toLocaleString()}`} icon={CheckCircle2} theme={theme} loading={loading} />
                      <MetricCard title="Total Packages" value={portalInvoicesData.reduce((s, i) => s + i.packages, 0)} icon={Package} theme={theme} loading={loading} subtitle="Last 4 months" />
                      <MetricCard title="Avg Monthly" value={`GH₵ ${Math.round(portalInvoicesData.reduce((s, i) => s + i.total, 0) / portalInvoicesData.length).toLocaleString()}`} icon={TrendingUp} theme={theme} loading={loading} />
                    </div>

                    {/* Pending Invoice Alert */}
                    {portalInvoicesData.some(i => i.status === 'pending') && (
                      <div className="p-5 rounded-2xl flex flex-col md:flex-row md:items-center gap-4" style={{ backgroundColor: overlays.warningSubtle, border: '1px solid rgba(245,158,11,0.2)' }}>
                        <div className="flex items-center gap-3 flex-1"><AlertTriangle size={24} style={{ color: palette.amber500 }} /><div><p className="font-semibold" style={{ color: palette.amber500 }}>Invoice Due</p><p className="text-sm" style={{ color: theme.text.muted }}>{portalInvoicesData.find(i => i.status === 'pending')?.id} — GH₵ {portalInvoicesData.find(i => i.status === 'pending')?.total.toLocaleString()} due by {portalInvoicesData.find(i => i.status === 'pending')?.dueDate}</p></div></div>
                        <div className="flex gap-2">
                          <button onClick={() => addToast({ type: 'info', message: 'Opening payment portal...' })} className="px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: palette.amber500 }}>Pay Now</button>
                          <button onClick={() => addToast({ type: 'info', message: 'Downloading invoice PDF...' })} className="px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={14} className="inline mr-1" />Download</button>
                        </div>
                      </div>
                    )}

                    {/* Invoices Table */}
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}><h3 className="font-semibold" style={{ color: theme.text.primary }}>Invoice History</h3></div>
                      <table className="w-full"><thead><tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                        <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Invoice</th>
                        <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Period</th>
                        <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Packages</th>
                        <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Subtotal</th>
                        <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Tax</th>
                        <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Total</th>
                        <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Due Date</th>
                        <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                        <th className="text-right p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                      </tr></thead><tbody>
                        {portalInvoicesData.map(inv => (
                          <tr key={inv.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                            <td className="p-4"><span className="font-mono font-medium" style={{ color: theme.text.primary }}>{inv.id}</span></td>
                            <td className="p-4"><span style={{ color: theme.text.primary }}>{inv.period}</span></td>
                            <td className="p-4 hidden md:table-cell"><span style={{ color: theme.text.secondary }}>{inv.packages}</span></td>
                            <td className="p-4 hidden md:table-cell"><span style={{ color: theme.text.secondary }}>GH₵ {inv.amount.toLocaleString()}</span></td>
                            <td className="p-4 hidden lg:table-cell"><span style={{ color: theme.text.muted }}>GH₵ {inv.tax.toLocaleString()}</span></td>
                            <td className="p-4"><span className="font-bold" style={{ color: theme.text.primary }}>GH₵ {inv.total.toLocaleString()}</span></td>
                            <td className="p-4 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.muted }}>{inv.dueDate}</span></td>
                            <td className="p-4"><StatusBadge status={inv.status} /></td>
                            <td className="p-4 text-right">
                              <button onClick={() => addToast({ type: 'info', message: `Downloading ${inv.id}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Download size={14} /></button>
                              <button onClick={() => addToast({ type: 'info', message: `Viewing ${inv.id}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Eye size={14} /></button>
                              {inv.status === 'pending' && <button onClick={() => addToast({ type: 'info', message: 'Opening payment...' })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: palette.amber500 }}><CreditCard size={14} /></button>}
                            </td>
                          </tr>
                        ))}
                      </tbody></table>
                    </div>
                  </div>
                )}

                {/* ========== API CONSOLE ========== */}
                {activeSubMenu === 'API Console' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <MetricCard title="API Calls Today" value="342" icon={TrendingUp} theme={theme} loading={loading} subtitle="of 1,000 limit" />
                      <MetricCard title="Avg Response" value="120ms" icon={Clock} theme={theme} loading={loading} />
                      <MetricCard title="Success Rate" value="99.8%" icon={CheckCircle2} theme={theme} loading={loading} />
                      <MetricCard title="Webhook Events" value="48" icon={Send} theme={theme} loading={loading} subtitle="today" />
                    </div>

                    {/* API Key */}
                    <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}><Key size={20} style={{ color: palette.amber500 }} />Your API Keys</h3>
                      <div className="space-y-3">
                        {apiKeysData.filter(k => k.partner === 'Jumia Ghana').map(k => (
                          <div key={k.id} className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                            <div className="flex-1">
                              <div className="flex items-center gap-2"><span className="px-2 py-0.5 rounded-full text-xs" style={{ backgroundColor: k.env === 'production' ? overlays.successBg : overlays.warningBg, color: k.env === 'production' ? palette.emerald500 : palette.amber500 }}>{k.env}</span><StatusBadge status={k.status === 'revoked' ? 'expired' : k.status} /></div>
                              <code className="text-sm mt-1 block font-mono" style={{ color: theme.text.primary }}>{k.key}</code>
                              <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Created: {k.created} • Last used: {k.lastUsed} • Calls today: {k.callsToday}/{k.rateLimit}</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => addToast({ type: 'success', message: 'Key copied to clipboard' })} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: overlays.infoBg, color: palette.blue500 }}>Copy Key</button>
                              <button onClick={() => addToast({ type: 'warning', message: 'Are you sure? This will invalidate the current key.' })} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: overlays.warningBg, color: palette.amber500 }}>Regenerate</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* API Playground */}
                    <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}><Command size={20} style={{ color: palette.violet500 }} />API Playground</h3>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Endpoint</label>
                          <select className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                            <option>POST /v2/packages — Create Package</option>
                            <option>GET /v2/packages/:id — Get Package</option>
                            <option>GET /v2/packages/:id/track — Track Package</option>
                            <option>POST /v2/batches — Create Batch</option>
                            <option>GET /v2/terminals — List Terminals</option>
                            <option>GET /v2/terminals/:id/availability — Locker Availability</option>
                            <option>GET /v2/invoices — List Invoices</option>
                          </select>
                          <label className="text-xs font-semibold uppercase block mt-4 mb-2" style={{ color: theme.text.muted }}>Request Body</label>
                          <pre className="p-4 rounded-xl text-sm overflow-x-auto" style={{ backgroundColor: theme.bg.primary, color: palette.emerald500, fontFamily: theme.font.mono, border: `1px solid ${theme.border.primary}` }}>{`{
  "order_id": "JUM-2024-0461",
  "customer_name": "Kwame Mensah",
  "customer_phone": "+233551234567",
  "terminal_id": "TRM-001",
  "size": "medium",
  "value": 120.00,
  "cod": false,
  "notify": true
}`}</pre>
                          <button onClick={() => addToast({ type: 'success', message: 'API call successful! Status: 201 Created' })} className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-white text-sm" style={{ backgroundColor: palette.violet500 }}><Send size={16} />Send Request</button>
                        </div>
                        <div>
                          <label className="text-xs font-semibold uppercase block mb-2" style={{ color: theme.text.muted }}>Response</label>
                          <pre className="p-4 rounded-xl text-sm overflow-x-auto h-full min-h-[280px]" style={{ backgroundColor: theme.bg.primary, color: palette.blue500, fontFamily: theme.font.mono, border: `1px solid ${theme.border.primary}` }}>{`// 201 Created — 120ms
{
  "success": true,
  "data": {
    "waybill": "LQ-2024-01211",
    "order_id": "JUM-2024-0461",
    "status": "pending",
    "terminal": "Achimota Mall",
    "estimated_delivery": "2024-01-15T16:00:00Z",
    "tracking_url": "https://track.locqar.com/LQ-2024-01211",
    "label_url": "https://api.locqar.com/v2/labels/LQ-2024-01211.pdf"
  }
}`}</pre>
                        </div>
                      </div>
                    </div>

                    {/* Webhook Logs */}
                    <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: theme.border.primary }}>
                        <h3 className="font-semibold flex items-center gap-2" style={{ color: theme.text.primary }}><Send size={18} />Webhook Delivery Log</h3>
                        <div className="flex gap-2">
                          <button onClick={() => addToast({ type: 'info', message: 'Opening webhook settings' })} className="px-3 py-1.5 rounded-lg text-xs border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Cog size={12} className="inline mr-1" />Configure</button>
                          <button onClick={() => addToast({ type: 'info', message: 'Testing webhook endpoint...' })} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: overlays.successBg, color: palette.emerald500 }}>Test Webhook</button>
                        </div>
                      </div>
                      <table className="w-full"><thead><tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                        <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Event</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Response</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Time</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Timestamp</th>
                        <th className="text-right p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Actions</th>
                      </tr></thead><tbody>
                        {portalWebhookLogsData.map(w => (
                          <tr key={w.id} style={{ borderBottom: `1px solid ${theme.border.primary}`, backgroundColor: w.status !== 200 ? overlays.errorSubtle : 'transparent' }}>
                            <td className="p-3"><span className="font-mono text-sm" style={{ color: theme.text.primary }}>{w.event}</span></td>
                            <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-mono ${w.status === 200 ? 'text-emerald-500' : 'text-red-500'}`} style={{ backgroundColor: w.status === 200 ? overlays.successBg : overlays.errorBg }}>{w.status}</span>{w.error && <span className="text-xs text-red-500 ml-1">{w.error}</span>}</td>
                            <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: theme.text.secondary }}>{w.responseTime}</span></td>
                            <td className="p-3 hidden md:table-cell"><span className="text-xs font-mono" style={{ color: theme.text.muted }}>{w.timestamp.split(' ')[1]}</span></td>
                            <td className="p-3 hidden lg:table-cell"><span className="text-xs" style={{ color: theme.text.muted }}>{w.timestamp}</span></td>
                            <td className="p-3 text-right">
                              <button onClick={() => addToast({ type: 'info', message: `Payload: ${w.payload}` })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}><Eye size={14} /></button>
                              {w.status !== 200 && <button onClick={() => addToast({ type: 'info', message: 'Retrying webhook...' })} className="p-2 rounded-lg hover:bg-white/5" style={{ color: palette.amber500 }}><RefreshCw size={14} /></button>}
                            </td>
                          </tr>
                        ))}
                      </tbody></table>
                    </div>
                  </div>
                )}

                {/* ========== HELP CENTER ========== */}
                {activeSubMenu === 'Help Center' && (
                  <div className="space-y-6 max-w-4xl">
                    {/* Contact Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[{ icon: Phone, label: 'Call Support', desc: '+233 55 139 9333', action: 'Call Now', color: palette.blue500 }, { icon: MessageSquare, label: 'WhatsApp', desc: 'Chat with support team', action: 'Open Chat', color: palette.whatsapp }, { icon: Send, label: 'Email', desc: 'partners@locqar.com', action: 'Send Email', color: theme.accent.primary }].map(c => (
                        <div key={c.label} className="p-5 rounded-2xl border text-center" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: `${c.color}15` }}><c.icon size={24} style={{ color: c.color }} /></div>
                          <p className="font-semibold" style={{ color: theme.text.primary }}>{c.label}</p>
                          <p className="text-sm mt-1 mb-4" style={{ color: theme.text.muted }}>{c.desc}</p>
                          <button onClick={() => addToast({ type: 'info', message: c.action })} className="px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: c.color }}>{c.action}</button>
                        </div>
                      ))}
                    </div>

                    {/* Submit Ticket */}
                    <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}><Ticket size={20} style={{ color: theme.accent.primary }} />Submit a Support Ticket</h3>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Category</label>
                            <select className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                              <option>Delivery Issue</option><option>Billing / Invoice</option><option>API / Technical</option><option>Locker Problem</option><option>Account</option><option>Other</option></select></div>
                          <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Priority</label>
                            <select className="w-full px-3 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                              <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></div>
                        </div>
                        <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Subject</label><input placeholder="Brief description of the issue" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
                        <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Related Package (optional)</label><input placeholder="Waybill or Order ID" className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
                        <div><label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Description</label><textarea rows={4} placeholder="Describe the issue in detail..." className="w-full px-3 py-2.5 rounded-xl border text-sm bg-transparent resize-none" style={{ borderColor: theme.border.primary, color: theme.text.primary }} /></div>
                        <button onClick={() => addToast({ type: 'success', message: 'Ticket submitted! ID: TKT-004. Our team will respond within 4 hours.' })} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}><Send size={16} />Submit Ticket</button>
                      </div>
                    </div>

                    {/* FAQ */}
                    <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Frequently Asked Questions</h3>
                      <div className="space-y-3">
                        {[
                          { q: 'How long are packages stored in lockers?', a: 'Packages are stored for 5 days free. After that, storage fees apply per your rate card. After 7 days, packages are returned.' },
                          { q: 'How do I set up webhooks?', a: 'Go to API Console → Configure Webhooks. Add your endpoint URL and select the events you want to receive. We support package.created, package.in_transit, package.delivered, package.picked_up, and package.expired events.' },
                          { q: 'What happens to expired packages?', a: 'Expired packages are queued for return to your warehouse. You can arrange collection or we can dispatch them. A return fee of GH₵ 5 per package applies.' },
                          { q: 'Can I reserve specific lockers?', a: 'Yes! Use the Locker Map to reserve lockers at specific terminals. Reservations last 24 hours. You can also reserve via API using POST /v2/lockers/reserve.' },
                          { q: 'How do I upgrade my tier?', a: 'Tier upgrades are based on monthly volume. Silver: 50+ packages/month, Gold: 100+ packages/month. Contact your account manager for custom plans.' },
                          { q: 'What payment methods do you accept?', a: 'We accept bank transfer, Mobile Money (MTN, Telecel, AirtelTigo), and direct debit. Payment terms are Net-15 for Gold tier partners.' },
                        ].map((faq, i) => (
                          <details key={i} className="group rounded-xl border overflow-hidden" style={{ borderColor: theme.border.primary }}>
                            <summary className="flex items-center justify-between p-4 cursor-pointer" style={{ backgroundColor: theme.bg.tertiary }}>
                              <span className="font-medium text-sm" style={{ color: theme.text.primary }}>{faq.q}</span>
                              <ChevronDown size={16} style={{ color: theme.text.muted }} className="group-open:rotate-180 transition-transform" />
                            </summary>
                            <div className="p-4 text-sm" style={{ color: theme.text.secondary }}>{faq.a}</div>
                          </details>
                        ))}
                      </div>
                    </div>

                    {/* Resources */}
                    <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Resources & Documentation</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[{ icon: FileText, label: 'API Documentation', desc: 'Complete REST API reference', color: palette.blue500 }, { icon: FileDown, label: 'CSV Template', desc: 'Bulk upload spreadsheet template', color: palette.emerald500 }, { icon: Cog, label: 'Webhook Guide', desc: 'Set up real-time event notifications', color: palette.violet500 }, { icon: CreditCard, label: 'Billing FAQ', desc: 'Payment methods, invoicing, refunds', color: palette.amber500 }].map(r => (
                          <button key={r.label} onClick={() => addToast({ type: 'info', message: `Opening ${r.label}` })} className="flex items-center gap-4 p-4 rounded-xl border text-left hover:bg-white/5" style={{ borderColor: theme.border.primary }}>
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${r.color}15` }}><r.icon size={20} style={{ color: r.color }} /></div>
                            <div><p className="font-medium text-sm" style={{ color: theme.text.primary }}>{r.label}</p><p className="text-xs" style={{ color: theme.text.muted }}>{r.desc}</p></div>
                            <ChevronRight size={16} style={{ color: theme.text.muted }} className="ml-auto" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Analytics Page */}
            {activeMenu === 'analytics' && (
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Analytics</h1>
                  <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={16} />Export</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <MetricCard title="Total Deliveries" value="12,847" change="15.2%" changeType="up" icon={Package} theme={theme} loading={loading} />
                  <MetricCard title="Avg. Delivery Time" value="2.4 hrs" change="8.5%" changeType="down" icon={Clock} theme={theme} loading={loading} />
                  <MetricCard title="Customer Satisfaction" value="94%" change="2.1%" changeType="up" icon={Award} theme={theme} loading={loading} />
                  <MetricCard title="Active Customers" value="3,456" change="12.8%" changeType="up" icon={Users} theme={theme} loading={loading} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div className="lg:col-span-2 p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Delivery Trends (Monthly)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={terminalData}>
                        <defs>
                          <linearGradient id="gradAnalytics" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={theme.accent.primary} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={theme.accent.primary} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                        <Area type="monotone" dataKey="accra" stroke={theme.accent.primary} fill="url(#gradAnalytics)" strokeWidth={2} name="Accra Mall" />
                        <Area type="monotone" dataKey="achimota" stroke="#3b82f6" fill="transparent" strokeWidth={2} name="Achimota" />
                        <Area type="monotone" dataKey="kotoka" stroke="#10b981" fill="transparent" strokeWidth={2} name="Kotoka T3" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Delivery Methods</h3>
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Warehouse→Locker', value: packagesData.filter(p => p.deliveryMethod === 'warehouse_to_locker').length },
                            { name: 'Dropbox→Locker', value: packagesData.filter(p => p.deliveryMethod === 'dropbox_to_locker').length },
                            { name: 'Locker→Home', value: packagesData.filter(p => p.deliveryMethod === 'locker_to_home').length },
                          ]}
                          cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value"
                        >
                          <Cell fill="#3b82f6" /><Cell fill="#8b5cf6" /><Cell fill="#10b981" />
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="space-y-2 mt-2">
                      {[['Warehouse→Locker', palette.blue500], ['Dropbox→Locker', palette.violet500], ['Locker→Home', palette.emerald500]].map(([l, c]) => (
                        <div key={l} className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c }} />
                          <span style={{ color: theme.text.secondary }}>{l}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Hourly Volume</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                        <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                        <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} />
                        <Bar dataKey="packages" fill={theme.accent.primary} radius={[4, 4, 0, 0]} name="Packages" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>SLA Revenue Breakdown</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={pricingRevenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: theme.text.muted, fontSize: 12 }} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                        <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 12 }} formatter={v => `GH₵ ${v.toLocaleString()}`} />
                        <Area type="monotone" dataKey="standard" stroke="#6b7280" fill="transparent" strokeWidth={2} name="Standard" />
                        <Area type="monotone" dataKey="express" stroke="#f59e0b" fill="transparent" strokeWidth={2} name="Express" />
                        <Area type="monotone" dataKey="rush" stroke="#ef4444" fill="transparent" strokeWidth={2} name="Rush" />
                        <Area type="monotone" dataKey="economy" stroke="#10b981" fill="transparent" strokeWidth={2} name="Economy" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
                      <h3 className="font-semibold" style={{ color: theme.text.primary }}>Terminal Performance</h3>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Terminal</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Lockers</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Utilization</th>
                          <th className="text-left p-3 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {terminalsData.map(t => {
                          const util = Math.round(t.occupied / t.totalLockers * 100);
                          return (
                            <tr key={t.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                              <td className="p-3">
                                <div><span className="text-sm font-medium" style={{ color: theme.text.primary }}>{t.name}</span></div>
                                <span className="text-xs" style={{ color: theme.text.muted }}>{t.location}</span>
                              </td>
                              <td className="p-3"><span className="text-sm" style={{ color: theme.text.primary }}>{t.totalLockers}</span></td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-20 h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                                    <div className="h-full rounded-full" style={{ width: `${util}%`, backgroundColor: util > 80 ? palette.red500 : util > 60 ? palette.amber500 : palette.emerald500 }} />
                                  </div>
                                  <span className="text-xs font-medium" style={{ color: theme.text.secondary }}>{util}%</span>
                                </div>
                              </td>
                              <td className="p-3 hidden md:table-cell"><StatusBadge status={t.status} /></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  <div className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Top Terminals</h3>
                    <div className="space-y-4">
                      {terminalsData.sort((a, b) => b.occupied - a.occupied).slice(0, 5).map((t, i) => (
                        <div key={t.id} className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: i === 0 ? palette.amber500 : i === 1 ? palette.silver : i === 2 ? palette.bronze : theme.border.secondary }}>{i + 1}</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{t.name}</p>
                            <p className="text-xs" style={{ color: theme.text.muted }}>{t.occupied} active &bull; {t.available} open</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
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
                              <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: palette.amber500 }}>GH₵ {(r.basePrice * 1.5).toFixed(2)}</span></td>
                              <td className="p-3 hidden md:table-cell"><span className="text-sm" style={{ color: palette.red500 }}>GH₵ {(r.basePrice * 2.2).toFixed(2)}</span></td>
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
                          <p className="text-2xl font-bold" style={{ color: dm.baseMarkup > 0 ? dm.color : palette.emerald500 }}>+{dm.baseMarkup}%</p>
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
                              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: sc.active ? '#10b98115' : '#ef444415', color: sc.active ? palette.emerald500 : palette.red500 }}>{sc.active ? 'Active' : 'Inactive'}</span>
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
                          <p className="text-3xl font-bold" style={{ color: i === 0 ? theme.text.muted : palette.emerald500 }}>{vt.discount}%</p>
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
                            <p className="text-xl font-bold" style={{ color: palette.emerald500 }}>{pp.volumeDiscount}%</p>
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
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Audit Log</h1>
                    <p style={{ color: theme.text.muted }}>Track all system activities</p>
                  </div>
                  <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}><Download size={16} />Export</button>
                </div>
                <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                        <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>User</th>
                        <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Action</th>
                        <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Timestamp</th>
                        <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>IP Address</th>
                      </tr>
                    </thead>
                    <tbody>
                      {auditLogData.map(log => (
                        <tr key={log.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                          <td className="p-4"><span style={{ color: theme.text.primary }}>{log.user}</span></td>
                          <td className="p-4"><span className="text-sm" style={{ color: theme.text.secondary }}>{log.action}</span></td>
                          <td className="p-4 hidden md:table-cell"><span className="text-sm font-mono" style={{ color: theme.text.muted }}>{log.timestamp}</span></td>
                          <td className="p-4 hidden lg:table-cell"><span className="text-sm font-mono" style={{ color: theme.text.muted }}>{log.ip}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Settings Page */}
            {activeMenu === 'settings' && (
              <div className="p-4 md:p-6">
                <h1 className="text-xl md:text-2xl font-bold mb-6" style={{ color: theme.text.primary }}>Settings</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                  <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="flex items-center gap-3 mb-4">
                      <Sun size={20} style={{ color: theme.accent.primary }} />
                      <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Theme</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <button onClick={() => setThemeName('light')} className="p-4 rounded-xl border-2" style={{ backgroundColor: '#fff', borderColor: themeName === 'light' ? theme.accent.primary : '#e5e5e5' }}>
                        <div className="flex items-center gap-2 mb-2"><Sun size={20} className="text-amber-500" /><span className="font-semibold text-gray-900">Light</span></div>
                        <div className="space-y-1"><div className="h-2 bg-gray-200 rounded" /><div className="h-2 w-3/4 bg-gray-200 rounded" /><div className="h-2 w-1/2 rounded" style={{ backgroundColor: '#4E0F0F40' }} /></div>
                      </button>
                      <button onClick={() => setThemeName('dark')} className="p-4 rounded-xl border-2" style={{ backgroundColor: '#040404', borderColor: themeName === 'dark' ? theme.accent.primary : '#252525' }}>
                        <div className="flex items-center gap-2 mb-2"><Moon size={20} className="text-blue-400" /><span className="font-semibold text-white">Dark</span></div>
                        <div className="space-y-1"><div className="h-2 bg-gray-700 rounded" /><div className="h-2 w-3/4 bg-gray-700 rounded" /><div className="h-2 w-1/2 rounded" style={{ backgroundColor: '#4E0F0F' }} /></div>
                      </button>
                    </div>
                  </div>
                  <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="flex items-center gap-3 mb-4">
                      <Users size={20} style={{ color: theme.accent.primary }} />
                      <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Switch User (Demo)</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
                      {staffData.map(s => (
                        <button key={s.id} onClick={() => { setCurrentUser({ name: s.name, email: s.email, role: s.role }); addToast({ type: 'success', message: `Switched to ${s.name}` }); }} className="p-3 rounded-xl border text-left" style={{ backgroundColor: theme.bg.tertiary, borderColor: currentUser.email === s.email ? theme.accent.primary : theme.border.primary }}>
                          <p className="text-sm" style={{ color: theme.text.primary }}>{s.name}</p>
                          <RoleBadge role={s.role} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="flex items-center gap-3 mb-4">
                      <Bell size={20} style={{ color: theme.accent.primary }} />
                      <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Notifications</h2>
                    </div>
                    <div className="space-y-3">
                      {[
                        ['Email Notifications', 'Receive email for critical alerts', true],
                        ['SMS Alerts', 'SMS for SLA breaches and urgent events', true],
                        ['Push Notifications', 'Browser push for real-time updates', false],
                        ['Weekly Report', 'Summary email every Monday', true],
                      ].map(([label, desc, enabled]) => (
                        <div key={label} className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-sm" style={{ color: theme.text.primary }}>{label}</p>
                            <p className="text-xs" style={{ color: theme.text.muted }}>{desc}</p>
                          </div>
                          <div className="w-10 h-6 rounded-full cursor-pointer flex items-center px-0.5" style={{ backgroundColor: enabled ? palette.emerald500 : theme.border.primary }}>
                            <div className="w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: enabled ? 'translateX(16px)' : 'translateX(0)' }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="flex items-center gap-3 mb-4">
                      <Shield size={20} style={{ color: theme.accent.primary }} />
                      <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Security</h2>
                    </div>
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between py-3 px-4 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                        <div className="flex items-center gap-3">
                          <Lock size={16} style={{ color: theme.text.muted }} />
                          <span style={{ color: theme.text.primary }}>Two-Factor Authentication</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-500">Not Set</span>
                      </button>
                      <button className="w-full flex items-center justify-between py-3 px-4 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                        <div className="flex items-center gap-3">
                          <Key size={16} style={{ color: theme.text.muted }} />
                          <span style={{ color: theme.text.primary }}>Change Password</span>
                        </div>
                        <ChevronRight size={16} style={{ color: theme.text.muted }} />
                      </button>
                      <button className="w-full flex items-center justify-between py-3 px-4 rounded-xl border" style={{ borderColor: theme.border.primary }}>
                        <div className="flex items-center gap-3">
                          <History size={16} style={{ color: theme.text.muted }} />
                          <span style={{ color: theme.text.primary }}>Active Sessions</span>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#10b98115', color: palette.emerald500 }}>1 active</span>
                      </button>
                    </div>
                  </div>
                  <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="flex items-center gap-3 mb-4">
                      <Keyboard size={20} style={{ color: theme.accent.primary }} />
                      <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Keyboard Shortcuts</h2>
                    </div>
                    <button onClick={() => setShowShortcuts(true)} className="w-full py-3 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                      <Keyboard size={16} className="inline mr-2" /> View All Shortcuts
                    </button>
                    <div className="mt-4 space-y-2">
                      {[['Ctrl+K', 'Search'], ['Ctrl+/', 'Shortcuts'], ['Ctrl+E', 'Export']].map(([key, desc]) => (
                        <div key={key} className="flex items-center justify-between">
                          <span className="text-sm" style={{ color: theme.text.secondary }}>{desc}</span>
                          <kbd className="px-2 py-1 text-xs rounded border font-mono" style={{ borderColor: theme.border.primary, color: theme.text.muted }}>{key}</kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="flex items-center gap-3 mb-4">
                      <Info size={20} style={{ color: theme.accent.primary }} />
                      <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>About</h2>
                    </div>
                    <div className="space-y-3">
                      {[
                        ['Application', 'LocQar ERP Admin Portal'],
                        ['Version', '2.1.0'],
                        ['Environment', 'Production'],
                        ['Last Updated', '2024-01-15'],
                        ['Terminals', `${terminalsData.length} active`],
                        ['Staff', `${staffData.length} users`],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between">
                          <span className="text-sm" style={{ color: theme.text.muted }}>{label}</span>
                          <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>

        {/* Modals & Overlays */}
        {selectedPackage && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedPackage(null)} />
            <PackageDetailDrawer pkg={selectedPackage} onClose={() => setSelectedPackage(null)} theme={theme} userRole={currentUser.role} addToast={addToast} />
          </>
        )}

        <GlobalSearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} theme={theme} onNavigate={handleSearchNavigate} />
        <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} theme={theme} />
        <ExportModal isOpen={showExport} onClose={() => setShowExport(false)} onExport={handleExport} dataType={activeMenu} theme={theme} />
        <SessionTimeoutModal isOpen={showSessionWarning} onExtend={() => { setShowSessionWarning(false); setSessionTimeout(60); }} onLogout={() => addToast({ type: 'info', message: 'Logging out...' })} remainingTime={sessionTimeout} theme={theme} />
        
        <BulkActionsBar
          selectedCount={selectedItems.length}
          onClear={() => setSelectedItems([])}
          onAction={handleBulkAction}
          actions={[
            { id: 'dispatch', label: 'Dispatch', icon: Truck, color: palette.blue500 },
            { id: 'print', label: 'Print Labels', icon: Printer, color: palette.emerald500 },
            { id: 'delete', label: 'Delete', icon: Trash2, color: palette.red500 },
          ]}
          theme={theme}
        />

        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </div>
    </ThemeContext.Provider>
  );
}