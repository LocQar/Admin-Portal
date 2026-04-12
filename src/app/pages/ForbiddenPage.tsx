import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export default function ForbiddenPage() {
  const { theme } = useTheme();
  return (
    <div className="min-h-screen flex items-center justify-center px-6"
         style={{ backgroundColor: theme.bg.primary, color: theme.text.primary }}>
      <div className="text-center max-w-sm">
        <ShieldAlert size={48} style={{ color: '#EF4444' }} className="mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-2">403 — Forbidden</h1>
        <p className="text-sm mb-6" style={{ color: theme.text.muted }}>
          You don't have permission to view this page.
        </p>
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
