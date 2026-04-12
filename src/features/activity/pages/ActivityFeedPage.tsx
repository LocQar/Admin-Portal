import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Activity, RefreshCw, Search, X } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { LockerActivityTimeline } from '@/features/lockers/components/LockerActivityTimeline';
import { useStations } from '@/features/lockers/hooks/useLockers';
import type { LockerEventKind } from '@/features/lockers/types';
import { useActivity } from '../hooks/useActivity';
import type { ActivityFilters } from '../api/activityApi';

type ActorFilter = NonNullable<ActivityFilters['actor']>;

const KINDS: Array<{ value: LockerEventKind | ''; label: string }> = [
  { value: '', label: 'All event types' },
  { value: 'PACKAGE', label: 'Package movements' },
  { value: 'DOOR_COMMAND', label: 'Door commands' },
];

const ACTORS: Array<{ value: ActorFilter | ''; label: string }> = [
  { value: '', label: 'All actors' },
  { value: 'ADMIN', label: 'Admin overrides' },
  { value: 'AGENT', label: 'Agents' },
  { value: 'CUSTOMER', label: 'Customers' },
  { value: 'SYSTEM', label: 'System' },
];

/**
 * Cross-cutting activity feed showing every locker event across every
 * station, with URL-backed filters so links are shareable. The same
 * `LockerActivityTimeline` component used on the per-locker detail page
 * renders rows here, which keeps the look-and-feel consistent.
 */
export default function ActivityFeedPage() {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const station = searchParams.get('station') ?? '';
  const kind = (searchParams.get('kind') ?? '') as LockerEventKind | '';
  const actor = (searchParams.get('actor') ?? '') as ActorFilter | '';
  const q = searchParams.get('q') ?? '';

  const filters: ActivityFilters = useMemo(
    () => ({
      ...(station && { station }),
      ...(kind && { kind }),
      ...(actor && { actor }),
      ...(q && { q }),
      limit: 200,
    }),
    [station, kind, actor, q],
  );

  const { data: events, isPending, isFetching, refetch } = useActivity(filters);
  const { data: stations } = useStations();

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  const clearAll = () => setSearchParams(new URLSearchParams());

  const totals = useMemo(() => {
    if (!events) return { total: 0, doors: 0, packages: 0, admin: 0, customer: 0 };
    return {
      total: events.length,
      doors: events.filter((e) => e.kind === 'DOOR_COMMAND').length,
      packages: events.filter((e) => e.kind === 'PACKAGE').length,
      admin: events.filter((e) => e.actor.startsWith('ADMIN')).length,
      customer: events.filter((e) => e.actor.startsWith('CUSTOMER')).length,
    };
  }, [events]);

  const hasFilters = !!(station || kind || actor || q);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.bg.primary, color: theme.text.primary, fontFamily: theme.font.primary }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Hero */}
        <div
          className="rounded-2xl p-6 mb-6 text-white"
          style={{
            background: 'linear-gradient(135deg, #5A0F0F 0%, #7B1818 50%, #5A0F0F 100%)',
            border: '1px solid #7B181880',
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <Activity size={22} />
            <h1 className="text-3xl font-black tracking-tight">Activity</h1>
          </div>
          <p className="text-sm opacity-90 max-w-2xl">
            Every package drop-off, pickup, and door command across every
            terminal — who did what, when, and why. Filter by station, actor
            type, or event kind, then share the URL to hand the view off.
          </p>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          <Kpi label="Events" value={totals.total} />
          <Kpi label="Package movements" value={totals.packages} />
          <Kpi label="Door commands" value={totals.doors} />
          <Kpi label="Admin overrides" value={totals.admin} />
          <Kpi label="Customer actions" value={totals.customer} />
        </div>

        {/* Filter bar */}
        <div
          className="rounded-xl border p-4 mb-4 flex flex-wrap items-center gap-3"
          style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}
        >
          <div className="relative flex-1 min-w-[220px]">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              style={{ color: theme.icon.muted }}
            />
            <input
              type="text"
              value={q}
              onChange={(e) => updateParam('q', e.target.value)}
              placeholder="Search package code, locker, reason, actor…"
              className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none"
              style={{
                backgroundColor: theme.bg.secondary,
                borderColor: theme.border.primary,
                color: theme.text.primary,
              }}
            />
          </div>

          <select
            value={station}
            onChange={(e) => updateParam('station', e.target.value)}
            className="px-3 py-2 rounded-xl border text-sm outline-none"
            style={{
              backgroundColor: theme.bg.secondary,
              borderColor: theme.border.primary,
              color: theme.text.primary,
            }}
          >
            <option value="">All stations</option>
            {stations?.map((s) => (
              <option key={s.sn} value={s.sn}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={kind}
            onChange={(e) => updateParam('kind', e.target.value)}
            className="px-3 py-2 rounded-xl border text-sm outline-none"
            style={{
              backgroundColor: theme.bg.secondary,
              borderColor: theme.border.primary,
              color: theme.text.primary,
            }}
          >
            {KINDS.map((k) => (
              <option key={k.value} value={k.value}>
                {k.label}
              </option>
            ))}
          </select>

          <select
            value={actor}
            onChange={(e) => updateParam('actor', e.target.value)}
            className="px-3 py-2 rounded-xl border text-sm outline-none"
            style={{
              backgroundColor: theme.bg.secondary,
              borderColor: theme.border.primary,
              color: theme.text.primary,
            }}
          >
            {ACTORS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={clearAll}
              className="px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5"
              style={{
                borderColor: theme.border.primary,
                color: theme.text.muted,
              }}
            >
              <X size={12} />
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={() => refetch()}
            disabled={isFetching}
            className="px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5"
            style={{
              borderColor: theme.border.primary,
              color: theme.text.primary,
              opacity: isFetching ? 0.5 : 1,
            }}
          >
            <RefreshCw size={12} className={isFetching ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {/* Timeline */}
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}
        >
          <LockerActivityTimeline events={events} loading={isPending} />
        </div>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: number }) {
  const { theme } = useTheme();
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}
    >
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: theme.text.muted }}>
        {label}
      </p>
      <p className="text-2xl font-black mt-1">{value}</p>
    </div>
  );
}
