import { useMemo } from 'react';
import { addDays, format, parseISO, startOfWeek } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { SlotPublic } from '@wooftennis/shared';
import { DayColumn } from './DayColumn';
import { t } from '@/utils/i18n';

export function WeekView({ slots }: { slots: SlotPublic[] }) {
  const byDay = useMemo(() => {
    const map = new Map<string, SlotPublic[]>();
    for (const s of slots) {
      const list = map.get(s.date) ?? [];
      list.push(s);
      map.set(s.date, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return map;
  }, [slots]);

  const keys = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => format(addDays(weekStart, i), 'yyyy-MM-dd'));
  }, []);

  return (
    <div>
      <p className="mb-2 text-xs text-tg-hint">
        {t('slot', 'available')} · {t('slot', 'full')} · {t('slot', 'splitOpen')}
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto pb-2">
        {keys.map((dateKey) => {
          const d = parseISO(dateKey);
          return (
            <DayColumn
              key={dateKey}
              label={format(d, 'EEE d MMM', { locale: ru })}
              slots={byDay.get(dateKey) ?? []}
            />
          );
        })}
      </div>
    </div>
  );
}
