import { useTheme } from '@/contexts/ThemeContext';
import { STATUS_LABELS, type OrderStatusCode } from '../types';

const STATUS_COLORS: Record<OrderStatusCode, { color: string; bg: string }> = {
  CREATED: { color: '#9CA3AF', bg: '#9CA3AF18' },
  PENDING_SRC_LOCKER_SELECTION: { color: '#9CA3AF', bg: '#9CA3AF18' },
  AWAIT_PACKAGE: { color: '#FBBF24', bg: '#FBBF2418' },
  AWAIT_TRANSIT: { color: '#FBBF24', bg: '#FBBF2418' },
  EN_ROUTE_TO_LOCKER: { color: '#60A5FA', bg: '#60A5FA18' },
  READY_FOR_PICKUP: { color: '#818CF8', bg: '#818CF818' },
  EXPIRED_PICKUP: { color: '#F87171', bg: '#F8717118' },
  COMPLETED_PICKUP: { color: '#4ADE80', bg: '#4ADE8018' },
  RECALL_REQUESTED: { color: '#FB923C', bg: '#FB923C18' },
  RECALLED: { color: '#FB923C', bg: '#FB923C18' },
  AWAIT_RETURNED_PACKAGE: { color: '#FB923C', bg: '#FB923C18' },
  RETURNED_PACKAGE_READY: { color: '#FB923C', bg: '#FB923C18' },
  RETURNED_TO_SENDER: { color: '#9CA3AF', bg: '#9CA3AF18' },
  CANCELED: { color: '#9CA3AF', bg: '#9CA3AF18' },
};

export function OrderStatusPill({ status }: { status: OrderStatusCode }) {
  useTheme();
  const meta = STATUS_COLORS[status] ?? STATUS_COLORS.CREATED;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{
        color: meta.color,
        backgroundColor: meta.bg,
        border: `1px solid ${meta.color}40`,
      }}
    >
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
