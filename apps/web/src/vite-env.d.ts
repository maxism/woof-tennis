/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_DEV_ACCESS_TOKEN: string;
  readonly VITE_UI_LOCALE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
