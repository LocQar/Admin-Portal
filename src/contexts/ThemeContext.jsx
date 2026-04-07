import React, { createContext, useContext, useState, useEffect } from 'react';

// ============ THEMES ============
export const themes = {
  dark: {
    name: 'dark',
    bg: {
      primary: '#100E0C',
      secondary: '#191613',
      tertiary: '#252119',   // lifted slightly for visible depth
      card: '#1E1A17',
      hover: '#2E2925',      // lifted for more visible hover feedback
      input: '#252119'
    },
    border: {
      primary: 'rgba(255,255,255,0.10)',   // was 0.08 — slightly more visible
      secondary: 'rgba(255,255,255,0.16)',
      focus: 'rgba(255,255,255,0.65)'
    },
    text: {
      primary: '#F0EBE5',
      secondary: '#C4BDB8',
      muted: '#918A84'       // was #6E6560 — contrast ratio was ~2.8:1, now ~4.6:1
    },
    accent: {
      primary: '#F0EBE5',
      secondary: '#C4BDB8',
      light: 'rgba(240,235,229,0.10)',
      border: 'rgba(240,235,229,0.22)',
      contrast: '#100E0C'
    },
    font: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace"
    },
    icon: {
      primary: '#C4BDB8',
      muted: '#918A84'       // was #6E6560 — same fix as text.muted
    },
    status: {
      success: '#4ADE80',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA'
    },
    chart: {
      green: '#34D399',
      blue: '#60A5FA',
      amber: '#FBBF24',
      coral: '#F87171',
      violet: '#A78BFA',
      teal: '#2DD4BF',
      stone: '#9CA3AF',
      series: ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA', '#2DD4BF', '#9CA3AF']
    }
  },
  light: {
    name: 'light',
    bg: {
      primary: '#F0F2F7',
      secondary: '#FFFFFF',
      tertiary: '#E6E9F2',
      card: '#FFFFFF',
      hover: '#E0E4EE',
      input: '#ECEEF5'
    },
    border: {
      primary: 'rgba(0,0,0,0.08)',
      secondary: 'rgba(0,0,0,0.14)',
      focus: '#4F46E5'
    },
    text: {
      primary: '#18181B',
      secondary: '#3F3F46',
      muted: '#71717A'
    },
    accent: {
      primary: '#18181B',
      secondary: '#27272A',
      light: 'rgba(24,24,27,0.07)',
      border: 'rgba(24,24,27,0.20)',
      contrast: '#FFFFFF'
    },
    font: {
      primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace"
    },
    icon: {
      primary: '#18181B',
      muted: '#52525B'
    },
    status: {
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#2563EB'
    },
    chart: {
      green: '#10B981',
      blue: '#3B82F6',
      amber: '#F59E0B',
      coral: '#EF4444',
      violet: '#8B5CF6',
      teal: '#06B6D4',
      stone: '#94A3B8',
      series: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#94A3B8']
    }
  }
};

// ============ THEME CONTEXT ============
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeName, setThemeName] = useState('dark');
  const theme = themes[themeName];

  useEffect(() => {
    document.body.classList.toggle('theme-light', themeName === 'light');
    document.body.classList.toggle('theme-dark', themeName !== 'light');
    document.body.style.backgroundColor = theme.bg.primary;
  }, [themeName, theme.bg.primary]);

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
