import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Search as SearchIcon,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Plus,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useOrders, useOrderStats } from '../hooks/useOrders';
import { OrderStatusPill } from '../components/OrderStatusPill';
import { CreateOrderDrawer } from '../components/CreateOrderDrawer';

const PAGE_SIZE = 25;

export default function OrdersListPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);

  const page = Number(searchParams.get('page') ?? 1);
  const q = searchParams.get('q') ?? '';

  const {
    data,
    isPending,
    isRefetching,
    refetch,
    error,
  } = useOrders({ page, size: PAGE_SIZE, q: q || undefined });
  const { data: stats } = useOrderStats();

  const updateParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (!value) next.delete(key);
    else next.set(key, value);
    if (key !== 'page') next.delete('page'); // reset paging on filter change
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
            <h1 className="text-3xl font-black tracking-tight">Orders</h1>
            <p className="text-sm mt-1" style={{ color: theme.text.muted }}>
              {total.toLocaleString()} order{total === 1 ? '' : 's'}
              {q ? ` matching "${q}"` : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
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
            <button
              type="button"
              onClick={() => setCreateOpen(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white"
              style={{
                background: `linear-gradient(135deg, ${theme.accent.primary}, ${theme.accent.primary}dd)`,
              }}
            >
              <Plus size={14} />
              New walk-in order
            </button>
          </div>
        </div>

        {/* Crimson stats banner — Figma-inspired */}
        <div
          className="rounded-2xl mb-6 overflow-hidden border"
          style={{
            background: 'linear-gradient(135deg, #5A0F0F 0%, #7B1818 50%, #5A0F0F 100%)',
            borderColor: '#7B181880',
            boxShadow: '0 8px 32px -8px #7B181860',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 divide-x divide-white/10">
            <BannerStat label="Total Orders" value={stats?.total ?? '—'} accent="#FFFFFF" />
            <BannerStat label="Processing" value={stats?.processing ?? '—'} accent="#FCD34D" />
            <BannerStat label="Delivered" value={stats?.delivered ?? '—'} accent="#86EFAC" />
            <BannerStat label="Returned" value={stats?.returned ?? '—'} accent="#FDBA74" />
            <BannerStat label="Recalled" value={stats?.recalled ?? '—'} accent="#FCA5A5" />
          </div>
        </div>

        {/* Filters */}
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
              placeholder="Search by order code or recipient phone…"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: theme.text.primary }}
            />
          </div>
        </div>

        {/* Results */}
        {isPending ? (
          <div className="py-16 text-center text-sm" style={{ color: theme.text.muted }}>
            Loading orders…
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
            Failed to load orders. Check your connection and try again.
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
            No orders match the current filters.
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
                    <th className="text-left px-4 py-3 font-semibold">Code</th>
                    <th className="text-left px-4 py-3 font-semibold">Type</th>
                    <th className="text-left px-4 py-3 font-semibold">Recipient</th>
                    <th className="text-left px-4 py-3 font-semibold">Locker</th>
                    <th className="text-left px-4 py-3 font-semibold">Status</th>
                    <th className="text-left px-4 py-3 font-semibold">Created</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((o) => (
                    <tr
                      key={o.id}
                      className="border-t"
                      style={{ borderColor: theme.border.primary }}
                    >
                      <td className="px-4 py-3 font-mono font-semibold">{o.code}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: theme.text.muted }}>
                        {o.type.code}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          to={`/customers/${encodeURIComponent(o.recipientPhoneNumber)}`}
                          className="hover:underline"
                          style={{ color: theme.accent.primary }}
                        >
                          {o.recipientPhoneNumber}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {o.desLockerCode}
                        {o.srcLockerCode && o.srcLockerCode !== o.desLockerCode
                          ? ` ← ${o.srcLockerCode}`
                          : ''}
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusPill status={o.status.code} />
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: theme.text.muted }}>
                        {new Date(o.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/orders/${encodeURIComponent(o.code)}`}
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

      <CreateOrderDrawer
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={(code) => navigate(`/orders/${encodeURIComponent(code)}`)}
      />
    </div>
  );
}

function BannerStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number | string;
  accent: string;
}) {
  return (
    <div className="px-5 py-5">
      <p className="text-[11px] uppercase font-semibold tracking-wider text-white/70">
        {label}
      </p>
      <p className="text-3xl font-black mt-1 tabular-nums" style={{ color: accent }}>
        {value}
      </p>
    </div>
  );
}
