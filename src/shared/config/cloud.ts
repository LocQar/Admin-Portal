/**
 * Runtime cloud config for the Admin Portal.
 *
 * Single source of truth for environment-driven settings. Vite inlines
 * `import.meta.env.*` values at build time, so this module is safe to
 * import anywhere in the app.
 *
 * At runtime, an admin can override the boolean `features.*` flags via
 * localStorage (key: "locqar.cloudConfig.overrides") for QA/debugging.
 * See `/settings/cloud` page for the UI.
 */

const OVERRIDE_KEY = 'locqar.cloudConfig.overrides';

type Env = 'development' | 'staging' | 'production';

function readBool(raw: string | undefined, fallback: boolean): boolean {
  if (raw === undefined) return fallback;
  return raw === 'true' || raw === '1';
}

function readOverrides(): Partial<Record<string, boolean>> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(OVERRIDE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) ?? {};
  } catch {
    return {};
  }
}

const overrides = readOverrides();

export const cloudConfig = {
  apiUrl: import.meta.env.VITE_API_URL ?? '/api',
  env: (import.meta.env.VITE_APP_ENV ?? 'development') as Env,
  features: {
    useMsw: overrides.useMsw ?? readBool(import.meta.env.VITE_USE_MSW, true),
    otpEnabled: overrides.otpEnabled ?? readBool(import.meta.env.VITE_OTP_ENABLED, true),
    whatsappChannel: overrides.whatsappChannel ?? readBool(import.meta.env.VITE_WHATSAPP, true),
  },
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  mapTiles: import.meta.env.VITE_MAP_TILES_URL ?? 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
  version: __APP_VERSION__,
} as const;

export type CloudConfig = typeof cloudConfig;

export function setFeatureOverride(key: keyof CloudConfig['features'], value: boolean | null): void {
  if (typeof window === 'undefined') return;
  const current = readOverrides();
  if (value === null) {
    delete current[key];
  } else {
    current[key] = value;
  }
  window.localStorage.setItem(OVERRIDE_KEY, JSON.stringify(current));
}

export function clearOverrides(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(OVERRIDE_KEY);
}
