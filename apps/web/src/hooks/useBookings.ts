import { useQuery } from '@tanstack/react-query';
import { fetchCoachBookings, fetchMyBookings } from '@/api/bookings';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';

export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings', 'my'],
    queryFn: () => fetchMyBookings({ limit: 50 }),
    staleTime: 30_000,
  });
}

export function useCoachBookings() {
  const isCoach = useAuthStore((s) => Boolean(s.user?.isCoach));
  const activeRole = useUIStore((s) => s.activeRole);
  const enabled = isCoach && activeRole === 'coach';

  return useQuery({
    queryKey: ['bookings', 'coach'],
    queryFn: () => fetchCoachBookings({ limit: 50 }),
    staleTime: 30_000,
    enabled,
  });
}
