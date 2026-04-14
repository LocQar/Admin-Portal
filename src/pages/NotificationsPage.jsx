import React from 'react';
import { Download, Send, MessageSquare, CheckCircle2, Eye, AlertTriangle, Banknote, Smartphone, Mail, Bell, Search, Plus, Edit, Trash2, Power, PowerOff, Copy, Play, Pause, X, Filter, Calendar, TrendingUp, BarChart3, Package, Clock, RefreshCw, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard, TableSkeleton, Pagination, EmptyState, StatusBadge } from '../components/ui';
import { GlassCard } from '../components/ui/Card';
import {
  useTemplates,
  useRules,
  useNotificationSettings,
  useMessages,
  useNotificationStats,
  useToggleTemplate,
  useDuplicateTemplate,
  useDeleteTemplate,
  useCreateRule,
  useToggleRule,
  useDeleteRule,
  useTestRule,
  useUpdateSettings,
  useTestSms,
} from '../features/notifications/hooks/useNotifications';

// Keep MSG_STATUSES as a display constant
const MSG_STATUSES = {
  delivered: { label: 'Delivered', color: '#81C995', bg: 'rgba(129,201,149,0.1)', icon: '✓✓' },
  read: { label: 'Read', color: '#7EA8C9', bg: 'rgba(126,168,201,0.1)', icon: '✓✓' },
  opened: { label: 'Opened', color: '#B5A0D1', bg: 'rgba(181,160,209,0.1)', icon: '👁' },
  sent: { label: 'Sent', color: '#D4AA5A', bg: 'rgba(212,170,90,0.1)', icon: '✓' },
  failed: { label: 'Failed', color: '#D48E8A', bg: 'rgba(212,142,138,0.1)', icon: '✕' },
  bounced: { label: 'Bounced', color: '#D48E8A', bg: 'rgba(212,142,138,0.1)', icon: '↩' },
  pending: { label: 'Pending', color: '#78716C', bg: 'rgba(120,113,108,0.1)', icon: '⏳' },
};

// Static chart data (will come from stats API in future)
const msgVolumeData = [
  { date: 'Mon', sms: 420, whatsapp: 380, email: 210 },
  { date: 'Tue', sms: 480, whatsapp: 450, email: 245 },
  { date: 'Wed', sms: 390, whatsapp: 410, email: 190 },
  { date: 'Thu', sms: 510, whatsapp: 470, email: 260 },
  { date: 'Fri', sms: 460, whatsapp: 430, email: 220 },
  { date: 'Sat', sms: 280, whatsapp: 310, email: 120 },
  { date: 'Sun', sms: 220, whatsapp: 250, email: 90 },
];

