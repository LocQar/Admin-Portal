import React, { useState, useMemo } from 'react';
import { Sun, Moon, Users, Bell, Shield, Keyboard, Info, Lock, Key, History, ChevronRight, Database, Trash2, Download, RefreshCw, Eye, EyeOff, Copy, Plus, Edit, X, Check } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { RoleBadge } from '../components/ui/Badge';
import { Checkbox } from '../components/ui/Checkbox';
import { staffData, terminalsData } from '../constants/mockData';
import { ROLES, MENU_GROUPS, hasPermission, PRESET_COLORS, resolveRole } from '../constants';

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
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: false,
    weekly: true,
  });
  const [visibleKeys, setVisibleKeys] = useState({});

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
        <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
        </div>

        {/* Switch User (Demo) */}
        <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
        </div>

        {/* ===== ROLES & ACCESS ===== */}
        <div className="rounded-2xl border p-6 md:col-span-2" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Shield size={20} style={{ color: theme.accent.primary }} />
              <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Roles & Access</h2>
            </div>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
              style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}
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
                          <button onClick={() => deleteRole(role)} className="p-1.5 rounded-lg hover:bg-white/5" style={{ color: '#ef4444' }}>
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
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold" style={{ backgroundColor: resolved?.color || '#6b7280' }}>
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
                    style={{ backgroundColor: theme.bg.input || theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}
                  >
                    {allRoleOptions.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
                  style={{ backgroundColor: notifications[key] ? '#10b981' : theme.border.primary }}
                >
                  <div
                    className="w-5 h-5 rounded-full bg-white transition-transform"
                    style={{ transform: notifications[key] ? 'translateX(16px)' : 'translateX(0)' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="flex items-center gap-3 mb-4">
            <Shield size={20} style={{ color: theme.accent.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Security</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => addToast({ type: 'info', message: '2FA setup dialog opened' })}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl border"
              style={{ borderColor: theme.border.primary }}
            >
              <div className="flex items-center gap-3">
                <Lock size={16} style={{ color: theme.icon.muted }} />
                <span style={{ color: theme.text.primary }}>Two-Factor Authentication</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-500">Not Set</span>
            </button>
            <button
              onClick={() => addToast({ type: 'info', message: 'Password change form opened' })}
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
              onClick={() => addToast({ type: 'info', message: 'Active sessions: 1 (current browser)' })}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl border"
              style={{ borderColor: theme.border.primary }}
            >
              <div className="flex items-center gap-3">
                <History size={16} style={{ color: theme.icon.muted }} />
                <span style={{ color: theme.text.primary }}>Active Sessions</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                1 active
              </span>
            </button>
          </div>
        </div>

        {/* API Keys */}
        <div className="rounded-2xl border p-6 md:col-span-2" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Key size={20} style={{ color: theme.accent.primary }} />
              <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>API Keys</h2>
            </div>
            <button
              onClick={() => addToast({ type: 'success', message: 'New API key generated' })}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
              style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}
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
                      backgroundColor: k.status === 'active' ? '#10b98115' : '#ef444415',
                      color: k.status === 'active' ? '#10b981' : '#ef4444'
                    }}>{k.status}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono" style={{ color: theme.text.secondary }}>
                      {visibleKeys[k.id] ? k.key.replace('****', 'x7k2') : k.key}
                    </code>
                    <button onClick={() => setVisibleKeys(prev => ({ ...prev, [k.id]: !prev[k.id] }))} className="p-1" style={{ color: theme.text.muted }}>
                      {visibleKeys[k.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button onClick={() => addToast({ type: 'success', message: 'Key copied to clipboard' })} className="p-1" style={{ color: theme.text.muted }}>
                      <Copy size={14} />
                    </button>
                  </div>
                  <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Created: {k.created} &bull; Last used: {k.lastUsed}</p>
                </div>
                {k.status === 'active' && (
                  <button
                    onClick={() => addToast({ type: 'warning', message: `Key "${k.name}" revoked` })}
                    className="px-3 py-1.5 rounded-lg text-xs"
                    style={{ backgroundColor: '#ef444415', color: '#ef4444' }}
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="flex items-center gap-3 mb-4">
            <Database size={20} style={{ color: theme.accent.primary }} />
            <h2 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Data Management</h2>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => addToast({ type: 'success', message: 'Exporting all data...' })}
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
              onClick={() => addToast({ type: 'info', message: 'Cache cleared successfully' })}
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
              onClick={() => addToast({ type: 'warning', message: 'This action requires confirmation' })}
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl border"
              style={{ borderColor: theme.border.primary }}
            >
              <div className="flex items-center gap-3">
                <Trash2 size={16} style={{ color: '#ef4444' }} />
                <div className="text-left">
                  <span className="text-sm block" style={{ color: '#ef4444' }}>Purge Expired Data</span>
                  <span className="text-xs" style={{ color: theme.text.muted }}>Remove records older than 90 days</span>
                </div>
              </div>
              <ChevronRight size={16} style={{ color: theme.icon.muted }} />
            </button>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
        </div>

        {/* About */}
        <div className="rounded-2xl border p-6 md:col-span-2" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
        </div>
      </div>

      {/* Create/Edit Role Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={closeModal}>
          <div className="absolute inset-0 bg-black/50" />
          <div
            className="relative w-full max-w-lg rounded-2xl border p-6 max-h-[80vh] overflow-y-auto mx-4"
            style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}
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
                style={{ backgroundColor: theme.bg.input || theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}
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
                    {roleColor === c && <Check size={14} className="text-white" />}
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
                className="flex-1 py-2.5 rounded-xl border text-sm"
                style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
              >
                Cancel
              </button>
              <button
                onClick={saveRole}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium"
                style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}
              >
                {editingRole ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
