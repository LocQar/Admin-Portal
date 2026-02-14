import React, { useState, useMemo } from 'react';
import { Download, CheckCircle2, AlertOctagon, AlertTriangle, XCircle, Eye, Users, Bell, Clock, Package, TrendingUp, Play, Pause, Edit, Trash2, Plus, Search, Filter, ChevronDown } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { MetricCard, TableSkeleton, EmptyState, Pagination, Dropdown } from '../components/ui';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const SLAMonitorPage = ({ activeSubMenu, loading, setShowExport, addToast }) => {
  const { theme } = useTheme();

  // Mock data for Live Monitor
  const [livePackages] = useState([
    { id: 'PKG001', trackingId: 'TRK-2024-001', customer: 'John Doe', sla: 'Same Day', deadline: '2024-01-15 18:00', timeRemaining: '2h 15m', progress: 75, severity: 'warning', status: 'In Transit', location: 'Hub B' },
    { id: 'PKG002', trackingId: 'TRK-2024-002', customer: 'Jane Smith', sla: 'Next Day', deadline: '2024-01-16 12:00', timeRemaining: '20h 30m', progress: 90, severity: 'on_track', status: 'Out for Delivery', location: 'Hub C' },
    { id: 'PKG003', trackingId: 'TRK-2024-003', customer: 'Bob Johnson', sla: 'Express', deadline: '2024-01-15 16:00', timeRemaining: '15m', progress: 95, severity: 'critical', status: 'In Transit', location: 'Hub A' },
    { id: 'PKG004', trackingId: 'TRK-2024-004', customer: 'Alice Brown', sla: 'Same Day', deadline: '2024-01-15 14:30', timeRemaining: '-1h 45m', progress: 100, severity: 'breached', status: 'Delayed', location: 'Hub B' },
    { id: 'PKG005', trackingId: 'TRK-2024-005', customer: 'Charlie Wilson', sla: '2-Day', deadline: '2024-01-17 18:00', timeRemaining: '50h 15m', progress: 45, severity: 'on_track', status: 'Processing', location: 'Hub A' },
    { id: 'PKG006', trackingId: 'TRK-2024-006', customer: 'Diana Martinez', sla: 'Express', deadline: '2024-01-15 17:00', timeRemaining: '1h 10m', progress: 80, severity: 'warning', status: 'In Transit', location: 'Hub C' },
    { id: 'PKG007', trackingId: 'TRK-2024-007', customer: 'Eve Taylor', sla: 'Same Day', deadline: '2024-01-15 20:00', timeRemaining: '4h 15m', progress: 65, severity: 'on_track', status: 'Processing', location: 'Hub B' },
    { id: 'PKG008', trackingId: 'TRK-2024-008', customer: 'Frank Anderson', sla: 'Next Day', deadline: '2024-01-16 10:00', timeRemaining: '18h 30m', progress: 88, severity: 'on_track', status: 'In Transit', location: 'Hub A' },
  ]);

  // Mock data for Escalation Rules
  const [escalationRules, setEscalationRules] = useState([
    { id: 1, name: 'Critical SLA Alert', trigger: '85% of SLA time elapsed', action: 'Notify Manager + Operations Team', channels: ['Email', 'SMS'], delay: '0 min', priority: 'High', active: true, lastTriggered: '2 hours ago' },
    { id: 2, name: 'Breach Warning', trigger: '95% of SLA time elapsed', action: 'Escalate to Senior Management', channels: ['Email', 'Push'], delay: '5 min', priority: 'Critical', active: true, lastTriggered: '30 min ago' },
    { id: 3, name: 'Post-Breach Follow-up', trigger: 'SLA breached', action: 'Create incident ticket + Notify Customer Service', channels: ['Email', 'Slack'], delay: '0 min', priority: 'High', active: true, lastTriggered: '1 hour ago' },
    { id: 4, name: 'Daily Summary', trigger: 'Daily at 6:00 PM', action: 'Send SLA compliance report', channels: ['Email'], delay: '0 min', priority: 'Low', active: true, lastTriggered: 'Yesterday' },
    { id: 5, name: 'Weekend Monitor', trigger: '75% of SLA (Weekends only)', action: 'Alert on-call staff', channels: ['SMS', 'Push'], delay: '10 min', priority: 'Medium', active: false, lastTriggered: 'Last Saturday' },
  ]);

  // Mock data for Compliance
  const [complianceData] = useState({
    overall: { rate: 94.2, trend: '+2.1%', total: 12580, onTime: 11850, breached: 730 },
    byService: [
      { service: 'Same Day', rate: 92.5, total: 3420, onTime: 3163, breached: 257 },
      { service: 'Next Day', rate: 96.8, total: 5280, onTime: 5111, breached: 169 },
      { service: 'Express', rate: 89.2, total: 1850, onTime: 1650, breached: 200 },
      { service: '2-Day', rate: 97.5, total: 2030, onTime: 1979, breached: 51 },
    ],
    weekly: [
      { week: 'Week 1', rate: 93.5, onTime: 2850, breached: 195 },
      { week: 'Week 2', rate: 94.8, onTime: 2920, breached: 160 },
      { week: 'Week 3', rate: 92.1, onTime: 2780, breached: 238 },
      { week: 'Week 4', rate: 95.6, onTime: 3300, breached: 137 },
    ],
  });

  // Mock data for Incident Log
  const [incidents] = useState([
    { id: 'INC-001', packageId: 'PKG004', trackingId: 'TRK-2024-004', customer: 'Alice Brown', sla: 'Same Day', breachTime: '2024-01-15 14:30', delay: '1h 45m', reason: 'Traffic delay at Hub B', assignedTo: 'John Manager', status: 'Investigating', priority: 'High', createdAt: '2024-01-15 14:35' },
    { id: 'INC-002', packageId: 'PKG015', trackingId: 'TRK-2024-015', customer: 'George Lee', sla: 'Express', breachTime: '2024-01-15 11:20', delay: '45m', reason: 'Vehicle breakdown', assignedTo: 'Sarah Ops', status: 'Resolved', priority: 'Critical', createdAt: '2024-01-15 11:25', resolvedAt: '2024-01-15 13:10' },
    { id: 'INC-003', packageId: 'PKG022', trackingId: 'TRK-2024-022', customer: 'Helen Park', sla: 'Same Day', breachTime: '2024-01-14 19:15', delay: '2h 30m', reason: 'Incorrect routing at Hub A', assignedTo: 'Mike Dispatch', status: 'Resolved', priority: 'High', createdAt: '2024-01-14 19:20', resolvedAt: '2024-01-14 22:45' },
    { id: 'INC-004', packageId: 'PKG030', trackingId: 'TRK-2024-030', customer: 'Ivan Torres', sla: 'Next Day', breachTime: '2024-01-13 10:45', delay: '3h 15m', reason: 'Weather conditions', assignedTo: 'Lisa Manager', status: 'Resolved', priority: 'Medium', createdAt: '2024-01-13 10:50', resolvedAt: '2024-01-13 16:30' },
    { id: 'INC-005', packageId: 'PKG042', trackingId: 'TRK-2024-042', customer: 'Jack Robinson', sla: 'Express', breachTime: '2024-01-12 15:30', delay: '1h 10m', reason: 'Address verification issue', assignedTo: 'Karen Ops', status: 'Closed', priority: 'High', createdAt: '2024-01-12 15:35', resolvedAt: '2024-01-12 18:20' },
  ]);

  // State for filters and pagination
  const [liveSearch, setLiveSearch] = useState('');
  const [liveSeverityFilter, setLiveSeverityFilter] = useState('all');
  const [livePage, setLivePage] = useState(1);
  const [incidentSearch, setIncidentSearch] = useState('');
  const [incidentStatusFilter, setIncidentStatusFilter] = useState('all');
  const [incidentPage, setIncidentPage] = useState(1);

  const itemsPerPage = 10;

  // Filtered and paginated live packages
  const filteredLivePackages = useMemo(() => {
    return livePackages.filter(pkg => {
      const matchesSearch = pkg.trackingId.toLowerCase().includes(liveSearch.toLowerCase()) ||
                           pkg.customer.toLowerCase().includes(liveSearch.toLowerCase()) ||
                           pkg.id.toLowerCase().includes(liveSearch.toLowerCase());
      const matchesSeverity = liveSeverityFilter === 'all' || pkg.severity === liveSeverityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [livePackages, liveSearch, liveSeverityFilter]);

  const paginatedLivePackages = useMemo(() => {
    const start = (livePage - 1) * itemsPerPage;
    return filteredLivePackages.slice(start, start + itemsPerPage);
  }, [filteredLivePackages, livePage]);

  // Filtered and paginated incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter(inc => {
      const matchesSearch = inc.id.toLowerCase().includes(incidentSearch.toLowerCase()) ||
                           inc.trackingId.toLowerCase().includes(incidentSearch.toLowerCase()) ||
                           inc.customer.toLowerCase().includes(incidentSearch.toLowerCase());
      const matchesStatus = incidentStatusFilter === 'all' || inc.status === incidentStatusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [incidents, incidentSearch, incidentStatusFilter]);

  const paginatedIncidents = useMemo(() => {
    const start = (incidentPage - 1) * itemsPerPage;
    return filteredIncidents.slice(start, start + itemsPerPage);
  }, [filteredIncidents, incidentPage]);

  // Handlers
  const handleToggleRule = (id) => {
    setEscalationRules(escalationRules.map(rule =>
      rule.id === id ? { ...rule, active: !rule.active } : rule
    ));
    addToast('Rule status updated', 'success');
  };

  const handleTestRule = (ruleName) => {
    addToast(`Testing rule: ${ruleName}`, 'info');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'on_track': return '#81C995';
      case 'warning': return '#D4AA5A';
      case 'critical': return '#D48E8A';
      case 'breached': return '#7c3aed';
      default: return theme.text.muted;
    }
  };

  const getSeverityBadge = (severity) => {
    const colors = {
      on_track: { bg: '#81C99510', text: '#81C995' },
      warning: { bg: '#D4AA5A10', text: '#D4AA5A' },
      critical: { bg: '#D48E8A10', text: '#D48E8A' },
      breached: { bg: '#7c3aed10', text: '#7c3aed' },
    };
    const color = colors[severity] || { bg: theme.bg.card, text: theme.text.muted };
    return <span className="px-2 py-1 rounded-lg text-xs font-medium capitalize" style={{ backgroundColor: color.bg, color: color.text }}>{severity.replace('_', ' ')}</span>;
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      Critical: { bg: '#7c3aed10', text: '#7c3aed' },
      High: { bg: '#D48E8A10', text: '#D48E8A' },
      Medium: { bg: '#D4AA5A10', text: '#D4AA5A' },
      Low: { bg: '#81C99510', text: '#81C995' },
    };
    const color = colors[priority] || { bg: theme.bg.card, text: theme.text.muted };
    return <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: color.bg, color: color.text }}>{priority}</span>;
  };

  const getStatusBadge = (status) => {
    const colors = {
      Investigating: { bg: '#D4AA5A10', text: '#D4AA5A' },
      Resolved: { bg: '#81C99510', text: '#81C995' },
      Closed: { bg: '#64748b10', text: '#64748b' },
    };
    const color = colors[status] || { bg: theme.bg.card, text: theme.text.muted };
    return <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: color.bg, color: color.text }}>{status}</span>;
  };

  // Summary metrics
  const slaBreachData = livePackages;
  const onTrack = slaBreachData.filter(s => s.severity === 'on_track').length;
  const warning = slaBreachData.filter(s => s.severity === 'warning').length;
  const critical = slaBreachData.filter(s => s.severity === 'critical').length;
  const breached = slaBreachData.filter(s => s.severity === 'breached').length;
  const totalActive = slaBreachData.length;

  // Render Live Monitor
  if (!activeSubMenu || activeSubMenu === 'Live Monitor') {
    return (
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
              <AlertOctagon size={28} style={{ color: '#D48E8A' }} /> SLA Monitor
            </h1>
            <p style={{ color: theme.text.muted }}>Live Monitor • Real-time SLA Tracking</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
              <Download size={16} />Export
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <MetricCard title="On Track" value={onTrack} icon={CheckCircle2} theme={theme} loading={loading} color="#81C995" />
            <MetricCard title="Warning" value={warning} icon={AlertTriangle} theme={theme} loading={loading} color="#D4AA5A" />
            <MetricCard title="Critical" value={critical} icon={AlertOctagon} theme={theme} loading={loading} color="#D48E8A" />
            <MetricCard title="Breached" value={breached} icon={XCircle} theme={theme} loading={loading} color="#7c3aed" />
            <MetricCard title="Total Active" value={totalActive} icon={Eye} theme={theme} loading={loading} />
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
              <input
                type="text"
                placeholder="Search by tracking ID, customer, or package ID..."
                value={liveSearch}
                onChange={(e) => { setLiveSearch(e.target.value); setLivePage(1); }}
                className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm"
                style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }}
              />
            </div>
            <Dropdown
              value={liveSeverityFilter}
              onChange={(val) => { setLiveSeverityFilter(val); setLivePage(1); }}
              options={[
                { value: 'all', label: 'All Severities' },
                { value: 'on_track', label: 'On Track' },
                { value: 'warning', label: 'Warning' },
                { value: 'critical', label: 'Critical' },
                { value: 'breached', label: 'Breached' },
              ]}
              className="w-44"
            />
          </div>

          {/* Live Packages Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            {loading ? (
              <TableSkeleton rows={5} />
            ) : paginatedLivePackages.length === 0 ? (
              <EmptyState icon={Package} title="No packages found" description="No packages match your search criteria" theme={theme} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b" style={{ borderColor: theme.border.primary }}>
                    <tr style={{ backgroundColor: theme.bg.hover }}>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Package ID</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Tracking ID</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Customer</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>SLA Type</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Deadline</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Time Remaining</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Progress</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Status</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Severity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLivePackages.map((pkg) => (
                      <tr key={pkg.id} className="border-b hover:bg-opacity-50" style={{ borderColor: theme.border.primary }}>
                        <td className="p-4">
                          <span className="font-mono text-sm font-medium" style={{ color: theme.text.primary }}>{pkg.id}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm" style={{ color: theme.text.primary }}>{pkg.trackingId}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm" style={{ color: theme.text.primary }}>{pkg.customer}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{pkg.sla}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm" style={{ color: theme.text.secondary }}>{pkg.deadline}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-mono font-medium" style={{ color: pkg.timeRemaining.startsWith('-') ? '#D48E8A' : theme.text.primary }}>
                            {pkg.timeRemaining}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.hover }}>
                              <div className="h-full rounded-full transition-all" style={{ width: `${pkg.progress}%`, backgroundColor: getSeverityColor(pkg.severity) }} />
                            </div>
                            <span className="text-xs font-medium w-8" style={{ color: theme.text.secondary }}>{pkg.progress}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm" style={{ color: theme.text.secondary }}>{pkg.status}</span>
                        </td>
                        <td className="p-4">
                          {getSeverityBadge(pkg.severity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredLivePackages.length > itemsPerPage && (
            <Pagination
              currentPage={livePage}
              totalPages={Math.ceil(filteredLivePackages.length / itemsPerPage)}
              onPageChange={setLivePage}
              theme={theme}
            />
          )}
        </div>
      </div>
    );
  }

  // Render Escalation Rules
  if (activeSubMenu === 'Escalation Rules') {
    return (
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
              <Bell size={28} style={{ color: '#D4AA5A' }} /> Escalation Rules
            </h1>
            <p style={{ color: theme.text.muted }}>Automated escalation rules for SLA breaches</p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: '#7EA8C9', color: '#1C1917' }}>
              <Plus size={16} />New Rule
            </button>
            <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
              <Download size={16} />Export
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <TableSkeleton rows={5} />
          ) : escalationRules.length === 0 ? (
            <EmptyState icon={Bell} title="No escalation rules" description="Create your first escalation rule" theme={theme} />
          ) : (
            escalationRules.map((rule) => (
              <div key={rule.id} className="p-5 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-base" style={{ color: theme.text.primary }}>{rule.name}</h3>
                      {getPriorityBadge(rule.priority)}
                      {rule.active ? (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: '#81C99510', color: '#81C995' }}>Active</span>
                      ) : (
                        <span className="px-2 py-1 rounded-lg text-xs font-medium" style={{ backgroundColor: '#64748b10', color: '#64748b' }}>Paused</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock size={14} style={{ color: theme.icon.muted }} />
                        <span style={{ color: theme.text.secondary }}><strong>Trigger:</strong> {rule.trigger}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Bell size={14} style={{ color: theme.icon.muted }} />
                        <span style={{ color: theme.text.secondary }}><strong>Action:</strong> {rule.action}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm flex-wrap">
                        <span style={{ color: theme.text.secondary }}><strong>Channels:</strong></span>
                        {rule.channels.map((channel, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: theme.bg.hover, color: theme.text.primary }}>{channel}</span>
                        ))}
                        <span style={{ color: theme.text.muted }}>• Delay: {rule.delay}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button onClick={() => handleTestRule(rule.name)} className="p-2 rounded-xl hover:bg-opacity-80 transition-colors" style={{ backgroundColor: theme.bg.hover }} title="Test rule">
                      <Play size={16} style={{ color: theme.icon.primary }} />
                    </button>
                    <button onClick={() => handleToggleRule(rule.id)} className="p-2 rounded-xl hover:bg-opacity-80 transition-colors" style={{ backgroundColor: theme.bg.hover }} title={rule.active ? 'Pause' : 'Resume'}>
                      {rule.active ? <Pause size={16} style={{ color: theme.icon.primary }} /> : <Play size={16} style={{ color: theme.icon.primary }} />}
                    </button>
                    <button className="p-2 rounded-xl hover:bg-opacity-80 transition-colors" style={{ backgroundColor: theme.bg.hover }} title="Edit">
                      <Edit size={16} style={{ color: theme.icon.primary }} />
                    </button>
                    <button className="p-2 rounded-xl hover:bg-opacity-80 transition-colors" style={{ backgroundColor: theme.bg.hover }} title="Delete">
                      <Trash2 size={16} style={{ color: '#D48E8A' }} />
                    </button>
                  </div>
                </div>
                <div className="pt-3 border-t" style={{ borderColor: theme.border.primary }}>
                  <span className="text-xs" style={{ color: theme.text.muted }}>Last triggered: {rule.lastTriggered}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  // Render Compliance
  if (activeSubMenu === 'Compliance') {
    return (
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
              <TrendingUp size={28} style={{ color: '#81C995' }} /> SLA Compliance
            </h1>
            <p style={{ color: theme.text.muted }}>Historical SLA compliance reports</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
              <Download size={16} />Export Report
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Overall Compliance */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold mb-1" style={{ color: theme.text.primary }}>Overall SLA Compliance</h2>
                <p className="text-sm" style={{ color: theme.text.muted }}>Last 30 days</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold" style={{ color: '#81C995' }}>{complianceData.overall.rate}%</div>
                <div className="text-sm" style={{ color: '#81C995' }}>{complianceData.overall.trend}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl" style={{ backgroundColor: theme.bg.hover }}>
                <div className="text-sm mb-1" style={{ color: theme.text.muted }}>Total Deliveries</div>
                <div className="text-xl font-bold" style={{ color: theme.text.primary }}>{complianceData.overall.total.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#81C99510' }}>
                <div className="text-sm mb-1" style={{ color: theme.text.muted }}>On Time</div>
                <div className="text-xl font-bold" style={{ color: '#81C995' }}>{complianceData.overall.onTime.toLocaleString()}</div>
              </div>
              <div className="p-4 rounded-xl" style={{ backgroundColor: '#D48E8A10' }}>
                <div className="text-sm mb-1" style={{ color: theme.text.muted }}>Breached</div>
                <div className="text-xl font-bold" style={{ color: '#D48E8A' }}>{complianceData.overall.breached.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Compliance by Service */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>Compliance by Service Type</h2>
            <div className="space-y-4">
              {complianceData.byService.map((service) => (
                <div key={service.service} className="p-4 rounded-xl" style={{ backgroundColor: theme.bg.hover }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium" style={{ color: theme.text.primary }}>{service.service}</span>
                    <span className="font-bold" style={{ color: service.rate >= 95 ? '#81C995' : service.rate >= 90 ? '#D4AA5A' : '#D48E8A' }}>
                      {service.rate}%
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: theme.bg.card }}>
                      <div className="h-full rounded-full" style={{ width: `${service.rate}%`, backgroundColor: service.rate >= 95 ? '#81C995' : service.rate >= 90 ? '#D4AA5A' : '#D48E8A' }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: theme.text.muted }}>
                    <span>Total: {service.total}</span>
                    <span>On Time: {service.onTime}</span>
                    <span>Breached: {service.breached}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Trend */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>Weekly Compliance Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={complianceData.weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} />
                <XAxis dataKey="week" stroke={theme.text.muted} />
                <YAxis stroke={theme.text.muted} />
                <Tooltip contentStyle={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }} />
                <Legend />
                <Line type="monotone" dataKey="rate" name="Compliance Rate (%)" stroke="#81C995" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Deliveries Chart */}
          <div className="p-6 rounded-2xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <h2 className="text-lg font-semibold mb-4" style={{ color: theme.text.primary }}>On Time vs Breached Deliveries</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complianceData.weekly}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.border.primary} />
                <XAxis dataKey="week" stroke={theme.text.muted} />
                <YAxis stroke={theme.text.muted} />
                <Tooltip contentStyle={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }} />
                <Legend />
                <Bar dataKey="onTime" name="On Time" fill="#81C995" />
                <Bar dataKey="breached" name="Breached" fill="#D48E8A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  }

  // Render Incident Log
  if (activeSubMenu === 'Incident Log') {
    return (
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
              <XCircle size={28} style={{ color: '#7c3aed' }} /> Incident Log
            </h1>
            <p style={{ color: theme.text.muted }}>SLA breach incidents and resolutions</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
              <Download size={16} />Export
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
              <input
                type="text"
                placeholder="Search by incident ID, tracking ID, or customer..."
                value={incidentSearch}
                onChange={(e) => { setIncidentSearch(e.target.value); setIncidentPage(1); }}
                className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm"
                style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }}
              />
            </div>
            <Dropdown
              value={incidentStatusFilter}
              onChange={(val) => { setIncidentStatusFilter(val); setIncidentPage(1); }}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Investigating', label: 'Investigating' },
                { value: 'Resolved', label: 'Resolved' },
                { value: 'Closed', label: 'Closed' },
              ]}
              className="w-44"
            />
          </div>

          {/* Incidents Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            {loading ? (
              <TableSkeleton rows={5} />
            ) : paginatedIncidents.length === 0 ? (
              <EmptyState icon={XCircle} title="No incidents found" description="No incidents match your search criteria" theme={theme} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b" style={{ borderColor: theme.border.primary }}>
                    <tr style={{ backgroundColor: theme.bg.hover }}>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Incident ID</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Package</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Customer</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>SLA Type</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Breach Time</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Delay</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Reason</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Assigned To</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Priority</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedIncidents.map((incident) => (
                      <tr key={incident.id} className="border-b hover:bg-opacity-50" style={{ borderColor: theme.border.primary }}>
                        <td className="p-4">
                          <span className="font-mono text-sm font-medium" style={{ color: theme.text.primary }}>{incident.id}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{incident.packageId}</span>
                            <span className="text-xs" style={{ color: theme.text.muted }}>{incident.trackingId}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-sm" style={{ color: theme.text.primary }}>{incident.customer}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{incident.sla}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm" style={{ color: theme.text.secondary }}>{incident.breachTime}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-mono font-medium" style={{ color: '#D48E8A' }}>{incident.delay}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm" style={{ color: theme.text.secondary }}>{incident.reason}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm" style={{ color: theme.text.primary }}>{incident.assignedTo}</span>
                        </td>
                        <td className="p-4">
                          {getPriorityBadge(incident.priority)}
                        </td>
                        <td className="p-4">
                          {getStatusBadge(incident.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          {filteredIncidents.length > itemsPerPage && (
            <Pagination
              currentPage={incidentPage}
              totalPages={Math.ceil(filteredIncidents.length / itemsPerPage)}
              onPageChange={setIncidentPage}
              theme={theme}
            />
          )}
        </div>
      </div>
    );
  }

  return null;
};
