import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMyPlaySessions } from '@/api/play-sessions';
import { PageHeader } from '@/components/ui/PageHeader';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { SessionCard } from '@/components/play/SessionCard';
import { Button } from '@/components/ui/Button';
import { getApiErrorStatus } from '@/utils/apiError';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

export function MySessionsPage() {
  const q = useQuery({
    queryKey: ['play-sessions', 'my'],
    queryFn: () => fetchMyPlaySessions(),
    staleTime: 30_000,
  });
  const status = getApiErrorStatus(q.error);

  const items = q.data?.items ?? [];

  return (
    <div>
      <PageHeader
        title={t('nav', 'play')}
        right={
          <Link to={ROUTES.play.new}>
            <Button size="sm">{t('playSession', 'create')}</Button>
          </Link>
        }
      />

      {q.isLoading ? <Spinner /> : null}

      {q.isError ? (
        <EmptyState
          title={status === 400 ? t('error', 'invalidFilters') : t('error', 'unauthorized')}
          description={status === 403 ? t('error', 'forbidden') : t('common', 'retry')}
          action={
            <Button variant="secondary" className="mt-3" onClick={() => void q.refetch()}>
              {t('common', 'retry')}
            </Button>
          }
        />
      ) : null}

      {!q.isLoading && !q.isError && items.length === 0 ? (
        <EmptyState
          title={t('common', 'empty')}
          description={t('playSession', 'create')}
          action={
            <Link to={ROUTES.play.new}>
              <Button className="mt-3">{t('playSession', 'create')}</Button>
            </Link>
          }
        />
      ) : null}

      {items.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {items.map((session) => (
            <li key={session.id}>
              <Link to={ROUTES.play.join(session.inviteCode)}>
                <SessionCard session={session} />
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
