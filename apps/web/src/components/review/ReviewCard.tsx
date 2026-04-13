import type { Review } from '@wooftennis/shared';
import { Card } from '@/components/ui/Card';
import { t } from '@/utils/i18n';

export function ReviewCard({ review }: { review: Review }) {
  return (
    <Card>
      <p className="text-sm text-tg-text">
        {t('review', 'ratingValue')}: {review.ratingValue}/3
      </p>
      {review.recommendation ? (
        <p className="mt-1 text-sm text-tg-hint">{review.recommendation}</p>
      ) : null}
    </Card>
  );
}
