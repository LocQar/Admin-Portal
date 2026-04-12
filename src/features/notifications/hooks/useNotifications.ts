import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notificationsApi';
import type { MessageFilters } from '../types';

export const notificationKeys = {
  all: ['notifications'] as const,
  templates: () => [...notificationKeys.all, 'templates'] as const,
  rules: () => [...notificationKeys.all, 'rules'] as const,
  settings: () => [...notificationKeys.all, 'settings'] as const,
  messages: (filters: MessageFilters) =>
    [...notificationKeys.all, 'messages', filters] as const,
  stats: () => [...notificationKeys.all, 'stats'] as const,
};

// ─��� Queries ──────────────────────────────────────────────────────────

export function useTemplates() {
  return useQuery({
    queryKey: notificationKeys.templates(),
    queryFn: () => notificationsApi.listTemplates(),
  });
}

export function useRules() {
  return useQuery({
    queryKey: notificationKeys.rules(),
    queryFn: () => notificationsApi.listRules(),
  });
}

export function useNotificationSettings() {
  return useQuery({
    queryKey: notificationKeys.settings(),
    queryFn: () => notificationsApi.getSettings(),
  });
}

export function useMessages(filters: MessageFilters = {}) {
  return useQuery({
    queryKey: notificationKeys.messages(filters),
    queryFn: () => notificationsApi.listMessages(filters),
  });
}

export function useNotificationStats() {
  return useQuery({
    queryKey: notificationKeys.stats(),
    queryFn: () => notificationsApi.getStats(),
    refetchInterval: 30_000,
  });
}

// ── Template Mutations ──────────────────────────────────────────────

export function useCreateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.createTemplate,
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.templates() }),
  });
}

export function useUpdateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof notificationsApi.updateTemplate>[1] }) =>
      notificationsApi.updateTemplate(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.templates() }),
  });
}

export function useToggleTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.toggleTemplate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.templates() }),
  });
}

export function useDuplicateTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.duplicateTemplate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.templates() }),
  });
}

export function useDeleteTemplate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteTemplate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.templates() }),
  });
}

// ── Rule Mutations ──────────────────────────────────────────────────

export function useCreateRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.createRule,
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.rules() }),
  });
}

export function useUpdateRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof notificationsApi.updateRule>[1] }) =>
      notificationsApi.updateRule(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.rules() }),
  });
}

export function useToggleRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.toggleRule(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.rules() }),
  });
}

export function useDeleteRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteRule(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.rules() }),
  });
}

export function useTestRule() {
  return useMutation({
    mutationFn: (id: string) => notificationsApi.testRule(id),
  });
}

// ── Settings Mutations ──────────────────────────────────────────────

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.updateSettings,
    onSuccess: () => qc.invalidateQueries({ queryKey: notificationKeys.settings() }),
  });
}

export function useTestSms() {
  return useMutation({
    mutationFn: notificationsApi.testSms,
  });
}
