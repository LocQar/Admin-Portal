import React from 'react';
import { Download, Send, MessageSquare, CheckCircle2, Eye, AlertTriangle, Banknote, Smartphone, Mail, Bell, Search, Plus, Edit, Trash2, Power, PowerOff, Copy, Play, Pause, X, Filter, Calendar, TrendingUp, BarChart3, Package, Clock, RefreshCw, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard, TableSkeleton, Pagination, EmptyState, StatusBadge } from '../components/ui';
import { smsTemplatesData, notificationHistoryData, autoRulesData, msgVolumeData, MSG_STATUSES } from '../constants/mockData';

export const NotificationsPage = ({ currentUser, activeSubMenu, loading, setShowExport, setComposeOpen, addToast }) => {
  const { theme } = useTheme();

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

  // Settings state
  const [notificationSettings, setNotificationSettings] = React.useState({
    // Channel toggles
    smsEnabled: true,
    whatsappEnabled: true,
    emailEnabled: false,
    pushEnabled: true,
    // Rate limits
    rateLimitSMS: 100,
    rateLimitWA: 200,
    rateLimitEmail: 50,
    // Sender config
    defaultSender: 'LocQar',
    replyTo: 'support@locqar.com',
    // Event preferences
    notifyOnPickup: true,
    notifyOnInTransit: true,
    notifyOnDelivered: true,
    notifyOnDelay: true,
    notifyOnStorageFull: true,
    notifyOnSLABreach: true,
    notifyOnPaymentDue: false,
    notifyOnPackageExpiry: true,
    // Retry policies
    retryEnabled: true,
    maxRetries: 3,
    retryDelay: 5, // minutes
    // Quiet hours
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    // Priority settings
    highPrioritySLA: true,
    highPriorityPayments: false,
    // Batch settings
    batchEnabled: true,
    batchSize: 50,
    batchInterval: 2, // minutes
    // SMS Gateway config
    smsProvider: 'africas_talking',
    smsApiKey: '',
    smsApiSecret: '',
    smsUsername: '',
    smsWebhookUrl: 'https://api.locqar.com/webhooks/sms',
    // WhatsApp Business API config
    waBusinessAccountId: '',
    waPhoneNumberId: '',
    waAccessToken: '',
    waWebhookVerifyToken: '',
    waWebhookUrl: 'https://api.locqar.com/webhooks/whatsapp',
    // Email SMTP config
    emailSmtpHost: 'smtp.gmail.com',
    emailSmtpPort: 587,
    emailSmtpUsername: '',
    emailSmtpPassword: '',
    emailSmtpEncryption: 'tls',
    emailFromName: 'LocQar',
    emailFromAddress: 'noreply@locqar.com',
  });

  // Settings sub-tab
  const [settingsTab, setSettingsTab] = React.useState('channels');

  // Filtered messages
  const filteredMessages = React.useMemo(() => {
    let result = [...notificationHistoryData];
    if (msgSearch) {
      const q = msgSearch.toLowerCase();
      result = result.filter(m =>
        m.recipient.toLowerCase().includes(q) ||
        m.waybill.toLowerCase().includes(q) ||
        m.phone.includes(q) ||
        m.template.toLowerCase().includes(q)
      );
    }
    if (msgChannelFilter !== 'all') result = result.filter(m => m.channel === msgChannelFilter);
    if (msgStatusFilter !== 'all') result = result.filter(m => m.status === msgStatusFilter);
    if (msgDateFilter === 'today') result = result.filter(m => m.sentAt.includes('2024-01-15'));
    return result;
  }, [msgSearch, msgChannelFilter, msgStatusFilter, msgDateFilter]);

  const paginatedMessages = React.useMemo(() => {
    const start = (msgPage - 1) * msgPageSize;
    return filteredMessages.slice(start, start + msgPageSize);
  }, [filteredMessages, msgPage, msgPageSize]);

  const totalMsgPages = Math.ceil(filteredMessages.length / msgPageSize);

  // Filtered templates
  const filteredTemplates = React.useMemo(() => {
    let result = [...smsTemplatesData];
    if (templateSearch) {
      const q = templateSearch.toLowerCase();
      result = result.filter(t => t.name.toLowerCase().includes(q) || t.message.toLowerCase().includes(q));
    }
    if (templateChannelFilter !== 'all') result = result.filter(t => t.channel === templateChannelFilter);
    return result;
  }, [templateSearch, templateChannelFilter]);

  // Filtered rules
  const filteredRules = React.useMemo(() => {
    let result = [...autoRulesData];
    if (ruleSearch) {
      const q = ruleSearch.toLowerCase();
      result = result.filter(r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }
    return result;
  }, [ruleSearch]);

  const handleToggleTemplate = (templateId) => {
    addToast({ type: 'success', message: 'Template status updated' });
  };

  const handleToggleRule = (ruleId) => {
    addToast({ type: 'success', message: 'Rule status updated' });
  };

  const handleDuplicateTemplate = (template) => {
    addToast({ type: 'success', message: `Template "${template.name}" duplicated` });
  };

  const handleTestRule = (rule) => {
    addToast({ type: 'info', message: `Testing rule "${rule.name}"...` });
  };

  const handleSaveSettings = () => {
    addToast({ type: 'success', message: 'Notification settings saved successfully' });
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
            <MessageSquare size={28} style={{ color: '#10b981' }} /> Notifications
          </h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Message Center'} • Manage customer communications</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Download size={16} />Export
          </button>
          <button onClick={() => setComposeOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: '#10b981' }}>
            <Send size={18} />Send Message
          </button>
        </div>
      </div>

      {/* Message Center */}
      {(!activeSubMenu || activeSubMenu === 'Message Center') && (
        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MetricCard title="Sent Today" value={notificationHistoryData.filter(n => n.sentAt.includes('2024-01-15')).length.toLocaleString()} icon={Send} loading={loading} subtitle="SMS + WhatsApp + Email" />
            <MetricCard title="Delivered" value={notificationHistoryData.filter(n => ['delivered','read','opened'].includes(n.status)).length} change="98.2%" changeType="up" icon={CheckCircle2} loading={loading} />
            <MetricCard title="Opened" value={notificationHistoryData.filter(n => ['read','opened'].includes(n.status)).length} icon={Eye} loading={loading} subtitle="WA read + Email opened" />
            <MetricCard title="Failed" value={notificationHistoryData.filter(n => ['failed','bounced'].includes(n.status)).length} icon={AlertTriangle} loading={loading} />
            <MetricCard title="Cost Today" value={`GH₵ ${notificationHistoryData.reduce((s, n) => s + n.cost, 0).toFixed(2)}`} icon={Banknote} loading={loading} />
          </div>

          {/* Message Volume Chart */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Message Volume (Last 7 Days)</h3>
              <div className="flex gap-2 text-xs">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#10b981' }} />SMS</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#8b5cf6' }} />WhatsApp</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ backgroundColor: '#3b82f6' }} />Email</span>
              </div>
            </div>
            {loading ? <TableSkeleton rows={3} cols={1} /> : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={msgVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: theme.text.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: theme.text.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: theme.bg.card, border: `1px solid ${theme.border.primary}`, borderRadius: 8 }} />
                  <Line type="monotone" dataKey="sms" stroke="#10b981" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="whatsapp" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="email" stroke="#3b82f6" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Recent Messages Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-3" style={{ borderColor: theme.border.primary }}>
              <h3 className="font-semibold" style={{ color: theme.text.primary }}>Recent Messages</h3>
              <div className="flex gap-2">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
                  <input type="text" placeholder="Search messages..." value={msgSearch} onChange={(e) => setMsgSearch(e.target.value)} className="pl-9 pr-3 py-2 rounded-lg text-sm w-full md:w-64 outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary, borderColor: theme.border.primary }} />
                </div>
                <select value={msgChannelFilter} onChange={(e) => setMsgChannelFilter(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}>
                  <option value="all">All Channels</option>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                </select>
                <select value={msgStatusFilter} onChange={(e) => setMsgStatusFilter(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}>
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
                            <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{msg.template}</span></td>
                            <td className="p-3">
                              <span className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full w-fit capitalize" style={{ backgroundColor: msg.channel === 'sms' ? '#10b98115' : msg.channel === 'whatsapp' ? '#8b5cf615' : '#3b82f615', color: msg.channel === 'sms' ? '#10b981' : msg.channel === 'whatsapp' ? '#8b5cf6' : '#3b82f6' }}>
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
          </div>
        </div>
      )}

      {/* Templates */}
      {activeSubMenu === 'Templates' && (
        <div className="space-y-6">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
              <input type="text" placeholder="Search templates..." value={templateSearch} onChange={(e) => setTemplateSearch(e.target.value)} className="pl-9 pr-3 py-2 rounded-lg text-sm w-full outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
            </div>
            <select value={templateChannelFilter} onChange={(e) => setTemplateChannelFilter(e.target.value)} className="px-4 py-2 rounded-lg text-sm outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}>
              <option value="all">All Channels</option>
              <option value="sms">SMS</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
            <button onClick={() => setShowTemplateForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm whitespace-nowrap" style={{ backgroundColor: '#10b981' }}>
              <Plus size={16} />New Template
            </button>
          </div>

          {/* Templates Grid */}
          {loading ? <TableSkeleton rows={3} cols={2} /> : filteredTemplates.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No templates found" description="Create your first notification template" action={{ label: 'New Template', onClick: () => setShowTemplateForm(true) }} />
          ) : (
            <div className="grid gap-4">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="rounded-2xl border p-5" style={{ backgroundColor: theme.bg.card, borderColor: template.active ? theme.accent.primary + '30' : theme.border.primary }}>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold" style={{ color: theme.text.primary }}>{template.name}</h4>
                        <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ backgroundColor: template.channel === 'sms' ? '#10b98115' : template.channel === 'whatsapp' ? '#8b5cf615' : '#3b82f615', color: template.channel === 'sms' ? '#10b981' : template.channel === 'whatsapp' ? '#8b5cf6' : '#3b82f6' }}>
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
                        <span>Last sent: {template.lastSent}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => handleToggleTemplate(template.id)} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: template.active ? '#10b981' : theme.icon.muted }} title={template.active ? 'Deactivate' : 'Activate'}>
                        {template.active ? <Power size={18} /> : <PowerOff size={18} />}
                      </button>
                      <button onClick={() => handleDuplicateTemplate(template)} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: theme.icon.primary }} title="Duplicate">
                        <Copy size={18} />
                      </button>
                      <button onClick={() => setSelectedTemplate(template)} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: theme.accent.primary }} title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => addToast({ type: 'success', message: 'Template deleted' })} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: '#ef4444' }} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
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
              <input type="text" placeholder="Search rules..." value={ruleSearch} onChange={(e) => setRuleSearch(e.target.value)} className="pl-9 pr-3 py-2 rounded-lg text-sm w-full outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
            </div>
            <button onClick={() => addToast({ type: 'info', message: 'New rule form opened' })} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm whitespace-nowrap" style={{ backgroundColor: '#10b981' }}>
              <Plus size={16} />New Rule
            </button>
          </div>

          {loading ? <TableSkeleton rows={3} cols={1} /> : filteredRules.length === 0 ? (
            <EmptyState icon={Bell} title="No automation rules found" description="Create rules to automatically send notifications" action={{ label: 'Create Rule', onClick: () => addToast({ type: 'info', message: 'New rule form' }) }} />
          ) : (
            <div className="grid gap-4">
              {filteredRules.map((rule) => (
                <div key={rule.id} className="rounded-2xl border p-5" style={{ backgroundColor: theme.bg.card, borderColor: rule.active ? theme.accent.primary + '30' : theme.border.primary }}>
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
                        <span className="px-2 py-1 rounded" style={{ backgroundColor: theme.bg.tertiary }}>Channels: {rule.channels.join(', ')}</span>
                        <span className="px-2 py-1 rounded" style={{ backgroundColor: theme.bg.tertiary }}>Delay: {rule.delay}</span>
                        <span className="px-2 py-1 rounded" style={{ backgroundColor: theme.bg.tertiary }}>Fired: {rule.fired.toLocaleString()}x</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <button onClick={() => handleTestRule(rule)} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: theme.accent.primary }} title="Test Rule">
                        <Play size={18} />
                      </button>
                      <button onClick={() => handleToggleRule(rule.id)} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: rule.active ? '#f59e0b' : '#10b981' }} title={rule.active ? 'Pause' : 'Activate'}>
                        {rule.active ? <Pause size={18} /> : <Play size={18} />}
                      </button>
                      <button onClick={() => setSelectedRule(rule)} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: theme.accent.primary }} title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => addToast({ type: 'success', message: 'Rule deleted' })} className="p-2 rounded-lg hover:bg-opacity-10" style={{ color: '#ef4444' }} title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {activeSubMenu === 'History' && (
        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4" style={{ color: theme.text.primary }}>Full Message History</h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
                <input type="text" placeholder="Search by recipient, phone, or waybill..." value={msgSearch} onChange={(e) => setMsgSearch(e.target.value)} className="pl-9 pr-3 py-2 rounded-lg text-sm w-full outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
              </div>
              <select value={msgChannelFilter} onChange={(e) => setMsgChannelFilter(e.target.value)} className="px-3 py-2 rounded-lg text-sm outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}>
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
                        <td className="p-3"><span className="text-sm" style={{ color: theme.text.secondary }}>{msg.template}</span></td>
                        <td className="p-3">
                          <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ backgroundColor: msg.channel === 'sms' ? '#10b98115' : msg.channel === 'whatsapp' ? '#8b5cf615' : '#3b82f615', color: msg.channel === 'sms' ? '#10b981' : msg.channel === 'whatsapp' ? '#8b5cf6' : '#3b82f6' }}>
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
        </div>
      )}

      {/* Settings */}
      {activeSubMenu === 'Settings' && (
        <div className="space-y-6">
          {/* Settings Tabs */}
          <div className="flex gap-2 border-b" style={{ borderColor: theme.border.primary }}>
            <button
              onClick={() => setSettingsTab('channels')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${settingsTab === 'channels' ? 'border-blue-500' : 'border-transparent'}`}
              style={{ color: settingsTab === 'channels' ? '#3b82f6' : theme.text.secondary }}
            >
              Channels & APIs
            </button>
            <button
              onClick={() => setSettingsTab('preferences')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${settingsTab === 'preferences' ? 'border-blue-500' : 'border-transparent'}`}
              style={{ color: settingsTab === 'preferences' ? '#3b82f6' : theme.text.secondary }}
            >
              Preferences
            </button>
            <button
              onClick={() => setSettingsTab('advanced')}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${settingsTab === 'advanced' ? 'border-blue-500' : 'border-transparent'}`}
              style={{ color: settingsTab === 'advanced' ? '#3b82f6' : theme.text.secondary }}
            >
              Advanced
            </button>
          </div>

          {/* Channels & APIs Tab */}
          {settingsTab === 'channels' && (
            <div className="space-y-6">
              <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
          </div>

          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <TrendingUp size={20} />Rate Limits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>SMS per hour</label>
                <input type="number" value={notificationSettings.rateLimitSMS} onChange={(e) => setNotificationSettings(prev => ({ ...prev, rateLimitSMS: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>WhatsApp per hour</label>
                <input type="number" value={notificationSettings.rateLimitWA} onChange={(e) => setNotificationSettings(prev => ({ ...prev, rateLimitWA: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Email per hour</label>
                <input type="number" value={notificationSettings.rateLimitEmail} onChange={(e) => setNotificationSettings(prev => ({ ...prev, rateLimitEmail: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <Mail size={20} />Sender Configuration
            </h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Default SMS Sender</label>
                <input type="text" value={notificationSettings.defaultSender} onChange={(e) => setNotificationSettings(prev => ({ ...prev, defaultSender: e.target.value }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Email Reply-To Address</label>
                <input type="email" value={notificationSettings.replyTo} onChange={(e) => setNotificationSettings(prev => ({ ...prev, replyTo: e.target.value }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
              </div>
            </div>
          </div>

          {/* SMS Gateway Configuration */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
                  <option value="africas_talking">Africa's Talking</option>
                  <option value="twilio">Twilio</option>
                  <option value="nexmo">Nexmo (Vonage)</option>
                  <option value="messagebird">MessageBird</option>
                  <option value="custom">Custom Gateway</option>
                </select>
                <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Select your SMS gateway provider</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>API Key</label>
                  <input
                    type="password"
                    value={notificationSettings.smsApiKey}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsApiKey: e.target.value }))}
                    placeholder="Enter API Key"
                    className="w-full px-3 py-2 rounded-lg outline-none"
                    style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>API Secret</label>
                  <input
                    type="password"
                    value={notificationSettings.smsApiSecret}
                    onChange={(e) => setNotificationSettings(prev => ({ ...prev, smsApiSecret: e.target.value }))}
                    placeholder="Enter API Secret"
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
                <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                <span className="text-sm" style={{ color: theme.text.secondary }}>Connection status: <span style={{ color: '#10b981' }}>Connected</span></span>
                <button className="ml-auto px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: theme.bg.hover, color: theme.text.primary }}>Test Connection</button>
              </div>
            </div>
          </div>

          {/* WhatsApp Business API Configuration */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
                <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                <span className="text-sm" style={{ color: theme.text.secondary }}>Connection status: <span style={{ color: '#10b981' }}>Connected</span></span>
                <button className="ml-auto px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: theme.bg.hover, color: theme.text.primary }}>Test Connection</button>
              </div>

              <div className="p-4 rounded-lg border-l-4" style={{ backgroundColor: theme.bg.tertiary, borderColor: '#3b82f6' }}>
                <p className="text-sm font-medium mb-1" style={{ color: theme.text.primary }}>Message Templates</p>
                <p className="text-xs" style={{ color: theme.text.muted }}>
                  WhatsApp requires pre-approved templates for business-initiated messages.
                  <a href="#" className="ml-1" style={{ color: '#3b82f6' }}>Manage templates →</a>
                </p>
              </div>
            </div>
          </div>

          {/* Email SMTP Configuration */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
                <CheckCircle2 size={16} style={{ color: '#10b981' }} />
                <span className="text-sm" style={{ color: theme.text.secondary }}>Connection status: <span style={{ color: '#10b981' }}>Connected</span></span>
                <button className="ml-auto px-3 py-1 rounded-lg text-xs" style={{ backgroundColor: theme.bg.hover, color: theme.text.primary }}>Test Connection</button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSaveSettings} className="px-6 py-3 rounded-xl text-white font-medium" style={{ backgroundColor: '#10b981' }}>
              Save Channel Settings
            </button>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {settingsTab === 'preferences' && (
        <div className="space-y-6">
          {/* Event Preferences */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
          </div>

          {/* Retry Policies */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
                    <input type="number" min="1" max="10" value={notificationSettings.maxRetries} onChange={(e) => setNotificationSettings(prev => ({ ...prev, maxRetries: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Retry Delay (minutes)</label>
                    <input type="number" min="1" max="60" value={notificationSettings.retryDelay} onChange={(e) => setNotificationSettings(prev => ({ ...prev, retryDelay: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quiet Hours */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
                    <input type="time" value={notificationSettings.quietHoursStart} onChange={(e) => setNotificationSettings(prev => ({ ...prev, quietHoursStart: e.target.value }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>End Time</label>
                    <input type="time" value={notificationSettings.quietHoursEnd} onChange={(e) => setNotificationSettings(prev => ({ ...prev, quietHoursEnd: e.target.value }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Priority Settings */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
          </div>

          {/* Batch Settings */}
          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
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
                    <input type="number" min="10" max="500" value={notificationSettings.batchSize} onChange={(e) => setNotificationSettings(prev => ({ ...prev, batchSize: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
                    <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Number of notifications per batch</p>
                  </div>
                  <div>
                    <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Batch Interval (minutes)</label>
                    <input type="number" min="1" max="60" value={notificationSettings.batchInterval} onChange={(e) => setNotificationSettings(prev => ({ ...prev, batchInterval: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
                    <p className="text-xs mt-1" style={{ color: theme.text.muted }}>Time between batch sends</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSaveSettings} className="px-6 py-3 rounded-xl text-white font-medium" style={{ backgroundColor: '#10b981' }}>
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Advanced Tab */}
      {settingsTab === 'advanced' && (
        <div className="space-y-6">
          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <TrendingUp size={20} />Rate Limits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>SMS per hour</label>
                <input type="number" value={notificationSettings.rateLimitSMS} onChange={(e) => setNotificationSettings(prev => ({ ...prev, rateLimitSMS: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>WhatsApp per hour</label>
                <input type="number" value={notificationSettings.rateLimitWA} onChange={(e) => setNotificationSettings(prev => ({ ...prev, rateLimitWA: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Email per hour</label>
                <input type="number" value={notificationSettings.rateLimitEmail} onChange={(e) => setNotificationSettings(prev => ({ ...prev, rateLimitEmail: Number(e.target.value) }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-6" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: theme.text.primary }}>
              <Mail size={20} />Sender Configuration
            </h3>
            <div className="grid gap-4">
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Default SMS Sender</label>
                <input type="text" value={notificationSettings.defaultSender} onChange={(e) => setNotificationSettings(prev => ({ ...prev, defaultSender: e.target.value }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
              </div>
              <div>
                <label className="block text-sm mb-2" style={{ color: theme.text.secondary }}>Email Reply-To Address</label>
                <input type="email" value={notificationSettings.replyTo} onChange={(e) => setNotificationSettings(prev => ({ ...prev, replyTo: e.target.value }))} className="w-full px-3 py-2 rounded-lg outline-none" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.primary }} />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button onClick={handleSaveSettings} className="px-6 py-3 rounded-xl text-white font-medium" style={{ backgroundColor: '#10b981' }}>
              Save Advanced Settings
            </button>
          </div>
        </div>
      )}
        </div>
      )}
    </div>
  );
};
