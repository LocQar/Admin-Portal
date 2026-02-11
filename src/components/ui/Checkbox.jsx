import React from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const Checkbox = ({ checked, onChange }) => {
  const { theme } = useTheme();

  return (
    <button
      onClick={onChange}
      className="w-5 h-5 rounded border-2 flex items-center justify-center transition-colors"
      style={{
        backgroundColor: checked ? theme.accent.primary : 'transparent',
        borderColor: checked ? theme.accent.primary : theme.border.secondary
      }}
    >
      {checked && <Check size={12} className="text-white" />}
    </button>
  );
};
