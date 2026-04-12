import { useState } from 'react';
import { Phone, RefreshCw, Pencil, AlertCircle, CheckCircle2, Wifi, WifiOff } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { errorMessage } from '@/shared/api/errors';
import type { Station, SyncFromTerminalResult } from '../types';
import { useSyncStationFromTerminal } from '../hooks/useLockers';
import { EditStationDrawer } from './EditStationDrawer';

interface Props {
  station: Station;
}

/**
 * Crimson station header that shows the station's customer-facing help phone,
 * last sync timestamp, and an explicit "Sync from terminal" button. The sync
 * action reconciles the admin-side door state with what the kiosk actually
 * reports — necessary because flaky internet drops can cause divergence
 * (the legacy Winnsen manual flags this exact problem).
 */
export function StationHeaderCard({ station }: Props) {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const [editOpen, setEditOpen] = useState(false);
  const [lastResult, setLastResult] = useState<SyncFromTerminalResult | null>(null);

  const sync = useSyncStationFromTerminal(station.sn);

  const onSync = async () => {
    try {
      const result = await sync.mutateAsync();
      setLastResult(result);
      if (result.doorsReconciled === 0) {
        addToast({
          type: 'success',
          message: `Synced ${station.name} — all ${result.doorsChecked} doors already in sync.`,
        });
      } else {
        addToast({
          type: 'success',
          message: `Synced ${station.name} — reconciled ${result.doorsReconciled} of ${result.doorsChecked} doors.`,
        });
      }
    } catch (err) {
      addToast({ type: 'error', message: errorMessage(err) });
    }
  };

  const lastSyncedLabel = station.lastSyncedAt
    ? new Date(station.lastSyncedAt).toLocaleString()
    : 'never';

  return (
    <>
      <div
        className="rounded-2xl mb-6 overflow-hidden border"
        style={{
          background: 'linear-gradient(135deg, #5A0F0F 0%, #7B1818 50%, #5A0F0F 100%)',
          borderColor: '#7B181880',
          boxShadow: '0 8px 32px -8px #7B181860',
        }}
      >
        <div className="p-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase font-semibold tracking-wider text-white/70 mb-1">
              Station
            </p>
            <h2 className="text-2xl font-black tracking-tight text-white">{station.name}</h2>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono px-2 py-0.5 rounded border border-white/30 text-white/80">
                {station.sn}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full border flex items-center gap-1"
                style={{
                  borderColor: station.connect ? '#86EFAC60' : '#F8717160',
                  color: station.connect ? '#86EFAC' : '#F87171',
                  backgroundColor: station.connect ? '#86EFAC10' : '#F8717110',
                }}
              >
                {station.connect ? <Wifi size={11} /> : <WifiOff size={11} />}
                {station.connect ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border backdrop-blur-sm"
              style={{
                borderColor: 'rgba(255,255,255,0.3)',
                backgroundColor: 'rgba(0,0,0,0.25)',
                color: '#FFFFFF',
              }}
            >
              <Pencil size={14} />
              Edit
            </button>
            <button
              type="button"
              onClick={onSync}
              disabled={sync.isPending || station.connect === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border backdrop-blur-sm"
              style={{
                borderColor: '#FCD34D80',
                backgroundColor: 'rgba(0,0,0,0.25)',
                color: '#FCD34D',
                opacity: sync.isPending || station.connect === 0 ? 0.5 : 1,
                cursor: sync.isPending || station.connect === 0 ? 'not-allowed' : 'pointer',
              }}
              title={
                station.connect === 0
                  ? 'Station is offline — cannot sync'
                  : 'Reconcile admin-side door state with the kiosk'
              }
            >
              <RefreshCw size={14} className={sync.isPending ? 'animate-spin' : ''} />
              {sync.isPending ? 'Syncing…' : 'Sync from terminal'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/10 border-t border-white/10">
          <Stat
            icon={<Phone size={13} />}
            label="Help phone"
            value={station.helpPhoneNumber ?? '—'}
            mono
          />
          <Stat
            icon={<RefreshCw size={13} />}
            label="Last synced"
            value={lastSyncedLabel}
          />
          <Stat
            icon={<CheckCircle2 size={13} />}
            label="Doors"
            value={`${station.totalLockers} total · ${station.maintenance} in maintenance`}
          />
        </div>
      </div>

      {lastResult && lastResult.changes.length > 0 && (
        <div
          className="rounded-xl border p-4 mb-6"
          style={{
            borderColor: '#FBBF2440',
            backgroundColor: '#FBBF2410',
          }}
        >
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle size={16} style={{ color: '#FBBF24' }} className="mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold" style={{ color: '#FBBF24' }}>
                Reconciled {lastResult.doorsReconciled} door
                {lastResult.doorsReconciled === 1 ? '' : 's'}
              </p>
              <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>
                The admin view was out of sync with the physical terminal.
                These corrections were applied:
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLastResult(null)}
              className="text-xs"
              style={{ color: theme.text.muted }}
            >
              dismiss
            </button>
          </div>
          <ul className="text-xs space-y-1 ml-6">
            {lastResult.changes.map((c, i) => (
              <li key={i} style={{ color: theme.text.primary }}>
                <span className="font-mono">{c.lockerId}</span> · door {c.doorNo} ·{' '}
                <span style={{ color: theme.text.muted }}>{c.field}</span>:{' '}
                <span className="font-mono" style={{ color: '#F87171' }}>
                  {c.before}
                </span>{' '}
                →{' '}
                <span className="font-mono" style={{ color: '#86EFAC' }}>
                  {c.after}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <EditStationDrawer
        station={station}
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </>
  );
}

function Stat({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="px-5 py-4">
      <p className="text-[11px] uppercase font-semibold tracking-wider text-white/70 flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p
        className={`text-base mt-1 text-white ${mono ? 'font-mono' : ''}`}
      >
        {value}
      </p>
    </div>
  );
}
