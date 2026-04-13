import { Outlet, useLocation } from 'react-router-dom';
import { TabBar } from './TabBar';
import { useAuthStore } from '@/stores/authStore';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { t } from '@/utils/i18n';

export function AppLayout() {
  const location = useLocation();
  const isLoading = useAuthStore((s) => s.isLoading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

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
