import React, { useState, useEffect, useMemo } from 'react';
import { Scan, X, QrCode, PackageX, CheckCircle2, Eye, RefreshCw, Package } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { StatusBadge, DeliveryMethodBadge, PackageStatusFlow } from '../ui';
import { packagesData, getLockerAddress } from '../../constants/mockData';
import { hasPermission } from '../../constants';

export const ScanModal = ({ isOpen, onClose, userRole, addToast, onViewPackage, onReassign, onReturn }) => {
  const { theme } = useTheme();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setResult(null);
      setSearched(false);
    }
  }, [isOpen]);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.length < 3) {
      setResult(null);
      setSearched(false);
      return;
    }
    const q = value.toUpperCase().trim();
    const found = packagesData.find(p => p.waybill.toUpperCase() === q || p.waybill.toUpperCase().includes(q));
    setResult(found || null);
    setSearched(true);
  };

  const handleConfirmScan = () => {
    if (!result) return;
    setHistory(prev => {
      const filtered = prev.filter(h => h.id !== result.id);
      return [{ ...result, scannedAt: new Date().toLocaleTimeString() }, ...filtered].slice(0, 5);
    });
    addToast({ type: 'success', message: `Package ${result.waybill} scanned successfully` });
  };

  const handleAction = (action) => {
    if (!result) return;
    if (action === 'reassigned') {
      onReassign(result);
      onClose();
      return;
    }
    if (action === 'marked for return') {
      onReturn(result);
      onClose();
      return;
    }
    addToast({ type: 'success', message: `Package ${result.waybill} ${action}` });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative w-full max-w-lg rounded-2xl border shadow-2xl mx-4"
        style={{ backgroundColor: theme.bg.card, borderColor: theme.border.primary }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accent.light }}>
            <Scan size={20} style={{ color: theme.accent.primary }} />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold" style={{ color: theme.text.primary }}>Scan Package</h2>
            <p className="text-xs" style={{ color: theme.text.muted }}>Enter or scan a waybill number</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5" style={{ color: theme.icon.muted }}>
            <X size={18} />
          </button>
        </div>

        {/* Input */}
        <div className="p-4 border-b" style={{ borderColor: theme.border.primary }}>
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-xl border"
            style={{
              backgroundColor: theme.bg.tertiary,
              borderColor: result ? '#10b981' : searched && !result ? '#ef4444' : theme.border.primary
            }}
          >
            <QrCode size={18} style={{ color: theme.icon.muted }} />
            <input
              type="text"
              value={query}
              onChange={e => handleSearch(e.target.value)}
              placeholder="LQ-2024-00001"
              autoFocus
              className="flex-1 bg-transparent outline-none font-mono text-sm"
              style={{ color: theme.text.primary }}
            />
            {query && (
              <button onClick={() => handleSearch('')} className="p-1 rounded" style={{ color: theme.icon.muted }}>
                <X size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Result */}
        <div className="max-h-[60vh] overflow-y-auto">
          {searched && !result && (
            <div className="p-8 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
              >
                <PackageX size={28} className="text-red-500" />
              </div>
              <p className="font-medium" style={{ color: theme.text.primary }}>Package not found</p>
              <p className="text-sm mt-1" style={{ color: theme.text.muted }}>No package matches "{query}"</p>
            </div>
          )}

          {result && (
            <div className="p-4 space-y-4">
              {/* Package header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-mono font-semibold" style={{ color: theme.text.primary }}>{result.waybill}</p>
                  <p className="text-sm" style={{ color: theme.text.muted }}>{result.customer}</p>
                </div>
                <div className="flex items-center gap-2">
                  <DeliveryMethodBadge method={result.deliveryMethod} />
                  <StatusBadge status={result.status} />
                </div>
              </div>

              {/* Status flow */}
              <div
                className="p-3 rounded-xl border"
                style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}
              >
                <PackageStatusFlow status={result.status} deliveryMethod={result.deliveryMethod} />
              </div>

              {/* Details grid */}
              <div
                className="grid grid-cols-2 gap-3 p-3 rounded-xl border"
                style={{ backgroundColor: theme.bg.tertiary, borderColor: theme.border.primary }}
              >
                {[
                  ['Customer', result.customer],
                  ['Phone', result.phone],
                  ['Destination', result.destination],
                  ['Locker', result.locker !== '-' ? result.locker : '—'],
                  ['Value', `GH₵ ${result.value}`],
                  ['Weight', result.weight],
                  ['Size', result.size],
                  ['Service', result.product],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p className="text-xs" style={{ color: theme.text.muted }}>{label}</p>
                    <p className="text-sm font-medium" style={{ color: theme.text.primary }}>{value}</p>
                  </div>
                ))}
                {result.locker !== '-' && (
                  <div>
                    <p className="text-xs" style={{ color: theme.text.muted }}>Locker Address</p>
                    <p className="text-sm font-mono font-medium" style={{ color: theme.accent.primary }}>
                      {getLockerAddress(result.locker, result.destination)}
                    </p>
                  </div>
                )}
                {result.cod && (
                  <div>
                    <p className="text-xs" style={{ color: theme.text.muted }}>COD</p>
                    <p className="text-sm font-medium text-amber-500">GH₵ {result.value}</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmScan}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}
                >
                  <CheckCircle2 size={16} /> Confirm Scan
                </button>
                <button
                  onClick={() => {
                    onViewPackage(result);
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm"
                  style={{ borderColor: theme.border.primary, color: theme.text.secondary }}
                >
                  <Eye size={16} /> Details
                </button>
              </div>

              {hasPermission(userRole, 'packages.update') && (
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleAction('marked as delivered')}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-emerald-500 text-xs"
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.2)'
                    }}
                  >
                    <CheckCircle2 size={18} /> Delivered
                  </button>
                  <button
                    onClick={() => handleAction('reassigned')}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-amber-500 text-xs"
                    style={{
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      border: '1px solid rgba(245, 158, 11, 0.2)'
                    }}
                  >
                    <RefreshCw size={18} /> Reassign
                  </button>
                  <button
                    onClick={() => handleAction('marked for return')}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-red-500 text-xs"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.2)'
                    }}
                  >
                    <PackageX size={18} /> Return
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Scan History */}
          {!searched && history.length > 0 && (
            <div className="p-4">
              <p className="text-xs font-semibold uppercase mb-3" style={{ color: theme.text.muted }}>Recent Scans</p>
              <div className="space-y-2">
                {history.map(h => (
                  <button
                    key={h.id}
                    onClick={() => handleSearch(h.waybill)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left hover:bg-white/5"
                    style={{ backgroundColor: theme.bg.tertiary }}
                  >
                    <div className="p-2 rounded-lg" style={{ backgroundColor: theme.accent.light }}>
                      <Package size={16} style={{ color: theme.accent.primary }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm truncate" style={{ color: theme.text.primary }}>{h.waybill}</p>
                      <p className="text-xs" style={{ color: theme.text.muted }}>{h.customer} • {h.destination}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <StatusBadge status={h.status} />
                      <p className="text-xs mt-1" style={{ color: theme.text.muted }}>{h.scannedAt}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {!searched && history.length === 0 && (
            <div className="p-8 text-center">
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: theme.accent.light }}
              >
                <Scan size={28} style={{ color: theme.accent.primary }} />
              </div>
              <p className="font-medium" style={{ color: theme.text.primary }}>Ready to scan</p>
              <p className="text-sm mt-1" style={{ color: theme.text.muted }}>Type a waybill number to look up a package</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-4 p-3 border-t text-xs"
          style={{ borderColor: theme.border.primary, color: theme.text.muted }}
        >
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.bg.tertiary }}>⌘S</kbd> Open scanner
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded" style={{ backgroundColor: theme.bg.tertiary }}>ESC</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
};
