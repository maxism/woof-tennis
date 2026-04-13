import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { RoleSwitch } from '@/components/layout/RoleSwitch';
import { PageHeader } from '@/components/ui/PageHeader';
import { BookingList } from '@/components/booking/BookingList';
import { useCoachBookings, useMyBookings } from '@/hooks/useBookings';
import { t } from '@/utils/i18n';

export function HomePage() {
  const isCoach = useAuthStore((s) => s.user?.isCoach);
  const activeRole = useUIStore((s) => s.activeRole);

  const showCoach = Boolean(isCoach && activeRole === 'coach');

  const myQ = useMyBookings();
  const coachQ = useCoachBookings();

  const q = showCoach ? coachQ : myQ;
  const items = q.data?.items;

  const title = showCoach ? t('home', 'titleCoach') : t('home', 'titlePlayer');

  return (
    <div>
      <PageHeader title={title} subtitle={t('home', 'subtitle')} />
      {isCoach ? <RoleSwitch /> : null}
      <BookingList
        items={items}
        isLoading={q.isLoading}
        isError={q.isError}
        onRetry={() => void q.refetch()}
        variant={showCoach ? 'coach' : 'player'}
      />
    </div>
  );
}
