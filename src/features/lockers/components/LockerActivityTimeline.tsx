import { Link } from 'react-router-dom';
import {
  DoorOpen,
  Lock,
  Unlock,
  Package as PackageIcon,
  User,
  UserCog,
  Smartphone,
  Cpu,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import type { LockerEvent } from '../types';

interface Props {
  events: LockerEvent[] | undefined;
  loading: boolean;
}

/**
 * Per-locker activity timeline. Renders door commands and package movements
 * in a single chronological list. The actor string follows the audit-override
 * convention (`ADMIN:<id>:<email>`, `AGENT:<id>`, `CUSTOMER:+<phone>`, `SYSTEM`)
 * and we render a friendly badge + icon per kind.
 */
export function LockerActivityTimeline({ events, loading }: Props) {
  const { theme } = useTheme();

  if (loading) {
    return (
      <p className="text-sm" style={{ color: theme.text.muted }}>
        Loading activity…
      </p>
    );
  }

  if (!events || events.length === 0) {
    return (
      <p className="text-sm" style={{ color: theme.text.muted }}>
        No activity recorded for this door yet. Door commands and package
        drop-offs will appear here as they happen.
      </p>
    );
  }

  return (
    <ol className="space-y-3">
      {events.map((evt) => (
        <li
          key={evt.id}
          className="flex items-start gap-3 p-3 rounded-xl border"
          style={{
            borderColor: theme.border.primary,
            backgroundColor: theme.bg.secondary,
          }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: kindAccent(evt) + '20',
              color: kindAccent(evt),
            }}
          >
            <KindIcon evt={evt} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold">{evt.label}</span>
              {evt.packageCode && (
                <Link
                  to={`/orders/${encodeURIComponent(evt.packageCode)}`}
                  className="text-xs font-mono px-2 py-0.5 rounded-md"
                  style={{
                    backgroundColor: theme.bg.tertiary,
                    color: theme.accent.primary,
                  }}
                >
                  {evt.packageCode}
                </Link>
              )}
            </div>
            <div
              className="flex items-center gap-1.5 mt-1 text-xs"
              style={{ color: theme.text.muted }}
            >
              <ActorIcon actor={evt.actor} />
              <ActorLabel actor={evt.actor} />
              <span>·</span>
              <span>{formatTimestamp(evt.createdAt)}</span>
            </div>
            {evt.reason && (
              <p
                className="mt-2 text-xs italic"
                style={{ color: theme.text.muted }}
              >
                “{evt.reason}”
              </p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function kindAccent(evt: LockerEvent): string {
  if (evt.kind === 'PACKAGE') {
    if (evt.action.includes('DROPOFF')) return '#FBBF24';
    if (evt.action.includes('COLLECT')) return '#4ADE80';
    return '#7EA8C9';
  }
  if (evt.action === 'open' || evt.action === 'unlock') return '#F87171';
  return '#9CA3AF';
}

function KindIcon({ evt }: { evt: LockerEvent }) {
  if (evt.kind === 'PACKAGE') return <PackageIcon size={16} />;
  if (evt.action === 'open') return <DoorOpen size={16} />;
  if (evt.action === 'unlock') return <Unlock size={16} />;
  return <Lock size={16} />;
}

function ActorIcon({ actor }: { actor: string }) {
  const kind = actor.split(':')[0];
  if (kind === 'ADMIN') return <UserCog size={12} />;
  if (kind === 'AGENT') return <User size={12} />;
  if (kind === 'CUSTOMER') return <Smartphone size={12} />;
  return <Cpu size={12} />;
}

/**
 * Renders the actor identity as text + (when applicable) a clickable link to
 * the related entity. CUSTOMER actors link to the customer detail page by
 * phone. ADMIN/AGENT/SYSTEM remain plain text until staff routes exist.
 */
function ActorLabel({ actor }: { actor: string }) {
  const { theme } = useTheme();
  const parts = actor.split(':');
  const kind = parts[0];

  if (kind === 'CUSTOMER' && parts[1]) {
    const phone = parts[1];
    return (
      <Link
        to={`/customers/${encodeURIComponent(phone)}`}
        className="hover:underline"
        style={{ color: theme.accent.primary }}
      >
        Customer {phone}
      </Link>
    );
  }
  if (kind === 'ADMIN') {
    // ADMIN:<id>:<email>
    return <span>Admin · {parts[2] ?? parts[1] ?? ''}</span>;
  }
  if (kind === 'AGENT') return <span>Agent #{parts[1] ?? ''}</span>;
  if (kind === 'SYSTEM') return <span>System</span>;
  return <span>{actor}</span>;
}

function formatTimestamp(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  if (diff < 0) return 'in the future';
  const sec = Math.round(diff / 1000);
  if (sec < 60) return 'just now';
  const min = Math.round(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return new Date(iso).toLocaleString();
}
