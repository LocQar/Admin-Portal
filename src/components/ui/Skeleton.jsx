import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

export const Skeleton = ({ className = '', variant = 'text' }) => {
  const { theme } = useTheme();
  const baseClass = "animate-pulse rounded";
  const variants = {
    text: "h-4 w-full",
    title: "h-6 w-3/4",
    avatar: "h-10 w-10 rounded-full",
    button: "h-10 w-24",
    card: "h-32 w-full rounded-xl",
  };

  return (
    <div
      className={`${baseClass} ${variants[variant]} ${className}`}
      style={{ backgroundColor: theme.border.primary }}
    />
  );
};

export const TableSkeleton = ({ rows = 5, cols = 6 }) => {
  const { theme } = useTheme();

  return (
    <div className="animate-pulse">
      {[...Array(rows)].map((_, i) => (
        <div
          key={i}
          className="flex gap-4 p-4"
          style={{ borderBottom: `1px solid ${theme.border.primary}` }}
        >
          {[...Array(cols)].map((_, j) => (
            <div
              key={j}
              className="h-4 rounded flex-1"
              style={{
                backgroundColor: theme.border.primary,
                width: j === 0 ? '20%' : 'auto'
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
