import { useEffect, useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

type Action = 'open' | 'close' | 'lock' | 'unlock';

interface Props {
  open: boolean;
  action: Action | null;
  lockerId: string;
  packageId?: string;
  pending: boolean;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

/**
 * Confirm dialog used when an admin issues a sensitive door command on a
 * door that currently holds a package — `open` or `unlock`. The reason is
 * mandatory and ends up in the audit row, visible in the activity timeline.
 *
 * `close` and `lock` don't go through this dialog because they can't expose
 * a customer's package; they fire directly.
 */
export function DoorActionConfirmDialog({
  open,
  action,
  lockerId,
  packageId,
  pending,
  onConfirm,
  onCancel,
}: Props) {
  const { theme } = useTheme();
  const [reason, setReason] = useState('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setReason('');
      setTouched(false);
    }
  }, [open, action]);

  if (!open || !action) return null;

  const trimmed = reason.trim();
  const error = touched && trimmed.length < 8
    ? 'Reason must be at least 8 characters — describe why you are overriding.'
    : null;

  const verb = action === 'open' ? 'open' : 'unlock';
  const accent = '#F87171';

  const submit = () => {
    setTouched(true);
    if (trimmed.length < 8) return;
    onConfirm(trimmed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" role="dialog" aria-modal="true">
      <button
        type="button"
        aria-label="Close"
        onClick={onCancel}
        className="absolute inset-0 bg-black/60"
      />
      <div
        className="relative w-full max-w-md mx-4 rounded-2xl shadow-2xl"
        style={{
          backgroundColor: theme.bg.primary,
          color: theme.text.primary,
          fontFamily: theme.font.primary,
        }}
      >
        <div
          className="flex items-start justify-between p-5 border-b"
          style={{ borderColor: theme.border.primary }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${accent}20`, color: accent }}
            >
              <AlertTriangle size={18} />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight">
                Confirm: {verb} occupied door
              </h2>
              <p className="text-xs mt-0.5" style={{ color: theme.text.muted }}>
                Locker <span className="font-mono font-semibold">{lockerId}</span>
                {packageId && (
                  <>
                    {' · holds '}
                    <span className="font-mono font-semibold">{packageId}</span>
                  </>
                )}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg"
            style={{ color: theme.icon.muted }}
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div
            className="p-3 rounded-xl text-xs flex items-start gap-2"
            style={{
              backgroundColor: `${accent}15`,
              border: `1px solid ${accent}40`,
              color: accent,
            }}
          >
            <AlertTriangle size={14} className="mt-0.5 flex-shrink-0" />
            <span>
              You are about to {verb} a door that holds an active package.
              This will be logged in the locker activity timeline with your
              identity and the reason below. Visible to all staff.
            </span>
          </div>

          <div>
            <label
              className="text-xs font-semibold uppercase block mb-1.5"
              style={{ color: theme.text.muted }}
            >
              Reason <span style={{ color: accent }}>*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              onBlur={() => setTouched(true)}
              rows={3}
              autoFocus
              placeholder="e.g. Recipient called to report jammed door, manual inspection at 14:32"
              className="w-full px-3 py-2.5 rounded-xl border text-sm outline-none resize-none"
              style={{
                backgroundColor: theme.bg.secondary,
                borderColor: error ? accent : theme.border.primary,
                color: theme.text.primary,
              }}
            />
            {error && (
              <p className="mt-1 text-xs" style={{ color: accent }}>
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={onCancel}
              disabled={pending}
              className="flex-1 h-11 rounded-xl border text-sm font-semibold"
              style={{
                borderColor: theme.border.primary,
                color: theme.text.primary,
                opacity: pending ? 0.5 : 1,
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={pending}
              className="flex-1 h-11 rounded-xl text-sm font-semibold text-white"
              style={{
                background: pending
                  ? theme.bg.tertiary
                  : `linear-gradient(135deg, ${accent}, ${accent}dd)`,
                cursor: pending ? 'not-allowed' : 'pointer',
              }}
            >
              {pending ? 'Sending…' : `Confirm ${verb}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
