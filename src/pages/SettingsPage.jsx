import React, { useState, useMemo, useCallback } from 'react';
import { Sun, Moon, Users, Bell, Shield, Keyboard, Info, Lock, Key, History, ChevronRight, Database, Trash2, Download, RefreshCw, Eye, EyeOff, Copy, Plus, Edit, X, Check, Monitor, Smartphone, Tablet, Coins } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { GlassCard } from '../components/ui/Card';
import { RoleBadge } from '../components/ui/Badge';
import { Checkbox } from '../components/ui/Checkbox';
import { staffData, terminalsData } from '../constants/mockData';
import { ROLES, MENU_GROUPS, hasPermission, PRESET_COLORS, resolveRole, CURRENCIES, getCurrency, setCurrency as saveCurrency } from '../constants';

const SESSIONS_DATA = [
  { id: 1, device: 'Windows Desktop', browser: 'Chrome 120', ip: '192.168.1.45', lastActive: 'Now', location: 'Accra, Ghana', current: true },
  { id: 2, device: 'iPhone 15', browser: 'Safari 17', ip: '10.0.0.12', lastActive: '2 hours ago', location: 'Accra, Ghana', current: false },
  { id: 3, device: 'MacBook Pro', browser: 'Firefox 121', ip: '172.16.0.8', lastActive: '1 day ago', location: 'Kumasi, Ghana', current: false },
  { id: 4, device: 'Android Tablet', browser: 'Chrome 119', ip: '192.168.2.100', lastActive: '3 days ago', location: 'Tema, Ghana', current: false },
];

const API_KEYS_DATA = [
  { id: 1, name: 'Production Key', key: 'lq_admin_prod_****a1b2', created: '2024-01-15', lastUsed: '2 min ago', status: 'active' },
  { id: 2, name: 'Staging Key', key: 'lq_admin_stg_****c3d4', created: '2023-11-20', lastUsed: '3 days ago', status: 'active' },
  { id: 3, name: 'Old Production', key: 'lq_admin_old_****e5f6', created: '2023-06-01', lastUsed: '2 months ago', status: 'revoked' },
];

const PERMISSION_PAGES = MENU_GROUPS.flatMap(group =>
  group.items.map(item => ({ permission: item.permission, label: item.label, group: group.label }))
);

