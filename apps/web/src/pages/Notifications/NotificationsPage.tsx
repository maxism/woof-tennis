import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { NotificationCard } from '@/components/notification/NotificationCard';
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '@/hooks/useNotifications';
import { t } from '@/utils/i18n';

export function NotificationsPage() {
  const q = useNotifications();
  const markOne = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  return (
    <div>
      <PageHeader
        title={t('nav', 'notifications')}
        right={
          <Button
            variant="ghost"
            size="sm"
            disabled={markAll.isPending || !q.data?.items.length}
            onClick={() => markAll.mutate()}
          >
            {t('notification', 'markAllRead')}
          </Button>
        }
      />
      {q.isLoading ? <Spinner /> : null}
      {q.isError ? (
        <EmptyState
          description={t('error', 'notFound')}
          action={
            <button
              type="button"
              className="text-woof-accent"
              onClick={() => void q.refetch()}
            >
              {t('common', 'retry')}
            </button>
          }
        />
      ) : null}
      {q.data?.items.length === 0 ? <EmptyState /> : null}
      <ul className="flex flex-col gap-2">
        {q.data?.items.map((n) => (
          <li key={n.id}>
            <NotificationCard
              item={n}
              onMarkRead={(id) => markOne.mutate(id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
