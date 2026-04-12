import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { errorMessage } from '@/shared/api/errors';
import {
  orderEventSchema,
  type OrderEventInput,
} from '../schemas';
import { useRecordOrderEvent } from '../hooks/useOrders';
import {
  DROPOFF_EVENTS,
  PICKUP_EVENTS,
  EVENT_LABELS,
  type OrderEventCode,
  type OrderStatusCode,
} from '../types';

type Mode = 'dropoff' | 'pickup' | 'cancel';

const MODE_META: Record<Mode, {
  title: string;
  subtitle: string;
  events: ReadonlyArray<OrderEventCode>;
  defaultEvent: OrderEventCode;
  accent: string;
}> = {
  dropoff: {
    title: 'Record Drop-off',
    subtitle: 'Manually log a package drop-off at the locker. This is an audit override.',
    events: DROPOFF_EVENTS,
    defaultEvent: 'LOCKER_AGENT_DROPOFF',
    accent: '#FBBF24',
  },
  pickup: {
    title: 'Record Pickup',
    subtitle: 'Manually log a package pickup from the locker. This is an audit override.',
    events: PICKUP_EVENTS,
    defaultEvent: 'LOCKER_AGENT_COLLECT',
    accent: '#4ADE80',
  },
  cancel: {
    title: 'Cancel Order',
    subtitle: 'Mark this order as canceled. The reason is permanently logged.',
    events: ['CANCELED'] as const,
    defaultEvent: 'CANCELED',
    accent: '#F87171',
  },
};

interface Props {
  orderCode: string;
  currentStatus: OrderStatusCode;
  mode: Mode;
  open: boolean;
  onClose: () => void;
}

export function RecordEventDrawer({ orderCode, currentStatus, mode, open, onClose }: Props) {
  const { theme } = useTheme();
  const meta = MODE_META[mode];
  const recordEvent = useRecordOrderEvent(orderCode);

  const form = useForm<OrderEventInput>({
    resolver: zodResolver(orderEventSchema),
    defaultValues: {
      event: meta.defaultEvent,
      reason: '',
      lockerCode: '',
      lockerDoorNo: '',
      lockerSize: '',
      lockerPinCode: '',
    },
  });

  // Reset when drawer reopens or mode changes
  useEffect(() => {
    if (open) {
      form.reset({
        event: meta.defaultEvent,
        reason: '',
        lockerCode: '',
        lockerDoorNo: '',
        lockerSize: '',
        lockerPinCode: '',
      });
    }
  }, [open, mode, meta.defaultEvent, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    // Strip empty optional fields so the backend doesn't see "" as valid
    const payload: OrderEventInput = {
      event: values.event,
      reason: values.reason,
      lockerCode: values.lockerCode || undefined,
      lockerDoorNo: values.lockerDoorNo || undefined,
      lockerSize: values.lockerSize || undefined,
      lockerPinCode: values.lockerPinCode || undefined,
    };
    try {
      await recordEvent.mutateAsync(payload);
      onClose();
    } catch (err) {
      form.setError('root', { message: errorMessage(err) });
    }
  });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <div
        className="relative w-full max-w-md h-full overflow-y-auto shadow-2xl"
        style={{
          backgroundColor: theme.bg.primary,
          color: theme.text.primary,
          fontFamily: theme.font.primary,
        }}
      >
        <div
          className="flex items-start justify-between p-6 border-b"
          style={{ borderColor: theme.border.primary }}
        >
          <div>
            <h2 className="text-xl font-black tracking-tight">{meta.title}</h2>
            <p className="text-xs mt-1" style={{ color: theme.text.muted }}>
              Order <span className="font-mono font-semibold">{orderCode}</span>
              {' · '}current status: {currentStatus}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg"
            style={{ color: theme.icon.muted }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          className="mx-6 mt-6 p-3 rounded-xl flex items-start gap-2 text-xs"
          style={{
            backgroundColor: `${meta.accent}15`,
            border: `1px solid ${meta.accent}40`,
            color: meta.accent,
          }}
        >
          <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
          <span>
            {meta.subtitle} The reason you provide will be permanently logged in the
            order audit trail and visible to other staff.
          </span>
        </div>

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          {meta.events.length > 1 && (
            <div>
              <label
                className="text-xs font-semibold uppercase block mb-1.5"
                style={{ color: theme.text.muted }}
              >
                Event
              </label>
              <select
                {...form.register('event')}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={{
                  backgroundColor: theme.bg.secondary,
                  borderColor: theme.border.primary,
                  color: theme.text.primary,
                }}
              >
                {meta.events.map((e) => (
                  <option key={e} value={e}>
                    {EVENT_LABELS[e]}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label
              className="text-xs font-semibold uppercase block mb-1.5"
              style={{ color: theme.text.muted }}
            >
              Reason <span style={{ color: '#F87171' }}>*</span>
            </label>
            <textarea
              {...form.register('reason')}
              rows={3}
              placeholder="e.g. Sensor missed dropoff at 14:32, courier confirmed package is in locker A-15"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
              style={{
                backgroundColor: theme.bg.secondary,
                borderColor: form.formState.errors.reason
                  ? '#F87171'
                  : theme.border.primary,
                color: theme.text.primary,
              }}
            />
            {form.formState.errors.reason && (
              <p className="mt-1 text-xs" style={{ color: '#F87171' }}>
                {form.formState.errors.reason.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <OptionalField label="Locker code" name="lockerCode" form={form} />
            <OptionalField label="Door no." name="lockerDoorNo" form={form} />
            <OptionalField label="Size" name="lockerSize" form={form} />
            <OptionalField label="PIN code" name="lockerPinCode" form={form} />
          </div>

          {form.formState.errors.root && (
            <div
              className="p-3 rounded-xl text-sm"
              style={{
                backgroundColor: '#F8717115',
                border: '1px solid #F8717140',
                color: '#F87171',
              }}
            >
              {form.formState.errors.root.message}
            </div>
          )}

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl border text-sm font-semibold"
              style={{
                borderColor: theme.border.primary,
                color: theme.text.primary,
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={recordEvent.isPending}
              className="flex-1 h-11 rounded-xl text-sm font-semibold text-white"
              style={{
                background: recordEvent.isPending
                  ? theme.bg.tertiary
                  : `linear-gradient(135deg, ${meta.accent}, ${meta.accent}dd)`,
                cursor: recordEvent.isPending ? 'not-allowed' : 'pointer',
              }}
            >
              {recordEvent.isPending ? 'Recording…' : 'Record event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function OptionalField({
  label,
  name,
  form,
}: {
  label: string;
  name: 'lockerCode' | 'lockerDoorNo' | 'lockerSize' | 'lockerPinCode';
  form: ReturnType<typeof useForm<OrderEventInput>>;
}) {
  const { theme } = useTheme();
  return (
    <div>
      <label
        className="text-xs font-semibold uppercase block mb-1.5"
        style={{ color: theme.text.muted }}
      >
        {label}
      </label>
      <input
        type="text"
        {...form.register(name)}
        className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
        style={{
          backgroundColor: theme.bg.secondary,
          borderColor: theme.border.primary,
          color: theme.text.primary,
        }}
      />
    </div>
  );
}
