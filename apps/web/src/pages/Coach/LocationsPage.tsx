import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMyLocations } from '@/api/locations';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { getApiErrorStatus } from '@/utils/apiError';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

export function LocationsPage() {
  const isCoach = useAuthStore((s) => Boolean(s.user?.isCoach));
  const activeRole = useUIStore((s) => s.activeRole);
  const isCoachContext = isCoach && activeRole === 'coach';
  const q = useQuery({
    queryKey: ['locations', 'mine'],
    queryFn: () => fetchMyLocations(),
    staleTime: 300_000,
    enabled: isCoachContext,
  });
  const status = getApiErrorStatus(q.error);

  return (
    <div>
      <PageHeader
        title={t('nav', 'locations')}
        right={
          <Link to={ROUTES.coach.locationNew}>
            <Button size="sm">{t('location', 'add')}</Button>
          </Link>
        }
      />
      {q.isLoading ? <Spinner /> : null}
      {q.isError ? (
        <EmptyState
          title={status === 400 ? t('error', 'invalidFilters') : t('error', 'coachRequired')}
          description={status === 403 ? t('error', 'coachContextRequired') : t('common', 'retry')}
        />
      ) : null}
      {!q.data?.length && !q.isLoading ? <EmptyState /> : null}
      <ul className="flex flex-col gap-2">
        {q.data?.map((loc) => (
          <li key={loc.id}>
            <Card>
              <p className="font-medium text-tg-text">{loc.name}</p>
              <p className="text-sm text-tg-hint">{loc.address}</p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
