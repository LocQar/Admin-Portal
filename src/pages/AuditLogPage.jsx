import React, { useState, useMemo } from 'react';
import { Download, Search, Filter, Shield, ChevronDown, ChevronRight, User, Package, Settings, Lock, Truck, Eye, RefreshCw, Calendar, AlertTriangle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Pagination } from '../components/ui/Pagination';

const AUDIT_LOG_DATA = [
  { id: 1, user: 'John Doe', role: 'SUPER_ADMIN', action: 'Opened locker A-15', category: 'locker', severity: 'info', timestamp: '2024-01-15 14:32:15', ip: '192.168.1.100', details: 'Remote unlock command sent for locker A-15 at Achimota Mall. Package LQ-2024-00001 pickup by Joe Doe.' },
  { id: 2, user: 'Kofi Asante', role: 'MANAGER', action: 'Updated package LQ-2024-00002 status', category: 'package', severity: 'info', timestamp: '2024-01-15 14:28:00', ip: '192.168.1.105', details: 'Status changed from "in_transit_to_locker" to "delivered_to_locker". Terminal: Accra Mall, Locker: B-08.' },
  { id: 3, user: 'Yaw Boateng', role: 'AGENT', action: 'Scanned package LQ-2024-00007', category: 'package', severity: 'info', timestamp: '2024-01-15 14:15:30', ip: '192.168.1.110', details: 'Package scanned at Achimota Mall dropbox intake. Assigned to locker queue.' },
  { id: 4, user: 'Akua Mansa', role: 'ADMIN', action: 'Created new customer account', category: 'user', severity: 'info', timestamp: '2024-01-15 13:45:00', ip: '192.168.1.102', details: 'New customer: Kweku Mensah (kweku@email.com). Type: individual. Auto-assigned to Achimota Mall terminal.' },
  { id: 5, user: 'John Doe', role: 'SUPER_ADMIN', action: 'Generated monthly report', category: 'system', severity: 'info', timestamp: '2024-01-15 12:00:00', ip: '192.168.1.100', details: 'Monthly operations report for December 2023. Format: PDF. Includes revenue, SLA compliance, and terminal metrics.' },
  { id: 6, user: 'System', role: 'SYSTEM', action: 'SLA breach detected — package LQ-2024-00005', category: 'alert', severity: 'critical', timestamp: '2024-01-15 11:30:00', ip: 'system', details: 'Package LQ-2024-00005 has been in locker A-03 for 7 days. Auto-escalation triggered. Customer Kwame Boateng notified.' },
  { id: 7, user: 'Akua Mansa', role: 'ADMIN', action: 'Modified user role for Adjoa Frimpong', category: 'user', severity: 'warning', timestamp: '2024-01-15 11:15:00', ip: '192.168.1.102', details: 'Role changed from AGENT to VIEWER. Reason: Performance review — temporary reassignment pending training.' },
  { id: 8, user: 'John Doe', role: 'SUPER_ADMIN', action: 'Revoked API key for CompuGhana', category: 'security', severity: 'warning', timestamp: '2024-01-15 10:45:00', ip: '192.168.1.100', details: 'API key lq_live_cmp_****h8i9 revoked. Reason: Contract expired. Partner notified via email.' },
  { id: 9, user: 'System', role: 'SYSTEM', action: 'Terminal West Hills Mall set to maintenance', category: 'system', severity: 'warning', timestamp: '2024-01-15 10:00:00', ip: 'system', details: 'Terminal TRM-004 auto-flagged due to 5 lockers in maintenance state. Technician dispatch requested.' },
  { id: 10, user: 'Esi Mensah', role: 'AGENT', action: 'Processed return for LQ-2024-00003', category: 'package', severity: 'info', timestamp: '2024-01-15 09:30:00', ip: '192.168.1.108', details: 'Package returned to sender. Reason: Customer requested refund. Refund of GH₵ 50 processed via TXN-003.' },
  { id: 11, user: 'Kofi Asante', role: 'MANAGER', action: 'Created dispatch route RT-001', category: 'dispatch', severity: 'info', timestamp: '2024-01-15 08:00:00', ip: '192.168.1.105', details: 'Route: Accra Central zone. Driver: Kwesi Asante. 2 stops: Achimota Mall, Accra Mall. 4 packages assigned.' },
  { id: 12, user: 'System', role: 'SYSTEM', action: 'Failed login attempt — unknown user', category: 'security', severity: 'critical', timestamp: '2024-01-15 07:45:00', ip: '41.215.160.22', details: 'Failed login with email admin@locqar.com from external IP. Attempt blocked after 3 failures. IP flagged.' },
  { id: 13, user: 'John Doe', role: 'SUPER_ADMIN', action: 'Updated pricing — Rush tier multiplier', category: 'config', severity: 'warning', timestamp: '2024-01-14 16:30:00', ip: '192.168.1.100', details: 'Rush delivery multiplier changed from 2.0x to 2.2x. Effective immediately. Previous rate archived.' },
  { id: 14, user: 'Kweku Appiah', role: 'SUPPORT', action: 'Resolved ticket TKT-001', category: 'support', severity: 'info', timestamp: '2024-01-14 16:00:00', ip: '192.168.1.107', details: 'Ticket: "Cannot open locker A-15". Resolution: Remote unlock sent, customer confirmed package retrieved.' },
  { id: 15, user: 'System', role: 'SYSTEM', action: 'Automated backup completed', category: 'system', severity: 'info', timestamp: '2024-01-14 03:00:00', ip: 'system', details: 'Nightly database backup completed successfully. Size: 2.4GB. Stored in cloud archive. Retention: 90 days.' },
  { id: 16, user: 'Akua Mansa', role: 'ADMIN', action: 'Exported transactions report', category: 'system', severity: 'info', timestamp: '2024-01-14 15:20:00', ip: '192.168.1.102', details: 'Exported 1,847 transactions for January 2024. Format: CSV. Included: completed, pending, refunded.' },
  { id: 17, user: 'System', role: 'SYSTEM', action: 'Locker A-20 battery critical', category: 'alert', severity: 'critical', timestamp: '2024-01-14 12:00:00', ip: 'system', details: 'Locker A-20 at Achimota Mall battery at 15%. Maintenance alert raised. Locker status set to maintenance.' },
  { id: 18, user: 'Kofi Asante', role: 'MANAGER', action: 'Assigned agent to dropbox DBX-001', category: 'dispatch', severity: 'info', timestamp: '2024-01-14 09:00:00', ip: '192.168.1.105', details: 'Agent Yaw Boateng assigned to Achimota Overpass dropbox. Collection scheduled: 16:00.' },
  { id: 19, user: 'John Doe', role: 'SUPER_ADMIN', action: 'Onboarded new partner — Hubtel', category: 'user', severity: 'info', timestamp: '2024-01-13 14:00:00', ip: '192.168.1.100', details: 'Hubtel onboarded as Bronze tier partner. API key generated. Monthly minimum: 0. Standard public pricing.' },
  { id: 20, user: 'System', role: 'SYSTEM', action: 'Webhook delivery failed — Jumia Ghana', category: 'alert', severity: 'warning', timestamp: '2024-01-13 12:00:00', ip: 'system', details: 'Webhook WH-004 (package.expired) returned HTTP 500 after 5002ms. Timeout. Auto-retry scheduled in 5 minutes.' },
];

