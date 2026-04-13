import { Link } from 'react-router-dom';
import { BookingStatus, type BookingDetailed, type UserPublic } from '@wooftennis/shared';
import { coachFromBooking } from '@/utils/booking';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatSlotDate, formatTimeRange } from '@/utils/date';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

function statusTone(
  status: BookingStatus,
): 'accent' | 'neutral' | 'warn' | 'danger' | 'success' {
  switch (status) {
    case BookingStatus.Confirmed:
      return 'accent';
    case BookingStatus.Cancelled:
      return 'danger';
    case BookingStatus.Completed:
      return 'success';
    case BookingStatus.NoShow:
      return 'warn';
    default:
      return 'neutral';
  }
}

function statusLabel(status: BookingStatus): string {
  switch (status) {
    case BookingStatus.Confirmed:
      return t('booking', 'confirmed');
    case BookingStatus.Cancelled:
      return t('booking', 'cancelled');
    case BookingStatus.Completed:
      return t('booking', 'completed');
    case BookingStatus.NoShow:
      return t('booking', 'noShow');
    default:
      return status;
  }
}

export function BookingCard({
  booking,
  variant = 'player',
}: {
  booking: BookingDetailed;
  variant?: 'player' | 'coach';
}) {
  const coach = coachFromBooking(booking);
  const { slot } = booking;
  const dateLine = formatSlotDate(slot.date);
  const timeLine = formatTimeRange(slot.startTime, slot.endTime);

  const counterparty =
    variant === 'player'
      ? coach
      : (booking as BookingDetailed & { player?: UserPublic }).player;

  const counterpartyLabel =
    variant === 'player'
      ? `${coach?.firstName ?? ''} ${coach?.lastName ?? ''}`.trim() || coach?.username
      : `${counterparty?.firstName ?? ''} ${counterparty?.lastName ?? ''}`.trim() ||
        counterparty?.username;

  return (
    <Card className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-tg-text">
            📅 {dateLine} · {timeLine}
          </p>
          <p className="mt-0.5 text-sm text-tg-hint">📍 {slot.location.name}</p>
          {counterpartyLabel ? (
            <p className="mt-1 text-sm text-tg-text">
              {variant === 'player' ? '👤 ' : '👤 '}
              {counterpartyLabel}
            </p>
          ) : null}
        </div>
        <Badge tone={statusTone(booking.status)}>{statusLabel(booking.status)}</Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        {booking.status === BookingStatus.Confirmed ? (
          <Button variant="secondary" size="sm">
            {t('booking', 'cancel')}
          </Button>
        ) : null}
        {booking.status === BookingStatus.Completed && !booking.review ? (
          <Link to={ROUTES.review(booking.id)}>
            <Button variant="primary" size="sm">
              {t('review', 'submit')}
            </Button>
          </Link>
        ) : null}
        <Link to={ROUTES.player.booking(booking.id)}>
          <Button variant="ghost" size="sm">
            {t('common', 'open')}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
