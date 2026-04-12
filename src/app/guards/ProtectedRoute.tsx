import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useIsAuthenticated } from '@/features/auth/hooks/useAuth';

export function ProtectedRoute() {
  const isAuthed = useIsAuthenticated();
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
