import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react';

// ============ THEME SHAPES ============

export interface ThemeColors {
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
    card: string;
    hover: string;
    input: string;
  };
  border: {
    primary: string;
    secondary: string;
    focus: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  accent: {
    primary: string;
    secondary: string;
    light: string;
    border: string;
    contrast: string;
  };
  font: {
    primary: string;
    mono: string;
  };
  icon: {
    primary: string;
    muted: string;
  };
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  chart: {
    green: string;
    blue: string;
    amber: string;
    coral: string;
    violet: string;
    teal: string;
    stone: string;
    series: readonly string[];
  };
}

export interface Theme extends ThemeColors {
  name: ThemeName;
}

export type ThemeName = 'dark' | 'light';

// ============ SHARED ============
const FONTS = {
  primary: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'SF Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
} as const;

// ============ THEMES ============
export const themes: Record<ThemeName, Theme> = {
  /* ──────────────────────────────────────────────
   * DARK — dark + white text, white accent
   * ────────────────────────────────────────────── */
  dark: {
    name: 'dark',
    bg: {
      primary: '#0A0A0A',
      secondary: '#141414',
      tertiary: '#1C1C1C',
      card: 'rgba(255,255,255,0.04)',
      hover: 'rgba(255,255,255,0.07)',
      input: '#1C1C1C',
    },
    border: {
      primary: 'rgba(255,255,255,0.08)',
      secondary: 'rgba(255,255,255,0.14)',
      focus: 'rgba(255,255,255,0.6)',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A1A1AA',
      muted: '#71717A',
    },
    accent: {
      primary: '#FFFFFF',
      secondary: '#E4E4E7',
      light: 'rgba(255,255,255,0.08)',
      border: 'rgba(255,255,255,0.20)',
      contrast: '#0A0A0A',
    },
    font: FONTS,
    icon: {
      primary: '#D4D4D8',
      muted: '#71717A',
    },
    status: {
      success: '#34D399',
      warning: '#FBBF24',
      error: '#F87171',
      info: '#60A5FA',
    },
    chart: {
      green: '#34D399',
      blue: '#60A5FA',
      amber: '#FBBF24',
      coral: '#FB7185',
      violet: '#A78BFA',
      teal: '#2DD4BF',
      stone: '#A1A1AA',
      series: ['#FFFFFF', '#34D399', '#60A5FA', '#FBBF24', '#A78BFA', '#2DD4BF', '#A1A1AA'],
    },
  },

  /* ──────────────────────────────────────────────
   * LIGHT — clean white + black text, black accent
   * ────────────────────────────────────────────── */
  light: {
    name: 'light',
    bg: {
      primary: '#F8F9FA',
      secondary: '#FFFFFF',
      tertiary: '#F1F3F5',
      card: '#FFFFFF',
      hover: '#F1F3F5',
      input: '#F1F3F5',
    },
    border: {
      primary: '#E9ECEF',
      secondary: '#DEE2E6',
      focus: '#0A0A0A',
    },
    text: {
      primary: '#111827',
      secondary: '#374151',
      muted: '#6B7280',
    },
    accent: {
      primary: '#111827',
      secondary: '#1F2937',
      light: 'rgba(17,24,39,0.05)',
      border: 'rgba(17,24,39,0.12)',
      contrast: '#FFFFFF',
    },
    font: FONTS,
    icon: {
      primary: '#374151',
      muted: '#9CA3AF',
    },
    status: {
      success: '#059669',
      warning: '#D97706',
      error: '#DC2626',
      info: '#2563EB',
    },
    chart: {
      green: '#10B981',
      blue: '#3B82F6',
      amber: '#F59E0B',
      coral: '#EF4444',
      violet: '#8B5CF6',
      teal: '#0891B2',
      stone: '#6B7280',
      series: ['#111827', '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#0891B2', '#6B7280'],
    },
  },
};

// ============ CONTEXT ============

export interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setThemeName: Dispatch<SetStateAction<ThemeName>>;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'locqar.themeName';

function readInitial(): ThemeName {
  if (typeof window === 'undefined') return 'dark';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  return saved === 'light' || saved === 'dark' ? saved : 'dark';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeName, setThemeName] = useState<ThemeName>(readInitial);
  const theme = themes[themeName];

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.body.classList.toggle('theme-light', themeName === 'light');
    document.body.classList.toggle('theme-dark', themeName !== 'light');
    document.body.style.backgroundColor = theme.bg.primary;
    try {
      window.localStorage.setItem(STORAGE_KEY, themeName);
    } catch {
      // localStorage may be unavailable (private mode); non-fatal
    }
  }, [themeName, theme.bg.primary]);

  const toggleTheme = useCallback(() => {
    setThemeName((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, themeName, setThemeName, toggleTheme }),
    [theme, themeName, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}

export default ThemeContext;
