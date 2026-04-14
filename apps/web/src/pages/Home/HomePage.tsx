import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { RoleSwitch } from '@/components/layout/RoleSwitch';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { Select } from '@/components/ui/Select';
import { fetchMyLocations } from '@/api/locations';
import { useMyTimelineEvents } from '@/hooks/useEvents';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';
import { EventStatus } from '@wooftennis/shared';

function mapEventStatusLabel(status: EventStatus): string {
  switch (status) {
    case EventStatus.Cancelled:
      return t('event', 'cancelled');
    case EventStatus.Rescheduled:
      return 'Перенесено';
    case EventStatus.Attached:
      return 'Игрок назначен';
    case EventStatus.Invited:
      return 'Инвайт отправлен';
    case EventStatus.Accepted:
      return 'Подтверждено';
    case EventStatus.Declined:
      return 'Отклонено';
    case EventStatus.Completed:
      return 'Завершено';
    case EventStatus.Draft:
    default:
      return 'Черновик';
  }
}

export function HomePage() {
  const isCoach = useAuthStore((s) => s.user?.isCoach);
  const activeRole = useUIStore((s) => s.activeRole);
  const locationId = useUIStore((s) => s.homeLocationId);
  const setLocationId = useUIStore((s) => s.setHomeLocationId);
  const homeScrollY = useUIStore((s) => s.homeScrollYByRole[activeRole]);
  const setHomeScrollY = useUIStore((s) => s.setHomeScrollY);

  const eventsQuery = useMyTimelineEvents();
  const locationsQuery = useQuery({
    queryKey: ['locations', 'mine', 'home-filter'],
    queryFn: () => fetchMyLocations(),
    enabled: Boolean(isCoach && activeRole === 'coach'),
    staleTime: 300_000,
  });

  useEffect(() => {
    if (typeof homeScrollY === 'number') {
      window.scrollTo({ top: homeScrollY });
    }
  }, [activeRole, homeScrollY]);

  useEffect(
    () => () => {
      setHomeScrollY(activeRole, window.scrollY);
    },
    [activeRole, setHomeScrollY],
  );

  return (
    <div>
      <PageHeader
        title={t('home', 'titlePlayer')}
        subtitle={t('home', 'subtitle')}
        right={
          <Link to={ROUTES.play.create}>
            <Button size="sm">{t('home', 'create')}</Button>
          </Link>
        }
      />
      {isCoach ? <RoleSwitch /> : null}

      <div className="mb-4 flex flex-col gap-2">
        <p className="text-xs text-tg-hint">{t('home', 'roleHint')}</p>
        <Select
          value={locationId ?? ''}
          onChange={(e) => setLocationId(e.target.value || null)}
          aria-label="Фильтр локаций"
        >
          <option value="">Все локации</option>
          {locationsQuery.data?.map((location) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </Select>
      </div>

      {eventsQuery.isLoading ? <Spinner /> : null}
      {eventsQuery.isError ? (
        <EmptyState
          title={t('error', 'notFound')}
          description={t('common', 'retry')}
          action={
            <Button variant="secondary" onClick={() => void eventsQuery.refetch()}>
              {t('common', 'retry')}
            </Button>
          }
        />
      ) : null}
      {!eventsQuery.isLoading && !eventsQuery.data?.items.length ? (
        <EmptyState
          title={t('home', 'emptyTitle')}
          action={
            <Link to={ROUTES.play.create}>
              <Button>{t('home', 'emptyAction')}</Button>
            </Link>
          }
        />
      ) : null}
      <ul className="flex flex-col gap-3">
        {eventsQuery.data?.items.map((event) => (
          <li key={event.id}>
            <Card>
              <p className="text-sm font-medium text-tg-text">
                {new Date(event.startsAt).toLocaleString('ru-RU')} - {new Date(event.endsAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="mt-1 text-xs text-tg-hint">
                {t('home', 'eventStatus')}: {mapEventStatusLabel(event.status)}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
