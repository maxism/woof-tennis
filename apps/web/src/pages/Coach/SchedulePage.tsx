import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { useAuthStore } from '@/stores/authStore';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
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
      <WeekView slots={q.data ?? []} />
    </div>
  );
}
