import { apiClient } from '@/shared/api/client';
import type {
  SmsTemplate,
  AutoRule,
  NotificationSettings,
  NotificationStats,
  MessageLogPage,
  MessageFilters,
} from '../types';

function toQuery(filters: Record<string, unknown> = {}): string {
  const params = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const notificationsApi = {
  // ── Templates ──────────────────────────────────────────────────────
  listTemplates: () =>
    apiClient.get<SmsTemplate[]>('/admin/notifications/templates'),

  createTemplate: (data: {
    name: string;
    channel?: string;
    event: string;
    message: string;
  }) => apiClient.post<SmsTemplate>('/admin/notifications/templates', data),

  updateTemplate: (
    id: string,
    data: Partial<{ name: string; channel: string; event: string; message: string; active: boolean }>,
  ) => apiClient.patch<SmsTemplate>(`/admin/notifications/templates/${id}`, data),

  deleteTemplate: (id: string) =>
    apiClient.delete(`/admin/notifications/templates/${id}`),

  toggleTemplate: (id: string) =>
    apiClient.post<SmsTemplate>(`/admin/notifications/templates/${id}/toggle`),

  duplicateTemplate: (id: string) =>
    apiClient.post<SmsTemplate>(`/admin/notifications/templates/${id}/duplicate`),

  // ── Auto-Rules ─────────────────────────────────────────────────────
  listRules: () =>
    apiClient.get<AutoRule[]>('/admin/notifications/rules'),

  createRule: (data: {
    name: string;
    description?: string;
    trigger: string;
    channels: string[];
    templateIds: string[];
    delay?: number;
  }) => apiClient.post<AutoRule>('/admin/notifications/rules', data),

  updateRule: (
    id: string,
    data: Partial<{
      name: string;
      description: string;
      trigger: string;
      channels: string[];
      templateIds: string[];
      delay: number;
      active: boolean;
    }>,
  ) => apiClient.patch<AutoRule>(`/admin/notifications/rules/${id}`, data),

  deleteRule: (id: string) =>
    apiClient.delete(`/admin/notifications/rules/${id}`),

  toggleRule: (id: string) =>
    apiClient.post<AutoRule>(`/admin/notifications/rules/${id}/toggle`),

  testRule: (id: string) =>
    apiClient.post<{ message: string }>(`/admin/notifications/rules/${id}/test`),

  // ── Settings ───────────────────────────────────────────────────────
  getSettings: () =>
    apiClient.get<NotificationSettings>('/admin/notifications/settings'),

  updateSettings: (data: Partial<NotificationSettings>) =>
    apiClient.patch<NotificationSettings>('/admin/notifications/settings', data),

  testSms: (data: { phone: string; message?: string }) =>
    apiClient.post<{ success: boolean; messageId?: string; error?: string }>(
      '/admin/notifications/settings/test-sms',
      data,
    ),

  // ── Messages & Stats ────────────────────────────────────────��─────
  listMessages: (filters: MessageFilters = {}) =>
    apiClient.get<MessageLogPage>(`/admin/notifications/messages${toQuery(filters as Record<string, unknown>)}`),

  getStats: () =>
    apiClient.get<NotificationStats>('/admin/notifications/stats'),
};
