import { Link, useSearchParams } from 'react-router-dom';
import {
  Search as SearchIcon,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Users,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useCustomers } from '../hooks/useCustomers';
import { OrderStatusPill } from '@/features/orders/components/OrderStatusPill';

const PAGE_SIZE = 25;

export default function CustomersListPage() {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? 1);
  const q = searchParams.get('q') ?? '';

  const { data, isPending, isRefetching, refetch, error } = useCustomers({
    page,
    size: PAGE_SIZE,
    q: q || undefined,
  });

  const updateParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    if (key !== 'page') next.delete('page');
    setSearchParams(next, { replace: true });
  };

  const total = data?.pageable.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.bg.primary,
        color: theme.text.primary,
        fontFamily: theme.font.primary,
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Customers</h1>
            <p className="text-sm mt-1" style={{ color: theme.text.muted }}>
              {total.toLocaleString()} customer{total === 1 ? '' : 's'}
              {q ? ` matching "${q}"` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => refetch()}
            disabled={isRefetching}
            className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium"
            style={{
              borderColor: theme.border.primary,
              color: theme.text.primary,
            }}
          >
            <RefreshCw size={14} className={isRefetching ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 min-w-[260px]"
            style={{
              borderColor: theme.border.primary,
              backgroundColor: theme.bg.secondary,
            }}
          >
            <SearchIcon size={15} style={{ color: theme.icon.muted }} />
            <input
              value={q}
              onChange={(e) => updateParam('q', e.target.value || undefined)}
              placeholder="Search by phone number or name…"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: theme.text.primary }}
            />
          </div>
        </div>

        {/* Results */}
        {isPending ? (
          <div className="py-16 text-center text-sm" style={{ color: theme.text.muted }}>
            Loading customers…
          </div>
        ) : error ? (
          <div
            className="py-16 text-center rounded-xl border text-sm"
            style={{
              borderColor: '#F8717140',
              backgroundColor: '#F8717110',
              color: '#F87171',
            }}
          >
            Failed to load customers. Check your connection and try again.
          </div>
        ) : !data || data.data.length === 0 ? (
          <div
            className="py-16 text-center rounded-xl border"
            style={{
              borderColor: theme.border.primary,
              backgroundColor: theme.bg.card,
              color: theme.text.muted,
            }}
          >
            <Users size={28} className="mx-auto mb-2 opacity-60" />
            No customers match the current filters.
          </div>
        ) : (
          <>
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                borderColor: theme.border.primary,
                backgroundColor: theme.bg.card,
              }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr
                    className="text-xs uppercase tracking-wide"
                    style={{
                      color: theme.text.muted,
                      backgroundColor: theme.bg.secondary,
                    }}
                  >
                    <th className="text-left px-4 py-3 font-semibold">Phone</th>
                    <th className="text-left px-4 py-3 font-semibold">Total</th>
                    <th className="text-left px-4 py-3 font-semibold">Active</th>
                    <th className="text-left px-4 py-3 font-semibold">Completed</th>
                    <th className="text-left px-4 py-3 font-semibold">Last status</th>
                    <th className="text-left px-4 py-3 font-semibold">Last order</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((c) => (
                    <tr
                      key={c.phone}
                      className="border-t"
                      style={{ borderColor: theme.border.primary }}
                    >
                      <td className="px-4 py-3 font-mono font-semibold">{c.phone}</td>
                      <td className="px-4 py-3 tabular-nums">{c.totalOrders}</td>
                      <td
                        className="px-4 py-3 tabular-nums"
                        style={{ color: c.activeOrders > 0 ? '#FBBF24' : theme.text.muted }}
                      >
                        {c.activeOrders}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{c.completedOrders}</td>
                      <td className="px-4 py-3">
                        <OrderStatusPill status={c.lastStatus} />
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: theme.text.muted }}>
                        {new Date(c.lastOrderAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/customers/${encodeURIComponent(c.phone)}`}
                          className="inline-flex items-center gap-1 text-xs"
                          style={{ color: theme.accent.primary }}
                        >
                          View <ChevronRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs" style={{ color: theme.text.muted }}>
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => updateParam('page', String(Math.max(1, page - 1)))}
                  disabled={page <= 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs"
                  style={{
                    borderColor: theme.border.primary,
                    color: theme.text.primary,
                    opacity: page <= 1 ? 0.4 : 1,
                  }}
                >
                  <ChevronLeft size={12} /> Previous
                </button>
                <button
                  type="button"
                  onClick={() => updateParam('page', String(Math.min(totalPages, page + 1)))}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs"
                  style={{
                    borderColor: theme.border.primary,
                    color: theme.text.primary,
                    opacity: page >= totalPages ? 0.4 : 1,
                  }}
                >
                  Next <ChevronRight size={12} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
