import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search as SearchIcon,
  ChevronRight,
  ChevronLeft,
  RefreshCw,
  Plus,
  Truck,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useCourierCompanies } from '../hooks/useCouriers';
import { CreateCourierCompanyDrawer } from '../components/CreateCourierCompanyDrawer';

const PAGE_SIZE = 25;

export default function CourierCompaniesListPage() {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);

  const page = Number(searchParams.get('page') ?? 1);
  const q = searchParams.get('q') ?? '';

  const { data, isPending, isRefetching, refetch, error } = useCourierCompanies({
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
  const activeCount = data?.data.filter((c) => c.active).length ?? 0;
  const totalStaff = data?.data.reduce((sum, c) => sum + c.staffCount, 0) ?? 0;

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
            <h1 className="text-3xl font-black tracking-tight">Courier Companies</h1>
            <p className="text-sm mt-1" style={{ color: theme.text.muted }}>
              {total.toLocaleString()} compan{total === 1 ? 'y' : 'ies'}
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
              New courier company
            </button>
          </div>
        </div>

        {/* Crimson stats banner */}
        <div
          className="rounded-2xl mb-6 overflow-hidden border"
          style={{
            background: 'linear-gradient(135deg, #5A0F0F 0%, #7B1818 50%, #5A0F0F 100%)',
            borderColor: '#7B181880',
            boxShadow: '0 8px 32px -8px #7B181860',
          }}
        >
          <div className="grid grid-cols-3 divide-x divide-white/10">
            <BannerStat label="Total Companies" value={total} accent="#FFFFFF" />
            <BannerStat label="Active" value={activeCount} accent="#86EFAC" />
            <BannerStat label="Active Couriers" value={totalStaff} accent="#FCD34D" />
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
              placeholder="Search by code or company name…"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: theme.text.primary }}
            />
          </div>
        </div>

        {/* Results */}
        {isPending ? (
          <div className="py-16 text-center text-sm" style={{ color: theme.text.muted }}>
            Loading courier companies…
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
            Failed to load courier companies. Check your connection and try again.
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
            <Truck size={28} className="mx-auto mb-2 opacity-60" />
            No courier companies match the current filters.
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
                    <th className="text-left px-4 py-3 font-semibold">Name</th>
                    <th className="text-left px-4 py-3 font-semibold">Contact</th>
                    <th className="text-left px-4 py-3 font-semibold">Couriers</th>
                    <th className="text-left px-4 py-3 font-semibold">Authorized lockers</th>
                    <th className="text-left px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {data.data.map((c) => (
                    <tr
                      key={c.id}
                      className="border-t"
                      style={{ borderColor: theme.border.primary }}
                    >
                      <td className="px-4 py-3 font-mono font-semibold">{c.code}</td>
                      <td className="px-4 py-3">{c.name}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: theme.text.muted }}>
                        {c.contactPhone ?? '—'}
                      </td>
                      <td className="px-4 py-3 tabular-nums">{c.staffCount}</td>
                      <td className="px-4 py-3 tabular-nums">{c.authorizedLockerCount}</td>
                      <td className="px-4 py-3">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full border"
                          style={{
                            borderColor: c.active ? '#86EFAC60' : theme.border.primary,
                            color: c.active ? '#86EFAC' : theme.text.muted,
                            backgroundColor: c.active ? '#86EFAC10' : 'transparent',
                          }}
                        >
                          {c.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/couriers/${c.id}`}
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

      <CreateCourierCompanyDrawer open={createOpen} onClose={() => setCreateOpen(false)} />
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
