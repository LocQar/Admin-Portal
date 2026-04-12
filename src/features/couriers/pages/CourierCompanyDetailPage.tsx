import { useState, type ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  Truck,
  Users,
  MapPin,
  Phone,
  Mail,
  Plus,
  Check,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/contexts/ToastContext';
import { errorMessage } from '@/shared/api/errors';
import {
  useCourierCompany,
  useSetCompanyAuthorizedLockers,
} from '../hooks/useCouriers';
import { useStations } from '@/features/lockers/hooks/useLockers';
import { CreateCourierStaffDrawer } from '../components/CreateCourierStaffDrawer';

type Tab = 'staff' | 'lockers';

export default function CourierCompanyDetailPage() {
  const { id = '' } = useParams();
  const numericId = Number(id);
  const { theme } = useTheme();
  const { addToast } = useToast();
  const [tab, setTab] = useState<Tab>('staff');
  const [staffOpen, setStaffOpen] = useState(false);

  const { data: company, isPending, error } = useCourierCompany(numericId);
  const { data: stations } = useStations();
  const setAuthorized = useSetCompanyAuthorizedLockers();

  const allLockerCodes = stations?.map((s) => s.sn) ?? [];
  const authorized = new Set(company?.authorizedLockerCodes ?? []);

  const toggleLocker = async (lockerCode: string) => {
    if (!company) return;
    const next = new Set(authorized);
    if (next.has(lockerCode)) next.delete(lockerCode);
    else next.add(lockerCode);
    try {
      await setAuthorized.mutateAsync({
        id: company.id,
        lockerCodes: [...next],
      });
    } catch (err) {
      addToast({ type: 'error', message: errorMessage(err) });
    }
  };

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
          to="/couriers"
          className="inline-flex items-center gap-1 text-xs mb-4"
          style={{ color: theme.text.muted }}
        >
          <ChevronLeft size={14} /> Back to courier companies
        </Link>

        {isPending ? (
          <div className="py-16 text-center text-sm" style={{ color: theme.text.muted }}>
            Loading courier company…
          </div>
        ) : error || !company ? (
          <div
            className="py-16 text-center rounded-xl border text-sm"
            style={{
              borderColor: '#F8717140',
              backgroundColor: '#F8717110',
              color: '#F87171',
            }}
          >
            Failed to load courier company {id}.
          </div>
        ) : (
          <>
            {/* Crimson hero */}
            <div
              className="rounded-2xl mb-6 overflow-hidden border"
              style={{
                background: 'linear-gradient(135deg, #5A0F0F 0%, #7B1818 50%, #5A0F0F 100%)',
                borderColor: '#7B181880',
                boxShadow: '0 8px 32px -8px #7B181860',
              }}
            >
              <div className="p-6 flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.12)',
                      color: '#FFFFFF',
                    }}
                  >
                    <Truck size={26} />
                  </div>
                  <div>
                    <p className="text-[11px] uppercase font-semibold tracking-wider text-white/70 mb-1">
                      Courier Company
                    </p>
                    <h1 className="text-3xl font-black tracking-tight text-white">
                      {company.name}
                    </h1>
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-mono px-2 py-0.5 rounded border border-white/30 text-white/80">
                        {company.code}
                      </span>
                      <span
                        className="text-xs px-2 py-0.5 rounded-full border"
                        style={{
                          borderColor: company.active ? '#86EFAC60' : 'rgba(255,255,255,0.3)',
                          color: company.active ? '#86EFAC' : 'rgba(255,255,255,0.7)',
                          backgroundColor: company.active ? '#86EFAC10' : 'transparent',
                        }}
                      >
                        {company.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStaffOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border backdrop-blur-sm"
                  style={{
                    borderColor: '#FCD34D80',
                    backgroundColor: 'rgba(0,0,0,0.25)',
                    color: '#FCD34D',
                  }}
                >
                  <Plus size={14} />
                  Add courier
                </button>
              </div>

              {/* Stat strip */}
              <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10">
                <Stat
                  icon={<Users size={14} />}
                  label="Couriers"
                  value={company.staffCount}
                  accent="#FCD34D"
                />
                <Stat
                  icon={<MapPin size={14} />}
                  label="Authorized lockers"
                  value={company.authorizedLockerCount}
                  accent="#86EFAC"
                />
                <Stat
                  icon={<Phone size={14} />}
                  label="Contact"
                  value={company.contactPhone ?? '—'}
                  accent="#FFFFFF"
                  small
                />
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 px-6 border-t border-white/10">
                <TabButton active={tab === 'staff'} onClick={() => setTab('staff')}>
                  Couriers ({company.staff.length})
                </TabButton>
                <TabButton active={tab === 'lockers'} onClick={() => setTab('lockers')}>
                  Authorized lockers ({company.authorizedLockerCount})
                </TabButton>
              </div>
            </div>

            {/* Tab content */}
            <div
              className="rounded-2xl border p-6"
              style={{
                borderColor: theme.border.primary,
                backgroundColor: theme.bg.card,
              }}
            >
              {tab === 'staff' ? (
                company.staff.length === 0 ? (
                  <div className="py-10 text-center text-sm" style={{ color: theme.text.muted }}>
                    <Users size={28} className="mx-auto mb-2 opacity-60" />
                    No couriers yet. Add one to enable kiosk drop-offs.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr
                        className="text-xs uppercase tracking-wide"
                        style={{ color: theme.text.muted }}
                      >
                        <th className="text-left py-2 font-semibold">Name</th>
                        <th className="text-left py-2 font-semibold">Login phone</th>
                        <th className="text-left py-2 font-semibold">Card</th>
                        <th className="text-left py-2 font-semibold">Drop-offs</th>
                        <th className="text-left py-2 font-semibold">Last active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {company.staff.map((s) => (
                        <tr
                          key={s.id}
                          className="border-t"
                          style={{ borderColor: theme.border.primary }}
                        >
                          <td className="py-3 font-semibold">{s.nickname}</td>
                          <td className="py-3 font-mono text-xs">{s.loginPhone}</td>
                          <td className="py-3 font-mono text-xs" style={{ color: theme.text.muted }}>
                            {s.cardNumber ?? '—'}
                          </td>
                          <td className="py-3 tabular-nums">{s.totalDropoffs}</td>
                          <td className="py-3 text-xs" style={{ color: theme.text.muted }}>
                            {s.lastDropoffAt
                              ? new Date(s.lastDropoffAt).toLocaleString()
                              : 'never'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              ) : (
                <div>
                  <p className="text-xs mb-4" style={{ color: theme.text.muted }}>
                    Tick a locker to allow this courier company's agents to drop parcels there.
                    Untick to revoke access. Changes save immediately.
                  </p>
                  {allLockerCodes.length === 0 ? (
                    <div className="py-6 text-center text-sm" style={{ color: theme.text.muted }}>
                      No lockers found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {allLockerCodes.map((code) => {
                        const checked = authorized.has(code);
                        return (
                          <button
                            key={code}
                            type="button"
                            onClick={() => toggleLocker(code)}
                            disabled={setAuthorized.isPending}
                            className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-sm transition-colors text-left"
                            style={{
                              borderColor: checked ? '#86EFAC60' : theme.border.primary,
                              backgroundColor: checked ? '#86EFAC10' : theme.bg.secondary,
                              color: theme.text.primary,
                              cursor: setAuthorized.isPending ? 'wait' : 'pointer',
                            }}
                          >
                            <span className="font-mono">{code}</span>
                            {checked && <Check size={16} style={{ color: '#86EFAC' }} />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Contact card */}
            <div
              className="mt-4 rounded-2xl border p-5 grid grid-cols-1 md:grid-cols-2 gap-4"
              style={{
                borderColor: theme.border.primary,
                backgroundColor: theme.bg.card,
              }}
            >
              <ContactRow
                icon={<Phone size={14} />}
                label="Contact phone"
                value={company.contactPhone ?? '—'}
              />
              <ContactRow
                icon={<Mail size={14} />}
                label="Contact email"
                value={company.contactEmail ?? '—'}
              />
            </div>
          </>
        )}
      </div>

      {company && (
        <CreateCourierStaffDrawer
          open={staffOpen}
          onClose={() => setStaffOpen(false)}
          companyId={company.id}
          companyName={company.name}
        />
      )}
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
  small,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
  accent: string;
  small?: boolean;
}) {
  return (
    <div className="px-5 py-5">
      <p className="text-[11px] uppercase font-semibold tracking-wider text-white/70 flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p
        className={`${small ? 'text-lg' : 'text-3xl'} font-black mt-1 tabular-nums`}
        style={{ color: accent }}
      >
        {value}
      </p>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-3 text-sm font-semibold relative transition-colors"
      style={{ color: active ? '#FFFFFF' : 'rgba(255,255,255,0.55)' }}
    >
      {children}
      {active && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white rounded-t" />
      )}
    </button>
  );
}

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
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
      <p className="text-sm">{value}</p>
    </div>
  );
}
