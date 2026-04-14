import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { RoleSwitch } from '@/components/layout/RoleSwitch';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { Select } from '@/components/ui/Select';
import { EventsList } from '@/components/events/EventsList';
import { fetchMyLocations } from '@/api/locations';
import { useMyTimelineEvents } from '@/hooks/useEvents';
import { t } from '@/utils/i18n';

export function HomePage() {
  const isCoach = useAuthStore((s) => s.user?.isCoach);
  const activeRole = useUIStore((s) => s.activeRole);
  const locationId = useUIStore((s) => s.homeLocationId);
  const setLocationId = useUIStore((s) => s.setHomeLocationId);
  const homeScrollY = useUIStore((s) => s.homeScrollYByRole[activeRole]);
  const setHomeScrollY = useUIStore((s) => s.setHomeScrollY);

  const eventsQuery = useMyTimelineEvents();

  // Locations are only needed for the coach filter selector
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
      {/* Role switcher for dual-role users */}
      {isCoach ? <RoleSwitch /> : null}

      {/* Location filter — only coaches in coach mode */}
      {isCoach && activeRole === 'coach' && (locationsQuery.data?.length ?? 0) > 0 ? (
        <div className="mb-4">
          <Select
            value={locationId ?? ''}
            onChange={(e) => setLocationId(e.target.value || null)}
            aria-label="Фильтр по локации"
          >
            <option value="">Все локации</option>
            {locationsQuery.data?.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name}
              </option>
            ))}
          </Select>
        </div>
      ) : null}

      {/* Loading */}
      {eventsQuery.isLoading ? (
        <div className="flex justify-center py-12">
          <Spinner />
        </div>
      ) : null}

      {/* Error */}
      {eventsQuery.isError ? (
        <EmptyState
          title={t('error', 'notFound')}
          description={t('common', 'retry')}
          action={
            <button
              type="button"
              className="mt-2 text-sm font-medium text-woof-accent"
              onClick={() => void eventsQuery.refetch()}
            >
              {t('common', 'retry')}
            </button>
          }
        />
      ) : null}

      {/* Empty state */}
      {!eventsQuery.isLoading && !eventsQuery.isError && !eventsQuery.data?.items.length ? (
        <EmptyState
          title={t('home', 'emptyTitle')}
          description="Нажмите + чтобы создать первое событие"
        />
      ) : null}

      {/* Events grouped by day */}
      {eventsQuery.data?.items.length ? (
        <EventsList events={eventsQuery.data.items} />
      ) : null}
    </div>
  );
}
