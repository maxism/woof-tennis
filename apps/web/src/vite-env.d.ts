/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_DEV_ACCESS_TOKEN: string;
  readonly VITE_UI_LOCALE: string;
  /** Имя бота для Login Widget (без @), см. docs/15-auth-dual-channel-architecture.md */
  readonly VITE_TELEGRAM_BOT_USERNAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
