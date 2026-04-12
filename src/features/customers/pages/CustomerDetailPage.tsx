import { Link, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Phone, Calendar, Package } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useCustomer } from '../hooks/useCustomers';
import { OrderStatusPill } from '@/features/orders/components/OrderStatusPill';

export default function CustomerDetailPage() {
  const { phone = '' } = useParams();
  const decodedPhone = decodeURIComponent(phone);
  const { theme } = useTheme();

  const { data: customer, isPending, error } = useCustomer(decodedPhone);

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
          to="/customers"
          className="inline-flex items-center gap-1 text-xs mb-4"
          style={{ color: theme.text.muted }}
        >
          <ChevronLeft size={14} /> Back to customers
        </Link>

        {isPending ? (
          <div className="py-16 text-center text-sm" style={{ color: theme.text.muted }}>
            Loading customer…
          </div>
        ) : error || !customer ? (
          <div
            className="py-16 text-center rounded-xl border text-sm"
            style={{
              borderColor: '#F8717140',
              backgroundColor: '#F8717110',
              color: '#F87171',
            }}
          >
            No orders found for {decodedPhone}.
          </div>
        ) : (
          <>
            {/* Crimson hero strip — matches OrdersListPage / OrderDetailPage */}
            <div
              className="rounded-2xl mb-6 overflow-hidden border"
              style={{
                background: 'linear-gradient(135deg, #5A0F0F 0%, #7B1818 50%, #5A0F0F 100%)',
                borderColor: '#7B181880',
                boxShadow: '0 8px 32px -8px #7B181860',
              }}
            >
              <div className="p-6">
                <p className="text-[11px] uppercase font-semibold tracking-wider text-white/70 mb-1">
                  Customer
                </p>
                <h1 className="text-3xl font-black tracking-tight font-mono text-white flex items-center gap-2">
                  <Phone size={22} />
                  {customer.phone}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full border border-white/30 text-white/80">
                    First seen {new Date(customer.firstSeenAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full border border-white/30 text-white/80">
                    Last order {new Date(customer.lastOrderAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10">
                <Stat label="Total Orders" value={customer.totalOrders} accent="#FFFFFF" />
                <Stat label="Active" value={customer.activeOrders} accent="#FCD34D" />
                <Stat label="Completed" value={customer.completedOrders} accent="#86EFAC" />
              </div>
            </div>

            {/* Order history */}
            <div
              className="rounded-2xl border overflow-hidden"
              style={{
                borderColor: theme.border.primary,
                backgroundColor: theme.bg.card,
              }}
            >
              <div
                className="px-6 py-4 flex items-center justify-between border-b"
                style={{ borderColor: theme.border.primary }}
              >
                <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
                  <Package size={18} />
                  Order history
                </h2>
                <span className="text-xs" style={{ color: theme.text.muted }}>
                  {customer.orders.length} order{customer.orders.length === 1 ? '' : 's'}
                </span>
              </div>
              {customer.orders.length === 0 ? (
                <p className="px-6 py-8 text-sm" style={{ color: theme.text.muted }}>
                  No orders on file.
                </p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr
                      className="text-xs uppercase tracking-wide"
                      style={{
                        color: theme.text.muted,
                        backgroundColor: theme.bg.secondary,
                      }}
                    >
                      <th className="text-left px-6 py-3 font-semibold">Code</th>
                      <th className="text-left px-4 py-3 font-semibold">Type</th>
                      <th className="text-left px-4 py-3 font-semibold">Locker</th>
                      <th className="text-left px-4 py-3 font-semibold">Status</th>
                      <th className="text-left px-4 py-3 font-semibold">
                        <Calendar size={11} className="inline mr-1" />
                        Created
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {customer.orders.map((o) => (
                      <tr
                        key={o.id}
                        className="border-t"
                        style={{ borderColor: theme.border.primary }}
                      >
                        <td className="px-6 py-3 font-mono font-semibold">{o.code}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: theme.text.muted }}>
                          {o.type.code}
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
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
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
