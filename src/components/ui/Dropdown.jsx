import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const Dropdown = ({
  value,
  onChange,
  options = [],
  placeholder = 'Select...',
  disabled = false,
  className = '',
}) => {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl border text-sm transition-colors ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        style={{
          backgroundColor: theme.bg.tertiary,
          borderColor: isOpen ? theme.accent.primary : theme.border.primary,
          color: selected ? theme.text.primary : theme.text.muted,
        }}
      >
        <span className="flex items-center gap-2 truncate">
          {selected?.icon && <selected.icon size={14} />}
          {selected?.label || placeholder}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          style={{ color: theme.text.muted }}
        />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full rounded-xl border shadow-lg overflow-hidden"
          style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}
        >
          <div className="max-h-48 overflow-y-auto py-1">
            {options.map(option => (
              <button
                key={option.value}
                type="button"
                onClick={() => { onChange(option.value); setIsOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors hover:bg-white/5"
                style={{ color: option.value === value ? theme.accent.primary : theme.text.primary }}
              >
                {option.icon && <option.icon size={14} />}
                <span className="flex-1 truncate">{option.label}</span>
                {option.value === value && (
                  <Check size={14} style={{ color: theme.accent.primary }} />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
