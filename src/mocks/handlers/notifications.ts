import { http, HttpResponse } from 'msw';
import { cloudConfig } from '@/shared/config/cloud';
import type {
  SmsTemplate,
  AutoRule,
  NotificationSettings,
  MessageLogEntry,
} from '@/features/notifications/types';

const apiUrl = cloudConfig.apiUrl;

// ── In-memory state ─────────────────────────────────────────────────

let nextTplId = 3;
let nextRuleId = 2;
let nextMsgId = 6;

const templates: SmsTemplate[] = [];

const rules: AutoRule[] = [];

let settings: NotificationSettings = {
  id: 'settings-001',
  smsEnabled: true,
  whatsappEnabled: true,
  emailEnabled: false,
  smsProvider: 'hubtel',
  smsApiKey: '',
  smsApiSecret: '',
  smsSenderId: 'LocQar',
  rateLimitSMS: 100,
  retryEnabled: true,
  maxRetries: 3,
  retryDelay: 5,
  quietHoursEnabled: false,
  quietHoursStart: '22:00',
  quietHoursEnd: '08:00',
  batchEnabled: true,
  batchSize: 50,
  defaultSender: 'LocQar',
  replyTo: 'support@locqar.com',
};

const messages: MessageLogEntry[] = [];

// ── Handlers ────────────────────────────────────────────────────────

