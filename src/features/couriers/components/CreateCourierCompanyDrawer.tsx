import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Truck } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { errorMessage } from '@/shared/api/errors';
import { useToast } from '@/contexts/ToastContext';
import {
  createCourierCompanySchema,
  type CreateCourierCompanyInput,
} from '../schemas';
import { useCreateCourierCompany } from '../hooks/useCouriers';

interface Props {
  open: boolean;
  onClose: () => void;
  onCreated?: (id: number) => void;
}

export function CreateCourierCompanyDrawer({ open, onClose, onCreated }: Props) {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const createCompany = useCreateCourierCompany();

  const form = useForm<CreateCourierCompanyInput>({
    resolver: zodResolver(createCourierCompanySchema),
    defaultValues: {
      code: '',
      name: '',
      contactPhone: '',
      contactEmail: '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ code: '', name: '', contactPhone: '', contactEmail: '' });
    }
  }, [open, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const created = await createCompany.mutateAsync({
        code: values.code,
        name: values.name,
        contactPhone: values.contactPhone || undefined,
        contactEmail: values.contactEmail || undefined,
      });
      addToast({ type: 'success', message: `${created.name} added` });
      onCreated?.(created.id);
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
              <Truck size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">New courier company</h2>
              <p className="text-xs mt-1" style={{ color: theme.text.muted }}>
                Add a logistics partner whose agents can drop parcels into LocQar lockers.
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
          <Field label="Code" required error={form.formState.errors.code?.message}>
            <input
              {...form.register('code')}
              placeholder="JUMIA"
              className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono uppercase outline-none"
              style={inputStyle(theme, !!form.formState.errors.code)}
            />
          </Field>

          <Field label="Name" required error={form.formState.errors.name?.message}>
            <input
              {...form.register('name')}
              placeholder="Jumia Express"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={inputStyle(theme, !!form.formState.errors.name)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Contact phone" error={form.formState.errors.contactPhone?.message}>
              <input
                {...form.register('contactPhone')}
                placeholder="+233244500001"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={inputStyle(theme, !!form.formState.errors.contactPhone)}
              />
            </Field>
            <Field label="Contact email" error={form.formState.errors.contactEmail?.message}>
              <input
                {...form.register('contactEmail')}
                placeholder="ops@jumia.com.gh"
                className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
                style={inputStyle(theme, !!form.formState.errors.contactEmail)}
              />
            </Field>
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
              disabled={createCompany.isPending}
              className="flex-1 h-11 rounded-xl text-sm font-semibold text-white"
              style={{
                background: createCompany.isPending
                  ? theme.bg.tertiary
                  : `linear-gradient(135deg, ${theme.accent.primary}, ${theme.accent.primary}dd)`,
                cursor: createCompany.isPending ? 'not-allowed' : 'pointer',
              }}
            >
              {createCompany.isPending ? 'Creating…' : 'Create company'}
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
