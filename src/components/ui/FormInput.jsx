import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const FormInput = ({
  label,
  value,
  onChange,
  placeholder,
  icon: Icon,
  error,
  helperText,
  type = 'text',
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <div>
      {label && (
        <label className="text-xs font-semibold mb-1.5 block" style={{ color: theme.text.secondary }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: focused ? theme.accent.primary : theme.text.muted, transition: 'color 0.15s' }}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-9' : 'px-3'} pr-3 py-2.5 rounded-xl border text-sm transition-all duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{
            backgroundColor: theme.bg.input || theme.bg.tertiary,
            borderColor: error ? theme.status.error : focused ? theme.accent.primary : theme.border.primary,
            color: theme.text.primary,
            boxShadow: focused && !error ? `0 0 0 3px ${theme.accent.primary}18` : 'none',
            outline: 'none',
          }}
        />
      </div>
      {(error || helperText) && (
        <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: error ? theme.status.error : theme.text.muted }}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

export const FormTextarea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  error,
  helperText,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <div>
      {label && (
        <label className="text-xs font-semibold mb-1.5 block" style={{ color: theme.text.secondary }}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full px-3 py-2.5 rounded-xl border text-sm resize-none transition-all duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
          backgroundColor: theme.bg.input || theme.bg.tertiary,
          borderColor: error ? theme.status.error : focused ? theme.accent.primary : theme.border.primary,
          color: theme.text.primary,
          boxShadow: focused && !error ? `0 0 0 3px ${theme.accent.primary}18` : 'none',
          outline: 'none',
        }}
      />
      {(error || helperText) && (
        <p className="text-xs mt-1.5" style={{ color: error ? theme.status.error : theme.text.muted }}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

