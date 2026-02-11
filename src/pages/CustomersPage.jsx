import React from 'react';
import { Plus, Search, Briefcase, Users } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { StatusBadge, TableSkeleton } from '../components/ui';
import { customersData } from '../constants/mockData';
import { hasPermission } from '../constants';

export const CustomersPage = ({ activeSubMenu, currentUser }) => {
  const { theme } = useTheme();
  const [customerSearch, setCustomerSearch] = React.useState('');
  const [customerTypeFilter, setCustomerTypeFilter] = React.useState('all');
  const [loading] = React.useState(false);

  const filteredCustomers = React.useMemo(() => {
    let result = [...customersData];
    if (customerSearch) {
      const q = customerSearch.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q));
    }
    if (customerTypeFilter !== 'all') result = result.filter(c => c.type === customerTypeFilter);
    return result;
  }, [customerSearch, customerTypeFilter]);

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: theme.text.primary }}>Customers</h1>
          <p style={{ color: theme.text.muted }}>{activeSubMenu || 'All Customers'}</p>
        </div>
        {hasPermission(currentUser?.role, 'customers.manage') && (
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm" style={{ backgroundColor: theme.accent.primary }}>
            <Plus size={18} />Add Customer
          </button>
        )}
      </div>

      <div>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: theme.text.muted }} />
            <input value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} placeholder="Search customers..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm" style={{ backgroundColor: theme.bg.input, borderColor: theme.border.primary, color: theme.text.primary }} />
          </div>
          <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: theme.bg.tertiary }}>
            {[['all', 'All'], ['individual', 'Individual'], ['b2b', 'B2B']].map(([val, label]) => (
              <button key={val} onClick={() => setCustomerTypeFilter(val)} className="px-3 py-1.5 rounded-lg text-xs font-medium" style={{ backgroundColor: customerTypeFilter === val ? theme.accent.primary : 'transparent', color: customerTypeFilter === val ? '#fff' : theme.text.muted }}>{label}</button>
            ))}
          </div>
        </div>

        <p className="text-xs mb-3" style={{ color: theme.text.muted }}>{filteredCustomers.length} customers</p>

        <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}>
          {loading ? <TableSkeleton rows={8} cols={6} theme={theme} /> : (
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: ` 1px solid ${theme.border.primary}` }}>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Name</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase hidden md:table-cell" style={{ color: theme.text.muted }}>Contact</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Type</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase hidden lg:table-cell" style={{ color: theme.text.muted }}>Orders</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Spent</th>
                  <th className="text-left p-4 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map(customer => (
                  <tr key={customer.id} style={{ borderBottom: ` 1px solid ${theme.border.primary}` }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: customer.type === 'b2b' ? '#8b5cf6' : '#3b82f6' }}>
                          {customer.type === 'b2b' ? <Briefcase size={16} /> : <Users size={16} />}
                        </div>
                        <span className="font-medium" style={{ color: theme.text.primary }}>{customer.name}</span>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell">
                      <div>
                        <p className="text-sm" style={{ color: theme.text.secondary }}>{customer.email}</p>
                        <p className="text-xs" style={{ color: theme.text.muted }}>{customer.phone}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 rounded-lg font-medium" style={{ backgroundColor: customer.type === 'b2b' ? 'rgba(139,92,246,0.1)' : 'rgba(59,130,246,0.1)', color: customer.type === 'b2b' ? '#8b5cf6' : '#3b82f6' }}>
                        {customer.type === 'b2b' ? 'B2B' : 'Individual'}
                      </span>
                    </td>
                    <td className="p-4 hidden lg:table-cell"><span style={{ color: theme.text.primary }}>{customer.totalOrders}</span></td>
                    <td className="p-4"><span className="font-medium" style={{ color: theme.text.primary }}>GH₵ {customer.totalSpent.toLocaleString()}</span></td>
                    <td className="p-4"><StatusBadge status={customer.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
