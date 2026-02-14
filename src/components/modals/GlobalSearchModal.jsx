import React, { useState, useEffect, useMemo } from 'react';
import { Search, Package, Users, Grid3X3 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { StatusBadge } from '../ui/Badge';
import { packagesData, customersData, lockersData, getLockerAddress } from '../../constants/mockData';

export const GlobalSearchModal = ({ isOpen, onClose, onNavigate }) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query || query.length < 2) return { packages: [], customers: [], lockers: [] };
    const q = query.toLowerCase();
    return {
      packages: packagesData.filter(p => p.waybill.toLowerCase().includes(q) || p.customer.toLowerCase().includes(q) || p.phone.includes(q)).slice(0, 5),
      customers: customersData.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)).slice(0, 3),
      lockers: lockersData.filter(l => l.id.toLowerCase().includes(q) || l.terminal.toLowerCase().includes(q) || (getLockerAddress(l.id, l.terminal) || '').toLowerCase().includes(q)).slice(0, 3),
    };
  }, [query]);

  const hasResults = results.packages.length > 0 || results.customers.length > 0 || results.lockers.length > 0;

  useEffect(() => {
    if (isOpen) setQuery('');
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative w-full max-w-2xl rounded-2xl border shadow-2xl" style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <Search size={20} style={{ color: theme.icon.muted }} />
          <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by phone, waybill, address code, name..." autoFocus className="flex-1 bg-transparent outline-none text-lg" style={{ color: theme.text.primary }} />
          <kbd className="px-2 py-1 rounded text-xs" style={{ backgroundColor: theme.bg.tertiary, color: theme.text.muted }}>ESC</kbd>
        </div>
        {query.length >= 2 && (
          <div className="max-h-96 overflow-y-auto p-2">
            {!hasResults ? (
              <p className="p-4 text-center" style={{ color: theme.text.muted }}>No results found for "{query}"</p>
            ) : (
              <>
                {results.packages.length > 0 && (
                  <div className="mb-4">
                    <p className="px-3 py-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Packages</p>
                    {results.packages.map(pkg => (
                      <button key={pkg.id} onClick={() => { onNavigate('packages', pkg); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left">
                        <Package size={18} style={{ color: theme.accent.primary }} />
                        <div className="flex-1"><p className="font-mono text-sm" style={{ color: theme.text.primary }}>{pkg.waybill}</p><p className="text-xs" style={{ color: theme.text.muted }}>{pkg.customer} • {pkg.destination}</p></div>
                        <StatusBadge status={pkg.status} />
                      </button>
                    ))}
                  </div>
                )}
                {results.customers.length > 0 && (
                  <div className="mb-4">
                    <p className="px-3 py-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Customers</p>
                    {results.customers.map(c => (
                      <button key={c.id} onClick={() => { onNavigate('customers', c); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left">
                        <Users size={18} style={{ color: '#7EA8C9' }} />
                        <div className="flex-1"><p className="text-sm" style={{ color: theme.text.primary }}>{c.name}</p><p className="text-xs" style={{ color: theme.text.muted }}>{c.email}</p></div>
                        <StatusBadge status={c.type} />
                      </button>
                    ))}
                  </div>
                )}
                {results.lockers.length > 0 && (
                  <div>
                    <p className="px-3 py-2 text-xs font-semibold uppercase" style={{ color: theme.text.muted }}>Lockers</p>
                    {results.lockers.map(l => (
                      <button key={l.id} onClick={() => { onNavigate('lockers', l); onClose(); }} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-left">
                        <Grid3X3 size={18} style={{ color: '#81C995' }} />
                        <div className="flex-1"><p className="font-mono text-sm" style={{ color: theme.text.primary }}>{l.id}</p><p className="text-xs font-mono" style={{ color: theme.accent.primary }}>{getLockerAddress(l.id, l.terminal)}</p><p className="text-xs" style={{ color: theme.text.muted }}>{l.terminal}</p></div>
                        <StatusBadge status={l.status} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <div className="flex items-center gap-4 p-3 border-t text-xs" style={{ borderColor: theme.border.primary, color: theme.text.muted }}>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.bg.tertiary }}>↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.bg.tertiary }}>↵</kbd> Select</span>
          <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.bg.tertiary }}>ESC</kbd> Close</span>
        </div>
      </div>
    </div>
  );
};
