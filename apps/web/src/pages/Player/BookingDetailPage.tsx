import { Link, useParams } from 'react-router-dom';
import { PageHeader } from '@/components/ui/PageHeader';
import { BookingCard } from '@/components/booking/BookingCard';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { useMyBookings } from '@/hooks/useBookings';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

export function BookingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const q = useMyBookings();
  const booking = q.data?.items.find((b) => b.id === id);

  if (q.isLoading) return <Spinner />;
  if (!booking) {
    return (
      <EmptyState
        description={t('error', 'notFound')}
        action={
          <Link to={ROUTES.home}>
            <Button variant="secondary">{t('nav', 'myTrainings')}</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <PageHeader title={t('booking', 'confirmed')} />
      <BookingCard booking={booking} variant="player" />
    </div>
  );
}
