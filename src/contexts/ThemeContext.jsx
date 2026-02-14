import React, { createContext, useContext, useState } from 'react';

// ============ THEMES ============
export const themes = {
  dark: {
    name: 'dark',
    bg: {
      primary: '#111827',
      secondary: '#1F2937',
      tertiary: '#374151',
      card: '#1F2937',
      hover: '#374151'
    },
    border: {
      primary: 'rgba(255,255,255,0.06)',
      secondary: 'rgba(255,255,255,0.10)',
      focus: '#FFFFFF'
    },
    text: {
      primary: '#F9FAFB',
      secondary: '#9CA3AF',
      muted: '#6B7280'
    },
    accent: {
      primary: '#FFFFFF',
      secondary: '#D1D5DB',
      light: 'rgba(255,255,255,0.08)',
      border: 'rgba(255,255,255,0.20)',
      contrast: '#111827'
    },
    font: {
      primary: "'Sora', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace"
    },
    icon: {
      primary: '#FFFFFF',
      muted: '#9CA3AF'
    },
    status: {
      success: '#4ADE80',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA'
    }
  },
  light: {
    name: 'light',
    bg: {
      primary: '#FAFAFA',
      secondary: '#FFFFFF',
      tertiary: '#F3F4F6',
      card: '#FFFFFF',
      hover: '#E5E7EB'
    },
    border: {
      primary: 'rgba(0,0,0,0.06)',
      secondary: 'rgba(0,0,0,0.08)',
      focus: '#111827'
    },
    text: {
      primary: '#1F2937',
      secondary: '#4B5563',
      muted: '#9CA3AF'
    },
    accent: {
      primary: '#111827',
      secondary: '#374151',
      light: 'rgba(17,24,39,0.06)',
      border: 'rgba(17,24,39,0.15)',
      contrast: '#FFFFFF'
    },
    font: {
      primary: "'Sora', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace"
    },
    icon: {
      primary: '#111827',
      muted: '#6B7280'
    },
    status: {
      success: '#4ADE80',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA'
    }
  }
};

// ============ THEME CONTEXT ============
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('dark');
  const theme = themes[themeName];

  const toggleTheme = () => {
    setThemeName(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, setThemeName, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export default ThemeContext;
