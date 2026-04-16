import { useEffect, useMemo, useState } from 'react';
import type { EventItem } from '@wooftennis/shared';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { RoleSwitch } from '@/components/layout/RoleSwitch';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { EventsList } from '@/components/events/EventsList';
import { EventDetailSheet } from '@/components/events/EventDetailSheet';
import { useMyTimelineEvents } from '@/hooks/useEvents';
import { getLocationColor } from '@/utils/eventColors';
import { t } from '@/utils/i18n';

export function HomePage() {
  const isCoach = useAuthStore((s) => s.user?.isCoach);
  const activeRole = useUIStore((s) => s.activeRole);
  const homeScrollY = useUIStore((s) => s.homeScrollYByRole[activeRole]);
  const setHomeScrollY = useUIStore((s) => s.setHomeScrollY);

  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const eventsQuery = useMyTimelineEvents();

  // Derive unique locations from events for chip filter
  const locations = useMemo(() => {
    const map = new Map<string, string>();
    for (const e of eventsQuery.data?.items ?? []) {
      if (e.locationName) map.set(e.locationId, e.locationName);
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [eventsQuery.data]);

  // Client-side filter
  const filteredEvents = useMemo(() => {
    const items = eventsQuery.data?.items ?? [];
    if (!locationFilter) return items;
    return items.filter((e) => e.locationId === locationFilter);
  }, [eventsQuery.data, locationFilter]);

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

  // Reset filter when switching role
  useEffect(() => {
    setLocationFilter(null);
  }, [activeRole]);

  return (
    <div>
      {/* Role switcher for dual-role users */}
      {isCoach ? <RoleSwitch /> : null}

      {/* Location filter chips */}
      {locations.length > 1 ? (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setLocationFilter(null)}
            className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
              !locationFilter
                ? 'border-woof-accent bg-woof-accent text-white'
                : 'border-woof-border bg-tg-secondary-bg text-tg-hint'
            }`}
          >
            Все
          </button>
          {locations.map((loc) => {
            const color = getLocationColor(loc.id);
            const active = locationFilter === loc.id;
            return (
              <button
                key={loc.id}
                type="button"
                onClick={() => setLocationFilter(active ? null : loc.id)}
                className={`flex flex-shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? 'border-transparent text-white'
                    : 'border-woof-border bg-tg-secondary-bg text-tg-hint'
                }`}
                style={active ? { backgroundColor: color, borderColor: color } : undefined}
              >
                <span
                  className="h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: active ? 'rgba(255,255,255,0.7)' : color }}
                />
                {loc.name}
              </button>
            );
          })}
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
      {!eventsQuery.isLoading && !eventsQuery.isError && !filteredEvents.length ? (
        <EmptyState
          title={t('home', 'emptyTitle')}
          description="Нажмите + чтобы создать первое событие"
        />
      ) : null}

      {/* Events grouped by day */}
      {filteredEvents.length ? (
        <EventsList
          events={filteredEvents}
          onEventClick={(event) => setSelectedEvent(event)}
        />
      ) : null}

      {/* Event detail bottom sheet */}
      <EventDetailSheet
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
