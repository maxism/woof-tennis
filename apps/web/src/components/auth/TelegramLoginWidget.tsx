import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import type { TelegramWidgetAuthPayload } from '@/api/auth';
import { t } from '@/utils/i18n';

const CALLBACK_NAME = 'woofTelegramWidgetOnAuth';

declare global {
  interface Window {
    woofTelegramWidgetOnAuth?: (user: unknown) => void;
  }
}

function normalizeWidgetUser(raw: Record<string, unknown>): TelegramWidgetAuthPayload {
  const payload: TelegramWidgetAuthPayload = {
    id: Number(raw.id),
    first_name: String(raw.first_name ?? ''),
    auth_date: Number(raw.auth_date),
    hash: String(raw.hash ?? ''),
  };
  if (raw.last_name != null && raw.last_name !== '') {
    payload.last_name = String(raw.last_name);
  }
  if (raw.username != null && raw.username !== '') {
    payload.username = String(raw.username);
  }
  if (raw.photo_url != null && raw.photo_url !== '') {
    payload.photo_url = String(raw.photo_url);
  }
  return payload;
}

/**
 * Telegram Login Widget для веб-канала (docs/15, docs/03-api-spec § widget).
 * Домен страницы должен быть привязан к боту через /setdomain (docs/14).
 */
export function TelegramLoginWidget({ botUsername }: { botUsername: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !botUsername.trim()) return;

    window.woofTelegramWidgetOnAuth = (user: unknown) => {
      if (!user || typeof user !== 'object') return;
      void useAuthStore.getState().loginWithWidget(
        normalizeWidgetUser(user as Record<string, unknown>),
      );
    };

    el.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', botUsername.trim());
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', `${CALLBACK_NAME}(user)`);
    script.setAttribute('data-request-access', 'write');
    el.appendChild(script);

    return () => {
      delete window.woofTelegramWidgetOnAuth;
      el.innerHTML = '';
    };
  }, [botUsername]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div ref={containerRef} className="flex min-h-[44px] w-full justify-center" />
      <p className="text-center text-xs text-tg-hint">{t('auth', 'widgetLegal')}</p>
    </div>
  );
}
