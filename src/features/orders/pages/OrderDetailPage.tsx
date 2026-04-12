import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  PackageCheck,
  PackageOpen,
  Ban,
  Phone,
  MapPin,
  Clock,
  User,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useOrder } from '../hooks/useOrders';
import { OrderStatusPill } from '../components/OrderStatusPill';
import { RecordEventDrawer } from '../components/RecordEventDrawer';
import { STATUS_LABELS, type OrderStatusCode } from '../types';

type DrawerMode = 'dropoff' | 'pickup' | 'cancel';
type Tab = 'details' | 'timeline';

const TERMINAL_STATUSES: ReadonlyArray<OrderStatusCode> = [
  'COMPLETED_PICKUP',
  'CANCELED',
  'RETURNED_TO_SENDER',
];

export default function OrderDetailPage() {
  const { code = '' } = useParams();
  const { theme } = useTheme();
  const [drawerMode, setDrawerMode] = useState<DrawerMode | null>(null);
  const [tab, setTab] = useState<Tab>('details');

  const { data: order, isPending, error } = useOrder(code);

  const status = order?.status.code;
  const canDropoff = status === 'AWAIT_PACKAGE';
  const canPickup = status === 'READY_FOR_PICKUP';
  const canCancel = status && !TERMINAL_STATUSES.includes(status);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.bg.primary,
        color: theme.text.primary,
        fontFamily: theme.font.primary,
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <Link
          to="/orders"
          className="inline-flex items-center gap-1 text-xs mb-4"
          style={{ color: theme.text.muted }}
        >
          <ChevronLeft size={14} /> Back to orders
        </Link>

        {isPending ? (
          <div className="py-16 text-center text-sm" style={{ color: theme.text.muted }}>
            Loading order…
          </div>
        ) : error || !order ? (
          <div
            className="py-16 text-center rounded-xl border text-sm"
            style={{
              borderColor: '#F8717140',
              backgroundColor: '#F8717110',
              color: '#F87171',
            }}
          >
            Failed to load order {code}.
          </div>
        ) : (
          <>
            {/* Crimson hero strip — Figma-inspired */}
            <div
              className="rounded-2xl mb-6 overflow-hidden border"
              style={{
                background: 'linear-gradient(135deg, #5A0F0F 0%, #7B1818 50%, #5A0F0F 100%)',
                borderColor: '#7B181880',
                boxShadow: '0 8px 32px -8px #7B181860',
              }}
            >
              <div className="p-6 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase font-semibold tracking-wider text-white/70 mb-1">
                    Order
                  </p>
                  <h1 className="text-3xl font-black tracking-tight font-mono text-white">
                    {order.code}
                  </h1>
                  <div className="mt-3 flex items-center gap-3">
                    <OrderStatusPill status={order.status.code} />
                    <span className="text-xs px-2 py-0.5 rounded-full border border-white/30 text-white/80">
                      {order.type.code}
                    </span>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <ActionButton
                    icon={<PackageOpen size={14} />}
                    label="Record drop-off"
                    color="#FCD34D"
                    disabled={!canDropoff}
                    onClick={() => setDrawerMode('dropoff')}
                  />
                  <ActionButton
                    icon={<PackageCheck size={14} />}
                    label="Record pickup"
                    color="#86EFAC"
                    disabled={!canPickup}
                    onClick={() => setDrawerMode('pickup')}
                  />
                  <ActionButton
                    icon={<Ban size={14} />}
                    label="Cancel order"
                    color="#FCA5A5"
                    disabled={!canCancel}
                    onClick={() => setDrawerMode('cancel')}
                  />
                </div>
              </div>

              {/* Tab strip */}
              <div className="flex items-center gap-1 px-6 border-t border-white/10">
                <TabButton active={tab === 'details'} onClick={() => setTab('details')}>
                  Details
                </TabButton>
                <TabButton active={tab === 'timeline'} onClick={() => setTab('timeline')}>
                  Timeline ({order.orderProgresses.length})
                </TabButton>
              </div>
            </div>

            {/* Tab content */}
            {tab === 'details' ? (
              <div
                className="rounded-2xl border p-6"
                style={{
                  borderColor: theme.border.primary,
                  backgroundColor: theme.bg.card,
                }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  <Field
                    icon={<Phone size={13} />}
                    label="Recipient"
                    value={
                      <Link
                        to={`/customers/${encodeURIComponent(order.recipientPhoneNumber)}`}
                        className="hover:underline"
                        style={{ color: theme.accent.primary }}
                      >
                        {order.recipientPhoneNumber}
                      </Link>
                    }
                  />
                  <Field
                    icon={<Phone size={13} />}
                    label="Sender"
                    value={
                      order.senderPhoneNumber ? (
                        <Link
                          to={`/customers/${encodeURIComponent(order.senderPhoneNumber)}`}
                          className="hover:underline"
                          style={{ color: theme.accent.primary }}
                        >
                          {order.senderPhoneNumber}
                        </Link>
                      ) : (
                        '—'
                      )
                    }
                  />
                  <Field
                    icon={<MapPin size={13} />}
                    label="Destination locker"
                    value={order.desLockerCode}
                    mono
                  />
                  <Field
                    icon={<MapPin size={13} />}
                    label="Source locker"
                    value={order.srcLockerCode ?? '—'}
                    mono
                  />
                  <Field
                    icon={<Clock size={13} />}
                    label="Created"
                    value={new Date(order.createdAt).toLocaleString()}
                  />
                  <Field
                    icon={<Clock size={13} />}
                    label="Updated"
                    value={new Date(order.updatedAt).toLocaleString()}
                  />
                  <Field
                    icon={<User size={13} />}
                    label="Created by"
                    value={order.createdBy}
                  />
                  <Field
                    icon={<User size={13} />}
                    label="Updated by"
                    value={order.updatedBy}
                  />
                </div>
              </div>
            ) : (
              <div
                className="rounded-2xl border p-6"
                style={{
                  borderColor: theme.border.primary,
                  backgroundColor: theme.bg.card,
                }}
              >
                {order.orderProgresses.length === 0 ? (
                  <p className="text-sm" style={{ color: theme.text.muted }}>
                    No events recorded yet.
                  </p>
                ) : (
                  <ol className="relative">
                    {[...order.orderProgresses]
                      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
                      .map((p, idx, arr) => (
                        <li
                          key={p.id}
                          className="flex gap-4 pb-5 last:pb-0 relative"
                        >
                          {/* Vertical connector line */}
                          {idx < arr.length - 1 && (
                            <div
                              className="absolute left-[5px] top-3 bottom-0 w-px"
                              style={{ backgroundColor: theme.border.primary }}
                            />
                          )}
                          <div
                            className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ring-4 relative z-10"
                            style={{
                              backgroundColor: '#7B1818',
                              boxShadow: '0 0 0 2px #7B1818, 0 0 0 4px ' + theme.bg.card,
                            }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-sm font-semibold">
                                {STATUS_LABELS[p.status.code] ?? p.status.code}
                              </span>
                              {p.lockerCode && (
                                <span
                                  className="text-xs font-mono px-1.5 py-0.5 rounded"
                                  style={{
                                    backgroundColor: theme.bg.secondary,
                                    color: theme.text.muted,
                                  }}
                                >
                                  {p.lockerCode}
                                  {p.lockerDoorNo ? `·${p.lockerDoorNo}` : ''}
                                  {p.lockerSize ? `·${p.lockerSize}` : ''}
                                </span>
                              )}
                            </div>
                            {p.description && (
                              <p
                                className="text-xs mt-1 break-words"
                                style={{ color: theme.text.secondary }}
                              >
                                {p.description}
                              </p>
                            )}
                            <p
                              className="text-xs mt-1"
                              style={{ color: theme.text.muted }}
                            >
                              {new Date(p.createdAt).toLocaleString()}
                              {p.createdBy ? ` · ${p.createdBy}` : ''}
                            </p>
                          </div>
                        </li>
                      ))}
                  </ol>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {order && drawerMode && (
        <RecordEventDrawer
          orderCode={order.code}
          currentStatus={order.status.code}
          mode={drawerMode}
          open={!!drawerMode}
          onClose={() => setDrawerMode(null)}
        />
      )}
    </div>
  );
}

function ActionButton({
  icon,
  label,
  color,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  color: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-opacity backdrop-blur-sm"
      style={{
        borderColor: `${color}80`,
        backgroundColor: 'rgba(0,0,0,0.25)',
        color,
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-3 text-sm font-semibold relative transition-colors"
      style={{
        color: active ? '#FFFFFF' : 'rgba(255,255,255,0.55)',
      }}
    >
      {children}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t" />
      )}
    </button>
  );
}

function Field({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: ReactNode;
  mono?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <div>
      <p
        className="text-xs uppercase font-semibold tracking-wide flex items-center gap-1.5 mb-1"
        style={{ color: theme.text.muted }}
      >
        {icon}
        {label}
      </p>
      <div className={`text-sm ${mono ? 'font-mono' : ''}`}>{value}</div>
    </div>
  );
}
