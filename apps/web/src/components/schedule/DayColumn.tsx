import type { SlotPublic } from '@wooftennis/shared';
import { SlotCard } from './SlotCard';

export function DayColumn({
  label,
  slots,
}: {
  label: string;
  slots: SlotPublic[];
}) {
  return (
    <div className="flex min-w-[140px] flex-col gap-2">
      <p className="text-center text-xs font-semibold text-tg-hint">{label}</p>
      {slots.length === 0 ? (
        <p className="text-center text-xs text-tg-hint">—</p>
      ) : (
        slots.map((s) => <SlotCard key={s.id} slot={s} />)
      )}
    </div>
  );
}
