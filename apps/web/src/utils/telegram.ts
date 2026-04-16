import {
  miniAppReady as sdkMiniAppReady,
  retrieveRawInitData,
} from '@telegram-apps/sdk-react';

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string;
        initDataUnsafe?: { start_param?: string };
        ready: () => void;
        expand: () => void;
        colorScheme?: 'light' | 'dark';
        onEvent?: (event: string, cb: () => void) => void;
        offEvent?: (event: string, cb: () => void) => void;
        setHeaderColor?: (color: string) => void;
        BackButton?: { show: () => void; hide: () => void; onClick: (cb: () => void) => void };
        MainButton?: {
          setText: (t: string) => void;
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          enable: () => void;
          disable: () => void;
        };
        HapticFeedback?: { impactOccurred: (style: 'light' | 'medium' | 'heavy') => void };
        openTelegramLink?: (url: string) => void;
      };
    };
  }
}

export function getTelegramInitData(): string {
  try {
    const raw = retrieveRawInitData();
    if (raw) return raw;
  } catch {
    /* outside Mini App */
  }
  return window.Telegram?.WebApp?.initData ?? '';
}

/** Документ 15 §5.2: канал Mini App — непустой initData (WebApp / SDK). */
export function isTelegramMiniApp(): boolean {
  return getTelegramInitData().trim().length > 0;
}

export function getStartParam(): string | undefined {
  return window.Telegram?.WebApp?.initDataUnsafe?.start_param;
}

export function expandMiniApp(): void {
  window.Telegram?.WebApp?.expand();
}

export function miniAppReady(): void {
  try {
    sdkMiniAppReady();
  } catch {
    window.Telegram?.WebApp?.ready();
  }
}

export function syncThemeFromTelegram(): void {
  // Respect manual user override — don't override with TG theme if user chose explicitly.
  const override = localStorage.getItem('woof-theme');
  if (override === 'light' || override === 'dark') return;

  const scheme = window.Telegram?.WebApp?.colorScheme;
  if (scheme === 'dark') {
    document.documentElement.dataset.theme = 'dark';
    return;
  }
  if (scheme === 'light') {
    document.documentElement.dataset.theme = 'light';
    return;
  }
  document.documentElement.removeAttribute('data-theme');
}

export function subscribeTelegramTheme(cb: () => void): () => void {
  const w = window.Telegram?.WebApp;
  w?.onEvent?.('themeChanged', cb);
  return () => w?.offEvent?.('themeChanged', cb);
}

export function hapticLight(): void {
  window.Telegram?.WebApp?.HapticFeedback?.impactOccurred?.('light');
}
