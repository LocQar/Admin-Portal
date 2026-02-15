import React, { createContext, useContext, useState } from 'react';

// ============ THEMES ============
export const themes = {
  dark: {
    name: 'dark',
    bg: {
      primary: '#1A1614',
      secondary: '#231F1C',
      tertiary: '#2E2926',
      card: '#231F1C',
      hover: '#2E2926'
    },
    border: {
      primary: 'rgba(245,240,235,0.06)',
      secondary: 'rgba(245,240,235,0.10)',
      focus: '#F5F0EB'
    },
    text: {
      primary: '#F5F0EB',
      secondary: '#A8A29E',
      muted: '#78716C'
    },
    accent: {
      primary: '#F5F0EB',
      secondary: '#D6D3D1',
      light: 'rgba(245,240,235,0.08)',
      border: 'rgba(245,240,235,0.20)',
      contrast: '#1C1917'
    },
    font: {
      primary: "'Sora', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace"
    },
    icon: {
      primary: '#F5F0EB',
      muted: '#A8A29E'
    },
    status: {
      success: '#81C995',
      warning: '#D4AA5A',
      error: '#D48E8A',
      info: '#7EA8C9'
    },
    chart: {
      green: '#4CAF82',
      blue: '#5B9BD5',
      amber: '#E4A63A',
      coral: '#D97066',
      violet: '#9B7FD4',
      teal: '#4DB8A4',
      stone: '#8C857E',
      series: ['#5B9BD5', '#4CAF82', '#E4A63A', '#D97066', '#9B7FD4', '#4DB8A4', '#8C857E']
    }
  },
  light: {
    name: 'light',
    bg: {
      primary: '#F9F7F4',
      secondary: '#FFFFFF',
      tertiary: '#F3F0EC',
      card: '#FFFFFF',
      hover: '#EBE7E2'
    },
    border: {
      primary: 'rgba(28,25,23,0.06)',
      secondary: 'rgba(28,25,23,0.08)',
      focus: '#1C1917'
    },
    text: {
      primary: '#1C1917',
      secondary: '#57534E',
      muted: '#A8A29E'
    },
    accent: {
      primary: '#1C1917',
      secondary: '#44403C',
      light: 'rgba(28,25,23,0.05)',
      border: 'rgba(28,25,23,0.12)',
      contrast: '#FFFFFF'
    },
    font: {
      primary: "'Sora', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace"
    },
    icon: {
      primary: '#1C1917',
      muted: '#78716C'
    },
    status: {
      success: '#81C995',
      warning: '#D4AA5A',
      error: '#D48E8A',
      info: '#7EA8C9'
    },
    chart: {
      green: '#4CAF82',
      blue: '#5B9BD5',
      amber: '#E4A63A',
      coral: '#D97066',
      violet: '#9B7FD4',
      teal: '#4DB8A4',
      stone: '#8C857E',
      series: ['#5B9BD5', '#4CAF82', '#E4A63A', '#D97066', '#9B7FD4', '#4DB8A4', '#8C857E']
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
