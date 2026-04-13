import { Outlet, useLocation } from 'react-router-dom';
import { TabBar } from './TabBar';
import { useAuthStore } from '@/stores/authStore';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { t } from '@/utils/i18n';
import { getTelegramInitData } from '@/utils/telegram';

export function AppLayout() {
  const location = useLocation();
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authError = useAuthStore((s) => s.authError);
  const login = useAuthStore((s) => s.login);

  const botAppUrl = import.meta.env.VITE_TELEGRAM_BOT_APP_URL?.trim();
  const initData = getTelegramInitData();

  const hideTabBar =
    location.pathname.startsWith('/review/') ||
    location.pathname.includes('/edit') ||
    location.pathname.includes('/new');

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
        <EmptyState title={t('error', 'unauthorized')} description={t('common', 'devNoTelegram')} />
        {authError ? (
          <p className="mt-3 rounded-xl border border-woof-danger/40 bg-woof-danger/10 px-3 py-2 text-center text-sm text-woof-danger">
            {authError}
          </p>
        ) : null}
        <div className="mt-6 flex flex-col gap-3">
          {initData ? (
            <Button variant="primary" size="lg" className="w-full" onClick={() => void login(initData)}>
              {t('auth', 'retryLogin')}
            </Button>
          ) : null}
          {botAppUrl ? (
            <>
              <Button
                href={botAppUrl}
                variant={initData ? 'secondary' : 'primary'}
                size="lg"
                className="w-full"
              >
                {t('auth', 'openInTelegram')}
              </Button>
              {!initData ? (
                <p className="text-center text-xs text-tg-hint">{t('auth', 'miniAppHint')}</p>
              ) : null}
            </>
          ) : null}
          {!botAppUrl && !initData ? (
            <p className="text-center text-xs text-tg-hint">{t('auth', 'missingBotUrl')}</p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-dvh max-w-lg pb-24 pt-safe">
      <main className="px-4 pt-4">
        <Outlet />
      </main>
      {!hideTabBar ? <TabBar /> : null}
    </div>
  );
}