export const NotificationsPage = ({ currentUser, activeSubMenu, loading, setShowExport, setComposeOpen, addToast }) => {
  const { theme } = useTheme();

  // ── API hooks ────────────────────────────────────────────────────
  const { data: templatesData = [], isPending: templatesPending } = useTemplates();
  const { data: rulesData = [], isPending: rulesPending } = useRules();
  const { data: settingsData } = useNotificationSettings();
  const { data: statsData } = useNotificationStats();
  const { data: messagesData, isPending: messagesPending } = useMessages({ limit: 200 });

  const toggleTemplateMut = useToggleTemplate();
  const duplicateTemplateMut = useDuplicateTemplate();
  const deleteTemplateMut = useDeleteTemplate();
  const toggleRuleMut = useToggleRule();
  const testRuleMut = useTestRule();
  const updateSettingsMut = useUpdateSettings();
  const createRuleMut = useCreateRule();
  const deleteRuleMut = useDeleteRule();
  const testSmsMut = useTestSms();

  // Message Center state
  const [msgSearch, setMsgSearch] = React.useState('');
  const [msgChannelFilter, setMsgChannelFilter] = React.useState('all');
  const [msgStatusFilter, setMsgStatusFilter] = React.useState('all');
  const [msgDateFilter, setMsgDateFilter] = React.useState('today');
  const [msgPage, setMsgPage] = React.useState(1);
  const [msgPageSize, setMsgPageSize] = React.useState(10);

  // Templates state
  const [templateSearch, setTemplateSearch] = React.useState('');
  const [templateChannelFilter, setTemplateChannelFilter] = React.useState('all');
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [showTemplateForm, setShowTemplateForm] = React.useState(false);

  // Auto-Rules state
  const [ruleSearch, setRuleSearch] = React.useState('');
  const [selectedRule, setSelectedRule] = React.useState(null);

  // Modal state
  const [showDeleteTemplateModal, setShowDeleteTemplateModal] = React.useState(null); // holds template to delete
  const [showCreateRuleModal, setShowCreateRuleModal] = React.useState(false);
  const [showDeleteRuleModal, setShowDeleteRuleModal] = React.useState(null); // holds rule to delete
  const [newRule, setNewRule] = React.useState({ name: '', description: '', trigger: 'package_pickup', channels: ['sms'], delay: '0m', templateId: '' });

  // Settings state — seeded from API, falls back to defaults
  const [notificationSettings, setNotificationSettings] = React.useState({
    smsEnabled: true,
    whatsappEnabled: true,
    emailEnabled: false,
    pushEnabled: true,
    rateLimitSMS: 100,
    rateLimitWA: 200,
    rateLimitEmail: 50,
    defaultSender: 'LocQar',
    replyTo: 'support@locqar.com',
    notifyOnPickup: true,
    notifyOnInTransit: true,
    notifyOnDelivered: true,
    notifyOnDelay: true,
    notifyOnStorageFull: true,
    notifyOnSLABreach: true,
    notifyOnPaymentDue: false,
    notifyOnPackageExpiry: true,
    retryEnabled: true,
    maxRetries: 3,
    retryDelay: 5,
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    highPrioritySLA: true,
    highPriorityPayments: false,
    batchEnabled: true,
    batchSize: 50,
    batchInterval: 2,
    smsProvider: 'hubtel',
    smsApiKey: '',
    smsApiSecret: '',
    smsUsername: '',
    smsWebhookUrl: 'https://api.locqar.com/webhooks/sms',
    waBusinessAccountId: '',
    waPhoneNumberId: '',
    waAccessToken: '',
    waWebhookVerifyToken: '',
    waWebhookUrl: 'https://api.locqar.com/webhooks/whatsapp',
    emailSmtpHost: 'smtp.gmail.com',
    emailSmtpPort: 587,
    emailSmtpUsername: '',
    emailSmtpPassword: '',
    emailSmtpEncryption: 'tls',
    emailFromName: 'LocQar',
    emailFromAddress: 'noreply@locqar.com',
  });

  // Sync settings from API when loaded
  React.useEffect(() => {
    if (settingsData) {
      setNotificationSettings((prev) => ({ ...prev, ...settingsData }));
    }
  }, [settingsData]);

  // Settings sub-tab
  const [settingsTab, setSettingsTab] = React.useState('channels');

  // Filtered messages — from API data
  const allMessages = messagesData?.data ?? [];
  const filteredMessages = React.useMemo(() => {
    let result = [...allMessages];
    if (msgSearch) {
      const q = msgSearch.toLowerCase();
      result = result.filter(m =>
        m.recipient.toLowerCase().includes(q) ||
        (m.waybill || '').toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        (m.template?.name || '').toLowerCase().includes(q)
      );
    }
    if (msgChannelFilter !== 'all') result = result.filter(m => m.channel === msgChannelFilter);
    if (msgStatusFilter !== 'all') result = result.filter(m => m.status === msgStatusFilter);
    return result;
  }, [allMessages, msgSearch, msgChannelFilter, msgStatusFilter]);

  const paginatedMessages = React.useMemo(() => {
    const start = (msgPage - 1) * msgPageSize;
    return filteredMessages.slice(start, start + msgPageSize);
  }, [filteredMessages, msgPage, msgPageSize]);

  const totalMsgPages = Math.ceil(filteredMessages.length / msgPageSize);

  // Filtered templates — from API data
  const filteredTemplates = React.useMemo(() => {
    let result = [...templatesData];
    if (templateSearch) {
      const q = templateSearch.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.message.toLowerCase().includes(q));
    }
    if (templateChannelFilter !== 'all') result = result.filter(t => t.channel === templateChannelFilter);
    return result;
  }, [templatesData, templateSearch, templateChannelFilter]);

  // Filtered rules — from API data
  const filteredRules = React.useMemo(() => {
    let result = [...rulesData];
    if (ruleSearch) {
      const q = ruleSearch.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q));
    }
    return result;
  }, [rulesData, ruleSearch]);

  const handleToggleTemplate = (templateId) => {
    toggleTemplateMut.mutate(templateId, {
      onSuccess: () => addToast({ type: 'success', message: 'Template status updated' }),
      onError: () => addToast({ type: 'error', message: 'Failed to update template' }),
    });
  };

  const handleToggleRule = (ruleId) => {
    toggleRuleMut.mutate(ruleId, {
      onSuccess: () => addToast({ type: 'success', message: 'Rule status updated' }),
      onError: () => addToast({ type: 'error', message: 'Failed to update rule' }),
    });
  };

  const handleDuplicateTemplate = (template) => {
    duplicateTemplateMut.mutate(template.id, {
      onSuccess: () => addToast({ type: 'success', message: `Template "${template.name}" duplicated` }),
      onError: () => addToast({ type: 'error', message: 'Failed to duplicate template' }),
    });
  };

  const handleTestRule = (rule) => {
    addToast({ type: 'info', message: `Testing rule "${rule.name}"...` });
    testRuleMut.mutate(rule.id, {
      onSuccess: (data) => addToast({ type: 'success', message: data.message }),
      onError: () => addToast({ type: 'error', message: 'Rule test failed' }),
    });
  };

  const handleSaveSettings = () => {
    updateSettingsMut.mutate(notificationSettings, {
      onSuccess: () => addToast({ type: 'success', message: 'Notification settings saved successfully' }),
      onError: () => addToast({ type: 'error', message: 'Failed to save settings' }),
    });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
            <MessageSquare size={28} style={{ color: theme.status.success }} /> Notifications
          </h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Message Center'} • Manage customer communications</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExport(true)} className="btn-outline flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Download size={16} />Export
          </button>
          <button onClick={() => setComposeOpen(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
            <Send size={18} />Send Message
          </button>
        </div>
      </div>

      {/* Message Center */}
      {(!activeSubMenu || activeSubMenu === 'Message Center') && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MetricCard title="Sent Today" value={(statsData?.sentToday ?? 0).toLocaleString()} icon={Send} loading={loading || !statsData} subtitle="SMS + WhatsApp + Email" />
            <MetricCard title="Delivered" value={statsData?.deliveredToday ?? 0} change={statsData?.sentToday ? `${Math.round((statsData.deliveredToday / statsData.sentToday) * 100)}%` : '—'} changeType="up" icon={CheckCircle2} loading={loading || !statsData} />
            <MetricCard title="Opened" value="—" icon={Eye} loading={loading || !statsData} subtitle="WA read + Email opened" />
            <MetricCard title="Failed" value={statsData?.failedToday ?? 0} icon={AlertTriangle} loading={loading || !statsData} />
            <MetricCard title="Cost Today" value={`GH₵ ${(statsData?.costToday ?? 0).toFixed(2)}`} icon={Banknote} loading={loading || !statsData} />
          </div>

          {/* Message Volume Chart */}
          <GlassCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Message Volume (Last 7 Days)</h3>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: theme.chart.green }} />SMS</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: theme.chart.violet }} />WhatsApp</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: theme.chart.blue }} />Email</span>
              </div>
            </div>
            {loading ? <TableSkeleton rows={3} cols={1} /> : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={msgVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: theme.text.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: theme.text.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 8 }} labelStyle={{ color: theme.text.primary }} itemStyle={{ color: theme.text.secondary }} />
                  <Line type="monotone" dataKey="sms" stroke={theme.chart.green} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="whatsapp" stroke={theme.chart.violet} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="email" stroke={theme.chart.blue} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </GlassCard>

          {/* Recent Messages Table */}
          <GlassCard noPadding className="overflow-hidden">
            <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-3" style={{ borderColor: theme.border.primary }}>
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Recent Messages</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
                  <input type="text" placeholder="Search messages..." value={msgSearch} onChange={(e) => setMsgSearch(e.target.value)} className="glass-card pl-9 pr-3 py-2 rounded-lg text-sm w-full md:w-64 outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
                </div>
                <select value={msgChannelFilter} onChange={(e) => setMsgChannelFilter(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ backgroundColor: theme.bg.input, color: theme.text.primary }}>
                  <option value="all">All Channels</option>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                </select>
                <select value={msgStatusFilter} onChange={(e) => setMsgStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ backgroundColor: theme.bg.input, color: theme.text.primary }}>
                  <option value="all">All Status</option>
                  <option value="delivered">Delivered</option>
                  <option value="read">Read</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {loading ? <TableSkeleton rows={5} cols={7} /> : paginatedMessages.length === 0 ? (
              <EmptyState icon={MessageSquare} title="No messages found" description="Try adjusting your filters" />
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ borderBottom: `1px solid ${theme.border.primary}`, backgroundColor: theme.bg.tertiary }}>
                        <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Recipient</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Template</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Channel</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Sent At</th>
                        <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedMessages.map((msg) => {
                        const statusConfig = MSG_STATUSES[msg.status];
                        return (
                          <tr key={msg.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }} className="hover:bg-opacity-50" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.bg.tertiary} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <td className="p-3">
                              <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{msg.recipient}</p>
                              <p className="text-xs" style={{ color: theme.text.muted }}>{msg.phone}</p>
                            </td>
                            <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{msg.template?.name ?? msg.template ?? '—'}</span></td>
                            <td className="p-3">
                              <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full w-fit capitalize" style={{ backgroundColor: msg.channel === 'sms' ? `${theme.status.success}15` : msg.channel === 'whatsapp' ? `${theme.chart.violet}15` : `${theme.accent.primary}15`, color: msg.channel === 'sms' ? theme.status.success : msg.channel === 'whatsapp' ? theme.chart.violet : theme.accent.primary }}>
                                {msg.channel === 'sms' ? <Smartphone size={12} /> : msg.channel === 'whatsapp' ? <MessageSquare size={12} /> : <Mail size={12} />}
                                {msg.channel}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full w-fit capitalize" style={{ backgroundColor: statusConfig?.bg, color: statusConfig?.color }}>
                                {statusConfig?.icon} {statusConfig?.label}
                              </span>
                            </td>
                            <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{msg.sentAt}</span></td>
                            <td className="p-3"><span className="text-sm font-medium" style={{ color: theme.text.primary }}>GH₵ {msg.cost.toFixed(2)}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t" style={{ borderColor: theme.border.primary }}>
                  <Pagination currentPage={msgPage} totalPages={totalMsgPages} onPageChange={setMsgPage} pageSize={msgPageSize} onPageSizeChange={setMsgPageSize} totalItems={filteredMessages.length} />
                </div>
              </>
            )}
          </GlassCard>
        </div>
      )}

      {/* Templates */}
      {activeSubMenu === 'Templates' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
              <input type="text" placeholder="Search templates..." value={templateSearch} onChange={(e) => setTemplateSearch(e.target.value)} className="glass-card pl-9 pr-3 py-2 rounded-lg text-sm w-full outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
            </div>
            <select value={templateChannelFilter} onChange={(e) => setTemplateChannelFilter(e.target.value)} className="px-4 py-2 rounded-lg text-sm outline-none" style={{ backgroundColor: theme.bg.input, color: theme.text.primary }}>
              <option value="all">All Channels</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
            <button onClick={() => setShowTemplateForm(true)} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
              <Plus size={16} />New Template
            </button>
          </div>

          {/* Templates Grid */}
          {loading ? <TableSkeleton rows={3} cols={2} /> : filteredTemplates.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No templates found" description="Create your first notification template" action={{ label: 'New Template', onClick: () => setShowTemplateForm(true) }} />
          ) : (
            <div className="grid gap-4">
              {filteredTemplates.map((template) => (
                <GlassCard key={template.id} style={{ borderColor: template.active ? theme.accent.primary + '30' : undefined }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold" style={{ color: theme.text.primary }}>{template.name}</h4>
                        <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ backgroundColor: template.channel === 'sms' ? `${theme.status.success}15` : template.channel === 'whatsapp' ? `${theme.chart.violet}15` : `${theme.accent.primary}15`, color: template.channel === 'sms' ? theme.status.success : template.channel === 'whatsapp' ? theme.chart.violet : theme.accent.primary }}>
                          {template.channel}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${template.active ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                          {template.active ? '● Active' : '○ Inactive'}
                        </span>
                      </div>
                      <p className="text-sm mb-3 p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.secondary }}>{template.message}</p>
                      <div className="flex gap-4 text-xs" style={{ color: theme.text.muted }}>
                        <span>Sent: {template.sentCount.toLocaleString()}</span>
                        <span>Delivery: {template.deliveryRate}%</span>
                        <span>Last sent: {template.lastSentAt ?? template.lastSent ?? '—'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => handleToggleTemplate(template.id)} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: template.active ? theme.status.success : theme.icon.muted }} title={template.active ? 'Deactivate' : 'Activate'}>
                        {template.active ? <Power size={18} /> : <PowerOff size={18} />}
                      </button>
                      <button onClick={() => handleDuplicateTemplate(template)} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: theme.icon.primary }} title="Duplicate">
                        <Copy size={18} />
                      </button>
                      <button onClick={() => setSelectedTemplate(template)} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: theme.accent.primary }} title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => setShowDeleteTemplateModal(template)} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: theme.status.error }} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Auto-Rules */}
      {activeSubMenu === 'Auto-Rules' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
              <input type="text" placeholder="Search rules..." value={ruleSearch} onChange={(e) => setRuleSearch(e.target.value)} className="glass-card pl-9 pr-3 py-2 rounded-lg text-sm w-full outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
            </div>
            <button onClick={() => { setNewRule({ name: '', description: '', trigger: 'package_pickup', channels: ['sms'], delay: '0m', templateId: '' }); setShowCreateRuleModal(true); }} className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm whitespace-nowrap" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
              <Plus size={16} />New Rule
            </button>
          </div>

          {loading ? <TableSkeleton rows={3} cols={1} /> : filteredRules.length === 0 ? (
            <EmptyState icon={Bell} title="No automation rules found" description="Create rules to automatically send notifications" action={{ label: 'Create Rule', onClick: () => { setNewRule({ name: '', description: '', trigger: 'package_pickup', channels: ['sms'], delay: '0m', templateId: '' }); setShowCreateRuleModal(true); } }} />
          ) : (
            <div className="grid gap-4">
              {filteredRules.map((rule) => (
                <GlassCard key={rule.id} style={{ borderColor: rule.active ? theme.accent.primary + '30' : undefined }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold" style={{ color: theme.text.primary }}>{rule.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded-full ${rule.active ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}`}>
                          {rule.active ? '● Active' : '○ Paused'}
                        </span>
                      </div>
                      <p className="text-sm mb-3" style={{ color: theme.text.secondary }}>{rule.description}</p>
                      <div className="flex flex-wrap gap-3 text-xs" style={{ color: theme.text.muted }}>
                        <span className="px-2 py-1 rounded" style={{ backgroundColor: theme.bg.tertiary }}>Trigger: {rule.trigger}</span>
                        <span className="px-2 py-1 rounded" style={{ backgroundColor: theme.bg.tertiary }}>Channels: {(typeof rule.channels === 'string' ? JSON.parse(rule.channels) : rule.channels).join(', ')}</span>
                        <span className="px-2 py-1 rounded" style={{ backgroundColor: theme.bg.tertiary }}>Delay: {rule.delay}</span>
                        <span className="px-2 py-1 rounded" style={{ backgroundColor: theme.bg.tertiary }}>Fired: {(rule.firedCount ?? rule.fired ?? 0).toLocaleString()}x</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => handleTestRule(rule)} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: theme.accent.primary }} title="Test Rule">
                        <Play size={18} />
                      </button>
                      <button onClick={() => handleToggleRule(rule.id)} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: rule.active ? theme.status.warning : theme.status.success }} title={rule.active ? 'Pause' : 'Activate'}>
                        {rule.active ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <button onClick={() => setSelectedRule(rule)} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: theme.accent.primary }} title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => setShowDeleteRuleModal(rule)} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: theme.status.error }} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {activeSubMenu === 'History' && (
        <GlassCard noPadding className="overflow-hidden">
          <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Full Message History</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
                <input type="text" placeholder="Search by recipient, phone, or waybill..." value={msgSearch} onChange={(e) => setMsgSearch(e.target.value)} className="glass-card pl-9 pr-3 py-2 rounded-lg text-sm w-full outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <select value={msgChannelFilter} onChange={(e) => setMsgChannelFilter(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ backgroundColor: theme.bg.input, color: theme.text.primary }}>
                <option value="all">All Channels</option>
                <option value="sms">SMS</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="email">Email</option>
              </select>
            </div>
          </div>

          {loading ? <TableSkeleton rows={10} cols={8} /> : filteredMessages.length === 0 ? (
            <EmptyState icon={History} title="No message history" description="Messages will appear here once sent" />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${theme.border.primary}`, backgroundColor: theme.bg.tertiary }}>
                    <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>ID</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Recipient</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Waybill</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Template</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Channel</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Sent</th>
                    <th className="text-left p-3 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.map((msg) => {
                    const statusConfig = MSG_STATUSES[msg.status];
                    return (
                      <tr key={msg.id} style={{ borderBottom: `1px solid ${theme.border.primary}` }} className="hover:bg-opacity-50" onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.bg.tertiary} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                        <td className="p-3"><span className="text-xs font-mono" style={{ color: theme.text.muted }}>{msg.id}</span></td>
                        <td className="p-3">
                          <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{msg.recipient}</p>
                          <p className="text-xs" style={{ color: theme.text.muted }}>{msg.phone}</p>
                        </td>
                        <td className="p-3"><span className="text-xs font-mono" style={{ color: theme.accent.primary }}>{msg.waybill}</span></td>
                        <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{msg.template?.name ?? msg.template ?? '—'}</span></td>
                        <td className="p-3">
                          <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ backgroundColor: msg.channel === 'sms' ? `${theme.status.success}15` : msg.channel === 'whatsapp' ? `${theme.chart.violet}15` : `${theme.accent.primary}15`, color: msg.channel === 'sms' ? theme.status.success : msg.channel === 'whatsapp' ? theme.chart.violet : theme.accent.primary }}>
                            {msg.channel}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-full w-fit" style={{ backgroundColor: statusConfig?.bg, color: statusConfig?.color }}>
                            {statusConfig?.icon} {statusConfig?.label}
                          </span>
                        </td>
                        <td className="p-3"><span className="text-xs" style={{ color: theme.text.secondary }}>{msg.sentAt}</span></td>
                        <td className="p-3"><span className="text-sm font-medium" style={{ color: theme.text.primary }}>GH₵ {msg.cost.toFixed(2)}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      )}

      {/* Settings */}
      {activeSubMenu === 'Settings' && (
        <div className="space-y-6">
          {/* Settings Tabs */}
          <div className="flex gap-2 border-b" style={{ borderColor: theme.border.primary }}>
            <button
              onClick={() => setSettingsTab('channels')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${settingsTab === 'channels' ? 'border-blue-500' : 'border-transparent'}`}
              style={{ color: settingsTab === 'channels' ? theme.text.primary : theme.text.secondary }}
            >
              Channels & APIs
            </button>
            <button
              onClick={() => setSettingsTab('preferences')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${settingsTab === 'preferences' ? 'border-blue-500' : 'border-transparent'}`}
              style={{ color: settingsTab === 'preferences' ? theme.text.primary : theme.text.secondary }}
            >
              Preferences
            </button>
            <button
              onClick={() => setSettingsTab('advanced')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${settingsTab === 'advanced' ? 'border-blue-500' : 'border-transparent'}`}
              style={{ color: settingsTab === 'advanced' ? theme.text.primary : theme.text.secondary }}
            >
              Advanced
            </button>
          </div>

          {/* Channels & APIs Tab */}
          {settingsTab === 'channels' && (
            <div className="space-y-6">
              <GlassCard className="p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
                  <Bell size={20} />Channel Settings
                </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <div>
                  <p className="font-medium" style={{ color: theme.text.primary }}>SMS Notifications</p>
                  <p className="text-sm" style={{ color: theme.text.muted }}>Send SMS messages to customers</p>
                </div>
                <button onClick={() => setNotificationSettings(prev => ({ ...prev, smsEnabled: !prev.smsEnabled }))} className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.smsEnabled ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.smsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <div>
                  <p className="font-medium" style={{ color: theme.text.primary }}>WhatsApp Notifications</p>
                  <p className="text-sm" style={{ color: theme.text.muted }}>Send WhatsApp messages to customers</p>
                </div>
                <button onClick={() => setNotificationSettings(prev => ({ ...prev, whatsappEnabled: !prev.whatsappEnabled }))} className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.whatsappEnabled ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.whatsappEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <div>
                  <p className="font-medium" style={{ color: theme.text.primary }}>Email Notifications</p>
                  <p className="text-sm" style={{ color: theme.text.muted }}>Send email messages to customers</p>
                </div>
                <button onClick={() => setNotificationSettings(prev => ({ ...prev, emailEnabled: !prev.emailEnabled }))} className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.emailEnabled ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.emailEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <div>
                  <p className="font-medium" style={{ color: theme.text.primary }}>Push Notifications</p>
                  <p className="text-sm" style={{ color: theme.text.muted }}>Send push notifications via mobile app</p>
                </div>
                <button onClick={() => setNotificationSettings(prev => ({ ...prev, pushEnabled: !prev.pushEnabled }))} className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.pushEnabled ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.pushEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <TrendingUp size={20} />Rate Limits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>SMS per hour</label>
                <input type="number" value={notificationSettings.rateLimitSMS} onChange={(e) => setNotificationSettings(prev => ({ ...prev, rateLimitSMS: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>WhatsApp per hour</label>
                <input type="number" value={notificationSettings.rateLimitWA} onChange={(e) => setNotificationSettings(prev => ({ ...prev, rateLimitWA: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Email per hour</label>
                <input type="number" value={notificationSettings.rateLimitEmail} onChange={(e) => setNotificationSettings(prev => ({ ...prev, rateLimitEmail: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <Mail size={20} />Sender Configuration
            </h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Default SMS Sender</label>
                <input type="text" value={notificationSettings.defaultSender} onChange={(e) => setNotificationSettings(prev => ({ ...prev, defaultSender: e.target.value }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Email Reply-To Address</label>
                <input type="email" value={notificationSettings.replyTo} onChange={(e) => setNotificationSettings(prev => ({ ...prev, replyTo: e.target.value }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
            </div>
          </GlassCard>

          {/* SMS Gateway Configuration */}
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <Smartphone size={20} />SMS Gateway Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>SMS Provider</label>
                <select
                  value={notificationSettings.smsProvider}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsProvider: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg outline-none"
                  style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                >
                  <option value="hubtel">Hubtel</option>
                  <option value="twilio">Twilio</option>
                </select>
                <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Select your SMS gateway provider</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Client ID</label>
                  <input
                    type="password"
                    value={notificationSettings.smsApiKey}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsApiKey: e.target.value }))}
                    placeholder="Enter Hubtel Client ID"
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Client Secret</label>
                  <input
                    type="password"
                    value={notificationSettings.smsApiSecret}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsApiSecret: e.target.value }))}
                    placeholder="Enter Hubtel Client Secret"
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Username / Account SID</label>
                <input
                  type="text"
                  value={notificationSettings.smsUsername}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsUsername: e.target.value }))}
                  placeholder="Enter username or account SID"
                  className="w-full px-3 py-2 rounded-lg outline-none"
                  style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                />
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Webhook URL (Delivery Reports)</label>
                <input
                  type="url"
                  value={notificationSettings.smsWebhookUrl}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsWebhookUrl: e.target.value }))}
                  placeholder="https://api.locqar.com/webhooks/sms"
                  className="w-full px-3 py-2 rounded-lg outline-none"
                  style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                />
                <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Configure this URL in your SMS provider dashboard</p>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <CheckCircle2 size={16} style={{ color: theme.status.success }} />
                <span className="text-sm" style={{ color: theme.text.secondary }}>Connection status: <span style={{ color: theme.status.success }}>Connected</span></span>
                <button className="ml-auto px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: theme.bg.hover, color: theme.text.primary }}>Test Connection</button>
              </div>
            </div>
          </GlassCard>

          {/* WhatsApp Business API Configuration */}
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <MessageSquare size={20} />WhatsApp Business API Configuration
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Business Account ID</label>
                <input
                  type="text"
                  value={notificationSettings.waBusinessAccountId}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, waBusinessAccountId: e.target.value }))}
                  placeholder="Enter WhatsApp Business Account ID"
                  className="w-full px-3 py-2 rounded-lg outline-none"
                  style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                />
                <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Found in WhatsApp Business Manager</p>
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Phone Number ID</label>
                <input
                  type="text"
                  value={notificationSettings.waPhoneNumberId}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, waPhoneNumberId: e.target.value }))}
                  placeholder="Enter Phone Number ID"
                  className="w-full px-3 py-2 rounded-lg outline-none"
                  style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                />
                <p className="text-xs mt-1" style={{ color: theme.text.muted }}>The phone number ID for sending messages</p>
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Access Token</label>
                <input
                  type="password"
                  value={notificationSettings.waAccessToken}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, waAccessToken: e.target.value }))}
                  placeholder="Enter permanent access token"
                  className="w-full px-3 py-2 rounded-lg outline-none"
                  style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                />
                <p className="text-xs mt-1" style={{ color: theme.text.muted }}>System user access token from Meta Business</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Webhook Verify Token</label>
                  <input
                    type="text"
                    value={notificationSettings.waWebhookVerifyToken}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, waWebhookVerifyToken: e.target.value }))}
                    placeholder="Enter verify token"
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Webhook URL</label>
                  <input
                    type="url"
                    value={notificationSettings.waWebhookUrl}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, waWebhookUrl: e.target.value }))}
                    placeholder="https://api.locqar.com/webhooks/whatsapp"
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <CheckCircle2 size={16} style={{ color: theme.status.success }} />
                <span className="text-sm" style={{ color: theme.text.secondary }}>Connection status: <span style={{ color: theme.status.success }}>Connected</span></span>
                <button className="ml-auto px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: theme.bg.hover, color: theme.text.primary }}>Test Connection</button>
              </div>

              <div className="p-4 rounded-lg border-l-4" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.accent.primary }}>
                <p className="text-sm font-medium mb-1" style={{ color: theme.text.primary }}>Message Templates</p>
                <p className="text-xs" style={{ color: theme.text.muted }}>
                  WhatsApp requires pre-approved templates for business-initiated messages.
                  <a href="#" className="ml-1" style={{ color: theme.accent.primary }}>Manage templates →</a>
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Email SMTP Configuration */}
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <Mail size={20} />Email SMTP Configuration
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>SMTP Host</label>
                  <input
                    type="text"
                    value={notificationSettings.emailSmtpHost}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailSmtpHost: e.target.value }))}
                    placeholder="smtp.gmail.com"
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>SMTP Port</label>
                  <input
                    type="number"
                    value={notificationSettings.emailSmtpPort}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailSmtpPort: Number(e.target.value) }))}
                    placeholder="587"
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>SMTP Username</label>
                  <input
                    type="text"
                    value={notificationSettings.emailSmtpUsername}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailSmtpUsername: e.target.value }))}
                    placeholder="your-email@gmail.com"
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>SMTP Password</label>
                  <input
                    type="password"
                    value={notificationSettings.emailSmtpPassword}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailSmtpPassword: e.target.value }))}
                    placeholder="Enter password or app password"
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Encryption</label>
                <select
                  value={notificationSettings.emailSmtpEncryption}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailSmtpEncryption: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg outline-none"
                  style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                >
                  <option value="tls">TLS (Port 587)</option>
                  <option value="ssl">SSL (Port 465)</option>
                  <option value="none">None (Port 25 - Not Recommended)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>From Name</label>
                  <input
                    type="text"
                    value={notificationSettings.emailFromName}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailFromName: e.target.value }))}
                    placeholder="LocQar"
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>From Address</label>
                  <input
                    type="email"
                    value={notificationSettings.emailFromAddress}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailFromAddress: e.target.value }))}
                    placeholder="noreply@locqar.com"
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <CheckCircle2 size={16} style={{ color: theme.status.success }} />
                <span className="text-sm" style={{ color: theme.text.secondary }}>Connection status: <span style={{ color: theme.status.success }}>Connected</span></span>
                <button className="ml-auto px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: theme.bg.hover, color: theme.text.primary }}>Test Connection</button>
              </div>
            </div>
          </GlassCard>

          <div className="flex justify-end">
            <button onClick={handleSaveSettings} className="btn-primary px-6 py-3 rounded-xl font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
              Save Channel Settings
            </button>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {settingsTab === 'preferences' && (
        <div className="space-y-6">
          {/* Event Preferences */}
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <Package size={20} />Event Notification Preferences
            </h3>
            <p className="text-sm mb-4" style={{ color: theme.text.muted }}>Choose which events trigger customer notifications</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <span className="text-sm" style={{ color: theme.text.primary }}>Package Pickup</span>
                <input type="checkbox" checked={notificationSettings.notifyOnPickup} onChange={(e) => setNotificationSettings(prev => ({ ...prev, notifyOnPickup: e.target.checked }))} className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <span className="text-sm" style={{ color: theme.text.primary }}>In Transit Updates</span>
                <input type="checkbox" checked={notificationSettings.notifyOnInTransit} onChange={(e) => setNotificationSettings(prev => ({ ...prev, notifyOnInTransit: e.target.checked }))} className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <span className="text-sm" style={{ color: theme.text.primary }}>Delivery Confirmation</span>
                <input type="checkbox" checked={notificationSettings.notifyOnDelivered} onChange={(e) => setNotificationSettings(prev => ({ ...prev, notifyOnDelivered: e.target.checked }))} className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <span className="text-sm" style={{ color: theme.text.primary }}>Delivery Delays</span>
                <input type="checkbox" checked={notificationSettings.notifyOnDelay} onChange={(e) => setNotificationSettings(prev => ({ ...prev, notifyOnDelay: e.target.checked }))} className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <span className="text-sm" style={{ color: theme.text.primary }}>Storage Full Alerts</span>
                <input type="checkbox" checked={notificationSettings.notifyOnStorageFull} onChange={(e) => setNotificationSettings(prev => ({ ...prev, notifyOnStorageFull: e.target.checked }))} className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <span className="text-sm" style={{ color: theme.text.primary }}>SLA Breaches</span>
                <input type="checkbox" checked={notificationSettings.notifyOnSLABreach} onChange={(e) => setNotificationSettings(prev => ({ ...prev, notifyOnSLABreach: e.target.checked }))} className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <span className="text-sm" style={{ color: theme.text.primary }}>Payment Due</span>
                <input type="checkbox" checked={notificationSettings.notifyOnPaymentDue} onChange={(e) => setNotificationSettings(prev => ({ ...prev, notifyOnPaymentDue: e.target.checked }))} className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <span className="text-sm" style={{ color: theme.text.primary }}>Package Expiry</span>
                <input type="checkbox" checked={notificationSettings.notifyOnPackageExpiry} onChange={(e) => setNotificationSettings(prev => ({ ...prev, notifyOnPackageExpiry: e.target.checked }))} className="w-4 h-4" />
              </div>
            </div>
          </GlassCard>

          {/* Retry Policies */}
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <RefreshCw size={20} />Retry Policies
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <div>
                  <p className="font-medium" style={{ color: theme.text.primary }}>Enable Automatic Retries</p>
                  <p className="text-sm" style={{ color: theme.text.muted }}>Retry failed notifications automatically</p>
                </div>
                <button onClick={() => setNotificationSettings(prev => ({ ...prev, retryEnabled: !prev.retryEnabled }))} className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.retryEnabled ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.retryEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {notificationSettings.retryEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Maximum Retries</label>
                    <input type="number" min="1" max="10" value={notificationSettings.maxRetries} onChange={(e) => setNotificationSettings(prev => ({ ...prev, maxRetries: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Retry Delay (minutes)</label>
                    <input type="number" min="1" max="60" value={notificationSettings.retryDelay} onChange={(e) => setNotificationSettings(prev => ({ ...prev, retryDelay: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Quiet Hours */}
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <Clock size={20} />Quiet Hours (Do Not Disturb)
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <div>
                  <p className="font-medium" style={{ color: theme.text.primary }}>Enable Quiet Hours</p>
                  <p className="text-sm" style={{ color: theme.text.muted }}>Pause non-urgent notifications during specified hours</p>
                </div>
                <button onClick={() => setNotificationSettings(prev => ({ ...prev, quietHoursEnabled: !prev.quietHoursEnabled }))} className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.quietHoursEnabled ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.quietHoursEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {notificationSettings.quietHoursEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Start Time</label>
                    <input type="time" value={notificationSettings.quietHoursStart} onChange={(e) => setNotificationSettings(prev => ({ ...prev, quietHoursStart: e.target.value }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>End Time</label>
                    <input type="time" value={notificationSettings.quietHoursEnd} onChange={(e) => setNotificationSettings(prev => ({ ...prev, quietHoursEnd: e.target.value }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          {/* Priority Settings */}
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <AlertTriangle size={20} />Priority Settings
            </h3>
            <p className="text-sm mb-4" style={{ color: theme.text.muted }}>Mark certain notification types as high priority to bypass quiet hours</p>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <span className="text-sm" style={{ color: theme.text.primary }}>SLA Breach Alerts (Always send)</span>
                <input type="checkbox" checked={notificationSettings.highPrioritySLA} onChange={(e) => setNotificationSettings(prev => ({ ...prev, highPrioritySLA: e.target.checked }))} className="w-4 h-4" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <span className="text-sm" style={{ color: theme.text.primary }}>Payment Reminders (Always send)</span>
                <input type="checkbox" checked={notificationSettings.highPriorityPayments} onChange={(e) => setNotificationSettings(prev => ({ ...prev, highPriorityPayments: e.target.checked }))} className="w-4 h-4" />
              </div>
            </div>
          </GlassCard>

          {/* Batch Settings */}
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <Layers size={20} />Batch Processing
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: theme.bg.tertiary }}>
                <div>
                  <p className="font-medium" style={{ color: theme.text.primary }}>Enable Batch Processing</p>
                  <p className="text-sm" style={{ color: theme.text.muted }}>Group notifications for efficient sending</p>
                </div>
                <button onClick={() => setNotificationSettings(prev => ({ ...prev, batchEnabled: !prev.batchEnabled }))} className={`w-12 h-6 rounded-full transition-colors ${notificationSettings.batchEnabled ? 'bg-green-500' : 'bg-gray-400'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notificationSettings.batchEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {notificationSettings.batchEnabled && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Batch Size</label>
                    <input type="number" min="10" max="500" value={notificationSettings.batchSize} onChange={(e) => setNotificationSettings(prev => ({ ...prev, batchSize: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
                    <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Number of notifications per batch</p>
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Batch Interval (minutes)</label>
                    <input type="number" min="1" max="60" value={notificationSettings.batchInterval} onChange={(e) => setNotificationSettings(prev => ({ ...prev, batchInterval: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
                    <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Time between batch sends</p>
                  </div>
                </div>
              )}
            </div>
          </GlassCard>

          <div className="flex justify-end">
            <button onClick={handleSaveSettings} className="btn-primary px-6 py-3 rounded-xl font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {settingsTab === 'advanced' && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <TrendingUp size={20} />Rate Limits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>SMS per hour</label>
                <input type="number" value={notificationSettings.rateLimitSMS} onChange={(e) => setNotificationSettings(prev => ({ ...prev, rateLimitSMS: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>WhatsApp per hour</label>
                <input type="number" value={notificationSettings.rateLimitWA} onChange={(e) => setNotificationSettings(prev => ({ ...prev, rateLimitWA: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Email per hour</label>
                <input type="number" value={notificationSettings.rateLimitEmail} onChange={(e) => setNotificationSettings(prev => ({ ...prev, rateLimitEmail: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <Mail size={20} />Sender Configuration
            </h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Default SMS Sender</label>
                <input type="text" value={notificationSettings.defaultSender} onChange={(e) => setNotificationSettings(prev => ({ ...prev, defaultSender: e.target.value }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Email Reply-To Address</label>
                <input type="email" value={notificationSettings.replyTo} onChange={(e) => setNotificationSettings(prev => ({ ...prev, replyTo: e.target.value }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
            </div>
          </GlassCard>

          <div className="flex justify-end">
            <button onClick={handleSaveSettings} className="btn-primary px-6 py-3 rounded-xl font-medium" style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}>
              Save Advanced Settings
            </button>
          </div>
        </div>
      )}
        </div>
      )}
      {/* ── Delete Template Confirmation Modal ─────────────────────── */}
      {showDeleteTemplateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowDeleteTemplateModal(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-md mx-4 rounded-xl border shadow-2xl" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: theme.border.primary }}>
              <h3 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Delete Template</h3>
              <button onClick={() => setShowDeleteTemplateModal(null)} className="p-1 rounded-lg hover:bg-opacity-10" style={{ color: theme.icon.muted }}>
                <X size={20} />
              </button>
            </div>
            {/* Body */}
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full" style={{ backgroundColor: `${theme.status.error}15` }}>
                  <AlertTriangle size={20} style={{ color: theme.status.error }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: theme.text.primary }}>
                    Are you sure you want to delete the template <strong>"{showDeleteTemplateModal.name}"</strong>?
                  </p>
                  <p className="text-xs mt-2" style={{ color: theme.text.muted }}>
                    This template has been sent {showDeleteTemplateModal.sentCount?.toLocaleString() ?? 0} times. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-3 p-5 border-t" style={{ borderColor: theme.border.primary }}>
              <button onClick={() => setShowDeleteTemplateModal(null)} className="btn-outline px-4 py-2 rounded-xl text-sm border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteTemplateMut.mutate(showDeleteTemplateModal.id, {
                    onSuccess: () => { addToast({ type: 'success', message: `Template "${showDeleteTemplateModal.name}" deleted` }); setShowDeleteTemplateModal(null); },
                    onError: () => addToast({ type: 'error', message: 'Failed to delete template' }),
                  });
                }}
                disabled={deleteTemplateMut.isPending}
                className="btn-primary px-4 py-2 rounded-xl text-sm"
                style={{ backgroundColor: theme.status.error, color: '#fff', opacity: deleteTemplateMut.isPending ? 0.6 : 1 }}
              >
                {deleteTemplateMut.isPending ? 'Deleting...' : 'Delete Template'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create Rule Modal ─────────────────────────────────────── */}
      {showCreateRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowCreateRuleModal(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-lg mx-4 rounded-xl border shadow-2xl max-h-[90vh] overflow-y-auto" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: theme.border.primary }}>
              <h3 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Create Automation Rule</h3>
              <button onClick={() => setShowCreateRuleModal(false)} className="p-1 rounded-lg hover:bg-opacity-10" style={{ color: theme.icon.muted }}>
                <X size={20} />
              </button>
            </div>
            {/* Body */}
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: theme.text.secondary }}>Rule Name</label>
                <input
                  type="text"
                  value={newRule.name}
                  onChange={(e) => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Package Pickup Notification"
                  className="w-full px-3 py-2 rounded-xl outline-none border"
                  style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: theme.text.secondary }}>Description</label>
                <textarea
                  value={newRule.description}
                  onChange={(e) => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="What does this rule do?"
                  rows={2}
                  className="w-full px-3 py-2 rounded-xl outline-none border resize-none"
                  style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
                />
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: theme.text.secondary }}>Trigger Event</label>
                <select
                  value={newRule.trigger}
                  onChange={(e) => setNewRule(prev => ({ ...prev, trigger: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl outline-none border"
                  style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
                >
                  <option value="package_pickup">Package Pickup</option>
                  <option value="package_delivered">Package Delivered</option>
                  <option value="package_in_transit">Package In Transit</option>
                  <option value="delivery_delay">Delivery Delay</option>
                  <option value="storage_full">Storage Full</option>
                  <option value="sla_breach">SLA Breach</option>
                  <option value="payment_due">Payment Due</option>
                  <option value="package_expiry">Package Expiry</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: theme.text.secondary }}>Channels</label>
                <div className="flex gap-3">
                  {['sms', 'whatsapp', 'email'].map((ch) => (
                    <label key={ch} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: theme.text.primary }}>
                      <input
                        type="checkbox"
                        checked={newRule.channels.includes(ch)}
                        onChange={(e) => {
                          setNewRule(prev => ({
                            ...prev,
                            channels: e.target.checked
                              ? [...prev.channels, ch]
                              : prev.channels.filter(c => c !== ch),
                          }));
                        }}
                        className="w-4 h-4"
                      />
                      <span className="capitalize">{ch}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: theme.text.secondary }}>Delay</label>
                <select
                  value={newRule.delay}
                  onChange={(e) => setNewRule(prev => ({ ...prev, delay: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl outline-none border"
                  style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
                >
                  <option value="0m">Immediate</option>
                  <option value="5m">5 minutes</option>
                  <option value="15m">15 minutes</option>
                  <option value="30m">30 minutes</option>
                  <option value="1h">1 hour</option>
                  <option value="2h">2 hours</option>
                  <option value="24h">24 hours</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1.5 font-medium" style={{ color: theme.text.secondary }}>Template</label>
                <select
                  value={newRule.templateId}
                  onChange={(e) => setNewRule(prev => ({ ...prev, templateId: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl outline-none border"
                  style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
                >
                  <option value="">Select a template...</option>
                  {templatesData.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.channel})</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-3 p-5 border-t" style={{ borderColor: theme.border.primary }}>
              <button onClick={() => setShowCreateRuleModal(false)} className="btn-outline px-4 py-2 rounded-xl text-sm border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!newRule.name.trim()) { addToast({ type: 'error', message: 'Rule name is required' }); return; }
                  if (newRule.channels.length === 0) { addToast({ type: 'error', message: 'Select at least one channel' }); return; }
                  createRuleMut.mutate(newRule, {
                    onSuccess: () => { addToast({ type: 'success', message: `Rule "${newRule.name}" created` }); setShowCreateRuleModal(false); },
                    onError: () => addToast({ type: 'error', message: 'Failed to create rule' }),
                  });
                }}
                disabled={createRuleMut.isPending}
                className="btn-primary px-4 py-2 rounded-xl text-sm"
                style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast, opacity: createRuleMut.isPending ? 0.6 : 1 }}
              >
                {createRuleMut.isPending ? 'Creating...' : 'Create Rule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Rule Confirmation Modal ─────────────────────────── */}
      {showDeleteRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowDeleteRuleModal(null)}>
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative w-full max-w-md mx-4 rounded-xl border shadow-2xl" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: theme.border.primary }}>
              <h3 className="text-lg font-semibold" style={{ color: theme.text.primary }}>Delete Rule</h3>
              <button onClick={() => setShowDeleteRuleModal(null)} className="p-1 rounded-lg hover:bg-opacity-10" style={{ color: theme.icon.muted }}>
                <X size={20} />
              </button>
            </div>
            {/* Body */}
            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full" style={{ backgroundColor: `${theme.status.error}15` }}>
                  <AlertTriangle size={20} style={{ color: theme.status.error }} />
                </div>
                <div>
                  <p className="text-sm" style={{ color: theme.text.primary }}>
                    Are you sure you want to delete the rule <strong>"{showDeleteRuleModal.name}"</strong>?
                  </p>
                  <p className="text-xs mt-2" style={{ color: theme.text.muted }}>
                    This rule has fired {(showDeleteRuleModal.firedCount ?? showDeleteRuleModal.fired ?? 0).toLocaleString()} times. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-3 p-5 border-t" style={{ borderColor: theme.border.primary }}>
              <button onClick={() => setShowDeleteRuleModal(null)} className="btn-outline px-4 py-2 rounded-xl text-sm border" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteRuleMut.mutate(showDeleteRuleModal.id, {
                    onSuccess: () => { addToast({ type: 'success', message: `Rule "${showDeleteRuleModal.name}" deleted` }); setShowDeleteRuleModal(null); },
                    onError: () => addToast({ type: 'error', message: 'Failed to delete rule' }),
                  });
                }}
                disabled={deleteRuleMut.isPending}
                className="btn-primary px-4 py-2 rounded-xl text-sm"
                style={{ backgroundColor: theme.status.error, color: '#fff', opacity: deleteRuleMut.isPending ? 0.6 : 1 }}
              >
                {deleteRuleMut.isPending ? 'Deleting...' : 'Delete Rule'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
