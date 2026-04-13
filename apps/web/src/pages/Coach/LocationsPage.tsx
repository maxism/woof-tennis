import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchMyLocations } from '@/api/locations';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

export function LocationsPage() {
  const q = useQuery({
    queryKey: ['locations', 'mine'],
    queryFn: fetchMyLocations,
    staleTime: 300_000,
  });

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
      {q.isError ? <EmptyState description={t('error', 'coachRequired')} /> : null}
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
