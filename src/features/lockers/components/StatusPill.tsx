import { useTheme } from '@/contexts/ThemeContext';
import type { LockerStatus } from '../types';

const STATUS_META: Record<LockerStatus, { label: string; color: string; bg: string }> = {
  available: { label: 'Available', color: '#4ADE80', bg: '#4ADE8018' },
  occupied: { label: 'Occupied', color: '#60A5FA', bg: '#60A5FA18' },
  reserved: { label: 'Reserved', color: '#FBBF24', bg: '#FBBF2418' },
  maintenance: { label: 'Maintenance', color: '#F87171', bg: '#F8717118' },
  offline: { label: 'Offline', color: '#9CA3AF', bg: '#9CA3AF18' },
};

export function StatusPill({ status }: { status: LockerStatus }) {
  const meta = STATUS_META[status];
  useTheme(); // subscribe so the chip repaints when theme changes
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ color: meta.color, backgroundColor: meta.bg, border: `1px solid ${meta.color}40` }}
    >
      {meta.label}
    </span>
  );
}

export const LOCKER_STATUS_META = STATUS_META;
