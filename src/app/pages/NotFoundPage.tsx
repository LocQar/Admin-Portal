import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';

export default function NotFoundPage() {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen flex items-center justify-center px-6"
         style={{ backgroundColor: theme.bg.primary, color: theme.text.primary }}>
      <div className="text-center max-w-sm">
        <h1 className="text-5xl font-black mb-2">404</h1>
        <p className="text-sm mb-6" style={{ color: theme.text.muted }}>This page doesn't exist.</p>
        <Link
          to="/dashboard"
          className="inline-block px-4 py-2 rounded-xl text-sm font-medium"
          style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}
        >
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
