import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const MetricCard = ({ title, value, change, changeType, icon: Icon, subtitle, loading }) => {
  const { theme } = useTheme();
  const isUp = changeType === 'up';

  return (
    <div
      className="rounded-2xl p-5 border relative overflow-hidden group transition-all duration-200 cursor-default"
      style={{
        backgroundColor: theme.bg.card,
        borderColor: theme.border.primary,
        boxShadow: theme.name === 'light'
          ? '0 1px 3px rgba(0,0,0,0.08), 0 10px 24px rgba(0,0,0,0.06)'
          : '0 1px 0 rgba(255,255,255,0.03), 0 10px 24px rgba(0,0,0,0.10)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = theme.accent.border;
        e.currentTarget.style.boxShadow = `0 0 0 1px ${theme.accent.border}, 0 14px 34px rgba(0,0,0,0.12)`;
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = theme.border.primary;
        e.currentTarget.style.boxShadow = theme.name === 'light'
          ? '0 1px 3px rgba(0,0,0,0.08), 0 10px 24px rgba(0,0,0,0.06)'
          : '0 1px 0 rgba(255,255,255,0.03), 0 10px 24px rgba(0,0,0,0.10)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Subtle top accent bar for positive metrics */}
      {change && isUp && (
        <div
          className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
          style={{ background: `linear-gradient(90deg, ${theme.accent.primary}90, transparent)` }}
        />
      )}
      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 w-20 rounded mb-3" style={{ backgroundColor: theme.border.primary }} />
          <div className="h-8 w-24 rounded mb-2" style={{ backgroundColor: theme.border.primary }} />
          <div className="h-3 w-16 rounded" style={{ backgroundColor: theme.border.primary }} />
        </div>
      ) : (
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: theme.text.muted }}>{title}</p>
            <p className="text-2xl font-bold leading-none" style={{ color: theme.text.primary }}>{value}</p>
            {change && (
              <p className="text-xs mt-2 flex items-center gap-0.5 font-medium" style={{ color: isUp ? theme.status.success : theme.status.error }}>
                {isUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                {change} vs last week
              </p>
            )}
            {subtitle && <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{subtitle}</p>}
          </div>
          <div
            className="p-2.5 rounded-xl shrink-0 transition-all duration-200"
            style={{
              background: `linear-gradient(135deg, ${theme.accent.primary}28, ${theme.accent.primary}10)`,
              border: `1px solid ${theme.accent.border}`,
            }}
          >
            <Icon size={20} style={{ color: theme.accent.primary }} />
          </div>
        </div>
      )}
    </div>
  );
};

export const QuickAction = ({ icon: Icon, label, disabled, onClick, badge }) => {
  const { theme } = useTheme();

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-3 rounded-xl border relative transition-all duration-200 ${disabled
        ? 'opacity-40 cursor-not-allowed'
        : 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0'
        }`}
      style={{
        backgroundColor: theme.bg.card,
        borderColor: theme.border.primary,
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.currentTarget.style.borderColor = theme.accent.border;
          e.currentTarget.style.backgroundColor = theme.accent.light;
          e.currentTarget.style.boxShadow = `0 4px 12px rgba(0,0,0,0.12)`;
        }
      }}
      onMouseLeave={e => {
        if (!disabled) {
          e.currentTarget.style.borderColor = theme.border.primary;
          e.currentTarget.style.backgroundColor = theme.bg.card;
          e.currentTarget.style.boxShadow = 'none';
        }
      }}
    >
      {badge && (
        <span
          className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 rounded-full text-xs flex items-center justify-center font-semibold px-1"
          style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}
        >
          {badge}
        </span>
      )}
      <div
        className="p-2.5 rounded-lg"
        style={{
          background: `linear-gradient(135deg, ${theme.accent.primary}22, ${theme.accent.primary}0a)`,
          border: `1px solid ${theme.accent.border}`,
        }}
      >
        <Icon size={18} style={{ color: theme.accent.primary }} />
      </div>
      <span className="text-xs font-medium leading-tight text-center" style={{ color: theme.text.secondary }}>{label}</span>
    </button>
  );
};

