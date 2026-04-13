/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_DEV_ACCESS_TOKEN: string;
  readonly VITE_UI_LOCALE: string;
  /** Прямая ссылка на Mini App: https://t.me/BotUserName/short_name */
  readonly VITE_TELEGRAM_BOT_APP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
