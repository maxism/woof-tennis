import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { WeekView } from '@/components/schedule/WeekView';
import { useCoachSlots } from '@/hooks/useSlots';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

export function SchedulePage() {
  const coachId = useAuthStore((s) => s.user?.id);
  const range = useMemo(() => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    const end = endOfWeek(new Date(), { weekStartsOn: 1 });
    return {
      from: format(start, 'yyyy-MM-dd'),
      to: format(end, 'yyyy-MM-dd'),
    };
  }, []);

  const q = useCoachSlots(coachId, range.from, range.to);

  return (
    <div>
      <PageHeader
        title={t('nav', 'schedule')}
        right={
          <div className="flex gap-1">
            <Link to={ROUTES.coach.templateNew}>
              <Button size="sm" variant="secondary">
                {t('schedule', 'addTemplate')}
              </Button>
            </Link>
            <Link to={ROUTES.coach.slotNew}>
              <Button size="sm">{t('schedule', 'addSlot')}</Button>
            </Link>
          </div>
        }
      />
      {q.isLoading ? <Spinner /> : null}
      {q.isError ? (
        <EmptyState
          title={t('error', 'coachRequired')}
          description={t('common', 'retry')}
          action={
            <Button variant="secondary" onClick={() => void q.refetch()}>
              {t('common', 'retry')}
            </Button>
          }
        />
      ) : null}
      {!q.isLoading && !q.isError && (q.data?.length ?? 0) === 0 ? (
        <EmptyState
          title={t('common', 'empty')}
          description={t('schedule', 'addSlot')}
          action={
            <div className="mt-3 flex gap-2">
              <Link to={ROUTES.coach.slotNew}>
                <Button size="sm">{t('schedule', 'addSlot')}</Button>
              </Link>
              <Link to={ROUTES.coach.templateNew}>
                <Button size="sm" variant="secondary">
                  {t('schedule', 'addTemplate')}
                </Button>
              </Link>
            </div>
          }
        />
      ) : null}
      {!q.isError ? <WeekView slots={q.data ?? []} /> : null}
    </div>
  );
}
