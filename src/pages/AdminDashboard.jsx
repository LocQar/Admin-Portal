import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/ui/Card';
import { useTheme } from '../contexts/ThemeContext';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const { theme } = useTheme();
  const [stats, setStats] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchDashboardData();
  }, [selectedTab, dateRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken');

      if (selectedTab === 'overview') {
        const response = await fetch('/api/analytics/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setStats(data);
      } else if (selectedTab === 'users') {
        const response = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUsers(data);
      } else if (selectedTab === 'packages') {
        const response = await fetch('/api/admin/packages', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setPackages(data);
      } else if (selectedTab === 'audit') {
        const response = await fetch(
          `/api/audit/logs?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await response.json();
        setAuditLogs(data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async () => {
    try {
      const response = await fetch(
        `/api/analytics/report?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        }
      );
      const data = await response.json();
      
      // Convert to JSON and download
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  return (
    <div className="admin-dashboard" style={{ backgroundColor: theme.bg.primary }}>
      <GlassCard className="dashboard-header">
        <h1 style={{ color: theme.text.primary }}>📊 Enterprise Admin Dashboard</h1>
        <div className="header-controls">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
            className="date-input"
            style={{ backgroundColor: 'transparent', borderColor: theme.border.primary, color: theme.text.primary }}
          />
          <span style={{ color: theme.text.secondary }}>to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, endDate: e.target.value })
            }
            className="date-input"
            style={{ backgroundColor: 'transparent', borderColor: theme.border.primary, color: theme.text.primary }}
          />
          <button className="btn-primary" onClick={handleExportReport}>
            📥 Export Report
          </button>
        </div>
      </GlassCard>

      <GlassCard noPadding className="dashboard-tabs">
        <button
          className={`tab ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
          style={selectedTab === 'overview' ? { backgroundColor: theme.accent.primary, color: theme.accent.contrast } : { color: theme.text.muted }}
        >
          📈 Overview
        </button>
        <button
          className={`tab ${selectedTab === 'users' ? 'active' : ''}`}
          onClick={() => setSelectedTab('users')}
          style={selectedTab === 'users' ? { backgroundColor: theme.accent.primary, color: theme.accent.contrast } : { color: theme.text.muted }}
        >
          👥 Users
        </button>
        <button
          className={`tab ${selectedTab === 'packages' ? 'active' : ''}`}
          onClick={() => setSelectedTab('packages')}
          style={selectedTab === 'packages' ? { backgroundColor: theme.accent.primary, color: theme.accent.contrast } : { color: theme.text.muted }}
        >
          📦 Packages
        </button>
        <button
          className={`tab ${selectedTab === 'audit' ? 'active' : ''}`}
          onClick={() => setSelectedTab('audit')}
          style={selectedTab === 'audit' ? { backgroundColor: theme.accent.primary, color: theme.accent.contrast } : { color: theme.text.muted }}
        >
          🔍 Audit Logs
        </button>
      </GlassCard>

      {loading ? (
        <div className="loading" style={{ color: theme.text.muted }}>Loading data...</div>
      ) : (
        <div className="dashboard-content">
          {/* Overview Tab */}
          {selectedTab === 'overview' && stats && (
            <div className="overview-grid">
              <GlassCard hover className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <h3 style={{ color: theme.text.muted }}>Total Packages</h3>
                  <p className="stat-number" style={{ color: theme.text.primary }}>{stats.totalPackages}</p>
                  <small style={{ color: theme.text.muted }}>All time</small>
                </div>
              </GlassCard>

              <GlassCard hover className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3 style={{ color: theme.text.muted }}>Delivered</h3>
                  <p className="stat-number" style={{ color: theme.status.success }}>{stats.deliveredPackages}</p>
                  <small style={{ color: theme.text.muted }}>{((stats.deliveryRate || 0).toFixed(1))}% delivery rate</small>
                </div>
              </GlassCard>

              <GlassCard hover className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3 style={{ color: theme.text.muted }}>Pending</h3>
                  <p className="stat-number" style={{ color: theme.status.warning }}>{stats.pendingPackages}</p>
                  <small style={{ color: theme.text.muted }}>In transit</small>
                </div>
              </GlassCard>

              <GlassCard hover className="stat-card">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <h3 style={{ color: theme.text.muted }}>Failed Transactions</h3>
                  <p className="stat-number" style={{ color: theme.status.error }}>{stats.failedTransactions}</p>
                  <small style={{ color: theme.text.muted }}>Last 30 days</small>
                </div>
              </GlassCard>

              <GlassCard hover className="stat-card">
                <div className="stat-icon">🏢</div>
                <div className="stat-content">
                  <h3 style={{ color: theme.text.muted }}>Terminals</h3>
                  <p className="stat-number" style={{ color: theme.accent.primary }}>{stats.totalTerminals}</p>
                  <small style={{ color: theme.text.muted }}>{stats.activeTerminals} online</small>
                </div>
              </GlassCard>

              <GlassCard hover className="stat-card">
                <div className="stat-icon">👤</div>
                <div className="stat-content">
                  <h3 style={{ color: theme.text.muted }}>Active Users</h3>
                  <p className="stat-number" style={{ color: theme.chart.violet }}>{stats.activeUsers}</p>
                  <small style={{ color: theme.text.muted }}>Out of {stats.totalUsers} total</small>
                </div>
              </GlassCard>

              <GlassCard className="stat-card full-width">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3 style={{ color: theme.text.muted }}>System Health</h3>
                  <div className="health-bars">
                    <div className="health-item">
                      <label style={{ color: theme.text.muted }}>Terminal Uptime</label>
                      <div className="progress-bar" style={{ backgroundColor: theme.border.primary }}>
                        <div
                          className="progress"
                          style={{
                            width: `${stats.terminalUptime || 0}%`,
                            background: `linear-gradient(90deg, ${theme.accent.primary}, ${theme.chart.violet})`,
                          }}
                        ></div>
                      </div>
                      <span style={{ color: theme.text.primary }}>{((stats.terminalUptime || 0).toFixed(1))}%</span>
                    </div>
                    <div className="health-item">
                      <label style={{ color: theme.text.muted }}>Delivery Success Rate</label>
                      <div className="progress-bar" style={{ backgroundColor: theme.border.primary }}>
                        <div
                          className="progress"
                          style={{
                            width: `${stats.deliveryRate || 0}%`,
                            background: `linear-gradient(90deg, ${theme.accent.primary}, ${theme.chart.violet})`,
                          }}
                        ></div>
                      </div>
                      <span style={{ color: theme.text.primary }}>{((stats.deliveryRate || 0).toFixed(1))}%</span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          )}

          {/* Users Tab */}
          {selectedTab === 'users' && (
            <GlassCard noPadding className="data-table-container">
              <h2 style={{ color: theme.text.primary, padding: '24px 24px 0' }}>User Management</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Last Login</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.email}</td>
                      <td>{user.name || '-'}</td>
                      <td>
                        <span className={`badge role-${user.role.toLowerCase()}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            user.isActive ? 'status-active' : 'status-inactive'
                          }`}
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        {user.lastLogin
                          ? new Date(user.lastLogin).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          )}

          {/* Packages Tab */}
          {selectedTab === 'packages' && (
            <GlassCard noPadding className="data-table-container">
              <h2 style={{ color: theme.text.primary, padding: '24px 24px 0' }}>Package Management</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Waybill</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Location</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.map((pkg) => (
                    <tr key={pkg.id}>
                      <td className="monospace">{pkg.waybill}</td>
                      <td>{pkg.customerName || '-'}</td>
                      <td>
                        <span className={`badge status-${pkg.status.toLowerCase()}`}>
                          {pkg.status}
                        </span>
                      </td>
                      <td>{pkg.location || '-'}</td>
                      <td>{new Date(pkg.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn-outline" style={{ padding: '6px 12px', fontSize: '11px' }}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          )}

          {/* Audit Logs Tab */}
          {selectedTab === 'audit' && (
            <GlassCard noPadding className="data-table-container">
              <h2 style={{ color: theme.text.primary, padding: '24px 24px 0' }}>Audit Logs & Compliance</h2>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>User</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td>{new Date(log.createdAt).toLocaleString()}</td>
                      <td>{log.user?.email || 'System'}</td>
                      <td>
                        <span className="action-badge">{log.action}</span>
                      </td>
                      <td>
                        {log.entityType} {log.entityId && `(${log.entityId})`}
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            log.status === 'SUCCESS'
                              ? 'status-success'
                              : 'status-failure'
                          }`}
                        >
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          )}
        </div>
      )}
    </div>
  );
}
