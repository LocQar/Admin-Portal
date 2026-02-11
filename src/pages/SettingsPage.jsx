import React from 'react';
import { Sun, Moon, Users, Bell, Shield, Keyboard, Info, Lock, Key, History, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { RoleBadge } from '../components/ui/Badge';
import { staffData, terminalsData } from '../constants/mockData';

export const SettingsPage = ({ themeName, setThemeName, currentUser, setCurrentUser, setShowShortcuts, addToast }) => {
  const { theme } = useTheme();

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
            {staffData.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentUser({ name: s.name, email: s.email, role: s.role });
                  addToast({ type: 'success', message: `Switched to ${s.name}` });
                }}
                className="p-3 rounded-xl border text-left"
                style={{
                  backgroundColor: theme.bg.tertiary,
                  borderColor: currentUser.email === s.email ? theme.accent.primary : theme.border.primary
                }}
              >
                <p className="text-sm" style={{ color: theme.text.primary }}>{s.name}</p>
                <RoleBadge role={s.role} />
              </button>
            ))}
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
                <div
                  className="w-10 h-6 rounded-full cursor-pointer flex items-center px-0.5"
                  style={{ backgroundColor: enabled ? '#10b981' : theme.border.primary }}
                >
                  <div
                    className="w-5 h-5 rounded-full bg-white transition-transform"
                    style={{ transform: enabled ? 'translateX(16px)' : 'translateX(0)' }}
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
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl border"
              style={{ borderColor: theme.border.primary }}
            >
              <div className="flex items-center gap-3">
                <Lock size={16} style={{ color: theme.text.muted }} />
                <span style={{ color: theme.text.primary }}>Two-Factor Authentication</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-amber-500/10 text-amber-500">Not Set</span>
            </button>
            <button
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl border"
              style={{ borderColor: theme.border.primary }}
            >
              <div className="flex items-center gap-3">
                <Key size={16} style={{ color: theme.text.muted }} />
                <span style={{ color: theme.text.primary }}>Change Password</span>
              </div>
              <ChevronRight size={16} style={{ color: theme.text.muted }} />
            </button>
            <button
              className="w-full flex items-center justify-between py-3 px-4 rounded-xl border"
              style={{ borderColor: theme.border.primary }}
            >
              <div className="flex items-center gap-3">
                <History size={16} style={{ color: theme.text.muted }} />
                <span style={{ color: theme.text.primary }}>Active Sessions</span>
              </div>
              <span className="text-xs px-2 py-1 rounded-full" style={{ backgroundColor: '#10b98115', color: '#10b981' }}>
                1 active
              </span>
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
  );
};
