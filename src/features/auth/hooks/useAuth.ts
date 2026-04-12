import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../stores/authStore';
import type { CredentialsLoginInput } from '../schemas';
import type { AuthUser } from '../types';

export function useCurrentUser(): AuthUser | null {
  return useAuthStore((state) => state.user);
}

export function useIsAuthenticated(): boolean {
  return useAuthStore((state) => !!state.user && !!state.accessToken);
}

export function useLoginWithCredentials() {
  const setSession = useAuthStore((s) => s.setSession);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (input: CredentialsLoginInput) => authApi.loginWithCredentials(input),
    onSuccess: (data) => {
      setSession({
        user: data.user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      navigate('/dashboard');
    },
  });
}

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  return useMutation({
    // Backend has no /logout endpoint — just clear local state.
    mutationFn: async () => undefined,
    onSettled: () => {
      logout();
      navigate('/login', { replace: true });
    },
  });
}
