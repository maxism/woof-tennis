import type { EventItem } from '@wooftennis/shared';
import { getLocationColor, STATUS_CONFIG, fmtTime, fmtDuration } from '@/utils/eventColors';

interface Props {
  event: EventItem;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: Props) {
  const locationColor = getLocationColor(event.locationId);
  const status = STATUS_CONFIG[event.status];
  const startTime = fmtTime(event.startsAt);
  const endTime = fmtTime(event.endsAt);
  const duration = fmtDuration(event.startsAt, event.endsAt);

  const isCancelled =
    event.status === 'cancelled' || event.status === 'declined';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!onClick}
      className={[
        'flex w-full overflow-hidden rounded-2xl border border-woof-border text-left',
        'bg-tg-secondary-bg transition-all duration-150',
        onClick ? 'active:scale-[0.98] active:brightness-95' : '',
        isCancelled ? 'opacity-50' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Left colour strip — encodes location */}
      <div
        className="w-[3.5px] flex-shrink-0"
        style={{ backgroundColor: locationColor }}
      />

      {/* Main content */}
      <div className="flex flex-1 items-center gap-3 px-3 py-3">
        {/* Time column */}
        <div className="flex w-[52px] flex-shrink-0 flex-col items-start">
          <span className="text-sm font-bold leading-tight text-tg-text">
            {startTime}
          </span>
          <span className="text-xs leading-tight text-tg-hint">{endTime}</span>
        </div>

        {/* Info column */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {/* Location row */}
          <div className="flex items-center gap-1.5">
            <span
              className="mt-px h-2 w-2 flex-shrink-0 rounded-full"
              style={{ backgroundColor: locationColor }}
            />
            <span className="truncate text-sm font-medium leading-tight text-tg-text">
              {event.locationName ?? 'Локация'}
            </span>
          </div>

          {/* Duration + recurring row */}
          <div className="flex items-center gap-2">
            {duration ? (
              <span className="text-xs leading-tight text-tg-hint">{duration}</span>
            ) : null}
            {event.isRecurring ? (
              <span className="flex items-center gap-0.5 rounded-full bg-woof-accent/10 px-1.5 py-px text-[10px] font-semibold text-woof-accent">
                ↺ Повтор
              </span>
            ) : null}
          </div>
        </div>

        {/* Status badge */}
        <span
          className="flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold leading-tight"
          style={{ color: status.color, backgroundColor: status.bg }}
        >
          {status.label}
        </span>
      </div>
    </button>
  );
}
