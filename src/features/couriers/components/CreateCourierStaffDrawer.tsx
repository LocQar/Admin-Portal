import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UserPlus } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { errorMessage } from '@/shared/api/errors';
import { useToast } from '@/contexts/ToastContext';
import {
  createCourierStaffSchema,
  type CreateCourierStaffInput,
} from '../schemas';
import { useCreateCourierStaff } from '../hooks/useCouriers';

interface Props {
  open: boolean;
  onClose: () => void;
  companyId: number;
  companyName: string;
}

export function CreateCourierStaffDrawer({ open, onClose, companyId, companyName }: Props) {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const createStaff = useCreateCourierStaff();

  const form = useForm<CreateCourierStaffInput>({
    resolver: zodResolver(createCourierStaffSchema),
    defaultValues: {
      companyId,
      nickname: '',
      loginPhone: '',
      cardNumber: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ companyId, nickname: '', loginPhone: '', cardNumber: '' });
    }
  }, [open, companyId, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const created = await createStaff.mutateAsync({
        companyId: values.companyId,
        nickname: values.nickname,
        loginPhone: values.loginPhone,
        cardNumber: values.cardNumber || undefined,
      });
      addToast({ type: 'success', message: `Courier ${created.nickname} added` });
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
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Add courier</h2>
              <p className="text-xs mt-1" style={{ color: theme.text.muted }}>
                Adding a courier under <span className="font-semibold">{companyName}</span>.
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
          <Field label="Name" required error={form.formState.errors.nickname?.message}>
            <input
              {...form.register('nickname')}
              placeholder="Joe Mensah"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={inputStyle(theme, !!form.formState.errors.nickname)}
            />
          </Field>

          <Field
            label="Login phone"
            required
            error={form.formState.errors.loginPhone?.message}
          >
            <input
              {...form.register('loginPhone')}
              placeholder="+233244111001"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={inputStyle(theme, !!form.formState.errors.loginPhone)}
            />
            <p className="text-[11px] mt-1" style={{ color: theme.text.muted }}>
              Used by the courier to log in at the locker kiosk.
            </p>
          </Field>

          <Field
            label="Card number"
            error={form.formState.errors.cardNumber?.message}
          >
            <input
              {...form.register('cardNumber')}
              placeholder="optional — only if locker has a card reader"
              className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono outline-none"
              style={inputStyle(theme, !!form.formState.errors.cardNumber)}
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
              disabled={createStaff.isPending}
              className="flex-1 h-11 rounded-xl text-sm font-semibold text-white"
              style={{
                background: createStaff.isPending
                  ? theme.bg.tertiary
                  : `linear-gradient(135deg, ${theme.accent.primary}, ${theme.accent.primary}dd)`,
                cursor: createStaff.isPending ? 'not-allowed' : 'pointer',
              }}
            >
              {createStaff.isPending ? 'Adding…' : 'Add courier'}
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
