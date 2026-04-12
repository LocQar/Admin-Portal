export interface SmsTemplate {
  id: string;
  name: string;
  channel: 'sms' | 'whatsapp' | 'email';
  event: string;
  message: string;
  active: boolean;
  sentCount: number;
  deliveryRate: number;
  lastSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AutoRuleTemplate {
  id: string;
  ruleId: string;
  templateId: string;
  template: SmsTemplate;
}

export interface AutoRule {
  id: string;
  name: string;
  description: string | null;
  trigger: string;
  channels: string; // JSON: '["sms","whatsapp"]'
  delay: number;
  active: boolean;
  firedCount: number;
  templates: AutoRuleTemplate[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  id: string;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  emailEnabled: boolean;
  smsProvider: string;
  smsApiKey: string;    // Hubtel Client ID (masked: "****abcd")
  smsApiSecret: string; // Hubtel Client Secret (masked: "****abcd")
  smsSenderId: string;
  rateLimitSMS: number;
  retryEnabled: boolean;
  maxRetries: number;
  retryDelay: number;
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  batchEnabled: boolean;
  batchSize: number;
  defaultSender: string;
  replyTo: string;
}

export interface MessageLogEntry {
  id: string;
  templateId: string | null;
  template: { name: string } | null;
  channel: string;
  recipient: string;
  phone: string;
  waybill: string | null;
  message: string;
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced';
  cost: number;
  providerMsgId: string | null;
  errorMessage: string | null;
  retryCount: number;
  sentAt: string | null;
  deliveredAt: string | null;
  createdAt: string;
}

export interface NotificationStats {
  sentToday: number;
  deliveredToday: number;
  failedToday: number;
  costToday: number;
}

export interface MessageLogPage {
  data: MessageLogEntry[];
  total: number;
}

export interface MessageFilters {
  channel?: string;
  status?: string;
  since?: string;
  limit?: number;
  offset?: number;
}
