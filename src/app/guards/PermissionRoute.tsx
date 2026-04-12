import { Navigate, Outlet } from 'react-router-dom';
import { useHasPermission } from '@/features/auth/hooks/usePermission';

export function PermissionRoute({ permission }: { permission: string }) {
  const allowed = useHasPermission(permission);
  if (!allowed) return <Navigate to="/403" replace />;
  return <Outlet />;
}
