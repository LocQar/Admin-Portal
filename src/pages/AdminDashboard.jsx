import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

export default function AdminDashboard() {
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
    <div className="admin-dashboard">
      <div className="dashboard-header">
        <h1>📊 Enterprise Admin Dashboard</h1>
        <div className="header-controls">
          <input
            type="date"
            value={dateRange.startDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, startDate: e.target.value })
            }
            className="date-input"
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.endDate}
            onChange={(e) =>
              setDateRange({ ...dateRange, endDate: e.target.value })
            }
            className="date-input"
          />
          <button className="btn-export" onClick={handleExportReport}>
            📥 Export Report
          </button>
        </div>
      </div>

      <div className="dashboard-tabs">
        <button
          className={`tab ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          📈 Overview
        </button>
        <button
          className={`tab ${selectedTab === 'users' ? 'active' : ''}`}
          onClick={() => setSelectedTab('users')}
        >
          👥 Users
        </button>
        <button
          className={`tab ${selectedTab === 'packages' ? 'active' : ''}`}
          onClick={() => setSelectedTab('packages')}
        >
          📦 Packages
        </button>
        <button
          className={`tab ${selectedTab === 'audit' ? 'active' : ''}`}
          onClick={() => setSelectedTab('audit')}
        >
          🔍 Audit Logs
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <div className="dashboard-content">
          {/* Overview Tab */}
          {selectedTab === 'overview' && stats && (
            <div className="overview-grid">
              <div className="stat-card">
                <div className="stat-icon">📦</div>
                <div className="stat-content">
                  <h3>Total Packages</h3>
                  <p className="stat-number">{stats.totalPackages}</p>
                  <small>All time</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">✅</div>
                <div className="stat-content">
                  <h3>Delivered</h3>
                  <p className="stat-number">{stats.deliveredPackages}</p>
                  <small>{((stats.deliveryRate || 0).toFixed(1))}% delivery rate</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⏳</div>
                <div className="stat-content">
                  <h3>Pending</h3>
                  <p className="stat-number">{stats.pendingPackages}</p>
                  <small>In transit</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">❌</div>
                <div className="stat-content">
                  <h3>Failed Transactions</h3>
                  <p className="stat-number">{stats.failedTransactions}</p>
                  <small>Last 30 days</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🏢</div>
                <div className="stat-content">
                  <h3>Terminals</h3>
                  <p className="stat-number">{stats.totalTerminals}</p>
                  <small>{stats.activeTerminals} online</small>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">👤</div>
                <div className="stat-content">
                  <h3>Active Users</h3>
                  <p className="stat-number">{stats.activeUsers}</p>
                  <small>Out of {stats.totalUsers} total</small>
                </div>
              </div>

              <div className="stat-card full-width">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <h3>System Health</h3>
                  <div className="health-bars">
                    <div className="health-item">
                      <label>Terminal Uptime</label>
                      <div className="progress-bar">
                        <div
                          className="progress"
                          style={{
                            width: `${stats.terminalUptime || 0}%`,
                          }}
                        ></div>
                      </div>
                      <span>{((stats.terminalUptime || 0).toFixed(1))}%</span>
                    </div>
                    <div className="health-item">
                      <label>Delivery Success Rate</label>
                      <div className="progress-bar">
                        <div
                          className="progress"
                          style={{
                            width: `${stats.deliveryRate || 0}%`,
                          }}
                        ></div>
                      </div>
                      <span>{((stats.deliveryRate || 0).toFixed(1))}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {selectedTab === 'users' && (
            <div className="data-table-container">
              <h2>User Management</h2>
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
            </div>
          )}

          {/* Packages Tab */}
          {selectedTab === 'packages' && (
            <div className="data-table-container">
              <h2>Package Management</h2>
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
                        <button className="btn-action">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Audit Logs Tab */}
          {selectedTab === 'audit' && (
            <div className="data-table-container">
              <h2>Audit Logs & Compliance</h2>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
