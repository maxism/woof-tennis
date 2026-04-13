import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import toast from 'react-hot-toast';
import { fetchCoachPublic } from '@/api/users';
import { createBooking } from '@/api/bookings';
import { PageHeader } from '@/components/ui/PageHeader';
import { Card } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { SlotPicker } from '@/components/booking/SlotPicker';
import { useCoachSlots } from '@/hooks/useSlots';
import type { SlotPublic } from '@wooftennis/shared';
import { t } from '@/utils/i18n';
import { hapticLight } from '@/utils/telegram';

export function CoachProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [selected, setSelected] = useState<SlotPublic | null>(null);
  const qc = useQueryClient();

  const range = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    return {
      from: format(start, 'yyyy-MM-dd'),
      to: format(end, 'yyyy-MM-dd'),
    };
  }, []);

  const profileQ = useQuery({
    queryKey: ['coach', id],
    queryFn: () => fetchCoachPublic(id!),
    enabled: Boolean(id),
  });

  const slotsQ = useCoachSlots(id, range.from, range.to);

  const book = useMutation({
    mutationFn: (slotId: string) => createBooking(slotId),
    onSuccess: () => {
      hapticLight();
      toast.success(t('booking', 'confirmed'));
      setSelected(null);
      void qc.invalidateQueries({ queryKey: ['bookings'] });
      void qc.invalidateQueries({ queryKey: ['slots', id] });
    },
    onError: (err: unknown) => {
      const msg =
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object' &&
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data
          ? String((err.response.data as { message?: string }).message)
          : t('common', 'retry');
      toast.error(msg);
    },
  });

  if (profileQ.isLoading) return <Spinner />;
  if (profileQ.isError || !profileQ.data) {
    return <EmptyState description={t('error', 'notFound')} />;
  }

  const p = profileQ.data;
  const name = `${p.firstName} ${p.lastName ?? ''}`.trim();

  return (
    <div>
      <PageHeader title={name} />
      <Card className="mb-4 flex flex-row items-center gap-3">
        <Avatar src={p.photoUrl} name={p.firstName} size={48} />
        <div>
          {p.stats ? (
            <p className="text-sm text-tg-hint">
              ★ {p.stats.avgRating?.toFixed(1) ?? '—'} · {p.stats.totalReviews}{' '}
              отзывов
            </p>
          ) : null}
        </div>
      </Card>
      {p.locations?.length ? (
        <p className="mb-2 text-sm text-tg-hint">
          {p.locations.map((l) => l.name).join(', ')}
        </p>
      ) : null}
      {slotsQ.isLoading ? <Spinner /> : null}
      <SlotPicker
        slots={slotsQ.data ?? []}
        selectedId={selected?.id ?? null}
        onSelect={setSelected}
      />
      {selected ? (
        <div className="mt-4">
          <button
            type="button"
            disabled={book.isPending}
            className="w-full rounded-xl bg-woof-accent py-3 text-center font-semibold text-white opacity-90 disabled:opacity-40"
            onClick={() => book.mutate(selected.id)}
          >
            {t('booking', 'book')}
          </button>
        </div>
      ) : null}
    </div>
  );
}
