import type { PlaySession } from '@wooftennis/shared';
import { Card } from '@/components/ui/Card';
import { formatSlotDate, formatTimeRange } from '@/utils/date';

export function SessionCard({ session }: { session: PlaySession }) {
  const end = session.endTime ?? session.startTime;
  return (
    <Card>
      <p className="font-medium text-tg-text">{formatSlotDate(session.date)}</p>
      <p className="text-sm text-tg-hint">
        {formatTimeRange(session.startTime, end)} · {session.locationText}
      </p>
    </Card>
  );
}
