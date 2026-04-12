import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, PackagePlus } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { errorMessage } from '@/shared/api/errors';
import { useToast } from '@/contexts/ToastContext';
import { createOrderSchema, type CreateOrderInput } from '../schemas';
import { useCreateOrder } from '../hooks/useOrders';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (code: string) => void;
}

const ORDER_TYPES: ReadonlyArray<{ value: CreateOrderInput['type']; label: string }> = [
  { value: 'CUS_1LOC', label: 'Customer · single locker' },
  { value: 'CUS_2LOC', label: 'Customer · two lockers (transit)' },
  { value: 'PARTNER_LOC', label: 'Partner · single locker' },
  { value: 'PARTNER_2LOC', label: 'Partner · two lockers (transit)' },
];

const STORAGE_SIZES: ReadonlyArray<{ value: 'SMALL' | 'MEDIUM' | 'LARGE' | 'XL'; label: string }> = [
  { value: 'SMALL', label: 'Small' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LARGE', label: 'Large' },
  { value: 'XL', label: 'Extra large' },
];

const STORAGE_HOURS: ReadonlyArray<{ value: 2 | 6 | 24 | 72; label: string }> = [
  { value: 2, label: '2 hours' },
  { value: 6, label: '6 hours' },
  { value: 24, label: '1 day' },
  { value: 72, label: '3 days' },
];

function generateOrderCode(): string {
  // LQ-YYYY-####### using last 6 ms digits for uniqueness during a session.
  const year = new Date().getFullYear();
  const tail = String(Date.now()).slice(-7);
  return `LQ-${year}-${tail}`;
}

export function CreateOrderDrawer({ open, onClose, onCreated }: Props) {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const createOrder = useCreateOrder();

  const form = useForm<CreateOrderInput>({
    resolver: zodResolver(createOrderSchema),
    defaultValues: {
      code: generateOrderCode(),
      type: 'CUS_1LOC',
      desLockerCode: '',
      srcLockerCode: '',
      recipientPhoneNumber: '',
      senderPhoneNumber: '',
      description: '',
      storageSize: 'MEDIUM',
      storageDurationHours: 24,
    },
  });

  const watchedType = form.watch('type');
  const needsSrc = watchedType === 'CUS_2LOC' || watchedType === 'PARTNER_2LOC';

  // Reset to a fresh code each time the drawer opens.
  useEffect(() => {
    if (open) {
      form.reset({
        code: generateOrderCode(),
        type: 'CUS_1LOC',
        desLockerCode: '',
        srcLockerCode: '',
        recipientPhoneNumber: '',
        senderPhoneNumber: '',
        description: '',
        storageSize: 'MEDIUM',
        storageDurationHours: 24,
      });
    }
  }, [open, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const payload: CreateOrderInput = {
      ...values,
      srcLockerCode: values.srcLockerCode || undefined,
      senderPhoneNumber: values.senderPhoneNumber || undefined,
      description: values.description || undefined,
    };
    try {
      const created = await createOrder.mutateAsync(payload);
      addToast({ type: 'success', message: `Order ${created.code} created` });
      onCreated?.(created.code);
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
        className="relative w-full max-w-lg h-full overflow-y-auto shadow-2xl"
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
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                backgroundColor: `${theme.accent.primary}20`,
                color: theme.accent.primary,
              }}
            >
              <PackagePlus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">New walk-in order</h2>
              <p className="text-xs mt-1" style={{ color: theme.text.muted }}>
                Create an order at the warehouse counter for a customer who walked in.
              </p>
            </div>
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

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <Field label="Order code" error={form.formState.errors.code?.message}>
            <input
              {...form.register('code')}
              className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono outline-none"
              style={inputStyle(theme, !!form.formState.errors.code)}
            />
          </Field>

          <Field label="Type" required>
            <select
              {...form.register('type')}
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={inputStyle(theme, false)}
            >
              {ORDER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Destination locker"
              required
              error={form.formState.errors.desLockerCode?.message}
            >
              <input
                {...form.register('desLockerCode')}
                placeholder="WNS-ACH-001"
                className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono outline-none"
                style={inputStyle(theme, !!form.formState.errors.desLockerCode)}
              />
            </Field>
            <Field
              label="Source locker"
              required={needsSrc}
              error={form.formState.errors.srcLockerCode?.message}
            >
              <input
                {...form.register('srcLockerCode')}
                placeholder={needsSrc ? 'WNS-ACC-002' : 'optional'}
                className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono outline-none"
                style={inputStyle(theme, !!form.formState.errors.srcLockerCode)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label="Recipient phone"
              required
              error={form.formState.errors.recipientPhoneNumber?.message}
            >
              <input
                {...form.register('recipientPhoneNumber')}
                placeholder="+233244000111"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={inputStyle(theme, !!form.formState.errors.recipientPhoneNumber)}
              />
            </Field>
            <Field
              label="Sender phone"
              error={form.formState.errors.senderPhoneNumber?.message}
            >
              <input
                {...form.register('senderPhoneNumber')}
                placeholder="optional"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={inputStyle(theme, !!form.formState.errors.senderPhoneNumber)}
              />
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Storage size">
              <select
                {...form.register('storageSize')}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={inputStyle(theme, false)}
              >
                {STORAGE_SIZES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Storage duration">
              <select
                {...form.register('storageDurationHours', { valueAsNumber: true })}
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={inputStyle(theme, false)}
              >
                {STORAGE_HOURS.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Description" error={form.formState.errors.description?.message}>
            <textarea
              {...form.register('description')}
              rows={2}
              placeholder="e.g. iPhone box, fragile"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
              style={inputStyle(theme, !!form.formState.errors.description)}
            />
          </Field>

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
              disabled={createOrder.isPending}
              className="flex-1 h-11 rounded-xl text-sm font-semibold text-white"
              style={{
                background: createOrder.isPending
                  ? theme.bg.tertiary
                  : `linear-gradient(135deg, ${theme.accent.primary}, ${theme.accent.primary}dd)`,
                cursor: createOrder.isPending ? 'not-allowed' : 'pointer',
              }}
            >
              {createOrder.isPending ? 'Creating…' : 'Create order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  return (
    <div>
      <label
        className="text-xs font-semibold uppercase block mb-1.5"
        style={{ color: theme.text.muted }}
      >
        {label}
        {required && <span style={{ color: '#F87171' }}> *</span>}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-xs" style={{ color: '#F87171' }}>
          {error}
        </p>
      )}
    </div>
  );
}

function inputStyle(
  theme: ReturnType<typeof useTheme>['theme'],
  hasError: boolean,
): React.CSSProperties {
  return {
    backgroundColor: theme.bg.secondary,
    borderColor: hasError ? '#F87171' : theme.border.primary,
    color: theme.text.primary,
  };
}
