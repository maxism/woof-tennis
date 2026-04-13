import { useQuery } from '@tanstack/react-query';
import { fetchCoachBookings, fetchMyBookings } from '@/api/bookings';

export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: () => fetchMyBookings({ limit: 50 }),
    staleTime: 30_000,
  });
}

export function useCoachBookings() {
  return useQuery({
    queryKey: ['bookings', 'coach'],
    queryFn: () => fetchCoachBookings({ limit: 50 }),
    staleTime: 30_000,
  });
}
