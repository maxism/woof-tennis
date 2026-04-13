import type { Notification } from '@wooftennis/shared';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

export function NotificationCard({
  item,
  onMarkRead,
}: {
  item: Notification;
  onMarkRead: (id: string) => void;
}) {
  const relative = formatDistanceToNow(new Date(item.createdAt), {
    addSuffix: true,
    locale: ru,
  });

  return (
    <button
      type="button"
      onClick={() => !item.isRead && onMarkRead(item.id)}
      className={`flex w-full flex-col gap-1 rounded-2xl border px-4 py-3 text-left transition-colors ${
        item.isRead
          ? 'border-woof-border bg-tg-secondary-bg/20'
          : 'border-woof-accent/40 bg-woof-accent/5'
      }`}
    >
      <div className="flex items-start gap-2">
        {!item.isRead ? (
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-woof-accent" aria-hidden />
        ) : (
          <span className="w-2 shrink-0" aria-hidden />
        )}
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm ${item.isRead ? 'font-medium text-tg-text' : 'font-semibold text-tg-text'}`}
          >
            {item.title}
          </p>
          <p className="mt-0.5 text-sm text-tg-hint">{item.body}</p>
          <p className="mt-1 text-xs text-tg-hint">{relative}</p>
        </div>
      </div>
    </button>
  );
}
