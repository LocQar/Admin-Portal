import React from 'react';
import { Download, CheckCircle2, AlertOctagon, AlertTriangle, XCircle, Eye, Users, Bell } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard, TableSkeleton } from '../components/ui';

export const SLAMonitorPage = ({ activeSubMenu, loading, setShowExport, addToast, slaBreachData = [], escalationLog = [] }) => {
  const { theme } = useTheme();

  return (
    <div className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
            <AlertOctagon size={28} style={{ color: '#ef4444' }} /> SLA Monitor
          </h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'Live Monitor'} • SLA Breach Monitoring</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Download size={16} />Export
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <MetricCard title="On Track" value={slaBreachData.filter(s => s.severity === 'on_track').length} icon={CheckCircle2} theme={theme} loading={loading} />
          <MetricCard title="Warning" value={slaBreachData.filter(s => s.severity === 'warning').length} icon={AlertTriangle} theme={theme} loading={loading} />
          <MetricCard title="Critical" value={slaBreachData.filter(s => s.severity === 'critical').length} icon={AlertOctagon} theme={theme} loading={loading} />
          <MetricCard title="Breached" value={slaBreachData.filter(s => s.severity === 'breached').length} icon={XCircle} theme={theme} loading={loading} />
          <MetricCard title="Total Active" value={slaBreachData.length} icon={Eye} theme={theme} loading={loading} />
        </div>

        <div className="p-4 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <p style={{ color: theme.text.primary }}>SLA Monitor Page - Implementation in progress</p>
        </div>
      </div>
    </div>
  );
};
