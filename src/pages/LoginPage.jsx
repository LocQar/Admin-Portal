import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ChevronRight, Sun, Moon, Shield, Users, Truck, Headphones, BarChart2, UserCircle, Building2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

// Demo users for each role
export const MOCK_USERS = [
  { id: 1, name: 'John Doe',        email: 'john@locqar.com',   password: 'admin123',    role: 'SUPER_ADMIN', avatar: 'J', phone: null },
  { id: 2, name: 'Sarah Amponsah',  email: 'sarah@locqar.com',  password: 'manager123',  role: 'MANAGER',     avatar: 'S', phone: null },
  { id: 3, name: 'Kwesi Asante',    email: 'kwesi@locqar.com',  password: 'agent123',    role: 'AGENT',       avatar: 'K', phone: null },
  { id: 4, name: 'Ama Serwaa',      email: 'ama@locqar.com',    password: 'support123',  role: 'SUPPORT',     avatar: 'A', phone: null },
  { id: 5, name: 'Joe Doe',         email: 'joe@email.com',              password: 'joe123',      role: 'CUSTOMER',    type: 'individual', avatar: 'J', phone: '+233551399333' },
  { id: 6, name: 'Kwame Asante',    email: 'kwame@email.com',            password: 'kwame123',    role: 'CUSTOMER',    type: 'individual', avatar: 'K', phone: '+233551234001' },
  { id: 7, name: 'Jane Doe',        email: 'jane@email.com',             password: 'jane123',     role: 'CUSTOMER',    type: 'individual', avatar: 'J', phone: '+233557821456' },
  { id: 8, name: 'Jumia Ghana',     email: 'logistics@jumia.com.gh',     password: 'jumia123',    role: 'CUSTOMER',    type: 'b2b',        avatar: 'J', phone: '+233302123456' },
  { id: 9, name: 'Melcom Ltd',      email: 'shipping@melcom.com',        password: 'melcom123',   role: 'CUSTOMER',    type: 'b2b',        avatar: 'M', phone: '+233302654321' },
];

const ROLE_META = {
  SUPER_ADMIN: { label: 'Super Admin',     color: '#7EA8C9', icon: Shield,      desc: 'Full system access' },
  MANAGER:     { label: 'Branch Manager',  color: '#81C995', icon: BarChart2,   desc: 'Operations & reports' },
  AGENT:       { label: 'Field Agent',     color: '#B5A0D1', icon: Truck,       desc: 'Dispatch & scanning' },
  SUPPORT:     { label: 'Support',         color: '#D48E8A', icon: Headphones,  desc: 'Customer tickets' },
  CUSTOMER:    { label: 'Customer',        color: '#D4AA5A', icon: UserCircle,  desc: 'Self-service portal' },
  B2B:         { label: 'B2B Customer',    color: '#818CF8', icon: Building2,   desc: 'Business shipments' },
};

const QUICK_LOGINS = [
  MOCK_USERS[0], // Super Admin
  MOCK_USERS[1], // Manager
  MOCK_USERS[2], // Agent
  MOCK_USERS[3], // Support
  MOCK_USERS[4], // Individual Customer
  MOCK_USERS[7], // B2B Customer
];

export const LoginPage = ({ onLogin, themeName, setThemeName }) => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const attempt = (e) => {
    e?.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const user = MOCK_USERS.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid email or password.');
        setLoading(false);
      }
    }, 600);
  };

  const quickLogin = (user) => {
    setLoading(true);
    setTimeout(() => onLogin(user), 400);
  };

  const is = {
    background: 'transparent',
    borderColor: error ? '#D48E8A' : theme.border.primary,
    color: theme.text.primary,
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: theme.bg.primary, fontFamily: theme.font?.primary || 'inherit' }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden" style={{ background: `linear-gradient(135deg, #2B2B3B 0%, #1C1C2E 100%)` }}>
        {/* Background grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="relative">
          <span className="text-2xl font-black text-white tracking-tight">LocQar</span>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>Smart Locker Network</p>
        </div>

        <div className="relative space-y-6">
          <div>
            <h1 className="text-4xl font-black text-white leading-tight">
              One platform.<br />
              Every delivery.
            </h1>
            <p className="mt-4 text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Manage your entire locker network — terminals, packages, couriers, and customers — from a single dashboard.
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2">
            {['Real-time tracking', 'Role-based access', 'Smart dispatch', 'Customer portal'].map(f => (
              <span key={f} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>{f}</span>
            ))}
          </div>

          {/* Role access indicators */}
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(ROLE_META).map(([key, meta]) => {
              const Icon = meta.icon;
              return (
                <div key={key} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${meta.color}20` }}>
                    <Icon size={15} style={{ color: meta.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{meta.label}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{meta.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="relative text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>© 2026 LocQar Technologies</p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        {/* Mobile logo */}
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <span className="text-xl font-black" style={{ color: theme.text.primary }}>LocQar</span>
        </div>

        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: theme.text.primary }}>Sign in</h2>
              <p className="text-sm mt-1" style={{ color: theme.text.muted }}>Access your portal</p>
            </div>
            <button
              onClick={() => setThemeName(t => t === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl border"
              style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}
            >
              {themeName === 'dark' ? <Sun size={16} style={{ color: theme.icon.primary }} /> : <Moon size={16} style={{ color: theme.icon.primary }} />}
            </button>
          </div>

          {/* Login form */}
          <form onSubmit={attempt} className="space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none"
                  style={is}
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase block mb-1.5" style={{ color: theme.text.muted }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none"
                  style={is}
                />
                <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }}>
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl" style={{ backgroundColor: '#D48E8A15', border: '1px solid #D48E8A40' }}>
                <span className="text-sm" style={{ color: '#D48E8A' }}>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              style={{ background: loading ? theme.bg.tertiary : 'linear-gradient(135deg, #7EA8C9, #818CF8)', color: loading ? theme.text.muted : '#fff', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? 'Signing in…' : <><span>Sign in</span><ChevronRight size={16} /></>}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px" style={{ backgroundColor: theme.border.primary }} />
            <span className="text-xs" style={{ color: theme.text.muted }}>Or sign in as</span>
            <div className="flex-1 h-px" style={{ backgroundColor: theme.border.primary }} />
          </div>

          {/* Quick login buttons */}
          <div className="space-y-2">
            {QUICK_LOGINS.map(user => {
              const isB2B = user.type === 'b2b';
              const meta = isB2B ? ROLE_META.B2B : ROLE_META[user.role];
              const Icon = meta?.icon || UserCircle;
              return (
                <button
                  key={user.id}
                  onClick={() => quickLogin(user)}
                  disabled={loading}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border text-left hover:bg-white/5 transition-colors"
                  style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${meta?.color}20` }}>
                    <Icon size={15} style={{ color: meta?.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{user.name}</p>
                      {isB2B && <span className="text-xs px-1.5 py-0.5 rounded font-semibold" style={{ backgroundColor: '#818CF820', color: '#818CF8' }}>B2B</span>}
                    </div>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{meta?.label} · {user.email}</p>
                  </div>
                  <ChevronRight size={14} style={{ color: theme.text.muted }} />
                </button>
              );
            })}
          </div>

          {/* Demo hint */}
          <p className="text-center text-xs mt-6" style={{ color: theme.text.muted }}>
            Demo environment — credentials shown on each button
          </p>
        </div>
      </div>
    </div>
  );
};
