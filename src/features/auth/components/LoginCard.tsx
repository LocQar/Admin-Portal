import { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ChevronRight,
  Sun,
  Moon,
  Shield,
  Truck,
  Headphones,
  BarChart2,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  credentialsLoginSchema,
  type CredentialsLoginInput,
} from '../schemas';
import { useLoginWithCredentials } from '../hooks/useAuth';
import { errorMessage } from '@/shared/api/errors';
import { useTheme } from '@/contexts/ThemeContext';

const ROLE_BLURBS = [
  { label: 'Staff Admin', color: '#7EA8C9', icon: Shield, desc: 'Full system access' },
  { label: 'Operations', color: '#81C995', icon: BarChart2, desc: 'Lockers & dispatch' },
  { label: 'Field Agent', color: '#B5A0D1', icon: Truck, desc: 'Pickup & delivery' },
  { label: 'Support', color: '#D48E8A', icon: Headphones, desc: 'Customer tickets' },
];

export function LoginCard() {
  const { theme, themeName, setThemeName } = useTheme();

  const [showPwd, setShowPwd] = useState(false);
  const login = useLoginWithCredentials();
  const loading = login.isPending;

  const form = useForm<CredentialsLoginInput>({
    resolver: zodResolver(credentialsLoginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await login.mutateAsync(values);
    } catch (err) {
      form.setError('root', { message: errorMessage(err) });
    }
  });

  const inputStyle = {
    background: 'transparent',
    borderColor: form.formState.errors.root ? '#D48E8A' : theme.border.primary,
    color: theme.text.primary,
  };

  return (
    <div
      className="min-h-screen flex"
      style={{
        backgroundColor: theme.bg.primary,
        fontFamily: theme.font?.primary || 'inherit',
      }}
    >
      {/* Left panel — branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2B2B3B 0%, #0A0A0A 100%)' }}
      >
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="relative">
          <span className="text-2xl font-black text-white tracking-tight">LocQar</span>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Smart Locker Network — Staff Portal
          </p>
        </div>

        <div className="relative space-y-6">
          <div>
            <h1 className="text-4xl font-black text-white leading-tight">
              One platform.
              <br />
              Every delivery.
            </h1>
            <p
              className="mt-4 text-base leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Manage your entire locker network — terminals, orders, drop-offs and pickups — from a single dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {['Real-time tracking', 'Drop-off / pickup audit', 'Manual override', 'Order recording'].map(
              (f) => (
                <span
                  key={f}
                  className="px-3 py-1.5 rounded-full text-xs font-medium"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.7)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {f}
                </span>
              ),
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {ROLE_BLURBS.map((meta) => {
              const Icon = meta.icon;
              return (
                <div
                  key={meta.label}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `${meta.color}20` }}
                  >
                    <Icon size={15} style={{ color: meta.color }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{meta.label}</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {meta.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <p className="relative text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
          © 2026 LocQar Technologies
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="flex items-center gap-2 mb-8 lg:hidden">
          <span className="text-xl font-black" style={{ color: theme.text.primary }}>
            LocQar
          </span>
        </div>

        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold" style={{ color: theme.text.primary }}>
                Staff Sign in
              </h2>
              <p className="text-sm mt-1" style={{ color: theme.text.muted }}>
                Internal access only
              </p>
            </div>
            <button
              type="button"
              onClick={() => setThemeName((t) => (t === 'dark' ? 'light' : 'dark'))}
              className="p-2.5 rounded-xl border"
              style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}
            >
              {themeName === 'dark' ? (
                <Sun size={16} style={{ color: theme.icon.primary }} />
              ) : (
                <Moon size={16} style={{ color: theme.icon.primary }} />
              )}
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label
                className="text-xs font-semibold uppercase block mb-1.5"
                style={{ color: theme.text.muted }}
              >
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: theme.icon.muted }}
                />
                <input
                  type="email"
                  {...form.register('email')}
                  placeholder="you@locqar.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                  autoFocus
                />
              </div>
              {form.formState.errors.email && (
                <p className="mt-1 text-xs" style={{ color: '#D48E8A' }}>
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="text-xs font-semibold uppercase block mb-1.5"
                style={{ color: theme.text.muted }}
              >
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: theme.icon.muted }}
                />
                <input
                  type={showPwd ? 'text' : 'password'}
                  {...form.register('password')}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border text-sm outline-none"
                  style={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: theme.icon.muted }}
                >
                  {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.formState.errors.password && (
                <p className="mt-1 text-xs" style={{ color: '#D48E8A' }}>
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            {form.formState.errors.root && (
              <div
                className="flex items-center gap-2 p-3 rounded-xl"
                style={{ backgroundColor: '#D48E8A15', border: '1px solid #D48E8A40' }}
              >
                <span className="text-sm" style={{ color: '#D48E8A' }}>
                  {form.formState.errors.root.message}
                </span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
              style={{
                background: loading ? theme.bg.tertiary : 'linear-gradient(135deg, #7EA8C9, #818CF8)',
                color: loading ? theme.text.muted : '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? (
                'Signing in…'
              ) : (
                <>
                  <span>Sign in</span>
                  <ChevronRight size={16} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs mt-6" style={{ color: theme.text.muted }}>
            Need access? Ask an admin to provision your account via{' '}
            <code className="px-1 py-0.5 rounded text-[10px]" style={{ backgroundColor: theme.bg.tertiary }}>
              npm run create:admin
            </code>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
