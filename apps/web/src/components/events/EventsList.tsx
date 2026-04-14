import type { EventItem } from '@wooftennis/shared';
import { toLocalDateKey, fmtGroupHeader } from '@/utils/eventColors';
import { EventCard } from './EventCard';

interface Props {
  events: EventItem[];
  onEventClick?: (event: EventItem) => void;
}

interface DayGroup {
  dateKey: string;
  header: string;
  events: EventItem[];
}

function groupByDay(events: EventItem[]): DayGroup[] {
  const map = new Map<string, EventItem[]>();

  for (const event of events) {
    const key = toLocalDateKey(event.startsAt);
    const group = map.get(key) ?? [];
    group.push(event);
    map.set(key, group);
  }

  // Map preserves insertion order; events come pre-sorted from API.
  return Array.from(map.entries()).map(([dateKey, dayEvents]) => ({
    dateKey,
    header: fmtGroupHeader(dateKey),
    events: dayEvents,
  }));
}

export function EventsList({ events, onEventClick }: Props) {
  const groups = groupByDay(events);

  return (
    <div className="flex flex-col gap-5">
      {groups.map((group) => (
        <section key={group.dateKey}>
          {/* Day header */}
          <h2 className="mb-2 px-0.5 text-xs font-semibold uppercase tracking-wider text-tg-hint">
            {group.header}
          </h2>

          {/* Cards */}
          <div className="flex flex-col gap-2">
            {group.events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={onEventClick ? () => onEventClick(event) : undefined}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
