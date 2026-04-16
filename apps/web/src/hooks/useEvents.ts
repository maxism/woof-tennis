import { useQuery } from '@tanstack/react-query';
import { addDays } from 'date-fns';
import { fetchMyEvents } from '@/api/events';
import { useUIStore } from '@/stores/uiStore';

export function useMyTimelineEvents() {
  const activeRole = useUIStore((s) => s.activeRole);
  const dateFrom = new Date();
  const dateTo = addDays(dateFrom, 14);

  return useQuery({
    queryKey: ['events', 'my', activeRole],
    queryFn: () =>
      fetchMyEvents({
        role: activeRole,
        dateFrom: dateFrom.toISOString(),
        dateTo: dateTo.toISOString(),
      }),
    staleTime: 30_000,
  });
}
