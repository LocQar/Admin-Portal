import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Grid3X3,
  LayoutList,
  Search as SearchIcon,
  DoorOpen,
  Battery,
  BatteryWarning,
  Thermometer,
  ChevronRight,
  RefreshCw,
  ArrowLeft,
  Building2,
  Wifi,
  WifiOff,
  MapPin,
  Activity,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useStations, useLockers } from '../hooks/useLockers';
import type { LockerStatus, Station } from '../types';
import { StatusPill, LOCKER_STATUS_META } from '../components/StatusPill';
import { StationHeaderCard } from '../components/StationHeaderCard';
import { LockerActivityTimeline } from '../components/LockerActivityTimeline';
import { useActivity } from '@/features/activity/hooks/useActivity';

type View = 'grid' | 'list';

const STATUS_OPTIONS: Array<{ value: LockerStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'available', label: 'Available' },
  { value: 'occupied', label: 'Occupied' },
  { value: 'reserved', label: 'Reserved' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'offline', label: 'Offline' },
];

export default function LockersListPage() {
  const { theme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState<View>('grid');

  const stationSn = searchParams.get('station') ?? undefined;
  const statusParam = (searchParams.get('status') ?? 'all') as LockerStatus | 'all';
  const q = searchParams.get('q') ?? '';
  const tab = (searchParams.get('tab') ?? 'doors') as 'doors' | 'activity';

  const { data: stations = [], isPending: stationsPending } = useStations();
  const selectedStation = stationSn ? stations.find((s) => s.sn === stationSn) : undefined;
  const {
    data: lockers = [],
    isPending: lockersPending,
    isRefetching,
    refetch,
  } = useLockers({
    stationSn,
    status: statusParam === 'all' ? undefined : statusParam,
    search: q || undefined,
  });

  const kpis = useMemo(() => {
    const counts: Record<LockerStatus, number> = {
      available: 0,
      occupied: 0,
      reserved: 0,
      maintenance: 0,
      offline: 0,
    };
    for (const l of lockers) counts[l.status]++;
    return counts;
  }, [lockers]);

  const updateParam = (key: string, value: string | undefined) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') next.delete(key);
    else next.set(key, value);
    setSearchParams(next, { replace: true });
  };

  // Top-level view: list of terminals (stations). Drilling into a terminal
  // navigates to /lockers?station=<sn> which renders the locker grid for
  // just that terminal. This mirrors how the Winnsen admin UI organizes
  // lockers — they're always scoped to a physical kiosk.
  if (!stationSn) {
    return (
      <TerminalsOverview
        stations={stations}
        loading={stationsPending}
        searchParams={searchParams}
        updateParam={updateParam}
        onOpen={(sn) => updateParam('station', sn)}
      />
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.bg.primary, color: theme.text.primary, fontFamily: theme.font.primary }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              type="button"
              onClick={() => updateParam('station', undefined)}
              className="inline-flex items-center gap-1 text-xs mb-2"
              style={{ color: theme.text.muted }}
            >
              <ArrowLeft size={12} />
              All terminals
            </button>
            <h1 className="text-3xl font-black tracking-tight">Lockers</h1>
            <p className="text-sm mt-1" style={{ color: theme.text.muted }}>
              {lockers.length} locker{lockers.length === 1 ? '' : 's'}
              {` · ${selectedStation?.name ?? stationSn}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isRefetching}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium"
              style={{ borderColor: theme.border.primary, color: theme.text.primary }}
            >
              <RefreshCw size={14} className={isRefetching ? 'animate-spin' : ''} />
              Refresh
            </button>
            <div className="flex p-1 rounded-xl border" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.secondary }}>
              <button
                type="button"
                onClick={() => setView('grid')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
                style={{
                  backgroundColor: view === 'grid' ? theme.bg.primary : 'transparent',
                  color: view === 'grid' ? theme.text.primary : theme.text.muted,
                }}
              >
                <Grid3X3 size={13} />
                Grid
              </button>
              <button
                type="button"
                onClick={() => setView('list')}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5"
                style={{
                  backgroundColor: view === 'list' ? theme.bg.primary : 'transparent',
                  color: view === 'list' ? theme.text.primary : theme.text.muted,
                }}
              >
                <LayoutList size={13} />
                List
              </button>
            </div>
          </div>
        </div>

        {/* Station hero */}
        {selectedStation && <StationHeaderCard station={selectedStation} />}

        {/* Tab strip — Doors (the locker grid) vs Activity (timeline of every
            event at this station: door commands + package movements). */}
        <div
          className="flex gap-1 mb-5 p-1 rounded-xl border w-fit"
          style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.secondary }}
        >
          <TabButton
            active={tab === 'doors'}
            onClick={() => updateParam('tab', undefined)}
            icon={<Grid3X3 size={13} />}
            label="Doors"
          />
          <TabButton
            active={tab === 'activity'}
            onClick={() => updateParam('tab', 'activity')}
            icon={<Activity size={13} />}
            label="Activity"
          />
        </div>

        {tab === 'activity' ? (
          <StationActivityPanel stationSn={stationSn} />
        ) : (
        <>
        {/* KPI strip */}
        <div className="grid grid-cols-5 gap-3 mb-6">
          {(Object.entries(kpis) as [LockerStatus, number][]).map(([status, count]) => {
            const meta = LOCKER_STATUS_META[status];
            return (
              <button
                key={status}
                type="button"
                onClick={() => updateParam('status', statusParam === status ? 'all' : status)}
                className="text-left rounded-xl border p-4 transition-colors"
                style={{
                  borderColor: statusParam === status ? meta.color : theme.border.primary,
                  backgroundColor: theme.bg.card,
                }}
              >
                <p className="text-xs uppercase font-semibold tracking-wide" style={{ color: theme.text.muted }}>
                  {meta.label}
                </p>
                <p className="text-2xl font-black mt-1" style={{ color: meta.color }}>
                  {count}
                </p>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          {/* Search */}
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 min-w-[260px]"
            style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.secondary }}
          >
            <SearchIcon size={15} style={{ color: theme.icon.muted }} />
            <input
              value={q}
              onChange={(e) => updateParam('q', e.target.value || undefined)}
              placeholder="Search by locker ID, station, or package…"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: theme.text.primary }}
            />
          </div>
          {/* Status */}
          <select
            value={statusParam}
            onChange={(e) => updateParam('status', e.target.value)}
            className="px-3 py-2 rounded-xl border text-sm"
            style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.secondary, color: theme.text.primary }}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* Results */}
        {lockersPending ? (
          <div className="py-16 text-center text-sm" style={{ color: theme.text.muted }}>
            Loading lockers…
          </div>
        ) : lockers.length === 0 ? (
          <div
            className="py-16 text-center rounded-xl border"
            style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card, color: theme.text.muted }}
          >
            No lockers match the current filters.
          </div>
        ) : view === 'grid' ? (
          <GridView lockers={lockers} />
        ) : (
          <ListView lockers={lockers} />
        )}
        </>
        )}
      </div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  const { theme } = useTheme();
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5"
      style={{
        backgroundColor: active ? theme.bg.primary : 'transparent',
        color: active ? theme.text.primary : theme.text.muted,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function StationActivityPanel({ stationSn }: { stationSn: string }) {
  const { theme } = useTheme();
  const { data: events, isPending } = useActivity({ station: stationSn, limit: 200 });
  return (
    <div
      className="rounded-xl border p-5"
      style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3
            className="text-xs uppercase tracking-wide font-semibold"
            style={{ color: theme.text.muted }}
          >
            Activity
          </h3>
          <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>
            Every door command and package movement at this terminal.
          </p>
        </div>
        {events && events.length > 0 && (
          <span
            className="text-xs px-2 py-1 rounded-md font-mono"
            style={{ backgroundColor: theme.bg.secondary, color: theme.text.muted }}
          >
            {events.length} {events.length === 1 ? 'event' : 'events'}
          </span>
        )}
      </div>
      <LockerActivityTimeline events={events} loading={isPending} />
    </div>
  );
}

function GridView({ lockers }: { lockers: import('../types').Locker[] }) {
  const { theme } = useTheme();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {lockers.map((l) => {
        const BatteryIcon = l.battery < 20 ? BatteryWarning : Battery;
        const batteryColor = l.battery < 20 ? '#F87171' : l.battery < 50 ? '#FBBF24' : '#4ADE80';
        return (
          <Link
            key={l.id}
            to={`/lockers/${encodeURIComponent(l.id)}`}
            className="rounded-xl border p-4 block transition-colors hover:bg-white/5"
            style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xl font-black tracking-tight">{l.id}</p>
              <StatusPill status={l.status} />
            </div>
            <p className="text-xs mb-3" style={{ color: theme.text.muted }}>
              {l.stationName} · Door {l.doorNo} · {l.sizeLabel}
            </p>
            <div className="flex items-center justify-between text-xs" style={{ color: theme.text.muted }}>
              <span className="flex items-center gap-1">
                <BatteryIcon size={12} style={{ color: batteryColor }} />
                {l.battery}%
              </span>
              {l.temp !== null && (
                <span className="flex items-center gap-1">
                  <Thermometer size={12} />
                  {l.temp}°C
                </span>
              )}
              {l.opened === 1 && (
                <span className="flex items-center gap-1" style={{ color: '#FBBF24' }}>
                  <DoorOpen size={12} />
                  Open
                </span>
              )}
            </div>
            {l.packageId && (
              <p className="text-xs mt-2 font-mono truncate" style={{ color: theme.accent.primary }}>
                📦 {l.packageId}
              </p>
            )}
          </Link>
        );
      })}
    </div>
  );
}

function ListView({ lockers }: { lockers: import('../types').Locker[] }) {
  const { theme } = useTheme();
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}
    >
      <table className="w-full text-sm">
        <thead>
          <tr
            className="text-xs uppercase tracking-wide"
            style={{ color: theme.text.muted, backgroundColor: theme.bg.secondary }}
          >
            <th className="text-left px-4 py-3 font-semibold">ID</th>
            <th className="text-left px-4 py-3 font-semibold">Station</th>
            <th className="text-left px-4 py-3 font-semibold">Door</th>
            <th className="text-left px-4 py-3 font-semibold">Size</th>
            <th className="text-left px-4 py-3 font-semibold">Status</th>
            <th className="text-left px-4 py-3 font-semibold">Battery</th>
            <th className="text-left px-4 py-3 font-semibold">Temp</th>
            <th className="text-left px-4 py-3 font-semibold">Package</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {lockers.map((l) => (
            <tr
              key={l.id}
              className="border-t"
              style={{ borderColor: theme.border.primary }}
            >
              <td className="px-4 py-3 font-semibold">{l.id}</td>
              <td className="px-4 py-3">{l.stationName}</td>
              <td className="px-4 py-3">{l.doorNo}</td>
              <td className="px-4 py-3">{l.sizeLabel}</td>
              <td className="px-4 py-3">
                <StatusPill status={l.status} />
              </td>
              <td className="px-4 py-3">{l.battery}%</td>
              <td className="px-4 py-3">{l.temp !== null ? `${l.temp}°C` : '—'}</td>
              <td className="px-4 py-3 font-mono text-xs">{l.packageId ?? '—'}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  to={`/lockers/${encodeURIComponent(l.id)}`}
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
  );
}

interface TerminalsOverviewProps {
  stations: Station[];
  loading: boolean;
  searchParams: URLSearchParams;
  updateParam: (key: string, value: string | undefined) => void;
  onOpen: (sn: string) => void;
}

function TerminalsOverview({
  stations,
  loading,
  searchParams,
  updateParam,
  onOpen,
}: TerminalsOverviewProps) {
  const { theme } = useTheme();
  const q = searchParams.get('q') ?? '';
  const region = searchParams.get('region') ?? 'all';
  const statusFilter = searchParams.get('status') ?? 'all'; // 'all' | 'online' | 'offline'

  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const s of stations) set.add(s.region);
    return Array.from(set).sort();
  }, [stations]);

  const filtered = useMemo(() => {
    return stations.filter((s) => {
      if (region !== 'all' && s.region !== region) return false;
      if (statusFilter === 'online' && s.connect !== 1) return false;
      if (statusFilter === 'offline' && s.connect !== 0) return false;
      if (q) {
        const hay = `${s.name} ${s.sn} ${s.location} ${s.region} ${s.city}`.toLowerCase();
        if (!hay.includes(q.toLowerCase())) return false;
      }
      return true;
    });
  }, [stations, region, statusFilter, q]);

  const totals = useMemo(() => {
    let online = 0;
    let offline = 0;
    let totalDoors = 0;
    let occupied = 0;
    let maintenance = 0;
    for (const s of stations) {
      if (s.connect === 1) online++;
      else offline++;
      totalDoors += s.totalLockers;
      occupied += s.occupied;
      maintenance += s.maintenance;
    }
    return { online, offline, totalDoors, occupied, maintenance };
  }, [stations]);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.bg.primary, color: theme.text.primary, fontFamily: theme.font.primary }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight">Lockers</h1>
            <p className="text-sm mt-1" style={{ color: theme.text.muted }}>
              {filtered.length} of {stations.length} terminal{stations.length === 1 ? '' : 's'} · pick a terminal to manage its doors
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium"
              style={{ borderColor: theme.border.primary, color: theme.text.primary }}
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* Aggregate KPI strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          <KpiCard
            label="Terminals"
            value={String(stations.length)}
            icon={<Building2 size={14} />}
            accent={theme.accent.primary}
          />
          <KpiCard
            label="Online"
            value={String(totals.online)}
            icon={<Wifi size={14} />}
            accent="#86EFAC"
          />
          <KpiCard
            label="Offline"
            value={String(totals.offline)}
            icon={<WifiOff size={14} />}
            accent="#F87171"
          />
          <KpiCard
            label="Total doors"
            value={String(totals.totalDoors)}
            icon={<DoorOpen size={14} />}
          />
          <KpiCard
            label="Occupied"
            value={`${totals.occupied} / ${totals.totalDoors}`}
            icon={<Grid3X3 size={14} />}
            accent="#FBBF24"
            sub={`${totals.totalDoors > 0 ? Math.round((totals.occupied / totals.totalDoors) * 100) : 0}% utilization`}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl border flex-1 min-w-[260px]"
            style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.secondary }}
          >
            <SearchIcon size={15} style={{ color: theme.icon.muted }} />
            <input
              value={q}
              onChange={(e) => updateParam('q', e.target.value || undefined)}
              placeholder="Search terminals by name, SN, or location…"
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: theme.text.primary }}
            />
          </div>
          <select
            value={region}
            onChange={(e) => updateParam('region', e.target.value === 'all' ? undefined : e.target.value)}
            className="px-3 py-2 rounded-xl border text-sm"
            style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.secondary, color: theme.text.primary }}
          >
            <option value="all">All regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => updateParam('status', e.target.value === 'all' ? undefined : e.target.value)}
            className="px-3 py-2 rounded-xl border text-sm"
            style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.secondary, color: theme.text.primary }}
          >
            <option value="all">All statuses</option>
            <option value="online">Online only</option>
            <option value="offline">Offline only</option>
          </select>
        </div>

        {loading ? (
          <div className="py-16 text-center text-sm" style={{ color: theme.text.muted }}>
            Loading terminals…
          </div>
        ) : stations.length === 0 ? (
          <div
            className="py-16 text-center rounded-xl border"
            style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card, color: theme.text.muted }}
          >
            No terminals provisioned yet.
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="py-16 text-center rounded-xl border"
            style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card, color: theme.text.muted }}
          >
            No terminals match the current filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((s) => (
              <TerminalCard key={s.sn} station={s} onOpen={() => onOpen(s.sn)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  icon,
  accent,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  accent?: string;
  sub?: string;
}) {
  const { theme } = useTheme();
  return (
    <div
      className="rounded-xl border p-4"
      style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}
    >
      <div
        className="flex items-center gap-1.5 text-xs uppercase font-semibold tracking-wide"
        style={{ color: theme.text.muted }}
      >
        <span style={{ color: accent ?? theme.text.muted }}>{icon}</span>
        {label}
      </div>
      <p className="text-2xl font-black mt-1" style={{ color: accent ?? theme.text.primary }}>
        {value}
      </p>
      {sub && (
        <p className="text-[11px] mt-0.5" style={{ color: theme.text.muted }}>
          {sub}
        </p>
      )}
    </div>
  );
}

function TerminalCard({ station, onOpen }: { station: Station; onOpen: () => void }) {
  const { theme } = useTheme();
  const online = station.connect === 1;
  const utilization = station.totalLockers > 0
    ? Math.round((station.occupied / station.totalLockers) * 100)
    : 0;
  const lastSyncedLabel = station.lastSyncedAt
    ? formatRelative(station.lastSyncedAt)
    : 'never';

  return (
    <button
      type="button"
      onClick={onOpen}
      className="text-left rounded-2xl border p-5 transition-colors hover:bg-white/5 group"
      style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${theme.accent.primary}20`,
              color: theme.accent.primary,
            }}
          >
            <Building2 size={18} />
          </div>
          <div className="min-w-0">
            <p className="text-base font-black tracking-tight truncate">{station.name}</p>
            <p className="text-[11px] font-mono mt-0.5 truncate" style={{ color: theme.text.muted }}>
              {station.sn}
            </p>
          </div>
        </div>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0"
          style={{
            borderColor: online ? '#86EFAC60' : '#F8717160',
            color: online ? '#86EFAC' : '#F87171',
            backgroundColor: online ? '#86EFAC10' : '#F8717110',
          }}
        >
          {online ? <Wifi size={10} /> : <WifiOff size={10} />}
          {online ? 'Online' : 'Offline'}
        </span>
      </div>

      <div
        className="flex items-center gap-1 text-xs mb-3"
        style={{ color: theme.text.muted }}
      >
        <MapPin size={11} />
        {station.location} · {station.region}
      </div>

      <div className="grid grid-cols-3 gap-2 text-center mb-3">
        <CardStat label="Doors" value={String(station.totalLockers)} />
        <CardStat label="Occupied" value={String(station.occupied)} accent="#FBBF24" />
        <CardStat label="Maint." value={String(station.maintenance)} accent="#F87171" />
      </div>

      {/* Utilization bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[11px] mb-1" style={{ color: theme.text.muted }}>
          <span>Utilization</span>
          <span>{utilization}%</span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ backgroundColor: theme.bg.secondary }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${utilization}%`,
              backgroundColor: utilization > 85 ? '#F87171' : utilization > 60 ? '#FBBF24' : '#86EFAC',
            }}
          />
        </div>
      </div>

      {/* Footer: help phone + last synced */}
      <div
        className="pt-3 border-t flex items-center justify-between text-[11px]"
        style={{ borderColor: theme.border.primary, color: theme.text.muted }}
      >
        <span className="truncate font-mono">
          {station.helpPhoneNumber ?? 'no help line'}
        </span>
        <span className="flex items-center gap-1 shrink-0 ml-2">
          <RefreshCw size={10} />
          {lastSyncedLabel}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-end text-[11px]">
        <span className="inline-flex items-center gap-1 font-semibold" style={{ color: theme.accent.primary }}>
          Manage doors <ChevronRight size={11} />
        </span>
      </div>
    </button>
  );
}

function CardStat({ label, value, accent }: { label: string; value: string; accent?: string }) {
  const { theme } = useTheme();
  return (
    <div
      className="rounded-lg py-2"
      style={{ backgroundColor: theme.bg.secondary }}
    >
      <p className="text-base font-black" style={{ color: accent ?? theme.text.primary }}>
        {value}
      </p>
      <p className="text-[10px] uppercase tracking-wide" style={{ color: theme.text.muted }}>
        {label}
      </p>
    </div>
  );
}

function formatRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  if (diffMs < 0) return 'in the future';
  const sec = Math.round(diffMs / 1000);
  if (sec < 60) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleDateString();
}