export const SettingsPage = ({ themeName, setThemeName, currentUser, setCurrentUser, setShowShortcuts, addToast, customRoles = [], setCustomRoles }) => {
  const { theme } = useTheme();
  const [activeCurrency, setActiveCurrency] = useState(getCurrency().code);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    weekly: true,
  });
  const [visibleKeys, setVisibleKeys] = useState({});

  // 2FA modal state
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFACode, setTwoFACode] = useState('');
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);
  const recoveryCodes = useMemo(() => ['A1B2-C3D4', 'E5F6-G7H8', 'I9J0-K1L2', 'M3N4-O5P6', 'Q7R8-S9T0', 'U1V2-W3X4', 'Y5Z6-A7B8', 'C9D0-E1F2'], []);

  // Change password modal state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Active sessions modal state
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const [sessions, setSessions] = useState(SESSIONS_DATA);

  // Generate API Key modal state
  const [showGenerateKeyModal, setShowGenerateKeyModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyPermissions, setNewKeyPermissions] = useState({ read: true, write: false, admin: false });
  const [newKeyExpiry, setNewKeyExpiry] = useState('90d');
  const [generatedKey, setGeneratedKey] = useState('');

  // Revoke key modal state
  const [showRevokeKeyModal, setShowRevokeKeyModal] = useState(false);
  const [revokingKey, setRevokingKey] = useState(null);

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('JSON');
  const [exportScope, setExportScope] = useState({ packages: true, customers: true, lockers: true, transactions: true });
  const [exportProgress, setExportProgress] = useState(0);
  const [exporting, setExporting] = useState(false);

  // Clear cache modal state
  const [showClearCacheModal, setShowClearCacheModal] = useState(false);

  // Purge modal state
  const [showPurgeModal, setShowPurgeModal] = useState(false);
  const [purgeStep, setPurgeStep] = useState(1);
  const [purgeConfirmText, setPurgeConfirmText] = useState('');

  // Password strength calculator
  const getPasswordStrength = useCallback((pw) => {
    if (!pw) return { level: 0, label: '', color: 'transparent' };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: 1, label: 'Weak', color: '#ef4444' };
    if (score <= 2) return { level: 2, label: 'Fair', color: '#f97316' };
    if (score <= 3) return { level: 3, label: 'Good', color: '#eab308' };
    if (score <= 4) return { level: 4, label: 'Strong', color: '#22c55e' };
    return { level: 5, label: 'Excellent', color: '#10b981' };
  }, []);

  // Fake UUID generator
  const generateUUID = () => {
    return 'lq_' + 'xxxx-xxxx-xxxx-xxxx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
  };

  // Role modal state
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [roleColor, setRoleColor] = useState('#ec4899');
  const [rolePermissions, setRolePermissions] = useState([]);
  const [staffRoleOverrides, setStaffRoleOverrides] = useState({});

  const toggleNotification = (key) => {
    setNotifications(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      addToast({ type: 'success', message: `${key.charAt(0).toUpperCase() + key.slice(1)} notifications ${newState[key] ? 'enabled' : 'disabled'}` });
      return newState;
    });
  };

  // Roles & Access helpers
  const getAccessiblePages = (roleKey) => {
    return PERMISSION_PAGES.filter(p => hasPermission(roleKey, p.permission, customRoles));
  };

  const getStaffCount = (roleKey) => {
    return staffData.filter(s => {
      const effective = staffRoleOverrides[s.email] || s.role;
      return effective === roleKey;
    }).length;
  };

  const openCreateModal = () => {
    setEditingRole(null);
    setRoleName('');
    setRoleColor('#ec4899');
    setRolePermissions([]);
    setShowRoleModal(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleColor(role.color);
    setRolePermissions([...role.permissions]);
    setShowRoleModal(true);
  };

  const closeModal = () => {
    setShowRoleModal(false);
    setEditingRole(null);
  };

  const togglePermission = (permission) => {
    setRolePermissions(prev =>
      prev.includes(permission) ? prev.filter(p => p !== permission) : [...prev, permission]
    );
  };

  const saveRole = () => {
    if (!roleName.trim()) {
      addToast({ type: 'error', message: 'Role name is required' });
      return;
    }
    if (rolePermissions.length === 0) {
      addToast({ type: 'error', message: 'Select at least one page permission' });
      return;
    }
    const key = editingRole
      ? editingRole.key
      : 'CUSTOM_' + roleName.trim().toUpperCase().replace(/\s+/g, '_');

    if (!editingRole && (customRoles.some(r => r.key === key) || ROLES[key])) {
      addToast({ type: 'error', message: 'A role with this name already exists' });
      return;
    }

    const roleObj = {
      id: key.toLowerCase(),
      key,
      name: roleName.trim(),
      level: 20,
      color: roleColor,
      permissions: rolePermissions,
      isCustom: true,
      createdAt: editingRole?.createdAt || new Date().toISOString(),
    };

    if (editingRole) {
      setCustomRoles(prev => prev.map(r => r.key === key ? roleObj : r));
      addToast({ type: 'success', message: `Role "${roleName}" updated` });
    } else {
      setCustomRoles(prev => [...prev, roleObj]);
      addToast({ type: 'success', message: `Role "${roleName}" created` });
    }
    closeModal();
  };

  const deleteRole = (role) => {
    setCustomRoles(prev => prev.filter(r => r.key !== role.key));
    setStaffRoleOverrides(prev => {
      const next = { ...prev };
      Object.entries(next).forEach(([email, r]) => {
        if (r === role.key) delete next[email];
      });
      return next;
    });
    addToast({ type: 'success', message: `Role "${role.name}" deleted` });
  };

  const allRoleOptions = useMemo(() => [
    ...Object.entries(ROLES).map(([k, v]) => ({ value: k, label: v.name })),
    ...customRoles.map(r => ({ value: r.key, label: r.name })),
  ], [customRoles]);

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-6" style={{ color: theme.text.primary }}>
        Settings
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        {/* Theme Settings */}
        <GlassCard noPadding className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Sun size={20} style={{ color: theme.accent.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Theme</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setThemeName('light')}
              className="p-4 rounded-xl border-2"
              style={{
                backgroundColor: '#fff',
                borderColor: themeName === 'light' ? theme.accent.primary : '#e5e5e5'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Sun size={20} className="text-amber-500" />
                <span className="font-semibold text-gray-900">Light</span>
              </div>
              <div className="space-y-1">
                <div className="h-2 bg-gray-200 rounded" />
                <div className="h-2 w-3/4 bg-gray-200 rounded" />
                <div className="h-2 w-1/2 rounded" style={{ backgroundColor: '#4E0F0F40' }} />
              </div>
            </button>
            <button
              onClick={() => setThemeName('dark')}
              className="p-4 rounded-xl border-2"
              style={{
                backgroundColor: '#040404',
                borderColor: themeName === 'dark' ? theme.accent.primary : '#252525'
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Moon size={20} className="text-blue-400" />
                <span className="font-semibold text-white">Dark</span>
              </div>
              <div className="space-y-1">
                <div className="h-2 bg-gray-700 rounded" />
                <div className="h-2 w-3/4 bg-gray-700 rounded" />
                <div className="h-2 w-1/2 rounded" style={{ backgroundColor: '#4E0F0F' }} />
              </div>
            </button>
          </div>
        </GlassCard>

        {/* Currency */}
        <GlassCard noPadding className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Coins size={20} style={{ color: theme.accent.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Currency</h2>
          </div>
          <p className="text-sm mb-3" style={{ color: theme.text.muted }}>Choose the currency displayed across the portal for revenue, pricing, and invoices.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {Object.values(CURRENCIES).map(cur => (
              <button
                key={cur.code}
                onClick={() => { setActiveCurrency(cur.code); saveCurrency(cur.code); addToast({ type: 'success', message: `Currency set to ${cur.name} (${cur.symbol})` }); }}
                className="flex items-center gap-2 p-3 rounded-xl border text-left transition-all"
                style={{
                  backgroundColor: activeCurrency === cur.code ? theme.accent.light : 'transparent',
                  borderColor: activeCurrency === cur.code ? theme.accent.primary : theme.border.primary,
                  color: activeCurrency === cur.code ? theme.text.primary : theme.text.secondary,
                }}
              >
                <span className="text-lg font-bold" style={{ color: activeCurrency === cur.code ? theme.accent.primary : theme.text.muted }}>{cur.symbol}</span>
                <div>
                  <p className="text-sm font-medium">{cur.code}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{cur.name}</p>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        {/* Switch User (Demo) */}
        <GlassCard noPadding className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users size={20} style={{ color: theme.accent.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Switch User (Demo)</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
            {staffData.map(s => {
              const effectiveRole = staffRoleOverrides[s.email] || s.role;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setCurrentUser({ name: s.name, email: s.email, role: effectiveRole });
                    addToast({ type: 'success', message: `Switched to ${s.name} (${resolveRole(effectiveRole, customRoles)?.name || effectiveRole})` });
                  }}
                  className="p-3 rounded-xl border text-left"
                  style={{
                    backgroundColor: theme.bg.tertiary,
                    borderColor: currentUser.email === s.email ? theme.accent.primary : theme.border.primary
                  }}
                >
                  <p className="text-sm" style={{ color: theme.text.primary }}>{s.name}</p>
                  <RoleBadge role={effectiveRole} customRoles={customRoles} />
                </button>
              );
            })}
          </div>
        </GlassCard>

        {/* ===== ROLES & ACCESS ===== */}
        <GlassCard noPadding className="p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield size={20} style={{ color: theme.accent.primary }} />
              <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Roles & Access</h2>
            </div>
            <button
              onClick={openCreateModal}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            >
              <Plus size={16} />Create Template
            </button>
          </div>

          {/* Built-In Roles */}
          <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Built-in Roles</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {Object.entries(ROLES).map(([key, role]) => {
              const pages = getAccessiblePages(key);
              const count = getStaffCount(key);
              return (
                <div key={key} className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                      <span className="font-medium text-sm" style={{ color: theme.text.primary }}>{role.name}</span>
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${role.color}15`, color: role.color }}>Lv.{role.level}</span>
                    </div>
                    <Lock size={14} style={{ color: theme.icon.muted }} />
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {role.permissions.includes('*') ? (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${role.color}10`, color: role.color }}>All Pages</span>
                    ) : pages.map(p => (
                      <span key={p.label} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${role.color}10`, color: role.color }}>{p.label}</span>
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{count} staff assigned</p>
                </div>
              );
            })}
          </div>

          {/* Custom Roles */}
          {customRoles.length > 0 && (
            <>
              <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Custom Templates</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {customRoles.map(role => {
                  const pages = getAccessiblePages(role.key);
                  const count = getStaffCount(role.key);
                  return (
                    <div key={role.key} className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                          <span className="font-medium text-sm" style={{ color: theme.text.primary }}>{role.name}</span>
                          <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: `${role.color}15`, color: role.color }}>Custom</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEditModal(role)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.text.muted }}>
                            <Edit size={14} />
                          </button>
                          <button onClick={() => deleteRole(role)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: theme.status.error }}>
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {pages.length > 0 ? pages.map(p => (
                          <span key={p.label} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${role.color}10`, color: role.color }}>{p.label}</span>
                        )) : (
                          <span className="text-xs" style={{ color: theme.text.muted }}>No pages assigned</span>
                        )}
                      </div>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{count} staff assigned</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Staff Assignment */}
          <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Staff Assignment</p>
          <div className="space-y-2 max-h-72 overflow-y-auto">
            {staffData.map(s => {
              const effectiveRole = staffRoleOverrides[s.email] || s.role;
              const resolved = resolveRole(effectiveRole, customRoles);
              return (
                <div key={s.id} className="flex items-center justify-between p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: resolved?.color || '#78716C', color: '#1C1917' }}>
                      {s.name.charAt(0)}
                    </div>
                    <div>
                      <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{s.name}</span>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{s.email}</p>
                    </div>
                  </div>
                  <select
                    value={effectiveRole}
                    onChange={(e) => {
                      const newRole = e.target.value;
                      setStaffRoleOverrides(prev => ({ ...prev, [s.email]: newRole }));
                      const roleName = resolveRole(newRole, customRoles)?.name || newRole;
                      addToast({ type: 'success', message: `${s.name} assigned to ${roleName}` });
                    }}
                    className="px-3 py-1.5 rounded-lg border text-xs"
                    style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
                  >
                    {allRoleOptions.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Notifications */}
        <GlassCard noPadding className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell size={20} style={{ color: theme.accent.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Notifications</h2>
          </div>
          <div className="space-y-3">
            {[
              ['email', 'Email Notifications', 'Receive email for critical alerts'],
              ['sms', 'SMS Alerts', 'SMS for SLA breaches and urgent events'],
              ['push', 'Push Notifications', 'Browser push for real-time updates'],
              ['weekly', 'Weekly Report', 'Summary email every Monday'],
            ].map(([key, label, desc]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm" style={{ color: theme.text.primary }}>{label}</p>
                  <p className="text-xs" style={{ color: theme.text.muted }}>{desc}</p>
                </div>
                <div
                  onClick={() => toggleNotification(key)}
                  className="w-10 h-6 rounded-full cursor-pointer flex items-center px-0.5 transition-colors"
                  style={{ backgroundColor: notifications[key] ? theme.status.success : theme.border.primary }}
                >
                  <div
                    className="w-5 h-5 rounded-full bg-white transition-transform"
                    style={{ transform: notifications[key] ? 'translateX(16px)' : 'translateX(0)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Security */}
        <GlassCard noPadding className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} style={{ color: theme.accent.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Security</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setShow2FAModal(true)}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl border"
              style={{ borderColor: theme.border.primary }}
            >
              <div className="flex items-center gap-3">
                <Lock size={16} style={{ color: theme.icon.muted }} />
                <span style={{ color: theme.text.primary }}>Two-Factor Authentication</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{
                backgroundColor: twoFAEnabled ? `${theme.status.success}15` : 'rgb(245 158 11 / 0.1)',
                color: twoFAEnabled ? theme.status.success : '#f59e0b'
              }}>{twoFAEnabled ? 'Enabled' : 'Not Set'}</span>
            </button>
            <button
              onClick={() => { setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); setShowPasswordModal(true); }}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl border"
              style={{ borderColor: theme.border.primary }}
            >
              <div className="flex items-center gap-3">
                <Key size={16} style={{ color: theme.icon.muted }} />
                <span style={{ color: theme.text.primary }}>Change Password</span>
              </div>
              <ChevronRight size={16} style={{ color: theme.icon.muted }} />
            </button>
            <button
              onClick={() => setShowSessionsModal(true)}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl border"
              style={{ borderColor: theme.border.primary }}
            >
              <div className="flex items-center gap-3">
                <History size={16} style={{ color: theme.icon.muted }} />
                <span style={{ color: theme.text.primary }}>Active Sessions</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: `${theme.status.success}15`, color: theme.status.success }}>
                {sessions.length} active
              </span>
            </button>
          </div>
        </GlassCard>

        {/* API Keys */}
        <GlassCard noPadding className="p-6 md:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Key size={20} style={{ color: theme.accent.primary }} />
              <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>API Keys</h2>
            </div>
            <button
              onClick={() => { setNewKeyName(''); setNewKeyPermissions({ read: true, write: false, admin: false }); setNewKeyExpiry('90d'); setGeneratedKey(''); setShowGenerateKeyModal(true); }}
              className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
            >
              <Plus size={16} />Generate Key
            </button>
          </div>
          <div className="space-y-3">
            {API_KEYS_DATA.map(k => (
              <div key={k.id} className="flex flex-col md:flex-row md:items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm" style={{ color: theme.text.primary }}>{k.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{
                      backgroundColor: k.status === 'active' ? `${theme.status.success}15` : `${theme.status.error}15`,
                      color: k.status === 'active' ? theme.status.success : theme.status.error
                    }}>{k.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono" style={{ color: theme.text.secondary }}>
                      {visibleKeys[k.id] ? k.key.replace('****', 'x7k2') : k.key}
                    </code>
                    <button onClick={() => setVisibleKeys(prev => ({ ...prev, [k.id]: !prev[k.id] }))} className="p-1" style={{ color: theme.text.muted }}>
                      {visibleKeys[k.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => {
                      const fullKey = visibleKeys[k.id] ? k.key.replace('****', 'x7k2') : k.key;
                      navigator.clipboard.writeText(fullKey).then(() => addToast({ type: 'success', message: 'Key copied to clipboard' })).catch(() => addToast({ type: 'error', message: 'Failed to copy key' }));
                    }} className="p-1" style={{ color: theme.text.muted }}>
                      <Copy size={14} />
                    </button>
                  </div>
                  <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Created: {k.created} &bull; Last used: {k.lastUsed}</p>
                </div>
                {k.status === 'active' && (
                  <button
                    onClick={() => { setRevokingKey(k); setShowRevokeKeyModal(true); }}
                    className="px-3 py-1.5 rounded-lg text-xs"
                    style={{ backgroundColor: `${theme.status.error}15`, color: theme.status.error }}
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Data Management */}
        <GlassCard noPadding className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Database size={20} style={{ color: theme.accent.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Data Management</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => { setExportFormat('JSON'); setExportScope({ packages: true, customers: true, lockers: true, transactions: true }); setExportProgress(0); setExporting(false); setShowExportModal(true); }}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl border"
              style={{ borderColor: theme.border.primary }}
            >
              <div className="flex items-center gap-3">
                <Download size={16} style={{ color: theme.icon.muted }} />
                <div className="text-left">
                  <span className="text-sm block" style={{ color: theme.text.primary }}>Export All Data</span>
                  <span className="text-xs" style={{ color: theme.text.muted }}>Download packages, customers, and transactions</span>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: theme.icon.muted }} />
            </button>
            <button
              onClick={() => setShowClearCacheModal(true)}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl border"
              style={{ borderColor: theme.border.primary }}
            >
              <div className="flex items-center gap-3">
                <RefreshCw size={16} style={{ color: theme.icon.muted }} />
                <div className="text-left">
                  <span className="text-sm block" style={{ color: theme.text.primary }}>Clear Cache</span>
                  <span className="text-xs" style={{ color: theme.text.muted }}>Reset cached data and refresh from server</span>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: theme.icon.muted }} />
            </button>
            <button
              onClick={() => { setPurgeStep(1); setPurgeConfirmText(''); setShowPurgeModal(true); }}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl border"
              style={{ borderColor: theme.border.primary }}
            >
              <div className="flex items-center gap-3">
                <Trash2 size={16} style={{ color: theme.status.error }} />
                <div className="text-left">
                  <span className="text-sm block" style={{ color: theme.status.error }}>Purge Expired Data</span>
                  <span className="text-xs" style={{ color: theme.text.muted }}>Remove records older than 90 days</span>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: theme.icon.muted }} />
            </button>
          </div>
        </GlassCard>

        {/* Keyboard Shortcuts */}
        <GlassCard noPadding className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Keyboard size={20} style={{ color: theme.accent.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setShowShortcuts(true)}
            className="w-full py-3 rounded-xl border text-sm"
            style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
          >
            <Keyboard size={16} className="inline mr-2" /> View All Shortcuts
          </button>
          <div className="mt-4 space-y-2">
            {[['Ctrl+K', 'Search'], ['Ctrl+/', 'Shortcuts'], ['Ctrl+E', 'Export']].map(([key, desc]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm" style={{ color: theme.text.secondary }}>{desc}</span>
                <kbd
                  className="px-2 py-1 text-xs rounded border font-mono"
                  style={{ borderColor: theme.border.primary, color: theme.text.muted }}
                >
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* About */}
        <GlassCard noPadding className="p-6 md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Info size={20} style={{ color: theme.accent.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>About</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-3">
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
        </GlassCard>
      </div>

      {/* Create/Edit Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/50" />
          <GlassCard
            noPadding
            className="relative w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto mx-4"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={closeModal} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: theme.text.muted }}>
              <X size={16} />
            </button>

            <h3 className="text-lg font-semibold mb-5" style={{ color: theme.text.primary }}>
              {editingRole ? 'Edit Role Template' : 'Create Role Template'}
            </h3>

            {/* Role Name */}
            <div className="mb-4">
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Role Name</label>
              <input
                type="text"
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
                placeholder="e.g. Business Owner"
                className="w-full px-4 py-2.5 rounded-xl border text-sm"
                style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
              />
            </div>

            {/* Color Picker */}
            <div className="mb-5">
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Color</label>
              <div className="flex gap-2 flex-wrap">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c}
                    onClick={() => setRoleColor(c)}
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110"
                    style={{ backgroundColor: c, borderColor: roleColor === c ? '#fff' : 'transparent' }}
                  >
                    {roleColor === c && <Check size={14} style={{ color: '#1C1917' }} />}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Permissions */}
            <div className="mb-2">
              <label className="text-xs font-medium mb-3 block" style={{ color: theme.text.secondary }}>Page Access</label>
              {MENU_GROUPS.map(group => (
                <div key={group.label} className="mb-4">
                  <p className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>{group.label}</p>
                  <div className="space-y-2">
                    {group.items.map(item => {
                      const isChecked = rolePermissions.includes(item.permission);
                      const sharedPages = PERMISSION_PAGES.filter(p => p.permission === item.permission && p.label !== item.label);
                      return (
                        <div key={item.id}>
                          <label className="flex items-center gap-3 cursor-pointer py-1">
                            <Checkbox checked={isChecked} onChange={() => togglePermission(item.permission)} />
                            <span className="text-sm" style={{ color: theme.text.primary }}>{item.label}</span>
                          </label>
                          {isChecked && sharedPages.length > 0 && (
                            <p className="text-xs ml-9 -mt-0.5 mb-1" style={{ color: theme.text.muted }}>
                              Also enables: {sharedPages.map(p => p.label).join(', ')}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
              <button
                onClick={closeModal}
                className="btn-outline flex-1 py-2.5 rounded-xl text-sm"
              >
                Cancel
              </button>
              <button
                onClick={saveRole}
                className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-medium"
              >
                {editingRole ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShow2FAModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <GlassCard noPadding className="relative w-full max-w-md p-6 mx-4 rounded-2xl border" style={{ borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShow2FAModal(false)} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: theme.text.muted }}><X size={16} /></button>
            <h3 className="text-lg font-semibold mb-5" style={{ color: theme.text.primary }}>Two-Factor Authentication</h3>

            {/* QR Code Placeholder */}
            <div className="w-48 h-48 mx-auto mb-4 rounded-xl border-2 border-dashed flex items-center justify-center" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.tertiary }}>
              <div className="text-center">
                <Shield size={32} style={{ color: theme.text.muted }} className="mx-auto mb-2" />
                <p className="text-xs" style={{ color: theme.text.muted }}>Scan with authenticator app</p>
              </div>
            </div>

            {/* Verification Code Input */}
            <div className="mb-4">
              <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Verification Code</label>
              <input
                type="text"
                maxLength={6}
                value={twoFACode}
                onChange={e => setTwoFACode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-2.5 rounded-xl border text-sm text-center tracking-[0.5em] font-mono"
                style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
              />
            </div>

            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between mb-4 p-3 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
              <span className="text-sm" style={{ color: theme.text.primary }}>
                {twoFAEnabled ? '2FA is enabled' : '2FA is disabled'}
              </span>
              <div
                onClick={() => {
                  if (!twoFAEnabled && twoFACode.length !== 6) {
                    addToast({ type: 'error', message: 'Enter a 6-digit verification code' });
                    return;
                  }
                  setTwoFAEnabled(!twoFAEnabled);
                  addToast({ type: 'success', message: twoFAEnabled ? '2FA disabled' : '2FA enabled successfully' });
                }}
                className="w-10 h-6 rounded-full cursor-pointer flex items-center px-0.5 transition-colors"
                style={{ backgroundColor: twoFAEnabled ? theme.status.success : theme.border.primary }}
              >
                <div className="w-5 h-5 rounded-full bg-white transition-transform" style={{ transform: twoFAEnabled ? 'translateX(16px)' : 'translateX(0)' }} />
              </div>
            </div>

            {/* Recovery Codes */}
            <button
              onClick={() => setShowRecoveryCodes(!showRecoveryCodes)}
              className="w-full text-left text-sm mb-2 flex items-center gap-2"
              style={{ color: theme.accent.primary }}
            >
              <Key size={14} />
              {showRecoveryCodes ? 'Hide' : 'Show'} Recovery Codes
            </button>
            {showRecoveryCodes && (
              <div className="p-3 rounded-xl border mb-4 grid grid-cols-2 gap-2" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}>
                {recoveryCodes.map((code, i) => (
                  <code key={i} className="text-xs font-mono text-center py-1 rounded" style={{ color: theme.text.secondary, backgroundColor: theme.bg.input }}>{code}</code>
                ))}
              </div>
            )}

            <div className="flex gap-3 mt-4 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
              <button onClick={() => setShow2FAModal(false)} className="btn-outline flex-1 py-2.5 rounded-xl text-sm">Close</button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowPasswordModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <GlassCard noPadding className="relative w-full max-w-md p-6 mx-4 rounded-2xl border" style={{ borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowPasswordModal(false)} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: theme.text.muted }}><X size={16} /></button>
            <h3 className="text-lg font-semibold mb-5" style={{ color: theme.text.primary }}>Change Password</h3>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Current Password</label>
                <input type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} placeholder="Enter current password"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>New Password</label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
                {/* Strength Indicator */}
                {newPassword && (() => {
                  const strength = getPasswordStrength(newPassword);
                  return (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map(i => (
                          <div key={i} className="h-1.5 flex-1 rounded-full transition-colors" style={{ backgroundColor: i <= strength.level ? strength.color : theme.border.primary }} />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: strength.color }}>{strength.label}</p>
                    </div>
                  );
                })()}
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
                {confirmPassword && newPassword !== confirmPassword && (
                  <p className="text-xs mt-1" style={{ color: theme.status.error }}>Passwords do not match</p>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
              <button onClick={() => setShowPasswordModal(false)} className="btn-outline flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={() => {
                if (!currentPassword) { addToast({ type: 'error', message: 'Enter your current password' }); return; }
                if (!newPassword || newPassword.length < 8) { addToast({ type: 'error', message: 'New password must be at least 8 characters' }); return; }
                if (newPassword !== confirmPassword) { addToast({ type: 'error', message: 'Passwords do not match' }); return; }
                setShowPasswordModal(false);
                addToast({ type: 'success', message: 'Password changed successfully' });
              }} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-medium">Change Password</button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Active Sessions Modal */}
      {showSessionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowSessionsModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <GlassCard noPadding className="relative w-full max-w-2xl p-6 mx-4 rounded-2xl border max-h-[80vh] overflow-y-auto" style={{ borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowSessionsModal(false)} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: theme.text.muted }}><X size={16} /></button>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Active Sessions</h3>
              <button onClick={() => {
                setSessions(prev => prev.filter(s => s.current));
                addToast({ type: 'success', message: 'All other sessions revoked' });
              }} className="px-3 py-1.5 rounded-lg text-xs" style={{ backgroundColor: `${theme.status.error}15`, color: theme.status.error }}>
                Revoke All Others
              </button>
            </div>

            <div className="space-y-3">
              {sessions.map(s => (
                <div key={s.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                  <div className="flex-shrink-0">
                    {s.device.includes('iPhone') || s.device.includes('Android') ? (
                      s.device.includes('Tablet') ? <Tablet size={24} style={{ color: theme.text.muted }} /> : <Smartphone size={24} style={{ color: theme.text.muted }} />
                    ) : (
                      <Monitor size={24} style={{ color: theme.text.muted }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{s.device}</span>
                      {s.current && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${theme.status.success}15`, color: theme.status.success }}>Current</span>}
                    </div>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{s.browser} &bull; {s.ip}</p>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{s.location} &bull; {s.lastActive}</p>
                  </div>
                  {!s.current && (
                    <button onClick={() => {
                      setSessions(prev => prev.filter(sess => sess.id !== s.id));
                      addToast({ type: 'success', message: `Session on ${s.device} revoked` });
                    }} className="px-3 py-1.5 rounded-lg text-xs flex-shrink-0" style={{ backgroundColor: `${theme.status.error}15`, color: theme.status.error }}>
                      Revoke
                    </button>
                  )}
                </div>
              ))}
              {sessions.length === 0 && (
                <p className="text-sm text-center py-4" style={{ color: theme.text.muted }}>No active sessions</p>
              )}
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
              <button onClick={() => setShowSessionsModal(false)} className="btn-outline flex-1 py-2.5 rounded-xl text-sm">Close</button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Generate API Key Modal */}
      {showGenerateKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowGenerateKeyModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <GlassCard noPadding className="relative w-full max-w-md p-6 mx-4 rounded-2xl border" style={{ borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowGenerateKeyModal(false)} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: theme.text.muted }}><X size={16} /></button>
            <h3 className="text-lg font-semibold mb-5" style={{ color: theme.text.primary }}>Generate API Key</h3>

            {!generatedKey ? (
              <>
                <div className="mb-4">
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Key Name</label>
                  <input type="text" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} placeholder="e.g. Production API Key"
                    className="w-full px-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
                </div>

                <div className="mb-4">
                  <label className="text-xs font-medium mb-2 block" style={{ color: theme.text.secondary }}>Permissions</label>
                  <div className="space-y-2">
                    {['read', 'write', 'admin'].map(perm => (
                      <label key={perm} className="flex items-center gap-3 cursor-pointer">
                        <Checkbox checked={newKeyPermissions[perm]} onChange={() => setNewKeyPermissions(prev => ({ ...prev, [perm]: !prev[perm] }))} />
                        <span className="text-sm capitalize" style={{ color: theme.text.primary }}>{perm}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>Expiry</label>
                  <select value={newKeyExpiry} onChange={e => setNewKeyExpiry(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}>
                    <option value="30d">30 days</option>
                    <option value="90d">90 days</option>
                    <option value="1y">1 year</option>
                    <option value="never">Never</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
                  <button onClick={() => setShowGenerateKeyModal(false)} className="btn-outline flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
                  <button onClick={() => {
                    if (!newKeyName.trim()) { addToast({ type: 'error', message: 'Key name is required' }); return; }
                    if (!Object.values(newKeyPermissions).some(Boolean)) { addToast({ type: 'error', message: 'Select at least one permission' }); return; }
                    setGeneratedKey(generateUUID());
                  }} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-medium">Generate</button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm mb-3" style={{ color: theme.text.secondary }}>Your new API key has been generated. Copy it now -- you won't be able to see it again.</p>
                <div className="relative p-4 rounded-xl border font-mono text-sm break-all" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.status.success }}>
                  {generatedKey}
                  <button onClick={() => {
                    navigator.clipboard.writeText(generatedKey).then(() => addToast({ type: 'success', message: 'API key copied to clipboard' })).catch(() => addToast({ type: 'error', message: 'Failed to copy' }));
                  }} className="absolute top-2 right-2 p-1.5 rounded-lg" style={{ color: theme.text.muted, backgroundColor: theme.bg.input }}>
                    <Copy size={14} />
                  </button>
                </div>
                <div className="flex gap-3 mt-6 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
                  <button onClick={() => { setShowGenerateKeyModal(false); addToast({ type: 'success', message: `API key "${newKeyName}" created` }); }} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-medium">Done</button>
                </div>
              </>
            )}
          </GlassCard>
        </div>
      )}

      {/* Revoke Key Confirmation Modal */}
      {showRevokeKeyModal && revokingKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowRevokeKeyModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <GlassCard noPadding className="relative w-full max-w-sm p-6 mx-4 rounded-2xl border" style={{ borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-3" style={{ color: theme.text.primary }}>Revoke API Key</h3>
            <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>
              Revoke API key '{revokingKey.name}'? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowRevokeKeyModal(false)} className="btn-outline flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={() => {
                setShowRevokeKeyModal(false);
                addToast({ type: 'warning', message: `Key "${revokingKey.name}" revoked` });
              }} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: theme.status.error }}>Confirm Revoke</button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Export Data Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowExportModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <GlassCard noPadding className="relative w-full max-w-md p-6 mx-4 rounded-2xl border" style={{ borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowExportModal(false)} className="absolute top-4 right-4 p-1 rounded-lg" style={{ color: theme.text.muted }}><X size={16} /></button>
            <h3 className="text-lg font-semibold mb-5" style={{ color: theme.text.primary }}>Export Data</h3>

            <div className="mb-4">
              <label className="text-xs font-medium mb-2 block" style={{ color: theme.text.secondary }}>Format</label>
              <div className="flex gap-2">
                {['JSON', 'CSV'].map(fmt => (
                  <button key={fmt} onClick={() => setExportFormat(fmt)}
                    className="px-4 py-2 rounded-xl border text-sm font-medium"
                    style={{
                      backgroundColor: exportFormat === fmt ? theme.accent.primary : 'transparent',
                      borderColor: exportFormat === fmt ? theme.accent.primary : theme.border.primary,
                      color: exportFormat === fmt ? '#fff' : theme.text.primary
                    }}>{fmt}</button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-medium mb-2 block" style={{ color: theme.text.secondary }}>Data Scope</label>
              <div className="space-y-2">
                {Object.entries({ packages: 'Packages', customers: 'Customers', lockers: 'Lockers', transactions: 'Transactions' }).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 cursor-pointer">
                    <Checkbox checked={exportScope[key]} onChange={() => setExportScope(prev => ({ ...prev, [key]: !prev[key] }))} />
                    <span className="text-sm" style={{ color: theme.text.primary }}>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            {exporting && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: theme.text.muted }}>Exporting...</span>
                  <span className="text-xs font-mono" style={{ color: theme.text.muted }}>{exportProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full" style={{ backgroundColor: theme.border.primary }}>
                  <div className="h-full rounded-full transition-all duration-300" style={{ width: `${exportProgress}%`, backgroundColor: theme.accent.primary }} />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-4 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
              <button onClick={() => setShowExportModal(false)} className="btn-outline flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
              <button
                disabled={exporting || !Object.values(exportScope).some(Boolean)}
                onClick={() => {
                  setExporting(true);
                  setExportProgress(0);
                  let progress = 0;
                  const interval = setInterval(() => {
                    progress += Math.random() * 20 + 5;
                    if (progress >= 100) {
                      progress = 100;
                      clearInterval(interval);
                      setTimeout(() => {
                        setShowExportModal(false);
                        setExporting(false);
                        addToast({ type: 'success', message: `Data exported as ${exportFormat}` });
                      }, 500);
                    }
                    setExportProgress(Math.min(Math.round(progress), 100));
                  }, 300);
                }}
                className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50"
              >
                {exporting ? 'Exporting...' : 'Download'}
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Clear Cache Confirmation Modal */}
      {showClearCacheModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowClearCacheModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <GlassCard noPadding className="relative w-full max-w-sm p-6 mx-4 rounded-2xl border" style={{ borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-3" style={{ color: theme.text.primary }}>Clear Cache</h3>
            <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>
              Clear all cached data? The app may be slower temporarily.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowClearCacheModal(false)} className="btn-outline flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
              <button onClick={() => {
                setShowClearCacheModal(false);
                addToast({ type: 'success', message: 'Cache cleared successfully' });
              }} className="btn-primary flex-1 py-2.5 rounded-xl text-sm font-medium">Confirm</button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Purge Expired Data Two-Step Modal */}
      {showPurgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowPurgeModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <GlassCard noPadding className="relative w-full max-w-sm p-6 mx-4 rounded-2xl border" style={{ borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
            {purgeStep === 1 ? (
              <>
                <h3 className="text-lg font-semibold mb-3" style={{ color: theme.text.primary }}>Purge Expired Data</h3>
                <p className="text-sm mb-6" style={{ color: theme.text.secondary }}>
                  Purge all expired data older than 30 days? This action is irreversible.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setShowPurgeModal(false)} className="btn-outline flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
                  <button onClick={() => setPurgeStep(2)} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: theme.status.error }}>Continue</button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-3" style={{ color: theme.text.primary }}>Confirm Purge</h3>
                <p className="text-sm mb-4" style={{ color: theme.text.secondary }}>
                  Type <strong style={{ color: theme.status.error }}>PURGE</strong> to confirm this action.
                </p>
                <input
                  type="text"
                  value={purgeConfirmText}
                  onChange={e => setPurgeConfirmText(e.target.value)}
                  placeholder="Type PURGE"
                  className="w-full px-4 py-2.5 rounded-xl border text-sm mb-4 font-mono"
                  style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
                />
                <div className="flex gap-3">
                  <button onClick={() => setShowPurgeModal(false)} className="btn-outline flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
                  <button
                    disabled={purgeConfirmText !== 'PURGE'}
                    onClick={() => {
                      setShowPurgeModal(false);
                      addToast({ type: 'success', message: 'Expired data purged successfully' });
                    }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white disabled:opacity-40"
                    style={{ backgroundColor: theme.status.error }}
                  >Purge Data</button>
                </div>
              </>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
};
