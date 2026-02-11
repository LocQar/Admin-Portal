import React from 'react';
import { Package } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';

export const EmptyState = ({ icon: Icon = Package, title, description, action }) => {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4"
        style={{ backgroundColor: theme.accent.light }}
      >
        <Icon size={40} style={{ color: theme.accent.primary }} />
      </div>
      <h3 className="text-lg font-semibold mb-2" style={{ color: theme.text.primary }}>
        {title}
      </h3>
      <p className="text-sm text-center max-w-md mb-6" style={{ color: theme.text.muted }}>
        {description}
      </p>
      {action && (
        <button
          className="px-4 py-2 rounded-xl text-white text-sm"
          style={{ backgroundColor: theme.accent.primary }}
        >
          {action}
        </button>
      )}
    </div>
  );
};