export const notificationsHandlers = [
  // ── Templates ────────────────────────────────────────────────────

  http.get(`${apiUrl}/admin/notifications/templates`, () => {
    return HttpResponse.json(templates);
  }),

  http.post(`${apiUrl}/admin/notifications/templates`, async ({ request }) => {
    const body = (await request.json()) as any;
    const tpl: SmsTemplate = {
      id: `TPL-${String(nextTplId++).padStart(3, '0')}`,
      name: body.name,
      channel: body.channel ?? 'sms',
      event: body.event,
      message: body.message,
      active: body.active ?? true,
      sentCount: 0,
      deliveryRate: 0,
      lastSentAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    templates.unshift(tpl);
    return HttpResponse.json(tpl, { status: 201 });
  }),

  http.patch(
    `${apiUrl}/admin/notifications/templates/:id`,
    async ({ params, request }) => {
      const tpl = templates.find((t) => t.id === params.id);
      if (!tpl) return new HttpResponse(null, { status: 404 });
      const body = (await request.json()) as any;
      Object.assign(tpl, body, { updatedAt: new Date().toISOString() });
      return HttpResponse.json(tpl);
    },
  ),

  http.delete(`${apiUrl}/admin/notifications/templates/:id`, ({ params }) => {
    const idx = templates.findIndex((t) => t.id === params.id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    templates.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(
    `${apiUrl}/admin/notifications/templates/:id/toggle`,
    ({ params }) => {
      const tpl = templates.find((t) => t.id === params.id);
      if (!tpl) return new HttpResponse(null, { status: 404 });
      tpl.active = !tpl.active;
      tpl.updatedAt = new Date().toISOString();
      return HttpResponse.json(tpl);
    },
  ),

  http.post(
    `${apiUrl}/admin/notifications/templates/:id/duplicate`,
    ({ params }) => {
      const tpl = templates.find((t) => t.id === params.id);
      if (!tpl) return new HttpResponse(null, { status: 404 });
      const copy: SmsTemplate = {
        ...tpl,
        id: `TPL-${String(nextTplId++).padStart(3, '0')}`,
        name: `${tpl.name} (copy)`,
        active: false,
        sentCount: 0,
        deliveryRate: 0,
        lastSentAt: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      templates.unshift(copy);
      return HttpResponse.json(copy, { status: 201 });
    },
  ),

  // ── Rules ────────────────────────────────────────────────────────

  http.get(`${apiUrl}/admin/notifications/rules`, () => {
    return HttpResponse.json(rules);
  }),

  http.post(`${apiUrl}/admin/notifications/rules`, async ({ request }) => {
    const body = (await request.json()) as any;
    const rule: AutoRule = {
      id: `RULE-${String(nextRuleId++).padStart(3, '0')}`,
      name: body.name,
      description: body.description ?? null,
      trigger: body.trigger,
      channels: JSON.stringify(body.channels ?? []),
      delay: body.delay ?? 0,
      active: body.active ?? true,
      firedCount: 0,
      templates: (body.templateIds ?? []).map((tId: string) => {
        const tpl = templates.find((t) => t.id === tId);
        return {
          id: `ART-${Date.now()}`,
          ruleId: '',
          templateId: tId,
          template: tpl ?? templates[0],
        };
      }),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    rules.unshift(rule);
    return HttpResponse.json(rule, { status: 201 });
  }),

  http.patch(
    `${apiUrl}/admin/notifications/rules/:id`,
    async ({ params, request }) => {
      const rule = rules.find((r) => r.id === params.id);
      if (!rule) return new HttpResponse(null, { status: 404 });
      const body = (await request.json()) as any;
      if (body.name !== undefined) rule.name = body.name;
      if (body.description !== undefined) rule.description = body.description;
      if (body.trigger !== undefined) rule.trigger = body.trigger;
      if (body.channels !== undefined)
        rule.channels = JSON.stringify(body.channels);
      if (body.delay !== undefined) rule.delay = body.delay;
      if (body.active !== undefined) rule.active = body.active;
      rule.updatedAt = new Date().toISOString();
      return HttpResponse.json(rule);
    },
  ),

  http.delete(`${apiUrl}/admin/notifications/rules/:id`, ({ params }) => {
    const idx = rules.findIndex((r) => r.id === params.id);
    if (idx === -1) return new HttpResponse(null, { status: 404 });
    rules.splice(idx, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(
    `${apiUrl}/admin/notifications/rules/:id/toggle`,
    ({ params }) => {
      const rule = rules.find((r) => r.id === params.id);
      if (!rule) return new HttpResponse(null, { status: 404 });
      rule.active = !rule.active;
      rule.updatedAt = new Date().toISOString();
      return HttpResponse.json(rule);
    },
  ),

  http.post(`${apiUrl}/admin/notifications/rules/:id/test`, ({ params }) => {
    return HttpResponse.json({ message: `Rule ${params.id} test triggered` });
  }),

  // ── Settings ─────────────────────────────────────────────────────

  http.get(`${apiUrl}/admin/notifications/settings`, () => {
    return HttpResponse.json({
      ...settings,
      smsApiKey: settings.smsApiKey
        ? `****${settings.smsApiKey.slice(-4)}`
        : '',
      smsApiSecret: settings.smsApiSecret
        ? `****${settings.smsApiSecret.slice(-4)}`
        : '',
    });
  }),

  http.patch(
    `${apiUrl}/admin/notifications/settings`,
    async ({ request }) => {
      const body = (await request.json()) as any;
      settings = { ...settings, ...body };
      return HttpResponse.json(settings);
    },
  ),

  http.post(
    `${apiUrl}/admin/notifications/settings/test-sms`,
    async ({ request }) => {
      const body = (await request.json()) as { phone: string; message?: string };
      // Simulate test SMS
      const msg: MessageLogEntry = {
        id: `MSG-${String(nextMsgId++).padStart(3, '0')}`,
        templateId: null,
        template: null,
        channel: 'sms',
        recipient: 'Test',
        phone: body.phone,
        waybill: null,
        message: body.message ?? 'Test SMS from LocQar Admin Portal',
        status: 'delivered',
        cost: 0.05,
        providerMsgId: `ark-test-${Date.now()}`,
        errorMessage: null,
        retryCount: 0,
        sentAt: new Date().toISOString(),
        deliveredAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };
      messages.unshift(msg);
      return HttpResponse.json({
        success: true,
        messageId: msg.providerMsgId,
      });
    },
  ),

  // ── Messages & Stats ─────────────────────────────────────────────

  http.get(`${apiUrl}/admin/notifications/messages`, ({ request }) => {
    const url = new URL(request.url);
    const channel = url.searchParams.get('channel');
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') ?? '50', 10);
    const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);

    let filtered = messages;
    if (channel) filtered = filtered.filter((m) => m.channel === channel);
    if (status) filtered = filtered.filter((m) => m.status === status);

    return HttpResponse.json({
      data: filtered.slice(offset, offset + limit),
      total: filtered.length,
    });
  }),

  http.get(`${apiUrl}/admin/notifications/stats`, () => {
    const delivered = messages.filter((m) => m.status === 'delivered').length;
    const failed = messages.filter((m) => m.status === 'failed').length;
    const totalCost = messages.reduce((sum, m) => sum + m.cost, 0);
    return HttpResponse.json({
      sentToday: messages.length,
      deliveredToday: delivered,
      failedToday: failed,
      costToday: totalCost,
    });
  }),
];
