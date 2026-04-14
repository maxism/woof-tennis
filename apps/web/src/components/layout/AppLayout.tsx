import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { TabBar } from './TabBar';
import { useAuthStore } from '@/stores/authStore';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { TelegramLoginWidget } from '@/components/auth/TelegramLoginWidget';
import { t } from '@/utils/i18n';
import { getTelegramInitData, isTelegramMiniApp } from '@/utils/telegram';

export function AppLayout() {
  const location = useLocation();
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authError = useAuthStore((s) => s.authError);
  const authRequestId = useAuthStore((s) => s.authRequestId);
  const login = useAuthStore((s) => s.login);
  const [widgetRemount, setWidgetRemount] = useState(0);

  const botUsername = import.meta.env.VITE_TELEGRAM_BOT_USERNAME?.trim();
  const initData = getTelegramInitData();
  const miniApp = isTelegramMiniApp();

  const hideTabBar =
    location.pathname.startsWith('/review/') ||
    location.pathname.includes('/edit') ||
    location.pathname === '/coach/locations/new';

  if (isLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-8">
        <EmptyState
          title={authError ? t('error', 'authFailedTitle') : t('error', 'unauthorized')}
          description={miniApp ? t('auth', 'miniAppHint') : t('auth', 'webLoginIntro')}
        />
        {authError ? (
          <p className="mt-3 rounded-xl border border-woof-danger/40 bg-woof-danger/10 px-3 py-2 text-center text-sm text-woof-danger">
            {authError}
          </p>
        ) : null}
        {import.meta.env.DEV && authRequestId ? (
          <p className="mt-2 text-center font-mono text-[10px] text-tg-hint">
            requestId: {authRequestId}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3">
          {authError && miniApp && initData ? (
            <Button variant="primary" size="lg" className="w-full" onClick={() => void login(initData)}>
              {t('auth', 'retryAction')}
            </Button>
          ) : null}
          {authError && !miniApp && botUsername ? (
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => setWidgetRemount((k) => k + 1)}
            >
              {t('auth', 'retryAction')}
            </Button>
          ) : null}
          {!miniApp ? (
            botUsername ? (
              <TelegramLoginWidget key={widgetRemount} botUsername={botUsername} />
            ) : (
              <p className="text-center text-xs text-tg-hint">{t('auth', 'missingBotUsername')}</p>
            )
          ) : null}
        </div>
      </div>
    );
  }

  return (
    // pb-32 = 128px: tab bar ~56px + FAB overhang ~28px + breathing room
    <div className="mx-auto min-h-dvh max-w-lg pb-32 pt-safe">
      <main className="px-4 pt-4">
        <Outlet />
      </main>
      {!hideTabBar ? <TabBar /> : null}
    </div>
  );
}
