import React from 'react';
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

  return (
    <div>
      {label && (
        <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: theme.text.muted }}
          />
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-10' : 'px-3'} pr-3 py-2.5 rounded-xl border text-sm transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          style={{
            backgroundColor: theme.bg.input || theme.bg.tertiary,
            borderColor: error ? '#ef4444' : theme.border.primary,
            color: theme.text.primary,
          }}
        />
      </div>
      {(error || helperText) && (
        <p className="text-xs mt-1" style={{ color: error ? '#ef4444' : theme.text.muted }}>
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

  return (
    <div>
      {label && (
        <label className="text-xs font-medium mb-1.5 block" style={{ color: theme.text.secondary }}>
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        className={`w-full px-3 py-2.5 rounded-xl border text-sm resize-none transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        style={{
          backgroundColor: theme.bg.input || theme.bg.tertiary,
          borderColor: error ? '#ef4444' : theme.border.primary,
          color: theme.text.primary,
        }}
      />
      {(error || helperText) && (
        <p className="text-xs mt-1" style={{ color: error ? '#ef4444' : theme.text.muted }}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};
