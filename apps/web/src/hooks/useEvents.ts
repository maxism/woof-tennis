import { useQuery } from '@tanstack/react-query';
import { addDays } from 'date-fns';
import { fetchMyEvents } from '@/api/events';
import { useUIStore } from '@/stores/uiStore';

export function useMyTimelineEvents() {
  const activeRole = useUIStore((s) => s.activeRole);
  const locationId = useUIStore((s) => s.homeLocationId);
  const dateFrom = new Date();
  const dateTo = addDays(dateFrom, 14);

  return useQuery({
    queryKey: ['events', 'my', activeRole, locationId ?? 'all'],
    queryFn: () =>
      fetchMyEvents({
        role: activeRole,
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
        locationId: locationId ?? undefined,
      }),
    staleTime: 30_000,
  });
}
