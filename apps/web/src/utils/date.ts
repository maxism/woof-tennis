import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

export function formatSlotDate(isoDate: string): string {
  try {
    return format(parseISO(isoDate), 'd MMMM, EEEEEE', { locale: ru });
  } catch {
    return isoDate;
  }
}

export function formatTimeRange(start: string, end: string): string {
  return `${start.slice(0, 5)}–${end.slice(0, 5)}`;
}
