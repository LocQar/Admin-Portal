import React, { useState, useMemo } from 'react';
import { Plus, Search, Briefcase, Users, Download, Eye, Edit, Trash2, Mail, Phone, MapPin, Package, DollarSign, Calendar, TrendingUp, Filter, X, Building2, AlertCircle, Clock, CheckCircle, Tag, GraduationCap, CreditCard, Shield, Star, BarChart3, UserCheck, MessageSquare, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { StatusBadge, TableSkeleton, MetricCard, Pagination, EmptyState } from '../components/ui';
import { customersData, partnersData, TIERS, subscriberGrowthData, subscriberChurnData } from '../constants/mockData';
import { hasPermission, SUBSCRIPTION_PLANS } from '../constants';

export const CustomersPage = ({
  activeSubMenu, currentUser, loading, setShowExport, addToast,
  // Subscriber props
  filteredSubscribers, subscriberSearch, setSubscriberSearch,
  subscriberPlanFilter, setSubscriberPlanFilter,
  subscriberStatusFilter, setSubscriberStatusFilter,
  subscriberUniversityFilter, setSubscriberUniversityFilter,
  subscriberSort, setSubscriberSort, subscriberUniversities,
  selectedSubscribers, toggleSubscriberSelectAll, toggleSubscriberSelect,
  subscriberDetailItem, setSubscriberDetailItem,
  // Ticket props
  filteredTickets, ticketSearch, setTicketSearch,
  ticketPriorityFilter, setTicketPriorityFilter,
  ticketStatusFilter, setTicketStatusFilter,
}) => {
  const { theme } = useTheme();

  // All Customers local state
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = useState('all');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDrawer, setShowCustomerDrawer] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Subscribers local state
  const [subPage, setSubPage] = useState(1);
  // B2B Partners local state
  const [partnerSearch, setPartnerSearch] = useState('');
  const [partnerTierFilter, setPartnerTierFilter] = useState('all');
  // Tickets local state
  const [tktPage, setTktPage] = useState(1);

  const itemsPerPage = 10;

  // Determine current view
  const currentView = activeSubMenu || 'All Customers';

  // ============ ALL CUSTOMERS LOGIC ============
  const getCustomerOrders = () => [
    { id: 'ORD-001', date: '2024-01-15', items: 3, total: 450, status: 'delivered' },
    { id: 'ORD-002', date: '2024-01-10', items: 1, total: 150, status: 'in_transit' },
    { id: 'ORD-003', date: '2024-01-05', items: 2, total: 300, status: 'delivered' },
  ];

  const filteredCustomersLocal = useMemo(() => {
    let result = [...customersData];
    if (customerSearch) {
      const q = customerSearch.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q));
    }
    if (customerTypeFilter !== 'all') result = result.filter(c => c.type === customerTypeFilter);
    if (customerStatusFilter !== 'all') result = result.filter(c => c.status === customerStatusFilter);
    return result;
  }, [customerSearch, customerTypeFilter, customerStatusFilter]);

  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredCustomersLocal.slice(start, start + itemsPerPage);
  }, [filteredCustomersLocal, page]);

  const totalPages = Math.ceil(filteredCustomersLocal.length / itemsPerPage);

  const metrics = useMemo(() => {
    const all = customersData;
    return {
      total: all.length,
      active: all.filter(c => c.status === 'active').length,
      b2b: all.filter(c => c.type === 'b2b').length,
      revenue: all.reduce((sum, c) => sum + c.totalSpent, 0),
      avgOrder: all.reduce((sum, c) => sum + c.totalSpent, 0) / all.reduce((sum, c) => sum + c.totalOrders, 0),
    };
  }, []);

  const handleViewCustomer = (customer) => { setSelectedCustomer(customer); setShowCustomerDrawer(true); };
  const handleDeleteCustomer = (customer) => { addToast({ type: 'success', message: `Customer ${customer.name} deleted` }); };

  // ============ B2B PARTNERS LOGIC ============
  const filteredPartnersLocal = useMemo(() => {
    let result = [...partnersData];
    if (partnerSearch) {
      const q = partnerSearch.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q) || p.type.toLowerCase().includes(q));
    }
    if (partnerTierFilter !== 'all') result = result.filter(p => p.tier === partnerTierFilter);
    return result;
  }, [partnerSearch, partnerTierFilter]);

  // ============ SUBSCRIBERS LOGIC ============
  const subItemsPerPage = 10;
  const paginatedSubscribers = useMemo(() => {
    if (!filteredSubscribers) return [];
    const start = (subPage - 1) * subItemsPerPage;
    return filteredSubscribers.slice(start, start + subItemsPerPage);
  }, [filteredSubscribers, subPage]);
  const subTotalPages = filteredSubscribers ? Math.ceil(filteredSubscribers.length / subItemsPerPage) : 0;

  const subMetrics = useMemo(() => {
    if (!filteredSubscribers) return { total: 0, active: 0, revenue: 0, avgDeliveries: 0 };
    const all = filteredSubscribers;
    const active = all.filter(s => s.status === 'active');
    return {
      total: all.length,
      active: active.length,
      revenue: all.reduce((s, sub) => s + (sub.paymentHistory || []).filter(p => p.status === 'completed').reduce((acc, p) => acc + p.amount, 0), 0),
      avgDeliveries: all.length > 0 ? Math.round(all.reduce((s, sub) => s + sub.deliveriesUsed, 0) / all.length) : 0,
    };
  }, [filteredSubscribers]);

  const getPlanInfo = (planId) => SUBSCRIPTION_PLANS?.find(p => p.id === planId) || { name: planId, color: '#78716C', price: 0 };

  // ============ TICKETS LOGIC ============
  const tktItemsPerPage = 10;
  const paginatedTickets = useMemo(() => {
    if (!filteredTickets) return [];
    const start = (tktPage - 1) * tktItemsPerPage;
    return filteredTickets.slice(start, start + tktItemsPerPage);
  }, [filteredTickets, tktPage]);
  const tktTotalPages = filteredTickets ? Math.ceil(filteredTickets.length / tktItemsPerPage) : 0;

  // ============ RENDER ============
  // Page header is shared across all sub-views
  const titles = { 'All Customers': 'All Customers', 'Subscribers': 'Subscribers', 'B2B Partners': 'B2B Partners', 'Support Tickets': 'Support Tickets' };
  const icons = { 'All Customers': Users, 'Subscribers': GraduationCap, 'B2B Partners': Building2, 'Support Tickets': MessageSquare };
  const TitleIcon = icons[currentView] || Users;

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold flex items-center gap-3" style={{ color: theme.text.primary }}>
            <TitleIcon size={28} style={{ color: '#7EA8C9' }} /> {titles[currentView] || 'Customers'}
          </h1>
          <p style={{ color: theme.text.muted }}>{currentView} • Customer Management</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExport(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
            <Download size={16} />Export
          </button>
          {currentView === 'All Customers' && hasPermission(currentUser?.role, 'customers.manage') && (
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: '#7EA8C9', color: '#1C1917' }}>
              <Plus size={16} />Add Customer
            </button>
          )}
          {currentView === 'Subscribers' && hasPermission(currentUser?.role, 'customers.manage') && (
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm" style={{ backgroundColor: '#B5A0D1', color: '#1C1917' }}>
              <Plus size={16} />Add Subscriber
            </button>
          )}
        </div>
      </div>

      {/* ============ ALL CUSTOMERS VIEW ============ */}
      {currentView === 'All Customers' && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <MetricCard title="Total Customers" value={metrics.total} icon={Users} theme={theme} loading={loading} />
            <MetricCard title="Active" value={metrics.active} icon={TrendingUp} theme={theme} loading={loading} />
            <MetricCard title="B2B Accounts" value={metrics.b2b} icon={Briefcase} theme={theme} loading={loading} />
            <MetricCard title="Total Revenue" value={`GH₵ ${(metrics.revenue / 1000).toFixed(1)}k`} icon={DollarSign} theme={theme} loading={loading} />
            <MetricCard title="Avg Order Value" value={`GH₵ ${metrics.avgOrder.toFixed(0)}`} icon={Package} theme={theme} loading={loading} />
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
                <input value={customerSearch} onChange={e => { setCustomerSearch(e.target.value); setPage(1); }} placeholder="Search by name, email, or phone..." className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }} />
              </div>
              <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm" style={{ borderColor: theme.border.primary, color: theme.text.secondary }}>
                <Filter size={16} />Filters
              </button>
            </div>
            {showFilters && (
              <div className="flex flex-col md:flex-row gap-3 p-4 rounded-xl border" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                <div className="flex-1">
                  <label className="block text-xs mb-2" style={{ color: theme.text.muted }}>Customer Type</label>
                  <select value={customerTypeFilter} onChange={e => { setCustomerTypeFilter(e.target.value); setPage(1); }} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                    <option value="all">All Types</option>
                    <option value="individual">Individual</option>
                    <option value="b2b">B2B</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-xs mb-2" style={{ color: theme.text.muted }}>Status</label>
                  <select value={customerStatusFilter} onChange={e => { setCustomerStatusFilter(e.target.value); setPage(1); }} className="w-full px-3 py-2 rounded-lg border text-sm" style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary, color: theme.text.primary }}>
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button onClick={() => { setCustomerTypeFilter('all'); setCustomerStatusFilter('all'); setCustomerSearch(''); setPage(1); }} className="px-4 py-2 rounded-lg text-sm" style={{ backgroundColor: theme.bg.hover, color: theme.text.secondary }}>Clear Filters</button>
                </div>
              </div>
            )}
          </div>

          <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filteredCustomersLocal.length} customers found</p>

          {/* Customers Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            {loading ? <TableSkeleton rows={10} /> : paginatedCustomers.length === 0 ? (
              <EmptyState icon={Users} title="No customers found" description="No customers match your search criteria" theme={theme} />
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
                            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: customer.type === 'b2b' ? '#B5A0D1' : '#7EA8C9', color: '#1C1917' }}>
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
                            <div className="flex items-center gap-2 text-sm"><Mail size={12} style={{ color: theme.icon.muted }} /><span style={{ color: theme.text.secondary }}>{customer.email}</span></div>
                            <div className="flex items-center gap-2 text-sm"><Phone size={12} style={{ color: theme.icon.muted }} /><span style={{ color: theme.text.secondary }}>{customer.phone}</span></div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: customer.type === 'b2b' ? '#B5A0D110' : '#7EA8C910', color: customer.type === 'b2b' ? '#B5A0D1' : '#7EA8C9' }}>
                            {customer.type === 'b2b' ? 'B2B' : 'Individual'}
                          </span>
                        </td>
                        <td className="p-4 hidden lg:table-cell"><span className="font-medium" style={{ color: theme.text.primary }}>{customer.totalOrders}</span></td>
                        <td className="p-4"><span className="font-semibold" style={{ color: theme.text.primary }}>GH₵ {customer.totalSpent.toLocaleString()}</span></td>
                        <td className="p-4"><StatusBadge status={customer.status} /></td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleViewCustomer(customer)} className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: theme.bg.hover }} title="View details"><Eye size={16} style={{ color: theme.icon.primary }} /></button>
                            {hasPermission(currentUser?.role, 'customers.manage') && (
                              <>
                                <button className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: theme.bg.hover }} title="Edit"><Edit size={16} style={{ color: theme.icon.primary }} /></button>
                                <button onClick={() => handleDeleteCustomer(customer)} className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: theme.bg.hover }} title="Delete"><Trash2 size={16} style={{ color: '#D48E8A' }} /></button>
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
          {totalPages > 1 && <div className="mt-6"><Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} theme={theme} /></div>}

          {/* Customer Detail Drawer */}
          {showCustomerDrawer && selectedCustomer && (
            <div className="fixed inset-0 z-50 flex justify-end">
              <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowCustomerDrawer(false)} />
              <div className="relative w-full max-w-2xl h-full overflow-y-auto" style={{ backgroundColor: theme.bg.primary }}>
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b" style={{ backgroundColor: theme.bg.primary, borderColor: theme.border.primary }}>
                  <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>Customer Details</h2>
                  <button onClick={() => setShowCustomerDrawer(false)} className="p-2 rounded-lg" style={{ backgroundColor: theme.bg.hover }}><X size={20} style={{ color: theme.icon.primary }} /></button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: selectedCustomer.type === 'b2b' ? '#B5A0D1' : '#7EA8C9', color: '#1C1917' }}>
                      {selectedCustomer.type === 'b2b' ? <Briefcase size={24} /> : <Users size={24} />}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold" style={{ color: theme.text.primary }}>{selectedCustomer.name}</h3>
                      <p className="text-sm" style={{ color: theme.text.muted }}>{selectedCustomer.type === 'b2b' ? 'Business Account' : 'Individual Customer'}</p>
                      <div className="mt-2"><StatusBadge status={selectedCustomer.status} /></div>
                    </div>
                  </div>
                  <div className="rounded-xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <h4 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3"><Mail size={16} style={{ color: theme.icon.muted }} /><span className="text-sm" style={{ color: theme.text.secondary }}>{selectedCustomer.email}</span></div>
                      <div className="flex items-center gap-3"><Phone size={16} style={{ color: theme.icon.muted }} /><span className="text-sm" style={{ color: theme.text.secondary }}>{selectedCustomer.phone}</span></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="flex items-center gap-2 mb-2"><Package size={16} style={{ color: '#7EA8C9' }} /><span className="text-xs" style={{ color: theme.text.muted }}>Total Orders</span></div>
                      <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{selectedCustomer.totalOrders}</p>
                    </div>
                    <div className="rounded-xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <div className="flex items-center gap-2 mb-2"><DollarSign size={16} style={{ color: '#81C995' }} /><span className="text-xs" style={{ color: theme.text.muted }}>Total Spent</span></div>
                      <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>GH₵ {selectedCustomer.totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="rounded-xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <h4 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Recent Orders</h4>
                    <div className="space-y-2">
                      {getCustomerOrders().map(order => (
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
        </>
      )}

      {/* ============ SUBSCRIBERS VIEW ============ */}
      {currentView === 'Subscribers' && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Total Subscribers" value={subMetrics.total} icon={GraduationCap} theme={theme} loading={loading} />
            <MetricCard title="Active" value={subMetrics.active} icon={UserCheck} theme={theme} loading={loading} />
            <MetricCard title="Monthly Revenue" value={`GH₵ ${subMetrics.revenue.toLocaleString()}`} icon={DollarSign} theme={theme} loading={loading} />
            <MetricCard title="Avg Deliveries" value={subMetrics.avgDeliveries} icon={Package} theme={theme} loading={loading} />
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
              <input value={subscriberSearch || ''} onChange={e => { setSubscriberSearch(e.target.value); setSubPage(1); }} placeholder="Search by name, email, university..." className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }} />
            </div>
            <select value={subscriberPlanFilter || 'all'} onChange={e => { setSubscriberPlanFilter(e.target.value); setSubPage(1); }} className="px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }}>
              <option value="all">All Plans</option>
              {SUBSCRIPTION_PLANS?.map(p => <option key={p.id} value={p.id}>{p.name} - GH₵{p.price}/mo</option>)}
            </select>
            <select value={subscriberStatusFilter || 'all'} onChange={e => { setSubscriberStatusFilter(e.target.value); setSubPage(1); }} className="px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }}>
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
            <select value={subscriberUniversityFilter || 'all'} onChange={e => { setSubscriberUniversityFilter(e.target.value); setSubPage(1); }} className="px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }}>
              <option value="all">All Universities</option>
              {(subscriberUniversities || []).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filteredSubscribers?.length || 0} subscribers found</p>

          {/* Subscribers Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            {loading ? <TableSkeleton rows={10} /> : paginatedSubscribers.length === 0 ? (
              <EmptyState icon={GraduationCap} title="No subscribers found" description="No subscribers match your search criteria" theme={theme} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b" style={{ borderColor: theme.border.primary }}>
                    <tr style={{ backgroundColor: theme.bg.hover }}>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Subscriber</th>
                      <th className="text-left p-4 text-sm font-semibold hidden md:table-cell" style={{ color: theme.text.secondary }}>University</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Plan</th>
                      <th className="text-left p-4 text-sm font-semibold hidden lg:table-cell" style={{ color: theme.text.secondary }}>Deliveries</th>
                      <th className="text-left p-4 text-sm font-semibold hidden lg:table-cell" style={{ color: theme.text.secondary }}>Terminal</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Status</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSubscribers.map(sub => {
                      const plan = getPlanInfo(sub.plan);
                      return (
                        <tr key={sub.id} className="border-b hover:bg-opacity-50" style={{ borderColor: theme.border.primary }}>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B5A0D1', color: '#1C1917' }}>
                                <GraduationCap size={16} />
                              </div>
                              <div>
                                <p className="font-medium" style={{ color: theme.text.primary }}>{sub.name}</p>
                                <p className="text-xs" style={{ color: theme.text.muted }}>{sub.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 hidden md:table-cell">
                            <p className="text-sm" style={{ color: theme.text.primary }}>{sub.university}</p>
                            <p className="text-xs" style={{ color: theme.text.muted }}>{sub.campus}</p>
                          </td>
                          <td className="p-4">
                            <span className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: `${plan.color}15`, color: plan.color }}>
                              {plan.name}
                            </span>
                          </td>
                          <td className="p-4 hidden lg:table-cell">
                            <span className="font-medium" style={{ color: theme.text.primary }}>{sub.deliveriesUsed}</span>
                            <span className="text-xs" style={{ color: theme.text.muted }}> / {plan.deliveries === -1 ? '∞' : plan.deliveries}</span>
                          </td>
                          <td className="p-4 hidden lg:table-cell">
                            <span className="text-sm" style={{ color: theme.text.secondary }}>{sub.terminal}</span>
                          </td>
                          <td className="p-4"><StatusBadge status={sub.status} /></td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => setSubscriberDetailItem(sub)} className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: theme.bg.hover }} title="View details"><Eye size={16} style={{ color: theme.icon.primary }} /></button>
                              {hasPermission(currentUser?.role, 'customers.manage') && (
                                <button className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: theme.bg.hover }} title="Edit"><Edit size={16} style={{ color: theme.icon.primary }} /></button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {subTotalPages > 1 && <div className="mt-6"><Pagination currentPage={subPage} totalPages={subTotalPages} onPageChange={setSubPage} theme={theme} /></div>}

          {/* Subscriber Detail Drawer */}
          {subscriberDetailItem && (
            <div className="fixed inset-0 z-50 flex justify-end">
              <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setSubscriberDetailItem(null)} />
              <div className="relative w-full max-w-2xl h-full overflow-y-auto" style={{ backgroundColor: theme.bg.primary }}>
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b" style={{ backgroundColor: theme.bg.primary, borderColor: theme.border.primary }}>
                  <h2 className="text-xl font-bold" style={{ color: theme.text.primary }}>Subscriber Details</h2>
                  <button onClick={() => setSubscriberDetailItem(null)} className="p-2 rounded-lg" style={{ backgroundColor: theme.bg.hover }}><X size={20} style={{ color: theme.icon.primary }} /></button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl" style={{ backgroundColor: '#B5A0D1', color: '#1C1917' }}><GraduationCap size={24} /></div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold" style={{ color: theme.text.primary }}>{subscriberDetailItem.name}</h3>
                      <p className="text-sm" style={{ color: theme.text.muted }}>{subscriberDetailItem.university} • {subscriberDetailItem.campus}</p>
                      <p className="text-xs font-mono mt-1" style={{ color: theme.text.muted }}>ID: {subscriberDetailItem.studentId}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge status={subscriberDetailItem.status} />
                        {subscriberDetailItem.verified && <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(129,201,149,0.1)', color: '#81C995' }}>✓ Verified</span>}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <p className="text-xs mb-1" style={{ color: theme.text.muted }}>Plan</p>
                      <p className="font-semibold" style={{ color: getPlanInfo(subscriberDetailItem.plan).color }}>{getPlanInfo(subscriberDetailItem.plan).name}</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>GH₵ {getPlanInfo(subscriberDetailItem.plan).price}/mo</p>
                    </div>
                    <div className="rounded-xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <p className="text-xs mb-1" style={{ color: theme.text.muted }}>Deliveries Used</p>
                      <p className="text-2xl font-bold" style={{ color: theme.text.primary }}>{subscriberDetailItem.deliveriesUsed}</p>
                    </div>
                  </div>
                  <div className="rounded-xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <h4 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3"><Mail size={16} style={{ color: theme.icon.muted }} /><span className="text-sm" style={{ color: theme.text.secondary }}>{subscriberDetailItem.email}</span></div>
                      <div className="flex items-center gap-3"><Phone size={16} style={{ color: theme.icon.muted }} /><span className="text-sm" style={{ color: theme.text.secondary }}>{subscriberDetailItem.phone}</span></div>
                      <div className="flex items-center gap-3"><MapPin size={16} style={{ color: theme.icon.muted }} /><span className="text-sm" style={{ color: theme.text.secondary }}>{subscriberDetailItem.terminal}</span></div>
                    </div>
                  </div>
                  {subscriberDetailItem.notes && (
                    <div className="rounded-xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                      <h4 className="font-semibold mb-2" style={{ color: theme.text.primary }}>Notes</h4>
                      <p className="text-sm" style={{ color: theme.text.secondary }}>{subscriberDetailItem.notes}</p>
                    </div>
                  )}
                  <div className="rounded-xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <h4 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Payment History</h4>
                    <div className="space-y-2">
                      {(subscriberDetailItem.paymentHistory || []).map((p, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bg.hover }}>
                          <div>
                            <p className="text-sm font-medium" style={{ color: theme.text.primary }}>GH₵ {p.amount}</p>
                            <p className="text-xs" style={{ color: theme.text.muted }}>{p.date} • {p.method}</p>
                          </div>
                          <StatusBadge status={p.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-xl border p-4" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <h4 className="font-semibold mb-3" style={{ color: theme.text.primary }}>Recent Deliveries</h4>
                    <div className="space-y-2">
                      {(subscriberDetailItem.deliveryLog || []).slice(0, 5).map((d, i) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ backgroundColor: theme.bg.hover }}>
                          <div>
                            <p className="text-sm font-mono font-medium" style={{ color: theme.text.primary }}>{d.waybill}</p>
                            <p className="text-xs" style={{ color: theme.text.muted }}>{d.date} • {d.terminal} • {d.lockerSize}</p>
                          </div>
                          <StatusBadge status={d.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============ B2B PARTNERS VIEW ============ */}
      {currentView === 'B2B Partners' && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Active Partners" value={partnersData.filter(p => p.status === 'active').length} icon={Building2} theme={theme} loading={loading} />
            <MetricCard title="Monthly Volume" value={partnersData.reduce((s, p) => s + p.monthlyVolume, 0)} icon={Package} theme={theme} loading={loading} />
            <MetricCard title="Partner Revenue" value={`GH₵ ${(partnersData.reduce((s, p) => s + p.revenue, 0) / 1000).toFixed(1)}K`} icon={DollarSign} theme={theme} loading={loading} />
            <MetricCard title="Avg Delivery Rate" value={`${(partnersData.filter(p => p.status === 'active').reduce((s, p) => s + p.deliveryRate, 0) / partnersData.filter(p => p.status === 'active').length).toFixed(1)}%`} icon={TrendingUp} theme={theme} loading={loading} />
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
              <input value={partnerSearch} onChange={e => setPartnerSearch(e.target.value)} placeholder="Search partners..." className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }} />
            </div>
            <select value={partnerTierFilter} onChange={e => setPartnerTierFilter(e.target.value)} className="px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }}>
              <option value="all">All Tiers</option>
              {Object.entries(TIERS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          {/* Partner Cards */}
          <div className="space-y-4">
            {loading ? <TableSkeleton rows={5} /> : filteredPartnersLocal.length === 0 ? (
              <EmptyState icon={Building2} title="No partners found" description="No partners match your search criteria" theme={theme} />
            ) : (
              filteredPartnersLocal.map(partner => {
                const tier = TIERS[partner.tier];
                return (
                  <div key={partner.id} className="rounded-2xl border p-5" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: tier?.bg || '#f3f4f6' }}>
                          {partner.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg" style={{ color: theme.text.primary }}>{partner.name}</h3>
                            <span className="text-xs px-2.5 py-0.5 rounded-full font-medium inline-flex items-center gap-1" style={{ backgroundColor: tier?.bg, color: tier?.color }}>
                              <Star size={10} />{tier?.label}
                            </span>
                            <StatusBadge status={partner.status} />
                          </div>
                          <p className="text-sm mt-1" style={{ color: theme.text.muted }}>{partner.type} • {partner.email} • SLA: {partner.sla}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: theme.bg.hover }} title="View details"><Eye size={16} style={{ color: theme.icon.primary }} /></button>
                        {hasPermission(currentUser?.role, 'customers.manage') && (
                          <button className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: theme.bg.hover }} title="Edit"><Edit size={16} style={{ color: theme.icon.primary }} /></button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 pt-4 border-t" style={{ borderColor: theme.border.primary }}>
                      <div>
                        <p className="text-xs" style={{ color: theme.text.muted }}>Monthly Volume</p>
                        <p className="font-semibold" style={{ color: theme.text.primary }}>{partner.monthlyVolume} pkg</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: theme.text.muted }}>Total Orders</p>
                        <p className="font-semibold" style={{ color: theme.text.primary }}>{partner.totalOrders}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: theme.text.muted }}>Revenue</p>
                        <p className="font-semibold" style={{ color: '#81C995' }}>GH₵ {partner.revenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: theme.text.muted }}>Delivery Rate</p>
                        <p className="font-semibold" style={{ color: partner.deliveryRate >= 95 ? '#81C995' : partner.deliveryRate >= 90 ? '#D4AA5A' : '#D48E8A' }}>{partner.deliveryRate}%</p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: theme.text.muted }}>API Calls</p>
                        <p className="font-semibold" style={{ color: theme.text.primary }}>{partner.apiCalls.toLocaleString()}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>Last: {partner.lastApiCall}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* ============ SUPPORT TICKETS VIEW ============ */}
      {currentView === 'Support Tickets' && (
        <>
          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard title="Total Tickets" value={filteredTickets?.length || 0} icon={MessageSquare} theme={theme} loading={loading} />
            <MetricCard title="Open" value={(filteredTickets || []).filter(t => t.status === 'open').length} icon={AlertCircle} theme={theme} loading={loading} />
            <MetricCard title="In Progress" value={(filteredTickets || []).filter(t => t.status === 'in_progress').length} icon={Clock} theme={theme} loading={loading} />
            <MetricCard title="Resolved" value={(filteredTickets || []).filter(t => t.status === 'completed' || t.status === 'resolved').length} icon={CheckCircle} theme={theme} loading={loading} />
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.icon.muted }} />
              <input value={ticketSearch || ''} onChange={e => { setTicketSearch(e.target.value); setTktPage(1); }} placeholder="Search tickets by ID, customer, subject..." className="w-full pl-10 pr-4 py-2 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }} />
            </div>
            <select value={ticketPriorityFilter || 'all'} onChange={e => { setTicketPriorityFilter(e.target.value); setTktPage(1); }} className="px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }}>
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select value={ticketStatusFilter || 'all'} onChange={e => { setTicketStatusFilter(e.target.value); setTktPage(1); }} className="px-3 py-2 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary, color: theme.text.primary }}>
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filteredTickets?.length || 0} tickets found</p>

          {/* Tickets Table */}
          <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
            {loading ? <TableSkeleton rows={10} /> : paginatedTickets.length === 0 ? (
              <EmptyState icon={MessageSquare} title="No tickets found" description="No tickets match your search criteria" theme={theme} />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b" style={{ borderColor: theme.border.primary }}>
                    <tr style={{ backgroundColor: theme.bg.hover }}>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Ticket</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Customer</th>
                      <th className="text-left p-4 text-sm font-semibold hidden md:table-cell" style={{ color: theme.text.secondary }}>Category</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Priority</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Status</th>
                      <th className="text-left p-4 text-sm font-semibold hidden lg:table-cell" style={{ color: theme.text.secondary }}>Assignee</th>
                      <th className="text-left p-4 text-sm font-semibold hidden lg:table-cell" style={{ color: theme.text.secondary }}>Created</th>
                      <th className="text-left p-4 text-sm font-semibold" style={{ color: theme.text.secondary }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTickets.map(ticket => (
                      <tr key={ticket.id} className="border-b hover:bg-opacity-50" style={{ borderColor: theme.border.primary }}>
                        <td className="p-4">
                          <p className="font-mono text-sm font-medium" style={{ color: theme.text.primary }}>{ticket.id}</p>
                          <p className="text-xs mt-0.5 max-w-[200px] truncate" style={{ color: theme.text.muted }}>{ticket.subject}</p>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-medium" style={{ color: theme.text.primary }}>{ticket.customer}</span>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: theme.bg.hover, color: theme.text.secondary }}>{ticket.category}</span>
                        </td>
                        <td className="p-4"><StatusBadge status={ticket.priority} /></td>
                        <td className="p-4"><StatusBadge status={ticket.status} /></td>
                        <td className="p-4 hidden lg:table-cell">
                          <span className="text-sm" style={{ color: ticket.assignee ? theme.text.primary : theme.text.muted }}>{ticket.assignee || 'Unassigned'}</span>
                        </td>
                        <td className="p-4 hidden lg:table-cell">
                          <span className="text-sm" style={{ color: theme.text.muted }}>{ticket.created}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: theme.bg.hover }} title="View details"><Eye size={16} style={{ color: theme.icon.primary }} /></button>
                            {hasPermission(currentUser?.role, 'customers.manage') && (
                              <button className="p-2 rounded-lg hover:bg-opacity-80 transition-colors" style={{ backgroundColor: theme.bg.hover }} title="Assign"><UserCheck size={16} style={{ color: theme.icon.primary }} /></button>
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
          {tktTotalPages > 1 && <div className="mt-6"><Pagination currentPage={tktPage} totalPages={tktTotalPages} onPageChange={setTktPage} theme={theme} /></div>}
        </>
      )}
    </div>
  );
};
