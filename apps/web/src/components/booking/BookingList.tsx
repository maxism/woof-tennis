import type { BookingDetailed } from '@wooftennis/shared';
import { BookingCard } from './BookingCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { Spinner } from '@/components/ui/Spinner';
import { t } from '@/utils/i18n';

export function BookingList({
  items,
  isLoading,
  isError,
  onRetry,
  variant = 'player',
}: {
  items: BookingDetailed[] | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  variant?: 'player' | 'coach';
}) {
  if (isLoading) return <Spinner />;
  if (isError) {
    return (
      <EmptyState
        title={t('common', 'empty')}
        description={t('error', 'notFound')}
        action={
          <button
            type="button"
            className="text-sm font-medium text-woof-accent"
            onClick={onRetry}
          >
            {t('common', 'retry')}
          </button>
        }
      />
    );
  }
  if (!items?.length) {
    return <EmptyState title={t('common', 'empty')} description={t('home', 'subtitle')} />;
  }
  return (
    <ul className="flex flex-col gap-3">
      {items.map((b) => (
        <li key={b.id}>
          <BookingCard booking={b} variant={variant} />
        </li>
      ))}
    </ul>
  );
}
