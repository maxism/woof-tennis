import type { SlotPublic } from '@wooftennis/shared';
import { formatTimeRange } from '@/utils/date';
import { Badge } from '@/components/ui/Badge';
import { SlotStatus } from '@wooftennis/shared';
import { t } from '@/utils/i18n';

export function SlotCard({ slot }: { slot: SlotPublic }) {
  const tone =
    slot.status === SlotStatus.Cancelled
      ? 'danger'
      : slot.status === SlotStatus.Available
        ? 'success'
        : 'neutral';
  return (
    <div className="rounded-xl border border-woof-border bg-tg-secondary-bg/30 px-3 py-2 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-tg-text">
          {formatTimeRange(slot.startTime, slot.endTime)}
        </span>
        <Badge tone={tone}>{slot.status}</Badge>
      </div>
      <p className="text-xs text-tg-hint">{slot.location.name}</p>
      {slot.hasSplitOpen ? (
        <p className="mt-1 text-xs text-woof-warn">{t('slot', 'splitOpen')}</p>
      ) : null}
    </div>
  );
}
