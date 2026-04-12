import { useAuthStore } from '../stores/authStore';
// Re-export hasPermission from shared constants (single source of truth).
// The file is still .js during Phase 1; it will be converted to .ts in Phase 3.
// @ts-ignore - JS module without types yet
import { hasPermission as hasPermissionJs } from '@/shared/constants/roles.js';

export function useHasPermission(permission: string): boolean {
  const role = useAuthStore((s) => s.user?.role);
  if (!role) return false;
  return Boolean(hasPermissionJs(role, permission, []));
}

export function hasPermission(role: string | undefined, permission: string): boolean {
  if (!role) return false;
  return Boolean(hasPermissionJs(role, permission, []));
}
