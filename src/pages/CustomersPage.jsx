import React, { useState, useMemo } from 'react';
import { Plus, Search, Briefcase, Users, Download, Eye, Edit, Trash2, Mail, Phone, MapPin, Package, DollarSign, Calendar, TrendingUp, Filter, X } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { StatusBadge, TableSkeleton, MetricCard, Pagination, EmptyState } from '../components/ui';
import { customersData } from '../constants/mockData';
import { hasPermission } from '../constants';

export const CustomersPage = ({ activeSubMenu, currentUser, loading, setShowExport, addToast }) => {
  const { theme } = useTheme();

  // State
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDrawer, setShowCustomerDrawer] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 10;

  // Customer orders mock data (for detail drawer)
  const getCustomerOrders = (customerId) => [
    { id: 'ORD-001', date: '2024-01-15', items: 3, total: 450, status: 'delivered' },
    { id: 'ORD-002', date: '2024-01-10', items: 1, total: 150, status: 'in_transit' },
    { id: 'ORD-003', date: '2024-01-05', items: 2, total: 300, status: 'delivered' },
  ];

  // Filtered and paginated customers
  const filteredCustomers = useMemo(() => {
    let result = [...customersData];

    if (customerSearch) {
      const q = customerSearch.toLowerCase();
      result = result.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.includes(q)
      );
    }

    if (customerTypeFilter !== 'all') {
      result = result.filter(c => c.type === customerTypeFilter);
    }

    if (customerStatusFilter !== 'all') {
      result = result.filter(c => c.status === customerStatusFilter);
    }

    // Filter by submenu
    if (activeSubMenu === 'B2B Customers') {
      result = result.filter(c => c.type === 'b2b');
    } else if (activeSubMenu === 'Individual Customers') {
      result = result.filter(c => c.type === 'individual');
    } else if (activeSubMenu === 'VIP Customers') {
      result = result.filter(c => c.totalSpent > 5000);
    }

    return result;
  }, [customerSearch, customerTypeFilter, customerStatusFilter, activeSubMenu]);

  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, page]);

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

  // Calculate metrics
  const metrics = useMemo(() => {
    const all = customersData;
    const totalCustomers = all.length;
    const activeCustomers = all.filter(c => c.status === 'active').length;
    const b2bCustomers = all.filter(c => c.type === 'b2b').length;
    const totalRevenue = all.reduce((sum, c) => sum + c.totalSpent, 0);
    const avgOrderValue = totalRevenue / all.reduce((sum, c) => sum + c.totalOrders, 0);

    return {
      total: totalCustomers,
      active: activeCustomers,
      b2b: b2bCustomers,
      revenue: totalRevenue,
      avgOrder: avgOrderValue,
    };
  }, []);

  // Handlers
  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDrawer(true);
  };

  const handleDeleteCustomer = (customer) => {
    addToast(`Customer ${customer.name} deleted`, 'success');
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
            <Users size={28} style={{ color: '#3b82f6' }} /> Customers
          </h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'All Customers'} • Customer Management</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Download size={16} />Export
          </button>
          {hasPermission(currentUser?.role, 'customers.manage') && (
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: '#3b82f6' }}>
              <Plus size={16} />Add Customer
            </button>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <MetricCard title="Total Customers" value={metrics.total} icon={Users} theme={theme} loading={loading} />
        <MetricCard title="Active" value={metrics.active} icon={TrendingUp} theme={theme} loading={loading} color="#10b981" />
        <MetricCard title="B2B Accounts" value={metrics.b2b} icon={Briefcase} theme={theme} loading={loading} color="#8b5cf6" />
        <MetricCard title="Total Revenue" value={`GH₵ ${(metrics.revenue / 1000).toFixed(1)}k`} icon={DollarSign} theme={theme} loading={loading} color="#f59e0b" />
        <MetricCard title="Avg Order Value" value={`GH₵ ${metrics.avgOrder.toFixed(0)}`} icon={Package} theme={theme} loading={loading} />
      </div>

      {/* Filters */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.muted }} />
            <input
              value={customerSearch}
              onChange={e => { setCustomerSearch(e.target.value); setPage(1); }}
              placeholder="Search by name, email, or phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm"
              style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm"
            style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
          >
            <Filter size={16} />Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            <div className="flex-1">
              <label className="block text-xs mb-2" style={{ color: theme.text.muted }}>Customer Type</label>
              <select
                value={customerTypeFilter}
                onChange={e => { setCustomerTypeFilter(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}
              >
                <option value="all">All Types</option>
                <option value="individual">Individual</option>
                <option value="b2b">B2B</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs mb-2" style={{ color: theme.text.muted }}>Status</label>
              <select
                value={customerStatusFilter}
                onChange={e => { setCustomerStatusFilter(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 rounded-lg border text-sm"
                style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setCustomerTypeFilter('all'); setCustomerStatusFilter('all'); setCustomerSearch(''); setPage(1); }}
                className="px-4 py-2 rounded-lg text-sm"
                style={{ backgroundColor: theme.bg.hover, color: theme.text.secondary }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filteredCustomers.length} customers found</p>

      {/* Customers Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
        {loading ? (
          <TableSkeleton rows={10} />
        ) : paginatedCustomers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No customers found"
            description="No customers match your search criteria"
            theme={theme}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b" style={{ borderColor: theme.border.primary }}>
                <tr style={{ backgroundColor: theme.bg.hover }}>
                  <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Customer</th>
                  <th className="text-left p-4 text-sm font-semibold hidden md:table-cell" style={{ color: theme.text.secondary }}>Contact</th>
                  <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Type</th>
                  <th className="text-left p-4 text-sm font-semibold hidden lg:table-cell" style={{ color: theme.text.secondary }}>Orders</th>
                  <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Total Spent</th>
                  <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Status</th>
                  <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.map(customer => (
                  <tr key={customer.id} className="border-b hover:bg-opacity-50" style={{ borderColor: theme.border.primary }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: customer.type === 'b2b' ? '#8b5cf6' : '#3b82f6' }}>
                          {customer.type === 'b2b' ? <Briefcase size={16} /> : <Users size={16} />}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: theme.text.primary }}>{customer.name}</p>
                          {customer.type === 'b2b' && <p className="text-xs" style={{ color: theme.text.muted }}>Business Account</p>}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm">
                          <Mail size={12} style={{ color: theme.text.muted }} />
                          <span style={{ color: theme.text.secondary }}>{customer.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone size={12} style={{ color: theme.text.muted }} />
                          <span style={{ color: theme.text.secondary }}>{customer.phone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{
                        backgroundColor: customer.type === 'b2b' ? '#8b5cf610' : '#3b82f610',
                        color: customer.type === 'b2b' ? '#8b5cf6' : '#3b82f6'
                      }}>
                        {customer.type === 'b2b' ? 'B2B' : 'Individual'}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="font-medium" style={{ color: theme.text.primary }}>{customer.totalOrders}</span>
                    </td>
                    <td className="p-4">
                      <span className="font-semibold" style={{ color: theme.text.primary }}>GH₵ {customer.totalSpent.toLocaleString()}</span>
                    </td>
                    <td className="p-4">
                      <StatusBadge status={customer.status} />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewCustomer(customer)}
                          className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                          style={{ backgroundColor: theme.bg.hover }}
                          title="View details"
                        >
                          <Eye size={16} style={{ color: theme.text.secondary }} />
                        </button>
                        {hasPermission(currentUser?.role, 'customers.manage') && (
                          <>
                            <button
                              className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                              style={{ backgroundColor: theme.bg.hover }}
                              title="Edit"
                            >
                              <Edit size={16} style={{ color: theme.text.secondary }} />
                            </button>
                            <button
                              onClick={() => handleDeleteCustomer(customer)}
                              className="p-2 rounded-lg hover:bg-opacity-80 transition-colors"
                              style={{ backgroundColor: theme.bg.hover }}
                              title="Delete"
                            >
                              <Trash2 size={16} style={{ color: '#ef4444' }} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            theme={theme}
          />
        </div>
      )}

      {/* Customer Detail Drawer */}
      {showCustomerDrawer && selectedCustomer && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCustomerDrawer(false)} />
          <div className="relative w-full max-w-2xl h-full overflow-y-auto" style={{ backgroundColor: theme.bg.primary }}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b" style={{ backgroundColor: theme.bg.primary, borderColor: theme.border.primary }}>
              <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>Customer Details</h2>
              <button onClick={() => setShowCustomerDrawer(false)} className="p-2 rounded-lg" style={{ backgroundColor: theme.bg.hover }}>
                <X size={20} style={{ color: theme.text.secondary }} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl" style={{ backgroundColor: selectedCustomer.type === 'b2b' ? '#8b5cf6' : '#3b82f6' }}>
                  {selectedCustomer.type === 'b2b' ? <Briefcase size={24} /> : <Users size={24} />}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold" style={{ color: theme.text.primary }}>{selectedCustomer.name}</h3>
                  <p className="text-sm" style={{ color: theme.text.muted }}>
                    {selectedCustomer.type === 'b2b' ? 'Business Account' : 'Individual Customer'}
                  </p>
                  <div className="mt-2">
                    <StatusBadge status={selectedCustomer.status} />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="rounded-xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <h4 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Mail size={16} style={{ color: theme.text.muted }} />
                    <span className="text-sm" style={{ color: theme.text.secondary }}>{selectedCustomer.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone size={16} style={{ color: theme.text.muted }} />
                    <span className="text-sm" style={{ color: theme.text.secondary }}>{selectedCustomer.phone}</span>
                  </div>
                  {selectedCustomer.address && (
                    <div className="flex items-center gap-3">
                      <MapPin size={16} style={{ color: theme.text.muted }} />
                      <span className="text-sm" style={{ color: theme.text.secondary }}>{selectedCustomer.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                  <div className="flex items-center gap-2 mb-2">
                    <Package size={16} style={{ color: '#3b82f6' }} />
                    <span className="text-xs" style={{ color: theme.text.muted }}>Total Orders</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{selectedCustomer.totalOrders}</p>
                </div>
                <div className="rounded-xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign size={16} style={{ color: '#10b981' }} />
                    <span className="text-xs" style={{ color: theme.text.muted }}>Total Spent</span>
                  </div>
                  <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>GH₵ {selectedCustomer.totalSpent.toLocaleString()}</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="rounded-xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <h4 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Recent Orders</h4>
                <div className="space-y-2">
                  {getCustomerOrders(selectedCustomer.id).map(order => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bg.hover }}>
                      <div>
                        <p className="font-mono text-sm font-medium" style={{ color: theme.text.primary }}>{order.id}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{order.date} • {order.items} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold" style={{ color: theme.text.primary }}>GH₵ {order.total}</p>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
