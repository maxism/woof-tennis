import { useQuery } from '@tanstack/react-query';
import { fetchSlots } from '@/api/slots';

export function useCoachSlots(
  coachId: string | undefined,
  dateFrom: string,
  dateTo: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ['slots', coachId, dateFrom, dateTo],
    queryFn: () =>
      fetchSlots({
        coachId: coachId!,
        dateFrom,
        dateTo,
      }),
    enabled: Boolean(enabled && coachId && dateFrom && dateTo),
    staleTime: 30_000,
  });
}
