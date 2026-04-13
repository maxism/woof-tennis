import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { createReview } from '@/api/reviews';
import { PageHeader } from '@/components/ui/PageHeader';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { RatingPicker, type RatingVisual } from '@/components/review/RatingPicker';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { useMyBookings } from '@/hooks/useBookings';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';
import { hapticLight } from '@/utils/telegram';
import { coachFromBooking } from '@/utils/booking';

export function ReviewFormPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const q = useMyBookings();

  const booking = useMemo(
    () => q.data?.items.find((b) => b.id === bookingId),
    [q.data?.items, bookingId],
  );

  const [ratingValue, setRatingValue] = useState<number | null>(null);
  const [ratingStyle, setRatingStyle] = useState<RatingVisual>('star');
  const [recommendation, setRecommendation] = useState('');
  const [comment, setComment] = useState('');

  const coach = booking ? coachFromBooking(booking) : undefined;

  const m = useMutation({
    mutationFn: () =>
      createReview({
        bookingId: booking!.id,
        targetId: coach!.id,
        ratingValue: ratingValue!,
        ratingStyle,
        recommendation: recommendation || undefined,
        comment: comment || undefined,
      }),
    onSuccess: () => {
      hapticLight();
      toast.success(t('review', 'submit'));
      void qc.invalidateQueries({ queryKey: ['bookings'] });
      navigate(ROUTES.home);
    },
    onError: () => toast.error(t('common', 'retry')),
  });

  if (q.isLoading) return <Spinner />;
  if (!booking || !coach) {
    return <EmptyState description={t('error', 'notFound')} />;
  }

  return (
    <div>
      <PageHeader title={t('review', 'title')} />
      <RatingPicker
        value={ratingValue}
        style={ratingStyle}
        onChangeValue={setRatingValue}
        onChangeStyle={setRatingStyle}
      />
      <div className="mt-4 flex flex-col gap-3">
        <Input
          label={t('review', 'recommendation')}
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value)}
        />
        <Input
          label={t('review', 'comment')}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <Button
        variant="primary"
        className="mt-6 w-full"
        disabled={m.isPending || ratingValue === null}
        onClick={() => m.mutate()}
      >
        {t('review', 'submit')}
      </Button>
    </div>
  );
}
