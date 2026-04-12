/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_APP_ENV?: 'development' | 'staging' | 'production';
  readonly VITE_USE_MSW?: string;
  readonly VITE_OTP_ENABLED?: string;
  readonly VITE_WHATSAPP?: string;
  readonly VITE_SENTRY_DSN?: string;
  readonly VITE_MAP_TILES_URL?: string;
  readonly VITE_LOCKER_CLOUD_URL?: string;
  readonly VITE_ADMIN_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const __APP_VERSION__: string;