const CATEGORIES = {
  package: { label: 'Package', color: '#3b82f6', icon: Package },
  locker: { label: 'Locker', color: '#10b981', icon: Lock },
  user: { label: 'User', color: '#8b5cf6', icon: User },
  security: { label: 'Security', color: '#ef4444', icon: Shield },
  system: { label: 'System', color: '#6b7280', icon: Settings },
  dispatch: { label: 'Dispatch', color: '#f59e0b', icon: Truck },
  config: { label: 'Config', color: '#f59e0b', icon: Settings },
  alert: { label: 'Alert', color: '#ef4444', icon: AlertTriangle },
  support: { label: 'Support', color: '#10b981', icon: User },
};

const SEVERITIES = {
  info: { label: 'Info', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  warning: { label: 'Warning', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  critical: { label: 'Critical', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

export const AuditLogPage = ({ setShowExport }) => {
  const { theme } = useTheme();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filtered = useMemo(() => {
    return AUDIT_LOG_DATA.filter(log => {
      const matchesSearch = search === '' ||
        log.user.toLowerCase().includes(search.toLowerCase()) ||
        log.action.toLowerCase().includes(search.toLowerCase()) ||
        log.ip.includes(search);
      const matchesCategory = categoryFilter === 'all' || log.category === categoryFilter;
      const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;
      return matchesSearch && matchesCategory && matchesSeverity;
    });
  }, [search, categoryFilter, severityFilter]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, currentPage, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize);

  const severityCounts = useMemo(() => ({
    info: AUDIT_LOG_DATA.filter(l => l.severity === 'info').length,
    warning: AUDIT_LOG_DATA.filter(l => l.severity === 'warning').length,
    critical: AUDIT_LOG_DATA.filter(l => l.severity === 'critical').length,
  }), []);

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Audit Log</h1>
          <p style={{ color: theme.text.muted }}>{AUDIT_LOG_DATA.length} total entries &bull; Track all system activities</p>
        </div>
        <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
          <Download size={16} />Export
        </button>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="flex items-center gap-2 mb-1">
            <Eye size={16} style={{ color: theme.accent.primary }} />
            <span className="text-xs" style={{ color: theme.text.muted }}>Total Events</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{AUDIT_LOG_DATA.length}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} style={{ color: '#3b82f6' }} />
            <span className="text-xs" style={{ color: theme.text.muted }}>Info</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#3b82f6' }}>{severityCounts.info}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} style={{ color: '#f59e0b' }} />
            <span className="text-xs" style={{ color: theme.text.muted }}>Warnings</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#f59e0b' }}>{severityCounts.warning}</p>
        </div>
        <div className="p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} style={{ color: '#ef4444' }} />
            <span className="text-xs" style={{ color: theme.text.muted }}>Critical</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#ef4444' }}>{severityCounts.critical}</p>
        </div>
        <div className="p-4 rounded-xl border hidden md:block" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          <div className="flex items-center gap-2 mb-1">
            <User size={16} style={{ color: '#8b5cf6' }} />
            <span className="text-xs" style={{ color: theme.text.muted }}>Unique Users</span>
          </div>
          <p className="text-2xl font-bold" style={{ color: '#8b5cf6' }}>{new Set(AUDIT_LOG_DATA.map(l => l.user)).size}</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search by user, action, or IP..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm"
            style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
          />
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
          {[['all', 'All'], ['info', 'Info'], ['warning', 'Warning'], ['critical', 'Critical']].map(([val, label]) => (
            <button key={val} onClick={() => { setSeverityFilter(val); setCurrentPage(1); }} className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all" style={{ backgroundColor: severityFilter === val ? theme.accent.primary : 'transparent', color: severityFilter === val ? '#fff' : theme.text.muted }}>
              {label}
            </button>
          ))}
        </div>
        <select
          value={categoryFilter}
          onChange={e => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
          className="px-3 py-2 rounded-xl border text-sm"
          style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }}
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORIES).map(([key, cat]) => (
            <option key={key} value={key}>{cat.label}</option>
          ))}
        </select>
      </div>

      <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filtered.length} of {AUDIT_LOG_DATA.length} entries</p>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
        <table className="w-full">
          <thead>
            <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
              <th className="text-left p-4 text-xs font-semibold uppercase w-8" style={{ color: theme.text.muted }}></th>
              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Severity</th>
              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>User</th>
              <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Action</th>
              <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Category</th>
              <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Timestamp</th>
              <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(log => {
              const cat = CATEGORIES[log.category] || CATEGORIES.system;
              const sev = SEVERITIES[log.severity] || SEVERITIES.info;
              const CatIcon = cat.icon;
              const isExpanded = expandedRow === log.id;

              return (
                <React.Fragment key={log.id}>
                  <tr
                    onClick={() => setExpandedRow(isExpanded ? null : log.id)}
                    className="cursor-pointer hover:bg-white/5 transition-colors"
                    style={{ borderBottom: isExpanded ? 'none' : `1px solid ${theme.border.primary}` }}
                  >
                    <td className="p-4">
                      {isExpanded ? <ChevronDown size={14} style={{ color: theme.icon.muted }} /> : <ChevronRight size={14} style={{ color: theme.icon.muted }} />}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: sev.bg, color: sev.color }}>
                        {sev.label}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: log.user === 'System' ? '#6b7280' : theme.accent.primary, color: log.user === 'System' ? '#fff' : theme.accent.contrast }}>
                          {log.user === 'System' ? '⚙' : log.user.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{log.user}</p>
                          <p className="text-xs" style={{ color: theme.text.muted }}>{log.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm" style={{ color: theme.text.secondary }}>{log.action}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs" style={{ backgroundColor: `${cat.color}10`, color: cat.color }}>
                        <CatIcon size={12} />
                        {cat.label}
                      </span>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="text-sm font-mono" style={{ color: theme.text.muted }}>{log.timestamp}</span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="text-sm font-mono" style={{ color: theme.text.muted }}>{log.ip}</span>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr style={{ borderBottom: `1px solid ${theme.border.primary}` }}>
                      <td colSpan={7} className="px-6 pb-4 pt-0">
                        <div className="p-4 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
                          <p className="text-xs font-semibold uppercase mb-2" style={{ color: theme.text.muted }}>Details</p>
                          <p className="text-sm" style={{ color: theme.text.secondary }}>{log.details}</p>
                          <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t" style={{ borderColor: theme.border.primary }}>
                            <span className="text-xs" style={{ color: theme.text.muted }}>Category: <span className="font-medium" style={{ color: cat.color }}>{cat.label}</span></span>
                            <span className="text-xs" style={{ color: theme.text.muted }}>IP: <span className="font-mono font-medium" style={{ color: theme.text.secondary }}>{log.ip}</span></span>
                            <span className="text-xs" style={{ color: theme.text.muted }}>Time: <span className="font-mono font-medium" style={{ color: theme.text.secondary }}>{log.timestamp}</span></span>
                            <span className="text-xs" style={{ color: theme.text.muted }}>Event ID: <span className="font-mono font-medium" style={{ color: theme.text.secondary }}>EVT-{String(log.id).padStart(4, '0')}</span></span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            pageSize={pageSize}
            onPageSizeChange={size => { setPageSize(size); setCurrentPage(1); }}
            totalItems={filtered.length}
          />
        </div>
      )}
    </div>
  );
};
