import { EventStatus } from '@wooftennis/shared';

// Eight muted-but-vivid colours that work on both light and dark Telegram themes.
// Assigned deterministically from locationId so the same court always gets the same colour.
const LOCATION_PALETTE = [
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#f59e0b', // amber
  '#ef4444', // red
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#f97316', // orange
  '#14b8a6', // teal
] as const;

/** Returns a stable colour hex for a given locationId. */
export function getLocationColor(locationId: string): string {
  let hash = 0;
  for (let i = 0; i < locationId.length; i++) {
    // djb2-style hash — fast, good distribution
    hash = (hash * 31 + locationId.charCodeAt(i)) | 0;
  }
  return LOCATION_PALETTE[Math.abs(hash) % LOCATION_PALETTE.length];
}

export interface StatusConfig {
  label: string;
  color: string;
  /** Lighter background tint for the badge */
  bg: string;
}

export const STATUS_CONFIG: Record<EventStatus, StatusConfig> = {
  [EventStatus.Draft]: {
    label: 'Черновик',
    color: '#9ca3af',
    bg: 'rgba(156,163,175,0.15)',
  },
  [EventStatus.Invited]: {
    label: 'Инвайт',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.15)',
  },
  [EventStatus.Attached]: {
    label: 'Назначен',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.15)',
  },
  [EventStatus.Accepted]: {
    label: 'Принято',
    color: '#10b981',
    bg: 'rgba(16,185,129,0.15)',
  },
  [EventStatus.Declined]: {
    label: 'Отклонено',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.15)',
  },
  [EventStatus.Cancelled]: {
    label: 'Отменено',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.10)',
  },
  [EventStatus.Rescheduled]: {
    label: 'Перенесено',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,0.15)',
  },
  [EventStatus.Completed]: {
    label: 'Завершено',
    color: '#6b7280',
    bg: 'rgba(107,114,128,0.12)',
  },
};

/** Duration between two ISO datetimes as "X ч Y мин" / "X ч" / "Y мин". */
export function fmtDuration(startsAt: string, endsAt: string): string {
  const totalMins = Math.round(
    (new Date(endsAt).getTime() - new Date(startsAt).getTime()) / 60_000,
  );
  if (totalMins <= 0) return '';
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  if (h > 0 && m > 0) return `${h} ч ${m} мин`;
  if (h > 0) return `${h} ч`;
  return `${m} мин`;
}

/** Format ISO datetime to "HH:MM" in local time. */
export function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/** Format ISO datetime to a date key "YYYY-MM-DD" in local time. */
export function toLocalDateKey(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Human-readable date group header. */
export function fmtGroupHeader(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const sameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (sameDay(date, today)) return 'Сегодня';
  if (sameDay(date, tomorrow)) return 'Завтра';

  return date.toLocaleDateString('ru-RU', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}
