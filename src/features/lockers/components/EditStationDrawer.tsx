import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Building2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { errorMessage } from '@/shared/api/errors';
import { useToast } from '@/contexts/ToastContext';
import { updateStationSchema, type UpdateStationInput } from '../schemas';
import { useUpdateStation } from '../hooks/useLockers';
import type { Station } from '../types';

interface Props {
  station: Station;
  open: boolean;
  onClose: () => void;
}

/**
 * Edit the operational metadata on a station — name, location, and the help
 * phone number that the kiosk shows to a stranded customer. SN, lat/lng and
 * connectivity are read-only.
 */
export function EditStationDrawer({ station, open, onClose }: Props) {
  const { theme } = useTheme();
  const { addToast } = useToast();
  const updateStation = useUpdateStation(station.sn);

  const form = useForm<UpdateStationInput>({
    resolver: zodResolver(updateStationSchema),
    defaultValues: {
      name: station.name,
      location: station.location,
      helpPhoneNumber: station.helpPhoneNumber ?? '',
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        name: station.name,
        location: station.location,
        helpPhoneNumber: station.helpPhoneNumber ?? '',
      });
    }
  }, [open, station, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await updateStation.mutateAsync({
        name: values.name,
        location: values.location,
        helpPhoneNumber: values.helpPhoneNumber ? values.helpPhoneNumber : null,
      });
      addToast({ type: 'success', message: `${station.name} updated` });
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
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight">Edit station</h2>
              <p className="text-xs mt-1 font-mono" style={{ color: theme.text.muted }}>
                {station.sn}
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
          <Field label="Name" required error={form.formState.errors.name?.message}>
            <input
              {...form.register('name')}
              placeholder="Achimota Mall"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={inputStyle(theme, !!form.formState.errors.name)}
            />
          </Field>

          <Field label="Location" required error={form.formState.errors.location?.message}>
            <input
              {...form.register('location')}
              placeholder="Achimota"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none"
              style={inputStyle(theme, !!form.formState.errors.location)}
            />
          </Field>

          <Field
            label="Help phone number"
            error={form.formState.errors.helpPhoneNumber?.message}
          >
            <input
              {...form.register('helpPhoneNumber')}
              placeholder="+233302000111"
              className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono outline-none"
              style={inputStyle(theme, !!form.formState.errors.helpPhoneNumber)}
            />
            <p className="mt-1 text-[11px]" style={{ color: theme.text.muted }}>
              Shown on the kiosk so a stranded pickup can call for help. Leave blank to clear.
            </p>
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
              disabled={updateStation.isPending}
              className="flex-1 h-11 rounded-xl text-sm font-semibold text-white"
              style={{
                background: updateStation.isPending
                  ? theme.bg.tertiary
                  : `linear-gradient(135deg, ${theme.accent.primary}, ${theme.accent.primary}dd)`,
                cursor: updateStation.isPending ? 'not-allowed' : 'pointer',
              }}
            >
              {updateStation.isPending ? 'Saving…' : 'Save changes'}
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
