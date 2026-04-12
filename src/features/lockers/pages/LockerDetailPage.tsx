import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  DoorOpen,
  Lock,
  Unlock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  Battery,
  BatteryWarning,
  Thermometer,
  Package as PackageIcon,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import {
  useDoorCommand,
  useLocker,
  useLockerEvents,
  useUpdateLocker,
} from '../hooks/useLockers';
import { errorMessage } from '@/shared/api/errors';
import { StatusPill } from '../components/StatusPill';
import { LockerActivityTimeline } from '../components/LockerActivityTimeline';
import { DoorActionConfirmDialog } from '../components/DoorActionConfirmDialog';
import type { LockerStatus } from '../types';

type DoorAction = 'open' | 'close' | 'lock' | 'unlock';

const STATUSES: LockerStatus[] = ['available', 'occupied', 'reserved', 'maintenance', 'offline'];

export default function LockerDetailPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { addToast } = useToast();

  const { data: locker, isPending, isError, error } = useLocker(id);
  const { data: events, isPending: eventsPending } = useLockerEvents(id);
  const updateLocker = useUpdateLocker(id);
  const doorCommand = useDoorCommand(id);

  const busy = updateLocker.isPending || doorCommand.isPending;

  // When a sensitive action (open/unlock) targets an occupied door we route
  // through a confirm dialog that captures a mandatory reason. close/lock and
  // empty-door open/unlock fire directly.
  const [pendingAction, setPendingAction] = useState<DoorAction | null>(null);

  const fireDoorCommand = async (action: DoorAction, reason?: string) => {
    try {
      const result = await doorCommand.mutateAsync({ action, reason });
      addToast({
        type: 'success',
        message: `Door ${action} — ${result.message ?? 'ok'}`,
      });
      setPendingAction(null);
    } catch (err) {
      addToast({ type: 'error', message: errorMessage(err) });
    }
  };

  const requestDoor = (action: DoorAction) => {
    const isSensitive = action === 'open' || action === 'unlock';
    if (isSensitive && locker?.occupied === 1) {
      setPendingAction(action);
      return;
    }
    fireDoorCommand(action);
  };

  const setStatus = async (status: LockerStatus) => {
    try {
      await updateLocker.mutateAsync({ status });
      addToast({ type: 'success', message: `Locker ${id} set to ${status}` });
    } catch (err) {
      addToast({ type: 'error', message: errorMessage(err) });
    }
  };

  if (isPending) {
    return (
      <Shell>
        <p className="text-sm" style={{ color: theme.text.muted }}>
          Loading locker {id}…
        </p>
      </Shell>
    );
  }

  if (isError || !locker) {
    return (
      <Shell>
        <div className="rounded-xl border p-6" style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}>
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={18} style={{ color: '#F87171' }} />
            <h2 className="text-lg font-semibold">Couldn&apos;t load locker {id}</h2>
          </div>
          <p className="text-sm" style={{ color: theme.text.muted }}>
            {errorMessage(error) || 'The locker may have been removed or the station is offline.'}
          </p>
          <button
            type="button"
            onClick={() => navigate('/lockers')}
            className="mt-4 px-4 py-2 rounded-xl text-sm font-medium"
            style={{ backgroundColor: theme.accent.primary, color: theme.accent.contrast }}
          >
            Back to lockers
          </button>
        </div>
      </Shell>
    );
  }

  const BatteryIcon = locker.battery < 20 ? BatteryWarning : Battery;
  const batteryColor = locker.battery < 20 ? '#F87171' : locker.battery < 50 ? '#FBBF24' : '#4ADE80';

  return (
    <Shell>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            to="/lockers"
            className="inline-flex items-center gap-1 text-xs mb-2"
            style={{ color: theme.text.muted }}
          >
            <ChevronLeft size={14} />
            All lockers
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black tracking-tight">{locker.id}</h1>
            <StatusPill status={locker.status} />
          </div>
          <p className="text-sm mt-1" style={{ color: theme.text.muted }}>
            {locker.stationName} · Door {locker.doorNo} · {locker.sizeLabel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Telemetry */}
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}
        >
          <h3 className="text-xs uppercase tracking-wide font-semibold mb-3" style={{ color: theme.text.muted }}>
            Telemetry
          </h3>
          <div className="space-y-3">
            <Row label="Battery" icon={<BatteryIcon size={14} style={{ color: batteryColor }} />}>
              <span style={{ color: batteryColor }}>{locker.battery}%</span>
            </Row>
            <Row label="Temperature" icon={<Thermometer size={14} />}>
              {locker.temp !== null ? `${locker.temp}°C` : '—'}
            </Row>
            <Row label="Door" icon={locker.opened === 1 ? <DoorOpen size={14} /> : <Lock size={14} />}>
              {locker.opened === 1 ? 'Open' : 'Closed'}
            </Row>
            <Row label="Enabled">{locker.enabled === 1 ? 'Yes' : 'No'}</Row>
            <Row label="Occupied">{locker.occupied === 1 ? 'Yes' : 'No'}</Row>
          </div>
        </div>

        {/* Package */}
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}
        >
          <h3 className="text-xs uppercase tracking-wide font-semibold mb-3" style={{ color: theme.text.muted }}>
            Current package
          </h3>
          {locker.packageId ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PackageIcon size={14} />
                <span className="font-mono text-sm font-semibold">{locker.packageId}</span>
              </div>
              <p className="text-xs" style={{ color: theme.text.muted }}>
                This locker currently holds an active package. Opening the door will log an audit event.
              </p>
            </div>
          ) : (
            <p className="text-sm" style={{ color: theme.text.muted }}>
              No package in this locker.
            </p>
          )}
        </div>

        {/* Actions */}
        <div
          className="rounded-xl border p-5"
          style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}
        >
          <h3 className="text-xs uppercase tracking-wide font-semibold mb-3" style={{ color: theme.text.muted }}>
            Door control
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <ActionButton icon={<DoorOpen size={14} />} label="Open" disabled={busy} onClick={() => requestDoor('open')} />
            <ActionButton icon={<Lock size={14} />} label="Close" disabled={busy} onClick={() => requestDoor('close')} />
            <ActionButton icon={<Unlock size={14} />} label="Unlock" disabled={busy} onClick={() => requestDoor('unlock')} />
            <ActionButton icon={<Lock size={14} />} label="Lock" disabled={busy} onClick={() => requestDoor('lock')} />
          </div>
          <p className="text-xs mt-3" style={{ color: theme.text.muted }}>
            Door commands are delivered to the station over MQTT. Offline stations return 503.
          </p>
        </div>
      </div>

      {/* Status change */}
      <div
        className="rounded-xl border p-5 mt-4"
        style={{ borderColor: theme.border.primary, backgroundColor: theme.bg.card }}
      >
        <h3 className="text-xs uppercase tracking-wide font-semibold mb-3" style={{ color: theme.text.muted }}>
          Set status
        </h3>
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => {
            const active = s === locker.status;
            return (
              <button
                key={s}
                type="button"
                disabled={busy || active}
                onClick={() => setStatus(s)}
                className="px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5"
                style={{
                  borderColor: active ? theme.accent.primary : theme.border.primary,
                  backgroundColor: active ? theme.accent.light : theme.bg.secondary,
                  color: theme.text.primary,
                  opacity: busy && !active ? 0.5 : 1,
                }}
              >
                {active && <CheckCircle2 size={12} />}
                {s === 'maintenance' && <Wrench size={12} />}
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Activity timeline — door commands + package movements at this door */}
      <div
        className="rounded-xl border p-5 mt-4"
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
              Every door command and package movement at this locker, with the
              actor who made it happen.
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
        <LockerActivityTimeline events={events} loading={eventsPending} />
      </div>

      <DoorActionConfirmDialog
        open={pendingAction !== null}
        action={pendingAction}
        lockerId={locker.id}
        packageId={locker.packageId}
        pending={doorCommand.isPending}
        onConfirm={(reason) => pendingAction && fireDoorCommand(pendingAction, reason)}
        onCancel={() => setPendingAction(null)}
      />
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: theme.bg.primary, color: theme.text.primary, fontFamily: theme.font.primary }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-8">{children}</div>
    </div>
  );
}

function Row({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="flex items-center gap-2" style={{ color: theme.text.muted }}>
        {icon}
        {label}
      </span>
      <span style={{ color: theme.text.primary }}>{children}</span>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  const { theme } = useTheme();
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold"
      style={{
        borderColor: theme.border.primary,
        backgroundColor: theme.bg.secondary,
        color: theme.text.primary,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {icon}
      {label}
    </button>
  );
}
