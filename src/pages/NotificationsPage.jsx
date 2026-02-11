import React from 'react';
import { Download, Send, MessageSquare, CheckCircle2, Eye, AlertTriangle, Banknote, Smartphone, Mail, Bell, Search } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard, TableSkeleton } from '../components/ui';
import { notificationHistoryData, autoRulesData, msgVolumeData, MSG_STATUSES } from '../constants/mockData';

export const NotificationsPage = ({ activeSubMenu, loading, setShowExport, setComposeOpen, addToast }) => {
  const { theme } = useTheme();
  const [msgSearch, setMsgSearch] = React.useState('');
  const [msgChannelFilter, setMsgChannelFilter] = React.useState('all');

  const filteredMessages = React.useMemo(() => {
    let result = [...notificationHistoryData];
    if (msgSearch) {
      const q = msgSearch.toLowerCase();
      result = result.filter(m => m.recipient.toLowerCase().includes(q) || m.waybill.toLowerCase().includes(q) || m.phone.toLowerCase().includes(q));
    }
    if (msgChannelFilter !== 'all') result = result.filter(m => m.channel === msgChannelFilter);
    return result;
  }, [msgSearch, msgChannelFilter]);

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

      {(!activeSubMenu || activeSubMenu === 'Message Center') && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MetricCard title="Sent Today" value={notificationHistoryData.filter(n => n.sentAt.includes('2024-01-15')).length.toLocaleString()} icon={Send} theme={theme} loading={loading} subtitle="SMS + WhatsApp + Email" />
            <MetricCard title="Delivered" value={notificationHistoryData.filter(n => ['delivered','read','opened'].includes(n.status)).length} change="98.2%" changeType="up" icon={CheckCircle2} theme={theme} loading={loading} />
            <MetricCard title="Opened" value={notificationHistoryData.filter(n => ['read','opened'].includes(n.status)).length} icon={Eye} theme={theme} loading={loading} subtitle="WA read + Email opened" />
            <MetricCard title="Failed" value={notificationHistoryData.filter(n => ['failed','bounced'].includes(n.status)).length} icon={AlertTriangle} theme={theme} loading={loading} />
            <MetricCard title="Cost Today" value={`GH₵ ${notificationHistoryData.reduce((s, n) => s + n.cost, 0).toFixed(2)}`} icon={Banknote} theme={theme} loading={loading} />
          </div>

          <div className="p-4 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <p style={{ color: theme.text.primary }}>Notifications Page - Implementation in progress</p>
          </div>
        </div>
      )}
    </div>
  );
};
