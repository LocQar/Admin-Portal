import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const MetricCard = ({ title, value, change, changeType, icon: Icon, subtitle, loading }) => {
  const { theme } = useTheme();

  return (
    <div
      className="rounded-2xl p-5 border"
      style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}
    >
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
            {change && (
              <p className={`text-sm mt-1 flex items-center ${changeType === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                {changeType === 'up' ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                {change}
              </p>
            )}
            {subtitle && <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{subtitle}</p>}
          </div>
          <div className="p-3 rounded-xl" style={{ backgroundColor: theme.accent.light }}>
            <Icon size={24} style={{ color: theme.accent.primary }} />
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
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border relative ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'} transition-all`}
      style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}
    >
      {badge && (
        <span
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs text-white flex items-center justify-center"
          style={{ backgroundColor: theme.accent.primary }}
        >
          {badge}
        </span>
      )}
      <div className="p-3 rounded-lg" style={{ backgroundColor: theme.accent.light }}>
        <Icon size={20} style={{ color: theme.accent.primary }} />
      </div>
      <span className="text-xs" style={{ color: theme.text.secondary }}>{label}</span>
    </button>
  );
};
