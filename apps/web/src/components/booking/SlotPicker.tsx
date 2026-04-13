import { useMemo, useState } from 'react';
import { eachDayOfInterval, format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';
import { SlotStatus, type SlotPublic } from '@wooftennis/shared';
import { Badge } from '@/components/ui/Badge';
import { t } from '@/utils/i18n';
import { formatTimeRange } from '@/utils/date';

function slotLabel(slot: SlotPublic): string {
  if (slot.hasSplitOpen) return t('slot', 'splitOpen');
  if (slot.status === SlotStatus.Available && slot.currentBookings < slot.maxPlayers) {
    return t('slot', 'available');
  }
  if (slot.status === SlotStatus.Full || slot.currentBookings >= slot.maxPlayers) {
    return t('slot', 'full');
  }
  if (slot.status === SlotStatus.Booked) return t('slot', 'booked');
  return slot.status;
}

function slotSelectable(slot: SlotPublic): boolean {
  return (
    slot.status === SlotStatus.Available && slot.currentBookings < slot.maxPlayers
  );
}

export function SlotPicker({
  slots,
  onSelect,
  selectedId,
}: {
  slots: SlotPublic[];
  onSelect: (slot: SlotPublic) => void;
  selectedId: string | null;
}) {
  const [dayKey, setDayKey] = useState<string | null>(null);

  const days = useMemo(() => {
    if (!slots.length) return [];
    const sorted = [...slots].sort(
      (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime),
    );
    const first = parseISO(sorted[0].date);
    const last = parseISO(sorted[sorted.length - 1].date);
    return eachDayOfInterval({ start: first, end: last });
  }, [slots]);

  const activeDay =
    dayKey ??
    (days[0] ? format(days[0], 'yyyy-MM-dd') : null);

  const slotsForDay = useMemo(() => {
    if (!activeDay) return [];
    return slots.filter((s) => s.date === activeDay);
  }, [slots, activeDay]);

  if (!slots.length) {
    return <p className="text-center text-sm text-tg-hint">{t('common', 'empty')}</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="-mx-1 flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => {
          const key = format(d, 'yyyy-MM-dd');
          const active = key === activeDay;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setDayKey(key)}
              className={`shrink-0 rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                active
                  ? 'border-woof-accent bg-woof-accent/10 font-semibold text-woof-accent'
                  : 'border-woof-border bg-tg-secondary-bg/40 text-tg-text'
              }`}
            >
              <div>{format(d, 'EEE', { locale: ru })}</div>
              <div className="text-xs text-tg-hint">{format(d, 'd MMM', { locale: ru })}</div>
            </button>
          );
        })}
      </div>
      <ul className="flex flex-col gap-2">
        {slotsForDay.map((slot) => {
          const sel = slotSelectable(slot);
          const picked = selectedId === slot.id;
          return (
            <li key={slot.id}>
              <button
                type="button"
                disabled={!sel}
                onClick={() => sel && onSelect(slot)}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition-colors ${
                  picked
                    ? 'border-woof-accent bg-woof-accent/10'
                    : 'border-woof-border bg-tg-secondary-bg/30'
                } ${!sel ? 'opacity-50' : ''}`}
              >
                <div>
                  <p className="font-medium text-tg-text">
                    {formatTimeRange(slot.startTime, slot.endTime)}
                  </p>
                  <p className="text-xs text-tg-hint">{slot.location.name}</p>
                </div>
                <Badge tone={sel ? 'accent' : 'neutral'}>{slotLabel(slot)}</Badge>
              </button>
            </li>
          );
        })}
      </ul>
      {selectedId ? (
        <p className="text-center text-xs text-tg-hint">
          {t('booking', 'book')} — MainButton (Telegram)
        </p>
      ) : null}
    </div>
  );
}
