import React, { createContext, useContext, useState } from 'react';

// ============ THEMES ============
export const themes = {
  dark: {
    name: 'dark',
    bg: {
      primary: '#0A1628',
      secondary: '#152238',
      tertiary: '#1E3A5F',
      card: '#152238',
      hover: '#1E3A5F'
    },
    border: {
      primary: 'rgba(255,255,255,0.08)',
      secondary: 'rgba(255,255,255,0.15)',
      focus: '#FF6B58'
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#8B9AAF',
      muted: '#5E7290'
    },
    accent: {
      primary: '#FF6B58',
      secondary: '#FF8A7A',
      light: 'rgba(255,107,88,0.12)',
      border: 'rgba(255,107,88,0.3)'
    },
    font: {
      primary: "'Sora', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace"
    },
    status: {
      success: '#34D399',
      warning: '#f59e0b',
      error: '#FF4D4D',
      info: '#3b82f6'
    }
  },
  light: {
    name: 'light',
    bg: {
      primary: '#FFFFFF',
      secondary: '#FFFFFF',
      tertiary: '#F3F4F6',
      card: '#FFFFFF',
      hover: '#E5E7EB'
    },
    border: {
      primary: 'rgba(0,0,0,0.08)',
      secondary: 'rgba(0,0,0,0.12)',
      focus: '#FF6B58'
    },
    text: {
      primary: '#0A1628',
      secondary: '#1E3A5F',
      muted: '#8B9AAF'
    },
    accent: {
      primary: '#FF6B58',
      secondary: '#FF8A7A',
      light: 'rgba(255,107,88,0.08)',
      border: 'rgba(255,107,88,0.2)'
    },
    font: {
      primary: "'Sora', 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace"
    },
    status: {
      success: '#34D399',
      warning: '#f59e0b',
      error: '#FF4D4D',
      info: '#3b82f6'
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
